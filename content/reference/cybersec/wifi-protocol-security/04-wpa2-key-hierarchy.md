---
title: "04. WPA2 Key Hierarchy: PMK → PTK → GTK Derivation"
type: foundation
tags: [pentest, wifi, wireless, wpa2, pmk, ptk, gtk, cryptography, foundation, lesson-04]
aliases: [WPA2 Key Hierarchy]
created: 2026-04-01
---

> **Prerequisites**: [[03-wpa-tkip|03. WPA/TKIP: Michael Algorithm & Per-Packet Key Mixing]]
> **Objectives**:
> - Hiểu toàn bộ key hierarchy của WPA2 từ passphrase đến session keys
> - Phân tích PBKDF2 derivation và tại sao nó vẫn vulnerable với offline attack
> - Nắm PTK layout (KCK/KEK/TK) và vai trò của từng component
> - Hiểu GMK → GTK hierarchy và Hole196 vulnerability
> - Thấy điểm tấn công: PMKID derivation

---

## Động lực

Key hierarchy của WPA2 là trái tim của toàn bộ WiFi security. Hiểu nó là hiểu tại sao:
- Capture handshake cho phép offline crack password
- PMKID có thể extract mà không cần bất kỳ client nào kết nối
- Tất cả clients share GTK → insider threat có thể forge broadcast
- WPA3 cần thay đổi cơ bản ở bước đầu tiên (PMK derivation)

---

## Kiến trúc & Cơ chế

### Tổng quan Key Derivation Tree

![[img-04-key-hierarchy.svg]]
*Hình 1: WPA2 complete key derivation — từ Passphrase đến KCK/KEK/TK (unicast) và GTK (broadcast)*

Key hierarchy WPA2 có hai nhánh song song: **Pairwise** (unicast giữa STA và AP) và **Group** (multicast/broadcast).

### Pairwise Key Chain: Passphrase → PMK

**Bước 1: PBKDF2 — Passphrase thành PSK/PMK**

```text
PMK = PBKDF2(HMAC-SHA1, Passphrase, SSID, c=4096, dkLen=256)
```text
Các tham số:
- **HMAC-SHA1**: PRF dùng trong PBKDF2
- **Passphrase**: 8–63 ký tự ASCII, xử lý theo OpaqueString profile
- **SSID**: network name — đóng vai trò salt. Mục đích: ngăn rainbow table chung cho tất cả networks
- **c = 4096**: số lần iteration — tăng cost của brute-force
- **dkLen = 256**: output 256 bits = 32 bytes

> [!warning] Tại sao WPA2-PSK vẫn vulnerable với offline attack
> PMK được derive từ (Passphrase, SSID) — cả hai đều fixed trong suốt session. Khi attacker capture 4-way handshake, họ có: ANonce, SNonce, AA (AP MAC), SPA (STA MAC). Với những giá trị này, attacker có thể:
> 1. Thử một passphrase candidate P
> 2. Tính PMK = PBKDF2(HMAC-SHA1, P, SSID, 4096, 256)
> 3. Tính PTK = PRF-512(PMK, ...)
> 4. Verify MIC trong handshake message 2
> 5. Nếu MIC đúng → P là password đúng
> 4096 iterations làm mỗi attempt chậm hơn, nhưng GPU có thể test hàng trăm nghìn passwords/giây.
>
**Bước 2: PMK trong WPA2-Enterprise**

Với Enterprise, PMK không derive từ password. Thay vào đó:
- Client và RADIUS server chạy EAP authentication
- EAP session tạo ra Master Session Key (MSK)
- PMK = MSK[0:32] (256 bits đầu của MSK)
- PMK được RADIUS server gửi cho AP qua RADIUS Access-Accept

→ PMK unique cho mỗi user, không biết passphrase → không thể offline crack từ handshake.

### Pairwise Key Chain: PMK → PTK

PTK được derive từ PMK cộng với 4 giá trị trao đổi trong 4-way handshake:

```text
PTK = PRF-X(PMK, "Pairwise key expansion",
            Min(AA, SPA) ‖ Max(AA, SPA) ‖ Min(ANonce, SNonce) ‖ Max(ANonce, SNonce))
```text
Trong đó:
- **AA**: Authenticator Address (AP MAC)
- **SPA**: Supplicant Address (STA MAC)
- **ANonce**: Nonce random do AP tạo (32 bytes)
- **SNonce**: Nonce random do STA tạo (32 bytes)
- **Min/Max**: đảm bảo cả hai phía tính cùng thứ tự, bất kể ai gửi trước
- **X = 512** cho CCMP (hoặc 384 cho một số config)

PRF (Pseudo-Random Function) trong 802.11:
```text
PRF(K, A, B) = HMAC-SHA1(K, A ‖ 0x00 ‖ B ‖ i) cho i=0,1,2,...
Concatenate outputs cho đến đủ bits
```text
> [!note] Tại sao dùng 4 giá trị này?
> ANonce và SNonce đảm bảo PTK khác nhau mỗi session, ngay cả khi PMK không đổi. MAC addresses bind PTK vào connection cụ thể — MitM không thể relay PTK sang connection khác.
>
### PTK Layout — Anatomy

PTK là concatenation của các sub-keys:

```text
PTK (384 bits cho CCMP-128):
┌─────────────────────────────────────────────────────────────────┐
│ KCK (128 bits) │ KEK (128 bits) │ TK (128 bits)                │
│  bits 0–127    │  bits 128–255  │  bits 256–383                │
└─────────────────────────────────────────────────────────────────┘

PTK (512 bits cho TKIP):
┌──────────┬──────────┬──────────┬─────────────────────────────────┐
│ KCK 128b │ KEK 128b │ TK 128b  │ MIC Tx 64b │ MIC Rx 64b       │
└──────────┴──────────┴──────────┴─────────────────────────────────┘
```text
| Sub-key | Bits | Mục đích |
|---------|------|---------|
| **KCK** (Key Confirmation Key) | 128 | Tính MIC trong 4-way handshake frames (verify handshake integrity) |
| **KEK** (Key Encryption Key) | 128 | Mã hóa GTK khi AP gửi xuống STA trong Message 3 |
| **TK** (Temporal Key) | 128 | Mã hóa và integrity check của actual data frames (CCMP) |
| MIC Tx | 64 | TKIP only: MIC key cho transmitting direction |
| MIC Rx | 64 | TKIP only: MIC key cho receiving direction |

> [!tip] Điểm tấn công
> KCK là field cần verify khi brute-forcing: tính MIC từ KCK, so với MIC trong handshake message 2. Nếu match → password đúng. hashcat mode 22000 (EAPOL handshake) và 22001 (PMKID) đều implement check này.
>
### Group Key Chain: GMK → GTK

Nhánh group key quản lý broadcast/multicast:

```text
GMK (Group Master Key):
- AP tạo ngẫu nhiên (128-bit)
- Không bao giờ transmitted

GTK = PRF-128(GMK, "Group key expansion", AA ‖ GNonce)
   GNonce: AP-generated random nonce
```text
GTK được AP gửi xuống mọi STA đang kết nối (encrypted bằng KEK trong Message 3 của 4-way handshake). Tất cả STA trong cùng BSS share GTK.

**GTK rotation**: AP renew GTK khi:
- STA rời mạng (security: STA không giải mã multicast sau khi rời)
- Timer expire (periodic rotation)
- GTK compromise detected

Renewal thông qua **Group Key Handshake** (2-way):
```text
AP → STA: EAPOL-Key (GTK, encrypted với KEK, MIC với KCK)
STA → AP: EAPOL-Key (ACK)
```text
### PMKID — Cơ chế và Attack Vector

PMKID là một identifier được include trong EAPOL frame đầu tiên (Message 1 của 4-way handshake):

```text
PMKID = HMAC-SHA1-128(PMK, "PMK Name" ‖ AA ‖ SPA)
```text
Trong đó "PMK Name" là literal ASCII string, AA là AP MAC, SPA là STA MAC.

> [!warning] PMKID Attack Surface
> AP include PMKID trong Message 1 để cho phép STA tìm cached PMK nhanh (PMKSA caching). Nhưng PMKID chứa HMAC của PMK! Attacker không cần chờ full handshake:
> 1. Gửi Association Request → AP gửi EAPOL Message 1 (có PMKID)
> 2. Capture PMKID
> 3. Brute-force: với password candidate P → PMK → verify PMKID
> 4. Hoàn toàn clientless — không cần STA thực sự kết nối
> Đây là nền tảng của attack trong Lesson 06.
>
### Hole196 — GTK Insider Attack

Vì tất cả STA share cùng GTK, một STA đã authenticated có thể:
1. Tạo broadcast frame với nội dung tùy ý
2. Mã hóa bằng GTK
3. Gửi broadcast
4. Tất cả STA khác decrypt và tin tưởng (vì MIC valid)

Attacker có thể:
- ARP poison tất cả clients trong BSS đồng thời
- DNS spoofing broadcast
- Forge broadcast traffic

Đây là **Hole196** — CVE được document trong Wi-Fi Alliance. Mitigation: client isolation (AP không forward broadcast giữa clients).

---

## Góc nhìn kẻ tấn công

| Attack Surface | Lesson | Cần gì |
|---------------|--------|-------|
| Offline password crack từ handshake | [[05-four-way-handshake\|05. 4-Way HS]] + [[06-pmkid-attack\|06. PMKID]] | Capture handshake/PMKID |
| PMKID clientless capture | [[06-pmkid-attack\|06. PMKID]] | Chỉ cần 1 EAPOL frame |
| Hole196 broadcast forge | Insider knowledge | GTK + network access |

---

## Pentest Checklist

```text
□ Xác nhận WPA2-PSK (AUTH=PSK trong airodump-ng)
□ Capture PMKID: hcxdumptool → ngay cả không có clients
□ Capture 4-way handshake: deauth + wait reconnect
□ Verify SSID (dùng làm salt trong PBKDF2) — case-sensitive
□ WPA2-Enterprise: không thể offline crack → khác attack surface
□ Check GTK rotation policy nếu có network access
```text
---

## Kết nối

```mermaid
flowchart TD
    L04[04. WPA2 Key Hierarchy] --> L05[05. 4-Way Handshake]
    L04 --> L06[06. PMKID Attack]
    L04 --> L07[07. Enterprise/EAP]
    L04 --> L10[10. SAE/Dragonfly]
    PMK[PMK = weak point] --> CRACK[Offline dictionary attack]
    GTK[GTK = shared] --> H196[Hole196 insider]
```text