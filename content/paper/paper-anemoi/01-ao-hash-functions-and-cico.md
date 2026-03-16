---
title: "01. Arithmetization-Oriented Hash Functions and the CICO Problem"
type: foundation
tags: [anemoi, ao-hash, cico, zk-friendly, foundation, lesson-01]
aliases: [AO Hash Functions, CICO Problem, Arithmetization-Oriented]
source: "New Design Techniques for Efficient Arithmetization-Oriented Hash Functions: Anemoi Permutations and Jive Compression Mode — Bouvier, Briaud, Chaidos, Perrin, Salen, Velichkov, Willems, CRYPTO 2023 (ePrint 2022/840)"
created: 2026-03-15
---

> **Prerequisites**: Hash function (collision resistance, preimage resistance), finite field $\mathbb{F}_p$ và $\mathbb{F}_{2^n}$, đa thức trên trường hữu hạn, R1CS/Plonk constraint system (ở mức khái niệm)
> 🔴 **Prerequisite references**: Bertoni et al. — *Sponge Functions* [BDPV07] (sponge construction background); Groth — *Groth16* [Gro16] (R1CS proof system); Gabizon et al. — *Plonk* [GWC19] (Plonk arithmetization)
> **Lesson type**: Foundation
> **Covers**: §1 (Introduction, Contributions, Applications), §2.1–§2.4 (Notation, AO hash landscape, CICO problem, existing primitives)
>
> **Notation** (ký hiệu dùng trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{F}_q$ | Trường hữu hạn bậc $q$ ($q = p$ nguyên tố hoặc $q = 2^n$) |
> | $\mathbb{F}_p$ | Trường hữu hạn bậc nguyên tố $p$ lớn (characteristic lẻ) |
> | $\mathbb{F}_{2^n}$ | Trường nhị phân bậc $n$ (characteristic 2) |
> | $\alpha$ | Exponent của power-map S-box: $x \mapsto x^\alpha$ hoặc $x \mapsto x^{1/\alpha}$ |
> | $\lambda$ | Security parameter (bits) |
> | CICO | Constrained-Input Constrained-Output problem |
> | R1CS | Rank-1 Constraint System — arithmetization dùng trong Groth16 |
> | Plonk | Proof system dùng custom gate arithmetization |
> | $\mathsf{mult\_depth}$ | Multiplicative depth — số lần nhân liên tiếp trong một circuit |

---

## Motivation

Hash function là thành phần cơ bản của mọi hệ thống mật mã. Trong bối cảnh blockchain truyền thống (Bitcoin, Ethereum), SHA-256 hoặc Keccak hoạt động hiệu quả vì chúng được tối ưu cho binary gates trên phần cứng.

Tuy nhiên, các giao thức mật mã tiên tiến như **Zero-Knowledge proofs** (ZK-SNARK, ZK-STARK) đặt ra một yêu cầu hoàn toàn khác: hash function phải hiệu quả không phải trên binary hardware, mà trong **mạch đại số** — nghĩa là khi được biểu diễn dưới dạng hệ phương trình đa thức trên $\mathbb{F}_p$. Điều này dẫn đến một lớp hàm hash mới gọi là **Arithmetization-Oriented (AO) hash functions**.

Paper Anemoi [Bou+22/23] đề xuất một họ AO permutation mới, hiệu quả trên nhiều proof system đồng thời, cùng hai đóng góp thiết kế độc lập có thể tái dùng: S-box **Flystel** và mode hoạt động **Jive**.

---

## 1. Bối cảnh: Tại sao cần AO Hash Functions?

### 1.1 Vấn đề với hash function truyền thống trong ZK

Khi một prover muốn chứng minh "$\mathsf{hash}(x) = y$" trong một ZK proof system, toàn bộ computation của hàm hash phải được **arithmetize** — biểu diễn thành hệ ràng buộc đa thức mà proof system hiểu được. Với SHA-256, điều này cực kỳ tốn kém:

- SHA-256 dùng bitwise operations (AND, XOR, rotate) rất hiệu quả trên phần cứng nhưng cần **hàng nghìn ràng buộc** khi arithmetize trong R1CS.
- Keccak (SHA-3) tương tự — tối ưu trên binary, nhưng cực kỳ đắt trong $\mathbb{F}_p$.

### 1.2 Đặc điểm của một AO hash function tốt

Paper [Bou+22/23, §1] định nghĩa một AO hash function cần thỏa mãn:

> [!note] Định nghĩa 1.1 — Arithmetization-Oriented (AO) Hash Function
> Một hash function được gọi là **Arithmetization-Oriented** nếu hoạt động natively trên trường $\mathbb{F}_q$ với $q$ lớn (thay vì $\mathbb{F}_2$), và được thiết kế để **số lần nhân trên $\mathbb{F}_q$** (multiplicative complexity) là tối thiểu — cả trong forward evaluation lẫn trong constraint representation.
>
> **Tiêu chí cụ thể**:
> - Low multiplicative complexity trong mạch R1CS và Plonk
> - Hoạt động native trên trường mà proof system sử dụng (BLS12-381, BN-254, Goldilocks, v.v.)
> - Cung cấp bound tường minh chống lại các tấn công đại số (Gröbner basis, interpolation)

Nói cách khác: thay vì thiết kế hash tốt trên phần cứng rồi mới arithmetize, AO hash được thiết kế **ngay trong không gian arithmetization**.

---

## 2. Landscape: Các AO Primitives hiện có

Trước Anemoi, đã có một số AO hash được đề xuất. Paper [Bou+22/23, §2.4] đặt Anemoi trong bối cảnh cạnh tranh này:

### 2.1 MiMC [AGRRT16]

MiMC dùng S-box đơn giản nhất có thể: $x \mapsto x^3$ (hoặc $x^5$). Với $\alpha = 3$, đây là permutation trên $\mathbb{F}_p$ khi $\gcd(3, p-1) = 1$.

- **Ưu điểm**: Rất ít ràng buộc R1CS (chỉ cần 1 phép nhân để tính $x^3$).
- **Nhược điểm**: Số rounds cần thiết rất cao để đảm bảo an toàn, dẫn đến circuit sâu.

### 2.2 Rescue–Prime [AABDS20]

> [!info] 🟡 Rescue–Prime [AABDS20] — Aly, Ashur, Ben-Sasson, Dhooghe, Szepieniec
> Rescue–Prime dùng **hai S-box xen kẽ** trong mỗi round: $x \mapsto x^\alpha$ và $x \mapsto x^{1/\alpha}$.  
> Tính chất đặc biệt: cả hai đều là low-degree polynomial hoặc low-degree rational function trên $\mathbb{F}_p$, đảm bảo số ràng buộc R1CS nhỏ.  
> Vấn đề: việc xen kẽ $x^\alpha$ và $x^{1/\alpha}$ trong mỗi round khiến **từng round cần $\ell$ phép inversion** ($\ell$ = state width), tốn kém hơn dự kiến cho Plonk.  
> *(theo [AABDS20]: Aly et al. — Design of symmetric-key primitives for advanced cryptographic protocols, IACR ToSC 2020)*

### 2.3 Poseidon [GKRRS21]

> [!info] 🟡 Poseidon [GKRRS21] — Grassi, Khovratovich, Rechberger, Roy, Schofnegger
> Poseidon dùng cấu trúc **full-round** và **partial-round**. Các full round áp dụng S-box $x \mapsto x^\alpha$ lên toàn bộ state; các partial round chỉ áp dụng lên một phần tử. Điều này giảm tổng số phép nhân nhưng gây ra cấu trúc bất đối xứng.  
> Poseidon là **điểm tham chiếu chuẩn** cho Anemoi: paper [Bou+22/23, §8] báo cáo Anemoi cải thiện Poseidon khoảng **2× về R1CS** và **21–35% về Plonk constraints**.  
> *(theo [GKRRS21]: Grassi et al. — Poseidon: a new hash function for zero-knowledge proof systems, USENIX Security 2021)*

### 2.4 Griffin [GHR+22] và Reinforced Concrete [GKKS22]

Griffin cũng dùng cấu trúc lai tương tự Rescue/Poseidon. Reinforced Concrete dùng lookup tables kết hợp với arithmetic. Cả hai là đối thủ cạnh tranh đương thời nhưng không phải reference trực tiếp cho Anemoi.

### 2.5 So sánh tổng quan

| Primitive | S-box | R1CS (∝) | Plonk (∝) | Notes |
|-----------|-------|-----------|-----------|-------|
| MiMC | $x^3$ | Thấp | Trung bình | Nhiều rounds |
| Rescue–Prime | $x^\alpha / x^{1/\alpha}$ | Trung bình | Cao | $\ell$ inversions/round |
| Poseidon | $x^\alpha$ (partial) | Trung bình | Trung bình | Chuẩn hiện tại |
| **Anemoi** | **Flystel** | **Thấp (~2× Poseidon)** | **Thấp (~1.2–1.35× Poseidon)** | Multi-proof-system |

> [!tip] 💡 Agent note
> Bảng trên tổng hợp từ các con số báo cáo trong [Bou+22/23, §8]. Các tỷ lệ cụ thể phụ thuộc vào field size và cấu hình state width $\ell$. Benchmark chi tiết được phân tích trong [[08-performance-benchmarks|08. Performance & Benchmarks]].

---

## 3. The CICO Problem — Nền tảng bảo mật của AO hash

### 3.1 Tại sao CICO?

Trong proof systems, adversary kiểm soát một phần input và muốn kiểm soát một phần output tương ứng. Đây chính xác là bài toán mà security của AO permutation phải kháng cự được.

> [!note] Định nghĩa 3.1 — Constrained-Input Constrained-Output (CICO) Problem
> **Input**: Permutation $F : \mathbb{F}_q^t \to \mathbb{F}_q^t$, tham số $\ell$ với $1 \leq \ell < t$.
>
> **Goal**: Tìm $\mathbf{x} \in \mathbb{F}_q^t$ sao cho:
>
> $$
> \mathbf{x} \in \{0\}^\ell \times \mathbb{F}_q^{t-\ell} \quad \text{và} \quad F(\mathbf{x}) \in \{0\}^\ell \times \mathbb{F}_q^{t-\ell}
> $$
>
> Nói cách khác: $\ell$ tọa độ đầu tiên của input là $0$, và $\ell$ tọa độ đầu tiên của output cũng là $0$.
>
> **Trong paper**: tham số $\ell = 1$ cho hầu hết các instance thực tế.

### 3.2 CICO và bảo mật hash

Tại sao CICO lại quan trọng? Trong sponge construction, adversary kiểm soát **rate** (phần ngoài của state) và mục tiêu là ảnh hưởng đến capacity (phần trong). Cụ thể:

- **CICO $\Rightarrow$ không thể tạo collision**: Nếu $F$ kháng CICO thì adversary không thể chọn input tự do làm output rate = 0 (điều kiện cho collision trong nhiều mode).
- **CICO $\Rightarrow$ không thể preimage**: Adversary không thể dự đoán output từ input constrained.

> [!warning] Mối quan hệ CICO và hệ phương trình đại số
> Một cách tấn công tự nhiên: encode CICO thành hệ phương trình đa thức $\mathcal{P}$ rồi tính Gröbner basis. Độ khó của phương pháp này chính là số biến và degree của $\mathcal{P}$ — đây là lý do tại sao thiết kế S-box ảnh hưởng trực tiếp đến số rounds cần thiết.
>
> Phân tích chi tiết về Gröbner basis attacks được trình bày trong [[07-security-analysis-algebraic-attacks|07. Security Analysis]].

### 3.3 CICO so với các bài toán hardness khác

| Bài toán | Không gian | Mục tiêu |
|---------|-----------|---------|
| CICO | $\mathbb{F}_q^t$ | Tìm $(x, F(x))$ với $\ell$ tọa độ fixed |
| DLP | $\mathbb{G}$ | Tìm $k$ từ $g^k$ |
| Preimage | $\{0,1\}^*$ | Tìm $x$ từ $H(x) = y$ |
| Collision | $\{0,1\}^*$ | Tìm $x \neq x'$ với $H(x) = H(x')$ |

CICO là bài toán **đặc thù cho AO permutation** — không xuất hiện trong hash function truyền thống vì SHA-256 không có polynomial representation tự nhiên trên $\mathbb{F}_p$.

---

## 4. Arithmetization-Orientation và Proof Systems

### 4.1 R1CS (Rank-1 Constraint System)

R1CS — nền tảng của Groth16 — biểu diễn computation dưới dạng các ràng buộc:

$$
(\mathbf{a} \cdot \mathbf{w}) \times (\mathbf{b} \cdot \mathbf{w}) = (\mathbf{c} \cdot \mathbf{w})
$$

với $\mathbf{w}$ là witness vector. **Mỗi phép nhân** trong circuit = **một ràng buộc R1CS**. Do đó, số phép nhân trong F là metric quan trọng nhất.

Tính $x^{1/\alpha}$ trong Rescue–Prime cần $O(\log \alpha)$ phép nhân $\Rightarrow$ đắt hơn $x^\alpha$ đơn thuần.

### 4.2 Plonk Custom Gates

Plonk cho phép định nghĩa **custom gate** — ràng buộc phi tuyến phức tạp hơn, miễn là nó là đa thức bậc thấp. Điều này có nghĩa một S-box phức tạp hơn có thể được encode trong **ít gate hơn** nếu nó có cấu trúc đa thức đặc biệt.

Đây là cơ sở để Anemoi's Flystel S-box đạt performance tốt hơn Poseidon trên Plonk: Closed Flystel có degree thấp, cho phép encode hiệu quả trong custom gate.

> [!tip] 💡 Agent note
> Phân tích Plonk custom gate chi tiết cho Anemoi được trình bày trong [[08-performance-benchmarks|08. Performance & Benchmarks]]. Nội dung này nằm ngoài phạm vi paper gốc, được cover trong companion note eprint 2022/1487.

---

## 5. Tóm tắt & Cầu nối sang các bài tiếp theo

Landscape của AO hash functions:

- **Vấn đề**: hash function truyền thống quá đắt khi arithmetize trong ZK proof systems.
- **Giải pháp AO**: thiết kế hash native trên $\mathbb{F}_q$ với multiplicative complexity thấp.
- **Nền tảng bảo mật**: CICO problem — hardness của việc đồng thời kiểm soát input và output constrained của một permutation.
- **Landscape**: MiMC → Rescue–Prime → Poseidon → Griffin/Anemoi là quá trình tiến hóa hướng đến multi-proof-system efficiency.

Hai đóng góp kỹ thuật chính của Anemoi — Flystel S-box và Jive mode — sẽ được phân tích chi tiết trong:
- [[03-flystel-sbox|03. The Flystel S-Box]] — thiết kế S-box và CCZ-equivalence
- [[04-anemoi-permutation|04. The Anemoi Permutation]] — SPN construction đầy đủ

Trước đó, [[02-sponge-construction|02. Sponge Construction]] cung cấp nền tảng lý thuyết cho AnemoiSponge và hermetic sponge security model.

---

## References

- [Bou+22/23] Bouvier, Briaud, Chaidos, Perrin, Salen, Velichkov, Willems — *New Design Techniques for Efficient Arithmetization-Oriented Hash Functions: Anemoi Permutations and Jive Compression Mode*, CRYPTO 2023 / ePrint 2022/840
- [AGRRT16] Albrecht, Grassi, Rechberger, Roy, Tiessen — *MiMC: Efficient Encryption and Cryptographic Hashing with Minimal Multiplicative Complexity*, ASIACRYPT 2016
- [AABDS20] Aly, Ashur, Ben-Sasson, Dhooghe, Szepieniec — *Design of symmetric-key primitives for advanced cryptographic protocols*, IACR ToSC 2020 (🟡 Rescue–Prime)
- [GKRRS21] Grassi, Khovratovich, Rechberger, Roy, Schofnegger — *Poseidon: a new hash function for zero-knowledge proof systems*, USENIX Security 2021 (🟡 Poseidon)
- [GHR+22] Grassi et al. — *Griffin for Zero-Knowledge Applications*, ePrint 2022/403 (⚪ Context)
- [Gro16] Groth — *On the Size of Pairing-Based Non-Interactive Arguments*, EUROCRYPT 2016 (🔴 Prerequisite)
- [GWC19] Gabizon, Williamson, Ciobotaru — *Plonk: Permutations over Lagrange-bases for Oecumenical Noninteractive arguments of Knowledge*, ePrint 2019/953 (🔴 Prerequisite)
