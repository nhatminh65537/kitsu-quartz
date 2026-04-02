---
title: "10. SAE/Dragonfly Key Exchange: WPA3-Personal Internals"
type: foundation
tags: [pentest, wifi, wireless, wpa3, sae, dragonfly, pake, cryptography, foundation, lesson-10]
aliases: [SAE Dragonfly WPA3]
created: 2026-04-01
---

> **Prerequisites**: [[04-wpa2-key-hierarchy|04. WPA2 Key Hierarchy]] · [[09-management-frame-protection|09. 802.11w Management Frame Protection]]
> **Objectives**:
> - Hiểu SAE là PAKE (Password-Authenticated Key Exchange) và khác WPA2-PSK như thế nào
> - Phân tích Dragonfly handshake: PWE derivation, commit/confirm phases
> - Hiểu tại sao SAE cung cấp forward secrecy còn WPA2-PSK không
> - Nắm Dragonblood attacks — timing side-channel, cache side-channel, Dragon Drain
> - Hiểu WPA3 Transition Mode và tại sao nó không bảo vệ được gì thực sự

---

## Động lực

WPA2-PSK có một điểm yếu kiến trúc không thể vá bằng patch: PMK derive trực tiếp từ password. Bất kỳ ai capture handshake đều có thể offline crack, bất kể protocol có được implement đúng hay không.

SAE (Simultaneous Authentication of Equals) thay đổi điều này ở mức gốc rễ. Sau khi hiểu lesson này, bạn sẽ thấy tại sao WPA3 giải quyết được offline crack nhưng vẫn có attack surface riêng.

---

## Kiến trúc & Cơ chế

### SAE là PAKE — Khái niệm cốt lõi

PAKE (Password-Authenticated Key Exchange) là một class giao thức cho phép hai bên biết cùng password thực hiện key exchange mà:
1. Không bao giờ truyền password trực tiếp
2. Không truyền bất kỳ thứ gì có thể dùng để brute-force password offline
3. Cả hai phía xác thực lẫn nhau (ngang hàng — "Equals" trong SAE)
4. Mỗi session tạo ra PMK unique (perfect forward secrecy)

WPA3-Personal dùng SAE, cụ thể là **Dragonfly** handshake (chuẩn hóa trong RFC 7664).

### PWE Derivation — Password Element

Bước đầu tiên của SAE: cả hai phía derive một EC (Elliptic Curve) point từ password, gọi là **PWE (Password Element)**.

**Phương pháp 1: Hash-to-Curve (hunting-and-pecking)**

Đây là method gốc trong WPA3 ban đầu:

```python
# Pseudocode cho hunting-and-pecking
def derive_pwe(password, mac_a, mac_b, ssid):
    for counter in range(1, 256):
        # Tạo candidate base
        base = H(min(mac_a, mac_b) || max(mac_a, mac_b) || password || counter)
        # base là một số nguyên trong [0, p-1]
        x = base mod p
        
        # Check nếu x là valid x-coordinate trên curve
        y_squared = (x^3 + ax + b) mod p
        if is_quadratic_residue(y_squared, p):
            # Tìm thấy điểm trên curve
            y = sqrt(y_squared) mod p
            # Chọn y dựa trên bit LSB của base
            if (lsb(base) + lsb(y)) % 2 != 0:
                y = p - y
            return ECPoint(x, y)
    # Không tìm thấy (rất hiếm, ~1/256)
    raise Exception("PWE derivation failed")
```text
> [!warning] Timing Side-Channel trong hunting-and-pecking
> Số lần loop phụ thuộc vào password bits → execution time leaked! Dragonblood (2019) exploit điều này: bằng cách đo timing của nhiều authentication attempts, attacker có thể recover thông tin về password. Đây là lý do IEEE 802.11 sau đó mandated constant-time implementation.
>
**Phương pháp 2: Hash-to-Element (h2e) — WPA3 Rev 2019+**

Hash-to-Element là method mới hơn, constant-time:

```python
# Hash-to-Element: deterministic, constant time
def derive_pwe_h2e(password, mac_a, mac_b, ssid):
    # PT = secret element derived from password
    PT = H2E_map_to_curve(HKDF-Extract(ssid, password))
    # PWE = PT scalar multiplied by random blinding factor
    # Constant time — không có loop conditional
    return PT
```text
Hash-to-Element không có timing side-channel vì không có conditional branch phụ thuộc vào password bits.

### Dragonfly Commit Phase

![[img-10-dragonfly.svg]]
*Hình 1: SAE/Dragonfly — PWE derivation, commit phase (EC operations), confirm phase (HMAC proof), và Dragonblood attacks*

Sau khi cả hai phía có PWE, Commit phase bắt đầu:

**Client side:**
```python
r_A = random_in_range(1, curve_order - 1)   # 256-bit random
m_A = random_in_range(1, curve_order - 1)   # 256-bit random mask

# Commit scalar và element
scalar_A = (r_A + m_A) mod curve_order
element_A = -(m_A × PWE)    # EC scalar mult, negate

# Gửi SAE Commit frame:
send(SAE_Commit(scalar_A, element_A))
```text
**AP side (đồng thời):**
```python
r_B = random_in_range(1, curve_order - 1)
m_B = random_in_range(1, curve_order - 1)

scalar_B = (r_B + m_B) mod curve_order
element_B = -(m_B × PWE)

send(SAE_Commit(scalar_B, element_B))
```text
**Tính shared secret (cả hai phía):**
```python
# Client:
K_A = r_A × (scalar_B × PWE + element_B)

# AP:
K_B = r_B × (scalar_A × PWE + element_A)

# K_A == K_B nếu cả hai biết cùng PWE (cùng password)
# Chứng minh: r_A × (scalar_B × PWE + element_B)
#           = r_A × ((r_B + m_B) × PWE + (-m_B × PWE))
#           = r_A × (r_B × PWE)
#           = r_B × (r_A × PWE)
#           = r_B × ((r_A + m_A) × PWE + (-m_A × PWE))
#           = r_B × (scalar_A × PWE + element_A)
```text
**PMK derivation từ shared secret K:**
```python
PMK = KDF-Hash-Length(K,
      "SAE KCK and PMK",
      scalar_A || scalar_B || element_A.x || element_A.y ||
                              element_B.x || element_B.y)
# PMK = 256-bit session key, unique cho mỗi authentication
```text
### Dragonfly Confirm Phase

Confirm phase chứng minh cả hai phía có cùng K (và qua đó cùng password), mà không tiết lộ K:

```python
# Both derive:
KCK = KDF(PMK, "SAE KCK and PMK", ...)[0:256]  # first 256 bits

# Client gửi SAE Confirm:
send_confirm_A = HMAC-SHA256(KCK,
    counter || scalar_A || element_A || scalar_B || element_B)
send(SAE_Confirm(send_confirm_A))

# AP gửi SAE Confirm:
send_confirm_B = HMAC-SHA256(KCK,
    counter || scalar_B || element_B || scalar_A || element_A)
send(SAE_Confirm(send_confirm_B))

# Verify: Client checks AP's confirm và ngược lại
```text
Nếu confirm hợp lệ → PMK shared. Sau đó 4-way handshake bình thường để derive PTK/GTK.

### Tại sao SAE có Forward Secrecy

```text
WPA2-PSK:
  PMK = f(password)  ← password fixed → PMK fixed
  Nếu biết PMK → decrypt mọi session đã capture

SAE:
  PMK phụ thuộc vào r_A, m_A, r_B, m_B — ephemeral randoms
  r_A, m_A, r_B, m_B bị xóa sau handshake
  Kể cả biết password sau này → không thể tính lại K → không decrypt past sessions
  Đây là Perfect Forward Secrecy (PFS)
```text
### Dragonblood Attacks (Vanhoef & Ronen, 2019)

**Attack 1: Timing Side-Channel (hunting-and-pecking)**

```text
Setup: Attacker gửi SAE Commit frames với scalar/element tính sẵn
Observe: Đo thời gian AP xử lý Commit → tính PWE → tính shared K → gửi Confirm

Thông tin rò rỉ: Số lần loop trong hunting-and-pecking phụ thuộc vào
  password bits → timing leak partial password info

Tool: Dragonblood PoC code (Mathy Vanhoef)
Impact: Partial key recovery after ~750 timing measurements
Patch: Constant-time PWE derivation (h2e method)
```text
**Attack 2: Cache Side-Channel**

```text
Setup: Attacker có code execution trên cùng physical machine (shared hosting, cloud)
Method: Flush+Reload attack trên L3 cache
  - Flush cache lines của PWE computation code
  - AP run SAE commit processing
  - Measure reload time → biết which cache lines accessed
  - Cache access pattern → biết which branches taken in hunting-and-pecking
  → password bits leaked

Impact: More powerful than timing, cần ít measurements hơn
Patch: h2e method loại bỏ data-dependent branches
```text
**Attack 3: Dragon Drain — SAE DoS**

```text
Setup: Attacker gửi flood SAE Commit frames
Mechanism: Mỗi Commit buộc AP tính:
  - DH exchange: EC scalar multiplication (expensive: ~0.5ms trên modern CPU)
  - Verify commit: HMAC-SHA256
  Tổng: ~1–2ms CPU per Commit frame

Attacker gửi 1000 Commit/giây → AP dùng toàn CPU cho SAE
→ AP không thể serve legitimate clients → Denial of Service

Mitigation: AP-side rate limiting per MAC, commit cache, throttle
Tool: airgeddon Dragon Drain plugin
Status: Patched trên nhiều APs, nhưng embedded devices có thể vẫn vulnerable
```text
**Attack 4: Downgrade to WPA2 (Transition Mode)**

```text
WPA3 Transition Mode: AP broadcast cả WPA2 và WPA3 AKM trong RSN IE
  AKM 2 (WPA2-PSK) + AKM 8 (SAE) cùng supported

Attack: Client connect bằng WPA2 thay vì WPA3
  - Capture WPA2 handshake
  - Offline crack (WPA3 cung cấp zero protection)
  
Security posture của Transition Mode = WPA2
Nếu có WPA2 clients → entire network security = WPA2
```text
> [!warning] WPA3 Transition Mode ≠ WPA3 security
> Nhiều home networks deploy WPA3 Transition Mode để backward compatible với older devices. Nhưng security level của network = lowest common denominator. Một client cũ kết nối bằng WPA2 expose handshake → offline crack → network compromised. WPA3-only mode (AKM 8 only) mới thực sự cung cấp WPA3 guarantees.
>
### Online Dictionary Attack trên WPA3

SAE ngăn offline attack, nhưng không ngăn online guessing:

```text
Attack: Gửi SAE Commit với sai password → AP respond với NACK
Test mỗi password: ~1 roundtrip (~50ms) = 20 guesses/second
Vs WPA2 offline: hashcat với GPU = 1,000,000+ guesses/second

WPA3 online attack rate: ~50 guesses/sec → không practical với strong password
Nhưng: AP phải rate limit → không có rate limit → DoS risk

Tool: wacker (WPA3 online brute-force)
Status: Extremely slow, not practical cho passwords > 8 chars
```text
---

## Góc nhìn kẻ tấn công

| Attack | WPA2-PSK | WPA3-SAE | WPA3 Transition |
|--------|----------|----------|----------------|
| Offline dict attack | Có (fast) | Không | Partial (WPA2 clients) |
| PMKID capture | Có | Không | Partial |
| Deauth flood | Có | Không (PMF required) | Partial |
| Online brute-force | Không thực tế | Chậm (~20/s) | Chậm |
| Timing side-channel | N/A | Patched (h2e) | N/A |
| Dragon Drain DoS | N/A | Có thể | Có thể |
| Downgrade | N/A | Không (SAE-only) | Có (mixed mode) |

---

## Pentest Checklist

```text
□ Identify WPA3 vs Transition Mode: RSN IE có AKM 8 (SAE) only hay cả 2 và 8?
□ AKM 8 only = WPA3-only = không thể offline crack
□ AKM 2 + 8 (Transition Mode) = WPA2 attack surface vẫn còn
□ Check PMF: MFPR=1 trong RSN Capabilities của WPA3 AP
□ Dragon Drain (testing only, với permission): airgeddon → Dragon Drain module
□ Online brute-force WPA3: wacker tool (rất chậm, không practical)
□ WPA3-Enterprise: same EAP attack surface như WPA2-Enterprise
□ Document: WPA3-only = strong security posture. Transition Mode = needs improvement.
```text
---

## Kết nối

```mermaid
flowchart TD
    L10[10. SAE/Dragonfly] --> FWD[Forward Secrecy]
    L10 --> NOFFLINE[Không offline crack]
    L10 -->|Transition Mode| DOWNGRADE[Downgrade → WPA2 attacks]
    L10 -->|Dragonblood| TIMING[Timing side-channel]
    L10 -->|Dragon Drain| DOS[DoS AP]
    L10 -->|PMF required| NODEAUTH[Deauth attack fail]
    FWD --> COMPARE[vs WPA2-PSK: PMK không ephemeral]
```text