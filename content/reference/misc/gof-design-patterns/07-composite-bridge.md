---
title: "07. Composite & Bridge"
tags: [design-patterns, gof, structural, composite, bridge, lesson-07]
aliases: [Composite Pattern, Bridge Pattern]
created: 2026-03-24
---

> **Prerequisites**: [[01-foundations|01. Foundations]], [[05-adapter-facade|05. Adapter & Facade]]
> **Objectives**:
> - Hiểu Composite: xây dựng cấu trúc cây nơi client xử lý đồng nhất node đơn lẻ và nhóm node
> - Hiểu Bridge: tách abstraction khỏi implementation để cả hai có thể thay đổi độc lập
> - Nhận ra sự khác biệt giữa hai pattern: Composite về *cấu trúc dữ liệu hình cây*, Bridge về *phân tách chiều thay đổi*
> - Áp dụng Composite cho hệ thống file/menu; Bridge cho UI/driver/platform

---

## Phần 1 — Composite Pattern

### Vấn đề Composite giải quyết

Hãy nghĩ đến hệ thống file: một thư mục có thể chứa file hoặc thư mục con. Khi tính tổng dung lượng, bạn muốn gọi `get_size()` trên bất kỳ thứ gì — dù là file đơn lẻ hay cả cây thư mục — mà không cần quan tâm đến loại của nó.

Nếu dùng `if isinstance(item, Directory): ...` khắp nơi, code client trở nên phức tạp và vi phạm OCP. Mỗi lần thêm loại node mới phải sửa client.

> [!definition] Composite Pattern
> Tổ chức các object thành cấu trúc **cây** để biểu diễn quan hệ **part-whole hierarchy** (phần-tổng thể). Composite cho phép client xử lý **đồng nhất** (uniformly) object đơn lẻ và tập hợp object.
>
> **Ý tưởng cốt lõi**: Cả "lá" (leaf) lẫn "nhánh" (composite) đều implement cùng interface — client gọi cùng method trên cả hai mà không cần biết đang xử lý loại nào.

### Cấu trúc

Có hai variant: **transparent** (Composite expose toàn bộ method child management trong interface chung) và **safe** (chỉ Composite mới có method add/remove). Safe variant được ưu tiên trong Python vì tránh gọi `add()` trên Leaf.

```text
Component (interface / ABC)
+ operation()
+ get_size() → int
      ▲
      ├──────────────────┐
   Leaf              Composite
   + operation()     - children: list[Component]
   + get_size()      + operation()   ← gọi đệ quy trên children
                     + get_size()
                     + add(c: Component)
                     + remove(c: Component)
```

### Implementation — Hệ thống File

```python
from __future__ import annotations
from abc import ABC, abstractmethod


class FileSystemItem(ABC):
    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    def get_size(self) -> int: ...

    @abstractmethod
    def display(self, indent: int = 0) -> None: ...

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}({self.name})"


class File(FileSystemItem):
    def __init__(self, name: str, size: int):
        super().__init__(name)
        self._size = size

    def get_size(self) -> int:
        return self._size

    def display(self, indent: int = 0) -> None:
        print(f"{'  ' * indent}📄 {self.name} ({self._size:,} bytes)")


class Directory(FileSystemItem):
    def __init__(self, name: str):
        super().__init__(name)
        self._children: list[FileSystemItem] = []

    def add(self, item: FileSystemItem) -> Directory:
        self._children.append(item)
        return self

    def remove(self, item: FileSystemItem) -> None:
        self._children.remove(item)

    def get_size(self) -> int:
        return sum(child.get_size() for child in self._children)

    def display(self, indent: int = 0) -> None:
        total = self.get_size()
        print(f"{'  ' * indent}📁 {self.name}/ ({total:,} bytes total)")
        for child in self._children:
            child.display(indent + 1)


root = Directory("root")
src = Directory("src")
tests = Directory("tests")
assets = Directory("assets")

src.add(File("main.py", 4_200))
src.add(File("utils.py", 2_800))
src.add(File("models.py", 8_100))

tests.add(File("test_main.py", 3_500))
tests.add(File("test_utils.py", 1_900))

assets.add(File("logo.png", 45_000))
assets.add(File("banner.jpg", 128_000))

root.add(src).add(tests).add(assets)
root.add(File("README.md", 2_048))
root.add(File("requirements.txt", 512))

root.display()
print(f"\nTotal project size: {root.get_size():,} bytes")
print(f"Source files only: {src.get_size():,} bytes")
```

Client gọi `get_size()` và `display()` giống nhau trên `File` và `Directory` — không cần biết đang xử lý leaf hay composite.

### Worked Example — UI Component Tree

Composite rất phổ biến trong UI framework: một `Panel` chứa `Button`, `Label`, và `Panel` con — tất cả đều là `UIComponent`.

```python
from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class Bounds:
    x: int
    y: int
    width: int
    height: int


class UIComponent(ABC):
    def __init__(self, name: str, bounds: Bounds):
        self.name = name
        self.bounds = bounds
        self._visible = True

    def show(self) -> None: self._visible = True
    def hide(self) -> None: self._visible = False

    @abstractmethod
    def render(self, depth: int = 0) -> None: ...

    @abstractmethod
    def on_click(self, x: int, y: int) -> bool: ...

    def _contains(self, x: int, y: int) -> bool:
        b = self.bounds
        return b.x <= x <= b.x + b.width and b.y <= y <= b.y + b.height


class Button(UIComponent):
    def __init__(self, name: str, bounds: Bounds, label: str):
        super().__init__(name, bounds)
        self._label = label

    def render(self, depth: int = 0) -> None:
        if not self._visible:
            return
        pad = "  " * depth
        print(f"{pad}[Button:{self._label}] at {self.bounds}")

    def on_click(self, x: int, y: int) -> bool:
        if self._contains(x, y) and self._visible:
            print(f"Button '{self._label}' clicked!")
            return True
        return False


class Label(UIComponent):
    def __init__(self, name: str, bounds: Bounds, text: str):
        super().__init__(name, bounds)
        self._text = text

    def render(self, depth: int = 0) -> None:
        if not self._visible:
            return
        pad = "  " * depth
        print(f"{pad}[Label:'{self._text}'] at {self.bounds}")

    def on_click(self, x: int, y: int) -> bool:
        return False


class Panel(UIComponent):
    def __init__(self, name: str, bounds: Bounds):
        super().__init__(name, bounds)
        self._children: list[UIComponent] = []

    def add(self, component: UIComponent) -> Panel:
        self._children.append(component)
        return self

    def render(self, depth: int = 0) -> None:
        if not self._visible:
            return
        pad = "  " * depth
        print(f"{pad}[Panel:{self.name}]")
        for child in self._children:
            child.render(depth + 1)

    def on_click(self, x: int, y: int) -> bool:
        if not self._visible or not self._contains(x, y):
            return False
        for child in self._children:
            if child.on_click(x, y):
                return True
        return False


dialog = Panel("Dialog", Bounds(100, 100, 400, 300))
header = Panel("Header", Bounds(100, 100, 400, 50))
body = Panel("Body", Bounds(100, 150, 400, 200))
footer = Panel("Footer", Bounds(100, 350, 400, 50))

header.add(Label("title", Bounds(110, 115, 200, 20), "Confirm Action"))
body.add(Label("msg", Bounds(110, 160, 380, 40), "Are you sure you want to proceed?"))
footer.add(Button("ok", Bounds(310, 355, 80, 35), "OK"))
footer.add(Button("cancel", Bounds(400, 355, 90, 35), "Cancel"))

dialog.add(header).add(body).add(footer)

print("=== Render tree ===")
dialog.render()

print("\n=== Click on OK button ===")
dialog.on_click(350, 370)
```

### Trade-offs của Composite

**Ưu điểm:** Client code đơn giản — gọi cùng interface cho leaf và composite. Dễ thêm loại component mới.

**Nhược điểm:** Interface chung đôi khi quá rộng — Leaf bị buộc implement method không có nghĩa (như `add()`). Khó áp đặt ràng buộc kiểu khi chỉ muốn một số loại node được phép là con của composite nhất định.

---

## Phần 2 — Bridge Pattern

### Vấn đề Bridge giải quyết

Giả sử bạn có `Shape` với hai chiều thay đổi độc lập: **loại hình** (Circle, Square) và **platform vẽ** (OpenGL, DirectX, SVG). Dùng inheritance thuần túy sẽ cần: `OpenGLCircle`, `OpenGLSquare`, `DirectXCircle`, `DirectXSquare`... Thêm một loại hình hoặc một platform mới làm số class bùng nổ theo kiểu nhân.

Bridge cắt đứt mối quan hệ này bằng cách tách thành hai hierarchy riêng biệt, liên kết qua composition.

> [!definition] Bridge Pattern
> Tách rời một **abstraction** khỏi **implementation** của nó, để cả hai có thể thay đổi **độc lập** nhau.
>
> **Ý tưởng cốt lõi**: Thay vì một hierarchy kế thừa sâu, tạo hai hierarchy phẳng — Abstraction giữ tham chiếu đến Implementation và delegate công việc cho nó.

### Cấu trúc

```text
Abstraction                    Implementation (interface)
- impl: Implementation ──────▶ + operation_impl()
+ operation()                        ▲
      ▲                    ┌─────────┴─────────┐
      │                 ConcreteImplA      ConcreteImplB
RefinedAbstraction
```

Abstraction và Implementation thay đổi độc lập. Thêm loại Abstraction không ảnh hưởng Implementation và ngược lại.

### Implementation — Renderer

```python
from abc import ABC, abstractmethod
import math


class Renderer(ABC):
    @abstractmethod
    def render_circle(self, x: float, y: float, radius: float) -> None: ...

    @abstractmethod
    def render_rect(self, x: float, y: float, w: float, h: float) -> None: ...

    @abstractmethod
    def render_line(self, x1: float, y1: float, x2: float, y2: float) -> None: ...


class SVGRenderer(Renderer):
    def render_circle(self, x: float, y: float, radius: float) -> None:
        print(f'<circle cx="{x}" cy="{y}" r="{radius}" fill="none" stroke="black"/>')

    def render_rect(self, x: float, y: float, w: float, h: float) -> None:
        print(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="none" stroke="black"/>')

    def render_line(self, x1: float, y1: float, x2: float, y2: float) -> None:
        print(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="black"/>')


class CanvasRenderer(Renderer):
    def render_circle(self, x: float, y: float, radius: float) -> None:
        print(f"ctx.arc({x}, {y}, {radius}, 0, 2*Math.PI); ctx.stroke();")

    def render_rect(self, x: float, y: float, w: float, h: float) -> None:
        print(f"ctx.strokeRect({x}, {y}, {w}, {h});")

    def render_line(self, x1: float, y1: float, x2: float, y2: float) -> None:
        print(f"ctx.moveTo({x1},{y1}); ctx.lineTo({x2},{y2}); ctx.stroke();")


class Shape(ABC):
    def __init__(self, renderer: Renderer):
        self._renderer = renderer

    @abstractmethod
    def draw(self) -> None: ...

    @abstractmethod
    def move(self, dx: float, dy: float) -> None: ...


class Circle(Shape):
    def __init__(self, x: float, y: float, radius: float, renderer: Renderer):
        super().__init__(renderer)
        self._x = x
        self._y = y
        self._radius = radius

    def draw(self) -> None:
        self._renderer.render_circle(self._x, self._y, self._radius)

    def move(self, dx: float, dy: float) -> None:
        self._x += dx
        self._y += dy


class Rectangle(Shape):
    def __init__(self, x: float, y: float, w: float, h: float, renderer: Renderer):
        super().__init__(renderer)
        self._x = x
        self._y = y
        self._w = w
        self._h = h

    def draw(self) -> None:
        self._renderer.render_rect(self._x, self._y, self._w, self._h)

    def move(self, dx: float, dy: float) -> None:
        self._x += dx
        self._y += dy


class Triangle(Shape):
    def __init__(self, cx: float, cy: float, size: float, renderer: Renderer):
        super().__init__(renderer)
        self._cx = cx
        self._cy = cy
        self._size = size

    def draw(self) -> None:
        h = self._size * math.sqrt(3) / 2
        x1, y1 = self._cx, self._cy - h * 2 / 3
        x2, y2 = self._cx - self._size / 2, self._cy + h / 3
        x3, y3 = self._cx + self._size / 2, self._cy + h / 3
        self._renderer.render_line(x1, y1, x2, y2)
        self._renderer.render_line(x2, y2, x3, y3)
        self._renderer.render_line(x3, y3, x1, y1)

    def move(self, dx: float, dy: float) -> None:
        self._cx += dx
        self._cy += dy


svg = SVGRenderer()
canvas = CanvasRenderer()

print("=== SVG output ===")
shapes_svg: list[Shape] = [
    Circle(50, 50, 30, svg),
    Rectangle(10, 10, 100, 60, svg),
    Triangle(80, 80, 40, svg),
]
for s in shapes_svg:
    s.draw()

print("\n=== Canvas output ===")
shapes_canvas: list[Shape] = [
    Circle(50, 50, 30, canvas),
    Rectangle(10, 10, 100, 60, canvas),
]
for s in shapes_canvas:
    s.draw()

print("\n=== Runtime swap: Circle switches from SVG to Canvas ===")
c = Circle(100, 100, 25, svg)
c.draw()
c._renderer = canvas
c.draw()
```

Thêm `EllipseShape` không cần sửa `Renderer`. Thêm `OpenGLRenderer` không cần sửa `Circle`, `Rectangle`, hay `Triangle`.

### Worked Example — Notification Bridge

Bài toán thực tế: hệ thống thông báo có hai chiều thay đổi độc lập — **loại thông báo** (Alert, Reminder, Report) và **kênh gửi** (Email, SMS, Slack).

```python
from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class Message:
    subject: str
    body: str
    priority: str = "normal"


class NotificationChannel(ABC):
    @abstractmethod
    def send(self, recipient: str, message: Message) -> bool: ...

    @abstractmethod
    def supports_priority(self) -> bool: ...


class EmailChannel(NotificationChannel):
    def send(self, recipient: str, message: Message) -> bool:
        prefix = f"[{message.priority.upper()}] " if self.supports_priority() else ""
        print(f"[Email] To: {recipient}")
        print(f"  Subject: {prefix}{message.subject}")
        print(f"  Body: {message.body[:60]}...")
        return True

    def supports_priority(self) -> bool:
        return True


class SMSChannel(NotificationChannel):
    MAX_LENGTH = 160

    def send(self, recipient: str, message: Message) -> bool:
        text = f"{message.subject}: {message.body}"
        if len(text) > self.MAX_LENGTH:
            text = text[:self.MAX_LENGTH - 3] + "..."
        print(f"[SMS] To: {recipient} | {text}")
        return True

    def supports_priority(self) -> bool:
        return False


class SlackChannel(NotificationChannel):
    def send(self, recipient: str, message: Message) -> bool:
        emoji = {"high": "🔴", "normal": "🔵", "low": "⚪"}.get(message.priority, "🔵")
        print(f"[Slack] #{recipient} {emoji} *{message.subject}*\n  {message.body}")
        return True

    def supports_priority(self) -> bool:
        return True


class Notification(ABC):
    def __init__(self, channel: NotificationChannel):
        self._channel = channel

    def set_channel(self, channel: NotificationChannel) -> None:
        self._channel = channel

    @abstractmethod
    def notify(self, recipient: str, **kwargs) -> bool: ...


class AlertNotification(Notification):
    def notify(self, recipient: str, **kwargs) -> bool:
        msg = Message(
            subject=f"ALERT: {kwargs.get('title', 'System Alert')}",
            body=kwargs.get('description', ''),
            priority="high",
        )
        return self._channel.send(recipient, msg)


class ReminderNotification(Notification):
    def notify(self, recipient: str, **kwargs) -> bool:
        msg = Message(
            subject=f"Reminder: {kwargs.get('event', '')}",
            body=f"Due: {kwargs.get('due_date', 'TBD')}. {kwargs.get('notes', '')}",
            priority="normal",
        )
        return self._channel.send(recipient, msg)


class ReportNotification(Notification):
    def notify(self, recipient: str, **kwargs) -> bool:
        rows = kwargs.get('data', [])
        body = f"Report contains {len(rows)} records. Summary: {kwargs.get('summary', '')}"
        msg = Message(
            subject=f"Report: {kwargs.get('title', 'Weekly Report')}",
            body=body,
            priority="low",
        )
        return self._channel.send(recipient, msg)


email = EmailChannel()
sms = SMSChannel()
slack = SlackChannel()

alert = AlertNotification(slack)
alert.notify("ops-team", title="DB Connection Pool Exhausted",
             description="Max connections reached on prod-db-01")

reminder = ReminderNotification(email)
reminder.notify("alice@example.com", event="Sprint Planning",
                due_date="2026-03-26 10:00", notes="Bring capacity estimates")

report = ReportNotification(sms)
report.notify("+84-900-000-001", title="Daily Sales",
              data=list(range(42)), summary="Revenue $12,450")

print("\n=== Runtime channel swap ===")
reminder.set_channel(slack)
reminder.notify("alice", event="Code Review", due_date="2026-03-26 14:00")
```

Thêm `PushNotificationChannel` chỉ cần tạo class mới implement `NotificationChannel`. Thêm `DigestNotification` chỉ cần tạo class mới kế thừa `Notification`. Hai chiều hoàn toàn độc lập.

### Trade-offs của Bridge

**Ưu điểm:** Tránh class explosion khi có nhiều chiều thay đổi độc lập. Tuân thủ OCP và SRP. Cho phép swap implementation lúc runtime.

**Nhược điểm:** Thêm một lớp indirection — code phức tạp hơn với hệ thống đơn giản. Cần nhận ra được hai chiều thay đổi độc lập ngay từ đầu thiết kế.

---

## So sánh Composite và Bridge

| Tiêu chí | Composite | Bridge |
|----------|-----------|--------|
| **Vấn đề giải quyết** | Xử lý đồng nhất cấu trúc cây | Tách hai chiều thay đổi độc lập |
| **Cấu trúc** | Cây đệ quy, leaf + composite | Hai hierarchy song song |
| **Mối quan hệ** | Leaf và Composite cùng interface | Abstraction giữ reference đến Implementation |
| **Khi nào dùng** | File system, UI tree, org chart | Shape+Renderer, Notification+Channel |

---

## Summary / Key Takeaways

- **Composite** cho phép client xử lý leaf và composite **đồng nhất** qua interface chung — xây dựng cấu trúc cây không giới hạn độ sâu.
- Đệ quy là cơ chế cốt lõi của Composite — `operation()` trên Composite delegate xuống tất cả children.
- **Bridge** tách **abstraction** (cái gì) khỏi **implementation** (làm như thế nào) — hai hierarchy thay đổi độc lập, liên kết qua composition.
- Bridge giải quyết "cartesian product problem": M loại abstraction × N loại implementation → M + N class thay vì M × N.
- Cả hai pattern đều dùng composition thay vì inheritance — phản ánh nguyên tắc "favor composition over inheritance" từ Lesson 01.

---

## References

- Gamma et al. — *Design Patterns*, Ch. 4: Composite tr.163, Bridge tr.151
- Refactoring.Guru — Composite: https://refactoring.guru/design-patterns/composite/python/example
- Refactoring.Guru — Bridge: https://refactoring.guru/design-patterns/bridge/python/example
