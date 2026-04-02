---
title: "00. Roadmap"
type: roadmap
tags: [pentest, wireless, wpa2, roadmap]
created: 2026-04-01
---

> **Course**: WPA2-Personal Attacks — Handshake, PMKID & WPS Exploitation
> **Scope**: Toàn bộ attack surface của WPA2-Personal: cryptographic foundations, handshake capture, PMKID clientless attack, offline cracking pipeline, WPS Pixie Dust & PIN brute force, KRACK key reinstallation, TKIP MIC failure exploitation
> **Depth**: Advanced — hiểu sâu crypto internals, tự viết exploit
> **Lab**: HTB (Wifinetic, WifineticTwo) · Local VM (Kali + mac80211_hwsim)
> **Estimated sessions**: 2 sessions × ~4–5 lessons

---

## SVG Assets Plan

| SVG File | Lesson | Mô tả | Priority |
|----------|--------|-------|---------|
| `assets/img-01-wpa2-key-hierarchy.svg` | [[01-wpa2-cryptographic-foundations\|01. WPA2 Crypto Foundations]] | PMK→PTK derivation chain, 4-way handshake message flow | H |
| `assets/img-02-80211-frame-structure.svg` | [[02-80211-frame-monitor-mode\|02. 802.11 Frame & Monitor Mode]] | 802.11 MPDU frame layout với EAPOL fields được highlight | H |
| `assets/img-04-pmkid-flow.svg` | [[04-pmkid-clientless-attack\|04. PMKID Clientless Attack]] | RSN IE extraction + HMAC-SHA1 PMKID computation | M |
| `assets/img-06-wps-handshake.svg` | [[06-wps-pixie-dust-attack\|06. WPS Pixie Dust Attack]] | WPS M1–M7 exchange với Pixie Dust intercept points (E-S1/E-S2) | H |
| `assets/img-08-krack-nonce-reuse.svg` | [[08-krack-key-reinstallation\|08. KRACK Attack]] | Msg3 replay → nonce reset → keystream reuse attack chain | H |

**Priority**: H = Cần thiết cho hiểu cơ chế · M = Tăng clarity · L = Nice-to-have

---

## Lesson Map

| # | Tên Lesson | Type | Phụ thuộc | Ước tính |
|---|-----------|------|----------|---------|
| 01 | [[01-wpa2-cryptographic-foundations\|01. WPA2-Personal Cryptographic Foundations]] | F | — | 1 session |
| 02 | [[02-80211-frame-monitor-mode\|02. 802.11 Frame Structure & Monitor Mode]] | F | — | 1 session |
| 03 | [[03-4way-handshake-capture\|03. 4-Way Handshake Capture]] | A | 01, 02 | 1 session |
| 04 | [[04-pmkid-clientless-attack\|04. PMKID Clientless Attack]] | A | 01 | 1 session |
| 05 | [[05-offline-cracking-pipeline\|05. Offline Cracking Pipeline]] | A | 03, 04 | 1 session |
| 06 | [[06-wps-pixie-dust-attack\|06. WPS Pixie Dust Attack]] | A | 01 | 1 session |
| 07 | [[07-wps-pin-bruteforce\|07. WPS PIN Brute Force & Rate Limit Bypass]] | A | 06 | 1 session |
| 08 | [[08-krack-key-reinstallation\|08. KRACK — Key Reinstallation Attack]] | A | 01 | 1 session |
| 09 | [[09-tkip-mic-failure\|09. TKIP MIC Failure Exploitation]] | A | 01, 08 | 1 session |
| FM | [[fm-field-manual\|Field Manual]] | — | Tích lũy | — |

**Type legend**: F = Foundation · A = Attack · T = Tool · M = Methodology · H = Hybrid

---

## Dependency Graph

```mermaid
flowchart TD
    L01[01. WPA2 Crypto Foundations<br>Type: F] --> L03[03. 4-Way Handshake Capture<br>Type: A]
    L02[02. 802.11 Frame & Monitor Mode<br>Type: F] --> L03
    L01 --> L04[04. PMKID Clientless Attack<br>Type: A]
    L03 --> L05[05. Offline Cracking Pipeline<br>Type: A]
    L04 --> L05
    L01 --> L06[06. WPS Pixie Dust Attack<br>Type: A]
    L06 --> L07[07. WPS PIN Brute Force<br>Type: A]
    L01 --> L08[08. KRACK Key Reinstallation<br>Type: A]
    L08 --> L09[09. TKIP MIC Failure<br>Type: A]
```bash

---

## Phase Breakdown

### Phase 1 — Cryptographic Foundations
**Lessons**: 01–02
**Mục tiêu**: Hiểu sâu cơ chế crypto của WPA2 — key derivation, frame structure, monitor mode
**Lab**: Không cần lab — đọc và hiểu conceptually, có thể dùng Wireshark để observe

### Phase 2 — Handshake & PMKID Attacks
**Lessons**: 03–05
**Mục tiêu**: Capture handshake (passive + deauth), PMKID clientless, toàn bộ offline cracking pipeline
**Lab**: HTB Academy "Attacking WPA/WPA2" · Local VM với hostapd + mac80211_hwsim

### Phase 3 — WPS Exploitation
**Lessons**: 06–07
**Mục tiêu**: Pixie Dust attack (offline nonce crack), PIN brute force với rate limit bypass
**Lab**: HTB Wifinetic · HTB WifineticTwo

### Phase 4 — Protocol-Level Attacks
**Lessons**: 08–09
**Mục tiêu**: KRACK nonce reuse, TKIP MIC failure — tấn công ở tầng crypto protocol
**Lab**: Local VM (Kali + mac80211_hwsim + wpa_supplicant patched PoC)

---

## Progress Tracker

- [ ] 01. WPA2-Personal Cryptographic Foundations
- [ ] 02. 802.11 Frame Structure & Monitor Mode
- [ ] 03. 4-Way Handshake Capture
- [ ] 04. PMKID Clientless Attack
- [ ] 05. Offline Cracking Pipeline
- [ ] 06. WPS Pixie Dust Attack
- [ ] 07. WPS PIN Brute Force & Rate Limit Bypass
- [ ] 08. KRACK — Key Reinstallation Attack
- [ ] 09. TKIP MIC Failure Exploitation
- [ ] Field Manual complete

---

## Appendices

| File | Nội dung |
|------|---------|
| [[fm-field-manual\|Field Manual]] | Tài liệu tra cứu thực chiến — tích lũy từ tất cả lessons |

---

## Study Notes

*Ghi chú thêm của người học — cập nhật trong quá trình học*
