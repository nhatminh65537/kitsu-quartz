---
title: "Rogue AP, Evil Twin & Post-Connection MitM Attacks"
tags: [pentest, wireless, rogue-ap, evil-twin, mitm, index]
created: 2026-04-01
---

> [[00-roadmap|00. Roadmap]] · [[fm-field-manual|Field Manual]]

---

## SVG Asset Registry

| File | Lesson | Mô tả |
|------|-------|-------|
| `assets/img-01-802.11-probe-flow.svg` | [[01-802.11-protocol-internals\|01. 802.11 Protocol Internals]] | Beacon/Probe request/response cycle và Evil Twin connection flow |
| `assets/img-03-evil-twin-topology.svg` | [[03-evil-twin-wpa2-personal\|03. Evil Twin WPA2-Personal]] | Full topology: deauth + rogue AP + captive portal |
| `assets/img-04-karma-mana-flow.svg` | [[04-karma-mana-attacks\|04. Karma & MANA Attacks]] | PNL reconstruction: Karma vs MANA vs Loud mode |
| `assets/img-05-wpa-enterprise-eap-flow.svg` | [[05-evil-twin-wpa-enterprise\|05. Evil Twin WPA-Enterprise]] | PEAP/TTLS tunnel và NTHash capture flow |
| `assets/img-06-arp-mitm-topology.svg` | [[06-post-connection-mitm-arp\|06. Post-Connection MitM — ARP]] | ARP poisoning topology và bettercap commands |

---

## Lessons

| # | Lesson | Type | Tóm tắt |
|---|-------|------|---------|
| 00 | [[00-roadmap\|00. Roadmap]] | — | Lesson map, dependency graph và SVG assets plan |
| 01 | [[01-802.11-protocol-internals\|01. 802.11 Protocol Internals]] | F | Beacon frames, probe request/response, PNL, cơ chế roaming và attack surface |
| 02 | [[02-wireless-lab-setup\|02. Wireless Lab Setup]] | F | Monitor mode, adapter selection, aircrack-ng suite, lab topology |
| 03 | [[03-evil-twin-wpa2-personal\|03. Evil Twin WPA2-Personal]] | A | Deauth + rogue AP + captive portal + credential harvest với hostapd/dnsmasq |
| 04 | [[04-karma-mana-attacks\|04. Karma & MANA Attacks]] | A | PNL exploitation, Karma vs MANA vs Loud mode, Known Beacon attack |
| 05 | [[05-evil-twin-wpa-enterprise\|05. Evil Twin WPA-Enterprise]] | A | hostapd-wpe + EAPHammer, PEAP/TTLS hash capture, EAP downgrade |
| 06 | [[06-post-connection-mitm-arp\|06. Post-Connection MitM — ARP]] | A | ARP spoofing với bettercap, full-duplex poison, traffic interception |
| 07 | [[07-post-connection-mitm-dns-ssl\|07. Post-Connection MitM — DNS & SSL]] | A | DNS spoofing, SSLStrip, HSTS bypass với bettercap caplets |
| 08 | [[08-tool-eaphammer\|08. Tool: EAPHammer]] | T | Toàn bộ EAPHammer workflow: Enterprise attacks, Karma/MANA, cert generation |
| 09 | [[09-tool-bettercap\|09. Tool: Bettercap]] | T | Bettercap interactive shell, modules, caplets, post-connection MitM |
| 10 | [[10-full-wireless-attack-methodology\|10. Full Attack Chain Methodology]] | M | Recon → Rogue AP → Post-Connection → Lateral Movement into AD |
| FM | [[fm-field-manual\|Field Manual]] | Ref | Tài liệu tra cứu nhanh tích lũy từ tất cả lessons |

---

## Attack Techniques Covered

| Technique | Lesson | Difficulty |
|-----------|-------|-----------|
| Evil Twin — Open / WPA2 + Captive Portal | [[03-evil-twin-wpa2-personal\|03]] | Medium |
| Deauthentication Attack (Forced Roaming) | [[03-evil-twin-wpa2-personal\|03]] | Easy |
| KARMA Attack (PNL probe exploitation) | [[04-karma-mana-attacks\|04]] | Medium |
| MANA Attack (PNL reconstruction) | [[04-karma-mana-attacks\|04]] | Advanced |
| Loud MANA + Known Beacon | [[04-karma-mana-attacks\|04]] | Advanced |
| Evil Twin WPA-Enterprise (PEAP/TTLS hash) | [[05-evil-twin-wpa-enterprise\|05]] | Advanced |
| EAP Downgrade Attack | [[05-evil-twin-wpa-enterprise\|05]] | Advanced |
| ARP Spoofing / Poisoning | [[06-post-connection-mitm-arp\|06]] | Medium |
| DNS Spoofing | [[07-post-connection-mitm-dns-ssl\|07]] | Medium |
| SSL Stripping | [[07-post-connection-mitm-dns-ssl\|07]] | Advanced |
| HSTS Bypass (hstshijack) | [[07-post-connection-mitm-dns-ssl\|07]] | Advanced |
| WPA-Enterprise NTHash Cracking | [[05-evil-twin-wpa-enterprise\|05]] | Medium |

---

## Tools Covered

| Tool | Purpose | Lesson |
|------|---------|-------|
| hostapd | Rogue AP creation (WPA2/Enterprise) | [[03-evil-twin-wpa2-personal\|03]], [[05-evil-twin-wpa-enterprise\|05]] |
| hostapd-wpe | Rogue AP + fake RADIUS (WPA-Enterprise) | [[05-evil-twin-wpa-enterprise\|05]] |
| EAPHammer | Enterprise Evil Twin + Karma/MANA automation | [[08-tool-eaphammer\|08]] |
| aircrack-ng suite | Monitor mode, deauth, packet capture | [[02-wireless-lab-setup\|02]] |
| dnsmasq | DHCP + DNS server cho rogue AP | [[03-evil-twin-wpa2-personal\|03]] |
| Bettercap | Post-connection MitM Swiss Army knife | [[09-tool-bettercap\|09]] |
| hashcat | Crack NTHash / MSCHAPv2 offline | [[05-evil-twin-wpa-enterprise\|05]] |
| iptables | NAT routing cho rogue AP | [[03-evil-twin-wpa2-personal\|03]] |
| Fluxion / Airgeddon | Automated Evil Twin frameworks | [[03-evil-twin-wpa2-personal\|03]] |

---

## Quick Reference

```bash
# Monitor mode
sudo airmon-ng check kill && sudo airmon-ng start wlan0

# Scan for targets
sudo airodump-ng wlan0mon

# Deauth target
sudo aireplay-ng --deauth 0 -a <BSSID> wlan0mon

# Start bettercap ARP+DNS spoof
sudo bettercap -iface wlan1 -eval "set arp.spoof.targets TARGET_IP; arp.spoof on; dns.spoof on"

# EAPHammer Enterprise attack
sudo ./eaphammer -i wlan0 --channel 6 --auth wpa-eap --essid "Corp-WiFi" --creds
```

---

*Index cập nhật sau mỗi lesson được generate.*
