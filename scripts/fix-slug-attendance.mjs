/*
 * Fix 2 bug hàng loạt trong src/page/**:
 *
 * 1. SLUG/TOKEN CONCAT — khách mở link cá nhân /{slug}/{token}
 *    thì addWish/Confirm/getAllWishes gửi slug = "slug/token"
 *    (nối chuỗi) trong khi backend tìm WHERE Slug = @Slug thuần
 *    → luôn "Không tìm thấy thiệp cưới.". Sửa: chỉ dùng
 *    route.params.slug.
 *
 * 2. ATTENDANCE BỊ DỊCH — payload gửi t("Có tham dự") nên thiệp
 *    ngoại ngữ gửi "Attending"... backend chỉ chấp nhận đúng
 *    chuỗi tiếng Việt chuẩn. Sửa: payload gửi chuỗi chuẩn,
 *    template hiển thị ($t) giữ nguyên.
 *
 * Chạy: node scripts/fix-slug-attendance.mjs
 * Idempotent — chạy lại không đổi gì thêm.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

/* Đệ quy lấy mọi .vue dưới thư mục gốc. */
function walkVue(dir) {
  const out = [];

  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);

    if (st.isDirectory()) {
      out.push(...walkVue(full));
    } else if (extname(name) === ".vue") {
      out.push(full);
    }
  }

  return out;
}

/* Pattern A: const slug = route.params.slug ? (token ? concat : slug) : "" */
const RE_A =
  /const slug = route\.params\.slug\s*\?\s*route\.params\.token\s*\?\s*`\$\{route\.params\.slug\}\/\$\{route\.params\.token\}`\s*:\s*route\.params\.slug(?:\s*\|\|\s*"";?)?\s*:\s*"";?/g;

/* Pattern B: return route.params.token ? concat : route.params.slug (buildSlug) */
const RE_B =
  /return route\.params\.token\s*\?\s*`\$\{route\.params\.slug\}\/\$\{route\.params\.token\}`\s*:\s*route\.params\.slug(?:\s*\|\|\s*"";?)?;?/g;

/* Pattern C: const slug = route.params.token ? concat : route.params.slug(|| "") */
const RE_C =
  /const slug = route\.params\.token\s*\?\s*`\$\{route\.params\.slug\}\/\$\{route\.params\.token\}`\s*:\s*route\.params\.slug(?:\s*\|\|\s*"";?)?;?/g;

/* Attendance: payload dịch theo ngôn ngữ thiệp → gửi chuỗi chuẩn */
const RE_ATT = /\? t\("Có tham dự"\) : t\("Không tham dự"\)/g;

const allVue = walkVue("src/page");

const files = allVue.filter((f) =>
  src0(f).includes("route.params.slug}/${route.params.token")
);

const attFiles = allVue.filter((f) => src0(f).includes("Có tham dự"));

function src0(file) {
  return readFileSync(file, "utf8");
}

const all = [...new Set([...files, ...attFiles])];
let totalSlug = 0;
let totalAtt = 0;

for (const file of all) {
  let src = readFileSync(file, "utf8");
  const before = src;

  let n = 0;
  src = src.replace(RE_A, () => {
    n++;
    return 'const slug = route.params.slug || "";';
  });
  src = src.replace(RE_B, () => {
    n++;
    return "return route.params.slug;";
  });
  src = src.replace(RE_C, () => {
    n++;
    return 'const slug = route.params.slug || "";';
  });
  totalSlug += n;

  let a = 0;
  src = src.replace(RE_ATT, () => {
    a++;
    return '? "Có tham dự" : "Không tham dự"';
  });
  totalAtt += a;

  if (src !== before) {
    writeFileSync(file, src);
    console.log(`${file}: slug=${n} attendance=${a}`);
  }
}

console.log(`\nTotal: ${totalSlug} slug blocks, ${totalAtt} attendance lines`);

/* Verify: không còn concat nào sót */
const leftover = allVue
  .filter((f) => src0(f).includes("route.params.slug}/${route.params.token}"))
  .map((f) => f);

if (leftover.length) {
  console.error("\n!! CÒN SÓT concat (cần xem tay):");
  console.error(leftover.join("\n"));
  process.exit(1);
}

console.log("OK: không còn pattern nối slug/token trong src/page");
