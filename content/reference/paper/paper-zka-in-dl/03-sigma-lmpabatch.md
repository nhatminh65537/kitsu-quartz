---
title: "03. Standard Sigma-Protocol and LMPAbatch"
type: scheme
tags: [sigma-protocol, lmpa, batch-verification, hvzk, proof-of-knowledge, lesson-03]
aliases: [Sigma-std, LMPAbatch, Linear Map Preimage Argument]
source: "Efficient zero-knowledge arguments in the discrete log setting, revisited — Hoffmann, Klooß, Rupp, CCS 2019 / ePrint 2019/944"
created: 2026-03-15
---

> **Prerequisites**: [[01-zk-dlog-foundation|01. Foundation]] (implicit notation, hard kernel assumption, HVZK); [[02-testing-distributions|02. Testing Distributions]] (testing distribution $\chi_m$, $\mu$-special soundness, short-circuit extraction).
> 🔴 **Prerequisite references**: Cramer-Damgård-Schoenmakers [CDS94]; Maurer [Mau09] — sigma-protocol generalization framework.
> **Lesson type**: Scheme
> **Covers**: §3.1 (intuition cho LMPA); §3.2 (Protocol 3.1 — Σstd, Lemma 3.2); §3.3 (Protocol 3.4 — LMPAbatch, Lemma 3.5, Remark 3.6, Question 3.7); Appendix B (linear combination và batch proofs).
>
> **Notation** (bổ sung):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $[A] \in G^{m \times n}$ | Ma trận commitment key / linear map | $[A]$ |
> | $[t] \in G^m$ | Target vector (image của $[A]$) | $[t]$ |
> | $w \in \mathbb{F}_p^n$ | Witness (preimage) | $w$ |
> | $r \in \mathbb{F}_p^n$ | Randomness của prover | $r$ |
> | $[a] \in G^m$ | Commitment $[A]r$ (first message) | $[a]$ |
> | $\chi^{(\beta)}$ | Testing distribution $(α, 1)$, $α \leftarrow S$ | $\chi^{(\beta)}$ |
> | $[\hat{A}] \in G^{1 \times n}$ | Batched statement $x^\top [A]$ | $[\hat{A}]$ — paper dùng $[\tilde{A}]$ hoặc $[A_b]$ |
> | $[\hat{t}] \in G$ | Batched target $x^\top [t]$ | $[\hat{t}]$ — paper dùng $[\tilde{t}]$ hoặc $[t_b]$ |
> | $[c_w] \in G$ | Commitment to witness $w$ | $[c_w]$ |
> | $r_w \in \mathbb{F}_p$ | Randomness của commitment $[c_w]$ | $r_w$ |

---

## Motivation

Bài toán trung tâm của §3 là chứng minh **linear map preimage**:

$$
\exists\, w \in \mathbb{F}_p^n \;:\; [A]w = [t]
$$

trong đó $[A] \in G^{m \times n}$, $[t] \in G^m$ là public statement, còn $w$ là secret witness.

**Tại sao bài toán này quan trọng?** Nó bao gồm nhiều relation thường gặp:
- Chứng minh biết discrete log của $[h]$: $w$ với $[g]w = [h]$, tức $[A] = [\mathbf{g}]$, $[t] = [h]$.
- Chứng minh biết opening của Pedersen commitment $[c] = [g_0]r_w + [\mathbf{g}]w$: witness là $(r_w, w)$.
- Chứng minh biết plaintext của ElGamal ciphertext: relation tuyến tính trên nhóm.

**Vấn đề hiệu quả**: Protocol ngây thơ nhất (gửi $w$ thẳng) không zero-knowledge. Protocol Σstd cải thiện nhưng communication vẫn $O(n + m)$ — phụ thuộc cả chiều dài witness $n$ lẫn số phương trình $m$. Mục tiêu: đạt $O(\log n)$, independent với $m$.

**Lộ trình của §3** (hai bước):
1. **LMPAbatch** (§3.3): loại bỏ phụ thuộc vào $m$ — communication $O(n)$ independent of $m$.
2. **LMPAnoZK → LMPAZK** (§3.4–3.5, Lesson 04): giảm từ $O(n)$ xuống $O(\log n)$ bằng recursion.

---

## §3.2 — Protocol Σstd: Sigma-Protocol Chuẩn

### Setting và quan hệ

Commitment key $\mathsf{ck} = [\mathbf{g}] = [g_0, g_1, \ldots, g_n] \in G^{1 \times (n+1)}$, $\mathsf{Com}_{\mathbf{g}}(w; r) = r[g_0] + [\mathbf{g}]w$.

Witness relation: $R_\text{LMP} = \{(([A], [t]),\, w) \mid [A]w = [t]\}$ với $[A] \in G^{m \times n}$.

> [!note] Protocol 3.1 — $\Sigma_\text{std}$
> **Type**: Interactive Argument of Knowledge (3-move, public coin)
> **Setting**: Nhóm $G$ bậc nguyên tố $p$; $[A] \in G^{m \times n}$; testing distribution $\chi^{(\beta)}$ (ví dụ 2.13). Common input: $([A], [t]) \in G^{m \times n} \times G^m$. Witness: $w \in \mathbb{F}_p^n$.
>
> **$\mathsf{Commit}$** (P → V):
> - Chọn $r \leftarrow \mathbb{F}_p^n$
> - Tính $[a] = [A]r \in G^m$
> - Gửi $[a]$
>
> **$\mathsf{Challenge}$** (V → P):
> - Chọn $\beta \leftarrow \chi^{(\beta)}$ (tức chọn $\alpha \leftarrow S \subseteq \mathbb{F}_p$, đặt $\beta = (\alpha, 1)$ trong $\mathbb{F}_p^2$)
> - Thực tế trong protocol: verifier gửi scalar $\beta \in \mathbb{F}_p$, prover dùng $(x_1, x_2) = (\beta, 1)$
> - Gửi $\beta$
>
> **$\mathsf{Response}$** (P → V):
> - Tính $z = \beta w + r \in \mathbb{F}_p^n$
> - Gửi $z$
>
> **$\mathsf{Verify}$** (V):
> - Chấp nhận nếu $[A]z \stackrel{?}{=} \beta [t] + [a]$

**Giải thích**: Công thức kiểm tra $[A]z = \beta[t] + [a]$ đúng với witness hợp lệ vì:

$$
[A]z = [A](\beta w + r) = \beta [A]w + [A]r = \beta[t] + [a] \quad \checkmark
$$

> [!abstract] Lemma 3.2 — Security của $\Sigma_\text{std}$
> Protocol $\Sigma_\text{std}$ là một HVZK-PoK cho $\exists w : [t] = [A]w$. Cụ thể:
>
> - **Perfectly complete**: Với mọi $(st, w) \in R$, honest prover luôn được accept.
> - **Perfect HVZK**: Simulator tạo transcript indistinguishable với transcript thực.
> - **2-special sound**: Từ 2 transcripts $([a], \beta, z)$ và $([a], \beta', z')$ với $\beta \neq \beta'$, extractor tính được witness.

**Proof.**

*Completeness*: Đã kiểm tra ở trên — $[A]z = \beta[t] + [a]$ đúng theo bilinearity. $\checkmark$

*Extraction* (2-special sound): Giả sử có hai transcripts chấp nhận được $([a], \beta, z)$ và $([a], \beta', z')$ với $\beta \neq \beta'$. Từ điều kiện verify:

$$
[A]z = \beta[t] + [a] \quad \text{và} \quad [A]z' = \beta'[t] + [a]
$$

Trừ hai phương trình: $[A](z - z') = (\beta - \beta')[t]$. Vì $\beta \neq \beta'$ nên $\beta - \beta' \neq 0$ trong $\mathbb{F}_p$, do đó:

$$
w := \frac{z - z'}{\beta - \beta'} \in \mathbb{F}_p^n \quad \text{là witness vì} \quad [A]w = [t] \quad \checkmark
$$

*HVZK*: Simulator: chọn $\beta \leftarrow \chi^{(\beta)}$ và $z \leftarrow \mathbb{F}_p^n$ uniformly. Tính **ngược** $[a] := [A]z - \beta[t]$. Transcript $([a], \beta, z)$ hợp lệ vì $[A]z = \beta[t] + [a]$ theo construction. Phân phối: $\beta$ và $z$ phân phối đúng như trong protocol thực; $[a]$ bị xác định hoàn toàn bởi $\beta, z$ — tức là uniquely determined response — nên transcript có cùng phân phối với thực. Perfect HVZK. $\blacksquare$

> [!info] 🟡 Framework Maurer/CDS (từ [Mau09], [CDS94])
> $\Sigma_\text{std}$ là instance của framework tổng quát từ Maurer [Mau09] và Cramer-Damgård-Schoenmakers [CDS94] cho Sigma-protocols trong nhóm abelian. Framework này: (1) prover commit bằng random masking; (2) verifier gửi challenge scalar; (3) prover respond bằng tổ hợp tuyến tính witness và masking. Paper [HKR19] tổng quát hóa lên multi-round với nhiều loại challenge (không chỉ scalar) thông qua testing distributions.
>
> *(theo [Mau09]: Maurer — Unifying Zero-Knowledge Proofs of Knowledge, AFRICACRYPT 2009)*

**Nhược điểm của $\Sigma_\text{std}$**: Communication là $O(m + n)$:
- $[a] \in G^m$: $m$ group elements
- $z \in \mathbb{F}_p^n$: $n$ field elements

Khi $m$ hoặc $n$ lớn, đây không thực tế. Hai bước tiếp theo giải quyết lần lượt.

---

## §3.3 — Protocol LMPAbatch: Loại bỏ Phụ thuộc vào $m$

### Ý tưởng

Muốn giảm $m$ group elements trong message $[a]$: thay vì gửi toàn bộ $[a] = [A]r \in G^m$, batch $m$ phương trình thành **1 phương trình duy nhất** bằng random linear combination.

**Vấn đề với batch đơn thuần**: Nếu verifier gửi $x \leftarrow \mathbb{F}_p^m$ và yêu cầu prove $x^\top [A] w = x^\top [t]$ (1 equation), soundness bị phá vỡ — adversary có thể chọn $[A]$ và $[t]$ tùy ý sau khi thấy $x$.

**Giải pháp**: Prover **commit to $w$ trước** khi batching. Một khi $w$ đã committed, adversary không thể thay đổi witness sau khi biết $x$. Đây là kỹ thuật "commitment extending" (Remark 3.6).

> [!note] Protocol 3.4 — $\mathsf{LMPA}_\text{batch}$
> **Type**: Interactive Argument of Knowledge (5-move, public coin)
> **Setting**: Commitment key $[\mathbf{g}] \in G^{1 \times (n+1)}$; testing distributions $\chi_m$ (cho batching) và $\chi^{(\beta)}$ (cho subprotocol). Common input: $([A], [t]) \in G^{m \times n} \times G^m$. Witness: $w \in \mathbb{F}_p^n$.
>
> **Move 1 — $\mathsf{CommitWitness}$** (P → V):
> - Chọn $r_w \leftarrow \mathbb{F}_p$
> - Tính $[c_w] = \mathsf{Com}_{\mathbf{g}}(w;\, r_w) = r_w [g_0] + [\mathbf{g}]w \in G$
> - Gửi $[c_w]$
>
> **Move 2 — $\mathsf{BatchChallenge}$** (V → P):
> - Chọn $x \leftarrow \chi_m$
> - Gửi $x \in \mathbb{F}_p^m$
> - Cả hai bên tính statement đã batch: $[\hat{A}] = x^\top [A] \in G^{1 \times n}$ và $[\hat{t}] = x^\top [t] \in G$
>
> **Move 3–5 — $\mathsf{SubProof}$** (P ↔ V):
> - Định nghĩa ma trận AND-compiled:
>
> $$[B] = \begin{pmatrix} g_0 & \mathbf{g} \\ 0 & \hat{A} \end{pmatrix} \in G^{2 \times (n+1)}, \quad [u] = \begin{pmatrix} c_w \\ \hat{t} \end{pmatrix} \in G^2$$
>
> - Statement mới: $\exists (r_w, w) : [B]\binom{r_w}{w} = [u]$
> - Thực hiện Protocol $\Sigma_\text{std}$ cho statement này
>
> **$\mathsf{Verify}$** (V, cuối Move 5):
> - Verifier accept nếu $\Sigma_\text{std}$ accept

**AND-compilation**: Statement $[B]\binom{r_w}{w} = [u]$ thực chất là AND của hai statement:
1. $r_w [g_0] + [\mathbf{g}]w = [c_w]$ — chứng minh $[c_w]$ là commitment đến $w$ với randomness $r_w$
2. $[\hat{A}]w = [\hat{t}]$ — chứng minh $w$ là preimage của batched map

> [!abstract] Lemma 3.5 — Security của $\mathsf{LMPA}_\text{batch}$
> $\mathsf{LMPA}_\text{batch}$ là một 5-move HVZK-AoK cho $\exists w : [t] = [A]w$ với:
>
> - $(m, 2)$-special soundness — hoặc tìm được witness, hoặc tìm được kernel element của $[\mathbf{g}]$
> - $(1, 2)$ short-circuit extraction (theo Definition 2.19)

**Proof.**

*Completeness*: AND-statement theo $[B]$ đúng với $(r_w, w)$ hợp lệ — straightforward. $\checkmark$

*HVZK*: Simulator chọn $\beta, x$ theo đúng distributions. Simulate $\Sigma_\text{std}$ (3 moves cuối) trước, không cần $[c_w]$. Sau đó chọn $[c_w] \leftarrow G$ uniformly. Vì $[c_w]$ chỉ cần nhất quán với $\Sigma_\text{std}$ và simulator tạo ra $\Sigma_\text{std}$ transcript trước, $[c_w]$ hoàn toàn free → perfect HVZK. $\checkmark$

*Extraction* ($(m,2)$-special sound và short-circuit):

**Bước 1**: Với good $(m, 2)$-tree, extract layer 2 (subprotocol $\Sigma_\text{std}$). Nếu không phải tất cả $m$ challenges cho cùng $(r_w, w)$, thì có hai pairs $(r_w, w) \neq (r_w', w')$ với cùng $[c_w]$ → $[\mathbf{g}]\binom{r_w - r_w'}{w - w'} = [0]$ → đây là non-trivial kernel element của $[\mathbf{g}]$ → xong (case short-circuit).

**Bước 2**: Nếu tất cả $m$ challenges cho cùng $(r_w, w)$, thì với mọi $x_i$:

$$
x_i^\top [A] w = [\hat{t}_i] = x_i^\top [t]
$$

Đặt $X = (x_1, \ldots, x_m)$. Vì tree là good, $X$ invertible. Suy ra:

$$
X^\top [A] w = X^\top [t] \implies [A]w = [t]
$$

Tức $w$ là valid witness. $\blacksquare$

**Short-circuit $(1,2)$**: Quick-extraction từ $\mu' = (1, 2)$ — cần chỉ 1 challenge ở layer 1 và 2 challenges ở layer 2 để quick-extract $w$ từ $\Sigma_\text{std}$. Nếu thất bại, short-circuit ở layer 1 (dùng thêm $m-1$ challenges) sẽ cho kernel element.

> [!tip] 💡 Agent note
> **Communication analysis**: $\mathsf{LMPA}_\text{batch}$ gửi $[c_w] \in G$ (1 group element) thay vì $[a] \in G^m$ ($m$ elements) của $\Sigma_\text{std}$. Tổng communication: $O(n)$ field elements + $O(1)$ group elements, independent of $m$. Đây là mục tiêu bước 1. Bước 2 (Lesson 04) sẽ giảm $O(n)$ xuống $O(\log n)$.

> [!note] Remark 3.6 — Commitment Extending
> Khi làm việc với adversarial $[A]$ và $[t]$ (không có hardness assumption trên $[A]$), extending $[A]$ thành $[B]$ chứa commitment submatrix là cách để inject hardness. Nếu $[A]$ đã chứa submatrix commitment, chỉ cần randomly sum các hàng còn lại thành một hàng duy nhất (thay vì batch toàn bộ).

> [!question] Question 3.7 — Open Problem
> Batch verification **không có** commitment upfront có sound không? Tức: V gửi $x$ ngay lập tức, P prove $\exists w : [\hat{A}]w = [\hat{t}]$ mà không commit trước. Câu hỏi này vẫn mở tính đến 2019. Partial results: soundness đúng trong một số trường hợp đặc biệt. Nếu trả lời "có", nhiều protocols trong literature — bao gồm một số của [Boo16] — có thể là **proofs** (unconditional soundness) thay vì chỉ là **arguments**.

---

## Appendix B — Linear Combination và Batch Proofs

> [!tip] 💡 Agent note
> Paper chỉ mô tả Appendix B ngắn gọn trong §1.1.2. Phần dưới đây tổng hợp từ nội dung giới thiệu.

Kỹ thuật **linear combination of protocols** (§1.1.2) cho phép recover **batch proofs** của [44] như một trường hợp đặc biệt:

Xét hai protocol chạy song song với cùng commitment $[a]$:
- Protocol A: verifier gửi $x_1$, prover trả $z_1 = x_1 w$
- Protocol B: verifier gửi $x_2$, prover trả $z_2 = x_2 r$

Linear combination: verifier gửi $(x_1, x_2)$, prover trả $z = x_1 w + x_2 r$. Đây chính là $\Sigma_\text{std}$ — và nó cũng bằng cách chạy batch proof theo [44] khi $x_2 = 1$.

Điều này giải thích tại sao $\mathsf{LMPA}_\text{batch}$ "recover" batch proofs của [44] khi $x_2 = 1$ (non-randomised linear combination): không cần commit to $r$ thêm vì protocol A đã handle "masking" với subprotocol $\Sigma_\text{std}$.

---

## Summary

- **$\Sigma_\text{std}$**: 3-move, perfectly complete + perfect HVZK + 2-special sound. Communication $O(m + n)$. Template cơ bản từ Maurer/CDS, hoạt động cho mọi linear relation $[A]w = [t]$.
- **$\mathsf{LMPA}_\text{batch}$**: 5-move. Loại bỏ phụ thuộc vào $m$ bằng cách commit to $w$ trước, rồi batch $m$ equations thành 1. Communication $O(n)$ independent of $m$. $(m, 2)$-special sound với $(1,2)$ short-circuit extraction.
- **Kỹ thuật chính**: AND-compilation (merge nhiều statements thành 1), commitment extending (inject hardness vào $[A]$), batch với testing distribution $\chi_m$.
- **Open problem (Q 3.7)**: Batch không commitment có sound không? Liên quan đến câu hỏi arguments hay proofs.

---

## References

- [HKR19] Hoffmann, Klooß, Rupp — *Efficient ZK Arguments in the Discrete Log Setting, Revisited*, CCS 2019
- [Mau09] Maurer — *Unifying Zero-Knowledge Proofs of Knowledge*, AFRICACRYPT 2009 (🟡 — Σstd framework)
- [CDS94] Cramer, Damgård, Schoenmakers — *Proofs of Partial Knowledge*, CRYPTO 1994 (🟡 — Σ-protocol template)
- [Boo16] Bootle et al. — *Efficient ZK Arguments for Arithmetic Circuits*, EUROCRYPT 2016 (🟡 — Lesson 04)
