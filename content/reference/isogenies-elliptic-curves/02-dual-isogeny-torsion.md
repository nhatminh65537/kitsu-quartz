---
title: "02. Dual Isogeny & Torsion Subgroups"
type: math-component
tags: [crypto, isogeny, torsion, weil-pairing, lesson-02]
aliases: [Dual Isogeny, Torsion Subgroups]
created: 2026-03-24
---

> **Prerequisites**: [[01-isogeny-definition|01. Isogeny: Definition, Degree & Separability]], abelian groups, roots of unity $\mu_m \subset \bar{k}^*$
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\phi: E \to E'$ | Isogeny degree $m$ |
> | $\hat{\phi}: E' \to E$ | Dual isogeny của $\phi$ |
> | $E[m]$ | $m$-torsion subgroup: $\{P \in E(\bar{k}) \mid [m]P = \mathcal{O}\}$ |
> | $\mu_m$ | Nhóm các căn bậc $m$ của đơn vị trong $\bar{k}^*$ |
> | $e_m$ | Weil pairing: $E[m] \times E[m] \to \mu_m$ |
> | $T_\ell(E)$ | Tate module: $\varprojlim E[\ell^n]$ |
> | $\ell$ | Số nguyên tố, thường $\ell \neq \text{char}(k)$ |

---

## Hai Cột Trụ của Lý thuyết Isogeny

Lesson này xây dựng hai kết quả nền tảng nhất mà mọi phần còn lại của khóa học đều dựa vào:

1. **Dual isogeny** — với mỗi isogeny $\phi: E \to E'$, có một isogeny $\hat{\phi}: E' \to E$ đi ngược chiều sao cho $\hat{\phi} \circ \phi = [\deg \phi]$. Đây là lý do isogeny là quan hệ tương đương.

2. **Cấu trúc của $E[m]$** — torsion subgroup $E[m]$ có cấu trúc hoàn toàn xác định tùy theo characteristic của trường. Kết quả này điều khiển số lượng isogeny đi ra từ mỗi đường cong.

---

## 1. Dual Isogeny

> [!abstract] Định lý 2.1 — Tồn tại và Duy nhất Dual Isogeny
> Cho $\phi: E \to E'$ là isogeny degree $m$. Tồn tại duy nhất một isogeny
>
> $$
> \hat{\phi}: E' \to E
> $$
>
> sao cho:
>
> $$
> \hat{\phi} \circ \phi = [m]_E \quad \text{và} \quad \phi \circ \hat{\phi} = [m]_{E'}
> $$
>
> $\hat{\phi}$ được gọi là **dual isogeny** của $\phi$, có $\deg \hat{\phi} = m$.

**Proof sketch (trường hợp separable).** Giả sử $\phi$ separable, tức $\#\ker\phi = m$. Ta cần xây dựng $\hat{\phi}$ sao cho $\hat{\phi} \circ \phi = [m]$.

Xét subgroup $\ker\phi \subset E$. Với mỗi $Q \in E'(\bar{k})$, ta muốn đặt $\hat{\phi}(Q) = \sum_{P \in \phi^{-1}(Q)} P$ — tổng tất cả $m$ pre-image của $Q$ dưới $\phi$. Đây là một điểm xác định trong $E$ vì phép tính này có thể biểu diễn bằng rational functions (hàm đối xứng theo các pre-image). Kiểm tra: $(\hat{\phi} \circ \phi)(P) = \sum_{T \in \ker\phi}(P + T) = [m]P + \sum_{T \in \ker\phi} T = [m]P$ (vì $\ker\phi$ là subgroup nên tổng tất cả phần tử của nó là $\mathcal{O}$). Trường hợp inseparable cần xử lý riêng, xem Silverman [AEC, Theorem III.6.1]. $\blacksquare$

### Tính chất của Dual Isogeny

> [!info] Tính chất 2.2
> Với isogenies $\phi: E_1 \to E_2$ và $\psi: E_2 \to E_3$, và $n \in \mathbb{Z}$:
>
> **(a)** $\widehat{\phi + \psi} = \hat{\phi} + \hat{\psi}$
>
> **(b)** $\widehat{\psi \circ \phi} = \hat{\phi} \circ \hat{\psi}$
>
> **(c)** $\hat{\hat{\phi}} = \phi$
>
> **(d)** $\widehat{[n]} = [n]$, và $\deg [n] = n^2$
>
> **(e)** $\deg(\phi \circ \psi) = \deg\phi \cdot \deg\psi$
>
> **(f)** Nếu $\phi$ separable thì $\hat{\phi}$ cũng separable.

**Proof của (d):** $[n] \circ [n] = [n^2]$, và dual của $[n]$ thỏa $\widehat{[n]} \circ [n] = [\deg [n]]$. Từ đây suy ra $\widehat{[n]} = [n]$ và $\deg [n] = n^2$. $\blacksquare$

> [!warning] Lưu ý quan trọng
> $\hat{\phi}$ **không** là inverse của $\phi$ theo nghĩa thông thường. Composition $\hat{\phi} \circ \phi = [m]$ **không phải** là identity (trừ khi $m = 1$, tức $\phi$ là isomorphism). Isogenous không có nghĩa là isomorphic — đây là điểm cốt yếu phân biệt isogeny với isomorphism.

### Degree như Quadratic Form

Dual isogeny cho phép định nghĩa một "norm" trên $\text{Hom}(E_1, E_2)$:

> [!abstract] Mệnh đề 2.3 — Degree là Positive Definite Quadratic Form
> Hàm $\deg: \text{Hom}(E_1, E_2) \to \mathbb{Z}_{\geq 0}$ xác định bởi $\deg(\phi) = \deg\phi$ (với $\deg 0 = 0$) là một **quadratic form** trên $\mathbb{Z}$-module $\text{Hom}(E_1, E_2)$:
>
> $$
> \deg(\phi + \psi) = \deg\phi + \deg\psi + \phi\hat{\psi} + \psi\hat{\phi}
> $$
>
> Form này là **positive definite**: $\deg\phi \geq 0$ với mọi $\phi$, và $\deg\phi = 0$ khi và chỉ khi $\phi = 0$.

Tính chất này là xuất phát điểm để chứng minh **Hasse's theorem** (Bài 05): $|t| \leq 2\sqrt{q}$ với $t = q + 1 - \#E(\mathbb{F}_q)$.

---

## 2. Torsion Subgroups $E[m]$

Torsion subgroup $E[m] = \ker [m]$ là đối tượng trung tâm trong mọi cấu trúc isogeny.

> [!abstract] Định lý 2.4 — Cấu trúc của $E[m]$
>
> **(a) Trường hợp $\gcd(m, \text{char}(k)) = 1$** (bao gồm $\text{char}(k) = 0$):
>
> $$
> E[m] \cong \mathbb{Z}/m\mathbb{Z} \oplus \mathbb{Z}/m\mathbb{Z}
> $$
>
> **(b) Trường hợp $\text{char}(k) = p > 0$ và $m = p^r$**:
>
> Chính xác một trong hai xảy ra:
>
> $$
> E[p^r] \cong \mathbb{Z}/p^r\mathbb{Z} \quad \text{(ordinary curve)}
> $$
>
> hoặc
>
> $$
> E[p^r] \cong \{0\} \quad \text{(supersingular curve)}
> $$

**Proof sketch của (a).** Xét $[m]$ là isogeny degree $m^2$ (từ Mệnh đề 2.3 (d)). Vì $\gcd(m, p) = 1$ nên $[m]$ separable, do đó $\#E[m] = \deg_s[m] = m^2$. Bước tiếp theo, $E[m]$ là module over $\mathbb{Z}/m\mathbb{Z}$. Dùng classification theorem của finite abelian groups: $E[m] \cong \bigoplus_i \mathbb{Z}/d_i\mathbb{Z}$ với $d_i \mid m$. Để chứng minh chỉ có đúng hai cyclic factors đều bậc $m$, ta cần Weil pairing (xem §3). Xem Silverman [AEC, Corollary III.6.4]. $\blacksquare$

**Proof sketch của (b).** Khi $m = p$, map $[p] = \hat{\pi} \circ \pi$ là composition của Frobenius $\pi$ và dual $\hat{\pi}$. Vì $\pi$ purely inseparable (degree $p$, kernel trivial) và $\hat{\pi}$ có thể separable hoặc inseparable tùy đường cong, ta được hai trường hợp. Đây chính là định nghĩa ordinary vs supersingular — sẽ phân tích kỹ trong Lesson 06. $\blacksquare$

---

## 3. Hệ quả: Số lượng $\ell$-isogenies từ một Điểm

> [!abstract] Hệ quả 2.5 — Số $\ell$-isogenies từ $E$
> Cho $\ell$ là số nguyên tố, $\ell \neq \text{char}(k)$. Số lượng isogenies cyclic separable degree $\ell$ xuất phát từ $E$ (tính đến isomorphism của codomain) bằng số lượng subgroup cyclic bậc $\ell$ của $E[\ell]$.
>
> Vì $E[\ell] \cong (\mathbb{Z}/\ell\mathbb{Z})^2$ (theo Định lý 2.4a), số subgroup cyclic bậc $\ell$ trong $(\mathbb{Z}/\ell\mathbb{Z})^2$ bằng $\ell + 1$.

Nói cách khác: từ bất kỳ đường cong $E$ nào (với $\text{char}(k) \neq \ell$), có đúng $\ell + 1$ isogenies degree $\ell$ phân biệt đi ra. Đây chính là số cạnh tại mỗi đỉnh trong **$\ell$-isogeny graph** — sẽ xây dựng trong Lesson 07.

---

## 4. Weil Pairing

Weil pairing là công cụ cực kỳ hữu dụng: nó kết nối torsion subgroup với roots of unity, cho phép ta dùng linear algebra để nghiên cứu isogenies.

> [!note] Định nghĩa 2.6 — Weil Pairing
> Cho $m$ là số nguyên dương với $\text{char}(k) \nmid m$. Weil pairing là một bilinear form song tuyến tính:
>
> $$
> e_m: E[m] \times E[m] \to \mu_m
> $$
>
> trong đó $\mu_m = \{\zeta \in \bar{k}^* \mid \zeta^m = 1\}$ là nhóm các căn bậc $m$ của đơn vị.

**Xây dựng:** Cho $T \in E[m]$, tồn tại hàm $f_T \in \bar{k}(E)$ với $\text{div}(f_T) = m(T) - m(\mathcal{O})$. Với $S \in E[m]$, tồn tại $T' \in E(\bar{k})$ với $[m]T' = T$; đặt $g_S \in \bar{k}(E)$ với $\text{div}(g_S) = \sum_{R \in E[m]} (T' + R) - (R)$. Khi đó $e_m(S, T) := f_T(S + T') / f_T(T')$ (Weil), hoặc tương đương $e_m(S, T) = g_S(T) / g_S(\mathcal{O})$ (Miller). Xem Silverman [AEC, §III.8].

> [!abstract] Định lý 2.7 — Tính chất của Weil Pairing
>
> **(a) Bilinearity**: $e_m(S_1 + S_2, T) = e_m(S_1, T) \cdot e_m(S_2, T)$, và tương tự theo $T$.
>
> **(b) Alternating**: $e_m(T, T) = 1$ với mọi $T \in E[m]$.
>
> **(c) Non-degeneracy**: Nếu $e_m(S, T) = 1$ với mọi $T \in E[m]$, thì $S = \mathcal{O}$.
>
> **(d) Compatibility với isogeny**: Nếu $\phi: E \to E'$ là isogeny degree coprime to $m$, thì:
>
> $$
> e_m(\phi(S), \phi(T)) = e_m(S, T)^{\deg_s \phi}
> $$
>
> **(e) Anti-symmetry**: $e_m(S, T) = e_m(T, S)^{-1}$.

**Proof của (b) từ (a):** Vì $e_m(T, T) = e_m(T, T) \cdot e_m(T, T)$ (bilinearity), ta có $e_m(T, T)^2 = e_m(2T, T) = e_m(T, T) \cdot e_m(T, T)$... Thực ra, từ alternating: $e_m(S + T, S + T) = 1$, khai triển bằng bilinearity: $e_m(S,S) \cdot e_m(S,T) \cdot e_m(T,S) \cdot e_m(T,T) = 1$, tức $e_m(S,T) \cdot e_m(T,S) = 1$, nên $e_m(T,S) = e_m(S,T)^{-1}$. $\blacksquare$

### Ứng dụng Weil Pairing: MOV Attack

Tính chất (d) có một hệ quả mật mã học quan trọng: nếu $\ell \mid \#E(\mathbb{F}_p)$ và $E[\ell] \subset E(\mathbb{F}_{p^k})$, thì Weil pairing $e_\ell$ map ECDLP trên $E$ thành DLP trong $\mathbb{F}_{p^k}^*$. Đây là **MOV attack** — khai thác isogeny sang Jacobians để giải ECDLP trong nhóm multiplicative của trường mở rộng. Sẽ xem chi tiết trong Lesson 06.

---

## 5. Tate Module — Biểu diễn $\ell$-adic

Tate module tổng hợp toàn bộ cấu trúc torsion $\ell$-primary thành một đối tượng liên tục:

> [!note] Định nghĩa 2.8 — Tate Module
> Cho $\ell$ là số nguyên tố, $\ell \neq \text{char}(k)$. **Tate module** của $E$ là:
>
> $$
> T_\ell(E) := \varprojlim_n E[\ell^n]
> $$
>
> — giới hạn ngược (inverse limit) của hệ:
>
> $$
> \cdots \xrightarrow{[\ell]} E[\ell^3] \xrightarrow{[\ell]} E[\ell^2] \xrightarrow{[\ell]} E[\ell]
> $$
>
> Vì $E[\ell^n] \cong (\mathbb{Z}/\ell^n\mathbb{Z})^2$, ta có $T_\ell(E) \cong \mathbb{Z}_\ell^2$ như $\mathbb{Z}_\ell$-module.

Galois group $\text{Gal}(\bar{k}/k)$ tác động trên $T_\ell(E)$, cho một representation:

$$
\rho_{E,\ell}: \text{Gal}(\bar{k}/k) \to \text{GL}_2(\mathbb{Z}_\ell)
$$

Đây là **$\ell$-adic Galois representation** — công cụ trung tâm của lý thuyết số hiện đại (đặc biệt trong chứng minh Last Fermat Theorem của Wiles).

Liên quan đến isogeny: mọi isogeny $\phi: E_1 \to E_2$ cảm sinh một $\mathbb{Z}_\ell$-linear map $T_\ell(\phi): T_\ell(E_1) \to T_\ell(E_2)$, tương thích với Galois action. Đây là cách biểu diễn isogenies trong ngôn ngữ linear algebra $\ell$-adic.

---

## 6. Kernel Polynomial — Công cụ Tính toán

Thay vì liệt kê tất cả điểm trong kernel, trong tính toán ta dùng **kernel polynomial**:

> [!note] Định nghĩa 2.9 — Kernel Polynomial
> Cho $\phi: E \to E'$ là separable isogeny với $\ker\phi = G$ hữu hạn. **Kernel polynomial** của $\phi$ là đa thức monic:
>
> $$
> h(x) = \prod_{\substack{P \in G \setminus \{\mathcal{O}\}}} (x - x_P)^{1/\text{mult}(x_P)}
> $$
>
> Nói gọn hơn: $h(x)$ là đa thức monic trong $k[x]$ mà tập nghiệm (không kể bội) chính xác là tập $x$-coordinate của tất cả điểm $\neq \mathcal{O}$ trong $G$. Mỗi $x$-coordinate xuất hiện đúng một lần — vì $P$ và $-P$ có cùng $x$-coordinate nên chỉ đóng góp một nghiệm.
>
> Với $G$ cyclic bậc $\ell$ (nguyên tố lẻ): $G \setminus \{\mathcal{O}\}$ gồm $(\ell - 1)$ điểm ghép thành $(\ell-1)/2$ cặp $\{P, -P\}$, nên $\deg h = (\ell - 1)/2$.
>
> [!example] Ví dụ 2.10
> Cho $E: y^2 = x^3 - x$ trên $\mathbb{F}_{101}$. Điểm $P = (0, 0)$ có order 2 (vì $-P = (0, 0) = P$). Kernel polynomial của isogeny với $G = \{\mathcal{O}, (0,0)\}$ là $h(x) = x$.
>
> Cho $E: y^2 = x^3 + 1$ trên $\mathbb{F}_7$, với $G = \langle (0,1) \rangle = \{\mathcal{O}, (0,1), (0,-1)\}$ bậc 3. Kernel polynomial là $h(x) = x$ (chỉ có $x_P = 0$, degree $(3-1)/2 = 1$).

---

## 7. SageMath — Dual Isogeny và Torsion

```python
p = 431
F = GF(p)
E = EllipticCurve(F, [1, 0])

P = E.torsion_points()
print([pt for pt in P if pt.order() == 2])

phi = E.isogeny(E.lift_x(F(0)))
print(phi.degree())
phi_dual = phi.dual()
print(phi_dual.degree())

P_test = E.random_point()
result = phi_dual(phi(P_test))
print(result == 2 * P_test)
```

```python
E = EllipticCurve(GF(101), [0, 1])
ell = 3
torsion_pts = E.torsion_points()
three_tors = [P for P in torsion_pts if P.order() == ell or P.order() == 1]
print(f"E[{ell}] has {len(three_tors)} points (expected {ell**2})")
```

> [!tip] Pattern trong CTF
> Dual isogeny thường xuất hiện trong CTF khi bạn cần "đi ngược" một isogeny đã biết. Nếu challenge cho bạn $\phi: E \to E'$ và yêu cầu tìm image của một điểm dưới $\phi^{-1}$, thực ra bạn cần dùng $\hat{\phi}$ rồi chia cho $[\deg\phi]$: $\phi^{-1}(Q) = \frac{1}{\deg\phi} \hat{\phi}(Q)$ (theo nghĩa: $\hat{\phi}(Q) = [\deg\phi] \cdot \phi^{-1}(Q)$).

---

## Tóm tắt

- Với mỗi isogeny $\phi: E \to E'$ degree $m$, tồn tại duy nhất **dual isogeny** $\hat{\phi}: E' \to E$ thỏa $\hat{\phi} \circ \phi = [m]$.
- Dual isogeny có cùng degree: $\deg\hat{\phi} = \deg\phi = m$.
- **Torsion structure**: $E[m] \cong (\mathbb{Z}/m\mathbb{Z})^2$ khi $\gcd(m, \text{char}(k)) = 1$; với $m = p^r$ và $\text{char}(k) = p$ thì hoặc $E[p^r] \cong \mathbb{Z}/p^r\mathbb{Z}$ (ordinary) hoặc $E[p^r] = \{0\}$ (supersingular).
- Từ mỗi đường cong, có đúng $\ell + 1$ isogeny cyclic degree $\ell$ — đây là degree của $\ell$-isogeny graph.
- **Weil pairing** $e_m: E[m] \times E[m] \to \mu_m$ là bilinear, non-degenerate, alternating; tương thích với isogeny theo công thức $e_m(\phi S, \phi T) = e_m(S, T)^{\deg_s\phi}$.

---

## References

- Silverman, J.H. — *The Arithmetic of Elliptic Curves*, Springer GTM 106, §III.6–8
- De Feo, L. — *Mathematics of Isogeny Based Cryptography*, arXiv:1711.04062, §2
- Sutherland, A. — *18.783 Elliptic Curves*, Lectures 4–6 (MIT OCW, 2025)
- Washington, L. — *Elliptic Curves: Number Theory and Cryptography*, 2nd ed., Ch. 3
