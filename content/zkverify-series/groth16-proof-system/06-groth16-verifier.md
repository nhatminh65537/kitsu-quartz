---
title: "06. Groth16 Verifier"
tags: [crypto, groth16, zksnark, verifier, lesson-06]
aliases: [Groth16 Verifier Algorithm]
created: 2026-03-12
---

> **Prerequisites**: [[05-groth16-prover|05. Groth16 Prover]]
> **Objectives**:
> - Hiểu đầy đủ verification equation và tại sao nó đúng
> - Biết verifier cần tính gì từ public inputs
> - Hiểu tại sao 3 pairing checks là đủ để verify toàn bộ R1CS
> - Hiểu sub-group check và tại sao thiếu nó gây lỗi

---

## Verification Algorithm

Verifier nhận:
- **Verifying key** $\text{vk}$
- **Public inputs** $\mathbf{x} = (z_1, \ldots, z_\ell)$
- **Proof** $\pi = ([A]_1, [B]_2, [C]_1)$

### Bước 1: Compute public input aggregation

$$[L_\text{pub}]_1 = \left[\frac{\beta A_0(\tau) + \alpha B_0(\tau) + C_0(\tau)}{\gamma}\right]_1 + \sum_{i=1}^{\ell} z_i \left[\frac{\beta A_i(\tau) + \alpha B_i(\tau) + C_i(\tau)}{\gamma}\right]_1$$

Đây là linear combination của IC (Input Commitments) từ verifying key với public inputs $z_i$.

### Bước 2: Check verification equation

> [!definition] Definition 6.1 — Groth16 Verification Equation
>
> $$e([A]_1, [B]_2) \stackrel{?}{=} e([\alpha]_1, [\beta]_2) \cdot e([L_\text{pub}]_1, [\gamma]_2) \cdot e([C]_1, [\delta]_2)$$
>
> Nếu đẳng thức đúng: ACCEPT. Ngược lại: REJECT.

---

## Tại sao Verification Equation đúng?

Đây là phần quan trọng nhất — unpack equation để hiểu tại sao nó kiểm tra đúng mọi thứ.

### Expand $e([A]_1, [B]_2)$

Substitue công thức prover từ Bài 05:

$$[A]_1 = [\alpha]_1 + [A(\tau)]_1 + r[\delta]_1$$

$$[B]_2 = [\beta]_2 + [B(\tau)]_2 + s[\delta]_2$$

Pairing bilinear:

$$e([A]_1, [B]_2) = e([\alpha + A(\tau) + r\delta], [\beta + B(\tau) + s\delta])$$

$$= [\underbrace{\alpha\beta}_{\text{term 1}} + \underbrace{\alpha B(\tau)}_{\text{term 2}} + \underbrace{\alpha s\delta}_{\text{term 3}} + \underbrace{\beta A(\tau)}_{\text{term 4}} + \underbrace{A(\tau)B(\tau)}_{\text{term 5}} + \underbrace{rsA(\tau)\delta}_{\text{???}}...]_T$$

Expand đầy đủ:

$$e([A]_1, [B]_2) = [\alpha\beta + \alpha B(\tau) + A(\tau)\beta + A(\tau)B(\tau)$$
$$+ s\alpha\delta + rB(\tau)\delta + s A(\tau)\delta + r\beta\delta + rs\delta^2]_T$$

### Expand vế phải

$e([\alpha]_1, [\beta]_2) = [\alpha\beta]_T$ (precomputed trong vk)

$e([C]_1, [\delta]_2)$: substitue $[C]_1$ từ Bài 05:

$$[C]_1 = [L_\text{priv}(\tau)/\delta + h(\tau)t(\tau)/\delta]_1 + s[A]_1 + r[B]_1 - rs[\delta]_1$$

$$e([C]_1, [\delta]_2) = [C(\tau) + h(\tau)t(\tau) + s\delta A(\tau) + s\delta\alpha + rs\delta^2 \cdot ???...]_T$$

Sau khi expand và cancel tất cả:

$$\text{VK RHS} = [\alpha\beta]_T \cdot [L_\text{pub} \cdot \gamma / \gamma]_T \cdot [C(\tau) + h(\tau)t(\tau) + ...]_T$$

### Magic cancellation

Sau khi mở rộng đầy đủ, tất cả các cross-terms liên quan đến $r, s, \delta$ cancel nhau. Còn lại:

$$e([A]_1, [B]_2) = [\alpha\beta + A(\tau)B(\tau)]_T$$

$$\text{VK RHS} = [\alpha\beta + L_\text{pub}(\tau)\gamma/\gamma + C(\tau) + h(\tau)t(\tau)]_T$$

Hai vế bằng nhau $\Leftrightarrow$:

$$A(\tau)B(\tau) = L_\text{pub}(\tau) + C(\tau) + h(\tau)t(\tau)$$

Đây chính là QAP check! $L_\text{pub}(\tau)$ chứa public inputs, $C(\tau)$ chứa private witness portion, và $h(\tau)t(\tau)$ chứng minh $t | AB - C$.

> [!theorem] Theorem 6.2 — Correctness của Verification
> Verification equation pass $\Leftrightarrow$ (with overwhelming probability) witness $\mathbf{z}$ thỏa mãn R1CS với public inputs $\mathbf{x}$.

---

## Verification Code (Pseudocode)

```python
def groth16_verify(vk, public_inputs, proof):
    A, B2, C = proof
    
    # Sub-group checks (CRITICAL — xem phần dưới)
    assert is_on_curve_g1(A)
    assert is_on_curve_g2(B2)
    assert is_on_curve_g1(C)
    assert is_in_subgroup_g1(A)
    assert is_in_subgroup_g2(B2)
    assert is_in_subgroup_g1(C)
    
    # Compute public input aggregation
    L_pub = vk.IC[0]  # term cho z_0 = 1
    for i, z_i in enumerate(public_inputs):
        L_pub = L_pub + z_i * vk.IC[i + 1]
    
    # Verification equation:
    # e(A, B) == e(alpha, beta) * e(L_pub, gamma) * e(C, delta)
    lhs = pairing(B2, A)  # e([A]_1, [B]_2)
    
    rhs = (vk.alpha_beta_gt            # precomputed e([α]_1, [β]_2)
           * pairing(vk.gamma_g2, L_pub)   # e([L_pub]_1, [γ]_2)
           * pairing(vk.delta_g2, C))      # e([C]_1, [δ]_2)
    
    return lhs == rhs
```

---

## Sub-group Check — Tại sao quan trọng?

Một điểm trên curve $E(\mathbb{F}_{p^k})$ không nhất thiết phải nằm trong subgroup bậc $r$. Nếu verifier không check, attacker có thể gửi điểm thuộc subgroup khác để "bypass" pairing check.

> [!danger] Thiếu Sub-group Check
> Một số implementation cũ của verifier Groth16 trên Ethereum không kiểm tra sub-group membership của proof points. Attacker có thể gửi proof với $[A]_1$ không nằm trong subgroup bậc $r$, khiến pairing equation có hành vi không lường trước.
>
> **Fix**: Luôn check $r \cdot P = \mathcal{O}$ (point times order = infinity) cho mọi proof point.

---

## Verifier Cost

| Operation | Cost |
|-----------|------|
| Sub-group checks | $O(\ell)$ scalar muls |
| Public input aggregation | $\ell$ additions trong $\mathbb{G}_1$ |
| Pairing computations | **3 pairings** (1 precomputed) |
| **Total** | Constant per circuit size! |

Đây là điểm mạnh nhất của Groth16: **verification cost là $O(\ell)$ + 2 pairings**, không phụ thuộc vào số constraints $m$. Với $\ell$ nhỏ (ít public inputs), verification cực kỳ nhanh.

---

## On-chain Verifier (Solidity)

Groth16 verifier có thể được deploy trên Ethereum nhờ precompiles BN254 (EIP-196/197):

```solidity
// Generated by snarkjs: snarkjs zkey export solidityverifier circuit.zkey verifier.sol
contract Verifier {
    function verifyProof(
        uint[2] memory a,      // [A]_1
        uint[2][2] memory b,   // [B]_2
        uint[2] memory c,      // [C]_1
        uint[N] memory input   // public inputs
    ) public view returns (bool) {
        // Sub-group check: các điểm phải < prime q
        require(a[0] < PRIME_Q && a[1] < PRIME_Q, "invalid A");
        require(b[0][0] < PRIME_Q && ..., "invalid B");
        require(c[0] < PRIME_Q && c[1] < PRIME_Q, "invalid C");
        
        // Compute L_pub = IC[0] + sum(input[i] * IC[i+1])
        uint[2] memory L_pub = vk_IC[0];
        for (uint i = 0; i < input.length; i++) {
            L_pub = ec_add(L_pub, ec_mul(vk_IC[i + 1], input[i]));
        }
        
        // Pairing check: e(A,B) * e(-alpha,beta) * e(-L_pub,gamma) * e(-C,delta) == 1
        return pairing4(a, b, neg(vk_alpha), vk_beta, 
                        neg(L_pub), vk_gamma, neg(c), vk_delta);
    }
}
```

> [!warning] Bug lịch sử: Missing Sub-group Check trong snarkjs-generated Verifier
> Trước khi được fix (PR #36 trên iden3/snarkjs), verifier.sol được generate bởi snarkjs **không check** proof points < prime q. Điều này cho phép proof malleability. Semaphore audit đã phát hiện và fix lỗi này.

---

## Summary

- Verification equation: $e([A]_1, [B]_2) = e([\alpha]_1, [\beta]_2) \cdot e([L_\text{pub}]_1, [\gamma]_2) \cdot e([C]_1, [\delta]_2)$
- Verifier tính $[L_\text{pub}]_1$ từ public inputs — **public inputs ảnh hưởng trực tiếp đến verification**
- Cross-terms $r, s$ cancel trong equation → randomness không ảnh hưởng đến correctness
- **Sub-group check là bắt buộc** — thiếu nó gây lỗ hổng nghiêm trọng
- Verification cost: $O(\ell)$ additions + **2 pairings** — không phụ thuộc số constraints

---

## References

- Jens Groth — *On the Size of Pairing-based Non-interactive Arguments* (ePrint 2016/260)
- snarkjs PR #36 — Sub-group check fix (github.com/iden3/snarkjs/pull/36)
- Alin Tomescu — *Groth16* (alinush.github.io/groth16) — verification correctness proof
