/*
 * Thu thập mọi key $t()/t() trong trang thiệp (src/page,
 * src/components/common, src/components/gallery, src/themes,
 * src/views/WeddingApi.vue) — xuất danh sách key tiếng Việt
 * duy nhất để tạo/soát file dịch en_US.js, zh_CN.js, ko_KR.js,
 * ja_JP.js.
 *
 * Chạy: node scripts/i18n-collect-keys.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

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
  ...walk(join(ROOT, "src/components/common")).filter(
    (f) => !/(LanguageSwitcher|SiteFooter|Loading|ScrollTop)\.vue$/.test(f)
  ),
  ...walk(join(ROOT, "src/components/gallery")),
  ...walk(join(ROOT, "src/themes")),
  join(ROOT, "src/views/WeddingApi.vue"),
];

const keys = new Set();

for (const file of files) {
  const src = readFileSync(file, "utf8");

  // $t("...") / t("...") — literal key
  for (const m of src.matchAll(/\$?\bt\(\s*(['"])((?:\\.|(?!\1).)*)\1\s*[),]/g)) {
    keys.add(m[2].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\'/g, "'"));
  }

  // $t(label) / t(WEEKDAYS[...]) — dynamic: đánh dấu riêng
}

/* Key động (mảng const) — tra tay */
const DYNAMIC = {
  WEEKDAYS: ["CHỦ NHẬT", "THỨ HAI", "THỨ BA", "THỨ TƯ", "THỨ NĂM", "THỨ SÁU", "THỨ BẢY"],
  HERO_WEEKDAYS: ["CHỦ NHẬT", "THỨ HAI", "THỨ BA", "THỨ TƯ", "THỨ NĂM", "THỨ SÁU", "THỨ BẢY"],
  WEEK_LABELS: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
};

for (const arr of Object.values(DYNAMIC)) {
  for (const k of arr) keys.add(k);
}

const sorted = [...keys].filter(Boolean).sort((a, b) => a.localeCompare(b, "vi"));

writeFileSync(
  join(ROOT, "scripts", "card-keys.json"),
  JSON.stringify(sorted, null, 2),
  "utf8"
);

console.log(`Tổng ${sorted.length} key`);
console.log("→ scripts/card-keys.json");
