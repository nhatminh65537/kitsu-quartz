---
title: "02. WEP Internals: RC4, IV Space & CRC-32 Failure"
type: foundation
tags: [pentest, wifi, wireless, wep, rc4, cryptography, foundation, lesson-02]
aliases: [WEP Internals]
created: 2026-04-01
---

> **Prerequisites**: [[01-frame-architecture|01. 802.11 Frame Architecture & State Machine]]
> **Objectives**:
> - Hiểu RC4 KSA và PRGA ở mức algorithmic
> - Phân tích tại sao IV 24-bit là không đủ và gây ra keystream reuse
> - Hiểu lỗ hổng CRC-32 linearity — tại sao integrity check của WEP không có giá trị cryptographic
> - Hiểu Fluhrer-Mantin-Shamir (FMS) attack — cơ chế khai thác weak IVs để recover key

---

## Động lực

WEP là ví dụ giáo khoa về "cách dùng đúng thuật toán nhưng sai context". RC4 không phải thuật toán tệ — SSL/TLS đã dùng RC4 thành công. Vấn đề nằm ở cách WEP sử dụng RC4 trong môi trường wireless, đặc biệt:

1. Reuse key seed (IV ‖ Key) do IV space quá nhỏ
2. Dùng CRC-32 (không phải HMAC) làm integrity check
3. Transmit IV trong cleartext

Nghiên cứu WEP failures là bài học cryptographic engineering quan trọng nhất trong WiFi security — các lỗi tương tự xuất hiện lại ở TKIP và thậm chí trong implementation bugs của WPA2.

---

## Kiến trúc & Cơ chế

### RC4 — Stream Cipher Cơ bản

RC4 là stream cipher hoạt động theo 2 phase:

**Phase 1 — KSA (Key Scheduling Algorithm)**

KSA khởi tạo một permutation array S[256] từ key:

```python
# RC4 KSA
def ksa(key):
    S = list(range(256))
    j = 0
    for i in range(256):
        j = (j + S[i] + key[i % len(key)]) % 256
        S[i], S[j] = S[j], S[i]  # swap
    return S
```text
KSA tạo ra một permutation của {0..255} phụ thuộc vào key. Với WEP, key input = IV (3 bytes) ‖ Secret Key (5 hoặc 13 bytes).

**Phase 2 — PRGA (Pseudo-Random Generation Algorithm)**

PRGA sinh keystream byte-by-byte từ state S:

```python
# RC4 PRGA
def prga(S):
    i, j = 0, 0
    while True:
        i = (i + 1) % 256
        j = (j + S[i]) % 256
        S[i], S[j] = S[j], S[i]
        yield S[(S[i] + S[j]) % 256]  # output byte
```text
Mỗi lần gọi, PRGA sinh một byte keystream. Frame data được XOR với keystream:
`Ciphertext = Plaintext XOR Keystream`

> [!info] Tính chất quan trọng của stream cipher
> Stream cipher có tính chất: nếu dùng cùng keystream để mã hóa hai plaintexts P1 và P2:
> `C1 XOR C2 = P1 XOR P2`
> Kẻ tấn công biết C1 và C2 (capture được) sẽ tính được XOR của hai plaintext. Nếu biết một trong hai (ví dụ IP header thường có pattern cố định), có thể recover cái còn lại.
>
### WEP Encryption Pipeline

![[img-02-wep-rc4-flow.svg]]
*Hình 1: WEP encryption pipeline — RC4 KSA→PRGA→XOR + CRC-32 integrity check với tất cả điểm yếu*

**Quá trình mã hóa:**

```text
1. Chọn IV ngẫu nhiên 24-bit (khuyến nghị, không bắt buộc)
2. Ghép: Seed = IV (3 bytes) ‖ Secret Key (5 hoặc 13 bytes)
3. RC4 KSA → khởi tạo S từ Seed
4. CRC-32(Plaintext) → ICV (4 bytes)
5. RC4 PRGA → sinh keystream KS có độ dài (len(Plaintext) + 4) bytes
6. Ciphertext = (Plaintext ‖ ICV) XOR KS
7. Frame on wire: [802.11 Header] [IV (3B)] [KeyIndex (1B)] [Ciphertext] [FCS]
```text
**Quá trình giải mã (receiver):**

```text
1. Đọc IV từ cleartext header
2. Seed = IV ‖ SecretKey (receiver biết SecretKey)
3. RC4(Seed) → sinh cùng keystream KS
4. Plaintext ‖ ICV = Ciphertext XOR KS
5. Verify: CRC-32(Plaintext) == ICV?
6. Nếu match → accept, nếu không → discard
```text
### Lỗ hổng 1: IV Space Exhaustion

IV có 24 bits → tối đa 2²⁴ = 16,777,216 giá trị. Trên một busy AP:

- Tốc độ truyền 11 Mbps, gói 1500 bytes: khoảng 916 gói/giây
- Thời gian để dùng hết IV space: 16,777,216 / 916 ≈ 18,315 giây ≈ **5 giờ**
- Khi hết, IV wrap về 0 → same (IV, Key) seed → cùng keystream

Tệ hơn: chuẩn không bắt buộc IV phải random — nhiều implementation tăng IV tuần tự từ 0, gây reuse nhanh hơn nhiều.

> [!warning] Keystream Reuse Attack
> Nếu attacker thu thập hai ciphertext C1 và C2 được mã hóa với cùng IV (cùng keystream KS):
> `C1 XOR C2 = (P1 XOR KS) XOR (P2 XOR KS) = P1 XOR P2`
> Từ P1 XOR P2, dùng cribing (known plaintext như IP header, ARP pattern) để recover P1 và P2.
>
### Lỗ hổng 2: CRC-32 Linearity — Bit-Flip Attack

CRC-32 là linear function. Nghĩa là:
`CRC-32(A XOR B) = CRC-32(A) XOR CRC-32(B)`

Hệ quả nguy hiểm: attacker có thể **modify ciphertext mà không biết key** và tạo ra ICV hợp lệ cho plaintext đã bị thay đổi:

```text
Bước 1: Attacker có Ciphertext C = Plaintext XOR KS
Bước 2: Attacker muốn thay đổi bit n trong Plaintext
Bước 3: Tạo delta mask D với bit n = 1
Bước 4: C' = C XOR (D ‖ CRC-32(D))
Kết quả: Receiver decrypt C' → P' = P XOR D với ICV hợp lệ!
```text
Điều này có nghĩa: WEP không cung cấp **data integrity** thực sự. CRC-32 chỉ detect lỗi ngẫu nhiên, không phải tấn công chủ ý. HMAC (sử dụng secret key) mới cung cấp integrity thực sự — WPA2 đã sửa điều này với Michael MIC, sau đó CCMP/AES-CBC-MAC.

> [!example] ARP Injection Attack
> Attacker biết plaintext của ARP request (do ARP format cố định). Capture encrypted ARP → có keystream cho frame đó → modify ARP → inject → AP retransmit (decrypt → encrypt với fresh IV) → attacker learn more keystream. Đây là ARP replay attack của aireplay-ng -3.
>
### Lỗ hổng 3: FMS Attack — Weak IV Key Recovery

Năm 2001, Fluhrer, Mantin, và Shamir phát hiện WEP sử dụng một subset các IV gọi là **weak IVs** có tính chất rò rỉ thông tin về key bytes.

**Cơ chế FMS:**

RC4 KSA với một số IV patterns tạo ra initial state S có correlation cao với bytes đầu tiên của key. Cụ thể, với IV dạng (A+3, N-1, X) (trong đó A là byte index của key cần tìm, N=256):

```text
Output byte đầu tiên của PRGA bị bias:
P(output[0] = K[A+3] XOR ...) >> 1/256 (ngẫu nhiên)
```text
Nếu attacker collect đủ ciphertext dùng weak IVs với cùng key:
- Giữ lại chỉ weak IV frames (aircrack-ng tự động làm điều này)
- Thống kê output byte đầu tiên của mỗi frame
- Byte giá trị xuất hiện nhiều nhất → candidate cho key byte
- Repeat cho từng byte của key

Cần khoảng 40,000–85,000 weak IV frames để recover key 40-bit với xác suất 95%.

> [!info] FMS vs Klein's Attack
> Năm 2005, Andreas Klein phát hiện thêm correlations — Klein's attack hiệu quả hơn FMS, cần ít frame hơn. aircrack-ng implement PTW attack (Pyshkin-Tews-Weinmann 2007) — cải tiến tiếp của Klein, chỉ cần ~5,000 frames đối với WEP-104 và ~1,500 frames cho WEP-40.
>
---

## Góc nhìn kẻ tấn công

| Vulnerability | Attack | Tool | Frame cần |
|--------------|--------|------|----------|
| IV reuse / weak IVs | FMS/PTW key recovery | aircrack-ng | 5K–85K IVs |
| CRC-32 linearity | Bit-flip forgery | aireplay-ng | 1 frame |
| Shared key auth | Keystream leak | Wireshark + XOR | Challenge frame |
| ARP replay | Accelerated IV collection | aireplay-ng -3 | 1 ARP frame |

**Attack flow thực tế (WEP crack):**

```text
1. Monitor mode: airmon-ng start wlan0
2. Scan: airodump-ng --encrypt WEP wlan0mon
3. Target: airodump-ng -w capture --bssid <BSSID> -c <CH> wlan0mon
4. Fake auth: aireplay-ng -1 0 -a <BSSID> wlan0mon
5. ARP replay: aireplay-ng -3 -b <BSSID> wlan0mon
6. Crack: aircrack-ng capture*.cap
```text
---

## Pentest Checklist

```text
□ Xác định AP dùng WEP (ENC=WEP trong airodump-ng)
□ WEP ngày nay rất hiếm — thường chỉ gặp ở legacy OT/SCADA environments
□ Kiểm tra shared key authentication (nguy hiểm hơn open — leak keystream)
□ Collect IVs: cần tối thiểu 5,000 với PTW attack
□ Dùng ARP replay để accelerate IVs nếu traffic thấp
□ Document: WEP là critical finding — recommend upgrade ngay
```text
---

## Kết nối

```mermaid
flowchart LR
    L02[02. WEP Internals] --> L03[03. WPA/TKIP]
    L02 -->|Lý do WEP fail| L04[04. WPA2 Key Hierarchy]
    L02 -->|RC4 weakness| ATK1[aircrack-ng PTW attack]
    L02 -->|CRC-32 linearity| ATK2[Bit-flip forgery / ARP replay]
```text