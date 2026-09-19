<template>
  <section class="lp-countdown">
    <div class="lp-section-title">
      <h2>ĐẾM NGƯỢC NGÀY VUI</h2>
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

  color: #ffbe89;

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

  color: #ffbe89;
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

  border: 1px solid rgba(255, 190, 137, 0.4);
  border-radius: 10px;

  background: rgba(255, 190, 137, 0.08);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.lp-countdown__item b {
  font-family: "Big Caslon", "Baskerville", "Times New Roman", serif;

  font-size: clamp(22px, 6vw, 30px);
  font-weight: 600;

  color: #ffbe89;
}

.lp-countdown__item span {
  font-size: 11px;

  letter-spacing: 0.16em;

  text-transform: uppercase;

  opacity: 0.7;
}
</style>
