---
title: "11. p-n Junction Under Bias"
tags: [physics, semiconductor, device-physics, lesson-11]
aliases: [p-n Junction Under Bias]
created: 2026-03-27
---

> **Prerequisites**: [[10-pn-junction-equilibrium|10. p-n Junction Equilibrium]] — depletion region, built-in potential, band diagram; [[09-generation-recombination|09. Generation & Recombination]] — minority carrier lifetime, diffusion length, continuity equation
> **Objectives**:
> - Hiểu forward bias và reverse bias làm thay đổi depletion region như thế nào
> - Giải thích cơ chế minority carrier injection — trái tim của dòng diode
> - Derive được phương trình Shockley (ideal diode equation) $I = I_0(e^{V/V_T} - 1)$
> - Giải thích tại sao dòng forward tăng theo hàm mũ còn reverse bão hòa
> - Hiểu saturation current $I_0$ phụ thuộc vào các thông số vật liệu nào

---

## Motivation

Lesson 10 đặt câu hỏi: điều gì xảy ra khi có điện áp bên ngoài? Đây là lúc p-n junction trở thành một linh kiện **hoạt động** — một diode.

Công thức $I = I_0(e^{V/V_T} - 1)$ là một trong những kết quả đẹp nhất của semiconductor physics. Nó giải thích tại sao diode chỉnh lưu, tại sao LED phát sáng, tại sao solar cell tạo ra điện. Toàn bộ Lesson 11 này là hành trình derive công thức đó từ vật lý cơ bản.

---

## Physical Model

### Forward Bias — Hạ rào thế

**Forward bias:** Áp điện áp $V > 0$, nối cực dương (+) vào p-side và cực âm (−) vào n-side.

Điện áp bên ngoài **chống lại** built-in potential:
- Built-in potential $V_{bi}$ hướng từ n sang p (giữ carrier ở lại)
- Điện áp ngoài $V$ hướng từ p sang n (đẩy carrier vào junction)
- Rào thế còn lại: $V_{bi} - V$

$$\Rightarrow \text{Depletion region thu hẹp lại}$$

```
Band diagram — Forward Bias ($V > 0$):

E
│  p-side      depletion      n-side
│              (hẹp hơn)
│  ─── Ec          ╲             ─── Ec
│                   ╲─
│  ─EF(p)─ ─ ─      ─│─ ─ ─EF(n)─  ← EF tách đôi
│                  ─╱               ← khoảng cách = qV
│  ─── Ev        ╱               ─── Ev
│
│  ←── qVbi ───────────────────→
│  ←── q(Vbi - V) ─────────────→   ← rào thấp hơn
└────────────────────────────────── x
```

Rào thấp hơn → nhiều majority carrier có đủ năng lượng để vượt qua → dòng tăng **theo hàm mũ**.

---

### Reverse Bias — Nâng rào thế

**Reverse bias:** Áp điện áp $V < 0$ (hay $V = -V_R$, $V_R > 0$), nối cực âm vào p-side.

Điện áp ngoài **cùng chiều** với built-in potential → rào thế tăng lên $V_{bi} + V_R$:

$$\Rightarrow \text{Depletion region mở rộng ra}$$

```
Band diagram — Reverse Bias:

E
│  p-side        depletion (rộng hơn)       n-side
│  ─── Ec                    ╲                 ─── Ec
│                              ╲
│  ─EF(p)─ ─ ─ ─ ─ ─ ─ ─ ─   ─│─ ─ ─ ─ EF(n)─
│                               ╲
│  ─── Ev                        ╲             ─── Ev
│
│  ←──────── q(Vbi + VR) ────────────────────→
└────────────────────────────────────────────── x
```

Rào cao hơn → hầu như không có majority carrier vượt qua → dòng rất nhỏ, gần như không đổi.

---

### Minority Carrier Injection — Cơ chế tạo dòng Forward

Trái tim của hoạt động diode là **minority carrier injection**:

Khi forward bias, rào $q(V_{bi} - V)$ thấp hơn → một số **electron từ n-side vượt qua** sang p-side và một số **hole từ p-side vượt qua** sang n-side.

Các carrier này trở thành **minority carrier** ở phía đối diện → bị khuếch tán vào sâu trong vùng trung hòa → dần dần tái kết hợp.

```
Forward bias — Minority carrier injection:

  p-side         dep.    n-side
  ○○○ [A⁻A⁻] → [D⁺D⁺] ●●●
       ←── holes từ p    electrons từ n ──→
                ↑               ↑
           injected        injected
       vào n-side          vào p-side
       (minority)          (minority)

  Gradient nồng độ tạo dòng diffusion trong vùng trung hòa → dòng diode
```

> [!definition] Điều kiện biên Shockley (Law of the Junction)
> Tại biên của depletion region, dưới forward bias $V$, nồng độ minority carrier **tăng theo hệ số** $e^{V/V_T}$:
>
> $$p_n(x_n) = p_{n0}\,e^{V/V_T} \qquad \text{(hole tại biên n-side)}$$
>
> $$n_p(-x_p) = n_{p0}\,e^{V/V_T} \qquad \text{(electron tại biên p-side)}$$
>
> với $p_{n0} = n_i^2/N_D$ và $n_{p0} = n_i^2/N_A$ là nồng độ minority carrier ở equilibrium.

Đây là **điều kiện biên quan trọng nhất** trong device physics — nó kết nối điện áp áp vào với nồng độ carrier.

---

## Mathematical Formalism

### Giải Continuity Equation cho Minority Carrier

Trong vùng trung hòa n-side (xa depletion region), minority hole tuân theo:

$$D_p\frac{d^2(\Delta p)}{dx^2} - \frac{\Delta p}{\tau_p} = 0 \qquad \text{(steady-state, không có ánh sáng)}$$

Nghiệm (với điều kiện biên $\Delta p \to 0$ khi $x \to \infty$, long diode):

$$\Delta p(x) = \Delta p(x_n)\,e^{-(x-x_n)/L_p}$$

với $L_p = \sqrt{D_p\tau_p}$ và $\Delta p(x_n) = p_{n0}(e^{V/V_T} - 1)$.

---

### Dòng Diffusion của Minority Carrier

Dòng hole tại biên depletion (n-side):

$$J_p(x_n) = -qD_p\frac{d(\Delta p)}{dx}\bigg|_{x=x_n} = \frac{qD_p}{L_p}\,p_{n0}\,(e^{V/V_T} - 1)$$

Tương tự, dòng electron tại biên depletion (p-side):

$$J_n(-x_p) = \frac{qD_n}{L_n}\,n_{p0}\,(e^{V/V_T} - 1)$$

---

### Phương trình Shockley — Ideal Diode Equation

Tổng dòng = dòng hole + dòng electron (bảo toàn dòng qua depletion):

> [!definition] Ideal Diode Equation (Shockley Equation)
>
> $$\boxed{I = I_0\left(e^{V/V_T} - 1\right)}$$
>
> với **saturation current**:
>
> $$I_0 = Aqn_i^2\left(\frac{D_p}{L_p N_D} + \frac{D_n}{L_n N_A}\right)$$
>
> $A$ là diện tích tiếp xúc, $V_T = k_BT/q \approx 26$ mV ở 300 K.

---

### Phân tích Đặc tuyến I-V

```
I (mA)
│                       /  ← hàm mũ
│                      /
│                     /
│                    /
│                   /
│──────────────────/────── V (V)
│←── reverse ───→│←── forward ──→
│                  0   ~0.6V
│  -I₀ ─ ─ ─ ─ ─ ─│      (Si cut-in voltage)
│
│                 V_bi ≈ 0.7 V là rào tối đa,
│                 thực tế diode "dẫn mạnh" từ ~0.5–0.6 V
```

**Forward bias ($V > 0$):**

$$I \approx I_0\,e^{V/V_T} \quad (V \gg V_T)$$

Mỗi khi $V$ tăng $60$ mV ($\approx 2.3 V_T$), dòng tăng **10 lần** ở 300 K. Đây là đặc tuyến hàm mũ nổi tiếng của diode.

**Reverse bias ($V < 0$, $|V| \gg V_T$):**

$$I \approx -I_0$$

Dòng bão hòa ở $-I_0$ — gọi là **reverse saturation current**. Với Si, $I_0 \sim 10^{-12}$–$10^{-9}$ A (rất nhỏ).

> [!tip] Tại sao dòng bão hòa ở reverse bias?
> Reverse current đến từ minority carrier ở vùng trung hòa khuếch tán đến depletion region và bị điện trường cuốn qua. Tốc độ này phụ thuộc vào **tốc độ generation** của minority carrier — thứ phụ thuộc vào nhiệt độ và vật liệu, **không phụ thuộc vào độ lớn của reverse voltage** → dòng bão hòa.

---

### Saturation Current $I_0$ và Các Thông Số Vật Liệu

$$I_0 = Aqn_i^2\left(\frac{D_p}{L_p N_D} + \frac{D_n}{L_n N_A}\right)$$

Phân tích:

- $I_0 \propto n_i^2 \propto e^{-E_g/k_BT}$ → **nhạy cảm cực mạnh với nhiệt độ**. Với Si, $I_0$ tăng khoảng 2 lần cho mỗi 10°C tăng nhiệt độ.
- $I_0$ giảm khi doping ($N_D$, $N_A$) tăng → diode doping cao có $I_0$ nhỏ hơn.
- $I_0$ nhỏ hơn nhiều với GaAs (band gap lớn hơn) → GaAs diode có đặc tuyến I-V lý tưởng hơn.

> [!warning] Ideal Diode Equation có giới hạn
> Công thức Shockley giả định: (1) low-level injection, (2) không có G-R trong depletion region, (3) long diode. Thực tế với Si, có thêm **recombination current** trong depletion region → ideality factor $n \approx 1$–$2$.

---

## Derivation — Built-in potential và Forward Bias qua Fermi Level

Ở equilibrium: $E_F$ phẳng. Khi forward bias $V$:

- p-side nối với (+): Fermi level p-side **hạ xuống** $qV$
- n-side nối với (−): Fermi level n-side giữ nguyên

→ Hai quasi-Fermi level tách ra: $E_{Fn} - E_{Fp} = qV$

Từ đây, nồng độ hole tại biên n-side:

$$p_n(x_n) = N_v e^{-(E_{Fp} - E_v)/k_BT}$$

Ở equilibrium: $p_{n0} = N_v e^{-(E_{F0} - E_v)/k_BT}$

Tỉ lệ:

$$\frac{p_n(x_n)}{p_{n0}} = e^{(E_{F0} - E_{Fp})/k_BT} = e^{qV/k_BT} = e^{V/V_T}$$

→ $p_n(x_n) = p_{n0}\,e^{V/V_T}$ — đây chính là **law of the junction**, xác nhận điều kiện biên Shockley.

---

## Worked Problem

> [!example] Bài toán 11.1 — Tính dòng diode
>
> **Cho**: Diode Si với:
> - $N_A = 10^{17}$ cm$^{-3}$ (p-side), $N_D = 10^{16}$ cm$^{-3}$ (n-side)
> - $D_p = 10$ cm²/s, $\tau_p = 10^{-7}$ s (n-side)
> - $D_n = 25$ cm²/s, $\tau_n = 10^{-7}$ s (p-side)
> - Diện tích $A = 10^{-4}$ cm², $n_i = 1.5 \times 10^{10}$ cm$^{-3}$
>
> **Tìm**: $I_0$ và dòng forward tại $V = 0.6$ V.

**Lời giải:**

**Bước 1:** Tính diffusion length:

$$L_p = \sqrt{10 \times 10^{-7}} = \sqrt{10^{-6}} = 10^{-3} \text{ cm} = 10 \text{ µm}$$

$$L_n = \sqrt{25 \times 10^{-7}} = \sqrt{25 \times 10^{-7}} \approx 1.58 \times 10^{-3} \text{ cm} = 15.8 \text{ µm}$$

**Bước 2:** Tính $I_0$:

$$I_0 = Aqn_i^2\left(\frac{D_p}{L_p N_D} + \frac{D_n}{L_n N_A}\right)$$

$$= 10^{-4} \times 1.6\times10^{-19} \times (1.5\times10^{10})^2 \times \left(\frac{10}{10^{-3}\times10^{16}} + \frac{25}{1.58\times10^{-3}\times10^{17}}\right)$$

$$= 10^{-4} \times 1.6\times10^{-19} \times 2.25\times10^{20} \times \left(10^{-12} + 1.58\times10^{-13}\right)$$

$$= 3.6\times10^{-3} \times 1.158\times10^{-12} \approx 4.2\times10^{-15} \text{ A}$$

**Bước 3:** Dòng forward tại $V = 0.6$ V:

$$I = I_0(e^{0.6/0.026} - 1) = 4.2\times10^{-15} \times (e^{23.1} - 1)$$

$$e^{23.1} \approx 1.08\times10^{10}$$

$$I \approx 4.2\times10^{-15} \times 1.08\times10^{10} \approx 4.5\times10^{-5} \text{ A} = 45 \text{ µA}$$

> [!example] Bài toán 11.2 — Cut-in voltage
>
> **Hỏi**: Tại điện áp forward nào thì dòng diode đạt $I = 1$ mA? (Dùng $I_0 = 4.2\times10^{-15}$ A)

**Lời giải:**

$$I = I_0 e^{V/V_T} \Rightarrow V = V_T\ln\frac{I}{I_0} = 0.026\times\ln\frac{10^{-3}}{4.2\times10^{-15}}$$

$$= 0.026\times\ln(2.38\times10^{11}) = 0.026\times26.2 \approx 0.681 \text{ V}$$

Đây giải thích tại sao người ta nói diode Si có "cut-in voltage" ≈ 0.6–0.7 V: đây là điện áp cần thiết để có dòng có thể sử dụng được trong mạch điện thực tế.

> [!example] Bài toán 11.3 — Minority carrier profile dưới forward bias
>
> **Cho**: Diode từ bài 11.1, forward bias $V = 0.6$ V.
>
> **Tìm**: Nồng độ minority hole thặng dư tại biên depletion ($x = x_n$) và tại $x = x_n + L_p$.

**Lời giải:**

Equilibrium minority hole trong n-side:

$$p_{n0} = \frac{n_i^2}{N_D} = \frac{(1.5\times10^{10})^2}{10^{16}} = 2.25\times10^4 \text{ cm}^{-3}$$

Excess hole tại biên:

$$\Delta p(x_n) = p_{n0}(e^{V/V_T} - 1) \approx 2.25\times10^4 \times 1.08\times10^{10} \approx 2.43\times10^{14} \text{ cm}^{-3}$$

Tại $x = x_n + L_p$ (= $x_n$ + 10 µm):

$$\Delta p(x_n + L_p) = \Delta p(x_n)\,e^{-1} = 2.43\times10^{14} \times 0.368 \approx 8.9\times10^{13} \text{ cm}^{-3}$$

**Nhận xét:** Excess minority carrier giảm theo hàm mũ với hằng số khoảng cách $L_p = 10$ µm — sau một diffusion length, giảm còn 37% giá trị ban đầu.

---

## Summary / Key Takeaways

- **Forward bias** ($V > 0$): hạ rào thế → minority carrier injection → dòng diffusion tăng theo hàm mũ.
- **Reverse bias** ($V < 0$): nâng rào thế → depletion mở rộng → dòng bão hòa nhỏ $I_0$.
- **Ideal diode equation**: $I = I_0(e^{V/V_T} - 1)$ — Shockley 1949.
- **Saturation current**: $I_0 \propto n_i^2 \propto e^{-E_g/k_BT}$ — nhạy với nhiệt độ, giảm khi doping tăng.
- **Law of the junction**: $p_n(x_n) = p_{n0}e^{V/V_T}$ — điều kiện biên kết nối $V$ với nồng độ minority carrier.
- **Cut-in voltage** Si ≈ 0.6–0.7 V — điện áp cần để có dòng đáng kể ở room temp.
- Mỗi 60 mV forward bias → dòng tăng **10 lần** ở 300 K.

---

## References

- Pierret, R. F. — *Semiconductor Device Fundamentals*, Ch. 6 (Prentice Hall, 1995)
- Hu, Chenming — *Modern Semiconductor Devices for Integrated Circuits*, Ch. 4 (UC Berkeley, 2009)
- MIT 6.012 — Lecture notes: p-n Junction Under Bias (ocw.mit.edu)
- Wikipedia — p–n junction; Shockley diode equation
