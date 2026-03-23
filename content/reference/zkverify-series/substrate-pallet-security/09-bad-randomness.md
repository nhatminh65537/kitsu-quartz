---
title: "09. Bad Randomness"
tags: [security, substrate, frame, randomness, vrf, block-hash, manipulation, lesson-09]
aliases: [Bad Randomness]
created: 2026-03-16
---

> **Prerequisites**: [[01-frame-architecture|01. FRAME Architecture]], [[02-extrinsics-and-dispatch|02. Extrinsics & Dispatch]]
> **Objectives**:
> - Hiểu vì sao randomness on-chain là bài toán khó cơ bản
> - Phân biệt các nguồn randomness trong Substrate và mức độ an toàn của từng loại
> - Nhận ra các pattern dùng randomness sai trong pallet code
> - Biết khi nào randomness thực sự cần thiết và alternative designs

---

## Motivation

Blockchain là hệ thống **deterministic** — mọi node phải tính toán cùng kết quả từ cùng input. Điều này tạo ra một mâu thuẫn cơ bản: làm thế nào để có "số ngẫu nhiên" khi mọi thứ đều có thể tính trước?

Câu trả lời ngắn gọn: **không thể có randomness hoàn toàn an toàn on-chain**. Mọi nguồn randomness đều có giới hạn về mức độ bảo mật. Vấn đề là dùng nguồn randomness phù hợp với yêu cầu bảo mật của ứng dụng — và không dùng nguồn ngẫu nhiên không an toàn cho các thao tác high-stake.

---

## Vấn đề cốt lõi — Block Author Control

Mọi randomness on-chain đều bắt nguồn từ dữ liệu trong block. Block do **block author** (validator/collator) tạo ra. Nếu block author có thể xem trước giá trị randomness và có lợi ích từ việc thao túng nó, họ có incentive để làm điều đó.

Cơ chế thao túng cơ bản:

```
Block author thấy: randomness = hash(data trong block này) → outcome = X
X không có lợi cho họ
→ Block author "drop" block này, tạo block mới với data khác nhỏ
→ Thử lại cho đến khi outcome = Y có lợi hơn
```

Chi phí để thao túng = phần thưởng block bị mất + công sức retry. Nếu outcome của randomness có giá trị lớn hơn phần thưởng block, attack là profitable.

---

## Các nguồn Randomness trong Substrate

### Nguồn 1 — `block_hash` (KHÔNG AN TOÀN)

```rust
// VULNERABLE — block hash dễ bị manipulate
fn get_random_value() -> [u8; 32] {
    let block_number = frame_system::Pallet::<T>::block_number();
    let hash = frame_system::Pallet::<T>::block_hash(block_number - 1u32.into());
    hash.as_bytes().try_into().unwrap_or_default()
}
```

**Vấn đề**: Block hash là hash của toàn bộ block header, bao gồm các field mà block author có thể điều chỉnh (timestamp trong giới hạn cho phép, transaction ordering). Author có thể thử nhiều biến thể để chọn block hash có lợi.

Thậm chí nếu không thao túng, `block_hash` **có thể biết trước** bởi ai có thể nhìn vào pending block. Không dùng `block_hash` cho bất kỳ mục đích security-sensitive nào.

### Nguồn 2 — `pallet_insecure_randomness_collective_flip` (CHỈ TEST)

```rust
// Substrate có sẵn pallet này, nhưng tên nói lên tất cả: INSECURE
use pallet_insecure_randomness_collective_flip::Pallet as CollectiveFlip;

let (randomness, _) = CollectiveFlip::<T>::random(b"my-subject");
```

Pallet này lấy hash của 81 block trước đó để tạo randomness. "Collective flip" vì entropy đến từ nhiều block. Nhưng:

- **81 block authors trước** đều có thể đã điều chỉnh block của họ để bias kết quả
- Tên chính thức của pallet là `pallet_insecure_randomness_collective_flip` — Substrate đặt tên rõ ràng
- **Chỉ dùng trong testing**, không bao giờ trong production

### Nguồn 3 — `pallet_babe` với VRF (SẢN XUẤT — CÓ GIỚI HẠN)

```rust
// Dùng randomness từ BABE VRF
use pallet_babe::Pallet as Babe;

// Randomness từ epoch hiện tại (dễ biết trước hơn)
let (randomness, _) = Babe::<T>::random(b"my-subject");

// Randomness từ 2 epoch trước (an toàn hơn, nhưng cũ hơn)
let epoch_randomness = pallet_babe::RandomnessFromTwoEpochsAgo::<T>::random(b"subject");
```

BABE sử dụng **Verifiable Random Function (VRF)** — mỗi validator commit VRF output khi author block. Randomness epoch N được tính từ VRF outputs của epoch N-2.

**Tại sao N-2?** Để đảm bảo tất cả VRF inputs đã được finalized và không thể thay đổi khi randomness được sử dụng.

> [!warning] BABE VRF vẫn có giới hạn bảo mật
> Mặc dù VRF an toàn hơn `block_hash` nhiều, nó không hoàn toàn unpredictable trong mọi tình huống:
> - Validators biết VRF output của mình **trước** khi commit vào block
> - Validator cuối cùng trong epoch có thể chọn không reveal (withhold attack) nếu biết điều đó cho họ lợi thế
> - **Epoch randomness thích hợp cho**: lottery trong governance, random selection với stakes thấp
> - **Không thích hợp cho**: high-value jackpots, NFT rarity với giá trị lớn, bất kỳ thứ gì mà manipulation profitable

### Bảng so sánh

| Nguồn | Cơ chế | Mức độ an toàn | Dùng khi |
|-------|--------|----------------|---------|
| `block_hash` | Hash block cụ thể | Rất thấp — 1 author manipulate | Không bao giờ trong production |
| `collective_flip` | Hash 81 block | Thấp — 81 authors có thể bias | Chỉ testing |
| BABE `CurrentBlockRandomness` | VRF của slot hiện tại | Trung bình — author biết trước | Lottery with low stakes |
| BABE `RandomnessFromTwoEpochsAgo` | VRF aggregated từ N-2 | Cao hơn — cần multi-epoch coordination | Governance, validator selection |

---

## Vulnerability Classes

### BR1: Dùng block_hash hoặc block_number làm seed

```rust
// VULNERABLE — block author biết hash trước khi commit
pub fn random_winner(origin: OriginFor<T>) -> DispatchResult {
    let _ = ensure_signed(origin)?;

    let block_hash = frame_system::Pallet::<T>::block_hash(
        frame_system::Pallet::<T>::block_number() - 1u32.into()
    );
    let index = u32::from_le_bytes(block_hash.as_ref()[..4].try_into().unwrap());
    let winner_index = index % ParticipantCount::<T>::get();

    // block author đã biết winner_index TRƯỚC khi tạo block
    // Nếu họ muốn thắng, họ thử delay block / tweak timestamp để ra index họ muốn
    Winner::<T>::put(Participants::<T>::get(winner_index));
    Ok(())
}
```

### BR2: Dùng `collective_flip` cho high-value outcomes

```rust
// VULNERABLE — collective_flip không đủ mạnh cho NFT mint với giá trị cao
#[pallet::config]
pub trait Config: frame_system::Config {
    type Randomness: Randomness<Self::Hash, BlockNumberFor<Self>>;
}

// Runtime dùng InsecureRandomnessCollectiveFlip:
// type Randomness = pallet_insecure_randomness_collective_flip::Pallet<Runtime>;

pub fn mint_rare_nft(origin: OriginFor<T>) -> DispatchResult {
    let who = ensure_signed(origin)?;
    let (random_bytes, _) = T::Randomness::random(b"nft-rarity");
    let rarity = u8::from(random_bytes.as_ref()[0]) % 100;
    // rarity có thể biased bởi attackers kiểm soát recent blocks
    Ok(())
}
```

### BR3: Reveal trước khi commit — Sử dụng randomness cùng block với trigger

```rust
// VULNERABLE — user gửi tx trong cùng block biết kết quả trước
pub fn enter_lottery(origin: OriginFor<T>, ticket_id: u32) -> DispatchResult {
    let who = ensure_signed(origin)?;

    // Randomness TRONG CÙNG BLOCK với tx của user
    let (randomness, _) = T::Randomness::random(b"lottery");
    let winner = u32::from_le_bytes(randomness.as_ref()[..4].try_into().unwrap())
        % TotalTickets::<T>::get();

    if winner == ticket_id {
        Pot::<T>::transfer_to(&who)?;
    }
    Ok(())
}
```

Nếu block author là người cũng muốn thắng: họ có thể chạy simulation, biết randomness của block hiện tại, và chỉ include transaction của mình nếu `ticket_id` của họ khớp. Đây là **"look-ahead" attack** hay **"front-running on-chain randomness"**.

**Fix**: Commit-reveal pattern — user commit hash(secret) trước, reveal sau nhiều block, kết hợp secret + future_block_hash để tạo randomness.

---

## Pattern An toàn — Commit-Reveal

Commit-reveal là cách phổ biến nhất để tạo randomness công bằng cho high-stakes applications:

```rust
// Phase 1: User commit hash của secret
pub fn commit(
    origin: OriginFor<T>,
    commitment: T::Hash, // hash(secret + nonce)
) -> DispatchResult {
    let who = ensure_signed(origin)?;
    let reveal_block = frame_system::Pallet::<T>::block_number()
        + T::RevealDelay::get(); // ví dụ: 10 blocks

    Commitments::<T>::insert(&who, (commitment, reveal_block));
    Ok(())
}

// Phase 2: User reveal secret sau N blocks
pub fn reveal(
    origin: OriginFor<T>,
    secret: u64,
    nonce: u64,
) -> DispatchResult {
    let who = ensure_signed(origin)?;
    let (commitment, reveal_block) = Commitments::<T>::get(&who)
        .ok_or(Error::<T>::NoCommitment)?;
    let current_block = frame_system::Pallet::<T>::block_number();

    ensure!(current_block >= reveal_block, Error::<T>::TooEarly);

    // Verify commitment
    let hash = T::Hashing::hash_of(&(secret, nonce));
    ensure!(hash == commitment, Error::<T>::InvalidReveal);

    // Kết hợp secret của user với block_hash tại reveal_block
    // → không ai (kể cả block author) có thể predict đầy đủ
    let future_block_hash = frame_system::Pallet::<T>::block_hash(reveal_block);
    let final_randomness = T::Hashing::hash_of(&(secret, future_block_hash));

    // Dùng final_randomness cho logic
    // ...
    Ok(())
}
```

Commit-reveal đảm bảo:
- **User không thể cheat**: đã commit trước khi biết block_hash tương lai
- **Block author không thể cheat**: secret của user chưa biết khi tạo block tại reveal_block
- Cần 2 transactions thay vì 1 → friction cho user

---

## Audit Pattern — Nhận diện Bad Randomness

```bash
# Tìm usage của randomness trong pallets
rg 'Randomness\|random\|block_hash\|random_seed' pallets/ --type rust

# Tìm collective_flip usage (insecure)
rg 'CollectiveFlip\|insecure_randomness\|collective_flip' pallets/ runtime/ --type rust

# Tìm block_number dùng làm seed
rg 'block_number.*seed\|seed.*block_number\|rand.*block' pallets/ --type rust
```

Với mỗi usage của randomness:
1. Source là gì? (`block_hash`, `collective_flip`, BABE?)
2. Stakes là gì? (Ai được lợi nếu thao túng được?)
3. Randomness được dùng trong cùng block với user trigger không? (look-ahead risk)
4. Block author có incentive để manipulate không?

---

## Summary — Key Takeaways

- **Blockchain determinism** → không có true randomness on-chain; mọi nguồn đều có trade-offs.
- **Block author control**: bất kỳ randomness nào từ block data đều có thể bị block author thao túng nếu lợi ích đủ lớn.
- **`block_hash`**: không bao giờ dùng cho security-sensitive logic.
- **`collective_flip`**: chỉ testing — tên đã nói rõ: "insecure".
- **BABE VRF**: tốt nhất hiện có trong Substrate, phù hợp cho low-to-medium stakes.
- **Commit-reveal**: pattern an toàn nhất cho high-stakes randomness — tách biệt thời điểm commit và reveal.
- **Audit**: tìm `block_hash`, `collective_flip` usage; hỏi "ai được lợi nếu manipulate?" và "stakes là bao nhiêu?".

---

## References

- Trail of Bits "Not So Smart Pallets — Bad Randomness" — secure-contracts.com/not-so-smart-contracts/substrate/randomness
- Substrate Randomness docs — docs.substrate.io/build/randomness
- pallet_babe randomness — paritytech.github.io/substrate/master/pallet_babe/index.html
- Tetcoin Substrate Recipes — Generating Randomness — core.tetcoin.org/recipes/randomness.html
