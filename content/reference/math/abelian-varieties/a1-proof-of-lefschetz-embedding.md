---
title: "A1. Proof of the Lefschetz Embedding Theorem"
tags: [math, abelian-varieties, appendix]
aliases: [Proof of Lefschetz Embedding Theorem]
created: 2026-03-24
---

> **Xem thêm**: [[06-abelian-varieties-are-projective|06. Abelian Varieties are Projective]], [[04-abelian-varieties-over-c|04. Abelian Varieties over C]]
> **Mục tiêu**: Chứng minh rằng abelian variety là projective từ existence of ample line bundle

---

## Mục Tiêu

**Lefschetz Embedding Theorem**: Cho $A$ abelian variety (complex torus có Riemann form). Khi đó $A$ là projective algebraic variety, và cụ thể $\mathcal{L}^{\otimes 3}$ là very ample với $\mathcal{L}$ ample line bundle bất kỳ.

Ta sẽ:
1. Chứng minh $\mathcal{L}$ ample $\Rightarrow$ $\mathcal{L}^{\otimes 3}$ very ample (Lefschetz's theorem).
2. Phác thảo proof theo approach qua theta functions.

---

## Setup: Line Bundles trên Complex Tori

Cho $A = V/\Lambda$ ($V = \mathbb{C}^g$, $\Lambda$ lattice rank $2g$) và $\mathcal{L} = \mathcal{L}(H, \chi)$ line bundle tương ứng với Appell–Humbert datum $(H, \chi)$ (Theorem 2.9, Lesson 02):

- $H$ là Hermitian form trên $V$ với $\operatorname{Im}(H)|_{\Lambda \times \Lambda}$ integer-valued.
- $\chi : \Lambda \to U(1)$ là semicharacter.

$\mathcal{L}$ ample $\Leftrightarrow$ $H$ positive definite.

---

## Sections của $\mathcal{L}$: Theta Functions

> [!abstract] Lemma A1.1 — $h^0(A, \mathcal{L}) = \sqrt{\deg \phi_\mathcal{L}} = \det(E)^{1/2}$
> Với $\mathcal{L} = \mathcal{L}(H, \chi)$ ample (H positive definite), $h^0(A, \mathcal{L}) = d_1 d_2 \cdots d_g$ với $(d_1, \ldots, d_g)$ là type của polarization.
>
> Đặc biệt với principal polarization: $h^0 = 1$ (duy nhất một theta function tới scalar).

**Proof.** Sections của $\mathcal{L}$ tương ứng với theta functions:
$$
\theta : V \to \mathbb{C}, \quad \theta(v + \lambda) = \chi(\lambda) e^{\pi H(v,\lambda) + \pi H(\lambda,\lambda)/2} \theta(v), \quad \forall \lambda \in \Lambda.
$$
Đây là "theta functions với quasi-periodicity theo $\Lambda$". Số chiều của không gian theta functions = $d_1 \cdots d_g$ (tính toán qua Fourier analysis trên torus). $\blacksquare$

---

## Proof rằng $\mathcal{L}^{\otimes 3}$ Very Ample

> [!abstract] Theorem A1.2 — Lefschetz: $\mathcal{L}^{\otimes 3}$ Very Ample
> Với $\mathcal{L}$ ample, $\mathcal{L}^{\otimes 3}$ là very ample và định nghĩa embedding $A \hookrightarrow \mathbb{P}^N$.

**Proof** (theo Mumford):

**Bước 1: Enough sections.** Với $n \geq 3$, map evaluation:
$$
H^0(A, \mathcal{L}^n) \otimes \mathcal{O}_A \to \mathcal{L}^n
$$
là surjective (base-point free). Điều này từ: với $\mathcal{L}$ ample, sections của $\mathcal{L}^n$ đủ để separate points khi $n \geq 3$ (theo bound từ theta functions).

**Bước 2: Separate points.** Cần show: với $x \neq y \in A(\bar{k})$, tồn tại $s \in H^0(A, \mathcal{L}^n)$ với $s(x) \neq 0$ và $s(y) = 0$.

Dùng theta functions: với $n \geq 3$ và $x \neq y$, ta có thể xây dựng theta function phân biệt $x$ và $y$.

Cụ thể, dùng **factorization**: nếu $\theta$ là theta function bậc $n = 3$, ta có thể viết $\theta = \theta_1 \cdot \theta_2$ (product của hai theta functions bậc thấp hơn) và điều chỉnh zeros.

**Bước 3: Separate tangent vectors.** Tương tự bước 2 nhưng dùng first-order Taylor expansion của theta functions.

**Bước 4: Conclusion.** Map $\varphi_{\mathcal{L}^3} : A \to \mathbb{P}(H^0(A, \mathcal{L}^3)^*)$ là closed immersion. $\blacksquare$

---

## Algebraic Proof (Mumford §17)

> [!abstract] Theorem A1.3 — $\mathcal{L}^3$ Very Ample (Algebraic)
> Trên trường tùy ý $k$: nếu $\mathcal{L}$ ample trên abelian variety $A$, thì $\mathcal{L}^3$ very ample.

**Proof sketch** (Mumford):

**Bước 1**: Vì $\mathcal{L}$ ample, $\mathcal{L}^n$ very ample với $n$ đủ lớn. Ta cần $n = 3$ là đủ.

**Bước 2**: Dùng **Mumford's criterion**: $\mathcal{M}$ very ample khi và chỉ khi:
(a) $\mathcal{M}$ base-point free, và
(b) map $\varphi_\mathcal{M}$ injective + injective on tangent spaces.

**Bước 3**: Với $\mathcal{L}^n$ ($n \geq 3$), base-point freeness từ:
$$
\Gamma(A, \mathcal{L}^n \otimes t_x^* \mathcal{L}^{n,-1}) \neq 0, \quad \forall x \in A.
$$

Đây là consequence của Künneth formula và tính chất cohomology:
$$
H^0(A, \mathcal{L}^n) \otimes H^0(A, \mathcal{L}^n) \to H^0(A \times A, p_1^*\mathcal{L}^n \otimes p_2^*\mathcal{L}^n)
$$
là surjective.

**Bước 4**: Injectivity của $\varphi_{\mathcal{L}^3}$: sử dụng đặc tính $K(\mathcal{L}) \subset A[n]$ (finite group scheme). Với $n = 3$, điều kiện $K(\mathcal{L}^3) \supset K(\mathcal{L})$ thỏa mãn và tập $K(\mathcal{L}^3)$ đủ nhỏ để đảm bảo injection.

**Bước 5**: Injectivity on tangent vectors tương tự. $\blacksquare$

---

## Tại Sao $n = 3$ (Và Không Phải $n = 2$)?

> [!note] Remark A1.4
> Tại sao $\mathcal{L}^2$ chưa đủ? Ví dụ phản: với $A$ abelian surface và $\mathcal{L}$ theta divisor (principal polarization), $\mathcal{L}^2$ **không** very ample vì $h^0(\mathcal{L}^2) = 4$ nhưng $\varphi_{\mathcal{L}^2} : A \to \mathbb{P}^3$ **không** immersion (image có degree $8$ nhưng $A$ chiều 2 trong $\mathbb{P}^3$ sẽ có degree $\leq 4$).
>
> Với $n = 3$: $h^0(\mathcal{L}^3) = 9$, $\varphi_{\mathcal{L}^3} : A \hookrightarrow \mathbb{P}^8$ là embedding.
>
> Số tối thiểu thực tế phụ thuộc type: với type $(d_1, \ldots, d_g)$, $\mathcal{L}^n$ very ample khi $n \geq 4$ tổng quát; $n = 3$ đủ khi $\mathcal{L}$ primitive (tức là $K(\mathcal{L})$ minimal).

---

## Tóm Tắt

```text
L ample (H positive definite)
     ↓
h^0(L^n) = n^g * h^0(L) [Riemann-Roch]
     ↓
L^n base-point free với n >= 1 [theta functions đủ]
     ↓
L^n: injection on points với n >= 2 [separation]
     ↓
L^n: injection on tangent vectors với n >= 3
     ↓
L^3 very ample => embedding A -> P^N    ✓
```

---

## References

- Mumford, D. *Abelian Varieties*, §§16–17 (Cohomology of Line Bundles, Projectivity).
- Milne, J.S. *Abelian Varieties*, §7 (Abelian Varieties are Projective).
- Birkenhake, C. & Lange, H. *Complex Abelian Varieties*, §4.5 (Lefschetz Theorem).
