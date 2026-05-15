---
title: "13. Chord Substitutions"
tags: [music-theory, harmony, jazz, tritone-substitution, chord-substitution, lesson-13]
aliases: [Chord Substitutions, Tritone Sub, Backdoor Dominant]
created: 2026-03-25
---

> **Prerequisites**: [[12-jazz-harmony-fundamentals|12. Jazz Harmony Fundamentals]], [[06-secondary-dominants|06. Secondary Dominants]] — ii–V–I, guide tones, secondary dominants, tritone interval
> **Objectives**:
> - Hiểu cơ chế của tritone substitution (tại sao nó hoạt động)
> - Áp dụng tritone sub trong ii–V–I, turnaround và chromatic bass lines
> - Nắm related ii chord (mở rộng dominant thành ii–V)
> - Nhận ra backdoor dominant (♭VII7 → I) và chức năng của nó
> - Áp dụng các substitution trên guitar fretboard

---

## Motivation

Bạn đã biết ii–V–I. Nhưng Jazz standards không bao giờ chỉ dùng "vanilla" ii–V–I — chúng biến tấu liên tục. Một trong những công cụ mạnh nhất: **chord substitution** — thay một chord bằng chord khác mà vẫn giữ nguyên function harmonic.

```abc
X:1
T:G7 vs Db7 — same function, chromatic bass
M:4/4
L:1/4
Q:90
K:C
"^Dm7"[DFAc]2 "^G7"[GBdf]2 | "^Cmaj7"[CEGB]4 |
"^Dm7"[DFAc]2 "^Db7"[_D_FAB]2 | "^Cmaj7"[CEGB]4 |]
```

*Bar 1–2*: Dm7–G7–Cmaj7 — bass đi D→G→C (perfect 5th motion)
*Bar 3–4*: Dm7–**Db7**–Cmaj7 — bass đi D→**Db**→C (chromatic descent!). Hai chord G7 và Db7 resolve về Cmaj7 như nhau — nhưng Db7 tạo ra chromatic bass line mượt hơn rất nhiều.

Đây là tritone substitution — và sau khi học bài này, bạn sẽ thấy nó ở khắp mọi nơi.

---

## Concept / Theory

### Tại Sao Tritone Substitution Hoạt Động?

> [!definition] Definition 13.1 — Tritone Substitution
> **Tritone substitution** (tritone sub) = thay thế một dominant 7th chord bằng dominant 7th chord khác có **root cách nhau một tritone** (6 half steps = augmented 4th / diminished 5th).
>
> **Cơ chế**: hai chord chia sẻ **cùng tritone** giữa 3rd và 7th — nhưng vị trí đảo ngược:
>
> | | **G7** | **Db7** |
> |--|-------|--------|
> | Root | G | Db |
> | 3rd | **B** | **F** |
> | 5th | D | Ab |
> | 7th | **F** | **Cb (=B)** |
>
> B và F là tritone của G7; F và Cb(=B) là tritone của Db7 — **cùng một tritone**, chỉ đảo ngược vai trò (3rd↔7th).

```abc
X:2
T:Shared tritone — G7 and Db7
M:4/4
L:1/4
Q:80
K:C
V:1 name="3rd"
B4 | F4 |]
V:2 name="7th"
f4 | _B4 |]
V:3 name="Root"
G,4 | _D,4 |]
```

*B và F* = tritone trong cả G7 (B=3rd, F=7th) và Db7 (F=3rd, Cb=B enharmonic = 7th). Resolution về Cmaj7 (C–E–G–B): B→B (stays), F→E (half step down) — giống nhau cho cả hai chord!

---

### Tritone Sub Trong ii–V–I

> [!definition] Definition 13.2 — Tritone Sub của V
> Thay **V7** bằng **♭II7** (root = half step trên I):
>
> **Dm7 – G7 – Cmaj7** → **Dm7 – Db7 – Cmaj7**
>
> **Chromatic bass line**: D → Db → C (đi xuống half step liên tiếp)

```abc
X:3
T:ii-V-I vs ii-bII7-I (tritone sub)
M:4/4
L:1/4
Q:100
K:C
"^Dm7"[DFAc]4 | "^G7"[GBdf]4 | "^Cmaj7"[CEGB]4 | z4 |
"^Dm7"[DFAc]4 | "^Db7"[_D_FAB]4 | "^Cmaj7"[CEGB]4 | z4 |]
```

*Nghe sự khác biệt*: G7 → Cmaj7 nghe "classical", Db7 → Cmaj7 nghe "jazzy" và chromatic hơn. Bass line chromatic là đặc trưng nhất.

---

### Related ii Chord — Mở Rộng Dominant

> [!definition] Definition 13.3 — Related ii Chord
> Mỗi dominant chord V7 đều có **related ii chord** (minor 7th) cách nó perfect 5th phía trên.
>
> **V7 = dominant thì related ii = minor chord ngay trên nó**:
>
> G7 → **Dm7** (perfect 5th trên G = D)
>
> Db7 → **Abm7** (tritone sub ii)
>
> Kỹ thuật: thay V7 đơn giản bằng ii–V pair đầy đủ — tăng harmonic density:
>
> G7 → **Dm7–G7**; Db7 → **Abm7–Db7**

```abc
X:4
T:V7 expanded with related ii chord
M:4/4
L:1/4
Q:100
K:C
"^G7"[GBdf]4 | "^Cmaj7"[CEGB]4 |
"^Dm7"[DFAc]2 "^G7"[GBdf]2 | "^Cmaj7"[CEGB]4 |]
```

*Bar 1*: plain G7 (1 chord = 4 beats)
*Bar 3*: Dm7–G7 (2 beats each) — harmonic rhythm doubled, âm thanh phong phú hơn

---

### Backdoor Dominant — ♭VII7 → I

> [!definition] Definition 13.4 — Backdoor Dominant
> **Backdoor dominant** = chord ♭VII7 resolve về I — vào "cửa sau" thay vì "cửa trước" (V7→I).
>
> **Trong C major**: **Bb7 → Cmaj7**
>
> *Tại sao hoạt động?*: Bb7 = V7 của Eb major. Nhưng guide tones của Bb7 (D và Ab) voice lead về E và G của Cmaj7 (D→E half step lên, Ab→G half step xuống). Cộng với Bb trong bass → B♮ (leading tone của C) = smooth voice leading.
>
> Backdoor = tritone sub của IV (F) dom7, hoặc cũng = ii–V dẫn vào vi (Am) nhưng resolve sai vào I.

```abc
X:5
T:Backdoor dominant — Bb7 to Cmaj7
M:4/4
L:1/4
Q:90
K:C
"^V7"[GBdf]4 | "^Cmaj7"[CEGB]4 |
"^Bb7"[_BDF_a]4 | "^Cmaj7"[CEGB]4 |]
```

*G7 → Cmaj7* (bar 1–2): "frontdoor" — V7→I, classical
*Bb7 → Cmaj7* (bar 3–4): "backdoor" — ♭VII7→I, Jazz/R&B color, nghe "side-slipping"

---

### Turnaround Với Tritone Substitutions

Turnaround I–vi–ii–V có thể được biến tấu với tritone subs theo nhiều cách:

> [!definition] Definition 13.5 — Tritone Sub Turnarounds
>
> **Diatonic**: I – vi7 – ii7 – V7
> **VI dominant**: I – VI7 – ii7 – V7 (vi→VI = secondary dominant)
> **Tritone subs**: I – ♭III7 – ♭VII7 – ♭II7 (thay tất cả dominant bằng tritone sub)
> **Chromatic bass**: Imaj7 – III7 – ♭III7 – II7 – ♭II7 – Imaj7 (descend by half step)

```abc
X:6
T:Turnaround variants — diatonic vs tritone subs
M:4/4
L:1/2
Q:100
K:C
"^I"[CEGB] "^VI7"[A^ceg] | "^ii7"[DFAc] "^V7"[GBdf] |
"^I"[CEGB] "^Eb7"[_EG_Bc] | "^Ab7"[_A_CEG] "^Db7"[_D_FAB] |]
```

*Bar 1–2*: I–VI7–ii7–V7 (standard jazz turnaround)
*Bar 3–4*: I–♭III7–♭VII7–♭II7 (tất cả dominant thay bằng tritone sub → chromatic bass E♭→A♭→D♭→C)

---

## Musical Examples

### *Girl from Ipanema* — Tritone Sub Section B

Section B của *The Girl from Ipanema* (Jobim) nhảy bất ngờ sang Gb major — đây là tritone substitution của C7 (V của F):

```abc
X:7
T:Girl from Ipanema B section — Gb7 as tritone sub
M:4/4
L:1/4
Q:120
K:F
"^Fmaj7"[FAce]4 | "^Fmaj7"[FAce]4 |
[K:_G]"^Gbmaj7"[_G_Bdf]4 | "^Gbmaj7"[_G_Bdf]4 |]
```

*Gbmaj7* = tritone từ C major (tonic của Dm, relative minor). Cú nhảy đột ngột này là một trong những khoảnh khắc stunning nhất trong Bossa Nova — không có V7 chuẩn bị, chỉ là tritone sub của tonicization.

---

### *Autumn Leaves* — Tritone Sub Của F7

Trong *Autumn Leaves* (key Bb major), thay F7 bằng B7 (tritone sub):

```abc
X:8
T:Autumn Leaves — F7 vs B7 tritone sub
M:4/4
L:1/4
Q:110
K:_B
"^Cm7"[C_EG_B]2 "^F7"[CF_Ga]2 | "^Bbmaj7"[_BDfa]4 |
"^Cm7"[C_EG_B]2 "^B7"[BD^FA]2 | "^Bbmaj7"[_BDfa]4 |]
```

*F7 → Bbmaj7*: bass F→Bb (fifth down), classical motion
*B7 → Bbmaj7*: bass **B→Bb** (half step down!), nghe "edgy" và hiện đại hơn

---

### Turnaround Với Related ii Expansion

Turnaround thực tế trong Jazz standard — mỗi dominant được preceded bởi related ii:

```abc
X:9
T:Full turnaround with related ii chords
M:4/4
L:1/4
Q:110
K:C
"^Cmaj7"[CEGB]2 "^Em7"[EGBd]2 | "^Dm7"[DFAc]2 "^G7"[GBdf]2 |
"^Cmaj7"[CEGB]2 "^A7"[A^CEG]2 | "^Dm7"[DFAc]2 "^G7"[GBdf]2 |]
```

*Bars 1–2*: I–iii7–ii7–V7 (iii7 = tonic substitute, common variant)
*Bars 3–4*: I–A7–Dm7–G7 (A7 = V/ii = related dominant, tạo mini ii–V vào Dm7)

---

## Guitar Application

### Tritone Sub Trên Guitar — Cùng Shape, Cách Nhau 6 Frets

Tritone sub đặc biệt dễ trên guitar: **cùng voicing shape, chỉ dịch chuyển 6 frets**.

> [!example] Guitar Practice 13.1 — G7 → Db7 tritone sub
>
> ```
> G7 shape (root A-string fret 10):    Db7 shape (same, fret 4):
> e ── 10  (F — b7)                     e ── 4   (F — 3rd!)
> B ── 11  (G — R... or:)               B ── 5   (E/Fb — 3rd/7th)
>
> Simple version, string 6 root:
> G7:  e──1  B──0  G──0  D──0  A──x  E──3
> Db7: e──x  B──4  G──3  D──4  A──4  E──x  (Db root on A-string fret 4)
> ```
>
> **Mẹo**: với 7th chord shapes trên strings 1–4, tritone sub = dịch shape đúng 6 frets lên hoặc xuống. Âm thanh hoàn toàn tương đương về function, nhưng có bass note khác tạo chromatic motion.

> [!example] Guitar Practice 13.2 — Backdoor Bb7 → C
>
> ```
> Bb7 (root Bb, A-string fret 1):
> e ── x
> B ── 3  (D — 3rd)
> G ── 3  (D — double 3rd)
> D ── 3  (Ab — b7!)
> A ── 1  (Bb — root)
> E ── x
> ```
>
> Chơi: Dm7 → Bb7 → Cmaj7. Nghe cách Bb7 "slides" vào C từ half step bên dưới.

---

## Practice

> [!example] Bài tập 13.1 — Tìm tritone sub
> Với mỗi dominant chord sau, tìm tritone substitution:
> 1. D7 → ?
> 2. A7 → ?
> 3. Bb7 → ?
> 4. F#7 → ?
>
> Sau đó xây full chord (root, 3rd, 5th, 7th) cho mỗi tritone sub.

> [!example] Bài tập 13.2 — Áp dụng tritone sub
> Progression gốc: **Am7 – D7 – Gmaj7 – Cmaj7**
>
> (a) Thay D7 bằng tritone sub
> (b) Thêm related ii cho D7 trước khi sub (Em7–D7 trước, rồi thử Em7–Ab7)
> (c) Viết bass line cho cả hai version

> [!example] Bài tập 13.3 — Phân tích
> Progression sau sử dụng những substitution gì? (Key C major)
>
> Cmaj7 – Eb7 – Ab7 – Db7 – Cmaj7
>
> Gợi ý: so sánh với I–vi–ii–V chuẩn.

---

## Summary / Key Takeaways

- **Tritone sub** = thay V7 bằng ♭II7 (root tritone away) — chia sẻ cùng tritone B↔F
- **Cơ chế**: 3rd và 7th của hai chord là enharmonic equivalent → cùng voice leading về I
- **Hiệu ứng quan trọng**: bass line chromatic (D→Db→C thay D→G→C)
- **Related ii** = minor 7th chord ngay trên dominant — mở rộng G7 → Dm7–G7
- **Backdoor dominant** = ♭VII7 → I (Bb7→C trong C major) — "side-slipping" effect
- **Guitar**: tritone sub = cùng shape dịch 6 frets
- **Turnaround tritone subs**: I–♭III7–♭VII7–♭II7 → toàn bộ bass chromatic
- *Girl from Ipanema* B section = tritone sub Gbmaj7 — cú nhảy iconic của Bossa
- *Autumn Leaves* B7 sub F7 → B→Bb chromatic bass motion

---

## Đáp án Bài tập 13.1

1. D7 → **Ab7** (D + tritone = Ab)
2. A7 → **Eb7** (A + tritone = Eb)
3. Bb7 → **E7** (Bb + tritone = E)
4. F#7 → **C7** (F# + tritone = C)

## Đáp án Bài tập 13.3

I–vi–ii–V chuẩn: Cmaj7–Am7–Dm7–G7

Progression: Cmaj7–Eb7–Ab7–Db7–Cmaj7

- **Am7 → Eb7**: Eb7 = tritone sub của A7 (= VI7 = V/ii) ✓
- **Dm7 → Ab7**: Ab7 = tritone sub của D7... nhưng D7 không standard. Thực chất Ab7 = tritone sub của Dm7's dominant = tritone sub của A7 → same as above; **hoặc** Ab7 = V/Db = related V của Db7 tiếp theo
- **G7 → Db7**: Db7 = tritone sub của G7 (V) ✓

Toàn bộ bass line: C–Eb–Ab–Db–C = chromatic descending bằng 4ths / M3rds — very Coltrane-esque!

---

## References

- Mark Levine — *The Jazz Theory Book*, Ch. 9: Tritone Substitution
- Wikipedia — *Tritone substitution*
- Learn Jazz Standards — *3 Types of Tritone Substitution*
- Jazz Library — *Tritone Substitution: A Comprehensive Guide*
- Open Music Theory — *Substitutions*
- *The Girl from Ipanema* (Tom Jobim, 1962) — Gb tritone sub
- *Autumn Leaves* — B7 tritone sub analysis
