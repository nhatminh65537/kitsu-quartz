---
title: "A2. So Sánh Polynomial Commitment Schemes"
tags: [cryptography, zero-knowledge-proofs, zkp, pcs, kzg, fri, ipa, appendix]
aliases: [PCS Comparison]
created: 2026-03-13
---

> **Tham chiếu từ**: [[12-iop-and-polynomial-commitments|12. IOP & Polynomial Commitments]]
> **Mục đích**: Bảng so sánh chi tiết và phân tích kỹ thuật của ba họ PCS chính: KZG, FRI/STARK, IPA/Bulletproofs.

---

## Tổng Quan Ba Họ PCS

Polynomial Commitment Schemes là building block cốt lõi của mọi SNARK hiện đại. Lựa chọn PCS quyết định:
- Proof size
- Verify time
- Prover time
- Trust assumptions
- Quantum safety

---

## KZG (Kate-Zaverucha-Goldberg)

### Đặc Điểm Kỹ Thuật

| | Giá trị |
|--|---------|
| **Giả định** | $q$-SDH (bilinear pairing) |
| **Trusted setup** | Universal, size $O(d)$ group elements |
| **Commit size** | 1 $\mathbb{G}_1$ element = 48B (BLS12-381) |
| **Proof size** | 1 $\mathbb{G}_1$ element = 48B |
| **Verify** | 2 pairing operations $\approx O(1)$ |
| **Prover** | $O(d)$ EC scalar mult |
| **Hiding** | Không (cần blinding) |
| **Quantum** | ✗ (EC DLP) |

### Khi Nào Dùng

- **On-chain verification** (Ethereum L1): proof nhỏ = ít gas
- **Groth16, PLONK, Marlin, Sonic**: tất cả dùng KZG
- Khi trusted setup chấp nhận được

### Biến Thể

| Biến thể | Điểm khác | Dùng trong |
|---------|----------|------------|
| KZG cơ bản | Univariate, một điểm | PLONK |
| KZG batch opening | Nhiều điểm, một proof | Ethereum blobs (EIP-4844) |
| KZG multipoint-multipolynomial | Nhiều poly, nhiều điểm | PLONK's 5th round |
| PST (multivariate KZG) | Multilinear polynomial | Spartan + KZG |
| Dory | Multilinear, $O(\log^2 d)$ verify | Hyrax, Spartan |

---

## FRI (Fast Reed-Solomon IOP)

### Đặc Điểm Kỹ Thuật

| | Giá trị |
|--|---------|
| **Giả định** | Collision-resistant hash (ROM) |
| **Trusted setup** | Không (transparent) |
| **Commit size** | 1 Merkle root = 32B |
| **Proof size** | $O(s \cdot \log^2 d)$ hashes; ~40–500KB |
| **Verify** | $O(s \cdot \log d)$ hash ops |
| **Prover** | $O(d \log d)$ field + hash ops |
| **Hiding** | Có thể (salt Merkle leaves) |
| **Quantum** | ✓ (hash-based) |

Với concrete parameters: $d = 2^{20}$, $s = 80$ repetitions, SHA-256:
- Proof: ~200KB
- Verify: ~10ms
- Commit: ~10ms

### FRI Rate Parameter

Rate $\rho = k/N$ ảnh hưởng trực tiếp đến proof size và soundness:

| Rate $\rho$ | Proof size | Query reps cho $2^{-128}$ | Note |
|------------|-----------|--------------------------|------|
| $1/2$ | Nhỏ nhất | Nhiều nhất | Proof per commit nhỏ |
| $1/4$ | Trung bình | Trung bình | Balance |
| $1/8$ | Lớn nhất | Ít nhất | Ít queries, proof per query lớn |

Tradeoff: rate nhỏ → soundness tốt hơn → ít reps → tổng proof nhỏ hơn (trong nhiều contexts).

### Khi Nào Dùng

- **Không thể có trusted setup**: permissionless, public
- **Post-quantum requirements**: long-term security
- **Computation có cấu trúc lặp**: execution traces (zkVM)
- **Large circuits**: prover đôi khi nhanh hơn KZG (hash vs. EC ops)

---

## IPA / Bulletproofs

### Ý Tưởng Cốt Lõi

IPA (Inner Product Argument) dựa vào Pedersen commitment: commit $f(X) = \sum a_i X^i$ bằng:
$$\mathsf{cm} = \sum_{i=0}^{d-1} a_i G_i + r H$$

trong đó $G_i, H$ là generators không có known discrete log relation.

> [!definition] Definition A2.1 — Pedersen Vector Commitment
>
> Cho generators $(G_0, \ldots, G_{d-1}, H) \in \mathbb{G}^{d+1}$. Commit đến vector $(a_0, \ldots, a_{d-1})$:
>
> $$\mathsf{cm} = \sum_{i=0}^{d-1} a_i G_i + r H \quad (r \xleftarrow{\$} \mathbb{F}_p, \text{ cho hiding})$$

Để open tại $z = (z^0, z^1, \ldots, z^{d-1})$ (evaluation at point $z$):

$$f(z) = \langle \mathbf{a}, \mathbf{z} \rangle = \sum a_i z^i$$

Đây là **inner product** giữa coefficient vector $\mathbf{a}$ và powers vector $\mathbf{z}$.

IPA protocol chứng minh inner product relation trong $O(\log d)$ rounds.

### Đặc Điểm Kỹ Thuật

| | Giá trị |
|--|---------|
| **Giả định** | Discrete Logarithm (không pairing) |
| **Trusted setup** | Không (chọn $(G_i)$ bằng hash-to-curve) |
| **Commit size** | 1 $\mathbb{G}$ element = 32B (Curve25519) |
| **Proof size** | $O(\log d)$ $\mathbb{G}$ elements $\approx 1$–10KB |
| **Verify** | $O(d)$ — tuyến tính! |
| **Prover** | $O(d)$ EC scalar mult |
| **Hiding** | Tự nhiên (Pedersen-based) |
| **Quantum** | ✗ (DLP) |

**Nhược điểm lớn**: verify $O(d)$ — không succinct. Với $d = 2^{20}$: verify ~10 triệu EC ops → vài giây.

### Cải Thiện: Bulletproofs và Halo

**Bulletproofs** (Bünz et al. 2017): cải thiện IPA cho range proofs — proof $O(\log n)$ nhưng verify $O(n)$.

**Halo/Halo2**: giải quyết verify overhead bằng **accumulation scheme**:
- Defer inner product checks sang "accumulator"
- Accumulators từ nhiều proofs được batch-verify cùng nhau
- Verify một batch: $O(d)$ một lần thay vì $O(d)$ mỗi proof

Halo2 trong Zcash Orchard: verify cost $O(d)$ nhưng được amortize qua batching.

### Khi Nào Dùng

- **Không thể trusted setup, không cần quantum** (DLP đủ)
- **Amortized verification**: batch nhiều proofs
- **Recursive**: Halo2 natural cho recursive composition
- **Range proofs nhỏ**: Bulletproofs hiệu quả

---

## Bảng So Sánh Đầy Đủ

### Asymptotic

| | KZG | FRI | IPA |
|--|-----|-----|-----|
| Setup | $O(d)$ $\mathbb{G}$ | $O(1)$ hash | $O(d)$ $\mathbb{G}$ |
| Commit | $O(d)$ $\mathbb{G}$ | $O(d \log d)$ hash | $O(d)$ $\mathbb{G}$ |
| Proof | $O(1)$ | $O(\log^2 d)$ | $O(\log d)$ |
| Verify | $O(1)$ pairings | $O(\log^2 d)$ hash | **$O(d)$** $\mathbb{G}$ |
| Assumption | $q$-SDH | CRHF | DL |

### Concrete (d = 2²⁰ ≈ 1M coefficients)

| | KZG | FRI ($\rho=1/4$, $s=80$) | IPA |
|--|-----|--------------------------|-----|
| Proof | **48B** | ~200KB | ~10KB |
| Verify | **~2ms** | ~10ms | ~minutes |
| Trusted setup | Universal, ~48MB | **None** | **None** |
| Post-quantum | **No** | **Yes** | No |

---

## Multilinear PCS Variants

Khi dùng với sumcheck (multilinear polynomials), cần multilinear PCS:

| PCS | Basis | Proof | Verify | Notes |
|-----|-------|-------|--------|-------|
| **PST / KZG multilinear** | KZG | $O(n)$ $\mathbb{G}$ | $O(n)$ pairings | SRS $O(2^n)$ |
| **Hyrax** | Pedersen | $O(\sqrt{n})$ $\mathbb{G}$ | $O(\sqrt{n})$ $\mathbb{G}$ | Compact |
| **Dory** | Pairing | $O(\log^2 n)$ | $O(\log^2 n)$ pairings | Uniform SRS |
| **FRI multilinear** | Hash | $O(\log^2 2^n)$ | $O(\log^2 2^n)$ | Transparent |
| **Binius** | Binary field | Small | Fast | 2023, new |

$n$ = số biến của multilinear polynomial (circuit với $2^n$ inputs).

---

## Chọn PCS Theo Ứng Dụng

| Ứng dụng | Lựa chọn | Lý do |
|---------|----------|-------|
| Ethereum L1 SNARK | KZG | Proof nhỏ, verify nhanh, gas |
| zkEVM với trusted setup | PLONK + KZG | Universal, flexible |
| zkEVM transparent | STARK + FRI | Không setup, post-quantum |
| Zcash-style privacy | Halo2 + IPA | Recursive, no setup |
| General zkVM | FRI | Fast prover, transparent |
| Academic / new schemes | IPA | Dễ tích hợp, flexible |
| Post-quantum priority | FRI hoặc Binius | Hash-based |
| Long-term blockchain | FRI | Quantum safe, no setup |

---

## Xu Hướng: Hybrid PCS

Nhiều hệ thống mới dùng **hybrid PCS** — kết hợp nhiều scheme:

**Hyperplonk + Orion**: FRI cho outer commitment, sumcheck cho inner product.

**Plonky2**: FRI nhưng dùng field nhỏ (Baby Bear, 31-bit) → native hash rất nhanh.

**Nova + IPA**: folding scheme với IPA cho accumulation, không cần trusted setup.

**Groth16 + STARK**: Groth16 verify STARK proof → nhỏ proof + transparent prover.

---

## References

- Kate, Zaverucha, Goldberg — *Constant-Size Commitments to Polynomials* (2010) — ASIACRYPT (KZG gốc)
- Ben-Sasson et al. — *Fast Reed-Solomon IOP of Proximity* (2018) — ICALP (FRI gốc)
- Bünz et al. — *Bulletproofs: Short Proofs for Confidential Transactions and More* (2018) — IEEE S&P (IPA/Bulletproofs)
- Wahby et al. — *Doubly-Efficient zkSNARKs Without Trusted Setup* (2018) — IEEE S&P (Hyrax)
- Lee — *Dory: Efficient, Transparent arguments for Generalised Inner Products* (2021) — TCC (Dory)
- Ben-Sasson et al. — *Binius: highly efficient proofs over binary tower fields* (2023) — ePrint 2023/1784
- Bowe, Grigg, Hopwood — *Recursive Proof Composition without a Trusted Setup* (2019) (Halo)
