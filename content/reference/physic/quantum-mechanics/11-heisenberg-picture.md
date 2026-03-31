---
title: "11. Heisenberg Picture and Matrix Mechanics"
tags: [physics, quantum-mechanics, lesson-11]
aliases: [Heisenberg picture và cơ học ma trận]
created: 2026-03-28
---

> **Prerequisites**: [[10-dirac-hilbert|10. Ký hiệu Dirac & không gian Hilbert]] — bra-ket, toán tử, completeness; [[03-schrodinger-equation|03. Phương trình Schrödinger]] — TDSE, tiến hóa thời gian.
> **Objectives**:
> - Phân biệt hai "picture" (hình ảnh) của QM: Schrödinger picture và Heisenberg picture
> - Hiểu toán tử tiến hóa thời gian $\hat{U}(t)$ và tính chất unitary của nó
> - Xây dựng phương trình Heisenberg (Heisenberg equation of motion)
> - Tính toán với Heisenberg picture cho QHO: tìm $\hat{x}(t)$, $\hat{p}(t)$
> - Hiểu interaction picture (Dirac picture) như trường hợp trung gian

---

## Motivation

Trong tất cả các bài trước, ta làm việc theo **Schrödinger picture**: trạng thái $\ket{\psi(t)}$ phụ thuộc thời gian, còn toán tử $\hat{Q}$ cố định. Đây là cách trực quan nhất.

Nhưng có một cách khác hoàn toàn tương đương: **Heisenberg picture** — trạng thái đứng yên, còn toán tử thay đổi theo thời gian. Werner Heisenberg đã xây dựng QM theo cách này từ năm 1925 — trước cả Schrödinger! Khi Schrödinger xuất bản sóng cơ học năm 1926, ban đầu hai cách tiếp cận có vẻ hoàn toàn khác nhau, và Schrödinger đã chứng minh chúng tương đương.

Heisenberg picture đặc biệt mạnh khi làm việc với lý thuyết trường lượng tử (QFT) và khi muốn thấy rõ kết nối với cơ học cổ điển qua **nguyên lý tương ứng** (correspondence principle).

---

## Physical Model

### Toán tử tiến hóa thời gian

Trong Schrödinger picture, TDSE là $i\hbar\,\partial_t\ket{\psi} = \hat{H}\ket{\psi}$. Với $\hat{H}$ không phụ thuộc thời gian, nghiệm hình thức là:

> [!definition] Definition 11.1 — Toán tử tiến hóa thời gian (Time Evolution Operator)
>
> $$\ket{\psi(t)} = \hat{U}(t)\ket{\psi(0)}, \qquad \hat{U}(t) = e^{-i\hat{H}t/\hbar}$$
>
> Với $e^{-i\hat{H}t/\hbar}$ định nghĩa qua khai triển chuỗi: $e^{-i\hat{H}t/\hbar} = \sum_{n=0}^\infty \frac{(-i\hat{H}t/\hbar)^n}{n!}$.
>
> Tính chất: $\hat{U}$ là **unitary** — $\hat{U}^\dagger\hat{U} = \hat{I}$, bảo toàn inner product (bảo toàn xác suất).

**Tác dụng lên eigenstate:** Nếu $\hat{H}\ket{E_n} = E_n\ket{E_n}$:

$$\hat{U}(t)\ket{E_n} = e^{-iE_nt/\hbar}\ket{E_n}$$

Nhất quán với kết quả Lesson 03: trạng thái dừng chỉ nhân thêm phase phụ thuộc thời gian.

---

## Mathematical Formalism

### Hai "Picture" của QM

Giá trị kỳ vọng là đại lượng vật lý — phải giống nhau trong mọi picture:

$$\langle\hat{Q}\rangle = \bra{\psi(t)}\hat{Q}_S\ket{\psi(t)} = \bra{\psi(0)}\hat{U}^\dagger\hat{Q}_S\hat{U}\ket{\psi(0)}$$

Định nghĩa **toán tử Heisenberg**:

> [!definition] Definition 11.2 — Heisenberg Picture
>
> $$\hat{Q}_H(t) = \hat{U}^\dagger(t)\,\hat{Q}_S\,\hat{U}(t) = e^{i\hat{H}t/\hbar}\hat{Q}_S\,e^{-i\hat{H}t/\hbar}$$
>
> Trong Heisenberg picture:
> - **Trạng thái**: $\ket{\psi_H} = \ket{\psi(0)}$ — **không đổi theo thời gian**
> - **Toán tử**: $\hat{Q}_H(t)$ — **phụ thuộc thời gian**

So sánh hai picture:

| | Schrödinger | Heisenberg |
|---|---|---|
| Trạng thái | $\ket{\psi(t)} = \hat{U}\ket{\psi(0)}$ | $\ket{\psi_H} = \ket{\psi(0)}$ (cố định) |
| Toán tử | $\hat{Q}_S$ (cố định) | $\hat{Q}_H(t) = \hat{U}^\dagger\hat{Q}_S\hat{U}$ |
| Kỳ vọng | $\bra{\psi(t)}\hat{Q}_S\ket{\psi(t)}$ | $\bra{\psi_H}\hat{Q}_H(t)\ket{\psi_H}$ |
| Phương trình | TDSE cho $\ket{\psi}$ | Heisenberg eq. cho $\hat{Q}_H(t)$ |

### Phương trình Heisenberg (Heisenberg Equation of Motion)

> [!theorem] Theorem 11.3 — Phương trình Heisenberg
> Với toán tử $\hat{Q}$ không phụ thuộc tường minh vào $t$ (trong Schrödinger picture):
>
> $$\frac{d\hat{Q}_H}{dt} = \frac{i}{\hbar}[\hat{H}_H, \hat{Q}_H]$$
>
> Nếu $\hat{Q}$ phụ thuộc tường minh vào $t$: thêm số hạng $\partial\hat{Q}_S/\partial t$.

**Chứng minh.** Tính $\frac{d}{dt}(e^{i\hat{H}t/\hbar}\hat{Q}_S e^{-i\hat{H}t/\hbar})$:

$$\frac{d\hat{Q}_H}{dt} = \frac{i}{\hbar}\hat{H}e^{i\hat{H}t/\hbar}\hat{Q}_S e^{-i\hat{H}t/\hbar} - e^{i\hat{H}t/\hbar}\hat{Q}_S e^{-i\hat{H}t/\hbar}\frac{i}{\hbar}\hat{H} = \frac{i}{\hbar}[\hat{H}, \hat{Q}_H] \quad\blacksquare$$

**So sánh với cơ học Hamilton cổ điển:** Trong cơ học Hamilton, phương trình chuyển động:

$$\frac{dQ}{dt} = \{Q, H\}_\text{Poisson} = \frac{\partial Q}{\partial x}\frac{\partial H}{\partial p} - \frac{\partial Q}{\partial p}\frac{\partial H}{\partial x}$$

Nguyên tắc lượng tử hóa chuẩn: $\{\cdot,\cdot\}_\text{Poisson} \to \frac{1}{i\hbar}[\cdot,\cdot]$. Phương trình Heisenberg là **đối ứng lượng tử** trực tiếp của phương trình Hamilton cổ điển.

---

## Derivation

### QHO trong Heisenberg Picture

Đây là ứng dụng đẹp nhất — cho thấy dao động điều hòa lượng tử "hoạt động" đúng như cổ điển ở mức toán tử.

Hamiltonian: $\hat{H} = \hbar\omega(\hat{a}_+\hat{a}_- + 1/2)$.

**Phương trình cho $\hat{a}_-$:**

$$\frac{d\hat{a}_-}{dt} = \frac{i}{\hbar}[\hat{H},\hat{a}_-] = \frac{i}{\hbar}\hbar\omega[\hat{a}_+\hat{a}_-,\hat{a}_-] = i\omega(\hat{a}_+\hat{a}_-\hat{a}_- - \hat{a}_-\hat{a}_+\hat{a}_-)$$

Dùng $[\hat{a}_-,\hat{a}_+] = 1$ → $\hat{a}_+\hat{a}_- = \hat{a}_-\hat{a}_+ - 1$:

$$= i\omega\hat{a}_-(\hat{a}_+\hat{a}_- - \hat{a}_-\hat{a}_+) = i\omega\hat{a}_-\cdot(-1) = -i\omega\hat{a}_-$$

ODE tuyến tính đơn giản: $\dot{\hat{a}}_- = -i\omega\hat{a}_-$ → $\hat{a}_-(t) = e^{-i\omega t}\hat{a}_-(0)$.

Tương tự: $\hat{a}_+(t) = e^{+i\omega t}\hat{a}_+(0)$.

**Toán tử $\hat{x}(t)$ và $\hat{p}(t)$:** Dùng $\hat{x} = \sqrt{\hbar/2m\omega}(\hat{a}_+ + \hat{a}_-)$:

> [!definition] Definition 11.4 — Toán tử vị trí và động lượng trong Heisenberg picture (QHO)
>
> $$\hat{x}(t) = \hat{x}(0)\cos(\omega t) + \frac{\hat{p}(0)}{m\omega}\sin(\omega t)$$
>
> $$\hat{p}(t) = \hat{p}(0)\cos(\omega t) - m\omega\hat{x}(0)\sin(\omega t)$$

**Đây chính xác là nghiệm của dao động điều hòa cổ điển** — nhưng $\hat{x}$ và $\hat{p}$ bây giờ là **toán tử**, không phải số. Tính "lượng tử" nằm ở chỗ $[\hat{x}(t), \hat{p}(t)] = i\hbar$ được bảo toàn tại mọi thời điểm.

### Constants of Motion (Tích phân chuyển động)

> [!theorem] Theorem 11.5 — Constants of Motion
> Đại lượng $\hat{Q}$ bảo toàn theo thời gian (constant of motion) khi và chỉ khi:
>
> $$[\hat{H}, \hat{Q}] = 0$$

Ví dụ trong QHO: $[\hat{H}, \hat{N}] = 0$ với $\hat{N} = \hat{a}_+\hat{a}_-$ (number operator) → số lượng tử $n$ bảo toàn.

Trong nguyên tử Hydrogen: $[\hat{H}, \hat{L}^2] = 0$ và $[\hat{H}, \hat{L}_z] = 0$ → $l$ và $m$ bảo toàn.

**Đây là nguồn gốc sâu xa của các "số lượng tử bảo toàn"**: chúng tương ứng với symmetry của Hamiltonian qua định lý Noether lượng tử.

---

### Interaction Picture (Dirac Picture)

Với hệ có $\hat{H} = \hat{H}_0 + \hat{V}(t)$ ($\hat{H}_0$ giải được, $\hat{V}$ nhiễu loạn nhỏ):

> [!definition] Definition 11.6 — Interaction Picture
>
> $$\ket{\psi_I(t)} = e^{i\hat{H}_0 t/\hbar}\ket{\psi_S(t)}, \qquad \hat{Q}_I(t) = e^{i\hat{H}_0 t/\hbar}\hat{Q}_S\,e^{-i\hat{H}_0 t/\hbar}$$
>
> Phương trình chuyển động trong interaction picture:
>
> $$i\hbar\frac{d\ket{\psi_I}}{dt} = \hat{V}_I(t)\ket{\psi_I}$$

Interaction picture kết hợp ưu điểm của cả hai: trạng thái tiến hóa **chỉ do nhiễu loạn** $\hat{V}$, còn "phần tự do" đã được hấp thụ vào toán tử. Đây là điểm xuất phát tự nhiên cho lý thuyết nhiễu loạn phụ thuộc thời gian (Lesson 14).

---

## Worked Problem

> [!example] Bài toán 11.1 — Kiểm tra commutation relation bảo toàn
>
> Chứng minh $[\hat{x}_H(t), \hat{p}_H(t)] = i\hbar$ với mọi $t$ trong QHO.

**Lời giải:**

Thay biểu thức từ Definition 11.4:

$$[\hat{x}(t), \hat{p}(t)] = \left[\hat{x}(0)\cos\omega t + \frac{\hat{p}(0)}{m\omega}\sin\omega t,\; \hat{p}(0)\cos\omega t - m\omega\hat{x}(0)\sin\omega t\right]$$

Khai triển dùng tính tuyến tính của commutator và $[\hat{x}(0),\hat{x}(0)] = [\hat{p}(0),\hat{p}(0)] = 0$:

$$= \cos^2\omega t\,[\hat{x}(0),\hat{p}(0)] - m\omega\sin\omega t\cos\omega t\,[\hat{x}(0),\hat{x}(0)]$$
$$+ \frac{\sin\omega t\cos\omega t}{m\omega}[\hat{p}(0),\hat{p}(0)] - \sin^2\omega t\,[\hat{p}(0), m\omega\hat{x}(0)]\cdot\frac{1}{m\omega}$$

$$= \cos^2\omega t\cdot i\hbar + 0 + 0 + \sin^2\omega t\cdot i\hbar = i\hbar(\cos^2\omega t + \sin^2\omega t) = i\hbar \quad\blacksquare$$

Kết quả cho thấy **canonical commutation relation bảo toàn theo thời gian** — tính chất cơ bản của tiến hóa unitary.

> [!example] Bài toán 11.2 — Phương trình Heisenberg cho hạt tự do
>
> Với hạt tự do $\hat{H} = \hat{p}^2/2m$, giải phương trình Heisenberg cho $\hat{x}(t)$ và $\hat{p}(t)$.

**Lời giải:**

**Động lượng:**

$$\frac{d\hat{p}}{dt} = \frac{i}{\hbar}\left[\frac{\hat{p}^2}{2m}, \hat{p}\right] = 0$$

Vì $[\hat{p}^2,\hat{p}] = \hat{p}^2\hat{p} - \hat{p}\hat{p}^2 = 0$. Suy ra $\hat{p}(t) = \hat{p}(0)$ — **động lượng bảo toàn**, đúng như cổ điển.

**Vị trí:**

$$\frac{d\hat{x}}{dt} = \frac{i}{\hbar}\left[\frac{\hat{p}^2}{2m}, \hat{x}\right] = \frac{i}{2m\hbar}\left(\hat{p}[\hat{p},\hat{x}] + [\hat{p},\hat{x}]\hat{p}\right) = \frac{i}{2m\hbar}(-i\hbar - i\hbar)\hat{p} = \frac{\hat{p}}{m}$$

Tích phân: $\hat{x}(t) = \hat{x}(0) + \frac{\hat{p}(0)}{m}t$ — **phương trình chuyển động thẳng đều**! Hoàn toàn giống cổ điển, nhưng $\hat{x}$ và $\hat{p}$ là toán tử không giao hoán.

---

## Summary

- **Toán tử tiến hóa thời gian**: $\hat{U}(t) = e^{-i\hat{H}t/\hbar}$ — unitary, bảo toàn xác suất.
- **Schrödinger picture**: trạng thái tiến hóa, toán tử cố định. **Heisenberg picture**: trạng thái cố định, toán tử tiến hóa $\hat{Q}_H(t) = \hat{U}^\dagger\hat{Q}_S\hat{U}$.
- **Phương trình Heisenberg**: $d\hat{Q}_H/dt = (i/\hbar)[\hat{H},\hat{Q}_H]$ — đối ứng lượng tử của phương trình Hamilton cổ điển.
- **Constant of motion**: $\hat{Q}$ bảo toàn $\Leftrightarrow$ $[\hat{H},\hat{Q}] = 0$.
- QHO trong Heisenberg picture: $\hat{x}(t)$ và $\hat{p}(t)$ dao động đúng như cổ điển — tính lượng tử nằm hoàn toàn ở commutation relation.
- **Interaction picture**: trung gian, dùng cho nhiễu loạn phụ thuộc thời gian (Lesson 14).

---

## References

- Griffiths — *Introduction to Quantum Mechanics*, 2nd ed., Ch. 6.2 (time evolution operator)
- MIT OCW 8.05 (Fall 2013) — Heisenberg picture và equation of motion
- Sakurai — *Modern Quantum Mechanics*, 2nd ed., Ch. 2.2–2.3
- Shankar — *Principles of Quantum Mechanics*, 2nd ed., Ch. 4.3
