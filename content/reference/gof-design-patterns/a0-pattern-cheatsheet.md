---
title: "A0. Pattern Quick Reference Cheatsheet"
tags: [design-patterns, gof, appendix, cheatsheet, reference]
aliases: [Pattern Cheatsheet, GoF Reference]
created: 2026-03-24
---

> **Mục đích**: Tài liệu tham khảo nhanh — dùng khi cần nhớ lại một pattern, so sánh các lựa chọn, hoặc tìm pattern phù hợp cho vấn đề đang gặp.

---

## Nhóm Creational — Kiểm soát việc tạo object

| Pattern | Vấn đề giải quyết | Cơ chế | Khi dùng | Lesson |
|---------|------------------|--------|---------|--------|
| **Singleton** | Chỉ cần đúng một instance | `__new__` + class variable | Logger, config, connection pool | [[02-singleton-factory-method\|02]] |
| **Factory Method** | Tách loại object tạo ra khỏi client | Override method trong subclass | Không biết trước cần tạo loại nào | [[02-singleton-factory-method\|02]] |
| **Abstract Factory** | Tạo family objects nhất quán | Swap toàn bộ factory | Multi-platform UI, DB backends | [[03-abstract-factory-builder\|03]] |
| **Builder** | Tránh constructor phức tạp | Method chaining, Director | Object nhiều bước khởi tạo | [[03-abstract-factory-builder\|03]] |
| **Prototype** | Clone thay vì tạo mới từ đầu | `copy.deepcopy()`, Registry | Constructor tốn kém, template objects | [[04-prototype\|04]] |

---

## Nhóm Structural — Tổ chức class và object

| Pattern | Vấn đề giải quyết | Cơ chế | Khi dùng | Lesson |
|---------|------------------|--------|---------|--------|
| **Adapter** | Interface không tương thích | Wrap adaptee (composition) | Tích hợp thư viện bên ngoài | [[05-adapter-facade\|05]] |
| **Facade** | Hệ thống con quá phức tạp | Interface đơn giản hóa | Ẩn orchestration nhiều service | [[05-adapter-facade\|05]] |
| **Decorator** | Thêm hành vi lúc runtime | Xếp chồng wrapper cùng interface | Logging, caching, auth, compression | [[06-decorator-proxy\|06]] |
| **Proxy** | Kiểm soát truy cập object | Wrapper cùng interface | Lazy init, permissions, audit | [[06-decorator-proxy\|06]] |
| **Composite** | Xử lý đồng nhất leaf và group | Cây đệ quy | File system, UI tree, org chart | [[07-composite-bridge\|07]] |
| **Bridge** | Tách abstraction khỏi implementation | Hai hierarchy + composition | M types × N platforms | [[07-composite-bridge\|07]] |
| **Flyweight** | Quá nhiều object giống nhau | Chia sẻ intrinsic state | Game objects, text editor chars | [[08-flyweight\|08]] |

---

## Nhóm Behavioral — Giao tiếp và trách nhiệm

| Pattern | Vấn đề giải quyết | Cơ chế | Khi dùng | Lesson |
|---------|------------------|--------|---------|--------|
| **Strategy** | Swap thuật toán lúc runtime | Composition, delegate | Sort, payment, pricing | [[09-strategy-template-method\|09]] |
| **Template Method** | Cùng khung, khác chi tiết | Inheritance, override hooks | Data importer, report generator | [[09-strategy-template-method\|09]] |
| **Observer** | Notify nhiều subscriber tự động | Danh sách listener, broadcast | Event system, reactive UI | [[10-observer-mediator\|10]] |
| **Mediator** | Loại bỏ phụ thuộc many-to-many | Hub trung tâm | Chat, ATC, form validation | [[10-observer-mediator\|10]] |
| **Command** | Đóng gói request, undo/redo | Object với execute/undo | Editor, task queue, macro | [[11-command-chain-of-responsibility\|11]] |
| **Chain of Responsibility** | Tìm handler phù hợp | Chuỗi handler, pass-through | Middleware, support escalation | [[11-command-chain-of-responsibility\|11]] |
| **Iterator** | Duyệt collection không lộ cấu trúc | `__iter__`/`__next__` | Tree traversal, pagination | [[12-iterator-visitor\|12]] |
| **Visitor** | Thêm thao tác không sửa class | Double dispatch (accept/visit) | AST operations, report generation | [[12-iterator-visitor\|12]] |
| **State** | Behavior thay đổi theo state | State class tự chuyển đổi | FSM, order lifecycle, game AI | [[13-state-memento\|13]] |
| **Memento** | Lưu và phục hồi state | Snapshot bất biến | Undo/redo, checkpoint | [[13-state-memento\|13]] |
| **Interpreter** | Evaluate DSL / mini-language | Grammar → class hierarchy | Rule engine, query DSL, template | [[14-interpreter\|14]] |

---

## So sánh các pattern hay nhầm

### Adapter vs Decorator vs Proxy

Cả ba đều **bọc** (wrap) một object. Khác nhau ở mục đích:

| | Interface | Mục đích |
|--|-----------|---------|
| **Adapter** | Thay đổi (target ≠ adaptee) | Làm tương thích |
| **Decorator** | Giữ nguyên | Thêm hành vi |
| **Proxy** | Giữ nguyên | Kiểm soát truy cập |

### Strategy vs State vs Template Method

Cả ba đều thay đổi hành vi. Khác nhau ở cơ chế:

| | Cơ chế | Thay đổi khi nào | Ai quyết định |
|--|--------|-----------------|--------------|
| **Strategy** | Composition | Runtime | Client bên ngoài |
| **State** | Composition | Runtime | State tự chuyển |
| **Template Method** | Inheritance | Compile time | Subclass |

### Factory Method vs Abstract Factory vs Builder

Cả ba đều tạo object. Khác nhau ở scope:

| | Tạo gì | Cơ chế |
|--|--------|--------|
| **Factory Method** | Một loại product | Override method |
| **Abstract Factory** | Cả family (nhiều loại liên quan) | Swap factory object |
| **Builder** | Một product phức tạp từng bước | Method chaining |

### Observer vs Mediator

Cả hai đều giảm coupling. Khác nhau ở hướng:

| | Cấu trúc | Hướng giao tiếp |
|--|----------|----------------|
| **Observer** | Subject → nhiều Observer | One-to-many (broadcast) |
| **Mediator** | Nhiều component ↔ Hub | Many-to-many qua trung gian |

---

## Snippet tham khảo nhanh

### Singleton (thread-safe)

```python
import threading

class Singleton:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance
```

### Observer (event bus)

```python
from collections import defaultdict

class EventBus:
    def __init__(self):
        self._listeners = defaultdict(list)

    def subscribe(self, event, handler):
        self._listeners[event].append(handler)

    def publish(self, event, data=None):
        for h in self._listeners[event]:
            h(event, data)
```

### Strategy (pluggable algorithm)

```python
from abc import ABC, abstractmethod

class Strategy(ABC):
    @abstractmethod
    def execute(self, data): ...

class Context:
    def __init__(self, strategy: Strategy):
        self._strategy = strategy

    def run(self, data):
        return self._strategy.execute(data)
```

### Decorator (behavior stacking)

```python
from abc import ABC, abstractmethod

class Component(ABC):
    @abstractmethod
    def operation(self): ...

class BaseComponent(Component):
    def operation(self): return "Base"

class Decorator(Component):
    def __init__(self, wrapped: Component):
        self._wrapped = wrapped

    def operation(self):
        return f"Decorated({self._wrapped.operation()})"
```

### Builder (fluent API)

```python
class QueryBuilder:
    def __init__(self, table):
        self._table = table
        self._conditions = []
        self._limit = None

    def where(self, cond):
        self._conditions.append(cond)
        return self

    def limit(self, n):
        self._limit = n
        return self

    def build(self):
        sql = f"SELECT * FROM {self._table}"
        if self._conditions:
            sql += " WHERE " + " AND ".join(self._conditions)
        if self._limit:
            sql += f" LIMIT {self._limit}"
        return sql
```

### Chain of Responsibility

```python
from abc import ABC, abstractmethod

class Handler(ABC):
    def __init__(self):
        self._next = None

    def set_next(self, handler):
        self._next = handler
        return handler

    def handle(self, request):
        if self._can_handle(request):
            return self._process(request)
        return self._next.handle(request) if self._next else None

    @abstractmethod
    def _can_handle(self, request): ...

    @abstractmethod
    def _process(self, request): ...
```

---

## Checklist chọn pattern

```text
Cần tạo object linh hoạt?
  ├─ Một loại, tách khỏi client         → Factory Method
  ├─ Nhiều loại liên quan nhất quán     → Abstract Factory
  ├─ Object phức tạp nhiều bước         → Builder
  ├─ Clone từ template                   → Prototype
  └─ Chỉ một instance                   → Singleton

Cần tổ chức cấu trúc?
  ├─ Kết nối interface không tương thích → Adapter
  ├─ Ẩn phức tạp hệ thống con           → Facade
  ├─ Thêm hành vi không sửa class        → Decorator
  ├─ Kiểm soát truy cập                  → Proxy
  ├─ Cây part-whole                      → Composite
  ├─ Tách abstraction/implementation     → Bridge
  └─ Nghìn object giống nhau            → Flyweight

Cần quản lý hành vi?
  ├─ Swap thuật toán lúc runtime         → Strategy
  ├─ Khung cố định, chi tiết thay đổi   → Template Method
  ├─ Notify nhiều bên khi state thay đổi → Observer
  ├─ Điều phối giao tiếp nhiều component → Mediator
  ├─ Đóng gói request, undo/redo         → Command
  ├─ Chuỗi handler, ai xử lý?           → Chain of Responsibility
  ├─ Duyệt collection nhiều cách         → Iterator
  ├─ Nhiều thao tác trên cấu trúc cố định → Visitor
  ├─ Behavior thay đổi theo state        → State
  ├─ Lưu/phục hồi trạng thái            → Memento
  └─ Evaluate mini-language              → Interpreter
```
