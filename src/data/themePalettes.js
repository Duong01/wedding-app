/*
 * =====================================================
 * BẢNG MÀU MẶC ĐỊNH THEO TỪNG MẪU THIỆP
 * =====================================================
 * Trước đây init() luôn gán bảng màu traditional-red
 * cho MỌI mẫu — mở editor từ mẫu romantic-pink thì
 * thiệp vẫn mang màu đỏ sẫm, các theme đọc biến
 * --primary/--accent (RomanticPink, ModernWhite,
 * SongHyRed...) hiển thị sai hoàn toàn.
 *
 * Mỗi mẫu giờ có bộ màu riêng, khớp với bản demo
 * (src/mock/wedding.json) và với màu gốc của theme.
 * Theme hardcode màu trong CSS (DongSon, IvoryGold...)
 * không đọc các biến này nhưng vẫn giữ cho dữ liệu
 * nhất quán khi lưu lên API.
 *
 * Tách khỏi stores/weddingEditor.js để các component
 * dùng chung (GameSection, VideoSection...) import
 * được mà không kéo cả editor store vào bundle trang
 * khách mời.
 */
export const THEME_PALETTES = {
  "traditional-red": {
    Primary: "#7b0d0d",
    Secondary: "#9d2525",
    Accent: "#c79d5c",
    AccentLight: "#f7d8a3",
    Background: "#f8f5ed",
    BackgroundSecondary: "#eee8dc",
    Text: "#5c4d46",
    TextSecondary: "#73645c",
    White: "#fffaf4",
  },

  "romantic-pink": {
    Primary: "#cb5d6c",
    Secondary: "#933845",
    Accent: "#cb5d6c",
    AccentLight: "#f6dfe2",
    Background: "#fdf3f4",
    BackgroundSecondary: "#f6dfe2",
    Text: "#933845",
    TextSecondary: "#984651",
    White: "#ffffff",
  },

  "elegant-gold": {
    Primary: "#d70c1b",
    Secondary: "#a30a15",
    Accent: "#d70c1b",
    AccentLight: "#fdecee",
    Background: "#ffffff",
    BackgroundSecondary: "#fdecee",
    Text: "#000000",
    TextSecondary: "#4a4a4a",
    White: "#ffffff",
  },

  "modern-white": {
    Primary: "#486c7d",
    Secondary: "#3a5666",
    Accent: "#a4c4d4",
    AccentLight: "#e8f0f4",
    Background: "#ffffff",
    BackgroundSecondary: "#e8f0f4",
    Text: "#3a5666",
    TextSecondary: "#566a76",
    White: "#ffffff",
  },

  "nhat-binh-do": {
    Primary: "#9c1f2c",
    Secondary: "#560207",
    Accent: "#9c1f2c",
    AccentLight: "#f6ecd9",
    Background: "#fbf8f3",
    BackgroundSecondary: "#f6ecd9",
    Text: "#560207",
    TextSecondary: "#9c1f2c",
    White: "#ffffff",
  },

  "royal-red": {
    Primary: "#5c080c",
    Secondary: "#8c171b",
    Accent: "#d0a85c",
    AccentLight: "#f4dca5",
    Background: "#f4eee2",
    BackgroundSecondary: "#e7decd",
    Text: "#49352d",
    TextSecondary: "#6d5a51",
    White: "#fff9ed",
  },

  "dong-son": {
    Primary: "#762d1f",
    Secondary: "#984a32",
    Accent: "#b9824b",
    AccentLight: "#e3c18d",
    Background: "#24100e",
    BackgroundSecondary: "#e5d8c4",
    Text: "#f3ead8",
    TextSecondary: "#d4a35f",
    White: "#fffaf1",
  },

  "ivory-gold": {
    Primary: "#6f2528",
    Secondary: "#91484a",
    Accent: "#c9a66b",
    AccentLight: "#f0ddb5",
    Background: "#fffdf8",
    BackgroundSecondary: "#f0ebe0",
    Text: "#51433c",
    TextSecondary: "#6f635b",
    White: "#fffdf8",
  },

  "serene-green": {
    Primary: "#28514b",
    Secondary: "#6c8e7a",
    Accent: "#c8d4c3",
    AccentLight: "#edf4eb",
    Background: "#f5f8f4",
    BackgroundSecondary: "#e8efe6",
    Text: "#2e3834",
    TextSecondary: "#5d6962",
    White: "#ffffff",
  },

  "sunset-peach": {
    Primary: "#7a4a3d",
    Secondary: "#d67a63",
    Accent: "#f4c6a9",
    AccentLight: "#fbe5d5",
    Background: "#fffaf5",
    BackgroundSecondary: "#fdeee4",
    Text: "#523835",
    TextSecondary: "#836159",
    White: "#ffffff",
  },

  "champagne-blush": {
    Primary: "#6c4b4a",
    Secondary: "#b67f7d",
    Accent: "#ead2b6",
    AccentLight: "#f7ebdf",
    Background: "#fffaf7",
    BackgroundSecondary: "#f4eee8",
    Text: "#453533",
    TextSecondary: "#7a6662",
    White: "#ffffff",
  },

  "midnight-gold": {
    Primary: "#261d23",
    Secondary: "#9b7d4d",
    Accent: "#d8b676",
    AccentLight: "#f1e0b8",
    Background: "#17121b",
    BackgroundSecondary: "#f1ebe0",
    Text: "#f0e6d2",
    TextSecondary: "#b9a88f",
    White: "#ffffff",
  },

  "lavender-cream": {
    Primary: "#584a5b",
    Secondary: "#a086b4",
    Accent: "#d8c0de",
    AccentLight: "#f2e7f6",
    Background: "#faf8fc",
    BackgroundSecondary: "#f1ebf4",
    Text: "#433846",
    TextSecondary: "#716275",
    White: "#ffffff",
  },

  "double-happiness": {
    Primary: "#7a1216",
    Secondary: "#a32a2a",
    Accent: "#d9a441",
    AccentLight: "#f3d9a4",
    Background: "#5c0e10",
    BackgroundSecondary: "#6b1013",
    Text: "#f7e6c4",
    TextSecondary: "#d9b98a",
    White: "#fdf6ec",
  },

  "boho-terracotta": {
    Primary: "#511419",
    Secondary: "#7a1f24",
    Accent: "#ffdfaf",
    AccentLight: "#ffe9c9",
    Background: "#2b0303",
    BackgroundSecondary: "#3a0607",
    Text: "#ffefd6",
    TextSecondary: "#e8cfa8",
    White: "#fff6e6",
  },

  "song-hy-red": {
    Primary: "#800000",
    Secondary: "#a52a2a",
    Accent: "#fbbf24",
    AccentLight: "#ffeed2",
    Background: "#fff7eb",
    BackgroundSecondary: "#f7ead9",
    Text: "#666666",
    TextSecondary: "#800000",
    White: "#ffffff",
  },

  "song-hac-red": {
    Primary: "#920002",
    Secondary: "#990000",
    Accent: "#ffe8a4",
    AccentLight: "#ffe8a4",
    Background: "#920002",
    BackgroundSecondary: "#990000",
    Text: "#ffe8a4",
    TextSecondary: "#001232",
    White: "#f6efea",
  },

  "to-duyen-xanh": {
    Primary: "#5e813c",
    Secondary: "#1a3500",
    Accent: "#d1db9c",
    AccentLight: "#f3dfc5",
    Background: "#fefbf4",
    BackgroundSecondary: "#f7f3e6",
    Text: "#1a3500",
    TextSecondary: "#557436",
    White: "#ffffff",
  },

  "emerald-luxe": {
    Primary: "#4c2d1f",
    Secondary: "#e1c490",
    Accent: "#e1c490",
    AccentLight: "#f3ddb8",
    Background: "#fef0e0",
    BackgroundSecondary: "#f7e6cd",
    Text: "#4c2d1f",
    TextSecondary: "#624537",
    White: "#fffaf2",
  },

  "long-phung-v3": {
    Primary: "#7a0014",
    Secondary: "#710001",
    Accent: "#ffbe89",
    AccentLight: "#f3dfc5",
    Background: "#7a0014",
    BackgroundSecondary: "#710001",
    Text: "#ffbe89",
    TextSecondary: "#d4af37",
    White: "#fff4de",
  },

  "watercolor-blush": {
    Primary: "#8a4a5c",
    Secondary: "#b06a80",
    Accent: "#d98ca0",
    AccentLight: "#f2ccd8",
    Background: "#fdf8fa",
    BackgroundSecondary: "#fdeff3",
    Text: "#5a3f4a",
    TextSecondary: "#a06a7c",
    White: "#ffffff",
  },

  "botanical-leaf": {
    Primary: "#3d5a47",
    Secondary: "#57806a",
    Accent: "#7fa389",
    AccentLight: "#cfe3d2",
    Background: "#f9fbf9",
    BackgroundSecondary: "#f0f6f1",
    Text: "#2f3a33",
    TextSecondary: "#5a7362",
    White: "#ffffff",
  },

  "chateau-blue": {
    Primary: "#2f3e5c",
    Secondary: "#5c6d8f",
    Accent: "#b58a45",
    AccentLight: "#ccd6e8",
    Background: "#fafbfd",
    BackgroundSecondary: "#eef1f8",
    Text: "#2c3242",
    TextSecondary: "#5a6378",
    White: "#ffffff",
  },

  "jade-phoenix": {
    Primary: "#6e1f24",
    Secondary: "#8a3a40",
    Accent: "#b98a4b",
    AccentLight: "#e8c98a",
    Background: "#fdfaf3",
    BackgroundSecondary: "#f3e3c4",
    Text: "#4a2328",
    TextSecondary: "#7a3a3f",
    White: "#fffdf8",
  },

  "modern-noir": {
    Primary: "#3a3a3a",
    Secondary: "#6b6b6b",
    Accent: "#b8a07a",
    AccentLight: "#dcc9a4",
    Background: "#fbf8f0",
    BackgroundSecondary: "#f4ead4",
    Text: "#2b2b2b",
    TextSecondary: "#5c5c5c",
    White: "#ffffff",
  },

  "ruby-romance": {
    Primary: "#8c2f42",
    Secondary: "#b04a62",
    Accent: "#c46a7e",
    AccentLight: "#e8b4be",
    Background: "#fdf7f8",
    BackgroundSecondary: "#fce8ec",
    Text: "#5c2430",
    TextSecondary: "#7a4450",
    White: "#ffffff",
  },
};

export const DEFAULT_PALETTE = THEME_PALETTES["traditional-red"];
