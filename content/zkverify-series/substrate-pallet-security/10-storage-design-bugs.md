---
title: "10. Storage Design Bugs"
tags: [security, substrate, frame, storage, unbounded, dos, double-spend, lesson-10]
aliases: [Storage Design Bugs]
created: 2026-03-16
---

> **Prerequisites**: [[01-frame-architecture|01. FRAME Architecture]] — biết StorageMap, StorageValue, BoundedVec
> **Objectives**:
> - Phân loại bốn lớp storage design bugs phổ biến trong FRAME pallets
> - Hiểu tại sao unbounded storage là DoS vector
> - Nhận ra missing cleanup, double-spend, và unsafe hasher patterns
> - Biết cách fix từng loại và audit scan tương ứng

---

## Motivation

Storage là "database" của blockchain runtime. Khác database thông thường, mọi read/write đều tốn **weight** (= fee), và tổng kích thước storage ảnh hưởng đến **proof size** — lượng data cần để parachain verify state transition với relay chain.

Bugs trong storage design không chỉ là "tốn tiền" mà còn có thể là:
- **DoS vector**: attacker nhồi storage đến mức block production impossibly slow
- **Proof size bloat**: PoV (Proof of Validity) vượt giới hạn → parachain bị disconnect từ relay chain
- **State corruption**: missing cleanup dẫn đến inconsistent state

---

## Lớp 1 — Unbounded Storage

### Vấn đề

Mặc định, `StorageMap`, `StorageDoubleMap`, và `Vec` trong storage không có giới hạn số lượng entries hoặc kích thước. Nếu user có thể insert vào storage không giới hạn, attacker có thể:

1. Tạo hàng nghìn entries với fee thấp (nếu weight không phản ánh đúng)
2. Khiến iteration qua map cực kỳ nặng → block production fail
3. Khiến proof size vượt giới hạn parachain

```rust
// VULNERABLE — StorageMap không có MaxValues, Vec không có giới hạn
#[pallet::storage]
pub type UserProofs<T: Config> = StorageMap<
    _, Blake2_128Concat, T::AccountId,
    Vec<ProofData>,     // ← Vec không bounded!
    ValueQuery,
>;

pub fn submit_proof(
    origin: OriginFor<T>,
    proof: ProofData,
) -> DispatchResult {
    let who = ensure_signed(origin)?;
    UserProofs::<T>::mutate(&who, |proofs| {
        proofs.push(proof); // ← bất kỳ user nào có thể push mãi mãi
    });
    Ok(())
}
```

Attacker script: gửi 10,000 transactions với proof data khác nhau → `UserProofs[attacker]` có 10,000 items → bất kỳ operation nào đọc hoặc iterate trên account này đều cực nặng.

### Fix — BoundedVec

```rust
#[pallet::storage]
pub type UserProofs<T: Config> = StorageMap<
    _, Blake2_128Concat, T::AccountId,
    BoundedVec<ProofData, T::MaxProofsPerUser>,
    ValueQuery,
>;

// Trong Config:
#[pallet::config]
pub trait Config: frame_system::Config {
    #[pallet::constant]
    type MaxProofsPerUser: Get<u32>;
}

pub fn submit_proof(
    origin: OriginFor<T>,
    proof: ProofData,
) -> DispatchResult {
    let who = ensure_signed(origin)?;
    UserProofs::<T>::try_mutate(&who, |proofs| -> DispatchResult {
        proofs.try_push(proof)
            .map_err(|_| Error::<T>::MaxProofsReached)?;
        Ok(())
    })?;
    Ok(())
}
```

### Fix — CountedStorageMap với limit

```rust
// Dùng CountedStorageMap để track count mà không cần iter
#[pallet::storage]
pub type Domains<T: Config> = CountedStorageMap<
    _, Blake2_128Concat, DomainId, DomainState<T>
>;

pub fn register_domain(...) -> DispatchResult {
    ensure!(
        Domains::<T>::count() < T::MaxDomains::get(),
        Error::<T>::TooManyDomains
    );
    Domains::<T>::insert(domain_id, state);
    Ok(())
}
```

> [!warning] `#[pallet::without_storage_info]` trong production
> Attribute macro này cho phép pallet có unbounded storage mà không cần `MaxEncodedLen`. Nếu bạn thấy nó trong production code (không phải test), đây là **flag đỏ cần review kỹ**.
>
> ```rust
> // NGUY HIỂM trong production
> #[pallet::pallet]
> #[pallet::without_storage_info]
> pub struct Pallet<T>(_);
> ```

---

## Lớp 2 — Missing Cleanup (Stale Storage)

### Vấn đề

Storage cần được xóa khi không còn dùng đến. "Stale storage" là entries còn tồn tại sau khi logic hoàn thành, gây ra:

- **State inconsistency**: cùng data tồn tại ở nhiều nơi, chỉ một nơi được update
- **Storage bloat**: state ngày càng lớn, proof size tăng
- **Logic bugs**: code check sự tồn tại của entry như một flag, nhưng entry cũ không bị xóa → false positive

```rust
// VULNERABLE — không xóa Commitments sau khi reveal
pub fn reveal(
    origin: OriginFor<T>,
    secret: u64,
) -> DispatchResult {
    let who = ensure_signed(origin)?;
    let commitment = Commitments::<T>::get(&who)
        .ok_or(Error::<T>::NoCommitment)?;

    // verify và process...

    // ❌ THIẾU: Commitments::<T>::remove(&who);
    // → Commitment cũ vẫn tồn tại sau khi reveal
    // → User có thể exploit logic tái sử dụng commitment

    Ok(())
}
```

### Fix — Dùng `take()` thay vì `get()` + `remove()`

```rust
pub fn reveal(
    origin: OriginFor<T>,
    secret: u64,
) -> DispatchResult {
    let who = ensure_signed(origin)?;

    // take() = get() + remove() atomically
    let commitment = Commitments::<T>::take(&who)
        .ok_or(Error::<T>::NoCommitment)?;

    // Commitments[who] đã bị xóa — không thể replay
    // verify và process...

    Ok(())
}
```

### Pattern cleanup trong `on_initialize`

```rust
fn on_initialize(n: BlockNumberFor<T>) -> Weight {
    // Xóa pending entries hết hạn
    let expired: Vec<_> = PendingItems::<T>::iter()
        .filter(|(_, item)| item.expires_at <= n)
        .map(|(key, _)| key)
        .collect();

    let count = expired.len() as u64;
    for key in expired {
        PendingItems::<T>::remove(key);
        // refund deposit nếu cần
    }

    T::WeightInfo::on_initialize_cleanup(count)
}
```

> [!warning] Giới hạn số lượng cleanup mỗi block
> Nếu cleanup không bounded → block production có thể fail khi có quá nhiều entries hết hạn. Luôn giới hạn số lượng items xử lý mỗi block:
>
> ```rust
> let max_cleanup = T::MaxCleanupPerBlock::get();
> let expired: Vec<_> = PendingItems::<T>::iter()
>     .filter(|(_, item)| item.expires_at <= n)
>     .take(max_cleanup as usize) // ← giới hạn!
>     .map(|(key, _)| key)
>     .collect();
> ```

---

## Lớp 3 — Double-Spend via State Race

### Vấn đề

Double-spend không chỉ xảy ra ở tầng token transfer. Trong pallet logic, "double-spend" có thể xảy ra khi:

1. Cùng một resource được claim/used hai lần do thiếu flag
2. State check và state update không atomic (đã học ở Lesson 07 nhưng góc nhìn khác)
3. Cross-block race condition

```rust
// VULNERABLE — thiếu "đã claim" flag
pub fn claim_reward(
    origin: OriginFor<T>,
    proof_id: ProofId,
) -> DispatchResult {
    let who = ensure_signed(origin)?;

    let proof = ProofStore::<T>::get(proof_id)
        .ok_or(Error::<T>::ProofNotFound)?;

    ensure!(proof.owner == who, Error::<T>::NotOwner);
    // ❌ THIẾU: ensure!(!proof.reward_claimed, Error::<T>::AlreadyClaimed);

    // Transfer reward
    T::Currency::transfer(
        &T::RewardAccount::get(),
        &who,
        proof.reward_amount,
        ExistenceRequirement::KeepAlive,
    )?;

    // ❌ THIẾU: update claimed flag
    // ProofStore::<T>::mutate(proof_id, |p| p.reward_claimed = true);

    Ok(())
}
```

User có thể gọi `claim_reward` nhiều lần cho cùng proof → drain reward account.

```rust
// FIX
pub fn claim_reward(
    origin: OriginFor<T>,
    proof_id: ProofId,
) -> DispatchResult {
    let who = ensure_signed(origin)?;

    ProofStore::<T>::try_mutate(proof_id, |maybe_proof| -> DispatchResult {
        let proof = maybe_proof.as_mut().ok_or(Error::<T>::ProofNotFound)?;
        ensure!(proof.owner == who, Error::<T>::NotOwner);
        ensure!(!proof.reward_claimed, Error::<T>::AlreadyClaimed);

        // Mark TRƯỚC khi transfer (Verify First!)
        proof.reward_claimed = true;

        T::Currency::transfer(
            &T::RewardAccount::get(),
            &who,
            proof.reward_amount,
            ExistenceRequirement::KeepAlive,
        )
    })?;

    Ok(())
}
```

---

## Lớp 4 — Unsafe Hasher Selection

### Vấn đề

`StorageMap` và `StorageDoubleMap` yêu cầu chọn một hash function cho key. Substrate cung cấp nhiều lựa chọn:

| Hasher | Collision resistant | Concatenation | Dùng khi |
|--------|--------------------|-|---------|
| `Blake2_128Concat` | Có | Có | Key do user kiểm soát — **default an toàn** |
| `Twox64Concat` | Không | Có | Key trust (ví dụ: incrementing ID, governance-set) |
| `Identity` | N/A | Có | Key đã là hash (ví dụ: `T::Hash`) |
| `Twox128` | Không | Không | Tên pallet và storage item (internal use) |
| `Blake2_128` | Có | Không | Ít dùng trong storage maps |

**Rule cơ bản**: Nếu key có thể được set bởi user (AccountId, user-provided string, user-defined ID), phải dùng `Blake2_128Concat`. Nếu dùng `Twox64Concat` với user-controlled keys, attacker có thể craft colliding keys để tấn công storage structure.

```rust
// VULNERABLE — Twox64Concat với user-controlled key
#[pallet::storage]
pub type UserData<T: Config> = StorageMap<
    _, Twox64Concat,       // ← không collision-resistant!
    Vec<u8>,               // ← key do user cung cấp!
    UserRecord,
    OptionQuery,
>;

// FIX — dùng Blake2_128Concat với user-controlled keys
#[pallet::storage]
pub type UserData<T: Config> = StorageMap<
    _, Blake2_128Concat,   // ← collision-resistant
    Vec<u8>,
    UserRecord,
    OptionQuery,
>;
```

> [!info] Tại sao Twox64Concat nhanh hơn Blake2 nhưng nguy hiểm hơn?
> `Twox64Concat` (xxHash) nhanh hơn ~10x so với Blake2 vì không có cryptographic security guarantee. Với key không tin tưởng, attacker có thể tạo 2 key khác nhau có cùng Twox64 hash → **hash collision** → hai entries "ghi đè nhau" trong storage trie → data loss hoặc unexpected behavior.

---

## Lớp 5 — StorageMap Iteration trong Runtime

### Vấn đề

Iterating qua toàn bộ `StorageMap` trong runtime là nguy hiểm vì:

1. Số lượng entries không bounded → thời gian O(n) không có giới hạn
2. Mỗi database read tốn ~25M ref_time → với 1000 entries = 25 tỷ ref_time → vượt block limit
3. Proof size của tất cả entries → có thể vượt PoV limit của parachain

```rust
// VULNERABLE — iterate toàn bộ map không giới hạn
fn on_initialize(_n: BlockNumberFor<T>) -> Weight {
    // Nếu có 10,000 domains, đây sẽ đọc 10,000 storage items!
    for (domain_id, state) in Domains::<T>::iter() {
        if state.is_expired() {
            Domains::<T>::remove(domain_id);
        }
    }
    Weight::zero() // ← Còn không tính đúng weight!
}
```

### Alternatives

**Option 1**: Dùng `CountedStorageMap` + limit iteration
```rust
fn on_initialize(_n: BlockNumberFor<T>) -> Weight {
    let max_process = T::MaxProcessPerBlock::get() as usize;
    let count = Domains::<T>::iter()
        .take(max_process)
        .filter(|(_, s)| s.is_expired())
        .map(|(id, _)| Domains::<T>::remove(id))
        .count();

    T::WeightInfo::on_initialize(count as u32)
}
```

**Option 2**: Dùng `StorageDoubleMap` với time-bucketing — group entries theo expiry block
```rust
// Key1 = expiry_block, Key2 = domain_id
#[pallet::storage]
pub type ExpiringDomains<T: Config> = StorageDoubleMap<
    _, Twox64Concat, BlockNumberFor<T>,  // bucket by block
    Blake2_128Concat, DomainId,
    (),
>;

fn on_initialize(n: BlockNumberFor<T>) -> Weight {
    // Chỉ iterate entries hết hạn tại block n — bounded!
    let count = ExpiringDomains::<T>::drain_prefix(n).count() as u32;
    T::WeightInfo::on_initialize(count)
}
```

**Option 3**: Không iterate trong runtime, dùng `offchain_worker` để prepare danh sách, submit unsigned tx để process
---

## Audit Checklist — Storage

```bash
# 1. Tìm Vec<> trong storage declarations (cần BoundedVec)
rg '#\[pallet::storage\]' pallets/ -A 5 --type rust | grep 'Vec<'

# 2. Tìm without_storage_info (pallet-level unbounded)
rg 'without_storage_info' pallets/ --type rust

# 3. Tìm iter() trong runtime code (potential unbounded iteration)
rg '::iter()\|\.iter()\.count()' pallets/src/ --type rust | grep -v test

# 4. Tìm Twox64Concat với non-trusted keys
rg 'Twox64Concat' pallets/ --type rust -B 5

# 5. Tìm các chỗ thiếu .remove() hoặc .take() sau khi dùng storage
rg '\.get\(&who\)' pallets/ --type rust -A 10 | grep -v 'take\|remove'
```

---

## Summary — Key Takeaways

- **Unbounded Vec trong storage**: luôn dùng `BoundedVec<T, MaxBound>`. `without_storage_info` trong production = flag đỏ.
- **Missing cleanup**: dùng `take()` thay vì `get()` khi muốn read-and-remove. Mark "used" flags trước khi transfer.
- **Double-spend via state**: check AND update trong cùng một `try_mutate` để tránh race condition.
- **Unsafe hasher**: `Twox64Concat` chỉ dùng với trusted keys; user-controlled keys luôn dùng `Blake2_128Concat`.
- **StorageMap iteration**: không iterate unbounded maps trong hooks; dùng time-bucketing hoặc off-chain worker.

---

## References

- Substrate Troubleshoot docs — docs.substrate.io/build/troubleshoot-your-code (unbounded storage section)
- Substrate Runtime Storage — deeper network docs — doc.deepernetwork.org/v3/runtime/storage
- StorageMap docs — paritytech.github.io/substrate/master/frame_support/storage/types/struct.StorageMap.html
- MixBytes Substrate Audit Guide — mixbytes.io/blog/audit-of-substrate-pallets-overview-tips
