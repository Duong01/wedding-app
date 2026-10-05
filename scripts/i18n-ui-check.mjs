/*
 * Kiểm tra tầng i18n giao diện (website + editor): mọi key
 * dạng "a.b.c" dùng trong $t() phải có bản dịch ở cả 5 ngôn ngữ.
 *
 * Chạy: node scripts/i18n-ui-check.mjs
 */
import { createServer } from "vite";
import fs from "node:fs";
import path from "node:path";

function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(vue|js)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

const used = new Set();
const re = /\$t\(\s*(['"])((?:(?!\1).)+)\1/g;
for (const f of walk("src")) {
  const s = fs.readFileSync(f, "utf8");
  let m;
  while ((m = re.exec(s))) {
    if (/^[a-z][a-zA-Z0-9]*\./.test(m[2])) used.add(m[2]);
  }
}

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

const { default: i18n, LANGUAGES } = await server.ssrLoadModule("/src/lang/index.js");

let fail = 0;

for (const lang of LANGUAGES) {
  const missing = [];
  const broken = [];
  for (const key of used) {
    let val;
    try {
      val = i18n.global.t(key, lang.code);
    } catch (e) {
      broken.push(`${key} (${e.message.split("\n")[0]})`);
      continue;
    }
    if (val === key) missing.push(key);
  }
  console.log(`[${lang.code}] ${lang.label}: ${used.size - missing.length - broken.length}/${used.size} key có bản dịch`);
  if (missing.length) {
    fail += 1;
    console.log(`  thiếu: ${missing.slice(0, 20).join(", ")}${missing.length > 20 ? " …" : ""}`);
  }
  if (broken.length) {
    fail += 1;
    console.log(`  lỗi cú pháp message: ${broken.join(" | ")}`);
  }
}

await server.close();
console.log(fail ? `\nFAIL — ${fail} ngôn ngữ thiếu key` : "\nOK — đủ key giao diện");
process.exit(fail ? 1 : 0);
