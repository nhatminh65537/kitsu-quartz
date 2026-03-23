---
title: "01. ZK Arguments in the Discrete Log Setting — Foundation"
type: foundation
tags: [zero-knowledge, discrete-log, sigma-protocol, pedersen-commitment, hvzk, lesson-01]
aliases: [ZKAoK Foundation, Discrete Log ZK Foundation]
source: "Efficient zero-knowledge arguments in the discrete log setting, revisited — Hoffmann, Klooß, Rupp, CCS 2019 / ePrint 2019/944"
created: 2026-03-15
---

> **Prerequisites**: Nhóm cyclic abelian và phép toán nhóm, discrete logarithm problem (DLP), Pedersen commitment (binding/hiding), Sigma-protocol cơ bản (commitment–challenge–response).  
> 🔴 **Prerequisite references**: Boneh–Shoup — *A Graduate Course in Applied Cryptography* (DLP và commitment); Groth-Kohlweiss [GK15] — Ideal Linear Commitment model (background cho §ILC).  
> **Lesson type**: Foundation  
> **Covers**: §1.1–1.3 (basic techniques, contribution overview, related work); §2.1 (matrix kernel assumptions, Pedersen commitments); §2.2 (interactive arguments, completeness, public coin, HVZK, Fiat–Shamir); Definitions 2.1–2.7.
>
> **Notation** (ký hiệu dùng xuyên suốt course):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $\kappa$ | Security parameter | $\kappa$ |
> | $\mathsf{negl}(\kappa)$ | Hàm negligible | $\mathsf{negl}$ |
> | $p$ | Số nguyên tố bậc của nhóm | $p$ |
> | $\mathbb{F}_p$ | Trường hữu hạn $\mathbb{Z}/p\mathbb{Z}$ | $\mathbb{F}_p$ |
> | $G$ | Nhóm cyclic abelian bậc nguyên tố $p$ | $\mathbb{G}$ (một số tài liệu khác) |
> | $[x]$ | Phần tử nhóm $x \cdot [1]$ (implicit representation) | $[x]$ — paper dùng ký hiệu additive ẩn |
> | $[1]$ | Generator cố định công khai của $G$ | $[1]$ |
> | $[A]$ | Ma trận phần tử nhóm $A_{ij} \cdot [1]$ | $[A]$ (bold) |
> | $\mathbf{w}$ | Witness vector $\in \mathbb{F}_p^n$ | $w$ |
> | $\mathsf{ck}$ | Commitment key | $\mathsf{ck}$ |
> | $\mathsf{crs}$ | Common Reference String | $\mathsf{crs}$ |
> | $P, V$ | Prover, Verifier | $P, V$ |
> | $\mathsf{st}, w$ | Statement và witness | $\mathsf{st}, w$ |

---

## Motivation

Zero-knowledge argument (of knowledge) — ZKAoK — cho phép một bên P (prover) thuyết phục bên kia V (verifier) rằng một statement là đúng và P biết một witness chứng minh điều đó, mà **không tiết lộ bất kỳ thông tin nào khác**. Ví dụ: chứng minh biết khóa bí mật của một ElGamal ciphertext mà không hé lộ nội dung giải mã.

Trong **discrete logarithm (dlog) setting** — nhóm cyclic bậc nguyên tố $p$ — các ZKAoK hiệu quả từng được xây dựng bởi Bootle et al. (EUROCRYPT '16, [Boo16]) và Bünz et al. (Bulletproofs, S&P '18, [Bün18]) với communication $O(\log n)$. Tuy nhiên cả hai chỉ handle ngôn ngữ **R1CS** (rank-1 constraint systems).

Paper [HKR19] làm ba việc chính:

1. **Hệ thống hóa** các kỹ thuật thiết kế nền tảng đang được dùng ngầm trong [Boo16], [Bün18] và nhiều công trình khác.
2. **Mở rộng** khả năng ngôn ngữ: thay vì R1CS, handle trực tiếp hệ **quadratic equations (QE)** tổng quát hơn — R1CS là trường hợp đặc biệt của QE.
3. **Phân tích định lượng chặt chẽ hơn** về extraction efficiency thông qua hai khái niệm mới: *testing distributions* và *short-circuit extraction*.

---

## Bức tranh kỹ thuật: Implicit Representation

Paper sử dụng **additive implicit representation** (giới thiệu từ [23]):

$$
[x] := x \cdot [1] \in G
$$

cho $x \in \mathbb{F}_p$ và generator công khai $[1] \in G$. Với vector/ma trận $A, B, C$ compatible trên $\mathbb{F}_p$:

$$
A[B]C := [ABC]
$$

Ký hiệu này rất gọn: thay vì viết $x \cdot G$ (multiplicative) hay $g^x$ (exponential), ta viết $[x]$. Mọi phép tính đều trong $\mathbb{F}_p$; chỉ kết quả cuối mới "lift" lên nhóm $G$.

> [!note] Tại sao cần implicit representation?
> Trong nhóm abelian, ta chỉ có thể làm các **linear operation** — tổng và scalar múltiplication. Implicit notation nhấn mạnh rằng $[A]$, $[B]$ chỉ là "linear commitments" đến $A, B$. Điều này giúp phân biệt rõ những gì có thể chứng minh trong setting này (linear và quadratic) với những gì không thể (cubic trở lên nếu không có cấu trúc đặc biệt).

---

## §2.1 — Matrix Kernel Assumption và Pedersen Commitment

### Hard Kernel Assumption

> [!note] Definition 2.1 — Hard Kernel Assumption
> Cho $G \leftarrow \mathsf{GrpGen}(1^\kappa)$. Cho $\mathcal{D}_{m,n}$ là distribution efficiently samplable trên $G^{m \times n}$.
>
> Ta nói $\mathcal{D}_{m,n}$ có **hard kernel assumption** nếu với mọi adversary PPT $\mathcal{A}$:
>
> $$
> \Pr\!\left[G \leftarrow \mathsf{GrpGen}(1^\kappa);\; [A] \leftarrow \mathcal{D}_{m,n};\; x \leftarrow \mathcal{A}(1^\kappa, G, [A]) \;:\; [A]x = \mathbf{0} \;\wedge\; x \neq \mathbf{0}\right] \leq \mathsf{negl}(\kappa)
> $$
>
> Tức là: khó tìm một **right kernel element** khác không của $[A]$.

**Quan hệ với dlog**: Kernel assumption **tổng quát hóa** dlog assumption. Cụ thể: nếu $[A] = [h, 1] \in G^{1 \times 2}$ thì $[A]x = 0$ khi $x = (1, -h)$ (trong additive notation), tức tìm được $x$ với $[A]x = 0$ ↔ tìm được dlog của $[h]$. Với $[A] = [\mathbf{g}] \in G^{1 \times (n+1)}$ được draw uniformly, breaking kernel assumption ↔ breaking dlog.

> [!tip] 💡 Agent note
> Paper [HKR19] dùng kernel assumption thay vì dlog assumption vì khi làm việc với ma trận $[B]$ được xây dựng từ $[A]$ (với một số cột bằng 0), kernel của $[B]$ có thể có phần tử đã biết. Kernel assumption với prior knowledge $V \leq \mathbb{F}_p^n$ xử lý đúng trường hợp này (Remark 2.2).

### Pedersen Commitment

Nếu $\mathcal{D}_{m,n}$ có hard kernel assumption, thì $[A] \leftarrow \mathcal{D}_{m,n}$ là một **commitment key** $\mathsf{ck}$. Commit to $w \in \mathbb{F}_p^n$:

$$
\mathsf{Com}_{\mathsf{ck}}(w) = [c] = [A] \cdot x \in G^m
$$

trong đó $x$ chứa cả $w$ lẫn randomness. Trường hợp chuẩn: $\mathsf{ck} = [\mathbf{g}] = [g_0, g_1, \ldots, g_n] \in G^{1 \times (n+1)}$ với commitment:

$$
[c] = \mathsf{Com}_{\mathbf{g}}(w; r) = r[g_0] + \sum_{i=1}^n w_i [g_i]
$$

- **Binding**: Breaking binding ↔ finding non-trivial kernel element của $[\mathbf{g}]$ ↔ breaking dlog.
- **Hiding**: Với $r \leftarrow \mathbb{F}_p$ uniform, $[c]$ phân phối uniformly trên $G$ — perfectly hiding.

---

## §2.2 — Interactive Arguments, HVZK, Fiat–Shamir

### Interactive Argument System

> [!note] Definition 2.3 + 2.4 — Interactive Argument & Completeness
> Một **interactive argument system** cho quan hệ $R$ là protocol giữa prover $P$ và verifier $V$.
>
> - Transcript của interaction: $\langle P(x), V(y) \rangle$ với output bit $b = 1$ (accept) hoặc $b = 0$ (reject).
> - **Completeness**: Với mọi $(st, w) \in R$, honest prover thuyết phục được honest verifier — $\Pr[b = 1] \geq 1 - \mathsf{negl}(\kappa)$. *Perfectly complete* khi $= 1$.
>
> Ngôn ngữ $L$ của $R$: $L = \{st \mid \exists w : (st, w) \in R\}$.

> [!note] Definition 2.5 — Public Coin
> Argument system là **public coin** nếu mọi challenge của $V$ đều independent với bất kỳ message hay state nào, và verdict của $V$ là hàm thuần túy của transcript $\mathsf{Verify}(\mathsf{tr})$.

### HVZK — Honest-Verifier Zero-Knowledge

> [!note] Definition 2.6 — $\varepsilon$-statistical HVZK
> $(P, V)$ là **HVZK** nếu tồn tại simulator $\mathsf{Sim}$ chạy trong expected polynomial time sao cho với mọi PPT adversary $\mathcal{A}$, hai phân phối sau **indistinguishable** (statistical distance $\leq \varepsilon$):
>
> - **Thực**: $\mathsf{crs} \leftarrow \mathsf{GenCRS}(1^\kappa)$; $(st, w) \leftarrow \mathcal{A}(\mathsf{crs})$; $\mathsf{tr} \leftarrow \langle P(st, w), V(st) \rangle$
> - **Simulated**: $\mathsf{crs} \leftarrow \mathsf{GenCRS}(1^\kappa)$; $(st, w) \leftarrow \mathcal{A}(\mathsf{crs})$; $\mathsf{tr} \leftarrow \mathsf{Sim}(st, \rho)$
>
> (Quy ước $\mathsf{tr} := \bot$ nếu $(st, w) \notin R$.)

**Tại sao chỉ HVZK?** Paper tập trung vào HVZK vì các transformer đơn giản từ HVZK → full ZK đã tồn tại cho public coin protocols: dùng **equivocable coin toss** để generate challenge, hoặc trong Random Oracle Model dùng **Fiat–Shamir** (§2.2.2).

**Fiat–Shamir heuristic** (§2.2.2): Trong ROM, một public coin argument có thể chuyển thành NIZK bằng cách tính mỗi challenge của $V$ như hash của transcript (và "context" bao gồm statement) tính đến thời điểm đó. Đây là cách biến LMPAZK và QESAZK thành non-interactive protocols trong practice.

> [!info] 🟡 Maurer's protocol framework
> Nhiều Σ-protocol trong discrete log setting — bao gồm Σstd trong §3.2 — là instantiation của framework tổng quát từ Maurer [Mau09] và Cramer-Damgård-Schoenmakers [CDS94], trong đó verifier chỉ gửi một random challenge và prover trả lời. Paper [HKR19] tổng quát hóa framework này lên multi-round protocols với nhiều loại challenge phức tạp hơn, nhưng vẫn giữ cấu trúc public coin.

---

## §1.1 — Bốn Kỹ Thuật Thiết Kế Nền Tảng

Đây là tổng hợp từ §1.1 — các nguyên tắc được paper hệ thống hóa lần đầu tiên.

### Kỹ thuật 1: Probabilistic Verification

**Ý tưởng**: Thay vì verify trực tiếp $[A]w = [t]$ (đắt), verifier gửi random $y \leftarrow \mathbb{F}_p$. Hai bên tính $\hat{A} = y^\top [A] \in G^{1 \times n}$ và $\hat{t} = y^\top [t] \in G$, rồi chỉ prove $[\hat{A}]w = [\hat{t}]$. Communication không còn phụ thuộc $m$ (số phương trình).

**Điều kiện**: Verification phải **linear** để tương thích với zero-knowledge — chỉ linear equations mới có thể "linearly combine" để đạt ZK.

### Kỹ thuật 2: Linear Combination of Protocols

**Ý tưởng cốt lõi**: Hai protocol riêng lẻ có thể **linearly combine** thành một protocol, tận dụng tính tuyến tính của computation trong nhóm abelian.

Xét Σstd (sẽ trình bày đầy đủ ở Lesson 03): prover gửi $[a]$, nhận challenge $(x_1, x_2)$, trả lời $z = x_1 w + x_2 r$.

```
Protocol A: gửi w trực tiếp      Protocol B: mask bằng r
  P --[a]--> V                      P --[a]--> V
  P <--x1--- V                      P <--x2--- V
  P --x1·w-> V                      P --x2·r-> V

Linear combination (x1, x2 ngẫu nhiên từ V):
  P --[a]--> V
  P <--(x1,x2)-- V
  P --x1·w + x2·r--> V
```

Kết quả: **zero-knowledge** (r mask hoàn toàn w khi $x_2 \neq 0$) **và extractable** (hai challenges độc lập cho phép recover w).

> [!tip] 💡 Agent note
> Đây là insight trung tâm của toàn bộ paper. Tất cả ZK compilations trong [HKR19] — từ LMPAZK đến QESAZK — đều dùng chiến lược này: run một "unmasked non-ZK argument" (Figure 1, trái), linearly combine với một argument cho "masking randomness" (Figure 1, giữa), thu được ZK argument (Figure 1, phải). Verifier cung cấp randomness $(x_1, x_2)$ để đạt extractability.

### Kỹ thuật 3: Uniform-or-Unique Responses

**Quy tắc**: Mọi message của prover phải thoả một trong hai điều kiện (để simulator có thể xây dựng transcript "ngược"):

- **Uniformly distributed**: conditioned trên tất cả messages *sau* nó (ví dụ: $z = x_1 w + x_2 r$ trong Σstd — khi biết $[a]$, $z$ uniform trên $\mathbb{F}_p^n$).
- **Uniquely determined**: từ challenges và messages sau (ví dụ: $[a] = [A]z - x_1[t]$ trong Σstd — biết $z, x_1, x_2$ thì $[a]$ xác định hoàn toàn).

**Simulator hoạt động ngược**: chọn các uniformly distributed messages, rồi tính ngược các uniquely determined messages.

### Kỹ thuật 4: Kernels and Redundancy

**Vấn đề**: Với các statements không linear (ví dụ: polynomial evaluation $f(x) = t$), đơn giản linearly combine không đủ — mask $g(X)$ phải thỏa $g(x) = 0$ mà $g = 0$ thì không còn random nữa.

**Giải pháp**: Thêm **redundancy** vào representation của witness. Thay vì commit đến $f_i$ trực tiếp, commit đến $(\alpha_i, \beta_i)$ với điều kiện $f_i = \alpha_i + \beta_i$. Bây giờ có thể chọn $\alpha_i \leftarrow \mathbb{F}_p$ và $\beta_i = f_i - \alpha_i$ — kernel của evaluation map không còn trivial.

> [!tip] 💡 Agent note
> Kỹ thuật này là lý do QESAZK (Lesson 06) dùng "almost ZK" thay vì "perfect ZK" cho inner product argument: thêm đủ redundancy để đạt uniform responses chỉ với logarithmically many random components.

---

## §1.2 — Contribution Overview (Bản đồ toàn course)

| Đóng góp | Lesson | Communication | Relation |
|----------|--------|--------------|---------|
| Σstd (revisited) | 03 | $O(n)$ | LMP |
| LMPAbatch | 03 | $O(n)$ indep. of $m$ | LMP |
| LMPAZK | 04 | $O(\log n)$ | LMP |
| IPAalmZK | 05 | $O(\log n)$ | IPA |
| QESAZK | 06 | $O(\log n)$ | QE |
| Shuffle $\Pi_{\text{shuffle}}$ | A0 | $O(\log N)$ | Shuffle |

So với Bulletproofs [Bün18] (Table 1 trong paper):

| System | Setup | Assumption | Communication | Native relation |
|--------|-------|-----------|--------------|----------------|
| SNARGs [Gro16] | Trusted | KoE | $O(1)$ | R1CS |
| Bulletproofs [Bün18] | CRS (transparent) | dlog | $O(\log n)$ | R1CS |
| **This work** | CRS (transparent) | dlog | $O(\log n)$ | **QE** |

**QE tổng quát hơn R1CS**: biểu diễn $\langle x, x \rangle = \sum x_i^2 = t$ bằng **1 QE equation**, nhưng bằng R1CS cần $n$ equations.

---

## §1.3 — Related Work

Ba nhóm công trình liên quan chính:

**Dlog setting & ILC**: [Boo16] (first $O(\log n)$ communication), [Bün18] (Bulletproofs — improved by 3x, commit-and-prove), [Gro+16] (và nhiều công trình sigma-protocol). [HKR19] nằm trong nhóm này, extend với QE.

**Knowledge assumptions**: SNARKs [Gro16], Sonic, PLONK — constant proof size nhưng cần trusted setup.

**PCPs/IOPs/MPC-in-the-head**: STARKs [Ben18] — quantum resistant, $O(\log^2 n)$ communication, nhưng proof size lớn hơn nhiều (ví dụ ~130KB so với <2KB của Bulletproofs cho $N = 10^6$).

> [!info] 🟡 Kernel assumptions (từ Morillo-Ràfols-Villar [MRV16])
> Definition 2.1 tổng quát hóa Matrix Diffie-Hellman và related assumptions từ [MRV16]. Trong đó, "right kernel" khác với công trình gốc (dùng left kernel), nhưng tương đương về mặt bảo mật. Sự tổng quát hóa này cho phép xử lý commitments với ma trận nhiều hàng ($m > 1$) và commitment keys không nhất thiết phải là vector $[\mathbf{g}]$ một hàng.
>
> *(theo [MRV16]: Morillo, Ràfols, Villar — The Kernel Matrix Diffie-Hellman Assumption, ASIACRYPT 2016)*

---

## Summary

- **Implicit notation** $[x] = x \cdot [1]$: mọi phép tính trong $\mathbb{F}_p$, "lift" lên $G$ ở cuối.
- **Hard kernel assumption**: tổng quát hóa dlog assumption cho ma trận; binding của Pedersen commitment tương đương breaking nó.
- **HVZK**: simulator (không biết witness) có thể reproduce transcript indistinguishably; chuyển sang full ZK qua equivocable coin toss hoặc Fiat–Shamir.
- **Bốn design principles**: probabilistic verification, linear combination of protocols, uniform-or-unique responses, kernels/redundancy — đây là "alphabet" của toàn bộ LMPAZK và QESAZK.
- **QE > R1CS**: general quadratic equations là ngôn ngữ tự nhiên trong dlog/ILC setting; R1CS chỉ là trường hợp đặc biệt.

---

## References

- [HKR19] Hoffmann, Klooß, Rupp — *Efficient ZK Arguments in the Discrete Log Setting, Revisited*, CCS 2019 / ePrint 2019/944
- [Boo16] Bootle et al. — *Efficient ZK Arguments for Arithmetic Circuits in the Discrete Log Setting*, EUROCRYPT 2016 (🟡 — Lesson 04)
- [Bün18] Bünz et al. — *Bulletproofs: Short Proofs for Confidential Transactions and More*, S&P 2018 (🟡 — Lesson 05, 06, 07)
- [MRV16] Morillo, Ràfols, Villar — *The Kernel Matrix Diffie-Hellman Assumption*, ASIACRYPT 2016 (🟡 — integrated above)
- [GK15] Groth, Kohlweiss — Ideal Linear Commitment model (🔴 Prerequisite background)
- [Gro16] Groth — *On the Size of Pairing-based Non-interactive Arguments*, EUROCRYPT 2016 (⚪)
- [Ben18] Ben-Sasson et al. — *Scalable Zero Knowledge with No Trusted Setup*, CRYPTO 2019 (⚪)
