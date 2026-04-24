---
title: "31. Post-Quantum Overview"
type: foundation
tags: [crypto, pqc, post-quantum, shor, grover, nist]
aliases: [Post-Quantum Cryptography Overview, PQC Overview]
created: 2026-04-18
---

> **Prerequisites**: [[15-rsa-fundamentals|15. RSA Fundamentals]], [[18-diffie-hellman-dlp|18. Diffie-Hellman & DLP]], [[20-ecc-fundamentals|20. ECC Fundamentals]], [[26-lattice-attacks-lll|26. Lattice Attacks — LLL]]  
> **Lesson type**: Foundation
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $n$ | Security parameter (bit length của key) |
> | $O(\cdot)$ | Big-O notation về độ phức tạp thời gian |
> | $\text{poly}(n)$ | Polynomial function của $n$ |
> | $\mathsf{negl}(\lambda)$ | Negligible function của security parameter $\lambda$ |
> | CRQC | Cryptographically Relevant Quantum Computer |
> | KEM | Key Encapsulation Mechanism |

---

## 1. Động Lực: Tại Sao Cần Post-Quantum Cryptography?

Toàn bộ hệ thống mật mã khóa công khai được dùng hiện nay — RSA, ECDH, ECDSA, Diffie-Hellman — đều đặt nền móng bảo mật trên hai bài toán khó: **bài toán phân tích nhân tử nguyên (IFP)** và **bài toán logarithm rời rạc (DLP/ECDLP)**. Với máy tính cổ điển, hai bài toán này thực sự khó: giải chúng tốn thời gian sub-exponential đến exponential với input lớn.

Nhưng năm 1994, Peter Shor công bố một thuật toán lượng tử giải cả hai bài toán trong thời gian **polynomial**. Điều này có nghĩa là: nếu một ngày nào đó tồn tại một máy tính lượng tử đủ lớn, toàn bộ RSA, ECDH, và DH sẽ sụp đổ — không phải vì triển khai sai, mà vì bản thân toán học nền tảng bị phá.

Đây không phải viễn cảnh khoa học viễn tưởng nữa. Tính đến 2024, nhiều chính phủ và tập đoàn lớn đang đầu tư hàng tỷ USD vào nghiên cứu quantum computing. Mối đe dọa được gọi là **"harvest now, decrypt later"** (thu thập hôm nay, giải mã sau): adversary có thể đang thu thập ciphertext được mã hóa bằng RSA/ECC ngay lúc này, chờ đến khi máy tính lượng tử đủ mạnh để giải mã hàng loạt. Với dữ liệu có vòng đời dài (bí mật quốc gia, hồ sơ y tế, giao dịch tài chính dài hạn), mối đe dọa này là **hiện tại**, không phải tương lai.

**Post-Quantum Cryptography (PQC)** là tập hợp các scheme mật mã được thiết kế để chịu đựng cả tấn công từ máy tính cổ điển lẫn máy tính lượng tử.

---

## 2. Máy Tính Lượng Tử: Khác Gì Máy Tính Cổ Điển?

Máy tính cổ điển dùng bit, mỗi bit chỉ có thể là 0 hoặc 1. Máy tính lượng tử dùng **qubit** — đơn vị có thể tồn tại ở trạng thái **superposition** của 0 và 1 cùng lúc. Khi có $n$ qubit, máy tính lượng tử có thể biểu diễn đồng thời $2^n$ trạng thái.

Điều quan trọng cần hiểu: máy tính lượng tử **không phải** là máy tính song song $2^n$ lần nhanh hơn mọi bài toán. Để khai thác superposition, cần thuật toán được thiết kế đặc biệt để "giao thoa" các trạng thái sao cho câu trả lời đúng được khuếch đại còn câu trả lời sai bị triệt tiêu. Chỉ một số bài toán cụ thể có cấu trúc cho phép điều này — và IFP, DLP thuộc vào số đó.

**CRQC** (Cryptographically Relevant Quantum Computer) là tên gọi cho máy tính lượng tử đủ lớn và đủ tin cậy để chạy Shor's algorithm với RSA-2048 hoặc ECDH-256. Đến năm 2024, CRQC chưa tồn tại. Theo ước tính của Gidney & Ekerå (2021), phá RSA-2048 cần khoảng 4.000 logical qubit (sau error correction). Máy tính lượng tử lớn nhất hiện tại còn cách xa con số này.

---

## 3. Shor's Algorithm: Phá RSA và ECC

Shor's algorithm (1994) giải quyết IFP và DLP trong thời gian polynomial.

> [!abstract] Độ Phức Tạp của Shor's Algorithm
> Với $n$-bit integer $N$:
>
> $$
> T_{\text{Shor}}(N) = O((\log N)^2 \cdot \log \log N \cdot \log \log \log N) = O(\text{poly}(\log N))
> $$
>
> So với thuật toán cổ điển tốt nhất (GNFS):
>
> $$
> T_{\text{GNFS}}(N) = O\!\left(\exp\!\left(c \cdot (\log N)^{1/3} (\log \log N)^{2/3}\right)\right) \quad \text{(sub-exponential)}
> $$

**Ý nghĩa thực tế**: RSA-2048 tốn hàng triệu năm để phá bằng GNFS trên máy tính cổ điển. Shor's algorithm trên CRQC phá trong vài giờ.

Cơ chế hoạt động của Shor's algorithm đặt nền trên **quantum Fourier transform** để tìm chu kỳ của hàm $f(x) = a^x \bmod N$. Một khi tìm được chu kỳ $r$, factoring được reduce về toán học cổ điển đơn giản: $\gcd(a^{r/2} \pm 1, N)$. Tương tự, DLP ($g^x = h$) được biến thành bài toán tìm chu kỳ tương đương.

**Tất cả scheme dựa trên IFP và DLP đều bị phá**: RSA (mọi key size), DH (finite field), ElGamal, ECDH, ECDSA, DSA, Ed25519, X25519.

---

## 4. Grover's Algorithm: Tấn Công Symmetric Crypto

Grover's algorithm (1996) giải quyết **bài toán tìm kiếm không cấu trúc**: trong $N$ phần tử, tìm phần tử thỏa điều kiện $f(x) = 1$. Máy tính cổ điển cần $O(N)$ phép tính; Grover cần $O(\sqrt{N})$.

> [!abstract] Độ Phức Tạp của Grover's Algorithm
> Brute-force search trên không gian size $N$:
>
> $$
> T_{\text{Grover}} = O(\sqrt{N}) = O(2^{n/2}) \quad \text{với } N = 2^n
> $$
>
> **Kết quả**: key $n$-bit chỉ còn hiệu quả $n/2$ bit security trước tấn công quantum.

**Tác động thực tế**:
- AES-128 → quantum security $\approx 64$ bit → **không đủ**.
- AES-256 → quantum security $\approx 128$ bit → **vẫn an toàn**.
- SHA-256 → collision resistance từ $2^{128}$ về $2^{85}$ bằng BHT algorithm → **vẫn an toàn thực tế**.
- SHA-3/256 → tương tự, vẫn an toàn với output 256-bit.

Grover **không phá** symmetric crypto, chỉ làm yếu đi. Đơn giản nhất: dùng key size gấp đôi — AES-256 đủ an toàn trong kỷ nguyên lượng tử.

> [!info] So sánh tác động
> | Crypto | Classical Security | Quantum Threat | Khuyến nghị |
> |--------|-------------------|----------------|-------------|
> | RSA-2048 | ~112 bit | Shor → 0 bit | Thay hoàn toàn bằng PQC |
> | ECDH-256 | ~128 bit | Shor → 0 bit | Thay hoàn toàn bằng PQC |
> | AES-128 | 128 bit | Grover → 64 bit | Nâng lên AES-256 |
> | AES-256 | 256 bit | Grover → 128 bit | Vẫn an toàn |
> | SHA-256 | 128 bit collision | BHT → 85 bit | Vẫn an toàn |
> | SHA-3/256 | 128 bit collision | Grover → 85 bit | Vẫn an toàn |

![[assets/img-01-quantum-threat-map.png]]
_Hình 1: Bản đồ mối đe dọa lượng tử — Classical vs CRQC. Xanh = còn an toàn; Đỏ = bị phá hoàn toàn; Vàng = suy yếu nhưng vẫn dùng được._

---

## 5. Yêu Cầu Của Post-Quantum Cryptography

PQC không phải chỉ cần "không bị phá bởi Shor/Grover". Một scheme PQC cần:

1. **Classical security**: an toàn trước máy tính cổ điển (bao gồm các thuật toán lattice tốt nhất hiện tại như LLL, BKZ).
2. **Quantum security**: an toàn trước CRQC (bao gồm Shor, Grover, và các thuật toán lượng tử mới có thể phát hiện trong tương lai).
3. **Hiệu suất thực tế**: key size, ciphertext size, và thời gian tính toán phải đủ nhỏ để triển khai thực tế.
4. **Bằng chứng bảo mật**: security phải reduce về bài toán toán học được xác nhận là khó.

Bốn gia đình toán học được xác nhận là bền vững trước quantum computing đến 2024: **lattice**, **hash**, **error-correcting codes**, và **isogeny**.

---

## 6. NIST PQC Standardization: Quá Trình Và Kết Quả

NIST khởi động chương trình chuẩn hóa PQC năm 2016 — một trong những cuộc thi mật mã quốc tế lớn nhất lịch sử, thu hút submissions từ khắp thế giới. Sau 8 năm đánh giá qua 4 vòng, ngày 13 tháng 8 năm 2024, NIST công bố 3 tiêu chuẩn chính thức.

> [!note] NIST PQC Standards 2024
> **FIPS 203 — ML-KEM** (Module-Lattice-Based Key Encapsulation Mechanism)
> - Tên trước: CRYSTALS-Kyber
> - Dùng cho: key exchange, TLS, hybrid encryption
> - Hard problem: Module-LWE
>
> **FIPS 204 — ML-DSA** (Module-Lattice-Based Digital Signature Algorithm)
> - Tên trước: CRYSTALS-Dilithium
> - Dùng cho: digital signature thay thế ECDSA
> - Hard problem: Module-LWE + Module-SIS
>
> **FIPS 205 — SLH-DSA** (Stateless Hash-Based Digital Signature Standard)
> - Tên trước: SPHINCS+
> - Dùng cho: signature conservative option (không dựa trên lattice)
> - Hard problem: Collision resistance của hash function
>
> **FN-DSA** (fka Falcon) — đang trong quá trình hoàn thiện FIPS standard (NIST IR 8413 approved, FIPS đang soạn).

Ngoài ra, NIST cũng có **alternate KEM candidates** đang trong vòng đánh giá bổ sung: HQC (code-based) và BIKE (code-based) cho diversity — để phòng trường hợp tất cả lattice schemes bị phá đồng thời.

![[assets/img-02-pqc-family-tree.png]]
_Hình 2: Bốn gia đình PQC và các scheme tương ứng. Ba tiêu chuẩn NIST 2024 highlight tím. SIKE bị phá năm 2022 bằng tấn công cổ điển._

---

## 7. Bốn Gia Đình PQC: Survey-Level

### 7.1. Lattice-Based Cryptography (Mạnh nhất, phổ biến nhất)

**Hard problem**: Learning With Errors (LWE), Short Integer Solution (SIS), và các biến thể Ring/Module. Security được chứng minh reduce từ worst-case lattice problems (SVP, SIVP) — điều không có trong RSA hay ECC.

**Ưu điểm**: Hiệu suất tốt, key size nhỏ (vài KB), có worst-case security reduction.
**Nhược điểm**: Cần Gaussian noise sampling cẩn thận; một số scheme (Falcon) khó implement an toàn về side-channel.
**Schemes**: ML-KEM (FIPS 203), ML-DSA (FIPS 204), FN-DSA/Falcon, NTRU, FrodoKEM.

### 7.2. Hash-Based Signatures (Conservative nhất)

**Hard problem**: Chỉ cần collision resistance của hash function. Không có giả thiết toán học mới nào cần tin tưởng.

**Ưu điểm**: Security bền vững nhất — chỉ cần hash function an toàn; không bị ảnh hưởng bởi bất kỳ đột phá toán học nào về lattice hay code.
**Nhược điểm**: Signature size lớn (vài chục KB cho SLH-DSA); chậm hơn lattice; stateful schemes (XMSS) cần quản lý state cẩn thận.
**Schemes**: SLH-DSA/SPHINCS+ (FIPS 205), XMSS, LMS (NIST SP 800-208).

### 7.3. Code-Based Cryptography (Lâu đời nhất)

**Hard problem**: Syndrome decoding — phục hồi error vector từ parity check matrix. NP-hard cho random codes; Goppa codes có efficient decoder nhưng vẫn đủ khó về security.

**Ưu điểm**: Đề xuất từ 1978 (McEliece), thời gian phân tích dài nhất trong PQC; KEM có encrypt/decrypt nhanh.
**Nhược điểm**: Key size cực lớn (McEliece-6960119: public key 1.04 MB); ít được deployed.
**Schemes**: Classic McEliece (NIST Alternate KEM), HQC, BIKE.

### 7.4. Isogeny-Based Cryptography (Compact nhất, đang phát triển)

**Hard problem**: Tìm isogeny giữa hai supersingular elliptic curves (đường đi trong supersingular isogeny graph). Compact key size — công khai chỉ vài trăm byte.

**Cảnh báo quan trọng**: SIDH/SIKE — finalist NIST năm 2022 — bị phá **hoàn toàn bằng máy tính cổ điển** vào tháng 7 năm 2022 bởi Castryck và Decru. Đây là một trong những đột phá phân tích mật mã lớn nhất thập kỷ: SIKE bị phá trong vài phút trên laptop.

**Schemes còn active**: CSIDH (commutative SIDH — vẫn an toàn), SQISign (compact signature — đang nghiên cứu).

---

## 8. "Harvest Now, Decrypt Later" — Tại Sao Phải Hành Động Ngay?

Một misconception phổ biến: "CRQC chưa tồn tại, nên chưa cần lo". Sai. Lý do migration phải bắt đầu **ngay hôm nay**:

**1. Thời gian migration dài**: Thay đổi cryptographic primitives trong hệ thống lớn (TLS stack, PKI, firmware của thiết bị embedded) tốn nhiều năm. NIST IR 8547 yêu cầu các thuật toán quantum-vulnerable bị deprecated khỏi NIST standards **trước 2035**. Với thời gian transition, 2025 là năm trễ để bắt đầu.

**2. Data confidentiality requirement**: Nhiều dữ liệu cần bảo mật trong 10-30 năm (thông tin y tế, bí mật quốc gia, giao dịch tài chính). Nếu được mã hóa bằng RSA hôm nay và thu thập bởi adversary, khi CRQC xuất hiện, dữ liệu này sẽ bị giải mã.

**3. Harvest now, decrypt later đang xảy ra**: Nhiều intelligence agencies và state actors đã và đang thu thập encrypted traffic với giả định decrypt later. Bằng chứng gián tiếp đã được trình bày tại nhiều hội nghị bảo mật.

> [!warning] Các Hệ Thống Cần Ưu Tiên Migration
> - Long-lived secrets (certificate authorities, root keys)
> - Dữ liệu yêu cầu bảo mật >10 năm
> - Firmware không update được (IoT, embedded)
> - Key exchange trong TLS (ngay cả session keys ngắn hạn — vì adversary có thể record và decrypt later)
> - Digital signature dùng cho code signing, certificate, trusted boot

---

## 9. Hybrid Schemes: Chiến Lược Chuyển Tiếp

Trong giai đoạn transition, phương pháp được NIST và ngành công nghiệp khuyến nghị là **hybrid schemes** — kết hợp classical algorithm với PQC algorithm song song:

$$
\text{Hybrid Key} = \text{KDF}(\text{ECDH shared secret} \| \text{ML-KEM shared secret})
$$

Logic: nếu ML-KEM bị phá (unexpected classical attack), ECDH vẫn bảo vệ. Nếu CRQC xuất hiện, ML-KEM vẫn bảo vệ dù ECDH bị Shor phá.

**Đã deployed**: TLS 1.3 với X25519+ML-KEM (Chrome, Firefox 2024), Signal Protocol (PQXDH = X3DH + ML-KEM), Apple iMessage PQ3 (X25519 + ML-KEM).

---

## 10. Migration Strategy — Lộ Trình Chuyển Đổi

### 10.1. NIST IR 8547 Timeline

NIST IR 8547 (2024) — *Transition to Post-Quantum Cryptography Standards* — thiết lập lộ trình deprecation rõ ràng:

| Giai đoạn | Năm | Nội dung |
|-----------|-----|---------|
| **Chuẩn bị** | 2024–2026 | Inventory cryptographic assets; identify quantum-vulnerable usage; test PQC libraries |
| **Hybrid deployment** | 2026–2030 | Deploy hybrid schemes (classical + PQC) cho new systems; prioritize long-lived secrets |
| **Mandatory PQC** | 2030 | Tất cả new systems phải dùng PQC; classical-only không được chấp nhận cho federal systems |
| **Sunset classical** | 2035 | RSA, ECDH, ECDSA, DH **bị deprecated** khỏi NIST standards; không được dùng cho mọi mục đích |

> [!warning] 2035 là deadline thực sự
> Sau 2035, RSA-2048, ECDH-256 không còn được NIST approve. Các hệ thống liên bang Mỹ **phải** đã migrate xong. Với hệ thống tư nhân và quốc tế, áp lực compliance và regulatory tương tự sẽ theo sau.

### 10.2. X-Wing: Hybrid KEM Đã Deployed

**X-Wing** (Brendel et al., 2024) là hybrid KEM kết hợp X25519 và ML-KEM-768:

$$\text{X-Wing shared secret} = \text{KDF}(\text{X25519 ss} \| \text{ML-KEM-768 ss} \| \text{X25519 pk} \| \text{ML-KEM-768 pk})$$

- Chrome triển khai X-Wing từ phiên bản 124 (2024) cho TLS 1.3
- Firefox từ version 128 (2024)
- Ciphertext overhead: X25519 (32 bytes) + ML-KEM-768 (1088 bytes) = 1120 bytes — tăng nhẹ so với thuần X25519 (32 bytes) nhưng chấp nhận được

**Tại sao hybrid?** Security bằng **max** của hai scheme: nếu ML-KEM bị broken (unexpected classical attack), X25519 vẫn bảo vệ. Nếu quantum computer xuất hiện, ML-KEM vẫn bảo vệ dù X25519 bị Shor phá. Đây là cách "hedge" an toàn trong giai đoạn transition.

### 10.3. Hybrid TLS và Composite Certificates

**Hybrid TLS handshake**: Dùng hai key agreement: X25519 + ML-KEM (đã chuẩn hóa qua RFC draft `hybrid-kem-tls`). Server gửi cả hai public keys; client gửi cả hai encapsulations; session key = KDF của cả hai shared secrets.

**Composite certificates** (đang draftted tại IETF): X.509 certificate chứa cả hai public keys (ECDSA-P256 + ML-DSA-44) và hai chữ ký tương ứng. Backward-compatible: client cũ dùng ECDSA, client mới verify cả hai.

```python
# Ví dụ hybrid key exchange với liboqs
import oqs, subprocess

# ML-KEM-768 side
with oqs.KeyEncapsulation("ML-KEM-768") as mlkem:
    mlkem_pk = mlkem.generate_keypair()
    # Classical side: X25519
    from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PrivateKey
    x25519_priv = X25519PrivateKey.generate()
    x25519_pub = x25519_priv.public_key()
    # ... combine both in TLS handshake ...
```

---

## 11. HNDL — Harvest Now, Decrypt Later

### 11.1. Cơ Chế Mối Đe Dọa HNDL

**Harvest Now, Decrypt Later (HNDL)** là chiến lược tấn công thụ động dài hạn:

1. **Thu thập**: Adversary (state actor, APT group) intercept và lưu trữ encrypted traffic **ngay hôm nay** — TLS sessions, VPN connections, encrypted emails — dù hiện tại không thể giải mã
2. **Chờ đợi**: Lưu trữ trong 5-15 năm
3. **Giải mã**: Khi CRQC xuất hiện, dùng Shor's algorithm để recover RSA/ECDH private keys → giải mã toàn bộ archived traffic

Điều này **đã đang xảy ra**: NSA UPSTREAM program thu thập internet traffic quy mô lớn. Các tài liệu Snowden cho thấy "Store Now, Decrypt Later" là chiến lược được document rõ ràng.

### 11.2. Long-Lived vs Short-Lived Secrets — Phân tích Rủi ro

| Loại Secret | Vòng đời | HNDL Risk | Hành động |
|-------------|----------|-----------|-----------|
| TLS session key | Vài giờ | Thấp nếu forward secrecy | PFS đủ; ephemeral ECDHE không lưu |
| Code signing key | 5-10 năm | **Cao** | Migrate ngay (ECDSA → ML-DSA) |
| Root CA key | 20-30 năm | **Rất cao** | Ưu tiên cao nhất |
| Long-term secret key | Không xác định | **Rất cao** | Thay ngay |
| Medical records (encrypted) | 70+ năm | **Cực cao** | Hybrid encryption |
| Bí mật quốc gia | Vô thời hạn | **Tối cao** | Đã migrate (classified programs) |

> [!note] Nghịch lý TLS Session Key
> TLS 1.3 với ECDHE có **Perfect Forward Secrecy (PFS)**: session key là ephemeral, không bao giờ lưu trữ. Kể cả khi private key của server bị lộ sau này, session key cũ không thể recover.
>
> Tuy nhiên: nếu adversary lưu trữ **cả TLS handshake packet + ciphertext**, và sau này dùng Shor để phá ECDHE (recover ephemeral private key từ ephemeral public key), session key **vẫn bị lộ**. Đây là lý do cần migrate key exchange sang ML-KEM ngay cả với short-lived sessions.

### 11.3. Mức Độ Khẩn Cấp

**Không urgent (quantum not yet)**: Chữ ký số cho authenticating messages ngay bây giờ — forging signature hiện tại không ích lợi gì cho quantum attacker tương lai.

**Urgent (HNDL applicable)**:
- Encrypted data với long confidentiality requirement
- TLS key exchange (ngay cả ephemeral — như phân tích trên)
- Encrypted emails, files, database fields với retention > 5 năm
- Certificate issuance (root CA public key lâu dài → target cho Shor)

**Kết luận chiến lược**: Thứ tự ưu tiên migration:
1. **Key exchange** trong mọi protocol (ECDHE → X-Wing/ML-KEM) — HNDL trực tiếp
2. **Long-lived signing keys** (CA certificates, code signing) — lifetime overlap với CRQC
3. **Symmetric key sizes** (AES-128 → AES-256) — đơn giản nhất, Grover mitigation
4. **Short-lived signatures** — lowest priority, deploy khi convenient

---

## 12. CTF Relevance

> [!info] CTF Relevance — ⭐ (Phase 7, survey level)
> PQC ít xuất hiện trong CTF hiện tại vì các scheme mới chưa phổ biến trong challenge environment. Tuy nhiên:
>
> - **Nhận biết khi gặp**: source code có `from kyber import *`, `mlkem`, `ntru` → đây là PQC challenge.
> - **Lattice CTF**: không phải PQC attacks mà là classical lattice attacks (LLL, Coppersmith) — xem [[l22-lattice-attacks-lll|L22]].
> - **Research CTF** (Plaid, HITCON advanced): đôi khi xuất hiện NTRU attacks, LWE weak parameter challenges.
> - **Pattern nhận diện**: nếu challenge cho n, q, polynomial ring → likely Ring-LWE based scheme.

---

## 13. Toolbox

**Thư viện PQC production**:
- **liboqs** (Open Quantum Safe) — C library, Python bindings qua `pyoqs`; implement ML-KEM, ML-DSA, Falcon, SPHINCS+.
- **pqcrypto** — Python package wrapping liboqs.
- **BoringSSL / OpenSSL 3.x** — hybrid TLS với ML-KEM đã có.

```python
import oqs

with oqs.KeyEncapsulation("ML-KEM-768") as kem:
    public_key = kem.generate_keypair()
    ciphertext, shared_secret_enc = oqs.KeyEncapsulation("ML-KEM-768").encap_secret(public_key)
    shared_secret_dec = kem.decap_secret(ciphertext)
    assert shared_secret_enc == shared_secret_dec
```

**SageMath**: dùng cho lattice research; `matrix(ZZ, ...).LLL()` cho lattice reduction.

---

## 14. Tóm Tắt

- **Shor's algorithm** giải IFP và DLP trong $O(\text{poly}(n))$ — phá RSA, ECDH, DH hoàn toàn.
- **Grover's algorithm** giảm brute-force từ $O(2^n)$ về $O(2^{n/2})$ — làm yếu symmetric, không phá.
- **CRQC chưa tồn tại** (2024) nhưng migration phải bắt đầu ngay vì "harvest now, decrypt later".
- **NIST PQC 2024**: 3 standards chính thức — ML-KEM (FIPS 203), ML-DSA (FIPS 204), SLH-DSA (FIPS 205).
- **4 gia đình PQC**: Lattice (strongest case, deployed), Hash (most conservative), Code (oldest), Isogeny (most compact, SIKE broken).
- **Hybrid schemes**: chiến lược transition được khuyến nghị.

---

## 15. References

- Shor, P.W. — *Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer*, SIAM Journal on Computing, 1997
- Grover, L.K. — *A Fast Quantum Mechanical Algorithm for Database Search*, ACM STOC, 1996
- Gidney, C. & Ekerå, M. — *How to factor 2048 bit RSA integers in 8 hours using 20 million noisy qubits*, Quantum, 2021
- NIST FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), FIPS 205 (SLH-DSA) — August 2024
- NIST IR 8547 — *Transition to Post-Quantum Cryptography Standards*, 2024
- Bernstein & Lange — *Post-quantum cryptography*, Nature, 2017
- Open Quantum Safe project — https://openquantumsafe.org
