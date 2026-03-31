---
title: "03. WebAssembly Text Format (WAT)"
tags: [webassembly, wasm, lesson-03, wat, text-format]
aliases: [WAT, WebAssembly Text Format]
created: 2026-03-24
---

> **Prerequisites**: [[02-kien-truc-wasm-stack-machine|02. Kiến trúc Wasm — Stack Machine & Module]] — hiểu stack machine model, 4 kiểu dữ liệu, cấu trúc module và các section.
> **Objectives**:
> - Hiểu cú pháp S-expression của WAT và cách nó ánh xạ sang binary
> - Viết được hàm WAT với params, locals, return values
> - Sử dụng đầy đủ control flow: `if/else`, `block`, `loop`, `br`
> - Khai báo import, export, memory và data segment trong WAT
> - Dùng `wat2wasm` / `wasm2wat` để chuyển đổi qua lại

---

## Concept — WAT là gì và dùng để làm gì?

**WAT (WebAssembly Text Format)** là dạng biểu diễn văn bản (human-readable) của Wasm binary. Mọi file `.wasm` đều có thể chuyển thành `.wat` tương đương, và ngược lại — đây là tương quan **1-to-1** (tương đương về ngữ nghĩa).

Ba lý do chính để biết WAT:

**1. Debugging**: Khi trình duyệt hiển thị Wasm trong DevTools, nó dùng WAT. Không đọc được WAT = không debug được Wasm.

**2. Reverse Engineering**: Khi phân tích file `.wasm` không có source, `wasm2wat` cho ra WAT — đây là điểm khởi đầu của mọi Wasm RE task.

**3. Học internals**: Viết WAT bằng tay buộc bạn phải hiểu stack machine từ cấp độ instruction, không thể "cheat" qua compiler.

> [!tip] Công cụ cần thiết
> Cài **WABT (WebAssembly Binary Toolkit)** để có `wat2wasm` và `wasm2wat`:
> ```bash
> # Ubuntu/Debian
> sudo apt install wabt
>
> # macOS
> brew install wabt
>
> # Hoặc build từ source
> git clone --recursive https://github.com/WebAssembly/wabt
> cd wabt && mkdir build && cd build && cmake .. && make
> ```

---

## API / Syntax — Cú pháp S-Expression

WAT dùng **S-expression** (Symbolic Expression) — cú pháp đến từ ngôn ngữ LISP. Mọi thứ đều là danh sách trong cặp ngoặc: `(keyword argument1 argument2 ...)`.

> [!note] S-expression là gì?
> S-expression biểu diễn một cây (tree). Phần tử đầu tiên trong ngoặc là **loại node** (kiểu), các phần tử sau là **con** (children) hoặc thuộc tính. Ví dụ:
>
> `(func $add (param i32) (result i32) ...)` — một node `func` với tên `$add`, có một param `i32`, trả về `i32`.

### Module — Node gốc

Mọi WAT file đều bắt đầu bằng `(module ...)`:

```wat
(module
  ;; Mọi khai báo đều nằm trong đây
)
```

Dấu `;;` là comment một dòng. Block comment là `(; ... ;)`.

### Khai báo hàm (Function)

```wat
(module
  (func $ten_ham (param $a i32) (param $b i32) (result i32)
    local.get $a   ;; push $a lên stack
    local.get $b   ;; push $b lên stack
    i32.add        ;; pop 2 giá trị, push tổng
  )
)
```

Cú pháp khai báo hàm:

```text
(func $TEN_HAM (param $TEN KIEU)* (result KIEU)?
  (local $TEN KIEU)*
  INSTRUCTION*
)
```

- `$TEN_HAM` — identifier tùy chọn, bắt đầu bằng `$`. Compiler tự gán index nếu không đặt tên.
- `(param $a i32)` — tham số tên `$a`, kiểu `i32`. Nếu không đặt tên: `(param i32)`.
- `(result i32)` — kiểu trả về. Nếu không có: hàm không trả về gì.
- `(local $x i32)` — biến cục bộ, khởi tạo về `0`.

### Hai cú pháp tương đương: Linear vs Folded

WAT hỗ trợ **hai cách viết** cho cùng một instruction sequence. Cả hai đều compile ra cùng bytecode:

```wat
;; Cú pháp Linear (stack-explicit) — dễ thấy hoạt động của stack
local.get $a
local.get $b
i32.add

;; Cú pháp Folded (S-expression lồng nhau) — giống expression tree
(i32.add (local.get $a) (local.get $b))
```

> [!tip] Khi nào dùng cú pháp nào?
> **Linear** tốt hơn khi học internals hoặc đọc binary decompiled output — bạn thấy rõ stack state sau từng instruction.
>
> **Folded** tốt hơn khi viết tay vì trông giống ngôn ngữ cấp cao hơn.
>
> Trong bài này mình dùng **linear** chủ yếu vì nó khớp trực tiếp với cách `wasm2wat` output và cách DevTools hiển thị.

---

## Các nhóm Instruction quan trọng

### 1. Numeric Instructions

Tất cả numeric instruction đều có dạng `{type}.{op}`:

```wat
;; Integer arithmetic
i32.add   i32.sub   i32.mul
i32.div_s   i32.div_u    ;; signed / unsigned division
i32.rem_s   i32.rem_u    ;; remainder
i32.and   i32.or    i32.xor   i32.shl   i32.shr_s   i32.shr_u

;; Integer comparison (trả về i32: 0 = false, 1 = true)
i32.eq    i32.ne
i32.lt_s  i32.lt_u  i32.gt_s  i32.gt_u
i32.le_s  i32.le_u  i32.ge_s  i32.ge_u
i32.eqz   ;; kiểm tra bằng 0 (unary)

;; Constants
i32.const 42      ;; push hằng số 42
f64.const 3.14    ;; push hằng số 3.14

;; Float operations
f64.add   f64.sub   f64.mul   f64.div
f64.sqrt  f64.floor  f64.ceil  f64.nearest
f64.min   f64.max   f64.abs   f64.neg
```

### 2. Variable Instructions

```wat
local.get $x   ;; push giá trị của local $x lên stack
local.set $x   ;; pop từ stack, lưu vào local $x
local.tee $x   ;; lưu vào $x nhưng KHÔNG pop (giữ lại trên stack)

global.get $g  ;; push giá trị global
global.set $g  ;; pop và lưu vào global (phải là mutable global)
```

### 3. Memory Instructions

```wat
i32.load offset=0 align=4   ;; đọc i32 từ địa chỉ (stack top + offset)
i32.store offset=0 align=4  ;; ghi i32 vào địa chỉ

i32.load8_s   ;; đọc 1 byte, sign-extend thành i32
i32.load8_u   ;; đọc 1 byte, zero-extend thành i32
i32.store8    ;; ghi 1 byte (truncate i32 về 8 bit)

memory.size   ;; push số page hiện tại lên stack
memory.grow   ;; pop số page cần thêm, push kết quả (-1 nếu fail)
```

### 4. Control Flow Instructions

```wat
unreachable   ;; dừng thực thi ngay lập tức (trap)
nop           ;; không làm gì
return        ;; trả về từ hàm hiện tại

call $func    ;; gọi hàm theo tên/index
call_indirect (type $sig)  ;; gọi hàm qua Table (indirect)

drop          ;; bỏ giá trị trên đỉnh stack
select        ;; pop 3 giá trị: nếu top=0 dùng giá trị 2, ngược lại giá trị 1
```

---

## Control Flow — if/else, block, loop

### if / else

```wat
(func $abs (param $x i32) (result i32)
  local.get $x
  i32.const 0
  i32.lt_s             ;; $x < 0?
  if (result i32)      ;; nếu đúng
    i32.const 0
    local.get $x
    i32.sub            ;; 0 - $x = -$x
  else
    local.get $x       ;; nguyên vẹn
  end
)
```

> [!note] `if` trong stack machine
> `if` pop một giá trị `i32` từ stack. Nếu **khác 0** → vào nhánh `if`. Nếu **bằng 0** → vào nhánh `else` (hoặc bỏ qua). Nếu `if` có `(result ...)`, stack phải có đúng kiểu đó sau khi block kết thúc.

### block và br (branch)

`block` tạo một label. `br` nhảy đến label tương ứng — đối với `block`, nhảy đến **cuối block** (thoát ra ngoài):

```wat
(func $find_positive (param $a i32) (param $b i32) (result i32)
  block $found      ;; tạo label $found
    local.get $a
    i32.const 0
    i32.gt_s
    br_if $found    ;; nhảy đến cuối $found nếu $a > 0

    local.get $b    ;; nếu $a không > 0, kiểm tra $b
    i32.const 0
    i32.gt_s
    br_if $found

    i32.const -1    ;; không tìm thấy
    return
  end              ;; kết thúc block $found
  i32.const 1      ;; tìm thấy ít nhất một số dương
)
```

### loop và br (vòng lặp)

`loop` cũng tạo một label, nhưng `br` trong loop nhảy đến **đầu loop** (lặp lại):

```wat
;; Tính tổng 1 + 2 + ... + n
(func $sum (param $n i32) (result i32)
  (local $i i32)
  (local $acc i32)

  i32.const 1
  local.set $i         ;; i = 1

  i32.const 0
  local.set $acc       ;; acc = 0

  loop $continue
    local.get $i
    local.get $n
    i32.gt_s
    br_if 1            ;; nếu i > n, thoát khỏi loop (nhảy ra block 1 cấp trên)

    local.get $acc
    local.get $i
    i32.add
    local.set $acc     ;; acc += i

    local.get $i
    i32.const 1
    i32.add
    local.set $i       ;; i += 1

    br $continue       ;; lặp lại loop
  end

  local.get $acc
)
```

> [!warning] `br` trong `loop` vs `block`
> - `br $label` trong **block**: nhảy đến **sau** block (thoát)
> - `br $label` trong **loop**: nhảy đến **trước** loop (lặp lại)
>
> `br_if $label` — nhảy có điều kiện (pop i32: khác 0 thì nhảy).
> `br 0` — nhảy đến block gần nhất (theo depth). `br 1` — bỏ qua 1 cấp.

---

## Import và Export

### Import

```wat
(module
  ;; Import hàm từ host
  (import "env" "print_i32" (func $print (param i32)))
  (import "env" "log_str" (func $log (param i32 i32)))

  ;; Import memory từ host
  (import "js" "memory" (memory 1))

  ;; Import global từ host
  (import "env" "PI" (global $PI f64))

  (func $main
    i32.const 42
    call $print      ;; gọi hàm đã import
  )
)
```

### Export

```wat
(module
  (func $add (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.add
  )

  (memory 1)

  (global $counter (mut i32) (i32.const 0))

  ;; Export hàm, memory, global
  (export "add" (func $add))
  (export "memory" (memory 0))
  (export "counter" (global $counter))
)
```

---

## Memory và Data Segment

Để khởi tạo dữ liệu trong linear memory ngay khi module load, dùng `data` segment:

```wat
(module
  (memory 1)  ;; 1 page = 64KB

  ;; Đặt chuỗi "Hello" vào địa chỉ 100
  (data (i32.const 100) "Hello")

  ;; Đặt bytes thô vào địa chỉ 200
  (data (i32.const 200) "\01\02\03\04")

  (func $get_char (result i32)
    ;; Đọc byte tại địa chỉ 100 (ký tự 'H' = 72)
    i32.const 100
    i32.load8_u
  )

  (export "get_char" (func $get_char))
)
```

> [!example] Ví dụ: Đọc/Ghi Memory từ JavaScript
> Sau khi export memory, JavaScript có thể đọc/ghi trực tiếp:
> ```javascript
> const { instance } = await WebAssembly.instantiate(wasmBytes);
> const mem = new Uint8Array(instance.exports.memory.buffer);
>
> // Đọc chuỗi "Hello" từ địa chỉ 100
> const hello = new TextDecoder().decode(mem.slice(100, 105));
> console.log(hello); // "Hello"
>
> // Ghi vào memory
> mem[0] = 0xFF;
> ```

---

## Worked Project — Viết và Chạy WAT hoàn chỉnh

Viết một module WAT tính số Fibonacci lặp và test bằng WABT:

```wat
;; fib.wat — tính fibonacci(n) bằng vòng lặp
(module
  (func $fib (param $n i32) (result i32)
    (local $a i32)
    (local $b i32)
    (local $tmp i32)
    (local $i i32)

    ;; Xử lý base cases: fib(0)=0, fib(1)=1
    local.get $n
    i32.const 1
    i32.le_s
    if (result i32)
      local.get $n  ;; trả về n (0 hoặc 1)
    else
      ;; a=0, b=1
      i32.const 0
      local.set $a
      i32.const 1
      local.set $b
      i32.const 2
      local.set $i

      ;; Loop: i từ 2 đến n
      loop $loop
        ;; tmp = a + b
        local.get $a
        local.get $b
        i32.add
        local.set $tmp

        ;; a = b
        local.get $b
        local.set $a

        ;; b = tmp
        local.get $tmp
        local.set $b

        ;; i += 1
        local.get $i
        i32.const 1
        i32.add
        local.set $i

        ;; tiếp tục nếu i <= n
        local.get $i
        local.get $n
        i32.le_s
        br_if $loop
      end

      local.get $b  ;; trả về $b là kết quả
    end
  )

  (export "fib" (func $fib))
)
```

```bash
# Bước 1: Biên dịch WAT → WASM
wat2wasm fib.wat -o fib.wasm

# Bước 2: Kiểm tra binary hợp lệ
wasm-validate fib.wasm

# Bước 3: Xem lại WAT từ binary (round-trip)
wasm2wat fib.wasm

# Bước 4: Chạy với wasmtime
wasmtime fib.wasm --invoke fib 10
# Output: 55
```

```bash
# Xem objdump để kiểm tra section layout
wasm-objdump -x fib.wasm
```

Sau đó gọi từ JavaScript:

```javascript
const fs = require('fs');
const bytes = fs.readFileSync('fib.wasm');
const { instance } = await WebAssembly.instantiate(bytes);
for (let i = 0; i <= 10; i++) {
  console.log(`fib(${i}) = ${instance.exports.fib(i)}`);
}
// fib(0) = 0, fib(1) = 1, fib(2) = 1, ..., fib(10) = 55
```

---

## Common Pitfalls

> [!warning] Stack phải cân bằng khi kết thúc hàm
> Nếu hàm khai báo `(result i32)`, khi `end` phải có đúng **1 giá trị `i32`** trên stack. Nhiều hơn hay ít hơn → validation error.

> [!warning] `local` phải khai báo trước instructions
> Tất cả `(local ...)` phải đứng **đầu function body**, trước bất kỳ instruction nào. Sai vị trí → parse error.

> [!warning] `br` trong `loop` không tự dừng
> Không có `br_if` để thoát, `loop` sẽ chạy mãi. Luôn đảm bảo có điều kiện thoát rõ ràng.

> [!warning] Integer types không tự động convert
> `i32.add` cần 2 giá trị `i32`. Nếu một bên là `i64` → validation error. Phải dùng `i32.wrap_i64` để convert.

---

## Summary / Key Takeaways

- WAT là **dạng text đọc được** của Wasm binary — 1-to-1 mapping với `.wasm`.
- Cú pháp **S-expression**: mọi thứ đều là `(keyword ...)`. Node gốc là `(module ...)`.
- **Hai cú pháp**: Linear (stack-explicit) và Folded (S-expression lồng). Cùng compile ra bytecode giống nhau.
- **Control flow**: `if/else/end`, `block/end` (br = thoát), `loop/end` (br = lặp lại). Labels có thể đặt tên bằng `$`.
- **Import/Export** là giao tiếp duy nhất giữa module và host. Mọi thứ không export thì bên ngoài không thấy.
- **Data segment** khởi tạo linear memory khi instantiate — dùng để nhúng strings và binary data.
- Công cụ chính: `wat2wasm` (text → binary), `wasm2wat` (binary → text), `wasm-validate`, `wasm-objdump`.

---

## References

- MDN — Understanding WebAssembly Text Format — https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Understanding_the_text_format
- WebAssembly Spec — Text Format — https://webassembly.github.io/spec/core/text/index.html
- WABT GitHub — https://github.com/WebAssembly/wabt
- *The Art of WebAssembly* — Rick Battagline, No Starch Press 2021, Ch. 2–3
- WAT Instruction Cheat Sheet — [[a1-wat-instruction-reference|A1. WAT Instruction Reference]]
