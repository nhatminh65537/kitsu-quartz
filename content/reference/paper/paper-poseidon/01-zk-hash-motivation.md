---
title: "01. ZK-Friendly Hash Functions & POSEIDON Overview"
type: foundation
tags: [poseidon, hash-function, zk-proof, snark, stark, foundation, lesson-01]
aliases: [POSEIDON Overview, ZK Hash]
source: "POSEIDON: A New Hash Function for Zero-Knowledge Proof Systems — Grassi, Khovratovich, Rechberger, Roy, Schofnegger, USENIX Security 2021"
created: 2026-03-15
---

> **Prerequisites**: Finite field $\mathbb{F}_p$, hash function (collision resistance, preimage resistance), khái niệm arithmetic circuit trong ZK proof systems  
> 🔴 **Prerequisite references**: Bertoni et al. — *Sponge Functions* [BDPA08] (sponge construction, xem [[02-sponge-construction|02. Sponge Construction]]); Grassi et al. — *HADES Design Strategy* [GLR+20] (chi tiết SPN tổng quát, xem [[03-hades-round-function|03. HADES & Round Function]])  
> **Lesson type**: Foundation  
> **Covers**: §1, §1.1 (Our Contributions, Table 1), §1.2 (Comparison to HADES), §1.3 (Related Work), §1.4 (Structure), §1.5 (Historic Remarks)
>
> **Notation** (ký hiệu dùng trong bài mà không định nghĩa lại):
> | Ký hiệu | Ý nghĩa | Ký hiệu trong paper |
> |---------|---------|---------------------|
> | $\mathbb{F}_p$ | Trường hữu hạn với $p$ phần tử, $p$ nguyên tố | $\mathbb{F}_p$ |
> | $n$ | Kích thước (bit) của một phần tử $\mathbb{F}_p$: $p \approx 2^n$ | $n$ |
> | $t$ | Chiều rộng (width) của state trong POSEIDON permutation | $t$ |
> | $R_F$ | Tổng số full rounds (= $2R_f$) | $R_F$ |
> | $R_P$ | Số partial rounds | $R_P$ |
> | $M$ | Security level tính bằng bit | $M$ |
> | $\alpha$ | Bậc của S-box: $\mathsf{S\text{-}box}(x) = x^\alpha$ | $\alpha$ |
> | R1CS | Rank-1 Constraint System — mô hình constraint của Groth16 | — |
> | AET | Algebraic Execution Trace — mô hình constraint của STARKs | — |

---

## Motivation: Vì sao SHA-256 không phù hợp cho ZK?

Hàm băm mật mã truyền thống như SHA-256 hay Keccak được tối ưu hoá cho một thế giới khác — thế giới của phép XOR, bit-rotation, và AND trên bộ vi xử lý 64-bit. Nhưng khi cần **chứng minh** rằng ta biết preimage của một hash trong ZK proof system (SNARKs, STARKs, Bulletproofs), ta phải biểu diễn toàn bộ hàm băm dưới dạng **arithmetic circuit** — một mạng các phép cộng và nhân trên trường hữu hạn $\mathbb{F}_p$.

Đây là nơi SHA-256 thất bại hoàn toàn: một phép XOR $a \oplus b$ trong $\mathbb{F}_p$ cần nhiều phép nhân phức tạp để mô phỏng, trong khi $a + b$ hay $a \cdot b$ trong $\mathbb{F}_p$ đã là gate nguyên thủy của circuit. Hệ quả cụ thể: chứng minh sở hữu preimage của SHA-256 trong **Zcash phiên bản đầu** tốn tới **42 giây** trên máy tính bình thường — hoàn toàn không thể dùng được trong thực tế.

Câu hỏi đặt ra: liệu có thể thiết kế một hash function vẫn bảo mật như SHA-256 nhưng được "sinh ra" để làm việc trên $\mathbb{F}_p$, khiến chi phí ZK circuit giảm đến mức tối thiểu?

---

## POSEIDON: Hash Function Đại Số

**POSEIDON** là câu trả lời cho câu hỏi đó. Được thiết kế vào cuối năm 2018 và công bố năm 2019, POSEIDON là một **algebraic hash function** — toàn bộ quá trình tính toán chỉ dùng **cộng và nhân** trong $\mathbb{F}_p$, không có phép toán bit nào.

> [!tip] 💡 Agent note
> Thuật ngữ "algebraic hash function" hay "arithmetization-oriented (AO) primitive" dùng để phân biệt với các hash truyền thống (SHA-2, SHA-3) vốn dùng boolean/bitwise operations. Thuật ngữ này không có trong mọi tài liệu — một số nguồn gọi là "ZK-friendly hash", "SNARK-friendly hash", hoặc "field-native hash".

### Kiến trúc tổng quan

POSEIDON xây dựng hash từ hai lớp:

1. **Permutation $\mathsf{POSEIDON}^\pi$**: Hoán vị cố định trên vector $t$ phần tử $\mathbb{F}_p$, thiết kế theo chiến lược HADES — xen kẽ các *full rounds* (áp dụng S-box cho toàn bộ state) và *partial rounds* (áp dụng S-box cho một phần tử duy nhất).

2. **Hash function POSEIDON**: Sponge construction dùng $\mathsf{POSEIDON}^\pi$ làm permutation bên trong, với capacity $c$ và rate $r$ xác định mức bảo mật và thông lượng.

Toàn bộ thiết kế được tham số hóa bởi tuple $(n, t, R_F, R_P, \alpha)$, cho phép tạo ra nhiều **instantiation** khác nhau phù hợp với từng proof system.

---

## Đóng Góp Chính (§1.1)

Paper đề xuất framework mô đun và các instantiation cụ thể. Đây là so sánh trực tiếp từ **Table 1** của paper — số constraint trên mỗi bit message khi dùng làm Merkle tree hash:

| Hash function | Proof system | R1CS / bit (hay AET cols) | Ghi chú |
|---------------|-------------|--------------------------|---------|
| **POSEIDON-128** | Groth16 | **~8×** ít hơn Pedersen | Dùng BLS12-381 |
| **POSEIDON-128** | Bulletproofs | tương đương | Không cần pairing-friendly curve |
| Pedersen Hash | Groth16 | baseline (1×) | Edwards curve ops |
| SHA-256 | Groth16 | ~50–100× đắt hơn POSEIDON | XOR → nhiều constraints |
| MiMC | Groth16 | ~2–3× đắt hơn POSEIDON | Chỉ $x^3$ S-box |
| Rescue | Groth16 | ~1.5× đắt hơn POSEIDON | Dùng cả $x^\alpha$ và $x^{1/\alpha}$ |

> [!info] 🟡 MiMC — baseline so sánh (từ [AGR+16])
> MiMC (Albrecht et al., ASIACRYPT 2016) là ZK-friendly hash đầu tiên có ảnh hưởng lớn: sử dụng S-box $x^3$ đơn giản và nhiều round để đạt bảo mật, với multiplicative complexity (số phép nhân) thấp. POSEIDON cải thiện so với MiMC bằng cách thêm partial rounds — giảm đáng kể số S-box cần thiết trong khi vẫn duy trì bảo mật tương đương.
>
> *(theo [AGR+16]: Albrecht, Grassi, Rechberger, Roy, Tiessen — MiMC: Efficient Encryption and Cryptographic Hashing with Minimal Multiplicative Complexity, ASIACRYPT 2016)*

**Kết quả quan trọng nhất**: Dùng Bulletproofs + POSEIDON-128 với Merkle tree chiều sâu 30 (tức 1-of-a-billion membership proof), proof time **dưới 1 giây** — điều không tưởng với SHA-256.

---

## So Sánh Với HADES (§1.2)

POSEIDON được thiết kế dựa trên chiến lược **HADES** [GLR+20] nhưng có hai điểm khác biệt quan trọng:

> [!info] 🟡 HADES Design Strategy (từ [GLR+20])
> HADES (Grassi, Lüftenegger, Rechberger, Rotaru, Schofnegger, EUROCRYPT 2020) là một tổng quát hóa của Substitution-Permutation Network (SPN): thay vì áp dụng S-box cho toàn bộ state trong mọi round, HADES cho phép một số round chỉ dùng partial S-box layer (một S-box duy nhất). Chiến lược này — $R_f$ full rounds ở đầu + $R_P$ partial rounds ở giữa + $R_f$ full rounds ở cuối — cung cấp bảo mật thống kê qua full rounds và bảo mật đại số qua partial rounds, với chi phí multiplicative thấp hơn nhiều.
>
> *(theo [GLR+20]: Grassi et al. — On a Generalization of Substitution-Permutation Networks: The HADES Design Strategy, EUROCRYPT 2020)*

**POSEIDON so với HADES thuần tuý**:

1. **Target application**: HADES gốc thiết kế cho MPC (multi-party computation) với metric là *multiplicative complexity*. POSEIDON tái mục tiêu cho **ZK proof systems** với metric là *số R1CS constraints* hoặc *AET columns* — hai metric này khác nhau đáng kể.

2. **S-box choice**: HADES cho phép S-box tổng quát. POSEIDON cụ thể hóa với $x^\alpha$ (power map) vì đây là polynomial bậc thấp nhất có thể inverse trên $\mathbb{F}_p$, tối ưu nhất cho ZK arithmetization.

3. **No key schedule**: POSEIDON là permutation (không có key), phù hợp với sponge mode. HADES gốc là block cipher với key.

---

## Related Work (§1.3)

Bối cảnh khi POSEIDON ra đời (2018–2019):

**Rescue / MARVELlous** (Ashur-Dhooghe [ACD+19]): dùng S-box xen kẽ $x^\alpha$ và $x^{1/\alpha}$, cung cấp bảo mật chặt hơn nhưng đắt hơn vì $x^{1/\alpha}$ tốn kém trong ZK. POSEIDON chọn *không* dùng inverse S-box để giảm chi phí.

**MiMC** [AGR+16]: chỉ dùng $x^3$, rất đơn giản nhưng số round nhiều. POSEIDON vượt trội nhờ partial rounds giảm số S-box tổng.

**Pedersen Hash**: sử dụng elliptic curve point operations. Rất efficient với Bulletproofs nhưng không phải field-native.

> [!tip] 💡 Agent note
> Một điểm thú vị trong §1.3: paper lưu ý rằng STARK paper gốc [BBHR19] đề xuất dùng Rijndael (AES) làm hash trong ZK applications, nhưng nhóm POSEIDON đã nhận ra rằng AES không phù hợp cho hash mode vì các *related-key trails* trong key schedule. Đây chính là một trong những động lực ban đầu để thiết kế POSEIDON.

---

## Tại Sao Không Có "Một Hash Tốt Nhất"? (§1.4)

Paper nhấn mạnh một điểm quan trọng thường bị bỏ qua: **không tồn tại một POSEIDON instance duy nhất tối ưu cho mọi proof system**, vì các hệ thống khác nhau dùng các mô hình arithmetization khác nhau:

- **SNARKs (Groth16)**: làm việc trên prime field của pairing-friendly curve (BLS12-381, BN254). Metric là số *R1CS constraints* (phép nhân).
- **SNARKs (PLONK)**: metric là số *gates* trong custom circuit với fan-in 2 hoặc 3.
- **STARKs**: làm việc trên prime field tùy ý (kể cả Mersenne primes). Metric là số *AET columns × steps*.
- **Bulletproofs**: làm việc trên bất kỳ prime field nào, metric là số *multiplications*.

Do đó, mỗi proof system cần một **POSEIDON instantiation riêng** với tham số $(n, t, R_F, R_P, \alpha)$ được tối ưu hoá cho metric tương ứng. Chi tiết về cách chọn tham số sẽ được trình bày trong [[04-instantiations-parameters|04. Instantiations & Parameters]].

---

## Lịch Sử Thiết Kế (§1.5)

POSEIDON bắt đầu hình thành vào **mùa thu 2018**, được truyền cảm hứng từ ba nguồn:

- **LowMC** [ARS+15]: ý tưởng partial S-box layer để giảm multiplicative complexity.
- **SHARK** [RSDDF96]: inverse S-box và MDS matrix như linear layer.
- **MiMC** [AGR+16]: S-box đơn giản bằng power map trên $\mathbb{F}_p$.

Phiên bản đầu tiên của S-box xét cả inverse map $x^{-1}$ (như trong AES) lẫn power map $x^\alpha$. Sau phân tích, nhóm chọn **power map** vì có biểu diễn polynomial bậc thấp hơn — đặc biệt quan trọng để chặn interpolation attack.

> [!warning] Tên thay đổi giữa các phiên bản
> ePrint version ban đầu (2019) có tên **"Starkad and Poseidon"** — bao gồm cả Starkad (phiên bản binary field) bên cạnh Poseidon (phiên bản prime field). Phiên bản USENIX 2021 chỉ giữ lại POSEIDON (prime field), vì Starkad tỏ ra kém cạnh tranh hơn sau khi các STARK-friendly hash mới xuất hiện. Tên ePrint/2019/458 vẫn trỏ đến version cập nhật nhất.

---

## Summary

- **SHA-256 và Keccak** quá đắt trong ZK circuits vì chứa XOR/bit-ops → cần hash field-native.
- **POSEIDON** = sponge construction dùng permutation $\mathsf{POSEIDON}^\pi$ trên $\mathbb{F}_p$; toàn bộ tính toán chỉ dùng $+$ và $\times$ trong $\mathbb{F}_p$.
- **HADES strategy** [GLR+20]: $R_f$ full rounds + $R_P$ partial rounds + $R_f$ full rounds — bảo mật thống kê từ full rounds, bảo mật đại số từ partial rounds.
- Hiệu suất: **~8× ít constraints hơn Pedersen Hash** trong Groth16; membership proof Merkle tree 1-of-a-billion **< 1 giây** với Bulletproofs.
- Không có instantiation tối ưu cho mọi proof system — mỗi proof system cần POSEIDON riêng.

---

## References

- [GLR+20] Grassi, Lüftenegger, Rechberger, Rotaru, Schofnegger — *On a Generalization of Substitution-Permutation Networks: The HADES Design Strategy*, EUROCRYPT 2020 (🟡 Integrate)
- [AGR+16] Albrecht, Grassi, Rechberger, Roy, Tiessen — *MiMC: Efficient Encryption and Cryptographic Hashing with Minimal Multiplicative Complexity*, ASIACRYPT 2016 (🟡 Integrate)
- [ACD+19] Albrecht, Cid, Grassi et al. — *Algebraic Cryptanalysis of STARK-Friendly Designs: Application to MARVELlous and MiMC*, ASIACRYPT 2019 (🟡 Integrate — dùng trong Lesson 06)
- [BDPA08] Bertoni, Daemen, Peeters, Van Assche — *On the Indifferentiability of the Sponge Construction*, EUROCRYPT 2008 (🔴 Prerequisite)
- [ARS+15] Albrecht, Rechberger, Schneider, Tiessen, Zohner — *Ciphers for MPC and FHE*, EUROCRYPT 2015 (⚪ Citation only)
- [BBHR19] Ben-Sasson, Bentov, Horesh, Riabzev — *Scalable Zero Knowledge with No Trusted Setup*, CRYPTO 2019 (⚪ Citation only)
