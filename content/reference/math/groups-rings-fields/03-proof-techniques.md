---
title: "03. Proof Techniques"
type: math-component
tags: [math, groups-rings-fields, foundations, proof-techniques, lesson-03]
aliases: [Proof Techniques]
created: 2026-05-15
---

> **Prerequisites**: [[01-sets\|01. Sets and Set Operations]], [[02-logic\|02. Propositional and Predicate Logic]]
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{N}$ | Tập số tự nhiên $\{0, 1, 2, \ldots\}$ |
> | $\mathbb{Z}$ | Tập số nguyên |
> | $\mathbb{R}$ | Tập số thực |
> | $\mathbb{Q}$ | Tập số hữu tỷ |
> | $\forall$ | Lượng từ toàn thể (for all) |
> | $\exists$ | Lượng từ tồn tại (there exists) |
> | $\to$ | Phép kéo theo (implies) |
> | $\lnot$ | Phép phủ định (not) |
> | $\gcd(a,b)$ | Ước chung lớn nhất của $a$ và $b$ |

---

> **Objectives**:
> - Hiểu cấu trúc của một chứng minh toán học
> - Nắm vững và áp dụng các kỹ thuật: trực tiếp, phản chứng, phản đảo, phân trường hợp
> - Thực hiện chứng minh tồn tại và duy nhất
> - Thành thạo quy nạp toán học (yếu và mạnh)
> - Nhận biết các dạng sai lầm phổ biến trong chứng minh

---

## Motivation

Toán học phân biệt với mọi ngành khoa học khác ở chỗ: các kết quả của nó được **chứng minh** (proven), không chỉ được kiểm tra bởi thực nghiệm. Một chứng minh là một chuỗi các bước suy luận logic, mỗi bước tuân theo từ các tiên đề hay các kết quả đã được chứng minh trước. Phần này giới thiệu các kỹ thuật chứng minh cơ bản — "hộp công cụ" mà ta sẽ sử dụng xuyên suốt toàn bộ khóa học.

---

## 1. Cấu trúc của các phát biểu toán học

> [!definition] Definition 3.1 — Các loại phát biểu toán học
> - **Tiên đề** (Axiom): Phát biểu được chấp nhận là đúng mà không cần chứng minh; là nền tảng của hệ thống.
> - **Định lý** (Theorem): Phát biểu quan trọng được chứng minh từ các tiên đề và định lý trước đó.
> - **Mệnh đề** (Proposition): Phát biểu đúng nhưng ít quan trọng hơn định lý.
> - **Bổ đề** (Lemma): Kết quả phụ trợ được dùng để chứng minh một định lý.
> - **Hệ quả** (Corollary): Kết quả suy ra trực tiếp từ một định lý.
> - **Nhận xét** (Remark): Quan sát hoặc diễn giải không cần chứng minh riêng.
> - **Phỏng đoán** (Conjecture): Phát biểu được tin là đúng nhưng chưa có chứng minh.

---

## 2. Chứng minh trực tiếp (Direct Proof)

Để chứng minh $P \to Q$: **giả sử $P$ đúng** và suy ra $Q$ đúng bằng chuỗi suy luận logic.

> [!example] Example 3.2 — Chứng minh trực tiếp
> **Định lý**: Nếu $n$ là số nguyên lẻ thì $n^2$ là số nguyên lẻ.
>
> **Proof.** Giả sử $n$ là số nguyên lẻ. Theo định nghĩa, tồn tại $k \in \mathbb{Z}$ sao cho $n = 2k + 1$. Khi đó:
>
> $$
> n^2 = (2k+1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1
> $$
>
> Đặt $m = 2k^2 + 2k \in \mathbb{Z}$. Ta có $n^2 = 2m + 1$, nên $n^2$ lẻ. $\blacksquare$

> [!example] Example 3.3 — Chứng minh tính chia hết
> **Định lý**: Với mọi $n \in \mathbb{Z}$, $n^3 - n$ chia hết cho $6$.
>
> **Proof.** Ta có $n^3 - n = n(n^2 - 1) = (n-1)n(n+1)$.
>
> Đây là tích của ba số nguyên liên tiếp. Trong ba số nguyên liên tiếp:
>
> - Luôn có ít nhất một số chẵn (chia hết cho $2$).
> - Luôn có đúng một số chia hết cho $3$ (vì $3 \mid (n-1)$, $3 \mid n$, hay $3 \mid (n+1)$ — mỗi số nguyên có dư $0$, $1$, hoặc $2$ khi chia cho $3$, và trong bộ ba số liên tiếp, mỗi dư xuất hiện đúng một lần).
>
> Do $6 = 2 \times 3$ với $\gcd(2, 3) = 1$, tích $(n-1)n(n+1)$ chia hết cho $2$ và $3$, nên chia hết cho $6$. $\blacksquare$

---

## 3. Chứng minh phản đảo (Proof by Contrapositive)

Để chứng minh $P \to Q$: thay vào đó chứng minh $\lnot Q \to \lnot P$ (tương đương logic).

> [!note] Remark 3.4 — Khi nào dùng phản đảo?
> Phản đảo thường hữu ích khi $P$ khó làm việc trực tiếp nhưng $\lnot Q$ đưa ra thông tin cụ thể hơn. Ví dụ: "$n^2$ chẵn $\to$ $n$ chẵn" — khi dùng phản đảo, ta giả sử $n$ lẻ và chứng minh $n^2$ lẻ, điều này dễ hơn nhiều.

> [!example] Example 3.5
> **Định lý**: Nếu $n^2$ là số chẵn thì $n$ là số chẵn.
>
> **Proof** (bằng phản đảo). Giả sử $n$ **không** chẵn, tức $n$ lẻ. Tồn tại $k \in \mathbb{Z}$ sao cho $n = 2k+1$. Khi đó $n^2 = 4k^2 + 4k + 1 = 2(2k^2+2k) + 1$ là lẻ. Vậy $n^2$ **không** chẵn.
>
> Bằng phản đảo, $n^2$ chẵn $\Rightarrow$ $n$ chẵn. $\blacksquare$

> [!example] Example 3.6 — Tính vô tỷ của $\sqrt{2}$
> **Định lý**: $\sqrt{2}$ là số vô tỷ.
>
> **Proof** (bằng phản chứng). Giả sử $\sqrt{2}$ hữu tỷ, tức $\sqrt{2} = \frac{p}{q}$ với $p, q \in \mathbb{Z}$, $q \neq 0$, và $\gcd(p, q) = 1$ (phân số tối giản). Khi đó:
>
> $$
> 2 = \frac{p^2}{q^2} \implies p^2 = 2q^2
> $$
>
> Suy ra $p^2$ chẵn, nên $p$ chẵn (theo Example 3.5). Đặt $p = 2m$. Thay vào: $4m^2 = 2q^2 \implies q^2 = 2m^2$, suy ra $q^2$ chẵn, nên $q$ chẵn. Vậy $2 \mid \gcd(p, q)$, mâu thuẫn với $\gcd(p, q) = 1$. $\blacksquare$

---

## 4. Chứng minh phản chứng (Proof by Contradiction)

Để chứng minh $P$: **giả sử $\lnot P$** và dẫn đến một mâu thuẫn (một phát biểu dạng $Q \land \lnot Q$).

> [!note] Remark 3.7
> Phản chứng (reductio ad absurdum) khác phản đảo ở chỗ: phản đảo áp dụng cụ thể cho mệnh đề dạng $P \to Q$, còn phản chứng có thể dùng để chứng minh bất kỳ phát biểu nào. Trong phản chứng, ta giả sử $\lnot P$ và tìm mâu thuẫn bất kỳ — không nhất thiết phải phủ định một giả thiết cụ thể.

> [!example] Example 3.8 — Vô số số nguyên tố
> **Định lý** (Euclid): Có vô số số nguyên tố.
>
> **Proof** (phản chứng). Giả sử chỉ có hữu hạn số nguyên tố: $p_1, p_2, \ldots, p_n$. Xét số:
>
> $$
> N = p_1 p_2 \cdots p_n + 1
> $$
>
> $N > 1$, nên $N$ có ít nhất một ước số nguyên tố $p$. Với mỗi $p_i$, ta có $p_i \mid p_1 p_2 \cdots p_n$ nhưng $p_i \nmid 1$, nên $p_i \nmid N$. Mâu thuẫn: $p \neq p_i$ với mọi $i$, nhưng mọi số nguyên tố đều là một $p_i$. $\blacksquare$

---

## 5. Chứng minh phân trường hợp (Proof by Cases)

Khi mệnh đề cần chứng minh có thể chia thành các trường hợp rời nhau và phủ hết, ta chứng minh từng trường hợp.

> [!example] Example 3.9
> **Định lý**: Với mọi $n \in \mathbb{Z}$, $n^2 + n$ là số chẵn.
>
> **Proof** (phân trường hợp).
>
> *Trường hợp 1*: $n$ chẵn. Đặt $n = 2k$. Khi đó $n^2 + n = 4k^2 + 2k = 2(2k^2 + k)$ chẵn.
>
> *Trường hợp 2*: $n$ lẻ. Đặt $n = 2k+1$. Khi đó $n^2 + n = (2k+1)^2 + (2k+1) = 4k^2 + 4k + 1 + 2k + 1 = 4k^2 + 6k + 2 = 2(2k^2 + 3k + 1)$ chẵn.
>
> Trong cả hai trường hợp, $n^2 + n$ chẵn. $\blacksquare$

> [!note] Remark 3.10 — Lưu ý khi phân trường hợp
> Phải đảm bảo hai điều: (1) các trường hợp **rời nhau** (exhaustive — phủ hết mọi khả năng) và (2) việc xử lý từng trường hợp là hợp lệ. Một lỗi phổ biến là bỏ sót trường hợp.

---

## 6. Chứng minh tồn tại và duy nhất (Existence and Uniqueness)

### 6.1 Chứng minh tồn tại

> [!definition] Definition 3.11
> Để chứng minh $\exists x \in D: P(x)$:
>
> - **Constructive** (Xây dựng): Chỉ ra một phần tử $x_0 \in D$ cụ thể thỏa $P(x_0)$.
> - **Non-constructive** (Không xây dựng): Chứng minh tồn tại mà không chỉ ra cụ thể (thường dùng phản chứng).

> [!example] Example 3.12 — Constructive existence
> **Định lý**: Tồn tại số nguyên tố dạng $4k + 3$.
>
> **Proof.** $n = 3 = 4(0) + 3$ là số nguyên tố. $\blacksquare$

> [!example] Example 3.13 — Non-constructive existence
> **Định lý**: Tồn tại các số vô tỷ $a$, $b$ sao cho $a^b$ là hữu tỷ.
>
> **Proof.** Xét $x = \sqrt{2}^{\sqrt{2}}$.
>
> *Trường hợp 1*: $x$ hữu tỷ. Lấy $a = b = \sqrt{2}$ (vô tỷ), $a^b = x$ hữu tỷ. Xong.
>
> *Trường hợp 2*: $x$ vô tỷ. Lấy $a = x$, $b = \sqrt{2}$. Khi đó $a^b = (\sqrt{2}^{\sqrt{2}})^{\sqrt{2}} = \sqrt{2}^2 = 2$ hữu tỷ. Xong.
>
> Trong cả hai trường hợp, tồn tại $a, b$ vô tỷ sao cho $a^b$ hữu tỷ. (Bằng định lý Gel'fond-Schneider, $x = \sqrt{2}^{\sqrt{2}}$ thực ra vô tỷ, nhưng chứng minh trên không cần biết điều đó!) $\blacksquare$

### 6.2 Chứng minh duy nhất

Cấu trúc chuẩn để chứng minh tính duy nhất: **giả sử có hai phần tử thỏa điều kiện, rồi chứng minh chúng bằng nhau**.

> [!example] Example 3.14 — Duy nhất của phần tử đơn vị
> **Định lý**: Nếu tập hợp $G$ với phép toán $\cdot$ có phần tử đơn vị thì phần tử đơn vị đó là duy nhất.
>
> **Proof.** Giả sử $e$ và $e'$ đều là phần tử đơn vị. Khi đó:
>
> $$
> e = e \cdot e' = e'
> $$
>
> (Đẳng thức đầu: $e'$ là đơn vị nên $e \cdot e' = e$. Đẳng thức sau: $e$ là đơn vị nên $e \cdot e' = e'$.) Vậy $e = e'$. $\blacksquare$

---

## 7. Quy nạp toán học (Mathematical Induction)

### 7.1 Quy nạp yếu (Weak Induction)

> [!theorem] Theorem 3.15 — Nguyên lý quy nạp toán học (Weak Induction)
> Cho $P(n)$ là một vị từ với $n \in \mathbb{N}$. Nếu:
>
> 1. **Cơ sở** (Base case): $P(0)$ đúng (hoặc $P(n_0)$ đúng cho một $n_0$ nào đó).
> 2. **Bước quy nạp** (Inductive step): $\forall k \geq 0: P(k) \to P(k+1)$.
>
> Thì $P(n)$ đúng với mọi $n \geq 0$ (hoặc $n \geq n_0$).

> [!example] Example 3.16 — Tổng của $n$ số tự nhiên đầu
> **Định lý**: $\displaystyle\sum_{k=1}^{n} k = \frac{n(n+1)}{2}$ với mọi $n \geq 1$.
>
> **Proof** (quy nạp).
>
> *Cơ sở*: $n = 1$: $\sum_{k=1}^{1} k = 1 = \frac{1 \cdot 2}{2}$. ✓
>
> *Bước quy nạp*: Giả sử đúng với $n = m$ (giả thiết quy nạp): $\sum_{k=1}^{m} k = \frac{m(m+1)}{2}$. Ta cần chứng minh đúng với $n = m+1$:
>
> $$
> \sum_{k=1}^{m+1} k = \left(\sum_{k=1}^{m} k\right) + (m+1) = \frac{m(m+1)}{2} + (m+1) = (m+1)\left(\frac{m}{2} + 1\right) = \frac{(m+1)(m+2)}{2}
> $$
>
> Đây đúng là công thức với $n = m+1$. $\blacksquare$

> [!example] Example 3.17 — Bất đẳng thức Bernoulli
> **Định lý**: Với mọi $x > -1$ và $n \in \mathbb{N}$: $(1 + x)^n \geq 1 + nx$.
>
> **Proof** (quy nạp theo $n$).
>
> *Cơ sở*: $n = 0$: $(1+x)^0 = 1 \geq 1 + 0 \cdot x = 1$. ✓
>
> *Bước quy nạp*: Giả sử $(1+x)^m \geq 1 + mx$. Ta có $1 + x > 0$ (vì $x > -1$), nên:
>
> $$
> (1+x)^{m+1} = (1+x)^m \cdot (1+x) \geq (1+mx)(1+x) = 1 + mx + x + mx^2 = 1 + (m+1)x + mx^2 \geq 1 + (m+1)x
> $$
>
> (dòng cuối vì $mx^2 \geq 0$). $\blacksquare$

### 7.2 Quy nạp mạnh (Strong Induction)

> [!theorem] Theorem 3.18 — Quy nạp mạnh (Strong Induction)
> Cho $P(n)$ là vị từ với $n \in \mathbb{N}$. Nếu:
>
> 1. $P(n_0)$ đúng.
> 2. $\forall k \geq n_0$: nếu $P(j)$ đúng với mọi $n_0 \leq j \leq k$ (giả thiết quy nạp mạnh), thì $P(k+1)$ đúng.
>
> Thì $P(n)$ đúng với mọi $n \geq n_0$.

> [!note] Remark 3.19
> Trong quy nạp yếu, bước quy nạp chỉ dùng $P(k)$ để chứng minh $P(k+1)$. Trong quy nạp mạnh, ta được dùng **toàn bộ** $P(n_0), P(n_0+1), \ldots, P(k)$. Quy nạp mạnh và yếu tương đương về mặt logic, nhưng quy nạp mạnh tiện hơn trong nhiều trường hợp.

> [!example] Example 3.20 — Mọi số nguyên $\geq 2$ đều có ước nguyên tố
> **Định lý**: Với mọi $n \geq 2$, $n$ có ít nhất một ước số là số nguyên tố.
>
> **Proof** (quy nạp mạnh theo $n \geq 2$).
>
> *Cơ sở*: $n = 2$ là số nguyên tố, tự nó là ước nguyên tố. ✓
>
> *Bước quy nạp*: Giả sử mọi số nguyên từ $2$ đến $k$ đều có ước nguyên tố. Xét $n = k+1 \geq 3$.
>
> - Nếu $k+1$ là số nguyên tố: tự nó là ước nguyên tố.
> - Nếu $k+1$ là hợp số: tồn tại $1 < d < k+1$ sao cho $d \mid (k+1)$. Ta có $2 \leq d \leq k$, nên theo giả thiết quy nạp mạnh, $d$ có ước nguyên tố $p$. Khi đó $p \mid d$ và $d \mid (k+1)$, nên $p \mid (k+1)$. $\blacksquare$

### 7.3 Nguyên lý sắp xếp tốt (Well-Ordering Principle)

> [!theorem] Theorem 3.21 — Nguyên lý sắp xếp tốt của $\mathbb{N}$
> Mọi tập con khác rỗng của $\mathbb{N}$ đều có phần tử nhỏ nhất (minimum element).

> [!note] Remark 3.22
> Nguyên lý quy nạp toán học, quy nạp mạnh, và nguyên lý sắp xếp tốt đều tương đương với nhau — bất kỳ phát biểu nào cũng có thể được dẫn xuất từ hai phát biểu còn lại. Trong ZF, chúng đều là các định lý từ các tiên đề.

### 7.4 Chứng minh bằng phản ví dụ nhỏ nhất (Proof by Minimal Counterexample)

> [!note] Remark 3.22b — Minimal Counterexample Method
> Một dạng kết hợp giữa well-ordering và contradiction: để chứng minh $P(n)$ đúng với mọi $n \in \mathbb{N}$, giả sử tồn tại một phản ví dụ (phần tử làm $P$ sai). Theo well-ordering, tồn tại phản ví dụ **nhỏ nhất** $m$. Sau đó chứng minh rằng $m$ không thể là $0$ (cơ sở), và nếu $m > 0$ thì từ tính nhỏ nhất của $m$, $P(m-1)$ đúng — từ đó suy ra $P(m)$ đúng, mâu thuẫn. Phương pháp này đặc biệt mạnh trong lý thuyết số và tổ hợp.

> [!example] Example 3.22c — $\sqrt{2}$ vô tỷ bằng well-ordering
> **Định lý** (chứng minh khác): $\sqrt{2}$ là số vô tỷ.
>
> **Proof** (minimal counterexample). Giả sử $\sqrt{2} = a/b$ với $a, b \in \mathbb{N}^+$. Xét tập $S = \{b \in \mathbb{N}^+ \mid \exists a \in \mathbb{N}^+: \sqrt{2} = a/b\}$. Nếu $\sqrt{2}$ hữu tỷ, $S \neq \emptyset$. Gọi $b$ là phần tử nhỏ nhất của $S$ (well-ordering) và $a$ tương ứng. Từ $\sqrt{2} = a/b$ suy ra $a^2 = 2b^2$, nên $a$ chẵn: $a = 2c$. Thay vào: $4c^2 = 2b^2 \implies b^2 = 2c^2$, suy ra $b$ chẵn: $b = 2d$. Khi đó $\sqrt{2} = (2c)/(2d) = c/d$, nên $d \in S$. Nhưng $d < b$ (vì $b = 2d$), mâu thuẫn với $b$ là phần tử nhỏ nhất của $S$. $\blacksquare$

### 7.5 Phương pháp giảm vô hạn (Infinite Descent)

> [!note] Remark 3.22d — Infinite Descent (Fermat)
> Phương pháp **infinite descent** (giảm vô hạn), do Pierre de Fermat phát minh, tương đương với well-ordering principle: để chứng minh một phương trình không có nghiệm nguyên dương, giả sử tồn tại nghiệm $(x, y, z, \ldots)$, rồi xây dựng một nghiệm khác $(x', y', z', \ldots)$ nhỏ hơn về mặt nào đó. Lặp lại vô hạn lần sẽ dẫn đến một chuỗi giảm vô hạn các số nguyên dương — mâu thuẫn với well-ordering. Phương pháp này được Fermat dùng để chứng minh trường hợp $n=4$ của Định lý Lớn Fermat.

---

## 8. Các sai lầm phổ biến trong chứng minh

> [!warning] Warning 3.23 — Các lỗi logic thường gặp
>
> **Lỗi 1 — Nhầm converse với gốc**: Chứng minh $Q \to P$ thay vì $P \to Q$.
>
> **Lỗi 2 — Bước quy nạp mơ hồ**: Không phân biệt rõ ràng đâu là giả thiết quy nạp, đâu là điều cần chứng minh.
>
> **Lỗi 3 — Phân trường hợp không đầy đủ**: Bỏ sót một số trường hợp.
>
> **Lỗi 4 — Giả sử điều cần chứng minh** (circular reasoning): Dùng $Q$ trong quá trình chứng minh $P \to Q$.
>
> **Lỗi 5 — Chia cho biểu thức bằng 0**: Một lỗi điển hình trong "chứng minh" $1 = 2$.
>
> **Lỗi 6 — Tổng quát hóa từ ví dụ**: Một ví dụ không phải là chứng minh (nhưng một phản ví dụ đủ để bác bỏ).

---

## SageMath Cheatsheet — Bài 03

```sage
# Kiểm tra công thức tổng (Example 3.16)
for n in range(1, 11):
    lhs = sum(range(1, n+1))
    rhs = n*(n+1)//2
    assert lhs == rhs, f"Failed at n={n}"
print("Công thức tổng đúng với n=1..10")

# Kiểm tra chia hết n^3 - n cho 6 (Example 3.3)
for n in range(-10, 11):
    assert (n**3 - n) % 6 == 0, f"Failed at n={n}"
print("n^3 - n chia hết cho 6: đúng với n từ -10 đến 10")

# Phân tích số nguyên tố (minh họa quy nạp mạnh)
for n in range(2, 20):
    factors = factor(n)
    print(f"{n} = {factors}")

# Kiểm tra bất đẳng thức Bernoulli (Example 3.17)
x = 0.5
for n in range(0, 10):
    lhs = (1 + x)**n
    rhs = 1 + n*x
    assert lhs >= rhs - 1e-12, f"Bernoulli failed at n={n}"
print("Bất đẳng thức Bernoulli đúng với x=0.5, n=0..9")
```

---

## Summary — Lesson 03

- **Chứng minh trực tiếp**: Giả sử $P$, suy ra $Q$ qua chuỗi bước logic hợp lệ.
- **Chứng minh phản đảo**: Giả sử $\lnot Q$, suy ra $\lnot P$. Tương đương chứng minh trực tiếp.
- **Chứng minh phản chứng**: Giả sử $\lnot P$, dẫn đến mâu thuẫn. Dùng cho mọi loại phát biểu.
- **Chứng minh phân trường hợp**: Chia miền xét thành các trường hợp rời nhau, phủ hết.
- **Chứng minh tồn tại**: Xây dựng (chỉ ra phần tử cụ thể) hoặc không xây dựng.
- **Chứng minh duy nhất**: Giả sử hai phần tử thỏa điều kiện, chứng minh chúng bằng nhau.
- **Quy nạp yếu**: Cơ sở + bước $P(k) \to P(k+1)$. **Quy nạp mạnh**: Cơ sở + bước $P(n_0),\ldots,P(k) \to P(k+1)$.
- **Sắp xếp tốt**: Mọi tập con khác rỗng của $\mathbb{N}$ có phần tử nhỏ nhất.
- **Phản ví dụ nhỏ nhất & Infinite Descent**: Hai phương pháp tương đương well-ordering, công cụ mạnh trong lý thuyết số.
