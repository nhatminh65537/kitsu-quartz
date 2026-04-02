---
title: "Field Manual"
tags: [pentest, wifi, wireless, field-manual, reference]
created: 2026-04-01
---

> **Mục đích**: Tài liệu tra cứu nhanh trong thi — mỗi lesson thêm một entry.
> **Cách dùng**: Ctrl+F technique name → xem lệnh nhanh, điều kiện, và link về lesson đầy đủ.

---

## WiFi Recon & Enumeration

#### Monitor Mode & Scan
- **Điều kiện**: Card hỗ trợ monitor mode + driver phù hợp (ath9k, ath10k, rtl8812au)
- **Quick command**: `sudo airmon-ng start wlan0`
- **Full flow**: `airmon-ng check kill` → `airmon-ng start wlan0` → `airodump-ng wlan0mon` → note BSSID/CH/ENC
- **Look for**: CIPHER = CCMP, AUTH = PSK (WPA2), AUTH = SAE (WPA3), WPS = Yes
- **Ref**: [[01-frame-architecture|01. Frame Architecture]]

---

## WiFi Protocol Attacks

#### PMKID Capture (Clientless WPA2 Crack)
- **Điều kiện**: AP phải broadcast PMKID trong EAPOL frame 1 (hầu hết AP đều làm)
- **Quick command**: `hcxdumptool -i wlan0mon -o capture.pcapng --enable_status=1`
- **Full flow**: Monitor mode → `hcxdumptool` capture → `hcxpcapngtool capture.pcapng -o hash.hc22000` → `hashcat -m 22000 hash.hc22000 wordlist.txt`
- **Look for**: `FOUND` trong hashcat output → password cracked
- **Ref**: [[06-pmkid-attack|06. PMKID Attack]]

#### WPS PIN Brute-Force
- **Điều kiện**: AP bật WPS (kiểm tra `wash -i wlan0mon`), không có AP rate limiting
- **Quick command**: `reaver -i wlan0mon -b <BSSID> -c <CH> -vv`
- **Full flow**: `wash -i wlan0mon` → note BSSID/CH/WPS Locked → `reaver` hoặc `bully` brute-force
- **Look for**: `WPS PIN: 12345670` → dùng PIN để lấy passphrase
- **Ref**: [[08-wps-pixiedust|08. WPS & Pixie Dust]]

#### WPS Pixie Dust (Offline PIN Recovery)
- **Điều kiện**: AP dùng chipset dễ bị (Ralink, MediaTek, Realtek, Broadcom cũ) — weak E-S1/E-S2 RNG
- **Quick command**: `sudo python3 oneshot.py -i wlan0 -b <BSSID> -K`
- **Full flow**: `oneshot.py` với flag `-K` (pixie dust mode) → capture M1-M8 → pixiewps offline → PIN → passphrase
- **Look for**: `[+] WPS pin: XXXXXXXX` trong vài giây đến vài phút
- **Ref**: [[08-wps-pixiedust|08. WPS & Pixie Dust]]

---

## WiFi Password Cracking

#### Hashcat WPA2 (mode 22000)
- **Điều kiện**: Có file .hc22000 từ hcxtools (PMKID hoặc EAPOL handshake)
- **Quick command**: `hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt`
- **Full flow**: Capture → convert → `hashcat -m 22000 hash.hc22000 wordlist.txt -r best64.rule`
- **Look for**: `hash:password` trong output hoặc `hashcat hash.hc22000 --show`
- **Ref**: [[06-pmkid-attack|06. PMKID Attack]]

---

## Tools Reference

#### hcxdumptool + hcxtools
- **Mục đích**: Capture PMKID và EAPOL handshake, convert sang hashcat format
- **Install**: `sudo apt install hcxdumptool hcxtools`
- **Core commands**: `hcxdumptool -i wlan0mon -o out.pcapng` · `hcxpcapngtool out.pcapng -o hash.hc22000`
- **Ref**: [[06-pmkid-attack|06. PMKID Attack]]

#### reaver / bully / oneshot.py
- **Mục đích**: WPS PIN brute-force và Pixie Dust attack
- **Install**: `sudo apt install reaver bully` · `git clone https://github.com/drygdryg/OneShot`
- **Core commands**: `reaver -i wlan0mon -b BSSID -c CH -vv` · `python3 oneshot.py -i wlan0 -b BSSID -K`
- **Ref**: [[08-wps-pixiedust|08. WPS & Pixie Dust]]

---

*Field Manual được cập nhật tự động sau mỗi lesson. KHÔNG edit thủ công phần trên — chỉ thêm entries vào các sections.*
