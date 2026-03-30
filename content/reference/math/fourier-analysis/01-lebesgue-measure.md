---
title: "01. Lebesgue Measure & Sigma-Algebras"
tags: [math, fourier-analysis, measure-theory, lesson-01]
aliases: [Lebesgue Measure, Sigma-Algebras]
created: 2026-03-24
---

> **Prerequisites**: Giải tích 1/2 (giới hạn, dãy số, chuỗi số, tập mở/đóng trên $\mathbb{R}$)
> **Objectives**:
> - Hiểu tại sao tích phân Riemann không đủ mạnh và tại sao cần Lebesgue
> - Nắm vững khái niệm $\sigma$-algebra và Borel $\sigma$-algebra
> - Xây dựng Lebesgue outer measure và hiểu tiêu chuẩn Carathéodory cho measurable sets
> - Nắm các tính chất cơ bản của Lebesgue measure: translation invariance, countable additivity
> - Biết ví dụ điển hình: Cantor set (measure zero, uncountable) và Vitali set (non-measurable)

---

## Motivation / Intuition

### Vì sao Riemann không đủ?

Giả sử bạn muốn tính $\int_0^1 \mathbf{1}_{\mathbb{Q}}(x)\, dx$ — tích phân của hàm chỉ thị tập số hữu tỉ trên $[0,1]$. Hàm này nhận giá trị $1$ trên $\mathbb{Q} \cap [0,1]$ và $0$ trên phần còn lại. Về mặt trực giác, câu trả lời nên bằng $0$ vì $\mathbb{Q}$ "quá nhỏ" so với $\mathbb{R}$.

Tuy nhiên, tích phân Riemann **không xác định được** cho hàm này: mọi phân hoạch $[0,1]$ đều có cả điểm hữu tỉ lẫn vô tỉ, khiến tổng Darboux trên luôn bằng $1$ và tổng Darboux dưới luôn bằng $0$.

Lebesgue đã tiếp cận khác: thay vì chia trục $x$ (như Riemann), ta chia trục $y$ — phân hoạch miền giá trị của hàm. Khi đó, $\mathbf{1}_{\mathbb{Q}}$ nhận hai giá trị: $0$ trên tập vô tỉ (measure $1$) và $1$ trên tập hữu tỉ (measure $0$). Tích phân Lebesgue sẽ cho $0 \cdot 1 + 1 \cdot 0 = 0$.

Để làm điều này có nghĩa, ta cần một lý thuyết đo (measure theory) xác định "kích thước" của các tập hợp tùy ý — đây chính là vai trò của Lebesgue measure.

> [!note] Kết nối với Fourier
> Lý thuyết Fourier graduate-level đòi hỏi không gian $L^2([0, 2\pi])$ — không gian hàm có tích phân bình phương hội tụ theo nghĩa Lebesgue. Chuỗi Fourier và định lý Plancherel chỉ phát biểu được đầy đủ trong ngôn ngữ Lebesgue.

---

## Sigma-Algebra

### Định nghĩa và Tiên đề

> [!definition] Definition 1.1 — Sigma-Algebra ($\sigma$-algebra)
> Cho $X$ là một tập hợp. Một họ $\mathcal{M} \subseteq \mathcal{P}(X)$ được gọi là **$\sigma$-algebra** trên $X$ nếu:
>
> 1. $X \in \mathcal{M}$
>
> 2. **(Đóng với phần bù)**: Nếu $A \in \mathcal{M}$ thì $A^c = X \setminus A \in \mathcal{M}$
>
> 3. **(Đóng với hợp đếm được)**: Nếu $A_1, A_2, \ldots \in \mathcal{M}$ thì
> $$
> \bigcup_{n=1}^{\infty} A_n \in \mathcal{M}
> $$
>
> Cặp $(X, \mathcal{M})$ được gọi là **không gian đo được** (measurable space). Các phần tử của $\mathcal{M}$ gọi là các **tập đo được** (measurable sets).

> [!note] Remark 1.2
> Từ ba tiên đề trên, ta suy ra ngay:
> - $\emptyset \in \mathcal{M}$ (do $\emptyset = X^c$)
> - $\mathcal{M}$ đóng với **giao đếm được**: $\bigcap_{n=1}^\infty A_n \in \mathcal{M}$ (De Morgan)
> - $\mathcal{M}$ đóng với phép trừ tập: $A \setminus B = A \cap B^c \in \mathcal{M}$
>
> Tiền tố "$\sigma$" ám chỉ tính đóng dưới các phép toán **đếm được** (countable) — phân biệt với "algebra" chỉ yêu cầu đóng dưới hợp **hữu hạn**.

> [!example] Example 1.3 — Ba ví dụ cơ bản
> Cho $X$ là tập hợp bất kỳ:
>
> - **$\sigma$-algebra tầm thường**: $\mathcal{M} = \{\emptyset, X\}$ — nhỏ nhất có thể
> - **$\sigma$-algebra đầy đủ**: $\mathcal{M} = \mathcal{P}(X)$ — lớn nhất có thể (mọi tập con)
> - **$\sigma$-algebra đếm được/đồng đếm được**: $\mathcal{M} = \{A \subseteq X : A \text{ đếm được hoặc } A^c \text{ đếm được}\}$

### Sigma-Algebra sinh bởi một họ tập hợp

> [!definition] Definition 1.4 — Sigma-Algebra sinh bởi $\mathcal{C}$
> Cho $\mathcal{C} \subseteq \mathcal{P}(X)$ là một họ tập hợp tùy ý. **$\sigma$-algebra sinh bởi $\mathcal{C}$**, ký hiệu $\sigma(\mathcal{C})$, là **giao** của tất cả các $\sigma$-algebra trên $X$ chứa $\mathcal{C}$:
>
> $$
> \sigma(\mathcal{C}) = \bigcap \left\{ \mathcal{M} : \mathcal{M} \text{ là } \sigma\text{-algebra}, \mathcal{C} \subseteq \mathcal{M} \right\}
> $$
>
> Đây là $\sigma$-algebra **nhỏ nhất** chứa $\mathcal{C}$.

> [!theorem] Theorem 1.5 — Borel $\sigma$-Algebra
> **Borel $\sigma$-algebra** trên $\mathbb{R}$, ký hiệu $\mathcal{B}(\mathbb{R})$, là $\sigma$-algebra sinh bởi tất cả các tập mở của $\mathbb{R}$:
>
> $$
> \mathcal{B}(\mathbb{R}) = \sigma\!\left(\left\{ U \subseteq \mathbb{R} : U \text{ mở} \right\}\right)
> $$
>
> Các phần tử của $\mathcal{B}(\mathbb{R})$ gọi là **Borel sets**. Ta có thể sinh $\mathcal{B}(\mathbb{R})$ bằng các họ đơn giản hơn:
>
> $$
> \mathcal{B}(\mathbb{R}) = \sigma\!\left(\{(a,b) : a < b\}\right) = \sigma\!\left(\{(-\infty, b] : b \in \mathbb{R}\}\right)
> $$

**Proof sketch.** Chỉ cần chứng minh rằng họ $\{(-\infty, b]\}$ sinh ra cùng $\sigma$-algebra với họ tập mở. Mọi khoảng mở $(a,b) = \bigcup_{n=1}^\infty (a, b - 1/n] = \bigcup_{n=1}^\infty \big((-\infty, b-1/n] \setminus (-\infty, a]\big)$, nên $(a,b)$ thuộc $\sigma$-algebra sinh bởi $\{(-\infty, b]\}$. Ngược lại, $(-\infty, b] = \bigcap_{n=1}^\infty (-\infty, b+1/n)$ là giao đếm được của tập mở. $\blacksquare$

> [!note] Remark 1.6 — Borel sets bao gồm những gì?
> $\mathcal{B}(\mathbb{R})$ chứa tất cả: tập mở, tập đóng, $G_\delta$ (giao đếm được của tập mở), $F_\sigma$ (hợp đếm được của tập đóng), $G_{\delta\sigma}$, $F_{\sigma\delta}$, v.v. Hầu hết các tập "thực tế" đều là Borel sets. Tuy nhiên tồn tại Lebesgue measurable sets **không phải** Borel sets — bộ $\mathcal{L}(\mathbb{R})$ lớn hơn $\mathcal{B}(\mathbb{R})$.

---

## Lebesgue Outer Measure

### Xây dựng

> [!definition] Definition 1.7 — Lebesgue Outer Measure
> Với mỗi $E \subseteq \mathbb{R}$, **Lebesgue outer measure** (độ đo ngoài Lebesgue) của $E$ được định nghĩa:
>
> $$
> \mu^*(E) = \inf \left\{ \sum_{n=1}^{\infty} \ell(I_n) : E \subseteq \bigcup_{n=1}^{\infty} I_n,\; I_n \text{ là khoảng mở} \right\}
> $$
>
> trong đó $\ell(I_n) = b_n - a_n$ là độ dài khoảng $I_n = (a_n, b_n)$, và inf lấy trên **tất cả** các phủ đếm được bởi khoảng mở.

> [!theorem] Theorem 1.8 — Tính chất của Outer Measure
> Lebesgue outer measure $\mu^*$ thỏa:
>
> 1. $\mu^*(\emptyset) = 0$
>
> 2. **(Đơn điệu)** $A \subseteq B \Rightarrow \mu^*(A) \leq \mu^*(B)$
>
> 3. **(Subadditivity đếm được)** $\mu^*\!\left(\bigcup_{n=1}^\infty A_n\right) \leq \sum_{n=1}^\infty \mu^*(A_n)$
>
> 4. $\mu^*(I) = \ell(I)$ với mọi khoảng $I \subseteq \mathbb{R}$

**Proof sketch của (3).** Với mỗi $\varepsilon > 0$ và mỗi $n$, chọn phủ mở $\{I_{n,k}\}_k$ của $A_n$ sao cho $\sum_k \ell(I_{n,k}) < \mu^*(A_n) + \varepsilon/2^n$. Khi đó $\{I_{n,k}\}_{n,k}$ là phủ đếm được của $\bigcup_n A_n$, nên

$$
\mu^*\!\left(\bigcup_{n=1}^\infty A_n\right) \leq \sum_{n,k} \ell(I_{n,k}) < \sum_{n=1}^\infty \mu^*(A_n) + \varepsilon.
$$

Cho $\varepsilon \to 0$. $\blacksquare$

> [!warning] Lưu ý quan trọng
> Outer measure $\mu^*$ **không** có tính countable additivity trên mọi tập con của $\mathbb{R}$. Đây là lý do ta phải thu hẹp miền xác định xuống một $\sigma$-algebra phù hợp.

### Ví dụ tính toán

> [!example] Example 1.9 — Tập hữu tỉ có outer measure bằng $0$
> Ta chứng minh $\mu^*(\mathbb{Q} \cap [0,1]) = 0$.
>
> Liệt kê $\mathbb{Q} \cap [0,1] = \{q_1, q_2, q_3, \ldots\}$. Với $\varepsilon > 0$, phủ mỗi $q_n$ bởi khoảng mở $(q_n - \varepsilon/2^{n+1},\; q_n + \varepsilon/2^{n+1})$ có độ dài $\varepsilon/2^n$. Khi đó:
>
> $$
> \mu^*(\mathbb{Q} \cap [0,1]) \leq \sum_{n=1}^\infty \frac{\varepsilon}{2^n} = \varepsilon.
> $$
>
> Cho $\varepsilon \to 0$, ta được $\mu^*(\mathbb{Q} \cap [0,1]) = 0$.
>
> **Ý nghĩa**: Dù $\mathbb{Q}$ **dense** trong $\mathbb{R}$ (chen giữa mọi cặp số thực), nó lại có measure bằng $0$.

---

## Tập Đo Được và Lebesgue Measure

### Tiêu chuẩn Carathéodory

> [!definition] Definition 1.10 — Tập Đo Được Lebesgue (Carathéodory)
> Một tập $E \subseteq \mathbb{R}$ được gọi là **Lebesgue measurable** nếu với mọi tập $A \subseteq \mathbb{R}$:
>
> $$
> \mu^*(A) = \mu^*(A \cap E) + \mu^*(A \cap E^c)
> $$
>
> Nói cách khác, $E$ "chia cắt" mọi tập $A$ một cách "sạch sẽ" theo outer measure.

> [!note] Remark 1.11 — Tại sao điều kiện này?
> Vì $\mu^*$ subadditive, ta luôn có $\mu^*(A) \leq \mu^*(A \cap E) + \mu^*(A \cap E^c)$. Điều kiện Carathéodory đòi hỏi **đẳng thức** — tức là $E$ không "gây mất mát" khi chia cắt $A$. Trực giác: một tập "tốt" không nên làm tăng outer measure khi ta cắt qua nó.

> [!theorem] Theorem 1.12 — Lebesgue Measurable Sets tạo thành $\sigma$-algebra
> Ký hiệu $\mathcal{L}(\mathbb{R})$ là họ tất cả các Lebesgue measurable sets của $\mathbb{R}$. Khi đó:
>
> 1. $\mathcal{L}(\mathbb{R})$ là một $\sigma$-algebra trên $\mathbb{R}$
>
> 2. $\mathcal{B}(\mathbb{R}) \subseteq \mathcal{L}(\mathbb{R})$ (mọi Borel set đều measurable)
>
> 3. Restriction $\mu = \mu^*|_{\mathcal{L}(\mathbb{R})}$ là một **measure** hoàn chỉnh: với $\{E_n\}$ disjoint measurable:
>
> $$
> \mu\!\left(\bigsqcup_{n=1}^{\infty} E_n\right) = \sum_{n=1}^{\infty} \mu(E_n)
> $$
>
> $\mu$ được gọi là **Lebesgue measure**.

**Proof sketch.** Phần khó nhất là chứng minh $\mathcal{L}$ đóng với hợp đếm được. Với $E_1, E_2 \in \mathcal{L}$ và $A$ tùy ý:
$$
\mu^*(A) = \mu^*(A \cap E_1) + \mu^*(A \cap E_1^c)
$$
Áp dụng measurability của $E_2$ cho $A \cap E_1^c$:
$$
\mu^*(A \cap E_1^c) = \mu^*(A \cap E_1^c \cap E_2) + \mu^*(A \cap E_1^c \cap E_2^c)
$$
Từ đó suy ra $E_1 \cup E_2 \in \mathcal{L}$. Mở rộng bằng quy nạp và giới hạn. $\blacksquare$

### Tính chất Lebesgue Measure

> [!theorem] Theorem 1.13 — Tính chất cơ bản của Lebesgue Measure
> Lebesgue measure $\mu$ trên $(\mathbb{R}, \mathcal{L}(\mathbb{R}))$ thỏa:
>
> 1. **(Chuẩn hóa)** $\mu([a,b]) = b - a$ với mọi $a \leq b$
>
> 2. **(Bất biến tịnh tiến)** $\mu(E + t) = \mu(E)$ với mọi $t \in \mathbb{R}$, trong đó $E + t = \{x + t : x \in E\}$
>
> 3. **(Continuity từ dưới)** Nếu $E_1 \subseteq E_2 \subseteq \cdots$ thì $\mu\!\left(\bigcup_n E_n\right) = \lim_n \mu(E_n)$
>
> 4. **(Continuity từ trên)** Nếu $E_1 \supseteq E_2 \supseteq \cdots$ và $\mu(E_1) < \infty$ thì $\mu\!\left(\bigcap_n E_n\right) = \lim_n \mu(E_n)$
>
> 5. **(Xấp xỉ bởi tập mở/đóng)** Với mọi $E \in \mathcal{L}$ và $\varepsilon > 0$, tồn tại tập mở $U \supseteq E$ và tập đóng $F \subseteq E$ sao cho $\mu(U \setminus E) < \varepsilon$ và $\mu(E \setminus F) < \varepsilon$

> [!note] Remark 1.14 — Điều kiện $\mu(E_1) < \infty$ là cần thiết
> Continuity từ trên **cần** giả thiết $\mu(E_1) < \infty$. Phản ví dụ: $E_n = [n, +\infty)$, ta có $E_1 \supseteq E_2 \supseteq \cdots$ và $\bigcap_n E_n = \emptyset$, nhưng $\mu(E_n) = +\infty$ với mọi $n$.

---

## Null Sets và Tính Hoàn Chỉnh

> [!definition] Definition 1.15 — Null Set
> Tập $N \subseteq \mathbb{R}$ được gọi là **null set** (hay tập bị bỏ qua) nếu $\mu^*(N) = 0$.
>
> Lebesgue measure **hoàn chỉnh** (complete): mọi tập con của một null set đều là measurable (và có measure $0$).

> [!note] Remark 1.16 — "Almost Everywhere"
> Một tính chất được nói là thỏa **almost everywhere** (a.e.) nếu tập hợp các điểm mà nó không thỏa là một null set. Ví dụ: hai hàm $f, g$ bằng nhau a.e. nếu $\mu(\{x : f(x) \neq g(x)\}) = 0$.
>
> Khái niệm a.e. là trung tâm của mọi lý thuyết tích phân Lebesgue.

---

## Cantor Set — Ví dụ Điển Hình

> [!example] Example 1.17 — Cantor Set $\mathcal{C}$
> Xây dựng Cantor set bằng cách loại bỏ lần lượt từ $[0,1]$:
>
> - **Bước 0**: $C_0 = [0,1]$
> - **Bước 1**: Loại $\left(\frac{1}{3}, \frac{2}{3}\right)$. Còn lại $C_1 = [0,\frac{1}{3}] \cup [\frac{2}{3},1]$
> - **Bước 2**: Loại khoảng giữa mỗi đoạn. Còn lại $C_2$ gồm $4$ đoạn
> - **Bước $n$**: $C_n$ gồm $2^n$ đoạn, mỗi đoạn dài $3^{-n}$
>
> Cantor set $\mathcal{C} = \bigcap_{n=0}^\infty C_n$.
>
> **Tính chất đáng ngạc nhiên**:
>
> $$
> \mu(\mathcal{C}) = 1 - \sum_{n=0}^{\infty} \frac{2^n}{3^{n+1}} = 1 - \frac{1/3}{1 - 2/3} = 0
> $$
>
> Vậy $\mathcal{C}$ là tập **measure zero** nhưng **uncountable** (có lực lượng bằng $\mathbb{R}$)! Đây là ví dụ điển hình cho thấy "kích thước" theo nghĩa lực lượng và theo nghĩa measure là hai khái niệm độc lập.

---

## Vitali Set — Tập Không Đo Được

> [!warning] Example 1.18 — Vitali Set (Non-Measurable Set)
> Giả sử Axiom of Choice. Định nghĩa quan hệ tương đương trên $[0,1]$: $x \sim y \Leftrightarrow x - y \in \mathbb{Q}$. Dùng Axiom of Choice, chọn đúng một đại diện từ mỗi lớp tương đương — gọi tập này là $V$ (Vitali set).
>
> **Chứng minh $V \notin \mathcal{L}(\mathbb{R})$**: Xét các tịnh tiến $V_q = V + q$ với $q \in \mathbb{Q} \cap [-1,1]$. Các tập này đôi một rời rạc và $[0,1] \subseteq \bigcup_q V_q \subseteq [-1,2]$. Nếu $V$ measurable thì:
>
> $$
> 1 \leq \mu\!\left(\bigcup_q V_q\right) = \sum_q \mu(V_q) = \sum_q \mu(V) \leq 3
> $$
>
> Mâu thuẫn: nếu $\mu(V) = 0$ thì vế trái bằng $0$; nếu $\mu(V) > 0$ thì vế phải $= +\infty$. $\square$
>
> **Kết luận**: Tồn tại tập con của $[0,1]$ không đo được theo Lebesgue. Axiom of Choice là cần thiết cho sự tồn tại của tập này.

---

## Python — Minh họa Lebesgue Measure

```python
import numpy as np
import matplotlib.pyplot as plt

# Minh hoa: outer measure xap xi bang phu mo
# Vi du: tinh outer measure xap xi cua tap can
def outer_measure_approx(E_indicator, n_intervals=1000, domain=(0, 1)):
    """
    Xap xi outer measure cua E bang cach dem so khoang nho phu E.
    E_indicator: ham chi thi, tra ve True neu x thuoc E.
    """
    a, b = domain
    dx = (b - a) / n_intervals
    xs = np.linspace(a + dx/2, b - dx/2, n_intervals)
    covered = sum(1 for x in xs if E_indicator(x))
    return covered * dx

# Vi du 1: [0.2, 0.6] — ket qua phai la 0.4
interval_indicator = lambda x: 0.2 <= x <= 0.6
print(f"Outer measure cua [0.2, 0.6]: {outer_measure_approx(interval_indicator):.4f}")

# Vi du 2: Q ∩ [0,1] — ket qua phai xap xi 0
# (Kho minh hoa chinh xac, nhung voi luoi huu han ta nhin thay measure rat nho)
rational_indicator = lambda x: any(abs(x - p/q) < 1e-6
                                    for q in range(1, 30)
                                    for p in range(0, q+1))
print(f"Outer measure xap xi Q ∩ [0,1]: {outer_measure_approx(rational_indicator, n_intervals=500):.4f}")

# Truc quan hoa Cantor set (3 buoc dau)
fig, axes = plt.subplots(4, 1, figsize=(10, 6))
def cantor_step(intervals):
    result = []
    for (a, b) in intervals:
        third = (b - a) / 3
        result += [(a, a + third), (b - third, b)]
    return result

sets = [[(0, 1)]]
for i in range(3):
    sets.append(cantor_step(sets[-1]))

for i, intervals in enumerate(sets):
    for (a, b) in intervals:
        axes[i].barh(0, b - a, left=a, height=0.5, color='steelblue')
    total = sum(b - a for a, b in intervals)
    axes[i].set_title(f"Buoc {i}: {len(intervals)} doan, tong do dai = {total:.4f}")
    axes[i].set_xlim(0, 1)
    axes[i].set_yticks([])

plt.suptitle("Xay dung Cantor Set — Measure → 0", fontsize=13)
plt.tight_layout()
plt.savefig("cantor_set.png", dpi=120)
plt.show()
print("Measure Cantor set = lim (2/3)^n =", 0)
```

---

## Summary / Key Takeaways

- **$\sigma$-algebra** $\mathcal{M}$ là họ tập con đóng với phần bù và hợp đếm được — ngôn ngữ nền tảng để định nghĩa measure.
- **Borel $\sigma$-algebra** $\mathcal{B}(\mathbb{R})$ là $\sigma$-algebra nhỏ nhất chứa mọi tập mở — đủ cho hầu hết ứng dụng thực tế.
- **Lebesgue outer measure** $\mu^*$ xấp xỉ kích thước bất kỳ tập con bằng phủ khoảng mở — xác định được cho *mọi* tập hợp nhưng thiếu countable additivity.
- **Tiêu chuẩn Carathéodory**: $E$ measurable $\Leftrightarrow$ $\mu^*(A) = \mu^*(A \cap E) + \mu^*(A \cap E^c)$ với mọi $A$ — loại bỏ các tập "xấu".
- **Lebesgue measure** $\mu = \mu^*|_{\mathcal{L}}$ là measure hoàn chỉnh, countably additive, bất biến tịnh tiến.
- **Null sets** (measure $0$) và ngôn ngữ "almost everywhere" (a.e.) là trung tâm của phân tích Lebesgue.
- **Cantor set**: uncountable nhưng measure $0$ — trực giác "kích thước" và "lực lượng" là hai khái niệm khác nhau.
- **Vitali set**: tồn tại (giả sử AC) tập không đo được — $\mathcal{L}(\mathbb{R}) \subsetneq \mathcal{P}(\mathbb{R})$.

---

## References

- Stein, E. M. & Shakarchi, R. *Fourier Analysis: An Introduction*. Princeton, 2003. Appendix B.
- Folland, G. B. *Real Analysis: Modern Techniques and Their Applications* (2nd ed.). Wiley, 1999. Chương 1.
- Royden, H. L. & Fitzpatrick, P. M. *Real Analysis* (4th ed.). Pearson, 2010. Chương 2–3.
- Hunter, J. K. *Measure Theory*. UC Davis Lecture Notes. Chương 1–2.
