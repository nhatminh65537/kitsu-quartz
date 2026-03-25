---
title: "13. State & Memento"
tags: [design-patterns, gof, behavioral, state, memento, lesson-13]
aliases: [State Pattern, Memento Pattern]
created: 2026-03-24
---

> **Prerequisites**: [[01-foundations|01. Foundations]], [[09-strategy-template-method|09. Strategy & Template Method]], [[11-command-chain-of-responsibility|11. Command & Chain of Responsibility]]
> **Objectives**:
> - Hiểu State: thay đổi hành vi object khi internal state thay đổi — object trông như thay đổi class
> - Hiểu Memento: lưu và phục hồi trạng thái bên trong object mà không vi phạm encapsulation
> - Phân biệt State vs Strategy: cả hai đều swap behavior, nhưng State tự chuyển đổi lẫn nhau còn Strategy được chỉ định từ ngoài
> - Kết hợp Memento với Command để xây dựng undo/redo hoàn chỉnh hơn

---

## Phần 1 — State Pattern

### Vấn đề State giải quyết

Hãy nghĩ đến vending machine: khi không có tiền, nhấn nút không làm gì; khi có tiền, nhấn nút nhả hàng; khi hết hàng, không cho nhập tiền... Mỗi trạng thái xử lý cùng một event theo cách khác nhau. Nếu dùng `if/elif` kiểm tra trạng thái khắp nơi, code bùng nổ theo số lượng state × số lượng event.

> [!definition] State Pattern
> Cho phép object **thay đổi hành vi** khi internal state của nó thay đổi. Object sẽ trông như thể nó **đã thay đổi class**.
>
> **Ý tưởng cốt lõi**: Đóng gói mỗi trạng thái vào một class riêng (ConcreteState). Context delegate toàn bộ behavior cho state object hiện tại. State object có thể tự chuyển Context sang state khác.

### State vs Strategy

Cấu trúc giống Strategy — cả hai đều swap behavior qua composition. Sự khác biệt nằm ở **ý định**:

- **Strategy**: thuật toán được chỉ định từ bên ngoài, không biết nhau, không tự chuyển đổi
- **State**: các state biết nhau, tự quyết định khi nào chuyển sang state tiếp theo

### Implementation — Vending Machine

```python
from __future__ import annotations
from abc import ABC, abstractmethod


class VendingMachineState(ABC):
    def __init__(self, machine: "VendingMachine"):
        self._machine = machine

    @abstractmethod
    def insert_coin(self, amount: float) -> None: ...

    @abstractmethod
    def press_button(self, item: str) -> None: ...

    @abstractmethod
    def return_coins(self) -> float: ...

    @property
    @abstractmethod
    def name(self) -> str: ...


class IdleState(VendingMachineState):
    @property
    def name(self) -> str: return "Idle"

    def insert_coin(self, amount: float) -> None:
        self._machine.balance += amount
        print(f"[{self.name}] Inserted ${amount:.2f}. Balance: ${self._machine.balance:.2f}")
        self._machine.set_state(self._machine.has_money_state)

    def press_button(self, item: str) -> None:
        print(f"[{self.name}] Please insert coins first.")

    def return_coins(self) -> float:
        print(f"[{self.name}] No coins to return.")
        return 0.0


class HasMoneyState(VendingMachineState):
    @property
    def name(self) -> str: return "HasMoney"

    def insert_coin(self, amount: float) -> None:
        self._machine.balance += amount
        print(f"[{self.name}] Added ${amount:.2f}. Balance: ${self._machine.balance:.2f}")

    def press_button(self, item: str) -> None:
        inventory = self._machine.inventory
        price = self._machine.prices.get(item)
        if price is None:
            print(f"[{self.name}] Item '{item}' not found.")
            return
        if inventory.get(item, 0) == 0:
            print(f"[{self.name}] '{item}' is out of stock.")
            self._machine.set_state(self._machine.out_of_stock_state)
            return
        if self._machine.balance < price:
            print(f"[{self.name}] Need ${price - self._machine.balance:.2f} more for '{item}'.")
            return
        self._machine.balance -= price
        inventory[item] -= 1
        print(f"[{self.name}] Dispensing '{item}'! Change: ${self._machine.balance:.2f}")
        self._machine.balance = 0.0
        if all(v == 0 for v in inventory.values()):
            self._machine.set_state(self._machine.out_of_stock_state)
        else:
            self._machine.set_state(self._machine.idle_state)

    def return_coins(self) -> float:
        amount = self._machine.balance
        self._machine.balance = 0.0
        print(f"[{self.name}] Returned ${amount:.2f}")
        self._machine.set_state(self._machine.idle_state)
        return amount


class OutOfStockState(VendingMachineState):
    @property
    def name(self) -> str: return "OutOfStock"

    def insert_coin(self, amount: float) -> None:
        print(f"[{self.name}] Machine out of stock. Returning ${amount:.2f}")

    def press_button(self, item: str) -> None:
        print(f"[{self.name}] Sorry, all items sold out.")

    def return_coins(self) -> float:
        amount = self._machine.balance
        self._machine.balance = 0.0
        return amount


class VendingMachine:
    def __init__(self):
        self.balance = 0.0
        self.inventory = {"Cola": 2, "Water": 1}
        self.prices = {"Cola": 1.50, "Water": 1.00}

        self.idle_state = IdleState(self)
        self.has_money_state = HasMoneyState(self)
        self.out_of_stock_state = OutOfStockState(self)
        self._state: VendingMachineState = self.idle_state

    def set_state(self, state: VendingMachineState) -> None:
        print(f"  [Machine] State: {self._state.name} → {state.name}")
        self._state = state

    def insert_coin(self, amount: float) -> None:
        self._state.insert_coin(amount)

    def press_button(self, item: str) -> None:
        self._state.press_button(item)

    def return_coins(self) -> float:
        return self._state.return_coins()

    @property
    def current_state(self) -> str:
        return self._state.name


vm = VendingMachine()
print("=== Vending Machine Demo ===\n")
vm.press_button("Cola")
vm.insert_coin(1.00)
vm.insert_coin(0.50)
vm.press_button("Cola")
print()
vm.insert_coin(2.00)
vm.press_button("Water")
print()
vm.insert_coin(1.50)
vm.press_button("Cola")
```

### Worked Example — Order Lifecycle

Bài toán thực tế: đơn hàng trong e-commerce có nhiều trạng thái (Pending → Confirmed → Shipped → Delivered / Cancelled) với các hành động hợp lệ khác nhau ở mỗi trạng thái.

```python
from __future__ import annotations
from abc import ABC, abstractmethod
from datetime import datetime


class OrderState(ABC):
    def __init__(self, order: "Order"):
        self._order = order

    @abstractmethod
    def confirm(self) -> None: ...

    @abstractmethod
    def ship(self) -> None: ...

    @abstractmethod
    def deliver(self) -> None: ...

    @abstractmethod
    def cancel(self) -> None: ...

    @property
    @abstractmethod
    def name(self) -> str: ...

    def _invalid(self, action: str) -> None:
        print(f"[{self.name}] Cannot '{action}' from state '{self.name}'")


class PendingState(OrderState):
    @property
    def name(self) -> str: return "Pending"

    def confirm(self) -> None:
        print(f"[{self.name}] Order confirmed. Processing payment...")
        self._order.log_event("confirmed")
        self._order.set_state(ConfirmedState(self._order))

    def ship(self) -> None: self._invalid("ship")
    def deliver(self) -> None: self._invalid("deliver")

    def cancel(self) -> None:
        print(f"[{self.name}] Order cancelled before confirmation.")
        self._order.log_event("cancelled")
        self._order.set_state(CancelledState(self._order))


class ConfirmedState(OrderState):
    @property
    def name(self) -> str: return "Confirmed"

    def confirm(self) -> None: self._invalid("confirm")

    def ship(self) -> None:
        print(f"[{self.name}] Package handed to carrier.")
        self._order.log_event("shipped")
        self._order.set_state(ShippedState(self._order))

    def deliver(self) -> None: self._invalid("deliver")

    def cancel(self) -> None:
        print(f"[{self.name}] Order cancelled. Initiating refund...")
        self._order.log_event("cancelled_with_refund")
        self._order.set_state(CancelledState(self._order))


class ShippedState(OrderState):
    @property
    def name(self) -> str: return "Shipped"

    def confirm(self) -> None: self._invalid("confirm")
    def ship(self) -> None: self._invalid("ship")

    def deliver(self) -> None:
        print(f"[{self.name}] Delivery confirmed by customer.")
        self._order.log_event("delivered")
        self._order.set_state(DeliveredState(self._order))

    def cancel(self) -> None:
        print(f"[{self.name}] Cannot cancel — already shipped. Please use return flow.")


class DeliveredState(OrderState):
    @property
    def name(self) -> str: return "Delivered"

    def confirm(self) -> None: self._invalid("confirm")
    def ship(self) -> None: self._invalid("ship")
    def deliver(self) -> None: self._invalid("deliver")
    def cancel(self) -> None: self._invalid("cancel")


class CancelledState(OrderState):
    @property
    def name(self) -> str: return "Cancelled"

    def confirm(self) -> None: self._invalid("confirm")
    def ship(self) -> None: self._invalid("ship")
    def deliver(self) -> None: self._invalid("deliver")
    def cancel(self) -> None: self._invalid("cancel")


class Order:
    def __init__(self, order_id: str):
        self.order_id = order_id
        self._state: OrderState = PendingState(self)
        self._events: list[tuple[str, str]] = []

    def set_state(self, state: OrderState) -> None:
        self._state = state

    def log_event(self, event: str) -> None:
        self._events.append((datetime.now().isoformat(), event))

    def confirm(self) -> None: self._state.confirm()
    def ship(self) -> None: self._state.ship()
    def deliver(self) -> None: self._state.deliver()
    def cancel(self) -> None: self._state.cancel()

    @property
    def status(self) -> str: return self._state.name

    def history(self) -> list[str]:
        return [f"{ts}: {ev}" for ts, ev in self._events]


order = Order("ORD-001")
print(f"Order status: {order.status}")
order.ship()
order.confirm()
order.ship()
order.deliver()
order.cancel()
print(f"\nFinal status: {order.status}")
```

---

## Phần 2 — Memento Pattern

### Vấn đề Memento giải quyết

Bạn muốn lưu snapshot của object để có thể khôi phục sau. Nhưng object có thể có nhiều private field — expose chúng ra để lưu vi phạm encapsulation. Memento giải quyết bằng cách để object tự tạo snapshot của chính mình.

> [!definition] Memento Pattern
> Không vi phạm encapsulation, capture và externalize **trạng thái bên trong** của một object sao cho object có thể được **khôi phục** về trạng thái đó sau này.
>
> **Ý tưởng cốt lõi**: Originator tạo Memento (snapshot). Caretaker lưu trữ Memento nhưng không đọc nội dung. Chỉ Originator mới biết cách đọc và áp dụng Memento.

### Cấu trúc

```text
Originator                Memento
- _state                  - _state  (private, chỉ Originator đọc được)
+ save() → Memento        + get_state() → state
+ restore(m: Memento)
      │ creates
      ▼
Caretaker
- _history: list[Memento]
+ backup(originator)
+ undo(originator)
```

### Implementation — Text Editor Snapshot

```python
from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime
from copy import deepcopy


@dataclass(frozen=True)
class EditorMemento:
    content: str
    cursor_pos: int
    selection: tuple[int, int] | None
    timestamp: str

    def __repr__(self) -> str:
        preview = self.content[:20].replace('\n', '↵')
        return f"Memento['{preview}...' @{self.cursor_pos}]"


class TextEditor:
    def __init__(self):
        self._content = ""
        self._cursor = 0
        self._selection: tuple[int, int] | None = None

    def type(self, text: str) -> None:
        self._content = (
            self._content[:self._cursor] + text + self._content[self._cursor:]
        )
        self._cursor += len(text)

    def delete_selection(self) -> None:
        if self._selection:
            start, end = self._selection
            self._content = self._content[:start] + self._content[end:]
            self._cursor = start
            self._selection = None

    def select(self, start: int, end: int) -> None:
        self._selection = (start, end)

    def move_cursor(self, pos: int) -> None:
        self._cursor = max(0, min(pos, len(self._content)))

    def save(self) -> EditorMemento:
        return EditorMemento(
            content=self._content,
            cursor_pos=self._cursor,
            selection=self._selection,
            timestamp=datetime.now().isoformat(timespec="seconds"),
        )

    def restore(self, memento: EditorMemento) -> None:
        self._content = memento.content
        self._cursor = memento.cursor_pos
        self._selection = memento.selection

    @property
    def content(self) -> str:
        return self._content

    @property
    def cursor(self) -> int:
        return self._cursor


class EditorHistory:
    def __init__(self, max_snapshots: int = 50):
        self._history: list[EditorMemento] = []
        self._redo_stack: list[EditorMemento] = []
        self._max = max_snapshots

    def save(self, editor: TextEditor) -> None:
        snapshot = editor.save()
        self._history.append(snapshot)
        if len(self._history) > self._max:
            self._history.pop(0)
        self._redo_stack.clear()

    def undo(self, editor: TextEditor) -> bool:
        if len(self._history) < 2:
            print("Nothing to undo.")
            return False
        self._redo_stack.append(self._history.pop())
        editor.restore(self._history[-1])
        return True

    def redo(self, editor: TextEditor) -> bool:
        if not self._redo_stack:
            print("Nothing to redo.")
            return False
        memento = self._redo_stack.pop()
        self._history.append(memento)
        editor.restore(memento)
        return True

    def snapshot_count(self) -> int:
        return len(self._history)


editor = TextEditor()
history = EditorHistory()

history.save(editor)

editor.type("Hello, World!")
history.save(editor)
print(f"After typing  : '{editor.content}' cursor={editor.cursor}")

editor.type(" How are you?")
history.save(editor)
print(f"After more    : '{editor.content}'")

editor.select(7, 12)
editor.delete_selection()
history.save(editor)
print(f"After delete  : '{editor.content}'")

print("\n--- Undo x2 ---")
history.undo(editor)
print(f"After undo 1  : '{editor.content}'")
history.undo(editor)
print(f"After undo 2  : '{editor.content}'")

print("\n--- Redo ---")
history.redo(editor)
print(f"After redo    : '{editor.content}'")
print(f"Snapshots     : {history.snapshot_count()}")
```

### Trade-offs

**Memento ưu điểm:** Lưu/khôi phục state mà không vi phạm encapsulation. Có thể lưu nhiều snapshot theo thời gian.

**Memento nhược điểm:** Tốn bộ nhớ nếu snapshot lớn hoặc lưu nhiều. Caretaker phải quản lý vòng đời Memento.

**State ưu điểm:** Loại bỏ if/elif theo state. State transition được định nghĩa rõ ràng, dễ test từng state độc lập.

**State nhược điểm:** Nhiều class khi state nhiều. State object phụ thuộc Context — coupling hai chiều.

---

## So sánh State và Memento

| Tiêu chí | State | Memento |
|----------|-------|---------|
| **Vấn đề giải quyết** | Behavior thay đổi theo state | Lưu và phục hồi state |
| **Ai giữ state** | State class bên ngoài Context | Memento object (snapshot bất biến) |
| **Đọc state** | Context delegate cho State | Chỉ Originator đọc Memento |
| **Khi nào dùng** | FSM, order lifecycle, game characters | Undo/redo, checkpoint, transaction rollback |

---

## Summary / Key Takeaways

- **State** đóng gói hành vi tương ứng với từng trạng thái — Context trông như thay đổi class khi state thay đổi. State tự chuyển đổi nhau, khác Strategy được điều khiển từ ngoài.
- Finite State Machine (FSM) là ứng dụng kinh điển — vending machine, order lifecycle, game AI.
- **Memento** cho phép Originator tự tạo snapshot — Caretaker lưu trữ nhưng không đọc nội dung, đảm bảo encapsulation.
- Kết hợp Command + Memento: Command `execute()` tự lưu Memento trước khi thực thi → `undo()` restore từ Memento.

---

## References

- Gamma et al. — *Design Patterns*, Ch. 5: State tr.305, Memento tr.283
- Refactoring.Guru — State: https://refactoring.guru/design-patterns/state/python/example
- Refactoring.Guru — Memento: https://refactoring.guru/design-patterns/memento/python/example
