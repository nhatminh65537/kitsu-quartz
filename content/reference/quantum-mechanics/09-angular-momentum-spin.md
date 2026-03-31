---
title: "09. Angular Momentum and Spin"
tags: [physics, quantum-mechanics, lesson-09]
aliases: [Mômen động lượng và spin]
created: 2026-03-27
---

> **Prerequisites**: [[08-hydrogen-atom|08. Nguyên tử Hydrogen — Schrödinger 3D]] — số lượng tử $l, m$, spherical harmonics; [[04-operators-expectation|04. Toán tử & giá trị kỳ vọng]] — commutator.
> **Objectives**:
> - Xây dựng toán tử mômen động lượng quỹ đạo $\hat{L}$ và tính commutation relations
> - Hiểu tại sao chỉ $L^2$ và $L_z$ đồng thời đo được (không phải cả ba thành phần)
> - Giải phổ $L^2$ và $L_z$ hoàn toàn bằng đại số (ladder operators $L_\pm$)
> - Giới thiệu spin $1/2$: ma trận Pauli, spinors, và trạng thái $\ket{\pm}$
> - Hiểu phép cộng mômen động lượng và hệ số Clebsch-Gordan

---

## Motivation

Trong Lesson 08, ta thấy số lượng tử $l$ và $m$ xuất hiện khi giải phương trình góc — nhưng chưa hiểu sâu nguồn gốc đại số của chúng. Bài này trả lời câu hỏi đó: **lượng tử hóa của mômen động lượng là hệ quả thuần túy của đại số commutator**, không cần giải ODE.

Quan trọng hơn, ta sẽ gặp **spin** — một loại mômen động lượng nội tại của hạt không có đối ứng cổ điển nào. Electron có spin $1/2$, nghĩa là nó chỉ có hai trạng thái spin: "lên" và "xuống". Hiểu spin là cần thiết để hiểu bảng tuần hoàn, từ tính, và toàn bộ vật lý chất rắn và hóa học lượng tử.

---

## Physical Model

### Toán tử mômen động lượng quỹ đạo

Trong cơ học cổ điển, $\mathbf{L} = \mathbf{r}\times\mathbf{p}$. Lượng tử hóa: thay $\mathbf{p} \to -i\hbar\nabla$:

$$\hat{L}_x = \hat{y}\hat{p}_z - \hat{z}\hat{p}_y, \quad \hat{L}_y = \hat{z}\hat{p}_x - \hat{x}\hat{p}_z, \quad \hat{L}_z = \hat{x}\hat{p}_y - \hat{y}\hat{p}_x$$

---

## Mathematical Formalism

### Commutation Relations — Cốt lõi của mọi thứ

> [!theorem] Theorem 9.1 — Commutation Relations của $\hat{L}$
>
> $$[\hat{L}_x, \hat{L}_y] = i\hbar\hat{L}_z, \quad [\hat{L}_y, \hat{L}_z] = i\hbar\hat{L}_x, \quad [\hat{L}_z, \hat{L}_x] = i\hbar\hat{L}_y$$
>
> Viết gọn: $\hat{\mathbf{L}}\times\hat{\mathbf{L}} = i\hbar\hat{\mathbf{L}}$.
>
> Hệ quả quan trọng: định nghĩa $\hat{L}^2 = \hat{L}_x^2 + \hat{L}_y^2 + \hat{L}_z^2$, thì:
>
> $$[\hat{L}^2, \hat{L}_x] = [\hat{L}^2, \hat{L}_y] = [\hat{L}^2, \hat{L}_z] = 0$$

**Ý nghĩa vật lý**: Vì $[\hat{L}_x, \hat{L}_y] \neq 0$, ta **không thể** đo đồng thời $L_x$ và $L_y$ — nguyên lý bất định cho mômen động lượng. Tuy nhiên, vì $[\hat{L}^2, \hat{L}_z] = 0$, ta **có thể** đo đồng thời $L^2$ và $L_z$ — và đây chính xác là những gì số lượng tử $l$ và $m$ mô tả.

### Ladder Operators cho $\hat{L}$

> [!definition] Definition 9.2 — Raising/Lowering operators cho $\hat{L}$
>
> $$\hat{L}_+ = \hat{L}_x + i\hat{L}_y, \qquad \hat{L}_- = \hat{L}_x - i\hat{L}_y$$
>
> Các commutation relations:
>
> $$[\hat{L}_z, \hat{L}_\pm] = \pm\hbar\hat{L}_\pm, \qquad [\hat{L}_+, \hat{L}_-] = 2\hbar\hat{L}_z$$

> [!theorem] Theorem 9.3 — Tác dụng của $\hat{L}_\pm$
> Nếu $\hat{L}^2 f = \lambda f$ và $\hat{L}_z f = \mu f$, thì $\hat{L}_\pm f$ là hàm riêng của $\hat{L}_z$ với trị riêng $\mu \pm \hbar$.

**Chứng minh:** $\hat{L}_z(\hat{L}_+ f) = (\hat{L}_+\hat{L}_z + \hbar\hat{L}_+)f = (\mu + \hbar)(\hat{L}_+f)$. $\blacksquare$

### Phổ của $\hat{L}^2$ và $\hat{L}_z$ — Hoàn toàn từ đại số

Do $L^2 = L_x^2 + L_y^2 + L_z^2 \geq L_z^2$, với trị riêng $\lambda$ của $\hat{L}^2$ cố định, trị riêng $\mu$ của $\hat{L}_z$ bị chặn: $|\mu| \leq \sqrt{\lambda}$.

Gọi $\mu_\text{max}$ là trị riêng lớn nhất của $\hat{L}_z$ tương ứng với $\lambda$. Khi đó $\hat{L}_+ f_\text{top} = 0$, và:

$$\hat{L}^2 f_\text{top} = (\hat{L}_-\hat{L}_+ + \hat{L}_z^2 + \hbar\hat{L}_z)f_\text{top} = (0 + \mu_\text{max}^2 + \hbar\mu_\text{max})f_\text{top}$$

Suy ra $\lambda = \mu_\text{max}(\mu_\text{max} + \hbar)$. Đặt $\mu_\text{max} = l\hbar$:

> [!definition] Definition 9.4 — Phổ của mômen động lượng
>
> $$\hat{L}^2 Y_l^m = l(l+1)\hbar^2\, Y_l^m, \quad l = 0, \tfrac{1}{2}, 1, \tfrac{3}{2}, 2, \ldots$$
>
> $$\hat{L}_z Y_l^m = m\hbar\, Y_l^m, \quad m = -l, -l+1, \ldots, l-1, l$$
>
> **Với mômen động lượng quỹ đạo**: $l$ phải là **số nguyên** (do điều kiện đơn trị của $\Phi(\phi)$). Tuy nhiên, về mặt đại số thuần túy, $l$ có thể là nửa nguyên — và đây chính là spin!

**Tác dụng tường minh của $\hat{L}_\pm$:**

$$\hat{L}_\pm Y_l^m = \hbar\sqrt{l(l+1) - m(m\pm 1)}\, Y_l^{m\pm 1}$$

---

### Spin — Mômen động lượng nội tại

Năm 1922, thí nghiệm Stern-Gerlach bắn nguyên tử bạc qua từ trường không đều — và thu được **hai chùm** tách biệt, không phải một dải liên tục. Điều này cho thấy nguyên tử bạc có mômen động lượng nội tại với đúng hai giá trị $m$ — tức $l = 1/2$.

Đây là **spin** — hoàn toàn không có đối ứng cổ điển, không thể hiểu như hạt "tự quay".

> [!definition] Definition 9.5 — Spin 1/2
>
> Electron có **spin** $s = 1/2$. Toán tử spin $\hat{S}$ thỏa mãn hệ thức giao hoán giống hệt $\hat{L}$:
>
> $$[\hat{S}_x, \hat{S}_y] = i\hbar\hat{S}_z, \quad \text{v.v.}$$
>
> Chỉ có **hai trạng thái spin** (spinors):
>
> $$\chi_+ = \begin{pmatrix}1\\0\end{pmatrix} \quad \text{(spin up, } m_s = +1/2\text{)}, \qquad \chi_- = \begin{pmatrix}0\\1\end{pmatrix} \quad \text{(spin down, } m_s = -1/2\text{)}$$
>
> Trạng thái spin tổng quát: $\chi = a\chi_+ + b\chi_- = \begin{pmatrix}a\\b\end{pmatrix}$, $|a|^2 + |b|^2 = 1$.

### Ma trận Pauli

Toán tử spin biểu diễn qua **ma trận Pauli** $\hat{S}_i = \frac{\hbar}{2}\sigma_i$:

> [!definition] Definition 9.6 — Ma trận Pauli
>
> $$\sigma_x = \begin{pmatrix}0 & 1\\1 & 0\end{pmatrix}, \quad \sigma_y = \begin{pmatrix}0 & -i\\i & 0\end{pmatrix}, \quad \sigma_z = \begin{pmatrix}1 & 0\\0 & -1\end{pmatrix}$$
>
> **Tính chất quan trọng:**
>
> $$\sigma_i^2 = I, \quad \sigma_x\sigma_y = i\sigma_z, \quad \{\sigma_i, \sigma_j\} = 2\delta_{ij}I$$
>
> **Trị riêng của $\hat{S}_z$:** $+\hbar/2$ (với $\chi_+$) và $-\hbar/2$ (với $\chi_-$).
>
> **$\hat{S}^2$:** $\hat{S}^2\chi = s(s+1)\hbar^2\chi = \frac{3}{4}\hbar^2\chi$ với mọi spinor $\chi$.

---

### Phép cộng mômen động lượng

Khi hệ có hai nguồn mômen động lượng — ví dụ spin và orbital, hoặc hai hạt — ta cần **cộng** chúng lại.

> [!definition] Definition 9.7 — Phép cộng mômen động lượng
>
> Cho $\hat{J}_1$ (số lượng tử $j_1$) và $\hat{J}_2$ (số lượng tử $j_2$). Mômen động lượng tổng $\hat{J} = \hat{J}_1 + \hat{J}_2$ có:
>
> $$j = |j_1 - j_2|,\; |j_1 - j_2| + 1,\; \ldots,\; j_1 + j_2$$
>
> Với mỗi $j$: $m = -j, \ldots, j$.

Cơ sở tích trực tiếp $\ket{j_1, m_1}\ket{j_2, m_2}$ và cơ sở tổng $\ket{j, m}$ liên hệ nhau qua **hệ số Clebsch-Gordan** $\langle j_1, m_1; j_2, m_2 | j, m \rangle$:

$$\ket{j, m} = \sum_{m_1 + m_2 = m} \langle j_1, m_1; j_2, m_2 | j, m\rangle\, \ket{j_1, m_1}\ket{j_2, m_2}$$

---

## Derivation

### Ví dụ cộng spin-orbital: hệ $l = 1$, $s = 1/2$

Cho electron với $l = 1$ và $s = 1/2$. Mômen tổng $j$ có thể là:

$$j = |1 - 1/2|,\; 1 + 1/2 \quad \Rightarrow \quad j = 1/2 \text{ hoặc } j = 3/2$$

**Số trạng thái kiểm tra:** $(2\times1+1)(2\times1/2+1) = 3\times2 = 6$.

Cộng lại: $(2\times3/2+1) + (2\times1/2+1) = 4 + 2 = 6$ ✓

**Trạng thái $\ket{j=3/2, m=3/2}$** (trạng thái cao nhất): Đây phải là $\ket{m_l=1}\ket{m_s=+1/2}$ (cách duy nhất để $m = m_l + m_s = 3/2$):

$$\ket{3/2, 3/2} = \ket{1,1}\ket{1/2,+1/2}$$

Tác dụng $\hat{J}_-$ lên hai vế để thu được $\ket{3/2, 1/2}$:

$$\ket{3/2,\,1/2} = \sqrt{\frac{1}{3}}\,\ket{1,\,0}\ket{1/2,\,+1/2} + \sqrt{\frac{2}{3}}\,\ket{1,\,1}\ket{1/2,\,-1/2}$$

Trạng thái $\ket{1/2, 1/2}$ trực giao với $\ket{3/2, 1/2}$:

$$\ket{1/2,\,1/2} = \sqrt{\frac{2}{3}}\,\ket{1,\,0}\ket{1/2,\,+1/2} - \sqrt{\frac{1}{3}}\,\ket{1,\,1}\ket{1/2,\,-1/2}$$

---

## Worked Problem

> [!example] Bài toán 9.1 — Đo spin theo hướng $x$
>
> Electron ở trạng thái spin $\chi_+$ (spin-up theo $z$). Ta đo $S_x$. Kết quả có thể là gì, với xác suất bao nhiêu?

**Lời giải:**

Hàm riêng của $\hat{S}_x = \frac{\hbar}{2}\sigma_x$:

$$\hat{S}_x v = \frac{\hbar}{2}\begin{pmatrix}0&1\\1&0\end{pmatrix}v = \lambda v$$

Trị riêng: $\lambda = \pm\hbar/2$. Hàm riêng:

$$\chi_+^{(x)} = \frac{1}{\sqrt{2}}\begin{pmatrix}1\\1\end{pmatrix}, \qquad \chi_-^{(x)} = \frac{1}{\sqrt{2}}\begin{pmatrix}1\\-1\end{pmatrix}$$

Khai triển $\chi_+$ theo cơ sở $x$:

$$\chi_+ = \begin{pmatrix}1\\0\end{pmatrix} = \frac{1}{\sqrt{2}}\chi_+^{(x)} + \frac{1}{\sqrt{2}}\chi_-^{(x)}$$

**Kết quả:** Đo $S_x$ sẽ cho $+\hbar/2$ hoặc $-\hbar/2$, mỗi giá trị với **xác suất $1/2$**.

Ý nghĩa: electron đang ở trạng thái spin-up theo $z$ — hoàn toàn không xác định theo $x$. Nguyên lý bất định cho spin: $\Delta S_x\cdot\Delta S_y \geq \hbar|\langle S_z\rangle|/2$.

> [!example] Bài toán 9.2 — Precession spin trong từ trường
>
> Electron ở $t=0$ trong trạng thái $\chi_+$. Đặt vào từ trường $\mathbf{B} = B_0\hat{z}$. Hamiltonian spin: $\hat{H} = -\gamma B_0\hat{S}_z$ ($\gamma$ là tỉ số hồi chuyển từ). Tìm $\chi(t)$ và $\langle S_x\rangle(t)$.

**Lời giải:**

$\chi_+$ và $\chi_-$ là hàm riêng của $\hat{H}$ với $E_\pm = \mp\gamma B_0\hbar/2 = \mp\hbar\omega_0/2$ ($\omega_0 = \gamma B_0$).

$$\chi(t) = a\chi_+e^{i\omega_0 t/2} + b\chi_-e^{-i\omega_0 t/2}$$

Với $\chi(0) = \chi_+$: $a = 1$, $b = 0$.

$$\langle S_x\rangle = \chi^\dagger(t)\hat{S}_x\chi(t) = \frac{\hbar}{2}\begin{pmatrix}e^{-i\omega_0 t/2} & 0\end{pmatrix}\begin{pmatrix}0&1\\1&0\end{pmatrix}\begin{pmatrix}e^{i\omega_0 t/2}\\0\end{pmatrix} = 0$$

Spin ở $\chi_+$ luôn cho $\langle S_x\rangle = 0$. Nếu bắt đầu ở $\chi_+^{(x)}$ thay vào, ta sẽ thấy $\langle S_x\rangle = (\hbar/2)\cos(\omega_0 t)$ — spin **tiến động** (precess) quanh $z$ với tần số Larmor $\omega_0$.

---

## Summary

- $\hat{L}$ thỏa $[\hat{L}_i, \hat{L}_j] = i\hbar\epsilon_{ijk}\hat{L}_k$ → không đo đồng thời $L_x, L_y, L_z$; nhưng $[\hat{L}^2, \hat{L}_z] = 0$ nên đo đồng thời $L^2$ và $L_z$.
- Phổ: $\hat{L}^2 f = l(l+1)\hbar^2 f$, $\hat{L}_z f = m\hbar f$, $m = -l,\ldots,l$. Ladder operators $\hat{L}_\pm$ tăng/giảm $m$ đi 1.
- **Spin $1/2$**: mômen động lượng nội tại $s=1/2$, hai trạng thái $\chi_\pm$, ma trận Pauli $\sigma_i$.
- **Phép cộng**: $\hat{J} = \hat{J}_1 + \hat{J}_2$, $j = |j_1-j_2|,\ldots,j_1+j_2$. Hệ số Clebsch-Gordan liên hệ hai cơ sở.
- Hàm sóng đầy đủ của electron: $\psi_{nlm}(r,\theta,\phi)\chi_\pm$ — tích của hàm sóng không gian và spinor.

---

## References

- Griffiths — *Introduction to Quantum Mechanics*, 2nd ed., Ch. 4.3–4.4
- MIT OCW 8.05 (Fall 2013) — Angular momentum and spin, Clebsch-Gordan
- Shankar — *Principles of Quantum Mechanics*, 2nd ed., Ch. 12–15
- Sakurai — *Modern Quantum Mechanics*, Ch. 1 (spin) và Ch. 3 (angular momentum)
