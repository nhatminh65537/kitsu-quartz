---
title: "Quantum Mechanics"
tags: [physics, quantum-mechanics, index]
created: 2026-03-27
---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[01-experimental-foundations|01. Thí nghiệm nền tảng & sự ra đời của QM]] — Hiệu ứng quang điện, thí nghiệm khe đôi, de Broglie waves, lưỡng tính sóng-hạt (wave-particle duality).
- [[02-wavefunction-probability|02. Hàm sóng & diễn giải xác suất]] — Hàm sóng ψ(x,t), Born rule, normalization, giá trị kỳ vọng ⟨x⟩, độ bất định Δx, probability current, hàm sóng vật lý.

- [[03-schrodinger-equation|03. Phương trình Schrödinger]] — TDSE, tách biến, TISE, trạng thái dừng, nguyên lý chồng chất, bảo toàn chuẩn hóa, trực giao.
- [[04-operators-expectation|04. Toán tử & giá trị kỳ vọng]] — $\hat{x}$, $\hat{p}$, toán tử Hermitian, $[\hat{x},\hat{p}]=i\hbar$, định lý Ehrenfest, nguyên lý bất định Heisenberg.
- [[05-potential-wells|05. Giếng thế năng vô hạn & hữu hạn]] — $\psi_n$, $E_n = n^2 E_1$, zero-point energy, hệ trực chuẩn, khai triển $c_n$, bound states, xuyên thấu lượng tử.
- [[06-harmonic-oscillator|06. Dao động điều hòa lượng tử]] — Ladder operators $\hat{a}_\pm$, $[\hat{a}_-,\hat{a}_+]=1$, $E_n=(n+1/2)\hbar\omega$, ground state Gaussian, định lý virial.
- [[07-tunneling|07. Hàng rào thế năng & xuyên hầm lượng tử]] — Scattering states, hệ số $T$ và $R$, $T+R=1$, xấp xỉ hàng rào dày $e^{-2\kappa a}$, WKB, phân rã alpha, STM.
- [[08-hydrogen-atom|08. Nguyên tử Hydrogen — Schrödinger 3D]] — Tách biến $\psi = RY_l^m$, spherical harmonics, số lượng tử $n,l,m$, $E_n = -13.6/n^2$ eV, bán kính Bohr, công thức Rydberg.
- [[09-angular-momentum-spin|09. Mômen động lượng & spin]] — $[\hat{L}_i,\hat{L}_j]=i\hbar\epsilon_{ijk}\hat{L}_k$, ladder operators $\hat{L}_\pm$, phổ $l(l+1)\hbar^2$ và $m\hbar$, spin $1/2$, ma trận Pauli, Clebsch-Gordan.
- [[10-dirac-hilbert|10. Ký hiệu Dirac & không gian Hilbert]] — Ket/bra, inner product, completeness $\sum\ket{q_n}\bra{q_n}=\hat{I}$, ma trận toán tử, khai triển $c_n = \braket{q_n|\psi}$, biểu diễn Fourier.
- [[11-heisenberg-picture|11. Heisenberg picture & cơ học ma trận]] — $\hat{U}(t)=e^{-i\hat{H}t/\hbar}$, Heisenberg vs Schrödinger picture, phương trình Heisenberg $d\hat{Q}/dt=(i/\hbar)[\hat{H},\hat{Q}]$, QHO giải bằng toán tử, interaction picture.
- [[12-generalized-uncertainty|12. Nguyên lý bất định tổng quát]] — Robertson inequality, Cauchy-Schwarz, compatible observables, CSCO, bất định $\Delta E\cdot\Delta t \geq \hbar/2$.
- [[13-time-independent-perturbation|13. Nhiễu loạn không phụ thuộc thời gian]] — $E_n^1 = \langle\hat{H}'\rangle$, $E_n^2$ bậc 2, hiệu chỉnh hàm sóng, degenerate PT, Stark effect, fine structure, Zeeman.
- [[14-time-dependent-perturbation|14. Nhiễu loạn phụ thuộc thời gian]] — Transition probability bậc 1, resonance, Fermi's golden rule $\Gamma = 2\pi|V_{fi}|^2\rho/\hbar$, selection rules $\Delta l=\pm 1$, adiabatic vs sudden approximation.
- [[15-identical-particles|15. Các hạt giống nhau & thống kê lượng tử]] — Boson/fermion, nguyên lý Pauli, Slater determinant, Fermi-Dirac, Bose-Einstein, exchange interaction.
- [[16-entanglement-bell|16. Vướng víu lượng tử & định lý Bell]] — Entangled vs product states, Bell states, EPR paradox, CHSH inequality $|S|\leq 2$, vi phạm QM $2\sqrt{2}$, thực nghiệm Aspect, quantum teleportation/cryptography.

## Appendices

- [[a0-math-essentials|A0. Toán học thiết yếu cho QM]] — Số phức, Gaussian integrals, Dirac delta, ODE (Hermite, Laguerre), Fourier transform, tọa độ cầu, hằng số vật lý.
- [[a1-worked-problems|A1. Bài toán mẫu tổng hợp]] — 6 nhóm bài: gói sóng Gaussian, hộp bất đối xứng, Hydrogen virial, đo liên tiếp, TDPT + QHO, reduced density matrix & decoherence.

---

## Notation Guide

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $\psi(x,t)$ | Hàm sóng (wavefunction) phụ thuộc vị trí và thời gian |
| $\|\psi\|^2 = \psi^* \psi$ | Mật độ xác suất (probability density) |
| $\hbar = h / 2\pi$ | Hằng số Planck rút gọn ($\approx 1.055 \times 10^{-34}$ J·s) |
| $\hat{x},\, \hat{p}$ | Toán tử vị trí và toán tử động lượng |
| $\langle A \rangle$ | Giá trị kỳ vọng (expectation value) của đại lượng $A$ |
| $[A, B]$ | Commutator: $AB - BA$ |
| $\Delta x,\, \Delta p$ | Độ lệch chuẩn của $x$ và $p$ |
| TDSE | Time-Dependent Schrödinger Equation |
| TISE | Time-Independent Schrödinger Equation |
