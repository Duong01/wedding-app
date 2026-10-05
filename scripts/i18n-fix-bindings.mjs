/*
 * DỌN LỖI CODEMOD — vá 3 lỗi còn sót:
 *   1. :attr="$t('...')  thiếu ")" đóng (đợt 1 làm hỏng)
 *   2. $t("×") / $t("✕") — bọc nhầm ký hiệu không phải chữ
 *   3. WeddingApi.vue còn key card.common.* cũ → đổi sang key
 *      tiếng Việt gốc (key = chuỗi vi trong từ điển)
 *
 * Chạy: node scripts/i18n-fix-bindings.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

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
  ...walk(join(ROOT, "src/components/common")),
  ...walk(join(ROOT, "src/components/gallery")),
  ...walk(join(ROOT, "src/themes")),
  join(ROOT, "src/views/WeddingApi.vue"),
];

/* Ký hiệu thuần — không phải chữ, bỏ bọc $t */
const SYMBOL_RE = /^\$t\("([^"]{1,3})"\)$/;
const SYMBOLS = new Set(["×", "✕", "❦", "♥", "|", "·", "—", "…", "✦", "✧", "❤", "❤️"]);

let fixed = 0;

for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  let src = readFileSync(file, "utf8");
  const orig = src;

  /* 1. Bind thiếu ")" — :attr="$t('...')  →  :attr="$t('...')" */
  src = src.replace(/(:[\w-]+)="(\$t\((?:[^()"]*)\))$/gm, (m, attr, expr) => {
    return `${attr}="${expr})"`;
  });

  /* 2. Ký hiệu bị bọc nhầm — {{ $t("×") }} → {{ "×" }} */
  src = src.replace(/\{\{\s*\$t\("([^"]{1,3})"\)\s*\}\}/g, (m, sym) => {
    if (SYMBOLS.has(sym)) return `{{ "${sym}" }}`;
    return m;
  });

  if (src !== orig) {
    writeFileSync(file, src, "utf8");
    fixed++;
    console.log(`OK ${rel}`);
  }
}

/* 3. WeddingApi.vue — key card.common.* → key tiếng Việt */
const apiFile = join(ROOT, "src/views/WeddingApi.vue");
let api = readFileSync(apiFile, "utf8");

const KEY_MAP = {
  "card.common.loading": "Đang mở thiệp...",
  "card.common.loadingSub": "Vui lòng chờ một chút",
  "card.common.backHome": "Quay lại trang chủ",
  "card.common.notFound": "Thiệp này chưa được đăng ký",
  "card.common.notFoundSub": "Thiệp cưới bạn đang tìm kiếm không tồn tại hoặc đã được thay đổi.",
  "card.common.themeNotFound": "Không tìm thấy mẫu thiệp",
  "card.common.themeNotRegistered": "chưa được đăng ký.",
  "card.common.blocked.locked": "Thiệp chưa được kích hoạt",
  "card.common.blocked.expired": "Thiệp tạm ẩn",
  "card.common.blocked.draft": "Thiệp chưa được xuất bản",
  "card.common.blocked.expiredMsg":
    "Thời gian dùng thử của thiệp đã kết thúc và thiệp chưa được thanh toán. Toàn bộ nội dung vẫn được giữ nguyên — vui lòng liên hệ cô dâu chú rể.",
  "card.common.blocked.draftMsg":
    "Cô dâu chú rể chưa xuất bản thiệp này cho khách mời. Vui lòng quay lại sau.",
  "card.common.blocked.lockedMsg":
    "Thiệp cưới này đang chờ xác nhận thanh toán. Vui lòng liên hệ với cô dâu chú rể hoặc quay lại sau.",
  "card.common.invalidSlug": "Đường dẫn thiệp không hợp lệ.",
  "card.common.serverError": "Máy chủ đang gặp sự cố. Vui lòng thử lại sau.",
  "card.common.loadFailed": "Không thể tải dữ liệu thiệp.",
};

for (const [oldKey, viText] of Object.entries(KEY_MAP)) {
  api = api.split(`"${oldKey}"`).join(`"${viText}"`);
}

writeFileSync(apiFile, api, "utf8");
console.log("OK src/views/WeddingApi.vue (key map)");

console.log(`\nĐã sửa ${fixed} file + WeddingApi`);
