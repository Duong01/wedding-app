<template>
  <section class="bq-countdown">
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'countdown', 'Eyebrow')" class="bq-top-custom-head">
      <p v-if="sectionOverride(sections, 'countdown', 'Eyebrow')" class="bq-top-custom-head__eyebrow">{{ sectionOverride(sections, "countdown", "Eyebrow") }}</p>
    </header>

    <h2 class="bq-countdown__title">{{ sectionText(sections, "countdown", "Heading", $t("CÙNG ĐẾM NGƯỢC")) }}</h2>

    <p class="bq-countdown__value">
      {{ values[0].value }} ngày {{ values[1].value }} giờ
      {{ values[2].value }} phút {{ values[3].value }} giây
    </p>
  </section>
</template>

<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { computed, onMounted, onUnmounted, ref } from "vue";
import dayjs from "dayjs";
import { t } from "@/lang";
const props = defineProps({
  sections: { type: Object, default: () => ({}) },
  countdown: { type: [String, Date, Object], default: "" },
  weddingDate: { type: [String, Date], default: "" },
});

const now = ref(Date.now());

let timer;

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onUnmounted(() => window.clearInterval(timer));

const target = computed(
  () => props.countdown?.Target || props.countdown || props.weddingDate
);

const values = computed(() => {
  const seconds = Math.max(0, dayjs(target.value).diff(dayjs(now.value), "second"));

  return [
    [t("NGÀY"), Math.floor(seconds / 86400)],
    [t("GIỜ"), Math.floor((seconds % 86400) / 3600)],
    [t("PHÚT"), Math.floor((seconds % 3600) / 60)],
    [t("GIÂY"), seconds % 60],
  ].map(([label, value]) => ({
    label,
    value: String(value).padStart(2, "0"),
  }));
});
</script>

<style scoped>
.bq-countdown {
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  padding: 0 24px;

  text-align: center;

  color: var(--bq-ink);
}

.bq-countdown__title {
  margin: 0;

  color: var(--bq-ink);

  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 18px;
  font-weight: 400;

  letter-spacing: 0.02em;

  text-transform: uppercase;
}

.bq-countdown__value {
  margin: 8px 0 0;

  color: var(--bq-ink);

  font-family: var(--font-num, "Be Vietnam Pro", "Segoe UI", system-ui, sans-serif);
  font-size: 18px;
  font-weight: 600;

  font-variant-numeric: tabular-nums;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .bq-countdown__title,
  .bq-countdown__value {
    font-size: 20px;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.bq-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.bq-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.bq-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.bq-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
