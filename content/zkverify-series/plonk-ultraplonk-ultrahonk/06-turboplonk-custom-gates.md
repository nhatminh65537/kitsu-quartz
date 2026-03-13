---
title: "06. TurboPlonk and Custom Gates"
tags: [crypto, turboplonk, custom-gates, arithmetization, lesson-06]
aliases: [TurboPlonk and Custom Gates]
created: 2026-03-13
---

> **Prerequisites**: [[05-fiat-shamir-security-model|05. Fiat-Shamir and Security Model]], [[02-plonk-arithmetization|02. PLONK Arithmetization]] — gate equation, selector polynomials, wire polynomials
> **Objectives**:
> - Hiểu tại sao standard PLONK (fan-in-2) không đủ hiệu quả cho cryptographic primitives
> - Nắm cơ chế custom gates: thêm selector columns, tăng fan-in, define arbitrary polynomial relation
> - Biết các custom gate quan trọng: EC scalar multiplication, range check, Poseidon hash gate
> - Nhận biết attack surface mới từ custom gates (under-constrained custom relation)

---

## Motivation

Standard PLONK chỉ có 3 wires $(a, b, c)$ và 5 selectors. Điều này có nghĩa: mỗi operation phức tạp như **elliptic curve point addition** cần hàng trăm gates thông thường.

Ví dụ: EC scalar multiplication (dùng trong Pedersen commitment, ECDSA) cần $O(\lambda)$ point doublings và additions → $O(\lambda \cdot 100)$ standard PLONK gates → circuit quá lớn.

**TurboPlonk** (Aztec, 2020) giải quyết bằng cách cho phép circuit designer thêm **custom selectors** với **arbitrary polynomial relation** giữa wires — một gate có thể encode cả một EC addition.

---

## Giới hạn của Standard PLONK

Gate equation standard:

$$q_L a + q_R b + q_O c + q_M ab + q_C = 0$$

Đây là **degree-2** polynomial trong wires $(a, b, c)$ và chỉ có một multiplication term $ab$. Không thể encode:
- $a^3$ (cần trong EC formulas)
- $a \cdot b \cdot c$ (three-way multiplication)
- Logic XOR, AND (bit operations dùng trong hash functions)
- Range checks ($0 \le a < 2^k$)

---

## Custom Gates trong TurboPlonk

> [!definition] Definition 6.1 — Custom Gate
> Một **custom gate** là một tuple $(P, \mathbf{q}, \mathbf{w})$ gồm:
> - $P$ là polynomial relation tùy ý trong các selector values và wire values
> - $\mathbf{q} = (q_1, \ldots, q_k)$ là các selector values (public, xác định loại gate)
> - $\mathbf{w} = (w_1, \ldots, w_m)$ là wire values tại row hiện tại và/hoặc row kề
>
> Gate "active" khi selector $q_{\text{enable}} = 1$, và enforce: $P(q_1, \ldots, q_k, w_1, \ldots, w_m) = 0$.

TurboPlonk mở rộng wire count lên **4 wires** $(a, b, c, d)$ và thêm nhiều custom selectors.

> [!definition] Definition 6.2 — TurboPlonk Gate Equation (Tổng quát)
> $$\sum_{\text{selector } q_i} q_i(X) \cdot P_i(a(X), b(X), c(X), d(X)) = 0 \pmod{Z_H}$$
>
> Mỗi $P_i$ là một polynomial relation tương ứng với gate type $i$. Nhiều gate types có thể được bật/tắt độc lập qua selectors.

---

## Ví dụ các Custom Gates

### 1. EC Affine Addition Gate

Với hai điểm $(x_1, y_1)$ và $(x_2, y_2)$ trên đường cong $y^2 = x^3 + b$ (short Weierstrass), điểm tổng $(x_3, y_3)$ thỏa:

$$\lambda = \frac{y_2 - y_1}{x_2 - x_1}, \quad x_3 = \lambda^2 - x_1 - x_2, \quad y_3 = \lambda(x_1 - x_3) - y_1$$

Encode thành **một gate** với 4 wires:
- $a = x_1, \; b = y_1, \; c = x_2, \; d = y_2$
- Wire row kề: $a' = x_3, b' = y_3$
- Custom selector $q_{EC} = 1$ enforce cả 3 equations trên

Thay vì $\sim 30$ standard gates, chỉ cần **1 custom gate** (+ thêm một gate cho output).

### 2. Fixed-Base Scalar Multiplication Gate

Scalar multiplication $k \cdot P$ với $P$ là điểm cố định (public). Dùng **precomputed table** kết hợp với custom gate để tính $2^i P$ trong $O(1)$ gates mỗi bit.

### 3. Range Check Gate

$$a \in \{0, 1\}^4 \quad \Leftrightarrow \quad a(a-1)(a-2)\cdots(a-15) = 0$$

Hoặc encode dưới dạng **4-bit decomposition**: $a = b_0 + 2b_1 + 4b_2 + 8b_3$ với mỗi $b_i \in \{0,1\}$.

Custom gate enforce: $a - (b_0 + 2b_1 + 4b_2 + 8b_3) = 0$ và $b_i(b_i - 1) = 0$ cho mỗi bit.

### 4. 8-bit XOR / AND Gate

Dùng **precomputed lookup table** (xem Lesson 07 về Plookup). Custom gate chỉ cần check: $(a, b, c)$ thuộc table XOR.

---

## Selector Encoding

> [!definition] Definition 6.3 — Turbo Selector Set
> TurboPlonk (Barretenberg) dùng tập selectors mở rộng:
>
> | Selector | Gate bật khi = 1 |
> |----------|-----------------|
> | $q_{\text{arith}}$ | Standard arithmetic gate (L/R/O/M/C) |
> | $q_{\text{ecc}}$ | EC affine addition gate |
> | $q_{\text{fixed\_base}}$ | Fixed-base scalar mul gate |
> | $q_{\text{logic}}$ | Boolean logic gate (AND/XOR) |
> | $q_{\text{range}}$ | Range constraint gate |
> | $q_{\text{sort}}$ | Sorting gate (dùng trong lookup) |
>
> Một gate row có thể kích hoạt **nhiều selectors cùng lúc**, nhưng các relations tương ứng phải tương thích (không conflict).

---

## Quotient Polynomial với Custom Gates

Gate constraint tổng quát:

$$\text{all gate relations} = t(X) \cdot Z_H(X)$$

Với nhiều custom gate types, tổng linear combination (với random challenges từ Fiat-Shamir):

$$t(X) = \frac{q_{\text{arith}} \cdot P_{\text{arith}} + \alpha \cdot q_{\text{ecc}} \cdot P_{\text{ecc}} + \alpha^2 \cdot q_{\text{logic}} \cdot P_{\text{logic}} + \ldots}{Z_H(X)}$$

**Bậc tăng lên**: Nếu custom gate dùng degree-3 polynomial trong wires, $t(X)$ sẽ có bậc cao hơn → cần split thành nhiều parts hơn trong Prover round 3.

---

## Implementation: Custom Gate Minh Họa

```python
def verify_custom_ec_gate(x1, y1, x2, y2, x3, y3, curve_b, p):
    """
    Kiểm tra EC affine addition gate constraint.
    Verify: (x1,y1) + (x2,y2) = (x3,y3) trên y^2 = x^3 + curve_b (mod p)
    Returns True nếu constraint thỏa mãn.
    """
    if x1 == x2:
        return False  # Cần double gate riêng (x1=x2 case)

    # Slope lambda
    dx = (x2 - x1) % p
    dy = (y2 - y1) % p
    lam = dy * pow(dx, p - 2, p) % p  # lambda = (y2-y1)/(x2-x1)

    # x3 = lambda^2 - x1 - x2
    x3_expected = (lam * lam - x1 - x2) % p
    # y3 = lambda*(x1-x3) - y1
    y3_expected = (lam * (x1 - x3_expected) - y1) % p

    return x3 == x3_expected and y3 == y3_expected


def verify_range_gate(a, n_bits, p):
    """
    Kiểm tra range gate: a trong [0, 2^n_bits).
    Dùng bit decomposition.
    """
    if a < 0 or a >= p:
        return False
    # Decompose
    bits = []
    val = a
    for _ in range(n_bits):
        bits.append(val & 1)
        val >>= 1
    # Reconstruct
    reconstructed = sum(b * (2 ** i) for i, b in enumerate(bits))
    # Verify boolean constraint
    all_boolean = all(b == 0 or b == 1 for b in bits)
    return reconstructed == a and all_boolean


def verify_xor_gate(a, b, c, n_bits):
    """
    Kiểm tra XOR gate: c = a XOR b (trong n_bits).
    Custom gate verify lookup constraint.
    """
    mask = (1 << n_bits) - 1
    return (c & mask) == ((a ^ b) & mask)


# --- Demo ---
# EC gate test: y^2 = x^3 + 7 (mod p), p = 1000003 (p ≡ 3 mod 4)
p = 1000003
curve_b = 7

def find_point_on_curve(start, p, b):
    """Tìm điểm hợp lệ trên y^2 = x^3 + b (mod p)."""
    for x in range(start, p):
        ysq = (pow(x, 3, p) + b) % p
        if pow(ysq, (p - 1) // 2, p) == 1:  # Legendre: QR check
            y = pow(ysq, (p + 1) // 4, p)
            if (y * y) % p == ysq:
                return x, y
    return None

x1, y1 = find_point_on_curve(1, p, curve_b)
x2, y2 = find_point_on_curve(x1 + 1, p, curve_b)
lam = (y2 - y1) * pow((x2 - x1), p - 2, p) % p
x3 = (lam * lam - x1 - x2) % p
y3 = (lam * (x1 - x3) - y1) % p
result = verify_custom_ec_gate(x1, y1, x2, y2, x3, y3, curve_b, p)
print(f"EC gate verify: {result}")  # True

# Range gate
assert verify_range_gate(15, 4, p), "15 in [0,16) should pass"
assert not verify_range_gate(16, 4, p), "16 NOT in [0,16) should fail"
print("Range gate verify: OK")

# XOR gate
assert verify_xor_gate(0b1010, 0b1100, 0b0110, 8)
assert not verify_xor_gate(0b1010, 0b1100, 0b1111, 8)
print("XOR gate verify: OK")
```

---

## Bug Bounty: Custom Gate Attack Surface

> [!danger] Vulnerability 6.4 — Under-Constrained Custom Gate
> Custom gate thêm polynomial relation $P(\ldots) = 0$ khi selector $= 1$. Nếu **$P$ không đủ ràng buộc** (thiếu một điều kiện), Prover có thể tìm witness sai thỏa mãn $P$ nhưng sai logic.
>
> **Ví dụ**: EC gate chỉ check $x_3$ mà không check $y_3$ → Prover có thể dùng $y_3$ bất kỳ.

> [!danger] Vulnerability 6.5 — Selector Conflict / Double-Activation
> Nếu hai custom gate selectors cùng bằng 1 tại một row mà relations của chúng conflict (overconstrained → không thỏa), circuit sẽ không satisfiable. Ngược lại, nếu hai selectors cùng 0 tại row quan trọng (underconstrained → free wire), Prover có thể gian lận.

> [!danger] Vulnerability 6.6 — Degree Overflow
> Nếu custom gate có degree quá cao (ví dụ: degree 5 trong wires), quotient polynomial $t(X)$ sẽ có bậc cao hơn dự kiến. Nếu Prover split $t$ sai số parts, Verifier sẽ reconstruct $t(\zeta)$ sai → verification equation sai → có thể **false accept** hoặc **false reject** tuỳ implementation.

> [!warning] Warning 6.7 — Next-Row Wire Access
> TurboPlonk cho phép gate truy cập wire của row **tiếp theo** (ví dụ: $a$ ở row $i$ và $a'$ ở row $i+1$). Nếu constraint không khóa chặt boundary (row cuối cùng), Prover có thể gán giá trị tùy ý cho wire ở row cuối mà không bị kiểm tra.

---

## Summary

- **TurboPlonk** mở rộng standard PLONK bằng custom gates: thêm selectors và arbitrary polynomial relations.
- **4 wires** $(a,b,c,d)$ + custom selectors → một gate có thể encode EC addition, range check, XOR.
- **Gate bật** khi selector $= 1$; nhiều gate types dùng random challenge linear combination trong $t(X)$.
- **Performance**: EC scalar mul từ $O(\lambda \times 100)$ → $O(\lambda)$ gates.
- **Bug bounty**: under-constrained relations, selector conflicts, degree overflow, boundary issues.

---

## References

- Williamson — *TurboPlonk* (Aztec internal, 2020) — https://docs.zkproof.org/pages/standards/accepted-workshop4/proposal-turbo_plonk.pdf
- Gabizon — *UltraPLONK primer* (HackMD, Aztec)
- Benchmarking PLONK/TurboPlonk/UltraPlonk (Derei et al., Lehigh 2023)
- Barretenberg source — `turbo_composer` (AztecProtocol/aztec-packages)
