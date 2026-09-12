<template>
  <section class="mg-opening" :class="{ 'mg-opening--active': opening }">
    <!-- =====================================================
         BACKGROUND
    ====================================================== -->
    <div class="mg-opening__bg"></div>
    <div class="mg-opening__glow mg-opening__glow--1"></div>
    <div class="mg-opening__glow mg-opening__glow--2"></div>

    <!-- Rising gold sparkles -->
    <div class="mg-sparkles" aria-hidden="true">
      <span v-for="n in 12" :key="n" class="mg-sparkle" :class="`mg-sparkle--${n}`">✦</span>
    </div>

    <!-- =====================================================
         TOP BRANDING
    ====================================================== -->
    <div class="mg-opening__brand">
      <span></span>
      <i>✧</i>
      <span></span>
    </div>

    <p class="mg-opening__eyebrow">WEDDING INVITATION</p>

    <!-- =====================================================
         INVITATION CARD
    ====================================================== -->
    <div class="mg-card">
      <div class="mg-card__arch"></div>

      <div class="mg-card__inner">
        <p class="mg-card__kicker">SAVE THE DATE</p>

        <div class="mg-card__seal">
          <span>{{ monogram }}</span>
        </div>

        <p class="mg-card__invite">Trân trọng kính mời</p>

        <h1>{{ guestName }}</h1>

        <div class="mg-card__divider">
          <span></span>
          <i>✦</i>
          <span></span>
        </div>

        <p class="mg-card__names">
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </p>

        <p class="mg-card__date">{{ dateLabel || "OUR WEDDING DAY" }}</p>
      </div>
    </div>

    <!-- =====================================================
         OPEN BUTTON
    ====================================================== -->
    <button type="button" class="mg-open-btn" :disabled="opening" @click="openInvitation">
      <span class="mg-open-btn__icon">
        <v-icon size="16">mdi-email-open-outline</v-icon>
      </span>

      <span class="mg-open-btn__text">CHẠM ĐỂ MỞ THIỆP</span>

      <span class="mg-open-btn__arrow">↗</span>
    </button>

    <p class="mg-hint">
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
.mg-opening {
  --mg-gold: #d8b676;
  --mg-gold-deep: #9b7d4d;
  --mg-gold-bright: #eed9a8;
  --mg-text: #f0e6d2;
  --mg-text-muted: #b9a88f;
  --mg-night: #1d1622;

  position: relative;
  isolation: isolate;

  min-height: 100svh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 34px 18px 28px;

  overflow: hidden;

  color: var(--mg-text);

  background: linear-gradient(180deg, #1d1622 0%, #17121b 45%, #120e15 100%);
}

/* =========================================================
   BACKGROUND
========================================================= */

.mg-opening__bg {
  position: absolute;
  inset: 0;
  z-index: -10;

  background:
    radial-gradient(1100px 500px at 50% -140px, rgba(216, 182, 118, 0.12), transparent 65%),
    radial-gradient(ellipse at 12% 82%, rgba(216, 182, 118, 0.05), transparent 38%),
    radial-gradient(ellipse at 88% 72%, rgba(155, 125, 77, 0.08), transparent 40%);
}

.mg-opening::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -5;

  opacity: 0.2;

  background-image: radial-gradient(rgba(216, 182, 118, 0.35) 0.6px, transparent 0.6px);
  background-size: 7px 7px;

  pointer-events: none;
}

.mg-opening__glow {
  position: absolute;
  z-index: -4;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(10px);
}

.mg-opening__glow--1 {
  width: 380px;
  height: 380px;
  top: 6%;
  left: 50%;
  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(216, 182, 118, 0.16), transparent 68%);

  animation: mg-glow-breathe 5.5s ease-in-out infinite;
}

.mg-opening__glow--2 {
  width: 260px;
  height: 260px;
  bottom: -90px;
  left: 50%;
  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(216, 182, 118, 0.1), transparent 70%);
}

/* =========================================================
   SPARKLES
========================================================= */

.mg-sparkles {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
}

.mg-sparkle {
  position: absolute;
  bottom: -40px;

  color: rgba(216, 182, 118, 0.75);

  text-shadow: 0 0 8px rgba(216, 182, 118, 0.55);

  animation: mg-sparkle-rise linear infinite;
}

.mg-sparkle--1 { left: 6%; font-size: 12px; animation-duration: 11s; animation-delay: 0s; }
.mg-sparkle--2 { left: 16%; font-size: 8px; animation-duration: 14s; animation-delay: 2.2s; }
.mg-sparkle--3 { left: 27%; font-size: 15px; animation-duration: 12.5s; animation-delay: 1s; }
.mg-sparkle--4 { left: 38%; font-size: 7px; animation-duration: 15s; animation-delay: 3.4s; }
.mg-sparkle--5 { left: 49%; font-size: 11px; animation-duration: 10.5s; animation-delay: 0.8s; }
.mg-sparkle--6 { left: 60%; font-size: 9px; animation-duration: 13.5s; animation-delay: 2.8s; }
.mg-sparkle--7 { left: 70%; font-size: 14px; animation-duration: 12s; animation-delay: 1.6s; }
.mg-sparkle--8 { left: 80%; font-size: 7px; animation-duration: 14.5s; animation-delay: 4s; }
.mg-sparkle--9 { left: 89%; font-size: 12px; animation-duration: 11.5s; animation-delay: 0.4s; }
.mg-sparkle--10 { left: 95%; font-size: 9px; animation-duration: 15.5s; animation-delay: 3s; }
.mg-sparkle--11 { left: 44%; font-size: 6px; animation-duration: 16s; animation-delay: 5s; }
.mg-sparkle--12 { left: 33%; font-size: 10px; animation-duration: 13s; animation-delay: 6s; }

/* =========================================================
   BRAND
========================================================= */

.mg-opening__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 10px;

  color: var(--mg-gold);
}

.mg-opening__brand span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(216, 182, 118, 0.8));
}

.mg-opening__brand span:last-child {
  transform: rotate(180deg);
}

.mg-opening__brand i {
  font-size: 14px;
  font-style: normal;

  animation: mg-spin-bloom 9s linear infinite;
}

.mg-opening__eyebrow {
  margin: 0 0 26px;

  color: var(--mg-text-muted);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.42em;
  text-indent: 0.42em;
}

/* =========================================================
   CARD
========================================================= */

.mg-card {
  position: relative;
  z-index: 2;

  width: min(100%, 360px);

  padding: 10px;

  border-radius: 190px 190px 26px 26px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.02));

  box-shadow:
    0 26px 60px rgba(0, 0, 0, 0.45),
    inset 0 0 0 1px rgba(216, 182, 118, 0.28);

  animation: mg-card-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.mg-card__arch {
  position: absolute;
  inset: 5px;

  border: 1px solid rgba(216, 182, 118, 0.5);
  border-radius: 184px 184px 22px 22px;

  pointer-events: none;
}

.mg-card__inner {
  position: relative;

  padding: 40px 26px 34px;

  text-align: center;
}

.mg-card__kicker {
  margin: 0 0 18px;

  color: var(--mg-gold);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.mg-card__seal {
  position: relative;

  width: 74px;
  height: 74px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 20px;

  border-radius: 50%;

  background: radial-gradient(circle at 34% 30%, #eed9a8, #d8b676 58%, #9b7d4d 100%);

  box-shadow:
    0 10px 24px rgba(216, 182, 118, 0.25),
    0 0 30px rgba(216, 182, 118, 0.2),
    inset 0 0 0 3px rgba(38, 29, 35, 0.35);

  animation: mg-seal-pulse 3.2s ease-in-out infinite;
}

.mg-card__seal::before {
  content: "";
  position: absolute;
  inset: 6px;

  border: 1px dashed rgba(38, 29, 35, 0.55);
  border-radius: 50%;
}

.mg-card__seal span {
  font-family: "Allura", cursive;

  font-size: 26px;

  color: #261d23;

  text-shadow: 0 1px 2px rgba(238, 217, 168, 0.4);
}

.mg-card__invite {
  margin: 0 0 6px;

  color: var(--mg-text-muted);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
  text-indent: 0.26em;
}

.mg-card__inner h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(38px, 10vw, 48px);
  font-weight: 400;

  line-height: 1.15;

  color: var(--mg-gold);
}

.mg-card__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin: 14px 0;

  color: var(--mg-gold);
}

.mg-card__divider span {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(216, 182, 118, 0.75));
}

.mg-card__divider span:last-child {
  transform: rotate(180deg);
}

.mg-card__divider i {
  font-size: 12px;
  font-style: normal;
}

.mg-card__names {
  margin: 0 0 16px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 19px;
  font-weight: 600;

  color: var(--mg-text);
}

.mg-card__names i {
  padding: 0 5px;

  color: var(--mg-gold);

  font-family: "Allura", cursive;
  font-size: 22px;
  font-style: normal;
}

.mg-card__date {
  display: inline-block;

  padding: 8px 18px;

  border: 1px solid rgba(216, 182, 118, 0.45);
  border-radius: 999px;

  background: rgba(216, 182, 118, 0.08);

  color: var(--mg-gold-bright);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.22em;
  text-indent: 0.22em;
}

/* =========================================================
   OPEN BUTTON
========================================================= */

.mg-open-btn {
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

  color: #261d23;

  background: linear-gradient(135deg, #d8b676, #9b7d4d);

  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45), 0 0 24px rgba(216, 182, 118, 0.15);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;
  text-indent: 0.1em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.mg-open-btn:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.5), 0 0 32px rgba(216, 182, 118, 0.25);
}

.mg-open-btn:disabled {
  opacity: 0.75;
  cursor: default;
}

.mg-open-btn__icon {
  display: flex;
  align-items: center;
}

.mg-open-btn__arrow {
  font-size: 12px;
}

/* =========================================================
   HINT
========================================================= */

.mg-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 22px 0 0;

  color: rgba(185, 168, 143, 0.72);

  font-size: 10px;
  font-style: italic;

  letter-spacing: 0.06em;
}

.mg-hint span {
  width: 34px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(216, 182, 118, 0.6));
}

.mg-hint span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   EXIT ANIMATION
========================================================= */

.mg-opening--active .mg-card {
  animation: mg-card-out 0.9s cubic-bezier(0.5, 0, 0.75, 0.4) both;
}

.mg-opening--active .mg-open-btn,
.mg-opening--active .mg-hint,
.mg-opening--active .mg-opening__brand,
.mg-opening--active .mg-opening__eyebrow {
  animation: mg-fade-out 0.45s ease both;
}

.mg-opening--active .mg-sparkles {
  opacity: 0;
  transition: opacity 0.6s ease;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes mg-sparkle-rise {
  0% {
    transform: translateY(0) translateX(0) scale(0.7) rotate(0deg);
    opacity: 0;
  }

  12% {
    opacity: 0.9;
  }

  50% {
    transform: translateY(-46vh) translateX(12px) scale(1) rotate(160deg);
  }

  88% {
    opacity: 0.75;
  }

  100% {
    transform: translateY(-96vh) translateX(-8px) scale(1.12) rotate(340deg);
    opacity: 0;
  }
}

@keyframes mg-glow-breathe {
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

@keyframes mg-spin-bloom {
  to {
    transform: rotate(360deg);
  }
}

@keyframes mg-seal-pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow:
      0 10px 24px rgba(216, 182, 118, 0.25),
      0 0 30px rgba(216, 182, 118, 0.2),
      inset 0 0 0 3px rgba(38, 29, 35, 0.35);
  }

  50% {
    transform: scale(1.05);
    box-shadow:
      0 14px 30px rgba(216, 182, 118, 0.35),
      0 0 44px rgba(216, 182, 118, 0.3),
      inset 0 0 0 3px rgba(38, 29, 35, 0.5);
  }
}

@keyframes mg-card-in {
  from {
    opacity: 0;
    transform: translateY(34px) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes mg-card-out {
  to {
    opacity: 0;
    transform: translateY(-46px) scale(0.9);
  }
}

@keyframes mg-fade-out {
  to {
    opacity: 0;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .mg-card {
    width: 100%;
  }

  .mg-card__inner {
    padding: 32px 18px 28px;
  }

  .mg-card__seal {
    width: 64px;
    height: 64px;
  }

  .mg-card__seal span {
    font-size: 22px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .mg-sparkle,
  .mg-opening__glow--1,
  .mg-opening__brand i,
  .mg-card__seal,
  .mg-card {
    animation: none;
  }
}
</style>
