---
title: "05. Origins & Quyền Hạn"
type: foundation
tags: [substrate, frame, origin, sudo, permissions, lesson-05]
aliases: [Origins Substrate]
created: 2026-04-18
---

> **Prerequisites**: [[03-pallet-dau-tien-hello-pallet|Lesson 03 — Hello Pallet]]
> **Objectives**:
> - Hiểu Origin system trong FRAME — ai đang gọi dispatchable
> - Dùng `ensure_signed`, `ensure_root`, `ensure_none`
> - Tích hợp `pallet_sudo` và thực hiện privileged calls
> - Tạo custom origin cho admin-only logic trong SimpleChain

---

## Origin Là Gì?

Trong Solidity, bạn dùng `msg.sender` để biết ai gọi function. Substrate có hệ thống phức tạp hơn gọi là **Origin** — không chỉ là một address, mà là một **enumeration** thể hiện "nguồn gốc" của call:

```
Origin
├── Signed(AccountId)  → transaction được ký bởi account
├── Root               → được phép bởi governance / sudo — quyền tối cao
└── None               → unsigned transaction — không có account
```

Mọi dispatchable function nhận `origin: OriginFor<T>` và phải xác minh origin trước khi thực hiện:

```rust
pub fn my_call(origin: OriginFor<T>) -> DispatchResult {
    // Xác minh — bắt buộc phải có một trong các ensure
    let sender = ensure_signed(origin)?;   // hoặc
    ensure_root(origin)?;                  // hoặc
    ensure_none(origin)?;
    // ...
}
```

---

## 1. ensure_signed — Origin Phổ Biến Nhất

```rust
let who: T::AccountId = ensure_signed(origin)?;
```

- Xác minh extrinsic được ký bởi một private key hợp lệ
- Trả về `AccountId` của người ký
- Tương đương `address sender = msg.sender` trong Solidity
- Nếu origin không phải Signed → trả về `BadOrigin` error

### Ví dụ: chỉ owner của resource mới xóa được

```rust
pub fn delete_item(origin: OriginFor<T>, item_id: u32) -> DispatchResult {
    let who = ensure_signed(origin)?;

    let item = Items::<T>::get(item_id).ok_or(Error::<T>::NotFound)?;

    // Kiểm tra ownership
    ensure!(item.owner == who, Error::<T>::NotOwner);

    Items::<T>::remove(item_id);
    Ok(())
}
```

---

## 2. ensure_root — Quyền Tối Cao

```rust
ensure_root(origin)?;
```

Root origin có thể làm mọi thứ — upgrade runtime, force-set state, bypass bất kỳ restriction nào. Trong production, Root thường được kiểm soát bởi governance (on-chain voting). Trong development/testnet, dùng `pallet_sudo`.

```rust
/// Chỉ root mới được gọi — ví dụ: emergency pause
pub fn emergency_pause(origin: OriginFor<T>) -> DispatchResult {
    ensure_root(origin)?;
    IsPaused::<T>::put(true);
    Ok(())
}
```

---

## 3. pallet_sudo — Root Cho Development

`pallet_sudo` cho phép một account đặc biệt (sudo key) thực hiện Root calls. Solochain template đã bao gồm pallet này.

### Dùng Sudo Trên Polkadot.js

1. Vào **Developer** → **Sudo**
2. Chọn call muốn thực hiện với Root privilege
3. Sign bằng account Alice (sudo key mặc định trong dev mode)

### Thay Đổi Sudo Key

```rust
// Trong runtime genesis config (chain spec):
pallet_sudo: SudoConfig {
    key: Some(alice_account_id),
}
```

---

## 4. Custom Origin — Admin Role

Đôi khi bạn cần một nhóm accounts được cấp quyền đặc biệt (không phải Root, không phải mọi user). Substrate hỗ trợ **EnsureOrigin** trait:

### Cách 1: EnsureSignedBy — Whitelist accounts cố định

```rust
use frame_system::EnsureSignedBy;
use sp_runtime::traits::AccountIdConversion;

// Trong Config:
type AdminOrigin: EnsureOrigin<Self::RuntimeOrigin>;

// Trong runtime config:
impl pallet_notepad::Config for Runtime {
    // Chỉ Alice được gọi admin functions
    type AdminOrigin = EnsureSignedBy<AliceAccount, AccountId>;
    // ...
}
```

### Cách 2: EnsureRoot | EnsureSigned — Dùng Either

```rust
use frame_support::traits::EitherOfDiverse;
use frame_system::{EnsureRoot, EnsureSigned};

// AdminOrigin = root OR signed (bất kỳ ai)
type AdminOrigin = EitherOfDiverse<EnsureRoot<AccountId>, EnsureSigned<AccountId>>;
```

### Cách 3: Custom Origin type (Nâng cao)

Tự định nghĩa origin mới — ví dụ role-based:

```rust
// Trong pallet:
#[pallet::origin]
pub enum Origin {
    Admin,
    Moderator,
}

// Dùng:
let _ = T::AdminOrigin::ensure_origin(origin)?;
```

---

## 5. Thêm Admin Control Vào Notepad Pallet

Thêm tính năng admin vào `pallet-notepad`: admin có thể xóa note của bất kỳ user nào (ví dụ moderation).

### Cập Nhật Config

```rust
#[pallet::config]
pub trait Config: frame_system::Config {
    type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
    type MaxNoteLength: Get<u32>;
    type MaxNotesPerAccount: Get<u32>;

    /// Origin có quyền admin (moderation)
    type ForceDeleteOrigin: EnsureOrigin<Self::RuntimeOrigin>;
}
```

### Thêm Dispatchable Admin Call

```rust
/// Admin: xóa note của bất kỳ user nào (moderation)
#[pallet::call_index(3)]
#[pallet::weight(Weight::from_parts(30_000_000, 0))]
pub fn force_delete_note(
    origin: OriginFor<T>,
    target: T::AccountId,
    note_id: u32,
) -> DispatchResult {
    // Chỉ ForceDeleteOrigin mới được gọi
    T::ForceDeleteOrigin::ensure_origin(origin)?;

    ensure!(
        UserNotes::<T>::contains_key(&target, note_id),
        Error::<T>::NoteNotFound
    );

    UserNotes::<T>::remove(&target, note_id);
    Self::deposit_event(Event::NoteDeleted { who: target, note_id });
    Ok(())
}
```

### Cấu Hình Trong Runtime

```rust
impl pallet_notepad::Config for Runtime {
    type RuntimeEvent = RuntimeEvent;
    type MaxNoteLength = ConstU32<512>;
    type MaxNotesPerAccount = ConstU32<10>;
    // Root (sudo) có thể force delete
    type ForceDeleteOrigin = frame_system::EnsureRoot<AccountId>;
}
```

---

## 6. Kiểm Tra Trên Polkadot.js

**Test ensure_signed:**
1. Developer → Extrinsics → notepad → `createNote` → sign bằng Alice → OK
2. Thử sign bằng account không có key → sẽ bị reject

**Test ensure_root (qua sudo):**
1. Developer → Sudo → chọn call `notepad.forceDeleteNote`
2. Nhập target AccountId và note_id
3. Submit với sudo key (Alice)
4. Nếu thử gọi trực tiếp (không qua sudo) → BadOrigin error

---

## Bài Tập Thực Hành

> [!example] Bài tập 5.1 — Pause mechanism
> Thêm `StorageValue<_, bool, ValueQuery>` tên `IsPaused` vào pallet-notepad. Thêm hai calls:
> - `pause(origin)` — chỉ Root mới gọi được, set `IsPaused = true`
> - `unpause(origin)` — chỉ Root mới gọi được
>
> Trong `createNote` và `updateNote`, thêm check:
> ```rust
> ensure!(!IsPaused::<T>::get(), Error::<T>::PalletPaused);
> ```

> [!example] Bài tập 5.2 — Allowlist
> Thêm `StorageMap` tên `Allowlist` mapping `AccountId → bool`. Thêm call `addToAllowlist(who)` chỉ Root mới gọi được. Sửa `createNote` chỉ cho phép accounts trong allowlist tạo notes.

---

## Tóm Tắt

| Origin | Dùng khi | Macro |
|--------|---------|-------|
| `Signed(AccountId)` | User thực hiện action | `ensure_signed(origin)?` |
| `Root` | Admin/governance action | `ensure_root(origin)?` |
| `None` | Unsigned transaction | `ensure_none(origin)?` |
| Custom | Role-based access | `T::MyOrigin::ensure_origin(origin)?` |

Pattern chuẩn:
1. Luôn kiểm tra origin đầu tiên trong dispatchable
2. Dùng `ensure_signed` cho hầu hết user-facing calls
3. Dùng `ensure_root` cho privileged/admin calls
4. Custom origin khi cần role system phức tạp hơn

---

*[[04-storage-types-nang-cao|← Lesson 04]] | [[06-balances-va-currency-trait|Lesson 06 →]]*
