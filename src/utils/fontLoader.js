/*
 * =========================================================
 * NẠP FONT GOOGLE THEO NHU CẦU
 * =========================================================
 * Trước đây index.html nạp sẵn 25 font (~40 file woff2) cho
 * MỌI trang — trong khi mỗi thiệp chỉ dùng 2–3 font. Khách
 * mời mở link thiệp phải tải cả đám font không bao giờ dùng.
 *
 * Giờ index.html chỉ giữ preconnect; font thật được chèn
 * <link> đúng lúc cần:
 *
 *  1. Font khung app (Lora, Be Vietnam Pro, Cormorant
 *     Garamond, Allura, Playfair Display, Great Vibes,
 *     Noto Serif SC) — nạp ngay khi app khởi động vì
 *     header/footer/trang marketing dùng liên tục.
 *  2. Font riêng của theme đang mở — nạp khi theme render,
 *     chỉ đúng những font theme đó khai báo.
 *
 * Mỗi tên font chỉ chèn 1 lần (Map theo tên). Font editor
 * (ThemePanel) nạp khi mở panel — xem ensureFonts().
 */

const loaded = new Set();

/*
 * Chữ số & ký tự đặc biệt trong tên font phải giữ nguyên
 * khi đưa vào query Google Fonts (khoảng trắng → "+").
 */
function toQueryName(name) {
  return name.trim().replace(/\s+/g, "+");
}

/*
 * Nạp 1 hoặc nhiều font Google.
 * Nhận vào mảng tên font, bỏ qua font đã nạp và tên rỗng.
 */
export function ensureFonts(names) {
  const list = (Array.isArray(names) ? names : [names]).filter(
    (name) =>
      typeof name === "string" &&
      name.trim() &&
      !loaded.has(name.trim())
  );

  if (!list.length) {
    return;
  }

  list.forEach((name) => loaded.add(name.trim()));

  const query = list.map(toQueryName).join("&family=");

  const link = document.createElement("link");

  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${query}&display=swap`;

  document.head.appendChild(link);
}

/*
 * Font khung app — gọi một lần lúc khởi động (main.js).
 * Gồm font các biến --font-* trong theme.css/chungdoi.css
 * và font body mặc định.
 */
export function loadAppFonts() {
  ensureFonts([
    "Lora",
    "Be Vietnam Pro",
    "Cormorant Garamond",
    "Allura",
    "Playfair Display",
    "Great Vibes",
    "Noto Serif SC",
  ]);
}
