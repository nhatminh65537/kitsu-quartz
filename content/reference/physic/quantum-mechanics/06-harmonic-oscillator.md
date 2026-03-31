---
title: "06. Quantum Harmonic Oscillator"
tags: [physics, quantum-mechanics, lesson-06]
aliases: [Dao động điều hòa lượng tử]
created: 2026-03-27
---

> **Prerequisites**: [[05-potential-wells|05. Giếng thế năng vô hạn & hữu hạn]] — hàm riêng, trị riêng, chuẩn hóa; [[04-operators-expectation|04. Toán tử & giá trị kỳ vọng]] — $\hat{p}$, commutator.
> **Objectives**:
> - Hiểu tại sao dao động điều hòa là bài toán quan trọng nhất trong vật lý lý thuyết
> - Giải bài toán bằng **phương pháp đại số** (algebraic method) — ladder operators $\hat{a}_\pm$
> - Xác định phổ năng lượng $E_n = (n + 1/2)\hbar\omega$ và hàm riêng $\psi_n$
> - Tính giá trị kỳ vọng $\langle x\rangle$, $\langle p\rangle$, $\langle x^2\rangle$, $\langle p^2\rangle$ bằng ladder operators
> - Nhận biết zero-point energy và so sánh với cơ học cổ điển

---

## Motivation

Dao động điều hòa lượng tử (quantum harmonic oscillator — QHO) là bài toán quan trọng nhất trong vật lý lý thuyết, vượt xa cả giếng thế năng. Lý do:

**Thứ nhất, tính phổ quát.** Bất kỳ thế năng $V(x)$ nào có cực tiểu tại $x_0$ đều xấp xỉ được bằng parabol gần $x_0$: $V(x) \approx V(x_0) + \frac{1}{2}V''(x_0)(x-x_0)^2$. Dao động điều hòa là **xấp xỉ đầu tiên của mọi dao động nhỏ** quanh trạng thái cân bằng.

**Thứ hai, ứng dụng rộng.** QHO mô tả: dao động nguyên tử trong tinh thể (phonon), trường điện từ lượng tử (photon là lượng tử của QHO), phân tử hai nguyên tử, và toàn bộ lý thuyết trường lượng tử (QFT).

**Thứ ba, vẻ đẹp toán học.** Phương pháp ladder operator (toán tử thang) cho phép giải bài toán **hoàn toàn bằng đại số** — không cần giải ODE — và cho thấy sức mạnh của tư duy toán tử trong QM.

---

## Physical Model

Hạt khối lượng $m$ trong thế năng parabol:

$$V(x) = \frac{1}{2}m\omega^2 x^2$$

với $\omega$ là tần số góc cổ điển. TISE:

$$-\frac{\hbar^2}{2m}\psi'' + \frac{1}{2}m\omega^2 x^2\psi = E\psi$$

---

## Mathematical Formalism

### Phương pháp đại số — Ladder Operators

Ý tưởng then chốt: thay vì giải ODE trực tiếp, ta **phân tích nhân tử** Hamiltonian theo một cách thông minh.

Viết lại Hamiltonian:

$$\hat{H} = \frac{\hat{p}^2}{2m} + \frac{1}{2}m\omega^2\hat{x}^2$$

Định nghĩa hai toán tử mới:

> [!definition] Definition 6.1 — Ladder Operators (Toán tử thang)
>
> $$\hat{a}_+ = \frac{1}{\sqrt{2\hbar m\omega}}\left(-i\hat{p} + m\omega\hat{x}\right), \qquad \hat{a}_- = \frac{1}{\sqrt{2\hbar m\omega}}\left(+i\hat{p} + m\omega\hat{x}\right)$$
>
> $\hat{a}_+$ gọi là **raising operator** (toán tử nâng), $\hat{a}_-$ gọi là **lowering operator** (toán tử hạ).
>
> Lưu ý: $\hat{a}_- = (\hat{a}_+)^\dagger$ — chúng liên hợp Hermitian của nhau.

**Tính tích $\hat{a}_-\hat{a}_+$:**

$$\hat{a}_-\hat{a}_+ = \frac{1}{2\hbar m\omega}\left(\hat{p}^2 + m^2\omega^2\hat{x}^2 + im\omega[\hat{x},\hat{p}]\right) = \frac{\hat{H}}{\hbar\omega} + \frac{1}{2}$$

(Dùng $[\hat{x},\hat{p}] = i\hbar$, nên $im\omega[\hat{x},\hat{p}] = -m\omega\hbar$.)

Tương tự: $\hat{a}_+\hat{a}_- = \frac{\hat{H}}{\hbar\omega} - \frac{1}{2}$.

Suy ra:

> [!theorem] Theorem 6.2 — Hamiltonian biểu diễn qua ladder operators
>
> $$\hat{H} = \hbar\omega\left(\hat{a}_-\hat{a}_+ - \frac{1}{2}\right) = \hbar\omega\left(\hat{a}_+\hat{a}_- + \frac{1}{2}\right)$$
>
> **Commutation relation của ladder operators:**
>
> $$[\hat{a}_-, \hat{a}_+] = 1$$

### Phổ năng lượng từ đại số

> [!theorem] Theorem 6.3 — Tính chất của ladder operators
> Nếu $\psi$ là hàm riêng với trị riêng $E$ ($\hat{H}\psi = E\psi$), thì:
>
> - $\hat{a}_+\psi$ là hàm riêng với trị riêng $E + \hbar\omega$
> - $\hat{a}_-\psi$ là hàm riêng với trị riêng $E - \hbar\omega$

**Chứng minh** cho $\hat{a}_+$: Tính $\hat{H}(\hat{a}_+\psi)$:

$$\hat{H}(\hat{a}_+\psi) = \hbar\omega\left(\hat{a}_-\hat{a}_+ - \frac{1}{2}\right)\hat{a}_+\psi$$

Dùng $[\hat{a}_-,\hat{a}_+] = 1$ → $\hat{a}_-\hat{a}_+ = \hat{a}_+\hat{a}_- + 1$:

$$= \hbar\omega\hat{a}_+\left(\hat{a}_-\hat{a}_+ + \frac{1}{2}\right)\psi + \hbar\omega\hat{a}_+\psi = \hat{a}_+(\hat{H}\psi) + \hbar\omega\hat{a}_+\psi = (E + \hbar\omega)(\hat{a}_+\psi) \quad\blacksquare$$

**Trạng thái cơ bản (ground state):** Vì năng lượng không thể âm vô hạn (thế năng $V \geq 0$), phải tồn tại trạng thái thấp nhất $\psi_0$ sao cho:

$$\hat{a}_-\psi_0 = 0$$

Tức là $\hat{a}_-$ không thể hạ thêm được nữa. Từ đây:

$$\hat{H}\psi_0 = \hbar\omega\left(\hat{a}_+\hat{a}_- + \frac{1}{2}\right)\psi_0 = \frac{1}{2}\hbar\omega\cdot\psi_0$$

**Trạng thái thứ $n$** thu được bằng cách tác dụng $\hat{a}_+$ đúng $n$ lần:

> [!definition] Definition 6.4 — Phổ năng lượng của QHO
>
> $$E_n = \left(n + \frac{1}{2}\right)\hbar\omega, \quad n = 0, 1, 2, \ldots$$
>
> **Zero-point energy**: $E_0 = \frac{1}{2}\hbar\omega > 0$.
>
> Cơ học cổ điển cho phép dao động điều hòa đứng yên ($E = 0$); QM cấm điều này.

### Hàm riêng

**Trạng thái cơ bản $\psi_0$:** Từ điều kiện $\hat{a}_-\psi_0 = 0$:

$$\frac{1}{\sqrt{2\hbar m\omega}}\left(\hbar\frac{d\psi_0}{dx} + m\omega x\psi_0\right) = 0 \implies \frac{d\psi_0}{dx} = -\frac{m\omega}{\hbar}x\psi_0$$

ODE tách biến này có nghiệm Gaussian:

$$\psi_0(x) = \left(\frac{m\omega}{\pi\hbar}\right)^{1/4} e^{-m\omega x^2/(2\hbar)}$$

**Trạng thái $\psi_n$:** áp dụng $\hat{a}_+$ đúng $n$ lần:

$$\psi_n(x) = \frac{1}{\sqrt{n!}}\left(\hat{a}_+\right)^n\psi_0$$

Kết quả tường minh liên quan đến **đa thức Hermite** $H_n(\xi)$ với $\xi = \sqrt{m\omega/\hbar}\,x$:

> [!definition] Definition 6.5 — Hàm riêng tường minh
>
> $$\psi_n(x) = \left(\frac{m\omega}{\pi\hbar}\right)^{1/4}\frac{1}{\sqrt{2^n n!}}\,H_n\!\left(\sqrt{\frac{m\omega}{\hbar}}\,x\right)e^{-m\omega x^2/(2\hbar)}$$
>
> Vài đa thức Hermite đầu: $H_0 = 1$, $H_1 = 2\xi$, $H_2 = 4\xi^2 - 2$, $H_3 = 8\xi^3 - 12\xi$.

### Giá trị kỳ vọng bằng ladder operators

Đảo lại định nghĩa:

$$\hat{x} = \sqrt{\frac{\hbar}{2m\omega}}(\hat{a}_+ + \hat{a}_-), \qquad \hat{p} = i\sqrt{\frac{m\omega\hbar}{2}}(\hat{a}_+ - \hat{a}_-)$$

**Tác dụng của ladder operators lên $\psi_n$:**

$$\hat{a}_+\psi_n = \sqrt{n+1}\,\psi_{n+1}, \qquad \hat{a}_-\psi_n = \sqrt{n}\,\psi_{n-1}$$

**Tính $\langle x\rangle$:**

$$\langle x\rangle = \sqrt{\frac{\hbar}{2m\omega}}\langle\psi_n|\hat{a}_+ + \hat{a}_-|\psi_n\rangle = \sqrt{\frac{\hbar}{2m\omega}}\left(\sqrt{n+1}\underbrace{\langle\psi_n|\psi_{n+1}\rangle}_{=0} + \sqrt{n}\underbrace{\langle\psi_n|\psi_{n-1}\rangle}_{=0}\right) = 0$$

**Tính $\langle x^2\rangle$:**

$$\hat{x}^2 = \frac{\hbar}{2m\omega}(\hat{a}_+^2 + \hat{a}_+\hat{a}_- + \hat{a}_-\hat{a}_+ + \hat{a}_-^2)$$

Chỉ số hạng $\hat{a}_+\hat{a}_-$ và $\hat{a}_-\hat{a}_+$ cho đóng góp khác 0 (vì $\psi_n$ trực giao nhau):

$$\langle x^2\rangle = \frac{\hbar}{2m\omega}\langle\hat{a}_+\hat{a}_- + \hat{a}_-\hat{a}_+\rangle = \frac{\hbar}{2m\omega}(n + n + 1) = \frac{\hbar}{m\omega}\!\left(n + \frac{1}{2}\right)$$

Tóm tắt:

> [!definition] Definition 6.6 — Giá trị kỳ vọng trong trạng thái $\psi_n$
>
> | Đại lượng | Giá trị kỳ vọng |
> |-----------|----------------|
> | $\langle x\rangle$ | $0$ |
> | $\langle p\rangle$ | $0$ |
> | $\langle x^2\rangle$ | $\dfrac{\hbar}{m\omega}\!\left(n+\dfrac{1}{2}\right)$ |
> | $\langle p^2\rangle$ | $m\omega\hbar\!\left(n+\dfrac{1}{2}\right)$ |
> | $\langle T\rangle$ | $\dfrac{E_n}{2}$ |
> | $\langle V\rangle$ | $\dfrac{E_n}{2}$ |

Kết quả cuối: $\langle T\rangle = \langle V\rangle = E_n/2$ — **định lý virial lượng tử**: năng lượng chia đều giữa động năng và thế năng, giống hoàn toàn với cơ học cổ điển.

---

## Derivation

### Zero-point energy từ nguyên lý bất định

QHO cho thấy rõ nhất nguồn gốc của zero-point energy:

$$E_0 = \frac{1}{2}\hbar\omega = \langle T\rangle + \langle V\rangle = \frac{\langle p^2\rangle}{2m} + \frac{m\omega^2\langle x^2\rangle}{2}$$

Đặt $\Delta x = \sigma$ (độ bất định vị trí khi $\langle x\rangle = 0$). Từ nguyên lý bất định $\Delta p \geq \hbar/(2\sigma)$, nên $\langle p^2\rangle \geq \hbar^2/(4\sigma^2)$. Năng lượng tối thiểu:

$$E \geq \frac{\hbar^2}{8m\sigma^2} + \frac{m\omega^2\sigma^2}{2}$$

Tối thiểu hóa theo $\sigma$ (lấy đạo hàm bằng 0):

$$\frac{dE}{d\sigma} = -\frac{\hbar^2}{4m\sigma^3} + m\omega^2\sigma = 0 \implies \sigma^2 = \frac{\hbar}{2m\omega}$$

Thế lại: $E_{\min} = \frac{\hbar^2}{8m}\cdot\frac{2m\omega}{\hbar} + \frac{m\omega^2}{2}\cdot\frac{\hbar}{2m\omega} = \frac{\hbar\omega}{4} + \frac{\hbar\omega}{4} = \frac{\hbar\omega}{2}$

Dấu bằng đạt khi $\psi_0$ là **Gaussian** — nhất quán hoàn toàn với kết quả chính xác!

---

## Worked Problem

> [!example] Bài toán 6.1 — Kiểm tra nguyên lý bất định cho QHO
>
> Với trạng thái $\psi_n$, tính $\Delta x$, $\Delta p$ và kiểm tra nguyên lý bất định.

**Lời giải:**

Từ bảng giá trị kỳ vọng trên, với $\langle x\rangle = \langle p\rangle = 0$:

$$(\Delta x)^2 = \langle x^2\rangle = \frac{\hbar}{m\omega}\!\left(n + \frac{1}{2}\right)$$

$$(\Delta p)^2 = \langle p^2\rangle = m\omega\hbar\!\left(n + \frac{1}{2}\right)$$

$$\Delta x\cdot\Delta p = \sqrt{\frac{\hbar}{m\omega}\!\left(n+\frac{1}{2}\right)}\cdot\sqrt{m\omega\hbar\!\left(n+\frac{1}{2}\right)} = \hbar\!\left(n + \frac{1}{2}\right) \geq \frac{\hbar}{2} \checkmark$$

**Quan sát quan trọng:** Đẳng thức $\Delta x\cdot\Delta p = \hbar/2$ đạt **khi và chỉ khi** $n = 0$ (ground state $\psi_0$). Ground state là trạng thái bất định tối thiểu (minimum uncertainty state) — đúng như ta đã dự đoán vì $\psi_0$ là Gaussian.

> [!example] Bài toán 6.2 — Tiến hóa thời gian của chồng chất
>
> Tại $t = 0$: $\Psi(x,0) = \frac{1}{\sqrt{2}}(\psi_0 + \psi_1)$.
> Tính $\langle x\rangle(t)$ và giải thích kết quả.

**Lời giải:**

$$\Psi(x,t) = \frac{1}{\sqrt{2}}\left(\psi_0\,e^{-i\omega t/2} + \psi_1\,e^{-3i\omega t/2}\right)$$

$$\langle x\rangle(t) = \int\Psi^*(x,t)\,\hat{x}\,\Psi(x,t)\,dx$$

Mở ra, chỉ số hạng chéo (cross terms) $\langle\psi_0|\hat{x}|\psi_1\rangle$ và $\langle\psi_1|\hat{x}|\psi_0\rangle$ khác 0. Dùng $\hat{x} = \sqrt{\hbar/2m\omega}(\hat{a}_+ + \hat{a}_-)$:

$$\langle\psi_0|\hat{x}|\psi_1\rangle = \sqrt{\frac{\hbar}{2m\omega}}\langle\psi_0|\hat{a}_-|\psi_1\rangle = \sqrt{\frac{\hbar}{2m\omega}}\cdot 1 = \sqrt{\frac{\hbar}{2m\omega}}$$

Ghép pha thời gian $e^{-i\omega t/2}$ và $e^{+3i\omega t/2}$:

$$\langle x\rangle(t) = \sqrt{\frac{\hbar}{2m\omega}}\cos(\omega t)$$

**Ý nghĩa**: Giá trị kỳ vọng $\langle x\rangle$ dao động với đúng tần số $\omega$ — giống hoàn toàn với dao động điều hòa cổ điển. Định lý Ehrenfest hoạt động hoàn hảo ở đây!

---

## Summary

- QHO là mô hình phổ quát nhất trong vật lý: mọi dao động nhỏ quanh cân bằng đều quy về QHO.
- **Phương pháp ladder operators**: $[\hat{a}_-,\hat{a}_+] = 1$, $\hat{H} = \hbar\omega(\hat{a}_+\hat{a}_- + 1/2)$.
- **Phổ năng lượng**: $E_n = (n+1/2)\hbar\omega$ — rời rạc đều, cách nhau $\hbar\omega$.
- **Zero-point energy** $E_0 = \hbar\omega/2$: hệ quả trực tiếp của nguyên lý bất định.
- $\hat{a}_+\psi_n = \sqrt{n+1}\,\psi_{n+1}$; $\hat{a}_-\psi_n = \sqrt{n}\,\psi_{n-1}$ — mọi giá trị kỳ vọng tính được thuần túy bằng đại số.
- **Định lý virial**: $\langle T\rangle = \langle V\rangle = E_n/2$.
- Ground state $\psi_0$ là Gaussian — **trạng thái bất định tối thiểu** $\Delta x\cdot\Delta p = \hbar/2$.

---

## References

- Griffiths — *Introduction to Quantum Mechanics*, 2nd ed., Ch. 2.3
- MIT OCW 8.04 (Zwiebach 2016) — Lectures 17–20: Harmonic oscillator, ladder operators
- MIT OCW 8.04 (Adams 2013) — Lectures 14–16: QHO algebraic solution
- Shankar — *Principles of Quantum Mechanics*, 2nd ed., Ch. 7
