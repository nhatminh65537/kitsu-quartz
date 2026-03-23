---
title: "A0. FRAME Macros Cheatsheet"
tags: [blockchain, substrate, frame, macros, reference, appendix]
aliases: [FRAME Macros Cheatsheet]
created: 2026-03-16
---

> **Appendix cho**: [[03-pallet-anatomy|03. Pallet Anatomy]], [[04-storage-in-frame|04. Storage trong FRAME]], [[05-dispatchables-extrinsics-weights|05. Dispatchables, Extrinsics & Weights]]

Tài liệu tham chiếu nhanh cho tất cả `#[pallet::*]` attributes và macros thường dùng trong FRAME. Copy-paste và điều chỉnh.

---

## Skeleton Pallet Đầy Đủ

```rust
#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
    use frame_support::pallet_prelude::*;
    use frame_system::pallet_prelude::*;

    #[pallet::pallet]
    pub struct Pallet<T>(_);

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>>
            + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        #[pallet::constant]
        type MaxSize: Get<u32>;
    }

    #[pallet::storage]
    pub type MyValue<T> = StorageValue<_, u32, ValueQuery>;

    #[pallet::storage]
    pub type MyMap<T: Config> = StorageMap<_, Blake2_128Concat, T::AccountId, u128, ValueQuery>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        SomethingHappened { who: T::AccountId, value: u32 },
    }

    #[pallet::error]
    pub enum Error<T> {
        NotFound,
        AlreadyExists,
        NotOwner,
    }

    #[pallet::hooks]
    impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {}

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::call_index(0)]
        #[pallet::weight(Weight::from_parts(10_000, 64))]
        pub fn do_something(origin: OriginFor<T>, value: u32) -> DispatchResult {
            let who = ensure_signed(origin)?;
            MyValue::<T>::put(value);
            Self::deposit_event(Event::SomethingHappened { who, value });
            Ok(())
        }
    }
}
```

---

## `#[pallet::config]` — Tất cả patterns

```rust
#[pallet::config]
pub trait Config: frame_system::Config {
    // Event type bắt buộc
    type RuntimeEvent: From<Event<Self>>
        + IsType<<Self as frame_system::Config>::RuntimeEvent>;

    // Constant expose ra metadata
    #[pallet::constant]
    type MaxLength: Get<u32>;

    // Associated type inject từ runtime (ví dụ: inject pallet_balances)
    type Currency: ReservableCurrency<Self::AccountId>;

    // Weight info từ benchmarking
    type WeightInfo: WeightInfo;

    // Constant không expose
    type SomeInterface: SomeTrait;
}
```

**Implement trong runtime:**

```rust
impl my_pallet::Config for Runtime {
    type RuntimeEvent = RuntimeEvent;
    type MaxLength = ConstU32<128>;
    type Currency = Balances;
    type WeightInfo = my_pallet::weights::SubstrateWeight<Runtime>;
}
```

---

## `#[pallet::storage]` — Tất cả types

### StorageValue

```rust
// Positional syntax
#[pallet::storage]
pub type Counter<T> = StorageValue<_, u32, ValueQuery>;

// Named syntax
#[pallet::storage]
pub type Admin<T: Config> = StorageValue<Value = T::AccountId, QueryKind = OptionQuery>;
```

### StorageMap

```rust
#[pallet::storage]
pub type Balances<T: Config> = StorageMap<
    _,
    Blake2_128Concat,   // hasher
    T::AccountId,       // key type
    u128,               // value type
    ValueQuery,         // query kind
>;

// Với BoundedVec
#[pallet::storage]
pub type Claims<T: Config> = StorageMap<
    _,
    Blake2_128Concat,
    BoundedVec<u8, T::MaxClaimSize>,
    (T::AccountId, BlockNumberFor<T>),
    OptionQuery,
>;
```

### StorageDoubleMap

```rust
#[pallet::storage]
pub type ItemsOf<T: Config> = StorageDoubleMap<
    _,
    Blake2_128Concat, T::AccountId,   // key1 + hasher1
    Blake2_128Concat, u32,            // key2 + hasher2
    ItemData,                          // value
    OptionQuery,
>;
```

### QueryKind

| QueryKind | Return type | Khi key không tồn tại |
|-----------|------------|----------------------|
| `OptionQuery` (default) | `Option<V>` | `None` |
| `ValueQuery` | `V` | `V::default()` |
| `ResultQuery` | `Result<V, Error<T>>` | `Err(Error::NotFound)` |

### Hashers

| Hasher | Tính chất | Dùng khi |
|--------|----------|---------|
| `Blake2_128Concat` | Cryptographic + concat key | User-controlled key (AccountId, bytes) |
| `Twox64Concat` | Fast + concat key | Runtime-internal index/enum |
| `Identity` | Không hash | Key đã là 32-byte hash |

### Storage API nhanh

```rust
// StorageValue
MyValue::<T>::get()                // → QueryKind::Output
MyValue::<T>::put(val)             // set
MyValue::<T>::mutate(|v| *v += 1) // read-modify-write
MyValue::<T>::take()               // get + kill
MyValue::<T>::kill()               // delete

// StorageMap
MyMap::<T>::get(&key)              // → QueryKind::Output
MyMap::<T>::insert(&key, val)      // set
MyMap::<T>::remove(&key)           // delete
MyMap::<T>::contains_key(&key)     // bool
MyMap::<T>::mutate(&key, |v| ...)  // read-modify-write
MyMap::<T>::try_mutate(&key, |v| -> DispatchResult { ... })?  // atomic
MyMap::<T>::take(&key)             // get + remove
for (k, v) in MyMap::<T>::iter()   // iterate (cẩn thận weight)

// StorageDoubleMap
MyDoubleMap::<T>::get(&k1, &k2)
MyDoubleMap::<T>::insert(&k1, &k2, val)
MyDoubleMap::<T>::remove_prefix(&k1, None)  // xóa tất cả entries của k1
```

---

## `#[pallet::event]` — Patterns

```rust
#[pallet::event]
#[pallet::generate_deposit(pub(super) fn deposit_event)]
pub enum Event<T: Config> {
    // Named fields (khuyến nghị từ SDK v1+)
    Transferred { from: T::AccountId, to: T::AccountId, amount: u128 },

    // Tuple style (cũ hơn, ít dùng)
    ValueSet(T::AccountId, u32),

    // Không có data
    Initialized,
}
```

Emit event:

```rust
Self::deposit_event(Event::Transferred { from: alice, to: bob, amount: 100 });
```

---

## `#[pallet::error]` — Patterns

```rust
#[pallet::error]
pub enum Error<T> {
    /// Doc comment hiện lên trong Polkadot.js
    NotFound,
    AlreadyExists,
    NotOwner,
    InsufficientBalance,
    Overflow,
    Underflow,
}
```

Trả lỗi:

```rust
// Cách 1: ensure! macro
ensure!(condition, Error::<T>::NotFound);

// Cách 2: ok_or
let val = MyMap::<T>::get(&key).ok_or(Error::<T>::NotFound)?;

// Cách 3: thủ công
return Err(Error::<T>::NotFound.into());
```

---

## `#[pallet::hooks]` — Lifecycle

```rust
#[pallet::hooks]
impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
    // Chạy đầu block, trước extrinsics — return weight consumed
    fn on_initialize(n: BlockNumberFor<T>) -> Weight {
        if n % 10u32.into() == Zero::zero() {
            // cleanup mỗi 10 block
        }
        Weight::zero()
    }

    // Chạy cuối block, sau extrinsics
    fn on_finalize(_n: BlockNumberFor<T>) {}

    // Chạy trong thời gian idle (sau on_finalize, nếu còn weight)
    fn on_idle(_n: BlockNumberFor<T>, _remaining_weight: Weight) -> Weight {
        Weight::zero()
    }

    // Chạy khi pallet được khởi tạo lần đầu (genesis)
    fn on_genesis() {}

    // Integrity check khi runtime load
    fn integrity_test() {}
}
```

---

## `#[pallet::call]` — Tất cả attributes

```rust
#[pallet::call]
impl<T: Config> Pallet<T> {
    // call_index: index trong Call enum metadata — KHÔNG thay đổi sau khi deploy
    // weight: worst-case estimate
    #[pallet::call_index(0)]
    #[pallet::weight(T::WeightInfo::my_fn())]
    pub fn my_fn(
        origin: OriginFor<T>,
        #[pallet::compact] amount: u128,  // nén số nguyên lớn trong encoding
    ) -> DispatchResult {
        Ok(())
    }

    // DispatchResultWithPostInfo: refund weight sau khi biết actual cost
    #[pallet::call_index(1)]
    #[pallet::weight(50_000)]
    pub fn conditional_fn(origin: OriginFor<T>, heavy: bool) -> DispatchResultWithPostInfo {
        let _ = ensure_signed(origin)?;
        if heavy {
            Ok(().into())
        } else {
            Ok(Some(Weight::from_parts(1_000, 0)).into())
        }
    }

    // Miễn phí
    #[pallet::call_index(2)]
    #[pallet::weight((0, Pays::No))]
    pub fn free_fn(origin: OriginFor<T>) -> DispatchResult {
        ensure_none(origin)?;
        Ok(())
    }
}
```

### DispatchClass

```rust
#[pallet::weight((10_000, DispatchClass::Normal, Pays::Yes))]
// DispatchClass::Normal   — user transactions (default)
// DispatchClass::Operational — system operations (higher priority)
// DispatchClass::Mandatory  — inherents (always included)
```

---

## Origin Checks

```rust
let who = ensure_signed(origin)?;           // → T::AccountId
ensure_root(origin)?;                        // → ()
let maybe = ensure_signed_or_root(origin)?;  // → Option<T::AccountId>
ensure_none(origin)?;                        // → ()
```

---

## Safe Arithmetic — Quick Reference

```rust
// Checked: propagate None thành lỗi
let new_val = val.checked_add(x).ok_or(ArithmeticError::Overflow)?;
let new_val = val.checked_sub(x).ok_or(ArithmeticError::Underflow)?;
let new_val = val.checked_mul(x).ok_or(ArithmeticError::Overflow)?;

// Saturating: clamp tại min/max
let new_val = val.saturating_add(x);  // → MAX nếu overflow
let new_val = val.saturating_sub(x);  // → 0 nếu underflow
let new_val = val.saturating_mul(x);
```

---

## `construct_runtime!` — Runtime Tích hợp

```rust
// Cú pháp hiện đại (Polkadot SDK stable2024+)
#[runtime::runtime]
#[runtime::derive(RuntimeCall, RuntimeEvent, RuntimeError, RuntimeOrigin, RuntimeTask)]
pub struct Runtime;

#[runtime::pallet_index(0)]
pub type System = frame_system;
#[runtime::pallet_index(1)]
pub type Timestamp = pallet_timestamp;
#[runtime::pallet_index(2)]
pub type Balances = pallet_balances;
#[runtime::pallet_index(10)]
pub type MyPallet = my_pallet;
```

---

## `#[pallet::genesis_config]` — Khởi tạo State từ Genesis

```rust
#[pallet::genesis_config]
#[derive(frame_support::DefaultNoBound)]
pub struct GenesisConfig<T: Config> {
    pub initial_value: u32,
    pub phantom: PhantomData<T>,
}

#[pallet::genesis_build]
impl<T: Config> BuildGenesisConfig for GenesisConfig<T> {
    fn build(&self) {
        MyValue::<T>::put(self.initial_value);
    }
}
```

Trong runtime `chain_spec.rs`:

```rust
my_pallet: my_pallet::GenesisConfig {
    initial_value: 42,
    ..Default::default()
},
```

---

## Derive Traits cho Storage Value Types

```rust
#[derive(
    Clone,
    Encode, Decode,           // SCALE codec — bắt buộc
    Eq, PartialEq,
    RuntimeDebug,
    MaxEncodedLen,            // bắt buộc từ SDK v1
    TypeInfo,                 // bắt buộc cho metadata
    Default,                  // bắt buộc nếu dùng ValueQuery
)]
pub struct MyStruct {
    pub field1: u32,
    pub field2: BoundedVec<u8, ConstU32<64>>,
}
```

---

## `Weight` — Khai báo nhanh

```rust
// Cố định (dev/demo)
#[pallet::weight(Weight::from_parts(10_000, 64))]

// Zero (test only, KHÔNG dùng production)
#[pallet::weight(0)]

// Có tính DB access
#[pallet::weight(
    Weight::from_parts(10_000, 64)
        + T::DbWeight::get().reads(1)
        + T::DbWeight::get().writes(1)
)]

// Từ WeightInfo (production)
#[pallet::weight(T::WeightInfo::my_function())]
```

---

## Test Macros — Quick Reference

```rust
// Trong tests.rs
use frame_support::{assert_ok, assert_noop, assert_err};

assert_ok!(MyPallet::my_fn(origin, param));
assert_noop!(MyPallet::my_fn(origin, param), Error::<Test>::MyError);
assert_err!(MyPallet::my_fn(origin, param), Error::<Test>::MyError);

// Check event
System::assert_last_event(Event::MyEvent { field: val }.into());
System::assert_has_event(Event::MyEvent { field: val }.into());

// Check storage
assert_eq!(MyStorage::<Test>::get(&key), Some(expected));
assert!(MyStorage::<Test>::contains_key(&key));

// Origin shortcuts
RuntimeOrigin::signed(1u64)
RuntimeOrigin::root()
RuntimeOrigin::none()
```

---

## Lint và Common Pitfalls

| Lỗi phổ biến | Cách fix |
|-------------|---------|
| `Vec<T>` trong storage | Thay bằng `BoundedVec<T, MaxLen>` |
| Dùng `+`, `-` trực tiếp | Dùng `checked_*` hoặc `saturating_*` |
| Thiếu `MaxEncodedLen` derive | Thêm `#[derive(MaxEncodedLen)]` |
| `call_index` trùng nhau | Mỗi dispatchable phải có index duy nhất |
| Thay đổi `call_index` sau deploy | Phá compatibility với extrinsic cũ |
| State mutate trước khi validate | Luôn validate trước, mutate sau |
| `on_initialize` nặng không có weight | Return đúng weight trong `on_initialize` |
