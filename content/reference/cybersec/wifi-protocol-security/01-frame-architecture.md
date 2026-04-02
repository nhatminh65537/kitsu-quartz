---
title: "01. 802.11 Frame Architecture & State Machine"
type: foundation
tags: [pentest, wifi, wireless, 802.11, frames, foundation, lesson-01]
aliases: [802.11 Frame Architecture]
created: 2026-04-01
---

> **Prerequisites**: Không có — đây là lesson đầu tiên
> **Objectives**:
> - Nắm vững 3 loại frame 802.11 và vai trò của từng loại trong attack surface
> - Hiểu cấu trúc MAC header và ý nghĩa từng field từ góc độ attacker
> - Phân tích state machine kết nối STA — AP
> - Xác định frame nào không được bảo vệ và có thể bị forge

---

## Động lực

Mọi WiFi attack đều diễn ra ở layer 2 — tầng MAC của 802.11. Hiểu frame structure là nền tảng không thể bỏ qua: deauthentication attacks, beacon spoofing, PMKID capture, KRACK — tất cả đều thao tác trực tiếp trên 802.11 frames.

Không hiểu frame types = không hiểu tại sao deauth attack hoạt động mà không cần authentication = không thể thiết kế attack hay debug khi lab không như mong đợi.

---

## Kiến trúc & Cơ chế

### Tổng quan cấu trúc frame 802.11

![[img-01-frame-structure.svg]]
*Hình 1: 802.11 MAC frame — general structure, Frame Control field breakdown, và station state machine*

Mỗi 802.11 frame gồm ba phần chính: MAC Header, Frame Body (payload), và FCS (Frame Check Sequence). MAC Header chứa toàn bộ thông tin điều khiển layer 2.

### Frame Control Field — 2 bytes

Frame Control là 2 byte đầu tiên của mọi 802.11 frame. Đây là field quan trọng nhất vì nó xác định loại frame và cách xử lý nó.

| Bit field | Kích thước | Ý nghĩa |
|-----------|-----------|---------|
| Protocol Version | 2 bits | Luôn = 0 trong 802.11 hiện tại |
| **Type** | 2 bits | 00=Management, 01=Control, 10=Data |
| **Subtype** | 4 bits | Xác định chi tiết loại trong từng Type |
| To DS | 1 bit | Frame đang đi về phía Distribution System |
| From DS | 1 bit | Frame xuất phát từ Distribution System |
| More Fragments | 1 bit | Frame bị phân mảnh, còn tiếp |
| Retry | 1 bit | Frame đang được retransmit |
| Power Management | 1 bit | STA đang vào sleep mode |
| More Data | 1 bit | AP còn buffered data cho STA đang ngủ |
| **Protected Frame** | 1 bit | Frame body được mã hóa (WEP/TKIP/CCMP) |
| Order | 1 bit | Strict order delivery (hiếm dùng) |

> [!info] Protected Frame bit (bit 14)
> Bit này — còn gọi là WEP bit — báo hiệu rằng Frame Body đã được mã hóa. Với WEP: set khi dùng WEP. Với WPA2/CCMP: set trong data frames. Management frames thường KHÔNG set bit này, đó là lý do chúng có thể bị forge.
>
### Ba loại frame và attack surface của chúng

**Management Frames (Type = 00)**

Management frames kiểm soát vòng đời kết nối. Quan trọng nhất:

| Subtype | Tên frame | Mục đích |
|---------|----------|---------|
| 0x08 | Beacon | AP broadcast sự tồn tại + capabilities |
| 0x04 | Probe Request | STA tìm kiếm AP |
| 0x05 | Probe Response | AP trả lời probe |
| 0x0B | Authentication | Bắt đầu authentication (State 1 → 2) |
| 0x0C | Deauthentication | Ngắt kết nối (reset về State 1) |
| 0x00 | Association Request | STA yêu cầu kết nối vào BSS |
| 0x01 | Association Response | AP chấp nhận/từ chối |
| 0x0A | Disassociation | Kết thúc association (về State 2) |

> [!warning] Management frames không có authentication mặc định
> Trước 802.11w (PMF), tất cả management frames đều không được ký và không được mã hóa. Attacker có thể forge bất kỳ management frame nào — đặc biệt Deauth và Disassoc — để kick clients khỏi mạng. Đây là cơ chế hoạt động của aireplay-ng -0.
>
**Control Frames (Type = 01)**

Control frames điều khiển luồng transmission. Quan trọng trong WiFi pentest:

| Subtype | Tên | Vai trò |
|---------|-----|---------|
| 0x0B | RTS | Request to Send — tránh collision |
| 0x0C | CTS | Clear to Send |
| 0x0D | ACK | Acknowledgment layer 2 |
| 0x08 | Block ACK | Aggregate ACK cho nhiều frames |

Control frames ít bị tấn công trực tiếp hơn management frames, nhưng hiểu luồng RTS/CTS giúp phân tích traffic trong monitor mode.

**Data Frames (Type = 10)**

Data frames mang payload thực sự (IP packets, ARP, DHCP...). Protected Frame bit phải được set khi WPA2/WPA3 đang dùng:

| Subtype | Tên | Ý nghĩa |
|---------|-----|---------|
| 0x00 | Data | Frame data cơ bản |
| 0x04 | Null | Không có data, chỉ báo power state |
| 0x08 | QoS Data | Data với Quality of Service |
| 0x0C | QoS Null | QoS power management |

### MAC Header Addressing — 4 địa chỉ

802.11 MAC header có thể chứa đến 4 địa chỉ MAC, phụ thuộc vào To DS / From DS bits:

| To DS | From DS | Addr1 | Addr2 | Addr3 | Addr4 |
|-------|---------|-------|-------|-------|-------|
| 0 | 0 | DA | SA | BSSID | — |
| 0 | 1 | DA | BSSID | SA | — |
| 1 | 0 | BSSID | SA | DA | — |
| 1 | 1 | RA | TA | DA | SA |

> [!info] Giải thích các địa chỉ
> **DA** (Destination Address): Đích cuối cùng của frame.
> **SA** (Source Address): Nguồn gốc tạo ra frame.
> **BSSID**: MAC của AP — định danh BSS.
> **RA** (Receiver Address): Máy nhận trực tiếp (wireless hop).
> **TA** (Transmitter Address): Máy truyền trực tiếp.
> Với WDS (Wireless Distribution System), cả 4 địa chỉ được dùng (To DS=1, From DS=1).
>
### Station Connection State Machine

Một STA trải qua 3 trạng thái để kết nối vào AP:

```text
State 1: Unauthenticated + Unassociated
    ↓  [Authentication frame exchange]
State 2: Authenticated + Unassociated
    ↓  [Association Request/Response]
State 3: Authenticated + Associated  ← data flow bắt đầu ở đây
```text
Transition ngược lại:
- **Deauthentication** (từ AP hoặc STA): → State 1 (mất cả authentication lẫn association)
- **Disassociation** (từ AP hoặc STA): → State 2 (giữ authentication, mất association)

> [!warning] Lỗ hổng state machine
> Không có gì ngăn attacker gửi forged Deauth/Disassoc frame đến STA. STA nhận frame → lập tức chuyển về State 1 → ngắt kết nối → phải reconnect → exposing 4-way handshake. Đây là nền tảng của handshake capture attack và evil twin preparation.
>
### Beacon Frame Structure (chi tiết)

Beacon là frame quan trọng nhất cho reconnaissance. AP broadcast beacon mỗi 100ms (TIM interval):

```text
Beacon Body:
├── Timestamp (8 bytes)          — thời gian AP, sync TSF
├── Beacon Interval (2 bytes)    — khoảng cách giữa 2 beacon (units: 1024μs)
├── Capability Info (2 bytes)    — ESS/IBSS, Privacy bit, short preamble...
└── Tagged Parameters (variable):
    ├── SSID element (tag 0)
    ├── Supported Rates (tag 1)
    ├── DS Parameter Set (tag 3) — channel number
    ├── RSN Information (tag 48) — WPA2/WPA3 capabilities, cipher suites, AKM
    ├── HT/VHT/HE Capabilities   — 802.11n/ac/ax
    └── Vendor Specific (tag 221) — WPA (tag 0xDD + OUI 00:50:F2:01)
```text
> [!tip] RSN Information element
> Đây là field quan trọng nhất cho WiFi security analysis. RSN (Robust Security Network) information element chứa: Group Cipher Suite (GTK encryption), Pairwise Cipher Suite (PTK encryption), AKM Suite (authentication method: PSK vs Enterprise vs SAE), và RSN Capabilities (PMF status). Wireshark filter: `wlan.tag.number == 48`.
>
---

## Góc nhìn kẻ tấn công

| Frame | Attack liên quan | Tool |
|-------|-----------------|------|
| Deauth (0x0C) | Kick clients → capture handshake | `aireplay-ng -0` |
| Beacon | SSID enumeration, rogueAP spoofing | `airodump-ng`, `hostapd-wpe` |
| Probe Request | Track devices theo MAC | `airodump-ng` |
| Authentication | Observe auth method (open vs shared key) | Wireshark |
| EAPOL (trong Data) | Capture WPA2 handshake + PMKID | `hcxdumptool` |
| Association Resp | Đọc RSN IE → cipher suites | Wireshark |

---

## Pentest Checklist

Khi enumerate một WiFi target trong engagement:

```text
□ Bật monitor mode: airmon-ng start wlan0
□ Scan tất cả APs: airodump-ng wlan0mon
□ Với mỗi AP ghi lại: BSSID, Channel, ENC (WEP/WPA/WPA2/WPA3), CIPHER, AUTH
□ Kiểm tra WPS: wash -i wlan0mon (look for "WPS Locked: No")
□ Đọc RSN IE trong beacon: Wireshark → wlan.tag.number == 48
□ Xác định PMF status: RSN Capabilities bits 6-7 (00=Disabled, 01=Capable, 11=Required)
□ Note tất cả clients đang kết nối (để deauth sau nếu cần handshake)
□ Kiểm tra SSID ẩn (probe requests leak SSID)
```text
---

## Kết nối

Lesson này là điểm xuất phát cho toàn bộ series:

```mermaid
flowchart LR
    L01[01. Frame Architecture] --> L02[02. WEP Internals]
    L01 --> L08[08. WPS + Pixie Dust]
    L02 --> L03[03. WPA/TKIP]
    L03 --> L04[04. WPA2 Key Hierarchy]
    L04 --> L05[05. 4-Way Handshake]
    L05 --> L06[06. PMKID Attack]
    L05 --> L09[09. 802.11w MFP]
    L04 --> L10[10. SAE/Dragonfly]
```text