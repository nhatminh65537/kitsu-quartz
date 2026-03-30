---
title: "A1. Proof of Sylow Theorems"
tags: [math, group-theory, appendix]
created: 2026-03-26
---

> Bài học liên quan: [[08-sylow-theorems|08. Sylow Theorems]]

## Thiết lập ký hiệu

Cho $G$ hữu hạn với $|G| = p^a m$, $p$ nguyên tố, $p \nmid m$. Đặt $P \in \operatorname{Syl}_p(G)$ (tồn tại theo Định lý I).

---

## Chứng minh Định lý Sylow I (Tồn tại)

> [!abstract] Theorem 8.3 — Định lý Sylow I
> Tồn tại $P \leq G$ với $|P| = p^a$.

**Proof (quy nạp theo $|G|$).**

**Trường hợp cơ sở**: $|G| = 1$, hiển nhiên.

**Bước quy nạp**: Giả sử mọi nhóm có bậc nhỏ hơn $|G|$ đều có nhóm $p$-Sylow.

**Phân tích qua phương trình lớp**:

$$
|G| = |Z(G)| + \sum_{i} [G : C_G(x_i)]
$$

**Trường hợp 1**: $p \mid |Z(G)|$. Theo định lý Cauchy (hệ quả của quy nạp trên nhóm Abel), tồn tại $z \in Z(G)$ với $\operatorname{ord}(z) = p$. Đặt $N = \langle z \rangle \trianglelefteq G$ (chuẩn tắc vì $z \in Z(G)$). Xét $\bar{G} = G/N$ có $|\bar{G}| = |G|/p = p^{a-1}m$. Theo giả thiết quy nạp, $\bar{G}$ có nhóm con $\bar{P}$ bậc $p^{a-1}$. Gọi $P = \pi^{-1}(\bar{P})$ với $\pi : G \to \bar{G}$ hình chiếu. Khi đó $|P| = |\bar{P}| \cdot |N| = p^{a-1} \cdot p = p^a$.

**Trường hợp 2**: $p \nmid |Z(G)|$. Khi đó tồn tại $x_i$ sao cho $p \nmid [G : C_G(x_i)]$, tức $p^a \mid |C_G(x_i)|$. Vì $x_i \notin Z(G)$, ta có $|C_G(x_i)| < |G|$. Theo giả thiết quy nạp, $C_G(x_i)$ có nhóm $p$-Sylow $P$ bậc $p^a$. Nhưng $p^a \mid |C_G(x_i)|$ và $|C_G(x_i)| < |G|$, nên $p^a = $ lũy thừa cao nhất của $p$ chia $|C_G(x_i)|$ cũng là $p^a$. Vậy $P$ có bậc $p^a$ trong $G$. $\blacksquare$

---

## Chứng minh Định lý Sylow II (Liên hợp)

> [!abstract] Theorem 8.4 — Định lý Sylow II
> Nếu $P \in \operatorname{Syl}_p(G)$ và $Q$ là $p$-nhóm con bất kỳ, thì tồn tại $g \in G$ sao cho $Q \subseteq gPg^{-1}$.

**Proof.**
Cho $Q$ tác động lên $G/P$ bởi phép dịch trái: $q \cdot (xP) = qxP$.

Số orbit không nhất thiết là một, nhưng phân tích theo orbit:

$$
|G/P| = m = \sum_{\text{orbit } \mathcal{O}} |\mathcal{O}|
$$

Vì $|Q|$ là lũy thừa của $p$ và $p \nmid m$, phải tồn tại ít nhất một orbit $\mathcal{O}$ với $p \nmid |\mathcal{O}|$. Vì $|\mathcal{O}|$ cũng là lũy thừa của $p$ (theo Orbit-Stabilizer áp dụng cho action của $Q$), điều này buộc $|\mathcal{O}| = 1$, tức orbit singleton.

Gọi $\{xP\}$ là orbit singleton. Thì $q \cdot xP = xP$ với mọi $q \in Q$, tức $x^{-1}qx \in P$ với mọi $q \in Q$, tức $x^{-1}Qx \subseteq P$, tức $Q \subseteq xPx^{-1} = gPg^{-1}$ (với $g = x$).

Nếu $Q$ là Sylow thì $|Q| = p^a = |P|$, suy ra $Q = gPg^{-1}$. $\blacksquare$

---

## Chứng minh Định lý Sylow III (Đếm)

> [!abstract] Theorem 8.5 — Định lý Sylow III
> $n_p \mid m$ và $n_p \equiv 1 \pmod p$.

**Proof.**
Cho $G$ tác động lên $\operatorname{Syl}_p(G)$ bởi liên hợp: $g \cdot P = gPg^{-1}$.

Theo Định lý II, tất cả nhóm Sylow liên hợp với nhau, nên action này transitive. Vậy chỉ có một orbit gồm tất cả $n_p$ nhóm Sylow.

Stabilizer của $P$: $G_P = \left\{g : gPg^{-1} = P\right\} = N_G(P)$.

Theo Orbit-Stabilizer: $n_p = [G : N_G(P)]$.

**Chứng minh $n_p \mid m$**: Vì $P \subseteq N_G(P)$ và $|P| = p^a$, ta có $p^a \mid |N_G(P)|$. Từ Lagrange: $n_p = [G:N_G(P)] = |G|/|N_G(P)| \mid |G|/p^a = m$.

**Chứng minh $n_p \equiv 1 \pmod p$**: Lần này cho $P$ tác động lên $\operatorname{Syl}_p(G)$ bởi liên hợp. Điểm cố định của action này là $\{Q \in \operatorname{Syl}_p(G) : pQp^{-1} = Q\;\forall p \in P\}$.

Ta chứng minh $P$ là điểm cố định duy nhất: Nếu $Q$ là điểm cố định thì $P \subseteq N_G(Q)$. Trong $N_G(Q)$, cả $P$ và $Q$ đều là nhóm $p$-Sylow của $N_G(Q)$, nên liên hợp: $Q = nPn^{-1}$ với $n \in N_G(Q)$. Nhưng $Q \trianglelefteq N_G(Q)$, nên $Q = nPn^{-1} = Q$ chỉ khi $P = Q$.

Vậy action của $P$ lên $\operatorname{Syl}_p(G)$ có đúng $1$ điểm cố định. Mọi orbit khác có kích thước là bội số của $p$. Do đó $n_p \equiv 1 \pmod p$. $\blacksquare$

---

## References

- Dummit, D. S., & Foote, R. M. *Abstract Algebra* (3rd ed.), Theorems 18–20 (§4.5).
- Milne, J. S. *Group Theory* (v4.00), Chapter 5. https://www.jmilne.org/math/CourseNotes/GT.pdf
