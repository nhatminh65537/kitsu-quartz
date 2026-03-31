---
title: "02. Singleton & Factory Method"
tags: [design-patterns, gof, creational, singleton, factory-method, lesson-02]
aliases: [Singleton, Factory Method]
created: 2026-03-24
---

> **Prerequisites**: [[01-foundations|01. Foundations — SOLID & OOP nâng cao]]
> **Objectives**:
> - Hiểu Singleton pattern: khi nào cần, cách implement đúng trong Python, và các cạm bẫy
> - Hiểu Factory Method pattern: tách logic khởi tạo khỏi client code
> - Nhận ra sự khác biệt giữa hai pattern: Singleton kiểm soát *số lượng* instance, Factory Method kiểm soát *loại* instance được tạo
> - Áp dụng được cả hai vào bài toán thực tế với Python

---

## Phần 1 — Singleton Pattern

### Vấn đề Singleton giải quyết

Đôi khi một số tài nguyên trong hệ thống chỉ nên tồn tại **đúng một instance** — không hơn, không kém:

- Kết nối database (connection pool dùng chung)
- Hệ thống logging toàn ứng dụng
- Bộ cấu hình (configuration) load từ file
- Cache in-memory chia sẻ giữa các module

Nếu mỗi nơi tự tạo instance mới, ta sẽ có nhiều kết nối DB thừa, nhiều config object không đồng bộ, hoặc nhiều logger không ghi vào cùng một nơi.

> [!definition] Singleton Pattern
> Đảm bảo một class **chỉ có một instance duy nhất** trong suốt vòng đời của chương trình, và cung cấp một **điểm truy cập toàn cục** (global access point) đến instance đó.
>
> **Ý tưởng cốt lõi**: Class tự quản lý instance của chính mình — constructor bị ẩn, client chỉ truy cập qua một method tĩnh.

### Cấu trúc

```text
┌───────────────────────────────────┐
│  Singleton                        │
├───────────────────────────────────┤
│ - _instance: Singleton = None     │
├───────────────────────────────────┤
│ - __init__()                      │
│ + get_instance() → Singleton      │  ← static/class method
│ + some_business_logic()           │
└───────────────────────────────────┘
```

### Implementation trong Python

Python có nhiều cách implement Singleton. Mình sẽ đi từ naive đến production-ready.

**Cách 1 — Dùng class variable (cơ bản):**

```python
class Singleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance


s1 = Singleton()
s2 = Singleton()
print(s1 is s2)  # True — cùng object
print(id(s1) == id(s2))  # True
```

`__new__` được gọi *trước* `__init__` để tạo object. Bằng cách override `__new__`, ta kiểm soát việc tạo instance.

**Cách 2 — Thread-safe Singleton (production):**

Cách 1 không an toàn khi nhiều thread chạy đồng thời — hai thread có thể cùng vượt qua kiểm tra `_instance is None` trước khi một thread kịp gán.

```python
import threading


class ThreadSafeSingleton:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:   # Double-checked locking
                    cls._instance = super().__new__(cls)
        return cls._instance
```

Pattern kiểm tra lần 2 bên trong lock gọi là **double-checked locking** — tránh acquire lock mỗi lần gọi (chỉ lock khi thực sự cần tạo instance).

**Cách 3 — Singleton bằng decorator (Pythonic):**

```python
def singleton(cls):
    instances = {}

    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]

    return get_instance


@singleton
class DatabaseConnection:
    def __init__(self, url: str = "postgresql://localhost/mydb"):
        self.url = url
        print(f"Connecting to {url}...")

    def query(self, sql: str) -> list:
        print(f"Executing: {sql}")
        return []


db1 = DatabaseConnection()
db2 = DatabaseConnection()
print(db1 is db2)  # True
```

### Worked Example — Application Logger

```python
import threading
from datetime import datetime


class AppLogger:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._logs = []
        return cls._instance

    def log(self, level: str, message: str):
        entry = f"[{datetime.now().isoformat()}] {level.upper()}: {message}"
        self._logs.append(entry)
        print(entry)

    def get_logs(self) -> list:
        return list(self._logs)


logger_a = AppLogger()
logger_b = AppLogger()

logger_a.log("info", "Ứng dụng khởi động")
logger_b.log("warning", "Cấu hình chưa đầy đủ")

print(len(logger_a.get_logs()))  # 2 — cùng logs list
print(logger_a is logger_b)      # True
```

### Trade-offs của Singleton

> [!warning] Cạm bẫy khi dùng Singleton
> - **Khó test**: Global state làm test case phụ thuộc lẫn nhau — instance từ test trước "rò rỉ" sang test sau.
> - **Vi phạm SRP**: Singleton vừa quản lý instance, vừa chứa business logic.
> - **Coupling ngầm**: Code ở bất kỳ đâu cũng có thể gọi `Singleton.get_instance()` — dependency không hiển thị trong constructor.
> - **Khó mở rộng**: Nếu sau này cần 2 instance (ví dụ 2 database), refactor sẽ rất đau.

**Khi nào nên dùng**: Logger, connection pool, config object, cache — những thứ thực sự cần shared state toàn cục.

**Thay thế tốt hơn trong Python**: Dùng module-level variable — module Python tự nhiên là singleton vì chỉ import một lần.

```python
_config = None

def get_config():
    global _config
    if _config is None:
        _config = load_config_from_file()
    return _config
```

---

## Phần 2 — Factory Method Pattern

### Vấn đề Factory Method giải quyết

Xét tình huống: bạn đang xây dựng hệ thống logistics, ban đầu chỉ cần vận chuyển bằng xe tải (`Truck`). Sau đó client yêu cầu thêm vận chuyển bằng tàu thủy (`Ship`). Code hiện tại tràn ngập `Truck()` khắp nơi — thay đổi rất khó khăn.

Vấn đề gốc: **client code bị gắn chặt vào tên class cụ thể** khi tạo object.

> [!definition] Factory Method Pattern
> Định nghĩa một **interface để tạo object**, nhưng để **subclass quyết định** class nào sẽ được khởi tạo.
>
> Factory Method cho phép class *hoãn* (defer) việc tạo instance cho subclass.
>
> **Ý tưởng cốt lõi**: Thay vì gọi `Product()` trực tiếp, client gọi một method `create_product()` — method này có thể được override để trả về bất kỳ loại product nào.

### Cấu trúc

```text
┌───────────────────────────┐          ┌──────────────┐
│  Creator (abstract)       │          │  Product     │
├───────────────────────────┤          │  (interface) │
│ + factory_method()        │◀─ ─ ─ ─ ─│              │
│   → Product (abstract)    │  creates └──────┬───────┘
│ + some_operation()        │                 │
└────────────┬──────────────┘          ┌──────┴───────┐      ┌──────────────┐
             │                         │ConcreteProductA│    │ConcreteProductB│
    ┌────────┴────────┐                └──────────────┘      └──────────────┘
    │                 │
┌───┴──────┐  ┌───────┴──────┐
│ConcreteA │  │ ConcreteB    │
│Creator   │  │ Creator      │
├──────────┤  ├──────────────┤
│factory_  │  │ factory_     │
│method()  │  │ method()     │
│→ ProductA│  │ → ProductB   │
└──────────┘  └──────────────┘
```

Có 4 thành phần chính:
- **Product** — interface chung cho tất cả object được factory tạo ra
- **ConcreteProduct** — implementation cụ thể của Product
- **Creator** — class abstract chứa `factory_method()` và business logic dùng Product
- **ConcreteCreator** — override `factory_method()` để trả về ConcreteProduct tương ứng

### Implementation — Hệ thống Logistics

```python
from abc import ABC, abstractmethod


class Transport(ABC):
    @abstractmethod
    def deliver(self, cargo: str, destination: str) -> str: ...

    @abstractmethod
    def get_capacity(self) -> float: ...


class Truck(Transport):
    def deliver(self, cargo: str, destination: str) -> str:
        return f"Truck: Vận chuyển '{cargo}' đến {destination} bằng đường bộ"

    def get_capacity(self) -> float:
        return 20.0


class Ship(Transport):
    def deliver(self, cargo: str, destination: str) -> str:
        return f"Ship: Vận chuyển '{cargo}' đến {destination} bằng đường biển"

    def get_capacity(self) -> float:
        return 500.0


class Logistics(ABC):
    def plan_delivery(self, cargo: str, destination: str) -> str:
        transport = self.create_transport()
        if len(cargo) > transport.get_capacity():
            return f"Hàng quá nặng cho {type(transport).__name__}"
        return transport.deliver(cargo, destination)

    @abstractmethod
    def create_transport(self) -> Transport: ...


class RoadLogistics(Logistics):
    def create_transport(self) -> Transport:
        return Truck()


class SeaLogistics(Logistics):
    def create_transport(self) -> Transport:
        return Ship()


road = RoadLogistics()
print(road.plan_delivery("Điện thoại", "Hà Nội"))

sea = SeaLogistics()
print(sea.plan_delivery("Ô tô", "Singapore"))
```

`plan_delivery()` không biết và không quan tâm đến loại Transport cụ thể — nó chỉ gọi `create_transport()`. Khi thêm `AirLogistics`, ta chỉ thêm class mới, không sửa `Logistics`.

### Worked Example — Notification System

Bài toán thực tế: hệ thống cần gửi thông báo qua nhiều kênh (Email, SMS, Push notification). Mỗi môi trường (development, production) dùng kênh khác nhau.

```python
from abc import ABC, abstractmethod


class Notification(ABC):
    @abstractmethod
    def send(self, recipient: str, message: str) -> bool: ...


class EmailNotification(Notification):
    def __init__(self, smtp_host: str):
        self.smtp_host = smtp_host

    def send(self, recipient: str, message: str) -> bool:
        print(f"[Email via {self.smtp_host}] To: {recipient} | {message}")
        return True


class SMSNotification(Notification):
    def __init__(self, api_key: str):
        self.api_key = api_key

    def send(self, recipient: str, message: str) -> bool:
        print(f"[SMS] To: {recipient} | {message}")
        return True


class MockNotification(Notification):
    def __init__(self):
        self.sent: list[tuple] = []

    def send(self, recipient: str, message: str) -> bool:
        self.sent.append((recipient, message))
        print(f"[Mock] Captured: {recipient} | {message}")
        return True


class NotificationService(ABC):
    def notify_user(self, user_id: str, event: str):
        notifier = self.create_notifier()
        message = f"Sự kiện: {event}"
        success = notifier.send(user_id, message)
        if not success:
            print(f"Gửi thông báo thất bại cho user {user_id}")

    @abstractmethod
    def create_notifier(self) -> Notification: ...


class ProductionEmailService(NotificationService):
    def create_notifier(self) -> Notification:
        return EmailNotification(smtp_host="smtp.gmail.com")


class ProductionSMSService(NotificationService):
    def create_notifier(self) -> Notification:
        return SMSNotification(api_key="prod-key-xyz")


class DevelopmentService(NotificationService):
    def create_notifier(self) -> Notification:
        return MockNotification()


def main(env: str = "dev"):
    services: dict[str, NotificationService] = {
        "prod_email": ProductionEmailService(),
        "prod_sms": ProductionSMSService(),
        "dev": DevelopmentService(),
    }
    service = services.get(env, services["dev"])
    service.notify_user("user_42", "Đơn hàng #1234 đã được xử lý")


main("prod_email")
main("dev")
```

Môi trường dev dùng `MockNotification` — không gửi thật, nhưng code `notify_user()` không thay đổi gì.

### Trade-offs của Factory Method

**Ưu điểm:**
- Tách biệt code tạo object khỏi code sử dụng — giảm coupling
- Dễ mở rộng: thêm loại product mới chỉ cần thêm ConcreteCreator
- Dễ test: inject MockCreator trong test environment

**Nhược điểm:**
- Code nhiều hơn: mỗi loại product cần một ConcreteCreator riêng
- Có thể over-engineer nếu chỉ có một loại product và không thay đổi

> [!note] Factory Method vs Simple Factory
> **Simple Factory** (không phải GoF pattern) là một static method tạo object dựa trên điều kiện `if/else`. Đơn giản hơn nhưng vi phạm OCP — mỗi lần thêm loại product phải sửa method.
>
> **Factory Method** là pattern thực sự: dùng inheritance/polymorphism, tuân theo OCP.

---

## So sánh Singleton và Factory Method

| Tiêu chí | Singleton | Factory Method |
|----------|-----------|----------------|
| Mục đích | Kiểm soát **số lượng** instance | Kiểm soát **loại** instance được tạo |
| Cơ chế | `__new__` hoặc class variable | Override method trong subclass |
| Khi dùng | Logger, config, connection pool | Tạo object có thể thay thế nhau |
| Nhược điểm chính | Global state, khó test | Nhiều class, có thể over-engineer |

---

## Summary / Key Takeaways

- **Singleton** đảm bảo một class chỉ có một instance; dùng `__new__` và lock để implement thread-safe trong Python.
- Singleton gây ra global state — cân nhắc kỹ, và ưu tiên dùng module-level variable thay thế khi có thể.
- **Factory Method** tách logic tạo object ra khỏi code sử dụng bằng cách để subclass quyết định class nào được tạo.
- Cả hai pattern đều implement nguyên lý từ Lesson 01: Singleton dùng OCP (behavior đóng với modification), Factory Method dùng DIP (Creator phụ thuộc abstraction `Product`, không phụ thuộc `ConcreteProduct`).

---

## References

- Gamma et al. — *Design Patterns*, Ch. 3: Creational Patterns (Singleton tr.127, Factory Method tr.107)
- Refactoring.Guru — Singleton: https://refactoring.guru/design-patterns/singleton/python/example
- Refactoring.Guru — Factory Method: https://refactoring.guru/design-patterns/factory-method/python/example
- Python `threading.Lock` — https://docs.python.org/3/library/threading.html#lock-objects
