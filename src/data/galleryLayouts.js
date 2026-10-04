import { t } from "@/lang";

/*
 * =========================================================
 * KIỂU HIỂN THỊ ALBUM ẢNH
 * =========================================================
 * Chủ thiệp chọn ở panel "Album ảnh" — lưu vào
 * wedding.settings.GalleryLayout. "default" (hoặc để
 * trống) = kiểu chọn sẵn cho từng mẫu thiệp
 * (THEME_GALLERY_LAYOUT bên dưới).
 *
 * Mỗi mẫu tự truyền màu nhấn / khung của mình vào
 * GalleryShowcase nên mọi kiểu đều mang màu của thiệp.
 */
export const GALLERY_LAYOUTS = [
  {
    value: "default",
    get label() { return t("galleryLayout.default"); },
    icon: "mdi-auto-fix",
    get hint() { return t("galleryLayout.defaultHint"); },
  },
  {
    value: "coverflow",
    label: "3D Coverflow",
    icon: "mdi-view-carousel-outline",
    get hint() { return t("galleryLayout.coverflowHint"); },
  },
  {
    value: "cards",
    get label() { return t("galleryLayout.cards"); },
    icon: "mdi-cards-outline",
    get hint() { return t("galleryLayout.cardsHint"); },
  },
  {
    value: "ring",
    get label() { return t("galleryLayout.ring"); },
    icon: "mdi-rotate-3d-variant",
    get hint() { return t("galleryLayout.ringHint"); },
  },
  {
    value: "polaroid",
    label: "Polaroid",
    icon: "mdi-image-frame",
    get hint() { return t("galleryLayout.polaroidHint"); },
  },
  {
    value: "filmstrip",
    get label() { return t("galleryLayout.filmstrip"); },
    icon: "mdi-filmstrip",
    get hint() { return t("galleryLayout.filmstripHint"); },
  },
  {
    value: "masonry",
    label: "Masonry",
    icon: "mdi-view-dashboard-outline",
    get hint() { return t("galleryLayout.masonryHint"); },
  },
  {
    value: "mosaic",
    label: "Mosaic",
    icon: "mdi-view-grid-plus-outline",
    get hint() { return t("galleryLayout.mosaicHint"); },
  },
];

export const GALLERY_LAYOUT_VALUES = GALLERY_LAYOUTS.map((item) => item.value);

/*
 * Kiểu album mặc định của từng mẫu — chọn theo phong cách:
 *   truyền thống / sang trọng → thẻ xếp chồng, vòng xoay 3D
 *   lãng mạn / nhẹ nhàng      → polaroid
 *   hiện đại / tối giản       → masonry, mosaic
 *   cổ điển / hoài niệm       → cuộn phim
 */
export const THEME_GALLERY_LAYOUT = {
  "traditional-red": "cards",
  "champagne-blush": "cards",
  "song-hy-red": "cards",
  "jade-phoenix": "cards",

  "romantic-pink": "polaroid",
  "ivory-gold": "polaroid",
  "sunset-peach": "polaroid",
  "to-duyen-xanh": "polaroid",
  "watercolor-blush": "polaroid",

  "royal-red": "ring",
  "midnight-gold": "ring",
  "double-happiness": "ring",
  "long-phung-v3": "ring",

  "elegant-gold": "mosaic",
  "lavender-cream": "mosaic",
  "emerald-luxe": "mosaic",
  "nhat-binh-do": "mosaic",

  "modern-white": "masonry",
  "serene-green": "masonry",
  "botanical-leaf": "masonry",

  "dong-son": "filmstrip",
  "boho-terracotta": "filmstrip",
  "modern-noir": "filmstrip",

  "song-hac-red": "coverflow",
  "chateau-blue": "coverflow",
  "ruby-romance": "coverflow",
};

/*
 * Kiểu người dùng chọn: giá trị lạ / trống → "default".
 */
export function resolveGalleryLayout(value) {
  return GALLERY_LAYOUT_VALUES.includes(value) ? value : "default";
}

/*
 * Kiểu thực sự hiển thị cho 1 mẫu: người dùng chọn cụ thể
 * thì theo người dùng, "default" thì theo mẫu.
 */
export function galleryLayoutFor(themeName, value) {
  const chosen = resolveGalleryLayout(value);

  return chosen === "default" ? THEME_GALLERY_LAYOUT[themeName] || "coverflow" : chosen;
}

export function galleryLayoutLabel(value) {
  return GALLERY_LAYOUTS.find((item) => item.value === value)?.label || "";
}
