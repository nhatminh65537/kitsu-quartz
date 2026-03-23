---
title: "11. Inter-Pallet Interactions"
tags: [security, substrate, frame, coupling, cross-pallet, storage-overwrite, lesson-11]
aliases: [Inter-Pallet Interactions]
created: 2026-03-16
---

> **Prerequisites**: [[01-frame-architecture|01. FRAME Architecture]], [[07-verify-first|07. Verify First]], [[10-storage-design-bugs|10. Storage Design Bugs]]
> **Objectives**:
> - Phân biệt tight coupling và loose coupling, và security implication của từng loại
> - Nhận ra các lỗi cross-pallet: unintended storage overwrites, missing authorization qua dispatch, assumption violations
> - Hiểu callback anti-patterns và alternative designs
> - Biết cách audit inter-pallet dependencies

---

## Motivation

Trong Substrate, không có "sandbox isolation" giữa các pallet trong cùng runtime. Một pallet có thể đọc và ghi storage của pallet khác. Điều này rất mạnh nhưng cũng rất nguy hiểm.

Khi pallet A gọi pallet B, các câu hỏi bảo mật mới xuất hiện:

- Pallet B có tin tưởng origin đến từ pallet A không?
- Nếu pallet B thay đổi storage mà pallet A đang dựa vào, điều gì xảy ra?
- Nếu pallet B fail, pallet A có rollback đúng không?
- Nếu pallet A bị upgrade nhưng pallet B không, invariants có còn đúng không?

---

## Tight Coupling vs Loose Coupling

### Tight Coupling — Pallet kế thừa Config của pallet khác

```rust
// Tight coupling: Config của pallet A extends Config của pallet B
#[pallet::config]
pub trait Config: frame_system::Config + pallet_balances::Config {
    // Pallet A có thể truy cập TẤT CẢ types và storage của pallet_balances
}

// Trong extrinsic — truy cập storage của pallet khác trực tiếp
pub fn do_something(origin: OriginFor<T>) -> DispatchResult {
    let who = ensure_signed(origin)?;
    // Đọc trực tiếp từ pallet_balances storage
    let balance = pallet_balances::Pallet::<T>::free_balance(&who);
    // ...
}
```

**Rủi ro bảo mật của tight coupling**:
- Nếu `pallet_balances` thay đổi internal storage layout (khác type, thêm field), pallet A có thể đọc dữ liệu sai mà không có compile error → **silent data corruption**
- Pallet A phụ thuộc vào implementation detail, không phải public interface → upgrade một pallet có thể break pallet kia

### Loose Coupling — Qua Trait Interface

```rust
// Loose coupling: chỉ expose interface cần thiết
#[pallet::config]
pub trait Config: frame_system::Config {
    // Chỉ expose Currency trait, không couple với implementation cụ thể
    type Currency: Currency<Self::AccountId>;
}

// Trong extrinsic — dùng trait methods
pub fn charge_fee(origin: OriginFor<T>, amount: T::Balance) -> DispatchResult {
    let who = ensure_signed(origin)?;
    T::Currency::transfer(
        &who,
        &T::FeeCollector::get(),
        amount,
        ExistenceRequirement::KeepAlive,
    )?;
    Ok(())
}
```

Loose coupling là **best practice**: chỉ expose interface cần dùng, implementation có thể thay đổi mà không ảnh hưởng pallet A.

---

## Vulnerability Classes

### IP1: Unintended Storage Overwrite qua Shared Keys

Khi hai pallets dùng cùng storage key prefix, chúng có thể ghi đè nhau:

```rust
// Pallet A định nghĩa:
#[pallet::storage]
pub type Registry<T: Config> = StorageMap<_, Blake2_128Concat, T::AccountId, u32>;

// Pallet B định nghĩa storage với cùng tên "Registry":
#[pallet::storage]
pub type Registry<T: Config> = StorageMap<_, Blake2_128Concat, T::AccountId, u64>;
```

Substrate tạo storage key từ `blake2(pallet_name) ++ blake2(storage_name)`. Nếu hai pallets có cùng tên trong `construct_runtime!`, chúng sẽ **share storage key space** → ghi đè lẫn nhau.

```rust
// construct_runtime! với tên trùng nhau (hiếm nhưng có thể xảy ra với custom pallets)
construct_runtime!(
    pub enum Runtime {
        System: frame_system,
        MyModule: pallet_my_module,   // pallet_prefix = "MyModule"
        MyModuleV2: pallet_my_module, // SAME prefix nếu không override!
    }
);
```

**Fix**: Luôn override pallet prefix khi có nhiều instances:
```rust
// Trong pallet declaration
#[pallet::pallet]
#[pallet::storage_prefix = "MyModuleV2"]
pub struct Pallet<T>(_);
```

### IP2: Missing Authorization khi Dispatch qua pallet

Khi pallet A dispatch một call vào pallet B, origin được passed có thể không được expect:

```rust
// Pallet A dispatch một call với Signed origin
pub fn trigger_b(origin: OriginFor<T>) -> DispatchResult {
    let _who = ensure_signed(origin)?;

    // Dispatch call vào pallet B với origin của pallet A — là Root!
    let call = pallet_b::Call::<T>::privileged_action {};
    call.dispatch_bypass_filter(
        frame_system::RawOrigin::Root.into() // ← NGUY HIỂM!
    )?;
    Ok(())
}
```

Nếu pallet A có thể được gọi bởi bất kỳ signed user nào, và pallet A dispatch `privileged_action` với Root origin, thì user có thể escalate privilege qua pallet A.

**Fix**: Dispatch với origin phù hợp, không escalate:
```rust
pub fn trigger_b(origin: OriginFor<T>) -> DispatchResult {
    let who = ensure_signed(origin)?;
    // Giữ nguyên Signed origin của user
    let call = pallet_b::Call::<T>::user_action {};
    call.dispatch_bypass_filter(
        frame_system::RawOrigin::Signed(who).into()
    )?;
    Ok(())
}
```

### IP3: Assumption Violation — Invariants bị phá vỡ cross-pallet

Pallet A assume rằng nếu `Registered[account] = true` thì account đó tồn tại trong pallet B. Nhưng pallet B có thể xóa account đó mà không notify pallet A:

```rust
// Pallet A:
pub fn do_registered_action(
    origin: OriginFor<T>,
) -> DispatchResult {
    let who = ensure_signed(origin)?;

    // Kiểm tra flag trong pallet A
    ensure!(Registered::<T>::get(&who), Error::<T>::NotRegistered);

    // Assume account tồn tại trong pallet B
    // NHƯNG pallet B có thể đã xóa account!
    let profile = pallet_b::Profiles::<T>::get(&who)
        .ok_or(Error::<T>::ProfileNotFound)?;  // ← Panic bởi assumption sai!

    // ...
    Ok(())
}
```

Trong Substrate, mỗi pallet quản lý state độc lập. Nếu pallet B có `deregister` extrinsic xóa profile mà không clean up `Registered` flag của pallet A → inconsistent state.

**Fix pattern 1**: Sử dụng hooks để notify pallets khác:
```rust
// Pallet B implement hook để notify khi account bị xóa
pub trait OnAccountDeregistered<AccountId> {
    fn on_deregistered(account: &AccountId);
}

// Pallet A subscribe vào hook này
impl<T: Config> OnAccountDeregistered<T::AccountId> for Pallet<T> {
    fn on_deregistered(account: &T::AccountId) {
        Registered::<T>::remove(account);
    }
}

// Pallet B gọi hook khi deregister
pub fn deregister(origin: OriginFor<T>) -> DispatchResult {
    let who = ensure_signed(origin)?;
    pallet_b::Profiles::<T>::remove(&who);
    T::OnAccountDeregistered::on_deregistered(&who); // notify pallets khác
    Ok(())
}
```

**Fix pattern 2**: Lazy validation — validate existence tại thời điểm dùng, không dùng cached flags:
```rust
pub fn do_registered_action(origin: OriginFor<T>) -> DispatchResult {
    let who = ensure_signed(origin)?;
    // Validate từ nguồn thực tế, không dùng cached flag
    let profile = pallet_b::Profiles::<T>::get(&who)
        .ok_or(Error::<T>::NotRegistered)?;
    // ...
}
```

### IP4: Callback Anti-Pattern — Re-entrancy qua Hooks

Substrate không có re-entrancy theo nghĩa EVM, nhưng có "re-entrancy" via hooks khi pallet A trigger hook → pallet B handle → pallet B gọi lại pallet A:

```rust
// Pallet A — tạo position, trigger hook
pub fn open_position(origin: OriginFor<T>, amount: T::Balance) -> DispatchResult {
    let who = ensure_signed(origin)?;

    // Lock tokens
    T::Currency::reserve(&who, amount)?;

    // Lưu position
    Positions::<T>::insert(&who, PositionData { amount, is_active: true });

    // Trigger hook — notify oracle hoặc liquidator
    T::PositionHook::on_position_opened(&who, amount); // ← Hook có thể gọi lại pallet A!

    Ok(())
}
```

Nếu `T::PositionHook::on_position_opened` implementation trong runtime gọi `close_position` của pallet A (ví dụ: ngay lập tức liquidate), và `close_position` không kiểm tra state đúng cách, có thể xảy ra double-close.

**Nguyên tắc**: Emit event thay vì gọi hooks ngay lập tức. Xử lý cross-pallet logic asynchronously hoặc trong block tiếp theo.

---

## Audit Pattern — Inter-Pallet Dependencies

```bash
# 1. Tìm tight coupling (Config extend Config của pallet khác)
rg 'Config: .*pallet_\|: .*::Config' pallets/ --type rust | grep -v 'frame_system'

# 2. Tìm cross-pallet storage access trực tiếp (ngoài trait methods)
rg 'pallet_\w+::\w+::<T>::' pallets/ --type rust | grep -v 'Pallet::'

# 3. Tìm dispatch với elevated origin (Root) trong pallet
rg 'RawOrigin::Root\|dispatch_bypass_filter' pallets/ --type rust

# 4. Tìm hook patterns có thể gây callback
rg 'type \w*Hook\*: \|on_\w*_handler\|callback' pallets/ --type rust
```

Khi tìm thấy cross-pallet interaction, hỏi:
- Pallet A có giả định gì về state của pallet B?
- Nếu pallet B thay đổi state đó mà không notify, điều gì xảy ra với pallet A?
- Origin nào được pass khi dispatch? Có bị escalate không?
- Hook có thể tạo circular dependency không?

---

## Summary — Key Takeaways

- **Loose coupling** (qua traits) an toàn hơn tight coupling (kế thừa Config) vì chỉ expose interface cần thiết.
- **Storage key collision**: hai pallets cùng tên trong `construct_runtime!` có thể overwrite nhau — cần explicit prefix.
- **Origin escalation**: không dispatch với Root origin từ extrinsic có thể gọi bởi signed user.
- **Invariant violations**: pallet A không thể assume state của pallet B. Dùng hooks hoặc lazy validation.
- **Callback anti-pattern**: hooks có thể tạo circular calls — prefer events over synchronous callbacks.

---

## References

- Substrate Pallet Coupling docs — docs.substrate.io/build/pallet-coupling
- Tetcoin Recipes — Tightly and Loosely Coupled Pallets — core.tetcoin.org/recipes/pallet-coupling.html
- MixBytes Substrate Audit Guide — mixbytes.io/blog/audit-of-substrate-pallets-overview-tips
