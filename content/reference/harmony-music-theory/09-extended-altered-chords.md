---
title: "09. Extended Chords & Altered Dominants"
tags: [music-theory, harmony, extended-chords, altered-dominants, jazz, lesson-09]
aliases: [Extended Chords, Altered Dominants, Tensions]
created: 2026-03-25
---

> **Prerequisites**: [[01-all-7th-chords|01. All 7th Chords]], [[02-diatonic-harmony|02. Diatonic Harmony]], [[03-voice-leading|03. Voice Leading]] — 6 loại seventh chords, diatonic chords, guide tones
> **Objectives**:
> - Hiểu hệ thống extensions: 9th, 11th, 13th là gì và tại sao dùng
> - Phân biệt unaltered tensions (9, 11, 13) và altered tensions (b9, #9, #11, b13)
> - Nắm 5 loại altered dominant phổ biến: 7b9, 7#9, 7#11, 7b13, 7alt
> - Biết available tensions cho từng chord type
> - Voicings guitar thực tế cho extended và altered chords

---

## Motivation

Bạn đã biết G7 — G–B–D–F. Nhưng khi nghe Bill Evans chơi G7 trước Cmaj7, âm thanh đó phong phú hơn rất nhiều. Anh ấy đang chơi G7b9, hoặc G13, hoặc G7#9 — những chord có cùng "xương sống" là G7 nhưng thêm màu sắc phong phú ở trên.

```abc
X:1
T:G7 basic vs G7b9 — same function, different color
M:4/4
L:1/4
Q:80
K:C
"^G7"[GBdf]4 | "^Cmaj7"[CEGB]4 | "^G7b9"[GBd_a]4 | "^Cmaj7"[CEGB]4 |]
```

*G7* (G–B–D–F) vs *G7b9* (G–B–D–F–Ab): cùng resolve về Cmaj7, nhưng G7b9 nghe tối và căng hơn — rất đặc trưng Jazz minor và Flamenco.

Extensions và alterations không thay đổi chức năng của chord — chúng thêm **màu sắc (color) và độ căng (tension)**. Đây là ngôn ngữ của Jazz harmony.

---

## Concept / Theory

### Extensions là gì?

> [!definition] Definition 9.1 — Chord Extensions (Tensions)
> **Extensions** = các nốt tiếp theo sau 7th, xếp chồng theo thirds: **9th, 11th, 13th**.
>
> Về mặt khoảng cách: 9 = octave + 2nd, 11 = octave + 4th, 13 = octave + 6th.
>
> Về mặt pitch: cùng nốt với 2, 4, 6 — nhưng đặt ở octave cao hơn trong voicing.

```
Root – 3rd – 5th – 7th – 9th – 11th – 13th – (back to Root)
  C  –  E  –  G  –  B  –  D  –   F  –   A  –       C
```

> [!note] Omit quy tắc
> Trong thực tế: **5th thường bỏ** (ít tính cách nhất), root thường bỏ khi có bass riêng. Ưu tiên giữ: **3rd, 7th** (guide tones) + **extensions**.

---

### Hệ Thống Extensions Theo Chord Type

| Chord Type | Available Tensions (unaltered) | Available Tensions (altered) | Avoid |
|-----------|-------------------------------|----------------------------|-------|
| **Maj7** | 9, **#11**, 13 | — | ♮11 (clash với M3) |
| **m7** | 9, 11, 13 | — | M7 |
| **7 (dom)** | 9, 13 | **b9, #9, #11, b13** | ♮11 |
| **m7♭5** | 9, 11 | b13 | — |
| **dim7** | 9, 11, b13 | — | — |

> [!warning] Natural 11 trong Maj7
> **♮11 clash với M3** vì khoảng cách chỉ là half step (E và F trong Cmaj7). Dùng **#11** thay — tức là F# trong Cmaj7 — nghe đẹp hơn rất nhiều (Lydian color).

---

### Unaltered Extensions — 9th, 11th, 13th

#### 9th Chord

> [!definition] Definition 9.2 — Ninth Chords
> **Cmaj9** = Cmaj7 + M9 = C–E–G–B–D
> **Cm9** = Cm7 + M9 = C–Eb–G–Bb–D
> **C9** = C7 + M9 = C–E–G–Bb–D (dominant ninth)

```abc
X:2
T:9th chords — Cmaj9, Cm9, C9
M:4/4
L:1/4
Q:80
K:C
"^Cmaj9"[CEGBd]4 | "^Cm9"[C_EG_Bd]4 | "^C9"[CEG_Bd]4 |]
```

*Nhận xét*: cả ba đều có D (9th) nhưng chất lượng rất khác — Cmaj9 sáng và ấm, Cm9 tối và mượt, C9 căng và "jazzy".

---

#### 11th Chord

> [!definition] Definition 9.3 — Eleventh Chords
> **Cm11** = Cm9 + P11 = C–Eb–G–Bb–D–F (minor 11th — P11 hoàn toàn tự nhiên)
> **Cmaj7#11** = Cmaj7 + #11 = C–E–G–B–F# (major với #11 — Lydian color)
>
> *♮11 trên major/dominant chord*: clash với M3 — tránh dùng!

```abc
X:3
T:11th chords — Cm11 vs Cmaj7#11
M:4/4
L:1/4
Q:80
K:C
"^Cm11"[C_EG_Bdf]4 | "^Cmaj7#11"[CEGB^f]4 |]
```

*Cm11* nghe "So What" (Miles Davis) — chord điển hình cho modal Jazz.
*Cmaj7#11* nghe "dreamy", Lydian — đặc trưng Bill Evans, phim hoạt hình Pixar.

---

#### 13th Chord

> [!definition] Definition 9.4 — Thirteenth Chords
> **C13** = C9 + M13 = C–E–G–Bb–D–(F)–A (dominant 13th)
> **Cmaj13** = Cmaj9 + M13 = C–E–G–B–D–(F#)–A
>
> Trong thực tế, 13th chord thường bỏ 11th (clash): C13 = C–E–Bb–A (root, 3rd, b7, 13).

```abc
X:4
T:C13 — dominant 13th voicing
M:4/4
L:1/4
Q:80
K:C
"^C13"[CEa_B]4 | "^Fmaj7"[FAce]4 |]
```

*C13* (C–E–A–Bb): bỏ G và D, giữ guide tones (E, Bb) + 13th (A). Resolve tuyệt vời về F.

---

### Altered Dominants — Tensions Chromatic

Đây là phần đặc trưng nhất của Jazz harmony. Dominant chord có thể alter **cả 9th lẫn 5th**:

> [!definition] Definition 9.5 — Altered Tensions
>
> | Symbol | Interval | Nốt trong G7 | Màu sắc |
> |--------|----------|-------------|---------|
> | **b9** | m9 (b2 + octave) | Ab | Tối, tense, minor feel |
> | **#9** | A9 (#2 + octave) | A# (=Bb enharmonic) | "Hendrix chord", blues-rock |
> | **#11** | A11 (#4 + octave) | C# | Sáng, Lydian dominant |
> | **b13** | m13 (b6 + octave) | Eb | Tối, augmented feel |
>
> Khi chord có nhiều alterations cùng lúc → viết **7alt** (altered).

> [!note] #9 — "Hendrix Chord"
> E7#9 (E–G#–B–D–G) = chord mở đầu của *Purple Haze* (Jimi Hendrix). Cùng lúc có G# (M3) và G (♭9 enharmonic = #9) → tạo "clash" đặc trưng blues-rock.

---

#### G7b9 — Tối, Minor Context

```abc
X:5
T:G7b9 — dark, minor resolution
M:4/4
L:1/4
Q:80
K:C
"^iim7b5"[DF_Ac]4 | "^G7b9"[GBdf_a]4 | "^Cm7"[C_EG_B]4 |]
```

*G7b9* = iiø7–V7b9–i trong C minor. Ab (b9) là đặc trưng của harmonic minor — rất đặc trưng minor ii–V–i, Flamenco, Tango.

---

#### G7#9 — "Hendrix Chord"

```abc
X:6
T:G7#9 — blues-rock tension
M:4/4
L:1/4
Q:100
K:C
"^G7#9"[GBd^af]4 | "^Cmaj7"[CEGB]4 |]
```

*G7#9* (G–B–D–F–A#): A# clash với B (M3) tạo cảm giác "dirty", intense — đặc trưng Blues, Funk, và một số Jazz bebop.

---

#### G7#11 — Lydian Dominant

```abc
X:7
T:G7#11 — Lydian dominant, bright
M:4/4
L:1/4
Q:90
K:C
"^G7#11"[GBdf^c]4 | "^Cmaj7"[CEGB]4 |]
```

*G7#11* (G–B–D–F–C#): C# (#11 của G) = đặc trưng mode Lydian Dominant (4th mode của melodic minor). Rất phổ biến trong Jazz modern và Bossa Nova. Nghe "sáng" và "floating" hơn G7 thường.

---

#### G7alt — Full Altered

> [!definition] Definition 9.6 — 7alt Chord
> **7alt** = dominant 7 với tất cả tensions đều altered: b9, #9, #11/b5, b13.
>
> Scale tương ứng: **Altered scale** (= 7th mode của melodic minor, hay "Super Locrian").
>
> Ví dụ G7alt ≈ G–B–F–Ab–C (hoặc bất kỳ combination của altered tensions).

```abc
X:8
T:G7alt — maximum tension
M:4/4
L:1/4
Q:80
K:C
"^G7alt"[GB_af]4 | "^Cmaj7"[CEGB]4 |]
```

*G7alt* ở đây dùng Ab (b9) và không có 5th — tension cao nhất, resolve về Cmaj7 cực kỳ thỏa mãn.

---

### Available Tensions Cho Từng Chord — Quick Reference

> [!definition] Definition 9.7 — Available Tensions Summary
>
> **Dominant 7 (X7)**: `9, 13` (unaltered) hoặc `b9, #9, #11, b13` (altered) — tất cả đều dùng được
>
> **Major 7 (Xmaj7)**: `9, #11, 13` — tránh ♮11
>
> **Minor 7 (Xm7)**: `9, 11, 13` — tất cả natural đều OK
>
> **Half-dim (Xm7b5)**: `9, 11` — thêm b13 trong một số context
>
> Nguyên tắc: **tránh nốt nào tạo m2 (half step) với chord tone quan trọng** (3rd, M7).

---

## Musical Examples

### Miles Davis — *So What* (Modal Dm11)

*So What* mở đầu bằng chord Dm11 — điển hình cho modal Jazz, không dùng alteration:

```abc
X:9
T:So What — Dm11 quartal voicing
M:4/4
L:1/4
Q:90
K:Dmin
"^Dm11"[DGAcd]4 | "^Dm11"[DGAcd]4 | "^Ebm11"[_EF_G_B_d]4 | "^Dm11"[DGAcd]4 |]
```

*Dm11* voicing: D–A–G–C–D (quartal harmony — xếp chồng theo fourths thay vì thirds). Màu sắc open, timeless, không có tension cụ thể — đặc trưng modal Jazz.

---

### Herbie Hancock — *Maiden Voyage* (Maj7#11)

*Maiden Voyage* dùng Dmaj7#11 — Lydian color tạo cảm giác "floating" trên đại dương:

```abc
X:10
T:Maiden Voyage style — Maj7#11 voicings
M:4/4
L:1/4
Q:90
K:D
"^Dmaj7#11"[D^GA^c]4 | "^Dmaj7#11"[D^GA^c]4 | "^Fmaj7#11"[F^Bc^e]4 | "^Fmaj7#11"[F^Bc^e]4 |]
```

*Dmaj7#11* (D–G#–A–C#): G# = #11 của D, tạo Lydian color. Không có 3rd trong voicing — ambiguous, open.

---

### John Coltrane — *Giant Steps* (Altered Dominants)

*Giant Steps* sử dụng altered dominants liên tục trong chuỗi M3 modulations:

```abc
X:11
T:Giant Steps excerpt — chain of altered dominants
M:4/4
L:1/4
Q:120
K:B
"^Bmaj7"[B^D^FA]4 | "^D7"[D^FAc]4 | "^Gmaj7"[GBdF]4 | "^Bb7"[_BD_Ff]4 |]
```

D7 (V/G) và Bb7 (V/Eb... hoặc V/Bb) — mỗi chord là dominant 7 resolve về major chord cách nhau M3. Coltrane thường alter các dominant này (D7b9, Bb7#9) để tăng tension.

---

### Bossa Nova — *Girl from Ipanema* (G7#11)

```abc
X:12
T:Girl from Ipanema bridge — G7#11 tritone color
M:4/4
L:1/4
Q:120
K:F
"^Fmaj7"[FAce]4 | "^G7#11"[G=B^CD=F]4 | "^Fmaj7"[FAce]4 |]
```

*The Girl from Ipanema* (Jobim) dùng **G7#11** ở section B — G là tritone của Db, và #11 = C# tăng thêm "floating" quality. Đây là tritone substitution color (Lesson 13) nhưng âm thanh extension cũng tạo ra được.

---

## Guitar Application

### Extended Chord Voicings Thực Tế

Guitar không thể chơi đủ 7 nốt — cần **chọn lọc**: root (hoặc bỏ), guide tones (3rd + 7th), và 1–2 extensions.

> [!example] Guitar Practice 9.1 — Gmaj9 voicings
> ```
> Gmaj9 (fret 2-4, root G string 6):
> e  ── 2  (A — 9th!)
> B  ── 3  (D — 5th)
> G  ── 4  (B — 3rd)
> D  ── 5  (G — root... double)
> A  ── x
> E  ── 3  (G — root)
>
> Compact version (no root, no 5th):
> e  ── 2  (A — 9th)
> B  ── 0  (B — 3rd)
> G  ── 0  (G... wait, B string open = B = 3rd of G ✓)
> D  ── 0  (D — 5th)
> A  ── x
> E  ── 3  (G — root)
> ```

> [!example] Guitar Practice 9.2 — G7b9 (dim shape trên dom)
> G7b9 = G–B–F–Ab
> ```
> e  ── x
> B  ── 4  (Ab — b9!)
> G  ── 3  (Bb... wait, Bb không phải của G7b9)
>
> Dùng dim7 shape trên top của G7:
> Lấy B dim7 (= G7b9 không root): B–D–F–Ab
> e  ── 4  (Ab — b9)
> B  ── 3  (G... hmm)
>
> Shape thực tế G7b9 (root G, A string):
> e  ── x
> B  ── 4  (Ab — b9)
> G  ── 4  (B — 3rd)
> D  ── 5  (G — root double, hoặc F = b7)
> A  ── 5  (D — 5th, optional)
> E  ── 3  (G — root)
> ```

> [!note] Mẹo Guitar quan trọng
> **G7b9 = Bdim7 trên bass G**. Dim7 chord (B–D–F–Ab) = 3rd, 5th, b7, b9 của G7 — đây là shortcut mạnh nhất để voice altered dominants trên guitar. Bất kỳ dim7 shape nào cũng có thể dùng trên dominant bass note dưới.

---

## Practice

> [!example] Bài tập 9.1 — Xây dựng extensions
> Với **A7** (A–C#–E–G), xây dựng:
> 1. A9: thêm 9th là nốt gì?
> 2. A13: thêm 13th là nốt gì?
> 3. A7b9: b9 là nốt gì?
> 4. A7#9: #9 là nốt gì?
> 5. A7#11: #11 là nốt gì?

> [!example] Bài tập 9.2 — Available tensions
> Cho mỗi chord sau, liệt kê tensions **được dùng** và tensions **nên tránh**:
>
> 1. Fmaj7 (key F)
> 2. Am7 (key C)
> 3. G7 (key C) — liệt kê cả unaltered và altered
> 4. Bm7b5 (key C)

> [!example] Bài tập 9.3 — Phân tích theo tai
> Nghe *So What* (Miles Davis, *Kind of Blue*). Chord Dm11 có màu sắc gì? Tại sao nó nghe "open" và không giải quyết như V7 thông thường?

> [!example] Bài tập 9.4 — Thay thế extensions
> Progression gốc: **Dm7 – G7 – Cmaj7**
>
> Viết lại với extensions cho mỗi chord:
> - Dm7 → Dm9 hoặc Dm11
> - G7 → G13 (unaltered) hoặc G7b9 (minor feel) hoặc G7#9 (blues feel)
> - Cmaj7 → Cmaj9 hoặc Cmaj7#11
>
> Nghe (hoặc chơi) cả hai version và mô tả sự khác biệt màu sắc.

---

## Summary / Key Takeaways

- **Extensions** (tensions) = 9th, 11th, 13th — cùng pitch với 2, 4, 6 nhưng ở octave trên
- **Unaltered**: 9, 11, 13 từ scale diatonic của chord type đó
- **Altered** (chỉ cho dominant): b9, #9, #11, b13 — chromatic alterations
- **Avoid note**: ♮11 trên Maj7 và dom7 (clash với M3); M7 trên m7
- **5 altered dominant**: 7b9 (tối/minor), 7#9 (Hendrix/blues), 7#11 (Lydian/sáng), 7b13 (augmented), 7alt (tất cả)
- **Mẹo guitar**: G7b9 = Bdim7 trên G bass — áp dụng cho mọi key
- **Jazz voicing**: bỏ root và 5th, giữ 3rd + 7th + 1–2 extensions
- **Modal Jazz**: Maj7#11 (Lydian = *Maiden Voyage*), m11 (Dorian = *So What*)
- **Bossa**: G7#11 = floating, ambiguous, tritone color

---

## Đáp án Bài tập 9.1 (A7 = A–C#–E–G)

A major scale: A–B–C#–D–E–F#–G#

1. **A9**: 9th = B (M2 của A) → A–C#–E–G–**B**
2. **A13**: 13th = F# (M6 của A) → A–C#–E–G–B–D–**F#**
3. **A7b9**: b9 = Bb (b2 của A, half step dưới B) → accidental **Bb**
4. **A7#9**: #9 = B# = C (enharmonic, #2 của A) → accidental **C** (hay B#)
5. **A7#11**: #11 = D# (raised 4th của A) → accidental **D#**

---

## References

- Mark Levine — *The Jazz Theory Book*, Ch. 4–5: Extensions, Altered Chords
- The Jazz Piano Site — *Extensions & Alterations*
- Jazzadvice — *Master Dominant Seventh Chord Alterations*
- Learn Jazz Standards — *Chord Extensions and Alterations*
- *So What* (Miles Davis, *Kind of Blue*, 1959)
- *Maiden Voyage* (Herbie Hancock, 1965)
- *Giant Steps* (John Coltrane, 1960)
- *The Girl from Ipanema* (Antonio Carlos Jobim, 1963)
