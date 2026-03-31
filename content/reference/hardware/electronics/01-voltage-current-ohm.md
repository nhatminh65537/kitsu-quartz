---
title: "01. Voltage, Current & Ohm's Law"
tags: [electronics, circuit-fundamentals, lesson-01]
aliases: [Điện Áp Dòng Điện Định Luật Ohm]
created: 2026-03-30
---

> **Prerequisites**: Vật lý phổ thông — khái niệm điện tích, trường điện
> **Objectives**:
> - Hiểu điện áp, dòng điện, điện trở là gì và đơn vị đo
> - Áp dụng định luật Ohm để tính toán mạch đơn giản
> - Phân biệt mạch nối tiếp và song song
> - Tính công suất tiêu thụ của điện trở
> - Biết cách dùng Falstad để mô phỏng mạch đơn giản

---

## Motivation

Khi bạn cắm điện một bóng đèn, cắm sạc điện thoại hay bật công tắc đèn — tất cả đều vận hành dựa trên ba đại lượng cơ bản: **điện áp (voltage)**, **dòng điện (current)** và **điện trở (resistance)**. Đây là ngôn ngữ nền tảng của toàn bộ kỹ thuật điện tử.

Trước khi hiểu được op-amp, transistor hay microcontroller, bạn cần nắm vững ba đại lượng này và mối quan hệ giữa chúng — được thể hiện qua **định luật Ohm (Ohm's Law)**: một trong những định luật quan trọng nhất trong điện học.

---

## Mô Hình Vật Lý

### Điện Tích & Dòng Điện

Vật chất được cấu tạo từ nguyên tử, trong đó có **electron** mang điện tích âm. Trong dây dẫn kim loại (ví dụ: dây đồng), các electron tự do có thể di chuyển tự do giữa các nguyên tử.

> [!definition] Definition 1.1 — Dòng Điện (Electric Current)
> **Dòng điện (current)** $I$ là lượng điện tích $Q$ đi qua một tiết diện của dây dẫn trong một đơn vị thời gian:
>
> $$I = \frac{dQ}{dt}$$
>
> **Đơn vị**: Ampere [A] = Coulomb/giây [C/s]
>
> **Chiều quy ước**: Chiều dòng điện quy ước là chiều **ngược** với chiều di chuyển electron (vì lý do lịch sử). Electron âm di chuyển từ cực âm → cực dương, nhưng dòng điện quy ước chạy từ cực dương → cực âm.

```
Chiều electron:  (–) ←←←←←←←←←←←←←←← (+)
Chiều dòng điện: (–) →→→→→→→→→→→→→→→ (+)
```

### Điện Áp

> [!definition] Definition 1.2 — Điện Áp (Voltage)
> **Điện áp (voltage)** $V$ giữa hai điểm A và B là năng lượng cần thiết để di chuyển một đơn vị điện tích từ B đến A:
>
> $$V_{AB} = \frac{W}{Q}$$
>
> **Đơn vị**: Volt [V] = Joule/Coulomb [J/C]
>
> **Trực giác**: Điện áp giống như "áp lực nước" trong ống nước. Dòng điện giống như lưu lượng nước. Điện áp cao → lực đẩy electron mạnh hơn.

Điện áp luôn đo **giữa hai điểm** (điện áp tương đối). Trong mạch điện, ta thường chọn một điểm làm **ground (GND)** = 0V làm tham chiếu.

### Điện Trở

> [!definition] Definition 1.3 — Điện Trở (Resistance)
> **Điện trở (resistance)** $R$ đặc trưng cho khả năng cản trở dòng điện của một vật liệu:
>
> **Đơn vị**: Ohm [Ω]
>
> Với dây dẫn hình trụ đồng chất, dài $\ell$, tiết diện $A$, điện trở suất $\rho$:
>
> $$R = \rho \cdot \frac{\ell}{A}$$
>
> **Trực giác**: Điện trở giống như "độ nhỏ của ống nước". Ống nhỏ → điện trở lớn → dòng chảy ít hơn.

---

## Định Luật Ohm & Công Thức Cơ Bản

> [!definition] Definition 1.4 — Định Luật Ohm (Ohm's Law)
> Với một điện trở thuần (resistor) ở nhiệt độ không đổi, điện áp hai đầu tỉ lệ thuận với dòng điện qua nó:
>
> $$V = I \cdot R$$
>
> Hay các dạng tương đương:
>
> $$I = \frac{V}{R} \qquad R = \frac{V}{I}$$

**Tam giác Ohm** — mẹo nhớ nhanh:

```
      [ V ]
     /     \
   [I]  x  [R]
```

Che đại lượng cần tìm → công thức còn lại.

> [!example] Example 1.5 — Áp dụng Định Luật Ohm
> **Bài toán**: Một điện trở $R = 470\,\Omega$ được nối với nguồn $V = 5\,\text{V}$.
> Tính dòng điện qua điện trở.
>
> **Giải**:
>
> $$I = \frac{V}{R} = \frac{5}{470} \approx 10{,}6\,\text{mA}$$

---

## Mạch Nối Tiếp & Song Song

### Mạch Nối Tiếp (Series Circuit)

Các điện trở mắc **nối tiếp** khi nối đuôi nhau — cùng một dòng điện chạy qua tất cả.

```
    +---[R1]---[R2]---[R3]---+
    |                        |
   [V]                      GND
    |                        |
    +------------------------+
```

> [!definition] Definition 1.6 — Điện Trở Tương Đương Nối Tiếp
> $$R_{series} = R_1 + R_2 + R_3 + \cdots + R_n$$
>
> - Dòng điện: $I$ bằng nhau qua tất cả các điện trở
> - Điện áp: $V = V_1 + V_2 + V_3$ (phân chia theo tỉ lệ điện trở)

**Mạch phân áp (Voltage Divider)** — ứng dụng quan trọng của mạch nối tiếp:

```
    V_in ---[R1]---+--- V_out
                   |
                  [R2]
                   |
                  GND
```

$$V_{out} = V_{in} \cdot \frac{R_2}{R_1 + R_2}$$

> [!example] Example 1.7 — Voltage Divider
> $V_{in} = 12\,\text{V}$, $R_1 = 10\,\text{k}\Omega$, $R_2 = 5\,\text{k}\Omega$.
>
> $$V_{out} = 12 \cdot \frac{5000}{10000 + 5000} = 12 \cdot \frac{1}{3} = 4\,\text{V}$$

### Mạch Song Song (Parallel Circuit)

Các điện trở mắc **song song** khi có chung hai đầu — cùng điện áp đặt lên tất cả.

```
    +---[R1]---+
    |          |
   [V]--[R2]--|
    |          |
    +---[R3]---+
    |          |
   GND        GND
```

> [!definition] Definition 1.8 — Điện Trở Tương Đương Song Song
> $$\frac{1}{R_{parallel}} = \frac{1}{R_1} + \frac{1}{R_2} + \cdots + \frac{1}{R_n}$$
>
> Với **hai** điện trở song song:
>
> $$R_{parallel} = \frac{R_1 \cdot R_2}{R_1 + R_2}$$
>
> - Điện áp: $V$ bằng nhau trên tất cả các điện trở
> - Dòng điện: $I = I_1 + I_2 + I_3$ (phân chia theo tỉ lệ nghịch đảo điện trở)

---

## Công Suất (Power)

> [!definition] Definition 1.9 — Công Suất Điện (Electric Power)
> Công suất $P$ là năng lượng tiêu thụ (hoặc cung cấp) trong một đơn vị thời gian:
>
> $$P = V \cdot I$$
>
> **Đơn vị**: Watt [W] = Volt × Ampere [V·A]
>
> Kết hợp với định luật Ohm, ta có thêm:
>
> $$P = I^2 \cdot R = \frac{V^2}{R}$$

> [!warning] Chú Ý — Chọn Điện Trở Đúng Công Suất
> Mỗi điện trở có **công suất định mức (power rating)** tối đa (thường 1/4W, 1/2W, 1W...).
> Nếu vượt quá, điện trở sẽ nóng chảy hoặc cháy.
>
> **Quy tắc thực tế**: chọn điện trở có công suất ít nhất **gấp đôi** công suất tính toán.

> [!example] Example 1.10 — Kiểm Tra Công Suất LED
> Muốn nối LED (giả sử $V_{LED} = 2\,\text{V}$, $I_{LED} = 20\,\text{mA}$) vào nguồn $V_{CC} = 5\,\text{V}$ qua điện trở hạn dòng $R$.
>
> **Tính R**:
>
> $$V_R = V_{CC} - V_{LED} = 5 - 2 = 3\,\text{V}$$
>
> $$R = \frac{V_R}{I} = \frac{3}{0{,}02} = 150\,\Omega$$
>
> **Tính công suất điện trở**:
>
> $$P_R = V_R \cdot I = 3 \times 0{,}02 = 60\,\text{mW}$$
>
> → Chọn điện trở $150\,\Omega$ loại $\frac{1}{4}\text{W}$ (250 mW) là đủ.

---

## Mô Phỏng Với Falstad

Falstad Circuit Simulator (https://falstad.com/circuit) là công cụ mô phỏng mạch điện miễn phí chạy trực tiếp trên trình duyệt — không cần cài đặt.

**Thực hành 1**: Tạo mạch điện trở đơn giản
1. Truy cập https://falstad.com/circuit
2. Click **Draw → Add Resistor** → vẽ điện trở
3. Click **Draw → Add Voltage Source** → vẽ nguồn 5V
4. Nối dây → bấm **Run**
5. Hover chuột vào điện trở → xem dòng điện và điện áp

**Thực hành 2**: Mạch phân áp
1. Tạo mạch $R_1 = 10\,\text{k}\Omega$, $R_2 = 5\,\text{k}\Omega$, $V = 12\,\text{V}$
2. Thêm **Voltmeter** vào đầu ra
3. Kiểm tra $V_{out} \approx 4\,\text{V}$ (xem Example 1.7)

---

## Summary / Key Takeaways

- **Điện áp (voltage)** $V$ [V] — "áp suất" đẩy electron, đo giữa hai điểm
- **Dòng điện (current)** $I$ [A] — lưu lượng điện tích qua dây dẫn
- **Điện trở (resistance)** $R$ [Ω] — khả năng cản trở dòng điện
- **Định luật Ohm**: $V = IR$ — mối quan hệ nền tảng của ba đại lượng
- **Mạch nối tiếp**: $R_{eq} = R_1 + R_2 + \ldots$ — dòng bằng nhau, áp cộng lại
- **Mạch song song**: $\frac{1}{R_{eq}} = \frac{1}{R_1} + \frac{1}{R_2} + \ldots$ — áp bằng nhau, dòng cộng lại
- **Voltage divider**: $V_{out} = V_{in} \cdot \frac{R_2}{R_1+R_2}$ — dùng rất nhiều trong thực tế
- **Công suất**: $P = VI = I^2R = V^2/R$ — luôn kiểm tra trước khi chọn linh kiện

---

## References

- MIT OCW 6.002 — Circuits and Electronics, Lecture 1–3 (ocw.mit.edu)
- Falstad Circuit Simulator — https://falstad.com/circuit
- All About Circuits — https://www.allaboutcircuits.com/textbook/direct-current/
- Horowitz & Hill — *The Art of Electronics*, 3rd ed., Ch. 1
