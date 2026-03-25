---
title: "Landmark CVEs"
tags: [security, cve, landmark-cves, index]
created: 2026-03-24
---

## Giới thiệu

Series này phân tích chuyên sâu các CVE mang tính bước ngoặt trong lịch sử an toàn thông tin. Mỗi CVE được chọn vì tính đại diện cho một **lớp lỗ hổng** quan trọng — hiểu một CVE cổ điển giúp nhận diện hàng chục biến thể mới sau này.

**Level**: Advanced — mỗi bài đi sâu vào source code, memory layout, và PoC khai thác đầy đủ.

---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[a0-lab-setup|A0. Lab Setup Guide]]
- [[01-memory-model-exploit-primitives|01. Memory Model & Exploit Primitives]] — Stack/heap layout, buffer overflow primitives, exploit mitigations (ASLR/NX/canary), công cụ GDB + pwndbg + pwntools. Phân loại 6 primitive: Arbitrary Read/Write, OOB Write, UAF, Type Confusion, Integer Overflow.
- [[02-heartbleed|02. Heartbleed — Buffer Over-Read]] — TLS heartbeat extension (RFC 6520), phân tích `tls1_process_heartbeat` trong OpenSSL 1.0.1f, memory layout của OpenSSL heap, PoC Python raw socket hoàn chỉnh, Wireshark fingerprint, patch diff analysis.
- [[03-eternalblue-smb-root-cause|03. EternalBlue Part 1 — SMB Protocol & Root Cause]] — Lịch sử NSA/Shadow Brokers, kiến trúc SMBv1, ba bug A/B/C theo CheckPoint Research, DWORD→WORD truncation trong `SrvOs2FeaListSizeToNt`, FEA list overflow chain, WannaCry wormability.
- [[04-eternalblue-kernel-pool-exploit|04. EternalBlue Part 2 — Kernel Pool Grooming & PoC]] — Windows NonPaged Pool anatomy, POOL_HEADER, SRVNET_BUFFER struct (reverse engineered), 6-bước pool grooming, fake SRVNET_BUFFER_HDR để control RIP, HAL heap KASLR bypass, DoublePulsar backdoor, PoC Python đầy đủ.
- [[05-bluekeep-rdp-uaf-theory|05. BlueKeep Part 1 — RDP Protocol & Use-After-Free]] — RDP virtual channel architecture, MS_T120 double-bind mechanism, UAF lý thuyết cốt lõi, channel struct layout (0x170 bytes, vtable ptr tại 0x100), BinDiff analysis của termdd.sys patch, Python vulnerability scanner.
- [[06-bluekeep-heap-spray-exploit|06. BlueKeep Part 2 — Heap Spray & Exploit Chain]] — rdpsnd spray primitive, pool Feng Shui, 6-bước exploit chain, egg-hunter shellcode, KASLR bypass qua KUSER_SHARED_DATA, token stealing ring-0→SYSTEM, PoC Python minh họa đầy đủ.
- [[07-shellshock|07. Shellshock — Bash Environment Injection]] — Cơ chế Bash function export qua env var, `initialize_shell_variables()` source code analysis, `parse_and_execute()` trailing command execution, toàn bộ attack surface (CGI/SSH/DHCP/git), PoC Python multi-header attack, CVE family (6271/7169/6277/6278), patch diff.
- [[08-zerologon|08. Zerologon — AES-CFB8 IV=0]] — MS-NRPC Netlogon handshake, AES-CFB8 mode theory, proof P(Encrypt(0^8)=0^8)=1/256 với IV=0, 4-bước exploit chain (brute-force auth → password reset → DCSync → Domain Admin), PoC Python với impacket, Windows Event Log IOCs.
- [[09-log4shell-root-cause|09. Log4Shell Part 1 — JNDI/LDAP Chain & Root Cause]] — Log4j2 Lookup system, `JndiLookup.java` source code, JNDI remote object loading mechanism, full call chain từ `logger.info()` → TCP → LDAP → ClassLoader → RCE, `MessagePatternConverter` recursive evaluation, lab LDAP+HTTP server Python, DNS exfil primitive.
- [[10-log4shell-bypass-poc|10. Log4Shell Part 2 — WAF Bypass & Full PoC]] — Taxonomy 10 bypass techniques (lower/upper/nested/unicode), BeanFactory gadget cho Java ≥ 8u191, ELProcessor RCE path, CVE family graph (44228→45046→45105→44832→2.17.1), full PoC pipeline (DNS exfil + LDAP server + RCE trigger), log detection patterns.
- [[11-apache-struts-ognl|11. Apache Struts — OGNL Expression Injection]] — Jakarta Multipart Parser bug, OGNL expression language & Java runtime access, call chain `Content-Type` → exception → `LocalizedTextUtil.findText()` → OGNL eval → RCE, PoC Python với OGNL bypass payload, Equifax 2017 breach timeline, so sánh với Log4Shell.
- [[12-drupalgeddon2-form-api|12. Drupalgeddon2 Part 1 — Form API & Vulnerability Class]] — Drupal Render Array architecture, `#post_render`/`#lazy_builder` callback properties, AJAX form merge path, POST injection `mail[a][#post_render][]=exec`, Drupal 7 vs 8 exploit path, `RequestSanitizer::stripDangerousValues()` patch analysis.
- [[13-drupalgeddon2-exploit-chain|13. Drupalgeddon2 Part 2 — Exploit Chain & Bypass]] — 4-giai đoạn attack chain (version detect → RCE verify → webshell upload → reverse shell), `#post_render` vs `#lazy_builder` output strategy, Drupal 7 two-request path, base64 bypass + `assert` bypass + double-encode, in-the-wild patterns (cryptominer, cron backdoor, settings.php harvest).
- [[14-spring4shell-classloader|14. Spring4Shell Part 1 — ClassLoader Theory & Root Cause]] — Spring MVC DataBinder & BeanWrapper nested property access, CVE-2010-1622 patch (denylist by name), Java 9 `getModule()` bypass, full property chain `class.module.classLoader.resources.context.parent.pipeline.first`, Tomcat AccessLogValve file write primitive, điều kiện khai thác (WAR + JDK 9+ + Tomcat), patch 2022 denylist by type.
- [[15-spring4shell-exploit|15. Spring4Shell Part 2 — Exploit & Webshell Delivery]] — "Split payload via HTTP headers" technique (`prefix`/`suffix`/`c` headers → Tomcat log pattern), PoC Python đầy đủ 7 bước (set props → trigger log → verify → execute commands), JSP webshell với password protection, Wireshark fingerprint, Spring4Shell vs Log4Shell comparison.
- [[16-printnightmare-spooler-theory|16. PrintNightmare Part 1 — Spooler Architecture & LPE Theory]] — Print Spooler SYSTEM privileges, MS-RPRN `RpcAddPrinterDriverEx` authorization bypass (`APD_INSTALL_WARNED_DRIVER` flag), `DRIVER_INFO_2` structure với malicious DLL path, CVE-2021-1675 (LPE) vs CVE-2021-34527 (RCE) distinction, tại sao patch đầu tiên không fix LPE, PowerShell detection.
- [[17-printnightmare-exploit|17. PrintNightmare Part 2 — Exploit & Privilege Escalation PoC]] — Samba SMB share setup, DLL payload (add-user + reverse shell), impacket `rpcdump.py` scan, two-stage exploit (Stage0: copy DLL via UNC → Stage2: load local), LPE PowerShell path, bypass Point and Print registry post-patch, Wireshark MS-RPRN fingerprint.
- [[18-proxylogon-ssrf-auth-bypass|18. ProxyLogon Part 1 — SSRF & Auth Bypass Root Cause]] — Exchange Frontend/Backend architecture, `BEResourceRequestHandler.GetTargetBackEndServerUrl()` source code, cookie `X-AnonResource-Backend` trực tiếp control backend URL, `/ecp/proxyLogon.ecp` internal auth bypass, `msExchLogonMailbox` header injection, Python recon script, Hafnium APT attribution và timeline.
- [[19-proxylogon-webshell-chain|19. ProxyLogon Part 2 — CVE-2021-27065 File Write & Webshell Chain]] — OAB Virtual Directory `ExternalUrl` không sanitize, `ResetOABVirtualDirectory.xaml` path traversal, Hafnium JScript webshell (`eval(Request[key],"unsafe")`), full Python chain PoC 6 bước, PowerShell incident response, IIS log detection patterns.
- [[20-php-fpm-nginx-underflow|20. PHP-FPM/Nginx Underflow — CVE-2019-11043]] — `fastcgi_split_path_info` regex + `%0a` → `PATH_INFO` empty → `env_path_info` buffer underflow, `_fcgi_data_seg` struct (`pos`/`end`/`next`/`data`), hash collision `HTTP_EBUT` = `PHP_VALUE`, phuip-fpizdam QSL auto-detection, điều kiện khai thác (thiếu `try_files`).
- [[a2-cve-research-methodology|A2. CVE Research Methodology — From Advisory to PoC]] — Workflow 7 bước, patch diff analysis, taint tracking với CodeQL/Semgrep, CVSS v3.1 scoring, responsible disclosure timeline, bug report template,  nguồn học tiếp (pwn.college, PortSwigger, Immunefi/zkVerify), pattern tổng kết từ 20 CVE.
- [[03-eternalblue-smb-root-cause|03. EternalBlue Part 1 — SMB Protocol & Root Cause]] — Lịch sử NSA/Shadow Brokers, SMBv1 transaction architecture, ba bug (A/B/C) theo CheckPoint Research, giải phẫu DWORD→WORD truncation trong `SrvOs2FeaListSizeToNt`, chuỗi chain Bug A→B→C, detection với nmap + impacket, patch diff.
- [[04-eternalblue-kernel-pool-exploit|04. EternalBlue Part 2 — Kernel Pool Grooming & PoC]] — Windows NonPaged Pool anatomy, cấu trúc `SRVNET_BUFFER_HDR`, kernel pool grooming 6 bước, fake HDR construction, HAL heap KASLR bypass, DoublePulsar backdoor detection, PoC Python annotated đầy đủ, Wireshark timeline, PowerShell mitigation.

## Appendices

- [[a0-lab-setup|A0. Lab Setup Guide]] — Môi trường lab an toàn với Docker, GDB-pwndbg, Metasploit, pwntools, Wireshark.
- [[a1-memory-layout-reference|A1. Memory Layout Deep Reference]] — Linux process memory map, stack frame anatomy, glibc ptmalloc chunk structure & bin types, Windows POOL_HEADER, KUSER_SHARED_DATA fixed mapping, GDB/pwndbg & pwntools quick reference.
- [[a2-cve-research-methodology|A2. CVE Research Methodology]] — Workflow từ advisory đến PoC hoàn chỉnh.

---

## Vulnerability Class Map

| Lớp lỗ hổng | CVE(s) | Lessons |
|-------------|--------|---------|
| Buffer over-read | CVE-2014-0160 | [[02-heartbleed\|02]] |
| Kernel pool overflow | CVE-2017-0144 | [[03-eternalblue-smb-root-cause\|03]], [[04-eternalblue-kernel-pool-exploit\|04]] |
| Use-after-free | CVE-2019-0708 | [[05-blueKeep-rdp-uaf-theory\|05]], [[06-bluekeep-heap-spray-exploit\|06]] |
| Command/env injection | CVE-2014-6271 | [[07-shellshock\|07]] |
| Cryptographic flaw | CVE-2020-1472 | [[08-zerologon\|08]] |
| JNDI/Deserialization RCE | CVE-2021-44228 | [[09-log4shell-root-cause\|09]], [[10-log4shell-bypass-poc\|10]] |
| Expression injection | CVE-2017-5638 | [[11-apache-struts-ognl\|11]] |
| Framework deserialization | CVE-2018-7600, CVE-2022-22965 | [[12-drupalgeddon2-form-api\|12]]–[[15-spring4shell-exploit\|15]] |
| Privilege escalation | CVE-2021-34527 | [[16-printnightmare-spooler-theory\|16]], [[17-printnightmare-exploit\|17]] |
| SSRF + auth bypass | CVE-2021-26855 | [[18-proxylogon-ssrf-auth-bypass\|18]], [[19-proxylogon-webshell-chain\|19]] |
| Protocol interaction | CVE-2019-11043 | [[20-php-fpm-nginx-underflow\|20]] |

---

## Tool & Library Guide

| Tool | Purpose | Install |
|------|---------|---------|
| `pwntools` | Exploit scripting, socket, shellcode | `pip install pwntools` |
| `scapy` | Packet crafting (Heartbleed, SMB) | `pip install scapy` |
| `requests` | HTTP exploit (Log4Shell, Struts, Drupal) | `pip install requests` |
| `impacket` | SMB/MSRPC (EternalBlue, Zerologon) | `pip install impacket` |
| `gdb` + `pwndbg` | Dynamic analysis, heap inspection | `apt install gdb` + pwndbg script |
| `metasploit` | Reference exploit modules | `apt install metasploit-framework` |
| `wireshark` | Packet capture analysis | `apt install wireshark` |
| `docker` | Lab targets isolation | `apt install docker.io` |

## Notation Guide

| Symbol / Term | Ý nghĩa |
|---------------|---------|
| RCE | Remote Code Execution — thực thi code từ xa |
| LPE | Local Privilege Escalation — leo thang đặc quyền cục bộ |
| OOB | Out-of-Bounds — truy cập ngoài vùng nhớ hợp lệ |
| UAF | Use-After-Free — dùng con trỏ sau khi vùng nhớ đã bị giải phóng |
| CVSS | Common Vulnerability Scoring System — thang điểm 0–10 |
| PoC | Proof of Concept — code minh họa khai thác |
| `rip`/`rsp`/`rbp` | Thanh ghi x86-64: instruction pointer, stack pointer, base pointer |
| heap spray | Kỹ thuật lấp đầy heap bằng payload để tăng xác suất exploit |
| pool grooming | Windows kernel: sắp xếp kernel pool để overflow đúng target |
