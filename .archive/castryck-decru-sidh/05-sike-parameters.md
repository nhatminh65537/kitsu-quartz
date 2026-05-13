---
title: "05. SIKE: Parameters, Auxiliary Points, and What They Reveal"
type: deep-dive
tags: [crypto, sike, torsion-points, auxiliary-points, castryck-decru, lesson-05]
aliases: [SIKE Parameters]
created: 2026-04-08
---

> **Prerequisites**: [[04-sidh-protocol|04. SIDH Protocol]]
> **Lesson type**: Deep Dive
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $p_{434}$ | Prime SIKE-p434: $2^{216} \cdot 3^{137} - 1$ |
> | $a, b$ | Exponents: $a = 216$, $b = 137$ trong SIKE-p434 |
> | $M_{\phi_A}$ | Ma trận $2\times 2$ biểu diễn action của $\phi_A$ trên $E_0[3^b]$ |
> | $\iota$ | Endomorphism đặc biệt $\iota : (x,y) \mapsto (-x, iy)$ trên $E_0$ |

---

## Motivation

SIKE là KEM (Key Encapsulation Mechanism) được xây dựng từ SIDH, đạt đến round 4 của NIST PQC competition. Bài này phân tích kỹ hơn cấu trúc SIKE: chọn prime như thế nào, tại sao $j(E_0) = 287496$, và — quan trọng nhất — **chính xác bao nhiêu thông tin về $\phi_A$ bị tiết lộ qua public key**. Phân tích này là bước cầu nối trực tiếp sang Castryck-Decru attack.

---

## 1. SIKE Parameter Sets

> [!note] Bảng 5.1 — SIKE Parameter Sets
> | Instance | $p$ | $a$ | $b$ | Security level | Thời gian bị phá |
> |----------|-----|-----|-----|---------------|----------------|
> | SIKEp434 | $2^{216}\cdot 3^{137}-1$ | 216 | 137 | 1 (128-bit) | ~10 phút (1 core) |
> | SIKEp503 | $2^{250}\cdot 3^{159}-1$ | 250 | 159 | 2 (128-bit quantum) | ~2 giờ |
> | SIKEp610 | $2^{305}\cdot 3^{192}-1$ | 305 | 192 | 3 (192-bit quantum) | ~8 giờ |
> | SIKEp751 | $2^{372}\cdot 3^{239}-1$ | 372 | 239 | 5 (256-bit quantum) | ~21 giờ |

Tất cả bị Castryck-Decru phá trên một laptop, chạy trên single core.

Điều kiện thiết kế: $2^a \approx 3^b \approx \sqrt{p}$ — để cả hai sides có approximate security parity.

---

## 2. Starting Curve và Lý Do Chọn $j = 287496$

SIKE ban đầu dùng $E_0 : y^2 = x^3 + x$ với $j = 1728$, nhưng sau đó đổi sang $E_0 : y^2 = x^3 + 6x^2 + x$ với $j = 287496$ (trong round 2+).

> [!warning] Vấn Đề Với $j = 1728$
> Curve $j = 1728$ có quá ít neighbors trong isogeny graph:
> - Chỉ có **một** 2-isogenous curve (không kể backtrack)
> - Chỉ có **hai** 3-isogenous curves (thay vì bốn)
>
> Điều này có nghĩa là sau khi Alice đi bước đầu tiên trong 2-isogeny graph từ $j = 1728$, adversary **biết chắc** Alice đã đi đến đâu — leak thông tin về secret key step đầu tiên.

Curve $j = 287496$ khắc phục điều này: nó có đủ neighbors trong cả 2-isogeny và 3-isogeny graph, không có "bottleneck" đặc biệt.

**Tuy nhiên**, curve mới vẫn giữ tính chất quan trọng: $j = 287496$ tương ứng với một curve có **known endomorphism ring** — tức là attacker vẫn biết $\text{End}(E_0)$. Đây là điều Castryck-Decru exploit.

---

## 3. Formal Analysis: Thông Tin Trong Public Key Alice

Gọi public key Alice là $(E_A, R_B = \phi_A(P_B), S_B = \phi_A(Q_B))$.

**Thứ nhất**: $E_A$ cho biết **endpoint** của isogeny walk của Alice — tức là j-invariant của $E_0 / \langle S_A \rangle$. Không biết gì hơn về $S_A$.

**Thứ hai**: $(R_B, S_B)$ cho biết **hành động** của $\phi_A$ trên $E_0[3^b]$.

Vì $\{P_B, Q_B\}$ là basis của $E_0[3^b] \cong (\mathbb{Z}/3^b\mathbb{Z})^2$, isogeny $\phi_A$ restricted onto $E_0[3^b]$ là một **$\mathbb{Z}/3^b\mathbb{Z}$-linear map**:

$$
\phi_A|_{E_0[3^b]} : E_0[3^b] \to E_A[3^b], \quad P_B \mapsto R_B, \quad Q_B \mapsto S_B
$$

Biểu diễn bằng ma trận trên $(\mathbb{Z}/3^b\mathbb{Z})^2$:

> [!note] Định nghĩa 5.2 — Action Matrix
> **Action matrix** của $\phi_A$ trên $E_0[3^b]$ là ma trận $M_{\phi_A} \in \text{GL}_2(\mathbb{Z}/3^b\mathbb{Z})$ sao cho:
>
> $$
> \phi_A(P_B) = [m_{11}]\tilde{P}_B + [m_{12}]\tilde{Q}_B, \quad \phi_A(Q_B) = [m_{21}]\tilde{P}_B + [m_{22}]\tilde{Q}_B
> $$
>
> trong đó $\{\tilde{P}_B, \tilde{Q}_B\}$ là basis của $E_A[3^b]$. Ma trận $M_{\phi_A} = \begin{pmatrix} m_{11} & m_{21} \\ m_{12} & m_{22} \end{pmatrix}$.

Người nào biết $(P_B, Q_B, R_B, S_B)$ đều biết $M_{\phi_A}$ hoàn toàn — 4 integers modulo $3^b$.

---

## 4. Tại Sao Action Matrix Nguy Hiểm?

> [!abstract] Observation 5.3 — Torsion Images và Kernel Information
> Biết $M_{\phi_A}$ (tức là action của $\phi_A$ trên $E_0[3^b]$) **không trực tiếp** tiết lộ kernel $\ker \phi_A \subset E_0[2^a]$ — hai torsion groups hoàn toàn independent.
>
> Tuy nhiên, action matrix $M_{\phi_A}$ cùng với $E_A$ và degree $2^a$ **over-determines** isogeny $\phi_A$ trong một nghĩa cụ thể. Castryck-Decru dùng điều này để xây dựng một **oracle** có thể kiểm tra từng bit của $s_A$.

Tại sao "over-determines"? Một isogeny $\phi_A : E_0 \to E_A$ degree $2^a$ với torsion images đã biết có thể được **lifted** thành một isogeny trong dimension 2 (từ abelian surface sang abelian surface), và trong dimension đó, Kani's theorem cho phép **test xem một candidate kernel có đúng không** bằng cách kiểm tra một splitting condition.

---

## 5. Tóm Tắt Thông Tin Trong SIDH Public Key

> [!info] Bảng Tổng Kết
> | Thành phần | Chứa gì | Biết bao nhiêu về $\phi_A$? |
> |-----------|---------|--------------------------|
> | $E_A$ | Endpoint curve $E_0/\ker\phi_A$ | Biết curve đích, không biết path |
> | $\phi_A(P_B)$ | Image của $P_B$ qua $\phi_A$ | Action của $\phi_A$ trên $P_B$ |
> | $\phi_A(Q_B)$ | Image của $Q_B$ qua $\phi_A$ | Action của $\phi_A$ trên $Q_B$ |
>
> Ba thành phần này cùng nhau xác định $\phi_A$ **up to post-composition với endomorphism** của $E_A$ — một ràng buộc rất chặt. Castryck-Decru khai thác ràng buộc này.

---

## 6. Degree Biết Trước — Điều Kiện Cần Thiết Khác

Ngoài torsion images, Castryck-Decru còn cần:

**Degree $2^a$ là public**: Alice's secret isogeny luôn có degree chính xác $2^a$ — điều này là public (nằm trong spec). Điều này rất khác với, ví dụ, CSIDH, nơi degree của isogeny không được biết trước.

> [!tip] So Sánh Với DH Truyền Thống
> Trong Diffie-Hellman truyền thống, public key $g^a$ tiết lộ "chiều dài" walk $a$ thông qua $\log_g(g^a)$ (khó). Trong SIDH, **degree $2^a$ của walk luôn biết** và là số nguyên cụ thể — không phải thứ cần giữ bí mật. Chỉ có *hướng đi* (cụ thể là $s_A$) mới là secret.

---

## 7. Vì Sao Attack Không Apply Vào CSIDH?

> [!warning] Contrast Quan Trọng
> **CSIDH** (Castryck, Lange, Martindale, Panny, Renes 2018): key exchange trên ordinary curves, không có torsion point images trong public key.
>
> **SQISign**: signature scheme, không có auxiliary torsion points.
>
> Castryck-Decru attack yêu cầu cả hai:
> 1. Degree của secret isogeny được biết trước (public)
> 2. Images của torsion basis của phía kia được tiết lộ (public key structure)
>
> Cả hai điều kiện chỉ có trong SIDH/SIKE. Lesson 15 phân tích chi tiết tại sao các scheme khác an toàn.

---

## References

- SIKE specification — *SIKE: Supersingular Isogeny Key Encapsulation* (sike.org, 2022)
- Castryck, W. & Decru, T. — *An efficient key recovery attack on SIDH* (ePrint 2022/975)
- Costello, C. — *Supersingular Isogeny Key Exchange for Beginners* (ePrint 2019/1321)
- Petit, C. — *Faster algorithms for isogeny problems using torsion point images*, ASIACRYPT 2017
