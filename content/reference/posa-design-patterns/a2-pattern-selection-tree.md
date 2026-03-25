---
title: "A2. Pattern Selection Decision Tree"
tags: [software-architecture, posa, design-pattern, decision-tree, reference, appendix]
aliases: [Pattern Selection, Decision Tree]
created: 2026-03-24
---

> **Mục đích**: Công cụ chọn pattern nhanh khi đứng trước bài toán mới. Đi theo cây quyết định từ trên xuống — dừng tại node lá để có recommendation.
>
> **Lưu ý quan trọng**: Cây này là *điểm bắt đầu*, không phải câu trả lời cuối cùng. Sau khi có recommendation, đọc đầy đủ Consequences của pattern đó và kiểm tra xem Forces có thực sự khớp không.

---

## Cây Quyết định Chính

```mermaid
graph TD
    ROOT["Bài toán thiết kế của bạn là gì?"]

    ROOT --> A["Phân rã / cấu trúc<br>một hệ thống lớn"]
    ROOT --> B["Giao tiếp giữa<br>các component"]
    ROOT --> C["Xử lý đồng thời<br>và concurrency"]
    ROOT --> D["Quản lý hành động<br>người dùng"]
    ROOT --> E["Giao diện người dùng<br>tương tác"]

    A --> A1{"Ranh giới phân rã<br>theo nguyên tắc nào?"}
    A1 -->|"Mức trừu tượng<br>(concrete → abstract)"| LAYERS["→ Layers"]
    A1 -->|"Bước biến đổi data<br>(stream)"| PF["→ Pipes & Filters"]
    A1 -->|"Tri thức chuyên biệt<br>(phi tuyến)"| BB["→ Blackboard"]
    A1 -->|"Core ổn định +<br>Extensions biến đổi"| MK["→ Microkernel"]

    B --> B1{"Coupling mong muốn?"}
    B1 -->|"Client không biết<br>server ở đâu"| BROKER["→ Broker"]
    B1 -->|"Publisher không biết<br>subscriber"| PUBSUB["→ Publisher-Subscriber"]
    B1 -->|"Object cần giao tiếp<br>in-process"| MED["→ Mediator (GoF)"]

    C --> C1{"Loại workload?"}
    C1 -->|"I/O-bound,<br>nhiều connection"| C2{"Cần async I/O<br>OS-level?"}
    C2 -->|"Không — sync<br>non-blocking đủ"| REACT["→ Reactor"]
    C2 -->|"Có — OS thực<br>hiện I/O"| PROACT["→ Proactor"]
    C1 -->|"Method call<br>không blocking"| AO["→ Active Object"]
    C1 -->|"Thread-safe<br>shared object"| MO["→ Monitor Object"]
    C1 -->|"Mix async I/O +<br>blocking business logic"| HSHA["→ Half-Sync/Half-Async"]

    D --> D1{"Yêu cầu gì?"}
    D1 -->|"Undo/Redo,<br>audit, macro"| CMD["→ Command Processor"]
    D1 -->|"Non-blocking +<br>history"| CMDAO["→ Command + Active Object"]

    E --> E1{"Số lượng widget?"}
    E1 -->|"Một data model,<br>nhiều view"| MVC["→ MVC"]
    E1 -->|"Nhiều widget độc lập<br>với data riêng"| PAC["→ PAC"]

    style LAYERS fill:#4a6fa5,color:#fff
    style PF fill:#4a6fa5,color:#fff
    style BB fill:#4a6fa5,color:#fff
    style MK fill:#4a6fa5,color:#fff
    style BROKER fill:#47a8bd,color:#fff
    style PUBSUB fill:#47a8bd,color:#fff
    style REACT fill:#62c370,color:#fff
    style PROACT fill:#62c370,color:#fff
    style AO fill:#62c370,color:#fff
    style MO fill:#62c370,color:#fff
    style HSHA fill:#62c370,color:#fff
    style CMD fill:#f0a500,color:#fff
    style CMDAO fill:#f0a500,color:#fff
    style MVC fill:#9b59b6,color:#fff
    style PAC fill:#9b59b6,color:#fff
```

---

## Cây Phụ 1 — Chọn giữa Layers, P&F, Blackboard

Ba pattern này cùng nhóm *Structural Decomposition* nhưng giải quyết bài toán rất khác nhau:

```mermaid
graph TD
    Q1{"Dữ liệu chảy<br>một chiều?"}
    Q1 -->|"Không — request/response<br>hai chiều"| LAYERS["→ Layers"]
    Q1 -->|"Có — stream<br>một chiều"| Q2{"Cần shared state<br>giữa các bước?"}
    Q2 -->|"Không — mỗi bước<br>stateless"| PF["→ Pipes & Filters"]
    Q2 -->|"Có — nhiều bước<br>đọc kết quả nhau"| Q3{"Thứ tự bước<br>biết trước?"}
    Q3 -->|"Có — pipeline tĩnh"| PF_HYBRID["→ P&F + context object<br>(truyền state qua data)"]
    Q3 -->|"Không — phi tuyến<br>phi tất định"| BB["→ Blackboard"]

    style LAYERS fill:#4a6fa5,color:#fff
    style PF fill:#4a6fa5,color:#fff
    style PF_HYBRID fill:#47a8bd,color:#fff
    style BB fill:#4a6fa5,color:#fff
    style Q1 fill:#e05c5c,color:#fff
    style Q2 fill:#e05c5c,color:#fff
    style Q3 fill:#e05c5c,color:#fff
```

---

## Cây Phụ 2 — Chọn giữa Reactor, Proactor, Active Object

Ba pattern concurrency này hay bị nhầm vì cùng giải quyết "không muốn blocking":

```mermaid
graph TD
    Q1{"Bài toán<br>blocking ở đâu?"}
    Q1 -->|"I/O — đọc socket,<br>file, network"| Q2{"OS platform<br>hỗ trợ true async I/O?"}
    Q2 -->|"Có — IOCP, io_uring<br>(hoặc dùng asyncio)"| PROACT["→ Proactor<br>(asyncio)"]
    Q2 -->|"Không cần / muốn<br>portable"| REACT["→ Reactor<br>(selectors)"]
    Q1 -->|"CPU — tính toán<br>nặng"| Q3{"Cần kết quả<br>ngay không?"}
    Q3 -->|"Không — trả Future,<br>lấy sau"| AO["→ Active Object"]
    Q3 -->|"Có — nhưng<br>không muốn block"| HSHA["→ Half-Sync/Half-Async<br>+ asyncio.run_in_executor"]
    Q1 -->|"Database / external<br>service call"| AO2["→ Active Object<br>hoặc asyncio coroutine"]

    style PROACT fill:#62c370,color:#fff
    style REACT fill:#62c370,color:#fff
    style AO fill:#62c370,color:#fff
    style HSHA fill:#62c370,color:#fff
    style AO2 fill:#62c370,color:#fff
    style Q1 fill:#e05c5c,color:#fff
    style Q2 fill:#e05c5c,color:#fff
    style Q3 fill:#e05c5c,color:#fff
```

---

## Cây Phụ 3 — Chọn giữa Broker, Mediator, Publisher-Subscriber

Cả ba đều là "trung gian" nhưng ở level rất khác nhau:

```mermaid
graph TD
    Q1{"Components ở<br>đâu so với nhau?"}
    Q1 -->|"Cross-process<br>hoặc cross-network"| Q2{"Cần location<br>transparency?"}
    Q2 -->|"Có — client không biết<br>server ở đâu"| BROKER["→ Broker"]
    Q2 -->|"Không — chỉ cần<br>name resolution"| CDS["→ Client-Dispatcher-Server"]
    Q1 -->|"In-process<br>cùng codebase"| Q3{"Coupling mong muốn?"}
    Q3 -->|"Zero coupling —<br>pub không biết sub"| PUBSUB["→ Publisher-Subscriber<br>(Event Bus)"]
    Q3 -->|"Biết interface nhau<br>nhưng giảm direct ref"| MED["→ Mediator (GoF)"]
    Q3 -->|"Subject biết Observer<br>qua interface"| OBS["→ Observer (GoF)<br>/ MVC"]

    style BROKER fill:#47a8bd,color:#fff
    style CDS fill:#47a8bd,color:#fff
    style PUBSUB fill:#47a8bd,color:#fff
    style MED fill:#47a8bd,color:#fff
    style OBS fill:#9b59b6,color:#fff
    style Q1 fill:#e05c5c,color:#fff
    style Q2 fill:#e05c5c,color:#fff
    style Q3 fill:#e05c5c,color:#fff
```

---

## Cây Phụ 4 — Microkernel vs. Layers vs. Broker

```mermaid
graph TD
    Q1{"Mục tiêu chính<br>của kiến trúc?"}
    Q1 -->|"Thêm tính năng mới<br>không sửa core"| MK["→ Microkernel"]
    Q1 -->|"Thay thế implementation<br>không sửa caller"| LAYERS["→ Layers"]
    Q1 -->|"Gọi service từ xa<br>không biết location"| BROKER["→ Broker"]
    Q1 -->|"Cả extensibility<br>VÀ location transparency"| COMBO["→ Microkernel (local)<br>+ Broker (remote)"]

    style MK fill:#4a6fa5,color:#fff
    style LAYERS fill:#4a6fa5,color:#fff
    style BROKER fill:#47a8bd,color:#fff
    style COMBO fill:#e05c5c,color:#fff
    style Q1 fill:#f0a500,color:#fff
```

---

## Scoring Matrix — Khi cần so sánh định lượng

Khi đã rút ngắn xuống 2–3 pattern ứng viên, dùng scoring matrix để chọn:

**Bước 1**: Liệt kê Forces quan trọng với hệ thống của bạn.
**Bước 2**: Đánh trọng số cho từng force (1–5).
**Bước 3**: Với mỗi pattern ứng viên, đánh điểm khả năng thỏa mãn force đó (1–5).
**Bước 4**: Tổng điểm có trọng số = `sum(weight × score)`.

Ví dụ so sánh Layers vs. Microkernel cho một product IDE:

| Force | Trọng số | Layers | Microkernel |
|-------|---------|--------|-------------|
| Changeability (sửa layer) | 4 | 5 × 4 = 20 | 3 × 4 = 12 |
| Extensibility (thêm plugin) | 5 | 2 × 5 = 10 | 5 × 5 = 25 |
| Performance | 3 | 4 × 3 = 12 | 3 × 3 = 9 |
| Simplicity | 2 | 4 × 2 = 8 | 2 × 2 = 4 |
| **Total** | | **50** | **50** |

Điểm bằng nhau → không có winner rõ ràng → cân nhắc **kết hợp**: Layers cho cấu trúc nội bộ của IDE core, Microkernel cho plugin system.

---

## Red Flags — Khi bạn đang chọn sai pattern

| Red flag | Nguyên nhân có thể | Hành động |
|----------|-------------------|----------|
| Thêm feedback loop vào Pipes & Filters | Bài toán cần shared state | Chuyển sang Blackboard hoặc dùng context object |
| Broker nhưng tất cả service cùng process | Overkill — unnecessary overhead | Dùng Mediator (GoF) hoặc EventBus |
| Layers nhưng method `getX()` lặp lại qua 5 layer | Lasagna Architecture | Chuyển sang Relaxed Layering |
| Active Object nhưng method chạy dưới 1ms | Over-engineering | Dùng Monitor Object hoặc simple Lock |
| Command Processor nhưng action không reversible | Command.undo() không implement được | Dùng event log + compensating transaction thay vì undo |
| PAC nhưng app chỉ có 2–3 widget | Over-engineering | Dùng MVC đủ rồi |
| Pub/Sub nhưng cần guaranteed ordering | Async dispatch phá vỡ ordering | Dùng synchronous Observer hoặc event queue với serial dispatch |

---

## Pattern Combination Recipes

### Recipe 1 — Web API Server (I/O-heavy)
```text
Proactor (asyncio event loop)
  + Layers (Domain / Infrastructure / Presentation)
  + Publisher-Subscriber (domain events)
```

### Recipe 2 — IDE / Plugin-based Tool
```text
Microkernel (plugin registry)
  + MVC (editor panel per file)
  + Publisher-Subscriber (cross-plugin events)
  + Command Processor (Undo/Redo)
```

### Recipe 3 — Distributed Microservices
```text
Broker (service discovery + API gateway)
  + Layers (per-service internal architecture)
  + Publisher-Subscriber (cross-service events via Kafka/RabbitMQ)
  + Monitor Object (per-service shared cache)
```

### Recipe 4 — Real-time Data Pipeline
```text
Reactor (ingest stream dari sensors)
  + Pipes & Filters (transform pipeline)
  + Blackboard (anomaly detection — phi tuyến)
  + Active Object (heavy ML inference không block ingest)
```

### Recipe 5 — Desktop GUI App
```text
MVC (main data model + views)
  + Command Processor (Undo/Redo)
  + Publisher-Subscriber (cross-component events)
  + Active Object (long operations — save file, network call)
```

---

## Tóm tắt nhanh — 1 câu mỗi pattern

| Pattern | Chọn khi... |
|---------|------------|
| **Layers** | Hệ thống có nhiều mức trừu tượng, cần thay thế từng mức độc lập |
| **Pipes & Filters** | Xử lý data theo chuỗi bước stateless có thể tái dùng và tái sắp xếp |
| **Blackboard** | Bài toán phi tuyến cần nhiều "chuyên gia" hợp tác mà không biết trước thứ tự |
| **Broker** | Client cần gọi service từ xa mà không biết và không cần biết location |
| **MVC** | Cùng data cần hiển thị nhiều cách, View phải sync tự động khi data thay đổi |
| **PAC** | Nhiều widget có data riêng cần giao tiếp qua hierarchy agent |
| **Microkernel** | Core ổn định cần mở rộng bởi plugin từ bên thứ ba mà không sửa core |
| **Reactor** | Xử lý hàng nghìn I/O connection đồng thời với một thread |
| **Proactor** | Tận dụng async I/O của OS, throughput tối đa với asyncio |
| **Active Object** | Method tốn thời gian cần chạy non-blocking, kết quả qua Future |
| **Monitor Object** | Nhiều thread truy cập shared object, cần serialize đơn giản |
| **Publisher-Subscriber** | Publisher và subscriber hoàn toàn không biết nhau, routing theo topic |
| **Command Processor** | Mỗi hành động người dùng cần Undo/Redo, audit log, hoặc macro |

---

## References

- [[11-tradeoff-and-composition|11. Trade-off & Pattern Composition]] — Master trade-off table và Pattern Language
- [[a0-pattern-anatomy-cheatsheet|A0. Pattern Anatomy Cheatsheet]] — Template đầy đủ đọc/viết pattern
- [[a1-python-implementation-gallery|A1. Python Implementation Gallery]] — Snippet tối giản cho từng pattern
- Frank Buschmann et al. — *POSA Vol. 1*, Chapter 1: Introduction — Pattern Selection
