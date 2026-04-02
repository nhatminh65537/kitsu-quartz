---
title: "WiFi Protocol Security Architecture"
tags: [pentest, wifi, wireless, index]
created: 2026-04-01
---

> [[00-roadmap|00. Roadmap]] · [[fm-field-manual|Field Manual]]

---

## SVG Asset Registry

| File | Lesson | Mô tả |
|------|--------|-------|
| `assets/img-01-frame-structure.svg` | [[01-frame-architecture\|01. Frame Architecture]] | 802.11 MAC frame layout với field annotations |
| `assets/img-02-wep-rc4-flow.svg` | [[02-wep-internals\|02. WEP Internals]] | RC4 KSA → PRGA → XOR encryption pipeline |
| `assets/img-04-key-hierarchy.svg` | [[04-wpa2-key-hierarchy\|04. WPA2 Key Hierarchy]] | PMK → PTK → GTK derivation tree |
| `assets/img-08-wps-protocol.svg` | [[08-wps-pixiedust\|08. WPS & Pixie Dust]] | WPS M1–M8 protocol flow + attack point |
| `assets/img-10-dragonfly.svg` | [[10-sae-dragonfly\|10. SAE/Dragonfly]] | Dragonfly commit/confirm với EC operations |

---

## Lessons

| # | Lesson | Type | Tóm tắt |
|---|--------|------|---------|
| 00 | [[00-roadmap\|00. Roadmap]] | — | Lesson map, SVG plan, dependency graph |
| 01 | [[01-frame-architecture\|01. 802.11 Frame Architecture & State Machine]] | F | 3 loại frame, MAC header anatomy, connection state machine |
| 02 | [[02-wep-internals\|02. WEP Internals: RC4, IV Space & CRC-32 Failure]] | F | RC4 KSA/PRGA, 24-bit IV exhaustion, FMS attack, CRC-32 linearity |
| 03 | [[03-wpa-tkip\|03. WPA/TKIP: Michael Algorithm & Per-Packet Key Mixing]] | F | TKIP improvements, Michael MIC, Beck-Tews attack |
| 04 | [[04-wpa2-key-hierarchy\|04. WPA2 Key Hierarchy: PMK → PTK → GTK]] | F | PBKDF2, PRF-512, PTK layout (KCK/KEK/TK), GTK derivation |
| 05 | [[05-four-way-handshake\|05. 4-Way Handshake & Group Key Handshake]] | F | EAPOL-Key frame structure, ANonce/SNonce, MIC verification |
| 06 | [[06-pmkid-attack\|06. PMKID: Clientless PMK Fingerprinting]] | A | HMAC-SHA1 PMKID formula, hcxdumptool, hashcat mode 22000 |
| 07 | [[07-enterprise-eap\|07. WPA2-Enterprise & 802.1X/EAP Authentication]] | F | EAP-TLS/PEAP/TTLS, RADIUS flow, MSK → PMK, RADIUS MiTM |
| 08 | [[08-wps-pixiedust\|08. WPS PIN Protocol & Pixie Dust Attack]] | H | WPS M1–M8, PIN split flaw, E-S1/E-S2 weak entropy, pixiewps |
| 09 | [[09-management-frame-protection\|09. 802.11w Management Frame Protection]] | F | PMF scope, IGTK, BIP, SA Query, RSN capabilities |
| 10 | [[10-sae-dragonfly\|10. SAE/Dragonfly: WPA3-Personal Internals]] | F | PAKE, commit/confirm phases, PWE derivation, Dragonblood |
| FM | [[fm-field-manual\|Field Manual]] | Ref | Tài liệu tra cứu nhanh tích lũy |

---

## Attack Techniques Covered

| Technique | Lesson | Difficulty |
|-----------|--------|-----------|
| WEP IV Collision / FMS Attack | [[02-wep-internals\|02. WEP Internals]] | Medium |
| WPA/TKIP Beck-Tews Attack | [[03-wpa-tkip\|03. WPA/TKIP]] | Hard |
| PMKID Clientless Capture | [[06-pmkid-attack\|06. PMKID Attack]] | Easy |
| WPS PIN Brute-Force | [[08-wps-pixiedust\|08. WPS & Pixie Dust]] | Easy |
| WPS Pixie Dust (Offline PIN Recovery) | [[08-wps-pixiedust\|08. WPS & Pixie Dust]] | Easy |
| RADIUS Impersonation / PEAP MiTM | [[07-enterprise-eap\|07. WPA2-Enterprise]] | Hard |
| Dragonblood (WPA3 Side-Channel) | [[10-sae-dragonfly\|10. SAE/Dragonfly]] | Hard |

---

## Tools Covered

| Tool | Purpose | Lesson |
|------|---------|--------|
| hcxdumptool | Capture PMKID / EAPOL từ air | [[06-pmkid-attack\|06. PMKID]] |
| hcxtools | Convert captures sang hashcat format | [[06-pmkid-attack\|06. PMKID]] |
| hashcat (mode 22000) | Crack WPA2 handshake + PMKID | [[06-pmkid-attack\|06. PMKID]] |
| reaver / bully | WPS PIN brute-force | [[08-wps-pixiedust\|08. WPS]] |
| pixiewps | Pixie Dust offline PIN recovery | [[08-wps-pixiedust\|08. WPS]] |
| oneshot.py | All-in-one WPS attack tool | [[08-wps-pixiedust\|08. WPS]] |
| hostapd-wpe | Rogue AP với RADIUS MiTM | [[07-enterprise-eap\|07. Enterprise]] |
| aircrack-ng suite | Monitor mode, packet injection | [[01-frame-architecture\|01. Frames]] |

---

*Index cập nhật sau mỗi lesson được generate.*
