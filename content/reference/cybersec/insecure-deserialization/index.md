---
title: "Insecure Deserialization Attacks"
tags: [pentest, deserialization, web-attacks, index]
created: 2026-03-31
---

> [[00-roadmap|00. Roadmap]] · [[fm-field-manual|Field Manual]]
>
---

## SVG Asset Registry

| File | Lesson | Mô tả |
|------|--------|-------|
| `assets/img-01-serialization-format-comparison.svg` | [[01-serialization-internals\|01. Serialization Internals]] | PHP/Java/Pickle byte format comparison |
| `assets/img-03-phar-gadget-chain-flow.svg` | [[03-phpggc-phar-deserialization\|03. PHPGGC & PHAR]] | PHAR wrap → POP chain execution flow |
| `assets/img-04-java-objectinputstream-flow.svg` | [[04-java-deserialization-internals\|04. Java Internals]] | ObjectInputStream readObject() flow |
| `assets/img-06-custom-gadget-chain.svg` | [[06-custom-java-gadget-chain\|06. Custom Gadget Chain]] | Custom gadget chain với FieldValues |
| `assets/img-08-pickle-opcode-flow.svg` | [[08-python-pickle-rce\|08. Python Pickle RCE]] | Pickle VM opcode execution model |

---

## Lessons

| # | Lesson | Type | Tóm tắt |
|---|--------|------|---------|
| 00 | [[00-roadmap\|00. Roadmap]] | — | Lesson map, dependency graph, progress tracker |
| 01 | [[01-serialization-internals\|01. Serialization Internals]] | F | PHP/Java/Python format bytes, magic methods, gadget primitives |
| 02 | [[02-php-object-injection\|02. PHP Object Injection]] | A | unserialize() exploit, POP chain thủ công, magic method weaponization |
| 03 | [[03-phpggc-phar-deserialization\|03. PHPGGC & PHAR Deserialization]] | A+T | PHPGGC gadget chains, PHAR stream wrapper, polyglot bypass |
| 04 | [[04-java-deserialization-internals\|04. Java Deserialization Internals]] | F | ObjectInputStream, readObject(), serialVersionUID, classpath recon |
| 05 | [[05-ysoserial-commons-collections\|05. ysoserial & CommonsCollections]] | A+T | CC1–CC6 chain anatomy, Transformer chain, JDK version matrix |
| 06 | [[06-custom-java-gadget-chain\|06. Custom Java Gadget Chain]] | A | Gadget chain từ đầu, FieldValues trick, secondary SQL injection |
| 07 | [[07-java-deserialization-alt-vectors\|07. Java Alt Vectors]] | A | XStream, SnakeYAML, JMX/RMI/JRMP, OFBiz xmlrpc |
| 08 | [[08-python-pickle-rce\|08. Python Pickle RCE]] | A | __reduce__ weaponization, opcode injection, Django cache poisoning |
| 09 | [[09-python-unsafe-deserialization-ecosystem\|09. Python Unsafe Deser Ecosystem]] | A | PyYAML, jsonpickle, shelve, RestrictedUnpickler bypass |
| 10 | [[10-detection-fingerprinting\|10. Detection & Fingerprinting]] | M | Magic bytes, Burp plugins, GadgetProbe, black-box recon workflow |
| 11 | [[11-bypass-techniques\|11. Bypass Techniques]] | A | PHP type juggling, SerialKiller bypass, Python sandbox evasion |
| 12 | [[12-deserialization-methodology\|12. Deserialization Methodology]] | M | Full methodology black-box → exploit, checklist, tool stack |
| FM | [[fm-field-manual\|Field Manual]] | Ref | Tài liệu tra cứu nhanh tích lũy |

---

## Attack Techniques Covered

| Technique | Lesson | Difficulty |
|-----------|--------|-----------|
| PHP Object Injection (POP Chain) | [[02-php-object-injection\|02]] | Medium |
| PHPGGC Gadget Generation | [[03-phpggc-phar-deserialization\|03]] | Medium |
| PHAR Stream Wrapper Exploit | [[03-phpggc-phar-deserialization\|03]] | Hard |
| Java CC1/CC6 Gadget Chain | [[05-ysoserial-commons-collections\|05]] | Hard |
| Custom Java Gadget Chain | [[06-custom-java-gadget-chain\|06]] | Hard |
| SnakeYAML/XStream Exploit | [[07-java-deserialization-alt-vectors\|07]] | Medium |
| Python Pickle RCE (__reduce__) | [[08-python-pickle-rce\|08]] | Medium |
| Pickle Opcode Injection | [[08-python-pickle-rce\|08]] | Hard |
| PyYAML !! Injection | [[09-python-unsafe-deserialization-ecosystem\|09]] | Medium |
| RestrictedUnpickler Bypass | [[11-bypass-techniques\|11]] | Hard |

---

## Tools Covered

| Tool | Purpose | Lesson |
|------|---------|--------|
| PHPGGC | PHP gadget chain generator | [[03-phpggc-phar-deserialization\|03]] |
| ysoserial | Java deserialization payload generator | [[05-ysoserial-commons-collections\|05]] |
| GadgetProbe | Remote classpath enumeration | [[10-detection-fingerprinting\|10]] |
| Java Deserialization Scanner | Burp extension cho Java deser | [[10-detection-fingerprinting\|10]] |
| pickletools | Pickle opcode disassembler | [[08-python-pickle-rce\|08]] |
| marshalsec | Java unmarshalling exploit tool | [[07-java-deserialization-alt-vectors\|07]] |

---

*Index cập nhật sau mỗi lesson được generate.*