---
title: "08. Unsigned Tx Validation"
tags: [security, substrate, frame, unsigned, validate-unsigned, replay-attack, dos, lesson-08]
aliases: [Unsigned Tx Validation]
created: 2026-03-16
---

> **Prerequisites**: [[02-extrinsics-and-dispatch|02. Extrinsics & Dispatch]] — biết 3 loại extrinsic, unsigned extrinsics không có fee
> **Objectives**:
> - Hiểu `ValidateUnsigned` trait và cách nó bảo vệ unsigned extrinsics
> - Nắm `ValidTransaction` struct: priority, longevity, provides/requires
> - Phân loại các lỗi validate_unsigned: thiếu hoàn toàn, validate lỏng lẻo, replay không chặn
> - Biết cách audit unsigned extrinsic đúng cách

---

## Motivation

Unsigned extrinsic không có chữ ký → không có fee → bất kỳ ai có thể gửi miễn phí. Đây là thiết kế có chủ ý (ví dụ: off-chain workers gửi dữ liệu on-chain mà không cần tài khoản), nhưng đi kèm **yêu cầu bắt buộc**: runtime phải tự validate rằng transaction đó hợp lệ.

Nếu `validate_unsigned` được implement sai (hoặc thiếu), attacker có thể:

- **Spam** transaction pool và block với unsigned transactions chi phí bằng 0
- **Replay** cùng một transaction nhiều lần trong các block khác nhau
- **Spoof dữ liệu** từ off-chain workers bằng cách gửi unsigned transaction với data giả

Trail of Bits coi đây là vulnerability class đặc biệt nghiêm trọng vì nó bypass hoàn toàn lớp bảo vệ kinh tế (fee mechanism).

---

## `ValidateUnsigned` Trait

Mỗi pallet có unsigned extrinsic phải implement `ValidateUnsigned`:

```rust
// Được khai báo trong construct_runtime!
impl pallet_my_module::ValidateUnsigned for Runtime {
    // ...
}

// Và trong pallet:
#[pallet::validate_unsigned]
impl<T: Config> ValidateUnsigned for Pallet<T> {
    type Call = Call<T>;

    fn validate_unsigned(
        _source: TransactionSource,
        call: &Self::Call,
    ) -> TransactionValidity {
        // Logic validation ở đây
    }
}
```

> [!warning] `ValidateUnsigned` phải được register trong `construct_runtime!`
> Nếu pallet có `#[pallet::validate_unsigned]` nhưng không được liệt kê trong `construct_runtime!`, unsigned validation không được gọi → tất cả unsigned transactions bị reject mặc định. Đây không phải bug bảo mật mà là bug chức năng, nhưng cần biết khi audit.

---

## `ValidTransaction` struct

Khi transaction hợp lệ, `validate_unsigned` trả về `Ok(ValidTransaction)`:

```rust
pub struct ValidTransaction {
    pub priority: TransactionPriority, // u64 — ưu tiên trong pool
    pub requires: Vec<TransactionTag>, // các tags phải được provide trước
    pub provides: Vec<TransactionTag>, // tags transaction này provide
    pub longevity: TransactionLongevity, // u64 — số block còn hiệu lực
    pub propagate: bool,               // có broadcast sang peer không
}
```

### `provides` — Cơ chế chống replay

`provides` là field **quan trọng nhất** cho bảo mật unsigned transactions. Transaction pool chỉ chấp nhận **một** transaction cho mỗi tag trong `provides`. Nếu một transaction với cùng `provides` tag đã tồn tại trong pool, transaction mới bị reject.

```rust
// Đúng — provides tag unique theo (block_number, who)
ValidTransaction::with_tag_prefix("MyPallet")
    .priority(100)
    .and_provides((block_number, who).encode()) // unique per block per account
    .longevity(3)
    .build()
```

```rust
// SAI — provides tag constant → chỉ một transaction được chấp nhận mãi mãi!
ValidTransaction::with_tag_prefix("MyPallet")
    .priority(100)
    .and_provides(b"constant_tag") // KHÔNG unique → replay protection quá mạnh
    .longevity(3)
    .build()
```

```rust
// CỰC KỲ NGUY HIỂM — không có provides → không có deduplication → spam được!
Ok(ValidTransaction {
    priority: 0,
    requires: vec![],
    provides: vec![],  // ← EMPTY!
    longevity: 10,
    propagate: true,
})
```

### `longevity` — Thời gian hiệu lực

`longevity` là số block mà transaction còn được coi là hợp lệ. Sau `longevity` blocks, transaction bị xóa khỏi pool.

```rust
// Tốt — short longevity: 5 blocks
.longevity(5)

// Nguy hiểm — infinite longevity: transaction sống mãi trong pool
.longevity(TransactionLongevity::MAX) // = u64::MAX
// Kết hợp với empty provides → có thể flood pool
```

---

## Vulnerability Classes

### UV1: Thiếu `validate_unsigned` hoàn toàn

```rust
// VULNERABLE — pallet có unsigned extrinsic nhưng không implement ValidateUnsigned
#[pallet::call]
impl<T: Config> Pallet<T> {
    #[pallet::weight(10_000)]
    pub fn submit_price(
        origin: OriginFor<T>,
        price: u64,
    ) -> DispatchResult {
        ensure_none(origin)?;  // chấp nhận unsigned
        Price::<T>::put(price);
        Ok(())
    }
    // Không có ValidateUnsigned implementation!
}
```

**Hậu quả**: Nếu pallet được registered với `ValidateUnsigned` trong `construct_runtime!`, mọi unsigned transaction đến `submit_price` đều được chấp nhận. Attacker có thể set price tùy ý miễn phí.

### UV2: `validate_unsigned` không kiểm tra call variant

```rust
// VULNERABLE — accept tất cả calls, không filter theo function
fn validate_unsigned(_source: TransactionSource, _call: &Self::Call) -> TransactionValidity {
    // Chỉ trả về valid mà không kiểm tra call là gì!
    Ok(ValidTransaction {
        priority: 100,
        requires: vec![],
        provides: vec![b"any".to_vec()],
        longevity: 10,
        propagate: true,
    })
}
```

Pallet có nhiều unsigned extrinsics; chỉ một vài cái trong số đó là intended để unsigned. Validate không filter → tất cả calls (kể cả những cái không nên unsigned) đều được chấp nhận.

```rust
// FIX — match cụ thể từng call
fn validate_unsigned(_source: TransactionSource, call: &Self::Call) -> TransactionValidity {
    match call {
        Call::submit_price { block_number, price } => {
            // validate logic cho call này
            Self::validate_submit_price(*block_number, *price)
        }
        // Tất cả calls khác: reject
        _ => InvalidTransaction::Call.into(),
    }
}
```

### UV3: Thiếu `provides` → replay attack

```rust
// VULNERABLE — không có provides tag → transaction có thể replay nhiều lần
fn validate_unsigned(_source: TransactionSource, call: &Self::Call) -> TransactionValidity {
    if let Call::submit_heartbeat { validator_id } = call {
        // validate validator_id...
        Ok(ValidTransaction {
            priority: 100,
            requires: vec![],
            provides: vec![],  // ← EMPTY! → cùng heartbeat có thể submit nhiều lần!
            longevity: 5,
            propagate: true,
        })
    } else {
        InvalidTransaction::Call.into()
    }
}

// FIX — provides tag unique
fn validate_unsigned(_source: TransactionSource, call: &Self::Call) -> TransactionValidity {
    if let Call::submit_heartbeat { validator_id, block_number } = call {
        Ok(ValidTransaction::with_tag_prefix("ImOnline")
            .priority(100)
            .and_provides((validator_id, block_number))  // unique per validator per block
            .longevity(5)
            .build()
        )
    } else {
        InvalidTransaction::Call.into()
    }
}
```

### UV4: `validate_unsigned` không check cùng điều kiện với `pre_dispatch`

Một issue tinh tế và quan trọng: `validate_unsigned` được gọi ở **transaction pool** (trước khi vào block). `pre_dispatch_unsigned` được gọi khi **block execution** (khi apply extrinsic). Hai hàm này phải check cùng điều kiện, nếu không:

```rust
// VULNERABLE — validate check block_number nhưng pre_dispatch không
fn validate_unsigned(_source: TransactionSource, call: &Self::Call) -> TransactionValidity {
    if let Call::submit_data { block_number, data } = call {
        ensure!(
            *block_number == frame_system::Pallet::<T>::block_number(),
            InvalidTransaction::Stale
        );
        // ...
    }
}

fn pre_dispatch(call: &Self::Call) -> Result<(), TransactionValidityError> {
    // THIẾU: không check block_number!
    // Transaction có thể được included vào block khác với block_number sai
    Ok(())
}
```

Theo Substrate docs: `pre_dispatch` phải validate **những gì đã được check trong validate** và thêm bất kỳ stateful check nào cần state hiện tại.

```rust
// FIX — cả hai check cùng điều kiện
fn pre_dispatch(call: &Self::Call) -> Result<(), TransactionValidityError> {
    match call {
        Call::submit_data { block_number, data } => {
            if *block_number != frame_system::Pallet::<T>::block_number() {
                return Err(InvalidTransaction::Stale.into());
            }
            // ...
            Ok(())
        }
        _ => Err(InvalidTransaction::Call.into()),
    }
}
```

### UV5: `TransactionSource` không được sử dụng

`validate_unsigned` nhận `TransactionSource` cho biết transaction đến từ đâu:

```rust
pub enum TransactionSource {
    InBlock,    // block đang được import/validate
    Local,      // gửi từ local node (off-chain worker)
    External,   // đến từ peer node
}
```

Với off-chain worker pattern, chỉ `Local` transactions nên được chấp nhận — `External` có thể là spoofed:

```rust
// Tốt hơn — filter theo source
fn validate_unsigned(source: TransactionSource, call: &Self::Call) -> TransactionValidity {
    // Chỉ accept từ local OCW hoặc đang in block
    let is_valid_source = matches!(
        source,
        TransactionSource::Local | TransactionSource::InBlock
    );
    ensure!(is_valid_source, InvalidTransaction::Call);

    // ... rest of validation
}
```

> [!warning] `TransactionSource::InBlock` phải luôn được chấp nhận
> Khi một block đang được import và validated, transactions trong block có source = `InBlock`. Nếu bạn reject `InBlock`, node sẽ không thể sync với chain vì mọi block chứa unsigned transaction đó đều bị reject.

---

## Ví dụ đúng — Off-chain Worker Pattern

Pattern hoàn chỉnh cho off-chain worker gửi unsigned transaction:

```rust
#[pallet::validate_unsigned]
impl<T: Config> ValidateUnsigned for Pallet<T> {
    type Call = Call<T>;

    fn validate_unsigned(
        source: TransactionSource,
        call: &Self::Call,
    ) -> TransactionValidity {
        // 1. Filter theo call variant
        let (block_number, data, signature) =
            if let Call::submit_ocw_data { block_number, data, signature } = call {
                (block_number, data, signature)
            } else {
                return InvalidTransaction::Call.into();
            };

        // 2. Filter theo source (optional nhưng recommended)
        if !matches!(source, TransactionSource::Local | TransactionSource::InBlock) {
            return InvalidTransaction::BadSigner.into();
        }

        // 3. Verify cryptographic signature (nếu dùng signed payload)
        let expected_signer = Self::get_authorized_ocw_key();
        if !signature.verify(data.as_ref(), &expected_signer) {
            return InvalidTransaction::BadProof.into();
        }

        // 4. Check data freshness
        let current_block = frame_system::Pallet::<T>::block_number();
        if *block_number != current_block {
            return InvalidTransaction::Stale.into();
        }

        // 5. Build ValidTransaction với unique provides tag
        ValidTransaction::with_tag_prefix("MyOCW")
            .priority(T::UnsignedPriority::get())
            .and_provides((block_number, expected_signer)) // unique per block
            .longevity(3) // hết hạn sau 3 block nếu không được include
            .propagate(true)
            .build()
    }
}
```

---

## Audit Checklist — Unsigned Transactions

```bash
# 1. Tìm tất cả ensure_none trong pallets
rg 'ensure_none' pallets/ --type rust

# 2. Kiểm tra xem pallet có implement ValidateUnsigned không
rg 'ValidateUnsigned\|validate_unsigned' pallets/ --type rust

# 3. Kiểm tra provides trong ValidTransaction
rg 'and_provides\|provides:' pallets/ --type rust

# 4. Tìm ValidTransaction với empty provides (cực kỳ nguy hiểm)
rg 'provides: vec!\[\]' pallets/ --type rust
```

Với mỗi `ensure_none` tìm thấy, hỏi:
- Pallet có implement `ValidateUnsigned` không?
- `validate_unsigned` có match cụ thể call variant không?
- Có `provides` tag không? Tag có unique không?
- `pre_dispatch` có check cùng điều kiện với `validate_unsigned` không?

---

## Summary — Key Takeaways

- **Unsigned extrinsic = không có fee** → cần `ValidateUnsigned` để thay thế kinh tế bảo vệ.
- **`ValidTransaction`** gồm 5 field: `priority`, `requires`, `provides`, `longevity`, `propagate`.
- **`provides`** là field quan trọng nhất: tag unique → chống replay và spam.
- **5 lỗi phổ biến**: thiếu ValidateUnsigned, không filter call, empty provides, validate/pre_dispatch không nhất quán, bỏ qua TransactionSource.
- **`InBlock` source phải được chấp nhận** để node sync được với chain.
- **`pre_dispatch`** phải lặp lại tất cả checks của `validate_unsigned` cộng stateful checks.

---

## References

- Trail of Bits "Not So Smart Pallets — Unsigned Transaction Validation" — secure-contracts.com/not-so-smart-contracts/substrate/validate_unsigned
- Building Secure Contracts README — github.com/crytic/building-secure-contracts/tree/master/not-so-smart-contracts/substrate/validate_unsigned
- Substrate transaction_validity.rs — github.com/paritytech/substrate/blob/master/primitives/runtime/src/transaction_validity.rs
- Substrate issue #3091 — "Unsigned transactions not validated during apply_extrinsic" — github.com/paritytech/substrate/issues/3091
