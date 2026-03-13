---
title: "08. Trusted Setup Vulnerabilities"
tags: [crypto, zk, polynomial-commitments, lesson-08]
aliases: [Trusted Setup Vulnerabilities]
created: 2026-03-12
---

> **Prerequisites**: [[03-kzg-commitments|03. KZG Commitments]], [[04-kzg-security-analysis|04. KZG Security Analysis]]  
> **Objectives**:  
> - Hiểu threat model của trusted setup và tại sao nó nguy hiểm
> - Phân tích Powers of Tau ceremony và các attack scenarios
> - Nắm subgroup attacks trong pairing-based crypto
> - Biết rogue key attacks và cách phòng thủ

---

## Trusted Setup — Threat Model

KZG và nhiều pairing-based systems cần **trusted setup**: một bên (hoặc nhiều bên) phải sinh ra SRS và sau đó xóa toxic waste $\tau$.

> [!danger] Danger 8.1 — Toxic Waste: Total Break
> Nếu bất kỳ ai giữ lại $\tau$, họ có thể:
> - Forge bất kỳ commitment $C$ với bất kỳ proof hợp lệ cho claim tùy ý.
> - Chứng minh các statement sai về toàn bộ các circuit chạy trên SRS này.
> - Break binding hoàn toàn — không detect được.

**Đây là "original sin" của KZG**: không có cách nào để verify $\tau$ đã thực sự bị xóa.

---

## Powers of Tau Ceremony

Giải pháp thực tế: **Multi-party Computation (MPC)** ceremony:

> [!definition] Definition 8.2 — Powers of Tau (Perpetual Powers of Tau)
> $n$ participants lần lượt đóng góp randomness:
>
> 1. Participant $i$ nhận SRS từ participant $(i-1)$: $\{[s^j]_1\}_{j=0}^{d}$
> 2. Chọn secret $\tau_i \xleftarrow{\$} \mathbb{F}_q^*$
> 3. Update: $\{[s^j \cdot \tau_i^j]_1\}$ — multiply mỗi element bằng tương ứng power của $\tau_i$
> 4. Publish SRS mới và xóa $\tau_i$
>
> SRS cuối cùng encode $\tau = \tau_1 \cdot \tau_2 \cdots \tau_n$.

**Security**: Chỉ cần **một** participant honest (xóa $\tau_i$ thực sự). Nếu tất cả $n$ người đều corrupt, ceremony thất bại.

### Verifying Ceremony Correctness

Mỗi bước phải verify:

$$e([s^j]_1^{(i)},\; [s]_2^{(i)}) = e([s^{j+1}]_1^{(i)},\; [1]_2)$$

Điều này verify rằng SRS là **consistent** — các powers của $\tau$ đúng thứ tự. Nếu một participant gửi random group elements (không consistent), ceremony fail.

> [!warning] Warning 8.3 — SRS Consistency Check
> Trước khi dùng bất kỳ SRS nào, verifier **phải** kiểm tra consistency:
> $$e([\tau^i]_1, [\tau]_2) = e([\tau^{i+1}]_1, [1]_2)$$
>
> Nếu bỏ check này, adversary có thể submit SRS malformed để force prover về polynomial không intended.

---

## Subgroup Attacks

Một trong những attack quan trọng nhất trong pairing-based crypto:

> [!definition] Definition 8.4 — Small Subgroup Attack
> Đường cong BLS12-381 và BN254 có cofactor — tức nhóm curve $E(\mathbb{F}_p)$ có order $h \cdot r$ với $r$ prime và cofactor $h > 1$.
>
> Nhóm chuẩn $\mathbb{G}_1$ là subgroup bậc $r$. Các điểm với order chia hết $h$ (nhưng không phải $r$) gọi là **small-order points**.

> [!danger] Danger 8.5 — Missing Subgroup Check
> Nếu verifier không check điểm proof $\pi \in \mathbb{G}_1$ có thuộc đúng subgroup bậc $r$, adversary có thể:
>
> 1. Gửi $\pi' = k \cdot P$ với $P$ là điểm order-$h$ (small-order).
> 2. $e(\pi', [A]_2)$ có thể bằng $1_{\mathbb{G}_T}$ hoặc giá trị cố định, independent of $A$.
> 3. Pairing check pass mà không liên quan đến claim thực sự.

**Cách kiểm tra subgroup membership**:

```python
# Python với py_ecc
from py_ecc.bls12_381 import G1, G2, multiply, curve_order, is_on_curve

def is_in_g1(point):
    """Kiểm tra point thuộc G1 (prime-order subgroup)."""
    if not is_on_curve(point, b):
        return False
    # Kiểm tra r * P = infinity (point trong subgroup bậc r)
    return multiply(point, curve_order) is None  # infinity

# Subgroup check bắt buộc:
def verify_kzg(com_f, z, y, pi, srs_g2):
    assert is_in_g1(pi), "Proof point không thuộc G1 subgroup!"
    assert is_in_g1(com_f), "Commitment không thuộc G1 subgroup!"
    # ... tiếp tục verification
```

**Trong Solidity (Ethereum precompiles)**:

```solidity
// BN254 subgroup check — precompile 0x08 (ecMul với order)
function isInG1(uint256[2] memory point) internal returns (bool) {
    // Nhân với curve order — kết quả phải là điểm infinity
    uint256[3] memory input;
    input[0] = point[0];
    input[1] = point[1];
    input[2] = BN254_ORDER;
    (bool success, bytes memory result) = address(0x07).staticcall(abi.encode(input));
    // Điểm infinity = (0, 0)
    (uint256 rx, uint256 ry) = abi.decode(result, (uint256, uint256));
    return success && rx == 0 && ry == 0;
}
```

---

## Rogue Key Attack

Liên quan đến BLS signature và multi-polynomial commitments:

> [!danger] Danger 8.6 — Rogue Key Attack (Key Substitution)
> Trong schemes tổng hợp nhiều commitments, nếu một participant submit commitment $C' = C_\text{target} - \sum_{j \neq \text{target}} C_j$, thì:
>
> $$C' + \sum_{j \neq \text{target}} C_j = C_\text{target}$$
>
> Participant này có thể forge chữ ký hay proof "của group" mà không cần private keys của người khác.

**Phòng thủ**: Proof of Possession (PoP) — mỗi participant phải prove knowledge của secret key.

---

## SRS Poisoning — Ceremony Attack

> [!danger] Danger 8.7 — SRS Poisoning via Malformed Contribution
> Nếu ceremony không verify consistency đúng cách, participant độc hại có thể:
> 1. Generate SRS không phải từ single $\tau$ mà từ nhiều secrets khác nhau ở các positions.
> 2. Biết quan hệ giữa một số powers — đủ để forge proof cho specific polynomials.

**Real example**: Ceremony bỏ sót check $e([\tau^2]_1, [1]_2) = e([\tau]_1, [\tau]_2)$ — participant có thể set $[\tau^2]_1$ độc lập với $[\tau]_1$.

---

## Checklist Audit cho Trusted Setup

Khi audit một system dùng KZG:

1. **SRS source**: SRS đến từ đâu? Ceremony nào? Đã verify chưa?
2. **Consistency check**: Có verify $e([\tau^{i+1}]_1, G_2) = e([\tau^i]_1, [\tau]_2)$ không?
3. **Subgroup check**: Tất cả inputs từ prover (proof elements, commitments) có được check subgroup membership không?
4. **Ceremony participation**: Ceremony có đủ participants? Ít nhất một honest participant không?
5. **SRS reuse**: SRS có bị reuse cho các circuits khác nhau một cách không an toàn không?

---

## Tóm tắt

- Trusted setup là điểm yếu trung tâm của KZG: toxic waste $\tau$ phải được xóa hoàn toàn.
- **Powers of Tau**: MPC ceremony với $n$ participants — chỉ cần 1 honest.
- **Subgroup attacks**: điểm ngoài prime-order subgroup có thể forge pairing checks — luôn kiểm tra.
- **Rogue key attacks**: trong multi-party settings, proof of possession là bắt buộc.
- **SRS poisoning**: ceremony phải verify consistency của mọi contribution.

---

## References

- Zcash — *Powers of Tau Ceremony* — https://github.com/zcash/powersoftau
- IACR ePrint — *Small Subgroup Attacks in Pairing-Based Cryptography*
- ZKDocs — *Small-order elements* — https://www.zkdocs.com/docs/zkdocs/commitments/kzg_polynomial_commitment/
- Trail of Bits — *Pairing-based crypto security notes*
