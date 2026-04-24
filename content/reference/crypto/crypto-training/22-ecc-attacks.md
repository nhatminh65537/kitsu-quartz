---
title: "22. ECC Attacks"
type: attack
tags: [crypto, ecc, elliptic-curve, attack, invalid-curve, smart-attack, MOV, singular, singular-curve, dlp-reduction, cusp, node]
aliases: [ECC Attacks, Weak Curve Attacks]
created: 2026-04-17
---

> **Prerequisites**: [[20-ecc-fundamentals|20. ECC Fundamentals]], [[21-ecdh-ecdsa|21. ECDH & ECDSA]], [[18-diffie-hellman-dlp|18. Diffie-Hellman & DLP]], [[11-block-cipher-attacks|11. Block Cipher Attacks (Pohlig-Hellman context)]]  
> **Lesson type**: Attack / Cryptanalysis
>
> **Notation** (ký hiệu dùng mà không định nghĩa lại trong bài):
> | Ký hiệu | Ý nghĩa |
> |---------|---------|
> | $E(\mathbb{F}_p)$ | Nhóm các điểm của đường cong $E$ trên trường $\mathbb{F}_p$ |
> | $\#E(\mathbb{F}_p)$ | Số điểm trên đường cong (order của group) |
> | $G$ | Generator point, bậc $n$ nguyên tố |
> | $d$ | Private key (scalar); $Q = dG$ là public key |
> | $\Delta$ | Discriminant của Weierstrass curve: $\Delta = -16(4a^3 + 27b^2)$ |
> | $t$ | Trace of Frobenius: $t = p + 1 - \#E(\mathbb{F}_p)$ |
> | $\mathbb{Q}_p$ | Trường p-adic numbers |
> | $k$ | Embedding degree: số nhỏ nhất $k$ sao cho $n \mid (p^k - 1)$ |

---

## 1. Bối cảnh và phân loại tấn công

Khi học ECC, ta dễ có cảm giác "chỉ cần dùng đường cong chuẩn là an toàn." Điều đó đúng — nhưng trong CTF và thực tế, đường cong **không phải lúc nào cũng là chuẩn**. Đây là lúc các ECC attacks xuất hiện.

Tất cả attacks trong bài này đều khai thác **điểm yếu trong tham số đường cong**, không phải trong thuật toán ECDH/ECDSA bản thân. Nói cách khác: nếu ta chọn một đường cong "xấu" (weak curve), ECDLP — bài toán nền tảng bảo vệ ECC — có thể bị phá trong vài giây.

![[assets/img-18-ecc-attack-checklist.png]]
*Checklist nhận dạng ECC weak curve — áp dụng theo thứ tự từ 01 đến 08 khi gặp ECC challenge*

> [!tip] CTF Workflow tổng quát cho ECC
> Khi gặp ECC challenge, luôn kiểm tra tuần tự:
> 1. `delta = -16*(4*a^3 + 27*b^2)` có bằng 0 mod p không? → Singular Curve
> 2. `E.order() == p`? → Anomalous → Smart's Attack
> 3. Embedding degree $k$ của $\#E$ có nhỏ không? → MOV/FR Attack
> 4. Server có validate điểm nhận được không? → Invalid Curve Attack
> 5. `factor(E.order())` — order có smooth không? → Pohlig-Hellman trực tiếp

---

## 2. Singular Curve Attack — Tấn công DLP trên Đường Cong Kỳ Dị

### 2.1. Phân loại singular curves

Một đường cong Weierstrass $E: y^2 = x^3 + ax + b$ được gọi là **singular** (kỳ dị) khi discriminant bằng không:

$$
\Delta = -16(4a^3 + 27b^2) \equiv 0 \pmod{p}
$$

Điều này đồng nghĩa với việc đa thức $f(x) = x^3 + ax + b$ có nghiệm bội — tức điểm kỳ dị tồn tại. Có hai dạng kỳ dị:

> [!note] Phân loại: Cusp vs Node
> **Cusp** (mũi nhọn / cuspidal): đa thức $f(x) = x^3 + ax + b$ có **nghiệm bậc ba** $\alpha$ (tức $f(\alpha) = f'(\alpha) = f''(\alpha) = 0$). Điều kiện: $a = 3\alpha^2$ và $b = -2\alpha^3$, tương đương $4a^3 + 27b^2 = 0$.
>
> Ví dụ điển hình: $y^2 = x^3$ (cusp tại gốc tọa độ).
>
> Isomorphism: $E_{\text{ns}}(\mathbb{F}_p) \cong (\mathbb{F}_p, +)$ — **nhóm cộng**.
>
> ---
>
> **Node** (nút / nodal): đa thức $f(x)$ có **nghiệm kép** $\alpha$ và nghiệm đơn $\beta$ riêng biệt. Đường cong tự giao tại điểm $(\alpha, 0)$.
>
> Ví dụ điển hình: $y^2 = x^2(x-c)$ với $c \neq 0$.
>
> Isomorphism:
> - Nếu tiếp tuyến tại nút là **rational** ($\sqrt{3\alpha^2 + a} \in \mathbb{F}_p$): $E_{\text{ns}}(\mathbb{F}_p) \cong \mathbb{F}_p^*$ — **nhóm nhân**.
> - Nếu tiếp tuyến là **irrational**: $E_{\text{ns}}(\mathbb{F}_p) \cong$ subgroup bậc $p+1$ của $\mathbb{F}_{p^2}^*$.

> [!warning] Tại sao đây là thảm họa bảo mật?
> ECDLP trên singular curve **reduce về DLP trong $\mathbb{F}_p^+$ hoặc $\mathbb{F}_p^*$**:
> - $\mathbb{F}_p^+$: DLP là phép chia modular — $O(\log p)$.
> - $\mathbb{F}_p^*$: DLP giải bằng Pohlig-Hellman ($p-1$ smooth) hoặc Index Calculus.
>
> Cả hai đều exponentially dễ hơn ECDLP thật trên curve tốt.

---

### 2.2. Tấn công Cusp Curve — nhóm cộng $(\mathbb{F}_p, +)$

**Bước 1 — Tìm điểm kỳ dị $\alpha$:**

Tìm nghiệm của $\gcd(f(x), f'(x)) = \gcd(x^3+ax+b,\; 3x^2+a)$ trong $\mathbb{F}_p$. Đây chính là nghiệm bậc ba $\alpha$ (cusp point = $(\alpha, 0)$).

**Bước 2 — Đổi biến (shift về gốc):**

Đặt $x' = x - \alpha$, $y' = y$. Curve trở thành $y'^2 = x'^3$ (cusp chuẩn tại gốc).

**Bước 3 — Xây dựng isomorphism $\phi$:**

Với mọi điểm $(x, y) \in E_{\text{ns}}(\mathbb{F}_p)$ (điểm không kỳ dị):

$$
\phi(x, y) = \frac{x - \alpha}{y} \bmod p
$$

Đây là đồng cấu từ $(E_{\text{ns}}(\mathbb{F}_p), +_E) \to (\mathbb{F}_p, +)$.

**Bước 4 — Giải DLP:**

$$
Q = kG \;\Leftrightarrow\; \phi(Q) = k \cdot \phi(G) \;\Leftrightarrow\; k = \phi(Q) \cdot \phi(G)^{-1} \bmod p
$$

Giải trong $O(\log p)$!

```python
def cusp_attack(a, b, p, G, Q):
    """
    G, Q là tuple (x, y). Giải ECDLP: Q = k*G trên cusp curve.
    """
    Fp = GF(p)
    R.<x> = Fp[]

    # Bước 1: Tìm nghiệm bậc ba (cusp point)
    f = x^3 + a*x + b
    roots = f.roots()
    # Chọn nghiệm bội (cusp): nghiệm xuất hiện với multiplicity >= 2
    alpha = None
    for r, mult in f.factor():
        if r.degree() == 1 and mult >= 2:
            alpha = -r[0]
            break
    if alpha is None:
        # Thử tất cả roots và chọn cái làm f' cũng bằng 0
        fp = f.derivative()
        for r, _ in roots:
            if fp(r) == 0:
                alpha = r
                break
    assert alpha is not None, "Không tìm được điểm kỳ dị!"

    # Bước 3: Ánh xạ sang F_p^+
    def phi(P):
        x, y = P
        return Fp(x - alpha) / Fp(y)

    g_img = phi(G)
    q_img = phi(Q)

    # Bước 4: Giải DLP trong (F_p, +): k = q/g mod p
    k = ZZ(q_img) * pow(ZZ(g_img), -1, p) % p
    return k

# Verify
# assert k * G == Q  (check bên ngoài hàm)
```

> [!example] CTF Pattern — Cusp Curve
> ```python
> p = 7919
> # y^2 = x^3 + 3x^2 (cusp dạng chung)
> # Tương đương y^2 = (x+1)^3 sau shift
> a, b = 3, 0   # 4*27 + 27*0 = 108 -> cần kiểm tra Delta = 0
> E = EllipticCurve(GF(p), [a, b])
> # Nếu E.discriminant() == 0: singular!
> ```

---

### 2.3. Tấn công Node Curve — nhóm nhân $\mathbb{F}_p^*$

**Bước 1 — Tìm gốc kép $\alpha$:**

Tính $\gcd(f(x), f'(x))$ trong $\mathbb{F}_p[x]$. Nghiệm của GCD là $\alpha$ (node point). Gốc còn lại $\beta$ thỏa $f(x) = (x-\alpha)^2(x-\beta)$.

**Bước 2 — Tính căn bậc hai tại nút:**

Tại node $(\alpha, 0)$, hai tiếp tuyến có hệ số góc $\pm\sqrt{t}$ với:
$$t = 3\alpha^2 + a \bmod p$$

Kiểm tra $t$ có phải quadratic residue mod $p$ không (dùng Legendre symbol $(t/p)$).

> [!note] Hai trường hợp của node
> - **$(t/p) = 1$**: $\sqrt{t} \in \mathbb{F}_p$ → group isomorphic $\mathbb{F}_p^*$ (DLP trong $\mathbb{F}_p$).
> - **$(t/p) = -1$**: $\sqrt{t} \notin \mathbb{F}_p$ → group isomorphic subgroup bậc $p+1$ của $\mathbb{F}_{p^2}^*$.

**Bước 3 — Xây dựng isomorphism $\phi$:**

$$
\phi(x, y) = \frac{y - \sqrt{t}(x - \alpha)}{y + \sqrt{t}(x - \alpha)} \bmod p
$$

Đây là đồng cấu từ $(E_{\text{ns}}(\mathbb{F}_p), +_E) \to (\mathbb{F}_p^*, \times)$.

**Bước 4 — Giải DLP trong $\mathbb{F}_p^*$:**

$$
Q = kG \;\Leftrightarrow\; \phi(Q) = \phi(G)^k \bmod p
$$

Dùng Pohlig-Hellman (nếu $p-1$ smooth) hoặc Baby-step Giant-step.

```python
def node_attack(a, b, p, G, Q):
    """
    Giải ECDLP trên node curve. Giả sử t là QR (rational tangents).
    """
    Fp = GF(p)
    R.<x> = Fp[]
    f = x^3 + a*x + b

    # Tìm gốc kép alpha
    g = gcd(f, f.derivative())
    roots_g = g.roots()
    assert len(roots_g) > 0, "Không có gốc kép!"
    alpha = roots_g[0][0]

    # Tính t và sqrt_t
    t = Fp(3 * alpha^2 + a)
    assert t.is_square(), "t không phải QR — cần dùng F_{p^2}!"
    sqrt_t = t.sqrt()

    def phi(P):
        x, y = Fp(P[0]), Fp(P[1])
        num = y - sqrt_t * (x - alpha)
        den = y + sqrt_t * (x - alpha)
        return num / den

    g_img = phi(G)
    q_img = phi(Q)

    # Giải DLP trong F_p*
    k = discrete_log(q_img, g_img)
    return ZZ(k)

# Ví dụ nhỏ để kiểm tra
p = 101
a, b = -3, 2   # y^2 = x^3 - 3x + 2 = (x-1)^2(x+2) — node tại x=1
G_pt = (0, 1)  # Điểm trên curve (cần verify)
Q_pt = (...)   # Điểm cần tìm private key
```

> [!tip] Heuristic nhận dạng node vs cusp
> ```python
> R.<x> = GF(p)[]
> f = x^3 + a*x + b
> g = gcd(f, f.derivative())
> roots = g.roots()
> # Nếu có nghiệm bậc 1: đó là điểm kỳ dị
> # Kiểm tra f tại nghiệm đó:
> alpha = roots[0][0]
> print(f"f(alpha) = {f(alpha)}")          # Phải = 0
> print(f"f'(alpha) = {f.derivative()(alpha)}")  # Phải = 0
> # Kiểm tra f''(alpha):
> print(f"f''(alpha) = {f.derivative().derivative()(alpha)}")
> # != 0 → node; == 0 → cusp
> ```

---

### 2.4. CTF Pattern và Nhận dạng

Quy trình chuẩn khi gặp singular curve trong CTF:

```python
from sage.all import *

def singular_attack(p, a, b, Gx, Gy, Qx, Qy):
    """
    Auto-detect và tấn công singular elliptic curve.
    """
    Fp = GF(p)
    R.<x> = Fp[]

    # Bước 1: Xác nhận singular
    delta = (-16 * (4*pow(a,3,p) + 27*pow(b,2,p))) % p
    assert delta == 0, f"Curve không singular! delta = {delta}"
    print("[+] Singular curve confirmed")

    # Bước 2: Tìm điểm kỳ dị
    f = x^3 + Fp(a)*x + Fp(b)
    fp = f.derivative()
    g = gcd(f, fp)
    alpha = g.roots()[0][0]
    print(f"[+] Singular point alpha = {alpha}")

    # Bước 3: Phân loại cusp vs node
    fpp = fp.derivative()
    if fpp(alpha) == 0:
        print("[+] Type: CUSP — group isomorphic to (F_p, +)")
        attack_type = "cusp"
    else:
        print("[+] Type: NODE — group isomorphic to F_p* or subgroup of F_{p^2}*")
        attack_type = "node"

    G = (Fp(Gx), Fp(Gy))
    Q = (Fp(Qx), Fp(Qy))

    if attack_type == "cusp":
        # phi(P) = (x - alpha) / y
        def phi(P):
            return (P[0] - alpha) / P[1]
        g_img = phi(G)
        q_img = phi(Q)
        k = ZZ(q_img) * pow(ZZ(g_img), -1, p) % p

    else:  # node
        t = Fp(3*alpha^2 + a)
        if not t.is_square():
            raise NotImplementedError("Node with irrational tangents (need F_{p^2})")
        sqrt_t = t.sqrt()
        def phi(P):
            x, y = Fp(P[0]), Fp(P[1])
            return (y - sqrt_t*(x - alpha)) / (y + sqrt_t*(x - alpha))
        g_img = phi(G)
        q_img = phi(Q)
        k = discrete_log(q_img, g_img)

    print(f"[+] Private key k = {k}")
    return ZZ(k)
```

> [!example] Ví dụ hoàn chỉnh — Cusp
> ```python
> # Challenge: curve y^2 = x^3 (cusp tại gốc)
> p = 10007
> a, b = 0, 0  # y^2 = x^3 → Delta = 0 → cusp
> # Chú ý: b=0 nhưng a=0 cũng → Delta = -16*(0 + 0) = 0
> # Thực tế cusp curve dạng sau khi shift: y^2 = x^3
> # phi(x, y) = x/y
> Gx, Gy = 3, ...   # điểm generator (tìm từ curve)
> Qx, Qy = ..., ... # public key cần reverse
> k = singular_attack(p, a, b, Gx, Gy, Qx, Qy)
> ```

> [!warning] Lưu ý khi $b = 0$ hoặc $a = 0$
> Không phải mọi curve với $b = 0$ đều là cusp. Cần kiểm tra discriminant $\Delta = -16(4a^3 + 27b^2)$ mới xác định được. Ví dụ: $y^2 = x^3 + x$ (với $a=1, b=0$) có $\Delta = -16 \cdot 4 = -64 \neq 0$ — **không singular**.

---

## 3. Anomalous Curve Attack (Smart's Attack)

### 3.1. Điều kiện

Một đường cong $E$ được gọi là **anomalous** khi:

$$
\#E(\mathbb{F}_p) = p \quad \Leftrightarrow \quad t = 1
$$

trong đó $t = p + 1 - \#E(\mathbb{F}_p)$ là **trace of Frobenius**. Đây là trường hợp đặc biệt: order của group bằng chính đặc số $p$.

![[assets/img-18-smarts-attack.png]]
*Smart's Attack: 5 bước từ ECDLP trên GF(p) → p-adic → giải trivially bằng ratio*

### 3.2. Tại sao nguy hiểm

Khi $\#E(\mathbb{F}_p) = p$, tồn tại một **đồng cấu** từ $E(\mathbb{F}_p)$ vào nhóm cộng $(\mathbb{Z}/p\mathbb{Z}, +)$ thông qua p-adic lifting. Trong nhóm cộng, "ECDLP" chỉ là phép chia thông thường — giải được trong $O(1)$!

> [!abstract] Theorem — Smart's Attack (1997)
> Cho $E/\mathbb{F}_p$ là đường cong anomalous với $\#E(\mathbb{F}_p) = p$. Với $P, Q \in E(\mathbb{F}_p)$ sao cho $Q = kP$, có thể recover $k \in \mathbb{Z}/p\mathbb{Z}$ trong thời gian $O(\log^2 p)$ qua p-adic lifting.

**Proof sketch.** Nhóm $E_1(\mathbb{Q}_p) = \ker(E(\mathbb{Q}_p) \to E(\mathbb{F}_p))$ là **formal group** có isomorphism $\psi_p: E_1(\mathbb{Q}_p) \xrightarrow{\sim} p\mathbb{Z}_p$. Vì $\#E(\mathbb{F}_p) = p$, bản đồ $[p]: E(\mathbb{Q}_p) \to E(\mathbb{Q}_p)$ gửi bất kỳ lift $P'$ của $P$ vào $E_1(\mathbb{Q}_p)$. Ta tính $k = \psi_p([p]Q') / \psi_p([p]P') \in \mathbb{Z}/p\mathbb{Z}$. Điều này hoạt động vì $\psi_p$ là đồng cấu nhóm. $\blacksquare$

### 3.3. Các bước thực hiện

**Bước 1**: Lift $P, Q \in E(\mathbb{F}_p)$ thành $P', Q' \in E(\mathbb{Q}_p)$ bằng Hensel lifting (tìm $y'$ thỏa $y'^2 \equiv x^3 + ax + b \pmod{p^2}$ với $y' \equiv y \pmod{p}$).

**Bước 2**: Tính $[p]P' \in E(\mathbb{Q}_p)$, lấy tọa độ $(x_1, y_1)$ với $x_1, y_1 \in \mathbb{Z}_p$.

**Bước 3**: Áp dụng p-adic elliptic logarithm: $\psi_p([p]P') = -(x_1/y_1) \bmod p^2$, chia cho $p$.

**Bước 4**: Tương tự với $Q'$. Lấy tỷ lệ:

$$
k = \frac{\psi_p([p]Q') / p}{\psi_p([p]P') / p} \pmod{p}
$$

```python
def smart_attack(E, G, Q, p):
    Qp = Qp(p, 2)
    Ep = EllipticCurve(Qp, [E.a4(), E.a6()])

    def lift_point(P):
        x = Qp(P[0])
        y_sq = x^3 + Qp(E.a4())*x + Qp(E.a6())
        y = y_sq.sqrt()
        if ZZ(y[0]) != P[1]:
            y = -y
        return Ep(x, y)

    Pp = lift_point(G)
    Qp_pt = lift_point(Q)

    pP = p * Pp
    pQ = p * Qp_pt

    lP = -(pP[0] / pP[1])
    lQ = -(pQ[0] / pQ[1])

    return ZZ((lQ / lP)[0])
```

> [!example] CTF Pattern — Anomalous Curve
> ```python
> p = 16857450949524777441941817393974784044780411511252189319
> E = EllipticCurve(GF(p), [A, B])
> assert E.order() == p        # Điều kiện anomalous!
> k = smart_attack(E, G, Q, p) # Recover private key ngay lập tức
> ```

---

## 4. MOV Attack (Menezes-Okamoto-Vanstone, 1993)

### 4.1. Ý tưởng cốt lõi

MOV attack khai thác **Weil pairing** hoặc **Tate pairing** — ánh xạ song tuyến:

$$
e: E[n] \times E[n] \to \mu_n \subset \mathbb{F}_{p^k}^*
$$

trong đó $\mu_n$ là nhóm căn bậc $n$ trong $\mathbb{F}_{p^k}^*$. Nếu embedding degree $k$ nhỏ, ECDLP trong $E(\mathbb{F}_p)$ có thể **reduce về DLP trong $\mathbb{F}_{p^k}^*$**, nơi Index Calculus áp dụng được.

> [!abstract] Theorem — MOV Reduction
> Cho $E/\mathbb{F}_p$, $P \in E$ bậc nguyên tố $n$, embedding degree $k$ (tức $n \mid p^k - 1$ nhưng $n \nmid p^i - 1$ với $i < k$). Khi đó ECDLP trong $\langle P \rangle$ reduce về DLP trong $\mathbb{F}_{p^k}^*$ qua:
>
> $$g = e(P, T), \quad h = e(Q, T) \quad \Rightarrow \quad h = g^d$$
>
> với $T \in E[n]$ được chọn ngẫu nhiên, $Q = dP$, $d$ là unknown.

**Proof sketch.** Bilinearity của pairing: $e(dP, T) = e(P, T)^d$. Vậy $h/g^d = 1$ khi $d$ đúng. Biết $g, h \in \mathbb{F}_{p^k}^*$, DLP bình thường áp dụng. $\blacksquare$

### 4.2. Khi nào MOV nguy hiểm

- **Supersingular curves** (trace $t = 0$): embedding degree $k \leq 6$, thường $k = 2$. DLP trong $\mathbb{F}_{p^2}^*$ phá được với Index Calculus khi $p$ đủ nhỏ.
- **Các curve đặc biệt** có $k = 3, 4$ — thường gặp trong bài CTF khi $p$ nhỏ (~256-bit).
- **Pairing-friendly curves** (BN254, BLS12-381) có $k = 12$ — an toàn vì $p^{12}$ quá lớn.

> [!warning] Phân biệt: Supersingular ≠ yếu trong mọi ngữ cảnh
> Supersingular curve ($t = 0$) **yếu với MOV attack** khi $p$ nhỏ, nhưng **được dùng có chủ ý trong pairing-based crypto** (ZKP, BLS signature) vì bilinearity là feature! Bảo mật đến từ embedding degree lớn ($k = 12$) và $p$ đủ lớn.

```python
def mov_attack(E, G, Q, p, n, k):
    Fext.<w> = GF(p^k)
    Eext = E.base_extend(Fext)
    Gext = Eext(G)
    Qext = Eext(Q)

    while True:
        T = Eext.random_point()
        T = (Eext.order() // n) * T
        if T != Eext(0): break

    alpha = Gext.weil_pairing(T, n)
    beta  = Qext.weil_pairing(T, n)

    return discrete_log(beta, alpha)
```

> [!note] Kiểm tra embedding degree trong SageMath
> ```python
> E = EllipticCurve(GF(p), [a, b])
> n = E.order()
> k = 1
> while pow(p, k, n) != 1:
>     k += 1
> print(f"Embedding degree k = {k}")
> ```

---

## 5. Invalid Curve Attack (Antipa et al., 2003)

### 5.1. Điều kiện

Attack này **không khai thác đường cong yếu** — nó khai thác **code thiếu validation**. Khi server nhận một điểm $P$ và tính $k \cdot P$ (với $k$ là private key), mà **không kiểm tra $P$ có nằm trên đường cong hay không**, attacker có thể gửi điểm từ curve khác.

> [!danger] Root Cause
> Weierstrass point addition formulas **không dùng tham số $b$**. Tức là, nếu server implement point addition theo công thức chuẩn, phép tính $k \cdot \tilde{P}$ trên curve $\tilde{E}: y^2 = x^3 + ax + \tilde{b}$ sẽ cho kết quả **như thể $\tilde{P}$ nằm trên $\tilde{E}$**, dù server nghĩ nó đang làm việc với $E: y^2 = x^3 + ax + b$.

![[assets/img-18-invalid-curve.png]]
*Invalid curve attack: Mallory gửi điểm trên curve yếu Ẽ (chỉ đổi b), server tính k·P̃ mà không biết*

### 5.2. Cơ chế tấn công

**Bước 1 — Chuẩn bị**: Attacker chọn nhiều "weak curves" $\tilde{E}_i$ dạng $y^2 = x^3 + ax + \tilde{b}_i$ (giữ nguyên $a$!) sao cho $\#\tilde{E}_i(\mathbb{F}_p)$ là **smooth number** nhỏ. Chọn điểm $\tilde{P}_i \in \tilde{E}_i$ có order $r_i$ nhỏ.

**Bước 2 — Gửi điểm độc**: Gửi $\tilde{P}_i$ cho server. Server tính $k \cdot \tilde{P}_i$ — kết quả nằm trong subgroup bậc $r_i$ của $\tilde{E}_i$.

**Bước 3 — Giải DLP nhỏ**: Từ $k \cdot \tilde{P}_i$, giải DLP trong subgroup bậc $r_i$ → recover $k \bmod r_i$.

**Bước 4 — CRT**: Sau đủ queries với $r_1, r_2, \ldots$ sao cho $\prod r_i > n$, dùng CRT để recover $k$ đầy đủ.

> [!abstract] Complexity Analysis
> Mỗi query recover $\log_2(r_i)$ bits của $k$. Với $r_i \approx 2^{20}$, cần $\lceil 256/20 \rceil = 13$ queries để recover private key 256-bit đầy đủ. Mỗi DLP con giải trong $O(\sqrt{r_i}) = O(2^{10})$ — gần như tức thì.

### 5.3. Phòng chống

```python
def is_on_curve(P, a, b, p):
    x, y = P
    return pow(y, 2, p) == (pow(x, 3, p) + a*x + b) % p

def secure_scalar_mult(k, P, a, b, p, n):
    assert is_on_curve(P, a, b, p), "Point not on curve!"
    assert pow_mod(P, n, ...) == infinity, "Invalid order"
    return k * E(P)
```

---

## 6. Twist Attack

### 6.1. Ý tưởng

Mỗi đường cong $E: y^2 = x^3 + ax + b$ có một **quadratic twist** $E': y^2 = x^3 + ax + b'$ (với $b' = u^2 b$, $u$ là quadratic non-residue mod $p$). Hai đường cong này thỏa $\#E(\mathbb{F}_p) + \#E'(\mathbb{F}_p) = 2(p+1)$.

Nếu attacker gửi điểm **không thuộc $E$ nhưng thuộc $E'$** (với $\#E'$ smooth), server sẽ vô tình thực hiện DLP trên $E'$ — và attacker có thể giải bài toán đó.

> [!warning] Liên hệ với Invalid Curve Attack
> Twist attack là một dạng đặc biệt của invalid curve attack — điểm độc chính xác là điểm trên twisted curve. Khác biệt: twist attack chỉ cần thay đổi nghĩa $y$ (không thay $b$ tùy ý), nên **harder to detect** nhưng cùng root cause: thiếu point validation.

### 6.2. Detection trong CTF

```python
def get_twist_order(E, p):
    E_order = E.order()
    return 2*(p + 1) - E_order

E = EllipticCurve(GF(p), [a, b])
twist_order = get_twist_order(E, p)
print(f"Twist order: {twist_order}")
print(f"Factored: {factor(twist_order)}")
```

---

## 7. Pohlig-Hellman trên ECC

Khi $\#E(\mathbb{F}_p)$ là **smooth** (không có large prime factor), ECDLP trực tiếp giải được bằng Pohlig-Hellman. Đây không phải "weak curve attack" theo nghĩa trên, mà là hệ quả của việc chọn $n$ không phải số nguyên tố lớn.

Điều kiện an toàn: $\#E(\mathbb{F}_p)$ phải có ít nhất một prime factor $q \geq 2^{128}$ (128-bit security), và $G$ phải có bậc chính xác là $q$ (cofactor $h = 1$ hoặc rất nhỏ).

```python
E = EllipticCurve(GF(p), [a, b])
n = E.order()
factored = factor(n)
print(factored)
```

---

## 8. Bảng tổng hợp attacks

| Attack | Điều kiện phát hiện | Complexity | SageMath check |
|---|---|---|---|
| Singular | $\Delta \equiv 0 \pmod p$ | $O(\log p)$ | `(-16*(4*a^3+27*b^2)) % p == 0` |
| Anomalous | $\#E = p$ | $O(1)$ — Smart | `E.order() == p` |
| MOV/FR | Embedding degree $k$ nhỏ | Sub-exp in $\mathbb{F}_{p^k}$ | Check $p^k \equiv 1 \pmod n$, $k$ nhỏ |
| Invalid Curve | Không có point validation | $O(\log n / \log r)$ queries | Server-side code audit |
| Pohlig-Hellman | Order smooth | $O(\sum \sqrt{q_i})$ | `factor(E.order())` |
| Twist | Twist order smooth | Như invalid curve | `2*(p+1) - E.order()` |

---

## 9. CTF Relevance

> [!info] Mức độ xuất hiện trong CTF
> - ⭐⭐⭐ **Anomalous (Smart's Attack)** — cực phổ biến, một lệnh check là nhận ra
> - ⭐⭐⭐ **Pohlig-Hellman trên ECC** — rất phổ biến khi $n$ không phải prime
> - ⭐⭐⭐ **Invalid Curve** — phổ biến ở medium/hard CTF, cần đọc server code
> - ⭐⭐ **MOV Attack** — xuất hiện trong advanced CTF, cần embedding degree nhỏ
> - ⭐⭐ **Singular Curve** — vừa phổ biến, detection dễ nhưng exploit cần implement
> - ⭐ **Twist Attack** — thường kết hợp với invalid curve

> [!example] CTF Template — ECC Checklist đầy đủ
> ```python
> from sage.all import *
>
> def ecc_attack_checklist(p, a, b, Gx, Gy, Qx, Qy):
>     E = EllipticCurve(GF(p), [a, b])
>     G = E(Gx, Gy)
>     Q = E(Qx, Qy)
>     n = E.order()
>
>     delta = (-16 * (4*pow(a,3,p) + 27*pow(b,2,p))) % p
>     if delta == 0:
>         print("[!] SINGULAR CURVE DETECTED")
>         return
>
>     if n == p:
>         print("[!] ANOMALOUS CURVE — Running Smart's Attack")
>         print(smart_attack(E, G, Q, p))
>         return
>
>     k = 1
>     while pow(p, k, n) != 1 and k < 10:
>         k += 1
>     if k <= 6:
>         print(f"[!] LOW EMBEDDING DEGREE k={k} — MOV Attack possible")
>
>     factors = factor(n)
>     if all(q < 2^60 for q, _ in factors):
>         print("[!] SMOOTH ORDER — Pohlig-Hellman")
>         print(G.discrete_log(Q))
>         return
>
>     twist_n = 2*(p+1) - n
>     if all(q < 2^60 for q, _ in factor(twist_n)):
>         print("[!] SMOOTH TWIST ORDER — Twist Attack possible")
>
>     print("[*] No obvious weak parameters found.")
> ```

---

## 10. Tài liệu tham khảo

- Smart, N.P. — *The Discrete Logarithm Problem on Elliptic Curves of Trace One*, Journal of Cryptology 12, 1997
- Menezes, Okamoto, Vanstone — *Reducing Elliptic Curve Logarithms to a Finite Field*, IEEE Trans. Information Theory, 1993
- Antipa et al. — *Validation of Elliptic Curve Public Keys*, PKC 2003
- Washington, L.C. — *Elliptic Curves: Number Theory and Cryptography*, Chapter 6
- Boneh & Shoup — *A Graduate Course in Applied Cryptography*, Chapter 17
- CryptoHack — Elliptic Curves track: https://cryptohack.org/challenges/elliptic/
- Novotney, P. — *Weak Curves in ECC* (paper gốc phân tích Smart's attack): https://wstein.org/edu/2010/414/projects/novotney.pdf
- elikaski/ECC_Attacks — code demos cho tất cả attacks: https://github.com/elikaski/ECC_Attacks
