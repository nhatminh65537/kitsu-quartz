---
title: "11. Command & Chain of Responsibility"
tags: [design-patterns, gof, behavioral, command, chain-of-responsibility, lesson-11]
aliases: [Command Pattern, Chain of Responsibility]
created: 2026-03-24
---

> **Prerequisites**: [[01-foundations|01. Foundations]], [[09-strategy-template-method|09. Strategy & Template Method]]
> **Objectives**:
> - Hiểu Command: đóng gói request thành object để queue, log, undo/redo, hoặc thực thi sau
> - Hiểu Chain of Responsibility: truyền request dọc theo chuỗi handler cho đến khi được xử lý
> - Phân biệt hai pattern: Command đóng gói *hành động*, CoR tìm *ai xử lý* hành động đó
> - Implement undo/redo stack và middleware pipeline — hai ứng dụng phổ biến nhất

---

## Phần 1 — Command Pattern

### Vấn đề Command giải quyết

Bạn xây dựng text editor với nút Undo/Redo. Mỗi thao tác (gõ chữ, xóa, bold...) cần có khả năng hoàn tác. Nếu Editor class trực tiếp thực hiện mọi thao tác, không có cách nào lưu lịch sử một cách gọn gàng.

Command giải quyết bằng cách biến mỗi thao tác thành một object độc lập, mang đủ thông tin để thực thi và hoàn tác.

> [!definition] Command Pattern
> Đóng gói một **request** như một object, từ đó cho phép: tham số hóa client với các request khác nhau, queue hoặc log các request, và hỗ trợ **undo/redo**.
>
> **Ý tưởng cốt lõi**: Tách biệt *object gửi request* (Invoker) khỏi *object thực hiện request* (Receiver) bằng cách đóng gói request vào Command object có interface thống nhất `execute()` / `undo()`.

### Cấu trúc

```text
Invoker                    Command (interface)
- _history: list[Command]  + execute() → None
+ execute(cmd)             + undo() → None
+ undo_last()                     ▲
                         ┌────────┴────────┐
                    ConcreteCommandA   ConcreteCommandB
                    - receiver: Receiver
                    - _prev_state
                    + execute()
                    + undo()
                               │ calls
                            Receiver
                            + action_a()
                            + action_b()
```

### Implementation — Text Editor với Undo/Redo

```python
from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass, field


class Command(ABC):
    @abstractmethod
    def execute(self) -> None: ...

    @abstractmethod
    def undo(self) -> None: ...

    @property
    def description(self) -> str:
        return self.__class__.__name__


class TextDocument:
    def __init__(self):
        self._content = ""
        self._selection: tuple[int, int] | None = None

    @property
    def content(self) -> str:
        return self._content

    def insert(self, position: int, text: str) -> None:
        self._content = self._content[:position] + text + self._content[position:]

    def delete(self, start: int, end: int) -> str:
        deleted = self._content[start:end]
        self._content = self._content[:start] + self._content[end:]
        return deleted

    def get_text(self, start: int, end: int) -> str:
        return self._content[start:end]

    def __repr__(self) -> str:
        return f'Document("{self._content}")'


class InsertTextCommand(Command):
    def __init__(self, doc: TextDocument, position: int, text: str):
        self._doc = doc
        self._position = position
        self._text = text

    def execute(self) -> None:
        self._doc.insert(self._position, self._text)

    def undo(self) -> None:
        self._doc.delete(self._position, self._position + len(self._text))

    @property
    def description(self) -> str:
        preview = self._text[:15].replace('\n', '↵')
        return f"Insert '{preview}' at {self._position}"


class DeleteTextCommand(Command):
    def __init__(self, doc: TextDocument, start: int, end: int):
        self._doc = doc
        self._start = start
        self._end = end
        self._deleted_text = ""

    def execute(self) -> None:
        self._deleted_text = self._doc.delete(self._start, self._end)

    def undo(self) -> None:
        self._doc.insert(self._start, self._deleted_text)

    @property
    def description(self) -> str:
        preview = self._deleted_text[:15] if self._deleted_text else f"[{self._start}:{self._end}]"
        return f"Delete '{preview}'"


class ReplaceTextCommand(Command):
    def __init__(self, doc: TextDocument, start: int, end: int, new_text: str):
        self._doc = doc
        self._start = start
        self._end = end
        self._new_text = new_text
        self._old_text = ""

    def execute(self) -> None:
        self._old_text = self._doc.delete(self._start, self._end)
        self._doc.insert(self._start, self._new_text)

    def undo(self) -> None:
        self._doc.delete(self._start, self._start + len(self._new_text))
        self._doc.insert(self._start, self._old_text)

    @property
    def description(self) -> str:
        return f"Replace [{self._start}:{self._end}] → '{self._new_text[:15]}'"


class CommandHistory:
    def __init__(self):
        self._history: list[Command] = []
        self._redo_stack: list[Command] = []

    def execute(self, command: Command) -> None:
        command.execute()
        self._history.append(command)
        self._redo_stack.clear()
        print(f"  ✓ {command.description}")

    def undo(self) -> bool:
        if not self._history:
            print("  Nothing to undo")
            return False
        command = self._history.pop()
        command.undo()
        self._redo_stack.append(command)
        print(f"  ↩ Undid: {command.description}")
        return True

    def redo(self) -> bool:
        if not self._redo_stack:
            print("  Nothing to redo")
            return False
        command = self._redo_stack.pop()
        command.execute()
        self._history.append(command)
        print(f"  ↪ Redid: {command.description}")
        return True

    def history_summary(self) -> list[str]:
        return [cmd.description for cmd in self._history]


doc = TextDocument()
history = CommandHistory()

print("=== Editing ===")
history.execute(InsertTextCommand(doc, 0, "Hello, World!"))
print(f"  Doc: {doc}")

history.execute(InsertTextCommand(doc, 7, "Beautiful "))
print(f"  Doc: {doc}")

history.execute(DeleteTextCommand(doc, 0, 5))
print(f"  Doc: {doc}")

history.execute(ReplaceTextCommand(doc, 0, 1, "H"))
print(f"  Doc: {doc}")

print("\n=== Undo x2 ===")
history.undo()
print(f"  Doc: {doc}")
history.undo()
print(f"  Doc: {doc}")

print("\n=== Redo ===")
history.redo()
print(f"  Doc: {doc}")

print("\n=== History ===")
for i, desc in enumerate(history.history_summary(), 1):
    print(f"  {i}. {desc}")
```

### Worked Example — Task Queue với macro Command

Command có thể được gộp thành **Macro Command** — thực thi nhiều command như một:

```python
from __future__ import annotations
from abc import ABC, abstractmethod
import time
from dataclasses import dataclass


class Task(ABC):
    @abstractmethod
    def execute(self) -> None: ...

    @abstractmethod
    def undo(self) -> None: ...

    @property
    @abstractmethod
    def name(self) -> str: ...


class SendEmailTask(Task):
    def __init__(self, to: str, subject: str):
        self._to = to
        self._subject = subject
        self._sent = False

    def execute(self) -> None:
        print(f"[Email] Sent to {self._to}: {self._subject}")
        self._sent = True

    def undo(self) -> None:
        if self._sent:
            print(f"[Email] Recall sent to {self._to} (best-effort)")
            self._sent = False

    @property
    def name(self) -> str:
        return f"SendEmail({self._to})"


class UpdateDatabaseTask(Task):
    def __init__(self, table: str, record_id: int, data: dict):
        self._table = table
        self._record_id = record_id
        self._data = data
        self._backup: dict = {}

    def execute(self) -> None:
        self._backup = {"old": "previous_value"}
        print(f"[DB] UPDATE {self._table} SET {self._data} WHERE id={self._record_id}")

    def undo(self) -> None:
        print(f"[DB] ROLLBACK {self._table} id={self._record_id} to {self._backup}")

    @property
    def name(self) -> str:
        return f"UpdateDB({self._table}#{self._record_id})"


class MacroTask(Task):
    def __init__(self, name: str, tasks: list[Task]):
        self._name = name
        self._tasks = tasks
        self._executed: list[Task] = []

    def execute(self) -> None:
        print(f"[Macro] Executing '{self._name}'")
        for task in self._tasks:
            task.execute()
            self._executed.append(task)

    def undo(self) -> None:
        print(f"[Macro] Rolling back '{self._name}'")
        for task in reversed(self._executed):
            task.undo()
        self._executed.clear()

    @property
    def name(self) -> str:
        return f"Macro({self._name})"


class TaskQueue:
    def __init__(self):
        self._pending: list[Task] = []
        self._completed: list[Task] = []

    def enqueue(self, task: Task) -> None:
        self._pending.append(task)
        print(f"[Queue] Enqueued: {task.name}")

    def process_all(self) -> None:
        print(f"\n[Queue] Processing {len(self._pending)} task(s)")
        while self._pending:
            task = self._pending.pop(0)
            task.execute()
            self._completed.append(task)

    def rollback_last(self) -> None:
        if self._completed:
            task = self._completed.pop()
            print(f"\n[Queue] Rolling back: {task.name}")
            task.undo()


queue = TaskQueue()

order_completion = MacroTask("OrderCompletion", [
    UpdateDatabaseTask("orders", 1001, {"status": "completed"}),
    UpdateDatabaseTask("inventory", 42, {"qty": 99}),
    SendEmailTask("customer@example.com", "Your order is complete!"),
])

queue.enqueue(order_completion)
queue.enqueue(SendEmailTask("admin@example.com", "Daily report"))
queue.process_all()
queue.rollback_last()
```

---

## Phần 2 — Chain of Responsibility Pattern

### Vấn đề CoR giải quyết

Request cần được xử lý bởi một trong nhiều handler, nhưng client không biết trước handler nào sẽ xử lý. Hoặc: request cần đi qua nhiều bước xử lý tuần tự (middleware pipeline) trước khi đến đích.

> [!definition] Chain of Responsibility Pattern
> Tạo ra một **chuỗi** các handler. Mỗi handler quyết định xử lý request hoặc truyền cho handler tiếp theo trong chuỗi. Sender không cần biết handler nào cuối cùng sẽ xử lý request.
>
> **Ý tưởng cốt lõi**: Decoupled sender khỏi receiver bằng chuỗi handler. Có thể tổ hợp chuỗi lúc runtime.

### Cấu trúc

```text
Handler (interface / ABC)
- _next: Handler | None
+ set_next(h: Handler) → Handler
+ handle(request) → result | None
      ▲
      ├──────────────┬──────────────┐
HandlerA        HandlerB        HandlerC
+ handle(req)   + handle(req)   + handle(req)
  if can_handle:   if can_handle:   ...
    process()       process()
  else:           else:
    next.handle()   next.handle()
```

### Implementation — Support Ticket System

```python
from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import IntEnum


class Priority(IntEnum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4


@dataclass
class SupportTicket:
    ticket_id: str
    issue: str
    priority: Priority
    resolved: bool = False


class SupportHandler(ABC):
    def __init__(self, name: str):
        self.name = name
        self._next: SupportHandler | None = None

    def set_next(self, handler: SupportHandler) -> SupportHandler:
        self._next = handler
        return handler

    def handle(self, ticket: SupportTicket) -> bool:
        if self._can_handle(ticket):
            self._process(ticket)
            return True
        if self._next:
            print(f"  [{self.name}] Escalating #{ticket.ticket_id} to next handler")
            return self._next.handle(ticket)
        print(f"  [!] No handler available for #{ticket.ticket_id}")
        return False

    @abstractmethod
    def _can_handle(self, ticket: SupportTicket) -> bool: ...

    @abstractmethod
    def _process(self, ticket: SupportTicket) -> None: ...


class L1Support(SupportHandler):
    def __init__(self):
        super().__init__("L1 Support")

    def _can_handle(self, ticket: SupportTicket) -> bool:
        return ticket.priority <= Priority.LOW

    def _process(self, ticket: SupportTicket) -> None:
        print(f"  [{self.name}] Resolved #{ticket.ticket_id}: {ticket.issue}")
        ticket.resolved = True


class L2Support(SupportHandler):
    def __init__(self):
        super().__init__("L2 Support")

    def _can_handle(self, ticket: SupportTicket) -> bool:
        return ticket.priority <= Priority.MEDIUM

    def _process(self, ticket: SupportTicket) -> None:
        print(f"  [{self.name}] Investigated and resolved #{ticket.ticket_id}: {ticket.issue}")
        ticket.resolved = True


class L3Engineering(SupportHandler):
    def __init__(self):
        super().__init__("L3 Engineering")

    def _can_handle(self, ticket: SupportTicket) -> bool:
        return ticket.priority <= Priority.HIGH

    def _process(self, ticket: SupportTicket) -> None:
        print(f"  [{self.name}] Deep-dive fix deployed for #{ticket.ticket_id}: {ticket.issue}")
        ticket.resolved = True


class ExecutiveEscalation(SupportHandler):
    def __init__(self):
        super().__init__("Executive Team")

    def _can_handle(self, ticket: SupportTicket) -> bool:
        return True

    def _process(self, ticket: SupportTicket) -> None:
        print(f"  [{self.name}] ⚠️  All-hands crisis response for #{ticket.ticket_id}")
        ticket.resolved = True


l1 = L1Support()
l2 = L2Support()
l3 = L3Engineering()
exec_team = ExecutiveEscalation()

l1.set_next(l2).set_next(l3).set_next(exec_team)

tickets = [
    SupportTicket("T001", "FAQ question about pricing", Priority.LOW),
    SupportTicket("T002", "Bug in reporting module", Priority.MEDIUM),
    SupportTicket("T003", "Data corruption in prod DB", Priority.HIGH),
    SupportTicket("T004", "Total service outage", Priority.CRITICAL),
]

print("=== Processing tickets ===")
for ticket in tickets:
    print(f"\nTicket #{ticket.ticket_id} [{ticket.priority.name}]: {ticket.issue}")
    l1.handle(ticket)
```

### Worked Example — HTTP Middleware Pipeline

Ứng dụng phổ biến nhất của CoR trong web: middleware pipeline. Mỗi middleware xử lý/biến đổi request rồi truyền cho bước tiếp theo.

```python
from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Callable
import time


@dataclass
class HttpRequest:
    method: str
    path: str
    headers: dict = field(default_factory=dict)
    body: str = ""


@dataclass
class HttpResponse:
    status: int
    body: str
    headers: dict = field(default_factory=dict)


Handler = Callable[[HttpRequest], HttpResponse]


class Middleware(ABC):
    def __init__(self):
        self._next: Middleware | None = None

    def set_next(self, middleware: Middleware) -> Middleware:
        self._next = middleware
        return middleware

    def process(self, request: HttpRequest) -> HttpResponse:
        return self._handle(request)

    @abstractmethod
    def _handle(self, request: HttpRequest) -> HttpResponse: ...

    def _call_next(self, request: HttpRequest) -> HttpResponse:
        if self._next:
            return self._next.process(request)
        return HttpResponse(404, "No handler found")


class AuthMiddleware(Middleware):
    VALID_TOKENS = {"secret-token-123", "admin-token-456"}

    def _handle(self, request: HttpRequest) -> HttpResponse:
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not token or token not in self.VALID_TOKENS:
            print(f"[Auth] ✗ Unauthorized: {request.path}")
            return HttpResponse(401, "Unauthorized")
        request.headers["_user"] = "admin" if "admin" in token else "user"
        print(f"[Auth] ✓ Authenticated as {request.headers['_user']}")
        return self._call_next(request)


class RateLimitMiddleware(Middleware):
    def __init__(self, max_requests: int = 5):
        super().__init__()
        self._counts: dict[str, int] = {}
        self._max = max_requests

    def _handle(self, request: HttpRequest) -> HttpResponse:
        client_ip = request.headers.get("X-Forwarded-For", "127.0.0.1")
        self._counts[client_ip] = self._counts.get(client_ip, 0) + 1
        if self._counts[client_ip] > self._max:
            print(f"[RateLimit] ✗ Too many requests from {client_ip}")
            return HttpResponse(429, "Too Many Requests")
        remaining = self._max - self._counts[client_ip]
        print(f"[RateLimit] ✓ {remaining} requests remaining for {client_ip}")
        return self._call_next(request)


class LoggingMiddleware(Middleware):
    def _handle(self, request: HttpRequest) -> HttpResponse:
        start = time.perf_counter()
        print(f"[Log] → {request.method} {request.path}")
        response = self._call_next(request)
        elapsed = (time.perf_counter() - start) * 1000
        print(f"[Log] ← {response.status} ({elapsed:.1f}ms)")
        return response


class RouteHandler(Middleware):
    def __init__(self):
        super().__init__()
        self._routes: dict[tuple[str, str], Callable] = {}

    def get(self, path: str):
        def decorator(func: Callable) -> Callable:
            self._routes[("GET", path)] = func
            return func
        return decorator

    def post(self, path: str):
        def decorator(func: Callable) -> Callable:
            self._routes[("POST", path)] = func
            return func
        return decorator

    def _handle(self, request: HttpRequest) -> HttpResponse:
        handler = self._routes.get((request.method, request.path))
        if handler:
            return handler(request)
        return HttpResponse(404, f"Route not found: {request.method} {request.path}")


router = RouteHandler()

@router.get("/api/users")
def get_users(req: HttpRequest) -> HttpResponse:
    user = req.headers.get("_user", "unknown")
    return HttpResponse(200, f'{{"users": ["alice", "bob"], "requested_by": "{user}"}}')

@router.post("/api/orders")
def create_order(req: HttpRequest) -> HttpResponse:
    return HttpResponse(201, '{"order_id": 1001, "status": "created"}')


logging_mw = LoggingMiddleware()
auth_mw = AuthMiddleware()
rate_mw = RateLimitMiddleware(max_requests=3)

logging_mw.set_next(auth_mw).set_next(rate_mw).set_next(router)


def handle(method: str, path: str, headers: dict = None, body: str = "") -> HttpResponse:
    req = HttpRequest(method, path, headers or {}, body)
    print(f"\n{'='*50}")
    resp = logging_mw.process(req)
    print(f"Response: {resp.status} — {resp.body}")
    return resp


handle("GET", "/api/users", {"Authorization": "Bearer secret-token-123",
                              "X-Forwarded-For": "10.0.0.1"})
handle("GET", "/api/users", {"X-Forwarded-For": "10.0.0.2"})
handle("POST", "/api/orders", {"Authorization": "Bearer admin-token-456",
                                "X-Forwarded-For": "10.0.0.1"})
handle("GET", "/api/users", {"Authorization": "Bearer secret-token-123",
                              "X-Forwarded-For": "10.0.0.1"})
```

---

## So sánh Command và Chain of Responsibility

| Tiêu chí | Command | Chain of Responsibility |
|----------|---------|------------------------|
| **Mục đích** | Đóng gói request để queue, log, undo | Tìm handler phù hợp cho request |
| **Người thực hiện** | Receiver được chỉ định sẵn | Handler trong chuỗi tự quyết định |
| **Undo support** | Có — lưu state trước để rollback | Không |
| **Kết quả** | Một handler thực thi | Một hoặc nhiều handler xử lý |
| **Khi nào dùng** | Undo/redo, task queue, macro | Middleware, escalation, filter pipeline |

---

## Summary / Key Takeaways

- **Command** biến request thành object độc lập — mang đủ thông tin để execute, undo, và queue. Invoker không biết Receiver; Receiver không biết Invoker.
- Undo/Redo là ứng dụng đặc trưng nhất của Command — lưu stack `history` và `redo_stack`.
- **MacroCommand** gộp nhiều command thành một — composite pattern áp dụng cho Command.
- **Chain of Responsibility** truyền request qua chuỗi handler — mỗi handler quyết định xử lý hoặc chuyển tiếp. Sender không biết ai xử lý.
- Middleware pipeline (Flask, Django, FastAPI) là CoR trong thực tế — Auth → RateLimit → Logging → Router.
- Fluent API `set_next()` trả về handler tiếp theo cho phép chain `h1.set_next(h2).set_next(h3)`.

---

## References

- Gamma et al. — *Design Patterns*, Ch. 5: Command tr.233, Chain of Responsibility tr.223
- Refactoring.Guru — Command: https://refactoring.guru/design-patterns/command/python/example
- Refactoring.Guru — CoR: https://refactoring.guru/design-patterns/chain-of-responsibility/python/example
