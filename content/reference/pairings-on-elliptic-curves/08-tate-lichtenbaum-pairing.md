---
title: 08. Tate–Lichtenbaum Pairing
tags: [math, pairing, elliptic-curves, lesson-08]
aliases: [Tate-Lichtenbaum Pairing]
created: 2026-03-09
---

# 8. Tate–Lichtenbaum Pairing

> **Prerequisites**: [[07-millers-algorithm|Miller's Algorithm]], [[06-weil-pairing|Weil Pairing]], [[02-extension-fields-tower-extensions|Extension Fields & Tower Extensions]]  
> **Objectives**:  
> - Hiểu Tate pairing (unreduced) nhận giá trị trong $\mathbb{F}_{q^k}^*/(\mathbb{F}_{q^k}^*)^n$ và tại sao cần final exponentiation
> - Nắm reduced Tate pairing $\hat{t}_n$ và 4 tính chất chính
> - So sánh Weil và Tate: một lần Miller vs hai lần, denominator elimination

---

## Motivation / Intuition

Weil pairing đòi hỏi **hai** lần chạy Miller loop — một cho $f_{n,P}(D_Q)$ và một cho $f_{n,Q}(D_P)$. Nếu ta có thể bỏ đi một trong hai, pairing sẽ nhanh hơn gấp đôi.

**Tate pairing** (John Tate 1958, Stephen Lichtenbaum 1969, Frey–Rück áp dụng vào crypto 1994) là:
$$t_n(P,Q) = f_{n,P}(Q)$$
chỉ một lần Miller. Đánh đổi: kết quả không unique — nó chỉ xác định tới nhân tố $\in (\mathbb{F}_{q^k}^*)^n$. Giải pháp là **final exponentiation**: nâng lên $(q^k-1)/n$, đưa kết quả về $\mu_n$.

Cái giá phải trả cho final exponentiation (~40–50% tổng chi phí trên BN254) ít hơn chi phí chạy thêm một Miller loop. Trong thực tế, Tate pairing và các biến thể (Ate, Optimal Ate) **đều nhanh hơn** Weil pairing.

---

## Định Nghĩa Tate Pairing

### Definition

> [!definition] Definition 8.1 — Tate–Lichtenbaum Pairing (Unreduced)
> Cho $E/\mathbb{F}_q$, $n \geq 1$ với $\gcd(n,q)=1$, và $k$ là embedding degree ($n \mid q^k-1$).
>
> Cho $P \in E(\mathbb{F}_q)[n]$ và $Q \in E(\mathbb{F}_{q^k})$. Chọn $R \in E(\mathbb{F}_{q^k})$ sao cho $R \notin \{\mathcal{O}, P, Q, P-Q\}$, đặt $D_Q = [Q+R] - [R]$.
>
> **Tate–Lichtenbaum pairing** là:
>
> $$
> t_n(P,Q) = f_{n,P}(D_Q) = \frac{f_{n,P}(Q+R)}{f_{n,P}(R)} \in \mathbb{F}_{q^k}^* / (\mathbb{F}_{q^k}^*)^n
> $$

> [!note] Remark 8.2 — Tại sao chỉ well-defined trong coset?
> Giá trị $f_{n,P}(D_Q)$ thay đổi theo:
>
> - **Nhân $f_{n,P}$ bởi $c \in \mathbb{F}_{q^k}^*$**: $f \to cf$ nên $f(D_Q) \to c^{\deg D_Q} \cdot f(D_Q)$. Vì $\deg D_Q = 0$, hệ số $c^0 = 1$ — không thay đổi! Tốt.
>
> - **Thay $D_Q$ bởi $D_Q + \operatorname{div}(g)$**: $f(D_Q + \operatorname{div}(g)) = f(D_Q) \cdot f(\operatorname{div}(g)) = f(D_Q) \cdot g(\operatorname{div}(f))$ (Weil Reciprocity). Và $\operatorname{div}(f) = n[P]-n[\mathcal{O}]$, nên $g(\operatorname{div}(f)) = g(P)^n/g(\mathcal{O})^n \in (\mathbb{F}_{q^k}^*)^n$. Vậy thay đổi là một $n$-th power.
>
> Kết luận: $t_n(P,Q)$ xác định trong $\mathbb{F}_{q^k}^*/(\mathbb{F}_{q^k}^*)^n$.

---

## Final Exponentiation

### Definition

> [!definition] Definition 8.3 — Reduced Tate Pairing
> **Reduced Tate pairing** (hay **modified Tate pairing**) là:
>
> $$
> \hat{t}_n(P, Q) = \left(f_{n,P}(D_Q)\right)^{(q^k-1)/n} \in \mu_n \subseteq \mathbb{F}_{q^k}^*
> $$
>
> Bước nâng lũy thừa $\cdot^{(q^k-1)/n}$ gọi là **final exponentiation** (lũy thừa cuối).

**Tại sao kết quả nằm trong $\mu_n$?** Với mọi $z \in \mathbb{F}_{q^k}^*$: $z^{q^k-1} = 1$, nên $\left(z^{(q^k-1)/n}\right)^n = z^{q^k-1} = 1$. Vậy $z^{(q^k-1)/n} \in \mu_n$.

**Tại sao well-defined?** Hai đại diện $z_1, z_2$ của cùng coset trong $\mathbb{F}_{q^k}^*/(\mathbb{F}_{q^k}^*)^n$ thỏa $z_1 = z_2 \cdot w^n$ với $w \in \mathbb{F}_{q^k}^*$. Khi đó $z_1^{(q^k-1)/n} = z_2^{(q^k-1)/n} \cdot w^{q^k-1} = z_2^{(q^k-1)/n}$.

> [!note] Remark 8.4 — Cấu Trúc của Final Exponentiation ($k=12$)
> Cho embedding degree $k=12$ (BN, BLS12):
>
> $$
> \frac{q^{12}-1}{r} = \underbrace{(q^6-1)(q^2+1)}_{\text{easy part}} \cdot \underbrace{\frac{q^4-q^2+1}{r}}_{\text{hard part}}
> $$
>
> - **Easy part**: tính bằng Frobenius và nghịch đảo trong $\mathbb{F}_{q^{12}}$ — chỉ cần conjugate và multiply, rất nhanh.
> - **Hard part** $\Phi_{12}(q)/r = (q^4-q^2+1)/r$: tính bằng phân tích $q$-ary của tham số $x$ của curve family (BN/BLS12). Chiếm ~40–50% tổng chi phí pairing.

---

## Tính Chất

### Theorem

> [!theorem] Theorem 8.5 — Tính Chất Reduced Tate Pairing
> Reduced Tate pairing $\hat{t}_n: E(\mathbb{F}_q)[n] \times E(\mathbb{F}_{q^k})/nE(\mathbb{F}_{q^k}) \to \mu_n$ thỏa mãn:
>
> 1. **(Bilinear)**: $\hat{t}_n(P_1+P_2,Q) = \hat{t}_n(P_1,Q)\cdot\hat{t}_n(P_2,Q)$ và $\hat{t}_n(P,Q_1+Q_2) = \hat{t}_n(P,Q_1)\cdot\hat{t}_n(P,Q_2)$
>
> 2. **(Non-degenerate)**: $\hat{t}_n(P,Q)=1$ $\forall Q \Leftrightarrow P=\mathcal{O}$; và $\hat{t}_n(P,Q)=1$ $\forall P \Leftrightarrow Q \in nE(\mathbb{F}_{q^k})$
>
> 3. **(Galois-invariant)**: $\hat{t}_n(\sigma P, \sigma Q) = \sigma(\hat{t}_n(P,Q))$ với $\sigma \in \operatorname{Gal}(\mathbb{F}_{q^k}/\mathbb{F}_q)$

> [!warning] Counterexample 8.6 — Tate pairing KHÔNG alternating
> Weil pairing có $e_n(P,P)=1$ (alternating). Tate pairing **không** có tính chất này: $\hat{t}_n(P,P)$ nói chung $\neq 1$.
>
> Ví dụ: trên BN254, $\hat{t}_r(P,P) \neq 1$ khi $P \in \mathbb{G}_1$ và pairing thứ hai cũng có input từ $\mathbb{G}_1$ thông qua distortion map.
>
> Hệ quả: Tate pairing **không anti-symmetric** nói chung.

---

## Denominator Elimination

> [!note] Remark 8.7 — Denominator Elimination trong Miller Loop
> Trong Miller's algorithm, hàm $h_{T_1,T_2} = \ell_{T_1,T_2}/v_{T_1+T_2}$.
>
> Các vertical line $v_T(Q)$ đóng vai trò mẫu số. Khi tính Tate pairing:
>
> $$
> f_{n,P}(D_Q) = \frac{f_{n,P}(Q+R)}{f_{n,P}(R)}
> $$
>
> mỗi $v_T$ trong tử số bị cancel với $v_T$ tương ứng trong mẫu số (do $D_Q = [Q+R]-[R]$).
>
> **Kết quả**: trong Miller loop cho Tate pairing, ta có thể **bỏ hoàn toàn** các denominator $v_T$ — chúng sẽ tự cancel. Điều này gọi là **denominator elimination**, giảm đáng kể số phép nhân.
>
> Trong Weil pairing: denominator elimination không áp dụng hoàn toàn vì không có cùng cấu trúc.

---

## Quan Hệ Tate ↔ Weil

> [!theorem] Theorem 8.8 — Weil = Tỷ Số Hai Tate
> Với $P, Q \in E(\mathbb{F}_{q^k})[n]$:
>
> $$
> e_n(P,Q) = \frac{\hat{t}_n(P,Q)}{\hat{t}_n(Q,P)}
> $$
>
> **Hệ quả**: Weil pairing chậm hơn khoảng 2× so với Tate (hai Miller loops).

---

## Khi Nào Tate Pairing Non-Trivial?

> [!example] Example 8.9 — Điều kiện cho $\hat{t}_n(P,Q) \neq 1$
> Cho $E/\mathbb{F}_q$, $n \mid \#E(\mathbb{F}_q)$, embedding degree $k > 1$.
>
> - **Trường hợp $P, Q \in E(\mathbb{F}_q)[n]$**: Galois-invariance suy ra $\hat{t}_n(P,Q) \in \mathbb{F}_q^* \cap \mu_n$. Nếu $k > 1$, tức $n \nmid q-1$, thì $\mu_n \not\subset \mathbb{F}_q^*$, vậy $\hat{t}_n(P,Q) \in \mu_n \cap \mathbb{F}_q^* = \{1\}$. Pairing suy biến!
>
> - **Cần $Q \in E(\mathbb{F}_{q^k}) \setminus E(\mathbb{F}_{q^j})$ với $j < k$**: khi đó $\hat{t}_n(P,Q)$ thực sự nằm trong $\mu_n \subset \mathbb{F}_{q^k}^* \setminus \mathbb{F}_{q^{k'}}^*$ cho $k' < k$.
>
> **Trong crypto**: $P \in \mathbb{G}_1 = E(\mathbb{F}_q)[r]$ và $Q \in \mathbb{G}_2 = E[r] \cap \ker(\pi_q - [q])$ (eigenspace của Frobenius). Với $Q \in \mathbb{G}_2 \subset E(\mathbb{F}_{q^k})$ nhưng $Q \notin E(\mathbb{F}_{q^j})$ ($j < k$), pairing non-trivial.

---

## SageMath Cheatsheet

```python
# Tate pairing trên curve nhỏ
E = EllipticCurve(GF(7), [-1, 0])
P = E([0, 0]); Q = E([1, 0]); n = 2
t_raw = P.tate_pairing(Q, n, 1)       # unreduced Tate, k=1

# Reduced Tate pairing (final exponentiation)
q = 7; k = 1
t_red = t_raw^((q^k - 1) // n)
print(t_red)                          # element of mu_2

# Verify bilinearity
P2 = 2*P  # = O, so tate(2P,Q) = tate(P,Q)^2 = 1^2 = 1
t_2P = P2.tate_pairing(Q, n, 1)^((q-1)//n)
t_sq  = t_red^2 % (q^1 - 1)          # careful: work in Fq here
print(t_2P, t_red^2)                  # should match

# Miller function only (no SageMath built-in, use custom):
def miller_tate(P, Q, n, E, with_denom=False):
    """f_{n,P}(Q). Set with_denom=False for denominator elimination."""
    Fq = E.base_field(); a4 = E.a4()
    T = P; f = Fq(1)
    for bit in bin(n)[2:][1:]:
        # double step
        xT,yT = T.xy(); xQ,yQ = Q.xy()
        lam = (3*xT^2 + a4)/(2*yT)
        l = yQ - yT - lam*(xQ - xT)
        T2 = 2*T
        if with_denom and T2 != E(0):
            v = xQ - T2.xy()[0]
            f = f^2 * l / v
        else:
            f = f^2 * l
        T = T2
        if bit == '1':
            xT,yT = T.xy()
            if xT == P.xy()[0]:     # vertical
                l2 = xQ - xT
            else:
                lam2 = (yT - P.xy()[1])/(xT - P.xy()[0])
                l2 = yQ - P.xy()[1] - lam2*(xQ - P.xy()[0])
            TP = T + P
            if with_denom and TP != E(0):
                v2 = xQ - TP.xy()[0]
                f = f * l2 / v2
            else:
                f = f * l2
            T = TP
    return f
```

---

## So Sánh Weil vs Tate

| | Weil $e_n$ | Reduced Tate $\hat{t}_n$ |
|---|---|---|
| Số lần Miller | 2 | 1 + final exp |
| Alternating | ✓ ($e_n(P,P)=1$) | ✗ |
| Anti-symmetric | ✓ | ✗ |
| Domain | $E[n] \times E[n]$ | $E(\mathbb{F}_q)[n] \times E(\mathbb{F}_{q^k})$ |
| Denominator elim | Không | Có |
| Tốc độ | ~2× chậm hơn | Cơ sở cho Ate pairing |

---

## Summary / Key Takeaways

- $t_n(P,Q) = f_{n,P}(D_Q)$: Tate pairing chỉ dùng một Miller loop.
- Unreduced: giá trị trong $\mathbb{F}_{q^k}^*/(\mathbb{F}_{q^k}^*)^n$ — well-defined nhờ Weil Reciprocity.
- Reduced: $\hat{t}_n = t_n^{(q^k-1)/n} \in \mu_n$ — final exponentiation triệt tiêu sự mơ hồ coset.
- Final exp ($k=12$): easy part $(q^6-1)(q^2+1)$ + hard part $\Phi_{12}(q)/r$; chiếm ~40–50% chi phí.
- Denominator elimination: bỏ $v_T$ trong Miller loop, cancel khi evaluate $D_Q = [Q+R]-[R]$.
- Non-trivial khi $Q \in \mathbb{G}_2 = \ker(\pi_q - [q])$, không khi $P,Q \in E(\mathbb{F}_q)$ với $k > 1$.
- $e_n(P,Q) = \hat{t}_n(P,Q)/\hat{t}_n(Q,P)$: Weil là tỷ số hai Tate.

---

## References

- Galbraith, MoPKC, §26.3 — định nghĩa đầy đủ, proofs của Lemma 26.3.2 và Theorem 26.3.3.
- Frey & Rück (1994), "A remark concerning m-divisibility..." — ứng dụng crypto đầu tiên.
- Washington, *Elliptic Curves*, §11.5 — Tate pairing và ví dụ.
- Scott et al. (2009), "On the Final Exponentiation" — tối ưu hard part cho $k=12$.
- Sutherland, MIT 18.783 Lecture 24 — denominator elimination và so sánh pairings.