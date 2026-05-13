---
title: "A1. ROS Attack — SageMath Implementation"
type: attack
tags: [crypto, blind-signature, ros, sageMath, implementation, appendix-a1]
aliases: [ROS Implementation, Benhamouda ROS Solver]
created: 2026-05-13
---

> **Liên quan**: [[12-ros-attack|12. Attack II — The ROS Attack]], [[13-parallel-ros-mnm-attack|13. Attack III — Parallel ROS & M&M Attack]]
>
> **Notation** (ký hiệu dùng mà không định nghĩa ở đây):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $p$ | Prime order của group |
> | $\lambda = \lceil \log_2 p \rceil$ | Bit-length của $p$ |
> | $\ell$ | Số sessions (dimension của ROS problem) |
> | $H_\mathsf{ros}$ | Random oracle trong ROS game, output $\in \mathbb{Z}_p$ |
> | $\hat\rho_i \in \mathbb{Z}_p^\ell$ | Coefficient vector gửi cho oracle |
> | $c_i \in \mathbb{Z}_p$ | Challenge value tương ứng |

---

Tài liệu này implement và giải thích chi tiết **polynomial-time ROS solver** của Benhamouda et al. (EUROCRYPT 2021), áp dụng cho tham số nhỏ để chạy được trong thực tế (CTF). Phần cuối ghép solver vào forgery attack trên Schnorr blind signature.

---

## 1 — Nhắc lại: ROS Problem

Cho oracle $H_\mathsf{ros}: \mathbb{Z}_p^\ell \to \mathbb{Z}_p$, tìm $(\hat\rho_1, \ldots, \hat\rho_{\ell+1}) \in (\mathbb{Z}_p^\ell)^{\ell+1}$ và $c = (c_1, \ldots, c_\ell) \in \mathbb{Z}_p^\ell$ sao cho:

$$
H_\mathsf{ros}(\hat\rho_i) = \langle \hat\rho_i,\, c \rangle \quad \text{với mọi } i \in \{1, \ldots, \ell+1\}
$$

Solver của Benhamouda et al. chạy trong thời gian $O(\ell^2)$ oracle calls khi $\ell \geq \lambda = \lceil \log_2 p \rceil$.

---

## 2 — Ý tưởng Cốt lõi: Binary Decomposition

**Bước 1: Partial solutions.** Với mỗi $i \in [\ell]$, định nghĩa hai vector:

$$
\hat\rho_i^0 = e_i \quad \text{và} \quad \hat\rho_i^1 = 2 e_i
$$

trong đó $e_i$ là basis vector thứ $i$ trong $\mathbb{Z}_p^\ell$. Query oracle:

$$
c_i^0 = H_\mathsf{ros}(e_i), \quad c_i^1 = \frac{H_\mathsf{ros}(2e_i)}{2} \pmod{p}
$$

Kiểm tra: $\langle e_i, c \rangle = c_i$ và $\langle 2e_i, c \rangle = 2c_i$. Nếu $c_i = c_i^0 = c_i^1$ → cả hai điều kiện tương thích với $c_i$ là entry thứ $i$ của solution.

**Bước 2: Tạo interpolation polynomial.** Với mỗi $i$, định nghĩa linear polynomial $f_i: \mathbb{Z}_p \to \mathbb{Z}_p$:

$$
f_i(x) = \frac{x - c_i^0}{c_i^1 - c_i^0} \pmod{p}
$$

$f_i$ thỏa: $f_i(c_i^0) = 0$ và $f_i(c_i^1) = 1$. Nếu ta chọn $c_i = c_i^{b_i}$ cho $b_i \in \{0,1\}$, thì $f_i(c_i) = b_i$.

**Bước 3: Construct $\hat\rho_{\ell+1}$.** Định nghĩa:

$$
\rho_{\ell+1}(x_1, \ldots, x_\ell) = \sum_{i=1}^\ell 2^{i-1} f_i(x_i)
$$

Đây là đa thức tuyến tính (degree 1) trong $x_1, \ldots, x_\ell$. Ghi $\hat\rho_{\ell+1} \in \mathbb{Z}_p^\ell$ là vector coefficient của phần linear:

$$
\hat\rho_{\ell+1,i} = \frac{2^{i-1}}{c_i^1 - c_i^0} \pmod{p}
$$

Query oracle: $y = H_\mathsf{ros}(\hat\rho_{\ell+1})$. Vì $\ell \geq \lambda$:

$$
y = \sum_{i=1}^\ell 2^{i-1} b_i \pmod{p} \quad \text{cho một số } b_i \in \{0, 1\}
$$

**Bước 4: Giải binary decomposition.** Viết $y$ theo binary để tìm các bit $b_i$:

$$
y + \rho_{\ell+1,0} = \sum_{i=1}^\ell 2^{i-1} b_i \pmod p
$$

Với $\ell \geq \lceil \log_2 p \rceil$, luôn tồn tại decomposition như vậy.

**Solution:** $c_i = c_i^{b_i}$ cho $i \in [\ell]$, dùng $\hat\rho_i = \hat\rho_i^{b_i}$, và $\hat\rho_{\ell+1}$ như trên.

---

## 3 — SageMath Implementation

```sage
def ros_solver_benhamouda(Hros, p, ell):
    Fp = GF(p)
    
    c0_list = []
    c1_list = []
    rho0_list = []
    rho1_list = []
    
    for i in range(ell):
        rho0 = [Fp(0)] * ell
        rho0[i] = Fp(1)
        rho1 = [Fp(0)] * ell
        rho1[i] = Fp(2)
        
        h0 = Fp(Hros(tuple(rho0)))
        h1 = Fp(Hros(tuple(rho1)))
        
        c0_i = h0
        c1_i = h1 / Fp(2)
        
        c0_list.append(c0_i)
        c1_list.append(c1_i)
        rho0_list.append(tuple(rho0))
        rho1_list.append(tuple(rho1))
    
    rho_last = [Fp(0)] * ell
    rho_last_const = Fp(0)
    
    for i in range(ell):
        if c0_list[i] == c1_list[i]:
            return None
        denom = c1_list[i] - c0_list[i]
        coeff = Fp(2)**i / denom
        rho_last[i] = coeff
        rho_last_const -= coeff * c0_list[i]
    
    y_raw = Fp(Hros(tuple(rho_last)))
    y = y_raw + rho_last_const
    
    y_int = ZZ(y)
    if y_int > p // 2:
        y_int = y_int - p
    
    bits = []
    remaining = y_int
    for i in range(ell):
        bit = remaining % 2
        bits.append(bit)
        remaining = (remaining - bit) // 2
        if remaining == 0:
            bits.extend([0] * (ell - len(bits)))
            break
    
    if len(bits) < ell:
        bits.extend([0] * (ell - len(bits)))
    
    chosen_rhos = []
    chosen_cs = []
    for i in range(ell):
        if bits[i] == 0:
            chosen_rhos.append(rho0_list[i])
            chosen_cs.append(c0_list[i])
        else:
            chosen_rhos.append(rho1_list[i])
            chosen_cs.append(c1_list[i])
    
    chosen_rhos.append(tuple(rho_last))
    
    return chosen_rhos, [ZZ(c) for c in chosen_cs]
```

---

## 4 — Tích hợp vào Schnorr Blind Signature Forgery

Với Schnorr blind sig scheme trên group $\mathbb{G}$ bậc $p$, generator $g$, public key $X = g^x$:

Signing protocol tạo ra $\ell+1$ valid signatures từ $\ell$ oracle calls như sau.

**Setup:** ROS oracle $H_\mathsf{ros}(\hat\rho) = H(g^{\langle \hat\rho, \mathbf{R} \rangle} \| m^*)$ trong đó $\mathbf{R} = (R_1, \ldots, R_\ell)$ là $\ell$ commitments nhận được từ Signer.

```sage
def schnorr_ros_forgery(signer_oracle, pk, p, g, H, target_msg, ell):
    sessions = []
    R_list = []
    for _ in range(ell):
        sid, R = signer_oracle.open_session()
        sessions.append(sid)
        R_list.append(R)
    
    def Hros_schnorr(rho_vec):
        R_combined = prod(
            R_list[i]^ZZ(rho_vec[i]) for i in range(ell)
        )
        return ZZ(H(R_combined, target_msg)) % p
    
    result = ros_solver_benhamouda(Hros_schnorr, p, ell)
    if result is None:
        return None
    chosen_rhos, c_vector = result
    
    forged_sigs = []
    for i in range(ell):
        c_i = c_vector[i]
        s_i = signer_oracle.respond(sessions[i], c_i)
        R_i = R_list[i]
        forged_sigs.append((R_i, c_i, s_i))
    
    rho_last = chosen_rhos[ell]
    R_last = prod(R_list[i]^ZZ(rho_last[i]) for i in range(ell))
    c_last = ZZ(H(R_last, target_msg)) % p
    
    s_last = sum(
        ZZ(rho_last[i]) * forged_sigs[i][2]
        for i in range(ell)
    ) % p
    s_last = (s_last - sum(
        ZZ(rho_last[i]) * forged_sigs[i][1] * 0
        for i in range(ell)
    )) % p
    
    return (R_last, c_last, s_last)
```

---

## 5 — Ví dụ Cụ thể trên Tham số Nhỏ

Để chạy được, dùng $p$ nhỏ (vd. 16-bit) và simulate oracle bằng dict cache:

```sage
p = next_prime(2^16)
ell = ceil(log(p, 2)) + 1
Fp = GF(p)

hash_cache = {}
call_count = 0

def Hros_simulated(rho_vec):
    global call_count
    key = tuple(ZZ(x) for x in rho_vec)
    if key not in hash_cache:
        hash_cache[key] = ZZ(randrange(p))
        call_count += 1
    return hash_cache[key]

result = ros_solver_benhamouda(Hros_simulated, p, ell)

if result is not None:
    rhos, cs = result
    for i, (rho, c) in enumerate(zip(rhos, cs)):
        lhs = Fp(Hros_simulated(rho))
        rhs = Fp(sum(Fp(rho[j]) * Fp(c if j < len(cs) else cs[-1])
                     for j in range(ell)))
    print(f"Oracle calls: {call_count}")
    print(f"Sessions used: {ell}")
    print(f"Theoretical: 2*ell = {2*ell} calls")
```

Với $p \approx 2^{16}$, $\ell = 17$ sessions, solver cần khoảng $2\ell + 1 = 35$ oracle calls — polynomial trong $\lambda$.

---

## 6 — Complexity Analysis

| Phase | Oracle calls | Computation |
|-------|-------------|-------------|
| Partial solutions ($\ell$ queries $\times$ 2 variants) | $2\ell$ | $O(\ell)$ |
| Construct $\hat\rho_{\ell+1}$ | 1 | $O(\ell)$ |
| Binary decomposition of $y$ | 0 | $O(\lambda)$ |
| **Total** | $2\ell + 1$ | $O(\ell^2)$ |

Khi $\ell = \lambda$: total $2\lambda + 1$ oracle calls. Với $p \approx 2^{256}$, cần $\ell = 256$ signing sessions và $\approx 513$ hash queries — hoàn toàn practical.

> [!warning] Điều kiện $c_i^0 \neq c_i^1$
> Solver giả thiết $c_i^0 \neq c_i^1$ cho mọi $i$ — tức là $H_\mathsf{ros}(e_i) \neq H_\mathsf{ros}(2e_i)/2 \pmod p$. Với $H_\mathsf{ros}$ ngẫu nhiên, xác suất xảy ra va chạm là $1/p$ per index — negligible. Nếu xảy ra, resample (đổi seed).

---

## 7 — Đối chiếu với Lecture 12

Solver này tương ứng trực tiếp với **Theorem 1** trong Benhamouda et al. (Section 3). Lecture 12 đã mô tả intuition; appendix này là implementation thực tế:

- **Lecture 12 Section "Binary Decomposition Trick"**: tương ứng Bước 2 và 3 ở trên
- **Lecture 12 Section "Polynomial-time Threshold"**: $\ell \geq \lambda$ là điều kiện để binary decomposition khả thi
- **Lecture 12 Figure "ROS System"**: ma trận $(\hat\rho_i)_{i=1}^{\ell+1}$ chính là output của `chosen_rhos` trong code

---

## References

- Benhamouda, Lepoint, Loss, Orrù, Raykova — *On the (In)Security of ROS*, EUROCRYPT 2021
- [[12-ros-attack|12. Attack II — The ROS Attack]]
- [[a0-ctf-cheatsheet|A0. Blind Signature CTF Cheatsheet]] — Pattern 3: ROS-based Concurrent Forgery
