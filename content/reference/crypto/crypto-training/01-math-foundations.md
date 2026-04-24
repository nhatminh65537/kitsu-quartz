---
title: "01. Mathematical Foundations"
type: math-component
tags: [crypto, math, foundations, number-theory, algebra, elliptic-curves, lattice]
aliases: [Math Foundations, Toán học mật mã]
created: 2026-04-22
---

> **Prerequisites**: Toán phổ thông cơ bản (số học, hàm số, tập hợp)  
> **Lesson type**: Mathematical Component (Supplement)
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{Z}$ | Tập số nguyên $\{\ldots, -2, -1, 0, 1, 2, \ldots\}$ |
> | $\mathbb{Z}_n$ | Vành số nguyên modulo $n$: $\{0, 1, \ldots, n-1\}$ |
> | $\mathbb{F}_p$ | Trường hữu hạn với $p$ phần tử ($p$ nguyên tố) |
> | $\mathbb{F}_q$ | Trường hữu hạn với $q = p^k$ phần tử |
> | $\lambda$ | Security parameter (độ dài bit của key) |
> | $\mathsf{poly}(\lambda)$ | Hàm đa thức theo $\lambda$ |
> | $\mathsf{negl}(\lambda)$ | Hàm negligible theo $\lambda$ |

---

## 1. Tổng quan: Tại sao mật mã cần toán học?

Mật mã cổ điển — Caesar cipher, Vigenère — dựa trên sự bí mật của *thuật toán*. Kẻ địch không biết cách mã hóa thì không phá được. Nhưng vào thế kỷ 20, với sự ra đời của máy tính và những bộ não như Claude Shannon, cộng đồng crypto đặt ra câu hỏi rất khác: *"Giả sử kẻ tấn công biết tất cả mọi thứ về thuật toán — liệu hệ thống có còn an toàn không?"*

Nguyên tắc Kerckhoffs (1883) phát biểu điều này: an toàn chỉ phụ thuộc vào **key bí mật**, không phải thuật toán bí mật. Đây là nền tảng tư duy của crypto hiện đại.

Và để xây dựng những hệ thống *chứng minh được* là an toàn theo nguyên tắc đó, người ta cần toán học. Cụ thể là cần những **bài toán khó** mà máy tính không thể giải trong thời gian thực tế. Security của hệ thống mật mã bằng với độ khó của bài toán nền tảng.

Bài học này là một *bản đồ toàn cảnh* — không dạy sâu bất kỳ nhánh nào, nhưng giúp bạn:

- Biết mỗi nhánh toán học *tồn tại* ở đâu trong hệ sinh thái crypto
- Hiểu những khái niệm nền tảng nhất (group, field, elliptic curve)
- Có một reference khi gặp thuật ngữ toán trong các bài sau

![[assets/img-LA-01-math-tree.png]]
*Bản đồ 6 nhánh toán học và mối liên hệ với các cryptographic primitive chính.*

---

## 2. Lý thuyết số (Number Theory)

Lý thuyết số là nhánh toán học nghiên cứu tính chất của số nguyên. Đây là nền tảng của RSA, DH, và nhiều hệ thống mật mã cổ điển nhất.

### 2.1. Số nguyên tố và GCD

Một số nguyên $p > 1$ được gọi là **số nguyên tố (prime)** nếu ước số dương duy nhất của nó là $1$ và chính nó. Theo **Định lý cơ bản của số học**, mọi số nguyên $n > 1$ đều phân tích duy nhất thành tích các số nguyên tố: $n = p_1^{e_1} \cdot p_2^{e_2} \cdots p_k^{e_k}$.

**Ước số chung lớn nhất (GCD — Greatest Common Divisor)** của $a$ và $b$, ký hiệu $\gcd(a, b)$, là số nguyên dương lớn nhất chia hết cả $a$ lẫn $b$. Thuật toán Euclid tính $\gcd(a, b)$ trong $O(\log \min(a, b))$ phép chia. Phần mở rộng của nó — **Extended Euclidean Algorithm (EEA)** — tìm $x, y \in \mathbb{Z}$ sao cho $ax + by = \gcd(a, b)$ (Bezout's identity).

> [!tip] Ứng dụng trong crypto
> EEA được dùng để tính **modular inverse**: $a^{-1} \pmod{n}$ tồn tại khi và chỉ khi $\gcd(a, n) = 1$. Đây là bước không thể thiếu trong RSA keygen ($d = e^{-1} \pmod{\phi(n)}$) và vô số scheme khác.

### 2.2. Số học modular và các định lý nền tảng

**Số học modular** là hệ thống tính toán trên tập $\mathbb{Z}_n = \{0, 1, \ldots, n-1\}$ với phép cộng và nhân theo modulo $n$. Ta viết $a \equiv b \pmod{n}$ để nói $n \mid (a - b)$.

**Hàm phi Euler $\phi(n)$** đếm số phần tử trong $\{1, \ldots, n\}$ nguyên tố cùng nhau với $n$:

$$\phi(p) = p - 1 \quad \text{(với } p \text{ nguyên tố)}$$

$$\phi(pq) = (p-1)(q-1) \quad \text{(với } p, q \text{ nguyên tố phân biệt)}$$

**Định lý Fermat nhỏ**: Với $p$ nguyên tố và $\gcd(a, p) = 1$: $a^{p-1} \equiv 1 \pmod{p}$.

**Định lý Euler**: Tổng quát hóa định lý Fermat: Với $\gcd(a, n) = 1$: $a^{\phi(n)} \equiv 1 \pmod{n}$.

Chính định lý Euler là lý do RSA hoạt động: $m^{ed} \equiv m \pmod{n}$ vì $ed \equiv 1 \pmod{\phi(n)}$.

**Hàm Carmichael $\lambda(n)$**: Nhỏ hơn $\phi(n)$ và cũng thoả mãn $a^{\lambda(n)} \equiv 1 \pmod{n}$. Trong thực tế, RSA dùng $\lambda(n) = \text{lcm}(p-1, q-1)$ thay vì $\phi(n)$ để chọn $d$ nhỏ hơn.

### 2.3. Chinese Remainder Theorem (CRT)

**Định lý phần dư Trung Quốc**: Nếu $n_1, n_2, \ldots, n_k$ đôi một nguyên tố cùng nhau, thì hệ phương trình:

$$x \equiv a_1 \pmod{n_1}, \quad x \equiv a_2 \pmod{n_2}, \quad \ldots, \quad x \equiv a_k \pmod{n_k}$$

có nghiệm duy nhất modulo $N = n_1 n_2 \cdots n_k$.

CRT dùng trong: tính toán RSA hiệu quả hơn 4 lần (tính mod $p$ và mod $q$ riêng rồi combine), tấn công Hastad broadcast (combine $k$ ciphertext từ $k$ moduli khác nhau), và nhiều thuật toán khác.

### 2.4. Quadratic Residues và Legendre Symbol

Với $p$ nguyên tố, $a \in \mathbb{F}_p^*$ là **quadratic residue (QR)** nếu tồn tại $x$ sao cho $x^2 \equiv a \pmod{p}$. Đúng một nửa các phần tử trong $\mathbb{F}_p^*$ là QR.

**Legendre symbol** $\left(\frac{a}{p}\right)$ = $+1$ nếu $a$ là QR mod $p$, $-1$ nếu không phải, $0$ nếu $p \mid a$. Tính bằng: $\left(\frac{a}{p}\right) = a^{(p-1)/2} \pmod{p}$.

Ứng dụng: Goldwasser-Micali cryptosystem dựa trên hardness của **Quadratic Residuosity Problem (QRP)** — phân biệt QR và non-QR khi modulus là tích hai số nguyên tố lớn.

### 2.5. Discrete Logarithm Problem (DLP)

Trong nhóm cyclic $\mathbb{G}$ với generator $g$ và bậc $n$: biết $y = g^x$, tìm $x \in \{0, \ldots, n-1\}$. Đây là **bài toán logarithm rời rạc (DLP)** — nền tảng của Diffie-Hellman và ElGamal.

Nếu $\mathbb{G} = \mathbb{F}_p^*$, DLP có thể giải bằng **Index Calculus** trong thời gian sub-exponential, đòi hỏi $|p|$ phải $\geq 2048$ bit để an toàn. Nếu $\mathbb{G}$ là nhóm điểm trên đường cong elliptic, **không có** thuật toán sub-exponential nào được biết, nên chỉ cần $|p| \geq 256$ bit.

### 2.6. p-adic Numbers và Hensel's Lemma

Số $p$-adic là hệ thống số mở rộng $\mathbb{Z}$ theo một chiều khác với số thực. Trong mật mã, **Hensel's lemma** — cho phép "lift" nghiệm của đa thức từ $\mathbb{Z}/p\mathbb{Z}$ lên $\mathbb{Z}/p^k\mathbb{Z}$ — được dùng trong **Smart's attack** lên anomalous elliptic curves (khi $|E(\mathbb{F}_p)| = p$).

---

## 3. Đại số trừu tượng (Abstract Algebra)

Đại số trừu tượng nghiên cứu các *cấu trúc toán học* trừu tượng. Thay vì làm việc với số cụ thể, ta làm việc với các *tập hợp có phép toán* thoả mãn các tiên đề nhất định.

### 3.1. Nhóm (Group) — Định nghĩa chi tiết

> [!note] Định nghĩa: Nhóm (Group)
> Một **nhóm** là cặp $(\mathbb{G}, \star)$ trong đó $\mathbb{G}$ là tập hợp và $\star: \mathbb{G} \times \mathbb{G} \to \mathbb{G}$ là phép toán nhị phân, thoả mãn bốn tiên đề:
>
> **1. Đóng (Closure)**: $\forall a, b \in \mathbb{G}: a \star b \in \mathbb{G}$  
> **2. Kết hợp (Associativity)**: $\forall a, b, c \in \mathbb{G}: (a \star b) \star c = a \star (b \star c)$  
> **3. Phần tử đơn vị (Identity)**: $\exists e \in \mathbb{G}$ sao cho $\forall a \in \mathbb{G}: e \star a = a \star e = a$  
> **4. Phần tử nghịch đảo (Inverse)**: $\forall a \in \mathbb{G}, \exists a^{-1} \in \mathbb{G}$ sao cho $a \star a^{-1} = a^{-1} \star a = e$
>
> Nếu thêm tiên đề thứ năm — **Giao hoán (Commutativity)**: $\forall a, b: a \star b = b \star a$ — thì nhóm được gọi là **nhóm Abel (abelian group)**.

**Ví dụ cụ thể về nhóm**:

- $(\mathbb{Z}, +)$: Số nguyên với phép cộng — nhóm Abel vô hạn. Identity là $0$, nghịch đảo của $a$ là $-a$.
- $(\mathbb{Z}_n, +)$: Số nguyên mod $n$ với phép cộng — nhóm Abel hữu hạn bậc $n$.
- $(\mathbb{Z}_p^*, \cdot)$: Số nguyên $1, \ldots, p-1$ với phép nhân mod $p$ (với $p$ nguyên tố) — nhóm Abel hữu hạn bậc $p-1$. Đây là nhóm nền tảng của DH.
- $(E(\mathbb{F}_p), +)$: Tập điểm trên đường cong elliptic — nhóm Abel hữu hạn, nền tảng của ECC.

![[assets/img-LA-03-algebra-hierarchy.png]]
*Hierarchy Group → Ring → Field với axioms, ví dụ, và ứng dụng crypto của từng cấu trúc.*

**Các khái niệm quan trọng trong nhóm**:

- **Bậc của nhóm** $|\mathbb{G}|$: Số phần tử. Nếu hữu hạn, ta gọi là nhóm hữu hạn.
- **Bậc của phần tử** $\text{ord}(g)$: Số nguyên dương nhỏ nhất $k$ sao cho $g^k = e$.
- **Nhóm cyclic**: Nhóm $\mathbb{G}$ cyclic nếu $\exists g \in \mathbb{G}$ sao cho $\mathbb{G} = \{g^0, g^1, g^2, \ldots\}$. Phần tử $g$ được gọi là **generator (phần tử sinh)**. Mọi nhóm con của nhóm cyclic cũng là cyclic.
- **Định lý Lagrange**: Bậc của mọi nhóm con chia hết bậc của nhóm. Suy ra bậc của mọi phần tử chia hết bậc của nhóm.
- **Nhóm con (Subgroup)**: $H \subseteq \mathbb{G}$ là nhóm con nếu $H$ cũng là nhóm với cùng phép toán. Ký hiệu $H \leq \mathbb{G}$.
- **Coset**: Với $H \leq \mathbb{G}$, coset trái của $H$ qua $a$ là $aH = \{ah : h \in H\}$.

> [!info] Tại sao group quan trọng trong mật mã?
> Crypto cần ba thứ: (1) phép toán dễ tính, (2) phép toán ngược khó tính, (3) cấu trúc đủ phong phú để xây scheme. Group cung cấp đúng cấu trúc đó. DLP trong nhóm phù hợp là phép toán "khó đảo ngược" nền tảng của Diffie-Hellman, ElGamal, DSA, ECDSA, và nhiều scheme khác.

### 3.2. Vành (Ring)

> [!note] Định nghĩa: Vành (Ring)
> Một **vành** là bộ ba $(R, +, \cdot)$ trong đó:
> - $(R, +)$ là nhóm Abel (phép cộng)
> - Phép nhân $\cdot$ có tính kết hợp và phân phối qua phép cộng
> - Tồn tại phần tử đơn vị nhân $1_R$ (với vành có đơn vị)
>
> Vành **giao hoán** nếu $a \cdot b = b \cdot a$ với mọi $a, b$.

**Ví dụ**:

- $\mathbb{Z}$: Vành số nguyên. Phần tử có nghịch đảo nhân chỉ là $\pm 1$.
- $\mathbb{Z}/n\mathbb{Z}$: Vành số nguyên modulo $n$. Phần tử $a$ có nghịch đảo nhân khi và chỉ khi $\gcd(a, n) = 1$.
- $\mathbb{Z}[x]$: Vành đa thức hệ số nguyên. Ứng dụng trong lattice-based crypto.
- $\mathbb{Z}[x]/(x^n + 1)$: Vành thương — nền tảng của Ring-LWE và Kyber/Dilithium.

### 3.3. Trường (Field)

> [!note] Định nghĩa: Trường (Field)
> Một **trường** là vành giao hoán có đơn vị trong đó mọi phần tử **khác $0$** đều có nghịch đảo nhân. Nói cách khác, $(F \setminus \{0\}, \cdot)$ là nhóm Abel.

Trường quan trọng nhất trong mật mã là **trường hữu hạn (finite field)** hay **Galois field $\text{GF}(q)$** hoặc $\mathbb{F}_q$:

- **$\mathbb{F}_p$** (với $p$ nguyên tố): Tập $\{0, 1, \ldots, p-1\}$ với cộng và nhân mod $p$. Đây là trường "dễ nhất". Dùng trong ECC (secp256k1, P-256).
- **$\mathbb{F}_{2^n}$ = $\text{GF}(2^n)$**: Tập các đa thức nhị phân bậc $< n$, phép cộng = XOR, phép nhân = nhân đa thức mod polynomial bất khả quy $f(x)$ bậc $n$. Dùng trong AES (GF($2^8$)), và một số ECC binary field.
- **$\mathbb{F}_{p^k}$**: Extension field — dùng trong pairing (BN254 dùng $\mathbb{F}_{p^{12}}$, BLS12-381 dùng $\mathbb{F}_{p^{12}}$).

> [!abstract] Định lý: Trường hữu hạn tồn tại và duy nhất
> Với mọi lũy thừa nguyên tố $q = p^k$, tồn tại đúng một trường hữu hạn (đến đồng cấu) với $q$ phần tử, ký hiệu $\mathbb{F}_q$.

**Characteristic của trường**: Số nguyên dương nhỏ nhất $p$ sao cho $p \cdot 1_F = 0$. Trường hữu hạn có characteristic là nguyên tố $p$ (chính là "base prime").

### 3.4. Lý thuyết Galois (Galois Theory)

Lý thuyết Galois nghiên cứu *đối xứng* của trường — cụ thể là các **automorphism** (song ánh tự ánh xạ bảo toàn cấu trúc). **Nhóm Galois** $\text{Gal}(L/K)$ là nhóm các $K$-automorphism của $L$.

Trong mật mã, lý thuyết Galois xuất hiện trong:

- **Frobenius endomorphism** $\phi_p: (x, y) \mapsto (x^p, y^p)$ trên đường cong elliptic — cung cấp thông tin về $|E(\mathbb{F}_p)|$.
- **Pairing-friendly curves**: Embedding degree $k$ chính xác là bậc nhỏ nhất sao cho $\mathbb{F}_{p^k}$ chứa đủ roots of unity.
- **Extension fields trong FHE**: $\mathbb{Z}[x]/(x^n + 1)$ gắn liền với cyclotomic fields.

---

## 4. Đường cong Elliptic (Elliptic Curve Theory)

Đường cong elliptic là một trong những đối tượng đẹp nhất trong toán học hiện đại — đồng thời là công cụ mạnh mẽ nhất của crypto đương đại.

### 4.1. Định nghĩa đường cong elliptic

> [!note] Định nghĩa: Elliptic Curve
> Cho $K$ là trường với $\text{char}(K) \neq 2, 3$. Một **đường cong elliptic** $E$ trên $K$ là tập các điểm $(x, y) \in K^2$ thoả phương trình Weierstrass rút gọn:  
> $$E: y^2 = x^3 + ax + b, \quad a, b \in K$$  
> cùng với một **điểm tại vô cực** $\mathcal{O}$ (point at infinity), với điều kiện **non-singular**:  
> $$\Delta = -16(4a^3 + 27b^2) \neq 0$$  
> (Điều kiện này đảm bảo đường cong không có điểm kỳ dị — không có cusp hay tự giao.)  
> Tập điểm đầy đủ: $E(K) = \{(x, y) \in K^2 : y^2 = x^3 + ax + b\} \cup \{\mathcal{O}\}$

**Điểm tại vô cực $\mathcal{O}$** là phần tử đặc biệt — không có tọa độ thực, nhưng tồn tại trong projective plane. Về mặt trực quan, hãy nghĩ về nó như điểm "ở tận cùng" theo chiều dọc, nơi mọi đường thẳng đứng gặp nhau.

> [!example] Ví dụ cụ thể
> Xét đường cong secp256k1 (dùng trong Bitcoin): $y^2 = x^3 + 7$ trên $\mathbb{F}_p$ với $p = 2^{256} - 2^{32} - 977$. Hệ số $a = 0$, $b = 7$, $\Delta = -16(0 + 27 \cdot 49) \neq 0$.

### 4.2. Luật cộng nhóm (Group Law)

Tập $E(K)$ tạo thành nhóm Abel với phép cộng được định nghĩa theo quy tắc hình học **chord-and-tangent** (dây cung và tiếp tuyến):

**Trường hợp 1: $P \neq Q$ và $P, Q \neq \mathcal{O}$**

Vẽ đường thẳng qua $P = (x_1, y_1)$ và $Q = (x_2, y_2)$. Đường thẳng này cắt đường cong tại điểm thứ ba (gọi là $-R$), sau đó lấy đối xứng qua trục $x$ để được $R = P + Q$.

$$\lambda = \frac{y_2 - y_1}{x_2 - x_1} \pmod{p}$$

$$x_3 = \lambda^2 - x_1 - x_2 \pmod{p}$$

$$y_3 = \lambda(x_1 - x_3) - y_1 \pmod{p}$$

**Trường hợp 2: $P = Q$ (point doubling)**

Đường thẳng tiếp tuyến tại $P$ cắt đường cong tại điểm thứ hai (là $-2P$), lấy đối xứng:

$$\lambda = \frac{3x_1^2 + a}{2y_1} \pmod{p}$$

$$x_3 = \lambda^2 - 2x_1 \pmod{p}, \quad y_3 = \lambda(x_1 - x_3) - y_1 \pmod{p}$$

**Trường hợp đặc biệt**:

- $P + \mathcal{O} = P$ — $\mathcal{O}$ là identity.
- $P + (-P) = \mathcal{O}$ — nghịch đảo của $(x, y)$ là $(x, -y)$.
- Nếu $P \neq Q$ nhưng $x_1 = x_2$ thì $y_1 = -y_2$ (do $y^2$ bằng nhau), nên $P + Q = \mathcal{O}$.

![[assets/img-LA-02-elliptic-curve.png]]
*Minh họa chord-and-tangent group law: đường thẳng qua P và Q cắt curve tại −R, reflect cho R = P+Q. Panel phải: công thức đầy đủ và các trường hợp đặc biệt.*

> [!abstract] Định lý: $E(K)$ là nhóm Abel
> Với mọi trường $K$ và đường cong elliptic $E/K$, tập $(E(K), +)$ với phép cộng định nghĩa trên là một nhóm Abel.
>
> **Proof sketch.** Tính đóng và nhận dạng phần tử đơn vị $\mathcal{O}$ là rõ ràng. Tính giao hoán và kết hợp cần kiểm tra bằng tính toán đại số (hoặc qua lý thuyết divisor). $\blacksquare$

### 4.3. Đường cong elliptic trên trường hữu hạn

Với $p$ lớn, nhóm $E(\mathbb{F}_p)$ là hữu hạn với bậc xấp xỉ $p$:

> [!abstract] Định lý: Hasse (1922)
> Với đường cong elliptic $E$ trên $\mathbb{F}_p$:
>
> $$\bigl| |E(\mathbb{F}_p)| - (p + 1) \bigr| \leq 2\sqrt{p}$$

Nói cách khác, $|E(\mathbb{F}_p)| \approx p$ với sai số tối đa $2\sqrt{p}$.

**Cấu trúc của $E(\mathbb{F}_p)$**: Nhóm $E(\mathbb{F}_p)$ luôn là một trong hai dạng:
- Cyclic: $\mathbb{Z}_n$ (với $n = |E(\mathbb{F}_p)|$)
- Tích của hai cyclic: $\mathbb{Z}_{n_1} \times \mathbb{Z}_{n_2}$ với $n_1 \mid n_2$

Để dùng trong crypto, ta chọn đường cong có $|E(\mathbb{F}_p)| = n$ với $n$ là số nguyên tố lớn (hoặc có large prime factor), đảm bảo nhóm đủ "khó" để giải ECDLP.

### 4.4. ECDLP — Bài toán logarithm rời rạc trên đường cong

**ECDLP**: Cho $P, Q \in E(\mathbb{F}_p)$, tìm $k \in \mathbb{Z}$ sao cho $Q = kP$ (scalar multiplication).

Tại sao ECDLP khó hơn DLP thông thường? Trong nhóm $\mathbb{F}_p^*$, có thuật toán **Index Calculus** chạy trong thời gian sub-exponential $L_p[1/2]$. Nhưng trên đường cong elliptic, không có "factor base" tự nhiên tương đương — thuật toán tốt nhất hiện tại là BSGS và Pollard-$\rho$ với độ phức tạp $O(\sqrt{n})$.

Đây là lý do ECC dùng key 256-bit thay vì 2048-bit như RSA mà vẫn đạt cùng mức bảo mật.

### 4.5. Các khái niệm nâng cao (biết tên)

**Endomorphism ring**: Tập tất cả endomorphism (group homomorphism từ $E$ vào chính nó) tạo thành vành. Với đường cong supersingular, đây là maximal order trong quaternion algebra — nền tảng của SQISign.

**Frobenius endomorphism**: $\phi_p: (x, y) \mapsto (x^p, y^p)$. Trace of Frobenius $t$ thoả $|E(\mathbb{F}_p)| = p + 1 - t$.

**Divisors và Riemann-Roch**: Divisor là tổ hợp hình thức $D = \sum n_P [P]$ của các điểm. Riemann-Roch theorem cho phép tính dimension của không gian hàm với cực điểm cho trước — nền tảng lý thuyết để định nghĩa Weil/Tate pairing.

**Weil / Tate / Ate Pairing**: Bilinear map $e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$ với $e(aP, bQ) = e(P, Q)^{ab}$. Tính bilinear này là "phép nhân" giữa hai nhóm — nền tảng của BLS signature, IBE, KZG commitment, và ZK-SNARKs.

**Isogeny**: Ánh xạ $\phi: E_1 \to E_2$ bảo toàn cấu trúc nhóm (là group homomorphism). Isogeny graphs — mạng lưới các đường cong kết nối bởi isogenies — là hard problem nền tảng của CSIDH và SQISign.

---

## 5. Đại số tuyến tính & Lattice

### 5.1. Không gian vector

**Không gian vector** trên trường $\mathbb{F}$ là tập $V$ với phép cộng và nhân scalar thoả các tiên đề quen thuộc. Trong crypto, thường làm việc với $\mathbb{F}_p^n$ hoặc $\mathbb{Z}^n$.

**Basis** của không gian $n$ chiều: $n$ vector độc lập tuyến tính tạo ra toàn bộ không gian. Ma trận cột của chúng là **ma trận cơ sở**. Quan trọng trong: AES (MixColumns là ánh xạ tuyến tính trên $\mathbb{F}_{2^8}$), lattice-based crypto.

### 5.2. Lattice

> [!note] Định nghĩa: Lattice
> Một **lattice** $\mathcal{L}$ trong $\mathbb{R}^n$ là tập tất cả tổ hợp số nguyên của $m$ vector độc lập tuyến tính $\mathbf{b}_1, \ldots, \mathbf{b}_m \in \mathbb{R}^n$:
>
> $$\mathcal{L} = \left\{ \sum_{i=1}^{m} z_i \mathbf{b}_i : z_i \in \mathbb{Z} \right\}$$
>
> Ma trận $B = [\mathbf{b}_1 | \cdots | \mathbf{b}_m]$ là **basis** của lattice. Một lattice có vô số basis (khác nhau nhưng sinh ra cùng lattice).

**Determinant** của lattice: $\det(\mathcal{L}) = \sqrt{\det(B^T B)}$ — thể tích của ô cơ bản (fundamental domain).

**Bài toán khó trên lattice**:

- **SVP (Shortest Vector Problem)**: Tìm vector ngắn nhất trong lattice.
- **CVP (Closest Vector Problem)**: Tìm điểm lattice gần nhất với một target vector cho trước.

Cả SVP và CVP đều **NP-hard** trong trường hợp tổng quát (thực ra là NP-hard để xấp xỉ trong factor nhỏ). Độ khó này là nền tảng của post-quantum crypto.

**LLL algorithm** (Lenstra-Lenstra-Lovász, 1982): Tìm basis "gần vuông góc" trong thời gian polynomial. Không giải chính xác SVP nhưng tìm vector ngắn hơn exponential so với vector dài nhất trong basis ban đầu. **LLL là dao quân đội Thụy Sĩ của crypto** — dùng trong: Wiener's attack, Hastad's attack, Coppersmith, HNP, phá Merkle-Hellman knapsack, và nhiều hơn nữa.

**Bài toán LWE (Learning With Errors)**: Cho $\mathbf{A} \in \mathbb{Z}_q^{m \times n}$ ngẫu nhiên, $\mathbf{s} \in \mathbb{Z}_q^n$ bí mật, $\mathbf{e}$ noise nhỏ ngẫu nhiên. Biết $(\mathbf{A}, \mathbf{b} = \mathbf{As} + \mathbf{e})$, tìm $\mathbf{s}$. Đây là hard problem nền tảng của Kyber, Dilithium, và phần lớn PQC lattice-based.

---

## 6. Xác suất & Lý thuyết thông tin

### 6.1. Shannon entropy

**Entropy** đo lượng "bất định" của nguồn ngẫu nhiên:

$$H(X) = -\sum_{x} \Pr[X = x] \cdot \log_2 \Pr[X = x]$$

Đơn vị là bit. $H(X) = n$ bit nghĩa là cần trung bình $n$ bit để mã hóa một output của $X$.

**Conditional entropy**: $H(X | Y) = H(X, Y) - H(Y)$ — entropy của $X$ khi biết $Y$.

**Mutual information**: $I(X; Y) = H(X) - H(X|Y)$ — thông tin $Y$ cung cấp về $X$.

**Perfect secrecy (Shannon 1949)**: Hệ thống mã hóa đạt perfect secrecy khi $H(M | C) = H(M)$, tức là ciphertext $C$ không rò rỉ bất kỳ thông tin nào về plaintext $M$. Chỉ **One-Time Pad** đạt được điều này (và chỉ khi key thực sự ngẫu nhiên, dài bằng message, dùng đúng một lần).

### 6.2. Statistical distance và negligible functions

**Statistical distance (Total Variation Distance)** giữa hai phân phối $P$ và $Q$:

$$\text{SD}(P, Q) = \frac{1}{2} \sum_x |P(x) - Q(x)|$$

Hai phân phối **computationally indistinguishable** nếu không có PPT adversary nào phân biệt được sample từ $P$ hay $Q$ với xác suất non-negligible.

**Hàm negligible**: $\mu: \mathbb{N} \to \mathbb{R}$ là negligible nếu với mọi đa thức $p(\cdot)$, tồn tại $N$ sao cho $\forall n > N: \mu(n) < 1/p(n)$. Trong ngữ cảnh crypto, security parameter $\lambda$ thay cho $n$, và xác suất thắng của adversary phải là $\leq 1/2 + \mathsf{negl}(\lambda)$.

### 6.3. Birthday paradox

Nếu chọn ngẫu nhiên $k$ phần tử từ không gian kích thước $N$, xác suất collision ($\geq 2$ phần tử trùng nhau) đạt $\approx 50\%$ khi $k \approx 1.18\sqrt{N}$.

Ứng dụng trực tiếp: Hash function với output $n$ bit an toàn $2^{n/2}$ queries (không phải $2^n$). Do đó SHA-256 đạt **128-bit collision security**, không phải 256-bit.

---

## 7. Độ phức tạp tính toán (Computational Complexity)

### 7.1. Các lớp phức tạp

- **P**: Bài toán giải được trong thời gian đa thức (polynomial time) trên máy tính tất định.
- **NP**: Bài toán có thể **verify** nghiệm trong thời gian đa thức; không rõ có thể **solve** trong polynomial time không.
- **BPP**: Bài toán giải được trong polynomial time với xác suất sai $< 1/3$ (randomized).
- **BQP**: Bài toán giải được trong polynomial time trên máy tính lượng tử. Shor's algorithm cho thấy **Factoring $\in$ BQP**.

Câu hỏi P = NP? vẫn chưa được giải. Nhưng crypto không cần P ≠ NP — cần bài toán *average-case hard*, và đây là điều khác với NP-hardness (worst-case).

### 7.2. One-Way Functions (OWF)

> [!note] Định nghĩa: One-Way Function
> Hàm $f: \{0,1\}^* \to \{0,1\}^*$ là **one-way function** nếu:
> - **Dễ tính**: Tồn tại thuật toán polynomial-time tính $f(x)$ từ $x$.
> - **Khó đảo ngược**: Với mọi PPT adversary $\mathcal{A}$ và mọi đa thức $p$, với $x \leftarrow \{0,1\}^\lambda$:
>
> $$\Pr\left[\mathcal{A}(1^\lambda, f(x)) \in f^{-1}(f(x))\right] \leq \frac{1}{p(\lambda)}$$

**Điều quan trọng**: OWF *chưa được chứng minh tồn tại* (việc này tương đương với P ≠ NP, nhưng còn mạnh hơn). Chúng ta *giả sử* tồn tại dựa trên heuristic và thực tế tính toán. Nếu OWF không tồn tại, phần lớn crypto hiện đại sẽ sụp đổ.

**Định lý trung tâm**: Nếu OWF tồn tại, thì PRG (Pseudorandom Generator), PRF (Pseudorandom Function), và nhiều primitive khác cũng tồn tại. OWF là "giả thiết tối thiểu" để xây dựng symmetric crypto.

### 7.3. Các bài toán khó trong mật mã

| Tên | Mô tả | Dùng trong | Quantum attack |
|-----|-------|-----------|----------------|
| **Factoring** | Phân tích $n = pq$ | RSA | Shor (polynomial) |
| **DLP** (finite field) | Tìm $x$: $g^x \equiv h$ | DH, ElGamal, DSA | Shor (polynomial) |
| **ECDLP** | Tìm $k$: $Q = kP$ trên EC | ECDH, ECDSA | Shor (polynomial) |
| **SVP/CVP** | Tìm vector ngắn nhất trong lattice | LWE, SIS, NTRU | Không có thuật toán hiệu quả |
| **LWE** | Phân biệt $(\mathbf{A}, \mathbf{As+e})$ và $(\mathbf{A}, \mathbf{u})$ | Kyber, Dilithium | Không có thuật toán hiệu quả |
| **SIS** | Tìm $\mathbf{x}$ ngắn: $\mathbf{Ax} = 0$ | Dilithium (sign) | Không có thuật toán hiệu quả |
| **CSIDH** | Tìm isogeny giữa hai curves | CSIDH | Quantum speedup nhưng vẫn khó |

---

## 8. Bảng tổng hợp: Primitive → Toán học

| Primitive | Nhánh toán học nền tảng | Bài toán khó |
|-----------|------------------------|--------------|
| RSA | Lý thuyết số | Factoring |
| DH, ElGamal | Lý thuyết số, Nhóm | DLP |
| ECDH, ECDSA | Đường cong elliptic | ECDLP |
| Pairing-based (BLS, IBE) | Đường cong elliptic, Galois theory | ECDLP + pairing assumption |
| Kyber, Dilithium | Lattice | LWE / Module-LWE |
| Falcon, NTRU | Lattice, Ring theory | NTRU problem |
| SPHINCS+, XMSS | Hash functions | Collision/preimage resistance |
| McEliece | Coding theory | Syndrome decoding |
| CSIDH, SQISign | Isogeny, Complex multiplication | CSIDH action problem |
| Groth16, PLONK | Pairing, Polynomial algebra | Knowledge of exponent assumption |
| FHE (CKKS, BGV) | Lattice, Ring theory | Ring-LWE |
| HMAC, AES (security) | Information theory, Group theory | One-wayness, PRP assumption |

---

## 9. Tài liệu tham khảo

- Hoffstein, Pipher, Silverman — *An Introduction to Mathematical Cryptography*, Springer 2014
- Washington, L.C. — *Elliptic Curves: Number Theory and Cryptography*, CRC Press 2008
- Silverman, J.H. — *The Arithmetic of Elliptic Curves*, Springer 2009
- Boneh & Shoup — *A Graduate Course in Applied Cryptography* (toc.cryptobook.us) — Ch. 2, 8
- Peikert, C. — *A Decade of Lattice Cryptography* (2016), IACR ePrint 2015/939
- Andrea Corbellini — *Elliptic Curve Cryptography: a gentle introduction* (blog, 2015)
