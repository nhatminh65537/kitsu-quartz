---
title: "04. Energy Band Theory"
tags: [physics, semiconductor, device-physics, lesson-04]
aliases: [Energy Band Theory]
created: 2026-03-27
---

> **Prerequisites**: [[02-quantum-mechanics-primer|02. Quantum Mechanics Primer]] — lượng hóa năng lượng, hàm sóng, nguồn gốc của energy bands; [[03-crystal-structure|03. Crystal Structure]] — tinh thể tuần hoàn, liên kết covalent, khái niệm hole
> **Objectives**:
> - Hiểu cơ chế hình thành energy band từ các mức nguyên tử rời rạc
> - Đọc và giải thích energy band diagram (valence band, conduction band, band gap)
> - Phân biệt metal, semiconductor, insulator dựa trên band structure
> - Hiểu khái niệm Fermi level và ý nghĩa của nó trong semiconductor
> - Phân biệt direct vs. indirect band gap và hệ quả thực tế

---

## Motivation

Đây là bài học trung tâm của cả series. Mọi thứ trước đây — cơ học lượng tử, cấu trúc tinh thể — đều dẫn đến đây. Và mọi thứ sau đây — carrier statistics, doping, p-n junction, MOSFET — đều xây dựng trên nền tảng bài này.

Câu hỏi cơ bản là: **Tại sao silicon dẫn điện kém ở room temperature nhưng vẫn dẫn được, trong khi đồng dẫn điện tốt và thủy tinh không dẫn điện?** Câu trả lời không nằm ở cấu tạo nguyên tử đơn lẻ mà nằm ở cách các orbital electron tương tác khi $10^{22}$ nguyên tử xếp lại thành tinh thể.

---

## Physical Model

### Nhắc lại từ Lesson 02: Mức rời rạc → Dải năng lượng

Khi $N$ nguyên tử đến gần nhau trong tinh thể:
- Mỗi mức năng lượng nguyên tử tách thành $N$ mức gần nhau
- $N \sim 10^{22}$ → các mức coi như liên tục → **dải năng lượng** (energy band)
- Giữa các dải là **vùng cấm** (forbidden gap hay band gap) — không tồn tại trạng thái cho electron

```
Quá trình hình thành band khi N tăng:

  N=1        N=2        N=4       N → ∞ (tinh thể)

   ──          ──         ──       ▓▓▓▓▓  Conduction Band (CB)
               ──         ──
                          ──       (band gap Eg)
   ──          ──         ──       ▓▓▓▓▓  Valence Band (VB)
               ──
```

---

### Energy Band Diagram

**Energy band diagram** là biểu đồ quan trọng nhất trong semiconductor physics. Nó vẽ **năng lượng electron** theo **vị trí không gian** $x$ trong vật liệu.

```
Energy band diagram của silicon intrinsic ở room temperature:

  E (eV)
  │
  │    ┌─────────────────────────┐
  Ec ──┤      Conduction Band    ├──   ← đáy conduction band
  │    └─────────────────────────┘
  │                                    Eg = 1.12 eV
  │    ┌─────────────────────────┐
  Ev ──┤       Valence Band      ├──   ← đỉnh valence band
  │    └─────────────────────────┘
  │
  └────────────────────────────────── x
```

> [!definition] Các mức năng lượng quan trọng
> - $E_c$: đáy của conduction band (conduction band edge)
> - $E_v$: đỉnh của valence band (valence band edge)
> - $E_g = E_c - E_v$: band gap — năng lượng tối thiểu để electron nhảy từ VB lên CB
> - $E_F$: Fermi level — mức năng lượng đặc trưng cho trạng thái điền đầy của electron

---

### Kết nối với Lesson 01: Band Diagram là đồ thị thế năng electron

Nhớ lại từ [[01-classical-physics-review|01. Classical Physics Review]]: thế năng electron $U = -eV$.

Khi có điện trường hoặc điện thế thay đổi theo $x$, các mức $E_c$ và $E_v$ cũng **nghiêng** theo:

```
Không có điện trường:           Có điện trường E hướng sang phải:

  E │  ──── Ec                  E │    Ec ╲
    │                             │        ╲
    │  ──── Ev                    │  Ev ╲   ╲
    └──── x                       └──────╲───╲── x

  Band diagram phẳng              Band diagram nghiêng
  → không có dòng điện            → electron (•) lăn xuống dốc sang trái
                                   → hole (○) "nổi" lên sang phải
```

> [!tip] Cách đọc band diagram
> Electron tìm vị trí năng lượng **thấp nhất** → di chuyển theo chiều *xuống dốc* trên band diagram.
> Hole tìm vị trí năng lượng cao nhất trong VB → di chuyển theo chiều *lên dốc* trên band diagram (tức xuống dốc về thế năng lỗ trống).

---

### Kim loại, Bán dẫn, Điện môi — Ba loại vật liệu

Sự khác biệt giữa ba loại vật liệu hoàn toàn được giải thích bằng band structure:

```
     Kim loại (Metal)      Bán dẫn (Semiconductor)    Điện môi (Insulator)

  E │ ▒▒▒▒▒▒ CB (bán đầy)  E │ ░░░░░░ CB (trống)    E │ ░░░░░ CB (trống)
    │─── EF ─── ─ ─ ─         │                         │
    │ ▒▒▒▒▒▒ VB (đầy)         │         Eg~1-2 eV       │        Eg>4 eV
    │                       E │─── EF ───               │
    │                         │ ▓▓▓▓▓▓ VB (đầy)         │─ EF ─
    │                         │                         │ ▓▓▓▓▓ VB (đầy)
```

> [!definition] Phân loại theo band structure
> - **Kim loại**: CB và VB chồng lên nhau, hoặc CB chỉ lấp đầy một phần → $E_F$ nằm trong band → rất nhiều electron tự do gần $E_F$ → dẫn điện tốt.
> - **Semiconductor**: $E_g$ nhỏ (0.1–4 eV) → nhiệt năng tại room temp đủ để kích thích một số electron qua gap → dẫn điện có kiểm soát.
> - **Điện môi (Insulator)**: $E_g$ lớn (>4 eV) → năng lượng nhiệt không đủ → gần như không dẫn điện.

Bảng so sánh:

| Vật liệu | $E_g$ (eV) | Loại |
|---------|----------|------|
| Đồng (Cu) | 0 (overlap) | Kim loại |
| Germanium | 0.66 | Semiconductor |
| Silicon | 1.12 | Semiconductor |
| GaAs | 1.42 | Semiconductor |
| GaN | 3.4 | Wide-gap semiconductor |
| SiO₂ | ~9 | Điện môi (oxide gate trong MOSFET) |
| Kim cương | ~5.5 | Điện môi |

---

### Fermi Level ($E_F$)

Fermi level là một trong những khái niệm quan trọng và hay bị hiểu nhầm nhất trong semiconductor physics.

> [!definition] Fermi Level $E_F$
> Fermi level là mức năng lượng mà tại đó **xác suất một trạng thái bị chiếm bởi electron là đúng 50%** (tại mọi nhiệt độ $T > 0$).
>
> $$f(E_F) = \frac{1}{1 + e^{(E_F - E_F)/k_BT}} = \frac{1}{1+1} = 0.5$$
>
> $E_F$ là thông số đặc trưng cho **trạng thái điền đầy electron** trong hệ tại cân bằng nhiệt.

> [!warning] Fermi level KHÔNG phải là mức năng lượng có electron thật
> Trong semiconductor intrinsic, $E_F$ nằm giữa band gap — nơi không có trạng thái nào. Không có electron nào ở $E_F$. Nhưng $E_F$ vẫn hoàn toàn xác định vì nó là thông số thống kê (thermodynamic quantity), không phải mức năng lượng vật lý.

**Fermi level trong các trường hợp:**

```
Intrinsic Si:               n-type (doped):            p-type (doped):

  CB ────────                CB ────────                CB ────────
           Eg                         Eg                         Eg
  EF ─ ─ ─ ─  ← giữa gap   EF ─ ─  ← gần CB          ─ ─ EF    ← gần VB
  VB ────────                VB ────────                VB ────────
```

Vị trí của $E_F$ **phản ánh loại doping** — đây là lý do band diagram với $E_F$ là công cụ phân tích mạnh mẽ nhất trong device physics. Lesson 06 sẽ phân tích chi tiết.

---

### Direct vs. Indirect Band Gap

Đây là sự phân biệt quan trọng quyết định ứng dụng của từng vật liệu.

Nhớ lại từ Lesson 02: electron trong tinh thể là sóng, đặc trưng bởi vector sóng $\mathbf{k}$ (liên quan đến động lượng: $p = \hbar k$).

> [!definition] Direct Band Gap (Band gap trực tiếp)
> Đáy conduction band ($E_c$) và đỉnh valence band ($E_v$) xảy ra tại **cùng giá trị $k$**. Electron có thể chuyển thẳng từ VB lên CB bằng cách hấp thụ một photon — không cần thay đổi động lượng.

> [!definition] Indirect Band Gap (Band gap gián tiếp)
> Đáy CB và đỉnh VB xảy ra tại **các giá trị $k$ khác nhau**. Để electron nhảy từ VB lên CB, cần cả photon (cung cấp năng lượng) **và** phonon (cung cấp động lượng).

```
E-k diagram minh họa:

  Direct (GaAs):               Indirect (Si):

  E │        *                  E │   *          *
    │       ╱╲                    │  ╱╲
    │  CB  ╱  ╲                   │ VB╲     CB
    │─────────────                │────╲──────────
    │  VB  ╲  ╱                   │     ╲  ╱
    │       ╲╱                    │      ╲╱
    └─────────── k                └──────────── k
         ↑                              ↑
     cùng k → photon đơn           khác k → cần thêm phonon
```

**Hệ quả thực tế:**

| Tính chất | Direct (GaAs, GaN) | Indirect (Si, Ge) |
|-----------|-------------------|------------------|
| Phát sáng (LED, laser) | Hiệu quả cao | Kém (cần phonon) |
| Hấp thụ ánh sáng | Nhanh, lớp mỏng (~1 µm) | Chậm, cần lớp dày (~300 µm) |
| Ứng dụng | LED, laser diode, solar cell màng mỏng | MOSFET, IC, solar cell bulk |

> [!tip] Tại sao chip máy tính dùng Si chứ không phải GaAs?
> Dù GaAs có direct band gap và electron mobility cao hơn Si, silicon vẫn chiếm ưu thế vì: (1) SiO₂ là oxide cách điện tự nhiên hoàn hảo — nền tảng của MOSFET, (2) Silicon phổ biến và rẻ hơn nhiều, (3) Công nghệ chế tạo Si đã được tối ưu hàng thập kỷ.

---

## Mathematical Formalism

### E-k Relation và Effective Mass

Electron tự do có quan hệ năng lượng-động lượng:

$$E = \frac{p^2}{2m_e} = \frac{\hbar^2 k^2}{2m_e}$$

Electron trong tinh thể *gần* đáy CB hoặc đỉnh VB cũng có quan hệ dạng tương tự, nhưng với **khối lượng hiệu dụng** (effective mass) $m^*$ thay cho khối lượng electron thật:

$$E(k) \approx E_c + \frac{\hbar^2 k^2}{2m_e^*}$$

> [!definition] Khối lượng hiệu dụng (Effective Mass) $m^*$
> $m^*$ đặc trưng cho *độ cong* của đường E-k tại đáy CB hoặc đỉnh VB:
>
> $$\frac{1}{m^*} = \frac{1}{\hbar^2} \frac{d^2E}{dk^2}$$
>
> Đơn vị thường dùng: $m^* / m_e$ (tỉ lệ với khối lượng electron tự do).

Với silicon:

| Carrier | Effective mass |
|---------|---------------|
| Electron trong CB | $m_e^* \approx 0.26\, m_e$ |
| Hole trong VB | $m_h^* \approx 0.36\, m_e$ |

Effective mass nhỏ hơn $m_e$ có nghĩa là hạt tải **dễ gia tốc hơn** trong điện trường — điều này ảnh hưởng trực tiếp đến mobility (Lesson 07).

---

## Derivation — Band Gap là "rào năng lượng" tại biên Brillouin zone

Tại sao lại có band gap? Câu trả lời đến từ mô hình **nearly free electron** (electron gần tự do): electron trong tinh thể là sóng bị **tán xạ Bragg** bởi mạng tinh thể tuần hoàn.

Khi bước sóng de Broglie của electron thỏa điều kiện Bragg:

$$2a\sin\theta = n\lambda \quad \Rightarrow \quad k = \frac{n\pi}{a}$$

thì sóng tới và sóng phản xạ **giao thoa** để tạo ra hai trạng thái sóng đứng:

$$\psi_+ \propto \cos\!\left(\frac{\pi x}{a}\right), \qquad \psi_- \propto \sin\!\left(\frac{\pi x}{a}\right)$$

$\psi_+$ tập trung mật độ xác suất tại vị trí nguyên tử (năng lượng thấp hơn → mức thấp hơn = đỉnh VB), còn $\psi_-$ tập trung giữa các nguyên tử (năng lượng cao hơn → mức cao hơn = đáy CB).

Khoảng cách năng lượng giữa hai trạng thái này chính là **band gap $E_g$**.

> [!definition] Nguồn gốc vật lý của Band Gap
> Band gap xuất hiện do **tán xạ Bragg** của electron bởi mạng tuần hoàn. Nó là thước đo **độ mạnh của tương tác** giữa electron và mạng tinh thể — không phải từ một tính chất đặc biệt của từng nguyên tử đơn lẻ.

---

## Worked Problem

> [!example] Bài toán 4.1 — Đọc energy band diagram
>
> **Cho**: Band diagram của một thiết bị bán dẫn như sau:
>
> ```
>  E (eV)
>  │
>  │ 1.5 ── Ec ──────────╲──────
>  │                       ╲
>  │ 0.75── EF ─ ─ ─ ─ ─ ─ ─ ─ ─
>  │                         ╲
>  │ 0.38── Ec ─────────────────── (vùng phải)
>  │
>  │ 0.0 ── Ev ──────────────────
>  └─────────────────────────────── x
>        Vùng trái           Vùng phải
> ```
>
> **Hỏi**:
> a) Band gap của vật liệu là bao nhiêu eV?
> b) Electron sẽ chảy theo hướng nào?
> c) Có điện trường không? Nếu có, hướng nào?

**Lời giải:**

**a)** $E_g = E_c - E_v = 1.5 - 0.0 = 1.5$ eV (tại vùng trái, nơi band phẳng).

**b)** Electron di chuyển xuống dốc trên band diagram → từ **trái sang phải** (theo chiều $E_c$ giảm).

**c)** Band diagram nghiêng → có điện trường. Vì $E_c$ giảm từ trái sang phải, và $E_c(x) = \text{const} - eV(x)$, nên $V(x)$ tăng từ trái sang phải → điện trường $E_x = -dV/dx < 0$ → hướng sang **trái** (−x).

> [!example] Bài toán 4.2 — Năng lượng photon và band gap
>
> **Hỏi**: Ánh sáng có bước sóng bao nhiêu có thể kích thích electron từ VB lên CB trong silicon ($E_g = 1.12$ eV)?

**Lời giải:**

Năng lượng photon cần thiết: $E_{photon} \geq E_g = 1.12$ eV

$$E_{photon} = hf = \frac{hc}{\lambda} \Rightarrow \lambda = \frac{hc}{E_g}$$

$$\lambda = \frac{(6.626 \times 10^{-34})(3 \times 10^8)}{1.12 \times 1.602 \times 10^{-19}} = \frac{1.988 \times 10^{-25}}{1.794 \times 10^{-19}} \approx 1.11 \times 10^{-6} \text{ m} = 1110 \text{ nm}$$

**Nhận xét:** 1110 nm nằm trong vùng **hồng ngoại gần** (near-infrared). Ánh sáng nhìn thấy (400–700 nm) có năng lượng đủ lớn để kích thích silicon → đó là lý do silicon solar cell hấp thụ được ánh sáng mặt trời. Tuy nhiên vì indirect band gap, quá trình này kém hiệu quả hơn GaAs.

---

## Summary / Key Takeaways

- **Energy band** hình thành khi $N \sim 10^{22}$ mức nguyên tử rời rạc tụ lại → VB (đầy) và CB (trống/rỗng), ngăn cách bởi **band gap** $E_g$.
- **Energy band diagram** là đồ thị năng lượng electron theo vị trí $x$ — nền tảng để phân tích mọi linh kiện.
- Ba loại vật liệu: **kim loại** (CB/VB chồng lên nhau), **semiconductor** ($E_g \sim 1$–3 eV), **insulator** ($E_g > 4$ eV).
- **Fermi level** $E_F$: xác suất chiếm = 50% tại $E_F$. Trong intrinsic Si: $E_F$ nằm giữa band gap.
- **Effective mass** $m^*$: electron/hole trong tinh thể "nặng" hay "nhẹ" hơn electron tự do, ảnh hưởng đến mobility.
- **Direct band gap** (GaAs, GaN): thích hợp LED/laser. **Indirect band gap** (Si, Ge): kém hơn cho quang điện, nhưng thống trị electronics.
- Band gap xuất hiện vì tán xạ Bragg của electron sóng bởi mạng tuần hoàn.

---

## References

- Pierret, R. F. — *Semiconductor Device Fundamentals*, Ch. 2–3 (Prentice Hall, 1995)
- Streetman & Banerjee — *Solid State Electronic Devices*, Ch. 3 (Pearson, 2015)
- MIT 6.012 — Lecture notes: Energy Band Theory (ocw.mit.edu)
- Wikipedia — Band gap; Direct and indirect band gaps; Fermi level
- RP Photonics Encyclopedia — Band Gap (rp-photonics.com/band_gap.html)
