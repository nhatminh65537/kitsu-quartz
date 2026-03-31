---
title: "A0. Quantum Mechanics Deeper"
tags: [physics, semiconductor, device-physics, appendix]
aliases: [Quantum Mechanics Deeper]
created: 2026-03-27
---

> **Dành cho**: Người muốn hiểu sâu hơn nền tảng lượng tử sau khi đọc [[02-quantum-mechanics-primer|02. Quantum Mechanics Primer]]
> **Nội dung**: Schrödinger equation đầy đủ, particle in a box với tính toán chi tiết, harmonic oscillator, quantum tunneling

---

## A0.1 — Schrödinger Equation Đầy Đủ

### Dạng phụ thuộc thời gian

Phương trình Schrödinger tổng quát:

$$i\hbar\frac{\partial\Psi(\mathbf{r},t)}{\partial t} = \hat{H}\Psi(\mathbf{r},t)$$

với Hamiltonian operator trong 3D:

$$\hat{H} = -\frac{\hbar^2}{2m}\nabla^2 + V(\mathbf{r},t)$$

$\nabla^2 = \frac{\partial^2}{\partial x^2} + \frac{\partial^2}{\partial y^2} + \frac{\partial^2}{\partial z^2}$ là Laplacian operator.

### Tách biến — Dạng phụ thuộc thời gian rút gọn

Khi $V$ không phụ thuộc thời gian: $\Psi(\mathbf{r},t) = \psi(\mathbf{r})\cdot e^{-iEt/\hbar}$

Thay vào → phương trình Schrödinger dừng (time-independent):

$$\hat{H}\psi(\mathbf{r}) = E\psi(\mathbf{r})$$

$$-\frac{\hbar^2}{2m}\nabla^2\psi + V(\mathbf{r})\psi = E\psi$$

Đây là **eigenvalue problem**: tìm các giá trị $E$ (eigenvalue) và $\psi$ (eigenfunction) hợp lệ.

**Điều kiện biên cho $\psi$ hợp lệ:**
1. Liên tục ($\psi$ và $d\psi/dx$ liên tục)
2. Normalizable: $\int|\psi|^2 dV = 1$
3. Single-valued (chỉ có một giá trị tại mỗi điểm)

---

## A0.2 — Particle in a Box: Tính Toán Đầy Đủ

### 1D — Hộp có chiều dài $L$

**Setup**: $V = 0$ với $0 \leq x \leq L$; $V = \infty$ bên ngoài.

**Điều kiện biên**: $\psi(0) = \psi(L) = 0$ (hàm sóng = 0 tại tường vô hạn).

**Giải phương trình bên trong** ($V = 0$):

$$-\frac{\hbar^2}{2m}\frac{d^2\psi}{dx^2} = E\psi$$

$$\frac{d^2\psi}{dx^2} = -k^2\psi \quad \text{với } k = \sqrt{\frac{2mE}{\hbar^2}}$$

Nghiệm tổng quát: $\psi(x) = A\sin(kx) + B\cos(kx)$

**Áp điều kiện biên:**

$\psi(0) = 0$: $B = 0$ → $\psi(x) = A\sin(kx)$

$\psi(L) = 0$: $\sin(kL) = 0$ → $kL = n\pi$ với $n = 1, 2, 3, \ldots$

**Eigenvalue năng lượng:**

$$k_n = \frac{n\pi}{L} \Rightarrow E_n = \frac{\hbar^2 k_n^2}{2m} = \frac{n^2\pi^2\hbar^2}{2mL^2} = \frac{n^2h^2}{8mL^2}$$

**Chuẩn hóa ($\int_0^L|\psi|^2 dx = 1$):**

$$A^2\int_0^L\sin^2\!\left(\frac{n\pi x}{L}\right)dx = A^2\frac{L}{2} = 1 \Rightarrow A = \sqrt{\frac{2}{L}}$$

**Hàm sóng hoàn chỉnh:**

$$\psi_n(x) = \sqrt{\frac{2}{L}}\sin\left(\frac{n\pi x}{L}\right), \quad E_n = \frac{n^2h^2}{8mL^2}$$

### Ví dụ số: Quantum well trong GaAs

Với $L = 10$ nm, $m^* = 0.067m_e$ (GaAs):

$$E_1 = \frac{h^2}{8m^*L^2} = \frac{(6.626\times10^{-34})^2}{8\times0.067\times9.11\times10^{-31}\times(10^{-8})^2} = 56 \text{ meV}$$

$$E_2 = 4E_1 = 224 \text{ meV}, \quad E_2 - E_1 = 168 \text{ meV}$$

Photon phát ra khi electron chuyển từ $E_2$ xuống $E_1$: $\lambda = hc/(E_2-E_1) \approx 7.4$ µm (hồng ngoại trung).

---

## A0.3 — Quantum Tunneling

Một hạt với năng lượng $E < V_0$ gặp rào thế $V_0$ có chiều dày $d$:

Theo vật lý cổ điển: hạt **không thể** vượt qua. Theo QM: có xác suất hữu hạn để hạt **xuyên qua** (tunnel).

**Xác suất tunnel:**

$$T \approx e^{-2\kappa d} \quad \text{với } \kappa = \sqrt{\frac{2m(V_0-E)}{\hbar^2}}$$

**Ứng dụng trong semiconductor:**

- **Gate oxide leakage**: electron tunnel qua SiO₂ khi oxide quá mỏng ($t_{ox} < 1.5$ nm) → lý do cần high-k dielectric
- **Esaki (tunnel) diode**: dùng tunneling qua depletion region siêu mỏng → dòng âm điện trở
- **Flash memory**: electron tunnel qua floating gate oxide để ghi dữ liệu (Fowler-Nordheim tunneling)
- **STM** (Scanning Tunneling Microscope): đo dòng tunnel để lập bản đồ bề mặt nguyên tử

---

## A0.4 — Từ Particle-in-a-Box đến Band Theory

Khi ghép $N$ hộp lại (mô hình 1D tinh thể đơn giản — Kronig-Penney model):

- Mỗi hộp cho phép các giá trị $k_n$ rời rạc
- Khi hộp tiếp xúc nhau, các hàm sóng tương tác
- Kết quả: các mức rời rạc tập hợp thành **dải liên tục (band)**
- Giữa các dải: **band gap** do tán xạ Bragg tại biên Brillouin zone

Đây là sự kết nối đầy đủ giữa QM cơ bản (particle in a box) và band theory của tinh thể thực.

---

## Tài liệu Tham khảo

- Griffiths, D. J. — *Introduction to Quantum Mechanics*, 3rd ed. (Cambridge, 2018)
- Feynman Lectures on Physics, Vol. 3 (feynmanlectures.caltech.edu)
- Pierret, R. F. — *Semiconductor Device Fundamentals*, Appendix A (Prentice Hall, 1995)
