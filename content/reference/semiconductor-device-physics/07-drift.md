---
title: "07. Drift"
tags: [physics, semiconductor, device-physics, lesson-07]
aliases: [Drift]
created: 2026-03-27
---

> **Prerequisites**: [[06-doping|06. Doping]] — nồng độ electron $n$ và hole $p$, majority/minority carrier; [[01-classical-physics-review|01. Classical Physics Review]] — điện trường, lực Coulomb
> **Objectives**:
> - Hiểu cơ chế drift — chuyển động của hạt tải dưới tác dụng của điện trường
> - Nắm khái niệm mobility $\mu$ và các yếu tố ảnh hưởng đến nó
> - Tính drift current density cho electron và hole
> - Hiểu velocity saturation ở điện trường cao
> - Kết nối với Ohm's law quen thuộc ở cấp độ vi mô

---

## Motivation

Bạn đã biết doping tạo ra electron tự do và hole. Nhưng tạo ra hạt tải chỉ là điều kiện cần — muốn có dòng điện, các hạt đó phải **di chuyển có hướng**.

Trong semiconductor, có hai cơ chế vận chuyển hạt tải: **drift** (do điện trường) và **diffusion** (do gradient nồng độ). Lesson này tập trung vào drift — thứ gần nhất với Ohm's law quen thuộc, nhưng được hiểu ở cấp độ vi mô sâu hơn nhiều.

Hiểu drift là hiểu tại sao silicon có điện trở, tại sao MOSFET có thể điều khiển dòng điện, và tại sao transistor ngày nay không thể thu nhỏ vô hạn.

---

## Physical Model

### Chuyển động nhiệt và Scattering

Ở nhiệt độ phòng, electron trong silicon **không đứng yên** — chúng chuyển động nhiệt (thermal motion) với vận tốc trung bình rất lớn:

$$v_{th} \approx \sqrt{\frac{3k_BT}{m_e^*}} \approx 10^7 \text{ cm/s} \quad \text{(ở 300 K)}$$

Tuy nhiên, chuyển động nhiệt này là **ngẫu nhiên** — không có hướng ưu tiên → không tạo ra dòng điện thuần. Electron liên tục va chạm với:

- **Phonon** (dao động mạng tinh thể): tán xạ phonon (phonon scattering), tăng mạnh khi nhiệt độ tăng
- **Impurity ion** ($D^+$, $A^-$): tán xạ ionized impurity, tăng khi doping tăng

```
Chuyển động của electron không có điện trường:

   ╭──╮  ╭──╮
  ╱   ╰──╯  ╲       ← zigzag ngẫu nhiên vì scattering
 ╱             ╲    ← không có hướng net
╱               ╲───
```

---

### Drift dưới tác dụng của Điện trường

Khi có điện trường $\mathcal{E}$, lực điện tác dụng lên hạt tải:

- Electron (điện tích $-e$): $\mathbf{F} = -e\mathbf{\mathcal{E}}$ — ngược chiều $\mathbf{\mathcal{E}}$
- Hole (điện tích $+e$): $\mathbf{F} = +e\mathbf{\mathcal{E}}$ — cùng chiều $\mathbf{\mathcal{E}}$

Lực này không gia tốc hạt mãi mãi — scattering liên tục làm hạt mất momentum. Kết quả là hạt đạt **vận tốc trung bình ổn định** (steady-state drift velocity):

```
Electron có điện trường (hướng →):

   ╭──╮  ╭──╮
  ╱   ╰──╯  ╲←─╮    ← zigzag vẫn còn
 ╱             ╲    ← nhưng có drift nhỏ sang trái (←)
╱               ╲───  vì electron chịu lực ngược chiều E

Drift velocity electron: vd nhỏ ≪ vth
```

> [!definition] Drift Velocity và Mobility
> Drift velocity tỉ lệ với điện trường (ở trường yếu):
>
> $$v_{d,n} = -\mu_n \mathcal{E} \qquad \text{(electron — ngược chiều } \mathcal{E})$$
>
> $$v_{d,p} = +\mu_p \mathcal{E} \qquad \text{(hole — cùng chiều } \mathcal{E})$$
>
> Hệ số tỉ lệ $\mu$ gọi là **mobility** (độ linh động), đơn vị: cm²/(V·s).

Mobility là thước đo **dễ gia tốc** của hạt tải trong vật liệu — phụ thuộc vào effective mass và thời gian giữa hai lần scattering.

---

### Giá trị Mobility trong Silicon

Từ mô hình đơn giản (Drude model):

$$\mu = \frac{e\tau}{m^*}$$

với $\tau$ là **mean free time** (thời gian trung bình giữa hai lần scattering). Ở room temp:

| Carrier | Mobility trong Si (300 K) |
|---------|--------------------------|
| Electron ($\mu_n$) | $\approx 1350$ cm²/(V·s) |
| Hole ($\mu_p$) | $\approx 480$ cm²/(V·s) |

Electron di chuyển nhanh hơn hole vì $m_e^* < m_h^*$ — electron "nhẹ" hơn trong tinh thể Si.

**Các yếu tố làm giảm mobility:**

```
Mobility ↓ khi:

  1. Nhiệt độ tăng   →   phonon nhiều hơn   →   scattering nhiều hơn
  2. Doping tăng     →   ion nhiều hơn      →   scattering nhiều hơn

  µ(T) ∝ T^(-3/2) (phonon scattering regime)
  µ(ND) ↓ khi ND > ~10^17 cm^-3
```

---

### Drift Current Density

Dòng điện là sự dịch chuyển của điện tích. Mật độ dòng (current density) do drift:

> [!definition] Drift Current Density
>
> $$J_{n,\text{drift}} = (-e) \cdot n \cdot v_{d,n} = (-e) \cdot n \cdot (-\mu_n \mathcal{E}) = qn\mu_n\mathcal{E}$$
>
> $$J_{p,\text{drift}} = (+e) \cdot p \cdot v_{d,p} = qp\mu_p\mathcal{E}$$
>
> Tổng drift current density:
>
> $$\boxed{J_{\text{drift}} = q(n\mu_n + p\mu_p)\mathcal{E} = \sigma\mathcal{E}}$$
>
> trong đó $\sigma = q(n\mu_n + p\mu_p)$ là **conductivity** (độ dẫn điện), đơn vị: (Ω·cm)$^{-1}$.

> [!tip] Kết nối với Ohm's Law
> $J = \sigma\mathcal{E}$ chính là **Ohm's law ở cấp độ vi mô**. Còn dạng quen thuộc $V = IR$ là tích phân của nó theo chiều dài và tiết diện của dây dẫn.
>
> Resistivity: $\rho = 1/\sigma = 1/[q(n\mu_n + p\mu_p)]$ (đơn vị: Ω·cm)

---

## Mathematical Formalism

### Velocity Saturation ở Điện trường cao

Ở điện trường thấp, $v_d \propto \mathcal{E}$ là tuyến tính. Nhưng khi $\mathcal{E}$ đủ lớn, hạt tải không thể tiếp tục gia tốc vì tần suất scattering tăng theo — vận tốc tiến đến **vận tốc bão hòa** (saturation velocity) $v_{sat}$:

```
vd (cm/s)
│
│            ─ ─ ─ ─ ─ ─  vsat ≈ 10^7 cm/s
│           /
│          /   ← vùng bão hòa: vd ≈ vsat
│         /
│        /     ← vùng tuyến tính: vd = µE
│       /
└────────────────────── E (V/cm)
         ~10^4 V/cm
```

Mô hình thực dụng:

$$v_d(\mathcal{E}) = \frac{\mu\mathcal{E}}{\sqrt{1 + (\mu\mathcal{E}/v_{sat})^2}}$$

Với Si: $v_{sat} \approx 10^7$ cm/s (cả electron lẫn hole).

> [!warning] Velocity saturation là giới hạn thực của transistor hiện đại
> MOSFET hiện nay có kênh dài $L \sim$ vài nm, điện trường trong kênh dễ đạt $\mathcal{E} > 10^4$ V/cm — vùng bão hòa vận tốc. Điều này là một trong những lý do tại sao thu nhỏ transistor theo định luật Moore ngày càng khó: tốc độ không tăng tuyến tính với việc giảm $L$ nữa.

---

### Resistivity của Doped Semiconductor

N-type ($n \gg p$, $n \approx N_D$):

$$\rho \approx \frac{1}{qN_D\mu_n}$$

P-type ($p \gg n$, $p \approx N_A$):

$$\rho \approx \frac{1}{qN_A\mu_p}$$

Đây là lý do kỹ sư có thể kiểm soát điện trở của silicon bằng cách thay đổi doping — một công cụ thiết kế linh kiện cực kỳ mạnh.

---

## Derivation — Kết nối Drude model với Mobility

**Drude model** (mô hình cổ điển đơn giản nhưng cho kết quả khá chính xác):

Electron trong điện trường $\mathcal{E}$ bị gia tốc nhưng mỗi $\tau$ giây lại va chạm và "reset" momentum:

**Bước 1:** Lực lên electron: $F = -e\mathcal{E}$

**Bước 2:** Gia tốc: $a = F/m^* = -e\mathcal{E}/m^*$

**Bước 3:** Momentum tích lũy trong thời gian $\tau$:

$$\Delta p = a \cdot \tau = -\frac{e\mathcal{E}\tau}{m^*}$$

**Bước 4:** Drift velocity trung bình (bằng $\Delta p / m^*$):

$$v_d = -\frac{e\tau}{m^*}\mathcal{E} = -\mu_n\mathcal{E}$$

với $\mu_n = \frac{e\tau}{m_e^*}$.

> [!definition] Mobility từ Drude Model
>
> $$\mu = \frac{e\tau}{m^*}$$
>
> Mobility tăng khi: (1) hạt tải nhẹ hơn ($m^*$ nhỏ), (2) ít scattering hơn ($\tau$ lớn).

---

## Worked Problem

> [!example] Bài toán 7.1 — Tính drift current density
>
> **Cho**: N-type Si với $N_D = 5 \times 10^{16}$ cm$^{-3}$, $\mu_n = 1200$ cm²/(V·s), $\mu_p = 400$ cm²/(V·s). Điện trường áp vào: $\mathcal{E} = 100$ V/cm.
>
> $n_i = 1.5 \times 10^{10}$ cm$^{-3}$.
>
> **Tìm**: Drift current density $J_{\text{drift}}$.

**Lời giải:**

Carrier concentration: $n \approx N_D = 5 \times 10^{16}$ cm$^{-3}$

$$p = \frac{n_i^2}{n} = \frac{(1.5\times10^{10})^2}{5\times10^{16}} = 4.5 \times 10^3 \text{ cm}^{-3}$$

$p \ll n$ → hole không đáng kể.

$$J_{\text{drift}} \approx qn\mu_n\mathcal{E} = 1.6\times10^{-19} \times 5\times10^{16} \times 1200 \times 100$$

$$= 1.6\times10^{-19} \times 6\times10^{21} = 960 \text{ A/cm}^2$$

> [!example] Bài toán 7.2 — Tính resistivity và thiết kế resistor
>
> **Cho**: Muốn làm một resistor bằng n-type Si với $\rho = 1$ Ω·cm.
>
> **Tìm**: Cần doping $N_D$ bao nhiêu? ($\mu_n = 1350$ cm²/(V·s))

**Lời giải:**

$$\rho = \frac{1}{qN_D\mu_n} \Rightarrow N_D = \frac{1}{q\mu_n\rho}$$

$$N_D = \frac{1}{1.6\times10^{-19} \times 1350 \times 1} = \frac{1}{2.16\times10^{-16}} \approx 4.6 \times 10^{15} \text{ cm}^{-3}$$

**Kiểm tra**: $N_D \gg n_i$ → xấp xỉ n-type hợp lệ. ✓

> [!example] Bài toán 7.3 — Velocity saturation
>
> **Cho**: Electron trong MOSFET kênh dài $L = 100$ nm, điện áp $V_{DS} = 1$ V. $\mu_n = 400$ cm²/(V·s), $v_{sat} = 10^7$ cm/s.
>
> **Tìm**: Điện trường trung bình trong kênh và kiểm tra xem có vào vùng bão hòa không.

**Lời giải:**

$$\mathcal{E}_{avg} = \frac{V_{DS}}{L} = \frac{1}{100 \times 10^{-7}} = 10^5 \text{ V/cm}$$

Vận tốc tuyến tính: $v_d^{linear} = \mu_n\mathcal{E} = 400 \times 10^5 = 4\times10^7$ cm/s

Nhưng $v_{sat} = 10^7$ cm/s $<$ $v_d^{linear}$ → **electron đã vào vào vùng bão hòa**.

Vận tốc thực tế $\approx v_{sat} = 10^7$ cm/s, không phải $4\times10^7$ cm/s như dự đoán tuyến tính.

---

## Summary / Key Takeaways

- **Drift** là chuyển động có hướng của hạt tải dưới tác dụng điện trường, chồng chất lên chuyển động nhiệt ngẫu nhiên.
- **Drift velocity**: $v_{d,n} = -\mu_n\mathcal{E}$ (electron ngược chiều $\mathcal{E}$), $v_{d,p} = \mu_p\mathcal{E}$ (hole cùng chiều $\mathcal{E}$).
- **Mobility** $\mu = e\tau/m^*$: tăng khi $m^*$ nhỏ và ít scattering ($\tau$ lớn). Giảm khi nhiệt độ tăng (phonon) hoặc doping tăng (impurity).
- **Drift current**: $J_{\text{drift}} = q(n\mu_n + p\mu_p)\mathcal{E} = \sigma\mathcal{E}$ — Ohm's law vi mô.
- **Velocity saturation** ở $\mathcal{E} \gtrsim 10^4$ V/cm: giới hạn tốc độ transistor thu nhỏ.
- Si: $\mu_n \approx 1350$, $\mu_p \approx 480$ cm²/(V·s) ở 300 K.

---

## References

- Pierret, R. F. — *Semiconductor Device Fundamentals*, Ch. 3 (Prentice Hall, 1995)
- MIT 6.012 — Lecture 3: Carrier Transport (ocw.mit.edu/6-012-SP07)
- Hu, Chenming — *Modern Semiconductor Devices for Integrated Circuits*, Ch. 2 (UC Berkeley, 2009)
- Wikipedia — Electron mobility
