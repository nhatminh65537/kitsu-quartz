---
title: "WebAssembly"
tags: [webassembly, wasm, index]
created: 2026-03-24
---

## Lessons

- [[00-roadmap|00. Roadmap]]
- [[01-gioi-thieu-webassembly|01. Giới thiệu WebAssembly]] — Lịch sử web, vì sao Wasm ra đời, so sánh với JavaScript, các use case thực tế.
- [[02-kien-truc-wasm-stack-machine|02. Kiến trúc Wasm — Stack Machine & Module]] — Stack machine model, cấu trúc module .wasm, các section (type/func/memory/export...), execution model.
- [[03-webassembly-text-format|03. WebAssembly Text Format (WAT)]] — Cú pháp S-expression, viết hàm WAT, control flow (if/block/loop/br), import/export, data segment, công cụ wat2wasm/wasm2wat.
- [[04-binary-format-va-encoding|04. Binary Format & Encoding]] — Magic bytes, section layout, LEB128 encoding (uLEB128 & sLEB128), đọc hexdump từng byte, wasm-objdump, custom section là attack surface.
- [[05-emscripten-bien-dich-c-cpp|05. Emscripten — Biên dịch C/C++ → Wasm]] — emsdk setup, ba chế độ output (HTML/JS/Wasm standalone), emcc flags, export functions, truyền arrays qua linear memory, Embind cho C++ classes.
- [[06-rust-wasm-pack|06. Rust + wasm-pack]] — wasm-pack workflow, macro `#[wasm_bindgen]`, import/export giữa Rust và JS, js-sys & web-sys, image processing example, so sánh với Emscripten.
- [[07-javascript-wasm-interop|07. JavaScript ↔ Wasm Interop]] — WebAssembly JS API đầy đủ (`instantiateStreaming`, `Memory`, `Table`, `Global`), TypedArray views, truyền string/array qua linear memory, callbacks, pitfall `i64`/BigInt.
- [[08-memory-management|08. Memory Management trong Wasm]] — Layout linear memory (static/stack/heap), shadow call stack vs value stack, `memory.grow` và invalidated views, malloc/free internals, buffer overflow attack surface, strategies phòng ngừa.
- [[09-wasi-wasm-ngoai-trinh-duyet|09. WASI — Wasm ngoài Trình duyệt]] — Capability-based security model, wasmtime/wasmer setup, CLI app Rust với `wasm32-wasip1`, WASI 0.1 vs 0.2, cloud-native use cases (serverless, plugin sandbox, edge computing).
- [[10-advanced-wasm-features|10. Advanced Wasm Features]]
- [[11-component-model-cloud-native|11. Wasm Component Model & Cloud Native]] — WIT IDL (cú pháp, types, worlds), Component vs core module, cargo-component, WASI 0.2 HTTP handler, compose nhiều components, Fermyon Spin, wasmCloud, Kubernetes RuntimeClass.
- [[12-wasm-security-model|12. Wasm Security Model]] — Ba tầng bảo mật (sandbox, memory bounds, CFI), giới hạn của Wasm CFI (granularity thô, WOP attacks), timing attacks/side channels, CVE thực tế (CVE-2024-47813, CVE-2025-5419), security hardening checklist. — SIMD v128 (f32x4, i32x4...), Threads & Atomics (SharedArrayBuffer, compare-exchange, mutex), Multi-value returns, Reference Types (externref/funcref), WasmGC, Tail Calls, bảng browser support 2026.
- [[13-reverse-engineering-static|13. Reverse Engineering Wasm — Static Analysis]] — Methodology tổng quan, WABT workflow (`wasm-objdump`, `wasm2wat`, `wasm2c`, `wasm-decompile`), Ghidra Wasm plugin, nhận dạng pattern (string compare, XOR, lookup table), Python script đọc data segments, full CTF walkthrough.
- [[14-reverse-engineering-dynamic|14. Reverse Engineering Wasm — Dynamic Analysis]] — Chrome DevTools breakpoints/stepping, đọc/ghi linear memory từ Console, JS hooks wrap exports/imports, memory patching để bypass checks, Table patching, WAT instrumentation, wasmtime + GDB, methodology kết hợp static+dynamic.
- [[15-wasm-exploitation|15. Wasm Exploitation]] — Primitive khai thác (stack BOF, heap metadata corruption emmalloc, WOP qua vtable, format string), attack chains (BOF→XSS, heap→SQLi, timing→XS-Leak), PoC Python framework, bypass coarse CFI.
- [[16-ctf-walkthrough|16. CTF Walkthrough — Wasm Reverse Engineering]] — 3 walkthrough đầy đủ: b01lersCTF 2020 (XOR decode), HackPack CTF 2023 (logic reversing + dynamic), Chang'an Cup 2021 (RC4 reverse). Decision tree, command cheat sheet, JS Console snippets.
- [[17-fuzzing-va-kiem-thu-bao-mat|17. Kiểm thử Bảo mật & Fuzzing Wasm]] — Audit checklist 5 phases (recon → pattern hunt → boundary → WASI), libFuzzer + wasmtime harness C, ZK verifier fuzzing strategy (false positive = Critical), mutation strategies (zero point, boundary values), template bug report Immunefi.

## Appendices

- [[a0-wabt-toolkit-reference|A0. WABT Toolkit Reference]] — Cheat sheet đầy đủ: wasm2wat, wat2wasm, wasm-objdump, wasm2c, wasm-decompile, wasm-validate, wasm-strip, wasm-stats. Quick workflows cho RE.
- [[a1-wat-instruction-reference|A1. WAT Instruction Reference]] — Bảng tra cứu toàn bộ instructions theo nhóm: control, variable, memory, numeric (i32/i64/f32/f64), conversion, atomic, SIMD. Opcode bảng.
- [[a2-binary-format-reference|A2. Binary Format Reference]] — Section format chi tiết (Type, Import, Export, Code, Data), LEB128 encode/decode code, hexdump walkthrough module đơn giản.
- [[a3-ctf-solve-scripts|A3. CTF Solve Scripts]] — Python: WasmModule parser, decode_ciphers (XOR/RC4/base64), MemoryDump helper. JavaScript: WasmCTF console toolkit, hook template. Command cheat sheet.

## Appendices

*(Chưa có — sẽ cập nhật theo tiến trình học)*

## Tool & Library Guide

| Tool / Library | Purpose | Install |
|----------------|---------|---------|
| `emscripten` | Biên dịch C/C++ → Wasm | `git clone https://github.com/emscripten-core/emsdk` |
| `wasm-pack` | Biên dịch Rust → Wasm + npm package | `cargo install wasm-pack` |
| `wabt` | WABT toolkit: wasm2wat, wat2wasm, wasm-objdump... | `apt install wabt` hoặc build từ source |
| `wasmtime` | Wasm runtime standalone (WASI) | `curl https://wasmtime.dev/install.sh \| bash` |
| `wasmer` | Wasm runtime thay thế (WASI) | `curl https://get.wasmer.io -sSfL \| sh` |
| `wasm-bindgen` | Rust ↔ JS bindings | Cargo dependency |
| `Binaryen` | Wasm optimizer, fuzzer (`wasm-opt`, `wasm-fuzz`) | Build từ source |

## Notation Guide

| Ký hiệu / Thuật ngữ | Ý nghĩa |
|---------------------|---------|
| `.wasm` | Binary format của WebAssembly module |
| `.wat` | WebAssembly Text Format (human-readable) |
| `i32 / i64` | Kiểu số nguyên 32-bit và 64-bit |
| `f32 / f64` | Kiểu số thực 32-bit và 64-bit |
| Linear memory | Vùng nhớ liên tục (byte array) duy nhất mà Wasm module sử dụng |
| Stack machine | Mô hình thực thi dùng stack thay vì register |
| Host | Môi trường chạy Wasm (browser, wasmtime, Node.js...) |
| Module | Đơn vị biên dịch và triển khai trong Wasm |
| Import / Export | Giao tiếp giữa Wasm module và môi trường bên ngoài |
| WASI | WebAssembly System Interface — syscall abstraction ngoài browser |
| CFI | Control Flow Integrity — cơ chế bảo vệ luồng thực thi |
