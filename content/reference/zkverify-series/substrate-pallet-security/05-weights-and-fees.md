---
title: "05. Weights & Fees"
tags: [security, substrate, frame, weight, fee, dos, benchmarking, lesson-05]
aliases: [Weights and Fees]
created: 2026-03-16
---

> **Prerequisites**: [[01-frame-architecture|01. FRAME Architecture]], [[02-extrinsics-and-dispatch|02. Extrinsics & Dispatch]] — biết extrinsic, `#[pallet::weight]`, dispatch pipeline
> **Objectives**:
> - Hiểu hệ thống Weight hai chiều: `ref_time` và `proof_size`
> - Biết Weight → Fee được tính như thế nào và tại sao sai weight = sai fee
> - Phân loại các lỗi weight dẫn đến DoS hoặc economic attack
> - Nhận ra weight bugs trong audit và biết cách verify bằng benchmarking

---

## Motivation

Trong Ethereum, mỗi opcode có gas cố định — runtime đo gas *trong lúc chạy*. Substrate khác: nó phải biết **trước** một extrinsic tốn bao nhiêu compute để quyết định có đưa vào block không.

Cơ chế đó là **Weight**. Nếu weight khai báo sai, hai hậu quả có thể xảy ra:

**Underweight** (khai báo thấp hơn thực tế): Block có thể nhồi nhiều transactions hơn giới hạn → node bị overload → chain trễ hoặc halt. Và attacker chỉ phải trả fee rẻ cho computation đắt.

**Overweight** (khai báo cao hơn thực tế): User bị charge quá nhiều, throughput thực tế của chain thấp hơn thiết kế.

Trong cả hai trường hợp, đây là **lỗi có thể report lên Immunefi** ở mức High.

---

## Weight là gì — Mô hình hai chiều

Từ Substrate/Polkadot SDK hiện đại, `Weight` là struct với **hai chiều**:

```rust
pub struct Weight {
    ref_time: u64,    // computational time (picoseconds trên reference hardware)
    proof_size: u64,  // số bytes của Merkle proof cần để verify state
}
```

> [!info] Định nghĩa — ref_time
> `ref_time` đo **thời gian tính toán** trên reference hardware (Intel Core i7-7700K, 64GB RAM, NVMe SSD). Substrate định nghĩa `1 giây = 10^12 ref_time units`. Một extrinsic đơn giản thường vào khoảng `10_000_000` đến `100_000_000` (10-100 microseconds).

> [!info] Định nghĩa — proof_size
> `proof_size` đo **dung lượng storage proof** — lượng data cần để một light client verify state transition. Quan trọng cho parachain context (PoV — Proof of Validity).

```rust
// Ví dụ weight từ generated benchmarks:
// Minimum execution time: 15_000 picoseconds
Weight::from_parts(18_000_000, 3_596)
//                 ^ref_time   ^proof_size
```

---

## Weight → Fee: Cơ chế tính phí

Fee không được lưu trong pallet. Nó được tính bởi `pallet_transaction_payment` dựa trên formula:

```
fee = base_fee
    + (ref_time_weight * per_weight_fee)
    + (proof_size_weight * per_proof_fee)
    + len_fee    // phí theo kích thước transaction bytes
    + tip        // optional tip của user
```

Trong đó `per_weight_fee` và `per_proof_fee` được cấu hình ở runtime level. Điều quan trọng:

> [!warning] Weight → Fee là tuyến tính
> Nếu bạn khai báo `weight = 10_000` cho một function thực ra mất `1_000_000_000` ref_time, fee chỉ tính theo `10_000`. Attacker trả fee của computation 10,000 đơn vị nhưng chiếm computation 1 tỷ đơn vị trong block.

---

## Vulnerability Classes — Incorrect Weights

### W1: Weight bằng 0 hoặc hardcode quá thấp

```rust
// VULNERABLE — weight = 0 → gọi miễn phí!
#[pallet::weight(0)]
pub fn do_heavy_work(
    origin: OriginFor<T>,
    data: Vec<u8>,         // Vec không giới hạn!
) -> DispatchResult {
    let _ = ensure_signed(origin)?;
    // Xử lý data với O(n) complexity
    for item in data.iter() {
        HeavyStorage::<T>::insert(item, true); // n storage writes
    }
    Ok(())
}
```

**Attack vector**: Gửi transaction với `data = vec![0u8; 10_000]`. Fee = 0, nhưng block dành 10,000 storage writes. Repeat nhiều lần → block saturated → chain halt.

```rust
// FIX — weight phải linear theo input length
#[pallet::weight(T::WeightInfo::do_heavy_work(data.len() as u32))]
pub fn do_heavy_work(
    origin: OriginFor<T>,
    data: BoundedVec<u8, T::MaxDataLen>, // bounded input!
) -> DispatchResult {
    let _ = ensure_signed(origin)?;
    for item in data.iter() {
        HeavyStorage::<T>::insert(item, true);
    }
    Ok(())
}
```

### W2: Weight constant, nhưng complexity phụ thuộc input

Đây là lỗi phổ biến nhất — weight được hardcode dù function thực hiện số lượng operations biến đổi theo input:

```rust
// VULNERABLE — weight không đổi dù số lượng verifiers thay đổi
#[pallet::weight(T::WeightInfo::submit_batch())] // constant weight
pub fn submit_batch(
    origin: OriginFor<T>,
    proofs: Vec<ProofData>,       // số lượng proof biến đổi!
) -> DispatchResult {
    let _ = ensure_signed(origin)?;
    for proof in proofs.iter() {
        verify_proof(proof)?;     // mỗi proof tốn ~ 100ms
        ProofStore::<T>::insert(proof.hash, proof.clone());
    }
    Ok(())
}
```

Nếu `WeightInfo::submit_batch()` được benchmark với 1 proof nhưng attacker gửi 100 proofs:
- Fee = cost of 1 proof
- Actual compute = 100 proofs

```rust
// FIX — weight linear theo số proof
#[pallet::weight(T::WeightInfo::submit_batch(proofs.len() as u32))]
pub fn submit_batch(
    origin: OriginFor<T>,
    proofs: BoundedVec<ProofData, T::MaxBatchSize>,
) -> DispatchResult {
    let _ = ensure_signed(origin)?;
    for proof in proofs.iter() {
        verify_proof(proof)?;
        ProofStore::<T>::insert(proof.hash, proof.clone());
    }
    Ok(())
}
```

### W3: Thiếu weight trên `on_initialize` / `on_finalize`

```rust
// VULNERABLE — on_initialize không return weight!
fn on_initialize(_n: BlockNumberFor<T>) -> Weight {
    // Dọn dẹp expired entries — O(n) với n = số entries hết hạn
    let expired = Self::collect_expired();
    for key in expired {
        PendingProofs::<T>::remove(&key);
    }
    Weight::zero() // ← LỖI: trả về 0 dù làm nhiều storage operations
}
```

Block scheduling không biết `on_initialize` tốn bao nhiêu → block có thể bị overweight sau khi nhồi đầy extrinsics + on_initialize thực tế chạy nặng hơn dự kiến.

```rust
// FIX — return actual weight
fn on_initialize(_n: BlockNumberFor<T>) -> Weight {
    let count = PendingProofs::<T>::iter().count() as u32;
    // hoặc lưu count trong storage để tránh iter
    T::WeightInfo::on_initialize_cleanup(count)
}
```

> [!warning] Quy tắc vàng cho `on_finalize`
> Theo Substrate docs: **tránh variable weight trong `on_finalize`**. Vì `on_finalize` chạy *sau* khi đã chọn xong extrinsics, nếu nó nặng hơn dự kiến → block overweight → block bị reject.
>
> Nếu cần cleanup nặng → chuyển sang `on_initialize` (trước khi chọn extrinsics, dễ adjust hơn).

### W4: Benchmark không cover worst case

Benchmark đúng kỹ thuật nhưng sai về *scenario*:

```rust
// Benchmark được viết với small setup:
#[benchmark]
fn verify_proof() {
    let proof = create_minimal_proof::<T>(); // proof nhỏ nhất có thể
    let vk = create_minimal_vk::<T>();
    // benchmark với proof đơn giản nhất

    #[extrinsic_call]
    verify_proof(RawOrigin::Signed(caller), proof, vk);
}

// Nhưng trong thực tế, user có thể gửi proof phức tạp nhất
// → benchmark không phản ánh worst case → weight thấp hơn thực tế
```

---

## Cách đọc Weight Annotation khi Audit

Khi gặp `#[pallet::weight(...)]`, cần check:

**1. Có phụ thuộc vào input size không?**
```rust
#[pallet::weight(10_000)]                              // ⚠ constant — check function body
#[pallet::weight(T::WeightInfo::my_fn())]             // OK nếu benchmark đúng
#[pallet::weight(T::WeightInfo::my_fn(data.len() as u32))] // OK — linear
```

**2. WeightInfo có implement đúng không?**
```rust
// Trong trait definition:
pub trait WeightInfo {
    fn my_fn() -> Weight;
}

// Implementation mặc định (thường tệ):
impl WeightInfo for () {
    fn my_fn() -> Weight {
        Weight::from_parts(10_000, 0) // hardcoded placeholder!
    }
}
```

> [!warning] `WeightInfo for ()` là dấu hiệu nguy hiểm
> Nhiều pallet dùng `type WeightInfo = ()` trong test/dev. Nếu production runtime CŨNG dùng `()`, toàn bộ weight = placeholder → không phản ánh thực tế.

**3. Có `BoundedVec` cho input Vec không?**
```rust
// NGUY HIỂM — Vec không giới hạn
data: Vec<u8>

// AN TOÀN — bounded
data: BoundedVec<u8, T::MaxDataLen>
// hoặc
data: BoundedVec<ProofData, ConstU32<100>>
```

Nếu input là `Vec<T>` (không bounded) và weight không linear theo length → **đây là bug có thể report**.

---

## Benchmarking — Cách hoạt động và cách đọc

Substrate benchmarks được viết trong block `#[pallet::benchmarks]` hoặc file riêng `benchmarking.rs`:

```rust
#[benchmarks]
mod benchmarks {
    use super::*;

    #[benchmark]
    fn submit_proof(
        n: Linear<1, { T::MaxProofs::get() }> // n từ 1 đến max
    ) {
        // Setup: chuẩn bị state
        let caller = whitelisted_caller::<T::AccountId>();
        let proofs = create_n_proofs::<T>(n);

        // Call extrinsic
        #[extrinsic_call]
        submit_proof(RawOrigin::Signed(caller), proofs);

        // Verify (optional): kiểm tra state sau khi gọi
        assert!(ProofStore::<T>::contains_key(/* ... */));
    }
}
```

Khi chạy benchmark:
```bash
# Build với feature flag
cargo build --release --features runtime-benchmarks

# Chạy benchmark, output weights vào file
./target/release/node-zkverify benchmark pallet \
    --chain dev \
    --pallet pallet_aggregate \
    --extrinsic "*" \
    --steps 50 \
    --repeat 20 \
    --output pallets/aggregate/src/weights.rs
```

Output là file `weights.rs` với functions như:
```rust
fn submit_proof(n: u32) -> Weight {
    // Slope và intercept từ linear regression
    Weight::from_parts(15_000_000u64.saturating_add(2_000_000u64.saturating_mul(n.into())), 3_596)
        .saturating_add(T::DbWeight::get().reads(1u64))
        .saturating_add(T::DbWeight::get().writes(n.into()))
}
```

> [!info] Cách đọc generated weight function
> - **Base**: `15_000_000` ref_time ngay cả khi n=0 (overhead của function call)
> - **Slope**: `2_000_000` thêm vào cho mỗi unit của n (cost per item)
> - **DB reads/writes**: overhead của storage operations (read ~25M, write ~100M ref_time)
>
> Nếu `n` là số proofs và `writes(n)` nhưng function thực tế write `n * 3` items → **benchmark thiếu writes → weight underestimate**.

---

## Audit Checklist — Weights

```bash
# 1. Tìm constant weight (đáng nghi nếu function có Vec input)
rg '#\[pallet::weight\([0-9]' pallets/ --type rust

# 2. Tìm Vec<> input không bounded (cần kiểm tra weight có linear không)
rg 'Vec<' pallets/ --type rust | grep -v BoundedVec

# 3. Kiểm tra WeightInfo for () (placeholder weights)
rg 'WeightInfo for \(\)' pallets/ --type rust
rg 'type WeightInfo = \(\)' runtime/ --type rust

# 4. Tìm on_initialize/on_finalize trả về Weight::zero()
rg 'on_initialize\|on_finalize' pallets/ -A 10 --type rust | grep 'Weight::zero'
```

Với mỗi `#[pallet::weight(...)]` tìm được, hỏi:
- Function body có loop/iteration không? → weight phải linear
- Có storage read/write trong loop không? → phải count trong weight
- Input có bounded không? → nếu không: đây là bug

---

## Summary — Key Takeaways

- **Weight = (ref_time, proof_size)**: đo computation time và storage proof size.
- **Fee phụ thuộc tuyến tính vào weight**: weight sai → fee sai → DoS vector.
- **4 lớp lỗi**: weight = 0, constant weight cho variable complexity, thiếu weight trên hooks, benchmark không cover worst case.
- **`BoundedVec` bắt buộc** với mọi `Vec` input — thiếu bounded + constant weight = lỗi nghiêm trọng.
- **`WeightInfo for ()`** trong production = placeholder weight = flag đỏ.
- **`on_finalize` với variable weight**: tránh — chuyển sang `on_initialize`.

---

## References

- Trail of Bits "Not So Smart Pallets — Weights and Fees" — secure-contracts.com/not-so-smart-contracts/substrate/weights_and_fees
- Substrate Benchmarking README — github.com/paritytech/substrate/blob/master/frame/benchmarking/README.md
- Deeper Network Benchmarking Guide — doc.deepernetwork.org/v3/runtime/benchmarking
- Polkadot SDK Benchmarking docs — paritytech.github.io/polkadot-sdk/master/frame_benchmarking
