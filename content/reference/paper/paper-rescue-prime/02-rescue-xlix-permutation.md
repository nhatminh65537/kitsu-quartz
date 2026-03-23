---
title: "02. Rescue-XLIX Permutation"
type: scheme
tags: [rescue-prime, rescue-xlix, permutation, sponge, arithmetization, scheme, lesson-02]
aliases: [Rescue-XLIX, Rescue Forty Nine Permutation]
source: "Rescue-Prime: a Standard Specification (SoK) — Szepieniec, Ashur, Dhooghe, 2020. https://eprint.iacr.org/2020/1143"
created: 2026-03-15
---

> **Prerequisites**: Trường hữu hạn $\mathbb{F}_p$ và phép toán cơ bản, MDS matrix (maximum distance separable code), sponge construction (xem [[01-arithmetization-oriented-hash|01. Arithmetization-Oriented Hash & Sponge]])  
> 🔴 **Prerequisite references**: Aly et al. — *Marvellous* [AABS+19] (design rationale gốc, security arguments); lý thuyết MDS codes (bất kỳ giáo trình coding theory nào)  
> **Lesson type**: Scheme  
> **Covers**: §2.1 (Parameters), §2.3 (Rescue-XLIX Permutation), §2.4 (Selecting the Parameters: MDS matrix, round constants, number of rounds), §2.5 (Computing α and α⁻¹); Algorithm 3–7; Figure 2
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ghi chú |
> |---------|---------|---------|
> | $p$ | Số nguyên tố xác định trường $\mathbb{F}_p$, $\|p\| \geq 32$ bits | Primary parameter |
> | $m$ | State width — số field elements trong state | Primary parameter |
> | $c_p$ | Capacity; $r_p = m - c_p$ là rate | Primary parameter |
> | $s$ | Target security level (bits), $80 \leq s \leq 512$ | Primary parameter |
> | $\alpha$ | Exponent trong S-box thuận: $x \mapsto x^\alpha$ | Số nguyên dương nhỏ nhất coprime với $p-1$ |
> | $\alpha^{-1}$ | Exponent trong inverse S-box: $(x^\alpha)^{\alpha^{-1}} = x$ | Nghịch đảo của $\alpha$ trong $\mathbb{Z}/(p-1)$ |
> | $M \in \mathbb{F}_p^{m \times m}$ | MDS matrix — áp dụng cho state | Vandermonde-derived |
> | $N$ | Số rounds của permutation | Derived parameter |
> | $\{C_i\}_{i=0}^{2mN-1}$ | Round constants — $2mN$ elements trong $\mathbb{F}_p$ | SHAKE-256 derived |
> | $f_{\text{RXLIX}} : \mathbb{F}_p^m \to \mathbb{F}_p^m$ | Rescue-XLIX permutation | Đối tượng chính của bài này |

---

## Motivation

Rescue-XLIX là **cryptographic permutation** — khối xây dựng cốt lõi của Rescue-Prime. Nó được dùng bởi sponge construction để biến đổi state sau mỗi lần hấp thụ input.

Yêu cầu thiết kế:
1. **Indistinguishability**: không thể phân biệt $f_{\text{RXLIX}}$ với một random permutation → đảm bảo generic security của sponge.
2. **Thấp bậc đại số**: biểu diễn arithmetization ngắn gọn trên $\mathbb{F}_p$ → hiệu quả trong SNARK/STARK/MPC.
3. **Deterministic**: với cùng tham số, mọi implementer tạo ra cùng một permutation.

Rescue-XLIX đạt được điều này bằng cách xen kẽ **power map thuận** ($x \mapsto x^\alpha$, bậc thấp) với **power map nghịch** ($x \mapsto x^{\alpha^{-1}}$, bậc cao nhưng được arithmetize qua "folding"), cùng với MDS matrix và round constants.

---

## Tham số của Rescue-XLIX

> [!note] Định nghĩa 2.1 — Bộ tham số Rescue-XLIX
> Một instance Rescue-XLIX được xác định hoàn toàn bởi bộ **primary parameters** $(p, m, c_p, s)$ và **derived parameters** $(\alpha, \alpha^{-1}, M, N, \{C_i\})$:
>
> **Primary parameters:**
> - $p$: số nguyên tố, $\|p\| \geq 32$ bits — xác định trường $\mathbb{F}_p$.
> - $m > 1$: state width — số field elements trong state.
> - $c_p < m$: capacity; $r_p = m - c_p$ là rate.
> - $s$: security level, $80 \leq s \leq 512$ bits.
>
> **Derived parameters** (tính từ primary):
> - $\alpha$, $\alpha^{-1}$: S-box exponents (xem §2.5 / Alg. 6).
> - $M \in \mathbb{F}_p^{m \times m}$: MDS matrix (xem §2.4 / Alg. 4).
> - $N$: số rounds (xem §2.4 / Alg. 7).
> - $\{C_i\}_{i=0}^{2mN-1} \subset \mathbb{F}_p$: $2mN$ round constants (xem §2.4 / Alg. 5).

---

## Rescue-XLIX Permutation

### Cấu trúc một round

Mỗi round của Rescue-XLIX gồm **6 bước** theo thứ tự cố định:

```
Input state  →  [S-box]  →  [MDS]  →  [+C₂ᵢₘ..₂ᵢₘ₊ₘ₋₁]
             →  [Inv S-box]  →  [MDS]  →  [+C₂ᵢₘ₊ₘ..₂ᵢₘ₊₂ₘ₋₁]
             →  Output state
```

> [!note] Scheme 2.2 — Rescue-XLIX Round Function (round thứ $i$)
> **Input**: state $\mathbf{s} \in \mathbb{F}_p^m$, index round $i \in \{0, \ldots, N-1\}$  
> **Output**: state mới $\mathbf{s}' \in \mathbb{F}_p^m$
>
> **Bước 1 — S-box layer (thuận):**
> $$s_j \leftarrow s_j^\alpha \quad \text{cho mọi } j \in \{0, \ldots, m-1\}$$
>
> **Bước 2 — Linear layer (MDS):**
> $$\mathbf{s} \leftarrow M \cdot \mathbf{s}$$
>
> **Bước 3 — Constants injection (first half):**
> $$s_j \leftarrow s_j + C_{2im+j} \quad \text{cho mọi } j$$
>
> **Bước 4 — Inverse S-box layer:**
> $$s_j \leftarrow s_j^{\alpha^{-1}} \quad \text{cho mọi } j$$
>
> **Bước 5 — Linear layer (MDS):**
> $$\mathbf{s} \leftarrow M \cdot \mathbf{s}$$
>
> **Bước 6 — Constants injection (second half):**
> $$s_j \leftarrow s_j + C_{2im+m+j} \quad \text{cho mọi } j$$

Figure 2 trong paper minh hoạ trực quan luồng này với $m = 3$ (3 lanes song song).

### Toàn bộ permutation

> [!note] Scheme 2.3 — Rescue-XLIX Permutation ($f_{\text{RXLIX}}$)
> **Input**: state $\mathbf{s} \in \mathbb{F}_p^m$, bộ tham số $(p, m, c_p, s, \alpha, \alpha^{-1}, N, M, \{C_i\})$  
> **Output**: state biến đổi $\mathbf{s}' \in \mathbb{F}_p^m$
>
> **Thực hiện**: áp dụng round function (Scheme 2.2) lần lượt cho $i = 0, 1, \ldots, N-1$.

**SageMath (Algorithm 3)**:

```python
def rescue_XLIX_permutation(parameters, state):
    p, m, capacity, security_level, alpha, alphainv, N, MDS, round_constants = parameters
    Fp = state[0,0].parent()

    for i in range(N):
        for j in range(m):
            state[j,0] = state[j,0]^alpha
        state = MDS * state
        for j in range(m):
            state[j,0] += round_constants[i*2*m + j]

        for j in range(m):
            state[j,0] = state[j,0]^alphainv
        state = MDS * state
        for j in range(m):
            state[j,0] += round_constants[i*2*m + m + j]

    return state
```

---

## Chọn tham số

### MDS Matrix

> [!note] Scheme 2.4 — Sinh MDS Matrix (Algorithm 4)
> **Input**: $p$ (số nguyên tố), $m$ (state width)  
> **Output**: $M \in \mathbb{F}_p^{m \times m}$ — MDS matrix
>
> 1. Tìm $g$ là phần tử nguyên thủy (primitive element) nhỏ nhất của $\mathbb{F}_p$: kiểm tra $g^{(p-1)/q} \neq 1$ với mọi nhân tử nguyên tố $q \mid (p-1)$.
> 2. Xây dựng **Vandermonde matrix** $V \in \mathbb{F}_p^{m \times 2m}$ với $V_{i,j} = g^{ij}$ (chỉ số từ 0).
> 3. Đưa $V$ về dạng hàng echelon thu gọn (reduced row-echelon form): $V \to (I \mid M^T)$.
> 4. Output $M$ = transpose của nửa phải.

```python
def get_mds_matrix(p, m):
    Fp = FiniteField(p)
    g = Fp(2)
    while g.multiplicative_order() != p-1:
        g = g + 1
    V = matrix([[g^(i*j) for j in range(0, 2*m)] for i in range(0, m)])
    V_ech = V.echelon_form()
    MDS = V_ech[:, m:].transpose()
    return MDS
```

**Tại sao Vandermonde đảm bảo MDS?** Các hàng của $V$ tạo thành basis cho một MDS code (mã khoảng cách cực đại). MDS matrix $M$ đảm bảo rằng mọi $k \leq m$ phần tử input thay đổi sẽ ảnh hưởng đến tất cả $m$ phần tử output — đây là tính chất diffusion quan trọng cho bảo mật.

### Round Constants

> [!note] Scheme 2.5 — Sinh Round Constants (Algorithm 5)
> **Input**: $p, m, c_p, s, N$  
> **Output**: danh sách $\{C_i\}_{i=0}^{2mN-1} \subset \mathbb{F}_p$
>
> 1. Tính $b = \lceil \|p\| / 8 \rceil + 1$ bytes cho mỗi constant ($\|p\|$ = số bit của $p$).
> 2. Expand seed string `"Rescue-XLIX(p,m,cp,s)"` bằng **SHAKE-256** để lấy $b \cdot 2mN$ bytes.
> 3. Với mỗi chunk $b$ bytes (little-endian): chuyển thành integer, reduce mod $p$ → một constant.

```python
def get_round_constants(p, m, capacity, security_level, N):
    bytes_per_int = ceil(len(bin(p)[2:]) / 8) + 1
    num_bytes = bytes_per_int * 2 * m * N
    seed_string = "Rescue-XLIX(%i,%i,%i,%i)" % (p, m, capacity, security_level)
    byte_string = SHAKE256(bytes(seed_string, "ascii"), num_bytes)
    round_constants = []
    Fp = FiniteField(p)
    for i in range(2*m*N):
        chunk = byte_string[bytes_per_int*i : bytes_per_int*(i+1)]
        integer = sum(256^j * ZZ(chunk[j]) for j in range(len(chunk)))
        round_constants.append(Fp(integer % p))
    return round_constants
```

**Tại sao SHAKE-256 và "nothing-up-my-sleeve"?** Round constants được sinh từ một seed công khai, xác định — bất kỳ ai cũng có thể verify chúng. Điều này loại trừ khả năng designer chọn constants ẩn trapdoor. Đây là thiết kế "nothing-up-my-sleeve" chuẩn trong cryptography.

### Tính $\alpha$ và $\alpha^{-1}$

> [!note] Scheme 2.6 — Tính S-box Exponents (Algorithm 6)
> **Input**: $p$ (số nguyên tố)  
> **Output**: $(\alpha, \alpha^{-1})$ với $\alpha^{-1} \equiv \alpha^{-1} \pmod{p-1}$
>
> - $\alpha$ = **số nguyên dương nhỏ nhất** thỏa $\gcd(\alpha, p-1) = 1$.
> - $\alpha^{-1}$ = nghịch đảo của $\alpha$ trong $\mathbb{Z}/(p-1)$, tính bằng extended Euclidean algorithm.
>
> **Trường hợp đặc biệt**: nếu $\gcd(p-1, 3) = 1$ thì $\alpha = 3$ và $\alpha^{-1} = \frac{2p-1}{3}$.

```python
def get_alphas(p):
    for alpha in range(3, p):
        if gcd(alpha, p-1) == 1:
            break
    g, alphainv, garbage = xgcd(alpha, p-1)
    return (alpha, (alphainv % (p-1)))
```

**Tại sao cần $\gcd(\alpha, p-1) = 1$?** Với $x \in \mathbb{F}_p^*$, ánh xạ $x \mapsto x^\alpha$ là một **permutation** (bijection) trên $\mathbb{F}_p^*$ khi và chỉ khi $\gcd(\alpha, p-1) = 1$ — theo định lý nhóm cyclic. Điều kiện này đảm bảo S-box có thể nghịch đảo được.

### Số Rounds

> [!note] Scheme 2.7 — Tính Số Rounds (Algorithm 7)
> **Input**: $p, m, c_p, s, \alpha$  
> **Output**: $N$ — số rounds của permutation
>
> **Bước 1 — Gröbner basis bound**: tìm $\ell_1$ nhỏ nhất sao cho
>
> $$\binom{d_{\text{con}}(\ell_1) + v(\ell_1)}{v(\ell_1)}^2 > 2^s$$
>
> với:
> - $d_{\text{con}}(N) = \lfloor \tfrac{1}{2}(\alpha - 1) \cdot m \cdot (N-1) + 2 \rfloor$
> - $v(N) = m(N-1) + r_p$
>
> **Bước 2 — Security margin 50% + sanity minimum**:
>
> $$N = \lceil 1.5 \cdot \max(5, \ell_1) \rceil$$

```python
def get_number_of_rounds(p, m, capacity, security_level, alpha):
    rate = m - capacity
    dcon = lambda N: floor(0.5 * (alpha-1) * m * (N-1) + 2)
    v    = lambda N: m*(N-1) + rate
    target = 2^security_level
    for l1 in range(1, 25):
        if binomial(v(l1) + dcon(l1), v(l1))^2 > target:
            break
    return ceil(1.5 * max(5, l1))
```

**Tại sao binomial coefficient này?** Một Gröbner basis attack trên hệ phương trình của Rescue-XLIX có độ phức tạp xấp xỉ $\binom{d_{\text{con}} + v}{v}^2$ phép toán trường — đây là XL/F4 complexity estimate. Ta chọn $N$ sao cho con số này vượt quá $2^s$, sau đó cộng thêm 50% buffer.

---

## Correctness — Tính Invertibility

> [!abstract] Theorem 2.8 — $f_{\text{RXLIX}}$ là permutation
> Với bất kỳ bộ tham số hợp lệ $(p, m, c_p, s)$ và derived parameters tương ứng, $f_{\text{RXLIX}} : \mathbb{F}_p^m \to \mathbb{F}_p^m$ là một **bijection** (permutation).

**Proof sketch.** Mỗi round function là composée của các ánh xạ khả nghịch:
- S-box $x \mapsto x^\alpha$: khả nghịch vì $\gcd(\alpha, p-1) = 1$ (Scheme 2.6).
- Inverse S-box $x \mapsto x^{\alpha^{-1}}$: khả nghịch vì $(\alpha^{-1})^{-1} = \alpha \pmod{p-1}$.
- MDS matrix $M$: khả nghịch vì MDS matrix có determinant $\neq 0$ trên $\mathbb{F}_p$.
- Constants injection $x \mapsto x + C_i$: khả nghịch vì là translation trên $\mathbb{F}_p$.

Composition của các bijections là bijection. $N$ rounds là composition của $N$ bijections → toàn bộ permutation là bijection. $\blacksquare$

---

## Summary

- Rescue-XLIX là permutation $f_{\text{RXLIX}} : \mathbb{F}_p^m \to \mathbb{F}_p^m$ với $N$ rounds.
- Mỗi round gồm: **S-box** ($x^\alpha$) → **MDS** → **+constants** → **Inv S-box** ($x^{\alpha^{-1}}$) → **MDS** → **+constants**.
- **MDS matrix**: sinh từ Vandermonde matrix trên $\mathbb{F}_p$ — đảm bảo diffusion toàn diện.
- **Round constants**: sinh từ SHAKE-256 với seed `"Rescue-XLIX(p,m,cp,s)"` — nothing-up-my-sleeve.
- **$\alpha$**: số nguyên dương nhỏ nhất coprime với $p-1$, thường là 3 hoặc 5.
- **Số rounds $N$**: $\lceil 1.5 \cdot \max(5, \ell_1) \rceil$ với $\ell_1$ từ Gröbner basis bound + 50% security margin.
- Tính **invertibility** đảm bảo bởi mỗi thành phần là bijection.

---

## References

- [AABS+19] Aly, Ashur, Ben-Sasson, Dhooghe, Szepieniec — *Design of symmetric-key primitives for advanced cryptographic protocols*, ePrint 2019/426 (🔴 Prerequisite; 🟡 dùng trong Lesson 04)
- [Bey+20a] Beyne et al. — *Out of Oddity*, CRYPTO 2020 (⚪ security analysis)
- [KR20] Keller, Rosemarin — *Mind the Middle Layer: HADES design revisited*, ePrint 2020/179 (⚪)
