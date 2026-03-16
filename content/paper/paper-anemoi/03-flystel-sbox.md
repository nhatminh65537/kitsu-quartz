---
title: "03. The Flystel S-Box"
type: math-component
tags: [anemoi, flystel, butterfly, ccz-equivalence, s-box, math-component, lesson-03]
aliases: [Flystel, Open Flystel, Closed Flystel, CCZ-equivalence Anemoi]
source: "New Design Techniques for Efficient Arithmetization-Oriented Hash Functions: Anemoi Permutations and Jive Compression Mode — Bouvier, Briaud, Chaidos, Perrin, Salen, Velichkov, Willems, CRYPTO 2023 (ePrint 2022/840)"
created: 2026-03-15
---

> **Prerequisites**: Đa thức trên trường hữu hạn $\mathbb{F}_q$, AO hash và CICO problem (xem [[01-ao-hash-functions-and-cico|01. AO Hash Functions & CICO]]), CCZ-equivalence (khái niệm nền — 🔴 [CCZ98])
> 🔴 **Prerequisite references**: Carlet, Charpin, Zinoviev — *Codes, bent functions and permutations* [CCZ98] (CCZ-equivalence gốc); Perrin et al. — *Butterfly structure* [BCI+20] (nền tảng butterfly)
> **Lesson type**: Math Component
> **Covers**: §4.1 (butterfly structure background), §4.2 (Open Flystel $H$), §4.3 (Closed Flystel $V$), §4.4 (CCZ-equivalence of $H$ và $V$), §4.5 (arithmetization cost analysis)
>
> **Notation** (ký hiệu dùng trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $H : \mathbb{F}_q^2 \to \mathbb{F}_q^2$ | Open Flystel — high-degree permutation |
> | $V : \mathbb{F}_q^2 \to \mathbb{F}_q^2$ | Closed Flystel — low-degree function |
> | $Q_\gamma(x)$ | Quadratic function: $Q_\gamma(x) = \gamma \cdot x^2$ (trong $\mathbb{F}_p$) |
> | $Q_\delta(x)$ | Quadratic function: $Q_\delta(x) = \delta \cdot x^2$ |
> | $g$ | Generator / multiplicative constant (paper ký hiệu là $g$, tương đương $\gamma$) |
> | $E : \mathbb{F}_q \to \mathbb{F}_q$ | Permutation dùng trong Flystel: $E(x) = x^\alpha$ (trong $\mathbb{F}_p$) hoặc $x^{1/\alpha}$ |
> | $\alpha$ | Exponent của S-box (nhỏ nhất sao cho $\gcd(\alpha, q-1) = 1$, thường $\alpha \in \{3,5,7,11\}$) |
> | $\mathsf{mult}(f)$ | Số phép nhân cần thiết để tính $f$ trong một circuit |

---

## Motivation

S-box là thành phần quyết định chi phí arithmetization của một AO hash function. Lý tưởng, một S-box tốt cho AO phải đồng thời:

1. **High cryptographic strength** — đảm bảo diffusion tốt, kháng differential và linear attacks.
2. **Low arithmetization cost** — ít phép nhân trong R1CS, degree thấp trong Plonk.

Hai yêu cầu này thường mâu thuẫn: S-box mạnh (như AES SBox) có degree cao và cần nhiều ràng buộc. S-box đơn giản (như $x^3$) ít ràng buộc nhưng cần nhiều rounds.

Đóng góp chính của paper [Bou+22/23, §4] là phát hiện ra rằng **butterfly structure** — đã được nghiên cứu kỹ trong symmetric cryptography — có thể được khai thác để xây dựng S-box vừa mạnh vừa rẻ, thông qua một mối quan hệ trước đây chưa được biết đến với **CCZ-equivalence**.

---

## 1. Butterfly Structure — Nền tảng

### 1.1 Butterfly cơ bản

> [!info] 🟡 Butterfly Structure [BCI+20] — Perrin, Udovenko, Biryukov
> **Butterfly structure** là một cách xây dựng S-box trên $\mathbb{F}_{2^{2n}}$ (hoặc $\mathbb{F}_p^2$) từ hai hàm trên $\mathbb{F}_{2^n}$: một **quadratic function** $Q$ và một **exponentiation** $E$.  
> Cấu trúc ban đầu được giới thiệu cho thiết kế S-box với tính chất APN (Almost Perfect Nonlinear) trên binary fields.  
> Paper [Bou+22/23] mở rộng ý tưởng này sang $\mathbb{F}_p$ và thêm Feistel-like feedback để tạo ra Flystel.  
> *(theo [BCI+20]: Perrin, Udovenko, Biryukov — Cryptanalysis of a Theorem: Decomposing the Only Known Solution to the Big APN Problem, CRYPTO 2016, và các paper butterfly liên quan)*

Ý tưởng cốt lõi: kết hợp một phép tính bậc cao (expensive nhưng mạnh) với một phép tính bậc thấp (cheap) sao cho toàn bộ cặp có tính chất cryptographic tốt.

### 1.2 Flystel = Butterfly + Feistel

"Flystel" = **Fly**stel = **Butterfly** + **Feistel**. Tên phản ánh cấu trúc: đây là butterfly được bọc trong một vòng Feistel-like feedback.

---

## 2. Open Flystel $H$ — High-Degree Permutation

> [!note] Định nghĩa 2.1 — Open Flystel $H$ (trên $\mathbb{F}_p$)
> **Input**: $(x, y) \in \mathbb{F}_p^2$
> **Output**: $(x', y') \in \mathbb{F}_p^2$
>
> Các bước tính (từ paper [Bou+22/23, §4.2]):
>
> $$
> x' = x - g \cdot Q_\delta(y) - g^{-1}
> $$
>
> $$
> y' = y - E(x')
> $$
>
> $$
> x'' = x' + g \cdot Q_\delta(y')
> $$
>
> Output: $(x'', y')$
>
> Trong đó:
> - $Q_\delta(y) = y^2$ (quadratic function, $\delta = 1$)
> - $E(x) = x^{1/\alpha}$ (inverse power map — permutation trên $\mathbb{F}_p$ vì $\gcd(\alpha, p-1) = 1$)
> - $g \in \mathbb{F}_p^*$ là một generator/constant cố định theo trường

Lưu ý ký hiệu: $H$ là **permutation** (bijection) trên $\mathbb{F}_p^2$ — hoạt động này có thể đảo ngược, nhưng inverse của nó có degree cao.

### 2.1 Tại sao $H$ là permutation?

Từ định nghĩa, cho $(x'', y')$, có thể recover $(x, y)$:
- $x' = x'' - g \cdot Q_\delta(y')$
- $y = y' + E(x')$
- $x = x' + g \cdot Q_\delta(y) + g^{-1}$

Mỗi bước là invertible $\Rightarrow$ $H$ là permutation. $\blacksquare$

### 2.2 Degree của $H$

Bước tốn kém nhất là $E(x') = (x')^{1/\alpha}$. Vì $\alpha$ thường là 3, 5, 7, hoặc 11, $1/\alpha \bmod (p-1)$ là một số rất lớn. Kết quả là **degree của $H$ rất cao** — đây là tính chất cryptographic mong muốn (resistance against algebraic attacks), nhưng đắt trong arithmetization.

---

## 3. Closed Flystel $V$ — Low-Degree Function

> [!note] Định nghĩa 3.1 — Closed Flystel $V$ (trên $\mathbb{F}_p$)
> **Input**: $(x, y) \in \mathbb{F}_p^2$
> **Output**: $(x', y') \in \mathbb{F}_p^2$
>
> Các bước tính (từ paper [Bou+22/23, §4.3]):
>
> $$
> x' = x - g \cdot Q_\delta(y) - g^{-1}
> $$
>
> $$
> y' = y - E(x')
> $$
>
> $$
> x'' = x' + g \cdot Q_\gamma(y')
> $$
>
> Output: $(x'', y')$  
>
> **Điểm khác biệt với $H$**: $V$ dùng $Q_\gamma$ ở bước cuối thay vì $Q_\delta$, **và** $V$ là **không phải permutation** — đây là một *function* từ $\mathbb{F}_p^2$ sang $\mathbb{F}_p^2$ (không nhất thiết bijection).

> [!warning] Điểm quan trọng: $V$ không là permutation
> Open Flystel $H$ là permutation; Closed Flystel $V$ là function (không bijection). Điều này có vẻ làm $V$ yếu hơn, nhưng đây chính là "trade": $V$ có **degree thấp hơn đáng kể** so với $H$, cho phép arithmetize hiệu quả trong Plonk.

### 3.1 Degree của $V$

Với $E(x) = x^{1/\alpha}$, bước tính $y' = y - (x')^{1/\alpha}$ vẫn cần một inversion. Tuy nhiên, khác với $H$, bước cuối của $V$ dùng $Q_\gamma(y')$ là bậc 2 trong $y'$ — và $y'$ đã được xác định trước. Kết quả là:

**Số ràng buộc để verify $V$**: chỉ cần $1$ phép nhân (cho $Q_\gamma$ hoặc $Q_\delta$) + $1$ lần inverse power map $E$ — tổng cộng **rẻ hơn nhiều** so với verify $H$ trực tiếp.

---

## 4. CCZ-Equivalence của $H$ và $V$

Đây là **đóng góp lý thuyết trung tâm** của paper [Bou+22/23, §4.4].

### 4.1 CCZ-equivalence là gì?

> [!note] Định nghĩa 4.1 — CCZ-Equivalence [CCZ98]
> Hai hàm $F, G : \mathbb{F}_q^n \to \mathbb{F}_q^n$ là **CCZ-equivalent** nếu graph của chúng:
>
> $$
> \mathcal{G}_F = \{(x, F(x)) : x \in \mathbb{F}_q^n\}, \quad \mathcal{G}_G = \{(x, G(x)) : x \in \mathbb{F}_q^n\}
> $$
>
> liên quan với nhau bởi một **affine bijection** $L : \mathbb{F}_q^{2n} \to \mathbb{F}_q^{2n}$:
>
> $$
> L(\mathcal{G}_F) = \mathcal{G}_G
> $$
>
> CCZ-equivalence bảo toàn nhiều tính chất cryptographic: differential uniformity, nonlinearity, algebraic degree (theo một nghĩa nhất định).

### 4.2 Ý nghĩa của CCZ-equivalence trong AO

Khám phá chính của [Bou+22/23, §4.4]:

> [!abstract] Theorem 4.2 — $H$ và $V$ là CCZ-equivalent (theo [Bou+22/23])
> Open Flystel $H$ và Closed Flystel $V$ là CCZ-equivalent. Nghĩa là tồn tại affine bijection $L$ sao cho $L(\mathcal{G}_H) = \mathcal{G}_V$.
>
> **Hệ quả trực tiếp**: Verify rằng $(x'', y') = H(x, y)$ — một phép tính expensive với degree cao — **tương đương với** verify rằng $(x'', y') \in \mathcal{G}_V$ theo $L$ — một phép tính **cheap** vì $V$ có degree thấp.

**Proof sketch**: Affine bijection $L$ được xây dựng tường minh từ cấu trúc Feistel của $H$ và $V$. Sự khác biệt duy nhất giữa $H$ và $V$ là bước cuối dùng $Q_\delta$ vs $Q_\gamma$. Chọn $L$ thích hợp liên kết graph của hai hàm này. $\square$

### 4.3 Kết nối với Arithmetization-Orientation

Đây là insight mới của paper:

> [!tip] 💡 Agent note — Kết nối CCZ và AO (core insight của paper)
> Trong proof systems, prover không cần **tính** $H(x, y)$ trực tiếp — prover chỉ cần **chứng minh** (convince verifier) rằng $(x'', y') = H(x, y)$. Đây là bài toán **verify**, không phải **compute**.  
>
> CCZ-equivalence $H \sim V$ có nghĩa: **verify** $H(x,y) = (x'', y'')$ ≡ **verify** một điều kiện về $V$ — và vì $V$ có degree thấp, điều kiện này chỉ cần **ít ràng buộc đa thức**.  
>
> Đây là lý do Flystel rẻ hơn các S-box khác trong Plonk: không phải vì tính toán rẻ hơn, mà vì **chứng minh** tính toán rẻ hơn.

---

## 5. Instantiation cụ thể

### 5.1 Flystel trên $\mathbb{F}_p$ (prime field)

Các hàm cụ thể [Bou+22/23, §4]:

$$
Q_\gamma(x) = g \cdot x^2, \quad Q_\delta(x) = g^{-1} \cdot x^2, \quad E(x) = x^{1/\alpha}
$$

Với $g$ là một element thỏa mãn điều kiện generator (không phải quadratic residue khi cần thiết), và $\alpha \in \{3, 5, 7, 11\}$ là exponent nhỏ nhất sao cho $\gcd(\alpha, p-1) = 1$.

**Open Flystel $H$ trên $\mathbb{F}_p$ — step-by-step:**

| Bước | Phép tính | Cost R1CS |
|------|-----------|-----------|
| 1 | $u = g \cdot y^2$ | 1 mult ($y^2$) |
| 2 | $x_1 = x - u - g^{-1}$ | 0 mult (linear) |
| 3 | $x_1^{1/\alpha}$: cần $O(\log(p-1))$ mult | $\lceil \log_2 (p-1)/(\alpha-1) \rceil$ mult |
| 4 | $y_1 = y - x_1^{1/\alpha}$ | 0 mult |
| 5 | $v = g \cdot y_1^2$ | 1 mult |
| 6 | $x_2 = x_1 + v$ | 0 mult |

**Closed Flystel $V$ — verify cost (Plonk):**

Verify $(x_2, y_1) = V(x, y)$ chỉ cần kiểm tra:
- $x_2 - x + g^{-1} = g(y^2 - y_1^2)$ — bậc 2 trong $y$
- $y - y_1 = x_1^{1/\alpha}$ — một inversion

Tổng: **2 custom gates** trong Plonk (một quadratic, một inversion).

### 5.2 Flystel trên $\mathbb{F}_{2^n}$ (binary field)

Trên binary fields, $Q_\gamma(x) = x^2 + \gamma x$ (linearized polynomial) và $E(x) = x^\alpha$ với $\alpha$ là Gold exponent hoặc tương tự. Cấu trúc tương tự, instantiation khác.

> [!tip] 💡 Agent note
> Anemoi paper [Bou+22/23] chủ yếu nhắm vào prime fields $\mathbb{F}_p$ (BLS12-381, BN-254) vì đây là trường của hầu hết ZK proof systems hiện tại. Instantiation binary field được đề cập cho completeness.

---

## 6. So sánh chi phí arithmetization

| S-box | R1CS constraints | Plonk gates | Degree |
|-------|-----------------|-------------|--------|
| $x^3$ (MiMC) | 1 | 1 | 3 |
| $x^\alpha$ (Poseidon full) | $\lceil\log_2 \alpha\rceil$ | $\lceil\log_2 \alpha\rceil$ | $\alpha$ |
| $x^{1/\alpha}$ (Rescue inversion) | $\lceil\log_2 (p-1)/(\alpha-1)\rceil$ | cao | $1/\alpha \bmod (p-1)$ (lớn) |
| **Flystel $H$** (verify via $V$) | **~2** | **2 custom gates** | **cao (mạnh)** |

> [!abstract] Kết quả chính §4.5
> Verify một Flystel evaluation trong Plonk chỉ tốn **2 custom gates** (một cho bước quadratic, một cho inversion), độc lập với $\alpha$ và $p$. Đây là lý do Anemoi đạt 21–35% reduction so với Poseidon trên Plonk — Poseidon cần $\lceil\log_2 \alpha\rceil$ gate trên mỗi S-box application.

---

## 7. Summary

- **Open Flystel $H$**: high-degree permutation trên $\mathbb{F}_p^2$, mạnh cryptographically, đắt khi tính trực tiếp.
- **Closed Flystel $V$**: low-degree function trên $\mathbb{F}_p^2$, không phải permutation, rẻ khi verify.
- **CCZ-equivalence $H \sim V$**: verify $H$ ≡ verify điều kiện về $V$ — đây là insight cho phép arithmetize $H$ cheaply.
- **Số ràng buộc**: 2 Plonk custom gates per Flystel — tốt hơn tất cả S-box competitor hiện tại.
- **Kết nối**: Flystel là S-box layer của Anemoi permutation, được phân tích trong [[04-anemoi-permutation|04. The Anemoi Permutation]].

---

## References

- [Bou+22/23] Bouvier et al. — *Anemoi Permutations and Jive Compression Mode*, CRYPTO 2023 / ePrint 2022/840
- [BCI+20] Perrin, Udovenko, Biryukov — *Butterfly structures* (và các paper liên quan về butterfly/APN structures) (🟡 Butterfly foundation)
- [CCZ98] Carlet, Charpin, Zinoviev — *Codes, bent functions and permutations suitable for DES-like cryptosystems*, Designs, Codes and Cryptography 1998 (🔴 Prerequisite — CCZ-equivalence definition)
