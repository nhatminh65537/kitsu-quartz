---
title: "32. Lattice-Based PQC"
type: foundation
tags: [crypto, pqc, lattice, lwe, ring-lwe, module-lwe, kyber, dilithium]
aliases: [Lattice-Based PQC, LWE Cryptography, ML-KEM, ML-DSA]
created: 2026-04-18
---

> **Prerequisites**: [[26-lattice-attacks-lll|26. Lattice Attacks — LLL]], [[31-post-quantum-overview|31. PQC Overview]]  
> **Lesson type**: Foundation + Scheme
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $q$ | Prime modulus (public parameter) |
> | $n$ | Polynomial degree (dimension parameter) |
> | $\mathbb{Z}_q$ | Vành số nguyên modulo $q$: $\{0, \ldots, q-1\}$ |
> | $\mathbb{Z}_q[x]$ | Ring đa thức với hệ số trong $\mathbb{Z}_q$ |
> | $R_q$ | $\mathbb{Z}_q[x]/(x^n+1)$ — quotient polynomial ring |
> | $\mathbf{A}$ | Ma trận (boldface hoa) |
> | $\mathbf{s}, \mathbf{e}, \mathbf{b}$ | Vector (boldface thường) |
> | $\chi_\sigma$ | Discrete Gaussian distribution độ lệch chuẩn $\sigma$ |
> | $\langle \mathbf{a}, \mathbf{s} \rangle$ | Inner product $\sum_i a_i s_i$ |
> | SVP | Shortest Vector Problem |
> | SIVP | Shortest Independent Vectors Problem |
> | NTT | Number Theoretic Transform |

---

## 1. Motivation: Tại Sao Lattice Là Nền Tảng PQC Mạnh Nhất?

Trong bốn gia đình PQC, **lattice-based cryptography** là lựa chọn hàng đầu của ngành công nghiệp và NIST vì ba lý do:

**Hiệu suất thực tế**: ML-KEM key size ~800 bytes, tốc độ tương đương ECDH. Các scheme khác (McEliece: 1 MB key, SPHINCS+: 50 KB signature) tụt hậu xa về hiệu suất.

**Worst-case security reduction**: Đây là ưu điểm toán học then chốt. Regev chứng minh rằng phá LWE trên **average case** khó ít nhất bằng giải SVP/SIVP trên **worst case**. RSA không có property này — giả thiết RSA là "factoring khó trên average" mà không có reduction về worst-case hardness.

**Tính linh hoạt**: LWE có thể xây dựng KEM, signature, FHE, IBE, ABE, ZKP — một hard problem, nhiều primitive.

---

## 2. Lattice: Nhắc Lại Cơ Bản

Ta biết lattice $\Lambda$ là tập hợp tổ hợp nguyên của một tập basis vectors $\{\mathbf{b}_1, \ldots, \mathbf{b}_n\} \subset \mathbb{R}^m$:

$$
\Lambda = \left\{ \sum_{i=1}^n z_i \mathbf{b}_i \;\middle|\; z_i \in \mathbb{Z} \right\}
$$

Hai bài toán khó trên lattice:

> [!note] SVP và CVP
> **SVP (Shortest Vector Problem)**: Cho lattice $\Lambda$, tìm vector ngắn nhất $\mathbf{v} \in \Lambda \setminus \{\mathbf{0}\}$.  
> **CVP (Closest Vector Problem)**: Cho lattice $\Lambda$ và target $\mathbf{t} \notin \Lambda$, tìm điểm lattice $\mathbf{v} \in \Lambda$ gần $\mathbf{t}$ nhất.

Cả SVP và CVP đều NP-hard ở trường hợp xấu nhất và không có thuật toán lượng tử hiệu quả. LWE được coi là **bài toán trung bình** (average-case problem) tương đương với SVP worst-case.

---

## 3. Learning With Errors (LWE): Định Nghĩa Chính Thức

LWE được Oded Regev đề xuất năm 2005 và giành giải Gödel 2018 vì tầm quan trọng của nó.

> [!note] Định nghĩa — LWE Problem
> **Parameters**: Dimension $n \in \mathbb{Z}^+$, modulus $q \geq 2$, error distribution $\chi$ (discrete Gaussian trên $\mathbb{Z}$, độ lệch chuẩn nhỏ so với $q$).  
> **LWE Distribution**: Với secret $\mathbf{s} \stackrel{R}{\leftarrow} \mathbb{Z}_q^n$, một **LWE sample** là:
>
> $$
> (\mathbf{a}, b) = (\mathbf{a},\; \langle \mathbf{a}, \mathbf{s} \rangle + e \bmod q) \quad \text{với } \mathbf{a} \stackrel{R}{\leftarrow} \mathbb{Z}_q^n,\; e \stackrel{R}{\leftarrow} \chi
> $$
>
> **Search-LWE**: Cho $m$ samples $(\mathbf{a}_i, b_i)$, tìm $\mathbf{s}$.  
> **Decision-LWE**: Phân biệt $m$ LWE samples khỏi $m$ cặp ngẫu nhiên $(\mathbf{a}_i, u_i)$ với $u_i \stackrel{R}{\leftarrow} \mathbb{Z}_q$.

![[assets/img-03-lwe-intuition.png]]
_Hình 3: Trái — hệ phương trình tuyến tính không có lỗi (easy, Gaussian elimination). Phải — LWE có lỗi nhỏ (hard). Worst-case to average-case reduction là lý do tin tưởng LWE._

---

## 4. Tại Sao LWE Khó?

Không có lỗi $e$, bài toán $b = \langle \mathbf{a}, \mathbf{s} \rangle \bmod q$ là hệ phương trình tuyến tính — dễ giải bằng Gaussian elimination trong $O(n^3)$.

Khi thêm lỗi $e$ nhỏ, Gaussian elimination cho kết quả sai. Không thể biết $\mathbf{s}$ từ $b$ vì $b$ có thể tương ứng với nhiều cặp $(\mathbf{s}, e)$ khác nhau. Để recover $\mathbf{s}$, về cơ bản cần liệt kê tất cả các cách phân phối lỗi — exponential trong $n$.

Các thuật toán lattice tốt nhất (BKZ, sieving) giải LWE trong thời gian $2^{O(n)}$ — không có quantum speedup đáng kể nào được biết đến. Shor's algorithm không áp dụng vì LWE không có cấu trúc group/period mà Shor khai thác.

> [!abstract] Theorem — Regev's Hardness Reduction (2005)
> Với parameters thích hợp $(n, q, \chi)$, solving search-LWE ít nhất khó bằng giải $\widetilde{O}(n)$-approximate SIVP trên arbitrary $n$-dimensional lattice (worst-case):
>
> $$
> \text{SIVP}_\gamma \leq_{\text{quantum}} \text{LWE}_{n,q,\chi}
> $$
>
> Tức là: nếu có thuật toán $(t, \epsilon)$-efficient giải LWE, thì có thuật toán lượng tử $\text{poly}(t/\epsilon)$ giải SIVP với approximation factor $\gamma = \widetilde{O}(n^{1.5}/\alpha)$ (với $\alpha = \sigma \sqrt{2\pi}/q$).

**Proof sketch.** Regev xây dựng quantum reduction: giả sử có oracle $\mathcal{A}$ giải LWE. Dùng $\mathcal{A}$ như subroutine để giải CVP trên lattice tùy ý bằng cách embed CVP instance vào LWE instance phù hợp. CVP $\gamma$-approximate reduce về SIVP $\gamma$-approximate. Toàn bộ reduction là quantum nhưng assumption (SIVP) là classical. $\blacksquare$

*(Full proof: Regev, STOC 2005; Peikert's classical reduction, 2009.)*

---

## 5. Từ LWE Lên Ring-LWE Và Module-LWE

### 5.1. Vấn Đề Của Plain LWE

Plain LWE dùng matrix $\mathbf{A} \in \mathbb{Z}_q^{m \times n}$. Public key phải lưu toàn bộ $\mathbf{A}$ — tốn $O(n^2)$ bytes. Với $n = 1024$, $q = 2^{12}$: $\mathbf{A}$ chiếm $1024^2 \times 12/8 \approx 1.5$ MB. Không thực tế.

### 5.2. Ring-LWE: Tận Dụng Cấu Trúc Đa Thức

**Ý tưởng**: Thay vector bằng đa thức trong ring $R_q = \mathbb{Z}_q[x]/(x^n+1)$. Ma trận $\mathbf{A} \in \mathbb{Z}_q^{m \times n}$ được thay bằng một đa thức $a \in R_q$ — mọi sample đều là multiply trong ring.

> [!note] Định nghĩa — Ring-LWE
> **Setting**: Ring $R_q = \mathbb{Z}_q[x]/(x^n+1)$ với $n$ là lũy thừa 2, $q$ nguyên tố, $q \equiv 1 \pmod{2n}$.  
> **Ring-LWE Sample**: Với secret $s \stackrel{R}{\leftarrow} R_q$ và error $e \stackrel{R}{\leftarrow} \chi_R$ (Gaussian trên $R$):
>
> $$
> (a,\; b = a \cdot s + e \bmod (x^n+1, q)) \quad \text{với } a \stackrel{R}{\leftarrow} R_q
> $$
>
> Phép nhân $a \cdot s$ trong $R_q$ tương đương convolution mod $x^n+1$.

**Key insight**: Thay vì lưu $\mathbf{A}$ ($O(n^2)$ size), chỉ cần lưu $a$ ($O(n)$ size — một đa thức). Polynomial multiplication trong $R_q$ tính được hiệu quả qua **NTT (Number Theoretic Transform)** trong $O(n \log n)$.

**Worst-case reduction**: Lyubashevsky, Peikert, Regev (2010) chứng minh Ring-LWE reduce về worst-case Ideal-SVP — tốt hơn plain LWE về efficiency, có reduction tương đương về security (modulo giả thiết về ideal lattice).

### 5.3. Module-LWE: Cân Bằng Tối Ưu

Module-LWE kết hợp LWE và Ring-LWE: dùng ma trận nhỏ $k \times k$ của các phần tử Ring.

> [!note] Định nghĩa — Module-LWE (MLWE)
> **Setting**: Ring $R_q = \mathbb{Z}_q[x]/(x^n+1)$, module dimension $k \geq 1$.  
> **MLWE Sample**: Với secret $\mathbf{s} \in R_q^k$ và error $\mathbf{e} \in R_q^k$:
>
> $$
> (\mathbf{A},\; \mathbf{b} = \mathbf{A} \cdot \mathbf{s} + \mathbf{e} \bmod (x^n+1, q))
> \quad \mathbf{A} \stackrel{R}{\leftarrow} R_q^{k \times k}
> $$
>
> $\mathbf{A}$ là ma trận $k \times k$ các polynomial trong $R_q$; phép nhân $\mathbf{A} \cdot \mathbf{s}$ là matrix-vector product trong ring.

**Khi $k = 1$**: Module-LWE trở thành Ring-LWE.
**Khi $n = 1$**: Module-LWE trở thành plain LWE.

Bằng cách chọn $k$ và $n$, có thể điều chỉnh tradeoff giữa key size và security assumption. ML-KEM dùng $n=256$, $k \in \{2, 3, 4\}$.

![[assets/img-04-lwe-variants-params.png]]
_Hình 4: Evolution từ LWE sang Ring-LWE sang Module-LWE. Bảng parameter của ML-KEM (FIPS 203) và ML-DSA (FIPS 204). Key size tính bằng bytes._

---

## 6. ML-KEM (FIPS 203): Cơ Chế KEM Dựa Trên Module-LWE

ML-KEM là KEM (Key Encapsulation Mechanism): Alice encapsulate một shared secret bằng Bob's public key; Bob decapsulate để lấy shared secret.

Cấu trúc bên trong ML-KEM gồm hai tầng: **K-PKE** (IND-CPA secure public key encryption) ở tầng dưới và **FO transform** (Fujisaki-Okamoto) nâng lên **IND-CCA2** ở tầng trên.

### 6.1. K-PKE: CPA-Secure Encryption

> [!note] Scheme — K-PKE (Simplified ML-KEM Inner Layer)
> **Setting**: $R_q = \mathbb{Z}_q[x]/(x^n+1)$, $n=256$, $q=3329$, $k \in \{2,3,4\}$, $\eta \in \{2,3\}$ (noise bound).
>
> **$\mathsf{KeyGen}()$**
> - Sinh ma trận $\mathbf{A} \stackrel{R}{\leftarrow} R_q^{k \times k}$ từ seed $\rho$ (expand bằng XOF/SHAKE-128)
> - Sinh $\mathbf{s}, \mathbf{e} \stackrel{R}{\leftarrow} B_\eta^k$ (centered binomial distribution, secret vectors)
> - Tính $\mathbf{t} = \mathbf{A} \cdot \mathbf{s} + \mathbf{e} \in R_q^k$
> - Output: $\mathsf{pk} = (\mathbf{A}, \mathbf{t})$, $\mathsf{sk} = \mathbf{s}$
>
> **$\mathsf{Enc}(\mathsf{pk}, m \in \{0,1\}^{256})$**
> - Sinh $\mathbf{r}, \mathbf{e}_1 \stackrel{R}{\leftarrow} B_\eta^k$, $e_2 \stackrel{R}{\leftarrow} B_\eta$
> - Tính $\mathbf{u} = \mathbf{A}^\top \cdot \mathbf{r} + \mathbf{e}_1 \in R_q^k$
> - Tính $v = \mathbf{t}^\top \cdot \mathbf{r} + e_2 + \lfloor q/2 \rceil \cdot m \in R_q$
> - Output: ciphertext $(\mathbf{u}, v)$; compress về byte representation
>
> **$\mathsf{Dec}(\mathsf{sk}, (\mathbf{u}, v))$**
> - Tính $w = v - \mathbf{s}^\top \cdot \mathbf{u} = e_2 + \mathbf{e}_1^\top \cdot \mathbf{r} - \mathbf{s}^\top \cdot \mathbf{e}_1 + \lfloor q/2 \rceil \cdot m$
> - Round $w$ về $\{0,1\}^{256}$: bit $i$ là 1 nếu $w_i$ gần $q/2$, là 0 nếu gần $0$
> - Output: $m$

**Correctness sketch**: Tính $v - \mathbf{s}^\top \cdot \mathbf{u}$:

$$
v - \mathbf{s}^\top \mathbf{u} = (\mathbf{t}^\top \mathbf{r} + e_2 + \lfloor q/2\rceil m) - \mathbf{s}^\top(\mathbf{A}^\top \mathbf{r} + \mathbf{e}_1)
$$

$$
= (\mathbf{A}\mathbf{s} + \mathbf{e})^\top \mathbf{r} + e_2 + \lfloor q/2\rceil m - \mathbf{s}^\top \mathbf{A}^\top \mathbf{r} - \mathbf{s}^\top \mathbf{e}_1
$$

$$
= \mathbf{e}^\top \mathbf{r} + e_2 - \mathbf{s}^\top \mathbf{e}_1 + \lfloor q/2\rceil m
$$

Sai số $\mathbf{e}^\top \mathbf{r} + e_2 - \mathbf{s}^\top \mathbf{e}_1$ nhỏ (tổng của các Gaussians nhỏ). Khi sai số nhỏ hơn $q/4$, rounding về 0 hoặc $\lfloor q/2 \rceil$ cho kết quả đúng.

### 6.2. ML-KEM: Từ CPA Lên CCA2

ML-KEM áp dụng **Fujisaki-Okamoto (FO) transform** lên K-PKE để đạt IND-CCA2:

> [!note] Scheme — ML-KEM (FIPS 203, Simplified)
> **$\mathsf{ML-KEM.KeyGen}()$**
> - Chạy K-PKE.KeyGen, thêm $H(\mathsf{pk})$ vào sk để dùng trong decap
> - Output: $\mathsf{ek}$ (encapsulation key = pk), $\mathsf{dk}$ (decapsulation key)
>
> **$\mathsf{ML-KEM.Encaps}(\mathsf{ek})$**
> - Sinh random $m \leftarrow \{0,1\}^{256}$
> - $(K, r) = G(m \| H(\mathsf{ek}))$ với $G$ là hash (SHA3-512)
> - $c = \text{K-PKE.Enc}(\mathsf{ek}, m; r)$ (dùng $r$ làm randomness)
> - Output: $(K, c)$ với $K \in \{0,1\}^{256}$ là shared key
>
> **$\mathsf{ML-KEM.Decaps}(\mathsf{dk}, c)$**
> - $m' = \text{K-PKE.Dec}(\mathsf{sk}, c)$
> - $(K', r') = G(m' \| H(\mathsf{ek}))$
> - $c' = \text{K-PKE.Enc}(\mathsf{ek}, m'; r')$
> - **Nếu** $c' = c$: output $K'$; **Nếu không**: output $K_{\text{implicit reject}}$ (hash ngẫu nhiên)

**Tại sao FO transform cho IND-CCA2?** Key insight: Enc được làm **deterministic** bằng cách lấy randomness từ hash của message. Trong Decaps, re-encrypt và kiểm tra $c' = c$ phát hiện ciphertext bị modify. Implicit rejection (output random key thay vì lỗi) ngăn timing oracle.

> [!abstract] Theorem — ML-KEM IND-CCA2 Security
> Trong Random Oracle Model, ML-KEM đạt IND-CCA2 nếu Module-LWE là hard:
>
> $$
> \mathbf{Adv}^{\text{IND-CCA2}}_{\text{ML-KEM}}(\mathcal{A}) \leq \mathbf{Adv}^{\text{MLWE}}_{n,k,q,\eta}(\mathcal{B}) + \mathbf{Adv}^{\text{PKE-OW-CPA}}_{\text{K-PKE}}(\mathcal{C}) + \mathsf{negl}(\lambda)
> $$

*(Proof dựa trên FO transform của Hofheinz, Hövelmanns, Kiltz, 2017; security proof đầy đủ trong FIPS 203 spec.)*

---

## 7. Module-SIS: Hard Problem Của ML-DSA

Để xây dựng **signature** (thay vì KEM), cần hard problem khác: **Short Integer Solution (SIS)**.

> [!note] định nghĩa — Module-SIS (MSIS)
> **Parameters**: Ring $R_q = \mathbb{Z}_q[x]/(x^n+1)$, dimension $k$, bound $\beta$.  
> **MSIS Problem**: Cho $\mathbf{A} \stackrel{R}{\leftarrow} R_q^{k \times l}$, tìm vector ngắn $\mathbf{z} \in R_q^l$, $\mathbf{z} \neq \mathbf{0}$, sao cho:
>
> $$
> \mathbf{A} \cdot \mathbf{z} = \mathbf{0} \pmod{q} \quad \text{và} \quad \|\mathbf{z}\|_\infty \leq \beta
> $$
>
> Nói nôm na: tìm "short" solution cho hệ đồng nhất $\mathbf{A}\mathbf{z} \equiv \mathbf{0}$.

**Quan hệ với SVP**: Giải MSIS tương đương tìm vector ngắn trong lattice $\Lambda^\perp(\mathbf{A}) = \{\mathbf{z} : \mathbf{A}\mathbf{z} \equiv \mathbf{0}\}$. Đây là bài toán SVP trên lattice được xác định bởi $\mathbf{A}$.

---

## 8. ML-DSA (FIPS 204): Fiat-Shamir With Aborts

ML-DSA (trước là Dilithium) dùng paradigm **"Fiat-Shamir with Aborts"** của Lyubashevsky (2009) — biến lattice identification protocol thành signature, tương tự Schnorr nhưng phức tạp hơn vì cần kiểm soát distribution của response.

**Ý tưởng cốt lõi**:
1. Signer commit: sinh random polynomial $\mathbf{y}$, tính $\mathbf{w} = \mathbf{A} \cdot \mathbf{y}$.
2. Challenge: $c = H(\mathbf{w}, m)$ — một polynomial sparse (nhiều hệ số bằng 0, vài hệ số $\pm 1$).
3. Response: $\mathbf{z} = \mathbf{y} + c \cdot \mathbf{s}_1$ — nhưng chỉ publish nếu $\|\mathbf{z}\|_\infty$ đủ nhỏ (nếu không, **abort** và thử lại với $\mathbf{y}$ mới).

Lý do abort: nếu publish $\mathbf{z}$ với mọi $\mathbf{y}$, distribution của $\mathbf{z}$ sẽ phụ thuộc vào $\mathbf{s}_1$ (private key) và verifier có thể deduce thông tin. Bằng cách reject và retry, distribution của $\mathbf{z}$ được "làm phẳng" — $\mathbf{z}$ trông như Gaussian thuần túy không phụ thuộc $\mathbf{s}_1$.

> [!note] Scheme — ML-DSA (Simplified)
> **Setting**: $R_q = \mathbb{Z}_q[x]/(x^n+1)$, $n=256$, $q=8380417$, matrix $\mathbf{A} \in R_q^{k \times l}$ (public), bounds $\gamma_1, \gamma_2, \beta$.
>
> **$\mathsf{KeyGen}()$**
> - Sinh $\mathbf{A} \stackrel{R}{\leftarrow} R_q^{k \times l}$ từ seed $\rho$
> - Sinh $\mathbf{s}_1 \in R_q^l$, $\mathbf{s}_2 \in R_q^k$ (small: coefficients trong $\{-\eta, \ldots, \eta\}$)
> - Tính $\mathbf{t} = \mathbf{A} \cdot \mathbf{s}_1 + \mathbf{s}_2$
> - Output: $\mathsf{pk} = (\rho, \mathbf{t})$, $\mathsf{sk} = (\rho, \mathbf{s}_1, \mathbf{s}_2)$
>
> **$\mathsf{Sign}(\mathsf{sk}, m)$**
> - **Repeat until no abort**:
>   - Sinh $\mathbf{y} \stackrel{R}{\leftarrow} S_{\gamma_1}^l$ (vector polynomial với coefficients trong $(-\gamma_1, \gamma_1)$)
>   - Tính $\mathbf{w} = \mathbf{A} \cdot \mathbf{y} \in R_q^k$; decompose $\mathbf{w} = \mathbf{w}_1 \cdot 2\gamma_2 + \mathbf{w}_0$ (HighBits)
>   - Tính challenge $c = H(\mu \| \mathbf{w}_1) \in \mathcal{C}$ với $\mu = H(\mathsf{pk} \| m)$; $c$ sparse, $\|c\|_1 = \tau$
>   - Tính $\mathbf{z} = \mathbf{y} + c \cdot \mathbf{s}_1$
>   - **Abort nếu** $\|\mathbf{z}\|_\infty \geq \gamma_1 - \beta$ hoặc $\|\mathbf{w}_0 - c \cdot \mathbf{s}_2\|_\infty \geq \gamma_2 - \beta$
> - Output: $\sigma = (\mathbf{z}, \mathbf{w}_1, c)$ (hoặc compact encoding)
>
> **$\mathsf{Verify}(\mathsf{pk}, m, \sigma)$**
> - Tính $\mu = H(\mathsf{pk} \| m)$
> - Tính $\mathbf{w}'_1 = \mathsf{HighBits}(\mathbf{A} \cdot \mathbf{z} - c \cdot \mathbf{t}, 2\gamma_2)$
> - Kiểm tra: $\|\mathbf{z}\|_\infty < \gamma_1 - \beta$ và $c = H(\mu \| \mathbf{w}'_1)$
> - Output: 1 (valid) nếu cả hai điều kiện thỏa, ngược lại 0

**Correctness**: Nếu $\sigma$ hợp lệ (không abort):

$$
\mathbf{A} \cdot \mathbf{z} - c \cdot \mathbf{t} = \mathbf{A}(\mathbf{y} + c\mathbf{s}_1) - c(\mathbf{A}\mathbf{s}_1 + \mathbf{s}_2) = \mathbf{A}\mathbf{y} - c\mathbf{s}_2 = \mathbf{w} - c\mathbf{s}_2
$$

Nếu $\mathbf{s}_2$ nhỏ và $c$ sparse, $c\mathbf{s}_2$ nhỏ → HighBits của $\mathbf{A}\mathbf{z} - c\mathbf{t}$ bằng HighBits của $\mathbf{w}$ → $\mathbf{w}'_1 = \mathbf{w}_1$ → hash verify thành công.

> [!abstract] Theorem — ML-DSA EUF-CMA Security
> Trong ROM, ML-DSA đạt EUF-CMA nếu MLWE và MSIS đều hard:
>
> $$
> \mathbf{Adv}^{\text{EUF-CMA}}_{\text{ML-DSA}}(\mathcal{A}) \leq \mathbf{Adv}^{\text{MLWE}}(\mathcal{B}) + \mathbf{Adv}^{\text{MSIS}}(\mathcal{C}) + \mathsf{negl}(\lambda)
> $$

*(Proof: Ducas et al., CRYSTALS-Dilithium submission; Lyubashevsky, EUROCRYPT 2012.)*

---

## 9. Falcon (FN-DSA): NTRU Lattice Signature

Falcon dùng NTRU lattice và Gaussian sampling, khác biệt hoàn toàn với ML-DSA về kỹ thuật.

**Hard problem**: NTRU problem — tìm short vectors trong NTRU lattice. NTRU đề xuất từ 1998 (Hoffstein, Pipher, Silverman), là one of oldest PQC proposals.

**Ưu điểm**: Signature nhỏ hơn ML-DSA đáng kể (665 bytes cho Falcon-512 vs 2420 bytes cho ML-DSA-44).

**Nhược điểm quan trọng**: Falcon đòi hỏi **discrete Gaussian sampling** chính xác trong fast Fourier sampling. Sampling sai (không đúng distribution) → side-channel leak private key. Rất khó implement an toàn về constant-time. Đây là lý do Falcon ít được khuyến nghị cho general use dù signature nhỏ hơn.

> [!warning] Falcon Implementation Caution
> Falcon yêu cầu floating-point Gaussian sampling với độ chính xác cực cao. Nhiều phương pháp approximate Gaussian (rounding, rejection sampling không đúng) dẫn đến signature distribution bị biased → adversary có thể recover private key từ đủ nhiều signatures. Chỉ dùng reference implementation đã được kiểm chứng — không tự implement.

---

## 10. FrodoKEM: Conservative LWE Option

FrodoKEM dùng **plain LWE** (không ring, không module) — conservative nhất trong các lattice schemes.

- **Ưu điểm**: Không dựa vào ideal lattice assumption — security assumption yếu hơn (chỉ cần plain LWE). Nếu có breakthrough phá Ring-LWE/MLWE bằng cách khai thác ring structure, FrodoKEM vẫn an toàn.
- **Nhược điểm**: Key size lớn — FrodoKEM-640: public key 9616 bytes (so với 1184 bytes của ML-KEM-768).
- **Use case**: Tình huống cần security margin cực cao và không tối ưu về bandwidth.

---

## 11. Tóm Tắt So Sánh Các Scheme

| Scheme | Standard | Type | Hard Problem | pk size | Signature/CT | Notes |
|--------|----------|------|-------------|---------|----------|-------|
| ML-KEM-768 | FIPS 203 | KEM | MLWE | 1184 B | 1088 B (CT) | Recommended default |
| ML-DSA-65 | FIPS 204 | Sig | MLWE+MSIS | 1952 B | 3309 B | Recommended default |
| FN-DSA-512 | Upcoming | Sig | NTRU | 897 B | 665 B | Compact, hard to implement |
| SLH-DSA-128s | FIPS 205 | Sig | Hash CR | 32 B | 7856 B | Conservative, large sig |
| FrodoKEM-640 | - | KEM | LWE (plain) | 9616 B | 9720 B | Maximum conservative |

---

## 12. CTF Relevance

> [!info] CTF Relevance — ⭐⭐ (emerging)
> Lattice-based PQC CTF challenges xuất hiện trong **advanced CTF** (HITCON, PlaidCTF, DownUnderCTF advanced).
>
> **Pattern thường gặp**:
> - Weak LWE parameters: $q$ quá nhỏ, $n$ quá nhỏ, hoặc error distribution quá nhỏ → LLL/BKZ giải được.
> - NTRU với small key → lattice attack khôi phục private key.
> - Nonce reuse trong Dilithium-like scheme → tương tự ECDSA nonce reuse.
> - Compression rounding issues → information leak.
>
> **Nhận dạng**:
> - Source code có `from mlkem import`, `kyber`, `dilithium`, `ntru` → PQC challenge.
> - Parameters `n=256, q=3329, k=2` → ML-KEM-512.
> - Polynomial ring, NTT → likely Ring-LWE based.

---

## 13. Toolbox

```python
import oqs

kem = oqs.KeyEncapsulation("ML-KEM-768")
pk = kem.generate_keypair()
ct, ss_enc = oqs.KeyEncapsulation("ML-KEM-768").encap_secret(pk)
ss_dec = kem.decap_secret(ct)
assert ss_enc == ss_dec
print("Shared secret:", ss_dec.hex())

sig = oqs.Signature("ML-DSA-65")
pk_sig = sig.generate_keypair()
message = b"Hello PQC"
signature = sig.sign(message)
is_valid = oqs.Signature("ML-DSA-65").verify(message, signature, pk_sig)
print("Signature valid:", is_valid)
```

```python
from sage.all import *

n, q = 256, 3329
R = Zmod(q)['x']
x = R.gen()
Rq = R.quotient(x^n + 1)

def sample_error(ring, k, eta=2):
    poly = []
    for _ in range(k):
        coeffs = [ZZ.random_element(-eta, eta+1) for _ in range(n)]
        poly.append(ring(coeffs))
    return vector(ring, poly)

```

---

## 14. Tóm Tắt

- **LWE (Regev 2005)**: Hệ phương trình tuyến tính "noisy" — khó giải cả classically và quantumly. Security reduce về worst-case SVP.
- **Ring-LWE → Module-LWE**: Structured variants giúp key size từ $O(n^2)$ về $O(n)$; ML-KEM dùng Module-LWE.
- **SIS**: Hard problem cho signature — tìm short vector trong lattice kernel.
- **ML-KEM (FIPS 203)**: K-PKE (CPA) + FO transform → IND-CCA2 KEM. Key ~1 KB, CT ~1 KB.
- **ML-DSA (FIPS 204)**: Fiat-Shamir with Aborts trên Module-LWE+SIS. Sig ~2-4 KB.
- **Falcon/FN-DSA**: NTRU lattice, compact signature (~665 B), nhưng cực khó implement safely.
- **FrodoKEM**: Plain LWE, most conservative, large keys (~10 KB).

---

## 15. References

- Regev, O. — *On Lattices, Learning with Errors, Random Linear Codes, and Cryptography*, STOC 2005; JACM 2009
- Lyubashevsky, Peikert, Regev — *On Ideal Lattices and Learning With Errors Over Rings*, EUROCRYPT 2010
- Ducas et al. — *CRYSTALS-Dilithium: A Lattice-Based Digital Signature Scheme*, TCHES 2018
- Bos et al. — *CRYSTALS-Kyber: A CCA-Secure Module-Lattice-Based KEM*, EuroS&P 2018
- Hofheinz, Hövelmanns, Kiltz — *A Modular Analysis of the Fujisaki-Okamoto Transformation*, TCC 2017
- Lyubashevsky — *Fiat-Shamir with Aborts: Applications to Lattice and Factoring-Based Signatures*, ASIACRYPT 2009
- NIST FIPS 203 (ML-KEM), FIPS 204 (ML-DSA) — August 2024
- Peikert, C. — *A Decade of Lattice Cryptography*, Foundations and Trends in TCS, 2016
