---
title: "06. Quadratic Equation Satisfiability Argument (QESAZK)"
type: scheme
tags: [qesa, quadratic-equations, commit-and-prove, r1cs, zero-knowledge, lesson-06]
aliases: [QESAZK, Quadratic Equation Argument, QE Satisfiability]
source: "Efficient zero-knowledge arguments in the discrete log setting, revisited — Hoffmann, Klooß, Rupp, CCS 2019 / ePrint 2019/944"
created: 2026-03-15
---

> **Prerequisites**: [[05-ipa-almzk|05. IPAalmZK]] (almost-ZK inner product argument); [[04-lmpazk|04. LMPAZK]] (recursive compression, batch verification); [[01-zk-dlog-foundation|01. Foundation]] (composition of argument systems).
> 🔴 **Prerequisite references**: Groth-Kohlweiss [GK15] — Ideal Linear Commitment model (ILC) — nền tảng lý thuyết cho QESAZK; Groth [Gro16] — R1CS/arithmetic circuits background.
> **Lesson type**: Scheme
> **Covers**: §4.2 (QESAZK — commit-and-prove cho $\langle w, \Gamma w \rangle = 0$); §4.3 (batch proof cho $N$ quadratic equations; adaptive commit-and-prove); §1.2.3 (QE vs R1CS — polynomial evaluation, elliptic curve embedding).
>
> **Notation** (bổ sung):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $\Gamma_i \in \mathbb{F}_p^{n \times n}$ | Ma trận của quadratic equation thứ $i$ | $\Gamma_i$ |
> | $\langle w, \Gamma_i w \rangle$ | Quadratic form $w^\top \Gamma_i w \in \mathbb{F}_p$ | $\langle w, \Gamma_i w \rangle$ |
> | $N$ | Số quadratic equations | $N$ |
> | $r_i \leftarrow \mathbb{F}_p$ | Batch randomness | $r_i$ |
> | $\Gamma = \sum_i r_i \Gamma_i$ | Batched matrix | $\Gamma$ |
> | $[c_w]$ | Commitment đến witness $w$ | $[c_w]$ |

---

## Motivation

**Bài toán đặt ra**: Có một witness $w \in \mathbb{F}_p^n$ đã committed. Muốn chứng minh $w$ thỏa $N$ quadratic equations:

$$
\forall i = 1, \ldots, N \;:\; \langle w, \Gamma_i w \rangle = 0
$$

trong đó $\Gamma_i \in \mathbb{F}_p^{n \times n}$ là các ma trận công khai (hoặc được gửi sau commitment).

**Tại sao quadratic equations?**

Trong discrete log (dlog) setting, nhóm $G$ chỉ hỗ trợ **linear operations**: tổng và scalar múltiplication. Tuy nhiên inner product $\langle w, \Gamma w \rangle$ là **quadratic** — nó là "bậc 2 cao nhất" mà ta có thể xử lý trực tiếp khi cả hai "factors" $w$ và $\Gamma w$ đều là linear functions của $w$.

Đây là lý do paper claim: **QE là ngôn ngữ tự nhiên** của dlog/ILC setting, trong khi R1CS chỉ là trường hợp đặc biệt.

---

## §4.2 — Từ IPA đến QESAZK

### Reduction về Inner Product

Muốn prove $\langle w, \Gamma w \rangle = 0$:

1. Prover commit $[c_w] = [\mathbf{g}]w$ trước.
2. Verifier gửi $\Gamma$ (hoặc derive từ $\Gamma_i$).
3. Cả hai bên tính $\Gamma w$ (P trực tiếp, V qua commitment operations).
4. Prove $\langle w, \Gamma w \rangle = 0$ dùng **IPAalmZK** với:
   - $x = w$, $y = \Gamma w$, $t = 0$
   - $[c_x] = [c_w]$ (đã có)
   - $[c_y] = [\mathbf{h}]\Gamma w$ (P tính, cần gửi)

**Điểm tinh tế**: Commitment $[c_y] = [\mathbf{h}]\Gamma w$ phụ thuộc vào $\Gamma$. Nếu $\Gamma$ được gửi **sau** $[c_w]$, prover commit xong mới biết $\Gamma$ — đây là tính chất **adaptive** của QESAZK.

### Adaptive Commit-and-Prove

> [!note] Scheme 6.1 — $\mathsf{QESA}_\text{ZK}$ (Single equation)
> **Type**: Commit-and-Prove Argument of Knowledge (adaptive)
> **Setting**: Commitment keys $[\mathbf{g}] \in G^n$, $[\mathbf{h}] \in G^n$. Common input: $\Gamma \in \mathbb{F}_p^{n \times n}$ (có thể chọn sau commitment). Witness: $w \in \mathbb{F}_p^n$.
>
> **$\mathsf{Commit}$** (P → V, trước khi V gửi $\Gamma$):
> - Chọn $r_w \leftarrow \mathbb{F}_p$
> - Tính $[c_w] = r_w[g_0] + [\mathbf{g}]w$
> - Gửi $[c_w]$
>
> **$\mathsf{StatementReveal}$** (V → P, sau commitment):
> - Chọn và gửi $\Gamma \in \mathbb{F}_p^{n \times n}$
> - (Hoặc $\Gamma$ là public — argument vẫn hoạt động)
>
> **$\mathsf{ComputeIPAStatement}$** (P → V):
> - P tính $v = \Gamma w \in \mathbb{F}_p^n$
> - P tính $[c_v] = [\mathbf{h}]v$
> - Gửi $[c_v]$
>
> **$\mathsf{BatchChallenge}$** (V → P):
> - Chọn $\rho \leftarrow \mathbb{F}_p^\times$
> - Gửi $\rho$ (dùng để link $[c_w]$ và $[c_v]$)
> - Cả hai bên tính combined commitment key $[\mathbf{g}'] = [\mathbf{g}] + \rho [\mathbf{h}]$
>
> **$\mathsf{IPAProof}$** (P ↔ V):
> - Thực hiện $\mathsf{IPA}_\text{almZK}$ cho:
>   - Statement: $([c_w], [c_v], 0)$
>   - Witness: $(w, v = \Gamma w)$ với $\langle w, v \rangle = \langle w, \Gamma w \rangle = 0$

**Correctness**: $\langle w, \Gamma w \rangle = 0$ theo giả thiết, nên IPA chứng minh đúng. ✓

**ZK**: Kế thừa từ IPAalmZK — $\varepsilon$-HVZK với constant overhead.

**Adaptive soundness**: Vì $[c_w]$ được gửi trước $\Gamma$, adversary phải commit đến $w$ trước khi biết constraint — không thể gian lận.

---

## §4.3 — Batch Proof cho $N$ Quadratic Equations

### Batching Nhiều Equations

Thay vì prove $N$ equations riêng lẻ (tốn $N$ lần IPA), batch tất cả lại:

> [!note] Scheme 6.2 — $\mathsf{QESA}_\text{ZK}$ (Batch — $N$ equations)
> **Type**: Batch Commit-and-Prove Argument of Knowledge
> **Setting**: Commitment keys $[\mathbf{g}] \in G^{n+1}$, $[\mathbf{h}] \in G^n$. Common input: $\Gamma_1, \ldots, \Gamma_N \in \mathbb{F}_p^{n \times n}$. Witness: $w \in \mathbb{F}_p^n$.
>
> **$\mathsf{Commit}$** (P → V):
> - Tính $[c_w] = \mathsf{Com}(w; r_w)$
> - Gửi $[c_w]$
>
> **$\mathsf{BatchChallenge}$** (V → P):
> - Chọn $r_1, \ldots, r_N \leftarrow \mathbb{F}_p$
> - Gửi $(r_1, \ldots, r_N)$
> - Cả hai bên tính batched matrix:
>
> $$\Gamma = \sum_{i=1}^N r_i \Gamma_i \in \mathbb{F}_p^{n \times n}$$
>
> **$\mathsf{IPASetup}$** (P → V):
> - P tính $v = \Gamma w = \sum_i r_i \Gamma_i w$
> - P tính $[c_v] = [\mathbf{h}]v$
> - Gửi $[c_v]$
>
> **$\mathsf{LinkChallenge}$** (V → P):
> - Chọn $\rho \leftarrow \mathbb{F}_p^\times$, gửi $\rho$
>
> **$\mathsf{IPAProof}$** (P ↔ V):
> - Thực hiện $\mathsf{IPA}_\text{almZK}$ cho $([c_w], [c_v], 0)$ với witness $(w, v)$

**Soundness**: Nếu $\langle w, \Gamma_i w \rangle \neq 0$ cho một $i$, thì $\langle w, \Gamma w \rangle = \sum_i r_i \langle w, \Gamma_i w \rangle \neq 0$ với xác suất $\geq 1 - N/p$ (Schwartz–Zippel). Batch proof unsound chỉ khi random linear combination "accidentally" cancels non-zero equations — xác suất này negligible.

> [!abstract] Security của $\mathsf{QESA}_\text{ZK}$
> $\mathsf{QESA}_\text{ZK}$ là $\varepsilon$-statistical HVZK-AoK cho $R_\text{QE}$ với:
>
> - **Adaptive completeness**: Với mọi $w$ thỏa $\langle w, \Gamma_i w \rangle = 0$ $\forall i$, honest prover accept.
> - **$\varepsilon$-HVZK**: Kế thừa từ IPAalmZK — $\varepsilon = \mathsf{negl}(\kappa)$.
> - **Soundness**: Knowledge error $= N/p + \varepsilon_\text{IPA}$, trong đó $N/p$ là batching error (negligible với $p \approx 2^{256}$) và $\varepsilon_\text{IPA}$ là knowledge error của IPAalmZK.
> - **Extraction**: $O(\log n \cdot n \cdot N)$ transcripts qua short-circuit (so với $O(n^3 N)$ của [Bün18] không dùng short-circuit — xem §1.2.5).

---

## §1.2.3 — QE vs R1CS: Tại sao QE Mạnh Hơn?

### R1CS (Rank-1 Constraint System)

R1CS biểu diễn constraints dạng: với $a = (a_1, \ldots, a_n)$, $b = (b_i)$, $c = (c_i)$ là public vectors:

$$
\langle a, w \rangle \cdot \langle b, w \rangle = \langle c, w \rangle
$$

Đây là một dạng quadratic equation đặc biệt — chỉ có dạng "outer product" của hai linear functions.

### QE Tổng Quát

Quadratic equation tổng quát (trong notation của Γ):

$$
\langle w, \Gamma w \rangle = 0 \quad \text{với } \Gamma \in \mathbb{F}_p^{n \times n} \text{ arbitrary}
$$

tương đương với $w^\top \Gamma w = 0$, tức là một quadratic form tùy ý trong $w$.

**R1CS là trường hợp đặc biệt** của QE: equation $\langle a, w \rangle \cdot \langle b, w \rangle = \langle c, w \rangle$ tương đương với $\langle w, \Gamma_\text{R1CS} w \rangle = 0$ với:

$$
\Gamma_\text{R1CS} = \frac{1}{2}(ab^\top + ba^\top) - c \cdot e_1^\top
$$

(ký hiệu thích hợp, trong đó $e_1$ là standard basis vector cho "target" component).

### Example: $\langle x, x \rangle = t$

**Với R1CS**: Biểu diễn $\sum x_i^2 = t$ cần $n$ equations:
- $y_i = x_i^2$ cho $i = 1, \ldots, n-1$: mỗi equation là $x_i \cdot x_i = y_i$ → cần auxiliary variables $y_i$
- $x_n^2 = t - \sum_{i<n} y_i$
- Tổng: **$n$ R1CS equations** với $2n-1$ variables

**Với QE**: $\langle x, x \rangle = t$ được viết trực tiếp như một QE với $\Gamma = \mathbf{id}_n$:

$$
\langle x, \mathbf{id}_n x \rangle = \langle x, x \rangle = t
$$

Tức là **một equation duy nhất** — không cần auxiliary variables!

> [!example] Polynomial Evaluation
> Prove $f(x) = \sum_{k=0}^{d^2-1} a_k x^k = t$ với witness $x$ và coefficients $a_k$ public.
>
> **Với R1CS**: Cần $\Omega(d^2)$ equations để compute mọi power $x^k$.
>
> **Với QE (§1.2.3)**: Dùng $2d$ equations với auxiliary variables $y_i = x^i$ và $z_i = x^{di}$:
> - $y_1 = x$: base case
> - $y_i = y_{i-1} \cdot x$ cho $i = 2, \ldots, d-1$: quadratic equation $\langle e_i, y \rangle - \langle e_{i-1}, y \rangle \langle e_1, x \rangle = 0$
> - $z_1 = y_{d-1} \cdot x$: cross-term
> - $z_i = z_1 \cdot z_{i-1}$ cho $i = 2, \ldots, d-1$
> - Output: $f(x) = \sum_{i,j} a_{i+jd} y_i z_j$
>
> Kết quả: **$2d$ QE equations** thay vì $O(d^2)$ R1CS — tiết kiệm một factor $d/2$.

> [!example] Elliptic Curve Point Addition (Twisted Edwards)
> Twisted Edwards curve: $-x^2 + y^2 = 1 + dx^2y^2$ — có thể xử lý như QE trực tiếp.
>
> **Với R1CS**: $8$ constraints per point addition.
> **Với QE**: **$5$ constraints** per point addition — tiết kiệm $37.5\%$.
>
> Quan trọng trong ứng dụng như Jubjub curve (dùng trong Zcash/zk-SNARK ecosystems).

---

## Efficiency: So sánh đầy đủ

Từ Tables 1–2 của paper (với $k = 2$):

| System | Setup | Assumption | $G$ comm | $\mathbb{F}_p$ comm | P compute | Relation |
|--------|-------|------------|---------|---------|-----------|---------|
| SNARG [Gro16] | Trusted | KoE | $O(1)$ | — | $O(n)$ | R1CS |
| Bulletproofs [Bün18] | CRS | dlog | $2\lceil\log n\rceil + 8$ | $5$ | $\approx 12n$ | R1CS |
| **QESAZK** | CRS | dlog | $2\lceil\log(n+2)\rceil + 3$ | $2$ | $\approx 8n$ | **QE** |

**QESAZK so với Bulletproofs**:
- Ít group elements hơn (nhờ dùng $n+2$ thay vì $n$ do commitment extension)
- Ít field elements hơn (2 vs 5)
- Prover computation thấp hơn: $\approx 8n$ vs $\approx 12n$ exponentiations → **$\approx 0.67\times$**

**Measurement thực nghiệm** (§5): Theoretical prediction $0.75\times$; measured $\approx 0.7\times$; với 140-bit exponents: $\approx 0.63\times$.

> [!warning] Tradeoff: QE mạnh hơn nhưng không selectively
> QESAZK không tự động "nhỏ hơn" Bulletproofs khi biểu diễn cùng một statement R1CS. Vì R1CS là subset của QE, **kích thước witness** có thể khác nhau (QE có thể cần ít auxiliary variables hơn → $n$ nhỏ hơn → QESAZK thực sự nhỏ hơn). Nhưng paper fix $n = |w|$ như nhau khi compare Tables 1–2 — comparison là trên cùng witness size.

---

## Tính Chất Đặc Biệt: Adaptive Statement

QESAZK là **adaptive commit-and-prove**: statement $\Gamma_i$ có thể được chọn **sau** khi prover commit $[c_w]$.

Điều này khác với Bulletproofs [Bün18] và [Boo16] — cả hai yêu cầu statement cố định trước commitment (non-adaptive).

**Ứng dụng**: Trong shuffle argument (Appendix C / Lesson A0), commitment $[c_w]$ được chia sẻ giữa QESAZK và LMPAZK — statement của cả hai phụ thuộc vào verifier challenges đến sau commitment. Adaptive property là thiết yếu cho composition này hoạt động.

> [!tip] 💡 Agent note
> **ILC connection**: Tính adaptive của QESAZK là lý do paper claim QESA "amenable to ILC" (Ideal Linear Commitment model [GK15]). Trong ILC, verifier có thể gửi "matrix queries" $\Gamma$ sau commitment và request evaluation $\Gamma w$. QESAZK chính xác là ILC argument cho quadratic queries. Paper để ngỏ câu hỏi liệu strategies của QESAZK có thể được adapted bởi linear IOPs hay không.

---

## Extraction Analysis cho QESAZK

Từ §1.2.5: Với $N$ quadratic equations trong $n$ variables, QESAZK cần $O(\log n \cdot n \cdot N)$ transcripts (short-circuit extraction).

**So sánh**: [Bün18] cần $O(n^3 N)$ transcripts. Với $n, N \approx 2^{20}$:
- [Bün18]: $O(n^3 N) \approx O(2^{80})$ → security loss $\approx 2^{80}$
- QESAZK: $O(n \log n \cdot N) \approx O(2^{45})$ → security loss $\approx 2^{45}$

Improvement **35 bits** trong concrete security — significant trong practice.

---

## Summary

- **QESAZK** = commit to $w$ + batch $N$ QE equations thành 1 via random $\Gamma = \sum r_i \Gamma_i$ + chứng minh $\langle w, \Gamma w \rangle = 0$ dùng IPAalmZK.
- **Adaptive**: $\Gamma_i$ có thể chọn sau commitment — khác Bulletproofs.
- **QE > R1CS**: Ví dụ $\langle x, x \rangle = t$ cần 1 QE vs $n$ R1CS; polynomial degree $d^2$ cần $2d$ QE vs $O(d^2)$ R1CS.
- **Efficiency**: $\approx 8n$ exponentiations (Bulletproofs: $\approx 12n$); $2\lceil\log(n+2)\rceil + 3$ group elements (Bulletproofs: $2\lceil\log n\rceil + 8$).
- **Security**: Extraction $O(n \log n \cdot N)$ transcripts — so với $O(n^3 N)$ của [Bün18].
- **Tự nhiên trong dlog/ILC**: QE là ngôn ngữ tự nhiên của setting này; R1CS chỉ là special case.

---

## References

- [HKR19] Hoffmann, Klooß, Rupp — *Efficient ZK Arguments in the Discrete Log Setting, Revisited*, CCS 2019
- [Bün18] Bünz et al. — *Bulletproofs: Short Proofs for Confidential Transactions and More*, S&P 2018 (🟡 — baseline comparison; Tables 1–2; IPA base protocol)
- [Boo16] Bootle et al. — *Efficient ZK Arguments for Arithmetic Circuits*, EUROCRYPT 2016 (🟡 — IPA original; QESAZK derived from their framework)
- [GK15] Groth, Kohlweiss — Ideal Linear Commitment model (🔴 Prerequisite)
- [Gro16] Groth — *On the Size of Pairing-based Non-interactive Arguments*, EUROCRYPT 2016 (⚪)
