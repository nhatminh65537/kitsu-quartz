---
title: "A0. WABT Toolkit Reference"
tags: [webassembly, wasm, appendix, wabt, tools]
aliases: [WABT Reference]
created: 2026-03-24
---

> Cheat sheet đầy đủ cho WABT (WebAssembly Binary Toolkit) — bộ công cụ thiết yếu cho Wasm RE và development.
> Xem thêm: [[13-reverse-engineering-static|13. Static RE]], [[03-webassembly-text-format|03. WAT Format]]

---

## Cài đặt

```bash
# Ubuntu/Debian
sudo apt install wabt

# macOS
brew install wabt

# Build từ source (để có version mới nhất)
git clone --recursive https://github.com/WebAssembly/wabt
cd wabt && mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
make -j$(nproc)
sudo make install

# Kiểm tra version
wasm2wat --version
```

---

## wasm2wat — Binary → Text

Chuyển `.wasm` binary thành `.wat` text format (lossless).

```bash
# Cơ bản
wasm2wat input.wasm -o output.wat

# Tự động đặt tên cho unnamed items
wasm2wat --generate-names input.wasm -o output.wat

# Bỏ debug names (nếu có Name section)
wasm2wat --no-debug-names input.wasm -o output.wat

# In ra stdout thay vì file
wasm2wat input.wasm

# Enable experimental features
wasm2wat --enable-all input.wasm -o output.wat
wasm2wat --enable-threads input.wasm -o output.wat
wasm2wat --enable-simd input.wasm -o output.wat

# Verbose — hiện section boundaries
wasm2wat --verbose input.wasm 2>&1 | head -30
```

---

## wat2wasm — Text → Binary

```bash
# Cơ bản
wat2wasm input.wat -o output.wasm

# Bỏ qua validation (để test malformed modules)
wat2wasm --no-check input.wat -o output.wasm

# In binary ra stdout (để pipe)
wat2wasm input.wat -o /dev/stdout | xxd | head

# Verbose — hiện encoding details
wat2wasm --verbose input.wat -o output.wasm

# Enable SIMD/Threads khi compile
wat2wasm --enable-simd input.wat -o output.wasm
wat2wasm --enable-threads input.wat -o output.wasm
```

---

## wasm-objdump — Phân tích Module

```bash
# Tổng quan tất cả sections
wasm-objdump -x input.wasm

# Disassembly (WAT-like với offsets)
wasm-objdump -d input.wasm

# Hex dump raw bytes
wasm-objdump -s input.wasm

# Tất cả cùng lúc
wasm-objdump -xds input.wasm

# Chỉ một section cụ thể
wasm-objdump -j code input.wasm    # Code section
wasm-objdump -j data input.wasm    # Data section
wasm-objdump -j type input.wasm    # Type section
wasm-objdump -j export input.wasm  # Export section
wasm-objdump -j import input.wasm  # Import section

# Redirect to file (thường rất dài)
wasm-objdump -xds input.wasm > full_analysis.txt

# Grep patterns nhanh
wasm-objdump -d input.wasm | grep -n "call_indirect"
wasm-objdump -d input.wasm | grep -n "i32.xor"
wasm-objdump -d input.wasm | grep -n "func\["
```

Ý nghĩa các cột trong disassembly output:

```text
000105 func[3] <check_flag>:
 000106: 41 00                     | i32.const 0
 ↑        ↑                         ↑
 offset   hex bytes                 WAT instruction
```

---

## wasm2c — Binary → C Source

```bash
# Cơ bản — tạo file .c và .h
wasm2c input.wasm -o output.c

# Compile thành native object file
gcc -c output.c -o output.o \
  -I /usr/share/wabt/wasm2c/  # hoặc từ build dir

# Load vào IDA Pro hoặc Ghidra
# (Ghidra: File → Import File → chọn .o)

# Với Emscripten runtime headers
wasm2c input.wasm -o output.c
gcc -c output.c -o output.o -I $(em-config EMSCRIPTEN_ROOT)/system/include/
```

---

## wasm-decompile — Binary → Pseudo-C

```bash
# Nhanh nhưng kém chính xác hơn wasm2c
wasm-decompile input.wasm -o output.dcmp

# In ra stdout
wasm-decompile input.wasm 2>/dev/null | head -100

# Đọc một function cụ thể
wasm-decompile input.wasm 2>/dev/null | grep -A 30 "export function check"
```

---

## wasm-validate — Kiểm tra Tính hợp lệ

```bash
# Validate module
wasm-validate input.wasm && echo "Valid" || echo "Invalid"

# Verbose output
wasm-validate --verbose input.wasm

# Enable features (nếu module dùng proposals)
wasm-validate --enable-threads --enable-simd input.wasm

# Validate mà không kiểm tra features (more permissive)
wasm-validate --no-check input.wasm
```

---

## wasm-strip — Xóa Debug Sections

```bash
# Xóa Name section và debug info
wasm-strip input.wasm -o stripped.wasm

# Kiểm tra size reduction
ls -la input.wasm stripped.wasm

# Giữ lại tên nhất định
wasm-strip --keep-section=name input.wasm -o output.wasm
```

---

## wasm-interp — Chạy Module với Stack Interpreter

```bash
# Chạy module (phải có exported _start hoặc main)
wasm-interp input.wasm

# Gọi function cụ thể
wasm-interp input.wasm --run-all-exports

# Set trace level
wasm-interp --trace input.wasm
wasm-interp --trace=2 input.wasm  # verbose trace

# Với WASI
wasm-interp --wasi input.wasm -- arg1 arg2
```

---

## wasm-stats — Thống kê Instructions

```bash
# In thống kê instruction distribution
wasm-stats input.wasm

# Sắp xếp theo số lần xuất hiện
wasm-stats input.wasm | sort -t: -k2 -rn | head -20

# Ví dụ output:
# i32.load: 1243
# i32.store: 987
# local.get: 3421
# call: 456
# call_indirect: 23   ← CFI attack surface
```

---

## Quick Workflows cho RE

### Workflow 1: Tổng quan nhanh một binary lạ

```bash
file input.wasm
wasm-validate input.wasm
wasm-objdump -x input.wasm 2>&1 | head -60
strings input.wasm | grep -E '[A-Za-z]{5,}' | sort -u | head -30
wasm-stats input.wasm | sort -rn | head -10
```

### Workflow 2: Extract flag từ data segment

```bash
wasm-objdump -s input.wasm | grep -A 50 "Contents of section Data"
# Đọc hex, decode manually hoặc dùng Python script
python3 -c "
data = bytes.fromhex('replace_with_hex')
print(data)
print([chr(b) for b in data if 32 <= b < 127])
"
```

### Workflow 3: Tìm function theo pattern

```bash
wasm2wat input.wasm 2>/dev/null | grep -n "i32.xor\|call_indirect\|memcmp"
wasm2wat input.wasm 2>/dev/null | awk '/func \$/{name=$0} /i32.xor/{print name}' | sort -u
```

### Workflow 4: Round-trip để patch

```bash
wasm2wat input.wasm -o temp.wat
# Edit temp.wat...
wat2wasm temp.wat -o patched.wasm
wasm-validate patched.wasm && echo "Patch valid"
```

---

## References

- WABT GitHub — https://github.com/WebAssembly/wabt
- wasm2wat docs — https://webassembly.github.io/wabt/doc/wasm2wat.1.html
- Các bài liên quan: [[03-webassembly-text-format|03. WAT Format]], [[04-binary-format-va-encoding|04. Binary Format]], [[13-reverse-engineering-static|13. Static RE]]
