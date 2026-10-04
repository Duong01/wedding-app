// Tạm: thay thế thủ công (CRLF-safe). usage: node .man-tmp.cjs edits.cjs — edits: [[file, old, new], ...]
const fs = require("fs");
const path = require("path");
const edits = require(path.resolve(process.argv[2]));
let failed = false;
const byFile = {};
for (const [f, a, b] of edits) (byFile[f] = byFile[f] || []).push([a, b]);
for (const [f, pairs] of Object.entries(byFile)) {
  const raw = fs.readFileSync(f, "utf8");
  const crlf = raw.includes("\r\n");
  let s = raw.replace(/\r\n/g, "\n");
  for (const [a, b] of pairs) {
    if (!s.includes(a)) { console.error("MISSING", f, JSON.stringify(a.slice(0, 80))); failed = true; continue; }
    s = s.split(a).join(b);
  }
  fs.writeFileSync(f, crlf ? s.replace(/\n/g, "\r\n") : s);
  console.log("ok", f);
}
process.exit(failed ? 1 : 0);
