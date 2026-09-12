<template>
  <section class="ob-opening" :class="{ 'ob-opening--active': opening }">
    <!-- =====================================================
         SEA BACKGROUND
    ====================================================== -->
    <div class="ob-opening__depth"></div>
    <div class="ob-opening__sun"></div>
    <div class="ob-opening__haze"></div>

    <!-- Rising sea bubbles -->
    <div class="ob-bubbles" aria-hidden="true">
      <span v-for="n in 14" :key="n" class="ob-bubble" :class="`ob-bubble--${n}`"></span>
    </div>

    <!-- =====================================================
         TOP BRANDING
    ====================================================== -->
    <div class="ob-opening__brand">
      <span class="ob-opening__brand-line"></span>
      <i>〜</i>
      <span class="ob-opening__brand-line ob-opening__brand-line--flip"></span>
    </div>

    <p class="ob-opening__eyebrow">WEDDING INVITATION</p>

    <!-- =====================================================
         INVITATION CARD
    ====================================================== -->
    <div class="ob-card">
      <div class="ob-card__wave-top"></div>

      <div class="ob-card__inner">
        <p class="ob-card__kicker">SAVE THE DATE</p>

        <div class="ob-card__seal">
          <span class="ob-card__seal-ring"></span>
          <span class="ob-card__seal-text">{{ monogram }}</span>
        </div>

        <p class="ob-card__invite">Trân trọng kính mời</p>

        <h1>{{ guestName }}</h1>

        <div class="ob-card__divider">
          <span></span>
          <i>❊</i>
          <span class="ob-card__divider-flip"></span>
        </div>

        <p class="ob-card__names">
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </p>

        <p class="ob-card__date">{{ dateLabel || "OUR WEDDING DAY" }}</p>
      </div>

      <div class="ob-card__wave-bottom"></div>
    </div>

    <!-- =====================================================
         OPEN BUTTON
    ====================================================== -->
    <button type="button" class="ob-open-btn" :disabled="opening" @click="openInvitation">
      <span class="ob-open-btn__icon">
        <v-icon size="16">mdi-email-open-outline</v-icon>
      </span>

      <span class="ob-open-btn__text">MỞ THIỆP</span>

      <span class="ob-open-btn__arrow">〜</span>
    </button>

    <p class="ob-hint">
      <span></span>
      Một lời mời · Một bờ biển · Một ngày diệu kỳ
      <span class="ob-hint-flip"></span>
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
.ob-opening {
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

  min-height: 100svh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 34px 18px 28px;

  overflow: hidden;

  color: var(--ob-text);

  background: linear-gradient(175deg, #e2f1f5 0%, #bfe0ea 30%, #7db9cf 62%, #4a9ab8 100%);
}

/* =========================================================
   BACKGROUND
========================================================= */

.ob-opening__depth {
  position: absolute;
  inset: 0;
  z-index: -10;

  background:
    radial-gradient(ellipse at 50% 8%, rgba(255, 255, 255, 0.75), transparent 46%),
    radial-gradient(ellipse at 10% 88%, rgba(29, 106, 142, 0.28), transparent 42%),
    radial-gradient(ellipse at 90% 80%, rgba(74, 154, 184, 0.3), transparent 44%);
}

.ob-opening::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -5;

  opacity: 0.14;

  background-image: radial-gradient(rgba(39, 75, 92, 0.55) 0.6px, transparent 0.6px);
  background-size: 8px 8px;

  pointer-events: none;
}

.ob-opening__sun {
  position: absolute;
  z-index: -4;

  width: 340px;
  height: 340px;
  top: -110px;
  left: 50%;
  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(circle, rgba(255, 244, 224, 0.85), rgba(232, 217, 189, 0.35) 46%, transparent 70%);

  filter: blur(6px);

  animation: ob-sun-breathe 6s ease-in-out infinite;

  pointer-events: none;
}

.ob-opening__haze {
  position: absolute;
  z-index: -4;

  left: 0;
  right: 0;
  bottom: 0;
  height: 34%;

  background: linear-gradient(180deg, transparent, rgba(29, 106, 142, 0.22));

  pointer-events: none;
}

/* =========================================================
   BUBBLES
========================================================= */

.ob-bubbles {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
}

.ob-bubble {
  position: absolute;
  bottom: -46px;

  border-radius: 50%;

  background: radial-gradient(
    circle at 32% 28%,
    rgba(255, 255, 255, 0.9),
    rgba(226, 241, 245, 0.32) 55%,
    rgba(74, 154, 184, 0.14) 100%
  );

  box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.75);

  animation: ob-bubble-rise linear infinite;
}

.ob-bubble--1 { left: 5%; width: 15px; height: 15px; animation-duration: 11s; animation-delay: 0s; }
.ob-bubble--2 { left: 14%; width: 8px; height: 8px; animation-duration: 14s; animation-delay: 2.2s; }
.ob-bubble--3 { left: 24%; width: 19px; height: 19px; animation-duration: 12.5s; animation-delay: 1s; }
.ob-bubble--4 { left: 35%; width: 7px; height: 7px; animation-duration: 15s; animation-delay: 3.4s; }
.ob-bubble--5 { left: 46%; width: 12px; height: 12px; animation-duration: 10.5s; animation-delay: 0.8s; }
.ob-bubble--6 { left: 56%; width: 9px; height: 9px; animation-duration: 13.5s; animation-delay: 2.8s; }
.ob-bubble--7 { left: 66%; width: 17px; height: 17px; animation-duration: 12s; animation-delay: 1.6s; }
.ob-bubble--8 { left: 76%; width: 7px; height: 7px; animation-duration: 14.5s; animation-delay: 4s; }
.ob-bubble--9 { left: 85%; width: 13px; height: 13px; animation-duration: 11.5s; animation-delay: 0.4s; }
.ob-bubble--10 { left: 93%; width: 10px; height: 10px; animation-duration: 15.5s; animation-delay: 3s; }
.ob-bubble--11 { left: 42%; width: 6px; height: 6px; animation-duration: 16s; animation-delay: 5s; }
.ob-bubble--12 { left: 31%; width: 11px; height: 11px; animation-duration: 13s; animation-delay: 6s; }
.ob-bubble--13 { left: 60%; width: 6px; height: 6px; animation-duration: 16.5s; animation-delay: 4.4s; }
.ob-bubble--14 { left: 90%; width: 8px; height: 8px; animation-duration: 12.8s; animation-delay: 5.6s; }

/* =========================================================
   BRAND
========================================================= */

.ob-opening__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 10px;

  color: rgba(255, 255, 255, 0.9);
}

.ob-opening__brand-line {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.85));
}

.ob-opening__brand-line--flip {
  transform: rotate(180deg);
}

.ob-opening__brand i {
  font-size: 15px;
  font-style: normal;

  animation: ob-drift 7s ease-in-out infinite;
}

.ob-opening__eyebrow {
  margin: 0 0 26px;

  color: rgba(255, 255, 255, 0.92);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.42em;
  text-indent: 0.42em;

  text-shadow: 0 1px 6px rgba(29, 106, 142, 0.4);
}

/* =========================================================
   CARD
========================================================= */

.ob-card {
  position: relative;
  z-index: 2;

  width: min(100%, 360px);

  border-radius: 26px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.96), rgba(244, 250, 252, 0.92));

  box-shadow:
    0 26px 60px rgba(23, 74, 96, 0.28),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85);

  animation: ob-card-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both, ob-card-bob 5.5s ease-in-out 1s infinite;
}

.ob-card__wave-top {
  height: 14px;

  border-radius: 26px 26px 0 0;

  background:
    radial-gradient(circle at 10px -6px, transparent 12px, rgba(168, 208, 220, 0.55) 13px, transparent 14px) repeat-x;
  background-size: 24px 18px;
  background-position: 0 6px;

  opacity: 0.9;
}

.ob-card__inner {
  position: relative;

  padding: 26px 26px 30px;

  text-align: center;
}

.ob-card__kicker {
  margin: 0 0 18px;

  color: var(--ob-seafoam);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.ob-card__seal {
  position: relative;

  width: 76px;
  height: 76px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 20px;

  border-radius: 50%;

  background: radial-gradient(circle at 34% 28%, #7db9cf, #4a9ab8 58%, #1d6a8e 100%);

  box-shadow:
    0 10px 24px rgba(29, 106, 142, 0.35),
    inset 0 0 0 3px rgba(255, 255, 255, 0.35);

  animation: ob-seal-pulse 3.2s ease-in-out infinite;
}

.ob-card__seal-ring {
  position: absolute;
  inset: 6px;

  border: 1px dashed rgba(255, 255, 255, 0.6);
  border-radius: 50%;
}

.ob-card__seal-text {
  font-family: "Allura", cursive;

  font-size: 26px;

  color: #ffffff;

  text-shadow: 0 1px 2px rgba(23, 74, 96, 0.45);
}

.ob-card__invite {
  margin: 0 0 6px;

  color: var(--ob-coral);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
  text-indent: 0.26em;
}

.ob-card__inner h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(38px, 10vw, 48px);
  font-weight: 400;

  line-height: 1.15;

  color: var(--ob-text);
}

.ob-card__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin: 14px 0;

  color: var(--ob-seafoam);
}

.ob-card__divider span {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(74, 154, 184, 0.8));
}

.ob-card__divider-flip {
  transform: rotate(180deg);
}

.ob-card__divider i {
  font-size: 12px;
  font-style: normal;
}

.ob-card__names {
  margin: 0 0 16px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 19px;
  font-weight: 600;

  color: var(--ob-text);
}

.ob-card__names i {
  padding: 0 5px;

  color: var(--ob-coral);

  font-family: "Allura", cursive;
  font-size: 22px;
  font-style: normal;
}

.ob-card__date {
  display: inline-block;

  padding: 8px 18px;

  border: 1px solid rgba(74, 154, 184, 0.45);
  border-radius: 999px;

  background: rgba(226, 241, 245, 0.7);

  color: var(--ob-ocean);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.22em;
  text-indent: 0.22em;
}

.ob-card__wave-bottom {
  height: 14px;

  border-radius: 0 0 26px 26px;

  background:
    radial-gradient(circle at 10px 10px, transparent 12px, rgba(168, 208, 220, 0.55) 13px, transparent 14px) repeat-x;
  background-size: 24px 18px;
  background-position: 12px -6px;

  opacity: 0.9;
}

/* =========================================================
   OPEN BUTTON
========================================================= */

.ob-open-btn {
  position: relative;
  z-index: 3;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 30px;

  padding: 13px 30px;

  border: 0;
  border-radius: 999px;

  color: #ffffff;

  background: linear-gradient(135deg, #4a9ab8, #1d6a8e);

  box-shadow: 0 14px 30px rgba(23, 74, 96, 0.35);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;
  text-indent: 0.1em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.ob-open-btn:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 18px 36px rgba(23, 74, 96, 0.42);
}

.ob-open-btn:disabled {
  opacity: 0.75;
  cursor: default;
}

.ob-open-btn__icon {
  display: flex;
  align-items: center;
}

.ob-open-btn__arrow {
  font-size: 12px;
}

/* =========================================================
   HINT
========================================================= */

.ob-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 22px 0 0;

  color: rgba(255, 255, 255, 0.85);

  font-size: 10px;
  font-style: italic;

  letter-spacing: 0.06em;

  text-shadow: 0 1px 4px rgba(29, 106, 142, 0.35);
}

.ob-hint span {
  width: 34px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7));
}

.ob-hint-flip {
  transform: rotate(180deg);
}

/* =========================================================
   EXIT ANIMATION
========================================================= */

.ob-opening--active .ob-card {
  animation: ob-card-out 0.9s cubic-bezier(0.5, 0, 0.75, 0.4) both;
}

.ob-opening--active .ob-open-btn,
.ob-opening--active .ob-hint,
.ob-opening--active .ob-opening__brand,
.ob-opening--active .ob-opening__eyebrow {
  animation: ob-fade-out 0.45s ease both;
}

.ob-opening--active .ob-bubbles {
  opacity: 0;
  transition: opacity 0.6s ease;
}

/* =========================================================
   KEYFRAMES
========================================================= */

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

@keyframes ob-sun-breathe {
  0%,
  100% {
    opacity: 0.7;
    transform: translateX(-50%) scale(0.96);
  }

  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.05);
  }
}

@keyframes ob-drift {
  0%,
  100% {
    transform: translateX(-3px);
  }

  50% {
    transform: translateX(3px);
  }
}

@keyframes ob-seal-pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow:
      0 10px 24px rgba(29, 106, 142, 0.35),
      inset 0 0 0 3px rgba(255, 255, 255, 0.35);
  }

  50% {
    transform: scale(1.05);
    box-shadow:
      0 14px 30px rgba(29, 106, 142, 0.45),
      inset 0 0 0 3px rgba(255, 255, 255, 0.5);
  }
}

@keyframes ob-card-in {
  from {
    opacity: 0;
    transform: translateY(34px) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes ob-card-bob {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-7px);
  }
}

@keyframes ob-card-out {
  to {
    opacity: 0;
    transform: translateY(-46px) scale(0.9);
  }
}

@keyframes ob-fade-out {
  to {
    opacity: 0;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .ob-card {
    width: 100%;
  }

  .ob-card__inner {
    padding: 22px 18px 26px;
  }

  .ob-card__seal {
    width: 64px;
    height: 64px;
  }

  .ob-card__seal-text {
    font-size: 22px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .ob-bubble,
  .ob-opening__sun,
  .ob-opening__brand i,
  .ob-card__seal,
  .ob-card {
    animation: none;
  }
}
</style>
