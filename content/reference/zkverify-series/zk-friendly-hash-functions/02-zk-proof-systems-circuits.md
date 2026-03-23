---
title: "02. ZK Proof Systems & Arithmetic Circuits"
tags: [cryptography, zk-hash, circuits, r1cs, plonk, lesson-02]
aliases: [ZK Proof Systems Arithmetic Circuits]
created: 2026-03-13
---

> **Prerequisites**: [[01-hash-functions-overview|01. Hash Functions — Nền tảng & Baseline]], finite field $\mathbb{F}_p$, đa thức cơ bản  
> **Objectives**:  
> - Hiểu mô hình tính toán của arithmetic circuit và constraint system
> - Nắm cấu trúc R1CS, PLONK, AIR và khi nào dùng cái nào
> - Biết cách đo "chi phí" của một phép tính trong ZK: số constraints và multiplicative complexity
> - Giải thích được tại sao cộng là "free" nhưng nhân thì không trong ZK

---

## Motivation

Để hiểu tại sao ZK-friendly hash functions quan trọng, cần hiểu chính xác "ZK proof system" làm gì và tại sao một số phép tính tốn kém hơn những phép tính khác.

Nói ngắn gọn: ZK proof system cho phép một **prover** thuyết phục một **verifier** rằng họ biết một giá trị bí mật $w$ thỏa mãn một điều kiện $C(x, w) = \text{true}$, mà không tiết lộ $w$. Điều kiện $C$ được mã hóa thành một hệ phương trình — gọi là **constraint system** — trên trường hữu hạn $\mathbb{F}_p$.

Chi phí của toàn bộ hệ thống tỷ lệ thuận với **kích thước của constraint system**. Hiểu điều này là hiểu tại sao hash function "tốt" trong ZK lại khác hash function "tốt" trong phần còn lại của cuộc sống.

---

## Arithmetic Circuits

> [!definition] Definition 2.1 — Arithmetic Circuit
> Một **arithmetic circuit** (mạch số học) $C$ trên trường $\mathbb{F}_p$ là một đồ thị có hướng không chu trình (DAG) trong đó:
> - **Leaf nodes** là các input hoặc hằng số trong $\mathbb{F}_p$
> - **Internal nodes** là các cổng tính toán: cổng cộng ($+$) hoặc cổng nhân ($\times$)
> - **Output node** là kết quả của circuit
>
> **Kích thước** của circuit = tổng số gates. **Độ sâu** (depth) = độ dài đường đi dài nhất từ input đến output (ảnh hưởng đến khả năng parallelize).

**Ví dụ**: Tính $f(x, y) = x^3 + xy + 1$:

```
        x ──┬──► [×] ──► [×] ──┐
            │    ▲              │
            └────┘   y ──►[×]──┤──► [+] ──► [+] ──► output
                          ▲    │             ▲
                          x────┘             1
```

- Gate 1: $x \times x = x^2$
- Gate 2: $x^2 \times x = x^3$
- Gate 3: $x \times y$
- Gate 4: $x^3 + xy$
- Gate 5: $x^3 + xy + 1$
- Tổng: 3 multiplication gates, 2 addition gates

> [!note] Note 2.2 — Tại sao cộng là "free"?
> Trong nhiều constraint systems (đặc biệt R1CS), **phép cộng không tạo ra constraint mới** vì nó là phép toán tuyến tính — verifier có thể kiểm tra phép cộng "miễn phí" trong quá trình verify. Chỉ **phép nhân** tạo ra constraint thực sự. Do đó, khi đo chi phí ZK của một hàm, ta đếm **số phép nhân** (multiplicative complexity), không phải tổng số phép tính.

---

## R1CS — Rank-1 Constraint System

R1CS là constraint system phổ biến nhất, được dùng bởi Groth16 và Circom.

> [!definition] Definition 2.3 — R1CS
> Một **Rank-1 Constraint System (R1CS)** là một tập các ràng buộc (constraints), mỗi constraint có dạng:
>
> $$(\vec{a}_i \cdot \vec{z}) \cdot (\vec{b}_i \cdot \vec{z}) = \vec{c}_i \cdot \vec{z}$$
>
> trong đó $\vec{z} = (1, x_1, \ldots, x_n, w_1, \ldots, w_m)$ là vector chứa tất cả public inputs ($x_i$) và private witness values ($w_j$), và $\vec{a}_i, \vec{b}_i, \vec{c}_i \in \mathbb{F}_p^{n+m+1}$ là các vector hệ số.
>
> Một **witness** $\vec{z}$ là hợp lệ nếu và chỉ nếu **tất cả** constraints được thỏa mãn.

**Quan sát quan trọng**: Mỗi constraint trong R1CS encode **đúng một phép nhân**. Do đó:

$$\text{Số R1CS constraints} = \text{Số multiplication gates}$$

**Ví dụ tính $x^3$**:

```
Constraint 1: x * x = t₁         (tính x²)
Constraint 2: t₁ * x = t₂        (tính x³)
=> Cần 2 constraints cho x³
```

```python
# Biểu diễn R1CS cho f(x, y) = x*y + x^2
# z = [1, x, y, w1, w2, out]
# w1 = x*y, w2 = x*x, out = w1 + w2

# Constraint 1: x * y = w1
# a1 = [0, 1, 0, 0, 0, 0]  (chọn x)
# b1 = [0, 0, 1, 0, 0, 0]  (chọn y)
# c1 = [0, 0, 0, 1, 0, 0]  (= w1)

# Constraint 2: x * x = w2
# a2 = [0, 1, 0, 0, 0, 0]  (chọn x)
# b2 = [0, 1, 0, 0, 0, 0]  (chọn x)
# c2 = [0, 0, 0, 0, 1, 0]  (= w2)

# Constraint 3: 1 * out = w1 + w2  (linear combination — "free" check)
# a3 = [1, 0, 0, 0, 0, 0]
# b3 = [0, 0, 0, 0, 0, 1]
# c3 = [0, 0, 0, 1, 1, 0]

import numpy as np

# Ví dụ verify witness với x=2, y=3 => out = 2*3 + 2*2 = 10
z = [1, 2, 3, 6, 4, 10]  # [1, x, y, w1=xy, w2=x^2, out]

A = [[0,1,0,0,0,0], [0,1,0,0,0,0], [1,0,0,0,0,0]]
B = [[0,0,1,0,0,0], [0,1,0,0,0,0], [0,0,0,0,0,1]]
C = [[0,0,0,1,0,0], [0,0,0,0,1,0], [0,0,0,1,1,0]]

for i, (a, b, c) in enumerate(zip(A, B, C)):
    lhs = sum(a[j]*z[j] for j in range(6)) * sum(b[j]*z[j] for j in range(6))
    rhs = sum(c[j]*z[j] for j in range(6))
    print(f"Constraint {i+1}: {lhs} = {rhs} => {'OK' if lhs == rhs else 'FAIL'}")
```

---

## PLONK — Permutations over Lagrange-bases

PLONK (và các biến thể: TurboPlonk, UltraPlonk, PlonKish) là constraint system thế hệ mới, linh hoạt hơn R1CS.

> [!definition] Definition 2.4 — PLONK Gate
> PLONK encode computation thông qua **custom gates**. Gate cơ bản của PLONK có dạng:
>
> $$q_L \cdot a + q_R \cdot b + q_O \cdot c + q_M \cdot a \cdot b + q_C = 0$$
>
> trong đó $a, b, c$ là các **wire values** (giá trị trên dây), và $q_L, q_R, q_O, q_M, q_C$ là **selector polynomials** — hằng số được chọn tại compile time để mô tả loại gate.

**Ví dụ cấu hình gates**:

| Gate type | $q_L$ | $q_R$ | $q_O$ | $q_M$ | $q_C$ | Constraint |
|-----------|-------|-------|-------|-------|-------|------------|
| Addition  | 1 | 1 | -1 | 0 | 0 | $a + b - c = 0$ |
| Multiply  | 0 | 0 | -1 | 1 | 0 | $a \cdot b - c = 0$ |
| Constant  | 1 | 0 | 0 | 0 | -k | $a = k$ |
| Boolean   | 1 | 0 | 0 | 1 | 0 | $a + a \cdot a = 0$ (vô nghĩa, xem custom gates) |

**Custom gates trong PLONK**: Ưu điểm lớn của PLONK là có thể thêm **custom gates** cho các operations phổ biến. Ví dụ, Halo2 framework cho phép định nghĩa gate Poseidon S-box với degree 5 trong một gate duy nhất, thay vì nhiều multiplication gates.

### PLONK vs R1CS cho ZK Hash

| | R1CS (Groth16, Circom) | PLONK/TurboPlonk (Halo2) |
|--|------------------------|--------------------------|
| Đơn vị chi phí | Số constraints | Số rows trong execution trace |
| Custom ops | Không | Có (custom gates) |
| Poseidon S-box $x^5$ | 3 constraints ($x^2$, $x^4$, $x^5$) | 1 custom gate |
| Lookup tables | Không native | UltraPlonk hỗ trợ |
| Tính linh hoạt | Thấp | Cao |

---

## AIR — Algebraic Intermediate Representation

AIR là constraint system dùng trong STARK-based proof systems (StarkWare, Polygon Miden, Winterfell).

> [!definition] Definition 2.5 — AIR
> Một **Algebraic Intermediate Representation (AIR)** mô tả computation như một **execution trace** — bảng $T$ có $n$ hàng (steps) và $w$ cột (registers), trong đó mỗi hàng $T[i]$ là state tại bước $i$.
>
> Constraints trong AIR là các **transition constraints**: đa thức $p(T[i], T[i+1]) = 0$ mô tả quan hệ hợp lệ giữa state liên tiếp, và **boundary constraints**: điều kiện tại hàng đầu/cuối.

**Ví dụ**: Tính $x^{2^k}$ bằng repeated squaring:

```
Step | x_col
-----|------
  0  | x₀      (input)
  1  | x₀²
  2  | x₀⁴
  3  | x₀⁸
  k  | x₀^{2^k} (output)

Transition constraint: T[i+1].x = T[i].x * T[i].x
```

**AIR cho STARKs vs R1CS cho SNARKs**:

| | AIR (STARK) | R1CS (SNARK) |
|--|-------------|-------------|
| Proof size | Lớn hơn (logarithmic) | Nhỏ hơn (constant) |
| Trusted setup | Không cần | Cần (Groth16) hoặc không (PLONK) |
| Quantum resistant | Có thể | Không |
| Best hash | Rescue-Prime, Poseidon (Goldilocks) | Poseidon (BN254), MiMC |
| Native field | Goldilocks $2^{64} - 2^{32} + 1$ | BN254 ($\sim 254$ bits) |

> [!note] Note 2.6 — Goldilocks Field trong STARKs
> Nhiều STARK systems dùng **Goldilocks field** $\mathbb{F}_p$ với $p = 2^{64} - 2^{32} + 1$ vì arithmetic rất hiệu quả trên CPU 64-bit. Hash functions muốn tối ưu cho STARK cần được thiết kế cho field này — đây là lý do Rescue-Prime và các hash STARK-native được thiết kế riêng.

---

## Đo Chi phí ZK của Một Hàm

Có ba metric chính khi đánh giá chi phí ZK:

> [!definition] Definition 2.7 — Multiplicative Complexity
> **Multiplicative complexity** của hàm $f$ là số lượng phép nhân **không thể tránh khỏi** (non-linear multiplications) khi biểu diễn $f$ bằng arithmetic circuit trên $\mathbb{F}_p$.
>
> Đây là lower bound trực tiếp cho số R1CS constraints.

### Ví dụ tính multiplicative complexity

```python
# S-box của Poseidon: x^5 trên Fp
# x^5 = x^4 * x = (x^2)^2 * x
# Bước 1: t1 = x * x     (1 multiplication)
# Bước 2: t2 = t1 * t1   (1 multiplication)
# Bước 3: out = t2 * x   (1 multiplication)
# Tổng: 3 multiplications

# S-box của MiMC: x^3
# x^3 = x^2 * x
# Bước 1: t1 = x * x     (1 multiplication)
# Bước 2: out = t1 * x   (1 multiplication)
# Tổng: 2 multiplications

# XOR 32-bit (dùng bit decomposition)
# Mỗi bit a_i cần: a_i*(1-a_i) = 0  => 1 constraint
# 32 bits => 32 constraints cho range check
# Tương tự cho 32 bits của b
# c_i = a_i + b_i - 2*a_i*b_i => 1 constraint per bit
# Tổng: 32 + 32 + 32 = ~96 multiplications cho 1 XOR 32-bit
print("Multiplicative complexity:")
print(f"  x^3 (MiMC): 2 mults")
print(f"  x^5 (Poseidon): 3 mults")
print(f"  XOR 32-bit: ~96 mults")
print(f"  AND 32-bit: ~64 mults")
```

### Bảng so sánh chi phí

| Hash | Proof system | Constraints (est.) | Relative cost |
|------|-------------|-------------------|---------------|
| SHA-256 | R1CS | ~28,000 | 100x |
| Keccak-256 | R1CS | ~150,000 | 600x |
| MiMC-7 (1 input) | R1CS | ~642 | 2.5x |
| Poseidon (t=3) | R1CS | ~240 | 1x (baseline) |
| Poseidon (t=3) | PLONK | ~80 rows | — |
| Rescue-Prime | AIR | ~136 mults | 0.5x |

---

## Witness Generation vs Constraint Satisfaction

Đây là phân biệt quan trọng, đặc biệt khi audit Circom code.

> [!definition] Definition 2.8 — Witness Generation vs Constraints
> Trong Circom (và nhiều ZK DSLs), một program có **hai phần riêng biệt**:
>
> 1. **Witness generation** (còn gọi là "computation phase"): Tính toán giá trị các signal. Chạy như code bình thường. Không tạo constraints.
>
> 2. **Constraint satisfaction**: Các equations phải được thỏa mãn bởi witness. Tạo ra R1CS.
>
> **Bug cực kỳ phổ biến**: Developer viết code compute một giá trị nhưng quên tạo constraint để enforce nó. Prover có thể điền giá trị bất kỳ vào signal đó!

```circom
// BUGGY CODE - Ví dụ minh họa lỗi cơ bản
template BuggySquare() {
    signal input x;
    signal output y;

    // <-- chỉ COMPUTE, không tạo constraint
    y <-- x * x;    // y được TÍNH là x², nhưng không được ENFORCE

    // Prover có thể set y = bất kỳ giá trị nào!
    // Không có constraint nào bắt buộc y == x*x
}

// CORRECT CODE
template CorrectSquare() {
    signal input x;
    signal output y;

    // <== vừa COMPUTE vừa tạo CONSTRAINT: y = x*x
    y <== x * x;
}
```

Lỗi này — gọi là **under-constrained circuit** — là một trong những bug phổ biến và nguy hiểm nhất trong ZK. Sẽ được phân tích sâu ở Lesson 12.

---

## Tóm tắt: Cách ZK Proof Systems "đọc" một hàm

Khi bạn implement một hash function trong ZK circuit:

1. **Arithmetic circuit** mô tả hàm bằng cộng và nhân trên $\mathbb{F}_p$
2. **Constraint system** (R1CS/PLONK/AIR) mã hóa circuit thành hệ phương trình
3. **Prover** tìm witness thỏa mãn tất cả constraints
4. **Verifier** kiểm tra proof mà không cần biết witness

Chi phí chủ yếu đến từ **số phép nhân** (không phải cộng). Hàm nào dùng nhiều phép nhân = circuit lớn = chứng minh chậm = thực tế không khả thi.

Đây chính xác là lý do SHA-256 (dùng nhiều bitwise ops mà mỗi cái cần nhiều nhân) là cơn ác mộng của ZK, và tại sao ZK-friendly hashes được thiết kế để hoạt động trực tiếp trên $\mathbb{F}_p$ với ít phép nhân nhất có thể.

---

## Summary / Key Takeaways

- **Arithmetic circuit**: DAG gồm cổng cộng và nhân trên $\mathbb{F}_p$. Cộng là free, nhân tạo constraint.
- **R1CS**: Mỗi constraint encode một phép nhân. Dùng bởi Groth16, Circom/snarkjs.
- **PLONK**: Flexible custom gates. Tốt cho Poseidon. Dùng bởi Halo2, zkSync.
- **AIR**: Execution trace model. Tốt cho STARKs. Dùng bởi StarkWare, Polygon Miden.
- **Multiplicative complexity** = số phép nhân = lower bound của R1CS constraints.
- **Witness generation ≠ constraints**: nguồn gốc của nhiều soundness bugs quan trọng.

---

## References

- Boneh et al. — *Undergraduate Cryptography*, Ch. on SNARKs (toc.cryptobook.us)
- Gabizon et al. — *PLONK: Permutations over Lagrange-bases for Oecumenical Noninteractive arguments of Knowledge* (eprint.iacr.org/2019/953)
- StarkWare — *Scalable, transparent, and post-quantum secure computational integrity* (AIR spec)
- Belles-Munoz et al. — *Circom: A Robust and Scalable Language for Building Complex Zero-Knowledge Circuits* (eprint.iacr.org/2023/681)
- RareSkills — *R1CS Explainer* (rareskills.io)
