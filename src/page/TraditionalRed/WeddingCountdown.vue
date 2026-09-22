<template>
  <div class="tr-countdown">
    <h2 class="tr-countdown__title">Cùng đếm ngược</h2>

    <div class="tr-countdown__value">
      <p v-if="isFinished">Chúc mừng hạnh phúc!</p>

      <p v-else>
        {{ remain.days }} ngày {{ remain.hours }} giờ {{ remain.minutes }} phút
        {{ remain.seconds }} giây
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
  target: {
    type: [String, Date],
    default: "",
  },
});

const now = ref(Date.now());

let timer = null;

const targetTime = computed(() => {
  if (!props.target) return 0;

  const value = new Date(props.target).getTime();

  return Number.isNaN(value) ? 0 : value;
});

const remain = computed(() => {
  const diff = targetTime.value - now.value;

  if (!targetTime.value || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
});

const isFinished = computed(
  () => !targetTime.value || targetTime.value - now.value <= 0
);

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.tr-countdown {
  display: flex;

  flex-direction: column;

  align-items: center;

  margin-top: 16px;

  color: #680e0e;

  font-family: "Baskerville", "Times New Roman", serif;
}

.tr-countdown__title {
  margin: 0;

  text-transform: uppercase;

  font-size: 18px;

  font-weight: 400;
}

.tr-countdown__value {
  margin-top: 8px;

  text-align: center;

  font-size: 18px;

  font-weight: 600;
}

.tr-countdown__value p {
  margin: 0;
}

@media (min-width: 768px) {
  .tr-countdown__title,
  .tr-countdown__value {
    font-size: 20px;
  }
}
</style>
