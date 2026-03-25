---
title: "12. Jazz Harmony Fundamentals"
tags: [music-theory, harmony, jazz, ii-V-I, chord-scale, turnaround, lesson-12]
aliases: [Jazz Harmony Fundamentals, ii-V-I, Chord Scale Theory]
created: 2026-03-25
---

> **Prerequisites**: [[01-all-7th-chords|01. All 7th Chords]], [[02-diatonic-harmony|02. Diatonic Harmony]], [[03-voice-leading|03. Voice Leading]], [[09-extended-altered-chords|09. Extended Chords]] — 7th chords, diatonic harmony, guide tones, extensions
> **Objectives**:
> - Nắm vững ii–V–I trong major và minor với guide tone voice leading
> - Hiểu chord-scale theory: mỗi chord → scale tương ứng để improvise
> - Nhận ra và chơi các Jazz progressions cốt lõi: turnaround, rhythm changes, Jazz blues
> - Đọc lead sheet và phân tích harmony Jazz standards thực tế
> - Áp dụng shell voicings và rootless voicings trên guitar

---

## Motivation

Tại sao Jazz nghe khác Classical? Phần lớn là vì **ngôn ngữ hòa âm**. Classical nói bằng triads và diatonic chords — Jazz nói bằng 7th chords, extensions, và một bộ progressions rất đặc trưng.

Nếu bạn học được 5 progressions trong bài này, bạn có thể phân tích **60–70% tất cả Jazz standards** đã từng được viết. Không phóng đại.

```abc
X:1
T:ii-V-I — the DNA of Jazz harmony
M:4/4
L:1/4
Q:100
K:C
"^Dm7"[DFAc]4 | "^G7"[GBdf]4 | "^Cmaj7"[CEGB]4 | z4 |]
```

Ba chord, ba chức năng, một resolution hoàn hảo. Đây là "phân tử DNA" của Jazz. Mọi thứ trong bài này xây trên nền tảng này.

---

## Concept / Theory

### ii–V–I Trong Major Key

> [!definition] Definition 12.1 — Major ii–V–I
> **Dm7 → G7 → Cmaj7** (trong C major)
>
> | Chord | Roman | Loại | Chức năng |
> |-------|-------|------|----------|
> | Dm7 | iim7 | minor 7th | Predominant |
> | G7 | V7 | dominant 7th | Dominant |
> | Cmaj7 | Imaj7 | major 7th | Tonic |
>
> **Guide tone voice leading**: F (3rd Dm7) → F (7th G7) → E (3rd Cmaj7), đi xuống half step.
> C (7th Dm7) → B (3rd G7) → B (7th Cmaj7), xuống half step lần đầu rồi giữ.

```abc
X:2
T:Guide tone voice leading — ii-V-I in C
M:4/4
L:1/4
Q:80
K:C
V:1 name="Guide tone upper"
f4 | f4 | e4 |]
V:2 name="Guide tone lower"
c4 | B4 | B4 |]
V:3 name="Bass"
D,4 | G,4 | C,4 |]
```

*F stays* (ii→V), *F→E* half step (V→I); *C→B* half step (ii→V), *B stays* (V→I). Hai guide tones chỉ di chuyển tổng cộng 2 half steps qua cả 3 chord.

---

### ii–V–i Trong Minor Key

> [!definition] Definition 12.2 — Minor ii–V–i
> **Dm7♭5 → G7 → Cm7** (trong C minor, từ harmonic minor)
>
> | Chord | Roman | Loại | Note |
> |-------|-------|------|------|
> | Dm7♭5 | iiø7 | half-diminished | Ab (♭5̂ từ harmonic minor) |
> | G7 | V7 | dominant 7th | B♮ (leading tone, raised) |
> | Cm7 | im7 | minor 7th | Resolution |
>
> G7 thường dùng với b9 (Ab) hoặc #9 — xem Lesson 09 về altered dominants.

```abc
X:3
T:Minor ii-V-i — Dm7b5 G7b9 Cm7
M:4/4
L:1/4
Q:90
K:Cmin
"^Dm7b5"[DF_Ac]4 | "^G7b9"[GBd_af]4 | "^Cm7"[C_EG_B]4 | z4 |]
```

*Màu sắc tối hơn major ii–V–I* — đặc trưng minor Jazz, Latin, và Tango.

---

### Chord-Scale Theory (CST)

> [!definition] Definition 12.3 — Chord-Scale Theory
> Mỗi chord trong Jazz tương ứng với một **scale** — musician dùng scale đó để improvise và voice chord.
>
> Nguyên tắc: scale không được tạo ra **avoid note** (note clash với chord tone quan trọng).

**Chord-Scale table cho ii–V–I (C major)**:

| Chord | Scale | Characteristic |
|-------|-------|---------------|
| **Dm7** (ii) | D Dorian | ♮6̂ (B natural) |
| **G7** (V) | G Mixolydian (natural) | ♭7̂ (F) |
| **G7alt** (V altered) | G Altered scale (Ab mel. minor) | b9, #9, b13 |
| **Cmaj7** (I) | C Ionian / C Lydian (#11) | — |

```abc
X:4
T:Chord-scale demo — Dorian on ii, Mixolydian on V
M:4/4
L:1/8
Q:100
K:C
"^Dm7: D Dorian"D E F G A B c d | "^G7: G Mixolydian"G A B c d e f g |
"^Cmaj7: C Ionian"c B A G F E D C |]
```

*Scale tương ứng* chạy liền mạch qua từng chord. Đây là cách improviser "paint" chords bằng notes.

---

### Turnaround — I–vi–ii–V

> [!definition] Definition 12.4 — Turnaround (I–vi–ii–V)
> **Turnaround** = progression 2-bar ở cuối phrase để "quay về" I chord cho chorus tiếp theo.
>
> Dạng cơ bản: **Cmaj7 – Am7 – Dm7 – G7**
>
> Với secondary dominant: **Cmaj7 – A7 – Dm7 – G7** (vi → VI7 = V/ii, thêm tension)

```abc
X:5
T:Turnaround — I-vi-ii-V diatonic vs with secondary dominant
M:4/4
L:1/4
Q:100
K:C
"^Cmaj7"[CEGB]2 "^Am7"[Aceg]2 | "^Dm7"[DFAc]2 "^G7"[GBdf]2 |
"^Cmaj7"[CEGB]2 "^A7"[A^ceg]2 | "^Dm7"[DFAc]2 "^G7"[GBdf]2 |]
```

*Bar 1–2*: diatonic — Am7 (vi) nghe "stable"
*Bar 3–4*: A7 (VI7 = V/ii) nghe "push" mạnh hơn về Dm7

---

### Rhythm Changes — Form Cơ Bản Của Bebop

> [!definition] Definition 12.5 — Rhythm Changes
> **Rhythm Changes** = chord progression của *I Got Rhythm* (Gershwin, 1930), nền tảng của hàng trăm bài Bebop.
>
> Form: AABA, 32 bars, thường ở Bb major.
>
> **A section** (8 bars): Turnaround mở rộng
> **B section** (bridge, 8 bars): Chuỗi dominant 7ths theo circle of fifths

```abc
X:6
T:Rhythm Changes — A section (Bb major)
M:4/4
L:1/4
Q:160
K:_B
"^Bbmaj7"[_BDA]2 "^Gm7"[_GBD=F]2 | "^Cm7"[C_EG_B]2 "^F7"[CFG_A]2 |
"^Bbmaj7"[_BDA]2 "^Gm7"[_GBD=F]2 | "^Cm7"[C_EG_B]2 "^F7"[CFG_A]2 |
"^Bbmaj7"[_BDA]2 "^Bb7"[_BD=FA]2 | "^Ebmaj7"[_EG_Bd]2 "^Edim7"[EG_Bc]2 |
"^Bbmaj7"[_BDA]2 "^F7"[CFG_A]2 | "^Bbmaj7"[_BDA]4 |]
```

*A section* = I–vi–ii–V lặp lại, kết bằng I. Bridge (B section) = D7–G7–C7–F7 → circle of fifths chain.

---

### Jazz Blues — 12 Bars With Jazz Chords

> [!definition] Definition 12.6 — Jazz Blues (F major)
> **12-bar blues** trong Jazz style dùng extended chords và thêm ii–V substitutions:

```abc
X:7
T:Jazz Blues in F — 12 bars
M:4/4
L:1/4
Q:120
K:F
"^F7"[FA_ce]4 | "^Bb7"[_BD_fe]4 | "^F7"[FA_ce]4 | "^F7"[FA_ce]4 |
"^Bb7"[_BD_fe]4 | "^Bb7"[_BD_fe]4 | "^F7"[FA_ce]4 | "^Dm7"[DFAc]4 |
"^Gm7"[G_Bdf]4 | "^C7"[CEG_B]4 | "^F7"[FA_ce]2 "^Dm7"[DFAc]2 | "^Gm7"[G_Bdf]2 "^C7"[CEG_B]2 |]
```

*Khác với blues bình thường*: bars 9–12 dùng ii–V pair (Gm7–C7 = ii–V trong F); bar 11–12 = turnaround trở về đầu.

---

## Musical Examples

### *Autumn Leaves* — Sequential ii–V–I

*Autumn Leaves* = ví dụ hoàn hảo của **sequential ii–V–I** qua hai key liên tiếp:

| Bars | Chord | ii–V–I | Key |
|------|-------|--------|-----|
| 1–2 | Am7 – D7 | ii–V | G major |
| 3–4 | Gmaj7 – Cmaj7 | I–IV | G major |
| 5–6 | F#m7b5 – B7 | ii–V | E minor |
| 7–8 | Em7 | i | E minor |

```abc
X:8
T:Autumn Leaves — sequential ii-V-I (key G)
M:4/4
L:1/4
Q:120
K:G
"^Am7"[Aceg]4 | "^D7"[D^FAc]4 | "^Gmaj7"[GBdF]4 | "^Cmaj7"[cegb]4 |
"^F#m7b5"[^FAce]4 | "^B7"[B^d^fa]4 | "^Em7"[Egbd]4 | z4 |]
```

*Am7–D7* = ii–V trong G major; *F#m7b5–B7* = ii–V trong E minor. Đây là **"two-key ii–V–I"** pattern rất phổ biến trong Jazz standards.

---

### *All The Things You Are* — Multi-Key ii–V–I Chain

*All The Things You Are* (Jerome Kern) = bài tiêu biểu nhất cho multi-key ii–V–I:

| Section | Key | ii–V–I |
|---------|-----|--------|
| A1 (bars 1–8) | Ab major | Fm7–Bb7–Ebmaj7–Abmaj7 |
| A2 (bars 9–16) | C major | Dm7–G7–Cmaj7 |
| B bridge | E major | C#m7–F#7–Bmaj7 |

```abc
X:9
T:All The Things You Are — opening ii-V-I
M:4/4
L:1/4
Q:110
K:_A
"^Fm7"[F_Ac_e]4 | "^Bb7"[_BD_Ff]4 | "^Ebmaj7"[_EG_Bd]4 | "^Abmaj7"[_A_Ceg]4 |]
```

*Fm7–Bb7–Ebmaj7–Abmaj7* = ii–V–I–IV trong Ab major, rồi bài tiếp tục modulate sang C, E, G...

---

## Guitar Application

### Shell Voicings — Minimum Jazz Chord

Shell voicing = root + 3rd + 7th (bỏ 5th). Đủ để xác định chord quality và voice lead mượt:

> [!example] Guitar Practice 12.1 — ii–V–I shell voicings, key C
>
> ```
> Dm7 (root D, A-string):    G7 (root G, E-string):    Cmaj7 (root C, A-string):
> e ── x                      e ── 1  (F — b7)           e ── 0  (E — 3rd)
> B ── 6  (C — b7)            B ── 0  (B — 3rd)          B ── 0  (B — maj7)
> G ── 7  (A — 5th opt.)      G ── 0  (G — root)         G ── 0  (G — 5th opt.)
> D ── 7  (F — 3rd)           D ── 0  (D — 5th opt.)     D ── 2  (E — 3rd)
> A ── 5  (D — root)          A ── 2  (B — 3rd)          A ── 3  (C — root)
> E ── x                      E ── 3  (G — root)         E ── x
> ```
>
> Chú ý: string B chuyển từ C (fret 6) → B (open) → B (open). Đây là guide tone F→F→E trên string G: fret 7 → open → open.

---

### Rootless Voicings — Tư Duy Piano Sang Guitar

Khi có bass player chơi root, guitarist nên dùng **rootless voicings** — chỉ guide tones + extensions:

> [!example] Guitar Practice 12.2 — Rootless voicings ii–V–I
>
> ```
> Dm9 rootless:    G13 rootless:    Cmaj9 rootless:
> e ── 5  (A—5th)  e ── 3  (D—5th) e ── 4  (E—3rd)
> B ── 6  (C—b7)   B ── 3  (G—R)   B ── 5  (E—3rd double)
> G ── 7  (A—5th)  G ── 4  (B—3rd) G ── 4  (D—9th!)
> D ── 7  (F—3rd)  D ── 3  (F—b7)  D ── 5  (G—5th)
> A ── x           A ── x           A ── x
> E ── x           E ── x           E ── x
> ```

---

## Practice

> [!example] Bài tập 12.1 — ii–V–I trong 12 keys
> Viết (hoặc chơi) ii–V–I trong các key sau. Với mỗi key, ghi ra 3 chord với tên đầy đủ:
> 1. Key F: ? – ? – Fmaj7
> 2. Key Bb: ? – ? – Bbmaj7
> 3. Key G: ? – ? – Gmaj7
> 4. Key Eb: ? – ? – Ebmaj7

> [!example] Bài tập 12.2 — Minor ii–V–i
> Trong key **D minor**, xây minor ii–V–i:
> - ii chord (half-dim): Em7♭5 (nốt?)
> - V chord (dominant với b9): A7b9 (nốt?)
> - i chord: Dm7 (nốt?)
>
> Sau đó viết guide tone line cho progression này.

> [!example] Bài tập 12.3 — Chord-scale matching
> Match chord với scale phù hợp nhất:
>
> 1. Am7 (ii trong G major) → ?
> 2. D7 (V trong G major) → ?
> 3. Gmaj7 (I trong G major) → ?
> 4. Bm7b5 (ii trong A minor) → ?
> 5. E7 (V trong A minor) → ?

> [!example] Bài tập 12.4 — Phân tích lead sheet
> Lấy lead sheet của *Autumn Leaves* (transpose về G major). Đánh dấu tất cả ii–V–I hoặc ii–V patterns. Có bao nhiêu ii–V–I complete (có cả I)? Có ii–V nào không có I (incomplete)?

---

## Summary / Key Takeaways

- **ii–V–I major**: iim7 – V7 – Imaj7 — progression cơ bản nhất Jazz
- **ii–V–i minor**: iiø7 – V7(b9) – im7 — tối hơn, thường dùng altered V
- **Guide tones** (3rd + 7th) chỉ di chuyển 1–2 half steps qua ii–V–I — voice leading tối ưu
- **Chord-Scale Theory**: Dorian trên ii, Mixolydian/Altered trên V, Ionian/Lydian trên I
- **Turnaround** (I–vi–ii–V): 2 bars loop về I; VI7 thay vi7 = thêm tension
- **Rhythm Changes**: 32-bar AABA, A = turnaround, B = D7–G7–C7–F7 (circle of 5ths)
- **Jazz Blues**: 12 bars, bars 9–10 = ii–V (thay V–IV classical), bars 11–12 = turnaround
- **Shell voicings**: root + 3rd + 7th — minimum cần thiết để định danh chord
- **Rootless voicings**: bỏ root, giữ 3rd + 7th + extensions — tiếng Jazz piano/guitar thực thụ
- **Avoid note**: ♮11 trên major chord, ♭9 interval giữa chord tones gần nhau

---

## Đáp án Bài tập 12.1

1. **Key F**: Gm7 – C7 – Fmaj7
2. **Key Bb**: Cm7 – F7 – Bbmaj7
3. **Key G**: Am7 – D7 – Gmaj7
4. **Key Eb**: Fm7 – Bb7 – Ebmaj7

## Đáp án Bài tập 12.3

1. Am7 (ii/G) → **D Dorian** (A Dorian)
2. D7 (V/G) → **D Mixolydian** hoặc **D Altered** (nếu alt)
3. Gmaj7 (I/G) → **G Ionian** hoặc **G Lydian** (#11)
4. Bm7b5 (ii/Am) → **B Locrian** (từ C major parent)
5. E7 (V/Am) → **E HM5** (harmonic minor 5th mode = E Phrygian dominant)

---

## References

- Mark Levine — *The Jazz Theory Book*, Ch. 2–6
- Open Music Theory — *ii–V–I* (viva.pressbooks.pub)
- Wikipedia — *Jazz harmony*, *Chord-scale system*
- Learn Jazz Standards — *Ultimate Guide to Jazz Theory*
- *Autumn Leaves* (Kosma, 1945) — sequential ii–V–I
- *All The Things You Are* (Kern, 1939) — multi-key ii–V–I
- *I Got Rhythm* (Gershwin, 1930) — Rhythm Changes source
