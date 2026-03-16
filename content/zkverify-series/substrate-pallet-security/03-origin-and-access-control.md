---
title: "03. Origin & Access Control"
tags: [security, substrate, frame, origin, access-control, bad-origin, lesson-03]
aliases: [Origin and Access Control]
created: 2026-03-16
---

> **Prerequisites**: [[01-frame-architecture|01. FRAME Architecture]], [[02-extrinsics-and-dispatch|02. Extrinsics & Dispatch]] — biết extrinsic là gì, `ensure_signed`, `DispatchResult`
> **Objectives**:
> - Hiểu đầy đủ hệ thống Origin trong Substrate: Root, Signed, None, Custom
> - Phân loại các lỗi Bad Origin và cách chúng xảy ra
> - Biết cách dùng Custom Origin đúng cách qua `EnsureOrigin` trait
> - Nhận ra Bad Origin trong code audit và viết PoC đơn giản

---

## Motivation

Access control là lớp bảo vệ đầu tiên của bất kỳ pallet nào. Mọi extrinsic đều có một câu hỏi cốt lõi: **"Người gọi này có được phép làm điều này không?"**

Trong EVM, câu hỏi đó thường được trả lời bằng `require(msg.sender == owner)`. Trong FRAME, câu trả lời phức tạp hơn vì có nhiều loại "người gọi" hơn — và nhiều cách để kiểm tra sai.

Trail of Bits liệt kê Bad Origin là một trong 7 vulnerability class quan trọng nhất của FRAME pallets. Immunefi phân loại nó ở mức **Critical** khi cho phép arbitrary state change, hoặc **High** khi cho phép escalate privilege không hợp lệ.

---

## Hệ thống Origin

### Ba Origin nguyên thủy

Substrate định nghĩa 3 origin cơ bản trong `frame_system`:

```rust
pub enum RawOrigin<AccountId> {
    Root,           // quyền cao nhất — governance/sudo
    Signed(AccountId), // user ký transaction
    None,           // unsigned, hoặc inherent
}
```

Mỗi origin ánh xạ đến một kiểm tra cụ thể:

| Origin | Hàm kiểm tra | Trả về | Dùng khi |
|--------|-------------|--------|---------|
| `Root` | `ensure_root(origin)?` | `()` | Admin actions, governance, sudo |
| `Signed` | `ensure_signed(origin)?` | `T::AccountId` | Hầu hết extrinsics của user |
| `None` | `ensure_none(origin)?` | `()` | Unsigned extrinsics, inherents |

### Cách `ensure_signed` hoạt động

```rust
// Trong frame_system/src/lib.rs (đơn giản hóa):
pub fn ensure_signed<OuterOrigin, AccountId>(
    o: OuterOrigin,
) -> Result<AccountId, BadOrigin>
where
    OuterOrigin: Into<Result<RawOrigin<AccountId>, OuterOrigin>>,
{
    match o.into() {
        Ok(RawOrigin::Signed(t)) => Ok(t),
        _ => Err(BadOrigin),
    }
}
```

Nếu origin không phải là `Signed`, trả về `Err(BadOrigin)` → `DispatchError::BadOrigin`. Với `?` operator, extrinsic tự động return early.

```rust
pub fn do_something(origin: OriginFor<T>, value: u32) -> DispatchResult {
    let who = ensure_signed(origin)?;
    // Nếu origin là Root hoặc None → hàm đã return Err ở đây
    // Chỉ đến đây nếu có chữ ký hợp lệ
    // ...
    Ok(())
}
```

---

## Vulnerability Class — Bad Origin

### V1: Thiếu origin check hoàn toàn

Đây là lỗi nặng nhất — không gọi bất kỳ `ensure_*` nào. Ai cũng gọi được extrinsic, kể cả unsigned.

```rust
// VULNERABLE — KHÔNG có origin check
#[pallet::weight(10_000)]
pub fn force_set_admin(
    origin: OriginFor<T>,
    new_admin: T::AccountId,
) -> DispatchResult {
    // origin hoàn toàn bị bỏ qua!
    Admin::<T>::put(new_admin);
    Ok(())
}
```

**Impact**: Bất kỳ ai — thậm chí không cần tài khoản, chỉ cần gửi unsigned transaction — có thể gọi `force_set_admin` và thay admin thành tài khoản của mình.

```rust
// FIX: thêm ensure_root nếu chỉ governance được phép
#[pallet::weight(10_000)]
pub fn force_set_admin(
    origin: OriginFor<T>,
    new_admin: T::AccountId,
) -> DispatchResult {
    ensure_root(origin)?;
    Admin::<T>::put(new_admin);
    Ok(())
}
```

### V2: Dùng `ensure_signed` cho privileged operation

Lỗi tinh tế hơn: kiểm tra có origin check, nhưng dùng `ensure_signed` thay vì `ensure_root` cho thao tác đòi hỏi quyền cao hơn.

```rust
// VULNERABLE — bất kỳ account nào cũng có thể pause chain!
#[pallet::weight(10_000)]
pub fn emergency_pause(origin: OriginFor<T>) -> DispatchResult {
    let _who = ensure_signed(origin)?;  // chỉ cần signed, không cần root
    Paused::<T>::put(true);
    Ok(())
}
```

**Impact**: Attacker tạo account, gửi transaction với fee nhỏ → pause toàn bộ protocol.

```rust
// FIX
pub fn emergency_pause(origin: OriginFor<T>) -> DispatchResult {
    ensure_root(origin)?;  // hoặc dùng Custom Origin (xem bên dưới)
    Paused::<T>::put(true);
    Ok(())
}
```

### V3: Origin check không đủ — thiếu ownership validation

Có `ensure_signed` nhưng không kiểm tra xem account đó có **quyền sở hữu** resource cụ thể không.

```rust
// VULNERABLE — bất kỳ signed user nào cũng có thể xóa domain của người khác
#[pallet::weight(10_000)]
pub fn remove_domain(
    origin: OriginFor<T>,
    domain_id: DomainId,
) -> DispatchResult {
    let _who = ensure_signed(origin)?;  // check có signed...
    // ... nhưng KHÔNG check _who có phải owner của domain_id không!
    Domains::<T>::remove(domain_id);
    Ok(())
}
```

**Impact**: Alice có thể xóa domain của Bob.

```rust
// FIX
pub fn remove_domain(
    origin: OriginFor<T>,
    domain_id: DomainId,
) -> DispatchResult {
    let who = ensure_signed(origin)?;
    let domain = Domains::<T>::get(domain_id)
        .ok_or(Error::<T>::DomainNotFound)?;
    ensure!(domain.owner == who, Error::<T>::NotDomainOwner);
    Domains::<T>::remove(domain_id);
    Ok(())
}
```

### V4: Dùng `ensure_signed_or_root` không đúng ngữ cảnh

`ensure_signed_or_root` trả về `Option<T::AccountId>` — `None` nếu Root, `Some(account)` nếu Signed. Lỗi xảy ra khi không xử lý đúng case `None`:

```rust
// VULNERABLE — khi Root gọi, who = None → skip ownership check!
pub fn update_config(
    origin: OriginFor<T>,
    new_value: u32,
) -> DispatchResult {
    let who = ensure_signed_or_root(origin)?;
    // who là Option<T::AccountId>
    // Nếu Root → who = None
    if let Some(account) = who {
        ensure!(account == Admin::<T>::get(), Error::<T>::NotAdmin);
    }
    // Nếu Root gọi → bỏ qua toàn bộ check → ai cũng có thể dùng Root origin
    Config::<T>::put(new_value);
    Ok(())
}
```

Đây không phải lỗi trực tiếp (Root thường được phép), nhưng cần hiểu rõ: **Root bypass mọi custom permission check**. Nếu design của pallet không muốn Root override, phải dùng `ensure_signed` thay vì `ensure_signed_or_root`.

---

## Custom Origins — EnsureOrigin Trait

Khi cần permission phức tạp hơn Root/Signed/None, dùng **Custom Origin** qua `EnsureOrigin` trait.

### Khai báo Custom Origin trong Config

```rust
#[pallet::config]
pub trait Config: frame_system::Config {
    /// Origin được phép thực hiện privileged operations
    type AdminOrigin: EnsureOrigin<Self::RuntimeOrigin>;

    /// Origin được phép force-clear domain
    type ForceOrigin: EnsureOrigin<Self::RuntimeOrigin>;
}
```

### Dùng Custom Origin trong extrinsic

```rust
#[pallet::weight(10_000)]
pub fn admin_action(origin: OriginFor<T>) -> DispatchResult {
    T::AdminOrigin::ensure_origin(origin)?;
    // Chỉ đến đây nếu origin pass được AdminOrigin check
    // ...
    Ok(())
}
```

### Implement Custom Origin tại runtime

```rust
// Trong runtime/src/lib.rs:
impl pallet_my_module::Config for Runtime {
    // Chỉ Root hoặc 2/3 majority của Council mới là AdminOrigin
    type AdminOrigin = EitherOfDiverse<
        EnsureRoot<AccountId>,
        EnsureProportionAtLeast<AccountId, CouncilCollective, 2, 3>,
    >;

    // Chỉ Root mới là ForceOrigin
    type ForceOrigin = EnsureRoot<AccountId>;
}
```

> [!info] Các `EnsureOrigin` implementations có sẵn trong FRAME
>
> | Type | Điều kiện pass |
> |------|---------------|
> | `EnsureRoot<A>` | Origin là Root |
> | `EnsureSigned<A>` | Origin là Signed |
> | `EnsureSignedBy<Who, A>` | Signed bởi account trong whitelist `Who` |
> | `EnsureNone<A>` | Origin là None |
> | `EitherOf<A, B>` | A pass HOẶC B pass |
> | `EitherOfDiverse<A, B>` | A pass HOẶC B pass (nhưng A và B không overlap) |
> | `EnsureProportionAtLeast<A, C, N, D>` | Ít nhất N/D members của collective C đồng ý |

### Tại sao dùng Custom Origin thay vì hardcode?

```rust
// BAD — hardcode logic permission trong pallet
pub fn privileged_action(origin: OriginFor<T>) -> DispatchResult {
    let who = ensure_signed(origin)?;
    ensure!(who == HardcodedAdmin::<T>::get(), Error::<T>::NotAdmin);
    // ...
}

// GOOD — delegate permission logic ra ngoài pallet
pub fn privileged_action(origin: OriginFor<T>) -> DispatchResult {
    T::PrivilegedOrigin::ensure_origin(origin)?;
    // Ai là "privileged" do runtime quyết định, không phải pallet
    // ...
}
```

Lợi ích: Pallet không cần biết "ai là admin". Runtime tự cấu hình. Dễ upgrade permission model mà không cần thay đổi pallet logic.

---

## Pattern nhận diện Bad Origin khi audit

Khi đọc code pallet, scan theo thứ tự sau:

**Bước 1**: Tìm tất cả `#[pallet::call]` functions. Mỗi function có `origin: OriginFor<T>` là parameter đầu tiên.

**Bước 2**: Kiểm tra dòng đầu tiên của mỗi function — có `ensure_*` call không?

```bash
# Dùng ripgrep để tìm functions không có origin check:
rg "pub fn" pallets/ -A 3 | grep -v "ensure_signed\|ensure_root\|ensure_none\|ensure_origin"
```

**Bước 3**: Với mỗi function có `ensure_signed`, kiểm tra xem `who` (AccountId trả về) có được dùng để validate ownership không.

**Bước 4**: Với mỗi privileged function (pause, force_*, admin_*), kiểm tra xem có dùng `ensure_root` hoặc Custom Origin không — nếu chỉ dùng `ensure_signed` → cờ đỏ.

---

## Ví dụ thực tế — Pattern trong zkVerify

Trong codebase zkVerify, pattern điển hình của privileged operation trông như sau (từ `pallet_aggregate`):

```rust
#[pallet::call]
impl<T: Config> Pallet<T> {
    // Hành động bình thường — chỉ cần signed user
    #[pallet::weight(T::WeightInfo::submit_proof())]
    pub fn submit_proof(
        origin: OriginFor<T>,
        vk_hash: H256,
        proof: Proof,
    ) -> DispatchResult {
        let who = ensure_signed(origin)?;
        // ...
    }

    // Hành động đặc quyền — cần ForceOrigin (Root hoặc governance)
    #[pallet::weight(T::WeightInfo::force_set_vk())]
    pub fn force_set_vk(
        origin: OriginFor<T>,
        vk: VerificationKey,
    ) -> DispatchResult {
        T::ForceOrigin::ensure_origin(origin)?;
        // Root hoặc governance có thể override verification key
        // ...
    }
}
```

> [!warning] Câu hỏi audit cho zkVerify
> Khi xem xét các pallet của zkVerify, đặt câu hỏi:
> - `ForceOrigin` được cấu hình là gì trong runtime? Root only? Hay có governance path?
> - Có extrinsic nào cho phép update verification key / proof parameters mà chỉ dùng `ensure_signed`?
> - Có extrinsic nào với tên `force_*`, `admin_*`, `emergency_*`, `pause_*` dùng origin yếu hơn cần thiết?

---

## Summary — Key Takeaways

- **3 origin nguyên thủy**: `Root` (superuser), `Signed(AccountId)` (user thường), `None` (unsigned/inherent).
- **Hàm kiểm tra**: `ensure_root`, `ensure_signed`, `ensure_none` — đặt ở **dòng đầu tiên** của mỗi extrinsic.
- **4 loại Bad Origin**: thiếu hoàn toàn, dùng level thấp cho privileged op, thiếu ownership check, misuse `ensure_signed_or_root`.
- **Custom Origin** qua `EnsureOrigin` trait — tách permission logic ra khỏi pallet, cấu hình tại runtime.
- **Audit pattern**: scan tất cả `pub fn` trong `#[pallet::call]` → kiểm tra dòng đầu → flag `ensure_signed` trên privileged functions.

---

## References

- Trail of Bits "Not So Smart Pallets — Bad Origin" — secure-contracts.com/not-so-smart-contracts/substrate/origins
- frame_system docs — EnsureOrigin, ensure_signed, ensure_root
- Substrate Origins docs — substrate.dev/docs/en/knowledgebase/runtime/origin
- FRAME Membership pallet — ví dụ Custom Origin thực tế — github.com/paritytech/substrate/frame/membership
