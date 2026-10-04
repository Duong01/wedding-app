// Tạm: liệt kê chuỗi tiếng Việt trong file (template text/attr + chuỗi script), bỏ comment.
const fs = require("fs");
const VI = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
for (const file of process.argv.slice(2)) {
  let s = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  s = s.replace(/<style[\s\S]*?<\/style>/g, (m) => m.replace(/[^\n]/g, " "));
  // bỏ comment HTML / JS (giữ số dòng)
  s = s.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "));
  s = s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
  s = s.replace(/(^|[^:"'`])\/\/[^\n]*/g, (m, p) => p + m.slice(p.length).replace(/./g, " "));
  const out = new Set();
  const add = (t) => { t = t.replace(/\s+/g, " ").trim(); if (t && VI.test(t)) out.add(t); };
  // text nodes
  for (const m of s.matchAll(/>([^<>]+)</g)) m[1].split(/\{\{[\s\S]*?\}\}/).forEach(add);
  // chuỗi trong nháy
  for (const m of s.matchAll(/"([^"\n]*)"|'([^'\n]*)'|`([^`]*)`/g)) add(m[1] ?? m[2] ?? m[3]);
  console.log(`### ${file} (${out.size})`);
  [...out].forEach((t) => console.log("  " + t));
}
