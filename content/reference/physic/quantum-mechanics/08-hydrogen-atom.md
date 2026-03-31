---
title: "08. The Hydrogen Atom — Schrödinger Equation in 3D"
tags: [physics, quantum-mechanics, lesson-08]
aliases: [Nguyên tử Hydrogen và Schrödinger 3D]
created: 2026-03-27
---

> **Prerequisites**: [[05-potential-wells|05. Giếng thế năng vô hạn & hữu hạn]] — tách biến, điều kiện biên; [[06-harmonic-oscillator|06. Dao động điều hòa lượng tử]] — kỹ thuật ladder; [[04-operators-expectation|04. Toán tử & giá trị kỳ vọng]] — commutator.
> **Objectives**:
> - Tổng quát hóa TDSE sang 3 chiều và áp dụng tọa độ cầu
> - Tách biến hàm sóng: $\psi = R(r)Y_l^m(\theta,\phi)$
> - Giải phần góc: harmonic cầu $Y_l^m$, số lượng tử $l$ và $m$
> - Giải phần hướng kính (radial): mức năng lượng $E_n$ của Hydrogen
> - Hiểu ý nghĩa vật lý của bốn số lượng tử $n, l, m, s$

---

## Motivation

Tất cả bài toán từ Lesson 01–07 đều là 1 chiều — hữu ích về mặt khái niệm nhưng chưa phải thế giới thực. Nguyên tử Hydrogen là bài toán 3D đầu tiên và quan trọng nhất: nó có **nghiệm giải tích đầy đủ**, kết quả khớp chính xác với phổ nguyên tử đo được, và là nền tảng cho mọi tính toán cấu trúc điện tử sau này.

Schrödinger (1926) giải bài toán này và thu được các mức năng lượng:

$$E_n = -\frac{13.6\,\text{eV}}{n^2}$$

Kết quả này trùng khớp với công thức Bohr (1913) — nhưng bây giờ nó đến từ lý thuyết **hoàn chỉnh** với hàm sóng đầy đủ, không phải từ mô hình bán cổ điển ad hoc.

---

## Physical Model

### TDSE trong 3 chiều

> [!definition] Definition 8.1 — Phương trình Schrödinger 3D
>
> $$i\hbar\frac{\partial\Psi}{\partial t} = -\frac{\hbar^2}{2m}\nabla^2\Psi + V\Psi$$
>
> Với toán tử Laplacian trong tọa độ Đề-các: $\nabla^2 = \partial_{xx} + \partial_{yy} + \partial_{zz}$.

Với thế năng có **đối xứng cầu** $V = V(r)$ (như nguyên tử Hydrogen), chuyển sang **tọa độ cầu** $(r,\theta,\phi)$:

$$\nabla^2 = \frac{1}{r^2}\frac{\partial}{\partial r}\!\left(r^2\frac{\partial}{\partial r}\right) + \frac{1}{r^2\sin\theta}\frac{\partial}{\partial\theta}\!\left(\sin\theta\frac{\partial}{\partial\theta}\right) + \frac{1}{r^2\sin^2\theta}\frac{\partial^2}{\partial\phi^2}$$

### Thế năng Coulomb

Hệ Hydrogen (proton + electron):

$$V(r) = -\frac{e^2}{4\pi\epsilon_0 r}$$

---

## Mathematical Formalism

### Tách biến: $\psi(r,\theta,\phi) = R(r)\,Y(\theta,\phi)$

Đặt $\psi = R(r)Y(\theta,\phi)$ vào TISE, chia cho $RY/r^2$:

$$\underbrace{\frac{1}{R}\frac{d}{dr}\!\left(r^2\frac{dR}{dr}\right) - \frac{2mr^2}{\hbar^2}[V(r)-E]}_{\text{chỉ phụ thuộc } r} = -\underbrace{\frac{1}{Y}\left[\frac{1}{\sin\theta}\frac{\partial}{\partial\theta}\!\left(\sin\theta\frac{\partial Y}{\partial\theta}\right) + \frac{1}{\sin^2\theta}\frac{\partial^2 Y}{\partial\phi^2}\right]}_{\text{chỉ phụ thuộc }\theta,\phi}$$

Hai vế bằng cùng hằng số tách biến $l(l+1)$. Ta nhận được hai phương trình độc lập.

### Phương trình góc — Spherical Harmonics

**Tách biến tiếp**: $Y(\theta,\phi) = \Theta(\theta)\Phi(\phi)$.

Phương trình $\Phi$: $\Phi'' = -m^2\Phi$ → $\Phi = e^{im\phi}$, yêu cầu $\Phi(\phi + 2\pi) = \Phi(\phi)$ nên $m \in \mathbb{Z}$.

Phương trình $\Theta$: đây là **phương trình Legendre liên kết** (associated Legendre equation), với nghiệm là đa thức Legendre liên kết $P_l^m(\cos\theta)$.

> [!definition] Definition 8.2 — Spherical Harmonics $Y_l^m(\theta,\phi)$
>
> $$Y_l^m(\theta,\phi) = \epsilon\sqrt{\frac{(2l+1)}{4\pi}\frac{(l-|m|)!}{(l+|m|)!}}\,e^{im\phi}\,P_l^m(\cos\theta)$$
>
> với $\epsilon = (-1)^m$ (cho $m > 0$) và $\epsilon = 1$ (cho $m \leq 0$).
>
> **Điều kiện trên $l$ và $m$**:
> - $l = 0, 1, 2, \ldots$ (số lượng tử orbital, azimuthal quantum number)
> - $m = -l, -l+1, \ldots, 0, \ldots, l-1, l$ (số lượng tử từ, magnetic quantum number)
>
> **Tính trực chuẩn**:
>
> $$\int_0^{2\pi}\int_0^\pi (Y_l^m)^* Y_{l'}^{m'}\sin\theta\,d\theta\,d\phi = \delta_{ll'}\delta_{mm'}$$

Một vài spherical harmonics đầu:

| $l$ | $m$ | $Y_l^m$ |
|-----|-----|---------|
| 0 | 0 | $\dfrac{1}{\sqrt{4\pi}}$ |
| 1 | 0 | $\sqrt{\dfrac{3}{4\pi}}\cos\theta$ |
| 1 | $\pm1$ | $\mp\sqrt{\dfrac{3}{8\pi}}\sin\theta\,e^{\pm i\phi}$ |
| 2 | 0 | $\sqrt{\dfrac{5}{16\pi}}(3\cos^2\theta - 1)$ |

**Ý nghĩa vật lý**: $Y_l^m$ mô tả **phân bố góc** của mật độ xác suất — đây là nguồn gốc hình dạng của các orbital nguyên tử ($s$, $p$, $d$, $f$).

### Phương trình hướng kính — Radial Equation

Sau khi tách phần góc, phương trình hướng kính:

$$-\frac{\hbar^2}{2m}\frac{d^2u}{dr^2} + \left[V(r) + \frac{\hbar^2}{2m}\frac{l(l+1)}{r^2}\right]u = Eu$$

Với $u(r) = rR(r)$. Số hạng $\frac{\hbar^2 l(l+1)}{2mr^2}$ là **thế năng ly tâm** (centrifugal potential) — do moment động lượng quỹ đạo.

**Điều kiện biên**: $u(0) = 0$ (để $R$ hữu hạn tại gốc), $u(\infty) = 0$ (bound state).

### Nghiệm cho Hydrogen

Thế $V(r) = -e^2/(4\pi\epsilon_0 r)$. Sau khi thay biến $\rho = r/a_0$ (với $a_0 = \hbar^2/me^2 \cdot 4\pi\epsilon_0$ là **bán kính Bohr**), điều kiện $u(\infty) = 0$ dẫn đến lượng tử hóa:

> [!definition] Definition 8.3 — Mức năng lượng nguyên tử Hydrogen
>
> $$E_n = -\frac{m_e e^4}{2(4\pi\epsilon_0)^2\hbar^2}\cdot\frac{1}{n^2} = -\frac{13.6\,\text{eV}}{n^2}, \quad n = 1, 2, 3, \ldots$$
>
> Với **bán kính Bohr**: $a_0 = \frac{4\pi\epsilon_0\hbar^2}{m_e e^2} \approx 0.529$ Å.
>
> **Số lượng tử chính** $n$ xác định năng lượng; $l$ phải thỏa mãn $0 \leq l \leq n-1$.

**Hàm sóng hướng kính** $R_{nl}(r)$ là tích của đa thức Laguerre liên kết và Gaussian:

$$R_{nl}(r) = \sqrt{\left(\frac{2}{na_0}\right)^3\frac{(n-l-1)!}{2n[(n+l)!]^3}}\,e^{-r/na_0}\!\left(\frac{2r}{na_0}\right)^l L_{n-l-1}^{2l+1}\!\left(\frac{2r}{na_0}\right)$$

Một vài trường hợp đầu:

| $n$ | $l$ | $R_{nl}(r)$ |
|-----|-----|------------|
| 1 | 0 | $2a_0^{-3/2}e^{-r/a_0}$ |
| 2 | 0 | $\frac{1}{\sqrt{2}}a_0^{-3/2}\!\left(1-\frac{r}{2a_0}\right)e^{-r/2a_0}$ |
| 2 | 1 | $\frac{1}{\sqrt{24}}a_0^{-3/2}\frac{r}{a_0}e^{-r/2a_0}$ |

### Bốn số lượng tử

> [!definition] Definition 8.4 — Bốn số lượng tử
>
> | Số lượng tử | Ký hiệu | Phạm vi | Ý nghĩa |
> |-------------|---------|---------|---------|
> | Chính (principal) | $n$ | $1, 2, 3,\ldots$ | Xác định năng lượng $E_n$ |
> | Orbital / Azimuthal | $l$ | $0, 1, \ldots, n-1$ | Moment động lượng quỹ đạo $L^2 = l(l+1)\hbar^2$ |
> | Từ (magnetic) | $m$ | $-l, \ldots, +l$ | Hình chiếu $L_z = m\hbar$ |
> | Spin | $s$ | $+1/2$, $-1/2$ | Spin của electron (Lesson 09) |

**Ký hiệu orbital chuẩn**: $l = 0 \to s$, $l = 1 \to p$, $l = 2 \to d$, $l = 3 \to f$.

**Mức độ suy biến** (degeneracy) của mức $n$: Với mỗi $n$, số trạng thái là:

$$\sum_{l=0}^{n-1}(2l+1) = n^2$$

(Chưa tính spin.) Tính cả spin: $2n^2$ trạng thái cho mỗi $n$.

---

## Derivation

### Bán kính kỳ vọng và mật độ hướng kính

Xác suất tìm thấy electron trong lớp cầu $[r, r+dr]$:

$$P(r)\,dr = |R_{nl}|^2 r^2\,dr \cdot \underbrace{\int|Y_l^m|^2\sin\theta\,d\theta\,d\phi}_{=1} = r^2|R_{nl}|^2\,dr$$

Hàm $r^2|R_{nl}(r)|^2$ gọi là **mật độ xác suất hướng kính** (radial probability density).

**Bán kính kỳ vọng** cho trạng thái $nlm$:

$$\langle r\rangle_{nl} = \int_0^\infty r\cdot r^2|R_{nl}|^2\,dr = \frac{a_0}{2}\left[3n^2 - l(l+1)\right]$$

Với trạng thái cơ bản ($n=1$, $l=0$): $\langle r\rangle_{10} = \frac{3}{2}a_0$ — electron không ở tại $r = a_0$ mà trung bình cách hạt nhân $1.5\,a_0$.

### Phổ vạch của Hydrogen

Khi electron chuyển từ $n_i \to n_f$ ($n_i > n_f$), photon phát ra có năng lượng:

$$\Delta E = 13.6\,\text{eV}\left(\frac{1}{n_f^2} - \frac{1}{n_i^2}\right)$$

$$\frac{1}{\lambda} = R_\infty\left(\frac{1}{n_f^2} - \frac{1}{n_i^2}\right), \qquad R_\infty = \frac{m_e e^4}{8\epsilon_0^2 h^3 c} \approx 1.097\times10^7\,\text{m}^{-1}$$

Đây là **công thức Rydberg** — vốn là công thức thực nghiệm từ 1888, nay được suy ra hoàn toàn từ lý thuyết.

Các dãy phổ nổi tiếng: Lyman ($n_f=1$, tia UV), Balmer ($n_f=2$, khả kiến), Paschen ($n_f=3$, hồng ngoại).

---

## Worked Problem

> [!example] Bài toán 8.1 — Trạng thái cơ bản $1s$
>
> Cho trạng thái cơ bản Hydrogen $\psi_{100} = R_{10}Y_0^0$. Tính: (a) $\langle r\rangle$; (b) giá trị $r$ cực đại của mật độ hướng kính; (c) xác suất electron trong $r < a_0$.

**Lời giải:**

Hàm sóng: $\psi_{100} = \frac{1}{\sqrt{\pi}a_0^{3/2}}e^{-r/a_0}$.

Mật độ hướng kính: $P(r) = r^2|R_{10}|^2 = \frac{4}{a_0^3}r^2 e^{-2r/a_0}$.

**(a) $\langle r\rangle$:**

$$\langle r\rangle = \int_0^\infty r\cdot P(r)\,dr = \frac{4}{a_0^3}\int_0^\infty r^3 e^{-2r/a_0}\,dr = \frac{4}{a_0^3}\cdot\frac{3!}{(2/a_0)^4} = \frac{3}{2}a_0$$

**(b) Cực đại của $P(r)$:**

$$\frac{dP}{dr} = \frac{4}{a_0^3}e^{-2r/a_0}\!\left(2r - \frac{2r^2}{a_0}\right) = 0 \implies r_\text{max} = a_0$$

Bán kính Bohr $a_0$ là vị trí **có khả năng nhất** — đúng như mô hình Bohr, nhưng nay là kết quả đúng từ QM.

**(c) Xác suất $r < a_0$:**

$$P(r < a_0) = \int_0^{a_0}\frac{4}{a_0^3}r^2 e^{-2r/a_0}\,dr$$

Đổi biến $u = 2r/a_0$:

$$= \int_0^2 \frac{u^2}{2}e^{-u}\,du = 1 - e^{-2}(1 + 2 + 2) = 1 - 5e^{-2} \approx 0.323$$

Có khoảng **32.3%** xác suất tìm electron trong $r < a_0$ — hơn $1/3$, cho thấy mật độ xác suất tập trung mạnh gần hạt nhân.

> [!example] Bài toán 8.2 — Bước sóng vạch H-alpha (Balmer)
>
> Tính bước sóng vạch H-alpha ($n = 3 \to n = 2$) của Hydrogen.

**Lời giải:**

$$\Delta E = 13.6\left(\frac{1}{4} - \frac{1}{9}\right) = 13.6\times\frac{5}{36} = 1.889\,\text{eV}$$

$$\lambda = \frac{hc}{\Delta E} = \frac{(6.626\times10^{-34})(3\times10^8)}{1.889\times1.602\times10^{-19}} = 656.3\,\text{nm}$$

Đây là vạch đỏ nổi tiếng của Hydrogen — khớp hoàn hảo với quan sát thực nghiệm.

---

## Summary

- **TDSE 3D**: $i\hbar\,\partial_t\Psi = (-\hbar^2/2m)\nabla^2\Psi + V\Psi$. Với $V = V(r)$, tách biến $\psi = R(r)Y_l^m(\theta,\phi)$.
- **Spherical harmonics** $Y_l^m$: phần góc của hàm sóng, trực chuẩn, mô tả hình dạng orbital.
- **Số lượng tử**: $n$ (năng lượng), $l$ (moment động lượng, $0 \leq l \leq n-1$), $m$ (hình chiếu $L_z$, $|m| \leq l$).
- **Mức năng lượng Hydrogen**: $E_n = -13.6\,\text{eV}/n^2$ — lượng tử hóa từ điều kiện biên hướng kính.
- **Bán kính Bohr** $a_0 \approx 0.529$ Å: cực đại mật độ hướng kính của trạng thái $1s$.
- **Suy biến**: mỗi mức $n$ có $n^2$ trạng thái (không tính spin), $2n^2$ tính cả spin.
- **Công thức Rydberg** suy ra từ lý thuyết: $1/\lambda = R_\infty(1/n_f^2 - 1/n_i^2)$.

---

## References

- Griffiths — *Introduction to Quantum Mechanics*, 2nd ed., Ch. 4.1–4.2
- MIT OCW 8.04 (Zwiebach 2016) — Lectures 25–30: 3D Schrödinger, hydrogen atom
- MIT OCW 8.05 (2013) — Lectures on radial equation and operator methods
- Shankar — *Principles of Quantum Mechanics*, 2nd ed., Ch. 12–13
- Feynman Lectures Vol. 3, Ch. 19: The hydrogen atom and the periodic table
