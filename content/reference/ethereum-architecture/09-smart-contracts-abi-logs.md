---
title: "09. Smart Contracts, ABI & Logs"
tags: [ethereum, blockchain, lesson-09, abi, smart-contract, events, logs]
aliases: [ABI Encoding, Smart Contract Interaction, Ethereum Logs]
created: 2026-03-24
---

> **Prerequisites**: [[08-evm-architecture|08. EVM Architecture]], [[03-rlp-encoding|03. RLP Encoding]]
> **Objectives**:
> - Hiểu ABI (Application Binary Interface) là gì và tại sao cần nó
> - Nắm quy tắc ABI encoding cho static và dynamic types
> - Biết function selector là gì và cách EVM dispatch function calls
> - Hiểu cấu trúc Event log: topics (indexed) và data (non-indexed)
> - Biết Bloom filter trong block header dùng để làm gì
> - Tự encode/decode calldata và logs bằng Python

---

## Motivation

Ở Lesson 08, ta biết contract nhận dữ liệu qua **calldata** — một chuỗi bytes thô. Nhưng làm sao Solidity biết `0xa9059cbb000...` là lời gọi đến hàm `transfer(address, uint256)`, và `0x000...d8da` là địa chỉ `0xd8dA...`? Câu trả lời là **ABI** (Application Binary Interface) — quy ước encoding dữ liệu giữa EVM và thế giới bên ngoài.

Cùng với đó, **Event logs** là cách duy nhất smart contract có thể "ghi nhật ký" (log) ra ngoài — rẻ hơn ghi storage, và có thể được subscribe bởi ứng dụng bên ngoài theo real-time. Hiểu ABI và logs là bước đầu tiên để xây dựng bất kỳ ứng dụng Ethereum nào.

---

## Concept: ABI là gì?

> [!definition] Definition 9.1 — ABI (Application Binary Interface)
> **ABI** là quy ước encoding/decoding dữ liệu khi tương tác với smart contract. Nó định nghĩa:
>
> - Cách encode **function call** thành calldata bytes
> - Cách decode **return value** từ bytes về các kiểu dữ liệu cụ thể
> - Cách encode **event log** parameters
>
> ABI không được lưu trên blockchain — nó chỉ là một spec. Contract code hoàn toàn là bytecode thô; ABI là "schema" mà client-side dùng để giao tiếp với bytecode đó.

---

## Concept: Function Selector

Khi gọi một function trong smart contract, 4 bytes đầu của calldata là **function selector**:

> [!definition] Definition 9.2 — Function Selector
> **Function selector** = 4 bytes đầu của `keccak256(function_signature)`.
>
> **Function signature** = tên hàm + kiểu tham số, không có tên tham số, không có khoảng trắng.
>
> Ví dụ: `transfer(address,uint256)` → `keccak256("transfer(address,uint256)")[:4]` = `0xa9059cbb`

```python
from eth_hash.auto import keccak

def function_selector(sig: str) -> str:
    return keccak(sig.encode())[:4].hex()

print(function_selector("transfer(address,uint256)"))   # a9059cbb
print(function_selector("balanceOf(address)"))          # 70a08231
print(function_selector("approve(address,uint256)"))    # 095ea7b3
print(function_selector("totalSupply()"))               # 18160ddd
```

Khi EVM nhận calldata, nó đọc 4 bytes đầu, so sánh với các selectors trong contract, và nhảy đến đúng function qua `JUMPI`. Đây là cơ chế **dispatch** của EVM.

> [!note] Selector collision
> Hai function signature khác nhau có thể có cùng 4-byte selector (collision). Ví dụ nổi tiếng: `clash650254751(uint256)` và `remix_test_6501()` cùng cho selector `0xa9059cbb`. Solidity từ chối compile nếu trong cùng contract có hai hàm có cùng selector.

---

## Concept: ABI Encoding — Quy Tắc Cơ Bản

ABI encoding chia tham số thành hai loại:

> [!definition] Definition 9.3 — Static vs Dynamic Types
>
> **Static types** (kích thước cố định): `uint256`, `int128`, `bool`, `bytes32`, `address`, v.v.
> → Được encode **in-place** tại vị trí tương ứng, mỗi type chiếm đúng 1 word (32 bytes).
>
> **Dynamic types** (kích thước biến đổi): `bytes`, `string`, `T[]`, `T[n]` với T là dynamic, tuple chứa dynamic.
> → Tại vị trí tương ứng, chỉ lưu **offset** (vị trí bắt đầu dữ liệu thực). Dữ liệu thực được đặt ở cuối.

### Quy tắc padding

- **uint/int**: Padding zeros bên **trái** (left-padded) thành 32 bytes. Ví dụ: `uint256(1)` → `0x000...001`
- **bool**: `true` = `0x000...001`, `false` = `0x000...000`
- **address**: 20 bytes, padding zeros bên **trái** thành 32 bytes
- **bytes32**: Padding zeros bên **phải** (right-padded)
- **bytes** (dynamic): `length` (32 bytes) + data (right-padded đến bội số 32)
- **string**: Giống `bytes` — UTF-8 encoded

### Ví dụ: `transfer(address, uint256)`

Gọi `transfer(0xd8dA...6045, 1000 * 10^18)`:

```text
calldata = selector + ABI_encode(address, uint256)

Byte 0-3  : a9059cbb                    ← selector của transfer(address,uint256)
Byte 4-35 : 000000000000000000000000    ← address (12 bytes padding)
            d8da6bf26964af9d7eed9e03    ← address (20 bytes)
            e53415d37aa96045
Byte 36-67: 00000000000000000000000000  ← uint256 = 1000 ETH in wei
            0000003635c9adc5dea00000
```

### Ví dụ: `f(uint256, bytes, address)` — Dynamic type

```python
from eth_abi import encode

data = encode(
    ['uint256', 'bytes', 'address'],
    [1, bytes.fromhex('deadbeef'), '0x1234567890123456789012345678901234567890']
)

# Kết quả (160 bytes = 5 words × 32 bytes):
# Word 0 [  0]: 0000...0001     ← uint256 = 1 (static, in-place)
# Word 1 [ 32]: 0000...0060     ← offset = 96 (bytes bắt đầu tại byte 96)
# Word 2 [ 64]: 0000...1234...  ← address (static, in-place)
# Word 3 [ 96]: 0000...0004     ← length of bytes = 4
# Word 4 [128]: deadbeef000...  ← bytes data (right-padded to 32 bytes)
```

---

## Concept: Event Logs

Smart contract không thể gửi dữ liệu trực tiếp ra bên ngoài, nhưng có thể emit **events** — các bản ghi được lưu trong **Transaction Receipt** (không phải trong state trie).

> [!definition] Definition 9.4 — Event Log
> Mỗi **log** (sự kiện) được emit bởi một opcode `LOGn` và gồm:
>
> - **address**: Địa chỉ contract emit event
> - **topics**: Mảng 0–4 phần tử, mỗi phần tử 32 bytes
>   - `topics[0]`: Luôn là `keccak256(event_signature)` (trừ anonymous events)
>   - `topics[1..3]`: Các tham số được đánh dấu `indexed`
> - **data**: ABI encode của các tham số **không** `indexed`

Event `Transfer` của ERC-20:

```solidity
event Transfer(address indexed from, address indexed to, uint256 value);
```

```text
Khi emit Transfer(Alice, Bob, 1000 * 10^18):

topics[0] = keccak256("Transfer(address,address,uint256)")
          = 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef

topics[1] = 0x000...0000d8dA6BF26964aF9D7eEd9e03E53415D37aA96045
           (Alice address, padded left to 32 bytes)

topics[2] = 0x000...000Ab5801a7D398351b8bE11C439e05C5B3259aeC9B
           (Bob address, padded left to 32 bytes)

data      = 0x00000000000000000000000000000000000000000000003635c9adc5dea00000
           (uint256 value = 1000 * 10^18)
```

> [!note] Tại sao có indexed và non-indexed?
> Indexed parameters được lưu vào topics — có thể filter nhanh khi query logs. Non-indexed parameters đi vào data — rẻ hơn (8 gas/byte thay vì 375 gas/topic). Giới hạn: tối đa 3 indexed params. Kiểu động (`bytes`, `string`) nếu indexed sẽ bị hash.

### Gas cost của LOGn opcodes

| Opcode | Gas base | + per topic | + per byte data |
|--------|----------|-------------|-----------------|
| `LOG0` | 375 | — | 8 |
| `LOG1` | 750 | 375 | 8 |
| `LOG2` | 1,125 | 375 | 8 |
| `LOG3` | 1,500 | 375 | 8 |
| `LOG4` | 1,875 | 375 | 8 |

Emit `Transfer` với 2 indexed address + 1 uint256 data (32 bytes):
`LOG3 = 1500 + 8×32 = 1756 gas`

---

## Concept: Bloom Filter trong Block Header

Với hàng nghìn transactions mỗi block, mỗi transaction có thể emit nhiều events — làm sao ứng dụng tìm nhanh tất cả `Transfer` events trong một khoảng block mà không cần scan toàn bộ?

> [!definition] Definition 9.5 — Logs Bloom Filter
> Mỗi block header chứa một **logsBloom** — một Bloom filter 256 bytes (2048 bits) tổng hợp tất cả log addresses và topics trong block đó.
>
> Với một query "block X có event Transfer của USDC không?", node chỉ cần kiểm tra logsBloom trong block header (rất nhanh). Nếu Bloom filter trả về **không**, chắc chắn không có event đó. Nếu trả về **có**, cần scan chi tiết (có thể false positive).
>
> Đây là nền tảng của `eth_getLogs` API với `fromBlock`/`toBlock` filters.

---

## Worked Example: Encode & Decode bằng Python

### Encode calldata thủ công

```python
from eth_abi import encode
from eth_hash.auto import keccak

def build_calldata(func_sig: str, param_types: list, params: list) -> bytes:
    """Tạo calldata = selector + ABI encoded params."""
    selector = keccak(func_sig.encode())[:4]
    encoded_params = encode(param_types, params)
    return selector + encoded_params


alice = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
amount = 1000 * 10**18

calldata = build_calldata(
    "transfer(address,uint256)",
    ["address", "uint256"],
    [alice, amount]
)

print(f"Calldata ({len(calldata)} bytes):")
print(f"  Selector : 0x{calldata[:4].hex()}")
print(f"  Params   : {calldata[4:].hex()}")
```

### Decode calldata nhận được

```python
from eth_abi import decode

raw_calldata = bytes.fromhex(
    "a9059cbb"
    "000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045"
    "00000000000000000000000000000000000000000000003635c9adc5dea00000"
)

selector = raw_calldata[:4].hex()
print(f"Selector: 0x{selector}")

if selector == "a9059cbb":
    to_addr, value = decode(["address", "uint256"], raw_calldata[4:])
    print(f"Function: transfer(address,uint256)")
    print(f"  to    : {to_addr}")
    print(f"  value : {value / 10**18:.2f} tokens")
```

### Decode một Transfer event log

```python
from eth_abi import decode
from eth_hash.auto import keccak

# Giả sử đây là log nhận được từ eth_getLogs
log = {
    "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",  # USDC
    "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045",
        "0x000000000000000000000000ab5801a7d398351b8be11c439e05c5b3259aec9b",
    ],
    "data": "0x0000000000000000000000000000000000000000000000000000000005f5e100",
}

# Verify topic[0] là Transfer event
TRANSFER_TOPIC = keccak(b"Transfer(address,address,uint256)").hex()
assert log["topics"][0] == "0x" + TRANSFER_TOPIC, "Không phải Transfer event!"

# Decode indexed params từ topics (bỏ 12 bytes padding đầu = lấy 20 bytes cuối)
from_addr = "0x" + log["topics"][1][-40:]
to_addr   = "0x" + log["topics"][2][-40:]

# Decode non-indexed params từ data
(value,) = decode(["uint256"], bytes.fromhex(log["data"][2:]))

print(f"Transfer Event:")
print(f"  Contract : {log['address']}")
print(f"  From     : {from_addr}")
print(f"  To       : {to_addr}")
print(f"  Value    : {value / 10**6:.2f} USDC")  # USDC có 6 decimals
```

**Output:**
```text
Transfer Event:
  Contract : 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
  From     : 0xd8da6bf26964af9d7eed9e03e53415d37aa96045
  To       : 0xab5801a7d398351b8be11c439e05c5b3259aec9b
  Value    : 100.00 USDC
```

---

## Concept: Fallback và Receive

Hai hàm đặc biệt không có selector trong contract:

> [!definition] Definition 9.6 — Fallback & Receive
>
> **`receive()`**: Chạy khi contract nhận ETH mà **không có calldata**. Nếu không có `receive()`, transaction gửi ETH sẽ revert.
>
> **`fallback()`**: Chạy khi **không tìm thấy selector** tương ứng trong calldata (hoặc calldata rỗng mà không có `receive()`). Dùng để implement proxy pattern.

```text
Calldata rỗng + ETH gửi  →  receive() (nếu có)
Calldata có selector không khớp  →  fallback() (nếu có)
Không có cả hai mà vẫn gửi ETH  →  REVERT
```

---

## Summary / Key Takeaways

- **ABI** là quy ước encode/decode dữ liệu giữa EVM và thế giới ngoài — không lưu trên chain.
- **Function selector** = 4 bytes đầu của `keccak256(function_sig)` — EVM dispatch function qua selector.
- **Static types** encode in-place; **dynamic types** (bytes, string, array) encode bằng offset + length + data.
- **Event log** gồm `topics` (indexed, dễ filter) và `data` (non-indexed, rẻ hơn). Tối đa 4 topics.
- `topics[0]` luôn là `keccak256(event_signature)` — dùng để identify loại event.
- **Bloom filter** trong block header cho phép filter nhanh blocks có chứa event cụ thể.

---

## References

- ABI Specification — [docs.soliditylang.org/abi-spec](https://docs.soliditylang.org/en/latest/abi-spec.html)
- ethereum.org — [Smart Contract ABI](https://ethereum.org/en/developers/docs/smart-contracts/compiling/#web-applications)
- EIP-838 — ABI specification for revert reasons
- eth-abi Python library — [github.com/ethereum/eth-abi](https://github.com/ethereum/eth-abi)
- evm.codes — [Opcodes reference](https://www.evm.codes)
