<template>
  <section class="bl-countdown">
    <p v-if="eyebrow" class="bl-eyebrow">{{ eyebrow }}</p>

    <h2>{{ heading }}</h2>

    <div class="bl-countdown__grid">
      <article v-for="item in values" :key="item.label" class="bl-countdown__item">
        <b>{{ item.value }}</b>
        <span>{{ item.label }}</span>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import dayjs from "dayjs";

import { sectionText } from "@/data/sectionTitles";

const props = defineProps({
  countdown: { type: [String, Date, Object], default: "" },
  weddingDate: { type: [String, Date], default: "" },
  sections: { type: Object, default: () => ({}) },
});

const eyebrow = computed(() =>
  sectionText(props.sections, "countdown", "Eyebrow", "NGÀY VUI ĐANG ĐẾN GẦN")
);

const heading = computed(() =>
  sectionText(props.sections, "countdown", "Heading", "Đếm ngược")
);

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
.bl-countdown {
  text-align: center;

  color: var(--tc-3d5a47, #3d5a47);
}

.bl-eyebrow {
  margin: 0;

  color: var(--tc-4a6653, #4a6653);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.bl-countdown h2 {
  margin: 6px 0 18px;

  font-family: "Allura", cursive;

  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: var(--tc-3d5a47, #3d5a47);
}

.bl-countdown__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.bl-countdown__item {
  padding: 16px 2px;

  border: 1px solid rgba(var(--tc-7fa389-rgb, 127, 163, 137), 0.35);
  border-radius: 16px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.8), rgba(var(--tc-f4faf5-rgb, 244, 250, 245), 0.65));

  box-shadow: 0 8px 22px rgba(var(--tc-3d5a47-rgb, 61, 90, 71), 0.07);
}

.bl-countdown__item b {
  display: block;

  font-family: var(--font-num, "Be Vietnam Pro", "Segoe UI", system-ui, sans-serif);

  color: var(--tc-3d5a47, #3d5a47);

  font-size: clamp(22px, 7vw, 30px);
  font-weight: 600;

  margin-bottom: 4px;
}

.bl-countdown__item span {
  font-size: 10px;

  letter-spacing: 0.14em;

  color: var(--tc-4a6653, #4a6653);
}
</style>
