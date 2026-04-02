---
title: "Functional Analysis"
tags: [math, functional-analysis, index]
created: 2026-03-31
---

> **Level**: Graduate | **Background**: Real Analysis, Linear Algebra | **SageMath**: Có

---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[01-metric-spaces-topology|01. Metric Spaces & Topology Review]] — Không gian metric, open/closed sets, dãy Cauchy, completeness, compactness, separability. Nền tảng topo cho toàn bộ Functional Analysis.
- [[02-normed-spaces-banach|02. Normed Spaces & Banach Spaces]] — Norm, không gian chuẩn, Banach space. Ví dụ: $\ell^p$, $C[a,b]$. Bất đẳng thức Hölder & Minkowski (dãy). Tiêu chuẩn Banach bằng chuỗi tuyệt đối hội tụ.
- [[03-bounded-linear-operators|03. Bounded Linear Operators]] — Toán tử tuyến tính bị chặn, bị chặn $\iff$ liên tục. Norm toán tử, $B(X,Y)$ là Banach. Không gian đối ngẫu $X^*$. Kernel và range.
- [[04-baire-ubp|04. Fundamental Theorems I — Baire & UBP]] — Baire Category Theorem, Uniform Boundedness Principle (Banach–Steinhaus). Ứng dụng: phân kỳ chuỗi Fourier.
- [[05-open-mapping-closed-graph|05. Fundamental Theorems II — Open Mapping & Closed Graph]] — Open Mapping Theorem, Bounded Inverse Theorem, Closed Graph Theorem. Ba định lý nền tảng hoàn chỉnh.
- [[06-hahn-banach-duality|06. Hahn-Banach Theorem & Duality]] — Hahn-Banach (dạng giải tích và hình học), separation theorems. Double dual $X^{**}$, reflexive spaces, hội tụ yếu.
- [[07-lebesgue-measure|07. Lebesgue Measure]] — Outer measure, Caratheodory criterion, $\sigma$-algebra, Borel sets, đo Lebesgue. Tập Cantor, hàm đo được, almost everywhere.
- [[08-lebesgue-integration|08. Lebesgue Integration]] — Tích phân Lebesgue xây dựng 3 bước. MCT, Fatou's Lemma, DCT. So sánh Riemann vs Lebesgue. Fubini và Tonelli.
- [[09-lp-spaces|09. Lp Spaces]] — $L^p(\mu)$, Hölder & Minkowski (dạng tích phân), Riesz-Fischer ($L^p$ Banach), duality $(L^p)^* \cong L^q$, density results.
- [[10-hilbert-spaces|10. Hilbert Spaces]] — Inner product space, Cauchy-Schwarz, Parallelogram Law. Projection Theorem: $H = M \oplus M^\perp$. Riesz Representation Theorem: $H^* \cong H$. Adjoint operators.
- [[11-onb-fourier|11. Orthonormal Bases & Fourier Series]] — Hệ trực chuẩn, Gram-Schmidt, bất đẳng thức Bessel, đồng nhất thức Parseval. ONB trong $\ell^2$. Chuỗi Fourier trong $L^2[-\pi,\pi]$.
- [[12-compact-operators|12. Compact Operators]] — Định nghĩa và tính chất compact operators. Phổ Riesz-Schauder: eigenvalue $\to 0$. Fredholm Alternative. Toán tử Hilbert-Schmidt.
- [[13-spectral-theory|13. Spectral Theory — Banach Algebras]] — Banach algebras, C*-algebras. Spectrum, resolvent. Phổ luôn compact và không rỗng (Liouville). Spectral Radius Formula. Gelfand transform.
- [[14-spectral-theorem|14. Spectral Theorem]] — Spectral Theorem cho compact self-adjoint: khai triển $Tx = \sum \lambda_n \langle x, e_n\rangle e_n$. Spectral measure (PVM). Continuous functional calculus $f \mapsto f(T)$.

## Appendices

- [[a0-proof-of-baire|A0. Proof of Baire Category Theorem]] — Chứng minh đầy đủ bằng nested closed balls. Hệ quả: giao đếm được tập mở trù mật vẫn trù mật.
- [[a1-proof-hahn-banach|A1. Proof of Hahn-Banach Theorem]] — Lemma mở rộng một chiều + Zorn's Lemma. Phiên bản phức (Bohnenblust-Sobczyk).
- [[a2-proof-open-mapping|A2. Proof of Open Mapping Theorem]] — Hai bước: BCT cho bao đóng, rồi dùng $X$ Banach để hội tụ chuỗi.
- [[a3-radon-nikodym-lp-duality|A3. Radon-Nikodym & Duality of Lp]] — Proof Radon-Nikodym bằng Riesz Representation. Proof $(L^p)^* \cong L^q$. Tại sao $(L^\infty)^* \supsetneq L^1$.
- [[a4-spectral-theorem-proof|A4. Spectral Theorem — Chi tiết]] — Lemma $\|T\| = \sup|\langle Tx,x\rangle|$. Proof đầy đủ Spectral Theorem (compact + bounded). Functional calculus. Multiplication operator.

---

## Notation Guide

| Symbol | Ý nghĩa |
|--------|---------|
| $(X, d)$ | Không gian metric |
| $(X, \|\cdot\|)$ | Không gian chuẩn |
| $\|x\|$ | Norm của $x$ |
| $B(x_0, r)$ | Quả cầu mở tâm $x_0$, bán kính $r$ |
| $B(X, Y)$ | Không gian toán tử tuyến tính bị chặn từ $X$ vào $Y$ |
| $\|T\|$ | Norm toán tử: $\sup_{\|x\|=1}\|Tx\|$ |
| $X^*$ | Không gian đối ngẫu của $X$ |
| $X^{**}$ | Double dual |
| $\iota: X \to X^{**}$ | Nhúng chính tắc |
| $x_n \xrightarrow{w} x$ | Hội tụ yếu |
| $m^*(E)$ | Lebesgue outer measure của $E$ |
| $m(E)$ | Lebesgue measure của $E$ |
| $\mathcal{L}$ | $\sigma$-algebra của tập Lebesgue đo được |
| $\mathcal{B}(\mathbb{R})$ | Borel $\sigma$-algebra |
| a.e. | Almost everywhere (ngoại trừ tập có độ đo 0) |
| $L^p(\mu)$ | Không gian $L^p$ với đo $\mu$ |
| $\|f\|_p$ | Norm $L^p$: $\left(\int \|f\|^p d\mu\right)^{1/p}$ |
| $\frac{1}{p} + \frac{1}{q} = 1$ | $p, q$ là cặp Hölder liên hợp |
| $f^+$, $f^-$ | Phần dương/âm: $f^+ = \max(f,0)$, $f^- = \max(-f,0)$ |
