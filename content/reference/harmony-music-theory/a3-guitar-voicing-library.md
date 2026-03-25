---
title: "A3. Guitar Chord Voicing Library"
tags: [music-theory, harmony, reference, guitar, voicings]
aliases: [Guitar Voicing Library, Jazz Guitar Chords, Chord Shapes]
created: 2026-03-25
---

> **Mục đích**: Thư viện voicings guitar thực tế cho Jazz, Classical, Bossa Nova, Tango. Mỗi chord type có ít nhất 2–3 positions. Dùng như reference khi chơi lead sheet.
>
> **Notation**: e–B–G–D–A–E (từ string cao xuống thấp), số = fret, x = không chơi, 0 = open.

---

## 1. Major 7th Chords (Xmaj7)

### Cmaj7

```
Position 1 (root E-string):    Position 2 (root A-string):
e──0                           e──3
B──1                           B──5
G──0                           G──4
D──2                           D──5
A──3                           A──3
E──x                           E──x
Notes: E-C-E-G-B (no root 6)  Notes: G-C-E-G-C (double root)

Shell voicing (3rd+7th only):
e──x
B──1  (C — wait, B is B)
```

*Cmaj7 voicings thực dụng nhất:*
```
Open:   x32000  (C–E–G–C–E — classic)
Barre:  x35453  (root A-string fret 3)
Drop2:  x3544x  (drop-2 voicing)
Jazz shell: x3x455  (guide tones + 9th)
```

### Fmaj7

```
Standard:  x–8–10–9–10–8  (barre fret 8, root A)
Open:      x–x–3–2–1–0
Compact:   1–0–2–3–x–x   (root E string fret 1, no 5th)
Shell:     x–x–3–5–5–x   (F root on D-string)
```

### Voicing Shape — Di Chuyển Theo Root

**maj7 shape với root trên string A** (ví dụ Amaj7 = fret 0 trên A):
```
e──(n-1)   = major 7th
B──(n)     = root
G──(n)     = root hoặc 5th
D──(n+2)   = major 3rd
A──(n)     = root
E──x
```
Dịch shape này: Amaj7(n=0), Bbmaj7(n=1), Bmaj7(n=2), Cmaj7(n=3)...

---

## 2. Dominant 7th Chords (X7)

### G7 — Positions

```
Open:     3–2–0–0–0–1   (G–F–D–G–B–E)
Barre:    3–x–4–3–x–3   (G7, root E-string fret 3)
Shell:    x–x–4–3–5–x   (guide tones: F=b7, B=3rd)
```

### C7 — Positions

```
Standard: x–3–2–3–1–0   (classic jazz voicing)
Barre:    x–3–5–3–5–3   (root A-string fret 3, full barre)
Shell:    x–3–2–3–x–x   (root+3rd+7th only)
```

### X7#11 (Lydian Dominant)

```
C7#11 (Bb and F# on top):
e──x
B──6   (F# = #11)
G──5   (E = 3rd)
D──5   (A... wait, A = 6th, not #11)

G7#11 (compact, root E-string fret 3):
e──x
B──7   (C# = #11 of G)
G──7   (D = 5th)
D──5   (A = 9th optional)
A──5   (D = 5th optional)
E──3   (G = root)
```

---

## 3. Minor 7th Chords (Xm7)

### Am7 — Positions

```
Open:     0–1–0–2–0–x   (classic, very common)
Barre:    5–5–5–7–7–5   (root E-string fret 5, full barre)
Shell:    x–0–2–0–x–x   (guide tones E=5th, G=b7... check)
Compact:  x–7–5–5–5–x   (root on A-string fret 7)
```

### Dm7 — Positions

```
Open:     1–1–2–0–x–x   (D root on D-string)
Barre:    1–1–2–3–x–1   (không clean, prefer)
Standard: x–5–3–5–3–x   (root A-string fret 5, clean)
```

### Xm7 Shape (root trên A-string)

```
e──(n-2)  = minor 7th
B──(n-2)  = minor 7th (double)
G──(n-1)  = perfect 5th
D──(n+2)  = minor 3rd... check
A──(n)    = root
E──x
```

---

## 4. Half-Diminished Chords (Xø7 / Xm7♭5)

### Bm7♭5 (in C major = vii)

```
Standard: x–2–0–2–0–x   (open voicing)
Barre:    7–9–7–8–x–x   (root A-string fret 7)
Shell:    x–2–3–2–x–x   (guide tones only: F=♭5, A=♭7 of B)
```

### Gm7♭5 (common in Jazz standards)

```
e──x
B──6   (F = ♭7)
G──5   (D♭ = ♭5)
D──5   (G... wait D string fret 5 = G)
A──x
E──3   (G = root, fret 3)
```

---

## 5. Diminished 7th Chords (X°7)

**Đặc tính quan trọng**: dim7 chord có tính **symmetrical** — dịch chuyển 3 frets (minor 3rd) lên/xuống = cùng chord với enharmonic respelling.

```
G#°7 / B°7 / D°7 / F°7 (cùng 4 nốt):
Position 1: x–x–1–2–1–2
Position 2: x–x–4–5–4–5
Position 3: x–x–7–8–7–8
Position 4: x–x–10–11–10–11
(Mỗi position cách nhau 3 frets = enharmonic respelling)
```

**Ứng dụng**: G7♭9 ≈ B°7 trên bass G → dùng dim7 shape làm substitute cho altered dominant.

---

## 6. Jazz Shell Voicings — Tổng Hợp

Shell voicings = root + 3rd + 7th (bỏ 5th). Tối thiểu cần thiết để xác định chord quality.

### Shell Voicings — Root Trên String E (Low)

| Chord | Frets (E–A–D–G–B–e) | Notes |
|-------|-------------------|-------|
| X7 | n–x–(n+2)–(n+1)–x–x | root, 3rd, ♭7 |
| Xmaj7 | n–x–(n+2)–(n+1)–x–x | root, 3rd, M7 |
| Xm7 | n–x–(n+1)–(n+1)–x–x | root, ♭3rd, ♭7 |

*(n = root fret trên E string)*

### Shell Voicings — Root Trên String A

| Chord | Frets | Notes |
|-------|-------|-------|
| X7 | x–n–x–(n+1)–(n)–x | root, ♭7, 3rd |
| Xmaj7 | x–n–x–(n+1)–(n+1)–x | root, M7, 3rd |
| Xm7 | x–n–x–(n)–(n)–x | root, 5th (optional), ♭7 |

---

## 7. Bossa Nova Voicings (Nylon String Style)

Jobim/Gilberto style — shell voicings với extensions, thumb bass separate:

```
Fmaj7 (Bossa):       Gm7 (Bossa):        Gb7 (Bossa — tritone sub):
e──0  (E=M7)         e──3 (F=♭7)         e──2 (Ab=9th/♭3?)
B──1  (C=5th)        B──3 (D=5th)        B──2 (Ab=♭3rd of Gb)... 
G──2  (A=3rd)        G──3 (D)            G──2 (Ab... ascending check)
D──3  (F=root)       D──5 (G=root)       D──4 (Gb... wait)
A──x                 A──x                A──x
E──1  (F bass)       E──3 (G bass)       E──2 (Gb bass)
```

**Batida tip**: E và A strings = thumb bass (alternating root–5th). Strings G–B–e = chord stabs.

---

## 8. Tango Voicings (Staccato Style)

Tango không để chord ring — đánh staccato, tắt ngay:

```
Am (Tango — marcato):     E7 (Tango):
e──0                      e──0
B──1                      B──0
G──2                      G──1
D──2                      D──0
A──0                      A──2
E──x                      E──0

Sau khi đánh → ngay lập tức đặt tay lên strings để tắt âm thanh.
```

---

## 9. Extended Voicings Thực Dụng

### X9 Voicings (Dominant 9th)

```
G9 (compact, root fret 3):
e──5  (A = 9th!)
B──5  (G = root double)
G──4  (B = 3rd)
D──3  (F = ♭7)
A──x
E──3  (G = root)
```

### Xmaj9 Voicings

```
Cmaj9 (open):
e──0  (E = 3rd)
B──3  (D = 9th!)
G──0  (G = 5th, optional)
D──0  (D = 9th... wait fret 0 on D = D ✓)
A──3  (C = root)
E──x
```

### X7alt Voicings (Altered Dominant)

```
G7alt (compact):
Dùng D♭7 shape (tritone sub = same function):
e──4  (Ab = ♭5 of Db = ♭9 of G)
B──4  (F = 3rd of Db = ♭7 of G)
G──3  (E♭... = 9th of Db = ♭13 of G)
D──4  (Db = root)
A──4  (Ab... same)
E──x
```

---

## 10. Drop-2 Voicings (Đặc Trưng Jazz Guitar)

**Drop-2** = lấy closed voicing 4 nốt, drop nốt thứ 2 (từ trên) xuống 1 octave.

```
Cmaj7 closed: C–E–G–B (ascending)
Drop-2:       C–G–B–E (nốt thứ 2 từ trên = G, drop xuống 1 octave)

Trên guitar (chuỗi 1–4, root C trên D-string fret 10):
e──12  (E = 3rd)
B──12  (B = maj7)
G──12  (G = 5th)
D──10  (C = root)
A──x
E──x
```

Drop-2 voicings rất phổ biến trong jazz guitar vì:
1. Nằm gọn trong 4 strings liên tiếp
2. Có thể voice lead smoothly giữa các chord

---

## Tham Khảo Lesson

- 7th chord basics: [[01-all-7th-chords|01. All 7th Chords]]
- Extended chords: [[09-extended-altered-chords|09. Extended Chords]]
- Jazz voicings: [[12-jazz-harmony-fundamentals|12. Jazz Harmony Fundamentals]]
- Bossa guitar: [[15-bossa-nova|15. Bossa Nova & Latin Harmony]]
- Tango guitar: [[16-tango-harmony|16. Tango Harmony]]
