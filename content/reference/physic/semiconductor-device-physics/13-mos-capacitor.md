---
title: "13. MOS Capacitor"
tags: [physics, semiconductor, device-physics, lesson-13]
aliases: [MOS Capacitor]
created: 2026-03-27
---

> **Prerequisites**: [[12-metal-semiconductor-junction|12. Metal-Semiconductor Junction]] — work function, band bending, Schottky/ohmic contact; [[10-pn-junction-equilibrium|10. p-n Junction Equilibrium]] — depletion region, charge density, Poisson equation
> **Objectives**:
> - Hiểu cấu trúc MOS và vai trò của oxide gate
> - Phân tích ba chế độ hoạt động: flat-band, depletion, inversion
> - Hiểu surface potential và điều kiện threshold (ngưỡng dẫn)
> - Tính threshold voltage $V_T$ từ các thông số vật liệu
> - Hiểu đặc tuyến C-V — công cụ đặc trưng linh kiện quan trọng nhất

---

## Motivation

MOS capacitor (Metal-Oxide-Semiconductor capacitor) là linh kiện đơn giản nhất nhưng là **nền tảng của MOSFET** — transistor thống trị mọi chip điện tử hiện đại. Hiểu MOS capacitor là hiểu tại sao điện áp cổng có thể bật/tắt dòng điện trong MOSFET.

Ý tưởng cốt lõi kỳ diệu: **chỉ bằng cách thay đổi điện áp trên một tấm kim loại**, ta có thể biến bề mặt của p-type silicon từ p-type thành n-type cục bộ — tạo ra kênh dẫn điện có thể điều khiển. Đây là phép màu cho phép thu nhỏ transistor đến nm.

---

## Physical Model

### Cấu trúc MOS

Một MOS capacitor gồm ba lớp xếp chồng:

```
┌─────────────────────┐  ← Gate (kim loại hoặc poly-Si)
├─────────────────────┤  ← Oxide (SiO₂, ~1–10 nm)  ← tox
├─────────────────────┤  ← Semiconductor (p-type Si)
│                     │
│     p-type Si       │
│                     │
└─────────────────────┘
```

- **Gate**: kim loại (Al, W) hoặc n+ poly-Si dẫn điện tốt
- **Oxide (SiO₂)**: điện môi lý tưởng, $E_g \approx 9$ eV, cách điện hoàn toàn
- **Semiconductor (p-type Si)**: vùng bị điều khiển bởi điện áp cổng

Trong thực tế, oxide hiện đại dùng **high-k dielectric** (HfO₂, Al₂O₃) để giảm rò rỉ khi thu nhỏ.

---

### Ba Chế Độ Hoạt Động

Xét MOS capacitor với p-type Si và gate kim loại. Áp điện áp $V_G$ vào gate (substrate nối đất).

#### Chế độ 1: Flat-band ($V_G = V_{FB}$)

Flat-band voltage $V_{FB}$ là điện áp cần áp để triệt tiêu band bending do chênh lệch work function:

$$V_{FB} = \phi_{ms} = \frac{\phi_m - \phi_s}{q}$$

Ở flat-band: không có điện trường trong oxide hay bán dẫn, bands hoàn toàn phẳng.

```
  E
  │ Metal │ SiO₂  │ p-Si
  │────── │───────│──── Ec
  │  EF   │       │── EF
  │       │       │──── Ev
  │                 ← bands phẳng hoàn toàn
```

---

#### Chế độ 2: Depletion ($V_{FB} < V_G < V_T$)

Áp $V_G$ dương hơn $V_{FB}$ vào gate kim loại (với p-type Si):
- Điện trường trong oxide hướng từ gate xuống Si
- Hole bị đẩy ra khỏi bề mặt → depletion region hình thành ở bề mặt Si
- Bands bẻ cong xuống phía bề mặt

```
  E
  │ Metal │ SiO₂  │ p-Si
  │────── │───────│─── Ec
  │  EF   │       ╲── EF (bulk)
  │       │        ╲─ Ev
  │                  ↑ depletion ở đây
```

Surface potential $\phi_s$ = độ bẻ cong của band tại bề mặt (so với bulk):

$$\phi_s > 0: \text{ depletion}$$

Chiều rộng depletion tăng dần khi $V_G$ tăng.

---

#### Chế độ 3: Inversion ($V_G \geq V_T$)

Khi $V_G$ tăng đủ lớn → bands bẻ cong mạnh đến mức **$E_i$ tại bề mặt vượt qua $E_F$**:

- Bề mặt p-type trở thành n-type cục bộ!
- Lớp mỏng electron hình thành tại bề mặt Si-SiO₂ → **inversion layer**
- Đây chính là **kênh dẫn điện** của MOSFET

> [!definition] Điều kiện Threshold (Strong Inversion)
> Strong inversion xảy ra khi surface potential:
>
> $$\phi_s = 2\phi_F$$
>
> với $\phi_F = V_T\ln(N_A/n_i)$ là **bulk potential** (khoảng cách từ $E_i$ đến $E_F$ trong bulk).
>
> Ý nghĩa vật lý: bề mặt phải trở nên "n-type mạnh" cỡ như bulk là "p-type mạnh".

```
  E
  │ Metal │ SiO₂  │ p-Si
  │────── │───────│─── Ec
  │  EF   │   ╲───┤ ← EF tại bề mặt (cao gần Ec → n-type)
  │       │    ╲  │── EF (bulk)
  │       │     ╲─│─ Ev
  │              ↑ inversion layer mỏng (electron)
  │              ↑ depletion bên dưới
```

---

## Mathematical Formalism

### Phân tích điện áp trong MOS

Tổng điện áp gate chia cho oxide và semiconductor:

$$V_G = V_{FB} + V_{ox} + \phi_s$$

với $V_{ox}$ là voltage drop qua oxide và $\phi_s$ là surface potential.

Tại threshold ($\phi_s = 2\phi_F$), depletion region đạt độ rộng tối đa:

$$W_{d,max} = \sqrt{\frac{4\varepsilon_s\phi_F}{qN_A}}$$

Điện tích depletion tối đa (per unit area):

$$Q_{dep,max} = -qN_A W_{d,max} = -\sqrt{4\varepsilon_s qN_A\phi_F}$$

---

### Threshold Voltage $V_T$

> [!definition] Threshold Voltage
>
> $$\boxed{V_T = V_{FB} + 2\phi_F + \frac{|Q_{dep,max}|}{C_{ox}}}$$
>
> với oxide capacitance per unit area:
>
> $$C_{ox} = \frac{\varepsilon_{ox}}{t_{ox}} = \frac{3.9\varepsilon_0}{t_{ox}}$$
>
> ($\varepsilon_{ox} = 3.9\varepsilon_0$ cho SiO₂; $\varepsilon_0 = 8.85\times10^{-12}$ F/m)

**Ba thành phần của $V_T$:**

| Thành phần | Ý nghĩa |
|-----------|---------|
| $V_{FB}$ | Bù work function difference |
| $2\phi_F$ | Cần để đạt strong inversion |
| $\|Q_{dep,max}\|/C_{ox}$ | Cần để "nạp" điện tích depletion qua oxide |

---

### C-V Characteristics

MOS capacitor có **đặc tuyến điện dung–điện áp (C-V)** đặc trưng, là công cụ phân tích linh kiện quan trọng nhất trong lab:

```
C/Cox
1.0 │───────────────╲
    │ Accumulation   ╲  Depletion    High-freq
    │                 ╲─────────────────── Cmin/Cox
    │                              │
    │               Low-freq       │ Low-freq
    │                              │ (inversion charge
    │                              │  responds → C tăng)
0   └──────────────────────────────── VG
    VFB               VT
```

> [!definition] C-V Curve — Ba Vùng
>
> **Accumulation** ($V_G < V_{FB}$): hole tích lũy ở bề mặt → hành xử như tụ oxide thuần → $C = C_{ox}$ (tối đa).
>
> **Depletion** ($V_{FB} < V_G < V_T$): depletion layer như tụ nối tiếp với oxide → $C$ giảm dần:
>
> $$C = \frac{C_{ox}C_{dep}}{C_{ox} + C_{dep}} < C_{ox}$$
>
> **Inversion** ($V_G > V_T$):
> - **High-frequency** (>1 MHz): inversion charge không kịp theo tín hiệu AC → $C \approx C_{min}$ (thấp nhất)
> - **Low-frequency** (<1 kHz): inversion charge theo kịp → $C$ tăng trở lại $C_{ox}$

---

## Derivation — Bulk Potential và Điều Kiện Threshold

**Bulk potential $\phi_F$** là độ lệch của $E_i$ so với $E_F$ trong bulk p-type:

$$E_i - E_F = k_BT\ln\frac{p_0}{n_i} = k_BT\ln\frac{N_A}{n_i} \equiv q\phi_F$$

$$\Rightarrow \phi_F = V_T\ln\frac{N_A}{n_i}$$

**Tại sao threshold là $\phi_s = 2\phi_F$?**

- Ở bulk: $E_i$ cao hơn $E_F$ một lượng $q\phi_F$ → vật liệu là p-type.
- Tại bề mặt ngưỡng threshold: $E_i$ phải thấp hơn $E_F$ một lượng $q\phi_F$ → đối xứng với bulk nhưng ngược chiều → bề mặt trở thành n-type "mạnh" tương đương.
- Tổng band bending cần: $q\phi_s = 2q\phi_F$ → $\phi_s = 2\phi_F$.

---

## Worked Problem

> [!example] Bài toán 13.1 — Tính Threshold Voltage
>
> **Cho**: MOS capacitor với p-type Si ($N_A = 5\times10^{16}$ cm$^{-3}$), oxide dày $t_{ox} = 5$ nm, $V_{FB} = -0.9$ V. $n_i = 1.5\times10^{10}$ cm$^{-3}$, $\varepsilon_s = 11.7\varepsilon_0$.
>
> **Tìm**: $\phi_F$, $W_{d,max}$, $V_T$.

**Lời giải:**

**Bước 1:** Bulk potential:

$$\phi_F = V_T\ln\frac{N_A}{n_i} = 0.026\times\ln\frac{5\times10^{16}}{1.5\times10^{10}} = 0.026\times15.41 = 0.401 \text{ V}$$

**Bước 2:** Maximum depletion width:

$$W_{d,max} = \sqrt{\frac{4\varepsilon_s\phi_F}{qN_A}} = \sqrt{\frac{4\times11.7\times8.85\times10^{-12}\times0.401}{1.6\times10^{-19}\times5\times10^{22}}}$$

$$= \sqrt{\frac{1.656\times10^{-13}}{8\times10^{3}}} = \sqrt{2.07\times10^{-17}} \approx 4.55\times10^{-9} \text{ m} = 4.55 \text{ nm}$$

**Bước 3:** Oxide capacitance ($\varepsilon_{ox} = 3.9\times8.85\times10^{-12}$):

$$C_{ox} = \frac{\varepsilon_{ox}}{t_{ox}} = \frac{3.9\times8.85\times10^{-12}}{5\times10^{-9}} = 6.9\times10^{-3} \text{ F/m}^2 = 6.9 \text{ mF/m}^2$$

**Bước 4:** Depletion charge:

$$|Q_{dep,max}| = qN_A W_{d,max} = 1.6\times10^{-19}\times5\times10^{22}\times4.55\times10^{-9} = 3.64\times10^{-4} \text{ C/m}^2$$

**Bước 5:** Threshold voltage:

$$V_T = V_{FB} + 2\phi_F + \frac{|Q_{dep,max}|}{C_{ox}} = -0.9 + 2\times0.401 + \frac{3.64\times10^{-4}}{6.9\times10^{-3}}$$

$$= -0.9 + 0.802 + 0.053 = -0.045 \text{ V} \approx -0.05 \text{ V}$$

**Nhận xét:** $V_T \approx -0.05$ V — rất gần 0 V. Với CMOS, đây là enhancement-mode n-channel MOSFET (threshold dương nhỏ hoặc âm nhỏ là lý tưởng). Trong thực tế, $V_T$ thường được điều chỉnh về ~0.4–0.5 V bằng threshold adjust implant.

> [!example] Bài toán 13.2 — Đặc tuyến C-V
>
> **Cho**: Tiếp bài 13.1. Tính capacitance tối thiểu $C_{min}$ ở high-frequency.

**Lời giải:**

$$C_{dep,min} = \frac{\varepsilon_s}{W_{d,max}} = \frac{11.7\times8.85\times10^{-12}}{4.55\times10^{-9}} = \frac{1.036\times10^{-10}}{4.55\times10^{-9}} = 2.28\times10^{-2} \text{ F/m}^2$$

$$C_{min} = \frac{C_{ox}\cdot C_{dep,min}}{C_{ox} + C_{dep,min}} = \frac{6.9\times10^{-3}\times2.28\times10^{-2}}{6.9\times10^{-3}+2.28\times10^{-2}} = \frac{1.57\times10^{-4}}{2.97\times10^{-2}} \approx 5.3\times10^{-3} \text{ F/m}^2$$

Tỉ lệ:

$$\frac{C_{min}}{C_{ox}} = \frac{5.3\times10^{-3}}{6.9\times10^{-3}} \approx 0.77$$

Ở high-frequency, capacitance giảm xuống còn 77% giá trị cực đại — điều này phản ánh depletion layer là "tụ nối tiếp" khá lớn (vì $t_{ox}$ rất mỏng).

---

## Summary / Key Takeaways

- **MOS capacitor** = Metal + SiO₂ + Semiconductor — nền tảng của MOSFET.
- Ba chế độ: **Accumulation** (hole tích lũy, $C = C_{ox}$), **Depletion** (hole bị đẩy, $C$ giảm), **Inversion** (electron kênh hình thành, $V_G \geq V_T$).
- **Threshold voltage**: $V_T = V_{FB} + 2\phi_F + |Q_{dep,max}|/C_{ox}$ — điện áp để tạo kênh dẫn điện.
- **Surface potential** $\phi_s = 2\phi_F$ → threshold: bề mặt n-type mạnh tương đương bulk p-type.
- **C-V curve**: công cụ đặc trưng linh kiện — cho biết $V_{FB}$, $V_T$, $t_{ox}$, $N_A$.
- Oxide mỏng hơn ($t_{ox}$ nhỏ) → $C_{ox}$ lớn hơn → cần $V_T$ nhỏ hơn → transistor hiệu quả hơn → lý do thu nhỏ oxide là chiến lược trung tâm của Moore's Law.

---

## References

- Hu, Chenming — *Modern Semiconductor Devices for Integrated Circuits*, Ch. 5 (UC Berkeley, 2009)
- Pierret, R. F. — *Semiconductor Device Fundamentals*, Ch. 15 (Prentice Hall, 1995)
- MIT 6.012 — Lecture notes: MOS Capacitor (ocw.mit.edu)
- Streetman & Banerjee — *Solid State Electronic Devices*, Ch. 6 (Pearson, 2015)
