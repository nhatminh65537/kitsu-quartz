---
title: "A0. Proof of Rigidity Lemma"
type: appendix
tags: [math, abelian-varieties, appendix, rigidity-lemma]
aliases: [Proof of Rigidity Lemma]
created: 2026-05-18
---

> Bài học liên quan: [[08-abelian-varieties-definition-commutativity|09. Abelian Varieties — Definition and Commutativity]]

## Motivation

Rigidity Lemma (Bổ đề Cứng) là công cụ kỹ thuật trung tâm trong lý thuyết abelian varieties. Ý tưởng cốt lõi là: **một morphism từ một complete variety sang một variety affine không thể "di chuyển quá nhiều"** — nếu nó co tất cả một fiber về một điểm, nó buộc phải co gần như tất cả mọi fiber về một điểm.

Tên "Rigidity" xuất phát từ thực tế là một map từ complete variety bị "cứng": không có đủ tự do để biến đổi liên tục. Đây là phiên bản đại số của nguyên lý maximum trong giải tích phức — một hàm holomorphic trên compact connected manifold phải là hằng số. Trong ngữ cảnh đại số, complete variety đóng vai trò của compact manifold, và affine variety (có nhiều hàm regular, không "co lại" như projective variety) đóng vai trò như "không gian đích có tọa độ".

Ứng dụng quan trọng nhất: Rigidity Lemma ngay lập tức kéo theo rằng mọi complete algebraic group đều giao hoán (commutative), tức là là abelian variety theo nghĩa chính xác.

---

## Rigidity Lemma — Phát biểu và Chứng minh

### Nhắc lại các khái niệm nền

> [!definition] Definition A0.1 — Complete Variety
> Một variety $X$ được gọi là **complete** (hoàn chỉnh) nếu với mọi variety $T$, phép chiếu
>
> $$
> \operatorname{pr}_T : X \times T \to T
> $$
>
> là một **closed map** (ảnh của tập đóng là tập đóng). Nói cách khác, $X$ là proper over $\operatorname{Spec} k$.

> [!note] Remark A0.2 — Projective là Complete
> Mọi projective variety đều complete. Ngược lại không đúng trong tổng quát, nhưng mọi complete variety đều là quasi-projective (theo Chow's Lemma). Trong thực hành với abelian varieties, ta sẽ thấy ở Bổ đề 13 rằng mọi abelian variety đều projective — tức là complete.

> [!note] Remark A0.3 — Vai trò của Completeness
> Tính chất "closed projection" có một hệ quả quan trọng: nếu $X$ là complete và $Z \subseteq X \times T$ là tập đóng, thì $\operatorname{pr}_T(Z) \subseteq T$ là tập đóng. Đặc biệt, **image của morphism từ complete variety là closed** (vì graph của morphism là tập đóng).

Chúng ta cần thêm một fact quan trọng về morphism từ complete variety vào affine variety:

> [!theorem] Theorem A0.4 — Morphism từ Complete sang Affine
> Nếu $X$ là complete và connected, và $f: X \to \mathbb{A}^n$ là một morphism (vào affine $n$-space), thì $f$ là hằng số.

**Proof.**
Vì $X$ là complete, image $f(X)$ là closed và complete (vì complete variety là đóng với surjective morphism). Nhưng affine variety không chứa complete variety nào trừ các điểm. (Chặt chẽ hơn: $f(X)$ vừa là closed trong $\mathbb{A}^n$ — tức là một closed affine subvariety — vừa là complete. Affine variety hoàn chỉnh phải có dimension 0, tức là tập hữu hạn các điểm. Vì $f(X)$ là connected (ảnh liên tục của tập liên tục), nó phải là một điểm duy nhất.) $\blacksquare$

---

### Phát biểu Rigidity Lemma

> [!theorem] Theorem A0.5 — Rigidity Lemma (Mumford)
> Cho $f: X \times Y \to Z$ là morphism của varieties, trong đó $X$ là **complete** và **connected**. Giả sử tồn tại hai điểm $x_0 \in X(k)$ và $y_0 \in Y(k)$ sao cho:
>
> $$
> f(X \times \{y_0\}) = \{z_0\} \quad \text{và} \quad f(\{x_0\} \times Y) = \{z_0\}
> $$
>
> với cùng một điểm $z_0 \in Z(k)$. Khi đó $f$ **factored through the second projection**, tức là:
>
> $$
> f(x, y) = f(x_0, y) \quad \text{với mọi } x \in X, y \in Y
> $$
>
> Nói cách khác, $f$ **không phụ thuộc vào $x$**: $f = g \circ \operatorname{pr}_Y$ với $g: Y \to Z$ là morphism nào đó.

---

### Chứng minh Rigidity Lemma

**Chiến lược chứng minh:**

Ý tưởng: Ta muốn chứng minh $f(x, y) = f(x_0, y)$ với mọi $x, y$. Cố định bất kỳ $y \in Y$; xét morphism $f_y : X \to Z$ định nghĩa bởi $f_y(x) = f(x, y)$. Ta muốn chứng minh $f_y$ là hằng số $= z_0$.

Nhưng làm thế nào? Ta biết $f_{y_0}$ là hằng số ($= z_0$). Ta sẽ chứng minh rằng tập $U = \{y \in Y : f_y \text{ là hằng số}\}$ vừa mở vừa đóng, và vì $Y$ liên thông và $y_0 \in U$, ta được $U = Y$.

**Bước 1: Chọn mở affine $Z_0$ xung quanh $z_0$.**

Lấy $Z_0 \subseteq Z$ là một mở affine chứa $z_0$. Đặt:

$$
W = \operatorname{pr}_Y\bigl((X \times Y) \setminus f^{-1}(Z_0)\bigr)
$$

tức là $W$ là tập các $y \in Y$ sao cho $f(x, y) \notin Z_0$ với ít nhất một $x \in X$.

Vì $X$ là complete, phép chiếu $\operatorname{pr}_Y : X \times Y \to Y$ là closed map. Tập $(X \times Y) \setminus f^{-1}(Z_0)$ là đóng trong $X \times Y$, nên $W = \operatorname{pr}_Y\bigl((X \times Y) \setminus f^{-1}(Z_0)\bigr)$ là đóng trong $Y$.

**Claim:** $y_0 \notin W$. Thực vậy, $f(X \times \{y_0\}) = \{z_0\} \subseteq Z_0$, nên $f^{-1}(Z_0)$ chứa $X \times \{y_0\}$, tức là không có $x$ nào bị gửi ra ngoài $Z_0$ khi $y = y_0$.

Vậy $Y \setminus W$ là **mở** trong $Y$ và chứa $y_0$.

**Bước 2: Với $y \in Y \setminus W$, morphism $f_y : X \to Z_0$ là hằng số.**

Với $y \in Y \setminus W$, ta có $f(X \times \{y\}) \subseteq Z_0$ (vì $y \notin W$ có nghĩa là mọi $x$ đều có $f(x,y) \in Z_0$). Tức là morphism:

$$
f_y : X \to Z_0, \quad f_y(x) = f(x, y)
$$

là một morphism từ $X$ (complete và connected) vào $Z_0$ (affine). Theo Theorem A0.4, $f_y$ phải là hằng số. Vậy $f_y(x) = f_y(x_0) = f(x_0, y) = z_0$ (vì $f(\{x_0\} \times Y) = \{z_0\}$).

Tóm lại: với mọi $y \in Y \setminus W$, $f(x, y) = z_0$ với mọi $x \in X$.

**Bước 3: Kết luận $f$ là hằng số $z_0$.**

Hãy tổng quát hóa. Ta không chỉ muốn $f = z_0$ mà muốn $f(x, y) = f(x_0, y)$. Đặt:

$$
h : X \times Y \to Z \times Z, \quad h(x, y) = (f(x, y),\, f(x_0, y))
$$

và xét $\Delta_Z$ — diagonal của $Z \times Z$. Định nghĩa:

$$
T = \{(x, y) \in X \times Y : f(x, y) = f(x_0, y)\} = h^{-1}(\Delta_Z)
$$

$T$ là đóng trong $X \times Y$. Ta đã thấy $T$ chứa $X \times (Y \setminus W)$ (mở trong $X \times Y$). Ta cũng có $\{x_0\} \times Y \subseteq T$ (vì $f(x_0, y) = f(x_0, y)$ hiển nhiên).

**Bước 4: Dùng completeness để kết luận $T = X \times Y$.**

Đặt $S = \operatorname{pr}_Y(T^c)$ — projection của bù của $T$. Vì $X$ là complete, $S$ là đóng trong $Y$. Ta có $y_0 \notin S$ (vì $X \times \{y_0\} \subseteq T$, nên $T^c \cap (X \times \{y_0\}) = \emptyset$). Cũng $Y \setminus W \subseteq Y \setminus S$ (vì với $y \in Y \setminus W$, mọi $x$ có $f(x,y) = z_0 = f(x_0, y)$, tức là $X \times \{y\} \subseteq T$, nên $T^c \cap (X \times \{y\}) = \emptyset$, tức là $y \notin S$).

Vậy $S$ là tập đóng không chứa $y_0$. Nếu giả sử thêm $Y$ là irreducible thì $Y \setminus W$ là open dense, và $S$ là closed không cắt open dense subset — tức $S = \emptyset$. Khi đó $T = X \times Y$, chứng minh xong.

Trong trường hợp $Y$ không irreducible, luận cứ vẫn đúng: ta áp dụng trên từng irreducible component của $Y$ đi qua $y_0$.

**Kết luận:** $f(x, y) = f(x_0, y)$ với mọi $x \in X, y \in Y$. $\blacksquare$

---

## Corollary: Abelian Varieties là Giao Hoán

Đây là hệ quả trực tiếp và đẹp nhất của Rigidity Lemma. Ta sẽ chứng minh rằng nếu $A$ là một **complete group variety** (connected complete variety có group law), thì $A$ phải **giao hoán**.

> [!theorem] Theorem A0.6 — Commutativity from Rigidity
> Mọi abelian variety $A$ (complete + connected + group variety) đều giao hoán.

**Proof.**

Xét morphism commutator:

$$
\phi : A \times A \to A, \quad \phi(a, b) = a \cdot b \cdot a^{-1} \cdot b^{-1}
$$

Ta muốn chứng minh $\phi \equiv e$ (phần tử đơn vị). Áp dụng Rigidity Lemma với $X = Y = Z = A$, $x_0 = y_0 = e$.

Kiểm tra giả thiết:
- $\phi(a, e) = a \cdot e \cdot a^{-1} \cdot e^{-1} = a \cdot a^{-1} = e$ với mọi $a \in A$.
  Vậy $\phi(A \times \{e\}) = \{e\}$. ✓
- $\phi(e, b) = e \cdot b \cdot e^{-1} \cdot b^{-1} = b \cdot b^{-1} = e$ với mọi $b \in A$.
  Vậy $\phi(\{e\} \times A) = \{e\}$. ✓

Cả hai fiber về đơn vị (một theo chiều $A \times \{e\}$, một theo $\{e\} \times A$) đều co về cùng điểm $z_0 = e$. Theo Rigidity Lemma:

$$
\phi(a, b) = \phi(e, b) = e \quad \text{với mọi } a, b \in A
$$

Tức là $a \cdot b \cdot a^{-1} \cdot b^{-1} = e$, hay $a \cdot b = b \cdot a$ với mọi $a, b \in A$. $\blacksquare$

---

## Corollary: Mọi Morphism Giữa AV Gần như là Homomorphism

> [!theorem] Theorem A0.7 — Translation-Equivariance
> Cho $f: A \to B$ là morphism giữa hai abelian varieties. Đặt $g: A \to B$ là morphism $g(a) = f(a) - f(0_A)$. Khi đó $g$ là một homomorphism của nhóm.

**Proof.**

Xét $\phi: A \times A \to B$ định nghĩa bởi:

$$
\phi(a, a') = f(a + a') - f(a) - f(a') + f(0)
$$

Kiểm tra:
- $\phi(a, 0) = f(a) - f(a) - f(0) + f(0) = 0$
- $\phi(0, a') = f(a') - f(0) - f(a') + f(0) = 0$

Cả hai fiber đều là $\{0_B\}$. Theo Rigidity Lemma, $\phi \equiv 0$, tức là:

$$
f(a + a') = f(a) + f(a') - f(0)
$$

hay $g(a + a') = f(a+a') - f(0) = f(a) + f(a') - 2f(0) = g(a) + g(a')$.

Vậy $g$ là homomorphism. $\blacksquare$

> [!note] Remark A0.8 — Ý nghĩa
> Hệ quả này nói rằng **mọi morphism giữa abelian varieties đều là homomorphism cộng với một phép dịch chuyển**. Đây là sự khác biệt căn bản giữa abelian varieties và các algebraic group khác: không có "morphism lạ" nào giữa chúng.

---

## Rigidity Lemma dưới Dạng Categorical

Để hiểu tại sao đây là "rigidity", hãy xem bản phát biểu categorical:

> [!abstract] Abstract Version (Baez–Dolan Category Theory)
> Một category $\mathcal{C}$ với finite products được gọi là **satisfies the Rigidity Lemma** nếu: với mọi morphism $f: X \times Y \to Z$ và các điểm $x_0: 1 \to X$, $y_0: 1 \to Y$ sao cho $f \circ (\operatorname{id}_X \times y_0)$ và $f \circ (x_0 \times \operatorname{id}_Y)$ đều factor through $z_0: 1 \to Z$, thì $f$ factors through $\operatorname{pr}_Y$.
>
> **Theorem (Mumford):** Category của complete algebraic varieties trên algebraically closed field thỏa mãn điều kiện này.

---

## Biến Thể Mạnh Hơn: Dạng Schematic

Phiên bản sau được sử dụng khi làm việc với families of abelian varieties (không chỉ trên một field cố định):

> [!theorem] Theorem A0.9 — Rigidity for Schemes (relative version)
> Cho $f: X \to Y$ là morphism proper với geometric fibers connected, và $g: X \to Z$ là morphism sao cho $g$ co một fiber về một điểm. Nếu $Z$ là separated, thì $g$ factors through $Y$.

Đây là phiên bản xuất hiện trong chứng minh Theorem of the Cube và nhiều ứng dụng deformation-theoretic của abelian varieties.

---

## Summary

- Rigidity Lemma: morphism $f: X \times Y \to Z$ với $X$ complete connected; nếu cả hai "slice" qua $x_0$ và $y_0$ đều co về một điểm, thì $f$ không phụ thuộc vào biến $x$.
- Chứng minh dùng: (1) completeness → projection closed → open set $Y \setminus W$ tốt; (2) morphism từ complete vào affine là hằng số; (3) diagonal argument để lan truyền lên toàn bộ $X \times Y$.
- Hệ quả trực tiếp: complete group varieties là giao hoán. Đây là lý do abelian varieties luôn commutative.
- Mọi morphism giữa AV = homomorphism + translation.

---

## References

- Mumford, D. *Abelian Varieties*. Oxford University Press, 1970. Chapter II, §4 (Rigidity Lemma, pp. 43–44).
- Milne, J.S. *Abelian Varieties* (Course Notes). Version 2.0, 2008. Theorem 2.1 (Rigidity Theorem), pp. 18–19. Available: https://www.jmilne.org/math/CourseNotes/AV.pdf
- Milne, J.S. *Abelian Varieties* (xnotes). §2. https://www.jmilne.org/math/xnotes/AVs.pdf
- Snowden, A. *Lecture 4: Abelian Varieties (Algebraic Theory)*. University of Michigan, 2013. http://www-personal.umich.edu/~asnowden/teaching/2013/679/L04.html
- van der Geer, G., Moonen, B., Edixhoven, B. *Abelian Varieties*. Draft book. Chapter I. Available: http://van-der-geer.nl/~gerard/AV.pdf
