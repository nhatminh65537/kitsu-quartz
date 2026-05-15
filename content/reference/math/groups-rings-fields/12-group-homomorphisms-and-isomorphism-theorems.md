---
title: "12. Group Homomorphisms and Isomorphism Theorems"
type: math-component
tags: [math, groups-rings-fields, group-theory, lesson-12]
aliases: [Group Homomorphisms and Isomorphism Theorems]
created: 2026-05-15
---

> **Prerequisites**: [[11-normal-subgroups-and-quotient-groups|11. Normal Subgroups and Quotient Groups]]
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $G, H$ | Nhóm |
> | $N \trianglelefteq G$ | $N$ là nhóm con chuẩn tắc của $G$ |
> | $G/N$ | Nhóm thương |
> | $e_G$ | Phần tử đơn vị của $G$ |
> | $Z(G)$ | Tâm của $G$ |
> | $S_n, A_n$ | Nhóm đối xứng và nhóm thay phiên |
> | $GL_n(F), SL_n(F)$ | Nhóm tuyến tính tổng quát và nhóm tuyến tính đặc biệt |

> **Objectives**:
> - Định nghĩa đồng cấu nhóm (group homomorphism), hạt nhân, và ảnh.
> - Chứng minh các tính chất cơ bản: $\phi(e) = e'$, $\phi(a^{-1}) = \phi(a)^{-1}$, $\ker\phi \trianglelefteq G$.
> - Phát biểu và chứng minh Ba định lý đẳng cấu: First, Second, Third Isomorphism Theorem.
> - Phát biểu Định lý tương ứng (Correspondence Theorem / Lattice Isomorphism Theorem).

---

## Motivation

Một trong những công cụ mạnh nhất trong đại số là khái niệm **đồng cấu** (homomorphism): ánh xạ giữa hai cấu trúc đại số bảo toàn phép toán. Đồng cấu cho phép ta "chiếu" một nhóm lên một nhóm khác đơn giản hơn, giữ nguyên cấu trúc.

Ví dụ: ánh xạ $\text{sgn}: S_n \to \{\pm 1\}$ gửi mỗi hoán vị tới dấu của nó ($+1$ nếu chẵn, $-1$ nếu lẻ) là đồng cấu nhóm. Hạt nhân (kernel) của đồng cấu này chính là $A_n$.

Ba định lý đẳng cấu (Isomorphism Theorems) hệ thống hóa mối quan hệ giữa đồng cấu, hạt nhân, và nhóm thương. Chúng là nền tảng cho mọi tính toán trong lý thuyết nhóm.

---

## 1. Đồng Cấu Nhóm (Group Homomorphism)

> [!definition] Definition 12.1 — Đồng cấu nhóm (Group Homomorphism)
> Cho $(G, \cdot)$ và $(H, \star)$ là hai nhóm. Ánh xạ $\phi: G \to H$ được gọi là **đồng cấu nhóm** (group homomorphism) nếu:
>
> $$
> \forall\, a, b \in G: \quad \phi(a \cdot b) = \phi(a) \star \phi(b)
> $$

> [!definition] Definition 12.2 — Kernel và Image
> Cho $\phi: G \to H$ là đồng cấu.
>
> - **Hạt nhân** (kernel): $\ker\phi = \{g \in G \mid \phi(g) = e_H\}$.
> - **Ảnh** (image): $\operatorname{Im}\phi = \phi(G) = \{\phi(g) \mid g \in G\}$.

> [!definition] Definition 12.3 — Các loại đồng cấu
> - **Đơn cấu** (monomorphism): $\phi$ đơn ánh (injective).
> - **Toàn cấu** (epimorphism): $\phi$ toàn ánh (surjective).
> - **Đẳng cấu** (isomorphism): $\phi$ song ánh (bijective). Ký hiệu $G \cong H$.
> - **Tự đẳng cấu** (automorphism): đẳng cấu $G \to G$.
> - **Tự đẳng cấu trong** (inner automorphism): $\varphi_g(x) = gxg^{-1}$ với $g \in G$.

---

## 2. Tính Chất Cơ Bản của Đồng Cấu

> [!abstract] Theorem 12.4 — Tính chất cơ bản
> Cho $\phi: G \to H$ là đồng cấu.
>
> 1. $\phi(e_G) = e_H$.
> 2. $\phi(a^{-1}) = \phi(a)^{-1}$ với mọi $a \in G$.
> 3. $\phi(a^n) = \phi(a)^n$ với mọi $n \in \mathbb{Z}$.
> 4. $\ker\phi \trianglelefteq G$.
> 5. $\operatorname{Im}\phi \leq H$.
> 6. $\phi$ đơn ánh $\iff$ $\ker\phi = \{e_G\}$.
> 7. Nếu $K \leq G$ thì $\phi(K) \leq H$. Nếu $K \trianglelefteq G$ và $\phi$ toàn ánh thì $\phi(K) \trianglelefteq H$.
> 8. Nếu $L \leq H$ thì $\phi^{-1}(L) \leq G$. Nếu $L \trianglelefteq H$ thì $\phi^{-1}(L) \trianglelefteq G$.

**Proof (chọn lọc).**

*(1)* $\phi(e_G) = \phi(e_G \cdot e_G) = \phi(e_G) \cdot \phi(e_G)$. Nhân nghịch đảo $\phi(e_G)^{-1}$ vào: $e_H = \phi(e_G)$.

*(2)* $\phi(a) \cdot \phi(a^{-1}) = \phi(aa^{-1}) = \phi(e_G) = e_H$. Vậy $\phi(a^{-1}) = \phi(a)^{-1}$.

*(4)* Ta dùng tiêu chuẩn nhóm con: $\ker\phi \neq \emptyset$ (có $e_G$). Với $a, b \in \ker\phi$: $\phi(ab^{-1}) = \phi(a)\phi(b)^{-1} = e_H \cdot e_H^{-1} = e_H$, nên $ab^{-1} \in \ker\phi$. Vậy $\ker\phi \leq G$.
Chuẩn tắc: với $g \in G$, $n \in \ker\phi$: $\phi(gng^{-1}) = \phi(g)\phi(n)\phi(g)^{-1} = \phi(g)e_H\phi(g)^{-1} = e_H$. Vậy $gng^{-1} \in \ker\phi$.

*(6)* $(\Rightarrow)$ Nếu $\phi$ đơn ánh và $\phi(g) = e_H = \phi(e_G)$, thì $g = e_G$, tức $\ker\phi = \{e_G\}$.
$(\Leftarrow)$ Nếu $\ker\phi = \{e_G\}$ và $\phi(a) = \phi(b)$, thì $e_H = \phi(a)^{-1}\phi(b) = \phi(a^{-1}b)$, nên $a^{-1}b \in \ker\phi = \{e_G\}$, tức $a = b$. $\blacksquare$

> [!example] Example 12.5 — Các đồng cấu quan trọng

| Đồng cấu | Miền | Đối miền | Kernel | Tính chất |
|----------|------|----------|--------|-----------|
| Dấu $\text{sgn}$ | $S_n$ | $\{\pm 1\}$ | $A_n$ | Toàn cấu, $S_n/A_n \cong \mathbb{Z}_2$ |
| Định thức $\det$ | $GL_n(F)$ | $F^\times$ | $SL_n(F)$ | Toàn cấu |
| Chiếu chính tắc $\pi$ | $G$ | $G/N$ | $N$ | Toàn cấu |
| Bao gồm $i$ | $H$ | $G$ | $\{e\}$ | Đơn cấu |
| Liên hợp $\varphi_g$ | $G$ | $G$ | $\{e\}$ | Tự đẳng cấu |
| Nâng lũy thừa $n$ | $\mathbb{Z}$ | $\mathbb{Z}$ | $\{0\}$ | Đơn cấu |

---

## 3. Định Lý Đẳng Cấu Thứ Nhất (First Isomorphism Theorem)

> [!abstract] Theorem 12.6 — Định lý đẳng cấu thứ nhất (First Isomorphism Theorem)
> Cho $\phi: G \to H$ là đồng cấu nhóm. Khi đó:
>
> $$
> G / \ker\phi \cong \operatorname{Im}\phi
> $$
>
> Cụ thể, ánh xạ $\tilde{\phi}: G/\ker\phi \to \operatorname{Im}\phi$ định nghĩa bởi $\tilde{\phi}(g\ker\phi) = \phi(g)$ là đẳng cấu nhóm.

**Proof.**
Đặt $K = \ker\phi$.

**Hợp lệ (well-defined)**: Nếu $gK = g'K$ thì $g^{-1}g' \in K$, tức $\phi(g^{-1}g') = e_H$, tức $\phi(g)^{-1}\phi(g') = e_H$, tức $\phi(g) = \phi(g')$. Vậy $\tilde{\phi}$ hợp lệ.

**Đồng cấu**: $\tilde{\phi}((aK)(bK)) = \tilde{\phi}(abK) = \phi(ab) = \phi(a)\phi(b) = \tilde{\phi}(aK)\tilde{\phi}(bK)$.

**Đơn ánh**: $\tilde{\phi}(gK) = e_H \Rightarrow \phi(g) = e_H \Rightarrow g \in K \Rightarrow gK = K = e_{G/K}$.

**Toàn ánh**: $\tilde{\phi}$ toàn ánh lên $\operatorname{Im}\phi$ theo định nghĩa.

Vậy $\tilde{\phi}$ là đẳng cấu $G/K \xrightarrow{\sim} \operatorname{Im}\phi$. $\blacksquare$

*(Phiên bản chi tiết của chứng minh này có trong [[a1-first-isomorphism-theorem|A1. Proof of First Isomorphism Theorem]].)*

> [!example] Example 12.7 — Ứng dụng định lý thứ nhất
>
> **Ví dụ 1 — $\det$**: $\det: GL_n(\mathbb{R}) \to \mathbb{R}^\times$. $\ker\det = SL_n(\mathbb{R})$, $\operatorname{Im}\det = \mathbb{R}^\times$. Kết luận: $GL_n(\mathbb{R})/SL_n(\mathbb{R}) \cong \mathbb{R}^\times$.
>
> **Ví dụ 2 — $\text{sgn}$**: $\text{sgn}: S_n \to \{\pm 1\}$. $\ker = A_n$, $\operatorname{Im} = \{\pm 1\}$. Kết luận: $S_n/A_n \cong \mathbb{Z}/2\mathbb{Z}$.
>
> **Ví dụ 3 — Phép chiếu**: $\phi: \mathbb{Z} \to \mathbb{Z}/n\mathbb{Z}$, $k \mapsto k \bmod n$. $\ker\phi = n\mathbb{Z}$, $\operatorname{Im}\phi = \mathbb{Z}/n\mathbb{Z}$. Kết luận: $\mathbb{Z}/n\mathbb{Z} \cong \mathbb{Z}/n\mathbb{Z}$. ✓

---

## 4. Định Lý Đẳng Cấu Thứ Hai (Second Isomorphism Theorem)

> [!abstract] Theorem 12.8 — Định lý đẳng cấu thứ hai (Second / Diamond Isomorphism Theorem)
> Cho $H \leq G$ và $N \trianglelefteq G$. Khi đó:
>
> 1. $HN = \{hn \mid h \in H, n \in N\}$ là nhóm con của $G$ (và $N \trianglelefteq HN$).
> 2. $H \cap N \trianglelefteq H$.
> 3. $H/(H \cap N) \cong HN/N$.

**Proof.**
*(1)* $N \trianglelefteq G$ và $H \leq G$ $\Rightarrow$ $HN = NH$. Kiểm tra $HN$ là nhóm con: $(h_1 n_1)(h_2 n_2)^{-1} = h_1 n_1 n_2^{-1} h_2^{-1} = h_1 (n_1 n_2^{-1}) h_2^{-1}$. Vì $N \trianglelefteq G$: $n_1 n_2^{-1} h_2^{-1} = h_2^{-1} n'$ cho $n' \in N$. Vậy tích $= (h_1 h_2^{-1}) n' \in HN$.

*(2)* $H \cap N \neq \emptyset$ (chứa $e$). Với $a, b \in H \cap N$: $ab^{-1} \in H$ (vì $H \leq G$) và $ab^{-1} \in N$ (vì $N \leq G$). Chuẩn tắc trong $H$: với $h \in H$, $n \in H \cap N$: $hnh^{-1} \in H$ (vì $H \leq G$) và $hnh^{-1} \in N$ (vì $N \trianglelefteq G$). Vậy $H \cap N \trianglelefteq H$.

*(3)* Định nghĩa $\phi: H \to HN/N$ bởi $\phi(h) = hN$. Đây là đồng cấu toàn ánh. Hạt nhân: $\ker\phi = \{h \in H \mid hN = N\} = H \cap N$.

Theo định lý thứ nhất: $H/(H \cap N) = H/\ker\phi \cong \operatorname{Im}\phi = HN/N$. $\blacksquare$

> [!note] Remark 12.9 — Sơ đồ "viên kim cương"
>
> ```
>       HN
>      /   \
>     H     N
>      \   /
>      H∩N
> ```
>
> Hai "cạnh" trên và dưới có chỉ số bằng nhau: $[HN:N] = [H:H\cap N]$.

---

## 5. Định Lý Đẳng Cấu Thứ Ba (Third Isomorphism Theorem)

> [!abstract] Theorem 12.10 — Định lý đẳng cấu thứ ba (Third Isomorphism Theorem)
> Cho $N \trianglelefteq G$ và $H \trianglelefteq G$ với $N \leq H$. Khi đó $H/N \trianglelefteq G/N$ và:
>
> $$
> (G/N) / (H/N) \cong G/H
> $$

**Proof.** $H/N = \{hN \mid h \in H\}$ là tập con của $G/N$. Kiểm tra $H/N \trianglelefteq G/N$: với $gN \in G/N$ và $hN \in H/N$: $(gN)(hN)(gN)^{-1} = (ghg^{-1})N \in H/N$ vì $ghg^{-1} \in H$ (do $H \trianglelefteq G$).

Định nghĩa $\phi: G/N \to G/H$ bởi $\phi(gN) = gH$. Hợp lệ: $gN = g'N \Rightarrow g^{-1}g' \in N \leq H \Rightarrow gH = g'H$. Đồng cấu, toàn ánh. Hạt nhân: $\phi(gN) = H \iff gH = H \iff g \in H \iff gN \in H/N$.

Định lý thứ nhất: $(G/N)/(H/N) \cong G/H$. $\blacksquare$

> [!example] Example 12.11 — Áp dụng Định lý III
> Lấy $G = \mathbb{Z}$, $H = 6\mathbb{Z}$, $N = 24\mathbb{Z}$. Khi đó:
>
> $(G/N)/(H/N) = (\mathbb{Z}/24\mathbb{Z}) / (6\mathbb{Z}/24\mathbb{Z}) \cong \mathbb{Z}/6\mathbb{Z} = G/H$. ✓

---

## 6. Định Lý Tương Ứng (Correspondence Theorem)

> [!abstract] Theorem 12.12 — Định lý tương ứng (Lattice Isomorphism Theorem)
> Cho $N \trianglelefteq G$ và $\pi: G \to G/N$ là đồng cấu thương. Khi đó có song ánh bảo toàn giao và bao gồm:
>
> $$
> \left\{H \mid N \leq H \leq G\right\} \longleftrightarrow \left\{\bar{H} \mid \bar{H} \leq G/N\right\}
> $$
>
> bởi $H \mapsto H/N$ (ảnh thuận) và $\bar{H} \mapsto \pi^{-1}(\bar{H})$ (ảnh ngược).
>
> Dưới song ánh này:
> - $H_1 \leq H_2 \iff H_1/N \leq H_2/N$.
> - $[H_2:H_1] = [H_2/N : H_1/N]$.
> - $H \trianglelefteq G \iff H/N \trianglelefteq G/N$, và khi đó $(G/N)/(H/N) \cong G/H$.

> [!example] Example 12.13 — Các nhóm con của $\mathbb{Z}/12\mathbb{Z}$
> Với $N = 12\mathbb{Z} \trianglelefteq \mathbb{Z}$, định lý tương ứng cho biết: nhóm con của $\mathbb{Z}/12\mathbb{Z}$ ↔ nhóm con của $\mathbb{Z}$ chứa $12\mathbb{Z}$ ↔ $\{n\mathbb{Z} \mid n \mid 12\}$.
>
> Xác nhận: các nhóm con của $\mathbb{Z}_{12}$ là $\langle d \rangle$ với $d \mid 12$.

---

## 7. Tự Đẳng Cấu (Automorphisms)

> [!definition] Definition 12.14 — Nhóm tự đẳng cấu
> $\operatorname{Aut}(G) = \{\phi: G \to G \mid \phi \text{ là đẳng cấu}\}$ với phép hợp thành.

> [!definition] Definition 12.15 — Inner Automorphism và Outer Automorphism
> Với $g \in G$, $\varphi_g: G \to G$, $x \mapsto gxg^{-1}$ là tự đẳng cấu gọi là **inner automorphism**.
>
> $\operatorname{Inn}(G) = \{\varphi_g \mid g \in G\} \trianglelefteq \operatorname{Aut}(G)$.
>
> $\operatorname{Out}(G) = \operatorname{Aut}(G) / \operatorname{Inn}(G)$ là **outer automorphism group**.

> [!abstract] Theorem 12.16
> $\operatorname{Inn}(G) \cong G/Z(G)$.

**Proof.** Ánh xạ $\Phi: G \to \operatorname{Inn}(G)$, $g \mapsto \varphi_g$ là đồng cấu toàn ánh. $\ker\Phi = \{g \in G \mid \varphi_g = \operatorname{id}\} = \{g \mid gxg^{-1} = x,\, \forall x\} = Z(G)$. Định lý thứ nhất cho $G/Z(G) \cong \operatorname{Inn}(G)$. $\blacksquare$

> [!example] Example 12.17 — Outer automorphism của $S_6$
> Một kết quả nổi tiếng: trong tất cả các nhóm đối xứng $S_n$, chỉ $S_6$ có outer automorphism không tầm thường. Cụ thể: $|\operatorname{Out}(S_6)| = 2$, trong khi $\operatorname{Out}(S_n) = 1$ với mọi $n \neq 6$. Đây là một trong những "kỳ quan" của lý thuyết nhóm hữu hạn.

---

## 8. SageMath Cheatsheet

```python
# ---- Kernel và Image qua nhóm thương ----
G = SymmetricGroup(4)
# A4 là derived subgroup của S4, cũng là nhóm thay phiên
A4 = G.derived_subgroup()
print("|A4| =", A4.order())          # 12
print("Is A4 normal in S4?", A4.is_normal(G))  # True

# Định lý thứ nhất: S4/A4 ≅ Z/2Z (cyclic cấp 2)
Q = G.quotient(A4)
print("|S4/A4| =", Q.order())        # 2
print("S4/A4 ≅ Z2:", Q.is_cyclic())  # True

# ---- Định lý thứ nhất với nhóm cyclic ----
Z12 = AdditiveAbelianGroup([12])      # Z/12Z
g = Z12.gen(0)                         # generator 1
# Đồng cấu: nhân với 4 (φ(x) = 4x)
Z12_2 = AdditiveAbelianGroup([12])     # codomain cũng là Z/12Z
phi = Z12.hom([4 * g], Z12_2)          # ảnh của generator 1 là 4
K = phi.kernel()
print("|ker φ| =", K.order())          # gcd(4,12) = 4
print("|Im φ| =", phi.image().order()) # 12/gcd(4,12) = 3

# Kiểm tra Z12/ker ≅ Im
print(Z12.quotient(K).is_isomorphic(phi.image()))  # True

# ---- Automorphism group của cyclic group ----
Z5 = CyclicPermutationGroup(5)
# Aut(Z5) ≅ (Z/5Z)^× ≅ Z/4Z
print("|Aut(Z5)| =", Z5.automorphism_group().order())  # phi(5) = 4

# ---- Inner automorphisms ----
G = SymmetricGroup(3)
# Inn(G) ≅ G/Z(G)
print("|Inn(S3)| =", G.order() // G.center().order())  # 6/1 = 6

# ---- Abelianization qua derived subgroup ----
G = SymmetricGroup(4)
D = G.derived_subgroup()               # [S4, S4] = A4
Ab = G.quotient(D)                      # S4^ab = S4/A4 ≅ Z2
print("|S4^ab| =", Ab.order())          # 2
print("S4^ab ≅ Z2:", Ab.is_cyclic())    # True

# ---- Định lý thứ hai: H/(H∩N) ≅ HN/N ----
G = SymmetricGroup(4)
H = G.subgroup([G([(1,2)]), G([(3,4)])])   # H ≅ V4
N = G.alternating_group()                   # N = A4 (nếu phương thức tồn tại)
# Nếu alternating_group() không có, dùng:
N = G.derived_subgroup()                    # [S4,S4] = A4
HN = G.subgroup(list(H) + list(N))          # HN (không đảm bảo đúng nếu ko cẩn thận)
print("H order:", H.order())                # 4
print("N order:", N.order())                # 12
```

---

## 9. Summary

- $\phi: G \to H$ đồng cấu: $\phi(ab) = \phi(a)\phi(b)$; $\phi(e) = e'$; $\phi(a^{-1}) = \phi(a)^{-1}$.
- $\ker\phi \trianglelefteq G$, $\operatorname{Im}\phi \leq H$.
- $\phi$ đơn ánh $\iff$ $\ker\phi = \{e\}$.
- **Định lý I**: $G/\ker\phi \cong \operatorname{Im}\phi$.
- **Định lý II**: $H/(H\cap N) \cong HN/N$ (với $H \leq G$, $N \trianglelefteq G$).
- **Định lý III**: $(G/N)/(H/N) \cong G/H$ (với $N \leq H$, cả hai chuẩn tắc trong $G$).
- **Định lý tương ứng**: song ánh giữa nhóm con của $G$ chứa $N$ và nhóm con của $G/N$.
- $\operatorname{Inn}(G) \cong G/Z(G)$.

---

## 10. References

- Dummit & Foote, *Abstract Algebra* (3rd ed.), §3.3.
- Judson, *Abstract Algebra: Theory and Applications*, Chapters 11, 20.
- Hungerford, *Algebra*, Chapter I §5.
