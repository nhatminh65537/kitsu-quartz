---
title: "A0. Notation Reference"
tags: [zk, arithmetic-circuits, notation, reference, appendix]
aliases: [Notation Reference, Symbol Table]
created: 2026-03-12
---

> **Tham khảo nhanh** — Tổng hợp toàn bộ ký hiệu, định nghĩa, và quy ước dùng trong series này.

---

## 1. Trường hữu hạn (Finite Field)

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $\mathbb{F}_p$ | Trường hữu hạn với $p$ phần tử ($p$ nguyên tố) |
| $p$ | Đặc số trường (field characteristic); số nguyên tố lớn |
| $\mathbb{F}_p^*$ | Nhóm nhân của $\mathbb{F}_p$ — tất cả phần tử khác 0 |
| $a^{-1} \bmod p$ | Nghịch đảo nhân của $a$, tính bằng $a^{p-2} \bmod p$ |
| $\mathbb{F}_{p^k}$ | Extension field bậc $k$ trên $\mathbb{F}_p$ |
| $\omega$ | Primitive $n$-th root of unity: $\omega^n = 1$, $\omega^i \neq 1$ với $0 < i < n$ |
| $H$ | Evaluation domain: $H = \{1, \omega, \omega^2, \ldots, \omega^{m-1}\}$ hoặc $\{1, 2, \ldots, m\}$ |

**Các trường ZK thực tế hay gặp:**

| Tên | Đặc số $p$ | Dùng trong |
|-----|-----------|-----------|
| BN254 | $2^{254} + \ldots$ (254-bit) | Groth16 trên Ethereum |
| BLS12-381 | $2^{381} - \ldots$ (381-bit) | Zcash, Ethereum PoS |
| Goldilocks | $2^{64} - 2^{32} + 1$ | Plonky2, Polygon |
| Baby Bear | $2^{31} - 2^{27} + 1$ | Plonky3, RISC Zero |

---

## 2. Đa thức (Polynomials)

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $\mathbb{F}_p[x]$ | Vành đa thức hệ số trong $\mathbb{F}_p$ |
| $\deg(f)$ | Bậc của đa thức $f$ |
| $f(a)$ | Giá trị của $f$ tại $x = a$ |
| $Z_H(x)$ | Vanishing polynomial trên $H$: $Z_H(x) = \prod_{r \in H}(x - r)$ |
| $t(x)$ | Target polynomial trong QAP: $t(x) = \prod_{i=1}^{m}(x - r_i)$ |
| $h(x)$ | Quotient polynomial: $h(x) = p(x) / t(x)$ (khi chia hết) |
| $L_i(x)$ | Lagrange basis polynomial: $L_i(r_j) = \delta_{ij}$ |
| $a \mid b$ | $a$ chia hết $b$: tồn tại $q$ sao cho $b = a \cdot q$ |

---

## 3. Circuit

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $C$ | Arithmetic circuit (DAG) |
| $\text{size}(C)$ | Số gates trong circuit |
| $\text{depth}(C)$ | Chiều sâu của circuit (đường dài nhất từ input đến output) |
| $\text{fan-in}(g)$ | Số wires vào gate $g$ |
| $\text{fan-out}(w)$ | Số gates dùng wire $w$ làm input |
| $+, \times$ | Addition gate và multiplication gate |
| $x_1, \ldots, x_\ell$ | Public input signals |
| $w_1, \ldots, w_k$ | Private input signals (witness) |
| $t_1, t_2, \ldots$ | Intermediate signals |
| $\text{out}$ | Output signal |

---

## 4. Witness và R1CS

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $\vec{z}$ | Witness vector: $\vec{z} = (1, x_1, \ldots, x_\ell, w_1, \ldots, w_k)$ |
| $n$ | Kích thước witness: $n = 1 + \ell + k$ |
| $m$ | Số constraints (= số multiplication gates) |
| $A, B, C$ | Ba ma trận R1CS, kích thước $m \times n$ |
| $A_i$ | Hàng thứ $i$ của ma trận $A$ |
| $A_{i,j}$ | Phần tử hàng $i$, cột $j$ của $A$ |
| $\langle \vec{u}, \vec{v} \rangle$ | Inner product: $\sum_j u_j v_j$ |
| $\vec{u} \circ \vec{v}$ | Hadamard product: $(u_1 v_1, u_2 v_2, \ldots)$ |
| R1CS | Rank-1 Constraint System: $A\vec{z} \circ B\vec{z} = C\vec{z}$ |

---

## 5. QAP

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $\mathcal{Q}$ | Quadratic Arithmetic Program |
| $u_j(x), v_j(x), w_j(x)$ | Selector polynomials: $u_j(r_i) = A_{i,j}$ |
| $U(x)$ | Combined polynomial: $U(x) = \sum_j z_j \cdot u_j(x)$ |
| $V(x), W(x)$ | Tương tự $U$ cho $B$ và $C$ |
| $p(x)$ | $p(x) = U(x) \cdot V(x) - W(x)$ |
| $\tau$ | Điểm ngẫu nhiên bí mật trong trusted setup |
| SRS | Structured Reference String: $\{[\tau^i]_1\}$ |

---

## 6. Proof System

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $\pi$ | ZK proof |
| $\lambda$ | Security parameter |
| $\text{negl}(\lambda)$ | Negligible function của $\lambda$ |
| $\mathcal{P}$ | Prover |
| $\mathcal{V}$ | Verifier |
| $\mathcal{E}$ | Extractor (trong knowledge soundness) |
| $[a]_1$ | Group element $a \cdot G_1$ trong pairing group $\mathbb{G}_1$ |
| $e([a]_1, [b]_2)$ | Pairing: $\mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$ |

---

## 7. Quy ước trong Code

| Quy ước | Ý nghĩa |
|---------|---------|
| `p` | Đặc số trường (thường = 13 trong ví dụ) |
| `z` | Witness vector dạng list Python |
| `z[0]` | Luôn bằng 1 (constant term) |
| `A, B, C` | Ma trận dạng list of lists |
| `% p` | Phép tính modular |
| `pow(a, p-2, p)` | Tính $a^{-1} \bmod p$ bằng Fermat's little theorem |

---

## 8. Thuật ngữ Đối chiếu Việt — Anh

| Tiếng Việt | Tiếng Anh |
|-----------|-----------|
| Trường hữu hạn | Finite field |
| Đa thức | Polynomial |
| Hệ số | Coefficient |
| Bậc | Degree |
| Nghiệm | Root / zero |
| Nội suy | Interpolation |
| Đa thức triệt tiêu | Vanishing polynomial |
| Mạch số học | Arithmetic circuit |
| Cổng | Gate |
| Dây | Wire |
| Chứng nhân | Witness |
| Hệ ràng buộc | Constraint system |
| Ràng buộc | Constraint |
| Thoả mãn | Satisfied / satisfying |
| Thiếu ràng buộc | Under-constrained |
| Thừa ràng buộc | Over-constrained |
| Soundness | Soundness (tính vững) |
| Completeness | Completeness (tính đầy đủ) |
| Bằng chứng không tiết lộ | Zero-knowledge proof |
| Người chứng minh | Prover |
| Người xác minh | Verifier |
