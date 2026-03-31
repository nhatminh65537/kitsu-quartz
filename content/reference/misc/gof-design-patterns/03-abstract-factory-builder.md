---
title: "03. Abstract Factory & Builder"
tags: [design-patterns, gof, creational, abstract-factory, builder, lesson-03]
aliases: [Abstract Factory, Builder Pattern]
created: 2026-03-24
---

> **Prerequisites**: [[01-foundations|01. Foundations]], [[02-singleton-factory-method|02. Singleton & Factory Method]]
> **Objectives**:
> - Hiểu Abstract Factory: tạo *họ* (family) các object có liên quan mà không gắn với class cụ thể
> - Hiểu Builder: xây dựng object phức tạp từng bước, tách rời construction khỏi representation
> - Phân biệt rõ Abstract Factory vs Factory Method vs Builder — ba pattern dễ nhầm nhất trong nhóm Creational
> - Nhận ra khi nào nên dùng cái nào thông qua bài toán thực tế

---

## Phần 1 — Abstract Factory Pattern

### Vấn đề Abstract Factory giải quyết

Giả sử bạn xây dựng UI framework hỗ trợ nhiều hệ điều hành: Windows và macOS. Mỗi hệ điều hành có *bộ widget riêng*: Button, Checkbox, TextInput — nhưng cùng interface. Yêu cầu: toàn bộ UI trong một lần chạy chỉ dùng *một bộ* nhất quán — không được trộn lẫn Button Windows với Checkbox macOS.

Nếu dùng Factory Method, ta phải tạo separate factory cho từng widget. Khi thêm hệ điều hành mới (Linux), ta phải thêm factory cho *từng loại* widget. Không có gì đảm bảo tính nhất quán (consistency) của cả bộ.

Abstract Factory giải quyết điều này bằng cách nhóm các factory liên quan vào **một interface duy nhất**.

> [!definition] Abstract Factory Pattern
> Cung cấp một interface để tạo ra **họ các object có liên quan** (family of related objects) mà **không chỉ định concrete class** của chúng.
>
> **Ý tưởng cốt lõi**: Thay vì factory cho từng loại product riêng lẻ, ta có một *factory of factories* — mỗi concrete factory tạo toàn bộ một bộ product nhất quán.

### Cấu trúc

Bốn thành phần chính:

- **AbstractFactory** — interface khai báo method tạo từng loại product (create_button, create_checkbox, ...)
- **ConcreteFactory** — implement AbstractFactory cho một *variant* cụ thể (WindowsFactory, MacFactory)
- **AbstractProduct** — interface cho từng loại product (Button, Checkbox)
- **ConcreteProduct** — implementation cụ thể của product (WindowsButton, MacButton)

```text
AbstractFactory                     AbstractProductA
+ create_product_a() → AbstractProductA     ▲
+ create_product_b() → AbstractProductB     │
        ▲                           ┌───────┴───────┐
        │                    ConcreteProductA1  ConcreteProductA2
   ┌────┴────┐
ConcreteFactory1  ConcreteFactory2
```

### Implementation — Cross-platform UI

```python
from abc import ABC, abstractmethod


class Button(ABC):
    @abstractmethod
    def render(self) -> str: ...

    @abstractmethod
    def on_click(self, handler) -> None: ...


class Checkbox(ABC):
    @abstractmethod
    def render(self) -> str: ...

    @abstractmethod
    def toggle(self) -> bool: ...


class WindowsButton(Button):
    def render(self) -> str:
        return "<WinButton style='flat'>"

    def on_click(self, handler) -> None:
        print(f"[Windows] Click handler registered: {handler.__name__}")


class MacButton(Button):
    def render(self) -> str:
        return "<MacButton style='rounded'>"

    def on_click(self, handler) -> None:
        print(f"[macOS] Click handler registered: {handler.__name__}")


class WindowsCheckbox(Checkbox):
    def __init__(self):
        self._checked = False

    def render(self) -> str:
        state = "☑" if self._checked else "☐"
        return f"<WinCheckbox>{state}</WinCheckbox>"

    def toggle(self) -> bool:
        self._checked = not self._checked
        return self._checked


class MacCheckbox(Checkbox):
    def __init__(self):
        self._checked = False

    def render(self) -> str:
        state = "✓" if self._checked else "○"
        return f"<MacCheckbox>{state}</MacCheckbox>"

    def toggle(self) -> bool:
        self._checked = not self._checked
        return self._checked


class GUIFactory(ABC):
    @abstractmethod
    def create_button(self) -> Button: ...

    @abstractmethod
    def create_checkbox(self) -> Checkbox: ...


class WindowsFactory(GUIFactory):
    def create_button(self) -> Button:
        return WindowsButton()

    def create_checkbox(self) -> Checkbox:
        return WindowsCheckbox()


class MacFactory(GUIFactory):
    def create_button(self) -> Button:
        return MacButton()

    def create_checkbox(self) -> Checkbox:
        return MacCheckbox()


class Application:
    def __init__(self, factory: GUIFactory):
        self._factory = factory
        self._button = factory.create_button()
        self._checkbox = factory.create_checkbox()

    def render(self):
        print(self._button.render())
        print(self._checkbox.render())


def get_factory(os_name: str) -> GUIFactory:
    factories = {
        "windows": WindowsFactory(),
        "mac": MacFactory(),
    }
    return factories.get(os_name, WindowsFactory())


app = Application(get_factory("mac"))
app.render()
```

`Application` không biết OS nào đang chạy — nó chỉ dùng `GUIFactory` abstract. Khi thêm Linux, ta thêm `LinuxFactory` + `LinuxButton` + `LinuxCheckbox` mà không sửa `Application` hay `GUIFactory`.

### Worked Example — Database với Multiple Backends

Bài toán thực tế: hệ thống cần support PostgreSQL (production) và SQLite (testing). Mỗi backend có `Connection` và `QueryBuilder` riêng nhưng phải hoạt động nhất quán với nhau.

```python
from abc import ABC, abstractmethod


class Connection(ABC):
    @abstractmethod
    def execute(self, sql: str, params: tuple = ()) -> list: ...

    @abstractmethod
    def close(self) -> None: ...


class QueryBuilder(ABC):
    @abstractmethod
    def select(self, table: str, columns: list[str]) -> str: ...

    @abstractmethod
    def insert(self, table: str, data: dict) -> str: ...


class PostgreSQLConnection(Connection):
    def __init__(self, dsn: str):
        self._dsn = dsn
        print(f"[PG] Connected to {dsn}")

    def execute(self, sql: str, params: tuple = ()) -> list:
        print(f"[PG] {sql} params={params}")
        return []

    def close(self) -> None:
        print("[PG] Connection closed")


class PostgreSQLQueryBuilder(QueryBuilder):
    def select(self, table: str, columns: list[str]) -> str:
        cols = ", ".join(columns)
        return f"SELECT {cols} FROM {table}"

    def insert(self, table: str, data: dict) -> str:
        cols = ", ".join(data.keys())
        placeholders = ", ".join(f"%s" for _ in data)
        return f"INSERT INTO {table} ({cols}) VALUES ({placeholders})"


class SQLiteConnection(Connection):
    def __init__(self, path: str):
        self._path = path
        print(f"[SQLite] Opened {path}")

    def execute(self, sql: str, params: tuple = ()) -> list:
        print(f"[SQLite] {sql} params={params}")
        return []

    def close(self) -> None:
        print("[SQLite] Closed")


class SQLiteQueryBuilder(QueryBuilder):
    def select(self, table: str, columns: list[str]) -> str:
        cols = ", ".join(columns)
        return f"SELECT {cols} FROM \"{table}\""

    def insert(self, table: str, data: dict) -> str:
        cols = ", ".join(data.keys())
        placeholders = ", ".join("?" for _ in data)
        return f"INSERT INTO \"{table}\" ({cols}) VALUES ({placeholders})"


class DatabaseFactory(ABC):
    @abstractmethod
    def create_connection(self) -> Connection: ...

    @abstractmethod
    def create_query_builder(self) -> QueryBuilder: ...


class PostgreSQLFactory(DatabaseFactory):
    def __init__(self, dsn: str):
        self._dsn = dsn

    def create_connection(self) -> Connection:
        return PostgreSQLConnection(self._dsn)

    def create_query_builder(self) -> QueryBuilder:
        return PostgreSQLQueryBuilder()


class SQLiteFactory(DatabaseFactory):
    def __init__(self, path: str = ":memory:"):
        self._path = path

    def create_connection(self) -> Connection:
        return SQLiteConnection(self._path)

    def create_query_builder(self) -> QueryBuilder:
        return SQLiteQueryBuilder()


class UserRepository:
    def __init__(self, factory: DatabaseFactory):
        self._conn = factory.create_connection()
        self._qb = factory.create_query_builder()

    def find_all(self) -> list:
        sql = self._qb.select("users", ["id", "name", "email"])
        return self._conn.execute(sql)

    def create(self, name: str, email: str) -> None:
        sql = self._qb.insert("users", {"name": name, "email": email})
        self._conn.execute(sql, (name, email))


prod_factory = PostgreSQLFactory("postgresql://localhost/mydb")
repo = UserRepository(prod_factory)
repo.find_all()
repo.create("Alice", "alice@example.com")

test_factory = SQLiteFactory(":memory:")
test_repo = UserRepository(test_factory)
test_repo.find_all()
```

`UserRepository` hoàn toàn không biết đang dùng PostgreSQL hay SQLite — dependency injection qua factory đảm bảo sự nhất quán.

### Trade-offs của Abstract Factory

**Ưu điểm:**
- Đảm bảo tính *nhất quán* (consistency) giữa các product trong cùng một family
- Tách biệt client code khỏi concrete product class — dễ swap toàn bộ family
- Tuân thủ OCP và DIP

**Nhược điểm:**
- Thêm loại product mới (ví dụ: thêm `TextInput`) yêu cầu sửa *tất cả* ConcreteFactory — vi phạm OCP theo chiều ngang
- Nhiều class, interface → code phức tạp hơn

---

## Phần 2 — Builder Pattern

### Vấn đề Builder giải quyết

Constructor với 10 tham số là một code smell kinh điển. Xét class `Pizza`:

```python
pizza = Pizza("large", "thin", True, True, False, True, ["pepperoni", "mushroom"], "tomato", True)
```

Không ai biết tham số thứ 3 là gì nếu không nhìn vào định nghĩa. Giải pháp naive là tạo subclass cho từng loại pizza — nhưng số lượng subclass sẽ bùng nổ theo combinatorial explosion.

> [!definition] Builder Pattern
> Tách rời quá trình **xây dựng** (construction) một object phức tạp khỏi **biểu diễn** (representation) của nó, cho phép cùng một quy trình xây dựng tạo ra các biểu diễn khác nhau.
>
> **Ý tưởng cốt lõi**: Xây dựng object từng bước qua chuỗi method calls, thay vì truyền hàng chục tham số vào constructor.

### Cấu trúc

Ba thành phần chính (Director là optional):

- **Builder** — interface khai báo các bước xây dựng
- **ConcreteBuilder** — implement từng bước, giữ trạng thái trung gian, tạo ra product
- **Product** — object phức tạp được xây dựng
- **Director** (optional) — định nghĩa thứ tự gọi các bước builder để tạo ra các "recipe" cụ thể

### Implementation — Query Builder

Bài toán: xây dựng SQL query từng bước, tùy vào logic cần gì.

```python
from __future__ import annotations
from dataclasses import dataclass, field


@dataclass
class Query:
    table: str
    columns: list[str] = field(default_factory=list)
    conditions: list[str] = field(default_factory=list)
    order_by: str | None = None
    limit: int | None = None
    offset: int | None = None

    def to_sql(self) -> str:
        cols = ", ".join(self.columns) if self.columns else "*"
        sql = f"SELECT {cols} FROM {self.table}"
        if self.conditions:
            sql += " WHERE " + " AND ".join(self.conditions)
        if self.order_by:
            sql += f" ORDER BY {self.order_by}"
        if self.limit is not None:
            sql += f" LIMIT {self.limit}"
        if self.offset is not None:
            sql += f" OFFSET {self.offset}"
        return sql


class QueryBuilder:
    def __init__(self, table: str):
        self._query = Query(table=table)

    def select(self, *columns: str) -> QueryBuilder:
        self._query.columns = list(columns)
        return self

    def where(self, condition: str) -> QueryBuilder:
        self._query.conditions.append(condition)
        return self

    def order_by(self, column: str) -> QueryBuilder:
        self._query.order_by = column
        return self

    def limit(self, n: int) -> QueryBuilder:
        self._query.limit = n
        return self

    def offset(self, n: int) -> QueryBuilder:
        self._query.offset = n
        return self

    def build(self) -> Query:
        return self._query


query = (
    QueryBuilder("users")
    .select("id", "name", "email")
    .where("active = true")
    .where("age >= 18")
    .order_by("created_at DESC")
    .limit(20)
    .offset(40)
    .build()
)

print(query.to_sql())
```

Chuỗi method call trả về `self` — kỹ thuật này gọi là **method chaining** hay **fluent interface**.

### Worked Example — Report Builder với Director

Bài toán thực tế: hệ thống tạo nhiều loại report (PDF, HTML, CSV) từ cùng data. Director đóng gói các "công thức" tạo report khác nhau.

```python
from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class Report:
    title: str = ""
    header: str = ""
    body: str = ""
    footer: str = ""
    metadata: dict = field(default_factory=dict)

    def __str__(self) -> str:
        parts = [f"=== {self.title} ==="]
        if self.header:
            parts.append(f"Header: {self.header}")
        parts.append(f"Body: {self.body}")
        if self.footer:
            parts.append(f"Footer: {self.footer}")
        if self.metadata:
            parts.append(f"Meta: {self.metadata}")
        return "\n".join(parts)


class ReportBuilder(ABC):
    @abstractmethod
    def set_title(self, title: str) -> None: ...

    @abstractmethod
    def add_header(self, content: str) -> None: ...

    @abstractmethod
    def add_body(self, content: str) -> None: ...

    @abstractmethod
    def add_footer(self, content: str) -> None: ...

    @abstractmethod
    def add_metadata(self, key: str, value: str) -> None: ...

    @abstractmethod
    def get_result(self) -> Report: ...

    def reset(self) -> None:
        self._report = Report()


class PDFReportBuilder(ReportBuilder):
    def __init__(self):
        self._report = Report()

    def set_title(self, title: str) -> None:
        self._report.title = f"[PDF] {title}"

    def add_header(self, content: str) -> None:
        self._report.header = f"<pdf-header>{content}</pdf-header>"

    def add_body(self, content: str) -> None:
        self._report.body = f"<pdf-body>{content}</pdf-body>"

    def add_footer(self, content: str) -> None:
        self._report.footer = f"<pdf-footer>{content}</pdf-footer>"

    def add_metadata(self, key: str, value: str) -> None:
        self._report.metadata[key] = value

    def get_result(self) -> Report:
        result = self._report
        self._report = Report()
        return result


class HTMLReportBuilder(ReportBuilder):
    def __init__(self):
        self._report = Report()

    def set_title(self, title: str) -> None:
        self._report.title = f"<h1>{title}</h1>"

    def add_header(self, content: str) -> None:
        self._report.header = f"<header>{content}</header>"

    def add_body(self, content: str) -> None:
        self._report.body = f"<main>{content}</main>"

    def add_footer(self, content: str) -> None:
        self._report.footer = f"<footer>{content}</footer>"

    def add_metadata(self, key: str, value: str) -> None:
        self._report.metadata[key] = f'<meta name="{key}" content="{value}">'

    def get_result(self) -> Report:
        result = self._report
        self._report = Report()
        return result


class ReportDirector:
    def __init__(self, builder: ReportBuilder):
        self._builder = builder

    def change_builder(self, builder: ReportBuilder) -> None:
        self._builder = builder

    def make_minimal_report(self, title: str, content: str) -> Report:
        self._builder.set_title(title)
        self._builder.add_body(content)
        return self._builder.get_result()

    def make_full_report(self, title: str, content: str, author: str) -> Report:
        self._builder.set_title(title)
        self._builder.add_header(f"Author: {author}")
        self._builder.add_body(content)
        self._builder.add_footer("Confidential")
        self._builder.add_metadata("author", author)
        self._builder.add_metadata("generated_by", "ReportSystem v2")
        return self._builder.get_result()


pdf_builder = PDFReportBuilder()
director = ReportDirector(pdf_builder)

pdf_report = director.make_full_report(
    "Q1 Sales Summary", "Revenue: $1.2M, up 15% YoY", "Alice"
)
print(pdf_report)
print()

html_builder = HTMLReportBuilder()
director.change_builder(html_builder)

html_report = director.make_minimal_report("Quick Note", "Meeting at 3pm")
print(html_report)
```

Director không biết gì về PDF hay HTML — nó chỉ biết chuỗi bước cần gọi. Swap builder là swap toàn bộ output format.

### Trade-offs của Builder

**Ưu điểm:**
- Tránh "telescoping constructor" — constructor với quá nhiều tham số
- Kiểm soát từng bước xây dựng, dễ validate từng field
- Cùng Director, khác Builder → khác kết quả
- Fluent interface (method chaining) cho code dễ đọc

**Nhược điểm:**
- Thêm boilerplate — cần Builder class riêng cho mỗi Product phức tạp
- Nếu product đơn giản, Builder là over-engineering

> [!note] Builder trong Python thực tế
> Python có `dataclasses` và `keyword arguments` giúp tránh một phần vấn đề constructor phức tạp. Builder pattern hữu dụng nhất khi xây dựng object có nhiều bước phụ thuộc thứ tự, hoặc khi cần Director để đóng gói các "công thức" tạo object.

---

## So sánh ba Creational Pattern đã học

| | Factory Method | Abstract Factory | Builder |
|---|---|---|---|
| **Tạo ra** | Một loại product | Một family các product liên quan | Một product phức tạp từng bước |
| **Cơ chế** | Override method | Swap toàn bộ factory | Chuỗi method calls |
| **Vấn đề giải quyết** | Tách loại object khỏi client | Đảm bảo nhất quán giữa các product | Tránh constructor phức tạp |
| **Khi nào dùng** | Không biết trước cần tạo loại nào | Cần trao đổi giữa các *họ* product | Object cần nhiều bước xây dựng |

---

## Summary / Key Takeaways

- **Abstract Factory** nhóm nhiều Factory Method liên quan vào một interface — đảm bảo toàn bộ family product nhất quán với nhau.
- Thêm product mới vào Abstract Factory là điểm yếu — phải sửa tất cả ConcreteFactory.
- **Builder** tách construction khỏi representation — cùng Director tạo ra các product khác nhau tùy Builder.
- Fluent interface (method chaining trả về `self`) là idiom phổ biến khi implement Builder trong Python.
- Director là optional — khi client tự gọi từng bước builder, không cần Director.

---

## References

- Gamma et al. — *Design Patterns*, Ch. 3: Abstract Factory tr.87, Builder tr.97
- Refactoring.Guru — Abstract Factory: https://refactoring.guru/design-patterns/abstract-factory/python/example
- Refactoring.Guru — Builder: https://refactoring.guru/design-patterns/builder/python/example
- Python `dataclasses` — https://docs.python.org/3/library/dataclasses.html
