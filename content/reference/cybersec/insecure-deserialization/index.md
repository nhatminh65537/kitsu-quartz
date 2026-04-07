---
title: "Insecure Deserialization Attacks"
tags: [pentest, deserialization, php, java, python, index]
created: 2026-04-06
---

> [[00-roadmap|00. Roadmap]]

---

## Diagram Asset Registry

| File | Lesson | Description |
|------|--------|-------------|
| `assets/img-01-format-comparison.png` | [[01-serialization-foundation\|01. Foundation]] | PHP / Java / Python format comparison |
| `assets/img-03-pop-chain-flow.png` | [[03-php-pop-chains\|03. POP Chains]] | PHP POP chain: magic method → gadgets → sink |
| `assets/img-04-phar-structure.png` | [[04-phar-deserialization\|04. PHAR]] | PHAR anatomy + attack flow |
| `assets/img-06-source-audit-flow.png` | [[06-php-source-code-auditing\|06. Source Audit]] | PHP code audit call graph |
| `assets/img-08-java-stream-format.png` | [[08-java-serialization-internals\|08. Java Internals]] | Java binary stream anatomy |
| `assets/img-09-cc1-gadget-chain.png` | [[09-java-gadget-chains-ysoserial\|09. Gadget Chains]] | CommonsCollections1 full chain |
| `assets/img-10-shiro-cookie-flow.png` | [[10-apache-shiro-rce\|10. Shiro RCE]] | Shiro rememberMe lifecycle |
| `assets/img-11-t3-protocol.png` | [[11-weblogic-t3-deserialization\|11. WebLogic T3]] | WebLogic T3 attack diagram |
| `assets/img-12-rmi-architecture.png` | [[12-java-rmi-jmx\|12. RMI/JMX]] | RMI registry / stub / remote object |
| `assets/img-14-jms-architecture.png` | [[14-java-jms-activemq-jmet\|14. JMS/ActiveMQ]] | JMS broker deserialization point |
| `assets/img-15-filter-bypass.png` | [[15-bypass-serialization-filters\|15. Filter Bypass]] | Defense layers + bypass map |
| `assets/img-16-pickle-reduce.png` | [[16-python-pickle-rce\|16. Pickle RCE]] | Pickle REDUCE opcode flow |
| `assets/img-18-ml-attack-surface.png` | [[18-ml-framework-deserialization\|18. ML Frameworks]] | ML model lifecycle attack surface |
| `assets/img-19-flask-cookie-anatomy.png` | [[19-flask-django-session\|19. Flask/Django]] | Flask session cookie anatomy |
| `assets/img-22-inmemory-webshell.png` | [[22-waf-bypass-postexploit\|22. WAF Bypass]] | In-memory webshell injection flow |

---

## Lessons

| # | Lesson | Type | Summary |
|---|--------|------|---------|
| 00 | [[00-roadmap\|00. Roadmap]] | — | Lesson map, dependency graph, Diagram Assets Plan |
| 01 | [[01-serialization-foundation\|01. Serialization Foundation]] | F | Cơ chế serialization PHP / Java / Python, format binary, attack surface chung |
| 02 | [[02-php-magic-methods\|02. PHP Magic Methods & Object Injection]] | F+A | 17 magic methods, trigger order, unserialize() entry points |
| 03 | [[03-php-pop-chains\|03. PHP POP Chain Construction]] | A | Manual gadget chaining: entry → bridge → sink; viết exploit script |
| 04 | [[04-phar-deserialization\|04. PHAR Deserialization]] | A | PHAR format internals, trigger via file ops, polyglot PHAR-JPEG |
| 05 | [[05-phpggc\|05. PHPGGC — Framework Gadget Chains]] | T | PHPGGC usage, Laravel/Symfony/Yii chains, kết hợp với PHAR |
| 06 | [[06-php-source-code-auditing\|06. PHP Source Code Auditing]] | A | Methodology tìm custom gadget chain: trace magic method → call graph → sink |
| 07 | [[07-php-cms-deserialization\|07. PHP CMS Deserialization]] | A | WordPress CVE-2019-8943, Drupal Guzzle chains |
| 08 | [[08-java-serialization-internals\|08. Java Serialization Internals]] | F | Binary stream format, ObjectInputStream.readObject(), magic methods |
| 09 | [[09-java-gadget-chains-ysoserial\|09. Gadget Chains & ysoserial]] | H | CC1 anatomy, ysoserial workflow, URLDNS → sleep → shell |
| 10 | [[10-apache-shiro-rce\|10. Apache Shiro RememberMe RCE]] | A | CVE-2016-4437, hardcoded AES key, key brute-force |
| 11 | [[11-weblogic-t3-deserialization\|11. WebLogic T3 Deserialization]] | A | CVE-2018-2628, T3 handshake, JRMP two-stage exploit |
| 12 | [[12-java-rmi-jmx\|12. Java RMI/JMX Exploitation]] | A | RMI registry enum, BaRMIe / RMG, JMX MBean attack |
| 13 | [[13-jboss-jenkins-deserialization\|13. JBoss & Jenkins CLI]] | A | JMXInvokerServlet HTTP POST, Jenkins CLI port 50000 |
| 14 | [[14-java-jms-activemq-jmet\|14. JMS & ActiveMQ — JMET]] | H | ObjectMessage deserialization, JMET tool, 12+ JMS brokers |
| 15 | [[15-bypass-serialization-filters\|15. Bypass Serialization Filters]] | A | WAF evasion, SerialKiller bypass, ObjectInputFilter, in-memory webshell concept |
| 16 | [[16-python-pickle-rce\|16. Python Pickle & __reduce__ RCE]] | A | REDUCE opcode, __reduce__ tuple, craft payload, delivery |
| 17 | [[17-python-ecosystem-deserialization\|17. Python Ecosystem]] | A | PyYAML yaml.load(), jsonpickle, dill, shelve, marshal |
| 18 | [[18-ml-framework-deserialization\|18. ML/AI Framework Deserialization]] | A | torch.load() RCE, joblib, numpy allow_pickle, malicious model files |
| 19 | [[19-flask-django-session\|19. Flask/Django Session]] | A | Flask SECRET_KEY forge, brute-force, Django PickleSerializer RCE |
| 20 | [[20-blackbox-detection-methodology\|20. Black-Box Detection]] | M | Magic byte signatures, detection workflow, tool stack |
| 21 | [[21-burp-deserialization-tools\|21. Burp Suite Tools]] | T | Freddy extension, Java Deserialization Scanner, Collaborator integration |
| 22 | [[22-waf-bypass-postexploit\|22. WAF Bypass & Post-Exploitation]] | A | GZip/chunked bypass, alternative gadgets, in-memory webshell injection |
| A0 | [[a0-quick-reference\|A0. Quick Reference]] | Ref | Aggregated cheatsheet — signatures, payloads, tools |

---

## Attack Techniques Covered

| Technique | Lesson | Difficulty |
|-----------|--------|------------|
| PHP Object Injection | [[02-php-magic-methods\|02]] | Medium |
| PHP POP Chain (manual) | [[03-php-pop-chains\|03]] | Hard |
| PHAR Deserialization | [[04-phar-deserialization\|04]] | Medium |
| PHPGGC Framework Chains | [[05-phpggc\|05]] | Medium |
| PHP Source Code Gadget Hunt | [[06-php-source-code-auditing\|06]] | Hard |
| WordPress / Drupal CMS Deser | [[07-php-cms-deserialization\|07]] | Medium |
| Java Gadget Chains (CC1/CC6) | [[09-java-gadget-chains-ysoserial\|09]] | Medium |
| Apache Shiro RememberMe RCE | [[10-apache-shiro-rce\|10]] | Medium |
| WebLogic T3 (CVE-2018-2628) | [[11-weblogic-t3-deserialization\|11]] | Hard |
| Java RMI/JMX Exploitation | [[12-java-rmi-jmx\|12]] | Medium |
| JBoss JMXInvokerServlet | [[13-jboss-jenkins-deserialization\|13]] | Medium |
| Jenkins CLI Deserialization | [[13-jboss-jenkins-deserialization\|13]] | Medium |
| JMS / ActiveMQ (JMET) | [[14-java-jms-activemq-jmet\|14]] | Hard |
| Serialization Filter Bypass | [[15-bypass-serialization-filters\|15]] | Hard |
| Python Pickle __reduce__ RCE | [[16-python-pickle-rce\|16]] | Easy |
| PyYAML yaml.load() RCE | [[17-python-ecosystem-deserialization\|17]] | Easy |
| jsonpickle py/reduce exploit | [[17-python-ecosystem-deserialization\|17]] | Easy |
| PyTorch / sklearn Model RCE | [[18-ml-framework-deserialization\|18]] | Medium |
| Flask Session Forgery | [[19-flask-django-session\|19]] | Easy |
| Django PickleSerializer RCE | [[19-flask-django-session\|19]] | Hard |
| WAF Bypass (GZip/Chunked) | [[22-waf-bypass-postexploit\|22]] | Hard |
| In-Memory Webshell Injection | [[22-waf-bypass-postexploit\|22]] | Expert |

---

## Tools Covered

| Tool | Purpose | Lesson |
|------|---------|--------|
| PHPGGC | PHP gadget chain generator | [[05-phpggc\|05]] |
| ysoserial | Java gadget chain generator | [[09-java-gadget-chains-ysoserial\|09]] |
| ShiroScan / shiro_crack | Shiro AES key brute-force | [[10-apache-shiro-rce\|10]] |
| WLT3Serial | WebLogic T3 payload delivery | [[11-weblogic-t3-deserialization\|11]] |
| BaRMIe | Java RMI enumeration | [[12-java-rmi-jmx\|12]] |
| remote-method-guesser | Advanced RMI scan + exploit | [[12-java-rmi-jmx\|12]] |
| JMET | JMS broker exploitation | [[14-java-jms-activemq-jmet\|14]] |
| GadgetProbe | Java classpath enumeration | [[15-bypass-serialization-filters\|15]] |
| SerializationDumper | Java stream parser | [[08-java-serialization-internals\|08]] |
| pickletools | Python pickle disassembler | [[16-python-pickle-rce\|16]] |
| flask-unsign | Flask session decode/forge/brute | [[19-flask-django-session\|19]] |
| Freddy (Burp) | Auto-detect deserialization | [[21-burp-deserialization-tools\|21]] |
| Java Deserialization Scanner | Burp active scan with ysoserial | [[21-burp-deserialization-tools\|21]] |

---

## Quick Reference

→ [[a0-quick-reference|A0. Quick Reference]] — Magic bytes, payload templates, tool commands aggregated từ tất cả lessons.

---

*Index updated: 2026-04-07 — 22 lessons + A0 + 15 HTML/CSS diagrams + 15 PNG renders*
