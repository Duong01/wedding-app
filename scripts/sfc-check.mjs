/*
 * Biên dịch từng file .vue bằng @vue/compiler-sfc để bắt lỗi
 * cú pháp SFC (template/script) mà không cần build cả app.
 *
 * Chạy: node scripts/sfc-check.mjs [đường-dẫn ...]
 * Không truyền tham số → quét toàn bộ src/.
 */
import fs from "node:fs";
import path from "node:path";
import { parse, compileScript, compileTemplate } from "@vue/compiler-sfc";

function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith(".vue")) acc.push(p);
  }
  return acc;
}

const targets = process.argv.slice(2).length ? process.argv.slice(2) : walk("src");

let bad = 0;

for (const file of targets) {
  const source = fs.readFileSync(file, "utf8");
  const id = path.basename(file);

  const { descriptor, errors } = parse(source, { filename: file });

  if (errors.length) {
    bad += 1;
    console.log(`FAIL ${file}`);
    errors.forEach((e) => console.log(`  parse: ${e.message}`));
    continue;
  }

  try {
    if (descriptor.script || descriptor.scriptSetup) {
      compileScript(descriptor, { id });
    }
  } catch (e) {
    bad += 1;
    console.log(`FAIL ${file}`);
    console.log(`  script: ${e.message.split("\n")[0]}`);
    continue;
  }

  if (descriptor.template) {
    const res = compileTemplate({
      source: descriptor.template.content,
      filename: file,
      id,
    });
    if (res.errors.length) {
      bad += 1;
      console.log(`FAIL ${file}`);
      res.errors.forEach((e) => console.log(`  template: ${e.message || e}`));
    }
  }
}

console.log(bad ? `\nFAIL — ${bad}/${targets.length} file lỗi` : `\nOK — ${targets.length} file biên dịch sạch`);
process.exit(bad ? 1 : 0);
