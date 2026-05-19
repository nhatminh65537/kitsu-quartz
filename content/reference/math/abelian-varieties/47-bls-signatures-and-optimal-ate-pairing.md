---
title: "47. BLS Signatures and Optimal Ate Pairing"
type: application
tags: [math, abelian-varieties, lesson-47, BLS-signature, optimal-ate, BN-curve, BLS12-381, Ethereum]
aliases: [BLS Signatures, Optimal Ate Pairing]
created: 2026-05-18
---

> **Prerequisites**: [[46-tate-lichtenbaum-pairing|46. Tate–Lichtenbaum Pairing]], [[45-pairings-cryptography|45. Pairings in Cryptography]]
> **Objectives**:
> - Nắm vững hệ chữ ký BLS: KeyGen, Sign, Verify, và chứng minh bảo mật dựa trên co-CDH
> - Hiểu tính năng **signature aggregation** — điểm mạnh độc đáo của BLS so với ECDSA/Schnorr
> - Hiểu optimal Ate pairing: định nghĩa, Miller loop ngắn nhất có thể, và lý do tại sao nó tối ưu
> - Kết nối với BLS12-381 và Ethereum 2.0 — ứng dụng thực tế quy mô nhất của lý thuyết này

---

## Motivation / Intuition

Trong giao thức Proof-of-Stake (PoS) của Ethereum 2.0, mỗi slot (12 giây) có hàng trăm nghìn validators cần **ký chứng thực** rằng một block hợp lệ. Nếu dùng ECDSA hay Schnorr, aggregator phải lưu trữ và truyền tải hàng trăm nghìn chữ ký riêng lẻ — tốn băng thông khổng lồ.

BLS signature (Boneh–Lynn–Shacham, 2001) giải quyết vấn đề này: **mọi chữ ký có thể cộng lại thành một chữ ký duy nhất**, dù là 10 hay 500.000 chữ ký. Việc xác minh chữ ký aggregate chỉ cần $O(n)$ phép cộng điểm trên đường cong cộng với **một** phép tính pairing (thay vì $n$ pairings riêng lẻ). Đây là lý do Ethereum 2.0 chọn BLS signatures với đường cong BLS12-381.

Nhưng BLS signature hoạt động không thể tách rời với pairing hiệu quả. Bài học này kết nối điểm đỉnh lý thuyết — **optimal Ate pairing** — với ứng dụng thực tiễn quan trọng nhất của toàn bộ roadmap.

---

## Setup: Bilinear Groups và Hash-to-Curve

### Framework

> [!definition] Definition 47.1 — Bilinear Group Triple
>
> Một **bilinear group triple** (bộ ba nhóm song tuyến) là bộ $(\mathbb{G}_1, \mathbb{G}_2, \mathbb{G}_T, e, r)$ trong đó:
> - $\mathbb{G}_1, \mathbb{G}_2, \mathbb{G}_T$ là nhóm cyclic bậc $r$ nguyên tố.
> - $e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$ là bilinear pairing (non-degenerate, efficient).
> - $g_1$ là generator của $\mathbb{G}_1$, $g_2$ là generator của $\mathbb{G}_2$.
>
> Viết theo lối cộng trên $\mathbb{G}_1, \mathbb{G}_2$ và lối nhân trên $\mathbb{G}_T$:
>
> $$
> e([a]P, [b]Q) = e(P, Q)^{ab}, \quad \forall P \in \mathbb{G}_1, Q \in \mathbb{G}_2, a,b \in \mathbb{Z}
> $$

### Hash-to-Curve

Trong BLS signatures, cần hàm $H: \{0,1\}^* \to \mathbb{G}_1$ ánh xạ thông điệp lên điểm trên đường cong. Đây là yêu cầu phi tầm thường: không thể chỉ hash rồi nhân với generator (sẽ biết discrete log của điểm kết quả, vi phạm bảo mật).

> [!definition] Definition 47.2 — Hash-to-Curve (Indistinguishable from Random)
>
> Hàm $H: \{0,1\}^* \to \mathbb{G}_1$ được gọi là **hash-to-curve an toàn** nếu: với adversary bất kỳ không biết $r$ sao cho $H(m) = [r]g_1$ (tức không biết discrete log của output), $H$ tính toán được hiệu quả.
>
> Các phương pháp thực tế:
> - **Try-and-increment**: hash thông điệp, thử làm x-coordinate, tìm y. Xác suất thành công ~1/2 mỗi lần, thời gian trung bình $O(1)$. Nhược: không constant-time.
> - **SWU (Simplified Weierstrass Uniform)**: Fouque–Tibouchi (2012), deterministic, constant-time. Chuẩn IETF RFC 9380.
> - **Shallue–van de Woestijne**: deterministic, phổ biến cho các curve Weierstrass tổng quát.

---

## BLS Signature Scheme

### Định Nghĩa

> [!definition] Definition 47.3 — BLS Signature Scheme
>
> **Parameters**: Bilinear group triple $(\mathbb{G}_1, \mathbb{G}_2, \mathbb{G}_T, e, r)$, generator $g_2 \in \mathbb{G}_2$, hash function $H: \{0,1\}^* \to \mathbb{G}_1$.
>
> **KeyGen**: Chọn $x \xleftarrow{\$} \mathbb{Z}_r^\times$. Public key: $\mathsf{pk} = [x]g_2 \in \mathbb{G}_2$. Secret key: $\mathsf{sk} = x$.
>
> **Sign**: Cho thông điệp $m \in \{0,1\}^*$:
>
> $$
> \sigma = [x] \cdot H(m) \in \mathbb{G}_1
> $$
>
> **Verify**: Cho $(\mathsf{pk}, m, \sigma)$:
>
> $$
> \text{Accept iff } e(\sigma, g_2) = e(H(m), \mathsf{pk})
> $$

> [!abstract] Theorem 47.4 — Correctness of BLS Verification
>
> Nếu $\sigma = [x]H(m)$ là chữ ký hợp lệ và $\mathsf{pk} = [x]g_2$, thì điều kiện verification luôn thỏa:
>
> $$
> e(\sigma, g_2) = e([x]H(m), g_2) = e(H(m), g_2)^x = e(H(m), [x]g_2) = e(H(m), \mathsf{pk})
> $$

**Proof.** Áp dụng bilinearity ở bước 2: $e([x]H(m), g_2) = e(H(m), g_2)^x$. Ở bước 3: $e(H(m), g_2)^x = e(H(m), [x]g_2)$. $\blacksquare$

> [!example] Example 47.5 — BLS Walkthrough (Concrete Numbers)
>
> **Setup toy** (không an toàn, chỉ demo):
> Dùng đường cong $E: y^2 = x^3 + 4$ over $\mathbb{F}_{1009}$, bậc $r = 1013$ (giả định $r \mid \#E$).
>
> - $g_2 = (1, 2) \in \mathbb{G}_2$, $H(m) = (5, 3) \in \mathbb{G}_1$ (toy hash).
> - Alice chọn $x = 17$ làm secret key.
> - Public key: $\mathsf{pk} = 17 \cdot (1,2) = (435, 601)$ (tính bằng double-and-add).
>
> **Signing**: $\sigma = 17 \cdot (5, 3) = (211, 704)$.
>
> **Verification**: Tính $e(\sigma, g_2)$ và $e(H(m), \mathsf{pk})$:
> $$
> e((211,704), (1,2)) \stackrel{?}{=} e((5,3), (435,601))
> $$
> Cả hai đều bằng $e((5,3),(1,2))^{17}$ theo bilinearity. ✓

---

## Bảo Mật BLS: Co-CDH Assumption

### Giả Thiết Bảo Mật

BLS signature an toàn (existentially unforgeable under CMA) dưới giả thiết co-CDH (co-Computational Diffie-Hellman) trong mô hình random oracle.

> [!definition] Definition 47.6 — co-CDH Problem
>
> Cho $\mathbb{G}_1, \mathbb{G}_2, g_1, g_2$. Bài toán **co-CDH** (co-Computational Diffie-Hellman): cho $[a]g_1 \in \mathbb{G}_1$ và $[b]g_2 \in \mathbb{G}_2$, tính $[ab]g_1 \in \mathbb{G}_1$.
>
> Đây là variant "asymmetric" của CDH: nhận input từ hai nhóm khác nhau.

> [!abstract] Theorem 47.7 — Bảo Mật BLS (Sketch)
>
> Trong Random Oracle Model, nếu bài toán co-CDH là khó trên $(\mathbb{G}_1, \mathbb{G}_2)$, thì BLS signature scheme là **EUF-CMA** (existentially unforgeable under chosen-message attack).
>
> Tức là: không adversary nào với thời gian polynomial có thể giả mạo chữ ký cho thông điệp mới sau khi đã thấy chữ ký của một số thông điệp tùy chọn.

**Proof sketch.**
Giả sử adversary $\mathcal{A}$ giả mạo chữ ký cho thông điệp $m^*$ chưa được ký. Ta xây dựng reducer $\mathcal{R}$ giải co-CDH:

**Input của $\mathcal{R}$**: $([a]g_1, [b]g_2) \in \mathbb{G}_1 \times \mathbb{G}_2$. **Goal**: tìm $[ab]g_1$.

$\mathcal{R}$ giả lập experiment cho $\mathcal{A}$:
- Đặt $\mathsf{pk} = [b]g_2$ (nên $x = b$, nhưng $\mathcal{R}$ không biết $b$).
- Chọn một chỉ số $i^*$ random trong $\{1, \ldots, q_H\}$.
- Simulated $H$: với query thứ $i \ne i^*$, trả về $[\rho_i]g_1$ với $\rho_i$ ngẫu nhiên. Với $i = i^*$ (thông điệp $m^*$), trả về $[a]g_1$ (bí mật với $\mathcal{A}$ vì hash là random oracle).
- Simulated Sign: với thông điệp $m_i$ ($i \ne i^*$), trả về $[b\rho_i]g_1$ (vì $\mathcal{R}$ biết $\rho_i$ và $\mathsf{pk} = [b]g_2$, dùng bilinearity).
- Khi $\mathcal{A}$ forge $\sigma^*$ cho $m^*$: vì $H(m^*) = [a]g_1$, chữ ký hợp lệ $\sigma^* = [xb \cdot a]g_1 = [ab \cdot b]/[b] \ldots$ — cụ thể hơn, $\sigma^* = [x]H(m^*) = [b][a]g_1 = [ab]g_1$!

Vậy $\mathcal{R}$ nhận được $[ab]g_1$, giải co-CDH. $\blacksquare$

---

## Signature Aggregation — Siêu Năng Lực Của BLS

Đây là tính năng làm BLS trở thành lựa chọn tất yếu cho blockchain consensus.

### Aggregation Đơn Giản

> [!abstract] Theorem 47.8 — BLS Signature Aggregation
>
> Cho $n$ cặp public key và thông điệp: $({\sf pk}_i, m_i)$ với $i = 1, \ldots, n$. Mỗi signer $i$ tạo chữ ký $\sigma_i = [x_i]H(m_i)$.
>
> **Aggregate signature**:
> $$
> \sigma_{\mathsf{agg}} = \sum_{i=1}^n \sigma_i = \sum_{i=1}^n [x_i]H(m_i) \in \mathbb{G}_1
> $$
>
> **Aggregate verification**: Chấp nhận $\sigma_{\mathsf{agg}}$ cho $(({\sf pk}_i, m_i))_{i=1}^n$ khi và chỉ khi:
>
> $$
> e(\sigma_{\mathsf{agg}}, g_2) = \prod_{i=1}^n e(H(m_i), {\sf pk}_i)
> $$
>
> Độ phức tạp verification: $O(n)$ hash-to-curve, $O(n)$ pairings ở vế phải (có thể tối ưu với multi-pairing), **1** pairing ở vế trái.

**Proof.**
$$
e(\sigma_{\mathsf{agg}}, g_2) = e\!\left(\sum_i [x_i]H(m_i),\, g_2\right) = \prod_i e([x_i]H(m_i), g_2) = \prod_i e(H(m_i), g_2)^{x_i} = \prod_i e(H(m_i), [x_i]g_2) = \prod_i e(H(m_i), {\sf pk}_i)
$$

Dòng 2 dùng bilinearity ở đầu vào thứ nhất. Dòng 3 dùng bilinearity theo đầu vào thứ hai. $\blacksquare$

> [!warning] Counterexample 47.9 — Rogue Key Attack và Biện Pháp Phòng Thủ
>
> Aggregation đơn giản **dễ bị tấn công** nếu không có biện pháp bảo vệ. **Rogue key attack**: kẻ tấn công Carol đăng ký public key ${\sf pk}_{\text{carol}} = [c]g_2 - {\sf pk}_{\text{alice}}$. Khi aggregate:
>
> $$
> {\sf pk}_{\text{agg}} = {\sf pk}_{\text{alice}} + {\sf pk}_{\text{carol}} = [c]g_2
> $$
>
> Carol có thể ký thay cho Alice mà không cần biết $x_{\text{alice}}$!
>
> **Biện pháp phòng thủ** (2 cách):
>
> 1. **Proof of Possession (PoP)**: Mỗi signer phải chứng minh biết discrete log của public key (ký lên chính public key của mình).
> 2. **Hash-and-Scale**: Nhân mỗi public key với $h_i = H'({\sf pk}_i, {\sf pk}_1, \ldots, {\sf pk}_n) \in \mathbb{Z}_r$ (deterministic per nhóm). Được dùng trong BLS threshold signatures.
>
> Ethereum 2.0 dùng **Proof of Possession**: mỗi validator ký lên public key của mình trong quá trình deposit.

### Same-Message Aggregation

Khi tất cả $n$ signers ký **cùng một thông điệp** $m$:

$$
\sigma_{\mathsf{agg}} = \sum_i [x_i]H(m) = \left[\sum_i x_i\right] H(m)
$$

$$
{\sf pk}_{\mathsf{agg}} = \sum_i {\sf pk}_i = \left[\sum_i x_i\right] g_2
$$

Verification: $e(\sigma_{\mathsf{agg}}, g_2) \stackrel{?}{=} e(H(m), {\sf pk}_{\mathsf{agg}})$ — chỉ **một** pairing evaluation! Đây là trường hợp quan trọng nhất trong blockchain: tất cả validators chứng thực cùng một block.

> [!example] Example 47.10 — Ethereum 2.0 Validator Aggregation
>
> Một slot Ethereum 2.0 có ~500.000 active validators. Mỗi slot, khoảng 16.000 validators được chọn làm committee cho một beacon block.
>
> Không có BLS aggregation: aggregator phải thu thập 16.000 chữ ký $\times$ 96 bytes = 1.5 MB dữ liệu chữ ký, và verifier phải thực hiện 16.000 phép pairing (~nhiều giây).
>
> **Với BLS aggregation**: một chữ ký tổng hợp duy nhất = 96 bytes, verification = 1 pairing (~1 ms). Tiết kiệm băng thông và thời gian xác minh theo hệ số $\sim 16.000$.

---

## Optimal Ate Pairing — Thuật Toán Tốt Nhất

### Từ Ate đến Optimal Ate

Đã thấy ở bài 46: Ate pairing dùng Miller loop theo $T = t - 1$, ngắn hơn Tate $\approx \sqrt{k}$ lần. Nhưng câu hỏi tự nhiên: đây có phải loop ngắn nhất có thể không?

Vercauteren (2010) trả lời: **có thể ngắn hơn nữa**, và chứng minh **cận dưới** cho độ dài Miller loop của mọi pairing tính được hiệu quả. Pairing đạt cận này gọi là **optimal pairing**.

> [!definition] Definition 47.11 — Optimal Pairing
>
> Một pairing $e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$ được gọi là **optimal** nếu nó có thể được tính với:
>
> $$
> \frac{\log_2 r}{\varphi(k)} + \varepsilon \quad \text{iterations trong Miller loop}
> $$
>
> trong đó $\varphi$ là Euler phi-function và $\varepsilon$ là số hạng sai số nhỏ.
>
> Đây là cận dưới lý thuyết: không thể có Miller loop ngắn hơn $\log_2 r / \varphi(k)$ bước (tính trung bình trên tất cả representations của pairing).

### Cấu Trúc của Optimal Ate Pairing

> [!definition] Definition 47.12 — Optimal Ate Pairing (General)
>
> Cho $E/\mathbb{F}_q$ pairing-friendly với embedding degree $k$. Gọi $r$ là subgroup prime order. Xét $\lambda = mr$ với $r \nmid m$, viết:
>
> $$
> \lambda = \sum_{i=0}^{L} c_i q^i \quad (c_i \in \mathbb{Z}, |c_i| \text{ nhỏ})
> $$
>
> **Optimal Ate pairing** định nghĩa:
>
> $$
> a_{\lambda}(Q, P) = \left(\prod_{i=0}^{L} f_{c_i, Q}^{q^i}(P) \cdot \prod_{i=0}^{L-1} \ell_{[\sum_{j=i+1}^L c_j q^j]Q, [c_i q^i]Q}(P)\right)^{(q^k-1)/r}
> $$
>
> Miller loop chạy theo $c_L$ (số nhỏ nhất trong biểu diễn), với $\lfloor \log_2(|c_L|) \rfloor + \varepsilon$ iterations — **tối ưu**.

Điều kỳ diệu: Frobenius $\pi_q$ trên $\mathbb{G}_2$ hành động như phép nhân thông thường ($\pi_q(Q) = [q]Q$ với $Q \in \mathbb{G}_2$), nên $[q^i]Q$ có thể tính cực nhanh bằng $i$ lần áp dụng Frobenius — không cần scalar multiplication!

### Optimal Ate trên BN Curves

Barreto–Naehrig (BN) curves là gia đình đường cong $k = 12$ được parameterized bởi $u \in \mathbb{Z}$:

$$
p(u) = 36u^4 + 36u^3 + 24u^2 + 6u + 1
$$
$$
r(u) = 36u^4 + 36u^3 + 18u^2 + 6u + 1
$$
$$
t(u) = 6u^2 + 1 \quad \text{(trace of Frobenius)}
$$

Khi đó $T = t - 1 = 6u^2$, và optimal ate pairing trên BN curve dùng $\lambda = 6u + 2$:

$$
\text{Miller loop length} = \lfloor \log_2 |6u + 2| \rfloor + O(1) \approx \frac{1}{4} \log_2 r
$$

So với Tate ($\log_2 r$) và Ate ($\frac{1}{2}\log_2 r$ do $T \approx \sqrt{r}$), optimal Ate ngắn thêm ~2 lần so với Ate và ~4 lần so với Tate!

---

## BLS12-381 — Đường Cong Chuẩn Của Thời Đại

### Lịch Sử và Thiết Kế

BLS12-381 thuộc gia đình **Barreto–Lynn–Scott** (khác với BLS signatures — trùng chữ viết tắt nhưng khác tác giả!), do Sean Bowe (Zcash Foundation) thiết kế năm 2017.

- **12**: embedding degree $k = 12$.
- **381**: characteristic $p$ là số nguyên tố 381-bit.
- Đường cong: $E: y^2 = x^3 + 4$ trên $\mathbb{F}_p$.

### Tham Số

> [!info] Property 47.13 — Tham Số BLS12-381
>
> Tham số trung tâm $x$ (biến parameterization):
>
> $$
> x = -0xd201000000010000 \approx -2^{63}
> $$
>
> (số âm, đặc biệt chọn để tối ưu Miller loop NAF).
>
> $$
> p = \frac{(x-1)^2(x^4 - x^2 + 1)}{3} + x \approx 2^{381} \quad \text{(381-bit prime)}
> $$
>
> $$
> r = x^4 - x^2 + 1 = \Phi_{12}(x) \approx 2^{255} \quad \text{(255-bit prime subgroup order)}
> $$
>
> $$
> t = x + 1 \quad \text{(trace of Frobenius)}
> $$
>
> $\#E(\mathbb{F}_p) = p + 1 - t$ chứa subgroup cỡ $r$ (255-bit).
>
> **Twist**: $E'$ (M-type twist) over $\mathbb{F}_{p^2}$, chứa $\mathbb{G}_2 \subset E'(\mathbb{F}_{p^2})[r]$.
>
> **Tower extension**: $\mathbb{F}_{p^{12}}$ được xây dựng qua tower:
> $$
> \mathbb{F}_{p^2} = \mathbb{F}_p[u]/(u^2 + 1), \quad \mathbb{F}_{p^6} = \mathbb{F}_{p^2}[v]/(v^3 - u - 1), \quad \mathbb{F}_{p^{12}} = \mathbb{F}_{p^6}[w]/(w^2 - v)
> $$

### Tại Sao BLS12-381 Thay Thế BN254?

Trước 2017, BN254 (còn gọi là alt-bn128) là chuẩn de facto cho $k=12$. Nhưng Kim–Barbulescu (2016) phát hiện variant mới của NFS (exTNFS) tấn công DLP trong $\mathbb{F}_{q^{12}}$ hiệu quả hơn, hạ security level của BN254 từ 128 xuống ~100 bits.

> [!info] Property 47.14 — So Sánh BN254 và BLS12-381
>
> | Thuộc tính | BN254 | BLS12-381 |
> |-----------|-------|-----------|
> | $k$ | 12 | 12 |
> | $p$ (bits) | 254 | 381 |
> | $r$ (bits) | 254 | 255 |
> | $\mathbb{G}_1$ size | 32 bytes | 48 bytes |
> | $\mathbb{G}_2$ size | 64 bytes | 96 bytes |
> | $\mathbb{G}_T$ (compressed) | ~256 bytes | ~384 bytes |
> | Security level | ~100 bits (sau exTNFS) | ~128 bits |
> | Miller loop | $\sim 64$ iterations | $\sim 64$ iterations |
> | Dùng trong | Ethereum 1.0 precompile, Zcash trước 2017 | **Ethereum 2.0**, Zcash Sapling+, Filecoin, Chia |

### Optimal Ate trên BLS12-381

Với BLS12-381, optimal Ate pairing được tính theo $x \approx -2^{63}$:

$$
e(P, Q) = \left(f_{|x|, Q}(P)\right)^{(p^{12}-1)/r}
$$

Miller loop chạy theo $|x| = |{-0xd201000000010000}|$, có NAF representation với **chỉ 3 bit khác 0** trong 64 bit! Điều này nghĩa là gần như toàn bộ loop chỉ có doubling (không cần addition bước nào), cực kỳ hiệu quả.

---

## Từ Lý Thuyết Đến Implementation

### Cấu Trúc Tổng Thể Tính Optimal Ate trên BLS12-381

```
Input: P ∈ G1 = E(F_p)[r], Q ∈ G2 = E'(F_{p^2})[r]
Output: e(P,Q) ∈ G_T = μ_r ⊂ F_{p^12}*

Step 1: Miller Loop
  f ← 1 ∈ F_{p^12}
  T ← Q ∈ G2
  for i = 62 downto 0:         (bit length of |x| = 63)
      f ← f^2 · tangent(T, P)  (line function at tangent)
      T ← 2T
      if NAF_bit[i] = ±1:
          f ← f · chord(T, ±Q, P)
          T ← T ± Q
  if x < 0:
      f ← f^{-1};  T ← -T        (adjust for sign of x)

Step 2: Frobenius Corrections (phần của final exponentiation)
  Q1 ← π_p(Q);  Q2 ← π_p^2(Q)    (fast via Frobenius on F_{p^2})
  f ← f · line(T, Q1, P)
  T ← T + Q1
  f ← f · line(T, -Q2, P)

Step 3: Final Exponentiation
  Easy part:  f ← f^{(p^6-1)(p^2+1)}    (via 2 Frobenius + inversions)
  Hard part:  f ← f^{(p^4-p^2+1)/r}      (via addition chain với x)
Output: f
```

> [!note] Remark 47.15 — Tower Field Arithmetic
>
> Để tối ưu multiplication trong $\mathbb{F}_{p^{12}}$, thư viện thực tế luôn sử dụng **tower extension**. Thay vì làm việc với đa thức bậc 12, ta dùng hierarchy:
>
> $$
> \mathbb{F}_{p^{12}} \cong \mathbb{F}_{p^6}[w]/(w^2 - v) \cong (\mathbb{F}_{p^2}[v]/(v^3 - u - 1))[w]/(w^2-v) \cong (\mathbb{F}_p[u]/(u^2+1)) \ldots
> $$
>
> Karatsuba multiplication ở mỗi level giảm số lượng $\mathbb{F}_p$ multiplications từ $O(k^2) = O(144)$ xuống $O(k^{1.6}) \approx O(18)$ đơn vị hiệu quả.

---

## SageMath Cheatsheet

```sage
# ===== BLS Signature (conceptual, using SageMath's EC) =====
# SageMath không có built-in BLS12-381, nhưng có thể demo nguyên lý

# Setup đường cong đơn giản để minh họa (không phải BLS12-381 thực)
p = 1009
F = GF(p)
E = EllipticCurve(F, [0, 4])   # y^2 = x^3 + 4 (dạng BLS)
n = E.order()
print("Order:", n, factor(n))

# Giả sử r = 11 | n, k = 2 (toy example)
r = 11
# Public parameters
G2 = E.random_point() * (n // r)  # G2 generator (toy)

# KeyGen
x = randint(1, r-1)   # secret key
pk = x * G2           # public key

# Hash-to-curve (toy: map integer to point)
def H_toy(m):
    """Hash integer m to a point of order r."""
    pt = E.random_point() * (n // r)  # toy, không cryptographic
    return pt

# Ký
m = b"Hello BLS"
Hm = H_toy(hash(m))   # toy hash
sigma = x * Hm

# Xác minh (cần Weil/Tate pairing)
# Trong SageMath với đường cong đơn giản:
k_emb = Mod(p, r).multiplicative_order()
Fk = GF(p^k_emb, 'a')
Ek = EllipticCurve(Fk, [0, 4])

sigma_lift = Ek(sigma)
G2_lift = Ek(G2)
Hm_lift = Ek(Hm)
pk_lift = Ek(pk)

# Verification equation: e(sigma, G2) == e(Hm, pk)
lhs = sigma_lift.weil_pairing(G2_lift, r)
rhs = Hm_lift.weil_pairing(pk_lift, r)
print("Verification:", lhs == rhs)  # True nếu chữ ký hợp lệ

# ===== Aggregation Demo =====
# Hai signers
x1 = randint(1, r-1); pk1 = x1 * G2
x2 = randint(1, r-1); pk2 = x2 * G2

# Ký cùng thông điệp
Hm = H_toy(42)
sig1 = x1 * Hm
sig2 = x2 * Hm

# Aggregate
sig_agg = sig1 + sig2           # cộng chữ ký
pk_agg = pk1 + pk2              # cộng public key

# Verify aggregate
sig_agg_lift = Ek(sig_agg)
pk_agg_lift = Ek(pk_agg)
Hm_lift = Ek(Hm)
G2_lift = Ek(G2)

lhs = sig_agg_lift.weil_pairing(G2_lift, r)
rhs = Hm_lift.weil_pairing(pk_agg_lift, r)
print("Aggregate verification:", lhs == rhs)  # True

# ===== Optimal Ate Pairing (pseudocode-style SageMath) =====
# Trên BLS12-381 thực, dùng thư viện chuyên biệt như py_ecc hoặc blspy
# Sau đây là skeleton:

def optimal_ate_bn(P, Q, u, p, r):
    """
    Optimal Ate pairing trên BN curve với parameter u.
    P ∈ G1 = E(Fp)[r], Q ∈ G2 = E'(Fp2)[r]
    """
    # NAF of (6u+2)
    c = 6*u + 2
    naf = c.naf()   # Non-Adjacent Form
    
    f = 1           # in Fp12
    T = Q           # accumulator point
    
    # Miller loop
    for bit in reversed(naf[1:]):  # skip leading 1
        f = f^2 * tangent_line(T, P)   # doubling step
        T = 2 * T
        if bit != 0:
            f = f * chord_line(T, bit*Q, P)  # addition step  
            T = T + bit * Q
    
    # Frobenius corrections (đặc trưng BN)
    Q1 = frobenius(Q, p)     # [p]Q via Frobenius
    Q2 = frobenius(Q1, p)    # [p^2]Q
    f = f * chord_line(T, Q1, P);  T = T + Q1
    f = f * chord_line(T, -Q2, P); T = T - Q2
    
    # Final exponentiation
    f = final_exp(f, p, r)
    return f
    
# Với BLS12-381 trong Python thực tế:
# from py_ecc.bls12_381 import G1, G2, pairing, multiply, add
# sig = multiply(G1, x)      # ký  
# e1 = pairing(sig, G2)
# e2 = pairing(H_to_G1(msg), multiply(G2, x))
# assert e1 == e2
```

---

## Ứng Dụng Khác Của Pairing-Based Crypto

Để hoàn thiện bức tranh, dưới đây là các ứng dụng nổi bật khác, tất cả đều dựa trên cùng lý thuyết toán học đã xây dựng trong roadmap:

> [!info] Property 47.16 — Các Ứng Dụng Pairing Quan Trọng
>
> | Ứng dụng | Pairing dùng để | Bài báo gốc |
> |---------|----------------|------------|
> | **BLS Signatures** | Aggregation, short signatures | Boneh–Lynn–Shacham 2001 |
> | **IBE** | Mã hóa dựa trên danh tính | Boneh–Franklin 2001 |
> | **NIZK Proofs (zk-SNARKs)** | Verification equation tuyến tính | Groth 2016 |
> | **Threshold Signatures** | Shamir secret sharing + BLS | Shoup 2000, Boldyreva 2003 |
> | **Attribute-Based Encryption (ABE)** | Fine-grained access control | Waters 2005 |
> | **Short Group Signatures** | Anonymity trong group | Boneh–Boyen–Shacham 2004 |
> | **Commitments (KZG)** | Polynomial commitments (dùng trong ETH sharding) | Kate–Zaverucha–Goldberg 2010 |
>
> Đặc biệt, **KZG polynomial commitments** — nền tảng của nhiều zkRollup và Ethereum danksharding — hoàn toàn dựa trên pairing bilinearity: để verify $f(z) = y$, chỉ cần một pairing evaluation.

---

## Summary / Key Takeaways

- **BLS Signature** (Boneh–Lynn–Shacham 2001): $\mathsf{sk} = x$, $\mathsf{pk} = [x]g_2$, $\sigma = [x]H(m)$. Verification: $e(\sigma, g_2) = e(H(m), \mathsf{pk})$.
- **Correctness** trực tiếp từ bilinearity: $e([x]H(m), g_2) = e(H(m), [x]g_2)$.
- **Bảo mật** dựa trên co-CDH trong Random Oracle Model. Khó giả mạo tương đương với khó giải co-CDH.
- **Signature aggregation**: $\sigma_{\mathsf{agg}} = \sum \sigma_i$, xác minh với $O(n)$ hash-to-curve + $n+1$ pairing evaluations. Khi cùng thông điệp: chỉ **1** pairing.
- **Rogue key attack**: bắt buộc dùng Proof of Possession hoặc hash-and-scale để an toàn khi aggregate.
- **Optimal Ate pairing**: Miller loop dài $\log_2 r / \varphi(k)$ — cận dưới lý thuyết. Nhanh hơn Ate $\approx 2\times$, nhanh hơn Tate $\approx 4\times$.
- **BLS12-381**: đường cong $y^2 = x^3 + 4$ trên $\mathbb{F}_p$ với $p$ 381-bit, $k = 12$. Chuẩn de facto cho 128-bit security từ 2017.
- **Ethereum 2.0** dùng BLS12-381 + optimal Ate + BLS signatures để cho phép 500K validators mỗi slot với chữ ký aggregate 96 bytes duy nhất.
- **Tower field arithmetic** và **denominator elimination** là hai tối ưu hóa quan trọng nhất để implementation thực tế.
- Roadmap hoàn chỉnh từ Abelian Varieties (Module 0-7) đến crypto (Module 8): Weil pairing → Tate pairing → Ate pairing → Optimal Ate → BLS signatures → Ethereum 2.0. Đây là con đường từ toán học thuần túy thế kỷ 19 (Jacobi, Abel) đến công nghệ blockchain thế kỷ 21.

---

## References

1. **Boneh, D., Lynn, B., Shacham, H.** — "Short Signatures from the Weil Pairing", *ASIACRYPT 2001*, LNCS 2248, Springer (2001), 514–532. Full version: *J. Cryptology*, 17 (2004), 297–319. *(BLS Signature original paper)*
2. **Vercauteren, F.** — "Optimal Pairings", *IEEE Trans. Information Theory*, 56 (2010), 455–461. *(Optimal pairing theory)*
3. **Barreto, P.S.L.M., Naehrig, M.** — "Pairing-Friendly Elliptic Curves of Prime Order", *SAC 2005*, LNCS 3897, Springer (2006), 319–331. *(BN curves)*
4. **Bowe, S.** — "BLS12-381: New zk-SNARK Elliptic Curve Construction", Electric Coin Company blog (2017). Online: electriccoin.co/blog/new-snark-curve/ *(BLS12-381 design)*
5. **Kim, T., Barbulescu, R.** — "Extended Tower Number Field Sieve: A New Complexity for the Medium Prime Case", *CRYPTO 2016*, LNCS 9814, Springer (2016), 543–571. *(exTNFS — attack motivating move from BN254 to BLS12-381)*
6. **Beuchat, J.L., González-Díaz, J.E., et al.** — "High-Speed Software Implementation of the Optimal Ate Pairing over Barreto–Naehrig Curves", *Pairing 2010*, LNCS 6487, Springer (2010), 21–39.
7. **Galbraith, S.D.** — *Mathematics of Public Key Cryptography*, Cambridge University Press (2012). Ch. 26 (pairings), Ch. 24 (BLS signatures). *(Tài liệu giảng dạy toàn diện)*
8. **Ethereum Foundation** — "BLS Signatures Spec", Ethereum 2.0 Phase 0 spec. Online: ethereum.github.io/consensus-specs/specs/phase0/beacon-chain/
9. **IETF RFC 9380** — "Hashing to Elliptic Curves", 2023. *(Chuẩn hash-to-curve)*
10. **IETF Draft** — "Pairing-Friendly Curves", draft-irtf-cfrg-pairing-friendly-curves. Online: ietf.org
11. **Barreto, P.S.L.M., Lynn, B., Scott, M.** — "Constructing Elliptic Curves with Prescribed Embedding Degrees", *SCN 2002*, LNCS 2576, Springer (2003), 257–267. *(BLS curve family)*
12. **Ben-Sasson, E., et al.** — "Groth16 SNARK paper**: Groth, J. — "On the Size of Pairing-Based Non-interactive Arguments", *EUROCRYPT 2016*, LNCS 9666 (2016), 305–326. *(zk-SNARKs dùng pairing)*
13. **Scott, M.** — "BLS12-381 For The Rest Of Us", hackmd.io/@benjaminion/bls12-381. *(Tutorial accessible nhất về BLS12-381)*
14. **Eth2book** — "Curve BLS12-381", upgrading-ethereum.info/part2/building_blocks/bls12-381/. *(Ethereum 2.0 context)*
