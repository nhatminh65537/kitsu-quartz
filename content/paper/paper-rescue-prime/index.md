---
title: "Rescue-Prime"
tags: [rescue-prime, index]
source: "Rescue-Prime: a Standard Specification (SoK) — Szepieniec, Ashur, Dhooghe, 2020. https://eprint.iacr.org/2020/1143"
created: 2026-03-15
---

Course distill từ paper 2020/1143 — standard specification cho Rescue-Prime, arithmetization-oriented hash function dùng trong SNARK/STARK/MPC.

**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Lesson Summaries

| # | File | Tóm tắt |
|---|------|---------|
| 01 | [[01-arithmetization-oriented-hash\|01. AO Hash & Sponge]] | Giải thích tại sao cần hash function tối ưu cho arithmetization; định nghĩa sponge construction (rate, capacity, absorb/squeeze); generic security $\lfloor \log_2(\sqrt{p} \cdot \min(n, c_p)) \rfloor$ bits; vị trí Rescue-Prime trong bức tranh tổng thể. |
| 02 | [[02-rescue-xlix-permutation\|02. Rescue-XLIX Permutation]] | Đặc tả đầy đủ permutation $f_{\text{RXLIX}} : \mathbb{F}_p^m \to \mathbb{F}_p^m$; cấu trúc round (S-box thuận → MDS → constants → Inv S-box → MDS → constants); sinh MDS matrix (Vandermonde), round constants (SHAKE-256), tính $\alpha/\alpha^{-1}$, chọn số rounds $N$ từ Gröbner basis bound. |
| 03 | [[03-rescue-prime-hash-function\|03. Rescue-Prime Hash Function]] | Đặc tả đầy đủ $f_{\text{R}0}$ = sponge + $f_{\text{RXLIX}}$: khởi tạo state $\mathbf{0}$, absorb từng khối $r_p$ elements, squeeze output; padding rule $1\|0^*$ đảm bảo injectivity; truncation về $n \leq r_p$ elements; generic security $\lfloor \log_2(\sqrt{p} \cdot \min(n, c_p)) \rfloor$ bits. |
| 04 | [[04-design-rationale-rescue-xlix\|04. Design Rationale]] | Giải thích 3 thay đổi Rescue-XLIX so với Rescue gốc [AABS+19]: (1) lật thứ tự S-box để "folding" hoạt động toàn phần, (2) sinh round constants trực tiếp từ SHAKE-256 (nothing-up-my-sleeve + standardization), (3) giảm security margin từ 100% xuống 50% dựa trên 1+ năm cryptanalysis không tìm ra weakness. |
| 05 | [[05-deviations-and-variants\|05. Deviations & Variants]] | Đặc tả 5 deviations: (4.1) small-field/high-security — thêm differential bound $\ell_0$ (Alg. 8); (4.2) alternate MDS — bất kỳ MDS matrix nào; (4.3) omit padding — khi input length cố định; (4.4) algebraic round constants — hai phương án sinh từ seed nhỏ; (4.5) DEC functions — extended squeezing (Alg. 10) và DEC wrapper (Alg. 9) cho output tùy ý. |

---

## Global Notation Table

| Ký hiệu | Ý nghĩa | Định nghĩa trong |
|---------|---------|-----------------|
| $\mathbb{F}_p$ | Trường hữu hạn nguyên tố bậc $p$ | 01 |
| $p$ | Số nguyên tố — xác định trường, $\|p\| \geq 32$ bits | 01, 02 |
| $m$ | State width (số field elements) | 01, 02 |
| $c_p$ | Capacity của sponge | 01, 02 |
| $r_p = m - c_p$ | Rate của sponge | 01, 02 |
| $s$ | Target security level (bits), $80 \leq s \leq 512$ | 02 |
| $\alpha$ | S-box exponent (thuận): nhỏ nhất coprime với $p-1$ | 02 |
| $\alpha^{-1}$ | Inverse S-box exponent: $\alpha^{-1} \pmod{p-1}$ | 02 |
| $M \in \mathbb{F}_p^{m \times m}$ | MDS matrix (Vandermonde-derived) | 02 |
| $N$ | Số rounds của Rescue-XLIX | 02 |
| $\{C_i\}_{i=0}^{2mN-1}$ | Round constants (SHAKE-256 derived) | 02 |
| $f_{\text{RXLIX}}$ | Rescue-XLIX permutation: $\mathbb{F}_p^m \to \mathbb{F}_p^m$ | 02 |
| $f_{\text{R}0}$ | Rescue-Prime hash function: $\mathbb{F}_p^* \to \mathbb{F}_p^{r_p}$ | 03 |
| $\mathbf{s} \in \mathbb{F}_p^m$ | State vector của sponge, khởi tạo $\mathbf{0}$ | 03 |
| $n \leq r_p$ | Số output elements sau truncation | 03 |
| Rescue | Permutation gốc từ [AABS+19]: $\alpha^{-1}$ trước, $\alpha$ sau | 04 |
| $\ell_0$ | Round count lower bound từ differential attack (small-field) | 05 |
| $\ell_1$ | Round count lower bound từ Gröbner basis attack | 02, 05 |
| DEC | Doubly-Extendable Cryptographic function — output length tùy ý | 05 |
| $f_{\text{R}0\text{-sponge}}$ | Rescue-Prime sponge với extended squeezing (Alg. 10) | 05 |
