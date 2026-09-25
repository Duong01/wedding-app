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
  "../assets/template-preview/*.webp",
  { eager: true, import: "default" }
);

export const PREVIEWS = Object.fromEntries(
  Object.entries(previewModules).map(([path, url]) => {
    const stem = path.split("/").pop().replace(".webp", "");

    return [stem, url];
  })
);

/*
 * Mỗi theme trỏ tới một ảnh xem trước riêng để thư viện
 * hiện ra như những thiết kế khác nhau, không lặp hình.
 */
export const THEME_PREVIEW = {
  "traditional-red": "song_hy_red",
  "nhat-binh-do": "nhat_binh_red",
  "dong-son": "co_ba_red",
  "double-happiness": "double_phoenix_red",
  "long-phung-v3": "dragon_phoenix_v3_red",
  "elegant-gold": "baroque_gold",
  "ivory-gold": "silk_ribbon_green",
  "midnight-gold": "baroque_v2_darkblue",
  "emerald-luxe": "royal_v2_green",
  "royal-red": "royal_red",
  "romantic-pink": "cherry_blossom_pink",
  "sunset-peach": "hoa_kho_orange",
  "champagne-blush": "silk_flora_brown",
  "lavender-cream": "lien_hoa_pink",
  "soft-rose": "glass_garden_pink",
  "serene-green": "elegant_leaf_green",
  "boho-terracotta": "boho_floral_green",
  "song-hy-red": "song_hy_red",
  "to-duyen-xanh": "spring_garden_green",
  "modern-white": "jasmine_white",
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
    style: cardStyle(wedding),
    raw: wedding,
  };
}
