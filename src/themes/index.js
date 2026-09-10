import TraditionalRed from "./TraditionalRed.vue";
import RomanticPink from "./RomanticPink.vue";
import ModernWhite from "./ModernWhite.vue";
import ElegantGold from "./ElegantGold.vue";
import NhatBinhDo from "./NhatBinhDo.vue";
import IvoryGold from "./IvoryGold.vue";
import RoyalRed from "./RoyalRed.vue";
import DongSon from "./DongSon.vue";
import SereneGreen from "./SereneGreen.vue";
import SunsetPeach from "./SunsetPeach.vue";
import ChampagneBlush from "./ChampagneBlush.vue";
import MidnightGold from "./MidnightGold.vue";
import LavenderCream from "./LavenderCream.vue";


const themes = {
  "traditional-red": TraditionalRed,

  "romantic-pink": RomanticPink,

  "modern-white": ModernWhite,

  "elegant-gold": ElegantGold,

  "nhat-binh-do": NhatBinhDo,

  "ivory-gold": IvoryGold,

  "royal-red": RoyalRed,

  "dong-son": DongSon,

  "serene-green": SereneGreen,

  "sunset-peach": SunsetPeach,

  "champagne-blush": ChampagneBlush,

  "midnight-gold": MidnightGold,

  "lavender-cream": LavenderCream,
};


export function getWeddingTheme(theme) {

  return (
    themes[theme] ||
    themes["traditional-red"]
  );

}


export default themes;