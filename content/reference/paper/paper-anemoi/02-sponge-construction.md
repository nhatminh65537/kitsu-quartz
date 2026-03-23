---
title: "02. Sponge Construction and Hash Security for Anemoi"
type: foundation
tags: [anemoi, sponge, hermetic-sponge, indifferentiability, foundation, lesson-02]
aliases: [Sponge Construction, Hermetic Sponge, Duplex Construction]
source: "New Design Techniques for Efficient Arithmetization-Oriented Hash Functions: Anemoi Permutations and Jive Compression Mode — Bouvier, Briaud, Chaidos, Perrin, Salen, Velichkov, Willems, CRYPTO 2023 (ePrint 2022/840)"
created: 2026-03-15
---

> **Prerequisites**: Hash function (collision resistance, preimage resistance, random oracle model), CICO problem (xem [[01-ao-hash-functions-and-cico|01. AO Hash Functions & CICO]]), permutation (bijection trên $\mathbb{F}_q^b$)
> 🔴 **Prerequisite references**: Bertoni et al. — *Sponge Functions* [BDPV07] (sponge construction gốc); Bertoni et al. — *On the Indifferentiability of the Sponge Construction* [BDPV08] (bằng chứng indifferentiability)
> **Lesson type**: Foundation
> **Covers**: §3 (Sponge Construction, Duplex, Indifferentiability, Hermetic Sponge claim của Anemoi)
>
> **Notation** (ký hiệu dùng trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $P : \mathbb{F}_q^b \to \mathbb{F}_q^b$ | Permutation nền của sponge (Anemoi instance) |
> | $b = r + c$ | Tổng kích thước state (block size) — $b$ phần tử $\mathbb{F}_q$ |
> | $r$ | Rate — số phần tử $\mathbb{F}_q$ absorb/squeeze mỗi bước |
> | $c$ | Capacity — phần state ẩn, không tiếp xúc trực tiếp với input/output |
> | $\ell$ | Số cột của Anemoi instance: $b = 2\ell$, $r + c = 2\ell$ |
> | $\mathcal{H}$ | Hash function được xây dựng từ sponge |
> | $\mathcal{RO}$ | Random Oracle (ideal model) |
> | $\mathsf{IC}$ | Ideal cipher model |

---

## Motivation

AnemoiSponge là hàm hash "thông dụng" được xây dựng từ Anemoi permutation theo **sponge construction**. Để hiểu tại sao AnemoiSponge an toàn — và tại sao paper [Bou+22/23] claim cụ thể là **hermetic sponge** thay vì chỉ là collision resistance thông thường — cần nắm vững framework lý thuyết về sponge và indifferentiability.

Bài này distill §3 của paper, tập trung vào ba câu hỏi:
1. Sponge construction hoạt động như thế nào?
2. Indifferentiability có nghĩa gì?
3. Hermetic sponge claim của Anemoi là gì và tại sao nó mạnh hơn collision resistance đơn thuần?

---

## 1. Sponge Construction

### 1.1 Tổng quan kiến trúc

Sponge construction biến một **permutation** $P$ trên không gian $\mathbb{F}_q^b$ thành một hàm hash nhận input tùy độ dài và output một digest.

State có kích thước $b = r + c$ phần tử $\mathbb{F}_q$, chia thành:
- **Rate** $r$: phần "ngoài" — absorb input và produce output.
- **Capacity** $c$: phần "trong" — ẩn với adversary, bảo vệ internal entropy.

> [!note] Scheme 1.1 — Sponge Hash $\mathcal{H}$
> **Type**: Hash function
> **Setting**: Permutation $P : \mathbb{F}_q^b \to \mathbb{F}_q^b$ với $b = r + c$; input $M \in \mathbb{F}_q^*$; output length $n$.
>
> **Khởi tạo**
> - State $S \leftarrow \mathbf{0} \in \mathbb{F}_q^b$ (zero vector)
> - Chia $M$ thành các block $m_1, m_2, \ldots, m_k \in \mathbb{F}_q^r$ (có padding nếu cần)
>
> **Absorbing phase** (nạp input)
> - Với mỗi block $m_i$:
>   - $S_{[0:r]} \leftarrow S_{[0:r]} + m_i$ (XOR / cộng trường với $r$ phần tử đầu)
>   - $S \leftarrow P(S)$ (áp dụng permutation lên toàn bộ state)
>
> **Squeezing phase** (trích output)
> - Lấy $r$ phần tử đầu của $S$ làm output block đầu
> - Nếu cần thêm output: $S \leftarrow P(S)$, lấy thêm $r$ phần tử, lặp lại
> - Output: $n$ phần tử đầu tiên thu được từ squeezing

Hình minh họa dòng chảy:

```
          m₁          m₂          m₃
          ↓           ↓           ↓
State: [rate|cap] → P → [rate|cap] → P → [rate|cap] → P → ...
                                                           ↓
                                                     [output|...]
```

### 1.2 Tại sao Capacity bảo vệ an toàn?

Adversary chỉ quan sát được và kiểm soát được phần **rate** của state. Phần **capacity** không bao giờ trực tiếp XOR với input hay output — nó chỉ bị ảnh hưởng **gián tiếp** qua permutation $P$.

Điều này tạo ra "entropy buffer": ngay cả khi adversary biết toàn bộ rate, capacity vẫn chứa $c \cdot \log_2 q$ bits entropy mà adversary không thể trực tiếp kiểm soát.

> [!abstract] Định lý bảo mật cơ bản của Sponge [BDPV08]
> Nếu $P$ là random permutation (lý tưởng), thì $\mathcal{H}$ là **indifferentiable** từ Random Oracle $\mathcal{RO}$ với security $2^{c/2}$ — tức là không adversary nào trong thời gian $< 2^{c/2}$ có thể phân biệt $\mathcal{H}$ với $\mathcal{RO}$.

---

## 2. Duplex Construction (Variant)

Bên cạnh sponge chuẩn, paper [Bou+22/23, §3] cũng đề cập **Duplex construction** — biến thể cho phép xen kẽ absorb và squeeze trong cùng một session:

> [!note] Scheme 2.1 — Duplex Construction
> **Type**: Stateful, duplex-mode hash / PRF
> **Setting**: Giống sponge — $P$, $b = r + c$
>
> **$\mathsf{Duplex.Init}()$**
> - $S \leftarrow \mathbf{0}$; trả về handle trạng thái
>
> **$\mathsf{Duplex.Duplexing}(S, \sigma_{\text{in}}, \ell_{\text{out}})$**
> - Input: state $S$, input block $\sigma_{\text{in}} \in \mathbb{F}_q^r$, số output phần tử $\ell_{\text{out}} \leq r$
> - $S_{[0:r]} \leftarrow S_{[0:r]} + \sigma_{\text{in}}$
> - $S \leftarrow P(S)$
> - Output: $(S_{[0:\ell_{\text{out}}]}, S)$ — output block và state mới

Duplex hữu ích cho **authenticated encryption** và **streaming hash** khi input và output cần xen kẽ nhau.

> [!tip] 💡 Agent note
> AnemoiSponge trong paper [Bou+22/23, §6.2] chủ yếu sử dụng sponge chuẩn (không phải duplex) cho hash function thông dụng. Duplex được đề cập như một possibility cho các ứng dụng khác. Lesson này tập trung vào sponge chuẩn.

---

## 3. Indifferentiability và Hermetic Sponge

### 3.1 Indifferentiability là gì?

**Indifferentiability** (theo Maurer et al. [MRH04]) là khái niệm mạnh hơn nhiều so với collision resistance hay preimage resistance. Nó phát biểu rằng một primitive có thể **thay thế hoàn toàn** cho một ideal object trong bất kỳ protocol nào:

> [!abstract] Định nghĩa 3.1 — Indifferentiability
> Một construction $\mathcal{C}^F$ (dùng primitive $F$) là **indifferentiable** từ ideal object $\mathcal{G}$ nếu tồn tại simulator $\mathcal{S}$ sao cho không có distinguisher PPT nào phân biệt được:
> - $(C^F, F)$ — construction thực với oracle thực
> - $(\mathcal{G}, \mathcal{S}^{\mathcal{G}})$ — ideal object với simulator
>
> Intuition: $\mathcal{C}^F$ "nhìn giống" $\mathcal{G}$ từ bên ngoài, ngay cả khi adversary cũng truy cập vào $F$ trực tiếp.

**Ý nghĩa thực tế**: Nếu $\mathcal{H}$ indifferentiable từ $\mathcal{RO}$, thì mọi protocol an toàn trong Random Oracle Model đều an toàn khi thay $\mathcal{RO}$ bằng $\mathcal{H}$.

### 3.2 Hermetic Sponge — Security claim của Anemoi

Paper [Bou+22/23, §3, §6.4] đặt ra claim mạnh hơn sponge thông thường:

> [!note] Định nghĩa 3.2 — Hermetic Sponge (theo [Bou+22/23])
> Một sponge $\mathcal{H}$ với permutation $P$ được gọi là **hermetic** nếu nó thỏa mãn toàn bộ bảo mật của sponge construction như được chứng minh trong mô hình **ideal permutation** — tức là $P$ được model như random permutation, và $\mathcal{H}$ indifferentiable từ $\mathcal{RO}$ với security $2^{c/2}$.
>
> **Security claim của Anemoi**: Tất cả các AnemoiSponge instances được tham số hóa đúng đều là hermetic sponge với $2^{c/2}$ security (tương đương $2^\lambda$ với $c = 2\lambda$).

> [!info] 🟡 Hermetic Sponge Model [BDPV11] — Bertoni, Daemen, Peeters, Van Assche
> Hermetic sponge là sponge thỏa mãn indifferentiability trong ideal permutation model. Điều kiện đủ là capacity $c \geq 2\lambda$, permutation $P$ "sufficiently random", và không có shortcuts algebraic trong $P$. Đây là lý thuyết nền tảng mà [Bou+22/23] cite để justify security claim của AnemoiSponge.
>
> *(theo [BDPV11]: Bertoni, Daemen, Peeters, Van Assche — Cryptographic Sponge Functions, 2011)*

### 3.3 Tại sao hermetic claim khó đạt được?

Sponge chuẩn với random permutation dễ dàng đạt hermetic. Khó khăn nằm ở chỗ: **Anemoi không phải random permutation** — nó là permutation được thiết kế với cấu trúc algebraic rõ ràng (SPN, S-box Flystel). Câu hỏi là: liệu cấu trúc đó có tạo ra "shortcuts" cho adversary không?

Đây là lý do §7 của paper phân tích kỹ các algebraic attacks — nếu CICO problem là hard đối với Anemoi, thì Anemoi "behaves like" random permutation đủ để support hermetic claim.

> [!warning] Giới hạn của hermetic claim
> Claim của [Bou+22/23] là "heuristic" theo nghĩa rằng không có bằng chứng formal rằng Anemoi permutation indistinguishable từ random permutation. Thay vào đó, paper chứng minh rằng không có algebraic attack hiệu quả nào được biết đến — đây là tiêu chuẩn thực tế trong thiết kế symmetric primitives.
>
> *(Điều này consistent với cách Poseidon, Rescue-Prime, và tất cả AO hash hiện tại claim security — không có ai có reduction từ một hardness assumption rõ ràng như DLP hay LWE.)*

---

## 4. Tham số hóa AnemoiSponge

### 4.1 Lựa chọn $r$ và $c$

Từ bảo mật $2^\lambda$, cần capacity $c \geq 2\lambda$ phần tử $\mathbb{F}_q$. Với $q \approx 2^{255}$ (BLS12-381):
- $\lambda = 127 \Rightarrow c = 1$ phần tử $\mathbb{F}_q$ (vì $\log_2 q \approx 255 > 2 \times 127$)
- $\ell = 1 \Rightarrow b = 2\ell = 2$ phần tử tổng cộng
- Rate: $r = b - c = 2 - 1 = 1$ phần tử/bước

> [!note] Scheme 4.1 — AnemoiSponge-BLS12-381
> **Permutation**: $P = $ Anemoi instance trên $\mathbb{F}_{q_{\text{BLS12}}}^2$ (với $\ell = 1$, 19 rounds)
> **Rate**: $r = 1$ phần tử $\mathbb{F}_q$ mỗi bước absorption
> **Capacity**: $c = 1$ phần tử $\mathbb{F}_q$ ($\approx 255$ bits $> 2 \times 127$)
> **Security claim**: $2^{127}$ bits chống tất cả known attacks

### 4.2 Padding

Paper [Bou+22/23, §3] dùng padding đơn giản để đảm bảo input có độ dài bội số của $r$. Cụ thể: thêm một phần tử $1$ vào cuối rồi pad bằng $0$.

> [!tip] 💡 Agent note
> Sponge construction "tự nhiên miễn dịch" với length extension attack — adversary không thể extend $\mathcal{H}(M)$ thành $\mathcal{H}(M \| M')$ mà không biết internal state, vì capacity luôn ẩn.

---

## 5. Duplex và CICO: Kết nối trực tiếp

Một nhận xét quan trọng từ [Bou+22/23, §3]: mục tiêu của adversary trong sponge attack chính xác là dạng CICO problem!

Cụ thể: adversary kiểm soát rate (constraint trên input) và muốn rate của output cũng là zero (constraint trên output) — để tạo ra collision hoặc forge. Đây là CICO với $\ell = 1$ cho $r = c = 1$.

$$
\text{CICO hardness} \Longrightarrow \text{no collision in AnemoiSponge}
$$

Mối liên hệ này là cơ sở để số rounds của Anemoi được chọn dựa trên **algebraic attack complexity chống CICO**, không phải dựa trên statistical attack complexity (§7).

---

## 6. Summary

- Sponge construction: state $b = r + c$, absorb input vào rate, capacity bảo vệ internal entropy.
- Hermetic sponge: security model mạnh nhất cho sponge — indifferentiability từ Random Oracle, với $2^{c/2}$ security.
- AnemoiSponge claim hermetic sponge — điều này valid nếu CICO là hard đối với Anemoi permutation.
- Việc chọn số rounds của Anemoi được driven bởi algebraic attack complexity, không phải statistical attacks.
- Kết nối: sponge adversary goal ≡ CICO problem với $\ell = 1$ — linking §3 và §7 của paper.

Tiếp theo: [[03-flystel-sbox|03. The Flystel S-Box]] — thiết kế S-box của Anemoi và mối quan hệ CCZ-equivalence/arithmetization-orientation.

---

## References

- [Bou+22/23] Bouvier et al. — *Anemoi Permutations and Jive Compression Mode*, CRYPTO 2023 / ePrint 2022/840
- [BDPV07] Bertoni, Daemen, Peeters, Van Assche — *Sponge Functions*, ECRYPT Hash Workshop 2007 (🔴 Prerequisite)
- [BDPV08] Bertoni, Daemen, Peeters, Van Assche — *On the Indifferentiability of the Sponge Construction*, EUROCRYPT 2008 (🔴 Prerequisite)
- [BDPV11] Bertoni, Daemen, Peeters, Van Assche — *Cryptographic Sponge Functions*, 2011 (🟡 Hermetic sponge model)
- [MRH04] Maurer, Renner, Holenstein — *Indifferentiability, Impossibility Results on Reductions, and Applications*, TCC 2004 (🔴 Prerequisite — indifferentiability framework)
