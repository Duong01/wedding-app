<template>
  <section class="ob-countdown">
    <p class="ob-eyebrow">NGÀY VUI ĐANG ĐẾN GẦN</p>

    <h2>Đếm ngược</h2>

    <div class="ob-countdown__grid">
      <article v-for="item in values" :key="item.label" class="ob-countdown__item">
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
.ob-countdown {
  text-align: center;

  color: #274b5c;
}

.ob-eyebrow {
  margin: 0;

  color: #4a9ab8;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ob-countdown h2 {
  margin: 6px 0 18px;

  font-family: "Allura", cursive;

  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: #1d6a8e;
}

.ob-countdown__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.ob-countdown__item {
  padding: 16px 2px;

  border: 1px solid rgba(74, 154, 184, 0.35);
  border-radius: 24px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.92), rgba(244, 250, 252, 0.75));

  box-shadow: 0 8px 22px rgba(29, 106, 142, 0.07);
}

.ob-countdown__item b {
  display: block;

  font-family: "Cormorant Garamond", Georgia, serif;

  color: #1d6a8e;

  font-size: clamp(22px, 7vw, 30px);
  font-weight: 600;

  margin-bottom: 4px;
}

.ob-countdown__item span {
  font-size: 8px;

  letter-spacing: 0.14em;

  color: #e8927c;
}
</style>
