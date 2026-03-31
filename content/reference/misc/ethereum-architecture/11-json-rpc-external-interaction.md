---
title: "11. JSON-RPC & External Interaction"
tags: [ethereum, blockchain, lesson-11, json-rpc, web3, api]
aliases: [JSON-RPC, Ethereum API, web3.py]
created: 2026-03-24
---

> **Prerequisites**: [[08-evm-architecture|08. EVM Architecture]], [[09-smart-contracts-abi-logs|09. Smart Contracts, ABI & Logs]]
> **Objectives**:
> - Hiểu JSON-RPC là giao thức gì và tại sao Ethereum dùng nó
> - Nắm các `eth_*` methods quan trọng nhất — params và return value
> - Biết block tag (`latest`, `safe`, `finalized`) có nghĩa gì
> - Dùng web3.py để đọc state, call contract, send transaction
> - Biết WebSocket subscription cho real-time events
> - Phân biệt `eth_call` (đọc) vs `eth_sendRawTransaction` (ghi)

---

## Motivation

Node Ethereum chạy trên server — ứng dụng của bạn cần cách nào đó để **nói chuyện với node** từ bên ngoài. Đó là lúc **JSON-RPC** đóng vai trò cầu nối: bạn gửi một request dạng JSON, node trả về dữ liệu blockchain dạng JSON. Đơn giản, stateless, ngôn ngữ-agnostic.

Toàn bộ thế giới Web3 — MetaMask, Etherscan, Uniswap, DeFi protocols — đều tương tác với Ethereum qua JSON-RPC. Hiểu layer này là hiểu cách thế giới bên ngoài nhìn vào và tác động vào blockchain.

---

## Concept: JSON-RPC Protocol

> [!definition] Definition 11.1 — JSON-RPC 2.0
> **JSON-RPC** là một giao thức gọi thủ tục từ xa (remote procedure call) dùng JSON làm định dạng dữ liệu. Ethereum dùng phiên bản 2.0.
>
> **Request format:**
> ```json
> {
>   "jsonrpc": "2.0",
>   "method": "eth_blockNumber",
>   "params": [],
>   "id": 1
> }
> ```
>
> **Response format:**
> ```json
> {
>   "jsonrpc": "2.0",
>   "result": "0x1312d00",
>   "id": 1
> }
> ```
>
> Tất cả số nguyên đều trả về dạng **hex string** với prefix `0x`. Ví dụ: block number `20,000,000` = `"0x1312d00"`.

Ethereum node expose JSON-RPC qua:
- **HTTP** (`http://localhost:8545`): Request/response đơn giản, stateless
- **WebSocket** (`ws://localhost:8546`): Bidirectional, hỗ trợ subscription (push notifications)
- **IPC** (`/path/to/geth.ipc`): Unix socket, local only, nhanh nhất

---

## Concept: Block Tags

Nhiều API nhận tham số `block_tag` — một cách chỉ định "tại thời điểm nào":

| Block tag | Nghĩa |
|-----------|-------|
| `"latest"` | Block mới nhất đã được propose (có thể bị reorg) |
| `"safe"` | Block đã được justify (sau 1 epoch, ~6.4 phút) — khó reorg |
| `"finalized"` | Block đã được finalize (sau 2 epochs, ~12.8 phút) — không thể reorg |
| `"pending"` | Trạng thái mempool hiện tại (chưa trong block nào) |
| `"earliest"` | Genesis block (block 0) |
| `"0x1a4b3c"` | Block number cụ thể (hex) |

> [!note] Khi nào dùng `safe` vs `finalized`?
> Với DeFi và exchange: dùng `finalized` để tránh mọi rủi ro reorg. Với UX hiển thị balance: `latest` đủ tốt. Với bridge: bắt buộc `finalized` để không bị exploit qua reorg.

---

## Concept: Các `eth_*` Methods Quan Trọng

### Đọc Block & Chain Info

```python
from web3 import Web3

w3 = Web3(Web3.HTTPProvider("https://eth.llamarpc.com"))

# Số block hiện tại
block_num = w3.eth.block_number
print(f"Latest block: #{block_num}")

# Thông tin block
block = w3.eth.get_block("latest")
print(f"Hash        : 0x{block['hash'].hex()}")
print(f"Timestamp   : {block['timestamp']}")
print(f"Gas used    : {block['gasUsed']:,} / {block['gasLimit']:,}")
print(f"Base fee    : {Web3.from_wei(block['baseFeePerGas'], 'gwei'):.4f} gwei")
print(f"Tx count    : {len(block['transactions'])}")

# Block với full transaction objects
block_full = w3.eth.get_block("latest", full_transactions=True)
```

### Đọc Account State

```python
vitalik = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

# Balance
balance = w3.eth.get_balance(vitalik)
print(f"Balance : {Web3.from_wei(balance, 'ether'):.4f} ETH")

# Nonce
nonce = w3.eth.get_transaction_count(vitalik)
print(f"Nonce   : {nonce}")

# Contract code
usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
code = w3.eth.get_code(usdc)
print(f"USDC code length: {len(code)} bytes")

# Storage slot
slot0 = w3.eth.get_storage_at(usdc, 0)
print(f"USDC storage slot 0: 0x{slot0.hex()}")
```

### `eth_call` — Đọc Contract (Không Gửi Transaction)

`eth_call` mô phỏng một transaction **mà không broadcast** lên mạng, không tốn gas, không thay đổi state. Dùng để đọc return value của view functions:

```python
from eth_abi import encode, decode
from eth_hash.auto import keccak

def eth_call_contract(w3, contract_addr, func_sig, param_types, params):
    """Gọi một view function của contract."""
    selector = keccak(func_sig.encode())[:4]
    calldata = selector + encode(param_types, params)
    result = w3.eth.call({
        "to": contract_addr,
        "data": calldata
    })
    return result

# Đọc balanceOf(vitalik) từ USDC contract
usdc    = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
vitalik = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

raw = eth_call_contract(w3, usdc, "balanceOf(address)", ["address"], [vitalik])
(balance_usdc,) = decode(["uint256"], raw)
print(f"Vitalik USDC balance: {balance_usdc / 10**6:.2f} USDC")
```

### `eth_sendRawTransaction` — Gửi Transaction

```python
from eth_account import Account

# Tạo account từ private key
private_key = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
account = Account.from_key(private_key)

# Build transaction
tx = {
    "from":    account.address,
    "to":      "0xRecipient...",
    "value":   Web3.to_wei(0.01, "ether"),
    "nonce":   w3.eth.get_transaction_count(account.address),
    "gas":     21000,
    "maxFeePerGas":         Web3.to_wei(30, "gwei"),
    "maxPriorityFeePerGas": Web3.to_wei(2, "gwei"),
    "chainId": 1,
    "type":    2,
}

# Ký và gửi
signed = account.sign_transaction(tx)
tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
print(f"Sent! txHash: 0x{tx_hash.hex()}")

# Chờ receipt
receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
print(f"Status: {'Success' if receipt['status'] == 1 else 'Failed'}")
print(f"Gas used: {receipt['gasUsed']}")
```

---

## Concept: `eth_getLogs` — Query Events

`eth_getLogs` là cách query event logs theo filter. Đây là API được dùng nhiều nhất bởi các indexer, dApps, và analytics tools:

```python
from eth_hash.auto import keccak

TRANSFER_TOPIC = "0x" + keccak(b"Transfer(address,address,uint256)").hex()
USDC_CONTRACT  = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

# Filter: tất cả Transfer events của USDC trong 1000 blocks gần nhất
latest = w3.eth.block_number
log_filter = {
    "fromBlock": hex(latest - 1000),
    "toBlock":   "latest",
    "address":   USDC_CONTRACT,
    "topics": [
        TRANSFER_TOPIC,  # topics[0] = Transfer event signature
        None,            # topics[1] = from (any)
        None,            # topics[2] = to (any)
    ]
}

logs = w3.eth.get_logs(log_filter)
print(f"Found {len(logs)} Transfer events in last 1000 blocks")

# Decode từng log
from eth_abi import decode
for log in logs[:3]:
    from_addr = "0x" + log["topics"][1].hex()[-40:]
    to_addr   = "0x" + log["topics"][2].hex()[-40:]
    (value,)  = decode(["uint256"], bytes(log["data"]))
    print(f"  {from_addr[:10]}... → {to_addr[:10]}...  {value / 10**6:.2f} USDC")
```

**Topics filtering với `None` vs specific value:**
- `None` → match bất kỳ giá trị
- `"0x000...Alice"` → chỉ match từ Alice
- `["0x000...Alice", "0x000...Bob"]` → match Alice **hoặc** Bob (OR logic)

---

## Concept: WebSocket Subscriptions (Real-time)

HTTP là stateless — bạn phải poll. WebSocket cho phép **node push data** khi có sự kiện mới:

```python
import asyncio
from web3 import AsyncWeb3, WebSocketProvider

async def listen_new_blocks():
    async with AsyncWeb3(WebSocketProvider("wss://eth.llamarpc.com")) as w3:
        # Subscribe nhận thông báo mỗi khi có block mới
        subscription_id = await w3.eth.subscribe("newHeads")
        print(f"Subscribed: {subscription_id}")

        async for response in w3.socket.process_subscriptions():
            block = response["result"]
            print(f"New block #{int(block['number'], 16)}: "
                  f"hash=0x{block['hash'][2:10]}... "
                  f"txs={len(block.get('transactions', []))}")

async def listen_pending_txs():
    async with AsyncWeb3(WebSocketProvider("wss://eth.llamarpc.com")) as w3:
        # Subscribe nhận hash của pending transactions mới
        await w3.eth.subscribe("newPendingTransactions")
        async for response in w3.socket.process_subscriptions():
            tx_hash = response["result"]
            print(f"Pending tx: {tx_hash}")

async def listen_usdc_transfers():
    async with AsyncWeb3(WebSocketProvider("wss://eth.llamarpc.com")) as w3:
        TRANSFER_TOPIC = "0x" + keccak(b"Transfer(address,address,uint256)").hex()
        # Subscribe chỉ nhận Transfer events của USDC
        await w3.eth.subscribe("logs", {
            "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            "topics":  [TRANSFER_TOPIC]
        })
        async for response in w3.socket.process_subscriptions():
            log = response["result"]
            print(f"USDC Transfer in block #{int(log['blockNumber'], 16)}")
```

### So sánh HTTP polling vs WebSocket

| | HTTP polling | WebSocket subscription |
|---|---|---|
| **Cơ chế** | Client hỏi định kỳ | Node push khi có sự kiện |
| **Độ trễ** | Phụ thuộc polling interval | Near real-time (~1s) |
| **Chi phí** | Nhiều request dù không có gì mới | Chỉ nhận khi có data |
| **Dùng cho** | Script, batch query | Frontend, alert, MEV bot |
| **Giới hạn** | Không thể subscribe | Cần kết nối liên tục |

---

## Concept: ethers.js (JavaScript)

Tương đương web3.py phía JavaScript — phổ biến hơn với frontend developers:

```javascript
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");

// Đọc balance
const balance = await provider.getBalance("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
console.log(`Balance: ${ethers.formatEther(balance)} ETH`);

// Tương tác với contract (cần ABI)
const USDC_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)"
];
const usdc = new ethers.Contract(
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    USDC_ABI,
    provider
);

const usdcBalance = await usdc.balanceOf("0xd8dA...");
console.log(`USDC balance: ${ethers.formatUnits(usdcBalance, 6)} USDC`);

// Subscribe real-time Transfer events
usdc.on("Transfer", (from, to, value, event) => {
    console.log(`Transfer: ${from} → ${to}: ${ethers.formatUnits(value, 6)} USDC`);
    console.log(`  txHash: ${event.log.transactionHash}`);
});
```

---

## Summary / Key Takeaways

- **JSON-RPC 2.0**: Giao thức request/response qua HTTP hoặc WebSocket; mọi số nguyên trả về dạng hex.
- **Block tags**: `latest` → mới nhất; `safe` → sau justify; `finalized` → sau finalize, không reorg.
- **`eth_call`**: Mô phỏng call read-only, không tốn gas, không thay đổi state.
- **`eth_sendRawTransaction`**: Gửi signed transaction đã RLP encoded lên mạng.
- **`eth_getLogs`**: Query event logs theo address, topics, block range. `null` topic = wildcard.
- **WebSocket `eth_subscribe`**: Nhận push notification cho `newHeads`, `newPendingTransactions`, `logs`.
- **web3.py** (Python) và **ethers.js** (JS) là hai thư viện phổ biến nhất để tương tác với Ethereum.

---

## References

- Ethereum JSON-RPC spec — [ethereum.org/developers/docs/apis/json-rpc](https://ethereum.org/en/developers/docs/apis/json-rpc/)
- web3.py docs — [web3py.readthedocs.io](https://web3py.readthedocs.io)
- ethers.js docs — [docs.ethers.org](https://docs.ethers.org)
- EIP-1474 — Remote Procedure Call Specification
