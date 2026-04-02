---
title: "WPA2/WPA3 Enterprise Attacks"
tags: [pentest, wireless, wpa2-enterprise, wpa3, eap, radius, index]
created: 2026-04-01
---

> [[00-roadmap|00. Roadmap]] · [[fm-field-manual|Field Manual]]

---

## SVG Asset Registry

| File | Lesson | Mô tả |
|------|-------|-------|
| `assets/img-01-8021x-architecture.svg` | [[01-8021x-eap-radius-architecture\|01. 802.1X Architecture]] | Supplicant → AP → RADIUS 3-party auth flow |
| `assets/img-02-eap-methods-tree.svg` | [[02-eap-methods-deep-dive\|02. EAP Methods]] | EAP method taxonomy với attacker cheat sheet |
| `assets/img-04-evil-twin-chain.svg` | [[04-evil-twin-rogue-radius-peap\|04. Evil Twin]] | Evil Twin full attack chain diagram |
| `assets/img-08-karma-pnl-flow.svg` | [[08-karma-known-beacons\|08. KARMA]] | KARMA PNL exploitation flow |

---

## Lessons

| # | Lesson | Type | Tóm tắt |
|---|-------|------|---------|
| 00 | [[00-roadmap\|00. Roadmap]] | — | Lesson map, dependency graph, SVG assets plan |
| 01 | [[01-8021x-eap-radius-architecture\|01. 802.1X/EAP/RADIUS Architecture]] | F | Kiến trúc 3-party, EAPOL, RADIUS protocol, 4-way handshake variant |
| 02 | [[02-eap-methods-deep-dive\|02. EAP Methods Deep-Dive]] | F | PEAP, EAP-TTLS, EAP-TLS, EAP-GTC, EAP-PWD — outer/inner auth, attack surface |
| 03 | [[03-wireless-recon-eap-fingerprinting\|03. Wireless Recon & EAP Fingerprinting]] | A | airodump-ng, Wireshark EAP analysis, EAP type fingerprinting từ pcap |
| 04 | [[04-evil-twin-rogue-radius-peap\|04. Evil Twin: Rogue RADIUS + PEAP Hash Capture]] | A | Core attack: hostapd-wpe, eaphammer, deauth, NetNTLMv1 capture, hashcat -m 5500 |
| 05 | [[05-eap-downgrade-gtc-cleartext\|05. EAP Downgrade: GTC Cleartext Capture]] | A | Force EAP-GTC negotiation → cleartext password harvest |
| 06 | [[06-eap-ttls-pap-attack\|06. EAP-TTLS/PAP: Cleartext via Inner Auth]] | A | TTLS inner auth PAP = cleartext; hostapd-mana/berate_ap setup |
| 07 | [[07-eaphammer-toolkit\|07. EAPHammer Toolkit Mastery]] | T | cert-wizard, --creds, --eap-spray, --captive-portal, autocrack |
| 08 | [[08-karma-known-beacons\|08. KARMA & Known Beacons Attack]] | A | PNL exploitation, passive probing, known beacons, eaphammer KARMA mode |
| 09 | [[09-wpa3-eap-pwd-owe\|09. WPA3 Enterprise: EAP-PWD & OWE Attacks]] | A | EAP-PWD dragonblood, SAE/OWE misconfigs, WPA3 enterprise downgrade |
| 10 | [[10-post-exploitation-credential-reuse\|10. Post-Exploitation: Credential Reuse & Lateral Movement]] | A | Domain cred reuse, SMB/WinRM access, BloodHound, internal pivot |
| FM | [[fm-field-manual\|Field Manual]] | Ref | Tài liệu tra cứu nhanh tích lũy từ tất cả lessons |

---

## Attack Techniques Covered

| Technique | Lesson | Difficulty |
|-----------|-------|-----------|
| EAP Fingerprinting từ pcap | [[03-wireless-recon-eap-fingerprinting\|03]] | Medium |
| Evil Twin + Rogue RADIUS (PEAP) | [[04-evil-twin-rogue-radius-peap\|04]] | High |
| NetNTLMv1 Hash Crack (mode 5500) | [[04-evil-twin-rogue-radius-peap\|04]] | Medium |
| EAP-GTC Downgrade (cleartext) | [[05-eap-downgrade-gtc-cleartext\|05]] | High |
| EAP-TTLS/PAP Cleartext Capture | [[06-eap-ttls-pap-attack\|06]] | High |
| EAP Spray (online brute force) | [[07-eaphammer-toolkit\|07]] | Medium |
| KARMA / Known Beacons | [[08-karma-known-beacons\|08]] | High |
| WPA3 EAP-PWD Side-Channel | [[09-wpa3-eap-pwd-owe\|09]] | Expert |
| Domain Credential Reuse | [[10-post-exploitation-credential-reuse\|10]] | Medium |

---

## Tools Covered

| Tool | Purpose | Lesson |
|------|---------|-------|
| airodump-ng | Wireless recon, EAP capture | [[03-wireless-recon-eap-fingerprinting\|03]] |
| aireplay-ng | Deauthentication attack | [[04-evil-twin-rogue-radius-peap\|04]] |
| hostapd-wpe | Rogue RADIUS server (WPE patch) | [[04-evil-twin-rogue-radius-peap\|04]] |
| eaphammer | All-in-one evil twin toolkit | [[07-eaphammer-toolkit\|07]] |
| hostapd-mana / berate_ap | Alternative rogue AP | [[06-eap-ttls-pap-attack\|06]] |
| hashcat | NetNTLMv1 crack (mode 5500) | [[04-evil-twin-rogue-radius-peap\|04]] |
| asleap | LEAP/PEAP hash cracker | [[04-evil-twin-rogue-radius-peap\|04]] |
| Wireshark | EAP packet analysis | [[03-wireless-recon-eap-fingerprinting\|03]] |
| crackmapexec / netexec | Credential validation + lateral movement | [[10-post-exploitation-credential-reuse\|10]] |

---

*Index cập nhật sau mỗi lesson được generate.*
