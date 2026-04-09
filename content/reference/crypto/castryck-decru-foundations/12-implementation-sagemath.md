---
title: "12. Castryck-Decru Attack — SageMath Implementation"
type: deep-dive
tags: [crypto, isogeny, implementation, sagemath, lesson-12]
aliases: [SageMath Implementation]
created: 2026-04-09
---

> **Prerequisites**: [[11-castryck-decru-attack|11. Castryck-Decru Attack — Mechanism]]
> **Lesson type**: Deep Dive
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $p_{64}$ | Baby prime $p = 2^{33} \cdot 3^{19} - 1$ |
> | `richelot_aux.sage` | Module chứa glue/split computations |
> | `splitting_field` | SageMath field $\mathbb{F}_{p^2}$ |
> | `E0` | Starting curve object trong SageMath |
> | `phiA` | Alice's secret isogeny object |
> | `kernel_point` | Generator của kernel cho $(2,2)$-step |

---

## Mục Tiêu Lesson Này

Lesson này đi qua implementation của Castryck-Decru attack trong SageMath, sử dụng codebase của GiacomoPope (eprint 2022/1283). Ta dùng baby parameters SIKEp64 ($p = 2^{33} \cdot 3^{19} - 1$) để attack chạy trong vài giây. Sau khi hiểu baby case, scale up sang SIKEp434 chỉ là thay đổi parameters.

---

## Codebase Structure

Repository `Castryck-Decru-SageMath` (github.com/GiacomoPope) có structure:

```text
baby_SIDH.sage          ← Entry point cho baby parameters
SIDH_parameters.py      ← SIKE parameters (p434, p503, p610, p751)
castryck_decru_attack.sage ← Main attack logic
richelot_aux.sage       ← (2,2)-isogeny computations (glue/split)
```

---

## Parameters: SIKEp64 (Baby)

```sage
p = 2^33 * 3^19 - 1
Fp2.<i> = GF(p^2, modulus=x^2+1)
E0 = EllipticCurve(Fp2, [0, 6, 0, 1, 0])
```

Kiểm tra đây là supersingular:

```sage
assert E0.is_supersingular()
print("j-invariant:", E0.j_invariant())
```

Torsion bases:

```sage
eA, eB = 33, 19
lA, lB = 2, 3
PA, QA = E0.torsion_basis(lA^eA)
PB, QB = E0.torsion_basis(lB^eB)
```

---

## Tạo SIDH Key Pair (Simulated)

```sage
import random

def sidh_keygen_bob(E0, PB, QB, lB, eB):
    sk_B = random.randint(0, lB^eB - 1)
    kernel_B = PB + sk_B * QB
    phiB = E0.isogeny(kernel_B, algorithm='factored')
    EB = phiB.codomain()
    phiB_PA = phiB(PA)
    phiB_QA = phiB(QA)
    return sk_B, EB, phiB_PA, phiB_QA

sk_B, EB, phiB_PA, phiB_QA = sidh_keygen_bob(E0, PB, QB, lB, eB)
```

Alice's public key dùng trong attack:

```sage
def sidh_keygen_alice(E0, PA, QA, lA, eA):
    sk_A = random.randint(0, lA^eA - 1)
    kernel_A = PA + sk_A * QA
    phiA = E0.isogeny(kernel_A, algorithm='factored')
    EA = phiA.codomain()
    phiA_PB = phiA(PB)
    phiA_QB = phiA(QB)
    return sk_A, EA, phiA_PB, phiA_QB

sk_A, EA, phiA_PB, phiA_QB = sidh_keygen_alice(E0, PA, QA, lA, eA)
```

---

## Bước 0: Compute $\gamma$

```sage
def two_square_decomp(n):
    for u in range(isqrt(n) + 1):
        v2 = n - u^2
        if v2 >= 0 and is_square(v2):
            return u, isqrt(v2)
    raise ValueError("No decomposition found")

c = lB^eB
u, v = two_square_decomp(c)
assert u^2 + v^2 == c
```

Xây dựng $\gamma = [u] + [v] \cdot \iota$ (dùng $\iota$ là 2-isogeny có sẵn từ $E_0$'s structure):

```sage
def compute_gamma_on_point(P, u, v, iota_map):
    return u*P + v*iota_map(P)

gamma_PB = compute_gamma_on_point(PB, u, v, iota)
gamma_QB = compute_gamma_on_point(QB, u, v, iota)
```

---

## Core: (2,2)-Isogeny Step

Đây là bước phức tạp nhất, sử dụng `richelot_aux.sage`. Ý tưởng:

```sage
from richelot_aux import Does22ChainSplit, Glue_and_split

def one_step(domain_surface, T1, T2, T3, T4):
    ok, E1_new, E2_new = Does22ChainSplit(domain_surface, T1, T2, T3, T4)
    return ok, E1_new, E2_new
```

Trong `Does22ChainSplit`, logic là:
1. Nhận domain surface $A$ (có thể là $E_1 \times E_2$ hoặc $\text{Jac}(C)$).
2. Nhận 4 điểm $T_1, T_2, T_3, T_4$ sinh ra kernel $K$.
3. Tính $(2,2)$-isogeny $\Phi: A \to A'$ với $\ker \Phi = K$.
4. Kiểm tra $A'$ split và trả về `(True, E1', E2')` hoặc `(False, None, None)`.

---

## Main Attack Loop

```sage
def castryck_decru_attack(EA, phiA_PB, phiA_QB, gamma_PB, gamma_QB, eB):
    recovered_digits = []

    T1 = (phiA_PB, gamma_PB)
    T2 = (phiA_QB, gamma_QB)

    current_surface = (EA, E0)
    current_T1 = T1
    current_T2 = T2

    for i in range(eB):
        found = False
        for b in range(3):
            kernel_T1 = lB^(eB - 1 - i) * current_T1
            kernel_T2 = lB^(eB - 1 - i) * current_T2

            ok, new_surface, new_T1, new_T2 = try_digit(
                current_surface, kernel_T1, kernel_T2, b
            )

            if ok:
                recovered_digits.append(b)
                current_surface = new_surface
                current_T1 = new_T1
                current_T2 = new_T2
                found = True
                break

        if not found:
            raise RuntimeError(f"No valid digit found at step {i}")

    sk_B_recovered = sum(recovered_digits[i] * 3^i for i in range(eB))
    return sk_B_recovered
```

---

## Split Test trong richelot_aux.sage

`Does22ChainSplit` implement split test qua theta constants:

```sage
def Does22ChainSplit(A, T1, T2, T3, T4):
    thetas = compute_theta_constants(A, T1, T2, T3, T4)
    if thetas[0] == 0 or thetas[1] == 0:
        E1, E2 = recover_elliptic_curves(thetas)
        return True, E1, E2
    return False, None, None
```

Theta constant bằng 0: dấu hiệu split. Formulas theta dựa trên Cosset-Robert (Appendix A0).

---

## Chạy Attack Và Verify

```sage
sk_B_recovered = castryck_decru_attack(
    EA, phiA_PB, phiA_QB, gamma_PB, gamma_QB, eB
)

print("Original sk_B:", sk_B)
print("Recovered sk_B:", sk_B_recovered)
assert sk_B == sk_B_recovered, "Attack failed!"
print("Attack successful!")
```

Với SIKEp64: runtime < 10 giây. Với SIKEp434: runtime ~10 phút.

---

## Scale Up: SIKEp434

```sage
from SIDH_parameters import sike_params

params = sike_params['p434']
p = params['p']
eA = params['eA']
eB = params['eB']
Fp2 = GF(p^2, modulus=params['modulus'])
E0 = EllipticCurve(Fp2, params['curve_coeffs'])
```

Thay đổi duy nhất: parameters. Toàn bộ attack logic giữ nguyên.

---

## Điểm Khác Biệt với Original Magma Code

Original Castryck-Decru code dùng Magma. SageMath port của Pope-Oudompheng có một số khác biệt:

**Faster split detection**: Thay vì recover toàn bộ $e_B$ digits, version cải tiến recover $\beta_1$ digits đầu (ternary), sau đó tính thẳng secret isogeny từ kết quả — nhanh hơn đáng kể.

**isogeny API**: SageMath 9.5+ có `E.isogeny(kernel, algorithm='factored')` cho chain isogenies dài, nhanh hơn naive construction.

**Performance**: Original: SIKEp434 trong ~1 giờ. Optimized SageMath: < 10 phút.

---

## Debugging và Testing

Test với toy example trước khi chạy full:

```sage
p_toy = 2^5 * 3^3 - 1
assert p_toy == 863
Fp2_toy.<i> = GF(p_toy^2, modulus=x^2+1)
E0_toy = EllipticCurve(Fp2_toy, [0, 6, 0, 1, 0])
```

Kiểm tra từng bước riêng lẻ (glue, split, theta constants) trước khi chạy full attack loop.

---

## Summary

- SageMath implementation: `baby_SIDH.sage` với SIKEp64 chạy < 10 giây.
- Core modules: `richelot_aux.sage` (glue/split via theta), `castryck_decru_attack.sage` (digit recovery loop).
- $(2,2)$-step: build kernel từ torsion images + guess → compute isogeny → split test.
- Split detection: theta constants bằng 0.
- Scale: thay parameters → attack tương tự với SIKEp434/p503/p610/p751.
- Codebase: github.com/GiacomoPope/Castryck-Decru-SageMath

---

## References

- Pope, G. & Oudompheng, R. — ePrint 2022/1283 (implementation notes, SageMath lessons learned)
- Oudompheng, R. — *A note on implementing direct isogeny determination in the Castryck-Decru SIKE attack* (2022)
- SageMath Documentation — `EllipticCurve.isogeny`, `HyperellipticCurve`, torsion basis
- github.com/GiacomoPope/Castryck-Decru-SageMath
