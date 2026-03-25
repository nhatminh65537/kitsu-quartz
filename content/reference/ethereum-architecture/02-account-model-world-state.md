---
title: "02. Account Model & World State"
tags: [ethereum, blockchain, lesson-02]
aliases: [Account Model, World State]
created: 2026-03-24
---

> **Prerequisites**: [[01-ethereum-big-picture|01. Ethereum — Big Picture & Design Philosophy]]
> **Objectives**:
> - Phân biệt rõ EOA và Contract Account — cấu trúc và hành vi
> - Hiểu 4 trường của mỗi account: nonce, balance, codeHash, storageRoot
> - Nắm khái niệm World State và cách nó được biểu diễn
> - Hiểu hàm state transition: $\Upsilon(S, T) = S'$
> - Đọc được account data thực tế bằng Python (web3.py)

---

## Motivation

Trong Lesson 01, ta biết Ethereum là một state machine duy trì một **world state** chung. Nhưng world state đó trông như thế nào? Ai "sống" trong đó?

Câu trả lời là: **account** (tài khoản). Mọi thứ trong Ethereum — người dùng, smart contract, token — đều tồn tại dưới dạng account. Hiểu cấu trúc account là hiểu nền móng của toàn bộ hệ thống: tại sao smart contract lại "nhớ" được trạng thái, tại sao transaction có thể bị replay, tại sao gas phải tốn phí lưu trữ.

Bitcoin dùng mô hình **UTXO** (Unspent Transaction Output) — không có khái niệm "số dư tài khoản", chỉ có "những đồng coin chưa tiêu". Ethereum chọn **account model** vì nó trực quan hơn cho lập trình: giống như tài khoản ngân hàng, có địa chỉ, có số dư, có lịch sử giao dịch.

---

## Concept: Hai Loại Account

> [!definition] Definition 2.1 — EOA (Externally Owned Account)
> EOA là tài khoản được kiểm soát bởi **private key** của người dùng.
>
> - Được tạo ra khi bạn tạo một Ethereum wallet (MetaMask, Ledger, v.v.)
> - Địa chỉ được dẫn xuất từ public key: `address = keccak256(pubkey)[12:]` (20 byte cuối)
> - Có thể **khởi tạo transaction** (gửi ETH, gọi contract)
> - Không có code — `codeHash` = hash của chuỗi rỗng
> - Không có storage

> [!definition] Definition 2.2 — Contract Account (CA)
> Contract Account là tài khoản chứa **smart contract bytecode**.
>
> - Được tạo ra khi deploy một smart contract lên mạng
> - **Không có private key** — không ai "sở hữu" nó theo nghĩa truyền thống
> - Không tự khởi tạo transaction — chỉ phản ứng khi được gọi
> - Có `codeHash` trỏ đến bytecode của contract
> - Có storage riêng (persistent key-value store)
> - Địa chỉ được tính từ địa chỉ người deploy và nonce: `address = keccak256(rlp([sender, nonce]))[12:]`

### So sánh trực quan

```text
EOA (ví dụ: ví MetaMask của bạn)       Contract Account (ví dụ: Uniswap)
─────────────────────────────────       ────────────────────────────────────
address:  0xAlice...                    address:  0xUniswap...
nonce:    15        (số tx đã gửi)     nonce:    1         (số contract đã deploy)
balance:  2.5 ETH                      balance:  10,000 ETH (liquidity)
codeHash: hash("")  (không có code)     codeHash: hash(bytecode)
storage:  rỗng                         storage:  { slot0: price, slot1: reserve, ... }

Kiểm soát bởi: private key             Kiểm soát bởi: bytecode logic
Khởi tạo tx:   CÓ                      Khởi tạo tx:   KHÔNG (chỉ internal calls)
```

---

## Concept: Cấu Trúc Account — 4 Trường

Mỗi account, dù là EOA hay CA, đều có **chính xác 4 trường**:

> [!definition] Definition 2.3 — Account State
>
> | Trường | Kiểu | Mô tả |
> |--------|------|-------|
> | `nonce` | uint64 | Bộ đếm transaction (EOA) hoặc contract deployment (CA) |
> | `balance` | uint256 | Số wei của account |
> | `storageRoot` | bytes32 | Merkle root của Storage Trie |
> | `codeHash` | bytes32 | Keccak-256 hash của EVM bytecode |

### Nonce

**Nonce** là một bộ đếm (counter) tăng dần:
- Với **EOA**: nonce = số transactions đã gửi thành công. Bắt đầu từ 0.
- Với **CA**: nonce = số contract accounts đã được tạo ra bởi contract này.

> [!warning] Tại sao nonce quan trọng?
> Nonce ngăn **replay attack** (tấn công phát lại). Mỗi transaction phải có nonce đúng bằng nonce hiện tại của account. Nếu bạn đã gửi tx với nonce=5, một attacker không thể phát lại tx đó vì mạng sẽ từ chối (nonce không khớp).
>
> Nonce cũng đảm bảo thứ tự: bạn không thể gửi tx với nonce=7 trước khi tx nonce=6 được xử lý.

### Balance

**Balance** là số lượng **wei** (đơn vị nhỏ nhất của Ether) trong account.

$$1 \text{ ETH} = 10^{18} \text{ wei}$$

Balance là `uint256` — có thể lên đến $\approx 1.16 \times 10^{77}$ wei. Trong thực tế, tổng cung ETH khoảng 120 triệu ETH, tức $1.2 \times 10^{26}$ wei — vẫn còn rất nhiều chỗ trống.

### StorageRoot

**StorageRoot** là hash của gốc cây **Storage Trie** — một cấu trúc dữ liệu Merkle Patricia Trie (học ở Lesson 04) ánh xạ từ `slot` (32 byte) sang `value` (32 byte).

- Với **EOA**: storageRoot = hash của trie rỗng (`0x56e81f171...`)
- Với **CA**: storageRoot phản ánh toàn bộ trạng thái bộ nhớ của contract đó

Mỗi khi contract thay đổi biến trạng thái (ví dụ: `balances[alice] += 100`), storageRoot của nó thay đổi.

### CodeHash

**CodeHash** là Keccak-256 hash của EVM bytecode:
- Với **EOA**: `codeHash = keccak256("")` = `0xc5d24601...` (hash của chuỗi rỗng)
- Với **CA**: hash của compiled bytecode của smart contract

CodeHash **bất biến** sau khi deploy — không thể sửa code của contract đã triển khai.

---

## Concept: World State

> [!definition] Definition 2.4 — World State
> **World State** $\sigma$ là một ánh xạ từ địa chỉ Ethereum (20 byte) sang account state:
>
> $$\sigma: \text{Address} \rightarrow \text{AccountState}$$
>
> World state được biểu diễn dưới dạng **Merkle Patricia Trie** (Lesson 04), với hash của gốc cây (**stateRoot**) được lưu trong block header. Bất kỳ thay đổi nào của bất kỳ account nào đều làm thay đổi stateRoot.

Nhờ cấu trúc Merkle, ta có thể **prove** (chứng minh) trạng thái của một account cụ thể mà không cần tải toàn bộ world state — chỉ cần một **Merkle proof** nhỏ. Đây là nền tảng của light clients và các bridge.

---

## Concept: State Transition Function

Đây là trái tim của Ethereum. Mỗi block, Ethereum thực hiện:

> [!definition] Definition 2.5 — State Transition Function
> Cho trạng thái hiện tại $S$ và một transaction $T$, hàm state transition $\Upsilon$ cho ra trạng thái mới $S'$:
>
> $$\Upsilon(S, T) = S'$$
>
> Toàn bộ một block $B$ chứa nhiều transactions $[T_1, T_2, \ldots, T_n]$. State sau block:
>
> $$S' = \Upsilon(\Upsilon(\ldots\Upsilon(S, T_1), T_2)\ldots, T_n)$$

Hàm này phải **deterministic** (tất định): cùng một $S$ và $T$, mọi node trên thế giới phải tính ra cùng một $S'$. Đây là yêu cầu cốt lõi để mạng đạt đồng thuận.

Khi xử lý một transaction, $\Upsilon$ thực hiện (theo thứ tự):

```text
1. Kiểm tra tính hợp lệ:
   - Chữ ký ECDSA hợp lệ?
   - Nonce của sender khớp không?
   - Balance của sender đủ trả gas + value không?

2. Trừ gas tối đa từ sender (gasLimit * gasPrice)

3. Tăng nonce của sender

4. Thực thi transaction:
   - Nếu "to" là EOA: chuyển value, trừ balance sender, cộng balance recipient
   - Nếu "to" là CA: chạy EVM với bytecode của contract
   - Nếu "to" rỗng (null): deploy contract mới

5. Hoàn trả gas không dùng hết về sender

6. Trả priority fee cho validator

7. Đốt base fee (kể từ EIP-1559)
```

### Genesis State

Mọi blockchain bắt đầu từ **genesis block** — block số 0, không có parent. Genesis block chứa **genesis state**: world state ban đầu với các account được khởi tạo (thường từ ICO/sale). Với Ethereum mainnet, genesis state được định nghĩa trong file `genesis.json`.

---

## Worked Example — Đọc Account Data Thực Tế

Ta dùng `web3.py` để đọc account data từ Ethereum mainnet (hoặc testnet):

```python
from web3 import Web3

w3 = Web3(Web3.HTTPProvider("https://eth.llamarpc.com"))

# Đọc EOA — ví dụ: một địa chỉ ngẫu nhiên
eoa_address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"  # vitalik.eth

nonce   = w3.eth.get_transaction_count(eoa_address)
balance = w3.eth.get_balance(eoa_address)
code    = w3.eth.get_code(eoa_address)

print(f"EOA Address : {eoa_address}")
print(f"Nonce       : {nonce}")
print(f"Balance     : {w3.from_wei(balance, 'ether'):.4f} ETH")
print(f"Code        : {code.hex()}")       # b'' nếu là EOA

# Đọc Contract Account — ví dụ: USDC token contract
usdc_address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

nonce_ca   = w3.eth.get_transaction_count(usdc_address)
balance_ca = w3.eth.get_balance(usdc_address)
code_ca    = w3.eth.get_code(usdc_address)

print(f"\nContract Address : {usdc_address}")
print(f"Nonce            : {nonce_ca}")
print(f"Balance (ETH)    : {w3.from_wei(balance_ca, 'ether'):.4f} ETH")
print(f"Code length      : {len(code_ca)} bytes")  # sẽ > 0
```

**Output mẫu:**
```text
EOA Address : 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
Nonce       : 1154
Balance     : 1006.6721 ETH
Code        : (rỗng — đây là EOA)

Contract Address : 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
Nonce            : 1
Balance (ETH)    : 0.0000 ETH
Code length      : 3118 bytes
```

### Đọc storage slot của contract

```python
# Đọc một storage slot cụ thể của contract
slot = 0  # slot 0 thường là biến đầu tiên trong contract

value = w3.eth.get_storage_at(usdc_address, slot)
print(f"Storage slot 0: {value.hex()}")
```

> [!note] Storage slot và layout
> Mỗi biến trạng thái trong Solidity được gán một **storage slot** (bắt đầu từ 0). Ví dụ: `uint256 public totalSupply` nằm ở slot 0. Ta có thể đọc thẳng từ storage mà không cần ABI — đây là kỹ năng quan trọng khi debug và audit smart contract.

---

## Summary / Key Takeaways

- Ethereum có hai loại account: **EOA** (kiểm soát bằng private key) và **Contract Account** (kiểm soát bằng bytecode).
- Mọi account đều có **4 trường**: nonce, balance, storageRoot, codeHash.
- **Nonce** ngăn replay attack và đảm bảo thứ tự transactions.
- **Balance** tính bằng wei ($1 \text{ ETH} = 10^{18}$ wei).
- **StorageRoot** là Merkle root của toàn bộ storage của contract.
- **CodeHash** là hash bất biến của EVM bytecode.
- **World State** $\sigma$ là tập hợp tất cả account states, biểu diễn bằng Merkle Patricia Trie.
- **State Transition** $\Upsilon(S, T) = S'$ là hàm cốt lõi: tất định, được thực thi giống nhau trên mọi node.

---

## References

- Ethereum Yellow Paper — Section 4 (World State), Section 6 (Transaction Execution)
- ethereum.org — [Accounts](https://ethereum.org/en/developers/docs/accounts/)
- ethereum.org — [State](https://ethereum.org/en/developers/docs/evm/state/)
- web3.py docs — [eth module](https://web3py.readthedocs.io/en/stable/web3.eth.html)
