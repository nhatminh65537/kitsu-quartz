---
title: "12. Finite State Machine (FSM)"
tags: [electronics, digital, lesson-12]
aliases: [Finite State Machine FSM]
created: 2026-03-30
---

> **Prerequisites**: [[11-flip-flop-sequential-logic|11. Flip-Flop & Sequential Logic]]
> **Objectives**:
> - Hiểu khái niệm FSM, phân biệt Moore và Mealy machine
> - Vẽ state diagram và xây dựng state table
> - Thiết kế FSM từ đặc tả đến mạch flip-flop
> - Hiện thực FSM trong code C/C++ cho MCU

---

## Motivation

Bộ đếm (Lesson 11) là một FSM đơn giản nhất — đếm tuần tự và tự động. Nhưng hầu hết hệ thống thực tế phức tạp hơn: máy bán hàng phản ứng theo số tiền bỏ vào, đèn giao thông chuyển pha theo thời gian, giao thức UART xử lý từng bit dữ liệu...

**Finite State Machine (FSM)** là mô hình toán học mô tả hệ thống có hữu hạn trạng thái. Đây là công cụ thiết kế mạch số và firmware quan trọng nhất.

---

## Mô Hình FSM

> [!definition] Definition 12.1 — Finite State Machine
> FSM gồm 5 thành phần:
>
> - $S$ — tập hữu hạn các **trạng thái (states)**
> - $I$ — tập **đầu vào (inputs)**
> - $O$ — tập **đầu ra (outputs)**
> - $\delta: S \times I \to S$ — **hàm chuyển trạng thái (transition function)**
> - $\lambda$ — **hàm đầu ra (output function)**
>
> Có hai loại FSM tùy thuộc vào $\lambda$:
>
> | | **Moore** | **Mealy** |
> |-|-----------|-----------|
> | Đầu ra phụ thuộc | Chỉ trạng thái hiện tại | Trạng thái + đầu vào |
> | $\lambda$ | $\lambda(s)$ | $\lambda(s, i)$ |
> | Đặc điểm | Đơn giản hơn, ổn định hơn | Ít trạng thái hơn, phản hồi nhanh |

---

## State Diagram

State diagram là biểu đồ trực quan hóa FSM:
- **Vòng tròn**: trạng thái
- **Mũi tên**: chuyển trạng thái
- **Nhãn mũi tên**: điều kiện đầu vào
- **Nhãn trạng thái** (Moore): đầu ra bên trong vòng
- **Nhãn mũi tên** (Mealy): input/output

> [!example] Example 12.2 — FSM Máy Bán Hàng Đơn Giản
> Máy bán hàng giá 15 xu. Chấp nhận xu 5 và xu 10. Không thối tiền.
>
> ```mermaid
> graph LR
>     S0["S0: 0¢"] -->|"5¢"| S1["S1: 5¢"]
>     S0 -->|"10¢"| S2["S2: 10¢"]
>     S1 -->|"5¢"| S2
>     S1 -->|"10¢"| S3["S3: DISPENSE"]
>     S2 -->|"5¢"| S3
>     S2 -->|"10¢"| S3
>     S3 -->|"reset"| S0
> ```
>
> S3 là trạng thái xuất hàng (output = 1). Đây là **Moore machine**.

---

## State Table & Mã Hóa Trạng Thái

> [!definition] Definition 12.3 — State Table
> State table liệt kê đầy đủ trạng thái hiện tại, đầu vào, trạng thái kế và đầu ra:
>
> | Trạng thái hiện tại | Input | Trạng thái kế | Output |
> |---------------------|-------|---------------|--------|
> | S0 | 0 | S0 | 0 |
> | S0 | 1 | S1 | 0 |
> | S1 | 0 | S1 | 0 |
> | S1 | 1 | S2 | 0 |
> | S2 | 0 | S2 | 0 |
> | S2 | 1 | S0 | 1 |

**Mã hóa trạng thái (state encoding)**:
- **Binary**: $n$ flip-flop mã hóa $2^n$ trạng thái — tiết kiệm flip-flop nhất
- **One-hot**: mỗi trạng thái dùng 1 flip-flop riêng — logic đơn giản, nhiều flip-flop hơn
- **Gray code**: mỗi chuyển trạng thái chỉ đổi 1 bit — hạn chế glitch

---

## Quy Trình Thiết Kế FSM

1. **Đặc tả**: mô tả hành vi bằng lời
2. **State diagram**: vẽ các trạng thái và chuyển trạng thái
3. **State table**: liệt kê đầy đủ
4. **Mã hóa trạng thái**: chọn binary/one-hot
5. **Phương trình kích hoạt (excitation equations)**: tính D (hoặc J,K) cho từng flip-flop từ state table
6. **Phương trình đầu ra**: tính output từ trạng thái (Moore) hoặc trạng thái + input (Mealy)
7. **Vẽ mạch**: flip-flop + mạch tổ hợp

> [!example] Example 12.4 — Thiết Kế Bộ Phát Hiện Chuỗi "101"
> Đầu vào: chuỗi bit nối tiếp. Đầu ra Y=1 khi nhận được chuỗi "101".
>
> Trạng thái:
> - $S_0$: ban đầu (chưa nhận gì khớp)
> - $S_1$: đã nhận "1"
> - $S_2$: đã nhận "10"
> - $S_3$: đã nhận "101" → Y=1
>
> ```mermaid
> graph LR
>     S0["S0"] -->|"1"| S1["S1"]
>     S0 -->|"0"| S0
>     S1 -->|"0"| S2["S2"]
>     S1 -->|"1"| S1
>     S2 -->|"1"| S3["S3/Y=1"]
>     S2 -->|"0"| S0
>     S3 -->|"1"| S1
>     S3 -->|"0"| S2
> ```

---

## Hiện Thực FSM Trong C (MCU)

FSM trong firmware Arduino/STM32 thường dùng `enum` + `switch-case`:

```cpp
enum State { S_IDLE, S_RUNNING, S_ERROR, S_DONE };

State currentState = S_IDLE;

void fsm_update(int input) {
    switch (currentState) {
        case S_IDLE:
            if (input == START_SIGNAL) {
                currentState = S_RUNNING;
                start_motor();
            }
            break;

        case S_RUNNING:
            if (sensor_error()) {
                currentState = S_ERROR;
                stop_motor();
            } else if (task_done()) {
                currentState = S_DONE;
            }
            break;

        case S_ERROR:
            display_error();
            if (input == RESET_SIGNAL) {
                currentState = S_IDLE;
                clear_error();
            }
            break;

        case S_DONE:
            currentState = S_IDLE;
            break;
    }
}

void loop() {
    int input = read_input();
    fsm_update(input);
    delay(10);
}
```

> [!warning] Anti-Pattern — Tránh Dùng delay() Trong FSM
> Dùng `delay()` trong vòng lặp FSM làm MCU không phản hồi được các sự kiện khác. Thay bằng **non-blocking timer** (millis() trong Arduino):
>
> ```cpp
> unsigned long lastTime = 0;
> if (millis() - lastTime >= 10) {
>     lastTime = millis();
>     fsm_update(read_input());
> }
> ```

---

## Ứng Dụng FSM Thực Tế

**1. Giao tiếp UART**: FSM nhận từng bit (start bit → data bits → stop bit)

**2. Debounce nút nhấn**: FSM phát hiện nhấn ổn định, chống nhiễu nảy

**3. Điều khiển motor**: idle → accelerate → cruise → decelerate → stop

**4. Giao thức SPI/I2C**: trạng thái start → address → data → stop

**5. Menu LCD**: điều hướng menu = FSM với các trạng thái là màn hình menu

---

## Summary / Key Takeaways

- FSM: hữu hạn trạng thái, chuyển trạng thái dựa trên đầu vào
- **Moore**: output phụ thuộc state — ổn định, dễ debug
- **Mealy**: output phụ thuộc state + input — ít state hơn, phản hồi nhanh hơn
- Quy trình: state diagram → state table → mã hóa → excitation equations → mạch
- Trong MCU: dùng `enum` + `switch-case`; tránh `delay()` trong FSM
- FSM là nền tảng của mọi firmware phức tạp — học kỹ sẽ dùng rất nhiều

---

## References

- Morris Mano — *Digital Design*, 5th ed., Ch. 6
- Embedded.fm — FSM in embedded systems: https://embedded.fm/episodes/fsm
- Arduino State Machine Library — https://github.com/jrullan/StateMachine
