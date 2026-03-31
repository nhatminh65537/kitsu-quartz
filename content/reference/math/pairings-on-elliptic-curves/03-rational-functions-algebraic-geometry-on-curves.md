---
title: 03. Rational Functions & Algebraic Geometry on Curves
tags: [math, pairing, elliptic-curves, lesson-03]
aliases: [Rational Functions và Algebraic Geometry trên Curves]
created: 2026-03-09
---
# 3. Rational Functions và Algebraic Geometry trên Curves

> **Prerequisites**: [[01-ecc-finite-field-review|ECC & Finite Field Review]], [[02-extension-fields-tower-extensions|Extension Fields & Tower Extensions]]  
> **Objectives**:  
> 
> - Hiểu function field $\bar{k}(E)$, zeros/poles của rational functions trên đường cong elliptic
> - Nắm vững khái niệm order of vanishing $\text{ord}_P(f)$ và divisor $\text{div}(f)$
> - Hiểu Riemann–Roch đủ để thấy tại sao $[P]-[\mathcal{O}]$ không bao giờ là principal divisor — nền tảng của Abel–Jacobi isomorphism và tính well-defined của Weil pairing

---

## Motivation / Intuition

Lesson này là **bước nhảy quan trọng nhất** trong cả lộ trình. Hầu hết tài liệu về ECC trong cryptography bỏ qua hoàn toàn phần này — và đó là lý do nhiều người "hiểu" pairing ở mức công thức nhưng không thực sự hiểu _tại sao_ nó hoạt động.

Vấn đề cốt lõi là: **Weil pairing được định nghĩa thông qua rational functions**, không phải thông qua tọa độ điểm. Cụ thể, với $P \in E[n]$, ta cần tìm một rational function $f_P$ trên $E$ sao cho:

$$ \text{div}(f_P) = n[P] - n[\mathcal{O}] $$

Để hiểu định nghĩa này — và tại sao nó well-defined — ta cần ngôn ngữ của **divisors** và **rational functions trên curves**. Đây chính là nội dung của Lesson 03.

**Trực giác cốt lõi**:

- Một rational function $f$ trên $E$ "trông như" một hàm số bình thường, nhưng có thể có zero hoặc pole tại các điểm trên $E$.
- $\text{div}(f)$ là "bản đồ" ghi nhận vị trí và bậc của tất cả zeros và poles.
- Trên đường cong elliptic (genus 1), một số divisor "tốt" (như $[P] - [\mathcal{O}]$) **không thể** là $\text{div}(f)$ của bất kỳ $f$ nào — đây là sự thật kỳ diệu khiến nhóm $E(k)$ có cấu trúc phong phú.

---

## Function Field của một Curve

### Definition

> [!definition] Definition 3.1 — Function Field (Trường Hàm)
> Cho $E/k$ là đường cong elliptic. **Function field** (trường hàm) của $E$, ký hiệu $\bar{k}(E)$, là trường các **rational functions** (hàm hữu tỉ) trên $E$.
> 
> Cụ thể, với $E: y^2 = x^3 + ax + b$ trong affine coordinates, mỗi phần tử $f \in \bar{k}(E)$ có dạng:
> 
> $$ f = \frac{g(x, y)}{h(x, y)} $$
> 
> trong đó $g, h$ là đa thức (với $h \not\equiv 0$ trên $E$), được rút gọn modulo phương trình của $E$ (tức $y^2 = x^3+ax+b$).
> 
> Như vậy mọi $f \in \bar{k}(E)$ viết được dưới dạng $f = r(x) + s(x)y$ với $r, s \in \bar{k}(x)$.

> [!note] Remark 3.2 — Tại sao làm việc trên $\bar{k}$ chứ không phải $k$?
> Zeros và poles của rational functions thường không nằm trong $k$ mà nằm trong extension fields. Để đặt lý thuyết một cách đúng đắn — đặc biệt khi định nghĩa $\text{div}(f)$ — ta luôn làm việc trên $\bar{k}$ (algebraic closure).
> 
> Tuy nhiên: nếu $f$ có hệ số trong $k$ (tức $f \in k(E)$) thì các zeros và poles được permuted bởi $\text{Gal}(\bar{k}/k)$ — tính chất Galois-equivariance sẽ dùng lại ở Lesson 06.

---

## Order of Vanishing và Zeros/Poles

### Definition

> [!definition] Definition 3.3 — Uniformizer và Order of Vanishing
> Cho $P \in E(\bar{k})$. Một **uniformizer** (tham số địa phương) tại $P$ là một rational function $t_P \in \bar{k}(E)$ có zero đơn giản tại $P$, tức là:
> 
> $$ \text{ord}_P(t_P) = 1 $$
> 
> Mọi $f \in \bar{k}(E)^*$ đều viết được duy nhất dạng $f = t_P^m \cdot u$ gần $P$, với $u$ không có zero hay pole tại $P$. Số nguyên $m$ được gọi là **order of vanishing** (bậc triệt tiêu) của $f$ tại $P$:
> 
> $$
> \operatorname{ord}_P(f)=
> \begin{cases}
> m>0 & \text{: } f \text{ có zero bậc } m \text{ tại } P,\\
> 0 & \text{: } f \text{ regular (không zero, không pole) tại } P,\\
> m<0 & \text{: } f \text{ có pole bậc } |m| \text{ tại } P.
> \end{cases}
> $$

> [!example] Example 3.4 — Uniformizer trên $E$
> Trên $E: y^2 = x^3 + ax + b$:
> 
> - Tại điểm $P = (x_0, y_0)$ với $y_0 \neq 0$: uniformizer tự nhiên là $t_P = x - x_0$ (zero đơn giản tại $P$, vì $y^2 - y_0^2 = (y-y_0)(y+y_0)$ và $(x-x_0)$ chia hết qua implicit differentiation).
>     
> - Tại điểm $P = (x_0, 0)$ (điểm 2-torsion, $2P = \mathcal{O}$): uniformizer là $t_P = y$ (vì $x - x_0 = (y/(\ldots))^2$ có zero kép tại $P$, còn $y$ có zero đơn giản).
>     
> - Tại $\mathcal{O}$ (điểm vô cực): trong projective coordinates $(X:Y:Z)$, $\mathcal{O} = (0:1:0)$. Uniformizer là $t = X/Y$ hay $t = x/y$ sau dehomogenize.
>     

> [!note] Remark 3.5 — Cấu trúc địa phương tại $P$
> Formal power series ring tại $P$ là $\bar{k}[[t_P]]$, và function field $\bar{k}(E)$ nhúng vào $\bar{k}((t_P))$ (Laurent series). Mỗi $f$ có expansion $f = \sum_{n=n_0}^{\infty} a_n t_P^n$ với $n_0 = \text{ord}_P(f)$.
> 
> Điều này hoàn toàn tương tự như hàm meromorphic trong phân tích phức, nhưng ở đây là đại số thuần túy.

---

## Divisor của một Rational Function

### Definition

> [!definition] Definition 3.6 — Divisor của $f$ (Principal Divisor)
> Với $f \in \bar{k}(E)^*$, **divisor** của $f$ là:
> 
> $$ \text{div}(f) = \sum_{P \in E(\bar{k})} \text{ord}_P(f) \cdot [P] $$
> 
> Đây là tổng hữu hạn (chỉ hữu hạn điểm có $\text{ord}_P(f) \neq 0$). Những divisor có dạng $\text{div}(f)$ được gọi là **principal divisors**.

> [!theorem] Theorem 3.7 — Số Zeros = Số Poles (Tính Degree Zero)
> Với mọi $f \in \bar{k}(E)^*$:
> 
> $$ \deg(\text{div}(f)) = \sum_{P} \text{ord}_P(f) = 0 $$
> 
> Tức là: _số zeros bằng số poles khi tính theo bội số_.

**Ý nghĩa hình học**: $f: E \to \mathbb{P}^1$ là một morphism giữa curves. Số preimage của $0 \in \mathbb{P}^1$ phải bằng số preimage của $\infty \in \mathbb{P}^1$ — đây là định lý về degree của morphism.

> [!example] Example 3.8 — Divisor của đường thẳng (Line) trên $E$
> Tiếp tục với $E: y^2 = x^3 + x + 6$ trên $\mathbb{F}_{11}$.
> 
> **Trường hợp 1**: Đường thẳng $L: y = 2x + 3$ đi qua $P=(2,7)$, $Q=(5,2)$, và $R=(8,8)$.
> 
> Viết $L$ như rational function: $\ell(x,y) = y - 2x - 3$.
> 
> Thay vào $E$: $(2x+3)^2 = x^3+x+6$, tức $x^3 - 4x^2 - 11x - 3 \equiv 0 \pmod{11}$. Nghiệm: $x = 2, 5, 8$ (vì $2+5+8 = 15 \equiv 4 \pmod{11}$ khớp hệ số $x^2$). ✓
> 
> Đường thẳng trong projective: $\ell = Y/Z - 2X/Z - 3 = (Y - 2X - 3Z)/Z$ — có pole bậc 1 tại mỗi điểm $Z=0$, mà $\mathbb{P}^2$ trên đường cong chỉ có $\mathcal{O} = (0:1:0)$. Nhưng $\ell$ có bậc 1 nên có cực bậc 3 tổng cộng tại $\mathcal{O}$.
> 
> $$ \text{div}(\ell) = [P] + [Q] + [R] - 3[\mathcal{O}] $$
> 
> **Kiểm tra**: $\deg = 1+1+1-3 = 0$. ✓
> 
> **Trường hợp 2**: Đường thẳng đứng $x - 2 = 0$ qua $P=(2,7)$ và $-P=(2,4)$.
> 
> $$ \text{div}(x - 2) = [(2,7)] + [(2,4)] - 2[\mathcal{O}] $$
> 
> **Kiểm tra**: $\deg = 1+1-2 = 0$. ✓ Hai zeros vì $x=2$ cho hai giá trị $y = \pm 7$.

> [!note] Remark 3.9 — Công thức Chung cho Divisors trên $E$
> Mọi rational function trên $E$ đều viết được (ít nhất về mặt lý thuyết) dưới dạng tích thương của "line functions" (đường thẳng và đường thẳng đứng). Đây là cơ sở của **Miller's algorithm** (Lesson 07): thay vì tính $f_{n,P}$ trực tiếp, Miller xây dựng nó bằng cách nhân lần lượt các line functions theo phép cộng double-and-add.

---

## Weil Reciprocity

> [!theorem] Theorem 3.10 — Weil Reciprocity
> Cho $C/k$ là smooth projective curve, $f, g \in k(C)^*$ với $\text{div}(f)$ và $\text{div}(g)$ có **disjoint support** (không có điểm nào chung trong zeros/poles của cả hai). Khi đó:
> 
> $$ f(\text{div}(g)) = g(\text{div}(f)) $$
> 
> trong đó nếu $D = \sum n_P [P]$ thì $f(D) := \prod_P f(P)^{n_P}$.

**Ý nghĩa**: Đây là "tương hỗ" đại số giữa hai hàm. Weil Reciprocity là chìa khóa kỹ thuật để chứng minh tính **bilinear** và **alternating** của Weil pairing (Lesson 06).

> [!example] Example 3.11 — Weil Reciprocity cụ thể
> Lấy $f = x - x_P$ (zeros tại $P, -P$) và $g = y - y_Q$ (line function). Weil Reciprocity nói rằng:
> 
> $$ \frac{f(Q)}{f(-Q)} = \frac{g(P) \cdot g(-P) \cdot \ldots}{g(\mathcal{O})^{\ldots}} $$
> 
> (tương hỗ hai chiều). Đây là công cụ dùng để chứng minh $e_n(P,Q) = e_n(Q,P)^{-1}$ trong Lesson 06.

---

## Principal Divisors và Equivalence

### Definition

> [!definition] Definition 3.12 — Principal Divisor và Linear Equivalence
> Nhóm tất cả divisors là nhóm Abel tự do sinh bởi các điểm của $E$, ký hiệu $\text{Div}(E)$.
> 
> Tập các **principal divisors** $\text{Princ}(E) = \{\text{div}(f) \mid f \in \bar{k}(E)^*\}$ là subgroup của $\text{Div}(E)$.
> 
> Hai divisors $D_1, D_2$ được gọi là **linearly equivalent** (tương đương tuyến tính), ký hiệu $D_1 \sim D_2$, nếu $D_1 - D_2 \in \text{Princ}(E)$.

> [!note] Remark 3.13
> Rational functions với prescribed divisor là duy nhất đến hằng số Nếu $\text{div}(f) = \text{div}(g)$, thì $\text{div}(f/g) = 0$, tức $f/g$ không có zeros hay poles → $f/g$ là hằng số (trên projective curve compact). Vậy:
> 
> _Rational function với prescribed divisor là duy nhất đến nhân với một hằng số trong $\bar{k}$._
> 
> Điều này cho phép **normalize** functions, như trong định nghĩa Weil pairing (Lesson 06).

---

## Picard Group và Abel–Jacobi Map

### Definition

> [!definition] Definition 3.14 — Picard Group (Nhóm Picard)
> **Picard group** (hay **divisor class group**) của $E$ là:
> 
> $$ \text{Pic}(E) = \text{Div}(E) / \text{Princ}(E) $$
> 
> **Degree-zero part**:
> 
> $$ \text{Pic}^0(E) = \text{Div}^0(E) / \text{Princ}(E) $$
> 
> trong đó $\text{Div}^0(E) = \{D \in \text{Div}(E) \mid \deg D = 0\}$.

> [!theorem] Theorem 3.15 — Abel–Jacobi Isomorphism (cho Elliptic Curves)
> Ánh xạ Abel–Jacobi:
> 
> $$ \kappa: E(\bar{k}) \xrightarrow{;\sim;} \text{Pic}^0(E), \quad P \mapsto [P] - [\mathcal{O}] $$
> 
> là một **group isomorphism**.

**Proof sketch.** _Surjectivity_: Cho $D \in \text{Div}^0(E)$, cần tìm $P$ sao cho $D \sim [P] - [\mathcal{O}]$. Viết $D = D^+ - D^-$ với $D^+, D^-$ là effective. Bằng cách cộng divisors của các line functions (theo cách điều chỉnh zeros và poles từng bước), ta giảm dần về dạng $[Q] - [\mathcal{O}]$ cho một điểm $Q$. (Đây là cách proof trong Milne, và cũng chính là thuật toán tính group law!)

_Injectivity_ (cốt lõi): Nếu $[P] - [\mathcal{O}] \sim [Q] - [\mathcal{O}]$, thì $[P] - [Q]$ là principal, tức $\exists f: \text{div}(f) = [P] - [Q]$. Nhưng theo Riemann–Roch, điều này buộc $P = Q$. (Xem Theorem 3.16.)

_Homomorphism_: $\kappa(P+Q) = [P+Q] - [\mathcal{O}]$, và từ định nghĩa group law bằng chord-and-tangent ta có $[P] + [Q] - [P+Q] - [\mathcal{O}] = \text{div}(L_{P,Q}/V_{P+Q})$, trong đó $L_{P,Q}$ là đường qua $P,Q$ và $V_{P+Q}$ là đường thẳng đứng qua $P+Q$. Vậy $\kappa(P+Q) \sim \kappa(P) + \kappa(Q)$. $\blacksquare$

> [!theorem] Theorem 3.16 — Riemann–Roch cho Elliptic Curves
> Cho $E/k$ là đường cong elliptic (genus $g = 1$) và $D \in \text{Div}(E)$. Gọi $\ell(D) = \dim_k L(D)$ trong đó $L(D) = \{f \in \bar{k}(E)^* \mid \text{div}(f) + D \geq 0\} \cup {0}$.
> 
> Định lý Riemann–Roch phát biểu:
> 
> $$ \ell(D) - \ell(K_E - D) = \deg(D) - g + 1 = \deg(D) $$
> 
> trong đó $K_E$ là canonical divisor (degree $2g-2 = 0$ với $g=1$).
> 
> **Hệ quả quan trọng**: Với $\deg(D) > 0$:
> 
> $$ \ell(D) = \deg(D) $$
> 
> Với $\deg(D) \leq 0$: $\ell(D) = 0$ nếu $D \not\sim 0$, và $\ell(D) = 1$ nếu $D \sim 0$.

> [!warning] Counterexample 3.17 — Không có rational function với đúng một zero đơn giản
> Lấy $D = [P]$ (divisor degree 1). Riemann–Roch cho $\ell([P]) = 1$, nghĩa là $L([P])$ chỉ chứa các hằng số.
> 
> Kết luận: **Không tồn tại** rational function $f \in \bar{k}(E)^*$ với $\text{div}(f) = [P] - [\mathcal{O}]$ (tức zero đơn giản tại $P$, pole đơn giản tại $\mathcal{O}$, không có điểm kỳ dị nào khác).
> 
> Đây là sự khác biệt cơ bản giữa $E$ (genus 1) và $\mathbb{P}^1$ (genus 0). Trên $\mathbb{P}^1$: hàm $\frac{x - a}{x - b}$ có đúng một zero tại $a$ và một pole tại $b$. Trên $E$ điều này là _impossible_.
> 
> **Đây chính xác là lý do Weil pairing well-defined**: nếu $[P] - [\mathcal{O}]$ là principal thì $E$ sẽ không phải là nhóm (Abel–Jacobi sẽ không injective).

---

## Divisor Đặc trưng cho Group Law

> [!theorem] Theorem 3.18 — Group Law qua Divisors
> Với $P, Q \in E(\bar{k})$ và $R = P + Q$ (phép cộng nhóm), ta có:
> 
> $$ [P] + [Q] - [R] - [\mathcal{O}] \in \text{Princ}(E) $$
> 
> Cụ thể, nếu $L_{P,Q}$ là line function đi qua $P$ và $Q$ (với third intersection $-R$), và $V_R$ là vertical line qua $R$:
> 
> $$ \text{div}!\left(\frac{L_{P,Q}}{V_R}\right) = [P] + [Q] + [-R] - 3[\mathcal{O}] - ([-R] + [R] - 2[\mathcal{O}]) = [P] + [Q] - [R] - [\mathcal{O}] $$

**Ý nghĩa**: Group law trên $E$ có thể định nghĩa _hoàn toàn qua divisors_ — đây là cách Milne và Silverman trình bày, và cũng là cách tính chất associativity được chứng minh (thay vì đại số brute-force).

> [!example] Example 3.19 — Tính div của composition
> Tiếp tục $E: y^2 = x^3 + x + 6$ trên $\mathbb{F}_{11}$, $P = (2,7)$, $Q = (5,2)$, $R = P+Q = (8,3)$.
> 
> - $L = y - 2x - 3$: $\text{div}(L) = [(2,7)] + [(5,2)] + [(8,8)] - 3[\mathcal{O}]$
> - $V = x - 8$: $\text{div}(V) = [(8,3)] + [(8,8)] - 2[\mathcal{O}]$
> 
> $$ \text{div}(L/V) = \bigl([(2,7)] + [(5,2)] + [(8,8)] - 3[\mathcal{O}]\bigr) - \bigl([(8,3)] + [(8,8)] - 2[\mathcal{O}]\bigr) $$
> 
> $$ = [(2,7)] + [(5,2)] - [(8,3)] - [\mathcal{O}] $$
> 
> $$ = [P] + [Q] - [P+Q] - [\mathcal{O}] \quad \checkmark $$

---

## Evaluation của $f$ tại Divisor

### Definition

> [!definition] Definition 3.20 — Evaluation tại Divisor
> Cho $f \in \bar{k}(E)^*$ và $D = \sum n_P [P]$ là divisor với support không giao với $\text{div}(f)$. Định nghĩa:
> 
> $$ f(D) := \prod_{P} f(P)^{n_P} $$

> [!note] Remark 3.21 — Tại sao cần điều kiện disjoint support?
> Nếu $P$ là zero hoặc pole của $f$, thì $f(P) = 0$ hoặc $f(P) = \infty$, và $f(P)^{n_P}$ không xác định. Điều kiện "disjoint support" đảm bảo tất cả $f(P)$ đều là phần tử hữu hạn khác không.
> 
> Trong định nghĩa Weil pairing, ta phải cẩn thận chọn đại diện divisors sao cho điều kiện này thỏa mãn. Đây là một nguồn của sự phức tạp kỹ thuật trong Lesson 06.

> [!example] Example 3.22 — Evaluation cụ thể
> Lấy $f = y - 2x - 3$ (line function từ Example 3.8) và $D = [T]$ với $T = (7, 2)$ (điểm bất kỳ không nằm trên line).
> 
> $$ f(D) = f(T) = 2 - 2\cdot 7 - 3 = 2 - 14 - 3 = -15 \equiv 7 \pmod{11} $$
> 
> Với $D = [(2,7)] - [(5,2)]$:
> 
> $$ f(D) = f(2,7)^1 \cdot f(5,2)^{-1} = (7 - 4 - 3) \cdot (2 - 10 - 3)^{-1} = 0 \cdot \ldots $$
> 
> Không xác định vì $(2,7)$ là zero của $f$! Đây là ví dụ về support không disjoint.

---

## SageMath Cheatsheet

```python
# Rational functions trên E
E = EllipticCurve(GF(11), [1, 6])
K = E.function_field()                         # function field k(E)
x, y = K.gen(), K.gen(1)                       # generators

# Hoặc dùng coordinate ring
R.<X, Y> = GF(11)[]
I = R.ideal(Y^2 - X^3 - X - 6)
Ering = R.quotient(I)

# Divisor của rational function (concept, SageMath dùng scheme language)
# Verify divisor computation numerically:
p = 11
def eval_line(lam, c, pt):
    """Evaluate y - lam*x - c at point pt=(x,y)"""
    return (pt[1] - lam*pt[0] - c) % p

P, Q, R = (2,7), (5,2), (8,3)
ell = lambda pt: eval_line(2, 3, pt)           # y - 2x - 3
print(ell(P), ell(Q))                          # 0, 0 (zeros)
print(ell((8, 8)))                             # 0 (third zero, -R)

# Abel-Jacobi: P <-> [P]-[O] in Pic^0
# Visualize group law through divisors:
# div(L_PQ / V_R) = [P]+[Q]-[R]-[O]
V = lambda pt: (pt[0] - 8) % p                 # x - 8 (vertical through R)
T = (3, 5)                                     # test point not on L or V
print(ell(T) * pow(V(T), -1, p) % p)           # L(T)/V(T) -- just a value

# Riemann-Roch via point counts
# For E of genus g=1, over algebraically closed field:
# ell(D) = max(0, deg(D)) for deg(D) != 0
# ell(D) = 1 if D ~ 0
```

**SageMath docs**: [Elliptic curve function fields](https://doc.sagemath.org/html/en/reference/arithmetic_curves/)

---

## Summary / Key Takeaways

- Function field $\bar{k}(E)$: rational functions $f = r(x) + s(x)y$ trên $E$. Mọi $f$ xác định tốt sau khi rút gọn modulo phương trình đường cong.
- $\text{ord}_P(f) \in \mathbb{Z}$: bậc zero ($> 0$) hoặc pole ($< 0$) của $f$ tại $P$. Dùng uniformizer $t_P$.
- $\text{div}(f) = \sum_P \text{ord}_P(f) [P]$: degree 0 luôn đúng.
- **Weil Reciprocity**: $f(\text{div}(g)) = g(\text{div}(f))$ khi support disjoint — công cụ kỹ thuật chứng minh bilinearity của pairing.
- $\text{Pic}^0(E) = \text{Div}^0(E)/\text{Princ}(E)$: nhóm divisor class degree-0.
- **Abel–Jacobi**: $P \mapsto [P] - [\mathcal{O}]$ là **group isomorphism** $E(\bar{k}) \xrightarrow{\sim} \text{Pic}^0(E)$.
- **Riemann–Roch** trên $E$ (genus 1): $\ell(D) = \deg(D)$ với $\deg(D) > 0$. Đặc biệt: $\ell([P]) = 1$ → không có rational function với đúng một simple pole.
- **[P] - [O] không bao giờ principal** (với $P \neq \mathcal{O}$) — đây là nền tảng của cả cấu trúc nhóm lẫn định nghĩa Weil pairing.
- Group law: $\text{div}(L_{P,Q}/V_{P+Q}) = [P]+[Q]-[P+Q]-[\mathcal{O}]$ — group law hoàn toàn được mô tả qua divisors.

---

## References

- Silverman, _The Arithmetic of Elliptic Curves_ (AEC), Ch. II (algebraic geometry background), Ch. III §3 (divisors on elliptic curves).
- Milne, J. S., _Elliptic Curves_, Ch. 3–4 — [Free PDF](https://www.jmilne.org/math/Books/ectext6.pdf)
- Sutherland, MIT 18.783 Lecture Notes 2022, Lectures 7–8 (divisors), Lectures 23–24 (Weil pairing).
- Ben Lynn, PBC Notes: Divisors — [Web](https://crypto.stanford.edu/pbc/notes/elliptic/divisor.html)
- Gathmann, _Algebraic Curves_, Ch. 8 (Riemann–Roch) — [Free PDF](https://agag-gathmann.math.rptu.de/class/curves-2023/curves-2023-c8.pdf)