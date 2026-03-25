---
title: "A1. Python Implementation Gallery"
tags: [software-architecture, posa, design-pattern, python, reference, appendix]
aliases: [Python Gallery, Implementation Reference]
created: 2026-03-24
---

> **Mục đích**: Reference nhanh — snippet Python tối giản cho từng pattern. Mỗi snippet là "xương sống" tối thiểu có thể copy và mở rộng. Code đã được verify trong từng bài học.

---

## 01 — Layers (Phân tầng)

```python
from abc import ABC, abstractmethod
from typing import Optional

# --- Infrastructure Layer ---
class Repository(ABC):
    @abstractmethod
    def find_by_id(self, id: str): ...
    @abstractmethod
    def save(self, entity) -> None: ...

class InMemoryRepository(Repository):
    def __init__(self): self._store = {}
    def find_by_id(self, id): return self._store.get(id)
    def save(self, entity): self._store[entity.id] = entity

# --- Domain Layer ---
class DomainService:
    def __init__(self, repo: Repository):  # Dependency Injection
        self._repo = repo

    def do_something(self, id: str):
        entity = self._repo.find_by_id(id)
        # business logic here
        return entity

# --- Presentation Layer ---
class Controller:
    def __init__(self, service: DomainService):
        self._service = service  # chỉ biết Domain, không biết Infrastructure

    def handle(self, id: str):
        return self._service.do_something(id)
```

**Key**: Layer trên nhận layer dưới qua Dependency Injection. `Controller` không import `InMemoryRepository`. Đổi DB: chỉ cần implement lại `Repository`.

---

## 02 — Pipes & Filters

```python
from abc import ABC, abstractmethod
from typing import Any, Iterator, Iterable

# Sequential (in-memory)
class Filter(ABC):
    @abstractmethod
    def process(self, data: Any) -> Any: ...

class Pipeline:
    def __init__(self): self._filters = []
    def add(self, f: Filter) -> "Pipeline":
        self._filters.append(f); return self
    def run(self, data: Any) -> Any:
        for f in self._filters: data = f.process(data)
        return data

# Lazy Generator (Pull model — memory-efficient)
def make_pipeline(*transforms):
    def pipeline(source: Iterable) -> Iterator:
        result = source
        for transform in transforms:
            result = transform(result)
        return result
    return pipeline

# Concurrent (Active Filters)
import queue, threading

_STOP = object()
def concurrent_stage(in_q, out_q, fn):
    while True:
        item = in_q.get()
        if item is _STOP: out_q.put(_STOP); break
        out_q.put(fn(item))
```

**Key**: Generator pipeline = Pull model tự động. `yield` trong transform = lazy evaluation. Queue-based = concurrent filters chạy song song.

---

## 03 — Blackboard

```python
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Optional

@dataclass
class Blackboard:
    input_data: str = ""
    # partial solutions
    step_a_result: Optional[str] = None
    step_b_result: Optional[str] = None
    final_result: Optional[str] = None

    def is_complete(self) -> bool:
        return self.final_result is not None

class KnowledgeSource(ABC):
    @abstractmethod
    def condition_met(self, bb: Blackboard) -> bool: ...
    @abstractmethod
    def execute(self, bb: Blackboard) -> None: ...
    @property
    @abstractmethod
    def name(self) -> str: ...
    @property
    def priority(self) -> int: return 0

class Controller:
    def __init__(self, bb: Blackboard, sources: list[KnowledgeSource]):
        self._bb = bb
        self._sources = sorted(sources, key=lambda s: -s.priority)

    def run(self, max_cycles: int = 20) -> Blackboard:
        for _ in range(max_cycles):
            if self._bb.is_complete(): break
            ks = next((s for s in self._sources if s.condition_met(self._bb)), None)
            if ks is None: break
            ks.execute(self._bb)
        return self._bb
```

**Key**: `condition_met()` + `execute()` là contract của KnowledgeSource. Controller chọn KS có priority cao nhất thỏa điều kiện. KS không gọi KS khác trực tiếp.

---

## 04 — Broker

```python
from typing import Any
import json

class Broker:
    def __init__(self): self._registry = {}

    def register(self, name: str, handler: object) -> None:
        self._registry[name] = ServerSideProxy(handler)

    def forward(self, service: str, method: str, args: list, kwargs: dict) -> Any:
        if service not in self._registry:
            raise KeyError(f"Service '{service}' not found")
        return self._registry[service].invoke(method, args, kwargs)

    def get_proxy(self, service: str) -> "ClientSideProxy":
        return ClientSideProxy(service, self)

class ServerSideProxy:
    def __init__(self, server): self._server = server
    def invoke(self, method, args, kwargs):
        fn = getattr(self._server, method)
        return json.loads(json.dumps(fn(*args, **kwargs)))  # marshal round-trip

class ClientSideProxy:
    def __init__(self, service, broker):
        self._service = service; self._broker = broker
    def __getattr__(self, method):
        return lambda *a, **k: self._broker.forward(
            self._service, method,
            json.loads(json.dumps(list(a))),
            json.loads(json.dumps(k))
        )

# Usage:
# broker = Broker()
# broker.register("math", MathServer())
# math = broker.get_proxy("math")
# result = math.add(3, 4)  # transparent remote call
```

**Key**: `ClientSideProxy.__getattr__` là cơ chế transparent call. `json.dumps/loads` là marshalling đơn giản. Thêm server: `broker.register()` — client không đổi.

---

## 05 — MVC

```python
from abc import ABC, abstractmethod
from typing import Any

class Observer(ABC):
    @abstractmethod
    def update(self, event: str, data: Any) -> None: ...

class Model:
    def __init__(self): self._observers = []; self._state = {}
    def subscribe(self, obs: Observer): self._observers.append(obs)
    def _notify(self, event, data=None):
        for obs in self._observers: obs.update(event, data)
    def set(self, key, value):
        self._state[key] = value; self._notify("changed", {key: value})
    def get(self, key): return self._state.get(key)

class View(Observer):
    def __init__(self, model: Model, name: str):
        self._model = model; self._name = name; model.subscribe(self)
    def update(self, event, data):
        print(f"[{self._name}] event={event} data={data}")
    def render(self):
        print(f"[{self._name}] state={self._model._state}")

class Controller:
    def __init__(self, model: Model): self._model = model
    def handle(self, key, value): self._model.set(key, value)

# PAC skeleton
class PACControl:
    def __init__(self):
        self._abstraction = {}   # local data
        self._parent: "PACControl | None" = None

    def set_parent(self, parent: "PACControl"): self._parent = parent
    def notify_parent(self, event, data):
        if self._parent: self._parent.child_event(self, event, data)
    def child_event(self, child: "PACControl", event, data): pass  # override
```

**Key**: `Model._notify()` = Observer broadcast. View không call `model.set()` — Controller làm điều đó. PAC: P-A không giao tiếp trực tiếp — đi qua Control.

---

## 06 — Microkernel

```python
from abc import ABC, abstractmethod
from typing import Any

class PluginInterface(ABC):
    @property
    @abstractmethod
    def plugin_id(self) -> str: ...
    @property
    def version(self) -> str: return "1.0"
    @abstractmethod
    def execute(self, data: Any, context: dict) -> Any: ...
    def on_load(self): pass
    def on_unload(self): pass

class PluginRegistry:
    def __init__(self): self._plugins: dict[str, PluginInterface] = {}
    def register(self, p: PluginInterface):
        self._plugins[p.plugin_id] = p; p.on_load()
    def unregister(self, pid: str):
        if pid in self._plugins:
            self._plugins[pid].on_unload(); del self._plugins[pid]
    def get(self, pid: str) -> PluginInterface:
        if pid not in self._plugins: raise KeyError(pid)
        return self._plugins[pid]
    def list_all(self) -> list[str]: return list(self._plugins.keys())

class Microkernel:
    def __init__(self): self._registry = PluginRegistry()
    def load_plugin(self, plugin: PluginInterface): self._registry.register(plugin)
    def run(self, plugin_id: str, data: Any, context: dict | None = None) -> Any:
        return self._registry.get(plugin_id).execute(data, context if context is not None else {})
    def configure_pipeline(self, ids: list[str]) -> "Pipeline":
        plugins = [self._registry.get(id) for id in ids]
        return Pipeline(plugins)

class Pipeline:
    def __init__(self, plugins): self._plugins = plugins
    def run(self, data: Any) -> Any:
        ctx: dict = {}
        for p in self._plugins: data = p.execute(data, ctx)
        return data

# Adapter for third-party plugin
class AdapterPlugin(PluginInterface):
    def __init__(self, third_party, plugin_id, adapter_fn):
        self._tp = third_party; self._id = plugin_id; self._fn = adapter_fn
    @property
    def plugin_id(self): return self._id
    def execute(self, data, context): return self._fn(self._tp, data)
```

**Key**: `PluginInterface` là Extension Point contract. `on_load`/`on_unload` = lifecycle hooks. `AdapterPlugin` = wrap third-party API không chuẩn. `context if context is not None else {}` tránh falsy empty dict bug.

---

## 07 — Reactor

```python
import selectors, socket
from abc import ABC, abstractmethod

class EventHandler(ABC):
    @abstractmethod
    def handle_read(self, key: selectors.SelectorKey) -> None: ...
    def get_socket(self) -> socket.socket: return self._sock

class Reactor:
    def __init__(self): self._sel = selectors.DefaultSelector()
    def register(self, sock, events, handler):
        handler._reactor = self
        self._sel.register(sock, events, data=handler)
    def unregister(self, sock):
        try: self._sel.unregister(sock)
        except KeyError: pass
    def run_once(self, timeout=1.0):
        for key, _ in self._sel.select(timeout=timeout):
            key.data.handle_read(key)
    def run(self):
        try:
            while True: self.run_once()
        except KeyboardInterrupt:
            pass
        finally:
            self._sel.close()
```

**Key**: `selectors.DefaultSelector` = Synchronous Event Demultiplexer (epoll/kqueue/select). Handler phải non-blocking. `run_once()` cho testing.

---

## 08 — Proactor (asyncio)

```python
import asyncio

# Proactor = asyncio event loop
# Completion Handler = coroutine after `await`
# Async Operation = anything awaited

async def handle_connection(reader: asyncio.StreamReader,
                             writer: asyncio.StreamWriter) -> None:
    addr = writer.get_extra_info("peername")
    try:
        while True:
            data = await reader.read(1024)    # initiate async read
            if not data: break
            # here = Completion Handler — OS completed the read
            writer.write(b"ECHO: " + data)
            await writer.drain()              # initiate async write
    finally:
        writer.close()
        await writer.wait_closed()

async def start_server(host: str, port: int) -> None:
    server = await asyncio.start_server(handle_connection, host, port)
    async with server:
        await server.serve_forever()

# asyncio.run(start_server("127.0.0.1", 9000))

# Run blocking code from async context (Half-Sync/Half-Async)
async def run_blocking(fn, *args):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, fn, *args)
```

**Key**: `await reader.read()` = initiate async op, code after `await` = Completion Handler. `run_in_executor` = offload CPU/blocking work sang thread pool (Half-Sync/Half-Async).

---

## 09 — Monitor Object

```python
import threading
from typing import TypeVar, Generic, Optional

T = TypeVar("T")

class BoundedBuffer(Generic[T]):
    """Monitor Object: thread-safe bounded buffer."""
    def __init__(self, capacity: int):
        self._buf: list[T] = []
        self._cap = capacity
        self._lock = threading.Lock()
        self._not_full = threading.Condition(self._lock)
        self._not_empty = threading.Condition(self._lock)

    def put(self, item: T, timeout: float | None = None) -> bool:
        with self._not_full:
            if not self._not_full.wait_for(lambda: len(self._buf) < self._cap, timeout):
                return False
            self._buf.append(item)
            self._not_empty.notify_all()
            return True

    def get(self, timeout: float | None = None) -> Optional[T]:
        with self._not_empty:
            if not self._not_empty.wait_for(lambda: len(self._buf) > 0, timeout):
                return None
            item = self._buf.pop(0)
            self._not_full.notify_all()
            return item
```

**Key**: `with self._not_full` = acquire monitor lock. `wait_for(lambda)` = Condition Variable. `notify_all()` = wake up waiting threads. Caller không thấy lock.

---

## 10 — Active Object

```python
import threading, queue
from concurrent.futures import Future
from typing import Callable, Any

class MethodRequest:
    def __init__(self, fn: Callable, args, kwargs, future: Future):
        self._fn = fn; self._args = args; self._kwargs = kwargs; self._future = future
    def execute(self):
        if self._future.cancelled(): return
        try: self._future.set_result(self._fn(*self._args, **self._kwargs))
        except Exception as e: self._future.set_exception(e)

class Scheduler(threading.Thread):
    def __init__(self):
        super().__init__(daemon=True); self._q: queue.Queue = queue.Queue()
    def submit(self, req: MethodRequest): self._q.put(req)
    def stop(self): self._q.put(None)
    def run(self):
        while True:
            req = self._q.get()
            if req is None: break
            req.execute()

class ActiveObjectProxy:
    """Template — subclass and add async method wrappers."""
    def __init__(self):
        self._scheduler = Scheduler(); self._scheduler.start()
    def _submit(self, fn: Callable, *args, **kwargs) -> Future:
        f: Future = Future()
        self._scheduler.submit(MethodRequest(fn, args, kwargs, f))
        return f
    def shutdown(self): self._scheduler.stop(); self._scheduler.join()

# Example subclass:
# class MyProxy(ActiveObjectProxy):
#     def __init__(self): super().__init__(); self._servant = MyServant()
#     def my_method(self, x) -> Future:
#         return self._submit(self._servant.my_method, x)
```

**Key**: `_submit()` = enqueue MethodRequest, return Future ngay lập tức. Servant chạy trong Scheduler thread. Client gọi `future.result()` khi cần kết quả.

---

## 11 — Publisher-Subscriber

```python
from collections import defaultdict
from typing import Callable, Any
from dataclasses import dataclass
import threading

@dataclass
class Event:
    topic: str; payload: Any; source: str = ""

Handler = Callable[[Event], None]

class EventBus:
    def __init__(self):
        self._subs: dict[str, list[Handler]] = defaultdict(list)
        self._lock = threading.Lock()

    def subscribe(self, topic: str, handler: Handler) -> None:
        with self._lock: self._subs[topic].append(handler)

    def unsubscribe(self, topic: str, handler: Handler) -> None:
        with self._lock:
            self._subs[topic] = [h for h in self._subs[topic] if h != handler]

    def publish(self, event: Event) -> None:
        with self._lock: handlers = list(self._subs.get(event.topic, []))
        for h in handlers: h(event)   # sync dispatch; use Thread() for async

# Usage:
# bus = EventBus()
# bus.subscribe("order.created", lambda e: print(e.payload))
# bus.publish(Event("order.created", {"id": "ORD-001"}))
```

**Key**: Publisher chỉ gọi `bus.publish()` — không biết subscriber nào. Subscriber chỉ gọi `bus.subscribe()` — không biết publisher nào. Thread-safe với `_lock`.

---

## 12 — Command Processor

```python
from abc import ABC, abstractmethod
from typing import Optional

class Command(ABC):
    @abstractmethod
    def execute(self) -> None: ...
    @abstractmethod
    def undo(self) -> None: ...
    @property
    @abstractmethod
    def description(self) -> str: ...

class CommandProcessor:
    def __init__(self):
        self._history: list[Command] = []
        self._redo_stack: list[Command] = []

    def execute(self, cmd: Command) -> None:
        cmd.execute()
        self._history.append(cmd)
        self._redo_stack.clear()

    def undo(self) -> bool:
        if not self._history: return False
        cmd = self._history.pop()
        cmd.undo()
        self._redo_stack.append(cmd)
        return True

    def redo(self) -> bool:
        if not self._redo_stack: return False
        cmd = self._redo_stack.pop()
        cmd.execute()
        self._history.append(cmd)
        return True

    @property
    def can_undo(self) -> bool: return bool(self._history)
    @property
    def can_redo(self) -> bool: return bool(self._redo_stack)
    def history(self) -> list[str]: return [c.description for c in self._history]

# Macro Command (composite)
class MacroCommand(Command):
    def __init__(self, commands: list[Command], name: str):
        self._cmds = commands; self._name = name
    @property
    def description(self) -> str: return f"Macro({self._name})"
    def execute(self):
        for c in self._cmds: c.execute()
    def undo(self):
        for c in reversed(self._cmds): c.undo()
```

**Key**: `undo()` gọi `cmd.undo()` rồi push lên `_redo_stack`. `redo()` pop từ redo, execute lại. `MacroCommand` = composite command, undo theo thứ tự ngược.

---

## Pattern Combinations — Quick Wiring

### Layers + Repository Pattern
```python
# Infrastructure layer defines abstract repo
class Repo(ABC): ...
class PostgresRepo(Repo): ...
class MongoRepo(Repo): ...
# Domain layer receives via DI
class Service:
    def __init__(self, repo: Repo): self._repo = repo
```

### Reactor + Half-Sync/Half-Async
```python
import asyncio, concurrent.futures

executor = concurrent.futures.ThreadPoolExecutor(max_workers=4)

async def async_handler(data):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, blocking_business_logic, data)
```

### Publisher-Subscriber + Command Processor
```python
class PublishingCommandProcessor(CommandProcessor):
    def __init__(self, bus: EventBus):
        super().__init__(); self._bus = bus
    def execute(self, cmd: Command) -> None:
        super().execute(cmd)
        self._bus.publish(Event("command.executed", {"cmd": cmd.description}))
    def undo(self) -> bool:
        if not self._history: return False
        cmd = self._history[-1]
        result = super().undo()
        if result:
            self._bus.publish(Event("command.undone", {"cmd": cmd.description}))
        return result
```

### Microkernel + Broker
```python
# Microkernel as local service registry
# Broker for cross-process service discovery
class RemotePlugin(PluginInterface):
    def __init__(self, service_name: str, broker: Broker):
        self._name = service_name; self._broker = broker
    @property
    def plugin_id(self): return self._name
    def execute(self, data, context):
        proxy = self._broker.get_proxy(self._name)
        return proxy.process(data)
```

---

## References

- [[02-layers|02. Layers]] — [[03-pipes-and-filters|03. Pipes & Filters]] — [[04-blackboard|04. Blackboard]]
- [[05-broker|05. Broker]] — [[06-mvc-and-pac|06. MVC & PAC]] — [[07-microkernel|07. Microkernel]]
- [[08-reactor-and-proactor|08. Reactor & Proactor]] — [[09-active-object-and-monitor|09. Active Object & Monitor]]
- [[10-publisher-subscriber-command|10. Publisher-Subscriber & Command Processor]]
