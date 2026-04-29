---
title: "A0. FRAME Macro Cheatsheet"
type: reference
tags: [substrate, frame, macros, cheatsheet, appendix]
aliases: [FRAME Cheatsheet]
created: 2026-04-18
---

> **Mục đích**: Tài liệu tham khảo nhanh — tất cả macros và patterns thường gặp khi viết pallet FRAME.

---

## Skeleton Đầy Đủ Của Một Pallet

```rust
#![cfg_attr(not(feature = "std"), no_std)]
pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
    use frame_support::pallet_prelude::*;
    use frame_system::pallet_prelude::*;

    // ── 1. Config ──────────────────────────────────────────────────────────
    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>>
            + IsType<<Self as frame_system::Config>::RuntimeEvent>;

        #[pallet::constant]
        type MaxItems: Get<u32>;

        type WeightInfo: WeightInfo;
    }

    // ── 2. Pallet struct ───────────────────────────────────────────────────
    #[pallet::pallet]
    pub struct Pallet<T>(_);

    // ── 3. Storage ─────────────────────────────────────────────────────────
    #[pallet::storage]
    pub type MyValue<T> = StorageValue<_, u32, ValueQuery>;

    #[pallet::storage]
    pub type MyMap<T: Config> = StorageMap<
        _, Blake2_128Concat, T::AccountId, u32, ValueQuery
    >;

    #[pallet::storage]
    pub type MyDoubleMap<T: Config> = StorageDoubleMap<
        _,
        Blake2_128Concat, T::AccountId,
        Twox64Concat,     u32,
        BoundedVec<u8, T::MaxItems>,
        OptionQuery,
    >;

    // ── 4. Genesis Config (optional) ───────────────────────────────────────
    #[pallet::genesis_config]
    #[derive(frame_support::DefaultNoBound)]
    pub struct GenesisConfig<T: Config> {
        pub initial_value: u32,
        #[serde(skip)]
        pub _phantom: PhantomData<T>,
    }

    #[pallet::genesis_build]
    impl<T: Config> BuildGenesisConfig for GenesisConfig<T> {
        fn build(&self) {
            MyValue::<T>::put(self.initial_value);
        }
    }

    // ── 5. Events ──────────────────────────────────────────────────────────
    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        SomethingHappened { value: u32, who: T::AccountId },
    }

    // ── 6. Errors ──────────────────────────────────────────────────────────
    #[pallet::error]
    pub enum Error<T> {
        Overflow,
        NotFound,
        TooMany,
        NotOwner,
    }

    // ── 7. Hooks ───────────────────────────────────────────────────────────
    #[pallet::hooks]
    impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
        fn on_initialize(_n: BlockNumberFor<T>) -> Weight {
            Weight::zero()
        }
        fn on_finalize(_n: BlockNumberFor<T>) {}
        fn offchain_worker(_n: BlockNumberFor<T>) {}
    }

    // ── 8. Calls ───────────────────────────────────────────────────────────
    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::call_index(0)]
        #[pallet::weight(T::WeightInfo::do_something())]
        pub fn do_something(origin: OriginFor<T>, value: u32) -> DispatchResult {
            let who = ensure_signed(origin)?;
            MyValue::<T>::put(value);
            Self::deposit_event(Event::SomethingHappened { value, who });
            Ok(())
        }
    }
}
```

---

## Storage Types — Tham Khảo Nhanh

### StorageValue

```rust
// Khai báo
#[pallet::storage]
pub type Foo<T> = StorageValue<_, u32, ValueQuery>;   // ValueQuery: default = 0
pub type Bar<T> = StorageValue<_, u32, OptionQuery>;  // OptionQuery: default = None

// API
Foo::<T>::get()                   // u32
Foo::<T>::set(42u32)              // set (không cần mutate)
Foo::<T>::put(42u32)              // alias cho set
Foo::<T>::kill()                  // xóa (reset về default)
Foo::<T>::exists()                // bool
Foo::<T>::try_mutate(|v| {        // atomic read-modify-write
    *v = v.checked_add(1).ok_or("overflow")?;
    Ok::<(), &str>(())
})?;
```

### StorageMap

```rust
// Khai báo
#[pallet::storage]
pub type Balances<T: Config> = StorageMap<
    _,
    Blake2_128Concat,  // hasher (xem bảng hashers bên dưới)
    T::AccountId,      // key
    u128,              // value
    ValueQuery,
>;

// API
Balances::<T>::get(&key)
Balances::<T>::insert(&key, value)
Balances::<T>::remove(&key)
Balances::<T>::contains_key(&key)           // bool
Balances::<T>::try_mutate(&key, |v| { ... })?
Balances::<T>::mutate(&key, |v| { ... })
Balances::<T>::take(&key)                   // get + remove
// Iteration
Balances::<T>::iter()                       // (key, value)
Balances::<T>::iter_keys()
Balances::<T>::iter_values()
Balances::<T>::drain()                      // iter + remove all
```

### StorageDoubleMap

```rust
// API thêm so với StorageMap:
MyMap::<T>::get(&k1, &k2)
MyMap::<T>::insert(&k1, &k2, value)
MyMap::<T>::remove(&k1, &k2)
MyMap::<T>::remove_prefix(&k1, None)        // xóa tất cả với k1
MyMap::<T>::iter_prefix(&k1)               // iter theo k1
MyMap::<T>::contains_key(&k1, &k2)
```

### Hashers

| Hasher | An toàn với user input | Hỗ trợ prefix iter | Tốc độ |
|--------|----------------------|-------------------|--------|
| `Blake2_128Concat` | ✅ | ✅ | Trung bình |
| `Twox64Concat` | ❌ (chỉ dùng trusted input) | ✅ | Nhanh |
| `Identity` | ❌ (key phải là hash rồi) | ✅ | Nhanh nhất |

---

## Config Trait Patterns

```rust
#[pallet::config]
pub trait Config: frame_system::Config {
    // 1. Event type — luôn cần
    type RuntimeEvent: From<Event<Self>>
        + IsType<<Self as frame_system::Config>::RuntimeEvent>;

    // 2. Constant — hiển thị trên chain metadata
    #[pallet::constant]
    type MaxItems: Get<u32>;

    // 3. Constant với giá trị mặc định trong test
    // (dùng cùng với #[derive_impl] trong mock)
    #[pallet::constant]
    type Deposit: Get<u128>;

    // 4. Associated type với trait bound
    type Currency: Currency<Self::AccountId>
        + ReservableCurrency<Self::AccountId>;

    // 5. Origin customizable
    type AdminOrigin: EnsureOrigin<Self::RuntimeOrigin>;

    // 6. Weight info
    type WeightInfo: WeightInfo;
}
```

---

## Origin Checks

```rust
// User-signed transaction — trả về AccountId
let who = ensure_signed(origin)?;

// Root (governance / sudo)
ensure_root(origin)?;

// Unsigned transaction
ensure_none(origin)?;

// Custom origin
T::AdminOrigin::ensure_origin(origin)?;

// EitherOfDiverse — root OR signed
use frame_support::traits::EitherOfDiverse;
type MyOrigin = EitherOfDiverse<
    frame_system::EnsureRoot<AccountId>,
    frame_system::EnsureSigned<AccountId>,
>;
```

---

## ensure! Và Error Handling

```rust
// ensure! — giống require() trong Solidity
ensure!(condition, Error::<T>::MyError);
ensure!(balance >= amount, Error::<T>::InsufficientBalance);
ensure!(who == owner, Error::<T>::NotOwner);

// ? operator — propagate error
let item = Items::<T>::get(id).ok_or(Error::<T>::NotFound)?;

// checked arithmetic — không panic khi overflow
let new_val = old_val.checked_add(1).ok_or(Error::<T>::Overflow)?;
let new_val = old_val.saturating_add(1);  // saturate thay vì overflow
let new_val = old_val.saturating_sub(1);  // saturate thay vì underflow
```

---

## Events — Patterns

```rust
#[pallet::event]
#[pallet::generate_deposit(pub(super) fn deposit_event)]
pub enum Event<T: Config> {
    // Named fields (khuyến nghị)
    Created { who: T::AccountId, id: u32 },
    Transferred { from: T::AccountId, to: T::AccountId, amount: u128 },
    // Tuple style (cũ, vẫn hợp lệ)
    ValueSet(u32),
}

// Emit event
Self::deposit_event(Event::Created { who: caller, id: new_id });
```

---

## Currency Trait — Tham Khảo

```rust
use frame_support::traits::{Currency, ReservableCurrency, ExistenceRequirement};

// Type alias chuẩn
pub type BalanceOf<T> =
    <<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;

// Các phép toán
T::Currency::free_balance(&who)
T::Currency::total_balance(&who)
T::Currency::total_issuance()
T::Currency::transfer(&from, &to, amount, ExistenceRequirement::KeepAlive)?
T::Currency::reserve(&who, amount)?
T::Currency::unreserve(&who, amount)
T::Currency::slash_reserved(&who, amount)          // → (NegativeImbalance, Balance)
T::Currency::deposit_into_existing(&who, amount)?  // mint cho existing account
T::Currency::withdraw(&who, amount, ...)?          // burn
```

---

## BoundedVec — Patterns

```rust
// Khai báo trong storage
BoundedVec<u8, T::MaxLength>
BoundedVec<T::AccountId, ConstU32<100>>

// Convert từ Vec
let bounded: BoundedVec<u8, T::MaxLength> =
    vec.try_into().map_err(|_| Error::<T>::TooLong)?;

// Convert sang Vec
let plain: Vec<u8> = bounded.into_inner();

// Push vào BoundedVec
bounded.try_push(item).map_err(|_| Error::<T>::TooMany)?;

// Length
bounded.len()
bounded.is_empty()
```

---

## Hooks — Signature

```rust
#[pallet::hooks]
impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
    // TRẢ VỀ Weight — khai báo trước để block builder biết budget
    fn on_initialize(n: BlockNumberFor<T>) -> Weight {
        let weight = T::DbWeight::get().reads(1);
        // ... logic ...
        weight
    }

    // KHÔNG trả về Weight
    fn on_finalize(n: BlockNumberFor<T>) {
        // ...
    }

    // Chạy nếu còn weight budget
    fn on_idle(n: BlockNumberFor<T>, remaining_weight: Weight) -> Weight {
        Weight::zero()  // trả về weight đã dùng
    }

    // Chạy ngoài consensus — không ảnh hưởng state trực tiếp
    fn offchain_worker(n: BlockNumberFor<T>) {
        // ...
    }
}
```

---

## Mock Runtime — Template Cho Tests

```rust
// src/mock.rs
use crate as pallet_my;
use frame_support::derive_impl;
use sp_runtime::BuildStorage;

frame_support::construct_runtime!(
    pub enum Test {
        System: frame_system,
        Balances: pallet_balances,   // thêm nếu pallet dùng Currency
        MyPallet: pallet_my,
    }
);

#[derive_impl(frame_system::config_preludes::TestDefaultConfig)]
impl frame_system::Config for Test {
    type Block = frame_system::mocking::MockBlock<Test>;
    // Thêm nếu dùng pallet_balances:
    type AccountData = pallet_balances::AccountData<u128>;
}

#[derive_impl(pallet_balances::config_preludes::TestDefaultConfig)]
impl pallet_balances::Config for Test {
    type AccountStore = System;
}

impl pallet_my::Config for Test {
    type RuntimeEvent = RuntimeEvent;
    type WeightInfo = ();
    // ... các type khác ...
}

pub fn new_test_ext() -> sp_io::TestExternalities {
    let mut t = frame_system::GenesisConfig::<Test>::default()
        .build_storage().unwrap();
    // Thêm initial balances nếu cần:
    pallet_balances::GenesisConfig::<Test> {
        balances: vec![(1, 10_000), (2, 5_000)],
    }.assimilate_storage(&mut t).unwrap();
    t.into()
}
```

---

## Test Macros — Tham Khảo

```rust
use frame_support::{assert_ok, assert_noop, assert_err};

// OK
assert_ok!(MyPallet::my_call(RuntimeOrigin::signed(1), arg));

// Fail với error + storage KHÔNG thay đổi
assert_noop!(
    MyPallet::my_call(RuntimeOrigin::signed(1), bad_arg),
    Error::<Test>::MyError
);

// Fail với error (không check storage rollback)
assert_err!(
    MyPallet::my_call(RuntimeOrigin::signed(1), bad_arg),
    Error::<Test>::MyError
);

// BadOrigin
assert_noop!(
    MyPallet::root_only(RuntimeOrigin::signed(1)),
    frame_support::error::BadOrigin
);

// Check event
System::set_block_number(1);  // cần set block number trước khi emit events
assert_ok!(MyPallet::my_call(RuntimeOrigin::signed(1), 42));
System::assert_last_event(Event::SomethingHappened { value: 42, who: 1 }.into());
System::assert_has_event(Event::SomethingHappened { value: 42, who: 1 }.into());
```

---

## Cargo.toml Pallet — Template

```toml
[package]
name = "pallet-my-pallet"
version = "0.1.0"
edition = "2021"
publish = false

[dependencies]
codec = { features = ["derive"], workspace = true }
scale-info = { features = ["derive"], workspace = true }
frame-benchmarking = { optional = true, workspace = true }
frame-support = { workspace = true }
frame-system = { workspace = true }
# Thêm nếu dùng Currency:
# pallet-balances = { workspace = true }

[dev-dependencies]
sp-core = { workspace = true }
sp-io = { workspace = true }
sp-runtime = { workspace = true }

[features]
default = ["std"]
std = [
    "codec/std",
    "frame-benchmarking?/std",
    "frame-support/std",
    "frame-system/std",
    "scale-info/std",
]
runtime-benchmarks = ["frame-benchmarking/runtime-benchmarks"]
try-runtime = ["frame-support/try-runtime"]
```

---

*[[10-multi-node-local-testnet|← Lesson 10]] | [[a1-polkadotjs-guide|A1. Polkadot.js Guide →]]*
