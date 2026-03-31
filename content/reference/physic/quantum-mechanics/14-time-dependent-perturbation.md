---
title: "14. Time-Dependent Perturbation Theory"
tags: [physics, quantum-mechanics, lesson-14]
aliases: [Nhiễu loạn phụ thuộc thời gian]
created: 2026-03-28
---

> **Prerequisites**: [[13-time-independent-perturbation|13. Nhiễu loạn không phụ thuộc thời gian]] — tư tưởng khai triển nhiễu loạn; [[11-heisenberg-picture|11. Heisenberg picture]] — interaction picture, toán tử tiến hóa.
> **Objectives**:
> - Thiết lập phương trình chuyển động trong interaction picture cho $c_n(t)$
> - Tính xác suất chuyển tiếp (transition probability) bậc 1
> - Phát biểu và suy ra **quy tắc vàng Fermi** (Fermi's golden rule)
> - Phân tích nhiễu loạn hình sin — resonance và rotating wave approximation
> - Hiểu khái niệm **selection rules** (quy tắc chọn lọc) từ cấu trúc ma trận

---

## Motivation

TIPT (Lesson 13) xử lý Hamiltonian không đổi theo thời gian — phù hợp tìm mức năng lượng hiệu chỉnh. Nhưng nhiều hiện tượng quan trọng liên quan đến **hệ thay đổi theo thời gian**: nguyên tử hấp thụ hay phát xạ photon khi chiếu sáng, spin lật trong trường RF, phản ứng hạt nhân dưới kích thích.

Câu hỏi trung tâm: **Nếu hệ bắt đầu ở trạng thái $\ket{i}$, xác suất tìm thấy nó ở trạng thái $\ket{f}$ sau thời gian $t$ là bao nhiêu?**

Câu trả lời — **Quy tắc vàng Fermi** — là nền tảng của vật lý nguyên tử, quang học lượng tử, và vật lý hạt nhân.

---

## Physical Model

### Bài toán — Khai triển trong interaction picture

Hamiltonian: $\hat{H} = \hat{H}^0 + \hat{H}'(t)$.

Trong interaction picture (Lesson 11), trạng thái tiến hóa theo:

$$i\hbar\frac{d\ket{\psi_I}}{dt} = \hat{H}'_I(t)\ket{\psi_I}, \qquad \hat{H}'_I = e^{i\hat{H}^0 t/\hbar}\hat{H}'(t)e^{-i\hat{H}^0 t/\hbar}$$

Khai triển trạng thái theo cơ sở eigenstates của $\hat{H}^0$:

$$\ket{\psi_I(t)} = \sum_n c_n(t)\ket{n}$$

Thế vào và chiếu lên $\bra{m}$:

$$i\hbar\dot{c}_m = \sum_n H'_{mn}(t)\,e^{i\omega_{mn}t}\,c_n(t)$$

Trong đó $H'_{mn} = \bra{m}\hat{H}'\ket{n}$ và $\omega_{mn} = (E_m - E_n)/\hbar$.

---

## Mathematical Formalism

### Xấp xỉ bậc 1 — First-order Transitions

Điều kiện đầu: hệ ở trạng thái $\ket{i}$ tại $t = 0$: $c_n(0) = \delta_{ni}$.

**Bậc 0:** $c_n^{(0)}(t) = \delta_{ni}$ (không thay đổi).

**Bậc 1:** Thế $c_n^{(0)}$ vào phương trình chuyển động:

$$i\hbar\dot{c}_f^{(1)} = H'_{fi}(t)\,e^{i\omega_{fi}t}$$

$$c_f^{(1)}(t) = \frac{1}{i\hbar}\int_0^t H'_{fi}(t')\,e^{i\omega_{fi}t'}\,dt'$$

> [!definition] Definition 14.1 — Xác suất chuyển tiếp bậc 1
>
> Xác suất tìm hệ ở trạng thái $\ket{f} \neq \ket{i}$ tại thời điểm $t$:
>
> $$P_{i\to f}(t) = |c_f^{(1)}(t)|^2 = \frac{1}{\hbar^2}\left|\int_0^t H'_{fi}(t')\,e^{i\omega_{fi}t'}\,dt'\right|^2$$

### Nhiễu loạn hình sin — Absorption và Emission

Dạng nhiễu loạn phổ biến nhất: bức xạ điện từ kích thích nguyên tử.

$$\hat{H}'(t) = \hat{V}\cos(\omega t) = \frac{\hat{V}}{2}\left(e^{i\omega t} + e^{-i\omega t}\right)$$

Thế vào, tích phân:

$$c_f^{(1)}(t) = \frac{V_{fi}}{2i\hbar}\left[\frac{e^{i(\omega_{fi}+\omega)t} - 1}{\omega_{fi}+\omega} + \frac{e^{i(\omega_{fi}-\omega)t} - 1}{\omega_{fi}-\omega}\right]$$

Gần cộng hưởng $\omega \approx \omega_{fi}$ (absorption: $E_f > E_i$), số hạng thứ hai $\gg$ số hạng thứ nhất (**rotating wave approximation**):

$$P_{i\to f}(t) \approx \frac{|V_{fi}|^2}{\hbar^2}\left|\frac{\sin[(\omega_{fi}-\omega)t/2]}{(\omega_{fi}-\omega)/2}\right|^2 \cdot \frac{1}{4}$$

> [!definition] Definition 14.2 — Xác suất chuyển tiếp gần cộng hưởng
>
> $$P_{i\to f}(t) = \frac{|V_{fi}|^2}{\hbar^2}\frac{\sin^2[(\omega_{fi}-\omega)t/2]}{(\omega_{fi}-\omega)^2}$$
>
> Hàm $\text{sinc}^2$ có:
> - Cực đại tại $\omega = \omega_{fi}$ (cộng hưởng chính xác): $P \propto t^2$
> - Độ rộng $\sim 2\pi/t$ — hẹp dần theo thời gian
> - Cực đại tăng theo $t^2$

---

### Quy tắc vàng Fermi (Fermi's Golden Rule)

Trong thực tế, các trạng thái cuối thường là **liên tục** (hay suy biến dày đặc) — ví dụ nguyên tử phát photon vào các mode bức xạ, hay tán xạ hạt. Khi đó ta tính **tổng xác suất** trên dải trạng thái cuối.

Dùng giới hạn $t \to \infty$: hàm $\sin^2(\delta\omega\cdot t/2)/(\delta\omega)^2 \to \frac{\pi t}{2}\delta(\delta\omega)$:

> [!theorem] Theorem 14.3 — Quy tắc vàng Fermi
>
> Tốc độ chuyển tiếp (transition rate — xác suất chuyển tiếp mỗi đơn vị thời gian) từ $\ket{i}$ đến tập trạng thái cuối với mật độ trạng thái $\rho(E_f)$:
>
> $$\Gamma_{i\to f} = \frac{dP}{dt} = \frac{2\pi}{\hbar}|V_{fi}|^2\rho(E_f)\bigg|_{E_f = E_i + \hbar\omega}$$
>
> Trong đó $\rho(E_f)$ là **mật độ trạng thái** (density of states) tại năng lượng $E_f$.

**Ý nghĩa**: Tốc độ chuyển tiếp **không đổi theo thời gian** (constant rate) → xác suất tích lũy tuyến tính theo $t$ → đây là nguồn gốc của **phân rã phóng xạ** và **phát xạ tự phát** (spontaneous emission).

Quy tắc vàng Fermi được dùng trong hầu hết mọi tính toán tốc độ quá trình lượng tử: quang học nguyên tử, vật lý hạt nhân, vật lý chất rắn (phonon scattering, impurity scattering), và QFT.

---

### Selection Rules — Quy tắc chọn lọc

Nhiều chuyển tiếp **bị cấm** vì $V_{fi} = 0$ do tính đối xứng. Đây là **quy tắc chọn lọc** (selection rules).

**Với bức xạ điện từ (electric dipole transitions)**: $\hat{V} \propto \hat{r}$ (toán tử vị trí).

Từ cấu trúc tích phân $V_{fi} = \bra{n_f, l_f, m_f}\hat{r}\ket{n_i, l_i, m_i}$, dùng tính chất của spherical harmonics:

> [!definition] Definition 14.4 — Electric Dipole Selection Rules
>
> Chuyển tiếp electric dipole **được phép** (allowed) khi và chỉ khi:
>
> $$\Delta l = \pm 1, \qquad \Delta m = 0, \pm 1, \qquad \Delta s = 0$$
>
> Mọi chuyển tiếp vi phạm các điều kiện trên là **bị cấm** (forbidden) ở bậc electric dipole — có thể xảy ra ở bậc cao hơn (magnetic dipole, electric quadrupole) nhưng yếu hơn nhiều.

**Nguồn gốc**: $\hat{r}$ là vector (rank-1 tensor), và tích phân góc $\int Y_{l_f}^{m_f*}\hat{r}\,Y_{l_i}^{m_i}\sin\theta\,d\theta\,d\phi$ triệt tiêu trừ khi $\Delta l = \pm 1$, $\Delta m = 0,\pm 1$ (Wigner-Eckart theorem).

---

## Derivation

### Adiabatic vs. Sudden Approximation

Ngoài TDPT, còn hai giới hạn quan trọng:

**Adiabatic approximation** — $\hat{H}'(t)$ thay đổi **cực kỳ chậm**: nếu hệ bắt đầu ở eigenstate của $\hat{H}(0)$, nó **luôn ở eigenstate tương ứng** của $\hat{H}(t)$ (theo kịp Hamiltonian). Không có chuyển tiếp giữa các mức.

**Sudden approximation** — $\hat{H}$ thay đổi **tức thì** (nhanh hơn mọi thang thời gian của hệ): hàm sóng **không kịp thay đổi** trong quá trình chuyển đổi. Xác suất chuyển tiếp:

$$P_{i\to f} = |\braket{f_\text{new}|i_\text{old}}|^2$$

Ví dụ: phân rã beta — hạt nhân thay đổi $Z$ gần như tức thời → electron ở $\psi_{1s}$ của $Z$ cũ đột ngột trong thế Coulomb của $Z+1$ → xác suất chuyển tiếp lên các mức cao.

---

## Worked Problem

> [!example] Bài toán 14.1 — Sudden perturbation: QHO bị shift
>
> QHO có $V = \frac{1}{2}m\omega^2 x^2$. Tại $t = 0$, tâm dịch đột ngột: $V \to \frac{1}{2}m\omega^2(x - a)^2$. Hệ đang ở ground state $\psi_0^{\text{old}}$. Tính xác suất ở ground state mới $\psi_0^{\text{new}}$.

**Lời giải:**

$\psi_0^{\text{old}}(x) = \left(\frac{m\omega}{\pi\hbar}\right)^{1/4}e^{-m\omega x^2/(2\hbar)}$

$\psi_0^{\text{new}}(x) = \left(\frac{m\omega}{\pi\hbar}\right)^{1/4}e^{-m\omega(x-a)^2/(2\hbar)}$

Xác suất:

$$P_{0\to 0} = \left|\int_{-\infty}^{+\infty}\psi_0^{\text{new}*}(x)\,\psi_0^{\text{old}}(x)\,dx\right|^2$$

Tích phân:

$$= \sqrt{\frac{m\omega}{\pi\hbar}}\int e^{-m\omega[(x-a)^2+x^2]/(2\hbar)}dx = \sqrt{\frac{m\omega}{\pi\hbar}}\cdot\sqrt{\frac{\pi\hbar}{m\omega}}\,e^{-m\omega a^2/(4\hbar)} = e^{-m\omega a^2/(4\hbar)}$$

$$P_{0\to 0} = e^{-m\omega a^2/(2\hbar)}$$

Nếu $a$ lớn (shift mạnh), $P_{0\to 0} \to 0$ — hệ hầu như không còn ở ground state. Nếu $a \to 0$, $P_{0\to 0} \to 1$ — nhất quán với sudden approximation.

> [!example] Bài toán 14.2 — Fermi's golden rule cho photoionization
>
> Nguyên tử Hydrogen ở trạng thái $1s$ được chiếu sóng điện từ. Ước lượng tốc độ ion hóa quang điện (photoionization rate) dùng Fermi's golden rule.

**Lời giải:**

Trạng thái cuối: electron tự do với động lượng $\mathbf{k}$, hàm sóng $\ket{f} = \frac{1}{\sqrt{V}}e^{i\mathbf{k}\cdot\mathbf{r}}$.

**Mật độ trạng thái** trong hộp thể tích $V$:

$$\rho(E_f) = \frac{V m k_f}{(2\pi)^2\hbar^2}$$

**Matrix element** electric dipole $V_{fi} = eE_0\bra{f}\hat{z}\ket{1s}$ — tích phân Fourier của $z\psi_{1s}$:

$$V_{fi} \propto \frac{eE_0 a_0^4}{(1 + k_f^2 a_0^2)^3}$$

Tốc độ chuyển tiếp theo Fermi's golden rule:

$$\Gamma \propto \frac{e^2 E_0^2 a_0^5 k_f}{(1 + k_f^2 a_0^2)^6}$$

Ở ngưỡng ion hóa ($\hbar\omega \approx 13.6$ eV): $k_f \approx 0$, $\Gamma \propto E_0^2 k_f \to 0$ — tốc độ rất nhỏ ngay tại ngưỡng, tăng khi photon có năng lượng vượt ngưỡng.

---

## Summary

- **TDPT bậc 1**: $c_f^{(1)}(t) = \frac{1}{i\hbar}\int_0^t H'_{fi}(t')e^{i\omega_{fi}t'}dt'$ — biến đổi Fourier của nhiễu loạn tại tần số cộng hưởng.
- Nhiễu loạn **hình sin** $\hat{V}\cos\omega t$: xác suất chuyển tiếp dạng $\text{sinc}^2$, cực đại tại $\omega = \omega_{fi}$.
- **Fermi's golden rule**: $\Gamma = \frac{2\pi}{\hbar}|V_{fi}|^2\rho(E_f)$ — tốc độ chuyển tiếp không đổi khi trạng thái cuối liên tục.
- **Selection rules**: $V_{fi} = 0$ do đối xứng → chuyển tiếp forbidden. Electric dipole: $\Delta l = \pm 1$, $\Delta m = 0,\pm 1$.
- **Adiabatic**: thay đổi chậm → không có chuyển tiếp, theo kịp eigenstate. **Sudden**: thay đổi nhanh → hàm sóng đóng băng, chuyển tiếp tính bằng overlap.

---

## References

- Griffiths — *Introduction to Quantum Mechanics*, 2nd ed., Ch. 9
- MIT OCW 8.06 (Spring 2016) — Time-dependent perturbation theory, Fermi's golden rule
- Sakurai — *Modern Quantum Mechanics*, 2nd ed., Ch. 5.5–5.7
- Shankar — *Principles of Quantum Mechanics*, 2nd ed., Ch. 18
