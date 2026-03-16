---
title: "06. Don't Panic!"
tags: [security, substrate, frame, panic, dos, chain-halt, lesson-06]
aliases: [Dont Panic]
created: 2026-03-16
---

> **Prerequisites**: [[01-frame-architecture|01. FRAME Architecture]], [[02-extrinsics-and-dispatch|02. Extrinsics & Dispatch]]
> **Objectives**:
> - Hiểu tại sao panic trong runtime là vulnerability, không chỉ là bug
> - Phân loại tất cả nguồn panic trong Rust: `unwrap`, `expect`, array index, `panic!`, division, arithmetic
> - Phân biệt hành vi panic trong extrinsic vs hooks
> - Biết pattern an toàn thay thế cho từng nguồn panic

---

## Motivation

Trong một chương trình Rust thông thường, `panic` dừng process và in stack trace. Tệ, nhưng chỉ ảnh hưởng một chương trình.

Trong Substrate runtime: một `panic` trong extrinsic hoặc hook có thể khiến **toàn bộ block bị bỏ qua**, **node phải restart**, và trong trường hợp xấu nhất, **chain halt hoàn toàn** nếu mọi block đều chứa transaction trigger panic đó.

Parity's own coding guidelines viết rõ: *"The runtime should not be able to panic except under circumstances that are statically analysable."* Trail of Bits liệt kê "Don't Panic!" là một trong 7 vulnerability class quan trọng nhất của FRAME.

Đây là **High severity finding** trên Immunefi khi panic có thể được trigger bởi user input.

---

## Panic trong Substrate Runtime — Điều gì xảy ra?

### Trong WASM runtime

Substrate compile runtime thành WASM với `panic = abort`. Khi panic xảy ra:

```
User gửi transaction chứa input kích hoạt panic
        ↓
Runtime WASM trap (unreachable instruction)
        ↓
Node executor bắt được trap → reject block
        ↓
Block author bị penalize (không nhận reward)
        ↓
Network phải chờ block tiếp theo
```

> [!warning] Panic trong extrinsic vs panic trong hooks
> **Extrinsic panic**: Substrate node bắt được và reject transaction. Node không crash, nhưng block bị reject, mọi extrinsic trong block đó đều bị bỏ. Attacker có thể dùng điều này để **block specific transactions** bằng cách nhồi transaction panic vào cùng block.
>
> **Hook panic (`on_initialize`, `on_finalize`, `on_runtime_upgrade`)**: Không thể bắt được theo cách thông thường. Chain **halt hoàn toàn** — không block nào có thể được produce nếu `on_initialize` panic trên mọi block.

---

## Các nguồn Panic trong Rust / FRAME

### Nguồn 1: `.unwrap()` trên Option và Result

```rust
// VULNERABLE — panic nếu key không tồn tại
let domain = Domains::<T>::get(domain_id).unwrap();

// VULNERABLE — panic nếu Result là Err
let decoded = SomeType::decode(&mut input.as_ref()).unwrap();

// FIX với Option:
let domain = Domains::<T>::get(domain_id)
    .ok_or(Error::<T>::DomainNotFound)?;

// FIX với Result:
let decoded = SomeType::decode(&mut input.as_ref())
    .map_err(|_| Error::<T>::DecodingFailed)?;
```

> [!info] Ngoại lệ được chấp nhận: `.expect("qed")`
> Trong code Substrate, bạn sẽ thấy pattern này:
> ```rust
> let value = SomeStorage::<T>::get()
>     .expect("Value is always set in genesis; qed");
> ```
> "qed" (quod erat demonstrandum) là comment nói rằng panic này **không thể xảy ra theo design** vì invariant được đảm bảo bởi code khác (ví dụ: genesis config luôn set value này).
>
> **Khi audit**: mỗi `.expect("...")` là một claim về invariant. Hỏi: *"Invariant này có thực sự được đảm bảo không? Có code path nào phá vỡ nó không?"* Nếu có → đây là bug.

### Nguồn 2: Array/slice indexing trực tiếp

```rust
// VULNERABLE — panic nếu index out of bounds
let first = data[0];
let slice = &data[2..5];  // panic nếu data.len() < 5

// FIX — dùng .get() trả về Option
let first = data.first()
    .ok_or(Error::<T>::EmptyData)?;

let slice = data.get(2..5)
    .ok_or(Error::<T>::DataTooShort)?;
```

### Nguồn 3: Arithmetic panic trong debug mode

```rust
// VULNERABLE — panic khi overflow trong debug, wrap trong release
let total = a + b;          // overflow panic trong debug
let diff = 5u32 - 10u32;   // underflow panic: "attempt to subtract with overflow"
let result = 100 / 0;      // division by zero panic

// FIX — đã học trong Lesson 04
let total = a.checked_add(b).ok_or(ArithmeticError::Overflow)?;
let diff = a.checked_sub(b).ok_or(ArithmeticError::Underflow)?;
let result = a.checked_div(b).ok_or(ArithmeticError::DivisionByZero)?;
```

### Nguồn 4: `panic!()` macro trực tiếp

```rust
// VULNERABLE — explicit panic trong runtime code
if condition {
    panic!("This should never happen");
}

// FIX — dùng ensure! để return Err thay vì panic
ensure!(condition, Error::<T>::UnexpectedCondition);

// Hoặc dùng unreachable! chỉ trong branches được chứng minh không thể xảy ra:
// (nhưng cực kỳ cẩn thận với điều này)
```

### Nguồn 5: `.unwrap_or_else` với closure panic

```rust
// VULNERABLE — closure trong unwrap_or_else có thể panic
let value = SomeStorage::<T>::get()
    .unwrap_or_else(|| panic!("Storage not initialized"));

// FIX
let value = SomeStorage::<T>::get()
    .ok_or(Error::<T>::StorageNotInitialized)?;
```

### Nguồn 6: `assert!` và `assert_eq!` trong runtime

```rust
// VULNERABLE — assert! là panic với message
assert!(condition, "Invariant violated");
assert_eq!(a, b);

// CHỈ dùng assert! trong tests, không bao giờ trong runtime code
// FIX
ensure!(condition, Error::<T>::InvariantViolated);
```

### Nguồn 7: Decode/encode với assumption

```rust
// VULNERABLE — các codec operations có thể panic
use codec::{Encode, Decode};
let value: SomeType = Decode::decode(&mut &bytes[..]).unwrap();

// FIX
let value = SomeType::decode(&mut &bytes[..])
    .map_err(|_| Error::<T>::InvalidEncoding)?;
```

---

## Panic trong Hooks — Trường hợp nguy hiểm nhất

Panic trong `on_initialize` là critical vì nó xảy ra **trên mọi block**, trước khi extrinsics được process:

```rust
// CRITICAL VULNERABILITY — nếu StorageMap này bị corrupt, chain halt
fn on_initialize(n: BlockNumberFor<T>) -> Weight {
    let config = Config::<T>::get().unwrap(); // panic → chain halt forever
    // ...
    Weight::zero()
}
```

Kịch bản attack:
1. Attacker tìm cách để `Config::<T>` bị xóa hoặc bị set về `None` (ví dụ qua một extrinsic có bug)
2. Từ block tiếp theo, `on_initialize` panic trên mọi block
3. Không block nào có thể được produce
4. Chain halt hoàn toàn — cần hard fork để recover

```rust
// FIX — luôn handle None trong hooks
fn on_initialize(n: BlockNumberFor<T>) -> Weight {
    if let Some(config) = Config::<T>::get() {
        // process...
        T::WeightInfo::on_initialize_with_config()
    } else {
        // Log error nhưng không panic
        log::error!("Config not set in on_initialize at block {:?}", n);
        T::WeightInfo::on_initialize_empty()
    }
}
```

---

## Pattern nhận diện Panic khi Audit

### Scan nhanh bằng ripgrep

```bash
# Tìm tất cả unwrap() trong runtime code
rg '\.unwrap\(\)' pallets/ --type rust

# Tìm expect() — cần đọc message để đánh giá xem invariant có hợp lý không
rg '\.expect\(' pallets/ --type rust

# Tìm panic! trực tiếp
rg 'panic!\|unreachable!\|todo!\|unimplemented!' pallets/ --type rust

# Tìm array indexing
rg '\[.*\]' pallets/ --type rust | grep -v 'storage\|pallet\|derive\|cfg'

# Tìm assert! trong runtime (không phải tests)
rg 'assert!\|assert_eq!\|assert_ne!' pallets/src/ --type rust
```

### Đánh giá từng hit

Với mỗi `.unwrap()` hoặc `.expect()` tìm thấy:

```
1. Đây có phải trong test code (#[cfg(test)]) không?
   → Có: OK
   → Không: tiếp tục đánh giá

2. Đây là Option hay Result?
   → Nếu là Option từ Storage: hỏi "Điều gì xảy ra nếu key không tồn tại?"
   → Nếu là Result từ decode/encode: gần như chắc chắn là bug

3. Có comment giải thích invariant không (như "qed" pattern)?
   → Có: đọc và đánh giá invariant có đúng không
   → Không: đây là candidate bug

4. Nó nằm trong hook hay extrinsic?
   → Hook: severity cao hơn (chain halt risk)
   → Extrinsic: severity thấp hơn (DoS risk)
```

---

## Ví dụ thực tế — expect("qed") evaluation

Trong zkVerify codebase, bạn có thể gặp pattern này:

```rust
// Từ một pallet verifier:
fn verify_proof(proof: &Proof, vk: &VerificationKey) -> DispatchResult {
    let verifier = Verifiers::<T>::get()
        .expect("Verifier always initialized in genesis; qed");

    verifier.verify(proof, vk)
        .map_err(|_| Error::<T>::VerificationFailed)?;

    Ok(())
}
```

Khi audit, câu hỏi là:
- `Verifiers::<T>` có thực sự **luôn** được set trong genesis không? Kiểm tra `GenesisConfig`.
- Có extrinsic nào có thể xóa `Verifiers::<T>` không? Ví dụ `force_reset_verifier` chạy với Root → xóa storage → mọi proof submission sau đó panic.
- Nếu ai đó gọi `force_reset_verifier` với data invalid → `Verifiers::<T>` bị xóa → `verify_proof` panic → DoS.

---

## `no_panic` crate — Compile-time guarantee

Có thể dùng crate `no-panic` để compiler verify statically rằng function không có panic path:

```rust
#[no_panic::no_panic]
pub fn safe_function(x: u32, y: u32) -> u32 {
    x.checked_add(y).unwrap_or(u32::MAX) // OK — không thể panic
}

#[no_panic::no_panic]
pub fn unsafe_function(data: &[u8]) -> u8 {
    data[0] // compile error! compiler thấy panic path
}
```

Tuy nhiên không phải tất cả code đều có thể annotate với `no_panic` vì nó yêu cầu function phải provably non-panicking.

---

## Summary — Key Takeaways

- **Panic trong runtime = vulnerability**, không chỉ là bug — có thể trigger bởi attacker input.
- **7 nguồn panic**: `.unwrap()`, array index, arithmetic, `panic!()`, `unwrap_or_else` với panic closure, `assert!`, codec decode.
- **Panic trong extrinsic**: block bị reject → DoS attack vector.
- **Panic trong `on_initialize`/`on_finalize`**: chain halt → critical severity.
- **`.expect("qed")`**: được chấp nhận chỉ khi invariant thực sự được đảm bảo. Khi audit: verify từng claim.
- **Audit scan**: `rg '\.unwrap\(\)|\.expect\(|panic!\|assert!' pallets/`
- **Fix**: mọi `unwrap()` cần chuyển thành `?` hoặc `ok_or(Error::<T>::...)?`.

---

## References

- Trail of Bits "Not So Smart Pallets — Don't Panic!" — secure-contracts.com/not-so-smart-contracts/substrate/dont_panic
- Parity coding guidelines — "panics in runtime must be avoided at all costs"
- Substrate issue #668 — "Sweep runtime for panics" — github.com/paritytech/substrate/issues/668
- `no-panic` crate — docs.rs/no-panic
