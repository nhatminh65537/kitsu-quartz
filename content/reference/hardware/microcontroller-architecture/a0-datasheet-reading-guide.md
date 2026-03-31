---
title: "A0. Datasheet Reading Guide"
tags: [embedded, microcontroller, arm-cortex-m, appendix, reference]
aliases: [Datasheet Guide, How to Read Datasheet]
created: 2026-03-24
---

> **Loại file**: Appendix — Reference Guide
> **Dùng khi**: Tiếp cận một MCU mới, cần tra cứu register, tìm peripheral mapping

---

## Tại sao Cần Đọc Datasheet

Mọi kiến thức trong series này áp dụng cho **mọi MCU ARM Cortex-M**, nhưng chi tiết cụ thể (địa chỉ register, tên bit, tần số tối đa, pin mapping) chỉ có trong datasheet của từng chip cụ thể. Kỹ năng đọc datasheet hiệu quả là điều phân biệt embedded engineer giỏi với người chỉ copy code từ HAL.

---

## Bộ Tài liệu ARM Cortex-M

Với mỗi MCU ARM, có hai tầng tài liệu:

> [!definition] Definition A0.1 — Tài liệu ARM (Core-level)
>
> | Tài liệu | Nơi lấy | Dùng khi |
> |---------|---------|---------|
> | **Architecture Reference Manual** (ARM DDI 0403 cho ARMv7-M) | developer.arm.com | Tra cứu instruction set, exception model, MPU, SCS registers |
> | **Technical Reference Manual** (TRM, ví dụ ARM DDI 0439 cho Cortex-M4) | developer.arm.com | Pipeline, cache, FPU, debug (CoreSight) |
> | **CMSIS Documentation** | arm-software.github.io | API chuẩn cho access core registers |
> | **Generic User Guide** (ARM DUI 0553 cho Cortex-M4) | developer.arm.com | Overview dễ đọc hơn TRM |

> [!definition] Definition A0.2 — Tài liệu Vendor (Chip-level)
>
> | Tài liệu | Nơi lấy | Dùng khi |
> |---------|---------|---------|
> | **Datasheet** | st.com, nxp.com... | Pin count, electrical specs, peripheral list, memory size |
> | **Reference Manual** (RM) | Vendor website | **Register-level details** — cái bạn dùng nhiều nhất |
> | **Application Notes** (AN) | Vendor website | How-to cho specific use case |
> | **Errata** | Vendor website | **Bug list** — đọc trước khi debug lỗi kỳ lạ |

---

## Cách Tìm Thông tin trong STM32 Reference Manual

Reference Manual của STM32F4 (RM0090) có hơn 1700 trang. Đây là chiến lược:

### Bước 1 — Xác định Chapter

```text
Mục lục nhanh RM0090:
Ch. 2  — Memory and bus architecture      ← Memory map
Ch. 3  — Embedded flash memory            ← Flash, option bytes, RDP, WRP
Ch. 5  — Power controller (PWR)           ← Sleep modes
Ch. 7  — Reset and clock control (RCC)    ← Clock tree, peripheral enable
Ch. 8  — General-purpose I/Os (GPIO)      ← Pin modes, AF mapping
Ch. 9  — DMA controller                   ← DMA stream/channel mapping
Ch. 10 — Interrupts and events (NVIC/EXTI)← IRQ numbers, EXTI routing
Ch. 11 — Analog-to-digital converter (ADC)← ADC channels, sampling
Ch. 12 — Digital-to-analog converter (DAC)← DAC output
Ch. 14 — Independent watchdog (IWDG)
Ch. 21 — Windows watchdog (WWDG)
Ch. 18 — General-purpose timers           ← TIM2–TIM5, TIM9–TIM14
Ch. 17 — Advanced-control timers (TIM1/8) ← Complementary output
Ch. 27 — Inter-integrated circuit (I2C)
Ch. 28 — Serial peripheral interface (SPI)
Ch. 30 — Universal synchronous/async receiver (USART)
Ch. 38 — Debug support (JTAG, SWD, SWO)
```

### Bước 2 — Đọc Register Description

Mỗi register được mô tả theo format chuẩn:

```text
Register name: USARTx_BRR
Address offset: 0x08
Reset value: 0x0000
Access: Read/Write

31       16 15      4 3     0
┌──────────┬──────────┬───────┐
│ Reserved │ DIV_Mant │DIV_Fr │
└──────────┴──────────┴───────┘
                 [15:4]    [3:0]

Bits 15:4  DIV_Mantissa[11:0]: mantissa của USARTDIV
Bits 3:0   DIV_Fraction[3:0]: fraction của USARTDIV
```

**Cách đọc nhanh**:
1. Xem **Reset value** → biết default state sau reset
2. Xem **Access** → Read-only? Write-only? Read/Write?
3. Tìm bit field cần → xem mô tả, giá trị valid, và side effect

### Bước 3 — Tìm Alternate Function Mapping

```text
Table 9. Alternate function mapping (STM32F407 Datasheet):

Port    Pin  AF0  AF1  AF2  AF3  AF4  AF5  AF6  AF7  AF8  ...
GPIOA   PA9  --   TIM1 TIM1 --   --   --   --   US1  --   ...
        PA10 --   TIM1 TIM1 --   --   --   --   US1  --   ...

→ PA9 với AF7 = USART1_TX ✓
```

---

## Cách Đọc Timing Diagram

Timing diagram xuất hiện nhiều trong communication protocol chapter:

```text
Ví dụ SPI Mode 0 timing (từ STM32 RM):

NSS:   ──┐                              ┌──
         └──────────────────────────────┘
SCK:   ─────┐  ┌──┐  ┌──┐  ┌──┐  ┌──┐ ──
             └──┘  └──┘  └──┘  └──┘  └──
MOSI:       ┤b7┤b6┤b5┤b4┤b3┤b2┤b1┤b0┤
                ↑                        ← "Capture strobe" = rising edge
MISO:       ┤b7┤b6┤b5┤b4┤b3┤b2┤b1┤b0┤

Đọc timing diagram:
1. Tìm "capture edge" (↑ hay ↓) → biết CPHA
2. Xem SCK idle state → biết CPOL
3. Chú ý setup/hold time (t_su, t_h) → biết minimum clock period
```

---

## Đọc Electrical Characteristics

Section quan trọng cho hardware design và attack analysis:

```text
Table: General operating conditions (STM32F407):

Symbol  Parameter          Min   Typ   Max   Unit
VDD     Supply voltage     1.8   3.3   3.6   V       ← VDD range
VDDA    Analog supply      1.8   3.3   3.6   V
T_op    Operating temp.   -40    25    85    °C       ← Temperature range
I_DD    Current (run)      --    100   --    mA       ← Power consumption

Table: I/O current characteristics:
I_OL    Sink current       --    8     --    mA       ← Max per GPIO
I_OH    Source current     --    8     --    mA
```

**Liên quan đến security**:
- **VDD min/max**: biết ngưỡng để voltage glitch — chip reset khi VDD < threshold
- **Current consumption**: cơ sở cho power side-channel — lúc AES chạy, dòng điện thay đổi
- **Thermal**: nhiệt độ cao ảnh hưởng glitch success rate

---

## Đọc Block Diagram

Block diagram ở đầu reference manual cho thấy toàn bộ kiến trúc chip:

```text
Cần chú ý trong block diagram:
1. Bus topology: AHB1, AHB2, APB1, APB2 kết nối gì với gì?
   → Quyết định clock domain và DMA channel mapping
2. Peripheral nằm trên bus nào?
   → Ảnh hưởng đến maximum clock speed của peripheral
3. Memory controller kết nối với memory nào?
   → Biết địa chỉ Flash, SRAM, CCM RAM
4. Debug interface nằm ở đâu?
   → CoreSight components: ETM, ITM, FPB, DWT
```

---

## Errata — Bug List Quan trọng

Errata document liệt kê các lỗi đã biết trong silicon:

```text
Errata ES0182 Rev 12 (STM32F40x/F41x):

2.1.1 I2C analog filter may provide wrong value, locking BUSY flag 
      and preventing master mode entry
      Workaround: Use software reset via bit SWRST in I2C_CR1

2.2.3 Corrupted last bit of data and/or extra data transmitted 
      in SPI master mode
      Workaround: See detailed procedure in AN4322

2.7.1 VBAT measurement may be wrong when ADC channel 18 
      is selected at first conversion
      Workaround: First read channel 18 should be discarded
```

**Đọc errata trước khi debug lỗi kỳ lạ** — nhiều bug "không thể giải thích" thực ra là errata đã biết.

---

## Workflow Tiêu chuẩn — Tiếp cận MCU mới

```text
1. Tải về: Datasheet + Reference Manual + Errata của chip cụ thể
   URL: https://www.st.com/en/microcontrollers-microprocessors/stm32f407vg.html
   → Resources → Reference manuals + Datasheets + Errata sheet

2. Xác định:
   - Core: Cortex-M? → tải ARM TRM tương ứng
   - Flash/SRAM size → biết memory limit
   - Số peripheral → biết capability
   - Debug interface → JTAG/SWD support?
   - Security: RDP, WRP, PCROP support?

3. Tìm memory map (thường Chapter 2):
   - Base address của từng peripheral
   - Địa chỉ Flash, SRAM, option bytes

4. Tìm alternate function table (trong Datasheet, không phải RM):
   - PA9 → AF7 = USART1_TX
   - PB6 → AF4 = I2C1_SCL

5. Tìm clock tree (RCC chapter):
   - Input clock → PLL → SYSCLK → AHB → APB1/APB2

6. Tìm register details (từng peripheral chapter):
   - Tra register name trong index hoặc Ctrl+F
```

---

## Công cụ Hỗ trợ

| Tool | Mục đích | Link |
|------|---------|------|
| **STM32CubeMX** | Visual clock tree, pin assignment, code generation | st.com |
| **ST-Link Utility** | Flash, read option bytes | st.com |
| **STM32CubeProgrammer** | Thay thế ST-Link Utility, RDP, option bytes | st.com |
| **CMSIS-SVD + SVD Viewer** | Xem register values trong GDB/IDE | arm.com |
| **Keil MDK Register Viewer** | Register map trong IDE | keil.com |
| **ARM Developer** | ARM architecture docs | developer.arm.com |

---

## References

- STMicroelectronics — *STM32F4 Reference Manual* (RM0090) — st.com/resource/en/reference_manual/rm0090
- STMicroelectronics — *STM32F407 Datasheet* (DS8626)
- STMicroelectronics — *STM32F40x/F41x Errata* (ES0182)
- ARM — *Cortex-M4 Technical Reference Manual* (DDI0439) — developer.arm.com
- ARM — *ARMv7-M Architecture Reference Manual* (DDI0403) — developer.arm.com
