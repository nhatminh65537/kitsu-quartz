---
title: 09. Ate Pairing & Optimal Ate
tags: [math, pairing, elliptic-curves, lesson-09]
aliases: [Ate Pairing, Optimal Ate]
created: 2026-03-09
---

# 9. Ate Pairing và Optimal Ate

> **Prerequisites**: [[08-tate-lichtenbaum-pairing|Tate–Lichtenbaum Pairing]], [[05-torsion-points|Torsion Points]]
> **Objectives**:
> - Hiểu tại sao Ate pairing có Miller loop ngắn hơn Tate: $|T| \approx \sqrt{r}$ thay vì $r$
> - Nắm định nghĩa Ate pairing và vai trò của Frobenius eigenspace $\mathbb{G}_1$/$\mathbb{G}_2$
> - Biết Optimal Ate và lower bound $\lfloor\log_2 r\rfloor/\varphi(k)$ của Vercauteren

---

## Motivation / Intuition

Tate pairing chạy Miller loop với $n = r$ iterations ($r$ là prime order của các điểm) — Miller loop có độ dài $\lfloor\log_2 r\rfloor$.

Câu hỏi: có thể làm ngắn hơn không?

**Ý tưởng cốt lõi**: Frobenius endomorphism $\pi_q: E \to E$ thỏa $\pi_q^k = [q^k]$ trên $E[r]$ (vì $r \mid q^k-1$). Điều này có nghĩa là một "lũy thừa Frobenius" tương đương với một "scalar multiplication" — và đây là cách rút ngắn Miller loop.

Cụ thể: thay vì chạy $r$ iterations, ta chạy $T = t-1$ iterations (với $t$ là trace of Frobenius, $|t| \leq 2\sqrt{q}$, tức $|T| \approx \sqrt{q} \approx \sqrt{r}$). Vì $\log_2|T| \approx (\log_2 r)/2$, Ate pairing nhanh hơn Tate khoảng $2\times$.

Với optimal pairing: đạt được lower bound lý thuyết $\lfloor\log_2 r\rfloor/\varphi(k)$ — nhanh hơn $\varphi(k)$ lần so với Tate.

---

## Frobenius Eigenspaces $\mathbb{G}_1$ và $\mathbb{G}_2$

### Definition

> [!definition] Definition 9.1 — $\mathbb{G}_1$, $\mathbb{G}_2$, $\mathbb{G}_T$
> Cho $E/\mathbb{F}_q$, $r$ prime với $r \mid \#E(\mathbb{F}_q)$, embedding degree $k$. Ký hiệu $\pi_q$ là Frobenius endomorphism $\pi_q(x,y) = (x^q, y^q)$.
>
> Trên $E[r] \subset E(\mathbb{F}_{q^k})$, Frobenius có hai eigenvalue $1$ và $q$:
>
> $$
> \mathbb{G}_1 = E[r] \cap \ker(\pi_q - [1]) = E(\mathbb{F}_q)[r]
> $$
>
> $$
> \mathbb{G}_2 = E[r] \cap \ker(\pi_q - [q])
> $$
>
> $$
> \mathbb{G}_T = \mu_r \subset \mathbb{F}_{q^k}^*
> $$
>
> Tất cả pairings (Weil, Tate, Ate) có dạng $\hat{e}: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$.

> [!note] Remark 9.2 — $\mathbb{G}_2$ và Distortion Map
> $\mathbb{G}_2 = E[r] \cap \ker(\pi_q - [q])$ là eigenspace của eigenvalue $q$. Frobenius tác động trên $\mathbb{G}_2$ như scalar $q$.
>
> - Với **ordinary curves**: $\mathbb{G}_1 \cap \mathbb{G}_2 = \{\mathcal{O}\}$ (hai subgroups phân biệt).
> - Với **supersingular curves**: tồn tại **distortion map** $\psi: \mathbb{G}_1 \to \mathbb{G}_2$ (không tồn tại cho ordinary curves). Điều này cho phép dùng Weil pairing $e_r(P, \psi(Q))$ với $P,Q \in \mathbb{G}_1$.

---

## Ate Pairing

### Definition

> [!definition] Definition 9.3 — Ate Pairing
> Cho $E/\mathbb{F}_q$ ordinary, $r \mid \#E(\mathbb{F}_q)$ prime, embedding degree $k$, trace $t$ (tức $\#E(\mathbb{F}_q) = q+1-t$). Đặt $T = t-1$.
>
> Đặt $N = \gcd(T^k-1, q^k-1)$ và $L = (T^k-1)/N$.
>
> **Ate pairing** là:
>
> $$
> a_T: \mathbb{G}_2 \times \mathbb{G}_1 \to \mathbb{G}_T
> $$
>
> $$
> a_T(Q, P) = f_{T,Q}(P)^{(q^k-1)/r}
> $$
>
> trong đó $f_{T,Q}$ là Miller function với vòng lặp độ dài $\lfloor\log_2|T|\rfloor$, và $f_{T,Q}$ được evaluate tại $P \in \mathbb{G}_1$.

> [!note] Remark 9.4 — Thứ Tự Arguments Bị Đổi!
> So với Tate pairing $\hat{t}_r(P,Q)$ (input thứ nhất từ $\mathbb{G}_1$), Ate pairing $a_T(Q,P)$ có **thứ tự đổi**: input thứ nhất từ $\mathbb{G}_2$, input thứ hai từ $\mathbb{G}_1$.
>
> Lý do: Miller loop cho $f_{T,Q}$ với $Q \in \mathbb{G}_2$ và $P \in \mathbb{G}_1$ cho phép đặt $Q$ là "base point" (được double-and-add), tận dụng cấu trúc Frobenius của $\mathbb{G}_2$.
>
> Điều này làm Miller loop phức tạp hơn (vì $Q \in \mathbb{G}_2 \subset E(\mathbb{F}_{q^k})$ cần arithmetic trên extension), nhưng loop ngắn hơn nhiều.

### Theorem

> [!theorem] Theorem 9.5 — Tính Chất Ate Pairing
> Nếu $r \nmid L$, thì $a_T: \mathbb{G}_2 \times \mathbb{G}_1 \to \mathbb{G}_T$ là:
>
> 1. **Bilinear**: $a_T(Q_1+Q_2,P) = a_T(Q_1,P)\cdot a_T(Q_2,P)$ và $a_T(Q,P_1+P_2) = a_T(Q,P_1)\cdot a_T(Q,P_2)$
> 2. **Non-degenerate**: $a_T(Q,P)=1$ $\forall P \Leftrightarrow Q=\mathcal{O}$
>
> **Proof (sketch).** Ate là lũy thừa của Tate: $a_T(Q,P) = \hat{t}_r(Q,P)^c$ với $c = \sum_{i=0}^{k-1} T^{k-1-i} q^i \bmod r$. Bilinearity và non-degeneracy kế thừa từ Tate (với $r \nmid L$ đảm bảo non-degeneracy). $\blacksquare$

> [!note] Remark 9.6 — Loop Length của Ate vs Tate
> - **Tate**: Miller loop dài $\lfloor\log_2 r\rfloor$ bits ($r \approx q$).
> - **Ate**: Miller loop dài $\lfloor\log_2|T|\rfloor = \lfloor\log_2|t-1|\rfloor$ bits.
>
> Vì $|t| \leq 2\sqrt{q}$ (Hasse bound), ta có $|T| = |t-1| \lesssim 2\sqrt{q} \approx 2\sqrt{r}$, nên:
>
> $$
> \log_2|T| \approx \frac{1}{2}\log_2 r
> $$
>
> Ate nhanh hơn Tate khoảng $2\times$.

---

## Ate Pairing qua Twist

> [!note] Remark 9.7 — Twist và Arithmetic trong $\mathbb{G}_2$
> Miller loop cho Ate dùng $Q \in \mathbb{G}_2 \subset E(\mathbb{F}_{q^k})$. Arithmetic trực tiếp trên $E(\mathbb{F}_{q^k})$ rất đắt (field operations trong $\mathbb{F}_{q^k}$).
>
> **Twist optimization**: nếu $E$ có **sextic twist** $E'/\mathbb{F}_{q^{k/6}}$ (phổ biến với $k=12$), tồn tại isomorphism $\phi_d: E'(\mathbb{F}_{q^{k/d}}) \to E(\mathbb{F}_{q^k})$ với $d=6$. Khi đó:
>
> - Lưu trữ $Q \in \mathbb{G}_2$ trên **twisted curve** $E'(\mathbb{F}_{q^2})$ (với $k/d=12/6=2$).
> - Arithmetic: $\mathbb{F}_{q^2}$ thay vì $\mathbb{F}_{q^{12}}$ — tiết kiệm $12/2 = 6\times$.
> - Khi evaluate line functions $\ell_{T,T}(P)$: sparse multiplication trong $\mathbb{F}_{q^{12}}$ vì $P \in \mathbb{G}_1$ đóng góp ít coefficients.
>
> Đây là lý do thực tế Ate pairing với twist **nhanh hơn nhiều** so với description lý thuyết.

---

## So Sánh Loop Length

> [!example] Example 9.8 — BN curve $x=1$: So sánh Tate và Ate
> BN curve tham số $x=1$: $p=103$, $r=97$, $t=7$, $T = t-1 = 6$, $k=12$.
>
> - **Tate loop**: $\lfloor\log_2 97\rfloor = 6$ iterations (97 = $1100001_2$, 7 bits)
> - **Ate loop**: $\lfloor\log_2 6\rfloor = 2$ iterations (6 = $110_2$, 3 bits)
>
> Ate nhanh hơn 3× trên ví dụ nhỏ này.
>
> Với BN254 thực tế: $r \approx 2^{254}$, $|T| = |t-1| \approx 2^{64}$, nên Ate loop có khoảng $64$ bits thay vì $254$ bits — nhanh hơn $254/64 \approx 4\times$.
>
> **Lower bound**: $\log_2 r / \varphi(k) = 254/4 = 63.5$ bits — Ate gần với bound này!

---

## Optimal Ate Pairing

### Definition

> [!definition] Definition 9.9 — Optimal Pairing
> Một pairing $\hat{e}: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$ gọi là **optimal** nếu nó có thể tính bằng $\lfloor\log_2 r\rfloor/\varphi(k)$ Miller iterations — đây là **lower bound** lý thuyết (Vercauteren conjecture, 2008).

> [!definition] Definition 9.10 — Optimal Ate trên BN/BLS12
> Cho **BN curve** tham số $x$ (với $r(x) = 36x^4+36x^3+18x^2+6x+1$, $t(x)=6x^2+1$):
>
> **Optimal Ate pairing**:
>
> $$
> \hat{a}(Q,P) = \left(f_{6x+2, Q}(P) \cdot \ell_{[6x+2]Q, \pi_p(Q)}(P) \cdot \ell_{[6x+2]Q+\pi_p(Q), -\pi_p^2(Q)}(P)\right)^{(p^{12}-1)/r}
> $$
>
> Trong đó $\pi_p$ là Frobenius, loop có độ dài $\lfloor\log_2(6x+2)\rfloor \approx \log_2 r / 4 = \log_2 r/\varphi(12)$.
>
> Với BN254: $6x+2 \approx 2^{65}$, loop $\approx 65$ bits vs $r \approx 2^{254}$ → hơn 3.9× so với Tate.

> [!note] Remark 9.11 — BLS12-381 Optimal Ate
> Cho **BLS12-381** (tham số $x = -(2^{63}+2^{62}+2^{60}+2^{57}+2^{48}+2^{16})$, $r = x^4-x^2+1$):
>
> Loop parameter: $x$, có $\lfloor\log_2|x|\rfloor = 63$ bits, Hamming weight = 6 (rất thấp).
>
> Optimal Ate: $\hat{a}(Q,P) = f_{x,Q}(P)^{(q^{12}-1)/r}$
>
> Loop dài 63 bits, chỉ 6 additions (low Hamming weight) → cực kỳ hiệu quả.

---

## Miller Loop với Twist: Line Functions

> [!note] Remark 9.12 — Sparse Multiplication trong Line Evaluation
> Khi tính Ate pairing với twist của degree $d=6$:
>
> Line function $\ell_{T,T}(P)$ với $T \in \mathbb{G}_2' \subset E'(\mathbb{F}_{p^2})$ và $P = (x_P, y_P) \in \mathbb{G}_1 \subset E(\mathbb{F}_p)$:
>
> $$
> \ell_{T,T}(P) = y_P - y_T - \lambda_T(x_P - x_T)
> $$
>
> Sau khi map qua twist isomorphism: $\ell$ có dạng $(c_0 + c_1 \alpha)$ trong $\mathbb{F}_{p^{12}} = \mathbb{F}_{p^2}[v]/(v^3-\xi)[\text{...}]$ với nhiều coefficients bằng $0$ — gọi là **sparse**.
>
> Nhân $f$ với sparse element $\ell$: chỉ cần $\sim 1/3$ số phép nhân so với general multiplication trong $\mathbb{F}_{p^{12}}$. Đây là **sparse/compressed multiplication** — một trong những tối ưu quan trọng nhất trong implementation thực tế.

---

## Tóm Tắt Các Phiên Bản Pairing

| Pairing     | Miller input               | Loop length                         | Final exp | Notes                    |
| ----------- | -------------------------- | ----------------------------------- | --------- | ------------------------ |
| Weil        | $f_{r,P}(Q) / f_{r,Q}(P)$  | $2 \lfloor\log_2 r\rfloor$          | Không     | Chậm nhất                |
| Tate        | $f_{r,P}(D_Q)^{(q^k-1)/r}$ | $\lfloor\log_2 r\rfloor$            | Có        | Cơ sở                    |
| Ate         | $f_{T,Q}(P)^{(q^k-1)/r}$   | $\lfloor\log_2T\rfloor$             | Có        | $T=t-1 \approx \sqrt{r}$ |
| Optimal Ate | $f_{s,Q}(P)^{(q^k-1)/r}$   | $\lfloor\log_2 r\rfloor/\varphi(k)$ | Có        | Fastest                  |

---

## SageMath Cheatsheet

```python
# Ate pairing (manual Miller loop với T = t-1)
E = EllipticCurve(GF(103), [0, 1])  # BN-like, k=12 example
# SageMath không có built-in Ate. Dùng Tate built-in hoặc implement.

# Verify optimal Ate via Tate (chúng là powers của nhau):
# optimal_ate(Q,P)^c = tate(P,Q) cho một số c, có thể verify:
# tate(P,Q)^L = ate(Q,P) với L = (T^k-1)/N

# BN254 (thực tế dùng py_ecc):
# from py_ecc.bn128 import pairing, G1, G2, multiply, add
# P = G1
# Q = G2
# e = pairing(Q, P)  # optimal Ate pairing
# print(e)

# BLS12-381 với blspy:
# from blspy import G1Element, G2Element, GTElement
# Pairing built into library

# Verify bilinearity via SageMath cho curve nhỏ:
# E = EllipticCurve(GF(103), [0,1])
# P tìm từ E, n=97
# P.weil_pairing(Q, 97)   # gián tiếp qua Ate
```

---

## Summary / Key Takeaways

- $\mathbb{G}_1 = E[r] \cap \ker(\pi_q-[1])$, $\mathbb{G}_2 = E[r] \cap \ker(\pi_q-[q])$: hai eigenspaces của Frobenius.
- **Ate pairing**: $a_T(Q,P) = f_{T,Q}(P)^{(q^k-1)/r}$ với $T = t-1$, loop ngắn $\lfloor\log_2|T|\rfloor \approx \frac{1}{2}\lfloor\log_2 r\rfloor$.
- Ate là lũy thừa của Tate: $a_T(Q,P) = \hat{t}_r(P,Q)^c$ — mọi tính chất (bilinear, non-degenerate) kế thừa.
- **Twist optimization**: $\mathbb{G}_2$ tính trên $E'(\mathbb{F}_{q^{k/d}})$ thay vì $E(\mathbb{F}_{q^k})$ — giảm field size.
- **Sparse multiplication**: line functions thưa (nhiều zeros) → giảm số phép nhân trong $\mathbb{F}_{q^k}$.
- **Optimal Ate**: đạt lower bound $\lfloor\log_2 r\rfloor/\varphi(k)$; BN254 dùng $6x+2$, BLS12-381 dùng $x$.
- Trade-off: loop ngắn hơn nhưng arithmetic trong $\mathbb{G}_2$ phức tạp hơn (extension field).

---

## References

- Hess, Smart, Vercauteren (2006), "The Eta Pairing Revisited" — Ate pairing ra đời từ đây.
- Vercauteren (2010), "Optimal Pairings" — lower bound $\log_2 r/\varphi(k)$.
- Galbraith, MoPKC, §26.3 (Ate, Optimal Ate), §26.4 (twists and line functions).
- Beuchat et al. (2010), "High-Speed Implementation of Optimal Ate over BN" — implementation BN254.
- Sutherland, MIT 18.783 Lecture 24 — so sánh loop lengths, twist arithmetic.