---
title: "07. MPU — Memory Protection Unit"
tags: [embedded, microcontroller, arm-cortex-m, lesson-07]
aliases: [MPU, Memory Protection Unit]
created: 2026-03-24
---

> **Prerequisites**: [[04-memory-map-mmio|04. Memory Map & Memory-Mapped I/O]], [[06-stack-heap-call-convention|06. Stack, Heap & Call Convention]]
> **Objectives**:
> - Hiểu MPU là gì, tại sao cần, và Cortex-M nào có MPU
> - Cấu hình MPU region: base address, size, permission, attributes
> - Triển khai MPU để phân tách kernel/user-space trong RTOS
> - Nhận diện MemManage fault và đọc MMFAR/CFSR để debug
> - Phân tích các kỹ thuật bypass MPU phổ biến trên MCU

---

## Motivation

Bài 06 chỉ ra rằng bare-metal firmware thường chạy toàn bộ ở privileged mode — không có gì ngăn một task ghi đè stack của task khác, hay corrupt vector table. MPU là hardware solution cho vấn đề này: nó cho phép firmware định nghĩa các **vùng bộ nhớ với quyền truy cập khác nhau**, và hardware tự động enforce.

Nhưng MPU cũng là attack surface: cấu hình sai (region overlap, permission quá rộng, background region bị bỏ quên) để lộ lỗ hổng privilege escalation. Từ góc độ hardware hacker, hiểu MPU giúp bạn nhận ra firmware nào thực sự enforce isolation và firmware nào chỉ "có MPU mà không dùng".

---

## MPU trên Cortex-M — Tổng quan

> [!definition] Definition 7.1 — Memory Protection Unit (MPU)
> MPU là hardware block cho phép định nghĩa tối đa **8 region** (Cortex-M3/M4) hoặc **16 region** (Cortex-M7/M33) với các thuộc tính:
> - **Base address** và **size** của vùng
> - **Access permission**: Read/Write/Execute cho Privileged và Unprivileged mode
> - **Memory attributes**: cacheable, bufferable, shareable (ảnh hưởng bus behavior)
>
> Khi code cố truy cập địa chỉ vi phạm rule → hardware trigger **MemManage fault**.

| Core | Số region | Minimum region size | Ghi chú |
|------|----------|-------------------|---------|
| Cortex-M0/M0+ | Không có MPU | — | Không có isolation |
| Cortex-M3/M4 | 8 | 32 bytes | Optional, không phải mọi chip có |
| Cortex-M7 | 8 hoặc 16 | 32 bytes | Dual MPU (I+D) trên một số config |
| Cortex-M23 | 4 hoặc 8 | 32 bytes | Có TrustZone, MPU cho mỗi world |
| Cortex-M33 | 8 hoặc 16 | 32 bytes | Có TrustZone |

> [!warning] MPU là Optional — Kiểm tra trước
> Không phải mọi chip Cortex-M3/M4 đều có MPU — silicon vendor có thể bỏ qua để giảm cost. Kiểm tra bằng:
> ```c
> if (MPU->TYPE == 0) {
>     /* MPU không tồn tại trên chip này */
> }
> /* MPU->TYPE bits [15:8] = DREGION — số data regions */
> uint8_t num_regions = (MPU->TYPE >> 8) & 0xFF;
> ```

---

## MPU Registers

MPU có 4 register chính, tất cả nằm trong SCS:

> [!definition] Definition 7.2 — MPU Register Set
>
> | Register | Địa chỉ | Chức năng |
> |----------|---------|-----------|
> | `MPU_TYPE` | `0xE000ED90` | Read-only: số region, unified/separated |
> | `MPU_CTRL` | `0xE000ED94` | Enable MPU, enable background region, enable trong HardFault/NMI |
> | `MPU_RNR`  | `0xE000ED98` | Region Number Register — chọn region để cấu hình (0–7) |
> | `MPU_RBAR` | `0xE000ED9C` | Region Base Address Register |
> | `MPU_RASR` | `0xE000EDA0` | Region Attribute and Size Register |

**MPU_CTRL — Control Register**:

```text
Bit 2: PRIVDEFENA — Enable privileged default (background) region
Bit 1: HFNMIENA  — Enable MPU trong HardFault và NMI handler
Bit 0: ENABLE    — Enable MPU
```

**MPU_RBAR — Base Address Register**:

```text
Bits [31:5]: Base address (phải align với size của region)
Bits [3:0]:  REGION — nếu VALID=1, ghi đồng thời vào MPU_RNR
Bit  4:      VALID  — 1 = dùng REGION field, 0 = dùng MPU_RNR
```

**MPU_RASR — Attribute and Size Register**:

```text
Bit  0:      ENABLE — Enable region này
Bits [5:1]:  SIZE   — Log2(size) - 1. Ví dụ: 32B=0b00100, 1KB=0b01001, 1MB=0b10011
Bits [28:24]: AP   — Access Permission (xem bảng bên dưới)
Bit  28:     XN    — Execute Never (1 = không thể execute code trong region này)
Bits [21:19]: TEX  — Type Extension (memory type attribute)
Bit  18:     S     — Shareable
Bit  17:     C     — Cacheable
Bit  16:     B     — Bufferable
Bits [15:8]: SRD   — Sub-Region Disable (chia region thành 8 phần, disable từng phần)
```

> [!definition] Definition 7.3 — Access Permission (AP) Field
>
> | AP[2:0] | Privileged | Unprivileged | Ghi chú |
> |---------|-----------|-------------|---------|
> | `000`   | No access | No access   | Region bị chặn hoàn toàn |
> | `001`   | RW        | No access   | Kernel-only read/write |
> | `010`   | RW        | Read-only   | Kernel RW, user chỉ đọc |
> | `011`   | RW        | RW          | Full access |
> | `100`   | Reserved  | —           | — |
> | `101`   | RO        | No access   | Kernel read-only |
> | `110`   | RO        | Read-only   | Full read-only |
> | `111`   | RO        | Read-only   | = `110` |

---

## Cấu hình MPU — Ví dụ Thực tế

### Helper functions

```c
#include "core_cm4.h"   /* CMSIS — định nghĩa MPU_Type struct */

/* Cấu hình một MPU region */
static void mpu_configure_region(
    uint8_t  region_num,    /* 0–7 */
    uint32_t base_addr,     /* Phải align với size */
    uint8_t  size_log2,     /* SIZE field: log2(size)-1, min=4 (32B) */
    uint8_t  ap,            /* Access Permission 0–7 */
    uint8_t  xn,            /* Execute Never: 1=không execute */
    uint8_t  tex,           /* Type Extension */
    uint8_t  s,             /* Shareable */
    uint8_t  c,             /* Cacheable */
    uint8_t  b              /* Bufferable */
) {
    MPU->RNR  = region_num;
    MPU->RBAR = base_addr;
    MPU->RASR = (1U        << 0)    /* ENABLE */
              | (size_log2 << 1)    /* SIZE */
              | (ap        << 24)   /* AP */
              | (xn        << 28)   /* XN */
              | (tex       << 19)   /* TEX */
              | (s         << 18)   /* S */
              | (c         << 17)   /* C */
              | (b         << 16);  /* B */
}

/* Enable MPU với background region cho privileged code */
static void mpu_enable(void) {
    __DMB();                         /* Data Memory Barrier trước khi enable */
    MPU->CTRL = MPU_CTRL_ENABLE_Msk
              | MPU_CTRL_PRIVDEFENA_Msk;  /* Privileged code dùng default map */
    __DSB();
    __ISB();                         /* Flush pipeline */
}
```

### Cấu hình điển hình — phân tách Flash / SRAM / Peripheral

```c
void setup_mpu(void) {
    /* Disable MPU trong khi cấu hình */
    MPU->CTRL = 0;

    /* Region 0: Flash — Privileged RW, Unprivileged RO, Executable */
    /* STM32F4 Flash: 0x08000000, 1MB → SIZE = log2(1MB)-1 = 19 */
    mpu_configure_region(
        0,              /* region 0 */
        0x08000000,     /* Flash base */
        19,             /* 1MB: 2^(19+1) = 1MB */
        0b110,          /* AP: Priv=RO, Unpriv=RO (firmware immutable) */
        0,              /* XN=0: Executable */
        0, 0, 1, 0      /* TEX=0, S=0, C=1, B=0 (normal, cacheable) */
    );

    /* Region 1: SRAM — Privileged RW, Unprivileged RW, NOT Executable */
    /* STM32F4 SRAM: 0x20000000, 128KB → SIZE = log2(128KB)-1 = 16 */
    mpu_configure_region(
        1,
        0x20000000,
        16,             /* 128KB: 2^(16+1) = 128KB */
        0b011,          /* AP: Full RW */
        1,              /* XN=1: Không cho execute từ RAM */
        0, 1, 1, 1      /* TEX=0, S=1, C=1, B=1 (normal, shareable, cached) */
    );

    /* Region 2: Peripheral — Privileged RW, Unprivileged NO ACCESS, NOT Executable */
    /* 0x40000000–0x5FFFFFFF = 512MB → SIZE = 28 */
    mpu_configure_region(
        2,
        0x40000000,
        28,             /* 512MB */
        0b001,          /* AP: Priv=RW, Unpriv=No access */
        1,              /* XN=1 */
        0, 1, 0, 1      /* TEX=0, S=1, C=0, B=1 (device memory) */
    );

    /* Region 3: System Control Space — Privileged RW, Unprivileged NO ACCESS */
    /* 0xE0000000, 1MB */
    mpu_configure_region(
        3,
        0xE0000000,
        19,
        0b001,          /* Chỉ privileged */
        1,
        2, 0, 0, 0      /* TEX=2, strongly ordered */
    );

    mpu_enable();
}
```

---

## Background Region (PRIVDEFENA)

Khi `PRIVDEFENA = 1` trong `MPU_CTRL`, code đang chạy ở **Privileged mode** vẫn có thể truy cập vùng bộ nhớ **không được cover bởi bất kỳ region nào** — theo default memory map của ARM.

> [!warning] Security Note — PRIVDEFENA là Attack Surface
> Nếu `PRIVDEFENA = 1` (thường là default), privileged code có thể truy cập mọi địa chỉ mà MPU không cover. Điều này có nghĩa:
>
> - Chỉ cần privilege escalation từ unprivileged → privileged là đủ để bypass toàn bộ MPU
> - Nếu một region bị cấu hình sai (size sai, overlap không đúng), vùng đó vẫn accessible cho privileged code
>
> **Best practice**: Dùng `PRIVDEFENA = 0` và cover **toàn bộ** address space bằng các region (kể cả region "no access" cho khoảng trống). Tuy nhiên điều này phức tạp và nhiều firmware không làm.

---

## Sub-Region Disable (SRD)

Mỗi region 256 bytes trở lên có thể chia thành **8 sub-region** và disable từng phần — tiện khi cần "lỗ hổng" trong một region lớn.

```c
/* Ví dụ: Region 128KB với sub-region 0 và 7 bị disable
 * → vùng 0x20000000–0x20003FFF và 0x2001C000–0x2001FFFF bị chặn
 * → chỉ 0x20004000–0x2001BFFF accessible
 *
 * Mỗi sub-region = 128KB / 8 = 16KB
 * SRD = 0b10000001 = sub-region 0 và 7 disabled
 */
MPU->RASR |= (0b10000001 << 8);   /* SRD bits [15:8] */
```

---

## MemManage Fault — Phân tích và Debug

Khi MPU phát hiện vi phạm, nó trigger **MemManage fault** (exception #4). Nếu MemManage chưa được enable, hardware escalate lên HardFault.

**Đọc fault information**:

```c
void MemManage_Handler(void) {
    uint32_t cfsr  = SCB->CFSR;   /* Configurable Fault Status Register */
    uint32_t mmfar = SCB->MMFAR;  /* MemManage Fault Address Register */

    /* CFSR bits liên quan đến MemManage (byte thấp nhất) */
    uint8_t mmfsr = cfsr & 0xFF;

    if (mmfsr & (1 << 0)) {
        /* IACCVIOL: Instruction access violation — execute từ vùng XN */
    }
    if (mmfsr & (1 << 1)) {
        /* DACCVIOL: Data access violation — đọc/ghi bị cấm */
    }
    if (mmfsr & (1 << 3)) {
        /* MUNSTKERR: Fault khi unstacking exception (lúc exit handler) */
    }
    if (mmfsr & (1 << 4)) {
        /* MSTKERR: Fault khi stacking exception (lúc vào handler) */
    }
    if (mmfsr & (1 << 7)) {
        /* MMARVALID: MMFAR chứa địa chỉ gây fault */
        uint32_t fault_addr = mmfar;
        (void)fault_addr;   /* Log hoặc halt */
    }

    while (1) { }   /* Halt — hoặc reset hệ thống */
}
```

**Debug MemManage fault trong GDB**:

```gdb
(gdb) x/wx 0xE000ED28   # CFSR
0xe000ed28:  0x00000082  # → DACCVIOL (bit1) + MMARVALID (bit7)

(gdb) x/wx 0xE000ED34   # MMFAR — địa chỉ gây fault
0xe000ed34:  0x40020000  # → Code cố ghi vào GPIOA từ unprivileged mode!
```

---

## MPU trong RTOS — FreeRTOS Pattern

FreeRTOS MPU port dùng MPU để cô lập từng task:

```text
Task A stack   → Region: AP=011 (RW), XN=1, chỉ task A access được
Task B stack   → Region: AP=011 (RW), XN=1, chỉ task B access được
Kernel heap    → Region: AP=001 (Priv RW), XN=1
Flash (code)   → Region: AP=110 (RO), XN=0
Peripheral     → Region: AP=001 (Priv RW), XN=1
```

Khi context switch xảy ra (PendSV handler), kernel cập nhật MPU regions để phù hợp với task mới — mỗi task có "view" bộ nhớ riêng.

---

## Bypass Techniques — MPU Attack Surface

> [!warning] Các kỹ thuật bypass MPU phổ biến
>
> **1. PRIVDEFENA exploit**: Nếu firmware set `PRIVDEFENA=1`, chỉ cần leo quyền lên privileged (qua SVC handler bug) là có thể đọc/ghi mọi thứ ngoài các region được define.
>
> **2. Region misconfiguration**: Size không align, region overlap với region khác có permission cao hơn — region ưu tiên cao hơn (số lớn hơn) win. Attacker tìm vùng address bị cover bởi region có permission rộng hơn dự định.
>
> **3. DMA bypass**: DMA controller là **bus master độc lập** — MPU của CPU **không áp dụng** cho DMA transfer! Nếu attacker kiểm soát DMA configuration (qua vulnerable firmware code), DMA có thể đọc/ghi bất kỳ vùng nào kể cả vùng MPU-protected. Đây là attack vector cực kỳ quan trọng.
>
> **4. Shared peripheral register**: Nếu MPU chỉ protect SRAM và Flash nhưng để peripheral accessible từ unprivileged, task unprivileged có thể ghi vào DMA config register → dùng DMA để đọc kernel memory.
>
> **5. MPU disabled in exception**: Nếu `HFNMIENA=0` (default), MPU bị bypass trong HardFault và NMI handler. Một số exploit trigger fault có chủ đích để chạy code trong môi trường không có MPU.

---

## Checklist Audit MPU Configuration

Khi phân tích firmware target, kiểm tra:

```gdb
# Đọc MPU_CTRL — MPU có enable không?
(gdb) x/wx 0xE000ED94
# Bit 0 = 0 → MPU disabled hoàn toàn → không có isolation

# Đọc số regions
(gdb) x/wx 0xE000ED90
# Bits [15:8] → DREGION: số region chip có
# = 0 → chip này không có MPU

# Đọc từng region (cần set RNR trước)
# Không thể đọc trực tiếp qua GDB khi đang chạy — cần halt và dùng OpenOCD
```

```python
import struct

def decode_mpu_rasr(rasr):
    enable  = rasr & 1
    size    = (rasr >> 1) & 0x1F
    ap      = (rasr >> 24) & 0x7
    xn      = (rasr >> 28) & 0x1
    actual_size = 2 ** (size + 1)
    print(f"  Enable={enable}, Size=2^{size+1}={actual_size}B, AP={ap:03b}, XN={xn}")
```

---

## Summary

- MPU cho phép define tối đa 8–16 **region** với base/size/permission/attributes. Chỉ có trên Cortex-M3+ (optional).
- **AP field** quyết định Privileged/Unprivileged read/write access. **XN bit** ngăn execution.
- **PRIVDEFENA=1** (background region) là lỗ hổng phổ biến: privileged code vượt qua mọi region uncovered.
- **DMA không bị ảnh hưởng bởi MPU** — đây là bypass quan trọng nhất cần nhớ.
- Khi MPU vi phạm → **MemManage fault** → đọc `CFSR` (byte thấp) và `MMFAR` để xác định địa chỉ và loại vi phạm.
- Audit firmware: kiểm tra `MPU_CTRL` enable bit, số region được cấu hình, và có overlap/gap nào không.

---

## References

- ARM — *ARMv7-M Architecture Reference Manual* (ARM DDI 0403), Section B3.5 (MPU)
- ARM — *CMSIS Documentation* — MPU API reference
- Joseph Yiu — *The Definitive Guide to ARM Cortex-M3 and Cortex-M4 Processors*, Ch. 11 (MPU)
- embeddedsecurity.io — *Embedded Systems Security and TrustZone*, Ch. 3 (MPU section)
- interrupt.memfault.com — *Fix Bugs and Secure Firmware with the MPU*
