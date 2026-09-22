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
 * orn            — ký tự họa tiết đặc trưng
 * =========================================================
 */

export const COLLECTIONS = [
  {
    id: "a-dong",
    name: "Á Đông Sang Trọng",
    sub: "Đỏ son · vàng son · họa tiết truyền thống",
    swatches: ["#7b0d0d", "#c79d5c", "#f6ecd9"],
  },
  {
    id: "kim-lua",
    name: "Kim Tuyến & Lụa",
    sub: "Foil vàng · lụa ngà · nền sẫm sang",
    swatches: ["#b58a45", "#d4af85", "#17121b"],
  },
  {
    id: "lang-man",
    name: "Lãng Mạn Đương Đại",
    sub: "Hồng phấn · đào · oải hương",
    swatches: ["#c56f88", "#d67a63", "#a086b4"],
  },
  {
    id: "thien-nhien",
    name: "Thiên Nhiên & Vintage",
    sub: "Lá xanh · đất nung · giấy cũ",
    swatches: ["#28514b", "#c97b5d", "#97745a"],
  },
  {
    id: "toi-gian",
    name: "Tối Giản Hiện Đại",
    sub: "Nét mực · khoảng trắng · đỏ điểm xuyết",
    swatches: ["#2a2a2a", "#7f151a", "#ffffff"],
  },
];

export const THEME_META = {
  /* =====================================================
     BỘ SƯU TẬP A — Á ĐÔNG SANG TRỌNG
  ====================================================== */

  "traditional-red": {
    name: "Đỏ Son Truyền Thống",
    collection: "a-dong",
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
    name: "Nhật Bình Đỏ",
    collection: "a-dong",
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
    name: "Trống Đông Sơn",
    collection: "a-dong",
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
    name: "Song Hỷ",
    collection: "a-dong",
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
    name: "Long Phụng",
    collection: "a-dong",
    dark: true,
    palette: {
      bg: "#5a000e",
      ink: "#ffbe89",
      soft: "rgba(255, 190, 137, 0.65)",
      accent: "#d4af37",
      seal: "#d4af37",
    },
    orn: "囍",
  },

  /* =====================================================
     BỘ SƯU TẬP B — KIM TUYẾN & LỤA
  ====================================================== */

  "elegant-gold": {
    name: "Vàng Sang Trọng",
    collection: "kim-lua",
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
    name: "Ngà Vàng",
    collection: "kim-lua",
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
    name: "Đêm Hoàng Kim",
    collection: "kim-lua",
    dark: true,
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
    name: "Chibi Đỏ",
    collection: "kim-lua",
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
    name: "Hoàng Gia Đỏ",
    collection: "kim-lua",
    dark: true,
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
    name: "Hồng Dịu Dàng",
    collection: "lang-man",
    script: true,
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
    name: "Hoàng Hôn Đào",
    collection: "lang-man",
    script: true,
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
    name: "Hồng Sâm Banh",
    collection: "lang-man",
    script: true,
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
    name: "Oải Hương",
    collection: "lang-man",
    script: true,
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
    name: "Hồng Nhẹ",
    collection: "lang-man",
    script: true,
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
    name: "Xanh Thanh Nhã",
    collection: "thien-nhien",
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
    name: "Baroque Đỏ Sẫm",
    collection: "kim-lua",
    dark: true,
    palette: {
      bg: "#2b0303",
      ink: "#ffefd6",
      soft: "rgba(255, 239, 214, 0.65)",
      accent: "#ffdfaf",
      seal: "#ffdfaf",
    },
    orn: "❦",
  },

  "song-hy-red": {
    name: "Song Hỷ Đỏ",
    collection: "thien-nhien",
    palette: {
      bg: "#fff7eb",
      ink: "#666666",
      soft: "#a52a2a",
      accent: "#fbbf24",
      seal: "#800000",
    },
    orn: "囍",
  },

  "to-duyen-xanh": {
    name: "Tơ Duyên Xanh",
    collection: "thien-nhien",
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
    name: "Trắng Hiện Đại",
    collection: "toi-gian",
    palette: {
      bg: "#ffffff",
      ink: "#2a2a2a",
      soft: "#8a8580",
      accent: "#7f151a",
      seal: "#7f151a",
    },
    orn: "囍",
  },
};

/*
 * Meta dự phòng — theme chưa đăng ký (hoặc dữ liệu cũ)
 * vẫn có nhận diện trung tính để gallery không vỡ.
 */
export const FALLBACK_META = {
  name: "Cổ Điển",
  collection: "kim-lua",
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
      name: "Bộ sưu tập",
      sub: "",
      swatches: [],
    }
  );
}
