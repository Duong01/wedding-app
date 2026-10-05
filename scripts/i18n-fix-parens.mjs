/*
 * Vá bind hỏng dạng :alt="$t('...')  (thiếu " đóng) —
 * codemod đợt 1 cắt giá trị giữa chừng khi chuỗi chứa ký
 * tự đặc biệt. Quét từng dòng template, tìm dòng có :attr=
 * mở " nhưng $t( chưa đóng trước khi dòng kết thúc.
 *
 * Chạy: node scripts/i18n-fix-parens.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
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
];

let n = 0;

for (const file of files) {
  let src = readFileSync(file, "utf8");
  const orig = src;

  const lines = src.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    /*
     * :alt="$t('...') class="..." — $t đã đóng paren nhưng
     * thiếu " đóng giá trị bind (thuộc tính kế tiếp dính vào).
     * :alt="$t('...' class="..." — $t chưa đóng paren lẫn ".
     */
    const m = line.match(/(:[\w-]+)="(\$t\('[^']*'?)(\s+\w[\w-]*=)/);

    if (m) {
      let expr = m[2];

      /* Đóng paren nếu chưa */
      const opens = (expr.match(/\(/g) || []).length;
      const closes = (expr.match(/\)/g) || []).length;

      if (opens > closes) expr += ")".repeat(opens - closes);

      lines[i] = line.replace(m[0], `${m[1]}="${expr}"${m[3]}`);
    }
  }

  src = lines.join("\n");

  if (src !== orig) {
    writeFileSync(file, src, "utf8");
    n++;
    console.log(`OK ${relative(ROOT, file).replace(/\\/g, "/")}`);
  }
}

console.log(`\nĐã sửa ${n} file`);
