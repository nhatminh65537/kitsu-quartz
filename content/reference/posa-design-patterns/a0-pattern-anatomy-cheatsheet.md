---
title: "A0. Pattern Anatomy Cheatsheet"
tags: [software-architecture, posa, design-pattern, reference, appendix]
aliases: [Pattern Anatomy]
created: 2026-03-24
---

> **Mục đích**: Reference nhanh để đọc và viết bất kỳ PoSA pattern nào theo đúng format. Dùng khi gặp pattern mới hoặc khi cần trình bày thiết kế cho team.

---

## Template đầy đủ — PoSA Format

### Name

Tên ngắn gọn, gợi nhớ. Tên tạo ra vocabulary chung cho team — thay vì mô tả dài dòng, một tên đủ để team hiểu ngay kiến trúc.

> **Câu hỏi khi đọc**: Tên có phản ánh đúng ý tưởng cốt lõi không? Pattern này còn được gọi là gì khác?

### Also Known As

Các tên khác chỉ cùng pattern: thường xuất hiện trong ngôn ngữ cụ thể, framework cụ thể, hoặc cộng đồng cụ thể.

### Example (Motivating Example)

Một tình huống thực tế cụ thể đặt bài toán *trước khi* định nghĩa giải pháp. Ví dụ tốt phải:
- Dùng hệ thống thực (CORBA, Unix shell, Eclipse) chứ không phải bài toán giả tưởng
- Đặt được câu hỏi "Tại sao cách đơn giản không đủ?"
- Foreshadow solution mà không tiết lộ nó

> **Câu hỏi khi đọc**: Ví dụ này phản ánh bài toán của mình không? Hoặc bài toán của mình khác ở chỗ nào?

### Context

Mô tả tình huống tổng quát hơn ví dụ — điều kiện môi trường khiến pattern áp dụng được. Context phải đủ rộng để bao gồm nhiều bài toán cụ thể, đủ hẹp để phân biệt với context của pattern khác.

> **Câu hỏi khi đọc**: Hệ thống của mình có đúng context này không? Nếu không, pattern này có thể không phù hợp.

### Problem

Phát biểu bài toán dưới dạng câu hỏi: *"Làm thế nào để...?"*. Là bridge giữa Context (tình huống) và Forces (ràng buộc). Phải đủ cụ thể để khu biệt với Problem của pattern khác.

> **Câu hỏi khi đọc**: Đây có phải bài toán mình đang giải không? Hay mình đang giải một vấn đề khác và nhầm pattern?

### Forces

**Đây là phần quan trọng nhất.** Forces là các yêu cầu, ràng buộc, và áp lực **mâu thuẫn nhau** mà giải pháp phải cân bằng. Không có solution nào thỏa mãn tất cả forces hoàn hảo — pattern là sự thỏa hiệp có cân nhắc.

Mỗi force nên:
- Là một yêu cầu hợp lý đứng một mình
- Mâu thuẫn với ít nhất một force khác
- Không thể bỏ qua mà không làm system tệ đi

**Các force phổ biến trong PoSA:**

| Force | Mô tả |
|-------|-------|
| **Portability** | Code không phụ thuộc vào platform/hardware cụ thể |
| **Performance** | Latency, throughput, memory footprint |
| **Changeability** | Sửa một phần không ảnh hưởng phần khác |
| **Reusability** | Component dùng lại trong context khác |
| **Extensibility** | Thêm tính năng không sửa core |
| **Testability** | Kiểm thử độc lập từng phần |
| **Simplicity** | Code dễ hiểu, ít boilerplate |
| **Fault tolerance** | Component lỗi không crash toàn hệ thống |
| **Concurrency** | Nhiều thread/process truy cập đồng thời |
| **Location transparency** | Client không biết server ở đâu |

> **Câu hỏi khi đọc**: Forces này có khớp với bài toán thực của mình không? Force nào pattern này ưu tiên, force nào nó hy sinh?

### Solution

Mô tả giải pháp ở mức **structural** — các thành phần là gì và quan hệ tĩnh giữa chúng. Không phải algorithm step-by-step. Thường đi kèm với Structure diagram.

Solution phải giải thích *tại sao* nó cân bằng được các forces, không chỉ *là gì*.

### Structure

Diagram mô tả các thành phần (participants) và quan hệ tĩnh giữa chúng. Trong PoSA thường dùng UML class diagram hoặc component diagram.

**Các thành phần (participants) cần ghi rõ:**
- Tên và vai trò của từng thành phần
- Interface/contract mà thành phần đó cung cấp
- Quan hệ: association, dependency, inheritance, composition

### Dynamics

Sequence diagram hoặc collaboration diagram mô tả luồng tương tác **runtime**. Bao gồm ít nhất hai scenario:
1. **Scenario chính**: happy path bình thường
2. **Scenario biên**: edge case hoặc error case

> **Câu hỏi khi đọc**: Runtime flow này có phù hợp với requirement về latency/ordering của mình không?

### Implementation

Hướng dẫn cài đặt chi tiết, bao gồm:
- Các bước theo thứ tự để implement pattern
- Quyết định thiết kế phổ biến phải đối mặt (ví dụ: strict vs. relaxed layering)
- Cạm bẫy (pitfalls) và cách tránh
- Kết hợp với pattern khác nếu cần

### Example Resolved

Ví dụ ban đầu (từ phần *Example*) được giải quyết bằng pattern này. Phải cụ thể, có thể là pseudocode hoặc code thực. Cho thấy pattern "sống" ra sao trong thực tế.

### Variants

Các biến thể của pattern — cùng ý tưởng nhưng khác chi tiết implementation:
- Tên variant
- Khác gì so với pattern gốc
- Khi nào dùng variant

### Known Uses

**Ít nhất 3 ví dụ thực tế** — system thực, product thực, không phải ví dụ giả tưởng. Đây là bằng chứng pattern đã được kiểm chứng. Known uses cho thấy context nào pattern thực sự áp dụng được.

> **Câu hỏi khi đọc**: Known uses có tương tự domain của mình không? Nếu tất cả known uses là OS/systems programming nhưng mình làm web app, cần cẩn thận hơn khi áp dụng.

### Consequences

**Đây là phần thường bị đọc qua loa nhất — và nguy hiểm nhất nếu bỏ qua.**

Phải ghi rõ cả hai phía:
- **Benefits (lợi ích)**: Forces nào được thỏa mãn tốt
- **Liabilities (hạn chế)**: Forces nào bị hy sinh, và overhead/complexity thêm vào

> **Quy tắc vàng**: Nếu pattern bạn đang xem xét chỉ có benefits, không có liabilities — bạn chưa đọc kỹ, hoặc tài liệu đó viết sai.

### See Also

Các pattern liên quan:
- Pattern giải quyết bài toán tương tự nhưng với trade-off khác
- Pattern thường được kết hợp cùng
- Pattern là specialization hoặc generalization

---

## Quick Reference — Tất cả Pattern PoSA đã học

### Nhóm 1 — Structural Decomposition

| Pattern | Problem 1 câu | Solution 1 câu | Key Trade-off |
|---------|--------------|----------------|---------------|
| **Layers** | Làm sao phát triển từng phần độc lập? | Xếp chồng tầng trừu tượng, mỗi tầng chỉ biết tầng dưới | Changeability ↑, Performance ↓ |
| **Pipes & Filters** | Làm sao tái dùng bước xử lý data? | Chuỗi filter độc lập kết nối qua pipe | Recomposability ↑, Shared state ✗ |
| **Blackboard** | Làm sao nhiều chuyên gia giải bài toán phi tuyến? | Shared repo + KS đọc/ghi + Control lập lịch | Flexibility ↑, Performance ↓, Complexity ↑ |

### Nhóm 2 — Distributed & Communication

| Pattern | Problem 1 câu | Solution 1 câu | Key Trade-off |
|---------|--------------|----------------|---------------|
| **Broker** | Client không nên biết server ở đâu | Client-Proxy → Broker → Server-Proxy | Location transparency ↑, Latency ↑ |
| **Publisher-Subscriber** | Pub và Sub không nên biết nhau | Event Channel đứng giữa, routing theo topic | Decoupling ↑↑, Debuggability ↓ |

### Nhóm 3 — Interactive Systems

| Pattern | Problem 1 câu | Solution 1 câu | Key Trade-off |
|---------|--------------|----------------|---------------|
| **MVC** | UI và data đan xen | Model + View (Observer) + Controller | Separation ↑, Observer complexity ↑ |
| **PAC** | Nhiều widget độc lập cần giao tiếp | Hierarchy of Presentation-Abstraction-Control agents | Independence ↑↑, Overhead ↑ |

### Nhóm 4 — Adaptable Systems

| Pattern | Problem 1 câu | Solution 1 câu | Key Trade-off |
|---------|--------------|----------------|---------------|
| **Microkernel** | Thêm tính năng không sửa core | Minimal core + Plugin Registry + Extension Points | Extensibility ↑↑, Contract complexity ↑ |

### Nhóm 5 — Concurrency

| Pattern | Problem 1 câu | Solution 1 câu | Key Trade-off |
|---------|--------------|----------------|---------------|
| **Reactor** | Nhiều I/O connection, 1 thread | Sync demultiplexer + Event Handler dispatch | I/O concurrency ↑, CPU-bound blocks ✗ |
| **Proactor** | Tối đa throughput với async I/O | OS làm I/O, Completion Handler nhận kết quả | Throughput ↑↑, Buffer management phức tạp ↑ |
| **Active Object** | Method call không blocking | Proxy enqueue → Scheduler thread → Servant | Non-blocking ↑, Overhead ↑ |
| **Monitor Object** | Thread-safe shared object đơn giản | Synchronized methods + Condition Variables | Safety ↑, Caller vẫn block ↓ |

### Nhóm 6 — Action & Event

| Pattern | Problem 1 câu | Solution 1 câu | Key Trade-off |
|---------|--------------|----------------|---------------|
| **Command Processor** | Cần Undo/Redo và audit | Đóng gói hành động thành Command có execute+undo | Undo ↑, Memory (history) ↑ |

---

## Anti-Pattern Recognition

| Triệu chứng | Có thể là... | Xem bài |
|-------------|-------------|---------|
| Method `getX()` lặp lại qua 5 layer | Lasagna Architecture | [[02-layers\|02]] |
| Filter cần đọc state của filter khác | Không phải P&F thuần — cân nhắc Blackboard | [[03-pipes-and-filters\|03]], [[04-blackboard\|04]] |
| Client hard-code địa chỉ IP của server | Thiếu Broker | [[05-broker\|05]] |
| View gọi `model.save()` trực tiếp | MVC broken — View không được sửa Model | [[06-mvc-and-pac\|06]] |
| Core phải sửa mỗi khi thêm tính năng | Thiếu Microkernel | [[07-microkernel\|07]] |
| Event loop bị block vì handler chậm | Reactor handler phải non-blocking | [[08-reactor-and-proactor\|08]] |
| `threading.Lock()` acquire ở nhiều chỗ | Thiếu Monitor Object | [[09-active-object-and-monitor\|09]] |
| Publisher import EmailService, InventoryService | Thiếu Pub/Sub | [[10-publisher-subscriber-command\|10]] |
| Không có undo, chỉ confirm dialog | Cần Command Processor | [[10-publisher-subscriber-command\|10]] |

---

## Cách dùng Cheatsheet này

Khi gặp bài toán thiết kế mới, làm theo 3 bước:

**Bước 1 — Xác định nhóm bài toán** (dùng Quick Reference):
Bài toán thuộc nhóm nào? Structural Decomposition? Communication? Concurrency? Action?

**Bước 2 — Đọc Forces của pattern ứng viên**:
Pattern nào trong nhóm đó có Forces khớp với ràng buộc thực của mình? Đặc biệt: forces nào pattern đó *hy sinh* — mình có chấp nhận được không?

**Bước 3 — Kiểm tra Known Uses**:
Known uses có domain tương tự không? Nếu không có known use nào trong domain của mình, cần cẩn thận — pattern có thể không fit.

---

## References

- [[00-roadmap|00. Roadmap]] — Danh sách đầy đủ tất cả bài học
- [[11-tradeoff-and-composition|11. Trade-off & Pattern Composition]] — Master trade-off table và Pattern Selection Heuristics
- Frank Buschmann et al. — *POSA Vol. 1*, Appendix A: Pattern Template
