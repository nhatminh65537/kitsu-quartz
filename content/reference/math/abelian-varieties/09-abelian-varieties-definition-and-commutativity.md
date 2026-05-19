---
title: "09. Abelian Varieties — Definition and Commutativity"
tags: [math, abelian-varieties, module-01, lesson-09]
aliases: [Abelian Varieties Definition Commutativity]
created: 2026-05-18
---

> **Prerequisites**: [[07-algebraic-groups|07. Algebraic Groups — What Are They?]], [[08-rigidity-lemma|08. The Rigidity Lemma]]
> **Objectives**:
> - Nắm vững định nghĩa chính thức của abelian variety
> - Chứng minh rằng mọi abelian variety đều giao hoán (commutative)
> - Hiểu tại sao chiều 1 chính xác là elliptic curve
> - Nắm vững điều kiện "connected" và "complete" — cả hai đều không thể thiếu

---

## Motivation / Intuition

Sau khi đã hiểu algebraic group là gì (Bài 07) và Rigidity Lemma (Bài 08), chúng ta sẵn sàng để định nghĩa nhân vật chính của cả khoá học: **abelian variety**.

Tên gọi "abelian" xuất phát từ Niels Henrik Abel (1802–1829), người đã nghiên cứu "abelian integrals" — tích phân dọc theo các đường cong đại số bậc cao. Trong lý thuyết hiện đại, abelian variety là generalization của elliptic curve sang chiều cao hơn: nó mang đồng thời cấu trúc của variety (hình học) và cấu trúc nhóm (đại số), nhưng bây giờ chúng ta yêu cầu variety phải **complete** (analog của compact trong tô-pô). Chính tính chất complete này buộc nhóm phải giao hoán — một kết quả phi hiển nhiên và rất đẹp.

Điều đáng kinh ngạc: commutativity của abelian variety KHÔNG phải là giả thiết đặt ra bởi định nghĩa. Nó là **hệ quả** của hai điều kiện hình học: complete và connected. Đây là một ví dụ tuyệt vời về cách hình học "cưỡng buộc" đại số.

---

## Định Nghĩa Chính Thức

> [!definition] Definition 9.1 — Abelian Variety
> Một **abelian variety** trên trường $k$ là một **connected complete group variety** $(A, m, \iota, e)$ trên $k$.
>
> Nghĩa là:
> - $A$ là một $k$-variety,
> - $m: A \times A \to A$, $\iota: A \to A$, $e \in A(k)$ làm cho $(A, m, \iota, e)$ là algebraic group,
> - $A$ là **connected** (connected như scheme, không phải chỉ topologically),
> - $A$ là **complete** (mọi projection $A \times Y \to Y$ đều là closed map).

> [!note] Remark 9.2 — Equivalent Formulations
> Nhiều tài liệu định nghĩa abelian variety theo các cách tương đương:
>
> - Milne (2022): "A complete connected group variety is called an abelian variety."
> - Mumford (1970): "A projective algebraic variety with a group structure such that the group operations are morphisms."
> - Wikipedia: "A smooth projective algebraic variety that is also an algebraic group."
>
> Ba định nghĩa này tương đương nhau: complete $\Leftrightarrow$ projective (cho group varieties, sẽ chứng minh ở Bài 13), và smooth tự động (Theorem 7.12).

> [!definition] Definition 9.3 — Dimension of Abelian Variety
> **Chiều** (dimension) của abelian variety $A$ là $g = \dim_k A$ (chiều như variety). Ký hiệu: $A/k$ là abelian variety of dimension $g$, hay $A \in \mathcal{A}_g$.

---

## Commutativity: Kết Quả Trung Tâm

> [!theorem] Theorem 9.4 — Mọi Abelian Variety Đều Giao Hoán (Mumford)
> Cho $A$ là một abelian variety. Thì group law $+: A \times A \to A$ là **giao hoán**: với mọi $x, y \in A$,
>
> $$
> x + y = y + x
> $$

**Proof.** (Dùng Rigidity Lemma — Theorem 8.3)

Xét **commutator map** (ánh xạ giao hoán tử):

$$
\phi: A \times A \to A, \quad \phi(x, y) = x + y + (-x) + (-y)
$$

(Trong ký hiệu cộng: $\phi(x, y) = x + y - x - y$. Nếu group law không giao hoán, $\phi$ có thể non-trivial.)

Tính $\phi$ trên các fiber:

$$
\phi(x, e) = x + e + (-x) + (-e) = x - x = e
$$

$$
\phi(e, y) = e + y + (-e) + (-y) = y - y = e
$$

Vậy $\phi$ gửi $A \times \{e\}$ về $\{e\}$ và $\{e\} \times A$ về $\{e\}$.

Áp dụng **Rigidity Lemma** (Theorem 8.3) với $X = A$ (complete!), $Y = A$, $Z = A$, $x_0 = e$, $y_0 = e$, $z_0 = e$: vì $\phi(A \times \{e\}) = \{e\}$ và $\phi(\{e\} \times A) = \{e\}$, ta kết luận $\phi \equiv e$.

Tức là với mọi $x, y \in A$:

$$
x + y - x - y = e \implies x + y = y + x
$$

$\blacksquare$

> [!note] Remark 9.5 — Tính Thiết Yếu Của "Complete"
> Chứng minh trên CHỈ hoạt động vì $A$ là **complete** (để áp dụng Rigidity Lemma). Nếu $A$ không complete — ví dụ $\operatorname{GL}_n$ với $n \geq 2$ — thì Rigidity Lemma không áp dụng được, và quả thật $\operatorname{GL}_2$ không giao hoán.
>
> Tính "connected" cũng cần thiết: một group variety không connected có thể có component không giao hoán.

---

## Hệ Quả Và Quy Ước Ký Hiệu

Vì abelian variety giao hoán, chúng ta dùng **ký hiệu cộng** cho group law:

> [!definition] Definition 9.6 — Additive Notation
> Với abelian variety $A$:
> - Group law: $+: A \times A \to A$, ký hiệu $x + y$
> - Phần tử đơn vị: $0_A$ (hay $O$, hay $e$)
> - Phần tử nghịch đảo: $-x$ (thay vì $x^{-1}$)
> - Nhân với số nguyên $n$: $[n](x) = \underbrace{x + x + \cdots + x}_{n \text{ lần}}$ (sẽ định nghĩa chính thức ở Bài 11)

> [!corollary] Corollary 9.7 — Nhóm $A(k)$ là Abelian
> Tập các $k$-rational points $A(k)$ với group law $+$ là một **abelian group** (nhóm Abel thông thường trong lý thuyết nhóm cổ điển).

---

## Chiều 1: Elliptic Curve

> [!theorem] Theorem 9.8 — Abelian Variety Chiều 1 = Elliptic Curve
> Một abelian variety $A$ có $\dim A = 1$ nếu và chỉ nếu $A$ là một **elliptic curve** (smooth projective curve of genus 1 với một điểm $k$-rational được chọn làm origin).

**Proof sketch.** ($\Rightarrow$) Nếu $A$ là abelian variety of dimension 1: $A$ là smooth projective curve (vì complete + smooth + dim 1 = projective curve), và có group law. Người ta chứng minh $A$ có genus 1 bằng cách tính $H^0(A, \Omega^1_{A/k}) = k$ (differential forms) — điều này tương đương với genus 1. Điểm $O = e_A$ là rational point. Vậy $A$ là elliptic curve.

($\Leftarrow$) Đây là chiều ngược: elliptic curve có group law được định nghĩa bởi rational functions, nên là algebraic group. Là smooth projective curve nên complete. Và connected (vì curve). Do đó là abelian variety. $\blacksquare$

> [!example] Example 9.9 — Verification: $E: y^2 = x^3 + ax + b$
> Xác nhận $E$ là abelian variety:
>
> **Complete**: $E$ là smooth projective curve trong $\mathbb{P}^2$ — tất cả projective varieties đều complete (Bài 03).
>
> **Connected**: $E$ là irreducible (single component) — mọi variety irreducible đều connected.
>
> **Group variety**: group law $(x_1, y_1) + (x_2, y_2) = (x_3, y_3)$ với:
>
> $$
> \lambda = \frac{y_2 - y_1}{x_2 - x_1}, \quad x_3 = \lambda^2 - x_1 - x_2, \quad y_3 = \lambda(x_1 - x_3) - y_1
> $$
>
> là rational functions trong $x_1, y_1, x_2, y_2$ — do đó là morphism of varieties.
>
> **Commutativity**: Từ Theorem 9.4, hoặc trực tiếp: $\lambda = (y_2 - y_1)/(x_2 - x_1) = (y_1 - y_2)/(x_1 - x_2)$ đối xứng, nên $(x_3, y_3)$ không đổi khi hoán đổi $P$ và $Q$.

---

## Chiều Cao Hơn: Jacobians

> [!example] Example 9.10 — Jacobian Variety (Preview)
> Cho $C$ là smooth projective curve of genus $g$ trên $k$. **Jacobian variety** $J(C) = \operatorname{Pic}^0(C)$ (degree-0 part of Picard group) là abelian variety of dimension $g$.
>
> - $g = 1$: $C$ là elliptic curve và $J(C) \cong C$ (as abelian variety).
> - $g = 2$: $J(C)$ là abelian surface (dimension 2).
> - $g = 3$: $J(C)$ là abelian 3-fold.
>
> Đây sẽ được nghiên cứu chi tiết trong Module 6 (Bài 38).

---

## Các Tính Chất Cơ Bản

> [!theorem] Theorem 9.11 — Abelian Variety Luôn Là Projective
> Mọi abelian variety $A$ đều là **projective variety** (có thể nhúng được vào $\mathbb{P}^N$ cho $N$ đủ lớn).

**Proof.** Đây là một kết quả sâu, sẽ được chứng minh đầy đủ ở Bài 13 (dùng Theorem of the Cube). $\blacksquare$

> [!theorem] Theorem 9.12 — Abelian Varieties Là Group Đơn Giản (Theo Nghĩa Hình Học)
> Cho $A$ là abelian variety. Nếu $f: A \to B$ là surjective homomorphism lên abelian variety $B$, thì $\ker(f)$ là một finite group scheme (subgroup hữu hạn), gọi là **isogeny** (sẽ nghiên cứu ở Module 2).

---

## SageMath Cheatsheet

```python
E = EllipticCurve(GF(97), [2, 3])

P = E.random_point()
Q = E.random_point()

assert P + Q == Q + P, "Commutativity failed!"
print("E is commutative: True")

print("dim(E) = 1 (elliptic curve)")
print("E is projective:", E.is_projective())

print("E.genus() =", E.genus())

E_product_points = [(P, Q) for P in E.points()[:3] for Q in E.points()[:3]]
for p, q in E_product_points[:3]:
    assert p + q == q + p
print("Commutativity verified on first 9 pairs")
```

---

## Summary / Key Takeaways

- **Abelian variety** = connected complete group variety trên $k$.
- **Commutativity** là hệ quả của tính complete + connected, không phải giả thiết: Rigidity Lemma cho thấy commutator map $\phi(x,y) = x+y-x-y$ phải là constant.
- Dùng ký hiệu cộng $(+, 0, -)$ vì abelian variety giao hoán.
- Chiều 1: abelian variety $\Leftrightarrow$ elliptic curve (smooth projective genus-1 curve với rational point).
- Chiều $g$: abelian variety $A$ có $g = \dim A$, và $A$ chứa cấu trúc nhóm phong phú liên quan đến số $g$.
- Jacobian $J(C)$ của curve genus $g$ là abelian variety $g$-chiều — ví dụ quan trọng nhất.
- Mọi abelian variety đều projective (sẽ chứng minh Bài 13).

---

## References

- Mumford, D. *Abelian Varieties*, Chapter I, §2 (Commutativity). Oxford University Press, 1970.
- Milne, J.S. *Abelian Varieties* (2022), §2 (Rigidity Theorem → Commutativity). [https://www.jmilne.org/math/xnotes/AVs.pdf](https://www.jmilne.org/math/xnotes/AVs.pdf)
- van der Geer, G. & Moonen, B. *Abelian Varieties*, Chapter I. [http://van-der-geer.nl/~gerard/AV.pdf](http://van-der-geer.nl/~gerard/AV.pdf)
- Conrad, B. *Abelian Varieties* (Stanford), Lecture 4 — Commutativity. [http://virtualmath1.stanford.edu/~conrad/mordellsem/Notes/L02.pdf](http://virtualmath1.stanford.edu/~conrad/mordellsem/Notes/L02.pdf)
