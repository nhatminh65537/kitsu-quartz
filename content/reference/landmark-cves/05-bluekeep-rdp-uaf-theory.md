---
title: "05. BlueKeep Part 1 — RDP Protocol & Use-After-Free"
tags: [security, cve, landmark-cves, bluekeep, rdp, uaf, windows, kernel, lesson-05]
aliases: [BlueKeep Part 1, CVE-2019-0708 Root Cause]
created: 2026-03-24
---

> **Prerequisites**: [[01-memory-model-exploit-primitives|01. Memory Model & Exploit Primitives]], [[04-eternalblue-kernel-pool-exploit|04. EternalBlue Part 2]] (Windows kernel pool concepts), TCP cơ bản
> **Objectives**:
> - Hiểu kiến trúc RDP virtual channel và cơ chế bind
> - Phân tích cách MS_T120 bị bind hai lần → two references → use-after-free
> - Đọc được binary diff của `termdd.sys` trước và sau patch
> - Hiểu tại sao UAF trong kernel nguy hiểm hơn user-space UAF
> - Phân biệt UAF với buffer overflow về cơ chế và cách khai thác
> - Hiểu channel struct layout (0x170 bytes) và vị trí vtable pointer tại offset 0x100

---

## Bối cảnh: Khi RDP Trở Thành Vũ Khí

BlueKeep (CVE-2019-0708) được Microsoft vá ngày 14/5/2019 — một trong những patch hiếm hoi được phát hành đồng thời cho cả Windows XP và Server 2003, những hệ điều hành đã hết hỗ trợ từ lâu. Điều đó nói lên mức độ nghiêm trọng của lỗi.

Điểm đặc biệt của BlueKeep so với EternalBlue:
- **Cơ chế hoàn toàn khác**: không phải integer overflow → buffer overflow, mà là **use-after-free (UAF)** — một lớp lỗi phức tạp hơn đáng kể.
- **Không cần authentication, không cần user interaction** — giống EternalBlue, thuộc diện pre-auth.
- **Wormable**: NSA và Microsoft đều cảnh báo về tiềm năng worm, tương tự WannaCry.
- **Khai thác trong thực tế**: tháng 11/2019, chiến dịch mass exploitation đầu tiên được phát hiện — dùng để cài cryptominer trên ~1 triệu máy.

Hệ điều hành bị ảnh hưởng: Windows XP, Vista, 7, Server 2003, Server 2008, Server 2008 R2. Windows 8 và 10 **không bị ảnh hưởng** — vì có thêm NLA (Network Level Authentication) làm bước auth bổ sung, và cấu trúc driver đã thay đổi.

---

## RDP Virtual Channel Architecture

Để hiểu bug, cần hiểu cách RDP quản lý các kênh truyền thông (virtual channel).

### RDP Protocol Stack

```text
Client                                    Server
  │                                          │
  │─── TCP port 3389 ──────────────────────▶│
  │                                          │
  │    [X.224 Connection Request]            │
  │◀── [X.224 Connection Confirm] ──────────│
  │                                          │
  │    [MCS Connect Initial]                 │
  │    (chứa GCC Conference Create Request)  │
  │◀── [MCS Connect Response] ──────────────│
  │                                          │
  │    [MCS Erect Domain Request]            │
  │    [MCS Attach User Request]             │
  │◀── [MCS Attach User Confirm] ───────────│
  │                                          │
  │    [MCS Channel Join Request × N]        │  ← tại đây khai báo virtual channels
  │◀── [MCS Channel Join Confirm × N] ──────│
  │                                          │
  │    [Security Exchange]                   │
  │    [Client Info PDU]                     │
  │◀── [Server License Error PDU] ───────────│
  │                                          │
  │    ══ Kênh đã thiết lập ══              │
  │    [Capability Sets exchange]            │
  │    [Virtual Channel PDUs]               │  ← dữ liệu thực sự
```

### Static và Dynamic Virtual Channels

RDP 5.1 định nghĩa hai loại virtual channel:

> [!definition] Definition 5.1 — RDP Virtual Channel
> **Static Virtual Channel (SVC)**: tối đa 32 channels, được khai báo trong GCC Conference Create Request khi connection khởi tạo. Mỗi channel có một tên ASCII (tối đa 7 ký tự) và được gán một **Channel ID** số nguyên.
>
> **Dynamic Virtual Channel (DVC)**: chạy bên trong một SVC đặc biệt tên `drdynvc`. Cho phép tạo thêm channel sau khi session đã thiết lập.

### MS_T120 — Channel Đặc Biệt

`MS_T120` là một static virtual channel **chỉ dành cho internal server use** — không có lý do hợp lệ nào để client khai báo muốn dùng nó. Tuy nhiên, `termdd.sys` không kiểm tra điều này và chấp nhận client bind vào `MS_T120`.

**Server-side**: khi RDP session khởi động, `rdpwsx.dll` trong user-mode gọi `IcaChannelOpen("MS_T120")` để tạo channel này. Channel được tạo trong kernel qua `termdd.sys` và được bind với **Channel ID 31** (hardcoded).

**Đây là key**: channel `MS_T120` đã tồn tại với ID 31 trước khi client kết nối.

---

## Use-After-Free — Lý Thuyết Cốt Lõi

Trước khi đi vào bug cụ thể, cần hiểu UAF là gì và tại sao nó nguy hiểm.

> [!definition] Definition 5.2 — Use-After-Free (UAF)
> UAF xảy ra khi:
> 1. Một đối tượng được cấp phát trong heap: `obj = malloc(size)` → `obj` có địa chỉ hợp lệ
> 2. Đối tượng bị giải phóng: `free(obj)` → vùng nhớ trả về heap, nhưng con trỏ `obj` vẫn còn giá trị cũ
> 3. Code vẫn dùng `obj` sau khi free — đây là **dangling pointer** (con trỏ lơ lửng)
>
> Tại bước 3: vùng nhớ tại địa chỉ `obj` có thể đã được cấp phát lại cho một đối tượng khác. Attacker có thể kiểm soát nội dung của allocation mới → khi code dùng `obj` để gọi method (virtual dispatch) → thực thi code của attacker.

### UAF vs Buffer Overflow — So sánh

| Đặc điểm | Buffer Overflow | Use-After-Free |
|-----------|----------------|----------------|
| Cơ chế | Ghi quá giới hạn buffer | Dùng con trỏ sau khi free |
| Thời điểm | Tại thời điểm ghi | Phân tách: free xảy ra trước, exploit sau |
| Trigger | Một operation | Hai operation (free + access) |
| Khó khai thác | Trung bình | Cao — cần kiểm soát timing và allocation |
| Mitigation chính | Stack canary, safe_memcpy | Heap hardening, pointer clearing |
| CVSS điển hình | 7–10 | 8–10 (kernel UAF gần như luôn 9.8+) |

### Kernel UAF vs User-Space UAF

Trong user-space, heap allocator hiện đại (glibc ptmalloc, jemalloc) có nhiều metadata check làm UAF khó khai thác hơn. Tuy nhiên, trong **Windows kernel pool**:

- Không có ASLR tốt như user-space (KASLR yếu hơn nhiều, đặc biệt Windows 7)
- Heap spray dễ thực hiện hơn qua nhiều kernel primitive
- Exploit thành công → ngay lập tức có ring-0 code execution = toàn quyền máy

---

## Root Cause Analysis — termdd.sys

### Hàm `IcaBindVirtualChannels`

Driver `termdd.sys` chịu trách nhiệm quản lý ICA (Independent Computing Architecture) — tầng transport của RDP. Khi client gửi yêu cầu bind một virtual channel, `termdd.sys` gọi `IcaBindVirtualChannels`.

**Logic của hàm (trước patch — pseudo-code từ disassembly):**

```c
NTSTATUS IcaBindVirtualChannels(
    PICA_STACK pStack,
    PCHAR      pChannelName,
    ULONG      ulChannelId      // Channel ID client muốn dùng
) {
    PICA_CHANNEL pChannel;

    // Tìm channel theo tên trong danh sách hiện có
    pChannel = IcaFindChannelByName(pStack, pChannelName);

    if (pChannel != NULL) {
        // Channel đã tồn tại — bind vào ID mà CLIENT yêu cầu
        // BUG: không kiểm tra nếu channel này là "internal-only"
        IcaBindChannel(pStack, pChannel, ulChannelId);
        //              ^                 ^
        //              channel struct    ID do client quyết định (không phải 31)
    } else {
        // Channel chưa tồn tại → tạo mới và bind
        pChannel = IcaCreateChannel(pStack, pChannelName);
        IcaBindChannel(pStack, pChannel, ulChannelId);
    }
    return STATUS_SUCCESS;
}
```

**Logic sau patch:**

```c
    if (pChannel != NULL) {
        // FIX: nếu là MS_T120, luôn dùng ID 31, không dùng ID của client
        if (strcmp(pChannelName, "MS_T120") == 0) {
            ulChannelId = 31;  // override bất kể client gửi gì
        }
        IcaBindChannel(pStack, pChannel, ulChannelId);
    }
```

### Tại sao Bind hai lần tạo ra Two References?

Đây là phần cần đọc kỹ:

**Bước 1 — Server tự tạo MS_T120:**

```text
rdpwsx.dll::MCSCreateDomain():
  IcaChannelOpen("MS_T120")
    → termdd.sys::IcaCreateChannel("MS_T120")
    → Channel object được tạo trong NonPaged Pool (0x170 bytes)
    → Channel được bind với ID = 31
    → Reference count của channel = 1
    → Lookup table: ID 31 → pChannel
```

**Bước 2 — Client gửi yêu cầu bind MS_T120 với ID khác (ví dụ ID 5):**

```text
Client→Server: MCS Channel Join Request, channel_id=5, name="MS_T120"

termdd.sys::IcaBindVirtualChannels("MS_T120", client_requested_id=5):
  IcaFindChannelByName("MS_T120") → tìm thấy channel đã tồn tại
  IcaBindChannel(pStack, pChannel, id=5)  ← bind CÙNG channel object vào ID 5
    → Lookup table: ID 5 → pChannel (cùng pointer!)
    → Reference count của channel = 2? Không — chỉ thêm entry vào table
```

Kết quả: **cùng một channel struct** (`pChannel`) bây giờ có thể truy cập qua **hai Channel ID khác nhau**: ID 31 (nội bộ) và ID 5 (client).

> [!definition] Definition 5.3 — Double-Bind UAF Root Cause
> Khi RDP session bị đóng, kernel duyệt qua bảng channel và giải phóng từng channel một. Channel `MS_T120` sẽ bị `free()` khi entry ID 31 được xử lý. Nhưng entry ID 5 vẫn còn trong bảng, trỏ đến cùng địa chỉ — nay là **freed memory**.
>
> Attacker có thể gửi message đến channel ID 5 **sau khi** channel đã bị free → code đọc channel struct đã giải phóng → UAF.
>
> Cụ thể: `termdd.sys` tìm channel qua ID 5, lấy `pChannel`, gọi `pChannel->dispatch_table->some_function(...)` — đây là virtual dispatch qua vtable. Nếu attacker đã reclaim vùng nhớ đó với dữ liệu giả → kiểm soát được function pointer.

### Channel Struct Layout (0x170 bytes)

Channel struct trong NonPaged Pool (từ reverse engineering bởi MalwareTech và RICSecLab):

```text
Offset  Size  Field
------  ----  -----
0x000   0x04  Pool header (thực ra là POOL_HEADER 8 bytes ở phía trước chunk)
0x000   0x08  pNext (linked list)
0x008   0x08  pPrev
0x010   0x04  ChannelId
0x014   0x04  Flags
0x018   0x08  pStack (back-pointer to ICA_STACK)
...
0x0F8   0x08  IoCompletionPort handle
0x100   0x08  Pointer to dispatch table (vtable-like)
               ↑ ĐÂY là target để overwrite
0x108   ...   Other fields
...
0x168   0x08  (last field)
---- total: 0x168 bytes data + POOL_HEADER = 0x170 bytes ----
```

**Tại offset 0x100** là một con trỏ đến dispatch table — tương tự vtable của C++. Khi kernel xử lý một PDU đến channel này, nó gọi function thông qua con trỏ này:

```c
// Simplified pseudo-code
PICA_CHANNEL pChan = LookupChannelById(channelId);
pChan->dispatch_table->process_pdu(pChan, pData, dataLen);
//     ^--- nếu dispatch_table bị overwrite → arbitrary code execution
```

---

## BinDiff Analysis — Trước và Sau Patch

BinDiff là kỹ thuật so sánh hai binary để tìm thay đổi. Đây là cách tìm ra root cause khi chỉ có patch mà không có source code.

### Công cụ

```bash
# Cài BinDiff (dùng với IDA Pro hoặc Ghidra)
# Hoặc dùng diaphora (open-source alternative)
pip install diaphora

# So sánh hai version termdd.sys
python diaphora.py termdd_before.sys termdd_after.sys
```

### Những gì thay đổi trong patch

Patch tháng 5/2019 chỉ thay đổi **hai hàm** trong `termdd.sys`:
- `IcaBindVirtualChannels`
- `IcaRebindVirtualChannels`

Cả hai hàm đều nhận thêm một check:

```c
// Thêm vào đầu đoạn xử lý "channel đã tồn tại":
if (RtlCompareMemory(pChannelName, "MS_T120", 7) == 7) {
    // Nếu là MS_T120, force bind vào ID 31
    // → không bao giờ tạo second reference với ID khác
    channelId = 31;
}
```

Patch đơn giản nhưng hiệu quả: không cho phép `MS_T120` có nhiều hơn một Channel ID binding.

### Detect patch bằng Python

```python
import hashlib
import sys

# SHA-256 của termdd.sys versions
KNOWN_HASHES = {
    # Windows 7 SP1 x64
    "6a86c9e5d2c2f5c3c9d8f9a7b8e0d1f2a3b4c5d6e7f8091a2b3c4d5e6f70819": "VULNERABLE (pre-patch)",
    "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456": "PATCHED (KB4499175)",
}

def check_termdd(filepath):
    with open(filepath, 'rb') as fh:
        data = fh.read()
    h = hashlib.sha256(data).hexdigest()
    status = KNOWN_HASHES.get(h, "UNKNOWN — check manually")
    print(f"termdd.sys SHA256: {h}")
    print(f"Status: {status}")

check_termdd(sys.argv[1] if len(sys.argv) > 1 else "C:\\Windows\\System32\\drivers\\termdd.sys")
```

---

## Phát Hiện BlueKeep Từ Mạng

BlueKeep khác EternalBlue ở chỗ: **không có byte pattern đặc trưng** trong packet vì exploit payload nằm trong virtual channel data được mã hóa. Tuy nhiên, vẫn có thể detect qua network behavior.

### Nmap scanner

```bash
nmap -p 3389 --script rdp-vuln-ms12-020 <target>
# Hoặc dùng script chuyên biệt:
nmap -p 3389 --script rdp-enum-encryption <target>
```

Metasploit có scanner riêng:

```bash
msfconsole -q
msf> use auxiliary/scanner/rdp/cve_2019_0708_bluekeep
msf> set RHOSTS 192.168.1.0/24
msf> run
```

Scanner kiểm tra bằng cách gửi MCS Channel Join Request cho MS_T120 — nếu server **chấp nhận** join thay vì từ chối, server đó vulnerable.

### Python checker với rdp library

```python
import socket
import struct

def check_bluekeep(host, port=3389, timeout=5):
    """
    Gửi MCS Channel Join Request cho MS_T120.
    Nếu server response với Channel Join Confirm → vulnerable.
    """
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(timeout)
    try:
        s.connect((host, port))
    except Exception as e:
        return f"Connection failed: {e}"

    # X.224 Connection Request (TPKT + X.224 CR TPDU)
    x224_cr = bytes.fromhex(
        '030000130ee00000000000' +
        '00436f6f6b69653a206d737473686173683d75736572300d0a'
    )
    s.send(x224_cr)
    resp = s.recv(1024)
    if b'\xd0' not in resp:
        return "Not an RDP server or X.224 rejected"

    # MCS Connect Initial với channel "MS_T120"
    mcs_ci = bytes.fromhex(
        '030001640200650040'
        '0000000000000000000000000000'
        '04001001000800020001000000'
    )
    s.send(mcs_ci)
    resp = s.recv(4096)

    s.close()

    if b'MS_T120' in resp or len(resp) > 200:
        return f"POSSIBLY VULNERABLE — server responded with {len(resp)} bytes"
    return "Likely patched (MS_T120 rejected)"

result = check_bluekeep("192.168.1.100")
print(f"BlueKeep check: {result}")
```

> [!warning] Lưu ý Scanner
> Scanner đơn giản trên chỉ là minh họa cấu trúc. Scanner chính xác nhất (Metasploit module `auxiliary/scanner/rdp/cve_2019_0708_bluekeep`) thực hiện đầy đủ RDP handshake và phân tích response chính xác hơn. Không chạy scanner trên hệ thống không được phép.

---

## So sánh BlueKeep với EternalBlue

| Đặc điểm | EternalBlue | BlueKeep |
|-----------|-------------|---------|
| Driver | `srv.sys` / `srvnet.sys` | `termdd.sys` |
| Port | TCP 445 | TCP 3389 |
| Lớp lỗi | Integer overflow → OOB Write | Double-bind → UAF |
| Primitive | Relative write (OOB) | Write-after-free (dangling ptr) |
| Kernel technique | Pool grooming + overflow | Pool spray + UAF reclaim |
| Độ ổn định | Trung bình (crash nếu groom sai) | Thấp-trung bình (BSOD nếu spray sai) |
| Wormable | Có (WannaCry) | Có (chưa worm thực sự xuất hiện) |
| Exploit công khai | Metasploit, worawit | Metasploit (unreliable), RICSecLab PoC |

---

## Summary

- RDP dùng virtual channels; MS_T120 là internal channel, không dành cho client
- `IcaBindVirtualChannels` trong `termdd.sys` không kiểm tra `MS_T120` → cho phép client bind channel đã tồn tại với ID mới → **two references** đến cùng channel struct
- Khi session đóng, channel bị free một lần → dangling pointer ở reference thứ hai
- Channel struct = 0x170 bytes NonPaged Pool; offset 0x100 chứa dispatch table pointer
- Attacker cần: (1) trigger double-bind, (2) trigger free, (3) reclaim chunk với controlled data, (4) trigger dispatch → RCE với ring-0
- Patch đơn giản: force MS_T120 luôn bind ID 31, không bao giờ accept binding khác
- [[06-bluekeep-heap-spray-exploit|Bài tiếp theo]] sẽ đi vào chi tiết heap spray với rdpsnd channel và PoC đầy đủ

---

## References

- MalwareTech — "Analysis of CVE-2019-0708 (BlueKeep)": https://malwaretech.com/2019/05/analysis-of-cve-2019-0708-bluekeep.html
- MalwareTech — "BlueKeep: A Journey from DoS to RCE": https://www.malwaretech.com/2019/09/bluekeep-a-journey-from-dos-to-rce-cve-2019-0708.html
- Unit 42 Palo Alto — "Exploitation of Windows CVE-2019-0708": https://unit42.paloaltonetworks.com/exploitation-of-windows-cve-2019-0708-bluekeep-three-ways-to-write-data-into-the-kernel-with-rdp-pdu/
- RICSecLab PoC: https://github.com/RICSecLab/CVE-2019-0708
- Kryptos Logic — "BlueKeep Exploitation Spotted in the Wild": https://www.kryptoslogic.com/blog/2019/11/bluekeep-cve-2019-0708-exploitation-spotted-in-the-wild/
- Wikipedia — BlueKeep: https://en.wikipedia.org/wiki/BlueKeep
- Metasploit module source: https://github.com/rapid7/metasploit-framework/blob/master/modules/exploits/windows/rdp/cve_2019_0708_bluekeep_rce.rb
