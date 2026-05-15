---
title: "Number Theory"
type: index
tags: [math, number-theory, index]
created: 2026-05-15
---

Khóa học lý thuyết số từ nền tảng phổ thông đến các chủ đề liên quan mật mã, tập trung vào cấu trúc đại số xuất hiện tự nhiên trong số học.

- [[00-roadmap|00. Roadmap]]

## Module 0 — Nền Tảng Chia Hết

- [[01-divisibility-and-euclidean-algorithm|01. Tính Chia Hết và Thuật Toán Euclid]] — Quan hệ $a \mid b$, 6 tính chất chia hết, Định Lý Chia Có Dư (Division Algorithm) + chứng minh well-ordering, GCD/LCM + liên hệ $\gcd \cdot \text{lcm} = |ab|$, thuật toán Euclid + Lemma $\gcd(a,b) = \gcd(b,r)$, Định lý Lamé về độ phức tạp $O(\log b)$.
- [[02-extended-euclidean-algorithm|02. Thuật Toán Euclid Mở Rộng]] — Bézout's Identity + họ nghiệm đầy đủ, XGCD dạng ma trận, nghịch đảo modular $a^{-1} \pmod{n}$ tồn tại $\Leftrightarrow$ $\gcd(a,n) = 1$, Bổ đề Euclid ($\gcd(a,b)=1$ và $a \mid bc$ thì $a \mid c$), hệ quả cho số nguyên tố.
- [[03-primes-and-fta|03. Số Nguyên Tố và Định Lý Cơ Bản]] — Định nghĩa nguyên tố/hợp số, tiêu chuẩn $\sqrt{n}$, Định Lý Cơ Bản Số Học (FTA): tồn tại và duy nhất, biểu diễn chính tắc, GCD/LCM qua $\min/\max$ số mũ, hàm đếm ước $\tau(n)$, sàng Eratosthenes.
- [[04-linear-diophantine-equations|04. Phương Trình Diophantine Tuyến Tính]] — $ax+by=c$ có nghiệm nguyên $\Leftrightarrow$ $\gcd(a,b) \mid c$, tìm nghiệm đặc biệt bằng XGCD, họ nghiệm đầy đủ $x = x_0 + \tfrac{b}{d}t$, bài toán nghiệm không âm, mở rộng ba ẩn, kết nối với lý thuyết đồng dư.

## Module 1 — Đồng Dư

- [[05-congruences|05. Quan Hệ Đồng Dư]]
- [[06-linear-congruences|06. Đồng Dư Tuyến Tính]] — $ax \equiv b \pmod{n}$, điều kiện $\gcd(a,n) \mid b$, $d$ nghiệm phân biệt, nghịch đảo modulo, Bổ Đề Hensel (nâng nghiệm lên $p^k$).
- [[07-chinese-remainder-theorem|07. Định Lý Thặng Dư Trung Hoa]]
- [[08-wilson-and-fermat|08. Định Lý Wilson và Fermat Nhỏ]]
- [[09-euler-phi-and-euler-theorem|09. Hàm Euler $\varphi$ và Định Lý Euler]] — Định nghĩa $\varphi(n)$, tính nhân tính, công thức tích, tổng ước $\sum_{d|n}\varphi(d)=n$, Euler's Theorem $a^{\varphi(n)}\equiv 1$, Ứng dụng RSA Cryptosystem.

## Module 2 — Cấu Trúc Nhóm Nhân

- [[10-multiplicative-order|10. Bậc Nhân Tử]] — $\text{ord}_n(a)$, tiêu chuẩn chia, $\text{ord}_n(a)\mid\varphi(n)$, bậc của lũy thừa $\text{ord}_n(a^m) = d/\gcd(m,d)$, nhóm con cyclic $\langle a\rangle$.
- [[11-primitive-roots-mod-prime|11. Primitive Root modulo Số Nguyên Tố]] — Định nghĩa primitive root, Lemma 11.3 (đa thức bậc $d$ tối đa $d$ nghiệm), Theorem 11.5 (số phần tử bậc $d$ là $\varphi(d)$), tồn tại và đếm primitive root, bảng chỉ số.
- [[12-primitive-roots-general|12. Primitive Root modulo n Tổng Quát]] — Phân loại: $n\in\{1,2,4,p^k,2p^k\}$; nâng từ mod $p$ lên mod $p^k$; cấu trúc $(\mathbb{Z}/2^k\mathbb{Z})^*\cong\mathbb{Z}/2\times\mathbb{Z}/2^{k-2}$.
- [[13-structure-of-multiplicative-group|13. Cấu Trúc của $(\mathbb{Z}/n\mathbb{Z})^*$]] — Phân rã CRT đầy đủ, hàm Carmichael $\lambda(n)$, bảng tổng hợp cấu trúc, giải $x^k\equiv a\pmod n$.
- [[14-discrete-logarithm|14. Logarithm Rời Rạc]] — Định nghĩa $\text{ind}_g(a)$, tính chất (nhân→cộng), Baby-step Giant-step $O(\sqrt{p})$, Pohlig-Hellman, DLP trong nhóm tổng quát.

## Module 3 — Thặng Dư Bậc Hai

- [[15-quadratic-residues|15. Thặng Dư Bậc Hai]] — Định nghĩa QR/QNR, đếm $(p-1)/2$ QR và QNR, đặc trưng qua primitive root (mũ chẵn), quy tắc nhân QR·QNR, $-1 \in QR_p \iff p \equiv 1 \pmod 4$.
- [[16-euler-criterion-and-legendre-symbol|16. Tiêu Chuẩn Euler và Ký Hiệu Legendre]] — Tiêu Chuẩn Euler $a^{(p-1)/2} \equiv \pm 1$, định nghĩa và tính nhân tính của $\left(\frac{a}{p}\right)$, công thức $\left(\frac{-1}{p}\right)$ và $\left(\frac{2}{p}\right)$.
- [[17-law-of-quadratic-reciprocity|17. Luật Tương Hỗ Bậc Hai]] — Bổ Đề Gauss, Bổ Đề Eisenstein, chứng minh hình học Eisenstein qua đếm điểm nguyên; $\left(\frac{p}{q}\right)\left(\frac{q}{p}\right) = (-1)^{\frac{p-1}{2}\frac{q-1}{2}}$.
- [[18-jacobi-symbol|18. Ký Hiệu Jacobi]] — Mở rộng Legendre sang $n$ lẻ hợp số; Jacobi $= 1$ không kéo theo QR; Jacobi Reciprocity; thuật toán Euclid-style; Solovay-Strassen.
- [[19-tonelli-shanks|19. Căn Bậc Hai Modulo p — Tonelli-Shanks]] — Công thức $p \equiv 3 \pmod 4$; thuật toán Tonelli-Shanks với bất biến vòng lặp $R^2 \equiv ta$; độ phức tạp $O(\log^2 p)$.

## Module 4 — Hàm Số Học

- [[20-arithmetic-functions|20. Hàm Số Học và Tính Nhân Tính]] — $\tau$, $\sigma$, $\sigma_k$, $\varphi$, $\mu$, $\Lambda$; phân loại nhân tính/toàn toàn; công thức tính trên $p^k$; Số Hoàn Hảo (Perfect Numbers) và Định Lý Euclid-Euler.
- [[21-dirichlet-convolution-and-mobius|21. Tích Chập Dirichlet và Hàm Möbius]] — $(f*g)(n) = \sum_{d\mid n}f(d)g(n/d)$, vành Dirichlet, $\mathbf{1}^{-1} = \mu$, $\varphi = \operatorname{id} * \mu$, kết nối với chuỗi Dirichlet và $\zeta(s)$.
- [[22-mobius-inversion|22. Công Thức Đảo Möbius]] — $F = f * \mathbf{1} \iff f = F * \mu$, dạng tổng và dạng tích, ứng dụng đếm chuỗi nguyên thủy, đa thức bất khả quy trên $\mathbb{F}_p$, tổng quát hóa Möbius trên poset.

## Module 5 — Phân Phối Số Nguyên Tố

- [[23-infinitude-of-primes|23. Vô Hạn Số Nguyên Tố]]
- [[24-dirichlet-theorem|24. Số Nguyên Tố Trong Cấp Số Cộng]]
- [[25-prime-counting-functions|25. Hàm Đếm Số Nguyên Tố]] — $\pi(x)$, $\theta(x)$, $\psi(x)$ và quan hệ tương đương; PNT $\pi(x) \sim x/\ln x$; Chebyshev bounds; Định Lý Mertens; Bertrand's Postulate.
- [[26-primality-testing|26. Kiểm Tra Tính Nguyên Tố]] — Fermat test, Carmichael numbers, Miller-Rabin (strong pseudoprime, witness, $\leq (1/4)^k$), Định Lý Proth, Lucas test (primality certificate), AKS.

## Module 6 — Phân Số Liên Tục

- [[27-finite-continued-fractions|27. Phân Số Liên Tục Hữu Hạn]] — Định nghĩa $[a_0;a_1,\ldots,a_n]$, liên hệ Euclid, phân tích số hữu tỉ, tính không duy nhất và biểu diễn chuẩn.
- [[28-convergents|28. Phân Số Hội Tụ (Convergents)]] — Công thức truy hồi, đẳng thức $p_n q_{n-1}-p_{n-1}q_n=(-1)^n$, tính xen kẽ, gcd$(p_n,q_n)=1$, hội tụ về số gốc.
- [[29-infinite-continued-fractions-and-best-approximation|29. Phân Số Liên Tục Vô Hạn và Xấp Xỉ Tốt Nhất]] — Số vô tỉ = CF vô hạn duy nhất, convergents là xấp xỉ tốt nhất, định lý Hurwitz $|\alpha-p/q|<1/(\sqrt{5}\,q^2)$, số vô tỉ Liouville.
- [[30-periodic-continued-fractions-and-pell-equation|30. CF Tuần Hoàn và Phương Trình Pell]] — CF thuần tuần hoàn, định lý Lagrange, CF của $\sqrt{d}$, nghiệm cơ bản và vô hạn nghiệm phương trình Pell.

## Module 7 — Số Nguyên Gauss và Tổng Hai Bình Phương

- [[31-gaussian-integers|31. Số Nguyên Gauss $\mathbb{Z}[i]$]] — Định nghĩa $\mathbb{Z}[i]$, norm $N(a+bi)=a^2+b^2$, tính nhân tính, units $\{\pm 1, \pm i\}$, associates, thuật toán chia trong $\mathbb{Z}[i]$, Euclidean Domain → PID → UFD.
- [[32-gaussian-primes|32. Số Nguyên Tố Gauss — Phân Loại]] — Gaussian prime, liên hệ $N(\pi)$ với rational prime, phân loại: $p=2$ ramified $(1+i)$, $p\equiv 1(4)$ split, $p\equiv 3(4)$ inert; unique factorization, GCD trong $\mathbb{Z}[i]$.
- [[33-sums-of-two-squares|33. Tổng Hai Bình Phương — Định Lý Fermat]] — $p\equiv 1(4) \iff p=a^2+b^2$ duy nhất, chứng minh qua Gaussian integers, Brahmagupta–Fibonacci identity, đặc trưng tổng quát: $n=a^2+b^2 \iff \forall q\equiv 3(4), v_q(n)$ chẵn.
- [[34-counting-representations|34. Đếm Số Biểu Diễn và Ứng Dụng]] — $r_2(n)=4(d_1(n)-d_3(n))$, chứng minh qua đếm factorization trong $\mathbb{Z}[i]$, primitive Pythagorean triples $(u^2-v^2, 2uv, u^2+v^2)$, giới thiệu các vành quadratic khác.

## Appendices

- [[a0-proof-of-fta|A0. Định Lý Cơ Bản Số Học — Chứng Minh Đầy Đủ]] — Chứng minh tồn tại bằng quy nạp mạnh, Lemma: số nguyên tố chia tích, chứng minh duy nhất bằng quy nạp + Bổ đề Euclid, kết nối với UFD/PID/Euclidean Domain.
- [[a1-proof-of-crt|A1. Chinese Remainder Theorem — Chứng Minh Constructive]]
- [[a2-proof-of-quadratic-reciprocity|A2. Luật Tương Hỗ Bậc Hai — Chứng Minh Hình Học]]
- [[a3-proof-of-bertrand-postulate|A3. Bertrand's Postulate — Chứng Minh Chebyshev]]
- [[a4-proof-of-lagrange-periodic-cf-theorem|A4. Định Lý Lagrange về CF Tuần Hoàn — Chứng Minh Đầy Đủ]]
- [[a5-proof-of-fermat-two-squares|A5. Định Lý Fermat về $p = a^2 + b^2$ — Chứng Minh Descent]] — Phương pháp descent vô hạn của Fermat, chứng minh $p \equiv 1 \pmod 4 \Rightarrow p = a^2+b^2$ không dùng Gaussian integers.
- [[a6-proof-of-r2-formula|A6. Công thức $r_2(n) = 4(d_1 - d_3)$ — Chứng Minh Đầy Đủ]] — Chứng minh qua unique factorization trong $\mathbb{Z}[i]$ và đếm số cách chọn factor.

## Notation Guide

| Symbol | Meaning |
|--------|---------|
| $a \mid b$ | $a$ chia hết $b$ |
| $a \nmid b$ | $a$ không chia hết $b$ |
| $\gcd(a,b)$ | Ước chung lớn nhất |
| $\text{lcm}(a,b)$ | Bội chung nhỏ nhất |
| $a \equiv b \pmod{n}$ | $a$ đồng dư $b$ modulo $n$ |
| $\mathbb{Z}/n\mathbb{Z}$ | Vành số nguyên modulo $n$ |
| $(\mathbb{Z}/n\mathbb{Z})^*$ | Nhóm nhân (các phần tử khả nghịch) |
| $\varphi(n)$ | Hàm Euler (số phần tử $\leq n$ nguyên tố cùng nhau với $n$) |
| $\text{ord}_n(a)$ | Bậc nhân tử của $a$ modulo $n$ |
| $\left(\frac{a}{p}\right)$ | Legendre symbol |
| $\left(\frac{a}{n}\right)$ | Jacobi symbol |
| $\mu(n)$ | Hàm Möbius |
| $\tau(n)$ | Số ước của $n$ |
| $\sigma(n)$ | Tổng các ước của $n$ |
| $\pi(x)$ | Số số nguyên tố $\leq x$ |
| $\Lambda(n)$ | Hàm von Mangoldt |
| $[a_0; a_1, a_2, \ldots]$ | Phân số liên tục (continued fraction) |
| $p_n / q_n$ | Phân số hội tụ thứ $n$ (convergent) |
| $\lfloor x \rfloor$ | Phần nguyên của $x$ (floor function) |
| $\langle \alpha \rangle$ | Phần thập phân của $\alpha$ (fractional part) |
| $\mathbb{Z}[i]$ | Vành số nguyên Gauss $\{a+bi : a,b \in \mathbb{Z}\}$ |
| $N(\alpha)$ | Norm của Gaussian integer $\alpha = a+bi$, $N(\alpha) = a^2+b^2$ |
| $r_2(n)$ | Số cách biểu diễn $n$ thành tổng hai bình phương |
| $d_k(n)$ | Số ước dương của $n$ đồng dư $k \pmod 4$ |
