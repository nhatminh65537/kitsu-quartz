---
title: "02. Wavefunction and Probability Interpretation"
tags: [physics, quantum-mechanics, lesson-02]
aliases: [Hàm sóng và xác suất]
created: 2026-03-27
---

> **Prerequisites**: [[01-experimental-foundations|01. Thí nghiệm nền tảng & sự ra đời của QM]] — lưỡng tính sóng-hạt, giả thuyết de Broglie.
> **Objectives**:
> - Hiểu hàm sóng ψ(x,t) là gì và tại sao nó phức
> - Phát biểu và áp dụng quy tắc Born (Born rule)
> - Tính toán điều kiện chuẩn hóa (normalization)
> - Hiểu và tính dòng xác suất (probability current)
> - Nhận biết điều kiện để một hàm sóng "vật lý" (physically acceptable)

---

## Motivation

Sau khi chấp nhận rằng electron (và mọi hạt vật chất) có tính chất sóng, câu hỏi tiếp theo là: **sóng đó là sóng của cái gì?**

Với sóng âm, ta có sóng áp suất. Với sóng điện từ, ta có dao động của điện trường và từ trường. Nhưng với electron, không có trường vật lý nào đang dao động cả — electron không "dao động" theo nghĩa cổ điển.

Max Born (1926) đề xuất câu trả lời cấp tiến và đúng đắn: **hàm sóng không mô tả vị trí hay chuyển động cụ thể của hạt, mà mô tả xác suất tìm thấy hạt ở các vị trí khác nhau**. Đây là bước ngoặt triết học lớn nhất trong lịch sử vật lý — từ bỏ thuyết tất định (determinism) của cơ học Newton.

---

## Physical Model

### Hàm sóng là gì?

Trong cơ học lượng tử một chiều, trạng thái của một hạt tại mọi thời điểm được mô tả đầy đủ bởi **hàm sóng** (wavefunction):

$$\Psi(x, t) : \mathbb{R} \times \mathbb{R} \to \mathbb{C}$$

Hàm sóng nhận giá trị phức và phụ thuộc vào cả vị trí $x$ lẫn thời gian $t$. Bản thân $\Psi$ không phải là đại lượng đo được — nó là công cụ toán học mô tả trạng thái lượng tử.

> [!definition] Definition 2.1 — Quy tắc Born (Born Rule)
> Nếu hạt được mô tả bởi hàm sóng $\Psi(x, t)$, thì **xác suất tìm thấy hạt trong đoạn $[x, x + dx]$** tại thời điểm $t$ là:
>
> $$dP = |\Psi(x, t)|^2\, dx$$
>
> Hàm $|\Psi(x,t)|^2 = \Psi^*(x,t)\,\Psi(x,t)$ được gọi là **mật độ xác suất** (probability density), ký hiệu $\rho(x,t)$.

Lưu ý: $|\Psi|^2$ luôn thực và không âm, đúng như mật độ xác suất phải là.

### Tại sao hàm sóng phải phức?

Một câu hỏi tự nhiên: tại sao không dùng hàm thực? Có ba lý do:

**Lý do 1 — Giao thoa.** Sóng de Broglie của hạt tự do có dạng $e^{i(kx - \omega t)}$. Nếu ta chỉ lấy phần thực $\cos(kx - \omega t)$, thì khi hai sóng giao nhau, $|\text{Re}(\Psi)|^2$ không tái tạo đúng vân giao thoa. Biên độ phức mới cho phép mô tả đầy đủ pha và giao thoa.

**Lý do 2 — Phương trình Schrödinger.** Phương trình Schrödinger (bài sau) về cơ bản có dạng $i\partial_t\Psi = \hat{H}\Psi$, với $i = \sqrt{-1}$ xuất hiện tự nhiên từ yêu cầu phương trình có nghiệm dạng sóng.

**Lý do 3 — Pha toàn cục.** $\Psi$ và $e^{i\alpha}\Psi$ (với $\alpha$ thực) mô tả cùng một trạng thái vật lý vì $|e^{i\alpha}\Psi|^2 = |\Psi|^2$. Sự linh hoạt của pha phức là cần thiết trong toán học của QM.

---

## Mathematical Formalism

### Điều kiện chuẩn hóa (Normalization)

Vì xác suất tổng cộng tìm thấy hạt ở đâu đó phải bằng 1:

> [!definition] Definition 2.2 — Điều kiện chuẩn hóa
> Hàm sóng $\Psi(x,t)$ được gọi là **chuẩn hóa** (normalized) nếu:
>
> $$\int_{-\infty}^{+\infty} |\Psi(x,t)|^2\, dx = 1$$
>
> Nếu $\Psi$ chưa chuẩn hóa, ta tìm hằng số $A$ sao cho $A\Psi$ thỏa mãn điều kiện trên.

**Câu hỏi quan trọng**: Nếu tại $t = 0$ hàm sóng đã chuẩn hóa, nó có còn chuẩn hóa tại $t > 0$ không? — Câu trả lời là **có**, miễn là $\Psi$ thỏa mãn phương trình Schrödinger. Điều này sẽ được chứng minh khi học phương trình Schrödinger.

### Giá trị kỳ vọng (Expectation Value)

Do kết quả đo lường là ngẫu nhiên, đại lượng có ý nghĩa vật lý là **giá trị kỳ vọng** — trung bình thống kê của nhiều lần đo trên các bản sao đồng nhất của hệ.

> [!definition] Definition 2.3 — Giá trị kỳ vọng vị trí
>
> $$\langle x \rangle = \int_{-\infty}^{+\infty} x\, |\Psi(x,t)|^2\, dx$$

Đây là trung bình có trọng số của $x$, với trọng số là mật độ xác suất $|\Psi|^2$.

Tương tự, với bất kỳ hàm $f(x)$ nào:

$$\langle f(x) \rangle = \int_{-\infty}^{+\infty} f(x)\, |\Psi(x,t)|^2\, dx$$

### Độ lệch chuẩn và độ bất định

> [!definition] Definition 2.4 — Độ lệch chuẩn
> **Phương sai** của vị trí:
>
> $$\sigma_x^2 = \langle x^2 \rangle - \langle x \rangle^2$$
>
> **Độ lệch chuẩn** (standard deviation) hay **độ bất định** (uncertainty) của vị trí:
>
> $$\Delta x = \sigma_x = \sqrt{\langle x^2 \rangle - \langle x \rangle^2}$$
>
> $\Delta x$ đo mức độ "trải rộng" của phân phối xác suất vị trí — hạt ở đâu không chắc chắn đến mức nào.

---

### Dòng xác suất (Probability Current)

Mật độ xác suất $\rho = |\Psi|^2$ thay đổi theo thời gian khi hàm sóng tiến hóa. Tương tự điện tích bảo toàn trong điện động học, xác suất cũng tuân theo **phương trình liên tục** (continuity equation).

> [!definition] Definition 2.5 — Dòng xác suất
> **Dòng xác suất** (probability current) trong 1D:
>
> $$J(x,t) = \frac{\hbar}{2mi}\left(\Psi^* \frac{\partial\Psi}{\partial x} - \Psi \frac{\partial\Psi^*}{\partial x}\right) = \frac{\hbar}{m}\,\text{Im}\!\left(\Psi^* \frac{\partial\Psi}{\partial x}\right)$$
>
> **Phương trình liên tục**:
>
> $$\frac{\partial\rho}{\partial t} + \frac{\partial J}{\partial x} = 0$$
>
> Ý nghĩa: xác suất không tự nhiên sinh ra hay mất đi — nó "chảy" liên tục từ vùng này sang vùng khác.

$J(x,t)$ có thứ nguyên xác suất/thời gian (hay m⁻¹·s⁻¹ trong hệ SI). Nếu $J > 0$ tại $x$, xác suất đang "chảy" theo chiều dương tại điểm $x$ đó.

---

### Điều kiện hàm sóng vật lý

Không phải hàm phức tùy ý nào cũng có thể là hàm sóng vật lý. Một hàm $\Psi(x,t)$ được chấp nhận phải thỏa mãn:

> [!definition] Definition 2.6 — Hàm sóng vật lý (Physically Acceptable Wavefunction)
> 1. **Có thể chuẩn hóa**: $\int_{-\infty}^{+\infty} |\Psi|^2\, dx < \infty$ (hàm khả tích bình phương, square-integrable).
> 2. **Liên tục**: $\Psi(x,t)$ liên tục tại mọi $x$.
> 3. **Đạo hàm liên tục**: $\partial\Psi/\partial x$ liên tục trừ tại những điểm thế năng $V(x)$ có gián đoạn hữu hạn.
> 4. **Triệt tiêu ở vô cùng**: $\Psi(x,t) \to 0$ khi $x \to \pm\infty$.

Điều kiện 1 loại bỏ các hàm tăng trưởng vô hạn. Điều kiện 2–3 đến từ yêu cầu phương trình Schrödinger có nghĩa. Điều kiện 4 là hệ quả của 1.

---

## Derivation

### Chứng minh phương trình liên tục từ phương trình Schrödinger

*(Phần này trở nên rõ hơn sau Lesson 03, nhưng ta phác thảo ở đây để thấy tính nhất quán.)*

Phương trình Schrödinger (TDSE) có dạng:

$$i\hbar \frac{\partial\Psi}{\partial t} = -\frac{\hbar^2}{2m}\frac{\partial^2\Psi}{\partial x^2} + V\Psi$$

Lấy liên hợp phức:

$$-i\hbar \frac{\partial\Psi^*}{\partial t} = -\frac{\hbar^2}{2m}\frac{\partial^2\Psi^*}{\partial x^2} + V\Psi^*$$

Tính $\partial\rho/\partial t = \partial|\Psi|^2/\partial t = \Psi^*\,\partial_t\Psi + \Psi\,\partial_t\Psi^*$. Thay thế từ hai phương trình trên:

$$\frac{\partial\rho}{\partial t} = \frac{i\hbar}{2m}\left(\Psi^*\frac{\partial^2\Psi}{\partial x^2} - \Psi\frac{\partial^2\Psi^*}{\partial x^2}\right) = \frac{i\hbar}{2m}\frac{\partial}{\partial x}\left(\Psi^*\frac{\partial\Psi}{\partial x} - \Psi\frac{\partial\Psi^*}{\partial x}\right)$$

Nhận ra đây chính là $-\partial J/\partial x$, ta thu được phương trình liên tục. $\blacksquare$

---

## Worked Problem

> [!example] Bài toán 2.1 — Chuẩn hóa hàm Gaussian
>
> Cho hàm sóng tại $t = 0$:
>
> $$\Psi(x, 0) = A\, e^{-x^2/(2\sigma^2)}$$
>
> với $\sigma > 0$ cho trước. Tìm hằng số chuẩn hóa $A$ (thực, dương).

**Lời giải:**

Điều kiện chuẩn hóa:

$$\int_{-\infty}^{+\infty} |A e^{-x^2/(2\sigma^2)}|^2\, dx = A^2 \int_{-\infty}^{+\infty} e^{-x^2/\sigma^2}\, dx = 1$$

Dùng tích phân Gaussian chuẩn $\int_{-\infty}^{+\infty} e^{-\alpha x^2}\, dx = \sqrt{\pi/\alpha}$ với $\alpha = 1/\sigma^2$:

$$A^2 \cdot \sqrt{\pi \sigma^2} = A^2 \sigma\sqrt{\pi} = 1 \implies A = \frac{1}{(\pi\sigma^2)^{1/4}}$$

> [!example] Bài toán 2.2 — Tính giá trị kỳ vọng và độ bất định
>
> Với hàm sóng Gaussian đã chuẩn hóa ở trên, tính $\langle x \rangle$, $\langle x^2 \rangle$, và $\Delta x$.

**Lời giải:**

**Tính $\langle x \rangle$:** Do $|\Psi|^2 = A^2 e^{-x^2/\sigma^2}$ là hàm chẵn (even function) của $x$, và $x$ là hàm lẻ (odd function), tích phân $\int x |\Psi|^2 dx$ bằng 0 (tích hàm chẵn với hàm lẻ là hàm lẻ, tích phân trên toàn trục thực bằng 0):

$$\langle x \rangle = 0$$

**Tính $\langle x^2 \rangle$:** Dùng tích phân Gaussian $\int_{-\infty}^{+\infty} x^2 e^{-\alpha x^2}\, dx = \frac{\sqrt{\pi}}{2\alpha^{3/2}}$:

$$\langle x^2 \rangle = A^2 \int_{-\infty}^{+\infty} x^2 e^{-x^2/\sigma^2}\, dx = \frac{1}{\sigma\sqrt{\pi}} \cdot \frac{\sqrt{\pi}\,\sigma^3}{2} = \frac{\sigma^2}{2}$$

**Độ bất định vị trí:**

$$\Delta x = \sqrt{\langle x^2 \rangle - \langle x \rangle^2} = \sqrt{\frac{\sigma^2}{2} - 0} = \frac{\sigma}{\sqrt{2}}$$

**Ý nghĩa vật lý**: $\sigma$ là thông số "độ rộng" của gói sóng Gaussian. Độ bất định $\Delta x = \sigma/\sqrt{2}$ tỉ lệ thuận với $\sigma$ — gói sóng rộng hơn thì vị trí càng bất định hơn.

> [!example] Bài toán 2.3 — Xác suất tìm thấy hạt trong đoạn
>
> Với hàm sóng Gaussian, tính xác suất tìm thấy hạt trong đoạn $[-\sigma, +\sigma]$.

**Lời giải:**

$$P(-\sigma \leq x \leq \sigma) = \int_{-\sigma}^{\sigma} |\Psi|^2\, dx = \frac{1}{\sigma\sqrt{\pi}} \int_{-\sigma}^{\sigma} e^{-x^2/\sigma^2}\, dx$$

Đổi biến $u = x/\sigma$:

$$= \frac{1}{\sqrt{\pi}} \int_{-1}^{1} e^{-u^2}\, du = \text{erf}(1) \approx 0.843$$

Vậy có khoảng **84.3%** xác suất tìm thấy hạt trong khoảng $[-\sigma, \sigma]$ — trong một độ lệch chuẩn quanh tâm.

---

## Summary

- **Hàm sóng** $\Psi(x,t)$ là hàm phức mô tả đầy đủ trạng thái lượng tử của hạt.
- **Born rule**: $|\Psi(x,t)|^2\, dx$ là xác suất tìm thấy hạt trong $[x, x+dx]$.
- **Chuẩn hóa**: $\int |\Psi|^2\, dx = 1$ là bắt buộc để diễn giải xác suất có nghĩa.
- **Giá trị kỳ vọng**: $\langle x \rangle = \int x |\Psi|^2\, dx$ — trung bình thống kê khi đo nhiều lần.
- **Độ bất định**: $\Delta x = \sqrt{\langle x^2 \rangle - \langle x \rangle^2}$ — không phải sai số đo, mà là tính chất nội tại của trạng thái lượng tử.
- **Dòng xác suất** $J$ và phương trình liên tục $\partial_t\rho + \partial_x J = 0$ đảm bảo xác suất bảo toàn.
- Hàm sóng vật lý phải: khả tích bình phương, liên tục, đạo hàm liên tục, triệt tiêu ở vô cùng.

---

## References

- Griffiths — *Introduction to Quantum Mechanics*, 2nd ed., Ch. 1.1–1.4
- MIT OCW 8.04 (Zwiebach 2016) — Lecture 5: Wavefunction and probability interpretation
- MIT OCW 8.04 (Adams 2013) — Lecture 6: Probability density and current
- Shankar — *Principles of Quantum Mechanics*, 2nd ed., Ch. 4
