<template>
  <section class="eg-countdown">
    <p class="eg-eyebrow">NGÀY VUI ĐANG ĐẾN GẦN</p>

    <h2>Đếm ngược</h2>

    <div class="eg-countdown__grid">
      <article v-for="item in values" :key="item.label" class="eg-countdown__item">
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
.eg-countdown {
  position: relative;

  text-align: center;

  color: #5f4f38;

  padding: 6px 18px;
}

/* Fine gold lattice texture */
.eg-countdown::before {
  content: "";
  position: absolute;
  inset: 0;

  opacity: 0.05;

  background-image:
    repeating-linear-gradient(45deg, rgba(181, 138, 69, 0.7) 0 1px, transparent 1px 18px),
    repeating-linear-gradient(-45deg, rgba(181, 138, 69, 0.7) 0 1px, transparent 1px 18px);

  pointer-events: none;
}

.eg-eyebrow {
  position: relative;

  margin: 0;

  color: #8a7a52;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.eg-countdown h2 {
  position: relative;

  margin: 6px 0 18px;

  font-family: "Great Vibes", cursive;

  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: #5d452a;
}

.eg-countdown__grid {
  position: relative;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.eg-countdown__item {
  padding: 16px 2px;

  border: 1px solid rgba(181, 138, 69, 0.55);
  border-radius: 999px 999px 16px 16px;

  background: linear-gradient(172deg, rgba(255, 255, 255, 0.92), rgba(246, 236, 217, 0.72));

  box-shadow: 0 8px 22px rgba(93, 69, 42, 0.1);

  transition: transform 0.25s ease;
}

.eg-countdown__item:nth-child(odd) {
  transform: rotate(-1.2deg);
}

.eg-countdown__item:nth-child(even) {
  transform: rotate(1.2deg);
}

.eg-countdown__item:hover {
  transform: rotate(0deg) translateY(-3px);
}

.eg-countdown__item b {
  display: block;

  font-family: "Playfair Display", Georgia, serif;

  color: #5d452a;

  font-size: clamp(22px, 7vw, 30px);
  font-weight: 600;

  margin-bottom: 4px;
}

.eg-countdown__item span {
  font-size: 10px;

  letter-spacing: 0.14em;

  color: #8a7a52;
}

@media (prefers-reduced-motion: reduce) {
  .eg-countdown__item {
    transition: none;
  }
}
</style>
