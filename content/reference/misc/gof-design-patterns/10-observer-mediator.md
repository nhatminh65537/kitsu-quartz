---
title: "10. Observer & Mediator"
tags: [design-patterns, gof, behavioral, observer, mediator, lesson-10]
aliases: [Observer Pattern, Mediator Pattern]
created: 2026-03-24
---

> **Prerequisites**: [[01-foundations|01. Foundations]], [[09-strategy-template-method|09. Strategy & Template Method]]
> **Objectives**:
> - Hiểu Observer: thiết lập quan hệ one-to-many để object tự động nhận thông báo khi state thay đổi
> - Hiểu Mediator: tập trung logic giao tiếp vào một object trung gian, loại bỏ phụ thuộc chằng chịt
> - Phân biệt hai pattern: Observer là broadcast từ một subject đến nhiều observer; Mediator là hub điều phối nhiều thành phần ngang hàng
> - Nhận ra sự xuất hiện của cả hai pattern trong Python ecosystem (event system, asyncio, GUI)

---

## Phần 1 — Observer Pattern

### Vấn đề Observer giải quyết

Khi một object thay đổi trạng thái, nhiều object khác cần phản ứng tương ứng — nhưng bạn không muốn object gốc phải biết cụ thể ai cần được thông báo. Nếu để object gốc gọi trực tiếp từng đối tượng phụ thuộc, coupling trở nên chặt và không mở rộng được.

> [!definition] Observer Pattern
> Định nghĩa quan hệ **one-to-many** giữa các object: khi một object (Subject) thay đổi trạng thái, tất cả object phụ thuộc (Observers) được **tự động thông báo và cập nhật**.
>
> **Ý tưởng cốt lõi**: Subject duy trì danh sách observer, broadcast event khi cần — không biết gì về implementation cụ thể của observer. Observer đăng ký/hủy đăng ký động lúc runtime.

### Cấu trúc

```text
Subject (interface)                  Observer (interface)
+ attach(o: Observer)                + update(event, data)
+ detach(o: Observer)                        ▲
+ notify()                           ┌───────┴───────┐
      ▲                          ConcreteA       ConcreteB
ConcreteSubject
- _state
- _observers: list[Observer]
+ get_state() / set_state()
```

### Implementation — Event System

```python
from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Any
from dataclasses import dataclass, field
from collections import defaultdict


class Observer(ABC):
    @abstractmethod
    def update(self, event: str, data: Any) -> None: ...


class Subject(ABC):
    @abstractmethod
    def attach(self, event: str, observer: Observer) -> None: ...

    @abstractmethod
    def detach(self, event: str, observer: Observer) -> None: ...

    @abstractmethod
    def notify(self, event: str, data: Any = None) -> None: ...


class EventEmitter(Subject):
    def __init__(self):
        self._listeners: dict[str, list[Observer]] = defaultdict(list)

    def attach(self, event: str, observer: Observer) -> None:
        if observer not in self._listeners[event]:
            self._listeners[event].append(observer)

    def detach(self, event: str, observer: Observer) -> None:
        self._listeners[event].discard(observer) if hasattr(
            self._listeners[event], 'discard'
        ) else None
        if observer in self._listeners[event]:
            self._listeners[event].remove(observer)

    def notify(self, event: str, data: Any = None) -> None:
        for observer in list(self._listeners.get(event, [])):
            observer.update(event, data)
```

Bây giờ ta xây dựng domain cụ thể lên trên `EventEmitter`:

```python
@dataclass
class StockData:
    symbol: str
    price: float
    change_pct: float


class StockMarket(EventEmitter):
    def __init__(self):
        super().__init__()
        self._prices: dict[str, float] = {}

    def update_price(self, symbol: str, new_price: float) -> None:
        old_price = self._prices.get(symbol, new_price)
        change_pct = ((new_price - old_price) / old_price * 100) if old_price else 0.0
        self._prices[symbol] = new_price
        self.notify("price_changed", StockData(symbol, new_price, change_pct))
        if abs(change_pct) >= 5.0:
            self.notify("price_alert", StockData(symbol, new_price, change_pct))


class PriceDisplay(Observer):
    def __init__(self, name: str):
        self.name = name

    def update(self, event: str, data: StockData) -> None:
        sign = "▲" if data.change_pct >= 0 else "▼"
        print(f"[{self.name}] {data.symbol}: ${data.price:.2f} {sign}{abs(data.change_pct):.2f}%")


class AlertSystem(Observer):
    def update(self, event: str, data: StockData) -> None:
        direction = "surged" if data.change_pct > 0 else "dropped"
        print(f"🚨 ALERT: {data.symbol} {direction} {abs(data.change_pct):.1f}%!")


class TradingBot(Observer):
    def __init__(self, symbol: str, threshold: float):
        self._symbol = symbol
        self._threshold = threshold

    def update(self, event: str, data: StockData) -> None:
        if data.symbol != self._symbol:
            return
        if data.change_pct <= -self._threshold:
            print(f"[Bot] BUY signal: {data.symbol} dropped {abs(data.change_pct):.1f}%")
        elif data.change_pct >= self._threshold:
            print(f"[Bot] SELL signal: {data.symbol} surged {data.change_pct:.1f}%")


market = StockMarket()

display_a = PriceDisplay("Terminal A")
display_b = PriceDisplay("Terminal B")
alert = AlertSystem()
bot = TradingBot("AAPL", threshold=3.0)

market.attach("price_changed", display_a)
market.attach("price_changed", display_b)
market.attach("price_alert", alert)
market.attach("price_changed", bot)

print("=== Market updates ===")
market.update_price("AAPL", 175.00)
market.update_price("AAPL", 182.00)
market.update_price("GOOGL", 140.50)
market.update_price("AAPL", 170.00)

print("\n=== Terminal B unsubscribes ===")
market.detach("price_changed", display_b)
market.update_price("AAPL", 165.00)
```

### Worked Example — Django-style Signal System

Implement một signal system đơn giản tương tự Django signals — cho phép đăng ký handler bằng decorator:

```python
from __future__ import annotations
from typing import Callable, Any
from dataclasses import dataclass, field
from collections import defaultdict
import weakref


class Signal:
    def __init__(self, name: str):
        self.name = name
        self._receivers: list[Callable] = []

    def connect(self, receiver: Callable) -> Callable:
        if receiver not in self._receivers:
            self._receivers.append(receiver)
        return receiver

    def disconnect(self, receiver: Callable) -> None:
        if receiver in self._receivers:
            self._receivers.remove(receiver)

    def send(self, sender: Any, **kwargs) -> list[tuple[Callable, Any]]:
        results = []
        for receiver in list(self._receivers):
            result = receiver(sender=sender, **kwargs)
            results.append((receiver, result))
        return results

    def __call__(self, func: Callable) -> Callable:
        self.connect(func)
        return func


user_created = Signal("user_created")
user_deleted = Signal("user_deleted")
order_placed = Signal("order_placed")


@user_created.connect
def send_welcome_email(sender, user, **kwargs):
    print(f"[Email] Welcome email sent to {user['email']}")


@user_created.connect
def create_default_preferences(sender, user, **kwargs):
    print(f"[Prefs] Default preferences created for user {user['id']}")


@order_placed.connect
def update_inventory(sender, order, **kwargs):
    print(f"[Inventory] Reserving items for order {order['id']}")


@order_placed.connect
def send_order_confirmation(sender, order, **kwargs):
    print(f"[Email] Order confirmation sent for #{order['id']}")


def create_user(name: str, email: str) -> dict:
    user = {"id": 42, "name": name, "email": email}
    print(f"User '{name}' created")
    user_created.send(sender="UserService", user=user)
    return user


def place_order(user_id: int, items: list) -> dict:
    order = {"id": 1001, "user_id": user_id, "items": items}
    print(f"\nOrder #{order['id']} placed")
    order_placed.send(sender="OrderService", order=order)
    return order


create_user("Alice", "alice@example.com")
place_order(42, ["laptop", "mouse"])
```

### Trade-offs của Observer

**Ưu điểm:** Loose coupling — Subject không biết gì về Observer. Dễ thêm/xóa observer lúc runtime. Nền tảng của event-driven architecture.

**Nhược điểm:** Observer nhận thông báo theo thứ tự không đảm bảo. Memory leak nếu không `detach` khi observer bị destroy. Chuỗi update dài có thể khó debug.

---

## Phần 2 — Mediator Pattern

### Vấn đề Mediator giải quyết

Trong một hệ thống chat: mỗi User cần giao tiếp với nhiều User khác. Nếu mỗi User giữ reference đến tất cả User khác, ta có mạng lưới phụ thuộc O(n²). Thêm một User mới phải cập nhật tất cả User hiện có.

Mediator giải quyết bằng cách đưa toàn bộ logic giao tiếp vào một hub trung tâm.

> [!definition] Mediator Pattern
> Định nghĩa một object **trung gian** (mediator) để đóng gói cách thức giao tiếp giữa một tập hợp object. Mediator thúc đẩy loose coupling bằng cách ngăn các object tham chiếu lẫn nhau trực tiếp.
>
> **Ý tưởng cốt lõi**: Thay vì nhiều kết nối point-to-point (O(n²)), mọi component chỉ biết đến Mediator (O(n)). Mediator nắm toàn bộ logic điều phối.

### Cấu trúc

```text
Mediator (interface)                Component (interface)
+ notify(sender, event, data)       - _mediator: Mediator
      ▲                             + set_mediator(m)
ConcreteMediator                          ▲
- components: list[Component]    ┌────────┴────────┐
+ notify(...)   ← orchestrates  CompA           CompB
```

### Implementation — Chat Room

```python
from __future__ import annotations
from abc import ABC, abstractmethod
from datetime import datetime


class ChatMediator(ABC):
    @abstractmethod
    def send_message(self, sender: "ChatUser", content: str) -> None: ...

    @abstractmethod
    def add_user(self, user: "ChatUser") -> None: ...

    @abstractmethod
    def remove_user(self, user: "ChatUser") -> None: ...


class ChatUser:
    def __init__(self, name: str):
        self.name = name
        self._mediator: ChatMediator | None = None
        self._messages: list[str] = []

    def set_mediator(self, mediator: ChatMediator) -> None:
        self._mediator = mediator

    def send(self, content: str) -> None:
        if self._mediator is None:
            raise RuntimeError("User not joined any room")
        print(f"[{self.name}] → {content}")
        self._mediator.send_message(self, content)

    def receive(self, sender_name: str, content: str) -> None:
        msg = f"[{datetime.now().strftime('%H:%M')}] {sender_name}: {content}"
        self._messages.append(msg)
        print(f"  [{self.name} received] {msg}")

    def get_history(self) -> list[str]:
        return list(self._messages)


class ChatRoom(ChatMediator):
    def __init__(self, room_name: str):
        self.room_name = room_name
        self._users: list[ChatUser] = []
        self._history: list[str] = []

    def add_user(self, user: ChatUser) -> None:
        self._users.append(user)
        user.set_mediator(self)
        self.send_message(None, f"{user.name} joined the room")

    def remove_user(self, user: ChatUser) -> None:
        if user in self._users:
            self._users.remove(user)
            user.set_mediator(None)
            self.send_message(None, f"{user.name} left the room")

    def send_message(self, sender: ChatUser | None, content: str) -> None:
        sender_name = sender.name if sender else "System"
        entry = f"{sender_name}: {content}"
        self._history.append(entry)
        for user in self._users:
            if user is not sender:
                user.receive(sender_name, content)


room = ChatRoom("dev-team")

alice = ChatUser("Alice")
bob = ChatUser("Bob")
carol = ChatUser("Carol")

room.add_user(alice)
room.add_user(bob)
room.add_user(carol)

print()
alice.send("Hey everyone, PR #42 is ready for review")
bob.send("On it! Give me 10 minutes")
carol.send("I'll take a look too")

print()
room.remove_user(bob)
alice.send("Bob left, anyone else can review?")
```

### Worked Example — Air Traffic Control

Bài toán kinh điển từ GoF: máy bay không giao tiếp trực tiếp với nhau — tất cả thông qua đài kiểm soát không lưu (ATC).

```python
from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum


class RunwayStatus(Enum):
    CLEAR = "clear"
    OCCUPIED = "occupied"


@dataclass
class Runway:
    name: str
    status: RunwayStatus = RunwayStatus.CLEAR

    def is_available(self) -> bool:
        return self.status == RunwayStatus.CLEAR


class ATCMediator(ABC):
    @abstractmethod
    def request_landing(self, aircraft: "Aircraft") -> bool: ...

    @abstractmethod
    def request_takeoff(self, aircraft: "Aircraft") -> bool: ...

    @abstractmethod
    def notify_emergency(self, aircraft: "Aircraft", reason: str) -> None: ...


class AirTrafficControl(ATCMediator):
    def __init__(self):
        self._runways: list[Runway] = [
            Runway("Runway 01L"),
            Runway("Runway 01R"),
        ]
        self._aircraft_registry: dict[str, "Aircraft"] = {}

    def register(self, aircraft: "Aircraft") -> None:
        self._aircraft_registry[aircraft.callsign] = aircraft
        aircraft.set_mediator(self)
        print(f"[ATC] {aircraft.callsign} registered")

    def _get_available_runway(self) -> Runway | None:
        return next((r for r in self._runways if r.is_available()), None)

    def request_landing(self, aircraft: "Aircraft") -> bool:
        runway = self._get_available_runway()
        if runway is None:
            print(f"[ATC → {aircraft.callsign}] No runway available. Enter holding pattern.")
            return False
        runway.status = RunwayStatus.OCCUPIED
        print(f"[ATC → {aircraft.callsign}] Cleared to land on {runway.name}")
        aircraft._assigned_runway = runway
        return True

    def request_takeoff(self, aircraft: "Aircraft") -> bool:
        runway = self._get_available_runway()
        if runway is None:
            print(f"[ATC → {aircraft.callsign}] Hold position. Runway not clear.")
            return False
        runway.status = RunwayStatus.OCCUPIED
        print(f"[ATC → {aircraft.callsign}] Cleared for takeoff on {runway.name}")
        aircraft._assigned_runway = runway
        return True

    def notify_emergency(self, aircraft: "Aircraft", reason: str) -> None:
        print(f"[ATC] ⚠️  EMERGENCY from {aircraft.callsign}: {reason}")
        for runway in self._runways:
            runway.status = RunwayStatus.CLEAR
        print(f"[ATC] All runways cleared for emergency landing of {aircraft.callsign}")
        for callsign, other in self._aircraft_registry.items():
            if other is not aircraft:
                other.receive_atc_message(f"Emergency in progress. Hold position.")

    def runway_vacated(self, runway: Runway) -> None:
        runway.status = RunwayStatus.CLEAR
        print(f"[ATC] {runway.name} is now clear")


class Aircraft:
    def __init__(self, callsign: str, aircraft_type: str):
        self.callsign = callsign
        self.aircraft_type = aircraft_type
        self._mediator: ATCMediator | None = None
        self._assigned_runway: Runway | None = None

    def set_mediator(self, mediator: ATCMediator) -> None:
        self._mediator = mediator

    def request_landing(self) -> None:
        print(f"[{self.callsign}] Requesting landing clearance")
        granted = self._mediator.request_landing(self)
        if granted:
            print(f"[{self.callsign}] Beginning approach")
            if self._assigned_runway:
                self._mediator.runway_vacated(self._assigned_runway)
                self._assigned_runway = None

    def request_takeoff(self) -> None:
        print(f"[{self.callsign}] Requesting takeoff clearance")
        granted = self._mediator.request_takeoff(self)
        if granted:
            print(f"[{self.callsign}] Rolling for takeoff")
            if self._assigned_runway:
                self._mediator.runway_vacated(self._assigned_runway)
                self._assigned_runway = None

    def declare_emergency(self, reason: str) -> None:
        print(f"[{self.callsign}] MAYDAY MAYDAY: {reason}")
        self._mediator.notify_emergency(self, reason)

    def receive_atc_message(self, message: str) -> None:
        print(f"  [{self.callsign} received] ATC: {message}")


atc = AirTrafficControl()

vn101 = Aircraft("VN101", "A321")
vn202 = Aircraft("VN202", "B737")
vn303 = Aircraft("VN303", "A350")

atc.register(vn101)
atc.register(vn202)
atc.register(vn303)

print()
vn101.request_landing()
vn202.request_landing()
vn303.request_landing()

print()
vn101.request_takeoff()
vn303.declare_emergency("Engine fire on approach")
```

### Trade-offs của Mediator

**Ưu điểm:** Loại bỏ phụ thuộc many-to-many giữa component. Centralize control logic — dễ thay đổi hành vi của toàn hệ thống. Component có thể tái sử dụng độc lập.

**Nhược điểm:** Mediator có thể trở thành God Object — biết quá nhiều, làm quá nhiều. Bottleneck nếu mọi giao tiếp đều đi qua một điểm.

---

## So sánh Observer và Mediator

| Tiêu chí | Observer | Mediator |
|----------|---------|---------|
| **Hướng giao tiếp** | One-to-many (broadcast từ Subject) | Many-to-many qua hub trung gian |
| **Subject biết Observer không** | Không (chỉ biết interface) | N/A — component biết Mediator |
| **Ai điều phối** | Subject tự broadcast | Mediator điều phối toàn bộ |
| **Khi nào dùng** | Event notification, reactive UI, pub/sub | Chat room, ATC, form validation, workflow engine |
| **Coupling** | Subject ↔ Observer interface | Mọi component ↔ Mediator |

> [!note] Observer vs Mediator trong thực tế
> Hai pattern thường kết hợp: Mediator dùng Observer để notify các component về kết quả điều phối. Ví dụ: Django dùng Signal (Observer) cho app-level events; một workflow engine dùng Mediator để điều phối các bước, sau đó Observer để notify dashboard.

---

## Summary / Key Takeaways

- **Observer** thiết lập one-to-many dependency — Subject thay đổi state, tất cả Observer được notify tự động. Nền tảng của event-driven và reactive programming.
- Python ecosystem dùng Observer rộng rãi: Django signals, Qt signals/slots, `asyncio` event loop, `tkinter` bindings.
- **Mediator** tập trung logic giao tiếp vào một hub — component không biết nhau, chỉ biết Mediator. Đổi O(n²) kết nối thành O(n).
- Mediator dễ trở thành God Object — cần tách nhỏ nếu logic điều phối quá phức tạp.
- Cả hai đều giảm coupling theo cách khác nhau: Observer giảm coupling giữa Subject và Subscriber; Mediator giảm coupling giữa các peer component.

---

## References

- Gamma et al. — *Design Patterns*, Ch. 5: Observer tr.293, Mediator tr.273
- Refactoring.Guru — Observer: https://refactoring.guru/design-patterns/observer/python/example
- Refactoring.Guru — Mediator: https://refactoring.guru/design-patterns/mediator/python/example
- Django Signals — https://docs.djangoproject.com/en/stable/topics/signals/
