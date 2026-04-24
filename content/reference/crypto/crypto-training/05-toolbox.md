---
title: "05. Toolbox"
type: foundation
tags: [crypto, ctf, tools, sagemath, pwntools, z3]
aliases: [L02, Toolbox, CTF Tools]
created: 2026-04-16
---

> **Prerequisites**: [[04-modular-arithmetic|04. Modular Arithmetic]], Python cơ bản.  
> **Lesson type**: Foundation  

---

## 1. Tại sao cần tool chuyên biệt?

Python chuẩn đủ để làm bài CTF easy. Nhưng từ medium trở lên, bạn sẽ cần:

- Tính toán số học trong ring/field với số 2048-bit — Python built-in `int` không có cú pháp phù hợp.
- Kết nối tới server, gửi hàng nghìn query (padding oracle attack) — cần automation.
- Tìm nghiệm của hệ phương trình logic với điều kiện phức tạp — brute-force thủ công không thực tế.

Ba tool sau đây giải quyết ba loại nhu cầu khác nhau, và thường được dùng **kết hợp** trong một bài:

![[assets/img-02-toolbox.png]]
*Ba công cụ chính — mỗi công cụ có "domain" riêng. Biết dùng đúng tool giúp giảm 80% thời gian giải bài.*

---

## 2. SageMath — Computer Algebra System

**SageMath** là hệ thống toán học mã nguồn mở, tích hợp nhiều thư viện toán học (NumPy, SymPy, PARI/GP, GAP, v.v.) trong một ngôn ngữ thống nhất dựa trên Python. Nó là "ngôn ngữ của crypto researcher".

### 2.1. Khi nào dùng SageMath?

Dùng SageMath khi cần toán học có cấu trúc: nhóm, trường, vành, đa thức, lattice, đường cong elliptic. Nếu bài yêu cầu "factor $n$", "tính discrete log", "reduce lattice" — đây là lúc của SageMath.

### 2.2. Số học cơ bản

```sage
p = next_prime(2^127)
factor(2^64 - 1)
gcd(48, 18)
euler_phi(100)
crt([2, 3], [3, 5])

pow(7, -1, 11)
Zmod(11)(7)^(-1)
```

### 2.3. Finite Fields và Rings

```sage
F = GF(7)
F(5) + F(4)
F(3).inverse()

R = Zmod(15)
R(7) * R(3)

F2 = GF(2^8, 'x')
x = F2.gen()
(x^3 + x + 1) * (x^2 + 1)
```

> [!note] GF(p) vs Zmod(p)
> `GF(p)` là trường hữu hạn — chỉ dùng khi $p$ nguyên tố (có modular inverse cho mọi phần tử khác 0). `Zmod(n)` là vành — modular inverse chỉ tồn tại khi `gcd(a, n) = 1`. Cẩn thận với sự khác biệt này khi làm việc với composite modulus (như trong RSA: $n = pq$).

### 2.4. Đa thức và Rings

```sage
R.<x> = PolynomialRing(GF(2))
f = x^8 + x^4 + x^3 + x + 1
g = x^3 + x + 1
f.gcd(g)
f % g
```

### 2.5. Elliptic Curves

```sage
p = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F
E = EllipticCurve(GF(p), [0, 7])
G = E.gen(0)
n = E.order()

2 * G
G + G
n * G

Q = 42 * G
discrete_log(Q, G)
```

### 2.6. Lattice Reduction (LLL)

```sage
M = matrix(ZZ, [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
])
M.LLL()
```

> [!tip] SageMath installation
> Cài đặt: `pip install sagemath` (nếu có binary wheel cho Python version của bạn) hoặc dùng SageMath Docker: `docker run -it sagemath/sagemath`.
>
> Hoặc dùng CoCalc (cocalc.com) — SageMath online miễn phí, không cần cài đặt.

> [!note] Recommend từ Rougitsune  
> Tốt nhất là cài sagemath qua conda cho dễ dàng quản lí. Theo kinh nghiệm bản thân thì các tool của mật mã nên cài và chạy qua wsl, vì thường thì môi trường linux hỗ trợ cho các thư viện và công cụ mật mã và toán học tốt hơn.  
> [Installation Guide](https://doc.sagemath.org/html/en/installation/index.html)

---

## 3. pwntools — CTF Framework

**pwntools** là thư viện Python thiết kế riêng cho CTF, cung cấp abstraction cho: network connection, process interaction, binary packing/unpacking, và nhiều utility khác.

### 3.1. Khi nào dùng pwntools?

Dùng pwntools khi cần **tương tác với server**: gửi request, nhận response, xử lý nhiều round của oracle query, thực hiện attack tự động qua mạng.

### 3.2. Kết nối cơ bản

```python
from pwn import *

conn = remote("chall.ctf.com", 1337)

conn.recvuntil(b"Enter value: ")
conn.sendline(b"42")
response = conn.recvline()
print(response)

conn.close()
```

### 3.3. Nhận và parse data

```python
from pwn import *
conn = remote("chall.ctf.com", 1337)

data = conn.recvline().strip()

n_line = conn.recvuntil(b"\n")
n = int(n_line.split(b"n = ")[1].strip())

conn.recvuntil(b"c = ")
c = int(conn.recvline().strip())
```

### 3.4. Bytes utilities

```python
from pwn import *

xor(b"hello", b"world")
xor(b"hello", b"\xff")
xor(b"\xde\xad\xbe\xef", b"\xca\xfe\xba\xbe")

p32(0xdeadbeef)
p64(0xcafebabe)
u32(b"\xef\xbe\xad\xde")
```

### 3.5. Context và logging

```python
context.log_level = "debug"
context.log_level = "error"
```

> [!example] Pattern: Padding Oracle Attack Skeleton
>
> Đây là structure điển hình của một oracle-based attack:
>
> ```python
> from pwn import *
>
> def oracle(ct: bytes) -> bool:
>     conn = remote("chall.ctf.com", 1337)
>     conn.sendline(ct.hex().encode())
>     resp = conn.recvline()
>     conn.close()
>     return b"valid" in resp
>
> def decrypt_byte(ct, block_idx, byte_idx):
>     for guess in range(256):
>         pass
>
> ct = bytes.fromhex("...")
> plaintext = decrypt_byte(ct, 0, 0)
> ```

> [!tip] Local subprocess — không cần server
> Nếu bài cho binary hoặc Python script:
>
> ```python
> conn = process(["python3", "chall.py"])
> conn = process("./chall_binary")
> ```
>
> Cú pháp recv/send y hệt `remote()`.

---

## 4. z3 — SMT Solver

**z3** là Satisfiability Modulo Theories (SMT) solver của Microsoft Research. Nó nhận một tập **constraints** (ràng buộc toán học) và tìm **assignment** (gán giá trị) thỏa mãn tất cả constraints, hoặc kết luận không có nghiệm.

### 4.1. Khi nào dùng z3?

Dùng z3 khi bài cho bạn **đầu ra của một quá trình tính toán** và yêu cầu tìm **input** — thường là reverse một PRNG, recover một key từ output bị ràng buộc, hoặc tìm giá trị thỏa một tập điều kiện logic.

### 4.2. Cú pháp cơ bản

```python
from z3 import *

x, y, z = Ints('x y z')
s = Solver()

s.add(x + y + z == 100)
s.add(x * y == 21)
s.add(z > 0)
s.add(x > 0)
s.add(y > 0)

if s.check() == sat:
    m = s.model()
    print(m[x], m[y], m[z])
else:
    print("No solution")
```

### 4.3. Kiểu dữ liệu trong z3

```python
x, y = Ints('x y')            # số nguyên không giới hạn
a, b = BitVecs('a b', 32)     # bitvector 32-bit (giống uint32)
p, q = Bools('p q')           # boolean
r, s_val = Reals('r s_val')   # số thực (dùng ít trong crypto)

a ^ b         # XOR
a & b         # AND
a | b         # OR
a >> 3        # logical right shift
a << 2        # left shift
```

### 4.4. Brute-force thông minh với z3

```python
from z3 import *

key = [BitVec(f'k{i}', 8) for i in range(4)]
s = Solver()

known_output = [0x41, 0x42, 0x43, 0x44]
for i in range(4):
    s.add(key[i] ^ 0x13 ^ i == known_output[i])

s.add(And([k >= 0x20, k <= 0x7e] for k in key))

if s.check() == sat:
    m = s.model()
    result = bytes([m[k].as_long() for k in key])
    print(result)
```

### 4.5. Reverse một PRNG đơn giản

```python
from z3 import *

state = BitVec('state', 32)
s = Solver()

outputs = [0x12345678, 0xabcdef01]

s1 = (state * 1664525 + 1013904223) & 0xffffffff
s2 = (s1 * 1664525 + 1013904223) & 0xffffffff

s.add(s1 == outputs[0])
s.add(s2 == outputs[1])

if s.check() == sat:
    print(f"Initial state: {hex(s.model()[state].as_long())}")
```

> [!warning] Giới hạn của z3
> z3 có thể chậm hoặc timeout với các vấn đề lớn. Nó mạnh nhất với:
> - Biến số ít (dưới vài chục)
> - Constraints tuyến tính hoặc bitwise
> - Modular arithmetic với modulus nhỏ
>
> Với lattice reduction hay discrete log — dùng SageMath, không phải z3.

---

## 5. Kết hợp tool: Ví dụ điển hình

```python
from pwn import *
from z3 import *

conn = remote("chall.ctf.com", 1337)
outputs = []
for _ in range(10):
    conn.recvuntil(b"rand = ")
    outputs.append(int(conn.recvline().strip()))

state = BitVec('state', 32)
s = Solver()
for i, out in enumerate(outputs):
    state_i = state
    for _ in range(i + 1):
        state_i = (state_i * 1664525 + 1013904223) & 0xffffffff
    s.add(state_i == out)

if s.check() == sat:
    recovered_state = s.model()[state].as_long()
    
    conn.recvuntil(b"Enter key: ")
    conn.sendline(str(recovered_state).encode())
    print(conn.recvline())
```

Ở đây: **pwntools** kết nối và lấy dữ liệu, **z3** recover PRNG state, **pwntools** submit kết quả.

Trong bài RSA/ECC: **pwntools** lấy parameters, **SageMath** chạy attack math, **pwntools** submit kết quả.

---

## 6. Công cụ bổ sung

| Tool | Dùng cho | Link |
|---|---|---|
| **CyberChef** | Encode/decode nhanh (base64, hex, XOR, AES) không cần code | gchq.github.io/CyberChef |
| **RsaCtfTool** | Automated RSA Attack — Wiener, small-e, factordb | github.com/RsaCtfTool |
| **hashcat** | GPU hash cracking với wordlist/rule | hashcat.net |
| **factordb.com** | Database số đã được factor — tra $n$ trước khi tự factor | factordb.com |
| **dcode.fr** | Classical cipher solver (Caesar, Vigenère, Playfair...) | dcode.fr |

> [!note] Rougitsune Notes:  
> Thành thạo 3 tool sagemath, pwntools, z3solver là có thể làm được rất nhiều bài ctf rồi. Ngoài khi làm mật mã cổ điển thì dcode.fr hoặc CyberChef khá hữu ích và đầy đủ.

---

## 7. Summary

- **SageMath**: toán học — số học modular, finite fields, factoring, ECC, lattice. Mọi computation nặng.
- **pwntools**: network — kết nối server, gửi/nhận data, automation. Mọi oracle interaction.
- **z3**: constraint solving — tìm giá trị thỏa ràng buộc, reverse PRNG, brute-force thông minh.
- **Decision rule**: thấy toán → SageMath; thấy server → pwntools; thấy "tìm x thỏa điều kiện" → z3.
- Bài medium/hard thường kết hợp cả ba tool trong một pipeline.

---

## 8. References

- SageMath Documentation — https://doc.sagemath.org/
- pwntools Documentation — https://docs.pwntools.com/
- z3 Tutorial (Microsoft) — https://microsoft.github.io/z3guide/
- z3 Python API Reference — https://z3prover.github.io/api/html/namespacez3py.html
- CryptoHack — Introduction track: https://cryptohack.org/challenges/introduction/
