---
title: "A0. Structure Theorem for Modules over PIDs"
tags: [math, algebra-foundations, appendix]
created: 2026-03-28
---

> Bài học liên quan: [[10-modules-over-pids|10. Finitely Generated Modules over PIDs]]

---

## Structure Theorem

> [!theorem] Theorem A0.1 — Structure Theorem for Finitely Generated Modules over a PID
> Cho $R$ là PID và $M$ là finitely generated $R$-module. Khi đó:
>
> $$
> M \cong R^r \oplus R/(d_1) \oplus R/(d_2) \oplus \cdots \oplus R/(d_k)
> $$
>
> với $r \geq 0$, $d_i \in R$ không phải unit và $\neq 0$, và $d_1 \mid d_2 \mid \cdots \mid d_k$. Phân tách này duy nhất.

---

## Proof

Chứng minh chia làm hai phần: **tồn tại** (existence) và **tính duy nhất** (uniqueness).

### Phần I: Free submodules của $R^n$ trên PID

**Bổ đề A0.2.** Mọi submodule của $R^n$ (với $R$ là PID) là free, rank $\leq n$.

*Chứng minh bổ đề bằng induction trên $n$.*

Với $n = 1$: submodule của $R^1 = R$ là ideal $I = (a)$ với $a \in R$ (vì $R$ là PID), isomorphic với $R$ (nếu $a \neq 0$) hoặc $0$ (nếu $a = 0$). Cả hai đều free, rank $\leq 1$.

Giả sử đúng với $n-1$. Cho $N \subseteq R^n$. Xét projection $\pi : R^n \to R$ lên tọa độ thứ nhất. Ảnh $\pi(N) \subseteq R$ là ideal, nên $\pi(N) = (a)$ với $a \in R$.

- Nếu $a = 0$: $N \subseteq \ker\pi = R^{n-1}$, áp dụng induction.
- Nếu $a \neq 0$: chọn $e \in N$ với $\pi(e) = a$. Thì $N = Re \oplus (N \cap \ker\pi)$ (vì mọi $m \in N$ với $\pi(m) = ra$ viết $m = re + (m - re)$ và $m-re \in \ker\pi$). Vì $N \cap \ker\pi \subseteq \ker\pi \cong R^{n-1}$, áp dụng induction: $N \cap \ker\pi$ free rank $\leq n-1$. Vậy $N = Re \oplus (N \cap \ker\pi)$ free rank $\leq n$. $\square$

### Phần II: Tồn tại phân tách

Vì $M$ finitely generated, có surjection $\pi: R^n \to M$ với $n$ hữu hạn. Đặt $K = \ker\pi$. Bổ đề A0.2 cho $K$ là free module rank $k \leq n$.

Chọn basis $\{f_1, \ldots, f_n\}$ của $R^n$ và basis $\{e_1, \ldots, e_k\}$ của $K$. Biểu diễn $e_j = \sum_i a_{ij} f_i$, thu được ma trận $A = (a_{ij})$ kích thước $n \times k$.

**Smith Normal Form của $A$:** Qua row và column operations (tương ứng với đổi basis của $R^n$ và $K$), biến $A$ thành $D = \operatorname{diag}(d_1, \ldots, d_s, 0, \ldots, 0)$ với $d_i \neq 0$ và $d_1 \mid d_2 \mid \cdots \mid d_s$.

Trong basis mới $\{f_1', \ldots, f_n'\}$ của $R^n$ và $\{e_1', \ldots, e_k'\}$ của $K$: $e_j' = d_j f_j'$ (với $j \leq s$).

Khi đó:

$$
M = R^n / K \cong \bigoplus_{j=1}^s R f_j' / R d_j f_j' \oplus \bigoplus_{j=s+1}^n R f_j'
$$

$$
= R/(d_1) \oplus \cdots \oplus R/(d_s) \oplus R^{n-s}
$$

Đặt $r = n - s$, loại bỏ những $d_i$ là unit (vì $R/(u) = 0$), và đặt lại thứ tự: ta thu được dạng canonical với $d_1 \mid \cdots \mid d_k$. $\square$

### Phần III: Smith Normal Form tồn tại

Ta cần chứng minh mọi ma trận với entries trong PID $R$ đều có Smith Normal Form.

**Thuật toán:** Lặp lại:

1. Nếu $A = 0$: xong.
2. Nếu $A \neq 0$: tìm entry $a_{ij} \neq 0$ với $\gcd$ của mọi entries chia hết $a_{ij}$ (chọn entry với $N(a_{ij})$ nhỏ nhất nếu $R$ là ED, hoặc dùng argument Noetherian nói chung).
3. Dùng row/column operations đưa $a_{ij}$ về vị trí $(1,1)$.
4. Dùng phép chia Euclid (hoặc ACC) để đưa $a_{11}$ chia hết mọi entry trong hàng $1$ và cột $1$ (Euclidean algorithm trong PID).
5. Khi $a_{11}$ chia hết mọi entry trong row $1$ và column $1$, triệt tiêu chúng: $A$ trở thành block diagonal với $a_{11}$ ở góc trên trái và ma trận nhỏ hơn bên phải dưới.
6. Đệ quy cho ma trận nhỏ hơn.

Thuật toán dừng vì mỗi bước giảm $N(a_{11})$ hoặc giảm số entry khác $0$ — điều kiện ACC của PID đảm bảo dừng. $\square$

### Phần IV: Tính duy nhất

Tính duy nhất của invariant factors theo từng thứ tự hệ quả từ:

**Tính duy nhất của $r$** (rank tự do): $r = \dim_{K} M \otimes_R K$ với $K = \operatorname{Frac}(R)$.

**Tính duy nhất của $d_1, \ldots, d_k$** (đến associates): Sử dụng **Fitting ideals** (hay elementary ideals). Với mỗi $m \geq 0$, định nghĩa $m$-th Fitting ideal $\operatorname{Fitt}_m(M)$ là ideal sinh bởi các $(n-m) \times (n-m)$ minors của relation matrix $A$. Fitting ideals là bất biến của $M$ (không phụ thuộc vào chọn presentation). Invariant factors xác định duy nhất bởi:

$$
d_1 \cdots d_j = \gcd \text{ của tất cả } j \times j \text{ minors của } A
$$

Vì các $\gcd$ này là bất biến, $d_1, \ldots, d_k$ xác định duy nhất đến associates. $\blacksquare$

---

## Nhận xét về Proof

Phần khó nhất về mặt kỹ thuật là bước (4) trong thuật toán Smith Normal Form — đảm bảo $a_{11}$ chia hết mọi entry còn lại. Điều này đòi hỏi: nếu $a_{11} \nmid a_{1j}$, dùng phép chia $a_{1j} = qa_{11} + r$ với $N(r) < N(a_{11})$, cộng $q$ lần cột $j$ vào cột $1$, thay thế $a_{11}$ bằng $r$. Lặp đến khi $a_{11} \mid a_{1j}$.

Tính duy nhất qua Fitting ideals là cách thanh lịch nhất — nhưng cũng có thể chứng minh trực tiếp bằng induction trên structure của torsion module.

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Theorem 12.5 và 12.9.
- Lang, S. *Algebra* (revised 3rd ed.), Chapter III, Theorem 7.6.
- Jacobson, N. *Basic Algebra I*, Chapter 3.
