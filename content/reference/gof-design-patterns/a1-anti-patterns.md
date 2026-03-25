---
title: "A1. Anti-patterns & Common Pitfalls"
tags: [design-patterns, gof, appendix, anti-patterns, pitfalls]
aliases: [Anti-patterns, Common Pitfalls]
created: 2026-03-24
---

> **Mục đích**: Nhận ra những sai lầm phổ biến khi áp dụng design pattern — biết khi nào KHÔNG dùng pattern quan trọng không kém biết khi nào dùng.

---

## Anti-pattern 1: Pattern Overuse (Over-engineering)

**Triệu chứng**: Áp dụng pattern vào mọi thứ, kể cả khi không cần thiết. Code có nhiều abstraction layer nhưng ít chức năng thực sự.

**Ví dụ — dùng Factory cho thứ không cần factory:**

```python
class SimpleAdder:
    def add(self, a: int, b: int) -> int:
        return a + b

class SimpleAdderFactory:
    def create(self) -> SimpleAdder:
        return SimpleAdder()

class SimpleAdderFactoryProvider:
    def get_factory(self) -> SimpleAdderFactory:
        return SimpleAdderFactory()

result = SimpleAdderFactoryProvider().get_factory().create().add(1, 2)
```

**Giải pháp đúng:**

```python
def add(a: int, b: int) -> int:
    return a + b

result = add(1, 2)
```

**Nguyên tắc**: Pattern giải quyết vấn đề biến đổi. Nếu không có variation (loại object khác nhau, behavior khác nhau), không cần pattern.

---

## Anti-pattern 2: God Object / God Class

**Triệu chứng**: Một class biết quá nhiều và làm quá nhiều — vi phạm SRP nghiêm trọng. Thường xuất hiện khi Facade bị nhét thêm business logic, hoặc Mediator tích lũy quá nhiều điều phối.

```python
class ApplicationManager:
    def connect_database(self): ...
    def authenticate_user(self): ...
    def process_payment(self): ...
    def send_email(self): ...
    def generate_report(self): ...
    def manage_cache(self): ...
    def log_everything(self): ...
    def handle_file_upload(self): ...
```

**Hậu quả**: Không thể test riêng lẻ. Mọi thay đổi đều chạm vào class này. Merge conflict liên tục trong team.

**Giải pháp**: Tách theo domain responsibility. Facade chỉ orchestrate, không chứa business logic.

---

## Anti-pattern 3: Singleton Abuse

**Triệu chứng**: Dùng Singleton cho bất kỳ thứ gì cần "global access" — biến Singleton thành global variable có vỏ bọc OOP.

```python
class Config(Singleton):
    def __init__(self):
        self.db_host = "localhost"
        self.api_key = "secret"
        self.debug = True
        self.feature_flags = {}
        self.ui_theme = "dark"
```

**Vấn đề thực tế:**

```python
def test_payment_service():
    service = PaymentService()
    service.process(100)

def test_payment_service_with_mock_config():
    Config()._instance.api_key = "test-key"
    service = PaymentService()
    service.process(100)
    Config()._instance.api_key = "secret"
```

Test này phụ thuộc thứ tự chạy, không thể chạy parallel, dễ leak state giữa các test.

**Giải pháp**: Dependency injection thay vì global access.

```python
class PaymentService:
    def __init__(self, config: Config):
        self._config = config

def test_payment_service():
    test_config = Config(api_key="test-key")
    service = PaymentService(config=test_config)
    service.process(100)
```

---

## Anti-pattern 4: Inheritance Hell

**Triệu chứng**: Cây kế thừa quá sâu (4+ level), subclass override method rồi gọi `super()` theo thứ tự không rõ ràng, hoặc dùng inheritance để tái sử dụng code thay vì biểu diễn quan hệ "is-a".

```python
class Animal:
    def breathe(self): ...

class Pet(Animal):
    def be_friendly(self): ...

class Dog(Pet):
    def bark(self): ...

class TrainedDog(Dog):
    def do_tricks(self): ...

class ServiceDog(TrainedDog):
    def assist_human(self): ...

class GuideDog(ServiceDog):
    def guide_blind_person(self): ...
```

Thêm `RobotDog` — không thở nhưng cần tất cả behavior khác. Cả hierarchy vỡ.

**Giải pháp**: Favor composition. Dùng Protocol (structural typing) thay vì inheritance khi chỉ cần interface.

```python
from typing import Protocol

class Guidable(Protocol):
    def guide(self, destination: str) -> None: ...

class Assistive(Protocol):
    def assist(self, task: str) -> None: ...

class GuideDog:
    def guide(self, destination: str) -> None:
        print(f"Guiding to {destination}")

class GuidanceRobot:
    def guide(self, destination: str) -> None:
        print(f"Robot navigating to {destination}")

def navigate(guide: Guidable, destination: str) -> None:
    guide.guide(destination)

navigate(GuideDog(), "hospital")
navigate(GuidanceRobot(), "hospital")
```

---

## Anti-pattern 5: Anemic Domain Model

**Triệu chứng**: Class chỉ chứa data (getter/setter), không có behavior. Business logic tràn ra service classes. Đây là dùng OOP như procedural programming.

```python
class Order:
    def __init__(self):
        self.items = []
        self.status = "pending"
        self.total = 0.0

class OrderService:
    def calculate_total(self, order: Order) -> float:
        return sum(item.price * item.qty for item in order.items)

    def can_cancel(self, order: Order) -> bool:
        return order.status in ("pending", "confirmed")

    def apply_discount(self, order: Order, pct: float) -> None:
        order.total *= (1 - pct / 100)
```

**Vấn đề**: `OrderService` biết quá nhiều về internals của `Order`. Thêm rule mới phải sửa service, không phải domain.

**Giải pháp**: Đưa behavior vào domain object.

```python
class Order:
    def __init__(self):
        self._items: list = []
        self._status = "pending"
        self._discount = 0.0

    def add_item(self, product, qty: int) -> None:
        self._items.append({"product": product, "qty": qty})

    @property
    def subtotal(self) -> float:
        return sum(i["product"].price * i["qty"] for i in self._items)

    @property
    def total(self) -> float:
        return self.subtotal * (1 - self._discount / 100)

    def apply_discount(self, pct: float) -> None:
        if self._status != "pending":
            raise ValueError("Cannot discount a confirmed order")
        self._discount = pct

    def can_cancel(self) -> bool:
        return self._status in ("pending", "confirmed")

    def cancel(self) -> None:
        if not self.can_cancel():
            raise ValueError(f"Cannot cancel order in state '{self._status}'")
        self._status = "cancelled"
```

---

## Anti-pattern 6: Premature Abstraction

**Triệu chứng**: Tạo interface/abstract class khi chỉ có một implementation — "tôi sẽ thêm implementation khác sau".

```python
class IUserRepository(ABC):
    @abstractmethod
    def find_by_id(self, user_id: int) -> dict: ...

    @abstractmethod
    def save(self, user: dict) -> None: ...


class PostgreSQLUserRepository(IUserRepository):
    def find_by_id(self, user_id: int) -> dict:
        return {}

    def save(self, user: dict) -> None:
        pass
```

Nếu không có kế hoạch cụ thể thêm `MongoUserRepository` hay `InMemoryUserRepository` trong tương lai gần, interface này là premature.

**Nguyên tắc**: Extract interface khi có nhu cầu thực sự (second implementation, testing mock). Không phải vì "biết đâu sau này cần".

---

## Anti-pattern 7: Observer Memory Leak

**Triệu chứng**: Đăng ký observer nhưng không hủy đăng ký khi object bị destroy → memory leak và callback được gọi trên object đã "chết".

```python
class EventSystem:
    _listeners = []

    @classmethod
    def subscribe(cls, handler):
        cls._listeners.append(handler)

class TemporaryWidget:
    def __init__(self):
        EventSystem.subscribe(self.on_event)

    def on_event(self, event):
        print(f"Widget handling {event}")
```

`TemporaryWidget` bị xóa nhưng `EventSystem._listeners` vẫn giữ reference → không bao giờ được GC.

**Giải pháp**: Dùng `weakref`, context manager, hoặc explicit `unsubscribe`.

```python
import weakref

class EventSystem:
    _listeners: list[weakref.ref] = []

    @classmethod
    def subscribe(cls, handler):
        cls._listeners.append(weakref.ref(handler))

    @classmethod
    def publish(cls, event):
        alive = []
        for ref in cls._listeners:
            handler = ref()
            if handler is not None:
                handler(event)
                alive.append(ref)
        cls._listeners = alive
```

---

## Anti-pattern 8: Command Without Undo Planning

**Triệu chứng**: Implement Command pattern nhưng không thiết kế undo từ đầu → undo hầu như impossible vì state không được lưu.

```python
class DeleteFileCommand:
    def __init__(self, path: str):
        self._path = path

    def execute(self):
        import os
        os.remove(self._path)

    def undo(self):
        pass
```

**Giải pháp**: Lưu đủ thông tin trước khi execute.

```python
class DeleteFileCommand:
    def __init__(self, path: str):
        self._path = path
        self._backup_content: bytes | None = None

    def execute(self):
        import os
        with open(self._path, 'rb') as f:
            self._backup_content = f.read()
        os.remove(self._path)

    def undo(self):
        if self._backup_content is not None:
            with open(self._path, 'wb') as f:
                f.write(self._backup_content)
```

---

## Tóm tắt: Dấu hiệu nhận biết code smell → Pattern phù hợp

| Code smell | Biểu hiện | Pattern nên dùng |
|-----------|----------|-----------------|
| Long method | Method > 30 dòng với nhiều nhánh | Template Method hoặc Strategy |
| Large class | Class > 200 dòng, nhiều trách nhiệm | SRP → tách class, Facade |
| Primitive obsession | String/int thay vì object | Value Object, Builder |
| Switch/if-elif chain | Rẽ nhánh theo type/state | State hoặc Strategy |
| Duplicated code | Copy-paste với vài dòng khác | Template Method |
| Feature envy | Method dùng nhiều field của class khác | Move method, Facade |
| Inappropriate intimacy | Class biết quá nhiều về class khác | Mediator, reduce coupling |
| Data class | Class chỉ có getter/setter | Enrich domain (Anemic DM fix) |

---

## References

- Martin Fowler — *Refactoring: Improving the Design of Existing Code* (2018)
- Robert C. Martin — *Clean Code* (2008)
- Anti-patterns catalog — https://refactoring.guru/refactoring/smells
- Python Patterns (good and bad) — https://python-patterns.guide
