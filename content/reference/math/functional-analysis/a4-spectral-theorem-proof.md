---
title: "A4. Spectral Theorem — Chứng minh chi tiết"
tags: [math, functional-analysis, appendix]
aliases: [Proof Spectral Theorem Detail]
created: 2026-03-31
---

> **Liên quan**: [[14-spectral-theorem|14. Spectral Theorem]]

---

## Phần I — Spectral Theorem cho Compact Self-Adjoint

### Bổ đề: $\|T\| = \sup_{\|x\|=1} |\langle Tx, x\rangle|$

> [!theorem] Lemma A4.1
> Cho $T \in B(H)$ là self-adjoint. Khi đó:
>
> $$
> \|T\| = \sup_{\|x\|=1} |\langle Tx, x\rangle|
> $$

**Proof.** Đặt $M = \sup_{\|x\|=1} |\langle Tx, x\rangle|$. Rõ $M \leq \|T\|$ (Cauchy-Schwarz). Cần chứng minh $\|T\| \leq M$.

Với $x, y \in H$ tùy ý, dùng Polarization Identity (dạng thực):

$$
\operatorname{Re}\langle Tx, y\rangle = \frac{1}{4}\left[\langle T(x+y), x+y\rangle - \langle T(x-y), x-y\rangle\right]
$$

Ước lượng (với $T$ self-adjoint nên $\langle Tx, y\rangle = \overline{\langle Ty, x\rangle}$ và $\langle Tx, x\rangle \in \mathbb{R}$):

$$
|\operatorname{Re}\langle Tx, y\rangle| \leq \frac{M}{4}\left(\|x+y\|^2 + \|x-y\|^2\right) = \frac{M}{2}\left(\|x\|^2 + \|y\|^2\right)
$$

Chọn $y = Tx / \|Tx\|$ (với $Tx \neq 0$): $|\operatorname{Re}\langle Tx, Tx/\|Tx\|\rangle| = \|Tx\| \leq \frac{M}{2}(\|x\|^2 + 1) = M\|x\|$. $\blacksquare$

### Chứng minh đầy đủ: Spectral Theorem cho Compact Self-Adjoint

> [!theorem] Theorem A4.2 — Spectral Theorem (Compact Self-Adjoint)
> Cho $T \in K(H)$ là compact self-adjoint trên Hilbert space phân ly. Khi đó $H$ có ONB $\{e_n\}$ gồm các vector riêng của $T$:
>
> $$
> Te_n = \lambda_n e_n, \quad |\lambda_1| \geq |\lambda_2| \geq \cdots, \quad \lambda_n \to 0
> $$
>
> và $Tx = \sum_n \lambda_n \langle x, e_n\rangle e_n$ với mọi $x \in H$.

**Proof.**

**Bước 1 — Tồn tại eigenvalue đầu tiên**: Theo Lemma A4.1, $\|T\| = \sup_{\|x\|=1} |\langle Tx,x\rangle|$. Chọn dãy $\|x_n\| = 1$ với $|\langle Tx_n, x_n\rangle| \to \|T\|$. Tồn tại dãy con sao cho $\langle Tx_{n_k}, x_{n_k}\rangle \to \lambda_1 \in \{-\|T\|, +\|T\|\}$. Tính:

$$
\|Tx_{n_k} - \lambda_1 x_{n_k}\|^2 = \|Tx_{n_k}\|^2 - 2\lambda_1\langle Tx_{n_k}, x_{n_k}\rangle + \lambda_1^2 \leq 2\lambda_1^2 - 2\lambda_1\langle Tx_{n_k}, x_{n_k}\rangle \to 0
$$

Vì $T$ compact, $(Tx_{n_k})$ có dãy con $Tx_{n_{k_j}} \to w$ trong $H$. Suy ra $\lambda_1 x_{n_{k_j}} \to w$. Đặt $e_1 = w/|\lambda_1|$: thì $Te_1 = \lambda_1 e_1$.

**Bước 2 — Bất biến của không gian trực giao**: Không gian con $H_1 = \{e_1\}^\perp$ là bất biến với $T$: nếu $\langle x, e_1\rangle = 0$ thì $\langle Tx, e_1\rangle = \langle x, Te_1\rangle = \lambda_1\langle x, e_1\rangle = 0$. Hạn chế $T_1 = T|_{H_1}$ vẫn là compact self-adjoint trên Hilbert space $H_1$.

**Bước 3 — Quy nạp**: Lặp lại Bước 1 cho $T_1$ trên $H_1$, được $\lambda_2$ với $|\lambda_2| = \|T_1\| \leq |\lambda_1|$ và vector riêng $e_2 \perp e_1$. Tiếp tục: được dãy $(\lambda_n, e_n)$ với $|\lambda_n|$ giảm và $\{e_n\}$ trực chuẩn.

**Bước 4 — $\lambda_n \to 0$**: Nếu $|\lambda_n| \geq \varepsilon > 0$ với vô hạn $n$, thì $\|Te_n - Te_m\|^2 = \lambda_n^2\|e_n\|^2 + \lambda_m^2\|e_m\|^2 \geq 2\varepsilon^2$ (vì $e_n \perp e_m$) — mâu thuẫn tính compact (dãy $(e_n)$ bị chặn nhưng $(Te_n)$ không có dãy con Cauchy).

**Bước 5 — Khai triển**: Đặt $M = \overline{\operatorname{span}}\{e_n\}$. Hạn chế $T$ lên $M^\perp$: với $x \in M^\perp$, $\|T|_{M^\perp}\| = |\lambda_{N+1}| \to 0$ nên $T|_{M^\perp} = 0$. Vậy $M^\perp \subseteq \ker T$. Mọi $x \in H$:

$$
Tx = T(P_M x + P_{M^\perp} x) = T(P_M x) = T\!\left(\sum_n \langle x, e_n\rangle e_n\right) = \sum_n \lambda_n \langle x, e_n\rangle e_n. \quad \blacksquare
$$

---

## Phần II — Continuous Functional Calculus

> [!theorem] Theorem A4.3 — Continuous Functional Calculus (Chứng minh)
> Cho $T \in B(H)$ self-adjoint. Tồn tại duy nhất *-homomorphism đẳng cấu đẳng cự:
>
> $$
> \Phi: C(\sigma(T)) \to B(H), \quad \Phi(p) = p(T) \text{ với } p \text{ đa thức}
> $$

**Proof (phác thảo).**

**Bước 1 — Định nghĩa trên đa thức**: Với $p(\lambda) = \sum_k a_k \lambda^k$, đặt $p(T) = \sum_k a_k T^k$. Tính chất *-homomorphism là hiển nhiên (từ định nghĩa). Tính đẳng cự: dùng thực tế $\|p(T)\| = \sup_{\lambda \in \sigma(T)} |p(\lambda)|$ — chứng minh bằng Spectral Radius Formula và thực tế $p(T)$ normal.

**Bước 2 — Mở rộng lên $C(\sigma(T))$**: Tập đa thức trù mật trong $C(\sigma(T))$ (Weierstrass). Vì $\Phi$ đẳng cự trên đa thức (tập trù mật), mở rộng duy nhất lên $C(\sigma(T))$ bằng tính liên tục. $\blacksquare$

---

## Phần III — Spectral Measure (PVM) và Tích phân Operator-valued

### Xây dựng Spectral Measure từ Functional Calculus

Cho $T \in B(H)$ self-adjoint và $\Phi: C(\sigma(T)) \to B(H)$ từ Theorem A4.3.

Với mỗi $x, y \in H$, phiếm hàm $f \mapsto \langle \Phi(f) x, y\rangle$ là phiếm hàm tuyến tính bị chặn trên $C(\sigma(T))$. Theo Riesz-Markov Representation Theorem (tương tự Riesz cho không gian Hilbert nhưng dành cho đo): tồn tại đo phức $\mu_{x,y}$ trên $\sigma(T)$ sao cho:

$$
\langle \Phi(f) x, y\rangle = \int_{\sigma(T)} f \, d\mu_{x,y}
$$

Với $x = y$: $\mu_{x,x}$ là đo dương. Với Borel set $\Omega \subseteq \sigma(T)$: đặt $\langle E(\Omega) x, y\rangle = \mu_{x,y}(\Omega)$ — định nghĩa **spectral measure** $E$.

> [!theorem] Theorem A4.4 — Spectral Theorem (Bounded Self-Adjoint, đầy đủ)
> Với $T \in B(H)$ self-adjoint, spectral measure $E$ xác định ở trên thỏa:
>
> $$
> T = \int_{\sigma(T)} \lambda \, dE(\lambda)
> $$
>
> theo nghĩa $\langle Tx, y\rangle = \int_{\sigma(T)} \lambda \, d\mu_{x,y}(\lambda)$ với mọi $x, y \in H$.

**Proof.** Hàm $f(\lambda) = \lambda$ thuộc $C(\sigma(T))$ và $\Phi(f) = T$ (theo định nghĩa $\Phi$). Áp dụng biểu diễn tích phân. $\blacksquare$

---

## Phần IV — Ví dụ: Multiplication Operator

> [!example] Example A4.5 — Spectral Theorem cho Multiplication Operator
> Cho $\phi: \mathbb{R} \to \mathbb{R}$ đo được và bị chặn, toán tử nhân $M_\phi: f \mapsto \phi f$ trên $L^2(\mathbb{R}, m)$ là bounded self-adjoint (nếu $\phi$ thực).
>
> **Phổ**: $\sigma(M_\phi) = \operatorname{ess\,ran}(\phi) = \{\lambda : m(\phi^{-1}(B(\lambda, \varepsilon))) > 0\ \forall\, \varepsilon > 0\}$ — essential range.
>
> **Spectral measure**: $E(\Omega) = M_{\mathbf{1}_{\phi^{-1}(\Omega)}}$ — toán tử nhân bởi hàm chỉ thị.
>
> **Khai triển**: $M_\phi = \int \lambda \, dE(\lambda)$ trùng với $M_\phi f = \phi \cdot f = \int \phi \, dE \cdot f$.
>
> Đây là dạng "chuẩn" của mọi bounded self-adjoint operator: qua phép đổi biến unitary, mọi $T$ self-adjoint tương đương với một multiplication operator trên một $L^2$ nào đó.

---

## Ghi chú về Spectral Theorem cho Unbounded Operators

> [!note] Remark A4.6 — Trường hợp unbounded
> Spectral Theorem mở rộng cho **self-adjoint operators không bị chặn** (unbounded) $T: \mathcal{D}(T) \to H$ (như $T = -\Delta$ trên $L^2(\mathbb{R}^n)$): tồn tại spectral measure $E$ trên $\mathbb{R}$ sao cho $T = \int_{\mathbb{R}} \lambda \, dE(\lambda)$ với $\mathcal{D}(T) = \{x : \int \lambda^2 \, d\mu_{x,x}(\lambda) < \infty\}$.
>
> Chứng minh dùng **Cayley transform**: $U = (T-i)(T+i)^{-1}$ là unitary operator bị chặn, và Spectral Theorem cho $U$ unitary cho spectral measure trên vòng tròn đơn vị $S^1$, rồi chuyển về $\mathbb{R}$.

---

## References

- Rudin, W. *Functional Analysis* (2nd ed.), Chapters 12–13.
- Conway, J. B. *A Course in Functional Analysis* (2nd ed.), Chapter 9–10.
- Reed, M. & Simon, B. *Methods of Modern Mathematical Physics*, Vol. 1, Chapter 6–7.
- Williams, D. P. *Lecture Notes on the Spectral Theorem*, Dartmouth.
