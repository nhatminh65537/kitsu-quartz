---
title: "07. Plookup"
tags: [crypto, plonk, plookup, lookup-tables, lesson-07]
aliases: [Plookup]
created: 2026-03-13
---

> **Prerequisites**: [[05-fiat-shamir-security-model|05. Fiat-Shamir and Security Model]], [[02-plonk-arithmetization|02. PLONK Arithmetization]]  
> **Objectives**:  
> - Hiểu tại sao lookup tables cần thiết trong SNARK
> - Nắm vững Plookup protocol: sorted multiset argument
> - Hiểu cải tiến log-derivative lookup
> - Phân tích attack surface của lookup argument

---

## Motivation

Một số operations vừa thường dùng vừa rất đắt khi encode thành polynomial constraints:

- **XOR 8-bit**: cần 8 boolean gates + 8 range checks = ~16 gates
- **Bit decomposition**: $n$-bit value → $n$ boolean gates
- **Range check** $v \in [0, 2^{32})$: 32 boolean gates
- **SHA-256 round**: hàng trăm XOR/AND/rotate operations

**Ý tưởng Plookup**: thay vì *prove* computation, **tra bảng** (lookup). Nếu ta pre-compute toàn bộ bảng $(a, b, a \oplus b)$ cho mọi $a, b \in [0, 255]$ và đặt vào circuit, Prover chỉ cần prove rằng $(a_i, b_i, c_i)$ **thuộc bảng** — không cần prove từng bit.

---

## Lookup Argument: Vấn đề cốt lõi

> [!definition] Definition 7.1 — Lookup Problem
> Cho:
> - **Table** $t = (t_0, t_1, \ldots, t_{d-1}) \in \mathbb{F}^d$ (public, fixed)
> - **Lookup values** $f = (f_0, f_1, \ldots, f_{n-1}) \in \mathbb{F}^n$ (witness)
>
> Chứng minh: $f \subset t$, tức là **mọi $f_i$ đều là phần tử của $t$** (as a multiset inclusion).

**Chú ý**: $f$ có thể có phần tử lặp, $t$ thường không lặp (hoặc lặp ít hơn).

---

## Plookup Protocol

Paper gốc: Gabizon & Williamson (ePrint 2020/315).

### Bước 1: Sorted Vector

> [!definition] Definition 7.2 — Sorted-by-Table Vector $s$
> Tạo vector $s$ là **concatenation** của $f$ và $t$, **sắp xếp theo thứ tự của $t$**:
>
> $$s = (f_0, \ldots, f_{n-1}, t_0, \ldots, t_{d-1}) \text{ sorted by position in } t$$
>
> Độ dài: $|s| = n + d$.
>
> **Tính chất**: Trong $s$, hai phần tử liên tiếp $s_i, s_{i+1}$ hoặc bằng nhau, hoặc $s_{i+1}$ là phần tử kế tiếp của $t$.

### Bước 2: Grand Product Argument

Định nghĩa hai rational functions dùng challenges $\beta, \gamma$:

$$F(\beta, \gamma) = (1 + \beta)^n \prod_{i=0}^{n-1} (\gamma + f_i) \cdot \prod_{i=0}^{d-1} (\gamma(1+\beta) + t_i + \beta t_{i+1})$$

$$G(\beta, \gamma) = \prod_{i=0}^{n+d-1} (\gamma(1+\beta) + s_i + \beta s_{i+1})$$

> [!theorem] Theorem 7.3 — Plookup Correctness
> $f \subset t$ (tức mọi phần tử $f_i$ thuộc $t$) **khi và chỉ khi** $F(\beta, \gamma) = G(\beta, \gamma)$ với xác suất $1 - O(n/|\mathbb{F}|)$ trên $\beta, \gamma$ ngẫu nhiên.

**Chứng minh ý tưởng**: Nếu $f \subset t$, ta có thể viết $s$ = interleaving của $f$ và $t$ theo thứ tự $t$. Mỗi $f_i$ ngồi cạnh $t_j$ tương ứng trong $s$, làm cho $F = G$ do bilinearity của product. Nếu có $f_i \notin t$, sẽ có "khoảng trống" trong $s$ không khớp.

### Bước 3: Encode thành Polynomial Identity

Tương tự permutation argument (Lesson 03), ta encode grand product thành **accumulator polynomial** $z(X)$ và chứng minh 3 conditions:

1. $z(1) = 1$ (khởi tạo)
2. Accumulation step đúng (polynomial identity trên $H$)
3. $z(\omega^{n+d-1}) = 1$ (product = 1)

---

## Implementation — Plookup Demo

```python
def plookup_check(f, t, beta, gamma, p):
    """
    Kiểm tra f subset of t dùng Plookup grand product.
    f: lookup values (list)
    t: table (list, sorted)
    Returns True if check passes.
    """
    n = len(f)
    d = len(t)

    # Tạo sorted vector s: concat f và t, sort by position in t
    # Mỗi element được map: (value, is_from_f)
    items = [(v, 'f') for v in f] + [(v, 't') for v in t]
    # Sort theo vị trí trong t
    t_order = {v: i for i, v in enumerate(t)}
    # Mọi f_i phải nằm trong t
    for fi in f:
        if fi not in t_order:
            return False, "element not in table"

    items_sorted = sorted(items, key=lambda x: (t_order[x[0]], 0 if x[1] == 't' else 1))
    s = [x[0] for x in items_sorted]

    # Tính F và G
    t_ext = t + [t[-1]]  # t_{d} = t_{d-1} để wrap around

    F = pow(1 + beta, n, p)
    for fi in f:
        F = (F * (gamma + fi)) % p
    for i in range(d):
        F = (F * (gamma * (1 + beta) + t[i] + beta * t[(i+1) % d])) % p

    G = 1
    for i in range(n + d):
        G = (G * (gamma * (1 + beta) + s[i] + beta * s[(i+1) % (n+d)])) % p

    return F == G, f"F={F}, G={G}"

# Demo: table = {0,1,2,...,7} (3-bit values), f = [3, 1, 5, 3]
p = 337
t = list(range(8))  # table: 0 to 7
f = [3, 1, 5, 3]    # all values in table -> should pass

beta, gamma = 17, 41
result, msg = plookup_check(f, t, beta, gamma, p)
print(f"f={f} subset of t={t}: {result} ({msg})")

# Test với value ngoài table
f_bad = [3, 1, 9, 3]  # 9 not in table
result_bad, msg_bad = plookup_check(f_bad, t, beta, gamma, p)
print(f"f={f_bad} subset of t={t}: {result_bad} ({msg_bad})")
```

---

## Log-Derivative Lookup (Cải tiến)

Plookup gốc dùng grand product — tương tự permutation argument, cần $O(n)$ accumulator values. Cải tiến **log-derivative** (Haböck 2022, dùng trong UltraHonk) đơn giản hơn:

> [!definition] Definition 7.4 — Log-Derivative Lookup
> Với challenge $\beta$, định nghĩa:
>
> $$\sum_{i=0}^{n-1} \frac{1}{f_i + \beta} = \sum_{j=0}^{d-1} \frac{m_j}{t_j + \beta}$$
>
> trong đó $m_j$ là số lần $t_j$ xuất hiện trong $f$ (multiplicity).
>
> **Chứng minh**: Prover cung cấp $m_j$ và một polynomial identity. Verifier kiểm tra sum equality tại random $\beta$.

**Ưu điểm log-derivative**:
- Không cần sort $s$ → đơn giản hơn
- Dễ combine với permutation argument
- Được dùng trong UltraHonk (thay thế Plookup gốc)

```python
def log_derivative_check(f, t, beta, p):
    """
    Log-derivative lookup: sum 1/(f_i + beta) = sum m_j/(t_j + beta)
    """
    from collections import Counter
    # Kiểm tra f subset t
    t_set = set(t)
    for fi in f:
        if fi not in t_set:
            return False, f"{fi} not in table"

    multiplicity = Counter(f)

    # LHS: sum 1/(f_i + beta)
    lhs = 0
    for fi in f:
        lhs = (lhs + pow((fi + beta) % p, p - 2, p)) % p

    # RHS: sum m_j/(t_j + beta)
    rhs = 0
    for tj in t:
        mj = multiplicity.get(tj, 0)
        if mj > 0:
            rhs = (rhs + mj * pow((tj + beta) % p, p - 2, p)) % p

    return lhs == rhs, f"LHS={lhs}, RHS={rhs}"

p = 337
t = list(range(8))
f = [3, 1, 5, 3]
beta = 19
ok, msg = log_derivative_check(f, t, beta, p)
print(f"Log-derivative check: {ok} ({msg})")
assert ok
print("Plookup demo: OK")
```

---

## Multi-Column Lookup

Trong thực tế (ví dụ XOR table), lookup là **tuple** $(a, b, c)$ chứ không phải scalar đơn.

> [!definition] Definition 7.5 — Multi-Column Lookup
> Table $t$ gồm các tuples $(t^{(1)}_j, t^{(2)}_j, \ldots, t^{(k)}_j)$. Lookup values $f$ cũng là tuples.
>
> **Reduce về scalar**: Dùng challenge $\eta$, nén tuple thành scalar:
>
> $$f_i \leftarrow f^{(1)}_i + \eta f^{(2)}_i + \eta^2 f^{(3)}_i + \ldots$$
>
> Sau đó áp dụng Plookup trên scalars.

---

## Bug Bounty: Lookup Argument Vulnerabilities

> [!danger] Vulnerability 7.6 — Multiplicity Overflow
> Trong log-derivative lookup, prover cung cấp multiplicities $m_j$. Nếu không có upper bound check trên $m_j$, prover có thể set $m_j$ âm (trong trường $\mathbb{F}$, "âm" là $p - m$) để manipulate sum.
>
> **Fix**: Enforce $0 \leq m_j \leq n$ bằng range constraint.

> [!danger] Vulnerability 7.7 — Table Not Committed
> Nếu table $t$ không được commit vào verifier key (mà chỉ được "assume" là cố định), prover có thể submit proof với table $t'$ khác, làm sai lookup semantics.
>
> **Fix**: Table selector polynomials phải được commit trong setup và verified.

> [!danger] Vulnerability 7.8 — Padding Issues trong Sorted Vector
> Plookup gốc dùng "dummy values" để pad sorted vector $s$ khi lookup gate không active ($q_{\text{lookup}} = 0$). Nếu dummy values không phải phần tử của table, sorted vector check sẽ fail.
>
> Ngược lại: nếu dummy values được set tùy ý và không constrained, prover có thể inject values vào $s$ mà không qua lookup.

---

## Summary

- **Plookup** cho phép prove membership $f \subset t$ với overhead $O(n + d)$ thay vì $O(n \cdot d)$.
- **Sorted multiset argument**: tạo vector $s$ = $f \cup t$ sorted by $t$, chứng minh grand product = 1.
- **Log-derivative lookup**: cải tiến đơn giản hơn, không cần sort, dùng trong UltraHonk.
- **Multi-column**: nén tuples bằng random challenge $\eta$.
- **Bug bounty**: multiplicity overflow, table không committed, padding sai.

---

## References

- Gabizon & Williamson — *plookup: A simplified polynomial protocol for lookup tables* (ePrint 2020/315)
- Haböck — *A log-derivative lookup argument* (ePrint 2022/1530)
- Aztec — TurboPlonk/UltraPlonk documentation
- 0xPARC ZK Bug Tracker — lookup argument bugs
