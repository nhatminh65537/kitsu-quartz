---
title: "07. PLONK & Multi-point Evaluation"
tags: [crypto, zk, polynomial-commitments, lesson-07]
aliases: [PLONK and Multi-point Evaluation]
created: 2026-03-12
---

> **Prerequisites**: [[03-kzg-commitments|03. KZG Commitments]], [[04-kzg-security-analysis|04. KZG Security Analysis]], vanishing polynomials
> **Objectives**:
> - Hiểu PLONK dùng KZG như thế nào để prove circuit satisfiability
> - Nắm linearization trick và tại sao nó cần thiết
> - Hiểu batch multi-point, multi-polynomial opening
> - Thấy rõ tại sao verifier chỉ cần $O(1)$ pairings dù có nhiều polynomials

---

## Motivation

PLONK (Permutations over Lagrange-bases for Oecumenical Noninteractive Arguments of Knowledge) là một trong những zkSNARK phổ biến nhất. Nó dùng KZG không phải cho một đa thức đơn lẻ, mà cho **nhiều đa thức** (wire polynomials, constraint polynomials, permutation polynomial) cùng một lúc.

Bài này tập trung vào "phần KZG" của PLONK — multi-polynomial, multi-point opening — một trong những điểm phức tạp nhất khi audit.

---

## PLONK Overview

Mạch PLONK được encode bởi các polynomials:

- $a(X), b(X), c(X)$ — **wire polynomials** (left, right, output wire values)
- $q_L(X), q_R(X), q_O(X), q_M(X), q_C(X)$ — **selector polynomials** (cố định theo circuit)
- $z(X)$ — **permutation polynomial** (copy constraints)

**Gate constraint**: Tại mỗi row $i$:

$$q_L(i) \cdot a(i) + q_R(i) \cdot b(i) + q_M(i) \cdot a(i) \cdot b(i) + q_O(i) \cdot c(i) + q_C(i) = 0$$

Tất cả constraints được encode thành: $p(X) / Z_H(X) = t(X)$ là đa thức (không có phần dư).

---

## Linearization Trick

**Vấn đề**: Constraint có dạng $q_M \cdot a \cdot b$ — là **tích của hai đa thức** $a(X) \cdot b(X)$, không phải linear. Verifier không thể kiểm tra bằng một pairing đơn.

**Giải pháp — Linearization**:

Thay vì verify $a(\zeta) \cdot b(\zeta)$ trực tiếp (yêu cầu mở cả $a$ và $b$ tại $\zeta$ rồi nhân), PLONK dùng trick:

1. Prover mở $\overline{a} = a(\zeta)$, $\overline{b} = b(\zeta)$, $\overline{c} = c(\zeta)$ tại điểm $\zeta$ (random từ verifier).
2. Verifier tính **linearized polynomial**:

$$r(X) = q_L(X)\overline{a} + q_R(X)\overline{b} + q_M(X)\overline{a}\overline{b} + q_O(X)\overline{c} + q_C(X)$$

3. Bây giờ $r(X)$ chỉ cần mở tại $\zeta$ (vì $\overline{a}, \overline{b}, \overline{c}$ đã biết), thay vì mở tích đa thức.

> [!definition] Definition 7.1 — Linearized Polynomial
> Sau khi verifier biết $\overline{a} = a(\zeta)$, $\overline{b} = b(\zeta)$, linearized polynomial là đa thức **linear** trong các commitments (không có tích hai biến ẩn), cho phép verify bằng một pairing.

---

## Multi-point Opening — Single Polynomial

Trong PLONK, cùng một đa thức (ví dụ permutation polynomial $z(X)$) cần mở tại **nhiều điểm**: $\zeta$ và $\zeta\omega$ (shift của $\zeta$).

Dùng batch opening (từ bài 03):

$$q(X) = \frac{z(X) - r(X)}{Z_\text{points}(X)}, \quad Z_\text{points}(X) = (X - \zeta)(X - \zeta\omega)$$

Proof: $\pi = [q(\tau)]_1$. Một element cho hai openings.

---

## Multi-polynomial, Multi-point Opening

PLONK thực sự cần mở **nhiều đa thức tại nhiều điểm** đồng thời. Đây là phần phức tạp nhất.

Giả sử có hai tập:

- Tập $S_1 = \{\zeta\}$: mở $a, b, c, q_L, q_R, \ldots$ tại $\zeta$.
- Tập $S_2 = \{\zeta, \zeta\omega\}$: mở $z$ tại cả $\zeta$ và $\zeta\omega$.

### Bước 1 — Nhóm theo opening set

Verifier gửi $v \xleftarrow{\$} \mathbb{F}_p$. Prover tạo:

$$f_1(X) = a(X) + v \cdot b(X) + v^2 \cdot c(X) + v^3 q_L(X) + \cdots$$

(kết hợp tất cả đa thức trong nhóm $S_1$)

$$f_2(X) = z(X)$$

(đa thức trong nhóm $S_2$)

### Bước 2 — Opening proof cho từng nhóm

Proof $\pi_1$: single-point batch opening của $f_1$ tại $\zeta$.

Proof $\pi_2$: multi-point opening của $f_2$ tại $\{\zeta, \zeta\omega\}$.

### Bước 3 — Aggregate hai proofs

Verifier gửi $u \xleftarrow{\$} \mathbb{F}_p$. Kết hợp:

$$W_\zeta = \pi_1 + u \cdot (\text{component of } \pi_2 \text{ at } \zeta)$$

$$W_{\zeta\omega} = (\text{component of } \pi_2 \text{ at } \zeta\omega)$$

**Final check**: verifier chạy 2 pairings trên $(W_\zeta, W_{\zeta\omega})$ — verify toàn bộ.

---

## Verifier Algorithm Tổng hợp

```
Input: [a]_1, [b]_1, [c]_1, [z]_1, [t]_1, a_bar, b_bar, c_bar, z_bar, z_omega_bar, pi_1, pi_2

1. Reconstruct linearized commitment:
   [r]_1 = q_L * a_bar + q_R * b_bar + q_M * a_bar*b_bar + ...
   (verifier uses selector commitments from SRS)

2. Batch opening check tại zeta:
   F_1 = [r]_1 + v*[a]_1 + v^2*[b]_1 + ... - (r_bar + v*a_bar + v^2*b_bar + ...)*G1
   e(F_1 + zeta*pi_1, G2) == e(pi_1, [tau]_2)

3. Opening check cho z tại zeta*omega:
   e([z]_1 - z_omega_bar*G1 + u*(zeta*omega - zeta)*pi_2, G2) == e(u*pi_2, [tau]_2)
```

**Tổng chi phí verifier**: ~4-6 pairings, bất kể số gates trong circuit.

---

## PLONK Bugs Liên Quan đến PCS

> [!danger] Bug 7.2 — Missing Linearization Check
> Nếu verifier không kiểm tra linearized polynomial đúng cách (ví dụ dùng sai giá trị $\overline{a}, \overline{b}$), constraint check bị bypass.
>
> Real-world: một số PLONK implementations tính $r$ từ committed values thay vì verifier-supplied openings — cho phép prover chọn $\overline{a}$ tùy ý.

> [!danger] Bug 7.3 — Predictable Challenge (Gamma, Beta, Zeta)
> Trong Fiat-Shamir, các challenges $\gamma, \beta, \alpha, \zeta$ được derive bằng hash của transcript. Nếu transcript hash bỏ sót một commitment, prover có thể grind challenge — đặc biệt nguy hiểm với permutation argument.
>
> Đây là lỗi đã tìm thấy trong một Plonk verifier contract thực tế.

> [!danger] Bug 7.4 — Missing Pairing Result Check
> Trong một số verifier Solidity, `staticcall` đến precompile pairing không được check return value. Nếu call fail (do out-of-gas hay lỗi input), pairing "return" giá trị mặc định — có thể là `false` được xử lý như `true`.

---

## Tóm tắt

- PLONK encode circuit thành nhiều đa thức; KZG commit tất cả với $O(1)$ proof size.
- **Linearization trick**: convert non-linear constraints thành linear bằng cách mở wire values trước.
- **Multi-polynomial, multi-point opening**: kết hợp challenge $v, u$ để batch tất cả openings vào 2 pairings.
- **Bugs chính**: linearization sai, Fiat-Shamir thiếu transcript, missing pairing result check.

---

## References

- Gabizon, Williamson, Ciobotaru — *PLONK: Permutations over Lagrange-bases...* (ePrint 2019/953)
- Dankrad Feist — *Kate polynomial commitments* (multi-point opening section)
- HackMD — *Vulnerability in ZKP: Missing pairing result check* — https://hackmd.io/@3o3SyLkdRHyclM6GoUbn6g/H1UNISeac
