---
title: "01. R1CS → Groth16 Bridge"
tags: [crypto, groth16, zksnark, r1cs, lesson-01]
aliases: [R1CS Groth16 Bridge]
created: 2026-03-12
---

> **Prerequisites**: Biết R1CS là gì (wire, gate, witness vector), biết finite field, biết elliptic curve scalar multiplication cơ bản
> **Objectives**:
> - Hiểu Groth16 nhìn R1CS theo cách nào khác với định nghĩa thông thường
> - Phân biệt public input vs private witness và tại sao sự phân chia này quan trọng trong Groth16
> - Hiểu homomorphic hiding của R1CS constraints — nền tảng cho CRS
> - Chuẩn bị ký hiệu matrix notation sẽ dùng xuyên suốt các lesson

---

## Tại sao bài này tồn tại

Bạn đã biết R1CS. Nhưng Groth16 không chỉ đơn giản là "take R1CS rồi prove". Groth16 có một cách nhìn rất cụ thể về cấu trúc R1CS — đặc biệt là cách **tách witness**, cách **encode constraints vào polynomials**, và cách **hide toàn bộ computation vào group elements** mà không lộ witness.

Bài này trả lời câu hỏi: *R1CS phải có format gì để Groth16 hoạt động được?*

---

## R1CS theo con mắt của Groth16

### Định nghĩa lại R1CS (Groth16 notation)

> [!definition] Definition 1.1 — R1CS Instance (Groth16 form)
> Cho trường hữu hạn $\mathbb{F}_p$. Một R1CS instance bao gồm:
> - Ba ma trận $A, B, C \in \mathbb{F}_p^{m \times n}$ với $m$ là số constraints, $n$ là số wires
> - Một **witness vector** $\mathbf{z} \in \mathbb{F}_p^n$
>
> R1CS thỏa mãn nếu và chỉ nếu:
>
> $$(A\mathbf{z}) \circ (B\mathbf{z}) = C\mathbf{z}$$
>
> trong đó $\circ$ là phép nhân element-wise (Hadamard product).
>
> Quy ước bắt buộc: $z_0 = 1$ (phần tử đầu tiên của witness luôn là 1).

Ký hiệu $(A\mathbf{z})_i$ nghĩa là dot product của hàng $i$ của $A$ với $\mathbf{z}$, tức là giá trị "left wire" của gate $i$.

### Witness split — điểm khác biệt cốt lõi

Đây là chỗ Groth16 **thêm một yêu cầu** mà R1CS generic không có:

> [!definition] Definition 1.2 — Witness Split trong Groth16
> Witness vector $\mathbf{z}$ được chia thành hai phần:
>
> $$\mathbf{z} = (1, \underbrace{z_1, \ldots, z_\ell}_{\text{public inputs } \mathbf{x}}, \underbrace{z_{\ell+1}, \ldots, z_m}_{\text{private witness } \mathbf{w}})$$
>
> - $\mathbf{x} = (z_1, \ldots, z_\ell)$: **public inputs** — verifier biết
> - $\mathbf{w} = (z_{\ell+1}, \ldots, z_m)$: **private witness** — chỉ prover biết

**Tại sao split này quan trọng?** Vì trong verifier equation của Groth16, public inputs và private witness sẽ được xử lý hoàn toàn khác nhau:
- Public inputs đi vào verifier trực tiếp (verifier tự tính)
- Private witness được "nhúng" vào proof $[C]_1$ và không bao giờ lộ ra ngoài

### Minh họa: một circuit nhỏ

Xét bài toán: prover muốn chứng minh biết $x$ sao cho $x^3 + x + 5 = 35$ (tức là $x = 3$) mà không tiết lộ $x$.

Đặt intermediate wires: $v_1 = x \cdot x = x^2$, $v_2 = v_1 \cdot x = x^3$.

Constraints:
1. $x \cdot x = v_1$
2. $v_1 \cdot x = v_2$  
3. $(v_2 + x + 5) \cdot 1 = \text{out}$ (với out = 35 là public)

Witness: $\mathbf{z} = (1, \underbrace{35}_{\text{public: out}}, \underbrace{3, 9, 27}_{\text{private: } x, v_1, v_2})$

Indices: $z_0=1, z_1=35$ (public, $\ell=1$), $z_2=3, z_3=9, z_4=27$ (private).

Ma trận R1CS cho 3 constraints này:

$$A = \begin{pmatrix} 0 & 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 & 0 \\ 0 & 0 & 1 & 0 & 1 \end{pmatrix}, \quad B = \begin{pmatrix} 0 & 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 & 0 \\ 5 & 0 & 0 & 0 & 0 \end{pmatrix}$$

*(Hàng 3 của $B$ encode constant $5 \cdot z_0 = 5$)*

---

## Từ R1CS đến "Committed R1CS" — Groth16 cần gì thêm

### Vấn đề của R1CS thuần túy

Nếu prover gửi thẳng $\mathbf{z}$ cho verifier thì không còn zero-knowledge. Groth16 giải quyết bằng cách **không bao giờ gửi $\mathbf{z}$** — thay vào đó gửi các **group commitments** của $\mathbf{z}$ được "trộn" vào QAP polynomials.

Nhưng để làm điều đó, Groth16 cần một dạng **homomorphic encoding** của R1CS:

> [!theorem] Theorem 1.3 — R1CS thỏa mãn $\Leftrightarrow$ QAP thỏa mãn
> Nếu $\mathbf{z}$ thỏa mãn R1CS, thì tồn tại polynomial $h(x)$ sao cho:
>
> $$A(x) \cdot B(x) - C(x) = h(x) \cdot t(x)$$
>
> trong đó $A(x) = \sum_i z_i A_i(x)$, $B(x) = \sum_i z_i B_i(x)$, $C(x) = \sum_i z_i C_i(x)$ là các QAP polynomials được tính từ $\mathbf{z}$.

Đây là "cầu nối" chính thức giữa R1CS và QAP. Bài 02 sẽ đào sâu vào $A_i(x), B_i(x), C_i(x)$ là gì. Bài này chỉ cần biết: **mỗi column $i$ của ma trận R1CS sinh ra một bộ 3 polynomials**, và $\mathbf{z}$ chính là vector hệ số để combine chúng.

### Vai trò của $z_0 = 1$

Tại sao Groth16 bắt buộc $z_0 = 1$? Hai lý do:

1. **Không cho $\mathbf{z} = \mathbf{0}$**: Nếu không có constraint này, $\mathbf{z} = \mathbf{0}$ trivially thỏa mãn mọi R1CS. $z_0 = 1$ loại bỏ degenerate solution này.

2. **Encode constants**: Các hằng số trong circuit (như $5$ trong ví dụ trên) được encode là hệ số của $z_0$ trong ma trận $A, B, C$. Nếu $z_0 \neq 1$ thì constraints sẽ sai.

---

## Liên hệ trực tiếp với CRS của Groth16

Sau khi QAP được xây dựng từ R1CS, Trusted Setup sẽ pre-compute và commit toàn bộ các QAP polynomials tại điểm bí mật $\tau$:

$$[\tau^0]_1, [\tau^1]_1, \ldots, [\tau^{n-1}]_1$$
$$[A_i(\tau)]_1, [B_i(\tau)]_1, [B_i(\tau)]_2, [C_i(\tau)]_1 \quad \text{cho mọi } i$$

Khi prover tính $[A]_1 = [\sum_i z_i A_i(\tau)]_1$, họ thực ra đang tính:

$$[A]_1 = \sum_i z_i \cdot [A_i(\tau)]_1$$

Đây là linear combination của các CRS elements — **prover không bao giờ biết $\tau$**, chỉ dùng precomputed points. Đây chính là lý do homomorphic hiding hoạt động.

> [!important] Key Insight
> Groth16 không cần prover biết $\tau$. Mọi computation của prover đều là **linear combinations** của CRS points. CRS chính là "phép chiếu" của R1CS/QAP vào group elements tại điểm $\tau$ ẩn.

---

## Phân biệt: Public inputs trong Groth16 vs các SNARK khác

Trong PLONK hay Halo2, public inputs được xử lý như một phần của polynomial commitment và verifier tự "absorb" chúng vào transcript. Trong Groth16:

- Public inputs $\mathbf{x} = (z_1, \ldots, z_\ell)$ được xử lý **riêng biệt** trong verification equation
- Verifier tự tính $\sum_{i=1}^{\ell} z_i \cdot [L_i(\tau)/\gamma]_1$ từ public inputs
- Phần này **không xuất hiện trong proof** $\pi = ([A]_1, [B]_2, [C]_1)$

Điều này có ý nghĩa quan trọng khi audit: **nếu public input binding bị broken, verifier có thể bị lừa chấp nhận proof với public inputs khác**.

---

## Summary

- R1CS trong Groth16 có thêm **witness split**: index $0 \ldots \ell$ là public, $\ell{+}1 \ldots m$ là private
- $z_0 = 1$ là bắt buộc — loại bỏ zero solution và encode constants
- R1CS thỏa mãn $\Leftrightarrow$ tồn tại $h(x)$ sao cho $A(x)B(x) - C(x) = h(x)t(x)$ — cầu nối sang QAP
- Groth16 prover làm việc với **linear combinations của CRS points** — không cần biết $\tau$
- Public inputs được verifier tính riêng, **không nằm trong proof**

---

## References

- Jens Groth — *On the Size of Pairing-based Non-interactive Arguments* (ePrint 2016/260), Section 3
- LambdaClass — *An overview of the Groth16 proof system* (blog.lambdaclass.com/groth16)
- Alin Tomescu — *Groth16* (alinush.github.io/groth16)
