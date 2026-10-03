import {
  getCollection,
  getThemeMeta,
} from "@/data/templateCollections";

/*
 * =========================================================
 * DỮ LIỆU HIỂN THỊ CỦA MỘT MẪU THIỆP
 * =========================================================
 * Trang chủ, thư viện mẫu và các trang đích SEO đều cần
 * cùng một cách đọc: theme → tên, bộ sưu tập, bảng màu,
 * ảnh xem trước, tên cô dâu chú rể, ngày cưới.
 *
 * Gom về đây để ba nơi không lệch nhau sau vài lần sửa.
 * =========================================================
 */

const previewModules = import.meta.glob(
  "../assets/template-preview/*.jpeg",
  { eager: true, import: "default" }
);

export const PREVIEWS = Object.fromEntries(
  Object.entries(previewModules).map(([path, url]) => {
    const stem = path.split("/").pop().replace(".jpeg", "");

    return [stem, url];
  })
);

/*
 * Mỗi theme trỏ tới một ảnh xem trước riêng để thư viện
 * hiện ra như những thiết kế khác nhau, không lặp hình.
 */
export const THEME_PREVIEW = {
  "traditional-red": "traditional-red",
  "nhat-binh-do": "nhat-binh-do",
  "dong-son": "dong-son",
  "double-happiness": "double-happiness",
  "long-phung-v3": "long-phung-v3",
  "elegant-gold": "elegant-gold",
  "ivory-gold": "ivory-gold",
  "midnight-gold": "midnight-gold",
  "emerald-luxe": "emerald-luxe",
  "royal-red": "royal-red",
  "romantic-pink": "romantic-pink",
  "sunset-peach": "sunset-peach",
  "champagne-blush": "champagne-blush",
  "lavender-cream": "lavender-cream",
  "soft-rose": "soft-rose",
  "serene-green": "serene-green",
  "boho-terracotta": "boho-terracotta",
  "song-hy-red": "song-hy-red",
  "song-hac-red": "song-hac-do",
  "to-duyen-xanh": "to-duyen-xanh",
  "modern-white": "modern-white",
  "watercolor-blush": "watercolor-blush",
  "botanical-leaf": "botanical-leaf",
  "chateau-blue": "chateau-blue",
  "jade-phoenix": "jade-phoenix",
  "modern-noir": "modern-noir",
  "ruby-romance": "ruby-romance",
};

export const FALLBACK_PREVIEW = "minimalism_red";

export function themeSlug(wedding) {
  return wedding?.theme?.Name || wedding?.theme || "";
}

export function themeMeta(wedding) {
  return getThemeMeta(themeSlug(wedding));
}

export function themeLabel(wedding) {
  const slug = themeSlug(wedding);

  return themeMeta(wedding).name || slug || "Classic";
}

export function collectionLabel(wedding) {
  return getCollection(themeMeta(wedding).collection).name;
}

export function coupleName(wedding) {
  const bride = wedding?.couple?.Bride?.Name || "";
  const groom = wedding?.couple?.Groom?.Name || "";

  if (!bride && !groom) {
    return "Cô dâu & Chú rể";
  }

  return `${bride} & ${groom}`;
}

export function previewFor(wedding) {
  const stem = THEME_PREVIEW[themeSlug(wedding)] || FALLBACK_PREVIEW;

  return PREVIEWS[stem] || PREVIEWS[FALLBACK_PREVIEW] || "";
}

export function previewByStem(stem) {
  return PREVIEWS[stem] || PREVIEWS[FALLBACK_PREVIEW] || "";
}

export function cardStyle(wedding) {
  const palette = themeMeta(wedding).palette;

  return {
    "--card-ink": palette.ink,
    "--card-soft": palette.soft,
    "--card-accent": palette.accent,
    "--card-seal": palette.seal,
    "--card-bg": palette.bg,
  };
}

export function handleImageError(event) {
  const fallback = PREVIEWS[FALLBACK_PREVIEW];

  if (fallback && event.target.src !== fallback) {
    event.target.src = fallback;
  }
}

export function formatDate(date) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

/*
 * Gói dữ liệu gọn cho carousel / lưới thẻ — chỉ những
 * trường giao diện cần, kèm sẵn style bảng màu.
 */
export function toCardItem(wedding) {
  return {
    id: wedding.id || wedding.slug,
    slug: wedding.slug,
    src: previewFor(wedding),
    label: themeLabel(wedding),
    collection: collectionLabel(wedding),
    collectionId: themeMeta(wedding).collection,
    couple: coupleName(wedding),
    date: formatDate(wedding.weddingDate),
    orn: themeMeta(wedding).orn,
    isNew: Boolean(themeMeta(wedding).isNew),
    style: cardStyle(wedding),
    raw: wedding,
  };
}
