---
title: "16. Quantum Entanglement and Bell's Theorem"
tags: [physics, quantum-mechanics, lesson-16]
aliases: [Vướng víu lượng tử và định lý Bell]
created: 2026-03-28
---

> **Prerequisites**: [[10-dirac-hilbert|10. Ký hiệu Dirac & không gian Hilbert]] — không gian tích trực tiếp, khai triển; [[09-angular-momentum-spin|09. Mômen động lượng & spin]] — spin $1/2$, ma trận Pauli; [[15-identical-particles|15. Các hạt giống nhau]] — hàm sóng nhiều hạt.
> **Objectives**:
> - Định nghĩa trạng thái vướng víu (entangled state) và phân biệt với trạng thái tích (product state)
> - Hiểu nghịch lý EPR (Einstein-Podolsky-Rosen) và lập luận về "hidden variables"
> - Phát biểu và chứng minh bất đẳng thức Bell (Bell inequality)
> - Hiểu thực nghiệm Aspect (1982) và ý nghĩa của việc vi phạm bất đẳng thức Bell
> - Giới thiệu các ứng dụng: quantum teleportation, quantum cryptography (BB84), quantum computing

---

## Motivation

Đây là bài học cuối và cũng là nơi QM đặt ra những câu hỏi triết học sâu sắc nhất về bản chất thực tại. Einstein, dù là một trong những người đặt nền móng QM, suốt đời không chấp nhận tính ngẫu nhiên nội tại của lý thuyết. Năm 1935, ông cùng Podolsky và Rosen đề xuất một thí nghiệm tư duy (EPR paradox) nhằm chứng minh QM "không đầy đủ" — phải tồn tại các "biến ẩn" (hidden variables) chưa được QM mô tả.

Ba mươi năm sau, John Bell (1964) chứng minh rằng bất kỳ lý thuyết biến ẩn cục bộ nào cũng phải thỏa mãn một bất đẳng thức — **bất đẳng thức Bell**. Thực nghiệm của Aspect (1982) vi phạm bất đẳng thức này, khẳng định QM đúng và biến ẩn cục bộ sai. Đây là một trong những kết quả thực nghiệm quan trọng nhất thế kỷ 20.

---

## Physical Model

### Không gian Hilbert của hệ nhiều hạt

Với hai hệ con A và B có không gian Hilbert $\mathcal{H}_A$ và $\mathcal{H}_B$, không gian Hilbert tổng:

$$\mathcal{H} = \mathcal{H}_A \otimes \mathcal{H}_B$$

Cơ sở của $\mathcal{H}$: $\{\ket{i}_A \otimes \ket{j}_B\}$, thường viết gọn $\ket{i}_A\ket{j}_B$ hay $\ket{ij}$.

### Trạng thái tích và trạng thái vướng víu

> [!definition] Definition 16.1 — Trạng thái tích và vướng víu
>
> **Trạng thái tích** (product state / separable state): viết được dưới dạng tích tensor:
>
> $$\ket{\Psi} = \ket{\psi}_A \otimes \ket{\phi}_B$$
>
> **Trạng thái vướng víu** (entangled state): **không thể** viết dưới dạng trạng thái tích.

Ví dụ với hai qubit (spin $1/2$):

- $\ket{++}$ — trạng thái tích (không vướng víu)
- $\frac{1}{\sqrt{2}}(\ket{++} + \ket{--})$ — **vướng víu**: không thể tách thành $\ket{\psi}_A\otimes\ket{\phi}_B$

> [!definition] Definition 16.2 — Các trạng thái Bell (Bell states / EPR pairs)
>
> Bốn trạng thái Bell là cơ sở trực chuẩn của $\mathcal{H} = \mathbb{C}^2\otimes\mathbb{C}^2$, mỗi trạng thái đều vướng víu cực đại (maximally entangled):
>
> $$\ket{\Phi^\pm} = \frac{1}{\sqrt{2}}(\ket{++} \pm \ket{--})$$
>
> $$\ket{\Psi^\pm} = \frac{1}{\sqrt{2}}(\ket{+-} \pm \ket{-+})$$

---

## Mathematical Formalism

### Nghịch lý EPR

Alice ở Hà Nội và Bob ở Paris. Họ chia nhau cặp EPR $\ket{\Psi^-} = \frac{1}{\sqrt{2}}(\ket{+-} - \ket{-+})$ (singlet spin).

Alice đo $S_z$ của hạt của mình, nhận kết quả $+\hbar/2$. Lập tức, hạt của Bob **sụp đổ** về trạng thái $\ket{-}$ (dù cách nhau hàng nghìn km).

Einstein lập luận: Điều này vi phạm **tính cục bộ** (locality) — thông tin không thể truyền nhanh hơn ánh sáng. Do đó QM "không đầy đủ" — phải có biến ẩn $\lambda$ xác định sẵn kết quả đo từ trước.

**Lập luận hidden variables (EPR):**
- Nếu Alice đo $S_z$ được $+$, Bob chắc chắn được $-$ → spin của Bob đã "xác định là $-$" từ trước.
- Tương tự với mọi hướng đo. Vậy mỗi hạt mang một bộ hướng dẫn ẩn $\lambda$ xác định kết quả đo theo mọi hướng.

### Bất đẳng thức Bell (CHSH form)

John Bell (1964) chứng minh: **mọi lý thuyết biến ẩn cục bộ** đều phải thỏa mãn:

> [!theorem] Theorem 16.3 — CHSH Inequality (Clauser-Horne-Shimony-Holt)
>
> Với bốn hướng đo $\hat{a}, \hat{a}', \hat{b}, \hat{b}'$ bất kỳ, định nghĩa:
>
> $$E(\hat{a},\hat{b}) = \langle A(\hat{a})\cdot B(\hat{b})\rangle \quad \text{(correlation function)}$$
>
> trong đó $A, B \in \{+1,-1\}$ là kết quả đo. Mọi lý thuyết biến ẩn cục bộ đều cho:
>
> $$|S| = |E(\hat{a},\hat{b}) - E(\hat{a},\hat{b}') + E(\hat{a}',\hat{b}) + E(\hat{a}',\hat{b}')| \leq 2$$

**Chứng minh** (dạng đơn giản). Với biến ẩn $\lambda$ cố định:

$$A(\hat{a})B(\hat{b}) - A(\hat{a})B(\hat{b}') = A(\hat{a})B(\hat{b})[1 \pm A(\hat{a}')B(\hat{b}')] - A(\hat{a})B(\hat{b}')[1 \pm A(\hat{a}')B(\hat{b})]$$

Vì $A, B \in \{+1,-1\}$: $|A(\hat{a})B(\hat{b}) - A(\hat{a})B(\hat{b}')| \leq 2$.

Lấy trung bình: $|S| \leq 2$. $\blacksquare$

### QM vi phạm bất đẳng thức Bell

**Dự đoán của QM** cho singlet $\ket{\Psi^-}$ với hai hướng đo lệch nhau góc $\theta$:

$$E_\text{QM}(\hat{a},\hat{b}) = -\cos\theta_{ab}$$

Chọn tối ưu $\hat{a} = 0°$, $\hat{a}' = 90°$, $\hat{b} = 45°$, $\hat{b}' = 135°$:

$$S_\text{QM} = -\cos45° - (-\cos135°) + (-\cos45°) + (-\cos135°)$$
$$= -\frac{\sqrt{2}}{2} - \frac{\sqrt{2}}{2} - \frac{\sqrt{2}}{2} - \frac{\sqrt{2}}{2} = -2\sqrt{2}$$

$$|S_\text{QM}| = 2\sqrt{2} \approx 2.828 > 2$$

**QM vi phạm bất đẳng thức Bell** với biên độ $2\sqrt{2}$ (giá trị Tsirelson — giới hạn trên của QM).

---

## Derivation

### Thực nghiệm Aspect (1982)

Alain Aspect và cộng sự đo correlation function của các photon entangled phát từ nguyên tử calcium. Kết quả: $|S_\text{exp}| = 2.697 \pm 0.015 > 2$.

Vi phạm bất đẳng thức Bell với hơn 40 lần độ lệch chuẩn — **không thể giải thích bằng bất kỳ lý thuyết biến ẩn cục bộ nào**. (Giải Nobel Vật lý 2022: Aspect, Clauser, Zeilinger.)

**Hệ quả triết học**: Ít nhất một trong hai tính chất sau phải sai:
1. **Tính thực tại cục bộ** (local realism): các tính chất vật lý tồn tại xác định trước khi đo, và tác động cục bộ không ảnh hưởng tức thời đến nơi xa.
2. **Tính đầy đủ của QM**: QM mô tả đầy đủ thực tại.

Thực nghiệm cho thấy tính thực tại cục bộ **sai** — thế giới lượng tử về bản chất là **phi cục bộ** (nonlocal).

---

### Ứng dụng của Entanglement

**Quantum Teleportation:**

Truyền trạng thái lượng tử tùy ý $\ket{\psi}$ từ Alice đến Bob dùng một cặp EPR và 2 bit thông tin cổ điển. Không truyền vật chất, không vi phạm tốc độ ánh sáng (vì cần kênh cổ điển).

Giao thức:
1. Alice tạo cặp EPR $\ket{\Phi^+}_{AB}$.
2. Alice thực hiện Bell measurement trên $\ket{\psi}\otimes\ket{A}$ → nhận 2 bit kết quả.
3. Gửi 2 bit cho Bob (qua kênh cổ điển).
4. Bob áp dụng phép biến đổi Pauli tương ứng lên $\ket{B}$ → thu được $\ket{\psi}$.

**Quantum Key Distribution — BB84 (Bennett & Brassard 1984):**

Alice và Bob tạo khóa mật mã an toàn tuyệt đối về mặt vật lý. Bất kỳ nghe lén (eavesdropping) nào đều **nhiễu loạn** trạng thái lượng tử (do collapse), Alice và Bob phát hiện được.

**Quantum Computing:**

Qubit ở trạng thái chồng chất $\alpha\ket{0}+\beta\ket{1}$ xử lý song song $2^n$ trạng thái với $n$ qubit. Entanglement là tài nguyên tính toán — cho phép các thuật toán lượng tử (Shor's algorithm, Grover's algorithm) nhanh hơn thuật toán cổ điển theo mũ.

---

## Worked Problem

> [!example] Bài toán 16.1 — Kiểm tra entanglement
>
> Xét trạng thái hai qubit $\ket{\Psi} = \frac{1}{\sqrt{3}}(\ket{++} + \ket{+-} + \ket{--})$. Trạng thái này có vướng víu không?

**Lời giải:**

Thử viết $\ket{\Psi} = (\alpha\ket{+} + \beta\ket{-})_A\otimes(\gamma\ket{+}+\delta\ket{-})_B = \alpha\gamma\ket{++}+\alpha\delta\ket{+-}+\beta\gamma\ket{-+}+\beta\delta\ket{--}$.

So sánh hệ số:
- $\ket{++}$: $\alpha\gamma = 1/\sqrt{3}$
- $\ket{+-}$: $\alpha\delta = 1/\sqrt{3}$
- $\ket{-+}$: $\beta\gamma = 0$
- $\ket{--}$: $\beta\delta = 1/\sqrt{3}$

Từ $\beta\gamma = 0$: hoặc $\beta = 0$ hoặc $\gamma = 0$.

Nếu $\beta = 0$: $\beta\delta = 0 \neq 1/\sqrt{3}$ — mâu thuẫn.
Nếu $\gamma = 0$: $\alpha\gamma = 0 \neq 1/\sqrt{3}$ — mâu thuẫn.

Không thể viết dưới dạng trạng thái tích → $\ket{\Psi}$ là **trạng thái vướng víu**.

> [!example] Bài toán 16.2 — Correlation function QM cho singlet
>
> Tính $E(\hat{a},\hat{b}) = \langle\Psi^-|\hat{\sigma}_{\hat{a}}\otimes\hat{\sigma}_{\hat{b}}|\Psi^-\rangle$ với $\hat{a}$ và $\hat{b}$ là hai hướng đo tùy ý.

**Lời giải:**

$\hat{\sigma}_{\hat{a}} = \hat{a}\cdot\vec{\sigma} = a_x\sigma_x + a_y\sigma_y + a_z\sigma_z$.

Dùng tính chất của singlet: với mọi hướng $\hat{n}$, $(\hat{\sigma}_{\hat{n}}\otimes\hat{\sigma}_{\hat{n}})\ket{\Psi^-} = -\ket{\Psi^-}$, và $(\hat{\sigma}_{\hat{a}}\otimes\hat{\sigma}_{\hat{b}}) = (\hat{a}\cdot\hat{b})(\hat{\sigma}\otimes\hat{\sigma}) + \ldots$

Tính toán tường minh (khai triển theo cơ sở và dùng $\langle\sigma_i\otimes\sigma_j\rangle_{\Psi^-} = -\delta_{ij}/3\cdot 3$... ):

Kết quả chuẩn: $E(\hat{a},\hat{b}) = -\hat{a}\cdot\hat{b} = -\cos\theta_{ab}$.

Với $\theta = 0°$ (cùng hướng): $E = -1$ — kết quả luôn ngược nhau (perfect anti-correlation).
Với $\theta = 90°$: $E = 0$ — không tương quan.
Với $\theta = 180°$: $E = +1$ — kết quả luôn giống nhau.

---

## Summary

- **Trạng thái vướng víu**: không thể viết $\ket{\Psi} = \ket{\psi}_A\otimes\ket{\phi}_B$ — đặc trưng phi cục bộ cơ bản của QM.
- **Bell states**: bốn cơ sở trực chuẩn của $\mathbb{C}^2\otimes\mathbb{C}^2$, đều vướng víu cực đại.
- **EPR paradox**: Einstein lập luận QM không đầy đủ, cần biến ẩn. Bell (1964) chứng minh biến ẩn cục bộ → $|S| \leq 2$. QM cho $|S| \leq 2\sqrt{2}$.
- **Thực nghiệm Aspect (1982)**: $|S| \approx 2.70 > 2$ — biến ẩn cục bộ bị loại bỏ thực nghiệm. (Nobel 2022.)
- **Ứng dụng**: quantum teleportation (truyền trạng thái QM), QKD/BB84 (mật mã lượng tử), quantum computing (qubit + entanglement = tài nguyên tính toán).
- Entanglement không cho phép truyền thông tin nhanh hơn ánh sáng — cần kênh cổ điển để hoàn thành giao thức.

---

## References

- Griffiths — *Introduction to Quantum Mechanics*, 2nd ed., Ch. 12
- Bell, J.S. (1964) — "On the Einstein-Podolsky-Rosen paradox", *Physics* **1**, 195
- Aspect et al. (1982) — *Physical Review Letters* **49**, 91
- Nielsen & Chuang — *Quantum Computation and Quantum Information*, Ch. 1–2
- MIT OCW 8.06 (Spring 2016) — Entanglement, Bell inequalities, quantum information
