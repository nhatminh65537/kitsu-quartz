---
title: "20. The ℓ-adic Tate Module $T_\\ell(A)$"
type: theory
tags: [math, abelian-varieties, lesson-20]
aliases: [Tate Module, ℓ-adic Tate Module]
created: 2026-05-17
---

> **Prerequisites**: [[19-inverse-limits|19. Inverse Limits]], [[17-n-torsion-points|17. n-Torsion Points A[n]]], [[16-dual-isogeny|16. The Dual Isogeny]]
> **Objectives**:
> - Xây dựng $\ell$-adic Tate module $T_\ell(A)$ từ hệ các điểm xoắn $A[\ell^n]$
> - Chứng minh $T_\ell(A) \cong \mathbb{Z}_\ell^{2g}$ khi $\ell \neq \operatorname{char}(k)$
> - Hiểu action của nhóm Galois trên $T_\ell(A)$ như một biểu diễn $\ell$-adic
> - Tính Tate module của elliptic curve và của $\mathbb{G}_m$

---

## Motivation / Intuition

Trong bài 17, ta đã biết: với $n$ nguyên tố cùng nhau với $\operatorname{char}(k)$,

$$
A[n](\bar{k}) \cong (\mathbb{Z}/n\mathbb{Z})^{2g}
$$

Đây là thông tin rất phong phú về abelian variety $A$ — nhưng nó là thông tin rời rạc, cho từng $n$ riêng lẻ. Câu hỏi: **liệu ta có thể gói toàn bộ thông tin về $A[\ell^n]$ với mọi $n$ vào một đối tượng duy nhất?**

Câu trả lời chính là **Tate module** $T_\ell(A)$. Thay vì nhìn vào từng $A[\ell^n]$ riêng lẻ, ta "lấy giới hạn" theo hệ

$$
\cdots \xrightarrow{[\ell]} A[\ell^3] \xrightarrow{[\ell]} A[\ell^2] \xrightarrow{[\ell]} A[\ell]
$$

và thu được một $\mathbb{Z}_\ell$-module tự do hạng $2g$ — đây là đối tượng **tuyến tính** mà ta có thể áp dụng toàn bộ kỹ thuật của đại số tuyến tính.

**Tại sao điều này mạnh mẽ?** Vì:
- Mọi endomorphism $f: A \to A$ đều **induced** một ánh xạ tuyến tính $T_\ell(f): T_\ell(A) \to T_\ell(A)$.
- Thay vì nghiên cứu abelian variety phi tuyến, ta có thể nghiên cứu ma trận $2g \times 2g$ — công cụ quen thuộc và mạnh mẽ hơn nhiều.
- Nhóm Galois $G_k = \operatorname{Gal}(\bar{k}/k)$ action lên $T_\ell(A)$, cho ta một **biểu diễn Galois** $\ell$-adic — nối liền lý thuyết số với hình học đại số.

Trong ngữ cảnh phức $\mathbb{C}$: $A = V/\Lambda$ thì $T_\ell(A) \cong \Lambda \otimes_\mathbb{Z} \mathbb{Z}_\ell$ — đây là lý do Tate module được xem như "analog của đồng điều học" ($H_1(A(\mathbb{C}), \mathbb{Z})$).

---

## Hệ Các Điểm Xoắn

Trước khi định nghĩa Tate module, ta cần hiểu cấu trúc của hệ $\bigl(A[\ell^n]\bigr)_{n \geq 1}$.

Với $A$ abelian variety và $\ell$ số nguyên tố $\neq \operatorname{char}(k)$:
- $A[\ell^n](\bar{k}) \cong (\mathbb{Z}/\ell^n\mathbb{Z})^{2g}$ (Theorem từ Bài 17).
- Phép nhân $[\ell]: A \to A$ gửi $A[\ell^{n+1}]$ vào $A[\ell^n]$: nếu $[\ell^{n+1}]P = O$ thì $[\ell^n]([\ell]P) = [\ell^{n+1}]P = O$.

Ta thu được **hệ nghịch đảo** của các nhóm hữu hạn:

$$
\cdots \xrightarrow{[\ell]} A[\ell^3](\bar{k}) \xrightarrow{[\ell]} A[\ell^2](\bar{k}) \xrightarrow{[\ell]} A[\ell](\bar{k})
$$

với phép chiếu chuyển tiếp $f_{n, n+1} = [\ell]: A[\ell^{n+1}](\bar{k}) \to A[\ell^n](\bar{k})$.

---

## Định Nghĩa Tate Module

### Definition

> [!definition] Definition 20.1 — $\ell$-adic Tate Module
> Cho $A$ là abelian variety trên trường $k$, và $\ell$ là số nguyên tố với $\ell \neq \operatorname{char}(k)$. **$\ell$-adic Tate module** của $A$ là inverse limit:
>
> $$
> T_\ell(A) \;:=\; \varprojlim_{n \geq 1} A[\ell^n](\bar{k})
> $$
>
> với phép chiếu chuyển tiếp $[\ell]: A[\ell^{n+1}](\bar{k}) \to A[\ell^n](\bar{k})$.
>
> Phần tử của $T_\ell(A)$ là dãy: $(P_1, P_2, P_3, \ldots)$ với $P_n \in A[\ell^n](\bar{k})$ và $[\ell]P_{n+1} = P_n$ với mọi $n \geq 1$.

> [!definition] Definition 20.2 — Không gian vector $\ell$-adic $V_\ell(A)$
> **Không gian vector $\ell$-adic** của $A$ là:
>
> $$
> V_\ell(A) \;:=\; T_\ell(A) \otimes_{\mathbb{Z}_\ell} \mathbb{Q}_\ell
> $$
>
> Đây là $\mathbb{Q}_\ell$-vector space chiều $2g$ (khi $\ell \neq \operatorname{char}(k)$).

### Cấu trúc như $\mathbb{Z}_\ell$-module

> [!theorem] Theorem 20.1 — Cấu trúc của Tate Module
> Cho $A$ là abelian variety chiều $g$ trên trường $k$, và $\ell$ là số nguyên tố với $\ell \neq \operatorname{char}(k)$. Khi đó:
>
> $$
> T_\ell(A) \;\cong\; \mathbb{Z}_\ell^{2g}
> $$
>
> là $\mathbb{Z}_\ell$-module tự do (free) hạng $2g$. Hệ quả: $V_\ell(A) \cong \mathbb{Q}_\ell^{2g}$ là $\mathbb{Q}_\ell$-vector space chiều $2g$.

**Proof (sketch).**
Theo Bài 17, với mỗi $n$: $A[\ell^n](\bar{k}) \cong (\mathbb{Z}/\ell^n\mathbb{Z})^{2g}$. Hệ inverse limit của $\bigl((\mathbb{Z}/\ell^n\mathbb{Z})^{2g}\bigr)$ với phép chiếu nhân $\ell$ (hay tương đương, phép lấy dư) cho $\varprojlim (\mathbb{Z}/\ell^n\mathbb{Z})^{2g} = (\varprojlim \mathbb{Z}/\ell^n\mathbb{Z})^{2g} = \mathbb{Z}_\ell^{2g}$. Đẳng cấu này không canonical (phụ thuộc chọn cơ sở), nhưng hạng là bất biến. $\blacksquare$

> [!note] Remark 20.1 — Tại sao hạng là $2g$ (không phải $g$)?
> Đây là hệ quả của lý thuyết đồng điều học: đối với abelian variety phức $A = V/\Lambda$ chiều $g$, lattice $\Lambda \cong \mathbb{Z}^{2g}$ có hạng $2g$. Tate module là analog $\ell$-adic của $\Lambda$. Số $2g$ phản ánh sự kiện $A$ có chiều thực là $2g$ (là torus thực chiều $2g$).

---

## Ví Dụ Tính Tường Minh

### Tate module của elliptic curve

> [!example] Example 20.1 — $T_\ell(E)$ cho elliptic curve $E$
> Cho $E: y^2 = x^3 - x$ trên $\mathbb{Q}$ (hay trên bất kỳ trường $k$ với $\operatorname{char}(k) \neq 2$).
>
> Hệ $2$-torsion: $E[2](\bar{k}) = \{O, (0,0), (1,0), (-1,0)\} \cong (\mathbb{Z}/2\mathbb{Z})^2$.
>
> Một phần tử của $T_2(E)$ là dãy $(P_1, P_2, P_3, \ldots)$ với:
> - $P_1 \in E[2](\bar{k})$, ví dụ $P_1 = (1, 0)$.
> - $P_2 \in E[4](\bar{k})$ với $[2]P_2 = P_1 = (1,0)$.
> - $P_3 \in E[8](\bar{k})$ với $[2]P_3 = P_2$.
> - ...
>
> Đây là "sequence of $2$-power roots" của điểm $(1,0)$. Chọn dãy như vậy = chọn một phần tử của $T_2(E) \cong \mathbb{Z}_2^2$.

> [!example] Example 20.2 — Hạng theo chiều $g$
> Bảng tóm tắt:
>
> | Đối tượng $A$ | Chiều $g$ | $T_\ell(A)$ | $V_\ell(A)$ |
> |---|---|---|---|
> | Elliptic curve $E$ | $1$ | $\mathbb{Z}_\ell^2$ | $\mathbb{Q}_\ell^2$ |
> | Jacobian $J(C_2)$ của curve chi $2$ | $2$ | $\mathbb{Z}_\ell^4$ | $\mathbb{Q}_\ell^4$ |
> | Abelian $g$-fold $A$ | $g$ | $\mathbb{Z}_\ell^{2g}$ | $\mathbb{Q}_\ell^{2g}$ |

---

## Galois Action và Biểu Diễn $\ell$-adic

Đây là một trong những khía cạnh quan trọng nhất của Tate module.

### Definition

> [!definition] Definition 20.3 — Galois Action trên $T_\ell(A)$
> Cho $A$ là abelian variety trên $k$, và $G_k = \operatorname{Gal}(\bar{k}/k)$ là nhóm Galois tuyệt đối. Nhóm $G_k$ action lên $T_\ell(A)$ như sau:
>
> Với $\sigma \in G_k$ và $(P_n)_{n \geq 1} \in T_\ell(A)$, định nghĩa:
>
> $$
> \sigma \cdot (P_1, P_2, P_3, \ldots) \;:=\; (\sigma(P_1),\, \sigma(P_2),\, \sigma(P_3), \ldots)
> $$
>
> trong đó $\sigma(P_n)$ là action của Galois lên điểm $P_n \in A[\ell^n](\bar{k})$ (thông qua action lên tọa độ).
>
> Action này là **liên tục** (trong topology profinite trên $G_k$ và topology $\ell$-adic trên $T_\ell(A)$) và là action $\mathbb{Z}_\ell$-tuyến tính.

> [!definition] Definition 20.4 — Biểu diễn Galois $\ell$-adic ($\ell$-adic Galois Representation)
> Chọn cơ sở $\mathbb{Z}_\ell$ của $T_\ell(A) \cong \mathbb{Z}_\ell^{2g}$. Action của $G_k$ trên $T_\ell(A)$ xác định một biểu diễn:
>
> $$
> \rho_{A,\ell} : G_k \;\longrightarrow\; \operatorname{GL}_{2g}(\mathbb{Z}_\ell)
> $$
>
> gọi là **biểu diễn Galois $\ell$-adic** (hay $\ell$-adic Galois representation) của $A$.

> [!note] Remark 20.2 — Tại sao action nhất quán?
> Action nhất quán vì: $\sigma$ là tự đẳng cấu trường, nên nó hoán đổi với mọi phép tính trên $\bar{k}$. Đặc biệt, $\sigma([\ \ell]P) = [\ell](\sigma P)$ vì $[\ell]$ được định nghĩa bởi các phương trình đa thức với hệ số trong $k$. Suy ra nếu $[\ell]P_{n+1} = P_n$ thì $[\ell](\sigma P_{n+1}) = \sigma P_n$ — tính nhất quán được bảo toàn.

### Ví dụ: Galois action trên $T_\ell(E)$ qua trường hữu hạn

> [!example] Example 20.3 — Action của Frobenius
> Cho $E$ là elliptic curve trên $\mathbb{F}_q$. Nhóm Galois $G_{\mathbb{F}_q} = \operatorname{Gal}(\overline{\mathbb{F}}_q/\mathbb{F}_q) \cong \hat{\mathbb{Z}}$ sinh bởi phần tử Frobenius $\phi_q: x \mapsto x^q$.
>
> Frobenius $\pi_E: E \to E$ (map $(x,y) \mapsto (x^q, y^q)$) là endomorphism của $E$ và induced map trên $T_\ell(E)$:
>
> $$
> T_\ell(\pi_E) : T_\ell(E) \to T_\ell(E)
> $$
>
> Đây chính là action của generator của $G_{\mathbb{F}_q}$ trên $T_\ell(E)$. Ma trận của $T_\ell(\pi_E)$ trong cơ sở phù hợp là ma trận $2\times 2$ với hệ số trong $\mathbb{Z}_\ell$ — và đây sẽ là trung tâm của bài 22.

---

## Tate Module của $\mathbb{G}_m$ và Ký Hiệu Xoắn

Một ví dụ quan trọng không phải abelian variety nhưng rất cần trong lý thuyết:

### Definition

> [!definition] Definition 20.5 — Nhóm nhân $\mathbb{G}_m$ và Tate module $\mathbb{Z}_\ell(1)$
> **Nhóm nhân** (multiplicative group scheme) $\mathbb{G}_m$ là $\operatorname{Spec}(k[t, t^{-1}])$ với $\mathbb{G}_m(k) = k^\times$.
>
> Điểm xoắn bậc $\ell^n$: $\mathbb{G}_m[\ell^n](\bar{k}) = \mu_{\ell^n}(\bar{k}) \cong \mathbb{Z}/\ell^n\mathbb{Z}$ (các nghiệm thứ $\ell^n$ của $1$).
>
> **Tate module của $\mathbb{G}_m$:**
>
> $$
> T_\ell(\mathbb{G}_m) \;=\; \varprojlim_n \mu_{\ell^n}(\bar{k}) \;=:\; \mathbb{Z}_\ell(1)
> $$
>
> $\mathbb{Z}_\ell(1)$ là $\mathbb{Z}_\ell$-module tự do hạng $1$ với action của $G_k$ thông qua **ký tự cyclotomic** (cyclotomic character) $\chi_\ell$.

> [!definition] Definition 20.6 — Ký tự cyclotomic (Cyclotomic Character)
> **Ký tự cyclotomic $\ell$-adic**:
>
> $$
> \chi_\ell : G_k \;\longrightarrow\; \mathbb{Z}_\ell^\times
> $$
>
> được xác định bởi: với $\sigma \in G_k$ và $\zeta \in \mu_{\ell^n}(\bar{k})$,
>
> $$
> \sigma(\zeta) \;=\; \zeta^{\chi_\ell(\sigma)}
> $$
>
> (vì $\sigma(\zeta)$ cũng là căn thứ $\ell^n$ của $1$, nên $\sigma(\zeta) = \zeta^{a}$ cho một $a \in (\mathbb{Z}/\ell^n\mathbb{Z})^\times$; lấy inverse limit ta được $\chi_\ell(\sigma) \in \mathbb{Z}_\ell^\times$).

> [!note] Remark 20.3 — Xoắn Tate (Tate Twist)
> Ký hiệu $(1)$ trong $\mathbb{Z}_\ell(1)$ nhắc nhở rằng action của $G_k$ là thông qua **lũy thừa thứ nhất** của $\chi_\ell$. Tổng quát, $\mathbb{Z}_\ell(n) = \mathbb{Z}_\ell(1)^{\otimes n}$ với action qua $\chi_\ell^n$.
>
> Điều quan trọng: Weil pairing $e_n: A[n] \times \hat{A}[n] \to \mu_n$ sẽ cho ta (ở Bài 32):
>
> $$
> T_\ell(A) \times T_\ell(\hat{A}) \;\longrightarrow\; \mathbb{Z}_\ell(1)
> $$

---

## Trường Hợp $\ell = \operatorname{char}(k)$: Tại Sao Không Hoạt Động?

> [!warning] Remark 20.4 — Vấn đề ở characteristic $p$
> Khi $\ell = p = \operatorname{char}(k)$, cấu trúc $A[p^n](\bar{k})$ **phức tạp hơn nhiều**:
>
> - Với elliptic curve ordinary (thông thường): $E[p^n](\bar{k}) \cong \mathbb{Z}/p^n\mathbb{Z}$ (hạng $1$ thay vì $2$).
> - Với elliptic curve supersingular: $E[p^n](\bar{k}) = \{O\}$ (trivial hoàn toàn).
>
> Trong cả hai trường hợp, $T_p(A) = \varprojlim A[p^n](\bar{k})$ không còn free rank $2g$ nữa. Thay thế phù hợp là **$p$-divisible group** (còn gọi là Barsotti-Tate group) — một lý thuyết phức tạp hơn nhiều liên quan đến Dieudonné modules.
>
> **Trong module này:** ta luôn giả định $\ell \neq \operatorname{char}(k)$, tức là làm việc với prime $\ell$ "tốt".

---

## Functoriality và Homomorphisms

> [!theorem] Theorem 20.2 — Functoriality của $T_\ell$
> Cho $f: A \to B$ là homomorphism của abelian variety. Khi đó:
>
> 1. $f$ gửi $A[\ell^n](\bar{k})$ vào $B[\ell^n](\bar{k})$ (vì $[\ell^n](f(P)) = f([\ell^n]P) = f(O) = O$).
> 2. Các map này tương thích với phép chiếu chuyển tiếp, cho một đồng cấu $\mathbb{Z}_\ell$-tuyến tính:
>
> $$
> T_\ell(f) : T_\ell(A) \;\longrightarrow\; T_\ell(B)
> $$
>
> 3. $T_\ell$ là một functor: $T_\ell(\operatorname{id}_A) = \operatorname{id}_{T_\ell(A)}$ và $T_\ell(g \circ f) = T_\ell(g) \circ T_\ell(f)$.

**Proof.** $T_\ell(f)$ được định nghĩa bởi $(P_n) \mapsto (f(P_n))$. Tính tương thích: $f([\ell]P_{n+1}) = [\ell]f(P_{n+1})$ vì $f$ là homomorphism. $\blacksquare$

> [!note] Remark 20.5 — Ý nghĩa of functor
> Tóm lại, $T_\ell$ là functor từ danh mục abelian variety (với homomorphism) sang danh mục $\mathbb{Z}_\ell$-module tự do hạng $2g$ (với $\mathbb{Z}_\ell$-linear maps). Đây là "linearization" mạnh mẽ nhất của abelian variety.

---

## SageMath Cheatsheet

```python
# Elliptic curve trên F_5
E = EllipticCurve(GF(5), [0, 0, 0, -1, 0])  # y^2 = x^3 - x

# Điểm 2-torsion
E_torsion_2 = E.torsion_subgroup()
print(E_torsion_2)

# Tất cả điểm trên F_5
print(E.points())
print('|E(F_5)| =', E.order())

# Biểu diễn Galois: Frobenius matrix
# (Sage tính tự động cho EC trên F_q)
phi = E.frobenius_endomorphism()

# Tate module thông qua char poly của Frobenius
f = E.frobenius_polynomial()  # char poly của Frobenius = t^2 - a_p*t + p
print('Char poly of Frobenius:', f)
```

---

## Summary / Key Takeaways

- **$T_\ell(A) = \varprojlim A[\ell^n](\bar{k})$**: inverse limit của hệ điểm xoắn, với phép chiếu $[\ell]$.
- **Phần tử**: dãy $(P_1, P_2, \ldots)$ với $P_n \in A[\ell^n]$ và $[\ell]P_{n+1} = P_n$.
- **Cấu trúc**: $T_\ell(A) \cong \mathbb{Z}_\ell^{2g}$ (khi $\ell \neq \operatorname{char}(k)$), $V_\ell(A) \cong \mathbb{Q}_\ell^{2g}$.
- **Galois action**: $G_k$ action liên tục trên $T_\ell(A)$, cho biểu diễn $\rho_{A,\ell}: G_k \to \operatorname{GL}_{2g}(\mathbb{Z}_\ell)$.
- **$\mathbb{Z}_\ell(1) = T_\ell(\mathbb{G}_m)$**: Tate module của nhóm nhân, với action qua cyclotomic character $\chi_\ell$.
- **$\ell = \operatorname{char}(k)$**: trường hợp này phức tạp hơn nhiều — cần dùng $p$-divisible group.
- **Functoriality**: mọi homomorphism $f: A \to B$ induced $T_\ell(f): T_\ell(A) \to T_\ell(B)$, $\mathbb{Z}_\ell$-tuyến tính.

---

## References

- Silverman, J. H. *The Arithmetic of Elliptic Curves* (2nd ed.), Section III.7 (Tate Modules).
- Milne, J. S. *Abelian Varieties*, Chapter 10. Lecture notes at jmilne.org.
- Mumford, D. *Abelian Varieties* (2nd ed.), Chapter IV.
- Moonen, B. *Abelian Varieties*, Chapter X (Tate Modules). Available at math.ru.nl.
- Conrad, B. *Lecture 2: Abelian Varieties*, Stanford Mordell Seminar. Available at virtualmath1.stanford.edu.
- Dembélé, L. *Abelian Varieties over Finite Fields: Honda-Tate's Theorem*, AWS 2024 Lecture Notes.
- LMFDB Knowledge: [Tate module of an elliptic curve](https://www.lmfdb.org/knowledge/show/ec.padic_tate_module).
