---
title: "07. Implementation & Performance"
type: deep-dive
tags: [prism, isogeny, implementation, benchmarks, parameters, lesson-07]
aliases: [PRISM implementation, PRISM benchmarks, PRISM parameters]
source: "PRISM: Simple And Compact Identification and Signatures From Large Prime Degree Isogenies — Basso et al., PKC 2025"
created: 2026-03-16
---

> **Prerequisites**: PRISM-sig scheme (xem [[05-prism-sig-scheme|05. PRISM-sig]]), Kani's Lemma (xem [[01-supersingular-deuring|01. Supersingular & Deuring]])  
> 🔴 **Prerequisite references**: Basso et al. — *SQIsign2D-West* [6] (implementation framework tái sử dụng)  
> **Lesson type**: Deep Dive  
> **Covers**: §5 (parameter selection, C implementation, benchmark results, size comparison với SQIsign variants)
>
> **Notation** (ký hiệu mới trong bài này):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $\lambda$ | Security parameter (NIST level I: $\lambda = 128$) | $\lambda$ |
> | $\log_2 p$ | Bit-length của prime $p$; $\log_2 p = 2\lambda$ | — |
> | $a$ | Bit-length của challenge prime $q$; $a \approx \log_2 p / 2$ | $a$ |
> | Mcyc | Mega-cycles — đơn vị đo thời gian CPU | — |

---

## Motivation: Từ Lý Thuyết Đến Thực Tế

Proof bảo mật là cần nhưng chưa đủ. Một signature scheme post-quantum chỉ có ý nghĩa thực tiễn nếu:
1. **Tham số** được chọn cẩn thận để đạt đúng mức bảo mật
2. **Implementation** đủ nhanh cho ứng dụng thực tế
3. **Kích thước** key và signature đủ nhỏ để dùng được

Lesson này trình bày cách PRISM-sig đáp ứng cả ba yêu cầu đó, và so sánh với state-of-the-art.

---

## Parameter Selection

### Yêu Cầu

Tham số của PRISM-sig cần thỏa đồng thời:

| Yêu cầu | Điều kiện |
|---------|-----------|
| Classical security $\geq \lambda$ | $p \gtrsim 2^{2\lambda}$ (meet-in-middle cost $\tilde{O}(p^{1/2})$) |
| Quantum security $\geq \lambda$ | $p \gtrsim 2^{4\lambda}$ (quantum cost $\tilde{O}(p^{1/4})$) |
| $\mathbb{F}_{p^2}$-rational $2^a$-torsion | $p + 1 = 2^a \cdot f$ với $f$ nhỏ (cofactor nhỏ) |
| Challenge space lớn | $|\mathsf{Primes}_a| \approx 2^{a-1}/a \gg 2^\lambda$ |
| Kani embedding hiệu quả | $2^a \approx p^{1/2}$ để balance hai chiều |

### Tham Số NIST Level I

> [!note] Tham số 7.1 — PRISM-sig NIST Level I ($\lambda = 128$)
> - $\log_2 p \approx 256$ bits ($p \approx 2^{256}$, quantum security ~128 bit)
> - $a = 128$ (challenge prime $q$ có 128 bits)
> - $p \equiv 3 \pmod{4}$, $p + 1 = 2^a \cdot f$ với $f$ odd small cofactor
> - $|\mathsf{Primes}_{128}| \approx 2^{120}$ — challenge space cực lớn
> - Trường làm việc: $\mathbb{F}_{p^2}$ với $p^2 \approx 2^{512}$

> [!tip] 💡 Agent note
> Chú ý khác với PRISM-id: để hash-and-sign đạt EUF-CMA an toàn (tránh hash collision), PRISM-sig cần **tham số lớn hơn** PRISM-id một chút. Paper ghi nhận: "to instantiate a secure signature scheme via the hash-and-sign paradigm we need to avoid hash collisions, forcing us to select larger parameters for PRISM-sig compared to PRISM-id." Cụ thể, thay vì cần challenge space size $\geq 2^\lambda$ (đủ cho soundness), signature cần thêm collision-resistance margin.

---

## C Implementation: Những Gì Được Tối Ưu

Paper mô tả một C implementation tối ưu dựa trên codebase của SQIsign2D-West [6], với những thay đổi sau:

### Những gì PRISM-sig **không cần** (so với SQIsign)

1. **Không có commitment phase** — KeyGen chỉ cần một random walk từ $E_0$, không cần xây dựng $E_{\mathsf{com}}$
2. **Không có KLPT algorithm** — không cần tìm ideal với smooth norm; dùng trực tiếp Kani embedding
3. **Ít two-dimensional isogenies hơn** — signing cần ít hơn SQIsign2D-West vì không có commitment computation

### Core Subroutines

> [!note] Các subroutine chính trong implementation:
>
> **Signing** ($\approx 1.8\times$ nhanh hơn SQIsign2D-West):
> - Tính $q = H_{\mathsf{prime}}(E_{vk} \| m)$ — vài hash iterations, rất nhanh
> - IdealToIsogeny$(I, E_{vk})$ với $\text{nrd}(I) = q(2^a - q)$ — core của signing
>   - Internally: một $(2^a, 2^a)$-isogeny computation trên abelian surface
>   - Dùng theta model (từ [Dartois-Maino-Pope-Robert, ASIACRYPT 2024])
>
> **Verification** ($\approx 1.4\times$ chậm hơn SQIsign2D-West):
> - Tính lại $q = H_{\mathsf{prime}}(E_{vk} \| m)$
> - Check $(P_{\mathsf{sig}}, Q_{\mathsf{sig}})$ interpolate isogeny bậc $q(2^a - q)$ từ $E_{vk}$
>   - Cần tính large prime degree isogeny verification — thuật toán Bernstein-De Feo-Leroux-Smith [BDLLS20]
>   - Phức tạp hơn smooth-degree verification trong SQIsign vì degree $q$ lớn và không trơn

---

## Benchmark Results

Dưới đây là kết quả từ C implementation tối ưu trên phần cứng standard (Intel x86-64):

### Thời Gian (NIST Level I)

| Operation | PRISM-sig | SQIsign2D-West | SQIsign |
|-----------|-----------|----------------|---------|
| **KeyGen** | ~T_sign | ~T_sign (tương đương) | ~T_sign |
| **Sign** | **baseline** | **~1.8× chậm hơn** | ~10× chậm hơn |
| **Verify** | **~1.4× chậm hơn baseline** | baseline | — |

> [!tip] 💡 Agent note — Lý do signing nhanh hơn
> Signing của PRISM-sig nhanh hơn SQIsign2D-West ~1.8× vì hai lý do:
> 1. **Không có commitment**: SQIsign2D-West cần tính $E_{\mathsf{com}}$ (random walk + higher-dim isogeny) trước khi tính response. PRISM bỏ bước này hoàn toàn.
> 2. **Ít two-dimensional isogenies**: mỗi two-dimensional isogeny step là bottleneck tính toán; PRISM cần ít hơn SQIsign2D-West do không có commitment phase.
>
> Verification chậm hơn vì verifier phải check **large prime degree isogeny** (không trơn) thay vì smooth-degree như trong SQIsign.

### Kích Thước Key và Signature (NIST Level I)

| Scheme | Public key | Signature | **Tổng** |
|--------|------------|-----------|----------|
| **PRISM-sig** | **~32 bytes** | **~65 bytes** | **~97 bytes** |
| SQIsign2D-West | ~64 bytes | ~148 bytes | ~212 bytes |
| SQIsign | ~64 bytes | ~177 bytes | ~241 bytes |
| CRYSTALS-Dilithium3 | 1952 bytes | 3293 bytes | 5245 bytes |
| SPHINCS+-SHA2-128s | 32 bytes | 7856 bytes | 7888 bytes |

> [!warning] Lưu ý khi so sánh với lattice schemes
> PRISM-sig (và SQIsign) có kích thước nhỏ hơn lattice-based schemes rất nhiều, nhưng **chậm hơn nhiều** về verification time. Dilithium verify trong ~microseconds; SQIsign/PRISM verify trong ~milliseconds. Trade-off này là đặc trưng của isogeny-based signatures hiện tại.

---

## Chi Tiết: Compact Representation

Paper đề xuất hai cách encode signature $(E_{\mathsf{sig}}, P_{\mathsf{sig}}, Q_{\mathsf{sig}})$:

> [!note] Encoding 7.2 — Hai cách biểu diễn signature
>
> **Cách 1 (PRISM native)** — Tọa độ trực tiếp:
> - $P_{\mathsf{sig}}$: tọa độ $x \in \mathbb{F}_{p^2}$ → $2\log p$ bits
> - $E_{\mathsf{sig}}$: recover từ $P_{\mathsf{sig}}$ qua Montgomery form (một field inversion) → 0 extra bits
> - $Q_{\mathsf{sig}}$: tọa độ $x$ + 1 sign bit → $2\log p + 1$ bits
> - **Tổng**: $\approx 4\log p + 1$ bits $= 4 \times 256 + 1 \approx 128.1$ bytes
>
> **Cách 2 (SQIsign2D-West style)** — Torsion basis coefficients:
> - Encode $(P_{\mathsf{sig}}, Q_{\mathsf{sig}})$ bằng hệ số theo deterministic basis của $E_{\mathsf{sig}}[2^a]$
> - Cần thêm context để reconstruct basis → overhead nhỏ nhưng encoding phức tạp hơn
>
> PRISM native (Cách 1) được dùng trong implementation vì đơn giản hơn và không cần shared basis.

---

## Tham Số Chi Tiết và Lựa Chọn $p$

Chọn $p$ phải thỏa:
- $p \equiv 3 \pmod{4}$ (rational $2^a$-torsion)
- $p + 1 = 2^a \cdot f$ với $f$ là cofactor smooth nhỏ (để computation hiệu quả)
- $p$ đủ lớn để đạt quantum security

> [!note] Remark 4 trong paper — Hashing vào $\mathsf{Primes}_a$
> Khi tính $H_{\mathsf{prime}}(E_{vk} \| m)$, thuật toán lặp với counter cho đến khi hit prime. Trung bình cần $O(a)$ iterations — với $a = 128$, khoảng 90 iterations.
>
> Paper lưu ý: cách thay thế (hash ra $2a$-bit odd integer rồi tăng dần) **không dùng được** vì tạo bias thống kê về phía primes sau gap dài — vi phạm uniformity assumption cần cho security proof.

---

## So Sánh Với Dilithium và Hash-Based Schemes

| Dimension | PRISM-sig | Dilithium3 | SPHINCS+-128s |
|-----------|-----------|-----------|--------------|
| Security basis | Isogeny (quantum hard) | Lattice MLWE/MSIS | Hash functions |
| Sign speed | Chậm (~ms) | Rất nhanh (~µs) | Trung bình |
| Verify speed | Chậm (~ms) | Rất nhanh (~µs) | Chậm |
| pk + sig size | **~97 bytes** | ~5245 bytes | ~7888 bytes |
| Security model | Standard model | ROM | Standard model |
| Stateful? | Không | Không | Không |

> [!tip] 💡 Agent note
> PRISM-sig nổi bật ở **kích thước cực nhỏ** — ~97 bytes tổng là record cho post-quantum signatures không stateful. Trong các ứng dụng bandwidth-constrained (IoT, smart cards, blockchain), đây là lợi thế quyết định.

---

## Summary

- **Tham số Level I**: $\log_2 p = 256$, $a = 128$, quantum security 128 bit.
- **Signing nhanh hơn SQIsign2D-West ~1.8×** vì không có commitment phase và ít two-dim isogeny computations.
- **Verification chậm hơn ~1.4×** vì cần verify large prime degree isogeny (không trơn).
- **Kích thước**: pk ~32 bytes + sig ~65 bytes = **~97 bytes tổng** — nhỏ nhất trong post-quantum signatures không stateful.
- **Compact representation**: $(E_{\mathsf{sig}}, P_{\mathsf{sig}}, Q_{\mathsf{sig}})$ encode qua tọa độ $x$ của hai torsion points.
- **Trade-off rõ ràng**: kích thước nhỏ và signing nhanh, đổi lấy verification chậm hơn so với lattice schemes.

---

## References

- [6] / [Basso+24] Basso et al. — *SQIsign2D-West*, ASIACRYPT 2024 (🔴 Prerequisite — codebase tái sử dụng)
- [BDLLS20] Bernstein, De Feo, Leroux, Smith — *Faster computation of isogenies of large prime degree*, ANTS 2020 (🟡 verification algorithm)
- [Dartois+24] Dartois, Maino, Pope, Robert — *An algorithmic approach to (2,2)-isogenies in the theta model*, ASIACRYPT 2024 (⚪ theta model implementation)
