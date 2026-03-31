---
title: "11. Flip-Flop & Sequential Logic"
tags: [electronics, digital, lesson-11]
aliases: [Flip-Flop Mạch Tuần Tự Sequential Logic]
created: 2026-03-30
---

> **Prerequisites**: [[10-combinational-logic|10. Combinational Logic]]
> **Objectives**:
> - Hiểu sự khác biệt mạch tổ hợp và mạch tuần tự
> - Phân tích hoạt động SR latch, D flip-flop, JK flip-flop, T flip-flop
> - Thiết kế thanh ghi dịch (shift register) và bộ đếm (counter)
> - Hiểu vai trò của clock trong mạch đồng bộ

---

## Motivation

Mạch tổ hợp (Lesson 10) không có bộ nhớ — đầu ra chỉ phụ thuộc đầu vào *hiện tại*. Nhưng hầu hết hệ thống thực tế cần **nhớ trạng thái**: đèn đang bật hay tắt? Máy bán hàng nhận được bao nhiêu tiền? MCU đang ở bước nào của quy trình?

**Mạch tuần tự (sequential logic)** giải quyết điều này. Thành phần cơ bản là **flip-flop** — một ô nhớ 1 bit có thể lưu trữ 0 hoặc 1 cho đến khi có lệnh thay đổi.

---

## SR Latch — Bộ Nhớ Đơn Giản Nhất

SR Latch (Set-Reset Latch) là mạch nhớ cơ bản nhất, xây từ 2 cổng NOR (hoặc NAND):

```
       S ----+--[NOR]---- Q
             |      \
             |       |
       R ----+--[NOR]---- Q_bar
```

> [!definition] Definition 11.1 — SR Latch (NOR)
>
> | S | R | Q (next) | Trạng thái |
> |---|---|----------|-----------|
> | 0 | 0 | Q (giữ) | **Hold** — nhớ trạng thái cũ |
> | 1 | 0 | 1 | **Set** — đặt Q = 1 |
> | 0 | 1 | 0 | **Reset** — đặt Q = 0 |
> | 1 | 1 | ??? | **Cấm!** — Q và Q_bar đều = 0, mâu thuẫn |
>
> Trạng thái S=R=1 là **trạng thái cấm (forbidden state)** — phải tránh trong thiết kế.

**Vấn đề SR Latch**: đầu ra thay đổi ngay khi S/R thay đổi (level-triggered). Trong hệ thống phức tạp, cần đồng bộ hóa bằng **clock**.

---

## D Flip-Flop (Data/Delay Flip-Flop)

D flip-flop giải quyết vấn đề trạng thái cấm và thêm điều khiển clock:

> [!definition] Definition 11.2 — D Flip-Flop
> **Edge-triggered**: chỉ lấy mẫu đầu vào D **tại cạnh lên (rising edge)** của clock.
>
> | CLK | D | Q (next) |
> |-----|---|----------|
> | ↑ | 0 | 0 |
> | ↑ | 1 | 1 |
> | 0 hoặc 1 | X | Q (giữ nguyên) |
>
> **Q(t+1) = D** — "D flip-flop lấy dữ liệu từ D, ghi vào Q khi có cạnh clock"

```
     D ─────┐
            [DFF]── Q
     CLK ───┘     └─ Q̄
```

D flip-flop là thành phần cốt lõi của **thanh ghi (register)**, **bộ nhớ SRAM**, và mọi mạch tuần tự trong CPU.

---

## JK Flip-Flop

JK flip-flop giải quyết trạng thái cấm của SR latch bằng cách thêm chức năng **Toggle**:

> [!definition] Definition 11.3 — JK Flip-Flop
>
> | J | K | Q (next) | Trạng thái |
> |---|---|----------|-----------|
> | 0 | 0 | Q | Hold |
> | 1 | 0 | 1 | Set |
> | 0 | 1 | 0 | Reset |
> | 1 | 1 | $\bar{Q}$ | **Toggle** — đảo Q |
>
> $$Q(t+1) = J\bar{Q} + \bar{K}Q$$

---

## T Flip-Flop (Toggle)

T flip-flop chỉ có một đầu vào T:
- T = 0: giữ nguyên
- T = 1: đảo Q ở mỗi cạnh clock

$$Q(t+1) = T \oplus Q$$

**Ứng dụng chính**: xây dựng **bộ đếm nhị phân (binary counter)**.

---

## Thanh Ghi Dịch (Shift Register)

Nối nhiều D flip-flop theo chuỗi, đầu ra Q của FF này là đầu vào D của FF tiếp theo:

```
    D_in → [FF0] → [FF1] → [FF2] → [FF3] → ...
              ↑       ↑       ↑       ↑
            CLK     CLK     CLK     CLK
```

> [!definition] Definition 11.4 — Shift Register
> Tại mỗi cạnh clock, dữ liệu **dịch sang phải** một vị trí.
>
> Ứng dụng:
> - **Serial-to-Parallel**: nhận dữ liệu nối tiếp (SPI/UART), xuất song song
> - **Parallel-to-Serial**: ngược lại
> - **Tạo trễ (delay)**: tín hiệu bị trễ $n$ chu kỳ clock qua $n$ flip-flop
> - **Thanh ghi vòng (ring counter)**: nối Q_out trở lại D_in

**IC phổ biến**: 74HC595 (8-bit Serial-In Parallel-Out) — dùng để mở rộng số chân GPIO từ Arduino bằng 3 dây SPI.

---

## Bộ Đếm (Counter)

### Bộ Đếm Nhị Phân Bất Đồng Bộ (Ripple Counter)

Nối T flip-flop theo chuỗi, Q của FF này là CLK của FF tiếp theo:

```
    CLK → [T=1,FF0] → Q0
           Q0 → [T=1,FF1] → Q1
                 Q1 → [T=1,FF2] → Q2
```

Đếm: 000 → 001 → 010 → 011 → 100 → ... → 111 → 000

> [!warning] Vấn Đề Ripple Counter
> Tín hiệu "gợn" (ripple) qua từng tầng → có độ trễ tích lũy → **glitch** trong một số ứng dụng. Dùng **synchronous counter** (tất cả FF cùng một clock) để tránh.

### Bộ Đếm Đồng Bộ (Synchronous Counter)

Tất cả flip-flop sử dụng cùng một clock. Logic kích hoạt Toggle phức tạp hơn nhưng không có glitch:

- FF0 (Q0): luôn toggle → $T_0 = 1$
- FF1 (Q1): toggle khi Q0 = 1 → $T_1 = Q_0$
- FF2 (Q2): toggle khi Q0 = Q1 = 1 → $T_2 = Q_0 Q_1$

**IC bộ đếm phổ biến**: 74HC163 (synchronous 4-bit counter, có load, clear).

### Bộ Đếm Mod-N

Đếm từ 0 đến N−1 rồi reset. Ví dụ: mod-10 (BCD counter) đếm 0–9.

Cách thực hiện: dùng cổng AND phát hiện trạng thái N → reset counter.

---

## Timing Diagram

Timing diagram là công cụ trực quan hóa mạch tuần tự:

```
CLK:  ___┌┐___┌┐___┌┐___┌┐___
D:    ___┌──────┐___________
Q:    _________┌──────┐_____
              ↑ cạnh lên CLK đầu tiên sau D=1
```

---

## Summary / Key Takeaways

- Mạch tuần tự có **bộ nhớ trạng thái** — khác mạch tổ hợp
- **SR Latch**: nhớ 1 bit, có trạng thái cấm S=R=1
- **D flip-flop**: Q(t+1) = D, edge-triggered — thành phần phổ biến nhất
- **JK flip-flop**: J=K=1 → Toggle; linh hoạt nhất
- **T flip-flop**: T=1 → Toggle; dùng xây counter
- **Shift register**: dịch dữ liệu; ứng dụng Serial↔Parallel
- **Counter**: bộ đếm nhị phân từ T flip-flop; đồng bộ tốt hơn bất đồng bộ

---

## References

- Morris Mano — *Digital Design*, 5th ed., Ch. 4–5
- 74HC595 Datasheet — https://www.ti.com/lit/ds/symlink/sn74hc595.pdf
- Logic.ly — thực hành xây flip-flop từ NAND gates
