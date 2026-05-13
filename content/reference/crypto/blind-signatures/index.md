---
title: "Blind Signatures"
type: index
tags: [crypto, blind-signature, index]
created: 2026-05-13
---

**Blind signature** là một primitive cho phép một user nhận chữ ký từ signer trên một message mà signer không biết nội dung message đó — đảm bảo anonymity của user. Course này trình bày các scheme chính, phân tích bảo mật chính thức, và các attack hiện đại từ góc nhìn CTF.

**Roadmap**: [[00-roadmap|00. Roadmap]]

---

## Lessons

### [[01-blind-signature-definition-security-models|01. Blind Signature: Definition & Security Models]]

Định nghĩa syntax của blind signature (KeyGen, giao thức Blind/Sign/Unblind, Verify), correctness, và hai security property cốt lõi: **Blindness** (Signer không link được session với chữ ký cuối) và **OMUF** (không forge nhiều hơn số session). Phân biệt sequential vs. concurrent OMUF, giới thiệu ROM và AGM.

### [[02-chaum-rsa-blind-signature|02. Chaum RSA Blind Signature]]

Scheme blind signature đầu tiên (Chaum 1983) dựa trên **multiplicative homomorphism của RSA**: blinding factor $r$ cho phép User làm mờ message bằng $\hat{m} = H(m) \cdot r^e \bmod N$. Perfect blindness (bijection của $r \mapsto r^e$). OMUF concurrent dưới **ct-RSA assumption** (non-standard, BNPS 2003).

### [[03-schnorr-blind-signature|03. Schnorr Blind Signature]]

Blind signature 3-move từ Schnorr identification. Blinding transform $(\alpha, \beta)$: $R' = g^\alpha R X^\beta$, $c = c' - \beta$, $s' = s + \alpha$. Perfect blindness. Sequential OMUF dưới DL in ROM (Forking Lemma). Concurrent OMUF bị phá bởi ROS attack.

### [[04-okamoto-schnorr-blind-signature|04. Okamoto-Schnorr Blind Signature]]

Mở rộng Schnorr với **hai secret key** $(r, s)$ và **witness indistinguishability**: mỗi public key $y = g^{-r}h^{-s}$ có vô số witnesses. Blinding dùng ba tham số $(\beta, \gamma, \delta)$. Security proof sequential OMUF dưới DL in ROM, với WI cho phép tách signing witness khỏi extraction witness. Concurrent vẫn bị ROS attack.

### [[05-blind-ecdsa|05. Blind ECDSA]]

Khó khăn khi blindify ECDSA do phi tuyến tính. ECDSA-ROS attack (generic attack trên mọi blind ECDSA). Generic construction dùng **additive HE** (chia nonce $k = k_a k_b$) và **NIZK proof** đảm bảo wellformedness. Output là ECDSA signature chuẩn $(r, s)$. OMUF trong ABRO model (Qin 2021) hoặc ECDSA assumption + MPC-in-the-head (Maire 2025).

### [[10-forking-lemma-blind-signatures|10. Forking Lemma for Blind Signatures]]

Kỹ thuật proof nền tảng cho sequential OMUF: **oracle replay attack** chạy adversary hai lần với cùng tape, fork tại hash query của forgery. Splitting Lemma bound xác suất fork. Bellare-Neven (CCS 2006) tổng quát hóa thành **General Forking Algorithm** với $\mathsf{frk} \geq \mathsf{acc}(\mathsf{acc}/q - 1/h)$. Giải thích tại sao rewinding thất bại trong concurrent setting (interleaved queries tạo inconsistent world).

### [[11-rsa-blinding-multiplicative-forgery|11. Attack I — RSA Blinding: Multiplicative Forgery]]

Khai thác **multiplicative homomorphism** của unpadded RSA: $(m_1 m_2)^d = m_1^d m_2^d$. Hai attack vector: (1) **Factoring** — phân tích $m^*$ thành $m_1 \cdot m_2$, query từng thừa số, nhân kết quả; (2) **Blinding** — nhân $m^*$ với $r^e$, lấy chữ ký, chia $r$. Cả hai chỉ cần 1–2 oracle queries. CTF pattern: VolgaCTF 2019 "Blind". Fix: RSA-PSS padding.

### [[12-ros-attack|12. Attack II — The ROS Attack]]

**ROS problem**: tìm $c \in \mathbb{Z}_p^\ell$ sao cho $H_\mathsf{ros}(\hat\rho_i) = \langle\hat\rho_i, c\rangle$ cho $\ell+1$ vectors. Wagner (2002): sub-exponential attack. Benhamouda et al. (EUROCRYPT 2021): **polynomial-time** khi $\ell \geq \log p$ — dùng binary decomposition trick. Impact: Schnorr, Okamoto-Schnorr, Abe-Okamoto, FROST, MuSig2 đều bị phá trong concurrent setting.

### [[13-parallel-ros-mnm-attack|13. Attack III — Parallel ROS & M&M Attack]]

**pROS problem** tổng quát ROS cho parallel repetitions ($\omega$) và arbitrary algebraic structures. **Mix-and-Match attack** (Katsumata-Lai-Reichle 2023): mỗi session cung cấp một binary degree of freedom (chọn $\mathsf{aux}^0$ hoặc $\mathsf{aux}^1$); $\ell = \omega\xi$ sessions đủ để decompose target hash. Impact PQ: CSI-Otter (isogeny), Blaze+, BlindOR (lattice) đều bị phá — 4-concurrent CSI-Otter: $\approx 2^{34}$ hash evals.

### [[14-weak-blinding-linkability-flaws|14. Attack IV — Weak Blinding & Linkability Flaws]]

**RSA flaws**: missing blinding factor (Signer thấy message), small/deterministic $r$ (brute-force link), $r$ reuse (linkability qua ratio $\hat m_1/\hat m_2$). **Schnorr flaws**: $\alpha=\beta=0$ (blindness mất hoàn toàn), missing $\beta$ (challenge bị lộ), deterministic blinding từ $m$ (dictionary attack), Signer nonce reuse (private key exposure). CTF fingerprint: hardcoded constants, module-level randomness, object-level caching.

### [[15-post-quantum-blind-signatures|15. Post-Quantum Blind Signatures]]

Hai paradigm PQ: **Schnorr-type** (cần module structure, lattice OK, isogeny khó; vấn đề correctness error) và **Fischlin-type** (cần NIZK hiệu quả, lattice state-of-the-art 22 KB — Beullens et al. CCS 2023, isogeny khó do thiếu NIZK). Isogeny-based: **CSI-Otter** (CRYPTO 2023, 8 KB, poly-log concurrent) bị M&M attack phá tại 4 sessions; **Tanuki** (ASIACRYPT 2025, 4.5 KB) đạt polynomial concurrent. Parallel repetition không fix được do pROS scale tuyến tính.

### [[16-applications-ecash-evoting-credentials|16. Applications: eCash, e-Voting & Anonymous Credentials]]

**DigiCash eCash**: Bank ký mù serial number → User chi tiêu tại Shop → Bank check double-spend khi deposit; restrictive blind sig identify double-spender. **FOO92 e-voting**: Admin ký mù encrypted vote → submit qua kênh ẩn danh → Tallier đếm sau khi reveal key; không receipt-free. **Anonymous Credentials** (U-Prove, Idemix): attribute-bound blind signature + ZK proof at presentation. **Privacy Pass** (RFC 9474, 9578, 2024): production deployment Chaum RSA tại Apple, Cloudflare, Google, Kagi.

### [[a0-ctf-cheatsheet|A0. Blind Signature CTF Cheatsheet]]

Quick reference cho 5 attack patterns: RSA blinding/factoring (Pattern 1), Schnorr weak blinding — zero/deterministic/nonce-cached (Pattern 2), ROS-based concurrent forgery (Pattern 3), RSA $r$ reuse (Pattern 4), missing $\beta$ term (Pattern 5). Fingerprinting checklist triage 4 bước.

### [[a1-ros-attack-implementation|A1. ROS Attack — SageMath Implementation]]

Step-by-step implementation polynomial-time ROS solver của Benhamouda et al.: binary decomposition trick trong SageMath, ghép vào Schnorr concurrent forgery, concrete example trên $p \approx 2^{16}$ (35 oracle calls). Đối chiếu từng bước với Lecture 12.

### [[a2-formal-definitions-reference|A2. Formal Definitions Reference]]

Tổng hợp đầy đủ: Blind Signature syntax (A2.1), Correctness (A2.2), Blindness game (A2.3), Sequential OMUF (A2.4), Concurrent OMUF (A2.5), EUF-CMA (A2.6), ROM/AGM/QROM (A2.7-9), DLP/OMDL/RSA/GDH/SIS (A2.10-14), Partially Blind Sig (A2.15), Notation table đầy đủ và security hierarchy diagram.

---

## Global Notation

Bảng này được cập nhật sau mỗi lesson. Ký hiệu dùng nhất quán xuyên suốt toàn course.

| Ký hiệu | Ý nghĩa | Định nghĩa tại |
|---------|---------|----------------|
| $\lambda$ | Security parameter | Toàn bộ course |
| $\mathcal{A}$ | Adversary (PPT algorithm) | [[01-blind-signature-definition-security-models\|Lesson 01]] |
| $\mathsf{negl}(\lambda)$ | Negligible function | [[01-blind-signature-definition-security-models\|Lesson 01]] |
| $\mathcal{M}$ | Message space | [[01-blind-signature-definition-security-models\|Lesson 01]] |
| $\mathsf{pk}, \mathsf{sk}$ | Public key, secret key | [[01-blind-signature-definition-security-models\|Lesson 01]] |
| $\stackrel{R}{\leftarrow}$ | Random sampling | [[01-blind-signature-definition-security-models\|Lesson 01]] |
| $N = pq$ | RSA modulus | [[02-chaum-rsa-blind-signature\|Lesson 02]] |
| $e, d$ | RSA public/secret exponent ($ed \equiv 1 \bmod \varphi(N)$) | [[02-chaum-rsa-blind-signature\|Lesson 02]] |
| $\mathbb{Z}_N^*$ | Multiplicative group modulo $N$ | [[02-chaum-rsa-blind-signature\|Lesson 02]] |
| $\mathbb{G}$ | Cyclic group bậc nguyên tố $q$ | [[03-schnorr-blind-signature\|Lesson 03]] |
| $g$ | Generator của $\mathbb{G}$ | [[03-schnorr-blind-signature\|Lesson 03]] |
| $\mathbb{Z}_q$ | Vành số nguyên modulo $q$ | [[03-schnorr-blind-signature\|Lesson 03]] |
| $H$ | Hash function (random oracle) | [[03-schnorr-blind-signature\|Lesson 03]] |
| $x, X = g^x$ | Schnorr secret/public key | [[03-schnorr-blind-signature\|Lesson 03]] |
| $g, h$ | Hai generator với $\log_g h$ không biết | [[04-okamoto-schnorr-blind-signature\|Lesson 04]] |
| $d, P = dG$ | ECDSA secret/public key | [[05-blind-ecdsa\|Lesson 05]] |
| $f: \mathbb{G} \to \mathbb{Z}_q$ | ECDSA conversion function (x-coordinate mod $q$) | [[05-blind-ecdsa\|Lesson 05]] |
| $q_H$ | Số hash queries của adversary | [[10-forking-lemma-blind-signatures\|Lesson 10]] |
| $\ell$ | Số signing sessions (blind sig context) | [[10-forking-lemma-blind-signatures\|Lesson 10]] |
| $\mathsf{acc}$ | Acceptance probability của adversary | [[10-forking-lemma-blind-signatures\|Lesson 10]] |
| $\mathsf{frk}$ | Forking probability của GenFork | [[10-forking-lemma-blind-signatures\|Lesson 10]] |
| $r$ | RSA blinding factor $\in \mathbb{Z}_N^*$ | [[11-rsa-blinding-multiplicative-forgery\|Lesson 11]] |
| $\hat{m}$ | Blinded message (RSA context) | [[11-rsa-blinding-multiplicative-forgery\|Lesson 11]] |
| $H_\mathsf{ros}$ | Random oracle trong ROS game, range $\mathbb{Z}_p$ | [[12-ros-attack\|Lesson 12]] |
| $\hat{\rho}_i \in \mathbb{Z}_p^\ell$ | Coefficient vector trong ROS problem | [[12-ros-attack\|Lesson 12]] |
| $\omega$ | Số parallel repetitions của identification protocol | [[13-parallel-ros-mnm-attack\|Lesson 13]] |
| $\xi$ | $\lceil \log |C| \rceil$ — bits per challenge | [[13-parallel-ros-mnm-attack\|Lesson 13]] |
| $\mathcal{G} = \mathcal{Cl}(\mathcal{O})$ | Class group của imaginary quadratic order $\mathcal{O}$ (CSIDH) | [[15-post-quantum-blind-signatures\|Lesson 15]] |
| $\mathcal{S}$ | Tập supersingular elliptic curves trên $\mathbb{F}_p$ (CSIDH) | [[15-post-quantum-blind-signatures\|Lesson 15]] |
| $\star$ | CSIDH group action: $\mathcal{G} \times \mathcal{S} \to \mathcal{S}$ | [[15-post-quantum-blind-signatures\|Lesson 15]] |
| $\mathsf{Enc}, \mathsf{Dec}$ | Public-key encryption, decryption | [[16-applications-ecash-evoting-credentials\|Lesson 16]] |

*(Thêm ký hiệu mới vào đây sau mỗi lesson.)*

---

## References

- Chaum, D. — *Blind Signatures for Untraceable Payments*, CRYPTO 1983
- Pointcheval & Stern — *Security Arguments for Digital Signatures and Blind Signatures*, JoC 2000
- Abe & Okamoto — *Provably Secure Partially Blind Signatures*, CRYPTO 2000
- Boldyreva — *Threshold Signatures, Multisignatures and Blind Signatures Based on the Gap-DH*, PKC 2003
- Benhamouda et al. — *On the (In)Security of ROS*, EUROCRYPT 2021
- Boneh & Shoup — *A Graduate Course in Applied Cryptography* (toc.cryptobook.us)

---

## Diagram Asset Registry

| File | Lesson | Mô tả |
|------|--------|--------|
| `assets/img-01-blind-sig-ecosystem.png` | [[01-blind-signature-definition-security-models\|01]] | Kiến trúc tổng quan blind signature |
| `assets/img-07-pairing-structure.png` | [[07-blind-bls-boldyreva\|07]] | Cấu trúc bilinear pairing $e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$ |
| `assets/img-12-ros-attack-structure.png` | [[12-ros-attack\|12]] | Overdetermined linear system trong ROS attack |
| `assets/img-13-mnm-attack-flow.png` | [[13-parallel-ros-mnm-attack\|13]] | Mix-and-Match attack trên parallel ROS |

*(Cập nhật dần sau mỗi diagram được render.)*
