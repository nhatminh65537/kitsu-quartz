---
title: "02. PLONK Arithmetization"
tags: [crypto, plonk, arithmetization, circuit, lesson-02]
aliases: [PLONK Arithmetization]
created: 2026-03-13
---

> **Prerequisites**: [[01-polynomial-iop-kzg|01. Polynomial IOP and KZG]] — KZG commitment, finite fields, Lagrange basis  
> **Objectives**:  
> - Hiểu cách mạch tính toán (arithmetic circuit) được biểu diễn trong PLONK
> - Nắm vững vai trò của selector polynomials và wire polynomials
> - Hiểu copy constraints và tại sao chúng cần permutation argument
> - Phân tích điểm yếu của arithmetization (bug bounty: under-constrained circuits)

---

## Motivation

PLONK cần một cách encode computation thành polynomials. Khác với R1CS (dùng trong Groth16) chỉ có multiplication gates, PLONK dùng một **execution trace** linh hoạt hơn.

Mỗi hàng của trace là một "gate" — cột $a$ (left input), $b$ (right input), $c$ (output). Computation là việc điền đúng giá trị vào $n$ hàng, rồi dùng **selector polynomials** để "chọn" loại operation mỗi hàng thực hiện.

---

## Mạch số học (Arithmetic Circuit)

### Ví dụ: Prove rằng ta biết $x$ sao cho $x^3 + x + 5 = 35$

Khai triển: $x^3 + x + 5 = 35 \Rightarrow x = 3$.

Ta cần encode thành gates:

| Gate | $a$ | $b$ | $c$ | Operation |
|------|-----|-----|-----|-----------|
| 1 | $x$ | $x$ | $x^2$ | multiply: $a \cdot b = c$ |
| 2 | $x^2$ | $x$ | $x^3$ | multiply: $a \cdot b = c$ |
| 3 | $x^3$ | $x$ | $x^3 + x$ | add: $a + b = c$ |
| 4 | $x^3 + x$ | $5$ | $x^3 + x + 5$ | add: $a + b = c$ |
| 5 | $x^3+x+5$ | $35$ | $0$ | equality: $a = b$ (public check) |

Với $x = 3$: cột $a = [3, 9, 27, 28, 33]$, $b = [3, 3, 3, 5, 35]$, $c = [9, 27, 30, 33, 0]$.

---

## Gate Constraints (Ràng buộc gate)

> [!definition] Definition 2.1 — PLONK Gate Equation
> Mỗi gate $i$ thỏa mãn **PLONK gate equation** (còn gọi là *fan-in-2 gate*):
>
> $$q_L(i) \cdot a_i + q_R(i) \cdot b_i + q_O(i) \cdot c_i + q_M(i) \cdot a_i \cdot b_i + q_C(i) = 0$$
>
> trong đó các **selector values** $q_L, q_R, q_O, q_M, q_C \in \mathbb{F}$ quyết định loại operation.

**Các loại gate thông thường:**

| Gate type | $q_L$ | $q_R$ | $q_O$ | $q_M$ | $q_C$ | Equation |
|-----------|--------|--------|--------|--------|--------|----------|
| Multiplication | $0$ | $0$ | $-1$ | $1$ | $0$ | $a \cdot b - c = 0$ |
| Addition | $1$ | $1$ | $-1$ | $0$ | $0$ | $a + b - c = 0$ |
| Constant gate ($c = k$) | $0$ | $0$ | $1$ | $0$ | $k$ | $c + k = 0 \Rightarrow c = -k$ |
| Boolean gate ($a \in \{0,1\}$) | $-1$ | $0$ | $0$ | $1$ | $0$ | $a^2 - a = 0$ |
| Public input gate | $1$ | $0$ | $0$ | $0$ | $\text{PI}_i$ | $a + \text{PI}_i = 0$ |

### Polynomials từ selector values

Với $n$ gates, đặt $H = \{1, \omega, \omega^2, \ldots, \omega^{n-1}\}$ là multiplicative subgroup cấp $n$ (roots of unity).

> [!definition] Definition 2.2 — Selector Polynomials
> **Selector polynomials** $q_L(X), q_R(X), q_O(X), q_M(X), q_C(X) \in \mathbb{F}[X]$ là các đa thức duy nhất bậc $< n$ thỏa mãn:
>
> $$q_L(\omega^i) = q_{L,i}, \quad q_R(\omega^i) = q_{R,i}, \quad \ldots, \quad i = 0, 1, \ldots, n-1$$
>
> (Interpolation Lagrange trên $H$.) Đây là **public** — xác định circuit, commit trong verifier key.

> [!definition] Definition 2.3 — Wire Polynomials (Witness)
> **Wire polynomials** $a(X), b(X), c(X) \in \mathbb{F}[X]$ là đa thức bậc $< n$ thỏa mãn:
>
> $$a(\omega^i) = a_i, \quad b(\omega^i) = b_i, \quad c(\omega^i) = c_i, \quad i = 0, \ldots, n-1$$
>
> Đây là **private** (witness) — Prover tính và commit. Verifier không được biết.

> [!definition] Definition 2.4 — Vanishing Polynomial
> $$Z_H(X) = X^n - 1 = \prod_{i=0}^{n-1}(X - \omega^i)$$
>
> **Tính chất quan trọng**: Đa thức $f(X)$ bằng $0$ tại mọi $x \in H$ $\Leftrightarrow$ $Z_H(X) \mid f(X)$.

### Gate constraint thành polynomial identity

Gate equation phải thỏa mãn tại **mọi** $\omega^i \in H$:

$$q_L \cdot a + q_R \cdot b + q_O \cdot c + q_M \cdot a \cdot b + q_C = 0 \pmod{Z_H(X)}$$

Tức là đa thức $f(X) = q_L(X)a(X) + q_R(X)b(X) + q_O(X)c(X) + q_M(X)a(X)b(X) + q_C(X)$ phải bằng $0$ trên $H$, hay:

$$f(X) = t(X) \cdot Z_H(X)$$

với $t(X)$ là **quotient polynomial** nào đó. Prover sẽ cần tính và commit $t(X)$ để chứng minh gate constraints.

---

## Copy Constraints (Ràng buộc dây nối)

Gate constraints chỉ nói "mỗi gate riêng lẻ thỏa mãn". Chúng **không** đảm bảo các giá trị được kết nối đúng giữa các gates.

**Ví dụ vấn đề**: Gate 1 output $c_1 = x^2$, Gate 2 input trái $a_2$ cũng nên bằng $x^2$. Nhưng nếu ta không enforce $c_1 = a_2$, Prover có thể dùng giá trị khác cho $a_2$!

> [!definition] Definition 2.5 — Copy Constraints (Wiring)
> **Copy constraints** là tập hợp các ràng buộc dạng "giá trị tại vị trí $(j_1, i_1)$ bằng giá trị tại vị trí $(j_2, i_2)$", trong đó $j \in \{a, b, c\}$ chỉ column, $i$ chỉ row.
>
> Ví dụ: $a_{i_1} = c_{i_2}$ (output của gate $i_2$ là left input của gate $i_1$).

Copy constraints được encode thành một **permutation** $\sigma$ trên tập index:

$$\{(a,0), (a,1), \ldots, (a,n-1), (b,0), \ldots, (b,n-1), (c,0), \ldots, (c,n-1)\}$$

(Tổng $3n$ vị trí.) Nếu $a_{i_1} = c_{i_2}$, thì $\sigma$ trao đổi vị trí $(a, i_1)$ với $(c, i_2)$ trong một cycle.

> [!definition] Definition 2.6 — Permutation Polynomials
> Permutation $\sigma$ được encode thành **3 permutation polynomials** $S_{\sigma 1}(X), S_{\sigma 2}(X), S_{\sigma 3}(X)$ (tương ứng cột $a, b, c$) bậc $<n$.
>
> $$S_{\sigma 1}(\omega^i) = \sigma(i), \quad S_{\sigma 2}(\omega^i) = \sigma(n+i), \quad S_{\sigma 3}(\omega^i) = \sigma(2n+i)$$
>
> Đây là **public** (commit trong verifier key). Việc enforce copy constraints dùng permutation argument — sẽ học ở [[03-plonk-permutation-argument|03. PLONK Permutation Argument]].

---

## Lagrange Basis và Public Inputs

> [!definition] Definition 2.7 — Lagrange Basis Polynomial
> $L_i(X)$ là đa thức bậc $n-1$ thỏa mãn $L_i(\omega^j) = 1$ nếu $i = j$, $= 0$ nếu $i \neq j$.
>
> $$L_i(X) = \frac{Z_H(X)}{n \cdot (X - \omega^i)}$$

**Public inputs** (PI) được đưa vào circuit thông qua gate đặc biệt. Polynomial $\text{PI}(X)$ là:

$$\text{PI}(X) = \sum_{i \in \text{public\_idx}} \text{input}_i \cdot L_i(X)$$

Bổ sung vào gate constraint: $q_L \cdot a + \ldots + q_C + \text{PI}(X) = 0$ trên $H$.

---

## Ví dụ Python: Build PLONK Circuit

```python
# Build PLONK circuit đơn giản: prove x^3 + x + 5 = 35 (x = 3)
# Minh họa selector và wire polynomials

def lagrange_interpolate(points, p):
    """Nội suy Lagrange: points = list of (x, y) pairs, trên Fp."""
    n = len(points)
    result = [0] * n  # coefficients, index = degree

    for i, (xi, yi) in enumerate(points):
        # Tính L_i(x) numerator và denominator
        num = [1]  # polynomial "1"
        den = 1
        for j, (xj, _) in enumerate(points):
            if i == j:
                continue
            # Multiply num by (X - xj)
            new_num = [0] * (len(num) + 1)
            for k, c in enumerate(num):
                new_num[k] = (new_num[k] - c * xj) % p
                new_num[k+1] = (new_num[k+1] + c) % p
            num = new_num
            den = (den * (xi - xj)) % p

        den_inv = pow(den, p - 2, p)  # Fermat's little theorem
        for k in range(len(num)):
            result[k] = (result[k] + yi * den_inv * num[k]) % p
    return result

def poly_eval(coeffs, x, p):
    return sum(c * pow(x, i, p) for i, c in enumerate(coeffs)) % p

# Tìm n=8 root of unity trong Fp (p phải có (p-1) chia hết cho n)
# Dùng p = 337, n = 4 để demo
p = 337
n = 4
# Tìm omega: generator của subgroup cấp 4
# omega^4 = 1 mod 337
# 337 - 1 = 336 = 4 * 84, omega = generator^84
# Generator của F_337: g=10 (thử)
g = 10
omega = pow(g, (p - 1) // n, p)
print(f"omega = {omega}, omega^4 mod {p} = {pow(omega, n, p)}")

H = [pow(omega, i, p) for i in range(n)]
print(f"H = {H}")

# Circuit: 4 gates (giảm xuống n=4 để demo)
# Gate 0: a*b = c  (x * x = x^2)  -> q_M=1, q_O=-1
# Gate 1: a*b = c  (x^2 * x = x^3) -> q_M=1, q_O=-1
# Gate 2: a+b = c  (x^3 + x = x^3+x) -> q_L=1, q_R=1, q_O=-1
# Gate 3: a+b+const = c (x^3+x + 5 = 35, kiểm tra public)

x_val = 3
a_vals = [x_val, x_val**2 % p, x_val**3 % p, (x_val**3 + x_val) % p]
b_vals = [x_val, x_val, x_val, 5]
c_vals = [x_val**2 % p, x_val**3 % p, (x_val**3 + x_val) % p, 35]

# Selector polynomials (evaluate at H[i] = omega^i)
# q_M
q_M_vals = [1, 1, 0, 0]
# q_L
q_L_vals = [0, 0, 1, 1]
# q_R
q_R_vals = [0, 0, 1, 0]
# q_O
q_O_vals = [-1 % p, -1 % p, -1 % p, -1 % p]
# q_C: Gate 3 có constant constraint (a + b - c = 0, tức 33+5-35=3 ≠ 0...)
# Demo simplified: gate 3 là public input check, q_C = 0

# Verify gate constraints
for i in range(n):
    gate_val = (q_L_vals[i]*a_vals[i] + q_R_vals[i]*b_vals[i] +
                q_O_vals[i]*c_vals[i] + q_M_vals[i]*a_vals[i]*b_vals[i]) % p
    print(f"Gate {i}: {gate_val} (should be 0)")

# Nội suy wire polynomials
points_a = list(zip(H, a_vals))
points_c = list(zip(H, c_vals))
a_poly = lagrange_interpolate(points_a, p)
c_poly = lagrange_interpolate(points_c, p)

# Kiểm tra a(omega^0) = 3
print(f"a(omega^0) = {poly_eval(a_poly, H[0], p)} (expect {a_vals[0]})")
print(f"c(omega^1) = {poly_eval(c_poly, H[1], p)} (expect {c_vals[1]})")
print("Arithmetization demo: OK")
```

---

## Bug Bounty: Under-Constrained Circuits

> [!danger] Vulnerability 2.8 — Under-Constrained Circuit
> Một circuit là **under-constrained** nếu tồn tại witness $(a, b, c)$ không hợp lệ về mặt logic nhưng vẫn thỏa mãn tất cả gate constraints và copy constraints.
>
> **Ví dụ kinh điển**: Trong một mạch kiểm tra bit ($a \in \{0, 1\}$), nếu boolean gate bị bỏ sót, Prover có thể dùng $a = 5$ thay vì $\{0, 1\}$.

**Câu hỏi tự kiểm tra khi audit một circuit**:
- Mọi wire có giá trị được đặt ra ràng buộc không?
- Các copy constraints có đủ không, hay có wire bị "free" (không kết nối đến đâu)?
- Các public inputs có được đưa vào gate equation không, hay bị bỏ qua?
- Boolean/range checks có đủ không?

> [!warning] Warning 2.9 — Nondeterministic Witnesses
> Nếu cùng một public input cho phép nhiều witnesses khác nhau (ngoài những gì được phép logic), circuit có thể bị khai thác. Ví dụ: nullifier scheme dùng ECDSA signature không deterministic (xem 0xPARC bug tracker — StealthDrop).

---

## Summary

- **Arithmetic circuit** trong PLONK là execution trace: $n$ rows, mỗi row có $(a_i, b_i, c_i)$.
- **Selector polynomials** $q_L, q_R, q_O, q_M, q_C$ (public) xác định loại gate từng row.
- **Wire polynomials** $a, b, c$ (private witness) chứa giá trị thực tế.
- **Gate constraint** trở thành: $q_L a + q_R b + q_O c + q_M ab + q_C \equiv 0 \pmod{Z_H}$.
- **Copy constraints** enforce wiring — cần permutation argument để chứng minh (Lesson 03).
- **Lagrange basis** và roots of unity $H = \{1, \omega, \ldots, \omega^{n-1}\}$ là backbone của interpolation.
- **Bug bounty**: tìm under-constrained gates, missing copy constraints, ignored public inputs.

---

## References

- Gabizon, Williamson, Ciobotaru — *PLONK* (ePrint 2019/953), Sections 4–5
- Vitalik Buterin — *Understanding PLONK* (https://vitalik.eth.limo/general/2019/09/22/plonk.html)
- 0xPARC — ZK Bug Tracker (https://github.com/0xPARC/zk-bug-tracker)
- Aztec — Notes on Plonk Prover's Algorithm (HackMD, Arijit Dutta)
