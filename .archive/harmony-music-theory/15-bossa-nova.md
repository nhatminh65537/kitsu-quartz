---
title: "15. Bossa Nova & Latin Harmony"
tags: [music-theory, harmony, bossa-nova, latin-jazz, jobim, lesson-15]
aliases: [Bossa Nova, Latin Harmony, Batida, Jobim]
created: 2026-03-25
---

> **Prerequisites**: [[12-jazz-harmony-fundamentals|12. Jazz Harmony Fundamentals]], [[13-chord-substitutions|13. Chord Substitutions]], [[11-modal-harmony|11. Modal Harmony]] — ii–V–I, tritone sub, extensions, Lydian/Dorian
> **Objectives**:
> - Hiểu lịch sử và đặc trưng phong cách Bossa Nova
> - Nắm **batida rhythm** — kỹ thuật guitar đặc trưng của João Gilberto
> - Nhận ra ngôn ngữ hòa âm Jobim: maj7#11, tritone subs, chord quality substitution
> - Phân tích A section và B section của *The Girl from Ipanema*
> - Áp dụng bossa nova comping trên guitar: thumb bass + syncopated chords

---

## Motivation

Rio de Janeiro, cuối thập niên 1950s. Hai nhạc sĩ ngồi trong một quán bar nhỏ ở Ipanema — Antonio Carlos Jobim và Vinicius de Moraes — quan sát một cô gái đi ngang qua mỗi ngày trên đường ra biển. Từ đó ra đời *Garota de Ipanema* (1962), bài nhạc được cover nhiều thứ nhì trong lịch sử âm nhạc thế giới.

Bossa Nova = Samba + Jazz. Cụ thể hơn: **nhịp Samba syncopated** của João Gilberto trên nền **hòa âm Jazz mở rộng** của Jobim. Kết quả là một thứ nhạc vừa phức tạp vừa thư thái, vừa Châu Mỹ vừa Châu Âu, không thể nhầm lẫn với bất kỳ thứ gì khác.

```abc
X:1
T:Bossa Nova feel — Fmaj7 with basic batida
M:4/4
L:1/8
Q:160
K:F
%%MIDI program 24
"^Fmaj7"[F,A,CE]2 [A,CE]2 [A,CE]2 [A,CE]2 |
[F,A,CE]2 [A,CE] z [A,CE]2 [A,CE] z |]
```

*Nốt bass (F,)* = thumb bass trên beat 1 và beat 3; *[A,CE] = chord stabs* syncopated phía trên — đây là essence của batida guitar.

---

## Lịch Sử & Bối Cảnh

> [!definition] Definition 15.1 — Bossa Nova
> **Bossa Nova** (tiếng Bồ Đào Nha: "new wave" / "new trend") = phong trào âm nhạc Brazil cuối thập niên 1950s, ra đời ở Rio de Janeiro.
>
> **Nguồn gốc**:
> - **Samba**: nhịp điệu Afro-Brazilian, syncopation, habanera-derived patterns
> - **Cool Jazz Mỹ**: hòa âm mở rộng (7th, 9th, 13th), Miles Davis, Bill Evans
> - **Nhạc cổ điển**: Debussy, Villa-Lobos — ảnh hưởng đến Jobim về color và texture
>
> **Nhân vật chính**:
> - **Antônio Carlos Jobim** (1927–1994) — nhà soạn nhạc, "cha đẻ" Bossa Nova
> - **João Gilberto** (1931–2019) — guitar/vocals, phát minh batida rhythm
> - **Stan Getz** — saxophonist Jazz Mỹ đưa Bossa Nova ra thế giới (album *Getz/Gilberto*, 1964)
>
> **Đặc trưng âm nhạc**: nylon-string guitar, hòa âm phức tạp, giọng hát mềm mại (không vibrato), nhịp không nặng nề như swing — "sways" thay vì "swings".

---

## Concept / Theory

### Batida Rhythm — Trái Tim Của Bossa Nova

> [!definition] Definition 15.2 — Batida
> **Batida** = kỹ thuật guitar của João Gilberto: **thumb bass** (ngón cái chơi root và 5th) kết hợp với **syncopated chord stabs** (các ngón còn lại).
>
> Bass: nhấn mạnh beats 1 và 3 (hoặc root + 5th thay nhau)
> Chords: syncopated, thường lệch khỏi downbeat — tạo cảm giác floating

```abc
X:2
T:Batida pattern — 2-bar basic cycle (key C)
M:4/4
L:1/8
Q:160
K:C
V:1 name="Chord stabs"
z2 [EGB]2 z [EGB] z2 | [EGB] z [EGB]2 z [EGB]2 |]
V:2 name="Thumb bass"
C,4 G,4 | C,4 G,4 |]
```

*Bass* đi root (C) → 5th (G) → root → 5th mỗi beat, giữ groove steady.
*Chords* syncopated — không bao giờ đúng downbeat — tạo sự lơ lửng đặc trưng.

---

### Ngôn Ngữ Hòa Âm Jobim

Jobim dùng một số "signature moves" harmonic rất nhận ra được:

#### 1. II7 — Dominant Supertonic

Thay vì iim7 diatonic, Jobim thường dùng **II7** (major dominant chord trên bậc 2):

> [!definition] Definition 15.3 — II7 (Dominant Supertonic)
> Trong key F: II7 = **G7** (thay vì Gm7 diatonic)
>
> G7 trong F major = secondary dominant (V/V) hoặc chord đặc trưng của "Take the A Train" / "Girl from Ipanema".
>
> Màu sắc: sáng hơn Gm7, có leading tone F# (enharmonic Gb = ♭7 của G), tạo cảm giác floating.

```abc
X:3
T:Jobim II7 — G7#11 vs Gm7 in F major
M:4/4
L:1/4
Q:100
K:F
"^Fmaj7"[FAce]2 "^Gm7 (diatonic)"[G_Bdf]2 | "^Fmaj7"[FAce]4 |
"^Fmaj7"[FAce]2 "^G7#11 (Jobim)"[GBd^c]2 | "^Fmaj7"[FAce]4 |]
```

*Gm7* (diatonic): tối và stable
*G7#11* (Jobim II7): sáng, floating — C# = #11 của G tạo Lydian Dominant color đặc trưng

---

#### 2. Tritone Sub (♭II7) — *Garota de Ipanema*

Jobim thường dùng **♭II7** (tritone sub của V) thay vì V7 thông thường:

> [!definition] Definition 15.4 — ♭II7 trong Bossa Nova
> Trong key F: V7 = C7, tritone sub = **Gb7** (♭II7)
>
> Kết quả bass line: Gm7 → **Gb7** → Fmaj7 — chromatic descent G→Gb→F.
>
> Đây là một trong những progressions đặc trưng nhất của *The Girl from Ipanema*.

```abc
X:4
T:ii-V-I vs ii-bII7-I — Jobim's chromatic sub
M:4/4
L:1/4
Q:100
K:F
"^Gm7"[G_Bdf]2 "^C7"[CFG_B]2 | "^Fmaj7"[FAce]4 |
"^Gm7"[G_Bdf]2 "^Gb7"[_G_Bd_f]2 | "^Fmaj7"[FAce]4 |]
```

---

#### 3. Chord Quality Substitution

Jobim thường thay đổi **chất lượng chord** (major/minor/dominant) trên cùng root trong các repeat:

```abc
X:5
T:Chord quality substitution — F root cycling
M:4/4
L:1/4
Q:90
K:F
"^Fmaj7"[FAce]4 | "^Fm7"[F_Ace]4 | "^Fmaj7"[FAce]4 | "^F6"[FACD]4 |]
```

*Cùng root F*, melody note C nằm trên mỗi chord (chord tone hoặc available tension). Đây là kỹ thuật Jobim dùng trong *Corcovado*, *Wave*, và nhiều bài khác.

---

#### 4. Lydian Dominant Color (maj7#11)

Jobim yêu thích **maj7#11** (Lydian color) — tạo cảm giác floating, ambiguous:

```abc
X:6
T:Lydian color — maj7#11 in Bossa context
M:4/4
L:1/4
Q:100
K:F
"^Fmaj7#11"[FA^Bce]4 | "^Gm9"[G_Bdfa]4 | "^C7alt"[CGBd]4 | "^Fmaj7#11"[FA^Bce]4 |]
```

*Fmaj7#11*: B natural (= #4̂ của F, Lydian note) tạo ra màu sắc open, dreamy. Rất đặc trưng *Meditation*, *Triste*, *Dindi*.

---

## Musical Examples

### *The Girl from Ipanema* — Phân Tích A Section (Key F)

```abc
X:7
T:Girl from Ipanema — A section (key F)
M:4/4
L:1/4
Q:160
K:F
"^Fmaj7"[FAce]4 | "^Fmaj7"[FAce]4 | "^G7"[GBdf]4 | "^G7"[GBdf]4 |
"^Gm7"[G_Bdf]2 "^Gb7"[_G_Bd_f]2 | "^Fmaj7"[FAce]4 |]
```

**Phân tích A section**:
| Bar | Chord | Function | Ghi chú |
|-----|-------|----------|---------|
| 1–2 | Fmaj7 | I | Tonic, ổn định |
| 3–4 | G7 (#11) | II7 | Dominant supertonic, floating |
| 5 | Gm7–Gb7 | ii–♭II7 | ii–tritone sub, chromatic bass G→Gb |
| 6 | Fmaj7 | I | Resolve |

*Chromatic bass line* ở bar 5: G → Gb → F = descending half steps, đặc trưng nhất của bài này.

---

### *The Girl from Ipanema* — B Section (Key Gb/Db)

Bridge nhảy bất ngờ sang Gb major — tritone từ C major:

```abc
X:8
T:Girl from Ipanema — B section modulation
M:4/4
L:1/4
Q:160
K:_G
"^Gbmaj7"[_G_Bdf]4 | "^Gbmaj7"[_G_Bdf]4 | "^B7"[BD^FA]4 | "^B7"[BD^FA]4 |
[K:_D]"^Ebm7"[_E_G_B_d]4 | "^Ab7"[_A_CEG]4 | "^Dbmaj7"[_D_FAc]4 | z4 |]
```

*B section* oscillate: Gbmaj7 (= IV của Db) → B7 (V của E, chromatic mediant) → Ebm7–Ab7 (ii–V trong Db) → Dbmaj7. Không bao giờ resolve về F trong B section — tạo harmonic suspension rất Jobim.

---

### *Corcovado* — iv7 và ♭VII7

*Corcovado* (Quiet Nights and Quiet Stars) dùng minor iv và ♭VII dominant:

```abc
X:9
T:Corcovado-style — iv7 and bVII7
M:4/4
L:1/4
Q:90
K:C
"^Cmaj7"[CEGB]4 | "^Cm7 (iv)"[C_EG_B]4 | "^F7 (bVII7)"[CF_GA]4 | "^Cmaj7"[CEGB]4 |]
```

*Cm7* = iv (borrowed chord, ♭3 = Eb) → *F7* = ♭VII7 (backdoor dominant) → *Cmaj7* (tonic). Màu sắc melancholic đặc trưng của bài này.

---

### *Wave* — Asymmetric Phrase Structure

*Wave* (Jobim, 1967) nổi tiếng với **asymmetric phrases** — 3-bar và 5-bar thay vì 4-bar thông thường:

```abc
X:10
T:Wave-style — asymmetric phrase (3+5)
M:4/4
L:1/4
Q:110
K:D
"^Dmaj7"[D^FA^c]4 | "^Em7"[E^GAB]4 | "^A7"[A^ceg]4 |
"^Dmaj7"[D^FA^c]4 | "^G#m7b5"[^G^Bde]4 | "^C#7"[^C^E^Ga]4 | "^F#m7"[^FAce]4 | "^B7"[BD^fa]4 |]
```

*3 bars* (Dmaj7–Em7–A7) + *5 bars* tiếp = 8 bars tổng nhưng phraseo lạ. Jobim không ngại phá vỡ 4-bar symmetry — đó là một phần cá tính của ông.

---

## Guitar Application

### Batida Guitar — Kỹ Thuật Thực Hành

> [!example] Guitar Practice 15.1 — Basic batida pattern (Fmaj7)
>
> ```
> Fmaj7 voicing (shell):
> e ── 0  (E... wait, not in Fmaj7)
> B ── 1  (C — 5th)
> G ── 2  (A — 3rd)
> D ── 3  (F — root)
> A ── x
> E ── 1  (F — root bass, thumb)
>
> Batida pattern (4/4, L=1/8):
> Beat:  1  +  2  +  3  +  4  +
> Bass:  F           F
> Chord:    [ACE]  [ACE]  [ACE]  [ACE] (syncopated)
> ```
>
> **Ngón cái** đánh bass trên beat 1 (root) và beat 3 (5th hoặc root lại).
> **Ngón 2–4** đánh chord stabs vào các upbeat và offbeat — KHÔNG đúng downbeat.

> [!example] Guitar Practice 15.2 — ii–bII7–I Jobim progression
>
> Chơi progression: **Gm7 → Gb7 → Fmaj7** (key F)
>
> ```
> Gm7 (root G, A-string fret 10):
>   e──8  B──8  G──8  D──10  A──10  E──8
>
> Gb7 (root Gb, A-string fret 9 — slide xuống 1 fret):
>   e──7  B──7  G──7  D──9   A──9   E──7
>
> Fmaj7 (root F, A-string fret 8):
>   e──5  B──5  G──5  D──7   A──8   E──x
>   (hoặc open position: 0-1-2-3-x-1)
> ```
>
> Nghe bass line đi G→Gb→F — chromatic descent 2 half steps. Đây là âm thanh *Girl from Ipanema*.

---

## Practice

> [!example] Bài tập 15.1 — Nhận diện Bossa Nova devices
> Cho progression sau (key C), xác định kỹ thuật Jobim:
>
> Cmaj7 – **D7** – Em7 – **Eb7** – Dm7 – **Db7** – Cmaj7
>
> 1. D7 ở đây là gì (so với Dm7 diatonic)?
> 2. Eb7 là tritone sub của chord nào?
> 3. Db7 là tritone sub của chord nào?
> 4. Bass line là gì (chỉ root của mỗi chord)?

> [!example] Bài tập 15.2 — Viết batida progression
> Trong key **G major**, viết 4-bar progression theo phong cách Jobim:
> - Bar 1–2: I (Gmaj7)
> - Bar 3: II7 (A7#11) hoặc iim7 (Am7) — chọn một
> - Bar 4: ♭II7 (Ab7) → Gmaj7
>
> Thêm batida rhythm notation (đơn giản) cho guitar.

> [!example] Bài tập 15.3 — Transcription
> Nghe *The Girl from Ipanema* (Getz/Gilberto, 1964). Trong A section:
> - Có bao nhiêu bars trên Fmaj7?
> - Chord gì xuất hiện ở bars 3–4?
> - Bass đi như thế nào ở bar 5?

---

## Summary / Key Takeaways

- **Bossa Nova** = Samba rhythm + Jazz harmony, Ra đời Rio de Janeiro ~1958
- **Batida** = thumb bass (roots 1 và 3) + syncopated chord stabs — KHÔNG đánh đúng downbeat
- **II7** (dominant supertonic) = đặc trưng Jobim, thay iim7 diatonic — G7 trong F major
- **G7#11** = Lydian Dominant color — floating, sáng, không resolve như V7 thông thường
- **♭II7** (tritone sub của V) = tạo chromatic bass descent ii→♭II→I
- **Chord quality substitution**: Fmaj7→Fm7→Fmaj7→F6 — same root, khác quality
- **maj7#11** = Lydian color, đặc trưng *Meditation*, *Triste*, *Dindi*
- **Asymmetric phrases**: Jobim không ngại 3-bar hay 5-bar phrases — *Wave* nổi tiếng
- Guitar: nylon-string, fingerstyle, shell voicings với extensions, bass thumb + chord fingers
- *Girl from Ipanema* B section = tritone modulation đến Gb/Db — không bao giờ resolve về F

---

## Đáp án Bài tập 15.1

Bass line (roots): C – D – E – Eb – D – Db – C

1. **D7** = Dominant Supertonic (II7) — thay Dm7 diatonic, sáng hơn, Lydian color
2. **Eb7** = tritone sub của **A7** (V/ii = secondary dominant)
3. **Db7** = tritone sub của **G7** (V trong C major)
4. Bass: C→D→E→**Eb→D→Db→C** = chromatic descent 3 half steps cuối bài

---

## References

- Mark Levine — *The Jazz Theory Book*, Ch. 21: Bossa Nova
- Learn Jazz Standards — *Bossa Nova Chord Progressions*, *Girl from Ipanema Chords*
- Piano With Jonny — *The Jobim Chord Progression*
- Guitar World — *Hole Notes: The Bossa Nova Rhythms of Antonio Carlos Jobim*
- *The Girl from Ipanema* / *Garota de Ipanema* (Jobim/Vinicius de Moraes, 1962)
- *Corcovado* / *Quiet Nights* (Jobim, 1960)
- *Wave* (Jobim, 1967)
- *Getz/Gilberto* album (Stan Getz & João Gilberto, 1964)
