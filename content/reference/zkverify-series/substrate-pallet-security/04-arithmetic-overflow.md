---
title: "04. Arithmetic Overflow"
tags: [security, substrate, frame, arithmetic, overflow, wasm, lesson-04]
aliases: [Arithmetic Overflow]
created: 2026-03-16
---

> **Prerequisites**: [[01-frame-architecture|01. FRAME Architecture]], [[02-extrinsics-and-dispatch|02. Extrinsics & Dispatch]]
> **Objectives**:
> - Hiểu tại sao integer overflow là vấn đề đặc biệt trong Substrate/WASM runtime
> - Phân biệt và sử dụng đúng `checked_*`, `saturating_*`, `wrapping_*`
> - Nhận ra các pattern overflow phổ biến trong pallet code
> - Hiểu Acala incident 2022 như một case study thực tế

---

## Motivation

Ngày 14/08/2022, Acala — DeFi hub lớn nhất trên Polkadot — bị exploit. Hơn **1.28 tỷ aUSD** được mint từ không khí. Giá aUSD sụt từ $1.03 xuống còn $0.009 trong vài phút. Toàn bộ chain phải halt khẩn cấp.

Root cause không phải là một hacker phá khóa phức tạp. Đó là một **misconfiguration trong hàm tính toán phần thưởng** của incentives pallet — kết hợp với logic arithmetic thiếu guard. Kết quả: hàm `accumulate_dex_saving` mint aUSD thay vì LP tokens khi tham số cấu hình sai.

Arithmetic bug trong pallet không chỉ là "số tính sai" — nó có thể là **infinite mint**, **free withdrawal**, hoặc **underflow steal**. Lesson này dạy cách nhận ra và phòng tránh.

---

## Tại sao Overflow là vấn đề đặc biệt trong Substrate

### Rust Debug vs Release mode

Trong Rust bình thường:
- **Debug mode**: integer overflow → **panic** (chương trình crash)
- **Release mode**: integer overflow → **wrap around** (im lặng)

```rust
// Debug build:
let x: u8 = 255u8 + 1;  // panic: 'attempt to add with overflow'

// Release build:
let x: u8 = 255u8.wrapping_add(1);  // x = 0, không có panic
```

### Vấn đề trong WASM runtime

Substrate runtime biên dịch sang **WebAssembly** và thường chạy ở chế độ **release optimization** (không phải debug). Điều này có nghĩa:

> [!warning] Critical: Overflow trong Substrate runtime = wrap around silently
> Phép tính `255u8 + 1` trong runtime **KHÔNG panic** — nó trả về `0`. Không có báo lỗi, không có exception. State bị thay đổi với giá trị sai.
>
> Trong debug/test mode thì panic (và bạn thấy lỗi). Trong production WASM thì im lặng. Đây là lý do overflow bugs có thể vượt qua testing và chỉ bị phát hiện khi exploit trên mainnet.

### Overflow vs Underflow

```
Overflow:  MAX_VALUE + 1 → 0 (hoặc MIN_VALUE)
Underflow: 0 - 1 → MAX_VALUE (với unsigned integers)
```

Cả hai đều nguy hiểm như nhau:

```rust
// Overflow: mint vô hạn token
let new_supply = current_supply + mint_amount; // 0 nếu overflow

// Underflow: steal tokens
let new_balance = user_balance - withdraw_amount; // MAX_VALUE nếu balance = 0
```

---

## Các phương thức an toàn của Rust

Rust cung cấp nhiều phương thức thay thế cho toán tử `+`, `-`, `*`, `/` thông thường:

### `checked_*` — Trả về Option

```rust
// Thay vì:
let result = a + b; // KHÔNG AN TOÀN

// Dùng:
let result = a.checked_add(b)
    .ok_or(ArithmeticError::Overflow)?; // trả về Err nếu overflow

// Tương tự:
a.checked_sub(b)    // Err nếu underflow
a.checked_mul(b)    // Err nếu overflow
a.checked_div(b)    // Err nếu chia cho 0
```

`checked_*` là lựa chọn **đúng nhất về mặt logic** khi overflow phải là lỗi (ví dụ: transfer vượt balance là lỗi, không phải "wrap around").

### `saturating_*` — Kẹp tại giới hạn

```rust
let result = a.saturating_add(b);
// Nếu a + b > MAX → kết quả = MAX (không overflow, không Err)
// Nếu a - b < 0   → kết quả = 0   (không underflow)
```

`saturating_*` phù hợp khi wrap-around là logic sai nhưng bạn muốn **tiếp tục thực thi** thay vì return error. Ví dụ: weight counter, fee accumulation, counter tracking.

> [!warning] Đừng dùng `saturating_*` cho balance operations
> `saturating_add` trên balance thực ra vẫn là bug logic: `balance = u128::MAX` không phải là "đúng", chỉ là "không crash". Dùng `checked_*` cho bất cứ thứ gì liên quan đến tiền/token.

### `wrapping_*` — Wrap around có chủ ý

```rust
let result = a.wrapping_add(b); // giống release mode, nhưng explicit
```

Chỉ dùng khi wrap-around **là behavior mong muốn** (ví dụ: nonce counter, hash function internal). Hiếm khi cần trong pallet logic.

### `sp_arithmetic::FixedU128` — Fixed-point arithmetic

Với phép tính phân số (ví dụ: tỷ lệ phần thưởng 0.05%, lãi suất 2.5%/năm):

```rust
use sp_arithmetic::FixedU128;

let rate = FixedU128::from_rational(5, 1000); // 0.005 = 0.5%
let reward = rate.saturating_mul_int(principal);
```

Không dùng `u128` chia `u128` rồi multiply — precision loss và overflow đều có thể xảy ra.

### Bảng tóm tắt lựa chọn

| Tình huống | Nên dùng | Lý do |
|-----------|----------|-------|
| Balance operations | `checked_*` + `ok_or(ArithmeticError::Overflow)?` | Overflow phải là lỗi |
| Weight/fee counting | `saturating_*` | Không muốn crash, nhưng không wrap |
| Loop counter | `saturating_*` hoặc `checked_*` | Tùy context |
| Tỷ lệ/percentage | `FixedU128` / `sp_arithmetic` | Precision |
| Cryptographic internal | `wrapping_*` | Wrap-around là đúng |

---

## Các Pattern Overflow phổ biến trong Pallet

### Pattern 1 — Bare arithmetic operator

```rust
// VULNERABLE
pub fn mint(origin: OriginFor<T>, amount: T::Balance) -> DispatchResult {
    let who = ensure_signed(origin)?;
    let current = TotalIssuance::<T>::get();
    TotalIssuance::<T>::put(current + amount); // overflow → total supply = 0!
    Balances::<T>::mutate(&who, |b| *b += amount); // overflow → balance = 0!
    Ok(())
}

// FIX
pub fn mint(origin: OriginFor<T>, amount: T::Balance) -> DispatchResult {
    let who = ensure_signed(origin)?;
    let current = TotalIssuance::<T>::get();
    let new_total = current
        .checked_add(&amount)
        .ok_or(ArithmeticError::Overflow)?;
    TotalIssuance::<T>::put(new_total);
    Balances::<T>::try_mutate(&who, |b| -> DispatchResult {
        *b = b.checked_add(&amount).ok_or(ArithmeticError::Overflow)?;
        Ok(())
    })?;
    Ok(())
}
```

### Pattern 2 — Type cast mất data

```rust
// VULNERABLE — cast u128 → u64 có thể mất data
let reward: u128 = calculate_reward(); // có thể > u64::MAX
let stored: u64 = reward as u64;       // im lặng truncate!

// FIX — dùng try_into() với error handling
use sp_runtime::TryRuntimeError;
let stored: u64 = reward
    .try_into()
    .map_err(|_| Error::<T>::RewardTooLarge)?;
```

### Pattern 3 — Overflow ẩn trong multiplication

```rust
// VULNERABLE — reward_per_unit * total_units có thể overflow trước khi chia
let total_reward = reward_per_unit * total_units / PRECISION_FACTOR;

// FIX — chia trước khi nhân, hoặc dùng FixedU128
let total_reward = FixedU128::from_inner(reward_per_unit)
    .saturating_mul_int(total_units);
```

### Pattern 4 — Underflow trong subtraction

```rust
// VULNERABLE — nếu fee > balance, underflow → user có số dư khổng lồ
pub fn withdraw(origin: OriginFor<T>, amount: T::Balance) -> DispatchResult {
    let who = ensure_signed(origin)?;
    let balance = Balances::<T>::get(&who);
    let fee = calculate_fee(amount);
    Balances::<T>::insert(&who, balance - amount - fee); // underflow nếu amount+fee > balance!
    Ok(())
}

// FIX
pub fn withdraw(origin: OriginFor<T>, amount: T::Balance) -> DispatchResult {
    let who = ensure_signed(origin)?;
    let balance = Balances::<T>::get(&who);
    let fee = calculate_fee(amount);
    let total_deduction = amount
        .checked_add(&fee)
        .ok_or(ArithmeticError::Overflow)?;
    let new_balance = balance
        .checked_sub(&total_deduction)
        .ok_or(Error::<T>::InsufficientBalance)?;
    Balances::<T>::insert(&who, new_balance);
    Ok(())
}
```

### Pattern 5 — Overflow trong `on_initialize` (nguy hiểm nhất)

```rust
// VULNERABLE — on_initialize chạy mỗi block, không thể revert
fn on_initialize(n: BlockNumberFor<T>) -> Weight {
    let rate = RewardRate::<T>::get();
    let supply = TotalStaked::<T>::get();

    // rate * supply có thể overflow nếu rate được set sai
    let reward = rate * supply; // overflow → reward = 0 hoặc giá trị rác

    // Khi rate bị misconfigure (như Acala), reward tính sai
    // và tokens được mint với số lượng sai
    TotalRewards::<T>::mutate(|r| *r += reward);
    Weight::zero()
}
```

Đây chính xác là pattern dẫn đến Acala incident (xem case study dưới).

---

## Case Study — Acala Incident, August 2022

### Bối cảnh

Acala là Polkadot parachain, là DeFi hub với stablecoin aUSD. Ngày 14/08/2022, pool iBTC/aUSD được launch lần đầu tiên.

### Root cause

Trong `incentives pallet`, hàm `accumulate_dex_saving` có nhiệm vụ tính và phân phối aUSD rewards cho liquidity providers. Tham số `DexSavingRewardRates` được cấu hình cho Karura (canary network) nhưng **không được reset về 0** khi deploy lên Acala mainnet.

Kết quả: khi pool iBTC/aUSD launch, hàm `accumulate_dex_saving` được trigger với rate cực cao. Thay vì mint một lượng nhỏ LP tokens, nó mint **hàng tỷ aUSD** mỗi block.

### Cơ chế exploit

```
Bước 1: iBTC/aUSD pool launch
Bước 2: accumulate_dex_saving() chạy mỗi block trong on_initialize
Bước 3: DexSavingRewardRates không về 0 → rate cực lớn
Bước 4: reward = rate * pool_size → số lượng aUSD khổng lồ
Bước 5: aUSD được mint vào pool thay vì LP tokens
Bước 6: Users gọi claim_rewards() → nhận aUSD không hạn chế
Bước 7: Một số user swap aUSD → DOT/iBTC và bridge ra ngoài
```

### Số liệu thực tế

- **3.02 tỷ aUSD** được mint nhầm trong thời gian ngắn
- **1.28 tỷ aUSD** trong tay attacker (wallet đơn)
- aUSD sụt từ **$1.03 xuống $0.009** (giảm 99%)
- **1.6 triệu aUSD** giá trị thực bị bridge ra trước khi halt
- Chain phải **halt khẩn cấp** qua governance vote
- **1.292 tỷ aUSD** burned qua governance proposal sau đó

### Bài học

> [!warning] Lessons từ Acala Incident
>
> **1. Parameter misconfiguration là vulnerability, không phải chỉ code bug**: Audit phải bao gồm kiểm tra initial parameters và deploy checklist.
>
> **2. `on_initialize` không có safety net**: Khác extrinsic (có fee → có chống spam), `on_initialize` chạy mỗi block miễn phí. Overflow/logic bug trong hook này = exploit mỗi block.
>
> **3. "Deprecated code" vẫn chạy**: `accumulate_dex_saving` là feature cũ của Karura, không còn cần thiết cho Acala. Nhưng code vẫn tồn tại và được trigger vì tham số không bị xóa.
>
> **4. Arithmetic không có guard = time bomb**: Khi rate đúng thì tính đúng. Khi rate sai → không có gì ngăn overflow.

### Pattern phòng tránh (áp dụng vào audit)

```rust
// Phiên bản có guard cho accumulate_dex_saving pattern:
fn accumulate_rewards_safe(
    rate: FixedU128,
    pool_size: Balance,
) -> Result<Balance, DispatchError> {
    // Validate rate trong reasonable bounds TRƯỚC khi tính
    ensure!(
        rate <= MAX_REWARD_RATE,
        Error::<T>::RewardRateTooHigh
    );

    let reward = rate
        .checked_mul_int(pool_size)
        .ok_or(ArithmeticError::Overflow)?;

    // Validate kết quả cũng trong bounds
    ensure!(
        reward <= MAX_SINGLE_REWARD,
        Error::<T>::RewardTooLarge
    );

    Ok(reward)
}
```

---

## Checklist Audit — Arithmetic

Khi đọc code pallet, scan cho:

```bash
# Tìm bare arithmetic operators (cần review thủ công)
rg " \+ | \- | \* | / |\+= |-= |\*= |/= " pallets/ --type rust

# Tìm type casts có thể mất data
rg " as u[0-9]" pallets/ --type rust

# Kiểm tra xem checked_* và saturating_* đã được dùng chưa
rg "checked_add|checked_sub|checked_mul|saturating_add|saturating_sub" pallets/ --type rust
```

Với mỗi operation tìm thấy, hỏi:
1. Đây là operation trên balance/supply/reward? → phải dùng `checked_*`
2. Đây là operation trên counter/weight? → `saturating_*` chấp nhận được
3. Có type cast nào từ wider type sang narrower type không? → phải dùng `try_into()`
4. Operation này nằm trong `on_initialize`? → cực kỳ cẩn thận, không có revert

---

## Summary — Key Takeaways

- Trong WASM release mode: integer overflow **wrap around silently** — không panic, không error.
- **`checked_*`** → trả về `None`/`Err` khi overflow, dùng cho balance operations.
- **`saturating_*`** → kẹp tại MAX/MIN, dùng cho counter/weight không liên quan tiền.
- **`wrapping_*`** → explicit wrap around, hiếm dùng trong pallet.
- **Type cast** `as u64` có thể mất data → dùng `.try_into().map_err(|_| Error::...)`.
- **Acala 2022**: misconfigured rate + no arithmetic guard trong `on_initialize` → 1.28B token mint.
- **`on_initialize` là high-risk zone**: không có fee protection, chạy mỗi block, không revert nếu sai.

---

## References

- Trail of Bits "Not So Smart Pallets — Arithmetic Overflow" — secure-contracts.com/not-so-smart-contracts/substrate/arithmetic_overflow
- Acala Incident Report 14/08/2022 — medium.com/acalanetwork/acala-incident-report-14-08-2022-392089588642
- sp_arithmetic docs — paritytech.github.io/substrate/master/sp_arithmetic
- Rust Reference — Numeric Types and Overflow Behavior — doc.rust-lang.org/reference/expressions/operator-expr.html
