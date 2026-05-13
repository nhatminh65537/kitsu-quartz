---
title: "13. Complexity Analysis & Heuristics"
type: deep-dive
tags: [crypto, complexity, heuristics, castryck-decru, lesson-13]
aliases: [Complexity Analysis]
created: 2026-04-08
---

> **Prerequisites**: [[11-castryck-decru-attack|11. Castryck-Decru Attack]], [[12-computing-gamma|12. Computing Gamma]]
> **Lesson type**: Deep Dive
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $B$ | Smooth bound cho $N = 2^a + c$ |
> | $\lambda$ | Security parameter ($\approx \log_2 p$) |
> | $T_{\text{Richelot}}$ | Time cho một Richelot step |
> | $\epsilon_{\text{false}}$ | False positive probability |

---

## Motivation

Attack chạy trong thời gian ngắn đến mức đáng kinh ngạc — SIKEp434 bị phá trong ~10 phút. Bài này phân tích tại sao: breakdown cost của từng bước, heuristics về false positive probability, và tại sao attack là **polynomial** (không phải exponential).

---

## 1. Tổng Quan Complexity

> [!abstract] Theorem 13.1 — Polynomial Time Recovery (Heuristic)
> Giả sử $\text{End}(E_0)$ được biết và $N = 2^a + c$ là $B$-smooth với $B = \text{poly}(\lambda)$. Khi đó Castryck-Decru attack recover $s_A$ trong thời gian:
>
> $$
> T_{\text{attack}} = \tilde{O}(\lambda^3) \quad \text{(heuristic)}
> $$
>
> ngoại trừ việc factor một số integers phụ thuộc vào system params (không phụ thuộc instance).

"Heuristic" vì argument về smooth probability và false positive rate không có proof chặt — nhưng được verify experimentally.

---

## 2. Breakdown Của Từng Bước

**Precomputation** (một lần, offline):
- Tìm $(u, v)$ sao cho $c = u^2 + 4v^2$ và $N = 2^a + c$ $B$-smooth: $O(\sqrt{N})$ hay $\tilde{O}(2^{a/2})$ bằng baby-step giant-step
- Factor $N = \prod \ell_i$: trivial vì $N$ nhỏ (product of small primes)

**Mỗi bit recovery** (lặp $a$ lần):
- Build glue kernel từ torsion images: $O(1)$ evaluations tại $E_0[N]$
- Một bước Richelot/$(3,3)$-isogeny: $O(1)$ field operations (constant per prime $\ell | N$)
- Chain $b$ steps: $O(b)$ Richelot steps
- Split test ($\delta = 0$): $O(1)$

**Tổng**: $a \cdot O(b) = O(ab) = O(\log^2 p)$ isogeny steps. Mỗi step: $O(\log p)$ field ops.

> [!info] Concrete Numbers cho SIKEp434
> - $a = 216$, $b = 137$
> - Precompute $\gamma$: negligible (small integers)
> - Per-bit: ~$137$ Richelot steps
> - Total: $216 \times 137 = 29{,}592$ Richelot steps
> - Each Richelot step trên $\mathbb{F}_{p^2}$: ~milliseconds
> - Total time: **~10 phút** trên một CPU core (Magma/Sage implementation)

---

## 3. Tại Sao $N$ Smooth Là Cần Thiết?

Để compute chain Richelot isogenies, cần $N$ là smooth vì mỗi Richelot step ứng với một prime $\ell | N$. Nếu $N$ có prime factor lớn $\ell_{\text{large}}$, thì phải compute $(\ell_{\text{large}}, \ell_{\text{large}})$-isogeny — rất tốn kém với $\ell_{\text{large}}$ lớn.

Điều kiện smooth tương ứng với: attack không bị bottlenecked bởi một isogeny step đơn lẻ.

---

## 4. Heuristic False Positive Analysis

> [!abstract] Claim 13.2 — False Positive Rate (Heuristic)
> Xác suất một candidate $\kappa \neq \kappa_i^*$ sai vẫn pass split test ($\Delta = 0$) là:
>
> $$
> \epsilon_{\text{false}} \approx \frac{10}{p}
> $$
>
> Heuristic này đến từ: tỷ lệ product surfaces (split Jacobians) trong superspecial isogeny graph là khoảng $10/p$.

**Justification** (từ paper): Graph $\mathcal{G}_{(3,3)}(p)$ có $\sim p/12$ vertices (superspecial abelian surfaces). Trong số này, chỉ có $\sim 10$ loại surfaces split (product của hai supersingular ECs). Vì attacker construct surface ngẫu nhiên từ wrong candidate, xác suất ngẫu nhiên trúng split surface là $O(1/p)$.

> [!warning] Điều Này Là Heuristic
> Paper gốc acknowledge đây là argument heuristic. Không có proof toán học chặt chẽ rằng wrong candidates không split. Tuy nhiên experimentally, false positives cực hiếm và không ảnh hưởng đến practical correctness.

---

## 5. Phân Tích Trường Hợp $\text{End}(E_0)$ Không Known

Nếu $\text{End}(E_0)$ không known (arbitrary starting curve thay vì $j = 1728$), thì:
- Bước tìm $\gamma$ không khả thi (chưa biết basis của $\text{End}(E_0)$)
- Attack của Castryck-Decru không apply trực tiếp

Maino-Martindale (2022) và Robert (2022) xử lý case này:

> [!info] Maino-Martindale Extension
> Với arbitrary starting curve, attack chạy trong **subexponential** time $L_p(1/2)$ (thay vì polynomial). Cụ thể: cần tìm isogeny từ $E_0$ đến một curve với known endomorphism ring — bài toán endomorphism ring computation.
>
> Robert (2022) có approach khác: dùng dimension-4 và dimension-8 isogenies, cho phép polynomial time với arbitrary starting curve.

Vì SIKE dùng $j = 287496$ (gần với $j = 1728$) với endomorphism ring essentially known, attack gốc đã đủ.

---

## 6. So Sánh Với Attack Trước

| Attack | Target | Complexity | Basis |
|--------|--------|-----------|-------|
| GPST (2016) | Static SIDH | Polynomial | Torsion images |
| Petit (2017) | Unbalanced SIDH | Polynomial | Torsion images |
| Castryck-Decru (2022) | Standard SIDH/SIKE | Polynomial | Kani + torsion images |
| Maino-Martindale (2022) | Arbitrary start | Subexponential | Kani + EndRing |
| Robert (2022) | All variants | Polynomial | Higher-dim isogenies |

Castryck-Decru là bước nhảy vọt vì nó phá được **standard parameters** (balanced $2^a \approx 3^b$) mà mọi attack trước đều thất bại.

---

## 7. Tóm Tắt

- Attack polynomial: $\tilde{O}(\lambda^3)$ heuristic, với $\lambda = \log p$
- Bottleneck: $a \cdot b = O(\log^2 p)$ Richelot steps, mỗi step $O(\log p)$ field ops
- Smooth $N$ cần thiết: cho phép chain Richelot without large-prime bottleneck
- False positive rate: $O(1/p)$ — negligible, không ảnh hưởng correctness
- Concrete: SIKEp434 bị phá trong ~10 phút; tất cả tham số bị phá trong <24 giờ

---

## References

- Castryck, W. & Decru, T. — *An efficient key recovery attack on SIDH* (ePrint 2022/975), Section 7
- Maino, L. & Martindale, C. — *An attack on SIDH with arbitrary starting curve* (ePrint 2022/1026)
- Robert, D. — *Breaking SIDH in polynomial time* (EUROCRYPT 2023)
