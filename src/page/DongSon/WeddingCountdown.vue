<template>
  <section class="countdown">
    <div class="countdown-disc">
      <div class="title">
        <small>THE BIG DAY</small>
        <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
        <header v-if="sectionOverride(sections, 'countdown', 'Eyebrow')" class="ds-top-custom-head">
          <p v-if="sectionOverride(sections, 'countdown', 'Eyebrow')" class="ds-top-custom-head__eyebrow">{{ sectionOverride(sections, "countdown", "Eyebrow") }}</p>
        </header>

        <h2>{{ sectionText(sections, "countdown", "Heading", "Đếm ngược ngày vui") }}</h2>
      </div>

      <div class="timer">
        <div
          v-for="item in timerItems"
          :key="item.label"
          class="time-box"
        >
          <strong>{{ String(item.value).padStart(2, "0") }}</strong>
          <span>{{ item.label }}</span>
        </div>
      </div>

      <div class="countdown-bottom">
        <span />
        <b>✦</b>
        <span />
      </div>
    </div>
  </section>
</template>

<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
  sections: { type: Object, default: () => ({}) },
  countdown: {
    type: [Object, String],
    default: null,
  },
});

const now = ref(Date.now());
let timer = null;

const target = computed(() => {
  if (!props.countdown) return null;

  if (typeof props.countdown === "string") {
    return new Date(props.countdown).getTime();
  }

  return new Date(
    props.countdown.date ||
    props.countdown.targetDate ||
    props.countdown.weddingDate ||
    Date.now()
  ).getTime();
});

const remaining = computed(() => {
  if (!target.value) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const diff = Math.max(0, target.value - now.value);

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
});

const timerItems = computed(() => [
  { label: "NGÀY", value: remaining.value.days },
  { label: "GIỜ", value: remaining.value.hours },
  { label: "PHÚT", value: remaining.value.minutes },
  { label: "GIÂY", value: remaining.value.seconds },
]);

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.countdown {
  padding: 65px 20px;
  background: var(--tc-641914, #641914);
  color: var(--tc-ead7b5, #ead7b5);
  text-align: center;
}

.countdown-disc {
  position: relative;
  max-width: 580px;
  margin: auto;
  padding: 50px 20px;
  border: 1px solid rgba(var(--tc-c99552-rgb, 201, 149, 82), .7);
  background: rgba(0,0,0,.22);
  box-shadow: 0 12px 30px rgba(0,0,0,.3);
}

.countdown-disc::before {
  content: "";
  position: absolute;
  inset: 12px;
  border: 1px dashed rgba(var(--tc-c99552-rgb, 201, 149, 82), .45);
}

.title,
.timer,
.countdown-bottom {
  position: relative;
  z-index: 2;
}

.title small {
  font-size: 10px;
  letter-spacing: .4em;
  color: var(--tc-c99552, #c99552);
}

h2 {
  margin: 8px 0 35px;
  font-family: Georgia, serif;
  font-size: 29px;
  font-weight: 400;
}

.timer {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.time-box {
  padding: 13px 3px;
  border-left: 1px solid rgba(var(--tc-c99552-rgb, 201, 149, 82), .55);
}

.time-box:first-child {
  border-left: 0;
}

.time-box strong {
  display: block;
  font-family: var(--font-num, "Be Vietnam Pro", "Segoe UI", system-ui, sans-serif);
  font-size: clamp(28px, 8vw, 43px);
  font-weight: 400;
  color: var(--tc-d4a35f, #d4a35f);
}

.time-box span {
  display: block;
  margin-top: 5px;
  font-size: 11px;
  letter-spacing: .2em;
}

.countdown-bottom {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 180px;
  margin: 32px auto 0;
}

.countdown-bottom span {
  flex: 1;
  height: 1px;
  background: rgba(var(--tc-c99552-rgb, 201, 149, 82), .4);
}

.countdown-bottom b {
  color: var(--tc-c99552, #c99552);
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.ds-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.ds-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ds-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.ds-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>