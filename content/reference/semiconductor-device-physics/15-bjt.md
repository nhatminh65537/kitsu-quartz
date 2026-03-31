---
title: "15. BJT — Bipolar Junction Transistor"
tags: [physics, semiconductor, device-physics, lesson-15]
aliases: [BJT]
created: 2026-03-27
---

> **Prerequisites**: [[10-pn-junction-equilibrium|10. p-n Junction Equilibrium]], [[11-pn-junction-under-bias|11. p-n Junction Under Bias]] — p-n junction, minority carrier injection; [[09-generation-recombination|09. Generation & Recombination]] — diffusion length, minority carrier lifetime
> **Objectives**:
> - Hiểu cấu trúc vật lý của NPN BJT và vai trò của từng vùng
> - Giải thích cơ chế "transistor action" — tại sao dòng nhỏ ở base điều khiển dòng lớn ở collector
> - Hiểu bốn chế độ hoạt động và phân biệt active mode với saturation/cutoff
> - Hiểu current gain $\beta_F$ và $\alpha_F$ đến từ vật lý nào
> - Nắm được Ebers-Moll model ở mức độ sử dụng

---

## Motivation

BJT — Bipolar Junction Transistor — là transistor đầu tiên được phát minh (Bell Labs, 1947) và vẫn là linh kiện thiết yếu trong analog electronics, RF amplifiers, và high-speed digital. Khác với MOSFET (điều khiển bằng điện áp qua oxide), BJT điều khiển bằng **dòng điện** — và cơ chế hoạt động của nó liên quan đến cả electron lẫn hole, tức là cả hai loại hạt tải → "bipolar".

Hiểu BJT là hiểu tại sao một dòng base nhỏ ~10 µA có thể điều khiển dòng collector ~1 mA. Toàn bộ cơ chế đó đến từ minority carrier diffusion qua base — thứ bạn đã học ở Lesson 09 và 11.

---

## Physical Model

### Cấu trúc NPN BJT

```
  Emitter (E)   Base (B)    Collector (C)
  n+ (nặng doped) │ p (mỏng, nhẹ doped) │ n (vừa doped)

   ─────────E──────────B──────────C─────────
   │  n+  ──────────  p  ──────────  n  │
   │  (emitter)    (base)      (collector)  │
   ─────────────────────────────────────────
```

Ba vùng doping có vai trò rất khác nhau:

| Vùng | Doping | Vai trò |
|------|--------|---------|
| Emitter (E) | n+ rất cao ($\sim 10^{19}$ cm$^{-3}$) | Nguồn phun electron |
| Base (B) | p nhẹ ($\sim 10^{17}$ cm$^{-3}$), **mỏng** ($W_B \ll L_n$) | Điều khiển — minority carrier transit |
| Collector (C) | n vừa ($\sim 10^{15}$ cm$^{-3}$), lớn | Thu electron từ base |

**Hai junction:**
- **BE junction** (Emitter-Base): thường được forward bias trong active mode
- **BC junction** (Base-Collector): thường được reverse bias trong active mode

---

### Bốn Chế Độ Hoạt Động

| Chế độ | BE junction | BC junction | Ứng dụng |
|--------|------------|------------|---------|
| **Active** (Forward Active) | Forward | Reverse | Khuếch đại |
| **Saturation** | Forward | Forward | Switch — ON |
| **Cutoff** | Reverse | Reverse | Switch — OFF |
| **Reverse Active** | Reverse | Forward | Hiếm dùng |

---

### Transistor Action trong Active Mode

Đây là cơ chế quan trọng nhất — giải thích tại sao BJT có thể khuếch đại:

**Bước 1: Phun minority carrier từ Emitter.**

BE junction forward bias → electron từ n+ emitter được **inject** vào p-base như minority carrier. Nồng độ electron tại biên BE:

$$n_p(0) = n_{p0}\,e^{V_{BE}/V_T} \gg n_{p0}$$

**Bước 2: Khuếch tán qua base mỏng.**

Electron là minority carrier trong base p-type. Chúng khuếch tán qua base theo profile giảm dần. Vì $W_B \ll L_n$ (base rất mỏng), **hầu hết electron đến được biên BC** trước khi tái kết hợp.

**Bước 3: Cuốn vào Collector.**

BC junction reverse bias → điện trường mạnh tại biên BC cuốn tất cả electron đến biên này sang collector. Collector "hút" electron → tạo dòng $I_C$.

```
 Emitter     Base (mỏng)   Collector
   n+            p              n
   │●●●●● → → → → → → → → ────│
   │           khuếch tán      │ Điện trường
   │           minority e      │ thu electron
   │                           │
   → BE forward bias    BC reverse bias →

   Kết quả: IE ≈ IC (vì base mỏng, ít recombination)
```

---

## Mathematical Formalism

### Current Gain $\alpha_F$ và $\beta_F$

> [!definition] Common-Base Current Gain $\alpha_F$
>
> $$\alpha_F = \frac{I_C}{I_E}\bigg|_{active} < 1$$
>
> Tỉ lệ electron từ emitter đến được collector (không bị recombination trong base).
>
> $$\alpha_F = \gamma \cdot \alpha_T$$
>
> với:
> - $\gamma$ = **emitter injection efficiency** (tỉ lệ dòng electron trong $I_E$ — electron từ emitter, không phải hole từ base ngược lại)
> - $\alpha_T$ = **base transport factor** (tỉ lệ electron qua base không tái kết hợp)

> [!definition] Common-Emitter Current Gain $\beta_F$
>
> $$\beta_F = \frac{I_C}{I_B}\bigg|_{active} = \frac{\alpha_F}{1-\alpha_F} \gg 1$$

**Điển hình:** $\alpha_F \approx 0.99$ → $\beta_F = 0.99/0.01 = 99$. Dòng base nhỏ điều khiển dòng collector lớn gấp $\beta_F$ lần.

---

### Tại sao $\beta_F$ lớn? — Thiết kế Base

$\beta_F$ lớn khi:

**1. Base mỏng ($W_B \ll L_n$):**

$$\alpha_T \approx 1 - \frac{W_B^2}{2L_n^2} \approx 1 \quad \text{khi } W_B \ll L_n$$

**2. Emitter doping cao hơn base ($N_{dE} \gg N_{aB}$):**

$$\gamma \approx 1 - \frac{N_{aB}D_p W_B}{N_{dE}D_n L_p} \approx 1$$

Kết hợp: $\alpha_F \approx 1$ → $\beta_F = \alpha_F/(1-\alpha_F)$ rất lớn.

Ví dụ điển hình: $W_B = 100$ nm, $L_n = 10$ µm → $W_B/L_n = 0.01$ → $\alpha_T \approx 0.9999$ → base transport gần như hoàn hảo.

---

### Quan hệ Dòng điện — Active Mode

> [!definition] Collector và Emitter Current (Active Mode)
>
> $$I_C = I_S\,e^{V_{BE}/V_T}$$
>
> $$I_E = \frac{I_C}{\alpha_F} = \frac{\beta_F + 1}{\beta_F}I_C$$
>
> $$I_B = I_E - I_C = \frac{I_C}{\beta_F} = \frac{I_S}{\beta_F}e^{V_{BE}/V_T}$$
>
> với $I_S$ là saturation current (giống diode, phụ thuộc $n_i^2$, $D_n$, $W_B$, $N_{aB}$, $A_E$).

**KCL:** $I_E = I_B + I_C$ — luôn đúng.

---

### Ebers-Moll Model (Tổng quát)

Ebers-Moll model mô tả BJT trong mọi chế độ bằng hai diode ghép:

> [!definition] Ebers-Moll Model (NPN)
>
> $$I_C = I_S\left(e^{V_{BE}/V_T} - e^{V_{BC}/V_T}\right) - \frac{I_S}{\beta_R}\left(e^{V_{BC}/V_T} - 1\right)$$
>
> $$I_B = \frac{I_S}{\beta_F}\left(e^{V_{BE}/V_T} - 1\right) + \frac{I_S}{\beta_R}\left(e^{V_{BC}/V_T} - 1\right)$$

với $\beta_R$ là reverse current gain (nhỏ, ~0.1–5).

**Đặc tuyến quan trọng (Active mode, $V_{BC} \ll -V_T$):**

$$I_C \approx I_S\,e^{V_{BE}/V_T}$$

$I_C$ phụ thuộc theo hàm mũ vào $V_{BE}$ — **không phụ thuộc** vào $V_{CE}$ (lý tưởng) → BJT là nguồn dòng điều khiển bởi $V_{BE}$.

---

### Transconductance và Early Effect

Transconductance của BJT:

$$g_m = \frac{\partial I_C}{\partial V_{BE}} = \frac{I_C}{V_T}$$

$g_m$ **tỉ lệ với $I_C$** — đặc tính quan trọng giúp BJT tuyến tính hơn MOSFET ở nhiều ứng dụng.

> [!definition] Early Effect (Hiệu ứng Early)
> Khi $V_{CE}$ tăng, độ rộng depletion của BC junction tăng → base width $W_B$ bị thu hẹp → $I_C$ tăng nhẹ theo $V_{CE}$:
>
> $$I_C \approx I_S e^{V_{BE}/V_T}\left(1 + \frac{V_{CE}}{V_A}\right)$$
>
> với $V_A$ là **Early voltage** (25–200 V). Biểu hiện trên đồ thị: các đường $I_C$–$V_{CE}$ có độ dốc nhỏ và nếu kéo dài gặp nhau tại $-V_A$ trên trục $V_{CE}$.

---

### So sánh BJT và MOSFET

| Tính chất | BJT | MOSFET |
|-----------|-----|--------|
| Cơ chế điều khiển | $V_{BE}$ (dòng $I_B$) | $V_{GS}$ (điện áp, không dòng) |
| Hạt tải | Cả electron và hole (bipolar) | Chỉ một loại (unipolar) |
| Transconductance | $g_m = I_C/V_T$ (cao) | $g_m = \mu_n C_{ox}(W/L)(V_{GS}-V_T)$ |
| Noise | Cao hơn (shot noise) | Thấp hơn (flicker noise) |
| Ứng dụng chính | RF, analog precision, linear | Digital IC, power, đa số analog |
| Tích hợp | Khó thu nhỏ như MOSFET | Dễ thu nhỏ → chip tỉ transistor |

---

## Derivation — Nguồn gốc của $\beta_F$ từ Diffusion qua Base

Với base mỏng ($W_B$) và điều kiện biên:
- Tại $x = 0$ (biên BE): $\Delta n(0) = n_{p0}(e^{V_{BE}/V_T} - 1)$
- Tại $x = W_B$ (biên BC, reverse bias): $\Delta n(W_B) \approx 0$

Giải minority carrier diffusion equation (steady-state, không G):

$$\Delta n(x) = \Delta n(0)\frac{\sinh[(W_B-x)/L_n]}{\sinh(W_B/L_n)}$$

Với $W_B \ll L_n$ (xấp xỉ short base): $\Delta n(x) \approx \Delta n(0)(1 - x/W_B)$ — profile tuyến tính!

**Dòng collector** (electron đến biên BC):

$$I_C = qAD_n\frac{d(\Delta n)}{dx}\bigg|_{x=W_B} = \frac{qAD_n\Delta n(0)}{W_B} = \frac{qAD_n n_{p0}}{W_B}e^{V_{BE}/V_T}$$

**Dòng base** (recombination trong base, tỉ lệ với tổng điện tích lưu trữ):

$$I_B \approx \frac{qA W_B \Delta n(0)}{2\tau_n} = \frac{qAW_B n_{p0}}{2\tau_n}e^{V_{BE}/V_T}$$

Chia:

$$\beta_F = \frac{I_C}{I_B} = \frac{2D_n\tau_n}{W_B^2} = \frac{2L_n^2}{W_B^2}$$

> [!definition] Kết luận
> $\beta_F \propto (L_n/W_B)^2$ — BJT có gain cao khi base mỏng ($W_B$) so với diffusion length ($L_n$). Đây chính xác là lý do tại sao BJT hiện đại được chế tạo với base width chỉ vài chục nm.

---

## Worked Problem

> [!example] Bài toán 15.1 — Tính $\beta_F$ từ thông số cơ bản
>
> **Cho**: NPN BJT với $W_B = 0.5$ µm, $D_n = 25$ cm²/s, $\tau_n = 100$ ns trong base.
>
> **Tìm**: $L_n$, $\alpha_T$, và $\beta_F$ (bỏ qua injection efficiency, $\gamma \approx 1$).

**Lời giải:**

$$L_n = \sqrt{D_n\tau_n} = \sqrt{25\times10^{-7}} = 5\times10^{-4}\text{ cm} = 5 \text{ µm}$$

$$\alpha_T \approx 1 - \frac{W_B^2}{2L_n^2} = 1 - \frac{(0.5)^2}{2\times(5)^2} = 1 - \frac{0.25}{50} = 1 - 0.005 = 0.995$$

$$\alpha_F \approx \gamma\cdot\alpha_T \approx 0.995$$

$$\beta_F = \frac{\alpha_F}{1-\alpha_F} = \frac{0.995}{0.005} = 199$$

**Xác nhận bằng công thức:**

$$\beta_F \approx \frac{2L_n^2}{W_B^2} = \frac{2\times25}{0.25} = 200 \approx 199 \text{ ✓}$$

> [!example] Bài toán 15.2 — Xác định chế độ hoạt động
>
> **Cho**: NPN BJT với $\beta_F = 150$, $I_S = 10^{-15}$ A, $V_T = 0.026$ V.
>
> Trong mạch, ta đo được $V_{BE} = 0.65$ V và $V_{CE} = 0.2$ V.
>
> **Hỏi**: BJT đang ở chế độ nào?

**Lời giải:**

$V_{BC} = V_{BE} - V_{CE} = 0.65 - 0.2 = 0.45$ V $> 0$

→ BC junction **forward biased** → **không phải active mode**!

Cả BE và BC đều forward bias → **Saturation mode**.

Trong saturation: $V_{CE,sat} \approx 0.1$–$0.2$ V, transistor hoạt động như switch đóng (on-state).

> [!example] Bài toán 15.3 — Dòng collector trong active mode
>
> **Cho**: Transistor từ bài 15.2 nhưng $V_{CE} = 3$ V (đảm bảo active mode). $V_{BE} = 0.65$ V.
>
> **Tìm**: $I_C$, $I_B$, $I_E$.

**Lời giải:**

$$I_C = I_S e^{V_{BE}/V_T} = 10^{-15}\times e^{0.65/0.026} = 10^{-15}\times e^{25} = 10^{-15}\times7.2\times10^{10} \approx 72\text{ µA}$$

$$I_B = \frac{I_C}{\beta_F} = \frac{72\text{ µA}}{150} = 0.48 \text{ µA}$$

$$I_E = I_C + I_B = 72 + 0.48 = 72.48 \text{ µA} \approx 72.5 \text{ µA}$$

**Nhận xét:** Dòng base chỉ 0.48 µA điều khiển dòng collector 72 µA — gain 150×. Đây là "transistor action" trong thực tế.

---

## Summary / Key Takeaways

- **BJT** = hai p-n junction ghép — NPN (hay PNP) — hoạt động dựa trên minority carrier diffusion qua base.
- **Active mode**: BE forward, BC reverse → emitter phun minority carrier qua base → collector thu → $I_C = \beta_F I_B$.
- **Transistor action**: base mỏng ($W_B \ll L_n$) → ít recombination → hầu hết carrier qua được collector → $\beta_F$ lớn.
- **$\beta_F \approx 2L_n^2/W_B^2$** — tăng khi base mỏng và minority carrier lifetime dài.
- **Ebers-Moll model**: mô tả BJT trong mọi chế độ qua hai diode + transistor action.
- **Early effect**: $V_{CE}$ làm thu hẹp base → $I_C$ tăng nhẹ theo $V_{CE}$ → cần $V_A$ để mô hình hóa.
- **BJT vs MOSFET**: BJT dùng dòng điều khiển, gain cao, noise cao hơn; MOSFET dùng điện áp, dễ thu nhỏ, chiếm ưu thế trong digital IC.

---

## References

- Hu, Chenming — *Modern Semiconductor Devices for Integrated Circuits*, Ch. 8 (UC Berkeley, 2009)
- Pierret, R. F. — *Semiconductor Device Fundamentals*, Ch. 10–12 (Prentice Hall, 1995)
- MIT 6.012 — Lecture notes: Bipolar Junction Transistor (ocw.mit.edu)
- Wikipedia — Bipolar junction transistor; Ebers-Moll model
