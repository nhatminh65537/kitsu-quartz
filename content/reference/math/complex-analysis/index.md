---
title: "Complex Analysis"
tags: [math, complex-analysis, index]
created: 2026-03-31
---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[01-complex-numbers|01. Complex Numbers and the Complex Plane]] — Cấu trúc trường $\mathbb{C}$, module, argument, công thức Euler, biểu diễn cực, cầu Riemann $\hat{\mathbb{C}}$.
- [[02-topology-complex-plane|02. Topology of the Complex Plane]] — Tập mở/đóng, compact (Heine–Borel), miền, đường cong, định lý Jordan, đơn liên, số cuộn $n(\gamma, z_0)$.
- [[03-holomorphic-functions|03. Holomorphic Functions and Cauchy–Riemann Equations]] — Đạo hàm phức, phương trình CR, đạo hàm Wirtinger $\partial/\partial\bar{z}$, hàm điều hòa, liên hợp điều hòa.
- [[04-elementary-complex-functions|04. Elementary Complex Functions]] — $e^z$ (entire, tuần hoàn $2\pi i$), $\operatorname{Log}(z)$ và nhánh, $z^\alpha$ đa trị, $\sin z$, $\cos z$, $\sinh z$, $\cosh z$.
- [[05-power-series|05. Power Series]] — Hội tụ chuỗi lũy thừa, công thức Hadamard, hội tụ đều, chuỗi lũy thừa holomorphic, hệ số Taylor, định lý Abel.
- [[06-complex-integration|06. Complex Integration]] — Tích phân đường, ML-inequality, định lý Goursat, định lý Cauchy, nguyên hàm, công thức tích phân Cauchy, đạo hàm bậc cao, holomorphic $\Rightarrow$ analytic, Liouville, Định lý Cơ bản Đại số.
- [[07-local-properties|07. Local Properties of Analytic Functions]] — Bậc điểm không, định lý đồng nhất (Identity Theorem), nguyên lý module cực đại, định lý ánh xạ mở, bổ đề Schwarz.
- [[08-laurent-series-singularities|08. Laurent Series and Isolated Singularities]] — Chuỗi Laurent, định lý Laurent, ba loại điểm kỳ dị (khả khử/cực/thiết yếu), Casorati–Weierstrass, định lý Riemann về điểm khả khử.
- [[09-residues|09. Calculus of Residues]] — Thặng dư (residue), định lý thặng dư, tích phân thực (3 dạng), bổ đề Jordan, nguyên lý argument, định lý Rouché.
- [[10-harmonic-functions|10. Harmonic Functions]] — Mean value property, nguyên lý cực đại mạnh, nhân Poisson $P_r(\theta)$, công thức tích phân Poisson, bài toán Dirichlet, bất đẳng thức Harnack, nguyên lý Harnack, hàm subharmonic.
- [[11-conformal-mappings|11. Conformal Mappings]] — Ánh xạ bảo giác, biến đổi Möbius, cross-ratio, Aut($D$) = Blaschke factors, Aut($\mathbb{H}$) = $PSL_2(\mathbb{R})$, bổ đề Schwarz–Pick và metric Poincaré.
- [[12-riemann-mapping-theorem|12. Riemann Mapping Theorem]] — Họ chuẩn tắc, định lý Montel, Hurwitz, chứng minh Riemann qua cực trị $|f'(z_0)|$, duy nhất với chuẩn hóa, ba lớp miền đơn liên, Schwarz–Christoffel.
- [[13-analytic-continuation|13. Analytic Continuation and Monodromy]] — Mầm hàm (germ), tiếp tục giải tích dọc đường cong, định lý đơn cấu (Monodromy Theorem), biểu diễn đơn cấu, mặt Riemann, biên tự nhiên.
- [[14-entire-meromorphic-functions|14. Entire and Meromorphic Functions]] — Tích vô hạn, nhân tố cơ bản Weierstrass $E_p$, định lý Weierstrass Factorization, định lý Hadamard, bậc tăng trưởng, Mittag-Leffler, hàm Gamma $\Gamma(z)$.
- [[15-riemann-zeta-function|15. The Riemann Zeta Function]] — $\zeta(s) = \sum n^{-s}$, tích Euler, tiếp tục giải tích, phương trình hàm $\xi(s) = \xi(1-s)$, zero tầm thường/không tầm thường, giả thuyết Riemann, Định lý Số Nguyên Tố.

## Appendices

- [[a0-cauchys-theorem-homology|A0. Cauchy's Theorem — Homology Version]] — Dạng tổng quát nhất của Định lý Cauchy dùng số cuộn $n(\gamma, z) = 0$.
- [[a1-riemann-mapping-theorem|A1. Riemann Mapping Theorem — Full Proof]] — Chứng minh đầy đủ qua cực trị họ $\mathcal{F}$ và Montel.
- [[a2-weierstrass-factorization|A2. Weierstrass Factorization Theorem — Full Proof]] — Bổ đề estimate $|E_p(z)-1| \leq |z|^{p+1}$, ví dụ $\sin(\pi z)$, hệ quả $\zeta(2) = \pi^2/6$.

## Notation Guide

| Symbol | Meaning |
|--------|---------|
| $\mathbb{C}$ | Tập số phức |
| $\hat{\mathbb{C}}$ | Cầu Riemann $\mathbb{C} \cup \{\infty\}$ |
| $\operatorname{Re}(z), \operatorname{Im}(z)$ | Phần thực, phần ảo |
| $\bar{z}$ | Liên hợp phức |
| $\lvert z \rvert$ | Module (modulus) |
| $\arg z, \operatorname{Arg}(z)$ | Argument và argument chính $\in (-\pi,\pi]$ |
| $D(z_0, r)$ | Đĩa mở tâm $z_0$ bán kính $r$ |
| $D'(z_0, r)$ | Đĩa đục $D(z_0,r)\setminus\{z_0\}$ |
| $\mathcal{O}(\Omega)$ | Tập các hàm holomorphic trên $\Omega$ |
| $n(\gamma, z_0)$ | Số cuộn của $\gamma$ quanh $z_0$ |
| $\operatorname{Res}(f, z_0)$ | Thặng dư của $f$ tại $z_0$ (hệ số $c_{-1}$ chuỗi Laurent) |
| $\operatorname{Log}(z)$ | Nhánh chính logarithm, $\operatorname{Arg}\in(-\pi,\pi]$ |
| $\mathbb{H}$ | Nửa mặt phẳng trên $\{z:\operatorname{Im}(z)>0\}$ |
| $E_p(z)$ | Nhân tố cơ bản Weierstrass bậc $p$ |
| $\Gamma(z)$ | Hàm Gamma Euler |
| $\zeta(s)$ | Hàm zeta Riemann |
| $\xi(s)$ | Hàm zeta hoàn chỉnh $\frac{1}{2}s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s)$ |
