---
title: "12. Generalized Uncertainty Principle"
tags: [physics, quantum-mechanics, lesson-12]
aliases: [Nguyên lý bất định tổng quát]
created: 2026-03-28
---

> **Prerequisites**: [[10-dirac-hilbert|10. Ký hiệu Dirac & không gian Hilbert]] — inner product, toán tử Hermitian; [[04-operators-expectation|04. Toán tử & giá trị kỳ vọng]] — commutator $[\hat{x},\hat{p}] = i\hbar$; [[09-angular-momentum-spin|09. Mômen động lượng & spin]] — commutation relations của $\hat{L}$.
> **Objectives**:
> - Chứng minh nguyên lý bất định tổng quát (Robertson inequality) từ bất đẳng thức Cauchy-Schwarz
> - Hiểu ý nghĩa của các observable **tương hợp** (compatible) và **không tương hợp** (incompatible)
> - Phát biểu định lý đo lường đồng thời (simultaneous measurement theorem)
> - Áp dụng cho các cặp: $(\hat{x},\hat{p})$, $(\hat{L}_x,\hat{L}_y)$, $(\hat{L}^2,\hat{L}_z)$, $(\hat{H},\hat{t})$
> - Hiểu nguyên lý bất định năng lượng-thời gian $\Delta E\cdot\Delta t \geq \hbar/2$

---

## Motivation

Trong Lesson 04, ta phát biểu nguyên lý bất định Heisenberg $\Delta x\cdot\Delta p \geq \hbar/2$ và phác thảo chứng minh. Bài này đào sâu: **định lý Robertson** cho phép viết bất định cho bất kỳ cặp observable nào từ commutator của chúng.

Điều này mở ra câu hỏi triết học trung tâm của QM: **đo lường là gì?** Khi ta đo một observable, hàm sóng "sụp đổ" (collapse) về hàm riêng tương ứng. Nếu hai observable không giao hoán, không thể đồng thời chuẩn bị hệ ở trạng thái xác định cho cả hai — đây là giới hạn vật lý thực sự, không phải kỹ thuật.

---

## Mathematical Formalism

### Bất đẳng thức Cauchy-Schwarz trong Hilbert space

> [!theorem] Theorem 12.1 — Cauchy-Schwarz Inequality
> Với hai vector bất kỳ $\ket{f}, \ket{g} \in \mathcal{H}$:
>
> $$\braket{f|f}\braket{g|g} \geq |\braket{f|g}|^2$$
>
> Dấu bằng đạt khi $\ket{g} = c\ket{f}$ với $c$ là hằng số phức.

---

### Nguyên lý bất định tổng quát — Robertson Inequality

> [!theorem] Theorem 12.2 — Robertson Inequality (1929)
> Với hai observable Hermitian $\hat{A}$ và $\hat{B}$, trong bất kỳ trạng thái $\ket{\psi}$:
>
> $$\Delta A\cdot\Delta B \geq \frac{1}{2}\left|\langle[\hat{A},\hat{B}]\rangle\right|$$
>
> Trong đó $\Delta A = \sqrt{\langle\hat{A}^2\rangle - \langle\hat{A}\rangle^2}$ là độ bất định của $A$.

**Chứng minh đầy đủ.**

Định nghĩa toán tử "độ lệch":

$$\hat{a} = \hat{A} - \langle A\rangle\hat{I}, \qquad \hat{b} = \hat{B} - \langle B\rangle\hat{I}$$

Cả hai đều Hermitian (vì $\langle A\rangle$ là số thực). Đặt:

$$\ket{f} = \hat{a}\ket{\psi}, \qquad \ket{g} = \hat{b}\ket{\psi}$$

Áp dụng Cauchy-Schwarz:

$$\braket{f|f}\braket{g|g} \geq |\braket{f|g}|^2$$

$$\bra{\psi}\hat{a}^2\ket{\psi}\cdot\bra{\psi}\hat{b}^2\ket{\psi} \geq |\bra{\psi}\hat{a}\hat{b}\ket{\psi}|^2$$

$$(\Delta A)^2(\Delta B)^2 \geq |\bra{\psi}\hat{a}\hat{b}\ket{\psi}|^2$$

Phân tích tích $\hat{a}\hat{b}$ thành phần đối xứng và phản đối xứng:

$$\hat{a}\hat{b} = \underbrace{\frac{\hat{a}\hat{b}+\hat{b}\hat{a}}{2}}_{\text{Hermitian}} + \underbrace{\frac{\hat{a}\hat{b}-\hat{b}\hat{a}}{2}}_{\text{anti-Hermitian} = \frac{[\hat{a},\hat{b}]}{2}}$$

Kỳ vọng của phần Hermitian là số **thực** ($= W$), kỳ vọng của phần anti-Hermitian là số **thuần ảo** ($= iZ/2$ với $Z$ thực):

$$\langle\hat{a}\hat{b}\rangle = W + \frac{i}{2}\langle[\hat{a},\hat{b}]\rangle$$

Vì $[\hat{a},\hat{b}] = [\hat{A}-\langle A\rangle, \hat{B}-\langle B\rangle] = [\hat{A},\hat{B}]$:

$$|\langle\hat{a}\hat{b}\rangle|^2 = W^2 + \frac{1}{4}|\langle[\hat{A},\hat{B}]\rangle|^2 \geq \frac{1}{4}|\langle[\hat{A},\hat{B}]\rangle|^2$$

Suy ra:

$$(\Delta A)^2(\Delta B)^2 \geq \frac{1}{4}|\langle[\hat{A},\hat{B}]\rangle|^2 \implies \Delta A\cdot\Delta B \geq \frac{1}{2}|\langle[\hat{A},\hat{B}]\rangle| \quad\blacksquare$$

---

### Các trường hợp quan trọng

> [!definition] Definition 12.3 — Các bất định cụ thể
>
> **Vị trí-Động lượng** — từ $[\hat{x},\hat{p}] = i\hbar$:
>
> $$\Delta x\cdot\Delta p \geq \frac{\hbar}{2}$$
>
> **Mômen động lượng** — từ $[\hat{L}_x,\hat{L}_y] = i\hbar\hat{L}_z$:
>
> $$\Delta L_x\cdot\Delta L_y \geq \frac{\hbar}{2}|\langle L_z\rangle|$$
>
> **Spin** — từ $[\hat{S}_x,\hat{S}_y] = i\hbar\hat{S}_z$:
>
> $$\Delta S_x\cdot\Delta S_y \geq \frac{\hbar}{2}|\langle S_z\rangle|$$

Lưu ý: vế phải của bất định $L_x$-$L_y$ **phụ thuộc vào trạng thái** (qua $\langle L_z\rangle$) — khác với $\Delta x\cdot\Delta p$ có vế phải là hằng số $\hbar/2$.

---

### Observable tương hợp (Compatible Observables)

> [!definition] Definition 12.4 — Compatible vs. Incompatible Observables
>
> Hai observable $\hat{A}$ và $\hat{B}$ gọi là **tương hợp** (compatible) nếu $[\hat{A},\hat{B}] = 0$, và **không tương hợp** (incompatible) nếu $[\hat{A},\hat{B}] \neq 0$.
>
> Với compatible observables: $\Delta A\cdot\Delta B \geq 0$ — tức có thể cùng bằng 0, không có giới hạn bất định.

> [!theorem] Theorem 12.5 — Simultaneous Measurement Theorem
> Hai observable $\hat{A}$ và $\hat{B}$ có thể được **đo đồng thời** với kết quả xác định khi và chỉ khi $[\hat{A},\hat{B}] = 0$.
>
> Tương đương: $[\hat{A},\hat{B}] = 0 \Leftrightarrow \hat{A}$ và $\hat{B}$ có **tập hàm riêng chung** (common eigenbasis).

**Chứng minh một chiều** ($\Leftarrow$): Nếu $\ket{a,b}$ là hàm riêng chung ($\hat{A}\ket{a,b} = a\ket{a,b}$ và $\hat{B}\ket{a,b} = b\ket{a,b}$):

$$[\hat{A},\hat{B}]\ket{a,b} = \hat{A}\hat{B}\ket{a,b} - \hat{B}\hat{A}\ket{a,b} = ab\ket{a,b} - ba\ket{a,b} = 0$$

Vì hàm riêng chung tạo cơ sở, $[\hat{A},\hat{B}] = 0$. $\blacksquare$

**Ví dụ compatible observables trong Hydrogen:**
- $\hat{H}, \hat{L}^2, \hat{L}_z$ đôi một giao hoán → số lượng tử $n, l, m$ cùng xác định một trạng thái.
- $\hat{H}, \hat{L}^2, \hat{S}^2, \hat{J}_z$ → thêm spin vào bộ số lượng tử.

**Ví dụ incompatible:**
- $\hat{L}_x$ và $\hat{L}_y$: không thể đo đồng thời.
- $\hat{x}$ và $\hat{p}$: không thể đo đồng thời.

---

### Nguyên lý bất định năng lượng-thời gian

Đây là trường hợp đặc biệt vì **thời gian không phải observable** trong QM — nó là tham số, không có toán tử $\hat{t}$.

> [!definition] Definition 12.6 — Energy-Time Uncertainty
>
> $$\Delta E\cdot\Delta t \geq \frac{\hbar}{2}$$
>
> Trong đó $\Delta t$ không phải độ bất định của phép đo thời gian, mà là **thời gian đặc trưng** để hệ thay đổi đáng kể:
>
> $$\Delta t = \frac{\Delta Q}{|d\langle Q\rangle/dt|}$$
>
> ($Q$ là bất kỳ observable nào đang thay đổi nhanh nhất trong hệ.)

**Chứng minh** (phác thảo): Dùng phương trình Heisenberg $d\langle Q\rangle/dt = (i/\hbar)\langle[\hat{H},\hat{Q}]\rangle$. Áp dụng Robertson với $\hat{A} = \hat{H}$ và $\hat{B} = \hat{Q}$:

$$\Delta H\cdot\Delta Q \geq \frac{1}{2}|\langle[\hat{H},\hat{Q}]\rangle| = \frac{\hbar}{2}\left|\frac{d\langle Q\rangle}{dt}\right|$$

Chia hai vế cho $|d\langle Q\rangle/dt|$ và dùng định nghĩa $\Delta t$:

$$\Delta E\cdot\Delta t \geq \frac{\hbar}{2} \quad\blacksquare$$

**Ý nghĩa vật lý của $\Delta E\cdot\Delta t \geq \hbar/2$:**

Trạng thái sống ngắn (thời gian sống $\tau$ nhỏ) → vạch phổ rộng ($\Delta E$ lớn). Ví dụ: trạng thái kích thích nguyên tử có $\tau \sim 10^{-8}$ s → $\Delta E \sim \hbar/\tau \sim 10^{-7}$ eV (độ rộng vạch phổ tự nhiên).

---

## Worked Problem

> [!example] Bài toán 12.1 — Bất định spin trong trạng thái tổng quát
>
> Electron ở trạng thái $\ket{\psi} = \cos(\theta/2)\ket{+} + \sin(\theta/2)\ket{-}$ (trạng thái spin dọc theo $\hat{n} = (\sin\theta,0,\cos\theta)$). Tính $\Delta S_x\cdot\Delta S_y$ và kiểm tra Robertson inequality.

**Lời giải:**

**Tính $\langle S_z\rangle$:**

$$\langle S_z\rangle = \frac{\hbar}{2}(\cos^2(\theta/2) - \sin^2(\theta/2)) = \frac{\hbar}{2}\cos\theta$$

**Tính $\langle S_x\rangle$:** Dùng ma trận $\sigma_x$:

$$\langle S_x\rangle = \frac{\hbar}{2}\begin{pmatrix}\cos(\theta/2) & \sin(\theta/2)\end{pmatrix}\begin{pmatrix}0&1\\1&0\end{pmatrix}\begin{pmatrix}\cos(\theta/2)\\\sin(\theta/2)\end{pmatrix} = \frac{\hbar}{2}\sin\theta$$

**Tính $\langle S_x^2\rangle = \hbar^2/4$** (vì $\sigma_x^2 = I$).

$$(\Delta S_x)^2 = \frac{\hbar^2}{4} - \frac{\hbar^2}{4}\sin^2\theta = \frac{\hbar^2}{4}\cos^2\theta$$

$$\Delta S_x = \frac{\hbar}{2}|\cos\theta|$$

Tương tự tính $\langle S_y\rangle = 0$ (vì $\sigma_y$ có phần ảo, toàn bộ triệt tiêu với hệ số thực), $\langle S_y^2\rangle = \hbar^2/4$:

$$\Delta S_y = \frac{\hbar}{2}$$

**Kiểm tra Robertson:**

$$\Delta S_x\cdot\Delta S_y = \frac{\hbar}{2}|\cos\theta|\cdot\frac{\hbar}{2} = \frac{\hbar^2}{4}|\cos\theta|$$

Vế phải Robertson: $\frac{1}{2}|\langle[\hat{S}_x,\hat{S}_y]\rangle| = \frac{1}{2}|i\hbar\langle S_z\rangle| = \frac{\hbar}{2}\cdot\frac{\hbar}{2}|\cos\theta| = \frac{\hbar^2}{4}|\cos\theta|$

$\Delta S_x\cdot\Delta S_y = \frac{\hbar^2}{4}|\cos\theta| \geq \frac{\hbar^2}{4}|\cos\theta|$ ✓ — dấu bằng đạt! Trạng thái này là **minimum uncertainty state** cho cặp $(S_x, S_y)$.

> [!example] Bài toán 12.2 — Ứng dụng bất định năng lượng-thời gian
>
> Trạng thái kích thích của nguyên tử có thời gian sống trung bình $\tau = 10^{-8}$ s. Ước lượng độ rộng vạch phổ tự nhiên (natural linewidth) $\Delta\nu$ của photon phát ra.

**Lời giải:**

Từ $\Delta E\cdot\Delta t \geq \hbar/2$ với $\Delta t = \tau$:

$$\Delta E \geq \frac{\hbar}{2\tau} = \frac{1.055\times10^{-34}}{2\times10^{-8}} \approx 5.3\times10^{-27}\,\text{J}$$

Đổi sang tần số ($E = h\nu$ → $\Delta E = h\Delta\nu$):

$$\Delta\nu \geq \frac{\Delta E}{h} = \frac{5.3\times10^{-27}}{6.626\times10^{-34}} \approx 8\times10^6\,\text{Hz} = 8\,\text{MHz}$$

**Ý nghĩa**: Vạch phổ nguyên tử không bao giờ vô hạn hẹp — luôn có độ rộng tự nhiên $\sim$MHz, ngay cả khi không có va chạm hay Doppler broadening. Đây là giới hạn vật lý cơ bản từ nguyên lý bất định.

---

## Summary

- **Robertson inequality**: $\Delta A\cdot\Delta B \geq \frac{1}{2}|\langle[\hat{A},\hat{B}]\rangle|$ — chứng minh từ Cauchy-Schwarz trong Hilbert space.
- **Compatible observables** $[\hat{A},\hat{B}]=0$: có thể đo đồng thời, có cơ sở hàm riêng chung.
- **Incompatible observables** $[\hat{A},\hat{B}]\neq 0$: không thể đo đồng thời, có giới hạn bất định cứng.
- Bộ **CSCO** (Complete Set of Commuting Observables): tập tối thiểu các observable tương hợp đủ để xác định duy nhất một trạng thái — ví dụ $\{\hat{H}, \hat{L}^2, \hat{L}_z\}$ cho Hydrogen.
- **Bất định năng lượng-thời gian** $\Delta E\cdot\Delta t \geq \hbar/2$: $\Delta t$ là thời gian đặc trưng thay đổi của hệ; giải thích độ rộng vạch phổ tự nhiên.

---

## References

- Griffiths — *Introduction to Quantum Mechanics*, 2nd ed., Ch. 3.5
- Robertson, H.P. (1929) — "The Uncertainty Principle", *Physical Review* **34**, 163
- MIT OCW 8.05 (Fall 2013) — Compatible observables, uncertainty principle
- Sakurai — *Modern Quantum Mechanics*, 2nd ed., Ch. 1.4
- Shankar — *Principles of Quantum Mechanics*, 2nd ed., Ch. 9
