---
title: "12. Iterator & Visitor"
tags: [design-patterns, gof, behavioral, iterator, visitor, lesson-12]
aliases: [Iterator Pattern, Visitor Pattern]
created: 2026-03-24
---

> **Prerequisites**: [[01-foundations|01. Foundations]], [[07-composite-bridge|07. Composite & Bridge]], [[11-command-chain-of-responsibility|11. Command & Chain of Responsibility]]
> **Objectives**:
> - Hiểu Iterator: cung cấp cách duyệt tuần tự các phần tử của collection mà không lộ cấu trúc bên trong
> - Hiểu Visitor: thêm thao tác mới lên cấu trúc object mà không sửa các class trong cấu trúc đó
> - Thấy Python protocol `__iter__`/`__next__` là built-in implementation của Iterator pattern
> - Nhận ra Visitor như giải pháp tách "data structure" khỏi "algorithm" — đặc biệt mạnh với Composite tree

---

## Phần 1 — Iterator Pattern

### Vấn đề Iterator giải quyết

Collection có thể được lưu trữ theo nhiều cách khác nhau: list, tree, graph, queue... Client cần duyệt qua tất cả phần tử nhưng không muốn biết cách collection tổ chức nội bộ. Hơn nữa, cần có thể duyệt theo nhiều thứ tự khác nhau (forward, backward, breadth-first...) mà không sửa collection.

> [!definition] Iterator Pattern
> Cung cấp một cách để **truy cập tuần tự** các phần tử của một đối tượng aggregate mà **không lộ ra** biểu diễn bên trong (underlying representation) của nó.
>
> **Ý tưởng cốt lõi**: Tách logic duyệt (traversal) ra khỏi collection — đưa vào một object riêng biệt (Iterator), giúp collection và cách duyệt thay đổi độc lập.

### Iterator trong Python

Python đã built-in Iterator pattern qua hai protocol:

- `__iter__(self)` — trả về iterator object (thường là `self` nếu class tự là iterator)
- `__next__(self)` — trả về phần tử kế tiếp, raise `StopIteration` khi hết

Bất kỳ object nào implement hai method này đều là iterator và có thể dùng trong vòng `for`.

```python
from __future__ import annotations
from typing import Iterator, Generic, TypeVar

T = TypeVar("T")


class RangeIterator:
    def __init__(self, start: int, stop: int, step: int = 1):
        self._current = start
        self._stop = stop
        self._step = step

    def __iter__(self) -> RangeIterator:
        return self

    def __next__(self) -> int:
        if self._current >= self._stop:
            raise StopIteration
        value = self._current
        self._current += self._step
        return value


for n in RangeIterator(1, 10, 2):
    print(n, end=" ")
print()
```

### Implementation — Custom Collection với nhiều Iterator

```python
from __future__ import annotations
from typing import Iterator, Generic, TypeVar, Optional
from dataclasses import dataclass

T = TypeVar("T")


@dataclass
class TreeNode(Generic[T]):
    value: T
    left: Optional["TreeNode[T]"] = None
    right: Optional["TreeNode[T]"] = None


class BinaryTree(Generic[T]):
    def __init__(self):
        self._root: TreeNode[T] | None = None

    def insert(self, value: T) -> None:
        if self._root is None:
            self._root = TreeNode(value)
            return
        self._insert_recursive(self._root, value)

    def _insert_recursive(self, node: TreeNode[T], value: T) -> None:
        if value < node.value:
            if node.left is None:
                node.left = TreeNode(value)
            else:
                self._insert_recursive(node.left, value)
        else:
            if node.right is None:
                node.right = TreeNode(value)
            else:
                self._insert_recursive(node.right, value)

    def inorder(self) -> Iterator[T]:
        return InorderIterator(self._root)

    def preorder(self) -> Iterator[T]:
        return PreorderIterator(self._root)

    def level_order(self) -> Iterator[T]:
        return LevelOrderIterator(self._root)

    def __iter__(self) -> Iterator[T]:
        return self.inorder()


class InorderIterator(Generic[T]):
    def __init__(self, root: TreeNode[T] | None):
        self._stack: list[TreeNode[T]] = []
        self._current = root

    def __iter__(self) -> "InorderIterator[T]":
        return self

    def __next__(self) -> T:
        while self._current or self._stack:
            if self._current:
                self._stack.append(self._current)
                self._current = self._current.left
            else:
                node = self._stack.pop()
                self._current = node.right
                return node.value
        raise StopIteration


class PreorderIterator(Generic[T]):
    def __init__(self, root: TreeNode[T] | None):
        self._stack: list[TreeNode[T]] = [root] if root else []

    def __iter__(self) -> "PreorderIterator[T]":
        return self

    def __next__(self) -> T:
        if not self._stack:
            raise StopIteration
        node = self._stack.pop()
        if node.right:
            self._stack.append(node.right)
        if node.left:
            self._stack.append(node.left)
        return node.value


class LevelOrderIterator(Generic[T]):
    def __init__(self, root: TreeNode[T] | None):
        from collections import deque
        self._queue: deque[TreeNode[T]] = deque([root] if root else [])

    def __iter__(self) -> "LevelOrderIterator[T]":
        return self

    def __next__(self) -> T:
        if not self._queue:
            raise StopIteration
        node = self._queue.popleft()
        if node.left:
            self._queue.append(node.left)
        if node.right:
            self._queue.append(node.right)
        return node.value


tree: BinaryTree[int] = BinaryTree()
for val in [5, 3, 7, 1, 4, 6, 8]:
    tree.insert(val)

print("Inorder    (sorted):", list(tree.inorder()))
print("Preorder   (root first):", list(tree.preorder()))
print("Level-order (BFS):", list(tree.level_order()))
print("Default iter (inorder):", list(tree))
```

### Worked Example — Paginated API Iterator

Bài toán thực tế: duyệt qua danh sách kết quả từ API phân trang — client dùng `for item in api_results` mà không cần biết chi tiết pagination.

```python
from __future__ import annotations
from typing import Iterator
from dataclasses import dataclass


@dataclass
class User:
    id: int
    name: str
    email: str


class FakeAPIClient:
    _DATABASE = [
        User(i, f"User{i}", f"user{i}@example.com")
        for i in range(1, 26)
    ]

    def fetch_page(self, page: int, page_size: int) -> tuple[list[User], bool]:
        start = (page - 1) * page_size
        end = start + page_size
        items = self._DATABASE[start:end]
        has_more = end < len(self._DATABASE)
        return items, has_more


class PaginatedIterator:
    def __init__(self, client: FakeAPIClient, page_size: int = 5):
        self._client = client
        self._page_size = page_size
        self._current_page = 1
        self._buffer: list[User] = []
        self._has_more = True
        self._fetched = 0

    def __iter__(self) -> "PaginatedIterator":
        return self

    def __next__(self) -> User:
        if not self._buffer:
            if not self._has_more:
                raise StopIteration
            items, self._has_more = self._client.fetch_page(
                self._current_page, self._page_size
            )
            print(f"  [API] Fetched page {self._current_page} ({len(items)} items)")
            self._current_page += 1
            self._buffer = list(reversed(items))
            if not self._buffer:
                raise StopIteration
        return self._buffer.pop()


client = FakeAPIClient()
iterator = PaginatedIterator(client, page_size=5)

print("Iterating all users (lazy fetch):")
for user in iterator:
    print(f"  {user.id}: {user.name} <{user.email}>")
```

---

## Phần 2 — Visitor Pattern

### Vấn đề Visitor giải quyết

Bạn có cây AST (Abstract Syntax Tree) với nhiều loại node: `NumberNode`, `AddNode`, `MultiplyNode`. Cần thêm nhiều thao tác: evaluate, pretty-print, compile to bytecode, optimize... Nếu thêm method vào từng class, các class bị phình to. Nếu dùng `isinstance` khắp nơi, vi phạm OCP.

Visitor tách các thao tác ra khỏi data structure — thêm thao tác mới không đụng đến node class.

> [!definition] Visitor Pattern
> Biểu diễn một thao tác được thực hiện trên các phần tử của cấu trúc object. Visitor cho phép định nghĩa **thao tác mới** mà **không thay đổi** các class của phần tử mà nó thao tác.
>
> **Ý tưởng cốt lõi**: Mỗi node class có `accept(visitor)` — gọi `visitor.visit_NodeType(self)`. Visitor class implement `visit_*` cho từng loại node. Kỹ thuật này gọi là **double dispatch**.

### Double Dispatch — tại sao cần Visitor?

Python dùng single dispatch: phương thức được resolve dựa trên type của `self`. Nhưng đôi khi cần dispatch dựa trên *cả hai* — type của object lẫn type của visitor. `accept()` + `visit_*()` tạo ra double dispatch:

```text
node.accept(visitor)
  → visitor.visit_NumberNode(self)   ← dispatch lần 2 dựa trên type của visitor
```

### Implementation — Expression Tree

```python
from __future__ import annotations
from abc import ABC, abstractmethod


class ExprNode(ABC):
    @abstractmethod
    def accept(self, visitor: "ExprVisitor"): ...


class NumberNode(ExprNode):
    def __init__(self, value: float):
        self.value = value

    def accept(self, visitor: "ExprVisitor"):
        return visitor.visit_number(self)


class BinaryOpNode(ExprNode):
    def __init__(self, op: str, left: ExprNode, right: ExprNode):
        self.op = op
        self.left = left
        self.right = right

    def accept(self, visitor: "ExprVisitor"):
        return visitor.visit_binary_op(self)


class UnaryOpNode(ExprNode):
    def __init__(self, op: str, operand: ExprNode):
        self.op = op
        self.operand = operand

    def accept(self, visitor: "ExprVisitor"):
        return visitor.visit_unary_op(self)


class ExprVisitor(ABC):
    @abstractmethod
    def visit_number(self, node: NumberNode): ...

    @abstractmethod
    def visit_binary_op(self, node: BinaryOpNode): ...

    @abstractmethod
    def visit_unary_op(self, node: UnaryOpNode): ...


class EvaluatorVisitor(ExprVisitor):
    def visit_number(self, node: NumberNode) -> float:
        return node.value

    def visit_binary_op(self, node: BinaryOpNode) -> float:
        left = node.left.accept(self)
        right = node.right.accept(self)
        ops = {"+": left + right, "-": left - right,
               "*": left * right, "/": left / right}
        return ops[node.op]

    def visit_unary_op(self, node: UnaryOpNode) -> float:
        val = node.operand.accept(self)
        return -val if node.op == "-" else val


class PrinterVisitor(ExprVisitor):
    def visit_number(self, node: NumberNode) -> str:
        return str(node.value)

    def visit_binary_op(self, node: BinaryOpNode) -> str:
        left = node.left.accept(self)
        right = node.right.accept(self)
        return f"({left} {node.op} {right})"

    def visit_unary_op(self, node: UnaryOpNode) -> str:
        val = node.operand.accept(self)
        return f"({node.op}{val})"


class OptimizingVisitor(ExprVisitor):
    def visit_number(self, node: NumberNode) -> ExprNode:
        return node

    def visit_binary_op(self, node: BinaryOpNode) -> ExprNode:
        left = node.left.accept(self)
        right = node.right.accept(self)

        if isinstance(left, NumberNode) and isinstance(right, NumberNode):
            result = EvaluatorVisitor().visit_binary_op(
                BinaryOpNode(node.op, left, right)
            )
            return NumberNode(result)

        if node.op == "*" and isinstance(right, NumberNode) and right.value == 0:
            return NumberNode(0)
        if node.op == "+" and isinstance(right, NumberNode) and right.value == 0:
            return left

        return BinaryOpNode(node.op, left, right)

    def visit_unary_op(self, node: UnaryOpNode) -> ExprNode:
        operand = node.operand.accept(self)
        if isinstance(operand, NumberNode):
            val = EvaluatorVisitor().visit_unary_op(UnaryOpNode(node.op, operand))
            return NumberNode(val)
        return UnaryOpNode(node.op, operand)


expr = BinaryOpNode("+",
    BinaryOpNode("*", NumberNode(3), NumberNode(4)),
    BinaryOpNode("*", NumberNode(2), NumberNode(0))
)

printer = PrinterVisitor()
evaluator = EvaluatorVisitor()
optimizer = OptimizingVisitor()

print("Original :", expr.accept(printer))
print("Value    :", expr.accept(evaluator))

optimized = expr.accept(optimizer)
print("Optimized:", optimized.accept(printer))
print("Opt value:", optimized.accept(evaluator))
```

### Worked Example — File System Report (Composite + Visitor)

Visitor kết hợp đặc biệt tốt với Composite — thêm nhiều loại "report" khác nhau trên cùng cấu trúc cây mà không sửa node class.

```python
from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass, field


class FsItem(ABC):
    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    def accept(self, visitor: "FsVisitor") -> None: ...


class FsFile(FsItem):
    def __init__(self, name: str, size: int, extension: str):
        super().__init__(name)
        self.size = size
        self.extension = extension

    def accept(self, visitor: "FsVisitor") -> None:
        visitor.visit_file(self)


class FsDirectory(FsItem):
    def __init__(self, name: str):
        super().__init__(name)
        self.children: list[FsItem] = []

    def add(self, item: FsItem) -> "FsDirectory":
        self.children.append(item)
        return self

    def accept(self, visitor: "FsVisitor") -> None:
        visitor.visit_directory(self)
        for child in self.children:
            child.accept(visitor)


class FsVisitor(ABC):
    @abstractmethod
    def visit_file(self, file: FsFile) -> None: ...

    @abstractmethod
    def visit_directory(self, directory: FsDirectory) -> None: ...


class SizeReportVisitor(FsVisitor):
    def __init__(self):
        self._total = 0
        self._by_ext: dict[str, int] = {}

    def visit_file(self, file: FsFile) -> None:
        self._total += file.size
        self._by_ext[file.extension] = self._by_ext.get(file.extension, 0) + file.size

    def visit_directory(self, directory: FsDirectory) -> None:
        pass

    def report(self) -> str:
        lines = [f"Total size: {self._total:,} bytes"]
        for ext, size in sorted(self._by_ext.items(), key=lambda x: -x[1]):
            pct = size / self._total * 100 if self._total else 0
            lines.append(f"  .{ext}: {size:,} bytes ({pct:.1f}%)")
        return "\n".join(lines)


class SearchVisitor(FsVisitor):
    def __init__(self, keyword: str):
        self._keyword = keyword.lower()
        self._results: list[str] = []
        self._path_stack: list[str] = []

    def visit_file(self, file: FsFile) -> None:
        if self._keyword in file.name.lower():
            path = "/".join(self._path_stack + [file.name])
            self._results.append(path)

    def visit_directory(self, directory: FsDirectory) -> None:
        self._path_stack.append(directory.name)

    def results(self) -> list[str]:
        return list(self._results)


root = FsDirectory("project")
src = FsDirectory("src")
tests = FsDirectory("tests")
assets = FsDirectory("assets")

src.add(FsFile("main.py", 4_200, "py"))
src.add(FsFile("utils.py", 2_800, "py"))
src.add(FsFile("models.py", 8_100, "py"))
src.add(FsFile("config.json", 1_200, "json"))

tests.add(FsFile("test_main.py", 3_500, "py"))
tests.add(FsFile("test_utils.py", 1_900, "py"))
tests.add(FsFile("fixtures.json", 5_000, "json"))

assets.add(FsFile("logo.png", 45_000, "png"))
assets.add(FsFile("banner.jpg", 128_000, "jpg"))
assets.add(FsFile("style.css", 8_500, "css"))

root.add(src).add(tests).add(assets)
root.add(FsFile("README.md", 2_048, "md"))
root.add(FsFile("requirements.txt", 512, "txt"))

size_visitor = SizeReportVisitor()
root.accept(size_visitor)
print("=== Size Report ===")
print(size_visitor.report())

search_visitor = SearchVisitor("test")
root.accept(search_visitor)
print("\n=== Search 'test' ===")
for path in search_visitor.results():
    print(f"  {path}")
```

### Trade-offs của Visitor

**Ưu điểm:** Thêm thao tác mới không sửa node class — tuân thủ OCP theo chiều dọc. Tập trung logic liên quan vào một Visitor class. Double dispatch mạnh hơn single dispatch.

**Nhược điểm:** Thêm loại node mới yêu cầu sửa **tất cả** Visitor — vi phạm OCP theo chiều ngang. Visitor cần truy cập vào internals của node — vi phạm encapsulation một phần. Không phù hợp nếu cấu trúc node thay đổi thường xuyên.

---

## So sánh Iterator và Visitor

| Tiêu chí | Iterator | Visitor |
|----------|---------|---------|
| **Mục đích** | Duyệt collection mà không lộ cấu trúc | Thêm thao tác mà không sửa class |
| **Built-in Python** | `__iter__`, `__next__`, `for` loop | Không có; dùng `accept`/`visit_*` |
| **Khi nào dùng** | Nhiều cách duyệt, lazy evaluation, pagination | Nhiều thao tác trên cấu trúc object cố định |
| **Mở rộng dễ theo chiều nào** | Thêm collection type mới | Thêm thao tác (Visitor) mới |

---

## Summary / Key Takeaways

- **Iterator** cung cấp interface đồng nhất để duyệt collection — ẩn cấu trúc bên trong. Python `__iter__`/`__next__` là built-in implementation; generator function (`yield`) là cách ngắn gọn nhất.
- Một collection có thể có nhiều Iterator khác nhau (inorder, preorder, level-order) mà không sửa collection class.
- **Visitor** dùng **double dispatch** (`accept` + `visit_*`) để thêm thao tác mới lên cấu trúc object cố định — không sửa node class.
- Composite + Visitor là cặp đôi mạnh: Composite xây dựng cây, Visitor thực hiện các thao tác khác nhau trên cây đó.
- Iterator mở rộng tốt theo chiều "thêm collection"; Visitor mở rộng tốt theo chiều "thêm thao tác".

---

## References

- Gamma et al. — *Design Patterns*, Ch. 5: Iterator tr.257, Visitor tr.331
- Refactoring.Guru — Iterator: https://refactoring.guru/design-patterns/iterator/python/example
- Refactoring.Guru — Visitor: https://refactoring.guru/design-patterns/visitor/python/example
- Python `collections.abc.Iterator` — https://docs.python.org/3/library/collections.abc.html
