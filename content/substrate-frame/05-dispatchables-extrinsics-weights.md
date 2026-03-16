---
title: "05. Dispatchables, Extrinsics & Weights"
tags: [blockchain, substrate, frame, extrinsic, weight, dispatch, lesson-05]
aliases: [Dispatchables Extrinsics Weights]
created: 2026-03-16
---

> **Prerequisites**: [[03-pallet-anatomy|03. Pallet Anatomy]], [[04-storage-in-frame|04. Storage trong FRAME]]
> **Objectives**:
> - Phân biệt ba loại extrinsic: signed, unsigned, inherent
> - Viết dispatchable đúng chuẩn: origin check → validate → mutate → emit
> - Hiểu Weight là gì và tại sao quan trọng
> - Nắm `DispatchResult` vs `DispatchResultWithPostInfo`
> - Biết dùng `ensure!`, `checked_*`, `saturating_*` để xử lý lỗi và overflow an toàn

---

## Extrinsic là gì?

Trong Substrate, bất cứ thứ gì đến từ bên ngoài runtime và thay đổi state đều được gọi là **extrinsic** (ngoại lai). Đây là khái niệm rộng hơn "transaction" trong Ethereum.

> [!definition] Definition 5.1 — Ba loại Extrinsic
>
> | Loại | Ký bởi | Origin | Khi nào dùng |
> |------|--------|--------|-------------|
> | **Signed** | User key pair | `RawOrigin::Signed(AccountId)` | Giao dịch thông thường — chuyển token, gọi hàm |
> | **Unsigned** | Không ký | `RawOrigin::None` | Off-chain workers, oracle price feeds — không tốn phí nhưng cần `ValidateUnsigned` |
> | **Inherent** | Block author | `RawOrigin::None` | Dữ liệu block author inject vào — timestamp, uncle blocks |

**So sánh với Ethereum**: Ethereum chỉ có một loại "transaction" tương đương Signed extrinsic. Unsigned và Inherent không có tương đương trực tiếp trong Ethereum.

---

## Dispatchable — Hàm được gọi từ Extrinsic

Mỗi function trong `#[pallet::call]` là một **dispatchable** — có thể được gọi từ bên ngoài qua extrinsic.

### Cấu trúc chuẩn 5 bước

```rust
#[pallet::call_index(0)]
#[pallet::weight(T::WeightInfo::my_function())]
pub fn my_function(
    origin: OriginFor<T>,
    param1: SomeType,
    param2: AnotherType,
) -> DispatchResult {
    // 1. Xác thực origin
    let who = ensure_signed(origin)?;

    // 2. Validate inputs và điều kiện
    ensure!(param1 > 0, Error::<T>::InvalidParam);
    ensure!(MyStorage::<T>::contains_key(&who), Error::<T>::NotFound);

    // 3. Tính toán / business logic (safe arithmetic)
    let new_value = param1.checked_add(param2)
        .ok_or(ArithmeticError::Overflow)?;

    // 4. Mutate state
    MyStorage::<T>::insert(&who, new_value);

    // 5. Emit event
    Self::deposit_event(Event::MyFunctionCalled { who, new_value });

    Ok(())
}
```

Thứ tự 5 bước này là convention chuẩn. Quan trọng: **check trước, write sau** — tránh partial state update nếu một điều kiện sau thất bại.

---

## Origin — Xác thực danh tính người gọi

> [!definition] Definition 5.2 — Origin Checks
>
> ```rust
> let who: T::AccountId = ensure_signed(origin)?;
> ensure_root(origin)?;
> let maybe_who = ensure_signed_or_root(origin)?;
> ensure_none(origin)?;
> ```
>
> | Helper | Chấp nhận | Trả về |
> |--------|----------|--------|
> | `ensure_signed` | Tài khoản ký | `T::AccountId` |
> | `ensure_root` | Root (sudo/governance) | `()` |
> | `ensure_signed_or_root` | Cả hai | `Option<T::AccountId>` |
> | `ensure_none` | Không có signer | `()` |

`ensure_signed(origin)?` — dấu `?` propagate lỗi `BadOrigin` nếu extrinsic không được ký.

**So sánh với Solidity**: `ensure_signed` → `msg.sender`. `ensure_root` → `onlyOwner` modifier, nhưng "owner" là toàn bộ governance của chain, không phải một address duy nhất.

**Khi nào cần `ensure_root`?** Các thao tác admin: nâng cấp runtime, set thông số hệ thống, khởi tạo dữ liệu genesis. Trong development, `pallet_sudo` cung cấp Root origin. Trong production, phải đi qua governance vote.

---

## `ensure!` Macro

```rust
ensure!(condition, Error::<T>::ErrorVariant);
// Tương đương:
if !condition {
    return Err(Error::<T>::ErrorVariant.into());
}
```

Dùng `ensure!` cho mọi điều kiện tiên quyết trước khi mutate state. Pattern này đảm bảo nếu bất kỳ check nào thất bại, không có gì được ghi vào storage.

---

## Arithmetic an toàn

Trong runtime Wasm, integer overflow **không panic** mà wrap around — đây là lỗ hổng bảo mật nghiêm trọng nếu không xử lý.

> [!definition] Definition 5.3 — Safe Arithmetic
>
> | Method | Hành vi khi overflow | Khi nào dùng |
> |--------|---------------------|-------------|
> | `.checked_add(x)` | Trả `None` | Khi muốn propagate lỗi |
> | `.saturating_add(x)` | Trả `MAX` | Counter, metric — không bao giờ wrap |
> | `.wrapping_add(x)` | Wrap around | Hiếm dùng trong business logic |

```rust
// checked — propagate lỗi
let new_balance = balance
    .checked_add(amount)
    .ok_or(ArithmeticError::Overflow)?;

let remaining = balance
    .checked_sub(amount)
    .ok_or(ArithmeticError::Underflow)?;

// saturating — đơn giản hơn, không lỗi
let new_count = count.saturating_add(1u32);
```

**Quy tắc**: Không bao giờ dùng `+`, `-` thuần túy với integer trong runtime code. Luôn dùng `checked_*` hoặc `saturating_*`.

---

## Weight — Đơn vị đo chi phí thực thi

> [!definition] Definition 5.4 — Weight
> Weight là đơn vị đo **tài nguyên** mà một extrinsic tiêu thụ. Gồm hai chiều:
>
> - **`ref_time`**: thời gian tính toán (picoseconds)
> - **`proof_size`**: kích thước storage proof (bytes) — quan trọng cho parachain PoV
>
> Tổng weight tất cả extrinsics trong một block không được vượt `BlockWeights::max_block`.

```rust
// Weight cố định — đơn giản nhất, dùng cho dev/demo
#[pallet::weight(Weight::from_parts(10_000, 64))]
pub fn simple_fn(origin: OriginFor<T>) -> DispatchResult { ... }

// Weight từ benchmarking — production-ready
#[pallet::weight(T::WeightInfo::my_function())]
pub fn my_function(origin: OriginFor<T>) -> DispatchResult { ... }

// Weight = 0 — chỉ dùng trong test/dev
#[pallet::weight(0)]
pub fn dev_fn(origin: OriginFor<T>) -> DispatchResult { ... }
```

**Weight và phí giao dịch**: `pallet_transaction_payment` tính phí = `base_fee + weight_fee + length_fee`. Bạn kiểm soát phí bằng cách kiểm soát weight.

**Tại sao Weight quan trọng?** Weight quá thấp → DoS vector: kẻ tấn công gửi nhiều call rẻ tiền, làm node quá tải. Weight quá cao → người dùng trả phí oan. Trong production cần **benchmarking** để đo chính xác.

**So sánh với Solidity**: `gas` trong Ethereum tương tự weight, nhưng Substrate tách rõ `ref_time` (CPU) và `proof_size` (bandwidth), trong khi Ethereum gas gộp tất cả.

---

## `DispatchResult` vs `DispatchResultWithPostInfo`

> [!definition] Definition 5.5 — Return types
>
> **`DispatchResult`** = `Result<(), DispatchError>`
> Dùng khi weight khai báo cố định. Trường hợp thông thường.
>
> **`DispatchResultWithPostInfo`** = `Result<PostDispatchInfo, DispatchErrorWithPostInfo>`
> Dùng khi muốn **refund weight** sau khi thực thi — vì bạn khai báo worst-case weight nhưng thực tế nhanh hơn.

```rust
// Trường hợp thông thường
pub fn simple_call(origin: OriginFor<T>) -> DispatchResult {
    let _ = ensure_signed(origin)?;
    Ok(())
}

// Refund weight — khai báo 50_000 nhưng hoàn lại nếu không làm gì
pub fn conditional_call(
    origin: OriginFor<T>,
    do_work: bool,
) -> DispatchResultWithPostInfo {
    let _ = ensure_signed(origin)?;
    if do_work {
        Ok(().into())   // dùng hết weight đã khai báo
    } else {
        Ok(Some(Weight::from_parts(1_000, 0)).into())   // refund phần còn lại
    }
}
```

---

## `Pays::No` — Miễn phí

```rust
// Extrinsic không thu phí — dùng cho inherent hoặc incentivized calls
#[pallet::weight((0, DispatchClass::Normal, Pays::No))]
pub fn report_bad_behavior(origin: OriginFor<T>) -> DispatchResult {
    ensure_none(origin)?;
    Ok(())
}
```

`Pays::No` → không thu phí dù weight có giá trị. Dùng cho inherents và unsigned extrinsics muốn khuyến khích người dùng gọi (ví dụ: báo cáo validator gian lận).

---

## Ví dụ hoàn chỉnh — Pallet Transfer với đầy đủ best practices

```rust
#[pallet::call]
impl<T: Config> Pallet<T> {
    /// Chuyển token từ tài khoản gọi sang tài khoản đích.
    ///
    /// Emits `Transferred` khi thành công.
    #[pallet::call_index(0)]
    #[pallet::weight(T::WeightInfo::transfer())]
    pub fn transfer(
        origin: OriginFor<T>,
        dest: T::AccountId,
        #[pallet::compact] amount: u128,
    ) -> DispatchResult {
        // 1. Origin
        let sender = ensure_signed(origin)?;

        // 2. Validate
        ensure!(sender != dest, Error::<T>::SelfTransfer);
        let sender_balance = Balances::<T>::get(&sender);
        ensure!(sender_balance >= amount, Error::<T>::InsufficientBalance);

        // 3. Compute (safe arithmetic)
        let new_sender = sender_balance
            .checked_sub(amount)
            .ok_or(ArithmeticError::Underflow)?;
        let new_dest = Balances::<T>::get(&dest)
            .checked_add(amount)
            .ok_or(ArithmeticError::Overflow)?;

        // 4. Mutate
        Balances::<T>::insert(&sender, new_sender);
        Balances::<T>::insert(&dest, new_dest);

        // 5. Event
        Self::deposit_event(Event::Transferred { from: sender, to: dest, amount });

        Ok(())
    }
}
```

`#[pallet::compact]` trên tham số `amount` — nén số nguyên lớn trong SCALE encoding, giảm kích thước extrinsic khi số nhỏ (tương tự ULEB128).

---

## `DispatchError` — Các loại lỗi hệ thống

| `DispatchError` variant | Ý nghĩa |
|------------------------|---------|
| `BadOrigin` | Origin không đúng loại |
| `Module(ModuleError)` | Lỗi từ pallet — bao gồm `Error::<T>::*` |
| `Arithmetic(ArithmeticError)` | Overflow, Underflow, DivisionByZero |
| `Token(TokenError)` | NoFunds, BelowMinimum, CannotCreate... |
| `Exhausted` | Resource exhausted |

`Error::<T>::MyVariant.into()` tự động convert thành `DispatchError::Module(...)`.

---

## Summary / Key Takeaways

- Ba loại extrinsic: **Signed** (phổ biến), **Unsigned** (OCW), **Inherent** (block author)
- Quy trình 5 bước: origin check → `ensure!` validate → safe compute → mutate storage → emit event
- `ensure!(cond, Error)` → check-before-write, tránh partial update
- **Không bao giờ** dùng `+`/`-` thuần túy — luôn dùng `checked_*` hoặc `saturating_*`
- **Weight** = ref_time + proof_size → quyết định phí, giới hạn block capacity
- `DispatchResult` cho weight cố định; `DispatchResultWithPostInfo` khi refund weight
- `#[pallet::compact]` nén số nguyên trong extrinsic encoding
- `Pays::No` → miễn phí giao dịch (dùng cho inherent / incentivized calls)

---

## References

- FRAME Origin Reference — https://paritytech.github.io/polkadot-sdk/master/polkadot_sdk_docs/reference_docs/frame_origin/index.html
- Build a Custom Pallet — https://docs.polkadot.com/tutorials/polkadot-sdk/parachains/zero-to-hero/build-custom-pallet/
- Benchmarking FRAME Pallets — https://docs.polkadot.com/develop/parachains/testing/benchmarking/
- `DispatchError` docs — https://docs.rs/sp-runtime/latest/sp_runtime/enum.DispatchError.html
- Your First Pallet Guide — https://paritytech.github.io/polkadot-sdk/master/polkadot_sdk_docs/guides/your_first_pallet/index.html
