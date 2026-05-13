---
title: "14. Maino-Martindale & Robert: Generalization to Arbitrary Starting Curves"
type: attack
tags: [crypto, maino-martindale, robert, sidh-generalization, castryck-decru, lesson-14]
aliases: [SIDH Generalizations]
created: 2026-04-08
---

> **Prerequisites**: [[11-castryck-decru-attack|11. Castryck-Decru Attack]], [[13-complexity-analysis|13. Complexity Analysis]]
> **Lesson type**: Attack
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $E_{\text{start}}$ | Arbitrary starting curve (không cần $j = 1728$) |
> | $\phi_{\text{walk}}$ | Random walk isogeny từ $E_0$ (known CM) đến $E_{\text{start}}$ |
> | $\dim k$ | Dimension $k$ của abelian variety dùng trong Robert |

---

## Motivation

Ngay sau khi Castryck-Decru paper ra (tháng 8/2022), hai extensions quan trọng được publish trong cùng tuần: Maino-Martindale và Robert. Cả hai xử lý câu hỏi: điều gì xảy ra nếu SIDH dùng **arbitrary starting curve** thay vì $j = 287496$? Bài này tóm tắt hai approaches và tại sao chúng hoàn thiện việc phá SIDH hoàn toàn.

---

## 1. Vấn Đề Với Arbitrary Starting Curve

Trong attack gốc, Castryck-Decru giả định $\text{End}(E_0)$ known — điều này đúng với $j = 1728$ hoặc $j = 287496$ (SIKE's actual starting curves). Nhưng một potential defense là: chọn $E_{\text{start}}$ ngẫu nhiên sao cho $\text{End}(E_{\text{start}})$ không known.

**Vấn đề**: Nếu không biết $\text{End}(E_{\text{start}})$, không thể compute endomorphism $\gamma$ cần thiết cho attack.

---

## 2. Maino-Martindale Attack (2022)

> [!note] Approach 14.1 — Maino-Martindale
> Maino và Martindale phá SIDH với arbitrary starting curve bằng cách:
>
> 1. **Tìm đường đến curve known**: Compute một walk $\phi_{\text{walk}} : E_0 \to E_{\text{start}}$ trong đó $E_0$ là curve với known CM (ví dụ $j = 1728$).
>
> 2. **Transfer endomorphism**: Dùng $\phi_{\text{walk}}$ để "push forward" endomorphism $\gamma$ của $E_0$ thành một endomorphism của $E_{\text{start}}$.
>
> 3. **Apply Castryck-Decru**: Với endomorphism đã transferred, apply attack gốc.

**Complexity**: Bước 1 — tìm $\phi_{\text{walk}}$ — tương đương với solving endomorphism ring problem, hiện tại là **subexponential** $L_p(1/2 + \epsilon)$. Tức là attack Maino-Martindale chạy trong subexponential time.

> [!info] Hệ Quả
> Ngay cả khi SIDH dùng random starting curve, nó chỉ tăng security từ polynomial lên subexponential — vẫn không đủ để đạt post-quantum security. Với $p \approx 2^{434}$, subexponential $\approx 2^{100}$ vẫn trong tầm tay của adversary với đủ resources.

---

## 3. Robert's Attack — Polynomial Time cho Mọi Case

Robert (EUROCRYPT 2023) tìm ra approach mạnh hơn nhiều: phá SIDH với arbitrary starting curve trong **polynomial time**.

> [!note] Approach 14.2 — Robert (Higher-Dimensional Isogenies)
> Robert không cần biết $\text{End}(E_{\text{start}})$. Thay vào đó:
>
> 1. Tăng dimension: Dùng isogenies giữa **abelian varieties dimension 4** (thay vì dimension 2 như Castryck-Decru).
>
> 2. **Dimension-4 Kani**: Tương tự Kani's theorem nhưng trong dimension 4, cho phép xây dựng "glue" từ $E_{\text{start}}^4$ mà không cần known endomorphism.
>
> 3. **Oracle** vẫn là split test, nhưng bây giờ trong dimension 4.

**Complexity**: Polynomial trong $\log p$ — tương tự Castryck-Decru nhưng với constants lớn hơn (do dimension 4 isogenies phức tạp hơn).

> [!abstract] Theorem 14.3 — Robert (2022)
> SIDH với bất kỳ starting curve nào có thể bị phá trong thời gian **polynomial** $\text{poly}(\log p)$, kể cả khi $\text{End}(E_{\text{start}})$ hoàn toàn không known.

---

## 4. Dimension-4 vs Dimension-2

Tại sao dimension 4 giúp?

Trong Castryck-Decru (dimension 2): cần endomorphism $\gamma \in \text{End}(E_0)$ để xây dựng "glue kernel" $\{(x, -\gamma(x))\}$. Đây là map từ một elliptic curve sang chính nó.

Trong Robert (dimension 4): thay vì một endomorphism, ta dùng **isogeny** $\phi_{\text{known}} : E_0 \to E_{\text{start}}$ có degree đã biết (mà không cần $E_0$ và $E_{\text{start}}$ có cùng known endomorphism). Kernel được xây dựng từ composition của nhiều isogenies.

Điều này hoạt động vì:
- Dimension 4 isogenies có nhiều degrees of freedom hơn
- Weil pairing conditions (Kani analog) vẫn kiểm tra được
- Split test vẫn là $O(1)$ per step

---

## 5. Tóm Tắt Cuộc Tấn Công Hoàn Chỉnh

Sau ba paper (Castryck-Decru, Maino-Martindale, Robert), SIDH bị phá hoàn toàn:

| Variant SIDH | Status | Attack |
|-------------|--------|--------|
| Standard SIDH (j = 1728 or known) | **Broken** (polynomial) | Castryck-Decru |
| Arbitrary starting curve | **Broken** (polynomial) | Robert |
| B-SIDH (prime other than 2, 3) | **Broken** (polynomial) | Castryck-Decru (generalized) |
| Masked torsion images | Partially resists | M-SIDH (weakened) |

> [!danger] SIDH Is Broken — No Known Fix
> NIST confirmed: "SIKE and SIDH are insecure and should not be used." (August 2022)
>
> Cả Moriya (2022) và Fouotsa (2022) đề xuất modifications, nhưng mọi variant đã biết đều degraded performance và key size ít nhất 10x trong khi vẫn có unknown security. Consensus: không có SIDH variant nào an toàn và practical.

---

## 6. Lessons Learned Cho Protocol Design

> [!tip] Bài Học Từ SIDH
> 1. **Torsion images = dangerous**: Bất kỳ protocol nào reveal "auxiliary torsion points" đều có rủi ro tương tự
> 2. **Known degree = risky**: Việc degree của secret isogeny là public information là một weakness fundamental
> 3. **Dimension matters**: Attacker có thể work trong higher dimensions để bypass dimension-1 defenses
> 4. **Mathematical maturity**: Isogeny-based crypto cần nhiều thời gian hơn để mature (không như lattice-based đã có ~20 năm community analysis)

---

## References

- Maino, L. & Martindale, C. — *An attack on SIDH with arbitrary starting curve* (ePrint 2022/1026)
- Robert, D. — *Breaking SIDH in polynomial time* (EUROCRYPT 2023, ePrint 2022/1038)
- NIST — *SIKE and SIDH are insecure and should not be used* (sike.org foreword)
- Fouotsa, T.B. & Moriya, T. — *M-SIDH and MD-SIDH: Countering SIDH Attacks by Masking Information* (EUROCRYPT 2023)
