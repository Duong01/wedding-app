<template>
  <section class="sg-countdown">
    <p class="sg-eyebrow">{{ sectionText(sections, "countdown", "Eyebrow", $t("NGÀY VUI ĐANG ĐẾN GẦN")) }}</p>

    <h2>{{ sectionText(sections, "countdown", "Heading", $t("Đếm ngược")) }}</h2>

    <div class="sg-countdown__grid">
      <article v-for="item in values" :key="item.label" class="sg-countdown__item">
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
.sg-countdown {
  text-align: center;

  color: var(--tc-28514b, #28514b);
}

.sg-eyebrow {
  margin: 0;

  color: var(--tc-567262, #567262);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.sg-countdown h2 {
  margin: 6px 0 18px;

  font-family: "Allura", cursive;

  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: var(--tc-28514b, #28514b);
}

.sg-countdown__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.sg-countdown__item {
  padding: 16px 2px;

  border: 1px solid rgba(var(--tc-6c8e7a-rgb, 108, 142, 122), 0.35);
  border-radius: 16px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.82), rgba(var(--tc-f0f6ee-rgb, 240, 246, 238), 0.68));

  box-shadow: 0 8px 22px rgba(var(--tc-28514b-rgb, 40, 81, 75), 0.07);
}

.sg-countdown__item b {
  display: block;

  font-family: var(--font-num, "Be Vietnam Pro", "Segoe UI", system-ui, sans-serif);

  color: var(--tc-28514b, #28514b);

  font-size: clamp(22px, 7vw, 30px);
  font-weight: 600;

  margin-bottom: 4px;
}

.sg-countdown__item span {
  font-size: 10px;

  letter-spacing: 0.14em;

  color: var(--tc-567262, #567262);
}
</style>
