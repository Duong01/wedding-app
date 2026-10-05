/*
 * Quét mọi file .vue có câu lệnh import nằm SAU thẻ </style>
 * cuối cùng — dấu hiệu script bulk-patch chèn sai chỗ, khiến
 * import bị bỏ qua và biến undefined lúc chạy.
 *
 * Chạy: node scripts/i18n-stray-import-scan.mjs
 */
import fs from "node:fs";
import path from "node:path";

function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith(".vue")) acc.push(p);
  }
  return acc;
}

let bad = 0;

for (const file of walk("src")) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

  const lastStyle = lines
    .map((l, i) => (l.trim() === "</style>" ? i : -1))
    .filter((i) => i >= 0)
    .pop();

  if (lastStyle === undefined) continue;

  const stray = lines
    .map((l, i) => ({ l: l.trim(), i }))
    .filter(({ l, i }) => i > lastStyle && /^import\s/.test(l));

  if (stray.length) {
    bad += 1;
    console.log(`${file}:`);
    stray.forEach(({ l, i }) => console.log(`  dòng ${i + 1}: ${l}`));
  }
}

console.log(bad ? `\nFAIL — ${bad} file có import sau </style>` : "\nOK — không import nào nằm ngoài block");
process.exit(bad ? 1 : 0);
