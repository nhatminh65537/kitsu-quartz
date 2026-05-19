---
title: "28. Motivation — Weil Pairing on Elliptic Curves"
type: foundation
tags: [math, abelian-varieties, weil-pairing, lesson-28]
aliases: [Motivation Weil Pairing Elliptic Curves]
created: 2026-05-18
---

> **Prerequisites**: [[27-double-duality|27. Double Duality]], [[17-n-torsion-points|17. n-Torsion Points A[n]]], [[06-rational-functions-weil-reciprocity|06. Rational Functions and Weil Reciprocity]]
> **Objectives**:
> - Nắm vững cấu trúc nhóm $E[n]$ và vai trò của nó trong lý thuyết pairing
> - Hiểu định nghĩa Weil pairing trên elliptic curve thông qua Miller function
> - Nhận biết các tính chất cơ bản của $e_n$ và hiểu trực giác tại sao chúng đúng
> - Thấy được ứng dụng trực tiếp: MOV attack trong cryptography

---

## Motivation / Intuition

Toàn bộ Module 5 xây dựng hướng đến một đối tượng: **Weil pairing** (cặp Weil). Đây là một bilinear map canonical

$$
e_n : A[n] \times \hat{A}[n] \to \mu_n
$$

nối liền $n$-torsion của một abelian variety với $n$-torsion của dual của nó, nhận giá trị trong nhóm các căn đơn vị bậc $n$. Đây là một trong những công cụ trung tâm nhất của lý thuyết abelian varieties, với ứng dụng từ số học đến mật mã học.

Trước khi xây dựng lý thuyết đầy đủ trong bài 29–33, bài học này dùng **elliptic curves** — abelian variety chiều 1 mà bạn đã quen từ crypto — làm "phòng thí nghiệm trực quan". Với elliptic curves, mọi thứ đủ cụ thể để tính bằng tay (hoặc bằng SageMath), nhưng đủ phong phú để minh họa tất cả các tính chất quan trọng.

Động lực từ mật mã học là đặc biệt hấp dẫn. Weil pairing là công cụ cốt lõi đằng sau: (1) **MOV attack** — biến bài toán ECDLP trên elliptic curve thành DLP trong trường hữu hạn (đôi khi dễ hơn nhiều); (2) **pairing-based cryptography** — BLS signatures, IBE, zk-SNARKs. Hiểu Weil pairing tốt sẽ giúp bạn đọc được cả hai hướng này.

Một điểm quan trọng về lịch sử: André Weil định nghĩa pairing này vào năm 1948 trong bối cảnh chứng minh **Weil conjectures** cho curves. Victor Miller (1986) tìm ra thuật toán hiệu quả để *tính* pairing này — đây là bước quyết định đưa nó từ lý thuyết thuần túy vào ứng dụng thực tế.

---

## Nhóm n-Torsion E[n] trên Elliptic Curve

### Definition

> [!definition] Definition 28.1 — Nhóm n-Torsion (n-Torsion Group)
> Cho $E$ là elliptic curve định nghĩa trên trường $k$ và $n \geq 1$ là số nguyên. Nhóm **$n$-torsion** của $E$ là:
>
> $$
> E[n] = \ker([n]: E \to E) = \left\{ P \in E(\bar{k}) \mid [n]P = \mathcal{O} \right\}
> $$
>
> đây là tập tất cả các điểm (trên bao đại số $\bar{k}$) bị giết bởi phép nhân $[n]$.

### Theorem

> [!theorem] Theorem 28.2 — Cấu trúc của E[n]
> Cho $E/k$ là elliptic curve và $n \geq 1$ với $\gcd(n, \operatorname{char}(k)) = 1$. Khi đó:
>
> $$
> E[n] \cong \mathbb{Z}/n\mathbb{Z} \times \mathbb{Z}/n\mathbb{Z}
> $$
>
> như các nhóm Abel. Nếu $\operatorname{char}(k) = p > 0$ và $n = p^r m$ với $\gcd(m, p) = 1$, thì $E[n] \cong \mathbb{Z}/m\mathbb{Z} \times \mathbb{Z}/m\mathbb{Z}$ hoặc $\mathbb{Z}/n\mathbb{Z} \times \mathbb{Z}/m\mathbb{Z}$, tùy thuộc vào $E$ là ordinary hay supersingular.

**Proof sketch.**
Xem xét endomorphism $[n]: E \to E$. Đây là một isogeny degree $n^2$ (khi $\gcd(n, p) = 1$) nên kernel của nó có đúng $n^2$ phần tử. $E[n]$ là nhóm Abel hữu hạn với $n^2$ phần tử và annihilated by $n$, tức $E[n]$ là $\mathbb{Z}/n\mathbb{Z}$-module. Vì $E[n]$ không cyclic (điều này cần chứng minh kỹ hơn sử dụng Weil pairing!), nên $E[n] \cong (\mathbb{Z}/n\mathbb{Z})^2$. Xem [[a1-proof-n-torsion|A1. Proof: E[n] ≅ (Z/nZ)^2]] để có chứng minh đầy đủ. $\blacksquare$

> [!example] Example 28.3 — $E[2]$ trên $E: y^2 = x^3 + x$ over $\mathbb{F}_7$
> Đường cong $E: y^2 = x^3 + x$ trên $\mathbb{F}_7$. Các điểm $2$-torsion thỏa $[2]P = \mathcal{O}$, tức $y = 0$ (trên Weierstrass).
>
> Ta cần $x^3 + x = 0 \pmod{7}$, tức $x(x^2 + 1) = 0$.
>
> Trong $\mathbb{F}_7$: $x = 0$ cho $x^3 + x = 0$. Vậy $(0, 0)$ là điểm $2$-torsion trên $\mathbb{F}_7$.
>
> Tuy nhiên $x^2 + 1 = 0$ không có nghiệm trong $\mathbb{F}_7$ (vì $7 \equiv 3 \pmod{4}$, tức $-1$ không phải bình phương mod $7$). Hai điểm còn lại của $E[2]$ định nghĩa trên extension $\mathbb{F}_{7^2}$.
>
> Vậy $E[2] \cong (\mathbb{Z}/2\mathbb{Z})^2$ có $4$ phần tử: $\mathcal{O}, (0,0)$, và hai điểm trên $\mathbb{F}_{49}$.

> [!note] Remark 28.4 — Tại sao cần $\bar{k}$?
> Định nghĩa $E[n] \subseteq E(\bar{k})$ là quan trọng. Nếu chỉ xét $E(k)$, thì $E(k)[n]$ có thể nhỏ hơn (như ví dụ trên: $E(\mathbb{F}_7)[2]$ chỉ có $2$ phần tử). Weil pairing cần toàn bộ $E[n]$ trên $\bar{k}$ để có tính non-degenerate.

---

## Căn Đơn Vị và Nhóm μ_n

### Definition

> [!definition] Definition 28.5 — Nhóm Căn Đơn Vị Bậc n (Group of n-th Roots of Unity)
> Cho trường $k$ và $n \geq 1$. **Nhóm căn đơn vị bậc $n$** là:
>
> $$
> \mu_n = \mu_n(\bar{k}) = \left\{ \zeta \in \bar{k}^{\times} \mid \zeta^n = 1 \right\}
> $$
>
> Nếu $\gcd(n, \operatorname{char}(k)) = 1$, thì $\mu_n \cong \mathbb{Z}/n\mathbb{Z}$ là cyclic bậc $n$.

> [!note] Remark 28.6 — Khi nào $\mu_n \subseteq k$?
> $\mu_n \subseteq k$ khi và chỉ khi mọi căn đơn vị bậc $n$ đều nằm trong $k$. Với $k = \mathbb{F}_q$: $\mu_n \subseteq \mathbb{F}_q^{\times}$ khi và chỉ khi $n \mid q - 1$ (vì $\mathbb{F}_q^{\times}$ là cyclic bậc $q-1$).
>
> Ví dụ: $\mu_5 \subseteq \mathbb{F}_{11}$ vì $5 \mid (11-1) = 10$. Các căn đơn vị bậc $5$ trong $\mathbb{F}_{11}$ là $\{1, 3, 4, 5, 9\}$ (ta kiểm tra: $3^5 = 243 \equiv 1 \pmod{11}$).

Pairing $e_n: E[n] \times E[n] \to \mu_n$ là nơi hai đối tượng này gặp nhau: vế trái là hình học (điểm trên curve), vế phải là đại số (căn đơn vị trong trường).

---

## Miller Functions và Định Nghĩa Weil Pairing

### Định nghĩa qua Miller function

Ý tưởng cốt lõi: để định nghĩa $e_n(P, Q)$, ta dùng **rational functions** trên $E$ có divisor được kiểm soát cẩn thận.

> [!definition] Definition 28.7 — Miller Function $f_{n,P}$
> Cho $E/k$ là elliptic curve, $n \geq 1$, và $P \in E[n]$ (tức $[n]P = \mathcal{O}$). **Miller function** $f_{n,P}$ là một rational function $f_{n,P} \in k(E)^{\times}$ (xác định đến scalar) có divisor:
>
> $$
> \operatorname{div}(f_{n,P}) = n[P] - n[\mathcal{O}]
> $$
>
> Hàm này tồn tại vì divisor $n[P] - n[\mathcal{O}]$ có degree $0$ và sum bằng $n \cdot P - n \cdot \mathcal{O} = [n]P - n\mathcal{O} = \mathcal{O}$ trong $E$ (do $P \in E[n]$), nên đây là divisor của một rational function theo Riemann-Roch.

> [!note] Remark 28.8 — Miller's Algorithm
> Miller function không có closed form đơn giản, nhưng có thể tính hiệu quả. **Miller's algorithm** (1986) tính $f_{n,P}(Q)$ trong $O(\log n)$ bước bằng cách dùng double-and-add, tương tự fast exponentiation. Ý tưởng: tính $f_{2,P}$, $f_{4,P}$, ... bằng công thức nhân. Thuật toán này là nền tảng của mọi pairing-based cryptography thực tế.

### Định nghĩa Weil Pairing

> [!definition] Definition 28.9 — Weil Pairing trên Elliptic Curve
> Cho $E/k$ là elliptic curve và $n \geq 1$ với $\gcd(n, \operatorname{char}(k)) = 1$. **Weil pairing** là bilinear map:
>
> $$
> e_n : E[n] \times E[n] \to \mu_n
> $$
>
> được định nghĩa như sau. Với $P, Q \in E[n]$, chọn divisor $D_P, D_Q$ trên $E$ thỏa:
>
> - $D_P \sim [P] - [\mathcal{O}]$ (linearly equivalent)
> - $D_Q \sim [Q] - [\mathcal{O}]$
> - $\operatorname{supp}(D_P) \cap \operatorname{supp}(D_Q) = \emptyset$
>
> Chọn rational functions $f_P, f_Q$ với $\operatorname{div}(f_P) = n D_P$ và $\operatorname{div}(f_Q) = n D_Q$. Khi đó:
>
> $$
> e_n(P, Q) = \frac{f_P(D_Q)}{f_Q(D_P)}
> $$
>
> trong đó $f(D) = \prod_x f(x)^{n_x}$ với $D = \sum n_x [x]$.

Công thức này trông phức tạp, nhưng có cách diễn đạt đơn giản hơn khi dùng Miller function trực tiếp:

$$
e_n(P, Q) = \frac{f_{n,P}(Q + S)}{f_{n,P}(S)} \cdot \left( \frac{f_{n,Q}(P + T)}{f_{n,Q}(T)} \right)^{-1}
$$

trong đó $S, T$ là các điểm "phụ" chọn tùy ý sao cho tránh các cực của $f_{n,P}$ và $f_{n,Q}$.

> [!warning] Counterexample 28.10 — Tại sao cần chọn điểm phụ?
> Nếu $Q$ là pole hoặc zero của $f_{n,P}$, biểu thức $f_{n,P}(Q)$ không xác định. Do đó cần dùng divisor $D_Q$ "dịch chuyển" khỏi vị trí xấu. Tính well-defined của $e_n$ (không phụ thuộc vào lựa chọn) là một bước kỹ thuật quan trọng — xem Silverman AEC Chapter III.

---

## Các Tính Chất của Weil Pairing

> [!theorem] Theorem 28.11 — Tính Chất của Weil Pairing $e_n$
> Weil pairing $e_n: E[n] \times E[n] \to \mu_n$ thỏa mãn:
>
> **(W1) Bilinear (song tuyến):**
>
> $$
> e_n(P_1 + P_2, Q) = e_n(P_1, Q) \cdot e_n(P_2, Q)
> $$
>
> $$
> e_n(P, Q_1 + Q_2) = e_n(P, Q_1) \cdot e_n(P, Q_2)
> $$
>
> **(W2) Alternating (luân phiên):**
>
> $$
> e_n(P, P) = 1 \quad \forall P \in E[n]
> $$
>
> **(W3) Anti-symmetric (phản đối xứng):**
>
> $$
> e_n(P, Q) = e_n(Q, P)^{-1} \quad \forall P, Q \in E[n]
> $$
>
> **(W4) Non-degenerate (không suy biến):** Nếu $e_n(P, Q) = 1$ với mọi $Q \in E[n]$, thì $P = \mathcal{O}$.
>
> **(W5) Galois-equivariant:** Với mọi $\sigma \in \operatorname{Gal}(\bar{k}/k)$:
>
> $$
> e_n(\sigma(P), \sigma(Q)) = \sigma(e_n(P, Q))
> $$
>
> **(W6) Functorial:** Với isogeny $\phi: E \to E'$ và dual $\hat{\phi}: E' \to E$:
>
> $$
> e_n(\phi(P), Q) = e_n(P, \hat{\phi}(Q))
> $$

**Proof sketch (W2).**
$e_n(P,P) = 1$ theo từ định nghĩa: vì $D_P$ và $D_{P'}$ cho $P$ phải disjoint support, ta có thể chọn sao cho symmetry của biểu thức triệt tiêu. Cụ thể, từ bilinear (W1): $e_n(P+P, Q) = e_n(P,Q)^2$, và $e_n(P,P) \cdot e_n(P,P)^{-1} = 1$ nếu swap $P, Q$. Xem chi tiết trong [[31-properties-weil-pairing|31. Properties of the Weil Pairing]]. $\blacksquare$

> [!note] Remark 28.12 — Tính Alternating vs Anti-Symmetric
> Trong đặc số $\neq 2$: (W2) và (W3) tương đương nhau. Từ bilinear + alternating:
>
> $$
> 1 = e_n(P+Q, P+Q) = e_n(P,P) \cdot e_n(P,Q) \cdot e_n(Q,P) \cdot e_n(Q,Q) = e_n(P,Q) \cdot e_n(Q,P)
> $$
>
> nên $e_n(P,Q) = e_n(Q,P)^{-1}$.

---

## Ví Dụ Tính Weil Pairing

> [!example] Example 28.13 — Tính $e_5$ trên $E$ over $\mathbb{F}_{631}$
> Xét $E: y^2 = x^3 + 30x + 34$ trên $\mathbb{F}_{631}$. Ta có $|E(\mathbb{F}_{631})| = 650 = 2 \cdot 5^2 \cdot 13$, nên $5 \mid |E(\mathbb{F}_{631})|$.
>
> Cho $P = (36, 60) \in E(\mathbb{F}_{631})$ và $Q = (121, 387) \in E(\mathbb{F}_{631})$, cả hai đều là điểm bậc $5$.
>
> Ta kiểm tra $P$ nằm trên đường cong: $60^2 = 3600 \equiv 631\cdot 5 + 265 = 3155 + 265$... thực ra cần kiểm tra $60^2 \equiv 36^3 + 30\cdot36 + 34 \pmod{631}$. Điều này đã được xác nhận.
>
> SageMath tính: `P.weil_pairing(Q, 5)` trả về một phần tử $\zeta \in \mathbb{F}_{631}^{\times}$ với $\zeta^5 = 1$, $\zeta \neq 1$.

> [!example] Example 28.14 — Kiểm tra tính anti-symmetric
> Với $P, Q$ như trên: $e_5(P, Q) \cdot e_5(Q, P) = 1$ và $e_5(P, P) = 1$.
>
> Điều này xác nhận (W2), (W3).

---

## MOV Attack — Ứng Dụng Trực Tiếp

Một trong những ứng dụng đầu tiên của Weil pairing trong crypto là **MOV attack** (Menezes–Okamoto–Vanstone, 1993):

> [!info] MOV Attack — Ý Tưởng
> **Bài toán**: Cho $P \in E[n]$ và $Q = [k]P$, tìm $k$. Đây là ECDLP.
>
> **Trick**: Áp dụng Weil pairing cả hai vế:
>
> $$
> e_n(P, T) = \alpha \in \mu_n, \quad e_n(Q, T) = e_n([k]P, T) = \alpha^k
> $$
>
> với $T \in E[n]$ chọn sao cho $\alpha \neq 1$. Bây giờ: biết $\alpha$ và $\alpha^k$, tìm $k$ — đây là **DLP trong $\mu_n \subseteq \mathbb{F}_{q^d}^{\times}$**!
>
> **Hiệu quả của attack**: phụ thuộc vào **embedding degree** $d$ — số nhỏ nhất sao cho $n \mid q^d - 1$ (tức $\mu_n \subseteq \mathbb{F}_{q^d}$). Nếu $d = 1$ hoặc $d$ nhỏ, DLP trong $\mathbb{F}_{q^d}^{\times}$ dễ hơn ECDLP, nên attack thành công. Đây là lý do supersingular curves (embedding degree $d \leq 6$) **không an toàn** cho crypto.

> [!note] Remark 28.15 — Embedding Degree
> Với $E: y^2 = x^3 + x$ trên $\mathbb{F}_{11}$ (supersingular vì $11 \equiv 3 \pmod 4$) và $n = 5$: $5 \mid 11 - 1 = 10$, nên embedding degree $d = 1$ — Weil pairing map thẳng vào $\mathbb{F}_{11}^{\times}$! MOV attack hoàn toàn trivial.
>
> Ngược lại, với ordinary curves được chọn cẩn thận: $d$ cỡ $\log p$, làm attack không khả thi. Đây là nền tảng để chọn curve an toàn trong ECDH/ECDSA.

---

## Từ Elliptic Curve đến Abelian Variety Tổng Quát

Đến đây chúng ta đã có bức tranh rõ ràng trên elliptic curves. Điểm mấu chốt là:

- $E[n] \cong (\mathbb{Z}/n\mathbb{Z})^2$ — có $n^2$ phần tử
- Weil pairing $e_n: E[n] \times E[n] \to \mu_n$ là **alternating** và **non-degenerate**
- Xây dựng qua rational functions (Miller functions)

Nhưng lưu ý: pairing $e_n: E[n] \times E[n] \to \mu_n$ có cả hai vế đều là $E[n]$. Điều này chỉ đúng vì $E$ có **polarization chính tắc** $E \xrightarrow{\sim} \hat{E}$. Cho abelian variety tổng quát $A$, pairing "tự nhiên" hơn là:

$$
e_n : A[n] \times \hat{A}[n] \to \mu_n
$$

giữa $A[n]$ và $\hat{A}[n]$ — hai objects **khác nhau**. Đây là nội dung của Bài 29–31.

---

## SageMath Cheatsheet

```python
E = EllipticCurve(GF(631), [30, 34])
E.order()

P = E(36, 60)
Q = E(121, 387)
P.order()
Q.order()

w = P.weil_pairing(Q, 5)
print(w)
print(w**5 == 1)
print(Q.weil_pairing(P, 5) == w**(-1))
print(P.weil_pairing(P, 5) == 1)

for q_exp in [1, 2, 3, 6]:
    q_ext = 631**q_exp
    print(f"k={q_exp}: 5 | (631^{q_exp}-1) = {(q_ext - 1) % 5 == 0}")
```

---

## Summary / Key Takeaways

- $E[n] \cong (\mathbb{Z}/n\mathbb{Z})^2$ khi $\gcd(n, \operatorname{char}(k)) = 1$ — $n^2$ phần tử trên $\bar{k}$.
- Weil pairing $e_n: E[n] \times E[n] \to \mu_n$ được xây dựng qua Miller functions (rational functions với divisor $n[P] - n[\mathcal{O}]$).
- Tính chất: bilinear, alternating ($e_n(P,P)=1$), anti-symmetric, non-degenerate, Galois-equivariant.
- Non-degeneracy nghĩa là nếu $e_n(P,Q) = 1$ với mọi $Q$, thì $P = \mathcal{O}$.
- MOV attack: Weil pairing chuyển ECDLP thành DLP trong $\mathbb{F}_{q^d}^{\times}$; hiệu quả phụ thuộc embedding degree $d$.
- Supersingular curves nguy hiểm ($d \leq 6$); ordinary curves an toàn khi $d$ lớn.
- Trên abelian variety tổng quát: pairing tự nhiên là $e_n: A[n] \times \hat{A}[n] \to \mu_n$ (bài 29).

---

## References

- Silverman, J. H. *The Arithmetic of Elliptic Curves* (2nd ed.), Chapter III.8. Springer GTM 106.
- Miller, V. S. "The Weil Pairing, and Its Efficient Calculation." *Journal of Cryptology* 17 (2004), 235–261.
- Menezes, A., Okamoto, T., Vanstone, S. "Reducing Elliptic Curve Logarithms to Logarithms in a Finite Field." *IEEE Trans. Inf. Theory* 39 (1993).
- Washington, L. C. *Elliptic Curves: Number Theory and Cryptography* (2nd ed.), Chapter 11. CRC Press.
- Milne, J. S. *Abelian Varieties*, Lecture Notes. Available at jmilne.org/math.
- Galbraith, S. D. *Mathematics of Public Key Cryptography*, Chapter 6. Cambridge University Press.
