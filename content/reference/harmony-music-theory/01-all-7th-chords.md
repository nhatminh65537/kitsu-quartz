---
title: "01. All 7th Chords — Từ Triad Đến Seventh"
tags: [music-theory, harmony, chords, lesson-01]
aliases: [All 7th Chords]
created: 2026-03-25
---

> **Prerequisites**: Biết 4 loại triad (major, minor, diminished, augmented), intervals cơ bản (major/minor/diminished 3rd, perfect 5th), khái niệm half step và whole step
> **Objectives**:
> - Nắm công thức interval của 6 loại seventh chord quan trọng
> - Nghe và phân biệt màu sắc âm thanh của từng loại
> - Đọc và viết ký hiệu jazz (Cmaj7, Cm7, C7, Cm7b5, Cdim7, CmMaj7)
> - Biết ít nhất 1 voicing guitar cho mỗi loại trên dây chuẩn

---

## Motivation

Bạn đã biết triads — ba nốt xếp chồng thành hợp âm. Nhưng nếu nghe nhạc Jazz, Bossa Nova, hay bất kỳ bản nhạc Classical nào có chiều sâu, bạn sẽ nhận ra âm thanh phong phú hơn nhiều so với ba nốt đơn giản. Bí mật? **Seventh chord (hợp âm quãng bảy)** — thêm một nốt thứ tư lên trên triad, tạo ra màu sắc hòa âm hoàn toàn khác nhau.

So sánh nghe thử:

```abc
X:1
T:Triad vs Seventh Chord
M:4/4
L:1/4
Q:72
K:C
[CEG]4 | [CEGb]4 |]
```

Hợp âm đầu (C major triad) nghe "hoàn chỉnh" và đóng lại. Hợp âm sau (Cmaj7) nghe "mở", có chiều sâu — nó *muốn* đi tiếp, hoặc chỉ đứng đó mà đã đẹp theo cách riêng. Đó là quyền năng của seventh chord.

Trong bài này, mình sẽ xây dựng **6 loại seventh chord cốt lõi** từ công thức interval, học cách nghe sự khác biệt, rồi đưa chúng lên guitar.

---

## Concept / Theory

### Cách xây dựng Seventh Chord

Một seventh chord (hợp âm quãng bảy) = **Triad + thêm 1 nốt cách root 1 quãng bảy (seventh)**. Có hai biến thể của seventh:

> [!definition] Definition 1.1 — Hai loại Seventh Interval
> - **Major seventh (M7)**: cách root 11 half steps (1 half step dưới octave)
> - **Minor seventh (m7)**: cách root 10 half steps (2 half steps dưới octave)
> - **Diminished seventh (d7)**: cách root 9 half steps (bằng major sixth enharmonically)

Kết hợp 3 loại triad (major, minor, diminished) × 3 loại seventh → ta có nhiều tổ hợp, nhưng chỉ **6 loại** xuất hiện thường xuyên trong thực tế:

---

### 6 Loại Seventh Chord

#### 1. Major 7th — Cmaj7 (hay CM7, CΔ7)

> [!definition] Definition 1.2 — Major Seventh Chord
> **Công thức**: Major triad + Major seventh
> **Intervals từ root**: 1 — M3 — P5 — M7
> **Nốt trong C**: C — E — G — B
> **Màu sắc**: Sáng, ấm, "dreamy", stable. Cảm giác home nhưng có chiều sâu.

```abc
X:2
T:Cmaj7 — xây dựng từng bước
M:4/4
L:1/4
Q:60
K:C
C E G B | [CEGc] [CEGB] z2 |]
```

Dùng phổ biến nhất: I chord trong nhạc Jazz và Pop, tất cả bài Bossa Nova (*The Girl from Ipanema* mở đầu bằng Fmaj7).

---

#### 2. Dominant 7th — C7

> [!definition] Definition 1.3 — Dominant Seventh Chord
> **Công thức**: Major triad + Minor seventh
> **Intervals từ root**: 1 — M3 — P5 — m7
> **Nốt trong C**: C — E — G — B♭
> **Màu sắc**: Căng thẳng, "muốn giải quyết" về tonic. Là chord quan trọng nhất trong harmony.

```abc
X:3
T:C7 — Major triad + flat 7
M:4/4
L:1/4
Q:60
K:C
C E G _B | [CEG_B] z z2 |]
```

Đây là chord **tension** số một trong hòa âm Tây phương. Trong Classical: V7 luôn resolve về I. Trong Blues: cả I, IV, V đều dùng dominant 7th — tạo ra màu sắc "bluesy" đặc trưng.

---

#### 3. Minor 7th — Cm7

> [!definition] Definition 1.4 — Minor Seventh Chord
> **Công thức**: Minor triad + Minor seventh
> **Intervals từ root**: 1 — m3 — P5 — m7
> **Nốt trong C**: C — E♭ — G — B♭
> **Màu sắc**: Tối, mượt mà, "cool". Ít căng hơn dominant 7th, stable hơn Cmaj7 theo một nghĩa khác.

```abc
X:4
T:Cm7 — Minor triad + flat 7
M:4/4
L:1/4
Q:60
K:C
C _E G _B | [C_EG_B] z z2 |]
```

Dùng phổ biến nhất: ii chord trong Jazz (ii–V–I), vi chord trong Pop. Gần như mọi bài Jazz standard đều có Cm7 hoặc các minor 7th khác.

---

#### 4. Half-Diminished — Cm7♭5 (hay Cø7)

> [!definition] Definition 1.5 — Half-Diminished Seventh Chord
> **Công thức**: Diminished triad + Minor seventh
> **Intervals từ root**: 1 — m3 — d5 — m7
> **Nốt trong C**: C — E♭ — G♭ — B♭
> **Màu sắc**: Tối, bất ổn, "melancholic". Căng hơn m7 nhưng khác loại với dim7.

```abc
X:5
T:Cm7b5 — Half-diminished
M:4/4
L:1/4
Q:60
K:C
C _E _G _B | [C_E_G_B] z z2 |]
```

Dùng phổ biến nhất: ii chord trong minor key (iiø7–V7–i). Ví dụ trong Dm: Em7♭5 → A7 → Dm. Rất đặc trưng trong nhạc Flamenco và Tango.

---

#### 5. Fully Diminished 7th — Cdim7 (hay C°7)

> [!definition] Definition 1.6 — Fully Diminished Seventh Chord
> **Công thức**: Diminished triad + Diminished seventh
> **Intervals từ root**: 1 — m3 — d5 — d7 (= M6 enharmonically)
> **Nốt trong C**: C — E♭ — G♭ — B𝄫 (= A)
> **Màu sắc**: Rất tối, dramatic, căng thẳng tối đa. Symmetric hoàn toàn — mỗi nốt cách nhau đúng 3 half steps.

```abc
X:6
T:Cdim7 — Fully diminished (symmetric)
M:4/4
L:1/4
Q:60
K:C
C _E _G _A | [C_E_GA] z z2 |]
```

Tính chất đặc biệt: dim7 có **tính đối xứng hoàn toàn** — mọi inversion (đảo thế) đều là một dim7 chord khác. Cdim7 = E♭dim7 = G♭dim7 = Adim7! Điều này làm cho nó cực kỳ linh hoạt trong modulation.

---

#### 6. Minor-Major 7th — CmMaj7 (hay Cm△7)

> [!definition] Definition 1.7 — Minor-Major Seventh Chord
> **Công thức**: Minor triad + Major seventh
> **Intervals từ root**: 1 — m3 — P5 — M7
> **Nốt trong C**: C — E♭ — G — B
> **Màu sắc**: Kỳ lạ, bí ẩn, "ominous". Cực kỳ đặc trưng — vừa tối (minor) vừa sáng (major 7th) cùng lúc.

```abc
X:7
T:CmMaj7 — Minor triad + Major 7th
M:4/4
L:1/4
Q:60
K:C
C _E G B | [C_EGB] z z2 |]
```

Dùng phổ biến nhất: i chord trong minor key harmonic context, đặc biệt khi muốn màu sắc dramatic. Piazzolla và phim noir dùng nhiều. James Bond theme nổi tiếng với vòng **i → iM7 → i7 → i6** (descending major 7th line).

---

### Bảng Tổng Hợp

| Ký hiệu | Tên | Triad | 7th | Intervals | Màu sắc |
|---------|-----|-------|-----|-----------|---------|
| Cmaj7 / CΔ7 | Major 7th | Major | Major | 1–M3–P5–M7 | Sáng, ấm, stable |
| C7 | Dominant 7th | Major | Minor | 1–M3–P5–m7 | Căng, muốn resolve |
| Cm7 | Minor 7th | Minor | Minor | 1–m3–P5–m7 | Tối, mượt, cool |
| Cm7♭5 / Cø7 | Half-diminished | Diminished | Minor | 1–m3–d5–m7 | Tối, melancholic |
| Cdim7 / C°7 | Fully diminished | Diminished | Diminished | 1–m3–d5–d7 | Dramatic, symmetric |
| CmMaj7 / Cm△7 | Minor-Major 7th | Minor | Major | 1–m3–P5–M7 | Bí ẩn, ominous |

---

## Musical Examples

### So sánh cả 6 loại từ cùng root C

```abc
X:8
T:6 Seventh Chords — So sanh tu root C
M:4/4
L:1/2
Q:60
K:C
"Cmaj7"[CEGB]2 | "C7"[CEG_B]2 | "Cm7"[C_EG_B]2 | "Cm7b5"[C_E_G_B]2 | "Cdim7"[C_E_GA]2 | "CmMaj7"[C_EGB]2 |]
```

### Ví dụ thực tế — James Bond Theme (i → imaj7 → i7 → i6)

Đây là cách CmMaj7 được dùng trong thực tế — một đường bass đi xuống trong khi root giữ nguyên:

```abc
X:9
T:James Bond — Minor line cliche (key Em)
M:4/4
L:1/4
Q:100
K:Emin
V:1 name="Melody/Chord"
"Em"[EGB]2 "EmMaj7"[EG^AB]2 | "Em7"[EGBd]2 "Em6"[EGB^c]2 |]
V:2 name="Bass"
E,2 ^D,2 | D,2 ^C,2 |]
```

*Chú ý*: phần bass đi xuống E → D# → D → C# trong khi chord trên giữ nguyên structure — đây gọi là **descending chromatic bass line**, một trong những pattern đẹp nhất trong hòa âm.

### Ví dụ Jazz — ii–V–I với 7th chords trong C major

```abc
X:10
T:ii-V-I Jazz Progression — C major
M:4/4
L:1/2
Q:100
K:C
"Dm7"[DFAC]2 | "G7"[GBdf]2 | "Cmaj7"[cegb]2 | z2 |]
```

Đây là vòng chord xuất hiện nhiều nhất trong toàn bộ lịch sử Jazz. Bạn sẽ học chi tiết về ii–V–I ở Lesson 12, nhưng hãy nghe màu sắc của từng chord ngay bây giờ:
- **Dm7** (ii): tối, chuyển động, chuẩn bị
- **G7** (V): căng thẳng, muốn về nhà
- **Cmaj7** (I): resolve, ấm áp, home

---

## Guitar Application

### Cách đọc diagram dưới đây

```
Frets:  1   2   3   4   5
        |---|---|---|---|---|
e  ──── | x | x | x | x | x |   ← high e string (1st)
B  ──── | x | x | x | x | x |
G  ──── | x | x | x | x | x |
D  ──── | x | x | x | x | x |
A  ──── | x | x | x | x | x |
E  ──── | x | x | x | x | x |   ← low E string (6th)

● = nhấn, ○ = dây buông, x = không gảy
```

---

### Cmaj7 (root C, dây A string)

Nốt: C — E — G — B

```
e  ── x
B  ── 0  (B — maj7)
G  ── 0  (G — 5th)
D  ── 2  (E — 3rd)
A  ── 3  (C — root)
E  ── x
```

---

### G7 (Dominant 7th — dây mở, rất phổ biến)

Nốt: G — B — D — F

```
Dạng open:               Jazz compact (no root):
e  ── 1  (F — m7th)      e  ── 1  (F — m7th)
B  ── 0  (B — 3rd)       B  ── 0  (B — 3rd)
G  ── 0  (G — root)      G  ── 0  (G — root)
D  ── 0  (D — 5th)       D  ── 0  (D — 5th)
A  ── 2  (B — 3rd)       A  ── x
E  ── 3  (G — root)      E  ── x
```

---

### Dm7 (Minor 7th — dây mở, hoàn chỉnh nhất)

Nốt: D — F — A — C

```
e  ── 1  (F — m3)
B  ── 1  (C — m7)
G  ── 2  (A — 5th)
D  ── 0  (D — root)
A  ── x
E  ── x
```

---

### Em7♭5 (Half-diminished)

Nốt: E — G — B♭ — D

```
e  ── 0  (E — root)
B  ── 3  (D — m7)
G  ── 3  (B♭ — d5)
D  ── 2  (G — m3... wait, G là m3 của E? E→G = m3 ✓)
A  ── x
E  ── 0  (E — root)
```

> [!note] Lưu ý Guitar
> m7♭5 và dim7 ít gặp ở open position. Ở giai đoạn này hãy tập nhận biết **âm thanh** trước. Appendix A3 (Guitar Chord Voicing Library) sẽ có đầy đủ closed-position voicings cho tất cả chord types.

---

### Cdim7 (Fully Diminished — lợi dụng tính symmetric)

Nốt: C — E♭ — G♭ — A (= B𝄫 enharmonic)

```
Shape dim7 tại fret 2 (= Cdim7 hoặc E♭dim7):
e  ── 2  (E♭ = m3 nếu root C♯, hoặc root E♭)
B  ── 1  (C — root hoặc M6)
G  ── 2  (A — d7 = M6)
D  ── 3  (F — d5 nếu root B)
A  ── x
E  ── x
```

**Mẹo**: Học 1 dim7 shape → trượt lên **3 frets** = dim7 khác. Vì dim7 symmetric, chỉ có 3 shape duy nhất cover toàn bộ 12 root!

---

### CmMaj7 (Minor-Major 7th, root C trên A string)

Nốt: C — E♭ — G — B

```
e  ── 3  (G — 5th)
B  ── 4  (E♭ — m3)
G  ── 5  (C — root... double)
D  ── 5  (G — 5th... double)
A  ── 3  (C — root)
E  ── x
```

---

## Practice

> [!example] Bài tập 1.1 — Nhận diện bằng tai
> Nghe (hoặc chơi) lần lượt 6 chord ở phần *Musical Examples* (X:8). Với mỗi chord, hãy mô tả màu sắc bằng từ ngữ của riêng bạn trước khi đọc mô tả trong bài. Mục tiêu: bạn có thể mô tả sự khác biệt giữa Cmaj7 và Cm7 chỉ bằng tai.

> [!example] Bài tập 1.2 — Xây dựng từ công thức
> Với mỗi root sau, xây đủ 6 loại seventh chord bằng cách đếm half steps:
> - Root **G**: Gmaj7, G7, Gm7, Gm7♭5, Gdim7, GmMaj7
> - Root **F**: Fmaj7, F7, Fm7, Fm7♭5, Fdim7, FmMaj7
> - Root **D**: Dmaj7, D7, Dm7, Dm7♭5, Ddim7, DmMaj7
>
> Kiểm tra: Bbm7♭5 có những nốt gì? (Đáp án cuối bài)

> [!example] Bài tập 1.3 — Guitar
> Bấm và so sánh 3 chord sau theo thứ tự liên tiếp:
> 1. Dm (open) → Dm7 (open) → nghe sự khác biệt
> 2. G (open) → G7 (open) → nghe sự khác biệt
> Câu hỏi: thêm seventh vào triad thay đổi cảm giác chord như thế nào?

> [!example] Bài tập 1.4 — Nhận diện ký hiệu
> Đọc các chord symbol sau và nói nhanh loại của từng chord:
> Fmaj7 — Bb7 — Gm7 — Bø7 — F#°7 — AbmMaj7 — Em7 — D7

---

## Summary / Key Takeaways

- **6 loại seventh chord cốt lõi**: Maj7, Dom7 (7), m7, m7♭5 (ø), dim7 (°), mMaj7
- **Chìa khóa**: Seventh chord = Triad + thêm M7 hoặc m7 hoặc d7 — chỉ có 3 biến thể của seventh interval
- **Dominant 7th** (X7) là chord căng thẳng nhất, luôn muốn resolve — đây là động lực cốt lõi của harmony
- **Dim7** có tính đối xứng hoàn toàn (mỗi nốt cách nhau 3 half steps) — 1 shape guitar = 4 chord
- **mMaj7** là chord kỳ lạ nhất — minor + major 7th — rất đặc trưng trong James Bond, Piazzolla, film noir

---

## Đáp án Bài tập 1.2

Bbm7♭5 (B♭ half-diminished) = **B♭ — D♭ — E (=F♭) — A♭**
Công thức: 1(B♭) → m3(D♭) → d5(E♭... wait, d5 của B♭ = E♮) → m7(A♭)
*Chú ý*: d5 của B♭ là **E♮** (vì P5 = F, giảm xuống 1 half step = E)

---

## References

- Walter Piston — *Harmony* (5th ed.), Ch. 4: Chords of the Seventh
- Mark Levine — *The Jazz Theory Book*, Ch. 1: Major Scale Harmony
- Jens Larsen — *Jazz Guitar Harmony* (jenslarsen.nl)
- Adam Neely — "Why does jazz use so many seventh chords?" (YouTube)
