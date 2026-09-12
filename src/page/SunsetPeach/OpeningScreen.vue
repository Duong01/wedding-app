<template>
  <section class="sp-opening" :class="{ 'sp-opening--active': opening }">
    <!-- =====================================================
         BACKGROUND
    ====================================================== -->
    <div class="sp-opening__bg"></div>
    <div class="sp-opening__sun"></div>
    <div class="sp-opening__glow sp-opening__glow--1"></div>
    <div class="sp-opening__glow sp-opening__glow--2"></div>

    <!-- Rising warm sparkles -->
    <div class="sp-sparkles" aria-hidden="true">
      <span v-for="n in 12" :key="n" class="sp-sparkle" :class="`sp-sparkle--${n}`">✧</span>
    </div>

    <!-- =====================================================
         TOP BRANDING
    ====================================================== -->
    <div class="sp-opening__brand">
      <span></span>
      <i>❁</i>
      <span></span>
    </div>

    <p class="sp-opening__eyebrow">WEDDING INVITATION</p>

    <!-- =====================================================
         INVITATION CARD
    ====================================================== -->
    <div class="sp-card">
      <div class="sp-card__arch"></div>

      <div class="sp-card__inner">
        <p class="sp-card__kicker">SAVE THE DATE</p>

        <div class="sp-card__seal">
          <span>{{ monogram }}</span>
        </div>

        <p class="sp-card__invite">Trân trọng kính mời</p>

        <h1>{{ guestName }}</h1>

        <div class="sp-card__divider">
          <span></span>
          <i>✧</i>
          <span></span>
        </div>

        <p class="sp-card__names">
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </p>

        <p class="sp-card__date">{{ dateLabel || "OUR WEDDING DAY" }}</p>
      </div>
    </div>

    <!-- =====================================================
         OPEN BUTTON
    ====================================================== -->
    <button type="button" class="sp-open-btn" :disabled="opening" @click="openInvitation">
      <span class="sp-open-btn__icon">
        <v-icon size="16">mdi-email-open-outline</v-icon>
      </span>

      <span class="sp-open-btn__text">CHẠM ĐỂ MỞ THIỆP</span>

      <span class="sp-open-btn__arrow">↗</span>
    </button>

    <p class="sp-hint">
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
.sp-opening {
  --sp-deep: #7a4a3d;
  --sp-coral: #d67a63;
  --sp-peach: #f4c6a9;
  --sp-gold: #e0a37e;
  --sp-cream: #fffaf5;

  position: relative;
  isolation: isolate;

  min-height: 100svh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 34px 18px 28px;

  overflow: hidden;

  color: var(--sp-deep);

  background: linear-gradient(160deg, #fff4ea 0%, #fdeadd 38%, #fbdcc9 70%, #f8cfb8 100%);
}

/* =========================================================
   BACKGROUND
========================================================= */

.sp-opening__bg {
  position: absolute;
  inset: 0;
  z-index: -10;

  background:
    radial-gradient(ellipse at 50% 18%, rgba(255, 252, 246, 0.85), transparent 42%),
    radial-gradient(ellipse at 12% 82%, rgba(244, 198, 169, 0.4), transparent 38%),
    radial-gradient(ellipse at 88% 72%, rgba(214, 122, 99, 0.2), transparent 40%);
}

.sp-opening::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -5;

  opacity: 0.16;

  background-image: radial-gradient(rgba(122, 74, 61, 0.5) 0.6px, transparent 0.6px);
  background-size: 7px 7px;

  pointer-events: none;
}

/* Soft sun-orb behind the card */
.sp-opening__sun {
  position: absolute;
  z-index: -6;

  width: 470px;
  height: 470px;

  top: 10%;
  left: 50%;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(255, 219, 175, 0.6) 0%,
    rgba(255, 199, 152, 0.3) 40%,
    rgba(214, 122, 99, 0.12) 64%,
    transparent 76%
  );

  filter: blur(6px);

  pointer-events: none;

  animation: sp-glow-pulse 7s ease-in-out infinite;
}

.sp-opening__glow {
  position: absolute;
  z-index: -4;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(10px);
}

.sp-opening__glow--1 {
  width: 380px;
  height: 380px;
  top: 6%;
  left: 50%;
  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(255, 248, 238, 0.55), transparent 68%);

  animation: sp-glow-pulse 5.5s ease-in-out infinite;
}

.sp-opening__glow--2 {
  width: 260px;
  height: 260px;
  bottom: -90px;
  left: 50%;
  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(224, 163, 126, 0.22), transparent 70%);
}

/* =========================================================
   SPARKLES
========================================================= */

.sp-sparkles {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
}

.sp-sparkle {
  position: absolute;
  bottom: -40px;

  color: rgba(224, 163, 126, 0.75);

  font-size: 12px;

  text-shadow: 0 0 8px rgba(255, 224, 190, 0.85);

  animation: sp-sparkle-rise linear infinite;
}

.sp-sparkle--1 { left: 6%; font-size: 13px; animation-duration: 11s; animation-delay: 0s; }
.sp-sparkle--2 { left: 16%; font-size: 9px; color: rgba(214, 122, 99, 0.6); animation-duration: 14s; animation-delay: 2.2s; }
.sp-sparkle--3 { left: 27%; font-size: 16px; animation-duration: 12.5s; animation-delay: 1s; }
.sp-sparkle--4 { left: 38%; font-size: 8px; color: rgba(214, 122, 99, 0.55); animation-duration: 15s; animation-delay: 3.4s; }
.sp-sparkle--5 { left: 49%; font-size: 12px; animation-duration: 10.5s; animation-delay: 0.8s; }
.sp-sparkle--6 { left: 60%; font-size: 10px; color: rgba(214, 122, 99, 0.6); animation-duration: 13.5s; animation-delay: 2.8s; }
.sp-sparkle--7 { left: 70%; font-size: 15px; animation-duration: 12s; animation-delay: 1.6s; }
.sp-sparkle--8 { left: 80%; font-size: 8px; color: rgba(214, 122, 99, 0.55); animation-duration: 14.5s; animation-delay: 4s; }
.sp-sparkle--9 { left: 89%; font-size: 12px; animation-duration: 11.5s; animation-delay: 0.4s; }
.sp-sparkle--10 { left: 95%; font-size: 10px; color: rgba(214, 122, 99, 0.6); animation-duration: 15.5s; animation-delay: 3s; }
.sp-sparkle--11 { left: 44%; font-size: 7px; animation-duration: 16s; animation-delay: 5s; }
.sp-sparkle--12 { left: 33%; font-size: 11px; color: rgba(214, 122, 99, 0.6); animation-duration: 13s; animation-delay: 6s; }

/* =========================================================
   BRAND
========================================================= */

.sp-opening__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 10px;

  color: var(--sp-gold);
}

.sp-opening__brand span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(224, 163, 126, 0.8));
}

.sp-opening__brand span:last-child {
  transform: rotate(180deg);
}

.sp-opening__brand i {
  font-size: 14px;
  font-style: normal;

  animation: sp-spin-bloom 9s linear infinite;
}

.sp-opening__eyebrow {
  margin: 0 0 26px;

  color: var(--sp-coral);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.42em;
  text-indent: 0.42em;
}

/* =========================================================
   CARD
========================================================= */

.sp-card {
  position: relative;
  z-index: 2;

  width: min(100%, 360px);

  padding: 10px;

  border-radius: 190px 190px 26px 26px;

  background: linear-gradient(170deg, rgba(255, 253, 250, 0.94), rgba(255, 242, 232, 0.9));

  box-shadow:
    0 26px 60px rgba(122, 74, 61, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.8);

  animation: sp-card-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.sp-card__arch {
  position: absolute;
  inset: 5px;

  border: 1px solid rgba(244, 198, 169, 0.9);
  border-radius: 184px 184px 22px 22px;

  box-shadow: inset 0 0 0 3px rgba(255, 253, 250, 0.65);

  pointer-events: none;
}

.sp-card__inner {
  position: relative;

  padding: 40px 26px 34px;

  text-align: center;
}

.sp-card__kicker {
  margin: 0 0 18px;

  color: var(--sp-gold);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.sp-card__seal {
  position: relative;

  width: 74px;
  height: 74px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 20px;

  border-radius: 50%;

  background: radial-gradient(circle at 34% 30%, #e89a7e, #d67a63 58%, #b85c48 100%);

  box-shadow:
    0 10px 24px rgba(184, 92, 72, 0.35),
    inset 0 0 0 3px rgba(255, 246, 238, 0.35);

  animation: sp-seal-pulse 3.2s ease-in-out infinite;
}

.sp-card__seal::before {
  content: "";
  position: absolute;
  inset: 6px;

  border: 1px dashed rgba(255, 246, 238, 0.55);
  border-radius: 50%;
}

.sp-card__seal span {
  font-family: "Allura", cursive;

  font-size: 26px;

  color: #fff6ef;

  text-shadow: 0 1px 2px rgba(122, 74, 61, 0.4);
}

.sp-card__invite {
  margin: 0 0 6px;

  color: var(--sp-coral);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
  text-indent: 0.26em;
}

.sp-card__inner h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(38px, 10vw, 48px);
  font-weight: 400;

  line-height: 1.15;

  color: var(--sp-deep);
}

.sp-card__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin: 14px 0;

  color: var(--sp-gold);
}

.sp-card__divider span {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(224, 163, 126, 0.75));
}

.sp-card__divider span:last-child {
  transform: rotate(180deg);
}

.sp-card__divider i {
  font-size: 12px;
  font-style: normal;
}

.sp-card__names {
  margin: 0 0 16px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 19px;
  font-weight: 600;

  color: var(--sp-deep);
}

.sp-card__names i {
  padding: 0 5px;

  color: var(--sp-coral);

  font-family: "Allura", cursive;
  font-size: 22px;
  font-style: normal;
}

.sp-card__date {
  display: inline-block;

  padding: 8px 18px;

  border: 1px solid rgba(224, 163, 126, 0.5);
  border-radius: 999px;

  background: rgba(255, 250, 245, 0.7);

  color: var(--sp-coral);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.22em;
  text-indent: 0.22em;
}

/* =========================================================
   OPEN BUTTON
========================================================= */

.sp-open-btn {
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

  color: #fff6ef;

  background: linear-gradient(135deg, #d67a63, #b85c48);

  box-shadow: 0 14px 30px rgba(122, 74, 61, 0.32);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;
  text-indent: 0.1em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.sp-open-btn:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 18px 36px rgba(122, 74, 61, 0.4);
}

.sp-open-btn:disabled {
  opacity: 0.75;
  cursor: default;
}

.sp-open-btn__icon {
  display: flex;
  align-items: center;
}

.sp-open-btn__arrow {
  font-size: 12px;
}

/* =========================================================
   HINT
========================================================= */

.sp-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 22px 0 0;

  color: rgba(122, 74, 61, 0.72);

  font-size: 10px;
  font-style: italic;

  letter-spacing: 0.06em;
}

.sp-hint span {
  width: 34px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(224, 163, 126, 0.6));
}

.sp-hint span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   EXIT ANIMATION
========================================================= */

.sp-opening--active .sp-card {
  animation: sp-card-out 0.9s cubic-bezier(0.5, 0, 0.75, 0.4) both;
}

.sp-opening--active .sp-open-btn,
.sp-opening--active .sp-hint,
.sp-opening--active .sp-opening__brand,
.sp-opening--active .sp-opening__eyebrow {
  animation: sp-fade-out 0.45s ease both;
}

.sp-opening--active .sp-sparkles {
  opacity: 0;
  transition: opacity 0.6s ease;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes sp-sparkle-rise {
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

@keyframes sp-glow-pulse {
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

@keyframes sp-spin-bloom {
  to {
    transform: rotate(360deg);
  }
}

@keyframes sp-seal-pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow:
      0 10px 24px rgba(184, 92, 72, 0.35),
      inset 0 0 0 3px rgba(255, 246, 238, 0.35);
  }

  50% {
    transform: scale(1.05);
    box-shadow:
      0 14px 30px rgba(184, 92, 72, 0.45),
      inset 0 0 0 3px rgba(255, 246, 238, 0.5);
  }
}

@keyframes sp-card-in {
  from {
    opacity: 0;
    transform: translateY(34px) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes sp-card-out {
  to {
    opacity: 0;
    transform: translateY(-46px) scale(0.9);
  }
}

@keyframes sp-fade-out {
  to {
    opacity: 0;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .sp-card {
    width: 100%;
  }

  .sp-card__inner {
    padding: 32px 18px 28px;
  }

  .sp-card__seal {
    width: 64px;
    height: 64px;
  }

  .sp-card__seal span {
    font-size: 22px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .sp-sparkle,
  .sp-opening__sun,
  .sp-opening__glow--1,
  .sp-opening__brand i,
  .sp-card__seal,
  .sp-card {
    animation: none;
  }
}
</style>
