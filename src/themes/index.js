import { defineAsyncComponent } from "vue";

/*
 * Danh sách theme dạng LAZY-LOAD:
 * mỗi theme được tách thành 1 chunk riêng, chỉ được tải về
 * khi trang thiệp cần hiển thị đúng theme đó.
 *
 * Giữ nguyên cách dùng cũ ở các nơi gọi `themes[tenTheme]`
 * (WeddingApi, WeddingDetail, EditorPreview, PreviewRenderer).
 */
const loadTheme = (loader) =>
  defineAsyncComponent({
    loader,

    // Tránh nhấp nháy khung loading nếu chunk tải quá nhanh
    delay: 200,
  });

const themes = {
  "traditional-red": loadTheme(() => import("./TraditionalRed.vue")),

  "romantic-pink": loadTheme(() => import("./RomanticPink.vue")),

  "modern-white": loadTheme(() => import("./ModernWhite.vue")),

  "elegant-gold": loadTheme(() => import("./ElegantGold.vue")),

  "nhat-binh-do": loadTheme(() => import("./NhatBinhDo.vue")),

  "ivory-gold": loadTheme(() => import("./IvoryGold.vue")),

  "royal-red": loadTheme(() => import("./RoyalRed.vue")),

  "dong-son": loadTheme(() => import("./DongSon.vue")),

  "serene-green": loadTheme(() => import("./SereneGreen.vue")),

  "sunset-peach": loadTheme(() => import("./SunsetPeach.vue")),

  "champagne-blush": loadTheme(() => import("./ChampagneBlush.vue")),

  "midnight-gold": loadTheme(() => import("./MidnightGold.vue")),

  "lavender-cream": loadTheme(() => import("./LavenderCream.vue")),

  "double-happiness": loadTheme(() => import("./DoubleHappiness.vue")),

  "boho-terracotta": loadTheme(() => import("./BohoTerracotta.vue")),

  "vintage-sepia": loadTheme(() => import("./VintageSepia.vue")),

  "ocean-breeze": loadTheme(() => import("./OceanBreeze.vue")),

  "emerald-luxe": loadTheme(() => import("./EmeraldLuxe.vue")),
};

export default themes;
