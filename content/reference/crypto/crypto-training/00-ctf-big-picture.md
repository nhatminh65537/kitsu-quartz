---
title: "00. Cryptography & CTF Overview"
type: foundation
tags: [crypto, ctf, orientation]
created: 2026-04-16
---

> **Lesson type**: Foundation (Orientation)  

---

## 1. Mật mã học là gì?

**Mật mã học** (cryptography) là khoa học nghiên cứu các kỹ thuật bảo vệ thông tin. Mục tiêu cốt lõi là đảm bảo rằng dữ liệu chỉ có thể được đọc bởi người được phép, ngay cả khi kẻ tấn công có thể đọc hoặc can thiệp vào kênh truyền.

Ngay lập tức, cần phân biệt hai hướng nghiên cứu đối lập nhau:

- **Cryptography** — thiết kế và phân tích các scheme bảo vệ thông tin: encryption, signature, hash, key exchange, ZKP, v.v.
- **Cryptanalysis** — phân tích và phá các scheme đó: tìm điểm yếu, khai thác implementation sai, phục hồi key/plaintext.

Trong một team CTF (và trong nghề bảo mật thực tế), bạn cần cả hai kỹ năng. Mỗi lần phá được một scheme, bạn hiểu sâu hơn về cách thiết kế scheme mới đúng cách.

---

## 2. Các tính chất bảo mật cơ bản

Khi nói đến bảo mật, có bốn tính chất được nhắc đến nhiều nhất — và mật mã học là công cụ để đạt chúng:

> [!info] Bốn tính chất bảo mật cốt lõi
>
> **Confidentiality** (Bảo mật) — dữ liệu chỉ đọc được bởi người có thẩm quyền. *Công cụ: encryption.*  
> **Integrity** (Toàn vẹn) — dữ liệu không bị sửa đổi mà không phát hiện ra. *Công cụ: hash, MAC, digital signature.*  
> **Authentication** (Xác thực) — biết chắc thực thể giao tiếp là ai. *Công cụ: digital signature, MAC, zero-knowledge proof.*  
> **Non-repudiation** (Không thể chối cãi) — người đã ký không thể phủ nhận sau đó. *Công cụ: public-key digital signature.*  

Trong CTF crypto, phần lớn bài tập tập trung vào **phá** một trong các tính chất trên — recover plaintext (phá confidentiality), forge signature (phá authentication/non-repudiation), hoặc bypass authentication (phá authentication). Trong CTF có rất đa dạng các thể loại bài ngoài những dạng trên, như dùng các kĩ thuật tấn công trên các vấn đề toán học liên quan crypto, hoặc cho chỉ cho văn bản mã hóa và đoán. Bên cạnh đó mỗi công cụ mật mã riêng thì mục tiêu tấn công cũng khác nhau dựa trên tính chất an toàn mà công cụ đó cung cấp như tấn công collision trên hash (hàm băm), tất công dự đoán khi cho một thuật toán sinh số ngẫu nhiên (pseudo random number generator), vân vân.

---

## 3. Bức tranh toàn cảnh: Cryptographic Primitives

Để biết mình đang học cái gì trong suốt khóa này, hãy nhìn vào bản đồ toàn cảnh:

![[assets/img-00-crypto-landscape.png]]
*Năm nhóm primitive mật mã chính — mỗi nhóm dựa trên một class bài toán khó toán học khác nhau.*

Bản đồ này là **la bàn** của cả khóa học. Sau mỗi phase, bạn sẽ thấy mình đã "chinh phục" thêm một vùng lãnh thổ mới. Quan trọng hơn là nhận ra mỗi primitive tồn tại để giải quyết một vấn đề cụ thể — và khi implementation sai, nó tạo ra một attack.

> [!note] Nguyên tắc Kerckhoffs (1883)
> *"Một hệ thống mật mã phải an toàn ngay cả khi mọi thứ về hệ thống, trừ key, là kiến thức công khai."*
>
> Đây là nguyên tắc nền tảng của mật mã học hiện đại: security không đến từ việc ẩn algorithm — algorithm của AES, RSA, SHA-256 đều công khai hoàn toàn. Security đến từ **key secret**. Bất kỳ scheme nào phụ thuộc vào "thuật toán bí mật" để an toàn đều bị coi là không tin cậy.

---

## 4. CTF là gì?

**CTF (Capture The Flag)** là format cuộc thi bảo mật trong đó người chơi giải các challenge kỹ thuật để tìm và submit chuỗi gọi là **flag** — thường có dạng `CTF{...}` hoặc `flag{...}`.

<invoke name="ctftime" /> Có ba format CTF chính:

> [!info] Ba format CTF
>
> **Jeopardy-style** — format phổ biến nhất, đặc biệt online. Các challenge được chia theo category với điểm số khác nhau theo độ khó. Team chọn challenge bất kỳ để giải. Ví dụ: DEF CON CTF Quals, PlaidCTF, HITCON CTF.
>
> **Attack-Defense** — mỗi team có một hệ thống dịch vụ với lỗ hổng. Team vừa phải bảo vệ dịch vụ của mình, vừa tấn công dịch vụ của đối thủ. Format on-site, dành cho team có kinh nghiệm.
>
> **Mixed** — kết hợp elements của cả hai format trên.

Trong **Jeopardy CTF**, các category phổ biến bao gồm:

- **Crypto** — mật mã: classical ciphers, AES, RSA, ECC, hash attacks, v.v.
- **Web** — khai thác web: SQL injection, XSS, SSRF, auth bypass
- **Rev (Reverse Engineering)** — phân tích binary, decompile, bypass checks
- **Pwn (Binary Exploitation)** — buffer overflow, ROP, heap exploitation
- **Forensics** — phân tích file, memory dump, steganography
- **OSINT** — tìm thông tin từ nguồn công khai

> [!tip] Về category Crypto trong CTF
> Crypto challenge thường cho bạn source code Python của một encryption scheme (hoặc output của nó), và yêu cầu bạn recover plaintext hoặc key. Đôi khi bạn có thể tương tác với một "oracle" — một server thực hiện encrypt/decrypt theo request của bạn và tiết lộ thông tin gián tiếp.

---

## 5. Quy trình giải bài Crypto CTF

![[assets/img-00-ctf-methodology.png]]
*Bốn bước cốt lõi khi tiếp cận một bài CTF crypto — áp dụng cho mọi level.*

Quy trình này không phải lý thuyết — nó là thói quen thực tế. Hầu hết người mới bị mắc kẹt ở bước 1 (không nhận ra scheme là gì) hoặc bỏ qua bước 2 (không phân tích đủ kỹ trước khi tìm attack). Và hầu hết người có kinh nghiệm dành phần lớn thời gian ở bước 3 (research), không phải bước 4 (exploit).

**Nhận diện scheme từ dấu hiệu:**

- Output chỉ có chữ cái (A-Z, a-z) → Classical cipher (Caesar, Vigenère)
- Output chỉ có ký tự hex (0-9a-f) → Raw bytes, hash, hoặc ciphertext được hex-encoded
- Output có dấu `=` ở cuối → Likely Base64
- Hai số lớn `(n, e)` → RSA public key
- File `.pem` hoặc header `-----BEGIN` → Asymmetric key
- Block size cố định 16 bytes → AES (block size = 128 bit)
- Output dài bằng input → Stream cipher hoặc XOR

Nói chung thì quá trình làm bài rất đa dạng, bạn sẽ phải tùy biến rất nhiều từ yêu cầu mà đề cho. Và đôi lúc những bài khó thì bạn phải kết hợp những kiến thức từ khác mảng khác vào.

---

## 6. Platform và tài nguyên học

Để thực hành, bạn nên dùng các platform sau:

> [!example] Các platform CTF crypto
>
> **CryptoHack** (cryptohack.org) — platform tốt nhất để học crypto qua CTF, được thiết kế riêng cho crypto. Mỗi challenge dạy một concept cụ thể. Bắt đầu tại đây.  
> **PicoCTF** (picoctf.org) — friendly với người mới, nhiều crypto challenge easy/medium, giải thích rõ ràng.  
> **CTFtime** (ctftime.org) — nơi track các cuộc thi CTF toàn cầu. Writeup của các cuộc thi là nguồn học cực tốt.  
> **OverTheWire** (overthewire.org) — wargame dạng linux shell, có các game về crypto (Krypton, Bandit).  
> **Cryptopals** (cryptopals.com) — bộ challenge kinh điển của Matasano/NCC Group. Đi sâu vào symmetric crypto và protocol attacks.

> [!note] Recommend từ Rougitsune  
> - Cryptohack là một nguồn cực kì chất lượng về mật mã học, nếu chỉ học từ một nguồn thì nên tập trung vào nguồn này. Nó bao gồm các bài ctf và bạn phải học kiến thức để tấn công, một nguồn học rất practice.  
> - Khi làm ctf thì bạn nên tập trung tự giải bằng khả năng và cố hiểu lí thuyết tấn công trước. Nên hạn chế dùng các công cụ AI để luyện tập, nó sẽ giúp bạn phát triển trực giác mạnh mẽ trong mật mã.
---

## 7. Ví dụ bài CTF easy: Base64 decode

Để thấy format bài CTF hoạt động như thế nào, đây là ví dụ đơn giản nhất (super ultra extremely very very easy):

> [!example] Challenge mẫu
> *"Chúng tôi tìm thấy chuỗi này trong log: `Q1RGe2I0czM2NF9pczVfbm90X2VuY3J5cHRpb259`. Flag là gì?"*

```python
import base64
encoded = "Q1RGe2I0czM2NF9pczVfbm90X2VuY3J5cHRpb259"
print(base64.b64decode(encoded).decode())
```

Output: `CTF{b4s364_is5_not_encryption}`

Bài này nhắc lại một điều quan trọng: **Base64 là encoding, không phải encryption**. Không có key, không có secret — chỉ là cách biểu diễn dữ liệu khác đi. Challenge thực sự bắt đầu khi có key và ciphertext thực sự.

---

## 8. Tại sao học mật mã?

Mật mã học không chỉ là CTF. Nó là nền tảng của hạo hết hạ tầng số hóa hiện đại — hàng triệu lần chạy mỗi ngày trên máy của bạn:

**HTTPS/TLS** — Mỗi login ngân hàng, email, mua sắm dùng TLS 1.2 (ECDHE + AES-GCM + HMAC-SHA256) hoặc TLS 1.3 (AEAD ciphers) để bảo vệ dữ liệu trong transit.

**Signal Protocol / WhatsApp** — Cung cấp forward secrecy và post-compromise security: nếu key hiện tại bị compromise, tin nhắn cũ vẫn an toàn và tin nhắn tương lai tự phục hồi. 2 tỷ người dùng phụ thuộc vào Double Ratchet algorithm.

**Bitcoin / Ethereum** — Sử dụng secp256k1 được xây dựng để tính toán nhanh hơn 30% so với các đường cong khác. 256-bit ECDSA cung cấp sức mạnh bằng 3,072-bit RSA — bảo vệ 1 nghìn tỷ USD tài sản số.

**SSH** — Ed25519 là EdDSA trên Curve25519, thực hiện constant-time operations để chống side-channel attacks. Dùng Diffie-Hellman cho key exchange cung cấp forward secrecy.

**Password Storage** — OWASP khuyến cáo Argon2id (Memory: 19 MiB, Iterations: 2); Argon2 là an toàn nhất chống GPU/ASIC; SHA-256 (180 tỷ attempt/s trên GPU).

**Federated Learning + Differential Privacy** — FL cho phép training algorithms trên nhiều thiết bị decentralized mà không chia sẻ dữ liệu thực tế. Differential Privacy thêm "noise" để bảo vệ cá nhân. Google dùng FL để cải thiện text suggestions trên điện thoại; hospitals cộng tác training disease diagnosis models mà không chia sẻ patient records.

**Homomorphic Encryption** — Cho phép tính toán trực tiếp trên dữ liệu mã hóa. Cloud provider không bao giờ nhìn thấy plaintext. Năm 2025, CipherFace cho phép facial recognition trên dữ liệu mã hóa.

**E-Voting** — Sử dụng blind signature + non-interactive zero-knowledge proofs + threshold encryption để đảm bảo tính hợp pháp cử tri mà bảo vệ quyền riêng tư.

**Secure Multi-Party Computation (MPC)** — Cho phép các bên joint compute functions trên private data. Năm 2025, Partisia chạy proof-of-concept facial recognition + decentralized ID system; cộng tác healthcare analytics, cross-border digital identity, secure banking data exchange. Banks dùng MPC cho fraud detection; hospitals phân tích patient genomes.

**Post-Quantum Cryptography** — Google 2026: secp256k1 vulnerable với ~1,200 logical qubits (~500k physical qubits trên system sufficiently advanced). "Harvest-now, decrypt-later": attackers collect encrypted data hôm nay, crack nó khi quantum computers mature. NIST standardized ML-KEM (Module-Lattice-Based KEM); NSA deadline 2030-2033, US federal 2035, UK 2035, EU 2030-2035.

---

> [!warning] Về mật mã và CTF  
> Mật mã rất rộng và sâu lý thuyết. CTF chỉ phản ánh một phần — chủ yếu lỗi implement và sử dụng sai. Nếu có hứng thú, phát triển thêm bằng: papers từ CRYPTO/EUROCRYPT/ASIACRYPT, open-source projects, Boneh & Shoup's course, hoặc quantum computing threats.

> [!tip] Mindset để học tốt
> Crypto CTF khác với Web hay Pwn: thất bại thường xảy ra ở bước **hiểu** hơn là bước **implement**. Nếu bạn hiểu đúng lý do tại sao một scheme yếu, exploit script thường ngắn hơn 50 dòng. Nếu bạn không hiểu, dù có 500 dòng code cũng không ra flag.


---

## 9. Summary

- **Cryptography** = thiết kế scheme bảo mật; **Cryptanalysis** = phá scheme.
- Bốn tính chất cần bảo vệ: Confidentiality, Integrity, Authentication, Non-repudiation.
- **Kerckhoffs's Principle**: security dựa trên key, không phải secret algorithm.
- **CTF Jeopardy**: giải challenge → tìm flag → submit điểm. Crypto là một category phổ biến.
- Quy trình giải: **Identify → Analyze → Research → Exploit**.
- Platform bắt đầu: **CryptoHack** và **PicoCTF**.

---

## 10. References

- Stallings, W. — *Cryptography and Network Security*, Chapter 1
- Boneh & Shoup — *A Graduate Course in Applied Cryptography*, Chapter 1 (toc.cryptobook.us)
- CTFtime.org — https://ctftime.org/ctf-wtf/
- CryptoHack — https://cryptohack.org (Introduction track)
- Kerckhoffs, A. — *La cryptographie militaire*, Journal des sciences militaires, 1883
