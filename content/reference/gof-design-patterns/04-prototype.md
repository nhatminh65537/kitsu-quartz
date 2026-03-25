---
title: "04. Prototype"
tags: [design-patterns, gof, creational, prototype, lesson-04]
aliases: [Prototype Pattern]
created: 2026-03-24
---

> **Prerequisites**: [[01-foundations|01. Foundations]], [[02-singleton-factory-method|02. Singleton & Factory Method]]
> **Objectives**:
> - Hiểu Prototype pattern: clone object thay vì tạo mới từ đầu
> - Phân biệt shallow copy vs deep copy và khi nào mỗi loại phù hợp
> - Implement Prototype registry để quản lý nhiều "template" object
> - Biết khi nào Prototype thực sự cần thiết thay vì chỉ dùng `copy.deepcopy()`

---

## Vấn đề Prototype giải quyết

Đôi khi việc tạo một object mới từ đầu rất tốn kém — object cần đọc file cấu hình, query database, hoặc thực hiện tính toán phức tạp khi khởi tạo. Nếu cần nhiều object tương tự nhau, lặp lại quá trình khởi tạo là lãng phí.

Hơn nữa, đôi khi ta nhận được object từ interface mà không biết concrete class của nó là gì — nên không thể gọi constructor trực tiếp.

> [!definition] Prototype Pattern
> Định nghĩa loại object cần tạo bằng cách dùng một **instance mẫu** (prototype), và tạo object mới bằng cách **clone** prototype đó.
>
> **Ý tưởng cốt lõi**: Thay vì `new MyObject(...)`, ta dùng `existing_object.clone()` — copy một object đang tồn tại và điều chỉnh những gì cần thay đổi.

### Cấu trúc

```text
Prototype (interface)
+ clone() → Prototype
      ▲
      │
ConcretePrototype
- field1, field2, ...
+ clone() → Prototype   ← trả về bản copy của chính mình
```

---

## Shallow Copy vs Deep Copy

Trước khi implement, cần hiểu rõ hai loại copy:

> [!definition] Shallow Copy
> Copy object **cấp độ một** — tạo object mới với các attribute cùng giá trị, nhưng nếu attribute là object tham chiếu (list, dict, object khác), cả bản gốc và bản copy **cùng trỏ** tới object đó.

---

> [!definition] Deep Copy
> Copy **toàn bộ cây object** — tạo object mới hoàn toàn độc lập, kể cả tất cả object mà nó tham chiếu tới. Thay đổi bản copy không ảnh hưởng bản gốc, và ngược lại.

```python
import copy


class Address:
    def __init__(self, city: str, country: str):
        self.city = city
        self.country = country

    def __repr__(self) -> str:
        return f"Address({self.city}, {self.country})"


class Person:
    def __init__(self, name: str, address: Address):
        self.name = name
        self.address = address

    def __repr__(self) -> str:
        return f"Person({self.name}, {self.address})"


original = Person("Alice", Address("Hà Nội", "Việt Nam"))
shallow = copy.copy(original)
deep = copy.deepcopy(original)

shallow.name = "Bob"
shallow.address.city = "Hồ Chí Minh"

deep.name = "Charlie"
deep.address.city = "Đà Nẵng"

print(original)
print(shallow)
print(deep)
```

Sau khi chạy: `original.address.city` sẽ là `"Hồ Chí Minh"` (bị thay đổi qua shallow copy), nhưng không bị ảnh hưởng bởi deep copy.

**Quy tắc chọn:**
- Dùng **shallow copy** khi object chứa immutable values (int, str, tuple) hoặc khi muốn chia sẻ sub-object có chủ đích.
- Dùng **deep copy** khi cần bản sao hoàn toàn độc lập — thường là đúng trong Prototype pattern.

---

## Implementation cơ bản

Python cung cấp `copy.copy()` và `copy.deepcopy()` sẵn có. Prototype pattern trong Python thường implement bằng cách override `__copy__` hoặc `__deepcopy__`, hoặc đơn giản là thêm method `clone()` gọi `deepcopy`.

```python
import copy
from abc import ABC, abstractmethod


class Prototype(ABC):
    @abstractmethod
    def clone(self) -> "Prototype": ...


class GameUnit(Prototype):
    def __init__(self, unit_type: str, hp: int, attack: int, skills: list[str]):
        self.unit_type = unit_type
        self.hp = hp
        self.attack = attack
        self.skills = skills

    def clone(self) -> "GameUnit":
        return copy.deepcopy(self)

    def __repr__(self) -> str:
        return (
            f"GameUnit(type={self.unit_type}, hp={self.hp}, "
            f"attack={self.attack}, skills={self.skills})"
        )


archer_template = GameUnit(
    unit_type="Archer",
    hp=80,
    attack=45,
    skills=["Arrow Shot", "Eagle Eye"]
)

archer_1 = archer_template.clone()
archer_1.hp = 60
archer_1.skills.append("Poison Arrow")

archer_2 = archer_template.clone()
archer_2.attack = 50

print(f"Template : {archer_template}")
print(f"Archer 1 : {archer_1}")
print(f"Archer 2 : {archer_2}")
```

Template không bị thay đổi dù archer_1 và archer_2 đã được customize — đây là lợi ích của deep copy.

---

## Prototype Registry

Khi có nhiều loại prototype, ta dùng **Prototype Registry** (còn gọi là Prototype Manager) để quản lý tập hợp các template đã đăng ký.

```python
import copy
from abc import ABC, abstractmethod


class Shape(ABC):
    def __init__(self, color: str = "black"):
        self.color = color

    @abstractmethod
    def clone(self) -> "Shape": ...

    @abstractmethod
    def area(self) -> float: ...

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(color={self.color}, area={self.area():.2f})"


class Circle(Shape):
    def __init__(self, radius: float, color: str = "black"):
        super().__init__(color)
        self.radius = radius

    def clone(self) -> "Circle":
        return copy.deepcopy(self)

    def area(self) -> float:
        import math
        return math.pi * self.radius ** 2


class Rectangle(Shape):
    def __init__(self, width: float, height: float, color: str = "black"):
        super().__init__(color)
        self.width = width
        self.height = height

    def clone(self) -> "Rectangle":
        return copy.deepcopy(self)

    def area(self) -> float:
        return self.width * self.height


class ShapeRegistry:
    def __init__(self):
        self._prototypes: dict[str, Shape] = {}

    def register(self, name: str, prototype: Shape) -> None:
        self._prototypes[name] = prototype

    def unregister(self, name: str) -> None:
        self._prototypes.pop(name, None)

    def clone(self, name: str, **overrides) -> Shape:
        prototype = self._prototypes.get(name)
        if prototype is None:
            raise KeyError(f"Prototype '{name}' not found")
        cloned = prototype.clone()
        for attr, value in overrides.items():
            setattr(cloned, attr, value)
        return cloned

    def list_prototypes(self) -> list[str]:
        return list(self._prototypes.keys())


registry = ShapeRegistry()
registry.register("small_circle", Circle(radius=5.0, color="red"))
registry.register("large_circle", Circle(radius=20.0, color="blue"))
registry.register("standard_rect", Rectangle(width=10.0, height=5.0, color="green"))

print("Available prototypes:", registry.list_prototypes())

c1 = registry.clone("small_circle", color="yellow")
c2 = registry.clone("large_circle")
r1 = registry.clone("standard_rect", width=15.0, color="purple")

print(c1)
print(c2)
print(r1)
```

`overrides` trong method `clone()` của registry cho phép customize ngay khi clone — rất tiện cho các tình huống cần hàng loạt object gần giống nhau.

---

## Worked Example — Document Template System

Bài toán thực tế: hệ thống soạn thảo có sẵn các template document (hợp đồng, báo cáo, email) — người dùng clone template và điền nội dung riêng.

```python
import copy
from datetime import datetime


class DocumentSection:
    def __init__(self, title: str, content: str, formatting: dict):
        self.title = title
        self.content = content
        self.formatting = formatting

    def __repr__(self) -> str:
        return f"Section[{self.title}]"


class Document:
    def __init__(self, name: str):
        self.name = name
        self.sections: list[DocumentSection] = []
        self.metadata: dict = {}
        self.created_at = datetime.now()

    def add_section(self, section: DocumentSection) -> None:
        self.sections.append(section)

    def clone(self) -> "Document":
        cloned = copy.deepcopy(self)
        cloned.created_at = datetime.now()
        cloned.name = f"Copy of {self.name}"
        return cloned

    def fill(self, **fields) -> "Document":
        for section in self.sections:
            for key, value in fields.items():
                section.content = section.content.replace(f"{{{key}}}", value)
        self.metadata.update(fields)
        return self

    def render(self) -> str:
        lines = [f"Document: {self.name}", f"Created: {self.created_at.date()}", ""]
        for s in self.sections:
            lines.append(f"## {s.title}")
            lines.append(s.content)
            lines.append("")
        return "\n".join(lines)


contract_template = Document("Contract Template")
contract_template.add_section(DocumentSection(
    title="Parties",
    content="This agreement is between {company} and {client}.",
    formatting={"font": "Times New Roman", "size": 12}
))
contract_template.add_section(DocumentSection(
    title="Terms",
    content="Service will be provided from {start_date} to {end_date}.",
    formatting={"font": "Times New Roman", "size": 12}
))
contract_template.metadata["type"] = "contract"

contract_1 = (
    contract_template.clone()
    .fill(company="ACME Corp", client="Bob Ltd",
          start_date="2026-04-01", end_date="2026-12-31")
)
contract_1.name = "Contract ACME-Bob 2026"

contract_2 = (
    contract_template.clone()
    .fill(company="TechVN", client="StartupXYZ",
          start_date="2026-05-01", end_date="2027-04-30")
)
contract_2.name = "Contract TechVN-StartupXYZ"

print(contract_1.render())
print(contract_2.render())

print("Template untouched:", contract_template.sections[0].content)
```

Clone template, fill thông tin riêng, đặt tên mới — template gốc không bao giờ bị thay đổi.

---

## `__copy__` và `__deepcopy__` trong Python

Khi cần kiểm soát chính xác quá trình copy, Python cho phép override hai dunder method này:

```python
import copy


class ConfiguredCache:
    def __init__(self, config: dict, data: dict):
        self.config = config
        self._data = data
        self._connection = None

    def __copy__(self) -> "ConfiguredCache":
        new = self.__class__.__new__(self.__class__)
        new.__dict__.update(self.__dict__)
        new._data = self._data.copy()
        new._connection = None
        return new

    def __deepcopy__(self, memo: dict) -> "ConfiguredCache":
        new = self.__class__.__new__(self.__class__)
        memo[id(self)] = new
        for k, v in self.__dict__.items():
            if k == "_connection":
                setattr(new, k, None)
            else:
                setattr(new, k, copy.deepcopy(v, memo))
        return new
```

`memo` trong `__deepcopy__` là dict theo dõi object đã copy — tránh vòng lặp vô hạn với circular reference.

---

## Trade-offs của Prototype

**Ưu điểm:**
- Tránh subclass explosion khi cần nhiều biến thể gần giống nhau
- Clone nhanh hơn tạo mới khi constructor tốn kém (I/O, network, computation)
- Clone object mà không cần biết concrete class của nó

**Nhược điểm:**
- Deep copy của object có circular reference hoặc cấu trúc phức tạp có thể khó implement
- Clone object chứa resource bên ngoài (file handle, DB connection) cần xử lý cẩn thận
- `copy.deepcopy()` trong Python đủ mạnh cho hầu hết trường hợp — pattern này đôi khi không cần thiết

> [!note] Prototype trong Python thực tế
> Python's `copy.deepcopy()` đã implement sẵn phần lớn những gì Prototype pattern cần. Pattern có giá trị nhất khi cần: (1) **Prototype Registry** quản lý nhiều template, (2) clone object từ interface không biết concrete class, hoặc (3) kiểm soát chính xác cách clone qua `__deepcopy__`.

---

## Summary / Key Takeaways

- **Prototype** clone object hiện có thay vì tạo mới từ đầu — hữu ích khi constructor tốn kém hoặc khi không biết concrete class.
- **Shallow copy** chia sẻ sub-object; **deep copy** tạo bản sao hoàn toàn độc lập — hầu hết Prototype cần deep copy.
- **Prototype Registry** quản lý nhiều template và cho phép clone theo tên — kết hợp tốt với Singleton (registry là singleton).
- Trong Python, `copy.deepcopy()` và `__deepcopy__` là công cụ implement pattern này; không cần thư viện ngoài.
- Kết hợp phổ biến: Prototype + Factory Method — factory quyết định *loại* object, Prototype quyết định *trạng thái khởi đầu*.

---

## References

- Gamma et al. — *Design Patterns*, Ch. 3: Prototype tr.117
- Refactoring.Guru — Prototype: https://refactoring.guru/design-patterns/prototype/python/example
- Python `copy` module — https://docs.python.org/3/library/copy.html
- PEP 3107 — `__copy__` and `__deepcopy__` protocol
