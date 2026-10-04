const F = "src/views/WeddingIntro.vue";
module.exports = [
  [F, "                  tháng {{ mainEvent.Month }} {{ mainEvent.Year }}", `                  {{ $t("intro.monthYear", { month: mainEvent.Month, year: mainEvent.Year }) }}`],
  [F, "              Cập nhật {{ updatedLabel }}", `              {{ $t("intro.updated", { date: updatedLabel }) }}`],
  [F, "              Vì sao chọn {{ getThemeLabel(wedding) }}?", `              {{ $t("intro.whyChoose", { name: getThemeLabel(wedding) }) }}`],
  [F, ':alt="`Toàn cảnh mẫu thiệp cưới ${getThemeLabel(wedding)}`"', `:alt="$t('intro.fullViewAlt', { name: getThemeLabel(wedding) })"`],
  [F, "              Về mẫu {{ getThemeLabel(wedding) }}", `              {{ $t("intro.aboutTemplate", { name: getThemeLabel(wedding) }) }}`],
  [F, "          <h2>Thích mẫu {{ getThemeLabel(wedding) }}?</h2>", `          <h2>{{ $t("intro.likeIt", { name: getThemeLabel(wedding) }) }}</h2>`],
  [F, "              Mẫu thiệp cưới {{ getThemeLabel(wedding) }}", `              {{ $t("intro.templateNamed", { name: getThemeLabel(wedding) }) }}`],
];
