---
title: "A0. Rust Safety Patterns"
tags: [security, substrate, rust, safety, reference, appendix]
aliases: [Rust Safety Patterns]
created: 2026-03-16
---

> **Reference card** — Tổng hợp nhanh các Rust pattern an toàn dùng trong FRAME pallet development. Liên kết với: [[04-arithmetic-overflow|L04]], [[06-dont-panic|L06]], [[07-verify-first|L07]], [[10-storage-design-bugs|L10]].

---

## Arithmetic Safety

### Lựa chọn đúng cho từng tình huống

| Tình huống | Pattern | Ví dụ |
|-----------|---------|-------|
| Balance, supply, reward | `checked_*` + `ok_or(ArithmeticError::...)` | `a.checked_add(b).ok_or(ArithmeticError::Overflow)?` |
| Weight, counter, timestamp | `saturating_*` | `weight.saturating_add(extra)` |
| Intentional wrap (hash, nonce) | `wrapping_*` | `nonce.wrapping_add(1)` |
| Percentage/fraction | `FixedU128`, `Perbill`, `Permill` | `Perbill::from_percent(5).mul_floor(amount)` |
| Type cast (wider → narrower) | `.try_into().map_err(...)` | `(value as u64).try_into().map_err(\|_\| Error::<T>::Overflow)?` |

### Code nhanh

```rust
// ✅ checked_add với DispatchError
let new_val = old_val
    .checked_add(&delta)
    .ok_or(ArithmeticError::Overflow)?;

// ✅ checked_sub với custom error
let remaining = balance
    .checked_sub(&amount)
    .ok_or(Error::<T>::InsufficientBalance)?;

// ✅ checked_mul
let fee = base_fee
    .checked_mul(&multiplier)
    .ok_or(ArithmeticError::Overflow)?;

// ✅ saturating (counter không liên quan đến tiền)
let new_count = count.saturating_add(1u32);

// ✅ FixedU128 cho percentage
use sp_arithmetic::FixedU128;
let rate = FixedU128::from_rational(5, 100); // 5%
let reward = rate.saturating_mul_int(principal);

// ✅ type cast an toàn
let as_u32: u32 = large_value
    .try_into()
    .map_err(|_| Error::<T>::ValueTooLarge)?;
```

---

## Option/Result Handling

### Không dùng `.unwrap()` trong runtime

```rust
// ❌ NEVER trong runtime
let val = storage_map.get(&key).unwrap();
let decoded = Type::decode(&mut data.as_ref()).unwrap();

// ✅ LUÔN dùng ? hoặc explicit handling
let val = StorageMap::<T>::get(&key)
    .ok_or(Error::<T>::NotFound)?;

let decoded = Type::decode(&mut data.as_ref())
    .map_err(|_| Error::<T>::DecodingFailed)?;

// ✅ ok_or cho Option
let owner = maybe_owner.ok_or(Error::<T>::NoOwner)?;

// ✅ map_err cho Result
let result = fallible_operation()
    .map_err(|e| Error::<T>::OperationFailed)?;

// ✅ Khi muốn default thay vì error
let count = maybe_count.unwrap_or(0u32);
let value = maybe_value.unwrap_or_default();
```

---

## Storage Patterns

### try_mutate — Atomic check-and-modify

```rust
// ✅ try_mutate: nếu closure return Err, storage KHÔNG commit
StorageMap::<T>::try_mutate(&key, |maybe_val| -> DispatchResult {
    let val = maybe_val.as_mut().ok_or(Error::<T>::NotFound)?;
    ensure!(!val.is_locked, Error::<T>::Locked);
    val.balance = val.balance
        .checked_sub(&amount)
        .ok_or(ArithmeticError::Underflow)?;
    Ok(())
})?;
```

### take() — Read và xóa atomically

```rust
// ✅ take = get + remove, không thể "read twice"
let commitment = Commitments::<T>::take(&who)
    .ok_or(Error::<T>::NoCommitment)?;
// Commitments[who] đã bị xóa — chống replay
```

### BoundedVec — Vector có giới hạn

```rust
// ✅ BoundedVec thay vì Vec
#[pallet::storage]
pub type UserItems<T: Config> = StorageMap<
    _, Blake2_128Concat, T::AccountId,
    BoundedVec<Item, T::MaxItemsPerUser>,
    ValueQuery,
>;

// Insert vào BoundedVec
UserItems::<T>::try_mutate(&who, |items| -> DispatchResult {
    items.try_push(new_item)
        .map_err(|_| Error::<T>::MaxItemsReached)?;
    Ok(())
})?;
```

---

## `#[transactional]` — Storage Transaction

```rust
// ✅ Explicit transaction boundary
// Tất cả storage changes bị rollback nếu function trả về Err
#[transactional]
pub fn complex_operation(origin: OriginFor<T>) -> DispatchResult {
    let who = ensure_signed(origin)?;
    // Tất cả mutations bên dưới rollback nếu có Err
    StorageA::<T>::put(1);
    StorageB::<T>::put(2);
    ensure!(condition, Error::<T>::ConditionFailed); // Err → rollback A và B
    Ok(())
}

// ✅ with_transaction cho nested transaction
use frame_support::storage::with_transaction;
use frame_support::storage::TransactionOutcome;

let result = with_transaction(|| {
    InnerStorage::<T>::put(value);
    if validate_something() {
        TransactionOutcome::Commit(Ok(()))
    } else {
        TransactionOutcome::Rollback(Err(Error::<T>::Invalid.into()))
    }
})?;
```

---

## Verify First — Pattern đúng

```rust
// ✅ TẤT CẢ validate TRƯỚC, TẤT CẢ mutate SAU
pub fn safe_operation(
    origin: OriginFor<T>,
    target: T::AccountId,
    amount: T::Balance,
) -> DispatchResult {
    // === PHASE 1: VERIFY ===
    let who = ensure_signed(origin)?;

    // Origin checks
    ensure!(who != target, Error::<T>::SelfTransfer);

    // State checks
    let from_balance = Balances::<T>::get(&who);
    ensure!(from_balance >= amount, Error::<T>::InsufficientBalance);

    // Input validation
    ensure!(amount > T::Balance::zero(), Error::<T>::ZeroAmount);

    // Pre-compute (không mutate)
    let new_from = from_balance
        .checked_sub(&amount)
        .ok_or(ArithmeticError::Underflow)?;

    // === PHASE 2: EFFECTS ===
    Balances::<T>::insert(&who, new_from);
    Balances::<T>::mutate(&target, |b| *b = b.saturating_add(amount));

    // === PHASE 3: INTERACT ===
    Self::deposit_event(Event::Transfer { from: who, to: target, amount });

    Ok(())
}
```

---

## ensure! Macro

```rust
// ensure!(condition, error) = if !condition { return Err(error.into()) }

// Syntax chuẩn
ensure!(condition, Error::<T>::SomeError);

// Với arithmetic error
ensure!(a > b, ArithmeticError::Overflow);

// Với InvalidTransaction (cho validate_unsigned)
ensure!(condition, InvalidTransaction::BadProof);

// Với custom message (dùng sp_runtime)
ensure!(condition, DispatchError::Other("Custom message"));
```

---

## Hasher Selection Reference

| Key type | Hasher nên dùng | Lý do |
|----------|----------------|-------|
| `T::AccountId` (user-controlled) | `Blake2_128Concat` | Collision resistant |
| User-provided bytes/string | `Blake2_128Concat` | Collision resistant |
| Incrementing ID (u64, u32) | `Twox64Concat` | Trusted, nhanh hơn |
| `T::Hash` (đã là hash) | `Identity` | Không cần hash lại |
| Block number | `Twox64Concat` | Trusted monotonic |
| Governance-assigned ID | `Twox64Concat` | Trusted |

---

## References

- Rust Reference — Arithmetic overflow — doc.rust-lang.org/reference/expressions/operator-expr.html#overflow
- sp_arithmetic docs — paritytech.github.io/substrate/master/sp_arithmetic
- frame_support storage docs — paritytech.github.io/substrate/master/frame_support/storage
