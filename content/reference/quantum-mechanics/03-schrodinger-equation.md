---
title: "03. The Schrödinger Equation"
tags: [physics, quantum-mechanics, lesson-03]
aliases: [Phương trình Schrödinger]
created: 2026-03-27
---

> **Prerequisites**: [[02-wavefunction-probability|02. Hàm sóng & diễn giải xác suất]] — Born rule, normalization, ý nghĩa của $|\Psi|^2$.
> **Objectives**:
> - Hiểu phương trình Schrödinger phụ thuộc thời gian (TDSE) như tiên đề nền tảng của QM
> - Thực hiện tách biến để đưa TDSE về dạng TISE
> - Phân tích ý nghĩa vật lý của trạng thái dừng (stationary state)
> - Hiểu nguyên lý chồng chất (superposition principle) và cách xây dựng nghiệm tổng quát
> - Chứng minh chuẩn hóa bảo toàn theo thời gian

---

## Motivation

Trong cơ học Newton, phương trình $F = ma$ là tiên đề trung tâm: cho biết lực, ta tính được quỹ đạo $x(t)$ hoàn toàn. Nhưng hàm sóng $\Psi(x,t)$ tiến hóa theo thời gian như thế nào?

Ta cần một **phương trình vi phân** mô tả sự tiến hóa của $\Psi$. Schrödinger (1926) đề xuất phương trình mang tên ông — không phải bằng cách "suy ra" từ nguyên lý sâu hơn, mà bằng cách **đoán một phương trình nhất quán** với các thí nghiệm đã biết và sau đó xác nhận bằng thực nghiệm.

Đây là điểm khác biệt căn bản với vật lý cổ điển: **phương trình Schrödinger là tiên đề** — ta không chứng minh nó, mà chấp nhận nó vì nó cho kết quả đúng.

---

## Physical Model

### Xuất phát điểm — Sóng de Broglie tự do

Với hạt tự do (không có thế năng), sóng de Broglie có dạng phẳng (plane wave):

$$\Psi(x,t) = A\, e^{i(kx - \omega t)}$$

Từ Lesson 01: $p = \hbar k$ và $E = \hbar\omega$. Với hạt không tương đối tính:

$$E = \frac{p^2}{2m} \implies \hbar\omega = \frac{\hbar^2 k^2}{2m}$$

Tính các đạo hàm của sóng phẳng:

$$\frac{\partial\Psi}{\partial t} = -i\omega\,\Psi, \qquad \frac{\partial^2\Psi}{\partial x^2} = -k^2\,\Psi$$

Thế vào quan hệ năng lượng $\hbar\omega = \hbar^2 k^2 / 2m$:

$$i\hbar\frac{\partial\Psi}{\partial t} = \hbar\omega\,\Psi = \frac{\hbar^2 k^2}{2m}\Psi = -\frac{\hbar^2}{2m}\frac{\partial^2\Psi}{\partial x^2}$$

Schrödinger tổng quát hóa: với hạt có thế năng $V(x,t)$, năng lượng toàn phần là $E = p^2/2m + V$, nên thêm số hạng $V\Psi$:

> [!definition] Definition 3.1 — Phương trình Schrödinger phụ thuộc thời gian (TDSE)
> Hàm sóng $\Psi(x,t)$ của một hạt khối lượng $m$ trong thế năng $V(x,t)$ thỏa mãn:
>
> $$i\hbar\frac{\partial\Psi}{\partial t} = -\frac{\hbar^2}{2m}\frac{\partial^2\Psi}{\partial x^2} + V(x,t)\,\Psi$$
>
> Viết gọn hơn: $i\hbar\,\partial_t\Psi = \hat{H}\Psi$, với **toán tử Hamiltonian**:
>
> $$\hat{H} = -\frac{\hbar^2}{2m}\frac{\partial^2}{\partial x^2} + V(x,t)$$

TDSE là phương trình **tuyến tính** và **bậc nhất theo thời gian** — hai tính chất quan trọng.

---

## Mathematical Formalism

### Tách biến — Trường hợp $V$ không phụ thuộc thời gian

Khi thế năng $V = V(x)$ (chỉ phụ thuộc vị trí, không phụ thuộc thời gian), ta có thể tìm **nghiệm đặc biệt** bằng phương pháp tách biến (separation of variables). Đặt:

$$\Psi(x,t) = \psi(x)\,\phi(t)$$

Thế vào TDSE:

$$i\hbar\,\psi(x)\,\phi'(t) = \phi(t)\left[-\frac{\hbar^2}{2m}\psi''(x) + V(x)\psi(x)\right]$$

Chia hai vế cho $\psi(x)\phi(t)$:

$$i\hbar\frac{\phi'(t)}{\phi(t)} = \frac{1}{\psi(x)}\left[-\frac{\hbar^2}{2m}\psi''(x) + V(x)\psi(x)\right]$$

Vế trái chỉ phụ thuộc $t$, vế phải chỉ phụ thuộc $x$. Hai vế phải bằng cùng một hằng số $E$ (hằng số tách biến — separation constant):

**Phương trình thời gian:**

$$i\hbar\frac{d\phi}{dt} = E\,\phi \implies \phi(t) = e^{-iEt/\hbar}$$

**Phương trình không gian:**

> [!definition] Definition 3.2 — Phương trình Schrödinger không phụ thuộc thời gian (TISE)
>
> $$-\frac{\hbar^2}{2m}\frac{d^2\psi}{dx^2} + V(x)\psi = E\psi$$
>
> Hay dưới dạng toán tử: $\hat{H}\psi = E\psi$.
>
> Đây là **phương trình trị riêng** (eigenvalue equation): ta cần tìm các hàm $\psi(x)$ (hàm riêng, eigenfunction) và các giá trị $E$ (trị riêng, eigenvalue) thỏa mãn phương trình.

### Trạng thái dừng (Stationary State)

Nghiệm tách biến có dạng:

$$\Psi_n(x,t) = \psi_n(x)\,e^{-iE_n t/\hbar}$$

> [!definition] Definition 3.3 — Trạng thái dừng
> Nghiệm tách biến $\Psi_n = \psi_n(x)\,e^{-iE_n t/\hbar}$ được gọi là **trạng thái dừng** (stationary state) vì:
>
> $$|\Psi_n(x,t)|^2 = |\psi_n(x)|^2 \cdot |e^{-iE_n t/\hbar}|^2 = |\psi_n(x)|^2$$
>
> Mật độ xác suất **không phụ thuộc thời gian** — hạt "đứng yên" theo nghĩa xác suất. Tương tự, giá trị kỳ vọng của mọi đại lượng không phụ thuộc tường minh vào $t$ cũng không đổi theo thời gian.

Hằng số tách biến $E$ chính là **năng lượng** của trạng thái: $\langle H \rangle = E$ (sẽ chứng minh trong Lesson 04).

### Nguyên lý chồng chất và nghiệm tổng quát

TDSE là phương trình tuyến tính — tổ hợp tuyến tính của các nghiệm vẫn là nghiệm:

> [!definition] Definition 3.4 — Nguyên lý chồng chất (Superposition Principle)
> Nếu $\Psi_1, \Psi_2, \ldots$ là các nghiệm của TDSE, thì **tổ hợp tuyến tính** bất kỳ:
>
> $$\Psi = c_1\Psi_1 + c_2\Psi_2 + \cdots = \sum_n c_n\Psi_n$$
>
> cũng là nghiệm của TDSE (với $c_n \in \mathbb{C}$ bất kỳ).

**Nghiệm tổng quát** khi $V = V(x)$: nếu TISE cho tập hàm riêng $\{\psi_n\}$ với trị riêng $\{E_n\}$, thì nghiệm tổng quát của TDSE là:

$$\Psi(x,t) = \sum_n c_n\,\psi_n(x)\,e^{-iE_n t/\hbar}$$

Các hệ số $c_n$ được xác định từ điều kiện đầu $\Psi(x,0)$:

$$\Psi(x,0) = \sum_n c_n\,\psi_n(x)$$

Đây là bài toán khai triển hàm theo cơ sở trực chuẩn — tương tự khai triển Fourier, sẽ phân tích chi tiết trong Lesson 10.

---

## Derivation

### Chuẩn hóa bảo toàn theo thời gian

> [!theorem] Theorem 3.5 — Bảo toàn chuẩn hóa
> Nếu $\Psi(x,0)$ đã chuẩn hóa và thỏa mãn TDSE, thì $\Psi(x,t)$ chuẩn hóa với mọi $t > 0$.

**Chứng minh.** Tính $\frac{d}{dt}\int_{-\infty}^{+\infty}|\Psi|^2\,dx$:

$$\frac{d}{dt}\int_{-\infty}^{+\infty}|\Psi|^2\,dx = \int_{-\infty}^{+\infty}\frac{\partial|\Psi|^2}{\partial t}\,dx = \int_{-\infty}^{+\infty}\left(\Psi^*\frac{\partial\Psi}{\partial t} + \Psi\frac{\partial\Psi^*}{\partial t}\right)dx$$

Từ TDSE: $\partial_t\Psi = \frac{i\hbar}{2m}\partial_{xx}\Psi - \frac{i}{\hbar}V\Psi$. Thế vào:

$$= \frac{i\hbar}{2m}\int_{-\infty}^{+\infty}\left(\Psi^*\Psi'' - \Psi\Psi^{*\prime\prime}\right)dx = \frac{i\hbar}{2m}\int_{-\infty}^{+\infty}\frac{\partial}{\partial x}\left(\Psi^*\Psi' - \Psi\Psi^{*\prime}\right)dx$$

$$= \frac{i\hbar}{2m}\left[\Psi^*\Psi' - \Psi\Psi^{*\prime}\right]_{-\infty}^{+\infty} = 0$$

Số hạng cuối bằng 0 vì $\Psi \to 0$ khi $x \to \pm\infty$ (điều kiện hàm sóng vật lý). $\blacksquare$

---

### Tính chất trực giao của các trạng thái dừng

> [!theorem] Theorem 3.6 — Trực giao (Orthogonality)
> Với $V$ thực, nếu $E_m \neq E_n$, thì:
>
> $$\int_{-\infty}^{+\infty}\psi_m^*(x)\,\psi_n(x)\,dx = 0$$

**Phác thảo chứng minh.** Viết TISE cho $\psi_m$ và $\psi_n$, nhân chéo và tích phân từng phần hai lần. Số hạng biên triệt tiêu do điều kiện biên. Kết quả: $(E_m - E_n)\int\psi_m^*\psi_n\,dx = 0$. Vì $E_m \neq E_n$, suy ra tích phân bằng 0. $\blacksquare$

Tính trực giao này là lý do tại sao các hàm riêng tạo thành **cơ sở trực giao** (orthogonal basis) của không gian hàm — nền tảng cho toàn bộ hình thức luận Hilbert space trong Lesson 10.

---

## Worked Problem

> [!example] Bài toán 3.1 — Hạt trong hộp vô hạn (preview)
>
> Xét hạt trong giếng thế năng vô hạn: $V = 0$ với $0 < x < a$, $V = \infty$ bên ngoài. Điều kiện biên: $\psi(0) = \psi(a) = 0$. Giải TISE để tìm $\psi_n$ và $E_n$.

**Lời giải:**

Trong vùng $0 < x < a$, TISE là:

$$-\frac{\hbar^2}{2m}\psi'' = E\psi \implies \psi'' = -k^2\psi, \quad k = \sqrt{\frac{2mE}{\hbar^2}}$$

Nghiệm tổng quát: $\psi(x) = A\sin(kx) + B\cos(kx)$.

Áp dụng điều kiện biên $\psi(0) = 0$: $B = 0$, suy ra $\psi = A\sin(kx)$.

Áp dụng $\psi(a) = 0$: $A\sin(ka) = 0$. Vì $A \neq 0$ (nếu không $\psi \equiv 0$), ta cần $ka = n\pi$ với $n = 1, 2, 3, \ldots$

**Hàm riêng (eigenfunction):**

$$\psi_n(x) = A\sin\left(\frac{n\pi x}{a}\right)$$

**Chuẩn hóa** — tìm $A$:

$$\int_0^a A^2\sin^2\!\left(\frac{n\pi x}{a}\right)dx = A^2\cdot\frac{a}{2} = 1 \implies A = \sqrt{\frac{2}{a}}$$

$$\boxed{\psi_n(x) = \sqrt{\frac{2}{a}}\sin\left(\frac{n\pi x}{a}\right)}$$

**Trị riêng năng lượng (eigenvalue):**

$$k_n = \frac{n\pi}{a} \implies E_n = \frac{\hbar^2 k_n^2}{2m} = \frac{n^2\pi^2\hbar^2}{2ma^2}, \quad n = 1, 2, 3, \ldots$$

$$\boxed{E_n = \frac{n^2\pi^2\hbar^2}{2ma^2} = n^2 E_1}$$

Năng lượng **lượng tử hóa** (rời rạc) và **tỉ lệ với $n^2$**. Trạng thái thấp nhất $n=1$ có năng lượng $E_1 = \pi^2\hbar^2/(2ma^2) > 0$ — đây là **năng lượng điểm không** (zero-point energy), không thể bằng 0 ngay cả ở nhiệt độ tuyệt đối.

> [!example] Bài toán 3.2 — Xây dựng nghiệm tổng quát từ điều kiện đầu
>
> Với hộp vô hạn ($0 < x < a$), tại $t = 0$ hàm sóng là:
>
> $$\Psi(x,0) = A\left[\psi_1(x) + \psi_2(x)\right]$$
>
> Tìm $A$, viết $\Psi(x,t)$, và cho biết giá trị năng lượng có thể đo được.

**Lời giải:**

**Chuẩn hóa:**

$$\int_0^a |\Psi(x,0)|^2\,dx = A^2\int_0^a |\psi_1 + \psi_2|^2\,dx = A^2\left(\int|\psi_1|^2\,dx + \int|\psi_2|^2\,dx + 2\int\psi_1\psi_2\,dx\right)$$

Do trực giao: $\int_0^a\psi_1\psi_2\,dx = 0$. Do chuẩn hóa: $\int|\psi_n|^2\,dx = 1$. Nên:

$$A^2(1 + 1 + 0) = 1 \implies A = \frac{1}{\sqrt{2}}$$

**Hàm sóng tổng quát:**

$$\Psi(x,t) = \frac{1}{\sqrt{2}}\left[\psi_1(x)\,e^{-iE_1 t/\hbar} + \psi_2(x)\,e^{-iE_2 t/\hbar}\right]$$

**Năng lượng có thể đo được:** Mỗi lần đo năng lượng, kết quả chỉ có thể là $E_1$ hoặc $E_2$, mỗi cái với **xác suất $|c_n|^2 = 1/2$**. Giá trị kỳ vọng:

$$\langle E \rangle = |c_1|^2 E_1 + |c_2|^2 E_2 = \frac{1}{2}(E_1 + E_2) = \frac{5\pi^2\hbar^2}{4ma^2}$$

Lưu ý: $|\Psi(x,t)|^2$ **không** là hằng số theo $t$ nữa (không phải trạng thái dừng) — xuất hiện số hạng giao thoa dao động với tần số $(E_2 - E_1)/\hbar$.

---

## Summary

- **TDSE**: $i\hbar\,\partial_t\Psi = \hat{H}\Psi$ — tiên đề nền tảng, mô tả tiến hóa thời gian của hàm sóng.
- **Tách biến**: khi $V = V(x)$, đặt $\Psi = \psi(x)\phi(t)$ tách TDSE thành TISE ($\hat{H}\psi = E\psi$) và phương trình thời gian ($\phi = e^{-iEt/\hbar}$).
- **Trạng thái dừng** $\Psi_n = \psi_n e^{-iE_n t/\hbar}$: mật độ xác suất không đổi theo thời gian.
- **Lượng tử hóa năng lượng** xuất hiện tự nhiên từ điều kiện biên của TISE — không phải giả thuyết thêm vào.
- **Nguyên lý chồng chất**: nghiệm tổng quát là $\Psi = \sum_n c_n\psi_n e^{-iE_n t/\hbar}$.
- **Bảo toàn chuẩn hóa**: TDSE đảm bảo $\int|\Psi|^2\,dx = 1$ với mọi $t$.
- **Trực giao**: $\int\psi_m^*\psi_n\,dx = 0$ với $m \neq n$ — tiền đề cho hình thức luận Hilbert space.

---

## References

- Griffiths — *Introduction to Quantum Mechanics*, 2nd ed., Ch. 1.5, Ch. 2.1–2.2
- MIT OCW 8.04 (Zwiebach 2016) — Lectures 5–7: Schrödinger equation, stationary states
- MIT OCW 8.04 (Adams 2013) — Lectures 5–6: Schrödinger equation and its solutions
- Shankar — *Principles of Quantum Mechanics*, 2nd ed., Ch. 4.1–4.2
