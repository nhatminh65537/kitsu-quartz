---
title: "A2. Binary Format Reference"
tags: [webassembly, wasm, appendix, binary-format, leb128]
aliases: [Wasm Binary Reference]
created: 2026-03-24
---

> Chi tiết section-by-section về binary encoding của Wasm module.
> Xem thêm: [[04-binary-format-va-encoding|04. Binary Format & Encoding]]

---

## Module Layout

```text
┌─────────────────────────────────────────┐
│ Magic: 00 61 73 6D (\0asm)              │
│ Version: 01 00 00 00 (u32 LE)           │
├─────────────────────────────────────────┤
│ Section 1: [id][size][content]          │
│ Section 2: [id][size][content]          │
│ ...                                     │
└─────────────────────────────────────────┘
```

---

## Section IDs

| ID | Tên | Nội dung |
|----|-----|---------|
| 0 | Custom | Tùy ý (name, DWARF, debug...) |
| 1 | Type | Function signatures |
| 2 | Import | External imports |
| 3 | Function | Type indices cho functions |
| 4 | Table | Table declarations |
| 5 | Memory | Memory declarations |
| 6 | Global | Global variable declarations |
| 7 | Export | Exported items |
| 8 | Start | Entry function index |
| 9 | Element | Table initialization |
| 10 | Code | Function bodies (bytecode) |
| 11 | Data | Memory initialization |
| 12 | DataCount | (bulk-memory proposal) |

---

## LEB128 Quick Reference

**Unsigned LEB128** — encode/decode unsigned integers:

```python
def encode_uleb128(n: int) -> bytes:
    result = []
    while True:
        b = n & 0x7F
        n >>= 7
        if n: b |= 0x80
        result.append(b)
        if not n: break
    return bytes(result)

def decode_uleb128(data: bytes, pos: int = 0):
    result, shift = 0, 0
    while True:
        b = data[pos]; pos += 1
        result |= (b & 0x7F) << shift
        shift += 7
        if not (b & 0x80): break
    return result, pos

# Examples:
# 1      → 0x01 (1 byte)
# 127    → 0x7F (1 byte — max 1-byte unsigned)
# 128    → 0x80 0x01 (2 bytes)
# 300    → 0xAC 0x02
# 624485 → 0xE5 0x8E 0x26
```

**Signed LEB128** — dùng cho constants (`i32.const`, `i64.const`):

```python
def encode_sleb128(value: int) -> bytes:
    result = []
    more = True
    while more:
        byte = value & 0x7F
        value >>= 7
        if (value == 0 and not (byte & 0x40)) or \
           (value == -1 and (byte & 0x40)):
            more = False
        else:
            byte |= 0x80
        result.append(byte)
    return bytes(result)

# Examples:
# 0   → 0x00
# 1   → 0x01
# -1  → 0x7F
# 63  → 0x3F
# 64  → 0xC0 0x00
# -64 → 0x40
# -65 → 0xBF 0x7F
```

---

## Value Type Encoding

| Byte | Type |
|------|------|
| `0x7F` | `i32` |
| `0x7E` | `i64` |
| `0x7D` | `f32` |
| `0x7C` | `f64` |
| `0x70` | `funcref` |
| `0x6F` | `externref` |
| `0x7B` | `v128` (SIMD) |

---

## Section Formats chi tiết

### Type Section (ID=1)

```text
num_types: uLEB128
for each type:
  0x60: func type marker
  num_params: uLEB128
  params: [valtype]*
  num_results: uLEB128
  results: [valtype]*
```

Ví dụ: Type `(i32, i32) -> i32`:
```text
01          num_types = 1
60          func type
02          num_params = 2
7f 7f       i32, i32
01          num_results = 1
7f          i32
```

### Import Section (ID=2)

```text
num_imports: uLEB128
for each import:
  module_name_len: uLEB128
  module_name: bytes
  field_name_len: uLEB128
  field_name: bytes
  import_kind: byte (0=func, 1=table, 2=mem, 3=global)
  type_index: uLEB128 (if func)
```

### Export Section (ID=7)

```text
num_exports: uLEB128
for each export:
  name_len: uLEB128
  name: bytes
  export_kind: byte (0=func, 1=table, 2=mem, 3=global)
  index: uLEB128
```

### Code Section (ID=10)

```text
num_functions: uLEB128
for each function:
  body_size: uLEB128         ← tổng size của body
  num_locals: uLEB128
  for each local group:
    count: uLEB128
    valtype: byte
  [instructions bytecode]
  0x0B                       ← end opcode
```

### Data Section (ID=11)

```text
num_segments: uLEB128
for each segment:
  flags: uLEB128   (0 = active, default memory)
  0x41             ← i32.const opcode
  offset: sLEB128  ← memory offset
  0x0B             ← end opcode
  size: uLEB128
  data: [bytes]
```

---

## Hexdump Walkthrough — Module `(a+b)`

```text
WAT:
(module
  (func $add (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.add)
  (export "add" (func 0))
)

Hex + annotation:
00 61 73 6d    → magic: \0asm
01 00 00 00    → version: 1

01             → section ID: Type (1)
07             → section size: 7 bytes
  01           → num types: 1
  60           → func type marker
  02           → num params: 2
  7f 7f        → i32, i32
  01           → num results: 1
  7f           → i32

03             → section ID: Function (3)
02             → section size: 2 bytes
  01           → num functions: 1
  00           → func[0] uses type[0]

07             → section ID: Export (7)
07             → section size: 7 bytes
  01           → num exports: 1
  03           → name length: 3
  61 64 64     → "add"
  00           → kind: function (0)
  00           → function index: 0

0a             → section ID: Code (10)
09             → section size: 9 bytes
  01           → num function bodies: 1
  07           → body size: 7 bytes
  00           → num local groups: 0
  20 00        → local.get 0  (opcode 0x20, uleb128 0)
  20 01        → local.get 1  (opcode 0x20, uleb128 1)
  6a           → i32.add      (opcode 0x6A)
  0b           → end          (opcode 0x0B)
```

---

## Custom Section — Name Section Format

Name section (custom, ID=0, name="name") lưu debug symbols:

```text
Custom Section header:
  00           → section ID: Custom
  size         → uLEB128 size

  04           → name length: 4
  6e 61 6d 65  → "name" (section name)

  Subsection 1 (function names):
  01           → subsection type: function names
  size         → uLEB128
  num_entries: uLEB128
  for each:
    func_index: uLEB128
    name_len: uLEB128
    name: bytes
```

---

## References

- WebAssembly Binary Encoding Spec — https://webassembly.github.io/spec/core/binary/
- LEB128 Wikipedia — https://en.wikipedia.org/wiki/LEB128
- Wasm Binary Explorer (interactive) — https://webassembly.github.io/wabt/demo/wasm2wat/
- Bài liên quan: [[04-binary-format-va-encoding|04. Binary Format & Encoding]]
