---
title: "03. V4 — Passing Unchecked Data"
tags: [zkp, integration-layer, unchecked-data, soundness, vulnerability, v4, lesson-03]
aliases: [V4 Passing Unchecked Data]
created: 2026-03-13
---

> **Prerequisites**: [[01-zkp-stack-and-integration-layer|01. ZKP Stack & Integration Layer]], [[02-zkp-foundations-for-auditors|02. ZKP Foundations for Auditors]]  
> **Objectives**:  
> - Định nghĩa chính xác "implicit constraint" và phân biệt với constraint trong circuit
> - Hiểu tại sao on-chain verifier không tự động enforce implicit constraints
> - Phân tích 3 pattern lỗi V4 phổ biến: range, semantic, và cross-input
> - Viết PoC exploit cho một V4 bug điển hình

---

## Khái Niệm — Implicit Constraint

Khi developer viết circuit, họ đặt ra các constraint *bên trong* circuit. Nhưng circuit luôn tồn tại trong một *context* lớn hơn — ứng dụng có thể giả định rằng các input sẽ có dạng nhất định mà không cần viết ra constraint tường minh.

> [!definition] Definition 3.1 — Implicit Constraint (Ràng buộc ngầm định)
> Implicit constraint là ràng buộc mà ứng dụng *giả định* là đúng với public input, nhưng **không được enforce** bởi circuit hoặc verifier. Circuit hoạt động đúng *nếu* constraint này thỏa mãn, nhưng không kiểm tra nó.

> [!definition] Definition 3.2 — V4: Passing Unchecked Data
> Lỗ hổng xảy ra khi:
> 1. Circuit có implicit constraint trên public inputs
> 2. Integration Layer (verifier contract, pallet) **không enforce** constraint đó
> 3. Attacker nộp public input vi phạm constraint → behavior không mong đợi

Vi phạm V4 có thể dẫn đến **soundness** bug (accept proof sai) hoặc **completeness** bug (từ chối proof đúng), tùy pattern.

---

## Cơ Chế — Tại Sao Lỗi Này Xảy Ra

### On-chain Verifier Chỉ Kiểm Tra Toán Học

Như đã học ở Lesson 02, Groth16 verifier contract chỉ kiểm tra pairing equation:

$$e(A, B) = e(\alpha, \beta) \cdot e\!\left(\sum_{i} x_i \cdot \text{IC}[i], \gamma\right) \cdot e(C, \delta)$$

Nếu bạn nộp `input[0] = 2^300` (một số rất lớn, nằm ngoài field $\mathbb{F}_p$), verifier có thể:
- Tự động reduce modulo $p$ (mất thông tin)
- Hoặc có undefined behavior

Circuit có thể hoạt động đúng với giả định `input[0] < 2^128`, nhưng nếu không ai kiểm tra điều này trong Integration Layer, attacker có thể khai thác.

### Data Path — Trực Tiếp và Gián Tiếp

V4 xảy ra theo hai con đường:

```text
┌──────────────────────────────────────────────────────────┐
│ Path 1 — Direct (Trực tiếp):                            │
│   Attacker → public_input = [malicious_value]            │
│   Integration Layer → verifyProof([malicious_value])    │
│   Verifier → passes (không kiểm tra range/semantics)    │
│   Application Logic → sai kết quả                       │
├──────────────────────────────────────────────────────────┤
│ Path 2 — Indirect (Gián tiếp, qua hash):                │
│   Attacker → preimage P sao cho H(P) = malicious_hash   │
│   Integration Layer → verifyProof([H(P)])                │
│   Verifier → passes (hash hợp lệ về mặt toán học)       │
│   Application Logic → interpret hash sai                │
└──────────────────────────────────────────────────────────┘
```

---

## Ba Pattern Lỗi V4

### Pattern 1 — Missing Range Check

Circuit giả định input nằm trong range nhất định, nhưng Integration Layer không kiểm tra.

**Ví dụ**: ZKP age verification — circuit chứng minh `age >= 18` với `age` là public input. Circuit được thiết kế cho `age ∈ [0, 150]`. Nếu Integration Layer không kiểm tra `age <= 150`, attacker có thể nộp `age = 2^254` (gần modulus p), gây field arithmetic overflow trong downstream logic.

```solidity
// ❌ VULNERABLE — Integration Layer thiếu range check
contract AgeVerifier {
    IVerifier public verifier;

    function proveAdult(
        uint[2] memory a, uint[2][2] memory b, uint[2] memory c,
        uint256 age          // public input
    ) external {
        // Chỉ verify proof toán học — KHÔNG kiểm tra range
        require(verifier.verifyProof(a, b, c, [age]), "Invalid proof");
        // age có thể là bất kỳ giá trị nào trong F_p!
        grantAccess(msg.sender);
    }
}

// ✅ FIXED — Thêm range check trong Integration Layer
contract AgeVerifierFixed {
    IVerifier public verifier;

    function proveAdult(
        uint[2] memory a, uint[2][2] memory b, uint[2] memory c,
        uint256 age
    ) external {
        // Enforce implicit constraint của circuit
        require(age >= 18 && age <= 150, "Age out of valid range");
        require(verifier.verifyProof(a, b, c, [age]), "Invalid proof");
        grantAccess(msg.sender);
    }
}
```

### Pattern 2 — Missing Semantic Validation

Public input hợp lệ về số học nhưng không có nghĩa trong context ứng dụng.

**Ví dụ**: ZKP Merkle membership — circuit nhận `merkleRoot` là public input và chứng minh user là thành viên. Nếu Integration Layer không kiểm tra `merkleRoot` phải là root *hiện tại* của Merkle tree on-chain, attacker có thể nộp proof với một root cũ (đã invalid) và vẫn pass.

```solidity
// ❌ VULNERABLE — Không kiểm tra Merkle root có hợp lệ không
contract MerkleVerifier {
    IVerifier public verifier;
    bytes32 public currentRoot; // Root hiện tại

    function proveAndAct(
        uint[2] memory a, uint[2][2] memory b, uint[2] memory c,
        uint256 nullifierHash,
        uint256 merkleRoot   // public input — attacker kiểm soát!
    ) external {
        uint[2] memory inputs = [nullifierHash, merkleRoot];
        require(verifier.verifyProof(a, b, c, inputs), "Invalid proof");
        // ❌ Không kiểm tra merkleRoot == currentRoot!
        performAction();
    }
}

// ✅ FIXED
contract MerkleVerifierFixed {
    function proveAndAct(..., uint256 merkleRoot) external {
        // Enforce: root phải là root on-chain hiện tại
        require(bytes32(merkleRoot) == currentRoot, "Invalid Merkle root");
        require(verifier.verifyProof(a, b, c, inputs), "Invalid proof");
        performAction();
    }
}
```

### Pattern 3 — Missing Cross-Input Consistency

Nhiều public inputs phải có mối quan hệ nhất định với nhau, nhưng Integration Layer không enforce.

**Ví dụ**: ZKP swap — circuit nhận `inputToken`, `outputToken`, `exchangeRate` là public inputs và chứng minh swap hợp lệ. Circuit được thiết kế để hoạt động với cặp token cụ thể. Nếu Integration Layer không kiểm tra `(inputToken, outputToken)` có phải là cặp hợp lệ trong DEX không, attacker có thể fake rate cho cặp token tùy ý.

```solidity
// ❌ VULNERABLE — Không kiểm tra tính nhất quán giữa các public inputs
contract ZkSwap {
    IVerifier public verifier;
    mapping(bytes32 => uint256) public validExchangeRates;

    function swap(
        uint[2] memory a, uint[2][2] memory b, uint[2] memory c,
        uint256 inputToken,
        uint256 outputToken,
        uint256 exchangeRate
    ) external {
        uint[3] memory inputs = [inputToken, outputToken, exchangeRate];
        require(verifier.verifyProof(a, b, c, inputs), "Invalid proof");
        // ❌ Không kiểm tra exchangeRate có khớp với on-chain rate không!
        executeSwap(inputToken, outputToken, exchangeRate);
    }
}
```

---

## Exploit Flow — PoC Pattern

Đây là quy trình tổng quát để khai thác V4:

```text
Bước 1: Xác định public inputs của circuit
         → Đọc circuit source hoặc verifier contract
         → Liệt kê: input[0], input[1], ..., input[N]

Bước 2: Tìm implicit constraints
         → Hỏi: "Circuit này giả định gì về từng input?"
         → Hỏi: "Điều gì xảy ra nếu input nằm ngoài expected domain?"

Bước 3: Kiểm tra Integration Layer có enforce không
         → Đọc application contract code
         → Tìm các bước validation TRƯỚC khi gọi verifyProof()

Bước 4: Tạo witness hợp lệ với malicious public input
         → Dùng circuit/snarkjs để generate proof với input vi phạm constraint
         → Nộp proof lên Integration Layer

Bước 5: Quan sát hành vi
         → Proof có được accept không?
         → Application logic có bị bypass không?
```

**Script PoC mẫu (Python + web3.py)**:

```python
from web3 import Web3
import json

# Kết nối với local fork
w3 = Web3(Web3.HTTPProvider("http://localhost:8545"))

# Load ABI của vulnerable contract
with open("abi/vulnerable_verifier.json") as f:
    abi = json.load(f)

contract_addr = "0x..."
contract = w3.eth.contract(address=contract_addr, abi=abi)

# Proof hợp lệ được generate với snarkjs (với valid witness)
# Nhưng chúng ta thay public input bằng malicious value
proof_a = [0x..., 0x...]  # valid proof points
proof_b = [[0x..., 0x...], [0x..., 0x...]]
proof_c = [0x..., 0x...]

# Malicious public input: merkle root giả (root không tồn tại)
# Proof chứng minh membership với root KHÁC, nhưng ta submit root fake
malicious_merkle_root = 0xdeadbeef...  # root không hợp lệ

# Thực tế: cần generate proof với input này trước
# Đây là ví dụ conceptual về việc submit mismatched input
tx = contract.functions.proveAndAct(
    proof_a, proof_b, proof_c,
    nullifier_hash,
    malicious_merkle_root   # ← giá trị không được validate
).build_transaction({...})

# Nếu transaction thành công → V4 bug confirmed
receipt = w3.eth.send_transaction(tx)
print(f"Status: {receipt.status}")  # 1 = success = bug exists
```

> [!example] Example 3.1 — Semaphore Completeness Bug (2022)
> Semaphore protocol (anonymous voting) có bug completeness được report năm 2022. Circuit nhận `externalNullifier` là public input để phân biệt các voting instances khác nhau. Một phiên bản không enforce rằng `externalNullifier` phải match với instance đang active. Kết quả: honest prover có thể bị từ chối (completeness failure) nếu frontend gửi sai `externalNullifier`. Đây là dạng V4 affecting completeness thay vì soundness.

---

## Detection Checklist — V4

Khi audit một Integration Layer contract:

```text
□ Liệt kê TẤT CẢ public inputs của circuit (đọc circuit code)
□ Với mỗi input, hỏi: "Circuit giả định input này có range/format gì?"
□ Tìm code path: user input → verifyProof() call
□ Kiểm tra: có validate nào xảy ra TRƯỚC verifyProof() không?
□ Test: submit proof với input = 0, input = p-1 (max field element),
        input = p (overflow), input = 2^256 - 1
□ Kiểm tra: các inputs có liên quan đến nhau không? Cross-check enforce chưa?
□ Kiểm tra: input có phải reference on-chain state không? (Merkle root, timestamp, etc.)
□ Kiểm tra: circuit documentation có nói gì về assumptions của inputs không?
```

---

## Tóm tắt — Key Takeaways

- **Implicit constraint** là ràng buộc mà circuit giả định nhưng không enforce. Integration Layer phải tự enforce chúng.
- Verifier contract **chỉ** kiểm tra pairing equation — không kiểm tra semantics của public inputs.
- Ba pattern chính: **missing range check**, **missing semantic validation**, **missing cross-input consistency**.
- Khai thác: tìm implicit constraint → kiểm tra Integration Layer có enforce không → generate proof với malicious input → submit.
- Fix: thêm explicit validation trong Integration Layer, trước khi gọi `verifyProof()`.

---

## References

- Chaliasos et al. — *SoK* (arXiv:2402.15293), V4 definition, Table 5 (integration layer bugs)
- Semaphore completeness bug 2022 — github.com/semaphore-protocol/semaphore/issues/90
- Cantina — *ZKP Security Flaws Auditors Commonly Overlook* (cantina.xyz/blog)
- zkSecurity — *The State of Security Tools for ZKPs*, Integration Layer section
