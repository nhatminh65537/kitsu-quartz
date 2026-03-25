---
title: "08. Imaginary Quadratic Orders & Ideal Class Groups"
type: math-component
tags: [crypto, isogeny, class-group, quadratic-order, CSIDH, lesson-08]
aliases: [Ideal Class Group, Imaginary Quadratic Order, Class Group Action]
created: 2026-03-24
---

> **Prerequisites**: [[04-endomorphism-rings|04. Endomorphism Rings & j-invariant]], abstract algebra (ring theory, ideals, modules)
> **Lesson type**: Math Component
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $K$ | Imaginary quadratic field $\mathbb{Q}(\sqrt{-d})$, $d > 0$ squarefree |
> | $D_K$ | Fundamental discriminant của $K$ |
> | $\mathcal{O}_K$ | Ring of integers của $K$ (maximal order) |
> | $\mathcal{O}_f$ | Order conductor $f$: $\mathcal{O}_f = \mathbb{Z} + f\mathcal{O}_K$ |
> | $\text{disc}(\mathcal{O})$ | Discriminant của order $\mathcal{O}$: $f^2 D_K$ |
> | $\text{cl}(\mathcal{O})$ | Ideal class group của $\mathcal{O}$ |
> | $h(\mathcal{O})$ | Class number $= \#\text{cl}(\mathcal{O})$ |
> | $\mathfrak{a}, \mathfrak{b}, \mathfrak{l}$ | Ideals trong $\mathcal{O}$ |
> | $N(\mathfrak{a})$ | Norm của ideal $\mathfrak{a}$: $[\mathcal{O} : \mathfrak{a}]$ |

---

## Tại sao Cần Ideal Class Group?

Lesson 04 đã giới thiệu sơ lược rằng CM j-invariants bijectional với ideal class group. Bây giờ ta cần xây dựng chính xác bộ máy đại số số học này vì nó là **ngôn ngữ chính thức của CSIDH** (và sau đó là Deuring correspondence ở Lesson 09).

Ý tưởng cốt lõi: ideal class group $\text{cl}(\mathcal{O})$ **tác động (act)** lên tập các đường cong elliptic CM bởi $\mathcal{O}$. Mỗi phần tử $[\mathfrak{a}] \in \text{cl}(\mathcal{O})$ xác định một isogeny duy nhất (lên đến isomorphism). Đây chính là **group action** làm nền tảng cho CSIDH.

---

## 1. Imaginary Quadratic Fields — Ôn lại

> [!note] Định nghĩa 8.1 — Imaginary Quadratic Field
> Cho $d > 0$ squarefree. **Imaginary quadratic field** là $K = \mathbb{Q}(\sqrt{-d})$. Ring of integers:
>
> $$
> \mathcal{O}_K = \begin{cases} \mathbb{Z}\left[\frac{1+\sqrt{-d}}{2}\right] & \text{nếu } d \equiv 3 \pmod 4 \\ \mathbb{Z}[\sqrt{-d}] & \text{nếu } d \equiv 1, 2 \pmod 4 \end{cases}
> $$
>
> **Fundamental discriminant**:
>
> $$
> D_K = \begin{cases} -d & \text{nếu } d \equiv 3 \pmod 4 \\ -4d & \text{nếu } d \equiv 1, 2 \pmod 4 \end{cases}
> $$
>
> [!example] Ví dụ 8.2
>
> | $K$ | $\mathcal{O}_K$ | $D_K$ |
> |-----|----------|-------|
> | $\mathbb{Q}(i) = \mathbb{Q}(\sqrt{-1})$ | $\mathbb{Z}[i]$ | $-4$ |
> | $\mathbb{Q}(\sqrt{-3})$ | $\mathbb{Z}[\omega_3]$, $\omega_3 = \frac{-1+\sqrt{-3}}{2}$ | $-3$ |
> | $\mathbb{Q}(\sqrt{-5})$ | $\mathbb{Z}[\sqrt{-5}]$ | $-20$ |
> | $\mathbb{Q}(\sqrt{-7})$ | $\mathbb{Z}\left[\frac{1+\sqrt{-7}}{2}\right]$ | $-7$ |

---

## 2. Orders và Ideals

> [!note] Định nghĩa 8.3 — Order và Fractional Ideal
> Cho $K$ imaginary quadratic. Một **order** trong $K$ là $\mathcal{O} = \mathbb{Z} + f\mathcal{O}_K$ với conductor $f \geq 1$.
>
> Một **fractional $\mathcal{O}$-ideal** là một $\mathcal{O}$-submodule $\mathfrak{a} \subset K$ của dạng $\mathfrak{a} = \alpha \mathcal{O}$ (principal) hoặc tổng quát hơn. **Integral ideal**: $\mathfrak{a} \subset \mathcal{O}$.
>
> **Norm** của integral ideal $\mathfrak{a}$: $N(\mathfrak{a}) = [\mathcal{O} : \mathfrak{a}] \in \mathbb{Z}_{>0}$.
>
> [!info] Phân tích nguyên tố của Ideal
> Trong $\mathcal{O}_K$ (maximal order), mọi ideal phân tích duy nhất thành tích các prime ideals. Với prime $\ell$, có ba khả năng:
>
> - **$\ell$ splits** trong $K$: $\ell\mathcal{O}_K = \mathfrak{l}\bar{\mathfrak{l}}$ với $\mathfrak{l} \neq \bar{\mathfrak{l}}$ — khi $\left(\frac{D_K}{\ell}\right) = +1$
> - **$\ell$ inert** trong $K$: $\ell\mathcal{O}_K$ là prime ideal — khi $\left(\frac{D_K}{\ell}\right) = -1$
> - **$\ell$ ramifies** trong $K$: $\ell\mathcal{O}_K = \mathfrak{l}^2$ — khi $\ell \mid D_K$
>
> Ký hiệu $\left(\frac{D_K}{\ell}\right)$ là Kronecker symbol.

---

## 3. Ideal Class Group

> [!note] Định nghĩa 8.4 — Ideal Class Group
> Tập các **invertible fractional ideals** của $\mathcal{O}$ tạo thành một nhóm abelian dưới phép nhân. Hai ideals $\mathfrak{a}, \mathfrak{b}$ **equivalent** nếu $\mathfrak{a} = \alpha\mathfrak{b}$ với $\alpha \in K^*$.
>
> **Ideal class group** là:
>
> $$
> \text{cl}(\mathcal{O}) := \frac{\{\text{invertible fractional ideals của } \mathcal{O}\}}{\{\text{principal ideals}\}}
> $$
>
> $h(\mathcal{O}) := \#\text{cl}(\mathcal{O})$ gọi là **class number**.

Đặc biệt với $\mathcal{O} = \mathcal{O}_K$ (maximal order):

> [!abstract] Định lý 8.5 — $h(\mathcal{O}_K) = 1$ và Unique Factorization
> $h(\mathcal{O}_K) = 1$ khi và chỉ khi $\mathcal{O}_K$ là PID (principal ideal domain), tức mọi ideal là principal, tức $K$ có unique factorization.

Có đúng 9 imaginary quadratic fields với $h(\mathcal{O}_K) = 1$ (được Heegner, Baker, Stark chứng minh): $d = 1, 2, 3, 7, 11, 19, 43, 67, 163$.

> [!example] Ví dụ 8.6 — Class group của $\mathbb{Q}(\sqrt{-5})$
>
> $K = \mathbb{Q}(\sqrt{-5})$, $D_K = -20$, $\mathcal{O}_K = \mathbb{Z}[\sqrt{-5}]$.
>
> $h(\mathcal{O}_K) = 2$: $\text{cl}(\mathcal{O}_K) \cong \mathbb{Z}/2\mathbb{Z}$.
>
> Hai classes: $[{\mathcal{O}_K}]$ (trivial) và $[(2, 1+\sqrt{-5})]$ (ideal $(2, 1+\sqrt{-5})$).
>
> Ví dụ điển hình về **non-unique factorization**: $6 = 2 \cdot 3 = (1+\sqrt{-5})(1-\sqrt{-5})$. Hai cách nhân này tương ứng với hai ideal classes khác nhau.

---

## 4. Tính Invertibility trong Non-Maximal Orders

Với non-maximal order $\mathcal{O}_f$ ($f > 1$), không phải mọi ideal đều invertible:

> [!abstract] Định lý 8.7 — Invertibility trong $\mathcal{O}_f$
> Một integral $\mathcal{O}_f$-ideal $\mathfrak{a}$ là **invertible** khi và chỉ khi $\gcd(N(\mathfrak{a}), f) = 1$, tức norm của $\mathfrak{a}$ coprime với conductor.

Điều này có ý nghĩa quan trọng cho CSIDH: để xây dựng group action thực sự (free and transitive), ta chỉ dùng các prime ideals có norm coprime với conductor.

> [!info] Subgroup $\text{cl}(\mathcal{O})$ từ ideals coprime với $f$
> Ký hiệu $I(\mathcal{O}_f, f)$ là nhóm các fractional ideals với norm coprime với $f$. Khi đó:
>
> $$
> \text{cl}(\mathcal{O}_f) \cong I(\mathcal{O}_f, f) / P(\mathcal{O}_f, f)
> $$
>
> trong đó $P(\mathcal{O}_f, f)$ là principal ideals trong $I(\mathcal{O}_f, f)$.
>
> Quan hệ với maximal order: có surjection $\text{cl}(\mathcal{O}_f) \twoheadrightarrow \text{cl}(\mathcal{O}_K)$ và:
>
> $$
> h(\mathcal{O}_f) = h(\mathcal{O}_K) \cdot \frac{f \prod_{\ell \mid f}\left(1 - \left(\frac{D_K}{\ell}\right)\frac{1}{\ell}\right)}{[\mathcal{O}_K^* : \mathcal{O}_f^*]}
> $$

---

## 5. Class Group Action trên Elliptic Curves

Đây là trái tim của lý thuyết — kết nối lý thuyết số học với hình học đường cong:

> [!abstract] Định lý 8.8 — Class Group Action (Deuring)
> Cho $\mathcal{O}$ là order trong $K$ và $\text{Ell}(\mathcal{O})$ là tập (j-invariants của) các elliptic curves $E$ với $\text{End}(E) \cong \mathcal{O}$ (trên $\bar{\mathbb{F}}_p$ hoặc $\mathbb{C}$).
>
> Ideal class group $\text{cl}(\mathcal{O})$ **tác động tự do và bắc cầu** (free and transitive) lên $\text{Ell}(\mathcal{O})$:
>
> $$
> \star: \text{cl}(\mathcal{O}) \times \text{Ell}(\mathcal{O}) \to \text{Ell}(\mathcal{O}), \quad ([\mathfrak{a}], E) \mapsto [\mathfrak{a}] \star E
> $$
>
> Cụ thể, với $\mathfrak{a}$ là integral ideal coprime với conductor:
>
> $$
> [\mathfrak{a}] \star E = E / E[\mathfrak{a}]
> $$
>
> trong đó $E[\mathfrak{a}] = \{P \in E(\bar{k}) \mid \alpha(P) = \mathcal{O} \text{ với mọi } \alpha \in \mathfrak{a}\}$ là **$\mathfrak{a}$-torsion subgroup**.

**Free**: $[\mathfrak{a}] \star E = E$ khi và chỉ khi $[\mathfrak{a}] = [\mathcal{O}]$ (trivial class).

**Transitive**: Với mọi $E_1, E_2 \in \text{Ell}(\mathcal{O})$, tồn tại duy nhất $[\mathfrak{a}]$ sao cho $[\mathfrak{a}] \star E_1 = E_2$.

Hệ quả: $\text{Ell}(\mathcal{O})$ là một **torsor** (principal homogeneous space) của $\text{cl}(\mathcal{O})$.

---

## 6. Prime Ideals và Isogenies

Các prime ideals là "generators" của class group và tương ứng với prime-degree isogenies:

> [!note] Định nghĩa 8.9 — Prime Ideal và $\ell$-Isogeny
> Cho $\ell$ nguyên tố split trong $K$: $\ell\mathcal{O} = \mathfrak{l}\bar{\mathfrak{l}}$ với $N(\mathfrak{l}) = N(\bar{\mathfrak{l}}) = \ell$.
>
> Tác động của $[\mathfrak{l}]$ lên $E \in \text{Ell}(\mathcal{O})$:
>
> $$
> [\mathfrak{l}] \star E = E / E[\mathfrak{l}]
> $$
>
> đúng là một **$\ell$-isogeny** $\phi_\mathfrak{l}: E \to E / E[\mathfrak{l}]$ degree $\ell = N(\mathfrak{l})$.

Điều này có nghĩa: **mỗi prime ideal $\mathfrak{l}$ norm $\ell$ tương ứng với một $\ell$-isogeny theo một hướng cụ thể trong isogeny graph**. Prime ideal liên hợp $\bar{\mathfrak{l}}$ tương ứng với dual isogeny (hướng ngược).

> [!example] Ví dụ 8.10 — Split prime trong $\mathbb{Q}(\sqrt{-5})$
>
> $K = \mathbb{Q}(\sqrt{-5})$, prime $\ell = 3$: $\left(\frac{-20}{3}\right) = \left(\frac{1}{3}\right) = 1$, vậy $3$ **splits**: $3\mathcal{O}_K = \mathfrak{l}_3 \bar{\mathfrak{l}}_3$ với $\mathfrak{l}_3 = (3, 1+\sqrt{-5})$.
>
> Với $E \in \text{Ell}(\mathcal{O}_K)$: $[\mathfrak{l}_3] \star E$ là đường cong kết nối với $E$ bởi một 3-isogeny horizontal trong volcano.
>
> Tác động của $[\mathfrak{l}_3]$ và $[\bar{\mathfrak{l}}_3]$ là hai hướng đi trên **crater** của volcano.

---

## 7. Ví dụ Cụ thể: CSIDH Setup

Trong CSIDH, setup đặc biệt là:

- $p \equiv 3 \pmod 4$ là prime, $p$ lớn
- Đường cong cơ sở: $E_0: y^2 = x^3 + x$ trên $\mathbb{F}_p$ (supersingular, $j = 1728$)
- Order tác động: $\mathcal{O} = \mathbb{Z}[\sqrt{-p}]$, với $K = \mathbb{Q}(\sqrt{-p})$
- Frobenius $\pi_p: (x,y) \mapsto (x^p, y^p)$ thỏa $\pi_p^2 = -p$ trong $\text{End}(E_0)$ — tức là $\text{End}(E_0)$ chứa $\mathbb{Z}[\sqrt{-p}]$

Các primes dùng trong CSIDH: chọn các primes nhỏ $\ell_1, \ldots, \ell_n$ sao cho $\ell_i$ splits trong $K$ (tức $\left(\frac{-p}{\ell_i}\right) = 1$). Điều kiện đủ: $\ell_i \mid p + 1$ (vì $p \equiv -1 \pmod{\ell_i}$).

> [!example] Ví dụ 8.11 — CSIDH-tiny với $p = 431$
>
> $p = 431 \equiv 3 \pmod 4$. $\ell_1 = 5$: $5 \mid 432 = p+1$, vậy $5$ splits trong $\mathbb{Q}(\sqrt{-431})$.
>
> Secret key: vector $(e_1, \ldots, e_n) \in \{-B, \ldots, B\}^n$.
>
> Public key: $E_A = [\mathfrak{l}_1^{e_1} \cdots \mathfrak{l}_n^{e_n}] \star E_0$ — kết quả của $\sum e_i$ isogeny steps.

---

## 8. Hiệu quả Tính toán: Từ Ideal đến Isogeny

Để evaluate $[\mathfrak{a}] \star E$ trong thực tế, với $\mathfrak{a}$ là product của prime ideals:

> [!note] Algorithm 8.12 — Evaluating Class Group Action
>
> **Input**: $E \in \text{Ell}(\mathcal{O})$, ideal $\mathfrak{a} = \mathfrak{l}_1^{e_1} \cdots \mathfrak{l}_n^{e_n}$
>
> **Output**: $[\mathfrak{a}] \star E$
>
> 1. Phân tích $\mathfrak{a}$ thành product của prime ideals
> 2. Với mỗi factor $\mathfrak{l}_i^{e_i}$: áp dụng $|e_i|$ isogenies degree $\ell_i$ (theo hướng $\mathfrak{l}_i$ nếu $e_i > 0$, hoặc $\bar{\mathfrak{l}}_i$ nếu $e_i < 0$)
> 3. Mỗi isogeny tính bằng Vélu's formulas (Lesson 03)
> 4. Return đường cong cuối cùng

Trong CSIDH, kernel của mỗi $\ell_i$-isogeny là subgroup $E[\mathfrak{l}_i] = \ker(\pi_p - 1) \cap E[\ell_i]$ — điểm trong $E(\mathbb{F}_p)$ (không phải $\mathbb{F}_{p^2}$), giúp computation hiệu quả hơn SIDH.

---

## 9. Class Number và Kích thước Key Space

Class number $h(\mathcal{O})$ xác định kích thước key space của CSIDH:

> [!info] Ước tính Class Number (Brauer-Siegel)
> Với $\mathcal{O} = \mathbb{Z}[\sqrt{-p}]$ và $p$ prime lớn:
>
> $$
> h(\mathcal{O}) \approx \frac{\sqrt{4p}}{2\pi} \cdot L(1, \chi_{-4p}) \approx \frac{\sqrt{p}}{\pi}
> $$
>
> tức $h(\mathcal{O}) = \Theta(\sqrt{p})$. Với $p \approx 2^{512}$, class number $\approx 2^{256}$.

Kích thước key space của CSIDH-512 là xấp xỉ $2^{256}$, phù hợp với 128-bit classical security.

---

## 10. SageMath — Ideal Class Group

```python
K = QuadraticField(-5, 'a')
OK = K.ring_of_integers()
Cl = K.class_group()

print(f"K = Q(sqrt(-5))")
print(f"Class number h = {K.class_number()}")
print(f"Class group = {Cl}")

for cl in Cl:
    print(f"  [{cl.ideal()}]: order {cl.order()}")
```

```python
for d in [-4, -7, -8, -11, -12, -16, -19, -20, -23, -43, -67, -163]:
    K = QuadraticField(d, 'a')
    print(f"d={d}: h={K.class_number()}")
```

```python
p = 431
K = QuadraticField(-p, 'w')
Cl = K.class_group()
h = K.class_number()
print(f"K = Q(sqrt(-{p}))")
print(f"Class number h({p}) = {h}")
print(f"Group structure: {Cl.invariants()}")

split_primes = []
for ell in primes(3, 50):
    if (p + 1) % ell == 0:
        split_primes.append(ell)
print(f"Split primes (divide p+1={p+1}): {split_primes}")
```

> [!tip] Pattern trong CTF — Class Group Action
> Nếu challenge liên quan đến CSIDH hoặc ordinary isogeny crypto: secret key thường là vector $(e_1, \ldots, e_n)$ trong $\{-B, \ldots, B\}^n$. Public key là j-invariant của curve sau khi áp dụng action. Biết class group structure cho phép enumerate secret keys với brute force khi $n \cdot B$ nhỏ.

---

## Tóm tắt

- **Order** $\mathcal{O}_f = \mathbb{Z} + f\mathcal{O}_K$ trong imaginary quadratic field $K$; discriminant $f^2 D_K$.
- **Ideal class group** $\text{cl}(\mathcal{O})$: nhóm abelian hữu hạn; $h(\mathcal{O}) = \#\text{cl}(\mathcal{O})$.
- Prime $\ell$ splits/inert/ramifies trong $K$ theo Kronecker symbol $\left(\frac{D_K}{\ell}\right) = +1, -1, 0$.
- **Class group action**: $\text{cl}(\mathcal{O}) \times \text{Ell}(\mathcal{O}) \to \text{Ell}(\mathcal{O})$ là **free and transitive** — $\text{Ell}(\mathcal{O})$ là torsor.
- Prime ideal $\mathfrak{l}$ norm $\ell$ tương ứng với một $\ell$-isogeny; $\bar{\mathfrak{l}}$ là dual isogeny.
- CSIDH dùng action này với $\mathcal{O} = \mathbb{Z}[\sqrt{-p}]$ trên supersingular curves định nghĩa trên $\mathbb{F}_p$.
- $h(\mathcal{O}) = \Theta(\sqrt{p})$ — key space cỡ $\sqrt{p}$, với $p \approx 2^{512}$ cho 128-bit security.

---

## References

- Cox, D.A. — *Primes of the Form $x^2 + ny^2$*, Wiley, 1989 (giáo trình tốt nhất về CM theory)
- Silverman, J.H. — *Advanced Topics in the Arithmetic of Elliptic Curves*, GTM 151, Ch. II
- Castryck, Lange, Martindale, Panny, Renes — *CSIDH: An Efficient Post-Quantum Commutative Group Action*, ASIACRYPT 2018, eprint.iacr.org/2018/383
- De Feo, L. — *Mathematics of Isogeny Based Cryptography*, arXiv:1711.04062, §4
- Sutherland, A. — *18.783 Elliptic Curves*, Lectures 20–22 (MIT OCW, 2025)
