/*
 * Vá các dạng hỏng do codemod i18n để lại:
 *
 *  A. `import { t } from "@/lang";` bị chèn vào giữa một câu
 *     import nhiều dòng  →  dời lên trước câu import đó.
 *  B. `:attr="$t('...')` thiếu `"` đóng  →  thêm `"` ngay sau `)`.
 *  C. `$t("...")` chứa xuống dòng thật  →  gộp thành một dòng
 *     (HTML vốn cũng gộp khoảng trắng khi render).
 *
 * Chạy: node scripts/i18n-fix-damage.mjs
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

const LANG_IMPORT = /^import \{ t(?:, localeTag)? \} from "@\/lang";\r?$/;

let nA = 0, nB = 0, nC = 0, touched = 0;

for (const file of files) {
  const orig = readFileSync(file, "utf8");
  let src = orig;

  /* ---------- C: gộp $t("...") nhiều dòng ---------- */
  src = src.replace(/\$t\((["'])([\s\S]*?)\1\)/g, (full, q, body) => {
    if (!/[\r\n]/.test(body)) return full;
    nC++;
    const flat = body.replace(/\s*[\r\n]+\s*/g, " ").trim();
    return `$t(${q}${flat}${q})`;
  });

  /* ---------- B: thêm " đóng cho bind :attr="$t('...') ---------- */
  src = src.replace(/(:[\w-]+="\$t\('[^']*'\))(?!")/g, (full, head) => {
    nB++;
    return `${head}"`;
  });

  /* ---------- A: dời import @/lang ra khỏi câu import nhiều dòng ---------- */
  const lines = src.split("\n");
  const out = [];
  let pendingLang = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (LANG_IMPORT.test(line) && /^import \{\s*$/.test((lines[i - 1] || "").trim())) {
      nA++;
      pendingLang = line;
      continue; // bỏ dòng đặt sai chỗ
    }

    if (pendingLang && /^import \{\s*$/.test(line.trim())) {
      out.push(pendingLang);
      pendingLang = null;
    }

    out.push(line);
  }

  if (pendingLang) out.push(pendingLang);

  src = out.join("\n");

  if (src !== orig) {
    writeFileSync(file, src, "utf8");
    touched++;
    console.log(`OK ${relative(ROOT, file).replace(/\\/g, "/")}`);
  }
}

console.log(`\nA=${nA}  B=${nB}  C=${nC}  →  ${touched} file đã sửa`);
