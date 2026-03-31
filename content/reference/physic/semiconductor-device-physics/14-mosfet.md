---
title: "14. MOSFET"
tags: [physics, semiconductor, device-physics, lesson-14]
aliases: [MOSFET]
created: 2026-03-27
---

> **Prerequisites**: [[13-mos-capacitor|13. MOS Capacitor]] — threshold voltage, inversion layer; [[07-drift|07. Drift]] — drift current, mobility, velocity saturation; [[11-pn-junction-under-bias|11. p-n Junction Under Bias]] — p-n junction, depletion
> **Objectives**:
> - Hiểu cấu trúc vật lý của n-channel MOSFET
> - Giải thích hai chế độ hoạt động: linear (triode) và saturation (pinch-off)
> - Derive I-V model (long-channel) cho cả hai chế độ
> - Hiểu threshold voltage và transconductance $g_m$
> - Hiểu short-channel effects — lý do giới hạn thu nhỏ transistor

---

## Motivation

MOSFET — Metal-Oxide-Semiconductor Field-Effect Transistor — là linh kiện quan trọng nhất trong lịch sử công nghệ. Mỗi CPU hiện đại chứa hàng **tỉ** MOSFET trên một con chip. Intel 4004 (1971) có 2300 transistor; Apple M4 (2024) có ~28 tỉ.

Tất cả đều dựa trên cùng một nguyên lý vật lý bạn đã học: điện áp gate kiểm soát inversion layer → kiểm soát độ dẫn điện của kênh → bật/tắt dòng điện.

Lesson này xây dựng mô hình I-V hoàn chỉnh — từ vật lý đến công thức tính dòng drain, là nền tảng để thiết kế mạch khuếch đại và digital logic.

---

## Physical Model

### Cấu trúc n-channel MOSFET

```
       Gate (VG)
          │
    ──────┴──────      ← Gate oxide (SiO₂)
   │  n+  │  n+  │     ← Source (VS=0) và Drain (VD)
   │Source │Drain │
   │───────────── │     ← Channel (dưới gate)
   │  p-type body│
   │─────────────│
        Body (VB=0)
```

- **Source (S)**: điện cực cho electron vào kênh (nối đất)
- **Drain (D)**: điện cực thu electron từ kênh ($V_D > 0$)
- **Gate (G)**: điện cực điều khiển ($V_G$)
- **Body (B)**: substrate p-type (nối đất)
- **Kênh**: vùng p-Si dưới gate, có thể trở thành n-type khi $V_G > V_T$

Hai vùng n+ source và drain cách nhau bởi kênh p. Ở $V_G = 0$: hai p-n junction ngược chiều → không có dòng. Ở $V_G > V_T$: inversion layer nối source với drain → dòng chảy.

---

### Cơ chế Hoạt động

**Bước 1:** Gate tạo inversion layer.

Khi $V_G > V_T$: electron tập trung tại bề mặt p-Si dưới gate → tạo kênh n mỏng.

**Bước 2:** Điện áp drain tạo dòng qua kênh.

Khi $V_D > 0$: điện trường dọc kênh → electron drift từ source sang drain → dòng $I_D$.

**Bước 3:** Kênh thay đổi hình dạng theo $V_D$.

```
VG > VT, VD tăng dần:

VD nhỏ (Linear):         VD = VG - VT (Pinch-off):    VD > VG - VT (Saturation):

S ──●●●●●●●●●── D       S ──●●●●●──╱ D              S ──●●●●──╱  D
     kênh đều               kênh hẹp dần                 kênh pinch-off
     (hình chữ nhật)        → tip về 0 ở drain            ID không tăng nữa
```

---

### Hai Chế Độ Hoạt Động

#### Chế độ Linear (Triode): $V_{DS} < V_{GS} - V_T$

Kênh mở từ source đến drain. Dòng drain tăng gần tuyến tính theo $V_{DS}$:

> [!definition] Long-channel MOSFET — Chế độ Linear
>
> $$\boxed{I_D = \mu_n C_{ox}\frac{W}{L}\left[(V_{GS} - V_T)V_{DS} - \frac{V_{DS}^2}{2}\right]}$$
>
> với:
> - $W$: chiều rộng kênh
> - $L$: chiều dài kênh
> - $\mu_n$: electron mobility trong kênh
> - $C_{ox} = \varepsilon_{ox}/t_{ox}$: oxide capacitance per unit area

Ở $V_{DS}$ nhỏ: $I_D \approx \mu_n C_{ox}\frac{W}{L}(V_{GS} - V_T)V_{DS}$ — dạng Ohm's law.

**Điện trở on-state:**

$$R_{on} = \frac{V_{DS}}{I_D}\bigg|_{V_{DS}\to 0} = \frac{1}{\mu_n C_{ox}\frac{W}{L}(V_{GS} - V_T)}$$

---

#### Chế độ Saturation (Pinch-off): $V_{DS} \geq V_{GS} - V_T$

Khi $V_{DS}$ tăng đến $V_{DS,sat} = V_{GS} - V_T$, kênh "bị thắt" (pinch-off) ở đầu drain. Dòng bão hòa:

> [!definition] Long-channel MOSFET — Chế độ Saturation
>
> $$\boxed{I_D = \frac{\mu_n C_{ox}}{2}\frac{W}{L}(V_{GS} - V_T)^2}$$
>
> $I_D$ **không phụ thuộc** vào $V_{DS}$ → MOSFET hoạt động như nguồn dòng.

> [!tip] Tại sao dòng không tăng sau pinch-off?
> Khi kênh bị thắt ở drain, điểm pinch-off di chuyển về phía source khi $V_{DS}$ tăng, nhưng điện áp tại điểm pinch-off luôn là $V_{DS,sat} = V_{GS} - V_T$. Điện trường tại điểm này đẩy electron qua vùng thắt vào drain bằng tốc độ không đổi → $I_D$ bão hòa.

---

### Đặc tuyến I-V (Output Characteristics)

```
ID (mA)
│          VGS = 1.8V
│         ╱────────────────── ← Saturation (ID ∝ (VGS-VT)²)
│        ╱
│       ╱────────────── VGS = 1.5V
│      ╱
│     ╱───────── VGS = 1.2V
│    ╱
│   ╱──── VGS = 0.9V  (gần VT)
│  ╱
│ ╱
└──────────────────────── VDS
   Linear │ Saturation
   region │ region
```

Đường ranh giới là $V_{DS} = V_{GS} - V_T$ (đường parabol).

---

## Mathematical Formalism

### Transconductance $g_m$

> [!definition] Transconductance
> $g_m$ là độ nhạy của $I_D$ đối với thay đổi nhỏ của $V_{GS}$ (ở saturation):
>
> $$g_m = \frac{\partial I_D}{\partial V_{GS}}\bigg|_{V_{DS}=const} = \mu_n C_{ox}\frac{W}{L}(V_{GS} - V_T) = \sqrt{2\mu_n C_{ox}\frac{W}{L}I_D}$$
>
> Đơn vị: A/V = Siemens (S).

$g_m$ là thông số quan trọng nhất cho khuếch đại: voltage gain $\approx g_m \times R_{load}$.

---

### Subthreshold Region ($V_{GS} < V_T$)

Ở $V_{GS} < V_T$, vẫn còn một lượng nhỏ dòng chảy qua — **subthreshold current**:

$$I_D \propto e^{(V_{GS} - V_T)/nV_T}$$

với $n \approx 1$–$1.5$ là subthreshold ideality factor.

**Subthreshold swing (SS)**: điện áp cần để giảm dòng đi 10 lần:

$$SS = \frac{d V_{GS}}{d(\log_{10}I_D)} = n\cdot V_T\cdot\ln 10 \approx 60\text{–}80 \text{ mV/decade ở 300 K}$$

> [!warning] Giới hạn vật lý của subthreshold swing
> Ở room temperature, **giới hạn vật lý** của SS là $60$ mV/decade (khi $n = 1$). Đây là lý do không thể hạ supply voltage CMOS xuống dưới ~0.5 V mà không mất nhiều dòng leakage — transistor không thể "tắt" hoàn toàn đủ nhanh.

---

### Short-Channel Effects

Khi $L$ thu nhỏ xuống dưới ~100 nm, mô hình long-channel không còn chính xác. Các hiệu ứng quan trọng:

**1. Velocity saturation:**
Như đã thảy ở Lesson 07, với $L$ nhỏ, điện trường trong kênh rất cao ($\mathcal{E} \sim V_{DS}/L$) → electron đạt velocity saturation:

$$I_{D,sat} \approx v_{sat}\cdot C_{ox}\cdot W\cdot(V_{GS} - V_T) \quad \text{(thay vì } \propto (V_{GS}-V_T)^2\text{)}$$

$I_D$ tuyến tính với $V_{GS} - V_T$ thay vì bình phương — transistor ngắn hoạt động khác hẳn mô hình cổ điển.

**2. Drain-Induced Barrier Lowering (DIBL):**
Điện trường của drain ảnh hưởng đến ngưỡng threshold → $V_T$ giảm khi $V_{DS}$ tăng → transistor khó tắt hơn.

**3. Subthreshold leakage:**
Với $L$ nhỏ, dòng rò qua kênh tắt trở nên đáng kể → tiêu hao công suất tĩnh — vấn đề nghiêm trọng trong chip di động.

---

## Derivation — Công thức $I_D$ Chế Độ Linear

**Xét một phần tử nhỏ dx của kênh tại vị trí $x$:**

Điện tích inversion tại vị trí $x$ (điện áp kênh $V(x)$):

$$Q_{inv}(x) = -C_{ox}[V_{GS} - V_T - V(x)]$$

Dòng drift qua phần tử dx:

$$dV = \frac{I_D\,dx}{\mu_n W Q_{inv}(x)} \Rightarrow I_D\,dx = -\mu_n W Q_{inv}(x)\,dV$$

Tích phân từ source ($x=0$, $V=0$) đến drain ($x=L$, $V=V_{DS}$):

$$I_D L = \mu_n W C_{ox}\int_0^{V_{DS}}[V_{GS} - V_T - V]\,dV$$

$$I_D = \mu_n C_{ox}\frac{W}{L}\left[(V_{GS}-V_T)V_{DS} - \frac{V_{DS}^2}{2}\right]$$

Tại $V_{DS} = V_{GS} - V_T$ (pinch-off): tích phân tối đa → $I_{D,sat} = \frac{\mu_n C_{ox}}{2}\frac{W}{L}(V_{GS}-V_T)^2$. $\square$

---

## Worked Problem

> [!example] Bài toán 14.1 — Tính $I_D$ trong hai chế độ
>
> **Cho**: n-channel MOSFET với $\mu_n C_{ox} = 200$ µA/V², $W/L = 10$, $V_T = 0.5$ V.
>
> Tính $I_D$ khi:
> a) $V_{GS} = 1.5$ V, $V_{DS} = 0.2$ V
> b) $V_{GS} = 1.5$ V, $V_{DS} = 1.5$ V

**Lời giải:**

$V_{GS} - V_T = 1.5 - 0.5 = 1.0$ V

**a) Kiểm tra chế độ:**

$V_{DS} = 0.2 \text{ V} < V_{GS} - V_T = 1.0 \text{ V}$ → **Linear mode**

$$I_D = 200\times10^{-6}\times10\times\left[1.0\times0.2 - \frac{0.2^2}{2}\right]$$

$$= 2\times10^{-3}\times[0.2 - 0.02] = 2\times10^{-3}\times0.18 = 0.36 \text{ mA}$$

**b) Kiểm tra chế độ:**

$V_{DS} = 1.5 \text{ V} > V_{GS} - V_T = 1.0 \text{ V}$ → **Saturation mode**

$$I_D = \frac{200\times10^{-6}}{2}\times10\times(1.0)^2 = \frac{2\times10^{-3}}{2}\times1 = 1.0 \text{ mA}$$

> [!example] Bài toán 14.2 — Transconductance và Voltage Gain
>
> **Cho**: MOSFET từ bài 14.1, $V_{GS} = 1.5$ V, $V_{DS} = 1.5$ V (saturation). Load resistance $R_D = 5$ kΩ.
>
> **Tìm**: $g_m$ và small-signal voltage gain $|A_v|$.

**Lời giải:**

$$g_m = \mu_n C_{ox}\frac{W}{L}(V_{GS} - V_T) = 200\times10^{-6}\times10\times1.0 = 2\times10^{-3} \text{ A/V} = 2 \text{ mS}$$

$$|A_v| = g_m R_D = 2\times10^{-3}\times5\times10^3 = 10 \text{ V/V}$$

**Nhận xét:** Gain 10× từ một transistor — đây là nguyên lý của bộ khuếch đại CMOS inverter.

> [!example] Bài toán 14.3 — Điều kiện thu nhỏ ($W/L$ scaling)
>
> **Hỏi**: Nếu giữ nguyên $V_{GS}$, $V_T$, $\mu_n C_{ox}$ nhưng thu nhỏ $W$ và $L$ cùng tỉ lệ (giữ $W/L$ không đổi), $I_D$ thay đổi như thế nào?

**Giải thích:**

$I_{D,sat} = \frac{\mu_n C_{ox}}{2}\frac{W}{L}(V_{GS}-V_T)^2$

Nếu $W/L$ không đổi → $I_D$ **không đổi**! Nhưng diện tích chip thu nhỏ bình phương theo scaling factor. Mật độ transistor tăng, công suất trên mỗi transistor không đổi → **công suất tổng tăng** khi số lượng transistor tăng — đây là "power wall" trong semiconductor industry, là lý do tần số clock CPU không còn tăng như trước sau ~2005.

---

## Summary / Key Takeaways

- **MOSFET** = gate điều khiển inversion layer → bật/tắt kênh dẫn điện giữa source và drain.
- **Linear mode** ($V_{DS} < V_{GS}-V_T$): $I_D = \mu_n C_{ox}\frac{W}{L}[(V_{GS}-V_T)V_{DS} - V_{DS}^2/2]$ — hoạt động như điện trở điều chỉnh.
- **Saturation mode** ($V_{DS} \geq V_{GS}-V_T$): $I_D = \frac{\mu_n C_{ox}}{2}\frac{W}{L}(V_{GS}-V_T)^2$ — hoạt động như nguồn dòng.
- **Transconductance** $g_m = \mu_n C_{ox}\frac{W}{L}(V_{GS}-V_T)$ — thước đo khả năng khuếch đại.
- **Subthreshold swing** ≥ 60 mV/decade ở 300 K — giới hạn vật lý cho supply voltage tối thiểu.
- **Short-channel effects**: velocity saturation, DIBL, leakage — thách thức kỹ thuật chính khi thu nhỏ transistor.

---

## References

- Hu, Chenming — *Modern Semiconductor Devices for Integrated Circuits*, Ch. 6–7 (UC Berkeley, 2009)
- Pierret, R. F. — *Semiconductor Device Fundamentals*, Ch. 16–17 (Prentice Hall, 1995)
- MIT 6.012 — Lecture notes: MOSFET (ocw.mit.edu)
- Streetman & Banerjee — *Solid State Electronic Devices*, Ch. 6 (Pearson, 2015)
