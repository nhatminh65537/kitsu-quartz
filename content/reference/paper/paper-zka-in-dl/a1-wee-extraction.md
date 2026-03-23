---
title: "A1. Witness-Extended Emulation and Extraction Bounds"
type: deep-dive
tags: [witness-extended-emulation, extraction, knowledge-error, extraction-efficiency, appendix]
aliases: [Witness-Extended Emulation, WEE, Extraction Error, Optimal Extraction]
source: "Efficient zero-knowledge arguments in the discrete log setting, revisited — Hoffmann, Klooß, Rupp, CCS 2019 / ePrint 2019/944 — Appendix D"
created: 2026-03-15
---

> **Prerequisites**: [[02-testing-distributions|02. Testing Distributions]] (Definition 2.17–2.19, Corollary 2.20 — $\mu$-special soundness và short-circuit extraction); [[03-sigma-lmpabatch|03. Σstd & LMPAbatch]]; [[04-lmpazk|04. LMPAZK]] (concrete extraction bounds).
> 🔴 **Prerequisite references**: Bootle et al. [Boo16] — §4 (witness-extended emulation definition); Pass [Pas03] — knowledge soundness formalisms.
> **Lesson type**: Deep Dive
> **Covers**: Appendix D — witness-extended emulation với extraction error; preserving knowledge error qua multi-round protocols; loophole trong security estimates (làm thế nào efficiently obtain transcripts); conjectured optimal extraction bound $O(n/\log n)$.
>
> **Notation** (bổ sung):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $\text{WEE}$ | Witness-Extended Emulation | WEE |
> | $\text{KE}$ | Knowledge Error (xác suất extractor thất bại) | knowledge error |
> | $\varepsilon_\text{ext}$ | Extraction error tổng cộng | — |
> | $T_\text{ext}$ | Số transcripts cần cho extraction | — |
> | $\kappa_\text{opt}$ | Conjectured optimal: $O(n/\log n)$ transcripts | — |

---

## Context: Tại sao Appendix D quan trọng?

Các Lessons 02–06 dùng **special soundness** (Definition 2.17) như framework chính để chứng minh knowledge soundness. Nhưng special soundness **chỉ là một bước**: nó cho biết "nếu có $\mu$-tree thì extract được witness." Câu hỏi còn lại là:

1. **Làm sao efficiently produce $\mu$-tree?** TreeFinder algorithm cần bao nhiêu runtime?
2. **Extraction error $\varepsilon_\text{ext}$ là bao nhiêu?** Probability extractor thất bại?
3. **Có gap nào giữa communication complexity và extraction complexity không?** Conjectured yes — Appendix D formalizes điều này.

Appendix D trả lời các câu hỏi này trong context của protocols cụ thể của [HKR19].

---

## 1. Witness-Extended Emulation

### Definition

**Witness-Extended Emulation (WEE)** là security notion mạnh hơn knowledge soundness đơn thuần:

> [!note] Witness-Extended Emulation (từ [Boo16], [Pas03])
> Argument system $(P, V)$ cho relation $R$ đạt **witness-extended emulation** nếu tồn tại expected polynomial-time emulator $\mathsf{Em}$ sao cho: với mọi adversary $P^*$ và mọi statement $st$, emulator $\mathsf{Em}^{P^*}$ (với oracle access đến $P^*$) output tuple $(\mathsf{tr}, w)$ với phân phối computationally indistinguishable với $(\mathsf{tr}^*, w^*)$ nơi:
> - $\mathsf{tr}^* \leftarrow \langle P^*(st), V(st) \rangle$ (transcript thực)
> - $w^* = w$ nếu $V$ accept, hoặc $w^* = \bot$ nếu $V$ reject
>
> Nghĩa là: emulator vừa simulate transcript, vừa extract witness khi V accept — **simultaneously**.

**Tại sao WEE mạnh hơn PoK thông thường?** Proof of knowledge (PoK) chỉ yêu cầu extract witness; WEE yêu cầu extract trong khi **giữ nguyên phân phối transcript** — không được phép "cheat" bằng cách chạy thêm nhiều interactions với $P^*$.

**Extraction error**: Trong WEE, extraction error $\varepsilon_\text{ext}$ là xác suất emulator output $(tr, \bot)$ mặc dù $V$ accept. Muốn $\varepsilon_\text{ext}$ nhỏ.

---

## 2. Preserving Knowledge Error qua Multi-Round

**Vấn đề**: Khi compose nhiều round protocols (như LMPAZK với $d = \log_k n$ rounds), knowledge error **tích lũy** qua từng round. Nếu không cẩn thận, $\varepsilon_\text{ext}$ tổng có thể lớn hơn nhiều so với soundness error của testing distribution.

**Trong LMPAZK/IPAalmZK/QESAZK**: Mỗi round có soundness error $\delta_\text{snd}(\chi_{2k-1}^e) \leq \frac{2k-1}{p}$. Với $d = \log_k n$ rounds và composition:

$$
\varepsilon_\text{ext}^\text{total} \approx d \cdot \frac{2k-1}{p} = O\!\left(\frac{\log n}{p}\right)
$$

Với $p \approx 2^{256}$ và $n \leq 2^{64}$, đây là $\approx \frac{64}{2^{256}} = 2^{-250}$ — **negligible**.

> [!tip] 💡 Agent note
> Đây là lý do paper dùng **polynomial testing distribution** (soundness $\frac{m}{p}$ per round) thay vì random testing (cùng asymptotic nhưng constants khác nhau). Với polynomial testing, soundness error tỉ lệ linearly với $m$ và inversely với $p$ — dễ bound tổng cộng sau $d$ rounds.

**Bảo toàn qua AND**: Khi hai protocols chia sẻ commitment (như LMPAZK + QESAZK trong $\Pi_\text{shuffle}$), knowledge error là **sum** của hai errors nếu extractions independent — vẫn negligible.

---

## 3. Concrete Extraction Bounds (Summary)

Từ Lesson 02 (Corollary 2.20) và phân tích cụ thể của từng protocol:

| Protocol | $\mu$ per round | $\mu'$ (quick) | Số transcripts | So sánh |
|----------|----------------|----------------|---------------|---------|
| Σstd | $(2)$ | $(1)$ | $\leq 2$ | — |
| LMPAbatch | $(m, 2)$ | $(1, 1)$ | $\leq m+2$ | — |
| LMPAZK | $(3, \ldots, 3)$ $d$ rounds | $(1, \ldots, 1)$ | $O(n \log n)$ | vs $O(n^{1.58})$ naïve |
| IPAalmZK | $(3, \ldots, 3)$ $d$ rounds | $(1, \ldots, 1)$ | $O(n \log n)$ | idem |
| QESAZK | $(3, \ldots, 3)$ $d$ rounds | $(1, \ldots, 1)$ | $O(n N \log n)$ | vs $O(n^3 N)$ [Bün18] |

**Short-circuit formula** (Corollary 2.20): Với $\mu_i = 3$ và $\mu'_i = 1$ cho $d$ rounds:

$$
T_\text{ext} \leq s_0 + 1 = \sum_{i=0}^{d-1}(3-1)\cdot 1^{d-1-i} + 1 = 2d + 1 = O(\log n)
$$

transcripts cho **mỗi extraction call**. Nhưng để extract toàn bộ witness với $n$ components, cần $n$ calls (một per block cuối recursion) → $O(n \log n)$ total.

---

## 4. Loophole: Làm sao Efficiently Obtain Transcripts?

**Vấn đề bị bỏ qua trong analysis chuẩn**: Để chạy extractor, cần $T_\text{ext}$ transcripts. Nhưng mỗi transcript cần một **interaction** với prover — nếu prover là malicious, nó có thể từ chối cooperate sau một số lần nhất định!

Paper nhận ra: analysis $O(n \log n)$ transcripts là số transcripts **cần thiết**, nhưng chưa nói về **runtime của TreeFinder** để produce those transcripts.

**TreeFinder runtime**: TreeFinder [Boo16] cần $O(n \log n)$ expected time nếu prover cooperates with probability $\varepsilon$. Với $\varepsilon$ small, runtime là $O(n \log n / \varepsilon)$ — có thể rất lớn!

**Loophole cụ thể** (Appendix D, paper): Có thể xây dựng một prover $P^*$ thành công với probability $\varepsilon$ nhưng "abort" chiến lược sau lần đầu tiên — khiến TreeFinder phải restart nhiều lần. Bounds $O(n \log n)$ là worst-case về **số transcripts trong một successful run**, không phải total runtime kể cả failures.

> [!warning] Hệ quả cho security estimates
> Khi nói "extraction từ $O(n \log n)$ transcripts," ngầm giả sử TreeFinder runs efficiently. Trong reality, với adversary prover, số interactions tổng có thể lớn hơn. Paper acknowledge đây là một **gap** trong analysis và để lại cho future work.
>
> Thực tế: trong ROM + Fiat-Shamir, transcripts được simulate không cần interaction thực — không có loophole này. Loophole chỉ relevant cho **interactive** setting.

---

## 5. Conjectured Optimal Extraction Bound

### Câu hỏi mở

Paper đặt ra câu hỏi: Với protocol có communication $O(\log n)$ group elements, có thể extract với **ít hơn $O(n)$ transcripts** không? Cụ thể, có thể đạt $O(n / \log n)$?

**Intuition**: Communication $O(\log n)$ group elements ↔ $\log n$ "degrees of freedom" trong transcript. Để extract $n$ witness components, cần ít nhất $n / \log n$ independent transcripts (information-theoretic lower bound argument).

> [!abstract] Conjectured Optimal Bound (Appendix D)
> Với argument có communication $O(\log n)$ group elements cho $n$-dimensional witness, **conjectured optimal extraction** cần $\Omega(n / \log n)$ transcripts.
>
> Corollary 2.20 gives $O(n \log n)$ — gap factor $O(\log^2 n)$.
>
> **Status (2019)**: Chỉ là conjecture. Không có proof chính thức. Cũng không có matching lower bound.

### Implication

Nếu conjecture đúng, extractor của LMPAZK và QESAZK đang **suboptimal by $O(\log^2 n)$**. Improving là open problem.

> [!info] 🟡 TreeFinder của Attema-Fehr-Klooß [Att22]
> [Att22] cung cấp một generalized TreeFinder cho multi-round protocols, với runtime guarantees tốt hơn trong một số settings. Kết quả của họ không hoàn toàn close gap $O(\log^2 n)$ nhưng cải thiện constants và handle edge cases tốt hơn.
>
> *(theo [Att22]: Attema, Fehr, Klooß — Fiat-Shamir Transformation of Multi-Round Interactive Proofs, TCC 2022)*

---

## 6. Kết nối với Short-Circuit Extraction (Lesson 02)

**Nhắc lại**: Definition 2.19 và Corollary 2.20 (Lesson 02) là **tools** để bound $T_\text{ext}$. Appendix D là nơi các tools này được áp dụng và contextualized.

Cụ thể:

**Short-circuit extraction distinguishes hai cases**:
- **Quick-extract** (Case A): Tìm được witness từ $\prod \mu'_i = 1$ leaves → $T_\text{ext} = 1$.
- **Short-circuit** (Case B): Không quick-extract → cần thêm leaves → nhưng short-circuit cho kernel element (= break dlog) sau $s_0 + 1$ leaves.

**Trong practice**: Hầu hết adversaries thành công đều quick-extractable (case A) hoặc break dlog (không có adversary nào làm được trong practice). Case B là worst-case analysis.

**Concrete security**: Với $s_0 = O(\log n)$ và $T_\text{ext} = O(n \log n)$:
- Reduction: adversary với success prob $\varepsilon$ → dlog solver với success prob $\varepsilon - T_\text{ext} \cdot \delta_\text{snd}$.
- Với $\delta_\text{snd} \approx 2^{-256}$ và $T_\text{ext} \approx n \log n \approx 2^{26}$: loss $\approx 2^{-230}$ — negligible.

---

## 7. Summary

- **WEE** là security notion đầy đủ hơn PoK — extract witness trong khi giữ phân phối transcript.
- **Knowledge error** tích lũy qua multi-round nhưng vẫn negligible với polynomial testing ($\leq d \cdot (2k-1)/p = O(\log n / p)$).
- **$O(n \log n)$ transcripts** cho LMPAZK/QESAZK — cải thiện lớn so với $O(n^{1.58})$ naïve và $O(n^3 N)$ của [Bün18].
- **Loophole**: Bounds về số transcripts không tính overhead của TreeFinder khi prover cheat. Trong ROM + Fiat-Shamir, loophole không tồn tại.
- **Conjecture $O(n/\log n)$ optimal**: Nếu đúng, vẫn còn gap $O(\log^2 n)$ giữa current analysis và optimal.
- **Open problems**: Close the gap; prove/disprove conjecture; extend [Att22] generalization.

---

## References

- [HKR19] Hoffmann, Klooß, Rupp — *Efficient ZK Arguments in the Discrete Log Setting, Revisited*, CCS 2019 — Appendix D
- [Att22] Attema, Fehr, Klooß — *Fiat-Shamir Transformation of Multi-Round Interactive Proofs*, TCC 2022 (🟡 — TreeFinder generalization, integrated above)
- [Boo16] Bootle et al. — *Efficient ZK Arguments for Arithmetic Circuits*, EUROCRYPT 2016 (🔴 — WEE definition §4; TreeFinder §5)
- [Pas03] Pass — *On the Complexity of Two-Party Computation*, TCC 2003 (⚪ — knowledge soundness formalism)
