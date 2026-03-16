---
title: "05. Permutation Argument"
type: deep-dive
tags: [plonk, permutation-argument, grand-product, deep-dive, lesson-05]
aliases: [Permutation Argument, Grand Product Argument, Copy Constraint Check]
source: "PlonK: Permutations over Lagrange-bases for Oecumenical Noninteractive arguments of Knowledge — Gabizon, Williamson, Ciobotaru, 2019"
created: 2026-03-16
---

> **Prerequisites**: AGM và Q-DLOG (xem [[02-agm-qdlog|02. AGM & Q-DLOG]]), Polynomial Protocols (xem [[04-polynomial-protocols|04. Polynomial Protocols]]), Schwartz-Zippel Lemma  
> 🔴 **Prerequisite references**: Bayer, Groth — *Efficient Zero-Knowledge Argument for Correctness of a Shuffle* [BG12] (kỹ thuật grand product gốc — PlonK adapt trực tiếp từ paper này)  
> **Lesson type**: Deep Dive  
> **Covers**: §5 (§5.1 basic permutation check, §5.2 extended permutation, Lemma 5.3, copy-satisfy property), phần §1.1 liên quan đến permutation argument
>
> **Notation** (ký hiệu mới trong bài này):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $H$ | Multiplicative subgroup bậc $n$ của $\mathbb{F}$ ($H = \{1, \omega, \omega^2, \ldots, \omega^{n-1}\}$) | $H$ |
> | $\omega$ | Primitive $n$-th root of unity (generator của $H$) | $g$ (paper dùng $g$; dùng $\omega$ để tránh nhầm với group generator) |
> | $Z_H(X)$ | Vanishing polynomial của $H$: $Z_H(X) = X^n - 1$ | $Z_H(X)$ |
> | $L_1(X)$ | Lagrange basis tại $1 \in H$: $L_1(1) = 1$, $L_1(\omega^i) = 0$ với $i > 0$ | $L_1(X)$ |
> | $Z(X)$ | Accumulator polynomial (grand product) | $Z(X)$ |
> | $\beta, \gamma$ | Verifier random challenges cho permutation check | $\beta, \gamma$ |
> | $\sigma$ | Permutation trên $[kn]$ (copy constraint wiring) | $\sigma$ |
> | $S_{\mathsf{ID},j}(X)$ | Identity polynomial: $S_{\mathsf{ID},j}(\omega^i) = (j-1)n + i$ | $S_{\mathsf{ID},j}$ |
> | $S_{\sigma,j}(X)$ | Permutation polynomial: $S_{\sigma,j}(\omega^i) = \sigma((j-1)n+i)$ | $S_{\sigma,j}$ |
> | $k$ | Số polynomials trong extended permutation ($k=3$ trong PlonK) | $k$ |

---

## Motivation

### Bài toán: wires kết nối giữa các gates

Khi ta arithmetize một circuit (Lesson 06), mỗi gate $i$ có ba wire values: $a_i$ (left input), $b_i$ (right input), $c_i$ (output). **Gate constraints** kiểm tra từng gate độc lập. Nhưng circuit không chỉ gồm các gates riêng lẻ — chúng được **kết nối**: output của gate này là input của gate khác.

Ví dụ: nếu $c_3 = a_7$ (output gate 3 = left input gate 7), ta cần enforce $c_3 = a_7$. Đây là **copy constraints** — và chúng quyết định tính đúng đắn của cả circuit.

**Vấn đề**: có đến $3n$ wire values ($a_1, \ldots, a_n, b_1, \ldots, b_n, c_1, \ldots, c_n$) và có thể hàng trăm copy constraints. Làm sao verify tất cả bằng một số polynomial identities nhỏ?

**Giải pháp của PlonK**: encode toàn bộ wiring diagram như một **permutation** $\sigma$ trên $3n$ positions, rồi dùng **permutation argument** để chứng minh các wire values thỏa mãn đúng permutation đó — trong $O(1)$ group elements và 1 polynomial identity.

> [!info] 🟡 Kỹ thuật Grand Product từ Bayer-Groth [BG12]
> Bayer và Groth [BG12] giới thiệu "grand product argument" để chứng minh correctness của shuffle trong zero-knowledge. Ý tưởng: để check rằng hai danh sách $(a_1, \ldots, a_n)$ và $(b_1, \ldots, b_n)$ là permutation của nhau, ta check multiset equality qua sản phẩm:
>
> $$\prod_{i=1}^{n} (a_i + r) = \prod_{i=1}^{n} (b_i + r) \quad \text{cho random } r$$
>
> Bởi Schwartz-Zippel, nếu hai multisets bằng nhau thì equality hold với xác suất 1; nếu khác nhau thì fail với xác suất $\geq 1 - n/|\mathbb{F}|$.
>
> PlonK adapt kỹ thuật này vào setting đa thức trên multiplicative subgroup $H$, thêm challenge thứ hai $\beta$ để encode vị trí (không chỉ giá trị) vào grand product. Đây là đột phá cho phép check wiring (copy constraints) — không chỉ giá trị.
>
> *(theo [BG12]: Bayer, Groth — Efficient Zero-Knowledge Argument for Correctness of a Shuffle, EUROCRYPT 2012)*

---

## §5.1 — Basic Permutation Check (Một Polynomial)

Trước tiên xét trường hợp đơn giản: check rằng hai polynomial $f, g \in \mathbb{F}_{<n}[X]$ thỏa mãn $g = \sigma(f)$ — tức là $(g(\omega^0), g(\omega^1), \ldots, g(\omega^{n-1})) = \sigma((f(\omega^0), \ldots, f(\omega^{n-1})))$ với $\sigma$ là permutation trên $[n]$.

**Ý tưởng**: Thay vì so sánh từng phần tử, ta so sánh hai **grand products** với random "fingerprints" $(\beta, \gamma)$:

$$\prod_{i \in [n]} \bigl(f(\omega^i) + \beta \cdot i + \gamma\bigr) \stackrel{?}{=} \prod_{i \in [n]} \bigl(g(\omega^i) + \beta \cdot \sigma(i) + \gamma\bigr)$$

Vế trái encode từng giá trị $f(\omega^i)$ tại vị trí $i$; vế phải encode giá trị $g(\omega^i)$ tại vị trí $\sigma(i)$ (vị trí sau permutation). Nếu $g = \sigma(f)$ thì hai multisets $\{(i, f(\omega^i))\}$ và $\{(\sigma(i), g(\omega^i))\}$ bằng nhau → grand products bằng nhau.

**Accumulator polynomial** $Z(X)$: Thay vì tính grand products trực tiếp, PlonK build chúng từng bước qua accumulator:

> [!note] Protocol 5.1 — Basic Permutation Check (§5.1)
> **Context**: Polynomial protocol với trusted party $\mathcal{I}$  
> **Inputs**: $f, g \in \mathbb{F}_{<n}[X]$, permutation $\sigma: [n] \to [n]$  
> **Preprocessed**: $S_{\mathsf{ID}}(X)$ với $S_{\mathsf{ID}}(\omega^i) = i$; $S_\sigma(X)$ với $S_\sigma(\omega^i) = \sigma(i)$
>
> 1. $V_{\mathsf{poly}}$ gửi $\beta, \gamma \stackrel{R}{\leftarrow} \mathbb{F}$
>
> 2. $P_{\mathsf{poly}}$ tính accumulator $Z \in \mathbb{F}_{<n}[X]$ với:
>
> $$Z(\omega^0) = 1, \qquad Z(\omega^{i+1}) = Z(\omega^i) \cdot \frac{f(\omega^i) + \beta \cdot S_{\mathsf{ID}}(\omega^i) + \gamma}{g(\omega^i) + \beta \cdot S_\sigma(\omega^i) + \gamma}$$
>
> và gửi $Z$ cho $\mathcal{I}$
>
> 3. $V_{\mathsf{poly}}$ check các **polynomial identities trên $H$**:
>
> **(a) Khởi đầu đúng**: $L_1(X)\bigl(Z(X) - 1\bigr) \equiv 0 \pmod{Z_H(X)}$
>
> **(b) Transition đúng**: $Z(\omega X)\bigl(g(X) + \beta S_\sigma(X) + \gamma\bigr) \equiv Z(X)\bigl(f(X) + \beta S_{\mathsf{ID}}(X) + \gamma\bigr) \pmod{Z_H(X)}$
>
> **(c) Kết thúc đúng**: $Z(\omega^{n-1}) \cdot \bigl(g(\omega^{n-1}) + \beta S_\sigma(\omega^{n-1}) + \gamma\bigr) = Z(\omega^n) \cdot \bigl(f(\omega^{n-1}) + \ldots\bigr)$

> [!tip] 💡 Agent note
> **Tại sao $Z(\omega X)$ thay vì $Z(\omega^{i+1})$ trong polynomial identity?** Trong multiplicative subgroup $H$, nhân một điểm với $\omega$ cho điểm kế tiếp: nếu $X = \omega^i$ thì $\omega X = \omega^{i+1}$. Đây chính là lý do tại sao multiplicative subgroup "interact well" với neighbor relations — một đặc tính cực kỳ thuận tiện cho permutation argument, như paper nhận xét trong §1.1. Lagrange basis $L_1(X) = \frac{1}{n} \cdot \frac{X^n - 1}{X - 1}$ cũng có dạng sparse vì $Z_H(X) = X^n - 1$.

**Correctness**: Nếu $g = \sigma(f)$, thì tất cả các terms trong accumulator tương ứng nhau, $Z(\omega^n) = Z(\omega^0) = 1$, và các identity (a)(b)(c) đều thỏa mãn.

---

## §5.2 — Extended Permutation Check (Nhiều Polynomials)

Trong PlonK thực tế, cần check permutation trên **$k=3$ polynomials** $(f_L, f_R, f_O)$ (left/right/output wires) đồng thời. Permutation $\sigma$ là permutation trên $3n$ positions.

**Coset trick**: Gán cho mỗi column $j \in [k]$ một coset phân biệt của $H$ qua một element $k_j \in \mathbb{F}$ (thường $k_1 = 1$, $k_2, k_3$ là các coset representatives):

$$S_{\mathsf{ID},j}(\omega^i) = k_j \cdot \omega^i \qquad (j \in [k],\ i \in [n])$$

Điều này gán label duy nhất $k_j \cdot \omega^i$ cho position $(j, i)$, và labels cho $k=3$ columns sẽ là các cosets phân biệt của $H$ trong $\mathbb{F}^*$.

> [!note] Protocol 5.2 — Extended Permutation Check (§5.2)
> **Inputs**: $f_1, \ldots, f_k, g_1, \ldots, g_k \in \mathbb{F}_{<n}[X]$, permutation $\sigma$ trên $[kn]$  
> **Preprocessed**: $S_{\mathsf{ID},j}(\omega^i) = k_j \cdot \omega^i$; $S_{\sigma,j}(\omega^i) = k_{\sigma_{\mathsf{col}}(j,i)} \cdot \omega^{\sigma_{\mathsf{row}}(j,i)}$
>
> 1. $V_{\mathsf{poly}}$ gửi $\beta, \gamma \stackrel{R}{\leftarrow} \mathbb{F}$
>
> 2. $P_{\mathsf{poly}}$ tính accumulator $Z \in \mathbb{F}_{<n}[X]$:
>
> $$Z(\omega^0) = 1$$
>
> $$Z(\omega^{i+1}) = Z(\omega^i) \cdot \prod_{j=1}^{k} \frac{f_j(\omega^i) + \beta \cdot S_{\mathsf{ID},j}(\omega^i) + \gamma}{g_j(\omega^i) + \beta \cdot S_{\sigma,j}(\omega^i) + \gamma}$$
>
> 3. $V_{\mathsf{poly}}$ check các polynomial identities trên $H$:
>
> **(a)** $L_1(X)(Z(X) - 1) \equiv 0 \pmod{Z_H(X)}$
>
> **(b)** $Z(\omega X) \cdot \prod_{j=1}^{k}\bigl(g_j(X) + \beta S_{\sigma,j}(X) + \gamma\bigr) \equiv Z(X) \cdot \prod_{j=1}^{k}\bigl(f_j(X) + \beta S_{\mathsf{ID},j}(X) + \gamma\bigr) \pmod{Z_H(X)}$
>
> **(c)** $Z(\omega^n) = 1$ (cuối accumulator quay về 1)

Trong PlonK, $k = 3$, $f_j = g_j$ là cùng một tập wire polynomials $(f_L, f_R, f_O)$, và permutation $\sigma$ mô tả wiring của circuit. Điều này tương đương check: $(f_L, f_R, f_O)$ **copy-satisfies** wiring partition $T_\mathcal{C}$.

---

## Lemma 5.3 — Soundness của Extended Permutation Check

> [!abstract] Lemma 5.3 (PlonK §5.2)
> Fix $f_1, \ldots, f_k, g_1, \ldots, g_k \in \mathbb{F}_{<d}[X]$ và permutation $\sigma$ trên $[kn]$ làm input. Nếu $(g_1, \ldots, g_k) \neq \sigma(f_1, \ldots, f_k)$ (tức là wiring không thỏa mãn), thì:
>
> $$\Pr_{\beta, \gamma \leftarrow \mathbb{F}}\!\left[\text{Protocol 5.2 output } \mathsf{acc}\right] \leq \frac{kn}{|\mathbb{F}|} = \mathsf{negl}(\lambda)$$

**Proof sketch** (theo [GWC19, §5.2]):

$(g_1, \ldots, g_k) \neq \sigma(f_1, \ldots, f_k)$ nghĩa là multisets

$$\bigl\{(k_j \cdot \omega^i,\; f_j(\omega^i))\bigr\}_{j,i} \quad \text{và} \quad \bigl\{(k_j \cdot \omega^i,\; g_j(\omega^i))\bigr\}_{j,i}$$

là khác nhau khi được indexed theo $\sigma$. Với $(\beta, \gamma)$ random, bởi Schwartz-Zippel áp dụng cho sản phẩm rational function của $\beta, \gamma$:

$$\prod_{j,i} \frac{f_j(\omega^i) + \beta k_j \omega^i + \gamma}{g_j(\omega^i) + \beta S_{\sigma,j}(\omega^i) + \gamma} \neq 1$$

với xác suất $\geq 1 - kn/|\mathbb{F}|$. Khi grand product $\neq 1$, accumulator $Z$ không thể quay về $Z(\omega^n) = 1$, làm identity (c) fail. $\blacksquare$

---

## Copy-Satisfy — Tổng quát hóa cho PlonK

Permutation argument được dùng trong dạng tổng quát nhất: "copy-satisfy". Cho partition $\mathcal{T} = \{T_1, \ldots, T_s\}$ của $[kn]$ thành các blocks phân biệt. Ta nói $f_1, \ldots, f_k$ **copy-satisfy** $\mathcal{T}$ nếu với mọi $\ell, \ell'$ trong cùng block $T_i$: $f_j(\omega^{i_j}) = f_{j'}(\omega^{i_{j'}})$ (giá trị tại hai positions trong cùng block bằng nhau).

Đây chính xác là ý nghĩa của copy constraints trong circuit: mỗi block $T_i$ là một nhóm wire positions phải mang cùng giá trị.

**Kết nối với permutation**: Copy-satisfy $\mathcal{T}$ tương đương với tồn tại một permutation $\sigma$ sao cho $(f_1, \ldots, f_k) = \sigma(f_1, \ldots, f_k)$ — prover dùng chính $(f_L, f_R, f_O)$ cho cả hai vế. Protocol 5.2 với $f_j = g_j$ sẽ check đúng điều này:

$$Z(\omega X) \cdot \prod_{j}\bigl(f_j(X) + \beta S_{\sigma,j}(X) + \gamma\bigr) \equiv Z(X) \cdot \prod_{j}\bigl(f_j(X) + \beta S_{\mathsf{ID},j}(X) + \gamma\bigr)$$

---

## Vai trò trong PlonK Protocol

Permutation argument sinh ra **một polynomial** $Z(X)$ mà prover phải commit. Trong PlonK Protocol đầy đủ (Lesson 07), đây là Round 3: prover nhận $(\beta, \gamma)$ từ verifier và commit $[Z(x)]_1$.

Toàn bộ copy constraints được nén vào **hai polynomial identities trên $H$** — được check bằng một quotient polynomial tại điểm ngẫu nhiên. Không cần gửi $3n$ equality constraints riêng biệt.

```mermaid
graph LR
    A[3n copy constraints] -->|encode thành permutation sigma| B[S_sigma polynomials]
    B -->|prover tính| C[Accumulator Z X]
    C -->|commit| D[Z commitment]
    D -->|verifier check 2 identities tại random point| E[Copy constraints verified]
    style A fill:none
    style B fill:none
    style C fill:none
    style D fill:none
    style E fill:none
```

---

## Summary

- **Grand product check** [BG12 adapted]: để verify $(g_1,\ldots,g_k) = \sigma(f_1,\ldots,f_k)$, build accumulator $Z$ sao cho $Z(\omega^0)=1$ và $Z$ nhân với ratio của các "fingerprinted terms" tại mỗi bước.
- **Hai random challenges** $\beta, \gamma$: $\beta$ phân biệt vị trí (position), $\gamma$ phân biệt giá trị — cùng nhau đảm bảo Schwartz-Zippel reject mọi fake permutation.
- **Ba polynomial identities** kiểm tra: (a) $Z$ bắt đầu bằng 1, (b) recurrence đúng tại mọi bước, (c) $Z$ kết thúc bằng 1.
- **Multiplicative subgroup** $H$ cho phép "$\omega X$" trong polynomial identity — neighbor relation được encode trực tiếp trong polynomial arithmetic.
- **Lemma 5.3**: soundness với xác suất $\leq kn/|\mathbb{F}| = \mathsf{negl}(\lambda)$.
- **Copy-satisfy**: tổng quát hóa — prover dùng chính $(f_L, f_R, f_O)$ cho cả hai vế, check wiring của toàn circuit.

---

## References

- [GWC19] Gabizon, Williamson, Ciobotaru — *PlonK*, ePrint 2019/953, §5
- [BG12] Bayer, Groth — *Efficient Zero-Knowledge Argument for Correctness of a Shuffle*, EUROCRYPT 2012 (🟡 Integrated: grand product technique, accumulator construction)
