---
title: "01. FRAME Architecture"
tags: [security, substrate, frame, pallet, lesson-01, architecture]
aliases: [FRAME Architecture]
created: 2026-03-16
---

> **Prerequisites**: Biết Rust cơ bản (struct, trait, enum, generics). Không cần biết Substrate trước.
> **Objectives**:
> - Hiểu Substrate là gì và tại sao có FRAME
> - Nắm được cấu trúc 7 thành phần của một pallet
> - Biết cách runtime compose các pallets qua `construct_runtime!`
> - Nhận ra vai trò bảo mật của từng thành phần (nền tảng cho các lesson sau)

---

## Motivation

Khi bạn mở một file pallet của zkVerify để tìm bug, điều đầu tiên đập vào mắt là hàng loạt annotation lạ như `#[pallet::call]`, `#[pallet::storage]`, `#[pallet::weight(...)]`. Không hiểu những thứ này, bạn sẽ không biết mình đang đọc gì, huống chi là tìm lỗ hổng.

Lesson này xây dựng mental model cốt lõi: **pallet là gì, gồm những phần nào, và tại sao mỗi phần đó lại là attack surface tiềm năng**.

---

## Khái niệm nền tảng

### Substrate là gì?

Substrate (Polkadot SDK) là một framework để xây dựng blockchain. Thay vì viết blockchain từ đầu (networking, consensus, storage, cryptography...), developer chỉ cần định nghĩa **logic nghiệp vụ** của chain mình — phần này gọi là **runtime** (thực thi trên WebAssembly).

> [!info] Định nghĩa — Runtime
> **Runtime** là tập hợp toàn bộ logic nghiệp vụ của một Substrate blockchain: ai được làm gì, trạng thái nào được phép thay đổi, và theo điều kiện nào. Runtime biên dịch thành WebAssembly (WASM) và chạy trong môi trường sandbox của node.
>
> **Hệ quả bảo mật**: Runtime chạy trên **tất cả các node** trong mạng. Một bug trong runtime = toàn bộ chain bị ảnh hưởng.

### FRAME là gì?

FRAME (Framework for Runtime Aggregation of Modularized Entities) là thư viện Rust giúp xây dựng runtime theo kiểu **modular**: chia nhỏ logic thành các **pallet** độc lập, sau đó ghép lại thành runtime hoàn chỉnh.

```
Substrate Node
├── Networking (libp2p)
├── Consensus (BABE/GRANDPA)
├── Database (RocksDB)
└── Runtime (WASM)
    ├── frame_system      ← pallet hệ thống, luôn có
    ├── pallet_balances   ← quản lý số dư token
    ├── pallet_sudo       ← quyền root
    ├── pallet_verifier   ← (zkVerify specific)
    └── pallet_aggregate  ← (zkVerify specific)
```

> [!info] Định nghĩa — Pallet
> **Pallet** là một module runtime độc lập, đóng gói một tập hợp chức năng cụ thể. Pallet tương tự smart contract trong EVM — nhưng native Rust, không có gas trong cùng nghĩa đó, và chạy với quyền hạn cao hơn nhiều.
>
> **Điểm khác biệt quan trọng với smart contract**: Pallet có thể truy cập storage của pallet khác, không có "sandbox isolation" giữa các pallet trong cùng runtime.

---

## Anatomy của một Pallet — 7 thành phần

Một pallet FRAME v2 được khai báo trong một `mod pallet` với attribute `#[frame_support::pallet]`. Bên trong gồm tối đa 7 thành phần:

```rust
#[frame_support::pallet]
pub mod pallet {
    use frame_support::pallet_prelude::*;
    use frame_system::pallet_prelude::*;

    // 1. Config trait
    #[pallet::config]
    pub trait Config: frame_system::Config { ... }

    // 2. Pallet struct (placeholder)
    #[pallet::pallet]
    pub struct Pallet<T>(_);

    // 3. Storage items
    #[pallet::storage]
    pub type MyValue<T> = StorageValue<_, u32, ValueQuery>;

    // 4. Events
    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> { ... }

    // 5. Errors
    #[pallet::error]
    pub enum Error<T> { ... }

    // 6. Extrinsic functions (callable từ ngoài)
    #[pallet::call]
    impl<T: Config> Pallet<T> { ... }

    // 7. Lifecycle hooks
    #[pallet::hooks]
    impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> { ... }
}
```

### Thành phần 1 — `#[pallet::config]`: Config Trait

Config là nơi pallet khai báo các "phụ thuộc" mà runtime phải cung cấp. Nó là một Rust trait kế thừa từ `frame_system::Config`.

```rust
#[pallet::config]
pub trait Config: frame_system::Config {
    // Pallet cần runtime có khái niệm "Event"
    type RuntimeEvent: From<Event<Self>>
        + IsType<<Self as frame_system::Config>::RuntimeEvent>;

    // Pallet cần biết giá trị tối đa nào đó (cấu hình từ runtime)
    #[pallet::constant]
    type MaxProofSize: Get<u32>;

    // Pallet cần một loại "tiền tệ" để thu phí
    type Currency: Currency<Self::AccountId>;
}
```

> [!warning] Security Relevance
> **Config là attack surface về logic design.** Các associated type trong Config thường có constraint lỏng lẻo. Ví dụ: nếu `MaxProofSize` không được validate đúng trong extrinsic, attacker có thể set giá trị bằng 0 hoặc overflow.
>
> Câu hỏi khi audit: *"Mỗi associated type có được validate đúng trước khi dùng không?"*

### Thành phần 2 — `#[pallet::pallet]`: Pallet Struct

Đây chỉ là struct placeholder — bản thân nó không chứa data. `PhantomData<T>` được dùng để "giữ" generic parameter T.

```rust
#[pallet::pallet]
pub struct Pallet<T>(_);
```

Macro `#[pallet::pallet]` tự động implement nhiều trait cần thiết cho Pallet struct. Thường không có security issue trực tiếp ở đây, nhưng `StorageVersion` được gắn tại đây (liên quan đến Lesson 12 — Runtime Upgrade Safety).

### Thành phần 3 — `#[pallet::storage]`: Storage Items

Storage là nơi pallet lưu trữ trạng thái on-chain (persistent giữa các block). FRAME cung cấp 4 loại storage chính:

```rust
// Lưu một giá trị đơn
#[pallet::storage]
pub type TotalProofs<T> = StorageValue<_, u64, ValueQuery>;

// Map từ key → value
#[pallet::storage]
pub type ProofOwner<T: Config> = StorageMap<
    _,
    Blake2_128Concat,  // hasher
    T::Hash,           // key type
    T::AccountId,      // value type
    OptionQuery,       // default: None nếu không tồn tại
>;

// Map từ (key1, key2) → value
#[pallet::storage]
pub type UserProofs<T: Config> = StorageDoubleMap<
    _,
    Blake2_128Concat, T::AccountId,
    Blake2_128Concat, T::Hash,
    u64,
    ValueQuery,
>;

// Map có thể iterate (cẩn thận!)
#[pallet::storage]
pub type AllProofs<T: Config> = CountedStorageMap<
    _, Blake2_128Concat, T::Hash, ProofData
>;
```

> [!warning] Security Relevance — Storage là attack surface lớn nhất
> **Unbounded storage**: `StorageMap` không có giới hạn số entry mặc định. Attacker có thể spam hàng nghìn entry → node OOM hoặc iteration quá chậm.
>
> **Hasher selection**: `Twox64Concat` nhanh hơn nhưng **không collision-resistant** với user-controlled keys. Với key do người dùng kiểm soát, luôn phải dùng `Blake2_128Concat`.
>
> **`ValueQuery` vs `OptionQuery`**: `ValueQuery` trả về default value (0, false...) khi key không tồn tại, có thể gây nhầm lẫn logic. `OptionQuery` trả về `None` — rõ ràng hơn.
>
> Câu hỏi khi audit: *"Storage này có bị bounded không? Key có phải do user kiểm soát không? Hasher có phù hợp không?"*

### Thành phần 4 — `#[pallet::event]`: Events

Events là thông báo mà pallet phát ra khi có hành động quan trọng xảy ra. Events được lưu trong block và client có thể subscribe.

```rust
#[pallet::event]
#[pallet::generate_deposit(pub(super) fn deposit_event)]
pub enum Event<T: Config> {
    /// Proof đã được submit thành công.
    ProofSubmitted {
        who: T::AccountId,
        proof_hash: T::Hash,
    },
    /// Proof đã bị revoke.
    ProofRevoked { who: T::AccountId },
}
```

Events được emit bằng cách gọi `Self::deposit_event(Event::ProofSubmitted { ... })` trong extrinsic.

> [!warning] Security Relevance
> **Thiếu event** sau hành động quan trọng khiến audit trail không đầy đủ — đây là **code quality issue** nhưng cũng là dấu hiệu logic có thể bị bỏ qua trong testing.
>
> **Event không khớp với state change**: Emit event "ProofSubmitted" nhưng storage thực tế không thay đổi (hoặc ngược lại) → bug logic có thể bị ẩn.

### Thành phần 5 — `#[pallet::error]`: Error Types

Error enum định nghĩa các lỗi mà pallet có thể trả về, thường được dùng với macro `ensure!`.

```rust
#[pallet::error]
pub enum Error<T> {
    /// Proof đã tồn tại trong storage.
    ProofAlreadyExists,
    /// Proof không tồn tại.
    ProofNotFound,
    /// Người gọi không phải chủ sở hữu proof.
    NotProofOwner,
    /// Kích thước proof vượt quá giới hạn.
    ProofTooLarge,
}
```

`ensure!` là macro cốt lõi để validate điều kiện:

```rust
ensure!(
    !ProofOwner::<T>::contains_key(&proof_hash),
    Error::<T>::ProofAlreadyExists
);
```

`ensure!(condition, error)` tương đương với:

```rust
if !condition {
    return Err(Error::<T>::ProofAlreadyExists.into());
}
```

> [!warning] Security Relevance
> **Thiếu `ensure!`**: Không validate input trước khi mutate storage → **Verify First vulnerability** (Lesson 07).
>
> **`ensure!` đặt sai thứ tự**: Validate sau khi đã thay đổi storage một phần → partial state corruption.
>
> Câu hỏi khi audit: *"Mọi điều kiện quan trọng có được check bằng `ensure!` TRƯỚC khi storage thay đổi không?"*

### Thành phần 6 — `#[pallet::call]`: Extrinsic Functions

Đây là phần quan trọng nhất từ góc độ security. Các function trong block này là những gì user (hoặc attacker) có thể gọi trực tiếp từ ngoài.

```rust
#[pallet::call]
impl<T: Config> Pallet<T> {
    #[pallet::weight(T::WeightInfo::submit_proof())]
    pub fn submit_proof(
        origin: OriginFor<T>,
        proof_hash: T::Hash,
    ) -> DispatchResult {
        // 1. Verify origin
        let who = ensure_signed(origin)?;

        // 2. Validate inputs (TRƯỚC khi đụng storage)
        ensure!(
            !ProofOwner::<T>::contains_key(&proof_hash),
            Error::<T>::ProofAlreadyExists
        );

        // 3. Mutate storage
        ProofOwner::<T>::insert(&proof_hash, &who);

        // 4. Emit event
        Self::deposit_event(Event::ProofSubmitted {
            who,
            proof_hash,
        });

        Ok(())
    }
}
```

Mỗi extrinsic **bắt buộc** có:
- `origin: OriginFor<T>` — parameter đầu tiên luôn là origin (ai gọi)
- `#[pallet::weight(...)]` — annotation khai báo computational cost
- Return type `DispatchResult` — tức là `Result<(), DispatchError>`

> [!warning] Security Relevance — Đây là nơi tập trung hầu hết bug
> - **Bad Origin** (L03): Không check `ensure_signed` / `ensure_root` → ai cũng gọi được
> - **Missing weight** (L05): Weight = 0 → attacker spam free
> - **Panic trong extrinsic** (L06): `unwrap()` → node crash
> - **Verify-after-write** (L07): Storage thay đổi trước khi validate → state corruption
>
> Câu hỏi khi audit: *"Origin được check chưa? Weight có phản ánh thực tế không? Có `unwrap()` nào không? Thứ tự check vs mutate có đúng không?"*

### Thành phần 7 — `#[pallet::hooks]`: Lifecycle Hooks

Hooks cho phép pallet thực thi logic tự động tại các điểm nhất định trong vòng đời của block.

```rust
#[pallet::hooks]
impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
    // Chạy ĐẦU mỗi block (trước extrinsics)
    fn on_initialize(n: BlockNumberFor<T>) -> Weight {
        // cleanup, timer logic...
        Weight::zero()
    }

    // Chạy CUỐI mỗi block (sau extrinsics)
    fn on_finalize(n: BlockNumberFor<T>) {
        // finalization logic...
    }

    // Chạy khi runtime upgrade
    fn on_runtime_upgrade() -> Weight {
        // migration logic...
        Weight::zero()
    }
}
```

> [!warning] Security Relevance
> **`on_initialize` không trả về đúng Weight**: Nếu trả về `Weight::zero()` nhưng thực tế làm nhiều việc → block có thể tràn block limit → chain halt (liên quan Lesson 05, 06).
>
> **Logic trong `on_initialize` panic**: Khác extrinsic, hook không thể revert → chain halt không thể recover.
>
> **`on_runtime_upgrade` thiếu migration**: Đây là nguyên nhân phổ biến nhất của storage corruption sau upgrade (Lesson 12).

---

## Runtime Composition — `construct_runtime!`

Sau khi có các pallet riêng lẻ, runtime ghép chúng lại bằng macro `construct_runtime!`:

```rust
construct_runtime!(
    pub enum Runtime {
        // index = 0, luôn phải có
        System: frame_system,

        // index = 1
        Balances: pallet_balances,

        // index = 2 — zkVerify specific
        Aggregate: pallet_aggregate::{Pallet, Call, Storage, Event<T>},

        // index = 3 — zkVerify specific
        SettlementFFlonkPallet: pallet_settlement_fflonk,
    }
);
```

> [!info] Index trong construct_runtime
> Mỗi pallet được gán một **index số** trong runtime. Index này ảnh hưởng đến encoding của `Call` enum và `Event` enum. Nếu thứ tự pallet thay đổi sau runtime upgrade mà không có migration → **toàn bộ extrinsic encoding bị sai** (Lesson 12).

---

## Toàn cảnh: Từ User đến Storage

Khi một user submit transaction đến zkVerify, luồng xử lý là:

```
User gửi signed transaction
        │
        ▼
Transaction Pool (validate_unsigned / fee check)
        │
        ▼
Block Author chọn transaction, đưa vào block
        │
        ▼
Runtime Executive
        │
        ├── on_initialize() của tất cả pallets
        │
        ├── Dispatch extrinsic:
        │       1. Verify signature / origin
        │       2. Deduct fee (Weight → Fee)
        │       3. Gọi pallet::call function
        │       4. Rollback nếu DispatchError
        │
        └── on_finalize() của tất cả pallets
        │
        ▼
Block được finalize, state root được commit
```

> [!warning] Điểm quan trọng
> **Nếu một extrinsic trả về `Err`**, state được **rollback** — nhưng fee vẫn bị trừ (chống spam).
>
> **Nhưng** nếu code trong extrinsic **panic** (không phải return Err), state KHÔNG được rollback và node có thể crash. Đây là lý do "Don't Panic" là vulnerability class riêng (Lesson 06).

---

## Ví dụ thực tế — Đọc một pallet zkVerify

Đây là skeleton của `pallet_aggregate` từ zkVerify (simplified):

```rust
#[frame_support::pallet]
pub mod pallet {
    use frame_support::pallet_prelude::*;
    use frame_system::pallet_prelude::*;

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>>
            + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        type MaxPendingPublishingVerifiers: Get<u32>;
    }

    #[pallet::pallet]
    pub struct Pallet<T>(_);

    #[pallet::storage]
    pub type Domains<T: Config> = StorageMap<
        _, Blake2_128Concat, DomainId, DomainState<T>
    >;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        DomainRegistered { id: DomainId, owner: T::AccountId },
        AggregationCompleted { domain_id: DomainId, aggregation_id: u64 },
    }

    #[pallet::error]
    pub enum Error<T> {
        DomainAlreadyExists,
        DomainNotFound,
        NotDomainOwner,
        TooManyVerifiers,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::weight(T::WeightInfo::register_domain())]
        pub fn register_domain(
            origin: OriginFor<T>,
            domain_id: DomainId,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;             // check origin
            ensure!(
                !Domains::<T>::contains_key(domain_id),  // check trước
                Error::<T>::DomainAlreadyExists
            );
            Domains::<T>::insert(domain_id, DomainState::new(who.clone()));
            Self::deposit_event(Event::DomainRegistered { id: domain_id, owner: who });
            Ok(())
        }
    }
}
```

Nhìn vào đoạn này, bạn đã có thể đặt câu hỏi audit:
- `ensure_signed` — ok, cần signed caller ✓
- `ensure!` trước `insert` — ok, check trước mutate ✓
- `#[pallet::weight]` — có annotation, nhưng weight chính xác chưa? → Lesson 05
- `MaxPendingPublishingVerifiers` — có được enforce ở đâu không? → cần tìm trong code

---

## Summary — Key Takeaways

Sau lesson này, khi mở bất kỳ pallet nào bạn có thể định hướng ngay:

| Thành phần | Câu hỏi audit đầu tiên |
|-----------|----------------------|
| `#[pallet::config]` | Associated types có constraint hợp lý không? |
| `#[pallet::storage]` | Bounded không? Hasher phù hợp không? |
| `#[pallet::call]` | Origin check? Weight? Thứ tự validate vs mutate? |
| `#[pallet::hooks]` | `on_initialize` có weight chính xác không? Có panic không? |
| `construct_runtime!` | Index có ổn định khi upgrade không? |

---

## References

- Substrate FRAME Macros docs — paritytech.github.io/substrate/master/frame_support/attr.pallet.html
- Trail of Bits "Not So Smart Pallets" — secure-contracts.com/not-so-smart-contracts/substrate
- Substrate Collectables Workshop (Shawn Tabrizi) — shawntabrizi.com/substrate-collectables-workshop
- MixBytes — "Audit of Substrate Pallets: Overview & Tips" — mixbytes.io/blog/audit-of-substrate-pallets-overview-tips
