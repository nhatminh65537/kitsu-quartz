---
title: "09. Generation & Recombination"
tags: [physics, semiconductor, device-physics, lesson-09]
aliases: [Generation and Recombination]
created: 2026-03-27
---

> **Prerequisites**: [[07-drift|07. Drift]], [[08-diffusion|08. Diffusion]] — drift-diffusion equations; [[05-carrier-statistics|05. Carrier Statistics]] — $n_i$, mass action law
> **Objectives**:
> - Hiểu generation và recombination là gì và tại sao chúng quan trọng
> - Phân biệt ba cơ chế recombination chính: band-to-band, SRH, Auger
> - Hiểu minority carrier lifetime $\tau$ và diffusion length $L$
> - Viết và giải phương trình continuity equation cho minority carrier
> - Kết nối với hoạt động của diode, solar cell, và BJT

---

## Motivation

Drift và diffusion mô tả hạt tải *đã tồn tại* di chuyển như thế nào. Nhưng thực tế sinh động hơn: hạt tải liên tục được **tạo ra** (generation) và **biến mất** (recombination).

- Mỗi khi photon năng lượng cao đập vào silicon → tạo ra cặp electron-hole mới
- Mỗi khi electron gặp hole → chúng tái kết hợp và biến mất
- Ở thermal equilibrium, hai tốc độ này cân bằng nhau → $np = n_i^2$
- Khi mất cân bằng (có ánh sáng, có điện áp) → thặng dư carrier xuất hiện rồi dần dần tắt đi

Thời gian để carrier thặng dư tắt đi — **minority carrier lifetime** $\tau$ — là thông số thiết kế quan trọng bậc nhất trong solar cell, photodiode, và BJT.

---

## Physical Model

### Generation (Tạo ra Carrier)

**Thermal generation:** Nhiệt năng $k_BT$ phá vỡ liên kết cộng hóa trị → tạo cặp electron-hole. Xảy ra liên tục ở mọi $T > 0$.

**Optical generation (photo-generation):** Photon có năng lượng $E_{ph} \geq E_g$ bị hấp thụ → kích thích electron từ VB lên CB. Đây là nguyên lý hoạt động của **solar cell** và **photodiode**.

**Impact ionization:** Carrier có năng lượng cao va chạm với mạng tinh thể → tạo thêm cặp e-h mới. Xảy ra ở điện trường rất cao → nền tảng của avalanche photodiode.

---

### Recombination (Tái Kết Hợp)

Khi hệ có carrier dư ($np > n_i^2$), recombination xảy ra để đưa hệ về cân bằng. Có ba cơ chế chính:

#### 1. Band-to-band (Radiative) Recombination

Electron trong CB rơi thẳng xuống VB → tái kết hợp với hole, giải phóng năng lượng dưới dạng **photon**.

```
CB ────● (electron)
       │ ↓ phát ra photon hν ≈ Eg
VB ────○ (hole)
```

> [!definition] Band-to-band Recombination
> Xảy ra mạnh trong **direct band gap** (GaAs, GaN) vì không cần thay đổi momentum.
> Trong **indirect band gap** (Si): cần thêm phonon → xác suất thấp hơn nhiều → $\tau_{radiative}$ rất dài trong Si.
>
> Đây là cơ chế phát sáng trong **LED** và **laser diode**.

---

#### 2. SRH (Shockley-Read-Hall) Recombination

Đây là cơ chế **dominant** trong silicon và hầu hết indirect band gap semiconductor.

Các defect, tạp chất, hoặc sai hỏng tinh thể tạo ra các **mức bẫy** (trap levels) nằm trong band gap. Recombination xảy ra qua hai bước:

```
CB ──●────────────────
     │  ① electron bị bẫy
     │  vào trap level Et
     ▼
    [Et] ──────── (trap)
     │  ② hole bị bẫy
     │  (hoặc electron phát ra)
     ▼
VB ──○────────────────
```

> [!definition] SRH Recombination
> Hiệu quả nhất khi trap level nằm **giữa band gap** ($E_t \approx E_i$). Trap ở giữa gap là "nơi gặp gỡ" tối ưu cho cả electron (từ CB xuống) và hole (từ VB lên).
>
> Tốc độ SRH recombination (low-level injection trong n-type):
>
> $$R_{SRH} \approx \frac{\Delta p}{\tau_p}$$
>
> với $\Delta p$ là nồng độ hole thặng dư và $\tau_p$ là **minority carrier lifetime**.

Tạp chất nguy hiểm nhất là những gì tạo mid-gap trap: **gold (Au)** và **copper (Cu)** trong silicon. Đây là lý do silicon phải cực kỳ tinh khiết (tạp chất <1 ppb) trong chế tạo chip.

---

#### 3. Auger Recombination

Quá trình 3 hạt: khi electron tái kết hợp với hole, năng lượng được chuyển sang một **hạt thứ ba** (electron hoặc hole khác) thay vì phát ra photon. Hạt thứ ba sau đó mất năng lượng qua phonon (nhiệt).

> [!definition] Auger Recombination
> Tỉ lệ Auger $R_{Auger} \propto n^2p$ (cho electron) hoặc $\propto np^2$ (cho hole) → **quan trọng ở doping cao** hoặc **injection level cao**.
>
> Là giới hạn hiệu suất trong: LED hiệu suất cao, laser bán dẫn, và silicon solar cell dưới ánh sáng mặt trời tập trung cao.

---

### Minority Carrier Lifetime $\tau$

> [!definition] Minority Carrier Lifetime
> $\tau$ là thời gian trung bình để một minority carrier thặng dư tái kết hợp:
>
> $$R = \frac{\Delta n}{\tau_n} \quad \text{(trong p-type)} \qquad R = \frac{\Delta p}{\tau_p} \quad \text{(trong n-type)}$$
>
> Sau khi nguồn kích thích tắt, nồng độ minority carrier thặng dư giảm theo hàm mũ:
>
> $$\Delta n(t) = \Delta n(0)\, e^{-t/\tau_n}$$

Với silicon:

| Vật liệu | Typical $\tau$ |
|---------|---------------|
| Si điện tử cấp (high purity) | 1–10 ms |
| Si solar cell (thực tế) | 1–100 µs |
| Si với Au doping | < 1 ns |
| GaAs | 1–10 ns |

**Ý nghĩa thiết kế:**
- **Solar cell / BJT**: muốn $\tau$ *dài* → minority carrier di chuyển xa trước khi tái kết hợp → thu được nhiều
- **Fast switching diode**: muốn $\tau$ *ngắn* → carrier biến mất nhanh → diode ngắt nhanh

---

### Diffusion Length $L$

Từ $\tau$ và $D$, định nghĩa **diffusion length** (quãng đường khuếch tán trung bình trước khi tái kết hợp):

> [!definition] Minority Carrier Diffusion Length
>
> $$L_n = \sqrt{D_n\tau_n} \quad \text{(electron trong p-type)}$$
>
> $$L_p = \sqrt{D_p\tau_p} \quad \text{(hole trong n-type)}$$

Với Si solar cell điển hình: $D_n \approx 25$ cm²/s, $\tau_n \approx 10$ µs → $L_n = \sqrt{25 \times 10^{-5}} \approx 0.5$ mm.

Diffusion length là thông số cốt lõi của p-n junction — nó quyết định diode equation (Lesson 11).

---

## Mathematical Formalism

### Continuity Equation

Phương trình continuity kết hợp transport (drift + diffusion) với G-R:

> [!definition] Continuity Equation (Minority Carrier)
>
> Cho **minority electron** trong p-type:
>
> $$\frac{\partial n}{\partial t} = G - R + \frac{1}{q}\frac{\partial J_n}{\partial x}$$
>
> Khai triển $J_n$ (drift + diffusion) và dùng $R = \Delta n/\tau_n$:
>
> $$\frac{\partial(\Delta n)}{\partial t} = G_L - \frac{\Delta n}{\tau_n} + D_n\frac{\partial^2(\Delta n)}{\partial x^2} + \mu_n n\frac{\partial\mathcal{E}}{\partial x}$$
>
> Trong **low-field region** (trường điện yếu, như trong vùng trung hòa của p-n junction), bỏ drift:
>
> $$\frac{\partial(\Delta n)}{\partial t} = G_L - \frac{\Delta n}{\tau_n} + D_n\frac{\partial^2(\Delta n)}{\partial x^2}$$

Đây là **minority carrier diffusion equation** — sẽ dùng trực tiếp để giải p-n junction ở Lesson 11.

---

### Steady-state với không có nguồn sáng

Đặt $G_L = 0$, $\partial/\partial t = 0$:

$$D_n\frac{d^2(\Delta n)}{dx^2} = \frac{\Delta n}{\tau_n}$$

Nghiệm:

$$\Delta n(x) = A\,e^{-x/L_n} + B\,e^{+x/L_n}$$

với $L_n = \sqrt{D_n\tau_n}$. Điều kiện biên quyết định $A$, $B$.

Profile $e^{-x/L_n}$ là **profile minority carrier điển hình** trong vùng trung hòa của diode — giảm dần với hằng số khoảng cách $L_n$.

---

## Derivation — Tốc độ Recombination từ Nguyên lý Cân bằng Chi tiết

Tại thermal equilibrium: $G = R_0$ (cân bằng). Khi có excess carrier $\Delta n = \Delta p$:

- Generation rate $G$ không đổi (không phụ thuộc vào $n$, $p$ với thermal generation)
- Recombination rate tăng: $R = R_0 + \Delta R$

Với SRH ở low-level injection (minority carrier $\ll$ majority carrier):

$$R - G = \frac{\Delta p}{\tau_p} \qquad \text{(trong n-type, minority = hole)}$$

Đây là **net recombination rate** — thứ xuất hiện trong continuity equation.

**Ý nghĩa:** Chỉ *excess* carrier mới dẫn đến net recombination. Equilibrium carrier không tái kết hợp net vì mọi recombination đều được bù bởi generation tương đương.

---

## Worked Problem

> [!example] Bài toán 9.1 — Minority carrier decay
>
> **Cho**: P-type Si với $N_A = 10^{16}$ cm$^{-3}$, $\tau_n = 1$ µs. Tại $t = 0$, một xung ánh sáng tạo ra $\Delta n(0) = 10^{14}$ cm$^{-3}$ (excess electron).
>
> **Tìm**: $\Delta n(t)$ và thời gian để excess giảm còn 1% ban đầu.

**Lời giải:**

Kiểm tra low-level injection: $\Delta n = 10^{14} \ll N_A = 10^{16}$ ✓

$$\Delta n(t) = 10^{14}\, e^{-t/10^{-6}} \text{ cm}^{-3}$$

Khi $\Delta n = 0.01 \times 10^{14} = 10^{12}$:

$$10^{12} = 10^{14}\, e^{-t/\tau_n} \Rightarrow e^{-t/\tau_n} = 0.01 \Rightarrow t = \tau_n\ln(100) = 10^{-6}\times 4.6 \approx 4.6\text{ µs}$$

> [!example] Bài toán 9.2 — Diffusion length
>
> **Cho**: N-type Si với $D_p = 12$ cm²/s, $\tau_p = 5$ µs.
>
> **Tìm**: $L_p$ và nhận xét ý nghĩa với thiết kế p-n junction.

**Lời giải:**

$$L_p = \sqrt{D_p\tau_p} = \sqrt{12 \times 5\times10^{-6}} = \sqrt{6\times10^{-5}} \approx 7.7 \times 10^{-3} \text{ cm} = 77 \text{ µm}$$

**Nhận xét:** Minority hole di chuyển được ~77 µm trước khi tái kết hợp. Trong p-n junction, nếu vùng trung hòa n-type dày hơn $L_p$, hầu hết hole bị inject vào sẽ tái kết hợp trước khi đến contact → đây là "long diode". Nếu vùng mỏng hơn $L_p$ → "short diode" với profile gần tuyến tính.

> [!example] Bài toán 9.3 — Steady-state minority carrier profile
>
> **Cho**: P-type Si bán vô hạn ($x \geq 0$). Bề mặt $x = 0$ được chiếu sáng tạo ra $\Delta n(0) = 10^{13}$ cm$^{-3}$. Không có nguồn sáng trong bulk. $L_n = 50$ µm.
>
> **Tìm**: $\Delta n(x)$ trong steady-state.

**Lời giải:**

Nghiệm tổng quát: $\Delta n(x) = Ae^{-x/L_n} + Be^{x/L_n}$

Điều kiện biên:
- $x \to \infty$: $\Delta n \to 0$ → $B = 0$
- $x = 0$: $\Delta n(0) = 10^{13}$ → $A = 10^{13}$

$$\Delta n(x) = 10^{13}\, e^{-x/50\,\mu\text{m}} \text{ cm}^{-3}$$

Profile giảm mũ từ bề mặt vào sâu trong bulk — đây chính xác là dạng profile minority carrier trong p-n junction forward bias!

---

## Summary / Key Takeaways

- **Generation**: tạo cặp e-h — do nhiệt, ánh sáng, hoặc va chạm năng lượng cao.
- **Recombination**: electron gặp hole → biến mất. Ba cơ chế: band-to-band (phát photon, cần direct gap), **SRH** (qua trap level, dominant trong Si), Auger (3 hạt, dominant ở injection cao).
- **SRH** hiệu quả nhất khi trap ở giữa gap → tạp chất Au, Cu cực nguy hiểm với Si.
- **Minority carrier lifetime** $\tau$: thời gian sống trung bình — dài tốt cho solar cell/BJT, ngắn tốt cho fast switching.
- **Diffusion length** $L = \sqrt{D\tau}$: quãng đường trước khi tái kết hợp — thông số thiết kế cốt lõi của p-n junction.
- **Continuity equation**: drift + diffusion + G-R → phương trình hoàn chỉnh mô tả dynamics của minority carrier.

---

## References

- Pierret, R. F. — *Semiconductor Device Fundamentals*, Ch. 5 (Prentice Hall, 1995)
- Hu, Chenming — *Modern Semiconductor Devices for Integrated Circuits*, Ch. 2 (UC Berkeley, 2009)
- Wikipedia — Carrier generation and recombination; Shockley–Read–Hall recombination
- MIT 6.012 — Lecture notes: Generation-Recombination (ocw.mit.edu)
