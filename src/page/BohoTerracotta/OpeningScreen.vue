<template>
  <section class="bt-opening" :class="{ 'bt-opening--active': opening }">
    <!-- =====================================================
         BACKGROUND: sand + macramé lattice + sun
    ====================================================== -->
    <div class="bt-opening__bg"></div>
    <div class="bt-opening__lattice"></div>

    <!-- Sun rising above the arch -->
    <div class="bt-sun" aria-hidden="true">
      <span v-for="n in 12" :key="n" class="bt-sun__ray" :class="`bt-sun__ray--${n}`"></span>
      <span class="bt-sun__core"></span>
    </div>

    <!-- Pampas strokes swaying in corners -->
    <span class="bt-pampas bt-pampas--tl">❋</span>
    <span class="bt-pampas bt-pampas--tr">✽</span>
    <span class="bt-pampas bt-pampas--bl">✽</span>
    <span class="bt-pampas bt-pampas--br">❋</span>

    <!-- =====================================================
         TOP BRANDING
    ====================================================== -->
    <p class="bt-opening__eyebrow">THIỆP CƯỚI BOHO</p>

    <!-- =====================================================
         INVITATION ARCH CARD
    ====================================================== -->
    <div class="bt-card">
      <div class="bt-card__arch-outline"></div>

      <div class="bt-card__inner">
        <p class="bt-card__kicker">SAVE THE DATE</p>

        <div class="bt-card__monogram">
          <span>{{ monogram }}</span>
        </div>

        <p class="bt-card__invite">Trân trọng kính mời</p>

        <h1>{{ guestName }}</h1>

        <div class="bt-card__divider">
          <span></span>
          <i>❋</i>
          <span></span>
        </div>

        <p class="bt-card__names">
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </p>

        <p class="bt-card__date">{{ dateLabel || "NGÀY CỦA CHÚNG MÌNH" }}</p>
      </div>
    </div>

    <!-- =====================================================
         OPEN BUTTON
    ====================================================== -->
    <button type="button" class="bt-open-btn" :disabled="opening" @click="openInvitation">
      <span class="bt-open-btn__icon">
        <v-icon size="16">mdi-email-open-outline</v-icon>
      </span>

      <span class="bt-open-btn__text">MỞ THIỆP</span>

      <span class="bt-open-btn__arrow">✧</span>
    </button>

    <p class="bt-hint">
      <span></span>
      Một lời mời · Một câu chuyện · Một ngày nắng ấm
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
.bt-opening {
  --bt-terra: #9c5b3f;
  --bt-clay: #c97b5d;
  --bt-sand: #d9b08c;
  --bt-light: #f2e2d0;
  --bt-bg: #faf3ec;
  --bt-text: #5c4636;
  --bt-sage: #8a9b7c;

  position: relative;
  isolation: isolate;

  min-height: 100svh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 34px 18px 28px;

  overflow: hidden;

  color: var(--bt-text);

  background: linear-gradient(165deg, #faf3ec 0%, #f2e2d0 45%, #e9d0b8 78%, #dfc0a2 100%);
}

/* =========================================================
   BACKGROUND
========================================================= */

.bt-opening__bg {
  position: absolute;
  inset: 0;
  z-index: -10;

  background:
    radial-gradient(ellipse at 50% 12%, rgba(255, 251, 245, 0.9), transparent 46%),
    radial-gradient(ellipse at 10% 85%, rgba(217, 176, 140, 0.35), transparent 40%),
    radial-gradient(ellipse at 90% 78%, rgba(201, 123, 93, 0.18), transparent 42%);
}

/* Macramé diamond lattice texture */
.bt-opening__lattice {
  position: absolute;
  inset: 0;
  z-index: -5;

  opacity: 0.1;

  background-image:
    repeating-linear-gradient(45deg, rgba(156, 91, 63, 0.55) 0 1px, transparent 1px 16px),
    repeating-linear-gradient(-45deg, rgba(156, 91, 63, 0.55) 0 1px, transparent 1px 16px);

  pointer-events: none;
}

/* =========================================================
   SUN MOTIF
========================================================= */

.bt-sun {
  position: absolute;
  z-index: -3;

  top: 7%;
  left: 50%;

  width: 120px;
  height: 120px;

  transform: translateX(-50%);

  pointer-events: none;
}

.bt-sun__core {
  position: absolute;
  inset: 34px;

  border-radius: 50%;

  background: radial-gradient(circle at 36% 32%, #e8c79c, #d9b08c 55%, #c97b5d 100%);

  box-shadow:
    0 0 26px rgba(217, 176, 140, 0.65),
    inset 0 0 0 2px rgba(255, 248, 238, 0.4);

  animation: bt-sun-breathe 5s ease-in-out infinite;
}

.bt-sun__ray {
  position: absolute;
  top: 50%;
  left: 50%;

  width: 2px;
  height: 52px;

  transform-origin: center 0;

  background: linear-gradient(180deg, rgba(201, 123, 93, 0.75), transparent);

  border-radius: 2px;
}

.bt-sun__ray--1 { transform: translate(-50%, 0) rotate(0deg) translateY(-64px); }
.bt-sun__ray--2 { transform: translate(-50%, 0) rotate(30deg) translateY(-64px); }
.bt-sun__ray--3 { transform: translate(-50%, 0) rotate(60deg) translateY(-64px); }
.bt-sun__ray--4 { transform: translate(-50%, 0) rotate(90deg) translateY(-64px); }
.bt-sun__ray--5 { transform: translate(-50%, 0) rotate(120deg) translateY(-64px); }
.bt-sun__ray--6 { transform: translate(-50%, 0) rotate(150deg) translateY(-64px); }
.bt-sun__ray--7 { transform: translate(-50%, 0) rotate(180deg) translateY(-64px); }
.bt-sun__ray--8 { transform: translate(-50%, 0) rotate(210deg) translateY(-64px); }
.bt-sun__ray--9 { transform: translate(-50%, 0) rotate(240deg) translateY(-64px); }
.bt-sun__ray--10 { transform: translate(-50%, 0) rotate(270deg) translateY(-64px); }
.bt-sun__ray--11 { transform: translate(-50%, 0) rotate(300deg) translateY(-64px); }
.bt-sun__ray--12 { transform: translate(-50%, 0) rotate(330deg) translateY(-64px); }

.bt-sun {
  animation: bt-sun-spin 40s linear infinite;
}

/* =========================================================
   PAMPAS STROKES
========================================================= */

.bt-pampas {
  position: absolute;
  z-index: -2;

  color: rgba(156, 91, 63, 0.32);

  font-size: 26px;

  pointer-events: none;

  animation: bt-pampas-sway 6s ease-in-out infinite;
}

.bt-pampas--tl { top: 34px; left: 26px; transform-origin: bottom center; }
.bt-pampas--tr { top: 40px; right: 30px; font-size: 20px; animation-delay: -1.6s; }
.bt-pampas--bl { bottom: 44px; left: 34px; font-size: 19px; animation-delay: -2.8s; }
.bt-pampas--br { bottom: 36px; right: 24px; animation-delay: -4s; }

/* =========================================================
   EYEBROW
========================================================= */

.bt-opening__eyebrow {
  margin: 0 0 26px;

  color: var(--bt-clay);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.42em;
  text-indent: 0.42em;
}

/* =========================================================
   ARCH CARD
========================================================= */

.bt-card {
  position: relative;
  z-index: 2;

  width: min(100%, 360px);

  padding: 10px;

  border: 2px dashed rgba(156, 91, 63, 0.45);
  border-radius: 999px 999px 24px 24px;

  background: linear-gradient(172deg, rgba(255, 251, 245, 0.95), rgba(242, 226, 208, 0.9));

  box-shadow:
    0 26px 60px rgba(92, 70, 54, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.8);

  animation: bt-card-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.bt-card__arch-outline {
  position: absolute;
  inset: 6px;

  border: 1px solid rgba(156, 91, 63, 0.4);
  border-radius: 999px 999px 20px 20px;

  pointer-events: none;
}

.bt-card__inner {
  position: relative;

  padding: 42px 26px 34px;

  text-align: center;
}

.bt-card__kicker {
  margin: 0 0 18px;

  color: var(--bt-sage);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

/* Monogram inside an arch outline */
.bt-card__monogram {
  position: relative;

  width: 78px;
  height: 92px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 20px;

  border: 1px solid rgba(156, 91, 63, 0.55);
  border-radius: 999px 999px 12px 12px;

  background: linear-gradient(170deg, rgba(217, 176, 140, 0.35), rgba(201, 123, 93, 0.18));

  animation: bt-monogram-pulse 3.4s ease-in-out infinite;
}

.bt-card__monogram::before {
  content: "";
  position: absolute;
  inset: 5px;

  border: 1px dashed rgba(156, 91, 63, 0.4);
  border-radius: 999px 999px 9px 9px;
}

.bt-card__monogram span {
  font-family: "Allura", cursive;

  font-size: 27px;

  color: var(--bt-terra);

  text-shadow: 0 1px 2px rgba(92, 70, 54, 0.25);
}

.bt-card__invite {
  margin: 0 0 6px;

  color: var(--bt-clay);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
  text-indent: 0.26em;
}

.bt-card__inner h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(38px, 10vw, 48px);
  font-weight: 400;

  line-height: 1.15;

  color: var(--bt-text);
}

.bt-card__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin: 14px 0;

  color: var(--bt-clay);
}

.bt-card__divider span {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(156, 91, 63, 0.7));
}

.bt-card__divider span:last-child {
  transform: rotate(180deg);
}

.bt-card__divider i {
  font-size: 13px;
  font-style: normal;
}

.bt-card__names {
  margin: 0 0 16px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 19px;
  font-weight: 600;

  color: var(--bt-text);
}

.bt-card__names i {
  padding: 0 5px;

  color: var(--bt-clay);

  font-family: "Allura", cursive;
  font-size: 22px;
  font-style: normal;
}

.bt-card__date {
  display: inline-block;

  padding: 8px 18px;

  border: 1px dashed rgba(156, 91, 63, 0.5);
  border-radius: 999px;

  background: rgba(255, 251, 245, 0.75);

  color: var(--bt-terra);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.22em;
  text-indent: 0.22em;
}

/* =========================================================
   OPEN BUTTON
========================================================= */

.bt-open-btn {
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

  color: #fff6ec;

  background: linear-gradient(135deg, #c97b5d, #9c5b3f);

  box-shadow: 0 14px 30px rgba(156, 91, 63, 0.35);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.22em;
  text-indent: 0.1em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.bt-open-btn:hover:not(:disabled) {
  transform: translateY(-2px) rotate(-1deg);

  box-shadow: 0 18px 36px rgba(156, 91, 63, 0.45);
}

.bt-open-btn:disabled {
  opacity: 0.75;
  cursor: default;
}

.bt-open-btn__icon {
  display: flex;
  align-items: center;
}

.bt-open-btn__arrow {
  font-size: 12px;
}

/* =========================================================
   HINT
========================================================= */

.bt-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 22px 0 0;

  color: rgba(92, 70, 54, 0.72);

  font-size: 10px;
  font-style: italic;

  letter-spacing: 0.06em;
}

.bt-hint span {
  width: 34px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(156, 91, 63, 0.6));
}

.bt-hint span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   EXIT ANIMATION
========================================================= */

.bt-opening--active .bt-card {
  animation: bt-card-out 0.9s cubic-bezier(0.5, 0, 0.75, 0.4) both;
}

.bt-opening--active .bt-open-btn,
.bt-opening--active .bt-hint,
.bt-opening--active .bt-opening__eyebrow,
.bt-opening--active .bt-sun {
  animation: bt-fade-out 0.45s ease both;
}

.bt-opening--active .bt-pampas {
  opacity: 0;
  transition: opacity 0.6s ease;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes bt-sun-spin {
  to {
    transform: translateX(-50%) rotate(360deg);
  }
}

@keyframes bt-sun-breathe {
  0%,
  100% {
    box-shadow:
      0 0 22px rgba(217, 176, 140, 0.55),
      inset 0 0 0 2px rgba(255, 248, 238, 0.4);
  }

  50% {
    box-shadow:
      0 0 34px rgba(217, 176, 140, 0.8),
      inset 0 0 0 2px rgba(255, 248, 238, 0.55);
  }
}

@keyframes bt-pampas-sway {
  0%,
  100% {
    transform: rotate(-9deg);
  }

  50% {
    transform: rotate(11deg);
  }
}

@keyframes bt-monogram-pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

@keyframes bt-card-in {
  from {
    opacity: 0;
    transform: translateY(34px) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes bt-card-out {
  to {
    opacity: 0;
    transform: translateY(-46px) scale(0.9);
  }
}

@keyframes bt-fade-out {
  to {
    opacity: 0;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .bt-card {
    width: 100%;
  }

  .bt-card__inner {
    padding: 34px 18px 28px;
  }

  .bt-card__monogram {
    width: 68px;
    height: 82px;
  }

  .bt-card__monogram span {
    font-size: 23px;
  }

  .bt-sun {
    width: 96px;
    height: 96px;
  }

  .bt-sun__core {
    inset: 27px;
  }

  .bt-sun__ray {
    height: 42px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .bt-sun,
  .bt-sun__core,
  .bt-pampas,
  .bt-card__monogram,
  .bt-card {
    animation: none;
  }
}
</style>
