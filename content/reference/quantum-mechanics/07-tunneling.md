---
title: "07. Potential Barriers and Quantum Tunneling"
tags: [physics, quantum-mechanics, lesson-07]
aliases: [Hàng rào thế năng và xuyên hầm lượng tử]
created: 2026-03-27
---

> **Prerequisites**: [[05-potential-wells|05. Giếng thế năng vô hạn & hữu hạn]] — giải TISE theo vùng, điều kiện biên, xuyên thấu lượng tử; [[02-wavefunction-probability|02. Hàm sóng & xác suất]] — dòng xác suất $J$.
> **Objectives**:
> - Giải TISE cho hàng rào thế năng vuông góc (rectangular barrier) với mọi năng lượng $E$
> - Xác định hệ số truyền qua $T$ và hệ số phản xạ $R$, kiểm tra $T + R = 1$
> - Phân tích hiện tượng **xuyên hầm lượng tử** (quantum tunneling) khi $E < V_0$
> - Hiểu xấp xỉ WKB cho tunneling qua hàng rào tổng quát
> - Phân tích hai ứng dụng thực tiễn: phân rã alpha và kính hiển vi đầu dò quét (STM)

---

## Motivation

Trong Lesson 05, ta thấy hàm sóng của giếng hữu hạn "rò ra" ngoài vùng cấm kinh điển. Điều gì xảy ra nếu vùng cấm đó là **hữu hạn** — tức có một bức tường mà bên kia là vùng tự do? Khi đó hạt có thể **xuyên qua** bức tường, dù năng lượng của nó thấp hơn chiều cao bức tường.

Hiện tượng này — **xuyên hầm lượng tử** (quantum tunneling) — không có đối ứng cổ điển nào. Nó là nền tảng vật lý của:

- **Phân rã alpha** (Gamow 1928): hạt alpha thoát khỏi hạt nhân dù năng lượng thấp hơn hàng rào Coulomb.
- **Kính hiển vi đầu dò quét (STM)**: dòng electron xuyên hầm qua khe hở chân không, cho phép nhìn thấy từng nguyên tử.
- **Transistor MOSFET** trong chip silicon hiện đại: rò rỉ điện tử qua cổng điện môi mỏng.
- **Phản ứng nhiệt hạch trong lòng Mặt Trời**: proton vượt qua hàng rào Coulomb ở nhiệt độ thấp hơn kỳ vọng.

---

## Physical Model

### Scattering states — Khái niệm nền tảng

Khác với bound states (hạt bị giam, $E < V_\infty$, phổ rời rạc), **scattering states** mô tả hạt "đến từ vô cùng, tương tác với thế năng, rồi đi về vô cùng". Ở đây $E > 0$ và phổ năng lượng **liên tục**.

Ta mô hình hóa bằng **sóng tới** (incident wave) từ trái sang phải, gặp hàng rào, tạo ra **sóng phản xạ** (reflected wave) và **sóng truyền qua** (transmitted wave):

```
 Incident →    ← Reflected      Transmitted →
─────────────[  Barrier  ]──────────────────
   Region I       II              III
```

### Hàng rào thế năng vuông góc

> [!definition] Definition 7.1 — Rectangular Potential Barrier
>
> $$V(x) = \begin{cases} 0 & x < 0 \text{ (Vùng I)} \\ V_0 & 0 \leq x \leq a \text{ (Vùng II)} \\ 0 & x > a \text{ (Vùng III)} \end{cases}$$

---

## Mathematical Formalism

### Trường hợp $E > V_0$ — Truyền qua cổ điển nhưng có phản xạ

Dù cổ điển hạt vượt qua hoàn toàn, QM cho thấy **luôn có phản xạ một phần** tại biên thế năng — giống ánh sáng phản xạ tại mặt kính.

**Vùng I và III** ($V = 0$): $\psi'' = -k^2\psi$, $k = \sqrt{2mE}/\hbar$.

$$\psi_\text{I} = Ae^{ikx} + Be^{-ikx}, \qquad \psi_\text{III} = Fe^{ikx}$$

(Không có sóng $e^{-ikx}$ ở vùng III — không có nguồn phát từ bên phải.)

**Vùng II** ($V = V_0$, $E > V_0$): $\psi'' = -l^2\psi$, $l = \sqrt{2m(E-V_0)}/\hbar$.

$$\psi_\text{II} = Ce^{ilx} + De^{-ilx}$$

**Điều kiện biên** tại $x = 0$ và $x = a$: $\psi$ và $\psi'$ liên tục. Giải hệ 4 phương trình 5 ẩn $(A,B,C,D,F)$ — chuẩn hóa bằng $A = 1$.

### Trường hợp $E < V_0$ — Tunneling

Đây là trường hợp thú vị. Trong vùng II: $\psi'' = \kappa^2\psi$, $\kappa = \sqrt{2m(V_0-E)}/\hbar > 0$.

$$\psi_\text{II} = Ce^{\kappa x} + De^{-\kappa x}$$

Hàm sóng **không dao động** mà **suy giảm theo mũ** trong hàng rào — đây là vùng cấm kinh điển.

Áp dụng điều kiện biên tại $x=0$ và $x=a$, giải ra $F$ theo $A$. Sau nhiều đại số:

> [!definition] Definition 7.2 — Hệ số truyền qua và phản xạ
>
> **Hệ số truyền qua** (transmission coefficient):
>
> $$T = \frac{|F|^2}{|A|^2} = \frac{|J_\text{trans}|}{|J_\text{inc}|}$$
>
> **Hệ số phản xạ** (reflection coefficient):
>
> $$R = \frac{|B|^2}{|A|^2} = \frac{|J_\text{refl}|}{|J_\text{inc}|}$$
>
> **Bảo toàn xác suất**: $T + R = 1$.

**Kết quả tường minh cho $E < V_0$** (tunneling):

$$T = \left[1 + \frac{(k^2 + \kappa^2)^2}{4k^2\kappa^2}\sinh^2(\kappa a)\right]^{-1}$$

Trong giới hạn hàng rào dày $\kappa a \gg 1$ (xấp xỉ thực tế phổ biến), $\sinh(\kappa a) \approx e^{\kappa a}/2$:

> [!definition] Definition 7.3 — Xấp xỉ hàng rào dày
>
> $$T \approx \frac{16k^2\kappa^2}{(k^2+\kappa^2)^2}\,e^{-2\kappa a} \approx e^{-2\kappa a}$$
>
> Hệ số truyền qua **suy giảm theo mũ** với chiều rộng hàng rào $a$ và $\kappa = \sqrt{2m(V_0-E)}/\hbar$.

**Đây là công thức cốt lõi của tunneling**: $T$ phụ thuộc rất nhạy vào $a$ và hiệu $V_0 - E$.

---

### Xấp xỉ WKB cho hàng rào tổng quát

Với hàng rào thế năng tổng quát $V(x)$ (không nhất thiết vuông góc), **xấp xỉ Wentzel-Kramers-Brillouin (WKB)** cho:

> [!definition] Definition 7.4 — Công thức WKB cho tunneling
>
> $$T \approx e^{-2\gamma}, \qquad \gamma = \int_{x_1}^{x_2}\kappa(x)\,dx = \frac{1}{\hbar}\int_{x_1}^{x_2}\sqrt{2m[V(x)-E]}\,dx$$
>
> Trong đó $x_1, x_2$ là hai điểm quay cổ điển (classical turning points): $V(x_1) = V(x_2) = E$.

WKB hợp lệ khi thế năng biến thiên chậm so với bước sóng de Broglie — thỏa mãn với hầu hết bài toán thực tế.

---

## Derivation

### Ứng dụng 1 — Phân rã Alpha (Gamow 1928)

Hạt alpha (${}^4\text{He}$, khối lượng $m = 4\,\text{u}$) thoát khỏi hạt nhân. Thế năng:

- Bên trong hạt nhân ($r < R$): lực hạt nhân mạnh → hố thế sâu.
- Bên ngoài ($r > R$): hàng rào Coulomb $V(r) = \frac{2Ze^2}{4\pi\epsilon_0 r}$ (lực đẩy).

Hạt alpha có năng lượng $E < V_\text{max}$ nhưng vẫn thoát ra được nhờ tunneling. Áp dụng WKB:

$$\gamma = \frac{\sqrt{2m}}{\hbar}\int_R^{r_c}\sqrt{\frac{2Ze^2}{4\pi\epsilon_0 r} - E}\,dr$$

với $r_c = 2Ze^2/(4\pi\epsilon_0 E)$ là điểm quay ngoài. Tính tích phân này (thay $r = r_c\sin^2\theta$):

$$\gamma = \frac{\pi Ze^2}{4\pi\epsilon_0\hbar v} - \frac{\sqrt{2mE}}{\hbar}\sqrt{4RZ e^2/(4\pi\epsilon_0)} + \ldots$$

Kết quả: $\ln T \propto -Z/v$ với $v$ là tốc độ hạt alpha. Đây là **công thức Geiger-Nuttall** (1911) — được giải thích lý thuyết lần đầu bởi Gamow từ tunneling QM, một chiến thắng lớn của cơ học lượng tử.

### Ứng dụng 2 — STM (Scanning Tunneling Microscope)

Đầu dò STM (bằng kim loại, bán kính $\sim 1$ nguyên tử) đặt cách bề mặt mẫu khoảng $d \sim 5$–10 Å. Electron xuyên hầm qua khe chân không.

Hàng rào là khoảng trống $V_0 \approx \phi$ (work function, $\sim 4$–5 eV), $E = E_F$ (Fermi energy). Áp dụng công thức hàng rào dày:

$$T \propto e^{-2\kappa d}, \qquad \kappa = \frac{\sqrt{2m\phi}}{\hbar} \approx 1\,\text{Å}^{-1}$$

**Nhạy cảm đặc biệt**: khi $d$ tăng 1 Å, $T$ giảm $e^{-2} \approx 7.4$ lần — dòng điện giảm ~$10\times$. Đây là nguyên lý hoạt động của STM: đo dòng tunneling để dựng hình ảnh nguyên tử với độ phân giải $< 0.1$ Å.

---

## Worked Problem

> [!example] Bài toán 7.1 — Electron xuyên hầm qua hàng rào
>
> Electron ($m = 9.11\times10^{-31}$ kg) có năng lượng $E = 1$ eV gặp hàng rào $V_0 = 2$ eV, dày $a = 1$ nm. Tính hệ số truyền qua $T$.

**Lời giải:**

Tính $\kappa$:

$$\kappa = \frac{\sqrt{2m(V_0-E)}}{\hbar} = \frac{\sqrt{2\times9.11\times10^{-31}\times1.602\times10^{-19}}}{1.055\times10^{-34}} \approx 5.12\times10^9\,\text{m}^{-1}$$

Tích $\kappa a = 5.12\times10^9 \times 1\times10^{-9} = 5.12 \gg 1$ — xấp xỉ hàng rào dày hợp lệ.

Tính tiền tố: $k = \sqrt{2mE}/\hbar \approx 5.12\times10^9$ m$^{-1}$ (cùng cỡ $\kappa$), nên:

$$\frac{16k^2\kappa^2}{(k^2+\kappa^2)^2} = \frac{16\times1}{(1+1)^2} = 1$$

(Ước tính đơn giản vì $k \approx \kappa$.)

$$T \approx e^{-2\times5.12} = e^{-10.24} \approx 3.6\times10^{-5}$$

Khoảng $0.004\%$ electron vượt qua hàng rào — nhỏ nhưng **khác không**, và hoàn toàn đo được.

> [!example] Bài toán 7.2 — Độ nhạy của STM
>
> Với $\kappa = 1$ Å$^{-1}$, hỏi khoảng cách đầu dò cần thay đổi bao nhiêu Å để dòng tunneling thay đổi một thập phân vị (factor of 10)?

**Lời giải:**

$T \propto e^{-2\kappa d}$, nên $T_2/T_1 = e^{-2\kappa(d_2 - d_1)} = 1/10$.

$$2\kappa\,\Delta d = \ln 10 \implies \Delta d = \frac{\ln 10}{2\kappa} = \frac{2.303}{2\times1} \approx 1.15\,\text{Å}$$

Dịch chuyển đầu dò chưa đầy **1.2 Å** — nhỏ hơn đường kính một nguyên tử — đã thay đổi dòng điện 10 lần. Đây là nguồn gốc độ phân giải nguyên tử của STM.

---

## Summary

- **Scattering states**: hạt đến từ vô cùng, gặp hàng rào → phản xạ (hệ số $R$) và truyền qua (hệ số $T$), với $T + R = 1$.
- Ngay cả khi $E > V_0$, vẫn có **phản xạ một phần** tại biên thế năng.
- Khi $E < V_0$ (**tunneling**): hàm sóng suy giảm theo mũ $e^{-\kappa x}$ trong hàng rào, nhưng có biên độ khác không ở phía bên kia — xác suất truyền qua $T > 0$.
- Xấp xỉ hàng rào dày: $T \approx e^{-2\kappa a}$, $\kappa = \sqrt{2m(V_0-E)}/\hbar$.
- **WKB**: $T \approx e^{-2\gamma}$ với $\gamma = \frac{1}{\hbar}\int_{x_1}^{x_2}\sqrt{2m(V-E)}\,dx$ — tổng quát cho hàng rào bất kỳ.
- Ứng dụng: phân rã alpha (Gamow), STM (độ phân giải nguyên tử), transistor, nhiệt hạch Mặt Trời.

---

## References

- Griffiths — *Introduction to Quantum Mechanics*, 2nd ed., Ch. 2.5–2.6
- MIT OCW 8.04 (Zwiebach 2016) — Lectures 21–24: Scattering, tunneling, WKB
- Feynman Lectures Vol. 3, Ch. 8: Particle states in a box (tunneling context)
- Gamow, G. (1928) — "Zur Quantentheorie des Atomkernes" — bài báo gốc về tunneling alpha
