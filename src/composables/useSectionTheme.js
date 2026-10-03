import { computed, toValue } from "vue";

import { DEFAULT_PALETTE, THEME_PALETTES } from "@/data/themePalettes";

/*
 * =========================================================
 * MÀU CHO CÁC MỤC DÙNG CHUNG (GAME / VIDEO)
 * =========================================================
 * GameSection / VideoSection là 1 component dùng chung cho
 * cả 26 theme, style qua biến CSS (--primary, --white...).
 *
 * Chỉ 11 theme có pipeline màu (useWeddingTheme gắn biến
 * lên wrapper). 15 theme còn lại (ChateauBlue, ModernNoir,
 * DongSon...) hardcode màu trong CSS — biến không tồn tại
 * nên game rơi về bảng :root của theme.css (đỏ son truyền
 * thống): vòng quay đỏ giữa thiệp xanh, nút đỏ trong thiệp
 * noir.
 *
 * Composable này cho section TỰ gắn bảng màu của thiệp lên
 * gốc section mình (scoped — không đụng wrapper theme):
 *
 *   THEME_PALETTES[theme.Name] làm nền, đè lên bằng
 *   theme.Colors chủ thiệp chỉnh trong editor (bỏ qua ô
 *   trống và URL ảnh — dữ liệu cũ từng lưu nhầm URL vào
 *   trường màu, gán vào biến CSS làm nền trong suốt).
 *
 * Wrapper đã có biến thì giá trị trùng nhau — gắn lại vô hại.
 *
 * LƯU Ý MỰC TRÊN CARD: bảng màu một số theme nền tối
 * (SongHacRed, BohoTerracotta, DoubleHappiness...) có
 * Text là màu kem — đặt lên card sáng (White) là tàng hình.
 * --card-ink luôn là màu TỐI đã kiểm tra tương phản với
 * White (≥ 7:1) để chữ trong card game luôn đọc được.
 */
const CARD_INKS = {
  "song-hac-red": "#3d0a0a",
  "boho-terracotta": "#3d0a0a",
  "double-happiness": "#4a0d10",
  "long-phung-v3": "#4a0d10",
  "dong-son": "#3d2b22",
  "midnight-gold": "#2e2630",
};

const FALLBACK_CARD_INK = "#5c4d46";

const isImageUrl = (value) =>
  typeof value === "string" && /^(https?:|data:|url\()/i.test(value.trim());

export function useSectionTheme(wedding) {
  const themeName = computed(() => {
    const data = toValue(wedding);

    return data?.theme?.Name || data?.theme?.name || "";
  });

  const palette = computed(() => {
    const data = toValue(wedding);

    const base = THEME_PALETTES[themeName.value] || DEFAULT_PALETTE;

    const colors = data?.theme?.Colors || data?.theme?.colors;

    if (!colors) {
      return base;
    }

    /*
     * Bảng màu gốc của mẫu làm nền — Colors chỉ đè lên những
     * ô thực sự hợp lệ (có giá trị, không phải URL ảnh).
     */
    const merged = { ...base };

    for (const [key, value] of Object.entries(colors)) {
      if (typeof value === "string" && value.trim() && !isImageUrl(value)) {
        merged[key] = value;
      }
    }

    return merged;
  });

  /*
   * Mực chữ tối cho card sáng — theme nền tối có Text màu
   * kem, dùng thẳng là tàng hình trên card White.
   */
  const cardInk = computed(
    () => CARD_INKS[themeName.value] || palette.value.Text || FALLBACK_CARD_INK
  );

  const sectionStyle = computed(() => {
    const p = palette.value;

    const pick = (value, fallback) => value || fallback;

    return {
      "--primary": pick(p.Primary || p.primary, "#7b0d0d"),
      "--secondary": pick(p.Secondary || p.secondary, "#9d2525"),
      "--accent": pick(p.Accent || p.accent, "#c79d5c"),
      "--accent-light": pick(p.AccentLight || p.accentLight, "#f7d8a3"),
      "--background": pick(p.Background || p.background, "#f8f5ed"),
      "--background-secondary": pick(
        p.BackgroundSecondary || p.backgroundSecondary,
        "#eee8dc"
      ),
      "--text": pick(p.Text || p.text, "#5c4d46"),
      "--text-secondary": pick(p.TextSecondary || p.textSecondary, "#806f66"),
      "--white": pick(p.White || p.white, "#fffaf4"),
      "--heading": pick(p.Primary || p.primary, "#7b0d0d"),
      "--card-ink": cardInk.value,
    };
  });

  return {
    themeName,
    palette,
    cardInk,
    sectionStyle,
  };
}
