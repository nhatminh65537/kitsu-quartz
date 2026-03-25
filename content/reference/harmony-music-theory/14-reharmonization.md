---
title: "14. Reharmonization"
tags: [music-theory, harmony, jazz, reharmonization, chord-planing, lesson-14]
aliases: [Reharmonization, Chord Planing, Contrafact, Coltrane Changes]
created: 2026-03-25
---

> **Prerequisites**: [[12-jazz-harmony-fundamentals|12. Jazz Harmony Fundamentals]], [[13-chord-substitutions|13. Chord Substitutions]], [[09-extended-altered-chords|09. Extended Chords]] — ii–V–I, tritone sub, related ii, extensions
> **Objectives**:
> - Hiểu reharmonization là gì và tại sao nhạc sĩ Jazz dùng nó
> - Áp dụng 4 kỹ thuật chính: passing chords, planing, chromatic bass, Coltrane changes
> - Tái harmonize một bài đơn giản bằng cách thêm density và color
> - Nhận ra contrafact trong Jazz history
> - Phân tích *How High the Moon* → *Ornithology* (Charlie Parker)

---

## Motivation

**Reharmonization** là nghệ thuật thay đổi chord progression của một bài nhạc trong khi giữ nguyên melody. Đây là cách Jazz musicians biến một bài cũ thành tác phẩm mới, cách compers cá nhân hóa tiếng đàn, và cách arrangers tạo những version khác biệt.

Nghe *Stella by Starlight* trong version Bill Evans — cùng melody, nhưng chord progression khác hoàn toàn so với Victor Young gốc. Nghe Keith Jarrett chơi *My Funny Valentine* — mỗi chorus anh ấy reharmonize theo cách khác nhau. Đây không phải "chơi sai" — đây là ngôn ngữ nghệ thuật cao nhất trong Jazz.

---

## Concept / Theory

### Reharmonization vs Substitution

> [!definition] Definition 14.1 — Reharmonization
> **Reharmonization** = thay đổi chord progression của một bài, có thể bao gồm:
> - Thay individual chords (substitution — đã học Lesson 13)
> - Thêm passing chords giữa các chord hiện có
> - Thay đổi hoàn toàn harmonic structure (vẫn support melody)
> - Tăng hoặc giảm harmonic density (số lượng chord changes)
>
> **Key Melody Note (KMN)** = nốt quan trọng nhất trong mỗi bar của melody — chord mới phải support KMN như: root, 3rd, 5th, 7th, 9th, 11th, hoặc 13th (available tension).

---

### Kỹ Thuật 1: Passing Chords

> [!definition] Definition 14.2 — Passing Chord
> **Passing chord** = chord được thêm vào giữa hai chord chính, tồn tại ngắn (½ bar hoặc 1 beat), tạo movement.
>
> Hai loại phổ biến:
> - **Chromatic approach**: chord cách target chord **1 half step** (lên hoặc xuống)
> - **Diatonic passing**: chord diatonic giữa hai chord cách nhau 3rd

```abc
X:1
T:Passing chords — chromatic approach to Dm7
M:4/4
L:1/4
Q:100
K:C
"^Cmaj7"[CEGB]4 | "^Dm7"[DFAc]4 |
"^Cmaj7"[CEGB]2 "^Dbmaj7"[_D_FAc]2 | "^Dm7"[DFAc]4 |]
```

*Bar 1–2*: trực tiếp I→ii
*Bar 3–4*: I→**♭II** (chromatic approach từ half step dưới) → ii — Dbmaj7 "lướt vào" Dm7 từ half step dưới, rất mượt mà.

---

### Kỹ Thuật 2: Planing (Parallel Motion)

> [!definition] Definition 14.3 — Planing
> **Planing** = dịch chuyển toàn bộ một chord voicing **cùng interval** (half step, whole step, perfect 4th...) — tất cả voices đi song song cùng chiều.
>
> **Chromatic planing**: dịch half step (tạo outside color trước khi resolve)
> **Diatonic planing**: dịch theo scale degrees (giữ trong key)
>
> Debussy dùng planing rất nhiều; Bill Evans, McCoy Tyner cũng vậy.

```abc
X:2
T:Chromatic planing — sliding chord shape
M:4/4
L:1/4
Q:90
K:C
"^Dm7"[DFAc]2 "^Dbm7"[_D_F_A_c]2 | "^Cmaj7"[CEGB]4 |
"^Dm9"[DFAcd]2 "^Dbm9"[_D_F_A_c_d]2 | "^Cmaj7"[CEGB]4 |]
```

*Dm7→Dbm7→Cmaj7*: toàn bộ Dm7 voicing dịch xuống half step trước khi resolve — tạo chromatic "slide" effect rất characteristic.

---

### Kỹ Thuật 3: Chromatic Bass Line Reharmonization

> [!definition] Definition 14.4 — Chromatic Bass Reharmonization
> Tổ chức chord changes để bass line đi **chromatic** (từng half step) — chord bên trên phải support KMN của melody.
>
> Bill Evans và João Gilberto (Bossa) nổi tiếng với kỹ thuật này.

```abc
X:3
T:Chromatic bass reharmonization — C descending
M:4/4
L:1/4
Q:85
K:C
"^Cmaj7"[CEGB]4 | "^B7"[B^D^FA]4 | "^Bb7"[_BDF_a]4 | "^A7"[A^ceg]4 |
"^Abmaj7"[_A_CEG]4 | "^G7"[GBdf]4 | "^Gm7"[G_Bdf]4 | "^Cmaj7"[CEGB]4 |]
```

Bass đi **C→B→Bb→A→Ab→G** (chromatic descent). Mỗi chord được chọn để support melody note — đây là kiểu reharmonization được dùng trong *"Don't Explain"* (Billie Holiday) phiên bản Bill Evans.

---

### Kỹ Thuật 4: Coltrane Changes (Giant Steps Substitution)

> [!definition] Definition 14.5 — Coltrane Changes
> **Coltrane changes** = kỹ thuật thay thế ii–V–I bằng chuỗi V–I di chuyển theo **major third cycle** (M3, xuống liên tiếp).
>
> Trong C: **Dm7–G7–Cmaj7** → **Dm7 – Eb7–Abmaj7 – B7–Emaj7 – G7–Cmaj7**
>
> Ba key center: Ab, E, C (= C augmented triad: C–E–Ab)
>
> Mỗi key được "tonicize" bằng V7 trước đó. Harmonic rhythm tăng gấp đôi.

```abc
X:4
T:Coltrane changes — Dm7-G7-Cmaj7 reharmonized
M:4/4
L:1/4
Q:120
K:C
"^Dm7"[DFAc]2 "^Eb7"[_E_G_Bc]2 | "^Abmaj7"[_A_CEG]2 "^B7"[B^D^Fa]2 |
"^Emaj7"[E^G^Bd]2 "^G7"[GBdf]2 | "^Cmaj7"[CEGB]4 |]
```

*Phân tích*: Dm7 (ii/C) → Eb7 (V/Ab) → Abmaj7 → B7 (V/E) → Emaj7 → G7 (V/C) → Cmaj7. Three key centers: Ab, E, C — mỗi cái cách nhau M3, tạo nên cú nhảy kaleidoscope màu sắc của *Giant Steps*.

---

### Contrafact — Melody Mới Trên Changes Cũ

> [!definition] Definition 14.6 — Contrafact
> **Contrafact** = tác phẩm mới được viết **trên chord changes của một bài khác**, với melody hoàn toàn mới.
>
> Lý do tồn tại: bản quyền melody, nhưng chord progressions không thể copyright.
>
> | Contrafact | Dựa trên | Tác giả |
> |-----------|---------|--------|
> | *Ornithology* | *How High the Moon* | Charlie Parker |
> | *Hot House* | *What Is This Thing Called Love* | Tadd Dameron |
> | *Anthropology* | *I Got Rhythm* | Charlie Parker |
> | *Impressions* | *So What* | John Coltrane |
> | *Countdown* | *Tune Up* | John Coltrane (Coltrane changes) |

---

## Musical Examples

### Charlie Parker — *Ornithology* (Contrafact of *How High the Moon*)

*How High the Moon* (Morgan Lewis, 1940) và *Ornithology* (Charlie Parker, 1946) dùng cùng chord changes — melody khác hoàn toàn:

```abc
X:5
T:How High the Moon / Ornithology — shared changes (key G)
M:4/4
L:1/4
Q:160
K:G
"^Gmaj7"[GBdF]4 | "^Gmaj7"[GBdF]4 | "^Gm7"[G_Bdf]4 | "^C7"[CEG_B]4 |
"^Fmaj7"[FAce]4 | "^Fmaj7"[FAce]4 | "^Fm7"[F_Ace]4 | "^Bb7"[_BDf_a]4 |]
```

*8 bars đầu* = Gmaj7–Gm7–C7–Fmaj7–Fm7–Bb7: một chuỗi sequential modulations qua nhiều keys, cực kỳ phức tạp so với standards của thời đó. Parker chọn bài này vì challenges harmonic của nó.

---

### Bill Evans — Chromatic Reharmonization

Bill Evans nổi tiếng với việc reharmonize chords đơn giản bằng chromatic passing chords và planing. Đây là kiểu anh ấy biến I–IV–V:

```abc
X:6
T:Bill Evans style — chromatic reharmonization of I-IV-V
M:4/4
L:1/4
Q:85
K:C
"^I"[CEG]4 | "^IV"[FAc]4 | "^V"[GBd]4 | "^I"[CEG]4 |
"^Cmaj9"[CEGd]2 "^C#m9"[^C^EG^Ad]2 | "^Fmaj9"[FAcg]2 "^F#m9"[^FA^cg^a]2 | "^G13"[GBde]4 | "^Cmaj9"[CEGd]4 |]
```

*Version 1* (bar 1–4): plain I–IV–V–I
*Version 2* (bar 5–8): Cmaj9 → C#m9 (chromatic approach to Fmaj9) → F#m9 (planing) → G13 → Cmaj9. Melody note nằm trên 9th của mỗi chord — reharmonization support được.

---

### Bossa Nova — Jobim's Reharmonization of *Corcovado*

Jobim thường reharmonize ở mỗi repeat của chorus. Đây là kiểu biến tấu chord quality trên cùng root:

```abc
X:7
T:Corcovado-style quality change reharmonization
M:4/4
L:1/4
Q:90
K:F
"^Fmaj7"[FAce]4 | "^Fm7"[F_Ace]4 | "^Fmaj7"[FAce]4 | "^F6"[FACD]4 |]
```

*Fmaj7 → Fm7 → Fmaj7 → F6*: cùng root F, chất lượng thay đổi. Melody note C ở mỗi bar = chord tone hoặc available tension của tất cả 4 chords. Đây là "chord quality substitution" — kỹ thuật đặc trưng Jobim.

---

### *Giant Steps* — Coltrane Changes In Action

*Giant Steps* (1959) = bài Jazz phức tạp nhất về mặt harmony, dùng Coltrane changes toàn bộ:

```abc
X:8
T:Giant Steps — first 4 bars
M:4/4
L:1/4
Q:240
K:B
"^Bmaj7"[B^D^FA]2 "^D7"[D^FAc]2 | "^Gmaj7"[GBdF]2 "^Bb7"[_BDf_a]2 |
"^Ebmaj7"[_EG_Bd]2 "^Am7"[Aceg]2 | "^D7"[D^FAc]2 "^Gmaj7"[GBdF]2 |]
```

*Three key centers*: B major, G major, Eb major — cách nhau M3 (= B augmented triad: B–D#–G). Mỗi key center được approach bằng V7 trước đó. Harmonic rhythm nhanh đến mức improviser phải biết 3 keys liên tiếp trong 2 bars.

---

## Guitar Application

> [!example] Guitar Practice 14.1 — Thêm chromatic passing chord
> Progression gốc: **Cmaj7 – Fmaj7** (2 bars each)
>
> Thêm chromatic passing chord vào:
>
> ```
> Original:  Cmaj7  ────────────  Fmaj7
> Version 1: Cmaj7  E7  ─────────  Fmaj7   (E7 = chromatic approach from half step below)
> Version 2: Cmaj7  ────  Gb7 ────  Fmaj7   (Gb7 = chromatic approach from half step above)
> Version 3: Cmaj7  E7   Eb7 ─────  Fmaj7   (double approach = E7→Eb7→F, chromatic descent)
> ```
>
> Tất cả đều support melody note A (3rd của Fmaj7 = 9th của E7 = ♭7 của Bb7 = 3rd của Fmaj7).

> [!example] Guitar Practice 14.2 — Planing exercise
> Bấm Dm7 (D–F–A–C) ở một position. Dịch **cùng shape** xuống 1 fret (= Dbm7), rồi 1 fret nữa (= Cm7). Ba chord liên tiếp chuyển smooth: Dm7 → Dbm7 → Cm7 → (resolve về Cmaj7).
>
> Nghe "sliding" effect — đây là chromatic planing. Dùng trước ii chord trong ii–V–I để tạo tension mới.

---

## Practice

> [!example] Bài tập 14.1 — Nhận diện kỹ thuật
> Xác định kỹ thuật reharmonization được dùng trong mỗi ví dụ:
>
> 1. Cmaj7 – Ebmaj7 – Fmaj7 (melody: C–C–C, tất cả là root hoặc 5th)
> 2. Dm7 – Dbm7 – Cmaj7
> 3. Cmaj7 – **Dbmaj7** – Dm7 (Dbmaj7 là passing chord)
> 4. Dm7 – G7 – Abmaj7 – B7 – Emaj7 – G7 – Cmaj7

> [!example] Bài tập 14.2 — Reharmonize một bài đơn giản
> Cho progression gốc: **C – Am – F – G** (I–vi–IV–V, key C)
>
> Reharmonize bằng cách:
> 1. Đổi tất cả sang 7th chords (add 7th vào mỗi chord)
> 2. Thêm related ii trước mỗi chord V có dominant function
> 3. Thay Am7 bằng tritone sub của A7 (= Eb7)
> 4. Thêm chromatic passing chord từ F→G (Gb7 passing)
>
> So sánh version gốc và version cuối.

> [!example] Bài tập 14.3 — Contrafact nhận diện
> Nghe *Anthropology* (Charlie Parker). Progression bắt đầu giống bài Jazz standard nào? Tại sao Parker không cần credit tác giả gốc cho chord progressions?

---

## Summary / Key Takeaways

- **Reharmonization** = thay chord progression, support melody ở chỗ mới (KMN phải là chord tone hoặc available tension)
- **Passing chord**: thêm chord ½–1 beat giữa hai chord chính (chromatic approach = half step, diatonic = step)
- **Planing**: dịch toàn bộ voicing song song — chromatic hoặc diatonic
- **Chromatic bass line**: chord bên trên thay đổi để bass đi half step liên tiếp
- **Coltrane changes**: thay ii–V–I bằng chuỗi V–I theo M3 cycle (Ab–E–C) — *Giant Steps*, *Countdown*
- **Contrafact**: melody mới trên changes cũ — không vi phạm copyright vì chords không được bảo hộ
- *Ornithology* = *How High the Moon* (Parker contrafact), *Anthropology* = *I Got Rhythm*
- **Phân biệt**: substitution = thay 1 chord; reharmonization = thay cả structure

---

## Đáp án Bài tập 14.1

1. Cmaj7–Ebmaj7–Fmaj7 (melody C–C–C): **Diatonic planing** (thêm Ebmaj7 giữa C và F — borrowed chord làm planing step)
2. Dm7–Dbm7–Cmaj7: **Chromatic planing** (Dm7 shape trượt xuống half step 2 lần)
3. Cmaj7–**Dbmaj7**–Dm7: **Chromatic approach/passing chord** (Dbmaj7 là half step dưới Dm7)
4. Dm7–G7–Abmaj7–B7–Emaj7–G7–Cmaj7: **Coltrane changes** (M3 cycle: Ab, E, C)

---

## References

- Mark Levine — *The Jazz Theory Book*, Ch. 19: Reharmonization
- Jazzadvice — *Jazz Contrafacts and Reharmonization Techniques*
- The Jazz Piano Site — *How to Reharmonize a Song*
- Wikipedia — *Harmonization* (Planing, Reharmonization)
- *Giant Steps* (John Coltrane, 1960) — Coltrane changes
- *Ornithology* (Charlie Parker, 1946) — Contrafact of *How High the Moon*
- *Anthropology* (Charlie Parker) — Contrafact of *I Got Rhythm*
- Bill Evans — Various recordings of *Stella by Starlight*, *My Funny Valentine*
