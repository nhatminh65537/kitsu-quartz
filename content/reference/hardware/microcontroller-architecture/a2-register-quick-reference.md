---
title: "A2. Register Quick Reference"
tags: [embedded, microcontroller, arm-cortex-m, appendix, reference]
aliases: [Register Reference, NVIC Registers, MPU Registers]
created: 2026-03-24
---

> **Loại file**: Appendix — Bảng tra nhanh
> **Dùng khi**: Cần địa chỉ và bit-field của một register cụ thể

---

## System Control Space (SCS) — 0xE000E000

### NVIC Registers

| Register | Địa chỉ | Reset | Chức năng |
|----------|---------|-------|-----------|
| `NVIC_ISER[0]` | `0xE000E100` | 0 | IRQ 0–31 Set-Enable |
| `NVIC_ISER[1]` | `0xE000E104` | 0 | IRQ 32–63 Set-Enable |
| `NVIC_ISER[2]` | `0xE000E108` | 0 | IRQ 64–95 Set-Enable |
| `NVIC_ICER[0]` | `0xE000E180` | 0 | IRQ 0–31 Clear-Enable |
| `NVIC_ICER[1]` | `0xE000E184` | 0 | IRQ 32–63 Clear-Enable |
| `NVIC_ISPR[0]` | `0xE000E200` | 0 | IRQ 0–31 Set-Pending |
| `NVIC_ICPR[0]` | `0xE000E280` | 0 | IRQ 0–31 Clear-Pending |
| `NVIC_IABR[0]` | `0xE000E300` | 0 | IRQ 0–31 Active Bit (RO) |
| `NVIC_IPR[0]`  | `0xE000E400` | 0 | IRQ 0–3 Priority (8-bit each) |
| `NVIC_IPR[n]`  | `0xE000E400 + n*4` | 0 | IRQ (n*4)..(n*4+3) Priority |

**Công thức**: IRQ `n` → `ISER[n/32]` bit `n%32`; Priority ở `IPR[n/4]` byte `n%4` (upper nibble có nghĩa).

---

### System Control Block (SCB) — 0xE000ED00

| Register | Địa chỉ | Reset | Quan trọng |
|----------|---------|-------|-----------|
| `SCB_CPUID`  | `0xE000ED00` | (chip) | CPU ID, implementer, revision |
| `SCB_ICSR`   | `0xE000ED04` | 0 | PENDSVSET[28], PENDSVCLR[27], NMIPENDSET[31] |
| `SCB_VTOR`   | `0xE000ED08` | 0 | Vector Table Offset (aligned) |
| `SCB_AIRCR`  | `0xE000ED0C` | — | VECTKEY[31:16]=0x05FA, SYSRESETREQ[2], PRIGROUP[10:8] |
| `SCB_SCR`    | `0xE000ED10` | 0 | SLEEPDEEP[2], SLEEPONEXIT[1] |
| `SCB_CCR`    | `0xE000ED14` | — | STKALIGN[9], UNALIGN_TRP[3], DIV_0_TRP[4] |
| `SCB_SHP[n]` | `0xE000ED18` | 0 | System Handler Priority (MemManage[0], BusFault[1]...) |
| `SCB_SHCSR`  | `0xE000ED24` | 0 | USGFAULTENA[18], BUSFAULTENA[17], MEMFAULTENA[16] |
| `SCB_CFSR`   | `0xE000ED28` | 0 | UFSR[31:16], BFSR[15:8], MMFSR[7:0] |
| `SCB_HFSR`   | `0xE000ED2C` | 0 | DEBUGEVT[31], FORCED[30], VECTTBL[1] |
| `SCB_MMFAR`  | `0xE000ED34` | — | MemManage Fault Address |
| `SCB_BFAR`   | `0xE000ED38` | — | BusFault Address |

**CFSR bit-fields** (Configurable Fault Status Register):

```text
MMFSR [7:0]:
  Bit 7: MMARVALID — MMFAR chứa địa chỉ hợp lệ
  Bit 4: MSTKERR   — Fault khi stacking
  Bit 3: MUNSTKERR — Fault khi unstacking
  Bit 1: DACCVIOL  — Data access violation
  Bit 0: IACCVIOL  — Instruction access violation (XN region)

BFSR [15:8]:
  Bit 15: BFARVALID — BFAR chứa địa chỉ hợp lệ
  Bit 12: STKERR    — Fault khi stacking
  Bit 11: UNSTKERR  — Fault khi unstacking
  Bit 10: IMPRECISERR — Imprecise data bus error
  Bit 9:  PRECISERR — Precise data bus error (BFAR valid)
  Bit 8:  IBUSERR   — Instruction bus error

UFSR [31:16]:
  Bit 25: DIVBYZERO — Divide by zero (phải enable DIV_0_TRP)
  Bit 24: UNALIGNED — Unaligned access (phải enable UNALIGN_TRP)
  Bit 19: NOCP      — No coprocessor (access FPU khi không có)
  Bit 18: INVPC     — Invalid PC (EXC_RETURN invalid)
  Bit 17: INVSTATE  — Invalid state (EPSR.T = 0)
  Bit 16: UNDEFINSTR — Undefined instruction
```

---

### SysTick — 0xE000E010

| Register | Địa chỉ | Chức năng |
|----------|---------|-----------|
| `SYST_CSR`   | `0xE000E010` | ENABLE[0], TICKINT[1], CLKSOURCE[2], COUNTFLAG[16] |
| `SYST_RVR`   | `0xE000E014` | Reload value [23:0] |
| `SYST_CVR`   | `0xE000E018` | Current value [23:0] (write any → clear) |
| `SYST_CALIB` | `0xE000E01C` | TENMS[23:0], SKEW[30], NOREF[31] |

---

### MPU Registers — 0xE000ED90

| Register | Địa chỉ | Chức năng |
|----------|---------|-----------|
| `MPU_TYPE`  | `0xE000ED90` | DREGION[15:8]=số region, IREGION[7:0] |
| `MPU_CTRL`  | `0xE000ED94` | PRIVDEFENA[2], HFNMIENA[1], ENABLE[0] |
| `MPU_RNR`   | `0xE000ED98` | REGION[7:0] — chọn region (0–7) |
| `MPU_RBAR`  | `0xE000ED9C` | ADDR[31:5], VALID[4], REGION[3:0] |
| `MPU_RASR`  | `0xE000EDA0` | XN[28], AP[26:24], TEX[21:19], S[18], C[17], B[16], SRD[15:8], SIZE[5:1], ENABLE[0] |

**MPU_RASR AP field**:

```text
AP[2:0]  Privileged  Unprivileged
000      No access   No access
001      RW          No access
010      RW          Read-only
011      RW          RW
101      Read-only   No access
110      Read-only   Read-only
```

---

## STM32F4 Peripheral Base Addresses

### AHB1 Peripherals (0x40020000)

| Peripheral | Base Address |
|-----------|-------------|
| GPIOA | `0x40020000` |
| GPIOB | `0x40020400` |
| GPIOC | `0x40020800` |
| GPIOD | `0x40020C00` |
| GPIOE | `0x40021000` |
| GPIOH | `0x40021C00` |
| CRC   | `0x40023000` |
| RCC   | `0x40023800` |
| Flash IF | `0x40023C00` |
| DMA1  | `0x40026000` |
| DMA2  | `0x40026400` |

### APB2 Peripherals (0x40010000)

| Peripheral | Base Address |
|-----------|-------------|
| TIM1   | `0x40010000` |
| USART1 | `0x40011000` |
| USART6 | `0x40011400` |
| ADC1   | `0x40012000` |
| ADC2   | `0x40012100` |
| ADC3   | `0x40012200` |
| SPI1   | `0x40013000` |
| SPI4   | `0x40013400` |
| SYSCFG | `0x40013800` |
| EXTI   | `0x40013C00` |
| TIM8   | `0x40010400` |
| TIM9   | `0x40014000` |

### APB1 Peripherals (0x40000000)

| Peripheral | Base Address |
|-----------|-------------|
| TIM2  | `0x40000000` |
| TIM3  | `0x40000400` |
| TIM4  | `0x40000800` |
| TIM5  | `0x40000C00` |
| TIM6  | `0x40001000` |
| TIM7  | `0x40001400` |
| WWDG  | `0x40002C00` |
| IWDG  | `0x40003000` |
| SPI2  | `0x40003800` |
| SPI3  | `0x40003C00` |
| USART2 | `0x40004400` |
| USART3 | `0x40004800` |
| UART4  | `0x40004C00` |
| UART5  | `0x40005000` |
| I2C1  | `0x40005400` |
| I2C2  | `0x40005800` |
| I2C3  | `0x40005C00` |
| DAC   | `0x40007400` |
| PWR   | `0x40007000` |

---

## GPIO Register Offsets

| Register | Offset | Mô tả |
|----------|--------|-------|
| MODER  | +0x00 | Mode: 2 bit/pin (00=In, 01=Out, 10=AF, 11=Analog) |
| OTYPER | +0x04 | Output type: 1 bit/pin (0=PP, 1=OD) |
| OSPEEDR| +0x08 | Speed: 2 bit/pin (00=Low, 01=Med, 10=High, 11=VHigh) |
| PUPDR  | +0x0C | Pull: 2 bit/pin (00=None, 01=PU, 10=PD) |
| IDR    | +0x10 | Input data (RO) |
| ODR    | +0x14 | Output data |
| BSRR   | +0x18 | [31:16]=Reset, [15:0]=Set |
| LCKR   | +0x1C | Lock config |
| AFR[0] | +0x20 | AF pin 0–7 (4 bit each) |
| AFR[1] | +0x24 | AF pin 8–15 (4 bit each) |

---

## STM32F4 IRQ Numbers (Partial)

| IRQ # | Exception # | Peripheral |
|-------|------------|-----------|
| 0  | 16 | WWDG |
| 6  | 22 | EXTI0 |
| 7  | 23 | EXTI1 |
| 8  | 24 | EXTI2 |
| 9  | 25 | EXTI3 |
| 10 | 26 | EXTI4 |
| 11 | 27 | DMA1 Stream0 |
| 17 | 33 | DMA1 Stream6 |
| 18 | 34 | ADC |
| 23 | 39 | EXTI9–5 |
| 24 | 40 | TIM1 BRK / TIM9 |
| 28 | 44 | TIM2 |
| 29 | 45 | TIM3 |
| 30 | 46 | TIM4 |
| 31 | 47 | I2C1 EV |
| 33 | 49 | I2C2 EV |
| 35 | 51 | SPI1 |
| 36 | 52 | SPI2 |
| 37 | 53 | USART1 |
| 38 | 54 | USART2 |
| 39 | 55 | USART3 |
| 40 | 56 | EXTI15–10 |
| 44 | 60 | TIM5 |
| 54 | 70 | DMA2 Stream0 |
| 56 | 72 | DMA2 Stream2 |
| 57 | 73 | DMA2 Stream3 |
| 68 | 84 | DMA2 Stream5 |

---

## Flash và Option Bytes

| Địa chỉ | Nội dung |
|---------|---------|
| `0x08000000` | Sector 0: 16 KB |
| `0x08004000` | Sector 1: 16 KB |
| `0x08008000` | Sector 2: 16 KB |
| `0x0800C000` | Sector 3: 16 KB |
| `0x08010000` | Sector 4: 64 KB |
| `0x08020000` | Sector 5: 128 KB |
| `0x080E0000` | Sector 11: 128 KB |
| `0x1FFF0000` | System Memory (ROM bootloader): 30 KB |
| `0x1FFF7800` | OTP area: 512 bytes |
| `0x1FFF7A00` | OTP lock bytes: 16 bytes |
| `0x1FFF7A10` | Factory calibration (VREFINT, temp) |
| `0x1FFFC000` | Option bytes: OPTCR, OPTCR1 |

---

## References

- ARM — *ARMv7-M Architecture Reference Manual* (DDI0403) — Section B3 (SCS)
- STMicroelectronics — *STM32F4 Reference Manual* (RM0090)
- STMicroelectronics — *STM32F407 Datasheet* (DS8626) — IRQ table
