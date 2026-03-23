---
title: "04. Security Analysis — Algebraic Attacks"
type: attack
tags: [mimc, interpolation-attack, gcd-attack, cryptanalysis, algebraic-attacks, lesson-04]
aliases: [MiMC Algebraic Attacks, Interpolation Attack MiMC, GCD Attack MiMC]
source: "MiMC: Efficient Encryption and Cryptographic Hashing with Minimal Multiplicative Complexity — Albrecht, Grassi, Rechberger, Roy, Tiessen, ASIACRYPT 2016"
created: 2026-03-15
---

> **Prerequisites**: [[02-mimc-block-cipher|02. MiMC Block Cipher]], Lagrange interpolation (polynomial reconstruction), GCD of polynomials, Fermat's little theorem  
> 🔴 **Prerequisite references**: Stoss — *Complexity of evaluating interpolation polynomials* [Sto85]; HAC §14 (polynomial algorithms) [MVO96]  
> **Lesson type**: Attack  
> **Covers**: §4.2 — Interpolation attack, GCD attack, Invariant subfield attack; và toàn bộ logic dẫn đến round count $r = \lceil n/\log_2 3 \rceil$ (MiMC-n/n) và $r = 2\lceil n/\log_2 3 \rceil$ (MiMC-2n/n)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $E_k : \mathbb{F}_{2^n} \to \mathbb{F}_{2^n}$ | Encryption function | $E_k$ |
> | $P(x) \in \mathbb{F}_{2^n}[x]$ | Interpolation polynomial đại diện $E_k(x)$ | $P(x)$ |
> | $d$ | Degree của interpolation polynomial | $d$ |
> | $r$ | Số rounds | $r$ |
> | $r_{\max}$ | Số rounds tối thiểu để chặn interpolation attack | $r_{\max}$ |
> | $E(K, x)$ | Encryption của $x$ với key biến $K$ (polynomial trong $K$) | $E(K,x)$ |
> | $(x_i, y_i)$ | Plaintext-ciphertext pair thứ $i$ với $y_i = E_k(x_i)$ | $(x_i, y_i)$ |
> | $\omega$ | Linear algebra constant trong complexity (set $\omega = 2$) | $\omega$ |

---

## Context và Threat Model

MiMC dựa trên một round function đại số cực đơn giản — $F(x) = x^3$. Điều này dẫn đến mối lo ngại tự nhiên: **liệu cấu trúc đại số có thể bị khai thác để break cipher không?**

Paper xác định rằng các **tấn công đại số** là mối đe dọa chính với MiMC. Cụ thể, sau $r$ rounds, encryption function $E_k(x)$ là một polynomial bậc $3^r$ trong $x$ — nếu bậc này đủ nhỏ, adversary có thể tái tạo lại polynomial và giải mã bất kỳ ciphertext nào mà không cần biết key. Số rounds của MiMC được chọn chính xác để thặt chặn các tấn công này.

**Threat model**: Known-Plaintext Attack (KPA) hoặc Chosen-Plaintext Attack (CPA). Adversary có $d+1$ cặp $(x_i, E_k(x_i))$ và muốn hoặc (a) tái tạo polynomial $E_k$ để decrypt arbitrary ciphertext, hoặc (b) recover key $k$.

---

## Tấn công 1: Interpolation Attack

### Ý tưởng

> [!info] 🟡 Interpolation Attack [JK97]
> Jakobsen và Knudsen (FSE 1997) đề xuất: nếu encryption function $E_k : \mathbb{F}_{2^n} \to \mathbb{F}_{2^n}$ có thể biểu diễn bởi một polynomial $P(x)$ bậc $d$ nhỏ, adversary có thể tái tạo $P(x)$ từ $d+1$ cặp plaintext-ciphertext bằng **Lagrange interpolation**:
>
> $$
> P(x) = \sum_{i=1}^{d} y_i \prod_{\substack{1 \le j \le d \\ j \neq i}} \frac{x - x_j}{x_i - x_j}
> $$
>
> với $E_k(x_i) = y_i$. Complexity xây dựng polynomial bậc $d$: $O(d \log d)$ [Sto85]. Sau khi có $P(x)$, mọi ciphertext đều có thể decrypt mà không cần key $k$.
>
> *(theo [JK97]: Jakobsen, Knudsen — The interpolation attack on block ciphers, FSE 1997)*

### Degree của $E_k$ sau $r$ rounds

**Mệnh đề**: Sau $r$ rounds của MiMC-n/n, polynomial $E_k(x)$ có degree đúng $3^r$ (trong biến $x$ là plaintext).

**Lý luận**: Mỗi round áp dụng $F_i(x) = (x \oplus k \oplus c_i)^3$, tức tăng degree lên $\times 3$. Sau round 0: degree $= 3$. Sau round 1: degree $= 9 = 3^2$. Sau $r$ rounds: degree $= 3^r$.

**Giới hạn trên**: Trong $\mathbb{F}_{2^n}$, không có function nào có degree $\geq 2^n$ vì $T^{2^n} \equiv T$ với mọi $T \in \mathbb{F}_{2^n}$. Do đó degree tăng chỉ đến $r_{\max}$ và không tăng thêm sau đó.

### Round count để chặn

> [!abstract] Claim 4.1 — Round count chặn Interpolation Attack (MiMC-n/n)
> Chọn $r = r_{\max} = \lceil n / \log_2 3 \rceil$ rounds đảm bảo degree của interpolation polynomial đạt $3^r \approx 2^n$ — adversary cần $\approx 2^n + 1$ cặp để xây dựng polynomial, tức toàn bộ không gian $\mathbb{F}_{2^n}$ (không practical).

**Tại sao**: Cần $d + 1 = 3^r + 1$ cặp để xây dựng polynomial bậc $3^r$. Với $r = \lceil n/\log_2 3 \rceil$:

$$
3^r \approx 3^{n/\log_2 3} = 2^{n \cdot \log_3 3 / \log_2 3 \cdot \log_2 3} = 2^n
$$

Tức cần $\approx 2^n$ cặp — xấp xỉ toàn bộ không gian. Không feasible với $n \geq 64$.

### Key recovery variant

Attack có thể mở rộng thành **key recovery**: đoán key của round cuối, decrypt một bước, rồi xây dựng polynomial cho $r-1$ rounds. Dùng một cặp extra để kiểm tra. Complexity vẫn dominated bởi degree $3^{r-1}$.

### Với MiMC-2n/n (Feistel)

Trong Feistel, sau $r$ rounds, degree của polynomial trong biến $x_L$ (left half) đạt $3^r$ và trong $x_R$ (right half) đạt $3^{r-1}$. Tổng số coefficients: $\approx 3^{2r-1}$.

**Chosen-plaintext shortcut**: Adversary có thể chọn plaintexts $0 \| x$ — khi đó degree của polynomial phần phải chỉ là $3^{r-2}$, ít hơn. Để chặn: cần tăng thêm ít nhất 2 rounds. Paper chọn $r' = 2r$ (gấp đôi) để đảm bảo margin an toàn.

---

## Tấn công 2: GCD Attack (tấn công mới trong paper)

### Ý tưởng

> [!note] Context — Key recovery qua GCD
> Interpolation attack tái tạo $E_k(x)$ — polynomial trong $x$ với key $k$ **cố định**. GCD attack tiếp cận khác: coi $E(K, x)$ là polynomial trong **key $K$** (với $x$ đã biết), rồi tìm nghiệm chung của hai polynomials như vậy.

**Lý luận chính**: Với cặp $(x_1, y_1)$ và cặp $(x_2, y_2)$ (với $y_i = E_k(x_i)$):

- Polynomial $E(K, x_1) - y_1 \in \mathbb{F}_{2^n}[K]$: có nghiệm tại $K = k$ (real key)
- Polynomial $E(K, x_2) - y_2 \in \mathbb{F}_{2^n}[K]$: có nghiệm tại $K = k$

Cả hai đều chứa $(K - k)$ là factor. Với xác suất cao (theo lý luận của paper): $\gcd$ của hai polynomials chính là $(K - k)$.

> [!abstract] Attack 4.2 — GCD Key Recovery Attack (MiMC-n/n)
> **Input**: Hai cặp $(x_1, y_1), (x_2, y_2)$ với $y_i = E_k(x_i)$  
> **Điều kiện**: $E(K, x)$ có thể tính được explicitly (đây là đặc điểm của MiMC!)
>
> **Bước 1**: Tính $G_1(K) = E(K, x_1) - y_1 \in \mathbb{F}_{2^n}[K]$ (polynomial bậc $3^r$ trong $K$)  
> **Bước 2**: Tính $G_2(K) = E(K, x_2) - y_2 \in \mathbb{F}_{2^n}[K]$ (polynomial bậc $3^r$ trong $K$)  
> **Bước 3**: Tính $\gcd(G_1(K), G_2(K))$  
> **Output**: $(K - k)$ với xác suất cao → key $k$
>
> **Complexity**: $O(r^2 \cdot 3^r)$ (do GCD của hai polynomials bậc $3^r$ tốn $O(d \log^2 d)$, với leading term cancellation giảm bậc xuống $3^r - 1$)

> [!warning] Tại sao GCD attack hoạt động với MiMC nhưng không với cipher thông thường
> MiMC có tính chất đặc biệt: $E(K, x)$ là **polynomial đơn biến trong $K$** có thể tính tường minh. Với AES hay cipher thông thường, cấu trúc của key schedule và S-box ngăn không cho biểu diễn $E$ như polynomial đơn biến trong $K$. Đây là "điểm yếu cấu trúc" của MiMC mà paper tự nhận diện và dùng để justify số rounds.

### Round count để chặn GCD attack (MiMC-n/n)

**Complexity target**: Muốn GCD attack tốn ít nhất $2^n$ operations.

GCD attack có complexity $O(r^2 \cdot 3^r)$. Đặt $r^2 \cdot 3^r \approx 2^n$. Vì $3^r \approx 2^{r \log_2 3}$, cần:

$$
r \log_2 3 \approx n \implies r \approx n / \log_2 3
$$

Đây là **cùng round count** như interpolation attack! Do đó, với $r = \lceil n/\log_2 3 \rceil$, MiMC đồng thời chặn cả hai tấn công.

### MitM GCD Attack (MiMC-2n/n) — Tấn công nguy hiểm hơn

Với Feistel, adversary có thể dùng **meet-in-the-middle variant**:

> [!abstract] Attack 4.3 — MitM GCD Attack (MiMC-2n/n)
> **Ý tưởng**: Thay vì xây dựng polynomial cho toàn bộ $r$ rounds, xây dựng hai polynomials $G'(K, x_i)$ và $G''(K, y_i)$ đại diện state tại round $r/2$ từ hai phía (từ plaintext lên và từ ciphertext xuống). Mỗi polynomial có degree chỉ $3^{r/2}$ (thay vì $3^r$).
>
> **Complexity**: Giải hệ phương trình với $\approx 2(3^{r/2}+1)^2$ unknowns: $O(3^r)$ — **bằng một nửa** so với attack thẳng.
>
> **Hệ quả**: Để đạt complexity $2^{2n}$, cần $3^r \approx 2^{2n}$, tức $r \approx 2n/\log_2 3$.

**Kết luận cho MiMC-2n/n**: Số rounds phải gấp đôi so với MiMC-n/n:

$$
r' = 2 \cdot \lceil n / \log_2 3 \rceil
$$

Đây chính xác là lý do MiMC-2n/n có gấp đôi số rounds so với MiMC-n/n (đã đề cập trong Lesson 02, nay được giải thích tường minh).

---

## Tấn công 3: Invariant Subfield Attack

### Ý tưởng

Nếu tất cả round constants $c_i$ và key $k$ đều nằm trong một **subfield** $\mathbb{F}_{2^m} \subsetneq \mathbb{F}_{2^n}$, thì plaintext $x \in \mathbb{F}_{2^m}$ sẽ cho ciphertext $E_k(x) \in \mathbb{F}_{2^m}$ — cipher không "rời khỏi" subfield.

> [!abstract] Attack 4.4 — Invariant Subfield Attack
> **Điều kiện tấn công**: Tất cả $c_i, k \in \mathbb{F}_{2^m}$ với $m \mid n$ và $m < n$  
> **Khai thác**: Plaintext $x \in \mathbb{F}_{2^m}$ → ciphertext $\in \mathbb{F}_{2^m}$ → bài toán giảm về $\mathbb{F}_{2^m}$ (nhỏ hơn $2^{n-m}$ lần)  
> **Mitigation**: Chọn $n$ **nguyên tố** — khi đó subfield duy nhất là $\mathbb{F}_2$, và với round constants $c_i \neq 1$ (guaranteed), attack không áp dụng

> [!tip] 💡 Agent note
> Đây là lý do paper đề xuất chọn $n$ là số nguyên tố (ví dụ $n = 129 = 3 \times 43$... thực ra 129 = 3 × 43 không phải nguyên tố). Thực ra paper nói "chọn $n$ nguyên tố" là một **recommendation tùy chọn** để tự động loại trừ subfield attack. Nếu $n$ không nguyên tố, phải chú ý chọn constants tránh nằm trong subfield.

---

## Tóm tắt: Nguồn gốc của round count

Đây là bức tranh tổng hợp — mỗi attack dẫn đến một lower bound trên số rounds:

| Attack | Áp dụng cho | Round count tối thiểu | Nguồn |
|--------|-------------|----------------------|-------|
| Interpolation | MiMC-n/n | $r = \lceil n/\log_2 3 \rceil$ | §4.2, [JK97] |
| MitM Interpolation | MiMC-n/n | Không cải thiện (inverse có degree cao) | §4.2 |
| GCD | MiMC-n/n | $r = \lceil n/\log_2 3 \rceil$ (cùng bound) | §4.2 |
| MitM GCD | MiMC-2n/n | $r' = 2\lceil n/\log_2 3 \rceil$ | §4.2 |
| Invariant Subfield | Cả hai | Mitigated bằng $n$ nguyên tố + constants $\neq \mathbb{F}_{2^m}$ | §4.2 |

**Kết luận của paper**: Round count của MiMC được **xác định bởi interpolation attack (MiMC-n/n) và MitM GCD attack (MiMC-2n/n)** — không phải bởi differential hay linear attack (sẽ phân tích trong Lesson 05).

---

## Density của Interpolation Polynomial

Paper hỗ trợ thực nghiệm claim rằng $P(x)$ không sparse (trong §4 footnote):

| Số rounds | Số terms xuất hiện | Tổng possible terms | Tỷ lệ |
|-----------|-------------------|---------------------|-------|
| 1 | $3^1 + 1 = 4$ | 4 | 100% |
| 2 | 8 | 10 | 80% |
| 3 | 19 | 28 | 67.9% |
| 4 | 54 | 82 | 65.9% |
| 5 | 161 | 244 | 66.0% |
| 6 | 531 | 730 | 72.7% |

Tỷ lệ tăng dần về 1 — polynomial dense. Điều này quan trọng vì nếu $P(x)$ sparse, adversary có thể exploit structure để dùng ít hơn $d+1$ cặp.

> [!tip] 💡 Agent note
> Lý do polynomial dense: round constants $c_i$ được chọn ngẫu nhiên, và $x^3$ là permutation trong $\mathbb{F}_{2^n}$. Sự kết hợp này "trộn" các terms hiệu quả sau nhiều rounds, tương tự avalanche effect trong cipher truyền thống.

---

## Summary

- **Interpolation attack** [JK97]: tái tạo $E_k(x)$ bằng Lagrange từ $3^r + 1$ cặp. MiMC chặn bằng cách chọn $r = \lceil n/\log_2 3 \rceil$ để $3^r \approx 2^n$.
- **GCD attack** (mới trong paper): recover key $k$ từ 2 cặp bằng $\gcd$ của polynomials trong $K$. Complexity $O(r^2 \cdot 3^r)$ — cùng round bound với interpolation cho MiMC-n/n.
- **MitM GCD attack** (cho MiMC-2n/n): giảm complexity xuống $O(3^{r/2})$ → cần gấp đôi rounds: $r' = 2\lceil n/\log_2 3 \rceil$.
- **Invariant subfield**: mitigated bằng chọn $n$ nguyên tố.
- **Round count của MiMC không phải tùy tiện** — được derived chặt chẽ từ độ khó của các tấn công đại số này.

---

## References

- [JK97] Jakobsen, Knudsen — *The interpolation attack on block ciphers*, FSE 1997 (🟡 Integrated — core của toàn bộ security analysis)
- [Sto85] Stoss — *The complexity of evaluating interpolation polynomials*, TCS 1985 (⚪ — complexity bound $O(d \log d)$)
- [MVO96] Menezes et al. — *HAC*, 1996 (🔴 Prerequisite — polynomial GCD algorithms)
