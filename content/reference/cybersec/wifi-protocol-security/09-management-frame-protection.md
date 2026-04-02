---
title: "09. 802.11w Management Frame Protection (MFP)"
type: foundation
tags: [pentest, wifi, wireless, 802.11w, pmf, mfp, management-frames, foundation, lesson-09]
aliases: [Management Frame Protection, 802.11w MFP]
created: 2026-04-01
---

> **Prerequisites**: [[05-four-way-handshake|05. 4-Way Handshake & Group Key Handshake Mechanics]]
> **Objectives**:
> - Hiểu tại sao management frames không được bảo vệ là vấn đề nghiêm trọng
> - Phân tích cơ chế MFP — IGTK, BIP, SA Query protocol
> - Nắm giới hạn của 802.11w — những gì nó không bảo vệ được
> - Hiểu PMF negotiation trong RSN Capabilities và tầm quan trọng với WPA3

---

## Động lực

Deauthentication flood là kỹ thuật tấn công WiFi cơ bản nhất. Nó hoạt động vì một lý do đơn giản: trước 802.11w, không ai ký management frames. AP và STA đều chấp nhận deauth/disassoc từ bất kỳ ai.

802.11w giải quyết vấn đề này, nhưng chỉ một phần — và hiểu đúng scope của nó là quan trọng để không overestimate protection level.

---

## Kiến trúc & Cơ chế

### Vấn đề: Unauthenticated Management Frames

Trước 802.11w, attacker có thể:

```bash
# Forge deauth frame từ AP đến client — kick client khỏi mạng
aireplay-ng -0 100 -a <AP_BSSID> -c <CLIENT_MAC> wlan0mon

# Hoặc broadcast deauth — kick tất cả clients cùng lúc
aireplay-ng -0 100 -a <AP_BSSID> wlan0mon
```text
Client nhận deauth frame → lập tức về State 1 → ngắt connection → phải reconnect → exposing handshake cho capture.

Không có cách nào để verify frame có thực sự từ AP hay không — frame chỉ cần có đúng BSSID trong source address.

### 802.11w — Protected Management Frames (PMF)

**Phạm vi bảo vệ** (Robust Management Frames — được bảo vệ):
- Deauthentication (0x0C)
- Disassociation (0x0A)
- Action frames (0x0D) trong một số categories: Block ACK, SA Query, FILS...

**Không được bảo vệ** bởi 802.11w (pre-association):
- Probe Request/Response
- Beacon frames
- Authentication frames (dùng để bắt đầu association — trước khi có keys)
- Association Request/Response

> [!note] Giới hạn quan trọng
> 802.11w chỉ bảo vệ frames sau khi STA đã associated và có keys từ 4-way handshake. Pre-association frames (Beacon, Probe, Authentication, Association) vẫn không được bảo vệ. Attacker vẫn có thể beacon flood, probe response spoof, và fake auth frames.
>
### Key Infrastructure cho MFP

802.11w thêm hai key mới vào key hierarchy:

**IGTK (Integrity Group Temporal Key)**:
- 128-bit key dùng cho **broadcast/multicast** management frames
- Distributed tới STA trong EAPOL Message 3 (cùng với GTK)
- Sử dụng CMAC-AES-128 cho tính toán MIC

**BIGTK (Beacon Integrity Group Temporal Key)** — thêm trong 802.11be:
- Bảo vệ Beacon frames (feature mới hơn, chưa phổ biến)

**IGTK Derivation:**
```text
IGTK = random (128-bit, generated bởi AP)
IGTK được include trong EAPOL-Key Message 3, encrypted bằng KEK
```text
**PTK với MFP enabled:**
```text
Unicast mgmt frames: sử dụng TK (same as data) với CCMP
Broadcast mgmt frames: sử dụng IGTK với BIP
```text
### BIP — Broadcast Integrity Protocol

BIP (CMAC-AES-128 based) protect broadcast/multicast management frames:

```text
MIC computation:
input = MMIE_template ‖ Frame_Header ‖ Frame_Body
   - MMIE_template: Management MIC Information Element với MIC field zeroed
MIC = AES-128-CMAC(IGTK, input)[0:8]   # 8 bytes (64-bit)
MIC được đặt vào MMIE (Management MIC IE) appended vào frame
```text
**MMIE (Management MIC Information Element):**
```text
Element ID: 0xCE (206)
Length: 16
Key ID: 2 bytes  ← IGTK key index
IPN: 6 bytes     ← Integrity Protocol Number (monotonic counter, anti-replay)
MIC: 8 bytes     ← AES-CMAC truncated
```text
Receiver verify: tính lại MIC → compare với MMIE MIC. Nếu không match → discard.

### CCMP bảo vệ Unicast Management Frames

Unicast deauth/disassoc giữa AP và STA cụ thể được protect bằng CCMP (cùng key TK như data frames):

```text
Protected Deauth frame:
- Frame Control: Protected Frame bit = 1
- CCMP header: 8 bytes (PN, KeyID)
- Encrypted body: deauth reason code
- CCMP MIC: 8 bytes
```text
Receiver chỉ chấp nhận protected deauth nếu:
1. Protected Frame bit = 1
2. CCMP MIC verify thành công
3. PN (Packet Number) > last seen PN (anti-replay)

### SA Query Protocol

Khi STA nhận unprotected deauth/disassoc (sau khi PMF negotiated), nó không ngắt connection ngay. Thay vào đó, STA chạy SA Query protocol:

```mermaid
sequenceDiagram
    participant Attacker
    participant STA
    participant AP
    Attacker->>STA: Forged Deauth (unprotected, source=AP)
    Note over STA: PMF negotiated → không chấp nhận unprotected deauth
    STA->>AP: SA Query Request (protected, với Transaction ID)
    AP->>STA: SA Query Response (protected, same Transaction ID)
    Note over STA: Response received → SA còn valid → ignore forged deauth
```text
Nếu không có SA Query Response trong timeout:
- STA consider SA compromised → disassociate tự nguyện
- Re-associate với AP để establish new SA

### PMF Negotiation trong RSN Capabilities

RSN Information Element trong Beacon/Association frames chứa PMF negotiation bits:

```text
RSN Capabilities (2 bytes):
Bit 6: MFPR (Management Frame Protection Required)
       0 = PMF không bắt buộc, 1 = PMF bắt buộc
Bit 7: MFPC (Management Frame Protection Capable)
       0 = không support PMF, 1 = support PMF
```text
| AP setting | STA setting | Kết quả |
|-----------|------------|---------|
| MFPC=1, MFPR=0 (Optional) | MFPC=1 | PMF negotiated |
| MFPC=1, MFPR=0 (Optional) | MFPC=0 | Kết nối không có PMF |
| MFPC=1, MFPR=1 (Required) | MFPC=0 | Connection refused |
| MFPC=1, MFPR=1 (Required) | MFPC=1 | PMF required |

> [!tip] WPA3 và PMF
> WPA3-Personal (SAE) **yêu cầu** MFPR=1 — PMF là mandatory. Điều này ngăn hoàn toàn deauth-based handshake capture attack. Kẻ tấn công không thể force STA reconnect bằng forged deauth nữa.
>
### GTK và IGTK trong EAPOL Message 3

Khi PMF enabled, EAPOL Message 3 từ AP chứa cả GTK lẫn IGTK:

```text
Key Data trong Message 3:
├── GTK KDE (Key Data Encapsulation)
│   Type: 0xDD 00-0F-AC 01
│   Data: GTK (encrypted với KEK)
└── IGTK KDE
    Type: 0xDD 00-0F-AC 09
    Data: KeyID ‖ IPN ‖ IGTK (encrypted với KEK)
```text
---

## Góc nhìn kẻ tấn công

### Khi nào deauth attack còn hoạt động?

```text
PMF không enable (MFPC=0): deauth attack work hoàn toàn
PMF optional (MFPC=1, MFPR=0):
  - Với clients không support PMF: deauth work
  - Với clients có PMF: bị SA Query block
PMF required (MFPC=1, MFPR=1): deauth attack thất bại hoàn toàn
  - Nhưng: Beacon flood, probe spoofing vẫn work (pre-assoc frames)
  - Dragon Drain (WPA3): flood SAE commits → DoS AP's CPU
```text
### Kiểm tra PMF status

```bash
# Trong airodump-ng: không có indicator rõ ràng
# Wireshark: filter beacon, xem RSN IE, bits 6-7 của RSN Capabilities

# Từ command line:
iw dev wlan0 scan | grep -A 30 "SSID: TargetAP" | grep -i "RSN"

# Python scapy (nếu cần parse RSN IE):
# from scapy.all import *
# pkts = rdpcap("beacon.pcap")
# rsn = pkts[0][Dot11Elt::]  # traverse elements
```text
### WPA2 với PMF vs WPA3

```text
WPA2 + PMF Optional: most common. Deauth work against legacy clients.
WPA2 + PMF Required: deauth không work nhưng offline crack vẫn possible.
WPA3-SAE + PMF Required: deauth không work VÀ không thể offline crack.
WPA3 Transition Mode: inherit WPA2 weaknesses từ mixed clients.
```text
---

## Pentest Checklist

```text
□ Check RSN Capabilities bits 6-7 trong Beacon frame
□ PMF Optional (MFPC=1, MFPR=0): deauth attack vẫn work với legacy clients
□ PMF Required (MFPR=1): deauth attack thất bại → fallback sang PMKID capture
□ Document PMF status:
   - Disabled: Critical finding (cho WPA2 networks)
   - Optional: Medium finding
   - Required: Good security posture (cho WPA2), nhưng vẫn vulnerable offline crack
□ Test: thử aireplay-ng deauth → nếu client không reconnect → PMF likely enabled
□ Pre-association frames không protected: Beacon/Probe spoofing vẫn possible
```text
---

## Kết nối

```mermaid
flowchart LR
    L09[09. 802.11w MFP] --> L10[10. SAE/Dragonfly]
    L09 -->|MFPR=1 required in| WPA3[WPA3-SAE]
    L09 -->|Ngăn| DEAUTH[Deauth attack]
    L09 -->|Không ngăn| PRE[Pre-assoc spoofing]
    L09 -->|Không ngăn| OFFLINE[Offline password crack]
```text