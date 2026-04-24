---
title: "24. Digital Signatures Zoo"
type: scheme
tags: [crypto, signature, BLS, blind-signature, ring-signature, threshold, schnorr]
aliases: [Digital Signatures, Signature]
created: 2026-04-18
---

> **Prerequisites**: [[21-ecdh-ecdsa|21. ECDH & ECDSA]], [[20-ecc-fundamentals|20. ECC Fundamentals]], [[15-rsa-fundamentals|15. RSA Fundamentals]], [[30-secret-sharing|30. Secret Sharing]] *(optional)*  
> **Lesson type**: Scheme
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{G}_1, \mathbb{G}_2$ | Các nhóm điểm elliptic curve bậc nguyên tố $r$, dùng trong pairing |
> | $\mathbb{G}_T$ | Target group của bilinear pairing, subgroup của $\mathbb{F}_{p^k}^*$ |
> | $e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$ | Bilinear pairing (Ate/Weil/Tate) |
> | $g_1, g_2$ | Generators của $\mathbb{G}_1, \mathbb{G}_2$ |
> | $H: \{0,1\}^* \to \mathbb{G}_1$ | Hash-to-curve function |
> | $\mathsf{sk}, \mathsf{pk}$ | Secret key, public key |
> | $\sigma$ | Chữ ký (signature) |
> | $\mathsf{EUF\text{-}CMA}$ | Existential Unforgeability under Chosen Message Attack |

---

## 1. Motivation

Sau khi nghiên cứu ECDSA và EdDSA — hai scheme chuẩn được dùng phổ biến nhất — chúng ta đứng trước câu hỏi: *Ngoài "ký một message và verify", còn có những bài toán nào mà signature scheme cần giải quyết?*

Trong thực tế, các ứng dụng khác nhau đặt ra các yêu cầu rất khác nhau:

- **Blockchain consensus** cần hàng nghìn validator ký mỗi block — verify từng chữ ký riêng lẻ là không khả thi về băng thông và tính toán. Cần **aggregation**.
- **E-voting, e-cash** cần signer không biết mình đang ký document nào — cần **blindness**.
- **Cryptocurrency privacy** cần chứng minh "một trong chúng tôi đã ký" mà không tiết lộ ai — cần **ring signature**.
- **Quản lý khóa phân tán** cần $t$ trong $n$ người cùng tạo signature, không ai giữ toàn bộ private key — cần **threshold signature**.

Bài này là bản đồ của "vườn thú" chữ ký số (digital signatures zoo) — survey-level, đủ để nhận diện và sử dụng, không đi sâu vào chứng minh bảo mật đầy đủ.

![[assets/img-20-sig-zoo.png]]
*Bảng so sánh các signature scheme theo nền tảng toán học, tính chất, kích thước, và use-case.*

---

## 2. Khung chung của Digital Signature

Mọi signature scheme đều có 3 thuật toán:

> [!note] Định nghĩa — Digital Signature Scheme
> Một signature scheme là bộ ba thuật toán $(\mathsf{KeyGen}, \mathsf{Sign}, \mathsf{Verify})$:
>
> - $\mathsf{KeyGen}(1^\lambda) \to (\mathsf{sk}, \mathsf{pk})$: sinh cặp khóa từ security parameter.
> - $\mathsf{Sign}(\mathsf{sk}, m) \to \sigma$: sinh chữ ký $\sigma$ trên message $m$ dùng private key.
> - $\mathsf{Verify}(\mathsf{pk}, m, \sigma) \to \{0,1\}$: kiểm tra chữ ký.
>
> **Correctness**: $\forall m,\ \mathsf{Verify}(\mathsf{pk}, m, \mathsf{Sign}(\mathsf{sk}, m)) = 1$.
> **Security baseline**: $\mathsf{EUF\text{-}CMA}$ — adversary có signing oracle không thể forge chữ ký mới.

Các scheme "exotic" ở bài này thêm các **tính chất bổ sung** ngoài EUF-CMA cơ bản.

---

## 3. RSA-PSS — Padding đúng cách cho RSA

RSA Probabilistic Signature Scheme (RSA-PSS) là phiên bản đúng chuẩn của RSA signature, thay thế scheme cũ PKCS#1 v1.5. Đây không phải scheme mới, nhưng cần biết rõ tại sao nó tồn tại.

**Vấn đề với PKCS#1 v1.5 (textbook padding)**: Sign là $\sigma = H(m)^d \bmod n$ với padding cố định. Padding deterministic dẫn đến tấn công Bleichenbacher-style và forgery trong một số cấu hình.

**PSS giải quyết thế nào**: Thêm randomized salt vào quá trình hash trước khi ký, khiến mỗi signature trên cùng một message đều khác nhau (probabilistic). PSS có proof bảo mật chặt chẽ trong Random Oracle Model dựa trên RSA assumption.

> [!note] Scheme — RSA-PSS (Sketch)
> **Sign**: Chọn salt $r \stackrel{R}{\leftarrow} \{0,1\}^{k_1}$; tính $H_1 = H(m \| r)$; construct padding block $EM$ từ $H_1$ và $r$; $\sigma = EM^d \bmod n$.
>
> **Verify**: Recover $EM = \sigma^e \bmod n$; extract $H_1', r'$ từ $EM$; kiểm tra $H_1' = H(m \| r')$.
>
> Kích thước sig: bằng modulus ($|n|$ bits, thường 256 byte với 2048-bit RSA).

> [!tip] Khi nào dùng RSA-PSS
> Mọi nơi cần RSA signature ngày nay. Chứng chỉ TLS/X.509 hiện đại, JWT với alg RS256 chuẩn (phần lớn dùng PKCS#1 v1.5 vì legacy — đây là tech debt lớn trong ngành).

---

## 4. EdDSA — Deterministic, Fast, Safe

EdDSA (Edwards-curve Digital Signature Algorithm) là phiên bản cải tiến của ECDSA với hai điểm đột phá: nonce $k$ được tính **deterministically** từ $(sk, m)$ thay vì random, và dùng **twisted Edwards curve** thay vì Weierstrass.

**Tại sao deterministic nonce quan trọng**: ECDSA thực tế đã bị phá nhiều lần do RNG kém (PS3 case 2010, nhiều ví Bitcoin). EdDSA loại bỏ hoàn toàn rủi ro này bằng cách đặt $k = H(b \| m)$ với $b$ là phần private key thứ hai — deterministic nhưng vẫn unpredictable với adversary không có $b$.

> [!note] Scheme — Ed25519 (EdDSA trên Curve25519)
> **Setting**: Twisted Edwards curve $-x^2 + y^2 = 1 + dx^2y^2$ trên $\mathbb{F}_p$, $p = 2^{255} - 19$; group order $\ell$ (prime); generator $B$.
>
> **KeyGen**: $sk = $ 32-byte secret seed; hash $H(sk) = (a \| b)$; $\mathsf{pk} = A = aB$.
>
> **Sign**$(sk, m)$:
> - $r = H(b \| m) \bmod \ell$ &nbsp;&nbsp;*(deterministic nonce)*
> - $R = rB$
> - $S = r + H(R \| A \| m) \cdot a \pmod{\ell}$
> - Output $\sigma = (R, S)$, 64 bytes.
>
> **Verify**$(pk = A, m, \sigma = (R,S))$:
> - Kiểm tra $8 \cdot SB = 8R + 8 \cdot H(R \| A \| m) \cdot A$

> [!info] Tại sao nhân 8 (cofactor clearing)?
> Curve25519 có cofactor $h = 8$: $|E| = 8\ell$. Nhân $8$ cả hai vế đảm bảo tính toán trên subgroup chính xác bậc $\ell$, tránh small-subgroup attack.

---

## 5. Schnorr Signature — Nền tảng của Blockchain Hiện đại

Schnorr đã học ở template example. Điểm cần nhấn mạnh thêm trong bài này là **Schnorr aggregation** — tính chất đặc biệt không có ở ECDSA: $\sigma_1 + \sigma_2$ (trong $\mathbb{Z}_q$) là chữ ký hợp lệ tổng hợp.

Tuy nhiên, naive aggregation của Schnorr bị tấn công **Rogue Key Attack**: adversary đăng ký $pk_B = g^b \cdot pk_A^{-1}$, từ đó kiểm soát được sum của các public keys. MuSig và MuSig2 giải quyết vấn đề này.

---

## 6. BLS Aggregate Signature

BLS là scheme đầu tiên hỗ trợ **non-interactive aggregation** thực sự: $n$ signatures trên $n$ messages từ $n$ signers được gộp thành **1 signature** duy nhất mà vẫn verify được đồng thời.

> [!note] Scheme — BLS Signature (Boneh-Lynn-Shacham, 2001)
> **Setting**: Bilinear pairing $e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$, generators $g_1 \in \mathbb{G}_1$, $g_2 \in \mathbb{G}_2$. Hash-to-curve $H: \{0,1\}^* \to \mathbb{G}_1$.
>
> **$\mathsf{KeyGen}(1^\lambda)$**
> - Chọn $\mathsf{sk} = x \stackrel{R}{\leftarrow} \mathbb{Z}_r^*$
> - Output $\mathsf{pk} = x \cdot g_2 \in \mathbb{G}_2$
>
> **$\mathsf{Sign}(\mathsf{sk} = x,\, m)$**
> - Tính $h = H(m) \in \mathbb{G}_1$
> - Output $\sigma = x \cdot h \in \mathbb{G}_1$
>
> **$\mathsf{Verify}(\mathsf{pk},\, m,\, \sigma)$**
> - Tính $h = H(m) \in \mathbb{G}_1$
> - Kiểm tra: $e(\sigma, g_2) \stackrel{?}{=} e(h, \mathsf{pk})$
>
> **$\mathsf{Aggregate}(\sigma_1, \ldots, \sigma_n)$**
> - $\sigma_\mathrm{agg} = \sigma_1 + \sigma_2 + \cdots + \sigma_n \in \mathbb{G}_1$
>
> **$\mathsf{AggVerify}(\mathsf{pk}_1,\ldots,\mathsf{pk}_n,\, m_1,\ldots,m_n,\, \sigma_\mathrm{agg})$**
> - Kiểm tra $e(\sigma_\mathrm{agg}, g_2) \stackrel{?}{=} \prod_{i=1}^n e(H(m_i), \mathsf{pk}_i)$

**Tại sao aggregation đúng?** Nhờ bilinearity của $e$:

$$
e(\sigma_\mathrm{agg}, g_2) = e\!\left(\sum_i x_i h_i,\, g_2\right) = \prod_i e(x_i h_i, g_2) = \prod_i e(h_i, x_i g_2) = \prod_i e(H(m_i), \mathsf{pk}_i)
$$

> [!abstract] Theorem — BLS Correctness (Aggregation)
> Nếu $\sigma_i = x_i \cdot H(m_i)$ với mọi $i$, thì $\mathsf{AggVerify}$ trả về 1.

**Proof.** Theo tính bilinear của $e$ và tính additive-homomorphic của group law trong $\mathbb{G}_1$:

$$
e\!\left(\textstyle\sum_i \sigma_i,\, g_2\right) = \prod_i e(\sigma_i, g_2) = \prod_i e(x_i H(m_i), g_2) = \prod_i e(H(m_i), x_i g_2) = \prod_i e(H(m_i), \mathsf{pk}_i). \quad \blacksquare
$$

> [!abstract] Theorem — BLS Security
> BLS đạt EUF-CMA trong Random Oracle Model nếu **co-CDH problem** (Computational co-Diffie-Hellman) trong $(\mathbb{G}_1, \mathbb{G}_2)$ là hard: biết $g_1^a \in \mathbb{G}_1$ và $g_2^b \in \mathbb{G}_2$, khó tính $g_1^{ab} \in \mathbb{G}_1$.

**Proof sketch.** Giả sử adversary $\mathcal{A}$ forge được $(\sigma^*, m^*)$. Simulator biết $g_1^a$ (từ co-CDH instance) và dùng nó làm $\mathsf{pk}$. Khi $\mathcal{A}$ query $H(m^*)$, simulator trả về $g_1 \cdot r$ (random offset). Từ forgery $\sigma^*$, simulator extract $g_1^{ab}$ qua phép tính tuyến tính, giải co-CDH. $\blacksquare$

> [!warning] Rogue Key Attack trên BLS Aggregation
> Nếu aggregate theo kiểu $\sigma_\mathrm{agg} = \sigma_1 + \sigma_2$ và chỉ verify $e(\sigma_\mathrm{agg}, g_2) = e(H(m), \mathsf{pk}_1 + \mathsf{pk}_2)$ với cùng message $m$, adversary chọn $\mathsf{pk}_2 = b \cdot g_2 - \mathsf{pk}_1$ → kiểm soát tổng key.
>
> **Giải pháp**: Proof of Possession (PoP) — mỗi signer ký chính public key của mình khi đăng ký, hoặc dùng coefficient $a_i = H(\mathsf{pk}_i \| \text{all pks})$ khi aggregate (như trong BLST spec).

> [!info] BLS trong thực tế
> - **Ethereum 2.0 (Beacon Chain)**: hàng nghìn validator ký mỗi block; tất cả được aggregate thành 1 signature 96 byte (G2). Tiết kiệm ~1000× bandwidth.
> - **Chia Network**: dùng BLS12-381 cho mọi transaction signature.
> - **Curve**: BLS12-381 (không phải BLS signature — BLS ở đây là Barreto-Lynn-Scott, nhóm tác giả khác).

---

## 7. Blind Signature — Ký Mà Không Biết Nội Dung

Blind signature cho phép user nhận được chữ ký hợp lệ trên message $m$ mà signer không biết $m$ là gì. Được David Chaum phát minh năm 1982 cho ứng dụng e-cash: ngân hàng ký tờ tiền điện tử nhưng không biết tờ tiền đó sẽ được dùng ở đâu.

![[assets/img-20-blind-sig.png]]
*Sơ đồ protocol Blind Signature theo construction RSA của Chaum: user blind message, signer ký bản blinded, user unblind để lấy signature hợp lệ.*

> [!note] Scheme — RSA Blind Signature (Chaum 1982)
> **Setting**: RSA với $(n, e, d)$; $m \in \mathbb{Z}_n^*$ là message cần ký.
>
> **Blind** (phía User):
> - Chọn $r \stackrel{R}{\leftarrow} \mathbb{Z}_n^*$ với $\gcd(r, n) = 1$ &nbsp;*(blinding factor)*
> - Tính $m' = m \cdot r^e \bmod n$ &nbsp;*(blinded message)*
> - Gửi $m'$ cho Signer
>
> **Sign** (phía Signer):
> - Nhận $m'$; không biết $m$
> - Tính $s' = (m')^d \bmod n$ &nbsp;*(blind signature)*
> - Gửi $s'$ cho User
>
> **Unblind** (phía User):
> - Tính $s = s' \cdot r^{-1} \bmod n$
> - $s = m^d \bmod n$ &nbsp;*(valid RSA signature on $m$)*
>
> **Verify** (bởi bất kỳ ai):
> - Kiểm tra $s^e \equiv m \pmod{n}$

> [!abstract] Theorem — Correctness
> $s = m^d \bmod n$.

**Proof.** $s' = (m')^d = (m \cdot r^e)^d = m^d \cdot r^{ed} = m^d \cdot r \pmod{n}$ (vì $r^{ed} \equiv r \pmod{n}$ theo RSA correctness). Suy ra $s = s' \cdot r^{-1} = m^d \cdot r \cdot r^{-1} = m^d \pmod{n}$. $\blacksquare$

> [!info] Hai tính chất cốt lõi
> - **Blindness**: Signer quan sát $(m', s')$. Không có thông tin về $m$ vì $r$ là blinding factor ngẫu nhiên; phân phối của $m'$ là uniform trên $\mathbb{Z}_n^*$ độc lập với $m$.
> - **Unlinkability**: Signer không thể link $(m', s')$ với $(m, s)$ sau khi unblind, vì không biết $r$.

---

## 8. Ring Signature — "Một Trong Chúng Tôi Đã Ký"

Ring signature (Rivest, Shamir, Tauman, 2001) cho phép một thành viên của một tập hợp (ring) ký thay mặt cả nhóm mà không tiết lộ mình là ai. Không có trusted authority, không có group setup — bất kỳ tập hợp public keys nào đều có thể là ring.

> [!note] Định nghĩa — Ring Signature
> Một ring signature scheme có:
> - $\mathsf{Sign}(\mathsf{sk}_i, m, \{\mathsf{pk}_1, \ldots, \mathsf{pk}_n\}) \to \sigma$: signer $i$ ký thay mặt ring $R = \{\mathsf{pk}_j\}$.
> - $\mathsf{Verify}(m, \sigma, R) \to \{0,1\}$: verify chữ ký là hợp lệ từ một ai đó trong $R$.
>
> **Anonymity**: $\sigma$ không tiết lộ $i$ (signer thực).  
> **Unforgeability**: Không ai ngoài ring tạo được $\sigma$ hợp lệ.

**Construction điển hình** (RSA-based Chaum-Rivest): Dùng "ring equation" $f_1(y_1) \oplus f_2(y_2) \oplus \cdots \oplus f_n(y_n) = v$ với $f_i$ là one-way function từ key của mỗi thành viên. Signer thực giải phương trình cho $y_i$ của mình vì biết $\mathsf{sk}_i$ (inverse của $f_i$); các $y_j$ còn lại chọn ngẫu nhiên.

> [!info] Ring Signature trong Monero
> Monero dùng **CLSAG (Concise Linkable Spontaneous Anonymous Group Signature)** — một variant của ring signature với thêm tính chất **linkability**: cùng một private key ký hai transactions → giá trị **key image** $\tilde{K} = x \cdot H_p(K)$ giống nhau → phát hiện double-spend. Kích thước signature: $O(n)$ với $n = |\text{ring}|$ (Monero thường dùng $n = 11$).

> [!tip] Ring vs Group Signature
> **Ring**: không ai có thể unmask signer — kể cả không có trusted authority. Anonymity tuyệt đối.  
> **Group**: Group Manager nắm master key có thể unmask — trách nhiệm giải trình (accountability) khi cần. Dùng trong hệ thống cần audit.

---

## 9. Threshold Signature — $t$-of-$n$

Threshold signature cho phép $t$ trong $n$ parties cùng tạo một chữ ký hợp lệ mà không party nào cần giữ toàn bộ private key. Đây là ứng dụng trực tiếp của secret sharing vào cryptography.

> [!note] Định nghĩa — $(t, n)$-Threshold Signature
> Gồm các thuật toán:
> - $\mathsf{KeyGen}$: sinh $n$ key shares $\mathsf{sk}_1, \ldots, \mathsf{sk}_n$ và public key $\mathsf{pk}$.
> - $\mathsf{PartialSign}(\mathsf{sk}_i, m) \to \sigma_i$: party $i$ tạo partial signature.
> - $\mathsf{Combine}(\sigma_{i_1}, \ldots, \sigma_{i_t}) \to \sigma$: tổng hợp $t$ partial signatures.
> - $\mathsf{Verify}(\mathsf{pk}, m, \sigma) \to \{0,1\}$: verify bằng standard algorithm.
>
> **Threshold property**: bất kỳ $t$ parties nào cũng đủ tạo $\sigma$ hợp lệ; ít hơn $t$ không thể.

**Tại sao Threshold Schnorr hoạt động**: Dùng Shamir Secret Sharing cho private key $x$: chia thành $n$ shares $x_1, \ldots, x_n$ với polynomial bậc $t-1$ sao cho $x_i = f(i)$ và $f(0) = x$. Để ký, $t$ parties share partial nonces và partial signatures, kết hợp bằng Lagrange interpolation.

**FROST (Flexible Round-Optimized Schnorr Threshold)**: scheme threshold Schnorr thực tế, 2-round, phổ biến trong production. **GG20/GG21**: scheme threshold ECDSA, phức tạp hơn vì ECDSA không linear.

> [!info] Threshold vs Multi-sig (trên blockchain)
> **On-chain multi-sig**: $n$ signatures riêng biệt → kích thước giao dịch tuyến tính, lộ số người ký.  
> **Threshold sig**: 1 signature duy nhất → không phân biệt được với single-sig, tiết kiệm fee, privacy tốt hơn.

---

## 10. MuSig2 — Multi-Signature Compact cho Bitcoin

MuSig2 (Nick, Ruffing, Seurin, 2021) là multi-signature scheme Schnorr cho phép $n$ parties cùng ký một message, kết quả là **một Schnorr signature duy nhất** 64 byte, verify bằng $pk_\mathrm{agg} = \sum_i a_i \cdot \mathsf{pk}_i$.

**Tại sao cần MuSig thay vì naive Schnorr aggregate**: Naive aggregate $R = \sum R_i$ và $s = \sum s_i$ bị **Rogue Key Attack**. MuSig2 giải quyết bằng cách dùng challenge-dependent coefficients $a_i = H_\mathrm{agg}(\mathsf{pk}_i, \{pk_1,\ldots,pk_n\})$ khi tổng hợp public key, vô hiệu hóa rogue key.

MuSig2 là nền tảng kỹ thuật của **Bitcoin Taproot (BIP-340, BIP-341)**: Tapscript cho phép nhiều parties cùng ký một P2TR output mà on-chain chỉ thấy một public key và một signature.

---

## 11. So Sánh và Nhận Diện CTF

> [!example] Pattern nhận diện trong CTF
> **BLS aggregate**: source import `py_ecc`, operations trên G1/G2 với pairing check `e(σ, g2) == e(H(m), pk)`. Thường gặp bài yêu cầu forge aggregate signature hoặc khai thác khi `H(m)` có thể collide.
>
> **Blind signature**: server nhận request, trả về số đã ký, nhưng không biết bạn đang ký gì — dùng khi cần "forge" admin token mà server ký key admin cho bạn.
>
> **Ring signature**: source có ring parameter, key image — thường gặp trong challenge liên quan đến Monero-style privacy.

---

## 12. Group Signature — Ẩn danh có trách nhiệm

**Ring signature** cung cấp ẩn danh hoàn toàn. Nhưng đôi khi cần mô hình trung gian: signer ẩn danh với người ngoài, nhưng có thể bị unmask nếu cần thiết. Đây là **group signature**.

> [!note] Tính chất Group Signature
> - **Anonymity**: Verifier không xác định được ai trong group đã ký.
> - **Traceability**: **Group Manager (GM)** có thể "open" signature để reveal signer identity.
> - **Non-frameability**: Không ai (kể cả GM) có thể forge signature cho người khác.
> - **Unforgeability**: Chỉ member hợp lệ mới tạo được valid signature.

**Cơ chế**: Mỗi member $i$ nhận certificate từ GM: $\mathsf{cert}_i = \mathsf{Sign}_\mathsf{GM}(pk_i)$. Khi ký, tạo **ZKP** rằng họ có valid certificate mà không reveal $pk_i$.

**Ứng dụng**:
- **DAA (Direct Anonymous Attestation)** trong **TPM 2.0**: Device chứng minh có genuine TPM mà không reveal identity. Dùng trong Intel TXT, AMD SEV.
- Anonymous whistleblowing: Nhân viên chứng minh thuộc tổ chức X mà không lộ tên.

**Group sig vs Ring sig**:

| Tính chất | Ring Signature | Group Signature |
|-----------|---------------|-----------------|
| Trusted setup | Không | Cần Group Manager |
| Unmask | Không thể | GM có thể unmask |
| Signature size | $O(n)$ với ring size $n$ | $O(1)$ |
| Accountability | Không | Có |

---

## 13. Aggregate Signature vs Multi-Signature — Phân biệt

> [!note] Phân biệt
> **Multi-signature** (MuSig): Tất cả $n$ parties ký **cùng một message** $m$. Output là một signature chứng minh tất cả đã ký $m$.
>
> **Aggregate signature** (BLS): Mỗi party ký **message khác nhau** $m_i$. Output là một signature chứng minh $pk_i$ ký $m_i$ với mọi $i$.

**Sequential aggregate signature**: Signer $i$ nhận $\sigma_{1..i-1}$ rồi output $\sigma_{1..i}$ — không cần interaction đồng thời.

**Interaction**:
- BLS aggregation: **Non-interactive** — aggregator chỉ cần public inputs.
- MuSig2: Cần **2 rounds** interaction.
- FROST: **2 rounds** với identifiable abort.

**Khi nào dùng gì**:
- Validator attestations (Ethereum PoS): Mỗi validator ký message khác nhau → **BLS aggregate**.
- Multi-party treasury control: Tất cả ký cùng transaction → **MuSig/FROST**.
- Sequential document signing: Mỗi người ký rồi chuyển → **Sequential aggregate**.

---

## 14. FROST — Threshold Schnorr Production-Ready

**FROST** (Flexible Round-Optimized Schnorr Threshold, Komlo & Goldberg, 2020) là threshold Schnorr scheme production-ready nhất.

> [!note] FROST — Cơ chế
> **Keygen**: $n$ parties chạy DKG — generate shared keypair $(d, Q)$ không có trusted dealer.
>
> **Signing** (2 rounds):
> - **Round 1**: Mỗi party $i$ broadcast nonce commitment $(D_i, E_i) = (d_i^* G, e_i^* G)$.
> - **Round 2**: Tính partial sig $z_i = d_i^* + e_i^* \rho_i + \lambda_i d_i c$ với $c = H(R, Q, m)$.
> - Aggregate: $s = \sum_i z_i$, output Schnorr sig $(R, s)$ — **giống hệt** single-party Schnorr.

**FROST vs GG20**:
- **FROST**: Cho Schnorr — đơn giản, 2 rounds, output là valid Taproot sig.
- **GG20/GG21**: Cho ECDSA — cần Oblivious Transfer (OT), phức tạp hơn nhiều.

**Identifiable abort**: Nếu một party misbehave, FROST xác định được kẻ đó qua ZKP trong commitment phase.

**Production deployments**: Cloudflare OPAQUE, Dfinity Internet Computer (chain-key ECDSA), Chainlink DON, Lightning Network multi-party channels.

```python
# Simplified FROST partial signing
def frost_partial_sign(d_star, e_star, lambda_i, d_i, c, rho_i, n):
    """z_i = d* + e* * rho_i + lambda_i * d_i * c"""
    return (d_star + e_star * rho_i + lambda_i * d_i * c) % n
    # Aggregator sums all z_i to get s = sum(z_i)
```

---

## 15. Tóm tắt

Bài này survey 6 dạng digital signature ngoài chuẩn ECDSA/EdDSA:

- **RSA-PSS**: padding đúng cho RSA — probabilistic, provably secure, dùng cho TLS certificates.
- **EdDSA (Ed25519)**: deterministic nonce loại bỏ rủi ro RNG; fast; constant-time; RFC 8032.
- **BLS aggregate**: bilinear pairing cho phép $n$ signatures → 1 signature; verify $O(n)$ pairings; backbone của Ethereum PoS.
- **Blind signature (Chaum)**: signer ký mà không thấy message; dùng cho e-cash và anonymous credentials.
- **Ring signature**: "one-of-us" anonymity; không cần trusted setup; Monero dùng CLSAG.
- **Threshold signature (FROST/GG20)**: $t$-of-$n$ không có single key holder; production-ready.

---

## 16. References

- Boneh, Lynn, Shacham — *Short Signatures from the Weil Pairing*, ASIACRYPT 2001
- Chaum — *Blind Signatures for Untraceable Payments*, CRYPTO 1982
- Rivest, Shamir, Tauman — *How to Leak a Secret (Ring Signatures)*, ASIACRYPT 2001
- Nick, Ruffing, Seurin — *MuSig2: Simple Two-Round Schnorr Multi-Signatures*, CRYPTO 2021
- IETF RFC draft — *BLS Signature Scheme* (draft-boneh-bls-signature)
- Boneh & Shoup — *A Graduate Course in Applied Cryptography*, Ch. 19 (toc.cryptobook.us)
- EIP-2333, BIP-340, BIP-327 — Bitcoin và Ethereum signature standards
