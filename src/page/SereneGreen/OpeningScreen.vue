<template>
  <section class="sg-opening" :class="{ 'sg-opening--active': opening }">
    <!-- =====================================================
         BACKGROUND
    ====================================================== -->
    <div class="sg-opening__bg"></div>
    <div class="sg-opening__glow sg-opening__glow--1"></div>
    <div class="sg-opening__glow sg-opening__glow--2"></div>

    <!-- Rising leaf & sparkle particles -->
    <div class="sg-particles" aria-hidden="true">
      <span v-for="n in 12" :key="n" class="sg-particle" :class="`sg-particle--${n}`">
        {{ n % 3 === 0 ? "❀" : "✦" }}
      </span>
    </div>

    <!-- =====================================================
         TOP BRANDING
    ====================================================== -->
    <div class="sg-opening__brand">
      <span></span>
      <i>❀</i>
      <span></span>
    </div>

    <p class="sg-opening__eyebrow">WEDDING INVITATION</p>

    <!-- =====================================================
         INVITATION CARD
    ====================================================== -->
    <div class="sg-card">
      <div class="sg-card__arch"></div>

      <div class="sg-card__inner">
        <p class="sg-card__kicker">SAVE THE DATE</p>

        <div class="sg-card__seal">
          <span>{{ monogram }}</span>
        </div>

        <p class="sg-card__invite">Trân trọng kính mời</p>

        <h1>{{ guestName }}</h1>

        <div class="sg-card__divider">
          <span></span>
          <i>❀</i>
          <span></span>
        </div>

        <p class="sg-card__names">
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </p>

        <p class="sg-card__date">{{ dateLabel || "OUR WEDDING DAY" }}</p>
      </div>
    </div>

    <!-- =====================================================
         OPEN BUTTON
    ====================================================== -->
    <button type="button" class="sg-open-btn" :disabled="opening" @click="openInvitation">
      <span class="sg-open-btn__icon">
        <v-icon size="16">mdi-email-open-outline</v-icon>
      </span>

      <span class="sg-open-btn__text">CHẠM ĐỂ MỞ THIỆP</span>

      <span class="sg-open-btn__arrow">↗</span>
    </button>

    <p class="sg-hint">
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
    "Quý khách"
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
.sg-opening {
  --sg-deep: #28514b;
  --sg-leaf: #6c8e7a;
  --sg-pine: #3f6f63;
  --sg-sage: #c8d4c3;
  --sg-line: #8fae9b;
  --sg-cream: #f5f8f4;

  position: relative;
  isolation: isolate;

  min-height: 100svh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 34px 18px 28px;

  overflow: hidden;

  color: var(--sg-deep);

  background: linear-gradient(160deg, #f5f8f4 0%, #edf4eb 38%, #e3efe0 70%, #d8e8d5 100%);
}

/* =========================================================
   BACKGROUND
========================================================= */

.sg-opening__bg {
  position: absolute;
  inset: 0;
  z-index: -10;

  background:
    radial-gradient(ellipse at 50% 18%, rgba(255, 255, 255, 0.85), transparent 42%),
    radial-gradient(ellipse at 12% 82%, rgba(200, 212, 195, 0.4), transparent 38%),
    radial-gradient(ellipse at 88% 72%, rgba(108, 142, 122, 0.22), transparent 40%);
}

.sg-opening::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -5;

  opacity: 0.14;

  background-image: radial-gradient(rgba(40, 81, 75, 0.5) 0.6px, transparent 0.6px);
  background-size: 7px 7px;

  pointer-events: none;
}

.sg-opening__glow {
  position: absolute;
  z-index: -4;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(10px);
}

.sg-opening__glow--1 {
  width: 380px;
  height: 380px;
  top: 6%;
  left: 50%;
  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(255, 255, 255, 0.55), transparent 68%);

  animation: sg-glow-breathe 5.5s ease-in-out infinite;
}

.sg-opening__glow--2 {
  width: 260px;
  height: 260px;
  bottom: -90px;
  left: 50%;
  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(143, 174, 155, 0.22), transparent 70%);
}

/* =========================================================
   PARTICLES
========================================================= */

.sg-particles {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
}

.sg-particle {
  position: absolute;
  bottom: -40px;

  color: rgba(108, 142, 122, 0.55);

  font-size: 12px;

  text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);

  animation: sg-particle-rise linear infinite;
}

.sg-particle--1 { left: 6%; font-size: 13px; animation-duration: 11s; animation-delay: 0s; }
.sg-particle--2 { left: 16%; font-size: 9px; animation-duration: 14s; animation-delay: 2.2s; }
.sg-particle--3 { left: 27%; font-size: 15px; animation-duration: 12.5s; animation-delay: 1s; }
.sg-particle--4 { left: 38%; font-size: 8px; animation-duration: 15s; animation-delay: 3.4s; }
.sg-particle--5 { left: 49%; font-size: 11px; animation-duration: 10.5s; animation-delay: 0.8s; }
.sg-particle--6 { left: 60%; font-size: 9px; animation-duration: 13.5s; animation-delay: 2.8s; }
.sg-particle--7 { left: 70%; font-size: 14px; animation-duration: 12s; animation-delay: 1.6s; }
.sg-particle--8 { left: 80%; font-size: 8px; animation-duration: 14.5s; animation-delay: 4s; }
.sg-particle--9 { left: 89%; font-size: 12px; animation-duration: 11.5s; animation-delay: 0.4s; }
.sg-particle--10 { left: 95%; font-size: 9px; animation-duration: 15.5s; animation-delay: 3s; }
.sg-particle--11 { left: 44%; font-size: 7px; animation-duration: 16s; animation-delay: 5s; }
.sg-particle--12 { left: 33%; font-size: 10px; animation-duration: 13s; animation-delay: 6s; }

/* =========================================================
   BRAND
========================================================= */

.sg-opening__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 10px;

  color: var(--sg-line);
}

.sg-opening__brand span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(143, 174, 155, 0.8));
}

.sg-opening__brand span:last-child {
  transform: rotate(180deg);
}

.sg-opening__brand i {
  font-size: 14px;
  font-style: normal;

  animation: sg-spin-bloom 9s linear infinite;
}

.sg-opening__eyebrow {
  margin: 0 0 26px;

  color: var(--sg-leaf);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.42em;
  text-indent: 0.42em;
}

/* =========================================================
   CARD
========================================================= */

.sg-card {
  position: relative;
  z-index: 2;

  width: min(100%, 360px);

  padding: 10px;

  border-radius: 190px 190px 26px 26px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.94), rgba(240, 246, 238, 0.9));

  box-shadow:
    0 26px 60px rgba(40, 81, 75, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.8);

  animation: sg-card-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.sg-card__arch {
  position: absolute;
  inset: 5px;

  border: 1px solid rgba(143, 174, 155, 0.55);
  border-radius: 184px 184px 22px 22px;

  pointer-events: none;
}

.sg-card__inner {
  position: relative;

  padding: 40px 26px 34px;

  text-align: center;
}

.sg-card__kicker {
  margin: 0 0 18px;

  color: var(--sg-line);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.sg-card__seal {
  position: relative;

  width: 74px;
  height: 74px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 20px;

  border-radius: 50%;

  background: radial-gradient(circle at 34% 30%, #8fb3a0, #6c8e7a 58%, #3f6f63 100%);

  box-shadow:
    0 10px 24px rgba(63, 111, 99, 0.35),
    inset 0 0 0 3px rgba(245, 248, 244, 0.35);

  animation: sg-seal-pulse 3.2s ease-in-out infinite;
}

.sg-card__seal::before {
  content: "";
  position: absolute;
  inset: 6px;

  border: 1px dashed rgba(245, 248, 244, 0.55);
  border-radius: 50%;
}

.sg-card__seal span {
  font-family: "Allura", cursive;

  font-size: 26px;

  color: #f2f8f0;

  text-shadow: 0 1px 2px rgba(30, 70, 60, 0.4);
}

.sg-card__invite {
  margin: 0 0 6px;

  color: var(--sg-leaf);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
  text-indent: 0.26em;
}

.sg-card__inner h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(38px, 10vw, 48px);
  font-weight: 400;

  line-height: 1.15;

  color: var(--sg-deep);
}

.sg-card__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin: 14px 0;

  color: var(--sg-line);
}

.sg-card__divider span {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(143, 174, 155, 0.75));
}

.sg-card__divider span:last-child {
  transform: rotate(180deg);
}

.sg-card__divider i {
  font-size: 12px;
  font-style: normal;
}

.sg-card__names {
  margin: 0 0 16px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 19px;
  font-weight: 600;

  color: var(--sg-deep);
}

.sg-card__names i {
  padding: 0 5px;

  color: var(--sg-leaf);

  font-family: "Allura", cursive;
  font-size: 22px;
  font-style: normal;
}

.sg-card__date {
  display: inline-block;

  padding: 8px 18px;

  border: 1px solid rgba(143, 174, 155, 0.5);
  border-radius: 999px;

  background: rgba(251, 253, 250, 0.7);

  color: var(--sg-leaf);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.22em;
  text-indent: 0.22em;
}

/* =========================================================
   OPEN BUTTON
========================================================= */

.sg-open-btn {
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

  color: #f2f8f0;

  background: linear-gradient(135deg, #6c8e7a, #3f6f63);

  box-shadow: 0 14px 30px rgba(40, 81, 75, 0.32);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;
  text-indent: 0.1em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.sg-open-btn:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 18px 36px rgba(40, 81, 75, 0.4);
}

.sg-open-btn:disabled {
  opacity: 0.75;
  cursor: default;
}

.sg-open-btn__icon {
  display: flex;
  align-items: center;
}

.sg-open-btn__arrow {
  font-size: 12px;
}

/* =========================================================
   HINT
========================================================= */

.sg-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 22px 0 0;

  color: rgba(40, 81, 75, 0.72);

  font-size: 10px;
  font-style: italic;

  letter-spacing: 0.06em;
}

.sg-hint span {
  width: 34px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(143, 174, 155, 0.6));
}

.sg-hint span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   EXIT ANIMATION
========================================================= */

.sg-opening--active .sg-card {
  animation: sg-card-out 0.9s cubic-bezier(0.5, 0, 0.75, 0.4) both;
}

.sg-opening--active .sg-open-btn,
.sg-opening--active .sg-hint,
.sg-opening--active .sg-opening__brand,
.sg-opening--active .sg-opening__eyebrow {
  animation: sg-fade-out 0.45s ease both;
}

.sg-opening--active .sg-particles {
  opacity: 0;
  transition: opacity 0.6s ease;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes sg-particle-rise {
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

@keyframes sg-glow-breathe {
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

@keyframes sg-spin-bloom {
  to {
    transform: rotate(360deg);
  }
}

@keyframes sg-seal-pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow:
      0 10px 24px rgba(63, 111, 99, 0.35),
      inset 0 0 0 3px rgba(245, 248, 244, 0.35);
  }

  50% {
    transform: scale(1.05);
    box-shadow:
      0 14px 30px rgba(63, 111, 99, 0.45),
      inset 0 0 0 3px rgba(245, 248, 244, 0.5);
  }
}

@keyframes sg-card-in {
  from {
    opacity: 0;
    transform: translateY(34px) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes sg-card-out {
  to {
    opacity: 0;
    transform: translateY(-46px) scale(0.9);
  }
}

@keyframes sg-fade-out {
  to {
    opacity: 0;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .sg-card {
    width: 100%;
  }

  .sg-card__inner {
    padding: 32px 18px 28px;
  }

  .sg-card__seal {
    width: 64px;
    height: 64px;
  }

  .sg-card__seal span {
    font-size: 22px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .sg-particle,
  .sg-opening__glow--1,
  .sg-opening__brand i,
  .sg-card__seal,
  .sg-card {
    animation: none;
  }
}
</style>
