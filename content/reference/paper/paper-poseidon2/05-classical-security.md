---
title: "05. Classical Security Analysis"
type: foundation
tags: [poseidon2, security, differential, linear, interpolation, groebner, lesson-05]
aliases: [Poseidon2 Security, Statistical Attacks, Algebraic Attacks]
source: "Poseidon2: A Faster Version of the Poseidon Hash Function — Grassi, Khovratovich, Schofnegger, AFRICACRYPT 2023"
created: 2026-03-15
---

> **Prerequisites**: Poseidon2_π permutation (xem [[04-poseidon2-permutation|04. Poseidon2 Permutation]]), branch number và $M_E$/$M_I$ (xem [[03-linear-layers-me-mi|03. Linear Layers]]), HADES design (xem [[02-poseidon-hades|02. Poseidon & HADES]])  
> 🔴 **Prerequisite references**: Daemen, Rijmen — *Wide Trail Design Strategy* [DR01] (wide trail cho statistical security); Faugère et al. — *Efficient Computation of Zero-Dimensional Gröbner Bases* [FGLM93] (Gröbner basis algorithms)  
> **Lesson type**: Foundation  
> **Covers**: §7.1 (Differential and Linear Attacks), §7.2 (Algebraic Attacks — Interpolation, Gröbner Basis), round number derivation logic
>
> **Notation** (bổ sung từ Lesson 04):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $\Delta_I, \Delta_O$ | Input/output difference trong differential attack | $\Delta_I, \Delta_O$ |
> | $\mathsf{DP}(f)$ | Differential probability của $f$ | $\mathsf{DP}$ |
> | $A_S$ | Số S-boxes active trong một differential trail | — |
> | $\deg(P_2)$ | Algebraic degree của permutation $P_2$ | $\deg$ |
> | CICO | Constrained-Input Constrained-Output problem | CICO |
> | $d_{\text{reg}}$ | Degree of regularity của hệ polynomial | $d_{\text{reg}}$ |
> | $R_F^{\min}$, $R_P^{\min}$ | Round numbers tối thiểu từ security estimate | — |

---

## Motivation

Thiết kế một hash function mới không đủ — phải chứng minh rằng nó **chống được** các tấn công đã biết. §7 của paper [GKS23] phân tích Poseidon2 trước ba lớp tấn công chính. Lesson này trình bày hai lớp đầu: **statistical attacks** (differential, linear) và **algebraic attacks** (interpolation, Gröbner basis). Lesson 06 sẽ trình bày lớp thứ ba — một algebraic attack mới được phát hiện sau khi Poseidon được publish.

---

## Lớp 1 — Statistical Attacks (§7.1)

### Differential Cryptanalysis

**Mô hình**: Attacker chọn input pair $(x, x')$ với $\Delta_I = x - x'$ (input difference), quan sát output difference $\Delta_O = P_2(x) - P_2(x')$, và cố tìm key (hay trong hash context: cố distinguish permutation khỏi random).

**Công cụ phân tích — Wide Trail Strategy** [DR01]: đếm số **active S-boxes** (S-boxes nhận non-zero difference) trong một differential trail qua toàn bộ permutation. Mỗi active S-box đóng góp xác suất differential tối đa $(\alpha - 1)/p$ (với $\alpha$-power S-box trên $\mathbb{F}_p$).

**Differential probability tổng**: nếu trail có $A_S$ active S-boxes:

$$
\mathsf{DP}(\text{trail}) \leq \left(\frac{\alpha - 1}{p}\right)^{A_S}
$$

Để trail không khả thi: $A_S \cdot \log_2\!\left(\frac{p}{\alpha-1}\right) \geq \lambda$.

### Lower bound trên số Active S-boxes của Poseidon2

> [!abstract] Claim 5.1 — Active S-boxes qua Full Rounds (GKS23, §7.1)
> Xét hai consecutive full rounds của Poseidon2_π. Với $M_E$ có branch number $B(M_E) = t/4 + 4$, số active S-boxes tối thiểu qua **hai consecutive full rounds** là:
>
> $$
> A_S^{(2)} \geq B(M_E) = \frac{t}{4} + 4
> $$
>
> Xét **ba cặp** (tức sáu consecutive full rounds), tổng active S-boxes:
>
> $$
> A_S^{(6)} \geq 3 \cdot \left(\frac{t}{4} + 4\right)
> $$
>
> Với $R_F = 8 \geq 6$, điều này đủ để đảm bảo:
>
> $$
> 3\left(\frac{t}{4} + 4\right) \cdot \log_2\!\left(\frac{p}{\alpha - 1}\right) \gg \lambda
> $$

**Tại sao $R_F = 6$ đủ nhưng dùng $R_F = 8$?** Security margin: $R_F = 8$ thay vì $R_F^{\min} = 6$ cho thêm 2 rounds buffer chống các variant attack chưa biết.

**Vai trò của partial rounds trong statistical security**: Partial rounds (chỉ 1 S-box) đóng góp ít active S-boxes hơn rất nhiều, nhưng điều này không quan trọng vì statistical security được đảm bảo hoàn toàn bởi full rounds ở đầu và cuối.

### Linear Cryptanalysis

**Mô hình**: Tìm linear approximation với bias cao — correlation giữa linear combination của input bits và output bits. Với field $\mathbb{F}_p$ (không phải binary), "linear" được hiểu là affine relations trên $\mathbb{F}_p$.

**Kết quả**: argument hoàn toàn tương tự differential — branch number $t/4 + 4$ và đủ full rounds cho phép bác bỏ mọi linear trail khả thi. Paper [GKS23, §7.1] khẳng định Poseidon2 đạt security tương đương Poseidon trước linear attacks do cùng cấu trúc HADES.

> [!tip] 💡 Agent note
> Sự khác biệt về branch number ($t/4+4$ so với $t+1$ của MDS đầy đủ) không ảnh hưởng đến kết luận bảo mật vì statistical analysis được thực hiện qua **cặp round**, không phải từng round. Ba cặp full rounds với branch number $t/4+4$ cho kết quả tương đương ba cặp với MDS đầy đủ ở một số tham số. Đây là điểm kỹ thuật quan trọng mà paper chứng minh cẩn thận trong §7.1.

---

## Lớp 2 — Algebraic Attacks (§7.2)

Đây là lớp tấn công đặc trưng nhất cho AO hash functions. Vì Poseidon2 hoạt động trên $\mathbb{F}_p$, toàn bộ permutation là một polynomial system — và kẻ tấn công có thể cố **giải system đó** để tìm preimage hay collision.

### 2a. Interpolation Attack

> [!info] 🟡 Interpolation Attack (theo [JK97]: Jakobsen, Knudsen — FSE 1997)
> Interpolation attack dựa trên việc biểu diễn toàn bộ cipher/permutation $P$ như một polynomial $P(x) = \sum_i a_i x^i$ trên $\mathbb{F}_p$. Nếu polynomial này có **bậc thấp** ($\deg(P) \ll p$), kẻ tấn công có thể nội suy $P$ từ ít input-output pairs và sau đó giải inverse.
>
> Với S-box $x^\alpha$ (bậc $\alpha$), sau $R$ rounds của $t$-phần tử state: bậc tối đa lý thuyết là $\alpha^R$. Tấn công khả thi khi $\alpha^R \ll p$, tức $R \ll n / \log_2 \alpha$.
>
> *(theo [JK97]: Jakobsen, Knudsen — The Interpolation Attack on Block Ciphers, FSE 1997)*

**Phòng thủ của Poseidon2**: Sau đủ partial rounds, bậc polynomial của $P_2$ tăng đến $\alpha^{R_P}$ (đóng góp từ $R_P$ S-boxes trong partial rounds). Yêu cầu:

$$
\alpha^{R_P} > p \quad \Leftrightarrow \quad R_P > \frac{n}{\log_2 \alpha}
$$

Đây là **điều kiện thứ nhất** để chọn $R_P$.

**Ví dụ**: Goldilocks ($n = 64$), $\alpha = 7$: $R_P > 64 / \log_2 7 \approx 64/2.807 \approx 22.8$ → $R_P = 22$ với safety margin.

### 2b. Gröbner Basis Attack

Gröbner basis (GB) attack là phương pháp mạnh hơn: thay vì nội suy một đa thức univariate, kẻ tấn công xây dựng hệ đa thức đa biến và giải bằng các thuật toán F4/F5.

**Mô hình CICO** (Constrained-Input Constrained-Output):

> [!note] Định nghĩa 5.2 — CICO Problem
> Cho permutation $P_2 : \mathbb{F}_p^t \to \mathbb{F}_p^t$. Bài toán CICO-$k$ là: cho $k$ output coordinates $O_1, \ldots, O_k$ cố định, tìm input $x$ sao cho $(P_2(x))_i = O_i$ với $i = 1, \ldots, k$.
>
> Với $k = d$ (digest length), CICO-$d$ tương đương preimage attack trên hash function.

**Chi phí của GB attack**: xấp xỉ $O\!\left(\binom{n_v + d_{\text{reg}}}{d_{\text{reg}}}^\omega\right)$ với $n_v$ = số biến, $d_{\text{reg}}$ = degree of regularity, $\omega \approx 2.37$ (exponent linear algebra). Complexity tăng theo số variables và degree → cần đủ rounds để degree của polynomial system đủ cao.

**Điều kiện an toàn**: Số S-boxes trong partial rounds (mỗi S-box thêm 1 variable trong mô hình equations) phải đủ lớn để $d_{\text{reg}}$ cao:

$$
R_P \geq 2\lambda / (\log_2(p) - \log_2(\alpha - 1) + 1)
$$

Đây là **điều kiện thứ hai** để chọn $R_P$.

**Thực nghiệm trong paper**: [GKS23] implement cả Poseidon và Poseidon2 trong SageMath và đo GB computation time với số rounds giảm dần. Kết quả: **thời gian giải GB của Poseidon2 tương đương Poseidon** — đổi linear layer không ảnh hưởng đến algebraic security. Điều này xác nhận có thể dùng cùng $R_P$ cho cả hai.

### Degree Growth và Monomial Count

Để đảm bảo both attacks fail, cần kiểm tra thực nghiệm rằng polynomial representation của $P_2$ **dense** (đạt số monomials tối đa):

$$
\#\text{monomials} = \binom{n_v + \alpha^{R_F + R_P}}{n_v} \quad \text{(theoretical max)}
$$

> [!abstract] Claim 5.3 — Degree Density (GKS23, §7.2 + Figure 2)
> Bằng thực nghiệm với SageMath (nhiều instantiations khác nhau), [GKS23] xác nhận: số monomials của Poseidon2_π đạt **maximum theoretical value** sau đủ rounds. Điều này áp dụng như nhau cho $M_E$/$M_I$ mới và MDS cũ — đổi linear layer không làm giảm polynomial density.

---

## Công thức Chọn Round Numbers

Kết hợp tất cả các điều kiện trên, [GKS23] chọn round numbers như sau:

$$
R_F = \max\left(6,\; R_F^{\text{stat}}\right) + 2 \quad \text{(+2 rounds safety margin)}
$$

$$
R_P = \max\left(R_P^{\text{interp}},\; R_P^{\text{GB}}\right) \cdot 1.075 \quad \text{(+7.5\% safety margin)}
$$

trong đó:
- $R_F^{\text{stat}}$ từ wide trail argument (§7.1): đủ full rounds để differential trail có $A_S \cdot \log(p/(\alpha-1)) \geq \lambda$
- $R_P^{\text{interp}}$ từ interpolation attack: $R_P > n/\log_2\alpha$
- $R_P^{\text{GB}}$ từ Gröbner basis estimate

**Tại sao $R_F = 8$?** $R_F^{\text{stat}} = 6$ + 2 rounds margin = 8. Áp dụng đồng nhất cho Poseidon và Poseidon2.

**Tại sao 7.5% margin cho $R_P$?** Gröbner basis complexity estimate có thể có error nhỏ do không có closed-form công thức chính xác. 7.5% extra rounds cung cấp buffer. (Lesson 06 sẽ giải thích tại sao con số này phải tăng khi $\lambda$ lớn.)

---

## Summary

| Loại tấn công | Phòng thủ trong Poseidon2 | Round number ảnh hưởng |
|--------------|--------------------------|----------------------|
| Differential/Linear | Wide trail qua $R_F$ full rounds, $B(M_E) = t/4+4$ | $R_F = 8$ ($R_F^{\min} = 6$ + margin) |
| Interpolation | Degree growth qua $R_P$ partial rounds: $\alpha^{R_P} > p$ | $R_P \geq n/\log_2\alpha$ |
| Gröbner basis | Số variables và degree đủ cao: thực nghiệm verify density | $R_P$ với 7.5% margin |

- **Thay $M_E$/$M_I$ không làm giảm security**: algebraic security không phụ thuộc linear layer; statistical security vẫn đủ với branch number $t/4+4$.
- **Round numbers bằng Poseidon**: mọi ước tính đều cho kết quả tương đương hoặc giống hệt Poseidon gốc.
- **Một lỗ hổng nhỏ** tồn tại trong Gröbner basis argument cho $\lambda \geq 384$ bit — đây là chủ đề của [[06-algebraic-attacks|06. Algebraic Attacks & Sauer Fix]].

---

## References

- [GKS23] Grassi, Khovratovich, Schofnegger — *Poseidon2*, AFRICACRYPT 2023
- [JK97] Jakobsen, Knudsen — *The Interpolation Attack on Block Ciphers*, FSE 1997 (🟡 Integrated)
- [DR01] Daemen, Rijmen — *The Wide Trail Design Strategy*, IMA Cryptography and Coding 2001 (🔴 Prerequisite)
- [FGLM93] Faugère, Gianni, Lazard, Mora — *Efficient Computation of Zero-Dimensional Gröbner Bases by Change of Ordering*, J. Symbolic Computation 1993 (🔴 Prerequisite)
- [ABM23] Ashur, Buschman, Mahzoun — *Algebraic Cryptanalysis of HADES*, ePrint 2023/537 (🟡 Integrated in Lesson 06)
