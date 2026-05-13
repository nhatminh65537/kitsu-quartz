---
title: "04. Okamoto-Schnorr Blind Signature"
type: scheme
tags: [crypto, blind-signature, okamoto, schnorr, witness-indistinguishability, lesson-04]
aliases: [Okamoto-Schnorr Blind Signature]
created: 2026-05-13
---

> **Prerequisites**: [[01-blind-signature-definition-security-models|01. Definition & Security Models]], [[03-schnorr-blind-signature|03. Schnorr Blind Signature]], witness indistinguishability cơ bản
> **Lesson type**: Scheme
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $p, q$ | Số nguyên tố lớn thỏa $q \mid (p-1)$ |
> | $\mathbb{Z}_p^*$ | Nhóm nhân modulo $p$, bậc $p-1$ |
> | $g, h$ | Hai generator độc lập (theo DL) của nhóm con bậc $q$ trong $\mathbb{Z}_p^*$ |
> | $\mathbb{Z}_q$ | Vành số nguyên modulo $q$ |
> | $f$ | Hash function: $\{0,1\}^* \to \mathbb{Z}_q$ (random oracle) |
> | $\mathsf{negl}(\lambda)$ | Negligible function |

---

## Motivation

Trong Schnorr blind signature (Lesson 03), bằng chứng sequential OMUF đặt ra một vấn đề kỹ thuật tinh tế: reduction cần **simulate** Signer mà không có secret key, nhưng trong blind setting, adversary (User) chính là người chọn challenge — không phải random oracle. Điều này phá vỡ simulation vì reduction không thể giả mạo transcript Signer.

Okamoto (1992) đề xuất một adaptation của Schnorr identification dùng **hai secret key** $(r, s)$ thay vì một. Tính chất then chốt: với một public key $y$ cho trước, có **nhiều** cặp $(r, s)$ đều cho cùng $y$. Đây là **witness indistinguishability** (WI) — và nó cho phép reduction "tách" witness dùng để sign khỏi witness được extract trong forking step.

Pointcheval & Stern (1996/2000) dùng Okamoto-Schnorr làm scheme nền để xây dựng bằng chứng bảo mật đầu tiên cho blind signature.

---

## Mathematical Setting

> [!note] Setting 4.0 — Okamoto Group
> **Primes**: $p, q$ nguyên tố với $q \mid (p-1)$; subgroup $\mathbb{G}$ bậc $q$ trong $\mathbb{Z}_p^*$.
> **Two generators**: $g, h \in \mathbb{G}$ với $\log_g h$ **không biết** với bất kỳ ai (kể cả Signer). Đây là yêu cầu thiết yếu.
> **Secret key**: $(r, s) \in \mathbb{Z}_q^2$ — hai giá trị độc lập.
> **Public key**: $y = g^{-r} h^{-s} \bmod p$.
> **Hash**: $f : \{0,1\}^* \to \mathbb{Z}_q$ (random oracle).

---

## Witness Indistinguishability

Tính chất quan trọng nhất của Okamoto-Schnorr là mỗi public key $y$ có **vô số** secret key.

> [!note] Proposition 4.1 — Multiple Witnesses
> Với $y = g^{-r} h^{-s} \bmod p$, tập hợp tất cả cặp $(r', s') \in \mathbb{Z}_q^2$ thỏa $g^{-r'} h^{-s'} = y$ là một **coset** trong $\mathbb{Z}_q^2$: với mỗi $\Delta \in \mathbb{Z}_q$, cặp $(r' = r + \Delta \cdot L,\; s' = s - \Delta)$ cũng là secret key hợp lệ, trong đó $L = \log_g h \bmod q$ là discrete log của $h$ cơ số $g$.

**Proof.** $g^{-r'} h^{-s'} = g^{-(r+\Delta L)} h^{-(s-\Delta)} = g^{-r} g^{-\Delta L} h^{-s} h^{\Delta} = g^{-r} (g^L)^{-\Delta} h^{-s} h^{\Delta} = g^{-r} h^{-\Delta} h^{-s} h^{\Delta} = g^{-r} h^{-s} = y$. $\blacksquare$

> [!info] Ý nghĩa của WI
> Bởi vì $\log_g h$ không ai biết, không ai có thể liệt kê tất cả witnesses. Quan trọng hơn: **nếu một adversary biết hai witnesses khác nhau** $(r_1, s_1) \neq (r_2, s_2)$ cho cùng $y$, thì họ biết $\Delta = s_1 - s_2$ và $L = (r_2 - r_1) / \Delta \bmod q$ — tức là giải được DL problem $\log_g h$. Đây là nền tảng cho security proof.

---

## Scheme Definition

> [!note] Scheme 4.2 — Okamoto-Schnorr Blind Signature (Pointcheval-Stern)
> **Type**: Blind Digital Signature
> **Setting**: Subgroup $\mathbb{G}$ bậc $q$ trong $\mathbb{Z}_p^*$, hai generator $g, h$; hash $f: \{0,1\}^* \to \mathbb{Z}_q$
>
> **$\mathsf{KeyGen}(1^\lambda)$**
> - Chọn $(r, s) \stackrel{R}{\leftarrow} \mathbb{Z}_q^2$; tính $y = g^{-r} h^{-s} \bmod p$
> - Output: $\mathsf{sk} = (r, s)$, $\mathsf{pk} = y$
>
> **$\mathsf{S}_1(\mathsf{sk})$** — Signer gửi commitment
> - Input: $\mathsf{sk} = (r, s)$
> - Chọn $(t, u) \stackrel{R}{\leftarrow} \mathbb{Z}_q^2$; tính $a = g^t h^u \bmod p$
> - Lưu $\mathsf{st}_S = (t, u)$
> - Output: $a$ (gửi User)
>
> **$\mathsf{U}_1(\mathsf{pk}, m, a)$** — User blind
> - Input: $\mathsf{pk} = y$, message $m$, commitment $a$
> - Chọn $(\beta, \gamma, \delta) \stackrel{R}{\leftarrow} \mathbb{Z}_q^3$
> - Tính $\alpha = a \cdot g^\beta \cdot h^\gamma \cdot y^\delta \bmod p$ (blinded commitment)
> - Tính $\varepsilon = f(m, \alpha) \in \mathbb{Z}_q$ (challenge cho signature)
> - Tính $e = \varepsilon - \delta \bmod q$ (blinded challenge gửi Signer)
> - Lưu $\mathsf{st}_U = (\beta, \gamma, \delta, \varepsilon, \alpha, m)$
> - Output: $e$ (gửi Signer)
>
> **$\mathsf{S}_2(\mathsf{sk}, e, \mathsf{st}_S)$** — Signer trả lời
> - Input: $\mathsf{sk} = (r, s)$, challenge $e$, $\mathsf{st}_S = (t, u)$
> - Tính $R = t + e \cdot r \bmod q$, $S = u + e \cdot s \bmod q$
> - Output: $(R, S)$ (gửi User)
>
> **$\mathsf{U}_2(\mathsf{pk}, R, S, \mathsf{st}_U)$** — User unblind
> - Input: $\mathsf{pk} = y$, $(R, S)$, $\mathsf{st}_U = (\beta, \gamma, \delta, \varepsilon, \alpha, m)$
> - Tính $\rho = R + \beta \bmod q$, $\sigma = S + \gamma \bmod q$
> - Output: $\Sigma = (\alpha, \varepsilon, \rho, \sigma)$
>
> **$\mathsf{Verify}(\mathsf{pk}, m, \Sigma)$**
> - Input: $\mathsf{pk} = y$, $m$, $\Sigma = (\alpha, \varepsilon, \rho, \sigma)$
> - Tính $v = g^\rho h^\sigma y^\varepsilon \bmod p$
> - Output: $1$ nếu $v = \alpha$ **và** $f(m, \alpha) = \varepsilon$; ngược lại $0$

```mermaid
sequenceDiagram
    participant U as User (pk=y, m)
    participant S as Signer (sk = r,s)
    Note over S: Chon (t,u); a = g**t * h**u
    S->>U: a
    Note over U: Chon (beta, gamma, delta)
    Note over U: alpha = a * g**beta * h**gamma * y**delta
    Note over U: eps = f(m, alpha); e = eps - delta
    U->>S: e
    Note over S: R = t + e*r; S = u + e*s
    S->>U: (R, S)
    Note over U: rho = R + beta; sigma = S + gamma
    Note over U: sig = (alpha, eps, rho, sigma)
```

---

## Correctness

> [!abstract] Theorem 4.3 — Correctness
> Với mọi $(\mathsf{sk}, \mathsf{pk})$ và mọi $m$, chữ ký $\Sigma = (\alpha, \varepsilon, \rho, \sigma)$ thỏa $\mathsf{Verify}(\mathsf{pk}, m, \Sigma) = 1$.

**Proof.** Tính $v = g^\rho h^\sigma y^\varepsilon \bmod p$:

$$
v = g^{R+\beta} \cdot h^{S+\gamma} \cdot y^\varepsilon = g^{(t+er)+\beta} \cdot h^{(u+es)+\gamma} \cdot (g^{-r} h^{-s})^\varepsilon
$$

$$
= g^{t + er + \beta - r\varepsilon} \cdot h^{u + es + \gamma - s\varepsilon}
= g^{t + \beta + r(e - \varepsilon)} \cdot h^{u + \gamma + s(e - \varepsilon)}
$$

Thay $e = \varepsilon - \delta$, tức là $e - \varepsilon = -\delta$:

$$
= g^{t + \beta - r\delta} \cdot h^{u + \gamma - s\delta}
= g^t \cdot g^\beta \cdot (g^{-r})^\delta \cdot h^u \cdot h^\gamma \cdot (h^{-s})^\delta
= a \cdot g^\beta \cdot h^\gamma \cdot y^\delta = \alpha
$$

Điều kiện thứ hai: $f(m, \alpha)  = \varepsilon$ theo cách tính $\varepsilon = f(m, \alpha)$ trong $\mathsf{U}_1$. $\blacksquare$

---

## Security Analysis

### Perfect Blindness

> [!abstract] Theorem 4.4 — Perfect Blindness
> Okamoto-Schnorr blind signature có perfect blindness.

**Proof.** Signer quan sát $(a, e, R, S)$. Lý luận tương tự Schnorr blind signature: $e = \varepsilon - \delta$ với $\delta \stackrel{R}{\leftarrow} \mathbb{Z}_q$, nên $e$ phân phối đều trên $\mathbb{Z}_q$ — độc lập với $\varepsilon = f(m, \alpha)$ và do đó với $m$. Transcript $(a, e, R, S)$ không mang thông tin về $m$. $\blacksquare$

### Sequential OMUF: Role của Witness Indistinguishability

> [!abstract] Theorem 4.5 — Sequential OMUF (Pointcheval & Stern 2000)
> Okamoto-Schnorr blind signature đạt sequential OMUF trong ROM dưới **DL assumption** trong $\mathbb{G}$.

**Proof sketch.** Tại sao WI cần thiết? Xét phép reduction $\mathcal{B}$ cần simulate Signer cho adversary $\mathcal{A}$.

**Vấn đề với Schnorr thông thường**: Trong blind setting, adversary chọn challenge $e$ (không phải random oracle). Reduction không thể simulate transcript hợp lệ mà không biết $x$ (vì không thể lập trình random oracle để e phù hợp).

**Giải pháp WI trong Okamoto**: Reduction $\mathcal{B}$ nhận challenge DL $h$ (cần tính $\log_g h$). $\mathcal{B}$ sinh khóa $\mathsf{pk} = g^{-r} h^{-s}$ với $r$ ngẫu nhiên và $s = 0$ (hoặc một giá trị đã biết). Khi cần simulate signing, $\mathcal{B}$ dùng witness thứ nhất. Khi adversary forge thành công và $\mathcal{B}$ rewind, forking lemma cho hai transcripts với cùng $a$ nhưng challenges $e_1 \neq e_2$:

$$
R_1 = t + e_1 r, \quad R_2 = t + e_2 r \implies r = \frac{R_1 - R_2}{e_1 - e_2} \bmod q
$$

Tuy nhiên, $\mathcal{B}$ không dùng $r$ trực tiếp — mà cần $\log_g h$. Đây là nơi WI được khai thác: nếu adversary trong hai lần rewind "nhìn thấy" hai witness khác nhau cho cùng $y$, thì $\mathcal{B}$ extract được $\log_g h$. Lý luận chi tiết dùng một phân tích xác suất tinh tế về khi nào hai lần rewind dùng witness khác nhau.

*(Proof đầy đủ trong: Pointcheval & Stern, JoC 2000, Section 4.)*

> [!warning] Lưu ý về proof complexity
> Proof của Pointcheval & Stern cho Okamoto-Schnorr có một **subtle gap** được phát hiện về sau (Lemma 8 vs. Lemma 9 trong paper). Phiên bản đúng đòi hỏi phân tích xác suất phức tạp hơn, và security chỉ được chứng minh với số session $\ell = O(\text{polylog}(\lambda))$ — không phải polynomial in $\lambda$ tùy ý. Xem Hauck et al. (EUROCRYPT 2019) cho treatment hiện đại.

### Concurrent OMUF: Vẫn bị phá

> [!danger] ROS Attack vẫn áp dụng
> Dù Okamoto-Schnorr cải tiến hơn Schnorr về security proof, scheme vẫn là **Schnorr-type** (cấu trúc 3-move với blinding tuyến tính). Vì vậy ROS attack vẫn áp dụng trong concurrent setting: adversary mở $\ell + 1$ session đồng thời, chọn challenges correlated theo ROS structure, và forge một chữ ký thứ $\ell + 1$ mà không đóng session thứ $\ell + 1$.
>
> Xem [[12-ros-attack|Lesson 12]] cho phân tích đầy đủ.

---

## So sánh Schnorr vs. Okamoto-Schnorr

| Tiêu chí | Schnorr Blind | Okamoto-Schnorr Blind |
|---|---|---|
| Secret key | $x \in \mathbb{Z}_q$ (1 phần tử) | $(r, s) \in \mathbb{Z}_q^2$ (2 phần tử) |
| Public key | $X = g^x$ | $y = g^{-r} h^{-s}$ |
| Witnesses per pk | 1 | $\infty$ (một coset) |
| Generator count | 1 ($g$) | 2 ($g, h$, DL unknown) |
| Signature size | $(R', c', s') \in \mathbb{G} \times \mathbb{Z}_q^2$ | $(\alpha, \varepsilon, \rho, \sigma) \in \mathbb{G} \times \mathbb{Z}_q^3$ |
| Sequential OMUF | DL (ROM + AGM) | DL (ROM) — cleaner proof |
| Concurrent OMUF | Broken (ROS) | Broken (ROS) |
| Blindness model | Honest-signer | Honest-signer |

---

## Summary

- Okamoto-Schnorr dùng **hai secret key** $(r, s)$ và **hai generator** $g, h$ (với $\log_g h$ không biết).
- Public key $y = g^{-r} h^{-s}$ có **vô số witnesses** — đây là **witness indistinguishability**.
- Blinding: ba tham số $(\beta, \gamma, \delta)$; blinded commitment $\alpha = a \cdot g^\beta \cdot h^\gamma \cdot y^\delta$.
- **Correctness**: $g^\rho h^\sigma y^\varepsilon = \alpha$ — algebra thẳng tắp.
- **Sequential OMUF** (DL in ROM): WI cho phép reduction tách signing witness khỏi extraction witness.
- **Concurrent OMUF bị phá**: Schnorr-type blinding → ROS attack vẫn áp dụng.
- Scheme đặt nền tảng lý thuyết cho Abe-Okamoto partially blind signature (Lesson 08).

---

## References

- Okamoto, T. — *Provably Secure and Practical Identification Schemes and Corresponding Signature Schemes*, CRYPTO 1992
- Pointcheval & Stern — *Security Arguments for Digital Signatures and Blind Signatures*, Journal of Cryptology 2000
- Hauck, Kiltz & Loss — *A Modular Treatment of Blind Signatures from Identification Schemes*, EUROCRYPT 2019
- Benhamouda et al. — *On the (In)Security of ROS*, EUROCRYPT 2021
