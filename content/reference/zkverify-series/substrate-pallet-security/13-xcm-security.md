---
title: "13. XCM Security"
tags: [security, substrate, xcm, cross-chain, origin-manipulation, filter, lesson-13]
aliases: [XCM Security]
created: 2026-03-16
---

> **Prerequisites**: [[02-extrinsics-and-dispatch|02. Extrinsics & Dispatch]], [[03-origin-and-access-control|03. Origin & Access Control]], [[05-weights-and-fees|05. Weights & Fees]]
> **Objectives**:
> - Hiểu XCM là gì và cách XCVM xử lý message
> - Phân loại các lỗi XCM configuration phổ biến
> - Biết 6 điểm kiểm tra bắt buộc khi audit XCM
> - Hiểu tại sao XCM là attack surface quan trọng trong zkVerify

---

## Motivation

XCM (Cross-Consensus Messaging) là protocol cho phép các chain trong hệ sinh thái Polkadot giao tiếp với nhau — chuyển assets, gọi extrinsics từ xa, relay messages. Đây là tính năng cực kỳ mạnh nhưng cũng là **attack surface rộng nhất** của Substrate parachain.

Một lỗi XCM có thể cho phép attacker từ chain khác:
- **Impersonate** một origin đặc quyền trên parachain của bạn
- **Drain assets** khỏi sovereign account của chain
- **Trigger privileged extrinsics** (emergency pause, governance bypass)
- **Gây DoS** qua message với weight tính toán sai

MixBytes ghi chú trong audit guide: "Incorrect privileges when sending XCM can cause an attacker to **send any transactions from a parachain address in a relay chain**."

---

## XCVM — XCM Virtual Machine

XCM message là một danh sách instruction được thực thi bởi XCVM — một state machine đặc biệt. Mỗi instruction có thể thay đổi các registers:

- **Origin Register**: "ai" đang thực thi message (quan trọng nhất về bảo mật)
- **Holding Register**: assets đang được xử lý
- **Weight Credit Register**: budget weight còn lại

Ví dụ một message teleport asset từ relay chain đến parachain:

```
Xcm([
    WithdrawAsset(assets),          // rút asset từ origin
    InitiateTeleport {
        assets: Wild(All),
        dest: parachain(id),
        xcm: Xcm([
            BuyExecution { fees, weight_limit },   // trả phí weight
            DepositAsset { assets: Wild(All), beneficiary },
        ])
    }
])
```

Khi message arrive tại parachain, XCVM được instantiated với origin = relay chain sovereign account.

---

## XCM Configuration — 6 điểm kiểm tra

Quarkslab (audit XCMv2 cho Parity) xác định 6 điểm cấu hình bắt buộc phải verify trước khi activate XCM:

### 1. Filters — `XcmExecuteFilter`, `XcmTeleportFilter`, `XcmReserveTransferFilter`

Ba filter quyết định loại operation nào được phép thực hiện từ extrinsic:

```rust
// Trong xcm_config.rs
impl pallet_xcm::Config for Runtime {
    // Ai được phép gọi pallet_xcm::execute()?
    type XcmExecuteFilter = Nothing;  // ← Tốt nhất: ban hoàn toàn
    // Ai được teleport asset?
    type XcmTeleportFilter = Nothing;
    // Ai được reserve transfer?
    type XcmReserveTransferFilter = Everything; // ← CẨN THẬN
}
```

> [!warning] `Everything` cho filter = cho phép bất kỳ ai gọi
> Nếu `XcmExecuteFilter = Everything`, bất kỳ user nào cũng có thể gọi `pallet_xcm::execute()` với message tùy ý. Attacker có thể craft message thực thi arbitrary logic với origin của chain.
>
> **Best practice**: Disable `execute` và `send` extrinsics (`Nothing`) cho đến khi bạn hiểu đầy đủ security implications.

### 2. Origin Converters — `OriginConverter` / `ExecuteXcmOrigin`

Khi message đến, XCVM cần convert XCM origin (dạng `Location`) thành Substrate origin (dạng `RuntimeOrigin`). `OriginConverter` định nghĩa mapping này:

```rust
pub type OriginConverter = (
    // Relay chain sovereign account → Root origin
    SovereignSignedViaLocation<SovereignAccountOf, RuntimeOrigin>,
    // Sibling parachain sovereign → Signed origin với account tương ứng
    RelayChainAsNative<RelayChainOrigin, RuntimeOrigin>,
    // Parent relay chain → Native relay origin
    ParentAsSuperuser<RuntimeOrigin>,  // ← RẤT NGUY HIỂM!
);
```

> [!warning] `ParentAsSuperuser` cho phép relay chain có Root origin
> `ParentAsSuperuser` convert relay chain origin thành **Root** origin trên parachain. Điều này có nghĩa: nếu ai đó có thể gửi message từ relay chain (kể cả qua governance), họ có Root privilege trên parachain.
>
> Trong hầu hết trường hợp đây là intentional (parachain tin tưởng relay chain). Nhưng cần verify: relay chain governance có thể bị exploit không?

### 3. Barriers — Ai được phép execute message

`Barrier` là tập hợp các rule kiểm tra message TRƯỚC khi execute. Mặc định cần ít nhất các rule sau:

```rust
pub type Barrier = (
    TakeWeightCredit,                          // dùng weight credit đã mua
    AllowTopLevelPaidExecutionFrom<Everything>, // phải BuyExecution trước
    AllowUnpaidExecutionFrom<ParentLocation>,   // relay chain miễn phí
    // AllowExplicitUnpaidExecutionFrom<...>     // cẩn thận khi mở rộng
);
```

> [!warning] Thiếu `AllowTopLevelPaidExecutionFrom` → DoS free
> Nếu không yêu cầu `BuyExecution` instruction, attacker có thể gửi message nặng mà không trả fee. Parachain phải xử lý message đó miễn phí → DoS.

### 4. Trusted Origins / IsReserve / IsTeleporter

Xác định chain nào được trust làm reserve hoặc teleporter cho assets cụ thể:

```rust
pub type TrustedTeleporters = (
    // Chỉ relay chain được teleport DOT
    NativeAsset<ParentLocation>,
);

pub type TrustedReserves = (
    // Trust tất cả sibling parachains làm reserve cho tất cả assets
    NativeAsset<Everything>,  // ← QUÁ RỘng!
);
```

Nếu trust một chain giả mạo làm reserve: chain đó có thể "teleport" assets không tồn tại → **infinite mint** trên parachain.

### 5. Weighers — Weight của XCM messages

XCM message phải được weight-estimate trước khi execute:

```rust
pub type Weigher = FixedWeightBounds<UnitWeightCost, RuntimeCall, MaxInstructions>;
```

Nếu `MaxInstructions` quá lớn → message dài → weight tính toán sai → DoS. Nếu `UnitWeightCost` quá thấp → fee không đủ → griefing attack.

### 6. Sender — Ai được gửi XCM messages

`SendXcmOrigin` kiểm tra ai được phép gọi `pallet_xcm::send()`:

```rust
type SendXcmOrigin = EnsureXcmOrigin<RuntimeOrigin, LocalOriginToLocation>;
```

Nếu quá permissive, bất kỳ user nào cũng có thể gửi arbitrary XCM message đến chain khác → attacker có thể spam relay chain hoặc sibling parachains.

---

## Vulnerability Classes

### XCM1: `unimplemented!()` trong message handler — chain halt

Một bug thực tế được phát hiện trong Rococo Bridge Hub:

```rust
// VULNERABLE — unimplemented!() = panic! → chain halt nếu receive message
impl ExportXcm for BridgeHubSwitchExporter {
    fn validate(...) -> SendResult<Self::Ticket> {
        match network {
            Rococo => ToBridgeHubRococoHaulBlobExporter::validate(/* ... */),
            Wococo => unimplemented!(), // ← PANIC khi Wococo message arrive
        }
    }
}
```

Bất kỳ parachain nào gửi XCM message đến Rococo Bridge Hub với network = Wococo sẽ trigger panic → chain halt.

**Lesson**: `unimplemented!()` và `todo!()` trong runtime code là critical bugs (đã học ở Lesson 06).

### XCM2: Origin manipulation qua `DescendOrigin`

XCM có instruction `DescendOrigin` cho phép message thay đổi origin của mình xuống sub-path:

```
Xcm([
    DescendOrigin(X1(Plurality { id: BodyId::Unit, part: BodyPart::Voice })),
    // Sau DescendOrigin, origin = Parent/Parachain(id)/Plurality(Unit, Voice)
    // Nếu chain này được trust làm admin...
    TransactItem { ... }
])
```

Nếu `OriginConverter` map `Plurality(Unit, Voice)` → Root origin → attacker từ sibling chain có thể escalate thành Root.

**Kiểm tra**: Mọi `OriginConverter` rule cần được review cẩn thận — đặc biệt là các rule convert non-relay origins thành elevated privileges.

### XCM3: Insufficient weight limit → message fail silently

```
Xcm([
    BuyExecution { fees: minimal_amount, weight_limit: Limited(100) },
    // ... heavy operations cần weight > 100
    DepositAsset { ... }
])
```

Nếu weight limit bị exceed, XCVM sẽ không thực thi phần còn lại của message. Assets có thể bị "stuck" trong holding register. Tùy implementation, assets có thể bị lost hoặc refunded.

---

## XCM trong zkVerify — Attack Surface

zkVerify là Substrate parachain kết nối với relay chain. Dựa trên review codebase và thông tin từ người đã audit:

**Đã được audit (Trail of Bits + SRLabs)**:
- Core pallets: `aggregate`, `token-claim`, `crl`, `tee-verifier`
- Runtime configuration hiện tại

**Chưa được audit đầy đủ** (theo report từ reviewer gần đây):
- **XCM integration**: được thêm vào sau audits, chưa có review chuyên sâu
- `XcmConfig` trong runtime — origin converters, barriers, filters
- Sovereign account privilege model

**Câu hỏi audit cụ thể cho zkVerify**:
```bash
# Tìm XCM configuration
rg 'xcm_config\|XcmConfig\|pallet_xcm' runtime/ --type rust

# Kiểm tra XcmExecuteFilter
rg 'XcmExecuteFilter\s*=\s*Everything' runtime/ --type rust

# Tìm OriginConverter chains
rg 'ParentAsSuperuser\|SovereignSignedViaLocation' runtime/ --type rust

# Kiểm tra Barrier configuration
rg 'Barrier\s*=\|type Barrier' runtime/ --type rust
```

---

## Summary — Key Takeaways

- **XCVM**: máy ảo thực thi XCM instruction list. Origin register là field quan trọng nhất về bảo mật.
- **6 điểm cấu hình**: Filters, OriginConverter, Barrier, TrustedOrigins, Weighers, Sender — tất cả phải verify.
- **`XcmExecuteFilter = Everything`**: bất kỳ user nào gọi execute với arbitrary message → critical.
- **`ParentAsSuperuser`**: relay chain có Root privilege trên parachain — cần justify.
- **`unimplemented!()` trong handler**: chain halt khi receive message → critical DoS.
- **Origin manipulation qua DescendOrigin**: có thể escalate privilege nếu OriginConverter không cẩn thận.
- **zkVerify XCM**: attack surface chưa được audit đầy đủ — XcmConfig, sovereign account model.

---

## References

- Quarkslab "A Brief Overview of Auditing XCMv2" — blog.quarkslab.com/a-brief-overview-of-auditing-xcmv2.html
- Polkadot Security Hub — XCM Misconfiguration — security.parity.io/xcm-misconfiguration
- MixBytes Substrate Audit Guide — mixbytes.io/blog/audit-of-substrate-pallets-overview-tips
- XCM reference docs — docs.substrate.io/reference/xcm-reference
