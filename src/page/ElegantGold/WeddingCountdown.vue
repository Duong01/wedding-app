<template>
  <section class="la-countdown">
    <h2 class="la-title">Cùng đếm ngược</h2>

    <p class="la-lead">Từng giây trôi qua là một bước gần hơn đến ngày chúng mình chung đôi</p>

    <div class="la-countdown__grid">
      <article v-for="item in values" :key="item.label" class="la-countdown__item">
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
.la-countdown {
  text-align: center;
}

.la-countdown__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;

  margin-top: 20px;
}

.la-countdown__item {
  padding: 14px 2px;

  border: 1px solid var(--la-hairline);
  border-radius: 14px;

  background-color: var(--la-blush);
}

.la-countdown__item b {
  display: block;

  margin-bottom: 4px;

  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: clamp(22px, 7vw, 30px);
  font-weight: 500;

  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.la-countdown__item span {
  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 10px;
  font-weight: 300;

  letter-spacing: 0.14em;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .la-countdown__grid {
    gap: 14px;

    max-width: 560px;

    margin: 24px auto 0;
  }

  .la-countdown__item {
    padding: 20px 4px;
  }

  .la-countdown__item b {
    font-size: 34px;
  }

  .la-countdown__item span {
    font-size: 11px;
  }
}
</style>
