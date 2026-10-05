/*
 * Trong giá trị bind nháy kép (:attr="...") không được dùng
 * $t("...") vì dấu " sẽ đóng thuộc tính sớm. Đổi sang nháy đơn.
 *
 * Chạy: node scripts/i18n-fix-attr-quotes.mjs
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

/* Sửa 1 dòng, trả về dòng mới (hoặc null nếu không đổi) */
function fixLine(line) {
  let out = "";
  let i = 0;
  let changed = false;

  while (i < line.length) {
    /* tìm :attr=" */
    const m = /:[\w-]+="/.exec(line.slice(i));
    if (!m) { out += line.slice(i); break; }

    const attrOpen = i + m.index + m[0].length; // ngay sau dấu "
    out += line.slice(i, attrOpen);
    i = attrOpen;

    /* quét trong giá trị thuộc tính */
    while (i < line.length) {
      if (line[i] === '"') { out += '"'; i++; break; } // hết thuộc tính

      if (line.startsWith('$t("', i)) {
        const close = line.indexOf('"', i + 4);
        if (close !== -1 && line[close + 1] === ")") {
          out += "$t('" + line.slice(i + 4, close) + "')";
          i = close + 2;
          changed = true;
          n++;
          continue;
        }
      }

      out += line[i];
      i++;
    }
  }

  return changed ? out : null;
}

for (const file of files) {
  const orig = readFileSync(file, "utf8");
  const lines = orig.split("\n");
  let any = false;

  for (let i = 0; i < lines.length; i++) {
    const fixed = fixLine(lines[i]);
    if (fixed !== null) { lines[i] = fixed; any = true; }
  }

  if (any) {
    writeFileSync(file, lines.join("\n"), "utf8");
    touched++;
    console.log(`OK ${relative(ROOT, file).replace(/\\/g, "/")}`);
  }
}

console.log(`\n${n} chỗ đổi nháy  →  ${touched} file`);
