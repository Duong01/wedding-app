<template>
  <section class="bq-countdown">
    <h2 class="bq-countdown__title">CÙNG ĐẾM NGƯỢC</h2>

    <p class="bq-countdown__value">
      {{ values[0].value }} ngày {{ values[1].value }} giờ
      {{ values[2].value }} phút {{ values[3].value }} giây
    </p>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import dayjs from "dayjs";

const props = defineProps({
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

  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
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
</style>
