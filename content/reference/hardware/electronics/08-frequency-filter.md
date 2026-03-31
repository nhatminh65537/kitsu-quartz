---
title: "08. Frequency Filters"
tags: [electronics, analog, lesson-08]
aliases: [Bộ Lọc Tần Số Filter]
created: 2026-03-30
---

> **Prerequisites**: [[03-capacitor-inductor-rc-rl|03. RC/RL Circuits]], [[07-opamp-amplifier-applications|07. Op-Amp]]
> **Objectives**:
> - Hiểu khái niệm đáp ứng tần số và tần số cắt $f_c$
> - Phân tích và thiết kế bộ lọc RC thụ động bậc một
> - Vẽ Bode plot (biên độ và pha)
> - Thiết kế bộ lọc tích cực Sallen-Key bậc hai với op-amp
> - Nhận diện ứng dụng trong audio, điện tử công suất và MCU

---

## Motivation

Tín hiệu thực tế luôn bị nhiễm **nhiễu (noise)** — rung cơ học, sóng điện từ, nhiễu nguồn... Bộ lọc tần số (filter) chọn lọc tần số muốn giữ và loại bỏ tần số không muốn.

Ví dụ thực tế:
- Micro ghi cả tiếng nói và tiếng ồn nền → **low-pass filter** giữ giọng nói, cắt tiếng hiss tần số cao
- Cảm biến gia tốc trả về tín hiệu dao động cao → **moving average (≈ LPF)** lấy giá trị ổn định
- Nguồn switching tạo ripple 50 kHz → **LC filter** chặn ripple, giữ DC sạch

---

## Đáp Ứng Tần Số & Tần Số Cắt

> [!definition] Definition 8.1 — Hàm Truyền & Tần Số Cắt
> **Hàm truyền (transfer function)** $H(f)$ mô tả tỉ lệ đầu ra/đầu vào theo tần số:
>
> $$H(f) = \frac{V_{out}(f)}{V_{in}(f)}$$
>
> **Tần số cắt (cutoff frequency)** $f_c$ là tần số tại đó biên độ giảm còn $\frac{1}{\sqrt{2}} \approx 0{,}707$ lần so với dải thông (tương đương $-3\,\text{dB}$):
>
> $$f_c = \frac{1}{2\pi RC} \quad \text{(mạch RC bậc 1)}$$

**Decibel (dB)**: đơn vị logarithm của hệ số khuếch đại biên độ:

$$A_{dB} = 20 \log_{10}|H(f)|$$

---

## Low-Pass Filter (LPF) — Bộ Lọc Thông Thấp

Cho tín hiệu tần số **thấp** qua, chặn tín hiệu tần số **cao**.

```
    Vin ---[R]---+--- Vout
                 |
                [C]
                 |
                GND
```

> [!definition] Definition 8.2 — RC Low-Pass Filter (Bậc 1)
>
> $$H(f) = \frac{1}{1 + j(f/f_c)} \qquad f_c = \frac{1}{2\pi RC}$$
>
> - $f \ll f_c$: $|H| \approx 1$ (0 dB) — tín hiệu qua không suy hao
> - $f = f_c$: $|H| = 0{,}707$ (−3 dB)
> - $f \gg f_c$: $|H|$ giảm theo −20 dB/decade (bậc 1)

> [!example] Example 8.3 — Tính f_c
> $R = 10\,\text{k}\Omega$, $C = 10\,\text{nF}$:
>
> $$f_c = \frac{1}{2\pi \times 10{,}000 \times 10 \times 10^{-9}} = \frac{1}{2\pi \times 10^{-4}} \approx 1{,}59\,\text{kHz}$$

---

## High-Pass Filter (HPF) — Bộ Lọc Thông Cao

Đổi vị trí R và C:

```
    Vin ---[C]---+--- Vout
                 |
                [R]
                 |
                GND
```

> [!definition] Definition 8.4 — RC High-Pass Filter (Bậc 1)
>
> $$H(f) = \frac{j(f/f_c)}{1 + j(f/f_c)} \qquad f_c = \frac{1}{2\pi RC}$$
>
> - $f \ll f_c$: $|H| \approx 0$ (chặn DC và tần số thấp)
> - $f = f_c$: $|H| = 0{,}707$ (−3 dB)
> - $f \gg f_c$: $|H| \approx 1$ (0 dB)

---

## Band-Pass & Band-Stop Filter

| Loại | Mô tả | Ứng dụng |
|------|-------|---------|
| **Low-Pass (LPF)** | Qua thấp, chặn cao | Anti-aliasing trước ADC |
| **High-Pass (HPF)** | Qua cao, chặn thấp | Loại DC offset, AC coupling |
| **Band-Pass (BPF)** | Qua dải băng hẹp | Radio tuner, lọc tín hiệu cụ thể |
| **Band-Stop / Notch** | Chặn tần số cụ thể | Loại nhiễu 50/60 Hz lưới điện |

Band-pass = LPF + HPF nối tiếp (dải thông = giao nhau của hai bộ lọc).

---

## Bode Plot

**Bode plot** là đồ thị biên độ (dB) và pha (°) theo tần số (thang log).

Mẫu Bode plot LPF bậc 1:

```
    |H| (dB)
      0 ──────────────┐
                      │  −3 dB tại f_c
    −20               │\
                      │ \  −20 dB/decade
    −40               │  \
                      └───────────────→ f (log)
                     f_c
```

Pha:
- $f \ll f_c$: $\angle H = 0°$
- $f = f_c$: $\angle H = -45°$
- $f \gg f_c$: $\angle H = -90°$

---

## Bộ Lọc Tích Cực Bậc 2 — Sallen-Key

Bộ lọc RC thụ động bậc 1 có độ dốc −20 dB/decade. Để có −40 dB/decade (chọn lọc tốt hơn), dùng bộ lọc bậc 2 với op-amp:

```
    Vin ---[R1]---[R2]---+--- (+) op-amp --- Vout
                         |                      |
                        [C2]          [Rf]      |
                         |              |       |
                        GND    (−)-----+-------+
                                |
                               [Rg]
                                |
                               GND
```

> [!definition] Definition 8.5 — Sallen-Key LPF Bậc 2
> Với $R_1 = R_2 = R$, $C_1 = C_2 = C$:
>
> $$f_c = \frac{1}{2\pi RC}$$
>
> **Hệ số phẩm chất (Q-factor)** kiểm soát hình dạng đáp ứng gần $f_c$:
> - $Q = 0{,}707$ (Butterworth): đáp ứng phẳng nhất trong dải thông
> - $Q > 0{,}707$ (Chebyshev): có peak trước $f_c$, độ dốc cao hơn
> - $Q < 0{,}707$ (Bessel): pha tuyến tính, bảo toàn hình dạng xung tốt nhất

---

## Ứng Dụng Thực Tế

**1. Anti-aliasing filter**: LPF bậc 2 đặt trước ADC của MCU, cắt tần số > $f_s/2$ (Nyquist). Ví dụ: MCU lấy mẫu 10 kHz → LPF với $f_c = 4\,\text{kHz}$.

**2. Audio crossover**: Loa treble (HF) + loa bass (LF) cần HPF và LPF chia dải tần số.

**3. Lọc nguồn DC-DC**: LC filter sau bộ Buck converter để chặn ripple tần số cao.

**4. RC debounce thụ động**: LPF đơn giản trước chân GPIO để lọc nhiễu nút nhấn.

---

## Summary / Key Takeaways

- $f_c = \frac{1}{2\pi RC}$ — tần số tại đó biên độ giảm −3 dB
- LPF: C song song với đầu ra; HPF: C nối tiếp với đầu vào
- Bộ lọc bậc 1: −20 dB/decade; bậc 2: −40 dB/decade
- Bode plot: biểu diễn biên độ (dB) và pha theo log tần số
- Sallen-Key: cấu hình op-amp phổ biến cho bộ lọc tích cực bậc 2
- Butterworth ($Q = 0{,}707$): đáp ứng phẳng nhất — lựa chọn mặc định

---

## References

- Sedra & Smith — *Microelectronic Circuits*, 7th ed., Ch. 17
- TI Filter Design Guide — https://www.ti.com/lit/an/sloa049d/sloa049d.pdf
- Analog Devices Filter Guide — https://www.analog.com/en/design-center/interactive-design-tools/filter-wizard.html
- Falstad — chọn "Filter" trong menu để thử LPF/HPF tương tác
