---
title: "01. Experimental Foundations of Quantum Mechanics"
tags: [physics, quantum-mechanics, lesson-01]
aliases: [Thí nghiệm nền tảng QM]
created: 2026-03-27
---

> **Prerequisites**: Không có — đây là bài mở đầu.
> **Objectives**:
> - Hiểu tại sao cơ học cổ điển thất bại ở thang nguyên tử
> - Phân tích ba thí nghiệm nền tảng: hiệu ứng quang điện, thí nghiệm khe đôi, và tán xạ Compton
> - Hiểu giả thuyết de Broglie về bản chất sóng của vật chất
> - Nhận biết khái niệm lưỡng tính sóng-hạt (wave-particle duality)

---

## Motivation

Cuối thế kỷ 19, vật lý học dường như đã hoàn chỉnh. Cơ học Newton mô tả chuyển động của mọi vật thể, điện từ học Maxwell thống nhất điện, từ và ánh sáng. Người ta tưởng rằng mọi hiện tượng tự nhiên đều đã được giải thích — chỉ còn vài "chi tiết nhỏ" cần làm sạch.

Nhưng chính những "chi tiết nhỏ" đó lại lật đổ toàn bộ nền tảng.

Ba thí nghiệm quan trọng vào đầu thế kỷ 20 phơi bày sự thất bại hoàn toàn của vật lý cổ điển ở thang nguyên tử. Các thí nghiệm này buộc các nhà vật lý phải chấp nhận một ý tưởng kỳ lạ: **ánh sáng — vốn là sóng — cũng có tính chất của hạt, và ngược lại, electron — vốn là hạt — lại mang tính chất của sóng**. Đây là điểm khởi đầu của cơ học lượng tử.

---

## Physical Model

### 1. Bức xạ vật đen (Blackbody Radiation) — Thảm họa tia tử ngoại

Một vật đen lý tưởng (blackbody) hấp thụ toàn bộ bức xạ điện từ chiếu vào. Khi được đốt nóng, nó phát ra bức xạ có phổ phụ thuộc nhiệt độ. Vật lý cổ điển — thông qua định luật Rayleigh-Jeans — dự đoán cường độ bức xạ tăng vô hạn khi tần số tăng (tia tử ngoại và cao hơn), điều này hoàn toàn sai với thực nghiệm.

> [!definition] Definition 1.1 — Giả thuyết lượng tử Planck (1900)
> Max Planck đề xuất: năng lượng không thể nhận giá trị liên tục, mà chỉ có thể là **bội số nguyên** của một lượng tử năng lượng cơ bản:
>
> $$E = n h f, \quad n = 0, 1, 2, \ldots$$
>
> Trong đó $h = 6.626 \times 10^{-34}$ J·s là **hằng số Planck**, $f$ là tần số bức xạ.
>
> Thường viết dưới dạng $E = n \hbar \omega$, với $\hbar = h/2\pi$ và $\omega = 2\pi f$.

Công thức Planck khớp hoàn hảo với dữ liệu thực nghiệm. Nhưng ý nghĩa vật lý sâu xa — tại sao năng lượng phải rời rạc? — vẫn chưa ai hiểu rõ lúc đó.

---

### 2. Hiệu ứng quang điện (Photoelectric Effect) — Einstein 1905

**Thí nghiệm**: Chiếu ánh sáng vào bề mặt kim loại. Electron bị bứt ra khỏi kim loại nếu ánh sáng đủ tần số, bất kể cường độ sáng.

**Điều kỳ lạ theo vật lý cổ điển**: Nếu ánh sáng là sóng, cường độ lớn hơn phải bứt ra nhiều electron hơn và với năng lượng lớn hơn. Nhưng thực nghiệm cho thấy:

- Nếu tần số ánh sáng $f < f_0$ (tần số ngưỡng, threshold frequency), **không có electron nào** bị bứt ra, dù cường độ sáng bao nhiêu.
- Nếu $f > f_0$, electron bị bứt ra ngay lập tức, với động năng phụ thuộc vào $f$ chứ không phải cường độ sáng.
- Cường độ sáng lớn hơn chỉ tăng **số lượng** electron bứt ra, không tăng năng lượng mỗi electron.

> [!definition] Definition 1.2 — Photon (Einstein, 1905)
> Einstein đề xuất ánh sáng không phải là sóng liên tục mà gồm các **lượng tử ánh sáng** (sau này gọi là **photon**), mỗi photon mang năng lượng:
>
> $$E = hf = \hbar\omega$$
>
> Phương trình hiệu ứng quang điện:
>
> $$K_{\max} = hf - \phi$$
>
> Trong đó $\phi = hf_0$ là **công thoát** (work function) của kim loại — năng lượng tối thiểu để bứt electron ra khỏi bề mặt, và $K_{\max}$ là động năng cực đại của electron bứt ra.

**Ý nghĩa**: Ánh sáng — vốn được Maxwell mô tả là sóng điện từ — lại có tính chất hạt (mang năng lượng rời rạc $hf$). Đây là lần đầu tiên **lưỡng tính sóng-hạt** xuất hiện rõ ràng.

---

### 3. Tán xạ Compton (Compton Scattering) — 1923

**Thí nghiệm**: Arthur Compton chiếu tia X vào một tấm carbon. Tia X sau khi tán xạ có bước sóng **dài hơn** bước sóng ban đầu — điều này không thể giải thích nếu ánh sáng chỉ là sóng.

> [!definition] Definition 1.3 — Động lượng của photon
> Compton giải thích thí nghiệm bằng cách xem photon như một hạt có **động lượng**:
>
> $$p = \frac{h}{\lambda} = \frac{\hbar\omega}{c} = \frac{E}{c}$$
>
> **Công thức dịch chuyển Compton** (Compton shift):
>
> $$\Delta\lambda = \lambda' - \lambda = \frac{h}{m_e c}(1 - \cos\theta)$$
>
> Trong đó $\theta$ là góc tán xạ, $\lambda_C = h/(m_e c) \approx 2.43 \times 10^{-12}$ m là **bước sóng Compton** của electron.

Kết quả khớp chính xác với thực nghiệm. Lúc này không còn nghi ngờ: photon **thực sự** mang động lượng như một hạt vật chất.

---

### 4. Thí nghiệm khe đôi (Double-Slit Experiment) — Nền tảng triết học của QM

Đây là thí nghiệm được Richard Feynman gọi là "chứa đựng toàn bộ bí ẩn của cơ học lượng tử."

**Thí nghiệm với ánh sáng (Young, 1801)**: Chiếu ánh sáng qua hai khe hẹp song song, xuất hiện vân giao thoa trên màn ảnh — bằng chứng rõ ràng ánh sáng là sóng.

**Thí nghiệm với electron**: Bắn từng electron một qua hai khe. Điều kỳ lạ xảy ra:

- Mỗi electron chỉ tạo ra **một điểm** trên màn (như một hạt).
- Nhưng sau khi tích lũy hàng triệu electron, **vân giao thoa** xuất hiện trên màn — như thể mỗi electron là sóng đi qua cả hai khe cùng lúc.
- Nếu đặt máy dò để xem electron đi qua khe nào, vân giao thoa **biến mất** — hành động đo lường làm thay đổi kết quả.

> [!warning] Điểm then chốt
> Không thể giải thích hành vi electron bằng cả mô hình sóng thuần túy lẫn mô hình hạt thuần túy. Electron **không phải sóng cũng không phải hạt** theo nghĩa cổ điển — nó là một thực thể mới, mà cơ học lượng tử mô tả qua **hàm sóng xác suất**.

---

### 5. Giả thuyết de Broglie (1924) — Sóng vật chất

Louis de Broglie đặt câu hỏi: nếu ánh sáng (vốn là sóng) có tính chất hạt, liệu hạt vật chất (như electron) có tính chất sóng không?

> [!definition] Definition 1.4 — Sóng de Broglie
> Mọi hạt vật chất có động lượng $p$ đều liên kết với một **sóng de Broglie** có bước sóng:
>
> $$\lambda = \frac{h}{p} = \frac{h}{mv}$$
>
> Tần số tương ứng:
>
> $$f = \frac{E}{h}$$
>
> Đây là quan hệ đối xứng hoàn toàn với photon ($E = hf$, $p = h/\lambda$).

---

## Mathematical Formalism

Tổng hợp các quan hệ định lượng nền tảng:

**Năng lượng photon và động lượng photon:**

$$E = hf = \hbar\omega, \qquad p = \frac{h}{\lambda} = \hbar k$$

Trong đó $\omega = 2\pi f$ là tần số góc, $k = 2\pi/\lambda$ là **số sóng** (wave number).

**Bước sóng de Broglie của hạt có khối lượng $m$, tốc độ $v$:**

$$\lambda = \frac{h}{mv} = \frac{h}{\sqrt{2mK}}$$

Với $K = \frac{1}{2}mv^2$ là động năng (dạng non-relativistic).

**Hiệu ứng quang điện:**

$$K_{\max} = hf - \phi, \qquad \phi = hf_0$$

**Dịch chuyển Compton:**

$$\Delta\lambda = \frac{h}{m_e c}(1 - \cos\theta)$$

---

## Derivation

### Tại sao bước sóng $\lambda = h/p$?

Ta có thể thấy tính nhất quán của công thức này từ thuyết tương đối hẹp. Với photon, năng lượng và động lượng liên hệ qua $E = pc$ (vì photon không có khối lượng). Từ Planck:

$$E = hf = h\frac{c}{\lambda}$$

Suy ra:

$$p = \frac{E}{c} = \frac{hf}{c} = \frac{h}{\lambda} \implies \lambda = \frac{h}{p}$$

De Broglie đề xuất đơn giản rằng quan hệ $\lambda = h/p$ là **phổ quát** — áp dụng cho mọi hạt, không chỉ photon.

### Ước tính bước sóng de Broglie

Để hiểu tại sao QM không cần thiết trong đời thường: so sánh bước sóng de Broglie của một electron và một quả bóng tennis.

**Electron** ($m = 9.11 \times 10^{-31}$ kg) chuyển động với $v = 10^6$ m/s (điển hình trong nguyên tử):

$$\lambda_e = \frac{6.626 \times 10^{-34}}{9.11 \times 10^{-31} \times 10^6} \approx 7.3 \times 10^{-10} \text{ m} = 0.73 \text{ nm}$$

Đây là cùng cỡ với kích thước nguyên tử ($\sim 0.1$ nm) và khoảng cách giữa các nguyên tử trong tinh thể — nên hiệu ứng sóng của electron **rất quan trọng** ở thang nguyên tử.

**Quả bóng tennis** ($m = 0.057$ kg) ở $v = 20$ m/s:

$$\lambda_{\text{ball}} = \frac{6.626 \times 10^{-34}}{0.057 \times 20} \approx 5.8 \times 10^{-34} \text{ m}$$

Nhỏ hơn kích thước proton ($10^{-15}$ m) rất nhiều — hoàn toàn không thể phát hiện, nên quả bóng hoàn toàn "hành xử như hạt" trong thực tế.

**Kết luận**: Cơ học lượng tử chỉ trở nên quan trọng khi bước sóng de Broglie của hạt **so được** với kích thước hệ vật lý đang xét.

---

## Worked Problem

> [!example] Bài toán 1.1 — Hiệu ứng quang điện trên Natri
>
> Công thoát của Natri (Na) là $\phi = 2.28$ eV. Chiếu ánh sáng có bước sóng $\lambda = 400$ nm vào bề mặt Na.
>
> **(a)** Tính tần số và năng lượng của photon.
> **(b)** Electron có bị bứt ra không? Nếu có, tính động năng cực đại.
> **(c)** Tính tốc độ cực đại của electron bứt ra.

**Lời giải:**

**(a)** Tần số của photon:

$$f = \frac{c}{\lambda} = \frac{3.00 \times 10^8}{400 \times 10^{-9}} = 7.50 \times 10^{14} \text{ Hz}$$

Năng lượng photon:

$$E = hf = (6.626 \times 10^{-34})(7.50 \times 10^{14}) = 4.97 \times 10^{-19} \text{ J}$$

Đổi sang eV: $E = 4.97 \times 10^{-19} / 1.602 \times 10^{-19} = 3.10$ eV.

**(b)** Vì $E = 3.10$ eV $> \phi = 2.28$ eV, electron **bị bứt ra**. Động năng cực đại:

$$K_{\max} = E - \phi = 3.10 - 2.28 = 0.82 \text{ eV} = 1.31 \times 10^{-19} \text{ J}$$

**(c)** Tốc độ cực đại ($m_e = 9.11 \times 10^{-31}$ kg):

$$v_{\max} = \sqrt{\frac{2K_{\max}}{m_e}} = \sqrt{\frac{2 \times 1.31 \times 10^{-19}}{9.11 \times 10^{-31}}} \approx 5.36 \times 10^5 \text{ m/s}$$

Lưu ý: $v_{\max} \approx 0.18\%$ tốc độ ánh sáng — non-relativistic, công thức $K = \frac{1}{2}mv^2$ hợp lệ.

> [!example] Bài toán 1.2 — Thí nghiệm Davisson-Germer
>
> Năm 1927, Davisson và Germer bắn electron vào tinh thể Nickel và quan sát vân nhiễu xạ — xác nhận trực tiếp giả thuyết de Broglie. Electron được gia tốc qua hiệu điện thế $V = 54$ V. Tính bước sóng de Broglie.

**Lời giải:**

Năng lượng electron sau khi gia tốc: $K = eV = (1.602 \times 10^{-19})(54) = 8.65 \times 10^{-18}$ J.

Động lượng: $p = \sqrt{2m_e K} = \sqrt{2(9.11 \times 10^{-31})(8.65 \times 10^{-18})} = 3.97 \times 10^{-24}$ kg·m/s.

Bước sóng de Broglie:

$$\lambda = \frac{h}{p} = \frac{6.626 \times 10^{-34}}{3.97 \times 10^{-24}} \approx 1.67 \times 10^{-10} \text{ m} = 0.167 \text{ nm}$$

Khoảng cách giữa các mặt phẳng nguyên tử trong Nickel là $\sim 0.215$ nm — cùng cỡ với $\lambda$, nên vân nhiễu xạ quan sát được là hoàn toàn hợp lý.

---

## Summary

- Vật lý cổ điển thất bại ở thang nguyên tử: **bức xạ vật đen** (thảm họa tia tử ngoại), **hiệu ứng quang điện**, và **tán xạ Compton** đều không thể giải thích nếu ánh sáng chỉ là sóng.
- **Planck** (1900): năng lượng dao động rời rạc $E = nhf$. **Einstein** (1905): ánh sáng gồm các photon, mỗi photon mang $E = hf$ và $p = h/\lambda$.
- **Thí nghiệm khe đôi**: electron thể hiện **giao thoa** (tính chất sóng), nhưng mỗi lần đo chỉ tạo ra một điểm (tính chất hạt). Hành động đo lường phá vỡ giao thoa.
- **de Broglie** (1924): mọi hạt có động lượng $p$ đều liên kết với sóng bước sóng $\lambda = h/p$.
- Hiệu ứng lượng tử chỉ quan trọng khi $\lambda_{\text{de Broglie}}$ so được với kích thước hệ — giải thích tại sao QM không cần thiết cho các vật thể vĩ mô.

---

## References

- Griffiths, D.J. — *Introduction to Quantum Mechanics*, 2nd ed., Ch. 1 giới thiệu; Appendix về hằng số vật lý
- MIT OCW 8.04 — Lectures 3, 4 (Adams 2013): Photoelectric effect, Compton scattering, de Broglie
- Feynman, Leighton, Sands — *The Feynman Lectures on Physics*, Vol. 3, Ch. 1: Quantum Behavior
- Zwiebach, B. — *Mastering Quantum Mechanics* (MIT Press, 2022), Part 1
