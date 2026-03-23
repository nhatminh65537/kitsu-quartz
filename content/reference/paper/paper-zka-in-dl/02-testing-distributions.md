---
title: "02. Testing Distributions & Special Soundness"
type: math-component
tags: [testing-distribution, special-soundness, extraction, short-circuit, zero-knowledge, lesson-02]
aliases: [Testing Distribution, Special Soundness, Short-Circuit Extraction]
source: "Efficient zero-knowledge arguments in the discrete log setting, revisited — Hoffmann, Klooß, Rupp, CCS 2019 / ePrint 2019/944"
created: 2026-03-15
---

> **Prerequisites**: [[01-zk-dlog-foundation|01. ZK Arguments — Foundation]] (hard kernel assumption, HVZK, implicit notation).  
> 🔴 **Prerequisite references**: Bootle et al. [Boo16] — §3 (special soundness và $\mu$-tree framework tổng quát).  
> **Lesson type**: Math Component  
> **Covers**: §2.3 (testing distributions — Definitions 2.9–2.15, Lemma 2.11, Appendix E); §2.3.1 (dual testing distributions — Definition 2.16); §2.4 (special soundness — Definition 2.17, Caution 2.18); §2.4.1 (short-circuit extraction — Definition 2.19, Corollary 2.20).
>
> **Notation** (bổ sung từ Lesson 01):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $\chi_m$ | Testing distribution trên $\mathbb{F}_p^m$ | $\chi_m$ |
> | $\delta_\text{snd}(\chi_m)$ | Soundness error của $\chi_m$ | $\delta_\mathsf{snd}(\chi_m)$ |
> | $\psi$ | Subdistribution của $\chi_m$ | $\psi$ |
> | $\varepsilon$ | Trọng lượng (weight) của subdistribution | $\varepsilon$ |
> | $p_\infty(\chi)$ | $\sup_{x \in \mathbb{F}_p} \chi(x)$ — xác suất lớn nhất của một điểm | $p_\infty(\chi)$ |
> | $\mu = (\mu_0, \ldots, \mu_{n-1})$ | Tuple kích thước tree trong $\mu$-special soundness | $\mu$ |
> | $\chi_m^\vee$ | Dual testing distribution | $\chi_m^\vee$ |

---

## Motivation

Hai câu hỏi trung tâm trong phân tích security của một interactive ZK argument:

1. **Soundness / Extractability**: Nếu prover thuyết phục được verifier, liệu có extractor nào có thể "rewind" prover và extract witness không? Cần bao nhiêu transcripts?
2. **Tightness**: Extraction error (xác suất extractor thất bại) bao nhiêu? Điều này ảnh hưởng trực tiếp đến security level thực tế.

Paper [HKR19] giới thiệu **testing distributions** như một framework thống nhất để trả lời cả hai câu hỏi — đồng thời phân tích định lượng chặt hơn nhiều so với [Boo16] và [Bün18] thông qua **short-circuit extraction**.

---

## §2.3 — Testing Distributions

### Subdistribution — Mô hình hóa Adversary

Khi extractor rewind prover, không phải mọi challenge đều được prover trả lời thành công. Những challenges "được trả lời" là một **subdistribution** của distribution challenge ban đầu.

> [!note] Definition 2.9 — Subdistribution
> Cho $\chi$ là distribution trên $\mathbb{F}_p^m$. Distribution $\psi$ trên $\mathbb{F}_p^m$ là một **subdistribution của $\chi$ weight $\varepsilon$** nếu:
>
> - Tồn tại **subdensity** $\rho_\psi : \mathbb{F}_p^m \to [0,1]$ (chú ý: $\leq 1$ là điều kiện quan trọng)
> - $\varepsilon = \sum_{x \in \mathbb{F}_p^m} \rho_\psi(x) \cdot \chi(x)$
> - $\psi(x) = \frac{1}{\varepsilon} \rho_\psi(x) \cdot \chi(x)$ (tức $\psi$ là "restrict và renormalize" của $\chi$)

**Ý nghĩa**: Adversary thành công với xác suất $\varepsilon$ khi được draw challenge $x \leftarrow \chi$. Những challenge được trả lời thành công tạo thành subdistribution weight $\varepsilon$. Extractor chỉ có thể làm việc với subdistribution này.

### Testing Distribution

> [!note] Definition 2.10 — Testing Distribution
> Distribution $\chi_m$ trên $\mathbb{F}_p^m$ với soundness error $\delta_\text{snd}(\kappa)$ là một **testing distribution** nếu: với mọi subdistribution $\psi$ của $\chi_m$ weight $\varepsilon \geq \delta_\text{snd}$, ta có:
>
> $$
> \Pr\!\left[x_i \leftarrow \psi,\; X = (x_1, \ldots, x_m) \;:\; \det(X) = 0\right] \leq \frac{1}{\varepsilon} \delta_\text{snd}
> $$

**Tại sao $\det(X) \neq 0$ quan trọng?** Điều kiện $\det(X) \neq 0$ tương đương: $m$ vector challenge $x_1, \ldots, x_m \in \mathbb{F}_p^m$ **linearly independent**, tức $\bigcap_{i=1}^m \ker(x_i^\top) = \{0\}$. Đây là điều kiện để extractor có thể recover một vector $z \in \mathbb{F}_p^m$ từ các test values $x_i^\top z$ — đây chính là "testing" trong tên gọi.

**Trực giác**: Testing distribution $\chi_m$ đảm bảo rằng ngay cả adversary tham lam nhất (chỉ trả lời $\varepsilon$ fraction các challenges) cũng không thể tránh cho extractor nhận được $m$ challenges linearly independent.

### Lemma Schwartz–Zippel (Bản mở rộng)

> [!abstract] Lemma 2.11 — Schwartz–Zippel cho Subdistribution
> Cho $f \in \mathbb{F}_p[X_1, \ldots, X_n]$ là đa thức không bằng 0, degree $d$. Cho $\chi$ là distribution trên $\mathbb{F}_p$ với $p_\infty(\chi) = \sup_{x \in \mathbb{F}_p} \chi(x)$.
>
> $$
> \Pr_{x \leftarrow \chi^n}[f(x) = 0] \leq d \cdot p_\infty(\chi)
> $$
>
> Với subdistribution $\psi$ weight $\varepsilon$ của $\chi$: $p_\infty(\psi) \leq \frac{1}{\varepsilon} p_\infty(\chi)$, do đó:
>
> $$
> \Pr_{x \leftarrow \psi^n}[f(x) = 0] \leq \frac{d \cdot p_\infty(\chi)}{\varepsilon}
> $$

**Proof sketch**: Induction trên $n$. Với $n=1$: $f$ có tối đa $d$ nghiệm, nên $\Pr[f(x)=0] \leq d \cdot p_\infty(\chi)$. Với $n > 1$: viết $f = \sum_{i=0}^d X_1^i g_i(X_2, \ldots, X_n)$, apply induction giả thiết cho $g_j$ (degree nhỏ nhất khác 0) và cho $f(x_1, x_2, \ldots, x_n)$ sau khi fix $x_2, \ldots, x_n$. $\blacksquare$

**Ứng dụng**: Lemma này là cơ sở để bound soundness error của mọi testing distribution sau đây.

### Các Testing Distributions Cụ Thể

**Example 2.12 — Polynomial Testing Distribution**:

$$
x = (x^0, x^1, \ldots, x^{m-1}) \in \mathbb{F}_p^m \quad \text{với } x \leftarrow \mathbb{F}_p
$$

Ma trận $X = (x_1, \ldots, x_m)$ là **ma trận Vandermonde** — inversible khi $x_1, \ldots, x_m$ phân biệt. Soundness error: $\delta_\text{snd}(\chi) \leq \frac{m}{p}$.

> [!tip] 💡 Agent note
> Polynomial testing là testing distribution được dùng cho **Protocol LMPAnoZK** (Lesson 04) — verifier chọn một $x \in \mathbb{F}_p$ và gửi $(x, y) = (x^0, \ldots, x^{k-1}, x^{k-1}, \ldots, 1)$ như challenge. Tính chất $x_i y_j = z_{j-i}$ (off-diagonal structure) xuất phát trực tiếp từ polynomial testing distribution.

**Example 2.13 — $\chi^{(\beta)}$ Distribution**:

Trường hợp đặc biệt $m = 2$: $x = (\alpha, 1)$ với $\alpha \leftarrow S \subseteq \mathbb{F}_p$. Ký hiệu $\chi^{(\beta)}$ (và $\chi^{(\beta \neq 0)}$ nếu $S \subseteq \mathbb{F}_p^\times$). Đây là challenge distribution của **Protocol Σstd** (Lesson 03): $(x_1, x_2) = (\alpha, 1)$ tương đương $x_1 = \beta, x_2 = 1$.

**Example 2.14 — Random Testing**:

Uniform distribution trên $\mathbb{F}_p^m$: $\delta_\text{snd} \leq \frac{m}{p}$. Có thể dùng "small exponents" $S = \{0, \ldots, \ell-1\}$ và vẫn có $\delta_\text{snd} \leq \frac{m}{\ell}$ — cho phép giảm kích thước challenge trong practice.

**Example 2.15 — Pseudo-random Testing**:

Verifier compress toàn bộ challenge vector thành một seed $s \leftarrow \{0,1\}^\kappa$ và derive $x \leftarrow \mathsf{PRG}(s)$. Soundness error bằng xấp xỉ với uniform distribution (heuristically, hoặc chứng minh được nếu PRG secure against non-uniform adversaries).

> [!warning] Cảnh báo từ paper
> Có những distribution $\chi$ pseudorandom (dưới giả thiết hợp lý) nhưng $\delta_\text{snd}(\chi) > \frac{1}{2}$ — tức soundness error lớn! Soundness của testing distribution là tính chất **combinatorial**, không liên quan đến pseudorandomness. Đây là lý do paper đề xuất polynomial testing (Example 2.12) thay vì pseudorandom testing cho các bounds chặt.

---

## §2.3.1 — Dual Testing Distributions

### Ý tưởng "Dual"

Testing distribution $\chi_m$ cho phép **verify** rằng một phần tử $z \in \mathbb{F}_p^m$ bằng 0, bằng cách "test" $x^\top z = 0$ với $x \leftarrow \chi_m$.

**Dual testing distribution** $\chi_m^\vee$ cho phép **enforce** rằng $z = 0$ — không cần test, chỉ cần commit theo cách đặc biệt.

### Cơ chế

> [!note] Definition 2.16 — Dual Testing Distribution
> Distribution $\chi_m^\vee$ trên $\mathbb{F}_p^{m \times (m-1)}$ là **dual testing distribution** với soundness error $\delta_\text{snd}(\chi_m^\vee)$ được định nghĩa bởi:
>
> $$
> \Pr\!\left[M_i \leftarrow \chi_m^\vee \;:\; \bigcap_{i=1}^m \mathsf{im}(M_i) \neq \{0\}\right] \leq \frac{1}{\varepsilon} \delta_\text{snd}(\chi_m^\vee)
> $$

**Xây dựng từ testing distribution**: Cho $\chi_m$ là testing distribution với $x \leftarrow \chi_m$ luôn có $x_1 = 1$. Định nghĩa $\chi_m^\vee$: để sample $M \leftarrow \chi_m^\vee$, sample $x^\top = (1, x')^\top \leftarrow \chi_m$ và đặt:

$$
M_x = \begin{pmatrix} x' \\ -\mathbf{id}_{m-1} \end{pmatrix}
$$

Theo construction, $\ker(x^\top) = \mathsf{im}(M_x)$ và $\delta_\text{snd}(\chi_m^\vee) = \delta_\text{snd}(\chi_m)$.

**Ứng dụng vào Pedersen commitment**: Cho commitment $[c] = [G | H]\binom{w}{z}$. Muốn enforce $z = 0$ mà không cần proof, ta construct $[H] := [Q] M$ với $M \leftarrow \chi_m^\vee$. Khi đó:

- Adversary phải có $z = My$ cho một số $y$ để forge một opening của $[c']$ thành $[c]$.
- Nhưng $z \in \mathsf{im}(M)$ với xác suất nhỏ (trừ khi $z = 0$).
- Kết quả: có thể derive một "fresh" commitment key $[G|H]$ từ $[G|Q]$ mà không cần send thêm data.

> [!tip] 💡 Agent note
> Dual testing distribution là kỹ thuật **mới** trong [HKR19] — không có trong [Boo16] hay [Bün18]. Nó quan trọng trong LMPAZK (Lesson 04): khi prover gửi các "partial commitments" $[u_\ell]$ trong Protocol LMPAnoZK, verifier cần đảm bảo rằng randomness component trong commitment thực sự bằng 0 mà không cần thêm round. Dual testing giải quyết điều này một cách gọn nhẹ.
>
> Đối chiếu: "Normal testing verifies $z = 0$; dual testing enforces $z = 0$."

---

## §2.4 — Special Soundness và Extraction

### µ-Special Soundness

> [!note] Definition 2.17 — $\mu$-Special Soundness
> Cho $(P, V)$ là public coin argument system cho $R$, verifier gửi $n$ challenges và $\mu = (\mu_0, \ldots, \mu_{n-1}) \in \mathbb{N}^n$.
>
> Protocol là **$\mu$-special sound** nếu tồn tại extractor $\mathsf{Ext}$ sao cho: với mọi **good $\mu$-tree** $\mathsf{tree}_\mu$ của transcripts, $\mathsf{Ext}(\mathsf{st}, \mathsf{tree}_\mu)$ trả về witness $w$ với $(st, w) \in R$.
>
> **$\mu$-tree**: Cây directed trong đó:
> - Node ở depth $i$ có đúng $\mu_i$ children
> - Edges được label bởi challenge thứ $i$
> - Nodes được label bởi answer của prover
> - Mọi path theo cây đều là accepting transcript
>
> **Good $\mu$-tree**: Với mọi node, tất cả challenges con của nó ở **general position** (tức là mọi $n$ trong số đó linearly independent).

**Ví dụ**: Protocol Σstd là $(2)$-special sound: với $\mu = (2)$ và 1 round challenge, cần 2 accepting transcripts có cùng commitment $[a]$ nhưng khác challenge $\beta$. Khi đó $w = \frac{z - z'}{\beta - \beta'}$.

**LMPAZK**: $\mu = (2k-1, 2k-1, \ldots)$ với $\log_k n$ rounds — cần $O(\log n \cdot k^{\log_k n}) = O(n \log n)$ leaves trong worst case (sẽ phân tích ở Lesson 04).

> [!info] 🟡 TreeFinder (từ Attema-Fehr-Klooß [Att20])
> Definition 2.17 yêu cầu một "TreeFind algorithm" để produce good $\mu$-tree với oracle access đến prover. Paper [Boo16] (reference [13] trong [HKR19]) cung cấp một TreeFinder; [Att20] (reference [48]) generalize thêm. Khi có extractor $\mathsf{Ext}$ theo Def 2.17 và TreeFind, ta thu được **witness-extended emulation** — security notion mạnh hơn soundness đơn thuần.
>
> *(theo [Att20]: Attema, Fehr, Klooß — Fiat-Shamir Transformation of Multi-Round Interactive Proofs, TCC 2022)*

### Short-Circuit Extraction

Đây là **đóng góp mới** quan trọng của [HKR19]: phân tích chặt hơn số transcripts cần thiết cho extraction.

**Vấn đề với analysis chuẩn**: Extractor cần $\prod_{i=0}^{n-1} \mu_i$ leaves. Với LMPAZK ($\mu_i = 2k-1$ cho $\log_k n$ rounds), đây là $O(n^2)$ hoặc tệ hơn. Thực ra extractor **thường** chỉ cần ít hơn rất nhiều.

**Insight**: Trong nhiều protocol, extractor gặp hai trường hợp:
- **Case 1** (quick extraction): Tìm được witness từ một subtree nhỏ — $O(1)$ hoặc $O(\log n)$ leaves.
- **Case 2** (short-circuit): Không tìm được witness từ subtree nhỏ → phải expore thêm → nhưng điều này có nghĩa là adversary đang "cheat" theo một cách cụ thể → extractor có thể exploit điều này để solve một **hard problem** (thay vì extract witness).

> [!note] Definition 2.19 — Short-Circuit Extraction
> Xét situation trong Def 2.17, với $R = R_1 \vee R_2$ (OR relation). Cho $\mu' \leq \mu$ (componentwise). Extractor $\mathsf{Ext}$ có **short-circuit extraction** với $\mu' \leq \mu$ nếu với mọi good $\mu$-tree $\mathsf{tree}_\mu$:
>
> - **Quick extraction**: $\mathsf{Ext}$ kết thúc sau khi explore một $\mu'$-subtree và trả về witness cho $R_1$.
> - **Short-circuit tại layer $\ell$**: Nếu $\mathsf{Ext}$ phải explore hơn $\mu'_\ell$ children của một node, thì sau khi explore đủ $\mu_\ell$ children, $\mathsf{Ext}$ trả về witness cho $R_2$ (và có thể cả $R_1$).

**Ý nghĩa cryptographic**: $R_1$ = "tìm được witness $w$ với $[g]w = [c]$"; $R_2$ = "tìm được kernel element của $[g]$" (= break dlog/kernel assumption). Extractor hoặc extract witness, hoặc break một hardness assumption — đây là dạng reduction chuẩn trong proofs of knowledge.

> [!abstract] Corollary 2.20 — Runtime Bounds
> Nếu $\mathsf{Ext}$ theo Def 2.19 traverse $\mathsf{tree}_\mu$ theo depth-first order, thì:
>
> - **Quick extraction**: Tối đa $\prod_{i=0}^{n-1} \mu'_i$ leaves được explore.
> - **Short-circuit extraction**: Tối đa $s_0 + 1$ leaves, trong đó:
>
> $$
> s_0 = \sum_{i=0}^{n-1} (\mu_i - 1) \prod_{j=i+1}^{n-1} \mu'_j \;\;\leq\;\; \left(\sum_{i=0}^{n-1} \mu_i\right) \cdot \left(\prod_{i=0}^{n-1} \mu'_i\right)
> $$

**Proof sketch**: Induction: gọi $t_i$ là số lá tối đa để đảm bảo một $\mu|_i$-subtree extractable, với $\mu|_i = (\mu_i, \ldots, \mu_{n-1})$. Base: $t_{n-1} = \mu_{n-1}$. Bước đệ quy: trong trường hợp xấu nhất, layer $i$ short-circuits — phải explore tất cả $\mu_i$ children; $\mu'_i - 1$ children đầu quick-extract (mỗi cái $\leq \prod_{j > i} \mu'_j$ lá); child cuối short-circuits, cần $t_{i+1}$ lá. Ghép lại cho công thức $t_i = (\mu_i - 1)\prod_{j>i}\mu'_j + t_{i+1}$. $\blacksquare$

**Ứng dụng cho LMPAZK**: Với $k = 2$, mỗi round có $\mu_i = 3$ (2k-1 = 3) và $\mu'_i = 1$ (quick-extract từ 1 child), thì:

$$
s_0 = \sum_{i=0}^{d-1} (3-1) \cdot 1^{d-1-i} = 2d = O(\log n)
$$

Tức: extractor cần $O(\log n)$ leaves (thay vì $3^d = O(n^{\log_2 3}) \approx O(n^{1.58})$ theo analysis ngây thơ). Đây là improvement rất lớn, ảnh hưởng trực tiếp đến concrete security estimate.

> [!warning] Security implication
> Paper so sánh: extractor trong [Bün18] (Bulletproofs) theo analysis không dùng short-circuit cần $O(n^3 N)$ transcripts cho QESA với $n$ biến, $N$ equations. Với $n, N \approx 2^{20}$, security loss là $\approx 2^{80}$ thay vì $\approx 2^{45}$! Short-circuit extraction giảm số transcripts xuống $O(n \log n \cdot N)$, cải thiện security loss về $\approx 2^{45}$.

---

## Tổng hợp: Quan hệ giữa các khái niệm

```
Testing distribution χ_m
│
├── Normal testing: kiểm tra z = 0 bằng x⊤z = 0 (x ← χ_m)
│   └── → Dùng trong extraction: từ m challenges linearly independent → recover z
│
└── Dual testing χ_m^∨: enforce z = 0 không cần proof
    └── → Dùng để derive fresh commitment keys trong LMPAZK
    
Special soundness (µ-special)
│
├── Standard analysis: O(∏µᵢ) leaves needed
│
└── Short-circuit extraction (Definition 2.19):
    ├── Quick extraction: O(∏µ'ᵢ) leaves (µ' << µ)
    └── Short-circuit: O(Σµᵢ · ∏µ'ᵢ) leaves
        └── → O(n log n) thay vì O(n^1.58) cho LMPAZK
```

---

## Summary

- **Testing distribution** $\chi_m$: distribution trên $\mathbb{F}_p^m$ đảm bảo $m$ samples độc lập linear independent với high probability → cho phép recover bất kỳ phần tử nào qua "testing".
- **Schwartz–Zippel mở rộng**: bound soundness error $\delta_\text{snd} \leq dp_\infty(\chi)$ ngay cả cho subdistribution (mô hình adversary).
- **Dual testing distribution**: "enforce $z = 0$" thay vì "verify $z = 0$" — tiết kiệm communication trong protocol design.
- **$\mu$-special soundness**: extractor có thể extract witness từ good $\mu$-tree transcripts.
- **Short-circuit extraction**: phân biệt "quick extraction" (ít transcripts) và "short-circuit" (nhiều hơn → break hardness assumption) → bounds chặt hơn nhiều: $O(\log n)$ thay vì $O(n^{1.58})$ cho LMPAZK.
- **Concrete impact**: security loss của QESAZK là $\approx 2^{45}$ (với short-circuit) thay vì $\approx 2^{80}$ (không có).

---

## References

- [HKR19] Hoffmann, Klooß, Rupp — *Efficient ZK Arguments in the Discrete Log Setting, Revisited*, CCS 2019 / ePrint 2019/944
- [Att20] Attema, Fehr, Klooß — *Fiat-Shamir Transformation of Multi-Round Interactive Proofs*, TCC 2022 (🟡 — TreeFinder generalization, integrated above)
- [Boo16] Bootle et al. — *Efficient ZK Arguments for Arithmetic Circuits in the Discrete Log Setting*, EUROCRYPT 2016 (🔴 Prerequisite — §3 special soundness background)
