---
title: "12. Computing the Endomorphism γ on E₀"
type: deep-dive
tags: [crypto, endomorphism, gamma, e0, castryck-decru, lesson-12]
aliases: [Computing Gamma]
created: 2026-04-08
---

> **Prerequisites**: [[03-endomorphism-rings|03. Endomorphism Rings]], [[11-castryck-decru-attack|11. Castryck-Decru Attack]]
> **Lesson type**: Deep Dive
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\gamma = [u] + 2i[v]$ | Endomorphism trên $E_0$ viết trong basis $\{1, \iota, \pi, \iota\pi\}$ |
> | $\iota : (x,y) \mapsto (-x, iy)$ | Endomorphism $\iota^2 = [-1]$ trên $E_0$ (với $i^2 \equiv -1 \pmod{p}$) |
> | $\rho$ | 2-isogeny $E_0 \to E_0'$ liên kết với $\iota$ |
> | $c = u^2 + 4v^2$ | Degree của $\gamma$ (reduced norm) |
> | $N = 2^a + c$ | Smooth number cần tìm |

---

## Motivation

Trong attack, cần tìm endomorphism $\gamma \in \text{End}(E_0)$ với degree $c$ sao cho $N = 2^a + c$ là $B$-smooth. Bài này giải thích: (1) cách biểu diễn $\gamma$ tường minh trên $E_0$, (2) cách tính $\gamma(P)$ tại bất kỳ điểm nào, và (3) cách tìm $u, v$ thỏa mãn điều kiện smooth.

---

## 1. Endomorphism Ring Của $E_0$ — Nhắc Lại

Với $p \equiv 3 \pmod{4}$ và $E_0 : y^2 = x^3 + x$ (hoặc $y^2 = x^3 + 6x^2 + x$ trong SIKE), curve $E_0$ có $j = 1728$ và:

$$
\text{End}(E_0) \cong \mathbb{Z}[i, \pi_p] \subset B_{p,\infty}
$$

với:
- $[n]$: scalar multiplication, $[n](x,y) = [n](x,y)$
- $\iota : (x,y) \mapsto (-x, iy)$, với $i^2 \equiv -1 \pmod{p}$, nên $\iota^2 = [-1]$
- $\pi_p : (x,y) \mapsto (x^p, y^p)$ (Frobenius), $\pi_p^2 = [-p]$

Với $p \equiv 3 \pmod{4}$, phần tử $2i = \hat{\rho} \circ \iota \circ \rho$ trong đó $\rho : E_0 \to E_0'$ là 2-isogeny. Có thể tính tường minh.

---

## 2. Biểu Diễn $\gamma = [u] + 2i[v]$

> [!note] Construction 12.1 — Endomorphism $\gamma$
> Trong $\text{End}(E_0)$, định nghĩa:
>
> $$
> \gamma = [u] + 2i[v]
> $$
>
> với $u, v \in \mathbb{Z}$ và $2i = \hat{\rho} \circ \iota \circ \rho$ là endomorphism degree 4.
>
> **Reduced norm (degree)**: $\text{Nrd}(\gamma) = u^2 + 4v^2$ (vì $2i$ có degree 4 và $[u]$ degree $u^2$).

Evaluation của $\gamma$ tại điểm $P \in E_0$:

$$
\gamma(P) = [u](P) + (2i)([v](P))
$$

Trong đó:
- $[u](P)$: scalar multiplication — compute bằng double-and-add
- $(2i)([v](P)) = (\hat{\rho} \circ \iota \circ \rho)([v](P))$: ba isogeny evaluations liên tiếp

Tất cả đều là explicit rational maps — không cần solve bất kỳ bài toán khó nào.

---

## 3. Tìm $u, v$ Sao Cho $N = 2^a + u^2 + 4v^2$ Smooth

Đây là bài toán số học: tìm $u, v \in \mathbb{Z}$ nhỏ sao cho $c = u^2 + 4v^2$ và $N = 2^a + c$ có mọi prime factor nhỏ hơn $B$.

> [!note] Remark 12.2 — Precomputation
> Bước này là **precomputation** hoàn toàn phụ thuộc vào system parameters $(p, a, b)$, **không** phụ thuộc vào public key Alice. Tức là:
>
> - Với SIKE-p434 cụ thể, $\gamma$ được tính một lần offline
> - Attack lặp lại với $\gamma$ cố định trên mọi SIKE-p434 keys
>
> Trong paper gốc (SIKEp434): chọn $a = 110$, $b = 67$ (tham số nhỏ hơn cho example), với $c = 3 \cdot 67 \cdot 107 \cdot 4432 \cdot 487 \cdot 1049 \cdot 2711 \cdot 8297$ (smooth).

**Thuật toán tìm $(u, v)$**: Baby-step giant-step hoặc sieve để tìm $u, v$ nhỏ sao cho $2^a + u^2 + 4v^2$ smooth. Với $u, v = O(p^{1/4})$, tồn tại nghiệm smooth với high probability (heuristic từ Størmer's theorem về representations of primes by $u^2 + 4v^2$).

> [!abstract] Lemma 12.3 — Existence of Smooth $N$
> Với $B = O(\log p)$ smooth bound, heuristically tồn tại $u, v = O(p^{1/4})$ sao cho $N = 2^a + u^2 + 4v^2$ là $B$-smooth. Điều này tương ứng với tìm một smooth representation của một số ngẫu nhiên kích thước $\sim 2^a \sim p^{1/2}$.

---

## 4. Evaluate $\gamma$ Trên Torsion Points — Kỹ Thuật

Trong attack, cần evaluate $\gamma$ trên torsion points $E_0[3^b]$ (cụ thể là trên $P_B$ và $Q_B$). Điều này cần vì kernel của glue map $F$ có dạng $\{(x, -\gamma(x))\}$.

> [!note] Kỹ Thuật 12.4 — Evaluate $\gamma$ Trên Points
> Với $P \in E_0[3^b]$:
>
> $$
> \gamma(P) = [u]P + (\hat{\rho} \circ \iota \circ \rho)([v]P)
> $$
>
> Mỗi bước:
> 1. $[v]P$: scalar multiplication trên $E_0$, cost $O(\log v) = O(\log p)$
> 2. $\rho([v]P)$: evaluate Vélu isogeny $\rho : E_0 \to E_0'$, cost $O(1)$
> 3. $\iota(\rho([v]P))$: apply $\iota = (x,y) \mapsto (-x, iy)$, cost $O(1)$
> 4. $\hat{\rho}(\iota\rho([v]P))$: evaluate dual isogeny $\hat{\rho} : E_0' \to E_0$, cost $O(1)$
> 5. $[u]P$: scalar multiplication, cost $O(\log u)$
> 6. Cộng hai điểm trên $E_0$, cost $O(1)$

Tổng: $O(\log p)$ per point evaluation. Với $2^{a+b} = O(p)$ points cần evaluate: $O(p \log p)$... nhưng thực ra không cần evaluate trên tất cả points — chỉ cần trên $P_B$ và $Q_B$ (2 points), và update incrementally.

---

## 5. Trường Hợp Arbitrary Starting Curve

Với $E_0$ không phải $j = 1728$ (tức là $\text{End}(E_0)$ không known trực tiếp), bước này khó hơn. Maino-Martindale và Robert (2022) xử lý case này — đó là nội dung Lesson 13.

Trong SIKE cụ thể, starting curve là $j = 287496$ gần với $j = 1728$ và có endomorphism ring gần như tương tự — đủ để attack vẫn hoạt động.

---

## 6. Tóm Tắt

- $\gamma = [u] + 2i[v]$: endomorphism tường minh trên $E_0$ với degree $c = u^2 + 4v^2$
- Evaluation: 3 isogeny steps + 2 scalar multiplications — hoàn toàn hiệu quả
- Tìm $(u,v)$: bài toán number theory — tìm smooth representation của $2^a + c$
- Đây là **precomputation** phụ thuộc params, không phụ thuộc public key → chạy offline
- Với SIKE cụ thể: $\gamma$ tương ứng với endomorphism degree nhỏ, compute dễ dàng

---

## References

- Castryck, W. & Decru, T. — *An efficient key recovery attack on SIDH* (ePrint 2022/975), Sections 5–6
- Oudompheng, R. — *A note on implementing direct isogeny determination in the Castryck-Decru attack* (normalesup.org, 2022)
- Love, J. & Boneh, D. — *Supersingular curves with small non-integer endomorphisms*, ANTS XIV (2020)
