---
title: "A1. Proof of Hahn-Banach Theorem"
tags: [math, functional-analysis, appendix]
aliases: [Proof Hahn-Banach Theorem]
created: 2026-03-31
---

> **Liên quan**: [[06-hahn-banach-duality|06. Hahn-Banach Theorem & Duality]]

---

## Phát biểu

> [!theorem] Theorem A1.1 — Hahn-Banach (Dạng giải tích)
> Cho $X$ là không gian vector thực, $M \subseteq X$ là không gian con, $p: X \to \mathbb{R}$ là phiếm hàm sublinear, và $f: M \to \mathbb{R}$ là phiếm hàm tuyến tính thỏa $f(x) \leq p(x)$ với mọi $x \in M$. Khi đó tồn tại phiếm hàm tuyến tính $F: X \to \mathbb{R}$ thỏa $F|_M = f$ và $F(x) \leq p(x)$ với mọi $x \in X$.

---

## Bổ đề mở rộng một chiều

> [!theorem] Lemma A1.2 — Mở rộng thêm một chiều
> Cho $M$, $f$, $p$ như trên, và $x_0 \in X \setminus M$. Tồn tại phiếm hàm tuyến tính $f_1: M_1 \to \mathbb{R}$ trên $M_1 = M \oplus \operatorname{span}\{x_0\}$, mở rộng $f$ và vẫn thỏa $f_1 \leq p$.

**Proof.** Mọi $x \in M_1$ viết duy nhất là $x = m + tx_0$ với $m \in M$, $t \in \mathbb{R}$. Cần $f_1(m + tx_0) = f(m) + tc$ với một hằng số $c$ nào đó (tuyến tính buộc chọn $c = f_1(x_0)$).

**Điều kiện cần tìm**: $f(m) + tc \leq p(m + tx_0)$ với mọi $m \in M$, $t \in \mathbb{R}$.

Với $t > 0$: chia cho $t$: $c \leq p(m/t + x_0) - f(m/t)$ với mọi $m \in M$.
Với $t < 0$: chia cho $|t|$ và dùng tính sublinear: $c \geq f(m/|t|) - p(m/|t| - x_0)$ với mọi $m \in M$.

Cần: $\sup_{m \in M} [f(m) - p(m - x_0)] \leq c \leq \inf_{m \in M} [p(m + x_0) - f(m)]$.

**Kiểm tra hằng số này tương thích**: Với $m_1, m_2 \in M$:

$$
f(m_1) + f(m_2) = f(m_1 + m_2) \leq p(m_1 + m_2) \leq p(m_1 - x_0) + p(m_2 + x_0)
$$

Suy ra $f(m_1) - p(m_1 - x_0) \leq p(m_2 + x_0) - f(m_2)$ với mọi $m_1, m_2$.

Vậy $\sup \leq \inf$, và ta chọn $c$ bất kỳ trong $[\sup, \inf]$. $\blacksquare$

---

## Chứng minh đầy đủ bằng Zorn's Lemma

**Proof của Theorem A1.1.**

**Thiết lập partial order**: Xét tập $\mathcal{P}$ tất cả các cặp $(N, g)$ với:
- $N$ là không gian con của $X$ chứa $M$,
- $g: N \to \mathbb{R}$ là phiếm hàm tuyến tính mở rộng $f$,
- $g(x) \leq p(x)$ với mọi $x \in N$.

Định nghĩa thứ tự: $(N_1, g_1) \leq (N_2, g_2)$ nếu $N_1 \subseteq N_2$ và $g_2|_{N_1} = g_1$.

$\mathcal{P}$ không rỗng: $(M, f) \in \mathcal{P}$.

**Áp dụng Zorn's Lemma**: Xét chuỗi tăng $\{(N_\alpha, g_\alpha)\}$ trong $\mathcal{P}$. Định nghĩa $N = \bigcup_\alpha N_\alpha$ và $g(x) = g_\alpha(x)$ nếu $x \in N_\alpha$ (nhất quán vì chuỗi tăng). Thì $(N, g) \in \mathcal{P}$ và là chặn trên. Theo Zorn's Lemma, $\mathcal{P}$ có phần tử cực đại $(X_0, F)$.

**Phần tử cực đại phải có $X_0 = X$**: Nếu $X_0 \subsetneq X$, chọn $x_0 \in X \setminus X_0$. Theo Lemma A1.2, ta mở rộng $F$ lên $X_0 \oplus \operatorname{span}\{x_0\} \supsetneq X_0$ — mâu thuẫn tính cực đại.

Vậy $(X_0, F) = (X, F)$ và $F$ là phần tử cần tìm. $\blacksquare$

---

## Trường hợp phức

> [!theorem] Theorem A1.3 — Hahn-Banach phức (Bohnenblust-Sobczyk)
> Trong trường hợp $X$ là không gian vector phức và $p$ là **seminorm** thực (tức $p(\alpha x) = |\alpha| p(x)$): Nếu $f: M \to \mathbb{C}$ tuyến tính với $|f(x)| \leq p(x)$, thì tồn tại $F: X \to \mathbb{C}$ tuyến tính mở rộng $f$ với $|F(x)| \leq p(x)$.

**Proof.** Đặt $u(x) = \operatorname{Re} f(x)$. Thì $u: M \to \mathbb{R}$ thực tuyến tính với $u(x) \leq |f(x)| \leq p(x)$. Áp dụng Hahn-Banach thực mở rộng $u$ thành $U: X \to \mathbb{R}$ với $U(x) \leq p(x)$.

Đặt $F(x) = U(x) - iU(ix)$. Kiểm tra $F$ là $\mathbb{C}$-tuyến tính và $|F(x)| \leq p(x)$: viết $F(x) = re^{i\theta}$, thì $|F(x)| = e^{-i\theta}F(x) = F(e^{-i\theta}x) = U(e^{-i\theta}x) \leq p(e^{-i\theta}x) = p(x)$. $\blacksquare$

---

## Ghi chú về Axiom of Choice

> [!note] Remark A1.4
> Hahn-Banach Theorem tương đương (về logic) với **Ultrafilter Lemma** — yếu hơn Axiom of Choice (AC) nhưng không chứng minh được trong ZF (Zermelo-Fraenkel không có AC). Tuy nhiên, mọi ứng dụng thực tế của Functional Analysis đều dùng AC, nên ta chấp nhận Zorn's Lemma hoàn toàn tự nhiên.

---

## References

- Rudin, W. *Functional Analysis* (2nd ed.), Theorem 3.2.
- Kreyszig, E. *Introductory Functional Analysis with Applications*, Theorem 4.3-1.
- Conway, J. B. *A Course in Functional Analysis* (2nd ed.), Theorem 6.1.
