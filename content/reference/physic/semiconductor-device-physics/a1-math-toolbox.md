---
title: "A1. Math Toolbox"
tags: [physics, semiconductor, device-physics, appendix]
aliases: [Math Toolbox]
created: 2026-03-27
---

> **Dành cho**: Tổng hợp các phương trình toán học quan trọng xuất hiện xuyên suốt semiconductor device physics
> **Nội dung**: Poisson equation, continuity equation, diffusion equation, Fermi integrals, và các hằng số quan trọng

---

## A1.1 — Các Phương Trình Nền Tảng

### Phương trình Poisson

Liên hệ phân bố điện tích $\rho$ với điện thế $V$:

$$\frac{d^2V}{dx^2} = -\frac{\rho(x)}{\varepsilon}$$

hoặc theo điện trường $\mathcal{E} = -dV/dx$:

$$\frac{d\mathcal{E}}{dx} = \frac{\rho}{\varepsilon}$$

**Trong semiconductor**: $\rho = q(p - n + N_D^+ - N_A^-)$

**Ứng dụng chính**: tính phân bố điện trường trong depletion region của p-n junction và MOS capacitor.

---

### Drift-Diffusion Equations (Tổng Current Density)

$$J_n = qn\mu_n\mathcal{E} + qD_n\frac{dn}{dx}$$

$$J_p = qp\mu_p\mathcal{E} - qD_p\frac{dp}{dx}$$

$$J_{total} = J_n + J_p$$

**Einstein relation**: $D_n/\mu_n = D_p/\mu_p = V_T = k_BT/q$

---

### Continuity Equations

Bảo toàn điện tích cho electron và hole:

$$\frac{\partial n}{\partial t} = G - R + \frac{1}{q}\frac{\partial J_n}{\partial x}$$

$$\frac{\partial p}{\partial t} = G - R - \frac{1}{q}\frac{\partial J_p}{\partial x}$$

**Dạng rút gọn (minority carrier, low-field, steady-state)**:

$$D_n\frac{d^2(\Delta n)}{dx^2} - \frac{\Delta n}{\tau_n} + G_L = 0$$

**Nghiệm cơ bản** (không có ánh sáng):

$$\Delta n(x) = Ae^{-x/L_n} + Be^{+x/L_n}, \quad L_n = \sqrt{D_n\tau_n}$$

---

## A1.2 — Công Thức Carrier Statistics

### Fermi-Dirac Distribution

$$f(E) = \frac{1}{1 + e^{(E-E_F)/k_BT}}$$

**Xấp xỉ Boltzmann** (khi $E - E_F \gg k_BT$):

$$f(E) \approx e^{-(E-E_F)/k_BT}$$

### Carrier Concentration

$$n = N_c\,e^{-(E_c-E_F)/k_BT}, \quad N_c = 2\left(\frac{2\pi m_e^* k_BT}{h^2}\right)^{3/2}$$

$$p = N_v\,e^{-(E_F-E_v)/k_BT}, \quad N_v = 2\left(\frac{2\pi m_h^* k_BT}{h^2}\right)^{3/2}$$

### Mass Action Law

$$np = n_i^2 = N_cN_v\,e^{-E_g/k_BT}$$

### Intrinsic Fermi Level

$$E_i = \frac{E_c+E_v}{2} + \frac{3k_BT}{4}\ln\frac{m_h^*}{m_e^*}$$

$$n = n_i\,e^{(E_F-E_i)/k_BT}, \quad p = n_i\,e^{(E_i-E_F)/k_BT}$$

---

## A1.3 — Công Thức p-n Junction

### Built-in Potential

$$V_{bi} = V_T\ln\frac{N_AN_D}{n_i^2}$$

### Depletion Width

$$W = \sqrt{\frac{2\varepsilon V_{bi}}{q}\left(\frac{1}{N_A}+\frac{1}{N_D}\right)}$$

One-sided junction ($N_A \gg N_D$):

$$W \approx x_n \approx \sqrt{\frac{2\varepsilon V_{bi}}{qN_D}}$$

Với reverse bias $V_R$ hoặc forward bias $V$:

$$W(V) = \sqrt{\frac{2\varepsilon(V_{bi}-V)}{q}\left(\frac{1}{N_A}+\frac{1}{N_D}\right)}$$

### Ideal Diode Equation

$$I = I_0\left(e^{V/V_T} - 1\right)$$

$$I_0 = Aqn_i^2\left(\frac{D_p}{L_pN_D} + \frac{D_n}{L_nN_A}\right)$$

### Law of the Junction

$$p_n(x_n) = p_{n0}\,e^{V/V_T}, \quad n_p(-x_p) = n_{p0}\,e^{V/V_T}$$

---

## A1.4 — Công Thức MOS và MOSFET

### Threshold Voltage

$$V_T = V_{FB} + 2\phi_F + \frac{|Q_{dep,max}|}{C_{ox}}$$

$$\phi_F = V_T\ln\frac{N_A}{n_i}, \quad C_{ox} = \frac{\varepsilon_{ox}}{t_{ox}}, \quad Q_{dep,max} = -qN_AW_{d,max}$$

$$W_{d,max} = \sqrt{\frac{4\varepsilon_s\phi_F}{qN_A}}$$

### MOSFET I-V (Long-channel)

**Linear**: $V_{DS} < V_{GS} - V_T$:

$$I_D = \mu_nC_{ox}\frac{W}{L}\left[(V_{GS}-V_T)V_{DS} - \frac{V_{DS}^2}{2}\right]$$

**Saturation**: $V_{DS} \geq V_{GS} - V_T$:

$$I_D = \frac{\mu_nC_{ox}}{2}\frac{W}{L}(V_{GS}-V_T)^2$$

**Transconductance** (saturation):

$$g_m = \mu_nC_{ox}\frac{W}{L}(V_{GS}-V_T) = \sqrt{2\mu_nC_{ox}\frac{W}{L}I_D}$$

---

## A1.5 — Công Thức BJT

### Active Mode

$$I_C = I_S\,e^{V_{BE}/V_T}$$

$$I_B = I_C/\beta_F, \quad I_E = I_C/\alpha_F = I_C + I_B$$

$$\alpha_F = \frac{\beta_F}{\beta_F+1}, \quad \beta_F = \frac{\alpha_F}{1-\alpha_F}$$

$$\beta_F \approx \frac{2L_n^2}{W_B^2} \quad \text{(short-base approximation)}$$

**Transconductance**: $g_m = I_C/V_T$

---

## A1.6 — Hằng Số Vật Lý Quan Trọng

| Ký hiệu | Hằng số | Giá trị |
|---------|---------|---------|
| $q$ | Điện tích electron | $1.602\times10^{-19}$ C |
| $m_e$ | Khối lượng electron | $9.109\times10^{-31}$ kg |
| $k_B$ | Hằng số Boltzmann | $1.381\times10^{-23}$ J/K = $8.617\times10^{-5}$ eV/K |
| $h$ | Hằng số Planck | $6.626\times10^{-34}$ J·s |
| $\hbar$ | Hằng số Planck rút gọn | $1.055\times10^{-34}$ J·s |
| $\varepsilon_0$ | Hằng số điện môi chân không | $8.854\times10^{-12}$ F/m |

**Ở 300 K:**

| Ký hiệu | Giá trị |
|---------|---------|
| $k_BT$ | 0.02585 eV ≈ 26 meV |
| $V_T = k_BT/q$ | 25.85 mV ≈ 26 mV |
| $k_BT/q \ln 10$ | 59.6 mV/decade |

---

## A1.7 — Thông Số Vật Liệu Silicon ở 300 K

| Thông số | Ký hiệu | Giá trị |
|---------|---------|---------|
| Band gap | $E_g$ | 1.12 eV |
| Intrinsic carrier concentration | $n_i$ | $1.5\times10^{10}$ cm$^{-3}$ |
| Effective density of states (CB) | $N_c$ | $2.8\times10^{19}$ cm$^{-3}$ |
| Effective density of states (VB) | $N_v$ | $1.04\times10^{19}$ cm$^{-3}$ |
| Electron effective mass | $m_e^*/m_e$ | 0.26 |
| Hole effective mass | $m_h^*/m_e$ | 0.36 |
| Electron mobility (intrinsic) | $\mu_n$ | 1350 cm²/(V·s) |
| Hole mobility (intrinsic) | $\mu_p$ | 480 cm²/(V·s) |
| Saturation velocity | $v_{sat}$ | $10^7$ cm/s |
| Relative permittivity | $\varepsilon_r$ | 11.7 |
| Electron affinity | $\chi$ | 4.05 eV |
| Lattice constant | $a$ | 0.543 nm |
| Atom density | — | $5\times10^{22}$ cm$^{-3}$ |

**SiO₂:**

| Thông số | Giá trị |
|---------|---------|
| Band gap | ~9 eV |
| Relative permittivity | 3.9 |
| Breakdown field | ~10 MV/cm |
