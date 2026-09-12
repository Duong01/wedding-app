<template>
  <section class="dh-countdown">
    <p class="dh-eyebrow">NGÀY VUI ĐANG ĐẾN GẦN</p>

    <h2>Đếm ngược</h2>

    <div class="dh-countdown__grid">
      <article v-for="item in values" :key="item.label" class="dh-countdown__item">
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
.dh-countdown {
  --dh-red: #7a1216;
  --dh-red-bright: #a32a2a;
  --dh-gold: #d9a441;
  --dh-gold-light: #f3d9a4;
  --dh-cream: #fdf6ec;
  --dh-ink: #5a3d2e;

  text-align: center;

  color: var(--dh-ink);
}

.dh-eyebrow {
  margin: 0;

  color: var(--dh-red-bright);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.dh-countdown h2 {
  margin: 6px 0 18px;

  font-family: "Allura", cursive;

  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: var(--dh-red);
}

.dh-countdown__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.dh-countdown__item {
  position: relative;

  padding: 16px 2px;

  border: 1px solid rgba(217, 164, 65, 0.5);
  border-radius: 10px;

  background: linear-gradient(170deg, rgba(253, 246, 236, 0.92), rgba(243, 217, 164, 0.55));

  box-shadow: 0 8px 22px rgba(60, 10, 12, 0.09);
}

/* Inner gold line — double border */
.dh-countdown__item::before {
  content: "";
  position: absolute;
  inset: 4px;

  border: 1px solid rgba(217, 164, 65, 0.25);
  border-radius: 7px;

  pointer-events: none;
}

.dh-countdown__item b {
  position: relative;

  display: block;

  font-family: "Cormorant Garamond", Georgia, serif;

  color: var(--dh-red);

  font-size: clamp(22px, 7vw, 30px);
  font-weight: 600;

  margin-bottom: 4px;
}

.dh-countdown__item span {
  position: relative;

  font-size: 8px;

  letter-spacing: 0.14em;

  color: var(--dh-red-bright);
}
</style>
