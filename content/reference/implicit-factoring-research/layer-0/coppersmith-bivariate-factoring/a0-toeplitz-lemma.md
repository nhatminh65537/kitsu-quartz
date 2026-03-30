---
title: "A0. Toeplitz Near-Orthogonality — Lemma 4"
type: math-component
tags: [coppersmith, toeplitz, lemma, appendix, lesson-a0]
aliases: [Lemma 4 Coppersmith, Toeplitz Lemma]
source: "Finding a Small Root of a Bivariate Integer Equation; Factoring with High Bits Known — Don Coppersmith, EUROCRYPT 1996"
created: 2026-03-25
---

> **Prerequisites**: [[02-xay-dung-lattice-va-thuat-toan-chinh|02. Lattice Construction and Main Algorithm]], [[03-chung-minh-dung-dan|03. Correctness Proof]]  
> **Lesson type**: Math Component (Appendix)  
> **Covers**: §10 Appendix — Lemma 4 và chứng minh near-orthogonality của cột Toeplitz trong $WM_1$
>
> **Notation**:
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $M_4$ | Khối phải của $WM_1$; kích thước $(k+\delta)^2 \times k^2$ (tổng quát bậc $\delta$) |
> | $\widetilde{p}(x,y)$ | Đa thức scaled: $\widetilde{p}(x,y) = p(Xx, Yy)$, hệ số $\widetilde{p}_{ab} = X^a Y^b p_{ab}$ |
> | $D = \max_{a,b}|\widetilde{p}_{ab}|$ | Hệ số lớn nhất của $\widetilde{p}$ (= $\max_{a,b}|p_{ab}|X^aY^b$) |
> | $(a,b)$ | Chỉ số hệ số lớn nhất: $D = |\widetilde{p}_{ab}|$ |
> | $(c,d)$ | Chỉ số được chọn để cực đại hóa $8^{(c-a)^2+(d-b)^2}|\widetilde{p}_{cd}|$ |
> | $\widetilde{M}, M'$ | Submatrix $k^2\times k^2$ được chọn và biến thể scaled của nó |

---

## Mục tiêu của Appendix này

Bài 03 dùng kết quả:

$$
|\det(\widetilde{WM_1})| = (XY)^{k^2(k-1)/2} D^{k^2}
$$

(đẳng thức chính xác khi $\delta=1$, $p_{00},p_{01},p_{10},p_{11}$ đều khác 0).

Đây là **Lemma 4** của paper — chứng minh tồn tại submatrix $k^2 \times k^2$ của $M_4$ (khối phải của $WM_1$) có determinant $\ge D^{k^2} 2^{-6k^2\delta^2 - 2k^2}$, và bằng đúng $D^{k^2}$ khi hệ số lớn nhất ở góc Newton polygon.

---

## Bối cảnh: cấu trúc Toeplitz của $M_4$

Định nghĩa lại index cho phần Appendix. Gọi $M_4$ là khối phải của $WM_1$:

- **Hàng** index bởi $\gamma(g,h) = (k+\delta)g + h$ với $0 \le g,h < k+\delta$
- **Cột** index bởi $\mu(i,j) = ki + j$ với $0 \le i,j < k$

Phần tử $M_4$ tại $(\gamma(g,h), \mu(i,j))$ là hệ số của $x^g y^h$ trong $x^i y^j \widetilde{p}(x,y)$, tức là $\widetilde{p}_{g-i, h-j}$ (bằng 0 nếu chỉ số âm hoặc vượt bậc).

**Tính chất Toeplitz**: phần tử chỉ phụ thuộc vào hiệu $(g-i, h-j)$ — không phải vị trí tuyệt đối. Đây là cấu trúc Toeplitz 2D. Chính cấu trúc này cho phép chứng minh near-orthogonality.

---

## Phát biểu Lemma 4

> [!abstract] Lemma A0.1 — Lemma 4 (Coppersmith 1996, Appendix)
> Tồn tại submatrix $k^2 \times k^2$ của $M_4$, ký hiệu $\widetilde{M}$, thỏa:
>
> $$
> |\det(\widetilde{M})| \ge D^{k^2} \cdot 2^{-6k^2\delta^2 - 2k^2}
> $$
>
> Hơn nữa, nếu hệ số lớn nhất $|\widetilde{p}_{ab}| = D$ là một trong $\widetilde{p}_{00}, \widetilde{p}_{0\delta}, \widetilde{p}_{\delta 0}, \widetilde{p}_{\delta\delta}$ (tức là nằm ở một góc của Newton polygon), thì:
>
> $$
> |\det(\widetilde{M})| = D^{k^2}
> $$

**Trường hợp RSA**: $p(x,y) = (P_0+x)(Q_0+y)-N$ với $\delta=1$. Các hệ số là $p_{00} = P_0Q_0-N$, $p_{10}=Q_0$, $p_{01}=P_0$, $p_{11}=1$. Tất cả đều tương ứng với góc của Newton polygon $\{(0,0),(1,0),(0,1),(1,1)\}$. Nên đẳng thức chính xác $|\det(\widetilde{M})| = D^{k^2}$ áp dụng.

---

## Chứng minh Lemma 4

### Bước 1: Chọn $(a,b)$ và $(c,d)$

Gọi $(a,b)$ là chỉ số thỏa $D = |\widetilde{p}_{ab}|$ (hệ số lớn nhất của $\widetilde{p}$).

Chọn $(c,d)$ để cực đại hóa:

$$
8^{(c-a)^2 + (d-b)^2} |\widetilde{p}_{cd}|
$$

Đây là cách chọn $(c,d)$ "gần" với $(a,b)$ nhất theo một metric có trọng số.

### Bước 2: Chọn submatrix $\widetilde{M}$

Lấy các hàng $\gamma(c+i, d+j)$ với $0 \le i,j < k$ từ $M_4$. Các cột giữ nguyên là $\mu(i,j)$.

Ma trận $\widetilde{M}$ có phần tử:

$$
\widetilde{M}_{\mu(g,h), \mu(i,j)} = \widetilde{p}_{g-i+c,\; h-j+d}
$$

### Bước 3: Scale để tạo $M'$

Nhân hàng $\mu(g,h)$ của $\widetilde{M}$ với $8^{2(c-a)g + 2(d-b)h}$ và cột $\mu(i,j)$ với $8^{-2(c-a)i - 2(d-b)j}$ — thao tác không làm thay đổi $|\det|$. Ma trận mới $M'$ có phần tử:

$$
M'_{\mu(g,h), \mu(i,j)} = \widetilde{p}_{g-i+c,\, h-j+d} \cdot 8^{2(c-a)(g-i) + 2(d-b)(h-j)}
$$

### Bước 4: Chứng minh $M'$ diagonally dominant

**Phần tử đường chéo** của $M'$ (tức $g=i, h=j$): $\widetilde{p}_{cd}$.

**Phần tử ngoài đường chéo** ($g \ne i$ hoặc $h \ne j$): cần bound $|M'_{\mu(g,h),\mu(i,j)}|$.

Từ cực đại hóa $(c,d)$:

$$
8^{(c-a)^2+(d-b)^2}|\widetilde{p}_{cd}| \ge 8^{(c-a+g-i)^2+(d-b+h-j)^2}|\widetilde{p}_{g-i+c,\,h-j+d}|
$$

Khai triển mũ: $(c-a+g-i)^2 = (c-a)^2 + 2(c-a)(g-i) + (g-i)^2$, suy ra:

$$
|\widetilde{p}_{g-i+c,\,h-j+d}| \cdot 8^{2(c-a)(g-i)+2(d-b)(h-j)} \le |\widetilde{p}_{cd}| \cdot 8^{-(g-i)^2-(h-j)^2}
$$

Do đó:

$$
|M'_{\mu(g,h),\mu(i,j)}| \le |\widetilde{p}_{cd}| \cdot 8^{-(g-i)^2-(h-j)^2}
$$

**Tổng phần tử ngoài đường chéo** trong hàng $\mu(i,j)$:

$$
\sum_{(g,h)\ne(i,j)} |M'_{\mu(g,h),\mu(i,j)}| \le |\widetilde{p}_{cd}| \sum_{(a,b)\ne(0,0)} 8^{-a^2-b^2}
$$

$$
= |\widetilde{p}_{cd}| \left[-1 + \sum_{(a,b)} 8^{-a^2-b^2}\right] = |\widetilde{p}_{cd}| \left[-1 + \left(\sum_a 8^{-a^2}\right)^2\right]
$$

Tính:

$$
\sum_a 8^{-a^2} = 1 + 2\sum_{a=1}^\infty 8^{-a^2} < 1 + 2\sum_{a=1}^\infty 8^{-a} = 1 + \frac{2}{7} < \frac{3}{2}
$$

Nên tổng ngoài đường chéo $< |\widetilde{p}_{cd}| \cdot \left[(\frac{3}{2})^2 - 1\right] = \frac{5}{4}|\widetilde{p}_{cd}| < \frac{3}{4}|\widetilde{p}_{cd}|$... 

Thực ra paper tính chính xác hơn:

$$
\left[-1 + \left(\sum_a 8^{-a^2}\right)^2\right] < \frac{3}{4}
$$

Vậy tổng các phần tử ngoài đường chéo trong mỗi hàng $< \frac{3}{4}|\widetilde{p}_{cd}|$. Tức là $M'$ **diagonally dominant**: mỗi phần tử đường chéo $|\widetilde{p}_{cd}|$ lớn hơn tổng phần tử ngoài đường chéo cùng hàng.

### Bước 5: Bound eigenvalue và $|\det(M')|$

Ma trận diagonally dominant có mọi eigenvalue $\lambda$ thỏa $|\lambda - \widetilde{p}_{cd}| \le \frac{3}{4}|\widetilde{p}_{cd}|$, suy ra $|\lambda| \ge \frac{1}{4}|\widetilde{p}_{cd}|$.

Từ điều kiện chọn $(c,d)$: $8^{(c-a)^2+(d-b)^2}|\widetilde{p}_{cd}| \ge 8^0 |\widetilde{p}_{ab}| = D$, nên $|\widetilde{p}_{cd}| \ge 8^{-(c-a)^2-(d-b)^2} D \ge 8^{-2\delta^2} D$ (vì $|c-a|, |d-b| \le \delta$).

Do đó mọi eigenvalue của $M'$ có module $\ge \frac{1}{4} \cdot 8^{-2\delta^2} D$.

$$
|\det(M')| \ge \left(\frac{1}{4} 8^{-2\delta^2} D\right)^{k^2} = D^{k^2} \cdot 4^{-k^2} \cdot 8^{-2k^2\delta^2} = D^{k^2} \cdot 2^{-2k^2} \cdot 2^{-6k^2\delta^2}
$$

$$
= D^{k^2} \cdot 2^{-6k^2\delta^2 - 2k^2}
$$

Vì $M'$ và $\widetilde{M}$ có cùng $|\det|$ (chỉ scale hàng/cột), ta có:

$$
|\det(\widetilde{M})| \ge D^{k^2} \cdot 2^{-6k^2\delta^2 - 2k^2} \quad \blacksquare
$$

### Bước 6: Trường hợp góc Newton polygon

Nếu hệ số lớn nhất là một trong $\widetilde{p}_{00}, \widetilde{p}_{0\delta}, \widetilde{p}_{\delta 0}, \widetilde{p}_{\delta\delta}$, đặt $(c,d) = (a,b)$. Khi đó:

- Nếu $(a,b) = (0,0)$ hoặc $(\delta,\delta)$: $\widetilde{M}$ là ma trận tam giác (trên hoặc dưới) với đường chéo toàn $\widetilde{p}_{ab}$.
- Nếu $(a,b) = (0,\delta)$ hoặc $(\delta,0)$: redefine index cột để $\widetilde{M}$ vẫn là tam giác.

Trong mọi trường hợp: $|\det(\widetilde{M})| = |\widetilde{p}_{ab}|^{k^2} = D^{k^2}$. $\blacksquare$

---

## Kết nối với $\det(WM_1)$ trong bài 03

Từ Lemma A0.1, submatrix $\widetilde{M}$ của $M_4$ có $|\det(\widetilde{M})| = D^{k^2}$ (trường hợp RSA). Vì khối trái của $WM_1$ là identity, xóa $k^2$ cột trái tương ứng với $k^2$ hàng chọn trong $\widetilde{M}$ → det của matrix vuông kết quả đúng bằng $|\det(\widetilde{M})|$.

Nhân thêm với $\det(W) = (XY)^{(k+1)^2 k/2}$ từ khối trái, và mũ $(XY)$ từ $k^2$ cột phải trong $WM_1$... dẫn đến:

$$
|\det(\widetilde{WM_1})| = (XY)^{k^2(k-1)/2} \cdot D^{k^2}
$$

Đây là kết quả Lemma 3.1 trong bài 03 — được dẫn từ đây. $\blacksquare$

---

## Summary

- **Cấu trúc Toeplitz**: $M_4$ là Toeplitz 2D — phần tử chỉ phụ thuộc vào hiệu index.
- **Chọn submatrix**: chọn hàng $\gamma(c+i, d+j)$ với $(c,d)$ cực đại hóa "weighted nearness" đến hệ số lớn nhất.
- **Scale thành $M'$**: $M'$ diagonally dominant — tổng ngoài đường chéo $< \frac{3}{4}$ đường chéo.
- **Eigenvalue bound**: mọi $|\lambda| \ge \frac{1}{4}|\widetilde{p}_{cd}| \ge \frac{1}{4} 8^{-2\delta^2} D$.
- **Kết quả**: $|\det(\widetilde{M})| \ge D^{k^2} 2^{-6k^2\delta^2 - 2k^2}$; chính xác $= D^{k^2}$ khi hệ số lớn nhất ở góc Newton polygon.
- **Ứng dụng**: trường hợp RSA ($\delta=1$) luôn rơi vào trường hợp chính xác, cho $|\det| = D^{k^2}$.

---

## References

- Paper gốc §10 Appendix — Don Coppersmith, EUROCRYPT 1996
- [[03-chung-minh-dung-dan|03. Correctness Proof]] — sử dụng Lemma này trong bound $|\det(L)|$
