<template>
  <section class="countdown">
    <div class="gg-eyebrow">NGÀY VUI ĐANG ĐẾN GẦN</div>

    <h2 class="gg-title">Cùng đếm ngược</h2>

    <div class="countdown-grid">
      <article v-for="item in values" :key="item.label" class="countdown-item">
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

const target = computed(
  () => props.countdown?.Target || props.countdown || props.weddingDate
);

const values = computed(() => {
  const seconds = Math.max(
    0,
    dayjs(target.value).diff(dayjs(now.value), "second")
  );

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
.countdown {
  text-align: center;
}

.countdown-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;

  max-width: 400px;
  margin: 22px auto 0;
}

.countdown-item {
  padding: 14px 2px;

  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.35);

  background-color: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(7px) saturate(1.08);
  -webkit-backdrop-filter: blur(7px) saturate(1.08);

  box-shadow: inset 1.5px 1.5px 2px rgba(255, 255, 255, 0.45),
    inset -1.5px -1.5px 3px rgba(180, 120, 130, 0.12),
    0 10px 26px -6px rgba(147, 56, 69, 0.24);
}

.countdown-item b {
  display: block;
  margin-bottom: 4px;

  color: var(--gg-rose, #cb5d6c);
  font-family: "EB Garamond", serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.countdown-item span {
  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 9px;
  letter-spacing: 0.14em;
  opacity: 0.8;
}

@media (min-width: 900px) {
  .countdown-item b {
    font-size: 30px;
  }

  .countdown-item span {
    font-size: 10px;
  }
}
</style>
