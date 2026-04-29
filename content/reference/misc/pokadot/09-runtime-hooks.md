---
title: "09. Runtime Hooks"
type: foundation
tags: [substrate, frame, hooks, on_initialize, offchain-worker, lesson-09]
aliases: [Runtime Hooks]
created: 2026-04-18
---

> **Prerequisites**: [[04-storage-types-nang-cao|Lesson 04]], [[06-balances-va-currency-trait|Lesson 06]]
> **Objectives**:
> - Dùng `on_initialize` để chạy logic tự động đầu mỗi block
> - Dùng `on_finalize` để chạy logic cuối mỗi block
> - Hiểu cơ bản về offchain workers và khi nào dùng
> - Thêm "auto-expiry" cho notes vào SimpleChain

---

## Hooks Là Gì?

Trong EVM, bạn không có cách nào tự động chạy code theo block — phải có ai đó call contract. Trong Substrate, pallets có thể đăng ký **hooks** — code tự động chạy ở những thời điểm cố định trong vòng đời của một block.

```
Lifecycle của một Block:
┌─────────────────────────────────────────────────────┐
│ 1. on_initialize() ← chạy đầu block, TRƯỚC extrinsics│
│                                                     │
│ 2. Xử lý tất cả extrinsics trong block              │
│                                                     │
│ 3. on_idle() ← chạy nếu còn weight budget           │
│                                                     │
│ 4. on_finalize() ← chạy CUỐI block, SAU extrinsics  │
│                                                     │
│ 5. offchain_worker() ← chạy OFF-chain, sau block    │
└─────────────────────────────────────────────────────┘
```

---

## 1. on_initialize

Chạy **đầu mỗi block**, trước khi extrinsics được xử lý. Trả về `Weight` đã dùng — ảnh hưởng đến block weight budget.

### Ví dụ: Auto-expire notes sau N blocks

Thêm expiry mechanism vào `pallet-notepad`:

```rust
use frame_support::pallet_prelude::*;
use frame_system::pallet_prelude::*;

// Storage mới: lưu block number khi note hết hạn
#[pallet::storage]
pub type NoteExpiry<T: Config> = StorageDoubleMap<
    _,
    Blake2_128Concat, T::AccountId,
    Twox64Concat, u32,
    BlockNumberFor<T>,
    OptionQuery,
>;

// Config: số block một note tồn tại
#[pallet::constant]
type NoteTTL: Get<BlockNumberFor<T>>;
```

Trong `create_note`, thêm:

```rust
let current_block = <frame_system::Pallet<T>>::block_number();
let expiry = current_block.saturating_add(T::NoteTTL::get());
NoteExpiry::<T>::insert(&who, note_id, expiry);
```

Thêm `Hooks` impl:

```rust
#[pallet::hooks]
impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
    fn on_initialize(now: BlockNumberFor<T>) -> Weight {
        let mut weight = Weight::zero();

        // Scan và xóa tất cả notes đã hết hạn
        // LƯU Ý: iteration in hooks tốn nhiều weight — cần giới hạn
        let mut expired_count = 0u32;
        let max_expire_per_block = 10u32; // giới hạn để không chiếm hết block weight

        // Iterate notes sắp hết hạn (simplification — production cần sorted queue)
        for (who, note_id, expiry_block) in NoteExpiry::<T>::iter() {
            if expired_count >= max_expire_per_block { break; }
            if expiry_block <= now {
                // Hoàn trả deposit nếu có
                if let Some(deposit) = NoteDeposits::<T>::get(&who, note_id) {
                    T::Currency::unreserve(&who, deposit);
                    NoteDeposits::<T>::remove(&who, note_id);
                }
                UserNotes::<T>::remove(&who, note_id);
                NoteExpiry::<T>::remove(&who, note_id);

                Self::deposit_event(Event::NoteExpired { who: who.clone(), note_id });
                expired_count += 1;
            }
        }

        // Báo cáo weight đã dùng
        weight.saturating_add(
            T::DbWeight::get()
                .reads_writes(expired_count as u64 * 3, expired_count as u64 * 3)
        )
    }
}
```

> [!warning] Iteration trong hooks rất tốn kém
> `StorageMap::iter()` scan toàn bộ storage — O(n). Trong production, dùng **priority queue** hay **sorted index** để chỉ process entries cần xử lý. Ví dụ chuẩn: `StorageMap` với key là block number, giá trị là danh sách items cần expire tại block đó.

---

## 2. Pattern Tốt Hơn: Expiry Queue

Thay vì iterate toàn bộ, dùng sorted queue:

```rust
// Map: block_number → list of (AccountId, note_id) cần expire
#[pallet::storage]
pub type ExpiryQueue<T: Config> = StorageMap<
    _,
    Twox64Concat,
    BlockNumberFor<T>,
    BoundedVec<(T::AccountId, u32), ConstU32<100>>,
    ValueQuery,
>;
```

Khi tạo note, thêm vào queue:

```rust
let expiry = current_block.saturating_add(T::NoteTTL::get());
ExpiryQueue::<T>::mutate(expiry, |queue| {
    let _ = queue.try_push((who.clone(), note_id));
});
```

Trong `on_initialize`, chỉ process queue của block hiện tại:

```rust
fn on_initialize(now: BlockNumberFor<T>) -> Weight {
    let mut weight = T::DbWeight::get().reads(1);

    let to_expire = ExpiryQueue::<T>::take(now); // lấy và xóa queue của block này
    weight.saturating_add(T::DbWeight::get().writes(1));

    for (who, note_id) in to_expire.iter() {
        // Xử lý expire...
        weight.saturating_add(T::DbWeight::get().reads_writes(2, 2));
    }

    weight
}
```

---

## 3. on_finalize

Chạy **cuối mỗi block**, sau tất cả extrinsics. Ít dùng hơn `on_initialize`. Thường dùng để: commit accumulated state, record snapshots.

```rust
fn on_finalize(now: BlockNumberFor<T>) {
    // Ví dụ: log thống kê block
    let total_notes: u32 = UserNotes::<T>::iter().count() as u32;
    log::info!(
        target: "runtime::notepad",
        "Block #{}: {} total notes on-chain",
        now,
        total_notes
    );
}
```

> [!info] on_finalize không trả về Weight
> Không giống `on_initialize`, `on_finalize` không khai báo weight. Do đó cần tránh heavy computation. Weight của `on_finalize` phải được khai báo trước trong `on_initialize` (để block builder biết budget).

---

## 4. Offchain Workers — Giới Thiệu

Offchain workers (OCW) là code chạy **ngoài consensus** — không ảnh hưởng chain state trực tiếp, nhưng có thể submit transactions.

```
Usecase của Offchain Workers:
- Fetch data từ external API (price feeds, oracles)
- Tính toán nặng không fit vào block weight
- Submit unsigned transactions với kết quả
```

Ví dụ cơ bản:

```rust
#[pallet::hooks]
impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
    fn offchain_worker(block_number: BlockNumberFor<T>) {
        // Chỉ chạy trên các block chẵn
        if block_number % 2u32.into() != 0u32.into() { return; }

        log::info!(
            target: "runtime::notepad",
            "Offchain worker chạy tại block {:?}",
            block_number
        );

        // Ví dụ: fetch HTTP (cần feature "offchain-worker")
        // let response = sp_runtime::offchain::http::Request::get("https://api.example.com/data")
        //     .send()
        //     .map_err(|_| "HTTP request failed");
    }
}
```

> [!info] OCW trong Lesson này
> Offchain workers là chủ đề phức tạp (cần HTTP, crypto signing, storage). Lesson này chỉ giới thiệu concept. Nếu bạn cần oracle hoặc price feed trong project thực, đây là hướng đi.

---

## 5. Thêm NoteTTL Vào Runtime Config

```rust
impl pallet_notepad::Config for Runtime {
    type RuntimeEvent = RuntimeEvent;
    type MaxNoteLength = ConstU32<512>;
    type MaxNotesPerAccount = ConstU32<10>;
    type ForceDeleteOrigin = frame_system::EnsureRoot<AccountId>;
    type Currency = Balances;
    type NoteDeposit = ConstU128<1_000_000_000_000>;
    type NoteTTL = ConstU32<100>;  // Notes expire sau 100 blocks (~10 phút với 6s/block)
}
```

---

## 6. Test Hooks

```rust
#[test]
fn notes_expire_after_ttl() {
    new_test_ext().execute_with(|| {
        System::set_block_number(1);

        // Tạo note tại block 1
        assert_ok!(Notepad::create_note(RuntimeOrigin::signed(1), b"temp note".to_vec()));
        assert!(UserNotes::<Test>::contains_key(1, 0));

        // Advance đến block 101 (TTL = 100)
        System::set_block_number(102);

        // Gọi on_initialize thủ công (trong test không chạy tự động)
        Notepad::on_initialize(102u64);

        // Note phải biến mất
        assert!(!UserNotes::<Test>::contains_key(1, 0));
    });
}
```

---

## Bài Tập Thực Hành

> [!example] Bài tập 9.1 — Block counter
> Thêm `StorageValue<_, u32, ValueQuery>` tên `TotalBlocksProcessed` vào pallet-counter. Trong `on_initialize`, tăng counter này lên 1 mỗi block. Test bằng cách advance block number trong mock.

> [!example] Bài tập 9.2 — Daily reset
> Thêm logic trong `on_initialize`: nếu `block_number % 100 == 0`, reset `Counter` storage về `0`. Emit event `CounterReset`. Viết test.

---

## Tóm Tắt

| Hook | Thời điểm | Khi nào dùng |
|------|-----------|-------------|
| `on_initialize(n)` | Đầu block, trước extrinsics | Auto-expire, scheduled tasks, snapshots |
| `on_finalize(n)` | Cuối block, sau extrinsics | Commit state, logging |
| `on_idle(n, remaining_weight)` | Cuối block nếu còn budget | Background cleanup |
| `offchain_worker(n)` | Ngoài consensus, sau block | HTTP fetches, heavy computation |

**Nguyên tắc**: Hooks phải khai báo weight chính xác. Heavy iteration trong hooks là anti-pattern — dùng indexed structures để O(1) lookup.

---

*[[08-chain-spec-va-genesis-config|← Lesson 08]] | [[10-multi-node-local-testnet|Lesson 10 →]]*
