---
title: "14. Interpreter"
tags: [design-patterns, gof, behavioral, interpreter, lesson-14]
aliases: [Interpreter Pattern]
created: 2026-03-24
---

> **Prerequisites**: [[01-foundations|01. Foundations]], [[07-composite-bridge|07. Composite & Bridge]], [[12-iterator-visitor|12. Iterator & Visitor]]
> **Objectives**:
> - Hiểu Interpreter: định nghĩa grammar cho một ngôn ngữ đơn giản và xây dựng interpreter cho nó
> - Nhận ra mối quan hệ chặt chẽ giữa Interpreter, Composite, và Visitor
> - Biết khi nào nên dùng và khi nào nên dùng parser library thay thế
> - Implement DSL (domain-specific language) nhỏ gọn cho bài toán thực tế

---

## Vấn đề Interpreter giải quyết

Một số bài toán yêu cầu người dùng diễn đạt logic theo cách linh hoạt: query filter (`age > 18 AND city = "HCM"`), rule engine (`IF revenue > 1M THEN tier = "Gold"`), hoặc template expression (`{{user.name}} joined {{days_ago}} days ago`). Hard-code từng trường hợp là bất khả thi — cần một mini-language có thể parse và evaluate.

> [!definition] Interpreter Pattern
> Cho một ngôn ngữ, định nghĩa một **biểu diễn cho grammar** của ngôn ngữ đó cùng với một **interpreter** dùng biểu diễn này để diễn giải các câu trong ngôn ngữ.
>
> **Ý tưởng cốt lõi**: Mỗi rule trong grammar ánh xạ thành một class. Câu trong ngôn ngữ được parse thành cây expression (AST), sau đó evaluate bằng cách duyệt cây — giống Composite + Visitor.

### Mối quan hệ với các pattern khác

Interpreter = **Composite** (cấu trúc cây expression) + **Visitor** hoặc recursive `interpret()`.

- **Terminal Expression**: leaf node — giá trị hằng số, biến
- **Non-terminal Expression**: composite node — phép toán, điều kiện, kết hợp

---

## Implementation — Boolean Rule Engine

Bài toán: hệ thống cần evaluate các rule dạng `age > 18 AND (city = "HCM" OR city = "HN")` trên một context dictionary.

```python
from __future__ import annotations
from abc import ABC, abstractmethod


class Expression(ABC):
    @abstractmethod
    def interpret(self, context: dict) -> bool: ...

    @abstractmethod
    def __repr__(self) -> str: ...


class VariableComparison(Expression):
    OPERATORS = {
        ">": lambda a, b: a > b,
        "<": lambda a, b: a < b,
        ">=": lambda a, b: a >= b,
        "<=": lambda a, b: a <= b,
        "=": lambda a, b: a == b,
        "!=": lambda a, b: a != b,
    }

    def __init__(self, variable: str, operator: str, value):
        self._var = variable
        self._op = operator
        self._val = value

    def interpret(self, context: dict) -> bool:
        actual = context.get(self._var)
        if actual is None:
            return False
        op_fn = self.OPERATORS.get(self._op)
        if op_fn is None:
            raise ValueError(f"Unknown operator: {self._op}")
        try:
            return op_fn(actual, type(actual)(self._val))
        except (TypeError, ValueError):
            return op_fn(str(actual), str(self._val))

    def __repr__(self) -> str:
        val_repr = f'"{self._val}"' if isinstance(self._val, str) else str(self._val)
        return f"{self._var} {self._op} {val_repr}"


class AndExpression(Expression):
    def __init__(self, left: Expression, right: Expression):
        self._left = left
        self._right = right

    def interpret(self, context: dict) -> bool:
        return self._left.interpret(context) and self._right.interpret(context)

    def __repr__(self) -> str:
        return f"({self._left} AND {self._right})"


class OrExpression(Expression):
    def __init__(self, left: Expression, right: Expression):
        self._left = left
        self._right = right

    def interpret(self, context: dict) -> bool:
        return self._left.interpret(context) or self._right.interpret(context)

    def __repr__(self) -> str:
        return f"({self._left} OR {self._right})"


class NotExpression(Expression):
    def __init__(self, expr: Expression):
        self._expr = expr

    def interpret(self, context: dict) -> bool:
        return not self._expr.interpret(context)

    def __repr__(self) -> str:
        return f"NOT({self._expr})"


is_adult = VariableComparison("age", ">=", 18)
is_hcm = VariableComparison("city", "=", "HCM")
is_hn = VariableComparison("city", "=", "HN")
is_active = VariableComparison("status", "=", "active")
high_value = VariableComparison("revenue", ">", 1000000)

vip_rule = AndExpression(
    AndExpression(is_adult, OrExpression(is_hcm, is_hn)),
    AndExpression(is_active, high_value)
)

print(f"Rule: {vip_rule}\n")

customers = [
    {"age": 25, "city": "HCM", "status": "active", "revenue": 1500000, "name": "Alice"},
    {"age": 17, "city": "HCM", "status": "active", "revenue": 2000000, "name": "Bob"},
    {"age": 30, "city": "DN",  "status": "active", "revenue": 1200000, "name": "Carol"},
    {"age": 28, "city": "HN",  "status": "inactive", "revenue": 800000, "name": "Dave"},
    {"age": 35, "city": "HN",  "status": "active", "revenue": 5000000, "name": "Eve"},
]

for c in customers:
    result = vip_rule.interpret(c)
    tag = "VIP" if result else "regular"
    print(f"  {c['name']:6s} → {tag}")
```

---

## Implementation — Simple Expression Parser

Interpreter thường đi kèm một parser chuyển chuỗi thành cây expression. Đây là recursive descent parser đơn giản cho biểu thức số học:

```python
from __future__ import annotations
from abc import ABC, abstractmethod


class NumericExpr(ABC):
    @abstractmethod
    def evaluate(self) -> float: ...

    @abstractmethod
    def __repr__(self) -> str: ...


class Number(NumericExpr):
    def __init__(self, value: float):
        self._value = value

    def evaluate(self) -> float:
        return self._value

    def __repr__(self) -> str:
        return str(self._value)


class Variable(NumericExpr):
    def __init__(self, name: str, context: dict[str, float]):
        self._name = name
        self._context = context

    def evaluate(self) -> float:
        if self._name not in self._context:
            raise NameError(f"Undefined variable: {self._name}")
        return self._context[self._name]

    def __repr__(self) -> str:
        return self._name


class BinaryOp(NumericExpr):
    _OPS = {
        "+": lambda a, b: a + b,
        "-": lambda a, b: a - b,
        "*": lambda a, b: a * b,
        "/": lambda a, b: a / b,
        "**": lambda a, b: a ** b,
    }

    def __init__(self, op: str, left: NumericExpr, right: NumericExpr):
        self._op = op
        self._left = left
        self._right = right

    def evaluate(self) -> float:
        return self._OPS[self._op](self._left.evaluate(), self._right.evaluate())

    def __repr__(self) -> str:
        return f"({self._left} {self._op} {self._right})"


class ExpressionParser:
    def __init__(self, context: dict[str, float] | None = None):
        self._context = context or {}
        self._tokens: list[str] = []
        self._pos = 0

    def parse(self, expression: str) -> NumericExpr:
        self._tokens = self._tokenize(expression)
        self._pos = 0
        result = self._parse_additive()
        if self._pos < len(self._tokens):
            raise SyntaxError(f"Unexpected token: {self._tokens[self._pos]}")
        return result

    def _tokenize(self, expr: str) -> list[str]:
        import re
        pattern = r'\d+\.?\d*|[a-zA-Z_]\w*|[+\-*/()]|\*\*'
        return re.findall(pattern, expr.replace(' ', ''))

    def _current(self) -> str | None:
        return self._tokens[self._pos] if self._pos < len(self._tokens) else None

    def _consume(self) -> str:
        token = self._tokens[self._pos]
        self._pos += 1
        return token

    def _parse_additive(self) -> NumericExpr:
        left = self._parse_multiplicative()
        while self._current() in ('+', '-'):
            op = self._consume()
            right = self._parse_multiplicative()
            left = BinaryOp(op, left, right)
        return left

    def _parse_multiplicative(self) -> NumericExpr:
        left = self._parse_power()
        while self._current() in ('*', '/'):
            op = self._consume()
            right = self._parse_power()
            left = BinaryOp(op, left, right)
        return left

    def _parse_power(self) -> NumericExpr:
        base = self._parse_primary()
        if self._current() == '**':
            self._consume()
            exp = self._parse_primary()
            return BinaryOp('**', base, exp)
        return base

    def _parse_primary(self) -> NumericExpr:
        token = self._current()
        if token is None:
            raise SyntaxError("Unexpected end of expression")
        if token == '(':
            self._consume()
            expr = self._parse_additive()
            if self._current() != ')':
                raise SyntaxError("Expected ')'")
            self._consume()
            return expr
        self._consume()
        try:
            return Number(float(token))
        except ValueError:
            return Variable(token, self._context)


parser = ExpressionParser(context={"x": 3.0, "y": 4.0, "pi": 3.14159})

expressions = [
    "2 + 3 * 4",
    "(2 + 3) * 4",
    "x**2 + y**2",
    "pi * x * x",
]

for expr_str in expressions:
    ast = parser.parse(expr_str)
    result = ast.evaluate()
    print(f"  {expr_str:25s} = {ast!r:35s} = {result:.4f}")
```

---

## Worked Example — Template Engine

DSL thực tế nhỏ: template engine với variable substitution và simple conditional.

```python
from __future__ import annotations
from abc import ABC, abstractmethod
import re


class TemplateNode(ABC):
    @abstractmethod
    def render(self, context: dict) -> str: ...


class TextNode(TemplateNode):
    def __init__(self, text: str):
        self._text = text

    def render(self, context: dict) -> str:
        return self._text


class VariableNode(TemplateNode):
    def __init__(self, path: str):
        self._parts = path.strip().split(".")

    def render(self, context: dict) -> str:
        value = context
        for part in self._parts:
            if isinstance(value, dict):
                value = value.get(part, "")
            else:
                value = getattr(value, part, "")
        return str(value)


class IfNode(TemplateNode):
    def __init__(self, condition: str, body: list[TemplateNode],
                 else_body: list[TemplateNode] | None = None):
        self._condition = condition.strip()
        self._body = body
        self._else_body = else_body or []

    def _eval_condition(self, context: dict) -> bool:
        match = re.match(r'(\w[\w.]*)\s*(==|!=|>|<|>=|<=)\s*(.+)', self._condition)
        if match:
            var_path, op, val_str = match.groups()
            parts = var_path.split(".")
            actual = context
            for p in parts:
                actual = actual.get(p, "") if isinstance(actual, dict) else getattr(actual, p, "")
            try:
                val = type(actual)(val_str.strip('"\''))
            except (ValueError, TypeError):
                val = val_str.strip('"\'')
            ops = {"==": actual == val, "!=": actual != val,
                   ">": actual > val, "<": actual < val,
                   ">=": actual >= val, "<=": actual <= val}
            return ops.get(op, False)
        var = context.get(self._condition, False)
        return bool(var)

    def render(self, context: dict) -> str:
        nodes = self._body if self._eval_condition(context) else self._else_body
        return "".join(n.render(context) for n in nodes)


class ForNode(TemplateNode):
    def __init__(self, var: str, iterable: str, body: list[TemplateNode]):
        self._var = var
        self._iterable = iterable
        self._body = body

    def render(self, context: dict) -> str:
        items = context.get(self._iterable, [])
        parts = []
        for item in items:
            loop_ctx = {**context, self._var: item}
            parts.append("".join(n.render(loop_ctx) for n in self._body))
        return "".join(parts)


class TemplateParser:
    def parse(self, template: str) -> list[TemplateNode]:
        nodes: list[TemplateNode] = []
        pos = 0
        while pos < len(template):
            var_match = re.search(r'\{\{(.+?)\}\}', template[pos:])
            tag_match = re.search(r'\{%(.+?)%\}', template[pos:])
            next_match = min(
                (m for m in [var_match, tag_match] if m),
                key=lambda m: m.start(),
                default=None
            )
            if next_match is None:
                nodes.append(TextNode(template[pos:]))
                break
            if next_match.start() > 0:
                nodes.append(TextNode(template[pos:pos + next_match.start()]))
            pos += next_match.start()
            if next_match == var_match:
                nodes.append(VariableNode(next_match.group(1)))
                pos += len(next_match.group(0))
            else:
                tag_content = next_match.group(1).strip()
                pos += len(next_match.group(0))
                if tag_content.startswith("if "):
                    condition = tag_content[3:]
                    end_pos, body, else_body = self._parse_block(template, pos, "if")
                    nodes.append(IfNode(condition, body, else_body))
                    pos = end_pos
                elif tag_content.startswith("for "):
                    parts = tag_content.split()
                    var, iterable = parts[1], parts[3]
                    end_pos, body, _ = self._parse_block(template, pos, "for")
                    nodes.append(ForNode(var, iterable, body))
                    pos = end_pos
        return nodes

    def _parse_block(self, template: str, pos: int,
                     block_type: str) -> tuple[int, list[TemplateNode], list[TemplateNode]]:
        end_tag = f"{{% end{block_type} %}}"
        else_tag = "{% else %}"
        body_text = ""
        else_text = ""
        in_else = False
        depth = 1
        i = pos
        while i < len(template):
            if template[i:].startswith(f"{{% {block_type} "):
                depth += 1
            elif template[i:].startswith(end_tag):
                depth -= 1
                if depth == 0:
                    end_pos = i + len(end_tag)
                    body = self.parse(body_text)
                    else_part = self.parse(else_text) if else_text else []
                    return end_pos, body, else_part
            elif template[i:].startswith(else_tag) and depth == 1:
                in_else = True
                i += len(else_tag)
                continue
            if in_else:
                else_text += template[i]
            else:
                body_text += template[i]
            i += 1
        raise SyntaxError(f"Unclosed {block_type} block")


template_str = """Hello, {{user.name}}!

{% if user.is_premium %}
You are a Premium member. Your discount: {{user.discount}}%
{% else %}
Upgrade to Premium for exclusive benefits!
{% endif %}

Your recent orders:
{% for order in orders %}
  - Order #{{order.id}}: {{order.product}} (${{order.amount}})
{% endfor %}

Thank you for being with us for {{days_since_join}} days."""

parser = TemplateParser()
nodes = parser.parse(template_str)

context = {
    "user": {"name": "Alice", "is_premium": True, "discount": 15},
    "orders": [
        {"id": "1001", "product": "Laptop", "amount": "999.00"},
        {"id": "1002", "product": "Mouse", "amount": "29.99"},
    ],
    "days_since_join": 365,
}

output = "".join(node.render(context) for node in nodes)
print(output)
```

---

## Trade-offs và Khi nào dùng Interpreter

> [!warning] Interpreter là pattern nâng cao — cân nhắc trước khi dùng
> - **Dùng khi**: Grammar đơn giản và ổn định, tần suất thay đổi thấp, số lượng rule class quản lý được (< 20 class)
> - **Không dùng khi**: Grammar phức tạp → dùng parser generator (ANTLR, Lark, PLY), hiệu năng là yêu cầu chính, grammar thay đổi thường xuyên

**Ưu điểm:** Dễ thêm rule mới (thêm class). Grammar được document hóa bằng class hierarchy. Dễ test từng expression độc lập.

**Nhược điểm:** Class explosion với grammar phức tạp. Khó maintain với grammar lớn. Không hiệu quả với parse phức tạp so với proper parser.

---

## Summary / Key Takeaways

- **Interpreter** ánh xạ grammar rules thành class hierarchy — Terminal (leaf) và Non-terminal (composite) expressions.
- Cây expression (AST) được evaluate bằng đệ quy `interpret()` — đây chính là Composite pattern.
- Thêm nhiều thao tác trên AST (evaluate, pretty-print, optimize) là Visitor pattern.
- Ứng dụng thực tế: rule engine, query DSL, template engine, configuration expression.
- Với grammar phức tạp: dùng `lark-parser` hoặc `pyparsing` — không tự viết parser từ đầu.

---

## References

- Gamma et al. — *Design Patterns*, Ch. 5: Interpreter tr.243
- Refactoring.Guru — Interpreter: https://refactoring.guru/design-patterns/interpreter
- Python `ast` module — https://docs.python.org/3/library/ast.html
- Lark parser library — https://github.com/lark-parser/lark
