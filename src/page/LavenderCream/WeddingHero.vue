<template>
  <section class="lc-hero">
    <!-- Soft lilac glows -->
    <div class="lc-hero__glow lc-hero__glow--1"></div>
    <div class="lc-hero__glow lc-hero__glow--2"></div>

    <!-- Decorative arch frame -->
    <div class="lc-hero__frame">
      <div class="lc-hero__frame-inner"></div>

      <!-- Corner blooms -->
      <span class="lc-bloom lc-bloom--tl">❀</span>
      <span class="lc-bloom lc-bloom--tr">❀</span>
      <span class="lc-bloom lc-bloom--bl">❀</span>
      <span class="lc-bloom lc-bloom--br">❀</span>

      <div class="lc-hero__content">
        <p class="lc-hero__save-date">SAVE THE DATE</p>

        <div class="lc-hero__motif">
          <span></span>
          <i>❀</i>
          <span></span>
        </div>

        <h1>
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </h1>

        <p class="lc-hero__announce">TRÂN TRỌNG KÍNH MỜI</p>

        <p class="lc-hero__guest">{{ guestName }}</p>

        <p class="lc-hero__intro">
          Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại
        </p>

        <p class="lc-hero__place">{{ location }}</p>

        <div class="lc-hero__schedule">
          <p>VÀO LÚC {{ time }}</p>
          <p>{{ dateText }}</p>
        </div>

        <p class="lc-hero__message">
          Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!
        </p>

        <div class="lc-hero__footer">
          <span></span>
          <b>{{ monogram }}</b>
          <span></span>
        </div>
      </div>
    </div>

    <!-- Floating lavender sparkles -->
    <div class="lc-sparkle-falls" aria-hidden="true">
      <span v-for="n in 8" :key="n" class="lc-sparkle-fall" :class="`lc-sparkle-fall--${n}`">✦</span>
    </div>
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
.lc-hero {
  --lc-deep: #584a5b;
  --lc-lavender: #a086b4;
  --lc-plum: #7d6390;
  --lc-lilac: #d8c0de;
  --lc-line: #b9a0d0;
  --lc-cream: #faf8fc;

  position: relative;
  isolation: isolate;
  overflow: hidden;

  padding: 14px;

  min-height: 690px;

  background:
    radial-gradient(ellipse at 50% 0%, rgba(252, 250, 255, 0.9), transparent 55%),
    linear-gradient(180deg, #fbf8fd 0%, #f1eaf6 100%);
}

/* =========================================================
   GLOWS
========================================================= */

.lc-hero__glow {
  position: absolute;
  z-index: 0;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(12px);
}

.lc-hero__glow--1 {
  width: 320px;
  height: 320px;
  top: -80px;
  left: -70px;

  background: radial-gradient(circle, rgba(216, 192, 222, 0.5), transparent 70%);

  animation: lc-glow-breathe 6s ease-in-out infinite;
}

.lc-hero__glow--2 {
  width: 280px;
  height: 280px;
  bottom: -70px;
  right: -60px;

  background: radial-gradient(circle, rgba(185, 160, 208, 0.28), transparent 70%);

  animation: lc-glow-breathe 7s ease-in-out infinite;
  animation-delay: -3s;
}

/* =========================================================
   FRAME
========================================================= */

.lc-hero__frame {
  position: relative;
  z-index: 2;

  min-height: 662px;

  display: grid;
  place-items: center;

  border: 1px solid rgba(185, 160, 208, 0.55);
  border-radius: 210px 210px 24px 24px;

  background: linear-gradient(175deg, rgba(255, 255, 255, 0.6), rgba(246, 240, 250, 0.35));

  box-shadow: 0 22px 55px rgba(88, 74, 91, 0.1);
}

.lc-hero__frame-inner {
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(185, 160, 208, 0.28);
  border-radius: 202px 202px 18px 18px;

  pointer-events: none;
}

/* =========================================================
   BLOOMS
========================================================= */

.lc-bloom {
  position: absolute;
  z-index: 3;

  color: var(--lc-lavender);

  font-size: 20px;

  opacity: 0.75;

  animation: lc-sway 5s ease-in-out infinite;
}

.lc-bloom--tl { top: 26px; left: 30px; }
.lc-bloom--tr { top: 26px; right: 30px; animation-delay: -1.4s; }
.lc-bloom--bl { bottom: 26px; left: 30px; animation-delay: -2.6s; }
.lc-bloom--br { bottom: 26px; right: 30px; animation-delay: -3.8s; }

/* =========================================================
   CONTENT
========================================================= */

.lc-hero__content {
  position: relative;
  z-index: 2;

  width: min(100%, 440px);

  padding: 62px 28px 48px;

  text-align: center;

  animation: lc-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.lc-hero__save-date {
  margin: 0;

  color: var(--lc-line);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.lc-hero__motif {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin: 12px auto;
}

.lc-hero__motif span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(185, 160, 208, 0.8));
}

.lc-hero__motif span:last-child {
  transform: scaleX(-1);
}

.lc-hero__motif i {
  color: var(--lc-lavender);

  font-size: 15px;
  font-style: normal;
}

.lc-hero h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(40px, 10vw, 58px);
  font-weight: 400;

  line-height: 1.12;

  color: var(--lc-deep);
}

.lc-hero h1 i {
  padding: 0 6px;

  color: var(--lc-lavender);

  font-family: Georgia, serif;
  font-size: 0.5em;
  font-style: normal;
}

.lc-hero__announce {
  margin: 28px 0 8px;

  color: var(--lc-lavender);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.lc-hero__guest {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: 30px;

  color: var(--lc-deep);
}

.lc-hero__intro {
  max-width: 325px;
  margin: 14px auto 8px;

  color: rgba(88, 74, 91, 0.85);

  font-size: 12px;

  letter-spacing: 0.1em;
  line-height: 1.55;
}

.lc-hero__place {
  max-width: 350px;
  margin: 0 auto;

  color: var(--lc-deep);

  font-size: 16px;
  font-weight: 700;

  letter-spacing: 0.06em;
  line-height: 1.4;
}

.lc-hero__schedule {
  margin: 24px auto 0;
  padding: 14px 0;

  border-top: 1px solid rgba(185, 160, 208, 0.45);
  border-bottom: 1px solid rgba(185, 160, 208, 0.45);
}

.lc-hero__schedule p {
  margin: 4px 0;

  color: var(--lc-deep);

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.14em;
  line-height: 1.45;
}

.lc-hero__message {
  max-width: 295px;
  margin: 24px auto 20px;

  color: rgba(88, 74, 91, 0.8);

  font-size: 14px;
  font-style: italic;

  line-height: 1.5;
}

.lc-hero__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: var(--lc-lavender);
}

.lc-hero__footer span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(185, 160, 208, 0.7));
}

.lc-hero__footer span:last-child {
  transform: scaleX(-1);
}

.lc-hero__footer b {
  font-family: "Allura", cursive;
  font-size: 20px;
  font-weight: 400;

  letter-spacing: 0.1em;
}

/* =========================================================
   SPARKLES
========================================================= */

.lc-sparkle-falls {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.lc-sparkle-fall {
  position: absolute;
  top: -30px;

  color: rgba(160, 134, 180, 0.45);

  text-shadow: 0 0 6px rgba(216, 192, 222, 0.6);

  font-size: 13px;

  animation: lc-sparkle-fall linear infinite;
}

.lc-sparkle-fall--1 { left: 8%; animation-duration: 12s; animation-delay: 0s; }
.lc-sparkle-fall--2 { left: 22%; animation-duration: 15s; animation-delay: 3s; font-size: 10px; }
.lc-sparkle-fall--3 { left: 36%; animation-duration: 13s; animation-delay: 1.5s; }
.lc-sparkle-fall--4 { left: 50%; animation-duration: 16s; animation-delay: 5s; font-size: 9px; }
.lc-sparkle-fall--5 { left: 63%; animation-duration: 12.5s; animation-delay: 2s; }
.lc-sparkle-fall--6 { left: 76%; animation-duration: 14.5s; animation-delay: 4.2s; font-size: 11px; }
.lc-sparkle-fall--7 { left: 87%; animation-duration: 13.5s; animation-delay: 0.8s; }
.lc-sparkle-fall--8 { left: 95%; animation-duration: 15.5s; animation-delay: 6s; font-size: 9px; }

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes lc-fade-up {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes lc-sway {
  0%,
  100% {
    transform: rotate(-8deg) scale(1);
  }

  50% {
    transform: rotate(10deg) scale(1.12);
  }
}

@keyframes lc-glow-breathe {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(0.96);
  }

  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

@keyframes lc-sparkle-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  90% {
    opacity: 0.7;
  }

  100% {
    transform: translateY(720px) rotate(320deg);
    opacity: 0;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .lc-hero__content {
    padding: 48px 20px 38px;
  }

  .lc-hero__frame {
    min-height: 640px;
  }

  .lc-hero h1 {
    font-size: 42px;
  }

  .lc-hero__guest {
    font-size: 26px;
  }

  .lc-hero__intro {
    font-size: 11px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .lc-hero__content,
  .lc-bloom,
  .lc-sparkle-fall,
  .lc-hero__glow--1,
  .lc-hero__glow--2 {
    animation: none;
  }
}
</style>
