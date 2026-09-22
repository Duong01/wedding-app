<template>
  <section class="cr-countdown">
    <img
      :src="cherryBlossom"
      alt=""
      aria-hidden="true"
      class="cr-countdown__blossom"
      draggable="false"
    />

    <header class="cr-heading">
      <h2 class="cr-heading__vi">Đếm ngược</h2>

      <p class="cr-heading__zh">婚禮倒數</p>

      <div class="cr-heading__ornament" aria-hidden="true">
        <span></span>
        <i>❀</i>
        <span></span>
      </div>
    </header>

    <div class="cr-countdown__grid">
      <article v-for="item in values" :key="item.label" class="cr-countdown__item">
        <b>{{ item.value }}</b>
        <span>{{ item.label }}</span>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import dayjs from "dayjs";

import { cherryBlossom } from "./emeraldLuxeAssets";

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
.cr-countdown {
  position: relative;

  text-align: center;

  color: var(--cr-ink);
}

.cr-countdown__blossom {
  position: absolute;

  top: 0;
  left: -18px;

  width: 88px;
  height: 88px;

  object-fit: contain;

  opacity: 0.45;

  pointer-events: none;
}

/* =========================================================
   TIÊU ĐỀ
========================================================= */

.cr-heading {
  position: relative;

  text-align: center;

  margin-bottom: 20px;
}

.cr-heading__vi {
  margin: 0;

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: clamp(22px, 6vw, 30px);
  font-weight: 400;

  letter-spacing: 0.06em;

  text-transform: uppercase;

  color: var(--cr-ink);
}

.cr-heading__zh {
  margin: 4px 0 0;

  font-family: "Noto Serif SC", serif;

  font-size: 0.85em;

  letter-spacing: 0.3em;
  text-indent: 0.3em;

  opacity: 0.7;

  color: var(--cr-soft);
}

.cr-heading__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-top: 12px;

  color: var(--cr-accent);
}

.cr-heading__ornament span {
  width: 52px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--cr-accent-rgb), 1));
}

.cr-heading__ornament span:last-child {
  transform: rotate(180deg);
}

.cr-heading__ornament i {
  font-size: 13px;
  font-style: normal;
}

/* =========================================================
   Ô ĐẾM
========================================================= */

.cr-countdown__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.cr-countdown__item {
  padding: 15px 2px;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.18);
  border-radius: 14px;

  background: rgba(var(--cr-surface-rgb), 0.88);

  transition: transform 0.25s ease;
}

.cr-countdown__item:hover {
  transform: translateY(-3px);
}

.cr-countdown__item b {
  display: block;

  margin-bottom: 3px;

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: clamp(22px, 7vw, 30px);
  font-weight: 400;

  color: var(--cr-ink);
}

.cr-countdown__item span {
  color: var(--cr-muted);

  font-size: 10px;

  letter-spacing: 0.14em;
}

@media (prefers-reduced-motion: reduce) {
  .cr-countdown__item {
    transition: none;
  }
}
</style>
