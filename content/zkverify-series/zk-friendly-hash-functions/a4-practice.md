---
title: "A4. Practice Exercises"
tags: [cryptography, zk-hash, practice, exercises]
aliases: [ZK Hash Practice]
created: 2026-03-14
---

> Mỗi bài yêu cầu viết và chạy code thực sự — không có bài lý thuyết hay điền chỗ trống.
> **Stack**: Python 3 + SageMath cho crypto/math; Circom + snarkjs cho circuit.
> **`[Lxx]`** = bài học liên quan. **★–★★★★** = độ khó.

---

## Lab 1 — Field Arithmetic & Circuit Cost `[L01, L02]`

### E1.1 ★ — Field Arithmetic từ đầu

Implement một module Python thực hiện đủ 5 phép: cộng, nhân, lũy thừa nhanh (binary exponentiation), nghịch đảo (Fermat), và căn bậc hai trên $\mathbb{F}_p$ với $p$ là BN254. Không dùng thư viện crypto. Verify bằng các identity chuẩn: $a \cdot a^{-1} = 1$, $(\sqrt{a})^2 = a$.

---

### E1.2 ★★ — Đo chi phí XOR trong arithmetic circuit

Implement XOR 32-bit theo đúng cách một R1CS arithmetic circuit sẽ làm: decompose hai số thành bits, tính từng bit XOR qua phép nhân field, recompose. Đếm chính xác số phép nhân field đã dùng. So sánh con số đó với một phép nhân trực tiếp $a \cdot b$. In ra kết quả benchmark với 1000 cặp random.

---

### E1.3 ★★ — Biểu diễn $y = x^5$ thành R1CS

Viết R1CS tối thiểu cho phép tính $y = x^5$ trên $\mathbb{F}_p$ (dùng ít multiplication gates nhất có thể). Implement hàm kiểm tra: nhận một witness vector và xác minh từng constraint thỏa mãn. Test với ít nhất 10 giá trị $x$ ngẫu nhiên.

---

### E1.4 ★★ — Constraint counter cho SHA-256 round

Implement **một round** của SHA-256 theo đúng spec (Ch, Maj, $\Sigma_0$, $\Sigma_1$, message schedule) bằng Python, **nhưng** thay mọi bitwise operation bằng arithmetic circuit equivalent (decompose-to-bits). Đếm tổng số multiplication gates. Nhân với 64 rounds để có ước lượng tổng constraints cho một SHA-256 call.

---

## Lab 2 — MiMC & GMiMC `[L03, L04]`

### E2.1 ★★ — Implement MiMC-7 đầy đủ

Implement MiMC-7 trên BN254 (SPN mode, không Feistel): round constants sinh bằng SHA-256 của seed chuẩn `"mimc"`, đủ 91 rounds. Implement cả Miyaguchi-Preneel compression để hash danh sách field elements. Output phải deterministic và nhất quán qua nhiều lần chạy.

---

### E2.2 ★★ — Implement GMiMC (multi-branch)

Implement GMiMC với 3 branches trên $\mathbb{F}_{65537}$ (field nhỏ để debug dễ). Tại mỗi round: áp S-box $x^3$ cho branch đầu, cộng kết quả vào hai branch còn lại, rotate. Verify output thay đổi khi đổi bất kỳ branch nào của input.

---

### E2.3 ★★ — Validator tham số MiMC

Viết tool nhận vào $(p, \alpha, \text{num\_rounds})$ và in ra: alpha có coprime với $p-1$ không, số rounds tối thiểu cần thiết cho 128-bit security là bao nhiêu, instance này pass hay fail. Chạy với ít nhất 5 bộ tham số khác nhau (bao gồm cả các trường hợp sai).

---

## Lab 3 — Poseidon `[L05, L06]`

### E3.1 ★★★ — Poseidon permutation từ đầu

Implement Poseidon permutation đầy đủ trên field nhỏ tự chọn ($p < 2^{17}$, $t = 3$, $\alpha = 3$, $R_F = 4$, $R_P = 4$). Bao gồm: tạo Cauchy MDS matrix, sinh round constants đơn giản, áp đủ three-phase (full → partial → full). Bọc trong sponge mode để hash list field elements. Output phải ổn định.

---

### E3.2 ★★★ — Verify test vector BN254

Implement hoặc dùng thư viện để tính Poseidon hash trên BN254 ($t = 3$, $\alpha = 5$, $R_F = 8$, $R_P = 57$) với đúng round constants từ circomlib. Verify kết quả của `Poseidon([1, 2])` khớp với test vector chuẩn `0x115cc0f5e7d690413df64c6b9662e9cf2a3617f2743245519e19607a4417189a`. Nếu không khớp, tìm xem sai ở đâu (round constants? S-box? output index?).

---

### E3.3 ★★★ — Poseidon2 vs Poseidon: đo constraint savings

Implement Poseidon2 cho $t = 3$ trên BN254: external rounds dùng MDS full, internal rounds dùng $M_I$ sparse (chỉ cộng một scalar vào state[0]). Đếm số phép nhân field cho cả hai. In ra phần trăm tiết kiệm của Poseidon2 so với Poseidon gốc.

---

## Lab 4 — Rescue & Rescue-Prime `[L07]`

### E4.1 ★★★ — Implement Rescue-XLIX

Implement Rescue permutation với forward S-box ($x^\alpha$) và inverse S-box ($x^{\alpha^{-1}}$) xen kẽ, trên $\mathbb{F}_{65537}$, $t = 2$, $\alpha = 3$, đủ $R = 14$ rounds. Mỗi round gồm: S-box, MDS, add round constants, inverse S-box, MDS, add round constants. Tính $\alpha^{-1} \pmod{p-1}$ trước bằng extended Euclidean.

---

### E4.2 ★★ — AIR constraint formulation

Từ implementation Rescue ở E4.1, viết lại round transition dưới dạng **polynomial constraints** dùng trong AIR: thay vì compute $y = x^{\alpha^{-1}}$ trực tiếp, formulate constraint theo chiều ngược $y^\alpha = x$. Verify rằng với mọi $(x, y)$ đúng từ implementation, constraint polynomial bằng 0.

---

## Lab 5 — Thế hệ mới `[L08]`

### E5.1 ★★★ — Implement Flystel (Anemoi S-box)

Implement Flystel open với $\beta = 5$, $\gamma = 1$ trên $\mathbb{F}_{65537}$: nhận $(x, y)$, output $(u, v)$ theo đúng công thức. Verify tính chất permutation: mọi input phân biệt cho output phân biệt. Đếm số phép nhân field cho một Flystel call.

---

### E5.2 ★★ — Bảng so sánh tự tổng hợp

Viết script Python đọc từ dict cấu hình (tự điền từ spec papers) và in ra bảng so sánh 6 hash functions (MiMC, Poseidon, Rescue-Prime, Anemoi, Griffin, Reinforced Concrete) theo: loại S-box, trường hỗ trợ, ước tính R1CS constraints/hash, phù hợp SNARK hay STARK, issue đã biết. Chạy được mà không cần network.

---

## Lab 6 — Algebraic Cryptanalysis `[L09, L10]`

### E6.1 ★★ — Degree growth tracer

Viết SageMath script simulate degree tăng qua các rounds của Poseidon: mỗi element được represent bằng degree integer. Sau mỗi round (S-box + MDS), in degree của mọi state element. Chạy với $\alpha = 3$ và $\alpha = 5$, so sánh tốc độ degree saturation. Kết luận xem bao nhiêu rounds thì degree vượt $2^{128}$.

---

### E6.2 ★★★ — Interpolation attack trên reduced MiMC

Implement Lagrange interpolation trên $\mathbb{F}_{101}$ (dùng SageMath polynomial ring). Chạy MiMC với 3 rounds (reduced), thu thập đủ input-output pairs, interpolate polynomial $P(x)$. Dùng $P$ để predict output cho input mới mà không biết key. Sau đó thử với 15 rounds — verify attack breaks down (degree $3^{15} \gg 101$).

---

### E6.3 ★★★ — Gröbner basis demo

Dùng SageMath: model 2 rounds MiMC trên $\mathbb{F}_{17}$ như một hệ polynomial equations với key $k$ là ẩn. Cho thêm 2 known plaintext-ciphertext pairs. Tính Gröbner basis của hệ này và recover $k$. In thời gian tính với 2 vs 3 rounds để thấy độ phức tạp tăng theo lũy thừa.

---

## Lab 7 — MDS Matrix `[L11]`

### E7.1 ★★ — MDS verifier tổng quát

Viết SageMath function nhận vào ma trận bất kỳ và xác minh MDS property bằng cách kiểm tra determinant của mọi submatrix vuông. Test với: Cauchy matrix $t=2,3,4$; ma trận identity (không MDS nếu $t>1$); ma trận Poseidon BN254 $t=3$ từ circomlib.

---

### E7.2 ★★ — Branch number calculator

Viết SageMath function tính branch number của một linear layer bằng brute-force trên $\mathbb{F}_p$ nhỏ: duyệt mọi input vector khác 0, tính $\text{wt}(x) + \text{wt}(Mx)$, lấy min. Verify rằng MDS matrix luôn cho branch number = $t + 1$. Test với Cauchy $t=3$ và một ma trận non-MDS bất kỳ.

---

### E7.3 ★★★ — Weak MDS configuration detector

Viết script nhận vào một Circulant matrix specification (list coefficients) và trường $p$, kiểm tra:
(1) có phải MDS không,
(2) nếu $p$ thay đổi (ví dụ dùng nhầm Goldilocks thay vì BN254), MDS property có còn giữ không.
Chạy với coefficients của Poseidon2 $M_I = [2, 1, 1]$ trên cả BN254 và $\mathbb{F}_{2^{64} - 2^{32} + 1}$.

---

## Lab 8 — Circuit Bugs `[L12]`

### E8.1 ★★ — Hunt bugs bằng Circomspect

Viết file `buggy.circom` chứa 4 templates: một dùng `<--` thay vì `<==`, một thiếu equality constraint giữa computed hash và public input, một range check bị missing cho input supposed-to-be-bit, một component output không được constrain. Chạy `circomspect buggy.circom` và verify nó flag đúng 4 issues. Sau đó sửa và chạy lại — phải clean.

---

### E8.2 ★★★ — Build Merkle proof circuit

Viết Circom circuit `merkle_proof.circom` depth = 3: nhận leaf, root (public), path elements và path indices; tính lại root từ leaf bằng Poseidon hash tại mỗi level; enforce computed root bằng public root. Compile, generate witness cho một Merkle tree 8 lá hợp lệ, verify. Sau đó thử witness với root sai — phải fail.

---

### E8.3 ★★★★ — Soundness exploit demo

Lấy circuit buggy từ E8.1 (loại thiếu constraint giữa hash output và public input). Viết Python script dùng snarkjs: generate proof với `preimage = 999` nhưng `claimed_hash = 0` (hoàn toàn sai). Nếu circuit underconstrained, proof phải verify thành công — đây là soundness bug. Document kết quả.

---

## Lab 9 — Implementation & Integration Bugs `[L13]`

### E9.1 ★★ — Frozen Heart demo

Implement toy Schnorr proof (interactive) và chuyển sang non-interactive bằng Fiat-Shamir. Implement hai phiên bản: một hash challenge đúng (`H(g, pk, A)`), một hash thiếu commitment A (`H(g, pk)`). Với phiên bản thiếu A, viết adversary forge proof không biết secret key. Verify forge thành công.

---

### E9.2 ★★ — Hash-to-field endianness bug

Implement hai functions hash-to-field từ SHA-256 output: một big-endian, một little-endian. Cho cùng một SHA-256 output, compute cả hai field elements. Viết một scenario cụ thể: một bên (prover) dùng BE, một bên (verifier) dùng LE — proof generation thành công nhưng verification fail. Logging rõ ràng từng bước.

---

### E9.3 ★★★ — Domain separation failure exploit

Implement một protocol đơn giản: Poseidon dùng chung cho `leaf_hash(v)` và `nullifier(k)` không có domain tag. Viết adversary chọn $v = k$ và exploit: cùng một call to Poseidon serve cả hai purpose. Sau đó fix bằng domain tag và verify exploit không còn hoạt động.

---

### E9.4 ★★★ — Spec mismatch: rounds vs implementation

Implement Poseidon hai lần: lần 1 dùng đúng $R_P = 57$ (BN254 $t=3$ spec), lần 2 dùng $R_P = 56$ (off-by-one). So sánh output của mọi test vector — phải khác hoàn toàn. Viết automated test suite detect mismatch này bằng cách compare với circomlib reference output.

---

## Lab 10 — Audit Pipeline `[L14]`

### E10.1 ★★ — Automated parameter audit script

Viết script Python nhận một JSON file mô tả một ZK hash instance (loại hash, trường, tham số) và in report với severity labels. Phải detect đủ: alpha không coprime với $p-1$, rounds dưới minimum, MiMC rounds không đủ cho 128-bit, domain separation không có. Test với 5 instances: 2 đúng, 3 sai theo các lỗi khác nhau.

---

### E10.2 ★★★ — Test vector harness

Viết test harness tự động verify implementation của mình (MiMC từ E2.1, Poseidon từ E3.2) khớp với một tập test vectors chuẩn. Harness phải: load test vectors từ JSON, chạy từng case, so sánh output, in pass/fail với diff nếu fail. Bao gồm ít nhất 6 test vectors (khác inputs, khác t, khác trường).

---

### E10.3 ★★★★ — End-to-end audit: tìm bug trong circuit cho sẵn

Viết và compile circuit sau (đã cố ý đặt bugs), sau đó dùng toàn bộ pipeline: Circomspect, MockProver pattern (bằng cách thử witnesses hợp lệ và không hợp lệ), manual parameter review:

```
Circuit: NullifierCheck
- Input: secret_key (private), nullifier (public)
- Logic: tính Poseidon([secret_key]) và enforce bằng nullifier
- Bug 1: dùng alpha=3 (invalid trên BN254)
- Bug 2: output assignment dùng <-- thay vì <==
- Bug 3: nullifier không được domain-tagged
```

Viết báo cáo ngắn theo bug report template từ L14: title, severity, PoC, fix.

---

*Xem thêm tài nguyên học tập tại [[a5-further-reading|A5. Further Reading]].*
