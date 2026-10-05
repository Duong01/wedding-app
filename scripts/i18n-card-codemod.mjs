/*
 * CODEMOD v2 — DỌN ĐỢT 1 + CHUYỂN SANG $t()
 *
 * Đợt 1 (ctv/useCardLocale) chạy nhiều lần để lại:
 *   - ctv(ctv(ctv(...))) lồng nhau
 *   - import / hook useCardLocale trùng lặp
 *   - provideCardLocale (không tồn tại) trong 26 theme root
 *
 * Kiến trúc mới theo yêu cầu:
 *   - Template:  $t("Chuỗi tiếng Việt gốc")
 *   - Script:    t("Chuỗi tiếng Việt gốc")  (import { t } from "@/lang")
 *   - Từ điển:   src/lang/en_US.js, zh_CN.js, ko_KR.js, ja_JP.js
 *                (key = chuỗi tiếng Việt, đúng dạng mẫu user copy)
 *   - Ngôn ngữ thiệp: trang khách xem setCardLocale(wedding.language)
 *
 * Chạy: node scripts/i18n-card-codemod.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

/* ---------- Mục tiêu (giống đợt 1) ---------- */

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (name.endsWith(".vue")) out.push(full);
  }
  return out;
}

const GUEST_COMMON = [
  "AutoScroll",
  "CoupleQuiz",
  "EventMap",
  "FloatingMusic",
  "GameSection",
  "LuckyWheel",
  "MemoryMatch",
  "PrizeClaim",
  "ScratchCard",
  "StoryMilestones",
  "VideoEmbed",
  "VideoSection",
].map((n) => join(ROOT, "src/components/common", `${n}.vue`));

const files = [
  ...walk(join(ROOT, "src/page")),
  ...walk(join(ROOT, "src/components/gallery")),
  ...GUEST_COMMON,
  ...walk(join(ROOT, "src/themes")),
  join(ROOT, "src/views/WeddingApi.vue"),
];

/* ---------- Collapse ctv(ctv(...)) / ct(ct(...)) ---------- */

function collapseNested(src, fn) {
  const tok = `${fn}(${fn}(`;
  for (;;) {
    const idx = src.indexOf(tok);
    if (idx < 0) break;

    let depth = 1;
    let i = idx + tok.length;
    let close = -1;

    while (i < src.length) {
      const ch = src[i];
      if (ch === "(") depth++;
      else if (ch === ")") {
        depth--;
        if (depth === 0) {
          close = i;
          break;
        }
      }
      i++;
    }

    if (close < 0 || src[close + 1] !== ")") break;

    const inner = src.slice(idx + tok.length, close);
    src = src.slice(0, idx) + fn + "(" + inner + ")" + src.slice(close + 2);
  }
  return src;
}

/* ---------- Hero weekday — 14 file cùng 1 dòng ---------- */

const HERO_RE =
  /^([ \t]*)return `\$\{date\.day\(\) === 0 \? "CHỦ NHẬT" : `THỨ \$\{date\.day\(\) \+ 1\}`\}, NGÀY \$\{date\.format\("DD\/MM\/YYYY"\)\}`;$/m;

const HERO_WEEKDAYS_CONST =
  'const HERO_WEEKDAYS = ["CHỦ NHẬT", "THỨ HAI", "THỨ BA", "THỨ TƯ", "THỨ NĂM", "THỨ SÁU", "THỨ BẢY"];';

/* ---------- Xử lý 1 file ---------- */

let changed = 0;

for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  let src = readFileSync(file, "utf8");
  const orig = src;

  /* 1. Collapse lồng nhau */
  src = collapseNested(src, "ctv");
  src = collapseNested(src, "ct");

  /* 2. Tách template / script */
  const tplMatch = src.match(/<template>([\s\S]*)<\/template>(\s*)<script setup>/);
  const scriptMatch = src.match(/<script setup>([\s\S]*?)<\/script>/);
  if (!tplMatch || !scriptMatch) {
    console.log(`SKIP: ${rel}`);
    continue;
  }

  /* ---- TEMPLATE ---- */
  let tpl = tplMatch[1];

  tpl = tpl.replace(/\bctv\(/g, "$t(");
  tpl = tpl.replace(/\bct\(/g, "$t(");

  /* Lịch tháng — nhãn ngày trong tuần */
  if (tpl.includes("WEEK_LABELS")) {
    tpl = tpl.replace(/\{\{\s*label\s*\}\}/g, "{{ $t(label) }}");
  }

  src =
    src.slice(0, tplMatch.index + "<template>".length) +
    tpl +
    src.slice(tplMatch.index + "<template>".length + tplMatch[1].length);

  /* ---- SCRIPT ---- */
  let script = scriptMatch[1];

  /* Xoá import + hook của đợt 1 (kể cả dạng nhiều dòng) */
  script = script.replace(
    /^import \{[^}]*\} from "@\/composables\/useCardLocale";\s*\n/gm,
    ""
  );
  script = script.replace(
    /^const \{[^}]*\} = (?:useCardLocale|provideCardLocale)\(\s*[\s\S]*?\);\s*\n/gm,
    ""
  );

  /* Hero weekday → mảng tra $t */
  let heroAdded = false;
  script = script.replace(HERO_RE, (m, indent) => {
    heroAdded = true;
    return `${indent}return \`\${t(HERO_WEEKDAYS[date.day()])}, \${t("NGÀY ")}\${date.format("DD/MM/YYYY")}\`;`;
  });

  /* Đổi tên hàm */
  script = script.replace(/\bctv\(/g, "t(");
  script = script.replace(/\bct\(/g, "t(");

  /* Intl tag */
  script = script.replace(/\bintlTag\.value\b/g, "localeTag()");

  /* Import { t, localeTag } từ @/lang */
  const needsT = /\bt\(/.test(script);
  const needsTag = /\blocaleTag\(\)/.test(script);
  const names = [needsT && "t", needsTag && "localeTag"].filter(Boolean);

  if (names.length && !/from "@\/lang"/.test(script)) {
    const importRe = /^import .*$/gm;
    let last = -1;
    let m;
    while ((m = importRe.exec(script))) last = m.index + m[0].length;

    const imp = `import { ${names.join(", ")} } from "@/lang";`;

    if (last >= 0) script = script.slice(0, last) + "\n" + imp + script.slice(last);
    else script = imp + "\n" + script;
  }

  if (heroAdded && !script.includes("HERO_WEEKDAYS =")) {
    const importRe = /^import .*$/gm;
    let last = -1;
    let m;
    while ((m = importRe.exec(script))) last = m.index + m[0].length;
    if (last >= 0) {
      script = script.slice(0, last) + "\n\n" + HERO_WEEKDAYS_CONST + script.slice(last);
    }
  }

  src = src.replace(
    /<script setup>([\s\S]*?)<\/script>/,
    `<script setup>${script}</script>`
  );

  /* 3. Gộp dòng trống thừa */
  src = src.replace(/\n{3,}/g, "\n\n");

  if (src !== orig) {
    writeFileSync(file, src, "utf8");
    changed++;
    console.log(`OK ${rel}`);
  }
}

console.log(`\nĐã sửa ${changed} file`);

/* ---------- Kiểm tra còn sót ---------- */

const { execSync } = await import("node:child_process");
for (const pat of ["ctv(", "useCardLocale", "provideCardLocale", "intlTag"]) {
  try {
    const out = execSync(
      `grep -rl "${pat}" src/page src/components/common src/components/gallery src/themes src/views/WeddingApi.vue 2>/dev/null || true`,
      { cwd: ROOT, shell: "bash", encoding: "utf8" }
    ).trim();
    if (out) {
      console.log(`\n!!! Còn "${pat}" trong:\n${out}`);
    } else {
      console.log(`Sạch: ${pat}`);
    }
  } catch {
    console.log(`Sạch: ${pat}`);
  }
}
