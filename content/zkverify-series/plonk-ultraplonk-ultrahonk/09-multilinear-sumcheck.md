---
title: "09. Multilinear Extensions and Sumcheck"
tags: [crypto, multilinear, sumcheck, mle, honk, lesson-09]
aliases: [Multilinear Extensions and Sumcheck]
created: 2026-03-13
---

> **Prerequisites**: [[01-polynomial-iop-kzg|01. Polynomial IOP and KZG]] — polynomial commitments, IOP model; [[02-plonk-arithmetization|02. PLONK Arithmetization]] — polynomial identities trên domain
> **Objectives**:
> - Nắm định nghĩa Multilinear Extension (MLE) và tại sao nó thay thế univariate polynomial trong Honk
> - Hiểu sumcheck protocol từ đầu đến cuối, bao gồm soundness
> - Biết ZeroMorph: cách compile multilinear IOP thành SNARK dùng KZG
> - Nhận biết sự khác biệt cơ bản giữa PLONK (univariate + KZG) và Honk (multilinear + sumcheck)

---

## Motivation

PLONK encode mọi thứ thành **univariate polynomials** trên subgroup $H \subset \mathbb{F}$. Để prove một identity đúng trên $H$, PLONK chia cho vanishing polynomial $Z_H(X)$ và commit quotient. Điều này dẫn đến:

- Degree của $t(X)$ tăng khi circuit lớn → cần split nhiều parts
- FFT/NTT trên subgroup để interpolate → $O(n \log n)$ prover work
- Pairing check để verify → cố định 2 pairings

**UltraHonk** (tiếp theo trong Lesson 10) thay thế toàn bộ approach này bằng **multilinear polynomials** + **sumcheck protocol**. Ưu điểm:

- Prover work: $O(n)$ thay vì $O(n \log n)$ (không cần FFT)
- Flexible domain: Boolean hypercube $\{0,1\}^k$ thay vì roots of unity
- Dễ kết hợp nhiều polynomial relations hơn

Lesson này build toàn bộ nền tảng.

---

## Multilinear Polynomials và MLE

> [!definition] Definition 9.1 — Multilinear Polynomial
> Một **multilinear polynomial** $\tilde{f}: \mathbb{F}^k \to \mathbb{F}$ là polynomial có bậc tối đa $1$ trong mỗi biến:
>
> $$\tilde{f}(X_1, \ldots, X_k) = \sum_{e \in \{0,1\}^k} \tilde{f}(e) \cdot \prod_{i=1}^{k} \left( X_i e_i + (1-X_i)(1-e_i) \right)$$
>
> Đây là **Lagrange interpolation** trên Boolean hypercube $\{0,1\}^k$. Mỗi giá trị $\tilde{f}(e)$ xác định polynomial duy nhất.

**Tại sao multilinear?** Với $n = 2^k$ entries, cần $k = \log_2 n$ biến. Polynomial $\tilde{f}$ encode một vector $n$ values bằng $n$ coefficients trên hypercube — tương tự univariate nhưng trên không gian $k$ chiều.

> [!definition] Definition 9.2 — Multilinear Extension (MLE)
> Cho vector $\mathbf{v} = (v_0, v_1, \ldots, v_{n-1}) \in \mathbb{F}^n$ với $n = 2^k$.
>
> **MLE của $\mathbf{v}$** là polynomial duy nhất $\tilde{f}: \mathbb{F}^k \to \mathbb{F}$ thỏa mãn:
>
> $$\tilde{f}(e) = v_{\text{bits}(e)} \quad \forall e \in \{0,1\}^k$$
>
> trong đó $\text{bits}(e)$ là số nguyên có biểu diễn nhị phân $e$.

> [!definition] Definition 9.3 — Equality Polynomial
> **Equality polynomial** $\text{eq}(\mathbf{x}, \mathbf{r}) : \mathbb{F}^k \times \mathbb{F}^k \to \mathbb{F}$ là:
>
> $$\text{eq}(\mathbf{x}, \mathbf{r}) = \prod_{i=1}^{k} \left( x_i r_i + (1-x_i)(1-r_i) \right)$$
>
> Khi $\mathbf{x}, \mathbf{r} \in \{0,1\}^k$: $\text{eq}(\mathbf{x},\mathbf{r}) = \mathbb{1}[\mathbf{x} = \mathbf{r}]$ (bằng 1 khi $\mathbf{x}=\mathbf{r}$, bằng 0 ngược lại).
>
> **Ý nghĩa**: $\tilde{f}(\mathbf{r}) = \sum_{\mathbf{e} \in \{0,1\}^k} v_e \cdot \text{eq}(\mathbf{e}, \mathbf{r})$ — đánh giá MLE tại $\mathbf{r}$ là tổng có trọng số.

---

## Sumcheck Protocol

### Bài toán

> [!definition] Definition 9.4 — Sumcheck Problem
> Cho multilinear polynomial $f: \mathbb{F}^k \to \mathbb{F}$ và claim:
>
> $$H = \sum_{\mathbf{b} \in \{0,1\}^k} f(b_1, b_2, \ldots, b_k)$$
>
> **Sumcheck protocol** cho phép Prover thuyết phục Verifier rằng $H$ đúng mà Verifier chỉ cần query $f$ tại **một điểm duy nhất** (thay vì $2^k$ điểm).

Verifier check trực tiếp: $O(2^k)$ evaluations. Sumcheck giảm xuống: $O(k)$ rounds, mỗi round $O(1)$ work, kết thúc bằng **một evaluation query** $f(r_1, \ldots, r_k)$.

### Protocol (k rounds)

**Round 1:**

Prover gửi univariate polynomial:
$$s_1(X_1) = \sum_{(b_2,\ldots,b_k) \in \{0,1\}^{k-1}} f(X_1, b_2, \ldots, b_k)$$

Verifier kiểm tra: $s_1(0) + s_1(1) \stackrel{?}{=} H$.

Verifier gửi challenge ngẫu nhiên $r_1 \in \mathbb{F}$.

**Round $i$ (tổng quát):**

Prover gửi:
$$s_i(X_i) = \sum_{(b_{i+1},\ldots,b_k) \in \{0,1\}^{k-i}} f(r_1, \ldots, r_{i-1}, X_i, b_{i+1}, \ldots, b_k)$$

Verifier kiểm tra: $s_i(0) + s_i(1) \stackrel{?}{=} s_{i-1}(r_{i-1})$.

Verifier gửi challenge $r_i$.

**Round k (cuối):**

Prover gửi $s_k(X_k) = f(r_1, \ldots, r_{k-1}, X_k)$ (univariate degree-1).

Verifier kiểm tra $s_k(0) + s_k(1) = s_{k-1}(r_{k-1})$.

Verifier chọn $r_k$, **tự tính** (hoặc query oracle) $f(r_1, \ldots, r_k)$ và kiểm tra $s_k(r_k) = f(r_1, \ldots, r_k)$.

> [!theorem] Theorem 9.5 — Soundness của Sumcheck
> Với $f$ multilinear bậc 1 mỗi biến, nếu $H \neq \sum_{\mathbf{b}} f(\mathbf{b})$, Verifier accept với xác suất tối đa:
>
> $$\Pr[\text{Verifier accept}] \leq \frac{k}{|\mathbb{F}|}$$
>
> (Schwartz-Zippel tích lũy qua $k$ rounds, mỗi round degree 1 → $k/p$ total error.)

---

## Partial Evaluation và Fold

Trong khi thực hiện sumcheck, bước quan trọng là **partial evaluation** (còn gọi là fold):

$$\tilde{f}_{r_1}(X_2, \ldots, X_k) = \tilde{f}(r_1, X_2, \ldots, X_k)$$

Đây là MLE mới trên $k-1$ biến. Tính hiệu quả: nếu $\tilde{f}$ được lưu dưới dạng evaluation table $\{f(\mathbf{e})\}_{\mathbf{e} \in \{0,1\}^k}$, thì fold chạy trong $O(2^{k-1})$ operations:

$$\tilde{f}_{r_1}(\mathbf{e}') = (1-r_1) \cdot \tilde{f}(0, \mathbf{e}') + r_1 \cdot \tilde{f}(1, \mathbf{e}')$$

---

## ZeroMorph — Multilinear Commitment

Sumcheck reduces verification xuống một evaluation query $\tilde{f}(r_1, \ldots, r_k) = v$. Cần **multilinear polynomial commitment scheme** để commit $\tilde{f}$ và prove $\tilde{f}(\mathbf{r}) = v$.

**ZeroMorph** (Kohrita-Towa 2023) convert multilinear opening proof thành **univariate KZG openings**:

> [!definition] Definition 9.6 — ZeroMorph Idea
> Để prove $\tilde{f}(\mathbf{r}) = v$, xây dựng **quotient polynomials** $q_i(X)$ thỏa mãn:
>
> $$\tilde{f}(X_1, \ldots, X_k) - v = \sum_{i=1}^{k} (X_i - r_i) \cdot q_i(X_1, \ldots, X_k)$$
>
> (Đây là multilinear analog của KZG quotient $q(X) = (f(X)-y)/(X-z)$.)
>
> Mỗi $q_i$ được commit bằng KZG univariate (sau khi convert). Verifier kiểm tra bằng pairing.

ZeroMorph được dùng trong **UltraHonk** (Barretenberg) như polynomial commitment scheme.

---

## Implementation — Sumcheck Protocol

```python
def mle_eval(table, r_list, p):
    """
    Evaluate MLE tại điểm r_list = [r1, r2, ..., rk].
    table: evaluation table, kích thước 2^k (list).
    Dùng fold liên tiếp.
    """
    current = list(table)
    for r in r_list:
        n = len(current)
        half = n // 2
        folded = []
        for i in range(half):
            # f(r, ...) = (1-r)*f(0,...) + r*f(1,...)
            val = ((1 - r) * current[i] + r * current[half + i]) % p
            folded.append(val)
        current = folded
    assert len(current) == 1
    return current[0]


def sumcheck_prover_round(table, fixed_vars, p):
    """
    Tính s_i(X_i) = sum over remaining bits.
    fixed_vars: list of (position, value) đã fix từ trước.
    Returns (s_at_0, s_at_1): evaluations của s_i tại 0 và 1.
    """
    k = len(table).bit_length() - 1
    n = len(table)

    # Tính s(0) và s(1) bằng cách fold các biến đã fix
    # rồi sum over remaining free variables
    def eval_with_first_fixed(val):
        current = list(table)
        # Fold các biến đã fix trước
        for r in fixed_vars:
            half = len(current) // 2
            folded = [((1 - r) * current[i] + r * current[half + i]) % p
                      for i in range(half)]
            current = folded
        # Fix biến hiện tại thành val
        half = len(current) // 2
        folded = [(val * current[half + i] + (1 - val) * current[i]) % p
                  for i in range(half)]
        # Sum over remaining (all 0/1 combos already in table)
        return sum(folded) % p

    return eval_with_first_fixed(0), eval_with_first_fixed(1)


def sumcheck_full(table, claimed_sum, challenges, p):
    """
    Simulate sumcheck: verify claimed_sum = sum_{b} f(b).
    challenges: list of k verifier challenges (pre-determined for demo).
    Returns True if all checks pass.
    """
    k = len(challenges)
    assert len(table) == 2**k

    prev_claim = claimed_sum
    fixed = []

    for i, r in enumerate(challenges):
        s0, s1 = sumcheck_prover_round(table, fixed, p)
        # Check: s(0) + s(1) == prev_claim
        if (s0 + s1) % p != prev_claim % p:
            return False, f"Round {i}: {s0}+{s1} != {prev_claim}"
        # Prover evaluates s at r: s(r) = (1-r)*s(0) + r*s(1) (linear)
        prev_claim = ((1 - r) * s0 + r * s1) % p
        fixed.append(r)

    # Final check: s_k(r_k) == f(r_1,...,r_k)
    final_eval = mle_eval(table, challenges, p)
    if prev_claim % p != final_eval % p:
        return False, f"Final: {prev_claim} != {final_eval}"

    return True, "OK"


# --- Demo ---
p = 337

# f: boolean function trên {0,1}^3 (k=3, n=8)
# Bảng evaluation: f(0,0,0)=1, f(0,0,1)=2, ..., f(1,1,1)=8
table = [1, 2, 3, 4, 5, 6, 7, 8]  # f(e) = index+1

# Claimed sum = sum_{b in {0,1}^3} f(b) = 1+2+...+8 = 36
claimed_sum = sum(table) % p
print(f"Claimed sum: {claimed_sum}")

# Verifier challenges
challenges = [17, 83, 211]  # r1, r2, r3

ok, msg = sumcheck_full(table, claimed_sum, challenges, p)
print(f"Sumcheck valid: {ok} ({msg})")

# Test với claimed sum sai
ok_bad, msg_bad = sumcheck_full(table, (claimed_sum + 1) % p, challenges, p)
print(f"Sumcheck with wrong sum: {ok_bad}")  # False

# Verify MLE eval trực tiếp
r = challenges
v = mle_eval(table, r, p)
print(f"MLE eval at {r}: {v}")
```

---

## Sumcheck trong PLONK-style Constraint

Trong UltraHonk, mỗi constraint "$P(\mathbf{w}) = 0$ với mọi row $i$" được encode thành:

$$\sum_{\mathbf{b} \in \{0,1\}^k} \tilde{P}(\tilde{w}_1(\mathbf{b}), \ldots, \tilde{w}_m(\mathbf{b})) = 0$$

rồi dùng sumcheck để prove. Đây là thay thế cho "chia bởi $Z_H$" trong PLONK gốc.

> [!definition] Definition 9.7 — Honk Relation (Overview)
> Honk kiểm tra: tổng của một **relation polynomial** $F$ trên Boolean hypercube bằng 0:
>
> $$\sum_{\mathbf{b} \in \{0,1\}^k} \tilde{q}(\mathbf{b}) \cdot F(\tilde{w}_1(\mathbf{b}), \ldots, \tilde{w}_m(\mathbf{b}), \ldots) = 0$$
>
> trong đó $\tilde{q}$ là **selector MLE**, $\tilde{w}_i$ là **wire MLEs**. Sumcheck protocol prove đẳng thức này.

---

## So sánh: PLONK vs Honk

| Aspect | PLONK (univariate) | Honk (multilinear) |
|--------|-------------------|--------------------|
| Domain | Subgroup $H \subset \mathbb{F}$, size $n$ | Boolean hypercube $\{0,1\}^k$, $k = \log n$ |
| Polynomial commit | KZG univariate | ZeroMorph (multilinear → KZG) |
| Identity check | Divide by $Z_H$, commit quotient $t$ | Sumcheck protocol |
| Prover FFT | $O(n \log n)$ NTT required | Không cần FFT — $O(n)$ folds |
| Proof size | Fixed: ~8 group elements + evaluations | Tương tự nhưng sumcheck messages thêm |
| Verifier work | 2 pairings (constant) | $O(k)$ field ops + 2 pairings |

---

## Bug Bounty: Sumcheck Attack Surface

> [!danger] Vulnerability 9.8 — Sai Round Claim Transition
> Nếu Verifier không kiểm tra $s_i(0) + s_i(1) = \text{prev\_claim}$ mỗi round, Prover có thể gian lận tại một round và "reset" claim sang giá trị fake.

> [!danger] Vulnerability 9.9 — Degree Bypass
> Sumcheck soundness giả định $s_i$ là degree-1 (multilinear). Nếu Prover gửi polynomial bậc cao hơn và Verifier không kiểm tra degree, Prover có thêm degrees of freedom để forge.

> [!danger] Vulnerability 9.10 — Final Evaluation Shortcut
> Nếu final check "$s_k(r_k) = f(\mathbf{r})$" bị bỏ hoặc dùng giá trị sai $\mathbf{r}$, toàn bộ protocol unsound — Prover có thể pass mọi claim giả.

> [!warning] Warning 9.11 — ZeroMorph Shift Polynomials
> ZeroMorph dùng "shift polynomials" $\tilde{f}^{\leq i}$ — nếu các shifts không được commit đúng hoặc pairing check thiếu một term, opening proof có thể bị forge. Đây là attack surface quan trọng trong code Barretenberg.

---

## Summary

- **MLE**: encode vector $n$ values thành multilinear polynomial trên $k = \log n$ biến; unique by Lagrange interpolation on $\{0,1\}^k$.
- **Equality polynomial** $\text{eq}(\mathbf{x}, \mathbf{r})$: basis của MLE evaluation.
- **Sumcheck**: $k$ rounds, mỗi round Prover gửi univariate $s_i(X)$; Verifier check $s_i(0)+s_i(1)=$ prev\_claim; cuối cùng query $f(\mathbf{r})$.
- **Soundness**: error $\leq k/|\mathbb{F}|$ — negligible với $|\mathbb{F}| \approx 2^{256}$.
- **ZeroMorph**: multilinear opening → univariate KZG via quotient polynomials.
- **Honk**: replace "divide by $Z_H$" với sumcheck — $O(n)$ prover, no FFT.

---

## References

- Lund, Fortnow, Karloff, Nisan — *Algebraic Methods for Interactive Proof Systems* (JACM 1992, sumcheck original)
- Thaler — *Proofs, Arguments, and Zero-Knowledge* (Ch. 4: Sumcheck) — https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.html
- Kohrita, Towa — *ZeroMorph: Zero-Knowledge Multilinear-Evaluation Proofs from Homomorphic Univariate Commitments* (ePrint 2023/1284)
- Aztec — *Client-side Proof Generation* (aztec.network/blog)
- zkm.io — *Multivariate Sumcheck Protocol* (2025)
