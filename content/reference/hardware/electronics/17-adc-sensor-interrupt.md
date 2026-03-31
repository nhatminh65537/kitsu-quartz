---
title: "17. ADC, Sensor & Interrupt"
tags: [electronics, embedded, lesson-17]
aliases: [ADC Sensor Ngắt Interrupt]
created: 2026-03-30
---

> **Prerequisites**: [[16-arduino-gpio-programming|16. Arduino GPIO Programming]]
> **Objectives**:
> - Hiểu nguyên lý ADC 10-bit và ý nghĩa độ phân giải
> - Đọc cảm biến analog: nhiệt độ (NTC/LM35), ánh sáng (LDR), khoảng cách (Sharp IR)
> - Hiểu nguyên lý hoạt động của interrupt (ngắt)
> - Dùng `attachInterrupt()` để xử lý sự kiện tức thì
> - Áp dụng millis() + interrupt vào thiết kế firmware thực tế

---

## Motivation

Thế giới thực là analog — nhiệt độ, ánh sáng, tốc độ đều là tín hiệu liên tục. MCU số chỉ hiểu 0 và 1. **ADC (Analog-to-Digital Converter)** là cầu nối, chuyển điện áp analog thành số nguyên để MCU xử lý.

Đồng thời, nhiều sự kiện xảy ra bất ngờ — nút nhấn khẩn cấp, xung encoder motor, tín hiệu đến từ cảm biến. Dùng **interrupt (ngắt)** để MCU phản hồi tức thì thay vì phải liên tục kiểm tra (polling).

---

## ADC — Analog to Digital Converter

### Nguyên Lý Hoạt Động

> [!definition] Definition 17.1 — ADC 10-bit (ATmega328P)
> ADC so sánh điện áp đầu vào với điện áp tham chiếu $V_{ref}$, xuất kết quả số $N$:
>
> $$N = \frac{V_{in}}{V_{ref}} \times (2^{10} - 1) = \frac{V_{in}}{V_{ref}} \times 1023$$
>
> Ngược lại, để tính điện áp từ giá trị ADC:
>
> $$V_{in} = \frac{N}{1023} \times V_{ref}$$
>
> **Độ phân giải (resolution)**: với $V_{ref} = 5\,\text{V}$ và 10-bit:
>
> $$\frac{5\,\text{V}}{1024} \approx 4{,}88\,\text{mV/step}$$
>
> Điện áp nhỏ hơn 4,88 mV sẽ không phân biệt được.

**Sáu kênh analog** của Arduino Uno: A0–A5 (ATmega328P chia sẻ ADC dùng multiplexer).

**Điện áp tham chiếu** mặc định = VCC = 5 V. Có thể thay đổi:
- `analogReference(INTERNAL)` → 1,1 V nội (độ phân giải tốt hơn cho tín hiệu nhỏ)
- `analogReference(EXTERNAL)` → điện áp ngoài ở pin AREF

### analogRead() Trong Arduino

```cpp
int rawValue = analogRead(A0);         // 0–1023
float voltage = rawValue * (5.0 / 1023.0);
Serial.print("Voltage: ");
Serial.print(voltage, 2);
Serial.println(" V");
```

> [!warning] Thời Gian Lấy Mẫu ADC
> `analogRead()` mất ~100 μs (tại 16 MHz). Không dùng trong ISR (Interrupt Service Routine) — quá chậm.

---

## Đọc Cảm Biến Analog

### NTC Thermistor — Cảm Biến Nhiệt Độ

NTC (Negative Temperature Coefficient): điện trở **giảm** khi nhiệt độ tăng.

```
    5V ---[R_fixed=10kΩ]---+--- A0
                            |
                         [NTC]
                            |
                           GND
```

Đây là voltage divider: $V_{A0} = 5 \times \frac{R_{NTC}}{R_{fixed} + R_{NTC}}$

```cpp
const float NOMINAL_R = 10000.0;   // NTC 10kΩ tại 25°C
const float NOMINAL_T = 25.0;      // nhiệt độ danh nghĩa (°C)
const float B_COEFF = 3950.0;      // B constant (từ datasheet NTC)
const float SERIES_R = 10000.0;    // điện trở nối tiếp 10kΩ

float readNTCTemperature(int pin) {
    int raw = analogRead(pin);
    float voltage = raw * (5.0 / 1023.0);
    float resistance = SERIES_R * voltage / (5.0 - voltage);
    
    float steinhart = resistance / NOMINAL_R;
    steinhart = log(steinhart);
    steinhart /= B_COEFF;
    steinhart += 1.0 / (NOMINAL_T + 273.15);
    steinhart = 1.0 / steinhart;
    steinhart -= 273.15;
    return steinhart;
}
```

### LM35 — Cảm Biến Nhiệt Độ Tuyến Tính

LM35 xuất điện áp tỉ lệ tuyến tính với nhiệt độ: **10 mV/°C**.

```cpp
float readLM35(int pin) {
    int raw = analogRead(pin);
    float voltage = raw * (5.0 / 1023.0);
    float tempC = voltage / 0.01;  // 10 mV/°C = 0.01 V/°C
    return tempC;
}
```

### LDR — Cảm Biến Ánh Sáng

LDR (Light Dependent Resistor): điện trở giảm khi sáng hơn. Kết nối như voltage divider:

```cpp
int lightLevel = analogRead(A1);  // 0 (tối) đến 1023 (sáng)
int mappedLevel = map(lightLevel, 0, 1023, 0, 100);  // chuyển về %
```

---

## Interrupt — Ngắt

### Tại Sao Cần Interrupt?

```cpp
// Polling — MCU liên tục kiểm tra
while (true) {
    if (digitalRead(EMERGENCY_BTN) == LOW) {
        stopMotor();
    }
    doOtherStuff();  // nếu doOtherStuff() mất 100ms → chậm trễ 100ms!
}
```

Polling gây trễ phản hồi bằng thời gian thực hiện các tác vụ khác. Interrupt giải quyết ngay lập tức.

> [!definition] Definition 17.2 — Hardware Interrupt
> Khi sự kiện xảy ra trên pin ngắt → CPU **tạm dừng** `loop()`, nhảy vào **ISR (Interrupt Service Routine)**, sau đó **tiếp tục** loop() từ điểm bị ngắt.
>
> ATmega328P có **2 external interrupt pin**: INT0 (D2) và INT1 (D3).
>
> Trigger conditions:
> - `RISING`: cạnh lên (LOW → HIGH)
> - `FALLING`: cạnh xuống (HIGH → LOW)
> - `CHANGE`: bất kỳ thay đổi nào
> - `LOW`: level thấp (liên tục — dùng ít)

### Cú Pháp attachInterrupt()

```cpp
volatile bool emergencyFlag = false;  // volatile bắt buộc!

void IRAM_ATTR onEmergency() {        // ISR — nên rất ngắn gọn
    emergencyFlag = true;
}

void setup() {
    pinMode(2, INPUT_PULLUP);
    attachInterrupt(digitalPinToInterrupt(2), onEmergency, FALLING);
}

void loop() {
    if (emergencyFlag) {
        emergencyFlag = false;
        stopMotor();
        Serial.println("Emergency stop!");
    }
    // ... các tác vụ bình thường
}
```

> [!warning] Quy Tắc Vàng Khi Viết ISR
>
> 1. **ISR càng ngắn càng tốt** — chỉ set flag, ghi giá trị, không xử lý nặng
> 2. **Không dùng Serial, delay(), millis()** bên trong ISR
> 3. **Khai báo biến chia sẻ với ISR bằng `volatile`** — ngăn compiler tối ưu hóa sai
> 4. **Không gọi hàm Arduino mà không phải interrupt-safe** bên trong ISR

---

## Ứng Dụng — Đo Tốc Độ Encoder

Encoder quang tạo xung mỗi khi bánh xe quay. Dùng interrupt đếm xung:

```cpp
const int ENCODER_PIN = 2;
const int PULSES_PER_REV = 20;

volatile long pulseCount = 0;

void onPulse() {
    pulseCount++;
}

void setup() {
    pinMode(ENCODER_PIN, INPUT_PULLUP);
    attachInterrupt(digitalPinToInterrupt(ENCODER_PIN), onPulse, RISING);
    Serial.begin(9600);
}

unsigned long lastTime = 0;
long lastCount = 0;

void loop() {
    if (millis() - lastTime >= 1000) {
        long count;
        noInterrupts();          // tắt ngắt khi đọc biến volatile
        count = pulseCount;
        pulseCount = 0;
        interrupts();            // bật lại ngắt
        
        float rpm = (count / (float)PULSES_PER_REV) * 60.0;
        Serial.print("RPM: ");
        Serial.println(rpm);
        lastTime = millis();
    }
}
```

---

## Summary / Key Takeaways

- ADC 10-bit: đọc 0–5 V → số 0–1023; độ phân giải ≈ 4,88 mV/step
- `analogRead(pin)` → 0–1023; mất ~100 μs; chỉ dùng ngoài ISR
- NTC thermistor dùng voltage divider + Steinhart-Hart equation
- LM35: tuyến tính 10 mV/°C — dễ dùng nhất
- Interrupt: MCU phản hồi tức thì với sự kiện ngoài, không bị ảnh hưởng bởi độ trễ loop()
- `digitalPinToInterrupt()` để convert pin number sang interrupt number
- ISR phải ngắn, dùng `volatile` cho biến chia sẻ, không dùng Serial/delay

---

## References

- Arduino analogRead() Reference — https://www.arduino.cc/reference/en/language/functions/analog-io/analogread/
- Arduino attachInterrupt() — https://www.arduino.cc/reference/en/language/functions/external-interrupts/attachinterrupt/
- NTC Thermistor Calculator — https://www.thinksrs.com/downloads/programs/therm%20calc/ntccalibrator/ntccalculator.html
