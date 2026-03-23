---
title: "01. MPC/FHE/ZK Motivation and Multiplicative Complexity"
type: foundation
tags: [mimc, mpc, fhe, zk, snark, multiplicative-complexity, lesson-01]
aliases: [MiMC Motivation, Multiplicative Complexity]
source: "MiMC: Efficient Encryption and Cryptographic Hashing with Minimal Multiplicative Complexity — Albrecht, Grassi, Rechberger, Roy, Tiessen, ASIACRYPT 2016"
created: 2026-03-15
---

> **Prerequisites**: Finite field arithmetic cơ bản ($\mathbb{F}_{2^n}$, $\mathbb{F}_p$), khái niệm block cipher và hash function  
> 🔴 **Prerequisite references**: Menezes, van Oorschot, Vanstone — *Handbook of Applied Cryptography* [MVO96] (arithmetic nền)  
> **Lesson type**: Foundation  
> **Covers**: §1 (Introduction), §3.6 (Comparison Tables 1–2), §4.1 (Computation Cost Model)
>
> **Notation** (ký hiệu dùng xuyên suốt course):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $\mathbb{F}_q$ | Trường hữu hạn bậc $q$ (với $q = 2^n$ hoặc $q = p$ nguyên tố) | $F_q$, $GF(q)$ |
> | $\mathbb{F}_{2^n}$ | Trường nhị phân bậc $2^n$ | $F_{2^n}$, $GF(2^n)$ |
> | $\mathbb{F}_p$ | Trường nguyên tố bậc $p$ | $F_p$, $GF(p)$ |
> | minMULs | Số nhân trường tối thiểu để tính output | minMULs |
> | MULs/bit | Số nhân trung bình trên mỗi bit input | MULs/bit |
> | minANDs | Số cổng AND tối thiểu (cho cipher trên $\mathbb{F}_2$) | minANDs |
> | ANDs/bit | Số AND trung bình trên mỗi bit input | ANDs/bit |

---

## Motivation

### Một bài toán ít được chú ý

Cryptography hiện đại vượt xa ranh giới truyền thống của bảo mật và xác thực điểm-đến-điểm. Ba công nghệ đang thay đổi cách chúng ta nghĩ về tính toán tin cậy:

- **MPC** (Secure Multi-Party Computation): nhiều bên cùng tính một hàm $f(x_1, x_2, \ldots, x_n)$ mà không ai tiết lộ input của mình cho người khác
- **FHE** (Fully Homomorphic Encryption): tính toán trên dữ liệu được mã hóa mà không cần giải mã
- **ZK** (Zero-Knowledge Proofs): chứng minh sự kiện "tôi biết $x$ thỏa mãn $P(x)$" mà không tiết lộ $x$

Trong cả ba ứng dụng này, một tình huống lặp đi lặp lại: **phần circuit hoặc hàm đang được evaluate bao gồm một cryptographic primitive** — chẳng hạn PRF, block cipher, hoặc collision-resistant hash function.

Khi nhúng một primitive vào circuit MPC/FHE/ZK, chi phí không còn là thời gian CPU đơn thuần nữa. Cái quan trọng là **số lượng phép nhân** trong circuit. Lý do:

> Trong hầu hết các giao thức MPC/FHE/ZK, phép cộng trên trường là **"free"** (chi phí không đáng kể), còn phép nhân là bottleneck thực sự — mỗi phép nhân tương ứng với một gate tốn kém về communication hoặc computation.

### Vấn đề với các cipher hiện có

Các cipher phổ biến như **AES** hoạt động trên $\mathbb{F}_{2^8}$ với S-box phức tạp. Khi nhúng AES vào một circuit trên $\mathbb{F}_p$ (trường lớn, nền tảng của nhiều ZK-proof), phải encode toàn bộ bit-level operations của AES thành arithmetic operations trên $\mathbb{F}_p$ — cực kỳ đắt đỏ.

**LowMC** [ARS+15] — một cipher được thiết kế cho MPC/FHE — đi theo hướng tối thiểu số cổng AND (tương đương phép nhân trên $\mathbb{F}_2$). Nhưng:

> [!info] 🟡 LowMC [ARS+15]
> LowMC (Albrecht, Rechberger, Schneider, Tiessen, Zohner — EUROCRYPT 2015) là cipher thiết kế cho MPC/FHE bằng cách tối thiểu **multiplicative depth** và số AND gates. Round function gồm Sbox 3-bit, matrix multiplication trên $\mathbb{F}_2$, và key/constant addition (XOR). Mặc dù LowMC có rất ít AND gates, nó có rất nhiều XOR — và trong SNARK setting, số lượng XOR cực lớn làm LowMC không hiệu quả hơn AES.
>
> *(theo [ARS+15]: Albrecht et al. — Ciphers for MPC and FHE, EUROCRYPT 2015)*

Điều này dẫn đến một câu hỏi trung tâm của paper MiMC:

> **Câu hỏi**: Một block cipher hoặc hash function bảo mật trông như thế nào nếu chúng ta thiết kế nó để tối thiểu số phép nhân trên trường lớn $\mathbb{F}_{2^n}$ hoặc $\mathbb{F}_p$?

### SNARKs — ứng dụng chính thúc đẩy MiMC

**SNARK** (Succinct Non-interactive ARgument of Knowledge) là một loại ZK-proof đặc biệt được phát triển trong [BSCG+13]. SNARKs tìm được ứng dụng thực tế trong **Zerocash** [BCG+14] — một digital currency với anonymity mạnh.

> [!info] 🟡 SNARKs for C [BSCG+13]
> Ben-Sasson, Chiesa, Genkin, Tromer, Virza — CRYPTO 2013 đề xuất một SNARK system trong đó một circuit $C$ được biểu diễn dưới dạng hệ phương trình **R1CS** (Rank-1 Constraint System). Số ràng buộc $N_c$ trong R1CS tương đương số phép nhân trong circuit, và quyết định trực tiếp complexity của prover algorithm (dominated bởi $O(N_c \log N_c)$). Do đó, **tối thiểu số nhân = tối thiểu $N_c$ = tối thiểu thời gian prove**.
>
> *(theo [BSCG+13]: Ben-Sasson et al. — SNARKs for C, CRYPTO 2013)*

Khi implement SHA-256 trong SNARK để hash một block duy nhất, toàn bộ quá trình mất ~73ms. Paper MiMC báo cáo giảm xuống còn ~7.8ms — **cải thiện ~9×** — nhờ số nhân ít hơn nhiều.

---

## Metrics: Đo gì và tại sao

### Hai thế giới tính toán

Paper phân biệt rõ hai bối cảnh:

**Bối cảnh $\mathbb{F}_2$ (Boolean circuit)**  
Dùng cho các giao thức như Yao's garbled circuit. Đơn vị chi phí là cổng AND (multiplication over $\mathbb{F}_2$). XOR (cộng trên $\mathbb{F}_2$) là miễn phí.

| Metric | Ý nghĩa |
|--------|---------|
| minANDs | Số AND gates tối thiểu để tính output |
| ANDs/bit | Số AND trung bình trên mỗi bit input |

**Bối cảnh $\mathbb{F}_{2^n}$ hoặc $\mathbb{F}_p$ (arithmetic circuit)**  
Dùng cho SNARK, FHE, và nhiều MPC protocols native. Đơn vị chi phí là phép nhân trường (field multiplication). Phép cộng là miễn phí.

| Metric | Ý nghĩa |
|--------|---------|
| minMULs | Số nhân trường tối thiểu để tính output |
| MULs/bit | Số nhân trung bình trên mỗi bit input |

> [!warning] Chú ý quan trọng về metrics
> Một phép nhân trên $\mathbb{F}_{2^{1025}}$ đắt hơn đáng kể so với một phép nhân trên $\mathbb{F}_2$. Paper dùng hai metrics riêng biệt (minANDs và minMULs) vì hai bối cảnh này không so sánh trực tiếp được. Khi so sánh MiMC với các cipher Boolean như LowMC, phải cẩn thận về context.

### MiMC có lợi thế ở đâu

**So sánh cipher (Table 1 của paper):**

| Cipher | Security (bit) | minMULs | MULs/bit | Ghi chú |
|--------|---------------|---------|----------|---------|
| AES-128 | 128 | 800 | 6.25 | rep. trên $\mathbb{F}_{2^4}$ |
| SPRING | 128 | 576 | 4.5 | dựa trên LWE |
| Pohlig-Hellman | 128 | 3072 | ~1.5 | bảo mật từ DLP |
| **MiMC-129/129** | **129** | **82** | **0.64** | **paper này** |
| **MiMC-258/129** | **129** | **164** | **0.64** | **paper này** |

**So sánh hash function (Table 2 của paper):**

| Hash | Coll. Resist. | minMULs | MULs/bit |
|------|--------------|---------|----------|
| SWIFFTX | 112–256 | 16384 | 8.0 |
| **MiMCHash-256** | **129** | **1293** | **2.52** |
| **MiMCHash-256b** | **129** | **971** | **1.89** |

MiMC-129/129 có **0.64 MULs/bit** — ít hơn AES ~10×, ít hơn Pohlig-Hellman ~2.3×. Đây là kết quả đáng kể.

---

## Cost Model chi tiết (§4.1)

### Tại sao squaring không tính là multiplication?

Trong $\mathbb{F}_{2^n}$, squaring $x \mapsto x^2$ là một **phép toán tuyến tính** (Frobenius endomorphism). Do đó, nó không tốn kém như phép nhân thông thường — không cần tính là một "non-linear multiplication".

**Hệ quả trực tiếp**: Tính $x^3 = x^2 \cdot x$ cần đúng **1 phép nhân** (không phải 2), vì $x^2$ là miễn phí.

### Trong SNARK setting thì khác

Trong SNARK, mỗi **witness variable** (biến trung gian) phát sinh từ một field multiplication. Tính $x^3$ cần hai bước: $x \cdot x = y$ và $y \cdot x = x^3$ — tạo ra **2 rank-1 constraints**. Squaring mất tính tuyến tính.

> [!tip] 💡 Agent note
> Đây là lý do paper xét hai ngữ cảnh riêng: ở binary field thông thường, MiMC chỉ cần $r$ nhân cho $r$ rounds (mỗi round 1 nhân); trong SNARK setting, cần $2r$ constraints. Cả hai vẫn tốt hơn AES và LowMC, nhưng theo cơ chế khác nhau.

### Tại sao additions không bao giờ hoàn toàn miễn phí

Dù additions về lý thuyết là miễn phí, **số lượng rất lớn** XOR vẫn có thể thành bottleneck trong thực tế. LowMC là ví dụ điển hình: ít AND nhưng quá nhiều XOR khiến runtime thực tế tương đương hoặc tệ hơn AES trong SNARK setting (xem Table 3, §6.1).

---

## Summary

- MPC/FHE/ZK cần primitive hoạt động natively trên $\mathbb{F}_{2^n}$ hoặc $\mathbb{F}_p$ với **số nhân tối thiểu**.
- Cipher truyền thống (AES, SHA-256) không được thiết kế cho mục tiêu này — bottleneck trong SNARK context.
- LowMC [ARS+15] tối thiểu AND gates (trên $\mathbb{F}_2$) nhưng không phải multiplicative complexity trên trường lớn.
- **MiMC** đặt câu hỏi: nếu round function là $F(x) = x^3$ — đơn giản nhất có thể — cần bao nhiêu rounds để bảo mật? Và liệu số rounds đó có cạnh tranh không?
- Metric chính: minMULs và MULs/bit. MiMC-129/129 đạt **0.64 MULs/bit** — cải thiện đáng kể so với mọi alternative.
- Squaring tuyến tính trong $\mathbb{F}_{2^n}$ → $x^3$ chỉ cần **1 nhân** (ngoài SNARK); trong SNARK cần **2 constraints/round**.

---

## References

- [ARS+15] Albrecht, Rechberger, Schneider, Tiessen, Zohner — *Ciphers for MPC and FHE*, EUROCRYPT 2015 (🟡 Integrated)
- [BSCG+13] Ben-Sasson, Chiesa, Genkin, Tromer, Virza — *SNARKs for C*, CRYPTO 2013 (🟡 Integrated)
- [BCG+14] Ben-Sasson et al. — *Zerocash*, IEEE S&P 2014 (⚪ Context)
- [MVO96] Menezes, van Oorschot, Vanstone — *Handbook of Applied Cryptography*, 1996 (🔴 Prerequisite)
- [PH78] Pohlig, Hellman — *An improved algorithm...*, IEEE Trans. IT 1978 (⚪ Comparison)
