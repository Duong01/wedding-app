<template>
  <div class="tr-countdown">
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'countdown', 'Eyebrow')" class="tr-top-custom-head">
      <p v-if="sectionOverride(sections, 'countdown', 'Eyebrow')" class="tr-top-custom-head__eyebrow">{{ sectionOverride(sections, "countdown", "Eyebrow") }}</p>
    </header>

    <h2 class="tr-countdown__title">{{ sectionText(sections, "countdown", "Heading", $t("Cùng đếm ngược")) }}</h2>

    <div class="tr-countdown__value">
      <p v-if="isFinished">{{ $t("Chúc mừng hạnh phúc!") }}</p>

      <p v-else>
        {{ remain.days }} ngày {{ remain.hours }} giờ {{ remain.minutes }} phút
        {{ remain.seconds }} giây
      </p>
    </div>
  </div>
</template>

<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { computed, onMounted, onUnmounted, ref } from "vue";
const props = defineProps({
  sections: { type: Object, default: () => ({}) },
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

  font-family: var(--font-num, "Be Vietnam Pro", "Segoe UI", system-ui, sans-serif);
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

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.tr-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.tr-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.tr-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.tr-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
