---
title: "03. Voice Leading & Smooth Motion"
tags: [music-theory, harmony, voice-leading, counterpoint, lesson-03]
aliases: [Voice Leading]
created: 2026-03-25
---

> **Prerequisites**: [[01-all-7th-chords|01. All 7th Chords]], [[02-diatonic-harmony|02. Diatonic Harmony]] — biết 7th chords, Roman numeral, và ii–V–I
> **Objectives**:
> - Phân biệt 4 kiểu chuyển động giọng: parallel, contrary, oblique, similar
> - Hiểu tại sao parallel perfect 5th và octave bị cấm trong Classical
> - Áp dụng 2 nguyên tắc cốt lõi: common tone retention và stepwise motion
> - Giải quyết đúng tendency tones: leading tone và chordal 7th
> - Nghe và viết guide tone line cho ii–V–I trên guitar

---

## Motivation

Tưởng tượng bạn nghe một bản nhạc bốn bè (SATB) của Bach — mỗi giọng chuyển động độc lập, nhưng khi kết hợp lại tạo ra hòa âm hoàn hảo. Không có cảm giác "nhảy cóc", không có âm thanh kỳ lạ, mọi thứ trôi chảy như nước. Đó là **voice leading** đỉnh cao.

Ngược lại, hãy thử chơi hai giọng này:

```abc
X:1
T:Parallel 5ths — nghe "rỗng" va "co"
M:4/4
L:1/4
Q:80
K:C
V:1
"^C"c4 | "^D"d4 |]
V:2
"^G"G4 | "^A"A4 |]
```

C–G rồi D–A: hai perfect 5th song song. Nghe "hollow", "archaic" — hai giọng "hòa tan" vào nhau thay vì độc lập. Đây là parallel 5ths — lỗi cơ bản nhất trong Classical voice leading.

Voice leading không phải là luật lệ cứng nhắc — đó là **ngữ pháp của chuyển động hòa âm**. Hiểu nó, bạn sẽ nghe nhạc khác đi hoàn toàn, và viết chord progression tự nhiên hơn rất nhiều.

---

## Concept / Theory

### 4 Kiểu Chuyển Động Giọng

Khi hai giọng (voice) cùng di chuyển từ chord này sang chord khác, có bốn cách chúng tương tác:

> [!definition] Definition 3.1 — 4 Kiểu Motion
>
> | Kiểu | Định nghĩa | Đặc điểm |
> |------|-----------|----------|
> | **Parallel motion** | Hai giọng cùng chiều, cùng interval | Giọng "gắn chặt" — nguy cơ parallel 5th/8ve |
> | **Contrary motion** | Hai giọng ngược chiều | Độc lập nhất — được ưu tiên trong Classical |
> | **Oblique motion** | Một giọng đứng yên, một giọng di chuyển | Ổn định — common tone tự nhiên |
> | **Similar motion** | Cùng chiều nhưng khác interval | Trung tính — chấp nhận được |

```abc
X:2
T:4 Kieu Motion — so sanh
M:4/4
L:1/4
Q:72
K:C
V:1
"^Parallel"c2 d2 | "^Contrary"c2 d2 | "^Oblique"c4 | "^Similar"c2 e2 |]
V:2
e2 f2 | g2 f2 | e2 f2 | g2 a2 |]
```

*Giải thích từng bar:*
- **Bar 1** (Parallel): V1 lên step C→D, V2 lên step E→F — cùng chiều, cùng interval (M2)
- **Bar 2** (Contrary): V1 lên C→D, V2 xuống G→F — ngược chiều
- **Bar 3** (Oblique): V1 đứng yên trên C, V2 lên E→F
- **Bar 4** (Similar): V1 lên C→E (M3), V2 lên G→A (M2) — cùng chiều, khác interval

---

### Parallel Perfect 5th và Octave — Tại Sao Bị Cấm?

> [!danger] Rule 3.2 — Forbidden Parallels (Classical Style)
> **Parallel perfect 5th (P5||)** và **parallel perfect octave (P8||)** bị cấm hoàn toàn trong Common Practice voice leading (Baroque → Classical → Romantic).
>
> *Lý do âm học*: P5 và P8 có overtone series rất "sạch" — khi hai giọng cùng di chuyển song song ở những interval này, chúng **hòa tan vào nhau** thay vì giữ độc lập. Bạn nghe hai giọng trở thành một.

```abc
X:3
T:Parallel 5ths BAD vs Contrary Motion GOOD
M:4/4
L:1/4
Q:80
K:C
V:1
"^BAD: P5||"c4 | d4 | z4 | "^GOOD: Contrary"c4 | d4 |]
V:2
G,4 | A,4 | z4 | G,4 | F,4 |]
```

*Nghe sự khác biệt*:
- **BAD** (bar 1–2): C–G rồi D–A = P5 → P5. Âm thanh "empty", "medieval"
- **GOOD** (bar 4–5): V1 lên C→D, V2 xuống G→F. Hai giọng độc lập, âm thanh phong phú hơn

> [!note] Ngoại lệ trong Jazz và Pop
> Jazz và Pop **không** cấm parallel motion. "Parallel planing" — dịch cả chord theo cùng hướng — là kỹ thuật phổ biến trong Debussy, Bill Evans, và modern Jazz. Quy tắc trên áp dụng cho **Classical/Baroque style** và SATB writing.

---

### Hai Nguyên Tắc Cốt Lõi: CTS và CMN

Khi viết voice leading, hãy áp dụng theo thứ tự ưu tiên:

> [!definition] Definition 3.3 — CTS: Common Tone Substitution
> **Bước 1**: Tìm nốt chung (common tone) giữa hai chord. Giữ nốt đó ở **cùng một giọng** — không di chuyển.
>
> Ví dụ: I (C–E–G) → IV (F–A–C): **C là common tone** → giữ C ở chỗ cũ.
>
> Ưu tiên: nếu có common tone → **bắt buộc dùng CTS**.

> [!definition] Definition 3.4 — CMN: Contrary Motion to Nearest
> **Bước 2**: Nếu không có common tone → các giọng trên di chuyển **ngược chiều với bass**, đến nốt gần nhất của chord mới.
>
> Ví dụ: IV (F–A–C) → V (G–B–D): không có common tone → upper voices di chuyển contrary to bass.

```abc
X:4
T:CTS — Common tone I to IV
M:4/4
L:1/4
Q:80
K:C
V:1
"^I"e4 | "^IV"f4 |]
V:2
"^C stays"c4 | c4 |]
```

*Ở đây*: I = C–E–G, IV = F–A–C. C là common tone → V2 giữ nguyên C. V1 di chuyển E→F (step lên) — stepwise motion, nhẹ nhàng.

---

### Tendency Tones — Nốt "Có Hướng"

Một số nốt trong scale có **xu hướng chuyển động mạnh** về một nốt nhất định:

> [!definition] Definition 3.5 — Tendency Tones
>
> | Nốt | Tên | Xu hướng | Lý do |
> |-----|-----|----------|-------|
> | Bậc 7 (ti) | **Leading tone** | Resolve **lên** half step → tonic (bậc 1) | Chỉ cách tonic 1 half step |
> | Chordal 7th | **Seventh của chord** | Resolve **xuống** step | Dissonance muốn về consonance |
> | Bậc 4 (fa) | **Subdominant tone** | Resolve **xuống** half step → bậc 3 | Đặc biệt trong V7 → I |

```abc
X:5
T:Tendency tones — V7 resolves to I
M:4/4
L:1/4
Q:80
K:C
V:1
"^V7: B(ti) → up to C"B4 | c4 |]
V:2
"^V7: F(fa) → down to E"f4 | e4 |]
```

*Giải thích*:
- **B** (leading tone = ti trong C) → **C** (tonic): lên half step ✓
- **F** (fa trong C, cũng là 7th của G7) → **E** (mi = 3rd của Cmaj7): xuống half step ✓

Đây là hai nốt tạo ra **tritone** trong G7 (B–F = d5/tritone). Tritone này "muốn" resolve theo chiều ngược nhau (B lên, F xuống) — đó là **lực kéo** mạnh nhất trong tonal harmony.

---

### Guide Tones — Linh Hồn của Jazz Voice Leading

Trong Jazz, khái niệm **guide tones (nốt dẫn đường)** giúp bạn voice lead trơn tru qua mọi progression:

> [!definition] Definition 3.6 — Guide Tones
> **Guide tones** là **bậc 3 và bậc 7** của mỗi chord. Chúng là hai nốt:
> - **Xác định chất lượng chord** (major/minor/dominant)
> - **Di chuyển trơn tru nhất** khi chuyển chord — thường bằng half step hoặc common tone

**Điều kỳ diệu trong ii–V–I**: guide tones tự nhiên voice lead hoàn hảo qua ba chord:

| Chord | 3rd | 7th | Chuyển động |
|-------|-----|-----|-------------|
| **Dm7** (ii) | F | C | — |
| **G7** (V) | B | F | C→B (½ step ↓), F stays |
| **Cmaj7** (I) | E | B | F→E (½ step ↓), B stays |

Hai guide tone luân phiên: một nốt **giữ nguyên** (common tone), nốt kia **di chuyển half step**. Đây là voice leading đẹp nhất có thể có!

```abc
X:6
T:Guide tones — ii-V-I voice leading
M:4/4
L:1/4
Q:80
K:C
V:1 name="Upper guide tone"
"^Dm7: 3rd"f4 | "^G7: 7th"f4 | "^Cmaj7: 3rd"e4 |]
V:2 name="Lower guide tone"
"^Dm7: 7th"c4 | "^G7: 3rd"B4 | "^Cmaj7: 7th"B4 |]
```

*Phân tích*:
- **V1**: F (3rd Dm7) → F (7th G7, giữ!) → E (3rd Cmaj7, xuống ½ step)
- **V2**: C (7th Dm7) → B (3rd G7, xuống ½ step) → B (7th Cmaj7, giữ!)

Đây là lý do ii–V–I "nghe hay" một cách tự nhiên — voice leading đã được tối ưu sẵn trong cấu trúc của nó.

---

### Full 4-Voice Example: ii–V–I với Đầy Đủ Chord Tones

```abc
X:7
T:ii-V-I — 4-voice SATB style
M:4/4
L:1/4
Q:72
K:C
V:1 name="Soprano"
a4 | g4 | g4 |]
V:2 name="Alto"
f4 | f4 | e4 |]
V:3 name="Tenor"
d4 | B4 | c4 |]
V:4 name="Bass"
D,4 | G,4 | C,4 |]
```

*Phân tích từng giọng*:
- **Bass**: D → G → C (root motion xuống 5th — vòng circle of fifths)
- **Tenor**: D→B (di chuyển step) → C (di chuyển step) — smooth
- **Alto**: F stays (common tone G7) → E (half step ↓, resolve fa→mi) ✓
- **Soprano**: A→G (step ↓) → G stays (common tone Cmaj7) ✓

Không có parallel 5ths, không có parallel 8ths, leading tone giải quyết đúng — đây là 4-part voice leading chuẩn Classical.

---

## Musical Examples

### Bach Chorale Style — Phân Tích I–IV–I–V–I

Bach's 371 chorales là "textbook" voice leading hoàn hảo. Pattern cơ bản nhất:

```abc
X:8
T:Bach Chorale style — I-IV-I-V-I in C
M:4/4
L:1/4
Q:66
K:C
V:1 name="Soprano"
e4 | f4 | e4 | d4 | c4 |]
V:2 name="Bass"
C,4 | F,4 | C,4 | G,4 | C,4 |]
```

*Nguyên tắc áp dụng*:
- I → IV: C common tone (bass moved F, soprano moved E→F by step)
- IV → I: C common tone trở lại
- I → V: soprano D→ làm leading tone (B trong G, sẽ đi lên)
- V → I: resolve hoàn chỉnh

---

### Jazz Comping — Guide Tone Voice Leading Trên Guitar

Đây là cách guitarist Jazz chơi "shell voicings" — chỉ root + guide tones (3rd + 7th), bỏ 5th:

```abc
X:9
T:Shell voicings — Jazz comping ii-V-I in C
M:4/4
L:1/4
Q:100
K:C
V:1 name="Guide tones (3rd+7th)"
[Fc]4 | [Bf]4 | [Be]4 |]
V:2 name="Root (bass)"
D,4 | G,4 | C,4 |]
```

*Nghe*: chỉ 3 nốt mỗi chord nhưng âm thanh đầy đủ và professional — vì 3rd + 7th **định nghĩa** chord, còn 5th có thể bỏ.

---

### Bossa Nova — Jobim's Voice Leading (Ví dụ từ *Garota de Ipanema*)

Jobim nổi tiếng với voice leading trơn tru, notes luôn di chuyển gần nhau. Đây là pattern harmony đặc trưng:

```abc
X:10
T:Bossa-style voice leading — Fmaj7 to G7
M:4/4
L:1/4
Q:110
K:F
V:1 name="Melody/chord top"
"^Fmaj7"a4 | "^G7"b4 |]
V:2 name="Inner voice"
"^Fmaj7"e4 | "^G7"f4 |]
V:3 name="Bass"
"^Fmaj7"F,4 | "^G7"G,4 |]
```

*Nhận xét*: Inner voice di chuyển E→F (step lên), melody A→B (step lên) — song song theo 3rds, một kỹ thuật Jobim và Debussy dùng nhiều (parallel planing trong Jazz = cho phép).

---

## Guitar Application

### Shell Voicings — Công Cụ Voice Leading Cơ Bản Nhất của Guitarist Jazz

Shell voicing = Root (bass) + Guide tones (3rd + 7th). Bỏ 5th. Kết quả: chord nhẹ, dễ chuyển, voice leading tự nhiên.

**Dm7 → G7 → Cmaj7 shell voicings:**

```
Dm7 shell (root D, string 4):
e  ── x
B  ── 1  (C — 7th)
G  ── 2  (A — 5th, optional)
D  ── 0  (D — root)    ← root
A  ── x
E  ── x

Chỉ guide tones:
e  ── x
B  ── 1  (C — 7th) ← guide tone
G  ── x
D  ── x
A  ── 5  (D — root)  
E  ── x
... thực tế guitarist dùng:
e  ── x            e  ── x            e  ── x
B  ── 6  (C—7th)   B  ── 6  (F—7th)   B  ── 5  (E—3rd)
G  ── 7  (A—5th)   G  ── 7  (D—5th)   G  ── 5  (G—5th)
D  ── 7  (F—3rd)   D  ── 5  (B—3rd)   D  ── 5  (C—root) ← double
A  ── 5  (D—root)  A  ── 5  (G—root)  A  ── 3  (C—root)
E  ── x            E  ── x            E  ── x
   Dm7                 G7                 Cmaj7
```

> [!example] Guitar Practice 3.1 — Voice Leading Observation
> Bấm 3 chord trên liên tiếp và theo dõi:
> - String B: C (fret 6) → F (fret 6, giữ nguyên!) → E (fret 5, di chuyển 1 fret ↓)
> - String G: A (fret 7) → D (fret 7, giữ nguyên!) → G (fret 5... di chuyển 2 frets ↓)
>
> Bạn **thấy** guide tone voice leading trên fretboard!

---

### Nhận Biết Voice Leading Khi Nghe

Lần sau khi nghe một bài Jazz/Bossa, chú ý inner voices của piano hoặc guitar:

- Nếu notes **gần nhau** (di chuyển ít, half step hoặc whole step) → voice leading tốt
- Nếu notes **nhảy xa** mà không có lý do → voice leading lười biếng
- Nếu bass đi xuống theo chromatic (Ab → G → Gb...) → descending chromatic bass line, rất đặc trưng

---

## Practice

> [!example] Bài tập 3.1 — Phân loại motion
> Nhìn các cặp note sau và xác định kiểu motion (parallel/contrary/oblique/similar):
>
> 1. V1: C→D, V2: G→A
> 2. V1: E→F, V2: C→B
> 3. V1: G→G (đứng yên), V2: C→D
> 4. V1: C→E (lên 3rd), V2: G→B (lên 3rd)
> 5. V1: A→G (xuống), V2: C→E (lên)

> [!example] Bài tập 3.2 — Tìm parallel 5ths
> Progression sau có parallel 5ths ở đâu? Sửa lại bằng contrary motion:
>
> V1: C → D → E
> V2: G → A → B

> [!example] Bài tập 3.3 — Viết guide tone line
> Cho progression: **Fm7 → Bb7 → Ebmaj7** (ii–V–I trong Eb major)
>
> Tìm guide tones (3rd và 7th) của từng chord:
> - Fm7: 3rd = ?, 7th = ?
> - Bb7: 3rd = ?, 7th = ?
> - Ebmaj7: 3rd = ?, 7th = ?
>
> Sau đó viết guide tone line trơn tru (similar to Example X:6).

> [!example] Bài tập 3.4 — Guitar
> Tập shell voicings ii–V–I trong các key sau, chú ý sự chuyển động của các ngón tay trên fretboard:
> - Key C: Dm7 → G7 → Cmaj7
> - Key F: Gm7 → C7 → Fmaj7
> - Key Bb: Cm7 → F7 → Bbmaj7

---

## Summary / Key Takeaways

- **4 kiểu motion**: parallel (cùng chiều cùng interval), contrary (ngược chiều), oblique (một đứng yên), similar (cùng chiều khác interval)
- **Forbidden (Classical)**: parallel perfect 5ths và octaves — hai giọng "hòa tan", mất độc lập
- **Ưu tiên 1 — CTS**: tìm common tone trước, giữ nguyên ở cùng giọng
- **Ưu tiên 2 — CMN**: nếu không có common tone, upper voices di chuyển contrary to bass, đến note gần nhất
- **Tendency tones**: leading tone (ti) → lên half step vào tonic; chordal 7th (fa trong V7) → xuống half step
- **Guide tones (3rd + 7th)**: trong ii–V–I, chúng alternately giữ nguyên và di chuyển half step — voice leading "miễn phí"
- **Jazz**: parallel planing được phép — quy tắc Classical không bắt buộc, nhưng nguyên tắc smooth motion vẫn áp dụng

---

## Đáp án Bài tập

**3.1**: (1) Parallel, (2) Contrary, (3) Oblique, (4) Parallel, (5) Contrary

**3.2**: C→D→E (V1) và G→A→B (V2) → P5 ở C–G, P5 ở D–A, P5 ở E–B → toàn bộ là parallel 5ths!
Sửa: giữ V2 trên G: V2 = G → G → A (oblique rồi mới di chuyển), hoặc V2 đi ngược: G → F → E (contrary).

**3.3**:
- Fm7: 3rd = Ab, 7th = Eb
- Bb7: 3rd = D, 7th = Ab — **Ab stays** (common tone!), Eb → D (half step ↓)
- Ebmaj7: 3rd = G, 7th = D — **D stays**, Ab → G (half step ↓)

Guide tone line: Ab → Ab → G (upper); Eb → D → D (lower)

---

## References

- Walter Piston — *Harmony* (5th ed.), Ch. 5: Voice Leading
- Open Music Theory — *Voice Leading* (openmusictheory.github.io)
- Berklee Online — *Voice Leading Paradigms for Harmony* (John Thomas)
- Learn Jazz Standards — *How to Use Voice Leading in Your Solos*
- Music Theory for the 21st Century — *Guide Tones* (musictheory.pugetsound.edu)
