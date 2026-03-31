---
title: "05. Adapter & Facade"
tags: [design-patterns, gof, structural, adapter, facade, lesson-05]
aliases: [Adapter Pattern, Facade Pattern]
created: 2026-03-24
---

> **Prerequisites**: [[01-foundations|01. Foundations — SOLID & OOP nâng cao]]
> **Objectives**:
> - Hiểu Adapter: kết nối hai interface không tương thích mà không sửa code nguồn
> - Hiểu Facade: cung cấp interface đơn giản hóa cho một hệ thống con phức tạp
> - Phân biệt hai pattern: Adapter *chuyển đổi* interface, Facade *che giấu* độ phức tạp
> - Nhận ra các tình huống thực tế điển hình của từng pattern trong Python

---

## Phần 1 — Adapter Pattern

### Vấn đề Adapter giải quyết

Bạn tích hợp thư viện thanh toán bên thứ ba vào hệ thống. Hệ thống của bạn gọi `payment.process(amount, currency)`, nhưng thư viện mới yêu cầu `gateway.charge({"value": amount, "curr": currency})`. Bạn không thể sửa thư viện ngoài, và không muốn thay đổi toàn bộ code đang hoạt động.

Adapter đóng vai trò "phích cắm chuyển đổi" — giống hệt adapter điện khi đi du lịch nước ngoài.

> [!definition] Adapter Pattern
> Chuyển đổi interface của một class thành interface khác mà client mong đợi. Adapter cho phép các class có interface **không tương thích** làm việc cùng nhau.
>
> **Ý tưởng cốt lõi**: Bọc (wrap) object có interface "lạ" bên trong một object mới có interface "quen" — client chỉ thấy interface quen, không biết gì về object bên trong.

### Hai dạng Adapter

**Object Adapter** (dùng composition — được ưu tiên):

```text
Client ──→ Target (interface)
                ▲
                │ implements
           Adapter
           - adaptee: Adaptee   ← wrap bằng composition
           + request()          ← gọi adaptee.specific_request()
```

**Class Adapter** (dùng multiple inheritance — ít phổ biến hơn):

```text
Client ──→ Target (interface)
                ▲
           Adapter ──→ Adaptee  ← kế thừa cả hai
           + request()
```

Python hỗ trợ cả hai, nhưng Object Adapter được ưu tiên vì ít coupling hơn.

### Implementation — Payment Gateway

```python
from abc import ABC, abstractmethod


class PaymentProcessor(ABC):
    @abstractmethod
    def process(self, amount: float, currency: str) -> bool: ...

    @abstractmethod
    def refund(self, transaction_id: str, amount: float) -> bool: ...


class LegacyStripeGateway:
    def charge(self, payload: dict) -> dict:
        print(f"[Stripe] Charging {payload['value']} {payload['curr']}")
        return {"status": "success", "id": "txn_stripe_001"}

    def reverse(self, txn_id: str, value: float) -> bool:
        print(f"[Stripe] Reversing {txn_id} for {value}")
        return True


class PayPalSDK:
    def make_payment(self, usd_amount: float, buyer_email: str = "") -> str:
        print(f"[PayPal] Payment of ${usd_amount:.2f}")
        return "paypal_order_xyz"

    def cancel_payment(self, order_id: str) -> None:
        print(f"[PayPal] Cancelling order {order_id}")


class StripeAdapter(PaymentProcessor):
    def __init__(self, gateway: LegacyStripeGateway):
        self._gateway = gateway

    def process(self, amount: float, currency: str) -> bool:
        result = self._gateway.charge({"value": amount, "curr": currency})
        return result.get("status") == "success"

    def refund(self, transaction_id: str, amount: float) -> bool:
        return self._gateway.reverse(transaction_id, amount)


class PayPalAdapter(PaymentProcessor):
    def __init__(self, sdk: PayPalSDK):
        self._sdk = sdk
        self._last_order_id: str | None = None

    def process(self, amount: float, currency: str) -> bool:
        if currency != "USD":
            print(f"[PayPalAdapter] Currency {currency} not supported, converting...")
        self._last_order_id = self._sdk.make_payment(amount)
        return bool(self._last_order_id)

    def refund(self, transaction_id: str, amount: float) -> bool:
        order_id = transaction_id or self._last_order_id
        if order_id:
            self._sdk.cancel_payment(order_id)
            return True
        return False


def checkout(processor: PaymentProcessor, amount: float, currency: str):
    print(f"\nCheckout: {amount} {currency}")
    if processor.process(amount, currency):
        print("Payment successful")
    else:
        print("Payment failed")


stripe_processor = StripeAdapter(LegacyStripeGateway())
paypal_processor = PayPalAdapter(PayPalSDK())

checkout(stripe_processor, 99.99, "USD")
checkout(paypal_processor, 49.00, "USD")
```

`checkout()` không biết đang dùng Stripe hay PayPal — nó chỉ gọi `PaymentProcessor` interface. Thêm provider mới chỉ cần thêm Adapter mới.

### Worked Example — Third-party Data Sources

Bài toán: hệ thống analytics đọc data từ nhiều nguồn (CSV, JSON API, XML feed) — tất cả phải expose cùng interface `DataSource`.

```python
from abc import ABC, abstractmethod
import json
import csv
import io


class DataSource(ABC):
    @abstractmethod
    def read_records(self) -> list[dict]: ...

    @abstractmethod
    def get_schema(self) -> list[str]: ...


class CSVFileReader:
    def __init__(self, content: str):
        self._content = content

    def read_rows(self) -> list[list[str]]:
        reader = csv.reader(io.StringIO(self._content))
        return list(reader)

    def get_headers(self) -> list[str]:
        rows = self.read_rows()
        return rows[0] if rows else []


class JSONApiClient:
    def __init__(self, payload: str):
        self._payload = payload

    def fetch(self) -> dict:
        return json.loads(self._payload)


class CSVAdapter(DataSource):
    def __init__(self, reader: CSVFileReader):
        self._reader = reader

    def read_records(self) -> list[dict]:
        rows = self._reader.read_rows()
        if not rows:
            return []
        headers = rows[0]
        return [dict(zip(headers, row)) for row in rows[1:]]

    def get_schema(self) -> list[str]:
        return self._reader.get_headers()


class JSONAdapter(DataSource):
    def __init__(self, client: JSONApiClient):
        self._client = client

    def read_records(self) -> list[dict]:
        data = self._client.fetch()
        return data.get("items", data if isinstance(data, list) else [])

    def get_schema(self) -> list[str]:
        records = self.read_records()
        return list(records[0].keys()) if records else []


def run_analytics(source: DataSource):
    schema = source.get_schema()
    records = source.read_records()
    print(f"Schema : {schema}")
    print(f"Records: {len(records)} rows")
    for r in records[:2]:
        print(f"  {r}")


csv_content = "name,age,city\nAlice,30,HCM\nBob,25,HN\nCarol,28,DN"
json_content = '{"items": [{"id": 1, "product": "Widget", "qty": 100}, {"id": 2, "product": "Gadget", "qty": 50}]}'

print("=== CSV Source ===")
run_analytics(CSVAdapter(CSVFileReader(csv_content)))

print("\n=== JSON Source ===")
run_analytics(JSONAdapter(JSONApiClient(json_content)))
```

### Trade-offs của Adapter

**Ưu điểm:**
- Tích hợp code/thư viện cũ mà không sửa — Single Responsibility được giữ nguyên
- Tuân thủ Open/Closed Principle — thêm adapter mới, không sửa client
- Tách biệt conversion logic khỏi business logic

**Nhược điểm:**
- Thêm một lớp indirection — đôi khi làm code khó theo dõi hơn
- Nếu cần adapt quá nhiều method, adapter trở nên cồng kềnh

---

## Phần 2 — Facade Pattern

### Vấn đề Facade giải quyết

Một hệ thống phức tạp thường có nhiều subsystem: authentication, logging, database, cache, email... Mỗi lần client muốn làm một việc đơn giản (ví dụ: "đặt hàng"), nó phải gọi 7–8 subsystem theo đúng thứ tự, với đúng tham số. Code client trở nên rắc rối và phụ thuộc chặt vào chi tiết nội bộ.

Facade giải quyết bằng cách cung cấp một "cổng vào" đơn giản.

> [!definition] Facade Pattern
> Cung cấp một **interface đơn giản hóa** cho một tập hợp interface phức tạp trong một hệ thống con. Facade định nghĩa interface cấp cao hơn giúp hệ thống con dễ sử dụng hơn.
>
> **Ý tưởng cốt lõi**: Che giấu sự phức tạp bên trong, chỉ lộ ra những gì client thực sự cần dùng.

### Cấu trúc

```text
Client ──→ Facade
               │ uses
    ┌──────────┼──────────┐
    ▼          ▼          ▼
SubsystemA  SubsystemB  SubsystemC
```

Facade không ngăn client truy cập trực tiếp vào subsystem khi cần — nó chỉ là shortcut cho các use case phổ biến.

### Implementation — Home Theater

Ví dụ kinh điển từ GoF: bật hệ thống rạp chiếu phim tại nhà.

```python
class Amplifier:
    def on(self): print("[Amp] Power on")
    def set_volume(self, level: int): print(f"[Amp] Volume → {level}")
    def set_dvd(self): print("[Amp] Input: DVD")
    def off(self): print("[Amp] Power off")


class DVDPlayer:
    def on(self): print("[DVD] Power on")
    def play(self, movie: str): print(f"[DVD] Playing: {movie}")
    def stop(self): print("[DVD] Stop")
    def off(self): print("[DVD] Power off")


class Projector:
    def on(self): print("[Projector] Power on")
    def widescreen_mode(self): print("[Projector] Mode: widescreen")
    def off(self): print("[Projector] Power off")


class TheaterLights:
    def dim(self, level: int): print(f"[Lights] Dimmed to {level}%")
    def on(self): print("[Lights] Full brightness")


class PopcornPopper:
    def on(self): print("[Popper] Power on")
    def pop(self): print("[Popper] Popping corn!")
    def off(self): print("[Popper] Power off")


class HomeTheaterFacade:
    def __init__(
        self,
        amp: Amplifier,
        dvd: DVDPlayer,
        projector: Projector,
        lights: TheaterLights,
        popper: PopcornPopper,
    ):
        self._amp = amp
        self._dvd = dvd
        self._projector = projector
        self._lights = lights
        self._popper = popper

    def watch_movie(self, movie: str):
        print("\n--- Get ready to watch a movie ---")
        self._popper.on()
        self._popper.pop()
        self._lights.dim(10)
        self._projector.on()
        self._projector.widescreen_mode()
        self._amp.on()
        self._amp.set_dvd()
        self._amp.set_volume(5)
        self._dvd.on()
        self._dvd.play(movie)

    def end_movie(self):
        print("\n--- Shutting down theater ---")
        self._popper.off()
        self._lights.on()
        self._projector.off()
        self._amp.off()
        self._dvd.stop()
        self._dvd.off()


theater = HomeTheaterFacade(
    Amplifier(), DVDPlayer(), Projector(), TheaterLights(), PopcornPopper()
)

theater.watch_movie("Inception")
theater.end_movie()
```

Client gọi hai method thay vì 10+ lệnh riêng lẻ. Thứ tự khởi động phức tạp bị ẩn hoàn toàn.

### Worked Example — Order Processing Facade

Bài toán thực tế: đặt hàng trong e-commerce cần phối hợp inventory, payment, shipping, email, và audit log.

```python
from dataclasses import dataclass


@dataclass
class OrderItem:
    product_id: str
    quantity: int
    unit_price: float


class InventoryService:
    def check_stock(self, product_id: str, qty: int) -> bool:
        print(f"[Inventory] Checking {qty}x {product_id}")
        return True

    def reserve(self, product_id: str, qty: int) -> str:
        reservation_id = f"res_{product_id}_{qty}"
        print(f"[Inventory] Reserved: {reservation_id}")
        return reservation_id

    def release(self, reservation_id: str) -> None:
        print(f"[Inventory] Released: {reservation_id}")


class PaymentService:
    def charge(self, user_id: str, amount: float, currency: str = "USD") -> str | None:
        print(f"[Payment] Charging {user_id}: {amount:.2f} {currency}")
        return f"txn_{user_id}_001"

    def refund(self, txn_id: str) -> bool:
        print(f"[Payment] Refunding {txn_id}")
        return True


class ShippingService:
    def create_shipment(self, user_id: str, items: list[OrderItem]) -> str:
        tracking = f"ship_{user_id}_001"
        print(f"[Shipping] Created shipment {tracking} for {len(items)} item(s)")
        return tracking

    def cancel_shipment(self, tracking_id: str) -> None:
        print(f"[Shipping] Cancelled shipment {tracking_id}")


class EmailService:
    def send_confirmation(self, user_id: str, order_id: str, tracking: str):
        print(f"[Email] Sent order {order_id} confirmation to {user_id} (tracking: {tracking})")

    def send_failure(self, user_id: str, reason: str):
        print(f"[Email] Notified {user_id} of failure: {reason}")


class AuditLogger:
    def log(self, event: str, details: dict):
        print(f"[Audit] {event}: {details}")


class OrderFacade:
    def __init__(self):
        self._inventory = InventoryService()
        self._payment = PaymentService()
        self._shipping = ShippingService()
        self._email = EmailService()
        self._audit = AuditLogger()

    def place_order(self, user_id: str, items: list[OrderItem]) -> str | None:
        order_id = f"order_{user_id}_{len(items)}"
        total = sum(i.unit_price * i.quantity for i in items)

        reservations = []
        for item in items:
            if not self._inventory.check_stock(item.product_id, item.quantity):
                self._email.send_failure(user_id, f"{item.product_id} out of stock")
                return None
            res_id = self._inventory.reserve(item.product_id, item.quantity)
            reservations.append(res_id)

        txn_id = self._payment.charge(user_id, total)
        if not txn_id:
            for res_id in reservations:
                self._inventory.release(res_id)
            self._email.send_failure(user_id, "Payment failed")
            return None

        tracking = self._shipping.create_shipment(user_id, items)
        self._email.send_confirmation(user_id, order_id, tracking)
        self._audit.log("ORDER_PLACED", {
            "order_id": order_id,
            "user": user_id,
            "total": total,
            "txn": txn_id,
        })

        return order_id


facade = OrderFacade()
items = [
    OrderItem("laptop-001", 1, 999.00),
    OrderItem("mouse-005", 2, 29.99),
]
order_id = facade.place_order("user_42", items)
print(f"\nOrder placed: {order_id}")
```

Client chỉ gọi `place_order()`. Logic rollback (release reservation khi payment thất bại) hoàn toàn nằm trong Facade — client không cần biết.

### Trade-offs của Facade

**Ưu điểm:**
- Giảm coupling giữa client và subsystem — client không phụ thuộc vào chi tiết nội bộ
- Đóng gói logic orchestration phức tạp vào một nơi
- Dễ test: mock Facade thay vì mock 5 subsystem

**Nhược điểm:**
- Facade có thể trở thành God Object nếu nhét quá nhiều logic vào
- Đôi khi che giấu quá mức — client cần tùy chỉnh nhưng Facade không expose đủ tuỳ chọn

---

## So sánh Adapter và Facade

| Tiêu chí | Adapter | Facade |
|----------|---------|--------|
| **Mục đích** | Làm hai interface không tương thích hoạt động cùng nhau | Đơn giản hóa interface của hệ thống phức tạp |
| **Số object bọc** | Thường một object (adaptee) | Nhiều subsystem |
| **Interface mới** | Giống Target interface sẵn có | Interface mới, đơn giản hơn |
| **Client biết gì** | Client biết Target interface, không biết Adaptee | Client biết Facade, không cần biết subsystem |
| **Khi nào dùng** | Tích hợp thư viện/API cũ không tương thích | Che giấu độ phức tạp của subsystem |

> [!note] Decorator vs Adapter
> Cả hai đều "bọc" một object, nhưng mục đích khác nhau hoàn toàn: **Adapter** thay đổi interface (làm tương thích), **Decorator** giữ nguyên interface nhưng thêm hành vi. Decorator sẽ học ở Lesson 06.

---

## Summary / Key Takeaways

- **Adapter** giải quyết vấn đề *interface mismatch* — chuyển đổi interface của một class thành interface mà client mong đợi. Object Adapter (composition) được ưu tiên hơn Class Adapter (inheritance).
- **Facade** giải quyết vấn đề *complexity* — cung cấp một entry point đơn giản cho hệ thống con phức tạp. Không ngăn client truy cập trực tiếp subsystem khi cần.
- Adapter thường xuất hiện khi **tích hợp thư viện bên ngoài**; Facade xuất hiện khi **orchestrating nhiều service nội bộ**.
- Cả hai đều giảm coupling và ẩn chi tiết implementation khỏi client — nhưng theo cách khác nhau.

---

## References

- Gamma et al. — *Design Patterns*, Ch. 4: Adapter tr.139, Facade tr.185
- Refactoring.Guru — Adapter: https://refactoring.guru/design-patterns/adapter/python/example
- Refactoring.Guru — Facade: https://refactoring.guru/design-patterns/facade/python/example
