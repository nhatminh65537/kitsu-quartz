---
title: "01. WPA2-Personal Cryptographic Foundations"
type: foundation
tags: [pentest, wireless, wpa2, crypto, foundation, lesson-01]
aliases: [WPA2 Crypto, PMK PTK GTK]
created: 2026-04-01
---

> **Prerequisites**: Kiến thức cơ bản về symmetric encryption và HMAC
> **Objectives**:
> - Hiểu PMK, PTK, GTK được derive như thế nào từ PSK
> - Nắm vững 4-way handshake từ góc độ crypto — tại sao từng message tồn tại
> - Xác định điểm yếu cho phép các attack: Handshake capture, PMKID, KRACK, TKIP MIC
> - Hiểu tại sao WPA2 security phụ thuộc hoàn toàn vào độ mạnh của passphrase

---

## Động lực

WPA2-Personal được thiết kế để bảo vệ wireless traffic, nhưng toàn bộ kiến trúc bảo mật của nó đặt cược vào một điểm duy nhất: **độ mạnh của Pre-Shared Key**. Attacker không cần break AES-256 — họ chỉ cần capture một vài packets và crack offline.

Hiểu được chuỗi key derivation giải thích tại sao:
- Handshake capture đủ để crack PSK offline
- PMKID attack không cần client hiện diện
- KRACK hoạt động mà không cần biết PSK
- TKIP có thể bị forge trong một direction

---

## Kiến trúc & Cơ chế

### Chuỗi Key Derivation: PSK → PMK → PTK

![[img-01-wpa2-key-hierarchy.svg]]
*Hình 1: WPA2-Personal key hierarchy — PSK dẫn đến toàn bộ cây key qua PBKDF2 và PRF-512*

**Bước 1 — PSK (Pre-Shared Key)**

PSK là WiFi password người dùng nhập, được xử lý thành 256-bit key:

```text
PMK = PBKDF2-SHA1(passphrase, SSID, iterations=4096, dkLen=32)
```text

Điều quan trọng: `PMK` **cố định** cho mỗi cặp passphrase+SSID. Nếu SSID là `"HomeNet"` và password là `"password123"`, PMK luôn có cùng giá trị — không đổi giữa các sessions.

**Bước 2 — PTK (Pairwise Transient Key)**

PTK được derive mỗi session từ PMK cộng với 4 giá trị mới:

```text
PTK = PRF-512(PMK, "Pairwise key expansion",
              min(AA, SPA) || max(AA, SPA) ||
              min(ANonce, SNonce) || max(ANonce, SNonce))
```

Trong đó:
- `AA` = Authenticator Address (AP MAC)
- `SPA` = Supplicant Address (Client MAC)
- `ANonce` = 32-byte random nonce do AP generate
- `SNonce` = 32-byte random nonce do Client generate

PTK dài 512 bits, được chia thành:

| Phần | Độ dài | Mục đích |
|------|--------|---------|
| KCK (Key Confirmation Key) | 128 bits | Verify MIC trong Msg2 và Msg3 |
| KEK (Key Encryption Key) | 128 bits | Encrypt GTK trong Msg3 |
| TK (Temporal Key) | 128 hoặc 256 bits | Encrypt/decrypt data frames |

**Bước 3 — GTK (Group Temporal Key)**

GTK dùng cho broadcast/multicast traffic. AP generate một GTK và distribute cho tất cả clients đang kết nối, mã hóa bằng KEK trong Msg3.

### 4-Way Handshake — Crypto Flow Chi Tiết

Handshake phục vụ hai mục đích:
1. **Mutual authentication**: Cả hai bên chứng minh mình biết PMK mà không reveal PMK
2. **Key synchronization**: Đồng bộ PTK và GTK

**Message 1 (AP → Client)**:
```text
AP: ANonce (32 random bytes)
```text
Client nhận ANonce, có đủ thông tin để tính PTK (nó biết PMK, SNonce của mình, cả hai MAC addresses).

**Message 2 (Client → AP)**:
```text
Client: SNonce || MIC
MIC = HMAC-SHA1(KCK, EAPOL_frame)[0:16]
```
AP verify MIC → chứng minh Client biết PMK (vì KCK chỉ derive được từ PMK). AP cũng tính được PTK bây giờ.

**Message 3 (AP → Client)**:
```text
AP: GTK (encrypted với KEK) || MIC
```text
Client verify MIC → install PTK và GTK.

**Message 4 (Client → AP)**:
```text
Client: ACK (encrypted với TK)
```
AP xác nhận Client đã install keys, session bắt đầu.

> [!warning] Điểm yếu then chốt — Offline cracking
> Attacker capture Msg2 sẽ có: `SNonce`, `BSSID`, `Client MAC`, và `MIC`. Với một passphrase candidate `p`:
> 1. Tính `PMK' = PBKDF2(p, SSID, 4096)`
> 2. Tính `PTK' = PRF(PMK', ANonce, SNonce, MACs)`
> 3. Tính `KCK' = PTK'[0:16]`
> 4. Tính `MIC' = HMAC-SHA1(KCK', EAPOL)`
> 5. So sánh `MIC'` với captured `MIC` → nếu match, passphrase đúng
>
> Không cần online access. Không có rate limiting. GPU crack hàng triệu candidates/giây.
>
### PMKID — Clientless Attack Surface

Một số AP gửi PMKID trong RSN Information Element của Msg1 (hoặc Beacon/Association Response):

```text
PMKID = HMAC-SHA1-128(PMK, "PMK Name" || AP_MAC || STA_MAC)
```bash

Vì "PMK Name" là hằng số, AP_MAC và STA_MAC đều observable, PMKID chứa đủ thông tin để verify một PMK candidate — **mà không cần capture full handshake**.

---

## Góc nhìn kẻ tấn công

| Attack | Khai thác điểm gì | Yêu cầu |
|--------|-----------------|---------|
| **Handshake cracking** | MIC computed từ PMK → crack offline | Client phải kết nối / reconnect |
| **PMKID attack** | PMKID = f(PMK) → crack offline | Không cần client |
| **KRACK** | Nonce reuse khi reinstall PTK | MitM position, unpatched client |
| **TKIP MIC failure** | Michael algorithm weak → forge frames | TKIP mode + KRACK nonce reuse |
| **WPS Pixie Dust** | E-S1/E-S2 nonces không random | WPS enabled, vulnerable chipset |

---

## Pentest Checklist

Khi assess một WPA2-Personal network:

```bash
□ Xác nhận encryption: WPA2-CCMP (AES) hay WPA-TKIP? (TKIP = nguy hiểm hơn)
□ Kiểm tra WPS status: wash -i wlan0mon
□ Xác định AP chipset (quan trọng cho Pixie Dust)
□ Capture Beacon frames — extract SSID cho PBKDF2 cracking
□ Check PMKID trong Association Response (RSN IE field)
□ Xem AP có support fast roaming (802.11r)? — PMKID khả năng cao hơn
□ Client OS identification — Android pre-6.0 vulnerable KRACK
```

---

## Kết nối

```mermaid
flowchart LR
    F01[01. WPA2 Crypto<br>Foundation] --> A03[03. Handshake Capture]
    F01 --> A04[04. PMKID Attack]
    F01 --> A06[06. WPS Pixie Dust]
    F01 --> A08[08. KRACK Attack]
    A08 --> A09[09. TKIP MIC Failure]
    A03 --> A05[05. Cracking Pipeline]
    A04 --> A05
```text
