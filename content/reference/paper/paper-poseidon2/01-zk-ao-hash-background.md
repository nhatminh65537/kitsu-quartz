---
title: "01. ZK Proof Systems and AO Hash Functions"
type: foundation
tags: [poseidon2, zk-proof, arithmetization, ao-hash, lesson-01]
aliases: [ZK Hash Background, AO Hash Functions]
source: "Poseidon2: A Faster Version of the Poseidon Hash Function — Grassi, Khovratovich, Schofnegger, AFRICACRYPT 2023"
created: 2026-03-15
---

> **Prerequisites**: Finite field $\mathbb{F}_p$ (phép tính cộng, nhân, nghịch đảo), hash function cơ bản (collision resistance, preimage resistance), khái niệm polynomial cơ bản  
> 🔴 **Prerequisite references**: Ben-Sasson et al. — *SNARKs for C* [BCGGMTV14]; Ben-Sasson et al. — *Scalable zero knowledge with no trusted setup* [BBHR19] (STARKs)  
> **Lesson type**: Foundation  
> **Covers**: §1 (Introduction, Contributions), §2 (Notations, ZK Proof Systems, Arithmetization)
>
> **Notation** (ký hiệu dùng xuyên suốt course):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $\mathbb{F}_p$ | Finite field với $p$ là số nguyên tố | $\mathbb{F}_p$ |
> | $\mathbb{F}_p^t$ | Vector space chiều $t$ trên $\mathbb{F}_p$ | $\mathbb{F}_p^t$ |
> | $n$ | Bit-length của $p$, tức $n = \lceil \log_2 p \rceil$ | $n$ |
> | $t$ | State size (số phần tử trong state) | $t$ |
> | $R_F$ | Số full rounds (external rounds) | $R_F$ |
> | $R_P$ | Số partial rounds (internal rounds) | $R_P$ |
> | $\alpha$ | Bậc của S-box, $\gcd(\alpha, p-1) = 1$ | $\alpha$ |
> | $\lambda$ | Security parameter (bit) | $\lambda$ |
> | SPN | Substitution-Permutation Network | SPN |

---

## Motivation

Trong vài năm gần đây, các hệ thống chứng minh zero-knowledge (zero-knowledge proof — ZKP) đã trở thành nền tảng của nhiều ứng dụng blockchain và cryptographic protocol quan trọng: từ Zcash, Mina Protocol, StarkNet đến các hệ thống rollup Layer 2. Điểm chung của hầu hết các ZKP hiệu năng cao là chúng phải **arithmetize** tính toán — tức là biểu diễn bất kỳ phép tính nào dưới dạng một hệ các đa thức trên $\mathbb{F}_p$.

Vấn đề: hash function truyền thống như SHA-256 hay Keccak được tối ưu cho phần cứng thông thường, sử dụng nhiều phép XOR, AND, bitwise shift. Tất cả các phép này, khi biểu diễn trong ZK circuit, tạo ra **hàng triệu constraint** — khiến chi phí proving tăng vô tội vạ.

Giải pháp là thiết kế **arithmetization-oriented (AO) hash functions** — những hash function được xây dựng natively trên $\mathbb{F}_p$, với số constraint tối thiểu khi được arithmetize. Poseidon là một trong những AO hash function thành công nhất, và Poseidon2 là phiên bản được tối ưu thêm.

---

## Zero-Knowledge Proof Systems (§2.2)

### Định nghĩa cơ bản

Một **zero-knowledge proof system** cho phép một prover $P$ thuyết phục một verifier $V$ rằng $P$ biết một witness $w$ thỏa mãn quan hệ $\mathcal{R}(x, w) = 1$, mà không tiết lộ bất kỳ thông tin gì về $w$ ngoài sự tồn tại của nó.

Trong ngữ cảnh **computational integrity**: prover muốn chứng minh rằng một phép tính $f(x) = y$ được thực hiện đúng — không nhất thiết phải giấu input/output, chỉ cần chứng minh tính đúng đắn mà không yêu cầu verifier chạy lại toàn bộ tính toán.

Các loại ZKP chính được đề cập trong paper:

**SNARKs** (Succinct Non-interactive ARguments of Knowledge): proof ngắn gọn, verify nhanh, thường cần trusted setup. Ví dụ: Groth16, PLONK.

**STARKs** (Scalable Transparent ARguments of Knowledge): không cần trusted setup, proof lớn hơn nhưng post-quantum secure. Ví dụ: StarkWare.

**Bulletproofs**: không cần trusted setup, proof size logarithmic, nhưng verify chậm hơn SNARK.

### Hash functions trong ZKP

Trong ZKP, hash function xuất hiện ở nhiều vai trò:
- **Merkle tree**: cam kết (commit) đến một tập dữ liệu lớn — đây là use case chính của Poseidon2
- **Commitment scheme**: ẩn và ràng buộc một giá trị
- **Pseudo-random function**: sinh round constants, challenges
- **Recursive proof composition**: hash digest của một proof được dùng làm input cho proof tiếp theo

Chi phí dominant trong ZKP thường là **chứng minh preimage** của hash function — tức là chứng minh "tôi biết $x$ sao cho $H(x) = y$" mà không tiết lộ $x$. Đây là lý do tại sao chi phí constraint của hash function ảnh hưởng trực tiếp đến tổng chi phí của toàn bộ ZK protocol.

---

## Arithmetization (§2.3)

Arithmetization là quá trình biến đổi một chương trình/tính toán thành một hệ phương trình đa thức. Có hai format chính quan trọng cho Poseidon2:

### R1CS (Rank-1 Constraint System)

Trong R1CS, mỗi constraint có dạng:

$$
(\mathbf{a} \cdot \mathbf{z}) \cdot (\mathbf{b} \cdot \mathbf{z}) = (\mathbf{c} \cdot \mathbf{z})
$$

trong đó $\mathbf{z}$ là vector các biến (input, output, intermediate), và $\mathbf{a}, \mathbf{b}, \mathbf{c}$ là vector hệ số. Mỗi phép nhân $u \cdot v = w$ tạo ra **một constraint**. Phép cộng và nhân với hằng số **miễn phí** (không tốn constraint).

Với SHA-256, mỗi AND gate là một phép nhân → hàng chục nghìn constraint chỉ cho một hash call. Với AO hash function dùng S-box $x^\alpha$, một lần S-box tốn $\lceil \log_2 \alpha \rceil$ constraint (chain of squarings + multiplications).

### Plonk / Plonkish Arithmetization

> [!info] 🟡 Plonk (theo [PGWZS19]: Gabizon, Williamson, Ciobotaru — PLONK, 2019)
> Plonk là một SNARK không cần trusted setup theo từng circuit, dùng một **universal structured reference string (SRS)** có thể tái dùng. Mỗi gate trong Plonk có dạng:
>
> $$
> q_L \cdot a + q_R \cdot b + q_O \cdot c + q_M \cdot a \cdot b + q_C = 0
> $$
>
> trong đó $a, b, c$ là các wire, $q_L, q_R, q_O, q_M, q_C$ là selector polynomials. Một **multiplication gate** ($q_M \neq 0$) là đơn vị chi phí cơ bản.
>
> *(theo [PGWZS19]: Gabizon, Williamson, Ciobotaru — PLONK: Permutations over Lagrange-bases for Oecumenical Noninteractive arguments of Knowledge, 2019)*

**Điểm mấu chốt**: trong Plonk, phép cộng tuyến tính (linear combination) không tốn multiplication gate nếu được implement khéo. Đây là lý do tại sao Poseidon2 có thể tiết kiệm constraint bằng cách thiết kế linear layer với cấu trúc đặc biệt — thay vì nhân ma trận dày đặc (cần $t^2$ phép nhân), dùng ma trận có structure cho phép tính bằng phép cộng.

Nói cách khác: với Plonk, **số multiplication gates** (không phải tổng số gates) là metric quan trọng nhất. Linear operations trên Plonk có thể gần như "miễn phí" nếu được thiết kế đúng.

---

## Arithmetization-Oriented Hash Functions (§1)

### Định nghĩa

Một **arithmetization-oriented (AO) hash function** là hash function được thiết kế để hoạt động natively trên $\mathbb{F}_p$ và có số constraint tối thiểu trong một (hoặc nhiều) arithmetization scheme.

**Yêu cầu thiết kế cạnh tranh**:

| Yêu cầu | Chi tiết |
|---------|---------|
| Security | Collision/preimage resistance đạt $\lambda$ bits |
| Số constraints thấp | Ít multiplication gates trong Plonk/R1CS |
| Plain performance cao | Nhanh khi chạy ngoài ZK circuit (e.g., Merkle tree native) |
| Đơn giản, tham số hóa được | Dễ instantiate cho nhiều field $p$ khác nhau |

### Landscape của AO hash functions

Tại thời điểm Poseidon2 ra đời (2023), các AO hash function chính bao gồm:

| Primitive | S-box | Đặc điểm | Weakness |
|-----------|-------|----------|----------|
| **MiMC** | $x^3$ | Rất đơn giản | Nhiều rounds, plain perf kém |
| **Poseidon** | $x^\alpha$ | HADES design, partial rounds | Linear layer dày đặc, plain perf kém |
| **Rescue/Rescue-Prime** | $x^\alpha$ và $x^{1/\alpha}$ | Không cần ROM assumption | Chậm trong circuit |
| **Griffin** | Non-standard | Nhanh, nhưng phức tạp | Attack surface lớn hơn |
| **Anemoi** | Jive compression | Rất hiệu quả Plonk | Phức tạp hơn Poseidon |
| **Poseidon2** | $x^\alpha$ (HADES) | Linear layers mới | — (đây là điểm focus) |

### Đóng góp chính của Poseidon2 (§1.1)

Paper [GKS23] đề xuất ba đóng góp:

**Đóng góp 1 — Hai linear layers mới $M_E$ và $M_I$**: thay thế MDS matrix dày đặc $t \times t$ của Poseidon bằng hai ma trận có cấu trúc đặc biệt, giảm số phép nhân trong linear layer lên đến **90%** và số Plonk constraint lên đến **70%**.

**Đóng góp 2 — Compression function mode**: Poseidon chỉ hỗ trợ sponge mode. Poseidon2 bổ sung một **compression function mode** — nhận nhiều input, tạo output cố định bằng một permutation call — đặc biệt hiệu quả cho Merkle tree.

**Đóng góp 3 — Fix algebraic attack**: một attack mới (Sauer [ABM23]) phát hiện lỗ hổng trong security argument của HADES. Paper đề xuất một sửa đổi đơn giản để cả Poseidon và Poseidon2 đều an toàn trước attack này.

> [!tip] 💡 Agent note
> Paper nhấn mạnh rằng Poseidon2 **không** sửa đổi Poseidon gốc (Remark 1 trong §5.1). Poseidon2_π là một permutation mới, độc lập — người dùng có thể dùng cả hai song song. Sự tương đồng cao với Poseidon gốc có nghĩa là Poseidon2 "kế thừa" phần lớn kết quả cryptanalysis của cộng đồng đã làm trên Poseidon trong nhiều năm qua.

---

## Summary

- **ZK proof systems** (SNARK, STARK) đòi hỏi arithmetization: biểu diễn tính toán dưới dạng đa thức trên $\mathbb{F}_p$. Chi phí chính là số multiplication gates/constraints.
- **Hash function truyền thống** (SHA-256, Keccak) cực kỳ đắt trong ZK circuit vì phụ thuộc vào bitwise operations.
- **AO hash functions** hoạt động natively trên $\mathbb{F}_p$, minimizing constraints. Poseidon là AO hash phổ biến nhất (dùng trong Zcash, Mina, nhiều L2).
- **Poseidon2** tối ưu Poseidon bằng linear layers mới ($M_E$, $M_I$), giảm 90% phép nhân trong linear layer và thêm compression function mode cho Merkle tree.
- **Plonk arithmetization**: linear operations gần như "miễn phí" nếu thiết kế đúng — đây là lý do tại sao cấu trúc của $M_E$/$M_I$ có tác động lớn đến số constraint.

---

## References

- [GKS23] Grassi, Khovratovich, Schofnegger — *Poseidon2: A Faster Version of the Poseidon Hash Function*, AFRICACRYPT 2023
- [GKR+21] Grassi, Khovratovich, Rechberger, Roy, Schofnegger — *POSEIDON: A New Hash Function for Zero-Knowledge Proof Systems*, USENIX Security 2021 (🔴 Prerequisite)
- [PGWZS19] Gabizon, Williamson, Ciobotaru — *PLONK: Permutations over Lagrange-bases for Oecumenical Noninteractive arguments of Knowledge*, 2019 (🟡 Integrated)
- [BCGGMTV14] Ben-Sasson et al. — *SNARKs for C: Verifying Program Executions Succinctly and in Zero Knowledge*, CRYPTO 2014 (🔴 Prerequisite)
- [BBHR19] Ben-Sasson et al. — *Scalable, transparent, and post-quantum secure computational integrity*, 2019 (🔴 Prerequisite)
- [Griffin22] Grassi et al. — *A New Feistel Approach Meets Fluid-SPN: Griffin for Zero-Knowledge Applications*, CRYPTO 2023 (⚪ Citation only)
- [Anemoi22] Bouvier et al. — *New Design Techniques for Efficient AO Hash Functions: Anemoi*, 2022 (⚪ Citation only)
