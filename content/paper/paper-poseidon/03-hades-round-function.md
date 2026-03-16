---
title: "03. HADES Design Strategy & Round Function"
type: deep-dive
tags: [poseidon, hades, round-function, s-box, mds-matrix, deep-dive, lesson-03]
aliases: [HADES Strategy, POSEIDON Round Function, POSEIDONpi]
source: "POSEIDON: A New Hash Function for Zero-Knowledge Proof Systems — Grassi, Khovratovich, Rechberger, Roy, Schofnegger, USENIX Security 2021"
created: 2026-03-15
---

> **Prerequisites**: [[01-zk-hash-motivation|01. ZK-Friendly Hash Functions]], [[02-sponge-construction|02. Sponge Construction]], linear algebra cơ bản (ma trận, không gian con), SPN (Substitution-Permutation Network)  
> 🔴 **Prerequisite references**: Grassi et al. — *HADES Design Strategy* [GLR+20] (wide trail strategy, partial SPN security proofs đầy đủ); Daemen, Rijmen — *AES Design* [DR02] (wide trail strategy gốc)  
> **Lesson type**: Deep Dive  
> **Covers**: §2.2, §2.2.1 (HADES Strategy, Figure 2), §2.2.2 (Round Function, S-Box Layer, Linear Layer, Avoiding Insecure Matrices, Algorithm 2), §2.2.3 (Interaction Between Full and Partial Rounds, Figure 3)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $s = (s_0, \ldots, s_{t-1}) \in \mathbb{F}_p^t$ | State vector | $x$ |
> | $R_f$ | Số full rounds ở một phía ($R_F = 2R_f$) | $R_f$ |
> | $R_P$ | Số partial rounds | $R_P$ |
> | $\mathbf{c}^{(r)} \in \mathbb{F}_p^t$ | Round constant vector tại round $r$ | $C$ |
> | $M \in \mathbb{F}_p^{t \times t}$ | MDS matrix (linear layer) | $M$ |
> | $\mathsf{S\text{-}box}(x) = x^\alpha$ | Power map S-box | $S$ |
> | $\alpha$ | S-box exponent: $\gcd(\alpha, p-1) = 1$ | $\alpha$ |
> | $\mathsf{ARC}$ | AddRoundConstants | — |
> | $\mathsf{SubWords}$ | S-box layer | — |
> | $\mathsf{MixLayer}$ | Linear layer (nhân với $M$) | — |

---

## Motivation: Từ SPN Đến HADES

Một **Substitution-Permutation Network (SPN)** cổ điển (ví dụ AES) áp dụng trong mỗi round:

$$
\text{Round}(s) = M \cdot \mathsf{SubBytes}(s + c)
$$

với $\mathsf{SubBytes}$ áp dụng S-box cho **toàn bộ** $t$ phần tử của state. Đây là "full S-box layer".

Vấn đề: trong ZK circuit, mỗi S-box $x^\alpha$ cần **ít nhất một phép nhân** (đối với $x^3$) hoặc nhiều hơn (đối với $x^5$). Nếu có $R_F \cdot t$ S-box, chi phí ZK tỉ lệ tuyến tính với $R_F \cdot t$. Để đủ bảo mật cần $R_F$ đủ lớn → chi phí cao.

**Quan sát then chốt**: các phép nhân trong S-box chủ yếu cần cho **bảo mật đại số** (tăng degree của polynomial), không phải tất cả đều cần thiết cho **bảo mật thống kê** (chống differential/linear attack). Ta có thể **giảm số S-box** ở các round giữa mà không mất bảo mật thống kê nếu có đủ full rounds ở đầu và cuối.

Đây chính là ý tưởng của **HADES design strategy**.

---

## Cấu Trúc HADES (§2.2.1)

> [!info] 🟡 HADES Design Strategy (từ [GLR+20])
> HADES chia $R = R_F + R_P$ rounds thành ba phase (Figure 2):
>
> - **Phase 1**: $R_f = R_F/2$ full rounds — S-box áp lên tất cả $t$ phần tử.
> - **Phase 2**: $R_P$ partial rounds — S-box chỉ áp lên **một phần tử** (thường phần tử đầu $s_0$), các phần tử còn lại đi qua identity.
> - **Phase 3**: $R_f = R_F/2$ full rounds — như Phase 1.
>
> **Lý do bảo mật** (wide trail argument):  
> — Full rounds ở Phase 1 và 3 đảm bảo **bảo mật thống kê** (differential + linear cryptanalysis): mọi differential trail phải đi qua đủ S-box active trong các full rounds → probability cực nhỏ.  
> — Partial rounds ở Phase 2 đảm bảo **bảo mật đại số** (interpolation, Gröbner basis): degree của multivariate polynomial mô tả permutation tăng qua mỗi round → degree $\alpha^{R_F + R_P}$ đủ lớn để interpolation không khả thi.  
>
> *(theo [GLR+20]: Grassi et al. — HADES Design Strategy, EUROCRYPT 2020)*

```mermaid
graph LR
    IN[Input s] --> F1[Full Round 1]
    F1 --> FRF[... Rf full rounds]
    FRF --> P1[Partial Round 1]
    P1 --> PRP[... RP partial rounds]
    PRP --> FF1[Full Round 1]
    FF1 --> FFR[... Rf full rounds]
    FFR --> OUT[Output]
```

**Tại sao không chỉ dùng partial rounds?** Vì partial rounds thiếu đủ non-linearity để chống statistical attacks — cần full rounds bao quanh để "khuếch tán" đủ.

**Tại sao không chỉ dùng full rounds?** Quá đắt. $R_P$ partial rounds giúp tăng degree nhanh chóng với chi phí thấp hơn $R_P$ full rounds.

---

## Round Function Chi Tiết (§2.2.2)

Mỗi round trong $\mathsf{POSEIDON}^\pi$ gồm **ba bước** theo đúng thứ tự:

$$
\text{Round}_r(s) = \mathsf{MixLayer}\bigl(\mathsf{SubWords}(\mathsf{ARC}(s, r))\bigr)
$$

> [!note] Scheme 3.1 — POSEIDONπ Permutation
> **Type**: Permutation (bijection) trên $\mathbb{F}_p^t$  
> **Setting**: State $s \in \mathbb{F}_p^t$; round constants $\mathbf{c}^{(0)}, \ldots, \mathbf{c}^{(R-1)} \in \mathbb{F}_p^t$; MDS matrix $M \in \mathbb{F}_p^{t \times t}$; S-box $\mathsf{S}(x) = x^\alpha$; tham số $(t, R_F, R_P, \alpha)$.
>
> **$\mathsf{POSEIDON}^\pi(s)$**
> - Input: $s = (s_0, \ldots, s_{t-1}) \in \mathbb{F}_p^t$
> - Giai đoạn 1 — $R_f$ full rounds: Với $r = 0, \ldots, R_f - 1$:
>   - $s \leftarrow s + \mathbf{c}^{(r)}$ (AddRoundConstants)
>   - $s \leftarrow (s_0^\alpha, s_1^\alpha, \ldots, s_{t-1}^\alpha)$ (SubWords — full)
>   - $s \leftarrow M \cdot s$ (MixLayer)
> - Giai đoạn 2 — $R_P$ partial rounds: Với $r = R_f, \ldots, R_f + R_P - 1$:
>   - $s \leftarrow s + \mathbf{c}^{(r)}$ (AddRoundConstants)
>   - $s \leftarrow (s_0^\alpha, s_1, s_2, \ldots, s_{t-1})$ (SubWords — partial: chỉ $s_0$)
>   - $s \leftarrow M \cdot s$ (MixLayer)
> - Giai đoạn 3 — $R_f$ full rounds: Tương tự giai đoạn 1
> - Output: $s \in \mathbb{F}_p^t$

### Bước 1: AddRoundConstants (ARC)

$$
\mathsf{ARC}(s, r) = s + \mathbf{c}^{(r)}
$$

Round constants $\mathbf{c}^{(r)}$ được sinh từ **Grain LFSR** (một stream cipher đơn giản) để đảm bảo tính **NUMS (Nothing-Up-My-Sleeve)** — không có "backdoor" ẩn trong constants. Xem chi tiết trong [[a0-implementation|A0. Implementation & Constants]].

**Mục đích**: phá vỡ tính đối xứng giữa các round, ngăn các symmetry-based attack.

### Bước 2: SubWords (S-box Layer)

**Full S-box layer** (dùng trong Phase 1 và 3):

$$
\mathsf{SubWords}(s) = (s_0^\alpha, s_1^\alpha, \ldots, s_{t-1}^\alpha)
$$

**Partial S-box layer** (dùng trong Phase 2):

$$
\mathsf{SubWords}(s) = (s_0^\alpha, s_1, s_2, \ldots, s_{t-1})
$$

**Chọn $\alpha$**: $\alpha$ là **số nguyên dương nhỏ nhất $\geq 3$** sao cho $\gcd(\alpha, p-1) = 1$. Điều kiện này đảm bảo $x \mapsto x^\alpha$ là **bijection** trên $\mathbb{F}_p^*$ (có inverse $x \mapsto x^{\alpha^{-1} \bmod (p-1)}$).

> [!example] Chọn $\alpha$ theo đặc điểm của $p$
> - Nếu $p \not\equiv 1 \pmod{3}$: dùng $\alpha = 3$ ($x^3$-POSEIDON). VD: BN254.
> - Nếu $p \equiv 1 \pmod{3}$ nhưng $p \not\equiv 1 \pmod{5}$: dùng $\alpha = 5$ ($x^5$-POSEIDON). VD: BLS12-381, Ed25519.
> - Với BLS12-381: $p \equiv 1 \pmod{3}$ nên $\gcd(3, p-1) = 3 \neq 1$ → $\alpha = 5$.

> [!warning] Tại sao không dùng $\alpha = 2$?
> $x^2$ **không phải bijection**: với $p$ lẻ, $(-x)^2 = x^2$, nên $x$ và $-x$ cho cùng kết quả. Hàm không có inverse duy nhất → không thể dùng làm S-box của permutation.

### Bước 3: MixLayer (Linear Layer)

$$
\mathsf{MixLayer}(s) = M \cdot s
$$

với $M \in \mathbb{F}_p^{t \times t}$ là **MDS matrix** (Maximum Distance Separable).

> [!note] Định nghĩa MDS Matrix
> Ma trận $M \in \mathbb{F}_p^{t \times t}$ là **MDS** nếu và chỉ nếu mọi submatrix vuông của $M$ (lấy từ bất kỳ $k$ hàng và $k$ cột nào) đều là non-singular (khả nghịch), với mọi $k \in \{1, \ldots, t\}$.
>
> Điều này tương đương với: mọi **branch number** của $M$ bằng $t + 1$ (tối đa có thể). Branch number là số phần tử non-zero tối thiểu trong $(s, M \cdot s)$ với $s \neq 0$.

**Tại sao cần MDS?** Trong tấn công differential, ta theo dõi số lượng S-box "active" (có input difference $\neq 0$) theo các round. MDS đảm bảo rằng sau một round với $k$ active S-box trước MixLayer, số active S-box sau MixLayer là $\geq t + 1 - k$. Điều này tạo ra **active S-box count tăng nhanh** qua các full rounds, khiến differential probability tổng trở nên negligible.

#### Tạo MDS Matrix và Tránh Ma Trận Không An Toàn (Algorithm 2)

Không phải MDS matrix nào cũng an toàn cho POSEIDON. Một ma trận có thể là MDS nhưng vẫn cho phép thiết lập **invariant subspace trails** — một loại trail mà các differences không bao giờ "rời bỏ" một không gian con, ngay cả qua vô số rounds.

> [!note] Scheme 3.2 — Kiểm Tra Ma Trận An Toàn (Algorithm 2)
> **Type**: Algorithm kiểm tra tính an toàn của MDS matrix  
> **Setting**: MDS matrix $M \in \mathbb{F}_p^{t \times t}$; search period $l$
>
> **$\mathsf{CheckMatrix}(M, l)$**
> - Input: Ma trận $M$, chu kỳ kiểm tra $l = 4t$
> - Step 1: Tính $M^1, M^2, \ldots, M^l$
> - Step 2: Với mỗi $M^i$ ($i = 1, \ldots, l$): kiểm tra rằng không tồn tại **invariant subspace trail** dài vô hạn với active S-boxes chỉ tại vị trí 0 (vị trí partial S-box).  
>   Cụ thể: không tồn tại không gian con $V \subset \mathbb{F}_p^t$ sao cho $M \cdot V \subseteq V$ và $V$ chứa vector với tọa độ 0 tại vị trí 0.
> - Step 3: Nếu tồn tại trail như vậy → reject, sinh ma trận khác.
> - Output: ACCEPT nếu không có trail; REJECT nếu có.

**Cách sinh MDS matrix trong thực tế**: Paper đề xuất dùng **Cauchy matrix**:

$$
M_{i,j} = \frac{1}{x_i + y_j}, \quad x_i, y_j \in \mathbb{F}_p \text{ phân biệt}, \quad \{x_i\} \cap \{y_j\} = \emptyset
$$

Cauchy matrices tự động là MDS, sau đó chạy Algorithm 2 để xác nhận không có invariant subspace vulnerability. Trong thực nghiệm, chỉ cần vài lần thử để tìm được ma trận hợp lệ.

---

## Tương Tác Giữa Full Và Partial Rounds (§2.2.3)

Đây là insight trung tâm của thiết kế POSEIDON:

> [!abstract] Claim 3.3 — Degree Growth
> Sau $R_F + R_P$ rounds của $\mathsf{POSEIDON}^\pi$:
> - **Degree tổng** của permutation (như multivariate polynomial) là $\alpha^{R_F + R_P}$.
> - Partial rounds đóng góp vào degree growth **gần bằng** full rounds nhưng với chi phí ZK thấp hơn $t$ lần.

**Intuition**: Mỗi S-box $x^\alpha$ tăng degree lên $\alpha$ lần. Với partial round, chỉ một phần tử tăng degree, nhưng sau khi qua MixLayer (ma trận MDS đầy đủ), degree "lan ra" toàn bộ $t$ phần tử. Sau đủ rounds, toàn bộ state có degree cao.

> [!info] 🟡 Wide Trail Argument (từ [GLR+20])
> Wide trail strategy (Daemen-Rijmen, gốc trong AES [DR02]) chứng minh rằng với đủ full rounds và MDS matrix, mọi differential/linear trail phải có ít nhất $R_F \cdot \text{branch\_number}$ active S-boxes. Trong HADES, chỉ có $R_F$ full rounds (không phải $R_F + R_P$) đóng góp vào bound này — đây là lý do cần $R_F \geq 6$ làm điều kiện tối thiểu. Partial rounds không đóng góp vào statistical bound nhưng bù lại bằng algebraic bound.
>
> *(theo [GLR+20] §4, dùng lại trong POSEIDON §2.2.3)*

**Bảng tóm tắt chi phí**:

| Round type | S-box count/round | Đóng góp cho | Chi phí R1CS/round |
|-----------|------------------|-------------|-------------------|
| Full round | $t$ S-boxes | Statistical + algebraic security | $t \cdot \lceil \log_2 \alpha \rceil$ constraints |
| Partial round | $1$ S-box | Algebraic security (degree) | $\lceil \log_2 \alpha \rceil$ constraints |

Với $t = 3$ và $\alpha = 5$: full round tốn 3 constraints, partial round tốn 1 constraint (giảm 3×).

---

## Summary

- $\mathsf{POSEIDON}^\pi$ = $R_f$ full rounds + $R_P$ partial rounds + $R_f$ full rounds (HADES structure).
- Mỗi round: **ARC** (add constants) → **SubWords** ($x^\alpha$ trên một hoặc tất cả elements) → **MixLayer** (nhân với MDS matrix).
- **Full rounds** đảm bảo bảo mật thống kê qua wide trail argument [GLR+20]; yêu cầu $R_F \geq 6$.
- **Partial rounds** đảm bảo bảo mật đại số qua degree growth; rẻ hơn full rounds $t$ lần.
- **MDS matrix** phải qua Algorithm 2 để loại bỏ invariant subspace vulnerabilities.
- **S-box $x^\alpha$**: $\alpha$ nhỏ nhất với $\gcd(\alpha, p-1) = 1$; thường $\alpha = 3$ hoặc $\alpha = 5$.

---

## References

- [GLR+20] Grassi, Lüftenegger, Rechberger, Rotaru, Schofnegger — *On a Generalization of Substitution-Permutation Networks: The HADES Design Strategy*, EUROCRYPT 2020 (🟡 Integrate — wide trail argument, HADES structure)
- [DR02] Daemen, Rijmen — *The Design of Rijndael: AES — The Advanced Encryption Standard*, Springer 2002 (🔴 Prerequisite — wide trail strategy gốc)
- [Grassi+21] Grassi et al. — *POSEIDON*, USENIX Security 2021 — §2.2 (nguồn chính bài này)
