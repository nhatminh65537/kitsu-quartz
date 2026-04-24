---
title: "33. Hash-Based & Code-Based PQC"
type: scheme
tags: [crypto, pqc, hash-based, code-based, sphincs, mceliece]
aliases: [Hash-Based PQC, Code-Based PQC, SPHINCS+, McEliece]
created: 2026-04-19
---

> **Prerequisites**: Hash functions, one-way functions, Merkle tree basics, linear algebra cơ bản  
> **Lesson type**: Scheme
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $H : \{0,1\}^* \to \{0,1\}^n$ | Hàm hash với output $n$ bit |
> | $[n, k, t]$ | Linear code: length $n$, dimension $k$, correct $t$ errors |
> | $\mathbb{F}_2^n$ | Vector space nhị phân độ dài $n$ |
> | $\mathsf{wt}(e)$ | Hamming weight của vector $e$ |
> | $G \in \mathbb{F}_2^{k \times n}$ | Generator matrix của linear code |
> | $\mathrm{negl}(\lambda)$ | Negligible function của security parameter $\lambda$ |

---

## 1. Motivation

Hai trong bốn "nhóm PQC" được NIST đánh giá dựa trên những bài toán khó hoàn toàn khác nhau so với lattice: **hash functions** và **error-correcting codes**. Đây là hai lựa chọn mang tính "bảo thủ nhất" — không phải vì chúng mới, mà vì chúng được nghiên cứu lâu nhất.

Hash-based signatures (chữ ký dựa trên hash) có security giản dị đến mức gần như không cần giả thiết: nếu hash function là one-way và collision-resistant, scheme an toàn. Đó là lý do NIST gọi SPHINCS+ là "conservative choice." Code-based cryptography (mật mã dựa trên mã sửa lỗi) ra đời năm 1978 — trước cả RSA — và đã tồn tại hơn 45 năm mà bản chất bảo mật không thay đổi.

Bài này là **survey-level**: học để biết các scheme tồn tại, biết hard problem nền tảng, biết điểm mạnh và điểm yếu, và hiểu bức tranh tổng thể. Chi tiết implementation và toán học sâu thuộc phạm vi nghiên cứu chuyên sâu.

---

## 2. Phần 1 — Hash-Based Signatures

### 2.1. Kiến trúc tổng quan

Hash-based signatures xây dựng theo kiểu **tích lũy từ dưới lên**: từ một primitive đơn giản nhất (one-time signature) xếp thành cấu trúc ngày càng phức tạp hơn để ký được nhiều message hơn.

![[assets/img-28-hash-based-arch.png]]
*Kiến trúc lồng nhau từ OTS → WOTS+ → XMSS/LMS → SPHINCS+. Mỗi lớp giải quyết giới hạn của lớp dưới.*

### 2.2. Lamport One-Time Signature (OTS)

**Ý tưởng cốt lõi**: Tạo một keypair gồm nhiều cặp ngẫu nhiên, rồi "reveal" có chọn lọc một nửa dựa trên message.

> [!note] Scheme — Lamport OTS
> **Type**: One-Time Signature
> **Setting**: Hash function $H : \{0,1\}^n \to \{0,1\}^n$; message length $\ell$ bit
>
> **$\mathsf{KeyGen}(1^\lambda)$**
> - Với mỗi $i \in \{1,\ldots,\ell\}$, mỗi $b \in \{0,1\}$: chọn $x_{i,b} \stackrel{R}{\leftarrow} \{0,1\}^n$
> - Private key: $\mathsf{sk} = \{x_{i,b}\}$
> - Public key: $\mathsf{pk} = \{y_{i,b} = H(x_{i,b})\}$
>
> **$\mathsf{Sign}(\mathsf{sk},\, m)$** với $m = m_1 m_2 \ldots m_\ell$
> - Output: $\sigma = (x_{1,m_1},\, x_{2,m_2},\, \ldots,\, x_{\ell,m_\ell})$
>
> **$\mathsf{Verify}(\mathsf{pk},\, m,\, \sigma)$**
> - Với mỗi $i$: kiểm tra $H(\sigma_i) = y_{i,m_i}$
> - Output: $1$ nếu tất cả đúng

**Vì sao an toàn?** Kẻ tấn công muốn forge signature cho $m' \neq m$ phải reveal $x_{i,1-m_i}$ với ít nhất một $i$ mà $m'_i \neq m_i$. Nhưng chỉ biết $y_{i,1-m_i} = H(x_{i,1-m_i})$ mà không biết $x_{i,1-m_i}$ — đây là bài toán **pre-image** của $H$, giả thiết là khó.

> [!warning] Giới hạn nghiêm trọng
> Lamport OTS chỉ ký được **một message duy nhất**. Ký lần thứ hai sẽ reveal thêm preimages, cho phép kẻ tấn công combine hai chữ ký để forge bất kỳ message nào. Đây là lý do mọi thứ phía trên đều phải giải quyết vấn đề "one-time".
>
> Ngoài ra, key size và signature size của Lamport rất lớn: với 256-bit security và message 256 bit, signature có $256 \times 2 = 512$ preimage values, mỗi cái 32 byte → **16 KB**.

### 2.3. Winternitz OTS (WOTS+)

WOTS+ là tối ưu hóa Lamport bằng cách dùng **hash chain** thay vì pair đơn lẻ. Thay vì reveal từng bit, nó encode $w$ bit mỗi lần, giảm signature size $w$ lần.

**Ý tưởng hash chain**: Định nghĩa $H^k(x) = H(H(\cdots H(x)\cdots))$ ($k$ lần lặp). Public key là đầu cuối chain, private key là đầu chain. Signing reveal "điểm giữa" chain tùy theo giá trị cần ký.

> [!info] WOTS+ — Cải tiến so với Lamport
> - Winternitz parameter $w$: tăng $w$ → signature nhỏ hơn, nhưng sign/verify chậm hơn (nhiều hash iterations)
> - Với $w = 16$ (4-bit chunks), signature size giảm 4× so với Lamport
> - WOTS+ là phiên bản hardened: sử dụng randomized hash chains để chống multi-target attacks
> - **Vẫn chỉ là OTS** — một keypair chỉ ký một message

### 2.4. Merkle Signature Scheme và XMSS

**Từ OTS sang many-time**: Chuẩn bị sẵn $2^h$ OTS keypairs, công bố duy nhất **Merkle root** của hash tree đã xây từ tất cả OTS public keys.

```text
Merkle Root (public key duy nhất)
        /         \
   Node           Node
   /   \         /   \
OTS_pk_0 OTS_pk_1  OTS_pk_2 OTS_pk_3
```

Mỗi lần ký: dùng OTS keypair thứ $i$ (đã dùng thì bỏ luôn), kèm **authentication path** (các sibling nodes từ leaf lên root). Verifier tái tạo root từ path để xác minh OTS public key là lá hợp lệ.

> [!note] Scheme — XMSS (eXtended Merkle Signature Scheme)
> **Type**: Stateful Hash-Based Signature
> **Setting**: Hash function $H$; tree height $h$ (tối đa $2^h$ signatures); WOTS+ as OTS
>
> **$\mathsf{KeyGen}(1^\lambda)$**
> - Sinh $2^h$ WOTS+ keypairs $(sk_0, pk_0), \ldots, (sk_{2^h-1}, pk_{2^h-1})$
> - Xây Merkle tree với leaves $= H(pk_i)$
> - Output: $\mathsf{pk} = \text{root}$, $\mathsf{sk} = \{sk_i\} \cup \{\text{tree nodes}\}$, counter $= 0$
>
> **$\mathsf{Sign}(\mathsf{sk},\, m)$** (dùng leaf $i$ = current counter)
> - Ký $m$ bằng WOTS+: $\sigma_{wots} = \mathsf{WOTS.Sign}(sk_i, m)$
> - Tính authentication path $\mathrm{auth} = (\text{siblings from leaf } i \text{ to root})$
> - Tăng counter lên $1$
> - Output: $\sigma = (i,\, \sigma_{wots},\, \mathrm{auth})$
>
> **$\mathsf{Verify}(\mathsf{pk},\, m,\, \sigma)$**
> - Tính $pk_i^* = \mathsf{WOTS.Verify}(m, \sigma_{wots})$ (candidate OTS public key)
> - Dùng $\mathrm{auth}$ để tính candidate root từ $H(pk_i^*)$
> - Accept nếu candidate root $=$ $\mathsf{pk}$

> [!warning] XMSS là Stateful — Nguy hiểm nếu không cẩn thận
> Counter phải được lưu trữ an toàn và **không bao giờ tái sử dụng** cùng index $i$. Nếu ký hai message khác nhau với cùng OTS keypair → tương đương Lamport OTS reuse → private key bị lộ.
>
> **Stateful = không deploy trong môi trường phân tán** nếu không có strong state management (HSM, persistent storage với atomic update). NIST SP 800-208 chuẩn hóa XMSS và LMS nhưng ghi rõ ràng risk này.

**LMS (Leighton-Micali Signature)**: Variant song song với XMSS, chuẩn hóa bởi NIST SP 800-208 cùng lúc. Về cơ bản tương tự nhưng khác thiết kế chi tiết (khác cách compute WOTS, khác tree structure). Cả hai đều **stateful**.

### 2.5. SPHINCS+ / SLH-DSA — Giải pháp Stateless

**Vấn đề core của XMSS**: Phải track state. Giải pháp của SPHINCS+: thay vì pre-generate tất cả OTS keys, **derive chúng on-the-fly từ một master seed bằng PRF**. Mỗi chữ ký bao gồm đủ thông tin để verifier tái tạo lại OTS public key — không cần lưu state.

> [!note] Scheme — SPHINCS+ / SLH-DSA (Overview)
> **Type**: Stateless Hash-Based Signature
> **Standard**: NIST FIPS 205 (August 2024)
> **Setting**: Hash function $H$ (SHA-256 hoặc SHAKE256); parameters $(n, h, d, a, k, w)$
>
> **Cấu trúc 3 lớp:**
> - **Lớp 1 — FORS** (Forest of Random Subsets): Ký $k \cdot \log a$ bit message hash. Few-times signature: dùng $k$ cây độc lập, mỗi cây depth $a$
> - **Lớp 2 — XMSS Hypertree**: Cây $d$ tầng của XMSS trees; mỗi XMSS tree ký authentication path cho FORS key bên dưới
> - **Lớp 3 — Root keypair**: Public key duy nhất là root của hypertree
>
> **$\mathsf{KeyGen}(1^\lambda)$**
> - Chọn random seed $\mathsf{sk.seed}$, $\mathsf{sk.prf}$, public seed $\mathsf{pk.seed}$
> - Tính root bằng cách hash theo cấu trúc hypertree
> - Output: $\mathsf{sk} = (\mathsf{sk.seed}, \mathsf{sk.prf}, \mathsf{pk.seed}, \mathsf{pk.root})$; $\mathsf{pk} = (\mathsf{pk.seed}, \mathsf{pk.root})$
>
> **$\mathsf{Sign}(\mathsf{sk},\, m)$**
> - Randomize: $R \leftarrow \mathsf{PRF}(\mathsf{sk.prf}, m)$ (hoặc truly random)
> - Hash message: $\mathsf{mhash} = H(\mathsf{pk.seed}, R, m)$ → chọn FORS index
> - Ký bằng FORS → FORS signature
> - Authenticate FORS public key qua $d$ lớp XMSS hypertree
> - Output: $\sigma = (R, \sigma_\mathsf{FORS}, \sigma_\mathsf{HT})$
>
> **$\mathsf{Verify}(\mathsf{pk},\, m,\, \sigma)$**
> - Recompute $\mathsf{mhash}$, verify FORS sig → candidate FORS pk
> - Verify $d$ lớp XMSS chứng minh FORS pk hợp lệ → candidate root
> - Accept nếu candidate root $=$ $\mathsf{pk.root}$

**Tại sao stateless?** Với index leaf bất kỳ, tất cả WOTS+ keys được derive deterministically từ $\mathsf{sk.seed}$ bằng PRF — không cần lưu trước. Signature chứa index nên verifier biết phải derive key nào.

> [!info] SLH-DSA Parameter Sets (FIPS 205)
> | Instance | Security | PK size | Sig size | Hash ops |
> |----------|----------|---------|---------|---------|
> | SLH-DSA-SHA2-128s | Level 1 | 32 B | 7.9 KB | SHA-256 (slow, small sig) |
> | SLH-DSA-SHA2-128f | Level 1 | 32 B | 17 KB | SHA-256 (fast, large sig) |
> | SLH-DSA-SHAKE-256s | Level 5 | 64 B | 29 KB | SHAKE256 (slow, max security) |
>
> "s" = small (signature nhỏ hơn, sign chậm hơn); "f" = fast (sign nhanh hơn, sig lớn hơn).

> [!tip] So sánh với ML-DSA (Dilithium)
> ML-DSA (lattice-based, NIST FIPS 204) có signature nhỏ hơn nhiều (~2.5 KB vs 7.9 KB minimum của SLH-DSA) và sign/verify nhanh hơn. Tại sao vẫn cần SLH-DSA? Vì SLH-DSA có **security assumptions tối giản hơn**: chỉ cần hash function an toàn. Nếu có breakthrough nào đó attack lattice crypto, SLH-DSA vẫn an toàn. Đây là **defense in depth** — không nên phụ thuộc hoàn toàn vào một family duy nhất.

### 2.6. Correctness & Security

> [!abstract] Theorem — EUF-CMA Security của SLH-DSA
> Nếu hash function $H$ là multi-target second-preimage resistant (PQ-DM-SPR), pseudorandom (PQ-PRF), và interleaved target-subset resilient (PQ-ITSR), thì SLH-DSA đạt **EUF-CMA** security trong cả classical và quantum setting (với Grover's algorithm, security giảm một nửa số bit — cần $n \geq 2\lambda$).

**Proof sketch.** Kẻ forger muốn tạo valid signature mà không biết $\mathsf{sk.seed}$ phải:
1. Forge một FORS signature → cần tìm collision trong FORS hash trees → phải tìm pre-image của hash leaf
2. Forge XMSS signature → cần forge WOTS+ → phải invert hash chain mid-point
3. Cả hai đều reduce về pre-image hoặc second-preimage resistance của $H$.

Vì không có state cần track, và signing index được chọn ngẫu nhiên (randomized hashing), không có "reuse attack" nào áp dụng được. $\blacksquare$

*(Proof đầy đủ: Bernstein et al., "SPHINCS+ Specification", 2022; FIPS 205.)*

---

## 3. Phần 2 — Code-Based Cryptography

### 3.1. Nền tảng: Error-Correcting Codes

Trước khi hiểu McEliece, cần biết linear code là gì.

> [!note] Definition 5 — Binary Linear Code $[n, k, t]$
> Một **binary linear code** $\mathcal{C}$ là $k$-dimensional subspace của $\mathbb{F}_2^n$.
> - **Generator matrix** $G \in \mathbb{F}_2^{k \times n}$: $\mathcal{C} = \{mG : m \in \mathbb{F}_2^k\}$
> - **Parity-check matrix** $H \in \mathbb{F}_2^{(n-k) \times n}$: $Hc^\top = 0$ với mọi $c \in \mathcal{C}$
> - **Minimum distance** $d$: code có thể detect $d-1$ errors và correct $t = \lfloor(d-1)/2\rfloor$ errors
> - **Rate** $R = k/n$: tỷ lệ information bits trên total bits

**Hard problem**:

> [!abstract] Problem 6 — Syndrome Decoding Problem (SDP)
> **Input**: Parity-check matrix $H \in \mathbb{F}_2^{(n-k) \times n}$, syndrome $s = He^\top$, error bound $t$
> **Goal**: Tìm $e \in \mathbb{F}_2^n$ với $\mathsf{wt}(e) \leq t$ và $He^\top = s$
>
> SDP với **random** $H$ là NP-hard (Berlekamp et al., 1978). Best known algorithms (Information Set Decoding — ISD) có complexity exponential in $t$ cho random codes.

### 3.2. Goppa Codes — Trái tim của McEliece

**Vấn đề của SDP**: Nếu code là "random", decoding rất khó. Nhưng nếu bạn biết cấu trúc ẩn của code, bạn có **efficient decoder**. Goppa codes là loại structured code có efficient decoder nhưng generator matrix trông random.

> [!note] Definition 7 — Binary Goppa Code
> Cho $m \geq 1$, $\mathbb{F}_{2^m}$ là extension field. Chọn:
> - **Goppa polynomial** $g(z) \in \mathbb{F}_{2^m}[z]$, bậc $t$, không có roots lặp
> - **Code locators** $\alpha_1, \ldots, \alpha_n \in \mathbb{F}_{2^m}$: phân biệt, $g(\alpha_i) \neq 0$
>
> Goppa code $\Gamma(g, \alpha_1,\ldots,\alpha_n)$ là tập codewords $c \in \mathbb{F}_2^n$ sao cho:
>
> $$\sum_{i=1}^{n} \frac{c_i}{z - \alpha_i} \equiv 0 \pmod{g(z)}$$
>
> Tham số: length $n$, dimension $k \geq n - mt$, corrects $t$ errors.

**Tại sao Goppa codes tốt cho McEliece?**
1. **Fast decoder**: Patterson algorithm giải mã Goppa code trong $O(n^{1.5})$ — rất nhanh
2. **Look random**: Generator matrix của Goppa code trông như random matrix $\Rightarrow$ không phân biệt được (computationally) với random code bởi best known algorithms
3. **Stability**: Hơn 45 năm, không có attack nào hiệu quả với parameters đủ lớn

### 3.3. McEliece Cryptosystem

![[assets/img-28-mceliece-flow.png]]
*McEliece: KeyGen sinh Goppa code, scramble bằng S và P để public key trông random. Encrypt = codeword + errors. Decrypt = Patterson decode + unscramble.*

> [!note] Scheme — McEliece PKE (1978)
> **Type**: Public-Key Encryption (OW-CPA)
> **Setting**: Binary Goppa code $\Gamma$ với parameters $(n, k, t)$; scramble matrix $S \in \mathbb{F}_2^{k \times k}$ invertible; permutation matrix $P \in \mathbb{F}_2^{n \times n}$
>
> **$\mathsf{KeyGen}(1^\lambda)$**
> - Chọn Goppa code $\Gamma = (g, \alpha_1,\ldots,\alpha_n)$ với generator $G \in \mathbb{F}_2^{k \times n}$
> - Chọn random invertible $S \in \mathbb{F}_2^{k \times k}$ và permutation $P \in \mathbb{F}_2^{n \times n}$
> - Public key: $\hat{G} = S \cdot G \cdot P$ (trông như random matrix)
> - Private key: $(\Gamma, S, P)$
>
> **$\mathsf{Encrypt}(\mathsf{pk},\, m)$** với $m \in \mathbb{F}_2^k$
> - Chọn random error vector $e \in \mathbb{F}_2^n$, $\mathsf{wt}(e) = t$
> - Output: $c = m \cdot \hat{G} + e$
>
> **$\mathsf{Decrypt}(\mathsf{sk},\, c)$**
> - Compute $c' = c \cdot P^{-1} = m \cdot S \cdot G + e \cdot P^{-1}$
> - Dùng Patterson algorithm decode Goppa $\Gamma$: tìm $e'$ sao cho $c' - e' \in \mathcal{C}$
> - Recover codeword $m \cdot S \cdot G$ → recover $m = (\text{codeword}) \cdot (SG)^{-1}$
> - Output: $m$

**Correctness**: Decryption đúng vì $e \cdot P^{-1}$ vẫn có weight $t$ (permutation giữ nguyên Hamming weight), và Patterson decoder correct $t$ errors trong $\Gamma$. $\blacksquare$

> [!abstract] Theorem — OW-CPA Security
> Nếu SDP với random codes là hard và Goppa code không thể phân biệt với random code, thì McEliece PKE đạt **OW-CPA** security: không adversary PPT nào recover được $m$ từ $c = m\hat{G} + e$.

### 3.4. Classic McEliece — Phiên bản hiện đại

**Classic McEliece** là submission của nhóm Bernstein et al. cho NIST PQC. Nó chuyển McEliece OW-CPA PKE thành **IND-CCA2 KEM** qua cơ chế:

1. Message $m$ được chọn random (không phải user message)
2. $e$ được derive deterministically từ $m$ bằng PRF (không random)  
3. Ciphertext bao gồm $c_0 = m\hat{G} + e$ và $c_1 = H(e, m)$ (hash)
4. Decapsulation verify cả hai — nếu sai trả về error

Transformation này (Fujisaki-Okamoto variant) nâng security từ OW-CPA lên IND-CCA2.

> [!info] Classic McEliece Parameters (NIST Round 4 Finalist)
> | Instance | $(n, k, t)$ | Public key | Ciphertext | Security |
> |----------|-------------|-----------|-----------|---------|
> | mceliece348864 | (3488, 2720, 64) | **261 KB** | 128 B | Level 1 |
> | mceliece460896 | (4608, 3360, 96) | **524 KB** | 188 B | Level 3 |
> | mceliece6688128 | (6688, 5024, 128) | **1.04 MB** | 240 B | Level 5 |
>
> **Điểm mạnh**: Ciphertext cực nhỏ; security ổn định 45+ năm; conservative assumptions
> **Điểm yếu**: Public key **rất lớn** (MB) — không phù hợp cho nhiều application; key generation chậm

> [!warning] Tại sao Classic McEliece không được NIST chuẩn hóa?
> NIST chọn ML-KEM (Kyber) làm KEM chuẩn chính vì key size nhỏ hơn nhiều (~800 B vs 261 KB). Classic McEliece được coi là "backup option" — nếu lattice crypto bị break, McEliece vẫn sẵn sàng. Một số tổ chức (như Mullvad VPN) đã deploy McEliece như extra layer bên cạnh ML-KEM.

### 3.5. Niederreiter và Code-Based Signatures

**Niederreiter cryptosystem** (1986) là dual của McEliece: thay vì dùng generator matrix, dùng parity-check matrix. Ciphertext compact hơn nhưng key size tương đương.

Quan trọng hơn, Niederreiter cho phép xây **code-based digital signatures**: sign = decode error pattern, verify = re-encode. Classic McEliece sử dụng Niederreiter internally trong decapsulation.

---

## 4. CTF Relevance

> [!example] CTF Pattern — Hash-Based & Code-Based
> ⭐ **Ít gặp trong CTF thông thường** — các scheme này chủ yếu xuất hiện trong:
> - Research-track CTF (PlaidCTF, HITCON finals)
> - Crypto implementation challenges yêu cầu hiểu Merkle tree / OTS
>
> **Merkle tree forgery**: Bài hay gặp nhất là "giả mạo Merkle authentication path" khi implementation không validate properly
>
> **Side-channel McEliece**: Timing attack trên Patterson decoder (constant-time rất khó implement)
>
> **Nhận diện trong challenge**: Ciphertext ngắn (~200 bytes) nhưng public key rất lớn (MB) → likely code-based
>
> ```python
> from hashlib import sha256
>
> def lamport_keygen(n_bits=256):
>     import os
>     sk = [[os.urandom(32), os.urandom(32)] for _ in range(n_bits)]
>     pk = [[sha256(sk[i][b]).digest() for b in range(2)] for i in range(n_bits)]
>     return sk, pk
>
> def lamport_sign(sk, msg_hash_bytes):
>     bits = int.from_bytes(msg_hash_bytes, 'big')
>     sig = []
>     for i in range(len(sk)):
>         b = (bits >> (len(sk) - 1 - i)) & 1
>         sig.append(sk[i][b])
>     return sig
>
> def lamport_verify(pk, msg_hash_bytes, sig):
>     bits = int.from_bytes(msg_hash_bytes, 'big')
>     for i in range(len(pk)):
>         b = (bits >> (len(pk) - 1 - i)) & 1
>         if sha256(sig[i]).digest() != pk[i][b]:
>             return False
>     return True
> ```

---

## 5. Tài liệu tham khảo

- Bernstein et al. — *SPHINCS+: Stateless Hash-Based Signatures* (2022), https://sphincs.org/
- NIST FIPS 205 — *Stateless Hash-Based Digital Signature Standard* (August 2024), https://csrc.nist.gov/pubs/fips/205/final
- NIST SP 800-208 — *Recommendation for Stateful Hash-Based Signature Schemes* (2020, XMSS & LMS)
- McEliece, R.J. — *A Public-Key Cryptosystem Based on Algebraic Coding Theory* (1978), DSN Progress Report
- Bernstein et al. — *Classic McEliece*, https://classic.mceliece.org/ (Round 4 submission)
- Bernstein, Buchmann, Dahmen — *Post-Quantum Cryptography*, Springer, 2009 — Chapter 1 (code-based), Chapter 4 (hash-based)
- Hülsing — *WOTS+ – Shorter Signatures for Hash-Based Signature Schemes*, AFRICACRYPT 2013
