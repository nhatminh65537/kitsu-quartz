---
title: "Zero-Knowledge Proofs"
tags: [cryptography, zero-knowledge-proofs, zkp, index]
created: 2026-03-13
---

Bộ bài học về **Zero-Knowledge Proofs (ZKP)** — từ nền tảng lý thuyết đến các hệ thống SNARK/STARK hiện đại. Nội dung theo cấp độ Advanced, dùng Python + SageMath cho ví dụ code.

Xem lộ trình đầy đủ: [[00-roadmap|00. Roadmap]]

---

## Lessons

### Phần I — Nền tảng lý thuyết ZKP

- [[01-interactive-proofs-and-complexity|01. Interactive Proofs & Complexity]] — Mô hình prover-verifier, completeness, soundness, lớp IP/AM/PSPACE. Tại sao tương tác và ngẫu nhiên mở rộng sức mạnh chứng minh. Định lý IP = PSPACE (Shamir 1992).
- [[02-zk-definitions-and-simulator|02. ZK Definitions & Simulator Paradigm]] — View của verifier, transcript, simulator paradigm: ZK ⟺ tồn tại PPT simulator tái tạo view mà không cần witness. HVZK vs. full ZK. Ví dụ Graph Isomorphism (Perfect HVZK).
- [[03-perfect-statistical-computational-zk|03. Perfect, Statistical, Computational ZK]] — Statistical distance, computational indistinguishability. Ba mức độ ZK: PZK (phân phối đồng nhất), SZK (Δ ≤ negl), CZK (không PPT nào phân biệt). Quan hệ PZK ⊊ SZK ⊊ CZK. Định lý GMW: NP ⊆ CZK.
- [[04-proof-of-knowledge|04. Proof of Knowledge & Knowledge Soundness]] — Phân biệt "chứng minh tuyên bố" vs. "chứng minh biết witness". Knowledge extractor, kỹ thuật rewinding. Special soundness, Forking Lemma. ZK-PoK: kết hợp ZK và PoK không mâu thuẫn.
- [[05-sigma-protocols|05. Sigma Protocols]] — Cấu trúc 3-move (commit/challenge/response). Ba tính chất: completeness, SHVZK, special soundness. Schnorr (DL), Chaum-Pedersen (đẳng thức DL), Okamoto (linear combination). Framework tuyến tính tổng quát.
- [[06-sigma-compositions|06. Sigma Protocol Compositions]] — AND-composition (cùng challenge). OR-composition (CDS 1994): simulate transcript không biết witness, phân chia challenge. OR-of-n: nền tảng ring signatures. Equality of openings.
- [[07-commitment-schemes|07. Commitment Schemes]] — Hiding/binding và sự đánh đổi. Pedersen: perfectly hiding, computationally binding, homomorphic. Hash-based: perfectly binding. Vai trò trong ZKP và kết nối với polynomial commitments.
- [[08-fiat-shamir-and-nizk|08. Fiat-Shamir Transform & NIZK]] — Random Oracle Model. Fiat-Shamir: thay challenge bằng H(x, a). Strong vs. weak FS. Transcript completeness. Domain separation. Bảo mật trong ROM (rewind + reprogram). Định nghĩa NIZK.

### Phần II — Arithmetization & Công cụ Đa thức

- [[09-arithmetic-circuits-and-r1cs|09. Arithmetic Circuits & R1CS]] — Trường hữu hạn $\mathbb{F}_p$, arithmetic circuit (DAG với + và × gates), circuit satisfiability (NP-complete). R1CS: hệ ràng buộc $(A\mathbf{w}) \circ (B\mathbf{w}) = C\mathbf{w}$. Ví dụ: flatten $x^3 + x + 5 = 35$ thành 3 constraints.
- [[10-qap|10. Quadratic Arithmetic Programs]] — Lagrange interpolation, vanishing polynomial $Z_H$, Schwartz-Zippel Lemma. Biến đổi R1CS → QAP: encode constraints thành đa thức, kiểm tra bằng divisibility $Z_H \mid (A(X) \cdot B(X) - C(X))$. Nền tảng cho Groth16.
- [[11-multilinear-extensions-and-sumcheck|11. Multilinear Extensions & Sumcheck]] — Multilinear extension (MLE): duy nhất tồn tại cho mọi hàm $f:\{0,1\}^n \to \mathbb{F}_p$. Sumcheck protocol: $n$ rounds giảm đánh giá tổng $\sum_{\mathbf{x}} f(\mathbf{x})$ xuống một điểm. GKR protocol: verify layered circuit bằng sumcheck, verifier near-linear.
- [[12-iop-and-polynomial-commitments|12. Interactive Oracle Proofs & Polynomial Commitments]] — Mô hình IOP: prover gửi oracle (đa thức), verifier query tại điểm ngẫu nhiên. Compile PIOP → SNARK qua Fiat-Shamir + PCS. Định nghĩa formal PCS: Commit/Open/Verify, binding, hiding, succinctness. Ba họ PCS: KZG ($O(1)$ proof, trusted setup), FRI (transparent, $O(\log^2 d)$), IPA ($O(\log d)$, no setup).

### Phần III — Hệ thống ZKP Hiện đại

- [[13-kzg-and-pairings|13. KZG & Pairing-Based Polynomial Commitments]] — Bilinear pairing $e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$, SRS (Structured Reference String) với trusted setup. KZG: commit = $[f(\tau)]_1$ (1 group element), open = quotient polynomial proof, verify = 2 pairings. Security dưới $q$-SDH assumption. Batch opening.
- [[14-groth16|14. Groth16 — Kiến trúc & Ý tưởng]] — Kết hợp QAP + KZG + bilinear pairings. Proof: 3 group elements (~192B). Verification equation: $e(A, B) = e(\alpha, \beta) \cdot e(\text{pub}, \gamma) \cdot e(C, \delta)$. Circuit-specific trusted setup. Perfect ZK với blinding factors. SNARK nhỏ nhất hiện tại.
- [[15-plonk|15. PLONK & Universal SNARKs]] — Plonkish arithmetization: gate constraints (5 selectors) + copy constraints (wiring). Permutation argument: grand product check $\prod (w+\beta\cdot\mathsf{id}+\gamma)/(w+\beta\cdot\sigma+\gamma) = 1$. Universal KZG setup — một ceremony cho mọi circuit. Proof ~9 elements. Biến thể: Turbo-PLONK, Ultra-PLONK (lookups), Halo2 (IPA), Plonky2 (FRI).
- [[16-fri-and-starks|16. FRI & ZK-STARKs]] — Reed-Solomon codes, proximity testing. FRI folding: giảm đa thức bậc $k$ về hằng số qua $O(\log k)$ rounds. FRI như PCS: proof $O(\log^2 k)$ hashes, transparent. AIR arithmetization: execution trace + transition constraints. STARK = AIR + FRI + Fiat-Shamir. Không trusted setup, post-quantum safe.
- [[17-zkp-systems-comparison|17. So Sánh & Tổng Quan Hệ Thống ZKP]] — Bảng so sánh toàn diện: trusted setup, proof size, verify time, quantum safety. Decision tree chọn hệ thống. Xu hướng 2024–2026: folding schemes (Nova), zkVM (Risc Zero, SP1), Binius (binary fields), Circle STARKs. Tổng kết toàn bộ series.

---

## Notation Guide

| Ký hiệu | Ý nghĩa |
|---------|---------|
| $\lambda$ | Security parameter |
| $\text{negl}(\lambda)$ | Negligible function trong $\lambda$ |
| PPT | Probabilistic Polynomial-Time |
| $\langle P, V \rangle(x)$ | Transcript của interactive proof trên input $x$ |
| $\Pr[\cdot]$ | Xác suất |
| $\mathbb{F}_p$ | Trường hữu hạn modulo số nguyên tố $p$ |
| $\mathbb{G}$ | Nhóm cyclic (thường dùng trong các scheme dựa DLP) |
| $g$ | Generator của nhóm $\mathbb{G}$ |
| IP | Lớp ngôn ngữ có interactive proof |
| AM | Arthur-Merlin (public-coin interactive proof) |
| PSPACE | Ngôn ngữ quyết định được trong không gian đa thức |
| ZK | Zero-Knowledge |
| NIZK | Non-Interactive Zero-Knowledge |
| PoK | Proof of Knowledge |
| PCS | Polynomial Commitment Scheme |
| R1CS | Rank-1 Constraint System |
| QAP | Quadratic Arithmetic Program |
| IOP | Interactive Oracle Proof |

## Appendices

- [[a0-forking-lemma|A0. Forking Lemma — Formal Proof]] — Chứng minh đầy đủ General Forking Lemma (Bellare-Neven 2006): $\mathsf{frk} \geq \text{acc}(\text{acc}/q - 1/|\mathcal{C}|)$. Áp dụng cho Schnorr knowledge soundness trong ROM: hai transcripts với cùng commitment nhưng challenges khác nhau → extract discrete log.
- [[a1-bilinear-pairings-math|A1. Bilinear Pairings — Nền tảng Toán Học]] — Elliptic curve groups, torsion points, Weil pairing, Tate/Ate pairing. Embedding degree, pairing-friendly curves (BN254, BLS12-381). $q$-SDH assumption. Miller's Algorithm cho efficient pairing computation.
- [[a2-pcs-comparison|A2. So Sánh Polynomial Commitment Schemes]] — Bảng so sánh chi tiết KZG, FRI, IPA/Bulletproofs: asymptotic và concrete complexity (proof size, verify time, prover). Multilinear PCS variants (Hyrax, Dory, Binius). Hybrid PCS và xu hướng hiện đại.
