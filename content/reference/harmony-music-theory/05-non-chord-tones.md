---
title: "05. Non-Chord Tones"
tags: [music-theory, harmony, non-chord-tones, melody, lesson-05]
aliases: [Non-Chord Tones, NCT]
created: 2026-03-25
---

> **Prerequisites**: [[02-diatonic-harmony|02. Diatonic Harmony]], [[03-voice-leading|03. Voice Leading]], [[04-cadences|04. Cadences]] — biết diatonic chords, tendency tones, phrase structure
> **Objectives**:
> - Phân biệt 8 loại NCT chính: passing tone, neighbor tone, suspension, anticipation, appoggiatura, escape tone, retardation, pedal point
> - Hiểu tại sao NCT làm cho melody "sống" hơn chord đơn thuần
> - Nhận ra suspension 4–3, 7–6, 9–8 trong nhạc Classical và Jazz
> - Nghe và phân tích NCT trong bài nhạc thực tế

---

## Motivation

Hãy thử nghe hai phiên bản sau của cùng một progression C → G:

```abc
X:1
T:Chord tones only vs NCT melody
M:4/4
L:1/4
Q:90
K:C
V:1 name="Melody bare"
c4 | d4 |]
V:2 name="Harmony"
[CEG]4 | [GBd]4 |]
```

Nghe khô khan phải không? Giờ thêm một passing tone:

```abc
X:2
T:With passing tone — melody "breathes"
M:4/4
L:1/8
Q:90
K:C
V:1 name="Melody + PT"
c2 cd e2 d2 | d4 B2 d2 |]
V:2 name="Harmony"
[CEG]8 | [GBd]8 |]
```

Nốt D trong bar đầu (khi đang ở C major chord) **không phải là nốt của chord C** — nó là nốt "ngoài chord". Nhưng chính nốt đó làm cho melody chuyển động, có nhịp thở, có cảm xúc.

**Non-chord tones (NCT)** là kỹ thuật biến chord progression đơn giản thành melody đẹp. Mọi bài Classic, Jazz, Bossa mà bạn yêu thích đều đầy NCT. Học nhận ra chúng là học nghe nhạc ở tầng sâu hơn.

---

## Concept / Theory

### NCT là gì?

> [!definition] Definition 5.1 — Non-Chord Tone (NCT)
> **Non-chord tone** = một nốt trong melody (hoặc voice) **không thuộc về chord đang vang** tại thời điểm đó.
>
> NCT tạo ra **dissonance tạm thời** — nhưng dissonance có kiểm soát, luôn có cách giải quyết (resolution) về chord tone.
>
> Phân loại chính theo: **(1) cách tiếp cận** (by step hay by leap) và **(2) cách rời đi** (by step hay by leap).

---

### 8 Loại NCT Chính

#### 1. Passing Tone (PT) — Nốt Đi Qua

> [!definition] Definition 5.2 — Passing Tone
> **Tiếp cận**: bậc step từ chord tone
> **Rời đi**: tiếp tục step **cùng chiều** (không đổi hướng)
> **Vị trí**: thường unaccented (beat yếu)
>
> *Chức năng*: lấp đầy khoảng cách third giữa hai chord tone — tạo chuyển động trơn tru.

```abc
X:3
T:Passing Tone — C to E filled by D
M:4/4
L:1/8
Q:90
K:C
V:1 name="Melody"
c2 d2 e4 |]
V:2 name="Chord"
[CE]8 |]
```

*D là PT*: tiếp cận từ C (chord tone), đi tiếp đến E (chord tone) — cùng hướng đi lên.

Hai PT liên tiếp lấp đầy khoảng fourth:

```abc
X:4
T:Two Passing Tones — C to F
M:4/4
L:1/8
Q:90
K:C
V:1 name="Melody"
c2 d2 e2 f2 |]
V:2 name="Chord"
[CF]8 |]
```

---

#### 2. Neighbor Tone (NT) — Nốt Láng Giềng

> [!definition] Definition 5.3 — Neighbor Tone
> **Tiếp cận**: step từ chord tone
> **Rời đi**: step **ngược chiều**, trở về **cùng chord tone ban đầu**
> **Vị trí**: thường unaccented
>
> Có hai loại: **upper neighbor** (nốt trên) và **lower neighbor** (nốt dưới).

```abc
X:5
T:Upper and Lower Neighbor Tones
M:4/4
L:1/8
Q:90
K:C
V:1 name="Upper NT"
e2 f2 e4 |]
V:2 name="Chord"
[CEG]8 |]
```

```abc
X:6
T:Lower Neighbor Tone
M:4/4
L:1/8
Q:90
K:C
V:1 name="Lower NT"
e2 d2 e4 |]
V:2 name="Chord"
[CEG]8 |]
```

*Upper NT (X:5)*: E → F (upper NT, không thuộc C major chord) → E trở lại
*Lower NT (X:6)*: E → D (lower NT) → E trở lại

---

#### 3. Suspension (SUS) — Nốt Treo

Đây là NCT quan trọng và biểu cảm nhất trong Classical music.

> [!definition] Definition 5.4 — Suspension
> **Ba bước bắt buộc**:
> 1. **Preparation**: nốt vang như chord tone của chord trước
> 2. **Suspension**: nốt **giữ nguyên** (tied hoặc struck lại) sang chord mới — tạo dissonance
> 3. **Resolution**: nốt **đi xuống một step** về chord tone của chord mới
>
> **Vị trí**: luôn **accented** (beat mạnh)
>
> Ba suspension phổ biến nhất (đặt tên theo interval với bass):
> - **4–3**: sus P4 resolve xuống M3 (thường ở V→I)
> - **7–6**: sus m7 resolve xuống M6 (thường ở V⁶→I)
> - **9–8**: sus M9 resolve xuống P8 (thường ở V→I)

```abc
X:7
T:4-3 Suspension — V to I (classic cadence)
M:4/4
L:1/4
Q:72
K:C
V:1 name="Soprano (SUS)"
d4- | d2 c2 |]
V:2 name="Bass"
G,4 | C,4 |]
```

*Bar 1*: G chord đang vang, soprano giữ D (= P4 trên bass G) — đây là suspension
*Bar 2*: Vẫn trên chord C, soprano giải D→C (= P4 resolve xuống M3) — resolution ✓

```abc
X:8
T:9-8 Suspension — harsh, dramatic
M:4/4
L:1/4
Q:72
K:C
V:1 name="Soprano (SUS)"
a4- | a2 g2 |]
V:2 name="Bass"
G,4 | G,4 |]
```

*A trên G chord* = M9 trên bass → resolve xuống G (P8) — nghe "harsh" và dramatic hơn 4–3.

---

#### 4. Anticipation (ANT) — Nốt Đến Sớm

> [!definition] Definition 5.5 — Anticipation
> Chord tone của chord **tiếp theo** đến sớm khi chord hiện tại vẫn đang vang.
>
> **Tiếp cận**: step (thường)
> **Rời đi**: **đứng yên** (nốt đó trở thành chord tone khi chord đổi)
> **Vị trí**: luôn **unaccented** (trước downbeat)

```abc
X:9
T:Anticipation — C arrives early before G chord changes
M:4/4
L:1/8
Q:90
K:C
V:1 name="Melody"
e4 e2 c2 | c8 |]
V:2 name="Chord"
[GBd]8 | [CEG]8 |]
```

*Nốt C cuối bar 1* = ANT: đến khi G chord vẫn đang vang, nhưng C là chord tone của C major ở bar 2.

---

#### 5. Appoggiatura (APP) — Nốt Tựa

> [!definition] Definition 5.6 — Appoggiatura
> **Tiếp cận**: **leap** (nhảy xa, thường đi lên)
> **Rời đi**: step **ngược chiều** với leap về chord tone
> **Vị trí**: **accented** (beat mạnh) — tạo dissonance mạnh, rất biểu cảm
>
> *Italic*: từ tiếng Ý *appoggiare* = "tựa vào". Nốt "tựa" vào chord tone trước khi giải.

```abc
X:10
T:Appoggiatura — leap up, resolve step down
M:4/4
L:1/4
Q:80
K:C
V:1 name="Melody"
g4 | a2 g2 |]
V:2 name="Chord"
[CEG]4 | [CEG]4 |]
```

*A* trong bar 2: tiếp cận từ G bằng leap (M2 lên — nhỏ nhưng rõ ràng là APP), resolve xuống G. Trong thực tế, appoggiatura thường dùng leap 3rd, 4th, hoặc 5th.

Appoggiatura là trái tim của melody Romantic và nhiều bài Jazz ballad. Ví dụ: opening melody *Misty* ("Look at me...") đầy appoggiatura.

---

#### 6. Escape Tone (ET) — Nốt Thoát

> [!definition] Definition 5.7 — Escape Tone
> **Tiếp cận**: step từ chord tone
> **Rời đi**: **leap ngược chiều** về chord tone khác
> **Vị trí**: luôn **unaccented**
>
> Hiếm hơn các loại trên — tạo cảm giác melody "nhảy ra ngoài" rồi đổ về.

```abc
X:11
T:Escape Tone — step up then leap down
M:4/4
L:1/8
Q:90
K:C
V:1 name="Melody"
e2 f2 d4 |]
V:2 name="Chord"
[CEG]8 |]
```

*F*: tiếp cận từ E (step lên), rồi nhảy xuống D (leap xuống ngược chiều) — ET cổ điển.

---

#### 7. Retardation (RET) — Suspension Đi Lên

> [!definition] Definition 5.8 — Retardation
> Giống suspension nhưng resolve **đi lên** thay vì đi xuống.
>
> Pattern: preparation → giữ nguyên (accented) → resolve **lên step**
>
> Ví dụ cổ điển nhất: leading tone B giữ qua chord change, rồi resolve lên C.

```abc
X:12
T:Retardation — B held, resolves up to C
M:4/4
L:1/4
Q:80
K:C
V:1 name="Soprano"
B4- | B2 c2 |]
V:2 name="Bass"
G,4 | C,4 |]
```

*B giữ từ G chord sang C chord* = RET: resolve lên C (7→8, đi lên). Nghe đặc biệt smooth và vocal.

---

#### 8. Pedal Point (PED) — Nốt Bền Vững

> [!definition] Definition 5.9 — Pedal Point
> Một nốt (thường là tonic hoặc dominant) **giữ nguyên ở bass** qua nhiều chord thay đổi phía trên. Nốt đó trở thành NCT với các chord không chứa nó.
>
> Tạo cảm giác: ổn định (tonic pedal), hoặc hồi hộp, tension (dominant pedal).

```abc
X:13
T:Tonic Pedal — C held through chord changes
M:4/4
L:1/4
Q:90
K:C
V:1 name="Upper harmony"
"^I"[CEG]4 | "^IV"[FAc]4 | "^V"[GBd]4 | "^I"[CEG]4 |]
V:2 name="Pedal (C)"
C,4 | C,4 | C,4 | C,4 |]
```

*C ở bass*: chord tone trong I và IV, nhưng **NCT** khi V (G major) vang lên.

---

### Bảng Tổng Hợp

| NCT | Tiếp cận | Rời đi | Accented? | Đặc điểm |
|-----|---------|--------|----------|---------|
| **PT** | Step | Step cùng chiều | Thường không | Lấp đầy third/fourth |
| **NT** | Step | Step ngược chiều → cùng note | Thường không | Nốt láng giềng, trang trí |
| **SUS** | Đứng yên (tied) | Step **xuống** | **Có** | Dissonance → resolution, 4–3/7–6/9–8 |
| **ANT** | Step | Đứng yên (becomes chord tone) | Không | Đến sớm trước chord change |
| **APP** | **Leap** | Step ngược chiều | **Có** | Rất biểu cảm, Romantic/Jazz ballad |
| **ET** | Step | **Leap ngược chiều** | Không | Hiếm, melody "thoát ra" |
| **RET** | Đứng yên (tied) | Step **lên** | **Có** | Suspension đi lên |
| **PED** | — | — | — | Bass giữ qua chord changes |

---

## Musical Examples

### Bach Chorale — Suspension 4–3 ở Cadence

Suspension 4–3 ở cadence là pattern phổ biến nhất trong Bach's 371 chorales — tạo thêm một nhịp delay trước khi resolve, làm cadence "ngọt" hơn:

```abc
X:14
T:Bach-style 4-3 SUS at PAC cadence
M:4/4
L:1/4
Q:72
K:C
V:1 name="Soprano"
e4 | d4- | d2 c2 |]
V:2 name="Bass"
C,4 | G,4 | C,4 |]
```

*Bar 2*: soprano D (= P4 trên bass G = suspension) → bar 3: D resolve xuống C (= P3) khi chord đổi sang C.

---

### Jobim — Appoggiatura trong Bossa Melody

Jobim nổi tiếng với những appoggiatura mượt mà trong melody — nốt "tựa" vào chord tone tạo ra màu sắc melancholic đặc trưng:

```abc
X:15
T:Jobim-style appoggiatura over maj7 chord
M:4/4
L:1/4
Q:100
K:F
V:1 name="Melody"
"^Fmaj7"c4 | c2 a2 | a2 g2 | g4 |]
V:2 name="Chord"
[FAce]4 | [FAce]4 | [FAce]4 | [FAce]4 |]
```

*Nốt C* (bar 1): chord tone (5th của Fmaj7)
*Nốt A* (bar 2): chord tone (3rd)
*Nhảy từ A → G*: A là chord tone (3rd), G là NCT — đây là APP nếu có sự "tựa" → hoặc melody "đổ" xuống qua các chord tones và NCTs

> [!note] NCT trong Jazz
> Trong Jazz, đường ranh giới giữa NCT và chord tone mờ nhạt hơn Classical — vì Jazz chord đã có 7th, 9th, 11th, 13th. Một nốt "ngoài" C major triad có thể là chord tone của Cmaj9 hoặc C13. Phân tích NCT trong Jazz thường phụ thuộc vào **voicing thực tế** được chơi.

---

### Passing Tones — Làm "Sống" Vòng I–vi–ii–V

Thay vì chơi chord tones đơn thuần, thêm PT để connect:

```abc
X:16
T:Melody with Passing Tones over I-vi-ii-V
M:4/4
L:1/8
Q:100
K:C
V:1 name="Melody + PT"
c2 B2 A2 G2 | F2 E2 D2 C2 |]
V:2 name="Harmony"
"^I"[CEGB]4 "^vi"[Aceg]4 | "^ii"[DFAc]4 "^V"[GBdf]4 |]
```

*Phân tích*: Mỗi nốt descending C–B–A–G–F–E–D–C là **passing tone hoặc chord tone xen kẽ**:
- Bar 1 trên Cmaj7/Am7: C(CT) B(PT) A(CT) G(CT) — smooth line xuống
- Bar 2 trên Dm7/G7: F(CT) E(PT) D(CT) C(PT→CT G7? → CT Cmaj7)

---

### Suspension trong Jazz — "Sus chord" và 4–3

Jazz hiện đại biến suspension thành **sus chord** (C7sus4 = C–F–G–Bb) — một chord hẳn hoi built trên suspension!

```abc
X:17
T:Jazz sus chord — 4-3 suspension built in
M:4/4
L:1/4
Q:100
K:C
V:1 name="Guide tones"
f4 | e4 |]
V:2 name="Bass"
G,4 | G,4 |]
```

*Bar 1* = G7sus4 (F = sus 4th trên G bass)
*Bar 2* = G7 (E = resolved 3rd)

Progression G7sus4 → G7 → Cmaj7 cực kỳ phổ biến trong Jazz và Pop hiện đại.

---

## Guitar Application

### Nhận Ra NCT Khi Nghe

Khi nghe một bài Jazz hoặc Bossa, chú ý:

1. **Note "nằm ngoài" chord nhưng nghe vẫn đúng** → đó là NCT
2. **Note accented mà "rõ ràng sai"** nhưng resolve xuống → Appoggiatura hoặc Suspension
3. **Note cuối phrase đến sớm trước beat** → Anticipation (rất phổ biến trong Jazz/Bossa syncopation)

> [!example] Guitar Practice 5.1 — Thêm NCT vào melody đơn giản
> Lấy vòng **Dm7 → G7 → Cmaj7** và thêm passing tones:
>
> 1. Chơi chord tones đơn thuần: D → G → C (một nốt mỗi chord)
> 2. Thêm PT: D–E–F → G–A–B → C (lấp đầy khoảng cách thirds)
> 3. Thêm NT: D–E–D → G–A–G → C–D–C
>
> Nghe sự khác biệt ở từng bước.

> [!example] Guitar Practice 5.2 — Suspension trên guitar
> Chơi progression **G7sus4 → G7 → Cmaj7**:
>
> ```
> G7sus4:   e──3  B──3  G──3  D──0  A──x  E──3
> G7:       e──1  B──0  G──0  D──0  A──x  E──3
> Cmaj7:    e──0  B──0  G──0  D──2  A──3  E──x
> ```
>
> Nghe F (sus 4th) resolve xuống E (3rd) khi chuyển G7sus4 → G7. Đây là suspension 4–3 được guitar hóa.

---

## Practice

> [!example] Bài tập 5.1 — Nhận diện NCT
> Cho melody sau trên chord Cmaj7 (C–E–G–B):
>
> **C – D – E – F – E – D – C**
>
> Xác định từng nốt: chord tone (CT) hay NCT? Nếu là NCT, loại nào?

> [!example] Bài tập 5.2 — Viết suspension
> Viết một suspension 4–3 cho progression **F → C** trong C major:
> - Nốt nào là chord tone của F (IV) sẽ trở thành NCT khi vào C (I)?
> - Nốt đó resolve xuống nốt nào của C?
> - Interval với bass lúc suspension là gì? Lúc resolution là gì?

> [!example] Bài tập 5.3 — Phân tích
> Nghe *Misty* (Erroll Garner / Johnny Burke). Trong 4 bars đầu, tìm:
> - Ít nhất 1 appoggiatura trong melody
> - Ít nhất 1 passing tone
> - Có suspension nào không?

> [!example] Bài tập 5.4 — Sáng tác
> Viết một melody 4-bar đơn giản cho progression **C – Am – F – G** trong C major.
> Yêu cầu: dùng ít nhất một PT, một NT, và một ANT (anticipation trước khi chord đổi).

---

## Summary / Key Takeaways

- **NCT** = nốt không thuộc chord đang vang — tạo dissonance có kiểm soát, làm melody sống động
- **PT**: step → tiếp tục step cùng chiều — lấp đầy khoảng cách, trơn tru nhất
- **NT**: step → step ngược chiều về cùng note — trang trí, tạo chuyển động nhỏ
- **SUS**: tied → step **xuống** (accented) — dissonance mạnh, rất biểu cảm; loại 4–3, 7–6, 9–8
- **ANT**: step → đứng yên (unaccented) — đến sớm, syncopation; rất phổ biến trong Jazz/Bossa
- **APP**: leap → step ngược chiều (accented) — dramatic, "tựa vào" — trái tim của Romantic melody
- **ET**: step → leap ngược chiều (unaccented) — "thoát ra", hiếm
- **RET**: tied → step **lên** (accented) — suspension đi lên, rất vocal
- **PED**: bass đứng yên qua chord changes — ổn định (tonic pedal) hoặc tension (dominant pedal)
- Trong Jazz: Sus chord (Xsus4) = suspension "đóng hộp" thành chord riêng — rất phổ biến

---

## Đáp án Bài tập 5.1

C–D–E–F–E–D–C trên Cmaj7 (C–E–G–B):
- **C**: CT (root)
- **D**: NCT — **PT** (tiếp cận từ C, đi lên tiếp đến E)
- **E**: CT (3rd)
- **F**: NCT — **NT** (upper neighbor của E: E→F→E)
- **E**: CT (3rd, trở về)
- **D**: NCT — **PT** (đi xuống từ E về C)
- **C**: CT (root)

---

## Đáp án Bài tập 5.2

**F → C** (IV → I), bass đi F → C:
- Chord tone F (IV) = F (root), A (3rd), C (5th)
- Chord tone C (I) = C (root), E (3rd), G (5th)
- Nốt **A** là 3rd của F, khi chord đổi sang C thì A không phải chord tone → A trở thành NCT
- A trên bass C = P6 → resolve xuống G (P5) → **SUS 6–5** (ít gặp hơn)

Hoặc phổ biến hơn: soprano giữ **F** (root của IV) sang chord I — F trên bass C = P4 → resolve xuống E (M3) → **SUS 4–3** ✓

---

## References

- Walter Piston — *Harmony* (5th ed.), Ch. 10: Non-Harmonic Tones
- Open Music Theory — *Embellishing Tones* (openmusictheory.github.io)
- Wikipedia — *Nonchord Tone*
- Kaitlin Bove — *Non-Harmonic Tones* (kaitlinbove.com)
- Fiveable — *Identifying and Writing Suspensions*
- Music Theory Academy — *Suspensions*
