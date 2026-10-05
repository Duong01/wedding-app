/*
 * Liệt kê đầy đủ các bind :attr="$t('...')  bị thiếu " đóng.
 * Chạy: node scripts/i18n-scan-b.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
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

let n = 0;
const tails = new Map();

for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  const lines = readFileSync(file, "utf8").split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const re = /:[\w-]+="\$t\('[^']*'\)/g;
    let m;
    while ((m = re.exec(line))) {
      const after = line.slice(m.index + m[0].length);
      if (after.startsWith('"')) continue; // lành
      n++;
      const tail = after.slice(0, 24);
      const key = tail.replace(/[\wÀ-ỹ]+/g, "W").slice(0, 12);
      tails.set(key, (tails.get(key) || 0) + 1);
      if (n <= 80) console.log(`${rel}:${i + 1}  …${JSON.stringify(after.slice(0, 60))}`);
    }
  }
}

console.log(`\nTổng ${n} bind hỏng.`);
console.log("\nĐuôi gặp phải:");
for (const [k, v] of [...tails].sort((a, b) => b[1] - a[1])) console.log(`  ${v}×  ${JSON.stringify(k)}`);
