---
title: "12. Theorem of the Square"
tags: [math, abelian-varieties, module-01, lesson-12]
aliases: [Theorem of the Square]
created: 2026-05-18
---

> **Prerequisites**: [[10-translation-maps-morphisms|10. Translation Maps and Morphisms of Abelian Varieties]], [[05-line-bundles-picard-group|05. Line Bundles and the Picard Group]]
> **Objectives**:
> - Phát biểu và chứng minh Theorem of the Square
> - Định nghĩa Mumford line bundle $\Lambda(L)$
> - Xây dựng homomorphism $\phi_L: A(k) \to \operatorname{Pic}(A)$
> - Hiểu kernel $K(L)$ và ý nghĩa của nó

---

## Motivation / Intuition

Chúng ta đã biết rằng translation maps $t_a: A \to A$ là automorphisms của variety. Nhưng điều gì xảy ra khi $t_a$ tác động lên **line bundles**? Tổng quát, với line bundle $L$ trên $A$, line bundle dịch chuyển $t_a^* L$ khác với $L$ như thế nào?

Đây không phải câu hỏi nhỏ nhặt. Câu trả lời được cho bởi **Theorem of the Square**: một đẳng thức về line bundles khi dịch chuyển theo tổng hai điểm. Kết quả này là một trong những định lý nền tảng nhất của lý thuyết abelian varieties, và từ đó ta xây dựng được:

1. Homomorphism $\phi_L: A \to \hat{A}$ (từ abelian variety sang dual abelian variety — Bài 26).
2. Khái niệm **polarization** (Module 6).
3. Công cụ để chứng minh AV là projective (Bài 13).

Tên "Theorem of the Square" xuất phát từ một biểu đồ hình vuông trong lý thuyết divisors: relation $[D + t_a D + t_b D + t_{a+b} D] \sim 2[D + t_c D]$ cho $c = (a+b)/2$ (trong trường hợp phức).

---

## Mumford Line Bundle

> [!definition] Definition 12.1 — Mumford Line Bundle $\Lambda(L)$
> Cho $A$ là abelian variety, $L$ là line bundle trên $A$, và $m: A \times A \to A$ là group law, $p_1, p_2: A \times A \to A$ là hai projections. Định nghĩa **Mumford line bundle**:
>
> $$
> \Lambda(L) = m^* L \otimes p_1^* L^{-1} \otimes p_2^* L^{-1}
> $$
>
> đây là line bundle trên $A \times A$.

> [!note] Remark 12.2 — Ý Nghĩa Của $\Lambda(L)$
> Fiber của $\Lambda(L)$ tại điểm $(a, b) \in A \times A$ "đo" sự sai khác giữa $L$ tại $a+b$ với $L$ tại $a$ và $L$ tại $b$. Nếu $L$ là "group homomorphism" từ $A$ vào đâu đó, thì $\Lambda(L)$ sẽ trivial. Theorem of the Cube (Bài 13) nói rằng $\Lambda(L)$ luôn "xấp xỉ trivial" theo một nghĩa cụ thể.

**Tính chất cơ bản của $\Lambda(L)$:**

Restriction của $\Lambda(L)$ lên $A \times \{0\}$:

$$
\Lambda(L)|_{A \times \{0\}} = m^* L|_{A \times \{0\}} \otimes p_1^* L^{-1}|_{A \times \{0\}} \otimes p_2^* L^{-1}|_{A \times \{0\}}
$$

$$
= (\text{id} + 0)^* L \otimes L^{-1} \otimes \mathcal{O} = L \otimes L^{-1} = \mathcal{O}_A
$$

Tương tự $\Lambda(L)|_{\{0\} \times A} \cong \mathcal{O}_A$.

---

## Theorem of the Cube (Phát Biểu)

Theorem of the Square là hệ quả của kết quả mạnh hơn — **Theorem of the Cube** — sẽ được chứng minh đầy đủ ở Bài 13:

> [!theorem] Theorem 12.3 — Theorem of the Cube (Statement)
> Cho $A$ là abelian variety, $T$ là $k$-variety tùy ý, và $f, g, h: T \to A$ là ba morphisms. Với mọi line bundle $L$ trên $A$:
>
> $$
> (f + g + h)^* L \otimes f^* L \otimes g^* L \otimes h^* L \cong (f + g)^* L \otimes (f + h)^* L \otimes (g + h)^* L
> $$
>
> như line bundles trên $T$.

Đây là một **đẳng thức hàm tử** (functorial identity) — đúng cho mọi $T$ và mọi morphisms.

---

## Theorem of the Square

> [!theorem] Theorem 12.4 — Theorem of the Square
> Cho $A$ là abelian variety, $L$ là line bundle trên $A$, và $x, y \in A$ (hai điểm). Thì:
>
> $$
> t_{x+y}^* L \otimes L \cong t_x^* L \otimes t_y^* L
> $$
>
> như line bundles trên $A$.

**Proof.** Áp dụng Theorem of the Cube (Theorem 12.3) với $T = A$, và ba morphisms:

$$
f = \operatorname{id}_A: A \to A, \quad g = c_x: A \to A \text{ (constant } x\text{)}, \quad h = c_y: A \to A \text{ (constant } y\text{)}
$$

Thì:
- $(f + g + h)^* L = (\operatorname{id} + c_x + c_y)^* L = t_{x+y}^* L$
- $f^* L = L$
- $g^* L = c_x^* L \cong \mathcal{O}_A$ (pullback bởi constant map = trivial bundle)
- $h^* L = c_y^* L \cong \mathcal{O}_A$
- $(f + g)^* L = t_x^* L$
- $(f + h)^* L = t_y^* L$
- $(g + h)^* L = c_{x+y}^* L \cong \mathcal{O}_A$

Theorem of the Cube cho:

$$
t_{x+y}^* L \otimes L \otimes \mathcal{O} \otimes \mathcal{O} \cong t_x^* L \otimes t_y^* L \otimes \mathcal{O}
$$

$$
t_{x+y}^* L \otimes L \cong t_x^* L \otimes t_y^* L \quad \blacksquare
$$

---

### Công Thức Tương Đương

> [!corollary] Corollary 12.5 — Các Dạng Tương Đương
> Theorem of the Square tương đương với:
>
> **(Dạng đối xứng)**: Đặt $y = -x$ trong Theorem 12.4:
>
> $$
> t_0^* L \otimes L \cong t_x^* L \otimes t_{-x}^* L \implies L^{\otimes 2} \cong t_x^* L \otimes t_{-x}^* L
> $$
>
> **(Dạng Mumford)**: $\Lambda(L)|_{A \times \{y\}} = t_y^* L \otimes L^{-1}$ như line bundle trên $A$, với mọi $y \in A$.
>
> **(Dạng homomorphism)**: Ánh xạ $\phi_L: A(k) \to \operatorname{Pic}(A)$ định nghĩa bởi $\phi_L(x) = [t_x^* L \otimes L^{-1}]$ là **group homomorphism**.

**Proof of (Dạng homomorphism).** Từ Theorem 12.4:

$$
t_{x+y}^* L \otimes L \cong t_x^* L \otimes t_y^* L
$$

Nhân hai vế với $L^{-2}$:

$$
t_{x+y}^* L \otimes L^{-1} \cong (t_x^* L \otimes L^{-1}) \otimes (t_y^* L \otimes L^{-1})
$$

Tức là $\phi_L(x + y) = \phi_L(x) + \phi_L(y)$ trong $\operatorname{Pic}(A)$ (dùng tensor product). $\blacksquare$

---

## Homomorphism $\phi_L$ Và Kernel $K(L)$

> [!definition] Definition 12.6 — Homomorphism $\phi_L$
> Cho $L$ là line bundle trên $A$. Định nghĩa:
>
> $$
> \phi_L: A(k) \to \operatorname{Pic}(A), \quad \phi_L(x) = [t_x^* L \otimes L^{-1}]
> $$
>
> Theo Corollary 12.5, $\phi_L$ là group homomorphism từ $A(k)$ vào $\operatorname{Pic}(A)$.

> [!note] Remark 12.7 — Phiên Bản Morphism Đầy Đủ
> $\phi_L$ như trên là homomorphism của các nhóm $k$-points. Phiên bản đầy đủ — $\phi_L: A \to \hat{A}$ như morphism of abelian varieties (trong đó $\hat{A} = \operatorname{Pic}^0(A)$ là dual abelian variety) — sẽ được xây dựng ở Module 4 (Bài 26), sau khi định nghĩa $\hat{A}$.

> [!definition] Definition 12.8 — Kernel $K(L)$
> **Kernel** của $\phi_L$ là:
>
> $$
> K(L) = \ker(\phi_L) = \{x \in A(\bar{k}) \mid t_x^* L \cong L\}
> $$
>
> Đây là tập các điểm mà dịch chuyển theo đó KHÔNG làm thay đổi $L$.

> [!theorem] Theorem 12.9 — $K(L)$ Là Subgroup Hữu Hạn Khi $L$ Ample
> Nếu $L$ là **ample** line bundle trên $A$, thì $K(L)$ là một **finite subgroup** của $A$.

**Proof sketch.** Nếu $L$ là ample, thì $t_x^* L \cong L$ với $x$ trong infinite set thì dẫn đến contradiction với ampleness (ample bundles "separate points"). Chứng minh formal dùng intersection theory. $\blacksquare$

---

## Ví Dụ Cụ Thể

> [!example] Example 12.10 — Theorem of the Square Trên Elliptic Curve
> Cho $E: y^2 = x^3 - x$ trên $\mathbb{Q}$ và divisor $D = (1, 0)$ (điểm đơn lẻ), $L = \mathcal{O}(D)$.
>
> Theorem of the Square nói: $t_{P+Q}^* L \otimes L \cong t_P^* L \otimes t_Q^* L$.
>
> Dịch sang ngôn ngữ divisors: $D_{P+Q} + D_0 \sim D_P + D_Q$ trong $\operatorname{Pic}(E)$, trong đó $D_a = t_a^* D = (1+a_x, *) - O$ (rough notation).
>
> Điều này tương đương với: **linear equivalence** $[D + (P+Q)] \sim [D+P] + [D+Q] - D$ — một quan hệ trên Picard group của $E$.

> [!example] Example 12.11 — $\phi_L$ Với $L = \mathcal{O}(O)$ Trên Elliptic Curve
> Với $E$ và $L = \mathcal{O}(O)$ (bundle ứng với divisor của điểm đơn vị $O$):
>
> $$
> \phi_L(P) = [t_P^* \mathcal{O}(O) \otimes \mathcal{O}(O)^{-1}] = [\mathcal{O}(O - P)] = [(-P) - O]
> $$
>
> (trong $\operatorname{Pic}^0(E) \cong E$, điểm $(-P) - O$ correspond đến điểm $-P$ trên $E$).
>
> Vậy $\phi_{\mathcal{O}(O)}: E \to \hat{E} \cong E$ là ánh xạ $P \mapsto -P$ — đây là isomorphism (có thể cộng với isomorphism $\hat{E} \cong E$).

---

## Ứng Dụng: Đẳng Thức $[n]^* L \cong L^{n^2}$ (Với $L$ Symmetric)

> [!theorem] Theorem 12.12 — Pullback Của Line Bundle Qua $[n]$
> Cho $L$ là line bundle trên abelian variety $A$. Thì:
>
> $$
> [n]^* L \cong L^{\otimes \frac{n^2 + n}{2}} \otimes [-1]^* L^{\otimes \frac{n^2 - n}{2}}
> $$
>
> Đặc biệt, nếu $L$ là **symmetric** (tức $[-1]^* L \cong L$), thì:
>
> $$
> [n]^* L \cong L^{\otimes n^2}
> $$
>
> Và nếu $L \in \operatorname{Pic}^0(A)$ (translation-invariant), thì $[n]^* L \cong L^{\otimes n}$.

**Proof.** Từ Theorem of the Square, dùng quy nạp trên $n$. (Xem Mumford §3.) $\blacksquare$

---

## SageMath Cheatsheet

```python
E = EllipticCurve(GF(101), [2, 3])
P = E(E.lift_x(5))
Q = E(E.lift_x(10))

S = P + Q
print(f"P + Q = {S}")

D_S = [S]
D_0 = [E(0)]
D_P = [P]
D_Q = [Q]

n = 5
R = E.random_point()
print(f"[n](R) = [5](R) = {n*R}")

for x_coord in range(1, 10):
    try:
        pt = E.lift_x(x_coord)
        trans = pt + P
        print(f"t_P({pt}) = {trans}")
        break
    except:
        continue
```

---

## Summary / Key Takeaways

- **Mumford line bundle** $\Lambda(L) = m^* L \otimes p_1^* L^{-1} \otimes p_2^* L^{-1}$ đo sự lệch của $L$ so với "homomorphism".
- **Theorem of the Square**: $t_{x+y}^* L \otimes L \cong t_x^* L \otimes t_y^* L$ — theo sau từ Theorem of the Cube.
- **Dạng đối xứng**: $t_a^* L \otimes t_{-a}^* L \cong L^{\otimes 2}$.
- **Homomorphism $\phi_L$**: $x \mapsto [t_x^* L \otimes L^{-1}]$ là group homomorphism $A(k) \to \operatorname{Pic}(A)$.
- **Kernel $K(L)$**: tập các $x$ mà $t_x^* L \cong L$; finite khi $L$ ample.
- **Pullback $[n]^* L$**: với $L$ symmetric, $[n]^* L \cong L^{n^2}$.
- Đây là nền tảng để định nghĩa dual abelian variety $\hat{A} = A / K(L)$ (Module 4).

---

## References

- Mumford, D. *Abelian Varieties*, Chapter II, §2–3 (Theorem of the Square). Oxford University Press, 1970.
- van der Geer, G. & Moonen, B. *Abelian Varieties*, (2.9) Theorem of the Square. [http://van-der-geer.nl/~gerard/AV.pdf](http://van-der-geer.nl/~gerard/AV.pdf)
- Milne, J.S. *Abelian Varieties* (2022), §5 (Theorems of the Cube and Square). [https://www.jmilne.org/math/xnotes/AVs.pdf](https://www.jmilne.org/math/xnotes/AVs.pdf)
- Columbia AV Notes: [https://www.math.columbia.edu/~chaoli/docs/AbelianVarieties.html](https://www.math.columbia.edu/~chaoli/docs/AbelianVarieties.html)
- Arizona Winter School 2024 (Moonen): §2. [https://swc-math.github.io/aws/2024/2024MoonenNotes.pdf](https://swc-math.github.io/aws/2024/2024MoonenNotes.pdf)
