import { t } from "@/lang";

/*
 * =========================================================
 * BỘ SƯU TẬP & NHẬN DIỆN MÀU THEO TỪNG MẪU THIỆP
 * =========================================================
 * Mỗi theme có một "bản sắc" riêng: bảng màu, họa tiết,
 * kiểu chữ — dùng chung cho gallery (Templates) và Home
 * để mỗi mẫu thiệp hiện ra như một thiết kế riêng biệt.
 *
 * palette.bg     — nền giấy của thiệp
 * palette.ink    — màu mực (chữ chính)
 * palette.soft   — mực nhạt (chữ phụ)
 * palette.accent — kim tuyến / foil
 * palette.seal   — màu ấn son
 * dark           — nền tối (thiệp nền sẫm)
 * script         — tên cô dâu chú rể dùng chữ ký (Allura)
 * isNew          — theme mới ra mắt, hiển thị badge "Mới" ở gallery
 * orn            — ký tự họa tiết đặc trưng
 * desc           — mô tả ngắn về thiết kế (thẻ mẫu + JSON-LD)
 * tags           — từ khóa phong cách (thẻ mẫu, tìm kiếm, JSON-LD)
 * =========================================================
 */

export const COLLECTIONS = [
  {
    id: "truyen-thong",
    get name() { return t("col.traditional.title"); },
    get sub() { return t("col.traditional.sub"); },
    swatches: ["#7b0d0d", "#c79d5c", "#f6ecd9"],
  },
  {
    id: "lang-man",
    get name() { return t("col.romantic.title"); },
    get sub() { return t("col.romantic.sub"); },
    swatches: ["#c56f88", "#d67a63", "#a086b4"],
  },
  {
    id: "hien-dai",
    get name() { return t("col.modern.title"); },
    get sub() { return t("col.modern.sub"); },
    swatches: ["#2b2b2b", "#b8a07a", "#17121b"],
  },
  {
    id: "co-dien",
    get name() { return t("col.classic.title"); },
    get sub() { return t("col.classic.sub"); },
    swatches: ["#2f3e5c", "#b58a45", "#faf8f3"],
  },
  {
    id: "nghe-thuat",
    get name() { return t("col.art.title"); },
    get sub() { return t("col.art.sub"); },
    swatches: ["#8a4a5c", "#d98ca0", "#fdf8fa"],
  },
  {
    id: "thien-nhien",
    get name() { return t("col.nature.title"); },
    get sub() { return t("col.nature.sub"); },
    swatches: ["#3d5a47", "#7fa389", "#f5f8f4"],
  },
  {
    id: "a-dong",
    get name() { return t("col.asian.title"); },
    get sub() { return t("col.asian.sub"); },
    swatches: ["#6e1f24", "#d9a441", "#2b0303"],
  },
];

export const THEME_META = {
  /* =====================================================
     BỘ SƯU TẬP A — Á ĐÔNG SANG TRỌNG
  ====================================================== */

  "traditional-red": {
    get name() { return t("tpl.traditional-red.name"); },
    collection: "truyen-thong",
    get desc() { return t("tpl.traditional-red.desc"); },
    get tags() { return [t("tpl.tag.traditional"), t("tpl.tag.vermilion"), t("tpl.tag.doubleHappiness")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.traditional","tpl.tag.vermilion","tpl.tag.doubleHappiness"],
    palette: {
      bg: "#f8f5ed",
      ink: "#65090c",
      soft: "#8a7a68",
      accent: "#c79d5c",
      seal: "#7b0d0d",
    },
    orn: "囍",
  },

  "nhat-binh-do": {
    get name() { return t("tpl.nhat-binh-do.name"); },
    collection: "truyen-thong",
    get desc() { return t("tpl.nhat-binh-do.desc"); },
    get tags() { return [t("tpl.tag.ancient"), t("tpl.tag.vermilion"), t("tpl.tag.creamPaper")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.ancient","tpl.tag.vermilion","tpl.tag.creamPaper"],
    palette: {
      bg: "#f6ecd9",
      ink: "#720e12",
      soft: "#8a7a68",
      accent: "#b58a45",
      seal: "#971519",
    },
    orn: "囍",
  },

  "dong-son": {
    get name() { return t("tpl.dong-son.name"); },
    collection: "truyen-thong",
    get desc() { return t("tpl.dong-son.desc"); },
    get tags() { return [t("tpl.tag.traditional"), t("tpl.tag.terracotta"), t("tpl.tag.bronzeDrum")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.traditional","tpl.tag.terracotta","tpl.tag.bronzeDrum"],
    palette: {
      bg: "#f3ead8",
      ink: "#54120f",
      soft: "#8a7a68",
      accent: "#a96b32",
      seal: "#8f241c",
    },
    orn: "✦",
  },

  "double-happiness": {
    get name() { return t("tpl.double-happiness.name"); },
    collection: "a-dong",
    get desc() { return t("tpl.double-happiness.desc"); },
    get tags() { return [t("tpl.tag.traditional"), t("tpl.tag.deepRed"), t("tpl.tag.xi")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.traditional","tpl.tag.deepRed","tpl.tag.xi"],
    palette: {
      bg: "#f7e6c4",
      ink: "#5c0e10",
      soft: "#8a7a68",
      accent: "#d9a441",
      seal: "#7a1216",
    },
    orn: "囍",
  },

  "long-phung-v3": {
    get name() { return t("tpl.long-phung-v3.name"); },
    collection: "a-dong",
    dark: true,
    get desc() { return t("tpl.long-phung-v3.desc"); },
    get tags() { return [t("tpl.tag.classic"), t("tpl.tag.deepRed"), t("tpl.tag.dragonPhoenix")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.classic","tpl.tag.deepRed","tpl.tag.dragonPhoenix"],
    palette: {
      bg: "#5a000e",
      ink: "#ffbe89",
      soft: "rgba(255, 190, 137, 0.65)",
      accent: "#d4af37",
      seal: "#d4af37",
    },
    orn: "囍",
  },

  "song-hy-red": {
    get name() { return t("tpl.song-hy-red.name"); },
    collection: "truyen-thong",
    get desc() { return t("tpl.song-hy-red.desc"); },
    get tags() { return [t("tpl.tag.traditional"), t("tpl.tag.vermilion"), t("tpl.tag.brass")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.traditional","tpl.tag.vermilion","tpl.tag.brass"],
    palette: {
      bg: "#fff7eb",
      ink: "#666666",
      soft: "#a52a2a",
      accent: "#fbbf24",
      seal: "#800000",
    },
    orn: "囍",
  },

  "song-hac-red": {
    get name() { return t("tpl.song-hac-red.name"); },
    collection: "truyen-thong",
    dark: true,
    isNew: true,
    get desc() { return t("tpl.song-hac-red.desc"); },
    get tags() { return [t("tpl.tag.traditional"), t("tpl.tag.deepRed"), t("tpl.tag.crane")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.traditional","tpl.tag.deepRed","tpl.tag.crane"],
    palette: {
      bg: "#920002",
      ink: "#ffe8a4",
      soft: "rgba(255, 232, 164, 0.65)",
      accent: "#ffe8a4",
      seal: "#ffe8a4",
    },
    orn: "囍",
  },

  /* =====================================================
     BỘ SƯU TẬP B — KIM TUYẾN & LỤA
  ====================================================== */

  "elegant-gold": {
    get name() { return t("tpl.elegant-gold.name"); },
    collection: "co-dien",
    get desc() { return t("tpl.elegant-gold.desc"); },
    get tags() { return [t("tpl.tag.luxury"), t("tpl.tag.gold"), t("tpl.tag.elegant")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.luxury","tpl.tag.gold","tpl.tag.elegant"],
    palette: {
      bg: "#faf8f3",
      ink: "#4a3620",
      soft: "#8a7a68",
      accent: "#b58a45",
      seal: "#8a7657",
    },
    orn: "✦",
  },

  "ivory-gold": {
    get name() { return t("tpl.ivory-gold.name"); },
    collection: "co-dien",
    get desc() { return t("tpl.ivory-gold.desc"); },
    get tags() { return [t("tpl.tag.elegant"), t("tpl.tag.ivory"), t("tpl.tag.silk")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.elegant","tpl.tag.ivory","tpl.tag.silk"],
    palette: {
      bg: "#fffaf0",
      ink: "#4a3f38",
      soft: "#8a7a68",
      accent: "#d4af85",
      seal: "#c9a45c",
    },
    orn: "✦",
  },

  "midnight-gold": {
    get name() { return t("tpl.midnight-gold.name"); },
    collection: "hien-dai",
    dark: true,
    get desc() { return t("tpl.midnight-gold.desc"); },
    get tags() { return [t("tpl.tag.luxury"), t("tpl.tag.darkBg"), t("tpl.tag.gold")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.luxury","tpl.tag.darkBg","tpl.tag.gold"],
    palette: {
      bg: "#17121b",
      ink: "#f0e6d2",
      soft: "rgba(240, 230, 210, 0.6)",
      accent: "#d8b676",
      seal: "#d8b676",
    },
    orn: "✦",
  },

  "emerald-luxe": {
    get name() { return t("tpl.emerald-luxe.name"); },
    collection: "thien-nhien",
    get desc() { return t("tpl.emerald-luxe.desc"); },
    get tags() { return [t("tpl.tag.cute"), t("tpl.tag.illustration"), t("tpl.tag.cream")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.cute","tpl.tag.illustration","tpl.tag.cream"],
    palette: {
      bg: "#fef0e0",
      ink: "#4c2d1f",
      soft: "rgba(98, 69, 55, 0.72)",
      accent: "#e1c490",
      seal: "#4c2d1f",
    },
    orn: "❀",
  },

  "royal-red": {
    get name() { return t("tpl.royal-red.name"); },
    collection: "a-dong",
    dark: true,
    get desc() { return t("tpl.royal-red.desc"); },
    get tags() { return [t("tpl.tag.luxury"), t("tpl.tag.deepRed"), t("tpl.tag.gold")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.luxury","tpl.tag.deepRed","tpl.tag.gold"],
    palette: {
      bg: "#2b0003",
      ink: "#f3d99c",
      soft: "rgba(243, 217, 156, 0.62)",
      accent: "#d8ad61",
      seal: "#d8ad61",
    },
    orn: "✦",
  },

  /* =====================================================
     BỘ SƯU TẬP C — LÃNG MẠN ĐƯƠNG ĐẠI
  ====================================================== */

  "romantic-pink": {
    get name() { return t("tpl.romantic-pink.name"); },
    collection: "lang-man",
    script: true,
    get desc() { return t("tpl.romantic-pink.desc"); },
    get tags() { return [t("tpl.tag.romantic"), t("tpl.tag.pink"), t("tpl.tag.handwriting")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.romantic","tpl.tag.pink","tpl.tag.handwriting"],
    palette: {
      bg: "#fffaf9",
      ink: "#9b4b61",
      soft: "#b08a94",
      accent: "#c56f88",
      seal: "#c56f88",
    },
    orn: "❀",
  },

  "sunset-peach": {
    get name() { return t("tpl.sunset-peach.name"); },
    collection: "lang-man",
    script: true,
    get desc() { return t("tpl.sunset-peach.desc"); },
    get tags() { return [t("tpl.tag.romantic"), t("tpl.tag.peach"), t("tpl.tag.warm")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.romantic","tpl.tag.peach","tpl.tag.warm"],
    palette: {
      bg: "#fffaf5",
      ink: "#7a4a3d",
      soft: "#a98a80",
      accent: "#d67a63",
      seal: "#d67a63",
    },
    orn: "❀",
  },

  "champagne-blush": {
    get name() { return t("tpl.champagne-blush.name"); },
    collection: "lang-man",
    script: true,
    get desc() { return t("tpl.champagne-blush.desc"); },
    get tags() { return [t("tpl.tag.romantic"), t("tpl.tag.champagne"), t("tpl.tag.cream")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.romantic","tpl.tag.champagne","tpl.tag.cream"],
    palette: {
      bg: "#fffaf7",
      ink: "#6c4b4a",
      soft: "#a08583",
      accent: "#b67f7d",
      seal: "#b67f7d",
    },
    orn: "❀",
  },

  "lavender-cream": {
    get name() { return t("tpl.lavender-cream.name"); },
    collection: "lang-man",
    script: true,
    get desc() { return t("tpl.lavender-cream.desc"); },
    get tags() { return [t("tpl.tag.romantic"), t("tpl.tag.lavender"), t("tpl.tag.purple")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.romantic","tpl.tag.lavender","tpl.tag.purple"],
    palette: {
      bg: "#faf8fc",
      ink: "#584a5b",
      soft: "#93849a",
      accent: "#a086b4",
      seal: "#a086b4",
    },
    orn: "❀",
  },

  "soft-rose": {
    get name() { return t("tpl.soft-rose.name"); },
    collection: "lang-man",
    script: true,
    get desc() { return t("tpl.soft-rose.desc"); },
    get tags() { return [t("tpl.tag.romantic"), t("tpl.tag.blush"), t("tpl.tag.pure")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.romantic","tpl.tag.blush","tpl.tag.pure"],
    palette: {
      bg: "#fffafa",
      ink: "#a4525f",
      soft: "#b58f96",
      accent: "#c97b8a",
      seal: "#c97b8a",
    },
    orn: "❀",
  },

  /* =====================================================
     BỘ SƯU TẬP D — THIÊN NHIÊN & VINTAGE
  ====================================================== */

  "serene-green": {
    get name() { return t("tpl.serene-green.name"); },
    collection: "thien-nhien",
    get desc() { return t("tpl.serene-green.desc"); },
    get tags() { return [t("tpl.tag.nature"), t("tpl.tag.green"), t("tpl.tag.serene")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.nature","tpl.tag.green","tpl.tag.serene"],
    palette: {
      bg: "#f5f8f4",
      ink: "#28514b",
      soft: "#7d8f85",
      accent: "#6c8e7a",
      seal: "#28514b",
    },
    orn: "❧",
  },

  "boho-terracotta": {
    get name() { return t("tpl.boho-terracotta.name"); },
    collection: "thien-nhien",
    dark: true,
    isNew: true,
    get desc() { return t("tpl.boho-terracotta.desc"); },
    get tags() { return [t("tpl.tag.classic"), t("tpl.tag.darkRed"), "Baroque"]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.classic","tpl.tag.darkRed","raw:Baroque"],
    palette: {
      bg: "#2b0303",
      ink: "#ffefd6",
      soft: "rgba(255, 239, 214, 0.65)",
      accent: "#ffdfaf",
      seal: "#ffdfaf",
    },
    orn: "❦",
  },

  "to-duyen-xanh": {
    get name() { return t("tpl.to-duyen-xanh.name"); },
    collection: "thien-nhien",
    isNew: true,
    get desc() { return t("tpl.to-duyen-xanh.desc"); },
    get tags() { return [t("tpl.tag.nature"), t("tpl.tag.moss"), t("tpl.tag.simple")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.nature","tpl.tag.moss","tpl.tag.simple"],
    palette: {
      bg: "#fefbf4",
      ink: "#1a3500",
      soft: "#5e813c",
      accent: "#d1db9c",
      seal: "#5e813c",
    },
    orn: "❀",
  },

  /* =====================================================
     BỘ SƯU TẬP E — TỐI GIẢN HIỆN ĐẠI
  ====================================================== */

  "modern-white": {
    get name() { return t("tpl.modern-white.name"); },
    collection: "hien-dai",
    isNew: true,
    get desc() { return t("tpl.modern-white.desc"); },
    get tags() { return [t("tpl.tag.minimal"), t("tpl.tag.white"), t("tpl.tag.modern")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.minimal","tpl.tag.white","tpl.tag.modern"],
    palette: {
      bg: "#ffffff",
      ink: "#2a2a2a",
      soft: "#8a8580",
      accent: "#7f151a",
      seal: "#7f151a",
    },
    orn: "囍",
  },

  /* =====================================================
     6 MẪU MỚI — THEO 7 PHONG CÁCH
  ====================================================== */

  "watercolor-blush": {
    get name() { return t("tpl.watercolor-blush.name"); },
    collection: "nghe-thuat",
    script: true,
    isNew: true,
    get desc() { return t("tpl.watercolor-blush.desc"); },
    get tags() { return [t("tpl.tag.watercolor"), t("tpl.tag.peachPink"), t("tpl.tag.art")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.watercolor","tpl.tag.peachPink","tpl.tag.art"],
    palette: {
      bg: "#fdf8fa",
      ink: "#8a4a5c",
      soft: "#a06a7c",
      accent: "#d98ca0",
      seal: "#b04a62",
    },
    orn: "❁",
  },

  "botanical-leaf": {
    get name() { return t("tpl.botanical-leaf.name"); },
    collection: "thien-nhien",
    isNew: true,
    get desc() { return t("tpl.botanical-leaf.desc"); },
    get tags() { return ["Botanical", t("tpl.tag.green"), "Eucalyptus"]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["raw:Botanical","tpl.tag.green","raw:Eucalyptus"],
    palette: {
      bg: "#f9fbf9",
      ink: "#3d5a47",
      soft: "#5a7362",
      accent: "#7fa389",
      seal: "#3d5a47",
    },
    orn: "❧",
  },

  "chateau-blue": {
    get name() { return t("tpl.chateau-blue.name"); },
    collection: "co-dien",
    isNew: true,
    get desc() { return t("tpl.chateau-blue.desc"); },
    get tags() { return [t("tpl.tag.classic"), "Navy", t("tpl.tag.brass")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.classic","raw:Navy","tpl.tag.brass"],
    palette: {
      bg: "#fafbfd",
      ink: "#2f3e5c",
      soft: "#5a6378",
      accent: "#b58a45",
      seal: "#8a6a3a",
    },
    orn: "❦",
  },

  "jade-phoenix": {
    get name() { return t("tpl.jade-phoenix.name"); },
    collection: "a-dong",
    isNew: true,
    get desc() { return t("tpl.jade-phoenix.desc"); },
    get tags() { return [t("tpl.tag.asian"), t("tpl.tag.deepRed"), t("tpl.tag.gold")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.asian","tpl.tag.deepRed","tpl.tag.gold"],
    palette: {
      bg: "#fdfaf3",
      ink: "#6e1f24",
      soft: "#7a3a3f",
      accent: "#b98a4b",
      seal: "#a33d2e",
    },
    orn: "囍",
  },

  "modern-noir": {
    get name() { return t("tpl.modern-noir.name"); },
    collection: "hien-dai",
    isNew: true,
    get desc() { return t("tpl.modern-noir.desc"); },
    get tags() { return [t("tpl.tag.luxury"), t("tpl.tag.darkBg2"), "Champagne"]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.luxury","tpl.tag.darkBg2","raw:Champagne"],
    palette: {
      bg: "#fbf8f0",
      ink: "#3a3a3a",
      soft: "#5c5c5c",
      accent: "#b8a07a",
      seal: "#8a6a3a",
    },
    orn: "✧",
  },

  "ruby-romance": {
    get name() { return t("tpl.ruby-romance.name"); },
    collection: "lang-man",
    script: true,
    isNew: true,
    get desc() { return t("tpl.ruby-romance.desc"); },
    get tags() { return [t("tpl.tag.romantic"), "Ruby", t("tpl.tag.rosyRed")]; },
    /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
    tagKeys: ["tpl.tag.romantic","raw:Ruby","tpl.tag.rosyRed"],
    palette: {
      bg: "#fdf7f8",
      ink: "#8c2f42",
      soft: "#7a4450",
      accent: "#c46a7e",
      seal: "#a33d4e",
    },
    orn: "❥",
  },
};

/*
 * Meta dự phòng — theme chưa đăng ký (hoặc dữ liệu cũ)
 * vẫn có nhận diện trung tính để gallery không vỡ.
 */
export const FALLBACK_META = {
  get name() { return t("tpl.fallback.name"); },
  collection: "co-dien",
  get desc() { return t("tpl.fallback.desc"); },
  get tags() { return [t("tpl.tag.classic")]; },
  /* Key ổn định (không đổi theo ngôn ngữ) — WeddingIntro dùng để chọn tag màu */
  tagKeys: ["tpl.tag.classic"],
  palette: {
    bg: "#f7f1e6",
    ink: "#2b2118",
    soft: "#8a7a68",
    accent: "#b9975b",
    seal: "#a63a2e",
  },
  orn: "✦",
};

export function getThemeMeta(themeName) {
  return THEME_META[themeName] || FALLBACK_META;
}

export function getCollection(collectionId) {
  return (
    COLLECTIONS.find((col) => col.id === collectionId) || {
      id: "",
      get name() { return t("stats.collections"); },
      sub: "",
      swatches: [],
    }
  );
}
