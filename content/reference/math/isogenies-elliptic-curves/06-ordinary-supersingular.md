---
title: "06. Ordinary vs Supersingular Elliptic Curves"
type: foundation
tags: [crypto, isogeny, supersingular, ordinary, MOV-attack, lesson-06]
aliases: [Supersingular Curves, Ordinary Curves, MOV Attack]
created: 2026-03-24
---

> **Prerequisites**: [[04-endomorphism-rings|04. Endomorphism Rings & j-invariant]], [[05-frobenius-finite-fields|05. Frobenius & Curves over Finite Fields]], [[02-dual-isogeny-torsion|02. Dual Isogeny & Torsion Subgroups]]
> **Lesson type**: Foundation
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $t$ | Trace of Frobenius của $E/\mathbb{F}_q$ |
> | $p$ | Characteristic của trường cơ sở, $p > 3$ (trừ khi ghi rõ) |
> | $B_{p,\infty}$ | Quaternion algebra ramified tại $p$ và $\infty$ |
> | $k_E$ | Embedding degree của $E$ với nhân tố nguyên tố $r \mid \#E(\mathbb{F}_q)$ |
> | $e_\ell$ | Weil pairing $E[\ell] \times E[\ell] \to \mu_\ell$ |

---

## Hai Thế giới Tách biệt

Sau khi học Frobenius và endomorphism ring, ta đã có đủ nền tảng để phân loại chính thức elliptic curves trên trường hữu hạn thành hai loại với bản chất toán học và ứng dụng mật mã hoàn toàn khác nhau: **ordinary** và **supersingular**.

Sự phân loại này không chỉ là hình thức — nó quyết định cấu trúc của isogeny graph, loại giao thức có thể xây dựng, và cả các điểm yếu mật mã:
- **Ordinary**: isogeny graph là **volcano** (có tầng lớp), ECDLP khó, dẫn đến CSIDH.
- **Supersingular**: isogeny graph là **Ramanujan expander** (đồng đều), ECDLP dễ (MOV attack), nhưng bài toán isogeny rất khó — dẫn đến SIDH và SQISign.

---

## 1. Định nghĩa và Các Characterization Tương đương

> [!note] Định nghĩa 6.1 — Supersingular và Ordinary
> Cho $E/k$ với $\text{char}(k) = p > 0$. $E$ được gọi là **supersingular** nếu bất kỳ (tương đương tất cả) điều kiện sau đây thỏa mãn; ngược lại là **ordinary**.
>
> [!abstract] Định lý 6.2 — Các Characterization Tương đương
>
> Các điều kiện sau đây tương đương nhau:
>
> **(SS-1)** $E[p^r](\bar{k}) = \{\mathcal{O}\}$ với mọi $r \geq 1$ — nhóm $p$-torsion trivial
>
> **(SS-2)** Dual Frobenius $\hat{\pi}_p: E^{(p)} \to E$ là purely inseparable
>
> **(SS-3)** $\text{End}^0(E_{\bar{k}}) \cong B_{p,\infty}$ — endomorphism algebra là quaternion algebra
>
> **(SS-4)** $j(E) \in \mathbb{F}_{p^2}$ — j-invariant nằm trong $\mathbb{F}_{p^2}$
>
> **(SS-5)** Khi $E$ được định nghĩa trên $\mathbb{F}_q$: $t \equiv 0 \pmod{p}$ (trace of Frobenius chia hết bởi $p$)

Điều kiện **SS-1** là định nghĩa nguyên thủy (từ tên gọi liên quan đến formal group height). **SS-5** là điều kiện thực dụng nhất cho computation. **SS-3** là điều kiện nối với lý thuyết đại số.

**Proof sketch của SS-1 ⟺ SS-2.** $[p] = \hat{\pi}_p \circ \pi_p$. Vì $\pi_p$ luôn purely inseparable với $\ker\pi_p = \{\mathcal{O}\}$, nên $\ker[p] = \ker\hat{\pi}_p$ (theo cách tính kernel của composition). $\hat{\pi}_p$ purely inseparable $\iff \ker\hat{\pi}_p = \{\mathcal{O}\} \iff E[p] = \{\mathcal{O}\}$, suy ra $E[p^r] = \{\mathcal{O}\}$ bằng quy nạp. $\blacksquare$

---

## 2. Đặc trưng Tường minh theo $t$

> [!abstract] Định lý 6.3 — Supersingular khi và chỉ khi $p \mid t$
> Cho $E/\mathbb{F}_q$ với $q = p^r$ và trace of Frobenius $t$. Thì:
>
> $$
> E \text{ supersingular} \iff t \equiv 0 \pmod{p}
> $$

Từ Hasse bound $|t| \leq 2\sqrt{q}$, với $q = p$ ta có $|t| \leq 2\sqrt{p}$. Nếu $p \mid t$ thì hoặc $t = 0$ hoặc $|t| \geq p$. Vì $p > 2\sqrt{p}$ khi $p > 4$, chỉ có thể $t = 0$ với $p > 4$. Do đó:

> [!info] Hệ quả 6.4 — Supersingular trên $\mathbb{F}_p$ với $p > 3$
> Với $p > 3$ và $E/\mathbb{F}_p$: $E$ supersingular khi và chỉ khi $t = 0$, tức $\#E(\mathbb{F}_p) = p + 1$.

Điều này có nghĩa là trên $\mathbb{F}_p$ (không phải extension), supersingular curves là **hiếm**: chỉ những đường cong với đúng $p+1$ điểm.

> [!warning] Lưu ý — $p = 2, 3$
> Với $p = 2$: supersingular có thể có $t \in \{0, \pm 1\}$ (không nhất thiết $t = 0$).  
> Với $p = 3$: supersingular nếu $t \in \{0, \pm 3\}$.  
> Phần còn lại của bài giả định $p > 3$ trừ khi ghi rõ.

---

## 3. Số lượng Supersingular Curves

Từ Định lý 5.8, số j-invariants supersingular phân biệt trên $\overline{\mathbb{F}}_p$ là:

$$
N_{\text{ss}}(p) = \left\lfloor \frac{p-1}{12} \right\rfloor + \varepsilon_p \approx \frac{p}{12}
$$

Đây là con số **nhỏ** so với tổng số j-invariants là $p^2$ (vì $j \in \mathbb{F}_{p^2}$). Tỉ lệ supersingular là $\approx p/12$ trên tổng $p^2$ — tức là cực kỳ thưa thớt khi $p$ lớn.

Tuy nhiên, tất cả supersingular j-invariants nằm trong $\mathbb{F}_{p^2}$ — chúng tạo thành một tập **hữu hạn và xác định** phụ thuộc vào $p$. Đây là tập đỉnh của supersingular isogeny graph.

---

## 4. Embedding Degree và MOV Attack

Đây là liên kết trực tiếp giữa supersingular curves và điểm yếu mật mã kinh điển.

> [!note] Định nghĩa 6.5 — Embedding Degree
> Cho $E/\mathbb{F}_q$ và $r$ là số nguyên tố chia $\#E(\mathbb{F}_q)$. **Embedding degree** của $E$ (với $r$) là số nguyên dương nhỏ nhất $k$ sao cho:
>
> $$
> r \mid q^k - 1
> $$
>
> Tương đương: $k$ là bậc nhỏ nhất của $q$ trong nhóm $(\mathbb{Z}/r\mathbb{Z})^*$.

Ý nghĩa: $k$ là bậc nhỏ nhất của extension field $\mathbb{F}_{q^k}$ mà ở đó toàn bộ $E[r] \subset E(\mathbb{F}_{q^k})$ (tức là $\mathbb{F}_{q^k}$ chứa đủ $r^2$ điểm $r$-torsion).

> [!abstract] Định lý 6.6 — MOV Bound cho Supersingular Curves (Menezes-Okamoto-Vanstone, 1993)
> Nếu $E/\mathbb{F}_q$ là supersingular thì embedding degree $k \leq 6$. Cụ thể:
>
> | Trace $t$ | $k$ |
> |-----------|-----|
> | $t = 0$ | $k = 2$ |
> | $t = \pm\sqrt{q}$ ($q$ square) | $k = 1$ hoặc $k = 2$ |
> | $t = \pm\sqrt{2q}$ ($q = 2^r$) | $k = 4$ |
> | $t = \pm\sqrt{3q}$ ($q = 3^r$) | $k = 3$ hoặc $k = 6$ |

### MOV Attack — Giảm ECDLP về DLP trong $\mathbb{F}_{q^k}^*$

> [!danger] Tấn công 6.7 — MOV Attack
>
> **Điều kiện**: $E/\mathbb{F}_q$ supersingular, $P, Q \in E(\mathbb{F}_q)$ với $Q = [n]P$, $r = \text{ord}(P)$ là nguyên tố, $k$ là embedding degree (nhỏ, $\leq 6$).
>
> **Mục tiêu**: Tìm $n$ từ $P$ và $Q$ (ECDLP).
>
> **Bước 1 — Lift sang $E(\mathbb{F}_{q^k})$**: Mở rộng tính toán sang $\mathbb{F}_{q^k}$ để đảm bảo $E[r] \subset E(\mathbb{F}_{q^k})$.
>
> **Bước 2 — Chọn điểm auxiliary**: Chọn $T \in E(\mathbb{F}_{q^k})$ ngẫu nhiên sao cho $e_r(P, T) \neq 1$ (non-degenerate Weil pairing). Nếu $T \in \langle P \rangle$ thì chọn lại.
>
> **Bước 3 — Tính Weil pairing**:
>
> $$
> g_P = e_r(P, T) \in \mu_r \subset \mathbb{F}_{q^k}^*
> $$
>
> $$
> g_Q = e_r(Q, T) = e_r([n]P, T) = e_r(P, T)^n = g_P^n \in \mathbb{F}_{q^k}^*
> $$
>
> **Bước 4 — Giải DLP trong $\mathbb{F}_{q^k}^*$**: Tìm $n$ từ $g_P$ và $g_Q = g_P^n$ bằng index calculus hoặc NFS.
>
> **Độ phức tạp**: $L_{q^k}[1/3, c]$ — subexponential trong $q^k$, hiệu quả khi $k$ nhỏ.
>
> [!warning] Tại sao ordinary curves an toàn hơn với MOV?
>
> Với ordinary curves, embedding degree $k$ thường cỡ $r$ (rất lớn) — tức là DLP trong $\mathbb{F}_{q^k}^*$ còn khó hơn ECDLP. Cụ thể, hầu hết random elliptic curves trên $\mathbb{F}_p$ có $k \approx p$, nên MOV attack hoàn toàn không hiệu quả.
>
> **Kết luận**: Supersingular curves **không được dùng** trong ECDH/ECDSA. Nhưng chính vì tính chất đặc biệt này (j-invariant trong $\mathbb{F}_{p^2}$, isogeny graph expander) mà chúng là nền tảng của isogeny-based crypto.

---

## 5. Supersingular Curves — Các Characterization Thực dụng

Cho mục đích implementation và CTF, hai characterization sau hữu ích nhất:

> [!info] Các Test Supersingularity Thực dụng
>
> **Test 1 (trên $\mathbb{F}_p$, $p > 3$)**: $E$ supersingular $\iff$ $\#E(\mathbb{F}_p) = p + 1$.
>
> **Test 2 (mọi trường hữu hạn)**: Tính $t = q + 1 - \#E(\mathbb{F}_q)$; $E$ supersingular $\iff p \mid t$.
>
> **Test 3 (qua j-invariant)**: Tính Hasse invariant — bằng $0$ khi supersingular. SageMath: `E.is_supersingular()`.
>
> **Test 4 (qua p-torsion)**: $E$ supersingular $\iff E[p](\bar{\mathbb{F}}_p) = \{\mathcal{O}\}$.
>
> [!example] Ví dụ 6.8 — Supersingular trên $\mathbb{F}_{11}$
>
> Xét $E: y^2 = x^3 + x$ trên $\mathbb{F}_{11}$.
>
> Đếm điểm: $\#E(\mathbb{F}_{11}) = 12 = 11 + 1$. Vậy $t = 0$ → **supersingular**. ✓
>
> Embedding degree: $r = 2 \mid 12$, cần $k$ nhỏ nhất sao cho $2 \mid 11^k - 1$. $11 \equiv 3 \pmod 4$, và $11^2 - 1 = 120 = 2^3 \cdot 3 \cdot 5$, nên $2 \mid 11^2 - 1$, tức $k = 2$.
>
> MOV sẽ giảm ECDLP trên $E(\mathbb{F}_{11})$ về DLP trong $\mathbb{F}_{11^2}^* = \mathbb{F}_{121}^*$.

---

## 6. Supersingular vs Ordinary — Bảng So sánh Toàn diện

| Tính chất | Ordinary | Supersingular |
|-----------|----------|---------------|
| $E[p]$ | $\cong \mathbb{Z}/p\mathbb{Z}$ | $= \{\mathcal{O}\}$ |
| $\text{End}^0(E)$ | Imaginary quadratic field | Quaternion algebra $B_{p,\infty}$ |
| Tính giao hoán của $\text{End}(E)$ | Commutative | Non-commutative |
| Trace $t$ | $p \nmid t$ | $p \mid t$ |
| j-invariant | Trong $\mathbb{F}_{q^r}$ tùy ý | Luôn trong $\mathbb{F}_{p^2}$ |
| Số j-invariants phân biệt | $\sim q$ | $\sim p/12$ (hữu hạn) |
| Embedding degree $k$ | Thường $k \sim r$ (lớn) | $k \leq 6$ (nhỏ) |
| MOV attack | Không hiệu quả | **Hiệu quả** — $k \leq 6$ |
| Isogeny graph | Volcano (có tầng) | Ramanujan expander (đồng đều) |
| Dùng trong ECC (ECDH/ECDSA) | ✓ An toàn | ✗ MOV-vulnerable |
| Dùng trong isogeny-based crypto | CSIDH | SIDH, SQISign |

---

## 7. Supersingular Isogeny Graph — Preview

Trên tập $S_p = \{j \in \mathbb{F}_{p^2} \mid j \text{ supersingular}\}$ (khoảng $p/12$ j-invariants), **$\ell$-isogeny graph supersingular** là:
- Đồ thị với đỉnh là các j-invariants trong $S_p$
- Mỗi đỉnh có đúng $\ell + 1$ cạnh (regular graph)
- Đồ thị là **Ramanujan graph** — bước ngẫu nhiên trên đồ thị này trộn đều rất nhanh

Tính chất Ramanujan là nền tảng của bảo mật SIDH (bài toán: cho $j_A$ và $j_B$ là các đỉnh, tìm đường đi isogeny giữa chúng). Sẽ phân tích kỹ ở Lesson 07.

---

## 8. SageMath — Phân loại và MOV Attack

```python
p = 101
F = GF(p)

ordinary = []
supersingular = []

for a in range(-5, 6):
    for b in range(-5, 6):
        try:
            E = EllipticCurve(F, [a, b])
            t = p + 1 - E.order()
            if t % p == 0:
                supersingular.append((a, b, E.j_invariant()))
            else:
                ordinary.append((a, b))
        except:
            pass

print(f"Supersingular (a,b,j): {supersingular[:3]}")
print(f"Total supersingular found: {len(supersingular)}")
```

```python
p = 113
F = GF(p)
E = EllipticCurve(F, [1, 0])

t = p + 1 - E.order()
print(f"t = {t}, p|t: {t % p == 0}")
print(f"is_supersingular: {E.is_supersingular()}")

r = 2
k = 1
while (p**k - 1) % r != 0:
    k += 1
print(f"Embedding degree k = {k}")
```

```python
p = 53
F = GF(p)
E = EllipticCurve(F, [1, 0])
print("Supersingular?", E.is_supersingular())
print("#E =", E.order(), "= p+1?", E.order() == p+1)

P = E.random_point()
while P.order() < 10:
    P = E.random_point()
n_secret = 7

Q = n_secret * P

Fext = GF(p**2)
Eext = E.base_extend(Fext)
Pext = Eext(P)
Qext = Eext(Q)

T = Eext.random_point()
while Eext.weil_pairing(Pext, T, P.order()) == Fext(1):
    T = Eext.random_point()

gP = Eext.weil_pairing(Pext, T, P.order())
gQ = Eext.weil_pairing(Qext, T, P.order())
print("gQ / gP =", gQ / gP, "(should relate to n =", n_secret, ")")
```

> [!tip] Pattern trong CTF — MOV Attack nhận dạng
> Nếu gặp ECDLP với đường cong có $\#E(\mathbb{F}_p) = p + 1$ hoặc $t = 0$ → ngay lập tức thử MOV:
> 1. Xác nhận supersingular: `E.is_supersingular()`
> 2. Tính embedding degree $k$ (thường $k = 2$)
> 3. Lift lên $E(\mathbb{F}_{p^k})$, chọn điểm $T$ ngẫu nhiên
> 4. Tính Weil pairing → DLP trong $\mathbb{F}_{p^k}^*$
> 5. Dùng `discrete_log()` của SageMath

---

## Tóm tắt

- **Supersingular**: $E[p] = \{\mathcal{O}\}$, $\text{End}^0 \cong B_{p,\infty}$ (non-commutative), $t \equiv 0 \pmod p$, $j \in \mathbb{F}_{p^2}$, embedding degree $k \leq 6$.
- **Ordinary**: $E[p] \cong \mathbb{Z}/p\mathbb{Z}$, $\text{End}^0 \cong K$ (imaginary quadratic, commutative), $p \nmid t$.
- Supersingular trên $\mathbb{F}_p$ (với $p > 3$): equivalently $t = 0$, tức $\#E = p + 1$.
- **MOV attack**: embedding degree nhỏ ($k \leq 6$) → giảm ECDLP về DLP trong $\mathbb{F}_{p^k}^*$ bằng Weil pairing → subexponential.
- Supersingular curves **không an toàn** cho ECC kinh điển, nhưng là nền tảng của isogeny-based crypto vì isogeny graph là Ramanujan expander.

---

## References

- Silverman, J.H. — *The Arithmetic of Elliptic Curves*, GTM 106, §V.3–4
- Sutherland, A. — *18.783 Elliptic Curves*, Lecture 13–14 (MIT OCW, 2025)
- Menezes, Okamoto, Vanstone — *Reducing elliptic curve logarithms to logarithms in a finite field*, IEEE Trans. Inf. Theory, 1993
- De Feo, L. — *Mathematics of Isogeny Based Cryptography*, arXiv:1711.04062, §3.2
- Galbraith, S. — *Supersingular Curves in Cryptography*, 2001 (math.auckland.ac.nz/~sgal018)
