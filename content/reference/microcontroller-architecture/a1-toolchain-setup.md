---
title: "A1. Toolchain Setup"
tags: [embedded, microcontroller, arm-cortex-m, appendix, toolchain]
aliases: [Toolchain, GCC ARM, OpenOCD Setup]
created: 2026-03-24
---

> **Loại file**: Appendix — Setup Guide
> **Dùng khi**: Thiết lập môi trường phát triển và debug lần đầu

---

## Tổng quan Toolchain

Để biên dịch, flash, và debug firmware ARM Cortex-M bare-metal, cần 4 thành phần:

```text
Source (.c, .h, .s)
       │
  arm-none-eabi-gcc  ← Cross-compiler: biên dịch cho ARM target
       │
  firmware.elf / firmware.bin
       │
  arm-none-eabi-gdb  ← GDB client: gửi debug command
       │  (qua TCP :3333)
  OpenOCD            ← On-chip debugger: kết nối với probe
       │  (qua SWD/JTAG)
  ST-Link / J-Link   ← Hardware probe: gắn vào board
       │
  STM32 Target Board
```

---

## Cài đặt GCC ARM Embedded

### Linux (Ubuntu/Debian)

```bash
# Cài từ package manager (có thể không phải bản mới nhất)
sudo apt install gcc-arm-none-eabi binutils-arm-none-eabi

# Kiểm tra phiên bản
arm-none-eabi-gcc --version

# Hoặc tải bản mới nhất từ ARM
# https://developer.arm.com/downloads/-/arm-gnu-toolchain-downloads
wget https://developer.arm.com/-/media/Files/downloads/gnu/13.2.rel1/binrel/\
arm-gnu-toolchain-13.2.rel1-x86_64-arm-none-eabi.tar.xz
tar xf arm-gnu-toolchain-13.2.rel1-x86_64-arm-none-eabi.tar.xz
export PATH=$PATH:$(pwd)/arm-gnu-toolchain-13.2.rel1-x86_64-arm-none-eabi/bin
```

### macOS

```bash
brew install --cask gcc-arm-embedded
# Hoặc
brew tap osx-cross/arm
brew install arm-gcc-bin
```

### Windows

Tải installer từ: developer.arm.com/downloads/-/arm-gnu-toolchain-downloads

---

## Công cụ Binutils

Đây là bộ công cụ phân tích binary, đi kèm GCC:

```bash
# Disassemble firmware ELF
arm-none-eabi-objdump -d firmware.elf

# Disassemble kèm source (cần -g khi compile)
arm-none-eabi-objdump -d -S firmware.elf

# Xem section headers
arm-none-eabi-objdump -h firmware.elf

# Xem symbol table (tên function và địa chỉ)
arm-none-eabi-nm firmware.elf | sort

# Kích thước từng section
arm-none-eabi-size firmware.elf

# Chuyển ELF sang binary để flash
arm-none-eabi-objcopy -O binary firmware.elf firmware.bin

# Chuyển ELF sang Intel HEX
arm-none-eabi-objcopy -O ihex firmware.elf firmware.hex

# Xem ELF header
arm-none-eabi-readelf -h firmware.elf

# Disassemble raw binary (không có symbol)
arm-none-eabi-objdump \
    -b binary -m armv7 \
    --disassembler-options=force-thumb \
    -D --adjust-vma=0x08000000 \
    firmware.bin
```

---

## Cài đặt OpenOCD

```bash
# Ubuntu/Debian
sudo apt install openocd

# macOS
brew install open-ocd

# Kiểm tra
openocd --version
openocd -c "version"
```

**Config files hay dùng** (thường ở `/usr/share/openocd/scripts/`):

```bash
# List interface configs
ls /usr/share/openocd/scripts/interface/

# Common interfaces:
# interface/stlink.cfg          — ST-Link V2/V3
# interface/jlink.cfg           — Segger J-Link
# interface/cmsis-dap.cfg       — Generic CMSIS-DAP (DAPLink, etc.)
# interface/buspirate.cfg       — Bus Pirate

# Common targets:
# target/stm32f4x.cfg           — STM32F4 series
# target/stm32l5x.cfg           — STM32L5 (TrustZone)
# target/nrf52.cfg              — Nordic nRF52
# target/esp32.cfg              — Espressif ESP32
```

**OpenOCD command hay dùng** (qua telnet port 4444):

```bash
telnet localhost 4444
> halt                          # Halt CPU
> reset halt                    # Reset và halt ngay reset vector
> resume                        # Tiếp tục chạy
> step                          # Single step 1 instruction
> reg                           # Xem tất cả registers
> reg pc                        # Xem PC
> mdw 0x08000000                # Read word tại địa chỉ
> mdw 0x08000000 16             # Read 16 words
> mww 0x20000100 0xDEADBEEF     # Write word
> dump_image out.bin 0x08000000 0x100000   # Dump 1MB flash
> flash write_image erase fw.bin 0x08000000  # Flash firmware
> flash info 0                  # Flash info
> shutdown                      # Đóng OpenOCD
```

---

## Cài đặt ST-Link Tools

```bash
# stlink-tools (Linux/macOS)
sudo apt install stlink-tools    # Ubuntu
brew install stlink               # macOS

# Flash với st-flash
st-flash write firmware.bin 0x08000000

# Erase toàn bộ flash
st-flash erase

# Read flash
st-flash read dump.bin 0x08000000 0x100000

# Xem thông tin chip
st-info --probe
```

---

## Makefile Mẫu cho Bare-Metal STM32F4

```makefile
# Makefile cho STM32F4 bare-metal

TARGET  = firmware
MCU     = cortex-m4
FPU     = -mfpu=fpv4-sp-d16 -mfloat-abi=hard

CC      = arm-none-eabi-gcc
OBJCOPY = arm-none-eabi-objcopy
SIZE    = arm-none-eabi-size

CFLAGS  = -mcpu=$(MCU) -mthumb $(FPU)
CFLAGS += -O2 -Wall -Wextra
CFLAGS += -ffunction-sections -fdata-sections
CFLAGS += -DSTM32F407xx
CFLAGS += -Iinclude -Icmsis/include

LDFLAGS = -mcpu=$(MCU) -mthumb $(FPU)
LDFLAGS += -TSTM32F407VG.ld
LDFLAGS += -Wl,--gc-sections
LDFLAGS += -specs=nosys.specs -specs=nano.specs

SRCS = $(wildcard src/*.c)
SRCS += startup/startup_stm32f407xx.s
OBJS = $(SRCS:.c=.o)
OBJS := $(OBJS:.s=.o)

all: $(TARGET).elf $(TARGET).bin

$(TARGET).elf: $(OBJS)
	$(CC) $(LDFLAGS) -o $@ $@

$(TARGET).bin: $(TARGET).elf
	$(OBJCOPY) -O binary $< $@
	$(SIZE) $<

flash: $(TARGET).bin
	st-flash write $< 0x08000000

debug: $(TARGET).elf
	openocd -f interface/stlink.cfg -f target/stm32f4x.cfg &
	arm-none-eabi-gdb $< -ex "target remote :3333" -ex "monitor reset halt"

clean:
	rm -f $(OBJS) $(TARGET).elf $(TARGET).bin

.PHONY: all flash debug clean
```

---

## GDB Cheat Sheet cho Embedded

```gdb
# Kết nối
target remote :3333          # Kết nối OpenOCD GDB server
monitor reset halt           # Reset và halt
load                         # Flash firmware từ ELF

# Execution
continue (c)                 # Tiếp tục chạy
step (s)                     # Step vào function
next (n)                     # Step qua function
finish                       # Chạy đến hết function
stepi (si)                   # Step 1 instruction (assembly level)

# Breakpoints
break main                   # Breakpoint tại hàm main
break *0x08001234            # Breakpoint tại địa chỉ
hbreak *0x08001234           # Hardware breakpoint (không modify flash)
watch *(uint32_t*)0x20001000 # Watchpoint khi ghi
info break                   # Liệt kê breakpoints

# Registers và Memory
info registers               # Tất cả registers
p/x $pc                      # In PC (hex)
p/x $msp                     # In MSP
p/u $r0                      # In R0 (unsigned decimal)
x/10wx 0x20000000            # Dump 10 words từ 0x20000000
x/20bx 0x08000000            # Dump 20 bytes
x/5i $pc                     # Disassemble 5 instructions từ PC

# Modify registers/memory (patch runtime)
set $r0 = 1                  # Set R0 = 1
set *((uint32_t*)0x20001000) = 0xDEAD  # Write memory

# Backtrace
bt                           # Call stack
frame 2                      # Switch sang frame 2
info locals                  # Local variables của frame hiện tại

# Scripting
source script.gdb            # Chạy GDB script
define my_cmd                # Định nghĩa custom command
  p/x $pc
end

# Flash programming qua OpenOCD
monitor flash write_image erase firmware.bin 0x08000000
monitor reset run
```

---

## Logic Analyzer Setup (Sigrok + PulseView)

Dùng để decode UART, SPI, I2C từ logic analyzer hardware:

```bash
# Cài Sigrok
sudo apt install sigrok pulseview   # Linux
brew install pulseview               # macOS

# Supported hardware (rẻ nhất): Clone Saleae ~$10 trên Amazon
# hoặc FX2-based logic analyzer

# Decode UART trong sigrok-cli
sigrok-cli -d fx2lafw \
    --channels D0=RX,D1=TX \
    --config samplerate=1m \
    --time 500ms \
    --protocol-decoders uart:baudrate=115200 \
    --protocol-decoders-output-format ascii \
    -o uart_capture.sr

# Trong PulseView: Add decoder → UART/SPI/I2C, set parameters, decode
```

---

## Recommended Hardware cho Lab

| Item | Giá ước tính | Mục đích |
|------|-------------|---------|
| STM32F4 Discovery board | $15–25 | Main development board |
| USB-UART adapter (CP2102/CH340) | $2–5 | UART console, UART flash |
| SOIC8 clip | $5–10 | SPI flash in-circuit access |
| CH341A programmer | $5–10 | SPI flash dump (W25Qxx) |
| Logic analyzer (8ch clone) | $10–15 | Protocol decode |
| J-Link EDU Mini | $18 | Better debug than ST-Link |
| ChipWhisperer Nano | $50 | Fault injection + power analysis |

---

## References

- ARM — *GNU ARM Embedded Toolchain* — developer.arm.com/downloads
- OpenOCD — *OpenOCD User's Guide* — openocd.org/doc/html
- ST-Link Tools — github.com/stlink-org/stlink
- Sigrok/PulseView — sigrok.org
- flashrom — flashrom.org (for CH341A SPI flash dumping)
