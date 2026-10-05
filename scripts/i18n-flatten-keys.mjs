/*
 * Gộp ký tự xuống dòng (\n thật hoặc escape) bên trong key
 * $t("...") thành một dòng — key dịch trong en_US.js/zh_CN.js...
 * là chuỗi một dòng, nếu không gộp thì tra không khớp.
 *
 * Chạy: node scripts/i18n-flatten-keys.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

function walk(dir) {
  const out = [];
  let names;
  try { names = readdirSync(dir); } catch { return out; }
  for (const name of names) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (name.endsWith(".vue")) out.push(full);
  }
  return out;
}

const files = [
  ...walk(join(ROOT, "src/page")),
  ...walk(join(ROOT, "src/components")),
  ...walk(join(ROOT, "src/themes")),
  ...walk(join(ROOT, "src/views")),
  ...walk(join(ROOT, "src/layouts")),
];

let n = 0, touched = 0;

for (const file of files) {
  const orig = readFileSync(file, "utf8");

  const src = orig.replace(/\$t\((["'])((?:\\.|(?!\1).)*?)\1\)/g, (full, q, body) => {
    if (!/\\n/.test(body)) return full;
    n++;
    const flat = body.replace(/\\n\s*/g, " ").replace(/\s+/g, " ").trim();
    return `$t(${q}${flat}${q})`;
  });

  if (src !== orig) {
    writeFileSync(file, src, "utf8");
    touched++;
    console.log(`OK ${relative(ROOT, file).replace(/\\/g, "/")}`);
  }
}

console.log(`\n${n} key gộp  →  ${touched} file`);
