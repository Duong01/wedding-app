import TraditionalRed from "./TraditionalRed.vue";
import RomanticPink from "./RomanticPink.vue";
import ModernMinimal from "./ModernMinimal.vue";
import ElegantGold from "./ElegantGold.vue";


const themes = {
  "traditional-red": TraditionalRed,

  "romantic-pink": RomanticPink,

  "modern-minimal": ModernMinimal,

  "elegant-gold": ElegantGold,
};


export function getWeddingTheme(theme) {

  return (
    themes[theme] ||
    themes["traditional-red"]
  );

}


export default themes;