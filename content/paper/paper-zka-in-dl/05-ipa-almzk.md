---
title: "05. Almost Zero-Knowledge Inner Product Argument (IPAalmZK)"
type: scheme
tags: [inner-product, zero-knowledge, bulletproofs, almost-zk, redundancy, lesson-05]
aliases: [IPAalmZK, Almost-ZK IPA, Inner Product Argument]
source: "Efficient zero-knowledge arguments in the discrete log setting, revisited — Hoffmann, Klooß, Rupp, CCS 2019 / ePrint 2019/944"
created: 2026-03-15
---

> **Prerequisites**: [[04-lmpazk|04. LMPAZK]] (recursive witness compression, off-diagonal testing, ZK conversion via linear combination); [[02-testing-distributions|02. Testing Distributions]] (kernels and redundancy, uniform-or-unique responses).
> 🔴 **Prerequisite references**: Bünz et al. [Bün18] — §3 (Bulletproofs inner product argument — nền tảng của IPAalmZK).
> **Lesson type**: Scheme
> **Covers**: §4.1 — IPAalmZK (almost zero-knowledge inner product argument). Protocol 4.1 (non-ZK IPA từ [Boo16]/[Bün18]); ZK conversion qua kernel/redundancy technique; correctness và "almost ZK" analysis.
>
> **Notation** (bổ sung):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $\langle x, y \rangle$ | Inner product $\sum_i x_i y_i \in \mathbb{F}_p$ | $\langle x, y \rangle$ |
> | $x, y \in \mathbb{F}_p^n$ | Hai witness vectors của inner product | $x, y$ |
> | $t \in \mathbb{F}_p$ | Claimed inner product value | $t$ |
> | $r, s \in \mathbb{F}_p^n$ | Masking/randomness vectors | $r, s$ |
> | $[c_x], [c_y]$ | Commitments đến $x$ và $y$ | $[c_x], [c_y]$ |
> | $[P]$ | Combined commitment key (Pedersen) | $[P]$ |
> | $\varepsilon$-HVZK | Statistical distance $\varepsilon$ giữa real và simulated transcripts | — |

---

## Motivation

**Bài toán inner product**: Cho hai vectors $x, y \in \mathbb{F}_p^n$ đã committed, prove:

$$
\exists x, y \;:\; \langle x, y \rangle = \sum_{i=1}^n x_i y_i = t
$$

Đây là bài toán nền tảng vì rất nhiều relations thực tế có thể reduce về inner product:
- **R1CS** (rank-1 constraint system): equation $\langle a, w \rangle \cdot \langle b, w \rangle = c$ chính là inner product của hai linear combinations.
- **Range proofs**: chứng minh $v \in [0, 2^n)$ reduce về $\langle b, 2^{[n]} \rangle = v$ với $b \in \{0,1\}^n$.
- **Quadratic equations** (§4.2): $\langle w, \Gamma w \rangle = 0$ là inner product của $w$ và $\Gamma w$.

**Bulletproofs** [Bün18] cung cấp IPA với communication $O(\log n)$. Tuy nhiên Bulletproofs **không ZK** cho inner product (chỉ HVZK khi cả hai vectors đã committed). Paper [HKR19] xây dựng **IPAalmZK** — phiên bản "almost ZK" với constant communication và logarithmic computational overhead.

**Tại sao "almost" ZK?** Đây là điểm quan trọng cần hiểu rõ.

---

## Vấn đề: Tại sao IPA khó ZK?

Xét IPA đơn giản nhất: prove $\langle x, y \rangle = t$ với $x, y$ không committed. Để ZK, cần mask: thay bằng $\langle x + r, y + s \rangle = t'$ với $r, s$ random.

**Vấn đề cơ bản**: Expand $\langle x + r, y + s \rangle = \langle x, y \rangle + \langle r, y \rangle + \langle x, s \rangle + \langle r, s \rangle$. Muốn không leak thêm thông tin, cần:

$$
\langle r, y \rangle = 0, \quad \langle x, s \rangle = 0, \quad \langle r, s \rangle = t' - t
$$

Ba điều kiện đầu yêu cầu $r \perp y$ và $s \perp x$ — nhưng $x$ và $y$ là **secret**, prover không thể chọn $r, s$ thỏa điều kiện này một cách uniform!

**Giải pháp của [HKR19]**: Áp dụng kỹ thuật **kernel/redundancy** (§1.1.4). Thay vì yêu cầu $r \perp y$ chính xác, chọn $r$ từ một subspace được thiết kế đặc biệt sao cho $\langle r, y \rangle = 0$ với xác suất cao — và "enough randomness" vẫn còn để mask $x$.

**"Almost ZK"** có nghĩa: statistical distance giữa real và simulated transcript là $\varepsilon > 0$ nhỏ (không phải 0 như perfect ZK), nhưng đủ nhỏ trong practice. Cụ thể, $\varepsilon$ là negligible function của security parameter khi chọn logarithmically many random components.

---

## §4.1 — Protocol Base: Non-ZK IPA (từ [Boo16], [Bün18])

Trước khi build IPAalmZK, nhắc lại IPA không ZK được dùng làm nền.

> [!info] 🟡 Inner Product Argument từ Bulletproofs [Bün18]
> Bulletproofs cung cấp argument cho $\langle a, b \rangle = c$ với $a, b \in \mathbb{F}_p^n$ đã committed qua $[P] = [\mathbf{g}]^a [\mathbf{h}]^b h^c \in G$ (multiplicative notation). Communication $O(\log n)$.
>
> Recursive step ($k = 2$): Split $a = (a_L, a_R)$, $b = (b_L, b_R)$. Prover gửi $[L] = [\mathbf{g}_R]^{a_L}[\mathbf{h}_L]^{b_R} h^{\langle a_L, b_R \rangle}$ và $[R] = [\mathbf{g}_L]^{a_R}[\mathbf{h}_R]^{b_L} h^{\langle a_R, b_L \rangle}$. Verifier gửi $x \leftarrow \mathbb{F}_p$. Compressed: $a' = x a_L + x^{-1} a_R$, $b' = x^{-1} b_L + x b_R$. Verify $\langle a', b' \rangle = x^2 \langle a_L, b_R \rangle + c + x^{-2} \langle a_R, b_L \rangle$.
>
> *(theo [Bün18]: Bünz, Bootle, Boneh, Poelstra, Wuille, Maxwell — Bulletproofs: Short Proofs for Confidential Transactions and More, S&P 2018)*

Trong notation của [HKR19] (additive implicit, $k = 2$):

> [!note] Protocol 4.1 — $\mathsf{IPA}_\text{noZK}$
> **Type**: Argument of Knowledge ($O(\log n)$ rounds, không ZK)
> **Setting**: Commitment key $[\mathbf{g}] = [g_1, \ldots, g_n] \in G^n$, $[\mathbf{h}] = [h_1, \ldots, h_n] \in G^n$, $[q] \in G$. Common input: $([c_x], [c_y], t)$ với $[c_x] = [\mathbf{g}]x$, $[c_y] = [\mathbf{h}]y$, $t \in \mathbb{F}_p$. Witness: $(x, y) \in \mathbb{F}_p^n \times \mathbb{F}_p^n$.
>
> **$\mathsf{RecursiveStep}$** (khi $n > 1$, split $x = (x_L, x_R)$, $y = (y_L, y_R)$):
>
> 1. **P → V**: Tính cross-terms:
>    - $[L] = [\mathbf{g}_R]x_L + [\mathbf{h}_L]y_R + [q]\langle x_L, y_R \rangle \in G$
>    - $[R] = [\mathbf{g}_L]x_R + [\mathbf{h}_R]y_L + [q]\langle x_R, y_L \rangle \in G$
>    - Gửi $([L], [R])$
>
> 2. **V → P**: Chọn $x \leftarrow \mathbb{F}_p^\times$. Gửi $x$
>
> 3. Cả hai bên tính compressed statement:
>    - $[\mathbf{g}'] = x^{-1}[\mathbf{g}_L] + x[\mathbf{g}_R] \in G^{n/2}$
>    - $[\mathbf{h}'] = x[\mathbf{h}_L] + x^{-1}[\mathbf{h}_R] \in G^{n/2}$
>    - $[c_x'] = x[c_{x,L}] + x^{-1}[c_{x,R}]$
>    - $[c_y'] = x^{-1}[c_{y,L}] + x[c_{y,R}]$
>    - $t' = x^2 \langle x_L, y_R \rangle + t + x^{-2} \langle x_R, y_L \rangle$ (chỉ P tính, dùng $[L], [R]$ từ V)
>
> 4. P tính $x' = x x_L + x^{-1} x_R$, $y' = x^{-1} y_L + x y_R$. Đệ quy với $(x', y', n/2)$.
>
> **$\mathsf{BaseCase}$** ($n = 1$):
>
> 1. **P → V**: Gửi $(x_1, y_1) \in \mathbb{F}_p^2$
> 2. **V**: Accept nếu $[\mathbf{g}']x_1 = [c_x']$ và $[\mathbf{h}']y_1 = [c_y']$ và $x_1 y_1 = t'$

**Correctness**: Mỗi round bảo toàn invariant $\langle x', y' \rangle = t'$ và commitments hợp lệ. Kiểm tra:

$$
\langle x x_L + x^{-1} x_R,\; x^{-1} y_L + x y_R \rangle = \langle x_L, y_R \rangle + \langle x_R, y_L \rangle + x^{-2}\langle x_R, y_L \rangle x^2 + \ldots
$$

Thực ra: $\langle x', y' \rangle = x^2 \langle x_L, y_R \rangle + \langle x_L, y_L \rangle + \langle x_R, y_R \rangle + x^{-2} \langle x_R, y_L \rangle = x^2 \langle x_L, y_R \rangle + t + x^{-2} \langle x_R, y_L \rangle = t'$ ✓

---

## IPAalmZK — ZK Conversion via Kernel/Redundancy

Bây giờ add ZK. Key insight từ §1.1.4 và Example 1.1:

> Trong IPAalmZK cho $\exists x, y : \langle x, y \rangle = t$, ta randomise thành $\langle x + r, y + s \rangle = t$ với các constraints trên $r, s$ sao cho:
> $$\langle r, y \rangle = \langle r, s \rangle = \langle x, s \rangle = 0$$
> chỉ với **logarithmically many** (well-chosen) random components trong $r$ và $s$.

**Xây dựng $r$ và $s$**: Với $n = 2^d$ (simplicity), chọn randomness ở **mỗi level** của recursion, không phải toàn bộ lúc đầu. Cụ thể: ở level $\ell$, witness $n$-vector được split thành $2$ blocks. Thêm một random scalar vào mỗi round để mask cross-term. Tổng: $d = \log_2 n$ random scalars cho mỗi của $r$ và $s$.

**Kernel constraints**: Các components của $r$ được chọn nằm trong kernel của một số linear map liên quan đến $y$ (và tương tự cho $s$ với $x$). Vì tất cả điều kiện $\langle r, y \rangle = 0$ v.v. đều **linear** trong $r$, có thể giải được với logarithmically many free parameters — đây là lý do chỉ cần $O(\log n)$ random components.

> [!note] Protocol — $\mathsf{IPA}_\text{almZK}$
> **Type**: Argument of Knowledge ($O(\log n)$ rounds, $\varepsilon$-statistical HVZK)
> **Setting**: Như $\mathsf{IPA}_\text{noZK}$ nhưng với masking vectors $r, s$. Common input: $([c_x], [c_y], t)$. Witness: $(x, y)$.
>
> **$\mathsf{MaskSetup}$** (P → V, move 1):
> - Chọn logarithmically many random scalars: $\rho_1, \ldots, \rho_d, \sigma_1, \ldots, \sigma_d \leftarrow \mathbb{F}_p$
> - Construct $r \in \mathbb{F}_p^n$ và $s \in \mathbb{F}_p^n$ từ $\rho_i, \sigma_i$ sao cho:
>   $\langle r, y \rangle = \langle r, s \rangle = \langle x, s \rangle = 0$
> - Tính $[c_r] = [\mathbf{g}]r$, $[c_s] = [\mathbf{h}]s$
> - Gửi $([c_r], [c_s])$
>
> **$\mathsf{ZKChallenge}$** (V → P, move 2):
> - Chọn $(x_1, x_2) \leftarrow \chi^{(\beta)}$ với $x_2 \neq 0$
> - Gửi $(x_1, x_2)$
>
> **$\mathsf{CombinedIPA}$** (P ↔ V, moves 3–end):
> - Đặt $x' = x_1 x + x_2 r$ và $y' = x_1 y + x_2 s$ (combined witnesses)
> - Note: $\langle x', y' \rangle = x_1^2 t + x_1 x_2 \underbrace{(\langle x, s \rangle + \langle r, y \rangle)}_{=0} + x_2^2 \underbrace{\langle r, s \rangle}_{=0} = x_1^2 t$
> - Thực hiện $\mathsf{IPA}_\text{noZK}$ với $([c_{x'}], [c_{y'}], x_1^2 t)$ và witness $(x', y')$

**Correctness kiểm tra**:

$$
\langle x', y' \rangle = \langle x_1 x + x_2 r,\; x_1 y + x_2 s \rangle = x_1^2 \langle x, y \rangle + x_1 x_2 \underbrace{(\langle x,s \rangle + \langle r,y \rangle)}_{=0} + x_2^2 \underbrace{\langle r,s \rangle}_{=0} = x_1^2 t \;\checkmark
$$

Ba kernel constraints đảm bảo các cross-terms triệt tiêu.

> [!abstract] Security của IPAalmZK
> **Completeness**: Theo correctness check trên — honest prover luôn accept.
>
> **$\varepsilon$-HVZK**: Simulator chọn $(x_1, x_2)$ theo distribution. Vì $x_2 \neq 0$, combined witness $x' = x_1 x + x_2 r$ phân phối **statistically close** to uniform — $r$ có đủ entropy từ $d = \log n$ random scalars. Statistical distance $\varepsilon$ là negligible function. Đây là lý do tên "almost ZK".
>
> **Special soundness**: Từ hai transcripts với $x_1 \neq x_1'$, extract $(x, y)$ từ $(x', y')$ và $(x'', y'')$:
> $$x = \frac{x_2' x'' - x_2'' x'}{x_1' x_2'' - x_1'' x_2'}, \quad y = \frac{x_2' y'' - x_2'' y'}{x_1' x_2'' - x_1'' x_2'}$$
> (giải hệ phương trình tuyến tính).

> [!tip] 💡 Agent note
> **Tại sao "almost" chứ không "perfect" ZK?** Vì $r$ chỉ có $d = \log n$ random scalar components (để đảm bảo kernel constraints), toàn bộ vector $r \in \mathbb{F}_p^n$ không phân phối uniform — chỉ là $2^{O(\log n)} = n^{O(1)}$ dimensional distribution. Tuy nhiên, statistical distance từ uniform là negligible khi $p$ đủ lớn (ví dụ $p \approx 2^{256}$). Trong practice, $\varepsilon$-HVZK với $\varepsilon = \mathsf{negl}(\kappa)$ là đủ.

---

## Efficiency và Overhead

**Communication**: $\mathsf{IPA}_\text{almZK}$ vs $\mathsf{IPA}_\text{noZK}$:
- Thêm 1 round đầu: 2 group elements ($[c_r], [c_s]$)
- Thêm 1 round ZK challenge: 2 field elements ($(x_1, x_2)$)
- Các round recursive: giống hệt $\mathsf{IPA}_\text{noZK}$

Tổng overhead: **constant** — $O(1)$ group elements và $O(1)$ field elements.

**Prover computation**: Thêm $O(n)$ tính $r, s$ và $x', y'$ — logarithmic overhead so với $O(n)$ của IPA base. Paper claim: $\approx 4n$ exponentiations cho IPAalmZK (so với $\approx 6n$ của Bulletproofs [Bün18] cho R1CS).

**Extraction bound**: Áp dụng short-circuit extraction (Lemma 2.20, Lesson 02). Mỗi round cần $\mu_i = 3$ challenges ($(2k-1)$ với $k=2$), quick-extract từ $\mu'_i = 1$:

$$
\text{transcripts} = O(\log n \cdot n) = O(n \log n)
$$

So với [Bün18] cần $O(n^3 N)$ theo analysis không dùng short-circuit — improvement rất lớn.

---

## Kết nối với LMPAZK

IPAalmZK và LMPAZK là hai "cánh" của §4: một cho **inner product**, một cho **linear map preimage**. Chúng share nhiều kỹ thuật (recursive compression, ZK conversion qua linear combination), nhưng handle hai loại relation khác nhau.

**Inner product** $\langle x, y \rangle = t$ là **quadratic** (phi tuyến): $x$ và $y$ đều là witness, tích của chúng là quadratic. Đây là lý do cần "almost ZK" thay vì perfect ZK như LMPAZK.

**Linear map preimage** $[A]w = [t]$ là **linear**: $[A]$ là public, chỉ $w$ là witness. Có thể đạt perfect ZK.

Trong §4.2, IPAalmZK sẽ là building block để xây dựng **QESAZK** — argument cho quadratic equations.

---

## Summary

- **$\mathsf{IPA}_\text{noZK}$** (Protocol 4.1): Derived từ [Boo16]/[Bün18]. Recursive compression với cross-term $([L], [R])$. $O(\log n)$ communication. Không ZK.
- **Kernel/redundancy technique**: Chọn $r, s$ với $\log n$ free random components sao cho $\langle r, y \rangle = \langle r, s \rangle = \langle x, s \rangle = 0$ — đây là áp dụng kỹ thuật §1.1.4 vào inner product.
- **IPAalmZK**: Linear combination của IPA thật $(x, y)$ với masking $(r, s)$ → "$\varepsilon$-statistical HVZK" với $\varepsilon = \mathsf{negl}(\kappa)$. Constant communication overhead, logarithmic computational overhead.
- **"Almost" ZK**: $r, s$ chỉ span $O(n^{O(1)})$-dimensional subspace, không uniform trên $\mathbb{F}_p^n$. Statistical distance nhỏ nhưng không bằng 0.
- **Extraction**: $O(n \log n)$ transcripts qua short-circuit — từ $O(n^{1.58})$ của analysis ngây thơ.

---

## References

- [HKR19] Hoffmann, Klooß, Rupp — *Efficient ZK Arguments in the Discrete Log Setting, Revisited*, CCS 2019
- [Bün18] Bünz et al. — *Bulletproofs: Short Proofs for Confidential Transactions and More*, S&P 2018 (🟡 — Protocol 4.1 base; IPAalmZK derived với ZK overhead)
- [Boo16] Bootle et al. — *Efficient ZK Arguments for Arithmetic Circuits*, EUROCRYPT 2016 (🟡 — original inner product argument §3)
