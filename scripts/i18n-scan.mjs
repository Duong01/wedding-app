/*
 * Quét các dạng hỏng do codemod i18n để lại (không sửa, chỉ báo):
 *  A. import chèn vào giữa câu import nhiều dòng
 *  B. bind :attr="$t('...')  thiếu " đóng
 *  C. $t("...") chứa xuống dòng thật
 *  D. $t( chưa đóng ngoặc
 *
 * Chạy: node scripts/i18n-scan.mjs
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

const counts = { A: 0, B: 0, C: 0, D: 0 };
const samples = { A: [], B: [], C: [], D: [] };

for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  const lines = readFileSync(file, "utf8").split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    /* A — import chèn giữa câu import nhiều dòng */
    if (/^\s*import \{ t(, localeTag)? \} from "@\/lang";\s*$/.test(line)) {
      const prev = lines[i - 1] || "";
      if (/import\s*\{\s*$/.test(prev)) {
        counts.A++;
        if (samples.A.length < 5) samples.A.push(`${rel}:${i + 1}  prev=${JSON.stringify(prev)}`);
      }
    }

    /* B — :attr="$t('...')  thiếu " đóng (theo sau là space + chữ) */
    const b = line.match(/:[\w-]+="\$t\('[^']*'\)(\s+[^\s"'>/])/);
    if (b) {
      counts.B++;
      if (samples.B.length < 5) samples.B.push(`${rel}:${i + 1}  ${line.trim().slice(0, 120)}`);
    }

    /* C — $t("...") chứa xuống dòng thật (dòng kết thúc giữa chuỗi) */
    if (/\$t\("[^"]*$/.test(line) && !/\)\s*\}\}/.test(line)) {
      counts.C++;
      if (samples.C.length < 5) samples.C.push(`${rel}:${i + 1}  ${line.trim().slice(0, 120)}`);
    }

    /* D — $t( chưa đóng ngoặc trên dòng */
    const opens = (line.match(/\$t\(/g) || []).length;
    if (opens) {
      const seg = line.slice(line.indexOf("$t("));
      const o = (seg.match(/\(/g) || []).length;
      const c = (seg.match(/\)/g) || []).length;
      if (o > c) {
        counts.D++;
        if (samples.D.length < 5) samples.D.push(`${rel}:${i + 1}  ${line.trim().slice(0, 120)}`);
      }
    }
  }
}

for (const k of ["A", "B", "C", "D"]) {
  console.log(`\n=== ${k}: ${counts[k]} ===`);
  for (const s of samples[k]) console.log("  " + s);
}
