---
title: "A0. Định Lý Cơ Bản Số Học — Chứng Minh Đầy Đủ"
type: appendix
tags: [math, number-theory, appendix]
aliases: [Proof of FTA]
created: 2026-05-15
---

> **Liên quan**: [[03-primes-and-fta|03. Số Nguyên Tố và Định Lý Cơ Bản Số Học]]
> **Yêu cầu**: [[02-extended-euclidean-algorithm|02. Thuật Toán Euclid Mở Rộng]] (Corollary 2.11)

Appendix này trình bày chứng minh đầy đủ và chặt chẽ của Định Lý Cơ Bản Số Học, bao gồm cả phần tồn tại lẫn phần duy nhất với mọi bước rõ ràng.

---

## Phát Biểu Định Lý

> [!theorem] Theorem A0.1 — Fundamental Theorem of Arithmetic (đầy đủ)
> Mọi số nguyên $n \geq 2$ đều viết được theo **duy nhất một cách** (ngoại trừ thứ tự) thành tích của các số nguyên tố:
>
> $$
> n = p_1^{e_1} p_2^{e_2} \cdots p_k^{e_k}
> $$
>
> với $p_1 < p_2 < \cdots < p_k$ là các số nguyên tố phân biệt và $e_1, e_2, \ldots, e_k \geq 1$.

---

## Phần I — Tồn Tại

> [!theorem] Theorem A0.2 — Tồn tại phân tích nguyên tố
> Mọi số nguyên $n \geq 2$ đều là tích (hữu hạn) của các số nguyên tố.

**Proof** (quy nạp mạnh — strong induction).

Ta chứng minh bằng quy nạp mạnh trên $n$: giả sử mọi số nguyên $m$ với $2 \leq m < n$ đều phân tích được thành tích nguyên tố.

**Cơ sở:** $n = 2$ là số nguyên tố, phân tích được ($2 = 2$). ✓

**Bước quy nạp:** Cho $n \geq 3$.

- **Trường hợp 1:** $n$ là số nguyên tố. Khi đó $n$ tự nó đã là tích của một số nguyên tố. ✓

- **Trường hợp 2:** $n$ là hợp số. Tồn tại $a, b$ với $2 \leq a \leq b$ và $n = ab$. Vì $a \geq 2$ và $b \geq 2$, ta có $a = n/b \leq n/2 < n$ và $b \leq n/2 < n$ (từ $a \geq 2$). Vậy $2 \leq a < n$ và $2 \leq b < n$.

  Theo giả thiết quy nạp, cả $a$ và $b$ đều phân tích được thành tích nguyên tố:
  
  $$
  a = q_1 q_2 \cdots q_s, \qquad b = r_1 r_2 \cdots r_t
  $$
  
  (với $q_i, r_j$ là các số nguyên tố). Khi đó:
  
  $$
  n = ab = q_1 \cdots q_s \cdot r_1 \cdots r_t
  $$
  
  là tích của $s + t$ số nguyên tố. ✓

Theo nguyên lý quy nạp mạnh, kết quả đúng với mọi $n \geq 2$. $\blacksquare$

---

## Phần II — Bổ Đề Cốt Lõi Cho Tính Duy Nhất

Bước then chốt là hệ quả của Bổ đề Euclid (đã chứng minh trong bài 02):

> [!lemma] Lemma A0.3 — Số nguyên tố chia tích
> Nếu $p$ là số nguyên tố và $p \mid a_1 a_2 \cdots a_k$, thì $p \mid a_i$ với một chỉ số $i$ nào đó.

**Proof** (quy nạp trên $k$).

**Cơ sở $k = 1$:** Hiển nhiên: $p \mid a_1$. ✓

**Cơ sở $k = 2$:** Đây chính là Corollary 2.11: nếu $p \mid a_1 a_2$ và $p \nmid a_1$, thì $\gcd(p, a_1) = 1$ (vì ước dương của $p$ chỉ là $1$ và $p$), nên theo Bổ đề Euclid (Theorem 2.10), $p \mid a_2$. ✓

**Bước quy nạp ($k \geq 3$):** Giả sử kết quả đúng với tích $k-1$ thừa số. Cho $p \mid a_1 a_2 \cdots a_k$. Đặt $A = a_1 \cdots a_{k-1}$ và $B = a_k$. Từ cơ sở $k = 2$: hoặc $p \mid A$ hoặc $p \mid B = a_k$.

- Nếu $p \mid a_k$: xong.
- Nếu $p \mid A = a_1 \cdots a_{k-1}$: theo giả thiết quy nạp, $p \mid a_i$ với $i \in \{1, \ldots, k-1\}$.

Trong cả hai trường hợp, $p \mid a_i$ với $i$ nào đó. $\blacksquare$

---

## Phần III — Tính Duy Nhất

> [!theorem] Theorem A0.4 — Duy nhất phân tích nguyên tố
> Nếu $n = p_1 p_2 \cdots p_s = q_1 q_2 \cdots q_t$ là hai phân tích của $n$ thành tích nguyên tố (cho phép lặp, chưa sắp xếp), thì $s = t$ và (sau khi sắp xếp) $p_i = q_i$ với mọi $i$.

**Proof** (quy nạp trên số lượng thừa số).

Ta chứng minh bằng quy nạp mạnh trên $s$ (tổng số nguyên tố, kể cả lặp, trong phân tích đầu tiên).

**Cơ sở $s = 1$:** $n = p_1$ là số nguyên tố. Phân tích thứ hai $q_1 \cdots q_t = p_1$ với $q_j$ nguyên tố. Nếu $t \geq 2$ thì $q_1 q_2 \cdots q_t \geq 2 \cdot 2 = 4 > p_1$ hoặc $q_1 < p_1$, dẫn đến mâu thuẫn (vì $p_1$ nguyên tố không có ước nào trong $(1, p_1)$). Vậy $t = 1$ và $q_1 = p_1$. ✓

**Bước quy nạp:** Giả sử kết quả đúng với mọi số có $< s$ thừa số nguyên tố. Xét:

$$
n = p_1 p_2 \cdots p_s = q_1 q_2 \cdots q_t
$$

Vì $p_1 \mid n = q_1 q_2 \cdots q_t$, theo Lemma A0.3, tồn tại $j$ với $p_1 \mid q_j$. Nhưng $q_j$ là số nguyên tố, nên ước dương của $q_j$ chỉ là $1$ và $q_j$. Vì $p_1 > 1$, suy ra $p_1 = q_j$.

Hoán đổi $q_j$ về vị trí đầu tiên (ký hiệu lại): $p_1 = q_1$ (sau hoán đổi).

Chia cả hai vế cho $p_1 = q_1$:

$$
\frac{n}{p_1} = p_2 \cdots p_s = q_2 \cdots q_t
$$

Đây là số $n/p_1$ có phân tích đầu tiên với $s - 1$ thừa số nguyên tố. Theo giả thiết quy nạp, $s - 1 = t - 1$ (tức $s = t$) và các $p_i = q_i$ (sau khi sắp xếp) với $i = 2, \ldots, s$.

Vậy $s = t$ và (kể cả $p_1 = q_1$) $p_i = q_i$ với mọi $i$. $\blacksquare$

---

## Phần IV — Kết Hợp Thành Biểu Diễn Chính Tắc

Từ Theorem A0.2 và Theorem A0.4, mọi $n \geq 2$ có duy nhất một phân tích thành tích nguyên tố (không sắp xếp). Nhóm các thừa số bằng nhau và sắp xếp theo thứ tự tăng dần:

$$
n = p_1^{e_1} p_2^{e_2} \cdots p_k^{e_k}, \qquad p_1 < p_2 < \cdots < p_k
$$

Đây là **biểu diễn chính tắc** — duy nhất vì cả số mũ $e_i$ (bằng số lần $p_i$ xuất hiện trong phân tích) lẫn danh sách $\{p_i\}$ đều được xác định duy nhất. $\blacksquare$

---

## Ghi Chú Lịch Sử và Nền Tảng

> [!note] Remark A0.5 — FTA và cấu trúc UFD
> FTA có thể phát biểu lại: **$\mathbb{Z}$ là một Unique Factorization Domain (UFD)**. Cấu trúc này được đảm bảo vì $\mathbb{Z}$ là một **Euclidean Domain** (có thuật toán chia Euclid), kéo theo là **Principal Ideal Domain (PID)**, kéo theo là **UFD**.
>
> Chuỗi hàm tử: Euclidean Domain $\Rightarrow$ PID $\Rightarrow$ UFD.
>
> Không phải vành nào cũng là UFD. Ví dụ phản bác: $\mathbb{Z}[\sqrt{-5}]$ có $6 = 2 \cdot 3 = (1+\sqrt{-5})(1-\sqrt{-5})$ với $2, 3, 1 \pm \sqrt{-5}$ đều "bất khả quy" nhưng phân tích không duy nhất — đây là lý do lịch sử dẫn đến lý thuyết ideal (Kummer, Dedekind, thế kỷ XIX).

> [!note] Remark A0.6 — Bằng chứng thay thế
> Có hai cách chứng minh FTA phổ biến:
>
> **Cách 1 (dùng ở đây):** Quy nạp mạnh + Bổ đề Euclid (dựa trên thuật toán Euclid).
>
> **Cách 2:** Sử dụng **Well-Ordering Principle** để chứng minh phần duy nhất: giả sử tồn tại số nhỏ nhất có hai phân tích khác nhau, dẫn đến mâu thuẫn.
>
> Cả hai cách đều dùng Bổ đề Euclid (Lemma A0.3) như bước cốt lõi — đây là điểm không thể thiếu.

---

## References

- Niven, I., Zuckerman, H. S., Montgomery, H. L. *An Introduction to the Theory of Numbers* (5th ed.), Theorem 1.16.
- Hardy, G. H., Wright, E. M. *An Introduction to the Theory of Numbers* (6th ed.), Theorem 2.
- Ireland, K., Rosen, M. *A Classical Introduction to Modern Number Theory* (2nd ed.), Ch. 1, Proposition 1.1.
- ProofWiki: *Fundamental Theorem of Arithmetic*. https://proofwiki.org/wiki/Fundamental_Theorem_of_Arithmetic
