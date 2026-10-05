/*
 * Sửa 7 file bị script bulk-patch chèn `import { t } from "@/lang";`
 * ra SAU thẻ </style> — ngoài mọi block SFC nên bị bỏ qua, khiến
 * `t` undefined lúc chạy.
 *
 * Việc làm: bỏ dòng import ở cuối file, chèn lại ngay sau
 * thẻ <script setup>.
 *
 * Chạy: node scripts/i18n-fix-stray-import.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILES = [
  "src/page/EmeraldLuxe/WeddingHero.vue",
  "src/page/SongHacRed/Timeline.vue",
  "src/page/SongHacRed/WeddingEvents.vue",
  "src/page/ToDuyenXanh/Timeline.vue",
  "src/page/ToDuyenXanh/WeddingEvents.vue",
  "src/page/ToDuyenXanh/WeddingFooter.vue",
  "src/page/ToDuyenXanh/WeddingHero.vue",
  "src/page/EmeraldLuxe/WeddingFooter.vue",
  "src/page/SongHacRed/WeddingCouple.vue",
  "src/page/ToDuyenXanh/WeddingCouple.vue",
  "src/page/ToDuyenXanh/WeddingWishes.vue",
];

const IMPORT_RE = /^import\s*\{[^}]*\}\s*from\s*"@\/lang";$/;

for (const file of FILES) {
  let src = readFileSync(file, "utf8");

  const lines = src.split(/\r?\n/);

  /* Bỏ mọi dòng import @/lang nằm sau </style> cuối cùng */
  const lastStyle = lines.map((l, i) => (l.trim() === "</style>" ? i : -1)).filter((i) => i >= 0).pop();

  if (lastStyle === undefined) {
    console.log(`SKIP ${file} — không thấy </style>`);
    continue;
  }

  const stray = lines.filter((l, i) => i > lastStyle && IMPORT_RE.test(l.trim()));

  if (!stray.length) {
    console.log(`SKIP ${file} — không có import lạc`);
    continue;
  }

  const kept = lines.filter((l, i) => !(i > lastStyle && IMPORT_RE.test(l.trim())));

  /* Chèn lại ngay sau <script setup> */
  const scriptIdx = kept.findIndex((l) => l.trim() === "<script setup>");

  if (scriptIdx < 0) {
    console.log(`SKIP ${file} — không thấy <script setup>`);
    continue;
  }

  if (kept.some((l, i) => i > scriptIdx && IMPORT_RE.test(l.trim()))) {
    console.log(`SKIP ${file} — import đã nằm trong script`);
    continue;
  }

  kept.splice(scriptIdx + 1, 0, ...stray);

  writeFileSync(file, kept.join("\n"), "utf8");
  console.log(`OK ${file} — chuyển ${stray.length} import vào script`);
}
