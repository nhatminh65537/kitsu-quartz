---
title: "09. Strategy & Template Method"
tags: [design-patterns, gof, behavioral, strategy, template-method, lesson-09]
aliases: [Strategy Pattern, Template Method Pattern]
created: 2026-03-24
---

> **Prerequisites**: [[01-foundations|01. Foundations — SOLID & OOP nâng cao]]
> **Objectives**:
> - Hiểu Strategy: đóng gói thuật toán vào object có thể hoán đổi nhau lúc runtime
> - Hiểu Template Method: định nghĩa khung thuật toán trong base class, để subclass điền vào chi tiết
> - Phân biệt hai pattern: Strategy dùng **composition** (linh hoạt), Template Method dùng **inheritance** (ít linh hoạt hơn nhưng ít boilerplate)
> - Nhận ra đây là hai trong những Behavioral pattern phổ biến và nền tảng nhất

---

## Phần 1 — Strategy Pattern

### Vấn đề Strategy giải quyết

Bạn xây dựng hệ thống sắp xếp: ban đầu chỉ cần bubble sort, sau đó thêm quick sort, merge sort, rồi cần chọn thuật toán tùy theo kích thước dữ liệu. Nhét tất cả vào một class với `if/elif` cho từng thuật toán vi phạm OCP — mỗi thuật toán mới phải sửa class gốc.

> [!definition] Strategy Pattern
> Định nghĩa một **họ thuật toán** (family of algorithms), đóng gói từng thuật toán, và làm cho chúng có thể **hoán đổi** nhau. Strategy cho phép thuật toán thay đổi độc lập với client sử dụng nó.
>
> **Ý tưởng cốt lõi**: Tách phần "làm thế nào" (algorithm) ra khỏi phần "cần làm gì" (context), giao tiếp qua interface chung.

### Cấu trúc

```text
Context
- _strategy: Strategy
+ set_strategy(s: Strategy)
+ execute_strategy()            ← delegate tới _strategy
      │
      ▼
Strategy (interface / ABC)
+ execute(data) → result
      ▲
      ├──────────────┬──────────────┐
ConcreteStrategyA  ConcreteStrategyB  ConcreteStrategyC
```

Context không biết gì về concrete strategy — chỉ gọi `strategy.execute()`.

### Implementation — Sorting Strategies

```python
from __future__ import annotations
from abc import ABC, abstractmethod
import time


class SortStrategy(ABC):
    @abstractmethod
    def sort(self, data: list) -> list: ...

    @property
    def name(self) -> str:
        return self.__class__.__name__


class BubbleSortStrategy(SortStrategy):
    def sort(self, data: list) -> list:
        arr = data.copy()
        n = len(arr)
        for i in range(n):
            for j in range(n - i - 1):
                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
        return arr


class QuickSortStrategy(SortStrategy):
    def sort(self, data: list) -> list:
        if len(data) <= 1:
            return data.copy()
        pivot = data[len(data) // 2]
        left = [x for x in data if x < pivot]
        mid = [x for x in data if x == pivot]
        right = [x for x in data if x > pivot]
        return self.sort(left) + mid + self.sort(right)


class BuiltinSortStrategy(SortStrategy):
    def sort(self, data: list) -> list:
        return sorted(data)


class Sorter:
    def __init__(self, strategy: SortStrategy):
        self._strategy = strategy

    def set_strategy(self, strategy: SortStrategy) -> None:
        self._strategy = strategy

    def sort(self, data: list) -> list:
        start = time.perf_counter()
        result = self._strategy.sort(data)
        elapsed = time.perf_counter() - start
        print(f"[{self._strategy.name}] Sorted {len(data)} items in {elapsed:.6f}s")
        return result


import random
small_data = random.sample(range(100), 20)
large_data = random.sample(range(10_000), 5_000)

sorter = Sorter(BubbleSortStrategy())
sorter.sort(small_data)

sorter.set_strategy(QuickSortStrategy())
sorter.sort(large_data)

sorter.set_strategy(BuiltinSortStrategy())
sorter.sort(large_data)
```

### Strategy tự chọn thuật toán (adaptive strategy)

```python
class AdaptiveSortStrategy(SortStrategy):
    _THRESHOLD = 50

    def sort(self, data: list) -> list:
        if len(data) <= self._THRESHOLD:
            strategy = BubbleSortStrategy()
        else:
            strategy = BuiltinSortStrategy()
        print(f"[Adaptive] n={len(data)} → using {strategy.name}")
        return strategy.sort(data)


sorter.set_strategy(AdaptiveSortStrategy())
sorter.sort(small_data)
sorter.sort(large_data)
```

### Worked Example — Payment Processing

Bài toán thực tế: checkout system cần hỗ trợ nhiều phương thức thanh toán, mỗi loại có quy trình validate và process khác nhau.

```python
from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class PaymentDetails:
    amount: float
    currency: str
    metadata: dict


@dataclass
class PaymentResult:
    success: bool
    transaction_id: str
    message: str


class PaymentStrategy(ABC):
    @abstractmethod
    def validate(self, details: PaymentDetails) -> tuple[bool, str]: ...

    @abstractmethod
    def process(self, details: PaymentDetails) -> PaymentResult: ...

    @property
    @abstractmethod
    def name(self) -> str: ...


class CreditCardStrategy(PaymentStrategy):
    @property
    def name(self) -> str:
        return "Credit Card"

    def validate(self, details: PaymentDetails) -> tuple[bool, str]:
        card = details.metadata.get("card_number", "")
        if len(card.replace(" ", "")) != 16:
            return False, "Invalid card number"
        if details.amount > 10_000:
            return False, "Amount exceeds credit card limit"
        return True, "OK"

    def process(self, details: PaymentDetails) -> PaymentResult:
        print(f"[CreditCard] Charging {details.amount} {details.currency}")
        return PaymentResult(True, "cc_txn_001", "Charged successfully")


class CryptoStrategy(PaymentStrategy):
    SUPPORTED = {"BTC", "ETH", "USDT"}

    @property
    def name(self) -> str:
        return "Cryptocurrency"

    def validate(self, details: PaymentDetails) -> tuple[bool, str]:
        coin = details.metadata.get("coin", "")
        if coin not in self.SUPPORTED:
            return False, f"Unsupported coin. Supported: {self.SUPPORTED}"
        wallet = details.metadata.get("wallet_address", "")
        if not wallet.startswith("0x") and not wallet.startswith("bc1"):
            return False, "Invalid wallet address"
        return True, "OK"

    def process(self, details: PaymentDetails) -> PaymentResult:
        coin = details.metadata["coin"]
        print(f"[Crypto] Broadcasting {details.amount} {coin} transaction")
        return PaymentResult(True, "crypto_txn_abc123", f"Transaction broadcast on {coin} network")


class BankTransferStrategy(PaymentStrategy):
    @property
    def name(self) -> str:
        return "Bank Transfer"

    def validate(self, details: PaymentDetails) -> tuple[bool, str]:
        if not details.metadata.get("account_number"):
            return False, "Account number required"
        if not details.metadata.get("routing_number"):
            return False, "Routing number required"
        return True, "OK"

    def process(self, details: PaymentDetails) -> PaymentResult:
        acct = details.metadata["account_number"]
        print(f"[BankTransfer] Initiating ACH transfer to {acct[-4:].rjust(len(acct), '*')}")
        return PaymentResult(True, "ach_txn_789", "ACH transfer initiated (1-3 business days)")


class CheckoutContext:
    def __init__(self, strategy: PaymentStrategy):
        self._strategy = strategy

    def set_payment_method(self, strategy: PaymentStrategy) -> None:
        self._strategy = strategy
        print(f"Payment method set to: {strategy.name}")

    def checkout(self, amount: float, currency: str = "USD", **metadata) -> PaymentResult:
        details = PaymentDetails(amount, currency, metadata)
        print(f"\n--- Checkout: {amount} {currency} via {self._strategy.name} ---")

        valid, msg = self._strategy.validate(details)
        if not valid:
            print(f"Validation failed: {msg}")
            return PaymentResult(False, "", msg)

        result = self._strategy.process(details)
        status = "SUCCESS" if result.success else "FAILED"
        print(f"Result: {status} — {result.message}")
        return result


checkout = CheckoutContext(CreditCardStrategy())
checkout.checkout(99.99, card_number="4111 1111 1111 1111", cvv="123")

checkout.set_payment_method(CryptoStrategy())
checkout.checkout(500.0, "USD", coin="ETH", wallet_address="0xAbCd1234...")

checkout.set_payment_method(BankTransferStrategy())
checkout.checkout(2500.0, account_number="123456789", routing_number="021000021")
```

---

## Phần 2 — Template Method Pattern

### Vấn đề Template Method giải quyết

Nhiều thuật toán có cùng **khung** (skeleton) nhưng khác nhau ở một vài bước cụ thể. Ví dụ: đọc file CSV và đọc file JSON đều có bước "mở file → parse → validate → lưu vào DB → đóng file" — chỉ khác ở bước "parse".

Nếu copy-paste toàn bộ logic, code trùng lặp. Nếu tách hết ra, mất đi sự liên kết của khung thuật toán.

> [!definition] Template Method Pattern
> Định nghĩa **khung** (skeleton) của một thuật toán trong base class, hoãn lại một số bước cho subclass. Template Method cho phép subclass **tái định nghĩa** (override) một số bước của thuật toán mà không thay đổi cấu trúc tổng thể.
>
> **Ý tưởng cốt lõi**: Base class gọi các "hook" method theo đúng thứ tự — subclass implement từng hook theo nhu cầu riêng.

### Cấu trúc

```text
AbstractClass
+ template_method()        ← final — không override
    calls:
    + primitive_op_1()     ← abstract — phải override
    + primitive_op_2()     ← abstract — phải override
    + hook()               ← optional hook — có default implementation
      ▲
      ├─────────────────┐
ConcreteClassA      ConcreteClassB
+ primitive_op_1()  + primitive_op_1()
+ primitive_op_2()  + primitive_op_2()
```

### Implementation — Data Importer

```python
from abc import ABC, abstractmethod
import csv
import json
import io


class DataImporter(ABC):
    def import_data(self, source: str) -> list[dict]:
        raw = self._read(source)
        records = self._parse(raw)
        valid = self._validate(records)
        transformed = self._transform(valid)
        self._on_complete(len(transformed))
        return transformed

    @abstractmethod
    def _read(self, source: str) -> str: ...

    @abstractmethod
    def _parse(self, raw: str) -> list[dict]: ...

    def _validate(self, records: list[dict]) -> list[dict]:
        valid = [r for r in records if r]
        skipped = len(records) - len(valid)
        if skipped:
            print(f"[Validate] Skipped {skipped} empty records")
        return valid

    def _transform(self, records: list[dict]) -> list[dict]:
        return records

    def _on_complete(self, count: int) -> None:
        print(f"[Import] Done — {count} records imported")


class CSVImporter(DataImporter):
    def _read(self, source: str) -> str:
        print(f"[CSV] Reading: {source}")
        return source

    def _parse(self, raw: str) -> list[dict]:
        reader = csv.DictReader(io.StringIO(raw))
        records = list(reader)
        print(f"[CSV] Parsed {len(records)} rows")
        return records

    def _transform(self, records: list[dict]) -> list[dict]:
        for r in records:
            for key in list(r.keys()):
                r[key.strip().lower()] = r.pop(key)
        return records


class JSONImporter(DataImporter):
    def _read(self, source: str) -> str:
        print(f"[JSON] Reading payload ({len(source)} chars)")
        return source

    def _parse(self, raw: str) -> list[dict]:
        data = json.loads(raw)
        records = data if isinstance(data, list) else data.get("records", [])
        print(f"[JSON] Parsed {len(records)} objects")
        return records

    def _validate(self, records: list[dict]) -> list[dict]:
        valid = super()._validate(records)
        required = {"id", "name"}
        result = [r for r in valid if required.issubset(r.keys())]
        skipped = len(valid) - len(result)
        if skipped:
            print(f"[JSON Validate] Dropped {skipped} records missing required fields")
        return result

    def _on_complete(self, count: int) -> None:
        super()._on_complete(count)
        print(f"[JSON] Audit log written")


csv_data = "ID,Name,Email\n1,Alice,alice@example.com\n2,Bob,bob@example.com\n3,Carol,carol@example.com"
json_data = json.dumps([
    {"id": 1, "name": "Alice", "role": "admin"},
    {"id": 2, "name": "Bob"},
    {"name": "Missing ID"},
])

print("=== CSV Import ===")
csv_importer = CSVImporter()
csv_records = csv_importer.import_data(csv_data)
print(csv_records[:2])

print("\n=== JSON Import ===")
json_importer = JSONImporter()
json_records = json_importer.import_data(json_data)
print(json_records)
```

`import_data()` là template method — định nghĩa thứ tự cố định. Subclass chỉ cần implement `_read()` và `_parse()`, có thể tùy chọn override `_validate()`, `_transform()`, `_on_complete()`.

### Worked Example — Report Generator

Template Method rất phổ biến trong report generation: cùng khung (gather data → format → render header → render body → render footer → export), khác implementation.

```python
from abc import ABC, abstractmethod
from datetime import datetime


class ReportGenerator(ABC):
    def generate(self, title: str, data: list[dict]) -> str:
        gathered = self._gather_data(data)
        header = self._render_header(title)
        body = self._render_body(gathered)
        footer = self._render_footer()
        result = self._assemble(header, body, footer)
        self._post_generate(title, result)
        return result

    def _gather_data(self, data: list[dict]) -> list[dict]:
        return data

    @abstractmethod
    def _render_header(self, title: str) -> str: ...

    @abstractmethod
    def _render_body(self, data: list[dict]) -> str: ...

    @abstractmethod
    def _render_footer(self) -> str: ...

    def _assemble(self, header: str, body: str, footer: str) -> str:
        return f"{header}\n{body}\n{footer}"

    def _post_generate(self, title: str, content: str) -> None:
        print(f"[Report] '{title}' generated ({len(content)} chars)")


class MarkdownReportGenerator(ReportGenerator):
    def _render_header(self, title: str) -> str:
        date = datetime.now().strftime("%Y-%m-%d")
        return f"# {title}\n_Generated: {date}_\n\n---"

    def _render_body(self, data: list[dict]) -> str:
        if not data:
            return "_No data available._"
        headers = list(data[0].keys())
        header_row = "| " + " | ".join(headers) + " |"
        sep_row = "| " + " | ".join("---" for _ in headers) + " |"
        rows = [
            "| " + " | ".join(str(row.get(h, "")) for h in headers) + " |"
            for row in data
        ]
        return "\n".join([header_row, sep_row] + rows)

    def _render_footer(self) -> str:
        return "\n---\n_End of report_"


class HTMLReportGenerator(ReportGenerator):
    def _render_header(self, title: str) -> str:
        return f"<h1>{title}</h1><p><em>Generated: {datetime.now().date()}</em></p>"

    def _render_body(self, data: list[dict]) -> str:
        if not data:
            return "<p><em>No data available.</em></p>"
        headers = list(data[0].keys())
        th = "".join(f"<th>{h}</th>" for h in headers)
        rows = "".join(
            "<tr>" + "".join(f"<td>{row.get(h,'')}</td>" for h in headers) + "</tr>"
            for row in data
        )
        return f"<table><thead><tr>{th}</tr></thead><tbody>{rows}</tbody></table>"

    def _render_footer(self) -> str:
        return "<footer><small>Confidential</small></footer>"

    def _assemble(self, header: str, body: str, footer: str) -> str:
        return f"<html><body>{header}{body}{footer}</body></html>"


sales_data = [
    {"product": "Widget A", "qty": 150, "revenue": 4500},
    {"product": "Widget B", "qty": 89, "revenue": 2670},
    {"product": "Gadget X", "qty": 42, "revenue": 8400},
]

md_gen = MarkdownReportGenerator()
md_report = md_gen.generate("Q1 Sales Report", sales_data)
print(md_report)

print()
html_gen = HTMLReportGenerator()
html_report = html_gen.generate("Q1 Sales Report", sales_data)
print(html_report[:200] + "...")
```

---

## So sánh Strategy và Template Method

| Tiêu chí | Strategy | Template Method |
|----------|---------|-----------------|
| **Cơ chế** | Composition — strategy là object riêng biệt | Inheritance — subclass override method |
| **Thay đổi khi nào** | Runtime — swap strategy bất cứ lúc nào | Compile time — chọn subclass khi tạo object |
| **Granularity** | Toàn bộ thuật toán được swap | Chỉ một số bước cụ thể được override |
| **Coupling** | Thấp hơn — context không biết concrete strategy | Cao hơn — subclass phụ thuộc base class |
| **Boilerplate** | Nhiều hơn — nhiều class strategy riêng | Ít hơn — override method trực tiếp |
| **Khi nào dùng** | Cần nhiều thuật toán thay thế nhau lúc runtime | Nhiều class cùng khung, khác chi tiết |

> [!note] Hollywood Principle
> Template Method là ví dụ điển hình của **Hollywood Principle**: "Don't call us, we'll call you." Base class gọi các hook method của subclass — không phải ngược lại. Đây còn gọi là **Inversion of Control**.

---

## Summary / Key Takeaways

- **Strategy** đóng gói thuật toán vào object — context delegate toàn bộ thuật toán cho strategy. Thay thuật toán bằng cách thay strategy object lúc runtime. Dựa trên **composition**.
- **Template Method** định nghĩa khung cố định trong base class, để subclass điền vào chi tiết qua override. Thay đổi tại **compile time** bằng cách chọn subclass. Dựa trên **inheritance**.
- Cả hai pattern đều implement OCP — thêm thuật toán/variant mới mà không sửa code hiện tại.
- Strategy linh hoạt hơn nhưng nhiều class hơn; Template Method ít class hơn nhưng coupling chặt hơn qua inheritance.
- Lesson này mở đầu nhóm **Behavioral** — nhóm lớn nhất với 11 pattern, tập trung vào cách object giao tiếp và phân chia trách nhiệm.

---

## References

- Gamma et al. — *Design Patterns*, Ch. 5: Strategy tr.315, Template Method tr.325
- Refactoring.Guru — Strategy: https://refactoring.guru/design-patterns/strategy/python/example
- Refactoring.Guru — Template Method: https://refactoring.guru/design-patterns/template-method/python/example
