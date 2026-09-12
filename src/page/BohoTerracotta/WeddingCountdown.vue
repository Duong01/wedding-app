<template>
  <section class="bt-countdown">
    <p class="bt-eyebrow">NGÀY VUI ĐANG ĐẾN GẦN</p>

    <h2>Đếm ngược</h2>

    <div class="bt-countdown__grid">
      <article v-for="item in values" :key="item.label" class="bt-countdown__item">
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
.bt-countdown {
  position: relative;

  text-align: center;

  color: #5c4636;

  padding: 6px 18px;
}

/* Macramé lattice texture */
.bt-countdown::before {
  content: "";
  position: absolute;
  inset: 0;

  opacity: 0.05;

  background-image:
    repeating-linear-gradient(45deg, rgba(156, 91, 63, 0.6) 0 1px, transparent 1px 18px),
    repeating-linear-gradient(-45deg, rgba(156, 91, 63, 0.6) 0 1px, transparent 1px 18px);

  pointer-events: none;
}

.bt-eyebrow {
  position: relative;

  margin: 0;

  color: #8a9b7c;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.bt-countdown h2 {
  position: relative;

  margin: 6px 0 18px;

  font-family: "Allura", cursive;

  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: #9c5b3f;
}

.bt-countdown__grid {
  position: relative;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.bt-countdown__item {
  padding: 16px 2px;

  border: 1px dashed rgba(156, 91, 63, 0.45);
  border-radius: 999px 999px 16px 16px;

  background: linear-gradient(172deg, rgba(255, 251, 245, 0.92), rgba(242, 226, 208, 0.7));

  box-shadow: 0 8px 22px rgba(92, 70, 54, 0.08);

  transition: transform 0.25s ease;
}

.bt-countdown__item:nth-child(odd) {
  transform: rotate(-1.2deg);
}

.bt-countdown__item:nth-child(even) {
  transform: rotate(1.2deg);
}

.bt-countdown__item:hover {
  transform: rotate(0deg) translateY(-3px);
}

.bt-countdown__item b {
  display: block;

  font-family: "Cormorant Garamond", Georgia, serif;

  color: #9c5b3f;

  font-size: clamp(22px, 7vw, 30px);
  font-weight: 600;

  margin-bottom: 4px;
}

.bt-countdown__item span {
  font-size: 8px;

  letter-spacing: 0.14em;

  color: #8a9b7c;
}

@media (prefers-reduced-motion: reduce) {
  .bt-countdown__item {
    transition: none;
  }
}
</style>
