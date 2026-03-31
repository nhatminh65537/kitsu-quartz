---
title: "A0. Mathematical Essentials for Quantum Mechanics"
tags: [physics, quantum-mechanics, appendix, math]
aliases: [Toán học thiết yếu cho QM]
created: 2026-03-28
---

> **Mục đích**: Reference sheet toán học — tra cứu nhanh khi gặp kỹ thuật lạ trong các lesson. Không cần đọc trước; đọc khi cần.

---

## 1. Số phức (Complex Numbers)

> [!definition] Các công thức cốt lõi
>
> **Dạng cực**: $z = re^{i\theta} = r(\cos\theta + i\sin\theta)$, $r = |z|$, $\theta = \arg z$.
>
> **Liên hợp phức**: $z^* = re^{-i\theta}$, $|z|^2 = zz^*$.
>
> **Euler**: $e^{i\theta} = \cos\theta + i\sin\theta$, $e^{-i\theta} = \cos\theta - i\sin\theta$.
>
> $$\cos\theta = \frac{e^{i\theta}+e^{-i\theta}}{2}, \qquad \sin\theta = \frac{e^{i\theta}-e^{-i\theta}}{2i}$$

---

## 2. Giải tích — Tích phân quan trọng

### Tích phân Gaussian

$$\int_{-\infty}^{+\infty} e^{-\alpha x^2}\,dx = \sqrt{\frac{\pi}{\alpha}}, \qquad \alpha > 0$$

$$\int_{-\infty}^{+\infty} x^2 e^{-\alpha x^2}\,dx = \frac{\sqrt{\pi}}{2\alpha^{3/2}}$$

$$\int_{-\infty}^{+\infty} x^{2n} e^{-\alpha x^2}\,dx = \frac{(2n-1)!!}{2^n\alpha^n}\sqrt{\frac{\pi}{\alpha}}$$

Với $n!! = n(n-2)(n-4)\cdots$ (double factorial). Tích phân số hạng lẻ $x^{2n+1}$ đều bằng 0 (hàm lẻ).

### Tích phân từng phần (Integration by Parts)

$$\int_a^b u\,dv = [uv]_a^b - \int_a^b v\,du$$

Với điều kiện biên $[uv]_{-\infty}^{+\infty} = 0$ (hàm sóng triệt tiêu ở vô cùng) — dùng rất nhiều khi chứng minh tính Hermitian và tính chuẩn hóa.

### Hàm delta Dirac

$$\delta(x) = \begin{cases}\infty & x=0 \\ 0 & x\neq 0\end{cases}, \qquad \int_{-\infty}^{+\infty}\delta(x)\,dx = 1$$

$$\int_{-\infty}^{+\infty} f(x)\delta(x-a)\,dx = f(a)$$

$$\delta(ax) = \frac{1}{|a|}\delta(x), \qquad \delta(f(x)) = \sum_i \frac{\delta(x-x_i)}{|f'(x_i)|}$$

**Biểu diễn Fourier**: $\delta(x) = \frac{1}{2\pi}\int_{-\infty}^{+\infty} e^{ikx}\,dk$.

---

## 3. Phương trình vi phân thường (ODE)

### ODE bậc hai tuyến tính với hệ số hằng

**Dạng $y'' + k^2 y = 0$** ($k$ thực):

$$y(x) = A\sin(kx) + B\cos(kx) = Ce^{ikx} + De^{-ikx}$$

Dùng khi: bên trong giếng thế năng, scattering states với $E > V$.

**Dạng $y'' - \kappa^2 y = 0$** ($\kappa$ thực, dương):

$$y(x) = Ae^{\kappa x} + Be^{-\kappa x}$$

Dùng khi: tunneling ($E < V$), bound states bên ngoài giếng.

**Dạng $y'' + 2\alpha y' + (\alpha^2 + \beta^2)y = 0$** (hệ dao động tắt dần):

$$y(x) = e^{-\alpha x}(A\cos\beta x + B\sin\beta x)$$

### Phương trình Hermite (QHO)

$$y'' - 2\xi y' + 2n\,y = 0, \quad \xi = \sqrt{m\omega/\hbar}\,x$$

Nghiệm đa thức (khi $n$ nguyên): đa thức Hermite $H_n(\xi)$.

$$H_0 = 1,\; H_1 = 2\xi,\; H_2 = 4\xi^2-2,\; H_3 = 8\xi^3-12\xi,\; H_4 = 16\xi^4-48\xi^2+12$$

**Hệ thức truy hồi**: $H_{n+1} = 2\xi H_n - 2n H_{n-1}$.

**Trực giao**: $\int_{-\infty}^{+\infty} e^{-\xi^2}H_m H_n\,d\xi = \sqrt{\pi}\,2^n n!\,\delta_{mn}$.

### Phương trình Laguerre liên kết (Hydrogen)

Xuất hiện trong phương trình hướng kính của Hydrogen. Đa thức Laguerre liên kết $L_p^q(x)$:

$$L_0^q = 1,\quad L_1^q = 1+q-x,\quad L_2^q = \frac{(q+2)(q+1)}{2} - (q+2)x + \frac{x^2}{2}$$

---

## 4. Đại số tuyến tính

### Ma trận và toán tử

**Hermitian conjugate**: $(A^\dagger)_{ij} = A_{ji}^*$ — chuyển vị rồi lấy liên hợp phức.

**Unitary**: $U^\dagger U = UU^\dagger = I$ — bảo toàn inner product.

**Chéo hóa** (diagonalization): $A = P D P^{-1}$ với $D$ đường chéo chứa eigenvalues, $P$ chứa eigenvectors theo cột. Với $A$ Hermitian: $P$ là unitary.

### Tích tensor (Tensor product)

$$(\ket{a}\otimes\ket{b})(\bra{c}\otimes\bra{d}) = \ket{a}\bra{c}\otimes\ket{b}\bra{d}$$

$$(A\otimes B)(\ket{u}\otimes\ket{v}) = (A\ket{u})\otimes(B\ket{v})$$

$$\dim(\mathcal{H}_A\otimes\mathcal{H}_B) = \dim\mathcal{H}_A\cdot\dim\mathcal{H}_B$$

### Trace

$$\text{Tr}(A) = \sum_i A_{ii} = \sum_i \lambda_i \quad \text{(tổng trị riêng)}$$

$$\text{Tr}(AB) = \text{Tr}(BA), \qquad \text{Tr}(A\otimes B) = \text{Tr}(A)\cdot\text{Tr}(B)$$

---

## 5. Biến đổi Fourier

> [!definition] Cặp biến đổi Fourier trong QM
>
> $$\tilde\psi(k) = \frac{1}{\sqrt{2\pi}}\int_{-\infty}^{+\infty}\psi(x)e^{-ikx}\,dx$$
>
> $$\psi(x) = \frac{1}{\sqrt{2\pi}}\int_{-\infty}^{+\infty}\tilde\psi(k)e^{ikx}\,dk$$
>
> Với $p = \hbar k$: $\tilde\psi(p) = \frac{1}{\sqrt{2\pi\hbar}}\int\psi(x)e^{-ipx/\hbar}\,dx$.

**Định lý Parseval**: $\int|\psi(x)|^2\,dx = \int|\tilde\psi(k)|^2\,dk$ — chuẩn hóa bảo toàn.

**Biến đổi Fourier của Gaussian**: $\mathcal{F}[e^{-\alpha x^2}] = \sqrt{\pi/\alpha}\,e^{-k^2/(4\alpha)}$ — Gaussian biến đổi thành Gaussian (tính chất đặc biệt của ground state QHO).

---

## 6. Tọa độ cầu

$$x = r\sin\theta\cos\phi, \quad y = r\sin\theta\sin\phi, \quad z = r\cos\theta$$

$$dV = r^2\sin\theta\,dr\,d\theta\,d\phi$$

**Laplacian**:

$$\nabla^2 = \frac{1}{r^2}\frac{\partial}{\partial r}\!\left(r^2\frac{\partial}{\partial r}\right) + \frac{1}{r^2\sin\theta}\frac{\partial}{\partial\theta}\!\left(\sin\theta\frac{\partial}{\partial\theta}\right) + \frac{1}{r^2\sin^2\theta}\frac{\partial^2}{\partial\phi^2}$$

**Tích phân trên toàn mặt cầu**:

$$\int_0^{2\pi}d\phi\int_0^\pi\sin\theta\,d\theta = 4\pi$$

$$\int_0^\pi \cos^{2n}\theta\sin\theta\,d\theta = \frac{2}{2n+1}$$

**Spherical harmonics — trực chuẩn**:

$$\int_0^{2\pi}\!\int_0^\pi (Y_l^m)^*Y_{l'}^{m'}\sin\theta\,d\theta\,d\phi = \delta_{ll'}\delta_{mm'}$$

---

## 7. Hàm đặc biệt — Tóm tắt

| Hàm | Xuất hiện ở | Biểu thức tiêu biểu |
|-----|-----------|-------------------|
| Hermite $H_n(\xi)$ | QHO (L06) | $H_n = (-1)^n e^{\xi^2}\frac{d^n}{d\xi^n}e^{-\xi^2}$ |
| Legendre $P_l(\cos\theta)$ | $Y_l^0$ (L08) | $P_0=1$, $P_1=\cos\theta$, $P_2=\frac{1}{2}(3\cos^2\theta-1)$ |
| Laguerre $L_p^q(x)$ | Hydrogen radial (L08) | truy hồi theo $p$ |
| Bessel $j_l(kr)$ | Scattering (hộp 3D) | $j_0 = \sin(kr)/kr$, $j_1 = \sin/kr^2-\cos/kr$ |
| Error function | Gaussian integral | $\text{erf}(x) = \frac{2}{\sqrt{\pi}}\int_0^x e^{-t^2}dt$ |

---

## 8. Hằng số vật lý

| Ký hiệu | Tên | Giá trị |
|---------|-----|---------|
| $\hbar$ | Hằng số Planck rút gọn | $1.055\times10^{-34}$ J·s |
| $m_e$ | Khối lượng electron | $9.109\times10^{-31}$ kg |
| $e$ | Điện tích nguyên tố | $1.602\times10^{-19}$ C |
| $a_0$ | Bán kính Bohr | $5.292\times10^{-11}$ m |
| $E_h$ | Hartree energy | $27.21$ eV |
| $c$ | Tốc độ ánh sáng | $2.998\times10^8$ m/s |
| $k_B$ | Hằng số Boltzmann | $1.381\times10^{-23}$ J/K |
| $\alpha$ | Hằng số cấu trúc tinh | $\approx 1/137$ |

**Đổi đơn vị năng lượng**: $1$ eV $= 1.602\times10^{-19}$ J $= 11{,}604$ K (qua $k_BT$).
