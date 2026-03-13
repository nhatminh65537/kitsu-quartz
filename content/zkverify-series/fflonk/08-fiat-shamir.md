---
title: "08. Fiat-Shamir Transform in FFLONK"
tags: [crypto, zk-snark, fflonk, lesson-08, fiat-shamir, last-challenge-attack, transcript]
aliases: [Fiat-Shamir FFLONK]
created: 2026-03-13
---

> **Prerequisites**: [[05-fflonk-prover|05. FFLONK Prover Algorithm]], [[06-fflonk-verifier|06. FFLONK Verifier Algorithm]]  
> **Objectives**:  
> - Nắm vững Fiat-Shamir transform: cơ chế, điều kiện đúng, và điều kiện fail
> - Hiểu đặc điểm **Last Challenge Attack (LCA)** — CVE thực tế trên Linea PLONK verifier
> - Phân tích đầy đủ khi nào một transcript bị "weak" và exploit cụ thể ra sao
> - Biết cách kiểm tra transcript binding trong Rust/Solidity implementation

---

## Motivation

Fiat-Shamir transform là bước chuyển interactive → non-interactive cho FFLONK. Sai sót ở đây là **silent** — proof vẫn deserialize bình thường, các algebraic checks vẫn pass, nhưng cryptographic binding bị phá vỡ, cho phép attacker forge proof cho **bất kỳ statement sai nào**.

OpenZeppelin (2024) phát hiện lỗi này trong Linea's PLONK verifier — attack có thể steal toàn bộ funds trong L2 rollup.

---

## 1. Fiat-Shamir Transform: Đúng là gì?

> [!definition] Definition 1.1 — Fiat-Shamir Transform (Correct)
> Cho một interactive protocol $k$ rounds:
> - Round $i$: Prover gửi message $m_i$, Verifier gửi challenge $c_i$
>
> **Fiat-Shamir non-interactive version**: thay challenge $c_i$ bằng:
>
> $$c_i = H(\text{vk},\ \text{pub},\ m_1,\ c_1,\ m_2,\ c_2,\ \ldots,\ m_i)$$
>
> Tức là hash của **toàn bộ transcript đến thời điểm** challenge $i$, bao gồm VK và public inputs.
>
> **Điều kiện bắt buộc**: transcript phải **binding** — mỗi $m_i$ phải được commit trước khi challenge tiếp theo được tạo, và **không message nào được bỏ sót**.

### 1.1 Tại sao binding là cần thiết?

Trong interactive protocol, verifier gửi random challenge $c_i$ trước khi nhận $m_{i+1}$. Prover không thể chọn $m_{i+1}$ dựa trên $c_i$ vì $c_i$ phụ thuộc randomness của verifier.

Trong non-interactive version, nếu một message $m_j$ **không nằm trong transcript** khi hash $c_i$ ($i > j$), prover có thể chọn $m_j$ sau khi biết $c_i$ — mất đi binding.

---

## 2. FFLONK Transcript: Thứ tự chính xác

> [!definition] Definition 2.1 — FFLONK Fiat-Shamir Transcript
>
> ```text
> T = H(vk_hash || pub_input)
> β  = H(T || C1_x || C1_y)
> γ  = H(β)
> α  = H(γ || C2_x || C2_y)
> ζ  = H(α)
> υ  = H(ζ || eval_a || eval_b || eval_c ||
>          eval_s1 || eval_s2 || eval_s3 ||
>          eval_z_omega || eval_t1w || eval_t2w ||
>          eval_ql || eval_qr || eval_qm || eval_qo || eval_qc)
> ```
>
> **Quan trọng**: `υ` phải hash TẤT CẢ evaluations + $\zeta$ trước đó. Nếu thiếu bất kỳ evaluation nào, binding bị phá.

### 2.1 Trong implementation Polygon/zkVerify

Polygon dùng **Poseidon hash** (ZK-friendly) thay vì SHA256. Domain separation: mỗi challenge dùng hash khác nhau để tránh correlation.

---

## 3. Last Challenge Attack (LCA)

> [!definition] Definition 3.1 — Last Challenge Attack (Ciobotaru, Peter, Velichkov — IACR 2024/398)
> **Setup**: Transcript hash cho challenge $\upsilon$ (final challenge — opening batching) **bỏ sót** hai KZG opening proofs $[W_1]_1, [W_2]_1$.
>
> Kết quả: $\upsilon$ được tính độc lập với $W_1, W_2$ — prover có thể chọn $W_1, W_2$ tùy ý **sau khi biết** $\upsilon$.

### 3.1 Attack tổng quát

Khi $\upsilon$ không phụ thuộc $W_1, W_2$:

1. Bắt đầu từ proof hợp lệ $\pi = (C_1, C_2, \text{evals}, W_1, W_2)$ cho statement đúng $S$
2. Giữ nguyên $C_1, C_2, \text{evals}$ — tính $\upsilon$ từ chúng (transcript không có $W_1, W_2$)
3. Tạo proof mới $\pi'$ cho statement **sai** $S'$:
   - Giữ $C_1, C_2$ (nên $\upsilon' = \upsilon$)
   - Tính $W_1', W_2'$ bằng cách giải hệ phương trình pairing với $\upsilon$ đã biết

> [!theorem] Theorem 3.1 — Attack Feasibility
> Nếu transcript hash $\upsilon$ không bao gồm $W_1, W_2$:
>
> Với $\upsilon$ cố định, pairing check là:
> $$e(W_1 + \upsilon W_2,\ [\tau]_2) = e(F - E + \zeta W_1 + \upsilon\zeta\omega W_2,\ G_2)$$
>
> Attacker cần tìm $W_1', W_2'$ thỏa phương trình trên với $F', E'$ được tính từ $C_1', C_2'$ mới (claim sai).
>
> **Giải**: Đây là hệ 2 ẩn ($W_1', W_2'$) trong $\mathbb{G}_1$ với $\upsilon$ đã biết. Với adversarial control over $C_2'$ (quotient polynomial), có đủ bậc tự do để giải.

### 3.2 Concrete Attack Steps (Linea PLONK)

Theo báo cáo OpenZeppelin 2024:

```text
Step 1: Lấy proof hợp lệ π cho bất kỳ statement hợp lệ S
        π = (A, B, ..., W1, W2) — proof cho S đúng

Step 2: Construct π' cho statement sai S'
        - Set C1' = C1, C2' = C2, evals' = evals (giữ nguyên để υ' = υ)
        - Choose π' public input = S' (sai, ví dụ: invalid state root)
        - Compute F', E' từ S' và các giá trị giữ nguyên
        - Solve for W1', W2' thỏa pairing check với (F', E', υ)
        
Step 3: Submit π' với public input S' → Verifier accepts!
```

**Impact trên L2 rollup**: attacker submit proof của `invalid_state_root = 0x...beef` → L1 bridge giải phóng toàn bộ funds.

---

## 4. Weak Fiat-Shamir: Taxonomy

Từ Dao, Miller, Wright & Grubbs (2023), có 3 loại weak FS:

> [!definition] Definition 4.1 — Weak Fiat-Shamir Patterns
>
> **Type 1 — Missing VK/public inputs**: transcript không include $\text{vk}$ hoặc $\text{pub}$
> - Exploit: prover tạo proof cho VK khác có trapdoor biết → reuse proof
>
> **Type 2 — Missing commitment**: transcript không include $C_i$ trước challenge $c_{i+1}$
> - Exploit: prover chọn $C_i$ sau khi biết $c_{i+1}$ → attack theo LCA
>
> **Type 3 — Wrong order**: include messages nhưng sai thứ tự
> - Exploit: tùy thuộc vào protocol, nhưng thường mất soundness trong một số bước

```python
# Minh họa strong vs weak Fiat-Shamir
import hashlib

def hash_to_field(data: bytes, mod: int) -> int:
    return int(hashlib.sha256(data).hexdigest(), 16) % mod

r = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff  # mock field

# === WEAK Fiat-Shamir (thiếu W1, W2 khi hash υ) ===
def weak_fiat_shamir_challenges(vk, pub, C1, C2, evals):
    """
    BUG: υ không include W1, W2
    → attacker có thể pick W1,W2 sau khi biết υ
    """
    beta  = hash_to_field(f"beta|{vk}|{pub}|{C1}".encode(), r)
    gamma = hash_to_field(f"gamma|{beta}".encode(), r)
    alpha = hash_to_field(f"alpha|{gamma}|{C2}".encode(), r)
    zeta  = hash_to_field(f"zeta|{alpha}".encode(), r)
    # BUG: υ chỉ hash evaluations và zeta, không có W1, W2
    upsilon = hash_to_field(f"upsilon|{zeta}|{evals}".encode(), r)
    return beta, gamma, alpha, zeta, upsilon

# === STRONG Fiat-Shamir (include tất cả messages) ===
def strong_fiat_shamir_challenges(vk, pub, C1, C2, evals, W1, W2):
    """
    CORRECT: υ include W1, W2 → binding hoàn toàn
    """
    beta  = hash_to_field(f"beta|{vk}|{pub}|{C1}".encode(), r)
    gamma = hash_to_field(f"gamma|{beta}".encode(), r)
    alpha = hash_to_field(f"alpha|{gamma}|{C2}".encode(), r)
    zeta  = hash_to_field(f"zeta|{alpha}".encode(), r)
    # CORRECT: υ bao gồm cả W1, W2
    upsilon = hash_to_field(f"upsilon|{zeta}|{evals}|{W1}|{W2}".encode(), r)
    return beta, gamma, alpha, zeta, upsilon

# Demo: trong weak version, υ không đổi khi W1/W2 thay đổi
vk = "vk_demo"; pub = "state_root_123"; C1 = "C1_commit"; C2 = "C2_commit"
evals = "eval_a=5,eval_b=3,..."

W1_honest = "W1_valid_opening"
W1_forged = "W1_crafted_by_attacker"

_, _, _, _, upsilon_honest = weak_fiat_shamir_challenges(vk, pub, C1, C2, evals)
_, _, _, _, upsilon_forged = weak_fiat_shamir_challenges(vk, pub, C1, C2, evals)
# Note: same C1, C2, evals → same υ even with different W1!

print("=== Weak Fiat-Shamir ===")
print(f"υ with honest W1: {hex(upsilon_honest)[:20]}...")
print(f"υ with forged W1: {hex(upsilon_forged)[:20]}...")
print(f"Same υ regardless of W1? {upsilon_honest == upsilon_forged}")
print("→ Attacker can choose W1 freely after learning υ!\n")

print("=== Strong Fiat-Shamir ===")
_, _, _, _, upsilon_s1 = strong_fiat_shamir_challenges(vk, pub, C1, C2, evals, W1_honest, "W2")
_, _, _, _, upsilon_s2 = strong_fiat_shamir_challenges(vk, pub, C1, C2, evals, W1_forged, "W2")
print(f"υ with honest W1: {hex(upsilon_s1)[:20]}...")
print(f"υ with forged W1: {hex(upsilon_s2)[:20]}...")
print(f"Different υ for different W1? {upsilon_s1 != upsilon_s2}")
print("→ Changing W1 changes υ → attacker cannot precompute attack")
```

---

## 5. Kiểm tra Transcript trong zkVerify Rust Code

Khi audit Rust implementation, tìm pattern sau:

```rust
// Pattern tìm trong src/lib.rs hoặc src/verifier.rs

// 1. Check: tất cả commitments được hash trước challenge tương ứng
transcript.update(&c1.to_bytes());    // C1 phải trước β
let beta = transcript.squeeze();

transcript.update(&c2.to_bytes());    // C2 phải trước α  
let alpha = transcript.squeeze();

// 2. Check: TẤT CẢ evaluations được hash trước υ
transcript.update(&eval_a.to_bytes());
transcript.update(&eval_b.to_bytes());
transcript.update(&eval_c.to_bytes());
// ... (tất cả 15 evaluations)
let upsilon = transcript.squeeze();  // υ phải SAU tất cả evals

// 3. RED FLAG nếu thấy:
// let upsilon = hash(zeta, evals);  // thiếu W1, W2 — LCA!
// Nhưng W1, W2 thường chưa tồn tại ở bước này...
// → Cần kiểm tra transcript binding theo cách khác (xem section 6)
```

> [!warning] Note về FFLONK và LCA
> Trong FFLONK, challenge $\upsilon$ được dùng **để tạo $W_1, W_2$** (prover round 5) — nên $W_1, W_2$ không thể được hash trước $\upsilon$. Thay vào đó, binding được đảm bảo bằng cách:
> - Tất cả evaluations (round 4 output) **phải** nằm trong transcript trước khi hash $\upsilon$
> - Nếu evaluations binding, prover không thể thay đổi $W_1, W_2$ sau khi gửi evaluations

---

## 6. Checklist: Transcript Audit

Khi audit FFLONK implementation, check theo thứ tự:

```python
# Checklist dưới dạng code/comments
transcript_audit_checklist = {
    "1_vk_in_transcript": "H(vk) phải là element đầu tiên của transcript",
    "2_pub_in_transcript": "public_input phải được hash trước β",
    "3_C1_before_beta": "C1 (cả x và y coordinates) hash trước β và γ",
    "4_C2_before_alpha": "C2 (cả x và y) hash trước α",
    "5_all_evals_before_upsilon": [
        "eval_a, eval_b, eval_c",
        "eval_s1, eval_s2, eval_s3",
        "eval_z_omega",
        "eval_t1w, eval_t2w",
        "eval_ql, eval_qr, eval_qm, eval_qo, eval_qc",
        "tất cả 15 elements phải có mặt"
    ],
    "6_domain_separation": "Mỗi challenge dùng domain tag riêng để tránh cross-protocol attack",
    "7_endianness": "Tất cả elements được encode nhất quán (big-endian cho BN254)",
    "8_no_extra_entropy": "Không dùng block.timestamp hoặc msg.sender trong transcript",
}

print("Transcript Audit Checklist:")
for k, v in transcript_audit_checklist.items():
    if isinstance(v, list):
        print(f"  [{k}] Evaluations before υ:")
        for item in v: print(f"    - {item}")
    else:
        print(f"  [{k}] {v}")
```

---

## 7. Domain Separation và Hash Function Security

> [!definition] Definition 7.1 — Domain Separation
> Để tránh attacker craft input làm collision giữa các challenges khác nhau, mỗi challenge phải dùng domain separator:
>
> ```text
> β = H("fflonk_beta" || transcript_state)
> γ = H("fflonk_gamma" || transcript_state)
> ```
>
> Nếu không có domain separation: attacker có thể craft $C_1$ sao cho $H(C_1) = H(\text{evals})$, tạo confusion giữa các rounds.

> [!warning] Poseidon vs Keccak
> zkVerify/Polygon dùng **Poseidon hash** (native SNARK-friendly, ~200 constraints/hash) thay vì SHA256 (~20k constraints). Poseidon được thiết kế cho fields $\mathbb{F}_r$ — chạy trực tiếp trên scalars, không cần bit manipulation.
>
> **Bug risk**: Nếu implementation dùng wrong permutation constants hoặc wrong rate/capacity, output khác với reference implementation → prover/verifier challenge mismatch → tất cả proofs fail (DoS, không phải soundness break).

---

## Summary

- **Fiat-Shamir đúng**: hash toàn bộ transcript đến message $m_i$ trước khi tạo challenge $c_i$
- **LCA (Last Challenge Attack)**: bỏ sót messages khỏi transcript của challenge cuối → prover có bậc tự do chọn messages đó sau → forge proof
- **Transcript binding** trong FFLONK: $\upsilon$ phải hash tất cả 15 evaluations + tất cả challenges trước
- **3 weak FS patterns**: missing VK/pub, missing commitment, wrong order
- **Audit checklist**: 8 điểm cần kiểm tra trong Rust/Solidity code

---

## References

- Ciobotaru, Peter & Velichkov — *The Last Challenge Attack*, IACR 2024/398
- OpenZeppelin — *ZK-SNARKs & The Last Challenge Attack*, 2024 (openzeppelin.com/news)
- Dao, Miller, Wright & Grubbs — *Weak Fiat-Shamir Attacks on Modern Proof Systems*, 2023
- Trail of Bits — *Disarming Fiat-Shamir footguns*, 2024
- Gabizon et al. — *PLONK*, IACR 2019/953, Section 8
