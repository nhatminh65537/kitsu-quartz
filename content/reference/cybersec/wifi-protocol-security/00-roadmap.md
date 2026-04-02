---
title: "00. Roadmap"
tags: [pentest, wifi, wireless, roadmap]
type: roadmap
created: 2026-04-01
---

> **Course**: WiFi Protocol Security Architecture & Controlled Attack Surface
> **Scope**: Toàn bộ kiến trúc giao thức 802.11 ở mức cryptographic — nền tảng lý thuyết cho mọi WiFi attack
> **Depth**: Advanced / Research-oriented (cryptographic primitives)
> **Lab**: HTB (Wifinetic, WifineticTwo) · Local VM (hostapd, wpa_supplicant)
> **Estimated sessions**: 1–2 sessions × 5 lessons

---

## SVG Assets Plan

| SVG File | Lesson | Mô tả | Priority |
|----------|--------|-------|---------|
| `assets/img-01-frame-structure.svg` | [[01-frame-architecture\|01. Frame Architecture]] | 802.11 MAC frame layout với tất cả fields annotated | H |
| `assets/img-02-wep-rc4-flow.svg` | [[02-wep-internals\|02. WEP Internals]] | RC4 KSA → PRGA → XOR encryption pipeline + IV concat | H |
| `assets/img-04-key-hierarchy.svg` | [[04-wpa2-key-hierarchy\|04. WPA2 Key Hierarchy]] | PMK → PTK → GTK derivation tree với PRF functions | H |
| `assets/img-08-wps-protocol.svg` | [[08-wps-pixiedust\|08. WPS & Pixie Dust]] | WPS M1–M8 message exchange + Pixie Dust injection point | H |
| `assets/img-10-dragonfly.svg` | [[10-sae-dragonfly\|10. SAE/Dragonfly]] | Dragonfly commit/confirm phases với EC point operations | H |

**Priority**: H = Cần thiết cho hiểu cơ chế · M = Tăng clarity · L = Nice-to-have

---

## Lesson Map

| # | Tên Lesson | Type | Phụ thuộc | Ước tính |
|---|-----------|------|-----------|---------|
| 01 | [[01-frame-architecture\|01. 802.11 Frame Architecture & State Machine]] | F | — | 1 session |
| 02 | [[02-wep-internals\|02. WEP Internals: RC4, IV Space & CRC-32 Failure]] | F | 01 | 1 session |
| 03 | [[03-wpa-tkip\|03. WPA/TKIP: Michael Algorithm & Per-Packet Key Mixing]] | F | 02 | 1 session |
| 04 | [[04-wpa2-key-hierarchy\|04. WPA2 Key Hierarchy: PMK → PTK → GTK Derivation]] | F | 03 | 1 session |
| 05 | [[05-four-way-handshake\|05. 4-Way Handshake & Group Key Handshake Mechanics]] | F | 04 | 1 session |
| 06 | [[06-pmkid-attack\|06. PMKID: Clientless PMK Fingerprinting]] | A | 04, 05 | 1 session |
| 07 | [[07-enterprise-eap\|07. WPA2-Enterprise & 802.1X/EAP Authentication]] | F | 04 | 1 session |
| 08 | [[08-wps-pixiedust\|08. WPS PIN Protocol & Pixie Dust Attack]] | H | 01 | 1 session |
| 09 | [[09-management-frame-protection\|09. 802.11w Management Frame Protection]] | F | 05 | 1 session |
| 10 | [[10-sae-dragonfly\|10. SAE/Dragonfly Key Exchange: WPA3-Personal Internals]] | F | 04, 09 | 1 session |
| FM | [[fm-field-manual\|Field Manual]] | — | Tích lũy | — |

**Type legend**: F = Foundation · A = Attack · T = Tool · H = Hybrid

---

## Dependency Graph

```mermaid
flowchart TD
    L01[01. 802.11 Frame Architecture<br>Type: F] --> L02[02. WEP Internals<br>Type: F]
    L02 --> L03[03. WPA/TKIP<br>Type: F]
    L03 --> L04[04. WPA2 Key Hierarchy<br>Type: F]
    L04 --> L05[05. 4-Way Handshake<br>Type: F]
    L05 --> L06[06. PMKID Attack<br>Type: A]
    L04 --> L06
    L04 --> L07[07. WPA2-Enterprise/EAP<br>Type: F]
    L01 --> L08[08. WPS + Pixie Dust<br>Type: H]
    L05 --> L09[09. 802.11w MFP<br>Type: F]
    L04 --> L10[10. SAE/Dragonfly<br>Type: F]
    L09 --> L10
```text
---

## Phase Breakdown

### Phase 1 — Frame & Crypto Foundation (Lessons 01–03)
**Mục tiêu**: Hiểu kiến trúc 802.11, tại sao WEP và WPA/TKIP thất bại ở mức cryptographic
**Lab**: Không cần lab thực hành — đọc + phân tích packet capture trong Wireshark

### Phase 2 — WPA2 Key Lifecycle (Lessons 04–05)
**Mục tiêu**: Master PMK/PTK/GTK derivation, EAPOL-Key frame internals
**Lab**: Local VM với hostapd + wpa_supplicant, capture + phân tích 4-way handshake

### Phase 3 — Attack Surface (Lessons 06–08)
**Mục tiêu**: Thực hành 3 attack vectors cụ thể — PMKID, WPS Pixie Dust
**Lab**: HTB Wifinetic (WPS brute-force) · HTB WifineticTwo (Pixie Dust)

### Phase 4 — Modern Defenses (Lessons 09–10)
**Mục tiêu**: Hiểu 802.11w MFP và WPA3 SAE — tại sao chúng bảo vệ được gì và giới hạn của chúng
**Lab**: Local VM với hostapd WPA3 config

---

## Progress Tracker

- [ ] 01. 802.11 Frame Architecture & State Machine
- [ ] 02. WEP Internals: RC4, IV Space & CRC-32 Failure
- [ ] 03. WPA/TKIP: Michael Algorithm & Per-Packet Key Mixing
- [ ] 04. WPA2 Key Hierarchy: PMK → PTK → GTK Derivation
- [ ] 05. 4-Way Handshake & Group Key Handshake Mechanics
- [ ] 06. PMKID: Clientless PMK Fingerprinting
- [ ] 07. WPA2-Enterprise & 802.1X/EAP Authentication
- [ ] 08. WPS PIN Protocol & Pixie Dust Attack
- [ ] 09. 802.11w Management Frame Protection
- [ ] 10. SAE/Dragonfly Key Exchange: WPA3-Personal Internals
- [ ] Field Manual complete

---

## Appendices

| File | Nội dung |
|------|---------|
| [[fm-field-manual\|Field Manual]] | Tài liệu tra cứu thực chiến — tích lũy từ tất cả lessons |

---

## Study Notes

*Ghi chú thêm của người học — cập nhật trong quá trình học*
