/*
 * Quét mọi file .vue/.js dùng các export của @/lang (t, localeTag,
 * setCardLocale, clearCardLocale, cardIntlTag, useCardLocale,
 * LANGUAGES, currentLocale, setLocale) mà KHÔNG import — lỗi
 * "X is not defined" lúc chạy mà build không bắt được.
 *
 * Chạy: node scripts/i18n-missing-imports.mjs
 */
import fs from "node:fs";
import path from "node:path";

const EXPORTS = [
  "t",
  "localeTag",
  "setCardLocale",
  "clearCardLocale",
  "isCardLocaleActive",
  "cardIntlTag",
  "useCardLocale",
  "LANGUAGES",
  "currentLocale",
  "setLocale",
];

function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(vue|js)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

let bad = 0;

for (const file of walk("src")) {
  const src = fs.readFileSync(file, "utf8");

  /* Chỉ xét phần <script> của .vue */
  let code = src;
  if (file.endsWith(".vue")) {
    const m = src.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    code = m ? m[1] : "";
  }

  /* Bỏ chú thích để không bắt nhầm tên hàm trong văn xuôi */
  code = code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");

  const imported = new Set();
  const importRe = /import\s*\{([^}]+)\}\s*from\s*["']@\/lang["']/g;
  let im;
  while ((im = importRe.exec(code))) {
    im[1].split(",").forEach((s) => {
      const name = s.trim().split(/\s+as\s+/)[0].trim();
      if (name) imported.add(name);
    });
  }

  const missing = [];
  for (const name of EXPORTS) {
    /* Bỏ qua tên đã có sẵn trong file: khai báo, destructure, tham số */
    const declared = new RegExp(
      [
        `(?:const|let|var)\\s+${name}\\b`,
        `(?:const|let|var)\\s*\\{[^}]*\\b${name}\\b[^}]*\\}`,
        `function\\s+${name}\\b`,
        `\\b${name}\\s*[:=]\\s*(?:function|\\()`,
        `\\(\\s*[^)]*\\b${name}\\b[^)]*\\)\\s*=>`,
      ].join("|")
    ).test(code);
    if (declared) continue;

    const used = new RegExp(`(^|[^\\w.$'"])${name}\\s*\\(`).test(code);
    if (used && !imported.has(name)) missing.push(name);
  }

  if (missing.length) {
    bad += 1;
    console.log(`${file}: thiếu import ${missing.join(", ")}`);
  }
}

console.log(bad ? `\nFAIL — ${bad} file thiếu import` : "\nOK — không file nào thiếu import @/lang");
process.exit(bad ? 1 : 0);
