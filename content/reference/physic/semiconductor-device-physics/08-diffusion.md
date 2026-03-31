---
title: "08. Diffusion"
tags: [physics, semiconductor, device-physics, lesson-08]
aliases: [Diffusion]
created: 2026-03-27
---

> **Prerequisites**: [[07-drift|07. Drift]] — drift current, mobility; [[05-carrier-statistics|05. Carrier Statistics]] — nồng độ carrier $n$, $p$
> **Objectives**:
> - Hiểu cơ chế diffusion — vận chuyển hạt tải do gradient nồng độ
> - Viết được biểu thức diffusion current density cho electron và hole
> - Hiểu hệ số khuếch tán $D$ và quan hệ Einstein $D = \mu k_BT/q$
> - Viết và giải thích phương trình tổng dòng (drift + diffusion)
> - Hiểu tại sao ở cân bằng nhiệt không có dòng thực sự dù có cả drift lẫn diffusion

---

## Motivation

Drift giải thích dòng điện do điện trường. Nhưng trong nhiều linh kiện quan trọng — đặc biệt là **p-n junction** và **BJT** — dòng điện chủ yếu không phải do điện trường mà do **sự chênh lệch nồng độ hạt tải**.

Khi bạn doping một phần bán dẫn nhiều hơn phần kia, hạt tải sẽ tự động chảy từ chỗ đặc sang chỗ loãng — y hệt như mực khuếch tán trong nước, hay nước hoa lan ra trong không khí. Đây là **diffusion** (khuếch tán).

Hiểu diffusion là chìa khóa để hiểu tại sao diode có thể chỉnh lưu, tại sao BJT có gain, và tại sao minority carrier injection là trái tim của nhiều linh kiện bán dẫn.

---

## Physical Model

### Khuếch tán là gì?

Khuếch tán (diffusion) xảy ra khi có **gradient nồng độ** — tức là nồng độ thay đổi theo vị trí. Đây là hiện tượng thuần túy thống kê: không cần điện trường, không cần lực bên ngoài — chỉ cần chuyển động nhiệt ngẫu nhiên là đủ.

```
Hình dung trực quan:

  Nồng độ electron n(x):

  │████
  │████  ██
  │████  ████
  │████  ████  ███
  └──────────────── x
   Cao            Thấp

  → Electron khuếch tán từ trái sang phải (từ nơi đặc sang loãng)
  → Dòng diffusion electron hướng sang phải (→)
```

Cơ chế vi mô: electron chuyển động nhiệt ngẫu nhiên. Ở vùng nồng độ cao, **nhiều electron hơn** bước qua một mặt phẳng cho trước sang bên phải so với chiều ngược lại → **dòng net** sang phải.

---

### Định luật Fick thứ nhất (Fick's First Law)

> [!definition] Định luật Fick thứ nhất
> Thông lượng hạt (particle flux) tỉ lệ với gradient nồng độ và ngược chiều với gradient đó:
>
> $$\Phi = -D\frac{dn}{dx}$$
>
> với $D$ là **hệ số khuếch tán** (diffusion coefficient), đơn vị: cm²/s.
>
> Dấu âm phản ánh thực tế: hạt chảy từ nơi có $n$ cao sang thấp (ngược gradient).

---

### Diffusion Current Density

Mỗi electron mang điện tích $-e$, mỗi hole mang điện tích $+e$:

> [!definition] Diffusion Current Density
>
> $$J_{n,\text{diff}} = (-e)\cdot\Phi_n = (-e)\cdot\left(-D_n\frac{dn}{dx}\right) = qD_n\frac{dn}{dx}$$
>
> $$J_{p,\text{diff}} = (+e)\cdot\Phi_p = (+e)\cdot\left(-D_p\frac{dp}{dx}\right) = -qD_p\frac{dp}{dx}$$
>
> với $D_n$, $D_p$ là diffusion coefficient của electron và hole.

> [!warning] Dấu trong diffusion current
> Dấu của $J_n$ và $J_p$ ngược nhau dù cùng cơ chế:
> - Electron khuếch tán từ cao sang thấp (chảy theo $-\nabla n$) nhưng mang điện âm → dòng điện thực ngược chiều dịch chuyển → $J_n = qD_n\frac{dn}{dx}$ (dương khi $n$ tăng theo $x$)
> - Hole khuếch tán từ cao sang thấp → mang điện dương → dòng điện cùng chiều dịch chuyển → $J_p = -qD_p\frac{dp}{dx}$ (âm khi $p$ tăng theo $x$)

---

## Mathematical Formalism

### Tổng Current Density (Drift + Diffusion)

Trong semiconductor, cả hai cơ chế cùng tồn tại:

> [!definition] Tổng Current Density
>
> $$\boxed{J_n = qn\mu_n\mathcal{E} + qD_n\frac{dn}{dx}}$$
>
> $$\boxed{J_p = qp\mu_p\mathcal{E} - qD_p\frac{dp}{dx}}$$
>
> $$J_{\text{total}} = J_n + J_p$$

Đây là **drift-diffusion equations** — nền tảng của mô phỏng thiết bị bán dẫn hiện đại (SPICE, TCAD).

---

### Einstein Relation — Kết nối $D$ và $\mu$

Hệ số khuếch tán $D$ và mobility $\mu$ không độc lập — chúng cùng xuất phát từ chuyển động nhiệt, liên hệ bởi **quan hệ Einstein** (Einstein relation):

> [!definition] Einstein Relation
>
> $$\frac{D_n}{\mu_n} = \frac{D_p}{\mu_p} = \frac{k_BT}{q} \equiv V_T$$
>
> trong đó $V_T = k_BT/q$ gọi là **thermal voltage** (điện áp nhiệt).
>
> Ở 300 K: $V_T = \frac{0.026 \text{ eV}}{e} = 0.026 \text{ V} = 26 \text{ mV}$

Với Si ở 300 K:

| | Electron | Hole |
|--|---------|------|
| $\mu$ | 1350 cm²/(V·s) | 480 cm²/(V·s) |
| $D = \mu V_T$ | $\approx 35$ cm²/s | $\approx 12.5$ cm²/s |

---

### Tại sao không có dòng điện ở Thermal Equilibrium?

Đây là điểm tinh tế quan trọng. Trong semiconductor doped không đồng đều (ví dụ: nồng độ thay đổi theo $x$), có gradient nồng độ → có diffusion. Nhưng gradient nồng độ này kéo theo **điện trường nội** (built-in field) → có drift ngược chiều. Hai dòng triệt tiêu nhau.

**Proof ngắn gọn:**

Ở thermal equilibrium, $J_n = 0$ (không có dòng electron net). Sử dụng công thức tổng:

$$J_n = qn\mu_n\mathcal{E} + qD_n\frac{dn}{dx} = 0$$

Từ carrier concentration: $n = N_c e^{-(E_c - E_F)/k_BT}$. Khi $E_F = \text{const}$ (equilibrium), gradient nồng độ chỉ đến từ $E_c(x)$ thay đổi:

$$\frac{dn}{dx} = n \cdot \frac{e}{k_BT}\cdot\left(-\frac{dE_c}{dx}\right) \cdot \frac{1}{e} = \frac{qn}{k_BT}\mathcal{E}$$

(vì điện trường $\mathcal{E} = \frac{1}{q}\frac{dE_c}{dx}$, xem Lesson 04)

Thay vào:

$$J_n = qn\mu_n\mathcal{E} + qD_n \cdot \frac{qn}{k_BT}\mathcal{E} = qn\mathcal{E}\left(\mu_n + \frac{qD_n}{k_BT}\right)$$

Để $J_n = 0$ thì phải có:

$$\mu_n = \frac{qD_n}{k_BT} \quad \Rightarrow \quad \frac{D_n}{\mu_n} = \frac{k_BT}{q}$$

Đây chính xác là **Einstein relation** — nó không phải giả định mà là **hệ quả bắt buộc** từ điều kiện không có dòng ở cân bằng nhiệt. Drift và diffusion phải luôn tự cân bằng nhau khi không có nguồn ngoài.

> [!tip] Tóm gọn: Fermi level phẳng = không có dòng
> Ở thermal equilibrium, Fermi level $E_F$ **phẳng** (không đổi theo $x$). Bất kỳ gradient nào trong $E_c$ hay $n(x)$ đều tự động kéo theo điện trường nội sao cho drift và diffusion cân bằng nhau.
>
> Ngược lại: **khi $E_F$ không phẳng** (non-equilibrium), tức là khi có bias áp vào, sẽ có dòng điện thực.

---

## Derivation — Einstein Relation từ lý luận thống kê

Einstein (1905) đã chứng minh quan hệ này từ nguyên lý cân bằng chi tiết (detailed balance) trong hệ Boltzmann.

**Xuất phát điểm:** Tại equilibrium, ở mọi $x$: flux drift = flux diffusion (ngược chiều nhau).

Flux drift: $\Phi_{drift} = n v_d = n \mu \mathcal{E}$

Flux diffusion: $\Phi_{diff} = D\frac{dn}{dx}$

Điều kiện cân bằng: $n\mu\mathcal{E} = D\frac{dn}{dx}$

Với $n \propto e^{-U/k_BT}$ (phân bố Boltzmann, $U = -eV$), và $\mathcal{E} = -dV/dx$:

$$\frac{dn}{dx} = n \cdot \frac{e}{k_BT} \cdot \frac{dV}{dx} = n \cdot \frac{e}{k_BT} \cdot (-\mathcal{E})$$

Đây lại là:

$$n\mu\mathcal{E} = D \cdot n \cdot \frac{e\mathcal{E}}{k_BT} \quad \Rightarrow \quad D = \frac{\mu k_BT}{e} = \mu V_T$$

Kết quả này rất sâu sắc: **cùng một cơ chế scattering** vừa quyết định khả năng gia tốc của hạt dưới điện trường ($\mu$) vừa quyết định khả năng lan tỏa do chuyển động nhiệt ($D$).

---

## Worked Problem

> [!example] Bài toán 8.1 — Tính diffusion current density
>
> **Cho**: Nồng độ electron thay đổi tuyến tính: $n(x) = 10^{16} - 5\times10^{19}\cdot x$ (cm$^{-3}$), với $x$ tính bằng cm, trong khoảng $0 \leq x \leq 2\times10^{-4}$ cm = 2 µm.
>
> $D_n = 25$ cm²/s.
>
> **Tìm**: Diffusion current density $J_{n,\text{diff}}$.

**Lời giải:**

$$\frac{dn}{dx} = -5\times10^{19} \text{ cm}^{-4}$$

$$J_{n,\text{diff}} = qD_n\frac{dn}{dx} = 1.6\times10^{-19} \times 25 \times (-5\times10^{19})$$

$$= 1.6\times10^{-19} \times (-1.25\times10^{21}) = -200 \text{ A/cm}^2$$

**Nhận xét:** $J_n < 0$ nghĩa là dòng electron hướng về phía $-x$ — ngược với gradient nồng độ (electron nhiều ở $x=0$, ít ở $x=2$ µm, nên khuếch tán theo $+x$, nhưng điện tích âm làm dòng điện ngược).

> [!example] Bài toán 8.2 — Kiểm tra Einstein relation
>
> **Cho**: Measurement cho thấy $D_n = 18$ cm²/s tại 300 K. Tính $\mu_n$ theo Einstein relation.

**Lời giải:**

$$\mu_n = \frac{D_n}{V_T} = \frac{D_n}{k_BT/q} = \frac{18}{0.026} \approx 692 \text{ cm}^2/\text{V·s}$$

**Nhận xét:** Giá trị này thấp hơn giá trị intrinsic silicon ($\sim 1350$) vì mẫu có thể có doping cao hoặc nhiều defect — cả hai đều giảm $\mu$.

> [!example] Bài toán 8.3 — Dòng tổng trong p-n junction (preview)
>
> **Cho**: Gần depletion region của một p-n junction, minority electron trong vùng p có profile:
>
> $$n_p(x) = n_{p0} + \Delta n \cdot e^{-x/L_n}$$
>
> với $n_{p0} = 10^4$ cm$^{-3}$, $\Delta n = 10^{12}$ cm$^{-3}$, $L_n = 5$ µm, $D_n = 25$ cm²/s.
>
> **Tìm**: Diffusion current tại $x = 0$.

**Lời giải:**

$$\frac{dn_p}{dx}\bigg|_{x=0} = \Delta n \cdot \left(-\frac{1}{L_n}\right) = -\frac{10^{12}}{5\times10^{-4}} = -2\times10^{15} \text{ cm}^{-4}$$

$$J_{n,\text{diff}}\bigg|_{x=0} = qD_n\frac{dn_p}{dx} = 1.6\times10^{-19}\times25\times(-2\times10^{15}) = -8 \text{ A/cm}^2$$

Đây chính là dạng profile điển hình của minority carrier trong p-n junction dưới forward bias — sẽ được phân tích chi tiết ở Lesson 11!

---

## Summary / Key Takeaways

- **Diffusion** là vận chuyển hạt tải do **gradient nồng độ** — không cần điện trường, chỉ cần chuyển động nhiệt ngẫu nhiên.
- **Định luật Fick**: flux = $-D\frac{dn}{dx}$ — hạt chảy từ nơi nồng độ cao sang thấp.
- **Diffusion current**: $J_{n,\text{diff}} = qD_n\frac{dn}{dx}$; $J_{p,\text{diff}} = -qD_p\frac{dp}{dx}$.
- **Tổng current**: drift + diffusion — đây là phương trình nền tảng của mọi mô phỏng thiết bị.
- **Einstein relation**: $D = \mu V_T = \mu k_BT/q$ — drift và diffusion có cùng nguồn gốc (scattering), nên liên hệ với nhau.
- **Ở thermal equilibrium**: $E_F$ phẳng → drift và diffusion tự triệt tiêu nhau → không có dòng thực.
- **Thermal voltage**: $V_T = k_BT/q \approx 26$ mV ở 300 K — xuất hiện khắp nơi trong device physics.

---

## References

- Pierret, R. F. — *Semiconductor Device Fundamentals*, Ch. 3 (Prentice Hall, 1995)
- MIT 6.012 — Lecture 3: Carrier Transport II (ocw.mit.edu/6-012-SP07)
- Hu, Chenming — *Modern Semiconductor Devices for Integrated Circuits*, Ch. 2 (UC Berkeley, 2009)
- Wikipedia — Diffusion current; Einstein relation (kinetic theory)
