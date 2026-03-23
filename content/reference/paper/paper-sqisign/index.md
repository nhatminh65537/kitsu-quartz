---
title: "SQISign"
type: index
tags: [sqisign, isogeny, post-quantum, quaternion, index]
source: "SQISign: compact post-quantum signatures from quaternions and isogenies — De Feo, Kohel, Leroux, Petit, Wesolowski, 2020"
created: 2026-03-16
---

SQISign (Short Quaternion and Isogeny Signature) là lược đồ chữ ký hậu lượng tử compact nhất hiện biết, đạt NIST-1 security với chữ ký chỉ 204 bytes và public key 64 bytes nhờ kết hợp đồ thị isogeny supersingular với lý thuyết quaternion algebra và Eichler orders. Course này cover toàn bộ bản ePrint 2020/1240 ở mức research-level: mọi theorem, lemma, proposition, algorithm và appendix.

**Tài liệu gốc**: [eprint.iacr.org/2020/1240](https://eprint.iacr.org/2020/1240)  
**Roadmap**: [[00-roadmap\|00. Roadmap]]

---

## Lessons

### [[01-supersingular-isogeny-graphs\|01. Supersingular Isogeny Graphs]]

Cover §1 và §2.1: định nghĩa isogeny, endomorphism ring, đường cong supersingular, cấu trúc Ramanujan của $\ell$-isogeny graph, và ba hardness problems (ℓ-isogeny path, EndRing, SSEP) làm nền tảng cho toàn bộ scheme.

### [[02-quaternion-algebras\|02. Quaternion Algebras, Orders & Ideals]]

Cover §2.2: quaternion algebra $B_{p,\infty} = H(-1,-p)$, reduced norm/trace, maximal orders, special extremal order $\mathcal{O}_0$, fractional ideals, invertibility, equivalence, ideal class set $\text{Cl}(\mathcal{O})$, và map $\chi_I$ (Lemma 1 — surjection từ elements sang ideal classes, cốt lõi của KLPT).

### [[03-deuring-correspondence\|03. The Deuring Correspondence]]

Cover §2.3: bijection giữa pairs $(E_1, \varphi: E_0 \to E_1)$ và left $\mathcal{O}_0$-ideals qua kernel ideal $I_\varphi$ và isogeny $\varphi_I$; Proposition 3 (composition = ideal product); biểu diễn $\text{End}(E_1)$ qua $\varphi: E_0 \to E_1$; pushforward ideal $[I_\tau]_*$.

### [[04-klpt-classic\|04. Classic KLPT Algorithm]]

Cover §2.4: ba sub-routines ($\mathsf{RepresentInteger}_{\mathcal{O}_0}$, $\mathsf{IdealModConstraint}$, $\mathsf{StrongApproximation}_{\ell^\bullet}$) và thuật toán $\mathsf{KLPT}_{\ell^\bullet}$ (Algorithm 3) — cho input left $\mathcal{O}_0$-ideal, tìm equivalent $J$ với norm $\ell^e$ trong polynomial time; deterministic variant (Petit–Smith); giới hạn với arbitrary orders.

### [[05-sqisign-protocol\|05. SQISign Identification Protocol & Signature]]

Cover §3: giao thức identification một vòng (commitment $E_1$, challenge $\varphi$, response $\sigma$, Fig.1); Problem 1 (SSEP); Lemma 2 và Theorem 1 (soundness via special soundness); phân tích hai cách tiếp cận ZK không an toàn; lược đồ chữ ký Fiat–Shamir với Theorem 2 (EUF-CMA).

### [[06-eichler-orders\|06. Eichler Orders & Extended Deuring Correspondence]]

Cover §4 — trung tâm toán học của paper: Eichler order $\mathfrak{O} = \mathcal{O}_0 \cap \mathcal{O}$, phân tích $\mathfrak{O} = \mathbb{Z} + I_\tau$ (Proposition 1), class set $\text{Cl}_\mathcal{O}(\mathcal{O}_0)$, Corollary 1 (pushforward commutes với $\chi$), và hai kết quả [this work]: Proposition 6 ($N$-isogenies ↔ $\text{Cl}_\mathcal{O}(\mathcal{O}_0)$) + Proposition 3 (Eichler order = $\text{End}(E_1, \text{subgroup})$).

### [[07-generalized-klpt\|07. Generalized KLPT Algorithm]]

Cover §5: Generalized KLPT (Algorithm 4) mở rộng KLPT sang arbitrary maximal orders dùng Eichler constraint — bổ sung $\mathsf{EichlerModConstraint}$ (Bước 5) và CRT kép (Bước 6); Lemma 4 (correctness từ Corollary 1); so sánh với KLPT classic; biến thể $\mathsf{KLPT}_T$.

### [[08-signing-klpt\|08. Signing KLPT & EichlerModConstraint]]

Cover §6: $\mathsf{SigningKLPT}$ (Algorithm 5) = Generalized KLPT + rerandomization để đảm bảo output distribution phù hợp ZK; $\mathsf{EichlerModConstraint}$ (Algorithm 6) giải constraint $\beta \in \mathcal{O}$ bằng linear algebra mod $N_\tau$; Lemma 5–6 (correctness); kết nối với ZK proof.

### [[09-zero-knowledge\|09. Zero-Knowledge Property]]

Cover §7: Problem 2 (KLPT output distribution assumption); Simulator $\text{Sim}(E_A, \varphi)$ không cần secret $\tau$; Lemma 7–12 (chain phân tích phân phối từ $\mathsf{EquivalentPrimeIdeal}$ đến output $J$); Proposition 11 (HVZK); §7.3 (evidence cho Problem 2); kết hợp Soundness + HVZK + FS → EUF-CMA.

### [[10-implementation\|10. Implementation & Parameters]]

Cover §8: $\mathsf{IdealToIsogenyFromKLPT}$ (Algorithm 7) — xử lý ideals norm không smooth qua KLPT decomposition; Algorithms 8–10 (KeyGen, Sign, Verify) — pipeline đầy đủ; hai torsion tricks ($p^3 \to p^{3/2}$); Table 2 (tham số NIST-1: $p \sim 2^{256}$, sig 204B, pk 64B); performance và path đến SQISignHD.

---

## Appendix

### [[a0-zk-analysis\|A0. ZK Analysis: Lemma 7–11]]

Full proofs của Lemma 7–11 trong §7.2: phân tích phân phối của từng thành phần trong SigningKLPT pipeline (EquivalentPrimeIdeal, RepresentInteger, StrongApproximation, CRT, bijection với $\text{Cl}_\mathcal{O}$) và chain reasoning dẫn đến HVZK.

### [[a1-security-definitions\|A1. Security Definitions & EUF-CMA]]

Appendix A của paper: định nghĩa chuẩn Sigma-protocol (completeness, special soundness, HVZK), EUF-CMA security game, Theorem 3 (Fiat–Shamir của HVZK special-sound Sigma-protocol → EUF-CMA trong ROM), security parameter analysis.

---

## Global Notation

Ký hiệu nhất quán xuyên suốt toàn course. Cột **Paper** ghi ký hiệu gốc nếu khác.

| Ký hiệu | Ý nghĩa | Ký hiệu trong paper | Định nghĩa tại |
|---------|---------|---------------------|----------------|
| $p$ | Số nguyên tố đặc trưng | $p$ | [[01-supersingular-isogeny-graphs\|Lesson 01]] |
| $\mathbb{F}_{p^2}$ | Trường hữu hạn bậc $p^2$ | $\mathbb{F}_{p^2}$ | [[01-supersingular-isogeny-graphs\|Lesson 01]] |
| $E, E_0, E_A$ | Đường cong elliptic supersingular | $E, E_0, E_A$ | [[01-supersingular-isogeny-graphs\|Lesson 01]] |
| $\varphi, \psi, \tau, \sigma$ | Isogenies (morphisms giữa curves) | $\varphi, \psi, \tau, \sigma$ | [[01-supersingular-isogeny-graphs\|Lesson 01]] |
| $\hat{\varphi}$ | Dual isogeny của $\varphi$ | $\hat{\varphi}$ | [[01-supersingular-isogeny-graphs\|Lesson 01]] |
| $\deg(\varphi)$ | Degree của isogeny $\varphi$ | $\deg(\varphi)$ | [[01-supersingular-isogeny-graphs\|Lesson 01]] |
| $\text{End}(E)$ | Endomorphism ring của $E$ | $\text{End}(E)$ | [[01-supersingular-isogeny-graphs\|Lesson 01]] |
| $j(E)$ | j-invariant của $E$ | $j(E)$ | [[01-supersingular-isogeny-graphs\|Lesson 01]] |
| $\ell$ | Số nguyên tố nhỏ (thường $\ell = 2$) | $\ell$ | [[01-supersingular-isogeny-graphs\|Lesson 01]] |
| $[k]$ | Phép nhân-bởi-$k$ trên $E$ | $[k]$ | [[01-supersingular-isogeny-graphs\|Lesson 01]] |
| $B_{p,\infty}$ | Quaternion algebra ramified tại $p$ và $\infty$ | $B_{p,\infty}$ | [[02-quaternion-algebras\|Lesson 02]] |
| $H(a,b)$ | Quaternion algebra với $i^2=a$, $j^2=b$ | $H(a,b)$ | [[02-quaternion-algebras\|Lesson 02]] |
| $\bar{\alpha}$ | Conjugate của $\alpha \in B_{p,\infty}$ | $\bar{\alpha}$ | [[02-quaternion-algebras\|Lesson 02]] |
| $\text{tr}(\alpha)$ | Reduced trace: $\alpha + \bar{\alpha}$ | $\text{tr}(\alpha)$ | [[02-quaternion-algebras\|Lesson 02]] |
| $\text{n}(\alpha)$ | Reduced norm: $\alpha\bar{\alpha}$ | $\text{n}(\alpha)$ | [[02-quaternion-algebras\|Lesson 02]] |
| $\mathcal{O}$ | Order trong $B_{p,\infty}$ (maximal hoặc suborder) | $\mathcal{O}$ | [[02-quaternion-algebras\|Lesson 02]] |
| $\mathcal{O}_0$ | Special extremal order cố định ($\cong \text{End}(E_0)$) | $\mathcal{O}_0$ | [[02-quaternion-algebras\|Lesson 02]] |
| $I, J$ | Fractional ideal (Z-lattice rank 4) | $I, J$ | [[02-quaternion-algebras\|Lesson 02]] |
| $\text{n}(I)$ | Norm của ideal $I$ | $\text{n}(I)$ | [[02-quaternion-algebras\|Lesson 02]] |
| $\mathcal{O}_L(I), \mathcal{O}_R(I)$ | Left order, right order của $I$ | $\mathcal{O}_L(I), \mathcal{O}_R(I)$ | [[02-quaternion-algebras\|Lesson 02]] |
| $\text{Cl}(\mathcal{O})$ | Ideal class set của $\mathcal{O}$ | $\text{Cl}(\mathcal{O})$ | [[02-quaternion-algebras\|Lesson 02]] |
| $\chi_I(\alpha) = I\alpha/\text{n}(I)$ | Map surjection từ $I$ sang ideals $\sim I$ | $\chi_I$ | [[02-quaternion-algebras\|Lesson 02]] |
| $I_\varphi$ | Kernel ideal của isogeny $\varphi$ | $I_\varphi$ | [[03-deuring-correspondence\|Lesson 03]] |
| $E_0[I]$ | Kernel subgroup của ideal $I$ | $E_0[I]$ | [[03-deuring-correspondence\|Lesson 03]] |
| $[I_\tau]_* J$ | Pushforward của $J$ dọc $I_\tau$ | $[I_\tau]_* J$ | [[03-deuring-correspondence\|Lesson 03]] |
| $R = \mathbb{Z}[\omega]$ | Quadratic order trong $\mathcal{O}_0$ ($\omega = i$) | $R$ | [[04-klpt-classic\|Lesson 04]] |
| $f(x,y) = \text{n}(x + \omega y)$ | Norm form của $R$ | $f(x,y)$ | [[04-klpt-classic\|Lesson 04]] |
| $\ell^\bullet$ | "Một lũy thừa nào đó của $\ell$" | $\ell^\bullet$ | [[04-klpt-classic\|Lesson 04]] |
| $\tau: E_0 \to E_A$ | Secret key isogeny | $\tau$ | [[05-sqisign-protocol\|Lesson 05]] |
| $E_A$ | Public key curve | $E_A$ | [[05-sqisign-protocol\|Lesson 05]] |
| $D_c$ | Challenge degree (odd smooth, $\lambda$-bit) | $D_c$ | [[05-sqisign-protocol\|Lesson 05]] |
| $D = 2^e$ | Response degree | $D$ | [[05-sqisign-protocol\|Lesson 05]] |
| $\Phi_{D_c}(E,s)$ | Non-backtracking walk degree $D_c$ từ $E$, index $s$ | $\Phi_{D_c}$ | [[05-sqisign-protocol\|Lesson 05]] |
| $\mathfrak{O} = \mathcal{O}_0 \cap \mathcal{O}$ | Eichler order (giao của hai maximal orders) | $\mathfrak{O}$ | [[06-eichler-orders\|Lesson 06]] |
| $N_\tau = \text{n}(I_\tau)$ | Norm của secret ideal | $N_\tau$ | [[06-eichler-orders\|Lesson 06]] |
| $\text{Cl}_\mathcal{O}(\mathcal{O}_0)$ | Class set relative to $\mathcal{O}$ | $\text{Cl}_\mathcal{O}(\mathcal{O}_0)$ | [[06-eichler-orders\|Lesson 06]] |
| $J \sim_\mathcal{O} K$ | $\mathcal{O}$-equivalence (multiplication bởi $\beta \in \mathcal{O}$) | $\sim_\mathcal{O}$ | [[06-eichler-orders\|Lesson 06]] |
| $\lambda$ | Security parameter | $\lambda$ | [[09-zero-knowledge\|Lesson 09]] |
| $\mathcal{D}_{\tau,\varphi}$ | Phân phối output của SigningKLPT | — | [[09-zero-knowledge\|Lesson 09]] |
| $\mathcal{U}_{[I]}$ | Phân phối đều trên $\mathcal{O}$-equivalence class của $I$ | — | [[09-zero-knowledge\|Lesson 09]] |
| $T$ | Smooth integer (tích primes nhỏ, accessible torsion) | $T$ | [[10-implementation\|Lesson 10]] |
| $\mathsf{negl}(\lambda)$ | Negligible function | $\mathsf{negl}$ | [[a1-security-definitions\|A1]] |

---

## References

### 🟡 Integrated

- [KLPT14] Kohel, Lauter, Petit, Tignol — *On the quaternion ℓ-isogeny path problem*, LMS J. Comput. Math. 17A, 2014 — integrate trong [[04-klpt-classic\|Lesson 04]] (Lemma 5 reformulated, sub-routines EquivalentPrimeIdeal / IdealModConstraint / StrongApproximation)
- [PetitSmith18] Petit, Smith — *MathCrypt 2018* (slides) — integrate trong [[04-klpt-classic\|Lesson 04]] (Remark 4: deterministic StrongApproximation via CVP)
- [GPS19] Galbraith, Petit, Silva — *Identification protocols and signature schemes based on supersingular isogeny problems*, J. Cryptol. 33(1), 2020 — integrate trong [[05-sqisign-protocol\|Lesson 05]] (§3.3: ZK failure analysis; Remark 6: outputs depend on class)
- [EHL+18] Eisenträger, Hallgren, Lauter, Morrison, Petit — *Supersingular isogeny graphs and endomorphism rings: reductions and solutions*, EUROCRYPT 2018 — integrate trong [[05-sqisign-protocol\|Lesson 05]] (SSEP ↔ EndRing reduction, Remark 8)
- [CGL09] Charles, Lauter, Goren — *Cryptographic hash functions from expander graphs*, J. Cryptol. 22(1), 2009 — integrate trong [[05-sqisign-protocol\|Lesson 05]] ($\Phi_{D_c}$ non-backtracking walk construction)
- [FS86] Fiat, Shamir — *How to prove yourself*, CRYPTO 1986 — integrate trong [[05-sqisign-protocol\|Lesson 05]] (Fiat–Shamir transform)
- [Wat69] Waterhouse — *Abelian varieties over finite fields*, Ann. Sci. ENS, 1969 — integrate trong [[03-deuring-correspondence\|Lesson 03]] (kernel ideal definition)
- [Voi21] Voight — *Quaternion Algebras*, Springer 2021, Remark 42.3.10 — integrate trong [[06-eichler-orders\|Lesson 06]] (folklore proved in §4)

### 🔴 Prerequisites

- [Sil09] Silverman — *The Arithmetic of Elliptic Curves*, Springer 2009 — ECC background, degree of rational maps, endomorphism rings
- [Deu41] Deuring — *Die Typen der Multiplikatorenringe elliptischer Funktionenkörper*, 1941 — original Deuring correspondence
- [Koh96] Kohel — *Endomorphism rings of elliptic curves over finite fields*, PhD thesis UC Berkeley 1996 — constructive Deuring
- [Vél71] Vélu — *Isogénies entre courbes elliptiques*, C. R. Acad. Sci. Paris 1971 — Vélu's formula để tính isogeny từ kernel
- [SIDH] Jao, De Feo — *Towards quantum-resistant cryptosystems from supersingular elliptic curve isogenies*, PQCrypto 2011 — isogeny-based crypto background
- [CSIDH] Castryck, Lange, Martindale, Panny, Renes — *CSIDH*, ASIACRYPT 2018 — isogeny-based crypto background
- Cornacchia's algorithm — textbook number theory — norm equation solver dùng trong Alg 1–2
- LLL / CVP lattice reduction — dùng trong Petit–Smith variant của StrongApproximation
- [Dam04] Damgård — *On Sigma-Protocols*, 2004 — Sigma-protocol definitions, HVZK, knowledge error

### ⚪ Citations only

- [Piz90] Pizer — *Ramanujan graphs and Hecke operators*, Bull. AMS 1990 — Ramanujan property của isogeny graph
- [Eic38] Eichler — *Über die Idealklassenzahl hyperkomplexer Systeme*, 1938 — Eichler class number formula
- [Couveignes97] Couveignes — *Hard Homogeneous Spaces*, ePrint 2006 (written 1997) — historical credit
- [PS96] Pointcheval, Stern — *Security Arguments for Digital Signatures*, J. Cryptol. 2000 — Forking Lemma (dùng trong Thm 3 proof)