---
title: "04. Second Variant: Homogeneous Linear Equations"
type: math-component
tags: [linear-equations-unknown-divisors, lattice, coppersmith, homogeneous, math-component, lesson-04]
aliases: [Second Variant, Homogeneous Linear Equations]
source: "New Results on Solving Linear Equations Modulo Unknown Divisors and its Applications — Lu, Zhang, Lin, ~2014"
created: 2026-03-26
---

> **Prerequisites**: [[01-problem-setting-lattice-preliminaries|01. Problem Setting & Lattice Preliminaries]], [[02-first-variant-generalized-linear-equations|02. First Variant: Generalized Linear Equations]] (Theorem 1, lattice construction strategy)  
> 🔴 **Prerequisite references**: Coppersmith [3], LLL [10]  
> **Lesson type**: Math Component  
> **Covers**: §4, §4.1 — Theorem 7 (bivariate homogeneous), comparison với prior methods, Theorem 8 (n-variable, statement)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $f_2(x_1, x_2)$ | Homogeneous linear polynomial: $a_1 x_1 + a_2 x_2$ | $f_2$ |
> | $(y_1, y_2)$ | Nghiệm cần tìm, $\gcd(y_1, y_2) = 1$ | $(y_1, y_2)$ |
> | $X_1, X_2$ | Bounds: $\lvert y_1 \rvert \leq X_1 = N^{\gamma_1}$, $\lvert y_2 \rvert \leq X_2 = N^{\gamma_2}$ | $X_1, X_2$ |
> | $s_1, s_2$ | Đóng góp của $X_1, X_2$ vào $\det(L)$ | $s_1, s_2$ |
> | $s_N$ | Đóng góp của $N$ vào $\det(L)$ | $s_N$ |
> | $h(x_1, x_2)$ | Irreducible factor: $y_1 x_2 - y_2 x_1$ | $h$ |

---

## Motivation: Tại sao cần Second Variant?

Trong nhiều ứng dụng tấn công RSA, phương trình xuất hiện tự nhiên dưới dạng **thuần nhất** (homogeneous) — không có hệ số tự do:

$$
f_2(x_1, x_2) = a_1 x_1 + a_2 x_2 \equiv 0 \pmod{p}
$$

Ví dụ điển hình: tấn công weak encryption exponent của Nitaj [14], trong đó phương trình có dạng $ex + y \equiv 0 \pmod{p}$ — đây chính xác là $f_2$ với $a_1 = e, a_2 = 1$.

**Tại sao không dùng First Variant?** First Variant (§3) với $a_0 = 0$ hoàn toàn hợp lệ về mặt kỹ thuật, nhưng **lãng phí cấu trúc**. Khi $a_0 = 0$, polynomial $f_2$ là thuần nhất, nghĩa là nếu $(y_1, y_2)$ là nghiệm thì $(cy_1, cy_2)$ cũng là nghiệm với mọi $c$. Cấu trúc đặc biệt này cho phép xây dựng lattice khác — nhỏ hơn, determinant nhỏ hơn, bound tốt hơn.

> [!info] 🟡 Herrmann–May '08 [6] — Bound cho trường hợp $a_0 = 0$
> Nếu áp dụng trực tiếp Herrmann–May với $a_0 = 0$, bound thu được là:
>
> $$
> \gamma_1 + \gamma_2 < 3\beta - 2 + 2(1-\beta)^{3/2}
> $$
>
> Với $\beta = 0.5$: bound $\approx 0.207$. Paper này cải thiện lên $\gamma_1 + \gamma_2 < 0.25$ ($= uv\beta^2$ với $u = v = 1, \beta = 0.5$) — cải thiện $\approx 20\%$.
>
> *(theo [6]: Herrmann & May — Solving linear equations modulo divisors, Asiacrypt 2008)*

---

## Thiết lập: Bivariate Homogeneous Case

Xét:

$$
f_2(x_1, x_2) = a_1 x_1 + a_2 x_2 \equiv 0 \pmod{p^v}
$$

với $p$ ẩn, $p^u \mid N$, $p \geq N^\beta$. Không mất tổng quát, giả sử $a_1 = 1$ (nhân $a_1^{-1} \pmod{N}$). Đặt:

$$
f(x_1, x_2) = a_1^{-1} f_2(x_1, x_2) \pmod{N} = x_1 + a_2' x_2
$$

### Ý tưởng thiết kế polynomial collection

Với First Variant, ta dùng $g_k = f^k \cdot N^{e_k}$. Với Second Variant, ta cần khai thác tính thuần nhất. Quan sát: vì $f_2$ là thuần nhất bậc 1, $f_2^k$ là thuần nhất bậc $k$. Ta có thể nhân thêm $x_2^{m-k}$ để tất cả đa thức có cùng tổng bậc $m$:

> [!note] Construction 4.1 — Polynomial Collection cho Second Variant
> Định nghĩa:
>
> $$
> g_k(x_1, x_2) := x_2^{m-k} \cdot f^k(x_1, x_2) \cdot N^{\max\!\left\{\left\lceil \frac{v(t-k)}{u} \right\rceil,\, 0\right\}}
> \quad k = 0, 1, \ldots, m
> $$
>
> với tham số $t = \tau m$.

**Tại sao $g_k(y_1, y_2) \equiv 0 \pmod{p^{vt}}$?** Hoàn toàn tương tự First Variant: $f^k(y_1, y_2) \equiv 0 \pmod{p^{vk}}$ và $N^{\lceil v(t-k)/u \rceil} \equiv 0 \pmod{p^{v(t-k)}}$, kết hợp cho $g_k(y_1,y_2) \equiv 0 \pmod{p^{vt}}$.

**Vai trò của $x_2^{m-k}$**: Factor này làm tất cả $g_k$ có cùng tổng bậc $m$ (thuần nhất bậc $m$). Điều này tạo ra cấu trúc đặc biệt trong lattice — các cột ứng với các monomial $x_1^k x_2^{m-k}$ — giúp lattice có dạng tam giác và determinant nhỏ hơn.

---

## Xây dựng Lattice và Tính Determinant

Đặt $X_1 = N^{\gamma_1}, X_2 = N^{\gamma_2}$. Basis của $L$ là các coefficient vector của $g_k(x_1 X_1, x_2 X_2)$, $k = 0,\ldots,m$.

Vì $f(x_1,x_2) = x_1 + a_2' x_2$ là monic theo $x_1$, monomial leading của $f^k$ là $x_1^k$, và $g_k$ có leading monomial $x_1^k x_2^{m-k}$. Sắp xếp các cột theo thứ tự $(x_1^0 x_2^m, x_1^1 x_2^{m-1}, \ldots, x_1^m x_2^0)$, lattice $L$ có dạng **tam giác**, phần tử đường chéo thứ $k$ là $X_1^k X_2^{m-k} \cdot N^{e_k}$.

Do đó:

$$
\det(L) = X_1^{s_1} \cdot X_2^{s_2} \cdot N^{s_N}
$$

trong đó:

$$
s_1 = \sum_{k=0}^{m} k = \frac{m^2}{2} + o(m^2)
$$

$$
s_2 = \sum_{k=0}^{m} (m-k) = \frac{m^2}{2} + o(m^2)
$$

$$
s_N = \sum_{k=0}^{t-1} \left\lceil \frac{v(t-k)}{u} \right\rceil = \frac{v\tau^2 m^2}{2u} + o(m^2)
$$

> [!tip] 💡 Agent note
> So sánh với First Variant: $s_1$ và $s_2$ đều bằng $m^2/2$ (so với $s = m^2/2$ và $s_2 = 0$ trong univariate). Tổng $s_1 + s_2 = m^2$ — lớn hơn First Variant. Tuy nhiên, tổng $\gamma_1 + \gamma_2$ là bound trên tổng, và cả hai biến đều xuất hiện đối xứng trong determinant, nên bound cuối cùng vẫn là $\gamma_1 + \gamma_2 < uv\beta^2$ — tương đương Theorem 1 nhưng cho **hai biến** thay vì một.

---

## Áp dụng LLL và Điều kiện Nghiệm

Áp dụng Lemma 1 (LLL) và Lemma 2 (Howgrave-Graham), điều kiện cần là:

$$
2^{\frac{d-1}{4}} \cdot \det(L)^{\frac{1}{d}} < \frac{N^{v\beta\tau m}}{\sqrt{d}}
$$

Bỏ qua các hệ số không phụ thuộc $N$, thay $s_1 = s_2 = m^2/2$, $s_N = v\tau^2 m^2/(2u)$, $d = m+1 \approx m$:

$$
N^{\frac{(\gamma_1 + \gamma_2)m}{2} + \frac{v\tau^2 m}{2u}} < N^{v\beta\tau m}
$$

$$
\frac{\gamma_1 + \gamma_2}{2} + \frac{v\tau^2}{2u} < v\beta\tau
$$

$$
\gamma_1 + \gamma_2 < 2v\beta\tau - \frac{v\tau^2}{u}
$$

Tối ưu theo $\tau$: đặt đạo hàm bằng 0:

$$
2v\beta - \frac{2v\tau}{u} = 0 \implies \tau^* = u\beta
$$

Thay vào:

$$
\gamma_1 + \gamma_2 < 2v\beta \cdot u\beta - \frac{v(u\beta)^2}{u} = uv\beta^2
$$

---

## Theorem 7: Bivariate Homogeneous

> [!abstract] Theorem 7 — Bivariate Homogeneous Linear Equation mod $p^v$
> Cho $N$ composite đủ lớn với $p^u \mid N$ ($p \geq N^\beta$, $u \geq 1$). Cho $f_2(x_1, x_2) = a_1 x_1 + a_2 x_2$ là homogeneous linear polynomial. Có thể tìm tất cả nghiệm $(y_1, y_2)$ của $f_2(x_1, x_2) \equiv 0 \pmod{p^v}$ với $\gcd(y_1, y_2) = 1$, $|y_1| \leq N^{\gamma_1}$, $|y_2| \leq N^{\gamma_2}$ nếu:
>
> $$
> \gamma_1 + \gamma_2 < uv\beta^2
> $$
>
> Độ phức tạp thời gian polynomial theo $\log N$.

**Proof.** Đã trình bày lattice construction và điều kiện LLL ở trên. Điểm còn lại là **root extraction**: LLL output vector ngắn nhất tương ứng đa thức $f'(x_1, x_2)$ thỏa $f'(y_1, y_2) = 0$ trên số nguyên.

Vì $(y_1, y_2)$ là nghiệm của $f_2$ với $\gcd(y_1, y_2) = 1$, theo **Bézout's theorem**, đa thức bậc 1 thuần nhất $h(x_1, x_2) = y_1 x_2 - y_2 x_1$ phải là nhân tử bất khả quy của $f'(x_1, x_2)$ trong $\mathbb{Q}[x_1, x_2]$.

Do đó ta tìm được $b \cdot h(x_1, x_2) = h_1 x_1 + h_2 x_2$ bằng cách factor $f'$ trên $\mathbb{Q}$. Từ đó:

$$
y_1 = \frac{h_1}{\gcd(h_1, h_2)}, \quad y_2 = \frac{h_2}{\gcd(h_1, h_2)}
$$

$\blacksquare$

> [!tip] 💡 Agent note
> Việc $h(x_1,x_2) = y_1 x_2 - y_2 x_1$ chia hết $f'$ là tất yếu vì: $f'(y_1, y_2) = 0$ và $f'$ là đa thức thuần nhất bậc $m$ trên $\mathbb{Q}$. Đa thức thuần nhất bậc $m$ trên $\mathbb{Q}$ phân tích thành $m$ nhân tử tuyến tính thuần nhất. $(y_1:y_2)$ là nghiệm projective → $y_1 x_2 - y_2 x_1$ là nhân tử tuyến tính đó. Điều này không đúng với First Variant vì $f'$ không thuần nhất.

---

## So sánh với các phương pháp trước

### So sánh với Herrmann–May [6]

| | Herrmann–May [6] | **Theorem 7** |
|--|-----------------|---------------|
| Polynomial | $a_0 + a_1x_1 + a_2x_2$ (general) | $a_1x_1 + a_2x_2$ (homogeneous) |
| Bound | $3\beta - 2 + 2(1-\beta)^{3/2}$ | $uv\beta^2$ |
| $\beta=0.5, u=v=1$ | $\approx 0.207$ | $0.25$ |
| Root extraction | Gröbner basis (heuristic) | Bézout factoring (exact) |

Với $\beta = 0.5$: cải thiện từ $0.207$ lên $0.25$ — một bước nhảy $\approx 20\%$.

> [!info] 🟡 May thesis '03 [11] — Univariate rational root connection
> May [11] chỉ ra rằng bài toán tìm nghiệm nhỏ của $f_2(x_1,x_2) = a_1x_1 + a_2x_2 \equiv 0 \pmod{p}$ với $\gcd(y_1,y_2)=1$ tương đương tìm nghiệm hữu tỉ nhỏ của polynomial univariate $F(z) = f_2(z, 1)/z = a_1 + a_2/z$... Nói cách khác, bài toán bivariate homogeneous quy về tìm **nghiệm hữu tỉ** nhỏ $z = y_2/y_1$.
>
> Theorem 7 với $u=v=1$ recover kết quả của May: bound $\beta^2$ (xem §4.1 comparison trong paper).
>
> *(theo [11]: May — New RSA vulnerabilities using lattice reduction methods, PhD thesis 2003)*

### So sánh với Castagnos et al. [2]

> [!info] 🟡 Castagnos, Joux, Laguillaumie, Nguyen '09 [2]
> Castagnos et al. xét polynomial thuần nhất dạng $(a_1x_1 + a_2x_2)^{u/v} \bmod p$ — tức degree $u/v$ — và áp dụng thuật toán tương tự. Phương pháp của họ:
> - Chỉ áp dụng khi $u/v \in \mathbb{Z}$ (tỉ lệ nguyên).
> - Dimension lattice là $(u/v) \cdot m$ (lớn hơn).
> - **Fail với nghiệm unbalanced** ($X_1 \gg X_2$): vì họ không dùng hệ số $X_i$ để balance biến trước khi build lattice.
>
> Theorem 7 xử lý trường hợp tổng quát hơn: $u/v$ tùy ý, dimension chỉ $m$, và **hoạt động đúng với unbalanced bounds** nhờ factor $X_i$ trong coefficient vectors.
>
> *(theo [2]: Castagnos et al. — Factoring $pq^2$ with quadratic forms, Asiacrypt 2009)*

> [!warning] Tại sao unbalanced case quan trọng?
> Trong Theorem 10 (CRT-RSA attack), ta cần giải $ex + y \equiv 0 \pmod{p}$ với $x = d_p \approx N^{0.375}/\sqrt{e}$ và $y = k_p - 1 \approx N^{\alpha + \delta - 0.5}$. Khi $\alpha$ (exponent của $e$) lớn, $X_1 \gg X_2$ rõ rệt. Phương pháp [2] fail trong trường hợp này; Theorem 7 vẫn hoạt động.

---

## Theorem 8: Mở rộng lên $n$ Biến

Phần tổng quát nhất của Second Variant. Proof đầy đủ nằm trong [[a0-n-variable-extensions|A0. N-Variable Extensions]].

**Collection đa thức** cho $n$ biến (tổng quát hóa Construction 4.1):

$$
g_{i_2,\ldots,i_n,k}(x_1,\ldots,x_n) = x_2^{i_2} \cdots x_n^{i_n} \cdot f_2^k(x_1,\ldots,x_n) \cdot N^{\max\!\left\{\left\lceil \frac{v(t-k)}{u} \right\rceil,\, 0\right\}}
$$

với $i_j \geq 0$ và $k + \sum_{j=2}^n i_j \leq m$.

> [!abstract] Theorem 8 — $n$-Variable Homogeneous Generalization
> Cho $N$ composite với $p^u \mid N$ ($p \geq N^\beta$). Cho $f_2(x_1,\ldots,x_n)$ là homogeneous linear polynomial $n$ biến. Dưới **Assumption 1**, có thể tìm nghiệm $(y_1,\ldots,y_n)$ của $f_2 \equiv 0 \pmod{p^v}$ với $\gcd(y_1,\ldots,y_n) = 1$, $|y_i| \leq N^{\gamma_i}$ nếu:
>
> $$
> \sum_{i=1}^n \gamma_i < \frac{v}{u} \cdot \frac{1 - \left(1 - \frac{v}{u}\beta\right)^{n/(n-1)}}{n - n\left(1 - \frac{v}{u}\beta\right)\left(1 - \sqrt[n-1]{1 - \frac{v}{u}\beta}\right)}
> $$
>
> Độ phức tạp: polynomial theo $\log N$, exponential theo $n$.

> [!tip] 💡 Agent note
> Lưu ý sự khác biệt giữa Theorem 3 và Theorem 8: trong Theorem 3 (First Variant), tham số tối ưu là $\tau^* = 1 - \sqrt[n]{1 - (u/v)\beta}$, trong khi Theorem 8 (Second Variant) dùng $\tau^* = 1 - \sqrt[n-1]{1 - (v/u)\beta}$ — dimension giảm đi 1 do cấu trúc thuần nhất (một biến đóng vai trò "normalizer"). Khi $n=2$: Theorem 8 recover Theorem 7.

---

## Summary

- **Key insight**: Cấu trúc thuần nhất ($a_0 = 0$) cho phép dùng $x_2^{m-k}$ thay vì $x_2^{i_2}$ tổng quát → lattice nhỏ hơn → bound tốt hơn.
- **Theorem 7**: $\gamma_1 + \gamma_2 < uv\beta^2$ — cùng dạng Theorem 1 nhưng cho hai biến đồng thời.
- **Root extraction**: Bézout's theorem đảm bảo $h = y_1 x_2 - y_2 x_1$ chia hết $f'$ → recover $(y_1, y_2)$ chính xác (không cần heuristic như Gröbner basis của First Variant).
- **Improvement over HM'08**: $0.25$ vs $0.207$ tại $\beta=0.5$.
- **Advantage over [2]**: Áp dụng với $u/v$ tùy ý và unbalanced bounds.
- **Theorem 8**: Tổng quát lên $n$ biến; proof trong [[a0-n-variable-extensions|A0]].

Ứng dụng của Theorem 7 vào weak encryption exponents: xem [[05-weak-encryption-exponent-attacks|05. Weak Encryption Exponent Attacks]].

---

## References

- [2] Castagnos, Joux, Laguillaumie, Nguyen — *Factoring $pq^2$ with quadratic forms*, Asiacrypt 2009
- [6] Herrmann & May — *Solving linear equations modulo divisors*, Asiacrypt 2008
- [10] Lenstra, Lenstra, Lovász — LLL algorithm, 1982 (🔴 Prerequisite)
- [11] May — *New RSA vulnerabilities using lattice reduction methods*, PhD thesis 2003
- [14] Nitaj — *A new attack on RSA and CRT-RSA*, Africacrypt 2012
