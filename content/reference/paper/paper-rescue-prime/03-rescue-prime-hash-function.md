---
title: "03. Rescue-Prime Hash Function"
type: scheme
tags: [rescue-prime, hash-function, sponge, padding, scheme, lesson-03]
aliases: [Rescue-Prime Hash, fR0]
source: "Rescue-Prime: a Standard Specification (SoK) — Szepieniec, Ashur, Dhooghe, 2020. https://eprint.iacr.org/2020/1143"
created: 2026-03-15
---

> **Prerequisites**: Sponge construction và generic security (xem [[01-arithmetization-oriented-hash|01. AO Hash & Sponge]]), Rescue-XLIX permutation (xem [[02-rescue-xlix-permutation|02. Rescue-XLIX Permutation]])  
> 🔴 **Prerequisite references**: Bertoni, Daemen, Peeters, Van Assche — *Sponge functions* (thiết kế sponge construction gốc; nền tảng lý thuyết cho generic security)  
> **Lesson type**: Scheme  
> **Covers**: §2.2 (Rescue-Prime Hash Function, Padding, Truncation and generic security); Algorithm 1 (`rescue_prime_hash`), Algorithm 2 (`rescue_prime_wrapper`); Figure 1
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ghi chú |
> |---------|---------|---------|
> | $f_{\text{R}0} : \mathbb{F}_p^* \to \mathbb{F}_p^{r_p}$ | Rescue-Prime hash function | Đối tượng chính của bài này |
> | $f_{\text{R}0\text{-sponge}} : \mathbb{F}_p^* \to \mathbb{F}_p^?$ | Rescue-Prime sponge (output không giới hạn) | Truncation → $f_{\text{R}0}$ |
> | $f_{\text{RXLIX}} : \mathbb{F}_p^m \to \mathbb{F}_p^m$ | Rescue-XLIX permutation | Định nghĩa trong Lesson 02 |
> | $\mathbf{s} \in \mathbb{F}_p^m$ | State vector — $m$ field elements | Khởi tạo $\mathbf{s} = \mathbf{0}$ |
> | $r_p = m - c_p$ | Rate — số elements absorb mỗi lần | |
> | $c_p$ | Capacity | |
> | $n \leq r_p$ | Số output elements | Truncation parameter |

---

## Motivation

Rescue-XLIX là một **permutation** — nó không trực tiếp là một hash function. Để biến permutation thành hash function (nhiều-input-một-output, có tính one-way), ta cần một framework: **sponge construction**.

Rescue-Prime = sponge + Rescue-XLIX. Bài học này đặc tả chính xác cách sponge hoạt động: cách hấp thụ (absorb) một chuỗi field elements tùy ý, cách bổ sung padding cho input có độ dài tùy ý, và cách đọc ra (squeeze) output.

---

## Rescue-Prime Hash Function

> [!note] Scheme 3.1 — Rescue-Prime Hash Function ($f_{\text{R}0}$)
> **Type**: Cryptographic hash function (arithmetic sponge)  
> **Input**: chuỗi field elements $\mathbf{x} \in \mathbb{F}_p^*$ (độ dài tùy ý, bội của $r_p$)  
> **Output**: $r_p$ field elements $\mathbf{y} \in \mathbb{F}_p^{r_p}$  
> **Setting**: Rescue-XLIX permutation $f_{\text{RXLIX}}$ với tham số $(p, m, c_p, s)$
>
> **$\mathsf{Init}$**: State $\mathbf{s} \leftarrow \mathbf{0} \in \mathbb{F}_p^m$.
>
> **$\mathsf{Absorb}$**: Lặp lại cho đến khi hết input:
>
> $$s_i \leftarrow s_i + x_{\text{idx}+i} \quad (i = 0, \ldots, r_p - 1)$$
>
> $$\mathbf{s} \leftarrow f_{\text{RXLIX}}(\mathbf{s})$$
>
> **$\mathsf{Squeeze}$**: Output $r_p$ elements đầu tiên:
>
> $$\mathbf{y} = (s_0, s_1, \ldots, s_{r_p - 1})$$

Trực quan: input được XOR (cộng trên $\mathbb{F}_p$) vào phần **rate** của state theo từng khối $r_p$ elements, mỗi khối kích hoạt một lần chạy $f_{\text{RXLIX}}$. Phần **capacity** ($c_p$ elements cuối) không bao giờ bị input ghi trực tiếp — đây là "entropy bí mật" duy trì tính one-way.

**SageMath (Algorithm 1)**:

```python
def rescue_prime_hash(parameters, input_sequence):
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
    for i in range(0, rate):
        output_sequence.append(state[i,0])

    return output_sequence
```

---

## Padding

`rescue_prime_hash` (Alg. 1) yêu cầu input có độ dài là **bội của $r_p$**. Trong thực tế, input có độ dài tùy ý → cần padding.

> [!note] Scheme 3.2 — Padding Rule của Rescue-Prime
> Để pad một input $\mathbf{x} \in \mathbb{F}_p^k$ (độ dài $k$ tùy ý):
>
> 1. Nối thêm phần tử $1 \in \mathbb{F}_p$ vào sau input: $\mathbf{x} \leftarrow \mathbf{x} \| (1)$.
> 2. Tiếp tục nối thêm $0 \in \mathbb{F}_p$ cho đến khi tổng độ dài là bội của $r_p$.
>
> Ký hiệu: $\text{pad}(\mathbf{x}) = \mathbf{x} \| 1 \| 0^{r_p \cdot \lceil (k+1)/r_p \rceil - k - 1}$.

**SageMath (Algorithm 2)**:

```python
def rescue_prime_wrapper(parameters, input_sequence):
    p, m, capacity, security_level, alpha, alphainv, N, MDS, round_constants = parameters
    rate = m - capacity
    Fp = FiniteField(p)

    padded_input = input_sequence + [Fp(1)]
    while len(padded_input) % rate != 0:
        padded_input.append(Fp(0))

    return rescue_prime_hash(parameters, padded_input)
```

**Tại sao padding $1 \| 0^*$ thay vì chỉ $0^*$?** Padding chỉ bằng $0$ sẽ gây ra **ambiguity**: input $[x_1, x_2]$ và $[x_1, x_2, 0]$ sẽ tạo ra cùng padded sequence nếu $r_p = 2$. Padding $1 \| 0^*$ đảm bảo mỗi độ dài input thực sự khác nhau tạo ra padded input khác nhau — đây là điều kiện cần để tránh **extension attacks**.

> [!tip] 💡 Agent note
> Đây là "simplest padding rule" chuẩn trong sponge literature. Tên kỹ thuật là *pad10\** (nối bit 1 sau đó nối 0 đến đủ block). Trên $\mathbb{F}_p$ thay vì $\mathbb{F}_2$, bit 1 trở thành phần tử $1 \in \mathbb{F}_p$.

---

## Truncation và Generic Security

### Truncation

Với một số ứng dụng chỉ cần $n < r_p$ output elements, chỉ cần **truncate** output của `rescue_prime_wrapper`:

$$f_{\text{R}0}^{(n)}(\mathbf{x}) = \bigl(f_{\text{R}0}(\mathbf{x})\bigr)[0:n]$$

Không cần thay đổi gì trong permutation — chỉ bỏ qua các elements thừa ở output.

### Generic Security

> [!abstract] Theorem 3.3 — Generic Security của Rescue-Prime (§2.2)
> Giả sử $f_{\text{RXLIX}}$ không phân biệt được với một random permutation trên $\mathbb{F}_p^m$. Khi đó Rescue-Prime với output truncate về $n \leq r_p$ field elements đạt mức bảo mật ít nhất:
>
> $$\left\lfloor \log_2\!\left(\sqrt{p} \cdot \min(n, c_p)\right) \right\rfloor \quad \text{bits}$$
>
> chống lại: **collision attack**, **preimage attack**, và **second-preimage attack**.

**Proof sketch.** Đây là kết quả chuẩn từ lý thuyết sponge construction (Bertoni et al.). Với permutation là random, adversary không có cách khai thác cấu trúc nội tại — chỉ có thể tấn công birthday-style. Output space có kích thước $p^n$ (với $n$ elements từ $\mathbb{F}_p$), nên:

- **Collision**: birthday bound cho $p^n$ elements → $\sim p^{n/2}$ queries cần thiết.
- **Preimage / second-preimage**: capacity $c_p$ elements "bí mật" tạo ra $p^{c_p}$ trạng thái nội tại không quan sát được → $\sim p^{c_p/2}$ queries.
- Nút thắt cổ chai là $\min(n, c_p)$ — phần nhỏ hơn quyết định độ khó.
- $\sqrt{p}$ xuất hiện vì mỗi field element có $p$ giá trị, và birthday bound lấy căn bậc hai. $\square$

> [!warning] Điều kiện bảo mật
> Theorem 3.3 **chỉ đúng** khi $f_{\text{RXLIX}}$ thực sự indistinguishable từ random permutation. Tính chất này **không được chứng minh** trong paper này — nó là giả thiết (assumption) được hỗ trợ bởi phân tích cryptanalytic trong [AABS+19] và các paper bảo mật [Bey+20a, Bey+20b]. Xem thêm Lesson 04 để hiểu tại sao các thay đổi trong Rescue-XLIX cải thiện tính chất này.

---

## Ví dụ: Sơ đồ Hoạt động

Figure 1 trong paper mô tả Rescue-Prime với 2 absorbing iterations và $r_p$ input elements mỗi lần:

```
state: [  rate (rp)  |   capacity (cp)   ]
         s0..s_{rp-1}   s_{rp}..s_{m-1}

Absorb iteration 1:
  state[0..rp-1] += m0[0..rp-1]     (XOR với input block 1)
  state = fRXLIX(state)              (áp dụng permutation)

Absorb iteration 2:
  state[0..rp-1] += m1[0..rp-1]     (XOR với input block 2)
  state = fRXLIX(state)              (áp dụng permutation)

Squeeze:
  output = state[0..rp-1]            (đọc phần rate)
```

Phần capacity (màu tối trong Figure 1) không bao giờ được ghi trực tiếp từ input — đây là cơ chế bảo đảm tính one-way của hàm.

---

## Correctness — Determinism và Well-definedness

> [!abstract] Theorem 3.4 — Determinism
> Với bất kỳ input cố định $\mathbf{x} \in \mathbb{F}_p^k$ và bộ tham số cố định, `rescue_prime_wrapper` luôn trả về cùng một output $\mathbf{y} \in \mathbb{F}_p^{r_p}$.

**Proof.** Tất cả các bước đều deterministic: padding rule cố định, phép cộng trên $\mathbb{F}_p$ deterministic, $f_{\text{RXLIX}}$ deterministic (vì tất cả tham số derived đều được sinh deterministic từ $(p, m, c_p, s)$). $\blacksquare$

> [!abstract] Theorem 3.5 — Injection sau Padding
> Padding rule (Scheme 3.2) là **injective**: hai inputs $\mathbf{x} \neq \mathbf{x}'$ luôn cho ra padded inputs $\text{pad}(\mathbf{x}) \neq \text{pad}(\mathbf{x}')$.

**Proof.** Với $|\mathbf{x}| = k$, padded input có phần tử thứ $k$ là $1 \in \mathbb{F}_p$. Nếu $|\mathbf{x}'| = k' \neq k$, padded inputs khác nhau tại vị trí $\min(k, k')$. Nếu $|\mathbf{x}'| = k$ nhưng $\mathbf{x}' \neq \mathbf{x}$, thì hai padded inputs khác nhau tại vị trí đó. $\blacksquare$

---

## Summary

- $f_{\text{R}0} =$ sponge với $f_{\text{RXLIX}}$: khởi tạo state $\mathbf{0}$, absorb từng khối $r_p$ elements rồi áp dụng permutation, squeeze $r_p$ elements đầu tiên.
- **Padding** $1 \| 0^*$ đảm bảo injectivity — hai input khác nhau không bao giờ cho cùng padded input.
- **Truncation** về $n \leq r_p$ elements là hợp lệ — chỉ bỏ qua output thừa.
- **Generic security**: $\lfloor \log_2(\sqrt{p} \cdot \min(n, c_p)) \rfloor$ bits, với giả thiết $f_{\text{RXLIX}}$ là random permutation.
- State capacity $c_p$ không bao giờ bị ghi trực tiếp từ input — đây là nguồn gốc của tính one-way.

---

## References

- [AABS+19] Aly, Ashur, Ben-Sasson, Dhooghe, Szepieniec — *Design of symmetric-key primitives for advanced cryptographic protocols*, IACR ToSC 2020(3) (🔴 Prerequisite / 🟡 dùng trong Lesson 04)
- [Bey+20a] Beyne et al. — *Out of Oddity*, CRYPTO 2020 (⚪ security analysis của Rescue-XLIX)
- [Bey+20b] Beyne et al. — *Report on the security of the Rescue hash function* (⚪)
