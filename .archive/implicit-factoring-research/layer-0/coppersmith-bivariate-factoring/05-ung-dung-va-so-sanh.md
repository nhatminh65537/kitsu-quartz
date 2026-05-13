---
title: "05. Applications and Comparisons"
type: attack
tags: [coppersmith, rsa, attack, comparison, lesson-05]
aliases: [Coppersmith Applications, RSA Variant Attack]
source: "Finding a Small Root of a Bivariate Integer Equation; Factoring with High Bits Known — Don Coppersmith, EUROCRYPT 1996"
created: 2026-03-25
---

> **Prerequisites**: [[02-xay-dung-lattice-va-thuat-toan-chinh|02. Lattice Construction and Main Algorithm]], [[03-chung-minh-dung-dan|03. Correctness Proof]]  
> **Lesson type**: Attack  
> **Covers**: §6 (Comparison with univariate modular algorithm), §7 (Comparison with previous work), §8 (Application to Vanstone–Zuccherato RSA variant)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $q_{ij}(x) = x^i p(x)^j$ | Polynomial trong thuật toán univariate modular [1] |
> | $N_{\text{id}}$ | Modulus RSA trong identity-based scheme [7] |

---

## §6 — So sánh với thuật toán univariate modular

### Thuật toán đồng hành [1]

Trong paper đồng hành [1] (cùng EUROCRYPT 1996), Coppersmith giải bài toán **univariate modular**: tìm $x_0$ nhỏ thỏa $f(x_0) \equiv 0 \pmod{N}$.

Kỹ thuật: dùng họ polynomial $q_{ij}(x) = x^i f(x)^j$ và assert $q_{ij}(x_0) \equiv 0 \pmod{N^j}$ — thông tin mod $N^j$ mạnh hơn mod $N$, cải thiện bound từ $N^{1/(2\delta-1)}$ lên $N^{1/\delta}$.

> [!info] 🟡 Coppersmith Univariate Modular [1]
> Bài toán: tìm $x_0$ với $|x_0| < X$ và $f(x_0) \equiv 0 \pmod N$, $\deg f = \delta$.
>
> Kết quả: tìm được khi $X < N^{1/\delta}$.
>
> Kỹ thuật then chốt: dùng $q_{ij}(x) = x^i f(x)^j$ với $j$ lên đến một giá trị tham số — mỗi level $j$ tương ứng làm việc mod $N^j$, cho thêm thông tin so với chỉ mod $N$.
>
> *(theo [1]: Coppersmith — Finding a Small Root of a Univariate Modular Equation, EUROCRYPT 1996)*

### Hai điểm khác biệt chính

**Khác biệt 1 — Đại lượng chuẩn hóa:**

Trong trường hợp modular, kích thước $X$ của nghiệm $x_0$ được chuẩn hóa bởi **modulus $N$** — một đại lượng tự nhiên. Trong trường hợp integer (paper này), không có đại lượng tự nhiên tương tự; phải dùng $D$ (hệ số lớn nhất của đa thức) để chuẩn hóa.

**Khác biệt 2 — Lợi ích của lũy thừa $p^k$:**

| Trường hợp | Dùng $q_{ijk}(x,y) = x^i y^j p^k$? | Lợi ích? |
|-----------|--------------------------------------|---------|
| Modular [1] | Có, dùng $x^i f^j$ | ✅ Có — làm việc mod $N^j$ > mod $N$ |
| **Integer (paper này)** | **Không** | ❌ Không — tổ hợp nguyên của $q_{ijk}$ bằng tổ hợp của $q_{ij}$; không có mod $N^j$ để khai thác |

Paper giải thích: với bài toán integer, dùng $x^i y^j p^k$ cho cùng một lattice $M_1$ (sai khác chỉ ở phép biến đổi cột cơ sở). Không có lợi thế nào từ lũy thừa $p^k$ như trong trường hợp modular — vì không có cấu trúc mod $N^j$ để khai thác.

---

## §7 — So sánh với kết quả trước

### Rivest & Shamir [5] — 1985

> [!info] 🟡 Rivest & Shamir [5] — EUROCRYPT 1985
> **Kết quả**: Biết $(\frac{1}{3})\log_2 N$ bits cao của $P$ → phân tích $N = PQ$ trong thời gian đa thức.
>
> **Kỹ thuật**: Dùng **một** polynomial $q_{00}(x,y) = p(x,y)$ và lattice tương ứng. Với một polynomial, điều kiện thành công là $(XY)^{(\delta+1)^2\delta/2} \le D$; với $\delta=1$ cho $XY \le D^{1/2}$, tương đương biết $1/3$ bits.
>
> *(theo [5]: Rivest & Shamir — Efficient Factoring Based on Partial Information, EUROCRYPT 1985)*

### Bảng so sánh tổng hợp

| Kết quả | Năm | Bits cần biết | Kỹ thuật lattice |
|---------|-----|--------------|-----------------|
| Rivest & Shamir [5] | 1985 | $(\frac{1}{3})\log_2 N$ | 1 polynomial |
| Vallée et al. [6] | 1988 | tương tự [5] | 1 polynomial, modular setting |
| Maurer [4] | 1992 | $(c)\log_2 N$ (oracle) | smooth integers, khác hẳn |
| **Coppersmith [paper này]** | **1996** | **$(\frac{1}{4})\log_2 N$** | **$k^2$ polynomials, amortization** |

> [!tip] 💡 Agent note
> Bound $1/4$ của Coppersmith về sau được chứng minh là **tối ưu** trong một nghĩa nhất định: nếu biết ít hơn $1/4$ bits, bài toán trở nên khó về mặt lý thuyết (không có chứng minh đa thức chung). Điều này được kết nối với hardness của bài toán phân tích thừa số.

---

## §8 — Tấn công scheme Vanstone–Zuccherato

### Mô tả scheme [7]

> [!info] 🟡 Vanstone & Zuccherato [7] — Identity-Based RSA Variant, 1995
> Đề xuất: RSA identity-based — modulus $N$ của user được liên kết với **identity** (danh tính) của họ. Ví dụ: các bit cao của $N$ mã hóa tên user dưới dạng ASCII.
>
> Cách sinh $N$: $N$ được tạo sao cho một số bit cao nhất định của $N$ khớp với identity string — điều này vô tình làm lộ thông tin về cấu trúc của $P$ và $Q$.
>
> *(theo [7]: Vanstone & Zuccherato — Short RSA Keys and Their Generation, J. Cryptology 8(2), 1995)*

### Điểm yếu bị khai thác

Khi sinh $N$ để bit cao khớp với identity, quá trình tạo khóa tiết lộ **nhiều hơn** $(1/4)\log_2 N$ bits cao của một nhân tử:

> [!warning] Attack Condition
> Scheme Vanstone–Zuccherato tạo $N$ theo cách vô tình tiết lộ hơn $(\frac{1}{4})\log_2 N$ bits cao của nhân tử $P$ ra public. Điều này kích hoạt trực tiếp thuật toán Coppersmith.

### Mô tả tấn công

> [!note] Scheme 5.1 — Attack on Vanstone–Zuccherato
> **Type**: Factorization attack via high bits leakage  
> **Threat model**: Biết $N$ (public), biết cấu trúc sinh khóa của scheme (tức là biết cách các bit cao của $N$ liên kết với identity)
>
> **$\mathsf{Attack}(N, \text{identity})$**
>
> - Input: $N = PQ$, identity string I
> - Step 1: Từ I và cách sinh của scheme, suy ra $P_0$ (approximation của $P$ từ bit cao của $N$ hoặc từ cấu trúc scheme)
> - Step 2: Xác nhận số bits lộ $> (\frac{1}{4})\log_2 N$ — điều kiện tấn công thỏa mãn
> - Step 3: Chạy $\mathsf{CoppersmithBivariate}(N, P_0, \varepsilon)$ từ bài 02
> - Step 4: Thu $P, Q$ → phá RSA của user
> - Output: Khóa bí mật $d$ từ $P, Q, e$

**Kết quả**: Scheme **bị phá hoàn toàn** — mọi user đều có thể bị tìm khóa bí mật trong thời gian đa thức.

### Bài học bảo mật

> [!danger] Kết luận bảo mật
> Identity-based RSA với cấu trúc $N$ lộ thông tin về nhân tử là không an toàn. Bất kỳ scheme nào tiết lộ hơn $1/4$ bits của nhân tử đều có thể bị phá bằng kỹ thuật Coppersmith.

---

## Tổng kết và bức tranh rộng hơn

Coppersmith 1996 không chỉ cải thiện một bound kỹ thuật — nó thay đổi cách thiết kế và phân tích RSA-based schemes:

- Mọi scheme để lộ partial information về nhân tử RSA cần đảm bảo leak **ít hơn $1/4$ bits**.
- Kỹ thuật dùng nhiều polynomial lattice (amortization) trở thành công cụ tiêu chuẩn trong cryptanalysis.
- Paper mở ra dòng nghiên cứu về **partial key exposure attacks** — khai thác khi biết một phần của $d$ (private exponent) hoặc $p$ (nhân tử).

> [!tip] 💡 Agent note
> Trong bối cảnh bug bounty zkVerify: kỹ thuật này không áp dụng trực tiếp cho ZK proof systems, nhưng nền tảng lattice và phương pháp tìm small roots là công cụ cơ bản trong cryptanalysis tổng quát — có thể xuất hiện trong phân tích các tham số cryptographic yếu trong ZK circuits.

---

## Summary

- **§6**: Khác biệt với univariate modular [1]: bài integer không có cấu trúc mod $N^j$; lũy thừa $p^k$ không cho lợi thế.
- **§7**: Cải thiện từ $1/3$ (Rivest–Shamir [5]) xuống $1/4$ nhờ $k^2$ polynomials thay vì 1.
- **§8**: Tấn công trực tiếp scheme Vanstone–Zuccherato [7] — scheme tạo $N$ lộ hơn $1/4$ bits của nhân tử → bị phá hoàn toàn.

---

## References

- [1] Coppersmith — *Finding a Small Root of a Univariate Modular Equation*, EUROCRYPT 1996 (🟡 Integrated — so sánh §6)
- [4] Maurer — *Factoring with an Oracle*, EUROCRYPT 1992 (⚪)
- [5] Rivest & Shamir — *Efficient Factoring Based on Partial Information*, EUROCRYPT 1985 (🟡 Integrated — so sánh §7)
- [6] Vallée, Girault, Toffin — *How to Guess $\ell$-th Roots Modulo n by Reducing Lattice Bases*, AAECC 6, 1988 (⚪)
- [7] Vanstone & Zuccherato — *Short RSA Keys and Their Generation*, J. Cryptology 8(2), 1995 (🟡 Integrated — tấn công §8)
