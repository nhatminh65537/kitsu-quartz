---
title: "05. Deviations from the Standard Specification & Variants"
type: specification
tags: [rescue-prime, variants, deviations, DEC, small-field, specification, lesson-05]
aliases: [Rescue-Prime Deviations, Rescue-Prime Variants, DEC Function]
source: "Rescue-Prime: a Standard Specification (SoK) — Szepieniec, Ashur, Dhooghe, 2020. https://eprint.iacr.org/2020/1143"
created: 2026-03-15
---

> **Prerequisites**: Rescue-XLIX Permutation (xem [[02-rescue-xlix-permutation|02. Rescue-XLIX Permutation]]), Rescue-Prime Hash Function (xem [[03-rescue-prime-hash-function|03. Rescue-Prime Hash Function]])  
> 🔴 **Prerequisite references**: Lý thuyết sponge construction (Bertoni et al.) — generic security của DEC functions và sponge với extended squeezing  
> **Lesson type**: Specification  
> **Covers**: §4.1 (Small Fields and High Security), §4.2 (Alternate MDS Matrices), §4.3 (Omission of the Padding Rule), §4.4 (Algebraically Dependent Round Constants), §4.5 (Permitting $n > r_p$ — DEC functions); Algorithm 8 (`get_number_of_rounds1`), Algorithm 9 (`rescue_prime_DEC`), Algorithm 10 (`rescue_prime_sponge`)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ghi chú |
> |---------|---------|---------|
> | $\ell_0$ | Round count lower bound từ differential attack | Chỉ dùng khi $\|p\|$ nhỏ |
> | $\ell_1$ | Round count lower bound từ Gröbner basis attack | Dùng trong §2.4 (Alg. 7) |
> | DEC | Doubly-Extendable Cryptographic function | Input và output có độ dài tùy ý |
> | $f_{\text{R}0\text{-sponge}}$ | Rescue-Prime sponge với extended squeezing | Alg. 10 |

---

## Scope và Mục đích

§2 của paper là specification chuẩn — cách đơn giản nhất và an toàn nhất để tạo một instance Rescue-Prime. §4 là danh sách các **trường hợp đặc biệt** khi developer có lý do chính đáng để lệch khỏi chuẩn đó.

> [!warning] Khuyến cáo của paper
> Paper khuyến cáo mạnh mẽ: **"always follow §2 whenever possible"**. Chỉ lệch khi thực sự cần thiết và nên **tìm expert để tư vấn** trước khi quyết định. Mỗi deviation đều có một **Confidence Level** đi kèm — đánh giá mức độ tin tưởng vào security claim của variant đó.

---

## Deviation 4.1 — Small Fields and High Security

### Khi nào áp dụng

§2 yêu cầu $\|p\| \geq 32$ bits và xác định số rounds chỉ dựa trên **Gröbner basis bound** $\ell_1$ (tấn công bậc cao về algebraic, Algorithm 7). Điều này hoạt động tốt vì với $\|p\| \geq 32$, Gröbner basis luôn là tấn công mạnh nhất.

Tuy nhiên khi $\|p\|$ nhỏ (e.g., 4–16 bits) hoặc state size $m$ cũng nhỏ, **differential cryptanalysis** có thể trở nên mạnh hơn Gröbner basis. Trong trường hợp này phải tính thêm bound $\ell_0$ từ differential attack.

### Differential attack bound

Số rounds tối thiểu để chống differential cryptanalysis:

$$
\ell_0 = \frac{2s}{\log_2(p^{m+1}) - \log_2((\alpha - 1)^{m+1})} = \frac{2s}{(m+1)(\log_2 p - \log_2(\alpha-1))}
$$

Trực giác: mỗi round làm giảm xác suất differential propagation; $\ell_0$ là số rounds cần để xác suất tấn công tổng xuống dưới $2^{-s}$.

### Số rounds cho small-field / high-security

> [!note] Scheme 5.1 — Số Rounds cho Small Field (Algorithm 8)
> **Input**: $p, m, c_p, s, \alpha$  
> **Output**: $N$ — số rounds
>
> 1. Tính $\ell_1$ như trong Algorithm 7 (Gröbner basis bound).
> 2. Tính $\ell_0 = \dfrac{2s}{(m+1)(\log_2 p - \log_2(\alpha - 1))}$ (differential bound).
> 3. Output $N = \lceil 1.5 \cdot \max(5,\, \ell_0,\, \ell_1) \rceil$.

```python
def get_number_of_rounds1(p, m, capacity, security_level, alpha):
    rate = m - capacity
    dcon = lambda N: floor(0.5 * (alpha-1) * m * (N-1) + 2)
    v    = lambda N: m*(N-1) + rate
    target = 2^security_level
    for l1 in range(1, 25):
        if binomial(v(l1) + dcon(l1), v(l1))^2 > target:
            break

    l0 = 2*security_level / (log(1.0*p^(m+1), 2.0) - log(1.0*(alpha-1)^(m+1), 2.0))

    return ceil(1.5 * max(5, l0, l1))
```

> [!note] Thay đổi so với Algorithm 7
> Algorithm 7 (§2): `max(5, l1)`. Algorithm 8 (§4.1): `max(5, l0, l1)` — thêm differential bound $\ell_0$.

**Các thành phần không thay đổi**: chọn MDS matrix (vẫn dùng Vandermonde) và round constants (vẫn dùng SHAKE-256 seed) giữ nguyên theo §2.4.

**Confidence Level**: **Medium-high**. Variant này được covered trong generic security argument của [AABS+19]. Tuy nhiên phần lớn analysis tập trung vào setting "tự nhiên" (field lớn), nên đây là deviation ít được scrutinize hơn.

> [!tip] 💡 Agent note
> Với ứng dụng thực tế, small-field Rescue-Prime ít phổ biến vì lợi thế arithmetization phát huy mạnh nhất trên prime fields lớn (e.g., $p \approx 2^{64}$ hay $2^{254}$). Algorithm 8 hữu ích trong các cài đặt đặc biệt như FRI-based proof systems dùng small fields.

---

## Deviation 4.2 — Alternate MDS Matrices

### Khi nào áp dụng

§2.4 chỉ định Vandermonde matrix làm MDS matrix chuẩn. Tuy nhiên trong một số trường hợp, MDS matrix khác có thể **hiệu quả hơn** theo một tiêu chí cụ thể (ví dụ: sparse MDS matrix có ít phép nhân hơn, hay circulant matrix dễ hardware hơn).

### Rule

> [!note] Deviation 5.2 — Alternate MDS
> **Bất kỳ MDS matrix nào** đều có thể dùng thay thế Vandermonde matrix.
>
> Các thành phần **không thay đổi**: số rounds ($\ell_0$, $\ell_1$ giữ nguyên), round constants (SHAKE-256 giữ nguyên).

**Confidence Level**: **High**. [AABS+19] lập luận security đối với bất kỳ MDS matrix nào — không giới hạn type. Quyết định chỉ dùng Vandermonde trong §2 là để đơn giản hóa specification, không phải vì lý do bảo mật.

---

## Deviation 4.3 — Omission of the Padding Rule

### Khi nào áp dụng

Padding rule (§2.2) cần thiết khi sponge hấp thụ **input có độ dài tùy ý**. Nếu độ dài input là **cố định và biết trước** — ví dụ khi xây dựng Merkle tree với leaf data kích thước cố định — padding là không cần thiết.

### Rule

> [!note] Deviation 5.3 — Omit Padding
> Bỏ qua padding khi **tất cả các điều kiện sau đều đúng**:
> - Độ dài input $k$ là cố định và biết trước.
> - $k$ đã là bội của $r_p$ (không cần pad).
> - Không có ambiguity: không bao giờ cần phân biệt hai inputs có độ dài khác nhau.
>
> Trong trường hợp này, dùng trực tiếp `rescue_prime_hash` (Algorithm 1) thay vì `rescue_prime_wrapper` (Algorithm 2).

**Các thành phần không thay đổi**: tất cả — số rounds, MDS, round constants giữ nguyên.

**Confidence Level**: **Medium-high**. Đây là tính chất chuẩn của sponge construction, độc lập với Rescue-Prime. Tuy nhiên cần cẩn thận trong implementation: nếu bất cứ lúc nào system cho phép input độ dài thay đổi, phải dùng padding để tránh trivial collision.

---

## Deviation 4.4 — Algebraically Dependent Round Constants

### Khi nào áp dụng

§2.4 sinh $2mN$ round constants độc lập bằng SHAKE-256. Trong một số ứng dụng, việc lưu trữ hay truyền $2mN$ constants riêng lẻ là bất tiện — cần một cách sinh constants **từ một seed nhỏ hơn** với cấu trúc đại số.

### Hai phương án được đề xuất

> [!note] Deviation 5.4 — Algebraically Dependent Round Constants
>
> **Phương án A — Geometric sequence theo từng block:**
> - Chọn $C_0, C_m, C_{2m}, \ldots$ (mỗi bước $m$ vị trí) ngẫu nhiên, với rejection sampling để đảm bảo $C_{im}$ là generator của $\mathbb{F}_p \setminus \{0\}$.
> - Đặt $C_{im+j} = C_{im}^{j+1}$ cho $0 < j < m$.
>
> **Phương án B — Affine transformation giữa các block:**
> - Chọn $(C_0, \ldots, C_{m-1})$ ngẫu nhiên, cùng với ma trận khả nghịch $A \in \mathbb{F}_p^{m \times m}$ và vector $\mathbf{b} \in \mathbb{F}_p^m$.
> - Với $1 \leq i < 2N$, derive block $(C_{im}, \ldots, C_{(i+1)m-1})^T = A \cdot (C_{(i-1)m}, \ldots, C_{im-1})^T + \mathbf{b}$.

**Các thành phần không thay đổi**: số rounds, MDS matrix.

**Confidence Level**: **High** (cần tư vấn expert để tránh pitfalls cụ thể). Mục tiêu của round constants là đảm bảo mỗi round "khác nhau" về mặt đại số — cả hai phương án trên đều đạt được điều này. Tuy nhiên phụ thuộc vào cấu trúc cụ thể, có thể có những tấn công đặc thù mà expert cần evaluate.

---

## Deviation 4.5 — Permitting $n > r_p$ (DEC Functions)

### Khi nào áp dụng

Rescue-Prime chuẩn (§2.2) giới hạn output ở **tối đa $r_p$ field elements** — một lần squeeze duy nhất. Tuy nhiên, một số ứng dụng cần output **dài tùy ý** — ví dụ PRF, stream cipher, hay XOF (extendable output function).

**DEC (Doubly-Extendable Cryptographic) function**: nhận input tùy ý và tạo output tùy ý (đến giới hạn bảo mật). Rescue-Prime là trường hợp đặc biệt của DEC với output length cố định $\leq r_p$.

### Extended Squeeze — Rescue-Prime Sponge

Để tạo output dài hơn $r_p$, sau lần squeeze đầu tiên ta áp dụng thêm $f_{\text{RXLIX}}$ rồi squeeze tiếp — lặp lại cho đến đủ output.

> [!note] Scheme 5.5 — Rescue-Prime Sponge với Extended Squeezing (Algorithm 10)
> **Input**: tham số, `input_sequence` (độ dài bội của $r_p$), `output_length` ($n$ — số field elements cần)  
> **Output**: chuỗi $n$ field elements
>
> **Absorb phase**: giống Algorithm 1 (absorb toàn bộ input, áp dụng $f_{\text{RXLIX}}$ mỗi $r_p$ elements).
>
> **Extended squeeze phase**: đọc ra $r_p$ elements từ state; nếu chưa đủ $n$ elements, áp dụng thêm $f_{\text{RXLIX}}$ rồi đọc tiếp; lặp đến khi đủ; truncate về đúng $n$.

```python
def rescue_prime_sponge(parameters, input_sequence, output_length):
    p, m, capacity, security_level, alpha, alphainv, N, MDS, round_constants = parameters
    rate = m - capacity
    Fp = FiniteField(p)

    assert len(input_sequence) % rate == 0

    state = matrix([[Fp(0)] for i in range(m)])

    absorb_index = 0
    while absorb_index < len(input_sequence):
        for i in range(0, rate):
            state[i,0] += input_sequence[absorb_index]
            absorb_index += 1
        state = rescue_XLIX_permutation(parameters, state)

    output_sequence = []
    squeeze_index = 0
    while squeeze_index < output_length:
        for i in range(0, rate):
            output_sequence.append(state[i,0])
            squeeze_index += 1
        if squeeze_index < output_length:
            state = rescue_XLIX_permutation(parameters, state)

    return output_sequence[:output_length]
```

### DEC Wrapper với Padding

> [!note] Scheme 5.6 — Rescue-Prime DEC Function (Algorithm 9)
> **Input**: tham số, `input_sequence` (độ dài tùy ý), `output_length`  
> **Output**: chuỗi `output_length` field elements
>
> 1. Pad input bằng rule $1\|0^*$ (giống Algorithm 2).
> 2. Gọi `rescue_prime_sponge(parameters, padded_input, output_length)`.

```python
def rescue_prime_DEC(parameters, input_sequence, output_length):
    p, m, capacity, security_level, alpha, alphainv, N, MDS, round_constants = parameters
    rate = m - capacity
    Fp = FiniteField(p)

    padded_input = input_sequence + [Fp(1)]
    while len(padded_input) % rate != 0:
        padded_input.append(Fp(0))

    return rescue_prime_sponge(parameters, padded_input, output_length)
```

**Quan hệ giữa các algorithms**:

```
rescue_prime_wrapper (Alg. 2)
    └── rescue_prime_hash (Alg. 1) — output_length = rp cố định

rescue_prime_DEC (Alg. 9)
    └── rescue_prime_sponge (Alg. 10) — output_length tùy ý
```

Algorithm 2 là trường hợp đặc biệt của Algorithm 9 với `output_length = rp`.

**Các thành phần không thay đổi**: số rounds, MDS matrix. Round constants giữ nguyên — paper ghi chú "Selection the Round Constants is high" (có vẻ là typo trong paper gốc, ý là confidence level là high).

**Confidence Level**: **High**. DEC functions được covered trong generic security argument của sponge SoK [referenced as §4.3 of sponge SoK trong paper]. Extended squeezing là tính năng chuẩn của sponge, không đặt ra vấn đề bảo mật mới nếu capacity đủ lớn.

---

## Tổng hợp tất cả Deviations

| # | Deviation | Thay đổi | Không thay đổi | Confidence |
|---|-----------|----------|----------------|------------|
| 4.1 | Small field/high security | Thêm $\ell_0$ differential bound vào chọn $N$ | MDS, round constants | Medium-high |
| 4.2 | Alternate MDS | Bất kỳ MDS matrix nào | Số rounds, round constants | High |
| 4.3 | Omit padding | Bỏ `rescue_prime_wrapper`, dùng Alg. 1 trực tiếp | Số rounds, MDS, round constants | Medium-high |
| 4.4 | Algebraic constants | Constants sinh từ seed nhỏ với cấu trúc đại số (2 phương án) | Số rounds, MDS | High (cần expert) |
| 4.5 | DEC / $n > r_p$ | Extended squeezing (Alg. 10), DEC wrapper (Alg. 9) | Số rounds, MDS, round constants | High |

---

## Summary

- §4 là danh sách deviations cho trường hợp đặc biệt — **không dùng** nếu §2 đã đủ.
- **4.1 Small field**: thêm $\ell_0$ từ differential attack vào bound khi $\|p\|$ nhỏ; Algorithm 8.
- **4.2 Alternate MDS**: bất kỳ MDS matrix nào đều an toàn — quyết định Vandermonde trong §2 chỉ là standardization.
- **4.3 Omit padding**: hợp lệ khi input length **cố định và biết trước** — tránh extension attack.
- **4.4 Algebraic constants**: hai phương án sinh constants với cấu trúc đại số từ seed nhỏ hơn; cần expert review.
- **4.5 DEC / extended output**: Rescue-Prime sponge (Alg. 10) + DEC wrapper (Alg. 9) cho output dài tùy ý; Algorithm 2 là trường hợp đặc biệt của Algorithm 9.

---

## References

- [AABS+19] Aly, Ashur, Ben-Sasson, Dhooghe, Szepieniec — *Design of Symmetric-Key Primitives for Advanced Cryptographic Protocols*, IACR ToSC 2020(3) (🔴 Prerequisite — security arguments cho mọi deviations)
- [BGS20] Ben-Sasson, Goldberg, Levit — *STARK-friendly hash survey*, ePrint 2020/948 (⚪)
- [Bey+20a] Beyne et al. — *Out of Oddity*, CRYPTO 2020 (⚪)
