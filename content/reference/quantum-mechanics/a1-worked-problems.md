---
title: "A1. Worked Problems Collection"
tags: [physics, quantum-mechanics, appendix, problems]
aliases: [Bài toán mẫu tổng hợp]
created: 2026-03-28
---

> **Mục đích**: Tổng hợp các bài toán mẫu tổng hợp, kết hợp nhiều lesson, dùng để ôn tập và kiểm tra hiểu biết. Mỗi bài có gợi ý chiến lược giải trước khi trình bày lời giải.

---

## Nhóm 1 — Hàm sóng và Schrödinger (Lessons 02–05)

> [!example] Bài P1.1 — Gói sóng Gaussian tiến hóa theo thời gian
>
> Tại $t = 0$: $\psi(x,0) = Ae^{-(x-x_0)^2/(4\sigma^2)}e^{ip_0 x/\hbar}$ (gói sóng Gaussian tâm $x_0$, động lượng trung bình $p_0$, độ rộng $\sigma$).
>
> **(a)** Tìm $A$. **(b)** Tính $\langle x\rangle$, $\langle p\rangle$, $\Delta x$, $\Delta p$ tại $t=0$ và kiểm tra bất định. **(c)** Viết $\psi(x,t)$ cho hạt tự do ($V=0$) và chỉ ra gói sóng lan rộng theo thời gian.

**Chiến lược**: (a) Tích phân Gaussian chuẩn. (b) Dùng định nghĩa giá trị kỳ vọng; với $e^{ip_0x/\hbar}$ làm pha, $\langle p\rangle$ tính từ biểu diễn động lượng. (c) Khai triển theo sóng phẳng rồi ghép pha thời gian $e^{-i\hbar k^2t/2m}$.

**Lời giải:**

**(a)** Chuẩn hóa:

$$\int|Ae^{-(x-x_0)^2/(4\sigma^2)}|^2\,dx = A^2\int e^{-(x-x_0)^2/(2\sigma^2)}\,dx = A^2\sigma\sqrt{2\pi} = 1$$

$$A = \frac{1}{(2\pi\sigma^2)^{1/4}}$$

**(b)** Do Gaussian tâm $x_0$ và pha $e^{ip_0x/\hbar}$ không ảnh hưởng đến $|\psi|^2$:

$$\langle x\rangle = x_0, \quad \Delta x = \sigma$$

Biến đổi Fourier của $\psi(x,0)$ (tích phân Gaussian với dịch chuyển pha):

$$\tilde\psi(k) = \left(\frac{2\sigma^2}{\pi}\right)^{1/4}e^{-(k-p_0/\hbar)^2\sigma^2}e^{-ikx_0}$$

Suy ra $\langle p\rangle = p_0$, $\Delta p = \hbar/(2\sigma)$.

Kiểm tra: $\Delta x\cdot\Delta p = \sigma\cdot\hbar/(2\sigma) = \hbar/2$ — **trạng thái bất định tối thiểu** ✓

**(c)** Mỗi thành phần $e^{ikx}$ trong khai triển Fourier nhận pha $e^{-i\hbar k^2 t/2m}$:

$$\psi(x,t) = \frac{1}{(2\pi\sigma_t^2)^{1/4}}\exp\!\left[-\frac{(x-x_0-v_0t)^2}{4\sigma_t^2}\right]\cdot(\text{pha})$$

với $v_0 = p_0/m$ và $\sigma_t^2 = \sigma^2 + i\hbar t/(2m)$.

Độ rộng thực:

$$\Delta x(t) = \sigma\sqrt{1 + \left(\frac{\hbar t}{2m\sigma^2}\right)^2}$$

Gói sóng **di chuyển** với vận tốc $v_0$ và **lan rộng** theo thời gian — hoàn toàn giống sóng điện từ. Thời gian đặc trưng lan rộng: $t^* = 2m\sigma^2/\hbar$.

---

## Nhóm 2 — Hệ mẫu (Lessons 05–07)

> [!example] Bài P2.1 — Hạt trong hộp bất đối xứng
>
> Xét thế năng: $V = 0$ với $0 < x < a$, $V = V_0$ với $a < x < 2a$, $V = \infty$ bên ngoài.
>
> **(a)** Viết dạng tổng quát của $\psi$ trong từng vùng. **(b)** Áp dụng điều kiện biên tại $x = 0$, $x = 2a$, và $x = a$. **(c)** Nhận xét: với $V_0 \to \infty$, bài toán quy về gì?

**Lời giải:**

**(a)** Vùng I ($0<x<a$, $V=0$): $\psi_I = A\sin(k_1x)$ (áp điều kiện $\psi(0)=0$ ngay).

Vùng II ($a<x<2a$, $V=V_0$):

- Nếu $E > V_0$: $\psi_{II} = C\sin(k_2(x-2a))$ với $k_2 = \sqrt{2m(E-V_0)}/\hbar$ (áp $\psi(2a)=0$).
- Nếu $E < V_0$: $\psi_{II} = C\sinh(\kappa(x-2a))$ với $\kappa = \sqrt{2m(V_0-E)}/\hbar$.

**(b)** Điều kiện tại $x = a$: $\psi_I(a) = \psi_{II}(a)$ và $\psi'_I(a) = \psi'_{II}(a)$.

Chia hai phương trình: $k_1\cot(k_1 a) = k_2\cot(-k_2 a) = -k_2\cot(k_2 a)$ (khi $E > V_0$).

Phương trình siêu việt: $k_1\cot(k_1 a) + k_2\cot(k_2 a) = 0$.

**(c)** Khi $V_0 \to \infty$: $\kappa \to \infty$, điều kiện tại $x=a$ đòi $\psi_I(a) = 0$, tức $k_1 a = n\pi$. Bài toán quy về **hai hộp độc lập** mỗi chiều dài $a$ — hoàn toàn hợp lý.

---

## Nhóm 3 — Hydrogen và Mômen động lượng (Lessons 08–09)

> [!example] Bài P3.1 — Giá trị kỳ vọng $\langle 1/r\rangle$ trong Hydrogen
>
> Tính $\langle 1/r\rangle$ cho trạng thái $\psi_{nlm}$ của Hydrogen. Dùng kết quả để tính $\langle V\rangle = \langle -e^2/(4\pi\epsilon_0 r)\rangle$ và kiểm tra với định lý virial.

**Lời giải:**

$$\left\langle\frac{1}{r}\right\rangle_{nl} = \int_0^\infty \frac{1}{r}\cdot r^2|R_{nl}|^2\,dr = \int_0^\infty r|R_{nl}|^2\,dr$$

Dùng tích phân hướng kính chuẩn:

$$\left\langle\frac{1}{r}\right\rangle_{nl} = \frac{1}{n^2 a_0}$$

(Kết quả này không phụ thuộc $l$ — thú vị!)

Suy ra:

$$\langle V\rangle = -\frac{e^2}{4\pi\epsilon_0}\cdot\frac{1}{n^2 a_0} = \frac{2E_n}{1} = 2E_n$$

**Kiểm tra với định lý virial QM** (cho thế Coulomb $V \propto r^{-1}$):

$$\langle T\rangle = -E_n, \qquad \langle V\rangle = 2E_n$$

$$\langle T\rangle + \langle V\rangle = -E_n + 2E_n = E_n \checkmark$$

Định lý virial: với $V \propto r^n$, $2\langle T\rangle = n\langle V\rangle$. Coulomb ($n=-1$): $2\langle T\rangle = -\langle V\rangle$, hay $\langle T\rangle = -E_n > 0$ ✓.

---

## Nhóm 4 — Hình thức luận (Lessons 10–12)

> [!example] Bài P4.1 — Đo liên tiếp
>
> Electron ở trạng thái $\ket{\psi} = \frac{1}{\sqrt{2}}\ket{+} + \frac{i}{\sqrt{2}}\ket{-}$ ($S_z$ basis).
>
> **(a)** Đo $S_z$: xác suất từng kết quả?
> **(b)** Sau khi đo được $+\hbar/2$, đo tiếp $S_x$: xác suất từng kết quả?
> **(c)** Sau đó đo lại $S_z$: xác suất $+\hbar/2$ là bao nhiêu?

**Lời giải:**

**(a)** $P(+\hbar/2) = |1/\sqrt{2}|^2 = 1/2$; $P(-\hbar/2) = |i/\sqrt{2}|^2 = 1/2$.

**(b)** Sau đo được $+\hbar/2$, trạng thái sụp đổ về $\ket{+}$. Khai triển theo cơ sở $S_x$:

$$\ket{+} = \frac{1}{\sqrt{2}}\ket{+}_x + \frac{1}{\sqrt{2}}\ket{-}_x$$

$P(+\hbar/2 \text{ theo }x) = 1/2$; $P(-\hbar/2 \text{ theo }x) = 1/2$.

**(c)** Giả sử đo $S_x$ được $+\hbar/2$, trạng thái là $\ket{+}_x = \frac{1}{\sqrt{2}}(\ket{+}+\ket{-})$.

Đo lại $S_z$: $P(+\hbar/2) = |\braket{+|+}_x|^2 = |1/\sqrt{2}|^2 = 1/2$.

**Kết luận**: phép đo $S_x$ ở giữa **phá vỡ thông tin** về $S_z$ — kết quả bây giờ $1/2$ thay vì chắc chắn $+\hbar/2$ như trước khi đo $S_x$. Đây là ví dụ rõ nhất của **quantum measurement disturbs the state**.

---

## Nhóm 5 — Bài toán tổng hợp

> [!example] Bài P5.1 — Oscillating perturbation và resonance
>
> QHO trong trạng thái cơ bản $\ket{0}$. Nhiễu loạn $\hat{H}'(t) = \epsilon\hat{x}\cos(\omega' t)$ bật vào lúc $t=0$. Tính xác suất tìm hệ ở trạng thái $\ket{1}$ tại thời điểm $t$ (bậc 1 TDPT). Tại giá trị $\omega'$ nào xác suất lớn nhất?

**Lời giải:**

Từ Definition 14.1:

$$c_1^{(1)}(t) = \frac{\epsilon}{i\hbar}\int_0^t \bra{1}\hat{x}\ket{0}\cos(\omega't')e^{i\omega_{10}t'}\,dt'$$

Matrix element: $\bra{1}\hat{x}\ket{0} = \sqrt{\hbar/2m\omega}$.

Cos decomposition: $\cos(\omega't) = \frac{1}{2}(e^{i\omega't}+e^{-i\omega't})$.

$$c_1^{(1)}(t) = \frac{\epsilon}{2i\hbar}\sqrt{\frac{\hbar}{2m\omega}}\left[\frac{e^{i(\omega+\omega')t}-1}{\omega+\omega'} + \frac{e^{i(\omega-\omega')t}-1}{\omega-\omega'}\right]$$

Gần cộng hưởng $\omega' \approx \omega$ (absorption): số hạng thứ hai chiếm ưu thế:

$$P_{0\to1}(t) \approx \frac{\epsilon^2}{8m\omega\hbar}\cdot\frac{\sin^2[(\omega-\omega')t/2]}{[(\omega-\omega')/2]^2}$$

**Xác suất lớn nhất** tại $\omega' = \omega$ (cộng hưởng chính xác) → $P_{0\to1} = \frac{\epsilon^2 t^2}{8m\omega\hbar}$ — tăng theo $t^2$.

**Ý nghĩa**: Chỉ trạng thái $\ket{1}$ được kích thích (do $\bra{n}\hat{x}\ket{0} = 0$ với $n\neq 1$) — đây là selection rule của QHO.

> [!example] Bài P5.2 — Symmetry và selection rules
>
> Xét toán tử $\hat{H}' = V_0\cos(2\pi x/a)$ tác động lên giếng vô hạn $[0,a]$. Chứng minh $E_n^1 = 0$ với mọi $n$, và tính $E_1^2$ (bậc 2 từ mức $n=1$).

**Lời giải:**

**Bậc 1:**

$$E_n^1 = \frac{2V_0}{a}\int_0^a \sin^2\!\!\left(\frac{n\pi x}{a}\right)\cos\!\left(\frac{2\pi x}{a}\right)\,dx$$

Dùng $\sin^2\theta = (1-\cos 2\theta)/2$:

$$= \frac{V_0}{a}\int_0^a \left[\cos\!\left(\frac{2\pi x}{a}\right) - \frac{1}{2}\cos\!\left(\frac{2(n+1)\pi x}{a}\right) - \frac{1}{2}\cos\!\left(\frac{2(n-1)\pi x}{a}\right)\right]dx$$

Tất cả tích phân $\int_0^a\cos(k\pi x/a)dx = 0$ với $k \neq 0$ nguyên. Với $n = 1$: số hạng cuối có $k = 0$ → $\int_0^a dx = a$, nhưng hệ số $-1/2$, còn số hạng đầu cũng cho $a$ với $k = 2 \neq 0$... Thực ra với $n=1$, $k=0$ trong số hạng cuối → đóng góp $-V_0/2$. Với $n \neq 1$: $E_n^1 = 0$.

Với $n = 1$: $E_1^1 = -V_0/2\cdot(1) = -V_0/2$? — cần kiểm tra lại chỉ số: $n=1$, số hạng $(n-1) = 0$ → $\cos(0) = 1$, tích phân $= a$, đóng góp $-V_0/2$.

Kết quả: $E_n^1 = -V_0/2\,\delta_{n1}$ — chỉ trạng thái $n=1$ có hiệu chỉnh bậc 1.

**Bậc 2** ($E_1^2$): Tính matrix elements $H'_{m1} = \bra{m^0}\hat{H}'\ket{1}$ và áp Definition 13.3. Chỉ các $m$ cho tích phân $\int\sin(m\pi x/a)\cos(2\pi x/a)\sin(\pi x/a)dx \neq 0$ đóng góp — đó là $m = 1\pm2$, tức $m = 3$ (vì $m=-1$ không tồn tại). Kết quả: $E_1^2 = |H'_{31}|^2/(E_1^0-E_3^0) < 0$.

---

## Nhóm 6 — Entanglement và đo lường

> [!example] Bài P6.1 — Reduced density matrix và decoherence
>
> Hệ AB ở trạng thái Bell $\ket{\Phi^+} = \frac{1}{\sqrt{2}}(\ket{++}+\ket{--})$. Tính **reduced density matrix** $\rho_A = \text{Tr}_B(\rho)$ (trace over B). Alice chỉ có hệ A — trạng thái hỗn hợp (mixed state) nào bà thấy?

**Lời giải:**

$\rho = \ket{\Phi^+}\bra{\Phi^+} = \frac{1}{2}(\ket{++}\bra{++} + \ket{++}\bra{--} + \ket{--}\bra{++} + \ket{--}\bra{--})$

Partial trace over B ($\text{Tr}_B$: lấy trace theo cơ sở $\ket{+}_B, \ket{-}_B$):

$$\rho_A = \bra{+}_B\rho\ket{+}_B + \bra{-}_B\rho\ket{-}_B$$

$$= \frac{1}{2}\ket{+}_A\bra{+}_A + \frac{1}{2}\ket{-}_A\bra{-}_A = \frac{1}{2}\begin{pmatrix}1&0\\0&1\end{pmatrix} = \frac{I}{2}$$

**Kết luận**: Alice thấy **trạng thái hỗn hợp hoàn toàn** ($\rho_A = I/2$) — hoàn toàn không có thông tin về phase hay correlation. Entanglement với B làm mất mọi thông tin lượng tử của A khi nhìn riêng lẻ. Đây là cơ chế của **decoherence** — tại sao các vật thể vĩ mô "mất" tính chất lượng tử khi vướng víu với môi trường.
