---
title: "12. Metal-Semiconductor Junction"
tags: [physics, semiconductor, device-physics, lesson-12]
aliases: [Metal-Semiconductor Junction]
created: 2026-03-27
---

> **Prerequisites**: [[10-pn-junction-equilibrium|10. p-n Junction Equilibrium]] — depletion region, built-in potential, band diagram; [[04-energy-band-theory|04. Energy Band Theory]] — Fermi level, work function
> **Objectives**:
> - Hiểu work function và electron affinity là gì
> - Giải thích cơ chế hình thành Schottky barrier khi kim loại tiếp xúc bán dẫn
> - Phân biệt Schottky contact (rectifying) và ohmic contact
> - Đọc band diagram của metal-semiconductor junction
> - Hiểu tại sao Schottky diode nhanh hơn p-n junction diode

---

## Motivation

Bất kỳ linh kiện bán dẫn nào cũng phải kết nối với thế giới bên ngoài qua **contact kim loại** — dây điện, pad hàn, hay interconnect trong IC. Tưởng chừng đơn giản, nhưng tiếp xúc kim loại-bán dẫn (metal-semiconductor junction) có thể hoạt động theo hai cách hoàn toàn khác nhau:

- **Schottky contact** (tiếp xúc chỉnh lưu): hành xử như một diode — cho dòng chạy một chiều. Dùng làm Schottky diode trong RF và power electronics.
- **Ohmic contact** (tiếp xúc thuần trở): điện trở thấp, dòng chạy hai chiều tự do. Đây là contact "lý tưởng" cần thiết ở nguồn và cực máng của MOSFET.

Hiểu hai loại này — và cách kiểm soát chúng — là kỹ năng thiết kế linh kiện thiết yếu.

---

## Physical Model

### Work Function và Electron Affinity

Trước hết cần hai khái niệm năng lượng:

> [!definition] Work Function $\phi$ (Công thoát)
> Năng lượng tối thiểu để đưa một electron từ **Fermi level** ra ngoài vật liệu (ra chân không):
>
> $$\phi = E_{vac} - E_F$$
>
> Đơn vị: eV. Mỗi vật liệu có $\phi$ đặc trưng riêng.
>
> Ví dụ: Al: 4.1 eV, Au: 5.1 eV, Pt: 5.65 eV, n-Si (lightly doped): ~4.05 eV

> [!definition] Electron Affinity $\chi$ (Ái lực electron)
> Năng lượng để đưa electron từ **đáy conduction band** ra chân không:
>
> $$\chi = E_{vac} - E_c$$
>
> $\chi$ là tính chất **của vật liệu bán dẫn**, không phụ thuộc doping. Si: $\chi = 4.05$ eV.

Mối liên hệ: $\phi_s = \chi + (E_c - E_F)$ — work function bán dẫn phụ thuộc doping vì $E_F$ thay đổi.

---

### Hình thành Schottky Barrier

Xét kim loại (work function $\phi_m$) tiếp xúc với n-type semiconductor (work function $\phi_s$), với $\phi_m > \phi_s$:

**Trước khi tiếp xúc:**

```
Kim loại                    n-type Si

Evac ────────────────────── Evac
      ↕ φm                         ↕ χ
      ↕                    Ec ────
      ↕           ↕ φs      ·  ·  ·  ← EF gần CB
EF ───                     EF ────
                            Ev ────
```

**Sau khi tiếp xúc — Fermi level cân bằng:**

Vì $\phi_m > \phi_s$: Fermi level kim loại *thấp hơn* Fermi level bán dẫn → electron chảy từ bán dẫn sang kim loại cho đến khi $E_F$ bằng nhau.

Kết quả:
- Bề mặt bán dẫn mất electron → hình thành **depletion region** (giống p-n junction)
- Kim loại tích điện âm (nhận electron)
- Bán dẫn gần bề mặt tích điện dương (do donor ion $D^+$)
- **Bands bẻ cong** lên phía bề mặt bán dẫn

> [!definition] Schottky Barrier Height $\phi_B$
>
> $$\phi_B = \phi_m - \chi$$
>
> Đây là rào năng lượng mà electron trong kim loại phải vượt qua để vào CB của bán dẫn.
>
> Built-in potential:
>
> $$V_{bi} = \phi_m - \phi_s = \phi_B - (E_c - E_F)/q$$

```
Band diagram Schottky contact (φm > φs, n-type):

E │
  │              Schottky barrier φB
  │  Metal  ←───────────────────→
  │   ─── EF (kim loại)      ╲
  │                            ╲── Ec
  │          qVbi               ╲
  │                    EF ─ ─ ─ ─╲─ (bán dẫn xa)
  │                               ╲
  │                            ─── Ev
  └────────────────────────────── x
        bề mặt tiếp xúc
```

---

### Schottky Contact vs. Ohmic Contact

Điều kiện hình thành hai loại:

**N-type semiconductor:**

| Điều kiện | Loại tiếp xúc | Cơ chế |
|-----------|--------------|--------|
| $\phi_m > \phi_s$ | Schottky (rectifying) | Depletion region, rào thế |
| $\phi_m < \phi_s$ | Ohmic | Accumulation layer, không có rào |

**P-type semiconductor:** điều kiện ngược lại ($\phi_m < \phi_s$ → Schottky).

---

### Ohmic Contact — Accumulation Layer

Khi $\phi_m < \phi_s$ với n-type: Fermi level kim loại *cao hơn* bán dẫn → electron chảy **từ kim loại vào bán dẫn** → tích lũy electron ở bề mặt bán dẫn (**accumulation layer**).

```
Band diagram Ohmic contact (φm < φs, n-type):

E │
  │   Metal    Semiconductor
  │             ╱── Ec (bẻ cong xuống)
  │   ─── EF ──╱──── EF (bán dẫn)
  │            ╱
  │           ╱── Ev
  └────────────── x

  Bands bẻ cong xuống → nhiều electron hơn ở bề mặt
  → tiếp xúc điện trở thấp, dòng chạy dễ cả hai chiều
```

Trong thực tế, **ohmic contact được tạo bằng cách doping cực cao** ($N_D > 10^{19}$ cm$^{-3}$) tại bề mặt tiếp xúc. Doping cao làm depletion region mỏng đến mức electron có thể **tunnel thẳng qua** → điện trở rất thấp.

---

## Mathematical Formalism

### Depletion Width của Schottky Contact

Giống p-n junction, áp dụng depletion approximation:

$$W = \sqrt{\frac{2\varepsilon V_{bi}}{qN_D}}$$

Vì không có p-side, toàn bộ depletion nằm trong bán dẫn (giống one-sided p-n junction với p-side là kim loại "vô hạn" doping).

---

### Dòng Schottky Diode — Thermionic Emission

Khác với p-n junction (minority carrier diffusion), cơ chế dẫn điện chính trong Schottky diode là **thermionic emission** — electron trong kim loại có đủ năng lượng nhiệt để bay qua Schottky barrier vào bán dẫn.

> [!definition] Thermionic Emission Current
>
> $$J = A^*T^2 e^{-\phi_B/k_BT}\left(e^{V/V_T} - 1\right) = J_0\left(e^{V/V_T} - 1\right)$$
>
> với $A^*$ là Richardson constant (phụ thuộc vật liệu kim loại).

Dạng toán học giống hệt Shockley equation, nhưng cơ chế vật lý **hoàn toàn khác** — là majority carrier (electron trong kim loại) vượt qua rào, không phải minority carrier injection.

---

### Tại sao Schottky Diode Nhanh Hơn p-n Junction?

> [!tip] Schottky vs. p-n Junction
>
> | Tính chất | Schottky Diode | p-n Junction Diode |
> |-----------|---------------|-------------------|
> | Cơ chế | Thermionic emission (majority carrier) | Minority carrier diffusion |
> | Reverse recovery time | **Rất ngắn** (~ps) | Dài hơn (~ns–µs) |
> | Forward voltage | **Thấp hơn** (~0.2–0.4 V cho Si) | ~0.6–0.7 V |
> | Reverse leakage | Cao hơn | Thấp hơn |
> | Ứng dụng | RF, power supply, fast rectifier | General purpose |
>
> **Lý do Schottky nhanh hơn:** không có minority carrier được lưu trữ trong vùng trung hòa → khi ngắt forward bias, không cần thời gian "rút" minority carrier ra (không có reverse recovery) → switching rực rực.

---

## Worked Problem

> [!example] Bài toán 12.1 — Tính Schottky barrier height
>
> **Cho**: Kim loại tungsten (W, $\phi_m = 4.55$ eV) tiếp xúc với n-type Si ($\chi = 4.05$ eV, $N_D = 10^{16}$ cm$^{-3}$, $n_i = 1.5\times10^{10}$ cm$^{-3}$, $T = 300$ K).
>
> **Tìm**: $\phi_B$, loại tiếp xúc (Schottky hay ohmic), và $V_{bi}$.

**Lời giải:**

$$\phi_B = \phi_m - \chi = 4.55 - 4.05 = 0.50 \text{ eV}$$

Tính $\phi_s$: cần tính $E_c - E_F$ trong n-type Si:

$$E_c - E_F = k_BT\ln\frac{N_c}{N_D} = 0.026\times\ln\frac{2.8\times10^{19}}{10^{16}} = 0.026\times8.24 = 0.214 \text{ eV}$$

$$\phi_s = \chi + (E_c - E_F) = 4.05 + 0.214 = 4.264 \text{ eV}$$

Vì $\phi_m = 4.55 > \phi_s = 4.264$ → **Schottky contact** (rectifying).

$$V_{bi} = \phi_m - \phi_s = 4.55 - 4.264 = 0.286 \text{ V}$$

> [!example] Bài toán 12.2 — Depletion width của Schottky contact
>
> **Cho**: Tiếp bài 12.1. $\varepsilon_{Si} = 1.04\times10^{-12}$ F/cm.
>
> **Tìm**: Chiều rộng depletion region $W$ ở equilibrium.

**Lời giải:**

$$W = \sqrt{\frac{2\varepsilon V_{bi}}{qN_D}} = \sqrt{\frac{2\times1.04\times10^{-12}\times0.286}{1.6\times10^{-19}\times10^{16}}}$$

$$= \sqrt{\frac{5.95\times10^{-13}}{1.6\times10^{-3}}} = \sqrt{3.72\times10^{-10}} \approx 1.93\times10^{-5} \text{ cm} = 193 \text{ nm}$$

**Nhận xét:** $W \approx 193$ nm — mỏng hơn p-n junction điển hình (vài µm) vì $V_{bi}$ nhỏ hơn.

> [!example] Bài toán 12.3 — Thiết kế ohmic contact
>
> **Hỏi**: Tại sao việc doping cực cao ($N_D^+ > 10^{19}$ cm$^{-3}$) tại vùng tiếp xúc làm cho tiếp xúc trở nên ohmic dù $\phi_m > \phi_s$?

**Giải thích:**

Khi $N_D$ rất cao, depletion width trở nên cực nhỏ:

$$W \propto \frac{1}{\sqrt{N_D}} \xrightarrow{N_D \to 10^{20}} W \sim 1\text{–}5 \text{ nm}$$

Depletion width chỉ vài nm → electron có thể **tunnel (xuyên hầm)** qua rào thế bằng hiệu ứng lượng tử. Xác suất tunnel tăng theo hàm mũ khi $W$ giảm → điện trở tiếp xúc cực thấp.

Đây là lý do trong CMOS fabrication, vùng source/drain được doped $10^{19}$–$10^{20}$ cm$^{-3}$ trước khi phủ kim loại — để đảm bảo ohmic contact.

---

## Summary / Key Takeaways

- **Work function** $\phi$: năng lượng để đưa electron từ Fermi level ra chân không. **Electron affinity** $\chi = E_{vac} - E_c$ — tính chất của bán dẫn, không phụ thuộc doping.
- **Schottky contact** ($\phi_m > \phi_s$ với n-type): hình thành depletion region và Schottky barrier $\phi_B = \phi_m - \chi$. Hoạt động như diode.
- **Ohmic contact** ($\phi_m < \phi_s$ với n-type hoặc doping cực cao): không có rào, electron tunnel qua → điện trở thấp, dòng hai chiều.
- **Schottky diode**: dẫn điện qua thermionic emission (majority carrier) → nhanh, $V_f$ thấp, không có reverse recovery.
- Trong CMOS: ohmic contact đạt được bằng **doping cực cao** ($>10^{19}$ cm$^{-3}$) tại source/drain.

---

## References

- Pierret, R. F. — *Semiconductor Device Fundamentals*, Ch. 14 (Prentice Hall, 1995)
- Hu, Chenming — *Modern Semiconductor Devices for Integrated Circuits*, Ch. 3 (UC Berkeley, 2009)
- MIT 6.012 — Lecture notes: Metal-Semiconductor Junction (ocw.mit.edu)
- Streetman & Banerjee — *Solid State Electronic Devices*, Ch. 5 (Pearson, 2015)
