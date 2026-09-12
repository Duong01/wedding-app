<template>
  <section class="ob-hero">
    <!-- Sun glow -->
    <div class="ob-hero__sun"></div>

    <!-- Sky-to-sea gradient layers -->
    <div class="ob-hero__sea"></div>

    <!-- Rising bubbles -->
    <div class="ob-hero__bubbles" aria-hidden="true">
      <span v-for="n in 10" :key="n" class="ob-hero__bubble" :class="`ob-hero__bubble--${n}`"></span>
    </div>

    <!-- Content -->
    <div class="ob-hero__content">
      <p class="ob-hero__save-date">SAVE THE DATE</p>

      <div class="ob-hero__motif">
        <span></span>
        <i>〜</i>
        <span class="ob-hero__motif-flip"></span>
      </div>

      <h1>
        {{ groomName }}
        <i>&amp;</i>
        {{ brideName }}
      </h1>

      <p class="ob-hero__announce">TRÂN TRỌNG KÍNH MỜI</p>

      <p class="ob-hero__guest">{{ guestName }}</p>

      <p class="ob-hero__intro">
        Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại
      </p>

      <p class="ob-hero__place">{{ location }}</p>

      <div class="ob-hero__schedule">
        <p>VÀO LÚC {{ time }}</p>
        <p>{{ dateText }}</p>
      </div>

      <p class="ob-hero__message">
        Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!
      </p>

      <div class="ob-hero__footer">
        <span></span>
        <b>{{ monogram }}</b>
        <span class="ob-hero__footer-flip"></span>
      </div>
    </div>

    <!-- Scalloped wave bottom edge -->
    <div class="ob-hero__wave" aria-hidden="true"></div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import dayjs from "dayjs";

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  event: { type: Object, default: () => ({}) },
  guestName: { type: String, default: "Quý khách" },
  monogram: { type: String, default: "G&B" },
  dateLabel: { type: String, default: "" },
});

const groomName = computed(
  () =>
    props.wedding?.GroomName ||
    props.wedding?.groomName ||
    props.wedding?.hero?.GroomName ||
    props.wedding?.couple?.Groom?.Name ||
    "Nguyễn Huy"
);

const brideName = computed(
  () =>
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.hero?.BrideName ||
    props.wedding?.couple?.Bride?.Name ||
    "Nguyễn Mai"
);

const location = computed(
  () =>
    props.event?.Location ||
    props.event?.Address ||
    props.wedding?.hero?.Location ||
    "Địa điểm tổ chức tiệc cưới"
);

const time = computed(
  () =>
    props.event?.EventTime ||
    props.event?.Time ||
    props.event?.StartTime ||
    props.wedding?.hero?.Time ||
    "16:00"
);

const dateText = computed(() => {
  const raw =
    props.event?.EventDate ||
    props.event?.Date ||
    props.wedding?.hero?.weddingDate ||
    props.wedding?.weddingDate;

  const date = dayjs(raw);

  if (date.isValid()) {
    return `${date.day() === 0 ? "CHỦ NHẬT" : `THỨ ${date.day() + 1}`}, NGÀY ${date.format("DD/MM/YYYY")}`;
  }

  return props.dateLabel || "NGÀY VUI CỦA CHÚNG MÌNH";
});
</script>

<style scoped>
.ob-hero {
  --ob-ocean: #1d6a8e;
  --ob-seafoam: #4a9ab8;
  --ob-aqua: #a8d0dc;
  --ob-pale: #e2f1f5;
  --ob-bg: #f4fafc;
  --ob-text: #274b5c;
  --ob-sand: #e8d9bd;
  --ob-coral: #e8927c;

  position: relative;
  isolation: isolate;
  overflow: hidden;

  padding: 56px 20px 96px;

  min-height: 690px;

  display: grid;
  place-items: center;

  color: var(--ob-text);

  background: linear-gradient(180deg, #eaf6f9 0%, #cfe8ef 34%, #9ccbdd 66%, #6fb0c6 100%);
}

/* =========================================================
   SUN + SEA
========================================================= */

.ob-hero__sun {
  position: absolute;
  z-index: -3;

  width: 300px;
  height: 300px;
  top: -90px;
  right: -70px;

  border-radius: 50%;

  background: radial-gradient(circle, rgba(255, 243, 220, 0.9), rgba(232, 217, 189, 0.4) 48%, transparent 72%);

  filter: blur(6px);

  animation: ob-sun-breathe 6s ease-in-out infinite;

  pointer-events: none;
}

.ob-hero__sea {
  position: absolute;
  z-index: -4;
  inset: 0;

  background:
    radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.65), transparent 52%),
    linear-gradient(180deg, transparent 55%, rgba(29, 106, 142, 0.18) 100%);

  pointer-events: none;
}

/* =========================================================
   BUBBLES
========================================================= */

.ob-hero__bubbles {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

.ob-hero__bubble {
  position: absolute;
  bottom: -40px;

  border-radius: 50%;

  background: radial-gradient(
    circle at 32% 28%,
    rgba(255, 255, 255, 0.85),
    rgba(226, 241, 245, 0.3) 55%,
    rgba(74, 154, 184, 0.12) 100%
  );

  box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.7);

  animation: ob-bubble-rise linear infinite;
}

.ob-hero__bubble--1 { left: 7%; width: 13px; height: 13px; animation-duration: 12s; animation-delay: 0s; }
.ob-hero__bubble--2 { left: 19%; width: 8px; height: 8px; animation-duration: 15s; animation-delay: 2.4s; }
.ob-hero__bubble--3 { left: 31%; width: 16px; height: 16px; animation-duration: 13s; animation-delay: 1.1s; }
.ob-hero__bubble--4 { left: 44%; width: 7px; height: 7px; animation-duration: 16s; animation-delay: 3.6s; }
.ob-hero__bubble--5 { left: 57%; width: 11px; height: 11px; animation-duration: 11.5s; animation-delay: 0.9s; }
.ob-hero__bubble--6 { left: 68%; width: 9px; height: 9px; animation-duration: 14s; animation-delay: 3s; }
.ob-hero__bubble--7 { left: 79%; width: 15px; height: 15px; animation-duration: 12.6s; animation-delay: 1.8s; }
.ob-hero__bubble--8 { left: 90%; width: 7px; height: 7px; animation-duration: 15.4s; animation-delay: 4.2s; }
.ob-hero__bubble--9 { left: 50%; width: 6px; height: 6px; animation-duration: 16.5s; animation-delay: 5.2s; }
.ob-hero__bubble--10 { left: 26%; width: 10px; height: 10px; animation-duration: 13.8s; animation-delay: 6.1s; }

/* =========================================================
   CONTENT
========================================================= */

.ob-hero__content {
  position: relative;
  z-index: 2;

  width: min(100%, 460px);

  padding: 46px 26px 42px;

  text-align: center;

  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 24px;

  background: linear-gradient(175deg, rgba(255, 255, 255, 0.55), rgba(244, 250, 252, 0.35));

  box-shadow: 0 22px 55px rgba(23, 74, 96, 0.14);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  animation: ob-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.ob-hero__save-date {
  margin: 0;

  color: var(--ob-ocean);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.ob-hero__motif {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin: 12px auto;
}

.ob-hero__motif span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(74, 154, 184, 0.85));
}

.ob-hero__motif-flip {
  transform: scaleX(-1);
}

.ob-hero__motif i {
  color: var(--ob-coral);

  font-size: 15px;
  font-style: normal;
}

.ob-hero h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(40px, 10vw, 58px);
  font-weight: 400;

  line-height: 1.12;

  color: var(--ob-text);
}

.ob-hero h1 i {
  padding: 0 6px;

  color: var(--ob-coral);

  font-family: Georgia, serif;
  font-size: 0.5em;
  font-style: normal;
}

.ob-hero__announce {
  margin: 28px 0 8px;

  color: var(--ob-seafoam);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.ob-hero__guest {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: 30px;

  color: var(--ob-ocean);
}

.ob-hero__intro {
  max-width: 325px;
  margin: 14px auto 8px;

  color: rgba(39, 75, 92, 0.85);

  font-size: 12px;

  letter-spacing: 0.1em;
  line-height: 1.55;
}

.ob-hero__place {
  max-width: 350px;
  margin: 0 auto;

  color: var(--ob-text);

  font-size: 16px;
  font-weight: 700;

  letter-spacing: 0.06em;
  line-height: 1.4;
}

.ob-hero__schedule {
  margin: 24px auto 0;
  padding: 14px 0;

  border-top: 1px solid rgba(74, 154, 184, 0.45);
  border-bottom: 1px solid rgba(74, 154, 184, 0.45);
}

.ob-hero__schedule p {
  margin: 4px 0;

  color: var(--ob-text);

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.14em;
  line-height: 1.45;
}

.ob-hero__message {
  max-width: 295px;
  margin: 24px auto 20px;

  color: rgba(39, 75, 92, 0.8);

  font-size: 14px;
  font-style: italic;

  line-height: 1.5;
}

.ob-hero__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: var(--ob-seafoam);
}

.ob-hero__footer span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(74, 154, 184, 0.75));
}

.ob-hero__footer-flip {
  transform: scaleX(-1);
}

.ob-hero__footer b {
  font-family: "Allura", cursive;
  font-size: 20px;
  font-weight: 400;

  letter-spacing: 0.1em;

  color: var(--ob-coral);
}

/* =========================================================
   SCALLOPED WAVE BOTTOM
========================================================= */

.ob-hero__wave {
  position: absolute;
  z-index: 3;

  left: 0;
  right: 0;
  bottom: -1px;
  height: 26px;

  background:
    radial-gradient(circle at 13px 26px, transparent 15px, var(--ob-bg) 16px, var(--ob-bg) 100%) repeat-x;
  background-size: 26px 26px;
  background-position: 0 0;

  pointer-events: none;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes ob-fade-up {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes ob-sun-breathe {
  0%,
  100% {
    opacity: 0.75;
    transform: scale(0.96);
  }

  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

@keyframes ob-bubble-rise {
  0% {
    transform: translateY(0) translateX(0) scale(0.7);
    opacity: 0;
  }

  12% {
    opacity: 0.9;
  }

  50% {
    transform: translateY(-46vh) translateX(12px) scale(1);
  }

  88% {
    opacity: 0.75;
  }

  100% {
    transform: translateY(-96vh) translateX(-8px) scale(1.12);
    opacity: 0;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .ob-hero {
    padding: 44px 14px 84px;
  }

  .ob-hero__content {
    padding: 38px 18px 34px;
  }

  .ob-hero h1 {
    font-size: 42px;
  }

  .ob-hero__guest {
    font-size: 26px;
  }

  .ob-hero__intro {
    font-size: 11px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .ob-hero__content,
  .ob-hero__sun,
  .ob-hero__bubble {
    animation: none;
  }
}
</style>
