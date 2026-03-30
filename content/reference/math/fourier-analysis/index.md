---
title: "Fourier Analysis"
tags: [math, fourier-analysis, index]
created: 2026-03-24
---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[01-lebesgue-measure|01. Lebesgue Measure & Sigma-Algebras]] — σ-algebra, Borel sets, Lebesgue outer measure, measurable sets, null sets. Nền tảng measure theory không thể thiếu cho Fourier graduate level.
- [[02-lebesgue-integral-lp|02. Tích phân Lebesgue & Không gian L^p]] — Xây dựng tích phân Lebesgue qua 3 bước (simple functions → hàm không âm → tổng quát). Ba định lý hội tụ: MCT, Fatou, DCT. Không gian $L^p$, bất đẳng thức Hölder & Minkowski, định lý Riesz-Fischer ($L^p$ là Banach space), $L^2$ là Hilbert space.

- [[03-fourier-series-intro|03. Chuỗi Fourier — Định nghĩa & Ví dụ]] — Hàm tuần hoàn, tính trực giao của $\{e^{inx}\}$, hệ số Fourier, chuỗi Fourier dạng phức và lượng giác. Ví dụ: sóng vuông ($O(1/n)$), sóng tam giác ($O(1/n^2)$), Gibbs phenomenon.
- [[04-pointwise-convergence|04. Hội Tụ Pointwise & Đồng Đều]] — Dirichlet kernel ($S_N f = f * D_N$), tiêu chuẩn Dini, định lý Dirichlet-Jordan (hội tụ tại điểm nhảy). Fejér kernel (dương), định lý Fejér (Cesàro summability, uniform convergence cho $C(\mathbb{T})$). Định lý Carleson ($L^2 \Rightarrow$ a.e. convergence).
- [[05-l2-theory|05. Lý Thuyết L² của Chuỗi Fourier]] — Bessel's inequality, Best Approximation ($S_N f$ là phép chiếu trực giao), Parseval's Identity ($\lVert f \rVert_2^2 = \sum |\hat{f}(n)|^2$), tính đầy đủ của $\{e^{inx}\}$, isomorphism $L^2(\mathbb{T}) \cong \ell^2(\mathbb{Z})$. Ứng dụng: Basel problem $\pi^2/6$.

- [[06-fourier-transform-l1|06. Fourier Transform trên L¹(ℝ)]] — Định nghĩa FT trên $L^1$, tính chất (shift, modulation, đạo hàm). Riemann-Lebesgue Lemma: $\mathcal{F}: L^1 \to C_0$. FT kinh điển: Gaussian (eigenfunction), hàm chữ nhật (sinc), hàm mũ một phía. Fourier Inversion Theorem.
- [[07-convolution|07. Convolution & Phép Biến Đổi]] — Young's inequality, Convolution Theorem ($\widehat{f*g} = \hat{f}\hat{g}$), smoothing effect. Approximate identity, Gaussian kernel $H_t = \frac{e^{-x^2/(4t)}}{\sqrt{4\pi t}}$, semigroup property $H_s * H_t = H_{s+t}$. Ứng dụng: giải heat equation $u_t = u_{xx}$, signal filtering.
- [[08-fourier-transform-l2|08. Fourier Transform trên L² & Plancherel]] — Schwartz space $\mathcal{S}(\mathbb{R})$ (hàm $C^\infty$ giảm nhanh), $\mathcal{F}: \mathcal{S} \to \mathcal{S}$ là automorphism. Plancherel Theorem ($\lVert \hat{f} \rVert_2 = \sqrt{2\pi}\lVert f \rVert_2$), extension sang $L^2$ bằng density. $\mathcal{F}$ là unitary operator. Heisenberg Uncertainty Principle ($\Delta x \cdot \Delta\xi \geq 1/2$).

- [[09-distributions|09. Distributions & Không Gian Tempered]] — Tempered distributions $\mathcal{S}'$ = dual topo của $\mathcal{S}$. Dirac delta ($\langle\delta,\varphi\rangle=\varphi(0)$), Heaviside ($H'=\delta$), principal value. Đạo hàm distribution, FT trên $\mathcal{S}'$ qua duality. Bảng: $\hat{\delta}=1$, $\hat{1}=2\pi\delta$, $\widehat{e^{i\xi_0 x}}=2\pi\delta(\xi-\xi_0)$. Poisson Summation Formula.
- [[10-dft|10. Discrete Fourier Transform (DFT)]] — Định nghĩa DFT/IDFT, primitive $N$-th root of unity $\omega_N$. DFT matrix (Vandermonde), tính unitary → Parseval rời rạc. Tính chất: shift, modulation, Hermitian symmetry. Circular convolution, DFT Convolution Theorem, zero-padding cho linear conv. NumPy FFT cheat sheet.
- [[11-fft|11. Fast Fourier Transform (FFT)]] — Tại sao DFT $O(N^2)$ không khả dụng. Cooley-Tukey Radix-2: chia chẵn/lẻ, butterfly $(E[k]\pm W\cdot O[k])$, twiddle factors. Recurrence $T(N)=2T(N/2)+N/2 \Rightarrow O(N\log N)$. Bit-reversal permutation. Python implementation từ đầu. Variant: Radix-4, mixed-radix, Bluestein.

- [[12-sampling|12. Sampling & Nyquist-Shannon Theorem]] — Ideal sampling = nhân với Dirac comb, phổ = tổng replicas. Aliasing khi $\omega_s < 2B$. Nyquist-Shannon: band-limited $\Rightarrow$ recover hoàn toàn khi $f_s > 2f_{\max}$. Whittaker-Shannon interpolation formula. Anti-aliasing filter.
- [[13-filters|13. Filters & Spectral Analysis]] — LTI filter = convolution, frequency response = FT của impulse response. FIR vs IIR. Low/high/band-pass filters. Spectral leakage, windowing (Hann/Hamming/Blackman). STFT: $X(m,\omega) = \sum x[n]w[n-m]e^{-i\omega n}$. Spectrogram. Gabor limit $\Delta t \cdot \Delta f \geq 1/(4\pi)$.
- [[14-ntt|14. Number Theoretic Transform (NTT)]] — DFT trong $\mathbb{Z}_q$: primitive $n$-th root of unity, điều kiện $q \equiv 1 \pmod{n}$. NTT/INTT formula, Convolution Theorem trong $\mathbb{Z}_q$. Cyclic NTT ($x^n-1$) và negacyclic NTT ($x^n+1$, cần $q\equiv 1\pmod{2n}$). Fast NTT $O(n\log n)$. Python implementation.
- [[15-ntt-crypto|15. NTT trong Lattice Crypto & ZK Proofs]] — Ring-LWE: từ LWE sang $R_q=\mathbb{Z}_q[x]/(x^n+1)$. Kyber ($q=3329$, 7-layer NTT), Dilithium ($q=8380417$, full NTT), Falcon. FRI/STARKs = polynomial evaluation tại $2^k$ points = NTT. PLONK/KZG/Groth16 via NTT. FFT = NTT = character theory của nhóm Abel.

## Appendices

- [[a0-riemann-lebesgue|A0. Proof of Riemann-Lebesgue Lemma]] — Chứng minh đầy đủ: $\hat{f} \in C_0$ với $f \in L^1$
- [[a1-plancherel-theorem|A1. Proof of Plancherel Theorem]] — Full proof via Schwartz space extension + isometry
- [[a2-proof-of-fejer-theorem|A2. Proof of Fejér's Theorem]] — Hội tụ Cesàro, approximate identity dương
- [[a3-cooley-tukey-fft|A3. Cooley-Tukey FFT Derivation]] — Chi tiết từng bước divide-and-conquer, correctness proof

## Notation Guide

| Symbol | Meaning |
|--------|---------|
| $\mathbb{R}$ | Tập số thực |
| $\mathbb{C}$ | Tập số phức |
| $\mathcal{M}$ | Họ các tập đo được (measurable sets) |
| $\mu$ | Lebesgue measure |
| $\mu^*$ | Lebesgue outer measure |
| $\mathcal{B}(\mathbb{R})$ | Borel sigma-algebra trên $\mathbb{R}$ |
| $L^p(E)$ | Không gian L^p trên tập đo được $E$ |
| $\lVert f \rVert_p$ | L^p norm của hàm $f$ |
| $\hat{f}$ | Fourier transform của $f$ |
| $\hat{f}(n)$ | Hệ số Fourier thứ $n$ của $f$ |
| $*$ | Phép convolution |
| $\mathcal{S}(\mathbb{R})$ | Schwartz space |
| $\mathcal{S}'(\mathbb{R})$ | Tempered distributions |
| $\omega_n$ | Primitive $n$-th root of unity |
| $\mathbb{Z}_q$ | Vành số nguyên modulo $q$ |
