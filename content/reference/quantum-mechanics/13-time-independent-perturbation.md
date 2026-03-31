---
title: "13. Time-Independent Perturbation Theory"
tags: [physics, quantum-mechanics, lesson-13]
aliases: [Nhiễu loạn không phụ thuộc thời gian]
created: 2026-03-28
---

> **Prerequisites**: [[10-dirac-hilbert|10. Ký hiệu Dirac & không gian Hilbert]] — khai triển theo cơ sở, ma trận toán tử; [[12-generalized-uncertainty|12. Nguyên lý bất định tổng quát]] — compatible observables, suy biến; [[08-hydrogen-atom|08. Nguyên tử Hydrogen]] — mức năng lượng $E_n$, số lượng tử.
> **Objectives**:
> - Hiểu tư tưởng của lý thuyết nhiễu loạn: khai triển theo tham số nhỏ $\lambda$
> - Tính hiệu chỉnh bậc 1 và bậc 2 cho năng lượng (non-degenerate case)
> - Tính hiệu chỉnh bậc 1 cho hàm sóng
> - Xử lý trường hợp **suy biến** (degenerate perturbation theory) — diagonalize trong degenerate subspace
> - Áp dụng cho: fine structure của Hydrogen, hiệu ứng Stark (electric field), hiệu ứng Zeeman (magnetic field)

---

## Motivation

Trong thực tế, hầu hết bài toán QM không có nghiệm giải tích chính xác. Lý thuyết nhiễu loạn (perturbation theory) là công cụ quan trọng nhất để xử lý tình huống này: khi Hamiltonian có thể viết dưới dạng một phần "giải được" cộng với một phần "nhỏ":

$$\hat{H} = \hat{H}^0 + \lambda\hat{H}'$$

trong đó $\hat{H}^0$ có nghiệm chính xác đã biết, $\lambda\hat{H}'$ là nhiễu loạn nhỏ ($\lambda \ll 1$), và ta tìm nghiệm dưới dạng **khai triển chuỗi lũy thừa** theo $\lambda$.

Từ nhiễu loạn bé có thể giải nhiều bài toán quan trọng: cấu trúc tinh của nguyên tử (spin-orbit coupling), hiệu ứng Stark và Zeeman, phân tử hai nguyên tử, và toàn bộ hóa học lượng tử.

---

## Physical Model

### Bài toán nhiễu loạn — Cấu trúc

Giả sử $\hat{H}^0$ đã được giải: $\hat{H}^0\ket{n^0} = E_n^0\ket{n^0}$, các ket $\{\ket{n^0}\}$ tạo cơ sở trực chuẩn hoàn chỉnh.

Bài toán thực: $\hat{H}\ket{n} = E_n\ket{n}$ với $\hat{H} = \hat{H}^0 + \lambda\hat{H}'$.

Khai triển theo $\lambda$:

$$E_n = E_n^0 + \lambda E_n^1 + \lambda^2 E_n^2 + \cdots$$

$$\ket{n} = \ket{n^0} + \lambda\ket{n^1} + \lambda^2\ket{n^2} + \cdots$$

---

## Mathematical Formalism

### Non-degenerate Perturbation Theory

Thế khai triển vào $\hat{H}\ket{n} = E_n\ket{n}$ và thu thập theo lũy thừa của $\lambda$:

**Bậc 0:** $\hat{H}^0\ket{n^0} = E_n^0\ket{n^0}$ ✓ (đã biết)

**Bậc 1:** $\hat{H}^0\ket{n^1} + \hat{H}'\ket{n^0} = E_n^0\ket{n^1} + E_n^1\ket{n^0}$

Chiếu lên $\bra{n^0}$ (dùng $\bra{n^0}\hat{H}^0 = E_n^0\bra{n^0}$):

$$E_n^0\braket{n^0|n^1} + \bra{n^0}\hat{H}'\ket{n^0} = E_n^0\braket{n^0|n^1} + E_n^1$$

> [!definition] Definition 13.1 — Hiệu chỉnh năng lượng bậc 1
>
> $$\boxed{E_n^1 = \bra{n^0}\hat{H}'\ket{n^0} = \langle\hat{H}'\rangle_n}$$
>
> Hiệu chỉnh bậc 1 là **giá trị kỳ vọng của nhiễu loạn** trong trạng thái không nhiễu.

Chiếu lên $\bra{m^0}$ ($m \neq n$) để tìm $\ket{n^1}$:

$$\bra{m^0}\hat{H}'\ket{n^0} = (E_n^0 - E_m^0)\braket{m^0|n^1}$$

Khai triển $\ket{n^1} = \sum_{m \neq n} c_m\ket{m^0}$, $c_m = \braket{m^0|n^1}$:

> [!definition] Definition 13.2 — Hiệu chỉnh hàm sóng bậc 1
>
> $$\ket{n^1} = \sum_{m \neq n} \frac{\bra{m^0}\hat{H}'\ket{n^0}}{E_n^0 - E_m^0}\ket{m^0}$$

**Bậc 2:** Chiếu phương trình bậc 2 lên $\bra{n^0}$:

> [!definition] Definition 13.3 — Hiệu chỉnh năng lượng bậc 2
>
> $$\boxed{E_n^2 = \sum_{m \neq n}\frac{|\bra{m^0}\hat{H}'\ket{n^0}|^2}{E_n^0 - E_m^0}}$$

**Nhận xét quan trọng:**

- $E_n^2$ tính được **hoàn toàn từ $E_n^1$** của các bậc trên — ta không cần $\ket{n^2}$.
- Các mức nằm **gần** ($E_m^0 \approx E_n^0$) đóng góp lớn nhất vào bậc 2.
- Trạng thái cơ bản ($n=0$): $E_0^2 \leq 0$ (tất cả mẫu số âm) → nhiễu loạn luôn **hạ thấp** năng lượng ground state.

### Degenerate Perturbation Theory

Khi $E_m^0 = E_n^0$ (mẫu số = 0), công thức bậc 1 cho $\ket{n^1}$ **phát sinh kỳ dị** (diverges). Cần xử lý đặc biệt.

**Ý tưởng**: Trong degenerate subspace $\mathcal{D}$ (tập tất cả ket có cùng $E_n^0$), bất kỳ tổ hợp tuyến tính nào cũng là eigenstate của $\hat{H}^0$. Ta phải chọn **đúng tổ hợp** ("good states") sao cho ma trận của $\hat{H}'$ trong $\mathcal{D}$ là **đường chéo**.

> [!definition] Definition 13.4 — Degenerate Perturbation Theory
>
> Với degenerate subspace $\mathcal{D}$ (chiều $d$):
>
> 1. Xây dựng ma trận $W_{ij} = \bra{i^0}\hat{H}'\ket{j^0}$ với $\ket{i^0}, \ket{j^0} \in \mathcal{D}$.
> 2. Chéo hóa ma trận $W$ — trị riêng là các $E_n^1$, hàm riêng là "good states".
> 3. Dùng "good states" làm cơ sở cho khai triển nhiễu loạn tiếp theo.

Nếu $W$ là đường chéo trong cơ sở ban đầu ($W_{ij} = 0$ với $i \neq j$), thì cơ sở ban đầu đã là "good states" — không cần chéo hóa thêm.

---

## Derivation — Ứng dụng

### Ứng dụng 1: Hiệu ứng Stark — Hydrogen trong điện trường

Nguyên tử Hydrogen đặt trong điện trường đều $\mathbf{E} = E_0\hat{z}$. Nhiễu loạn:

$$\hat{H}' = eE_0 z = eE_0 r\cos\theta$$

**Bậc 1** cho trạng thái cơ bản $n = 1$:

$$E_1^1 = \bra{100}eE_0 r\cos\theta\ket{100}$$

Do $\psi_{100}$ là hàm chẵn và $\cos\theta$ là hàm lẻ dưới phép đối xứng $z \to -z$, tích phân bằng 0:

$$E_1^1 = 0$$

Phải tính bậc 2 — kết quả là $E_1^2 \propto -E_0^2$ (hiệu ứng Stark bậc 2, polarizability).

**Mức $n = 2$** có 4 trạng thái suy biến: $\ket{200}, \ket{211}, \ket{210}, \ket{21{-1}}$. Xây dựng ma trận $W$ trong subspace này. Phần tử duy nhất khác 0 (từ quy tắc chọn lọc $\Delta l = \pm 1$, $\Delta m = 0$):

$$W = \bra{200}eE_0 r\cos\theta\ket{210} = -3eE_0 a_0$$

Ma trận $W$ trong cơ sở $\{\ket{200},\ket{210},\ket{211},\ket{21{-1}}\}$:

$$W = \begin{pmatrix}0 & -3eE_0 a_0 & 0 & 0 \\ -3eE_0 a_0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0\end{pmatrix}$$

Trị riêng: $E^1 = \pm 3eE_0 a_0$ (hai lần), $0$ (hai lần). Mức suy biến bậc 4 tách thành **ba mức** dưới tác dụng điện trường — **hiệu ứng Stark tuyến tính** cho $n = 2$.

### Ứng dụng 2: Fine Structure của Hydrogen

Hiệu chỉnh tương đối tính (relativistic correction) và spin-orbit coupling cho Hydrogen. Nhiễu loạn:

$$\hat{H}' = \hat{H}'_\text{rel} + \hat{H}'_{SO}$$

$$\hat{H}'_\text{rel} = -\frac{\hat{p}^4}{8m^3c^2}, \qquad \hat{H}'_{SO} = \frac{e^2}{8\pi\epsilon_0}\frac{1}{m^2c^2 r^3}\hat{L}\cdot\hat{S}$$

Kết quả (dùng degenerate PT với $j = l \pm 1/2$):

$$E_{nj}^1 = -\frac{(E_n^0)^2}{2mc^2}\left(\frac{4n}{j+1/2} - 3\right)$$

Fine structure nhỏ hơn mức Bohr một hệ số $\alpha^2 \approx (1/137)^2 \sim 10^{-4}$ (với $\alpha$ là hằng số cấu trúc tinh).

---

## Worked Problem

> [!example] Bài toán 13.1 — QHO nhiễu loạn
>
> Xét QHO với nhiễu loạn $\hat{H}' = \epsilon\hat{x}^3$. Tính $E_n^1$ và $E_n^2$ đến bậc 2.

**Lời giải:**

**Bậc 1:** $E_n^1 = \bra{n}\epsilon\hat{x}^3\ket{n}$.

Viết $\hat{x} = \sqrt{\hbar/2m\omega}(\hat{a}_+ + \hat{a}_-)$, suy ra $\hat{x}^3 \propto (\hat{a}_+ + \hat{a}_-)^3$.

Khai triển $(\hat{a}_+ + \hat{a}_-)^3$ và nhận thấy tất cả số hạng thay đổi $n$ đi $\pm 1$ hoặc $\pm 3$ — không có số hạng bảo toàn $n$. Do đó $\bra{n}(\hat{a}_++\hat{a}_-)^3\ket{n} = 0$:

$$E_n^1 = 0$$

**Bậc 2:** Chỉ các số hạng $\ket{m} = \ket{n\pm 1}$ và $\ket{n\pm 3}$ đóng góp (vì $\hat{x}^3$ thay đổi $n$ đi $\pm 1, \pm 3$).

Dùng $\hat{x}^3 = \left(\frac{\hbar}{2m\omega}\right)^{3/2}(\hat{a}_++\hat{a}_-)^3$ và tính các matrix elements:

$$\bra{n+1}\hat{x}^3\ket{n} = 3\left(\frac{\hbar}{2m\omega}\right)^{3/2}(n+1)\sqrt{n+1}$$

Sau khi tính đầy đủ:

$$E_n^2 = -\frac{11\epsilon^2\hbar^2}{4m^3\omega^4}\left(n^2 + n + \frac{11}{30}\right)$$

(Kết quả chuẩn từ Griffiths Problem 6.21.) Đây là hiệu chỉnh **âm** và **tăng theo $n$** — các mức cao bị hạ thấp nhiều hơn.

> [!example] Bài toán 13.2 — Hiệu ứng Zeeman yếu (Weak-field Zeeman)
>
> Nguyên tử Hydrogen trong từ trường yếu $\mathbf{B} = B\hat{z}$. Nhiễu loạn $\hat{H}' = \frac{e}{2m}(\hat{L}_z + 2\hat{S}_z)B$. Tính hiệu chỉnh năng lượng cho các trạng thái $n = 2$.

**Lời giải:**

Với từ trường yếu, fine structure $\gg$ Zeeman, nên cơ sở "good" là $\ket{n,l,j,m_j}$ (eigenstates của $\hat{J}^2$, $\hat{J}_z$ với $\mathbf{J} = \mathbf{L} + \mathbf{S}$).

$$E^1 = \frac{eB}{2m}\bra{n,l,j,m_j}(\hat{L}_z + 2\hat{S}_z)\ket{n,l,j,m_j} = \frac{eB}{2m}g_J m_j\hbar$$

Trong đó $g_J$ là **Landé g-factor**:

$$g_J = 1 + \frac{j(j+1) + s(s+1) - l(l+1)}{2j(j+1)}$$

Với $n = 2$, $l = 1$, $j = 3/2$: $g_J = 4/3$. Với $j = 1/2$: $g_J = 2/3$. Mỗi mức $j$ tách thành $2j+1$ mức cách đều — **hiệu ứng Zeeman bất thường** (anomalous Zeeman effect), giờ được giải thích hoàn toàn.

---

## Summary

- **TIPT bậc 1**: $E_n^1 = \bra{n^0}\hat{H}'\ket{n^0}$ — giá trị kỳ vọng của nhiễu loạn.
- **TIPT bậc 2**: $E_n^2 = \sum_{m\neq n}|\bra{m^0}\hat{H}'\ket{n^0}|^2/(E_n^0 - E_m^0)$ — luôn âm cho ground state.
- **Hiệu chỉnh hàm sóng bậc 1**: $\ket{n^1} = \sum_{m\neq n}\frac{\bra{m^0}\hat{H}'\ket{n^0}}{E_n^0-E_m^0}\ket{m^0}$ — "pha trộn" các trạng thái lân cận.
- **Degenerate PT**: xây dựng và chéo hóa ma trận $W$ trong degenerate subspace → "good states".
- Ứng dụng: Stark effect (điện trường tách mức suy biến), fine structure (relativistic + spin-orbit), Zeeman effect (từ trường tách mức với Landé $g$-factor).

---

## References

- Griffiths — *Introduction to Quantum Mechanics*, 2nd ed., Ch. 6
- MIT OCW 8.06 (Spring 2016) — Perturbation theory: Stark, fine structure, Zeeman
- Shankar — *Principles of Quantum Mechanics*, 2nd ed., Ch. 17
- Sakurai — *Modern Quantum Mechanics*, 2nd ed., Ch. 5.1–5.3
