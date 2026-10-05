import fs from "fs";
import path from "path";

function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(vue|js)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

const files = [
  ...walk("src/page"),
  ...walk("src/components/common"),
  ...walk("src/components/gallery"),
];

const re = /\$t\(\s*(['"])((?:(?!\1).)+)\1/g;
const used = new Set();
for (const f of files) {
  const s = fs.readFileSync(f, "utf8");
  let m;
  while ((m = re.exec(s))) used.add(m[2]);
}

const en = fs.readFileSync("src/lang/en_US.js", "utf8");
const tr = new Set();
const re2 = /^\s*'((?:[^'\\]|\\.)*)'\s*:/gm;
let m2;
while ((m2 = re2.exec(en))) tr.add(m2[1].replace(/\\'/g, "'"));

const missing = [...used].filter((k) => !tr.has(k) && !/^[a-z]+\./.test(k));
console.log("used total:", used.size);
console.log("translated:", tr.size);
console.log("missing (non-dotted):", missing.length);
fs.writeFileSync("scripts/card-missing.json", JSON.stringify(missing, null, 1));
console.log("→ scripts/card-missing.json");
