---
title: "02. Extrinsics & Dispatch"
tags: [security, substrate, frame, extrinsic, dispatch, lesson-02]
aliases: [Extrinsics and Dispatch]
created: 2026-03-16
---

> **Prerequisites**: [[01-frame-architecture|01. FRAME Architecture]] — biết pallet là gì, `#[pallet::call]`, `DispatchResult`
> **Objectives**:
> - Phân biệt 3 loại extrinsic: Signed, Unsigned, Inherent
> - Hiểu toàn bộ dispatch pipeline từ transaction pool đến storage commit
> - Nắm được `DispatchError`, `DispatchResult`, fee model
> - Nhận ra điểm nào trong pipeline có thể bị khai thác

---

## Motivation

Khi attacker muốn khai thác một pallet, họ làm điều đó thông qua **extrinsic** — đơn vị tương tác duy nhất từ bên ngoài vào runtime. Nếu không hiểu extrinsic đi qua những bước nào trước khi được thực thi, bạn sẽ bỏ lỡ toàn bộ lớp bảo vệ (và các điểm yếu) giữa "user gửi transaction" và "storage thay đổi".

Lesson này trả lời câu hỏi: **Một transaction đi từ đâu, qua đâu, và dừng ở đâu?**

---

## 3 loại Extrinsic

Substrate định nghĩa 3 loại extrinsic, mỗi loại có threat model khác nhau:

> [!info] Định nghĩa — Extrinsic
> **Extrinsic** (xuất phát từ "external") là bất kỳ thông tin nào đến từ ngoài runtime và được đưa vào block. Trong thực tế thường đồng nghĩa với "transaction", nhưng có 3 dạng cụ thể.

### Loại 1 — Signed Extrinsic (Transaction thông thường)

Đây là dạng phổ biến nhất. User ký transaction bằng private key, node verify signature trước khi xử lý.

```rust
// Gọi từ client (ví dụ Polkadot.js):
// alice.tx.pallet_aggregate.submit_proof(proof_hash).signAndSend(alice)

// Trong pallet — luôn bắt đầu bằng ensure_signed:
pub fn submit_proof(
    origin: OriginFor<T>,
    proof_hash: T::Hash,
) -> DispatchResult {
    let who = ensure_signed(origin)?;  // <-- verify signature, trả về AccountId
    // ...
}
```

**Đặc điểm bảo mật**:
- Phải có chữ ký hợp lệ → có thể xác định được caller
- Caller bị trừ **fee** (dù extrinsic thất bại)
- Có **nonce** → chống replay attack
- Signature được verify **ở tầng transaction pool**, trước khi vào runtime

### Loại 2 — Unsigned Extrinsic

Không có chữ ký. Được dùng cho các hành động mà validator node thực hiện tự động (off-chain workers), hoặc các hành động không cần "ai đó" chịu trách nhiệm.

```rust
// Trong pallet — kiểm tra bằng ensure_none:
pub fn submit_heartbeat(
    origin: OriginFor<T>,
    heartbeat: Heartbeat<T::BlockNumber>,
) -> DispatchResult {
    ensure_none(origin)?;  // <-- verify origin là None (unsigned)
    // Logic validate phải ở validate_unsigned (Lesson 08)
    // ...
}
```

**Đặc điểm bảo mật**:
- **Không có signature** → **ai cũng gửi được miễn phí**
- **Không có fee** → vector DoS nếu không validate kỹ
- Runtime PHẢI implement `ValidateUnsigned` để filter hợp lệ/không hợp lệ
- **Đây là một trong những attack surface nguy hiểm nhất** (Lesson 08)

### Loại 3 — Inherent Extrinsic

Chỉ được đưa vào block bởi **block author** (validator/collator), không từ transaction pool. Dùng cho dữ liệu hệ thống: timestamp, randomness seed, parachain data.

```rust
// Trong pallet_timestamp:
pub fn set(
    origin: OriginFor<T>,
    now: T::Moment,
) -> DispatchResult {
    ensure_none(origin)?;  // origin là None — chỉ block author gửi được
    // ...
}
```

**Đặc điểm bảo mật**:
- Block author phải cung cấp inherent data đúng protocol
- Các node khác verify inherent khi validate block
- Nếu inherent thiếu hoặc sai → block bị reject

### So sánh tổng hợp

| | Signed | Unsigned | Inherent |
|--|--------|----------|---------|
| Chữ ký | Bắt buộc | Không | Không |
| Fee | Có (luôn) | Không | Không |
| Nonce | Có | Không | Không |
| Ai gửi được | Bất kỳ user | Bất kỳ (nếu qua validate) | Chỉ block author |
| Nguồn gốc | Transaction pool | Transaction pool | InherentData |
| Risk level | Thấp hơn | **Cao** | Phụ thuộc implementation |

---

## Dispatch Pipeline — Từng bước

Đây là toàn bộ hành trình của một **Signed Extrinsic** từ user đến storage:

```
[User / Client]
      │  signed transaction bytes (SCALE encoded)
      ▼
[Transaction Pool]
      │  1. Decode transaction
      │  2. Verify signature (sp_runtime::verify_encoded_lazy)
      │  3. Check nonce: account nonce matches?
      │  4. Check balance: có đủ fee không?
      │  5. Gọi validate() của SignedExtension chain
      │  6. Nếu pass → giữ trong pool, broadcast
      ▼
[Block Author — Authorship]
      │  7. Chọn transactions từ pool (ưu tiên theo fee/priority)
      │  8. Kiểm tra block weight limit chưa đầy
      ▼
[Block Execution — Executive pallet]
      │  9.  on_initialize() của tất cả pallets
      │  10. Apply extrinsics theo thứ tự trong block:
      │       a. Deduct fee upfront (kể cả nếu thất bại)
      │       b. Gọi pre_dispatch() của SignedExtension
      │       c. Dispatch call vào pallet function
      │       d. Nếu Ok → commit state changes
      │       e. Nếu Err → rollback state (nhưng fee đã trừ)
      │       f. Gọi post_dispatch() của SignedExtension
      │  11. on_finalize() của tất cả pallets
      ▼
[State Root Commit]
      │  12. Tính state root mới
      │  13. Block được finalize và broadcast
```

> [!warning] Điểm critical: Fee được trừ TRƯỚC khi dispatch
> Ở bước 10a, fee bị trừ **ngay cả khi extrinsic sau đó trả về `Err`**. Đây là thiết kế có chủ ý — tránh spam bằng cách gửi transactions cố tình fail.
>
> **Hệ quả**: Nếu weight annotation sai (quá thấp), fee cũng sai → attacker có thể thực thi computation nặng với chi phí rẻ. (Lesson 05)

---

## `DispatchResult` và `DispatchError`

Mọi extrinsic function return `DispatchResult`, định nghĩa như sau:

```rust
pub type DispatchResult = Result<(), DispatchError>;
```

### DispatchError — Các loại lỗi

`DispatchError` là enum chứa tất cả các loại lỗi có thể xảy ra trong dispatch:

```rust
pub enum DispatchError {
    Other(&'static str),           // lỗi generic với string
    CannotLookup,                  // không thể lookup account
    BadOrigin,                     // origin sai (ensure_signed thất bại)
    Module(ModuleError),           // lỗi từ pallet cụ thể (Error<T> enum)
    ConsumerRemaining,             // còn consumer reference
    NoProviders,                   // thiếu provider reference
    TooManyConsumers,              // quá nhiều consumer
    Token(TokenError),             // lỗi liên quan token/balance
    Arithmetic(ArithmeticError),   // overflow, underflow, divide by zero
    Transactional(TransactionalError), // lỗi storage transaction
    Exhausted,                     // resource exhausted
    Corruption,                    // dữ liệu bị corrupt (nghiêm trọng)
    Unavailable,                   // resource không available
}
```

> [!info] `ModuleError` — Pallet-specific errors
> Khi bạn define `#[pallet::error] pub enum Error<T>` và return `Error::<T>::ProofNotFound`, Substrate tự động convert thành `DispatchError::Module(ModuleError { index, error, ... })`. Index là index của pallet trong `construct_runtime!`, error là index của variant trong enum.

> [!warning] `ArithmeticError` — Tại sao quan trọng
> Substrate có type riêng cho arithmetic errors:
> ```rust
> pub enum ArithmeticError {
>     Underflow,
>     Overflow,
>     DivisionByZero,
> }
> ```
> Dùng `checked_add().ok_or(ArithmeticError::Overflow)?` thay vì `+` trực tiếp là pattern đúng. Lesson 04 đào sâu vào điều này.

### Pattern return lỗi trong extrinsic

```rust
pub fn transfer(
    origin: OriginFor<T>,
    to: T::AccountId,
    amount: T::Balance,
) -> DispatchResult {
    let from = ensure_signed(origin)?;  // Err → DispatchError::BadOrigin

    ensure!(amount > T::Balance::zero(), Error::<T>::ZeroAmount);

    let from_balance = Balances::<T>::get(&from);
    let new_balance = from_balance
        .checked_sub(&amount)
        .ok_or(Error::<T>::InsufficientBalance)?;

    Balances::<T>::insert(&from, new_balance);
    Balances::<T>::mutate(&to, |b| *b += amount);

    Self::deposit_event(Event::Transferred { from, to, amount });
    Ok(())
}
```

---

## `DispatchResultWithPostInfo` — Điều chỉnh weight sau dispatch

Thường dùng khi computation thực tế khác với worst-case estimate:

```rust
pub fn do_work(
    origin: OriginFor<T>,
    items: Vec<u32>,
) -> DispatchResultWithPostInfo {
    let _ = ensure_signed(origin)?;

    let actual_items = items.len() as u64;

    // ... xử lý items ...

    Ok(Some(T::WeightInfo::do_work(actual_items)).into())
    // Trả về weight thực tế thay vì worst-case
    // → user được refund phần weight dư
}
```

> [!warning] Security issue: Underestimate actual weight
> Nếu function khai báo worst-case weight thấp hơn thực tế, block có thể bị overloaded. Attacker biết điều này có thể spam block với calls tốn nhiều compute hơn fee trả.

---

## SignedExtension — Lớp middleware của dispatch

`SignedExtension` là cơ chế cho phép thêm logic vào dispatch pipeline mà không sửa từng pallet. Substrate runtime thường cấu hình một chain gồm nhiều SignedExtensions:

```rust
pub type SignedExtra = (
    frame_system::CheckNonZeroSender<Runtime>,    // sender không phải zero
    frame_system::CheckSpecVersion<Runtime>,       // spec version match
    frame_system::CheckTxVersion<Runtime>,         // tx version match
    frame_system::CheckGenesis<Runtime>,           // genesis hash match
    frame_system::CheckEra<Runtime>,               // mortality (expiry)
    frame_system::CheckNonce<Runtime>,             // nonce tăng đúng
    frame_system::CheckWeight<Runtime>,            // block weight limit
    pallet_transaction_payment::ChargeTransactionPayment<Runtime>, // fee
);
```

Mỗi element trong tuple này implement 3 phương thức quan trọng:
- `validate()` — gọi ở transaction pool, kiểm tra nhanh
- `pre_dispatch()` — gọi trước khi thực thi, deduct fee
- `post_dispatch()` — gọi sau khi thực thi, refund excess fee

> [!warning] Security Relevance
> **`validate()` và `pre_dispatch()` phải check cùng điều kiện.** Nếu `validate()` chấp nhận transaction nhưng `pre_dispatch()` không, hoặc ngược lại → inconsistency có thể bị exploit.
>
> Unsigned extrinsic bypass toàn bộ `SignedExtra` pipeline — đây là lý do `ValidateUnsigned` phải làm tất cả validation tương đương.

---

## State Rollback — Khi extrinsic fail

Khi extrinsic trả về `Err`, Substrate **tự động rollback** tất cả storage changes của extrinsic đó. Đây là behavior mặc định từ `#[transactional]` annotation trên dispatcher.

```rust
// Scenario: 3 storage operations, operation thứ 2 fail

pub fn bad_example(origin: OriginFor<T>) -> DispatchResult {
    let who = ensure_signed(origin)?;

    Counter::<T>::mutate(|c| *c += 1);          // storage thay đổi #1
    Balances::<T>::insert(&who, 1000u32.into()); // storage thay đổi #2

    ensure!(false, Error::<T>::AlwaysFail);      // Err → ROLLBACK cả 2 changes

    Ok(())
}
```

> [!warning] `#[transactional]` không phải magic bullet
> Mặc định, mỗi extrinsic có implicit transactional boundary. Nhưng nếu code gọi **storage operations trong internal helper functions** mà không có `#[transactional]`, và helper đó fail sau khi commit một phần → partial state corruption.
>
> Pattern an toàn: tất cả validate trước, tất cả mutate sau (Lesson 07 — Verify First).

---

## Điểm tóm tắt về Security per Extrinsic Type

| Attack | Signed | Unsigned | Inherent |
|--------|--------|----------|---------|
| Replay attack | Chống được (nonce) | **Không chống được mặc định** | N/A |
| Spam / DoS | Fee ngăn chặn | **Phải validate trong `ValidateUnsigned`** | N/A |
| Identity spoof | Không (signature required) | **Không có identity** | Chỉ block author |
| Frontrunning | Có thể | Có thể | N/A |

---

## Summary — Key Takeaways

- **3 loại extrinsic**: Signed (user ký), Unsigned (không ký, cần ValidateUnsigned), Inherent (chỉ block author).
- **Dispatch pipeline**: Transaction Pool validate → Block Author chọn → Executive apply → State commit.
- **Fee trước, rollback sau**: Fee bị trừ kể cả khi extrinsic thất bại; nếu thành công, state commit; nếu fail, state rollback.
- **`DispatchResult` = `Result<(), DispatchError>`** — mọi extrinsic return kiểu này.
- **Unsigned extrinsic = attack surface lớn** vì không có fee và không có identity.
- **`SignedExtension` chain** là middleware kiểm tra nonce, fee, weight, expiry.

---

## References

- Substrate Executive pallet — github.com/paritytech/substrate/blob/master/frame/executive/src/lib.rs
- DispatchError docs — paritytech.github.io/substrate/master/frame_support/dispatch/enum.DispatchError.html
- Trail of Bits "Not So Smart Pallets — Unsigned Transaction Validation" — secure-contracts.com/not-so-smart-contracts/substrate/validate_unsigned
- MixBytes — "Audit of Substrate Pallets: Overview & Tips" — mixbytes.io/blog/audit-of-substrate-pallets-overview-tips
