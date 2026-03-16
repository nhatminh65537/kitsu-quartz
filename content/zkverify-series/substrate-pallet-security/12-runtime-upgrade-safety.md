---
title: "12. Runtime Upgrade Safety"
tags: [security, substrate, frame, runtime-upgrade, migration, storage-version, try-runtime, lesson-12]
aliases: [Runtime Upgrade Safety]
created: 2026-03-16
---

> **Prerequisites**: [[01-frame-architecture|01. FRAME Architecture]] — biết `on_runtime_upgrade`, `construct_runtime!`, storage items
> **Objectives**:
> - Hiểu cơ chế forkless runtime upgrade và tại sao migration là bắt buộc
> - Phân loại lỗi migration: thiếu migration, double-run, ordering sai, data corruption
> - Hiểu `StorageVersion` và `#[pallet::storage_version]` pattern
> - Biết cách dùng `try-runtime` để test migration trước khi deploy

---

## Motivation

Substrate cho phép **forkless runtime upgrade** — runtime logic (WASM binary) được lưu trên chain và có thể thay đổi qua governance vote mà không cần fork chain. Đây là tính năng mạnh nhất của Substrate.

Nhưng kèm theo đó là một nguy cơ nghiêm trọng: **nếu runtime logic thay đổi cách interpret storage mà không migrate storage trước**, tất cả dữ liệu cũ sẽ bị **misinterpreted** — đọc sai kiểu dữ liệu, decode fail, state corruption.

Đây không chỉ là "technical debt" — nó có thể khiến chain **halt hoàn toàn** hoặc dẫn đến critical security vulnerabilities nếu logic dùng data sai.

---

## Cơ chế Runtime Upgrade

### Luồng chuẩn

```
Governance vote → Referendum pass
        ↓
system::set_code(new_wasm_binary)
        ↓
WASM binary được lưu vào storage[":code"]
        ↓
Block N+1: Executive detect spec_version thay đổi
        ↓
Executive gọi on_runtime_upgrade() của TẤT CẢ pallets
(theo thứ tự NGƯỢC với construct_runtime! — bottom-up)
        ↓
on_initialize() chạy bình thường
        ↓
Extrinsics được processed với logic mới
```

> [!warning] Migration chạy một lần duy nhất, tại đầu block đầu tiên sau upgrade
> `on_runtime_upgrade` chạy trước `on_initialize` và trước bất kỳ extrinsic nào. Nếu migration panic → chain halt. Nếu migration không đầy đủ → state corrupt từ đây về sau.

### RuntimeVersion và khi nào upgrade được trigger

```rust
pub const VERSION: RuntimeVersion = RuntimeVersion {
    spec_name: create_runtime_str!("zkverify"),
    impl_name: create_runtime_str!("zkverify"),
    authoring_version: 1,
    spec_version: 42,  // ← tăng lên khi có breaking change
    impl_version: 0,
    apis: RUNTIME_API_VERSIONS,
    transaction_version: 5, // ← tăng khi thay đổi Call encoding
    state_version: 1,
};
```

Runtime upgrade được trigger khi `spec_version` thay đổi. Nếu developer quên tăng `spec_version` khi thay đổi storage layout → node sẽ không chạy migration → **silent data corruption**.

---

## StorageVersion — Guard chống double-run

`StorageVersion` là cơ chế để track xem pallet đã được migrate đến phiên bản nào:

```rust
// Khai báo version hiện tại của pallet
const STORAGE_VERSION: StorageVersion = StorageVersion::new(3);

#[pallet::pallet]
#[pallet::storage_version(STORAGE_VERSION)]
pub struct Pallet<T>(_);
```

Trong migration, check version trước khi chạy:

```rust
#[pallet::hooks]
impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
    fn on_runtime_upgrade() -> Weight {
        let current = Pallet::<T>::current_storage_version();
        let onchain = Pallet::<T>::on_chain_storage_version();

        if onchain == 2 && current == 3 {
            // Chỉ chạy migration từ v2 lên v3
            log::info!("Running migration v2 → v3");
            let weight = v3::migrate::<T>();
            // Cập nhật version sau khi migrate xong
            StorageVersion::new(3).put::<Pallet<T>>();
            weight
        } else {
            log::warn!("Migration skipped: onchain={:?}, current={:?}", onchain, current);
            Weight::zero()
        }
    }
}
```

**Tại sao check version quan trọng**: Nếu không check, `on_runtime_upgrade` sẽ chạy lại mỗi lần có bất kỳ upgrade nào → migration chạy nhiều lần → data bị transform sai.

---

## Vulnerability Classes

### RU1: Thiếu migration khi thay đổi storage type

```rust
// Version cũ (v1):
#[pallet::storage]
pub type UserBalance<T: Config> = StorageMap<
    _, Blake2_128Concat, T::AccountId,
    u64,  // ← kiểu cũ
    ValueQuery,
>;

// Version mới (v2) — dev đổi sang u128 để support lớn hơn:
#[pallet::storage]
pub type UserBalance<T: Config> = StorageMap<
    _, Blake2_128Concat, T::AccountId,
    u128, // ← kiểu mới
    ValueQuery,
>;
// ❌ THIẾU migration!
```

Khi runtime upgrade xảy ra mà không có migration:
- Storage vẫn chứa `u64` values (8 bytes)
- Code mới decode như `u128` (16 bytes)
- Đọc 16 bytes nhưng chỉ có 8 bytes → SCALE decode fail hoặc đọc thêm 8 bytes rác từ storage tiếp theo

```rust
// FIX — migration trong on_runtime_upgrade:
pub mod v2 {
    use super::*;
    use frame_support::storage::migration;

    pub fn migrate<T: Config>() -> Weight {
        let mut count = 0u64;

        // Lấy tất cả keys dưới storage prefix cũ
        // Đọc như u64 (format cũ), ghi lại như u128 (format mới)
        UserBalance::<T>::translate_values::<u64, _>(|old_val| {
            count += 1;
            Some(old_val as u128) // convert u64 → u128
        });

        log::info!("Migrated {} UserBalance entries v1→v2", count);
        T::DbWeight::get().reads_writes(count, count)
    }
}
```

### RU2: Migration chạy nhiều lần (double-run)

```rust
// VULNERABLE — không check version, migration chạy mỗi lần upgrade
fn on_runtime_upgrade() -> Weight {
    // Chuyển đổi tất cả balances * 1_000_000 (thêm 6 decimals)
    UserBalance::<T>::translate_values::<u128, _>(|old_val| {
        Some(old_val * 1_000_000)
    });
    // ...
}
```

Nếu sau đó có upgrade khác (bất kỳ thứ gì, kể cả fix bug nhỏ), migration này sẽ chạy lại → tất cả balance bị nhân thêm 1_000_000 lần nữa → total supply bị inflate.

**Fix**: Luôn guard bằng `StorageVersion`:
```rust
fn on_runtime_upgrade() -> Weight {
    let onchain = Pallet::<T>::on_chain_storage_version();
    if onchain < StorageVersion::new(2) {
        let weight = v2::migrate::<T>();
        StorageVersion::new(2).put::<Pallet<T>>();
        weight
    } else {
        Weight::zero()
    }
}
```

### RU3: Ordering sai của migrations trong construct_runtime!

FRAME chạy `on_runtime_upgrade` theo thứ tự **ngược** với declaration trong `construct_runtime!`. Nếu pallet A depends on pallet B đã migrate, nhưng B được declared sau A → B migrate sau A → A chạy migration với data chưa được B migrate.

```rust
construct_runtime!(
    pub enum Runtime {
        System: frame_system,    // index 0
        PalletA: pallet_a,       // index 1 — migrate() gọi CUỐI
        PalletB: pallet_b,       // index 2 — migrate() gọi TRƯỚC A
        PalletC: pallet_c,       // index 3 — migrate() gọi ĐẦU TIÊN
    }
);
// Thứ tự on_runtime_upgrade: PalletC → PalletB → PalletA → System
```

Nếu `pallet_a::migrate()` đọc data từ `pallet_b` (giả sử đã migrate), nhưng thực ra `pallet_b::migrate()` chạy trước → pallet_b đã migrate đúng → không sao. Nhưng nếu dependency ngược lại → problem.

**Lưu ý**: Từ Polkadot SDK mới nhất, có `MigrateToNewPalletVersion` macro để handle ordering phức tạp hơn.

### RU4: Thiếu `pre_upgrade` và `post_upgrade` verification

Substrate cung cấp `pre_upgrade` và `post_upgrade` hooks để verify migration:

```rust
// pre_upgrade: chạy TRƯỚC migration (để capture state trước)
fn pre_upgrade() -> Result<Vec<u8>, TryRuntimeError> {
    let old_count = UserBalance::<T>::iter().count();
    log::info!("pre_upgrade: {} entries", old_count);
    Ok((old_count as u64).encode()) // encode state để check sau
}

// post_upgrade: chạy SAU migration để verify
fn post_upgrade(state: Vec<u8>) -> Result<(), TryRuntimeError> {
    let old_count: u64 = Decode::decode(&mut state.as_ref())
        .map_err(|_| TryRuntimeError::Other("Failed to decode pre-state"))?;

    let new_count = UserBalance::<T>::iter().count() as u64;
    ensure!(
        new_count == old_count,
        TryRuntimeError::Other("Entry count mismatch after migration")
    );
    log::info!("post_upgrade: {} entries verified", new_count);
    Ok(())
}
```

Thiếu `pre_upgrade`/`post_upgrade` → không biết migration có thực sự đúng không cho đến khi deploy lên mainnet.

---

## `try-runtime` — Test Migration Trước khi Deploy

`try-runtime` là CLI tool của Substrate cho phép test migration trên fork của chain thực:

```bash
# Build với feature try-runtime
cargo build --release --features try-runtime

# Test migration trên trạng thái live mainnet
./target/release/zkverify-node try-runtime \
    --runtime ./target/release/wbuild/zkverify-runtime.wasm \
    on-runtime-upgrade \
    live \
    --uri wss://rpc.zkverify.io
```

`try-runtime` sẽ:
1. Download state của mainnet tại block mới nhất
2. Apply WASM runtime mới (chứa migration code)
3. Chạy `on_runtime_upgrade()` → `pre_upgrade()` → migration → `post_upgrade()`
4. Report lỗi nếu có

> [!warning] `try-runtime` là bắt buộc trước bất kỳ upgrade nào có migration
> Đây là tiêu chuẩn ngành. SRLabs và Trail of Bits đều recommend chạy `try-runtime` trong audit checklist. Nếu project không có `try-runtime` tests → đây là finding Medium hoặc High trong audit report.

---

## Checklist Migration an toàn

Trước khi submit runtime upgrade:

```
[ ] spec_version được tăng lên
[ ] transaction_version được tăng nếu Call encoding thay đổi
[ ] Mọi thay đổi storage type đều có migration code trong on_runtime_upgrade
[ ] Migration được guard bằng StorageVersion check (không chạy hai lần)
[ ] pre_upgrade và post_upgrade hooks được implement
[ ] Migration đã được test với try-runtime trên fork của testnet/mainnet
[ ] Weight của migration đã được estimate (đừng trả về Weight::zero())
[ ] Migration được log đầy đủ để debug nếu có vấn đề
```

```bash
# Tìm on_runtime_upgrade không có StorageVersion guard
rg 'fn on_runtime_upgrade' pallets/ -A 20 --type rust | grep -v 'on_chain_storage_version\|StorageVersion'

# Tìm storage type declarations để match với migration code
rg '#\[pallet::storage\]' pallets/ -A 3 --type rust
```

---

## Summary — Key Takeaways

- **Forkless upgrade** thay đổi runtime logic nhưng storage format ở lại — migration bắt buộc nếu storage type thay đổi.
- **`spec_version`** phải tăng khi có breaking change — node dùng đây để detect khi nào chạy migration.
- **`StorageVersion`** guard migration chống double-run — thiếu guard = migration chạy nhiều lần = data corrupt.
- **Thứ tự migration**: NGƯỢC với construct_runtime! declaration — cẩn thận cross-pallet dependencies.
- **`pre_upgrade`/`post_upgrade`**: verify state trước và sau migration — thiếu = không biết migration đúng không.
- **`try-runtime`**: test migration trên fork mainnet trước khi deploy — bắt buộc trong quy trình upgrade an toàn.

---

## References

- Substrate Runtime Upgrades docs — docs.substrate.io/maintain/runtime-upgrades
- Writing Substrate Runtime Migrations — blog.nodrama.io/substrate-runtime-storage-migrations
- KILT Protocol Runtime Upgrade Experience — medium.com/kilt-protocol/runtime-upgrades-an-experience-report
- Substrate issue #9997 — Runtime API calls use new code with unmigrated storage
- try-runtime CLI — docs.substrate.io/reference/command-line-tools/try-runtime
