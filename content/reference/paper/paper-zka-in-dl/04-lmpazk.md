---
title: "04. Recursive Witness Compression: LMPAnoZK and LMPAZK"
type: scheme
tags: [lmpa, recursive-argument, zero-knowledge, logarithmic-communication, lesson-04]
aliases: [LMPAnoZK, LMPAZK, Linear Map Preimage ZK]
source: "Efficient zero-knowledge arguments in the discrete log setting, revisited — Hoffmann, Klooß, Rupp, CCS 2019 / ePrint 2019/944"
created: 2026-03-15
---

> **Prerequisites**: [[03-sigma-lmpabatch|03. Σstd & LMPAbatch]] (LMPAbatch, AND-compilation, commitment extending); [[02-testing-distributions|02. Testing Distributions]] (polynomial testing, dual testing distribution $\chi_m^\vee$, $\mu$-special soundness, short-circuit extraction).
> 🔴 **Prerequisite references**: Bootle et al. [Boo16] — §3 (inner product argument và recursive compression, nền tảng của LMPAnoZK).
> **Lesson type**: Scheme
> **Covers**: §3.4.1 (general idea — outer product trick); §3.4.2 (off-diagonal testing distribution); Protocol 3.9 (LMPAnoZK — recursive step + base case); Lemma 3.10 (recursive extraction — 3 parts + short-circuit); §3.5 (ZK conversion → LMPAZK via linear combination); Appendix G (protocol sketches).
>
> **Notation** (bổ sung):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $k$ | Reduction factor mỗi round (tunable, sweet spot $k=2$) | $k$ |
> | $d = \log_k n$ | Số rounds khi $n = k^d$ | $d$ |
> | $[A_1 \mid \cdots \mid A_k]$ | Block decomposition của $[A] \in G^{m \times n}$ | — |
> | $w_1, \ldots, w_k$ | Block decomposition của witness $w \in \mathbb{F}_p^n$ | — |
> | $[u_\ell]$ | Off-diagonal partial sum $\sum_{j-i=\ell} [A_i]w_j$ | $[u_\ell]$ |
> | $\chi_{2k-1}^e$ | Extended testing distribution, $z \leftarrow \chi_{2k-1}^e$ với $(x, y, z)$ | $\chi_{2k-1}^e$ |
> | $z_\ell$ | Component $\ell$ của challenge $z$ với $z_\ell = x^{k-1-\ell}$ | $z_\ell$ |
> | $[\hat{A}] = \sum_i x_i [A_i]$ | Compressed linear map | $[A_b]$ trong paper |
> | $w_b = \sum_i y_i w_i$ | Compressed witness | $w_b$ |
> | $[\hat{t}] = z^\top [u]$ | Compressed target | $[t_b]$ trong paper |

---

## Motivation: Từ $O(n)$ xuống $O(\log n)$

Sau Lesson 03, ta đã có $\mathsf{LMPA}_\text{batch}$: communication $O(n)$ field elements, independent of $m$. Vấn đề còn lại: làm sao **nén witness** từ $n$ phần tử xuống $O(\log n)$?

**Ý tưởng cốt lõi**: Thay vì chứng minh trực tiếp $[A]w = [t]$ với $w \in \mathbb{F}_p^n$, ta **reduce recursively** statement $([A], [t], w)$ về statement nhỏ hơn $k$ lần $([A_b], [t_b], w_b)$ mỗi round, trong đó $w_b \in \mathbb{F}_p^{n/k}$. Sau $d = \log_k n$ rounds, witness chỉ còn $O(1)$ phần tử — gửi trực tiếp.

**Chi phí mỗi round**: Gửi $2k - 2$ group elements (off-diagonal terms $[u_\ell]$). Tổng: $O(k \log_k n) = O(\log n)$ với $k$ cố định.

---

## §3.4.1 — Outer Product Trick

Chia $[A] = [A_1 \mid \cdots \mid A_k] \in (G^{m \times n/k})^{1 \times k}$ và $w = (w_1^\top, \ldots, w_k^\top)^\top \in (\mathbb{F}_p^{n/k})^k$.

Statement: $\sum_{i=1}^k [A_i] w_i = [t]$.

**Bước 1 — Outer product**: Xem tổng $\sum [A_i]w_i$ là trace của outer product matrix $M \in G^{k \times k}$ với $M_{ij} = [A_i]w_j$:

$$
\sum_{i=1}^k [A_i]w_i = \sum_{i=1}^k M_{ii} = \mathsf{tr}(M) = [t]
$$

Prover gửi toàn bộ $M$ → verifier verify trace = $[t]$. Nhưng $M$ có $k^2$ entries — quá nhiều!

**Bước 2 — Batch bằng outer product**: Verifier gửi $x \in \mathbb{F}_p^k$ và $y \in \mathbb{F}_p^k$. Compute:

$$
x^\top M y = \sum_{i,j} x_i y_j [A_i]w_j = \left(\sum_i x_i [A_i]\right) \left(\sum_j y_j w_j\right) = [\hat{A}] \cdot w_b
$$

cùng với constraint $\sum_i M_{ii} = [t]$. Bây giờ $[\hat{A}] = \sum_i x_i [A_i] \in G^{m \times n/k}$ và $w_b = \sum_j y_j w_j \in \mathbb{F}_p^{n/k}$.

**Điều kiện**: Prover cần gửi đủ thông tin về $M$ để verifier verify $\sum_i M_{ii} = [t]$ và $x^\top M y = [\hat{t}]$ — nhưng **không** cần toàn bộ $k^2$ entries.

---

## §3.4.2 — Off-Diagonal Testing Distribution

**Quan sát**: Với testing distribution thỏa $x_i y_j = z_{j-i}$ (polynomial monomial structure), verifier chỉ cần tổng theo mỗi **off-diagonal**:

$$
x^\top M y = \sum_{i,j} x_i y_j M_{ij} = \sum_{\ell = -(k-1)}^{k-1} z_\ell \underbrace{\sum_{j-i=\ell} M_{ij}}_{=: [u_\ell]}
$$

Prover chỉ cần gửi $[u_\ell]$ cho $\ell = \pm 1, \ldots, \pm(k-1)$ (tổng $2k-2$ terms; $[u_0] = [t]$ đã biết).

**Concrete testing distribution**: Chọn $x = (1, x, \ldots, x^{k-1})$ và $y = (x^{k-1}, \ldots, x, 1)$ với $x \leftarrow \mathbb{F}_p$. Khi đó $z_\ell = x^{k-1-\ell}$. Đây là polynomial testing distribution (Example 2.12), đảm bảo $\delta_\text{snd} \leq \frac{2k-1}{p}$.

> [!tip] 💡 Agent note
> Lý do dùng $y = (x^{k-1}, \ldots, x, 1)$ thay vì $y = (1, x^{-1}, \ldots, x^{-(k-1)})$ (tương đương về off-diagonal property): cách thứ hai đòi hỏi $x \neq 0$ và phép tính nghịch đảo trong $\mathbb{F}_p$, trong khi cách thứ nhất giữ mọi power dương. Điều này tiết kiệm computation trong practice.

---

## Protocol 3.9 — LMPAnoZK

> [!note] Protocol 3.9 — $\mathsf{LMPA}_\text{noZK}$
> **Type**: Argument of Knowledge (logarithmic rounds, **không** zero-knowledge)
> **Setting**: $[\mathbf{g}] \in G^{1 \times (n+1)}$; $n = k^d$; extended testing distribution $\chi_{2k-1}^e$ (với property $x_i y_j = z_{j-i}$). Common input: $([A], [t]) \in G^{m \times n} \times G^m$. Witness: $w \in \mathbb{F}_p^n$.
>
> **$\mathsf{RecursiveStep}$** (khi $n = k^d > k$):
>
> - Notation: $[A] = [A_1, \ldots, A_k]$ (block columns, $[A_i] \in G^{m \times n/k}$); $w = (w_1, \ldots, w_k)$ (block rows)
>
> 1. **P → V**: Tính $[u_\ell] = \sum_{j-i=\ell} [A_i]w_j$ cho $\ell = \pm 1, \ldots, \pm(k-1)$. Gửi $[u_{-(k-1)}], \ldots, [u_{-1}], [u_1], \ldots, [u_{k-1}]$ ($2k-2$ group elements)
>
> 2. **V → P**: Chọn $z \leftarrow \chi_{2k-1}^e$ với tương ứng $(x, y, z)$ (cụ thể: $x \leftarrow \mathbb{F}_p$, $x_i = x^{i-1}$, $y_i = x^{k-i}$, $z_\ell = x^{k-1-\ell}$). Gửi $(x, y, z)$
>
> 3. Cả hai bên tính statement rút gọn:
>    - $[\hat{A}] = \sum_i x_i [A_i] \in G^{m \times n/k}$
>    - $w_b = \sum_i y_i w_i \in \mathbb{F}_p^{n/k}$ (chỉ P tính)
>    - $[\hat{t}] = \sum_\ell z_\ell [u_\ell] \in G^m$ (với $[u_0] = [t]$)
>
> 4. **Đệ quy**: Đặt $n \leftarrow n/k$, $[A] \leftarrow [\hat{A}]$, $[t] \leftarrow [\hat{t}]$, $w \leftarrow w_b$. Lặp.
>
> **$\mathsf{BaseCase}$** (khi $n \leq k$):
>
> 1. **P → V**: Gửi $w \in \mathbb{F}_p^n$ trực tiếp
> 2. **V**: Accept nếu $[A]w \stackrel{?}{=} [t]$

**Communication analysis**: Mỗi round: $2k-2$ group elements + 1 field element (challenge $x$). Số rounds: $d = \log_k n$. Base case: $k$ field elements (gửi $w$ cuối). Tổng: $(2k-2)\log_k n + k = O(\log n)$ group elements.

**Tại sao "noZK"?** Prover gửi $[u_\ell] = \sum_{j-i=\ell}[A_i]w_j$ trực tiếp — các terms này leak thông tin về $w$. Cần ZK conversion (§3.5) để xử lý.

> [!abstract] Lemma 3.10 — Recursive Extraction
> Cho $\chi_{2k-1}^e$ như trên, $[u_\ell], [A_i], w_j$ như trong protocol. Gọi $[\hat{A}], [\hat{t}], w_b$ là statement/witness rút gọn. Khi đó:
>
> **(1) Kernel preservation**: Từ non-trivial kernel element của $[\hat{A}]$, tìm được non-trivial kernel element của $[A]$.
>
> **(2) Unconditional extraction**: Từ $2k-1$ challenges linearly independent (invertible matrix $Z$), extract $w$ với $[A]w = [t]$.
>
> **(3) Short-circuit**: Từ $k$ independent challenges, compute candidate $w'$. Nếu $\sum_{j-i=\ell}[A_i]w'_j \neq [u_\ell]$ cho một số $\ell$, thì từ $2k$ challenges ở general position, tìm được non-trivial kernel element của $[A]$.
>
> Ngoài ra: short-circuit extraction với $\mu' = (k, \ldots)$: quick-extract từ $k$ challenges; nếu thất bại, short-circuit sau $2k$ challenges cho kernel element.

**Proof sketch.**

*(1) Kernel preservation*: Giả sử $[\hat{A}]v = [0]$ với $v \neq 0$. Ta có $[\hat{A}] = \sum_i x_i [A_i]$, nên $\sum_i x_i [A_i] v = [0]$. Embed $v$ vào mỗi block: xét $u_j = y_j v$ cho mỗi $j$, thì $\sum_j [A_i] u_j = [A_i]\left(\sum_j y_j v\right) = [A_i] w_b$ — không ngay lập tức. Argument đầy đủ cần dùng tính chất của testing distribution để "invert" $x$ và tìm $\sum_i e_i \otimes [A_i] v = [0]$ trong dạng tường minh. $\square$

*(2) Unconditional extraction*: Từ $2k-1$ transcripts với challenges $z^{(1)}, \ldots, z^{(2k-1)}$ linearly independent và compressed witnesses $w_b^{(1)}, \ldots, w_b^{(2k-1)}$:

Mỗi $w_b^{(s)} = \sum_i y_i^{(s)} w_i$ tương ứng với $y^{(s)}$ biết. Ta có $2k-1$ equations tuyến tính trong $k$ unknowns $w_1, \ldots, w_k$:

$$
Y \begin{pmatrix} w_1 \\ \vdots \\ w_k \end{pmatrix} = \begin{pmatrix} w_b^{(1)} \\ \vdots \\ w_b^{(2k-1)} \end{pmatrix}
$$

với $Y_{s,i} = y_i^{(s)}$. Vì $Z$ (matrix of $z$ challenges) invertible và $y$ derived từ $z$ theo monomial, $Y$ có rank $k$ → giải được $(w_1, \ldots, w_k)$ → reconstruct $w$. $\square$

*(3) Short-circuit*: Từ $k$ challenges, quick-extract candidate $w' = (w'_1, \ldots, w'_k)$. Nếu $[u_\ell] \neq \sum_{j-i=\ell}[A_i]w'_j$ cho một $\ell$, nghĩa là prover đã gian lận về $[u_\ell]$. Thêm $k$ challenges nữa (tổng $2k$, ở general position), sẽ expose contradiction → tìm kernel element. $\blacksquare$

> [!info] 🟡 Nguồn gốc từ Bootle et al. [Boo16]
> Kỹ thuật recursive compression trong Protocol 3.9 được điều chỉnh từ Protocol của [Boo16] (reference [13] trong paper). [Boo16] giới thiệu cách chia witness thành $k$ blocks và reduce bằng verifier challenge — được gọi là "inner product argument" trong context của họ. Paper [HKR19] điều chỉnh: (1) dùng $y = (x^{k-1}, \ldots, 1)$ thay vì $y \leftarrow \mathbb{F}_p^k$ riêng biệt → chỉ cần 1 field element challenge thay vì $k$; (2) thêm off-diagonal structure → giảm communication; (3) thêm ZK conversion.
>
> *(theo [Boo16]: Bootle, Cerulli, Chaidos, Groth, Petit, Sheridan — Efficient ZK Arguments for Arithmetic Circuits in the Discrete Log Setting, EUROCRYPT 2016)*

---

## §3.5 — ZK Conversion: Từ LMPAnoZK đến LMPAZK

### Ý tưởng: Linear Combination

$\mathsf{LMPA}_\text{noZK}$ không ZK vì các $[u_\ell]$ leak thông tin. Dùng **linear combination of protocols** (§1.1.2, Lesson 01):

Chạy **hai instances** của $\mathsf{LMPA}_\text{noZK}$ song song:
- **Instance A**: Statement $([A], [t])$, witness $w$ — instance "thật"
- **Instance B**: Statement $([A], [0])$, witness $r$ — instance "masking"

Prover commit to $r$ trước. Verifier gửi $(x_1, x_2)$. Combined response:

$$
w_\text{combined} = x_1 w + x_2 r
$$

đối với statement $([A], x_1[t]) = ([A], x_1[t] + x_2[0])$.

> [!note] Protocol — $\mathsf{LMPA}_\text{ZK}$
> **Type**: Argument of Knowledge ($O(\log n)$ rounds, HVZK)
> **Setting**: $[\mathbf{g}] \in G^{1 \times (n+1)}$; $n = k^d$; testing distributions $\chi^{(\beta)}$ (cho ZK challenge) và $\chi_{2k-1}^e$ (cho recursive rounds). Common input: $([A], [t]) \in G^{m \times n} \times G^m$. Witness: $w \in \mathbb{F}_p^n$.
>
> **$\mathsf{MaskSetup}$** (P → V):
> - Chọn $r \leftarrow \mathbb{F}_p^n$ uniformly (masking witness)
> - Tính $[u_\ell^r] = \sum_{j-i=\ell} [A_i]r_j$ cho $\ell = \pm 1, \ldots, \pm(k-1)$ — off-diagonal của $r$
> - Gửi $[u_\ell^r]$ cho mọi $\ell \neq 0$ (phần mask)
>
> **$\mathsf{ZKChallenge}$** (V → P):
> - Chọn $(x_1, x_2) \leftarrow \chi^{(\beta)}$ (với $x_2 \neq 0$)
> - Gửi $(x_1, x_2)$
>
> **$\mathsf{CombinedProof}$** (P ↔ V):
> - Đặt $w' = x_1 w + x_2 r \in \mathbb{F}_p^n$ (combined witness, chỉ P biết)
> - Đặt $[u_\ell'] = x_1 [u_\ell^w] + x_2 [u_\ell^r]$ (combined off-diagonals, với $[u_0^w] = [t]$, $[u_0^r] = [0]$)
> - Prover và Verifier tính $[u_\ell^{w'}]$ — nhưng $[u_\ell^w]$ (off-diagonals của $w$) chưa được gửi!
>
> **$\mathsf{RecursiveStep}$** (thay thế round đầu của LMPAnoZK):
> - P gửi $[u_\ell^w]$ cho $\ell \neq 0$ (off-diagonals của statement thật)
> - V và P tính $[u_\ell'] = x_1 [u_\ell^w] + x_2 [u_\ell^r]$
> - Tiếp tục $\mathsf{LMPA}_\text{noZK}$ với statement $([A], [t'] = \sum_\ell z_\ell [u_\ell'])$ và witness $w'$

**Tại sao ZK?** Với $x_2 \neq 0$, witness $w' = x_1 w + x_2 r$ phân phối **uniform** trên $\mathbb{F}_p^n$ (vì $r$ uniform và $x_2 \neq 0$). Các $[u_\ell^w]$ là "uniquely determined" từ messages sau (cụ thể từ $[u_\ell^r]$ và $[u_\ell']$). Theo guideline "uniform-or-unique responses" (Lesson 01), simulator có thể tạo transcript hoàn toàn ngược.

**Communication overhead**: Round ZK setup thêm $2k-2$ group elements (gửi $[u_\ell^r]$) — **constant overhead** so với $\mathsf{LMPA}_\text{noZK}$. Computational overhead: $O(n)$ thêm do tính $w' = x_1 w + x_2 r$ và $[u_\ell^r]$ — logarithmic trong terms của exponentiations do tận dụng structure.

> [!tip] 💡 Agent note
> Chi tiết đầy đủ của ZK conversion — bao gồm xử lý các partial commitments $[u_\ell]$ qua dual testing distribution và randomness propagation qua các recursive rounds — được trình bày trong các protocols 3.11–3.15 của full version paper. Lesson này tóm tắt ý tưởng chính; implementation đầy đủ cần đọc Appendix G của paper.

---

## Efficiency: Bảng So sánh

Từ Table 2 trong paper (với $k = 2$, sweet spot):

| Protocol | Communication $G$ | Communication $\mathbb{F}_p$ | Prover computation | Relation |
|----------|-------------------|------------------------------|--------------------|---------|
| $\mathsf{LMPA}_\text{ZK}$ ($k=2$) | $\approx 2 \cdot 2 \cdot \log_2 n$ | $2 \cdot 2$ | $\approx (2+2) \cdot mn$ | LMP |
| $\mathsf{QESA}_\text{ZK}$ ($k=2$) | $2\lceil\log(n+2)\rceil + 3$ | $2$ | $\approx 8n$ | QE |
| Bulletproofs [Bün18] | $2\lceil\log n\rceil + 8$ | $5$ | $\approx 12n$ | R1CS |

LMPAZK có communication tốt hơn Bulletproofs trong LMP setting; QESAZK (Lesson 06) handle QE (tổng quát hơn R1CS) với communication và prover computation **cạnh tranh** với Bulletproofs.

---

## Extraction Analysis: Short-Circuit cho LMPAZK

Áp dụng Corollary 2.20 (Lesson 02) cho LMPAZK với $k = 2$, $d = \log_2 n$ rounds:
- $\mu_i = 2k-1 = 3$ (cần 3 challenges mỗi round để extract)
- $\mu'_i = 1$ (quick-extract từ 1 challenge)

$$
s_0 = \sum_{i=0}^{d-1} (3-1) \cdot 1^{d-1-i} = 2d = 2\log_2 n = O(\log n)
$$

**Kết luận**: Extractor cần tối đa $O(\log n)$ transcripts thay vì $3^d = n^{\log_2 3} \approx n^{1.58}$ theo analysis ngây thơ. Đây là improvement quan trọng cho **concrete security**.

> [!warning] Caution 2.18 — General position vs linear independence
> Lemma 3.10 (3) dùng "general position" (mạnh hơn linear independence). Paper thừa nhận đây là "bad definition" có thể không generalize tốt. Tuy nhiên, vì điều này chỉ ảnh hưởng đến extraction của $[u_\ell]$ — không ảnh hưởng đến overall proof-of-knowledge — paper giữ nguyên. Người implement cần chú ý điểm này.

---

## Summary

- **LMPAnoZK** (Protocol 3.9): Recursive compression bằng outer product trick và off-diagonal testing distribution. Communication $O(k \log_k n)$ group elements. Không ZK vì gửi $[u_\ell]$ trực tiếp.
- **Lemma 3.10**: Extraction hoạt động theo 3 modes — (1) kernel preservation, (2) unconditional extraction từ $2k-1$ challenges, (3) short-circuit từ $2k$ challenges. Short-circuit bound: $O(\log n)$ transcripts.
- **LMPAZK**: Linear combination của hai LMPAnoZK instances ($w$ thật + $r$ masking). Constant communication overhead; logarithmic computational overhead; perfect HVZK.
- **Inheritance từ [Boo16]**: Ý tưởng recursive compression; [HKR19] thêm off-diagonal structure + ZK conversion + tighter extraction analysis.

---

## References

- [HKR19] Hoffmann, Klooß, Rupp — *Efficient ZK Arguments in the Discrete Log Setting, Revisited*, CCS 2019
- [Boo16] Bootle et al. — *Efficient ZK Arguments for Arithmetic Circuits in the Discrete Log Setting*, EUROCRYPT 2016 (🟡 — Protocol LMPAnoZK derived from their §3; integrated above)
- [Bün18] Bünz et al. — *Bulletproofs: Short Proofs for Confidential Transactions*, S&P 2018 (🟡 — Lesson 05, 06, 07)
