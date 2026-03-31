---
title: "15. Pattern Combinations & Real-world Architecture"
tags: [design-patterns, gof, combinations, architecture, lesson-15]
aliases: [Pattern Combinations, Real-world Architecture]
created: 2026-03-24
---

> **Prerequisites**: [[02-singleton-factory-method|02]] — [[14-interpreter|14]] (toàn bộ khóa học)
> **Objectives**:
> - Thấy cách các pattern kết hợp với nhau trong hệ thống thực tế — không dùng đơn lẻ
> - Xây dựng một mini e-commerce system kết hợp 8+ pattern
> - Nhận ra pattern trong Python standard library và các framework phổ biến
> - Hiểu nguyên tắc chọn pattern: giải quyết vấn đề thực sự, không over-engineer

---

## Pattern không tồn tại đơn lẻ

Trong thực tế, một hệ thống thường dùng nhiều pattern phối hợp. Ví dụ Django framework một mình đã chứa: Template Method (class-based views), Observer (signals), Strategy (authentication backends), Facade (ORM queryset), Decorator (`@login_required`), Iterator (queryset lazy evaluation), Factory (form fields), Singleton (settings module).

Lesson này xây dựng một mini e-commerce backend để thấy các pattern "sống cùng nhau" tự nhiên như thế nào.

---

## Case Study — Mini E-Commerce System

Hệ thống cần:
- Catalog sản phẩm với search
- Giỏ hàng với nhiều loại discount
- Checkout với nhiều payment gateway
- Notification đa kênh khi đơn hàng thay đổi
- Audit log toàn bộ hành động

### Bản đồ pattern

| Component | Pattern(s) | Lý do |
|-----------|-----------|-------|
| `ProductRepository` | Singleton | Shared in-memory store |
| `ProductFactory` | Factory Method | Tạo product từ dict/JSON |
| `Cart` | Composite | Item + Bundle cùng interface |
| Discount rules | Strategy | Swap thuật toán tính giá |
| `OrderFacade` | Facade | Ẩn phức tạp checkout |
| Payment | Abstract Factory | Family: gateway + validator |
| `Order` lifecycle | State | Pending→Confirmed→Shipped |
| Notifications | Observer | Broadcast khi order thay đổi |
| Audit log | Proxy (Logging) | Wrap repository |
| History/undo | Command + Memento | Cart actions |

### Implementation

```python
from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any
from collections import defaultdict
import threading
import uuid
```

**1. Domain Models**

```python
@dataclass
class Product:
    id: str
    name: str
    price: float
    category: str
    stock: int = 0

    def __repr__(self) -> str:
        return f"Product({self.name}, ${self.price:.2f})"
```

**2. Singleton Repository**

```python
class ProductRepository:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._products: dict[str, Product] = {}
        return cls._instance

    def add(self, product: Product) -> None:
        self._products[product.id] = product

    def find_by_id(self, pid: str) -> Product | None:
        return self._products.get(pid)

    def search(self, query: str) -> list[Product]:
        q = query.lower()
        return [p for p in self._products.values()
                if q in p.name.lower() or q in p.category.lower()]
```

**3. Composite Cart**

```python
class CartItem(ABC):
    @abstractmethod
    def total_price(self) -> float: ...

    @abstractmethod
    def item_count(self) -> int: ...

    @abstractmethod
    def description(self) -> str: ...


@dataclass
class SingleItem(CartItem):
    product: Product
    quantity: int

    def total_price(self) -> float:
        return self.product.price * self.quantity

    def item_count(self) -> int:
        return self.quantity

    def description(self) -> str:
        return f"{self.product.name} x{self.quantity} = ${self.total_price():.2f}"


class Bundle(CartItem):
    def __init__(self, name: str, discount_pct: float = 0):
        self.name = name
        self._items: list[CartItem] = []
        self._discount = discount_pct

    def add(self, item: CartItem) -> None:
        self._items.append(item)

    def total_price(self) -> float:
        subtotal = sum(i.total_price() for i in self._items)
        return subtotal * (1 - self._discount / 100)

    def item_count(self) -> int:
        return sum(i.item_count() for i in self._items)

    def description(self) -> str:
        lines = [f"Bundle '{self.name}' (-{self._discount}%):"]
        lines += [f"  {i.description()}" for i in self._items]
        lines.append(f"  Bundle total: ${self.total_price():.2f}")
        return "\n".join(lines)
```

**4. Strategy: Discount**

```python
class DiscountStrategy(ABC):
    @abstractmethod
    def apply(self, subtotal: float, cart_items: list[CartItem]) -> float: ...

    @property
    @abstractmethod
    def name(self) -> str: ...


class NoDiscount(DiscountStrategy):
    def apply(self, subtotal: float, cart_items: list[CartItem]) -> float:
        return subtotal

    @property
    def name(self) -> str: return "No Discount"


class PercentageDiscount(DiscountStrategy):
    def __init__(self, pct: float):
        self._pct = pct

    def apply(self, subtotal: float, cart_items: list[CartItem]) -> float:
        return subtotal * (1 - self._pct / 100)

    @property
    def name(self) -> str: return f"{self._pct}% off"


class ThresholdDiscount(DiscountStrategy):
    def __init__(self, threshold: float, pct: float):
        self._threshold = threshold
        self._pct = pct

    def apply(self, subtotal: float, cart_items: list[CartItem]) -> float:
        if subtotal >= self._threshold:
            return subtotal * (1 - self._pct / 100)
        return subtotal

    @property
    def name(self) -> str:
        return f"{self._pct}% off orders over ${self._threshold:.0f}"
```

**5. Observer: Event System**

```python
class EventBus:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._listeners: dict[str, list] = defaultdict(list)
        return cls._instance

    def subscribe(self, event: str, handler) -> None:
        self._listeners[event].append(handler)

    def publish(self, event: str, data: Any = None) -> None:
        for handler in self._listeners.get(event, []):
            handler(event, data)


def email_handler(event: str, data: Any) -> None:
    print(f"[Email] Event '{event}': notifying {data.get('user', 'customer')}")


def sms_handler(event: str, data: Any) -> None:
    print(f"[SMS] Event '{event}': short notification sent")


def audit_handler(event: str, data: Any) -> None:
    print(f"[Audit] {event}: {data}")
```

**6. State: Order**

```python
class OrderStatus:
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


@dataclass
class Order:
    id: str
    user_id: str
    items: list[CartItem]
    total: float
    status: str = OrderStatus.PENDING
    payment_txn: str = ""

    def transition(self, new_status: str) -> None:
        valid = {
            OrderStatus.PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
            OrderStatus.CONFIRMED: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
            OrderStatus.SHIPPED: [OrderStatus.DELIVERED],
        }
        allowed = valid.get(self.status, [])
        if new_status not in allowed:
            raise ValueError(f"Cannot go from {self.status} → {new_status}")
        self.status = new_status
        EventBus().publish(f"order.{new_status}", {
            "order_id": self.id,
            "user": self.user_id,
            "total": self.total,
        })
```

**7. Abstract Factory: Payment**

```python
class PaymentGateway(ABC):
    @abstractmethod
    def charge(self, amount: float, user_id: str) -> str | None: ...


class PaymentValidator(ABC):
    @abstractmethod
    def validate(self, amount: float) -> tuple[bool, str]: ...


class StripeGateway(PaymentGateway):
    def charge(self, amount: float, user_id: str) -> str | None:
        print(f"[Stripe] Charging ${amount:.2f} for {user_id}")
        return f"stripe_{uuid.uuid4().hex[:8]}"


class StripeValidator(PaymentValidator):
    def validate(self, amount: float) -> tuple[bool, str]:
        return (True, "OK") if amount > 0 else (False, "Amount must be positive")


class PaymentFactory(ABC):
    @abstractmethod
    def create_gateway(self) -> PaymentGateway: ...

    @abstractmethod
    def create_validator(self) -> PaymentValidator: ...


class StripeFactory(PaymentFactory):
    def create_gateway(self) -> PaymentGateway:
        return StripeGateway()

    def create_validator(self) -> PaymentValidator:
        return StripeValidator()
```

**8. Facade: Checkout**

```python
class Cart:
    def __init__(self, discount: DiscountStrategy = None):
        self._items: list[CartItem] = []
        self._discount = discount or NoDiscount()

    def add(self, item: CartItem) -> None:
        self._items.append(item)

    @property
    def subtotal(self) -> float:
        return sum(i.total_price() for i in self._items)

    @property
    def total(self) -> float:
        return self._discount.apply(self.subtotal, self._items)

    def display(self) -> None:
        for item in self._items:
            print(f"  {item.description()}")
        if self.subtotal != self.total:
            print(f"  Subtotal: ${self.subtotal:.2f}")
            print(f"  Discount ({self._discount.name}): -${self.subtotal - self.total:.2f}")
        print(f"  Total: ${self.total:.2f}")


class CheckoutFacade:
    def __init__(self, payment_factory: PaymentFactory):
        self._repo = ProductRepository()
        self._bus = EventBus()
        self._payment_factory = payment_factory

    def checkout(self, user_id: str, cart: Cart) -> Order | None:
        if not cart._items:
            print("Cart is empty.")
            return None

        validator = self._payment_factory.create_validator()
        ok, msg = validator.validate(cart.total)
        if not ok:
            print(f"Validation failed: {msg}")
            return None

        gateway = self._payment_factory.create_gateway()
        txn_id = gateway.charge(cart.total, user_id)
        if not txn_id:
            print("Payment failed.")
            return None

        order = Order(
            id=f"ORD-{uuid.uuid4().hex[:6].upper()}",
            user_id=user_id,
            items=list(cart._items),
            total=cart.total,
            payment_txn=txn_id,
        )
        order.transition(OrderStatus.CONFIRMED)
        print(f"\nOrder {order.id} created. Total: ${order.total:.2f}")
        return order
```

**9. Wire everything together**

```python
bus = EventBus()
bus.subscribe("order.confirmed", email_handler)
bus.subscribe("order.confirmed", sms_handler)
bus.subscribe("order.shipped", email_handler)
bus.subscribe("order.confirmed", audit_handler)

repo = ProductRepository()
repo.add(Product("P001", "MacBook Pro 14", 1999.00, "laptop", 5))
repo.add(Product("P002", "Magic Mouse", 79.00, "accessory", 20))
repo.add(Product("P003", "USB-C Hub", 49.00, "accessory", 15))

print("=== Search ===")
for p in repo.search("accessory"):
    print(f"  {p}")

cart = Cart(discount=ThresholdDiscount(threshold=100, pct=10))
cart.add(SingleItem(repo.find_by_id("P001"), 1))

bundle = Bundle("Desk Setup", discount_pct=5)
bundle.add(SingleItem(repo.find_by_id("P002"), 1))
bundle.add(SingleItem(repo.find_by_id("P003"), 2))
cart.add(bundle)

print("\n=== Cart ===")
cart.display()

checkout = CheckoutFacade(StripeFactory())
order = checkout.checkout("user_alice", cart)

if order:
    print("\n=== Order Lifecycle ===")
    order.transition(OrderStatus.SHIPPED)
    order.transition(OrderStatus.DELIVERED)
    print(f"Final status: {order.status}")
```

---

## Pattern trong Python Standard Library

| Pattern | Xuất hiện ở đâu |
|---------|----------------|
| Iterator | `__iter__`, `__next__`, `for` loop, `itertools` |
| Observer | `logging` handlers, `asyncio` event loop |
| Decorator | `@functools.wraps`, `@property`, `@classmethod` |
| Proxy | `unittest.mock.MagicMock` |
| Facade | `pathlib.Path`, `urllib.request` |
| Factory Method | `logging.getLogger()`, `datetime.fromisoformat()` |
| Singleton | Module-level variables, `None`, `True`, `False` |
| Strategy | `sorted(key=...)`, `max(key=...)` |
| Template Method | `unittest.TestCase` (`setUp`, `tearDown`) |
| Flyweight | `str` interning, `sys.intern()`, small int cache |
| Composite | `pathlib.Path` (directory tree), `xml.etree` |

---

## Nguyên tắc chọn Pattern

> [!warning] Tránh over-engineering
> Pattern là công cụ, không phải mục tiêu. Áp dụng pattern vì nó giải quyết vấn đề thực tế, không phải để code "trông có vẻ pattern".

**Câu hỏi kiểm tra trước khi áp dụng:**

1. **Vấn đề gì đang được giải quyết?** — Nếu không có vấn đề cụ thể, không cần pattern.
2. **Code hiện tại có đủ đơn giản không?** — 50 dòng clear hơn 150 dòng "có architecture".
3. **Có khả năng thay đổi thực sự không?** — YAGNI (You Aren't Gonna Need It).
4. **Team có quen với pattern này không?** — Pattern lạ tăng cognitive load.

**Dấu hiệu cần pattern:**

- If/elif theo type hoặc state tràn lan → **State** hoặc **Strategy**
- Constructor với 7+ tham số → **Builder**
- Copy-paste logic với một vài dòng khác → **Template Method**
- Gọi 5+ subsystem để làm một việc đơn giản → **Facade**
- Thêm tính năng phải sửa nhiều class → **Observer**, **Strategy**, hoặc **Decorator**
- Object tạo ra tốn kém nhưng gần giống nhau → **Prototype** hoặc **Flyweight**

---

## Summary / Key Takeaways

- Pattern kết hợp tự nhiên: Composite + Visitor, Command + Memento, Observer + Mediator, Abstract Factory + Singleton.
- Không có hệ thống thực tế nào chỉ dùng một pattern — nhận ra chúng trong code là kỹ năng quan trọng hơn thuộc lòng định nghĩa.
- Python standard library và frameworks đã implement sẵn nhiều pattern — học cách nhận ra thay vì tự implement lại.
- Nguyên tắc cuối: **code dễ đọc và dễ thay đổi quan trọng hơn code "đúng pattern"**.

---

## References

- Gamma et al. — *Design Patterns: Elements of Reusable Object-Oriented Software* (1994) — toàn bộ cuốn sách
- Martin Fowler — *Patterns of Enterprise Application Architecture* (2002)
- Robert C. Martin — *Clean Architecture* (2017)
- Refactoring.Guru — https://refactoring.guru/design-patterns
- Python Design Patterns — https://python-patterns.guide
