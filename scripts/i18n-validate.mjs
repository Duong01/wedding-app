/*
 * Kiểm tra cú pháp từng file .vue bằng @vue/compiler-sfc —
 * nhanh hơn npm run build rất nhiều, chỉ ra đúng file + dòng
 * hỏng do codemod i18n để lại.
 *
 * Chạy: node scripts/i18n-validate.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { parse, compileTemplate, compileScript } from "vue/compiler-sfc";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

function walk(dir) {
  const out = [];
  let names;
  try {
    names = readdirSync(dir);
  } catch {
    return out;
  }
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

const bad = [];

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const rel = relative(ROOT, file).replace(/\\/g, "/");

  let descriptor;
  try {
    const res = parse(src, { filename: file });
    if (res.errors && res.errors.length) {
      bad.push({ rel, where: "sfc", msg: String(res.errors[0].message || res.errors[0]) });
      continue;
    }
    descriptor = res.descriptor;
  } catch (e) {
    bad.push({ rel, where: "sfc", msg: e.message });
    continue;
  }

  if (descriptor.template) {
    try {
      const r = compileTemplate({
        source: descriptor.template.content,
        filename: file,
        id: rel,
      });
      if (r.errors && r.errors.length) {
        const e = r.errors[0];
        bad.push({
          rel,
          where: "template",
          msg: typeof e === "string" ? e : e.message,
          line: e.loc ? e.loc.start.line : null,
        });
      }
    } catch (e) {
      bad.push({ rel, where: "template", msg: e.message });
    }
  }

  if (descriptor.scriptSetup || descriptor.script) {
    try {
      compileScript(descriptor, { id: rel });
    } catch (e) {
      bad.push({ rel, where: "script", msg: e.message });
    }
  }
}

if (!bad.length) {
  console.log(`Sạch — ${files.length} file không lỗi cú pháp.`);
} else {
  for (const b of bad) {
    console.log(`${b.rel} [${b.where}]${b.line ? `:${b.line}` : ""} — ${b.msg}`);
  }
  console.log(`\n${bad.length} file lỗi / ${files.length} file.`);
}
