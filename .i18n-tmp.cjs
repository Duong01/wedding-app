// Tạm: chuyển chữ tiếng Việt cứng → $t(key) + ghi bản dịch vào src/lang/modules/<module>.js
// usage: node .i18n-tmp.cjs spec.cjs
// spec: module.exports = { module: "editor", files: [{ file, items: [[key, vi, en, zh, ko, ja, mode?], ...] }] }
//   mode (tuỳ chọn):
//     (mặc định) template: text node / attr tĩnh / chuỗi trong biểu thức; script: "vi" → t("key")
//     "msg"   : chỉ ghi bản dịch, KHÔNG thay trong file (tự sửa tay chỗ dùng)
//     "key"   : script: "vi" → "key" (giữ key, template tự $t(...))
//     "global": script: "vi" → t("key") với t import từ "@/lang" (ngoài setup / store)
const fs = require("fs");
const path = require("path");
const spec = require(path.resolve(process.argv[2]));
let failed = false;

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Cho phép xuống dòng / nhiều khoảng trắng giữa các từ trong mã nguồn
const flex = (s) => esc(s.trim()).replace(/\s+/g, "\\s+");
const qkey = (k) => `'${k}'`;

/* ---------- ghi module bản dịch ---------- */
const modFile = `src/lang/modules/${spec.module}.js`;
let table = {};
if (fs.existsSync(modFile)) {
  const src = fs.readFileSync(modFile, "utf8").replace(/^[\s\S]*?export default/, "module.exports =");
  const m = { exports: {} };
  new Function("module", src)(m);
  table = m.exports;
}

for (const f of spec.files) {
  for (const [key, vi, en, zh, ko, ja] of f.items) {
    if (table[key] && table[key][0] !== vi) { console.error(`KEY CLASH ${key}: "${table[key][0]}" vs "${vi}"`); failed = true; }
    table[key] = [vi, en, zh, ko, ja];
  }
}

const header = `/*
 * Bản dịch — ${spec.module}
 * Mỗi key: [vi, en, zh, ko, ja] (thứ tự LOCALE_CODES trong src/lang/index.js).
 */
export default `;
const body = "{\n" + Object.entries(table).map(([k, v]) => `  ${JSON.stringify(k)}: [\n${v.map((x) => "    " + JSON.stringify(x ?? "")).join(",\n")},\n  ],`).join("\n") + "\n};\n";
fs.writeFileSync(modFile, header + body);

/* ---------- thay chữ trong file ---------- */
for (const f of spec.files) {
  if (!f.file) continue;
  const raw = fs.readFileSync(f.file, "utf8");
  const crlf = raw.includes("\r\n");
  let s = raw.replace(/\r\n/g, "\n");
  const tStart = s.indexOf("<template>");
  const tEnd = s.lastIndexOf("</template>");
  let tpl = tStart >= 0 ? s.slice(tStart, tEnd) : "";
  let script = tStart >= 0 ? s.slice(tEnd) : s;
  const before = tStart >= 0 ? s.slice(0, tStart) : "";
  let usesT = false, usesGlobalT = false;

  /* Che comment (JS + HTML) để không thay nhầm chữ trong ghi chú — khôi phục sau */
  const masks = [];
  const mask = (m) => { masks.push(m); return `\u0000${masks.length - 1}\u0000`; };
  script = script.replace(/("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\/\*[\s\S]*?\*\/|\/\/[^\n]*)/g, (m, str, cmt) => (cmt ? mask(cmt) : m));
  tpl = tpl.replace(/<!--[\s\S]*?-->/g, mask);

  for (const [key, vi, , , , , mode] of f.items) {
    if (mode === "msg") continue;
    let hit = 0;
    const V = flex(vi);

    if (tpl && mode !== "key" && mode !== "global") {
      // 1) attr tĩnh: placeholder="vi" → :placeholder="$t('key')"
      tpl = tpl.replace(new RegExp(`(\\s)([a-zA-Z-]+)="${V}"`, "g"), (m, sp, attr) => {
        if (attr.startsWith(":") || attr.startsWith("v-") || ["class", "style", "value", "id", "name", "for", "list", "type"].includes(attr)) return m;
        hit++; return `${sp}:${attr}="$t(${qkey(key)})"`;
      });
      // 2) chuỗi trong biểu thức template: 'vi' hoặc "vi" (trong :attr="..." / {{ }})
      tpl = tpl.replace(new RegExp(`'${V}'`, "g"), () => { hit++; return `$t(${qkey(key)})`; });
      tpl = tpl.replace(new RegExp(`(\\{\\{[^}]*?)"${V}"`, "g"), (m, pre) => { hit++; return `${pre}$t(${qkey(key)})`; });
      // 3) text node: >  vi  <   (hoặc giữa }} / > và < / {{)
      tpl = tpl.replace(new RegExp(`(>|\\}\\})(\\s*)${V}(\\s*)(<|\\{\\{)`, "g"), (m, a, s1, s2, b) => {
        hit++; return `${a}${s1}{{ $t(${qkey(key)}) }}${s2}${b}`;
      });
    }

    {
      const isJs = f.file.endsWith(".js");
      const call = () => {
        if (mode === "global" || isJs) usesGlobalT = true; else usesT = true;
        return `t(${JSON.stringify(key)})`;
      };
      // Thuộc tính object  label: "vi"  → getter (đọc lại mỗi lần render → đổi ngôn ngữ là đổi theo)
      script = script.replace(new RegExp(`(^|[{,\\s])([A-Za-z_$][\\w$]*)\\s*:\\s*(["'\`])${V}\\3`, "gm"), (m, pre, prop) => {
        // mode "prop": chỉ đổi nhãn giao diện, giữ nguyên default (chữ mặc định trên thiệp)
        if (mode === "prop" && !["label", "description", "hint"].includes(prop)) return m;
        hit++;
        if (mode === "key") return `${pre}${prop}: ${JSON.stringify(key)}`;
        return `${pre}get ${prop}() { return ${call()}; }`;
      });
      // Chuỗi đứng riêng: "vi" | 'vi' | `vi` (không có ${}) — mode "prop" chỉ đổi thuộc tính label/description...
      if (mode === "prop") { if (!hit) { console.error(`MISSING prop ${f.file}: ${key}`); failed = true; } continue; }
      script = script.replace(new RegExp(`(["'\`])${V}\\1`, "g"), () => {
        hit++;
        if (mode === "key") return JSON.stringify(key);
        return call();
      });
    }

    if (!hit) { console.error(`MISSING ${f.file}: ${key} "${vi}"`); failed = true; }
  }

  const unmask = (x) => x.replace(/\u0000(\d+)\u0000/g, (m, i) => masks[+i]);
  s = before + unmask(tpl) + unmask(script);

  if (usesT && !/const \{[^}]*\bt\b[^}]*\} = useI18n\(\)/.test(s)) {
    s = s.replace(/<script setup>\n/, '<script setup>\nimport { useI18n } from "vue-i18n";\n');
    // khai báo t ngay sau khối import cuối
    const imports = [...s.matchAll(/^import [\s\S]*?;$/gm)].filter((m) => m.index > s.indexOf("<script setup>"));
    const last = imports.pop();
    const at = last.index + last[0].length;
    s = s.slice(0, at) + "\n\nconst { t } = useI18n();" + s.slice(at);
  }
  if (usesGlobalT && !/import \{[^}]*\bt\b[^}]*\} from "@\/lang"/.test(s)) {
    if (s.includes("<script setup>\n")) s = s.replace("<script setup>\n", '<script setup>\nimport { t } from "@/lang";\n');
    else s = 'import { t } from "@/lang";\n\n' + s;
  }

  fs.writeFileSync(f.file, crlf ? s.replace(/\n/g, "\r\n") : s);
  console.log("ok", f.file);
}
process.exit(failed ? 1 : 0);
