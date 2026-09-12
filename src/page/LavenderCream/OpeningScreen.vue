<template>
  <section class="lc-opening" :class="{ 'lc-opening--active': opening }">
    <!-- =====================================================
         BACKGROUND
    ====================================================== -->
    <div class="lc-opening__bg"></div>
    <div class="lc-opening__glow lc-opening__glow--1"></div>
    <div class="lc-opening__glow lc-opening__glow--2"></div>

    <!-- Rising lavender sparkles -->
    <div class="lc-sparkles" aria-hidden="true">
      <span v-for="n in 12" :key="n" class="lc-sparkle" :class="`lc-sparkle--${n}`">✦</span>
    </div>

    <!-- =====================================================
         TOP BRANDING
    ====================================================== -->
    <div class="lc-opening__brand">
      <span></span>
      <i>❀</i>
      <span></span>
    </div>

    <p class="lc-opening__eyebrow">WEDDING INVITATION</p>

    <!-- =====================================================
         INVITATION CARD
    ====================================================== -->
    <div class="lc-card">
      <div class="lc-card__arch"></div>

      <div class="lc-card__inner">
        <p class="lc-card__kicker">SAVE THE DATE</p>

        <div class="lc-card__seal">
          <span>{{ monogram }}</span>
        </div>

        <p class="lc-card__invite">Trân trọng kính mời</p>

        <h1>{{ guestName }}</h1>

        <div class="lc-card__divider">
          <span></span>
          <i>❀</i>
          <span></span>
        </div>

        <p class="lc-card__names">
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </p>

        <p class="lc-card__date">{{ dateLabel || "OUR WEDDING DAY" }}</p>
      </div>
    </div>

    <!-- =====================================================
         OPEN BUTTON
    ====================================================== -->
    <button type="button" class="lc-open-btn" :disabled="opening" @click="openInvitation">
      <span class="lc-open-btn__icon">
        <v-icon size="16">mdi-email-open-outline</v-icon>
      </span>

      <span class="lc-open-btn__text">CHẠM ĐỂ MỞ THIỆP</span>

      <span class="lc-open-btn__arrow">↗</span>
    </button>

    <p class="lc-hint">
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
.lc-opening {
  --lc-deep: #584a5b;
  --lc-lavender: #a086b4;
  --lc-plum: #7d6390;
  --lc-lilac: #d8c0de;
  --lc-line: #b9a0d0;
  --lc-cream: #faf8fc;

  position: relative;
  isolation: isolate;

  min-height: 100svh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 34px 18px 28px;

  overflow: hidden;

  color: var(--lc-deep);

  background: linear-gradient(160deg, #f7f2fb 0%, #f0e7f6 38%, #e9dcf1 70%, #dfcfe9 100%);
}

/* =========================================================
   BACKGROUND
========================================================= */

.lc-opening__bg {
  position: absolute;
  inset: 0;
  z-index: -10;

  background:
    radial-gradient(ellipse at 50% 18%, rgba(252, 250, 255, 0.9), transparent 42%),
    radial-gradient(ellipse at 12% 82%, rgba(216, 192, 222, 0.45), transparent 38%),
    radial-gradient(ellipse at 88% 72%, rgba(160, 134, 180, 0.22), transparent 40%);
}

.lc-opening::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -5;

  opacity: 0.16;

  background-image: radial-gradient(rgba(88, 74, 91, 0.5) 0.6px, transparent 0.6px);
  background-size: 7px 7px;

  pointer-events: none;
}

.lc-opening__glow {
  position: absolute;
  z-index: -4;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(10px);
}

.lc-opening__glow--1 {
  width: 380px;
  height: 380px;
  top: 6%;
  left: 50%;
  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(250, 246, 255, 0.6), transparent 68%);

  animation: lc-glow-breathe 5.5s ease-in-out infinite;
}

.lc-opening__glow--2 {
  width: 260px;
  height: 260px;
  bottom: -90px;
  left: 50%;
  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(185, 160, 208, 0.24), transparent 70%);
}

/* =========================================================
   SPARKLES
========================================================= */

.lc-sparkles {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
}

.lc-sparkle {
  position: absolute;
  bottom: -40px;

  color: rgba(160, 134, 180, 0.6);

  text-shadow: 0 0 8px rgba(216, 192, 222, 0.85);

  animation: lc-sparkle-rise linear infinite;
}

.lc-sparkle--1 { left: 6%; font-size: 12px; animation-duration: 11s; animation-delay: 0s; }
.lc-sparkle--2 { left: 16%; font-size: 8px; animation-duration: 14s; animation-delay: 2.2s; }
.lc-sparkle--3 { left: 27%; font-size: 15px; animation-duration: 12.5s; animation-delay: 1s; }
.lc-sparkle--4 { left: 38%; font-size: 7px; animation-duration: 15s; animation-delay: 3.4s; }
.lc-sparkle--5 { left: 49%; font-size: 11px; animation-duration: 10.5s; animation-delay: 0.8s; }
.lc-sparkle--6 { left: 60%; font-size: 9px; animation-duration: 13.5s; animation-delay: 2.8s; }
.lc-sparkle--7 { left: 70%; font-size: 14px; animation-duration: 12s; animation-delay: 1.6s; }
.lc-sparkle--8 { left: 80%; font-size: 7px; animation-duration: 14.5s; animation-delay: 4s; }
.lc-sparkle--9 { left: 89%; font-size: 12px; animation-duration: 11.5s; animation-delay: 0.4s; }
.lc-sparkle--10 { left: 95%; font-size: 9px; animation-duration: 15.5s; animation-delay: 3s; }
.lc-sparkle--11 { left: 44%; font-size: 6px; animation-duration: 16s; animation-delay: 5s; }
.lc-sparkle--12 { left: 33%; font-size: 10px; animation-duration: 13s; animation-delay: 6s; }

/* =========================================================
   BRAND
========================================================= */

.lc-opening__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 10px;

  color: var(--lc-line);
}

.lc-opening__brand span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(185, 160, 208, 0.8));
}

.lc-opening__brand span:last-child {
  transform: rotate(180deg);
}

.lc-opening__brand i {
  font-size: 14px;
  font-style: normal;

  animation: lc-spin-bloom 9s linear infinite;
}

.lc-opening__eyebrow {
  margin: 0 0 26px;

  color: var(--lc-lavender);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.42em;
  text-indent: 0.42em;
}

/* =========================================================
   CARD
========================================================= */

.lc-card {
  position: relative;
  z-index: 2;

  width: min(100%, 360px);

  padding: 10px;

  border-radius: 190px 190px 26px 26px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.94), rgba(246, 240, 250, 0.9));

  box-shadow:
    0 26px 60px rgba(88, 74, 91, 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85);

  animation: lc-card-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.lc-card__arch {
  position: absolute;
  inset: 5px;

  border: 1px solid rgba(160, 134, 180, 0.55);
  border-radius: 184px 184px 22px 22px;

  box-shadow:
    inset 0 0 0 3px rgba(250, 246, 255, 0.9),
    inset 0 0 0 4px rgba(216, 192, 222, 0.55);

  pointer-events: none;
}

.lc-card__inner {
  position: relative;

  padding: 40px 26px 34px;

  text-align: center;
}

.lc-card__kicker {
  margin: 0 0 18px;

  color: var(--lc-line);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.lc-card__seal {
  position: relative;

  width: 74px;
  height: 74px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 20px;

  border-radius: 50%;

  background: radial-gradient(circle at 34% 30%, #c3a8d4, #a086b4 58%, #7d6390 100%);

  box-shadow:
    0 10px 24px rgba(125, 99, 144, 0.35),
    inset 0 0 0 3px rgba(250, 246, 255, 0.35);

  animation: lc-seal-pulse 3.2s ease-in-out infinite;
}

.lc-card__seal::before {
  content: "";
  position: absolute;
  inset: 6px;

  border: 1px dashed rgba(250, 246, 255, 0.55);
  border-radius: 50%;
}

.lc-card__seal span {
  font-family: "Allura", cursive;

  font-size: 26px;

  color: #fbf9ff;

  text-shadow: 0 1px 2px rgba(88, 60, 110, 0.4);
}

.lc-card__invite {
  margin: 0 0 6px;

  color: var(--lc-lavender);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
  text-indent: 0.26em;
}

.lc-card__inner h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(38px, 10vw, 48px);
  font-weight: 400;

  line-height: 1.15;

  color: var(--lc-deep);
}

.lc-card__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin: 14px 0;

  color: var(--lc-line);
}

.lc-card__divider span {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(185, 160, 208, 0.75));
}

.lc-card__divider span:last-child {
  transform: rotate(180deg);
}

.lc-card__divider i {
  font-size: 12px;
  font-style: normal;
}

.lc-card__names {
  margin: 0 0 16px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 19px;
  font-weight: 600;

  color: var(--lc-deep);
}

.lc-card__names i {
  padding: 0 5px;

  color: var(--lc-lavender);

  font-family: "Allura", cursive;
  font-size: 22px;
  font-style: normal;
}

.lc-card__date {
  display: inline-block;

  padding: 8px 18px;

  border: 1px solid rgba(185, 160, 208, 0.45);
  border-radius: 999px;

  background: rgba(252, 250, 255, 0.7);

  color: var(--lc-lavender);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.22em;
  text-indent: 0.22em;
}

/* =========================================================
   OPEN BUTTON
========================================================= */

.lc-open-btn {
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

  color: #fbf9ff;

  background: linear-gradient(135deg, #a086b4, #7d6390);

  box-shadow: 0 14px 30px rgba(88, 74, 91, 0.32);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;
  text-indent: 0.1em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.lc-open-btn:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 18px 36px rgba(88, 74, 91, 0.4);
}

.lc-open-btn:disabled {
  opacity: 0.75;
  cursor: default;
}

.lc-open-btn__icon {
  display: flex;
  align-items: center;
}

.lc-open-btn__arrow {
  font-size: 12px;
}

/* =========================================================
   HINT
========================================================= */

.lc-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 22px 0 0;

  color: rgba(88, 74, 91, 0.72);

  font-size: 10px;
  font-style: italic;

  letter-spacing: 0.06em;
}

.lc-hint span {
  width: 34px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(185, 160, 208, 0.6));
}

.lc-hint span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   EXIT ANIMATION
========================================================= */

.lc-opening--active .lc-card {
  animation: lc-card-out 0.9s cubic-bezier(0.5, 0, 0.75, 0.4) both;
}

.lc-opening--active .lc-open-btn,
.lc-opening--active .lc-hint,
.lc-opening--active .lc-opening__brand,
.lc-opening--active .lc-opening__eyebrow {
  animation: lc-fade-out 0.45s ease both;
}

.lc-opening--active .lc-sparkles {
  opacity: 0;
  transition: opacity 0.6s ease;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes lc-sparkle-rise {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(0.7);
    opacity: 0;
  }

  12% {
    opacity: 0.9;
  }

  50% {
    transform: translateY(-46vh) translateX(12px) rotate(150deg) scale(1);
  }

  88% {
    opacity: 0.75;
  }

  100% {
    transform: translateY(-96vh) translateX(-8px) rotate(320deg) scale(1.12);
    opacity: 0;
  }
}

@keyframes lc-glow-breathe {
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

@keyframes lc-spin-bloom {
  to {
    transform: rotate(360deg);
  }
}

@keyframes lc-seal-pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow:
      0 10px 24px rgba(125, 99, 144, 0.35),
      inset 0 0 0 3px rgba(250, 246, 255, 0.35);
  }

  50% {
    transform: scale(1.05);
    box-shadow:
      0 14px 30px rgba(125, 99, 144, 0.45),
      inset 0 0 0 3px rgba(250, 246, 255, 0.5);
  }
}

@keyframes lc-card-in {
  from {
    opacity: 0;
    transform: translateY(34px) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes lc-card-out {
  to {
    opacity: 0;
    transform: translateY(-46px) scale(0.9);
  }
}

@keyframes lc-fade-out {
  to {
    opacity: 0;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .lc-card {
    width: 100%;
  }

  .lc-card__inner {
    padding: 32px 18px 28px;
  }

  .lc-card__seal {
    width: 64px;
    height: 64px;
  }

  .lc-card__seal span {
    font-size: 22px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .lc-sparkle,
  .lc-opening__glow--1,
  .lc-opening__brand i,
  .lc-card__seal,
  .lc-card {
    animation: none;
  }
}
</style>
