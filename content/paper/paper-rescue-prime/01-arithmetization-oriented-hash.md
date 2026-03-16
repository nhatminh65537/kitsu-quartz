---
title: "01. Arithmetization-Oriented Hash Functions & Sponge Construction"
type: foundation
tags: [rescue-prime, arithmetization, sponge-construction, hash-function, foundation, lesson-01]
aliases: [Arithmetization-Oriented Hash, AO Hash, Sponge Construction]
source: "Rescue-Prime: a Standard Specification (SoK) — Szepieniec, Ashur, Dhooghe, 2020. https://eprint.iacr.org/2020/1143"
created: 2026-03-15
---

> **Prerequisites**: Finite field cơ bản ($\mathbb{F}_p$, phép toán modular), hash function (collision resistance, preimage resistance), khái niệm cryptographic permutation  
> 🔴 **Prerequisite references**: Aly, Ashur, Ben-Sasson, Dhooghe, Szepieniec — *Design of symmetric-key primitives for advanced cryptographic protocols* [AABS+19] (paper Marvellous gốc — nền tảng lý thuyết của Rescue)  
> **Lesson type**: Foundation  
> **Covers**: §1 (Introduction), §1.1 (This Document), §1.2 (Not in This Document); sponge construction background cần thiết cho §2.2
>
> **Notation** (ký hiệu dùng trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\mathbb{F}_p$ | Trường hữu hạn nguyên tố bậc $p$ |
> | $p$ | Số nguyên tố xác định trường — primary parameter |
> | $m$ | Độ rộng state (state width), tính bằng số field elements |
> | $c_p$ | Capacity của sponge (số field elements "bí mật") |
> | $r_p = m - c_p$ | Rate của sponge (số field elements hấp thụ mỗi vòng) |
> | $f_{\text{RXLIX}}$ | Rescue-XLIX permutation: $\mathbb{F}_p^m \to \mathbb{F}_p^m$ |
> | $f_{\text{R}0}$ | Rescue-Prime hash function: $\mathbb{F}_p^* \to \mathbb{F}_p^{r_p}$ |

---

## Motivation

### Bối cảnh: Hash functions trong giao thức tiên tiến

Hash function truyền thống (SHA-256, BLAKE3, Keccak) được thiết kế để chạy nhanh trên **phần cứng và phần mềm thông thường**. Chúng sử dụng các phép toán bit-level: XOR, AND, rotation — rẻ trên CPU nhưng lại rất đắt khi biểu diễn dưới dạng **bài toán số học** (arithmetization).

Vấn đề nảy sinh khi ta muốn chứng minh (prove) trong một hệ thống zero-knowledge rằng mình *đã tính đúng một hash*:
- **SNARK / STARK**: biểu diễn computation dưới dạng các phương trình đại số trên một trường hữu hạn lớn.
- **MPC (Multi-Party Computation)**: các bên tính toán cùng nhau trên các phần tử trường — chia sẻ bí mật dưới dạng số nguyên.

Khi arithmetize SHA-256, một phép XOR đơn giản trở thành hàng chục ràng buộc đại số. Kết quả: **circuit proof của một SHA-256 có thể lớn hơn hàng chục nghìn lần** so với việc tính trực tiếp. Đây là nút thắt cổ chai.

> [!tip] 💡 Agent note
> Để hình dung rõ hơn: tính SHA-256 của một input ngắn cần khoảng 64 vòng, mỗi vòng dùng ~20,000 gates khi đưa vào R1CS (Rank-1 Constraint System). Trong khi đó Rescue-Prime với tham số tương đương chỉ cần vài chục ràng buộc bậc thấp trên $\mathbb{F}_p$ — giảm nhiều bậc độ lớn.

### Giải pháp: Arithmetization-Oriented (AO) Hash

**Arithmetization-oriented hash function** là họ hash được thiết kế ngược lại: tối ưu cho **biểu diễn đại số** trên trường hữu hạn, chấp nhận chậm hơn trên phần cứng thông thường nếu đổi lại là circuit nhỏ và đơn giản.

Các đại diện tiêu biểu của họ này: Poseidon, MiMC, GMiMC, Rescue, Rescue-Prime, Anemoi, Griffin.

Rescue-Prime là bản chuẩn hóa của Rescue (từ Marvellous [AABS+19]), tập trung vào:
- Prime fields $\mathbb{F}_p$ (không phải binary extension fields).
- Hash function duy nhất — không bàn block cipher hay stream cipher.
- Format dễ implement, không cần đọc paper gốc dài 50 trang.

---

## Sponge Construction

Rescue-Prime được xây dựng bằng **sponge construction** — một framework chuẩn để xây hash function và PRF từ một permutation tùy ý.

> [!note] Định nghĩa 1.1 — Arithmetic Sponge
> Cho permutation $f : \mathbb{F}_p^m \to \mathbb{F}_p^m$ và tham số capacity $c_p < m$, **arithmetic sponge** là cấu trúc với:
>
> - **State**: vector $\mathbf{s} \in \mathbb{F}_p^m$, khởi tạo là $\mathbf{0}$.
> - **Rate**: $r_p = m - c_p$ — số field elements hấp thụ mỗi lần gọi $f$.
> - **Capacity**: $c_p$ elements "bí mật" không bao giờ trực tiếp bị ghi đè từ input.
> - **Absorbing phase**: lần lượt XOR (cộng trên $\mathbb{F}_p$) từng khối $r_p$ input vào phần rate của state, sau đó áp dụng $f$.
> - **Squeezing phase**: đọc ra $r_p$ elements đầu tiên của state làm output; áp dụng $f$ thêm lần nữa nếu cần nhiều output hơn.

Trực giác về phân chia rate/capacity:

```
State (m elements):
┌─────────────────┬──────────────────┐
│  Rate (rp)      │  Capacity (cp)   │
│  ← input XOR   │  ← "hidden"      │
│  ← output read │                  │
└─────────────────┴──────────────────┘
```

Phần capacity **không bao giờ bị input ghi trực tiếp** — đây là nơi "entropy bí mật" được giữ lại sau mỗi lần áp dụng permutation, đảm bảo tính one-way.

### Generic Security của Sponge

Khi permutation $f$ không phân biệt được với một permutation ngẫu nhiên (random permutation), sponge-based hash function với output được truncate về $n \leq r_p$ field elements đạt mức bảo mật **ít nhất**:

$$
\left\lfloor \log_2\!\left(\sqrt{p} \cdot \min(n, c_p)\right) \right\rfloor \text{ bits}
$$

chống lại các tấn công: tìm collision, preimage, và second-preimage.

> [!tip] 💡 Agent note
> Công thức trên lấy từ §2.2 của paper. Ý nghĩa trực quan: $\sqrt{p}$ xuất phát từ birthday bound — với $|\mathbb{F}_p^n| = p^n$ outputs, birthday attack cần $\sim p^{n/2}$ queries. $\min(n, c_p)$ thể hiện rằng mức bảo mật bị giới hạn bởi cả số output elements *và* capacity — phần nhỏ hơn là nút cổ chai.

---

## Rescue-Prime trong bối cảnh

### Scope của document

Paper 2020/1143 là một **SoK (Systematization of Knowledge)** — không đề xuất primitives mới mà chuẩn hóa lại những gì đã biết. Cụ thể, nó:

- Đặc tả hoàn chỉnh **Rescue-XLIX permutation** và **Rescue-Prime hash function** (§2).
- Giải thích ba thay đổi so với Rescue gốc [AABS+19] (§3).
- Mô tả các biến thể cho trường hợp đặc biệt (§4).

Thứ paper này **không** bàn đến:
- Vision hash function (binary field counterpart).
- Cách arithmetize Rescue-Prime (chứng minh trong SNARK/STARK).
- Security arguments chi tiết (xem [AABS+19] và các paper phân tích bảo mật như [Bey+20a]).

### Tên gọi mới — phân biệt với Rescue gốc

| Tên | Đối tượng |
|-----|-----------|
| **Rescue** | Permutation trong paper gốc [AABS+19] |
| **Rescue-XLIX** | Permutation cải tiến trong paper này (§2.3) |
| **Rescue-Prime** | Hash function = sponge + Rescue-XLIX (§2.2) |

"XLIX" là số La Mã 49 — được đọc là "Rescue Forty Nine". Tên này không có ý nghĩa đặc biệt ngoài việc phân biệt với Rescue gốc.

> [!note] Ứng dụng thực tế (2020)
> Tại thời điểm paper được công bố, Rescue đã được dùng trong: EthSTARK (StarkWare), Halo (recursive proof composition), và Distaff (Polygon Miden). Rescue-Prime chuẩn hóa những deployment này về một format duy nhất.

---

## Summary

- **Arithmetization-oriented hash**: hash function tối ưu cho độ phức tạp đại số trên $\mathbb{F}_p$, dùng trong SNARK/STARK/MPC.
- **Sponge construction**: framework dùng permutation $f : \mathbb{F}_p^m \to \mathbb{F}_p^m$, chia state thành rate ($r_p$) và capacity ($c_p$), absorb input rồi squeeze output.
- **Generic security**: $\lfloor \log_2(\sqrt{p} \cdot \min(n, c_p)) \rfloor$ bits khi permutation là random.
- **Rescue-Prime** = sponge + **Rescue-XLIX** permutation — bản chuẩn hóa của Rescue [AABS+19] với 3 thay đổi nhỏ.
- Paper này là SoK cho implementers, không phải cho cryptanalysts.

---

## References

- [AABS+19] Aly, Ashur, Ben-Sasson, Dhooghe, Szepieniec — *Design of symmetric-key primitives for advanced cryptographic protocols*, IACR ePrint 2019/426 (🔴 Prerequisite / 🟡 dùng trong Lesson 04)
- [BGS20] Ben-Sasson, Goldberg, Levit — *STARK-friendly hash survey*, ePrint 2020/948 (⚪)
- [Bey+20a] Beyne et al. — *Out of Oddity*, CRYPTO 2020 (⚪)
