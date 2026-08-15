import {
  computed,
} from "vue";


export function useWeddingTheme(wedding) {

  const theme = computed(() => {

    return wedding?.theme || {};

  });


  const themeStyle = computed(() => {

    const data = theme.value;

    const colors = data.colors || {};

    const fonts = data.fonts || {};

    const layout = data.layout || {};


    return {

      /* ====================================================
         COLORS
      ==================================================== */

      "--primary":
        colors.primary || "#7b0d0d",

      "--secondary":
        colors.secondary || "#9d2525",

      "--accent":
        colors.accent || "#c79d5c",

      "--accent-light":
        colors.accentLight || "#f7d8a3",

      "--background":
        colors.background || "#f8f5ed",

      "--background-secondary":
        colors.backgroundSecondary || "#eee8dc",

      "--text":
        colors.text || "#5c4d46",

      "--text-secondary":
        colors.textSecondary || "#806f66",

      "--white":
        colors.white || "#fffaf4",


      /* ====================================================
         DERIVED COLORS
      ==================================================== */

      "--surface":
        colors.white || "#fffdf9",

      "--heading":
        colors.primary || "#5d1717",


      /* ====================================================
         FONTS
      ==================================================== */

      "--font-main":
        fonts.main
          ? `"${fonts.main}", Georgia, serif`
          : '"Cormorant Garamond", Georgia, serif',

      "--font-heading":
        fonts.heading
          ? `"${fonts.heading}", Georgia, serif`
          : '"Cormorant Garamond", Georgia, serif',

      "--font-script":
        fonts.script
          ? `"${fonts.script}", cursive`
          : '"The Nautigal", cursive',


      /* ====================================================
         LEGACY
      ==================================================== */

      "--font-wedding":
        fonts.script
          ? `"${fonts.script}", cursive`
          : '"The Nautigal", cursive',

      "--gold":
        colors.accent || "#c79d5c",

      "--paper":
        colors.white || "#fffdf9",

      "--sub-text":
        colors.textSecondary || "#806f66",


      /* ====================================================
         LAYOUT
      ==================================================== */

      "--content-width":
        layout.maxWidth || "900px",

      "--section-padding":
        layout.sectionPadding || "80px",

    };

  });


  return {
    theme,
    themeStyle,
  };

}