---
title: "07. Testing Pallets"
type: tool
tags: [substrate, frame, testing, mock, unit-test, lesson-07]
aliases: [Testing Pallets]
created: 2026-04-18
---

> **Prerequisites**: [[03-pallet-dau-tien-hello-pallet|Lesson 03]] → [[06-balances-va-currency-trait|Lesson 06]]
> **Objectives**:
> - Xây mock runtime cho unit tests
> - Viết unit tests với `assert_ok!`, `assert_noop!`, `assert_err!`
> - Test events và storage state sau dispatchable calls
> - Hiểu pattern test chuẩn trong Substrate ecosystem

---

## Tại Sao Test Trong Substrate Khác?

Trong EVM, bạn test bằng Hardhat/Foundry — deploy contract lên local EVM, call functions. Trong Substrate, bạn test ở tầng **Rust unit test**: tạo một "mock runtime" in-memory, gọi dispatchables trực tiếp trong Rust — nhanh và không cần chạy node.

---

## 1. Mock Runtime — Nền Tảng Của Test

Mock runtime là một runtime đơn giản chỉ chứa đủ pallets để test pallet bạn cần. Tạo file `pallets/counter/src/mock.rs`:

```rust
use crate as pallet_counter;
use frame_support::{
    derive_impl,
    traits::{ConstU16, ConstU32, ConstU64},
};
use sp_runtime::BuildStorage;

// Khai báo một runtime type cho test
frame_support::construct_runtime!(
    pub enum Test {
        System: frame_system,
        Counter: pallet_counter,
    }
);

// Cấu hình frame_system cho Test runtime
#[derive_impl(frame_system::config_preludes::TestDefaultConfig)]
impl frame_system::Config for Test {
    type Block = frame_system::mocking::MockBlock<Test>;
}

// Cấu hình pallet_counter cho Test runtime
impl pallet_counter::Config for Test {
    type RuntimeEvent = RuntimeEvent;
    type WeightInfo = ();  // unit weight — không quan tâm weight khi test
}

// Helper function để khởi tạo storage state trước mỗi test
pub fn new_test_ext() -> sp_io::TestExternalities {
    frame_system::GenesisConfig::<Test>::default()
        .build_storage()
        .unwrap()
        .into()
}
```

> [!definition] `TestExternalities`
> Môi trường "giả lập" on-chain storage cho test. Mọi thay đổi storage trong test đều xảy ra in-memory, không ảnh hưởng test khác.

---

## 2. Viết Unit Tests

Tạo file `pallets/counter/src/tests.rs`:

```rust
use crate::{mock::*, Error, Event, Counter, AccountCounter};
use frame_support::{assert_ok, assert_noop};

/// Helper: lấy events từ System pallet
fn last_event() -> RuntimeEvent {
    System::events().pop().expect("No events").event
}

#[test]
fn increment_works() {
    new_test_ext().execute_with(|| {
        // Arrange: counter ban đầu = 0
        assert_eq!(Counter::<Test>::get(), 0);

        // Act: gọi increment với origin = account 1
        assert_ok!(Counter::increment(RuntimeOrigin::signed(1)));

        // Assert: counter = 1
        assert_eq!(Counter::<Test>::get(), 1);
    });
}

#[test]
fn increment_emits_event() {
    new_test_ext().execute_with(|| {
        // Cần initialize block để events hoạt động
        System::set_block_number(1);

        assert_ok!(Counter::increment(RuntimeOrigin::signed(1)));

        // Kiểm tra event được emit
        System::assert_last_event(
            Event::CounterIncremented { new_value: 1 }.into()
        );
    });
}

#[test]
fn increment_multiple_times() {
    new_test_ext().execute_with(|| {
        for i in 1..=5u32 {
            assert_ok!(Counter::increment(RuntimeOrigin::signed(1)));
            assert_eq!(Counter::<Test>::get(), i);
        }
    });
}

#[test]
fn set_counter_requires_root() {
    new_test_ext().execute_with(|| {
        // Dùng signed origin → phải fail với BadOrigin
        assert_noop!(
            Counter::set_counter(RuntimeOrigin::signed(1), 100),
            frame_support::error::BadOrigin
        );

        // Dùng root origin → phải ok
        assert_ok!(Counter::set_counter(RuntimeOrigin::root(), 100));
        assert_eq!(Counter::<Test>::get(), 100);
    });
}

#[test]
fn increment_overflow_returns_error() {
    new_test_ext().execute_with(|| {
        // Set counter gần tối đa
        Counter::<Test>::put(u32::MAX - 1);
        assert_ok!(Counter::increment(RuntimeOrigin::signed(1)));
        assert_eq!(Counter::<Test>::get(), u32::MAX);

        // Lần này phải overflow
        assert_noop!(
            Counter::increment(RuntimeOrigin::signed(1)),
            Error::<Test>::CounterOverflow
        );

        // Counter không thay đổi
        assert_eq!(Counter::<Test>::get(), u32::MAX);
    });
}

#[test]
fn account_counter_is_per_account() {
    new_test_ext().execute_with(|| {
        // Account 1 và account 2 có counter độc lập
        assert_ok!(Counter::increment_account(RuntimeOrigin::signed(1)));
        assert_ok!(Counter::increment_account(RuntimeOrigin::signed(1)));
        assert_ok!(Counter::increment_account(RuntimeOrigin::signed(2)));

        assert_eq!(AccountCounter::<Test>::get(1), 2);
        assert_eq!(AccountCounter::<Test>::get(2), 1);
    });
}

#[test]
fn reset_account_clears_storage() {
    new_test_ext().execute_with(|| {
        System::set_block_number(1);

        assert_ok!(Counter::increment_account(RuntimeOrigin::signed(1)));
        assert_eq!(AccountCounter::<Test>::get(1), 1);

        assert_ok!(Counter::reset_account(RuntimeOrigin::signed(1)));

        // Storage bị xóa → ValueQuery trả về default = 0
        assert_eq!(AccountCounter::<Test>::get(1), 0);

        System::assert_last_event(
            Event::AccountCounterReset { who: 1 }.into()
        );
    });
}
```

---

## 3. Mock Runtime Với Balances

Nếu pallet của bạn dùng Currency (như pallet-notepad), mock runtime cần include `pallet_balances`:

```rust
// pallets/notepad/src/mock.rs
use frame_support::{
    derive_impl, parameter_types,
    traits::{ConstU32, ConstU128},
};

frame_support::construct_runtime!(
    pub enum Test {
        System: frame_system,
        Balances: pallet_balances,
        Notepad: pallet_notepad,
    }
);

#[derive_impl(frame_system::config_preludes::TestDefaultConfig)]
impl frame_system::Config for Test {
    type Block = frame_system::mocking::MockBlock<Test>;
    type AccountData = pallet_balances::AccountData<u128>;
}

#[derive_impl(pallet_balances::config_preludes::TestDefaultConfig)]
impl pallet_balances::Config for Test {
    type AccountStore = System;
}

parameter_types! {
    pub const NoteDepositAmount: u128 = 100;  // nhỏ để test tiện
}

impl pallet_notepad::Config for Test {
    type RuntimeEvent = RuntimeEvent;
    type MaxNoteLength = ConstU32<512>;
    type MaxNotesPerAccount = ConstU32<10>;
    type ForceDeleteOrigin = frame_system::EnsureRoot<u64>;
    type Currency = Balances;
    type NoteDeposit = NoteDepositAmount;
}

/// Khởi tạo state với balances cho các accounts test
pub fn new_test_ext() -> sp_io::TestExternalities {
    let mut t = frame_system::GenesisConfig::<Test>::default()
        .build_storage()
        .unwrap();

    pallet_balances::GenesisConfig::<Test> {
        balances: vec![
            (1, 10_000),  // account 1 có 10_000 tokens
            (2, 500),     // account 2 có 500 tokens (gần mức ED)
        ],
    }
    .assimilate_storage(&mut t)
    .unwrap();

    t.into()
}
```

---

## 4. Test Notepad Với Payment

```rust
// pallets/notepad/src/tests.rs
use crate::{mock::*, Error, Event};
use frame_support::{assert_ok, assert_noop};

fn note_content() -> Vec<u8> {
    b"Hello, SimpleChain!".to_vec()
}

#[test]
fn create_note_reserves_deposit() {
    new_test_ext().execute_with(|| {
        let deposit = 100u128; // NoteDepositAmount

        let free_before = Balances::free_balance(1);
        let reserved_before = Balances::reserved_balance(1);

        assert_ok!(Notepad::create_note(RuntimeOrigin::signed(1), note_content()));

        // Free balance giảm đúng bằng deposit
        assert_eq!(Balances::free_balance(1), free_before - deposit);
        // Reserved tăng
        assert_eq!(Balances::reserved_balance(1), reserved_before + deposit);
    });
}

#[test]
fn delete_note_unreserves_deposit() {
    new_test_ext().execute_with(|| {
        assert_ok!(Notepad::create_note(RuntimeOrigin::signed(1), note_content()));

        let free_after_create = Balances::free_balance(1);
        let reserved_after_create = Balances::reserved_balance(1);

        assert_ok!(Notepad::delete_note(RuntimeOrigin::signed(1), 0));

        // Deposit được hoàn trả
        assert_eq!(Balances::free_balance(1), free_after_create + 100);
        assert_eq!(Balances::reserved_balance(1), reserved_after_create - 100);
    });
}

#[test]
fn create_note_fails_if_insufficient_balance() {
    new_test_ext().execute_with(|| {
        // Account 2 có 500 tokens, deposit = 100 — đủ
        assert_ok!(Notepad::create_note(RuntimeOrigin::signed(2), note_content()));

        // Nhưng nếu drain balance...
        // (test với account có balance < deposit)
        // Tạo account 99 với 50 tokens (< deposit 100)
        let _ = Balances::deposit_creating(&99, 50);

        assert_noop!(
            Notepad::create_note(RuntimeOrigin::signed(99), note_content()),
            Error::<Test>::InsufficientBalance
        );
    });
}

#[test]
fn cannot_exceed_max_notes_per_account() {
    new_test_ext().execute_with(|| {
        // Tạo tối đa (MaxNotesPerAccount = 10)
        for _ in 0..10 {
            assert_ok!(Notepad::create_note(RuntimeOrigin::signed(1), note_content()));
        }

        // Note thứ 11 phải fail
        assert_noop!(
            Notepad::create_note(RuntimeOrigin::signed(1), note_content()),
            Error::<Test>::TooManyNotes
        );
    });
}
```

---

## 5. Chạy Tests

```bash
# Chạy tests của một pallet cụ thể
cargo test -p pallet-counter

# Chạy tests với output chi tiết hơn
cargo test -p pallet-counter -- --nocapture

# Chạy tất cả tests trong workspace
cargo test
```

Output mong đợi:

```
running 6 tests
test tests::increment_works ... ok
test tests::increment_emits_event ... ok
test tests::increment_multiple_times ... ok
test tests::set_counter_requires_root ... ok
test tests::increment_overflow_returns_error ... ok
test tests::account_counter_is_per_account ... ok

test result: ok. 6 passed; 0 failed
```

---

## 6. Các Macro Test Thường Dùng

| Macro | Dùng khi |
|-------|---------|
| `assert_ok!(call)` | Kỳ vọng call thành công (`Ok(...)`) |
| `assert_noop!(call, error)` | Kỳ vọng call fail với error cụ thể, và storage **không thay đổi** |
| `assert_err!(call, error)` | Kỳ vọng call fail với error cụ thể (không check storage) |
| `System::assert_last_event(event)` | Kiểm tra event cuối cùng được emit |
| `System::assert_has_event(event)` | Kiểm tra event tồn tại trong danh sách events của block |

> [!tip] `assert_noop!` vs `assert_err!`
> Prefer `assert_noop!` vì nó cũng verify storage **không bị mutate** khi call fail — đảm bảo proper rollback. Đây là property quan trọng: failed dispatchables không được để lại side effects.

---

## Bài Tập Thực Hành

> [!example] Bài tập 7.1 — Test update_note
> Viết test cho `update_note`: tạo note → update nội dung → verify storage thay đổi. Thêm test: update note không tồn tại → `NoteNotFound`.

> [!example] Bài tập 7.2 — Test force_delete_note
> Viết test: Alice tạo note → Bob (với root origin) force delete → note biến mất. Thêm test: Bob thử force delete bằng signed origin → `BadOrigin`.

> [!example] Bài tập 7.3 — Test với nhiều blocks
> Dùng `System::set_block_number(n)` để simulate nhiều blocks. Tạo note ở block 1, update ở block 5, delete ở block 10. Verify events ở từng bước.

---

## Tóm Tắt

Testing workflow cho Substrate pallet:

```
1. Tạo mock.rs — construct_runtime! với chỉ pallets cần thiết
2. new_test_ext() — khởi tạo genesis state với balances, config
3. test fn với new_test_ext().execute_with(|| { ... })
4. assert_ok! / assert_noop! / assert_err!
5. System::assert_last_event! để check events
6. cargo test -p pallet-name
```

Không cần chạy node, không cần Docker — tests chạy nhanh, deterministic, hoàn toàn in-memory.

---

*[[06-balances-va-currency-trait|← Lesson 06]] | [[08-chain-spec-va-genesis-config|Lesson 08 →]]*
