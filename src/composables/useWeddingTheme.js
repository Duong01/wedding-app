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


    return {

      /* ====================================================
         COLORS
      ==================================================== */

      "--primary":
        colors.Primary || colors.primary || "#7b0d0d",

      "--secondary":
        colors.Secondary || colors.secondary || "#9d2525",

      "--accent":
        colors.Accent || colors.accent || "#c79d5c",

      "--accent-light":
        colors.AccentLight || colors.accentLight || "#f7d8a3",

      "--background":
        colors.Background || colors.background || "#f8f5ed",

      "--background-secondary":
        colors.BackgroundSecondary ||
        colors.backgroundSecondary ||
        "#eee8dc",

      "--text":
        colors.Text || colors.text || "#5c4d46",

      "--text-secondary":
        colors.TextSecondary || colors.textSecondary || "#806f66",

      "--white":
        colors.White || colors.white || "#fffaf4",


      /* ====================================================
         DERIVED COLORS
      ==================================================== */

      "--surface":
        colors.White || colors.white || "#fffdf9",

      "--heading":
        colors.Primary || colors.primary || "#5d1717",


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

      "--gold":
        colors.Accent || colors.accent || "#c79d5c",

      "--paper":
        colors.White || colors.white || "#fffdf9",

      "--sub-text":
        colors.TextSecondary || colors.textSecondary || "#806f66",


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