---
title: "06. Doping"
tags: [physics, semiconductor, device-physics, lesson-06]
aliases: [Doping]
created: 2026-03-27
---

> **Prerequisites**: [[04-energy-band-theory|04. Energy Band Theory]] — band gap, Fermi level, energy band diagram; [[05-carrier-statistics|05. Carrier Statistics]] — $n, p$, $n_i$, mass action law $np = n_i^2$
> **Objectives**:
> - Hiểu doping là gì và tại sao nó thay đổi hoàn toàn tính chất điện của semiconductor
> - Phân biệt n-type và p-type doping
> - Tính carrier concentration sau doping bằng charge neutrality condition
> - Hiểu majority carrier và minority carrier
> - Đọc được band diagram của semiconductor đã doped và xác định vị trí Fermi level

---

## Motivation

Intrinsic silicon có $n_i \approx 1.5 \times 10^{10}$ cm$^{-3}$ — quá ít để làm linh kiện điện tử hữu ích. Nhưng nếu thêm vào dù chỉ **một phần triệu** nguyên tử phosphorus, nồng độ electron tăng lên $10^{16}$ cm$^{-3}$ — tăng **hơn một triệu lần**.

Đây là **doping** — kỹ thuật then chốt biến silicon từ một chất cách điện yếu thành nguyên liệu tạo nên toàn bộ nền công nghiệp điện tử. Không có doping, không có transistor, không có chip, không có smartphone.

Bài này giải thích cơ chế vật lý của doping và cách tính carrier concentration chính xác sau khi doping.

---

## Physical Model

### Nguyên tắc cơ bản của Doping

Silicon có **4 electron hóa trị** (nhóm IV trong bảng tuần hoàn). Khi thay thế một nguyên tử Si bằng nguyên tử có **số electron hóa trị khác**, cấu trúc electron cục bộ bị thay đổi:

```
Mạng Si bình thường:         Sau khi doping P (nhóm V):

  Si─Si─Si                     Si─Si─Si
  │  │  │                       │  │  │
  Si─Si─Si      →               Si─P─Si     ← P có 5e hóa trị
  │  │  │                       │  │  │
  Si─Si─Si                     Si─Si─Si
                                      ↑
                                electron thừa, liên kết yếu
```

---

### N-type Doping — Donor

> [!definition] N-type Semiconductor
> Khi pha tạp với nguyên tử **nhóm V** (5 electron hóa trị): P (phosphorus), As (arsenic), Sb (antimony).
>
> Nguyên tử donor dùng 4 electron để tạo liên kết cộng hóa trị với 4 Si lân cận. Electron thứ 5 chỉ liên kết lỏng lẻo với hạt nhân donor (năng lượng liên kết $\sim 0.045$ eV) → ở room temperature, nó **thoát ra hoàn toàn** và trở thành electron tự do trong CB.
>
> Donor ion sau khi mất electron trở thành ion dương cố định $D^+$ trong mạng tinh thể.

```
Band diagram n-type:

  CB ──────────────
      •  •  •  •          ← electron tự do (majority carriers)
    ──── Ed ────           ← donor level (0.045 eV dưới Ec với P trong Si)
  EF ─ ─ ─ ─ ─ ─           ← EF dịch lên gần CB
  EI ─ ─ ─ ─ ─ ─           ← intrinsic level (giữa gap)
  VB ──────────────
```

---

### P-type Doping — Acceptor

> [!definition] P-type Semiconductor
> Khi pha tạp với nguyên tử **nhóm III** (3 electron hóa trị): B (boron), Al (aluminium), Ga (gallium).
>
> Nguyên tử acceptor chỉ có 3 electron nhưng cần 4 liên kết → thiếu 1 electron → tạo ra **hole** trong VB. Hole này liên kết lỏng lẻo với acceptor ion âm ($\sim 0.045$ eV trên Ev với B trong Si) → ở room temperature, hole thoát vào VB.
>
> Acceptor ion sau khi nhận electron trở thành ion âm cố định $A^-$ trong mạng.

```
Band diagram p-type:

  CB ──────────────
  EI ─ ─ ─ ─ ─ ─           ← intrinsic level
  EF ─ ─ ─ ─ ─ ─           ← EF dịch xuống gần VB
    ──── Ea ────            ← acceptor level (0.045 eV trên Ev với B)
      ○  ○  ○  ○           ← hole tự do (majority carriers)
  VB ──────────────
```

---

### So sánh N-type và P-type

| Tính chất | N-type | P-type |
|-----------|--------|--------|
| Dopant | Nhóm V: P, As, Sb | Nhóm III: B, Al, Ga |
| Carrier thêm vào | Electron (âm) | Hole (dương) |
| Majority carrier | Electron ($n \approx N_D$) | Hole ($p \approx N_A$) |
| Minority carrier | Hole | Electron |
| Fermi level | Dịch lên gần CB | Dịch xuống gần VB |
| Ion cố định | $D^+$ (dương) | $A^-$ (âm) |

---

### Ionization hoàn toàn ở Room Temperature

Với silicon ở 300 K, năng lượng liên kết của donor/acceptor ($\sim 45$ meV) nhỏ hơn $k_BT \approx 26$ meV theo hệ số $\sim 2$. Tuy nhiên, nhờ entropy và thống kê, ở room temperature **hầu như 100% dopant bị ionize** (gọi là **complete ionization**).

> [!definition] Complete Ionization
> Ở room temperature (300 K), toàn bộ donor và acceptor được coi là bị ionize hoàn toàn:
> - Mỗi donor $D$ cho 1 electron → $n_{donor} = N_D$
> - Mỗi acceptor $A$ nhận 1 electron (giải phóng 1 hole) → $p_{acceptor} = N_A$
>
> trong đó $N_D$ (cm$^{-3}$) là nồng độ donor, $N_A$ (cm$^{-3}$) là nồng độ acceptor.

---

## Mathematical Formalism

### Charge Neutrality Condition

Tinh thể semiconductor luôn **trung hòa điện** ở trạng thái cân bằng — tổng điện tích bằng 0:

$$\underbrace{p}_{\text{hole}(+)} + \underbrace{N_D^+}_{\text{donor ion}(+)} = \underbrace{n}_{\text{electron}(-)} + \underbrace{N_A^-}_{\text{acceptor ion}(-)}$$

Giả sử complete ionization: $N_D^+ = N_D$, $N_A^- = N_A$:

$$p + N_D = n + N_A$$

Kết hợp với mass action law $np = n_i^2$, ta có hệ hai phương trình hai ẩn $n$ và $p$.

---

### Trường hợp N-type thuần ($N_D \gg N_A$, $N_D \gg n_i$)

Charge neutrality: $p + N_D = n$, mà $p \ll n$ nên:

$$n \approx N_D$$

Minority carrier:

$$p = \frac{n_i^2}{n} = \frac{n_i^2}{N_D}$$

---

### Trường hợp P-type thuần ($N_A \gg N_D$, $N_A \gg n_i$)

$$p \approx N_A, \qquad n = \frac{n_i^2}{N_A}$$

---

### Trường hợp tổng quát (có cả donor và acceptor)

Từ charge neutrality $n - p = N_D - N_A$ và $np = n_i^2$:

$$n = \frac{N_D - N_A}{2} + \sqrt{\left(\frac{N_D - N_A}{2}\right)^2 + n_i^2}$$

(chọn nghiệm dương vì $n > 0$). Sau đó $p = n_i^2 / n$.

---

### Fermi Level sau Doping

Từ công thức $n = N_c e^{-(E_c - E_F)/k_BT}$, giải ra $E_F$:

$$E_c - E_F = k_BT \ln\frac{N_c}{n}$$

N-type ($n \approx N_D$):

$$E_F = E_c - k_BT \ln\frac{N_c}{N_D}$$

Vì $N_D < N_c$, $\ln(N_c/N_D) > 0$ → $E_F < E_c$ nhưng **cao hơn** $E_i$ (giữa gap).

P-type ($p \approx N_A$):

$$E_F = E_v + k_BT \ln\frac{N_v}{N_A}$$

$E_F > E_v$ nhưng **thấp hơn** $E_i$.

---

## Derivation — Vì sao Fermi level dịch chuyển khi doping?

Nhìn lại công thức carrier concentration:

$$n = N_c e^{-(E_c - E_F)/k_BT}$$

Công thức này nói rằng: muốn tăng $n$, phải tăng số mũ $(E_c - E_F)/k_BT$, tức là **giảm khoảng cách $E_c - E_F$** → $E_F$ phải dịch **lên phía $E_c$**.

Về mặt vật lý: khi thêm electron (n-type doping), "mức nước electron" trong hệ tăng lên → Fermi level — thước đo mức độ điền đầy — cũng tăng lên tương ứng.

```
Analogy: Bình nước

  Intrinsic:               N-type:                P-type:

  ─────CB──────            ─────CB──────           ─────CB──────
  ┊  (trống)               │////│                  ┊  (trống)
  ┊                 EF→    │////│  ← mức nước       ┊
  ──EF (giữa)──            │////│    dâng lên       ──EF── ↓ thấp xuống
  ┊                        │////│
  ─────VB──────    EF→     ─────VB──────           ─────VB──────
  │////│                   │////│                   │○○○○│ ← holes ở đây
  └────┘                   └────┘                   └────┘
```

---

## Worked Problem

> [!example] Bài toán 6.1 — Carrier concentration trong n-type Si
>
> **Cho**: Silicon doped với phosphorus $N_D = 10^{17}$ cm$^{-3}$. Ở 300 K: $n_i = 1.5 \times 10^{10}$ cm$^{-3}$, $N_c = 2.8 \times 10^{19}$ cm$^{-3}$.
>
> **Tìm**: $n$, $p$, và vị trí $E_F$ so với $E_c$.

**Lời giải:**

Kiểm tra: $N_D = 10^{17} \gg n_i = 1.5 \times 10^{10}$ → complete ionization, dùng xấp xỉ n-type:

$$n \approx N_D = 10^{17} \text{ cm}^{-3}$$

$$p = \frac{n_i^2}{n} = \frac{(1.5 \times 10^{10})^2}{10^{17}} = \frac{2.25 \times 10^{20}}{10^{17}} = 2.25 \times 10^3 \text{ cm}^{-3}$$

Vị trí Fermi level:

$$E_c - E_F = k_BT \ln\frac{N_c}{N_D} = 0.026 \times \ln\frac{2.8 \times 10^{19}}{10^{17}} = 0.026 \times \ln(280) = 0.026 \times 5.635 \approx 0.146 \text{ eV}$$

Vậy $E_F$ nằm **146 meV dưới $E_c$** — khá gần CB.

> [!example] Bài toán 6.2 — Semiconductor có cả donor và acceptor (compensation)
>
> **Cho**: Si có $N_D = 10^{16}$ cm$^{-3}$ và $N_A = 3 \times 10^{15}$ cm$^{-3}$. $n_i = 1.5 \times 10^{10}$ cm$^{-3}$.
>
> **Tìm**: $n$, $p$, và loại semiconductor.

**Lời giải:**

$N_D - N_A = 10^{16} - 3 \times 10^{15} = 7 \times 10^{15}$ cm$^{-3}$ $\gg n_i$

→ Dùng xấp xỉ n-type (donor chiếm ưu):

$$n \approx N_D - N_A = 7 \times 10^{15} \text{ cm}^{-3}$$

$$p = \frac{n_i^2}{n} = \frac{(1.5 \times 10^{10})^2}{7 \times 10^{15}} \approx 3.2 \times 10^4 \text{ cm}^{-3}$$

**Semiconductor là n-type.** Acceptor đã "bù" (compensate) một phần donor, nhưng donor vẫn thắng.

> [!tip] Compensation
> Khi có cả $N_D$ và $N_A$, chúng "trung hòa" nhau. Chỉ có phần dư $|N_D - N_A|$ đóng góp vào carrier concentration. Đây gọi là **compensation doping** — dùng để tinh chỉnh nồng độ hạt tải trong chế tạo linh kiện.

---

## Summary / Key Takeaways

- **Doping** là thêm tạp chất (impurity) có số electron hóa trị khác Si vào mạng tinh thể → thay đổi carrier concentration nhiều bậc.
- **N-type** (donor, nhóm V): thêm electron tự do → $n \approx N_D$, $E_F$ dịch lên gần CB.
- **P-type** (acceptor, nhóm III): thêm hole → $p \approx N_A$, $E_F$ dịch xuống gần VB.
- **Complete ionization** ở 300 K: toàn bộ dopant ionize → dùng $N_D$ hoặc $N_A$ trực tiếp.
- **Charge neutrality**: $p + N_D = n + N_A$ — luôn đúng ở cân bằng.
- **Mass action law** vẫn giữ: $np = n_i^2$ — khi $n$ tăng, $p$ giảm tỉ lệ nghịch.
- **Majority/minority carrier**: doped semiconductor có một loại carrier ưu thế (majority) và loại kia cực ít (minority). Minority carrier đóng vai trò then chốt trong hoạt động của p-n junction.

---

## References

- Pierret, R. F. — *Semiconductor Device Fundamentals*, Ch. 3 (Prentice Hall, 1995)
- Hu, Chenming — *Modern Semiconductor Devices for Integrated Circuits*, Ch. 1 (UC Berkeley, 2009)
- MIT 6.012 — Lecture notes: Doping and Carrier Concentration (ocw.mit.edu)
- Streetman & Banerjee — *Solid State Electronic Devices*, Ch. 4 (Pearson, 2015)
