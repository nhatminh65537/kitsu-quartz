---
title: "08. Design Principles Synthesized"
type: survey
tags: [design-principles, synthesis, zero-knowledge, unifying-framework, lesson-08]
aliases: [Design Principles, ZK Unifying Techniques, Protocol Design Survey]
source: "Efficient zero-knowledge arguments in the discrete log setting, revisited — Hoffmann, Klooß, Rupp, CCS 2019 / ePrint 2019/944"
created: 2026-03-15
---

> **Prerequisites**: [[04-lmpazk|04. LMPAZK]], [[05-ipa-almzk|05. IPAalmZK]], [[06-qesazk|06. QESAZK]] — toàn bộ protocols đã được study. Lesson này không introduce content mới; chỉ nhìn lại toàn bộ course từ góc độ tổng hợp.
> **Lesson type**: Survey / Overview
> **Covers**: §1.1 (revisited — bốn design principles từ góc nhìn của người đã học xong course); mapping đầy đủ của mỗi technique lên mỗi protocol; "big picture" của dlog ZK argument landscape.
>
> **Không có notation mới** — lesson này dùng lại toàn bộ notation đã định nghĩa ở Lessons 01–07.

---

## Mục đích của Lesson này

Paper [HKR19] bắt đầu (§1.1) bằng cách hứa hẹn sẽ hệ thống hóa "basic techniques... partly being used implicitly before." Đến đây, sau khi học xong tất cả protocols, ta có thể **xác nhận lời hứa đó** bằng cách truy ngược lại từng kỹ thuật trong từng protocol.

Lesson này trả lời câu hỏi: **Bốn design principles xuất hiện ở đâu, như thế nào trong mỗi protocol?**

---

## Nhắc lại: Bốn Design Principles

Từ §1.1 (Lesson 01), bốn kỹ thuật nền tảng:

| # | Kỹ thuật | Mục đích |
|---|---------|---------|
| P1 | **Probabilistic Verification** | Giảm communication không phụ thuộc $m$ (số equations) |
| P2 | **Linear Combination of Protocols** | Đạt zero-knowledge bằng masking randomness |
| P3 | **Uniform-or-Unique Responses** | Cho phép simulator tạo transcript ngược |
| P4 | **Kernels and Redundancy** | Handle non-linear statements bằng cách inject randomness vào kernel |

---

## Mapping: Protocol × Technique

### Σstd (Lesson 03)

**Relation**: $\exists w : [A]w = [t]$, witness $w \in \mathbb{F}_p^n$.

| Kỹ thuật | Vai trò trong Σstd |
|---------|-------------------|
| P1 | Không dùng explicitly — gửi full $z \in \mathbb{F}_p^n$, communication $O(n+m)$ |
| P2 | **Cốt lõi**: $z = \beta w + r$ là linear combination của protocol "gửi $w$" (trọng số $\beta$) và "gửi $r$" (trọng số $1$). Challenge $(\beta, 1)$ từ V |
| P3 | $z$: uniform (vì $r$ random, $1 \neq 0$). $[a] = [A]z - \beta[t]$: uniquely determined → simulator build transcript ngược |
| P4 | Không cần — statement linear, không có kernel issue |

### LMPAbatch (Lesson 03)

**Relation**: Như Σstd nhưng muốn eliminate phụ thuộc $m$.

| Kỹ thuật | Vai trò trong LMPAbatch |
|---------|------------------------|
| P1 | **Bước chính**: Batch $m$ equations $[A]w=[t]$ thành 1 bằng random $x \leftarrow \chi_m$ → $[\hat{A}]w = [\hat{t}]$. Communication của $[a]$ giảm từ $m$ xuống $1$ group element |
| P2 | Dùng trong subprotocol Σstd (LMPAbatch gọi Σstd) |
| P3 | $[c_w]$ gửi trước: uniquely determined từ kết quả sau. $z$ từ Σstd: uniform |
| P4 | Không cần — commitment extending xử lý hardness riêng |

### LMPAnoZK (Lesson 04)

**Relation**: $\exists w : [A]w = [t]$, communication $O(\log n)$, **không** ZK.

| Kỹ thuật | Vai trò |
|---------|--------|
| P1 | **Recursive batching**: Mỗi round compress witness từ $n$ xuống $n/k$ bằng outer product + testing distribution. Off-diagonal terms $[u_\ell]$ là "batched" partial sums |
| P2 | Không dùng (protocol không ZK) |
| P3 | $[u_\ell]$: uniquely determined từ witness và challenges. $w_b$: tương đương uniform sau compress (không hoàn toàn — đây là lý do cần ZK conversion) |
| P4 | Không cần — mọi statements vẫn linear sau mỗi round compress |

### LMPAZK (Lesson 04)

**Relation**: Như LMPAnoZK nhưng **có** ZK.

| Kỹ thuật | Vai trò |
|---------|--------|
| P1 | Kế thừa từ LMPAnoZK (recursive batching) |
| P2 | **Bước ZK**: Chạy hai LMPAnoZK song song — instance thật $(w)$ và masking $(r)$. Combined: $w' = x_1 w + x_2 r$ với $(x_1, x_2) \leftarrow \chi^{(\beta)}$ từ V |
| P3 | $w' = x_1 w + x_2 r$: uniform ($x_2 \neq 0$, $r$ random). $[u_\ell^w]$: uniquely determined từ $[u_\ell^r]$ và $[u_\ell^{w'}]$ → simulator build ngược |
| P4 | Không cần trực tiếp — dual testing distribution xử lý commitment key derivation (kỹ thuật liên quan) |

### IPAalmZK (Lesson 05)

**Relation**: $\exists x, y : \langle x, y \rangle = t$, **"almost"** ZK.

| Kỹ thuật | Vai trò |
|---------|--------|
| P1 | **Recursive compress**: Cross-terms $([L], [R])$ mỗi round reduce $(n)$ xuống $(n/2)$ — tương tự outer product trick của LMPA |
| P2 | **Bước ZK**: Combined $(x', y') = (x_1 x + x_2 r, x_1 y + x_2 s)$ với $(x_1, x_2) \leftarrow \chi^{(\beta)}$ |
| P3 | $x'$: **gần** uniform nhưng không hoàn toàn — $r$ chỉ có $\log n$ free components → **"almost"** ZK. $[c_r], [c_s]$: uniquely determined |
| P4 | **Cốt lõi**: Chọn $r, s$ từ kernel của linear maps liên quan đến $y, x$: $\langle r, y \rangle = \langle r, s \rangle = \langle x, s \rangle = 0$. Đây chính là **injecting randomness into kernel** — kỹ thuật P4. Cần $\log n$ random components thay vì $n$ vì hệ điều kiện kernel linear, chỉ có $O(\log n)$ degrees of freedom |

> [!tip] 💡 Agent note
> IPAalmZK là ví dụ tinh tế nhất của P4: kernel không trivial như ở LMPA (chỉ cần không gửi $r$ trực tiếp), mà cần $r$ **không thay đổi inner product** $\langle x + r, y + s \rangle = \langle x, y \rangle$. Điều này đặt ràng buộc $r, s$ vào kernel của map "inner-product-preserving" — một subspace $O(\log n)$-dimensional trong $\mathbb{F}_p^n$.

### QESAZK (Lesson 06)

**Relation**: $\exists w : \langle w, \Gamma_i w \rangle = 0$ với $N$ equations.

| Kỹ thuật | Vai trò |
|---------|--------|
| P1 | **Batch $N$ QE equations**: Random linear combination $\Gamma = \sum r_i \Gamma_i$ reduce $N$ equations thành 1. Soundness error $N/p$ (Schwartz-Zippel) |
| P2 | **Kế thừa từ IPAalmZK**: ZK của QESAZK hoàn toàn đến từ "almost ZK" trong IPAalmZK subprotocol |
| P3 | $[c_v] = [\mathbf{h}]\Gamma w$: uniquely determined sau khi V gửi $\Gamma$. Tất cả IPA messages tuân theo uniform-or-unique từ IPAalmZK |
| P4 | Kế thừa từ IPAalmZK: kernel constraints cho $r, s$ |

---

## Bức Tranh Lớn: Dlog ZK Argument Landscape

Lesson này là điểm nhìn lại toàn bộ hành trình. Từ Σstd đơn giản đến QESAZK, mọi bước đều được drive bởi một câu hỏi duy nhất: **"Làm sao giảm communication mà vẫn giữ ZK?"**

```
Σstd: O(n+m), perfect ZK
  │ [P1: batch m equations]
  ▼
LMPAbatch: O(n), ZK, eliminating m
  │ [P1: recursive batching, outer product]
  ▼
LMPAnoZK: O(log n), NOT ZK
  │ [P2: linear combination]
  ▼
LMPAZK: O(log n), ZK — [LINEAR relation ✓]
  
(Parallel track for QUADRATIC)
IPA_noZK: O(log n), NOT ZK
  │ [P2 + P4: linear combination + kernel constraints]
  ▼
IPAalmZK: O(log n), almost ZK
  │ [P1: batch N equations via random Γ]
  ▼
QESAZK: O(log n), almost ZK — [QUADRATIC relation ✓]
```

**Giới hạn trên của dlog setting**: Đây là QE — các relations **degree ≤ 2** trong witness. Không thể vượt quá degree 2 một cách tự nhiên vì nhóm abelian chỉ hỗ trợ linear operations.

---

## Tính Chất Đặc Trưng của Mỗi Protocol

| Protocol | Relation | ZK | Comm | Đặc điểm nổi bật |
|----------|----------|-----|------|-----------------|
| Σstd | Linear | Perfect | $O(n+m)$ | Cơ bản nhất, extractable vô điều kiện |
| LMPAbatch | Linear | Perfect | $O(n)$ | Commit-then-batch, adaptive |
| LMPAnoZK | Linear | ✗ | $O(\log n)$ | Recursive outer product, extraction $O(n\log n)$ |
| LMPAZK | Linear | Perfect | $O(\log n)$ | Linear combination of two LMPAnoZK |
| IPAalmZK | Quadratic | $\varepsilon$-stat | $O(\log n)$ | Kernel redundancy, "almost" ZK không tránh được |
| QESAZK | Quadratic | $\varepsilon$-stat | $O(\log n)$ | Adaptive, general QE > R1CS, modular |

---

## Tại sao "Almost ZK" không tránh được cho IPA?

Đây là điểm lý thuyết tinh tế nhất của course. Với **linear relation** $[A]w = [t]$, có thể đạt **perfect ZK** vì masking randomness $r$ uniform không phụ thuộc vào $w$. Với **quadratic relation** $\langle x, y \rangle = t$, masking $r$ cho $x$ phải thỏa $\langle r, y \rangle = 0$ — phụ thuộc vào secret $y$. Do đó $r$ không thể hoàn toàn independent với $(x, y)$.

Paper để ngỏ câu hỏi: *Liệu có thể đạt perfect ZK cho IPA trong dlog setting?* Đây là open problem tính đến 2019.

> [!question] Open Problems từ §1.2.5 và §2.4
>
> **Q1**: Liệu batching không có commitment (Question 3.7) có sound không? Nếu có, nhiều protocols là **proofs** (information-theoretic sound) thay vì arguments.
>
> **Q2**: Liệu có thể đạt **perfect ZK** cho inner product trong dlog setting (không chỉ "almost")?
>
> **Q3**: Liệu extraction từ $O(n/\log n)$ transcripts có khả thi không? (Conjectured optimal bound — Appendix D)
>
> **Q4**: Definition 2.17 (general position) có generalize well không? Paper có warning tại Caution 2.18.

---

## Kỹ Thuật P2 (Linear Combination): Chiều Sâu Hơn

Kỹ thuật P2 — linear combination of protocols — là **nguyên tắc thống nhất** của toàn bộ ZK conversions trong paper. Nhìn kỹ hơn:

**Pattern chung**: Cho một "non-ZK argument" $\Pi_0$ cho statement $(w)$, và một "trivial argument" $\Pi_1$ cho statement $(r)$ (nơi $r$ là uniform randomness), linear combination $(x_1, x_2)$ tạo argument cho $(x_1 w + x_2 r)$. Vì $x_2 \neq 0$ và $r$ uniform, response $x_1 w + x_2 r$ là uniform → ZK.

**Điều kiện cần thiết**: $\Pi_0$ và $\Pi_1$ phải có **cùng structure** (cùng số rounds, cùng loại messages) để linear combination có nghĩa. Đây là lý do paper cần hai LMPAnoZK instances có cùng kích thước.

**Non-randomized linear combination** (Protocols 4.1, 3.14, [Bün18]): Khi một trong hai trọng số cố định (không phải verifier random), không đạt extractability tự động — cần cẩn thận hơn. Đây là lý do "almost ZK" trong IPAalmZK.

> [!info] 🟡 Kết nối với Attema-Fehr-Klooß [Att22]
> Sau khi paper [HKR19] xuất bản, Attema, Fehr, và Klooß [Att22] formalize thêm việc áp dụng Fiat-Shamir transform cho multi-round interactive proofs sử dụng chính kỹ thuật linear combination này. Kết quả: mọi public-coin HVZK argument có thể compile thành NIZK với security tightly preserving. Đây là validation lý thuyết cho approach của [HKR19].
>
> *(theo [Att22]: Attema, Fehr, Klooß — Fiat-Shamir Transformation of Multi-Round Interactive Proofs, TCC 2022)*

---

## Tóm tắt Toàn Course

Bắt đầu từ Lesson 01, ta đã đi qua:

1. **Foundation** (L01): Setting, kernel assumptions, HVZK, 4 design principles — "alphabet"
2. **Testing Distributions** (L02): Framework phân tích soundness và extraction tightly — "analysis tools"
3. **Σstd + LMPAbatch** (L03): Building blocks cơ bản — "sentences"
4. **LMPAnoZK + LMPAZK** (L04): Pivot của course — reduce $O(n)$ → $O(\log n)$, add ZK — "complex sentences"
5. **IPAalmZK** (L05): Extend sang quadratic với "almost ZK" trade-off — "new language"
6. **QESAZK** (L06): Full argument cho QE — richer than R1CS, adaptive — "full expression"
7. **Range Proofs** (L07): Ứng dụng thực tiễn, benchmark — "putting it to work"
8. **Design Principles** (L08, **bài này**): Nhìn lại unified framework — "grammar of the language"

**Thông điệp cốt lõi của [HKR19]**: Các protocols hiệu quả trong dlog setting không magic — chúng đều xuất phát từ 4 kỹ thuật đơn giản được apply recursively và composably. Hiểu 4 kỹ thuật này là hiểu toàn bộ landscape.

---

## References

- [HKR19] Hoffmann, Klooß, Rupp — *Efficient ZK Arguments in the Discrete Log Setting, Revisited*, CCS 2019
- [Att22] Attema, Fehr, Klooß — *Fiat-Shamir Transformation of Multi-Round Interactive Proofs*, TCC 2022 (🟡 — P2 và Fiat-Shamir connection)
- [Boo16] Bootle et al. — *Efficient ZK Arguments for Arithmetic Circuits*, EUROCRYPT 2016 (🟡)
- [Bün18] Bünz et al. — *Bulletproofs*, S&P 2018 (🟡)
