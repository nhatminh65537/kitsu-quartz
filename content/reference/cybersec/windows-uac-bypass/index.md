---
title: "Windows UAC Bypass Techniques"
tags: [pentest, windows, uac-bypass, privesc, index]
created: 2026-04-02
---

> [[00-roadmap|00. Roadmap]] · [[fm-field-manual|Field Manual]]

---

## SVG Asset Registry

| File | Lesson | Mô tả |
|------|-------|-------|
| `assets/img-01-uac-integrity-chain.svg` | [[01-uac-internals|01. UAC Internals]] | Integrity level chain: Low → Medium → High → System + filtered token flow |
| `assets/img-02-autoelevation-decision.svg` | [[02-auto-elevation-mechanism|02. Auto-Elevation Mechanism]] | AppInfo service decision tree: manifest → path → signature → elevate |
| `assets/img-07-dll-search-order.svg` | [[07-dll-hijack-systemproperties|07. DLL Hijack SystemProperties]] | DLL search order + SystemPropertiesAdvanced.exe hijack path |

---

## Lessons

| # | Lesson | Type | Tóm tắt |
|---|-------|------|---------|
| 00 | [[00-roadmap\|00. Roadmap]] | — | Lesson map và dependency graph |
| 01 | [[01-uac-internals\|01. UAC Internals & Integrity Levels]] | F | Token model, integrity levels, AppInfo service, UAC consent flow |
| 02 | [[02-auto-elevation-mechanism\|02. Auto-Elevation Mechanism]] | F | Manifest autoElevate flag, binary whitelist, path/signature checks |
| 03 | [[03-registry-hijack-fodhelper\|03. Registry Hijack — fodhelper & computerdefaults]] | A | ms-settings ProgID hijack, DelegateExecute, OSCP staple |
| 04 | [[04-registry-hijack-eventvwr\|04. Registry Hijack — eventvwr (Fileless)]] | A | mscfile handler, zero disk footprint, kỹ thuật gốc 2016 |
| 05 | [[05-registry-hijack-sdclt-perfmon\|05. Registry Hijack — sdclt & perfmon]] | A | IsolatedCommand, App Paths, Folder class — 3 sdclt variants |
| 06 | [[06-registry-hijack-slui-changepk\|06. Registry Hijack — slui & changepk]] | A | exefile shell handler, Windows Activation flow abuse |
| 07 | [[07-dll-hijack-systemproperties\|07. DLL Hijack — SystemPropertiesAdvanced]] | A | srrstr.dll, AppData\WindowsApps write path |
| 08 | [[08-ifileoperation-dll-hijack\|08. IFileOperation Privileged File Copy]] | A | dllhost.exe COM Surrogate, copy DLL into System32 |
| 09 | [[09-mock-trusted-directories\|09. Mock Trusted Directories]] | A | Trailing space trick, mmc.exe impersonation |
| 10 | [[10-elevated-com-icmluautil-cmstp\|10. Elevated COM — ICMLuaUtil & CMSTP]] | A | ICMLuaUtil COM, CMSTPLUA interface, ransomware-used primitive |
| 11 | [[11-com-token-security-evasion\|11. COM Token Security Attributes & Evasion]] | A | LUA://HdAutoAp token, registry symlink UACME 3.5+ evasion |
| 12 | [[12-silentcleanup-task-hijack\|12. SilentCleanup Scheduled Task Hijack]] | A | DiskCleanup task, file write race, DismHost.exe |
| 13 | [[13-env-var-hijack-windir\|13. Environment Variable Hijack — %windir%]] | A | CDSSync task, npmproxy.dll, works on Always Notify |
| 14 | [[14-uacme-framework\|14. UACME — UAC Bypass Framework]] | T | akagi64.exe method selection, lab testing workflow |
| 15 | [[15-uac-triage-methodology\|15. UAC Bypass Triage Methodology & EDR Evasion]] | M | Decision flowchart, cleanup, registry symlink evasion |
| FM | [[fm-field-manual\|Field Manual]] | Ref | Tài liệu tra cứu nhanh tích lũy |

---

## Attack Techniques Covered

| Primitive | Techniques | Lessons |
|-----------|-----------|---------|
| Registry Hijacking | fodhelper, computerdefaults, eventvwr, sdclt, perfmon, slui, changepk | [[03-registry-hijack-fodhelper\|03]]–[[06-registry-hijack-slui-changepk\|06]] |
| DLL Hijacking | SystemPropertiesAdvanced, IFileOperation, Mock Directories | [[07-dll-hijack-systemproperties\|07]]–[[09-mock-trusted-directories\|09]] |
| COM Object Abuse | ICMLuaUtil, CMSTP, Token Security Attributes | [[10-elevated-com-icmluautil-cmstp\|10]]–[[11-com-token-security-evasion\|11]] |
| Scheduled Task | SilentCleanup, CDSSync + %windir% | [[12-silentcleanup-task-hijack\|12]]–[[13-env-var-hijack-windir\|13]] |

---

## Tools Covered

| Tool | Purpose | Lesson |
|------|---------|-------|
| UACME (akagi64.exe) | Framework test tất cả UAC bypass methods | [[14-uacme-framework\|14]] |
| Sysmon / Procmon | Monitor registry/file/process events | [[14-uacme-framework\|14]], [[15-uac-triage-methodology\|15]] |
| PowerShell | Registry manipulation, payload delivery | [[03-registry-hijack-fodhelper\|03]]–[[06-registry-hijack-slui-changepk\|06]] |

---

*Index cập nhật sau mỗi lesson được generate.*
