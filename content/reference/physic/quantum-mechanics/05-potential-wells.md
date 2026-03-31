---
title: "05. Potential Wells — Infinite and Finite"
tags: [physics, quantum-mechanics, lesson-05]
aliases: [Giếng thế năng vô hạn và hữu hạn]
created: 2026-03-27
---

> **Prerequisites**: [[03-schrodinger-equation|03. Phương trình Schrödinger]] — TISE, trạng thái dừng; [[04-operators-expectation|04. Toán tử & giá trị kỳ vọng]] — $\hat{p}$, nguyên lý bất định.
> **Objectives**:
> - Giải hoàn chỉnh TISE cho giếng vô hạn (infinite square well): hàm riêng, trị riêng, chuẩn hóa
> - Hiểu nguồn gốc vật lý của lượng tử hóa năng lượng và zero-point energy
> - Giải TISE cho giếng hữu hạn (finite square well): phân loại bound state vs. scattering state
> - So sánh hai bài toán và nhận biết hiệu ứng xuyên thấu (penetration) vào vùng cấm kinh điển
> - Xây dựng nghiệm tổng quát từ điều kiện đầu cho giếng vô hạn

---

## Motivation

Trong Lesson 03 ta đã giải thoáng qua bài toán hộp vô hạn. Lesson này đào sâu hơn: đây là **bài toán QM hoàn chỉnh đầu tiên** mà ta giải từ đầu đến cuối, bao gồm cả việc tính giá trị kỳ vọng, độ bất định, và xây dựng nghiệm tổng quát.

Tại sao bài toán này quan trọng đến vậy?

Thứ nhất, nó minh họa rõ nhất **lượng tử hóa năng lượng** — tại sao electron trong nguyên tử chỉ ở những mức năng lượng rời rạc. Thứ hai, nó là nguyên mẫu (prototype) cho mọi bài toán bị giam cầm (confined system): quantum dot, giếng lượng tử bán dẫn, electron trong hộp kim loại. Thứ ba, kỹ thuật giải (phân vùng, áp dụng điều kiện biên) được dùng lại trong mọi bài toán thế năng từ đây trở đi.

---

## Physical Model

### Giếng vô hạn (Infinite Square Well)

> [!definition] Definition 5.1 — Giếng thế năng vô hạn
> Thế năng dạng:
>
> $$V(x) = \begin{cases} 0 & 0 < x < a \\ \infty & \text{otherwise} \end{cases}$$
>
> Hạt **không thể** tồn tại bên ngoài giếng, nên $\psi(x) = 0$ với $x \leq 0$ và $x \geq a$. Điều kiện biên (boundary conditions):
>
> $$\psi(0) = 0, \qquad \psi(a) = 0$$

Bên trong giếng ($0 < x < a$), $V = 0$, TISE là:

$$-\frac{\hbar^2}{2m}\psi'' = E\psi \implies \psi'' = -k^2\psi, \quad k = \sqrt{\frac{2mE}{\hbar^2}} > 0$$

---

## Mathematical Formalism

### Giải đầy đủ — Giếng vô hạn

Nghiệm tổng quát bên trong: $\psi(x) = A\sin(kx) + B\cos(kx)$.

**Điều kiện $\psi(0) = 0$:** $B = 0$, suy ra $\psi = A\sin(kx)$.

**Điều kiện $\psi(a) = 0$:** $A\sin(ka) = 0$. Vì $A \neq 0$:

$$ka = n\pi,\quad n = 1, 2, 3, \ldots \quad (n = 0 \text{ cho } \psi \equiv 0, \text{ loại})$$

> [!definition] Definition 5.2 — Hàm riêng và trị riêng của giếng vô hạn
>
> **Hàm riêng (eigenfunctions):**
>
> $$\psi_n(x) = \sqrt{\frac{2}{a}}\sin\!\left(\frac{n\pi x}{a}\right), \quad n = 1, 2, 3, \ldots$$
>
> **Trị riêng năng lượng (energy eigenvalues):**
>
> $$E_n = \frac{\hbar^2\pi^2}{2ma^2}\,n^2 = n^2 E_1, \quad E_1 = \frac{\pi^2\hbar^2}{2ma^2}$$
>
> $E_1$ là **năng lượng điểm không** (zero-point energy) — mức năng lượng thấp nhất, luôn dương.

Hệ số $\sqrt{2/a}$ đến từ chuẩn hóa:

$$\int_0^a \left|\psi_n\right|^2 dx = \frac{2}{a}\int_0^a \sin^2\!\left(\frac{n\pi x}{a}\right)dx = \frac{2}{a}\cdot\frac{a}{2} = 1 \checkmark$$

**Tập $\{\psi_n\}$ trực chuẩn (orthonormal):**

$$\int_0^a \psi_m(x)\,\psi_n(x)\,dx = \delta_{mn}$$

Trong đó $\delta_{mn}$ là delta Kronecker (bằng 1 nếu $m = n$, bằng 0 nếu $m \neq n$).

### Nghiệm tổng quát và hệ số khai triển

Nghiệm tổng quát của TDSE:

$$\Psi(x,t) = \sum_{n=1}^{\infty} c_n\,\psi_n(x)\,e^{-iE_n t/\hbar}$$

Cho trước $\Psi(x,0)$, các hệ số $c_n$ tìm bằng **tích phân chiếu** (projection):

$$c_n = \int_0^a \psi_n(x)\,\Psi(x,0)\,dx$$

Điều kiện chuẩn hóa tổng quát:

$$\sum_{n=1}^{\infty}|c_n|^2 = 1, \qquad \langle H\rangle = \sum_{n=1}^{\infty}|c_n|^2 E_n$$

---

### Giếng hữu hạn (Finite Square Well)

Thực tế không có giếng vô hạn — hãy xét thế năng thực tế hơn:

> [!definition] Definition 5.3 — Giếng thế năng hữu hạn
>
> $$V(x) = \begin{cases} -V_0 & |x| < a \\ 0 & |x| > a \end{cases}$$
>
> với $V_0 > 0$. (Lấy đáy giếng âm, bên ngoài bằng 0 — cách viết thông dụng.)

Phân hai trường hợp theo năng lượng $E$:

**Bound states** ($-V_0 < E < 0$): hạt bị bẫy trong giếng.

**Scattering states** ($E > 0$): hạt "bay qua" giếng, có thể bị tán xạ.

Ta tập trung vào **bound states** — chúng tương ứng với các mức năng lượng rời rạc.

#### Giải bound states của giếng hữu hạn

**Bên trong** ($|x| < a$): $V = -V_0$, TISE là $\psi'' = -l^2\psi$ với $l = \sqrt{2m(E+V_0)}/\hbar > 0$.

$$\psi_{\text{in}} = A\cos(lx) + B\sin(lx) \quad \text{(chọn theo chẵn/lẻ — xem dưới)}$$

**Bên ngoài** ($|x| > a$): $V = 0$, $E < 0$, TISE là $\psi'' = \kappa^2\psi$ với $\kappa = \sqrt{-2mE}/\hbar > 0$.

$$\psi_{\text{out}} = Ce^{-\kappa x} \text{ (phải)} \quad \text{và} \quad \psi_{\text{out}} = De^{+\kappa x} \text{ (trái)}$$

(Loại nghiệm tăng trưởng ra vô cùng.)

**Dùng đối xứng:** $V(x)$ là hàm chẵn ($V(-x) = V(x)$), nên hàm riêng phải là **hàm chẵn hoặc hàm lẻ**.

> [!definition] Definition 5.4 — Điều kiện lượng tử hóa của giếng hữu hạn
>
> **Trạng thái chẵn (even states):**
>
> $$l\tan(la) = \kappa$$
>
> **Trạng thái lẻ (odd states):**
>
> $$-l\cot(la) = \kappa$$
>
> Đây là **phương trình siêu việt** (transcendental equation) — không có nghiệm giải tích đóng, phải giải số hoặc đồ thị.

**Phân tích đồ thị** (thay biến $z = la$, $z_0 = a\sqrt{2mV_0}/\hbar$):

- Số bound states phụ thuộc vào $z_0$ (độ sâu và độ rộng giếng).
- Luôn tồn tại **ít nhất một bound state** bất kể $V_0$ nhỏ đến đâu (đặc trưng của giếng 1D).
- Mỗi khi $z_0$ vượt qua bội số nguyên của $\pi/2$, thêm một bound state mới xuất hiện.

---

## Derivation

### So sánh giếng vô hạn và hữu hạn — Hiệu ứng xuyên thấu

Điểm khác biệt quan trọng nhất giữa hai bài toán:

Trong giếng **vô hạn**: $\psi(x) = 0$ ngay tại biên và bên ngoài — hạt **tuyệt đối không** ở ngoài giếng.

Trong giếng **hữu hạn**: $\psi(x) = Ce^{-\kappa|x|}$ bên ngoài — hàm sóng **rò ra** ngoài vùng cấm kinh điển!

> [!warning] Hiệu ứng xuyên thấu lượng tử (Quantum Penetration)
> Trong vùng $|x| > a$ của giếng hữu hạn, hạt có xác suất $|\psi|^2 = C^2 e^{-2\kappa|x|} > 0$ dù về mặt cổ điển, tại đây năng lượng tổng $E < 0 < V = 0$ — tức "năng lượng động học âm".
>
> Hiệu ứng này là tiền thân của **xuyên hầm lượng tử** (quantum tunneling) — sẽ phân tích chi tiết ở Lesson 07.

Chiều dài thấm sâu (penetration depth): $\delta = 1/\kappa = \hbar/\sqrt{-2mE}$. Giếng càng nông ($E$ gần 0), hàm sóng thấm ra ngoài càng xa.

**Hệ quả cho năng lượng**: Năng lượng trong giếng hữu hạn **thấp hơn** năng lượng tương ứng của giếng vô hạn, vì hàm sóng "rộng hơn hiệu dụng" — xác suất trải rộng ra ngoài làm giảm động năng trung bình.

---

## Worked Problem

> [!example] Bài toán 5.1 — Giá trị kỳ vọng và độ bất định trong giếng vô hạn
>
> Với trạng thái $\psi_n$ của giếng vô hạn, tính $\langle x\rangle$, $\langle x^2\rangle$, $\langle p\rangle$, $\langle p^2\rangle$, $\Delta x$, $\Delta p$ và kiểm tra nguyên lý bất định.

**Lời giải:**

**$\langle x\rangle$:** Do $|\psi_n|^2 = (2/a)\sin^2(n\pi x/a)$ đối xứng qua $x = a/2$:

$$\langle x\rangle = \frac{a}{2}$$

**$\langle x^2\rangle$:** Dùng $\sin^2\theta = \frac{1}{2}(1-\cos 2\theta)$ và tích phân từng phần:

$$\langle x^2\rangle = \frac{2}{a}\int_0^a x^2\sin^2\!\left(\frac{n\pi x}{a}\right)dx = \frac{a^2}{3} - \frac{a^2}{2n^2\pi^2}$$

**$(\Delta x)^2$:**

$$(\Delta x)^2 = \langle x^2\rangle - \langle x\rangle^2 = \frac{a^2}{3} - \frac{a^2}{2n^2\pi^2} - \frac{a^2}{4} = a^2\!\left(\frac{1}{12} - \frac{1}{2n^2\pi^2}\right)$$

**$\langle p\rangle = 0$** (đã chứng minh trong Lesson 04 — trạng thái dừng thực).

**$\langle p^2\rangle$:** Từ TISE: $\hat{T}\psi_n = E_n\psi_n$, suy ra $-\frac{\hbar^2}{2m}\psi_n'' = E_n\psi_n$, tức $\hat{p}^2\psi_n = 2mE_n\psi_n$:

$$\langle p^2\rangle = \int\psi_n(-\hbar^2\partial_{xx})\psi_n\,dx = 2mE_n = \frac{n^2\pi^2\hbar^2}{a^2}$$

**$\Delta p$:**

$$\Delta p = \sqrt{\langle p^2\rangle} = \frac{n\pi\hbar}{a}$$

**Kiểm tra nguyên lý bất định:**

$$\Delta x\cdot\Delta p = \frac{n\pi\hbar}{a}\cdot a\sqrt{\frac{1}{12} - \frac{1}{2n^2\pi^2}} = n\pi\hbar\sqrt{\frac{1}{12} - \frac{1}{2n^2\pi^2}}$$

Với $n = 1$: $\Delta x\cdot\Delta p = \pi\hbar\sqrt{1/12 - 1/(2\pi^2)} \approx 0.568\,\hbar > \hbar/2$ ✓

Khi $n \to \infty$: $\Delta x \to a/\sqrt{12}$, $\Delta p \to \infty$ — hạt ở trạng thái năng lượng cao có động lượng rất bất định.

> [!example] Bài toán 5.2 — Xây dựng nghiệm tổng quát
>
> Tại $t = 0$, hàm sóng của hạt trong giếng vô hạn là:
>
> $$\Psi(x,0) = Ax(a - x), \quad 0 < x < a$$
>
> Tìm hệ số $c_n$ và viết $\Psi(x,t)$.

**Lời giải:**

**Chuẩn hóa $A$:**

$$\int_0^a A^2 x^2(a-x)^2\,dx = A^2\cdot\frac{a^5}{30} = 1 \implies A = \sqrt{\frac{30}{a^5}}$$

**Tìm $c_n$:**

$$c_n = \int_0^a \psi_n(x)\,\Psi(x,0)\,dx = \sqrt{\frac{2}{a}}\cdot\sqrt{\frac{30}{a^5}}\int_0^a x(a-x)\sin\!\left(\frac{n\pi x}{a}\right)dx$$

Tích phân từng phần hai lần (hoặc tra bảng):

$$\int_0^a x(a-x)\sin\!\left(\frac{n\pi x}{a}\right)dx = \frac{2a^3}{n^3\pi^3}\left[1 - (-1)^n\right] = \begin{cases} \dfrac{4a^3}{n^3\pi^3} & n \text{ lẻ} \\[6pt] 0 & n \text{ chẵn} \end{cases}$$

Suy ra:

$$c_n = \begin{cases} \dfrac{4\sqrt{60}}{n^3\pi^3} & n \text{ lẻ} \\[6pt] 0 & n \text{ chẵn} \end{cases}$$

Chỉ các trạng thái $n$ lẻ đóng góp (do $\Psi(x,0)$ là hàm chẵn quanh $a/2$, chỉ chồng chất với $\psi_n$ chẵn).

**Nghiệm tổng quát:**

$$\Psi(x,t) = \sum_{n=1,3,5,\ldots} \frac{4\sqrt{60}}{n^3\pi^3}\,\psi_n(x)\,e^{-in^2\omega_1 t}$$

với $\omega_1 = E_1/\hbar = \pi^2\hbar/(2ma^2)$.

---

## Summary

- **Giếng vô hạn**: $\psi_n = \sqrt{2/a}\sin(n\pi x/a)$, $E_n = n^2\pi^2\hbar^2/2ma^2 = n^2 E_1$.
- **Zero-point energy** $E_1 > 0$ là hệ quả trực tiếp của nguyên lý bất định: không thể đồng thời $\Delta x = a$ (hữu hạn) và $\Delta p = 0$.
- **Hệ trực chuẩn** $\{\psi_n\}$: $\int\psi_m\psi_n\,dx = \delta_{mn}$ — nghiệm tổng quát $\Psi = \sum c_n\psi_n e^{-iE_nt/\hbar}$, hệ số $c_n = \int\psi_n\Psi(x,0)\,dx$.
- **Giếng hữu hạn**: điều kiện biên liên tục tại biên giếng → phương trình siêu việt cho $E_n$. Số bound states hữu hạn.
- **Xuyên thấu lượng tử**: hàm sóng thấm vào vùng cấm kinh điển với biên độ $e^{-\kappa x}$ — tiền thân của tunneling (Lesson 07).
- Năng lượng giếng hữu hạn luôn **thấp hơn** giếng vô hạn cùng kích thước do hàm sóng "rộng hơn hiệu dụng".

---

## References

- Griffiths — *Introduction to Quantum Mechanics*, 2nd ed., Ch. 2.1–2.2
- MIT OCW 8.04 (Zwiebach 2016) — Lectures 13–16: Infinite and finite square wells
- MIT OCW 8.04 (Adams 2013) — Lectures 9–12: Potential wells and bound states
- Shankar — *Principles of Quantum Mechanics*, 2nd ed., Ch. 5.1–5.2
