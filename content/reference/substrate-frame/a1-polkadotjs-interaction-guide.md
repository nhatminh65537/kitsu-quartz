---
title: "A1. Polkadot.js Interaction Guide"
tags: [blockchain, substrate, polkadotjs, interaction, reference, appendix]
aliases: [Polkadot.js Interaction Guide]
created: 2026-03-16
---

> **Appendix cho**: [[07-build-and-deploy-local|07. Build & Deploy Local]], [[08-deploy-to-paseo-testnet|08. Deploy lên Paseo Testnet]]

Tài liệu tham chiếu cho tương tác với Substrate chain qua Polkadot.js Apps (UI) và Polkadot.js API (JavaScript).

---

## Kết nối

### Polkadot.js Apps (UI)

Truy cập `https://polkadot.js.org/apps` rồi chọn endpoint:

| Môi trường | Endpoint |
|-----------|---------|
| Local node (dev) | `ws://127.0.0.1:9944` |
| Paseo testnet | `wss://rpc.ibp.network/paseo` |
| Paseo (alternative) | `wss://paseo.rpc.amforc.com` |

1. Click logo Polkadot góc trái → chọn mục **Development** hoặc **Test Networks**
2. Nhập endpoint tùy chỉnh nếu cần
3. Click **Switch**

---

## Extrinsics — Gọi Dispatchable

**Developer** → **Extrinsics**

| Field | Ý nghĩa |
|-------|---------|
| Account | Account ký extrinsic (signed origin) |
| Pallet | Tên pallet (tự động từ metadata) |
| Call | Tên dispatchable |
| Params | Tham số (tự động sinh form theo type) |

**Submit**: Click **Submit Transaction** → popup xác nhận → **Sign and Submit**

### Gọi với Root Origin (sudo)

1. Pallet: `sudo`
2. Call: `sudo`
3. Trong bên trong: chọn pallet và call muốn thực thi với Root
4. Account phải là sudo key (thường là Alice trong dev)

---

## Chain State — Đọc Storage

**Developer** → **Chain state**

| Loại | Cách query |
|------|-----------|
| `StorageValue` | Chọn pallet + item → click `+` |
| `StorageMap` | Chọn pallet + item → nhập key → click `+` |
| `StorageDoubleMap` | Nhập cả key1 và key2 |
| Toàn bộ map | Bật **include option** + bỏ trống key |

### Encode key đúng format

Polkadot.js tự hiểu type từ metadata. Ví dụ:
- `AccountId`: nhập SS58 address (`5GrwvaEF...`)
- `BoundedVec<u8, ...>`: nhập hex bytes (`0x736861323536...`) hoặc text
- `u32`: nhập số thập phân

---

## Events — Xem và Filter

**Network** → **Explorer**

- Cột phải: **recent events** của block mới nhất
- Click vào event để xem chi tiết (decoded fields)

**Developer** → **Chain state** → **system** → **events** → query tất cả events của block hiện tại.

---

## RPC Calls — Gọi Trực tiếp

**Developer** → **RPC calls**

Ví dụ hữu ích:

| RPC | Mục đích |
|-----|---------|
| `state_getStorage(key)` | Đọc raw storage bằng hex key |
| `chain_getBlock()` | Block mới nhất |
| `system_health()` | Trạng thái node |
| `rpc_methods()` | Danh sách tất cả RPC methods |

---

## Constants — Xem Pallet Constants

**Developer** → **Chain state** → tab **Constants**

Ví dụ: Chọn `notarization` → `maxClaimSize` → xem giá trị `ConstU32<256>` được inject.

---

## Polkadot.js API (JavaScript/TypeScript)

Dùng khi muốn tương tác programmatic — build frontend DApp, automation script.

### Cài đặt

```bash
npm install @polkadot/api
```

### Kết nối và đọc Storage

```javascript
import { ApiPromise, WsProvider } from '@polkadot/api';

const provider = new WsProvider('ws://127.0.0.1:9944');
const api = await ApiPromise.create({ provider });

// Đọc StorageValue
const totalClaims = await api.query.notarization.totalClaims();
console.log('Total claims:', totalClaims.toNumber());

// Đọc StorageMap
const claimInfo = await api.query.notarization.proofs(
    '0x736861323536...'  // BoundedVec key dạng hex
);
if (claimInfo.isSome) {
    const [owner, blockNumber] = claimInfo.unwrap();
    console.log('Owner:', owner.toString());
    console.log('Created at block:', blockNumber.toNumber());
}
```

### Gọi Extrinsic (Signed)

```javascript
import { Keyring } from '@polkadot/keyring';

const keyring = new Keyring({ type: 'sr25519' });
const alice = keyring.addFromUri('//Alice');  // dev account

const claimBytes = new Uint8Array([0x73, 0x68, 0x61, 0x32, 0x35, 0x36]);

const txHash = await api.tx.notarization
    .createClaim(claimBytes)
    .signAndSend(alice, ({ status, events }) => {
        if (status.isInBlock) {
            console.log('In block:', status.asInBlock.toString());
            events.forEach(({ event }) => {
                if (api.events.notarization.ClaimCreated.is(event)) {
                    const [owner, claim, blockNumber] = event.data;
                    console.log('Claim created by:', owner.toString());
                }
            });
        }
    });
```

### Subscribe Events

```javascript
// Subscribe toàn bộ events của chain
const unsub = await api.query.system.events((events) => {
    events.forEach((record) => {
        const { event } = record;
        if (api.events.notarization.ClaimCreated.is(event)) {
            console.log('New claim created!', event.data.toHuman());
        }
    });
});

// Dừng subscribe
// unsub();
```

### Đọc Constants

```javascript
const maxClaimSize = api.consts.notarization.maxClaimSize;
console.log('Max claim size:', maxClaimSize.toNumber());
```

### Query Metadata

```javascript
// Lấy toàn bộ metadata của chain — pallet, storage, calls, events
const metadata = await api.rpc.state.getMetadata();
console.log(metadata.toHuman());
```

---

## Accounts trong Development

### Development Accounts (sẵn có trong `--dev` mode)

```javascript
const keyring = new Keyring({ type: 'sr25519' });

const alice = keyring.addFromUri('//Alice');
const bob = keyring.addFromUri('//Bob');
const charlie = keyring.addFromUri('//Charlie');
```

SS58 addresses tương ứng (Substrate prefix 42):

| Account | SS58 Address |
|---------|-------------|
| Alice | `5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY` |
| Bob | `5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty` |
| Charlie | `5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y` |

### Tạo Account từ Mnemonic

```javascript
const alice = keyring.addFromMnemonic('word1 word2 ... word12');
```

### Tạo Account từ JSON (export từ extension)

```javascript
const pair = keyring.createFromJson(jsonObject);
pair.decodePkcs8('your-password');
```

---

## Utility Scripts Hay Dùng

### Check balance

```javascript
const { data: { free } } = await api.query.system.account(alice.address);
console.log('Free balance:', free.toHuman());
```

### Transfer token

```javascript
await api.tx.balances
    .transferKeepAlive(bob.address, 1_000_000_000_000n)
    .signAndSend(alice);
```

### Đọc block hiện tại

```javascript
const header = await api.rpc.chain.getHeader();
console.log('Block number:', header.number.toNumber());
```

### Wait for finalization

```javascript
await new Promise((resolve) => {
    api.tx.notarization.createClaim(claimBytes)
        .signAndSend(alice, ({ status }) => {
            if (status.isFinalized) resolve(status.asFinalized);
        });
});
```

---

## Troubleshooting Polkadot.js

| Vấn đề | Giải pháp |
|--------|----------|
| "Unknown type" khi query | Chain chưa kết nối hoặc metadata chưa load — reload trang |
| Transaction bị reject "BadProof" | Nonce mismatch — reload trang hoặc chờ vài giây |
| Không thấy pallet trong dropdown | Pallet chưa được đăng ký trong `construct_runtime!` hoặc build chưa đúng |
| Events không hiện | Kiểm tra `#[pallet::generate_deposit(...)]` và `deposit_event()` trong dispatchable |
| RPC timeout | Node chưa sẵn sàng — đợi log "Imported #1" rồi mới kết nối |
| Extension không thấy chain | Mở Settings → nhập custom network với genesis hash của chain |

---

## Polkadot.js Extension — Cài và Dùng

1. Cài từ Chrome Web Store hoặc Firefox: **Polkadot{.js} extension**
2. Tạo account → lưu mnemonic
3. Khi Polkadot.js Apps yêu cầu kết nối extension → Approve
4. Ký transaction: extension popup → nhập password → Approve

### Export Account JSON (backup)

Trong extension → click account → **Export Account** → nhập password → lưu file JSON.

---

## RPC Endpoints Hữu ích cho Paseo

| Service | URL |
|---------|-----|
| IBP Network | `wss://rpc.ibp.network/paseo` |
| Amforc | `wss://paseo.rpc.amforc.com` |
| Polkadot.js Apps (Paseo pre-set) | `https://polkadot.js.org/apps/?rpc=wss://rpc.ibp.network/paseo` |
| Paseo Explorer (Subscan) | `https://paseo.subscan.io` |
| Faucet | `https://faucet.polkadot.io` |

---

## References

- Polkadot.js Apps — https://polkadot.js.org/apps
- Polkadot.js API Docs — https://polkadot.js.org/docs/api
- Polkadot.js API Examples — https://polkadot.js.org/docs/api/examples/promise
- Paseo Network — https://github.com/paseo-network
