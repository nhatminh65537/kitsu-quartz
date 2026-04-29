---
title: "06. Balances & Currency Trait"
type: foundation+tool
tags: [substrate, frame, balances, currency, token, lesson-06]
aliases: [Balances Substrate]
created: 2026-04-18
---

> **Prerequisites**: [[03-pallet-dau-tien-hello-pallet|Lesson 03]], [[05-origins-va-quyen-han|Lesson 05]]
> **Objectives**:
> - Hiểu `pallet_balances` và Currency trait trong FRAME
> - Thực hiện transfer, reserve (lock), slash tokens từ pallet tự viết
> - Tích hợp payment vào Notepad pallet — tạo note tốn phí
> - Biết sự khác biệt giữa free balance, reserved balance, và total issuance

---

## Token Model Trong Substrate

Substrate quản lý token qua **Currency trait** — một abstraction layer. Tương tự như trong Solidity bạn có `IERC20` interface, trong Substrate bạn có `Currency<AccountId>`.

```
Token State của một Account:
┌─────────────────────────────────────┐
│  Total Balance = Free + Reserved    │
│                                     │
│  Free Balance: dùng được ngay       │
│  ├─ Liquid: transfer được           │
│  └─ Frozen: locked (ví dụ staking) │
│                                     │
│  Reserved Balance: bị "giữ lại"     │
│  ├─ Không transfer được             │
│  └─ Có thể slash bởi runtime        │
└─────────────────────────────────────┘
```

---

## 1. Currency Trait

```rust
use frame_support::traits::{Currency, ReservableCurrency, ExistenceRequirement};

// T::Currency là type được inject qua Config trait
type BalanceOf<T> = <<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;
```

### Các phép toán cơ bản

```rust
// Đọc balance
T::Currency::free_balance(&account)    // free balance
T::Currency::total_balance(&account)   // free + reserved
T::Currency::total_issuance()         // tổng supply

// Transfer
T::Currency::transfer(
    &from,
    &to,
    amount,
    ExistenceRequirement::KeepAlive,  // KeepAlive: giữ account sống (không xóa)
)?;

// Reserve (lock tokens)
T::Currency::reserve(&who, amount)?;  // chuyển amount từ free → reserved

// Unreserve (unlock tokens)
T::Currency::unreserve(&who, amount); // trả lại reserved → free

// Slash reserved (phạt)
let (imbalance, remainder) = T::Currency::slash_reserved(&who, amount);
// imbalance: lượng thực sự bị slash; remainder: không slash được
```

---

## 2. Config Pallet Với Currency

Thêm `Currency` vào Config của pallet-notepad:

```rust
use frame_support::traits::{Currency, ReservableCurrency};

// Type alias tiện dùng (boilerplate chuẩn trong Substrate)
pub type BalanceOf<T> =
    <<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;

#[pallet::config]
pub trait Config: frame_system::Config {
    type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
    type MaxNoteLength: Get<u32>;
    type MaxNotesPerAccount: Get<u32>;
    type ForceDeleteOrigin: EnsureOrigin<Self::RuntimeOrigin>;

    /// Token currency — thường là pallet_balances
    type Currency: Currency<Self::AccountId> + ReservableCurrency<Self::AccountId>;

    /// Phí để tạo một note (reserve, hoàn lại khi xóa note)
    #[pallet::constant]
    type NoteDeposit: Get<BalanceOf<Self>>;
}
```

---

## 3. Tích Hợp Payment Vào create_note

Mô hình: tạo note tốn `NoteDeposit` tokens (reserve). Khi xóa note, tokens được hoàn trả. Đây là pattern **storage deposit** — phổ biến trong Substrate chains.

### Thêm Deposit Map

```rust
/// Lưu deposit của mỗi note để hoàn trả khi xóa
#[pallet::storage]
pub type NoteDeposits<T: Config> = StorageDoubleMap<
    _,
    Blake2_128Concat, T::AccountId,
    Twox64Concat, u32,
    BalanceOf<T>,
    ValueQuery,
>;
```

### Cập Nhật create_note

```rust
pub fn create_note(
    origin: OriginFor<T>,
    content: Vec<u8>,
) -> DispatchResult {
    let who = ensure_signed(origin)?;

    let count = NoteCount::<T>::get(&who);
    ensure!(count < T::MaxNotesPerAccount::get(), Error::<T>::TooManyNotes);

    let deposit = T::NoteDeposit::get();

    // Kiểm tra free balance đủ không
    ensure!(
        T::Currency::free_balance(&who) >= deposit,
        Error::<T>::InsufficientBalance
    );

    let bounded: BoundedVec<u8, T::MaxNoteLength> =
        content.try_into().map_err(|_| Error::<T>::NoteTooLong)?;

    let note_id = count;

    // Reserve deposit trước khi lưu data
    T::Currency::reserve(&who, deposit)?;

    UserNotes::<T>::insert(&who, note_id, bounded);
    NoteDeposits::<T>::insert(&who, note_id, deposit);
    NoteCount::<T>::insert(&who, count.saturating_add(1));

    Self::deposit_event(Event::NoteCreated { who, note_id });
    Ok(())
}
```

### Cập Nhật delete_note — Hoàn Trả Deposit

```rust
pub fn delete_note(
    origin: OriginFor<T>,
    note_id: u32,
) -> DispatchResult {
    let who = ensure_signed(origin)?;

    ensure!(UserNotes::<T>::contains_key(&who, note_id), Error::<T>::NoteNotFound);

    // Lấy deposit đã reserve
    let deposit = NoteDeposits::<T>::get(&who, note_id);

    // Xóa note và deposit record
    UserNotes::<T>::remove(&who, note_id);
    NoteDeposits::<T>::remove(&who, note_id);

    // Hoàn trả deposit về free balance
    T::Currency::unreserve(&who, deposit);

    Self::deposit_event(Event::NoteDeleted { who, note_id });
    Ok(())
}
```

---

## 4. Cấu Hình Trong Runtime

```rust
impl pallet_notepad::Config for Runtime {
    type RuntimeEvent = RuntimeEvent;
    type MaxNoteLength = ConstU32<512>;
    type MaxNotesPerAccount = ConstU32<10>;
    type ForceDeleteOrigin = frame_system::EnsureRoot<AccountId>;

    // Dùng pallet_balances làm Currency
    type Currency = Balances;

    // 1_000_000_000_000 = 1 token (12 decimals, giống DOT)
    type NoteDeposit = ConstU128<1_000_000_000_000>;
}
```

> [!info] Existential Deposit
> `pallet_balances` có khái niệm **Existential Deposit (ED)** — balance tối thiểu để account tồn tại. Nếu balance xuống dưới ED, account bị xóa khỏi state. Trong dev mode, ED thường là `500` hay `1_000_000_000_000`.

---

## 5. Test Payment Flow

```bash
cargo build --release
./target/release/solochain-template-node --dev
```

### Trên Polkadot.js Apps

**Kiểm tra balance trước:**
1. Accounts → Alice có ~`1,152,921,504,606,846,975` tokens

**Tạo note (sẽ reserve 1 token):**
1. Developer → Extrinsics → notepad → `createNote` → Submit

**Kiểm tra reserved balance:**
1. Developer → Chain State → **system** → **account(AccountId)**
2. Nhập địa chỉ Alice
3. Xem `data.reserved` — phải tăng lên `1_000_000_000_000`

**Xóa note (hoàn trả):**
1. Developer → Extrinsics → notepad → `deleteNote(note_id: 0)` → Submit
2. Query lại `account` → `reserved` về `0`

---

## 6. Lỗi Thường Gặp

> [!warning] `InsufficientBalance` khi test
> Nếu account test không có đủ token, dùng Alice (có sẵn rất nhiều token trong dev mode). Hoặc dùng Sudo → balances → `forceSetBalance` để set balance.

> [!warning] `ExistenceRequirement::KeepAlive` vs `AllowDeath`
> Dùng `KeepAlive` để đảm bảo sau transfer account vẫn tồn tại (balance ≥ ED). Dùng `AllowDeath` khi muốn "drain" toàn bộ và có thể xóa account — thường không cần thiết.

---

## Bài Tập Thực Hành

> [!example] Bài tập 6.1 — Tip để cảm ơn
> Thêm call `tip_author(origin, amount: BalanceOf<T>)` vào một pallet mới. Khi gọi, transfer `amount` tokens từ caller đến một hardcoded treasury account (từ Config). Dùng `T::Currency::transfer(...)`.

> [!example] Bài tập 6.2 — Slash khi vi phạm
> Thêm logic: nếu admin `force_delete_note` một note, slash 50% deposit của owner (dùng `slash_reserved`). Phần slashed "burn" bằng cách drop imbalance.

> [!example] Bài tập 6.3 — Xem reserved balance
> Sau khi tạo 3 notes, query `system.account(alice)` → tính `data.reserved`. So sánh với `3 * NoteDeposit`. Có khớp không?

---

## Tóm Tắt

| Thao tác | Hàm | Effect |
|----------|-----|--------|
| Chuyển token | `transfer(from, to, amount, req)` | Free → Free |
| Lock token | `reserve(who, amount)` | Free → Reserved |
| Unlock token | `unreserve(who, amount)` | Reserved → Free |
| Phạt token | `slash_reserved(who, amount)` | Reserved → destroyed |
| Đọc balance | `free_balance(who)` | — |
| Tổng supply | `total_issuance()` | — |

**Pattern Storage Deposit**: Reserve khi tạo → Unreserve khi xóa. Đây là cách Substrate incentivize users dọn dẹp state.

---

*[[05-origins-va-quyen-han|← Lesson 05]] | [[07-testing-pallets|Lesson 07 →]]*
