/*
 * =========================================================
 * FONT MỖI THEME CẦN — dùng với utils/fontLoader.js
 * =========================================================
 * Danh sách này lấy từ các khai báo font-family trong
 * src/page/<Theme>/ + src/themes/<Theme>.vue (font hệ thống
 * như Georgia, Times New Roman, Baskerville không cần nạp).
 *
 * Theme không có font Google riêng (DongSon, ElegantGold,
 * ModernWhite, RoyalRed dùng Georgia/Patrick Hand...) để
 * mảng rỗng — không nạp gì thêm.
 *
 * Cập nhật khi thêm theme mới hoặc đổi font trong theme.
 */
export const THEME_FONTS = {
  "traditional-red": ["EB Garamond", "Lora", "Pattaya", "The Nautigal"],
  "romantic-pink": ["Alex Brush", "EB Garamond", "Ms Madi", "Viaoda Libre"],
  "modern-white": [],
  "elegant-gold": ["Patrick Hand"],
  "nhat-binh-do": ["Cormorant Garamond", "Viaoda Libre"],
  "ivory-gold": ["Cormorant Garamond"],
  "royal-red": [],
  "dong-son": [],
  "serene-green": ["Allura", "Cormorant Garamond"],
  "sunset-peach": ["Allura", "Cormorant Garamond"],
  "champagne-blush": ["Allura", "Cormorant Garamond"],
  "midnight-gold": ["Allura", "Cormorant Garamond"],
  "lavender-cream": ["Allura", "Cormorant Garamond"],
  "double-happiness": ["Allura", "Cormorant Garamond"],
  "boho-terracotta": [
    "Cormorant Garamond",
    "Libre Baskerville",
    "Ms Madi",
    "Playfair Display",
    "Roboto",
    "The Nautigal",
    "Viaoda Libre",
  ],
  "song-hy-red": ["Cormorant Garamond", "EB Garamond"],
  "song-hac-red": [
    "Carattere",
    "The Nautigal",
    "Uchen",
    "Whisper",
    "Ms Madi",
    "Fraunces",
  ],
  "to-duyen-xanh": ["Aguafina Script", "The Nautigal"],
  "long-phung-v3": ["EB Garamond"],
  "emerald-luxe": ["Babylonica", "Be Vietnam Pro", "Noto Serif SC", "Viaoda Libre"],
  "watercolor-blush": ["Allura", "Cormorant Garamond"],
  "botanical-leaf": ["Allura", "Cormorant Garamond"],
  "chateau-blue": ["Allura", "Cormorant Garamond"],
  "jade-phoenix": ["Allura", "Cormorant Garamond"],
  "modern-noir": ["Allura", "Cormorant Garamond"],
  "ruby-romance": ["Allura", "Cormorant Garamond"],
};

/*
 * Lấy danh sách font của theme + font người dùng chọn trong
 * editor (theme.Fonts.Main/Heading/Script) — khách mở thiệp
 * thật cần đúng font chủ thiệp đã chọn.
 */
export function fontsForTheme(wedding) {
  const themeName =
    wedding?.theme?.Name || wedding?.theme?.name || wedding?.theme;

  const base = THEME_FONTS[themeName] || [];

  const chosen = wedding?.theme?.Fonts || wedding?.theme?.fonts || {};

  const userFonts = [chosen.Main, chosen.Heading, chosen.Script].filter(
    (name) => typeof name === "string" && name.trim()
  );

  return [...new Set([...base, ...userFonts])];
}
