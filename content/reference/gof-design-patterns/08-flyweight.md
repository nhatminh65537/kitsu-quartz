---
title: "08. Flyweight"
tags: [design-patterns, gof, structural, flyweight, lesson-08]
aliases: [Flyweight Pattern]
created: 2026-03-24
---

> **Prerequisites**: [[01-foundations|01. Foundations]], [[06-decorator-proxy|06. Decorator & Proxy]], [[07-composite-bridge|07. Composite & Bridge]]
> **Objectives**:
> - Hiểu Flyweight: chia sẻ trạng thái chung giữa hàng nghìn object để tiết kiệm bộ nhớ
> - Phân biệt intrinsic state (chia sẻ được) và extrinsic state (không chia sẻ, truyền từ ngoài vào)
> - Implement Flyweight Factory và nhận biết khi nào pattern này thực sự cần thiết
> - Đo lường mức độ tiết kiệm bộ nhớ thực tế bằng `sys.getsizeof`

---

## Vấn đề Flyweight giải quyết

Bạn đang xây dựng game bắn súng: mỗi viên đạn trên màn hình là một object với tọa độ, tốc độ, màu sắc, hình dạng, texture... Khi 1000 viên đạn cùng lúc bay trên màn hình, mỗi viên lưu riêng texture (100 KB) → tiêu tốn 100 MB chỉ cho texture, dù tất cả đạn cùng loại dùng cùng texture đó.

Flyweight nhận ra rằng phần lớn dữ liệu của các object giống nhau là **trạng thái chung không đổi**, có thể chia sẻ.

> [!definition] Flyweight Pattern
> Dùng chia sẻ (sharing) để hỗ trợ hiệu quả một số lượng lớn **object chi tiết** (fine-grained objects). Flyweight tách trạng thái object thành hai phần: **intrinsic state** (trạng thái nội tại — chia sẻ được, lưu trong Flyweight) và **extrinsic state** (trạng thái ngoại tại — duy nhất cho từng instance, truyền vào khi cần).
>
> **Ý tưởng cốt lõi**: Thay vì N object đầy đủ, có K Flyweight object (K << N) chia sẻ intrinsic state, và N bộ extrinsic state nhỏ gọn tồn tại bên ngoài.

### Intrinsic vs Extrinsic State

> [!definition] Intrinsic State
> Thông tin **không phụ thuộc ngữ cảnh** — giống nhau cho tất cả instance cùng loại. Có thể chia sẻ an toàn giữa nhiều object.
>
> Ví dụ: kiểu đạn, màu sắc, texture, sprite, âm thanh nổ, sát thương cơ bản.

---

> [!definition] Extrinsic State
> Thông tin **phụ thuộc ngữ cảnh** — duy nhất cho từng instance. Không thể chia sẻ, phải truyền từ bên ngoài vào mỗi khi dùng Flyweight.
>
> Ví dụ: tọa độ hiện tại (x, y), hướng bay (vx, vy), thời gian tồn tại.

---

## Implementation — Bullet System (Game)

```python
from __future__ import annotations
import sys
from dataclasses import dataclass


@dataclass(frozen=True)
class BulletType:
    name: str
    color: str
    sprite: str
    damage: int
    speed: float

    def __repr__(self) -> str:
        return f"BulletType({self.name})"


class BulletFactory:
    _types: dict[str, BulletType] = {}

    @classmethod
    def get(cls, name: str, color: str, sprite: str,
            damage: int, speed: float) -> BulletType:
        if name not in cls._types:
            cls._types[name] = BulletType(name, color, sprite, damage, speed)
            print(f"[Factory] Created new BulletType: {name}")
        return cls._types[name]

    @classmethod
    def count(cls) -> int:
        return len(cls._types)


@dataclass
class Bullet:
    x: float
    y: float
    vx: float
    vy: float
    bullet_type: BulletType

    def update(self, dt: float) -> None:
        self.x += self.vx * dt
        self.y += self.vy * dt

    def render(self) -> str:
        return (
            f"{self.bullet_type.sprite} at ({self.x:.1f},{self.y:.1f}) "
            f"color={self.bullet_type.color}"
        )


import random

pistol_type = BulletFactory.get("pistol", "yellow", "•", 25, 400.0)
rifle_type = BulletFactory.get("rifle", "silver", "→", 60, 900.0)
shotgun_type = BulletFactory.get("shotgun", "orange", "⊙", 40, 300.0)

N = 10_000
bullets = []
types = [pistol_type, rifle_type, shotgun_type]

for _ in range(N):
    btype = random.choice(types)
    bullets.append(Bullet(
        x=random.uniform(0, 1920),
        y=random.uniform(0, 1080),
        vx=random.uniform(-10, 10),
        vy=random.uniform(-10, 10),
        bullet_type=btype,
    ))

flyweight_count = BulletFactory.count()
bullet_size = sys.getsizeof(bullets[0])
type_size = sys.getsizeof(pistol_type)

print(f"\nTotal bullets   : {N:,}")
print(f"Flyweight types : {flyweight_count} (shared)")
print(f"Memory per Bullet (extrinsic): ~{bullet_size} bytes")
print(f"Memory per BulletType (shared): ~{type_size} bytes")
print(f"Approx memory with Flyweight : ~{(bullet_size * N + type_size * flyweight_count) / 1024:.1f} KB")
print(f"Approx memory without Flyweight: ~{(bullet_size + type_size) * N / 1024:.1f} KB")

for b in bullets[:3]:
    print(b.render())
```

`BulletType` là immutable (`frozen=True`) vì nhiều `Bullet` cùng trỏ vào — bất kỳ thay đổi nào cũng ảnh hưởng tất cả. Factory đảm bảo chỉ có một instance cho mỗi loại.

---

## Implementation — Text Editor (Character Flyweight)

Ví dụ kinh điển từ GoF: text editor lưu hàng triệu ký tự — mỗi ký tự có font, size, style (intrinsic) nhưng tọa độ trong document khác nhau (extrinsic).

```python
from __future__ import annotations
import sys
from dataclasses import dataclass


@dataclass(frozen=True)
class CharacterStyle:
    font: str
    size: int
    bold: bool
    italic: bool
    color: str

    def render_at(self, char: str, row: int, col: int) -> str:
        modifiers = []
        if self.bold:
            modifiers.append("B")
        if self.italic:
            modifiers.append("I")
        mod_str = f"[{''.join(modifiers)}]" if modifiers else ""
        return f"'{char}'{mod_str}({self.font},{self.size}px,{self.color}) @{row},{col}"


class StyleCache:
    _cache: dict[tuple, CharacterStyle] = {}

    @classmethod
    def get_style(cls, font: str, size: int, bold: bool,
                  italic: bool, color: str) -> CharacterStyle:
        key = (font, size, bold, italic, color)
        if key not in cls._cache:
            cls._cache[key] = CharacterStyle(font, size, bold, italic, color)
        return cls._cache[key]

    @classmethod
    def cache_size(cls) -> int:
        return len(cls._cache)


@dataclass
class TextCharacter:
    char: str
    row: int
    col: int
    style: CharacterStyle

    def render(self) -> str:
        return self.style.render_at(self.char, self.row, self.col)


normal = StyleCache.get_style("Arial", 14, False, False, "black")
heading = StyleCache.get_style("Arial", 20, True, False, "black")
emphasis = StyleCache.get_style("Arial", 14, False, True, "gray")
code_style = StyleCache.get_style("Courier", 13, False, False, "darkgreen")

document_text = [
    ("Introduction", heading),
    ("This is a sample document. ", normal),
    ("Note: ", emphasis),
    ("important details follow.", normal),
    ("def hello(): pass", code_style),
]

characters: list[TextCharacter] = []
row = 0
for text, style in document_text:
    for col, ch in enumerate(text):
        characters.append(TextCharacter(ch, row, col, style))
    row += 1

for c in characters[:6]:
    print(c.render())

total_chars = len(characters)
unique_styles = StyleCache.cache_size()
char_size = sys.getsizeof(characters[0])
style_size = sys.getsizeof(normal)

print(f"\nTotal characters : {total_chars:,}")
print(f"Unique styles    : {unique_styles} (shared)")
print(f"Memory saved vs storing style per char: "
      f"~{style_size * (total_chars - unique_styles) // 1024} KB")
```

---

## Flyweight với `functools.lru_cache`

Python cung cấp `@lru_cache` — một cách implement Flyweight Factory cực kỳ ngắn gọn:

```python
from functools import lru_cache
from dataclasses import dataclass


@dataclass(frozen=True)
class Color:
    r: int
    g: int
    b: int
    alpha: float = 1.0

    def __repr__(self) -> str:
        return f"rgba({self.r},{self.g},{self.b},{self.alpha})"


@lru_cache(maxsize=256)
def get_color(r: int, g: int, b: int, alpha: float = 1.0) -> Color:
    return Color(r, g, b, alpha)


red1 = get_color(255, 0, 0)
red2 = get_color(255, 0, 0)
blue = get_color(0, 0, 255)

print(red1 is red2)
print(get_color.cache_info())
```

`lru_cache` tự động làm vai trò Flyweight Factory — cùng tham số trả về cùng object. `frozen=True` dataclass đảm bảo object immutable để chia sẻ an toàn.

---

## Khi nào nên và không nên dùng Flyweight

> [!warning] Flyweight là optimization pattern — dùng khi thực sự cần
> Trước khi áp dụng Flyweight, hãy đo lường thực tế (profiling). Pattern này tăng độ phức tạp đáng kể — chỉ nên dùng khi:
>
> 1. Ứng dụng tạo **số lượng rất lớn** object tương tự nhau (hàng chục nghìn trở lên)
> 2. Đo được memory pressure thực sự từ việc không chia sẻ
> 3. Intrinsic state chiếm phần lớn kích thước object
> 4. Extrinsic state có thể tách ra một cách sạch sẽ

**Không nên dùng khi:** số lượng object nhỏ, object không có trạng thái chung đủ lớn, hoặc khi `copy.copy()` / dictionary đơn giản là đủ.

---

## Trade-offs của Flyweight

**Ưu điểm:** Giảm đáng kể memory khi có nhiều object giống nhau. Cache Flyweight objects → giảm thời gian khởi tạo.

**Nhược điểm:** Code phức tạp hơn — phải phân biệt rõ intrinsic/extrinsic state. Flyweight objects phải immutable — không thể thay đổi sau khi tạo. Extrinsic state phải được tính toán hoặc lưu trữ bên ngoài, thêm overhead.

---

## Summary / Key Takeaways

- **Flyweight** giải quyết memory explosion khi có hàng nghìn object với nhiều trạng thái giống nhau — chia sẻ **intrinsic state** (không đổi, immutable), truyền **extrinsic state** từ bên ngoài.
- Flyweight Factory (`dict` cache hoặc `@lru_cache`) đảm bảo chỉ có một instance cho mỗi combination trạng thái nội tại.
- `frozen=True` dataclass là cách Pythonic nhất để định nghĩa Flyweight object (hashable, immutable).
- Là **optimization pattern** — đo trước, tối ưu sau. Đừng áp dụng mà không có profiling data.
- Kết thúc nhóm Structural: Adapter (interface), Facade (simplify), Decorator (add behavior), Proxy (control access), Composite (tree), Bridge (decouple dimensions), Flyweight (share state).

---

## References

- Gamma et al. — *Design Patterns*, Ch. 4: Flyweight tr.195
- Refactoring.Guru — Flyweight: https://refactoring.guru/design-patterns/flyweight/python/example
- Python `functools.lru_cache` — https://docs.python.org/3/library/functools.html#functools.lru_cache
- Python `sys.getsizeof` — https://docs.python.org/3/library/sys.html#sys.getsizeof
