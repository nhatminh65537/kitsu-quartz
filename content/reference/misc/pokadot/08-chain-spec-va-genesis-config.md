---
title: "08. Chain Spec & Genesis Config"
type: tool
tags: [substrate, chainspec, genesis, deployment, lesson-08]
aliases: [Chain Spec Genesis]
created: 2026-04-18
---

> **Prerequisites**: [[01-setup-va-chay-chain-dau-tien|Lesson 01]], [[06-balances-va-currency-trait|Lesson 06]]
> **Objectives**:
> - Hiểu Chain Spec là gì và cấu trúc của nó
> - Tùy chỉnh genesis state: accounts, sudo key, initial balances
> - Export chain spec JSON và dùng `--chain` flag
> - Chuẩn bị chain spec cho bước deploy multi-node (Lesson 10)

---

## Chain Spec Là Gì?

**Chain Spec** (chain specification) là file JSON (hoặc Rust struct) định nghĩa mọi thứ về chain của bạn:

- Tên chain, network ID, protocol version
- Danh sách bootnodes ban đầu
- **Genesis state** — trạng thái ban đầu của tất cả pallets (balances, sudo key, validators...)
- Consensus engine config

Giống như `hardhat.config.js` + `migrations/` trong Hardhat, nhưng tất cả trong một file.

---

## 1. Xem Chain Spec Dev Có Sẵn

```bash
# Export chain spec hiện tại dưới dạng JSON
./target/release/solochain-template-node build-spec --dev > chain-spec-dev.json
cat chain-spec-dev.json | head -60
```

Output (rút gọn):

```json
{
  "name": "Development",
  "id": "dev",
  "chainType": "Development",
  "bootNodes": [],
  "telemetryEndpoints": null,
  "protocolId": null,
  "properties": null,
  "genesis": {
    "runtimeGenesis": {
      "code": "0x...",   // Wasm runtime binary (hex)
      "patch": {
        "balances": {
          "balances": [
            ["5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", 1152921504606846975],
            // Alice, Bob, Charlie...
          ]
        },
        "sudo": {
          "key": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"  // Alice
        }
      }
    }
  }
}
```

---

## 2. Tùy Chỉnh Genesis Trong Rust

Genesis config được định nghĩa trong `node/src/chain_spec.rs`. Mở file này:

```rust
pub fn development_config() -> Result<ChainSpec, String> {
    Ok(ChainSpec::builder(
        WASM_BINARY.ok_or_else(|| "Development wasm not available".to_string())?,
        None,
    )
    .with_name("Development")
    .with_id("dev")
    .with_chain_type(ChainType::Development)
    .with_genesis_config_patch(testnet_genesis(
        // Initial PoA authorities (validators)
        vec![authority_keys_from_seed("Alice")],
        // Sudo key
        get_account_id_from_seed::<sr25519::Public>("Alice"),
        // Pre-funded accounts
        vec![
            get_account_id_from_seed::<sr25519::Public>("Alice"),
            get_account_id_from_seed::<sr25519::Public>("Bob"),
            // Thêm accounts ở đây
        ],
        true,
    ))
    .build())
}
```

### Hàm `testnet_genesis`

```rust
fn testnet_genesis(
    initial_authorities: Vec<(AuraId, GrandpaId)>,
    root_key: AccountId,
    endowed_accounts: Vec<AccountId>,
    _enable_println: bool,
) -> serde_json::Value {
    serde_json::json!({
        "balances": {
            "balances": endowed_accounts.iter().cloned()
                .map(|k| (k, 1u128 << 60))  // 2^60 tokens cho mỗi account
                .collect::<Vec<_>>(),
        },
        "aura": {
            "authorities": initial_authorities.iter().map(|x| (x.0.clone())).collect::<Vec<_>>(),
        },
        "grandpa": {
            "authorities": initial_authorities.iter().map(|x| (x.1.clone(), 1)).collect::<Vec<_>>(),
        },
        "sudo": {
            "key": Some(root_key),
        },
    })
}
```

---

## 3. Tạo Chain Spec Tùy Chỉnh Cho SimpleChain

### Thêm Custom Accounts Và Balances

Sửa `node/src/chain_spec.rs`:

```rust
use sp_core::{sr25519, Pair, Public};
use sp_runtime::traits::{IdentifyAccount, Verify};
use node_template_runtime::{AccountId, Signature};

type AccountPublic = <Signature as Verify>::Signer;

/// Tạo AccountId từ seed string
pub fn get_account_id_from_seed<TPublic: Public>(seed: &str) -> AccountId
where
    AccountPublic: From<<TPublic::Pair as Pair>::Public>,
{
    AccountPublic::from(TPublic::Pair::from_string(&format!("//{}", seed), None)
        .expect("static values are valid; qed")
        .public())
    .into_account()
}

// Chain spec cho SimpleChain testnet
pub fn simplechain_config() -> Result<ChainSpec, String> {
    Ok(ChainSpec::builder(
        WASM_BINARY.ok_or_else(|| "Wasm not available".to_string())?,
        None,
    )
    .with_name("SimpleChain Testnet")           // Tên chain
    .with_id("simplechain_testnet")             // Chain ID (unique)
    .with_chain_type(ChainType::Local)          // Local testnet
    .with_protocol_id("sclocal")               // libp2p protocol prefix
    .with_genesis_config_patch(simplechain_genesis(
        vec![
            authority_keys_from_seed("Alice"),
            authority_keys_from_seed("Bob"),   // 2 validators
        ],
        get_account_id_from_seed::<sr25519::Public>("Alice"),
        vec![
            get_account_id_from_seed::<sr25519::Public>("Alice"),
            get_account_id_from_seed::<sr25519::Public>("Bob"),
            get_account_id_from_seed::<sr25519::Public>("Charlie"),
            get_account_id_from_seed::<sr25519::Public>("Dave"),
        ],
    ))
    .build())
}

fn simplechain_genesis(
    initial_authorities: Vec<(AuraId, GrandpaId)>,
    root_key: AccountId,
    endowed_accounts: Vec<AccountId>,
) -> serde_json::Value {
    serde_json::json!({
        "balances": {
            "balances": endowed_accounts.iter().cloned()
                .map(|k| (k, 1_000_000_000_000_000u128))  // 1_000 tokens (12 decimals)
                .collect::<Vec<_>>(),
        },
        "aura": {
            "authorities": initial_authorities.iter()
                .map(|x| x.0.clone()).collect::<Vec<_>>(),
        },
        "grandpa": {
            "authorities": initial_authorities.iter()
                .map(|x| (x.1.clone(), 1u64)).collect::<Vec<_>>(),
        },
        "sudo": { "key": Some(root_key) },
    })
}
```

Thêm case mới vào hàm `load_spec`:

```rust
fn load_spec(&self, id: &str) -> Result<Box<dyn ChainSpec>, String> {
    Ok(match id {
        "dev" => Box::new(chain_spec::development_config()?),
        "local" => Box::new(chain_spec::local_testnet_config()?),
        "simplechain" => Box::new(chain_spec::simplechain_config()?),  // thêm dòng này
        "" | "template-local" => Box::new(chain_spec::local_testnet_config()?),
        path => Box::new(ChainSpec::from_json_file(std::path::PathBuf::from(path))?),
    })
}
```

---

## 4. Build và Export Chain Spec

```bash
cargo build --release

# Export chain spec dạng "human-readable" JSON
./target/release/solochain-template-node build-spec \
  --chain simplechain \
  --disable-default-bootnode \
  > simplechain-spec.json

# Xem genesis state
cat simplechain-spec.json | python3 -m json.tool | grep -A5 '"balances"'
```

### Convert Sang Raw Format

Raw format encode tất cả keys về dạng hex — dùng khi chạy nodes thực tế:

```bash
./target/release/solochain-template-node build-spec \
  --chain simplechain-spec.json \
  --raw \
  --disable-default-bootnode \
  > simplechain-spec-raw.json
```

> [!info] Human-readable vs Raw
> - `simplechain-spec.json` — dễ đọc, dùng để kiểm tra và edit
> - `simplechain-spec-raw.json` — dùng khi chạy node thực (`--chain simplechain-spec-raw.json`)

---

## 5. Chạy Node Với Custom Chain Spec

```bash
# Xóa state cũ
./target/release/solochain-template-node purge-chain \
  --chain simplechain-spec-raw.json -y

# Chạy node với chain spec tùy chỉnh
./target/release/solochain-template-node \
  --chain simplechain-spec-raw.json \
  --alice \
  --validator \
  --tmp
```

Trên Polkadot.js Apps, bạn sẽ thấy chain name là **"SimpleChain Testnet"** thay vì "Development".

---

## 6. Kiểm Tra Genesis State

```bash
# Kết nối Polkadot.js và kiểm tra:
# Developer → Chain State → balances → totalIssuance
# Phải là 4 * 1_000_000_000_000_000 = 4_000_000_000_000_000

# Kiểm tra sudo key
# Developer → Chain State → sudo → key
# Phải là địa chỉ Alice
```

---

## Bài Tập Thực Hành

> [!example] Bài tập 8.1 — Thêm 5 test accounts
> Sửa `simplechain_genesis` để thêm accounts Eve, Ferdie, Geoff với balances khác nhau. Export chain spec mới và verify.

> [!example] Bài tập 8.2 — Genesis state cho pallet-notepad
> Thêm initial notes vào genesis. Trong `simplechain_genesis`, thêm:
> ```json
> "notepad": {
>   "userNotes": [
>     [["5GrwvaEF...", 0], "0x48656c6c6f"]
>   ]
> }
> ```
> Restart chain và verify note xuất hiện ngay từ block 0.

---

## Tóm Tắt

| Bước | Command |
|------|---------|
| Xem spec dạng human-readable | `build-spec --chain NAME > spec.json` |
| Convert sang raw | `build-spec --chain spec.json --raw > spec-raw.json` |
| Chạy với spec tùy chỉnh | `--chain spec-raw.json` |
| Xóa state cũ | `purge-chain --chain spec-raw.json -y` |

Chain spec là "passport" của chain — xác định identity và trạng thái ban đầu. Bước tiếp theo (Lesson 10) sẽ dùng chain spec này để chạy multi-node testnet.

---

*[[07-testing-pallets|← Lesson 07]] | [[09-runtime-hooks|Lesson 09 →]]*
