---
title: "06. Decorator & Proxy"
tags: [design-patterns, gof, structural, decorator, proxy, lesson-06]
aliases: [Decorator Pattern, Proxy Pattern]
created: 2026-03-24
---

> **Prerequisites**: [[01-foundations|01. Foundations]], [[05-adapter-facade|05. Adapter & Facade]]
> **Objectives**:
> - Hiểu Decorator: thêm hành vi vào object lúc runtime mà không sửa class gốc
> - Hiểu Proxy: kiểm soát truy cập đến object thật qua một đối tượng đại diện
> - Phân biệt Decorator vs Proxy vs Adapter — ba pattern đều "bọc" object nhưng mục đích khác nhau
> - Sử dụng Python decorator syntax (`@`) và hiểu mối quan hệ với GoF Decorator pattern

---

## Phần 1 — Decorator Pattern

### Vấn đề Decorator giải quyết

Bạn có class `TextMessage` với method `send()`. Requirement mới yêu cầu:
- Mã hóa nội dung trước khi gửi
- Nén dữ liệu để tiết kiệm băng thông
- Log mỗi lần gửi

Dùng inheritance: tạo `EncryptedMessage`, `CompressedMessage`, `LoggedMessage`, `EncryptedCompressedMessage`, `EncryptedLoggedMessage`... Combinatorial explosion ngay lập tức.

Decorator giải quyết bằng cách **xếp chồng** (stack) các lớp hành vi lên nhau lúc runtime.

> [!definition] Decorator Pattern
> Gắn thêm trách nhiệm (responsibility) vào một object một cách **linh hoạt**. Decorator cung cấp một giải pháp thay thế cho việc tạo subclass để mở rộng chức năng.
>
> **Ý tưởng cốt lõi**: Decorator implement cùng interface với object gốc, bọc object đó bên trong, thêm hành vi trước/sau khi delegate cho object gốc. Vì cùng interface, có thể xếp chồng nhiều Decorator lên nhau.

### Cấu trúc

```text
Component (interface)          ← interface chung
+ operation()
      ▲
      ├─────────────────────┐
ConcreteComponent        Decorator (abstract)
+ operation()            - _wrapped: Component
                         + operation()   ← gọi _wrapped.operation()
                              ▲
                    ┌─────────┴─────────┐
              DecoratorA          DecoratorB
              + operation()       + operation()
```

Cả `ConcreteComponent` và `Decorator` đều implement `Component` — đây là điểm mấu chốt cho phép xếp chồng.

### Implementation — Message Pipeline

```python
from abc import ABC, abstractmethod
import base64
import zlib


class Message(ABC):
    @abstractmethod
    def send(self, content: str) -> str: ...


class PlainTextMessage(Message):
    def send(self, content: str) -> str:
        print(f"[Sending] {content}")
        return content


class MessageDecorator(Message, ABC):
    def __init__(self, wrapped: Message):
        self._wrapped = wrapped

    @abstractmethod
    def send(self, content: str) -> str: ...


class EncryptionDecorator(MessageDecorator):
    def send(self, content: str) -> str:
        encoded = base64.b64encode(content.encode()).decode()
        print(f"[Encrypt] {content[:20]}... → {encoded[:20]}...")
        return self._wrapped.send(encoded)


class CompressionDecorator(MessageDecorator):
    def send(self, content: str) -> str:
        compressed = zlib.compress(content.encode())
        ratio = len(compressed) / len(content.encode())
        print(f"[Compress] {len(content)} → {len(compressed)} bytes ({ratio:.0%})")
        return self._wrapped.send(compressed.hex())


class LoggingDecorator(MessageDecorator):
    def __init__(self, wrapped: Message, log_level: str = "INFO"):
        super().__init__(wrapped)
        self._level = log_level

    def send(self, content: str) -> str:
        print(f"[Log:{self._level}] Sending message, length={len(content)}")
        result = self._wrapped.send(content)
        print(f"[Log:{self._level}] Message sent successfully")
        return result


plain = PlainTextMessage()

encrypted_only = EncryptionDecorator(plain)

fully_secured = LoggingDecorator(
    EncryptionDecorator(
        CompressionDecorator(plain)
    ),
    log_level="DEBUG"
)

print("=== Plain ===")
plain.send("Hello, World!")

print("\n=== Encrypted ===")
encrypted_only.send("Hello, World!")

print("\n=== Logged + Encrypted + Compressed ===")
fully_secured.send("Hello, World!")
```

Thứ tự wrap quyết định thứ tự thực hiện: `LoggingDecorator` chạy trước, rồi `EncryptionDecorator`, rồi `CompressionDecorator`, cuối cùng `PlainTextMessage.send()`.

### Python `@decorator` và GoF Decorator

Python có cú pháp `@decorator` cho function — đây là cùng ý tưởng nhưng áp dụng cho function, không phải object.

```python
from functools import wraps
import time


def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"[Timer] {func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper


def retry(max_attempts: int = 3, exceptions: tuple = (Exception,)):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    if attempt == max_attempts:
                        raise
                    print(f"[Retry] Attempt {attempt} failed: {e}. Retrying...")
        return wrapper
    return decorator


def log_call(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"[Log] Calling {func.__name__}{args}")
        result = func(*args, **kwargs)
        print(f"[Log] {func.__name__} returned {result}")
        return result
    return wrapper


@timer
@log_call
@retry(max_attempts=3, exceptions=(ValueError,))
def fetch_data(url: str) -> str:
    if "bad" in url:
        raise ValueError(f"Bad URL: {url}")
    return f"data from {url}"


fetch_data("https://api.example.com/data")
```

`@timer @log_call @retry` là xếp chồng decorator — giống hệt `timer(log_call(retry(fetch_data)))`. Đây chính là GoF Decorator pattern áp dụng cho function.

### Worked Example — Data Processing Pipeline

Bài toán thực tế: pipeline xử lý dữ liệu cần validate, transform, và cache kết quả — mỗi bước có thể bật/tắt độc lập.

```python
from abc import ABC, abstractmethod
from typing import Any
import hashlib


class DataProcessor(ABC):
    @abstractmethod
    def process(self, data: list[dict]) -> list[dict]: ...


class BaseProcessor(DataProcessor):
    def process(self, data: list[dict]) -> list[dict]:
        print(f"[Base] Processing {len(data)} records")
        return data


class ProcessorDecorator(DataProcessor, ABC):
    def __init__(self, wrapped: DataProcessor):
        self._wrapped = wrapped

    @abstractmethod
    def process(self, data: list[dict]) -> list[dict]: ...


class ValidationDecorator(ProcessorDecorator):
    def __init__(self, wrapped: DataProcessor, required_fields: list[str]):
        super().__init__(wrapped)
        self._required = required_fields

    def process(self, data: list[dict]) -> list[dict]:
        valid = []
        invalid_count = 0
        for record in data:
            if all(field in record for field in self._required):
                valid.append(record)
            else:
                invalid_count += 1
        if invalid_count:
            print(f"[Validate] Dropped {invalid_count} invalid records")
        return self._wrapped.process(valid)


class NormalizationDecorator(ProcessorDecorator):
    def process(self, data: list[dict]) -> list[dict]:
        normalized = []
        for record in data:
            norm = {k.lower().strip(): (v.strip() if isinstance(v, str) else v)
                    for k, v in record.items()}
            normalized.append(norm)
        print(f"[Normalize] Normalized {len(normalized)} records")
        return self._wrapped.process(normalized)


class CachingDecorator(ProcessorDecorator):
    def __init__(self, wrapped: DataProcessor):
        super().__init__(wrapped)
        self._cache: dict[str, list[dict]] = {}

    def _hash(self, data: list[dict]) -> str:
        return hashlib.md5(str(data).encode()).hexdigest()[:8]

    def process(self, data: list[dict]) -> list[dict]:
        key = self._hash(data)
        if key in self._cache:
            print(f"[Cache] HIT for key={key}")
            return self._cache[key]
        print(f"[Cache] MISS for key={key}, processing...")
        result = self._wrapped.process(data)
        self._cache[key] = result
        return result


pipeline = CachingDecorator(
    ValidationDecorator(
        NormalizationDecorator(BaseProcessor()),
        required_fields=["name", "email"]
    )
)

records = [
    {"Name": "Alice ", "Email": "alice@example.com", "Age": 30},
    {"Name": "Bob", "Email": "bob@example.com"},
    {"Name": "Incomplete"},
]

print("=== First run ===")
result = pipeline.process(records)

print("\n=== Second run (same data) ===")
result = pipeline.process(records)
```

---

## Phần 2 — Proxy Pattern

### Vấn đề Proxy giải quyết

Đôi khi bạn cần kiểm soát cách truy cập đến một object: object khởi tạo tốn kém (lazy init), cần log mọi truy cập (audit), cần kiểm tra quyền trước khi cho phép thực hiện, hoặc object nằm ở server từ xa.

> [!definition] Proxy Pattern
> Cung cấp một **đối tượng thay thế** (surrogate) để kiểm soát truy cập đến object thật. Proxy implement cùng interface với object thật, cho phép client dùng proxy như dùng object thật.
>
> **Ý tưởng cốt lõi**: Client không biết đang nói chuyện với Proxy hay Real Subject — Proxy có thể làm bất cứ điều gì trước/sau khi chuyển tiếp (hoặc từ chối chuyển tiếp) request.

### Bốn loại Proxy phổ biến

- **Virtual Proxy** — trì hoãn khởi tạo object tốn kém (lazy initialization)
- **Protection Proxy** — kiểm soát quyền truy cập
- **Logging/Audit Proxy** — ghi lại mọi thao tác
- **Remote Proxy** — đại diện cho object ở địa chỉ bộ nhớ khác (network, process)

### Implementation — Virtual Proxy (Lazy Init)

```python
from abc import ABC, abstractmethod
import time


class ImageRenderer(ABC):
    @abstractmethod
    def render(self) -> str: ...

    @abstractmethod
    def get_dimensions(self) -> tuple[int, int]: ...


class HighResImage(ImageRenderer):
    def __init__(self, filename: str):
        self._filename = filename
        print(f"[HighResImage] Loading {filename} from disk...")
        time.sleep(0.1)
        self._data = f"<binary data of {filename}>"
        self._width = 3840
        self._height = 2160
        print(f"[HighResImage] Loaded: {filename}")

    def render(self) -> str:
        return f"Rendering {self._filename} ({self._width}x{self._height})"

    def get_dimensions(self) -> tuple[int, int]:
        return self._width, self._height


class LazyImageProxy(ImageRenderer):
    def __init__(self, filename: str):
        self._filename = filename
        self._real_image: HighResImage | None = None

    def _load_if_needed(self):
        if self._real_image is None:
            self._real_image = HighResImage(self._filename)

    def render(self) -> str:
        self._load_if_needed()
        return self._real_image.render()

    def get_dimensions(self) -> tuple[int, int]:
        self._load_if_needed()
        return self._real_image.get_dimensions()


print("=== Without proxy: loads immediately ===")
img1 = HighResImage("photo_4k.jpg")
print(f"Width: {img1.get_dimensions()[0]}px")

print("\n=== With proxy: loads only when needed ===")
proxy = LazyImageProxy("photo_4k.jpg")
print("Proxy created — no loading yet")
print(f"Width: {proxy.get_dimensions()[0]}px")
print(f"Render: {proxy.render()}")
```

### Implementation — Protection Proxy

```python
from abc import ABC, abstractmethod
from enum import Enum


class Permission(Enum):
    READ = "read"
    WRITE = "write"
    DELETE = "delete"
    ADMIN = "admin"


class FileSystem(ABC):
    @abstractmethod
    def read(self, path: str) -> str: ...

    @abstractmethod
    def write(self, path: str, content: str) -> bool: ...

    @abstractmethod
    def delete(self, path: str) -> bool: ...


class RealFileSystem(FileSystem):
    def read(self, path: str) -> str:
        return f"Content of {path}"

    def write(self, path: str, content: str) -> bool:
        print(f"[FS] Writing to {path}")
        return True

    def delete(self, path: str) -> bool:
        print(f"[FS] Deleting {path}")
        return True


class FileSystemProxy(FileSystem):
    def __init__(self, real_fs: RealFileSystem, user_permissions: set[Permission]):
        self._real = real_fs
        self._permissions = user_permissions

    def _check(self, perm: Permission, action: str):
        if perm not in self._permissions:
            raise PermissionError(
                f"Access denied: '{action}' requires {perm.value} permission"
            )

    def read(self, path: str) -> str:
        self._check(Permission.READ, "read")
        return self._real.read(path)

    def write(self, path: str, content: str) -> bool:
        self._check(Permission.WRITE, "write")
        return self._real.write(path, content)

    def delete(self, path: str) -> bool:
        self._check(Permission.DELETE, "delete")
        return self._real.delete(path)


real_fs = RealFileSystem()

admin_proxy = FileSystemProxy(real_fs, {Permission.READ, Permission.WRITE, Permission.DELETE})
readonly_proxy = FileSystemProxy(real_fs, {Permission.READ})

print(admin_proxy.read("/etc/config.yaml"))
admin_proxy.write("/etc/config.yaml", "new content")

print(readonly_proxy.read("/etc/config.yaml"))

try:
    readonly_proxy.delete("/etc/config.yaml")
except PermissionError as e:
    print(f"Error: {e}")
```

### Worked Example — Logging Proxy với Audit Trail

```python
from abc import ABC, abstractmethod
from datetime import datetime
from dataclasses import dataclass, field


@dataclass
class AuditEntry:
    timestamp: str
    method: str
    args: tuple
    result: str
    success: bool


class DatabaseRepository(ABC):
    @abstractmethod
    def find_by_id(self, record_id: int) -> dict | None: ...

    @abstractmethod
    def save(self, data: dict) -> int: ...

    @abstractmethod
    def delete(self, record_id: int) -> bool: ...


class ConcreteRepository(DatabaseRepository):
    def __init__(self):
        self._store: dict[int, dict] = {
            1: {"id": 1, "name": "Alice", "role": "admin"},
            2: {"id": 2, "name": "Bob", "role": "user"},
        }
        self._next_id = 3

    def find_by_id(self, record_id: int) -> dict | None:
        return self._store.get(record_id)

    def save(self, data: dict) -> int:
        record_id = self._next_id
        self._store[record_id] = {**data, "id": record_id}
        self._next_id += 1
        return record_id

    def delete(self, record_id: int) -> bool:
        if record_id in self._store:
            del self._store[record_id]
            return True
        return False


class AuditProxy(DatabaseRepository):
    def __init__(self, real_repo: DatabaseRepository):
        self._real = real_repo
        self._audit_log: list[AuditEntry] = []

    def _log(self, method: str, args: tuple, result, success: bool):
        entry = AuditEntry(
            timestamp=datetime.now().isoformat(),
            method=method,
            args=args,
            result=str(result),
            success=success,
        )
        self._audit_log.append(entry)
        status = "OK" if success else "FAIL"
        print(f"[Audit] {status} | {method}{args} → {result}")

    def find_by_id(self, record_id: int) -> dict | None:
        result = self._real.find_by_id(record_id)
        self._log("find_by_id", (record_id,), result, result is not None)
        return result

    def save(self, data: dict) -> int:
        result = self._real.save(data)
        self._log("save", (data,), result, True)
        return result

    def delete(self, record_id: int) -> bool:
        result = self._real.delete(record_id)
        self._log("delete", (record_id,), result, result)
        return result

    def get_audit_trail(self) -> list[AuditEntry]:
        return list(self._audit_log)


repo = AuditProxy(ConcreteRepository())

repo.find_by_id(1)
repo.find_by_id(99)
repo.save({"name": "Carol", "role": "user"})
repo.delete(2)

print(f"\nAudit log has {len(repo.get_audit_trail())} entries")
```

---

## So sánh Decorator, Proxy, và Adapter

| Tiêu chí | Decorator | Proxy | Adapter |
|----------|-----------|-------|---------|
| **Mục đích** | Thêm hành vi mới | Kiểm soát truy cập | Chuyển đổi interface |
| **Interface** | Giữ nguyên interface gốc | Giữ nguyên interface gốc | Tạo interface mới (target) |
| **Object bên trong** | Có thể xếp chồng nhiều lớp | Thường một real subject | Một adaptee |
| **Client biết không** | Client không biết object bị wrap | Client không biết đang dùng proxy | Client không biết về adaptee |
| **Khi nào dùng** | Thêm logging, caching, encryption | Lazy init, access control, audit | Tích hợp API/lib không tương thích |

---

## Summary / Key Takeaways

- **Decorator** thêm hành vi bằng cách xếp chồng các wrapper — cùng interface cho phép stack tùy ý. Python `@decorator` là cùng ý tưởng áp dụng cho function.
- Thứ tự xếp chồng Decorator quan trọng — ảnh hưởng đến thứ tự thực hiện.
- **Proxy** kiểm soát truy cập đến real subject — bốn loại phổ biến: Virtual (lazy init), Protection (permissions), Logging/Audit, Remote.
- Cả Decorator lẫn Proxy đều giữ nguyên interface của object gốc — đây là điểm khác biệt chính với Adapter.
- Python `__getattr__` và `functools.wraps` là công cụ hữu ích khi implement Proxy và Decorator.

---

## References

- Gamma et al. — *Design Patterns*, Ch. 4: Decorator tr.175, Proxy tr.207
- Refactoring.Guru — Decorator: https://refactoring.guru/design-patterns/decorator/python/example
- Refactoring.Guru — Proxy: https://refactoring.guru/design-patterns/proxy/python/example
- Python `functools.wraps` — https://docs.python.org/3/library/functools.html#functools.wraps
