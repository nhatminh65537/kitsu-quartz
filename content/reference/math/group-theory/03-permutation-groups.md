---
title: "03. Permutation Groups"
tags: [math, group-theory, lesson-03]
aliases: [Permutation Groups]
created: 2026-03-26
---

> **Prerequisites**: [[01-groups-and-subgroups|01. Groups and Subgroups]], [[02-cyclic-groups|02. Cyclic Groups]]
> **Objectives**:
> - Nắm vững ký hiệu chu trình (cycle notation) và phép nhân hoán vị
> - Chứng minh mọi hoán vị đều phân tích được thành chu trình rời nhau (disjoint cycles) và thành tích của các chuyển vị (transpositions)
> - Định nghĩa tính chẵn lẻ (parity) và chứng minh tính well-defined
> - Xây dựng nhóm luân phiên $A_n$ và tính $|A_n| = n!/2$
> - Phát biểu và chứng minh định lý Cayley

---

## Motivation / Intuition

Nhóm hoán vị (permutation group) là nơi lý thuyết nhóm bắt đầu — trước cả khi có định nghĩa tiên đề của nhóm, Galois và Lagrange đã làm việc trực tiếp với các hoán vị của nghiệm phương trình. Hơn thế nữa, định lý Cayley sẽ cho thấy mọi nhóm hữu hạn đều nhúng vào một nhóm hoán vị nào đó — theo nghĩa này, $S_n$ là "nhóm phổ quát" chứa tất cả.

Về mặt kỹ thuật, $S_n$ và $A_n$ là các ví dụ tường minh, có thể tính toán được để kiểm tra mọi định lý trừu tượng. Ở mức graduate, nhóm hoán vị còn đóng vai trò trung tâm trong lý thuyết biểu diễn, lý thuyết Galois, và tổ hợp học đại số.

---

## Hoán vị và $S_n$

### Definition

> [!definition] Definition 3.1 — Hoán vị và nhóm đối xứng (Symmetric Group)
> Cho $n \geq 1$. Một **hoán vị** (permutation) của tập $\{1, 2, \ldots, n\}$ là một song ánh $\sigma : \{1, \ldots, n\} \to \{1, \ldots, n\}$.
>
> Tập hợp tất cả hoán vị của $\{1, \ldots, n\}$, ký hiệu $S_n$, tạo thành nhóm dưới phép hợp thành hàm, gọi là **nhóm đối xứng** (symmetric group) bậc $n$.
>
> Ta có $|S_n| = n!$.
>
> [!note] Remark 3.2 — Quy ước nhân hoán vị
> Ta dùng quy ước **trái sang phải** (hay "áp dụng từ phải"): với $\sigma, \tau \in S_n$, tích $\sigma\tau$ nghĩa là "áp dụng $\sigma$ trước, rồi $\tau$":
>
> $$
> (\sigma\tau)(i) = \tau(\sigma(i))
> $$
>
> Một số tài liệu dùng quy ước ngược lại. Quy ước của ta nhất quán với Dummit–Foote.

---

## Ký hiệu chu trình (Cycle Notation)

### Definition

> [!definition] Definition 3.3 — Chu trình (Cycle)
> Một **chu trình độ dài $k$** (hay **$k$-cycle**) là hoán vị $\sigma \in S_n$ có dạng:
>
> $$
> \sigma = (a_1 \; a_2 \; \cdots \; a_k)
> $$
>
> nghĩa là $\sigma(a_1) = a_2,\; \sigma(a_2) = a_3,\; \ldots,\; \sigma(a_{k-1}) = a_k,\; \sigma(a_k) = a_1$, và $\sigma(i) = i$ với mọi $i \notin \{a_1, \ldots, a_k\}$.
>
> Chu trình độ dài $2$ gọi là **chuyển vị** (transposition). Chu trình độ dài $1$ là phần tử đơn vị $e$.
>
> [!note] Remark 3.4 — Cùng một chu trình, nhiều cách viết
> Một chu trình có thể viết bắt đầu từ bất kỳ phần tử nào:
>
> $$
> (1 \; 2 \; 3 \; 4) = (2 \; 3 \; 4 \; 1) = (3 \; 4 \; 1 \; 2) = (4 \; 1 \; 2 \; 3)
> $$
>
> Hơn nữa, $(a_1 \; a_2 \; \cdots \; a_k)^{-1} = (a_k \; a_{k-1} \; \cdots \; a_1)$.
>
> [!example] Example 3.5 — Nhân hoán vị bằng cycle notation
> Trong $S_5$, tính $(1\;3\;5)(2\;4)(1\;2\;3)$. Áp dụng từ phải sang trái với từng phần tử:
>
> - $1 \xrightarrow{(1\;2\;3)} 2 \xrightarrow{(2\;4)} 4 \xrightarrow{(1\;3\;5)} 4$. Vậy $1 \mapsto 4$.
> - $2 \xrightarrow{(1\;2\;3)} 3 \xrightarrow{(2\;4)} 3 \xrightarrow{(1\;3\;5)} 5$. Vậy $2 \mapsto 5$.
> - $3 \xrightarrow{(1\;2\;3)} 1 \xrightarrow{(2\;4)} 1 \xrightarrow{(1\;3\;5)} 3$. Vậy $3 \mapsto 3$.
> - $4 \xrightarrow{(1\;2\;3)} 4 \xrightarrow{(2\;4)} 2 \xrightarrow{(1\;3\;5)} 2$. Vậy $4 \mapsto 2$.
> - $5 \xrightarrow{(1\;2\;3)} 5 \xrightarrow{(2\;4)} 5 \xrightarrow{(1\;3\;5)} 1$. Vậy $5 \mapsto 1$.
>
> Vậy $(1\;3\;5)(2\;4)(1\;2\;3) = (1\;4\;2\;5)$.

---

## Phân tích thành tích chu trình rời nhau

> [!definition] Definition 3.6 — Chu trình rời nhau (Disjoint Cycles)
> Hai chu trình $(a_1 \cdots a_k)$ và $(b_1 \cdots b_l)$ được gọi là **rời nhau** (disjoint) nếu $\{a_1,\ldots,a_k\} \cap \{b_1,\ldots,b_l\} = \emptyset$.
>
> [!abstract] Theorem 3.7 — Phân tích thành tích chu trình rời nhau
> Mọi hoán vị $\sigma \in S_n$ ($\sigma \neq e$) đều có thể viết như một tích các chu trình rời nhau:
>
> $$
> \sigma = c_1 c_2 \cdots c_r
> $$
>
> trong đó các $c_i$ là chu trình độ dài $\geq 2$, rời nhau từng đôi. Phân tích này là **duy nhất** (đến thứ tự của các chu trình).

**Proof (sketch).**
Định nghĩa quan hệ tương đương trên $\{1,\ldots,n\}$: $i \sim j$ nếu tồn tại $k \in \mathbb{Z}$ sao cho $\sigma^k(i) = j$. Các lớp tương đương này phân hoạch $\{1,\ldots,n\}$ thành các **orbit** của $\sigma$. Mỗi orbit $\{a_1, \ldots, a_k\}$ (với $k \geq 2$) cho một chu trình $(a_1\; a_2 \; \cdots\; a_k)$ trong phân tích. Tính duy nhất suy ra từ việc mỗi phần tử thuộc đúng một orbit. $\blacksquare$

> [!note] Remark 3.8 — Chu trình rời nhau giao hoán
> Nếu $c_1$ và $c_2$ là chu trình rời nhau thì $c_1 c_2 = c_2 c_1$.
>
> [!abstract] Theorem 3.9 — Bậc hoán vị bằng lcm độ dài các chu trình
> Nếu $\sigma = c_1 c_2 \cdots c_r$ là phân tích thành chu trình rời nhau với $c_i$ có độ dài $l_i$, thì:
>
> $$
> \operatorname{ord}(\sigma) = \operatorname{lcm}(l_1, l_2, \ldots, l_r)
> $$

**Proof.**
Vì các chu trình rời nhau giao hoán, $\sigma^k = c_1^k c_2^k \cdots c_r^k$. Ta có $\sigma^k = e$ khi và chỉ khi $c_i^k = e$ với mọi $i$, tức $l_i \mid k$ với mọi $i$. Số nguyên dương nhỏ nhất thỏa điều kiện này là $\operatorname{lcm}(l_1, \ldots, l_r)$. $\blacksquare$

> [!example] Example 3.10 — Bậc hoán vị trong $S_7$
> Xét $\sigma = (1\;2\;3)(4\;5)(6\;7) \in S_7$. Các độ dài chu trình là $3, 2, 2$.
>
> $$
> \operatorname{ord}(\sigma) = \operatorname{lcm}(3, 2, 2) = 6
> $$
>
> Phần tử có bậc lớn nhất trong $S_7$: tìm phân hoạch $7 = l_1 + \cdots + l_r$ sao cho $\operatorname{lcm}(l_1, \ldots, l_r)$ lớn nhất. Thử $7 = 3 + 4$: $\operatorname{lcm}(3,4) = 12$. Thử $7 = 4 + 3$: như vậy. Thử $7 = 3 + 2 + 2$: $\operatorname{lcm} = 6$. Bậc tối đa trong $S_7$ là $12$.

---

## Chuyển vị và tính chẵn lẻ

> [!abstract] Theorem 3.11 — Mọi hoán vị là tích của chuyển vị
> Mọi hoán vị $\sigma \in S_n$ ($n \geq 2$) đều viết được như tích của các chuyển vị (transpositions).
>
> Cụ thể, mỗi $k$-cycle phân tích thành $k-1$ chuyển vị:
>
> $$
> (a_1 \; a_2 \; \cdots \; a_k) = (a_1 \; a_k)(a_1 \; a_{k-1}) \cdots (a_1 \; a_2)
> $$

**Proof.**
Kiểm tra trực tiếp: cả hai vế đều gửi $a_i \mapsto a_{i+1}$ (với $1 \leq i < k$), $a_k \mapsto a_1$, và cố định mọi phần tử còn lại. $\blacksquare$

> [!warning] Counterexample 3.12 — Phân tích thành chuyển vị không duy nhất
> $(1\;2\;3) = (1\;3)(1\;2) = (1\;3)(2\;3)(2\;1)(2\;3)$.
>
> Phân tích thành chuyển vị **không** duy nhất. Tuy nhiên, điều bất biến là **tính chẵn lẻ** của số lượng chuyển vị — đây chính là nội dung định lý sau.
>
> [!abstract] Theorem 3.13 — Tính well-defined của dấu hoán vị (Sign of a Permutation)
> Nếu $\sigma \in S_n$ viết được như tích của $r$ chuyển vị và cũng viết được như tích của $s$ chuyển vị, thì $r \equiv s \pmod{2}$.
>
> Do đó, ta định nghĩa well-defined **dấu** (sign) hay **tính chẵn lẻ** của $\sigma$:
>
> $$
> \operatorname{sgn}(\sigma) = (-1)^r \in \{+1, -1\}
> $$
>
> - $\sigma$ là **hoán vị chẵn** (even permutation) nếu $\operatorname{sgn}(\sigma) = +1$.
> - $\sigma$ là **hoán vị lẻ** (odd permutation) nếu $\operatorname{sgn}(\sigma) = -1$.

**Proof (via determinant).**
Định nghĩa đồng cấu $\pi : S_n \to \operatorname{GL}_n(\mathbb{R})$ bằng cách gửi $\sigma$ đến ma trận hoán vị $P_\sigma$ có $P_\sigma \mathbf{e}_i = \mathbf{e}_{\sigma(i)}$. Khi đó $\det(P_\sigma) \in \{+1, -1\}$ và mỗi chuyển vị $(i\;j)$ ứng với ma trận có $\det = -1$. Vậy $\det(P_\sigma) = (-1)^r$ không phụ thuộc vào cách phân tích. $\blacksquare$

> [!abstract] Theorem 3.14 — Đồng cấu dấu
> Ánh xạ $\operatorname{sgn} : S_n \to (\{+1, -1\}, \cdot)$ là đồng cấu nhóm:
>
> $$
> \operatorname{sgn}(\sigma\tau) = \operatorname{sgn}(\sigma) \cdot \operatorname{sgn}(\tau)
> $$
>
> Hệ quả:
> - Tích hai hoán vị chẵn là chẵn.
> - Tích hai hoán vị lẻ là chẵn.
> - Tích hoán vị chẵn và lẻ là lẻ.
>
> [!tip] Quy tắc tính dấu từ chu trình
> Một $k$-cycle có dấu $(-1)^{k-1}$. Vậy:
>
> $$
> \operatorname{sgn}(c_1 c_2 \cdots c_r) = \prod_{i=1}^{r} (-1)^{l_i - 1}
> $$
>
> trong đó $l_i$ là độ dài của $c_i$. Nói ngắn gọn: **chu trình độ dài chẵn là lẻ; chu trình độ dài lẻ là chẵn**.

---

## Nhóm luân phiên $A_n$

### Definition

> [!definition] Definition 3.15 — Nhóm luân phiên (Alternating Group)
> **Nhóm luân phiên** $A_n$ là tập hợp tất cả các hoán vị chẵn trong $S_n$:
>
> $$
> A_n = \ker(\operatorname{sgn}) = \left\{ \sigma \in S_n : \operatorname{sgn}(\sigma) = +1 \right\}
> $$
>
> Vì $\operatorname{sgn}$ là đồng cấu, $A_n \leq S_n$.
>
> [!abstract] Theorem 3.16 — Bậc của $A_n$
> Với $n \geq 2$: $|A_n| = n!/2$.

**Proof.**
Ánh xạ $f : A_n \to S_n \setminus A_n$ định bởi $f(\sigma) = (1\;2)\sigma$ là song ánh (bijection): nó gửi hoán vị chẵn đến lẻ và có nghịch đảo $f^{-1}(\tau) = (1\;2)\tau$. Vậy $|A_n| = |S_n \setminus A_n| = n!/2$. $\blacksquare$

> [!example] Example 3.17 — Bảng $A_3$ và $A_4$
> $A_3 = \left\{ e, (1\;2\;3), (1\;3\;2) \right\}$, bậc $3$, đẳng cấu với $\mathbb{Z}_3$.
>
> $A_4$ có bậc $12$. Các phần tử: $e$, tám 3-cycle, ba tích của hai chuyển vị rời nhau:
>
> $$
> \left\{e,\; (1\;2\;3),\; (1\;3\;2),\; (1\;2\;4),\; (1\;4\;2),\; (1\;3\;4),\; (1\;4\;3),\; (2\;3\;4),\; (2\;4\;3),\; (1\;2)(3\;4),\; (1\;3)(2\;4),\; (1\;4)(2\;3) \right\}
> $$
>
> Tập $V_4 = \left\{ e, (1\;2)(3\;4), (1\;3)(2\;4), (1\;4)(2\;3) \right\} \leq A_4$ là **Klein four-group** — nhóm con đặc biệt sẽ xuất hiện lại ở bài 09.
>
> [!note] Remark 3.18 — $A_n$ là đơn cho $n \geq 5$
> $A_n$ là **nhóm đơn** (simple group) với mọi $n \geq 5$ — tức không có nhóm con chuẩn tắc thực sự. Đây là một trong những kết quả sâu nhất của lý thuyết nhóm, có liên hệ trực tiếp với việc phương trình bậc $\geq 5$ không giải được bằng căn thức (bài 13). Trường hợp đặc biệt $A_4$: **không** đơn vì $V_4 \trianglelefteq A_4$.

---

## Loại chu trình và lớp liên hợp trong $S_n$

> [!definition] Definition 3.19 — Loại chu trình (Cycle Type)
> **Loại chu trình** (cycle type) của $\sigma \in S_n$ là dãy $(l_1, l_2, \ldots, l_r)$ với $l_1 \geq l_2 \geq \cdots \geq l_r \geq 2$ là các độ dài của chu trình trong phân tích rời nhau (bỏ qua 1-cycle).
>
> [!abstract] Theorem 3.20 — Hai hoán vị liên hợp khi và chỉ khi cùng loại chu trình
> Trong $S_n$: $\sigma$ và $\tau$ **liên hợp** (conjugate, tức tồn tại $\rho \in S_n$ với $\tau = \rho\sigma\rho^{-1}$) khi và chỉ khi chúng có cùng cycle type.
>
> Cụ thể, nếu $\sigma = (a_1 \cdots a_k)(b_1 \cdots b_l)\cdots$ và $\rho \in S_n$, thì:
>
> $$
> \rho\sigma\rho^{-1} = (\rho(a_1) \; \cdots \; \rho(a_k))(\rho(b_1) \; \cdots \; \rho(b_l)) \cdots
> $$

**Proof.**
Chiều ($\Rightarrow$): Áp dụng trực tiếp công thức trên — liên hợp chỉ đổi nhãn phần tử, không đổi cấu trúc chu trình.

Chiều ($\Leftarrow$): Nếu $\sigma$ và $\tau$ có cùng cycle type, ghép các chu trình có cùng độ dài lại để định nghĩa $\rho$ sao cho $\tau = \rho\sigma\rho^{-1}$. $\blacksquare$

> [!example] Example 3.21 — Lớp liên hợp trong $S_4$
> Phân hoạch của $4$: $4, 3+1, 2+2, 2+1+1, 1+1+1+1$. Mỗi phân hoạch tương ứng một lớp liên hợp trong $S_4$:
>
> | Loại chu trình | Ví dụ | Số phần tử |
> |----------------|-------|------------|
> | $(4)$ | $(1\;2\;3\;4)$ | $6$ |
> | $(3,1)$ | $(1\;2\;3)$ | $8$ |
> | $(2,2)$ | $(1\;2)(3\;4)$ | $3$ |
> | $(2,1,1)$ | $(1\;2)$ | $6$ |
> | $(1,1,1,1)$ | $e$ | $1$ |
>
> Tổng: $6 + 8 + 3 + 6 + 1 = 24 = 4!$. ✓

---

## Định lý Cayley

> [!abstract] Theorem 3.22 — Định lý Cayley (Cayley's Theorem)
> Mọi nhóm $G$ đều đẳng cấu với một nhóm con của nhóm đối xứng $S_G$ (nhóm tất cả song ánh $G \to G$).
>
> Nếu $|G| = n < \infty$, thì $G$ nhúng vào $S_n$.

**Proof.**
Với mỗi $g \in G$, định nghĩa phép dịch trái (left translation) $\lambda_g : G \to G$ bởi $\lambda_g(x) = gx$. Đây là song ánh (nghịch đảo là $\lambda_{g^{-1}}$). Xét đồng cấu $\phi : G \to S_G$ định bởi $\phi(g) = \lambda_g$.

$\phi$ là đồng cấu: $\phi(gh)(x) = \lambda_{gh}(x) = ghx = g(hx) = \lambda_g(\lambda_h(x)) = (\lambda_g \circ \lambda_h)(x)$, tức $\phi(gh) = \phi(g)\phi(h)$.

$\phi$ injective: nếu $\lambda_g = \lambda_h$ thì $\lambda_g(e) = \lambda_h(e)$, tức $g = h$.

Vậy $G \cong \phi(G) \leq S_G$. $\blacksquare$

> [!note] Remark 3.23 — Ý nghĩa định lý Cayley
> Định lý Cayley nói rằng về mặt cấu trúc trừu tượng, không có nhóm hữu hạn nào "lạ" hơn nhóm hoán vị — mọi nhóm hữu hạn đều là nhóm hoán vị ẩn (trong màu áo khác). Tuy nhiên, nhúng này thường không tối ưu: một nhóm bậc $n$ nhúng vào $S_n$, nhưng đôi khi có thể nhúng vào $S_k$ với $k \ll n$.

---

## SageMath Cheatsheet

```sage
G = SymmetricGroup(5)
sigma = G([(1,2,3),(4,5)])
tau   = G([(1,4),(2,5,3)])
sigma * tau

sigma.cycle_type()
sigma.order()
sigma.sign()

A4 = AlternatingGroup(4)
A4.order()
A4.is_simple()

S4 = SymmetricGroup(4)
S4.conjugacy_classes()

G = SymmetricGroup(4)
g = G([(1,2,3,4)])
conj_class = [tau * g * tau.inverse() for tau in G]
len(set(conj_class))
```

---

## Summary / Key Takeaways

- $S_n$ là nhóm tất cả hoán vị của $\{1,\ldots,n\}$, có bậc $n!$.
- Mọi hoán vị phân tích **duy nhất** thành tích chu trình rời nhau; bậc bằng $\operatorname{lcm}$ các độ dài.
- Mọi hoán vị viết được (không duy nhất) thành tích chuyển vị; nhưng **tính chẵn lẻ** là bất biến.
- $\operatorname{sgn} : S_n \to \{+1,-1\}$ là đồng cấu; $k$-cycle có dấu $(-1)^{k-1}$.
- $A_n = \ker(\operatorname{sgn})$, bậc $n!/2$; là nhóm đơn với $n \geq 5$.
- Hai hoán vị liên hợp trong $S_n$ khi và chỉ khi cùng cycle type.
- **Định lý Cayley**: mọi nhóm hữu hạn bậc $n$ nhúng vào $S_n$.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Chapter 3.
- Hungerford, T. W. *Algebra*, Chapter I §6.
- Milne, J. S. *Group Theory* (v4.00), Chapter 4. https://www.jmilne.org/math/CourseNotes/GT.pdf
- https://doc.sagemath.org/html/en/reference/groups/sage/groups/perm_gps/permgroup.html
