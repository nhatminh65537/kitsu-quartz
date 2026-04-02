---
title: "A1. Memory Layout Deep Reference"
tags: [security, cve, landmark-cves, memory, heap, kernel-pool, appendix]
aliases: [Memory Layout Reference]
created: 2026-03-24
---

> **Mục đích**: Reference sheet tổng hợp — tra cứu nhanh khi đọc exploit code, không cần nhớ từng offset
> **Liên quan**: [[01-memory-model-exploit-primitives|01]], [[03-eternalblue-smb-root-cause|03]], [[04-eternalblue-kernel-pool-exploit|04]], [[05-bluekeep-rdp-uaf-theory|05]], [[06-bluekeep-heap-spray-exploit|06]], [[20-php-fpm-nginx-underflow|20]]

---

## Linux x86-64 Process Memory

### Virtual Address Space Layout

```text
Canonical address space (x86-64 có 48-bit effective VA):

0xFFFF_FFFF_FFFF_FFFF ┐
                      │  Kernel space (ring 0 only)
0xFFFF_8000_0000_0000 ┘  [128 TB — kernel code, data, vmalloc, modules]

  [non-canonical hole — 0x0000_8000_0000_0000 → 0xFFFF_7FFF_FFFF_FFFF]
  Truy cập vào đây → General Protection Fault ngay lập tức

0x0000_7FFF_FFFF_FFFF ┐
                      │  User space (ring 3)
0x0000_0000_0000_0000 ┘  [128 TB]
```

### User-Space Layout (điển hình, ASLR bật)

```text
0x7FFF_FFFF_FFFF   (top of user space)
   │
   ├── Stack (mở rộng xuống ↓)
   │     Mỗi thread có stack riêng: default 8MB (Linux), 1MB (Windows)
   │     [ASLR: randomize base ± vài MB]
   │
   ├── mmap region (thư viện, anonymous mmap)
   │     libc.so, libssl.so, ld-linux.so
   │     [ASLR: randomize base]
   │
   ├── Heap (mở rộng lên ↑, qua brk/sbrk/mmap)
   │     [ASLR: randomize base ± vài KB]
   │
   ├── BSS   — uninitialized global/static (zero-filled)
   ├── Data  — initialized global/static
   ├── Text  — code (.text), read-only data (.rodata)
   │     [PIE: randomize base; non-PIE: thường 0x400000]
   │
0x0000_0000_0000   (NULL — không map)
```

### Đọc vmmap trong pwndbg

```text
pwndbg> vmmap

LEGEND: STACK | HEAP | CODE | DATA | RWX | RODATA
    0x555555554000     0x555555555000 r--p   1000 0      /bin/vuln  ← ELF header
    0x555555555000     0x555555556000 r-xp   1000 1000   /bin/vuln  ← .text (code)
    0x555555556000     0x555555557000 r--p   1000 2000   /bin/vuln  ← .rodata
    0x555555557000     0x555555558000 rw-p   1000 2000   /bin/vuln  ← .data / .bss
    0x555555558000     0x555555579000 rw-p  21000 0      [heap]
    0x7ffff7dc5000     0x7ffff7dea000 r--p  25000 0      libc.so.6
    0x7ffff7dea000     0x7ffff7f5f000 r-xp 175000 25000  libc.so.6  ← libc .text
    0x7ffff7f5f000     0x7ffff7fad000 r--p  4e000 19a000 libc.so.6
    0x7ffff7fad000     0x7ffff7fb1000 rw-p   4000 1e7000 libc.so.6
    0x7ffffffde000     0x7ffffffff000 rw-p  21000 0      [stack]
```

---

## Stack Frame Anatomy (x86-64)

### Prologue / Epilogue của một function

```text
Trước CALL instruction:
┌────────────────────────┐  ← RSP (trước call)
│ ...caller's frame...  │
└────────────────────────┘

Sau CALL (push return addr):
┌────────────────────────┐  ← RSP
│ Return Address (8B)    │  địa chỉ lệnh tiếp theo của caller
└────────────────────────┘

Sau PUSH RBP; MOV RBP,RSP (function prologue):
┌────────────────────────┐  ← RBP
│ Saved RBP (8B)         │
├────────────────────────┤
│ Return Address (8B)    │
└────────────────────────┘

Sau SUB RSP, N (allocate local vars):
┌────────────────────────┐  ← RSP
│ local var N            │
│ ...                    │
│ local var 1            │
├────────────────────────┤  ← RBP
│ Saved RBP              │
├────────────────────────┤
│ Return Address         │
└────────────────────────┘
```

### Stack Frame với Canary

```text
┌────────────────────────┐  ← RSP + N (top of frame)
│ Return Address (8B)    │
├────────────────────────┤
│ Saved RBP (8B)         │
├────────────────────────┤
│ Stack Canary (8B)      │  ← GCC inserts đây, check khi return
│ (thường fs:[0x28])     │
├────────────────────────┤
│ local buf[N]           │  overflow từ đây → qua canary → crash
│ ...                    │
└────────────────────────┘  ← RSP (bottom of frame)
```

Offset từ `buf` đến Return Address = `N (buf size) + 8 (canary) + 8 (saved RBP)`.

---

## glibc Heap Internals (ptmalloc2)

### Chunk Structure

```text
Free chunk (không dùng):
┌────────────────────────┐  ← chunk pointer (địa chỉ allocator thấy)
│ prev_size (8B)         │  kích thước chunk ngay trước (nếu nó free)
├────────────────────────┤
│ size (8B)              │  kích thước chunk này | flags (3 bits thấp)
├────────────────────────┤  ← user pointer (địa chỉ malloc() trả về)
│ fd (8B)                │  forward pointer → chunk free tiếp theo
├────────────────────────┤
│ bk (8B)                │  backward pointer → chunk free trước
├────────────────────────┤
│ (nếu large chunk)      │
│ fd_nextsize (8B)       │
│ bk_nextsize (8B)       │
└────────────────────────┘

In-use chunk:
┌────────────────────────┐  ← chunk pointer
│ prev_size (8B)         │  (có thể dùng bởi chunk trước làm data)
├────────────────────────┤
│ size (8B) | P | M | A  │  P=prev_inuse, M=mmapped, A=non_main_arena
├────────────────────────┤  ← user pointer
│ user data              │
│ (N bytes)              │
└────────────────────────┘
```

### Size Flags (3 bits thấp của `size` field)

| Bit | Ký hiệu | Ý nghĩa |
|-----|---------|---------|
| bit 0 | P (PREV_INUSE) | Chunk liền trước đang được dùng |
| bit 1 | M (IS_MMAPPED) | Chunk được cấp qua `mmap()` trực tiếp |
| bit 2 | A (NON_MAIN_ARENA) | Chunk thuộc thread arena không phải main |

### Bin Types (Free Lists)

| Bin | Kích thước | Số lượng | Cấu trúc |
|-----|-----------|---------|----------|
| tcache | ≤ 1032B (default) | 64 bins, mỗi bin ≤ 7 entries | LIFO singly-linked |
| fastbin | ≤ 160B | 10 bins | LIFO singly-linked, **không coalesce** |
| smallbin | < 1024B | 62 bins | FIFO doubly-linked |
| largebin | ≥ 1024B | 63 bins | Sorted by size, doubly-linked |
| unsorted bin | Mọi kích thước | 1 bin | FIFO — "landing zone" trước khi sort |

### tcache (glibc ≥ 2.26)

tcache là per-thread cache, là bin đầu tiên được check khi malloc/free:

```c
// Simplified tcache structure
typedef struct tcache_entry {
    struct tcache_entry *next;  // 8B — forward ptr (KHÔNG check)
    struct tcache_perthread *key;  // 8B — đây là tcache_key để detect double-free
} tcache_entry;

typedef struct tcache_perthread_struct {
    uint16_t counts[TCACHE_MAX_BINS];  // số entries mỗi bin
    tcache_entry *entries[TCACHE_MAX_BINS];  // head của mỗi bin
} tcache_perthread_struct;
```

**tcache poisoning** (heap exploit technique): nếu overwrite `next` pointer của một tcache chunk → `malloc()` trả về địa chỉ tùy ý.

### Xem heap trong pwndbg

```text
pwndbg> heap           # liệt kê tất cả chunks
pwndbg> vis            # visualize layout
pwndbg> bins           # xem tất cả free lists
pwndbg> tcachebins     # chỉ xem tcache
pwndbg> fastbins       # chỉ xem fastbin
pwndbg> malloc_chunk addr  # inspect chunk tại địa chỉ cụ thể
```

---

## Windows Kernel Pool

### Hai Loại Pool Chính

| Pool | Đặc điểm | Dùng khi |
|------|---------|---------|
| **NonPaged Pool** | Luôn ở RAM physical, không bị page ra disk | Interrupt handler, DPC, driver cần truy cập bất kỳ lúc nào |
| **Paged Pool** | Có thể swap ra disk | Driver chỉ dùng ở IRQL < DISPATCH_LEVEL |

Kích thước mặc định:
- NonPaged Pool: ≈ min(75% RAM, 2GB) trên 64-bit
- Paged Pool: ≈ min(RAM, 4GB)

### POOL_HEADER (Windows 7 x64)

Mỗi kernel pool allocation có một 16-byte header (hai POOL_HEADER liền nhau trên x64):

```c
typedef struct _POOL_HEADER {
    union {
        struct {
            USHORT PreviousSize : 8;  // size của chunk trước (đơn vị: 16 bytes)
            USHORT PoolIndex    : 8;
            USHORT BlockSize    : 8;  // size của chunk này (đơn vị: 16 bytes)
            USHORT PoolType     : 8;  // NonPaged=1, Paged=2
        };
        ULONG Ulong1;
    };
    ULONG PoolTag;        // 4-byte ASCII tag ('dspR', 'TcpC', 'MmCa', ...)
    union {
        PEPROCESS ProcessBilled;  // process billed for quota
        struct {
            USHORT AllocatorBackTraceIndex;
            USHORT PoolTagHash;
        };
    };
} POOL_HEADER, *PPOOL_HEADER;
```

Ví dụ: EternalBlue target SRVNET_BUFFER với pool tag `'BsSl'` (Little-endian: `6c537342`).

### Pool Tag — Nhận Dạng Allocation

Mỗi kernel driver đăng ký pool tag 4 bytes để phân loại allocation. Hữu ích khi debug:

```text
// Các pool tag quan trọng trong series này:
'TcpC' → TCP connection object (TcpIp.sys)
'Rspd' → rdpsnd driver allocations (BlueKeep spray)
'BsSl' → srv.sys large buffer (EternalBlue SRVNET_BUFFER)
'Thre' → ETHREAD object
'Proc' → EPROCESS object
'File' → FILE_OBJECT
```

Xem pool usage với WinDbg:

```text
!poolused 2    # xem NonPaged Pool usage theo tag
!pool addr     # inspect pool chunk tại địa chỉ
!poolfind tag  # tìm tất cả chunk với tag cụ thể
```

### Windows 7 x64 Kernel Memory Layout

```text
0xFFFF_FFFF_FFFF_FFFF
   │
   ├── HAL (Hardware Abstraction Layer)
   │     HAL heap: 0xFFFF_F780_0000_0000 (mapped = KUSER_SHARED_DATA)
   │     HAL heap base: thường gần 0xFFFF_A800_0000_0000 (varies)
   │
   ├── PFN Database (Page Frame Number)
   │
   ├── NonPaged Pool
   │     Windows 7: Base thường 0xFFFF_FA80_0000_0000 (KASLR randomize ít)
   │
   ├── Paged Pool
   │
   ├── Session space (per-session drivers)
   │
   ├── System PTE region (kernel mappings)
   │
   ├── Kernel image (ntoskrnl.exe)
   │     KASLR: randomize trong range ~256 positions trên Windows 7
   │
   ├── Drivers (.sys files loaded)
   │
0xFFFF_8000_0000_0000
```

### KUSER_SHARED_DATA — Fixed Mapping

```text
User-mode  address: 0x0000_7FFE_0000_0000 (accessible từ ring-3)
Kernel-mode address: 0xFFFF_F780_0000_0000 (same physical page)

Đây là một trang nhớ được map cố định vào cả user và kernel space.
→ BlueKeep exploit: ghi shellcode tại 0x7FFE_0000 + offset từ user process
  → shellcode xuất hiện tại 0xFFFF_F780_0000_0000 + offset trong kernel
  → fake vtable trỏ đến kernel-mode address này
  → không cần KASLR bypass!
```

---

## Mitigation Summary — Lookup Table

| Mitigation | Linux | Windows | Bypass technique |
|-----------|-------|---------|-----------------|
| ASLR | `/proc/sys/kernel/randomize_va_space` | Kernel: KASLR | Info leak, brute force (32-bit), partial overwrite |
| NX/DEP | `PROT_EXEC` bit | DEP, hardware NX bit | ROP chains, JIT spraying |
| Stack canary | GCC `-fstack-protector` | `/GS` (MSVC) | Leak canary (format string), overwrite other target |
| PIE | `-fpie -pie` | ASLR + NXCOMPAT | Leak code pointer |
| RELRO | Linker `RELRO` | N/A | Partial: GOT writeable; Full: read-only GOT |
| SMEP | CPU bit (kernel) | CPU bit (kernel) | Pivot to kernel code, disable SMEP from ring-0 |
| SMAP | CPU bit (kernel) | CPU bit (kernel) | Use `copy_from_user`, pivot to kernel-mode data |
| CFI | Clang `-fsanitize=cfi` | Control Flow Guard | Bypass via legitimate dispatch table |
| SafeStack | Clang `-fsanitize=safe-stack` | N/A | Heap-based overflow instead |

---

## GDB / pwndbg Quick Reference

```text
# Breakpoints
break *0x401234        # break tại địa chỉ tuyệt đối
break func_name        # break tại tên function
rbreak ^vuln_.*        # regex breakpoint

# Execution
run / r                # chạy từ đầu
continue / c           # tiếp tục
next / n               # step over
step / s               # step into
finish                 # chạy đến hết function hiện tại

# Memory inspection
x/20gx $rsp            # dump 20 QWORDs từ RSP (hex)
x/10i $rip             # disassemble 10 instructions từ RIP
x/s 0x402000           # print string tại địa chỉ

# pwndbg specific
telescope $rsp 20      # smart stack dump với pointer dereference
vmmap                  # memory layout đầy đủ
heap                   # heap chunks
vis / vis_heap_chunks  # visualize heap
bins                   # free lists
checksec               # show mitigations
got                    # Global Offset Table
plt                    # Procedure Linkage Table
search -x "41414141"   # search pattern trong memory
cyclic 100             # generate de Bruijn sequence
cyclic -l 0x6161616f   # find offset in cyclic pattern

# Info
info registers         # tất cả registers
info frame             # current stack frame
info locals            # local variables
info args              # function arguments
```

---

## pwntools Quick Reference

```python
from pwn import *

# Connection
p = process('./binary')
r = remote('host', 1337)

# Packing
p64(0xdeadbeef)       # little-endian 8 bytes
p32(0xdeadbeef)       # little-endian 4 bytes
u64(b'\xef\xbe...')   # unpack 8 bytes → int
u32(b'\xef\xbe...')   # unpack 4 bytes → int

# I/O
r.send(b'data')
r.sendline(b'data')          # + '\n'
r.sendafter(b'prompt', data)
r.recv(n)                    # đọc đúng n bytes
r.recvuntil(b'marker')       # đọc đến marker
r.recvline()                 # đọc một dòng
r.interactive()              # chuyển sang interactive mode

# ELF inspection
elf = ELF('./binary')
elf.sym['func']              # địa chỉ symbol
elf.got['puts']              # GOT entry của puts
elf.plt['puts']              # PLT stub của puts
elf.search(b'/bin/sh')       # tìm string trong binary

# Shellcode
shellcraft.sh()              # shell shellcode cho target arch
asm(shellcraft.sh())         # assemble thành bytes

# Cyclic pattern
cyclic(200)                  # tạo 200-byte pattern
cyclic_find(0x6161616f)      # tìm offset của 'aaao'

# ROP
rop = ROP(elf)
rop.call('puts', [elf.got['puts']])
rop.call('main')
rop.chain()                  # bytes của ROP chain

# Logging
log.info("message")
log.success("found: 0x{:x}".format(addr))
log.warning("canary: {}".format(hex(canary)))
```

---

## Struct Offset Calculator (Python)

Tiện ích tính offset struct cho exploit development:

```python
import struct

def show_struct_layout(fields):
    """
    fields: list of (name, size_bytes)
    Tính và hiển thị offset của từng field.
    """
    print(f"{'Offset':>8}  {'Size':>6}  Field")
    print("-" * 40)
    offset = 0
    for name, size in fields:
        print(f"  +{offset:#06x}  {size:>5}B  {name}")
        offset += size
    print("-" * 40)
    print(f"  Total: {offset} bytes = {offset:#x}")

show_struct_layout([
    ("pNext",              8),
    ("pPrev",              8),
    ("ChannelId",          4),
    ("Flags",              4),
    ("pStack",             8),
    ("padding_0",         16),
    ("IoCompletionPort",   8),
    ("dispatch_table_ptr", 8),   # ← offset 0x38 + 0x50? verify với actual
    ("other_fields",      88),
])
```

---

## References

- "The Art of Exploitation" — Jon Erickson (glibc heap internals)
- "A Guide to Kernel Exploitation" — Enrico Perla & Massimiliano Oldani (Windows kernel pool)
- pwntools docs: https://docs.pwntools.com
- pwndbg wiki: https://github.com/pwndbg/pwndbg/wiki
- glibc malloc source: https://sourceware.org/git/glibc.git (malloc/malloc.c)
- Windows Internals, 7th Edition — Russinovich, Solomon, Ionescu
- how2heap (heap exploitation techniques): https://github.com/shellphish/how2heap
