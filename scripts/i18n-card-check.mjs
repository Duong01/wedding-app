/*
 * Kiểm tra nhanh tầng i18n: đổi ngôn ngữ thiệp (setCardLocale)
 * thì $t("chuỗi tiếng Việt") trả đúng bản dịch, và
 * clearCardLocale() trả về ngôn ngữ giao diện.
 *
 * Chạy: node scripts/i18n-card-check.mjs
 */
import { createServer } from "vite";

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

const mod = await server.ssrLoadModule("/src/lang/index.js");

const { default: i18n, setCardLocale, clearCardLocale, LANGUAGES } = mod;

const SAMPLES = [
  "MỞ THIỆP",
  "GỬI XÁC NHẬN",
  "CHÚ RỂ",
  "CÔ DÂU",
  "SỔ LƯU BÚT",
  "Đếm ngược",
];

let fail = 0;

for (const lang of LANGUAGES) {
  setCardLocale(lang.code);

  const out = SAMPLES.map((k) => i18n.global.t(k));

  console.log(`\n[${lang.code}] ${lang.label}`);
  SAMPLES.forEach((k, i) => console.log(`  ${k} → ${out[i]}`));

  if (lang.code !== "vi") {
    const untranslated = SAMPLES.filter((k, i) => out[i] === k);
    if (untranslated.length) {
      console.log(`  !! chưa dịch: ${untranslated.join(" | ")}`);
      fail += 1;
    }
  }
}

clearCardLocale();

console.log(
  fail ? `\nFAIL — ${fail} ngôn ngữ còn chuỗi chưa dịch` : "\nOK — mọi ngôn ngữ đều dịch"
);

await server.close();
process.exit(fail ? 1 : 0);
