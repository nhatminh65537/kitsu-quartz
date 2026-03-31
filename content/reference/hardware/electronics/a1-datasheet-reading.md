---
title: "A1. Datasheet Reading Guide"
tags: [electronics, appendix, reference]
aliases: [Đọc Datasheet Hướng Dẫn]
created: 2026-03-30
---

> **Liên quan**: [[05-diode-characteristics-applications|05. Diode]], [[06-bjt-transistor-amplifier-switch|06. BJT]], [[13-linear-regulator|13. Linear Regulator]], [[15-microcontroller-architecture|15. MCU Architecture]]

---

## Tại Sao Phải Đọc Datasheet?

Datasheet là tài liệu kỹ thuật chính thức từ nhà sản xuất — nguồn thông tin **duy nhất đáng tin 100%** về linh kiện. Code ví dụ trên internet có thể sai; tutorial có thể thiếu thông tin. Datasheet là tài liệu cuối cùng.

Không cần đọc hết toàn bộ datasheet (thường 20–500 trang). Cần biết **tra nhanh** những gì quan trọng.

---

## Cấu Trúc Chung Của Datasheet

Hầu hết datasheet đều có các phần:

| Phần | Nội Dung Quan Trọng |
|------|---------------------|
| **Title / Overview** | Mô tả ngắn, ứng dụng chính, tính năng nổi bật |
| **Pin Configuration** | Sơ đồ chân, tên và chức năng từng chân |
| **Absolute Maximum Ratings** | **GIỚI HẠN TUYỆT ĐỐI** — vượt qua là hỏng linh kiện |
| **Recommended Operating Conditions** | Điều kiện hoạt động bình thường |
| **Electrical Characteristics** | Thông số điện: $V_{out}$, $I_{max}$, $V_{dropout}$... |
| **Typical Application Circuit** | Mạch tham khảo từ nhà sản xuất — **rất quan trọng** |
| **Timing Diagrams** | Mô tả giao thức, chu kỳ clock (cho IC số/MCU) |
| **Package Information** | Kích thước vật lý, thông tin hàn |

---

## Absolute Maximum Ratings — Đọc Trước Tiên!

> [!warning] Absolute Maximum Ratings
> Đây là giới hạn mà **vượt qua là hỏng linh kiện ngay lập tức** — không có vùng đệm an toàn.
>
> **Không bao giờ** thiết kế mạch đẩy đến giới hạn tuyệt đối. Luôn để **deration factor** (thường dùng 70–80% giá trị tối đa).

Ví dụ — ATmega328P Absolute Maximum Ratings:

| Thông Số | Giá Trị | Ghi Chú |
|----------|---------|---------|
| $V_{CC}$ | −0.5 V đến +6 V | Điện áp nguồn |
| $V_{pin}$ | −0.5 V đến $V_{CC}+0.5$ V | Điện áp trên bất kỳ pin nào |
| $I_{pin}$ max | 40 mA | Dòng max mỗi GPIO pin |
| $I_{VCC}$ + $I_{GND}$ | 200 mA | Tổng dòng qua chip |
| $T_{storage}$ | −65°C đến +150°C | Nhiệt độ bảo quản |

---

## Cách Đọc Datasheet Theo Từng Loại Linh Kiện

### Điện Trở

Thông số cần tra:
- **Resistance** [Ω]: giá trị điện trở
- **Tolerance** [%]: ±1%, ±5%, ±10%
- **Power rating** [W]: 1/8W, 1/4W, 1/2W, 1W
- **Temperature coefficient** [ppm/°C]: thay đổi theo nhiệt độ

### Tụ Điện

Thông số cần tra:
- **Capacitance** [F]: giá trị điện dung
- **Voltage rating**: điện áp tối đa — luôn chọn cao hơn điện áp thực tế ít nhất 1,5×
- **ESR** (Equivalent Series Resistance): thấp là tốt cho power filtering
- **Type**: Ceramic (MLCC) — tốt cho bypassing; Electrolytic — dung lượng lớn nhưng có polarity

### Diode

Thông số cần tra:

| Ký Hiệu | Tên | Ý Nghĩa |
|---------|-----|---------|
| $V_F$ | Forward voltage | Điện áp sụt khi dẫn điện (ở dòng cụ thể) |
| $I_F$ | Forward current max | Dòng điện tối đa khi dẫn điện |
| $V_{RRM}$ | Peak Reverse Voltage | Điện áp ngược tối đa |
| $I_{RRM}$ | Reverse leakage current | Dòng rò khi phân cực ngược |
| $t_{rr}$ | Reverse recovery time | Thời gian khóa lại — quan trọng với tốc độ cao |

**Ví dụ 1N4007**: $V_F = 1\,\text{V}$ (at $I_F = 1\,\text{A}$), $I_{F,avg} = 1\,\text{A}$, $V_{RRM} = 1000\,\text{V}$.

### BJT Transistor

Thông số cần tra:

| Ký Hiệu | Tên | Ý Nghĩa |
|---------|-----|---------|
| $V_{CEO}$ | Collector-Emitter Voltage | Điện áp tối đa từ C đến E |
| $I_{C,max}$ | Max Collector Current | Dòng collector tối đa |
| $P_{tot}$ | Total Power Dissipation | Công suất tối đa có thể tiêu tán |
| $h_{FE}$ ($\beta$) | DC Current Gain | Hệ số khuếch đại dòng |
| $V_{CE,sat}$ | Saturation Voltage | Điện áp C-E khi bão hòa (~0,2 V) |
| $V_{BE}$ | Base-Emitter Voltage | Ngưỡng dẫn (~0,6–0,7 V) |
| $f_T$ | Transition Frequency | Tần số max có thể khuếch đại |

**Lưu ý quan trọng**: $h_{FE}$ thường cho một dải rộng (ví dụ 100–300). Khi thiết kế, luôn dùng **$h_{FE,min}$** để đảm bảo mạch hoạt động ngay cả với transistor có gain thấp.

### Op-Amp

| Ký Hiệu | Tên | Ý Nghĩa |
|---------|-----|---------|
| $A_{OL}$ | Open-Loop Gain | Hệ số khuếch đại vòng hở |
| GBW | Gain-Bandwidth Product | $A_v \times f_{max}$ = hằng số |
| SR | Slew Rate [V/μs] | Tốc độ thay đổi output tối đa |
| $V_{OS}$ | Input Offset Voltage | Sai số điện áp vào |
| $I_{B}$ | Input Bias Current | Dòng vào nhỏ tại input |
| CMRR | Common-Mode Rejection Ratio | Khả năng loại bỏ tín hiệu chung |
| PSRR | Power Supply Rejection Ratio | Độ nhạy với dao động nguồn |
| $V_{out,range}$ | Output Swing | Dải output — quan trọng với nguồn đơn |

### Linear Regulator (78xx / LDO)

| Ký Hiệu | Tên | Quan Trọng |
|---------|-----|-----------|
| $V_{out}$ | Output Voltage | Điện áp ra cố định |
| $V_{in,range}$ | Input Voltage Range | Dải áp vào cho phép |
| $V_{dropout}$ | Dropout Voltage | Chênh lệch $V_{in} - V_{out}$ tối thiểu |
| $I_{out,max}$ | Max Output Current | Dòng ra tối đa |
| $T_{j,max}$ | Max Junction Temperature | Nhiệt độ junction tối đa |
| $\theta_{JA}$ | Thermal Resistance (Junction-Ambient) | Tính nhiệt độ junction |
| Load Regulation | Biến đổi $V_{out}$ theo tải | Thấp = ổn định hơn |
| Line Regulation | Biến đổi $V_{out}$ theo $V_{in}$ | Thấp = ổn định hơn |

---

## Mạch Ứng Dụng Điển Hình (Typical Application)

Hầu hết datasheet có mục "Typical Application Circuit" hoặc "Application Example" — đây là mạch tham khảo đã được nhà sản xuất kiểm tra và đảm bảo hoạt động.

> [!warning] Không Bỏ Qua Mạch Điển Hình
> Luôn xem mạch ứng dụng điển hình trước khi thiết kế. Nó thường chỉ ra:
> - Giá trị tụ bypass cần thiết
> - Cần pin kéo lên/xuống nào
> - Điện trở phân áp nếu cần
> - Diode bảo vệ, ferrite bead nếu cần

---

## Công Cụ Tra Datasheet

| Trang Web | Mô Tả |
|-----------|-------|
| https://www.alldatasheet.com | Database datasheet lớn nhất |
| https://datasheetspdf.com | Thêm một trang tìm kiếm |
| https://www.ti.com | TI products — datasheet chất lượng cao |
| https://www.st.com | STMicro products |
| https://www.mouser.com | Distributor, có datasheet đầy đủ |
| https://octopart.com | So sánh giá + link datasheet |

**Cách tìm**: Gõ part number vào Google + "datasheet" (ví dụ: "7805 datasheet"). Ưu tiên tải từ trang nhà sản xuất (TI, ON Semi, STMicro...).
