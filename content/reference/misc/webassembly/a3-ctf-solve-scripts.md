---
title: "A3. CTF Solve Scripts"
tags: [webassembly, wasm, appendix, ctf, scripts, python, javascript]
aliases: [CTF Scripts, Wasm CTF Toolkit]
created: 2026-03-24
---

> Tổng hợp Python/JavaScript scripts tái sử dụng cho CTF Wasm challenges.
> Xem thêm: [[16-ctf-walkthrough|16. CTF Walkthrough]], [[13-reverse-engineering-static|13. Static RE]]

---

## Python Utilities

### parse_wasm.py — Parser binary format

```python
"""
parse_wasm.py — Đọc và phân tích Wasm binary
"""

import struct
from typing import Optional, List, Tuple, Dict


def read_uleb128(data: bytes, pos: int) -> Tuple[int, int]:
    result, shift = 0, 0
    while True:
        if pos >= len(data):
            raise ValueError(f"LEB128 truncated at pos {pos}")
        byte = data[pos]; pos += 1
        result |= (byte & 0x7F) << shift
        shift += 7
        if not (byte & 0x80):
            break
    return result, pos


def read_sleb128(data: bytes, pos: int) -> Tuple[int, int]:
    result, shift = 0, 0
    while True:
        byte = data[pos]; pos += 1
        result |= (byte & 0x7F) << shift
        shift += 7
        if not (byte & 0x80):
            if shift < 64 and (byte & 0x40):
                result |= -(1 << shift)
            break
    return result, pos


SECTION_NAMES = {
    0: "Custom", 1: "Type", 2: "Import", 3: "Function",
    4: "Table", 5: "Memory", 6: "Global", 7: "Export",
    8: "Start", 9: "Element", 10: "Code", 11: "Data", 12: "DataCount"
}


class WasmModule:
    def __init__(self, filepath: str):
        with open(filepath, "rb") as f:
            self.raw = f.read()
        self.sections: List[Dict] = []
        self._parse()

    def _parse(self):
        if self.raw[:4] != b'\x00asm':
            raise ValueError("Not a valid Wasm file")
        self.version = struct.unpack_from('<I', self.raw, 4)[0]

        pos = 8
        while pos < len(self.raw):
            sec_id = self.raw[pos]; pos += 1
            sec_size, pos = read_uleb128(self.raw, pos)
            sec_content = self.raw[pos:pos + sec_size]
            self.sections.append({
                "id": sec_id,
                "name": SECTION_NAMES.get(sec_id, f"Unknown({sec_id})"),
                "size": sec_size,
                "offset": pos,
                "content": sec_content,
            })
            pos += sec_size

    def get_section(self, id_or_name) -> Optional[Dict]:
        for s in self.sections:
            if s["id"] == id_or_name or s["name"] == id_or_name:
                return s
        return None

    def get_data_segments(self) -> List[Dict]:
        data_sec = self.get_section(11)
        if not data_sec:
            return []
        content = data_sec["content"]
        pos = 0
        num_segs, pos = read_uleb128(content, pos)
        segments = []
        for _ in range(num_segs):
            flags, pos = read_uleb128(content, pos)
            pos += 1  # i32.const opcode
            offset, pos = read_uleb128(content, pos)
            pos += 1  # end opcode
            seg_size, pos = read_uleb128(content, pos)
            data = content[pos:pos + seg_size]
            segments.append({"flags": flags, "offset": offset,
                              "size": seg_size, "data": data})
            pos += seg_size
        return segments

    def get_exports(self) -> List[Dict]:
        export_sec = self.get_section(7)
        if not export_sec:
            return []
        content = export_sec["content"]
        pos = 0
        num, pos = read_uleb128(content, pos)
        exports = []
        for _ in range(num):
            name_len, pos = read_uleb128(content, pos)
            name = content[pos:pos + name_len].decode()
            pos += name_len
            kind = content[pos]; pos += 1
            idx, pos = read_uleb128(content, pos)
            exports.append({"name": name, "kind": kind, "index": idx})
        return exports

    def find_strings(self, min_len: int = 5) -> List[Tuple[int, str]]:
        results = []
        start = -1
        for i, b in enumerate(self.raw):
            if 32 <= b < 127:
                if start == -1: start = i
            else:
                if start != -1 and i - start >= min_len:
                    s = self.raw[start:i].decode('ascii', errors='ignore')
                    results.append((start, s))
                start = -1
        return results


def main():
    import sys
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <file.wasm>")
        return

    mod = WasmModule(sys.argv[1])
    print(f"Version: {mod.version}")
    print(f"\nSections ({len(mod.sections)}):")
    for s in mod.sections:
        print(f"  [{s['id']:2d}] {s['name']:<12} {s['size']:6d} bytes @ 0x{s['offset']:04x}")

    print(f"\nExports:")
    kinds = {0: "func", 1: "table", 2: "memory", 3: "global"}
    for e in mod.get_exports():
        print(f"  {kinds.get(e['kind'], '?')}[{e['index']}] -> \"{e['name']}\"")

    print(f"\nData Segments:")
    for seg in mod.get_data_segments():
        preview = repr(seg['data'][:32])
        print(f"  @ 0x{seg['offset']:04x} size={seg['size']} {preview}")

    print(f"\nStrings (min 5 chars):")
    for addr, s in mod.find_strings()[:20]:
        print(f"  0x{addr:04x}: {s!r}")


if __name__ == "__main__":
    main()
```

---

### decode_ciphers.py — Giải mã thuật toán thường gặp

```python
"""
decode_ciphers.py — Toolkit giải mã cho CTF Wasm
"""


def xor_decrypt(ciphertext: bytes, key: int | bytes) -> bytes:
    if isinstance(key, int):
        return bytes(b ^ key for b in ciphertext)
    return bytes(b ^ key[i % len(key)] for i, b in enumerate(ciphertext))


def rot13(text: str) -> str:
    result = []
    for c in text:
        if 'a' <= c <= 'z':
            result.append(chr((ord(c) - ord('a') + 13) % 26 + ord('a')))
        elif 'A' <= c <= 'Z':
            result.append(chr((ord(c) - ord('A') + 13) % 26 + ord('A')))
        else:
            result.append(c)
    return ''.join(result)


def rc4(key: bytes, data: bytes) -> bytes:
    S = list(range(256))
    j = 0
    for i in range(256):
        j = (j + S[i] + key[i % len(key)]) % 256
        S[i], S[j] = S[j], S[i]
    result, i, j = [], 0, 0
    for byte in data:
        i = (i + 1) % 256
        j = (j + S[i]) % 256
        S[i], S[j] = S[j], S[i]
        result.append(byte ^ S[(S[i] + S[j]) % 256])
    return bytes(result)


def base64_decode(s: str) -> bytes:
    import base64
    return base64.b64decode(s)


def try_all_xor_keys(ciphertext: bytes, contains: str = "flag{") -> list:
    results = []
    for key in range(256):
        dec = xor_decrypt(ciphertext, key)
        try:
            text = dec.decode('utf-8', errors='ignore')
            if contains.lower() in text.lower():
                results.append((key, text.rstrip('\x00')))
        except Exception:
            pass
    return results


def find_xor_key(ciphertext: bytes, known_plaintext: bytes) -> int:
    return ciphertext[0] ^ known_plaintext[0]


if __name__ == "__main__":
    import sys

    ct = bytes.fromhex("1b 37 37 33 31 36 3f 78 15 1b 7f 2b 78 36 28 36 \
                        1d 73 25 27 7a 23 39 2a 25 2a 2e 7e 18 1f 16 7e".replace(' ', ''))
    print("[*] Trying all XOR keys...")
    found = try_all_xor_keys(ct, "cook")
    for key, plaintext in found:
        print(f"  Key 0x{key:02x}: {plaintext!r}")
```

---

### memory_dump.py — Đọc Wasm memory từ file dump

```python
"""
memory_dump.py — Phân tích memory dump từ Wasm instance
(Save dump bằng: new Uint8Array(instance.exports.memory.buffer) → JSON/binary)
"""

import struct
from typing import Optional


class MemoryDump:
    def __init__(self, data: bytes):
        self.data = bytearray(data)

    def r8(self, addr: int) -> int:
        return self.data[addr]

    def r16(self, addr: int) -> int:
        return struct.unpack_from('<H', self.data, addr)[0]

    def r32(self, addr: int) -> int:
        return struct.unpack_from('<I', self.data, addr)[0]

    def r64(self, addr: int) -> int:
        return struct.unpack_from('<Q', self.data, addr)[0]

    def read_str(self, addr: int, max_len: int = 256) -> str:
        end = addr
        while end < addr + max_len and self.data[end] != 0:
            end += 1
        return self.data[addr:end].decode('utf-8', errors='replace')

    def find_bytes(self, pattern: bytes) -> list:
        results, idx = [], 0
        while True:
            idx = self.data.find(pattern, idx)
            if idx == -1: break
            results.append(idx)
            idx += 1
        return results

    def find_strings(self, min_len: int = 6) -> list:
        results, start = [], -1
        for i, b in enumerate(self.data):
            if 32 <= b < 127:
                if start == -1: start = i
            else:
                if start != -1 and i - start >= min_len:
                    s = self.data[start:i].decode('ascii', errors='ignore')
                    results.append((start, s))
                start = -1
        return results

    def hex_dump(self, addr: int, length: int = 64):
        print(f"Hex dump @ 0x{addr:04x}:")
        for i in range(0, length, 16):
            chunk = self.data[addr + i:addr + i + 16]
            hex_part = ' '.join(f'{b:02x}' for b in chunk)
            ascii_part = ''.join(chr(b) if 32 <= b < 127 else '.' for b in chunk)
            print(f"  {addr+i:04x}: {hex_part:<48}  {ascii_part}")
```

---

## JavaScript Browser Utilities

### console_toolkit.js — Paste vào DevTools Console

```javascript
// =============================================================
// Wasm CTF Console Toolkit — Paste toàn bộ vào DevTools Console
// =============================================================

const WasmCTF = {
  // Lấy memory buffer (auto-detect từ window)
  getMem() {
    const candidates = [
      window._wasm?.exports?.memory,
      window.Module?.asm?.memory,
      window.instance?.exports?.memory,
    ];
    for (const m of candidates) {
      if (m?.buffer) return m.buffer;
    }
    throw new Error('Cannot find Wasm memory. Set window._mem = instance.exports.memory manually.');
  },

  // Đọc string UTF-8 tại địa chỉ ptr
  str(ptr, maxLen = 128) {
    const view = new Uint8Array(this.getMem());
    let end = ptr;
    while (end < ptr + maxLen && view[end] !== 0) end++;
    return new TextDecoder().decode(view.slice(ptr, end));
  },

  // Đọc bytes tại địa chỉ
  bytes(ptr, len) {
    return new Uint8Array(this.getMem()).slice(ptr, ptr + len);
  },

  // Đọc i32 little-endian
  i32(ptr) {
    return new DataView(this.getMem()).getInt32(ptr, true);
  },

  // Hex dump
  dump(ptr, len = 64) {
    const view = new Uint8Array(this.getMem());
    const lines = [];
    for (let i = 0; i < len; i += 16) {
      const chunk = view.slice(ptr + i, ptr + i + Math.min(16, len - i));
      const hex = [...chunk].map(b => b.toString(16).padStart(2, '0')).join(' ');
      const ascii = [...chunk].map(b => b >= 32 && b < 127 ? String.fromCharCode(b) : '.').join('');
      lines.push(`0x${(ptr+i).toString(16).padStart(4,'0')}: ${hex.padEnd(48)} ${ascii}`);
    }
    console.log(lines.join('\n'));
  },

  // Tìm tất cả strings trong memory
  findStrings(minLen = 6) {
    const view = new Uint8Array(this.getMem());
    const results = [];
    let start = -1;
    for (let i = 0; i < view.length; i++) {
      if (view[i] >= 32 && view[i] < 127) {
        if (start === -1) start = i;
      } else {
        if (start !== -1 && i - start >= minLen) {
          results.push({
            addr: `0x${start.toString(16)}`,
            str: new TextDecoder().decode(view.slice(start, i))
          });
        }
        start = -1;
      }
    }
    return results;
  },

  // Ghi bytes vào memory
  write(ptr, data) {
    const view = new Uint8Array(this.getMem());
    if (typeof data === 'string') {
      data = new TextEncoder().encode(data);
    }
    view.set(data, ptr);
  },

  // Ghi i32 little-endian
  writeI32(ptr, value) {
    new DataView(this.getMem()).setInt32(ptr, value, true);
  },

  // XOR decrypt một vùng memory
  xorDecrypt(ptr, len, key) {
    const view = new Uint8Array(this.getMem());
    const result = [];
    for (let i = 0; i < len; i++) {
      result.push(view[ptr + i] ^ (typeof key === 'number' ? key : key[i % key.length]));
    }
    return new Uint8Array(result);
  },

  // Brute force single byte/int input vào check function
  async bruteForce(checkFn, min = 0, max = 65536) {
    for (let i = min; i <= max; i++) {
      if (checkFn(i)) {
        console.log(`[*] Found: ${i} (0x${i.toString(16)})`);
        return i;
      }
    }
    console.log('[!] Not found');
    return null;
  },

  // Gọi một function và return giá trị với nhiều input types
  callExport(name, ...args) {
    const fn = window.instance?.exports[name] ||
               window._wasm?.exports[name] ||
               window.Module?.asm[name];
    if (!fn) throw new Error(`Export '${name}' not found`);
    const result = fn(...args);
    console.log(`${name}(${args.join(', ')}) = ${result}`);
    return result;
  }
};

console.log('[*] WasmCTF toolkit loaded. Usage: WasmCTF.str(0x100), WasmCTF.dump(0x200, 64), ...');
```

### hook_template.js — Hook exports/imports

```javascript
// Hook ALL exported functions để log calls
function hookAllExports(instance) {
  const original = {};
  for (const [name, fn] of Object.entries(instance.exports)) {
    if (typeof fn !== 'function') continue;
    original[name] = fn;
    instance.exports[name] = function(...args) {
      const result = original[name](...args);
      console.log(`[HOOK] ${name}(${args.join(', ')}) = ${result}`);
      return result;
    };
  }
  console.log(`[*] Hooked ${Object.keys(original).length} exports`);
  return original;  // giữ reference để unhook
}

// Sử dụng:
// const originals = hookAllExports(instance);
// ... trigger actions ...
// Restore: Object.assign(instance.exports, originals);
```

---

## Cheat Sheet — Patterns thường gặp

```bash
# Tìm flag pattern trong Wasm binary
strings target.wasm | grep -iE 'flag\{|CTF\{|WASM\{|ctf_'

# Decode hex string tìm được
python3 -c "print(bytes.fromhex('replace_hex'))"

# Decode base64
python3 -c "import base64; print(base64.b64decode('replace_base64'))"

# XOR với key 0x42
python3 -c "
ct = bytes.fromhex('replace_hex')
print(bytes(b ^ 0x42 for b in ct))
"

# Thử tất cả single-byte XOR keys
python3 -c "
ct = bytes.fromhex('replace_hex')
for k in range(256):
    dec = bytes(b ^ k for b in ct)
    try:
        s = dec.decode()
        if any(x in s.lower() for x in ['flag', 'ctf', 'wasm']):
            print(f'Key 0x{k:02x}: {s!r}')
    except: pass
"

# RC4 decrypt
python3 -c "
def rc4(key, data):
    S = list(range(256))
    j = 0
    for i in range(256):
        j = (j + S[i] + key[i % len(key)]) % 256
        S[i], S[j] = S[j], S[i]
    out, i, j = [], 0, 0
    for b in data:
        i = (i+1)%256; j=(j+S[i])%256; S[i],S[j]=S[j],S[i]
        out.append(b ^ S[(S[i]+S[j])%256])
    return bytes(out)
key = b'replace_key'
ct = bytes.fromhex('replace_ct')
print(rc4(key, ct))
"
```

---

## References

- Bài liên quan: [[16-ctf-walkthrough|16. CTF Walkthrough]], [[13-reverse-engineering-static|13. Static RE]]
- CTFtime Wasm writeups — https://ctftime.org (search "webassembly" hoặc "wasm")
- Wasm By Example — https://wasmbyexample.dev
