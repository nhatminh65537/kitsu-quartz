---
title: "01. Classical Physics Review"
tags: [physics, semiconductor, device-physics, lesson-01]
aliases: [Classical Physics Review]
created: 2026-03-27
---

> **Prerequisites**: Kiến thức phổ thông về điện học (điện tích, điện trường ở mức nhận biết)
> **Objectives**:
> - Hiểu điện tích, điện trường, và điện thế là gì
> - Giải thích mối quan hệ giữa điện trường và điện thế
> - Hiểu khái niệm năng lượng thế năng điện — nền tảng để đọc energy band diagram
> - Làm được bài toán tính điện trường và thế năng trong cấu hình đơn giản

---

## Motivation

Trước khi hiểu được tại sao một transistor hoạt động, bạn cần có một công cụ ngôn ngữ: ngôn ngữ của **điện từ học cổ điển** (classical electromagnetism).

Hầu hết các linh kiện bán dẫn hoạt động dựa trên nguyên lý: *điện tích bị điện trường đẩy và kéo, và điện tích di chuyển từ vùng có thế năng cao sang thấp*. Khi bạn đọc **energy band diagram** (sơ đồ năng lượng dải) của một diode hay transistor — thứ mà hầu hết sách device physics đều dùng — thực chất bạn đang đọc một biểu đồ về **thế năng điện** của electron ở các vị trí khác nhau trong vật liệu.

Nếu không nắm vững điện trường và thế năng điện, energy band diagram sẽ chỉ là một đường cong vô nghĩa. Lesson này xây lại nền tảng đó.

---

## Physical Model

### Điện tích (Electric Charge)

Vật chất có thể mang **điện tích** (electric charge), ký hiệu $q$, đơn vị Coulomb (C).

> [!definition] Điện tích cơ bản
> Điện tích của một electron là $-e$, với $e = 1.602 \times 10^{-19}$ C.
> Điện tích của một proton là $+e$.
>
> Quy ước: điện tích dương (+) và âm (−) tương tác với nhau theo **định luật Coulomb**.

Trong vật lý bán dẫn, nhân vật chính là **electron** (điện tích âm) và **hole** (lỗ trống — sẽ giải thích ở Lesson 04). Hai loại hạt tải điện này bị ảnh hưởng bởi điện trường theo những cách ngược nhau.

---

### Điện trường (Electric Field)

Tưởng tượng bạn đặt một điện tích thử $q_{test}$ vào không gian. Nếu nó cảm nhận được một lực, thì vùng không gian đó đang có **điện trường**.

> [!definition] Điện trường $\mathbf{E}$
> Điện trường tại một điểm là lực tác dụng lên một đơn vị điện tích dương đặt tại điểm đó:
>
> $$\mathbf{E} = \frac{\mathbf{F}}{q_{test}}$$
>
> Đơn vị: V/m (volt per meter) hoặc tương đương N/C.

Điện trường là **đại lượng vectơ** — nó có cả độ lớn và hướng. Hướng của $\mathbf{E}$ là hướng lực tác dụng lên điện tích *dương*.

**Quan sát quan trọng cho semiconductor:**
- Electron (điện tích âm) di chuyển *ngược chiều* điện trường.
- Hole (điện tích dương) di chuyển *cùng chiều* điện trường.

---

### Định luật Coulomb (Coulomb's Law)

> [!definition] Định luật Coulomb
> Lực giữa hai điện tích điểm $q_1$ và $q_2$ cách nhau khoảng $r$:
>
> $$F = k_e \frac{q_1 q_2}{r^2} = \frac{1}{4\pi\varepsilon_0} \frac{q_1 q_2}{r^2}$$
>
> với $k_e = 8.99 \times 10^9$ N·m²/C² và $\varepsilon_0 = 8.85 \times 10^{-12}$ F/m là hằng số điện môi chân không.
>
> Lực hút khi hai điện tích trái dấu, lực đẩy khi cùng dấu.

Từ đây, điện trường của một điện tích điểm $Q$ tại khoảng cách $r$:

$$
E = \frac{1}{4\pi\varepsilon_0} \frac{Q}{r^2}
$$

---

### Điện thế và Thế năng điện

Đây là khái niệm **quan trọng nhất** trong lesson này. Mọi energy band diagram đều là biểu diễn của thế năng điện.

> [!definition] Điện thế $V$ (Electric Potential)
> Điện thế tại một điểm là năng lượng cần thiết để di chuyển một đơn vị điện tích dương từ điểm tham chiếu (thường là vô cực) đến điểm đó:
>
> $$V = \frac{W}{q}$$
>
> với $W$ là công thực hiện. Đơn vị: Volt (V) = J/C.

> [!definition] Thế năng điện (Electric Potential Energy)
> Thế năng điện của một hạt mang điện $q$ tại điểm có điện thế $V$:
>
> $$U = qV$$
>
> Đơn vị: Joule (J) hoặc electron-volt (eV).

**Electron-volt (eV)** là đơn vị năng lượng đặc biệt quan trọng trong semiconductor physics:

$$1 \text{ eV} = 1.602 \times 10^{-19} \text{ J}$$

Đây là năng lượng một electron nhận được khi tăng tốc qua hiệu điện thế 1 V.

---

### Mối quan hệ giữa điện trường và điện thế

Điện trường và điện thế không phải hai khái niệm độc lập — chúng liên hệ mật thiết:

> [!definition] Điện trường từ điện thế
> Trong một chiều (1D), điện trường bằng **gradient âm** của điện thế:
>
> $$E_x = -\frac{dV}{dx}$$
>
> Dấu âm có ý nghĩa vật lý: điện trường hướng từ điện thế **cao** sang điện thế **thấp**.

```
Hình dung bằng ví dụ trực quan:

  Điện thế V(x):
  │
  │   ╲
  │    ╲       ← V giảm theo x
  │     ╲
  └──────────── x

  Điện trường E = -dV/dx > 0 → hướng sang phải (cùng chiều x tăng)
```

---

### Năng lượng của electron trong điện trường

Electron có điện tích $q = -e$ (âm). Thế năng của nó:

$$U_{electron} = (-e) \cdot V = -eV$$

> [!warning] Dấu âm quan trọng!
> Vì electron mang điện tích âm, thế năng của electron **tỉ lệ nghịch** với điện thế:
>
> - Vùng có $V$ cao → electron có thế năng **thấp** → electron bị hút vào
> - Vùng có $V$ thấp → electron có thế năng **cao** → electron bị đẩy ra
>
> Điều này ngược hoàn toàn so với điện tích dương. Khi vẽ energy band diagram, trục năng lượng electron sẽ bị **lật ngược** so với trục điện thế.

Đây là lý do energy band diagram nhìn có vẻ "lộn ngược" so với trực giác điện thế!

---

## Mathematical Formalism

### Phương trình Poisson (Poisson's Equation)

Trong semiconductor, điện thế $V(x)$ và phân bố điện tích $\rho(x)$ liên hệ nhau qua **phương trình Poisson**:

$$
\frac{d^2V}{dx^2} = -\frac{\rho}{\varepsilon}
$$

với $\varepsilon = \varepsilon_0 \varepsilon_r$ là hằng số điện môi của vật liệu ($\varepsilon_r \approx 11.7$ cho silicon).

Hoặc viết theo điện trường:

$$
\frac{d\mathbf{E}}{dx} = \frac{\rho}{\varepsilon}
$$

Phương trình Poisson sẽ xuất hiện lại khi phân tích **vùng depletion** của p-n junction ở Lesson 10.

---

### Năng lượng: Joule vs. eV

Trong semiconductor physics, người ta thường dùng **eV** thay vì Joule vì con số nhỏ hơn nhiều:

| Đại lượng | Giá trị |
|-----------|---------|
| Band gap silicon | $E_g = 1.12$ eV |
| Nhiệt năng ở room temperature | $k_B T \approx 0.026$ eV |
| Điện áp ngưỡng MOSFET | $V_{th} \approx 0.3$–$0.7$ V → tương đương 0.3–0.7 eV |

**Quy đổi**: $E \text{ (eV)} = \frac{E \text{ (J)}}{1.602 \times 10^{-19}}$

---

## Derivation — Điện trường của bản tụ phẳng

Đây là cấu hình quan trọng nhất trong semiconductor: **bản tụ phẳng tích điện đều**, vì depletion region của p-n junction có phân bố điện tích gần như đồng đều.

**Setup:** Hai tấm phẳng song song cách nhau $d$, mang điện tích mặt $+\sigma$ và $-\sigma$.

**Bước 1:** Dùng định luật Gauss, điện trường giữa hai bản:

$$
E = \frac{\sigma}{\varepsilon_0}
$$

Điện trường **đều** và hướng từ bản (+) sang bản (−).

**Bước 2:** Hiệu điện thế giữa hai bản:

$$
V = E \cdot d = \frac{\sigma d}{\varepsilon_0}
$$

**Bước 3:** Thế năng của electron di chuyển từ bản (−) sang bản (+):

$$
\Delta U = q \Delta V = (-e)(V_{+} - V_{-}) = (-e)(+V) = -eV
$$

Thế năng electron **giảm** khi nó di chuyển về phía bản dương — phù hợp với việc electron bị hút về phía điện tích dương.

---

## Worked Problem

> [!example] Bài toán 1.1 — Thế năng electron trong điện trường đều
>
> **Cho**: Một điện trường đều $E = 10^4$ V/m hướng sang phải (+x). Electron xuất phát từ $x = 0$.
>
> **Tìm**:
> a) Điện thế $V(x)$ tại vị trí $x = 1\ \mu\text{m} = 10^{-6}$ m
> b) Thế năng của electron tại $x = 1\ \mu\text{m}$ (đơn vị eV)
> c) Electron sẽ di chuyển theo hướng nào?

**Lời giải:**

**a)** Điện trường và điện thế liên hệ: $E_x = -dV/dx$

Vì $E_x$ đều và dương:

$$
V(x) = V(0) - E_x \cdot x
$$

Chọn mốc $V(0) = 0$:

$$
V(x = 10^{-6}) = -10^4 \times 10^{-6} = -0.01 \text{ V}
$$

**b)** Thế năng electron:

$$
U = qV = (-e) \times (-0.01 \text{ V}) = +0.01 \text{ eV}
$$

Thế năng electron **tăng** khi di chuyển sang phải (theo chiều $\mathbf{E}$).

**c)** Electron sẽ di chuyển theo chiều **giảm thế năng** — tức là về phía **trái** (−x), ngược chiều điện trường.

> [!tip] Quy tắc nhanh
> Electron luôn di chuyển **ngược chiều** điện trường (vì điện tích âm). Nói cách khác: electron "chạy xuống dốc" trên biểu đồ thế năng electron — tức là về phía vùng có điện thế *cao* hơn.

---

## Summary / Key Takeaways

- **Điện trường** $\mathbf{E}$ là lực trên đơn vị điện tích. Electron chịu lực *ngược chiều* $\mathbf{E}$.
- **Điện thế** $V$ và điện trường liên hệ: $E_x = -dV/dx$. Điện trường hướng từ nơi $V$ cao sang thấp.
- **Thế năng electron** $U = -eV$ — *ngược dấu* với điện thế. Electron bị hút về nơi có $V$ cao (thế năng thấp).
- Đơn vị năng lượng chuẩn trong semiconductor: **eV** ($1\ \text{eV} = 1.602 \times 10^{-19}$ J).
- **Phương trình Poisson** $d^2V/dx^2 = -\rho/\varepsilon$ kết nối phân bố điện tích với điện thế — sẽ dùng lại trong p-n junction.
- **Energy band diagram** (sắp học) chính là đồ thị thế năng electron theo vị trí trong vật liệu.

---

## References

- Feynman Lectures on Physics, Vol. 2 — Ch. 4–6 (feynmanlectures.caltech.edu)
- MIT 6.012 — Lecture 1: Introduction to Semiconductors (ocw.mit.edu)
- Pierret, R. F. — *Semiconductor Device Fundamentals*, Ch. 1 (Prentice Hall, 1995)
