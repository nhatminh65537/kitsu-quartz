---
title: "07. Verify First"
tags: [security, substrate, frame, verify-first, transactional, state-corruption, lesson-07]
aliases: [Verify First]
created: 2026-03-16
---

> **Prerequisites**: [[01-frame-architecture|01. FRAME Architecture]], [[02-extrinsics-and-dispatch|02. Extrinsics & Dispatch]] — biết `DispatchResult`, rollback behavior, `ensure!`
> **Objectives**:
> - Hiểu nguyên lý Check-Effects-Interactions (CEI) và bản tương đương trong Substrate
> - Phân loại các lỗi "write trước validate sau" và hậu quả của chúng
> - Hiểu `#[transactional]` và giới hạn của nó
> - Nhận ra partial state corruption trong audit

---

## Motivation

Trong Ethereum, **Check-Effects-Interactions (CEI)** là pattern bảo mật cốt lõi chống reentrancy: kiểm tra điều kiện trước, cập nhật state sau, gọi external contract cuối cùng. Vi phạm CEI dẫn đến reentrancy attacks như vụ DAO hack năm 2016 ($60M).

Substrate không có reentrancy theo nghĩa EVM (không có callback mechanism như vậy), nhưng vẫn có **"Verify First"** — một variant của CEI riêng cho runtime. Lỗi vi phạm "Verify First" dẫn đến:

- **Partial state corruption**: storage thay đổi một phần rồi transaction fail → state inconsistent
- **State mismatch**: hai storage items phải synchronized nhưng chỉ một cái được update
- **Double execution**: cùng một effect xảy ra hai lần do ordering sai

Trail of Bits liệt kê "Verify First" là một trong 7 vulnerability class quan trọng nhất.

---

## Nguyên lý Verify First

Pattern đúng cho mọi extrinsic trong Substrate:

```
1. VERIFY   — tất cả kiểm tra điều kiện (ensure!, validate input, check ownership...)
2. EFFECTS  — thay đổi storage local
3. INTERACT — gọi pallets khác, emit events
```

Toàn bộ validation phải **hoàn thành trước** khi bất kỳ storage nào bị mutate. Nếu validation fail giữa chừng sau khi đã mutate một phần → partial state corruption.

---

## Vulnerability Classes

### VF1: Storage mutate trước khi validate

```rust
// VULNERABLE — thay đổi storage TRƯỚC khi check điều kiện
pub fn transfer(
    origin: OriginFor<T>,
    to: T::AccountId,
    amount: T::Balance,
) -> DispatchResult {
    let from = ensure_signed(origin)?;

    // ❌ MUTATE STORAGE TRƯỚC
    Balances::<T>::mutate(&from, |b| *b -= amount); // underflow nếu amount > balance!
    Balances::<T>::mutate(&to, |b| *b += amount);

    // ❌ VALIDATE SAU — quá trễ rồi!
    ensure!(
        Balances::<T>::get(&from) >= T::Balance::zero(),
        Error::<T>::InsufficientBalance
    );

    Ok(())
}
```

Trong ví dụ trên: nếu amount > balance, `*b -= amount` sẽ **underflow** (balance quay về MAX_VALUE trong release mode — như đã học ở Lesson 04), và transaction fail với `InsufficientBalance`. Nhưng storage đã bị corrupt — `from` có balance = MAX, `to` có balance tăng lên.

Nếu arithmetic đang dùng `checked_sub`, nó sẽ panic hoặc trả về None → cũng không giải quyết được vấn đề ordering.

```rust
// CORRECT — validate TRƯỚC, mutate SAU
pub fn transfer(
    origin: OriginFor<T>,
    to: T::AccountId,
    amount: T::Balance,
) -> DispatchResult {
    let from = ensure_signed(origin)?;

    // ✅ VALIDATE TRƯỚC
    let from_balance = Balances::<T>::get(&from);
    ensure!(from_balance >= amount, Error::<T>::InsufficientBalance);

    // ✅ MUTATE SAU — chỉ khi đã chắc chắn hợp lệ
    Balances::<T>::insert(&from, from_balance - amount);
    Balances::<T>::mutate(&to, |b| *b = b.saturating_add(amount));

    Self::deposit_event(Event::Transferred { from, to, amount });
    Ok(())
}
```

### VF2: Multi-step mutation với validate xen giữa

```rust
// VULNERABLE — ba bước mutate, validate xảy ra ở giữa
pub fn complex_operation(
    origin: OriginFor<T>,
    param: u32,
) -> DispatchResult {
    let who = ensure_signed(origin)?;

    // Step 1 — mutate storage A
    StorageA::<T>::mutate(&who, |v| *v += 1);  // ← storage đã thay đổi

    // Step 2 — validate (quá trễ!)
    ensure!(param > 0, Error::<T>::InvalidParam);

    // Step 3 — mutate storage B
    StorageB::<T>::insert(&who, param);

    Ok(())
}
```

Nếu `param == 0`, transaction fail ở Step 2, nhưng Step 1 đã commit. `StorageA` tăng lên 1 dù operation failed. Vì mặc định extrinsic có transactional boundary, Step 1 sẽ được rollback — nhưng chỉ nếu `#[transactional]` được áp dụng đúng (xem bên dưới).

### VF3: Cross-pallet call gây inconsistency

```rust
// VULNERABLE — gọi pallet khác ở giữa, trước khi validate xong
pub fn register_and_pay(
    origin: OriginFor<T>,
    domain_id: DomainId,
    fee: T::Balance,
) -> DispatchResult {
    let who = ensure_signed(origin)?;

    // Register domain (mutate storage)
    Domains::<T>::insert(domain_id, DomainState::new(who.clone()));

    // Charge fee qua pallet khác (có thể fail!)
    T::Currency::transfer(
        &who,
        &T::FeeAccount::get(),
        fee,
        ExistenceRequirement::KeepAlive,
    )?;  // nếu fail → revert về Err, nhưng Domains đã được insert!

    Ok(())
}
```

Khi `Currency::transfer` fail (ví dụ: không đủ tiền), `?` operator return Err → automatic rollback sẽ revert `Domains::insert`. Nhưng điều này **chỉ đúng** khi extrinsic có transactional boundary bao phủ cả hai operations.

Pattern đúng: validate tất cả điều kiện (kể cả balance check) trước khi thực hiện bất kỳ mutation nào.

---

## `#[transactional]` — Cơ chế rollback

Substrate cung cấp `#[transactional]` attribute để wrap một function trong storage transaction. Nếu function trả về `Err`, **tất cả** storage changes trong function đó bị rollback.

```rust
// Explicit transactional — tất cả mutations rollback nếu Err
#[transactional]
pub fn risky_operation() -> DispatchResult {
    StorageA::put(1);
    StorageB::put(2);
    ensure!(false, Error::<T>::SomethingFailed);
    // StorageA và StorageB đều được rollback về giá trị cũ
    Ok(())
}
```

> [!info] Từ Substrate 0.9.17+: Extrinsics mặc định là transactional
> Trong các phiên bản Substrate hiện đại, mỗi extrinsic dispatch tự động được wrap trong một storage transaction layer. Nếu extrinsic trả về `Err`, tất cả storage changes bị rollback.
>
> Tuy nhiên điều này **không áp dụng** cho:
> - Code trong `on_initialize`/`on_finalize` (không có implicit transaction)
> - Internal helper functions gọi từ extrinsic nếu chúng sử dụng storage trực tiếp

### Nesting transactional

```rust
// Hai layers: extrinsic layer (implicit) + explicit layer
pub fn outer(origin: OriginFor<T>) -> DispatchResult {
    let _ = ensure_signed(origin)?;

    StorageA::put(1);  // trong implicit transaction của extrinsic

    // Nested transaction — chỉ rollback nếu inner fail
    let result = with_transaction(|| {
        StorageB::put(2);
        StorageC::put(3);
        if some_condition {
            TransactionOutcome::Rollback(Err(Error::<T>::Condition.into()))
        } else {
            TransactionOutcome::Commit(Ok(()))
        }
    });

    // StorageA luôn tồn tại nếu outer không fail
    // StorageB và C chỉ tồn tại nếu inner commit
    result
}
```

> [!warning] MixBytes: Trong code Substrate cũ, `#[transactional]` không phải default
> Nếu đang audit một chain dùng Substrate version cũ (trước 0.9.17) hoặc codebase không cập nhật, `#[transactional]` phải được annotate **trên mỗi extrinsic** thủ công. Thiếu `#[transactional]` → state changes persist dù extrinsic fail.
>
> Kiểm tra: tìm extrinsic không có `#[transactional]` trong codebase cũ, và trace xem có storage mutation trước conditional return không.

---

## Pattern "try_mutate" — Atomic check-and-set

FRAME cung cấp `try_mutate` để thực hiện check + mutate atomically:

```rust
// Không an toàn — read, check, write riêng
let balance = Balances::<T>::get(&who);
ensure!(balance >= amount, Error::<T>::InsufficientBalance);
Balances::<T>::insert(&who, balance - amount);

// An toàn hơn — dùng try_mutate
Balances::<T>::try_mutate(&who, |balance| -> DispatchResult {
    *balance = balance.checked_sub(&amount)
        .ok_or(Error::<T>::InsufficientBalance)?;
    Ok(())
})?;
```

`try_mutate` nhận closure; nếu closure trả về `Err`, storage **không được commit**. Đây là cách idiomatic nhất để làm conditional storage update trong Substrate.

---

## Audit Pattern — Nhận diện Verify First bugs

```bash
# 1. Tìm storage mutations trong extrinsic body
rg 'StorageMap\|StorageValue\|StorageDoubleMap' pallets/ -A 2 --type rust \
    | grep '::\(insert\|put\|mutate\|remove\|take\)'

# 2. Sau đó kiểm tra: có `ensure!` hay validation nào SAU mutation không?
```

Khi đọc từng extrinsic theo thứ tự dòng:

```
Nếu thấy pattern:
  mutate/insert/remove  ← line N
  ...
  ensure!()             ← line M (M > N)

→ ĐÂY LÀ FLAG: validate sau mutate
→ Hỏi: "Nếu ensure! này fail, storage đã thay đổi như thế nào?"
→ Nếu storage thay đổi và transactional không đủ → BUG
```

Trường hợp đặc biệt cần chú ý: `on_initialize` và `on_finalize` — không có implicit transaction, mọi mutation đều permanent.

---

## Summary — Key Takeaways

- **Verify First** = tất cả validation hoàn thành trước khi bất kỳ storage nào thay đổi.
- **Partial state corruption**: mutate trước validate → nếu validation fail sau đó → state inconsistent.
- **`#[transactional]`** wrap function trong storage transaction — Err = rollback. Mặc định trong extrinsic từ Substrate 0.9.17+.
- **`try_mutate`** là cách idiomatic để atomic check-and-set trong storage.
- **`on_initialize`/`on_finalize`** không có implicit transaction — phải viết verify-first thủ công.
- **Audit**: đọc extrinsic từ trên xuống, flag mọi mutation xuất hiện trước `ensure!`.

---

## References

- Trail of Bits "Not So Smart Pallets — Verify First" — secure-contracts.com/not-so-smart-contracts/substrate/verify_first
- MixBytes "Audit of Substrate Pallets" — mixbytes.io/blog/audit-of-substrate-pallets-overview-tips
- Substrate issue #10806 — "Transactional Storage as Default in FRAME" — github.com/paritytech/substrate/issues/10806
- frame_support::storage::with_transaction docs
