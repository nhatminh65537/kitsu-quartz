---
title: "WPA2-Personal Attacks"
tags: [pentest, wireless, wpa2, index]
created: 2026-04-01
---

> [[00-roadmap|00. Roadmap]] · [[fm-field-manual|Field Manual]]

---

## SVG Asset Registry

| File | Lesson | Mô tả |
|------|--------|-------|
| `assets/img-01-wpa2-key-hierarchy.svg` | [[01-wpa2-cryptographic-foundations\|01. WPA2 Crypto Foundations]] | PMK→PTK key derivation chain + 4-way handshake flow |
| `assets/img-02-80211-frame-structure.svg` | [[02-80211-frame-monitor-mode\|02. 802.11 Frame & Monitor Mode]] | 802.11 MPDU frame layout với EAPOL fields |
| `assets/img-04-pmkid-flow.svg` | [[04-pmkid-clientless-attack\|04. PMKID Clientless Attack]] | RSN IE extraction + HMAC-SHA1 PMKID computation |
| `assets/img-06-wps-handshake.svg` | [[06-wps-pixie-dust-attack\|06. WPS Pixie Dust Attack]] | WPS M1–M7 exchange với Pixie Dust intercept points |
| `assets/img-08-krack-nonce-reuse.svg` | [[08-krack-key-reinstallation\|08. KRACK Attack]] | Msg3 replay → nonce reset → keystream reuse |

---

## Lessons

| # | Lesson | Type | Tóm tắt |
|---|--------|------|---------|
| 00 | [[00-roadmap\|00. Roadmap]] | — | Lesson map, SVG plan, dependency graph |
| 01 | [[01-wpa2-cryptographic-foundations\|01. WPA2-Personal Cryptographic Foundations]] | F | PMK/PTK/GTK derivation, PBKDF2-SHA1, 4-way handshake crypto internals |
| 02 | [[02-80211-frame-monitor-mode\|02. 802.11 Frame Structure & Monitor Mode]] | F | MPDU frame layout, EAPOL frames, monitor mode setup, airmon-ng ecosystem |
| 03 | [[03-4way-handshake-capture\|03. 4-Way Handshake Capture]] | A | Passive sniffing + deauth injection với aireplay-ng, handshake validation |
| 04 | [[04-pmkid-clientless-attack\|04. PMKID Clientless Attack]] | A | hcxdumptool clientless PMKID extraction, RSN IE, hcxtools conversion |
| 05 | [[05-offline-cracking-pipeline\|05. Offline Cracking Pipeline]] | A | hashcat -m 22000, rule engineering, wordlist construction, mask attacks |
| 06 | [[06-wps-pixie-dust-attack\|06. WPS Pixie Dust Attack]] | A | WPS M1–M7, E-S1/E-S2 nonce weakness, pixiewps + Reaver/Bully automation |
| 07 | [[07-wps-pin-bruteforce\|07. WPS PIN Brute Force & Rate Limit Bypass]] | A | 11000+1000 PIN split, Reaver online brute force, lock evasion techniques |
| 08 | [[08-krack-key-reinstallation\|08. KRACK — Key Reinstallation Attack]] | A | CVE-2017-13077, Msg3 replay, nonce reset, MitM channel setup |
| 09 | [[09-tkip-mic-failure\|09. TKIP MIC Failure Exploitation]] | A | Michael algorithm weakness, MIC key recovery, chopchop-like decryption |
| FM | [[fm-field-manual\|Field Manual]] | Ref | Quick-reference tích lũy từ tất cả lessons |

---

## Attack Techniques Covered

| Technique | Lesson | Difficulty |
|-----------|--------|-----------|
| Passive handshake capture | [[03-4way-handshake-capture\|03. Handshake Capture]] | Medium |
| Deauth injection (aireplay-ng) | [[03-4way-handshake-capture\|03. Handshake Capture]] | Medium |
| PMKID clientless extraction | [[04-pmkid-clientless-attack\|04. PMKID Attack]] | Medium |
| Offline cracking (hashcat -m 22000) | [[05-offline-cracking-pipeline\|05. Cracking Pipeline]] | Advanced |
| Rule-based & mask attacks | [[05-offline-cracking-pipeline\|05. Cracking Pipeline]] | Advanced |
| WPS Pixie Dust (offline nonce) | [[06-wps-pixie-dust-attack\|06. Pixie Dust]] | Advanced |
| WPS PIN brute force | [[07-wps-pin-bruteforce\|07. WPS PIN BruteForce]] | Medium |
| KRACK key reinstallation | [[08-krack-key-reinstallation\|08. KRACK]] | Advanced |
| TKIP MIC failure exploitation | [[09-tkip-mic-failure\|09. TKIP MIC Failure]] | Advanced |

---

## Tools Covered

| Tool | Purpose | Lesson |
|------|---------|--------|
| airmon-ng | Bật monitor mode | [[02-80211-frame-monitor-mode\|02]] |
| airodump-ng | Passive capture, AP enumeration | [[03-4way-handshake-capture\|03]] |
| aireplay-ng | Deauth injection | [[03-4way-handshake-capture\|03]] |
| hcxdumptool | PMKID + handshake capture (clientless) | [[04-pmkid-clientless-attack\|04]] |
| hcxtools | Convert pcapng → hashcat format | [[04-pmkid-clientless-attack\|04]] |
| hashcat | Offline cracking (-m 22000) | [[05-offline-cracking-pipeline\|05]] |
| Reaver | WPS PIN brute force + Pixie Dust | [[06-wps-pixie-dust-attack\|06]] |
| Bully | WPS alternative tool | [[06-wps-pixie-dust-attack\|06]] |
| pixiewps | Offline WPS nonce cracker | [[06-wps-pixie-dust-attack\|06]] |
| wash | WPS AP scanner | [[07-wps-pin-bruteforce\|07]] |

---

*Index cập nhật sau mỗi lesson được generate.*
