---
title: 03. Completeness and Proper Maps
tags:
  - math
  - abelian-varieties
aliases:
  - Completeness and Proper Maps
created: 2026-05-17
---

> **Prerequisites**: [[01-affine-projective-varieties|01. Affine and Projective Varieties]], [[02-morphisms-of-varieties|02. Morphisms of Varieties]] — affine/projective variety, morphism, rational map.
> **Objectives**:
> - Hiểu tại sao affine variety "không đầy đủ" và projective variety "đầy đủ hơn"
> - Định nghĩa chính xác đa tạp đầy đủ (complete variety) và cấu xạ proper (proper morphism)
> - Chứng minh (sketch) rằng mọi projective variety đều là complete
> - Rút ra các hệ quả quan trọng: hàm chính quy trên complete variety là hằng số
> - Kết nối với abelian variety: tại sao completeness là điều kiện trung tâm

---

## Motivation / Intuition

Xét $\mathbb{A}^1$ — đường thẳng affine. Dãy điểm $1, 2, 3, \ldots$ trong $\mathbb{A}^1$ "đi ra vô cực" — không có giới hạn trong $\mathbb{A}^1$. Điều này có nghĩa $\mathbb{A}^1$ **không compact** (theo nghĩa tô-pô thông thường). Hơn nữa, trong bối cảnh đại số, nó có nghĩa là ánh xạ chiếu $\pi: \mathbb{A}^1 \times \mathbb{A}^1 \to \mathbb{A}^1$ không bảo toàn tính đóng: hình chiếu của $V(xy - 1) = \{(x, 1/x) : x \neq 0\} \subseteq \mathbb{A}^1 \times \mathbb{A}^1$ là $\mathbb{A}^1 \setminus \{0\}$ — tập mở, không đóng!

Ngược lại, $\mathbb{P}^1$ "đầy đủ hơn" vì có thêm điểm $\infty = [1:0]$. Và nhìn chung, **projective varieties** là "compact" trong nghĩa đại số — chúng không có "điểm thiếu ở vô cực". Tính chất này được gọi là **completeness** và là nền tảng cho lý thuyết abelian varieties.

---

## Đa Tạp Đầy Đủ (Complete Variety)

> [!definition] Definition 3.1 — Đa tạp đầy đủ (Complete Variety)
> Một variety $X$ được gọi là **đầy đủ** (complete) nếu với mọi variety $T$, ánh xạ chiếu
>
> $$
> \pi_T: X \times T \to T
> $$
>
> là ánh xạ đóng (closed map) theo tô-pô Zariski: ảnh của mọi tập đóng $Z \subseteq X \times T$ là tập đóng trong $T$.

**Trực giác**: Đây là phiên bản đại số của tính compact trong tô-pô thông thường. Với $T = \operatorname{Spec}(k)$, điều kiện nói rằng $X$ có hữu hạn điểm tương ứng (trivially true). Điều kiện thực sự có lực khi $T$ là variety không tầm thường.

> [!warning] Counterexample 3.2 — $\mathbb{A}^1$ không complete
> Lấy $X = T = \mathbb{A}^1$. Xét tập đóng $Z = V(xy - 1) \subseteq \mathbb{A}^1 \times \mathbb{A}^1$ (hyperbol). Khi đó:
>
> $$
> \pi_T(Z) = \pi_T\!\left(\{(x, 1/x) : x \neq 0\}\right) = \mathbb{A}^1 \setminus \{0\}
> $$
>
> là tập mở, không đóng trong $\mathbb{A}^1$. Vậy $\mathbb{A}^1$ **không** complete.

> [!note] Remark 3.3 — So sánh với tô-pô thông thường
> Định nghĩa completeness giống hệt định nghĩa **hàm proper** (proper map) trong tô-pô: $f: X \to Y$ proper nếu với mọi compact $K \subseteq Y$, $f^{-1}(K)$ compact. Và một không gian Hausdorff $X$ compact khi và chỉ khi ánh xạ $X \to \{\text{pt}\}$ là proper.
>
> Trong đại số: $X$ complete $\iff$ morphism $X \to \operatorname{Spec}(k)$ là proper (theo nghĩa scheme). Đây không phải trùng hợp — đó là động lực cho định nghĩa ở trên.

---

## Cấu Xạ Proper (Proper Morphism)

> [!definition] Definition 3.4 — Proper Morphism
> Một morphism $f: X \to Y$ được gọi là **proper** nếu:
>
> 1. **Separated** (phân li): Đường chéo $\Delta: X \to X \times_Y X$ là closed immersion.
> 2. **Finite type**: Locally là morphism ring hữu hạn sinh.
> 3. **Universally closed**: Với mọi base change $Y' \to Y$, ánh xạ $f': X \times_Y Y' \to Y'$ là ánh xạ đóng.

Trong bối cảnh của khóa học (varieties over $k$ đại số đóng), điều kiện "separated" luôn thỏa; ta tập trung vào "universally closed".

> [!theorem] Theorem 3.5 — Tương đương với completeness
> Với variety $X$ over $k$:
>
> $$
> X \text{ là complete} \iff \text{morphism } X \to \operatorname{Spec}(k) \text{ là proper.}
> $$

Nói cách khác, complete variety là proper variety trên $\operatorname{Spec}(k)$.

---

## Mọi Projective Variety Đều Complete

Đây là kết quả trung tâm:

> [!theorem] Theorem 3.6 — Projective Varieties Are Complete
> Mọi projective variety $X \subseteq \mathbb{P}^n_k$ đều complete.

**Proof (sketch).** Đủ chứng minh $\mathbb{P}^n$ complete (vì sub-variety closed của complete là complete).

Phải chứng minh: với mọi variety $T$ và tập đóng $Z \subseteq \mathbb{P}^n \times T$, ảnh chiếu $\pi_T(Z) \subseteq T$ đóng.

Tính đóng là tính chất local trên $T$, nên giả sử $T = \mathbb{A}^m = \operatorname{Spec}(k[t_1,\ldots,t_m])$. Khi đó $Z$ được mô tả bởi hệ phương trình thuần nhất $F_\alpha(X_0,\ldots,X_n; t_1,\ldots,t_m) = 0$.

Điểm $(t_1^0,\ldots,t_m^0) \in T$ nằm trong $\pi_T(Z)$ khi và chỉ khi hệ $\{F_\alpha(X; t^0) = 0\}$ có nghiệm không tầm thường trong $\mathbb{P}^n$, tức là hệ thuần nhất có nghiệm ngoài $\{0\}$. Bằng **lý thuyết eliminant** (resultant/Macaulay resultant), điều kiện này là điều kiện đại số đóng trên $(t^0)$. Xem chi tiết trong Hartshorne I.5.1 hoặc Shafarevich I.5.2. $\blacksquare$

> [!theorem] Theorem 3.7 — Hệ quả: Ảnh của complete là complete
> Nếu $f: X \to Y$ là morphism và $X$ complete, thì $f(X)$ (là subvariety đóng của $Y$) cũng complete.

**Proof.** $f(X)$ là ảnh của $X$ qua morphism, nên đóng (vì $X$ complete và $Y$ separated). $f(X)$ là subvariety closed của variety quasi-projective, nên complete. $\blacksquare$

---

## Hàm Chính Quy Trên Complete Variety Là Hằng Số

> [!theorem] Theorem 3.8 — Regular functions on a complete variety
> Nếu $X$ là complete variety và $f: X \to \mathbb{A}^1$ là morphism (tức $f \in \mathcal{O}(X)$ là hàm chính quy), thì $f$ là hàm hằng.

**Proof.** 
Xét $f$ như morphism $f: X \to \mathbb{A}^1$. Ảnh $f(X) \subseteq \mathbb{A}^1$ là ảnh của complete variety $X$ qua morphism (Theorem 3.7), nên $f(X)$ là subvariety complete của $\mathbb{A}^1$.

Nhưng subvariety complete của $\mathbb{A}^1$ phải là tập đóng và complete. Trong $\mathbb{A}^1$, các tập đóng chỉ là: $\emptyset$, tập hữu hạn điểm, và $\mathbb{A}^1$. Tập hữu hạn điểm thì hiển nhiên complete. $\mathbb{A}^1$ không complete.

Vậy $f(X)$ là tập hữu hạn điểm. Nếu $X$ connected thì $f(X)$ là một điểm duy nhất, tức $f$ hằng. $\blacksquare$

> [!corollary] Corollary 3.9 — Hàm toàn cục trên projective variety là hằng số
> Nếu $X \subseteq \mathbb{P}^n$ là projective variety connected, thì $\mathcal{O}(X) = k$ — hàm chính quy toàn cục duy nhất là các hằng số.

Đây là sự khác biệt cốt lõi giữa affine và projective: trên $\mathbb{A}^n$, có vô số hàm chính quy (mọi đa thức); trên $\mathbb{P}^n$, chỉ có hằng số.

> [!example] Example 3.10 — Kết quả với elliptic curve
> Đường cong elliptic $E \subseteq \mathbb{P}^2$ là projective variety connected. Theo Corollary 3.9, $\mathcal{O}(E) = k$.
>
> Điều này có nghĩa: không có hàm "polynomial" thực sự trên $E$ ngoài hằng số. Tất cả thông tin hàm số nằm trong **hàm hữu tỉ** $k(E)$ — trường phân thức, với cực và zero.

---

## Tính Chất Của Proper Morphisms

> [!theorem] Theorem 3.11 — Proper morphism bảo toàn tính đầy đủ
> Nếu $f: X \to Y$ là proper và $Y$ complete, thì $X$ complete.

> [!theorem] Theorem 3.12 — Hợp của proper là proper
> Nếu $f: X \to Y$ và $g: Y \to Z$ đều proper, thì $g \circ f: X \to Z$ cũng proper.

> [!theorem] Theorem 3.13 — Proper × proper = proper
> Nếu $f: X \to Y$ và $f': X' \to Y'$ đều proper, thì $f \times f': X \times X' \to Y \times Y'$ cũng proper.

Các tính chất này làm cho "proper" trở thành tính chất hành xử tốt với mọi phép toán tự nhiên trong phạm trù varieties.

---

## Kết Nối Với Abelian Varieties

Đây là lý do chúng ta cần hiểu completeness ngay từ đầu:

> [!definition] Definition 3.14 — Abelian Variety (preview)
> Một **abelian variety** (đa tạp Abel) là một **complete** algebraic group. Tức là một variety $A$ vừa có cấu trúc nhóm (phép toán nhóm là morphism) vừa là complete variety.

Từ Theorem 3.8, vì $A$ complete nên $\mathcal{O}(A) = k$. Điều này có nghĩa: không có hàm "polynomial" toàn cục trên $A$ ngoài hằng số — tất cả hàm phải là hữu tỉ. Đây là lý do abelian variety phải là **projective** (sẽ chứng minh ở Bài 13 dùng lý thuyết đường thẳng ample).

> [!note] Remark 3.15 — Rigidity từ completeness
> Completeness dẫn đến một hiện tượng cứng nhắc (rigidity) mà ta sẽ phát triển ở Bài 08: mọi morphism từ complete variety vào algebraic group, nếu gửi một điểm đến identity, thì phải là group homomorphism (hay thậm chí hằng số). Đây là nền tảng của Rigidity Lemma — công cụ mạnh nhất để chứng minh tính giao hoán của abelian varieties.

---

## Từ Topological Compactness đến Algebraic Completeness

Để hiểu sâu hơn, ta so sánh:

| Tô-pô thông thường | Hình học đại số |
|---|---|
| Compact space | Complete variety |
| Proper map (preimage of compact is compact) | Proper morphism |
| Continuous image of compact is compact | Image of complete is complete |
| $[0,1]$ compact, $\mathbb{R}$ không compact | $\mathbb{P}^1$ complete, $\mathbb{A}^1$ không complete |
| Hàm liên tục trên compact có max/min | Hàm chính quy trên complete là hằng số |

Khi $k = \mathbb{C}$, projective variety $X \subseteq \mathbb{P}^n(\mathbb{C})$ với tô-pô Euclidean là compact phức (complex manifold compact). Đây là nguồn gốc của tên gọi "complete".

---

## SageMath Cheatsheet

```python
P1 = ProjectiveSpace(QQ, 1)
print(P1.is_projective())

E = EllipticCurve(QQ, [1, 1])
print(E.base_ring())

from sage.schemes.elliptic_curves.all import *
```

---

## Summary / Key Takeaways

- **Complete variety**: ánh xạ chiếu $\pi_T: X \times T \to T$ là closed map với mọi $T$. Đây là phiên bản đại số của compact.
- $\mathbb{A}^1$ **không** complete (ảnh của $V(xy-1)$ qua $\pi$ là tập mở).
- Mọi **projective variety đều complete** — kết quả trung tâm của bài.
- Hàm chính quy toàn cục trên connected complete variety **phải là hằng số**.
- Abelian variety = **complete + group variety** — completeness là điều kiện cốt lõi.
- Proper morphism: tổng quát hóa completeness cho morphisms; có nhiều tính chất tốt (đóng với hợp, tích, base change).

---

## References

- Hartshorne, R. *Algebraic Geometry* (GTM 52), Chapter I §5, Chapter II §4.
- Mumford, D. *Abelian Varieties* (2nd ed., Tata–Oxford), Chapter I §4.
- Milne, J.S. *Abelian Varieties* (v2.0), Chapter I §2. Available at jmilne.org.
- Shafarevich, I.R. *Basic Algebraic Geometry* Vol. 1, Chapter I §5.2.
