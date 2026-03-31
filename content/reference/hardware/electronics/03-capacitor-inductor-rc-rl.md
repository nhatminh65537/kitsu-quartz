---
title: "03. Capacitor, Inductor & RC/RL Circuits"
tags: [electronics, circuit-fundamentals, lesson-03]
aliases: [Tụ Điện Cuộn Cảm Mạch RC RL]
created: 2026-03-30
---

> **Prerequisites**: [[01-voltage-current-ohm|01. Voltage, Current & Ohm's Law]], [[02-kirchhoff-circuit-analysis|02. Kirchhoff's Laws]]
> **Objectives**:
> - Hiểu tụ điện và cuộn cảm lưu trữ năng lượng như thế nào
> - Phân tích mạch RC và RL theo thời gian (transient response)
> - Tính hằng số thời gian τ và hiểu ý nghĩa vật lý
> - Nhận diện ứng dụng RC trong lọc nhiễu và tạo trễ

---

## Motivation

Điện trở chỉ tiêu thụ năng lượng. Nhưng **tụ điện (capacitor)** và **cuộn cảm (inductor)** có khả năng **lưu trữ** năng lượng — tụ lưu trữ trong điện trường, cuộn lưu trữ trong từ trường.

Điều này tạo ra hành vi hoàn toàn mới: mạch có "bộ nhớ" về quá khứ, điện áp và dòng điện thay đổi theo thời gian ngay cả khi nguồn không đổi. Đây là nền tảng của bộ lọc (filter), bộ tạo dao động (oscillator) và hầu hết các mạch analog phức tạp.

---

## Tụ Điện (Capacitor)

### Cấu Tạo & Nguyên Lý

Tụ điện gồm hai bản dẫn điện song song, cách nhau bởi lớp điện môi (dielectric). Khi nối với nguồn điện, điện tích tích lũy trên hai bản tạo ra điện trường.

> [!definition] Definition 3.1 — Điện Dung (Capacitance)
> **Điện dung** $C$ đặc trưng cho khả năng lưu trữ điện tích:
>
> $$Q = C \cdot V$$
>
> **Đơn vị**: Farad [F]. Thực tế dùng μF ($10^{-6}$F), nF ($10^{-9}$F), pF ($10^{-12}$F).
>
> Quan hệ dòng – điện áp của tụ:
>
> $$i_C(t) = C \cdot \frac{dv_C}{dt}$$
>
> **Ý nghĩa**: Tụ chỉ dẫn dòng khi điện áp **thay đổi**. Ở DC ổn định → tụ **hở mạch**.

**Ghép tụ** (ngược với điện trở!):

$$C_{series} = \frac{C_1 C_2}{C_1 + C_2} \qquad C_{parallel} = C_1 + C_2$$

**Năng lượng lưu trữ**:

$$E_C = \frac{1}{2} C V^2 \quad [\text{J}]$$

---

## Cuộn Cảm (Inductor)

> [!definition] Definition 3.2 — Độ Tự Cảm (Inductance)
> **Độ tự cảm** $L$ đặc trưng cho khả năng lưu trữ năng lượng từ trường:
>
> $$v_L(t) = L \cdot \frac{di_L}{dt}$$
>
> **Đơn vị**: Henry [H]. Thực tế dùng mH, μH.
>
> **Ý nghĩa**: Ở DC ổn định ($di/dt = 0$) → cuộn cảm **ngắn mạch** (chỉ còn điện trở dây).

**Năng lượng lưu trữ**:

$$E_L = \frac{1}{2} L I^2 \quad [\text{J}]$$

---

## Mạch RC — Phân Tích Theo Thời Gian

### Nạp Tụ (Charging)

Khi công tắc đóng tại $t = 0$, tụ nạp qua R. Giải phương trình vi phân KVL:

> [!definition] Definition 3.3 — Đáp Ứng Mạch RC (Nạp)
>
> $$V_C(t) = V_s \left(1 - e^{-t/\tau}\right)$$
>
> $$i(t) = \frac{V_s}{R} \, e^{-t/\tau}$$
>
> **Hằng số thời gian (time constant)**:
>
> $$\tau = RC$$

| Thời gian | $V_C / V_s$ | Trạng thái |
|-----------|------------|-----------|
| $\tau$ | 63,2% | Nạp được 63% |
| $3\tau$ | 95,0% | Gần đầy |
| $5\tau$ | 99,3% | **Coi như đầy hoàn toàn** |

### Phóng Tụ (Discharging)

Nếu tụ đã nạp đến $V_0$ rồi phóng qua R:

$$V_C(t) = V_0 \cdot e^{-t/\tau}$$

> [!example] Example 3.4 — Tính Hằng Số Thời Gian
> $R = 10\,\text{k}\Omega$, $C = 100\,\mu\text{F}$, $V_s = 5\,\text{V}$.
>
> $$\tau = RC = 10{,}000 \times 100 \times 10^{-6} = 1\,\text{s}$$
>
> Tụ nạp đầy sau $5\tau = 5\,\text{s}$.
> Điện áp tại $t = 1\,\text{s}$:
>
> $$V_C = 5(1 - e^{-1}) \approx 3{,}16\,\text{V}$$

---

## Mạch RL

> [!definition] Definition 3.5 — Đáp Ứng Mạch RL
>
> $$i_L(t) = \frac{V_s}{R}\left(1 - e^{-t/\tau}\right) \qquad \tau = \frac{L}{R}$$

**So sánh RC vs RL**:

| | RC | RL |
|--|----|----|
| Lưu trữ | Điện áp trên C | Dòng qua L |
| $\tau$ | $RC$ | $L/R$ |
| DC steady-state | C hở mạch | L ngắn mạch |
| Không nhảy bậc | $V_C$ | $i_L$ |

> [!warning] Quy Tắc Vàng
> - $V_C$ **không thể** thay đổi đột ngột (tụ điện)
> - $i_L$ **không thể** thay đổi đột ngột (cuộn cảm)
>
> Đây là tính chất "bộ nhớ" quan trọng nhất của hai linh kiện này.

---

## Ứng Dụng Thực Tế

**1. Debounce nút nhấn**: Tụ lọc nhiễu nảy cơ học — mạch RC làm chậm sự thay đổi điện áp, Arduino chỉ đọc tín hiệu ổn định.

**2. Decoupling capacitor**: Tụ $100\,\text{nF}$ đặt gần chân nguồn IC để lọc nhiễu tần số cao — thực hành bắt buộc khi thiết kế PCB.

**3. Timer 555**: Mạch RC xác định chu kỳ của bộ tạo xung 555 (sẽ gặp lại ở Module 4).

**4. DC-DC Converter**: Cuộn cảm lưu/giải phóng năng lượng theo từng chu kỳ (Lesson 14).

---

## Summary / Key Takeaways

- Tụ điện: $i = C \frac{dv}{dt}$ — lưu điện áp, hở mạch DC
- Cuộn cảm: $v = L \frac{di}{dt}$ — lưu dòng điện, ngắn mạch DC
- Mạch RC nạp/phóng theo hàm mũ với $\tau = RC$; mạch RL với $\tau = L/R$
- Sau $5\tau$ → trạng thái ổn định hoàn toàn
- $V_C$ và $i_L$ không bao giờ nhảy bậc

---

## References

- MIT OCW 6.002 — Lecture 9–11 (ocw.mit.edu)
- All About Circuits — https://www.allaboutcircuits.com/textbook/direct-current/chpt-13/
- Falstad — thêm Capacitor + Resistor, bật "Show Voltage Graph" để thấy đường cong nạp tụ
