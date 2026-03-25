---
title: "01. Foundations — SOLID & OOP nâng cao"
tags: [design-patterns, gof, solid, oop, lesson-01]
aliases: [Foundations, SOLID Principles]
created: 2026-03-24
---

> **Prerequisites**: OOP cơ bản — class, object, inheritance, polymorphism
> **Objectives**:
> - Hiểu tại sao design pattern ra đời và giải quyết vấn đề gì
> - Nắm 5 nguyên lý SOLID và nhận ra vi phạm trong code thực tế
> - Phân biệt composition vs inheritance và biết khi nào dùng cái nào
> - Đọc được UML class diagram cơ bản dùng xuyên suốt khóa học

---

## Tại sao cần Design Pattern?

Lập trình hướng đối tượng cho ta các công cụ mạnh: kế thừa, đóng gói, đa hình. Nhưng công cụ mạnh dùng sai cách lại sinh ra code khó bảo trì, khó mở rộng, và dễ vỡ khi requirement thay đổi.

**Design pattern** (mẫu thiết kế) là những giải pháp đã được đúc kết từ kinh nghiệm thực tế — không phải code copy-paste, mà là *khuôn tư duy* (template of thinking) cho các vấn đề thiết kế hay gặp. Cuốn sách GoF (*Design Patterns: Elements of Reusable Object-Oriented Software*, 1994) của Gamma, Helm, Johnson, Vlissides là nơi hệ thống hóa 23 pattern kinh điển này.

Ba nhóm chính:
- **Creational** — kiểm soát cách tạo object
- **Structural** — tổ chức object và class thành cấu trúc lớn hơn
- **Behavioral** — quản lý giao tiếp và trách nhiệm giữa các object

Trước khi học pattern, cần vững nền tảng thiết kế OOP tốt — đó là mục tiêu của lesson này.

---

## Nguyên lý SOLID

SOLID là 5 nguyên lý thiết kế OOP do Robert C. Martin tổng hợp. Chúng không phải quy tắc cứng nhắc, mà là kim chỉ nam giúp code dễ đọc, dễ test, dễ thay đổi.

### S — Single Responsibility Principle

> [!definition] SRP — Single Responsibility Principle
> Mỗi class chỉ nên có **một lý do để thay đổi** (one reason to change).
>
> Nói cách khác: một class chỉ chịu trách nhiệm cho một khía cạnh duy nhất của hệ thống.

**Vi phạm SRP:**

```python
class Invoice:
    def __init__(self, items: list):
        self.items = items

    def calculate_total(self) -> float:
        return sum(item["price"] * item["qty"] for item in self.items)

    def print_invoice(self):
        for item in self.items:
            print(f"{item['name']}: {item['price']} x {item['qty']}")
        print(f"Total: {self.calculate_total()}")

    def save_to_database(self, db_connection):
        db_connection.execute(
            "INSERT INTO invoices ...", (self.calculate_total(),)
        )
```

Class `Invoice` đang làm 3 việc: tính toán nghiệp vụ, in ấn, và lưu database. Nếu format in thay đổi, hay database schema thay đổi, ta phải sửa class này — dù logic nghiệp vụ không đổi gì.

**Sau khi áp dụng SRP:**

```python
class Invoice:
    def __init__(self, items: list):
        self.items = items

    def calculate_total(self) -> float:
        return sum(item["price"] * item["qty"] for item in self.items)


class InvoicePrinter:
    def print(self, invoice: Invoice):
        for item in invoice.items:
            print(f"{item['name']}: {item['price']} x {item['qty']}")
        print(f"Total: {invoice.calculate_total()}")


class InvoiceRepository:
    def __init__(self, db_connection):
        self.db = db_connection

    def save(self, invoice: Invoice):
        self.db.execute(
            "INSERT INTO invoices ...", (invoice.calculate_total(),)
        )
```

Mỗi class có một lý do để thay đổi. Thay đổi cách lưu DB không ảnh hưởng đến cách tính toán.

---

### O — Open/Closed Principle

> [!definition] OCP — Open/Closed Principle
> Class nên **mở để mở rộng** (open for extension), nhưng **đóng để sửa đổi** (closed for modification).
>
> Khi thêm tính năng mới, ta thêm code mới — không sửa code cũ đang chạy đúng.

**Vi phạm OCP:**

```python
class DiscountCalculator:
    def calculate(self, customer_type: str, price: float) -> float:
        if customer_type == "regular":
            return price
        elif customer_type == "member":
            return price * 0.9
        elif customer_type == "vip":
            return price * 0.8
```

**Sau khi áp dụng OCP:**

```python
from abc import ABC, abstractmethod


class DiscountStrategy(ABC):
    @abstractmethod
    def apply(self, price: float) -> float: ...


class RegularDiscount(DiscountStrategy):
    def apply(self, price: float) -> float:
        return price


class MemberDiscount(DiscountStrategy):
    def apply(self, price: float) -> float:
        return price * 0.9


class VIPDiscount(DiscountStrategy):
    def apply(self, price: float) -> float:
        return price * 0.8


class DiscountCalculator:
    def __init__(self, strategy: DiscountStrategy):
        self.strategy = strategy

    def calculate(self, price: float) -> float:
        return self.strategy.apply(price)
```

Thêm loại khách mới chỉ cần thêm class mới kế thừa `DiscountStrategy` — không đụng vào `DiscountCalculator`.

> [!note] Ghi chú
> Đây chính là nền tảng của **Strategy pattern** — sẽ học chi tiết ở Lesson 09.

---

### L — Liskov Substitution Principle

> [!definition] LSP — Liskov Substitution Principle
> Nếu `S` là subtype của `T`, thì các object kiểu `T` trong chương trình có thể được **thay thế bằng object kiểu `S`** mà không làm hỏng tính đúng đắn của chương trình.
>
> Nói đơn giản: subclass phải *behave* như superclass, không được bẻ gãy kỳ vọng của client.

**Vi phạm LSP — ví dụ kinh điển:**

```python
class Rectangle:
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height


class Square(Rectangle):
    def __init__(self, side: float):
        super().__init__(side, side)

    @property
    def width(self):
        return self._width

    @width.setter
    def width(self, value):
        self._width = value
        self._height = value  # Giữ tính vuông

    @property
    def height(self):
        return self._height

    @height.setter
    def height(self, value):
        self._width = value
        self._height = value


def process_rectangle(rect: Rectangle):
    rect.width = 10
    rect.height = 5
    assert rect.area() == 50, f"Expected 50, got {rect.area()}"


r = Rectangle(3, 4)
process_rectangle(r)  # OK

s = Square(3)
process_rectangle(s)  # AssertionError! area = 25, không phải 50
```

`Square` là subclass của `Rectangle` nhưng vi phạm kỳ vọng: khi set `width`, `height` cũng tự thay đổi — hành vi không ai ngờ tới.

**Giải pháp**: Tách `Square` và `Rectangle` thành hai class độc lập, hoặc dùng interface chung `Shape` với method `area()` mà không kế thừa lẫn nhau.

---

### I — Interface Segregation Principle

> [!definition] ISP — Interface Segregation Principle
> Client không nên bị buộc phải phụ thuộc vào những method mà nó **không dùng**.
>
> Tách interface lớn thành nhiều interface nhỏ, chuyên biệt hơn.

**Vi phạm ISP:**

```python
from abc import ABC, abstractmethod


class Worker(ABC):
    @abstractmethod
    def work(self): ...

    @abstractmethod
    def eat(self): ...

    @abstractmethod
    def sleep(self): ...


class Robot(Worker):
    def work(self):
        print("Robot đang làm việc")

    def eat(self):
        raise NotImplementedError("Robot không ăn!")  # Bị buộc implement thứ vô nghĩa

    def sleep(self):
        raise NotImplementedError("Robot không ngủ!")
```

**Sau khi áp dụng ISP:**

```python
from abc import ABC, abstractmethod


class Workable(ABC):
    @abstractmethod
    def work(self): ...


class Feedable(ABC):
    @abstractmethod
    def eat(self): ...


class Sleepable(ABC):
    @abstractmethod
    def sleep(self): ...


class Human(Workable, Feedable, Sleepable):
    def work(self): print("Người đang làm việc")
    def eat(self): print("Người đang ăn")
    def sleep(self): print("Người đang ngủ")


class Robot(Workable):
    def work(self): print("Robot đang làm việc")
```

---

### D — Dependency Inversion Principle

> [!definition] DIP — Dependency Inversion Principle
> **High-level module** không nên phụ thuộc vào **low-level module**. Cả hai nên phụ thuộc vào **abstraction**.
>
> Abstraction không nên phụ thuộc vào chi tiết. Chi tiết nên phụ thuộc vào abstraction.

Đây là nguyên lý quan trọng nhất — nó là nền tảng của dependency injection và nhiều pattern.

**Vi phạm DIP:**

```python
class MySQLDatabase:
    def save(self, data: dict):
        print(f"Saving {data} to MySQL")


class UserService:
    def __init__(self):
        self.db = MySQLDatabase()  # Phụ thuộc trực tiếp vào concrete class

    def create_user(self, name: str):
        self.db.save({"name": name})
```

`UserService` (high-level) phụ thuộc trực tiếp vào `MySQLDatabase` (low-level). Muốn chuyển sang PostgreSQL phải sửa `UserService`.

**Sau khi áp dụng DIP:**

```python
from abc import ABC, abstractmethod


class Database(ABC):
    @abstractmethod
    def save(self, data: dict): ...


class MySQLDatabase(Database):
    def save(self, data: dict):
        print(f"Saving {data} to MySQL")


class PostgreSQLDatabase(Database):
    def save(self, data: dict):
        print(f"Saving {data} to PostgreSQL")


class UserService:
    def __init__(self, db: Database):   # Nhận abstraction, không phải concrete
        self.db = db

    def create_user(self, name: str):
        self.db.save({"name": name})


service = UserService(MySQLDatabase())
service2 = UserService(PostgreSQLDatabase())
```

`UserService` không biết và không quan tâm đến implementation cụ thể.

---

## Composition vs Inheritance

Một trong những quyết định thiết kế quan trọng nhất trong OOP là chọn giữa **kế thừa** (inheritance) và **thành phần** (composition).

> [!definition] Composition
> Object A **chứa** object B như một attribute. A *có* (has-a) một B.
>
> Object A **ủy thác** (delegate) công việc cho B khi cần.
>
> [!definition] Inheritance
> Class B **kế thừa** class A. B *là một* (is-a) A.
>
> B nhận toàn bộ interface và (thường là) implementation từ A.

**Quy tắc ngón tay cái**: Ưu tiên composition hơn inheritance. Inheritance tạo ra coupling chặt — thay đổi superclass ảnh hưởng tới tất cả subclass. Composition linh hoạt hơn vì behavior có thể hoán đổi lúc runtime.

**Ví dụ — inheritance cứng nhắc:**

```python
class Animal:
    def breathe(self): print("Thở")
    def move(self): print("Di chuyển")
    def make_sound(self): print("Âm thanh")


class Dog(Animal):
    def make_sound(self): print("Gâu gâu")


class Duck(Animal):
    def make_sound(self): print("Cạc cạc")
    def swim(self): print("Bơi")
```

**Refactor sang composition:**

```python
from abc import ABC, abstractmethod


class SoundBehavior(ABC):
    @abstractmethod
    def make_sound(self): ...


class MoveBehavior(ABC):
    @abstractmethod
    def move(self): ...


class BarkSound(SoundBehavior):
    def make_sound(self): print("Gâu gâu")


class QuackSound(SoundBehavior):
    def make_sound(self): print("Cạc cạc")


class RunMove(MoveBehavior):
    def move(self): print("Chạy bằng 4 chân")


class SwimMove(MoveBehavior):
    def move(self): print("Bơi")


class Animal:
    def __init__(self, sound: SoundBehavior, movement: MoveBehavior):
        self._sound = sound
        self._movement = movement

    def make_sound(self): self._sound.make_sound()
    def move(self): self._movement.move()


dog = Animal(BarkSound(), RunMove())
duck = Animal(QuackSound(), SwimMove())
rubber_duck = Animal(QuackSound(), SwimMove())  # Dễ dàng
```

Behavior giờ có thể hoán đổi lúc runtime, không cần tạo subclass mới.

---

## UML Class Diagram cơ bản

Xuyên suốt khóa học, mình sẽ dùng UML class diagram để mô tả cấu trúc pattern. Đây là những ký hiệu cần biết:

**Các loại quan hệ:**

| Ký hiệu | Tên | Ý nghĩa | Ví dụ |
|---------|-----|---------|-------|
| `——▷` (mũi tên trắng) | Inheritance | B kế thừa A | `Dog` extends `Animal` |
| `----▷` (nét đứt trắng) | Implementation | B implement interface A | `Dog` implements `Soundable` |
| `——◆` (thoi đặc) | Composition | A chứa B, B không tồn tại nếu A mất | `House` chứa `Room` |
| `——◇` (thoi rỗng) | Aggregation | A chứa B, B có thể tồn tại độc lập | `Team` chứa `Player` |
| `——>` (mũi tên thường) | Association / Dependency | A sử dụng B | `UserService` dùng `Database` |

**Đọc ký hiệu trong class box:**

```text
┌──────────────────────┐
│  «interface»         │
│  Shape               │  ← Tên class / interface
├──────────────────────┤
│ - _color: str        │  ← Attribute (- private, + public, # protected)
├──────────────────────┤
│ + area(): float      │  ← Method (+ public)
│ + draw(): None       │
└──────────────────────┘
```

---

## Summary / Key Takeaways

- Design pattern là **khuôn tư duy** cho các vấn đề thiết kế hay gặp — không phải code copy-paste.
- **SOLID** là 5 nguyên lý giúp code dễ bảo trì: SRP (một trách nhiệm), OCP (mở rộng không sửa đổi), LSP (subclass behave như superclass), ISP (interface nhỏ chuyên biệt), DIP (phụ thuộc abstraction).
- **Composition** linh hoạt hơn inheritance — behavior có thể hoán đổi lúc runtime, coupling thấp hơn.
- **"Favor composition over inheritance"** là nguyên tắc xuyên suốt GoF.
- Hầu hết các pattern sẽ implement DIP và OCP — nắm chắc hai nguyên lý này trước.

---

## References

- Gamma et al. — *Design Patterns: Elements of Reusable Object-Oriented Software* (1994), Introduction
- Robert C. Martin — *Clean Architecture* (2017), Chương SOLID Principles
- Refactoring.Guru — https://refactoring.guru/design-patterns/what-is-pattern
- Python `abc` module — https://docs.python.org/3/library/abc.html
