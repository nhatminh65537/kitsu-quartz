---
title: "10. Dirac Notation and Hilbert Space"
tags: [physics, quantum-mechanics, lesson-10]
aliases: [Ký hiệu Dirac và không gian Hilbert]
created: 2026-03-27
---

> **Prerequisites**: Lessons 01–09 — đặc biệt L03 (trạng thái dừng, trực giao), L04 (toán tử Hermitian), L05 (khai triển $c_n$), L09 (spin, spinors).
> **Objectives**:
> - Hiểu không gian Hilbert là khung toán học thống nhất của QM
> - Thành thạo ký hiệu Dirac: ket $\ket{\psi}$, bra $\bra{\psi}$, inner product $\braket{\phi|\psi}$
> - Biểu diễn toán tử dưới dạng ma trận trong cơ sở bất kỳ
> - Hiểu sự thay đổi cơ sở (change of basis) và tính hoàn chỉnh (completeness)
> - Phát biểu lại toàn bộ QM trong ngôn ngữ Dirac — thống nhất sóng cơ học và ma trận cơ học

---

## Motivation

Đến đây, ta đã gặp QM dưới hai hình thức khác nhau: **sóng cơ học** (wave mechanics) của Schrödinger — hàm sóng $\psi(x)$, tích phân, ODE; và **ma trận cơ học** (matrix mechanics) — spinors cột, ma trận Pauli, nhân ma trận.

Năm 1930, Paul Dirac nhận ra cả hai chỉ là **hai biểu diễn của cùng một cấu trúc toán học trừu tượng**: không gian Hilbert. Ký hiệu bra-ket của ông cho phép viết các phương trình QM theo cách **hoàn toàn độc lập với biểu diễn** — rồi chọn biểu diễn phù hợp tùy theo bài toán.

Đây là bước trưởng thành của QM: từ bài toán cụ thể sang cấu trúc toán học trừu tượng.

---

## Physical Model

### Không gian Hilbert

> [!definition] Definition 10.1 — Không gian Hilbert (Hilbert Space)
>
> **Không gian Hilbert** $\mathcal{H}$ là không gian vector phức với tích vô hướng (inner product), **đầy đủ** (complete). Trong QM, mỗi trạng thái vật lý tương ứng với một vector đơn vị trong $\mathcal{H}$ — gọi là **ket** và ký hiệu $\ket{\psi}$.
>
> Ví dụ về Hilbert space trong QM:
>
> | Hệ vật lý | Hilbert space | Chiều |
> |-----------|--------------|-------|
> | Spin $1/2$ | $\mathbb{C}^2$ | 2 |
> | Hạt trong hộp vô hạn | $L^2([0,a])$ | $\infty$ (đếm được) |
> | Hạt tự do | $L^2(\mathbb{R})$ | $\infty$ (liên tục) |

---

## Mathematical Formalism

### Ký hiệu Dirac

> [!definition] Definition 10.2 — Bra, Ket, và Inner Product
>
> **Ket** $\ket{\psi}$: vector trạng thái trong $\mathcal{H}$ — phần tử của không gian vector.
>
> **Bra** $\bra{\psi}$: phần tử của không gian đối ngẫu $\mathcal{H}^*$ — ánh xạ tuyến tính $\mathcal{H} \to \mathbb{C}$.
>
> **Inner product** (tích vô hướng):
>
> $$\braket{\phi|\psi} \in \mathbb{C}$$
>
> Tính chất: $\braket{\phi|\psi} = \braket{\psi|\phi}^*$, $\braket{\psi|\psi} \geq 0$ (bằng 0 chỉ khi $\ket{\psi} = 0$).
>
> **Chuẩn** (norm): $\|\ket{\psi}\| = \sqrt{\braket{\psi|\psi}}$.

### Kết nối với sóng cơ học

Trong biểu diễn vị trí (position representation):

$$\braket{x|\psi} = \psi(x) \quad \text{(hàm sóng)}$$

$$\braket{\phi|\psi} = \int_{-\infty}^{+\infty}\phi^*(x)\psi(x)\,dx \quad \text{(inner product = tích phân chồng chất)}$$

Trong biểu diễn spin:

$$\ket{+} = \begin{pmatrix}1\\0\end{pmatrix}, \quad \ket{-} = \begin{pmatrix}0\\1\end{pmatrix}, \quad \braket{+|-} = 0, \quad \braket{+|+} = 1$$

### Toán tử, hàm riêng, và phổ

> [!definition] Definition 10.3 — Toán tử tuyến tính và Hermitian
>
> **Toán tử** $\hat{Q}: \mathcal{H} \to \mathcal{H}$ là tuyến tính nếu $\hat{Q}(\alpha\ket{\psi} + \beta\ket{\phi}) = \alpha\hat{Q}\ket{\psi} + \beta\hat{Q}\ket{\phi}$.
>
> **Hermitian conjugate** (liên hợp Hermitian): $\hat{Q}^\dagger$ được định nghĩa bởi:
>
> $$\bra{\phi}\hat{Q}^\dagger\ket{\psi} = \bra{\psi}\hat{Q}\ket{\phi}^*$$
>
> **Observable**: toán tử Hermitian $\hat{Q} = \hat{Q}^\dagger$.
>
> **Eigenvalue equation**: $\hat{Q}\ket{q} = q\ket{q}$, với $q \in \mathbb{R}$ (vì $\hat{Q}$ Hermitian) và $\ket{q}$ là eigenstate.

> [!theorem] Theorem 10.4 — Spectral Theorem (dạng vật lý)
> Mọi observable Hermitian $\hat{Q}$ có một tập hàm riêng $\{\ket{q_n}\}$ tạo thành **cơ sở trực chuẩn hoàn chỉnh** của $\mathcal{H}$:
>
> $$\braket{q_m|q_n} = \delta_{mn}, \qquad \sum_n \ket{q_n}\bra{q_n} = \hat{I}$$
>
> Quan hệ thứ hai gọi là **điều kiện hoàn chỉnh** (completeness relation) hay **resolution of identity**.

### Khai triển theo cơ sở

Bất kỳ trạng thái nào đều viết được dưới dạng:

$$\ket{\psi} = \sum_n c_n\ket{q_n}, \qquad c_n = \braket{q_n|\psi}$$

Trong biểu diễn vị trí: $c_n = \braket{q_n|\psi} = \int q_n^*(x)\psi(x)\,dx$ — đây chính là công thức tính $c_n$ từ Lesson 05!

**Xác suất** đo được $q_n$: $P(q_n) = |c_n|^2 = |\braket{q_n|\psi}|^2$.

**Giá trị kỳ vọng**: $\langle\hat{Q}\rangle = \bra{\psi}\hat{Q}\ket{\psi} = \sum_n |c_n|^2 q_n$.

### Toán tử dạng ma trận

Khi chọn cơ sở $\{\ket{e_n}\}$, toán tử $\hat{Q}$ được biểu diễn bởi ma trận:

> [!definition] Definition 10.5 — Ma trận của toán tử
>
> $$Q_{mn} = \bra{e_m}\hat{Q}\ket{e_n} \quad \text{(matrix element)}$$
>
> Tác dụng $\hat{Q}\ket{\psi}$:
>
> $$(\hat{Q}\ket{\psi})_m = \sum_n Q_{mn} c_n \quad \text{(nhân ma trận với vector cột)}$$

**Ví dụ**: $\hat{S}_z$ trong cơ sở $\{\ket{+},\ket{-}\}$:

$$S_{z,11} = \bra{+}\hat{S}_z\ket{+} = +\frac{\hbar}{2}, \quad S_{z,22} = \bra{-}\hat{S}_z\ket{-} = -\frac{\hbar}{2}, \quad S_{z,12} = S_{z,21} = 0$$

$$\hat{S}_z \leftrightarrow \frac{\hbar}{2}\begin{pmatrix}1 & 0 \\ 0 & -1\end{pmatrix} = \frac{\hbar}{2}\sigma_z \quad \checkmark$$

### Thay đổi cơ sở (Change of Basis)

Chuyển từ cơ sở $\{\ket{e_n}\}$ sang $\{\ket{f_n}\}$ qua ma trận unitary $U$:

$$U_{mn} = \braket{f_m|e_n}, \qquad UU^\dagger = U^\dagger U = \hat{I}$$

Toán tử $\hat{Q}$ biến đổi: $Q' = UQU^\dagger$.

---

## Derivation

### Diagonalization — Phổ trong cơ sở riêng

> [!theorem] Theorem 10.6 — Diagonalization
> Trong cơ sở của các hàm riêng $\{\ket{q_n}\}$, ma trận của $\hat{Q}$ là **ma trận đường chéo**:
>
> $$Q_{mn} = \bra{q_m}\hat{Q}\ket{q_n} = q_n\braket{q_m|q_n} = q_n\delta_{mn}$$

**Ý nghĩa**: Tìm phổ của $\hat{Q}$ = chéo hóa ma trận $Q$. Điều này kết nối trực tiếp QM với đại số tuyến tính: **eigenvalues của ma trận = kết quả đo lường có thể xảy ra**.

### Ký hiệu Dirac tóm gọn toàn bộ QM

| Khái niệm | Ngôn ngữ sóng cơ học | Ngôn ngữ Dirac |
|-----------|---------------------|----------------|
| Trạng thái | $\psi(x)$ | $\ket{\psi}$ |
| Inner product | $\int\phi^*\psi\,dx$ | $\braket{\phi\|\psi}$ |
| Chuẩn hóa | $\int\|\psi\|^2 dx = 1$ | $\braket{\psi\|\psi} = 1$ |
| Eigenvalue eq. | $\hat{Q}\psi = q\psi$ | $\hat{Q}\ket{q} = q\ket{q}$ |
| Khai triển | $\psi = \sum c_n\psi_n$ | $\ket{\psi} = \sum c_n\ket{q_n}$ |
| Hệ số | $c_n = \int\psi_n^*\psi\,dx$ | $c_n = \braket{q_n\|\psi}$ |
| Kỳ vọng | $\int\psi^*\hat{Q}\psi\,dx$ | $\bra{\psi}\hat{Q}\ket{\psi}$ |
| Completeness | $\sum_n\psi_n(x)\psi_n^*(x') = \delta(x-x')$ | $\sum_n\ket{q_n}\bra{q_n} = \hat{I}$ |

---

### Continuous spectrum — Eigenstates không chuẩn hóa được

Với toán tử $\hat{x}$ hay $\hat{p}$, phổ là liên tục. Hàm riêng **không nằm trong $L^2(\mathbb{R})$** — không chuẩn hóa được theo nghĩa thông thường.

**Hàm riêng của $\hat{x}$** với trị riêng $x'$: $\braket{x|x'} = \delta(x - x')$ (Dirac delta).

**Hàm riêng của $\hat{p}$** với trị riêng $p$: $\braket{x|p} = \frac{1}{\sqrt{2\pi\hbar}}e^{ipx/\hbar}$.

**Completeness liên tục:**

$$\int_{-\infty}^{+\infty}\ket{x}\bra{x}\,dx = \hat{I}, \qquad \int_{-\infty}^{+\infty}\ket{p}\bra{p}\,dp = \hat{I}$$

**Khai triển liên tục** (thay $\sum$ bằng $\int$):

$$\ket{\psi} = \int\psi(x)\ket{x}\,dx, \qquad \ket{\psi} = \int\tilde{\psi}(p)\ket{p}\,dp$$

Trong đó $\tilde{\psi}(p) = \braket{p|\psi} = \frac{1}{\sqrt{2\pi\hbar}}\int\psi(x)e^{-ipx/\hbar}\,dx$ là **biến đổi Fourier** của $\psi(x)$ — liên kết biểu diễn vị trí và biểu diễn động lượng.

---

## Worked Problem

> [!example] Bài toán 10.1 — Biểu diễn ma trận của $\hat{S}_x$ và tìm hàm riêng
>
> Tìm hàm riêng và trị riêng của $\hat{S}_x$ trong cơ sở $\{\ket{+},\ket{-}\}$.

**Lời giải:**

Ma trận của $\hat{S}_x$: tính $S_{x,mn} = \bra{e_m}\hat{S}_x\ket{e_n}$. Dùng $\hat{S}_x = \frac{1}{2}(\hat{S}_+ + \hat{S}_-)$ và $\hat{S}_+\ket{-} = \hbar\ket{+}$, $\hat{S}_-\ket{+} = \hbar\ket{-}$:

$$\hat{S}_x \leftrightarrow \frac{\hbar}{2}\begin{pmatrix}0&1\\1&0\end{pmatrix}$$

Phương trình eigenvalue $\det(\hat{S}_x - \lambda I) = 0$:

$$\det\begin{pmatrix}-\lambda & \hbar/2 \\ \hbar/2 & -\lambda\end{pmatrix} = \lambda^2 - \frac{\hbar^2}{4} = 0 \implies \lambda = \pm\frac{\hbar}{2}$$

**Eigenvectors:**

Với $\lambda = +\hbar/2$: $\begin{pmatrix}-1&1\\1&-1\end{pmatrix}\begin{pmatrix}a\\b\end{pmatrix} = 0$ → $a = b$ → $\ket{+}_x = \frac{1}{\sqrt{2}}\begin{pmatrix}1\\1\end{pmatrix}$

Với $\lambda = -\hbar/2$: $a = -b$ → $\ket{-}_x = \frac{1}{\sqrt{2}}\begin{pmatrix}1\\-1\end{pmatrix}$

> [!example] Bài toán 10.2 — Xác suất từ khai triển Dirac
>
> Electron ở trạng thái $\ket{\psi} = \frac{3}{5}\ket{+} + \frac{4}{5}i\ket{-}$. Tính xác suất đo $S_z = +\hbar/2$ và $S_z = -\hbar/2$; tính $\langle S_z\rangle$.

**Lời giải:**

$P(+\hbar/2) = |\braket{+|\psi}|^2 = |3/5|^2 = 9/25$.

$P(-\hbar/2) = |\braket{-|\psi}|^2 = |4i/5|^2 = 16/25$.

Kiểm tra: $9/25 + 16/25 = 1$ ✓

$$\langle S_z\rangle = \frac{9}{25}\cdot\frac{\hbar}{2} + \frac{16}{25}\cdot\left(-\frac{\hbar}{2}\right) = \frac{\hbar}{2}\cdot\frac{9-16}{25} = -\frac{7\hbar}{50}$$

> [!example] Bài toán 10.3 — Completeness và khai triển Fourier
>
> Chứng minh rằng completeness relation $\int\ket{x}\bra{x}\,dx = \hat{I}$ dẫn đến công thức Fourier ngược.

**Lời giải:**

Tác dụng $\int\ket{x}\bra{x}\,dx$ lên ket $\ket{p}$:

$$\int\ket{x}\bra{x}\ket{p}\,dx = \int\braket{x|p}\ket{x}\,dx = \int\frac{e^{ipx/\hbar}}{\sqrt{2\pi\hbar}}\ket{x}\,dx$$

Tác dụng $\bra{x'}$ lên hai vế:

$$\braket{x'|p} = \int\frac{e^{ipx/\hbar}}{\sqrt{2\pi\hbar}}\braket{x'|x}\,dx = \int\frac{e^{ipx/\hbar}}{\sqrt{2\pi\hbar}}\delta(x'-x)\,dx = \frac{e^{ipx'/\hbar}}{\sqrt{2\pi\hbar}}$$

Điều này nhất quán với định nghĩa $\braket{x|p}$. Tổng quát hơn, từ $\ket{\psi} = \int\ket{p}\braket{p|\psi}\,dp$:

$$\psi(x) = \braket{x|\psi} = \int\braket{x|p}\braket{p|\psi}\,dp = \frac{1}{\sqrt{2\pi\hbar}}\int e^{ipx/\hbar}\tilde\psi(p)\,dp$$

Đây chính xác là **công thức Fourier ngược** — khai triển hàm sóng theo sóng phẳng. Completeness trong không gian Hilbert = định lý Parseval-Plancherel trong giải tích Fourier.

---

## Summary

- **Không gian Hilbert** $\mathcal{H}$: không gian vector phức với inner product — khung thống nhất của QM.
- **Ket** $\ket{\psi}$: trạng thái; **bra** $\bra{\psi}$: phần tử đối ngẫu; **braket** $\braket{\phi|\psi}$: inner product.
- **Observable** = toán tử Hermitian; trị riêng thực, hàm riêng tạo cơ sở trực chuẩn.
- **Completeness**: $\sum_n\ket{q_n}\bra{q_n} = \hat{I}$ (rời rạc) hay $\int\ket{q}\bra{q}\,dq = \hat{I}$ (liên tục).
- **Khai triển**: $\ket{\psi} = \sum c_n\ket{q_n}$, $c_n = \braket{q_n|\psi}$, $P(q_n) = |c_n|^2$.
- **Ma trận toán tử**: $Q_{mn} = \bra{e_m}\hat{Q}\ket{e_n}$ — tìm phổ = chéo hóa ma trận.
- Biểu diễn vị trí ($\braket{x|\psi} = \psi(x)$) và biểu diễn động lượng ($\braket{p|\psi} = \tilde\psi(p)$) liên hệ qua Fourier transform.

---

## References

- Griffiths — *Introduction to Quantum Mechanics*, 2nd ed., Ch. 3
- Dirac, P.A.M. — *The Principles of Quantum Mechanics*, 4th ed. (1958) — tác phẩm gốc
- MIT OCW 8.05 (Fall 2013) — Zwiebach: Dirac notation, Hilbert space, operators
- Shankar — *Principles of Quantum Mechanics*, 2nd ed., Ch. 1 (toàn bộ hình thức luận)
- Sakurai — *Modern Quantum Mechanics*, Ch. 1.2–1.4
