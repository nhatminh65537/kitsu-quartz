---
title: "07. Trusted Setup & Powers of Tau"
tags: [crypto, zk-snark, fflonk, lesson-07, trusted-setup, powers-of-tau, srs]
aliases: [Trusted Setup]
created: 2026-03-13
---

> **Prerequisites**: [[02-polynomial-commitments|02. Polynomial Commitment Schemes]], [[04-fflonk-core|04. FFLONK Core Idea]]  
> **Objectives**:  
> - Hiểu tại sao KZG cần trusted setup và SRS có cấu trúc như thế nào
> - Nắm vững quy trình Powers of Tau ceremony và tính bảo mật của nó
> - Biết pháp SRS của FFLONK khác PLONK ở đâu và tại sao
> - Phân tích attack classes liên quan đến trusted setup: tau leak, ceremony compromise

---

## Motivation

KZG commitment scheme (Lesson 02) yêu cầu **Structured Reference String (SRS)** chứa các powers of secret $\tau$:

$$\text{srs} = \big([\tau^0]_1, [\tau^1]_1, \ldots, [\tau^D]_1,\ [1]_2,\ [\tau]_2\big)$$

**Vấn đề cốt lõi**: ai tạo ra $\tau$? Nếu người tạo setup biết $\tau$, họ có thể forge bất kỳ KZG commitment nào — thực chất là forge bất kỳ FFLONK proof nào.

---

## 1. Tại sao Trusted Setup là Bắt buộc

> [!definition] Definition 1.1 — Toxic Waste
> Giá trị $\tau$ (trapdoor của SRS) được gọi là **toxic waste** — ngay sau khi SRS được tạo, $\tau$ phải bị xóa vĩnh viễn. Nếu $\tau$ còn tồn tại dù chỉ ở một nơi, toàn bộ hệ thống mất đi soundness.

**Tại sao cần structure?** KZG commit $f$ bằng cách tính $f(\tau) \cdot G_1$ — nhưng $\tau$ phải ẩn. Verifier cần $[\tau]_2$ để kiểm tra quotient, nhưng không biết $\tau$ thực sự.

**Không thể dùng random public $\tau$**: nếu $\tau$ là public, attacker craft polynomial thỏa mãn bất kỳ evaluation nào.

---

## 2. Powers of Tau (PoT) Ceremony

> [!definition] Definition 2.1 — Multi-party Setup Protocol
> PoT ceremony là giao thức **multi-party computation** để tạo SRS sao cho $\tau$ không ai biết, miễn là **ít nhất 1 participant là honest**.
>
> **Giao thức (n participants)**:
> 1. Participant 1 chọn random $\tau_1 \in \mathbb{F}_r$, tạo $\text{srs}_1 = ([\tau_1^i]_1)_{i=0}^D$, publish $\text{srs}_1$, xóa $\tau_1$.
> 2. Participant 2 chọn random $\tau_2$, tính $\text{srs}_2 = ([\tau_1^i \cdot \tau_2^i]_1)_{i=0}^D = [((\tau_1\tau_2)^i)]_1$, publish $\text{srs}_2$, xóa $\tau_2$.
> 3. ...
> 4. Sau $n$ participants: $\text{srs} = ([(\tau_1\tau_2\cdots\tau_n)^i]_1)_{i=0}^D$
>
> Kết quả: $\tau = \tau_1 \cdot \tau_2 \cdots \tau_n$. Không ai biết $\tau$ trừ khi **tất cả $n$ participants conspire**.

### 2.1 Verification của mỗi contribution

Mỗi participant phải chứng minh rằng họ biết $\tau_k$ (discrete log của contribution của họ) mà không lộ $\tau_k$. Thường dùng Schnorr proof:

$$\pi_k = \text{Schnorr.Prove}(\tau_k,\ [\tau_k]_1)$$

Verifier check $[\tau_k]_1$ khớp với ratio $\text{srs}_k / \text{srs}_{k-1}$ và Schnorr proof hợp lệ.

### 2.2 Proof of Consecutive Powers

Để verify rằng $\text{srs} = ([{\tau}^i]_1)$ (consecutive powers, không phải random), dùng pairing check:

$$e\!\left([\tau^{i+1}]_1,\ G_2\right) \stackrel{?}{=} e\!\left([\tau^i]_1,\ [\tau]_2\right) \quad \forall i$$

Điều này đảm bảo mỗi entry là power liên tiếp của entry trước.

```python
# Minh họa PoT ceremony với 2 participants (demo nhỏ)
# Dùng nhóm cộng mod p thay G1 (đơn giản hóa)
import random

p = 1009   # "field size" (demo)
G = 3      # "generator" (3 là generator của Z_1009* nếu 1009 là safe prime)
D = 5      # degree

def srs_gen(tau, G, p, D):
    """Tạo SRS = [G, tau*G, tau^2*G, ...] trong nhóm cộng mod p"""
    return [pow(tau, i, p) * G % p for i in range(D+1)]

def srs_update(srs_prev, tau_new, p, D):
    """Update SRS với contribution tau_new"""
    # srs_new[i] = srs_prev[i] * tau_new^i = (tau_old * tau_new)^i * G
    tau_powers = [pow(tau_new, i, p) for i in range(D+1)]
    return [srs_prev[i] * tau_powers[i] % p for i in range(D+1)]

def verify_consecutive(srs, tau2_G, p):
    """Verify consecutive powers: srs[i+1] / srs[i] == tau (constant ratio)"""
    # In real KZG: check e(srs[i+1], G2) == e(srs[i], [tau]2)
    # Here simplified: check srs[i+1] * G == srs[i] * tau2_G (mod p)
    ratios = []
    for i in range(len(srs)-1):
        if srs[i] == 0: continue
        # ratio = srs[i+1] / srs[i] should be constant
        ratio = srs[i+1] * pow(srs[i], p-2, p) % p
        ratios.append(ratio)
    return len(set(ratios)) == 1, ratios[0] if ratios else None

# Participant 1: tau_1 = 7
tau1 = 7
srs1 = srs_gen(tau1, G, p, D)
print(f"SRS after participant 1 (tau1={tau1}):")
print(f"  {srs1}")
ok, ratio = verify_consecutive(srs1, srs1[1], p)
print(f"  Consecutive check: {ok}, ratio = {ratio}")

# Participant 1 xóa tau1 — chỉ publish srs1

# Participant 2: tau_2 = 13
tau2 = 13
srs2 = srs_update(srs1, tau2, p, D)
print(f"\nSRS after participant 2 (tau2={tau2}):")
print(f"  {srs2}")
ok2, ratio2 = verify_consecutive(srs2, srs2[1], p)
print(f"  Consecutive check: {ok2}, ratio = {ratio2}")

# Participant 2 xóa tau2 — final SRS is srs2
# tau_final = tau1 * tau2 = 7 * 13 = 91 (mod p)
tau_final = tau1 * tau2 % p
srs_check = srs_gen(tau_final, G, p, D)
print(f"\nVerify: srs2 == srs_gen(tau1*tau2)? {srs2 == srs_check}")
print(f"tau_final = {tau_final} (neither participant knows this alone)")
```

---

## 3. SRS của FFLONK vs PLONK

> [!definition] Definition 3.1 — FFLONK SRS Size
>
> | | PLONK (BDFG) | FFLONK |
> |---|---|---|
> | Circuit gates | $n$ | $n$ |
> | $\mathbb{G}_1$ SRS size | $3n + 6$ | $9n + 18$ |
> | $\mathbb{G}_2$ SRS | $2$ elements | $2$ elements |
> | Degree of $C_1$ | $n$ | $3n$ (t=3 groups) |
>
> FFLONK cần SRS gấp $\sim 3\times$ vì combined polynomial có degree cao hơn. Với Polygon CDK circuit (n ≈ $2^{23}$), FFLONK SRS ≈ $75$ million $\mathbb{G}_1$ elements ≈ ~2.4 GB.

### 3.1 Universal vs Circuit-specific SRS

FFLONK (và PLONK) dùng **universal SRS**: một setup cho tất cả circuits bậc $\leq D$. Ngược lại, Groth16 cần setup riêng cho mỗi circuit.

**Implications cho zkVerify**: zkVerify dùng Polygon CDK prover với fixed circuit. SRS được dùng chung cho tất cả proofs của circuit đó. Nếu SRS bị compromise, tất cả proofs đã submit không còn valid về mặt soundness.

---

## 4. Ceremony Thực tế: Perpetual Powers of Tau

Ceremony lớn nhất hiện nay: **Hermez (Polygon)** và **Zcash Powers of Tau**.

> [!definition] Definition 4.1 — Hermez Ceremony (2022)
> Hermez/Polygon tổ chức ceremony cho FFLONK với $> 100$ participants, kết quả là SRS cho degree $D = 2^{28}$. Transcript public tại `https://github.com/iden3/snarkjs`.
>
> **Assumption**: ít nhất 1 trong 100+ participants xóa $\tau_k$ sau ceremony → $\tau$ không ai biết.

Ngoài ra còn có **Ignition ceremony** (AZTEC, 2019) và **ZKSync ceremony** (2023).

---

## 5. Attack Classes: Trusted Setup

> [!danger] Bug Class 5.1 — Tau Leak / Ceremony Compromise
> Nếu attacker biết $\tau$, họ có thể:
> 1. Tạo commitment $[f(\tau)]_1$ cho bất kỳ polynomial $f$ nào
> 2. Tạo opening proof $[\frac{f(X)-f(z)}{X-z}(\tau)]_1$ cho bất kỳ claimed value $f(z)$ nào
> 3. Forge FFLONK proof chứng minh bất kỳ statement sai nào
>
> **Trong context zkVerify**: nếu $\tau$ bị leak, kẻ tấn công có thể submit proof cho invalid Polygon zkEVM state transition → steal funds từ L1 bridge.

> [!danger] Bug Class 5.2 — SRS Substitution
> Nếu verifier không check rằng SRS trong VK match với ceremony SRS, attacker có thể:
> - Supply VK với SRS tự tạo (attacker biết $\tau'$)
> - Submit proof forged dùng $\tau'$
> - Verifier dùng SRS của attacker → accept proof sai
>
> **Mitigation**: VK phải được publish và verify độc lập. zkVerify hardcode VK từ governance.

> [!danger] Bug Class 5.3 — Weak Ceremony (Entropy Attack)
> Nếu participant dùng predictable $\tau_k$ (ví dụ: từ RNG với thời gian hiện tại làm seed), attacker có thể brute-force $\tau_k$ và tính $\tau = \tau_1 \cdots \tau_n$.
>
> **Fix**: Mỗi participant phải dùng CSPRNG với entropy đủ lớn. Nhiều implementations dùng hardware random, keyboard entropy, và hash của nhiều nguồn.

> [!danger] Bug Class 5.4 — SRS Not Validated on Load
> Nếu code đọc SRS từ file/database mà không validate consecutive powers, attacker có thể craft SRS với $[\tau'^i]_1$ thay vì $[\tau^i]_1$. Nếu $\tau'$ được chọn để bypass specific pairing checks, proof forging trở nên khả thi.
>
> **Trong Rust**: kiểm tra code load VK có gọi `verify_srs_powers()` hay tương đương không.

---

## 6. Verification của SRS Integrity

```python
# Verify SRS has correct consecutive power structure
# Real check dùng pairings; đây là demo với integers

def verify_srs_integrity(srs, p):
    """
    Verify SRS = [G, tau*G, tau^2*G, ...]
    Consecutive ratio phải constant:
    srs[i+1] / srs[i] == srs[1] / srs[0] for all i
    """
    if len(srs) < 2:
        return False, "SRS too short"
    
    # Compute base ratio tau = srs[1]/srs[0]
    tau = srs[1] * pow(srs[0], p-2, p) % p
    
    for i in range(1, len(srs)-1):
        expected = srs[i] * tau % p
        if expected != srs[i+1]:
            return False, f"Inconsistency at index {i+1}: expected {expected}, got {srs[i+1]}"
    
    return True, f"SRS valid, tau (hidden) divides field order {p-1}"

# Test với SRS hợp lệ
p = 1009
valid_srs = [pow(91, i, p) * 3 % p for i in range(6)]
ok, msg = verify_srs_integrity(valid_srs, p)
print(f"Valid SRS: {ok} — {msg}")

# Test với SRS bị tamper (thay đổi index 3)
tampered = valid_srs[:]
tampered[3] = 42  # attacker inserts wrong value
ok2, msg2 = verify_srs_integrity(tampered, p)
print(f"Tampered SRS: {ok2} — {msg2}")

# Test với adversarial SRS (different tau)
tau_adv = 5  # attacker knows this
adv_srs = [pow(tau_adv, i, p) * 3 % p for i in range(6)]
ok3, msg3 = verify_srs_integrity(adv_srs, p)
print(f"Adversarial SRS (consistent but wrong tau): {ok3} — {msg3}")
print("WARNING: Adversarial SRS passes format check but is cryptographically insecure!")
```

---

## 7. Perpetual Updateability

> [!definition] Definition 7.1 — Universal Updatable SRS (Bowe et al. 2019)
> PLONK/FFLONK SRS là **updatable**: bất kỳ ai có thể add contribution mới bất cứ lúc nào mà không cần restart ceremony. Điều này cho phép tiếp tục "hardening" ceremony theo thời gian.
>
> **Security**: attacker phải compromise **tất cả** contributions từ một thời điểm về sau. Nếu bạn contribute **sau** attacker, setup vẫn secure miễn là bạn xóa $\tau$ của bạn.

---

## Summary

- **Trusted setup** là bất khả kháng với KZG — không thể dùng transparent setup mà giữ succinctness.
- **Powers of Tau ceremony** đảm bảo security nếu ≥1 participant honest và xóa $\tau$.
- **FFLONK SRS** gấp 3× PLONK vì combined polynomial bậc $3n$ thay vì $n$.
- **4 attack classes**: tau leak (forge any proof), SRS substitution (VK attack), weak entropy, SRS not validated on load.
- **Perpetual updateability**: ceremony có thể được update thêm bất cứ lúc nào.

---

## References

- Gabizon, Williamson & Ciobotaru — *PLONK*, Section 2.1 (Universal SRS)
- Bowe, Grigg & Hopwood — *Recursive Proof Composition without a Trusted Setup*, IACR 2019/1021
- Hermez PoT Ceremony — `github.com/iden3/snarkjs#powers-of-tau`
- Boneh, Feldman, Gabizon et al. — KZG setup security in AGM
