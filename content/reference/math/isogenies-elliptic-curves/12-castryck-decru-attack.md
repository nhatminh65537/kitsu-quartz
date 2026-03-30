---
title: "12. Castryck-Decru Attack on SIDH"
type: attack
tags: [crypto, isogeny, attack, SIDH, Castryck-Decru, Kani, genus-2, lesson-12]
aliases: [Castryck-Decru Attack, SIDH Attack, SIKE Break]
created: 2026-03-24
---

> **Prerequisites**: [[11-sidh|11. SIDH]], [[02-dual-isogeny-torsion|02. Dual Isogeny & Torsion Subgroups]]
> **Lesson type**: Attack
>
> **Notation** (ký hiệu dùng mà không định nghĩa trong bài này):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $\phi_A: E_0 \to E_A$ | Secret isogeny của Alice, degree $2^{e_A}$ |
> | $P_B, Q_B$ | Public torsion basis của Bob trên $E_0$ |
> | $\phi_A(P_B), \phi_A(Q_B)$ | Images Alice công khai — **thông tin bị khai thác** |
> | $A \times E_0$ | Product abelian surface (dimension 2) |
> | $(2,2)$-isogeny | Isogeny giữa abelian surfaces với kernel $(\mathbb{Z}/2\mathbb{Z})^2$ |
> | $\text{Jac}(C)$ | Jacobian variety của genus-2 curve $C$ |
> | $N, a, b$ | Integers trong Kani's criterion: $N = 2^a \cdot 3^b$ |

---

## Tháng 7/2022 — Ngày SIDH Sụp đổ

Vào tháng 7/2022, Wouter Castryck và Thomas Decru công bố một bài báo 10 trang lên ePrint phá hoàn toàn SIDH/SIKE trong **thời gian đa thức**. Chỉ sau vài ngày, độc lập, Luciano Maino, Chloe Martindale, Lorenz Panny, Gestalt Pope, Benjamin Wesolowski cũng công bố một tấn công tương tự. Sau đó Damien Robert hoàn thiện thành tấn công đa thức không cần heuristic.

Kết quả: NIST loại SIKE khỏi danh sách PQC standardization. SIKEp434 (nhắm 128-bit security) bị phá trong khoảng **10 phút trên một core** bằng Magma. Đây là một trong những crypto breaks ấn tượng nhất của thập kỷ.

---

## 1. Bối cảnh: Thông tin Nào Bị Khai thác?

Trong SIDH, Alice công khai:
$$
\mathsf{pk}_A = (E_A,\; \phi_A(P_B),\; \phi_A(Q_B))
$$

trong đó $\phi_A: E_0 \to E_A$ là secret isogeny degree $2^{e_A}$, còn $P_B, Q_B$ là basis công khai của $E_0[3^{e_B}]$.

**Ý nghĩa của $(\phi_A(P_B), \phi_A(Q_B))$**: Đây là thông tin về cách $\phi_A$ tác động lên torsion structure của $E_0$ — cụ thể, ta biết $\phi_A$ restricted to $E_0[3^{e_B}]$. Đây là thông tin thừa so với plain isogeny problem, và chính xác là thông tin Castryck-Decru cần.

---

## 2. Kani's Lemma — Nền tảng Lý thuyết

Trái tim của tấn công là **Kani's reducibility criterion** (1997) — một định lý về isogenies từ product of elliptic curves.

> [!abstract] Định lý 12.1 — Kani's Reducibility Criterion
> Cho $E_0$ và $E_1$ là hai elliptic curves, và $\phi: E_0 \to E_1$ là isogeny degree $n$. Cho $N > n$ là số nguyên coprime với $n$ và $p$.
>
> Giả sử tồn tại isogeny $\gamma: E_0 \to E_0$ (endomorphism) thỏa $\deg\gamma = N - n$ và $\gamma + \hat\phi \circ \psi = 0$ trên $E_0[N]$ với $\psi: E_0 \to E_0$ nào đó.
>
> Khi đó **abelian surface** $A = E_0 \times E_1$ có thể "phân tích" (decompose) thành product của hai elliptic curves — tức tồn tại $(N, N)$-isogeny từ $E_0 \times E_1$ đến một product $E_2 \times E_3$.

Nói gọn: nếu biết $\phi$ tác động lên $E_0[N]$ (với $N$ smooth), ta có thể construct một $(N,N)$-isogeny trên abelian surface và tìm lại $\phi$.

---

## 3. Ý tưởng Tấn công — Phác thảo

Mục tiêu: Từ $(E_0, E_A, \phi_A(P_B), \phi_A(Q_B))$, phục hồi $\phi_A$.

**Bước 0 — Setup**: Ta biết $\phi_A$ tác động thế nào trên $E_0[3^{e_B}]$ (từ torsion images). Ta muốn dùng Kani để "nhúng" $\phi_A$ vào một $(2^a, 2^a)$-isogeny trên $E_0 \times E_0$.

**Bước 1 — Chọn auxiliary endomorphism**: Vì $E_0$ là SIKE's base curve, nó được chọn đặc biệt để có endomorphism $\gamma \in \text{End}(E_0)$ với $\deg\gamma$ nhỏ và $\deg\gamma + 2^{e_A} = N$ với $N$ smooth (thường $N = 2^{e_A + a}$).

Cụ thể với SIKE: $E_0$ có j-invariant $287496$ và có endomorphism $i$ với $i^2 = -1$ (CM bởi $\mathbb{Z}[i]$), nên $\deg(a + bi) = a^2 + b^2$. Ta tìm $(a, b)$ sao cho $a^2 + b^2 + 2^{e_A} = N$ smooth.

**Bước 2 — Construct $(N,N)$-isogeny**: Dùng Kani's lemma với $\phi = \phi_A$, $\gamma = a + bi$, và torsion images $\phi_A(P_B), \phi_A(Q_B)$ để build kernel của một $(N,N)$-isogeny $\Phi: E_0 \times E_0 \to ?$.

**Bước 3 — Test decomposition**: $\Phi$ maps $E_0 \times E_0$ đến một abelian surface $A'$. Nếu $A' \cong E_A \times E_2$ (product of elliptic curves), ta đã tìm được đúng $\phi_A$. Nếu không, guess về endomorphism sai — thử lại.

**Bước 4 — Recovery**: Từ decomposition của $A'$, extract isogeny $\phi_A: E_0 \to E_A$.

> [!info] Tại sao polynomial time?
>
> - Số "guesses" cần thử là $O(\log p)$ (tìm $(a,b)$ thỏa $a^2 + b^2 = N - 2^{e_A}$)
> - Mỗi bước tính $(N,N)$-isogeny: polynomial trong $\log N = O(\log p)$
> - Test decomposition: polynomial
> - Tổng: **polynomial** trong $\log p$ ✓

---

## 4. Phân tích Kỹ hơn: $(2,2)$-Isogenies và Richelot

Phần kỹ thuật nhất của tấn công là tính $(2,2)$-isogenies trên abelian surfaces.

> [!note] Định nghĩa 12.2 — $(2,2)$-isogeny trên Abelian Surface
> Cho $A = E_1 \times E_2$ là product của hai elliptic curves (abelian surface dimension 2). Một **$(2,2)$-isogeny** $\Phi: A \to A'$ là isogeny với kernel $\ker\Phi \cong (\mathbb{Z}/2\mathbb{Z})^2$ — nhóm bậc 4 với structure đặc biệt.
>
> **Richelot isogeny**: Trường hợp đặc biệt khi codomain $A'$ là Jacobian của một genus-2 curve $C$. Tên gọi này bắt nguồn từ công trình Richelot (1837).

Các $(2,2)$-isogenies được tính bằng **theta functions** và **Richelot's formulas** — hiệu quả trong $O(\log p)$ phép toán trên $\mathbb{F}_{p^2}$.

> [!info] Diagram Tổng quát của Tấn công
>
> ```
> E_0 × E_0  ──(2^a, 2^a)-isogeny──>  ?
>                                       ↓ decompose
>                                      E_A × E_2
> ```
>
> Mỗi bước $(2,2)$ tương ứng với một bước trong chuỗi $2$-isogenies của $\phi_A$. Bằng cách chạy song song trên product surface, ta "unzip" chuỗi isogenies mà không cần biết secret.

---

## 5. Formal Attack Algorithm

> [!danger] Algorithm 12.3 — Castryck-Decru Key Recovery (heuristic, polynomial time)
>
> **Input**: $(E_0, E_A, \phi_A(P_B), \phi_A(Q_B))$ — public key của Alice
>
> **Điều kiện**: Biết $\text{End}(E_0)$ (trong SIKE: $E_0$ cố định nên $\text{End}(E_0) = \mathbb{Z}[i]$ là công khai)
>
> **Output**: $\phi_A$ (hoặc một isogeny đẳng cấu)
>
> **Algorithm**:
>
> 1. Tìm $N = 2^{e_A + a}$ smooth và endomorphism $\gamma = c + di \in \text{End}(E_0)$ sao cho $c^2 + d^2 = N - 2^{e_A}$. (Tồn tại vì mọi số nguyên đủ lớn là tổng của hai bình phương.)
>
> 2. Từ $\phi_A(P_B)$ và $\phi_A(Q_B)$, tính kernel $K$ của $(N,N)$-isogeny $\Phi: E_0 \times E_0 \to A'$:
>    $$
>    K = \{([c]P + [d]i(P),\; -\phi_A(P)) \mid P \in E_0[N]\}
>    $$
>
> 3. Compute $\Phi$ qua chuỗi $a$ bước $(2,2)$-isogenies (Richelot).
>
> 4. Test nếu $A' \cong E_A \times E'$ cho curve $E'$ nào đó (decompose abelian surface).
>
> 5. Nếu test thành công: extract $\phi_A: E_0 \to E_A$ từ decomposition. Return $\phi_A$.
>
> 6. Nếu thất bại: thử endomorphism $\gamma$ khác (thường cần $O(\log p)$ lần thử).
>
> **Complexity**: $O((\log p)^3)$ — polynomial.

---

## 6. Tại sao CSIDH Không Bị Tấn công?

> [!warning] Giới hạn của Castryck-Decru Attack
>
> Tấn công **chỉ áp dụng** khi có torsion point images (SIDH, SIKE, và variants). Nó **không áp dụng** với:
>
> - **CSIDH**: Public key chỉ là một curve (không có torsion point images)
> - **SQISign**: Không dùng SIDH-style protocol
> - **Plain supersingular path-finding**: Không có extra torsion info
>
> **Kết luận**: Isogeny-based cryptography không chết — chỉ có SIDH-style schemes (những scheme leak torsion images) bị phá. CSIDH, SQISign và các scheme không leak torsion vẫn an toàn.

---

## 7. Aftermath và Bài học

### 7.1. Schemes Bị Phá

Ngoài SIDH/SIKE, tấn công còn áp dụng (hoặc generalize) cho: B-SIDH, G2-SIDH, SÉTA (đã bị phá trước đó), và mọi scheme leak torsion images của secret isogeny.

### 7.2. Schemes Vẫn An toàn

CSIDH, CSI-FiSh, SQISign, SQISignHD, FESTA (cải tiến để tránh bị phá), và các scheme mới không leak torsion point images.

### 7.3. Bài học Thiết kế

> [!tip] Nguyên tắc Bảo mật Sau Castryck-Decru
>
> **Đừng bao giờ** công khai images của torsion basis dưới secret isogeny.
>
> Nếu cần key exchange không tương tác, dùng CSIDH hoặc orientation-based approach (OSIDH, SCALLOP).
>
> Nếu cần signature nhỏ nhất, dùng SQISign (không có SIDH-style torsion leak).

### 7.4. Hướng Phát triển Mới

Sau khi SIDH bị phá, cộng đồng phát triển các hướng mới:
- **FESTA**: dùng SIDH-framework nhưng với endomorphism structure khác, không bị Castryck-Decru
- **SQIsignHD**: dùng $(2,2)$-isogenies như công cụ tính toán trong SQISign (ironically)
- **PRISM, POKE**: PKE/KEM từ higher-dimensional isogenies
- Chính $(2,2)$-isogenies — vũ khí phá SIDH — trở thành công cụ xây dựng scheme mới

---

## 8. Complexity và Mitigation

### Complexity của Tấn công

| Variant | Complexity | Điều kiện |
|---------|-----------|-----------|
| SIKE (original Castryck-Decru) | $O((\log p)^3)$ heuristic | Biết $\text{End}(E_0)$ |
| Maino et al. | Subexponential (không cần End(E_0)) | Arbitrary starting curve |
| Robert (2022) | $O((\log p)^5)$ non-heuristic | Biết End(E_0), GRH |

### Attempts tại Mitigation

Sau khi tấn công công bố, nhiều cố gắng "sửa" SIDH thất bại:
- Không truyền torsion images → mất khả năng tính shared secret
- Masking torsion images → tấn công vẫn adapted được
- **Kết luận**: Không có cách sửa SIDH giữ nguyên protocol structure

---

## 9. SageMath — Minh họa Simplified

```python
p = 2**5 * 3**3 - 1
assert is_prime(p), f"p = {p} not prime"
F = GF(p**2, 'i', modulus=x**2+1)
i_f = F.gen()

E0 = EllipticCurve(F, [1, 0])
assert E0.is_supersingular()

eA, eB = 5, 3
order_A = 2**eA
order_B = 3**eB

PA = (p**2 + 1) // order_A * E0.random_point()
QA = (p**2 + 1) // order_A * E0.random_point()
while PA.order() != order_A:
    PA = (p**2 + 1) // order_A * E0.random_point()
while QA.order() != order_B or E0.weil_pairing(PA, QA, order_A) == F(1):
    QA = (p**2 + 1) // order_A * E0.random_point()

PB = (p**2 + 1) // order_B * E0.random_point()
QB = (p**2 + 1) // order_B * E0.random_point()
while PB.order() != order_B:
    PB = (p**2 + 1) // order_B * E0.random_point()

kA = randint(0, order_A - 1)
SA = PA + kA * QA
phiA = E0.isogeny(SA)
EA = phiA.codomain()
phiA_PB = phiA(PB)
phiA_QB = phiA(QB)

print(f"Alice's secret: kA = {kA}")
print(f"Alice's public: EA.j() = {EA.j_invariant()}")
print(f"Torsion images: phi(PB) = {phiA_PB}, phi(QB) = {phiA_QB}")

recovered = None
for kA_guess in range(order_A):
    SA_guess = PA + kA_guess * QA
    try:
        phi_guess = E0.isogeny(SA_guess)
        if phi_guess.codomain().j_invariant() == EA.j_invariant():
            recovered = kA_guess
            break
    except:
        continue

print(f"Recovered: kA = {recovered}, Match: {recovered == kA}")
```

> [!tip] Ý nghĩa Đoạn Code
>
> Đây là brute-force attack (small parameters). Castryck-Decru là polynomial-time attack thực sự sử dụng $(2,2)$-isogenies trên abelian surfaces — phức tạp hơn nhiều. Nhưng mục tiêu cuối cùng giống nhau: khôi phục $k_A$ mà không cần thử tất cả.

---

## Tóm tắt

- **Nguyên nhân gốc rễ**: SIDH công khai $\phi_A(P_B), \phi_A(Q_B)$ — torsion images tiết lộ quá nhiều thông tin về secret isogeny.
- **Kani's lemma**: isogeny trên $E_0$ có thể nhúng vào $(N,N)$-isogeny trên abelian surface $E_0 \times E_0$, nếu biết action trên $E_0[N]$.
- **Attack**: Dùng torsion images để build kernel của $(2^a, 2^a)$-isogeny trên $E_0 \times E_0$, chạy Richelot isogenies, decompose codomain, extract $\phi_A$.
- **Complexity**: $O((\log p)^3)$ heuristic (non-heuristic $O((\log p)^5)$ bởi Robert).
- **Hệ quả**: SIKE bị loại khỏi NIST PQC; SIDH chết hoàn toàn.
- **Bài học**: Không leak torsion images. CSIDH, SQISign vẫn an toàn.
- **Irony**: Công cụ phá SIDH — $(2,2)$-isogenies — trở thành building block của SQISignHD và FESTA.

---

## References

- Castryck, W., Decru, T. — *An Efficient Key Recovery Attack on SIDH*, EUROCRYPT 2023, eprint.iacr.org/2022/975
- Maino, L., Martindale, C., Panny, L., Pope, G., Wesolowski, B. — *A Direct Key Recovery Attack on SIDH*, EUROCRYPT 2023
- Robert, D. — *Breaking SIDH in Polynomial Time*, EUROCRYPT 2023, eprint.iacr.org/2022/1038
- Kani, E. — *The Number of Curves of Genus Two with Elliptic Differentials*, J. reine angew. Math., 1997
- Oudompheng, R., Pope, G. — *A Note on Reimplementing the Castryck-Decru Attack and Lessons Learned for SageMath*, ePrint 2022/1283
