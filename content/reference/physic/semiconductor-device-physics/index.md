---
title: "Semiconductor Device Physics"
tags: [physics, semiconductor, device-physics, index]
created: 2026-03-27
---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[01-classical-physics-review|01. Classical Physics Review]] — Điện trường, thế năng điện, năng lượng, lực Coulomb. Nền tảng điện từ học để hiểu band theory và hoạt động của linh kiện.
- [[02-quantum-mechanics-primer|02. Quantum Mechanics Primer]] — Wave-particle duality, quantization of energy, hàm sóng, Schrödinger equation (conceptual), particle in a box. Giải thích nguồn gốc của energy bands trong tinh thể — nền tảng trực tiếp cho Lesson 04.

- [[03-crystal-structure|03. Crystal Structure]] — Diamond cubic, unit cell, lattice constant, liên kết cộng hóa trị trong Si, khái niệm hole. Tính mật độ nguyên tử và khoảng cách liên kết.
- [[04-energy-band-theory|04. Energy Band Theory]] — Valence band, conduction band, band gap, Fermi level, effective mass, direct vs. indirect gap. Cách đọc energy band diagram và phân loại metal/semiconductor/insulator.

- [[05-carrier-statistics|05. Carrier Statistics]] — Fermi-Dirac distribution, density of states, carrier concentration $n$ và $p$, intrinsic carrier concentration $n_i$, mass action law $np = n_i^2$, intrinsic Fermi level.
- [[06-doping|06. Doping]] — N-type (donor, nhóm V), p-type (acceptor, nhóm III), complete ionization, charge neutrality condition, majority/minority carrier, Fermi level shift sau doping, compensation.

- [[07-drift|07. Drift]] — Drift velocity, mobility $\mu$, scattering (phonon, impurity), drift current density $J = q(n\mu_n+p\mu_p)\mathcal{E}$, Ohm's law vi mô, velocity saturation.
- [[08-diffusion|08. Diffusion]] — Định luật Fick, diffusion current density, diffusion coefficient $D$, Einstein relation $D = \mu V_T$, thermal voltage $V_T = 26$ mV. Tổng drift-diffusion equations.

- [[09-generation-recombination|09. Generation & Recombination]] — Band-to-band, SRH (trap-assisted), Auger recombination. Minority carrier lifetime $\tau$, diffusion length $L = \sqrt{D\tau}$, continuity equation.
- [[10-pn-junction-equilibrium|10. p-n Junction Equilibrium]] — Hình thành depletion region, built-in potential $V_{bi}$, phân bố điện tích/điện trường, chiều rộng $W$, energy band diagram với Fermi level phẳng.

- [[11-pn-junction-under-bias|11. p-n Junction Under Bias]] — Forward/reverse bias, minority carrier injection, law of the junction, ideal diode equation $I = I_0(e^{V/V_T}-1)$, saturation current $I_0$, cut-in voltage.
- [[12-metal-semiconductor-junction|12. Metal-Semiconductor Junction]] — Work function, electron affinity, Schottky barrier $\phi_B$, Schottky vs. ohmic contact, thermionic emission, ohmic contact qua doping cao.

- [[13-mos-capacitor|13. MOS Capacitor]] — Cấu trúc MOS, ba chế độ (flat-band, depletion, inversion), surface potential, threshold voltage $V_T$, đặc tuyến C-V, oxide capacitance.
- [[14-mosfet|14. MOSFET]] — Cấu trúc n-channel MOSFET, chế độ linear và saturation, I-V model, transconductance $g_m$, subthreshold swing, short-channel effects.
- [[15-bjt|15. BJT]] — Cấu trúc NPN, bốn chế độ hoạt động, transistor action, current gain $\beta_F$ và $\alpha_F$, Ebers-Moll model, Early effect, so sánh với MOSFET.

## Appendices

- [[a0-quantum-mechanics-deeper|A0. Quantum Mechanics Deeper]] — Schrödinger equation đầy đủ, particle in a box chi tiết, quantum tunneling và ứng dụng (gate leakage, tunnel diode, Flash memory).
- [[a1-math-toolbox|A1. Math Toolbox]] — Tổng hợp toàn bộ công thức: Poisson, drift-diffusion, continuity, carrier stats, p-n junction, MOS, MOSFET, BJT. Bảng hằng số vật lý và thông số Si.

## Notation Guide

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $E$ | Năng lượng (energy), đơn vị eV hoặc J |
| $\mathbf{E}$ | Điện trường (electric field), đơn vị V/m |
| $V$ | Điện thế (electric potential), đơn vị V |
| $q$ | Điện tích của electron, $q = 1.6 \times 10^{-19}$ C |
| $m_e$ | Khối lượng electron, $m_e = 9.11 \times 10^{-31}$ kg |
| $k_B$ | Hằng số Boltzmann, $k_B = 1.38 \times 10^{-23}$ J/K |
| $T$ | Nhiệt độ tuyệt đối (Kelvin) |
| $\hbar$ | Hằng số Planck rút gọn, $\hbar = h/2\pi$ |
| $n, p$ | Nồng độ electron và hole (cm$^{-3}$) |
| $n_i$ | Nồng độ hạt tải intrinsic |
| $E_F$ | Fermi energy / Fermi level |
| $E_g$ | Band gap energy |
| $E_c, E_v$ | Mức đáy conduction band, đỉnh valence band |
