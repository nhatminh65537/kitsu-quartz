---
title: "06. Secondary Dominants"
tags: [music-theory, harmony, secondary-dominants, tonicization, lesson-06]
aliases: [Secondary Dominants, Applied Dominants]
created: 2026-03-25
---

> **Prerequisites**: [[02-diatonic-harmony|02. Diatonic Harmony]], [[03-voice-leading|03. Voice Leading]], [[04-cadences|04. Cadences]] — Roman numerals, chức năng T/PD/D, tendency tones, cadence types
> **Objectives**:
> - Hiểu khái niệm tonicization — "modulation mini" không đổi key
> - Xây dựng và viết đúng 5 secondary dominant thường gặp: V/V, V/ii, V/IV, V/vi, V/iii
> - Nhận ra secondary dominants qua dấu hiệu accidental trong score
> - Phân tích và viết progression có secondary dominants trong Classical, Jazz, Bossa Nova

---

## Motivation

Bạn đang chơi trong key C major. Bỗng dưng xuất hiện một nốt F# — không có trong C major scale. Nghe lạ nhưng hay. Tại sao?

```abc
X:1
T:D7 in C major — chromatic surprise
M:4/4
L:1/4
Q:90
K:C
"^I"[CEG]4 | "^D7??"[D^FAc]4 | "^V"[GBd]4 | "^I"[CEG]4 |]
```

Chord D7 (D–F#–A–C) không phải diatonic trong C major — F# là nốt ngoài key. Nhưng nó không làm nhạc "sai" — thay vào đó, nó tạo ra cảm giác **"mini modulation"**: trong một thoáng ngắn, G major trở thành "home" tạm thời, và D7 là dominant của G. Sau đó nhạc quay về C.

Đây là **secondary dominant** (hay *applied dominant*) — một trong những kỹ thuật hòa âm phổ biến và hiệu quả nhất, xuất hiện từ Bach đến Jazz, Bossa Nova, và Pop hiện đại.

---

## Concept / Theory

### Tonicization — "Modulation Mini"

> [!definition] Definition 6.1 — Tonicization
> **Tonicization** là quá trình làm cho một chord **không phải tonic** tạm thời nghe như tonic — bằng cách dùng chord dominant (V) của nó ngay trước.
>
> - **Modulation**: đổi key thật sự, kéo dài nhiều phrase
> - **Tonicization**: mini-modulation chỉ kéo dài **1–2 chord**, sau đó quay về key gốc
>
> *"Secondary dominant is like a miniature modulation; for just an instant, the harmony moves out of the diatonic chords of the key."*

---

### Cách Xây Dựng Secondary Dominant

> [!definition] Definition 6.2 — Secondary Dominant
> **Secondary dominant** = chord V (hoặc V7) của một chord **diatonic trong key** (không phải tonic).
>
> Cách xây dựng:
> 1. Chọn chord diatonic muốn tonicize (target)
> 2. Tìm root của chord dominant: lên **perfect 5th** từ root của target
> 3. Xây chord **major triad** (hoặc dominant 7th) trên root đó
> 4. Thêm accidental nếu cần — thường là **raise the 3rd** (= tạo leading tone tạm thời)
>
> Ký hiệu: **V/X** hoặc **V7/X** — đọc là "five of X"

Tuyệt đối không thể tonicize chord **diminished** (vii°) vì không có major/minor stable tonic tương ứng.

---

### 5 Secondary Dominants Trong C Major

| Target | Secondary Dom | Nốt | Accidental | Giải về |
|--------|--------------|-----|-----------|---------|
| **V** (G) | **V/V = D7** | D–F#–A–C | F# | G major |
| **ii** (Dm) | **V/ii = A7** | A–C#–E–G | C# | D minor |
| **IV** (F) | **V/IV = C7** | C–E–G–Bb | Bb | F major |
| **vi** (Am) | **V/vi = E7** | E–G#–B–D | G# | A minor |
| **iii** (Em) | **V/iii = B7** | B–D#–F#–A | D# | E minor |

> [!note] V/IV đặc biệt
> **C7** (V/IV trong C major) = chính là I7 của key gốc, nhưng với chức năng secondary dominant. Nó tạo ra **Bb** — flat 7th — rất đặc trưng Blues và Jobim style.

---

### Nghe Dấu Hiệu: Tìm Accidental

Secondary dominant luôn có **ít nhất một accidental** (sharp hoặc flat) không có trong key. Đây là cách nhận ra chúng khi đọc score:

> [!example] Nhận dạng trong C major
> - Thấy **F#** → khả năng cao là V/V (D7) hoặc V/ii (A7)
> - Thấy **C#** → V/ii (A7)
> - Thấy **Bb** → V/IV (C7)
> - Thấy **G#** → V/vi (E7)
> - Thấy **D#** → V/iii (B7) — hiếm nhất

---

### Voice Leading với Secondary Dominants

Cùng nguyên tắc với V7 → I bình thường:
- **3rd của secondary dominant** (= leading tone tạm thời) → **resolve lên half step** vào tonic của target
- **7th của secondary dominant** → **resolve xuống step** vào 3rd của target

```abc
X:2
T:V7/V resolves to V — voice leading
M:4/4
L:1/4
Q:80
K:C
V:1 name="Melody"
"^D7 (V/V)"^f4 | "^G"g4 |]
V:2 name="Bass"
D,4 | G,4 |]
```

*F#* (3rd của D7 = leading tone của G) → *G* (tonic của target): lên half step ✓

---

## Musical Examples

### V/V — Cổ Điển Nhất

V/V là secondary dominant phổ biến nhất — xuất hiện ở mọi thời kỳ, mọi phong cách:

```abc
X:3
T:V/V — D7 to G in C major
M:4/4
L:1/4
Q:90
K:C
"^I"[CEG]4 | "^V7/V"[D^FAc]4 | "^V"[GBd]4 | "^I"[CEG]4 |]
```

*D7* = V7/V trong C: accidental F# tạo leading tone vào G.
Nghe: I → D7 → G tạo cảm giác "dừng ở G một thoáng" trước khi về C.

---

### V/ii — Rất Phổ Biến Trong Jazz

Trong Jazz, V/ii xuất hiện để **mở rộng ii–V–I**: thay vì nhảy thẳng vào ii, dùng V/ii trước → tạo chuỗi **ii/ii – V/ii – ii – V – I** (circle of fifths dài hơn):

```abc
X:4
T:Extended ii-V-I with V/ii — Jazz pattern
M:4/4
L:1/4
Q:100
K:C
"^E7 (V/vi)"[E^GBd]4 | "^Am7 (vi)"[Aceg]4 | "^A7 (V/ii)"[A^CEG]4 | "^Dm7 (ii)"[DFAc]4 |
"^G7 (V)"[GBdf]4 | "^Cmaj7 (I)"[CEGB]4 | z4 | z4 |]
```

*Phân tích*:
- **E7** = V7/vi → giải về Am7 (vi) — tonicize Am
- **A7** = V7/ii → giải về Dm7 (ii) — tonicize Dm
- **G7** = V7 → giải về Cmaj7 (I) — cadence chính
- Đây là **circle of fifths progression** E→A→D→G→C — cực kỳ phổ biến trong Jazz standards

---

### V/IV — Đặc Trưng Blues và Bossa Nova

V/IV (= I7) nghe "bluesy" và rất Jobim:

```abc
X:5
T:V/IV — C7 to F, Blues/Bossa color
M:4/4
L:1/4
Q:90
K:C
"^I"[CEG]4 | "^C7 (V/IV)"[CEG_B]4 | "^IV"[FAc]4 | "^I"[CEG]4 |]
```

*C7* (C–E–G–Bb): Bb là accidental — tạo "bluesy" sound trước IV. Cực kỳ đặc trưng trong:
- **12-bar blues**: I7 (= V/IV) mở đầu mọi phrase
- **Bossa Nova**: Jobim dùng I7 → IV tạo màu sắc nhẹ nhàng trước khi về subdominant

---

### V/vi — Deceptive Cadence + Tonicization

Kết hợp deceptive cadence với secondary dominant: V → vi → V/vi → vi

```abc
X:6
T:V-vi deceptive then V/vi tonicizing Am
M:4/4
L:1/4
Q:90
K:C
"^V7"[GBdf]4 | "^vi"[Ace]4 | "^E7 (V/vi)"[E^GBd]4 | "^vi"[Ace]4 |]
```

*Pattern*: G7 → Am (deceptive cadence) → E7 → Am (tonicize Am thật sự)
Nghe: lần đầu Am là "bất ngờ" (DC), lần sau Am là "đích đến rõ ràng" (tonicized) — hai cảm giác khác nhau hoàn toàn.

---

### Phân tích: *Autumn Leaves* — Circle of Fifths Với Secondary Dominants

*Autumn Leaves* là ví dụ hoàn hảo nhất về chuỗi secondary dominants. Toàn bộ A section là circle of fifths qua **hai key** (G major và E minor):

| Bar | Chord | Roman (G major) | Chức năng |
|-----|-------|----------------|----------|
| 1 | Am7 | ii7 | PD |
| 2 | D7 | V7 | D |
| 3 | Gmaj7 | Imaj7 | T (PAC) |
| 4 | Cmaj7 | IVmaj7 | PD |
| 5 | F#m7b5 | vii⁰7 (của E minor) | D/vi |
| 6 | B7 | **V7/vi** = V7 của Em | D → vi |
| 7 | Em7 | vi7 | T-vi |
| 8 | Em7 | vi7 (cadence) | T |

*Nhận xét*: Bars 5–7 là một **ii–V–i trong E minor** (F#m7b5 → B7 → Em) — toàn bộ section 2 tonicize vi (Em). B7 = V7/vi là secondary dominant quan trọng nhất của bài.

```abc
X:7
T:Autumn Leaves — Circle of 5ths progression (bars 1-8)
M:4/4
L:1/4
Q:110
K:G
"^Am7"[Aceg]4 | "^D7"[D^FAc]4 | "^Gmaj7"[GBdf]4 | "^Cmaj7"[cegb]4 |
"^F#m7b5"[^FAce]4 | "^B7"[B^d^fa]4 | "^Em7"[Egbd]4 | z4 |]
```

---

### Phân tích: *I Got Rhythm* (Gershwin) — Rhythm Changes

Rhythm Changes (progression của *I Got Rhythm*) nổi tiếng với chuỗi secondary dominants ở bridge:

Bridge chuẩn: **III7 → VI7 → II7 → V7** (tất cả là secondary dominants, circle of fifths)

Trong key Bb: **D7 → G7 → C7 → F7 → Bb**

```abc
X:8
T:Rhythm Changes Bridge — Chain of secondary dominants
M:4/4
L:1/4
Q:120
K:_B
"^D7"[D^FAc]4 | "^G7"[G_Bdf]4 | "^C7"[CEG_B]4 | "^F7"[FAce]4 |
"^Bb"[_BDf]4 | z4 | z4 | z4 |]
```

*Phân tích*: D7 = V/G, G7 = V/C, C7 = V/F, F7 = V/Bb — mỗi chord là secondary dominant của chord tiếp theo — **extended dominant chain** hoàn hảo.

---

### Guitar Application

Secondary dominants tạo ra những guitar transition đặc biệt hay vì thường có chromatic voice leading.

> [!example] Guitar Practice 6.1 — I → V7/V → V → I
> Chơi progression sau trong G major:
>
> ```
> G major (I):   e──3  B──3  G──4  D──5  A──5  E──3
> A7   (V7/V):   e──0  B──2  G──0  D──2  A──0  E──x
> D major (V):   e──2  B──3  G──2  D──0  A──x  E──x
> G major (I):   (trở về)
> ```
>
> Nghe F# trong A7 resolve lên G (D major root). Đây là V7/V → V trong G major.

> [!example] Guitar Practice 6.2 — Blues I7 → IV
> Chơi I7 → IV trong G major (V/IV):
>
> ```
> G7 (I7 = V/IV): e──1  B──0  G──0  D──0  A──2  E──3
> C major (IV):    e──0  B──1  G──0  D──2  A──3  E──x
> ```
>
> Bb trong G7 tạo "bluesy" color trước khi resolve về C. Đây là sound đặc trưng nhất của Blues.

---

## Practice

> [!example] Bài tập 6.1 — Xây dựng secondary dominants
> Trong key **G major**, xây dựng secondary dominant (V7/X) cho:
> 1. V/V (target = D major)
> 2. V/ii (target = A minor)
> 3. V/IV (target = C major)
> 4. V/vi (target = E minor)
>
> Với mỗi chord: liệt kê 4 nốt và accidental cần thêm.

> [!example] Bài tập 6.2 — Phân tích
> Xác định tất cả secondary dominants trong progression sau (key C major):
>
> C – A7 – Dm7 – G7 – E7 – Am – F – C7 – F – G7 – C
>
> Với mỗi secondary dominant: viết ký hiệu V7/X và cho biết nó giải về chord nào.

> [!example] Bài tập 6.3 — Viết
> Viết lại progression **C – Dm – G – C** thêm secondary dominants để mỗi chord (trừ C đầu) được tonicize:
> - Trước Dm: thêm V7/ii
> - Trước G: thêm V7/V
> - Trước C cuối: giữ V7 thường

> [!example] Bài tập 6.4 — Phân tích bài thực tế
> Nghe *Autumn Leaves* (bất kỳ version nào). Trong 8 bars đầu:
> - Xác định chord nào là secondary dominant
> - Nó tonicize chord nào?
> - Accidental nào xuất hiện?

---

## Summary / Key Takeaways

- **Secondary dominant** = V hoặc V7 của một chord diatonic không phải tonic — luôn có accidental
- **Tonicization** = mini-modulation: chord được "thăng cấp" tạm thời thành tonic trong 1–2 beats
- **Cách xây**: lên P5 từ root target → xây major (hoặc dom7) trên đó → raise 3rd nếu cần
- **5 secondary dominant trong C major**: V/V=D7, V/ii=A7, V/IV=C7, V/vi=E7, V/iii=B7
- **Nhận dạng**: tìm accidental — sharp (thường raise 3rd) hoặc flat (thường thêm m7th)
- **Voice leading**: 3rd (leading tone tạm) → lên half step; 7th → xuống step — giống V7→I bình thường
- **Jazz**: circle of fifths progressions = chuỗi secondary dominants liên tiếp (E7→A7→D7→G7→C)
- **Blues/Bossa**: I7 = V/IV → tạo "bluesy" color trước IV — kỹ thuật đặc trưng
- **Autumn Leaves**: B7 = V7/vi là secondary dominant quan trọng nhất, tonicize Em section

---

## Đáp án Bài tập 6.1 (Key G major)

1. **V7/V** (target D major): A7 = A–C#–E–G — accidental **C#** (diatonic G major có C natural)
2. **V7/ii** (target A minor): E7 = E–G#–B–D — accidental **G#** (diatonic có G natural)
3. **V7/IV** (target C major): G7 = G–B–D–F — accidental **F natural** (diatonic G major có F#!)
4. **V7/vi** (target E minor): B7 = B–D#–F#–A — accidental **D#** (diatonic có D natural)

---

## Đáp án Bài tập 6.2

C – **A7** (V7/ii→) Dm7 – G7 – **E7** (V7/vi→) Am – F – **C7** (V7/IV→) F – G7 – C

---

## References

- Walter Piston — *Harmony* (5th ed.), Ch. 16: Secondary Dominants
- Open Music Theory — *Tonicization* (viva.pressbooks.pub)
- Wikipedia — *Secondary chord*, *Tonicization*
- Medium / Jazz Theory — *Secondary Dominant Chords* (Jared Forth)
- Piano With Jonny — *Secondary Dominants: The Complete Guide*
- *Autumn Leaves* (Joseph Kosma, 1945) — lead sheet analysis
- *I Got Rhythm* / Rhythm Changes (George Gershwin, 1930)
