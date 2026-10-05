import fs from "fs";
import path from "path";
import { execSync } from "child_process";

function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(vue|js)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

const files = walk("src");
const re = /\$t\(\s*(['"])((?:(?!\1).)+)\1/g;
const used = new Set();
for (const f of files) {
  const s = fs.readFileSync(f, "utf8");
  let m;
  while ((m = re.exec(s))) used.add(m[2]);
}

const dotted = [...used].filter((k) => /^[a-z][a-zA-Z0-9]*\./.test(k));

// keys available in HEAD modules
const mods = [
  "account", "common", "editor", "home", "intro",
  "landing", "panels", "payment", "site", "templates",
];
const available = new Set();
for (const m of mods) {
  let src = "";
  try {
    src = execSync(`git show HEAD:src/lang/modules/${m}.js`, { encoding: "utf8" });
  } catch { continue; }
  const re2 = /^\s*"([^"]+)"\s*:/gm;
  let mm;
  while ((mm = re2.exec(src))) available.add(mm[1]);
}
// google.js (untracked, current)
const g = fs.readFileSync("src/lang/modules/google.js", "utf8");
let gm;
const re3 = /^\s*"([^"]+)"\s*:/gm;
while ((gm = re3.exec(g))) available.add(gm[1]);

const missing = dotted.filter((k) => !available.has(k));
console.log("dotted keys used:", dotted.length);
console.log("available in HEAD modules + google:", available.size);
console.log("MISSING dotted keys:", missing.length);
console.log(missing.join("\n"));
