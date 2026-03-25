---
title: "A1. SageMath Implementation Patterns"
type: appendix
tags: [crypto, isogeny, SageMath, implementation, CTF, appendix]
aliases: [SageMath Patterns, Isogeny Implementation]
created: 2026-03-25
---

> **Mục tiêu**: Tổng hợp tất cả patterns SageMath thực tế dùng trong isogeny-based crypto và CTF. Appendix này là **quick reference** — mỗi mục có code chạy được, không phải tutorial.

---

## 1. Elliptic Curves — Setup Cơ bản

```python
p = 101
F = GF(p)
E = EllipticCurve(F, [1, 3])          # y^2 = x^3 + x + 3

F2 = GF(p^2, 'i', modulus=x^2+1)
E2 = EllipticCurve(F2, [1, 0])        # trên Fp^2

E_montgomery = EllipticCurve(F, [0, 6, 0, 1, 0])  # y^2 = x^3 + 6x^2 + x (A=6)

j = E.j_invariant()
E_from_j = EllipticCurve_from_j(GF(p)(1728))

print(E.order(), E.is_supersingular(), E.j_invariant())
```

---

## 2. Isogenies — Tính toán Cơ bản

```python
p = 101
F = GF(p)
E = EllipticCurve(F, [1, 0])

E.order()                     # số điểm
t = p + 1 - E.order()         # trace of Frobenius

P = E.random_point()
Q = E.lift_x(F(5))            # lift x=5 lên curve

ell = 3
K = (E.order() // ell) * P    # điểm bậc ell
phi = E.isogeny(K)            # ell-isogeny từ kernel <K>
E2 = phi.codomain()

phi.degree()                  # = ell
phi(P)                        # image của P
phi.dual()                    # dual isogeny

chain = E.isogeny_codomain([K1, K2])  # chain isogenies
```

---

## 3. Torsion Subgroups — Pattern Quan trọng

```python
p = 2^6 * 3^4 - 1
F2 = GF(p^2, 'i', modulus=x^2+1)
E0 = EllipticCurve(F2, [1, 0])

eA, eB = 6, 4
N_A, N_B = 2^eA, 3^eB

def find_torsion_basis(E, N):
    """Tìm hai điểm độc lập tuyến tính bậc N"""
    order = E.order()
    cofactor = order // N
    while True:
        P = cofactor * E.random_point()
        if P.order() == N:
            break
    while True:
        Q = cofactor * E.random_point()
        if Q.order() == N:
            if E.weil_pairing(P, Q, N) != 1:
                return P, Q

PA, QA = find_torsion_basis(E0, N_A)
PB, QB = find_torsion_basis(E0, N_B)
print(f"PA order: {PA.order()}, independence: {E0.weil_pairing(PA, QA, N_A) != 1}")
```

---

## 4. CSIDH — Group Action Evaluation

```python
def csidh_action(A, p, ell_list, exponents):
    """
    Evaluate class group action [e_1,...,e_n] * E_A.
    Trả về Montgomery coefficient của codomain.
    """
    F = GF(p)
    exponents = list(exponents)

    while any(e != 0 for e in exponents):
        x = F.random_element()
        rhs = x^3 + F(A)*x^2 + x
        if rhs == 0:
            continue
        s = 1 if rhs.is_square() else -1
        active = [i for i, e in enumerate(exponents)
                  if e != 0 and (e > 0) == (s == 1)]
        if not active:
            continue
        E = EllipticCurve(F, [0, A, 0, 1, 0])
        try:
            P = E.lift_x(x)
        except ValueError:
            continue
        prod_ells = prod(ell_list[i] for i in active)
        P = ((p + 1) // prod_ells) * P
        for i in active:
            cofactor = prod_ells // ell_list[i]
            Q = cofactor * P
            if Q.is_zero():
                continue
            phi = E.isogeny(Q)
            E = phi.codomain()
            P = phi(P)
            prod_ells = ell_list[i]
            exponents[i] -= s
        A = E.a_invariants()[1]
    return A

p = 431
ell_list = [l for l in primes(3, 30) if (p + 1) % l == 0]
e = [1, -1, 2, 0][:len(ell_list)]
result = csidh_action(GF(p)(0), p, ell_list, e)
print(f"Action result: A = {result}")
```

---

## 5. Supersingularity — Tests

```python
p = 101
F2 = GF(p^2, 'a')

E = EllipticCurve(GF(p), [1, 0])
print(E.is_supersingular())             # built-in

t = p + 1 - E.order()
print(t % p == 0)                       # t ≡ 0 (mod p) ⟺ SS (p > 3)

for j_val in GF(p):
    try:
        E_j = EllipticCurve_from_j(GF(p)(j_val))
        if E_j.is_supersingular():
            print(f"SS j-invariant: {j_val}")
    except:
        pass
```

---

## 6. Quaternion Algebras — Operations

```python
p = 83
B = QuaternionAlgebra(-1, -p)           # B_{p,∞} với q=1
i, j, k = B.gens()

alpha = 1 + 2*i + 3*j + 4*k
print(alpha.reduced_norm())             # x^2 + y^2 + pz^2 + pw^2
print(alpha.reduced_trace())            # 2x
print(alpha.conjugate())                # x - yi - zj - wk

O0 = B.maximal_order()
print(O0.basis())

I = O0.right_ideal([O0(b) for b in O0.basis()])
print(I.norm())

beta = O0.random_element(5)
nrd = beta.reduced_norm()
print(f"Random element norm: {nrd}")
```

---

## 7. Modular Polynomials — Isogeny Graph Navigation

```python
p = 107
ell = 2
R.<X, Y> = GF(p)[]

Phi = ClassicalModularPolynomialDatabase()[ell]
Phi_p = R(Phi)

j0 = GF(p)(1728)
Phi_j0 = Phi_p(X, j0)
neighbors = Phi_j0.univariate_polynomial().roots()
print(f"{ell}-isogeny neighbors of j={j0}: {[r for r, _ in neighbors]}")

# BFS trên supersingular isogeny graph
def isogeny_graph_bfs(p, ell, j_start, depth=2):
    visited = {j_start: 0}
    queue = [j_start]
    R.<X, Y> = GF(p)[]
    Phi_p = R(ClassicalModularPolynomialDatabase()[ell])
    for _ in range(depth):
        next_queue = []
        for j in queue:
            poly = Phi_p(X, GF(p)(j)).univariate_polynomial()
            for r, _ in poly.roots():
                if r not in visited:
                    visited[r] = visited[j] + 1
                    next_queue.append(r)
        queue = next_queue
    return visited

graph = isogeny_graph_bfs(107, 2, GF(107)(1728), depth=3)
print(f"Reachable j-invariants: {len(graph)}")
```

---

## 8. Weil Pairing — MOV Attack

```python
p = 53
F = GF(p)
E = EllipticCurve(F, [1, 0])
assert E.is_supersingular()

P = E.random_point()
while P.is_zero() or P.order() < 5:
    P = E.random_point()
r = P.order()

n_secret = 7
Q = n_secret * P

Fext = GF(p^2)
Eext = E.base_extend(Fext)
Pext = Eext(P)
Qext = Eext(Q)

T = Eext.random_point()
while Eext.weil_pairing(Pext, T, r) == Fext(1):
    T = Eext.random_point()

gP = Eext.weil_pairing(Pext, T, r)
gQ = Eext.weil_pairing(Qext, T, r)

# Tính discrete log trong Fext
n_recovered = discrete_log(gQ, gP)
print(f"Recovered n = {n_recovered}, correct: {n_recovered == n_secret}")
```

---

## 9. SIDH Key Exchange — Proof of Concept

```python
p = 2^5 * 3^3 - 1
F2 = GF(p^2, 'i', modulus=x^2+1)
E0 = EllipticCurve(F2, [1, 0])
eA, eB = 5, 3

def sidh_keygen_alice(E0, PA, QA, PB, QB, eA):
    kA = randint(0, 2^eA - 1)
    SA = PA + kA * QA
    phiA = E0.isogeny(SA)
    return kA, phiA.codomain(), phiA(PB), phiA(QB)

def sidh_sharedsecret(k, phiOther_P, phiOther_Q, E_other):
    S = phiOther_P + k * phiOther_Q
    phi = E_other.isogeny(S)
    return phi.codomain().j_invariant()
```

---

## 10. Isogeny Path Finding — BFS (Small Parameters)

```python
def find_isogeny_path(E_start, j_target, ell, p, max_depth=10):
    """BFS tìm path isogenies từ E_start đến j_target."""
    F = GF(p)
    R.<X, Y> = F[]
    Phi_p = R(ClassicalModularPolynomialDatabase()[ell])

    queue = [(E_start.j_invariant(), [])]
    visited = {E_start.j_invariant()}

    while queue:
        j_curr, path = queue.pop(0)
        if len(path) >= max_depth:
            continue
        poly = Phi_p(X, F(j_curr)).univariate_polynomial()
        for j_next, _ in poly.roots():
            if j_next == F(j_target):
                return path + [j_next]
            if j_next not in visited:
                visited.add(j_next)
                queue.append((j_next, path + [j_next]))
    return None

p = 107
result = find_isogeny_path(
    EllipticCurve_from_j(GF(p)(1728)),
    0,  # target
    ell=2, p=p
)
print(f"Path: {result}")
```

---

## 11. CSIDH CTF Attack — Meet in the Middle

```python
def csidh_mitm(E0_A, p, ell_list, B=2):
    """
    Meet-in-the-middle attack on CSIDH với small B.
    Tìm secret (e_1, ..., e_n) sao cho [e] * E0 = E_A.
    """
    n = len(ell_list)
    A_target = E0_A
    A0 = GF(p)(0)  # base curve coefficient

    from itertools import product as iproduct

    # Baby step: tính tất cả [e_1,...,e_k] * E0 cho nửa đầu
    k = n // 2
    baby_table = {}
    for e_half in iproduct(range(-B, B+1), repeat=k):
        exps = list(e_half) + [0] * (n - k)
        A = csidh_action(A0, p, ell_list, exps)
        baby_table[A] = e_half

    # Giant step: tính [e_{k+1},...,e_n]^{-1} * E_target
    for e_half2 in iproduct(range(-B, B+1), repeat=n-k):
        exps = [0]*k + [-e for e in e_half2]
        A_test = csidh_action(A_target, p, ell_list, exps)
        if A_test in baby_table:
            e1 = list(baby_table[A_test])
            e2 = list(e_half2)
            return e1 + e2

    return None
```

---

## 12. Common CTF Patterns Summary

```python
# Pattern 1: Supersingular check + MOV
if E.is_supersingular():
    # MOV attack: ECDLP → DLP in Fq^k
    pass

# Pattern 2: CSIDH small params → brute force
# Enumerate (2B+1)^n possibilities

# Pattern 3: SIDH torsion images → Castryck-Decru
# Need: E0, EA, phi_A(PB), phi_A(QB)
# phi_A degree = 2^eA
# Use Kani + (2,2)-isogenies

# Pattern 4: isogeny chain recovery
# Given start and end curve, find path via BFS on isogeny graph
# Complexity: O(p^{1/4}) via meet-in-the-middle

# Pattern 5: Endomorphism ring known → Deuring
# Convert isogeny problem to ideal problem in quaternion algebra
# Solve norm equation, translate back

# Pattern 6: Kernel from torsion points
P_ker = E.lift_x(F(known_x))
if P_ker.order() == ell:
    phi = E.isogeny(P_ker)
    E2 = phi.codomain()
```

---

## 13. Debugging Tips

```python
# Kiểm tra isogeny chain hợp lệ
def verify_isogeny_chain(E_start, chain_kernels, E_target):
    E = E_start
    for K in chain_kernels:
        phi = E.isogeny(K)
        E = phi.codomain()
    return E.j_invariant() == E_target.j_invariant()

# Tìm order của điểm nhanh
P = E.random_point()
if (p+1) * P == E(0):
    print("P has order dividing p+1")

# Extension field operations
F4 = GF(p^4, 'z')
E_ext = E.base_extend(F4)
# Torsion points có thể nằm trên extension

# Montgomery form conversion
def to_montgomery(E):
    """Chuyển Weierstrass sang Montgomery nếu có thể"""
    try:
        return E.montgomery_model()
    except:
        return None
```

---

## References

- SageMath Docs — elliptic curves: doc.sagemath.org/html/en/reference/arithmetic_curves/
- Oudompheng, Pope — *A Note on Reimplementing the Castryck-Decru Attack*, ePrint 2022/1283
- LearningToSQI — *SQISign-SageMath*, github.com/LearningToSQI/SQISign-SageMath
- De Feo, L. — *Mathematics of Isogeny Based Cryptography*, arXiv:1711.04062
