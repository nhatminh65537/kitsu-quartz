---
title: "20. ECC Fundamentals"
type: mathematical-component
tags: [crypto, ecc, elliptic-curve, group-law, ecdlp]
aliases: [ECC Fundamentals, Duong cong elliptic]
created: 2026-04-18
---

> **Prerequisites**: [[04-modular-arithmetic|04 — Modular Arithmetic]] (GF(p), nhóm, generator), [[18-diffie-hellman-dlp|18 — Diffie-Hellman & DLP]] (cyclic group, discrete log)  
> **Lesson type**: Mathematical Component
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{F}_p$ | Trường hữu hạn $\{0,\ldots,p-1\}$ với phép tính mod $p$ |
> | $p$ | Số nguyên tố lớn (characteristic của field) |
> | $O$ | Điểm ở vô cực — phần tử trung hòa của nhóm đường cong |
> | $n$ | Bậc (order) của generator point $G$ |
> | $h$ | Cofactor: $h = \lvert E(\mathbb{F}_p)\rvert / n$ |
> | $\mathbb{Z}_n$ | Vành số nguyên modulo $n$ |
> | $\lambda$ | Hệ số góc (slope) trong công thức point addition |
> | $\Delta$ | Discriminant của Weierstrass equation: $-16(4a^3+27b^2)$ |

---

## 1. Motivation

Ở các bài học trước, ta thấy RSA và Diffie-Hellman đều dựa trên bài toán khó trong nhóm số học — IFP và DLP trong $\mathbb{Z}_p^*$. Câu hỏi tự nhiên: có nhóm nào khác cho phép xây dựng crypto với **khóa nhỏ hơn nhưng bảo mật tương đương** không?

Câu trả lời là **đường cong elliptic** (elliptic curve). Năm 1985, Neal Koblitz và Victor Miller độc lập đề xuất dùng nhóm điểm trên đường cong elliptic cho mật mã. Ưu điểm cốt lõi: để đạt 128-bit security, RSA cần khóa 3072-bit, còn ECC chỉ cần 256-bit — nhỏ hơn **12 lần**. Điều này quan trọng đặc biệt trong thiết bị nhúng, thẻ thông minh, và giao tiếp không dây.

---

## 2. Đường cong Elliptic là gì?

### 2.1. Phương trình Weierstrass

Trong mật mã, đường cong elliptic thường biểu diễn dưới dạng **short Weierstrass equation**:

$$
E: \quad y^2 = x^3 + ax + b
$$

trong đó $a, b$ là hằng số, và phép tính thực hiện trong trường hữu hạn $\mathbb{F}_p$ (modulo $p$).

> [!note] định nghĩa — Elliptic Curve over $\mathbb{F}_p$
> Cho $p > 3$ là số nguyên tố, $a, b \in \mathbb{F}_p$ thỏa:
>
> $$
> \Delta = -16(4a^3 + 27b^2) \neq 0 \pmod{p}
> $$
>
> **Đường cong elliptic** $E(\mathbb{F}_p)$ là tập hợp:
>
> $$
> E(\mathbb{F}_p) = \bigl\{(x, y) \in \mathbb{F}_p^2 \mid y^2 \equiv x^3 + ax + b \pmod{p}\bigr\} \cup \{O\}
> $$
>
> với $O$ là **điểm ở vô cực** (point at infinity), đóng vai trò phần tử trung hòa.

Điều kiện $\Delta \neq 0$ đảm bảo đường cong **non-singular** — không có điểm nào mà đạo hàm đồng thời bằng 0 (không có cusp hay node). Đây là điều kiện bắt buộc để group law có cấu trúc tốt. Khi $\Delta = 0$, đường cong bị suy biến (singular).

**Lưu ý về tên gọi**: Tên "elliptic" không liên quan đến hình dạng ellipse. Tên xuất phát từ *elliptic integral* (tích phân elliptic) trong toán học thế kỷ 19.

**Ví dụ nhỏ**: Xét $E: y^2 = x^3 - x$ trên $\mathbb{F}_{89}$. Đây là đường cong hữu hạn với 72 điểm. Vì ta làm việc trong $\mathbb{F}_{89}$, các điểm trông như "đám mây ngẫu nhiên" trong ô vuông — không phải parabola trơn.

---

## 3. Quy tắc cộng điểm (Group Law)

Tập $E(\mathbb{F}_p)$ tạo thành một **nhóm Abel** (abelian group) với phép toán gọi là **point addition**. Quy tắc cộng dựa trên **chord-and-tangent rule** — mô tả hình học trên số thực, sau đó chuyển thành công thức đại số cho số hữu hạn.

![[assets/img-01-ecc-group-law.png]]
*Group law: Point Addition (trái), Point Doubling (giữa), Point at Infinity (phải). Đường thẳng qua hai điểm cắt đường cong tại điểm thứ ba, phản chiếu qua trục x cho kết quả.*

### 3.1. Point Addition: $P + Q$ với $P \neq Q$

Cho $P = (x_1, y_1)$ và $Q = (x_2, y_2)$ với $x_1 \neq x_2$. Đường thẳng qua $P$ và $Q$ cắt đường cong tại điểm thứ ba $-R$. Phản chiếu $-R$ qua trục x cho $R = P + Q$.

> [!note] Công thức Point Addition ($P \neq Q$, $x_1 \neq x_2$)
>
> $$
> \lambda = (y_2 - y_1) \cdot (x_2 - x_1)^{-1} \pmod{p}
> $$
>
> $$
> x_3 = \lambda^2 - x_1 - x_2 \pmod{p}
> $$
>
> $$
> y_3 = \lambda(x_1 - x_3) - y_1 \pmod{p}
> $$
>
> **Output**: $P + Q = (x_3, y_3)$

Phép chia trong $\mathbb{F}_p$ là nhân với modular inverse: $(y_2 - y_1) \cdot (x_2 - x_1)^{-1} \pmod{p}$.

### 3.2. Point Doubling: $2P$

Khi $P = Q$, không có đường thẳng duy nhất qua hai điểm. Ta dùng **tiếp tuyến** tại $P$ — hệ số góc tính bằng implicit differentiation từ $y^2 = x^3 + ax + b$:

> [!note] Công thức Point Doubling ($y_1 \neq 0$)
>
> $$
> \lambda = (3x_1^2 + a) \cdot (2y_1)^{-1} \pmod{p}
> $$  
> $$
> x_3 = \lambda^2 - 2x_1 \pmod{p}
> $$  
> $$
> y_3 = \lambda(x_1 - x_3) - y_1 \pmod{p}
> $$
>
> **Trường hợp đặc biệt**: Nếu $y_1 = 0$ thì $2P = O$.

### 3.3. Point at Infinity và nghịch đảo

> [!note] định nghĩa — Identity và Inverse
> - $O$ là **phần tử trung hòa**: $P + O = O + P = P$ với mọi $P$.
> - **Nghịch đảo** của $P = (x, y)$ là $-P = (x,\; {-y \bmod p})$.
> - $P + (-P) = O$.

Khi $P = -Q$ (tức $x_1 = x_2$, $y_1 + y_2 \equiv 0$), đường thẳng qua $P$ và $Q$ thẳng đứng, không cắt đường cong ở hữu hạn → kết quả là $O$.

Tập $E(\mathbb{F}_p)$ với phép cộng điểm thỏa mãn tất cả tiên đề nhóm: đóng, kết hợp, có identity, có inverse, và giao hoán (abelian). Tính associativity được chứng minh qua tọa độ đại số hoặc lý thuyết đường cong đại số (Bezout's theorem).

---

## 4. Scalar Multiplication và Thuật toán Double-and-Add

**Scalar multiplication** là tính $kP$ — cộng $P$ với chính nó $k$ lần:

$$
kP = \underbrace{P + P + \cdots + P}_{k \text{ lần}}
$$

Với $k$ lớn (256-bit), không thể cộng từng bước. Ta dùng **double-and-add algorithm** — analog của square-and-multiply trong RSA:

![[assets/img-02-scalar-mult.png]]
*Double-and-Add: tính $13P = (1101)_2 P$ chỉ cần 6 phép toán thay vì 12.*

> [!note] Thuật toán Double-and-Add
> **Input**: $k \in \mathbb{Z}_{>0}$ (n-bit), $P \in E(\mathbb{F}_p)$
> **Output**: $kP$
>
> 1. $R \leftarrow O$; $Q \leftarrow P$
> 2. Trong khi $k > 0$:
>    - Nếu $k \bmod 2 = 1$: $R \leftarrow R + Q$
>    - $Q \leftarrow Q + Q$; $k \leftarrow \lfloor k/2 \rfloor$
> 3. Return $R$

**Độ phức tạp**: $O(\log k)$ phép point operation — với $k$ 256-bit, chỉ cần ~384 operations.

> [!warning] Side-Channel Vulnerability
> Double-and-add naïve lộ pattern ADD/DOUBLE theo bit của $k$ qua timing hay power analysis. Thực tế dùng **Montgomery ladder** (luôn thực hiện cả DOUBLE lẫn ADD dù bit 0 hay 1) để chống side-channel.

**Một chiều (trapdoor)**: Tính $kP$ từ $k$ và $P$ dễ — $O(\log k)$. Biết $P$ và $Q = kP$, tìm $k$ là ECDLP — không có thuật toán hiệu quả.

---

## 5. ECDLP — Bài toán nền tảng

> [!note] định nghĩa — ECDLP
> Cho $E(\mathbb{F}_p)$, generator $G$ bậc nguyên tố $n$, và $Q = kG$ với $k \in [1, n-1]$.  
> **ECDLP**: Biết $(G, Q)$, tìm $k$.  
> **Độ khó**: Thuật toán tốt nhất là Pollard rho với $O(\sqrt{n})$ group operations. Không có sub-exponential algorithm (khác DLP trong $\mathbb{Z}_p^*$).

**Tại sao ECDLP khó hơn DLP?**

Trong $\mathbb{Z}_p^*$, Index Calculus khai thác cấu trúc số học (smooth numbers, factorbase) để giải DLP trong sub-exponential time $L_p[1/3]$. Trên elliptic curve, không có cách tương tự — các điểm không có cấu trúc số học để khai thác. Kết quả:

| Primitive | Hard Problem | Best Attack | 128-bit security |
|-----------|-------------|-------------|-----------------|
| RSA | IFP | GNFS: $L_n[1/3]$ | 3072-bit key |
| DH ($\mathbb{Z}_p^*$) | DLP | Index Calculus: $L_p[1/3]$ | 3072-bit key |
| ECDH | ECDLP | Pollard rho: $O(\sqrt{n})$ | 256-bit key |

ECC nhỏ hơn ~12 lần về key size để đạt cùng security.

> [!abstract] Theorem — Hasse's Theorem
> Với mọi elliptic curve $E(\mathbb{F}_p)$:  
> $$
> \left| \lvert E(\mathbb{F}_p)\rvert - (p+1) \right| \leq 2\sqrt{p}
> $$

**Proof sketch.** Frobenius endomorphism $\phi_p: (x,y) \mapsto (x^p, y^p)$ thỏa $\phi_p^2 - t\phi_p + p = 0$ trong endomorphism ring với $|t| \leq 2\sqrt{p}$. Số điểm $|E(\mathbb{F}_p)| = p + 1 - t$. $\blacksquare$

Hasse's theorem đảm bảo luôn tồn tại curve với order nguyên tố lớn gần $p$ — điều kiện cần để xây dựng secure group.

---

## 6. Domain Parameters và Cấu trúc nhóm

### 6.1. Domain Parameters

Một **ECC domain parameter set** gồm bộ $(p, a, b, G, n, h)$:
- $p$: prime, kích thước trường $\mathbb{F}_p$
- $a, b$: hệ số Weierstrass
- $G$: generator point (tọa độ $x_G, y_G$)
- $n$: order của $G$ (phải là số nguyên tố)
- $h$: cofactor $= |E(\mathbb{F}_p)| / n$

Tất cả domain parameters là **public**. Bí mật chỉ là scalar $k$ (private key).

### 6.2. Cấu trúc nhóm

$E(\mathbb{F}_p)$ là nhóm Abel hữu hạn, đẳng cấu với $\mathbb{Z}_{n_1} \times \mathbb{Z}_{n_2}$ với $n_1 | n_2$. Trên prime field, thường $n_1 = 1$ (cyclic) hoặc $n_1$ rất nhỏ. Ta chọn curve sao cho $n$ nguyên tố lớn (để ECDLP khó trong subgroup) và $h$ nhỏ (để tránh small subgroup attack).

**Tiêu chí chọn curve an toàn**:
- $n$ nguyên tố lớn, $h$ nhỏ ($h \leq 8$)
- Curve không anomalous ($|E| \neq p$) — tránh Smart's attack
- Embedding degree $k$ đủ lớn — tránh MOV attack
- Không có CM discriminant nhỏ bất thường

---

## 7. Các Đường Cong Chuẩn

![[assets/img-03-standard-curves.png]]
*So sánh các đường cong elliptic chuẩn: security level, loại curve, và ứng dụng.*

> [!example] Curve quan trọng cần nhớ
>
> **secp256k1**: $y^2 = x^3 + 7$ trên $\mathbb{F}_p$ với $p = 2^{256} - 2^{32} - 977$.
> Koblitz curve của Certicom. Bitcoin và Ethereum dùng. Hệ số $a = 0$ cho phép thuật toán GLV accelerate scalar multiplication.
>
> **P-256 (secp256r1)**: NIST standard, phổ biến nhất trong TLS/HTTPS. Tham số ngẫu nhiên do NIST tạo ra — nguồn của tranh cãi về transparency.
>
> **Curve25519**: Montgomery curve $By^2 = x^3 + 486662x^2 + x$ trên $\mathbb{F}_{2^{255}-19}$. Bernstein 2006. Dùng cho DH (X25519). Thiết kế "nothing-up-my-sleeve" — mọi tham số được giải thích công khai. Cofactor $h = 8$, tự nhiên resistant to invalid curve attack trong Montgomery ladder.
>
> **Ed25519**: Twisted Edwards curve birationally equivalent Curve25519. Dùng cho EdDSA signatures. Nonce deterministic built-in.
>
> **BN254 / BLS12-381**: Pairing-friendly curves — dùng trong ZKP (Phase 7).

> [!warning] P-256 và NIST Controversy
> Tham số ngẫu nhiên của NIST curves (P-256, P-384, P-521) được tạo bằng cách hash một seed không giải thích. Sau revelations về DUAL_EC_DRBG backdoor (2013), cộng đồng trở nên hoài nghi. Tuy nhiên, **chưa có bằng chứng** P-256 bị backdoor. Curve25519 được thiết kế minh bạch hơn như phản ứng.

---

## 8. Coordinate Systems và Curve Forms

### 8.1. Weierstrass vs Montgomery vs Twisted Edwards

| Loại | Phương trình | Ưu điểm |
|------|--------------|----------|
| Short Weierstrass | $y^2 = x^3 + ax + b$ | Dạng chuẩn, mọi curve đều về được |
| Montgomery | $By^2 = x^3 + Ax^2 + x$ | Scalar mult nhanh (Montgomery ladder) |
| Twisted Edwards | $-x^2 + y^2 = 1 + dx^2y^2$ | Addition formula unified — không exception |

Curve25519 là Montgomery curve; Ed25519 là twisted Edwards curve. Cả hai **birationally equivalent** — có ánh xạ đại số đảo ngược giữa chúng, cùng group structure, chỉ khác representation.

### 8.2. Projective Coordinates

Công thức affine $(x, y)$ cần modular inverse ở mỗi bước (chậm vì inverse tốn kém). Thực tế dùng **Jacobian projective coordinates** $(X:Y:Z)$ với $x = X/Z^2$, $y = Y/Z^3$:
- Mỗi doubling/addition: chỉ dùng field multiplication, không cần inverse
- Inverse một lần cuối cùng để chuyển về affine

Điều này tăng tốc scalar multiplication đáng kể trên phần cứng thực.

---

## 9. Công cụ & Code

```python
from cryptography.hazmat.primitives.asymmetric.ec import (
    SECP256R1, generate_private_key
)
private_key = generate_private_key(SECP256R1())
public_key = private_key.public_key()
pub_numbers = public_key.public_numbers()
print(f"Qx = {pub_numbers.x}")
print(f"Qy = {pub_numbers.y}")
```

```python
p = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F
a, b = 0, 7
E = EllipticCurve(GF(p), [a, b])

G = E.gen(0)
n = G.order()
print(f"n = {n}")
print(f"n is prime: {n.is_prime()}")
print(f"|E| = {E.order()}")
print(f"cofactor h = {E.order() // n}")

k = randint(1, int(n) - 1)
Q = k * G
print(f"Q = {Q}")
```

> [!example] Tiny ECC trên SageMath
> ```python
> p = 17
> E = EllipticCurve(GF(p), [-1, 0])
> print(f"Points: {list(E.points())}")
> P = E.lift_x(GF(p)(1))
> print(f"3P = {3 * P}")
> print(f"|E| = {E.order()}")
> ```
> Chạy trên $E: y^2 = x^3 - x$ trên $\mathbb{F}_{17}$ để trực quan hóa phép cộng điểm với số nhỏ.

```python
from Crypto.PublicKey import ECC

P = ECC.EccPoint(x=Gx, y=Gy, curve='P-256')
Q = k * P
print(f"Q.x = {int(Q.x)}")
print(f"Q.y = {int(Q.y)}")
```

---

## 10. CTF Relevance

**⭐⭐⭐ Bắt buộc cho mọi ECC challenge**

Bài này là nền tảng để làm tất cả ECC CTF. Các dạng bài thực tế:

- Cho $p, a, b, G, n, Q$ — tính private key $k$ nếu curve yếu (anomalous, small order, singular)
- Verify điểm $P$ có nằm trên curve không: tính $y^2 \bmod p$ và $x^3 + ax + b \bmod p$, so sánh
- Tính scalar mult với số nhỏ để hiểu structure của group

**Recognition checklist**:
- Thấy $(p, a, b, G_x, G_y, n, h)$ trong source → ECC domain parameters
- Order $n \approx p$ (cụ thể $n = p$) → check anomalous: Smart's attack
- $n$ factorizes thành primes nhỏ → Pohlig-Hellman
- Server nhận điểm từ client mà không validate → invalid curve attack

---

## 11. Endomorphisms và GLV Speedup

### 11.1. Endomorphism là gì?

Một **endomorphism** của elliptic curve là ánh xạ $\phi: E \to E$ bảo toàn cấu trúc nhóm: $\phi(P + Q) = \phi(P) + \phi(Q)$. Endomorphism quan trọng nhất trong mật mã là **Frobenius endomorphism** $\phi_p: (x, y) \mapsto (x^p, y^p)$ — đã xuất hiện trong Hasse's theorem.

Ngoài Frobenius, một số curve đặc biệt có endomorphism hiệu quả bổ sung, và secp256k1 là ví dụ nổi bật.

### 11.2. GLV Speedup trên secp256k1

Secp256k1 ($y^2 = x^3 + 7$) có một đặc tính đặc biệt: tồn tại ánh xạ hiệu quả:

$$\phi(x, y) = (\beta x, y) \pmod{p}$$

trong đó $\beta$ là **căn bậc ba của đơn vị** trong $\mathbb{F}_p$ (nghĩa là $\beta^3 \equiv 1 \pmod{p}$, $\beta \neq 1$). Ánh xạ này là một endomorphism của secp256k1 vì nếu $(x, y)$ nằm trên curve, thì $(\beta x, y)$ cũng nằm trên curve (có thể kiểm tra trực tiếp từ phương trình $y^2 = x^3 + 7$, vì $(\beta x)^3 = \beta^3 x^3 = x^3$).

Điều quan trọng: $\phi$ tương ứng với phép nhân scalar $\lambda$ trong nhóm, tức $\phi(P) = \lambda P$ với $\lambda$ là căn bậc ba của đơn vị trong $\mathbb{Z}_n$.

> [!note] GLV Decomposition (Gallant-Lambert-Vanstone, 2001)
> Cho scalar $k \in [1, n-1]$, phân tích:
> $$k = k_1 + k_2 \lambda \pmod{n}$$
> sao cho $k_1, k_2 \approx \sqrt{n}$ — xấp xỉ 128 bit thay vì 256 bit.
>
> Khi đó: $kP = k_1 P + k_2 \lambda P = k_1 P + k_2 \phi(P)$
>
> Tính $\phi(P) = (\beta x_P, y_P)$ là miễn phí (chỉ 1 phép nhân). Sau đó chạy **Simultaneous double-and-add** trên hai scalar 128-bit thay vì một scalar 256-bit.

**Speedup thực tế**: Scalar multiplication giảm khoảng **43% số phép toán** so với standard double-and-add (vì hai scalar 128-bit thay vì một 256-bit, và simultaneous method tiết kiệm doublings chung).

Bitcoin's `libsecp256k1` (thư viện C được dùng trong Bitcoin Core) triển khai GLV này, đóng góp đáng kể vào hiệu suất ký và verify transaction.

```python
# SageMath: kiểm tra GLV trên secp256k1
p = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F
n = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
# β: căn bậc ba của đơn vị mod p
beta = Mod(2, p)^((p - 1) // 3)  # một trong hai căn bậc ba
# λ: căn bậc ba của đơn vị mod n
lam = Mod(2, n)^((n - 1) // 3)

E = EllipticCurve(GF(p), [0, 7])
G = E.gen(0)
P = 7 * G
phi_P = E(beta * P[0], P[1])  # ứng dụng endomorphism
print(phi_P == int(lam) * P)   # True: phi(P) = lambda * P
```

---

## 12. Point Compression và Encoding

### 12.1. Affine Coordinates và Bài Toán Lưu Trữ

Một điểm elliptic curve dạng affine $(x, y)$ cần hai field elements: với P-256 là $2 \times 32 = 64$ bytes. Tuy nhiên, nếu biết $x$, có thể recover $y$ từ $y^2 = x^3 + ax + b$ — chỉ không biết $y$ hay $-y$ (tức $p - y$).

**Point compression** lưu chỉ $x$ cùng 1 bit cho dấu của $y$, tiết kiệm ~50% không gian.

### 12.2. Compressed Point Format (SEC1 / X9.62)

Định nghĩa trong SEC1 (Standards for Efficient Cryptography) và ANSI X9.62:

| Format | Prefix | Nội dung | Size (P-256) |
|--------|--------|----------|--------------|
| Uncompressed | `0x04` | $x \| y$ | 65 bytes |
| Compressed (y chẵn) | `0x02` | $x$ | 33 bytes |
| Compressed (y lẻ) | `0x03` | $x$ | 33 bytes |
| Point at infinity | `0x00` | (none) | 1 byte |

Prefix `0x02` khi $y \bmod 2 = 0$ (y "chẵn"), `0x03` khi $y \bmod 2 = 1$.

**Decompress** — recover $(x, y)$ từ compressed form:
```python
def decompress_point(x, prefix, p, a, b):
    # Tính y^2 = x^3 + ax + b mod p
    y_sq = (pow(x, 3, p) + a * x + b) % p
    # Modular square root (p ≡ 3 mod 4 → Tonelli-Shanks đơn giản)
    y = pow(y_sq, (p + 1) // 4, p)
    # Chọn đúng căn theo parity
    if (y % 2) != (prefix - 2):  # prefix 02 → y chẵn, 03 → y lẻ
        y = p - y
    return (x, y)
```

### 12.3. Hash-to-Curve (RFC 9380)

Nhiều protocol (BLS signatures, VOPRF, OPAQUE) cần **ánh xạ một chuỗi bytes tùy ý sang điểm trên curve** theo cách uniform và deterministic. Đây không tầm thường — không thể chỉ hash rồi dùng làm $x$ vì không phải $x$ nào cũng có square root trong $\mathbb{F}_p$.

RFC 9380 (2023) chuẩn hóa các phương pháp hash-to-curve:

- **Elligator 2**: ánh xạ $\mathbb{F}_p \to E$ cho Montgomery curves (Curve25519). Nhanh, constant-time.
- **Simplified SWU**: cho Weierstrass curves (P-256, BLS12-381). Phổ biến nhất trong ZKP và BLS signatures.
- **Try-and-increment**: hash → $x$ → test if square root exists → repeat. Không constant-time, không dùng cho prod.

```python
# Python: hash-to-curve với library
from py_ecc.bls import G2ProofOfPossession as bls
# Internally uses hash-to-G2 per RFC 9380
msg = b"hello world"
point = bls.hash_to_G2(msg, b"dst", "sha256")
```

---

## 13. Extension Fields và Pairing-Friendly Curves

### 13.1. Extension Fields $\mathbb{F}_{p^k}$

Trường $\mathbb{F}_{p^k}$ (field extension bậc $k$ của $\mathbb{F}_p$) được xây dựng như không gian vector $k$-chiều over $\mathbb{F}_p$ với nhân theo polynomial irreducible bậc $k$.

Ví dụ: $\mathbb{F}_{p^2} \cong \mathbb{F}_p[i] / (i^2 + 1)$ — tương tự số phức trên $\mathbb{F}_p$. Phần tử có dạng $a + bi$ với $a, b \in \mathbb{F}_p$.

### 13.2. Binary Curves $\mathbb{F}_{2^m}$ (Deprecated)

Đường cong trên $\mathbb{F}_{2^m}$ (characteristic 2) từng được NIST chuẩn hóa (B-163, B-233, K-233). Ưu điểm phần cứng trước đây (bit manipulation thay field arithmetic) nay không còn relevance với modern CPUs.

**Vấn đề**: Một số binary curves có cấu trúc đặc biệt giúp thuật toán Weil descent hiệu quả hơn, giảm security. Ngoài ra, constant-time implementation khó hơn trên binary field. Kết luận: **NIST khuyến nghị không dùng binary curves mới** (NIST SP 800-186, 2023).

### 13.3. Pairing-Friendly Curves và Embedding Degree

**Embedding degree** $k$ của curve $E(\mathbb{F}_p)$ là số nguyên nhỏ nhất sao cho $n \mid p^k - 1$. Điều này xác định field extension cần thiết cho **Weil/Tate pairing** — ánh xạ $e: E(\mathbb{F}_p) \times E(\mathbb{F}_{p^k}) \to \mathbb{F}_{p^k}^*$.

| Curve | $k$ | Dùng cho | Security |
|-------|-----|----------|----------|
| secp256k1 | ~40 | ECDH/ECDSA — $k$ lớn → MOV không thực tế | 128-bit |
| BN254 | 12 | ZKP (Groth16, PLONK) | ~100-bit (đủ cho zkEVM) |
| BLS12-381 | 12 | ZKP, BLS signatures (Ethereum, Zcash) | 128-bit |

**BN254** (barreto-naehrig, 254-bit): pairing-friendly, hiệu suất pairing tốt trên 254-bit. Dùng trong zkSNARK (Groth16). Security thực tế ~100-bit sau NFS improvements 2016.

**BLS12-381** (bls, 381-bit): mạnh hơn BN254, embedding degree 12, trường mục tiêu $\mathbb{F}_{p^{12}}$. Ethereum 2.0, Zcash Sapling/Orchard. $|G_1| = $ 48 bytes, $|G_2| = $ 96 bytes, $|\mathbb{G}_T| = $ 576 bytes.

---

## 14. Summary

- **Elliptic curve** $E(\mathbb{F}_p): y^2 = x^3 + ax + b$ với $\Delta = -16(4a^3+27b^2) \neq 0$ tạo thành nhóm Abel hữu hạn.
- **Group law** (chord-and-tangent): Addition ($\lambda = (y_2-y_1)/(x_2-x_1)$), Doubling ($\lambda = (3x_1^2+a)/(2y_1)$), Identity là $O$.
- **Scalar multiplication** $kP$: double-and-add, $O(\log k)$ operations.
- **ECDLP**: Biết $G$, $Q = kG$ → tìm $k$. Không có sub-exponential algorithm.
- **Key size**: 256-bit ECC $\approx$ 3072-bit RSA về security.
- **Hasse**: $|E(\mathbb{F}_p)| = p + 1 - t$ với $|t| \leq 2\sqrt{p}$.
- **Curves**: secp256k1 (Bitcoin), P-256 (TLS), Curve25519/X25519 (modern DH khuyến nghị), Ed25519 (modern signatures).

---

## 15. References

- Koblitz, N. — *Elliptic Curve Cryptosystems*, Math. of Computation, 1987
- Miller, V. — *Use of Elliptic Curves in Cryptography*, CRYPTO 1985
- Bernstein & Lange — *SafeCurves: choosing safe curves for ECC* (safecurves.cr.yp.to)
- Silverman, J.H. — *The Arithmetic of Elliptic Curves*, Springer GTM 106
- Boneh & Shoup — *A Graduate Course in Applied Cryptography*, Ch. 15 (toc.cryptobook.us)
- Corbellini, A. — *ECC: a gentle introduction* (andrea.corbellini.name, 2015)
- NIST SP 800-186 — Recommendations for Elliptic Curve Domain Parameters
