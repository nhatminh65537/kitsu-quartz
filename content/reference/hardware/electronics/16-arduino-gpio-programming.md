---
title: "16. Arduino — Basic C Programming & GPIO"
tags: [electronics, embedded, lesson-16]
aliases: [Arduino Lập Trình C Cơ Bản GPIO]
created: 2026-03-30
---

> **Prerequisites**: [[15-microcontroller-architecture|15. Microcontroller Architecture]]
> **Objectives**:
> - Hiểu cấu trúc chương trình Arduino: setup() và loop()
> - Dùng digitalWrite, digitalRead, analogWrite (PWM)
> - Lập trình debounce nút nhấn đúng cách
> - Dùng Serial để debug
> - Hiểu và tránh lỗi dùng delay() quá nhiều — thay bằng millis()

---

## Motivation

Arduino IDE và thư viện Arduino cung cấp lớp trừu tượng đơn giản để lập trình MCU mà không cần biết chi tiết phần cứng. Đây là điểm xuất phát lý tưởng — bạn có thể làm LED nhấp nháy chỉ sau 5 phút.

Tuy nhiên, để viết firmware thực sự tốt (không bị giật, phản hồi nhanh, không lãng phí tài nguyên), bạn cần hiểu **cách Arduino hoạt động bên dưới** và tránh các anti-pattern phổ biến.

---

## Cấu Trúc Chương Trình Arduino

```cpp
void setup() {
    // Chạy MỘT LẦN khi khởi động
    // Khởi tạo pin, Serial, biến...
}

void loop() {
    // Chạy LẶP MÃI MÃI
    // Logic chính của chương trình
}
```

Đây là vòng lặp vô hạn — ATmega328P không có hệ điều hành, không có tiến trình nền, không có scheduler. `loop()` chạy liên tục từ khi cấp điện đến khi mất điện.

---

## GPIO — Digital Input/Output

### Khai Báo Và Cấu Hình Pin

```cpp
// Constants
const int LED_PIN = 13;
const int BTN_PIN = 2;

void setup() {
    pinMode(LED_PIN, OUTPUT);
    pinMode(BTN_PIN, INPUT_PULLUP); // kích hoạt pull-up nội 20-50kΩ
}
```

> [!definition] Definition 16.1 — Ba Chế Độ Của pinMode()
>
> | Chế Độ | Hằng Số | Mô Tả |
> |--------|---------|-------|
> | Output | `OUTPUT` | Pin điều khiển điện áp (0V hoặc 5V) |
> | Input | `INPUT` | Đọc điện áp ngoài — pin "nổi" nếu không kết nối |
> | Input + Pull-up | `INPUT_PULLUP` | Đọc điện áp + bật pull-up nội ~47 kΩ lên VCC |
>
> **Quy tắc**: luôn dùng `INPUT_PULLUP` cho nút nhấn — nút nối từ pin xuống GND, đọc `LOW` = nhấn.

### Đọc Và Ghi Digital

```cpp
void loop() {
    int btnState = digitalRead(BTN_PIN);  // HIGH hoặc LOW
    
    if (btnState == LOW) {               // nút nhấn (active-low)
        digitalWrite(LED_PIN, HIGH);
    } else {
        digitalWrite(LED_PIN, LOW);
    }
}
```

---

## PWM — analogWrite()

**PWM (Pulse Width Modulation)** cho phép xuất tín hiệu giả analog bằng cách thay đổi duty cycle.

```cpp
analogWrite(pin, value); // value: 0–255
                         // 0   = 0%   duty = 0V (average)
                         // 128 = 50%  duty
                         // 255 = 100% duty = 5V (average)
```

> [!definition] Definition 16.2 — PWM Pins Arduino Uno
> Chỉ có **6 pin hỗ trợ PWM**: D3, D5, D6, D9, D10, D11.
>
> Tần số PWM mặc định:
> - D5, D6: ~980 Hz (Timer0)
> - D3, D9, D10, D11: ~490 Hz (Timer1, Timer2)
>
> `analogWrite()` KHÔNG xuất điện áp analog thực — chỉ là PWM. Để đọc/ghi điện áp analog thực cần ADC (đọc) hoặc DAC ngoài (ghi).

```cpp
// Fade LED dần dần
void loop() {
    for (int brightness = 0; brightness <= 255; brightness++) {
        analogWrite(9, brightness);
        delay(10);
    }
    for (int brightness = 255; brightness >= 0; brightness--) {
        analogWrite(9, brightness);
        delay(10);
    }
}
```

---

## Serial — Debugging

Serial communication với máy tính qua USB (thông qua USB-Serial chip trên Arduino Uno):

```cpp
void setup() {
    Serial.begin(9600);  // baud rate: 9600 bps
    Serial.println("Arduino started!");
}

void loop() {
    int sensorVal = analogRead(A0);
    Serial.print("Sensor: ");
    Serial.println(sensorVal);
    delay(500);
}
```

> [!warning] Serial và Pin D0/D1
> UART Serial dùng pin D0 (RX) và D1 (TX). **Không kết nối thiết bị vào D0/D1** khi đang dùng Serial hoặc khi upload code — sẽ xung đột.

---

## Anti-Pattern: delay() và Giải Pháp millis()

### Vấn Đề Với delay()

```cpp
// ❌ ANTI-PATTERN — MCU bị block hoàn toàn
void loop() {
    digitalWrite(LED_PIN, HIGH);
    delay(500);                   // MCU không làm gì trong 500ms!
    digitalWrite(LED_PIN, LOW);
    delay(500);
}
```

Trong `delay()`, MCU không thể đọc nút nhấn, cập nhật sensor, nhận lệnh Serial...

### Giải Pháp: millis() + Non-Blocking

```cpp
const int LED_PIN = 13;
const long INTERVAL = 500;

unsigned long previousMillis = 0;
bool ledState = false;

void loop() {
    unsigned long currentMillis = millis(); // ms kể từ khi bật nguồn
    
    if (currentMillis - previousMillis >= INTERVAL) {
        previousMillis = currentMillis;
        ledState = !ledState;                // toggle
        digitalWrite(LED_PIN, ledState);
    }
    
    // Có thể làm việc khác ở đây — MCU KHÔNG bị block!
    // int btn = digitalRead(BTN_PIN);
    // readSensor();
    // ...
}
```

> [!definition] Definition 16.3 — Pattern Non-Blocking Timer
> So sánh thời gian hiện tại `millis()` với thời gian lần trước → nếu đủ khoảng cách → thực hiện hành động.
>
> Công thức: `if (currentMillis - previousMillis >= interval)`
>
> Lưu ý: `millis()` sẽ **tràn** (overflow) sau ~49,7 ngày. Phép trừ unsigned long vẫn đúng ngay cả khi tràn — đây là lý do dùng phép trừ thay vì so sánh trực tiếp.

---

## Debounce Nút Nhấn

Nút nhấn cơ học tạo ra nhiều xung giả khi nhấn/thả (bounce ~10–50 ms). Cần lọc:

```cpp
const int BTN_PIN = 2;
const long DEBOUNCE_MS = 50;

int lastBtnState = HIGH;
int btnState = HIGH;
unsigned long lastDebounceTime = 0;

void loop() {
    int reading = digitalRead(BTN_PIN);
    
    if (reading != lastBtnState) {
        lastDebounceTime = millis();  // reset timer khi thấy thay đổi
    }
    
    if (millis() - lastDebounceTime > DEBOUNCE_MS) {
        // Tín hiệu ổn định đủ lâu
        if (reading != btnState) {
            btnState = reading;
            if (btnState == LOW) {
                Serial.println("Button pressed!");
                // xử lý nhấn nút ở đây
            }
        }
    }
    
    lastBtnState = reading;
}
```

---

## Bài Tập Thực Hành

> [!example] Bài 1 — Traffic Light
> Lập trình đèn giao thông 3 màu (3 LED: đỏ, vàng, xanh) với chu kỳ:
> - Đỏ: 5 giây
> - Xanh: 5 giây
> - Vàng: 2 giây
>
> **Yêu cầu**: dùng millis(), không dùng delay().

> [!example] Bài 2 — Dimmer PWM
> Đọc giá trị của biến trở (potentiometer) trên A0, dùng giá trị đó để điều chỉnh độ sáng của LED qua `analogWrite()`.
>
> Gợi ý: `analogRead()` trả về 0–1023; `analogWrite()` nhận 0–255 → cần `map()`.

---

## Summary / Key Takeaways

- Arduino sketch = `setup()` (chạy 1 lần) + `loop()` (lặp vô hạn)
- `pinMode(pin, OUTPUT/INPUT/INPUT_PULLUP)` — cấu hình pin
- `digitalWrite(pin, HIGH/LOW)` / `digitalRead(pin)` — digital I/O
- `analogWrite(pin, 0–255)` — PWM output trên 6 pin D3,D5,D6,D9,D10,D11
- `Serial.begin(9600)` + `Serial.println()` — debug qua USB
- **Tránh delay()** trong vòng lặp chính — dùng `millis()` + non-blocking pattern
- Debounce nút nhấn luôn cần thiết (~50 ms)

---

## References

- Arduino Reference — https://www.arduino.cc/reference/en/
- Arduino millis() — https://www.arduino.cc/reference/en/language/functions/time/millis/
- Blink Without Delay — https://www.arduino.cc/en/Tutorial/BuiltInExamples/BlinkWithoutDelay
