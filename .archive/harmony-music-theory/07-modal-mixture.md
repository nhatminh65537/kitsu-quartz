---
title: "07. Modal Mixture & Borrowed Chords"
tags: [music-theory, harmony, modal-mixture, borrowed-chords, lesson-07]
aliases: [Modal Mixture, Borrowed Chords, Modal Interchange]
created: 2026-03-25
---

> **Prerequisites**: [[02-diatonic-harmony|02. Diatonic Harmony]], [[06-secondary-dominants|06. Secondary Dominants]] — Roman numerals, diatonic chords, tonicization; biết parallel major/minor là gì
> **Objectives**:
> - Hiểu khái niệm modal mixture: mượn chord từ parallel minor vào major key
> - Nhận ra và viết 5 borrowed chord phổ biến nhất: iv, ♭VI, ♭VII, ♭III, ii°
> - Phân biệt modal mixture với tonicization và modulation
> - Nhận dạng Picardy third (mượn từ parallel major vào minor)
> - Phân tích borrowed chords trong Classical, Rock, Pop, Jazz, Bossa

---

## Motivation

Bạn đang nghe một bài nhạc vui tươi trong C major. Bỗng dưng xuất hiện một chord Fm — âm thanh tối đột ngột, melancholic, nhưng ngay sau đó nhạc quay về C. Không có cảm giác "đổi key" — chỉ là một khoảnh khắc màu sắc khác.

```abc
X:1
T:Modal mixture — Fm (iv) appearing in C major
M:4/4
L:1/4
Q:90
K:C
"^I"[CEG]4 | "^IV"[FAc]4 | "^iv"[F_Ac]4 | "^I"[CEG]4 |]
```

*Bar 3*: Fm (F–Ab–C) = iv chord — không có trong C major scale vì Ab là nốt ngoài. Nhưng nó không "sai", nó chỉ **tối hơn** IV — đó là quyền năng của modal mixture.

Đây là kỹ thuật mà Beatles, Radiohead, Jobim, Chopin, Schubert đều dùng để tạo ra những khoảnh khắc cảm xúc không thể đạt được chỉ bằng diatonic chords.

---

## Concept / Theory

### Modal Mixture là gì?

> [!definition] Definition 7.1 — Modal Mixture (Borrowed Chords)
> **Modal mixture** (còn gọi là *borrowed chords* hay *modal interchange*) = dùng chord từ **parallel mode** (cùng root nhưng khác mode) trong một key.
>
> Phổ biến nhất: trong **major key**, mượn chord từ **parallel natural minor**.
>
> Ví dụ: trong C major → mượn chord từ C minor (C–D–Eb–F–G–Ab–Bb)
>
> **Phân biệt với secondary dominant**: secondary dominant *tonicize* một chord diatonic bằng cách tạo V của nó. Borrowed chord *thay thế* một chord diatonic bằng chord cùng bậc nhưng khác quality, mang màu sắc minor.

---

### Parallel Major vs Parallel Minor — So sánh Chord

> [!definition] Definition 7.2 — So sánh diatonic chords C major / C minor
>
> | Bậc | C Major | C minor (nat.) | Accidentals thêm vào |
> |-----|---------|---------------|---------------------|
> | i/I | C major | **c minor** | Eb |
> | ii/ii° | D minor | **D diminished** | Eb, F→F natural |
> | iii/♭III | E minor | **Eb major** | Eb, Bb |
> | IV/iv | F major | **f minor** | Ab |
> | V | G major | g minor* | — |
> | vi/♭VI | A minor | **Ab major** | Ab, Eb |
> | vii°/♭VII | B dim | **Bb major** | Bb |
>
> *V minor ít dùng trong borrowing; harmonic minor cho V major.

Các borrowed chords đều chứa ít nhất một **lowered scale degree** (♭3, ♭6, hoặc ♭7) từ parallel minor.

---

### 5 Borrowed Chords Phổ Biến Nhất (trong Major Key)

#### 1. iv — Minor Subdominant

> [!definition] Definition 7.3 — iv (Minor Subdominant)
> **Trong C major**: Fm (F–Ab–C) — thay thế IV (F–A–C)
>
> **Accidental**: Ab (♭6)
>
> **Màu sắc**: tối, poignant, melancholic hơn IV. Kết hợp tốt với I trước và sau.
>
> **Dùng nhiều trong**: coda (kết thúc nhẹ nhàng), IV → iv → I (Picardy), Jazz ballad.

```abc
X:2
T:IV vs iv — Compare major and minor subdominant
M:4/4
L:1/4
Q:80
K:C
"^IV"[FAc]4 | "^I"[CEG]4 | "^iv"[F_Ac]4 | "^I"[CEG]4 |]
```

*Nghe*: IV → I nghe hoàn chỉnh và sáng; iv → I nghe tối hơn, thiết tha hơn. Cùng function (PD→T) nhưng khác màu hoàn toàn.

---

#### 2. ♭VII — Subtonic (Flat Seven)

> [!definition] Definition 7.4 — ♭VII (Flat Subtonic)
> **Trong C major**: Bb major (Bb–D–F) — thay thế vii° (B dim)
>
> **Accidental**: Bb (♭7) — còn gọi là *subtonic*
>
> **Màu sắc**: mạnh mẽ, "rock", không căng như V nhưng có hướng về I.
>
> **Dùng nhiều trong**: Rock, Pop (rất phổ biến), descending bass lines, Bossa modal progressions.

```abc
X:3
T:bVII — Bb major in C key, rock/pop color
M:4/4
L:1/4
Q:90
K:C
"^I"[CEG]4 | "^bVII"[DF_B]4 | "^IV"[FAc]4 | "^I"[CEG]4 |]
```

Pattern I → ♭VII → IV → I là một trong những vòng Rock/Pop phổ biến nhất lịch sử (*Hey Jude* — Beatles).

---

#### 3. ♭VI — Flat Submediant

> [!definition] Definition 7.5 — ♭VI (Flat Submediant)
> **Trong C major**: Ab major (Ab–C–Eb) — thay thế vi (A minor)
>
> **Accidentals**: Ab (♭6), Eb (♭3)
>
> **Màu sắc**: đẹp, unexpected, "cinematic" — Batman themes, film scores, Romantic music.
>
> **Dùng nhiều trong**: Classical Romantic (đặc trưng Schubert), film scoring, dramatic pop.

```abc
X:4
T:bVI — Ab major in C key, dramatic color
M:4/4
L:1/4
Q:85
K:C
"^I"[CEG]4 | "^bVI"[_E_Ac]4 | "^bVII"[DF_B]4 | "^I"[CEG]4 |]
```

Pattern I → ♭VI → ♭VII → I = descending bass line đẹp (C → Ab → Bb → C) — rất đặc trưng Schubert và film music.

---

#### 4. ♭III — Flat Mediant

> [!definition] Definition 7.6 — ♭III (Flat Mediant)
> **Trong C major**: Eb major (Eb–G–Bb) — thay thế iii (E minor)
>
> **Accidentals**: Eb (♭3), Bb (♭7)
>
> **Màu sắc**: bí ẩn, "heavy", major triad nhưng từ minor world.
>
> **Dùng nhiều trong**: Metal, progressive rock, và Classical chromatic passages.

```abc
X:5
T:bIII — Eb major in C key
M:4/4
L:1/4
Q:85
K:C
"^I"[CEG]4 | "^bIII"[_EG_B]4 | "^IV"[FAc]4 | "^V"[GBd]4 |]
```

---

#### 5. ii° — Half-Diminished (Borrowed ii)

> [!definition] Definition 7.7 — ii° / iiø7 (Borrowed Diminished Supertonic)
> **Trong C major**: D dim hoặc Dm7b5 (D–F–Ab–C) — thay thế ii (D minor)
>
> **Accidental**: Ab (♭6)
>
> **Màu sắc**: tối, tense, strong pull về V.
>
> **Dùng nhiều trong**: pre-dominant position (thay ii → V), Classical cadences, Jazz.

```abc
X:6
T:ii diminished borrowed — strong pre-dominant
M:4/4
L:1/4
Q:85
K:C
"^I"[CEG]4 | "^iio7"[DF_Ac]4 | "^V7"[GBdf]4 | "^I"[CEG]4 |]
```

*Dm7b5 → G7 → C*: màu tối hơn rất nhiều so với Dm7 → G7 → C bình thường.

---

### Picardy Third — Mượn Ngược Từ Major

> [!definition] Definition 7.8 — Picardy Third (Picardie Third)
> Trong **minor key**: kết thúc bằng chord **I major** thay vì i minor — mượn từ parallel major.
>
> **Ví dụ**: bài trong A minor, cadence cuối kết bằng **A major** (A–C#–E) thay vì A minor.
>
> **Màu sắc**: ánh sáng bất ngờ ở cuối, "hy vọng", rất đặc trưng Baroque.
>
> **Dùng nhiều trong**: Bach, Handel, Baroque chorales — gần như mọi bản minor kết thúc bằng Picardy third.

```abc
X:7
T:Picardy Third — minor ends on major I
M:4/4
L:1/4
Q:80
K:Amin
"^i"[Ace]4 | "^iio"[BdF]4 | "^V7"[E^GBd]4 | "^I (Picardy)"[A^ce]4 |]
```

*Bar 4*: A major (A–C#–E) = Picardy third — C# là accidental unexpected trong A minor. Nghe như "ánh nắng" sau bóng tối.

---

### Descending Chromatic Bass Line — Ứng Dụng Kinh Điển

Borrowed chords ♭VI và ♭VII kết hợp tạo ra **descending chromatic bass line** — một trong những progression đẹp nhất:

```abc
X:8
T:I-bVII-bVI-V — Descending chromatic bass
M:4/4
L:1/4
Q:90
K:C
"^I"[CEG]4 | "^bVII"[DF_B]4 | "^bVI"[_E_Ac]4 | "^V"[GBd]4 |]
```

Bass đi C → Bb → Ab → G (chromatic descent) — đây là pattern được dùng trong Pachelbel Canon biến thể, và rất nhiều Rock/Pop kinh điển.

---

## Musical Examples

### Beatles — *Blackbird* (♭VII trong G major)

*Blackbird* dùng ♭VII (F natural trong G major — F là ♭7) tạo ra color đặc trưng:

```abc
X:9
T:Blackbird-style progression — bVII in G major
M:4/4
L:1/4
Q:100
K:G
"^I"[GBd]4 | "^bVII"[=FAc]4 | "^IV"[ceg]4 | "^I"[GBd]4 |]
```

F natural trong key G major = borrowed từ G Mixolydian/G minor — tạo ra "sweetness" đặc trưng Beatles.

---

### Radiohead — *Creep* (iv trong E major)

*Creep* nổi tiếng với progression **I – III – IV – iv**:

```abc
X:10
T:Creep-style — iv borrowed chord
M:4/4
L:1/4
Q:75
K:G
"^I"[GBd]4 | "^III"[Bd=F]4 | "^IV"[ceg]4 | "^iv"[_egc]4 |]
```

*Cm* (iv trong G major, bar 4): Eb = ♭6 borrowed — tạo ra "emotional sting" cực kỳ mạnh trước khi quay về I. Đây là lý do progression này cảm giác "broken" và vulnerable.

---

### Schubert / Film Score — ♭VI Chromatic Mediant

Schubert nổi tiếng với những bước nhảy bất ngờ sang ♭VI:

```abc
X:11
T:bVI chromatic mediant — Schubert/film style
M:4/4
L:1/4
Q:72
K:C
"^I"[CEG]4 | "^bVI"[_E_Ac]4 | "^I"[CEG]4 | "^V7"[GBdf]4 |]
```

I → ♭VI nhảy trực tiếp (không cần chuẩn bị) = **chromatic mediant relationship** — roots cách nhau M3. Nghe như ánh sáng đột ngột thay đổi — đặc trưng Schubert, Liszt, và film scores của John Williams.

---

### Jobim — Borrowed Chords Trong Bossa Nova

Jobim dùng modal mixture rất tự nhiên. Ví dụ trong *Corcovado* (Quiet Nights):

```abc
X:12
T:Corcovado-style — iv and bVII in F major
M:4/4
L:1/4
Q:90
K:F
"^Fmaj7"[FAce]4 | "^Fm7 (iv)"[F_Ac_e]4 | "^Bb7 (bVII7)"[DF_B_e]4 | "^Fmaj7"[FAce]4 |]
```

*Fm7* (iv trong F major): Ab = ♭3 borrowed — Jobim dùng để tạo sombre beauty trước khi quay về Fmaj7. ♭VII7 (Bb7) tiếp theo có Bb và Eb — cả hai từ parallel minor — rồi resolve về I.

---

### Classical — Bach Picardy Third

Bach dùng Picardy third ở cuối hầu hết các chorale ở minor key:

```abc
X:13
T:Bach Chorale style — Picardy Third at end
M:4/4
L:1/4
Q:72
K:Dmin
V:1 name="Soprano"
f4 | e4 | d4 |]
V:2 name="Bass"
D,4 | A,4 | D,4 |]
```

*Bar 3 bass*: D major — trong D minor, nếu chord kết là D major (với F# thay vì F natural) = Picardy third. Soprano F trên D bass → nếu F# thay F đây là Picardy.

> [!note] Picardy trong Jazz
> Jazz thường làm ngược lại — bài trong major key kết bằng **i minor chord** (hoặc im7) cho màu melancholic. Ví dụ: bài trong C, kết bằng Cm7 thay vì Cmaj7 — tạo cảm giác ambiguous, unresolved rất đặc trưng Cool Jazz.

---

## Guitar Application

### Borrow iv — Thêm Màu Tối Vào Major Progression

> [!example] Guitar Practice 7.1 — IV → iv → I trong C major
> ```
> F major (IV):  e──1  B──1  G──2  D──3  A──x  E──x
> Fm    (iv):    e──1  B──1  G──1  D──3  A──x  E──x  (chỉ đổi G string: 2→1)
> C major (I):   e──0  B──1  G──0  D──2  A──3  E──x
> ```
>
> Chỉ cần đổi **một nốt** (G string từ fret 2 xuống fret 1) để từ F major thành F minor! Nghe sự thay đổi màu sắc rõ ràng.

---

### ♭VI → ♭VII → I — Power Progression

> [!example] Guitar Practice 7.2 — ♭VI–♭VII–I trong C major
> ```
> Ab major (bVI):  e──4  B──4  G──5  D──6  A──6  E──4  (barre fret 4)
> Bb major (bVII): e──6  B──6  G──7  D──8  A──8  E──6  (barre fret 6)
> C major  (I):    e──8  B──8  G──9  D──10 A──10 E──8  (barre fret 8)
> ```
>
> Ba barre chords đi lên: Ab → Bb → C — nghe cực kỳ mạnh và cinematic. Pattern này có trong *With or Without You* (U2), *Let It Be* phiên bản minor, và vô số film score.

---

## Practice

> [!example] Bài tập 7.1 — Nhận diện borrowed chords
> Cho key **F major**, xác định chord nào là diatonic, chord nào là borrowed:
>
> Fmaj7 – Bbmaj7 – **Abmaj7** – C7 – **Fm7** – **Ebmaj7** – C7 – Fmaj7
>
> Với mỗi borrowed chord: nốt nào là accidental? Đó là ♭3, ♭6, hay ♭7?

> [!example] Bài tập 7.2 — Xây dựng
> Trong key **G major**, xây dựng các borrowed chords:
> 1. iv (minor subdominant)
> 2. ♭VII (flat subtonic)
> 3. ♭VI (flat submediant)
>
> Với mỗi chord: liệt kê 3 nốt và accidentals so với G major scale.

> [!example] Bài tập 7.3 — Sáng tác
> Viết một progression 8-bar trong **D major** dùng ít nhất 2 borrowed chords.
> Gợi ý: dùng iv (Gm) và ♭VII (C major) ở đâu đó trong progression, đảm bảo resolve về I (D major) ở cuối.

> [!example] Bài tập 7.4 — Nghe
> Nghe *Hey Jude* (Beatles). Ở đoạn "Na na na na..." cuối bài, xác định:
> - Key của đoạn đó là gì?
> - Chord nào là borrowed? (Gợi ý: nghe chord trước khi về tonic)
> - Là ♭VII hay ♭VI?

---

## Summary / Key Takeaways

- **Modal mixture** = mượn chord từ parallel minor vào major key (hoặc ngược lại)
- **Không đổi key** — key vẫn là major, borrowed chord chỉ là "màu sắc" thoáng qua
- **5 borrowed chords phổ biến nhất** (trong major): iv, ♭VII, ♭VI, ♭III, ii°
- **iv** (minor subdominant): tối, thiết tha — dùng thay IV trong PD function
- **♭VII** (subtonic): mạnh, "rock" — rất phổ biến Pop/Rock
- **♭VI** (flat submediant): cinematic, dramatic — Schubert, film music
- **♭III** (flat mediant): bí ẩn, heavy — Metal, progressive
- **Picardy third**: i → I ở cuối minor piece = ánh sáng, hy vọng — đặc trưng Baroque
- **Nhận dạng**: tìm ♭3, ♭6, hoặc ♭7 trong chord khi đang ở major key
- **Màu sắc function không đổi**: iv vẫn là PD, ♭VII vẫn gần T/D, ♭VI vẫn là T-substitute

---

## Đáp án Bài tập 7.1 (Key F major)

F major scale: F–G–A–Bb–C–D–E

- **Fmaj7**: I — diatonic ✓
- **Bbmaj7**: IV — diatonic ✓
- **Abmaj7**: ♭**III** — borrowed! Ab (♭3) và Eb (♭7) đều không có trong F major
- **C7**: V7 — diatonic ✓
- **Fm7**: **iv** — borrowed! Ab (♭3) không có trong F major
- **Ebmaj7**: ♭**VII** — borrowed! Eb (♭7) không có trong F major
- **C7**: V7 — diatonic ✓
- **Fmaj7**: I — diatonic ✓

---

## Đáp án Bài tập 7.2 (Key G major)

G major scale: G–A–B–C–D–E–F#

1. **iv** (Gm → Cm): Cm = C–Eb–G — accidentals: **Eb (♭6)**
   *(Cm là iv trong G major, vì bậc 4 của G = C, và minor version = Cm với Eb)*
2. **♭VII** (F# dim → F major): F major = F–A–C — accidentals: **F natural** (G major có F#!)
3. **♭VI** (Em → Eb major): Eb major = Eb–G–Bb — accidentals: **Eb (♭6), Bb (♭3)**

---

## References

- Walter Piston — *Harmony* (5th ed.), Ch. 17: Modal Mixture
- Open Music Theory — *Modal Mixture* (viva.pressbooks.pub)
- Piano With Jonny — *Modal Interchange: The Complete Guide*
- Wikipedia — *Borrowed chord*
- Kaitlin Bove — *Modal Mixture* (kaitlinbove.com)
- *Blackbird* (Lennon-McCartney, 1968) — ♭VII in G major
- *Creep* (Radiohead, 1992) — iv borrowed chord
- *Corcovado* (Tom Jobim, 1960) — iv7 và ♭VII7 in Bossa Nova
