---
title: "GoF Design Patterns"
tags: [design-patterns, gof, index]
created: 2026-03-24
---

## Navigation

- [[00-roadmap|00. Roadmap]]

## Lessons

- [[01-foundations|01. Foundations — SOLID & OOP nâng cao]] — Tại sao cần design pattern, nguyên lý SOLID, composition vs inheritance, UML class diagram cơ bản. Nền tảng tư duy cho toàn bộ khóa học.
- [[02-singleton-factory-method|02. Singleton & Factory Method]] — Kiểm soát việc tạo object: đảm bảo duy nhất một instance (Singleton, thread-safe với double-checked locking) và tách logic khởi tạo khỏi client code (Factory Method). Worked examples: AppLogger, Notification System đa môi trường.
- [[03-abstract-factory-builder|03. Abstract Factory & Builder]] — Abstract Factory nhóm các factory liên quan để đảm bảo tính nhất quán của product family (UI cross-platform, Database backends). Builder xây dựng object phức tạp từng bước với fluent interface và Director (QueryBuilder, Report System).
- [[04-prototype|04. Prototype]] — Clone object thay vì tạo mới từ đầu: shallow vs deep copy, Prototype Registry để quản lý nhiều template, override `__deepcopy__` cho kiểm soát chính xác. Worked examples: GameUnit template, Document Template System.

- [[05-adapter-facade|05. Adapter & Facade]] — Adapter chuyển đổi interface không tương thích (Payment Gateway, Data Source pipeline). Facade đơn giản hóa hệ thống con phức tạp (Home Theater, Order Processing với rollback). Bảng so sánh Adapter vs Facade.
- [[06-decorator-proxy|06. Decorator & Proxy]] — Decorator xếp chồng hành vi lúc runtime không sửa class gốc (Message Pipeline, Data Processing Pipeline). Python `@decorator` syntax và GoF pattern. Proxy kiểm soát truy cập: Virtual (lazy init), Protection (permissions), Audit (trail log).
- [[07-composite-bridge|07. Composite & Bridge]] — Composite xây dựng cấu trúc cây xử lý đồng nhất leaf và composite (File System, UI Component Tree). Bridge tách abstraction khỏi implementation để thay đổi độc lập (Shape+Renderer, Notification+Channel). Giải quyết M×N class explosion.
- [[08-flyweight|08. Flyweight]] — Chia sẻ intrinsic state bất biến giữa hàng nghìn object để tiết kiệm bộ nhớ (Bullet System, Text Editor). Flyweight Factory, `@lru_cache` idiom, đo lường tiết kiệm bộ nhớ thực tế. Kết thúc nhóm Structural.
- [[09-strategy-template-method|09. Strategy & Template Method]] — Strategy đóng gói thuật toán hoán đổi được lúc runtime qua composition (Sorting, Payment Processing). Template Method định nghĩa khung cố định, subclass điền chi tiết qua inheritance (Data Importer, Report Generator). Mở đầu nhóm Behavioral.

- [[10-observer-mediator|10. Observer & Mediator]] — Observer thiết lập one-to-many dependency (Stock Market, Django-style Signal). Mediator tập trung giao tiếp many-to-many vào hub (Chat Room, Air Traffic Control). Event-driven architecture nền tảng.
- [[11-command-chain-of-responsibility|11. Command & Chain of Responsibility]] — Command đóng gói request thành object có undo/redo (Text Editor history, Macro TaskQueue). CoR truyền request qua chuỗi handler (Support Escalation, HTTP Middleware Pipeline).
- [[12-iterator-visitor|12. Iterator & Visitor]] — Iterator duyệt collection không lộ cấu trúc; Python `__iter__`/`__next__` built-in (BinaryTree traversal, Paginated API). Visitor thêm thao tác mới không sửa class qua double dispatch (AST Evaluator+Optimizer, Composite FileSystem Report).

- [[13-state-memento|13. State & Memento]] — State đóng gói behavior theo trạng thái, tự chuyển đổi (Vending Machine, Order Lifecycle). Memento lưu snapshot không vi phạm encapsulation (Text Editor với undo/redo stack).
- [[14-interpreter|14. Interpreter]] — Grammar rules ánh xạ thành class hierarchy; evaluate bằng đệ quy trên cây AST. Boolean Rule Engine, recursive descent parser số học, Template Engine với conditional và loop.
- [[15-combinations-architecture|15. Pattern Combinations & Real-world Architecture]] — Mini e-commerce system kết hợp 8+ pattern (Singleton, Composite, Strategy, Observer, Abstract Factory, State, Facade, Command). Pattern trong Python stdlib. Nguyên tắc chọn pattern và tránh over-engineering.

## Appendices

- [[a0-pattern-cheatsheet|A0. Pattern Quick Reference Cheatsheet]] — Bảng tham khảo nhanh 23 pattern: vấn đề, cơ chế, khi dùng. So sánh các pattern hay nhầm. Snippet code chuẩn. Checklist chọn pattern theo vấn đề.
- [[a1-anti-patterns|A1. Anti-patterns & Common Pitfalls]] — 8 anti-pattern phổ biến: over-engineering, God Object, Singleton abuse, inheritance hell, anemic domain model, premature abstraction, observer memory leak, Command without undo planning.

## Tool & Library Guide

| Tool / Library | Purpose | Install |
|----------------|---------|---------|
| Python 3.10+ | Ngôn ngữ chính cho tất cả examples | — |
| `abc` (stdlib) | Abstract Base Class — định nghĩa interface | stdlib |
| `dataclasses` | Giảm boilerplate cho data objects | stdlib |
| `copy` | Deep copy / shallow copy cho Prototype | stdlib |
| `functools` | `@cache`, `lru_cache` — liên quan Flyweight | stdlib |
| `typing` | Type hints cho code rõ ràng hơn | stdlib |

## Pattern Reference

| Pattern | Nhóm | Lesson |
|---------|-------|--------|
| Singleton | Creational | [[02-singleton-factory-method\|02]] |
| Factory Method | Creational | [[02-singleton-factory-method\|02]] |
| Abstract Factory | Creational | [[03-abstract-factory-builder\|03]] |
| Builder | Creational | [[03-abstract-factory-builder\|03]] |
| Prototype | Creational | [[04-prototype\|04]] |
| Adapter | Structural | [[05-adapter-facade\|05]] |
| Facade | Structural | [[05-adapter-facade\|05]] |
| Decorator | Structural | [[06-decorator-proxy\|06]] |
| Proxy | Structural | [[06-decorator-proxy\|06]] |
| Composite | Structural | [[07-composite-bridge\|07]] |
| Bridge | Structural | [[07-composite-bridge\|07]] |
| Flyweight | Structural | [[08-flyweight\|08]] |
| Strategy | Behavioral | [[09-strategy-template-method\|09]] |
| Template Method | Behavioral | [[09-strategy-template-method\|09]] |
| Observer | Behavioral | [[10-observer-mediator\|10]] |
| Mediator | Behavioral | [[10-observer-mediator\|10]] |
| Command | Behavioral | [[11-command-chain-of-responsibility\|11]] |
| Chain of Responsibility | Behavioral | [[11-command-chain-of-responsibility\|11]] |
| Iterator | Behavioral | [[12-iterator-visitor\|12]] |
| Visitor | Behavioral | [[12-iterator-visitor\|12]] |
| State | Behavioral | [[13-state-memento\|13]] |
| Memento | Behavioral | [[13-state-memento\|13]] |
| Interpreter | Behavioral | [[14-interpreter\|14]] |

## Notation Guide

| Ký hiệu / Thuật ngữ | Ý nghĩa |
|--------------------|---------|
| `ABC` | Abstract Base Class — class không thể instantiate trực tiếp |
| `@abstractmethod` | Method bắt buộc phải override ở subclass |
| `concrete class` | Class implement đầy đủ, có thể tạo instance |
| `client` | Code sử dụng pattern — không biết chi tiết implementation |
| `interface` | Tập hợp method signatures; trong Python thường dùng ABC |
| composition | Object chứa object khác như attribute (`has-a`) |
| inheritance | Kế thừa class (`is-a`) |
| delegation | Object A giao việc cho object B xử lý |
| coupling | Mức độ phụ thuộc giữa các module — thấp là tốt |
| cohesion | Mức độ liên kết logic bên trong một module — cao là tốt |
