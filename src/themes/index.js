import { defineAsyncComponent } from "vue";

/*
 * Lazy-load từng theme: mỗi thiệp chỉ tải đúng component của theme
 * đang mở thay vì import tĩnh toàn bộ 19 theme (mỗi theme ~12 section
 * component) ngay từ đầu. Consumer dùng `themes[name]` + `<component :is>`
 * nên không cần thay đổi gì.
 */
const themes = {
  "traditional-red": defineAsyncComponent(() => import("./TraditionalRed.vue")),

  "romantic-pink": defineAsyncComponent(() => import("./RomanticPink.vue")),

  "modern-white": defineAsyncComponent(() => import("./ModernWhite.vue")),

  "elegant-gold": defineAsyncComponent(() => import("./ElegantGold.vue")),

  "nhat-binh-do": defineAsyncComponent(() => import("./NhatBinhDo.vue")),

  "ivory-gold": defineAsyncComponent(() => import("./IvoryGold.vue")),

  "royal-red": defineAsyncComponent(() => import("./RoyalRed.vue")),

  "dong-son": defineAsyncComponent(() => import("./DongSon.vue")),

  "serene-green": defineAsyncComponent(() => import("./SereneGreen.vue")),

  "sunset-peach": defineAsyncComponent(() => import("./SunsetPeach.vue")),

  "champagne-blush": defineAsyncComponent(() => import("./ChampagneBlush.vue")),

  "midnight-gold": defineAsyncComponent(() => import("./MidnightGold.vue")),

  "lavender-cream": defineAsyncComponent(() => import("./LavenderCream.vue")),

  "double-happiness": defineAsyncComponent(() => import("./DoubleHappiness.vue")),

  "boho-terracotta": defineAsyncComponent(() => import("./BohoTerracotta.vue")),

  "song-hy-red": defineAsyncComponent(() => import("./SongHyRed.vue")),

  "to-duyen-xanh": defineAsyncComponent(() => import("./ToDuyenXanh.vue")),

  "long-phung-v3": defineAsyncComponent(() => import("./LongPhungV3.vue")),

  "emerald-luxe": defineAsyncComponent(() => import("./EmeraldLuxe.vue"))
};

export default themes;
