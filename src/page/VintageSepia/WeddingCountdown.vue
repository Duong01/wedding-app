<template>
  <section class="vs-countdown">
    <p class="vs-eyebrow">NGÀY VUI ĐANG ĐẾN GẦN</p>

    <h2>Đếm ngược</h2>

    <div class="vs-countdown__grid">
      <article v-for="item in values" :key="item.label" class="vs-countdown__item">
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
.vs-countdown {
  text-align: center;

  color: #6b4f3a;
}

.vs-eyebrow {
  margin: 0;

  color: #97745a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.vs-countdown h2 {
  margin: 6px 0 18px;

  font-family: "Allura", cursive;

  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: #4a3a2c;
}

.vs-countdown__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.vs-countdown__item {
  position: relative;

  padding: 16px 2px;

  border: 1px solid rgba(107, 79, 58, 0.4);
  border-radius: 8px;

  background: #fbf5e6;

  box-shadow: 0 8px 22px rgba(61, 47, 36, 0.09);

  transform: rotate(-1deg);
}

.vs-countdown__item:nth-child(2n) {
  transform: rotate(1.2deg);
}

.vs-countdown__item::before {
  content: "";
  position: absolute;

  top: -7px;
  left: 50%;

  width: 52px;
  height: 15px;

  transform: translateX(-50%) rotate(-2deg);

  background: rgba(194, 168, 120, 0.35);

  box-shadow: 0 1px 2px rgba(61, 47, 36, 0.1);

  pointer-events: none;
}

.vs-countdown__item b {
  display: block;

  font-family: "Cormorant Garamond", Georgia, serif;

  color: #4a3a2c;

  font-size: clamp(22px, 7vw, 30px);
  font-weight: 600;

  margin-bottom: 4px;
}

.vs-countdown__item span {
  font-family: "Courier New", ui-monospace, monospace;

  font-size: 8px;

  letter-spacing: 0.14em;

  color: #97745a;
}
</style>
