---
title: "A1. WAT Instruction Reference"
tags: [webassembly, wasm, appendix, wat, instructions, reference]
aliases: [WAT Instructions, Wasm Opcodes]
created: 2026-03-24
---

> Bảng tra cứu đầy đủ các instruction trong WebAssembly Text Format.
> Xem thêm: [[03-webassembly-text-format|03. WAT Format]], [[02-kien-truc-wasm-stack-machine|02. Stack Machine]]

---

## Ký hiệu

- **Stack effect**: `[inputs] → [outputs]` — mô tả stack trước và sau instruction
- **T**: bất kỳ value type nào (`i32`, `i64`, `f32`, `f64`)
- `→` trap nếu điều kiện không thỏa

---

## Control Instructions

| Instruction | Stack effect | Mô tả |
|-------------|-------------|-------|
| `unreachable` | `[] → []` | Trap ngay lập tức |
| `nop` | `[] → []` | Không làm gì |
| `block (result T?)` ... `end` | `[] → [T?]` | Tạo label; `br` nhảy đến sau `end` |
| `loop (result T?)` ... `end` | `[] → [T?]` | Tạo label; `br` nhảy đến trước `end` (lặp) |
| `if (result T?)` ... `end` | `[i32] → [T?]` | Pop i32; nếu ≠ 0 thực thi if-branch |
| `if (result T?)` ... `else` ... `end` | `[i32] → [T?]` | if/else |
| `br $label` | `[] → []` | Nhảy đến label |
| `br_if $label` | `[i32] → []` | Nhảy nếu top ≠ 0 |
| `br_table $l0 $l1 ... $default` | `[i32] → []` | Nhảy theo bảng (switch-case) |
| `return` | `[T*] → []` | Trả về từ function |
| `call $func` | `[params] → [results]` | Direct call |
| `call_indirect (type $sig)` | `[params, i32] → [results]` | Indirect call qua Table; i32 = Table index |
| `drop` | `[T] → []` | Bỏ giá trị trên đỉnh stack |
| `select` | `[T, T, i32] → [T]` | Chọn giá trị thứ nhất nếu i32≠0, thứ hai nếu =0 |

---

## Variable Instructions

| Instruction | Stack effect | Mô tả |
|-------------|-------------|-------|
| `local.get $x` | `[] → [T]` | Push giá trị local $x |
| `local.set $x` | `[T] → []` | Pop và lưu vào local $x |
| `local.tee $x` | `[T] → [T]` | Lưu vào $x nhưng giữ lại trên stack |
| `global.get $g` | `[] → [T]` | Push giá trị global $g |
| `global.set $g` | `[T] → []` | Pop và lưu vào mutable global $g |

---

## Memory Instructions

Tất cả memory instructions có dạng `T.load/store [offset=N] [align=M]`.

### Load (đọc từ memory)

| Instruction | Result | Mô tả |
|-------------|--------|-------|
| `i32.load` | i32 | Đọc 4 bytes |
| `i64.load` | i64 | Đọc 8 bytes |
| `f32.load` | f32 | Đọc 4 bytes float |
| `f64.load` | f64 | Đọc 8 bytes double |
| `i32.load8_s` | i32 | Đọc 1 byte, sign-extend |
| `i32.load8_u` | i32 | Đọc 1 byte, zero-extend |
| `i32.load16_s` | i32 | Đọc 2 bytes, sign-extend |
| `i32.load16_u` | i32 | Đọc 2 bytes, zero-extend |
| `i64.load8_s/u` | i64 | Đọc 1 byte, extend thành i64 |
| `i64.load16_s/u` | i64 | Đọc 2 bytes, extend |
| `i64.load32_s/u` | i64 | Đọc 4 bytes, extend |

Stack effect: `[i32] → [T]` — pop địa chỉ, push giá trị.

### Store (ghi vào memory)

| Instruction | Mô tả |
|-------------|-------|
| `i32.store` | Ghi 4 bytes i32 |
| `i64.store` | Ghi 8 bytes i64 |
| `f32.store` | Ghi 4 bytes float |
| `f64.store` | Ghi 8 bytes double |
| `i32.store8` | Ghi 1 byte (truncate i32) |
| `i32.store16` | Ghi 2 bytes |
| `i64.store8/16/32` | Ghi 1/2/4 bytes từ i64 |

Stack effect: `[i32, T] → []` — pop địa chỉ và giá trị.

### Memory Management

| Instruction | Stack effect | Mô tả |
|-------------|-------------|-------|
| `memory.size` | `[] → [i32]` | Push số page hiện tại |
| `memory.grow` | `[i32] → [i32]` | Tăng N pages; trả về số page cũ hoặc -1 |
| `memory.copy` | `[i32, i32, i32] → []` | Copy N bytes từ src đến dst |
| `memory.fill` | `[i32, i32, i32] → []` | Fill N bytes tại addr với value |

---

## Numeric Instructions — i32

### Constants và Compare

| Instruction | Effect | Mô tả |
|-------------|--------|-------|
| `i32.const N` | `[] → [i32]` | Push hằng N |
| `i32.eqz` | `[i32] → [i32]` | 1 nếu = 0, ngược lại 0 |
| `i32.eq` | `[i32,i32] → [i32]` | Equal |
| `i32.ne` | `[i32,i32] → [i32]` | Not equal |
| `i32.lt_s` | `[i32,i32] → [i32]` | Less than (signed) |
| `i32.lt_u` | `[i32,i32] → [i32]` | Less than (unsigned) |
| `i32.gt_s/u` | `[i32,i32] → [i32]` | Greater than |
| `i32.le_s/u` | `[i32,i32] → [i32]` | Less or equal |
| `i32.ge_s/u` | `[i32,i32] → [i32]` | Greater or equal |

### Arithmetic và Bitwise

| Instruction | Effect | Mô tả |
|-------------|--------|-------|
| `i32.add` | `[i32,i32] → [i32]` | a + b (wrapping) |
| `i32.sub` | `[i32,i32] → [i32]` | a - b (wrapping) |
| `i32.mul` | `[i32,i32] → [i32]` | a * b (wrapping) |
| `i32.div_s` | `[i32,i32] → [i32]` | a / b (signed) → trap if b=0 |
| `i32.div_u` | `[i32,i32] → [i32]` | a / b (unsigned) |
| `i32.rem_s` | `[i32,i32] → [i32]` | a % b (signed) |
| `i32.rem_u` | `[i32,i32] → [i32]` | a % b (unsigned) |
| `i32.and` | `[i32,i32] → [i32]` | Bitwise AND |
| `i32.or` | `[i32,i32] → [i32]` | Bitwise OR |
| `i32.xor` | `[i32,i32] → [i32]` | Bitwise XOR |
| `i32.shl` | `[i32,i32] → [i32]` | Left shift |
| `i32.shr_s` | `[i32,i32] → [i32]` | Arithmetic right shift |
| `i32.shr_u` | `[i32,i32] → [i32]` | Logical right shift |
| `i32.rotl` | `[i32,i32] → [i32]` | Rotate left |
| `i32.rotr` | `[i32,i32] → [i32]` | Rotate right |
| `i32.clz` | `[i32] → [i32]` | Count leading zeros |
| `i32.ctz` | `[i32] → [i32]` | Count trailing zeros |
| `i32.popcnt` | `[i32] → [i32]` | Count set bits |

---

## Numeric Instructions — i64

Tương tự i32 với suffix `i64`:

| Instruction | Mô tả |
|-------------|-------|
| `i64.const N` | Push hằng 64-bit |
| `i64.eqz/eq/ne/lt_s/lt_u/...` | So sánh |
| `i64.add/sub/mul/div_s/div_u/...` | Số học |
| `i64.and/or/xor/shl/shr_s/shr_u/...` | Bitwise |
| `i64.clz/ctz/popcnt` | Bit counting |

---

## Numeric Instructions — f32 / f64

| Instruction | Mô tả |
|-------------|-------|
| `f32.const F` | Push hằng float |
| `f32.eq/ne/lt/gt/le/ge` | So sánh (không có signed/unsigned) |
| `f32.add/sub/mul/div` | Số học |
| `f32.sqrt` | Căn bậc hai |
| `f32.min/max` | Min/max (NaN propagating) |
| `f32.floor/ceil/trunc/nearest` | Làm tròn |
| `f32.abs/neg` | Giá trị tuyệt đối / phủ định |
| `f32.copysign` | Copy dấu từ operand 2 sang 1 |

---

## Conversion Instructions

| Instruction | Mô tả |
|-------------|-------|
| `i32.wrap_i64` | i64 → i32 (truncate high bits) |
| `i64.extend_i32_s` | i32 → i64 (sign extend) |
| `i64.extend_i32_u` | i32 → i64 (zero extend) |
| `i32.trunc_f32_s/u` | f32 → i32 (trap if NaN/overflow) |
| `i32.trunc_f64_s/u` | f64 → i32 |
| `i64.trunc_f32_s/u` | f32 → i64 |
| `i64.trunc_f64_s/u` | f64 → i64 |
| `f32.convert_i32_s/u` | i32 → f32 |
| `f32.convert_i64_s/u` | i64 → f32 |
| `f64.convert_i32_s/u` | i32 → f64 |
| `f64.convert_i64_s/u` | i64 → f64 |
| `f32.demote_f64` | f64 → f32 |
| `f64.promote_f32` | f32 → f64 |
| `i32.reinterpret_f32` | Reinterpret bits f32 → i32 |
| `f32.reinterpret_i32` | Reinterpret bits i32 → f32 |

---

## Atomic Instructions (Threads Proposal)

| Instruction | Mô tả |
|-------------|-------|
| `i32.atomic.load` | Atomic load |
| `i32.atomic.store` | Atomic store |
| `i32.atomic.rmw.add` | Fetch-and-add |
| `i32.atomic.rmw.sub` | Fetch-and-sub |
| `i32.atomic.rmw.and` | Fetch-and-AND |
| `i32.atomic.rmw.or` | Fetch-and-OR |
| `i32.atomic.rmw.xor` | Fetch-and-XOR |
| `i32.atomic.rmw.xchg` | Atomic swap |
| `i32.atomic.rmw.cmpxchg` | Compare-and-swap |
| `memory.atomic.wait32` | Suspend thread; giống futex wait |
| `memory.atomic.wait64` | Suspend thread với i64 value |
| `memory.atomic.notify` | Wake N suspended threads |
| `atomic.fence` | Memory fence |

---

## SIMD Instructions (v128)

Tất cả SIMD instructions bắt đầu bằng kiểu lane (`f32x4`, `i32x4`, `i8x16`...).

| Instruction | Mô tả |
|-------------|-------|
| `v128.const ...` | Push hằng v128 |
| `v128.load` | Load 128-bit từ memory |
| `v128.store` | Store 128-bit vào memory |
| `f32x4.add/sub/mul/div` | SIMD arithmetic (4 floats song song) |
| `i32x4.add/sub/mul` | SIMD integer arithmetic |
| `i8x16.add/sub` | SIMD byte arithmetic |
| `f32x4.extract_lane N` | Lấy lane N ra thành f32 |
| `f32x4.replace_lane N` | Thay lane N với giá trị f32 |
| `i32x4.splat` | Broadcast i32 vào tất cả 4 lanes |
| `f32x4.min/max` | Lane-wise min/max |
| `v128.and/or/xor/not` | Bitwise SIMD |

---

## Opcode Nhanh — Các Opcodes Hay Gặp trong RE

| Opcode | Instruction |
|--------|------------|
| `0x00` | `unreachable` |
| `0x01` | `nop` |
| `0x02` | `block` |
| `0x03` | `loop` |
| `0x04` | `if` |
| `0x05` | `else` |
| `0x0B` | `end` |
| `0x0C` | `br` |
| `0x0D` | `br_if` |
| `0x0F` | `return` |
| `0x10` | `call` |
| `0x11` | `call_indirect` |
| `0x1A` | `drop` |
| `0x20` | `local.get` |
| `0x21` | `local.set` |
| `0x22` | `local.tee` |
| `0x23` | `global.get` |
| `0x24` | `global.set` |
| `0x28` | `i32.load` |
| `0x2C` | `i32.load8_s` |
| `0x2D` | `i32.load8_u` |
| `0x36` | `i32.store` |
| `0x3A` | `i32.store8` |
| `0x3F` | `memory.size` |
| `0x40` | `memory.grow` |
| `0x41` | `i32.const` |
| `0x45` | `i32.eqz` |
| `0x46` | `i32.eq` |
| `0x47` | `i32.ne` |
| `0x48` | `i32.lt_s` |
| `0x4B` | `i32.gt_s` |
| `0x4E` | `i32.le_s` |
| `0x51` | `i32.ge_s` |
| `0x67` | `i32.clz` |
| `0x68` | `i32.ctz` |
| `0x6A` | `i32.add` |
| `0x6B` | `i32.sub` |
| `0x6C` | `i32.mul` |
| `0x6D` | `i32.div_s` |
| `0x71` | `i32.and` |
| `0x72` | `i32.or` |
| `0x73` | `i32.xor` |
| `0x74` | `i32.shl` |
| `0x75` | `i32.shr_s` |
| `0x77` | `i32.rotl` |
| `0xFC 08` | `memory.copy` |
| `0xFC 0B` | `memory.fill` |

---

## References

- WebAssembly Specification (Instruction listing) — https://webassembly.github.io/spec/core/syntax/instructions.html
- WebAssembly binary encoding — https://webassembly.github.io/spec/core/binary/instructions.html
- WABT Instruction Cheat Sheet — https://github.com/RuMaxwell/WasmInstCheatSheet
