<template>
  <section class="sp-countdown">
    <p class="sp-eyebrow">NGÀY VUI ĐANG ĐẾN GẦN</p>

    <h2>Đếm ngược</h2>

    <div class="sp-countdown__grid">
      <article v-for="item in values" :key="item.label" class="sp-countdown__item">
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
.sp-countdown {
  text-align: center;

  color: #7a4a3d;
}

.sp-eyebrow {
  margin: 0;

  color: #d67a63;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.sp-countdown h2 {
  margin: 6px 0 18px;

  font-family: "Allura", cursive;

  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: #7a4a3d;
}

.sp-countdown__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.sp-countdown__item {
  padding: 16px 2px;

  border: 1px solid rgba(224, 163, 126, 0.45);
  border-radius: 16px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.8), rgba(255, 242, 232, 0.65));

  box-shadow: 0 8px 22px rgba(122, 74, 61, 0.07);
}

.sp-countdown__item b {
  display: block;

  font-family: "Cormorant Garamond", Georgia, serif;

  color: #7a4a3d;

  font-size: clamp(22px, 7vw, 30px);
  font-weight: 600;

  margin-bottom: 4px;
}

.sp-countdown__item span {
  font-size: 8px;

  letter-spacing: 0.14em;

  color: #d67a63;
}
</style>
