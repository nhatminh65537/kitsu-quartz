---
title: "A3. Hardware Hacking Toolkit"
tags: [embedded, microcontroller, arm-cortex-m, appendix, hardware-hacking]
aliases: [Hardware Hacking Toolkit, ChipWhisperer, Logic Analyzer]
created: 2026-03-24
---

> **Loại file**: Appendix — Hardware & Software Toolkit Reference
> **Dùng khi**: Chuẩn bị lab hardware hacking, cần biết tool nào dùng cho kỹ thuật nào

---

## Tổng quan Attack Categories và Tools

```text
Attack Category          → Tool cần
─────────────────────────────────────────────────────────────
UART console sniff/inject → USB-UART adapter + screen/minicom
SWD firmware dump         → ST-Link + OpenOCD + GDB
JTAG boundary scan        → OpenOCD / JTAG adapter
SPI flash dump            → SOIC8 clip + CH341A + flashrom
I2C/SPI bus sniff         → Logic analyzer (Saleae/clone)
Power side-channel        → ChipWhisperer / oscilloscope + shunt
Voltage fault injection   → ChipWhisperer / custom glitcher
Clock fault injection     → ChipWhisperer / signal generator
EM fault injection        → EM probe + amplifier + pulse generator
Firmware reverse eng.     → Ghidra / radare2 / Binary Ninja
```

---

## Tier 1 — Essential (~$50–100)

### USB-UART Adapter

```text
Model: CP2102 hoặc CH340G module
Giá: $2–5 (mua trên AliExpress)
Dùng cho:
  - Kết nối UART console IoT device
  - Flash STM32 qua ROM bootloader (stm32flash)
  - Đọc debug log khi boot

Kết nối:
  Adapter GND → Target GND   (PHẢI kết nối GND trước)
  Adapter TX  → Target RX
  Adapter RX  → Target TX
  KHÔNG kết nối VCC nếu target đã có nguồn riêng

Software: screen, minicom, picocom (Linux/macOS)
  screen /dev/ttyUSB0 115200
  minicom -D /dev/ttyUSB0 -b 115200
```

### Logic Analyzer 8-Channel Clone

```text
Model: Saleae-clone (FX2-based), $10–15 trên Amazon
Software: PulseView (open-source), Saleae Logic (proprietary)
Dùng cho:
  - Decode UART, SPI, I2C, 1-Wire, JTAG
  - Xác định baud rate từ pulse width
  - Verify protocol implementation
  - Sniff SPI flash traffic khi boot

Setup với PulseView:
  1. Kết nối GND probe trước
  2. Kéo sample rate đủ cao: ≥10× baud rate (UART 115200 → 2 MHz)
  3. Add decoder: right-click → Add protocol decoder
  4. Set parameters (baudrate, data bits, parity...)
```

### ST-Link V2 Clone

```text
Model: ST-Link V2 mini clone, $3–8
Dùng cho:
  - Debug STM32 qua SWD
  - Flash firmware
  - Dump flash nếu RDP=0

Pinout (10-pin ARM SWD):
  Pin 1: VCC (3.3V)
  Pin 2: SWDIO
  Pin 4: SWCLK
  Pin 6: SWO (optional)
  Pin 9: GND
  Pin 10: nRESET

Software: OpenOCD, STM32CubeProgrammer, st-flash
```

### SOIC8 Clip + CH341A Programmer

```text
SOIC8 clip: $5–10 — kẹp vào chip 8-pin mà không cần hàn
CH341A programmer: $5–10 — đọc/ghi SPI flash qua USB

Dùng cho:
  - Dump firmware từ SPI NOR Flash (W25Qxx, MX25Lxx, GD25Qxx...)
  - Ghi firmware đã modify trở lại
  - Đọc EEPROM (AT24Cxx)

Software: flashrom (open-source)
  flashrom -p ch341a_spi -r dump.bin          # Đọc
  flashrom -p ch341a_spi -w modified.bin      # Ghi
  flashrom -p ch341a_spi --get-size           # Kích thước chip
  
SOIC8 pinout W25Qxx:
  /CS (1)  VCC (8)
  DO  (2)  /HOLD (7)
  /WP (3)  CLK (6)
  GND (4)  DI  (5)
```

---

## Tier 2 — Intermediate (~$100–300)

### Segger J-Link EDU Mini

```text
Giá: $18 (EDU license — chỉ cho phi thương mại)
Ưu điểm vs ST-Link clone:
  - Hỗ trợ nhiều MCU hơn (ARM, RISC-V, Renesas...)
  - Tốc độ cao hơn (SWD up to 50 MHz)
  - J-Link GDB Server ổn định hơn
  - RTT (Real-Time Transfer) — printf qua SWD không ảnh hưởng timing

Software: J-Link Commander, Ozone debugger, OpenOCD với jlink.cfg
  JLinkExe -device STM32F407VG -if SWD -speed 4000
  > connect
  > r              # Reset
  > halt
  > mem 0x08000000 0x100  # Read 256 bytes from Flash
  > savebin dump.bin 0x08000000 0x100000  # Dump 1MB
```

### Oscilloscope

```text
Model tối thiểu: Rigol DS1054Z (4 channel, 50 MHz) — $350
Model rẻ hơn: DS1102E (~$200) hoặc FNIRSI-1014D (~$100)

Dùng cho:
  - Đo power trace (với shunt resistor 10Ω–50Ω)
  - Phân tích clock signal
  - Debug timing issue
  - Xác nhận voltage glitch đang hoạt động
  - Đo rise time của SPI/I2C signals

Setup power trace cơ bản:
  VDD ──[10Ω shunt]── MCU VCC pin
                │
               ─┴─ Oscilloscope CH1 (AC coupling)
  
  Tìm peak trong power trace khi AES/RSA chạy → SPA
```

---

## Tier 3 — Advanced (~$300–600)

### ChipWhisperer Nano / Lite / Pro

```text
ChipWhisperer là platform open-source cho:
1. Power side-channel analysis (SPA/DPA/CPA)
2. Voltage fault injection (glitching)
3. Clock fault injection

Models:
  CW Nano   ($50):  entry level, target STM32F0/AVR
  CW Lite   ($250): full-featured, 10-bit ADC, 105 MS/s
  CW Pro    ($1500): 12-bit ADC, 200 MS/s, FPGA glitcher
  CW Husky  ($550): 12-bit, 200 MS/s, better glitch control

Setup cơ bản với CW Nano:
```

```python
import chipwhisperer as cw

scope = cw.scope()
scope.default_setup()

target = cw.target(scope)
target.baud = 38400

# Capture power trace khi AES chạy
scope.arm()
target.simpleserial_write('p', plaintext)
ret = scope.capture()
trace = scope.get_last_trace()

# Plot trace
import matplotlib.pyplot as plt
plt.plot(trace)
plt.show()
```

```text
ChipWhisperer tutorials (miễn phí):
  - Lab 2-1: Power Analysis for Password Bypass
  - Lab 3-1: DPA on AES (simulated)
  - Lab 4-1: Introduction to Glitching
  - Lab 5-1: Glitch to bypass password check
  URL: chipwhisperer.readthedocs.io/en/latest/tutorials
```

### EM (Electromagnetic) Probe

```text
Dùng cho: EM side-channel và EM fault injection (không cần kết nối vật lý)

Tự chế:
  - Dây đồng quấn thành vòng nhỏ (đường kính 1–5mm)
  - Kết nối với LNA (Low Noise Amplifier) → oscilloscope
  - Scan trên bề mặt chip để tìm điểm rò rỉ EM mạnh nhất

Commercial:
  Riscure EM probe set (~$1000+)
  Langer RF-U 2.5-2 ($200)

EM fault injection:
  - Đặt probe gần coil power supply của chip
  - Inject pulse ngắn (1–100 ns) tại thời điểm target
  - Pulse tạo dòng điện cảm ứng làm flip bit trong chip
  - Không cần can thiệp vào mạch → non-invasive so với voltage glitch
```

---

## Software Tools

### Ghidra (Reverse Engineering)

```text
Download: ghidra-sre.org (miễn phí, NSA open-source)

Setup cho firmware ARM:
1. File → New Project
2. Import firmware.bin
3. Language: ARM:LE:32:Cortex (hoặc v8 nếu Cortex-M33)
4. Options → Base Address: 0x08000000
5. Auto-analyze: tìm functions, strings, cross-references

Useful plugins cho embedded:
  - SVD-Loader: import SVD file → register names tự động
    github.com/leveldown-security/SVD-Loader-Ghidra
  - BinExport: export sang BinDiff
```

### radare2

```bash
# Mở firmware binary cho ARM Thumb-2
r2 -a arm -b 16 -m 0x08000000 firmware.bin

# Commands cơ bản
aaa                    # Auto-analyze (tìm functions)
pdf @ main             # Disassemble function main
px 64 @ 0x08001000     # Hexdump 64 bytes
s 0x08001000           # Seek đến địa chỉ
V                      # Visual mode (nhấn p để đổi view)
iz                     # List strings
afl                    # List functions found
```

### binwalk

```bash
# Phân tích firmware binary
binwalk firmware.bin

# Extract embedded content
binwalk -e firmware.bin

# Entropy analysis — tìm vùng encrypted/compressed
binwalk -E firmware.bin

# Deep scan
binwalk -Me firmware.bin   # Recursive extract
```

### stm32flash

```bash
# Flash qua UART (ROM bootloader) — cần BOOT0=HIGH
stm32flash /dev/ttyUSB0                    # Detect chip
stm32flash -r dump.bin -S 0x08000000:0x100000 /dev/ttyUSB0  # Dump
stm32flash -w firmware.bin -v /dev/ttyUSB0  # Flash
stm32flash -e 255 /dev/ttyUSB0             # Erase all
```

---

## Reconnaissance Checklist — Tiếp Cận Target IoT

```text
Khi cầm một IoT device lần đầu:

BƯỚC 1: Visual inspection
  □ Chụp ảnh toàn bộ PCB (cả hai mặt)
  □ Nhận diện tất cả chip ICs — tra số part lên Google/Octopart
  □ Tìm test pads, connector J*, via groups lẻ
  □ Tìm chip flash 8-pin (thường gần MCU)
  □ Đo GND pad (đồng hồ thông mạch)
  □ Nhận diện BOOT0, nRST pads

BƯỚC 2: Tìm UART
  □ Scan pad groups gần MCU — đo voltage khi boot
  □ TX pad: oscillate giữa GND và VCC khi boot → có data
  □ Kết nối USB-UART, thử 115200 8N1 trước
  □ Dùng logic analyzer: capture 5–10 giây sau power-on

BƯỚC 3: SPI flash dump
  □ Nhận dạng chip (SOT23-6 hoặc SOIC8)
  □ Tra datasheet: xác nhận SOIC8 pinout
  □ Kẹp SOIC8 clip hoặc hàn wire
  □ flashrom -p ch341a_spi -r dump.bin
  □ binwalk dump.bin để phân tích

BƯỚC 4: Debug interface
  □ Tìm SWD: nhóm 4 pad (VCC, GND, SWDIO, SWCLK)
  □ Thử kết nối OpenOCD với ST-Link
  □ Kiểm tra RDP level: x/wx 0x1FFFC000
  □ Nếu RDP=0: dump_image full flash

BƯỚC 5: Firmware analysis
  □ strings dump.bin | grep -i "pass\|key\|secret\|wifi\|admin"
  □ binwalk -e dump.bin
  □ Import vào Ghidra, tìm crypto functions
  □ Tìm hardcoded credentials
```

---

## References

- Colin O'Flynn — *ChipWhisperer Documentation* — chipwhisperer.readthedocs.io
- flashrom — flashrom.org
- Ghidra — ghidra-sre.org
- OpenOCD — openocd.org
- Jasper van Woudenberg, Colin O'Flynn — *The Hardware Hacking Handbook* — No Starch Press
- Joe FitzPatrick, Andrew Huang — *The Hardware Hacker* — No Starch Press
- Advanced Security Training — advancedsecurity.training
