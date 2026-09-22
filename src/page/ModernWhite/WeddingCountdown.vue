<template>
  <section class="mw-countdown">
    <h2 class="mw-title">Cùng đếm ngược</h2>

    <p class="mw-lead">Ngày trọng đại đang đến gần</p>

    <div class="mw-countdown__grid">
      <div v-for="item in items" :key="item.label" class="mw-countdown__item">
        <Transition name="mw-flip" mode="out-in">
          <strong :key="item.value">{{ item.value }}</strong>
        </Transition>

        <span>{{ item.label }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  countdown: {
    type: [Object, String],
    default: null,
  },

  weddingDate: {
    type: [String, Object],
    default: "",
  },
});

const now = ref(Date.now());

let timer = null;

const target = computed(() => {
  const value = props.countdown;

  let raw = "";

  if (typeof value === "string") {
    raw = value;
  } else if (value) {
    raw = value.Date || value.Target || value.WeddingDate || "";
  }

  if (!raw) {
    raw = props.weddingDate || "";
  }

  if (!raw) {
    return Date.now();
  }

  const timestamp = new Date(raw).getTime();

  return Number.isFinite(timestamp) ? timestamp : Date.now();
});

const values = computed(() => {
  const distance = Math.max(0, target.value - now.value);

  return {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance % 86400000) / 3600000),
    minutes: Math.floor((distance % 3600000) / 60000),
    seconds: Math.floor((distance % 60000) / 1000),
  };
});

const items = computed(() => [
  { label: "NGÀY", value: String(values.value.days).padStart(2, "0") },
  { label: "GIỜ", value: String(values.value.hours).padStart(2, "0") },
  { label: "PHÚT", value: String(values.value.minutes).padStart(2, "0") },
  { label: "GIÂY", value: String(values.value.seconds).padStart(2, "0") },
]);

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.mw-countdown {
  text-align: center;
}

.mw-countdown__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;

  max-width: 420px;

  margin: 24px auto 0;
}

.mw-countdown__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  padding: 14px 6px;

  border: 1px solid var(--mw-hairline);
  border-radius: 14px;

  background-color: var(--mw-blue-mist);
}

.mw-countdown__item strong {
  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 24px;
  font-weight: 500;

  font-variant-numeric: tabular-nums;
  line-height: 1.2;
}

.mw-countdown__item span {
  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 10px;

  letter-spacing: 0.2em;
}

.mw-flip-enter-active,
.mw-flip-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.mw-flip-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}

.mw-flip-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .mw-countdown__grid {
    gap: 14px;

    max-width: 560px;
  }

  .mw-countdown__item {
    padding: 18px 8px;
  }

  .mw-countdown__item strong {
    font-size: 32px;
  }

  .mw-countdown__item span {
    font-size: 12px;
  }
}
</style>
