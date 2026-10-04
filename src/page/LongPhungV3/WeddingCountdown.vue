<template>
  <section class="lp-countdown">
    <div class="lp-section-title">
      <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
      <header v-if="sectionOverride(sections, 'countdown', 'Eyebrow')" class="lp-top-custom-head">
        <p v-if="sectionOverride(sections, 'countdown', 'Eyebrow')" class="lp-top-custom-head__eyebrow">{{ sectionOverride(sections, "countdown", "Eyebrow") }}</p>
      </header>

      <h2>{{ sectionText(sections, "countdown", "Heading", "ĐẾM NGƯỢC NGÀY VUI") }}</h2>
    </div>

    <div class="lp-countdown__grid">
      <article v-for="item in values" :key="item.label" class="lp-countdown__item">
        <b>{{ item.value }}</b>
        <span>{{ item.label }}</span>
      </article>
    </div>
  </section>
</template>

<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { computed, onMounted, onUnmounted, ref } from "vue";
import dayjs from "dayjs";

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

const target = computed(() => props.countdown?.Target || props.countdown || props.weddingDate);

const values = computed(() => {
  const seconds = Math.max(0, dayjs(target.value).diff(dayjs(now.value), "second"));

  return [
    ["NGÀY", Math.floor(seconds / 86400)],
    ["GIỜ", Math.floor((seconds % 86400) / 3600)],
    ["PHÚT", Math.floor((seconds % 3600) / 60)],
    ["GIÂY", seconds % 60],
  ].map(([label, value]) => ({
    label,
    value: String(value).padStart(2, "0"),
  }));
});
</script>

<style scoped>
.lp-countdown {
  position: relative;

  text-align: center;

  color: var(--tc-ffbe89, #ffbe89);

  padding: 30px 18px 10px;
}

/* Tiêu đề có khung frame-title */
.lp-section-title {
  width: fit-content;
  max-width: 100%;

  margin: 0 auto 20px;

  border-style: solid;
  border-color: transparent;
  border-width: 18px;

  border-image-source: url("@/assets/decor/longphung-v3/frame-title.svg");
  border-image-slice: 31;
  border-image-repeat: stretch;

  text-align: center;
}

.lp-section-title h2 {
  margin: 0;

  font-family: "Times New Roman", Times, serif;

  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.05em;

  color: var(--tc-ffbe89, #ffbe89);
}

.lp-countdown__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;

  max-width: 480px;

  margin: 0 auto;
}

.lp-countdown__item {
  padding: 16px 2px;

  border: 1px solid rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.4);
  border-radius: 10px;

  background: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.08);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.lp-countdown__item b {
  font-family: var(--font-num, "Be Vietnam Pro", "Segoe UI", system-ui, sans-serif);

  font-size: clamp(22px, 6vw, 30px);
  font-weight: 600;

  color: var(--tc-ffbe89, #ffbe89);
}

.lp-countdown__item span {
  font-size: 11px;

  letter-spacing: 0.16em;

  text-transform: uppercase;

  opacity: 0.7;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.lp-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.lp-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: var(--tc-ffbe89, #ffbe89);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.lp-top-custom-head__heading {
  margin: 0;
  color: var(--tc-ffbe89, #ffbe89);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.lp-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.85);
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
