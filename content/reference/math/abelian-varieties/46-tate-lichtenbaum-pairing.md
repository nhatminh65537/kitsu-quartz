---
title: "46. Tate–Lichtenbaum Pairing"
type: theory
tags: [math, abelian-varieties, lesson-46, tate-pairing, miller-algorithm, reduced-tate-pairing]
aliases: [Tate-Lichtenbaum Pairing]
created: 2026-05-18
---

> **Prerequisites**: [[45-pairings-cryptography|45. Pairings in Cryptography]], [[30-weil-pairing-algebraic|30. Algebraic Construction via Divisors]], [[31-properties-weil-pairing|31. Properties of the Weil Pairing]]
> **Objectives**:
> - Hiểu cấu trúc toán học của Tate-Lichtenbaum pairing: coset space, định nghĩa, và tính chất
> - Nắm thuật toán Miller — công cụ tính toán cốt lõi — thông qua mô tả từng bước
> - Hiểu final exponentiation và tại sao nó cần thiết để có reduced Tate pairing
> - So sánh Weil pairing và Tate pairing về mặt hiệu năng và ứng dụng

---

## Motivation / Intuition

Weil pairing $e_r: E[r] \times E[r] \to \mu_r$ là một đối tượng toán học đẹp — đối xứng hoàn hảo, alternating, và Galois-equivariant. Nhưng để **tính** nó, cần hai lần Miller's algorithm. Mỗi lần Miller loop là $O(\log r)$ phép nhân trên trường, và với $r$ là số nguyên tố 256-bit, đây là phép tính đắt đỏ.

Tate pairing, được Tate giới thiệu lần đầu trên các abelian variety tổng quát (1958), và sau đó Lichtenbaum (1969) áp dụng cụ thể cho Jacobian của curves trên trường số, có một ưu điểm thực tế lớn: **chỉ cần một Miller loop duy nhất**, sau đó một bước "final exponentiation". Trong thực tế, Tate pairing và các biến thể của nó (Ate, optimal Ate) là loại pairing được dùng trong hầu hết các thư viện crypto hiện đại.

Tuy nhiên, cấu trúc toán học của Tate pairing phức tạp hơn Weil pairing một chút: đầu vào thứ hai không phải là một điểm mà là một **coset** trong nhóm thương. Bài học này giải thích cả lý thuyết lẫn kỹ thuật tính toán.

---

## Tate Pairing — Định Nghĩa Và Cấu Trúc

### Bối Cảnh Đại Số

Nhắc lại: cho $E/\mathbb{F}_q$, $r$ là số nguyên tố chia $\#E(\mathbb{F}_q)$, và $k$ là embedding degree. Ta có:
- $\mu_r \subset \mathbb{F}_{q^k}^\times$ (tất cả $r$-th roots of unity nằm trong $\mathbb{F}_{q^k}$).
- $E(\mathbb{F}_{q^k})[r] \cong (\mathbb{Z}/r\mathbb{Z})^2$ (khi $\gcd(r, q) = 1$).

Đặt $K = \mathbb{F}_{q^k}$ để tiện ký hiệu.

### Coset Space và Động Lực

Vấn đề với cách tiếp cận trực tiếp: nếu $P \in E(K)[r]$ và $Q \in E(K)[r]$, thì Weil pairing cho $e_r(P, Q)$ nhưng yêu cầu $P, Q$ định nghĩa trên cùng trường. Tate pairing giải quyết khác: đầu vào thứ hai là **bất kỳ điểm nào** trong $E(K)$, nhưng hai điểm cùng coset cho ra cùng kết quả (sau final exponentiation).

> [!definition] Definition 46.1 — Tate-Lichtenbaum Pairing
>
> Cho $E/\mathbb{F}_q$, $r \mid \#E(\mathbb{F}_q)$ với $r$ số nguyên tố, $k$ là embedding degree. Đặt $K = \mathbb{F}_{q^k}$.
>
> Cho $P \in E(\mathbb{F}_q)[r]$ và $Q \in E(K)$ (không nhất thiết là $r$-torsion). Chọn một hàm rational $f_{r,P} \in K(E)^\times$ với:
>
> $$
> \operatorname{div}(f_{r,P}) = r(P) - r(O)
> $$
>
> nghĩa là $f_{r,P}$ có zero bậc $r$ tại $P$ và cực bậc $r$ tại $O$ (và không có điểm đặc biệt nào khác).
>
> Chọn một divisor $D_Q$ trên $E$ có hỗ trợ (support) rời với $\{P, O\}$, với $D_Q \sim (Q) - (O)$ (linear equivalent). Tate-Lichtenbaum pairing được định nghĩa:
>
> $$
> \tau_r(P, Q) = f_{r,P}(D_Q)^{(q^k - 1)/r} \in \mu_r \subset K^\times
> $$
>
> Đây là **reduced Tate-Lichtenbaum pairing** (đã được normalize để nhận giá trị trong $\mu_r$).

> [!note] Remark 46.2 — Tại Sao Cần Final Exponentiation?
>
> Không có mũ $(q^k-1)/r$, giá trị $f_{r,P}(D_Q)$ nằm trong $K^\times = \mathbb{F}_{q^k}^\times$ nhưng **không nhất thiết** trong $\mu_r$. Hơn nữa, nó **phụ thuộc vào đại diện** của divisor $D_Q$ — hai divisors khác nhau nhưng linearly equivalent sẽ cho các giá trị sai khác nhau.
>
> Final exponentiation $(\cdot)^{(q^k-1)/r}$ giải quyết cả hai vấn đề:
> - **Chuẩn hóa**: $x^{(q^k-1)/r}$ chỉ phụ thuộc vào coset $x \cdot (K^\times)^r$, vì nếu $x' = x \cdot y^r$ thì $(x')^{(q^k-1)/r} = x^{(q^k-1)/r} \cdot y^{q^k-1} = x^{(q^k-1)/r}$ (do $y^{q^k-1} = 1$ theo Fermat).
> - **Đảm bảo $\mu_r$-valued**: $\left(x^{(q^k-1)/r}\right)^r = x^{q^k-1} = 1$.

### Tính Chất

> [!abstract] Theorem 46.3 — Tính Chất của Tate-Lichtenbaum Pairing
>
> Reduced Tate-Lichtenbaum pairing $\tau_r: E(\mathbb{F}_q)[r] \times E(\mathbb{F}_{q^k})/rE(\mathbb{F}_{q^k}) \to \mu_r$ thỏa mãn:
>
> 1. **Bilinearity** (song tuyến tính):
>
> $$
> \tau_r(P_1 + P_2, \bar{Q}) = \tau_r(P_1, \bar{Q}) \cdot \tau_r(P_2, \bar{Q})
> $$
>
> $$
> \tau_r(P, \overline{Q_1 + Q_2}) = \tau_r(P, \bar{Q}_1) \cdot \tau_r(P, \bar{Q}_2)
> $$
>
> 2. **Galois invariance**: Nếu $\sigma \in \operatorname{Gal}(K/\mathbb{F}_q)$, thì $\tau_r(\sigma P, \sigma Q) = \sigma(\tau_r(P,Q))$.
>
> 3. **Non-degeneracy**: Nếu $\tau_r(P, \bar{Q}) = 1$ với mọi $\bar{Q} \in E(K)/rE(K)$, thì $P = O$. Ngược lại, nếu $\tau_r(P, \bar{Q}) = 1$ với mọi $P \in E(\mathbb{F}_q)[r]$, thì $Q \in rE(K)$.

**Proof sketch của Bilinearity.**
Tính bilinear ở đầu vào thứ nhất: $\operatorname{div}(f_{r,P_1+P_2}) = r(P_1+P_2) - r(O)$. Ta có thể phân tích: $f_{r,P_1+P_2} = f_{r,P_1} \cdot f_{r,P_2} \cdot g$ với $g$ là hàm bổ chính.

Sau final exponentiation, các thừa số phụ biến mất, và bilinearity hiện rõ. Chi tiết đầy đủ trong Silverman [AEC], §XI.3. $\blacksquare$

> [!warning] Counterexample 46.4 — Tate Pairing Không Alternating
>
> Khác với Weil pairing, Tate pairing **không alternating** trong chừng mực tổng quát. Cụ thể, $\tau_r(P, P)$ không nhất thiết bằng $1$.
>
> Đây là sự khác biệt quan trọng: trong crypto, khi cần pairing "symmetric" (cùng một điểm ở cả hai bên), phải dùng **distortion map** hoặc chuyển sang loại pairing phù hợp. Weil pairing alternating là hệ quả của tính skew-symmetric: $e_r(P,Q) = e_r(Q,P)^{-1}$.

---

## Miller's Algorithm — Thuật Toán Tính Pairing

### Ý Tưởng: Tính $f_{r,P}$ Từng Bước

Vấn đề: hàm $f_{r,P}$ với $\operatorname{div}(f_{r,P}) = r(P) - r(O)$ có **bậc $r$** — không thể viết dưới dạng tường minh. Victor Miller (1986) phát hiện cách tính $f_{r,P}(Q)$ trong $O(\log r)$ bước bằng kỹ thuật **double-and-add**.

### Hàm Line và Divisor

Với hai điểm $T, R$ trên $E$, đặt:
- $\ell_{T,R}$: đường thẳng qua $T$ và $R$ (hoặc tiếp tuyến tại $T$ nếu $T = R$).
- $v_{T+R}$: đường thẳng dọc qua $T + R$.

Các hàm rational này có divisors:

$$
\operatorname{div}(\ell_{T,R}) = (T) + (R) + (-T-R) - 3(O)
$$

$$
\operatorname{div}(v_{T+R}) = (T+R) + (-T-R) - 2(O)
$$

Quan sát: $\operatorname{div}(\ell_{T,R} / v_{T+R}) = (T) + (R) - (T+R) - (O)$.

### Vòng Lặp Miller

Miller's algorithm dựa trên công thức đệ quy: nếu ta đã có $f_{n,P}$ với $\operatorname{div}(f_{n,P}) = n(P) - (nP) - (n-1)(O)$, thì:

$$
f_{m+n, P} = f_{m,P} \cdot f_{n,P} \cdot \frac{\ell_{mP, nP}}{v_{(m+n)P}}
$$

> [!abstract] Theorem 46.5 — Miller's Algorithm
>
> **Input**: $P \in E(\mathbb{F}_q)[r]$, $Q \in E(\mathbb{F}_{q^k})$ (với $Q \ne P$, $Q \ne O$), số nguyên $r = \sum_{i=0}^{L} r_i 2^i$ (binary representation).
>
> **Output**: $f_{r,P}(Q) \in \mathbb{F}_{q^k}^\times$.
>
> **Algorithm**:
>
> ```
> f ← 1
> T ← P
> for i = L-1 downto 0:
>     f ← f^2 · line(T, T)(Q) / vert(2T)(Q)
>     T ← 2T
>     if r_i = 1:
>         f ← f · line(T, P)(Q) / vert(T+P)(Q)
>         T ← T + P
> return f
> ```
>
> Ở đây:
> - `line(T, T)(Q)`: giá trị hàm tiếp tuyến tại $T$ đánh giá tại $Q$.
> - `vert(2T)(Q)`: giá trị đường thẳng dọc qua $2T$ đánh giá tại $Q$ (thường là $Q_x - (2T)_x$).
> - Độ phức tạp: $O(\log r)$ phép nhân trên $\mathbb{F}_{q^k}$.

**Proof (correctness, sketch).**

Bất biến vòng lặp: sau bước $i$, $f = f_{n_i, P}(Q)$ với $n_i$ là giá trị accumulator hiện tại (đọc $r$ từ bit cao đến thấp), và $T = [n_i]P$.

Bước doubling: $f_{2m, P} = f_{m,P}^2 \cdot \ell_{mP,mP} / v_{2mP}$ (áp dụng công thức đệ quy với $n = m$). Bước addition (khi $r_i = 1$): $f_{2m+1,P} = f_{2m,P} \cdot f_{1,P} \cdot \ell_{2mP, P} / v_{(2m+1)P}$. Vì $f_{1,P} = 1$ (hàm trivial), ta nhận được công thức trong pseudo-code. $\blacksquare$

> [!example] Example 46.6 — Miller Algorithm Thủ Công (Toy Case)
>
> **Setup**: $E: y^2 = x^3 - x + 1$ trên $\mathbb{F}_{17}$. Giả sử $P = (0, 1)$, $r = 5$.
>
> Binary: $r = 5 = 101_2$. Các bits (từ bit cao nhất): $L = 2$, $r_2 = 1$, $r_1 = 0$, $r_0 = 1$.
>
> **Vòng lặp** ($i$ từ $L-1 = 1$ xuống $0$):
>
> **$i = 1$ (bit $r_1 = 0$):**
> - Tính đường tiếp tuyến $\ell_{P,P}$ tại $P = (0,1)$:
>   Slope: $\lambda = \frac{3 \cdot 0^2 - 1}{2 \cdot 1} = \frac{-1}{2} \equiv \frac{16}{2} = 8 \pmod{17}$
>   Tangent line: $\ell(x,y) = y - 1 - 8(x - 0) = y - 8x - 1$
> - $2P$: dùng công thức doubling, nhận $2P = (8, 14)$ (tính tường minh).
> - Vertical: $v_{2P}(Q) = Q_x - 8$ với $Q = (x_Q, y_Q)$.
> - $f \leftarrow f^2 \cdot \ell_{P,P}(Q) / v_{2P}(Q) = 1 \cdot (y_Q - 8x_Q - 1)/(x_Q - 8)$
>
> **$i = 0$ (bit $r_0 = 1$):**
> - Tính $\ell_{2P, P}$ (chord qua $2P = (8,14)$ và $P = (0,1)$):
>   Slope: $\mu = (14-1)/(8-0) = 13/8 \equiv 13 \cdot 15 = 195 \equiv 8 \pmod{17}$
>   Chord: $\ell(x,y) = y - 1 - 8x$
> - $3P$: tính, nhận $3P$.
> - $f \leftarrow f \cdot \ell_{2P,P}(Q) / v_{3P}(Q)$
>
> Sau vòng lặp: $f = f_{5,P}(Q)$ là giá trị Miller function tại $Q$.

### Tối Ưu Hóa Thực Tế

> [!tip] Remark 46.7 — Tối Ưu Hóa Miller Loop
>
> **Loại bỏ đường thẳng dọc (denominator elimination)**: Với embedding degree $k$ chẵn, đường thẳng dọc $v_{T+R}(Q)$ là phần tử trong subfield của $\mathbb{F}_{q^k}$. Sau final exponentiation, đóng góp của chúng biến mất. Do đó, có thể bỏ qua tính `vert(...)` hoàn toàn — tiết kiệm đáng kể.
>
> **Twisted curves**: Thay vì làm việc trực tiếp trên $E$ over $\mathbb{F}_{q^k}$, ta dùng **twist** $E'$ over $\mathbb{F}_{q^{k/d}}$ (với $d = 2, 3, 4, 6$ tùy đường cong). Điểm $Q$ được biểu diễn trong trường extension nhỏ hơn, giảm cost.
>
> **Signed binary (NAF)**: Biểu diễn $r$ theo Non-Adjacent Form để giảm số bit $1$ cần xử lý.

---

## Reduced Tate Pairing và Final Exponentiation

### Cấu Trúc Của Final Exponentiation

Final exponentiation là phép tính $x \mapsto x^{(q^k - 1)/r}$. Với $q^k$ lớn, đây là lũy thừa đắt đỏ. Tuy nhiên, có cấu trúc để tối ưu.

Phân tích: $(q^k - 1)/r = (q^k - 1)/\Phi_k(q) \cdot \Phi_k(q)/r$, trong đó $\Phi_k$ là cyclotomic polynomial.

- **Easy part**: $x \mapsto x^{(q^k - 1)/\Phi_k(q)}$ — thực ra bằng $x^{(q^m - 1)}$ cho một số $m < k$, dễ tính qua Frobenius.
- **Hard part**: $x \mapsto x^{\Phi_k(q)/r}$ — phức tạp hơn nhưng có thể tối ưu nhờ **cyclotomic structure**: phần tử trong $\mu_{\Phi_k(q)}$ có thể nâng lũy thừa hiệu quả hơn phần tử tổng quát.

> [!example] Example 46.8 — Final Exponentiation trên BN Curve ($k = 12$)
>
> Với đường cong Barreto-Naehrig ($k = 12$):
>
> $$
> \frac{q^{12} - 1}{r} = \underbrace{(q^6 - 1)}_{\text{easy part 1}} \cdot \underbrace{(q^2 + 1)}_{\text{easy part 2}} \cdot \underbrace{\frac{q^4 - q^2 + 1}{r}}_{\text{hard part}}
> $$
>
> Easy parts: $x^{q^6-1} = x^{q^6}/x$ — có thể tính bằng 1 Frobenius và 1 inversion. $x^{q^2+1} = x^{q^2} \cdot x$ — thêm 1 Frobenius.
>
> Hard part: $x^{(q^4-q^2+1)/r}$ — đây là $x^{\Phi_{12}(q)/r}$, được tính bằng thuật toán Fuentes et al. hoặc Scott et al. sử dụng thực tế rằng $q$ là đa thức trong tham số $u$ của BN curve.

---

## So Sánh Weil Pairing và Tate Pairing

> [!info] Property 46.9 — Weil vs Tate: So Sánh Toàn Diện
>
> | Thuộc tính | Weil Pairing $e_r$ | Tate-Lichtenbaum Pairing $\tau_r$ |
> |-----------|-------------------|-----------------------------------|
> | **Input** | $E[r] \times E[r]$ (cả hai r-torsion) | $E(\mathbb{F}_q)[r] \times E(\mathbb{F}_{q^k})/rE(\mathbb{F}_{q^k})$ |
> | **Output** | $\mu_r$ | $\mu_r$ (sau final exp.) |
> | **Miller loops** | 2 | 1 |
> | **Final exponentiation** | Không cần | Bắt buộc |
> | **Alternating** | Có: $e_r(P,P) = 1$ | Không (nói chung) |
> | **Symmetry** | $e_r(P,Q) = e_r(Q,P)^{-1}$ | Không có hệ thức tương tự đơn giản |
> | **Non-degeneracy** | Cả hai chiều | Cả hai chiều |
> | **Bilinearity** | Có | Có |
> | **Galois equivariance** | Có | Có |
> | **Hiệu năng** | Chậm hơn ~2× | **Nhanh hơn**, ưu tiên trong thực tế |
> | **Liên hệ** | $e_r(P,Q)^2 = \tau_r(P,Q)/\tau_r(Q,P)$ (với Type 1 pairing) | |

### Liên Hệ Giữa Weil và Tate Pairing

> [!abstract] Theorem 46.10 — Weil Pairing qua Tate Pairing
>
> Cho $P, Q \in E[r] \subset E(\mathbb{F}_{q^k})$. Weil pairing và Tate pairing liên quan bởi:
>
> $$
> e_r(P, Q) = \frac{\tau_r(P, Q)}{\tau_r(Q, P)}
> $$
>
> (đẳng thức trong $\mu_r$, sau khi cả hai Tate pairings được tính trên $\mathbb{F}_{q^k}$).

Điều này có nghĩa: về mặt lý thuyết, Weil pairing chứa không nhiều thông tin hơn Tate pairing. Trong thực tế, người ta dùng trực tiếp Tate (hoặc các variant của nó như Ate) thay vì tính Weil.

---

## Ate Pairing — Tối Ưu Hóa Tate

### Bước Ngoặt Quan Trọng

Hess, Smart, Vercauteren (2006) nhận ra rằng trong Miller's algorithm tính Tate pairing, **không nhất thiết phải iterate $r$ bước**. Thay vào đó, có thể iterate theo một số $T$ nhỏ hơn nhiều (liên quan đến trace of Frobenius $t$).

> [!definition] Definition 46.11 — Ate Pairing
>
> Cho $E/\mathbb{F}_q$ pairing-friendly với embedding degree $k$. Đặt $t$ là trace of Frobenius ($\#E(\mathbb{F}_q) = q + 1 - t$) và $T = t - 1$.
>
> Định nghĩa các subgroup eigenspaces của Frobenius $\pi_q$:
> $$
> \mathbb{G}_1 = E[r] \cap \ker(\pi_q - [1]) = E(\mathbb{F}_q)[r]
> $$
> $$
> \mathbb{G}_2 = E[r] \cap \ker(\pi_q - [q])
> $$
>
> **Ate pairing**:
> $$
> a_T: \mathbb{G}_2 \times \mathbb{G}_1 \to \mu_r, \quad (Q, P) \mapsto \left(f_{T, Q}(P)\right)^{(q^k-1)/r}
> $$
>
> Đây là phiên bản "reversed" (hoán đổi vị trí $\mathbb{G}_1, \mathbb{G}_2$) của Tate pairing, nhưng với Miller loop chạy $\lfloor \log_2(T) \rfloor$ bước thay vì $\lfloor \log_2(r) \rfloor$ bước.
>
> Vì $T = t - 1 \approx \sqrt{q}$ (do $|t| \leq 2\sqrt{q}$), Ate pairing nhanh hơn Tate khoảng $\sqrt{k}$ lần.

> [!note] Remark 46.12 — Tại Sao Ate Pairing Đúng?
>
> Mấu chốt là: vì $Q \in \mathbb{G}_2 = \ker(\pi_q - [q])$, ta có $\pi_q(Q) = [q]Q$. Vì $[r]Q = O$, điều này có nghĩa $[T]Q = [t-1]Q = [-q+q+1-1-(-q+1)] Q = \ldots$ Nói ngắn gọn: $[T]Q$ có liên quan đến action của Frobenius trên $Q$, và sau một số biến đổi, Miller loop theo $T$ cho ra cùng giá trị pairing (lũy thừa lên một số cố định) so với loop theo $r$. Chi tiết trong Hess–Smart–Vercauteren 2006.

---

## SageMath Cheatsheet

```sage
# ===== Tate Pairing trong SageMath =====
p = next_prime(2^255 - 19)   # Ví dụ với prime lớn
# Trên thực tế dùng BN hay BLS curve cụ thể

# Với đường cong đơn giản để demo:
p = 1009
F = GF(p)
E = EllipticCurve(F, [-1, 0])  # y^2 = x^3 - x
n = E.order()
print("Order:", n)

# Tìm torsion points
from sage.all import factor
print("Factorization:", factor(n))

# SageMath có built-in Tate pairing (phiên bản Lichtenbaum)
# Cú pháp: P.tate_pairing(Q, n, k)
#   - n: bậc của P
#   - k: embedding degree

# Tìm embedding degree cho r = 7 (nếu 7 | n)
r = 7
k = Mod(p, r).multiplicative_order()
print("Embedding degree:", k)

# Mở rộng trường
Fk = GF(p^k, 'a')
Ek = EllipticCurve(Fk, [-1, 0])

# Điểm trong G1 (E(F_p)[r])
P = E(0, 0) * (n // r)   # Hoặc tìm điểm bậc r
# Nếu (0,0) là điểm bậc r:
if P.order() == r:
    P_lift = Ek(P)       # Nâng lên Fk
    
# Điểm trong G2 (phần tử Fk không thuộc Fp)
Q = Ek.random_point() * (Ek.order() // r)

# Tate pairing (built-in SageMath, sử dụng Miller algorithm)
tau = P_lift.tate_pairing(Q, r, k)
print("Tate pairing:", tau)
print("tau^r = 1?", tau^r == 1)

# Kiểm tra bilinearity:
P2 = P_lift * 2
tau2 = P2.tate_pairing(Q, r, k)
print("tau(2P, Q):", tau2)
print("tau(P, Q)^2:", tau^2)
print("Bilinear?", tau2 == tau^2)

# ===== Miller Algorithm Manual (Toy) =====
def line_function(T, R, Q):
    """Tính giá trị line function tại Q."""
    if T == -R:
        # Đường thẳng dọc
        return Q[0] - T[0]
    if T == R:
        # Tiếp tuyến
        lam = (3*T[0]^2 + T.curve().a4()) / (2*T[1])
        return Q[1] - T[1] - lam*(Q[0] - T[0])
    else:
        # Chord
        lam = (R[1] - T[1]) / (R[0] - T[0])
        return Q[1] - T[1] - lam*(Q[0] - T[0])

def miller_loop(P, Q, r):
    """Miller algorithm cho Tate pairing (simplified, without denominator)."""
    f = 1
    T = P
    bits = r.bits()[::-1]  # LSB first → reverse to MSB first
    for bit in bits[1:]:   # Skip leading 1
        f = f^2 * line_function(T, T, Q)
        T = 2*T
        if bit == 1:
            f = f * line_function(T, P, Q)
            T = T + P
    return f
```

---

## Summary / Key Takeaways

- **Tate-Lichtenbaum pairing** $\tau_r: E(\mathbb{F}_q)[r] \times E(\mathbb{F}_{q^k})/rE(\mathbb{F}_{q^k}) \to \mu_r$ là phiên bản tính toán hiệu quả hơn Weil pairing.
- **Cấu trúc coset**: đầu vào thứ hai $\bar{Q}$ là coset trong $E(\mathbb{F}_{q^k})/rE(\mathbb{F}_{q^k})$; hai đại diện khác nhau của cùng coset cho cùng kết quả sau final exponentiation.
- **Final exponentiation** $(\cdot)^{(q^k-1)/r}$ là bắt buộc để: (1) chuẩn hóa giá trị về $\mu_r$, và (2) loại bỏ sự phụ thuộc vào đại diện của coset.
- **Miller's algorithm** tính $f_{r,P}(Q)$ trong $O(\log r)$ bước. Cốt lõi là vòng lặp double-and-add với hàm line và hàm dọc.
- **Tối ưu hóa quan trọng**: denominator elimination (bỏ qua `vert(...)` với $k$ chẵn), twisted curves (giảm kích thước trường làm việc).
- **Ate pairing**: Miller loop theo $T = t - 1 \approx \sqrt{q}$ thay vì $r \approx q$, nhanh hơn $\sqrt{k}$ lần so với Tate.
- **Liên hệ Weil–Tate**: $e_r(P,Q) = \tau_r(P,Q)/\tau_r(Q,P)$. Về lý thuyết Weil không chứa thêm thông tin so với Tate.
- Trong thực tế, **optimal Ate pairing** (sẽ học ở bài 47) là biến thể hiệu quả nhất, được dùng trong BLS12-381 và Ethereum 2.0.

---

## References

1. **Tate, J.** — "WC-groups over $p$-adic fields", *Seminaire Bourbaki*, 156 (1958). *(Định nghĩa gốc Tate pairing trên AV)*
2. **Lichtenbaum, S.** — "Duality Theorems for Curves over $p$-adic Fields", *Inventiones Mathematicae*, 7 (1969), 120–136. *(Áp dụng cho Jacobians)*
3. **Miller, V.** — "The Weil Pairing, and Its Efficient Calculation", *J. Cryptology*, 17 (2004), 235–261. *(Bài báo chính thức của Miller's algorithm, công bố chậm từ manuscript 1986)*
4. **Hess, F., Smart, N.P., Vercauteren, F.** — "The Eta Pairing Revisited", *IEEE Trans. Information Theory*, 52 (2006), 4595–4602. *(Ate pairing)*
5. **Galbraith, S.D.** — *Mathematics of Public Key Cryptography*, Cambridge University Press (2012). Ch. 26. *(Tài liệu giảng dạy toàn diện nhất, tự do truy cập tại math.auckland.ac.nz/~sgal018/crypto-book)*
6. **Silverman, J.H.** — *The Arithmetic of Elliptic Curves*, 2nd ed., Springer GTM 106 (2009). §XI.3.
7. **Barreto, P.S.L.M., Kim, H.Y., Lynn, B., Scott, M.** — "Efficient Algorithms for Pairing-Based Cryptosystems", *CRYPTO 2002*, LNCS 2442, Springer (2002), 354–368. *(Denominator elimination, first efficient Tate pairing)*
8. **Vercauteren, F.** — "Optimal Pairings", *IEEE Trans. Information Theory*, 56 (2010), 455–461. *(Optimal Ate pairing)*
9. **Scott, M., Benger, N., Charlemagne, M., et al.** — "On the Final Exponentiation for Calculating Pairings on Ordinary Elliptic Curves", *Pairing 2009*, LNCS 5671, Springer (2009), 78–88.
10. **Stanford PBC notes** — "The Tate Pairing". Online: crypto.stanford.edu/pbc/notes/ep/tate.html
