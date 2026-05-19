---
title: "45. Pairings in Cryptography: From Theory to Practice"
type: application
tags: [math, abelian-varieties, lesson-45, pairing-cryptography, MOV-attack, bilinear-pairing]
aliases: [Pairings in Cryptography]
created: 2026-05-18
---

> **Prerequisites**: [[44-ordinary-vs-supersingular|44. Ordinary vs Supersingular AV]], [[33-weil-pairing-galois|33. Weil Pairing and Galois Representations]], [[31-properties-weil-pairing|31. Properties of the Weil Pairing]]
> **Objectives**:
> - Hiểu framework toán học của bilinear pairing trong mật mã học: ba nhóm $\mathbb{G}_1, \mathbb{G}_2, \mathbb{G}_T$ và các tính chất cần thiết
> - Phân tích cơ chế MOV attack và FR attack — cách Weil/Tate pairing biến ECDLP thành FFDLP
> - Hiểu khái niệm embedding degree và tại sao nó quyết định độ an toàn của đường cong
> - Nắm các ứng dụng constructive đầu tiên: Joux tripartite DH, Identity-Based Encryption

---

## Motivation / Intuition

Trong suốt lịch sử mật mã học, bài toán logarithm rời rạc (discrete logarithm problem — DLP) đóng vai trò trung tâm. Trên nhóm điểm của đường cong elliptic $E(\mathbb{F}_q)$, bài toán này — thường gọi là ECDLP — được tin là khó hơn đáng kể so với DLP trên nhóm nhân $\mathbb{F}_q^\times$ của trường hữu hạn. Đây là lý do khóa ECDSA chỉ cần 256 bit trong khi RSA cần 3072 bit để đạt cùng mức bảo mật.

Năm 1993, Menezes, Okamoto, và Vanstone phát hiện ra rằng: với một số đường cong đặc biệt, **Weil pairing** có thể "ánh xạ" ECDLP vào DLP trên $\mathbb{F}_{q^k}^\times$ — nơi các thuật toán sub-exponential như Number Field Sieve (NFS) hoạt động hiệu quả. Đây là MOV attack, và nó làm chấn động cộng đồng mật mã học.

Tuy nhiên, khoảng mười năm sau, Joux (2000) nhận ra rằng chính cơ chế tương tự — nếu được kiểm soát cẩn thận — lại tạo ra các **công cụ mật mã hoàn toàn mới** với chức năng mà mật mã khóa công khai truyền thống không thể đạt được: mã hóa dựa trên danh tính (Identity-Based Encryption), chữ ký ngắn có thể tổng hợp, và giao thức trao đổi khóa ba bên trong một vòng. Bài học này là bản lề giữa lý thuyết thuần túy và ứng dụng.

---

## Bilinear Pairing — Framework Mật Mã Học

### Định nghĩa Cơ Bản

Trong ngữ cảnh mật mã học, một **bilinear pairing** (ánh xạ song tuyến tính) được trừu tượng hóa thành công cụ làm việc với **ba nhóm cyclic**. Để đơn giản, ta trình bày theo phong cách của Galbraith–Paterson–Smart, vốn là cách tiếp cận chuẩn trong tài liệu mật mã học.

> [!definition] Definition 45.1 — Cryptographic Bilinear Pairing
>
> Cho $\mathbb{G}_1$, $\mathbb{G}_2$, $\mathbb{G}_T$ là các nhóm cyclic hữu hạn cùng bậc $r$ (viết theo lối nhân). Một **bilinear pairing mật mã** (cryptographic bilinear pairing) là một ánh xạ:
>
> $$
> e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T
> $$
>
> thỏa mãn ba tính chất:
>
> 1. **Song tuyến tính** (Bilinearity): Với mọi $P, P' \in \mathbb{G}_1$, $Q, Q' \in \mathbb{G}_2$:
>
> $$
> e(P \cdot P', Q) = e(P, Q) \cdot e(P', Q)
> $$
>
> $$
> e(P, Q \cdot Q') = e(P, Q) \cdot e(P, Q')
> $$
>
> Hệ quả ngay lập tức: với $a, b \in \mathbb{Z}$, $e([a]P, [b]Q) = e(P, Q)^{ab}$.
>
> 2. **Không suy biến** (Non-degeneracy): Nếu $e(P, Q) = 1_{\mathbb{G}_T}$ với mọi $Q \in \mathbb{G}_2$, thì $P = 1_{\mathbb{G}_1}$; và ngược lại.
>
> 3. **Tính toán được hiệu quả** (Efficient computability): Tồn tại thuật toán thời gian đa thức để tính $e(P, Q)$.

> [!note] Remark 45.2 — Ba loại pairing trong mật mã học
>
> Tùy vào mối quan hệ giữa $\mathbb{G}_1$ và $\mathbb{G}_2$, người ta phân loại:
>
> - **Type 1** (symmetric): $\mathbb{G}_1 = \mathbb{G}_2$. Thường xuất hiện trên các đường cong supersingular với distortion map.
> - **Type 2** (asymmetric, with homomorphism): $\mathbb{G}_1 \ne \mathbb{G}_2$ nhưng tồn tại homomorphism hiệu quả từ $\mathbb{G}_2 \to \mathbb{G}_1$ (không cần chiều ngược lại).
> - **Type 3** (fully asymmetric): $\mathbb{G}_1 \ne \mathbb{G}_2$ và không có homomorphism nào hiệu quả giữa chúng. Đây là loại an toàn và hiệu quả nhất trong thực tế hiện đại (ví dụ: BN254, BLS12-381).

### Kết Nối với Lý Thuyết Abelian Varieties

Trên elliptic curve $E/\mathbb{F}_q$, Weil pairing từ lý thuyết cho ta:

$$
e_r: E[r] \times \hat{E}[r] \to \mu_r \subset \overline{\mathbb{F}}_q^\times
$$

Vì $E$ có **principal polarization** $\phi: E \xrightarrow{\sim} \hat{E}$, ta có thể compose để nhận:

$$
e_r^{\phi}: E[r] \times E[r] \to \mu_r, \quad (P, Q) \mapsto e_r(P, \phi(Q))
$$

Đây là **pairing alternating** (skew-symmetric): $e_r^\phi(P, Q) = e_r^\phi(Q, P)^{-1}$.

Trong ngữ cảnh mật mã, ta chọn subgroup cụ thể. Đặt $r$ là số nguyên tố lớn chia $\#E(\mathbb{F}_q)$, và gọi $k$ là **embedding degree** (bậc nhúng) của $E$ với tham chiếu $r$:

> [!definition] Definition 45.3 — Embedding Degree (Bậc Nhúng)
>
> Cho $E/\mathbb{F}_q$ và số nguyên tố $r \mid \#E(\mathbb{F}_q)$, $r \nmid q$. **Embedding degree** (bậc nhúng) $k$ của $E$ đối với $r$ là số nguyên dương nhỏ nhất sao cho:
>
> $$
> r \mid q^k - 1
> $$
>
> Nói cách khác, $k = \operatorname{ord}_r(q)$ là bậc của $q$ trong nhóm nhân $(\mathbb{Z}/r\mathbb{Z})^\times$.

Ý nghĩa: $\mu_r \subset \mathbb{F}_{q^k}^\times$ (và $\mathbb{F}_{q^k}$ là trường nhỏ nhất chứa tất cả căn nguyên thủy $r$-th của đơn vị).

Khi đó:
$$
\mathbb{G}_1 = E(\mathbb{F}_q)[r], \quad \mathbb{G}_2 = E(\mathbb{F}_{q^k})[r] \cap \ker(\pi_q - [q]) \quad (\text{hoặc biến thể tùy loại pairing}), \quad \mathbb{G}_T = \mu_r \subset \mathbb{F}_{q^k}^\times
$$

> [!example] Example 45.4 — Supersingular Curve với $k = 2$
>
> Xét $E: y^2 = x^3 + x$ trên $\mathbb{F}_{631}$. Đây là đường cong supersingular (trace of Frobenius $t = 0$, $\#E(\mathbb{F}_{631}) = 632 = 8 \times 79$).
>
> Với $r = 79$: ta cần tìm nhỏ nhất $k$ sao cho $79 \mid 631^k - 1$.
>
> - $631 \equiv 631 \pmod{79}$. Ta tính: $631 = 7 \times 79 + 78$, vậy $631 \equiv -1 \pmod{79}$.
> - $631^2 \equiv (-1)^2 = 1 \pmod{79}$.
>
> Vậy $k = 2$: $\mathbb{G}_T = \mu_{79} \subset \mathbb{F}_{631^2}^\times$.
>
> Weil pairing cho: $e_{79}: E(\mathbb{F}_{631})[79] \times E(\mathbb{F}_{631^2})[79] \to \mu_{79} \subset \mathbb{F}_{631^2}^\times$.

---

## MOV Attack — Pairing như Vũ Khí Phá Mã

### Ý Tưởng Cốt Lõi

MOV attack (Menezes–Okamoto–Vanstone, 1993) là đòn tấn công kinh điển nhất sử dụng pairing. Ý tưởng: nếu $E$ có embedding degree $k$ nhỏ, ta có thể **chuyển đổi** bài toán ECDLP thành bài toán DLP trong trường hữu hạn $\mathbb{F}_{q^k}^\times$.

> [!abstract] Theorem 45.5 — MOV Reduction
>
> Cho $E/\mathbb{F}_q$, $r$ số nguyên tố, $P \in E(\mathbb{F}_q)[r]$, $Q = [s]P$ là một điểm cần tìm $s$ (bài toán ECDLP). Giả sử embedding degree $k$ là nhỏ. Thì:
>
> 1. Chọn một điểm $T \in E(\mathbb{F}_{q^k})[r]$ sao cho $e_r(P, T) \ne 1$ (non-trivial pairing).
> 2. Tính $\alpha = e_r(P, T) \in \mu_r \subset \mathbb{F}_{q^k}^\times$.
> 3. Tính $\beta = e_r(Q, T) = e_r([s]P, T) = e_r(P,T)^s = \alpha^s$.
> 4. Giải bài toán DLP: tìm $s$ sao cho $\alpha^s = \beta$ trong $\mathbb{F}_{q^k}^\times$.

**Proof.**
Bước 3 sử dụng tính bilinear của Weil pairing: $e_r([s]P, T) = e_r(P, T)^s$.

Bước 4 là DLP trên nhóm cyclic $\langle \alpha \rangle \subset \mathbb{F}_{q^k}^\times$, có thể giải bằng Index Calculus trong thời gian sub-exponential $L_{q^k}[\frac{1}{3}, c]$ (với hàm $L$ Lenstra).

Để attack có ý nghĩa: cần $q^k$ đủ nhỏ để Index Calculus khả thi. $\blacksquare$

> [!example] Example 45.6 — MOV Attack Walkthrough (Toy Example)
>
> **Setup**: $E: y^2 = x^3 + x$ trên $\mathbb{F}_{631}$. Nhóm $\mathbb{G}_1 = E(\mathbb{F}_{631})[79]$ với generator $P = (36, 60)$.
>
> Bài toán: cho $Q = [s]P = (121, 387)$, tìm $s$.
>
> **Bước 1**: Chọn $T \in E(\mathbb{F}_{631^2})[79]$, $T \notin E(\mathbb{F}_{631})$.
>
> Ví dụ $T = (36 + 203\sqrt{-1}, 60 + 111\sqrt{-1})$ trong $\mathbb{F}_{631^2} = \mathbb{F}_{631}[i]/(i^2+1)$.
>
> **Bước 2**: Tính $\alpha = e_{79}(P, T) \in \mu_{79} \subset \mathbb{F}_{631^2}^\times$.
>
> **Bước 3**: Tính $\beta = e_{79}(Q, T) = \alpha^s$.
>
> **Bước 4**: Giải DLP $\alpha^s = \beta$ trong $\mathbb{F}_{631^2}^\times$. Với $q^k = 631^2 \approx 4 \times 10^5$, Baby-step Giant-step là khả thi trong ví dụ toy này.
>
> Trên máy tính thực, bài toán có thể được giải bằng thuật toán Pohlig–Hellman hoặc Index Calculus trong $\mathbb{F}_{q^k}^\times$.

### Điều Kiện Để MOV Attack Không Khả Dụng

> [!info] Property 45.7 — Tiêu Chí An Toàn Chống MOV
>
> Đường cong $E/\mathbb{F}_q$ với $r \mid \#E(\mathbb{F}_q)$ được coi là **an toàn trước MOV attack** nếu embedding degree $k \geq \log_2(r) / 8$.
>
> Lý do: với điều kiện này, $\mathbb{F}_{q^k}$ có kích thước ít nhất $q^{\log_2(r)/8}$. Vì $q \approx r$ (thông thường $q$ và $r$ có kích thước tương đương), ta có $\#\mathbb{F}_{q^k}^\times \approx r^{k} \approx r^{\log_2 r / 8}$, đủ lớn để Index Calculus không hiệu quả hơn giải trực tiếp ECDLP.
>
> **Kết quả của Balasubramanian–Koblitz (1998)**: Với một đường cong ngẫu nhiên trên $\mathbb{F}_p$, xác suất để $k \leq B$ là cực kỳ nhỏ (roughly $B/r$). Vậy **hầu hết** đường cong elliptic ngẫu nhiên an toàn trước MOV attack.

> [!warning] Counterexample 45.8 — Supersingular Curves Luôn Có $k \leq 6$
>
> Các đường cong **supersingular** (đặc trưng $p > 3$) có embedding degree $k \in \{1, 2, 3, 4, 6\}$, rất nhỏ so với yêu cầu $k \geq \log_2 r / 8$ (thường $\geq 30$ với tham số thực tế). Đây là lý do supersingular curves **tuyệt đối không được dùng** trong ECDSA/ECDH thông thường.
>
> Tuy nhiên, chính vì embedding degree nhỏ mà supersingular curves được **cố tình chọn** cho pairing-based cryptography, nơi ta muốn pairing có thể tính được hiệu quả!

---

## FR Attack — Frey–Rück và Tate Pairing

Frey và Rück (1994) độc lập phát hiện rằng **Tate pairing** (mà ta sẽ học chi tiết trong bài 46) cũng cho phép tấn công tương tự. FR attack về cơ bản hoạt động giống MOV nhưng dùng Tate-Lichtenbaum pairing thay vì Weil pairing.

> [!note] Remark 45.9 — So Sánh MOV và FR
>
> | Thuộc tính | MOV Attack | FR Attack |
> |-----------|-----------|----------|
> | Pairing dùng | Weil pairing $e_r$ | Tate-Lichtenbaum pairing $\tau_r$ |
> | Input | $E[r] \times E[r] \to \mu_r$ | $E(\mathbb{F}_q)[r] \times E(\mathbb{F}_{q^k})/rE(\mathbb{F}_{q^k}) \to \mu_r$ |
> | Tính toán | 2 Miller loops | 1 Miller loop + final exponentiation |
> | Độ khó | Tương đương | FR thường nhanh hơn trong thực tế |
> | Điều kiện | $k$ nhỏ | $k$ nhỏ |
>
> Cả hai attack đều tấn công **cùng một điểm yếu**: embedding degree nhỏ.

---

## Từ Vũ Khí Đến Công Cụ Sáng Tạo

### Joux's Tripartite Diffie–Hellman (2000)

Đây là bước ngoặt lịch sử: **lần đầu tiên** pairing được dùng cho mục đích constructive thay vì tấn công.

Giao thức Diffie–Hellman truyền thống (2-party) yêu cầu $O(n^2)$ trao đổi cho $n$ bên. Với $n = 3$ (ba người: Alice, Bob, Carol), cần ít nhất 2 vòng trao đổi trong mô hình không tương tác từng cặp.

> [!abstract] Theorem 45.10 — Joux Tripartite DH
>
> Cho $e: \mathbb{G}_1 \times \mathbb{G}_1 \to \mathbb{G}_T$ là pairing symmetric (Type 1), $P$ là generator của $\mathbb{G}_1$.
>
> **Setup**: Alice, Bob, Carol chọn bí mật ngẫu nhiên $a, b, c \in \mathbb{Z}_r$ tương ứng.
>
> **Round 1** (broadcast công khai, không tương tác):
> - Alice gửi: $[a]P$
> - Bob gửi: $[b]P$
> - Carol gửi: $[c]P$
>
> **Tính khóa chung**: Mỗi bên tính **cùng** một giá trị:
> - Alice: $e([b]P, [c]P)^a = e(P, P)^{abc}$
> - Bob: $e([a]P, [c]P)^b = e(P, P)^{abc}$
> - Carol: $e([a]P, [b]P)^c = e(P, P)^{abc}$
>
> Kết quả: **khóa chung** $K = e(P,P)^{abc} \in \mathbb{G}_T$, đạt được trong **một vòng** duy nhất!

**Proof.**
Bilinearity cho ta: $e([b]P, [c]P) = e(P,P)^{bc}$. Lũy thừa lên $a$: $e(P,P)^{abc}$. Các phép tính của Bob và Carol tương tự bằng đối xứng. $\blacksquare$

> [!note] Remark 45.11 — Tại Sao Điều Này Quan Trọng?
>
> Không có pairing, giao thức 1-round cho 3 bên là **bài toán mở**. Joux's protocol là bằng chứng rằng pairing tạo ra chức năng mới hoàn toàn. Nó cũng gợi mở bài toán 4-party 1-round: hiện vẫn **chưa được giải** không dùng pairing bậc cao.

### Identity-Based Encryption — IBE

Boneh và Franklin (2001) xây dựng hệ mã hóa dựa trên danh tính (Identity-Based Encryption — IBE) từ pairing. Ý tưởng cốt lõi: **public key của ai đó là chính danh tính của họ** (ví dụ: địa chỉ email).

Sơ đồ hoạt động ở mức cao:

- **Setup**: KGC (Key Generation Center) chọn bí mật master key $s$ và công bố $[s]P$ là public parameter.
- **Extract** (cấp private key): Khi Alice muốn có private key cho email `alice@example.com`, KGC tính $d_A = [s] \cdot H(\texttt{alice@example.com})$ (hash email lên curve).
- **Encrypt**: Bob muốn gửi cho Alice, chỉ cần biết địa chỉ email — không cần PKI hay certificate. Bob dùng $H(\texttt{alice@example.com}) \in E$ làm public key.
- **Decrypt**: Alice dùng $d_A$ kết hợp với pairing để giải mã.

> [!note] Remark 45.12 — Vấn Đề Key Escrow
>
> IBE có nhược điểm: KGC biết tất cả private keys (key escrow). Đây là sự đánh đổi thiết kế. Trong nhiều ứng dụng doanh nghiệp (email nội bộ, end-to-end encryption trong tổ chức), điều này là chấp nhận được. Với anonymous communication, cần các variant như Hierarchical IBE (HIBE).

---

## Pairing-Friendly Curves — Chọn Tham Số Đúng

### Yêu Cầu Mâu Thuẫn

Để pairing vừa **an toàn** vừa **tính toán được hiệu quả**, ta cần:

- $k$ đủ **lớn** để DLP trong $\mathbb{F}_{q^k}^\times$ không bị tấn công (tránh MOV/FR attack).
- $k$ đủ **nhỏ** để phép tính trong $\mathbb{F}_{q^k}$ không quá chậm.

Đây là mâu thuẫn cơ bản. Curve ngẫu nhiên thường có $k$ rất lớn (khó tính pairing), curve supersingular có $k \leq 6$ (không an toàn cho ECDH nhưng phù hợp pairing).

> [!definition] Definition 45.13 — Pairing-Friendly Curve
>
> Đường cong $E/\mathbb{F}_q$ được gọi là **pairing-friendly** (thân thiện với pairing) đối với số nguyên tố $r$ nếu:
>
> 1. $r \mid \#E(\mathbb{F}_q)$ với $r$ đủ lớn ($r > 2^{100}$ trong thực tế).
> 2. Embedding degree $k$ thỏa mãn: $r \approx q$ (để tránh Pohlig–Hellman) và $k$ "vừa phải" ($k \in \{6, 12, 24, \ldots\}$ tùy mức bảo mật).
> 3. $q^k$ có kích thước phù hợp mức bảo mật mong muốn (128-bit security đòi $q^k \approx 2^{3072}$).

> [!example] Example 45.14 — Các Đường Cong Pairing-Friendly Nổi Tiếng
>
> | Đường cong | $k$ | Đặc trưng $p$ | Mức bảo mật | Ứng dụng |
> |-----------|-----|--------------|------------|---------|
> | Supersingular over $\mathbb{F}_{2^m}$ | 4 | 2 | Thấp (bị tấn công Weil descent) | Lịch sử |
> | Supersingular over $\mathbb{F}_{3^m}$ | 6 | 3 | Thấp | Lịch sử |
> | BN254 | 12 | 254-bit prime | ~100 bits (sau exTNFS) | Ethereum 1.0, zcash cũ |
> | BN462 | 12 | 462-bit prime | ~128 bits | NIST recommendation |
> | BLS12-381 | 12 | 381-bit prime | ~128 bits | **Ethereum 2.0, Zcash, Filecoin** |
> | BLS24-315 | 24 | 315-bit prime | ~128 bits | Nghiên cứu |
> | KSS16-330 | 16 | 330-bit prime | ~128 bits | Nghiên cứu |

---

## SageMath Cheatsheet

```sage
# ===== Kiểm tra embedding degree =====
p = 631
F = GF(p)
E = EllipticCurve(F, [1, 0])  # y^2 = x^3 + x (supersingular khi p ≡ 3 mod 4)
n = E.order()
print("Order #E(F_p):", n)

# Tìm factor r nguyên tố lớn
r = factor(n)
print("Factorization:", r)

# Embedding degree với r = 79
r_prime = 79
k = 1
while (p^k - 1) % r_prime != 0:
    k += 1
print("Embedding degree k =", k)  # Kết quả: k = 2

# ===== Weil pairing =====
P = E.gens()[0]          # Generator của E(F_p)
# Để tính Weil pairing cần điểm trên F_{p^k}
F2 = GF(p^2, 'a')
E2 = EllipticCurve(F2, [1, 0])
P2 = E2(P)               # Nâng P lên F_{p^2}
Q = E2.random_point()    # Lấy điểm ngẫu nhiên trong E(F_{p^2})

# Scale về r-torsion
r_val = 79
P_r = (n // r_val) * P2
Q_r = (E2.order() // r_val) * Q

w = P_r.weil_pairing(Q_r, r_val)
print("Weil pairing value:", w)
print("Is root of unity?", w^r_val == 1)

# ===== MOV Attack Skeleton =====
# Giả sử P, Q đã được định nghĩa và Q = [s]P
# Bước 1: Chọn T ngẫu nhiên trong E(F_{p^k})[r]
for _ in range(100):
    T = E2.random_point()
    T_r = (E2.order() // r_val) * T
    alpha = P_r.weil_pairing(T_r, r_val)
    if alpha != F2(1):
        break  # Tìm được T với pairing non-trivial
        
beta = Q_r.weil_pairing(T_r, r_val)
# Giải DLP: beta = alpha^s trong F_{p^2}*
# discrete_log(beta, alpha)  # SageMath hỗ trợ
```

---

## Summary / Key Takeaways

- **Bilinear pairing** trong mật mã học là ánh xạ $e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$ với ba tính chất: bilinearity, non-degeneracy, efficient computability.
- **Hệ quả bilinearity quan trọng nhất**: $e([a]P, [b]Q) = e(P, Q)^{ab}$ — "số mũ có thể hoán vị qua pairing".
- **MOV attack** (Menezes–Okamoto–Vanstone 1993): dùng Weil pairing để chuyển ECDLP trên $E(\mathbb{F}_q)$ thành DLP trong $\mathbb{F}_{q^k}^\times$ khi embedding degree $k$ nhỏ.
- **FR attack** (Frey–Rück 1994): tương tự nhưng dùng Tate pairing — hiệu quả hơn vì chỉ cần 1 Miller loop.
- **Điều kiện an toàn**: embedding degree $k \geq \log_2(r)/8$ đảm bảo MOV/FR không khả dụng.
- **Supersingular curves**: embedding degree $k \leq 6$, không an toàn cho ECDH thông thường, nhưng **cố ý dùng** cho pairing-based crypto.
- **Bước ngoặt Joux (2000)**: tripartite DH trong 1 round — lần đầu pairing dùng constructively.
- **Pairing-friendly curves** giải quyết mâu thuẫn bảo mật/hiệu năng: BLS12-381 với $k = 12$ là chuẩn de facto hiện nay.
- Lý thuyết từ Module 1–7 không chỉ là toán học thuần túy: Weil pairing, Tate module, Frobenius đều có ứng dụng crypto trực tiếp.

---

## References

1. **Menezes, A., Okamoto, T., Vanstone, S.** — "Reducing Elliptic Curve Logarithms to Logarithms in a Finite Field", *IEEE Trans. Information Theory*, 39 (1993), 1639–1646. *(Bài báo gốc MOV attack)*
2. **Frey, G., Rück, H.-G.** — "A Remark Concerning $m$-Divisibility and the Discrete Logarithm in the Divisor Class Group of Curves", *Mathematics of Computation*, 62 (1994), 865–874. *(FR attack)*
3. **Joux, A.** — "A One Round Protocol for Tripartite Diffie–Hellman", *ANTS IV*, LNCS 1838, Springer (2000), 385–394. *(Tripartite DH)*
4. **Boneh, D., Franklin, M.** — "Identity-Based Encryption from the Weil Pairing", *CRYPTO 2001*, LNCS 2139, Springer (2001), 213–229.
5. **Galbraith, S., Paterson, K., Smart, N.** — "Pairings for Cryptographers", *Discrete Applied Mathematics*, 156 (2008), 3113–3121. *(Framework phân loại Type 1/2/3)*
6. **Freeman, D., Scott, M., Teske, E.** — "A Taxonomy of Pairing-Friendly Elliptic Curves", *J. Cryptology*, 23 (2010), 224–280. *(Phân loại đường cong)*
7. **Menezes, A.** — "An Introduction to Pairing-Based Cryptography", *Lectures on Mathematics in the Sciences*, 53 (2005). Online: www.math.uwaterloo.ca/~ajmeneze/publications/pairings.pdf
8. **Balasubramanian, R., Koblitz, N.** — "The Improbability That an Elliptic Curve Has Subexponential Discrete Log Problem under the Menezes–Okamoto–Vanstone Algorithm", *J. Cryptology*, 11 (1998), 141–145.
9. **Washington, L.C.** — *Introduction to Elliptic Curves and Cryptography*, 2nd ed., Cambridge University Press (2008). Ch. 6.
10. **Silverman, J.H.** — *The Arithmetic of Elliptic Curves*, 2nd ed., Springer GTM 106 (2009). Ch. XI.
