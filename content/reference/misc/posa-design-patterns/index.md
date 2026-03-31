---
title: "Pattern-Oriented Software Architecture (PoSA)"
tags: [software-architecture, posa, design-pattern, index]
created: 2026-03-24
---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[01-pattern-system|01. Pattern System — Nền tảng tư duy]] — Pattern là gì, 3 cấp độ (Architectural / Design / Idiom), anatomy đầy đủ của một pattern, Forces vs Consequences, Pattern Language vs Pattern System, framework tư duy 5 chiều.
- [[02-layers|02. Layers — Phân tầng hệ thống]] — Anatomy đầy đủ Layers pattern, Strict vs. Relaxed layering, Black/Gray/White-box interface, anti-pattern Lasagna Architecture, implementation Python 3 layer hoàn chỉnh (LibrarySystem), trade-off vs. Pipes & Filters.
- [[03-pipes-and-filters|03. Pipes & Filters — Luồng dữ liệu]] — Anatomy đầy đủ P&F pattern, 4 kịch bản luồng (Push/Pull/Mixed/Concurrent), 3 biến thể Python (sequential, lazy generator, concurrent queue), so sánh chiều sâu với Layers, khi nào KHÔNG dùng P&F.
- [[04-blackboard|04. Blackboard — Giải quyết vấn đề phi tất định]] — Anatomy Blackboard pattern, 3 thành phần (Blackboard / KnowledgeSource / Control), condition-part vs. action-part, 3 chiến lược lập lịch (Opportunistic / Forward / Backward chaining), implementation Python TextAnalysisBB có verify, variants Repository & Production System, so sánh chiều sâu với P&F.
- [[05-broker|05. Broker — Hệ thống phân tán]] — Anatomy Broker pattern, 5 thành phần (Client/Server/Broker/Client-Proxy/Server-Proxy), marshalling/unmarshalling, Bridge cho đa-broker, implementation Python đầy đủ có verify, variants (Direct/Indirect/Federated), so sánh với Client-Dispatcher-Server và Mediator, trade-off transparency vs. performance.
- [[06-mvc-and-pac|06. MVC & PAC — Giao diện tương tác]] — MVC anatomy + Observer push/pull notification, variants (MVP/MVVM), PAC hierarchy (top/intermediate/bottom agent), quy tắc Presentation-Abstraction không giao tiếp trực tiếp, implementation Python cả hai có verify, so sánh chiều sâu MVC vs PAC, khi nào web MVC khác MVC gốc.
- [[07-microkernel|07. Microkernel — Hệ thống co giãn]] — Anatomy 5 thành phần PoSA (Microkernel/Internal Server/External Server/Adapter/Client), Plugin Registry, contract versioning risks, implementation Python đầy đủ (TextProcessingCore + 5 plugin + TruncatorAdapter) có verify, hot-swap pipeline demo, so sánh với Layers.
- [[08-reactor-and-proactor|08. Reactor & Proactor — Event-Driven]] — C10K problem motivation, Reactor anatomy (Handle/EventHandler/Demultiplexer/Dispatcher), Proactor anatomy (AsyncProcessor/CompletionQueue/CompletionHandler), sự khác biệt "ready" vs "complete", implementation Python selectors (Reactor) + asyncio (Proactor) có verify, multi-thread Reactor với Half-Sync/Half-Async preview.
- [[09-active-object-and-monitor|09. Active Object & Monitor Object — Concurrency]] — Monitor Object (Lock+Condition, BoundedBuffer producer-consumer), Active Object 6 thành phần (Proxy/MethodRequest/ActivationQueue/Scheduler/Servant/Future), so sánh cốt lõi mượn-thread vs. thread-riêng, Half-Sync/Half-Async (asyncio + thread pool), tất cả có verify.
- [[10-publisher-subscriber-command|10. Publisher-Subscriber & Command Processor]] — Pub/Sub vs Observer (bảng so sánh), Push vs Pull delivery, Event Bus implementation Python với topic-based routing, Command Processor với undo/redo stack, kết hợp tự nhiên Pub/Sub + Command trong event-sourced architecture, tất cả có verify.
- [[11-tradeoff-and-composition|11. Trade-off & Pattern Composition]] — Master trade-off table (13 pattern × 6 chiều), Pattern Selection Heuristics (4 nhóm bài toán), 3 loại conflict khi kết hợp (structural/behavioral/performance), WMS case study kết hợp 8 pattern, Pattern Language flowchart tổng thể, 5 quy tắc composition thực hành, retrospective bảng so sánh cặp dễ nhầm.

## Appendices

- [[a0-pattern-anatomy-cheatsheet|A0. Pattern Anatomy Cheatsheet]] — Template đầy đủ PoSA format (Name/Context/Problem/Forces/Solution/Consequences/Known Uses), quick reference 13 pattern, anti-pattern recognition table.
- [[a1-python-implementation-gallery|A1. Python Implementation Gallery]] — Snippet tối giản đã verify cho 12 pattern, 4 combination recipes (Layers+Repo, Reactor+HSHA, Pub/Sub+Command, Microkernel+Broker).
- [[a2-pattern-selection-tree|A2. Pattern Selection Decision Tree]] — 5 cây quyết định (main + 4 cây phụ theo nhóm), scoring matrix template, red flags khi chọn sai, 5 combination recipes theo domain.

## Tool & Library Guide

| Tool / Library | Purpose | Install |
|----------------|---------|---------|
| `abc` (stdlib) | Abstract Base Classes — định nghĩa interface trong Python | built-in |
| `asyncio` (stdlib) | Event loop, coroutine — dùng cho Reactor/Proactor pattern | built-in |
| `threading` (stdlib) | Thread, Lock, Condition — dùng cho Monitor Object, Active Object | built-in |
| `queue` (stdlib) | Thread-safe queue — dùng cho Active Object, Half-Sync/Half-Async | built-in |
| `typing` | Type hints — làm rõ contract trong Python | built-in |

## Notation & Thuật ngữ

| Thuật ngữ | Nghĩa |
|-----------|-------|
| Pattern | Giải pháp đã được kiểm chứng cho bài toán lặp lại trong context nhất định |
| Pattern Language | Tập hợp pattern có quan hệ với nhau, hướng dẫn xây dựng hệ thống hoàn chỉnh |
| Architectural Pattern | Pattern ở cấp độ kiến trúc toàn hệ thống |
| Design Pattern | Pattern ở cấp độ subsystem / component |
| Idiom | Pattern cấp thấp nhất, phụ thuộc ngôn ngữ lập trình |
| Forces | Các ràng buộc / yêu cầu cạnh tranh nhau mà pattern phải cân bằng |
| Consequences | Kết quả khi áp dụng pattern — cả lợi ích lẫn trade-off |
| Known Uses | Ví dụ thực tế đã áp dụng pattern trong sản phẩm/hệ thống thật |
