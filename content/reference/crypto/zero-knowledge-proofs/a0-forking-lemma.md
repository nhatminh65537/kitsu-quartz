---
title: "A0. Forking Lemma — Formal Proof"
tags: [cryptography, zero-knowledge-proofs, zkp, forking-lemma, proof-of-knowledge, appendix]
aliases: [Forking Lemma]
created: 2026-03-13
---

> **Tham chiếu từ**: [[04-proof-of-knowledge|04. Proof of Knowledge & Knowledge Soundness]]
> **Mục đích**: Chứng minh đầy đủ Forking Lemma (Bellare-Neven 2006) và ứng dụng để phân tích knowledge soundness của Schnorr protocol.

---

## Bối Cảnh

Forking Lemma là công cụ kỹ thuật quan trọng trong cryptography, được dùng để phân tích:
- Knowledge soundness của Sigma protocols (đặc biệt Schnorr)
- Security của Fiat-Shamir transform trong Random Oracle Model
- Extraction trong multi-signature schemes

---

## General Forking Lemma (Bellare-Neven 2006)

### Setup

Gọi $\mathcal{A}$ là probabilistic algorithm (adversary) với:
- Input: $pk$ (public key, hay statement)
- Oracle access: Random Oracle $H: \{0,1\}^* \to \mathcal{C}$ (challenge space)
- Output: $(i, s_1, \ldots, s_n, h_i, \sigma)$ trong đó $i \in \{1, \ldots, q_H\}$ là index của query thứ $i$, $\sigma$ là "success output"

Gọi $\mathsf{acc}(\mathcal{A})$ là xác suất $\mathcal{A}$ thành công.

### Forking Algorithm

> [!definition] Definition A0.1 — Forking Algorithm $\mathsf{Fork}_\mathcal{A}$
>
> $\mathsf{Fork}_\mathcal{A}(pk)$:
> 1. Chọn random tape $\rho$ cho $\mathcal{A}$.
> 2. **Run 1**: Chạy $\mathcal{A}(pk; \rho)$ với random oracle $H_1$. Nếu fail → output $\bot$.
>    - Output của run 1: $(i, s_1, \ldots, s_n, h_i, \sigma_1)$ với $h_i = H_1(\text{query}_i)$.
> 3. **Run 2**: Chạy lại $\mathcal{A}(pk; \rho)$ với **cùng random tape** $\rho$ nhưng khác $H$ từ query $i$ trở đi.
>    - Cụ thể: $H_2$ agree với $H_1$ trên tất cả queries trước query $i$, nhưng $H_2(\text{query}_i) = h'_i \neq h_i$ (random).
>    - Output: $(i', s_1', \ldots, s_n', h'_{i'}, \sigma_2)$.
> 4. Nếu $i' = i$ và $h'_i \neq h_i$: output $(\sigma_1, \sigma_2, h_i, h'_i)$. Else: output $\bot$.

Điều kiện thành công: cả hai runs đều thành công **tại cùng query index $i$** nhưng với **challenge khác nhau**.

### Forking Lemma

> [!theorem] Theorem A0.2 — General Forking Lemma (Bellare-Neven 2006)
>
> Gọi $\text{acc} = \mathsf{acc}(\mathcal{A})$ là xác suất thành công của $\mathcal{A}$, và $q$ là số lượng random oracle queries tối đa của $\mathcal{A}$.
>
> Xác suất $\mathsf{Fork}_\mathcal{A}$ thành công (output khác $\bot$):
>
> $$\mathsf{frk} \geq \text{acc} \cdot \left(\frac{\text{acc}}{q} - \frac{1}{|\mathcal{C}|}\right)$$
>
> trong đó $|\mathcal{C}|$ là kích thước challenge space.

### Chứng Minh

> [!proof] Proof — Forking Lemma
>
> **Bước 1**: Phân tích Run 1.
>
> Gọi $I$ là random variable — index $i$ mà $\mathcal{A}$ output khi thành công.
> Xác suất $\mathcal{A}$ thành công (over $\rho$ và $H_1$): $\text{acc}$.
>
> Với mỗi giá trị $i \in \{1, \ldots, q\}$, gọi:
> $$\text{acc}_i = \Pr[\mathcal{A} \text{ succeeds and outputs index } i]$$
>
> Rõ ràng: $\sum_{i=1}^q \text{acc}_i = \text{acc}$.
>
> **Bước 2**: Run 2 thành công tại index $i$ khi nào?
>
> Run 2 dùng cùng $\rho$ nên chạy giống hệt Run 1 đến query $i$. Thành công tại $i$ khi:
> - $\mathcal{A}$ chạy với $H_2$ (khác $H_1$ từ query $i$) vẫn thành công **và** vẫn chọn index $i$.
>
> Vì $H_2$ bằng $H_1$ trước query $i$, execution giống hệt nhau đến đó. Xác suất Run 2 thành công tại $i$ (over $H_2(\text{query}_i) = h'_i$):
>
> $$\Pr[\text{Run 2 succeeds at } i \mid \text{Run 1 succeeds at } i] \geq \text{acc}_i - \frac{1}{|\mathcal{C}|}$$
>
> Lý do: conditional on Run 1 succeeds at $i$, Run 2 succeeds with probability $\geq \text{acc}_i$ (average over fresh $h'_i$). Trừ đi $1/|\mathcal{C}|$ để tính đến trường hợp $h'_i = h_i$ (fail collision check).
>
> **Bước 3**: Tính $\mathsf{frk}$.
>
> $$\mathsf{frk} = \sum_{i=1}^q \Pr[\text{both runs succeed at } i \text{ with different challenges}]$$
>
> $$\geq \sum_{i=1}^q \text{acc}_i \cdot \left(\text{acc}_i - \frac{1}{|\mathcal{C}|}\right)$$
>
> Áp dụng Cauchy-Schwarz (hoặc convexity argument):
>
> $$\sum_{i=1}^q \text{acc}_i^2 \geq \frac{1}{q}\left(\sum_{i=1}^q \text{acc}_i\right)^2 = \frac{\text{acc}^2}{q}$$
>
> Và $\sum_i \text{acc}_i / |\mathcal{C}| = \text{acc}/|\mathcal{C}|$. Do đó:
>
> $$\mathsf{frk} \geq \frac{\text{acc}^2}{q} - \frac{\text{acc}}{|\mathcal{C}|} \geq \text{acc} \cdot \left(\frac{\text{acc}}{q} - \frac{1}{|\mathcal{C}|}\right)$$
>
> $\blacksquare$

---

## Áp Dụng: Schnorr PoK

### Setup Schnorr

Với Schnorr protocol cho discrete log: prover biết $x$ sao cho $Y = g^x$.

Transcript: $(a = g^r, c, s = r + cx \bmod q)$ với $c = H(Y, a)$ trong Fiat-Shamir setting.

Adversary $\mathcal{A}$: forges một Schnorr signature — tạo $(a, c, s)$ hợp lệ mà không biết $x$.

### Extraction via Forking

> [!theorem] Theorem A0.3 — Schnorr Knowledge Soundness (ROM)
>
> Nếu adversary $\mathcal{A}$ forge Schnorr signature với xác suất $\text{acc}$ trong ROM, thì Forking Algorithm extract discrete log $x$ với xác suất:
>
> $$\mathsf{frk} \geq \text{acc} \cdot \left(\frac{\text{acc}}{q_H} - \frac{1}{|\mathcal{C}|}\right)$$
>
> trong đó $q_H$ là số ROM queries.

> [!proof] Proof
>
> Nếu Forking thành công: output $((a, c_1, s_1), (a, c_2, s_2))$ với cùng $a$ nhưng $c_1 \neq c_2$.
>
> Hai equations:
> $$g^{s_1} = Y^{c_1} \cdot a = Y^{c_1} \cdot g^r$$
> $$g^{s_2} = Y^{c_2} \cdot a = Y^{c_2} \cdot g^r$$
>
> Trừ (trong exponent):
> $$g^{s_1 - s_2} = Y^{c_1 - c_2} = g^{x(c_1 - c_2)}$$
>
> Vì $c_1 \neq c_2$, $c_1 - c_2 \neq 0 \pmod q$, suy ra:
>
> $$x = (s_1 - s_2)(c_1 - c_2)^{-1} \bmod q$$
>
> Extract $x$ thành công.
>
> $\blacksquare$

### Điều Kiện Thực Tế

Để extraction hiệu quả: $\text{acc} \gg q_H / |\mathcal{C}|$.

Ví dụ: $q_H = 2^{60}$ queries, $|\mathcal{C}| = 2^{256}$, $\text{acc} = 1/\text{poly}(\lambda)$:
- $\frac{\text{acc}}{q_H} - \frac{1}{|\mathcal{C}|} \approx \frac{\text{acc}}{q_H}$
- $\mathsf{frk} \approx \frac{\text{acc}^2}{q_H}$

Nếu $\text{acc}$ không negligible → $\mathsf{frk}$ không negligible → extractor thành công.

---

## Phiên Bản "Classic" (Pointcheval-Stern 1996)

Trước Bellare-Neven, version đầu tiên của Forking Lemma (Pointcheval-Stern 1996) xử lý đặc biệt cho signature schemes:

> [!theorem] Theorem A0.4 — Classic Forking Lemma (Pointcheval-Stern)
>
> Nếu adversary forge với xác suất $\varepsilon$ trong ROM với $q_H$ hash queries, thì trong thời gian $\approx 2 \cdot t/\varepsilon$, có thể extract witness với xác suất $\geq \varepsilon^2/(2q_H) - \varepsilon/(2|\mathcal{C}|)$.

Bound này yếu hơn Bellare-Neven nhưng dễ phân tích hơn cho specific schemes.

---

## Hạn Chế của Forking Lemma

> [!warning] Tightness Gap
>
> Forking Lemma có **tightness gap** — reduction mất một factor $\text{acc}/q$ (không tight):
> - Adversary thành công với xác suất $\varepsilon$
> - Extractor thành công với xác suất $\approx \varepsilon^2/q$
>
> Đây là vấn đề quan trọng khi chọn security parameters: nếu target $128$-bit security, cần size group lớn hơn để bù tightness gap.
>
> Multi-signature và ring signature analysis cũng bị ảnh hưởng tương tự.

---

## References

- Bellare, Neven — *Multi-Signatures in the Plain Public-Key Model and a General Forking Lemma* (2006) — CCS 2006
- Pointcheval, Stern — *Security Arguments for Digital Signatures and Blind Signatures* (1996) — EUROCRYPT 1996 (version đầu tiên)
- Schnorr — *Efficient Signature Generation by Smart Cards* (1991) — Journal of Cryptology
- Boneh, Shoup — *A Graduate Course in Applied Cryptography*, Ch. 19 (toc.cryptobook.us)
