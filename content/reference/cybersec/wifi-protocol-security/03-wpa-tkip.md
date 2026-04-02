---
title: "03. WPA/TKIP: Michael Algorithm & Per-Packet Key Mixing"
type: foundation
tags: [pentest, wifi, wireless, wpa, tkip, michael, foundation, lesson-03]
aliases: [WPA TKIP Michael]
created: 2026-04-01
---

> **Prerequisites**: [[02-wep-internals|02. WEP Internals: RC4, IV Space & CRC-32 Failure]]
> **Objectives**:
> - Hiểu WPA/TKIP giải quyết WEP failures như thế nào và tại sao vẫn không đủ
> - Phân tích Michael MIC — thiết kế và điểm yếu của nó
> - Hiểu per-packet key mixing (TTAK) và tại sao nó không cứu được RC4
> - Nắm Beck-Tews attack — khai thác Michael algorithm trong WPA/TKIP

---

## Động lực

WPA/TKIP ra đời năm 2003 như một "emergency patch" cho WEP — thiết kế để chạy trên hardware WEP cũ mà không cần thay card. Điều này có nghĩa TKIP vẫn dùng RC4, nhưng thêm 3 lớp bảo vệ phía trên.

Hiểu TKIP có hai giá trị: (1) Vẫn còn legacy networks dùng TKIP, (2) Failure mode của TKIP dạy ta về Michael algorithm weakness — loại lỗi thiết kế tương tự xuất hiện trong các protocol khác.

---

## Kiến trúc & Cơ chế

### Ba cải tiến của TKIP so với WEP

WPA/TKIP giữ RC4 nhưng thêm 3 layers bảo vệ:

**1. Per-Packet Key Mixing (TTAK)**

Thay vì dùng `IV ‖ Secret Key` làm RC4 seed (dẫn đến weak IVs trong FMS), TKIP tạo một per-packet key (PPK) mới cho mỗi frame:

```text
Phase 1 mixing: TTAK = Phase1(TK, TA)
   TK = Temporal Key (128-bit từ 4-way handshake)
   TA = Transmitter Address (MAC)
   TTAK = per-session intermediate key (80-bit)

Phase 2 mixing: PPK = Phase2(TTAK, TSC)
   TSC = TKIP Sequence Counter (48-bit IV, thay thế 24-bit WEP IV)
   PPK = per-packet key (128-bit)

RC4 input = PPK (128-bit, không còn weak IV relationship)
```text
Phase 1 mixing ngăn FMS attack vì không còn tương quan trực tiếp giữa RC4 input và TK.

**2. Sequence Counter (TSC) — Extended IV**

WEP dùng IV 24-bit. TKIP tăng lên TSC 48-bit (khoảng 2⁴⁸ ≈ 281 nghìn tỷ giá trị). Receiver verify TSC phải tăng dần → ngăn replay attacks.

```text
TSC bits trong TKIP frame:
[IV0 (TSC1)] [IV1 (TSC0)] [IV2 (=00)] [IV3 (KeyID + ExtIV=1)]
[TSC2] [TSC3] [TSC4] [TSC5]   ← 4 bytes Extended IV
```text
TSC tăng dần → receiver reject bất kỳ frame nào có TSC ≤ TSC nhận gần nhất → ngăn ARP replay attack của WEP.

**3. Michael MIC — Message Integrity Code**

Michael thay thế CRC-32 bằng một keyed integrity check:

```text
MIC = Michael(MK, DA ‖ SA ‖ Priority ‖ Plaintext)
   MK = MIC Key (8 bytes) — derived từ PTK
```text
Michael được design để chạy trên hardware WEP cũ (8-bit processors) → ưu tiên tốc độ hơn security. Kết quả: Michael chỉ cung cấp **64-bit security** thay vì 128-bit như HMAC-SHA1.

### Michael Algorithm — Chi tiết và Điểm Yếu

Michael dùng một cấu trúc gọi là "block cipher wannabe":

```text
State: (L, R) = 64-bit
Initialize: L = K_L (lower 32-bit MIC key), R = K_R (upper 32-bit MIC key)

For each 4-byte block M_i of padded message:
    L = L XOR M_i
    (L, R) = B(L, R)    # mixing function

Output: L ‖ R (8 bytes)
```text
Mixing function B:
```text
R = R XOR (L <<< 17)
L = (L + R) mod 2³²
R = R XOR (L XOR (L >>> 3))  # lshift right 3 = logical shift
L = (L + R) mod 2³²
R = R XOR (L <<< 13)
L = (L + R) mod 2³²
R = R XOR (L >>> 10)         # logical shift right 10
L = (L + R) mod 2³²
```text
> [!warning] Michael security claim
> Michael cung cấp xác suất forgery thành công 1/2³² (khoảng 1 trong 4 tỷ) cho adversary không biết MIC key. Với 64-bit output, brute force cần 2³² attempts. Đây là ngưỡng vừa đủ — nhưng không có margin an toàn.
>
### Beck-Tews Attack (2008)

Martin Beck và Erik Tews phát hiện cách khai thác Michael kết hợp với TKIP TSC để decrypt ARP packets và inject forged frames.

**Điều kiện**: AP phải support IEEE 802.11e (QoS) — hầu hết AP đều support.

**Cơ chế:**

```text
Bước 1: Capture một TKIP-encrypted ARP request
   - ARP format biết trước → plaintext likely 28 bytes
   - Đoán 12 bytes đầu của keystream từ ARP header structure

Bước 2: Recover 12 bytes keystream cuối bằng bit-flip + MIC error exploit
   - Thay đổi byte trong ciphertext → receiver decrypt
   - Nếu Michael MIC fail → AP gửi TKIP MIC failure report
   - TKIP có countermeasure: 2 MIC failures trong 60s → AP disable TKIP 60s (rekey)
   - Nhưng attacker chỉ cần 1 failure → học thêm 1 byte keystream
   - 1 byte/60s → recover 12 bytes trong ~15 phút

Bước 3: Dùng recovered keystream để inject forged packets
   - Tạo ARP packet với nội dung tùy ý
   - Mã hóa bằng keystream đã biết
   - Gửi vào network → AP forward
```text
> [!warning] Tại sao TKIP bị deprecated
> Beck-Tews không recover passphrase nhưng cho phép inject packets và perform port scan. Wi-Fi Alliance deprecated TKIP năm 2012. WPA3 hoàn toàn cấm TKIP. Môi trường enterprise không được dùng WPA/TKIP trong bất kỳ trường hợp nào.
>
### CCMP/AES — Giải pháp thực sự (WPA2)

WPA2 thay thế toàn bộ RC4+Michael bằng CCMP (Counter Mode with Cipher Block Chaining Message Authentication Code Protocol):

| Feature | WEP | WPA/TKIP | WPA2/CCMP |
|---------|-----|---------|----------|
| Cipher | RC4 | RC4 | AES |
| Key length | 40/104-bit | 128-bit TK | 128-bit TK |
| IV size | 24-bit | 48-bit TSC | 48-bit PN |
| Integrity | CRC-32 (linear) | Michael MIC (64-bit) | AES-CBC-MAC (64-bit trong CCMP, 128-bit có thể) |
| Key mixing | IV ‖ Key | Phase1/Phase2 TTAK | — (AES ctr mode, không cần) |
| Replay protection | Không | TSC monotonic | PN monotonic |

CCMP mode:
- **Confidentiality**: AES-CTR mode mã hóa payload
- **Integrity**: AES-CBC-MAC tính MIC trên header + payload
- **Một key duy nhất** cho cả hai — TK từ PTK

---

## Góc nhìn kẻ tấn công

Trong engagement hiện đại, gặp TKIP:

| Scenario | Action |
|----------|--------|
| AP chỉ support TKIP (WPA-only) | Beck-Tews attack (nếu 802.11e enabled) |
| AP support TKIP + CCMP mixed | Client có thể bị force về TKIP |
| AP support WPA2/CCMP only | Không vulnerable, move to 4-way handshake attacks |

> [!tip] Kiểm tra TKIP trong engagement
> `airodump-ng` hiển thị CIPHER column: TKIP = vulnerable. CCMP = không vulnerable qua TKIP attacks. Nếu thấy TKIP, document ngay là Medium severity finding — recommend disable TKIP, enable CCMP only.
>
---

## Pentest Checklist

```text
□ Xác định CIPHER = TKIP trong airodump-ng output
□ Kiểm tra AP có WPA mixed mode (TKIP + CCMP) không
□ Nếu TKIP: document là finding, recommend CCMP-only
□ Beck-Tews attack: xác nhận AP support QoS (802.11e)
□ TKIP countermeasure: 2 MIC failures trong 60s → AP rekey → chú ý khi test
□ Legacy WPA (no WPA2): recommend upgrade hardware
```text
---

## Kết nối

```mermaid
flowchart LR
    L03[03. WPA/TKIP] --> L04[04. WPA2 Key Hierarchy]
    L03 -->|RC4 vẫn dùng| ATK1[Beck-Tews attack]
    L03 -->|Michael MIC| ATK2[Forgery + injection]
    L04 -->|CCMP/AES replaces| L03
```text