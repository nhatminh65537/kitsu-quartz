---
title: "15. Identical Particles and Quantum Statistics"
tags: [physics, quantum-mechanics, lesson-15]
aliases: [Các hạt giống nhau và thống kê lượng tử]
created: 2026-03-28
---

> **Prerequisites**: [[09-angular-momentum-spin|09. Mômen động lượng & spin]] — spin, spinors; [[10-dirac-hilbert|10. Ký hiệu Dirac & không gian Hilbert]] — khai triển, không gian tích trực tiếp.
> **Objectives**:
> - Hiểu tại sao các hạt giống nhau đòi hỏi đối xứng đặc biệt của hàm sóng
> - Phân biệt boson (đối xứng) và fermion (phản đối xứng)
> - Phát biểu và áp dụng nguyên lý loại trừ Pauli (Pauli exclusion principle)
> - Xây dựng hàm sóng antisymmetric qua định thức Slater
> - Hiểu thống kê Bose-Einstein và Fermi-Dirac; ứng dụng cho electron trong kim loại và Bose-Einstein condensate

---

## Motivation

Trong cơ học cổ điển, ta có thể nguyên lý phân biệt hai hạt giống hệt nhau bằng cách theo dõi quỹ đạo của chúng. Trong QM, điều này **không thể thực hiện**: các hạt không có quỹ đạo xác định, và nếu hai electron đổi chỗ cho nhau, không có thực nghiệm nào phát hiện được.

Đây không chỉ là vấn đề kỹ thuật — nó dẫn đến **hai loại hạt về mặt nguyên lý**: boson và fermion, với hành vi thống kê hoàn toàn khác nhau. Nguyên lý loại trừ Pauli — rằng hai fermion không thể ở cùng một trạng thái lượng tử — là nền tảng của cấu trúc bảng tuần hoàn, tính bền vững của vật chất, và toàn bộ hóa học.

---

## Physical Model

### Nguyên lý không phân biệt (Indistinguishability)

Xét hệ hai hạt giống nhau. Hàm sóng $\Psi(\mathbf{r}_1, \mathbf{r}_2)$. Toán tử hoán vị $\hat{P}_{12}$:

$$\hat{P}_{12}\Psi(\mathbf{r}_1,\mathbf{r}_2) = \Psi(\mathbf{r}_2,\mathbf{r}_1)$$

Vì hai hạt không phân biệt được, mọi observable phải không đổi khi hoán vị: $|\Psi(\mathbf{r}_1,\mathbf{r}_2)|^2 = |\Psi(\mathbf{r}_2,\mathbf{r}_1)|^2$.

Suy ra $\Psi(\mathbf{r}_2,\mathbf{r}_1) = e^{i\alpha}\Psi(\mathbf{r}_1,\mathbf{r}_2)$. Áp dụng hoán vị hai lần: $e^{2i\alpha} = 1$, nên $e^{i\alpha} = \pm 1$.

> [!definition] Definition 15.1 — Boson và Fermion
>
> **Boson** (spin nguyên: $0, 1, 2, \ldots$): hàm sóng **đối xứng** (symmetric) dưới hoán vị:
>
> $$\Psi(\mathbf{r}_2,\mathbf{r}_1) = +\Psi(\mathbf{r}_1,\mathbf{r}_2)$$
>
> **Fermion** (spin nửa nguyên: $1/2, 3/2, \ldots$): hàm sóng **phản đối xứng** (antisymmetric) dưới hoán vị:
>
> $$\Psi(\mathbf{r}_2,\mathbf{r}_1) = -\Psi(\mathbf{r}_1,\mathbf{r}_2)$$
>
> Đây là **spin-statistics theorem** — hệ quả sâu của QFT (tương đối tính), ta nhận làm tiên đề trong QM phi tương đối tính.

---

## Mathematical Formalism

### Xây dựng hàm sóng đối xứng và phản đối xứng

Với hai hạt độc lập ở trạng thái $\psi_a$ và $\psi_b$:

**Boson** — symmetrization:

$$\Psi_S(\mathbf{r}_1,\mathbf{r}_2) = \frac{1}{\sqrt{2}}\left[\psi_a(\mathbf{r}_1)\psi_b(\mathbf{r}_2) + \psi_b(\mathbf{r}_1)\psi_a(\mathbf{r}_2)\right]$$

**Fermion** — antisymmetrization:

$$\Psi_A(\mathbf{r}_1,\mathbf{r}_2) = \frac{1}{\sqrt{2}}\left[\psi_a(\mathbf{r}_1)\psi_b(\mathbf{r}_2) - \psi_b(\mathbf{r}_1)\psi_a(\mathbf{r}_2)\right]$$

### Nguyên lý loại trừ Pauli

> [!theorem] Theorem 15.2 — Pauli Exclusion Principle
> Hai fermion **không thể ở cùng một trạng thái lượng tử** ($\psi_a = \psi_b$):
>
> Nếu $\psi_a = \psi_b$:
> $$\Psi_A = \frac{1}{\sqrt{2}}[\psi_a(\mathbf{r}_1)\psi_a(\mathbf{r}_2) - \psi_a(\mathbf{r}_1)\psi_a(\mathbf{r}_2)] = 0$$
>
> Hàm sóng triệt tiêu — trạng thái không tồn tại.

Đây là nguồn gốc của cấu hình electron trong nguyên tử: mỗi orbital $(n,l,m)$ chứa tối đa **2 electron** (spin up và spin down).

Với boson: nếu $\psi_a = \psi_b$ thì $\Psi_S = \sqrt{2}\psi_a(\mathbf{r}_1)\psi_a(\mathbf{r}_2)$ — xác suất tăng gấp đôi. Boson **"thích"** ở cùng trạng thái — nguồn gốc của laser, superconductivity, và Bose-Einstein condensate.

### Định thức Slater (Slater Determinant)

Với $N$ fermion ở các trạng thái $\psi_1, \psi_2, \ldots, \psi_N$, hàm sóng antisymmetric tổng quát:

> [!definition] Definition 15.3 — Slater Determinant
>
> $$\Psi(\mathbf{r}_1,\ldots,\mathbf{r}_N) = \frac{1}{\sqrt{N!}}\begin{vmatrix}\psi_1(\mathbf{r}_1) & \psi_2(\mathbf{r}_1) & \cdots & \psi_N(\mathbf{r}_1) \\ \psi_1(\mathbf{r}_2) & \psi_2(\mathbf{r}_2) & \cdots & \psi_N(\mathbf{r}_2) \\ \vdots & \vdots & \ddots & \vdots \\ \psi_1(\mathbf{r}_N) & \psi_2(\mathbf{r}_N) & \cdots & \psi_N(\mathbf{r}_N)\end{vmatrix}$$
>
> Tính chất: hoán đổi hai hàng (tức hoán vị hai hạt) → định thức đổi dấu ✓; hai hàng giống nhau (hai hạt ở cùng trạng thái) → định thức bằng 0 ✓

Slater determinant là nền tảng của **phương pháp Hartree-Fock** — phương pháp tính toán cấu trúc điện tử của nguyên tử và phân tử.

---

### Thống kê lượng tử

Phân bố xác suất trung bình số hạt ở trạng thái năng lượng $\varepsilon$ ở nhiệt độ $T$:

> [!definition] Definition 15.4 — Phân bố Bose-Einstein và Fermi-Dirac
>
> **Fermion — Phân bố Fermi-Dirac:**
>
> $$\bar{n}(\varepsilon) = \frac{1}{e^{(\varepsilon-\mu)/k_BT} + 1}$$
>
> **Boson — Phân bố Bose-Einstein:**
>
> $$\bar{n}(\varepsilon) = \frac{1}{e^{(\varepsilon-\mu)/k_BT} - 1}$$
>
> Trong đó $\mu$ là thế hóa học (chemical potential), $k_B$ là hằng số Boltzmann. Cả hai quy về **phân bố Maxwell-Boltzmann** $\bar{n} \approx e^{-(\varepsilon-\mu)/k_BT}$ ở giới hạn nhiệt độ cao.

---

## Derivation

### Electron trong kim loại — Fermi gas

Kim loại chứa $N$ electron tự do trong thể tích $V$. Ở $T = 0$:

- Electron điền vào các trạng thái từ dưới lên theo nguyên lý Pauli.
- Mức cao nhất được điền đầy gọi là **Fermi energy** $E_F$.

$$E_F = \frac{\hbar^2}{2m}\left(3\pi^2\frac{N}{V}\right)^{2/3}$$

Với electron trong đồng ($N/V \approx 8.5\times10^{28}$ m$^{-3}$): $E_F \approx 7$ eV, tương ứng nhiệt độ Fermi $T_F = E_F/k_B \approx 81{,}000$ K.

Vì $T_F \gg T_\text{phòng}$, electron trong kim loại ở $T = 300$ K vẫn gần như ở trạng thái $T = 0$ — **quantum degenerate Fermi gas**. Đây giải thích tại sao nhiệt dung của electron trong kim loại nhỏ hơn nhiều so với dự đoán cổ điển.

### Bose-Einstein Condensate (BEC)

Với boson ở nhiệt độ đủ thấp, số lượng hạt lớn **cùng rơi vào trạng thái cơ bản** — Bose-Einstein condensate. Nhiệt độ tới hạn:

$$T_c = \frac{2\pi\hbar^2}{mk_B}\left(\frac{N}{V\cdot\zeta(3/2)}\right)^{2/3}$$

BEC lần đầu quan sát được năm 1995 (Cornell và Wieman, giải Nobel 2001) với khí nguyên tử ${}^{87}$Rb ở $T_c \approx 170$ nK. Toàn bộ đám mây nguyên tử cư xử như một "siêu nguyên tử" mô tả bởi một hàm sóng duy nhất — biểu hiện QM ở thang vĩ mô.

---

## Worked Problem

> [!example] Bài toán 15.1 — Exchange interaction
>
> Xét hai electron (fermion, spin $1/2$) ở hai trạng thái không gian $\psi_a$ và $\psi_b$ (trực giao). Tính $\langle(\mathbf{r}_1 - \mathbf{r}_2)^2\rangle$ cho trạng thái triplet và singlet và giải thích hiệu ứng exchange.

**Lời giải:**

Hàm sóng tổng = (phần không gian) × (phần spin), toàn bộ phải antisymmetric.

**Singlet spin** ($S=0$, antisymmetric):
$$\Psi_\text{singlet} = \frac{1}{\sqrt{2}}[\psi_a(\mathbf{r}_1)\psi_b(\mathbf{r}_2) + \psi_b(\mathbf{r}_1)\psi_a(\mathbf{r}_2)] \cdot \chi_\text{singlet}$$

**Triplet spin** ($S=1$, symmetric → phần không gian antisymmetric):
$$\Psi_\text{triplet} = \frac{1}{\sqrt{2}}[\psi_a(\mathbf{r}_1)\psi_b(\mathbf{r}_2) - \psi_b(\mathbf{r}_1)\psi_a(\mathbf{r}_2)] \cdot \chi_\text{triplet}$$

Tính $\langle(\mathbf{r}_1-\mathbf{r}_2)^2\rangle = \langle r_1^2\rangle + \langle r_2^2\rangle - 2\langle\mathbf{r}_1\cdot\mathbf{r}_2\rangle$:

$$\langle(\mathbf{r}_1-\mathbf{r}_2)^2\rangle = \langle r^2\rangle_a + \langle r^2\rangle_b - 2|\langle\mathbf{r}\rangle_{ab}|^2 \mp 2|\langle\mathbf{r}\rangle_{ab}|^2$$

Dấu $-$ cho singlet (symmetric spatial), dấu $+$ cho triplet (antisymmetric spatial):

$$\langle(\mathbf{r}_1-\mathbf{r}_2)^2\rangle = \begin{cases}\langle r^2\rangle_a + \langle r^2\rangle_b - 2|\langle\mathbf{r}\rangle_{ab}|^2 - 2|M|^2 & \text{(singlet)} \\ \langle r^2\rangle_a + \langle r^2\rangle_b - 2|\langle\mathbf{r}\rangle_{ab}|^2 + 2|M|^2 & \text{(triplet)}\end{cases}$$

với $M = \int\psi_a^*(\mathbf{r})\mathbf{r}\,\psi_b(\mathbf{r})\,d^3r$ là **exchange integral**.

**Kết luận**: Singlet (spin đối song) → hai electron ở **gần nhau** hơn. Triplet (spin song song) → hai electron ở **xa nhau** hơn. Đây là **exchange interaction** — tương tác hiệu dụng giữa hai electron có nguồn gốc từ thống kê, không phải từ tương tác điện từ. Nó là cơ chế của từ tính trong vật liệu (Heisenberg exchange coupling).

---

## Summary

- Hạt giống nhau: **không phân biệt được** → hàm sóng phải symmetric (boson) hoặc antisymmetric (fermion).
- **Spin-statistics theorem**: spin nguyên → boson; spin nửa nguyên → fermion.
- **Pauli exclusion principle**: fermion không thể ở cùng trạng thái → $\Psi_A = 0$. Cơ sở của cấu hình electron và bảng tuần hoàn.
- **Slater determinant**: xây dựng hàm sóng antisymmetric cho $N$ fermion.
- **Fermi-Dirac**: $\bar{n} = 1/(e^{(\varepsilon-\mu)/k_BT}+1)$ — không quá 1 hạt/trạng thái. Fermi energy $E_F$, degenerate Fermi gas.
- **Bose-Einstein**: $\bar{n} = 1/(e^{(\varepsilon-\mu)/k_BT}-1)$ — boson "thích" tụ vào trạng thái thấp nhất. BEC ở nhiệt độ tới hạn.
- **Exchange interaction**: hiệu ứng thống kê làm thay đổi khoảng cách hiệu dụng giữa các hạt — nền tảng của từ tính.

---

## References

- Griffiths — *Introduction to Quantum Mechanics*, 2nd ed., Ch. 5
- MIT OCW 8.06 (Spring 2016) — Identical particles, exchange, quantum statistics
- Sakurai — *Modern Quantum Mechanics*, 2nd ed., Ch. 6
- Feynman Lectures Vol. 3, Ch. 3–4: Identical particles
