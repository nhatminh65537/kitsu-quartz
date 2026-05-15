---
title: "10. Chromatic Harmony — Neapolitan & Augmented Sixths"
tags: [music-theory, harmony, neapolitan, augmented-sixth, chromatic, lesson-10]
aliases: [Neapolitan Chord, Augmented Sixth, bII, It+6, Fr+6, Ger+6]
created: 2026-03-25
---

> **Prerequisites**: [[02-diatonic-harmony|02. Diatonic Harmony]], [[05-non-chord-tones|05. Non-Chord Tones]], [[07-modal-mixture|07. Modal Mixture]] — Roman numerals, pre-dominant function, borrowed chords, voice leading
> **Objectives**:
> - Xây dựng và nhận ra Neapolitan chord (♭II / N6) và chức năng của nó
> - Hiểu 3 loại Augmented Sixth: Italian (It+6), French (Fr+6), German (Ger+6)
> - Nắm voice leading đặc trưng của mỗi loại: ♭6̂ và #4̂ → 5̂
> - Nhận ra German Sixth = enharmonic Dominant 7th → dùng cho modulation
> - Phân tích các chord này trong Classical, Jazz (tritone sub = Ger+6), Tango

---

## Motivation

Có những chord trong Classical music mà khi nghe lần đầu, chúng gây ra một cảm giác rất đặc biệt — một màu sắc chromatic đột ngột, căng thẳng rồi resolve mạnh mẽ. Không phải secondary dominant bình thường, không phải borrowed chord đơn giản — mà là hai họ chord cực kỳ đặc trưng: **Neapolitan** và **Augmented Sixth**.

```abc
X:1
T:Neapolitan vs Regular ii — Comparison
M:4/4
L:1/4
Q:80
K:Cmin
"^iio"[DFA]4 | "^V"[EGBd]4 | "^N6 (bII)"[_D_FA]4 | "^V"[EGBd]4 |]
```

*Bar 1–2*: vòng ii°–V bình thường trong C minor
*Bar 3–4*: **Neapolitan (♭II = Db major)** → V — màu sắc dark và lạ hơn hẳn, nhưng resolve mạnh không kém

Beethoven *Moonlight Sonata*, Schubert *Der Erlkönig*, Bach *WTC* — tất cả đầy những chord này. Và thú vị hơn: **German Augmented Sixth = enharmonic dominant 7th** — bạn đã dùng nó trong Jazz dưới tên khác!

---

## Concept / Theory — Neapolitan Chord

### Neapolitan là gì?

> [!definition] Definition 10.1 — Neapolitan Chord (♭II, N6)
> **Neapolitan chord** = major triad xây trên bậc **♭2** (flat supertonic) của key.
>
> Thường xuất hiện ở **first inversion** (♭2 ở bass, 3rd = ♭4̂ ở soprano) → gọi là **Neapolitan Sixth (N6)**.
>
> Ký hiệu: **♭II** hoặc **N** hoặc **N6** (khi first inversion).
>
> **Chức năng**: **Pre-dominant (PD)** — giống iv và ii°, nhưng màu sắc chromatic hơn nhiều.

**Trong C minor**: Neapolitan = Db major (Db–F–Ab)
- ♭2̂ của C = Db (accidental không có trong C minor)
- First inversion: F ở bass (= ♭4̂ của C), Db và Ab ở trên

**Nốt đặc trưng**: ♭2̂ (Db trong C) và ♭6̂ (Ab trong C) — hai nốt của C Phrygian mode.

```abc
X:2
T:Neapolitan N6 — First inversion in C minor
M:4/4
L:1/4
Q:80
K:Cmin
V:1 name="Soprano"
_A4 | ^G4 | c4 |]
V:2 name="Bass"
F,4 | G,4 | C,4 |]
```

*Phân tích*:
- **Bar 1** (N6): Bass F = ♭4̂ (first inversion), soprano Ab = ♭6̂ → chord Db/F = N6
- **Bar 2** (V): Bass G, soprano G# (leading tone) → resolve
- **Bar 3** (i): C minor resolve

### Voice Leading của Neapolitan

> [!definition] Definition 10.2 — N6 Voice Leading
> Khi N6 → V:
> - ♭2̂ (Db) → leading tone xuống half step → B♮ (bậc 7̂, third của V)
> - ♭6̂ (Ab) → bậc 5̂ (G), đi xuống half step
> - Bass ♭4̂ (F) → bậc 5̂ (G), đi lên half step
>
> Cả 3 nốt đều di chuyển **half step** về V — đây là voice leading mạnh nhất có thể.

---

## Concept / Theory — Augmented Sixth Chords

### Nguyên Lý Cốt Lõi

> [!definition] Definition 10.3 — Augmented Sixth Interval
> Tất cả Augmented Sixth chords đều chứa **interval +6** giữa hai nốt cốt lõi:
>
> - **Bass**: ♭6̂ (Ab trong C) — bậc 6 flatten
> - **Soprano**: #4̂ (F# trong C) — bậc 4 raise
>
> Khoảng cách Ab→F# = Augmented 6th (= 10 half steps, enharmonic m7 nhưng resolve khác).
>
> **Resolution**: cả hai nốt này resolve **ra ngoài** về bậc 5̂ (G):
> - Ab (♭6̂) → G, đi **xuống** half step
> - F# (#4̂) → G, đi **lên** half step

```abc
X:3
T:Core Aug6 interval — Ab and F# resolve to G
M:4/4
L:1/4
Q:80
K:Cmin
V:1 name="Upper voice (#4)"
^F4 | G4 |]
V:2 name="Lower voice (b6)"
_A,4 | G,4 |]
```

*Ab→G (xuống) và F#→G (lên)* — hai nốt "kẹp" G từ hai phía, resolve vào unison rồi toả ra.

---

### Ba Loại Augmented Sixth

Cả ba loại đều chứa ♭6̂ và #4̂. Khác nhau ở **nốt thứ ba/tư**:

> [!definition] Definition 10.4 — Italian Augmented Sixth (It+6)
> **Nốt**: ♭6̂ – 1̂ – #4̂ (3 nốt, 1̂ thường double)
> **Trong C**: Ab – C – F#
> **Chức năng**: Pre-dominant, resolve về V
> **Đặc điểm**: đơn giản nhất, "vanilla" aug6

> [!definition] Definition 10.5 — French Augmented Sixth (Fr+6)
> **Nốt**: ♭6̂ – 1̂ – 2̂ – #4̂ (4 nốt)
> **Trong C**: Ab – C – D – F#
> **Đặc điểm**: dissonant nhất (có 2 tritones); thêm nốt 2̂ (D trong C)

> [!definition] Definition 10.6 — German Augmented Sixth (Ger+6)
> **Nốt**: ♭6̂ – 1̂ – ♭3̂ – #4̂ (4 nốt)
> **Trong C**: Ab – C – Eb – F#
> **Đặc điểm**: **enharmonic với dominant 7th chord**! Ab–C–Eb–F# ≅ Ab7 (Ab–C–Eb–Gb)
> - F# respell → Gb = m7 của Ab7
> - Khi resolve như dom7: → Db major (= ♭II của C) — **pivot cho modulation**!

```abc
X:4
T:Three Aug6 chords in C minor — It, Fr, Ger
M:4/4
L:1/4
Q:72
K:Cmin
"^It+6"[_A,C^F]4 | "^Fr+6"[_A,CD^F]4 | "^Ger+6"[_A,C_E^F]4 | "^V"[G,GBd]4 |]
```

*Bar 4* (V): tất cả ba loại đều resolve về G major (V trong C).

---

### Bảng So Sánh

| Chord | Nốt (key C) | Scale degrees | 4th note |
|-------|-------------|--------------|---------|
| **It+6** | Ab–C–F# | ♭6–1–#4 | *(double 1̂)* |
| **Fr+6** | Ab–C–D–F# | ♭6–1–2–#4 | 2̂ (D) |
| **Ger+6** | Ab–C–Eb–F# | ♭6–1–♭3–#4 | ♭3̂ (Eb) |
| **V** (target) | G–B–D | — | — |

**Mẹo nhớ**: It = chỉ 3 nốt (đơn giản); Fr = thêm Re; Ger = thêm Eb (♭3̂).

---

### Voice Leading Chi Tiết: Ger+6 → V

German Sixth có nguy cơ **parallel fifths** → thường đi qua **cadential 6/4** (I⁶₄):

```abc
X:5
T:Ger+6 to V via cadential 6/4 — avoid parallel 5ths
M:4/4
L:1/4
Q:72
K:Cmin
V:1 name="Soprano"
^F4 | G4 | ^G4 | c4 |]
V:2 name="Bass"
_A,4 | C,4 | G,4 | C,4 |]
```

*Ger+6* → *I⁶₄* (cadential, bar 2) → *V* (bar 3) → *i* (bar 4): thêm I⁶₄ tránh P5 giữa Ger+6 và V.

---

### German Sixth = Jazz Tritone Substitution

> [!note] Kết nối Jazz và Classical
> **German Sixth** trong C minor = Ab–C–Eb–F# ≅ **Ab7** (Ab–C–Eb–Gb enharmonic)
>
> Ab7 là **tritone substitute** của D7 (dominant của G) — cách nhau tritone (D↔Ab = ♭5).
>
> Điều này có nghĩa: **Ger+6 = tritone sub của V7** từ góc nhìn Jazz!
>
> Classical gọi là "German Sixth giải về V"; Jazz gọi là "♭II7 giải về I" — **cùng một âm thanh, hai tên gọi**.

---

## Musical Examples

### Beethoven — *Moonlight Sonata* (N6 nổi tiếng nhất)

*Moonlight Sonata* (Op. 27, No. 2) có Neapolitan chord ở measure 49–50 (C# minor), tạo ra một trong những khoảnh khắc dramatic nhất:

```abc
X:6
T:Moonlight Sonata style — N6 in C# minor
M:4/4
L:1/4
Q:60
K:^Cmin
V:1 name="Melody"
e4 | d4 | ^c4 |]
V:2 name="Harmony (N6 then V)"
"^N6"[_D_FA]4 | "^V7"[^G,^D^FA]4 | "^i"[^C,^CE^G]4 |]
```

*N6* (Db/F trong C# minor → bar 1): màu sắc tối đột ngột, bước ngoặt cảm xúc lớn nhất bản sonata. Db major chord hoàn toàn xa lạ trong C# minor nhưng nghe rất đẹp và đúng.

---

### Schubert — Augmented Sixth Ở Cadence

Schubert dùng It+6 và Ger+6 rất thường xuyên trước cadences lớn:

```abc
X:7
T:Schubert-style Ger+6 cadence in A minor
M:4/4
L:1/4
Q:72
K:Amin
V:1 name="Soprano"
^F4 | G4 | e4 |]
V:2 name="Bass"
F,4 | E,4 | A,4 |]
```

*F#* trên bass F trong Am = It+6/Fr+6 context: F (♭6̂ của A) → E (5̂), F# (#4̂ của A) → E (5̂) — hai nốt resolve vào E (dominant) từ hai phía.

---

### Tango — Neapolitan Trong Piazzolla

Astor Piazzolla dùng Neapolitan chord rất đặc trưng trong tangos, tạo màu Phrygian:

```abc
X:8
T:Piazzolla-style — N6 and V in D minor
M:4/4
L:1/4
Q:90
K:Dmin
"^Dm"[DFA]2 "^N6 (Eb/G)"[G_B_e]2 | "^A7"[A^CEG]4 | "^Dm"[DFA]4 |]
```

*Eb/G* (N6 trong D minor): Eb = ♭2̂ của D, G = ♭4̂ (bass) → first inversion N6. Rồi A7 (V7) → Dm. Đây là vòng harmony cực kỳ đặc trưng của tango Argentine.

---

### Jazz — German Sixth = ♭II7 (Tritone Sub)

```abc
X:9
T:Ger+6 = tritone sub — Classical vs Jazz reading
M:4/4
L:1/4
Q:90
K:C
V:1 name="Classical: Ger+6 → V → I"
"^Ger+6"[_A,C_E^F]4 | "^V"[GBd]4 | "^I"[CEG]4 |]
V:2 name="Jazz: Db7 (bII7) → I"
"^Db7"[_D_FA_B]4 | "^G7"[GBdf]4 | "^Cmaj7"[CEGB]4 |]
```

*Classical reading* (V1): Ab–C–Eb–F# = Ger+6 → G (V) → C
*Jazz reading* (V2): Db7 = ♭II7 = tritone sub → G7 → Cmaj7

**Cùng một âm thanh** (Ab–C–Eb = Db7 = Ger+6) — chỉ khác cách đọc và resolve.

---

## Guitar Application

> [!example] Guitar Practice 10.1 — Neapolitan trong A minor
> Chơi progression: **Am – N6 – E7 – Am**
>
> ```
> Am:  e──0  B──1  G──2  D──2  A──0  E──x
> N6 (Bb/D trong Am):
>      e──1  B──3  G──3  D──3  A──1  E──x
>      (= Bb major, first inv. Bb/D)
> E7:  e──0  B──0  G──1  D──0  A──2  E──0
> Am:  (trở về)
> ```
>
> Nghe màu sắc Neapolitan — đột ngột sáng (major), rồi căng (E7), rồi tối lại (Am).

> [!example] Guitar Practice 10.2 — Nhận ra Ger+6 trong context
> Trong bài jazz *All The Things You Are*, có đoạn Db7 → G7 → Cmaj7. Đây chính là German Sixth (enharmonic) → V7 → I từ góc độ Classical. Nghe lại đoạn đó và cảm nhận "double identity" của Db7.

---

## Practice

> [!example] Bài tập 10.1 — Xây dựng
> Trong key **E minor**, xây dựng:
> 1. **N6** (Neapolitan sixth): nốt nào? Bass là nốt gì?
> 2. **It+6**: ♭6̂ và #4̂ của E là nốt gì? Chord có những nốt gì?
> 3. **Ger+6**: thêm ♭3̂ vào It+6 — nốt gì?

> [!example] Bài tập 10.2 — Phân tích
> Xác định loại chord chromatic trong các ví dụ sau (key C minor):
>
> 1. Db–F–Ab (first inversion, F ở bass)
> 2. Ab–C–F# (3 nốt)
> 3. Ab–C–D–F# (4 nốt)
> 4. Ab–C–Eb–F# (4 nốt)
> 5. Ab–C–Eb–Gb (4 nốt, khác spelling)

> [!example] Bài tập 10.3 — Voice leading
> Viết voice leading từ **Ger+6 → V** trong A minor (4-part):
> - Bass: ♭6̂ → 5̂ (F → E)
> - Soprano: #4̂ → 5̂ (D# → E)
> - Inner voices: 1̂ → leading tone (A → G#); ♭3̂ → 5̂ (C → B)
>
> Chord V trong A minor = E major (E–G#–B). Viết ra 4 nốt của Ger+6 và 4 nốt của V.

---

## Summary / Key Takeaways

- **Neapolitan (♭II / N6)** = major triad trên ♭2̂, thường ở first inversion — **pre-dominant** function
- **N6 voice leading**: ♭2̂ → leading tone (half step down); ♭4̂ bass → 5̂ (half step up)
- **Augmented Sixth** = chord chứa interval +6 giữa ♭6̂ (bass) và #4̂ (soprano)
- Cả hai nốt ♭6̂ và #4̂ đều resolve về 5̂ — **"kẹp" dominant từ hai phía**
- **It+6** = ♭6–1–#4 (3 nốt, đơn giản nhất)
- **Fr+6** = ♭6–1–2–#4 (thêm 2̂, dissonant nhất — 2 tritones)
- **Ger+6** = ♭6–1–♭3–#4 (thêm ♭3̂, đồng âm với dom7)
- **German Sixth = enharmonic Dom7** → dùng như tritone sub trong Jazz (♭II7)!
- **Ger+6 → V** thường đi qua **I⁶₄** (cadential) để tránh parallel fifths
- Neapolitan đặc trưng trong: Beethoven, Schubert, Tango (Piazzolla), Minor key classical

---

## Đáp án Bài tập 10.1 (Key E minor)

E minor: E–F#–G–A–B–C–D

1. **N6**: ♭2̂ = F natural (F# → F♮, không phải accidental trong E minor → thực ra F♮ **diatonic** trong E natural minor!). Neapolitan của E minor = F major (F–A–C). First inversion = A ở bass. **N6 = A–C–F** (bass A).

2. **It+6**: ♭6̂ = C (C♮ đã có trong E minor), #4̂ = A# (raise A♮ → A#). Chord = **C–E–A#** (C là bass, A# ở soprano).

3. **Ger+6**: thêm ♭3̂ = G (G♮ diatonic, không cần accidental). Chord = **C–E–G–A#**. *Lưu ý*: C–E–G–Bb (enharmonic) = C7 → Ger+6 của E minor enharmonic = C7 = tritone sub của F# dominant!

---

## Đáp án Bài tập 10.2 (Key C minor)

1. **Db–F–Ab, bass F** → Db major first inversion = **N6** (Neapolitan sixth)
2. **Ab–C–F#** (3 nốt) → ♭6–1–#4 = **It+6**
3. **Ab–C–D–F#** (4 nốt) → ♭6–1–2–#4 = **Fr+6**
4. **Ab–C–Eb–F#** (4 nốt) → ♭6–1–♭3–#4 = **Ger+6**
5. **Ab–C–Eb–Gb** (4 nốt, F# respelled as Gb) → enharmonic **Ab7** = Ger+6 dưới Jazz notation

---

## References

- Walter Piston — *Harmony* (5th ed.), Ch. 20–21: Neapolitan, Augmented Sixths
- Open Music Theory — *Augmented Sixth Chords* (viva.pressbooks.pub)
- Wikipedia — *Neapolitan chord*, *Augmented sixth chord*
- Milne Publishing — *Fundamentals, Function, and Form*, Ch. 31–32
- Beethoven — *Piano Sonata Op. 27 No. 2 "Moonlight"*, Mvt. 1
- Astor Piazzolla — *Libertango*, *Adiós Nonino* — Neapolitan tango usage
- Jazz: Ger+6 = tritone substitution (♭II7) — *All The Things You Are*, *Autumn Leaves*
