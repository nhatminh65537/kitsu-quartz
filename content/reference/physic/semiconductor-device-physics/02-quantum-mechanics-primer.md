---
title: "02. Quantum Mechanics Primer"
tags: [physics, semiconductor, device-physics, lesson-02]
aliases: [Quantum Mechanics Primer]
created: 2026-03-27
---

> **Prerequisites**: [[01-classical-physics-review|01. Classical Physics Review]] — điện trường, thế năng, năng lượng
> **Objectives**:
> - Hiểu tại sao vật lý cổ điển không thể giải thích hành vi của electron trong nguyên tử
> - Nắm được ý tưởng cốt lõi: sóng-hạt (wave-particle duality) và lượng hóa năng lượng
> - Hiểu khái niệm hàm sóng (wave function) và ý nghĩa xác suất của nó
> - Hiểu tại sao electron trong tinh thể tạo thành các *dải năng lượng* thay vì các mức rời rạc — nền tảng cho Lesson 04

---

## Motivation

Cuối thế kỷ 19, vật lý cổ điển (Newton + Maxwell) được coi là hoàn chỉnh. Nhưng có một thứ nó không thể giải thích: **tại sao nguyên tử lại ổn định**.

Theo vật lý cổ điển, electron quay quanh hạt nhân sẽ **liên tục phát xạ năng lượng** (vì đây là điện tích đang gia tốc) và rơi vào hạt nhân trong vòng $10^{-11}$ giây. Nhưng nguyên tử tồn tại ổn định hàng tỉ năm. Có gì đó sai nghiêm trọng.

Câu trả lời đến từ **cơ học lượng tử** (quantum mechanics) — một framework hoàn toàn mới để mô tả thế giới ở thang nano. Và đây là lý do tại sao bạn cần học nó: **mọi linh kiện bán dẫn đều hoạt động dựa trên cơ học lượng tử**. Band gap, carrier statistics, tunneling trong MOSFET hiện đại — tất cả đều là hệ quả trực tiếp của QM.

---

## Physical Model — Ba Thí nghiệm Nền tảng

### 1. Lượng hóa năng lượng — Bức xạ vật đen (Blackbody Radiation)

Năm 1900, Max Planck phát hiện: để giải thích phổ bức xạ của vật đen, ông phải giả định rằng năng lượng ánh sáng **không liên tục** — nó phải đến theo từng **gói** (quantum):

> [!definition] Lượng tử năng lượng (Planck, 1900)
> Năng lượng của một photon ánh sáng có tần số $f$:
>
> $$E = hf = \hbar\omega$$
>
> với $h = 6.626 \times 10^{-34}$ J·s là hằng số Planck, $\hbar = h/2\pi$, và $\omega = 2\pi f$ là tần số góc.

Ý nghĩa: ánh sáng không thể mang năng lượng tùy ý — chỉ có thể mang $hf$, $2hf$, $3hf$,...

---

### 2. Ánh sáng vừa là sóng vừa là hạt — Hiệu ứng quang điện

Einstein (1905) giải thích hiệu ứng quang điện: ánh sáng chiếu vào kim loại làm bật electron ra ngoài. Vật lý cổ điển không thể giải thích tại sao ánh sáng đỏ (dù mạnh cỡ nào) không bật được electron, còn ánh sáng tím (dù yếu) thì bật được.

**Giải thích của Einstein**: ánh sáng là **photon** — mỗi photon mang năng lượng $E = hf$. Electron chỉ bị bật ra khi photon có đủ năng lượng, tức $f$ đủ lớn (tần số cao = ánh sáng xanh/tím).

> [!definition] Wave-Particle Duality (Lưỡng tính sóng-hạt) của ánh sáng
> Ánh sáng có **hai mặt**:
> - Như **sóng**: giao thoa, nhiễu xạ
> - Như **hạt (photon)**: truyền năng lượng theo gói rời rạc $E = hf$
>
> Không có mâu thuẫn — chúng là hai cách mô tả khác nhau của cùng một thực thể.

---

### 3. Electron cũng là sóng — De Broglie (1924)

Louis de Broglie đặt câu hỏi táo bạo: nếu ánh sáng (vốn là sóng) có thể hành xử như hạt, thì electron (vốn là hạt) có thể hành xử như **sóng** không?

> [!definition] Bước sóng de Broglie
> Một hạt có động lượng $p = mv$ mang theo bước sóng:
>
> $$\lambda = \frac{h}{p} = \frac{h}{mv}$$
>
> Electron trong nguyên tử hydro có $\lambda \approx 0.33$ nm — đúng cỡ kích thước nguyên tử!

**Hệ quả quan trọng**: nếu electron là sóng, thì quỹ đạo của nó phải "khớp" với bản thân — tức bước sóng phải **cộng hưởng** với chu vi quỹ đạo. Chỉ những quỹ đạo thỏa điều kiện này mới được phép tồn tại → giải thích tại sao năng lượng electron trong nguyên tử bị **lượng hóa** (quantized).

```
Chỉ quỹ đạo "khớp sóng" mới ổn định:

     Được phép (n=1):        Được phép (n=2):       Không được phép:
         ~~~                    ~~~~~~                  ~~~~~
        ~   ~                  ~      ~                ~     ~~
       ~     ~                ~        ~              ~       ~
        ~   ~                  ~      ~               ~~    ~
         ~~~                    ~~~~~~                  ~~~

   1 bước sóng vừa tròn     2 bước sóng vừa tròn    không vừa → hủy nhau
```

---

## Mathematical Formalism

### Hàm sóng (Wave Function)

Cơ học lượng tử mô tả trạng thái của một electron bằng **hàm sóng** $\psi(x, t)$ — một hàm số phức.

> [!definition] Hàm sóng và ý nghĩa xác suất (Born, 1926)
> Hàm sóng $\psi(x, t)$ chứa toàn bộ thông tin về trạng thái của hạt.
>
> Xác suất tìm thấy hạt trong khoảng $[x, x+dx]$ tại thời điểm $t$:
>
> $$P(x, t)\, dx = |\psi(x, t)|^2\, dx$$
>
> $|\psi|^2$ gọi là **mật độ xác suất** (probability density).

Đây là thứ kỳ lạ nhất của cơ học lượng tử: electron không ở một chỗ cố định — nó có **xác suất** ở nhiều nơi cùng lúc, cho đến khi bạn đo đạc.

---

### Phương trình Schrödinger (Schrödinger Equation)

Hàm sóng tuân theo **phương trình Schrödinger** — "định luật Newton" của cơ học lượng tử:

> [!definition] Phương trình Schrödinger phụ thuộc thời gian
>
> $$i\hbar \frac{\partial \psi}{\partial t} = \hat{H}\psi = \left[-\frac{\hbar^2}{2m}\frac{\partial^2}{\partial x^2} + V(x)\right]\psi$$
>
> với $V(x)$ là thế năng tác dụng lên hạt, $m$ là khối lượng hạt.

Bạn không cần giải phương trình này ngay bây giờ. Điều quan trọng cần biết là:

1. **Input**: thế năng $V(x)$ — tức là môi trường mà electron đang sống
2. **Output**: hàm sóng $\psi(x)$ và các **mức năng lượng cho phép** $E_n$

Chỉ những giá trị $E_n$ nhất định mới cho $\psi$ hợp lệ (không phát散 ra vô cực) → đây là nguồn gốc của **lượng hóa năng lượng**.

---

### Ví dụ quan trọng: Particle in a Box (Hạt trong hộp)

Đây là bài toán đơn giản nhất minh họa lượng hóa, và là nền tảng cho quantum well trong semiconductor hiện đại.

**Setup:** Electron bị nhốt trong hộp 1D có chiều rộng $L$ với tường vô hạn ($V = 0$ bên trong, $V = \infty$ bên ngoài).

**Điều kiện biên:** $\psi(0) = \psi(L) = 0$ (sóng phải bằng 0 ở tường).

**Kết quả:** Chỉ những sóng đứng phù hợp mới tồn tại:

$$
\psi_n(x) = \sqrt{\frac{2}{L}}\sin\left(\frac{n\pi x}{L}\right), \quad n = 1, 2, 3, \ldots
$$

Và mức năng lượng tương ứng:

$$
E_n = \frac{n^2 \pi^2 \hbar^2}{2mL^2} = \frac{n^2 h^2}{8mL^2}
$$

```
Các mức năng lượng lượng hóa (particle in a box):

  E │
    │                   ─────  E₃ = 9E₁
    │
    │         ─────  E₂ = 4E₁
    │
    │  ─────  E₁ (ground state)
    │
    └──────────────────────
```

> [!tip] Kết luận quan trọng
> Năng lượng nhỏ nhất của electron ($E_1 > 0$) **không bao giờ bằng 0** — electron không thể "đứng yên" trong hộp. Đây là nguyên lý bất định Heisenberg: electron bị nhốt trong không gian nhỏ thì phải có động lượng (và năng lượng) đáng kể.

---

## Từ Nguyên Tử Đơn lẻ đến Tinh Thể — Nền tảng cho Band Theory

Đây là bước kết nối then chốt giữa bài này và Lesson 04.

### Nguyên tử đơn lẻ: mức năng lượng rời rạc

Electron trong nguyên tử hydro chỉ có thể ở các mức năng lượng:

$$
E_n = -\frac{13.6 \text{ eV}}{n^2}, \quad n = 1, 2, 3, \ldots
$$

Đây là các **mức năng lượng rời rạc** (discrete levels) — như các bậc thang cố định.

---

### Hai nguyên tử gần nhau: mức tách đôi

Khi hai nguyên tử tiến lại gần nhau, hàm sóng của electron trên hai nguyên tử **tương tác** (chồng chéo — overlap). Một mức năng lượng đơn lẻ tách thành **hai mức**:

```
    Nguyên tử A       Nguyên tử A + B       Nguyên tử B
    (tách biệt)          (gần nhau)          (tách biệt)

        ──             ──          ──             ──
      (1 mức)       (mức trên)  (mức dưới)    (1 mức)
                    (bonding + antibonding)
```

---

### N nguyên tử trong tinh thể: mức tạo thành dải

Tinh thể silicon có khoảng $5 \times 10^{22}$ nguyên tử/cm³. Khi N nguyên tử kết hợp lại:

- 1 mức năng lượng → tách thành **N mức**
- N rất lớn → N mức xếp sát nhau → tạo thành **dải năng lượng liên tục** (energy band)

```
  1 nguyên tử    2 nguyên tử    4 nguyên tử    N nguyên tử (tinh thể)

      ──              ──              ──         ▓▓▓▓▓▓▓▓  ← Conduction Band
                      ──              ──
                                      ──         (khoảng trống = Band Gap)
                                      ──
      ──              ──              ──         ▓▓▓▓▓▓▓▓  ← Valence Band
                      ──
```

> [!definition] Kết luận — Nguồn gốc của Band Theory
> Các **dải năng lượng** (energy bands) trong tinh thể là hệ quả trực tiếp của cơ học lượng tử: khi hàm sóng của $N \sim 10^{22}$ electron tương tác với nhau, các mức năng lượng rời rạc **tụ lại thành dải**.
>
> Giữa các dải là **band gap** — vùng năng lượng mà electron không thể tồn tại.

Chi tiết về band theory, band gap, và ứng dụng vào bán dẫn sẽ được xây dựng đầy đủ trong [[04-energy-band-theory|04. Energy Band Theory]].

---

## Worked Problem

> [!example] Bài toán 2.1 — Bước sóng de Broglie của electron
>
> **Cho**: Electron được tăng tốc qua hiệu điện thế $V = 10$ V trong chân không.
>
> **Tìm**: Bước sóng de Broglie của electron.

**Lời giải:**

**Bước 1:** Tính năng lượng electron thu được:

$$
E = eV = 1.602 \times 10^{-19} \times 10 = 1.602 \times 10^{-18} \text{ J} = 10 \text{ eV}
$$

**Bước 2:** Từ $E = \frac{p^2}{2m}$, tính động lượng:

$$
p = \sqrt{2mE} = \sqrt{2 \times 9.11 \times 10^{-31} \times 1.602 \times 10^{-18}}
$$

$$
p = \sqrt{2.92 \times 10^{-48}} = 1.71 \times 10^{-24} \text{ kg·m/s}
$$

**Bước 3:** Bước sóng de Broglie:

$$
\lambda = \frac{h}{p} = \frac{6.626 \times 10^{-34}}{1.71 \times 10^{-24}} \approx 3.9 \times 10^{-10} \text{ m} \approx 0.39 \text{ nm}
$$

**Nhận xét:** Bước sóng này cỡ khoảng cách giữa các nguyên tử trong tinh thể silicon ($\approx 0.54$ nm). Đây là lý do electron *thực sự* "nhìn thấy" cấu trúc tinh thể như một cách tử nhiễu xạ — và từ đó hình thành nên band structure.

> [!example] Bài toán 2.2 — Lượng hóa năng lượng (Particle in a Box)
>
> **Cho**: Electron bị nhốt trong hộp 1D có chiều rộng $L = 1$ nm (cỡ quantum well trong LED).
>
> **Tìm**: Hai mức năng lượng thấp nhất $E_1$ và $E_2$.

**Lời giải:**

$$
E_n = \frac{n^2 h^2}{8 m_e L^2}
$$

$$
E_1 = \frac{1 \times (6.626 \times 10^{-34})^2}{8 \times 9.11 \times 10^{-31} \times (10^{-9})^2} = \frac{4.39 \times 10^{-67}}{7.29 \times 10^{-48}} = 6.02 \times 10^{-20} \text{ J} \approx 0.38 \text{ eV}
$$

$$
E_2 = 4 E_1 \approx 1.51 \text{ eV}
$$

**Nhận xét:** Mức $E_1 = 0.38$ eV là năng lượng tối thiểu của electron trong quantum well 1 nm — không thể bằng 0. Khoảng cách $E_2 - E_1 \approx 1.13$ eV nằm trong vùng ánh sáng nhìn thấy → đây là cơ sở vật lý của LED và laser bán dẫn.

---

## Summary / Key Takeaways

- Vật lý cổ điển thất bại ở thang nguyên tử → cần **cơ học lượng tử**.
- Ánh sáng và electron đều có **lưỡng tính sóng-hạt**: photon mang năng lượng $E = hf$; electron có bước sóng $\lambda = h/p$.
- **Hàm sóng** $\psi(x)$ mô tả trạng thái electron; $|\psi|^2$ cho mật độ xác suất.
- **Phương trình Schrödinger** quyết định hàm sóng và các mức năng lượng hợp lệ — nguồn gốc của lượng hóa.
- Năng lượng electron bị **lượng hóa** trong nguyên tử đơn lẻ (mức rời rạc).
- Trong tinh thể với $N \sim 10^{22}$ nguyên tử, các mức rời rạc **tụ thành dải** (energy bands) với band gap ở giữa.
- Band gap và band structure là **cơ sở vật lý** của mọi linh kiện bán dẫn.

---

## References

- Feynman Lectures on Physics, Vol. 3 — Quantum Mechanics (feynmanlectures.caltech.edu)
- MIT 6.012 — Lecture notes on semiconductor fundamentals (ocw.mit.edu)
- Pierret, R. F. — *Semiconductor Device Fundamentals*, Ch. 2 (Prentice Hall, 1995)
- Streetman & Banerjee — *Solid State Electronic Devices*, Ch. 2 (Pearson, 2015)
