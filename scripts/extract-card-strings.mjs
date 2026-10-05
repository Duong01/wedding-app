/*
 * Trích xuất mọi chuỗi tiếng Việt cố định trong trang khách xem
 * (src/page, src/components/common, src/components/gallery,
 * src/views/WeddingApi.vue) để lập bảng dịch card.js.
 *
 * Chạy: node scripts/extract-card-strings.mjs
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname
  .replace(/^\/([A-Za-z]:)/, "$1");

const TARGETS = [
  join(ROOT, "src/page"),
  join(ROOT, "src/components/common"),
  join(ROOT, "src/components/gallery"),
];

const EXTRA_FILES = [join(ROOT, "src/views/WeddingApi.vue")];

const VN_CHAR =
  /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/;

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(vue|js)$/.test(name)) out.push(full);
  }
  return out;
}

const files = [
  ...TARGETS.flatMap((dir) => walk(dir)),
  ...EXTRA_FILES,
];

/*
 * Bỏ phần <style> và comment HTML để không trích nhầm
 * chuỗi trong CSS / ghi chú.
 */
function stripNoise(source) {
  return source
    .replace(/<style[\s\S]*?<\/style>/g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
}

const found = new Map(); // chuỗi -> [{ file, line, context }]

function record(text, file, line, context) {
  if (!VN_CHAR.test(text)) return;
  if (!found.has(text)) found.set(text, []);
  found.get(text).push({ file, line, context: context.trim().slice(0, 120) });
}

for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  const raw = readFileSync(file, "utf8");
  const lines = stripNoise(raw).split("\n");

  lines.forEach((text, i) => {
    // "chuỗi kép"
    for (const m of text.matchAll(/"([^"\n]*)"/g)) {
      record(m[1], rel, i + 1, text);
    }
    // 'chuỗi đơn'
    for (const m of text.matchAll(/'([^'\n]*)'/g)) {
      record(m[1], rel, i + 1, text);
    }
    // `template literal` (chỉ lấy phần tĩnh đầu)
    for (const m of text.matchAll(/`([^`\\$\n]*)/g)) {
      record(m[1], rel, i + 1, text);
    }
    // {{ nội dung interpolation có chữ VN }}
    for (const m of text.matchAll(/\{\{([^}]*)\}\}/g)) {
      if (VN_CHAR.test(m[1])) record(m[1].trim(), rel, i + 1, text);
    }
    // text node thuần giữa tag
    for (const m of text.matchAll(/>([^<>{}\n]*[^\s<][^<>{}\n]*)</g)) {
      if (VN_CHAR.test(m[1])) record(m[1].trim(), rel, i + 1, text);
    }
  });
}

const sorted = [...found.entries()].sort(
  (a, b) => b[1].length - a[1].length
);

const report = sorted
  .map(([text, hits]) => {
    const samples = hits.slice(0, 2).map((h) => `    ${h.file}:${h.line} · ${h.context}`);
    return `### ${hits.length}× ${JSON.stringify(text)}\n${samples.join("\n")}`;
  })
  .join("\n\n");

writeFileSync(
  join(ROOT, "scripts", "card-strings-report.txt"),
  `Tổng: ${sorted.length} chuỗi khác nhau\n\n${report}\n`,
  "utf8"
);

console.log(`Tổng ${sorted.length} chuỗi · ${files.length} file`);
console.log("→ scripts/card-strings-report.txt");
