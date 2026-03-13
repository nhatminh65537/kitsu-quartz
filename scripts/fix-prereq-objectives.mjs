import fs from "node:fs";
import path from "node:path";

const root = path.resolve("content");

const targetKeys = [
  "Prerequisites",
  "Objectives",
  "Topic",
  "Domain",
  "Level",
  "Background",
  "Tools / Code",
  "Context",
  "Sources",
];

function startsWithTargetKey(line) {
  for (const key of targetKeys) {
    if (line.startsWith(`> **${key}**:`)) {
      return true;
    }
  }
  return false;
}

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      out.push(full);
    }
  }
}

function rtrimSpaces(s) {
  let i = s.length;
  while (i > 0) {
    const ch = s[i - 1];
    if (ch === " " || ch === "\t") {
      i -= 1;
    } else {
      break;
    }
  }
  return s.slice(0, i);
}

const files = [];
walk(root, files);

let changedFiles = 0;
let touchedLines = 0;

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");

  let bom = "";
  let text = raw;
  if (text.startsWith("\uFEFF")) {
    bom = "\uFEFF";
    text = text.slice(1);
  }

  const useCRLF = text.includes("\r\n");
  const srcLines = text.split("\n");
  const outLines = [];
  let changed = false;

  for (const srcLine of srcLines) {
    let line = srcLine;
    if (line.endsWith("\r")) {
      line = line.slice(0, -1);
    }

    if (line.startsWith("> **Prerequisites**:")) {
      const marker = " **Objectives**:";
      const idx = line.indexOf(marker);

      if (idx !== -1) {
        const left = rtrimSpaces(line.slice(0, idx)) + "  ";
        const right = "> **Objectives**:  ";
        outLines.push(left);
        outLines.push(right);
        changed = true;
        touchedLines += 2;
      } else {
        const fixed = rtrimSpaces(line) + "  ";
        outLines.push(fixed);
        if (fixed !== line) {
          changed = true;
          touchedLines += 1;
        }
      }
      continue;
    }

    if (startsWithTargetKey(line)) {
      const fixed = rtrimSpaces(line) + "  ";
      outLines.push(fixed);
      if (fixed !== line) {
        changed = true;
        touchedLines += 1;
      }
      continue;
    }

    outLines.push(line);
  }

  const eol = useCRLF ? "\r\n" : "\n";
  const next = bom + outLines.join(eol);

  if (next !== raw) {
    fs.writeFileSync(file, next, "utf8");
    changedFiles += 1;
  }
}

console.log(JSON.stringify({ changedFiles, touchedLines }, null, 2));
