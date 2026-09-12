<template>
  <section class="cb-opening" :class="{ 'cb-opening--active': opening }">
    <!-- =====================================================
         BACKGROUND
    ====================================================== -->
    <div class="cb-opening__bg"></div>
    <div class="cb-opening__glow cb-opening__glow--1"></div>
    <div class="cb-opening__glow cb-opening__glow--2"></div>

    <!-- Rising champagne bubbles -->
    <div class="cb-bubbles" aria-hidden="true">
      <span v-for="n in 12" :key="n" class="cb-bubble" :class="`cb-bubble--${n}`"></span>
    </div>

    <!-- =====================================================
         TOP BRANDING
    ====================================================== -->
    <div class="cb-opening__brand">
      <span></span>
      <i>❀</i>
      <span></span>
    </div>

    <p class="cb-opening__eyebrow">WEDDING INVITATION</p>

    <!-- =====================================================
         INVITATION CARD
    ====================================================== -->
    <div class="cb-card">
      <div class="cb-card__arch"></div>

      <div class="cb-card__inner">
        <p class="cb-card__kicker">SAVE THE DATE</p>

        <div class="cb-card__seal">
          <span>{{ monogram }}</span>
        </div>

        <p class="cb-card__invite">Trân trọng kính mời</p>

        <h1>{{ guestName }}</h1>

        <div class="cb-card__divider">
          <span></span>
          <i>❀</i>
          <span></span>
        </div>

        <p class="cb-card__names">
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </p>

        <p class="cb-card__date">{{ dateLabel || "OUR WEDDING DAY" }}</p>
      </div>
    </div>

    <!-- =====================================================
         OPEN BUTTON
    ====================================================== -->
    <button type="button" class="cb-open-btn" :disabled="opening" @click="openInvitation">
      <span class="cb-open-btn__icon">
        <v-icon size="16">mdi-email-open-outline</v-icon>
      </span>

      <span class="cb-open-btn__text">CHẠM ĐỂ MỞ THIỆP</span>

      <span class="cb-open-btn__arrow">↗</span>
    </button>

    <p class="cb-hint">
      <span></span>
      Một lời mời · Một câu chuyện · Một ngày đặc biệt
      <span></span>
    </p>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  monogram: { type: String, default: "G & B" },
  dateLabel: { type: String, default: "" },
});

const emit = defineEmits(["open"]);

const opening = ref(false);

const groomName = computed(
  () => props.wedding?.GroomName || props.wedding?.groomName || "Chú rể"
);

const brideName = computed(
  () => props.wedding?.BrideName || props.wedding?.brideName || "Cô dâu"
);

const guestName = computed(
  () =>
    (Array.isArray(props.wedding?.recipientName)
      ? props.wedding?.recipientName[0]?.Name
      : props.wedding?.recipientName?.Name) ||
    props.wedding?.guestName ||
    "Bạn thân mến"
);

function openInvitation() {
  if (opening.value) return;

  opening.value = true;

  window.setTimeout(() => {
    emit("open");
  }, 1150);
}
</script>

<style scoped>
.cb-opening {
  --cb-deep: #6c4b4a;
  --cb-rose: #b67f7d;
  --cb-champagne: #ead2b6;
  --cb-gold: #c9a06a;
  --cb-cream: #fffaf7;

  position: relative;
  isolation: isolate;

  min-height: 100svh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 34px 18px 28px;

  overflow: hidden;

  color: var(--cb-deep);

  background: linear-gradient(160deg, #f7ece2 0%, #f2e0d4 38%, #ecd2c4 70%, #e5c4b4 100%);
}

/* =========================================================
   BACKGROUND
========================================================= */

.cb-opening__bg {
  position: absolute;
  inset: 0;
  z-index: -10;

  background:
    radial-gradient(ellipse at 50% 18%, rgba(255, 252, 248, 0.85), transparent 42%),
    radial-gradient(ellipse at 12% 82%, rgba(234, 210, 182, 0.4), transparent 38%),
    radial-gradient(ellipse at 88% 72%, rgba(182, 127, 125, 0.22), transparent 40%);
}

.cb-opening::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -5;

  opacity: 0.16;

  background-image: radial-gradient(rgba(108, 75, 74, 0.5) 0.6px, transparent 0.6px);
  background-size: 7px 7px;

  pointer-events: none;
}

.cb-opening__glow {
  position: absolute;
  z-index: -4;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(10px);
}

.cb-opening__glow--1 {
  width: 380px;
  height: 380px;
  top: 6%;
  left: 50%;
  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(255, 250, 240, 0.55), transparent 68%);

  animation: cb-glow-breathe 5.5s ease-in-out infinite;
}

.cb-opening__glow--2 {
  width: 260px;
  height: 260px;
  bottom: -90px;
  left: 50%;
  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(201, 160, 106, 0.2), transparent 70%);
}

/* =========================================================
   BUBBLES
========================================================= */

.cb-bubbles {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
}

.cb-bubble {
  position: absolute;
  bottom: -40px;

  border-radius: 50%;

  background: radial-gradient(
    circle at 32% 30%,
    rgba(255, 255, 255, 0.85),
    rgba(255, 244, 232, 0.28) 55%,
    rgba(201, 160, 106, 0.12) 100%
  );

  box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.7);

  animation: cb-bubble-rise linear infinite;
}

.cb-bubble--1 { left: 6%; width: 14px; height: 14px; animation-duration: 11s; animation-delay: 0s; }
.cb-bubble--2 { left: 16%; width: 8px; height: 8px; animation-duration: 14s; animation-delay: 2.2s; }
.cb-bubble--3 { left: 27%; width: 18px; height: 18px; animation-duration: 12.5s; animation-delay: 1s; }
.cb-bubble--4 { left: 38%; width: 7px; height: 7px; animation-duration: 15s; animation-delay: 3.4s; }
.cb-bubble--5 { left: 49%; width: 12px; height: 12px; animation-duration: 10.5s; animation-delay: 0.8s; }
.cb-bubble--6 { left: 60%; width: 9px; height: 9px; animation-duration: 13.5s; animation-delay: 2.8s; }
.cb-bubble--7 { left: 70%; width: 16px; height: 16px; animation-duration: 12s; animation-delay: 1.6s; }
.cb-bubble--8 { left: 80%; width: 7px; height: 7px; animation-duration: 14.5s; animation-delay: 4s; }
.cb-bubble--9 { left: 89%; width: 13px; height: 13px; animation-duration: 11.5s; animation-delay: 0.4s; }
.cb-bubble--10 { left: 95%; width: 9px; height: 9px; animation-duration: 15.5s; animation-delay: 3s; }
.cb-bubble--11 { left: 44%; width: 6px; height: 6px; animation-duration: 16s; animation-delay: 5s; }
.cb-bubble--12 { left: 33%; width: 10px; height: 10px; animation-duration: 13s; animation-delay: 6s; }

/* =========================================================
   BRAND
========================================================= */

.cb-opening__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 10px;

  color: var(--cb-gold);
}

.cb-opening__brand span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 160, 106, 0.8));
}

.cb-opening__brand span:last-child {
  transform: rotate(180deg);
}

.cb-opening__brand i {
  font-size: 14px;
  font-style: normal;

  animation: cb-spin-bloom 9s linear infinite;
}

.cb-opening__eyebrow {
  margin: 0 0 26px;

  color: var(--cb-rose);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.42em;
  text-indent: 0.42em;
}

/* =========================================================
   CARD
========================================================= */

.cb-card {
  position: relative;
  z-index: 2;

  width: min(100%, 360px);

  padding: 10px;

  border-radius: 190px 190px 26px 26px;

  background: linear-gradient(170deg, rgba(255, 253, 250, 0.94), rgba(250, 238, 226, 0.9));

  box-shadow:
    0 26px 60px rgba(108, 75, 74, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.8);

  animation: cb-card-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.cb-card__arch {
  position: absolute;
  inset: 5px;

  border: 1px solid rgba(201, 160, 106, 0.5);
  border-radius: 184px 184px 22px 22px;

  pointer-events: none;
}

.cb-card__inner {
  position: relative;

  padding: 40px 26px 34px;

  text-align: center;
}

.cb-card__kicker {
  margin: 0 0 18px;

  color: var(--cb-gold);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.cb-card__seal {
  position: relative;

  width: 74px;
  height: 74px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 20px;

  border-radius: 50%;

  background: radial-gradient(circle at 34% 30%, #d9b98c, #c9a06a 58%, #a97f4c 100%);

  box-shadow:
    0 10px 24px rgba(169, 127, 76, 0.35),
    inset 0 0 0 3px rgba(255, 248, 238, 0.35);

  animation: cb-seal-pulse 3.2s ease-in-out infinite;
}

.cb-card__seal::before {
  content: "";
  position: absolute;
  inset: 6px;

  border: 1px dashed rgba(255, 248, 238, 0.55);
  border-radius: 50%;
}

.cb-card__seal span {
  font-family: "Allura", cursive;

  font-size: 26px;

  color: #fff8ee;

  text-shadow: 0 1px 2px rgba(120, 84, 40, 0.4);
}

.cb-card__invite {
  margin: 0 0 6px;

  color: var(--cb-rose);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
  text-indent: 0.26em;
}

.cb-card__inner h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(38px, 10vw, 48px);
  font-weight: 400;

  line-height: 1.15;

  color: var(--cb-deep);
}

.cb-card__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin: 14px 0;

  color: var(--cb-gold);
}

.cb-card__divider span {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 160, 106, 0.75));
}

.cb-card__divider span:last-child {
  transform: rotate(180deg);
}

.cb-card__divider i {
  font-size: 12px;
  font-style: normal;
}

.cb-card__names {
  margin: 0 0 16px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 19px;
  font-weight: 600;

  color: var(--cb-deep);
}

.cb-card__names i {
  padding: 0 5px;

  color: var(--cb-rose);

  font-family: "Allura", cursive;
  font-size: 22px;
  font-style: normal;
}

.cb-card__date {
  display: inline-block;

  padding: 8px 18px;

  border: 1px solid rgba(201, 160, 106, 0.45);
  border-radius: 999px;

  background: rgba(255, 252, 247, 0.7);

  color: var(--cb-rose);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.22em;
  text-indent: 0.22em;
}

/* =========================================================
   OPEN BUTTON
========================================================= */

.cb-open-btn {
  position: relative;
  z-index: 3;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 30px;

  padding: 13px 26px;

  border: 0;
  border-radius: 999px;

  color: #fff8ee;

  background: linear-gradient(135deg, #b67f7d, #8f5a56);

  box-shadow: 0 14px 30px rgba(108, 75, 74, 0.32);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;
  text-indent: 0.1em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.cb-open-btn:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 18px 36px rgba(108, 75, 74, 0.4);
}

.cb-open-btn:disabled {
  opacity: 0.75;
  cursor: default;
}

.cb-open-btn__icon {
  display: flex;
  align-items: center;
}

.cb-open-btn__arrow {
  font-size: 12px;
}

/* =========================================================
   HINT
========================================================= */

.cb-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 22px 0 0;

  color: rgba(108, 75, 74, 0.72);

  font-size: 10px;
  font-style: italic;

  letter-spacing: 0.06em;
}

.cb-hint span {
  width: 34px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 160, 106, 0.6));
}

.cb-hint span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   EXIT ANIMATION
========================================================= */

.cb-opening--active .cb-card {
  animation: cb-card-out 0.9s cubic-bezier(0.5, 0, 0.75, 0.4) both;
}

.cb-opening--active .cb-open-btn,
.cb-opening--active .cb-hint,
.cb-opening--active .cb-opening__brand,
.cb-opening--active .cb-opening__eyebrow {
  animation: cb-fade-out 0.45s ease both;
}

.cb-opening--active .cb-bubbles {
  opacity: 0;
  transition: opacity 0.6s ease;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes cb-bubble-rise {
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

@keyframes cb-glow-breathe {
  0%,
  100% {
    opacity: 0.65;
    transform: translateX(-50%) scale(0.96);
  }

  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.06);
  }
}

@keyframes cb-spin-bloom {
  to {
    transform: rotate(360deg);
  }
}

@keyframes cb-seal-pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow:
      0 10px 24px rgba(169, 127, 76, 0.35),
      inset 0 0 0 3px rgba(255, 248, 238, 0.35);
  }

  50% {
    transform: scale(1.05);
    box-shadow:
      0 14px 30px rgba(169, 127, 76, 0.45),
      inset 0 0 0 3px rgba(255, 248, 238, 0.5);
  }
}

@keyframes cb-card-in {
  from {
    opacity: 0;
    transform: translateY(34px) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes cb-card-out {
  to {
    opacity: 0;
    transform: translateY(-46px) scale(0.9);
  }
}

@keyframes cb-fade-out {
  to {
    opacity: 0;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .cb-card {
    width: 100%;
  }

  .cb-card__inner {
    padding: 32px 18px 28px;
  }

  .cb-card__seal {
    width: 64px;
    height: 64px;
  }

  .cb-card__seal span {
    font-size: 22px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .cb-bubble,
  .cb-opening__glow--1,
  .cb-opening__brand i,
  .cb-card__seal,
  .cb-card {
    animation: none;
  }
}
</style>
