---
title: "03. Crystal Structure"
tags: [physics, semiconductor, device-physics, lesson-03]
aliases: [Crystal Structure]
created: 2026-03-27
---

> **Prerequisites**: [[01-classical-physics-review|01. Classical Physics Review]] — liên kết hóa học cơ bản (cộng hóa trị); [[02-quantum-mechanics-primer|02. Quantum Mechanics Primer]] — electron và orbital nguyên tử
> **Objectives**:
> - Hiểu tại sao vật liệu rắn có cấu trúc tinh thể tuần hoàn
> - Nắm được khái niệm mạng Bravais, unit cell, và lattice constant
> - Mô tả cấu trúc diamond cubic của silicon và ý nghĩa vật lý của nó
> - Giải thích liên kết cộng hóa trị trong tinh thể Si và kết nối với khái niệm electron tự do / hole

---

## Motivation

Bạn đã biết rằng electron trong tinh thể tạo thành các dải năng lượng (từ Lesson 02). Nhưng câu hỏi là: *tại sao tinh thể lại có cấu trúc tuần hoàn ngay từ đầu?*

Câu trả lời đơn giản: **các nguyên tử sắp xếp sao cho năng lượng tổng của hệ là nhỏ nhất**. Cấu trúc tuần hoàn chính là trạng thái cân bằng năng lượng tối ưu. Và cấu trúc tuần hoàn này có hệ quả sâu sắc: toàn bộ band theory và behavior của electron trong semiconductor đều phụ thuộc vào nó.

Silicon — vật liệu nền tảng của mọi chip điện tử hiện đại — có một cấu trúc tinh thể đặc biệt gọi là **diamond cubic**. Hiểu cấu trúc này là bước đệm trực tiếp để hiểu tại sao silicon là bán dẫn, không phải kim loại hay điện môi.

---

## Physical Model

### Tinh thể và mạng tuần hoàn

Vật liệu rắn chia làm hai loại lớn:

- **Tinh thể** (crystalline): nguyên tử sắp xếp theo **trật tự tuần hoàn** dài hạn. Ví dụ: silicon, germanium, NaCl, kim cương.
- **Vô định hình** (amorphous): không có trật tự tuần hoàn dài hạn. Ví dụ: thủy tinh, silicon vô định hình (dùng trong pin mặt trời màng mỏng).

Semiconductor đơn tinh thể (single-crystal) như silicon wafer dùng trong chip là **tinh thể hoàn hảo** — mỗi nguyên tử đúng vị trí của nó trong mạng tuần hoàn.

---

### Mạng Bravais và Unit Cell

> [!definition] Mạng Bravais (Bravais Lattice)
> Mạng Bravais là tập hợp tất cả các điểm trong không gian có thể được tạo ra bởi tổ hợp tuyến tính nguyên của các vectơ cơ sở $\mathbf{a}_1, \mathbf{a}_2, \mathbf{a}_3$:
>
> $$\mathbf{R} = n_1\mathbf{a}_1 + n_2\mathbf{a}_2 + n_3\mathbf{a}_3, \quad n_1, n_2, n_3 \in \mathbb{Z}$$
>
> Trong 3D có 14 loại mạng Bravais khác nhau.

> [!definition] Unit Cell (Ô mạng cơ sở)
> Unit cell là **đơn vị nhỏ nhất** có thể lặp lại theo tịnh tiến để tạo ra toàn bộ tinh thể. Mọi tính chất của tinh thể đều có thể suy ra từ unit cell.

Ba loại mạng cubic quan trọng nhất:

```
Simple Cubic (SC)      Body-Centered Cubic (BCC)    Face-Centered Cubic (FCC)

    o───o                     o───o                       o─┬─o
    │   │                     │╲ ╱│                      ╱│ │ │╲
    │   │                     │ o │   ← tâm              o─┼─o─┼─o
    o───o                     │╱ ╲│                      ╲│ │ │╱
                              o───o                       o─┴─o

  1 atom/cell            2 atoms/cell                 4 atoms/cell
```

Silicon không dùng đúng một trong ba loại trên mà dùng biến thể của FCC gọi là **diamond cubic**.

---

### Cấu trúc Diamond Cubic của Silicon

> [!definition] Diamond Cubic Structure
> Cấu trúc diamond cubic có thể hiểu là **hai mạng FCC xen nhau**, trong đó mạng thứ hai dịch chuyển đi $(\frac{1}{4}, \frac{1}{4}, \frac{1}{4})$ so với mạng thứ nhất (tính theo đơn vị lattice constant $a$).
>
> Mỗi nguyên tử liên kết với **4 nguyên tử lân cận** theo hình tứ diện (tetrahedral). Góc liên kết: 109.5°.

Các thông số quan trọng của silicon:

| Thông số | Giá trị |
|---------|---------|
| Lattice constant $a$ | 0.543 nm |
| Khoảng cách Si-Si | 0.235 nm |
| Số nguyên tử/unit cell | 8 |
| Mật độ nguyên tử | $5 \times 10^{22}$ atoms/cm³ |

```
Hình ảnh schematic unit cell diamond cubic của Si:

        o───────o
       ╱│      ╱│
      o─┼──── o │     ← 8 nguyên tử ở góc (mỗi cái góp 1/8)
      │ o─────┼─o     ← 6 nguyên tử ở mặt (mỗi cái góp 1/2)
      │╱      │╱      ← 4 nguyên tử bên trong (đầy đủ)
      o───────o
                           Tổng: 8×(1/8) + 6×(1/2) + 4×1 = 8 atoms/cell
```

> [!tip] Vì sao cấu trúc tetrahedral?
> Silicon có 4 electron hóa trị (lớp ngoài cùng: $3s^2 3p^2$). Để đạt trạng thái năng lượng thấp nhất, mỗi Si chia sẻ 1 electron với 4 nguyên tử Si láng giềng → **4 liên kết cộng hóa trị** (covalent bond). Hình dạng tối ưu của 4 liên kết là tứ diện — tương tự như liên kết C trong kim cương.

---

### Liên kết Cộng hóa trị trong Silicon

Trong tinh thể silicon, mỗi nguyên tử Si có **8 electron xung quanh nó** (4 của chính nó + 4 góp từ 4 láng giềng) — lấp đầy lớp vỏ ngoài cùng theo quy tắc octet.

```
Mô hình 2D (hình chiếu) liên kết covalent trong Si:

   Si ─── Si ─── Si
   │       │       │
  (đôi)  (đôi)  (đôi)    ← mỗi gạch = 1 cặp electron chia sẻ
   │       │       │
   Si ─── Si ─── Si
   │       │       │
   Si ─── Si ─── Si
```

**Ở nhiệt độ 0 K**: Tất cả electron đều tham gia liên kết — không có electron tự do → silicon là **chất cách điện hoàn hảo** ở 0 K.

**Ở nhiệt độ phòng (~300 K)**: Một số electron nhận đủ năng lượng nhiệt ($k_BT \approx 0.026$ eV) để **phá vỡ liên kết** và trở thành electron tự do. Chỗ trống để lại trong liên kết gọi là **hole** (lỗ trống).

---

### Khái niệm Hole

> [!definition] Hole (Lỗ trống)
> Khi một electron thoát khỏi liên kết cộng hóa trị, nó để lại một **chỗ trống** trong liên kết. Chỗ trống này hành xử như một **hạt mang điện dương** — có thể di chuyển khi electron từ liên kết kế tiếp nhảy vào lấp chỗ trống đó.
>
> Hole không phải là hạt vật lý thật — nó là mô hình mô tả **sự vắng mặt tập thể** của một electron trong biển electron liên kết.

```
Hole di chuyển sang trái khi electron điền vào từ phải:

  Before:     Si ─── [  ] ─── Si ─── Si     ← hole ở giữa
                        ↑
              electron điền vào
  After:      Si ─── Si ─── [  ] ─── Si     ← hole dịch sang phải
```

---

### Các vật liệu bán dẫn khác

Cấu trúc diamond cubic không chỉ có ở Si:

| Vật liệu | Cấu trúc | Band gap | Ứng dụng |
|----------|---------|---------|---------|
| Silicon (Si) | Diamond cubic | 1.12 eV (indirect) | MOSFET, IC, CPU |
| Germanium (Ge) | Diamond cubic | 0.66 eV (indirect) | Transistor đầu tiên, SiGe HBT |
| Gallium Arsenide (GaAs) | Zinc-blende | 1.42 eV (direct) | LED, laser, RF |
| Gallium Nitride (GaN) | Wurtzite | 3.4 eV (direct) | LED xanh/trắng, power electronics |

**Zinc-blende** (như GaAs) là biến thể của diamond cubic trong đó hai loại nguyên tử (Ga và As) thay phiên nhau — thay vì cùng một loại. **Wurtzite** (như GaN) có cấu trúc hexagonal.

---

## Mathematical Formalism

### Tính mật độ nguyên tử

Từ cấu trúc diamond cubic với 8 nguyên tử/unit cell và lattice constant $a$:

$$
n_{Si} = \frac{8 \text{ atoms}}{a^3} = \frac{8}{(0.543 \times 10^{-7} \text{ cm})^3} \approx 5 \times 10^{22} \text{ atoms/cm}^3
$$

### Tính mật độ silicon

$$
\rho = \frac{n_{Si} \times M_{Si}}{N_A} = \frac{5 \times 10^{22} \times 28.09 \text{ g/mol}}{6.022 \times 10^{23} \text{ mol}^{-1}} \approx 2.33 \text{ g/cm}^3
$$

Kết quả khớp với giá trị thực nghiệm — đây là phép kiểm tra tốt tính nhất quán.

---

## Derivation — Số nguyên tử trong unit cell diamond cubic

Đây là bài toán đếm nguyên tử điển hình trong crystallography.

**Unit cell diamond cubic gồm:**

**Nguyên tử ở góc (corner atoms):** mỗi nguyên tử góc được chia sẻ bởi 8 unit cell tiếp giáp nhau → mỗi cái đóng góp $\frac{1}{8}$

$$8 \text{ góc} \times \frac{1}{8} = 1 \text{ atom}$$

**Nguyên tử ở mặt (face atoms):** mỗi nguyên tử mặt được chia sẻ bởi 2 unit cell → mỗi cái đóng góp $\frac{1}{2}$

$$6 \text{ mặt} \times \frac{1}{2} = 3 \text{ atoms}$$

**Nguyên tử bên trong (interior atoms):** hoàn toàn thuộc unit cell này → đóng góp 1

$$4 \text{ interior} \times 1 = 4 \text{ atoms}$$

**Tổng:**

$$N_{total} = 1 + 3 + 4 = 8 \text{ atoms/unit cell}$$

---

## Worked Problem

> [!example] Bài toán 3.1 — Mật độ nguyên tử và khoảng cách liên kết
>
> **Cho**: Silicon có lattice constant $a = 0.543$ nm và 8 nguyên tử/unit cell.
>
> **Tìm**:
> a) Mật độ nguyên tử (atoms/cm³)
> b) Khoảng cách giữa hai nguyên tử Si lân cận nhất trong cấu trúc diamond cubic

**Lời giải:**

**a)** Thể tích unit cell:

$$V_{cell} = a^3 = (0.543 \times 10^{-7} \text{ cm})^3 = 1.60 \times 10^{-22} \text{ cm}^3$$

Mật độ nguyên tử:

$$n = \frac{8}{1.60 \times 10^{-22}} = 5.00 \times 10^{22} \text{ atoms/cm}^3$$

**b)** Trong cấu trúc diamond cubic, nguyên tử bên trong nằm ở vị trí $(\frac{1}{4}, \frac{1}{4}, \frac{1}{4})a$ so với góc. Khoảng cách từ góc đến nguyên tử bên trong:

$$d = \sqrt{\left(\frac{a}{4}\right)^2 + \left(\frac{a}{4}\right)^2 + \left(\frac{a}{4}\right)^2} = \frac{a\sqrt{3}}{4}$$

$$d = \frac{0.543 \times \sqrt{3}}{4} = \frac{0.543 \times 1.732}{4} \approx 0.235 \text{ nm}$$

Đây chính xác là khoảng cách liên kết Si-Si đo được bằng thực nghiệm.

> [!example] Bài toán 3.2 — Mật độ liên kết bị phá vỡ ở room temperature
>
> **Cho**: Ở 300 K, nồng độ electron tự do trong Si là $n_i = 1.5 \times 10^{10}$ cm$^{-3}$.
>
> **Tìm**: Tỉ lệ liên kết bị phá vỡ so với tổng số liên kết.

**Lời giải:**

Mỗi unit cell có 8 nguyên tử và mỗi nguyên tử có 4 liên kết, nhưng mỗi liên kết chia sẻ giữa 2 nguyên tử, nên:

$$n_{bonds} = \frac{8 \times 4}{2 \times V_{cell}} = \frac{8 \times 4}{2 \times 1.60 \times 10^{-22}} \approx 10^{23} \text{ bonds/cm}^3$$

Tỉ lệ liên kết bị phá vỡ:

$$\frac{n_i}{n_{bonds}} = \frac{1.5 \times 10^{10}}{10^{23}} = 1.5 \times 10^{-13}$$

**Nhận xét:** Chỉ khoảng $10^{-13}$ — tức 1 trong 10 nghìn tỉ liên kết bị phá vỡ ở room temperature. Silicon *rất gần* với chất cách điện — nhưng đủ để hoạt động như bán dẫn khi được điều khiển bằng doping!

---

## Summary / Key Takeaways

- **Tinh thể** là vật liệu rắn có cấu trúc nguyên tử tuần hoàn — là cơ sở để áp dụng band theory.
- **Unit cell** là đơn vị nhỏ nhất lặp lại; silicon dùng **diamond cubic** — hai mạng FCC xen nhau, 8 nguyên tử/cell, lattice constant $a = 0.543$ nm.
- Mỗi Si liên kết cộng hóa trị với **4 nguyên tử lân cận** (tetrahedral, 109.5°). Toàn bộ electron hóa trị tham gia liên kết.
- Ở 0 K: không có electron tự do — Si là điện môi. Ở room temp: nhiệt năng phá vỡ một số liên kết → tạo ra **electron tự do** và **hole**.
- **Hole** là chỗ trống trong liên kết, hành xử như điện tích dương — đây là hạt tải điện thứ hai trong semiconductor.
- Si là **indirect band gap** (1.12 eV) → không phù hợp cho LED/laser. GaAs là **direct band gap** (1.42 eV) → dùng cho optoelectronics.

---

## References

- Pierret, R. F. — *Semiconductor Device Fundamentals*, Ch. 1 (Prentice Hall, 1995)
- Streetman & Banerjee — *Solid State Electronic Devices*, Ch. 3 (Pearson, 2015)
- MIT 6.012 — Lecture notes: Semiconductor Fundamentals (ocw.mit.edu)
- Wikipedia — Diamond cubic crystal structure
