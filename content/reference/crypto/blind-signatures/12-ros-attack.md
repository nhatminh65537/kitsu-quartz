---
title: "12. Attack II — The ROS Attack"
type: attack
tags: [crypto, blind-signature, ros, wagner, attack, concurrent, lesson-12]
aliases: [ROS Attack, Random inhomogeneities Overdetermined Solvable, Wagner Birthday Attack]
created: 2026-05-13
---

> **Prerequisites**: [[03-schnorr-blind-signature|03. Schnorr Blind Signature]], [[04-okamoto-schnorr-blind-signature|04. Okamoto-Schnorr Blind Signature]], [[10-forking-lemma-blind-signatures|10. Forking Lemma]]
> **Lesson type**: Attack
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $p$ | Bậc nguyên tố của group $\mathbb{G}$ (thay cho $q$ trong Lessons 03/04) |
> | $\lambda$ | Security parameter, $\lambda = \lceil \log_2 p \rceil$ |
> | $\ell$ | Số concurrent signing sessions adversary mở |
> | $H_\mathsf{ros}$ | Random oracle dùng trong ROS game, range $\mathbb{Z}_p$ |
> | $\hat{\rho}_i \in \mathbb{Z}_p^\ell$ | Coefficient vector do adversary chọn cho session $i$ |
> | $c = (c_1,\ldots,c_\ell) \in \mathbb{Z}_p^\ell$ | Vector challenge cần tìm |
> | $\langle \cdot, \cdot \rangle$ | Inner product modulo $p$ |
> | $Q$ | Tổng số hash queries của adversary |

---

## Context & Conditions

Attack này phá vỡ **concurrent One-More Unforgeability (OMUF)** của các blind signature scheme dựa trên identification protocol 3-move:

- Schnorr blind signature (Lesson 03)
- Okamoto-Schnorr blind signature (Lesson 04)
- Abe-Okamoto partially blind signature (Lesson 08)
- Threshold/multi-signatures: FROST (original), MuSig2 (two-round), CoSI
- Conditional blind signatures: ZGP17

Điều kiện cần: adversary có thể mở **nhiều sessions đồng thời** (concurrent). Với sequential model, attack không hoạt động (xem Lesson 10).

> [!warning] Impact thực tế
> Nếu server cho phép nhiều signing request xử lý song song — ví dụ một web server xử lý hàng nghìn session mỗi giây — thì Schnorr blind signature bị phá trong thực tế. Benhamouda et al. (2021) cho thấy với $\ell = 256$ parallel sessions trên secp256k1, forgery chạy trong vài giây trên commodity hardware.

---

## ROS Problem — Định nghĩa Chính Thức

> [!note] Definition 12.1 — ROS Problem (Random inhomogeneities in an Overdetermined Solvable system)
> **Tham số**: Số nguyên tố $p$; random oracle $H_\mathsf{ros} : \{0,1\}^* \to \mathbb{Z}_p$; số sessions $\ell$.
>
> **Game $\mathsf{ROS}_{\ell,p}$**: Adversary $\mathcal{A}$ có oracle access đến $H_\mathsf{ros}$. $\mathcal{A}$ phải xuất ra:
> - $(\ell+1)$ cặp $(\hat{\rho}_i, \mathsf{aux}_i)$ với $\hat{\rho}_i \in \mathbb{Z}_p^\ell$ pairwise distinct.
> - Vector $c = (c_1, \ldots, c_\ell) \in \mathbb{Z}_p^\ell$.
>
> **Win condition**: Với mọi $i \in [\ell+1]$:
>
> $$
> H_\mathsf{ros}(\hat{\rho}_i, \mathsf{aux}_i) = \langle \hat{\rho}_i, c \rangle \pmod{p}
> $$
>
> Nói cách khác: tìm $c$ sao cho $\ell+1$ hash values đều bằng inner product của coefficient vectors tương ứng với $c$.

Tại sao gọi là "overdetermined"? Hệ này có $\ell+1$ phương trình nhưng chỉ $\ell$ ẩn số $(c_1, \ldots, c_\ell)$ — về mặt algebraic là overdetermined, và với random oracle thì không có nghiệm hiển nhiên. Tuy nhiên adversary có thể **chọn** $\hat{\rho}_i$ một cách khéo léo để tạo ra nghiệm.

---

## Connection đến Blind Signature OMUF

Để thấy ROS liên hệ thế nào với OMUF của Schnorr blind signature, nhớ lại protocol: trong mỗi session $i$, Signer gửi commitment $R_i = g^{k_i}$, User trả challenge $c_i$, Signer trả response $s_i = k_i - x \cdot c_i$.

Sau $\ell$ sessions, adversary có $\ell$ triples $(R_i, c_i, s_i)$ và muốn tạo thêm một signature $(R^*, c^*, s^*)$ hợp lệ (forgery thứ $\ell+1$) mà không cần session mới.

> [!info] Cách dùng ROS solver để forge
> Nếu adversary giải được ROS với $c = (c_1, \ldots, c_\ell)$ và $c^* = H_\mathsf{ros}(\hat{\rho}_{\ell+1})$:
>
> - **Khởi tạo**: Gửi $\ell$ sessions đến Signer, nhận $\ell$ nonces $R_1, \ldots, R_\ell$.
> - **Tính challenges**: Dùng $\hat{\rho}_i$ và $c_i$ từ ROS solution, tính blinded challenge $c_i$ cho mỗi session.
> - **Collect responses**: Thu $s_i = k_i - x c_i$ từ Signer.
> - **Forge**: Tạo $R^* = \prod g^{\hat{\rho}_{i,j} \cdot \alpha_j}$ (linear combination phù hợp), $c^* = c^*_{\ell+1}$, $s^* = \sum \hat{\rho}_{\ell+1,i} \cdot s_i$.

Bằng cách này, adversary tạo được một signature hợp lệ thứ $\ell+1$ chỉ từ $\ell$ sessions — vi phạm OMUF.

---

## Wagner's Sub-exponential Attack (2002)

David Wagner (CRYPTO 2002) đưa ra thuật toán giải **$k$-list birthday problem** tổng quát, từ đó giải ROS trong thời gian sub-exponential.

> [!note] $k$-List Birthday Problem
> Cho $k$ danh sách $L_1, \ldots, L_k$ mỗi danh sách chứa các phần tử ngẫu nhiên trong $\mathbb{Z}_p$. Tìm $x_i \in L_i$ sao cho $x_1 + x_2 + \cdots + x_k \equiv 0 \pmod{p}$.

Wagner's algorithm giải bài toán này trong thời gian $O\!\left(\ell \cdot 2^{\lceil \log p \rceil/(1 + \lfloor \log \ell \rfloor)}\right)$ — sub-exponential theo $p$ nhưng growing khi $\ell$ tăng.

**Áp dụng vào ROS**: Đặt $k = \ell+1$, mỗi list $L_i$ chứa các giá trị $H_\mathsf{ros}(\hat{\rho}_i)$ khi $\hat{\rho}_i$ thay đổi. Cần tìm $\hat{\rho}_1, \ldots, \hat{\rho}_{\ell+1}$ sao cho $\sum H_\mathsf{ros}(\hat{\rho}_i) \equiv 0$.

Với $\ell = O(\log p)$ (polylog sessions), complexity của Wagner đã đủ thực tế: khoảng $2^{45}$ operations cho 256-bit group.

---

## Benhamouda et al. — Polynomial-Time ROS Solver (2021)

EUROCRYPT 2021 đánh dấu bước ngoặt: Benhamouda et al. đưa ra thuật toán giải ROS trong **thời gian đa thức** khi $\ell \geq \log_2 p$.

> [!abstract] Theorem 12.2 — Polynomial-Time ROS (Benhamouda et al. 2021)
> Nếu $\ell \geq \lambda = \lceil \log_2 p \rceil$, tồn tại adversary chạy trong polynomial time giải ROS problem với xác suất $1$.

**Proof sketch — Binary decomposition trick.** Ý tưởng chính: với $\ell = \lambda$ sessions, adversary chọn coefficient vectors sau:

**Rows 1 đến $\ell$ (trivial)**: $\hat{\rho}_i = e_i$ (unit vector — $1$ tại vị trí $i$, $0$ ở các vị trí khác). Khi đó $\langle e_i, c \rangle = c_i$. Adversary chọn $\mathsf{aux}_i$ sao cho $H_\mathsf{ros}(e_i, \mathsf{aux}_i) = c_i$ — nhưng $c_i$ chưa biết!

Giải pháp: adversary *tự định nghĩa* $c_i := H_\mathsf{ros}(e_i, \mathsf{aux}_i)$ — đây là free choice vì adversary control $\mathsf{aux}_i$.

**Row $\ell+1$ (target)**: Cần $\langle \hat{\rho}_{\ell+1}, c \rangle = H_\mathsf{ros}(\hat{\rho}_{\ell+1}, \mathsf{aux}_{\ell+1})$.

Đặt $y = H_\mathsf{ros}(\hat{\rho}_{\ell+1}, \mathsf{aux}_{\ell+1})$ (query oracle trước). Viết $y$ trong biểu diễn nhị phân:

$$
y = \sum_{j=1}^{\lambda} b_j \cdot 2^{j-1} \pmod{p}, \quad b_j \in \{0, 1\}
$$

Đặt $\hat{\rho}_{\ell+1} = (b_1, b_2, \ldots, b_\lambda)$. Khi đó:

$$
\langle \hat{\rho}_{\ell+1}, c \rangle = \sum_{j=1}^{\lambda} b_j \cdot c_j = \sum_{j=1}^{\lambda} b_j \cdot H_\mathsf{ros}(e_j, \mathsf{aux}_j)
$$

Cần $\sum b_j \cdot c_j = y$. Vì $c_j = H_\mathsf{ros}(e_j, \mathsf{aux}_j)$ và adversary control $\mathsf{aux}_j$: đặt $c_j = 2^{j-1}$ bằng cách tìm $\mathsf{aux}_j$ sao cho $H_\mathsf{ros}(e_j, \mathsf{aux}_j) = 2^{j-1}$. Điều này cần khoảng $p$ oracle queries cho mỗi $j$ (birthday) — tuy nhiên tổng số queries là $\lambda \cdot p^{1/2}$ (birthday collision) = polynomial.

Do đó: $\langle \hat{\rho}_{\ell+1}, c \rangle = \sum b_j \cdot 2^{j-1} = y = H_\mathsf{ros}(\hat{\rho}_{\ell+1})$. Tất cả $\ell+1$ ràng buộc thỏa mãn. $\blacksquare$

![[assets/img-12-ros-attack-structure.png]]
*Cấu trúc overdetermined linear system trong ROS attack: $\ell$ trivial rows (xanh lá) với unit vectors, row $\ell+1$ màu xanh dương với binary decomposition $(\rho_1,\ldots,\rho_\ell)$ của hash target $y$.*

---

## SageMath Sketch — Binary Decomposition

```sage
def ros_attack_polynomial(p, H_ros, aux_generator):
    lam = ceil(log(p, 2))
    c = []
    aux_trivial = []
    for j in range(lam):
        target_cj = pow(2, j, p)
        aux_j = aux_generator.find_preimage(target_cj)
        c.append(target_cj)
        aux_trivial.append(aux_j)

    aux_target = aux_generator.fresh()
    y = H_ros(aux_target)
    bits = [(y >> j) & 1 for j in range(lam)]

    rho_target = vector(GF(p), bits)
    check = sum(bits[j] * c[j] for j in range(lam)) % p
    assert check == y, "ROS constraint violated"
    return c, rho_target, aux_trivial, aux_target
```

---

## Impact — Các Scheme Bị Ảnh Hưởng

| Scheme | Setting | Concurrent sessions cần | Complexity |
|--------|---------|-------------------------|------------|
| Schnorr blind sig | $\mathbb{Z}_p^*$ | $\ell \geq \log p \approx 256$ | Polynomial |
| Okamoto-Schnorr blind sig | $\mathbb{Z}_p^*$ | $\ell \geq \log p$ | Polynomial |
| Abe-Okamoto partially blind | $\mathbb{Z}_p^*$ | $\ell \geq \log p$ | Polynomial |
| FROST (original) | EC group | $\ell \geq \log p$ | Polynomial |
| MuSig2 two-round | EC group | $\ell \geq \log p$ | Polynomial |
| CoSI | $\mathbb{Z}_p^*$ | $\ell \geq \log p$ | Polynomial |

> [!info] Schemes không bị ảnh hưởng
> - **Chaum RSA blind signature**: không dựa trên ROS structure.
> - **Blind BLS (Boldyreva)**: security dựa trên Gap-DH, không liên quan đến ROS.
> - **Fischlin's round-optimal scheme**: dùng cut-and-choose, concurrently secure by design.
> - **Schnorr blind sig với Clause variant** (Fuchsbauer-Plouviez-Seurin 2020): dựa trên modified ROS assumption.

---

## Mitigation

**Giới hạn số concurrent sessions**: Ép adversary phải sequential. Với $\ell < \log p$, chỉ có Wagner sub-exponential attack. Với $\ell \leq 1$ (sequential), Forking Lemma prove security. **Thực tế**: web server lớn xử lý millions sessions → giới hạn $256$ sessions là bất khả thi.

**Chuyển sang scheme concurrently secure**: Blind BLS, Fischlin, hoặc blind RSA-PSS (IETF RFC draft).

**Clause Schnorr (Fuchsbauer et al. 2020)**: Thêm "clause" vào protocol, dựa trên modified ROS hardness — chưa có polynomial-time attack nhưng đây là assumption mới chưa được phân tích kỹ.

---

## Summary

- **ROS problem**: Tìm $c \in \mathbb{Z}_p^\ell$ sao cho $H_\mathsf{ros}(\hat{\rho}_i) = \langle \hat{\rho}_i, c \rangle$ cho $\ell+1$ vectors.
- **Wagner (2002)**: Sub-exponential attack $O(\ell \cdot 2^{\log p / \log \ell})$ — đủ nguy hiểm cho $\ell = O(\log p)$.
- **Benhamouda et al. (2021)**: Polynomial-time khi $\ell \geq \log p$ — dùng binary decomposition trick.
- **Impact**: Schnorr, Okamoto-Schnorr, Abe-Okamoto, FROST, MuSig2 đều bị phá trong concurrent setting với $\ell$ đủ lớn.
- **Fix**: Dùng scheme không dựa trên ROS hardness: Blind BLS, Fischlin, Blind RSA-PSS.

---

## References

- Benhamouda, F. et al. — *On the (In)Security of ROS*, EUROCRYPT 2021; ePrint 2020/945
- Wagner, D. — *A Generalized Birthday Problem*, CRYPTO 2002
- Schnorr, C.P. — *Security of Blind Discrete Log Signatures against Interactive Attacks*, ICICS 2001
- Fuchsbauer, G., Plouviez, A., Seurin, Y. — *Blind Schnorr Signatures and Signed ElGamal Encryption in the Algebraic Group Model*, EUROCRYPT 2020
