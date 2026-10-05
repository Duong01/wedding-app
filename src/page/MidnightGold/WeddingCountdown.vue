<template>
  <section class="mg-countdown">
    <p class="mg-eyebrow">{{ sectionText(sections, "countdown", "Eyebrow", $t("NGÀY VUI ĐANG ĐẾN GẦN")) }}</p>

    <h2>{{ sectionText(sections, "countdown", "Heading", $t("Đếm ngược")) }}</h2>

    <div class="mg-countdown__grid">
      <article v-for="item in values" :key="item.label" class="mg-countdown__item">
        <b>{{ item.value }}</b>
        <span>{{ item.label }}</span>
      </article>
    </div>
  </section>
</template>

<script setup>
import { sectionText } from "@/data/sectionTitles";
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

const target = computed(() => props.countdown?.Target || props.countdown || props.weddingDate);

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
.mg-countdown {
  text-align: center;

  color: var(--tc-f0e6d2, #f0e6d2);
}

.mg-eyebrow {
  margin: 0;

  color: var(--tc-d8b676, #d8b676);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.mg-countdown h2 {
  margin: 6px 0 18px;

  font-family: "Allura", cursive;

  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: var(--tc-d8b676, #d8b676);
}

.mg-countdown__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.mg-countdown__item {
  padding: 16px 2px;

  border: 1px solid rgba(var(--tc-d8b676-rgb, 216, 182, 118), 0.28);
  border-radius: 16px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.02));

  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.4);
}

.mg-countdown__item b {
  display: block;

  font-family: var(--font-num, "Be Vietnam Pro", "Segoe UI", system-ui, sans-serif);

  color: var(--tc-d8b676, #d8b676);

  font-size: clamp(22px, 7vw, 30px);
  font-weight: 600;

  margin-bottom: 4px;
}

.mg-countdown__item span {
  font-size: 10px;

  letter-spacing: 0.14em;

  color: var(--tc-b9a88f, #b9a88f);
}
</style>
