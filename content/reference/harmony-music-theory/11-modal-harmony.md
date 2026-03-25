---
title: "11. Modal Harmony"
tags: [music-theory, harmony, modes, modal-jazz, lesson-11]
aliases: [Modal Harmony, Modal Jazz, Modes]
created: 2026-03-25
---

> **Prerequisites**: [[02-diatonic-harmony|02. Diatonic Harmony]], [[07-modal-mixture|07. Modal Mixture]] — diatonic chords, borrowed chords, biết 7 modes cơ bản từ trước
> **Objectives**:
> - Hiểu modes như **harmonic centers độc lập** (không phải "relative của major")
> - Nhận ra **characteristic note** và **characteristic chord** của từng mode
> - Viết modal cadences và modal chord progressions đúng cách
> - Phân biệt tonal harmony (V→I) và modal harmony (không có V→I)
> - Phân tích modal Jazz (*So What*, *Maiden Voyage*, *Impressions*)

---

## Motivation

Bạn đã biết modes như những "scale" — Dorian bắt đầu từ bậc 2 của major scale, Phrygian từ bậc 3, v.v. Nhưng đó là cách nhìn **relative** — so sánh với major parent.

Cách nhìn **modal** khác hoàn toàn: mỗi mode là một **harmonic world riêng**, với tonal center, màu sắc, và chord progressions đặc trưng của riêng nó.

```abc
X:1
T:D Dorian vs D minor — same notes, different harmonic world
M:4/4
L:1/4
Q:90
K:Dmin
"^Dm7"[DFAC]4 | "^A7 (V7/i)"[A^CEG]4 | "^Dm (resolve)"[DFA]4 | z4 |
"^Dm7"[DFAC]4 | "^C (bVII)"[CEG]4 | "^Dm (modal)"[DFA]4 | z4 |]
```

*Bars 1–3*: D minor **tonal** — A7 (V7) → Dm. Cảm giác "resolve về home", tension rõ ràng.
*Bars 5–7*: D Dorian **modal** — bVII (C major) → Dm. Không có leading tone, không có V7 tension — chỉ là màu sắc khác nhau quanh Dm. Đây là modal harmony.

---

## Concept / Theory

### Tonal vs Modal — Sự Khác Biệt Cốt Lõi

> [!definition] Definition 11.1 — Tonal vs Modal Harmony
>
> | | **Tonal Harmony** | **Modal Harmony** |
> |---|-----------------|-----------------|
> | **Động lực** | V7 → I (dominant tension) | Màu sắc, không có V7 |
> | **Leading tone** | Luôn có (7̂ → 1̂) | Không dùng (tránh) |
> | **Chord chuyển động** | Functional (T/PD/D) | Color-based, vamp-like |
> | **Cadence** | PAC, HC, DC | Modal cadence (khác nhau mỗi mode) |
> | **Ví dụ** | Beethoven Sonata | *So What* (Miles Davis) |

**Nguyên tắc vàng của modal writing**: **tránh V7 → I** — ngay khi V7 xuất hiện, tai nghe sẽ "kéo" sang tonal context và modal center bị phá vỡ.

---

### Characteristic Note — "Linh Hồn" Của Mỗi Mode

> [!definition] Definition 11.2 — Characteristic Note
> **Characteristic note** = nốt phân biệt một mode với major (Ionian) hoặc natural minor (Aeolian) trên cùng root.
>
> | Mode | So sánh | Characteristic Note | Màu sắc |
> |------|---------|-------------------|---------|
> | **Ionian** | = Major | — | Sáng, stable |
> | **Dorian** | Minor + ♮6̂ | ♮6̂ (M6) | Tối nhưng "sáng" hơn Aeolian |
> | **Phrygian** | Minor + ♭2̂ | ♭2̂ (m2) | Rất tối, Spanish/Flamenco |
> | **Lydian** | Major + ♯4̂ | ♯4̂ (A4) | Sáng nhất, "dreamy", floating |
> | **Mixolydian** | Major + ♭7̂ | ♭7̂ (m7) | Sáng nhưng "bluesy", rock |
> | **Aeolian** | = Natural Minor | — | Tối, stable |
> | **Locrian** | Minor + ♭2̂ + ♭5̂ | ♭5̂ (d5) | Tối nhất, unstable (ít dùng) |

---

### Modal Chord Progressions — Emphasize Characteristic Note

Mỗi mode có những chord progressions đặc trưng giúp **thiết lập và duy trì** modal center, tập trung vào characteristic note:

---

#### Dorian — D Dorian (♮6 = B natural)

Characteristic chord: **IV (G major)** — vì IV chứa ♮6̂ (B), phân biệt Dorian với Aeolian (iv minor).

```abc
X:2
T:D Dorian vamp — IV emphasizes natural 6
M:4/4
L:1/4
Q:100
K:Dmin
"^Dm7 (i)"[DFAC]4 | "^G (IV)"[GBd]4 | "^Dm7 (i)"[DFAC]4 | "^G (IV)"[GBd]4 |]
```

*Dm7 ↔ G major*: vòng này là "Dorian shuttle" — xác nhận Dorian vì G major (không phải Gm như Aeolian). Dùng nhiều trong: *So What* (Miles Davis), *Oye Como Va* (Santana), *Eleanor Rigby* (Beatles).

---

#### Phrygian — E Phrygian (♭2 = F natural)

Characteristic chord: **♭II (F major)** — Phrygian's most distinctive sound, "Spanish" feel.

```abc
X:3
T:E Phrygian — bII cadence
M:4/4
L:1/4
Q:90
K:Emin
"^Em (i)"[EGB]4 | "^F (bII)"[FAc]4 | "^Em (i)"[EGB]4 | "^F (bII)"[FAc]4 |]
```

*E minor ↔ F major*: F = ♭2̂ của E — "Phrygian cadence". Rất đặc trưng Flamenco, Spanish guitar, Metallica (*Wherever I May Roam*). Trong Classical: Phrygian half cadence (iv6→V) đã học ở Lesson 04.

Phrygian Dominant (mode 5 của harmonic minor): E–F–G#–A–B–C–D — thêm M3 thay m3, rất phổ biến trong Flamenco và Tango.

---

#### Lydian — F Lydian (♯4 = B natural)

Characteristic chord: **II (G major)** — "Lydian cadence": II → I (G → F).

```abc
X:4
T:F Lydian — II cadence (G to F)
M:4/4
L:1/4
Q:100
K:F
"^Fmaj7 (I)"[FAce]4 | "^G (II)"[GBd]4 | "^Fmaj7 (I)"[FAce]4 | z4 |]
```

*G major → F major* (= Lydian cadence). B♮ trong G major = #4̂ của F. *Simpsons theme* (Danny Elfman) = F Lydian. *Joe Satriani "Flying in a Blue Dream"*. Bossa Nova dùng Lydian color rất nhiều.

---

#### Mixolydian — G Mixolydian (♭7 = F natural)

Characteristic chord: **♭VII (F major)** — "Mixolydian cadence": ♭VII → I (F → G).

```abc
X:5
T:G Mixolydian — bVII cadence
M:4/4
L:1/4
Q:110
K:G
"^G (I)"[GBd]4 | "^F (bVII)"[=FAc]4 | "^G (I)"[GBd]4 | "^F (bVII)"[=FAc]4 |]
```

*G ↔ F major*: F = ♭7̂ của G. Đây là "Mixolydian shuttle" — nghe ngay trong: *Norwegian Wood* (Beatles), *Sweet Home Chicago*, Blues riff cơ bản, và hầu hết Rock. F natural trong key G là dấu hiệu nhận biết Mixolydian.

---

#### Aeolian — A Aeolian / Natural Minor

Characteristic chords: **♭VI (F major)** và **♭VII (G major)** — "Aeolian shuttle" ♭VI–♭VII–i.

```abc
X:6
T:A Aeolian — bVI-bVII-i progression
M:4/4
L:1/4
Q:100
K:Amin
"^Am (i)"[Ace]4 | "^F (bVI)"[FAc]4 | "^G (bVII)"[GBd]4 | "^Am (i)"[Ace]4 |]
```

*Am–F–G–Am*: "Aeolian cadence" rất phổ biến trong Pop, Rock, film scores. Không có leading tone, không có V7 (E7) — đó là Aeolian, không phải harmonic minor.

---

### Vamp và Pedal — Kỹ Thuật Duy Trì Modal Center

> [!definition] Definition 11.3 — Modal Vamp
> **Vamp** = progression lặp đi lặp lại (loop) trên một hoặc hai chord, duy trì modal center.
>
> Kỹ thuật giữ modal center:
> 1. **Pedal point** ở bass (root của mode) qua mọi chord change
> 2. **Chỉ dùng 2–3 chord max** trong một section — không có tonal progression dài
> 3. **Tránh V7** — dùng ♭VII hoặc IV thay thế làm "dominant-feel"
> 4. **Quartal voicings** (chồng 4ths) — tạo ambiguity, giảm tonal pull

```abc
X:7
T:D Dorian quartal vamp — pedal bass
M:4/4
L:1/4
Q:100
K:Dmin
V:1 name="Chord (quartal)"
[GCd]4 | [AFd]4 | [GCd]4 | [AFd]4 |]
V:2 name="Bass pedal (D)"
D,4 | D,4 | D,4 | D,4 |]
```

*Bass D giữ nguyên* qua cả 4 bars — dù chord trên thay đổi, D luôn là center.

---

## Musical Examples

### Miles Davis — *So What* (D Dorian)

*So What* (*Kind of Blue*, 1959) = bài modal Jazz nổi tiếng nhất. Structure đơn giản nhưng revolutionary:

```abc
X:8
T:So What — D Dorian then Eb Dorian
M:4/4
L:1/4
Q:120
K:Dmin
"^D Dorian"[DGCd]4 | [DGCd]4 | [DGCd]4 | [DGCd]4 |
[K:_Emin]"^Eb Dorian (+1 half step)"[_E_A_D_e]4 | [_E_A_D_e]4 | [K:Dmin]"^back to D"[DGCd]4 | [DGCd]4 |]
```

*Cấu trúc*: 16 bars D Dorian → 8 bars Eb Dorian → 8 bars D Dorian.
**Không có** V7→i ở bất kỳ đâu. Chord chuyển động duy nhất là lên half step (D→Eb) — đây là **direct modal modulation**.

John Coltrane improvise trên D Dorian scale; Bill Evans comps bằng quartal voicings. Đây là âm thanh của modal Jazz.

---

### Herbie Hancock — *Maiden Voyage* (Lydian tứ giác)

*Maiden Voyage* (1965) dùng 4 maj7#11 chords xoay vòng — tất cả đều là Lydian color:

```abc
X:9
T:Maiden Voyage — cycling Lydian maj7#11 chords
M:4/4
L:1/4
Q:90
K:D
"^Dmaj7#11"[D^GA^c]4 | "^Fmaj7#11"[F^Bc^e]4 | "^Ebmaj7#11"[_E_AB_d]4 | "^Dbmaj7#11"[_D^G_A_c]4 |]
```

Cả 4 chord đều là Lydian maj7#11 — không có tonal center cố định, chỉ có màu sắc "floating" như đại dương. Đây là modal harmony ở đỉnh cao của Jazz.

---

### Santana — *Oye Como Va* (A Dorian)

Classic rock Dorian vamp — IV chord xác nhận Dorian:

```abc
X:10
T:Oye Como Va style — A Dorian
M:4/4
L:1/4
Q:120
K:Amin
"^Am7 (i)"[ACEG]4 | "^D (IV)"[DFA]4 | "^Am7 (i)"[ACEG]4 | "^D (IV)"[DFA]4 |]
```

*Am7 ↔ D major*: D = IV trong A Dorian (F# = ♮6̂ của A). Nếu là A Aeolian thì IV sẽ là Dm (minor). D major ở đây **prove** đây là Dorian, không phải natural minor.

---

### Flamenco/Tango — Phrygian Dominant

Phrygian Dominant (= mode 5 của harmonic minor): E–F–G#–A–B–C–D, rất đặc trưng:

```abc
X:11
T:Phrygian Dominant vamp — Flamenco/Tango
M:4/4
L:1/4
Q:110
K:Emin
"^E (I)"[E^GB]4 | "^F (bII)"[FAc]4 | "^E (I)"[E^GB]4 | "^Dm-G (bVII-bIII)"[DFA]2 [GBd]2 |]
```

*E major ↔ F major* (Phrygian dominant shuttle). G# (M3 của E) = characteristic của Phrygian Dominant — phân biệt với Phrygian thuần (có Gm). Cực kỳ đặc trưng trong Flamenco, Tango milonga, và nhạc Trung Đông.

---

## Guitar Application

> [!example] Guitar Practice 11.1 — Nhận biết mode qua characteristic chord
> Chơi 3 progression và xác định mode:
>
> 1. Am7 – G – Am7 – G (key Am, chú ý G major)
> 2. Am7 – D – Am7 – D (key Am, chú ý D major)
> 3. Am7 – E7 – Am7 – E7 (key Am, chú ý E7)
>
> Đáp án: (1) Aeolian – ♭VII; (2) **Dorian** – IV có ♮6; (3) Harmonic minor – V7

> [!example] Guitar Practice 11.2 — Modal vamp trong Dorian
> Chơi vamp **Em7 ↔ A major** trong 4/4, 8 bars. Em7 = i Dorian, A major = IV của E Dorian (chứa C# = ♮6̂ của E). Đây là E Dorian — nghe ngay màu sắc phân biệt với E natural minor (Em7 ↔ Am).

> [!example] Guitar Practice 11.3 — Mixolydian riff
> Trong key G Mixolydian, chơi riff với G power chord và F natural:
> ```
> G5 → F → G5 → F → G5
> (mỗi chord 1 bar)
> ```
> F natural = ♭7̂ của G. Nghe màu sắc "rock/blues" đặc trưng Mixolydian.

---

## Practice

> [!example] Bài tập 11.1 — Xác định mode
> Cho các progressions sau (tất cả vamp quanh một tonal center). Xác định mode:
>
> 1. Fmaj7 – G – Fmaj7 – G (center F)
> 2. Gm7 – F – Gm7 – F (center G)
> 3. Dm – E♭ – Dm – E♭ (center D)
> 4. Cmaj7 – Fmaj7 – Cmaj7 – Fmaj7 (center C)

> [!example] Bài tập 11.2 — Viết modal progression
> Viết 4-bar vamp cho mỗi mode sau (center = D):
> 1. D Dorian (dùng G major = IV)
> 2. D Mixolydian (dùng C major = ♭VII)
> 3. D Phrygian (dùng Eb = ♭II)
>
> Yêu cầu: KHÔNG dùng A7 (V7 của D) trong bất kỳ vamp nào.

> [!example] Bài tập 11.3 — Phân tích *So What*
> Nghe *So What* (Miles Davis, *Kind of Blue*, 1959):
> - Bao nhiêu bars ở D Dorian trước khi chuyển sang Eb?
> - Chord voicing Bill Evans dùng nghe như thế nào — stacked 3rds hay 4ths?
> - Miles Davis improvise có dùng nốt B natural (♮6̂ của D Dorian) không?

---

## Summary / Key Takeaways

- **Modal harmony** ≠ tonal harmony — không có V7→I, không có leading tone tension
- **Mỗi mode = harmonic world riêng** với characteristic note và characteristic chord
- **Nhận biết mode** qua characteristic chord: Dorian=IV, Phrygian=♭II, Lydian=II, Mixolydian=♭VII, Aeolian=♭VI+♭VII
- **Duy trì modal center**: pedal bass, vamp 2 chord, tránh V7, dùng quartal voicings
- **Modal cadences**: Dorian (IV→i), Phrygian (♭II→i), Lydian (II→I), Mixolydian (♭VII→I)
- **Modal Jazz milestone**: *So What* (1959) = D Dorian + Eb Dorian, không V7
- **Quartal voicings**: xếp 4ths thay vì 3rds → ambiguous, modal character
- **Phrygian Dominant**: mode 5 harmonic minor = Flamenco/Tango sound (E–F–G#–A–B–C–D)
- **Bossa Nova**: nhiều Lydian và Dorian color — đặc biệt Jobim dùng maj7#11 (Lydian)

---

## Đáp án Bài tập 11.1

1. **Fmaj7 – G** (center F): G = II của F Lydian (#4̂ = B trong G major) → **F Lydian**
2. **Gm7 – F** (center G): F = ♭VII của G → **G Aeolian hoặc G Mixolydian** — cần thêm context. Gm7 (minor triad) → G Aeolian. Nếu G major, thì Mixolydian.
3. **Dm – Eb** (center D): Eb = ♭II của D → **D Phrygian**
4. **Cmaj7 – Fmaj7** (center C): F = IV của C Ionian (cũng có trong Lydian). Không có ♯4̂ nên là **C Ionian (major)** — hoặc cần thêm chord để confirm.

---

## References

- Mark Levine — *The Jazz Theory Book*, Ch. 3: Modal Scales and Their Chords
- Berklee Online — *Harmonic Considerations for Modal Harmony*
- Open Music Theory — *Modal Schemas*
- Wikipedia — *Mode (music)*
- *So What* (Miles Davis, *Kind of Blue*, 1959) — D Dorian, Eb Dorian
- *Maiden Voyage* (Herbie Hancock, 1965) — Lydian maj7#11 cycling
- *Impressions* (John Coltrane, 1963) — contrafact of *So What*
- *Oye Como Va* (Santana / Tito Puente) — A Dorian
