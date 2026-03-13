---
title: "04. KZG Security Analysis"
tags: [crypto, zk, polynomial-commitments, lesson-04]
aliases: [KZG Security Analysis]
created: 2026-03-12
---

> **Prerequisites**: [[03-kzg-commitments|03. KZG Commitments]], DLP hardness, security reductions  
> **Objectives**:  
> - Phát biểu và hiểu t-SDH assumption
> - Prove binding của KZG từ t-SDH
> - Hiểu evaluation binding vs polynomial binding
> - Phân biệt computational vs knowledge soundness
> - Biết các attack scenarios khi assumption bị phá vỡ

---

## Motivation

Bài trước ta thấy KZG hoạt động thế nào. Nhưng "đúng về mặt toán" chưa đủ — cần chứng minh rằng một prover lừa đảo **không thể** qua mặt verifier mà không giải được một bài toán cứng về mặt tính toán. Đây là **security analysis**.

---

## Assumption Cơ sở: t-SDH

> [!definition] Definition 4.1 — t-Strong Diffie-Hellman (t-SDH) Assumption
> Cho group $\mathbb{G}$ bậc nguyên tố $q$, generator $G$, và SRS:
>
> $$\left(G, \tau G, \tau^2 G, \ldots, \tau^t G\right)$$
>
> **t-SDH problem**: Tìm một cặp $(c, \psi) \in \mathbb{F}_q^* \times \mathbb{G}$ sao cho:
>
> $$e(\psi, \tau G - c G) = e(G, G)^1$$
>
> hay tương đương: $\psi = [1/(\tau - c)]_1$.
>
> **t-SDH assumption**: Không có PPT adversary nào giải được t-SDH problem với xác suất không negligible.

**Trực giác**: Adversary nhận $t+1$ powers of $\tau$ nhưng không thể tính $1/(\tau - c)$ cho bất kỳ $c$ nào — dù chọn $c$ tự do.

**Tại sao gọi là "Strong"?** Vì adversary được **chọn** $c$ thoải mái (so với CDH thông thường). Tính "strong" nằm ở chỗ dù có quyền chọn $c$, vẫn không tính được $\psi$.

---

## Proof: KZG là Evaluation Binding

> [!theorem] Theorem 4.2 — KZG Evaluation Binding
> Dưới t-SDH assumption, KZG là **evaluation binding**: không có PPT prover nào có thể tạo ra hai evaluation proofs hợp lệ $(y, \pi)$ và $(y', \pi')$ với $y \neq y'$ cho cùng $(\text{com}_f, z)$.

**Proof** (sketch by contradiction):

Giả sử adversary $\mathcal{A}$ tạo được $(y, \pi)$ và $(y', \pi')$ với $y \neq y'$, cả hai pass verify.

Khi đó:

$$e(\pi, [\tau - z]_2) = e([\text{com}_f - y]_1, [1]_2)$$

$$e(\pi', [\tau - z]_2) = e([\text{com}_f - y']_1, [1]_2)$$

Chia hai phương trình (trong $\mathbb{G}_T$):

$$e(\pi - \pi', [\tau - z]_2) = e([y' - y]_1, [1]_2)$$

Đặt $\Delta = (y' - y) \neq 0$. Suy ra:

$$e\!\left(\frac{\pi - \pi'}{\Delta},\; [\tau - z]_2\right) = e(G_1, G_2)$$

Đặt $\psi = (\pi - \pi') / \Delta$. Thì $e(\psi, [\tau - z]_2) = e(G_1, G_2)$, tức $\psi = [1/(\tau - z)]_1$.

Nhưng đây chính là giải t-SDH với $c = z$ — mâu thuẫn với giả thiết t-SDH hard. $\blacksquare$

---

## Polynomial Binding vs Evaluation Binding

> [!warning] Warning 4.3 — KZG KHÔNG có Polynomial Binding
> KZG **không** đảm bảo rằng commitment $\text{com}_f$ chỉ correspond với một đa thức $f$ duy nhất.
>
> Thực ra, **vô số** đa thức có cùng commitment — vì chỉ commit tại $f(\tau)$ và $\tau$ là ẩn.

Điều này có vẻ đáng lo ngại, nhưng thực ra không sao vì:

- **Evaluation binding** là đủ cho ZK applications: chỉ cần không thể chứng minh $f(z) = y$ và $f(z) = y'$ với $y \neq y'$.
- **Knowledge soundness** (extractability) được chứng minh trong Random Oracle Model — nếu prover biết tạo proof, extractor có thể trích được *một* đa thức $f$ consistent.

---

## Knowledge Soundness & Forking Lemma

> [!definition] Definition 4.4 — Polynomial Knowledge Commitment
> KZG là một **polynomial knowledge commitment** (hay extractable commitment) trong AGM (Algebraic Group Model): nếu adversary xuất ra $\text{com}_f$ dưới dạng linear combination của SRS elements, extractor biết $f$.

Trong AGM, mọi group element mà adversary xuất ra phải là linear combination của input group elements — nên coefficients của $f$ có thể extract trực tiếp.

**Forking Lemma** (dùng để prove soundness của interactive protocols):

> [!theorem] Theorem 4.5 — Special Soundness via Forking
> Nếu một interactive proof (commit, challenge, response) có **special soundness** — tức là từ hai transcripts với cùng commitment nhưng challenge khác nhau có thể extract witness — thì kết hợp Fiat-Shamir sẽ tạo ra SNARK sound trong ROM.

---

## Attack Scenarios

### Attack 1: Biết Toxic Waste $\tau$

Nếu $\tau$ bị lộ, adversary có thể:

1. Chọn bất kỳ commitment $C \in \mathbb{G}_1$
2. Với bất kỳ $z$ và $y$ tùy ý, tính: $\pi = (C - [y]_1) \cdot (\tau - z)^{-1}$
3. Proof này sẽ pass verify!

Đây là **complete break** — adversary chứng minh được bất cứ điều gì về bất cứ commitment nào.

> [!danger] Danger 4.6 — Toxic Waste = Total Break
> Nếu $\tau$ bị lộ hoặc không bị xóa, KZG mất hoàn toàn binding. Toàn bộ hệ thống chạy trên SRS đó bị phá vỡ.

### Attack 2: Subgroup Attack (Nếu Thiếu Check)

Nếu verifier không kiểm tra các điểm nhận từ prover thuộc đúng subgroup, adversary có thể gửi điểm order nhỏ để bypass pairing check.

Ví dụ: nếu $\mathbb{G}_1$ có subgroup nhỏ, adversary gửi $\pi' \in$ small-order subgroup. Pairing của điểm order nhỏ có thể cho kết quả cố định, dễ forge.

### Attack 3: Commitment Malleability

KZG không hiding theo nghĩa mạnh: nếu adversary biết $f$ là một trong số ít candidate polynomials, có thể kiểm tra bằng cách commit và so sánh.

Ngoài ra, commitment là **additively homomorphic**:

$$\text{com}_{f+g} = \text{com}_f + \text{com}_g$$

Nếu không kiểm tra nguồn gốc commitments, adversary có thể "mix" các commitments để forge.

---

## So sánh KZG với Pedersen

| Tính chất | KZG | Pedersen |
|-----------|-----|---------|
| Binding | Evaluation binding (t-SDH) | Computationally binding (DL) |
| Hiding | Computational (không hiding hoàn toàn) | Perfect hiding |
| Proof size | $O(1)$ | $O(1)$ commit, $O(d)$ naive open |
| Trusted setup | ✅ Cần SRS | ❌ Không cần |
| Pairing | ✅ Cần pairing-friendly curve | ❌ Không cần |

---

## Tóm tắt

- **t-SDH assumption** là nền tảng bảo mật của KZG: không thể compute $[1/(\tau-c)]_1$ từ SRS.
- **Evaluation binding** được prove bằng reduction: nếu phá được KZG → giải được t-SDH.
- KZG **không** polynomial binding — điều này ổn vì evaluation binding là đủ.
- **Knowledge soundness** đòi hỏi AGM hoặc ROM — không trivial.
- **Attack surface chính**: (1) lộ toxic waste, (2) thiếu subgroup check, (3) misuse của homomorphic property.

---

## References

- Kate, Zaverucha & Goldberg — *Constant-Size Commitments to Polynomials* (proof của t-SDH binding)
- Boneh, Boyen — *Short Signatures Without Random Oracles* (t-SDH assumption definition)
- ZKDocs — *KZG Security* — https://www.zkdocs.com/docs/zkdocs/commitments/kzg_polynomial_commitment/
- Dan Boneh — AGM lecture, Stanford CS355
