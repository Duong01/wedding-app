/*
 * Quét mọi chuỗi dịch (card + UI) tìm ký tự có thể làm
 * vue-i18n hiểu nhầm cú pháp message: @ { } | và $.
 *
 * Chạy: node scripts/i18n-syntax-scan.mjs
 */
import { createServer } from "vite";

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

const { default: i18n, LANGUAGES } = await server.ssrLoadModule("/src/lang/index.js");

const HAZARD = /[@{}|$]/;

let bad = 0;

for (const lang of LANGUAGES) {
  const msgs = i18n.global.getLocaleMessage(lang.code);

  const walk = (obj, prefix = "") => {
    for (const [k, v] of Object.entries(obj)) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === "object") {
        walk(v, key);
        continue;
      }
      if (typeof v !== "string") continue;
      if (!HAZARD.test(v)) continue;

      let ok = true;
      try {
        i18n.global.t(key, lang.code);
      } catch {
        ok = false;
      }
      if (!ok) {
        bad += 1;
        console.log(`[${lang.code}] ${key} → ${JSON.stringify(v)}`);
      }
    }
  };

  walk(msgs);
}

await server.close();
console.log(bad ? `\nFAIL — ${bad} chuỗi lỗi cú pháp` : "\nOK — không chuỗi nào lỗi cú pháp");
process.exit(bad ? 1 : 0);
