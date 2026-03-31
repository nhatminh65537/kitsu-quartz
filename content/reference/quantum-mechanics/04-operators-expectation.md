---
title: "04. Operators and Expectation Values"
tags: [physics, quantum-mechanics, lesson-04]
aliases: [Toán tử và giá trị kỳ vọng]
created: 2026-03-27
---

> **Prerequisites**: [[03-schrodinger-equation|03. Phương trình Schrödinger]] — TDSE, TISE, trạng thái dừng.
> **Objectives**:
> - Hiểu tại sao mọi đại lượng vật lý đều tương ứng với một toán tử (operator)
> - Xác định toán tử vị trí $\hat{x}$ và toán tử động lượng $\hat{p}$
> - Tính giá trị kỳ vọng $\langle x \rangle$, $\langle p \rangle$, $\langle H \rangle$ từ hàm sóng
> - Hiểu và sử dụng commutator $[\hat{x}, \hat{p}]$
> - Phát biểu và chứng minh nguyên lý bất định Heisenberg (Heisenberg uncertainty principle)

---

## Motivation

Trong cơ học cổ điển, tất cả đại lượng vật lý — vị trí, động lượng, năng lượng — đều là những **số** xác định tại mỗi thời điểm. Nhưng trong QM, trạng thái hệ là hàm sóng $\Psi$, và mỗi lần đo cho kết quả **ngẫu nhiên**.

Điều này đặt ra câu hỏi: làm sao ta "trích xuất" thông tin vật lý (vị trí, động lượng, năng lượng,...) từ $\Psi$?

Câu trả lời của QM là: **mỗi đại lượng vật lý có thể đo được (observable) tương ứng với một toán tử tuyến tính tác động lên hàm sóng**. Kết quả đo là các giá trị riêng (eigenvalue) của toán tử đó. Đây là cấu trúc toán học trung tâm của toàn bộ QM.

---

## Physical Model

### Toán tử vị trí và động lượng

> [!definition] Definition 4.1 — Toán tử vị trí và động lượng
> Trong biểu diễn tọa độ (position representation), hai toán tử cơ bản là:
>
> **Toán tử vị trí:**
> $$\hat{x} = x \quad \text{(nhân với } x\text{)}$$
>
> **Toán tử động lượng:**
> $$\hat{p} = -i\hbar\frac{\partial}{\partial x}$$

Tại sao $\hat{p} = -i\hbar\partial_x$? Ta thấy từ sóng phẳng $\Psi = e^{i(kx-\omega t)}$: tác dụng $-i\hbar\partial_x$ lên nó:

$$-i\hbar\frac{\partial}{\partial x}\left(e^{ikx}\right) = -i\hbar\cdot ik\cdot e^{ikx} = \hbar k\cdot e^{ikx} = p\cdot e^{ikx}$$

Toán tử $\hat{p}$ "trả về" đúng giá trị động lượng $p = \hbar k$ của sóng phẳng. Đây là nguyên tắc chung: **tác dụng toán tử lên hàm riêng của nó thì nhân thêm trị riêng**.

### Từ đại lượng cổ điển đến toán tử QM

**Quy tắc lượng tử hóa chuẩn (canonical quantization)**: Lấy biểu thức cổ điển, thay $x \to \hat{x}$ và $p \to \hat{p}$:

| Đại lượng cổ điển | Ký hiệu | Toán tử QM |
|---|---|---|
| Vị trí | $x$ | $\hat{x} = x$ |
| Động lượng | $p$ | $\hat{p} = -i\hbar\partial_x$ |
| Động năng | $T = p^2/2m$ | $\hat{T} = -\frac{\hbar^2}{2m}\partial_{xx}$ |
| Thế năng | $V(x)$ | $\hat{V} = V(x)$ |
| Năng lượng toàn phần | $H = T + V$ | $\hat{H} = -\frac{\hbar^2}{2m}\partial_{xx} + V(x)$ |

---

## Mathematical Formalism

### Giá trị kỳ vọng tổng quát

> [!definition] Definition 4.2 — Giá trị kỳ vọng của toán tử $\hat{Q}$
> Với hàm sóng chuẩn hóa $\Psi(x,t)$:
>
> $$\langle \hat{Q} \rangle = \int_{-\infty}^{+\infty} \Psi^*(x,t)\,\hat{Q}\,\Psi(x,t)\,dx$$
>
> Toán tử $\hat{Q}$ tác động lên $\Psi$ ở giữa, **không** phải lên $\Psi^*$.

Cụ thể:

$$\langle x \rangle = \int \Psi^* x\,\Psi\,dx = \int x\,|\Psi|^2\,dx$$

$$\langle p \rangle = \int \Psi^*\left(-i\hbar\frac{\partial}{\partial x}\right)\Psi\,dx$$

$$\langle H \rangle = \int \Psi^*\left(-\frac{\hbar^2}{2m}\frac{\partial^2}{\partial x^2} + V\right)\Psi\,dx$$

### Toán tử Hermitian (Hermitian Operator)

Giá trị kỳ vọng của một đại lượng vật lý phải là số thực (ta đo được số thực). Điều này dẫn đến yêu cầu:

> [!definition] Definition 4.3 — Toán tử Hermitian
> Toán tử $\hat{Q}$ được gọi là **Hermitian** (tự liên hợp, self-adjoint) nếu:
>
> $$\int_{-\infty}^{+\infty} f^*(x)\,\hat{Q}\,g(x)\,dx = \int_{-\infty}^{+\infty} \left(\hat{Q}\,f(x)\right)^* g(x)\,dx$$
>
> Ký hiệu: $\hat{Q}^\dagger = \hat{Q}$.

**Hệ quả quan trọng**: Nếu $\hat{Q}$ Hermitian thì $\langle\hat{Q}\rangle$ thực với mọi $\Psi$.

Cả $\hat{x}$ và $\hat{p}$ đều Hermitian (sẽ kiểm chứng $\hat{p}$ trong bài toán mẫu bên dưới).

### Commutator

Trong cơ học cổ điển, $xp = px$ (số thì giao hoán). Trong QM, các toán tử **không nhất thiết giao hoán**. Ta định nghĩa:

> [!definition] Definition 4.4 — Commutator
> **Commutator** của hai toán tử $\hat{A}$ và $\hat{B}$:
>
> $$[\hat{A}, \hat{B}] = \hat{A}\hat{B} - \hat{B}\hat{A}$$
>
> Nếu $[\hat{A}, \hat{B}] = 0$, ta nói $\hat{A}$ và $\hat{B}$ **giao hoán** (commute).

> [!theorem] Theorem 4.5 — Commutator chính tắc (Canonical Commutation Relation)
> $$[\hat{x}, \hat{p}] = i\hbar$$

**Chứng minh.** Tác dụng $[\hat{x}, \hat{p}]$ lên hàm thử $f(x)$:

$$[\hat{x},\hat{p}]\,f = \hat{x}(\hat{p}f) - \hat{p}(\hat{x}f) = x\left(-i\hbar f'\right) - \left(-i\hbar\right)\frac{d}{dx}(xf)$$

$$= -i\hbar x f' + i\hbar(f + xf') = i\hbar f$$

Vậy $[\hat{x},\hat{p}] = i\hbar$ (hiểu là toán tử "nhân với $i\hbar$"). $\blacksquare$

Đây là một trong những quan hệ quan trọng nhất của QM — nó chứa toàn bộ "sự khác biệt" giữa QM và cơ học cổ điển.

---

### Định lý Ehrenfest — Kết nối với cơ học cổ điển

> [!theorem] Theorem 4.6 — Định lý Ehrenfest
> Các giá trị kỳ vọng tuân theo phương trình giống với cơ học cổ điển:
>
> $$\frac{d\langle x\rangle}{dt} = \frac{\langle p\rangle}{m}, \qquad \frac{d\langle p\rangle}{dt} = -\left\langle\frac{\partial V}{\partial x}\right\rangle$$

**Chứng minh vế trái.** Tính $d\langle x\rangle/dt$:

$$\frac{d\langle x\rangle}{dt} = \frac{d}{dt}\int \Psi^* x\Psi\,dx = \int \left(\partial_t\Psi^*\right)x\Psi\,dx + \int \Psi^* x\,\partial_t\Psi\,dx$$

Từ TDSE: $\partial_t\Psi = \frac{i\hbar}{2m}\partial_{xx}\Psi - \frac{i}{\hbar}V\Psi$. Thế vào và tích phân từng phần hai lần:

$$\frac{d\langle x\rangle}{dt} = \frac{i\hbar}{2m}\int\Psi^*\left(\partial_{xx}\Psi - \Psi^{-1}\partial_{xx}\Psi^*\cdot\Psi\right)x\,dx \to \frac{\langle p\rangle}{m}$$

(Chi tiết tích phân từng phần bỏ qua — kết quả chính là $\langle p\rangle/m$.) $\blacksquare$

Định lý Ehrenfest nói rằng: **trong giới hạn vĩ mô, cơ học lượng tử quy về cơ học Newton** — các giá trị kỳ vọng hành xử như các đại lượng cổ điển.

---

### Nguyên lý bất định Heisenberg

> [!theorem] Theorem 4.7 — Nguyên lý bất định Heisenberg
> Với mọi trạng thái $\Psi$:
>
> $$\Delta x\cdot\Delta p \geq \frac{\hbar}{2}$$
>
> Trong đó $\Delta x = \sqrt{\langle x^2\rangle - \langle x\rangle^2}$ và $\Delta p = \sqrt{\langle p^2\rangle - \langle p\rangle^2}$.

**Ý nghĩa vật lý**: Không thể đồng thời xác định chính xác cả vị trí lẫn động lượng của hạt. Đây **không** phải sai số của máy đo — đây là tính chất nội tại của bản thân trạng thái lượng tử.

**Phác thảo chứng minh.** Định nghĩa $f = (\hat{x} - \langle x\rangle)\Psi$ và $g = (\hat{p} - \langle p\rangle)\Psi$. Áp dụng bất đẳng thức Cauchy-Schwarz:

$$\langle f|f\rangle\langle g|g\rangle \geq |\langle f|g\rangle|^2$$

Vế trái chính là $(\Delta x)^2(\Delta p)^2$. Từ $[\hat{x},\hat{p}] = i\hbar$, phần ảo của $\langle f|g\rangle$ cho $|\langle f|g\rangle| \geq \hbar/2$. Suy ra $\Delta x\cdot\Delta p \geq \hbar/2$. Chứng minh đầy đủ sẽ có ở Lesson 12 (dạng tổng quát).

> [!warning] Dấu đẳng thức đạt khi nào?
> Dấu bằng đạt khi hàm sóng là **hàm Gaussian** — gói sóng Gaussian là trạng thái "bất định tối thiểu" (minimum uncertainty state). Đây là lý do hàm Gaussian xuất hiện khắp nơi trong QM.

---

## Worked Problem

> [!example] Bài toán 4.1 — Tính $\langle p\rangle$ cho trạng thái dừng
>
> Chứng minh rằng với mọi trạng thái dừng thực $\psi_n(x)$, giá trị kỳ vọng động lượng $\langle p\rangle = 0$.

**Lời giải:**

$$\langle p\rangle = \int_{-\infty}^{+\infty}\Psi_n^*\left(-i\hbar\frac{\partial}{\partial x}\right)\Psi_n\,dx = \int\psi_n^*\left(-i\hbar\psi_n'\right)dx$$

(Nhân tử thời gian $e^{\pm iE_n t/\hbar}$ triệt tiêu nhau vì $\Psi_n^*\Psi_n' = \psi_n^*e^{+iE_nt/\hbar}\cdot\psi_n'e^{-iE_nt/\hbar}$.)

Vì $\psi_n$ thực, $\psi_n^* = \psi_n$:

$$\langle p\rangle = -i\hbar\int_{-\infty}^{+\infty}\psi_n\psi_n'\,dx = -i\hbar\int_{-\infty}^{+\infty}\frac{1}{2}\frac{d}{dx}(\psi_n^2)\,dx = -i\hbar\cdot\frac{1}{2}\left[\psi_n^2\right]_{-\infty}^{+\infty} = 0$$

Bằng 0 vì $\psi_n \to 0$ ở vô cùng. Kết quả hợp lý: hạt trong trạng thái dừng không "đi đâu" (xác suất tìm thấy tại mỗi điểm không đổi), nên trung bình động lượng phải bằng 0.

> [!example] Bài toán 4.2 — Kiểm chứng $\hat{p}$ Hermitian
>
> Chứng minh $\hat{p} = -i\hbar\partial_x$ là toán tử Hermitian.

**Lời giải:** Cần chứng minh $\int f^*(-i\hbar g')\,dx = \int(-i\hbar f')^* g\,dx$ với mọi $f, g$ thỏa mãn điều kiện biên.

$$\int_{-\infty}^{+\infty} f^*(-i\hbar g')\,dx = -i\hbar\left[\underbrace{f^*g\Big|_{-\infty}^{+\infty}}_{=0} - \int_{-\infty}^{+\infty}f^{*\prime}g\,dx\right] = i\hbar\int f^{*\prime}g\,dx$$

$$= \int(i\hbar f')^*g\,dx = \int(-i\hbar f')^*\cdot(-1)\cdot(-1)\cdot g\,dx$$

Chờ — viết lại cho rõ:

$$= \int\overline{(-i\hbar f')}g\,dx = \int\left(-i\hbar\frac{d}{dx}\right)^{\dagger}(f)\cdot g\,dx$$

Vế biên bằng 0 do điều kiện biên. Kết quả: $\hat{p}^\dagger = \hat{p}$, tức $\hat{p}$ Hermitian. $\blacksquare$

> [!example] Bài toán 4.3 — Nguyên lý bất định cho hộp vô hạn
>
> Với trạng thái $\psi_1(x) = \sqrt{2/a}\sin(\pi x/a)$ (trạng thái cơ bản của hộp vô hạn), kiểm tra nguyên lý bất định.

**Lời giải:**

Do đối xứng của $|\psi_1|^2$ quanh $x = a/2$: $\langle x\rangle = a/2$.

$$\langle x^2\rangle = \frac{2}{a}\int_0^a x^2\sin^2\!\left(\frac{\pi x}{a}\right)dx = \frac{a^2}{3} - \frac{a^2}{2\pi^2}$$

$$(\Delta x)^2 = \langle x^2\rangle - \langle x\rangle^2 = \frac{a^2}{3} - \frac{a^2}{2\pi^2} - \frac{a^2}{4} = a^2\left(\frac{1}{12} - \frac{1}{2\pi^2}\right)$$

Với $\langle p\rangle = 0$ (chứng minh trên) và $\langle p^2\rangle = \hbar^2k_1^2 = \pi^2\hbar^2/a^2$ (từ TISE: $\hat{T}\psi_1 = E_1\psi_1$):

$$\Delta p = \frac{\pi\hbar}{a}$$

Tích:

$$\Delta x\cdot\Delta p = \frac{\pi\hbar}{a}\cdot a\sqrt{\frac{1}{12} - \frac{1}{2\pi^2}} = \pi\hbar\sqrt{\frac{1}{12} - \frac{1}{2\pi^2}} \approx 0.568\,\hbar > \frac{\hbar}{2}$$

Nguyên lý bất định được thỏa mãn (không đạt dấu bằng vì $\psi_1$ không phải Gaussian).

---

## Summary

- Mọi **observable** trong QM tương ứng với một **toán tử Hermitian**: $\hat{x} = x$, $\hat{p} = -i\hbar\partial_x$, $\hat{H} = -\frac{\hbar^2}{2m}\partial_{xx} + V$.
- **Giá trị kỳ vọng**: $\langle\hat{Q}\rangle = \int\Psi^*\hat{Q}\Psi\,dx$ — trung bình thống kê khi đo nhiều lần.
- **Toán tử Hermitian**: $\hat{Q}^\dagger = \hat{Q}$ đảm bảo giá trị kỳ vọng luôn thực.
- **Canonical commutation relation**: $[\hat{x},\hat{p}] = i\hbar$ — cốt lõi toán học của QM.
- **Định lý Ehrenfest**: $d\langle x\rangle/dt = \langle p\rangle/m$, $d\langle p\rangle/dt = -\langle\partial V/\partial x\rangle$ — kết nối QM với cơ học cổ điển.
- **Nguyên lý bất định Heisenberg**: $\Delta x\cdot\Delta p \geq \hbar/2$ — hệ quả trực tiếp của $[\hat{x},\hat{p}] = i\hbar$, không phải sai số đo lường.

---

## References

- Griffiths — *Introduction to Quantum Mechanics*, 2nd ed., Ch. 1.5–1.6, Ch. 3.5
- MIT OCW 8.04 (Zwiebach 2016) — Lectures 8–10: Operators, expectation values, uncertainty
- MIT OCW 8.04 (Adams 2013) — Lectures 7–8: Operators and the Heisenberg uncertainty principle
- Shankar — *Principles of Quantum Mechanics*, 2nd ed., Ch. 4.2–4.4
