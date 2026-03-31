---
title: "05. Carrier Statistics"
tags: [physics, semiconductor, device-physics, lesson-05]
aliases: [Carrier Statistics]
created: 2026-03-27
---

> **Prerequisites**: [[04-energy-band-theory|04. Energy Band Theory]] — valence band, conduction band, band gap, Fermi level, effective mass
> **Objectives**:
> - Hiểu phân bố Fermi-Dirac và ý nghĩa vật lý của nó
> - Hiểu density of states (DOS) là gì và tại sao nó cần thiết
> - Tính được nồng độ electron $n$ và hole $p$ trong semiconductor
> - Hiểu intrinsic carrier concentration $n_i$ và quy tắc $np = n_i^2$
> - Biết vị trí của Fermi level trong semiconductor intrinsic

---

## Motivation

Bây giờ bạn đã biết silicon có band gap 1.12 eV và Fermi level ở giữa band gap. Nhưng câu hỏi thực tế là: **ở nhiệt độ phòng, có bao nhiêu electron tự do trong một cm³ silicon?** Và số đó thay đổi như thế nào khi nhiệt độ thay đổi?

Đây là bài toán **carrier statistics** — thống kê hạt tải điện. Câu trả lời không đơn giản vì electron không phải các hạt cổ điển (như bi-a hay phân tử khí). Chúng là **fermion** — loại hạt tuân theo nguyên lý Pauli: không hai electron nào có thể ở cùng một trạng thái lượng tử. Điều này làm thay đổi hoàn toàn thống kê.

Bài này giới thiệu ba khái niệm mà mọi tính toán semiconductor đều cần: **Fermi-Dirac distribution**, **density of states**, và **intrinsic carrier concentration**.

---

## Physical Model

### Tại sao không dùng thống kê cổ điển?

Trong vật lý cổ điển, xác suất một hạt có năng lượng $E$ tuân theo **phân bố Maxwell-Boltzmann**:

$$f_{MB}(E) \propto e^{-E/k_BT}$$

Nhưng Maxwell-Boltzmann **không có giới hạn** về số hạt trên mỗi trạng thái — có thể nhét vô hạn hạt vào cùng một trạng thái. Điều này sai với electron vì nguyên lý Pauli.

> [!definition] Nguyên lý loại trừ Pauli (Pauli Exclusion Principle)
> Không có hai electron nào có thể chiếm cùng một trạng thái lượng tử — được xác định bởi bộ $(n, l, m_l, m_s)$ của nó. Mỗi trạng thái năng lượng chứa **tối đa 2 electron** (spin up và spin down).

Vì electron là **fermion** (hạt có spin bán nguyên), chúng tuân theo **thống kê Fermi-Dirac** thay vì Maxwell-Boltzmann.

---

### Phân bố Fermi-Dirac

> [!definition] Hàm phân bố Fermi-Dirac $f(E)$
> Xác suất một trạng thái năng lượng $E$ được chiếm bởi một electron tại nhiệt độ $T$:
>
> $$f(E) = \frac{1}{1 + e^{(E - E_F)/k_BT}}$$
>
> với $E_F$ là Fermi level và $k_B = 8.617 \times 10^{-5}$ eV/K là hằng số Boltzmann.

Hàm $f(E)$ luôn nằm trong $[0, 1]$ — đây là xác suất, có ý nghĩa rõ ràng.

**Các trường hợp đặc biệt:**

$$f(E_F) = \frac{1}{1 + e^0} = \frac{1}{2} = 50\%$$

$$E \gg E_F: \quad f(E) \approx e^{-(E-E_F)/k_BT} \quad \text{(xấp xỉ Boltzmann)}$$

$$E \ll E_F: \quad f(E) \approx 1 \quad \text{(gần chắc chắn có electron)}$$

**Hành vi theo nhiệt độ:**

```
f(E)
1.0 │╲ T = 0 K                  1.0 │
    │ ╲                              │─────╲
0.5 │  ╲ T = 0K: hàm bậc thang  0.5 │     ╲  T = 300 K
    │   ╲                             │      ╲
0.0 │    ╲──────────────          0.0 │       ─────────────
    └──────────────── E               └──────────────── E
         EF                                EF

  T=0: tất cả trạng thái dưới     T>0: "mờ dần" quanh EF
  EF đầy, trên EF trống           khoảng mờ ~ vài kBT
```

> [!tip] Giá trị nhiệt năng $k_BT$
> Ở room temperature (300 K): $k_BT = 0.026$ eV = 26 meV
>
> Đây là thang năng lượng nhiệt điển hình. Vì $E_g(\text{Si}) = 1.12$ eV $\gg k_BT$, hầu hết electron không vượt qua được band gap → silicon là bán dẫn, không phải kim loại.

---

### Density of States (Mật độ trạng thái)

Biết xác suất $f(E)$ chưa đủ — cần biết có **bao nhiêu trạng thái** ở mỗi mức năng lượng để tính được nồng độ hạt tải.

> [!definition] Density of States $g(E)$
> $g(E)$ là **số trạng thái lượng tử có thể có** trong một đơn vị thể tích và một đơn vị khoảng năng lượng tại năng lượng $E$.
>
> Đơn vị: states/cm³/eV
>
> Gần đáy conduction band (mô hình parabolic):
>
> $$g_c(E) = \frac{1}{2\pi^2}\left(\frac{2m_e^*}{\hbar^2}\right)^{3/2}\sqrt{E - E_c}, \quad E \geq E_c$$
>
> Gần đỉnh valence band:
>
> $$g_v(E) = \frac{1}{2\pi^2}\left(\frac{2m_h^*}{\hbar^2}\right)^{3/2}\sqrt{E_v - E}, \quad E \leq E_v$$

Điểm quan trọng: DOS tỉ lệ với $\sqrt{E - E_c}$ trong CB — bằng 0 tại đúng đáy band, rồi tăng dần. Điều này phản ánh thực tế vật lý: ở đáy band, ít trạng thái hơn; càng lên cao trong band, càng nhiều trạng thái.

---

### Tính Carrier Concentration

Nồng độ electron trong CB là tích phân của (DOS × xác suất có electron):

$$n = \int_{E_c}^{\infty} g_c(E) \cdot f(E)\, dE$$

Nồng độ hole trong VB là tích phân của (DOS × xác suất **không** có electron = xác suất có hole):

$$p = \int_{-\infty}^{E_v} g_v(E) \cdot [1 - f(E)]\, dE$$

**Hình dung trực quan:**

```
E │
  │  ░░░░░ g_c(E)        × f(E) ≈ 0    = ▓ (ít electron — shaded area nhỏ)
Ec│─────────────────
  │  (band gap — g = 0)
Ev│─────────────────
  │  ░░░░░ g_v(E)        × [1-f(E)] ≈ 0 = ▓ (ít hole — shaded area nhỏ)
  │
```

---

## Mathematical Formalism

### Xấp xỉ Boltzmann (Boltzmann Approximation)

Khi $E_c - E_F \gg k_BT$ (Fermi level nằm sâu trong band gap, cách CB ít nhất vài $k_BT$), hàm Fermi-Dirac đơn giản hóa thành:

$$f(E) \approx e^{-(E-E_F)/k_BT} \quad \text{cho } E \geq E_c$$

Đây là xấp xỉ **non-degenerate semiconductor** — hợp lệ với silicon không pha tạp hoặc pha tạp vừa phải. Xấp xỉ này làm cho tích phân tính được dạng closed-form:

> [!definition] Carrier Concentration — Công thức xấp xỉ Boltzmann
>
> $$\boxed{n = N_c \, e^{-(E_c - E_F)/k_BT}}$$
>
> $$\boxed{p = N_v \, e^{-(E_F - E_v)/k_BT}}$$
>
> trong đó $N_c$ và $N_v$ là **effective density of states** (mật độ trạng thái hiệu dụng):
>
> $$N_c = 2\left(\frac{2\pi m_e^* k_BT}{h^2}\right)^{3/2}, \qquad N_v = 2\left(\frac{2\pi m_h^* k_BT}{h^2}\right)^{3/2}$$

Với silicon ở 300 K:

| Tham số | Giá trị |
|---------|---------|
| $N_c$ | $2.8 \times 10^{19}$ cm$^{-3}$ |
| $N_v$ | $1.04 \times 10^{19}$ cm$^{-3}$ |
| $k_BT$ | 0.026 eV |

**Ý nghĩa vật lý của $N_c$**: Đây là số trạng thái "hiệu dụng" trong CB — như thể toàn bộ CB được gom lại tại $E = E_c$. Tương tự $N_v$ cho VB tại $E = E_v$.

---

### Intrinsic Carrier Concentration $n_i$

Trong semiconductor **intrinsic** (nguyên chất, không doping), mỗi electron được tạo ra khi một liên kết bị phá vỡ → đồng thời tạo ra một hole:

$$n = p = n_i \quad \text{(intrinsic condition)}$$

Nhân hai phương trình carrier concentration:

$$np = N_c e^{-(E_c - E_F)/k_BT} \cdot N_v e^{-(E_F - E_v)/k_BT} = N_c N_v \, e^{-E_g/k_BT}$$

> [!definition] Quy tắc $np = n_i^2$ (Mass Action Law)
>
> $$\boxed{np = n_i^2 = N_c N_v \, e^{-E_g/k_BT}}$$
>
> Đây là **bất biến tại cân bằng nhiệt** — đúng cho cả doped và intrinsic semiconductor, miễn là ở thermal equilibrium.

Và intrinsic carrier concentration:

$$n_i = \sqrt{N_c N_v} \, e^{-E_g/2k_BT}$$

**Giá trị số với Silicon ở 300 K:**

$$n_i(\text{Si}) \approx 1.5 \times 10^{10} \text{ cm}^{-3}$$

> [!warning] $n_i$ phụ thuộc *cực mạnh* vào $E_g$
> Vì $n_i \propto e^{-E_g/2k_BT}$, band gap khác nhau dẫn đến $n_i$ khác nhau nhiều bậc:
>
> | Vật liệu | $E_g$ (eV) | $n_i$ tại 300 K |
> |---------|----------|----------------|
> | Ge | 0.66 | $\sim 2 \times 10^{13}$ cm$^{-3}$ |
> | Si | 1.12 | $\sim 1.5 \times 10^{10}$ cm$^{-3}$ |
> | GaAs | 1.42 | $\sim 2 \times 10^{6}$ cm$^{-3}$ |
>
> Đây là lý do transistor GaAs có thể hoạt động ở nhiệt độ cao hơn mà không bị "intrinsic takeover."

---

### Vị trí Fermi Level trong Intrinsic Semiconductor

Đặt $n = p$:

$$N_c e^{-(E_c - E_F)/k_BT} = N_v e^{-(E_F - E_v)/k_BT}$$

Giải ra:

$$E_F = E_i = \frac{E_c + E_v}{2} + \frac{k_BT}{2}\ln\frac{N_v}{N_c} = \frac{E_c + E_v}{2} + \frac{3k_BT}{4}\ln\frac{m_h^*}{m_e^*}$$

> [!definition] Intrinsic Fermi Level $E_i$
> Trong semiconductor intrinsic, Fermi level gọi là $E_i$. Nó nằm gần giữa band gap, lệch nhẹ về phía band có effective mass lớn hơn.
>
> Với Si: $m_h^* > m_e^*$ → $E_i$ lệch nhẹ về VB (nhưng rất ít — chỉ ~0.01 eV so với giữa gap).

---

## Derivation — Tại sao $np = n_i^2$ bất biến?

Đây là hệ quả của **thermal equilibrium**. Xét quá trình generation và recombination:

- **Generation** (G): nhiệt năng phá vỡ liên kết → tạo ra cặp electron-hole. Tốc độ $G$ phụ thuộc vào nhiệt độ nhưng **độc lập** với $n$ và $p$.
- **Recombination** (R): electron gặp hole → tái kết hợp. Tốc độ $R \propto n \cdot p$ (vì cần cả hai gặp nhau).

Tại cân bằng: $G = R \propto np$, suy ra $np = \text{const}(T) = n_i^2$.

Khi doping thay đổi $n$ lên, $p$ phải giảm xuống để tích $np$ giữ nguyên — giống quy tắc Ka trong hóa học! Đây là **"mass action law"** của semiconductor.

---

## Worked Problem

> [!example] Bài toán 5.1 — Fermi level trong intrinsic Si
>
> **Cho**: Intrinsic Si ở 300 K. $E_c - E_v = 1.12$ eV, $N_c = 2.8 \times 10^{19}$ cm$^{-3}$, $N_v = 1.04 \times 10^{19}$ cm$^{-3}$.
>
> **Tìm**: Vị trí $E_i$ so với giữa band gap.

**Lời giải:**

Giữa band gap: $E_{mid} = \frac{E_c + E_v}{2}$

Độ lệch của $E_i$:

$$E_i - E_{mid} = \frac{k_BT}{2}\ln\frac{N_v}{N_c} = \frac{0.026}{2}\ln\frac{1.04 \times 10^{19}}{2.8 \times 10^{19}}$$

$$= 0.013 \times \ln(0.371) = 0.013 \times (-0.991) \approx -0.013 \text{ eV}$$

$E_i$ nằm thấp hơn giữa band gap 13 meV — lệch về phía VB vì $m_h^* > m_e^*$ trong Si. Con số này nhỏ so với $E_g = 1.12$ eV → thường coi $E_i \approx$ giữa band gap.

> [!example] Bài toán 5.2 — Kiểm tra quy tắc $np = n_i^2$
>
> **Cho**: Silicon intrinsic ở 300 K. $n_i = 1.5 \times 10^{10}$ cm$^{-3}$.
>
> Giả sử sau khi doping n-type, $n = 10^{16}$ cm$^{-3}$.
>
> **Tìm**: $p$ sau khi doping.

**Lời giải:**

Dùng mass action law:

$$p = \frac{n_i^2}{n} = \frac{(1.5 \times 10^{10})^2}{10^{16}} = \frac{2.25 \times 10^{20}}{10^{16}} = 2.25 \times 10^4 \text{ cm}^{-3}$$

**Nhận xét:** Khi $n$ tăng từ $1.5 \times 10^{10}$ lên $10^{16}$ (tăng $\sim 10^6$ lần), $p$ giảm từ $1.5 \times 10^{10}$ xuống $2.25 \times 10^4$ (giảm $\sim 10^6$ lần) — tích $np$ giữ nguyên. Hole trở thành **minority carrier** với nồng độ cực thấp.

> [!example] Bài toán 5.3 — Carrier concentration thay đổi theo nhiệt độ
>
> **Hỏi**: $n_i$ của silicon tăng bao nhiêu lần khi nhiệt độ tăng từ 300 K lên 400 K?
>
> ($E_g \approx 1.12$ eV, bỏ qua sự thay đổi của $N_c, N_v$ theo $T$)

**Lời giải:**

$$\frac{n_i(400)}{n_i(300)} = \frac{e^{-E_g/2k_B \cdot 400}}{e^{-E_g/2k_B \cdot 300}} = \exp\left[\frac{E_g}{2k_B}\left(\frac{1}{300} - \frac{1}{400}\right)\right]$$

$$= \exp\left[\frac{1.12}{2 \times 8.617 \times 10^{-5}} \times \frac{1}{1200}\right] = \exp\left[\frac{1.12}{0.2068}\right] = e^{5.41} \approx 224$$

**Nhận xét:** Tăng nhiệt độ 100°C làm $n_i$ tăng **224 lần**! Đây là lý do linh kiện bán dẫn bị hỏng ở nhiệt độ cao — khi $n_i$ tăng đủ lớn, nó lấn át nồng độ doping và làm mất đi tính chất n-type hoặc p-type (gọi là "intrinsic takeover").

---

## Summary / Key Takeaways

- **Fermi-Dirac distribution** $f(E) = 1/(1+e^{(E-E_F)/k_BT})$: xác suất trạng thái $E$ có electron. Tại $E_F$: $f = 0.5$.
- **Density of states** $g(E) \propto \sqrt{E-E_c}$: số trạng thái khả dụng. Bằng 0 ở đáy band, tăng dần vào trong band.
- **Carrier concentration**: $n = N_c e^{-(E_c-E_F)/k_BT}$, $p = N_v e^{-(E_F-E_v)/k_BT}$ (xấp xỉ Boltzmann).
- **Mass action law**: $np = n_i^2 = N_cN_v e^{-E_g/k_BT}$ — bất biến ở thermal equilibrium.
- **Intrinsic Fermi level** $E_i \approx$ giữa band gap (lệch nhẹ về phía band có $m^*$ lớn hơn).
- $n_i \propto e^{-E_g/2k_BT}$ — cực nhạy với nhiệt độ và band gap. Si: $n_i \approx 1.5 \times 10^{10}$ cm$^{-3}$ ở 300 K.

---

## References

- Pierret, R. F. — *Semiconductor Device Fundamentals*, Ch. 3 (Prentice Hall, 1995)
- Hu, Chenming — *Modern Semiconductor Devices for Integrated Circuits*, Ch. 1 (UC Berkeley, 2009)
- MIT 6.012 — Lecture notes: Carrier Statistics (ocw.mit.edu)
- Streetman & Banerjee — *Solid State Electronic Devices*, Ch. 3 (Pearson, 2015)
