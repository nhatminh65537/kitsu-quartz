---
title: "03. New Linear Layers: M_E and M_I"
type: math-component
tags: [poseidon2, linear-layer, mds, math-component, lesson-03]
aliases: [Poseidon2 Linear Layers, M_E M_I]
source: "Poseidon2: A Faster Version of the Poseidon Hash Function — Grassi, Khovratovich, Schofnegger, AFRICACRYPT 2023"
created: 2026-03-15
---

> **Prerequisites**: MDS matrix và branch number (xem [[02-poseidon-hades|02. Poseidon & HADES]]), phép toán trên $\mathbb{F}_p^t$, circulant matrix cơ bản  
> 🔴 **Prerequisite references**: Grassi, Rechberger, Schofnegger — *Proving Resistance Against Infinitely Long Subspace Trails* [GRS21] (subspace trail theory)  
> **Lesson type**: Math Component  
> **Covers**: §4.1 (Requirements for Linear Layers), §4.2 (External Matrix $M_E$), §4.3 (Internal Matrix $M_I$)
>
> **Notation** (bổ sung từ Lesson 02):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $M_E \in \mathbb{F}_p^{t \times t}$ | External matrix — dùng trong full rounds | $M_E$ |
> | $M_I \in \mathbb{F}_p^{t \times t}$ | Internal matrix — dùng trong partial rounds | $M_I$ |
> | $M_4 \in \mathbb{F}_p^{4 \times 4}$ | Base $4 \times 4$ MDS matrix cho $M_E$ | $M_4$ |
> | $\mu_i \in \mathbb{F}_p$ | Diagonal offsets của $M_I$, $\mu_i \notin \{0, 1\}$ | $\mu_i$ |
> | $\mathbf{1} \in \mathbb{F}_p^t$ | Vector toàn $1$ | — |
> | $B(M)$ | Branch number của ma trận $M$ | $B(M)$ |

---

## Motivation

Điểm yếu lớn nhất của Poseidon gốc là linear layer. Với state size $t$, mỗi lần áp dụng MDS matrix $M \in \mathbb{F}_p^{t \times t}$ đòi hỏi tích vô hướng giữa $t$ hàng và vector $t$ phần tử — tổng cộng $O(t^2)$ phép nhân và cộng trường. Khi $t = 12$ (trường hợp phổ biến với Goldilocks), đó là $144$ phép tính mỗi round, và với $R_F + R_P \approx 30$ rounds, tổng chi phí linear layer **lấn át** chi phí S-box.

Poseidon2 giải quyết vấn đề này bằng cách dùng hai ma trận khác nhau cho hai loại rounds:

- **$M_E$** (External Matrix): dùng cho $R_F$ full rounds — cần diffusion mạnh (branch number cao), nhưng có thể khai thác cấu trúc khối để giảm chi phí
- **$M_I$** (Internal Matrix): dùng cho $R_P$ partial rounds — chỉ cần đủ diffusion để ngăn subspace trails, có thể dùng cấu trúc thưa hơn nhiều

---

## Yêu cầu cho Linear Layers (§4.1)

### Yêu cầu cho $M_E$ (External Matrix)

Trong full rounds, S-box được áp dụng cho toàn bộ $t$ phần tử → linear layer cần đảm bảo **statistical security** (chống differential và linear attacks). Theo wide trail strategy:

> [!abstract] Yêu cầu 3.1 — External Matrix
> $M_E$ phải có branch number đủ cao để đảm bảo số active S-boxes tối thiểu qua $R_F$ full rounds vượt ngưỡng an toàn $\lambda$ bits.
>
> Cụ thể: branch number $B(M_E) \geq t/4 + 4$ là đủ (thấp hơn $t+1$ của MDS đầy đủ, nhưng vẫn đảm bảo bảo mật như sẽ thấy).

### Yêu cầu cho $M_I$ (Internal Matrix)

Trong partial rounds, chỉ có **một** S-box được áp dụng. Linear layer cần đảm bảo sự thay đổi ở phần tử đó lan ra toàn bộ state — ngăn **subspace trails** (kẻ tấn công tìm invariant subspace để đơn giản hóa tính toán):

> [!abstract] Yêu cầu 3.2 — Internal Matrix
> $M_I$ phải **không có invariant subspace** (subspace trail có độ dài tùy ý). Điều này chỉ cần ma trận không có eigenvalue $1$ trên $\mathbb{F}_p$ — yêu cầu yếu hơn nhiều so với MDS.

---

## External Matrix $M_E$ (§4.2)

### Ý tưởng: Ma trận khối dựa trên $M_4$

Thay vì dùng một MDS matrix $t \times t$ dày đặc không có cấu trúc, Poseidon2 xây dựng $M_E$ từ một **base matrix $4 \times 4$ MDS** $M_4$ lặp lại theo kiểu circulant khối.

> [!note] Định nghĩa 3.3 — Base Matrix $M_4$
> $M_4 \in \mathbb{F}_p^{4 \times 4}$ là một MDS matrix cụ thể được chọn để tối ưu chi phí tính toán. Một lựa chọn hiệu quả là:
>
> $$
> M_4 = \begin{pmatrix} 5 & 7 & 1 & 3 \\ 4 & 6 & 1 & 1 \\ 1 & 3 & 5 & 7 \\ 1 & 1 & 4 & 6 \end{pmatrix} \pmod{p}
> $$
>
> Ma trận này có cấu trúc cho phép tính $M_4 \cdot v$ (với $v \in \mathbb{F}_p^4$) chỉ bằng **12 phép cộng** (không có phép nhân trường độc lập), nhờ các hệ số nhỏ có thể xử lý bằng repeated addition.

### Cấu trúc của $M_E$ cho $t \geq 4$

Với $t$ chia hết cho $4$, $M_E$ được định nghĩa là circulant khối:

$$
M_E = \mathsf{circ}(2 \cdot M_4,\; M_4,\; M_4,\; \ldots,\; M_4)
$$

Tức là: block đầu tiên là $2 \cdot M_4$, và $t/4 - 1$ blocks còn lại đều là $M_4$.

**Trường hợp $t = 2$ và $t = 3$**: dùng MDS matrix nhỏ tương ứng (trivial cases).

### Thuật toán tính $M_E \cdot x$ (§4.2, Algorithm)

> [!note] Scheme 3.4 — Efficient Multiplication $M_E \cdot x$
> **Input**: $x = (x_0, x_1, \ldots, x_{t-1}) \in \mathbb{F}_p^t$
>
> **Bước 1 — Áp dụng $M_4$ theo từng khối 4 phần tử**:
>
> Với mỗi $k = 0, 1, \ldots, t/4 - 1$:
>
> $$
> (y_{4k}, y_{4k+1}, y_{4k+2}, y_{4k+3}) \leftarrow M_4 \cdot (x_{4k}, x_{4k+1}, x_{4k+2}, x_{4k+3})
> $$
>
> Sau bước này: $y = M_4^{\oplus} \cdot x$ (áp dụng $M_4$ độc lập cho từng nhóm 4 phần tử, $t/4$ nhóm).
>
> **Bước 2 — Tính tổng từng "lane"**:
>
> Với mỗi $j \in \{0,1,2,3\}$, tính:
>
> $$
> \sigma_j = \sum_{k=0}^{t/4 - 1} y_{4k+j}
> $$
>
> **Bước 3 — Cộng thêm $\sigma_j$ vào mỗi phần tử trong lane $j$**:
>
> $$
> z_{4k+j} \leftarrow y_{4k+j} + \sigma_j \quad \text{với mỗi } k, j
> $$
>
> **Output**: $z = M_E \cdot x \in \mathbb{F}_p^t$
>
> **Chi phí**: $12 \cdot (t/4)$ phép cộng (cho Bước 1) $+\; 4(t/4 - 1)$ phép cộng (Bước 2) $+\; t$ phép cộng (Bước 3) = $\approx 5t$ phép cộng. **Không có phép nhân trường độc lập** (ngoài constant multiplications bằng 2, có thể thay bằng cộng).

### Branch number của $M_E$

> [!abstract] Proposition 3.5 — Branch Number của $M_E$ (GKS23, §4.2)
> Với cấu trúc circulant khối như trên và $M_4$ là MDS matrix $4 \times 4$:
>
> $$
> B(M_E) = \frac{t}{4} + 4
> $$

**Chứng minh ý tưởng**: Xét một vector $x$ khác $0$ với $k$ phần tử khác $0$. Sau khi áp dụng $M_4$ cho từng khối, mỗi khối chứa phần tử khác $0$ sẽ lan ra ít nhất $4 - (\text{số 0 trong khối}) + 1$ phần tử khác $0$ (MDS property). Sau bước cộng lane ($\sigma_j$), sự lan truyền giữa các khối tạo thêm active positions. Tính toán cẩn thận cho kết quả tối thiểu $t/4 + 4$.

**So sánh với MDS đầy đủ**: MDS matrix $t \times t$ đạt $B = t+1$, cao hơn nhiều. Nhưng như paper lập luận trong §7.1, với đủ full rounds ($R_F \geq 6$), branch number $t/4 + 4$ là đủ vì statistical security được đánh giá qua nhiều cặp rounds, không chỉ một.

> [!info] 🟡 Lightweight MDS Matrix (theo [DL18]: Duval, Leurent — MDS Matrices with Lightweight Circuits, ToSC 2018)
> [DL18] chỉ ra rằng có thể tìm MDS matrices có thể được tính bằng số phép cộng tối thiểu bằng cách tìm kiếm trong không gian circuits. Kết quả này truyền cảm hứng cho thiết kế $M_4$ của Poseidon2: thay vì dùng Cauchy matrix (MDS nhưng tốn phép nhân), [GKS23] tìm một $4 \times 4$ MDS matrix với hệ số nhỏ để toàn bộ nhân ma trận quy về phép cộng.
>
> *(theo [DL18]: Duval, Leurent — MDS Matrices with Lightweight Circuits, IACR Trans. Symmetric Cryptol. 2018)*

---

## Internal Matrix $M_I$ (§4.3)

### Ý tưởng: Diagonal + Rank-1

$M_I$ cần rẻ hơn $M_E$ vì được áp dụng trong $R_P$ partial rounds (nhiều hơn $R_F$). Cấu trúc được chọn là **diagonal + all-ones update**:

$$
M_I = \mathbf{1}\mathbf{1}^\top + \mathrm{diag}(\mu_0, \mu_1, \ldots, \mu_{t-1})
$$

trong đó $\mathbf{1}\mathbf{1}^\top$ là ma trận $t \times t$ toàn $1$, và $\mathrm{diag}(\mu_0, \ldots, \mu_{t-1})$ là ma trận đường chéo. Tức là:

$$
(M_I)_{ij} = \begin{cases} 1 + \mu_i & \text{nếu } i = j \\ 1 & \text{nếu } i \neq j \end{cases}
$$

Các $\mu_i \in \mathbb{F}_p \setminus \{0, 1\}$ được chọn ngẫu nhiên sao cho $M_I$ invertible và không có subspace trail dài tùy ý.

### Thuật toán tính $M_I \cdot x$

> [!note] Scheme 3.6 — Efficient Multiplication $M_I \cdot x$
> **Input**: $x = (x_0, x_1, \ldots, x_{t-1}) \in \mathbb{F}_p^t$
>
> **Bước 1 — Tính tổng toàn bộ state**:
>
> $$
> \sigma = \sum_{i=0}^{t-1} x_i
> $$
>
> **Bước 2 — Áp dụng diagonal correction**:
>
> $$
> z_i = \sigma + \mu_i \cdot x_i \quad \text{với } i = 0, 1, \ldots, t-1
> $$
>
> **Output**: $z = M_I \cdot x \in \mathbb{F}_p^t$
>
> **Chi phí**: $(t-1)$ phép cộng (Bước 1) $+\; t$ phép nhân $+\; t$ phép cộng (Bước 2) = $2t - 1$ phép cộng $+\; t$ phép nhân trường.

So với MDS matrix dày đặc cần $t^2$ phép nhân, $M_I$ chỉ cần $t$ phép nhân — **giảm $O(t)$ lần**.

**Correctness**: $(M_I \cdot x)_i = \sum_{j \neq i} x_j + (1 + \mu_i) x_i = \underbrace{\sum_j x_j}_{\sigma} + \mu_i x_i$. $\square$

### Điều kiện an toàn cho $\mu_i$

> [!abstract] Proposition 3.7 — Điều kiện không có Invariant Subspace (GKS23 Remark 2)
> $M_I$ không có invariant subspace (tức là không tồn tại subspace trail dài tùy ý) khi và chỉ khi $M_I$ không có eigenvalue $1$ trên $\mathbb{F}_p$, tức là:
>
> $$
> \det(M_I - I) \neq 0
> $$

Điều này tương đương với $\sum_{i=0}^{t-1} \frac{1}{\mu_i} \neq -1$ (có thể kiểm tra từ determinant của diagonal + rank-1 update qua matrix determinant lemma).

**Trong thực tế**: các $\mu_i$ được chọn đơn giản, ví dụ $\mu_i = -(i+1)$ hoặc sinh từ Grain LFSR, và điều kiện được verify bằng script.

---

## So sánh chi phí tổng thể

| Operation | Poseidon (MDS $t \times t$) | Poseidon2 ($M_E$ / $M_I$) | Giảm |
|-----------|-----------------------------|-----------------------------|------|
| Linear layer (full round) | $t^2$ mults | $\approx 5t$ additions | ~90% mults |
| Linear layer (partial round) | $t^2$ mults | $t$ mults + $2t$ adds | ~$(1 - 1/t)$ |
| Tổng linear layer | $t^2 \cdot (R_F + R_P)$ | $5t \cdot R_F + t \cdot R_P$ | Lên đến 90% với $t = 12$ |

> [!tip] 💡 Agent note
> Với $t = 12$, $R_F = 8$, $R_P = 22$ (Goldilocks 128-bit): Poseidon cần $144 \cdot 30 = 4320$ multiplications chỉ cho linear layer. Poseidon2 cần $5 \cdot 12 \cdot 8 + 12 \cdot 22 = 480 + 264 = 744$ (chủ yếu là additions, hầu như không phải multiplications). Đây là nguồn gốc của con số "giảm 90%" được trích dẫn trong abstract.
>
> Trong **Plonk constraint** context: additions gần như miễn phí, mỗi multiplication là 1 gate. Nên tiết kiệm multiplication trực tiếp = tiết kiệm constraint, dẫn đến con số "giảm 70% Plonk constraints".

---

## Summary

- **Vấn đề**: Poseidon dùng MDS matrix $t \times t$ dày đặc → $O(t^2)$ cost per round → plain execution chậm với $t$ lớn.
- **$M_E$ (External Matrix)**: circulant block dựa trên $M_4$ (4×4 MDS). Tính toán bằng $\approx 5t$ phép cộng, không có phép nhân. Branch number $t/4 + 4$ — thấp hơn MDS đầy đủ nhưng đủ cho statistical security.
- **$M_I$ (Internal Matrix)**: $\mathbf{1}\mathbf{1}^\top + \mathrm{diag}(\mu_i)$. Tính toán bằng $t$ mults + $2t-1$ adds. An toàn khi $M_I$ không có eigenvalue $1$.
- **Kết quả**: giảm số multiplications trong linear layer lên đến 90% (plain code) và 70% (Plonk constraints).
- **Lesson tiếp theo**: [[04-poseidon2-permutation|04. Poseidon2 Permutation]] sẽ kết hợp $M_E$, $M_I$ và S-box thành permutation hoàn chỉnh Poseidon2_π, và mô tả sponge + compression mode.

---

## References

- [GKS23] Grassi, Khovratovich, Schofnegger — *Poseidon2: A Faster Version of the Poseidon Hash Function*, AFRICACRYPT 2023
- [DL18] Duval, Leurent — *MDS Matrices with Lightweight Circuits*, IACR Trans. Symmetric Cryptol. 2018 (🟡 Integrated)
- [GRS21] Grassi, Rechberger, Schofnegger — *Proving Resistance Against Infinitely Long Subspace Trails: How to Choose the Linear Layer*, ToSC 2021 (🔴 Prerequisite)
- [GLRRS20] Grassi et al. — *The HADES Design Strategy*, EUROCRYPT 2020 (🔴 Prerequisite — referenced for wide trail argument)
