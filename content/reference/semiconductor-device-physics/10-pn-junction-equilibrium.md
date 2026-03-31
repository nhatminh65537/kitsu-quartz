---
title: "10. p-n Junction Equilibrium"
tags: [physics, semiconductor, device-physics, lesson-10]
aliases: [p-n Junction Equilibrium]
created: 2026-03-27
---

> **Prerequisites**: [[06-doping|06. Doping]] — carrier concentration, Fermi level; [[07-drift|07. Drift]], [[08-diffusion|08. Diffusion]] — drift-diffusion; [[09-generation-recombination|09. Generation & Recombination]] — recombination, continuity equation
> **Objectives**:
> - Hiểu quá trình hình thành depletion region khi ghép p-type và n-type
> - Giải thích built-in potential $V_{bi}$ và tính được nó từ doping
> - Tính chiều rộng depletion region $W$ và phân bố điện trường
> - Đọc và vẽ energy band diagram của p-n junction ở equilibrium
> - Hiểu tại sao không có dòng điện net dù có điện trường nội

---

## Motivation

Đây là lesson **hội tụ** của toàn bộ series — tất cả những gì đã học từ Lesson 01 đến 09 sẽ được dùng ở đây cùng một lúc.

P-n junction là linh kiện bán dẫn đơn giản nhất và cũng là **nền tảng của mọi linh kiện điện tử**: diode chỉnh lưu, solar cell, LED, base-emitter của BJT, source-drain của MOSFET đều là p-n junction. Hiểu p-n junction là hiểu tại sao dòng điện chỉ chạy một chiều, tại sao có thể điều chỉnh dòng bằng điện áp, và tại sao ánh sáng có thể tạo ra điện.

Lesson này phân tích trạng thái **cân bằng** (không có điện áp áp vào). Lesson 11 sẽ phân tích khi có điện áp (bias).

---

## Physical Model

### Quá trình hình thành Junction

Tưởng tượng đưa hai mảnh bán dẫn — một n-type ($N_D$) và một p-type ($N_A$) — ghép sát nhau tại $x = 0$ (junction).

**Trước khi ghép (hai mảnh riêng biệt):**

```
  N-type                   P-type
  n ≈ ND (nhiều)           p ≈ NA (nhiều)
  p ≈ ni²/ND (ít)          n ≈ ni²/NA (ít)

  EF gần CB                EF gần VB
```

**Ngay khi ghép — mất cân bằng cục bộ:**

Tại junction, có gradient nồng độ khổng lồ:
- Electron: nhiều ở n-side, ít ở p-side → electron khuếch tán sang p-side
- Hole: nhiều ở p-side, ít ở n-side → hole khuếch tán sang n-side

**Hệ quả — hình thành depletion region:**

Electron rời khỏi n-side → để lại ion $D^+$ dương cố định.
Hole rời khỏi p-side → để lại ion $A^-$ âm cố định.

```
       p-side    │    n-side
                 │
  ○ ○ ○ [A⁻A⁻A⁻]│[D⁺D⁺D⁺] ● ● ●
  ○ ○ ○ [A⁻A⁻A⁻]│[D⁺D⁺D⁺] ● ● ●
  ○ ○ ○ [A⁻A⁻A⁻]│[D⁺D⁺D⁺] ● ● ●
        ←  xp   │  xn  →
         depletion region

  ○ = hole    ● = electron
  A⁻ = acceptor ion cố định    D⁺ = donor ion cố định
```

Vùng ion cố định này — **depletion region** (vùng nghèo hạt tải) — có điện tích không cân bằng:
- P-side: điện tích âm (từ $A^-$)
- N-side: điện tích dương (từ $D^+$)

→ Tạo ra **điện trường nội** $\mathcal{E}$ hướng từ n-side sang p-side.

---

### Cân bằng Động: Drift và Diffusion Triệt tiêu

Điện trường nội tạo ra drift **ngược chiều** với diffusion:

- Electron: diffusion sang p-side ← (→) drift ngược lại từ điện trường
- Hole: diffusion sang n-side (→) ← drift ngược lại từ điện trường

Khi điện trường đủ mạnh, drift và diffusion triệt tiêu hoàn toàn:

$$J_n = J_{n,drift} + J_{n,diff} = 0$$
$$J_p = J_{p,drift} + J_{p,diff} = 0$$

Cân bằng đạt được! Không có dòng net. Đây là **thermal equilibrium**.

---

### Built-in Potential $V_{bi}$

> [!definition] Built-in Potential (Điện thế nội)
> Hiệu điện thế giữa n-side và p-side tại equilibrium, do điện tích ion trong depletion region tạo ra:
>
> $$V_{bi} = \frac{k_BT}{q}\ln\frac{N_A N_D}{n_i^2} = V_T\ln\frac{N_A N_D}{n_i^2}$$
>
> với $V_T = k_BT/q = 26$ mV ở 300 K.

**Cách hiểu:** $V_{bi}$ là "rào năng lượng" ngăn majority carrier tràn qua junction. Điều này giải thích tại sao diode không tự dẫn điện khi không có nguồn ngoài — phải áp điện áp đủ lớn để vượt qua $V_{bi}$.

Với Si ($N_A = N_D = 10^{16}$ cm$^{-3}$, $n_i = 1.5\times10^{10}$ cm$^{-3}$):

$$V_{bi} = 0.026\times\ln\frac{10^{16}\times10^{16}}{(1.5\times10^{10})^2} = 0.026\times\ln(4.4\times10^{11}) \approx 0.026\times26.8 \approx 0.70 \text{ V}$$

---

## Mathematical Formalism

### Depletion Approximation

Để tính phân bố điện trường và chiều rộng depletion, dùng **depletion approximation**:

> [!definition] Depletion Approximation
> Trong depletion region ($-x_p < x < x_n$): không có carrier tự do, chỉ có ion cố định:
>
> $$\rho(x) = \begin{cases} -qN_A & -x_p < x < 0 \\ +qN_D & 0 < x < x_n \\ 0 & \text{ngoài depletion} \end{cases}$$

---

### Phương trình Poisson → Điện trường và Điện thế

Áp dụng phương trình Poisson $d\mathcal{E}/dx = \rho/\varepsilon$:

**N-side** ($0 < x < x_n$):

$$\mathcal{E}(x) = \frac{qN_D}{\varepsilon}(x_n - x)$$

**P-side** ($-x_p < x < 0$):

$$\mathcal{E}(x) = \frac{qN_A}{\varepsilon}(x + x_p)$$

Điện trường cực đại tại $x = 0$ (junction):

$$\mathcal{E}_{max} = -\frac{qN_Dx_n}{\varepsilon} = -\frac{qN_Ax_p}{\varepsilon}$$

```
Phân bố trong depletion region:

ρ(x)                   ε(x)                  V(x)
│  +qND                │                     │       ───── Vn
│  ─────────           │ ╲                   │      ╱
│           │          │  ╲                  │     ╱
│  ─────────│──── x    │   ╲                 │    ╱
│  -qNA                │    ────── x         │   ╱
│                      │         εmax        │──╱
  -xp    0   xn                               -xp  0  xn
```

---

### Charge Neutrality → Mối quan hệ $x_p$ và $x_n$

Tổng điện tích hai phía phải bằng 0:

$$N_A x_p = N_D x_n$$

Phía nào doping **thấp hơn** thì depletion region sẽ **rộng hơn** về phía đó.

---

### Chiều rộng Depletion Region $W$

Tích phân điện trường để tìm điện thế, áp điều kiện biên $V_{bi}$:

$$\boxed{W = x_n + x_p = \sqrt{\frac{2\varepsilon V_{bi}}{q}\left(\frac{1}{N_A} + \frac{1}{N_D}\right)}}$$

Với **one-sided junction** ($N_A \gg N_D$ hoặc $N_D \gg N_A$), đơn giản hóa thành:

$$W \approx x_n \approx \sqrt{\frac{2\varepsilon V_{bi}}{qN_D}} \quad (N_A \gg N_D)$$

Depletion region mở rộng về phía **lightly doped**.

---

### Energy Band Diagram ở Equilibrium

> [!definition] Band Diagram của p-n Junction ở Equilibrium
> - **Fermi level phẳng** trên toàn junction (điều kiện equilibrium)
> - Bands **bẻ cong** trong depletion region (do điện trường nội)
> - Mức bẻ cong = $qV_{bi}$ — "rào năng lượng" cho majority carrier

```
Energy band diagram p-n junction (equilibrium):

E
│
│  p-side     depletion     n-side
│             region
│  ────── Ec                         ──── Ec
│                  ╲                ╱
│                   ╲              ╱
│  ── ── EF ── ── ── ╲── ── ── ──╱── ── EF (phẳng)
│                     ╲          ╱
│                      ╲        ╱
│  ────── Ev            ╲      ╱──── Ev
│                        ╲    ╱
│                         ╲  ╱
│                          ╲╱
└─────────────────────────────────── x
     -xp        0         xn

  Độ bẻ cong = qVbi
```

**Đọc band diagram:**
- Electron (majority) ở n-side: nhìn thấy rào cao $qV_{bi}$ để qua p-side → bị giữ lại
- Hole (majority) ở p-side: nhìn thấy rào $qV_{bi}$ (theo hướng ngược) → bị giữ lại
- Minority electron ở p-side: nếu đến depletion region → bị điện trường cuốn sang n-side
- Minority hole ở n-side: bị cuốn sang p-side

---

## Derivation — Built-in Potential từ Fermi Level

Ở thermal equilibrium, Fermi level phẳng. Từ carrier concentration:

$$n_{n0} = N_c e^{-(E_c^{(n)} - E_F)/k_BT} \approx N_D$$

$$n_{p0} = N_c e^{-(E_c^{(p)} - E_F)/k_BT} \approx \frac{n_i^2}{N_A}$$

Chia hai phương trình:

$$\frac{n_{n0}}{n_{p0}} = e^{(E_c^{(p)} - E_c^{(n)})/k_BT} = e^{qV_{bi}/k_BT}$$

(vì $E_c^{(p)} - E_c^{(n)} = qV_{bi}$ — độ lệch của band)

$$\Rightarrow V_{bi} = \frac{k_BT}{q}\ln\frac{n_{n0}}{n_{p0}} = V_T\ln\frac{N_D\cdot N_A}{n_i^2}$$

---

## Worked Problem

> [!example] Bài toán 10.1 — Tính built-in potential
>
> **Cho**: P-n junction Si với $N_A = 10^{17}$ cm$^{-3}$, $N_D = 10^{15}$ cm$^{-3}$. $n_i = 1.5\times10^{10}$ cm$^{-3}$, $T = 300$ K.
>
> **Tìm**: $V_{bi}$.

**Lời giải:**

$$V_{bi} = 0.026\times\ln\frac{10^{17}\times10^{15}}{(1.5\times10^{10})^2} = 0.026\times\ln\frac{10^{32}}{2.25\times10^{20}}$$

$$= 0.026\times\ln(4.44\times10^{11}) = 0.026\times26.8 \approx 0.697 \text{ V}$$

> [!example] Bài toán 10.2 — Chiều rộng depletion region và điện trường cực đại
>
> **Cho**: Tiếp bài 10.1. $\varepsilon_{Si} = 11.7\varepsilon_0 = 1.04\times10^{-12}$ F/cm.
>
> **Tìm**: $x_n$, $x_p$, $W$, và $\mathcal{E}_{max}$.

**Lời giải:**

Đây là one-sided junction ($N_A \gg N_D$) → depletion region mở rộng chủ yếu về n-side:

$$x_n \approx \sqrt{\frac{2\varepsilon V_{bi}}{qN_D}} = \sqrt{\frac{2\times1.04\times10^{-12}\times0.697}{1.6\times10^{-19}\times10^{15}}}$$

$$= \sqrt{\frac{1.45\times10^{-12}}{1.6\times10^{-4}}} = \sqrt{9.06\times10^{-9}} \approx 9.5\times10^{-5} \text{ cm} = 0.95 \text{ µm}$$

$$x_p = x_n\frac{N_D}{N_A} = 0.95\times\frac{10^{15}}{10^{17}} = 0.0095 \text{ µm} \approx 9.5 \text{ nm}$$

$$W = x_n + x_p \approx 0.96 \text{ µm}$$

Điện trường cực đại:

$$|\mathcal{E}_{max}| = \frac{qN_Dx_n}{\varepsilon} = \frac{1.6\times10^{-19}\times10^{15}\times9.5\times10^{-5}}{1.04\times10^{-12}} \approx 1.46\times10^4 \text{ V/cm}$$

**Nhận xét:**
- Depletion region rộng ~1 µm — mỏng hơn nhiều so với typical wafer (300 µm).
- Điện trường cực đại $\sim 14.6$ kV/cm — đủ để tạo drift mạnh cho minority carrier.
- Depletion region mở rộng gần hoàn toàn về phía n-side (ít doped hơn) — xác nhận quy tắc "depletion extends into lightly doped side."

> [!example] Bài toán 10.3 — Xác nhận không có dòng ở equilibrium
>
> **Hỏi**: Tại sao p-n junction không tự tạo ra dòng điện dù có điện trường nội?

**Giải thích:**

Có hai dòng chạy ngược chiều nhau, triệt tiêu nhau:

Trong depletion region:
- **Drift** của electron: điện trường $\mathcal{E}$ (n→p) đẩy electron *từ p sang n* (drift electron ngược chiều $\mathcal{E}$)
- **Diffusion** của electron: gradient nồng độ cao ở n-side đẩy electron *từ n sang p*

Hai dòng này bằng nhau và ngược chiều → $J_n = 0$.

Về mặt thermodynamic: **Fermi level phẳng** trên toàn hệ là điều kiện tương đương với không có dòng điện. Bất kỳ khi nào $E_F$ phẳng, drift = diffusion, không có công suất điện được tạo ra hay tiêu thụ.

---

## Summary / Key Takeaways

- P-n junction hình thành khi ghép p-type và n-type: diffusion của majority carrier → depletion region → điện trường nội.
- **Depletion region**: vùng nghèo carrier, chứa ion cố định $D^+$ (n-side) và $A^-$ (p-side).
- **Built-in potential**: $V_{bi} = V_T\ln\frac{N_AN_D}{n_i^2}$ — rào năng lượng ngăn majority carrier. Điển hình: ~0.6–0.8 V với Si.
- **Charge neutrality**: $N_Ax_p = N_Dx_n$ — depletion extends deeper into lightly doped side.
- **Depletion width**: $W \propto \sqrt{V_{bi}/N}$ — tăng khi doping giảm.
- **Band diagram**: Fermi level phẳng (equilibrium), bands bẻ cong $qV_{bi}$ trong depletion region.
- Không có dòng net vì drift = diffusion → $J_n = J_p = 0$.

---

## References

- Pierret, R. F. — *Semiconductor Device Fundamentals*, Ch. 5–6 (Prentice Hall, 1995)
- Hu, Chenming — *Modern Semiconductor Devices for Integrated Circuits*, Ch. 4 (UC Berkeley, 2009)
- MIT 6.012 — Lecture notes: p-n Junction Equilibrium (ocw.mit.edu)
- Wikipedia — p–n junction; Depletion region
