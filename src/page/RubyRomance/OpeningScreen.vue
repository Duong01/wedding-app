<template>
  <section class="rr-opening" :class="{ 'rr-opening--active': opening }">
    <!-- =====================================================
         BACKGROUND
    ====================================================== -->
    <div class="rr-opening__bg"></div>
    <div class="rr-opening__glow rr-opening__glow--1"></div>
    <div class="rr-opening__glow rr-opening__glow--2"></div>

    <!-- Rising ruby sparkles -->
    <div class="rr-sparkles" aria-hidden="true">
      <span v-for="n in 12" :key="n" class="rr-sparkle" :class="`rr-sparkle--${n}`">♥</span>
    </div>

    <!-- =====================================================
         TOP BRANDING
    ====================================================== -->
    <div class="rr-opening__brand">
      <span></span>
      <i>❥</i>
      <span></span>
    </div>

    <p class="rr-opening__eyebrow">{{ eyebrow }}</p>

    <!-- =====================================================
         INVITATION CARD
    ====================================================== -->
    <div class="rr-card">
      <div class="rr-card__arch"></div>

      <div class="rr-card__inner">
        <p class="rr-card__kicker">{{ kicker }}</p>

        <div class="rr-card__seal">
          <span>{{ monogram }}</span>
        </div>

        <p class="rr-card__invite">{{ inviteText }}</p>

        <h1>{{ guestName }}</h1>

        <div class="rr-card__divider">
          <span></span>
          <i>❥</i>
          <span></span>
        </div>

        <p class="rr-card__names">
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </p>

        <p class="rr-card__date">{{ dateLabel || "OUR WEDDING DAY" }}</p>
      </div>
    </div>

    <!-- =====================================================
         OPEN BUTTON
    ====================================================== -->
    <button type="button" class="rr-open-btn" :disabled="opening" @click="openInvitation">
      <span class="rr-open-btn__icon">
        <v-icon size="16">mdi-email-open-outline</v-icon>
      </span>

      <span class="rr-open-btn__text">{{ buttonText }}</span>

      <span class="rr-open-btn__arrow">↗</span>
    </button>

    <p class="rr-hint">
      <span class="rr-hint__line"></span>
      <span class="rr-hint__text">{{ hintText }}</span>
      <span class="rr-hint__line"></span>
    </p>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

import { sectionText } from "@/data/sectionTitles";
const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  monogram: { type: String, default: "G & B" },
  dateLabel: { type: String, default: "" },
  sections: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["open"]);

const opening = ref(false);

const eyebrow = computed(() =>
  sectionText(props.sections, "opening", "Eyebrow", "WEDDING INVITATION")
);

const kicker = computed(() =>
  sectionText(props.sections, "opening", "Kicker", "SAVE THE DATE")
);

const inviteText = computed(() =>
  sectionText(props.sections, "opening", "Invite", "Trân trọng kính mời")
);

const buttonText = computed(() =>
  sectionText(props.sections, "opening", "Button", "CHẠM ĐỂ MỞ THIỆP")
);

const hintText = computed(() =>
  sectionText(
    props.sections,
    "opening",
    "Hint",
    "Một lời mời · Một câu chuyện · Một ngày đặc biệt"
  )
);

const groomName = computed(
  () =>
    props.wedding?.GroomName ||
    props.wedding?.groomName ||
    props.wedding?.hero?.GroomName ||
    props.wedding?.couple?.Groom?.Name ||
    ""
);

const brideName = computed(
  () =>
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.hero?.BrideName ||
    props.wedding?.couple?.Bride?.Name ||
    ""
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
.rr-opening {
  --rr-deep: var(--tc-8c2f42, #8c2f42);
  --rr-ruby: var(--tc-683440, #683440);
  --rr-plum: var(--tc-8c4452, #8c4452);
  --rr-lilac: var(--tc-e8b4be, #e8b4be);
  --rr-line: var(--tc-6e3844, #6e3844);
  --rr-cream: var(--tc-fdf7f8, #fdf7f8);

  position: relative;
  isolation: isolate;

  min-height: 100svh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 34px 18px 28px;

  overflow: hidden;

  color: var(--rr-deep);

  background: linear-gradient(160deg, var(--tc-fcf0f3, #fcf0f3) 0%, var(--tc-fae4e9, #fae4e9) 38%, var(--tc-f5d8de, #f5d8de) 70%, var(--tc-efc6ce, #efc6ce) 100%);
}

/* =========================================================
   BACKGROUND
========================================================= */

.rr-opening__bg {
  position: absolute;
  inset: 0;
  z-index: -10;

  background:
    radial-gradient(ellipse at 50% 18%, rgba(var(--tc-fefafb-rgb, 254, 250, 251), 0.9), transparent 42%),
    radial-gradient(ellipse at 12% 82%, rgba(var(--tc-e8b4be-rgb, 232, 180, 190), 0.45), transparent 38%),
    radial-gradient(ellipse at 88% 72%, rgba(var(--tc-c46a7e-rgb, 196, 106, 126), 0.22), transparent 40%);
}

.rr-opening::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -5;

  opacity: 0.16;

  background-image: radial-gradient(rgba(var(--tc-6e2632-rgb, 110, 38, 50), 0.5) 0.6px, transparent 0.6px);
  background-size: 7px 7px;

  pointer-events: none;
}

.rr-opening__glow {
  position: absolute;
  z-index: -4;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(10px);
}

.rr-opening__glow--1 {
  width: 380px;
  height: 380px;
  top: 6%;
  left: 50%;
  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(var(--tc-fdf7f8-rgb, 253, 247, 248), 0.6), transparent 68%);

  animation: rr-glow-breathe 5.5s ease-in-out infinite;
}

.rr-opening__glow--2 {
  width: 260px;
  height: 260px;
  bottom: -90px;
  left: 50%;
  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(var(--tc-d998a6-rgb, 217, 152, 166), 0.24), transparent 70%);
}

/* =========================================================
   SPARKLES
========================================================= */

.rr-sparkles {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
}

.rr-sparkle {
  position: absolute;
  bottom: -40px;

  color: rgba(var(--tc-c46a7e-rgb, 196, 106, 126), 0.6);

  text-shadow: 0 0 8px rgba(var(--tc-e8b4be-rgb, 232, 180, 190), 0.85);

  animation: rr-sparkle-rise linear infinite;
}

.rr-sparkle--1 { left: 6%; font-size: 12px; animation-duration: 11s; animation-delay: 0s; }
.rr-sparkle--2 { left: 16%; font-size: 10px; animation-duration: 14s; animation-delay: 2.2s; }
.rr-sparkle--3 { left: 27%; font-size: 15px; animation-duration: 12.5s; animation-delay: 1s; }
.rr-sparkle--4 { left: 38%; font-size: 11px; animation-duration: 15s; animation-delay: 3.4s; }
.rr-sparkle--5 { left: 49%; font-size: 11px; animation-duration: 10.5s; animation-delay: 0.8s; }
.rr-sparkle--6 { left: 60%; font-size: 11px; animation-duration: 13.5s; animation-delay: 2.8s; }
.rr-sparkle--7 { left: 70%; font-size: 14px; animation-duration: 12s; animation-delay: 1.6s; }
.rr-sparkle--8 { left: 80%; font-size: 11px; animation-duration: 14.5s; animation-delay: 4s; }
.rr-sparkle--9 { left: 89%; font-size: 12px; animation-duration: 11.5s; animation-delay: 0.4s; }
.rr-sparkle--10 { left: 95%; font-size: 11px; animation-duration: 15.5s; animation-delay: 3s; }
.rr-sparkle--11 { left: 44%; font-size: 10px; animation-duration: 16s; animation-delay: 5s; }
.rr-sparkle--12 { left: 33%; font-size: 10px; animation-duration: 13s; animation-delay: 6s; }

/* =========================================================
   BRAND
========================================================= */

.rr-opening__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 10px;

  color: var(--rr-line);
}

.rr-opening__brand span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-d998a6-rgb, 217, 152, 166), 0.8));
}

.rr-opening__brand span:last-child {
  transform: rotate(180deg);
}

.rr-opening__brand i {
  font-size: 14px;
  font-style: normal;

  animation: rr-spin-bloom 9s linear infinite;
}

.rr-opening__eyebrow {
  margin: 0 0 26px;

  color: var(--rr-ruby);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.42em;
  text-indent: 0.42em;
}

/* =========================================================
   CARD
========================================================= */

.rr-card {
  position: relative;
  z-index: 2;

  width: min(100%, 360px);

  padding: 10px;

  border-radius: 190px 190px 26px 26px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.94), rgba(var(--tc-fae4e9-rgb, 250, 228, 233), 0.9));

  box-shadow:
    0 26px 60px rgba(var(--tc-6e2632-rgb, 110, 38, 50), 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85);

  animation: rr-card-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.rr-card__arch {
  position: absolute;
  inset: 5px;

  border: 1px solid rgba(var(--tc-c46a7e-rgb, 196, 106, 126), 0.55);
  border-radius: 184px 184px 22px 22px;

  box-shadow:
    inset 0 0 0 3px rgba(var(--tc-fdf7f8-rgb, 253, 247, 248), 0.9),
    inset 0 0 0 4px rgba(var(--tc-e8b4be-rgb, 232, 180, 190), 0.55);

  pointer-events: none;
}

.rr-card__inner {
  position: relative;

  padding: 40px 26px 34px;

  text-align: center;
}

.rr-card__kicker {
  margin: 0 0 18px;

  color: var(--rr-line);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.rr-card__seal {
  position: relative;

  width: 74px;
  height: 74px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 20px;

  border-radius: 50%;

  background: radial-gradient(circle at 34% 30%, var(--tc-d998a6, #d998a6), var(--tc-683440, #683440) 58%, var(--tc-8c4452, #8c4452) 100%);

  box-shadow:
    0 10px 24px rgba(var(--tc-8c4452-rgb, 140, 68, 82), 0.35),
    inset 0 0 0 3px rgba(var(--tc-fdf7f8-rgb, 253, 247, 248), 0.35);

  animation: rr-seal-pulse 3.2s ease-in-out infinite;
}

.rr-card__seal::before {
  content: "";
  position: absolute;
  inset: 6px;

  border: 1px dashed rgba(var(--tc-fdf7f8-rgb, 253, 247, 248), 0.55);
  border-radius: 50%;
}

.rr-card__seal span {
  font-family: "Allura", cursive;

  font-size: 26px;

  color: var(--tc-fef9fa, #fef9fa);

  text-shadow: 0 1px 2px rgba(var(--tc-6e2632-rgb, 110, 38, 50), 0.4);
}

.rr-card__invite {
  margin: 0 0 6px;

  color: var(--rr-ruby);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
  text-indent: 0.26em;
}

.rr-card__inner h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(38px, 10vw, 48px);
  font-weight: 400;

  line-height: 1.15;

  color: var(--rr-deep);
}

.rr-card__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin: 14px 0;

  color: var(--rr-line);
}

.rr-card__divider span {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-d998a6-rgb, 217, 152, 166), 0.75));
}

.rr-card__divider span:last-child {
  transform: rotate(180deg);
}

.rr-card__divider i {
  font-size: 12px;
  font-style: normal;
}

.rr-card__names {
  margin: 0 0 16px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 19px;
  font-weight: 600;

  color: var(--rr-deep);
}

.rr-card__names i {
  padding: 0 5px;

  color: var(--rr-ruby);

  font-family: "Allura", cursive;
  font-size: 22px;
  font-style: normal;
}

.rr-card__date {
  display: inline-block;

  padding: 8px 18px;

  border: 1px solid rgba(var(--tc-d998a6-rgb, 217, 152, 166), 0.45);
  border-radius: 999px;

  background: rgba(var(--tc-fefafb-rgb, 254, 250, 251), 0.7);

  color: var(--rr-ruby);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.22em;
  text-indent: 0.22em;
}

/* =========================================================
   OPEN BUTTON
========================================================= */

.rr-open-btn {
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

  color: var(--tc-fef9fa, #fef9fa);

  background: linear-gradient(135deg, var(--tc-683440, #683440), var(--tc-8c4452, #8c4452));

  box-shadow: 0 14px 30px rgba(var(--tc-6e2632-rgb, 110, 38, 50), 0.32);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;
  text-indent: 0.1em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.rr-open-btn:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 18px 36px rgba(var(--tc-6e2632-rgb, 110, 38, 50), 0.4);
}

.rr-open-btn:disabled {
  opacity: 0.75;
  cursor: default;
}

.rr-open-btn__icon {
  display: flex;
  align-items: center;
}

.rr-open-btn__text {
  text-align: center;
  white-space: pre-line;
}

.rr-open-btn__arrow {
  font-size: 12px;
}

/* =========================================================
   HINT
========================================================= */

.rr-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 22px 0 0;

  color: rgba(var(--tc-6e2632-rgb, 110, 38, 50), 0.72);

  font-size: 10px;
  font-style: italic;

  letter-spacing: 0.06em;
}

.rr-hint__text {
  text-align: center;
  white-space: pre-line;
}

.rr-hint__line {
  flex: 0 0 auto;

  width: 34px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-d998a6-rgb, 217, 152, 166), 0.6));
}

.rr-hint__line:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   EXIT ANIMATION
========================================================= */

.rr-opening--active .rr-card {
  animation: rr-card-out 0.9s cubic-bezier(0.5, 0, 0.75, 0.4) both;
}

.rr-opening--active .rr-open-btn,
.rr-opening--active .rr-hint,
.rr-opening--active .rr-opening__brand,
.rr-opening--active .rr-opening__eyebrow {
  animation: rr-fade-out 0.45s ease both;
}

.rr-opening--active .rr-sparkles {
  opacity: 0;
  transition: opacity 0.6s ease;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes rr-sparkle-rise {
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

@keyframes rr-glow-breathe {
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

@keyframes rr-spin-bloom {
  to {
    transform: rotate(360deg);
  }
}

@keyframes rr-seal-pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow:
      0 10px 24px rgba(var(--tc-8c4452-rgb, 140, 68, 82), 0.35),
      inset 0 0 0 3px rgba(var(--tc-fdf7f8-rgb, 253, 247, 248), 0.35);
  }

  50% {
    transform: scale(1.05);
    box-shadow:
      0 14px 30px rgba(var(--tc-8c4452-rgb, 140, 68, 82), 0.45),
      inset 0 0 0 3px rgba(var(--tc-fdf7f8-rgb, 253, 247, 248), 0.5);
  }
}

@keyframes rr-card-in {
  from {
    opacity: 0;
    transform: translateY(34px) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes rr-card-out {
  to {
    opacity: 0;
    transform: translateY(-46px) scale(0.9);
  }
}

@keyframes rr-fade-out {
  to {
    opacity: 0;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .rr-card {
    width: 100%;
  }

  .rr-card__inner {
    padding: 32px 18px 28px;
  }

  .rr-card__seal {
    width: 64px;
    height: 64px;
  }

  .rr-card__seal span {
    font-size: 22px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .rr-sparkle,
  .rr-opening__glow--1,
  .rr-opening__brand i,
  .rr-card__seal,
  .rr-card {
    animation: none;
  }
}
</style>
