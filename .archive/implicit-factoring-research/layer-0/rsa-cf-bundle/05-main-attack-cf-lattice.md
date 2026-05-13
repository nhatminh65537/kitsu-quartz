---
title: "05. Main Attack: Kết Hợp Continued Fractions và Lattice"
type: attack
tags: [rsa-cryptanalysis, main-attack, continued-fractions, coppersmith, jochemsz-may, attack, lesson-05]
aliases: [Main Attack CF Lattice, Theorem 6 RSA, CF Lattice Hybrid]
source: "Improving RSA Cryptanalysis: Combining Continued Fractions and Coppersmith's Techniques — Zheng, Feng, Nitaj, Pan, ACISP 2025"
created: 2026-03-26
---

> **Prerequisites**: Continued fractions & relation (2) (xem [[01-continued-fractions-rsa|01. Continued Fractions & Legendre]]), Coppersmith lattice strategy (xem [[02-coppersmith-lattice-strategy|02. Coppersmith Lattice Strategy]]), Wiener optimality (xem [[03-wiener-attack-optimality|03. Wiener Attack]]), Herrmann-May attack (xem [[04-herrmann-may-attack|04. Herrmann–May Attack]])  
> 🔴 **Prerequisite references**: Jochemsz, May — *A Strategy for Finding Roots* [JM06] (monomial set strategy chi tiết)  
> **Lesson type**: Attack  
> **Covers**: §4.1 đầy đủ (Theorem 6 — reformulation, polynomial $f(x,y,z)$, Jochemsz-May construction, determinant, solvable condition, optimize $\tau$, bound $\delta_0 < 1 - \alpha/3 - \gamma/2$, Remark 1)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $p_r/q_r$, $p_{r-1}/q_{r-1}$ | Hai convergent liên tiếp của $e/N$ với $q_{r-1} < q_r < N^{3/4}/\sqrt{e}$ |
> | $u, v$ | Hệ số: $d = uq_r + vq_{r-1}$, $k = up_r + vp_{r-1}$; $\|u\|,\|v\| < N^\delta$ |
> | $\delta$ | Log-exponent của $u, v$; bound tối ưu: $\delta < \alpha/6 - \gamma/2 + 1/4$ |
> | $\delta_0$ | Bound cuối trên $d$: $\delta_0 = \delta + 3/4 - \alpha/2$ |
> | $w = p+q-S$ | Sai số xấp xỉ; $\|w\| < N^\gamma$ |
> | $a_1, a_2, a_3, a_4$ | Hằng số mô-đun $eq_r$ được tính từ $p_r, q_r, p_{r-1}, q_{r-1}, N, S$ |
> | $X, Y, Z$ | Bounds: $X = N^\gamma$, $Y = Z = N^\delta$ |
> | $\tau = t/m$ | Tỉ lệ shift; $S(\sigma)$ là tổng $\sigma$ trên index set |
> | $n_X, n_Y, n_Z, n_e$ | Exponents của $X, Y, Z, eq_r$ trong $\det(L)$ |

---

## Ý Tưởng Cốt Lõi

Herrmann-May (Lesson 04) tìm trực tiếp $(k, d)$ từ phương trình $f(x,y) \equiv 0 \pmod{e}$. Với $d < N^{\delta_0}$, ta cần bound $\delta_0 < 1 - \sqrt{\alpha\gamma}$.

**Insight của Zheng et al.**: thay vì tìm $(k, d)$ trực tiếp, hãy dùng **relation (2)** từ Lesson 01. Chọn hai convergent liên tiếp $p_{r-1}/q_{r-1}$ và $p_r/q_r$ của $e/N$ với $q_r < N^{3/4}/\sqrt{e}$. Theo Theorem 1.6, tồn tại duy nhất $(u, v) \in \mathbb{Z}^2$ sao cho:

$$
d = u q_r + v q_{r-1}, \qquad k = u p_r + v p_{r-1}
$$

Bài toán mới: tìm $(u, v)$ nhỏ thay vì tìm $d$ lớn. Vì $q_r < N^{3/4-\alpha/2}$, nếu $|u|, |v| < N^\delta$ với $\delta$ nhỏ thì $d \lesssim q_r \cdot N^\delta \sim N^{3/4-\alpha/2+\delta}$ — ta "mua" thêm một hệ số $q_r$ mà không tốn thêm chi phí tìm kiếm.

---

## Reformulate Phương Trình Khóa

Thay $d = uq_r + vq_{r-1}$ và $k = up_r + vp_{r-1}$ vào $ed - k\varphi(N) = 1$, với $\varphi(N) = N + 1 - S - w$ ($w = p+q-S$):

$$
e(uq_r + vq_{r-1}) - (up_r + vp_{r-1})(N+1-S-w) = 1
$$

Khai triển và sắp xếp lại:

$$
p_r w u + p_{r-1} w v - (N+1-S)p_r u - \bigl[(N+1-S)p_{r-1} - eq_{r-1}\bigr]v - 1 \equiv 0 \pmod{eq_r}
$$

Nhân cả hai vế với $p_r^{-1} \pmod{eq_r}$ (tồn tại vì $\gcd(p_r, e) = 1$ theo giả thiết):

$$
wu + a_1 wv + a_2 u + a_3 v + a_4 \equiv 0 \pmod{eq_r}
$$

với các hằng số đã biết:

$$
\begin{aligned}
a_1 &\equiv p_{r-1} p_r^{-1} \pmod{eq_r} \\
a_2 &\equiv -(N+1-S) \pmod{eq_r} \\
a_3 &\equiv -\bigl[(N+1-S)p_{r-1} - eq_{r-1}\bigr] p_r^{-1} \pmod{eq_r} \\
a_4 &\equiv -p_r^{-1} \pmod{eq_r}
\end{aligned}
$$

Định nghĩa đa thức 3 biến:

$$
f(x, y, z) = xy + a_1 xz + a_2 y + a_3 z + a_4
$$

Khi đó $(x_0, y_0, z_0) = (w, u, v)$ là nghiệm nhỏ của $f(x,y,z) \equiv 0 \pmod{eq_r}$, với $|x_0| < X = N^\gamma$, $|y_0|, |z_0| < Y = Z = N^\delta$.

---

## Lattice Construction theo Jochemsz-May

> [!info] 🟡 Jochemsz-May Strategy [JM06]
> Paper Zheng et al. áp dụng chiến lược của Jochemsz & May (2006) cho đa thức 3 biến $f(x,y,z)$. Ý tưởng: xác định tập monomial $M_k \setminus M_{k+1}$ tối ưu cho mỗi level $k$, đảm bảo lattice matrix tam giác và determinant tính được tường minh.  
> *(theo [JM06]: Jochemsz, May — ASIACRYPT 2006)*

Tập monomial của $f^m(x,y,z)$:

$$
\{x^i y^j z^l : i=0,\ldots,m;\ j=0,\ldots,m;\ l=\max(i-j,0),\ldots,m-j\}
$$

Tập $M_k$ (monomials cho level $k$):

$$
M_k = \bigcup_{0 \leq h \leq t} \{x^i y^j z^{l+h} : x^iy^jz^l \in f^m,\ x^iy^jz^l (xy)^k \in f^{m-k}\}
$$

Tập hiệu $M_k \setminus M_{k+1}$ được phân tách thành:

$$
I_k = \{(i,j,l) : i=k,\ j=k,\ldots,m,\ l=\max(i-j,0),\ldots,m-j+t\}
$$

$$
J_k = \{(i,j,l) : i=k+1,\ldots,m,\ j=k,\ l=\max(i-j,0),\ldots,m-j+t\}
$$

Với mỗi $(i,j,l) \in I_k \cup J_k$, shift polynomial:

$$
g_{k,i,j,l}(x,y,z) = x^{i-k} y^{j-k} z^l f^k(x,y,z) \cdot (eq_r)^{m-k}
$$

Mọi $g_{k,i,j,l}(x_0,y_0,z_0) \equiv 0 \pmod{(eq_r)^m}$.

---

## Determinant và Chiều Lattice

> [!note] Scheme 5.1 — Main Attack Construction (Theorem 6 trong paper)
> **Type**: Key Recovery Attack on RSA  
> **Setting**: $f(x,y,z) = xy + a_1xz + a_2y + a_3z + a_4$, modulus $R = eq_r < N^{\alpha/2+3/4}$
>
> **$\mathsf{MainAttack}(N, e, S, \gamma, \delta, m, t)$**
> - Input: $(N,e)$, $S$ với $|p+q-S| < N^\gamma$, params $m, t = \lfloor m\tau \rfloor$
>
> - **Tìm convergents**: Tính khai triển $e/N = [a_0, a_1', \ldots]$; lấy $p_{r-1}/q_{r-1}$, $p_r/q_r$ là hai convergent liên tiếp lớn nhất thoả $q_r < N^{3/4}/\sqrt{e}$ và $\gcd(p_r, e)=1$.
>
> - **Tính hằng số**: Tính $a_1, a_2, a_3, a_4 \pmod{eq_r}$ như định nghĩa trên.
>
> - **Xây lattice**: Với bounds $X = N^\gamma$, $Y = Z = N^\delta$, vector hệ số của $g_{k,i,j,l}(Xx, Yy, Zz)$ tạo lattice $L$. Ma trận **tam giác** → determinant:
>
> $$
> \det(L) = X^{n_X} Y^{n_Y} Z^{n_Z} (eq_r)^{n_e}
> $$
>
> - **LLL**: Áp dụng LLL; điều kiện solvable (Lemma 1 với $i=3$, Lemma 2):
>
> $$
> 2^{\frac{\omega(\omega-1)}{4(\omega-2)}} \det(L)^{\frac{1}{\omega-2}} < \frac{(eq_r)^m}{\sqrt{\omega}}
> $$
>
> - **Giải hệ**: Resultants/Gröbner basis → $(x_0, y_0, z_0) = (w, u, v)$ → $p+q = x_0 + S$ → factorize $N$.
>
> - Output: $p, q$

---

## Asymptotic Analysis

Đặt $t = m\tau$. Khi $m \to \infty$ với $\tau$ cố định:

$$
\begin{aligned}
n_X &= \tfrac{1}{8}(4\tau+1)m^4 + o(m^4) \\
n_Y &= \tfrac{1}{8}(4\tau+1)m^4 + o(m^4) \\
n_Z &= \tfrac{1}{8}(2\tau+1)^2 m^4 + o(m^4) \\
n_e &= \tfrac{1}{12}(8\tau+3)m^4 + o(m^4) \\
\omega &= \tfrac{1}{3}(3\tau+1)m^3 + o(m^3)
\end{aligned}
$$

> [!tip] 💡 Agent note — Tại sao $m^4$ thay vì $m^3$?
> Herrmann-May dùng 3 biến $(x,y,u)$ với index set $I \cup J$ 3-dimensional → asymptotic $O(m^3)$. Jochemsz-May dùng tập $M_k \setminus M_{k+1}$ với 4-tuple $(k,i,j,l)$ → tích phân 4-chiều → $O(m^4)$ cho exponents và $O(m^3)$ cho dimension.

Vì $q_r < N^{3/4}/\sqrt{e} = N^{3/4-\alpha/2}$, suy ra $eq_r < N^{\alpha/2 + 3/4}$. Điều kiện solvable (giữ only leading power of $N$):

$$
\gamma n_X + \delta n_Y + \delta n_Z + \left(\tfrac{\alpha}{2}+\tfrac{3}{4}\right) n_e < \left(\tfrac{\alpha}{2}+\tfrac{3}{4}\right) (\omega-2) m - \left(\tfrac{\alpha}{2}+\tfrac{3}{4}\right) n_e
$$

Sau khi thay asymptotic values và rút gọn (bỏ lower-order trong $m$):

$$
24\delta\tau^2 + 4(12\delta - 2\alpha + 6\gamma - 3)\tau + 12\delta - 2\alpha + 6\gamma - 3 < 0
$$

---

## Tối Ưu Hóa và Bound Cuối

Bất đẳng thức bậc 2 theo $\tau$ với hệ số $24\delta > 0$. Cực tiểu tại:

$$
\tau^* = \frac{2\alpha - 12\delta - 6\gamma + 3}{12\delta}
$$

Thay $\tau^*$ vào:

> [!abstract] Theorem 5.2 — Main Attack Bound (Theorem 6 trong paper)
> Cho $N = pq$, $e = N^\alpha$, $ed - k\varphi(N) = 1$. Cho $p_{r-1}/q_{r-1}$, $p_r/q_r$ là convergents liên tiếp của $e/N$ với $q_{r-1} < q_r < N^{3/4}/\sqrt{e}$ và $\gcd(p_r, e)=1$. Giả sử tồn tại $u, v$ nguyên với $|u|, |v| < N^\delta$ sao cho $d = uq_r + vq_{r-1}$, $k = up_r + vp_{r-1}$. Cho $S$ xấp xỉ $p+q$ với $|p+q-S| < N^\gamma$, $1/4 < \gamma \leq 1/2$. Khi đó $N$ factorize được trong poly-time nếu:
>
> $$
> \delta < \frac{\alpha}{6} - \frac{\gamma}{2} + \frac{1}{4}
> $$

**Proof.** Thay $\tau^* = (2\alpha - 12\delta - 6\gamma + 3)/(12\delta)$ vào bất đẳng thức:

$$
24\delta \cdot \frac{(2\alpha-12\delta-6\gamma+3)^2}{144\delta^2} - \frac{(2\alpha-12\delta-6\gamma+3)^2}{6\delta} \cdot \frac{1}{1} + 12\delta - 2\alpha + 6\gamma - 3 < 0
$$

Rút gọn qua một số bước đại số (bình phương và khai triển):

$$
-\frac{(2\alpha - 12\delta - 6\gamma + 3)^2}{24\delta} + 12\delta - 2\alpha + 6\gamma - 3 < 0
$$

Nhân $24\delta > 0$:

$$
-(2\alpha-12\delta-6\gamma+3)^2 + 24\delta(12\delta-2\alpha+6\gamma-3) < 0
$$

Khai triển và rút gọn: điều kiện tương đương với $24\delta < 4\alpha - 12\gamma + 6$, tức là:

$$
\delta < \frac{\alpha}{6} - \frac{\gamma}{2} + \frac{1}{4}
$$

$\blacksquare$

---

## Chuyển Sang Bound Trên $d$

Từ $d = uq_r + vq_{r-1}$ với $|u|, |v| < N^\delta$ và $q_r < N^{3/4 - \alpha/2}$:

$$
d < 2 q_r \cdot N^\delta < N^{3/4 - \alpha/2 + \delta} \implies \delta_0 \leq \delta + \frac{3}{4} - \frac{\alpha}{2}
$$

Thay bound Theorem 5.2:

$$
\delta_0 < \frac{\alpha}{6} - \frac{\gamma}{2} + \frac{1}{4} + \frac{3}{4} - \frac{\alpha}{2} = 1 - \frac{\alpha}{3} - \frac{\gamma}{2}
$$

> [!abstract] Corollary 5.3 — Bound Tổng Quát Trên $d$
> Trong điều kiện Theorem 5.2, $N$ factorize được khi:
>
> $$
> d < N^{1 - \alpha/3 - \gamma/2}
> $$

---

## So Sánh với Herrmann-May

$$
\Delta = \left(1 - \frac{\alpha}{3} - \frac{\gamma}{2}\right) - \left(1 - \sqrt{\alpha\gamma}\right) = \sqrt{\alpha\gamma} - \frac{\alpha}{3} - \frac{\gamma}{2} = -\frac{\gamma}{3}\left(\sqrt{\frac{\alpha}{\gamma}} - \frac{3+\sqrt{3}}{2}\right)\!\left(\sqrt{\frac{\alpha}{\gamma}} - \frac{3-\sqrt{3}}{2}\right)
$$

$\Delta > 0$ khi $\frac{6-3\sqrt{3}}{2}\gamma < \alpha < \frac{6+3\sqrt{3}}{2}\gamma$.

> [!example] Ví dụ 5.4 — So sánh với $\gamma = 1/2$, $\alpha = 1$
>
> | Bound | Giá trị $\delta_0$ |
> |-------|-------------------|
> | Herrmann-May | $< 1 - \sqrt{1/2} \approx 0.293$ |
> | **Zheng et al.** | $< 1 - 1/3 - 1/4 = 5/12 \approx \mathbf{0.417}$ |
>
> Cải thiện $\approx 0.124$ trong $\log_N d$ — tức là có thể tấn công $d$ lớn hơn $\approx N^{0.124}$ lần!

> [!warning] Điều kiện để bound cải thiện
> Để bound $\delta_0 < 1 - \alpha/3 - \gamma/2$ có ý nghĩa (tức là $\delta_0 > 0$), cần $\alpha/3 + \gamma/2 < 1$. Với $\gamma = 1/2$: cần $\alpha < 9/2$ — hầu như luôn thỏa mãn với RSA thông thường.

---

## Remark 1: Tối Ưu Hóa Thêm

> [!tip] 💡 Agent note — Remark 1
> Paper (Remark 1) lưu ý rằng lattice construction trong Theorem 6 có thể tối ưu thêm bằng cách thêm shift trên biến $x$ — điều này cho bound tốt hơn trong một số vùng nhỏ $\gamma$ với $\alpha$ cố định. Tuy nhiên, độ phức tạp phân tích tăng đáng kể và cải thiện rất nhỏ, nên paper không pursuit. Công cụ tính asymptotic bounds tự động: [https://github.com/fffmath/AsymptoticBounds](https://github.com/fffmath/AsymptoticBounds).

---

## Tóm Tắt

- **Key insight**: dùng relation (2) để biểu diễn $(k, d) = (up_r + vp_{r-1},\ uq_r + vq_{r-1})$; tìm $(u,v)$ nhỏ thay vì $d$ lớn.
- **Đa thức**: $f(x,y,z) = xy + a_1xz + a_2y + a_3z + a_4$; nghiệm $(w, u, v)$, modulus $eq_r$.
- **Jochemsz-May**: shift polynomial set từ $M_k \setminus M_{k+1}$; determinant $O(m^4)$; $\omega = O(m^3)$.
- **Bound**: $\delta < \alpha/6 - \gamma/2 + 1/4$ → $\delta_0 < 1 - \alpha/3 - \gamma/2$.
- **Cải thiện**: $\Delta > 0$ với hầu hết $e$ thực tế (đặc biệt rõ khi $\gamma \approx 1/2$, $\alpha \approx 1$).
- Lesson 06 áp dụng Theorem 6 cho hai trường hợp đặc biệt: MSB sharing và LSB sharing của primes.

---

## References

- [JM06] Jochemsz, May — *A Strategy for Finding Roots of Multivariate Polynomials with New Applications in Attacking RSA Variants*, ASIACRYPT 2006 (🟡 lattice construction strategy)
- [HM10] Herrmann, May — *Maximizing Small Root Bounds by Linearization*, PKC 2010 (🟡 comparison — đã trình bày Lesson 04)
- [HG97] Howgrave-Graham — *Finding Small Roots*, Cryptography and Coding 1997 (🟡 Lemma 2 — Lesson 02)
- [Feng et al. 2024] Feng, Luo, Chen, Nitaj, Pan — *Computing Asymptotic Bounds via Sumset Theory*, ePrint 2024/1330 (⚪ Remark 1 — automated bound computation)
