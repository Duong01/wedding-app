import {
  computed,
} from "vue";


export function useWeddingTheme(wedding) {

  const theme = computed(() => {

    return wedding?.theme || {};

  });


  const themeStyle = computed(() => {

    const data = theme.value;

    /*
     * Model / Editor Store lưu PascalCase
     * (Colors, Fonts, Layout) — xem
     * src/stores/weddingEditor.js.
     *
     * Vẫn chấp nhận lowercase để tương thích
     * ngược với dữ liệu cũ.
     */
    const colors =
      data.Colors || data.colors || {};

    const fonts =
      data.Fonts || data.fonts || {};

    const layout =
      data.Layout || data.layout || {};

    /*
     * Dữ liệu cũ (mock, thiệp lưu sớm) có chỗ lưu URL ảnh
     * vào trường màu — vd Colors.Background là link pexels.
     * URL không phải màu: gán vào biến thì mọi chỗ viết
     * `background-color: var(--background, ...)` thành giá
     * trị vô hiệu lúc tính toán → nền TRONG SUỐT (fallback
     * sau var() không có tác dụng vì biến vẫn được định
     * nghĩa).
     *
     * Gặp URL thì trả về undefined — Vue bỏ qua thuộc tính
     * style có giá trị undefined, biến không được gán, và
     * fallback ngay trong CSS của TỪNG THEME (màu thiết kế
     * đúng của theme đó) tự có hiệu lực.
     */
    const isImageUrl = (value) =>
      typeof value === "string" &&
      /^(https?:|data:|url\()/i.test(value.trim());

    const pickColor = (value, fallback) =>
      isImageUrl(value) ? undefined : value || fallback;

    const primary =
      pickColor(colors.Primary || colors.primary, "#7b0d0d");

    const accent =
      pickColor(colors.Accent || colors.accent, "#c79d5c");

    const white =
      pickColor(colors.White || colors.white, "#fffaf4");

    const textSecondary =
      pickColor(colors.TextSecondary || colors.textSecondary, "#806f66");

    return {

      /* ====================================================
         COLORS
      ==================================================== */

      "--primary": primary,

      "--secondary":
        pickColor(colors.Secondary || colors.secondary, "#9d2525"),

      "--accent": accent,

      "--accent-light":
        pickColor(colors.AccentLight || colors.accentLight, "#f7d8a3"),

      "--background":
        pickColor(colors.Background || colors.background, "#f8f5ed"),

      "--background-secondary":
        pickColor(
          colors.BackgroundSecondary || colors.backgroundSecondary,
          "#eee8dc"
        ),

      "--text":
        pickColor(colors.Text || colors.text, "#5c4d46"),

      "--text-secondary": textSecondary,

      "--white": white,

      /* ====================================================
         DERIVED COLORS
      ==================================================== */

      "--surface": white,

      "--heading": primary,

      /* ====================================================
         FONTS
      ==================================================== */

      "--font-main":
        fonts.Main || fonts.main
          ? `"${fonts.Main || fonts.main}", Georgia, serif`
          : '"Cormorant Garamond", Georgia, serif',

      "--font-heading":
        fonts.Heading || fonts.heading
          ? `"${fonts.Heading || fonts.heading}", Georgia, serif`
          : '"Cormorant Garamond", Georgia, serif',

      "--font-script":
        fonts.Script || fonts.script
          ? `"${fonts.Script || fonts.script}", cursive`
          : '"Allura", cursive',

      /* ====================================================
         LEGACY
      ==================================================== */

      "--font-wedding":
        fonts.Heading || fonts.heading
          ? `"${fonts.Heading || fonts.heading}", Georgia, serif`
          : '"Cormorant Garamond", Georgia, serif',

      "--gold": accent,

      "--paper": white,

      "--sub-text": textSecondary,

      /* ====================================================
         LAYOUT
      ==================================================== */

      "--content-width":
        layout.MaxWidth || layout.maxWidth || "900px",

      "--section-padding":
        layout.SectionPadding || layout.sectionPadding || "80px",

    };

  });


  return {
    theme,
    themeStyle,
  };

}