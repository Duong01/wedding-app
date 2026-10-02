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
    name: "Truyền thống Việt Nam",
    sub: "Đỏ son · chữ hỷ · trống đồng · long phụng",
    swatches: ["#7b0d0d", "#c79d5c", "#f6ecd9"],
  },
  {
    id: "lang-man",
    name: "Romantic / Lãng mạn",
    sub: "Hồng phấn · đào · oải hương · ruby",
    swatches: ["#c56f88", "#d67a63", "#a086b4"],
  },
  {
    id: "hien-dai",
    name: "Modern Luxury / Sang trọng hiện đại",
    sub: "Nền sẫm · foil vàng · nét mực tối giản",
    swatches: ["#2b2b2b", "#b8a07a", "#17121b"],
  },
  {
    id: "co-dien",
    name: "Elegant / Cổ điển châu Âu",
    sub: "Navy cổ điển · vàng đồng · ngà lụa",
    swatches: ["#2f3e5c", "#b58a45", "#faf8f3"],
  },
  {
    id: "nghe-thuat",
    name: "Watercolor / Nghệ thuật",
    sub: "Màu nước loang · hồng đào · phấn pastel",
    swatches: ["#8a4a5c", "#d98ca0", "#fdf8fa"],
  },
  {
    id: "thien-nhien",
    name: "Botanical / Thiên nhiên",
    sub: "Lá xanh · eucalyptus · đất nung",
    swatches: ["#3d5a47", "#7fa389", "#f5f8f4"],
  },
  {
    id: "a-dong",
    name: "Á Đông / Chinese-inspired",
    sub: "Đỏ thẫm · vàng kim · ngọc phượng · baroque",
    swatches: ["#6e1f24", "#d9a441", "#2b0303"],
  },
];

export const THEME_META = {
  /* =====================================================
     BỘ SƯU TẬP A — Á ĐÔNG SANG TRỌNG
  ====================================================== */

  "traditional-red": {
    name: "Đỏ Son Truyền Thống",
    collection: "truyen-thong",
    desc: "Đỏ son cổ điển, khung ảnh vòm và hoạ tiết song hỷ trang trọng.",
    tags: ["Truyền thống", "Đỏ son", "Song hỷ"],
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
    collection: "truyen-thong",
    desc: "Giấy kem ấm, chữ nâu cổ điển và điểm nhấn đỏ son — gợi áo nhật bình cổ trang.",
    tags: ["Cổ trang", "Đỏ son", "Giấy kem"],
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
    collection: "truyen-thong",
    desc: "Hoạ tiết trống đồng, nâu đất và vàng đồng đậm chất Việt cổ.",
    tags: ["Truyền thống", "Đất nung", "Trống đồng"],
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
    desc: "Chữ hỷ lớn giữa nền đỏ thẫm và vàng son rực rỡ.",
    tags: ["Truyền thống", "Đỏ thẫm", "Chữ hỷ"],
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
    desc: "Rồng phụng vàng kim trên nền đỏ thẫm — cổ điển và sang trọng.",
    tags: ["Cổ điển", "Đỏ thẫm", "Rồng phụng"],
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
    name: "Song Hỷ Đỏ",
    collection: "truyen-thong",
    desc: "Nền kem ấm, chữ hỷ đỏ son và điểm nhấn vàng đồng.",
    tags: ["Truyền thống", "Đỏ son", "Vàng đồng"],
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
    name: "Song Hạc Đỏ",
    collection: "truyen-thong",
    dark: true,
    isNew: true,
    desc: "Trăng soi đôi hạc, mây hoa và chữ hỷ trên nền đỏ thẫm.",
    tags: ["Truyền thống", "Đỏ thẫm", "Chim hạc"],
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
    name: "Vàng Sang Trọng",
    collection: "co-dien",
    desc: "Foil vàng trên nền ngà — thanh lịch kiểu châu Âu.",
    tags: ["Sang trọng", "Vàng kim", "Thanh lịch"],
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
    collection: "co-dien",
    desc: "Nền ngà mềm, hoa lụa và nét vàng đồng tinh tế.",
    tags: ["Thanh lịch", "Ngà", "Lụa"],
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
    collection: "hien-dai",
    dark: true,
    desc: "Nền sẫm như đêm, foil vàng le lói — sang trọng mà bí ẩn.",
    tags: ["Sang trọng", "Nền sẫm", "Vàng kim"],
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
    collection: "thien-nhien",
    desc: "Minh hoạ chibi đáng yêu trên nền kem ấm — vui tươi, cá tính.",
    tags: ["Dễ thương", "Minh hoạ", "Kem"],
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
    collection: "a-dong",
    dark: true,
    desc: "Đỏ thẫm hoàng gia với khung tranh vàng kim.",
    tags: ["Sang trọng", "Đỏ thẫm", "Vàng kim"],
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
    desc: "Hồng anh đào mềm mại cùng chữ viết tay lãng mạn.",
    tags: ["Lãng mạn", "Hồng", "Chữ tay"],
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
    desc: "Tông đào cam ấm áp như một buổi hoàng hôn.",
    tags: ["Lãng mạn", "Đào", "Ấm áp"],
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
    desc: "Hồng sâm banh pha nền kem — ngọt ngào, tinh tế.",
    tags: ["Lãng mạn", "Sâm banh", "Kem"],
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
    desc: "Tím oải hương nhẹ nhàng trên nền kem.",
    tags: ["Lãng mạn", "Oải hương", "Tím"],
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
    desc: "Hồng phấn tinh khôi với khoảng trắng rộng.",
    tags: ["Lãng mạn", "Hồng phấn", "Tinh khôi"],
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
    desc: "Xanh lá thanh bình, gần gũi thiên nhiên.",
    tags: ["Thiên nhiên", "Xanh lá", "Thanh bình"],
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
    collection: "thien-nhien",
    dark: true,
    isNew: true,
    desc: "Nền đỏ sẫm, hoa văn baroque và vàng đồng.",
    tags: ["Cổ điển", "Đỏ sẫm", "Baroque"],
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
    name: "Tơ Duyên Xanh",
    collection: "thien-nhien",
    isNew: true,
    desc: "Xanh rêu dịu, hoa rum trắng và nét tơ duyên mềm mại.",
    tags: ["Thiên nhiên", "Xanh rêu", "Tinh giản"],
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
    collection: "hien-dai",
    isNew: true,
    desc: "Nền trắng tinh, nét mực gọn và một điểm đỏ nhấn.",
    tags: ["Tối giản", "Trắng", "Hiện đại"],
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
    name: "Màu Nước Hồng",
    collection: "nghe-thuat",
    script: true,
    isNew: true,
    desc: "Nước màu hồng đào loang nhẹ như tranh vẽ tay — mềm mại và nghệ thuật.",
    tags: ["Màu nước", "Hồng đào", "Nghệ thuật"],
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
    name: "Lá Botanical",
    collection: "thien-nhien",
    isNew: true,
    desc: "Lá eucalyptus xanh mướt trên nền giấy sáng — gần gũi thiên nhiên.",
    tags: ["Botanical", "Xanh lá", "Eucalyptus"],
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
    name: "Xanh Chateau",
    collection: "co-dien",
    isNew: true,
    desc: "Navy cổ điển châu Âu điểm vàng đồng — trang nhã như lâu đài Pháp.",
    tags: ["Cổ điển", "Navy", "Vàng đồng"],
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
    name: "Ngọc Phượng",
    collection: "a-dong",
    isNew: true,
    desc: "Đỏ thẫm pha vàng kim, hoạ tiết phượng hoàng đậm chất Á Đông.",
    tags: ["Á Đông", "Đỏ thẫm", "Vàng kim"],
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
    name: "Noir Hiện Đại",
    collection: "hien-dai",
    isNew: true,
    desc: "Nền than tối giản với foil champagne — sang trọng, hiện đại.",
    tags: ["Sang trọng", "Nền tối", "Champagne"],
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
    name: "Ruby Lãng Mạn",
    collection: "lang-man",
    script: true,
    isNew: true,
    desc: "Đỏ ruby đậm cùng tim hồng — lãng mạn, nồng nàn.",
    tags: ["Lãng mạn", "Ruby", "Đỏ hồng"],
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
  name: "Cổ Điển",
  collection: "co-dien",
  desc: "Thiết kế cổ điển với bảng màu ấm áp, dễ tùy chỉnh cho ngày cưới của bạn.",
  tags: ["Cổ điển"],
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
