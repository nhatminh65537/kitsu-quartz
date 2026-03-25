---
title: "11. Constructible Numbers"
tags: [math, galois-theory, lesson-11]
aliases: [Constructible Numbers]
created: 2026-03-24
---

> **Prerequisites**: [[09-cyclotomic-extensions|09. Cyclotomic Extensions]]
> **Objectives**:
> - Định nghĩa constructible number về mặt đại số
> - Chứng minh điều kiện cần: $[\mathbb{Q}(\alpha):\mathbb{Q}]$ phải là lũy thừa của 2
> - Dùng Galois Theory giải quyết ba bài toán cổ điển bất khả thi
> - Phát biểu và chứng minh định lý Gauss-Wantzel về regular $n$-gons
> - Hiểu vì sao regular 17-gon khả thi

---

## Motivation / Intuition

Người Hy Lạp cổ đại đặt ra ba bài toán nổi tiếng dùng thước kẻ (straightedge) và compa (compass):
1. **Doubling the cube**: Cho cube có thể tích 1, xây cube có thể tích 2.
2. **Trisecting the angle**: Chia góc bất kỳ thành ba phần bằng nhau.
3. **Squaring the circle**: Xây hình vuông có diện tích bằng diện tích hình tròn cho trước.

Họ không giải được và không biết tại sao. Galois Theory cho câu trả lời dứt khoát: **ba bài toán này bất khả thi** — không chỉ khó, mà là không thể giải được về mặt toán học.

Ngoài ra: Gauss ở tuổi 18 chứng minh regular 17-gon là constructible — kết quả gây chấn động sau hơn 2000 năm. Định lý Gauss-Wantzel sau đó phân loại hoàn toàn mọi regular polygon constructible được.

---

## Constructible Numbers — Định nghĩa Đại số

### Từ Hình học sang Đại số

Bắt đầu từ hai điểm $0$ và $1$ trong mặt phẳng. Ta dùng thước kẻ và compa để vẽ các đường thẳng và đường tròn từ các điểm đã có, tạo ra các điểm giao mới. Số **constructible** là những số thực có thể xuất hiện là tọa độ của một điểm được xây như vậy.

> [!definition] Definition 11.1 — Constructible Number
> $\alpha \in \mathbb{R}$ được gọi là **constructible** (khả thi) nếu $|\alpha|$ là độ dài của một đoạn thẳng có thể xây bằng thước kẻ và compa, bắt đầu từ đoạn đơn vị.
>
> Tập tất cả constructible numbers ký hiệu là $\mathbb{K} \subseteq \mathbb{R}$.

> [!abstract] Theorem 11.2 — $\mathbb{K}$ là field
> Tập $\mathbb{K}$ là subfield của $\mathbb{R}$: đóng dưới $+, -, \times, \div$. Hơn nữa, nếu $a \in \mathbb{K}$ và $a > 0$ thì $\sqrt{a} \in \mathbb{K}$.

**Proof sketch.** Các phép tính $a + b$, $a - b$, $ab$, $a/b$ đều có thể thực hiện với thước và compa bằng các cấu trúc hình học cổ điển (đường song song, tỷ lệ thức). $\sqrt{a}$ xây được bằng đường tròn bán kính trung bình (geometric mean construction). $\blacksquare$

### Đặc trưng đại số

> [!abstract] Theorem 11.3 — Đặc trưng qua Tower of Extensions
> $\alpha \in \mathbb{R}$ là constructible khi và chỉ khi tồn tại một tháp extensions:
>
> $$
> \mathbb{Q} = F_0 \subseteq F_1 \subseteq F_2 \subseteq \cdots \subseteq F_k
> $$
>
> sao cho $[F_{i+1}:F_i] = 2$ với mọi $i$, và $\alpha \in F_k$.

**Proof sketch.** Mỗi bước xây bằng thước và compa tương ứng với việc tìm giao điểm của: hai đường thẳng (không mở rộng field), đường thẳng và đường tròn (degree $\leq 2$), hai đường tròn (degree $\leq 2$). Mỗi bước cộng thêm at most một extension bậc 2. $\blacksquare$

> [!abstract] Corollary 11.4 — Điều kiện cần
> Nếu $\alpha \in \mathbb{R}$ là constructible thì $[\mathbb{Q}(\alpha):\mathbb{Q}]$ là **lũy thừa của 2**, tức là $[\mathbb{Q}(\alpha):\mathbb{Q}] = 2^k$ với $k \geq 0$.

**Proof.** $[\mathbb{Q}(\alpha):\mathbb{Q}]$ chia $[F_k:\mathbb{Q}] = 2^k$ (từ Tower Law). $\blacksquare$

> [!warning] Remark 11.5 — Điều kiện cần không phải điều kiện đủ
> Chiều ngược lại **không đúng**: tồn tại $\alpha$ với $[\mathbb{Q}(\alpha):\mathbb{Q}] = 4$ nhưng $\alpha$ **không** constructible. Ví dụ cổ điển: nghiệm thực của $x^4 - 2x^2 - \sqrt{2}x + \frac{1}{4}$ (Galois group là $D_4$, không solvable bằng quadratics). Điều kiện đủ cần thêm: Galois group của splitting field là 2-group (**tất cả** extension đều degree 2, không chỉ $\mathbb{Q}(\alpha)$).

---

## Ba Bài toán Bất khả thi

### Doubling the cube

> [!abstract] Theorem 11.6 — Không thể nhân đôi khối lập phương
> Không tồn tại cách xây $\sqrt[3]{2}$ bằng thước kẻ và compa.

**Proof.** $\operatorname{Irr}(\sqrt[3]{2}, \mathbb{Q}) = x^3 - 2$ (Eisenstein). Nên $[\mathbb{Q}(\sqrt[3]{2}):\mathbb{Q}] = 3$. Nhưng $3$ không phải lũy thừa của $2$, nên Corollary 11.4 cho $\sqrt[3]{2}$ không constructible. $\blacksquare$

### Trisecting the angle

> [!abstract] Theorem 11.7 — Không thể chia ba góc $60°$
> Góc $20°$ không constructible, tức không thể chia góc $60°$ thành ba phần bằng nhau.

**Proof.** Xây góc $20°$ tương đương xây $\cos 20°$ (từ tọa độ). Từ công thức triple angle: $\cos 60° = 4\cos^3 20° - 3\cos 20°$. Đặt $\alpha = 2\cos 20°$; thay vào: $1 = \alpha^3 - 3\alpha$, tức $\alpha^3 - 3\alpha - 1 = 0$.

Kiểm tra: $\pm 1$ không là nghiệm. Vậy $x^3 - 3x - 1$ irreducible over $\mathbb{Q}$ (cubic không có nghiệm hữu tỉ). Do đó $[\mathbb{Q}(\alpha):\mathbb{Q}] = 3$, không phải lũy thừa 2. Vậy $\alpha$ (và $\cos 20°$) không constructible. $\blacksquare$

### Squaring the circle

> [!abstract] Theorem 11.8 — Không thể vuông hóa hình tròn
> Không thể xây hình vuông có diện tích $\pi$.

**Proof.** Xây hình vuông diện tích $\pi$ đòi xây độ dài $\sqrt{\pi}$, tức $\sqrt{\pi} \in \mathbb{K}$. Vì $\mathbb{K}$ là field đóng dưới căn, điều này kéo theo $\pi \in \mathbb{K}$. Nhưng mọi constructible number là algebraic (là nghiệm của đa thức hệ số hữu tỉ). Lindemann (1882) chứng minh $\pi$ là **transcendental** — mâu thuẫn. $\blacksquare$

---

## Constructibility của Regular Polygons

Xây regular $n$-gon tương đương xây $\cos(2\pi/n)$ và $\sin(2\pi/n)$, tức xây $\zeta_n = e^{2\pi i/n}$ (tọa độ trong $\mathbb{C}$). Mà $\mathbb{Q}(\zeta_n)/\mathbb{Q}$ có degree $\varphi(n)$, với $\operatorname{Gal}(\mathbb{Q}(\zeta_n)/\mathbb{Q}) \cong (\mathbb{Z}/n\mathbb{Z})^\times$.

> [!abstract] Theorem 11.9 — Gauss-Wantzel Theorem
> Regular $n$-gon constructible bằng thước và compa khi và chỉ khi:
>
> $$
> n = 2^k p_1 p_2 \cdots p_t
> $$
>
> trong đó $k \geq 0$, và $p_1, \ldots, p_t$ là các **Fermat primes** (nguyên tố Fermat) phân biệt.
>
> **Fermat prime** là nguyên tố có dạng $F_m = 2^{2^m} + 1$.

Các Fermat primes đã biết: $F_0 = 3$, $F_1 = 5$, $F_2 = 17$, $F_3 = 257$, $F_4 = 65537$. Không biết có vô hạn Fermat prime hay không.

**Proof sketch (chiều $\Rightarrow$, regular $n$-gon constructible $\Rightarrow$ $n$ có dạng trên):**

Xây regular $n$-gon $\Leftrightarrow$ xây $\zeta_n$ $\Leftrightarrow$ $\zeta_n$ constructible $\Rightarrow$ $[\mathbb{Q}(\zeta_n):\mathbb{Q}] = \varphi(n)$ là lũy thừa $2$.

Cần $\varphi(n) = 2^k$. Từ công thức $\varphi(n) = n\prod_{p \mid n}(1 - 1/p)$: $\varphi(n)$ là lũy thừa 2 khi và chỉ khi:
- Mọi ước nguyên tố lẻ $p$ của $n$ thỏa $p - 1$ là lũy thừa 2 (tức $p$ là Fermat prime), và
- $p^2 \nmid n$ với mọi Fermat prime $p$ chia $n$.

**Chiều $\Leftarrow$ (đủ):** Khi $\varphi(n) = 2^k$ và $G = \operatorname{Gal}(\mathbb{Q}(\zeta_n)/\mathbb{Q}) \cong (\mathbb{Z}/n\mathbb{Z})^\times$ là nhóm abelian bậc $2^k$, theo định lý nhóm abelian hữu hạn, $G$ có dãy normal subgroups:
$$
\{1\} = G_k \trianglelefteq G_{k-1} \trianglelefteq \cdots \trianglelefteq G_0 = G, \quad [G_i:G_{i+1}] = 2.
$$
Dùng FTGT: tương ứng với dãy intermediate fields
$$
\mathbb{Q} = F_0 \subseteq F_1 \subseteq \cdots \subseteq F_k = \mathbb{Q}(\zeta_n)
$$
với $[F_{i+1}:F_i] = 2$. Đây là tháp quadratic extensions, nên $\zeta_n$ (và $\cos(2\pi/n)$) constructible. $\blacksquare$

### Tại sao regular 17-gon?

> [!example] Example 11.10 — Regular 17-gon (Gauss, 1796)
> $n = 17$ là Fermat prime ($17 = 2^{2^2} + 1 = F_2$). Vậy $\varphi(17) = 16 = 2^4$, và $G \cong (\mathbb{Z}/17\mathbb{Z})^\times \cong \mathbb{Z}/16\mathbb{Z}$ là cyclic group bậc 16.
>
> Tồn tại dãy subgroups $\{0\} \subset \langle 8 \rangle \subset \langle 4 \rangle \subset \langle 2 \rangle \subset \mathbb{Z}/16\mathbb{Z}$ với mỗi index bằng 2. Theo FTGT: tháp extensions
>
> $$
> \mathbb{Q} \subset \mathbb{Q}(\eta_1) \subset \mathbb{Q}(\eta_2) \subset \mathbb{Q}(\eta_3) \subset \mathbb{Q}(\zeta_{17})
> $$
>
> với mỗi bậc 2, trong đó $\eta_i$ là **Gaussian periods** (tổng các roots of unity). Cụ thể:
>
> $$
> \eta_1 = \sum_{k \in H} \zeta_{17}^k \in \mathbb{R}, \quad \eta_1 = \frac{-1 + \sqrt{17}}{2}
> $$
>
> mỗi $\eta_i$ là nghiệm của quadratic equation hệ số trong $\mathbb{Q}(\eta_{i-1})$.

> [!example] Example 11.11 — Bảng regular $n$-gons constructible nhỏ
>
> | $n$ | Constructible? | Lý do |
> |---|---|---|
> | $3$ | Có | $3 = F_0$ là Fermat prime |
> | $4$ | Có | $4 = 2^2$ |
> | $5$ | Có | $5 = F_1$ là Fermat prime |
> | $6$ | Có | $6 = 2 \cdot 3$ |
> | $7$ | Không | $\varphi(7) = 6 = 2 \cdot 3$, không phải lũy thừa 2 |
> | $8$ | Có | $8 = 2^3$ |
> | $9$ | Không | $\varphi(9) = 6$, không phải lũy thừa 2 |
> | $15$ | Có | $15 = 3 \cdot 5$ (tích hai Fermat primes phân biệt) |
> | $17$ | Có | $17 = F_2$ là Fermat prime |
> | $257$ | Có | $257 = F_3$ là Fermat prime |
> | $65537$ | Có | $65537 = F_4$ là Fermat prime |

---

## SageMath Cheatsheet

```sage
K = QQ

p = x^3 - 2
print(p.is_irreducible())
print(p.degree())

q = x^3 - 3*x - 1
print(q.is_irreducible())

def phi(n):
    return euler_phi(n)

for n in range(3, 30):
    p = phi(n)
    is_pow2 = p > 0 and (p & (p-1)) == 0
    print(f"n={n}: phi={p}, constructible={is_pow2}")

fermat_primes = [3, 5, 17, 257, 65537]
for p in fermat_primes:
    print(p, is_prime(p), p == 2^(2^fermat_primes.index(p)) + 1)
```

---

## Summary / Key Takeaways

- Constructible $\alpha$ $\Rightarrow$ $[\mathbb{Q}(\alpha):\mathbb{Q}]$ là lũy thừa của 2. (Điều kiện cần, không phải đủ.)
- **Doubling the cube**: $\sqrt[3]{2}$ có degree 3, không constructible.
- **Trisecting $60°$**: $\cos 20°$ có minimal poly bậc 3, không constructible.
- **Squaring the circle**: $\pi$ transcendental, không algebraic, không constructible.
- **Gauss-Wantzel**: Regular $n$-gon constructible $\iff$ $n = 2^k \prod F_i$ (Fermat primes phân biệt) $\iff$ $\varphi(n) = 2^k$.
- Chìa khóa: $G = (\mathbb{Z}/n\mathbb{Z})^\times$ là 2-group $\Rightarrow$ có dãy subgroups index 2 $\Rightarrow$ FTGT cho tháp quadratic.
- Regular 17-gon constructible vì $17 = 2^4 + 1$ là Fermat prime, Galois group cyclic bậc 16.

---

## References

- Dummit, D. S. & Foote, R. M. *Abstract Algebra* (3rd ed.), §14.5.
- Stewart, I. *Galois Theory* (4th ed.), Chapters 7, 22.
- Cox, D. A. *Galois Theory* (2nd ed.), §10.1 (Gauss-Wantzel theorem).
- Conrad, K. *Cyclotomic Extensions*, §5. Có tại https://kconrad.math.uconn.edu/blurbs/galoistheory/cyclotomic.pdf
