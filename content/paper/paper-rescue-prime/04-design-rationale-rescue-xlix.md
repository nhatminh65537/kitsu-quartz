---
title: "04. Design Rationale: Rescue-XLIX vs. the Original Rescue"
type: deep-dive
tags: [rescue-prime, rescue-xlix, design-rationale, arithmetization, folding, deep-dive, lesson-04]
aliases: [Rescue-XLIX Design Rationale, Rescue vs Rescue-XLIX]
source: "Rescue-Prime: a Standard Specification (SoK) — Szepieniec, Ashur, Dhooghe, 2020. https://eprint.iacr.org/2020/1143"
created: 2026-03-15
---

> **Prerequisites**: Rescue-XLIX Permutation (xem [[02-rescue-xlix-permutation|02. Rescue-XLIX Permutation]]), Rescue-Prime Hash Function (xem [[03-rescue-prime-hash-function|03. Rescue-Prime Hash Function]])  
> 🔴 **Prerequisite references**: Aly, Ashur, Ben-Sasson, Dhooghe, Szepieniec — *Design of Symmetric-Key Primitives for Advanced Cryptographic Protocols* [AABS+19] (paper Marvellous gốc — định nghĩa Rescue ban đầu, kỹ thuật "folding", security arguments)  
> **Lesson type**: Deep Dive  
> **Covers**: §3.1 (Flipped Order of S-boxes), §3.2 (Simplified Specification of Round Constants), §3.3 (Reduced Security Margin)
>
> **Notation**:
> | Ký hiệu | Ý nghĩa | Ghi chú |
> |---------|---------|---------|
> | Rescue | Permutation trong paper gốc [AABS+19] | Thứ tự S-box: $\alpha^{-1}$ trước, $\alpha$ sau |
> | Rescue-XLIX | Permutation trong paper này | Thứ tự S-box: $\alpha$ trước, $\alpha^{-1}$ sau |
> | $\alpha$ | S-box exponent thuận (bậc thấp) | Coprime với $p-1$ |
> | $\alpha^{-1}$ | Inverse S-box exponent (bậc cao) | Nghịch đảo mod $p-1$ |
> | "folding" | Kỹ thuật arithmetize hai bước thành một tập ràng buộc | Khái niệm từ [AABS+19] |

---

## Context

Rescue-XLIX không phải là một thiết kế hoàn toàn mới. Nó là bản cải tiến của **Rescue** — permutation được giới thiệu trong paper Marvellous [AABS+19] của Aly, Ashur, Ben-Sasson, Dhooghe, và Szepieniec (IACR ToSC 2020(3)).

> [!info] 🟡 [AABS+19] — Marvellous Design Strategy
> [AABS+19] xác định sự khác biệt giữa **arithmetization-oriented ciphers** và traditional ciphers (AES, SHA-3), đề xuất chiến lược thiết kế Marvellous, và giới thiệu hai họ primitive: **Vision** (binary fields) và **Rescue** (prime fields). Paper dài 45 trang, target audience là các symmetric-key cryptanalysts, bao gồm security arguments chi tiết, benchmarks trên ZK-STARK, R1CS (Rank-One Constraint Satisfaction), và MPC.
>
> Rescue trong [AABS+19] có cùng cấu trúc SPN với power maps nhưng khác Rescue-XLIX ở ba điểm: (1) thứ tự S-box ngược, (2) round constants từ key schedule với key=0, (3) security margin 100%.
>
> *(theo [AABS+19]: Aly, Ashur, Ben-Sasson, Dhooghe, Szepieniec — IACR Transactions on Symmetric Cryptology 2020(3), pp. 1–45)*

Rescue-XLIX khác Rescue gốc ở **ba điểm** được mô tả trong §3. Bài học này giải thích lý do và hệ quả của từng thay đổi.

---

## Thay đổi 1: Lật Thứ Tự S-box (§3.1)

### Original Rescue — thứ tự gốc

Trong Rescue [AABS+19], mỗi round bắt đầu bằng **inverse S-box** ($\alpha^{-1}$) trước, sau đó mới đến **S-box thuận** ($\alpha$):

```
Rescue round:  [Inv S-box α⁻¹] → [MDS] → [+C] → [S-box α] → [MDS] → [+C]
```

### Rescue-XLIX — thứ tự lật ngược

Rescue-XLIX đảo ngược thứ tự này: **S-box thuận** ($\alpha$) trước, **inverse S-box** ($\alpha^{-1}$) sau:

```
Rescue-XLIX round:  [S-box α] → [MDS] → [+C] → [Inv S-box α⁻¹] → [MDS] → [+C]
```

### Lý do: kỹ thuật "folding" hoạt động toàn phần

Trong [AABS+19], các tác giả giới thiệu kỹ thuật gọi là **folding**: thay vì biểu diễn mỗi bước S-box thành một tập ràng buộc riêng biệt, ta "gộp" (fold) hai bước liên tiếp thành một tập ràng buộc bậc thấp hơn, loại bỏ các biến trung gian.

> [!tip] 💡 Agent note
> Cụ thể: với dãy $[\alpha] \to [\alpha^{-1}]$ (hoặc ngược lại), ta có thể biểu diễn mối quan hệ giữa input $x$ và output $z = (x^\alpha)^{\alpha^{-1}}$ mà không cần biến trung gian $y = x^\alpha$. Ràng buộc duy nhất là $x \cdot z^{\alpha-1} = 1$ (hoặc tương đương), bậc $\alpha$ thay vì $\alpha \cdot \alpha^{-1}$. Điều này **giảm số ràng buộc** trong arithmetization đáng kể.

**Vấn đề với Rescue gốc**: Kỹ thuật folding áp dụng được cho mọi cặp $[\alpha^{-1}][\alpha]$ liên tiếp — tức là ở giữa các rounds. Nhưng bước $\alpha^{-1}$ **đầu tiên** (round 0 step 1) và bước $\alpha$ **cuối cùng** (round $N-1$ step 4) là hai bước đơn lẻ không thể fold, đòi hỏi xử lý riêng.

**Giải pháp trong Rescue-XLIX**: Bằng cách lật thứ tự — $[\alpha]$ trước, $[\alpha^{-1}]$ sau — khái niệm bắt đầu và kết thúc thay đổi. Conceptually, đây tương đương với việc "thêm một bước $\alpha^{-1}$ ở đầu và một bước $\alpha$ ở cuối" so với Rescue gốc. Kết quả:

- **Folding áp dụng đồng đều cho mọi vị trí** trong cipher, kể cả bước đầu và cuối.
- Không cần xử lý đặc biệt (special casing) cho boundary rounds.
- Arithmetization trở nên **uniform và sạch hơn**.

### Hệ quả với Gröbner basis attack

> [!abstract] Claim 4.1 — Số phương trình không thay đổi (§3.1)
> Lật thứ tự S-box **không thay đổi** số phương trình và biến trong một Gröbner basis attack.

**Lý do**: Kỹ thuật folding cải tiến áp dụng cho cả hai thứ tự — attacker cũng có thể dùng arithmetization tốt nhất cho cả hai hướng. Số phương trình và bậc của hệ đa thức giữ nguyên. Thứ tự lật thay đổi *hình dạng* của phương trình tại bước đầu và cuối nhưng không tăng hay giảm độ khó tổng thể.

---

## Thay đổi 2: Đơn Giản Hóa Round Constants (§3.2)

### Original Rescue — round constants phức tạp

Trong Rescue [AABS+19], round constants được sinh theo cách **convoluted** (phức tạp):
1. Định nghĩa một key schedule cho block cipher dùng affine relation từ SHAKE-256.
2. Set khóa bằng $0$.
3. Các sub-keys tương ứng chính là round constants.

Cách này vừa khó hiểu vừa khó implement — phải implement toàn bộ key schedule chỉ để sinh constants tĩnh.

### Rescue-XLIX — sinh trực tiếp từ seed

Rescue-XLIX sinh round constants **trực tiếp từ SHAKE-256** với seed string `"Rescue-XLIX(p,m,cp,s)"`, không qua key schedule (như đã mô tả trong Lesson 02, Algorithm 5).

**Hai mục tiêu đạt được**:

**1. Nothing-up-my-sleeve**: Constants được sinh từ một seed công khai, hoàn toàn xác định. Bất kỳ ai cũng có thể verify rằng designers không nhúng trapdoor vào constants. Đây là pattern chuẩn trong thiết kế cryptographic — số π, e, hay một hash của chuỗi ASCII đều được dùng làm nothing-up-my-sleeve constants.

**2. Standardization**: Một cách sinh duy nhất, rõ ràng, nhất quán → mọi implementation đều tạo ra cùng constants → **interoperability** đảm bảo. Paper [AABS+19] đã gây ra nhiều sự nhầm lẫn trong deployment vì spec round constants không đủ rõ ràng.

> [!tip] 💡 Agent note
> Đây là lý do "SoK" (Systematization of Knowledge) trong tên paper. Một phần quan trọng của SoK không phải là đề xuất kỹ thuật mới mà là **chuẩn hóa** những gì đã tồn tại để các project độc lập (EthSTARK, Halo, Distaff) có thể dùng cùng một implementation.

---

## Thay đổi 3: Giảm Security Margin (§3.3)

### Original Rescue — 100% security margin

Rescue [AABS+19] dùng security margin **100%**: số rounds $N$ được chọn bằng $2 \times \ell_1$ (gấp đôi round count tối thiểu để đánh bại Gröbner basis attack).

### Rescue-XLIX — 50% security margin

Rescue-XLIX giảm xuống còn **50%**: $N = \lceil 1.5 \times \max(5, \ell_1) \rceil$.

**Lý do giảm margin**: §3.3 đưa ra lập luận ba phần:

1. **Thời gian đã qua**: Rescue được public năm 2019. Kể từ đó nhiều project đã deploy, nhiều cryptanalyst đã phân tích, một cuộc thi bảo mật (STARK-friendly hash challenge) đã diễn ra.

2. **Không có weakness nào được tìm thấy**: Các paper [Bey+20a, Bey+20b, KR20, BGS20] và kết quả của cuộc thi đều không tìm ra điểm yếu trong Rescue.

3. **Confidence level cao hơn**: Sau khoảng thời gian scrutiny mà không có weakness → confidence rằng round count tối thiểu là chính xác tăng lên → margin 50% là hợp lý hơn 100%.

> [!warning] Đây là trade-off
> Giảm security margin = giảm số rounds = **nhanh hơn** (ít phép tính trên $\mathbb{F}_p$ hơn) nhưng ít buffer nếu có attack mới được phát hiện. Với Rescue-Prime, đây là quyết định có cơ sở sau hơn một năm cryptanalysis, nhưng người dùng trong các ứng dụng high-stakes nên cân nhắc dùng margin cao hơn nếu performance không phải ưu tiên.

---

## Tổng hợp: Rescue vs Rescue-XLIX

| Đặc điểm | Rescue [AABS+19] | Rescue-XLIX |
|-----------|-----------------|-------------|
| Thứ tự S-box trong round | $\alpha^{-1}$ trước, $\alpha$ sau | $\alpha$ trước, $\alpha^{-1}$ sau |
| Folding áp dụng | Mọi vị trí trừ boundary rounds | Mọi vị trí đồng đều |
| Round constants | Từ key schedule với key=0 | Trực tiếp từ SHAKE-256 seed |
| Security margin | 100% ($N = 2 \times \ell_1$) | 50% ($N = 1.5 \times \ell_1$) |
| Dễ implement | Phức tạp | Đơn giản |
| Interoperability | Không đảm bảo | Đảm bảo (seed chuẩn hóa) |

---

## Ý nghĩa đối với Implementers

Ba thay đổi này khiến Rescue-XLIX **không tương thích ngược** với Rescue gốc:
- Cùng tham số $(p, m, c_p, s)$ nhưng Rescue và Rescue-XLIX tạo ra các **permutation khác nhau**.
- Nếu một project đã deploy Rescue, không thể đơn giản "nâng cấp" lên Rescue-XLIX mà không break compatibility.

Paper 2020/1143 được thiết kế như một **chuẩn mới** — projects mới nên dùng Rescue-Prime; projects cũ dùng Rescue vẫn an toàn theo security arguments của [AABS+19].

---

## Summary

- **Thay đổi 1** — Lật thứ tự S-box: $\alpha$ trước, $\alpha^{-1}$ sau. Cho phép kỹ thuật "folding" (từ [AABS+19]) áp dụng đồng đều, đơn giản hóa arithmetization. Không thay đổi độ khó tấn công.
- **Thay đổi 2** — Round constants từ SHAKE-256 trực tiếp: loại bỏ key schedule phức tạp, đảm bảo nothing-up-my-sleeve và standardization.
- **Thay đổi 3** — Security margin từ 100% xuống 50%: dựa trên hơn 1 năm cryptanalysis không tìm ra weakness; cho phép giảm số rounds và tăng hiệu suất.
- Ba thay đổi cộng lại tạo ra một primitive **nhanh hơn, dễ implement hơn, và có spec rõ ràng hơn** — không có cái giá nào về bảo mật theo hiểu biết hiện tại.

---

## References

- [AABS+19] Aly, Ashur, Ben-Sasson, Dhooghe, Szepieniec — *Design of Symmetric-Key Primitives for Advanced Cryptographic Protocols*, IACR ToSC 2020(3), pp. 1–45 (🟡 Integrated — folding technique, original Rescue spec, security arguments)
- [BGS20] Ben-Sasson, Goldberg, Levit — *STARK-friendly hash survey*, ePrint 2020/948 (⚪)
- [Bey+20a] Beyne et al. — *Out of Oddity*, CRYPTO 2020 (⚪)
- [Bey+20b] Beyne et al. — *Report on the security of the Rescue hash function* (⚪)
- [KR20] Keller, Rosemarin — *Mind the Middle Layer: HADES design revisited*, ePrint 2020/179 (⚪)
