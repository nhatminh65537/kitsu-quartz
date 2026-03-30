---
title: "04. Herrmann–May Attack: Lattice với Xấp Xỉ p+q"
type: attack
tags: [rsa-cryptanalysis, herrmann-may, lattice, small-private-exponent, attack, lesson-04]
aliases: [Herrmann-May Attack, HM Attack, Lattice RSA p+q]
source: "Improving RSA Cryptanalysis: Combining Continued Fractions and Coppersmith's Techniques — Zheng, Feng, Nitaj, Pan, ACISP 2025"
created: 2026-03-26
---

> **Prerequisites**: Coppersmith's lattice strategy & Howgrave-Graham (xem [[02-coppersmith-lattice-strategy|02. Coppersmith Lattice Strategy]]), RSA key equation $ed - k\varphi(N) = 1$  
> 🔴 **Prerequisite references**: Herrmann, May — *Maximizing Small Root Bounds by Linearization* [HM10] (paper gốc của attack này)  
> **Lesson type**: Attack  
> **Covers**: §3.2 đầy đủ (Theorem 5 — statement, lattice construction, determinant, solvable condition, optimization)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $e = N^\alpha$ | Public exponent; $\alpha = \log_N e$ |
> | $d < N^{\delta_0}$ | Private exponent; $\delta_0$ là attack bound cần tìm |
> | $S$ | Xấp xỉ của $p + q$, biết trước |
> | $\gamma$ | $\log_N \|p + q - S\|$; đo độ chính xác của $S$ |
> | $A$ | $A = S - N - 1$ (hằng số đã biết) |
> | $x_0 = k$ | Ẩn thứ nhất: hệ số trong $ed - k\varphi(N) = 1$ |
> | $y_0 = p+q-S$ | Ẩn thứ hai: sai số xấp xỉ $p+q$ |
> | $X, Y, U$ | Bounds: $\|k\| < X$, $\|p+q-S\| < Y$, $\|xy-1\| < U$ |
> | $m, t$ | Tham số lattice: $m$ = level, $t$ = shift depth |
> | $\tau = t/m$ | Tỉ lệ tối ưu hóa (asymptotic) |
> | $\omega$ | Chiều lattice |

---

## Vượt Ngưỡng $N^{1/4}$: Cần Thêm Thông Tin

Theorem 4 (Lesson 03) đã chứng minh: continued fractions thuần túy không thể khôi phục $d$ khi $d > N^{1/4}$. Nhưng trong thực tế, nhiều ứng dụng cần $d$ lớn hơn thế mà vẫn muốn giảm chi phí giải mã.

Herrmann và May (2010) quan sát rằng nếu có thêm thông tin về **xấp xỉ $p + q$** — ký hiệu $S$ với $|p+q-S| < N^\gamma$ — thì bài toán trở nên tractable ngay cả khi $d$ lớn hơn $N^{1/4}$ đáng kể. Thông tin này có thể đến từ partial key exposure, MSB leakage, hoặc các kênh side-channel khác.

Bài học này trình bày đầy đủ proof của Theorem 5 — attack baseline mà paper Zheng et al. so sánh và cải thiện.

---

## Reformulate RSA Key Equation

Điểm khởi đầu là phương trình khóa $ed - k(p-1)(q-1) = 1$. Khai triển $\varphi(N) = N + 1 - (p+q)$ và viết $p + q = S + y$ với $y = p+q-S$ là sai số xấp xỉ:

$$
ed - k(N + 1 - S - y) = 1
$$

$$
\Leftrightarrow \quad k(S - N - 1 + y) - 1 \equiv 0 \pmod{e}
$$

Đặt $A = S - N - 1$ (đã biết, tính được từ $(N, e, S)$). Định nghĩa đa thức:

$$
f(x, y) = x(A + y) - 1
$$

Khi đó $(x_0, y_0) = (k, p+q-S)$ là nghiệm nhỏ của $f(x, y) \equiv 0 \pmod{e}$.

---

## Linearization

Đa thức $f(x, y) = xA + xy - 1$ có thành phần tích $xy$ — bậc 2 theo hai biến, gây khó khăn cho lattice. Herrmann-May dùng **linearization**: đặt $u = xy - 1$ làm biến phụ. Khi đó:

$$
f(x, y) = xA + u \equiv 0 \pmod{e}
$$

Và hệ thống bây giờ có dạng tuyến tính theo $(x, y, u)$ với ràng buộc $u = xy - 1$.

Với bounds:

$$
X = N^{\alpha + \delta_0 - 1} \quad (\text{vì } k \approx ed/\varphi(N) \approx N^{\alpha+\delta_0-1})
$$

$$
Y = N^\gamma, \qquad U \approx XY = N^{\alpha + \delta_0 + \gamma - 1}
$$

---

## Lattice Construction và Determinant

> [!note] Scheme 4.1 — Herrmann-May Shift Polynomials (Theorem 5 trong paper)
> **Type**: Lattice-based attack on RSA key equation  
> **Setting**: $f(x,y) = x(A+y)-1$, modulus $e^m$, biến phụ $u = xy - 1$
>
> **$\mathsf{HMAttack}(N, e, S, \gamma, \delta_0, m, t)$**
> - Input: $(N, e)$, xấp xỉ $S$ với $|p+q-S| < N^\gamma$, bounds $\delta_0, m, t$
>
> - **Bước 1 — Shift polynomials**: Với index set $I \cup J$:
>
> $$
> I = \{(k,i,j) : j=0,\ k=0,\ldots,m,\ i=0,\ldots,m-k\}
> $$
>
> $$
> J = \{(k,i,j) : i=0,\ j=1,\ldots,t,\ k=\lfloor m/t \rfloor j,\ldots,m\}
> $$
>
>   Định nghĩa shift polynomial (thay $xy-1$ bằng $u$):
>
> $$
> g_{k,i,j}(x,y,u) = x^i y^j f(x,y)^k e^{m-k}
> $$
>
> - **Bước 2 — Lattice basis**: Vector hệ số của $g_{k,i,j}(Xx, Yy, Uu)$, sắp xếp lexicographic theo $(k,i,j)$; monomial $x^i y^j u^k$ sắp xếp tương tự. Ma trận kết quả là **tam giác**.
>
> - **Bước 3 — Tính determinant**: Với $n_X = S(i)$, $n_Y = S(j)$, $n_U = S(k)$, $n_e = S(m-k)$:
>
> $$
> \det(L) = X^{n_X} Y^{n_Y} U^{n_U} e^{n_e}
> $$
>
>   Chiều: $\omega = S(1)$ với $S(\sigma)$ là tổng $\sigma$ theo index set $I \cup J$.
>
> - **Bước 4 — LLL + kiểm tra**: Áp dụng LLL. Điều kiện solvable (Lemma 1 với $i=3$, Lemma 2):
>
> $$
> 2^{\frac{\omega(\omega-1)}{4(\omega-2)}} \det(L)^{\frac{1}{\omega-2}} < \frac{e^m}{\sqrt{\omega}}
> $$
>
> - **Bước 5 — Giải hệ**: Các đa thức nguyên $h_j(x,y,u)$ từ LLL; giải hệ (resultants) → $(x_0, y_0) = (k, p+q-S)$ → $p+q$ → factorize $N$.
>
> - Output: $p$ và $q$

---

## Phân Tích Asymptotic

Đặt $t = m\tau$ với $\tau > 0$ và xấp xỉ $\lfloor m/t \rfloor j \approx j/\tau$. Bỏ lower-order terms theo $m$:

$$
\omega \approx \frac{1}{2}(\tau+1)m^2
$$

$$
n_X \approx \frac{1}{6}m^3, \quad n_Y \approx \frac{1}{6}\tau^2 m^3, \quad n_U \approx \frac{1}{6}(2\tau+1)^2 m^3 / 4, \quad n_e \approx \frac{1}{6}(\tau+2)m^3
$$

> [!tip] 💡 Agent note — Cách tính exponents
> Các exponent $n_X, n_Y, n_U, n_e$ là tổng degree của $x, y, u, e$ trên toàn bộ shift polynomial set. Với index set $I \cup J$, tính $n_X = \sum_{(k,i,j) \in I \cup J} i$, v.v. — tích phân Riemann xấp xỉ triple integral khi $m \to \infty$.

Điều kiện solvable sau khi simplify (bỏ $2^{O(\omega^2)}$ — sub-exponential, chỉ giữ power of $N$ và $e$):

$$
X^{n_X} Y^{n_Y} U^{n_U} < e^{(ω-2)m - n_e}
$$

Thay $X = N^{\alpha+\delta_0-1}$, $Y = N^\gamma$, $U = N^{\alpha+\delta_0+\gamma-1}$, $e = N^\alpha$:

$$
(\alpha+\delta_0-1)n_X + \gamma \cdot n_Y + (\alpha+\delta_0+\gamma-1)n_U < \alpha\bigl[(\omega-2)m - n_e\bigr]
$$

Sau khi thay các giá trị asymptotic và rút gọn, điều kiện trở thành bất đẳng thức bậc 2 theo $\tau$:

$$
\gamma\tau^2 + 2(\delta_0 + \gamma - 1)\tau + \gamma + \alpha + 2\delta_0 - 2 < 0
$$

---

## Tối Ưu Hóa và Bound Cuối

Vế trái là tam thức bậc 2 theo $\tau$ (với hệ số $\gamma > 0$ — mở lên). Giá trị cực tiểu đạt tại:

$$
\tau^* = \frac{1 - \delta_0 - \gamma}{\gamma}
$$

Thay $\tau^*$ vào điều kiện và rút gọn:

> [!abstract] Theorem 4.2 — Herrmann-May Bound (Theorem 5 trong paper)
> Cho $N = pq$ với $q < p < 2q$, $e = N^\alpha$, $ed - k\varphi(N) = 1$ với $d < N^{\delta_0}$. Giả sử biết xấp xỉ $S$ của $p+q$ với $|p+q-S| < N^\gamma$ với $1/4 < \gamma \leq 1/2$. Khi đó $N$ có thể factorize trong thời gian đa thức nếu:
>
> $$
> \delta_0 < 1 - \sqrt{\alpha\gamma}
> $$

**Proof.** Thay $\tau^* = (1-\delta_0-\gamma)/\gamma$ vào bất đẳng thức:

$$
\gamma \cdot \frac{(1-\delta_0-\gamma)^2}{\gamma^2} + 2(\delta_0+\gamma-1)\cdot\frac{1-\delta_0-\gamma}{\gamma} + \gamma + \alpha + 2\delta_0 - 2 < 0
$$

$$
\Leftrightarrow \quad \frac{(1-\delta_0-\gamma)^2}{\gamma} - \frac{2(1-\delta_0-\gamma)^2}{\gamma} + \gamma + \alpha + 2\delta_0 - 2 < 0
$$

$$
\Leftrightarrow \quad -\frac{(1-\delta_0-\gamma)^2}{\gamma} + \gamma + \alpha + 2\delta_0 - 2 < 0
$$

$$
\Leftrightarrow \quad -\delta_0^2 + 2\delta_0 + \alpha\gamma - 1 < 0 \quad \Leftrightarrow \quad \delta_0 < 1 - \sqrt{\alpha\gamma}
$$

$\blacksquare$

> [!info] 🟡 Herrmann & May [2010]
> Đây là trình bày lại Theorem 5 từ [HM10]. Paper gốc của Herrmann-May đạt cùng bound $d < N^{0.292}$ với Boneh-Durfee nhưng qua framework đơn giản hơn. Bound $1 - \sqrt{\alpha\gamma}$ trong setting $S$ đã biết là trực tiếp từ paper này.  
> *(theo [HM10]: Herrmann, May — *Maximizing Small Root Bounds by Linearization and Applications to Small Secret Exponent RSA*, PKC 2010)*

---

## Phân Tích Bound: Khi Nào Tốt?

> [!example] Ví dụ 4.3 — Đánh giá bound $1 - \sqrt{\alpha\gamma}$
>
> **Trường hợp $e \approx N$ ($\alpha = 1$)**:
>
> - Không có thông tin $S$ ($\gamma = 1/2$ — chỉ biết $p+q \sim N^{1/2}$): $\delta_0 < 1 - \sqrt{1/2} \approx 0.293$ → tương đương Boneh-Durfee.
> - Biết $\approx$ một nửa bits của $p+q$ ($\gamma = 1/4$): $\delta_0 < 1 - 1/2 = 0.5$ → tấn công được $d$ lớn hơn nhiều!
> - Biết chính xác $p+q$ ($\gamma = 0$): $\delta_0 < 1$ → về mặt lý thuyết tấn công được mọi $d$ (nhưng $\gamma = 0$ nghĩa là biết $p+q$ chính xác → factorize ngay lập tức mà không cần lattice).
>
> **Kết luận**: Bound tốt hơn khi $\gamma$ nhỏ hơn (xấp xỉ $S$ chính xác hơn) và khi $\alpha$ nhỏ hơn (public exponent nhỏ).

> [!warning] Giới hạn thực nghiệm
> Trong thực tế, bound $1 - \sqrt{\alpha\gamma}$ đòi hỏi lattice dimension rất lớn (hàng trăm đến hàng nghìn) để đạt asymptotic — không khả thi với LLL hiện tại. Experimental bounds thấp hơn đáng kể. Lesson 07 sẽ trình bày gap này.

---

## So Sánh với Main Attack (Preview)

Paper Zheng et al. sẽ cải thiện Herrmann-May bằng cách tích hợp thêm thông tin từ continued fractions. Difference về bound:

$$
\Delta = \underbrace{\left(1 - \frac{\alpha}{3} - \frac{\gamma}{2}\right)}_{\text{Zheng et al.}} - \underbrace{\left(1 - \sqrt{\alpha\gamma}\right)}_{\text{Herrmann-May}} = \sqrt{\alpha\gamma} - \frac{\alpha}{3} - \frac{\gamma}{2} + \underbrace{\left(-\frac{\gamma}{2} + \frac{\gamma}{2}\right)}_{=0}
$$

$$
\Delta = -\frac{\gamma}{3}\left(\sqrt{\frac{\alpha}{\gamma}} - \frac{3+\sqrt{3}}{2}\right)\left(\sqrt{\frac{\alpha}{\gamma}} - \frac{3-\sqrt{3}}{2}\right)
$$

$\Delta > 0$ khi $\frac{6-3\sqrt{3}}{2}\gamma < \alpha < \frac{6+3\sqrt{3}}{2}\gamma$. Với $\gamma \approx 1/2$: $0.201 < \alpha < 2.799$ — cover hầu hết mọi $e$ thực tế.

---

## Tóm Tắt

- **Herrmann-May** đặt $f(x,y) = x(A+y) - 1$ với $A = S-N-1$; linearize $u = xy-1$; xây lattice từ shift polynomials trên 3 biến $(x,y,u)$.
- **Lattice construction**: index set $I \cup J$; determinant tam giác tính được tường minh.
- **Tối ưu $\tau^*$**: bất đẳng thức bậc 2 theo $\tau$ → $\tau^* = (1-\delta_0-\gamma)/\gamma$ → bound $\delta_0 < 1 - \sqrt{\alpha\gamma}$.
- **Điểm mạnh**: vượt $N^{1/4}$ đáng kể khi $\gamma$ nhỏ; bao gồm Boneh-Durfee như trường hợp đặc biệt.
- **Giới hạn**: main attack (Lesson 05) cải thiện thêm bằng cách khai thác common convergents của $e/N$.

---

## References

- [HM10] Herrmann, May — *Maximizing Small Root Bounds by Linearization and Applications to Small Secret Exponent RSA*, PKC 2010 (🟡 Theorem 4.2 — trích trực tiếp)
- [HG97] Howgrave-Graham — *Finding Small Roots*, Cryptography and Coding 1997 (🟡 Lemma 2 đã trình bày ở Lesson 02)
- [JM06] Jochemsz, May — *A Strategy for Finding Roots of Multivariate Polynomials*, ASIACRYPT 2006 (🟡 shift polynomial strategy)
- [BD99] Boneh, Durfee — *Cryptanalysis of RSA with Private Key $d < N^{0.292}$*, EUROCRYPT 1999 (⚪ baseline)
