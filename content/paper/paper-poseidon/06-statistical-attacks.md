---
title: "06. Statistical Attacks on POSEIDON"
type: attack
tags: [poseidon, cryptanalysis, differential, linear, invariant-subspace, attack, lesson-06]
aliases: [Statistical Attacks POSEIDON, Differential Linear Cryptanalysis]
source: "POSEIDON: A New Hash Function for Zero-Knowledge Proof Systems — Grassi, Khovratovich, Rechberger, Roy, Schofnegger, USENIX Security 2021"
created: 2026-03-15
---

> **Prerequisites**: [[03-hades-round-function|03. HADES & Round Function]], [[04-instantiations-parameters|04. Instantiations & Parameters]], differential cryptanalysis và linear cryptanalysis ở mức cơ bản  
> 🔴 **Prerequisite references**: Daemen, Rijmen — *The Design of Rijndael* [DR02] (wide trail strategy, differential/linear framework); Grassi et al. — *HADES* [GLR+20] (invariant subspace trail theory)  
> **Lesson type**: Attack  
> **Covers**: §5.1 (Statistical Attacks: Linear Cryptanalysis, Rebound Attacks, Invariant Subspace Attack)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $\Delta$ | Difference (XOR hoặc additive) | $\Delta$ |
> | $\Delta_{\text{in}}, \Delta_{\text{out}}$ | Input/output difference của trail | — |
> | $\text{DP}^f(\Delta_{\text{in}}, \Delta_{\text{out}})$ | Differential probability của $f$ | DP |
> | $\text{LP}^f(a, b)$ | Linear probability của $f$ | LP |
> | $\mathcal{B}$ | Branch number của MDS matrix | $\mathcal{B}$ |
> | $V_i$ | Subspace tại bước $i$ trong subspace trail | $V_i$ |
> | $\mathsf{AS}$ | Active S-box count | — |

---

## Tổng Quan: Statistical Attacks là Gì?

**Statistical attacks** (tấn công thống kê) khai thác các **non-random statistical patterns** trong hành vi của một cipher/permutation:

- **Differential cryptanalysis**: theo dõi sự *truyền lan của difference* $(x \oplus x')$ qua các round.
- **Linear cryptanalysis**: tìm *linear approximation* xấp xỉ hành vi của cipher.
- **Invariant subspace attacks**: tìm *không gian con bất biến* mà permutation không thoát ra khỏi.

Với POSEIDON trên $\mathbb{F}_p$ (prime field), "XOR" được thay bằng **phép trừ** trong $\mathbb{F}_p$: $\Delta = x - x' \in \mathbb{F}_p$.

Mục tiêu chứng minh bảo mật: **không có statistical attack nào với complexity $< 2^M$** (trong đó $M$ là security level).

---

## 1. Tấn Công Linear Cryptanalysis (§5.1)

### Bối Cảnh và Mô Hình Đe Dọa

**Linear cryptanalysis** (Matsui 1993, ban đầu cho DES) tìm biểu thức tuyến tính:

$$
a \cdot s_{\text{in}} \oplus b \cdot s_{\text{out}} = 0
$$

sao cho xác suất đúng lệch đáng kể so với $1/2$ (đối với block cipher) hoặc correlation $\neq 0$ (đối với permutation).

Trên $\mathbb{F}_p$, tấn công này tìm **linear approximation** của dạng:

$$
\sum_i a_i s_{\text{in}, i} + \sum_j b_j s_{\text{out}, j} = 0 \pmod{p}
$$

với $a_i, b_j \in \mathbb{F}_p$, sao cho correlation $\epsilon = \Pr[\text{equation holds}] - 1/p$ lớn.

### Tại Sao POSEIDON Kháng?

> [!abstract] Claim 6.1 — Linear Security
> Mọi **linear trail** qua $\mathsf{POSEIDON}^\pi$ có correlation:
>
> $$
> |\epsilon_{\text{trail}}| \leq \prod_{i \in \text{active S-boxes}} \max_{\text{mask}} \text{LP}^{S}(a_i, b_i)
> $$
>
> Với S-box $S(x) = x^\alpha$ và sufficient active S-boxes, correlation tổng $< 2^{-M}$.

**Proof sketch**:

Phân tích hai thành phần:

1. **Linear correlation của S-box $x^\alpha$**: Với power map trên $\mathbb{F}_p$, correlation của bất kỳ linear mask nào là $O(p^{-1/2})$ theo ước lượng Weil (tổng character). Cụ thể:

$$
\text{LP}^{x^\alpha}(a, b) = \left| \frac{1}{p} \sum_{x \in \mathbb{F}_p} \chi(a x - b x^\alpha) \right|^2 \leq \frac{(\alpha - 1)^2}{p}
$$

trong đó $\chi$ là additive character của $\mathbb{F}_p$.

2. **Active S-box count**: Từ wide trail argument và MDS matrix với branch number $\mathcal{B} = t + 1$: mọi linear trail qua $R_F$ full rounds có ít nhất $\mathcal{B} \cdot \lfloor R_F/2 \rfloor$ active S-boxes.

Kết hợp: với $R_F = 8$, $t = 3$, $\mathcal{B} = 4$: active S-boxes $\geq 4 \cdot 4 = 16$. Mỗi S-box đóng góp correlation $\leq (\alpha-1)^2 / p \approx 16/2^{255}$. Tổng correlation:

$$
|\epsilon| \leq \left(\frac{16}{2^{255}}\right)^{16/2} \approx 2^{-2000} \ll 2^{-128}
$$

$\blacksquare$

> [!tip] 💡 Agent note
> Phân tích linear correlation cho power maps sử dụng **character sum bounds** (Weil/Deligne). Đây là kỹ thuật tiêu chuẩn trong cryptanalysis trên prime fields nhưng khác với phân tích AES trên binary fields. Trên $\mathbb{F}_2^n$, dùng Walsh-Hadamard transform; trên $\mathbb{F}_p$, dùng exponential sums.

---

## 2. Tấn Công Rebound (Differential Cryptanalysis) (§5.1)

### Bối Cảnh và Mô Hình Đe Dọa

**Differential cryptanalysis** theo dõi *differential trail*: cặp $(s, s')$ với $\Delta = s - s'$ có xác suất cao đi qua nhiều rounds. Mục tiêu: tìm trail $(\Delta_{\text{in}}, \Delta_{\text{out}})$ với probability $\geq 2^{-M}$.

**Rebound attacks** (Mendel, Rechberger, et al.) là kỹ thuật meet-in-the-middle cho differential: chia permutation thành phần inbound (giữa) và outbound (hai phía), exploit differential tự do ở phần inbound.

### Tại Sao POSEIDON Kháng?

> [!abstract] Claim 6.2 — Differential Security
> Mọi differential trail qua $R_F$ full rounds của $\mathsf{POSEIDON}^\pi$ có differential probability:
>
> $$
> \text{DP}_{\text{trail}} \leq \left(\frac{\alpha - 1}{p}\right)^{\mathsf{AS}}
> $$
>
> trong đó $\mathsf{AS}$ là số active S-boxes.  
> Với $\mathsf{AS} \geq (t+1) \cdot \lfloor R_F / 2 \rfloor$ và $R_F \geq 6$: $\text{DP}_{\text{trail}} < 2^{-M}$.

**Proof sketch**:

S-box $S(x) = x^\alpha$ trên $\mathbb{F}_p$ có **differential probability**:

$$
\text{DP}^S(\delta, \delta') = \frac{\#\{x : (x+\delta)^\alpha - x^\alpha = \delta'\}}{p} \leq \frac{\alpha - 1}{p}
$$

Điều này theo từ tính chất của polynomial maps: phương trình $(x+\delta)^\alpha - x^\alpha = \delta'$ (với $\delta \neq 0$) là polynomial bậc $\alpha - 1$ trong $x$ → có nhiều nhất $\alpha - 1$ nghiệm.

MDS matrix với $\mathcal{B} = t+1$ đảm bảo: nếu $k$ coordinates của $\Delta$ non-zero trước MixLayer, thì $\geq t+1-k$ coordinates của $M \cdot \Delta$ non-zero. Điều này buộc số active S-boxes tăng theo từng round.

Với $R_F = 8$ full rounds, $\mathcal{B} = t+1$: số active S-boxes tối thiểu là:

$$
\mathsf{AS} \geq 2 \cdot \mathcal{B} \cdot \lfloor R_F / 4 \rfloor = 2(t+1) \cdot 2 = 4(t+1)
$$

Với $t = 3$: $\mathsf{AS} \geq 16$; DP $\leq ((5-1)/2^{255})^{16} = (4/2^{255})^{16} \approx 2^{-2032} \ll 2^{-128}$. $\blacksquare$

> [!warning] Rebound attack không áp dụng được vì sao?
> Rebound attacks cần phần "inbound" có đủ degrees of freedom để set differential tự do. Trong POSEIDON, **partial rounds ở giữa** chỉ có **một active S-box** mỗi round → ít degrees of freedom. Phần inbound không đủ để exploit. Và hai đầu full rounds đã đủ để loại bỏ bất kỳ trail có probability cao.

---

## 3. Invariant Subspace Attack (§5.1)

### Bối Cảnh và Mô Hình Đe Dọa

**Invariant subspace attack** (Leander, Minaud, Rønjom 2015, ban đầu cho Prince và các cipher với weak linear layers): tìm không gian con $V \subset \mathbb{F}_p^t$ sao cho:

$$
\mathsf{Round}(V + c) \subseteq V + c'
$$

cho hằng số $c, c'$ phù hợp (coset structure). Nếu tồn tại, toàn bộ permutation có thể bị tấn công vì differences không bao giờ "thoát ra" khỏi $V$.

Trong ngữ cảnh POSEIDON: tấn công tìm không gian con $V$ sao cho mọi **subspace trail** qua partial rounds không bao giờ kích hoạt S-box → permutation trên coset này về bản chất là **tuyến tính**.

### Formal Definition — Subspace Trail

> [!note] Định Nghĩa 6.3 — Invariant Subspace Trail (từ [GLR+20])
> Một **subspace trail** với length $\ell$ là chuỗi:
>
> $$
> V_0 \xrightarrow{\text{Round}} V_1 \xrightarrow{\text{Round}} \cdots \xrightarrow{\text{Round}} V_\ell
> $$
>
> sao cho $\mathsf{Round}(a + V_i) \subseteq a' + V_{i+1}$ với hằng số $a, a'$.
>
> Một trail là **dangerous** nếu:
> - $\dim(V_0) \geq 1$, và
> - Tất cả S-boxes trong mọi round đều **inactive** (input difference luôn nằm trong kernel của S-box layer).
>
> *(theo [GLR+20] §3, dùng lại trong POSEIDON §5.1)*

**Khi nào S-box inactive?** S-box $x^\alpha$ tại vị trí $j$ inactive khi $v_j = 0$ cho mọi $v \in V_i$ (tức là $j$-th coordinate của tất cả vectors trong subspace đều zero).

### Điều Kiện Để POSEIDON An Toàn

Trong partial rounds, chỉ có S-box tại vị trí 0 ($s_0$). Một subspace trail dài vô hạn tồn tại khi và chỉ khi:

$$
\dim(\mathcal{S}(i)) \geq t - i \quad \text{với } \mathcal{S}(i) = \{v \in \mathbb{F}_p^t : [M \cdot v]_0 = [M^2 \cdot v]_0 = \cdots = [M^i \cdot v]_0 = 0\}
$$

Nghĩa là: nếu tồn tại không gian con "tránh" được S-box qua $i$ ứng dụng liên tiếp của $M$, thì trail có độ dài $\geq i$.

> [!abstract] Claim 6.4 — Invariant Subspace Security
> $\mathsf{POSEIDON}^\pi$ kháng invariant subspace attack nếu không có subspace trail dài vô hạn, tức là không tồn tại $V \neq \{0\}$ với $\dim(\mathcal{S}(i)) < t - i$ với mọi $i \geq 1$.

**Mitigation thực tế — Algorithm 2** (xem [[03-hades-round-function|Lesson 03]]): kiểm tra $M, M^2, \ldots, M^{4t}$ để đảm bảo không có trail dài vô hạn. Điều này được thực hiện trong quá trình **sinh MDS matrix** — chỉ accept matrix qua Algorithm 2.

> [!success] Kết quả thực nghiệm
> Paper báo cáo: với cách sinh Cauchy matrix ngẫu nhiên và kiểm tra Algorithm 2, chỉ cần **một vài lần thử** là tìm được matrix an toàn. Không có vấn đề "khan hiếm" matrix tốt.

---

## Tổng Hợp: Tại Sao $R_F \geq 6$ là Đủ

Bảng tóm tắt liên kết giữa $R_F$, active S-boxes, và các statistical bounds:

| Attack | Bound cần | Với $R_F = 6$, $t = 3$ | Với $R_F = 8$, $t = 3$ |
|--------|-----------|----------------------|----------------------|
| Linear | $\mathsf{AS} \geq M \cdot \log_p(p/(\alpha-1))$ | $\mathsf{AS} \geq 12$ | $\mathsf{AS} \geq 16$ |
| Differential | $\mathsf{AS} \geq M / \log_p(p/(\alpha-1))$ | $\mathsf{AS} \geq 12$ | $\mathsf{AS} \geq 16$ |
| Inv. Subspace | Không có vô hạn trail | Đảm bảo bởi Alg. 2 | Đảm bảo bởi Alg. 2 |

Với $\alpha = 5$, $p \approx 2^{255}$: mỗi active S-box đóng góp ~253 bits bảo mật. Với $\mathsf{AS} = 16$: margin $\gg 128$ bits.

> [!info] 🟡 MARVELlous/Rescue và Rebound (từ [ACD+19])
> Albrecht et al. [ACD+19] đã tấn công Rescue và các instantiation của MARVELlous bằng cách khai thác S-box bậc cao **xen kẽ** $x^\alpha / x^{1/\alpha}$ — tấn công này đặc biệt hiệu quả với algebraic attacks (xem [[07-algebraic-attacks|Lesson 07]]). Kết quả này là một trong những lý do POSEIDON **không dùng inverse S-box**, mà chỉ dùng power map $x^\alpha$.
>
> *(theo [ACD+19]: Albrecht, Cid, Grassi et al. — Algebraic Cryptanalysis of STARK-Friendly Designs, ASIACRYPT 2019)*

---

## Summary

- **Linear cryptanalysis**: correlation per S-box = $O((\alpha-1)^2/p)$; với $\mathsf{AS} \geq 16$ qua $R_F = 8$ full rounds → tổng correlation $\ll 2^{-128}$.
- **Differential cryptanalysis (rebound)**: DP per S-box $\leq (\alpha-1)/p$; MDS branch number $\mathcal{B} = t+1$ buộc $\mathsf{AS}$ tăng nhanh → DP tổng $\ll 2^{-128}$.
- **Invariant subspace attack**: nguy hiểm nếu MDS matrix cho phép subspace trail dài vô hạn → mitigate bằng Algorithm 2 khi sinh matrix.
- **Kết luận**: $R_F \geq 6$ đủ cho tất cả statistical attacks; paper dùng $R_F = 8$ làm margin.
- Partial rounds ($R_P$) **không đóng góp** vào statistical security bounds — chúng phục vụ cho algebraic security (xem [[07-algebraic-attacks|Lesson 07]]).

---

## References

- [DR02] Daemen, Rijmen — *The Design of Rijndael*, Springer 2002 (🔴 Prerequisite — wide trail strategy, differential/linear framework)
- [GLR+20] Grassi et al. — *HADES Design Strategy*, EUROCRYPT 2020 (🟡 Integrate — invariant subspace trail theory, active S-box bounds)
- [ACD+19] Albrecht, Cid, Grassi et al. — *Algebraic Cryptanalysis of MARVELlous and MiMC*, ASIACRYPT 2019 (🟡 Integrate — rebound context, motivation cho no-inverse-S-box decision)
- [Grassi+21] Grassi et al. — *POSEIDON*, USENIX Security 2021 — §5.1 (nguồn chính bài này)
