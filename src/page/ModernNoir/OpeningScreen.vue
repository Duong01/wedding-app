<template>
  <section class="mn-opening" :class="{ 'mn-opening--active': opening }">
    <!-- =====================================================
         BACKGROUND
    ====================================================== -->
    <div class="mn-opening__bg"></div>
    <div class="mn-opening__glow mn-opening__glow--1"></div>
    <div class="mn-opening__glow mn-opening__glow--2"></div>

    <!-- Rising modern sparkles -->
    <div class="mn-sparkles" aria-hidden="true">
      <span v-for="n in 12" :key="n" class="mn-sparkle" :class="`mn-sparkle--${n}`">✧</span>
    </div>

    <!-- =====================================================
         TOP BRANDING
    ====================================================== -->
    <div class="mn-opening__brand">
      <span></span>
      <i>✧</i>
      <span></span>
    </div>

    <p class="mn-opening__eyebrow">{{ eyebrow }}</p>

    <!-- =====================================================
         INVITATION CARD
    ====================================================== -->
    <div class="mn-card">
      <div class="mn-card__arch"></div>

      <div class="mn-card__inner">
        <p class="mn-card__kicker">{{ kicker }}</p>

        <div class="mn-card__seal">
          <span>{{ monogram }}</span>
        </div>

        <p class="mn-card__invite">{{ inviteText }}</p>

        <h1>{{ guestName }}</h1>

        <div class="mn-card__divider">
          <span></span>
          <i>✧</i>
          <span></span>
        </div>

        <p class="mn-card__names">
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </p>

        <p class="mn-card__date">{{ dateLabel || "OUR WEDDING DAY" }}</p>
      </div>
    </div>

    <!-- =====================================================
         OPEN BUTTON
    ====================================================== -->
    <button type="button" class="mn-open-btn" :disabled="opening" @click="openInvitation">
      <span class="mn-open-btn__icon">
        <v-icon size="16">mdi-email-open-outline</v-icon>
      </span>

      <span class="mn-open-btn__text">{{ buttonText }}</span>

      <span class="mn-open-btn__arrow">↗</span>
    </button>

    <p class="mn-hint">
      <span class="mn-hint__line"></span>
      <span class="mn-hint__text">{{ hintText }}</span>
      <span class="mn-hint__line"></span>
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
.mn-opening {
  --mn-deep: var(--tc-3a3a3a, #3a3a3a);
  --mn-modern: var(--tc-474747, #474747);
  --mn-plum: var(--tc-6b6b6b, #6b6b6b);
  --mn-lilac: var(--tc-dcc9a4, #dcc9a4);
  --mn-line: var(--tc-4d4d4d, #4d4d4d);
  --mn-cream: var(--tc-fbf8f0, #fbf8f0);

  position: relative;
  isolation: isolate;

  min-height: 100svh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 34px 18px 28px;

  overflow: hidden;

  color: var(--mn-deep);

  background: linear-gradient(160deg, var(--tc-f8f2e4, #f8f2e4) 0%, var(--tc-f4ead4, #f4ead4) 38%, var(--tc-ede0c4, #ede0c4) 70%, var(--tc-e4d3b3, #e4d3b3) 100%);
}

/* =========================================================
   BACKGROUND
========================================================= */

.mn-opening__bg {
  position: absolute;
  inset: 0;
  z-index: -10;

  background:
    radial-gradient(ellipse at 50% 18%, rgba(var(--tc-fcfaf4-rgb, 252, 250, 244), 0.9), transparent 42%),
    radial-gradient(ellipse at 12% 82%, rgba(var(--tc-dcc9a4-rgb, 220, 201, 164), 0.45), transparent 38%),
    radial-gradient(ellipse at 88% 72%, rgba(var(--tc-b8a07a-rgb, 184, 160, 122), 0.22), transparent 40%);
}

.mn-opening::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -5;

  opacity: 0.16;

  background-image: radial-gradient(rgba(var(--tc-3a3a3a-rgb, 58, 58, 58), 0.5) 0.6px, transparent 0.6px);
  background-size: 7px 7px;

  pointer-events: none;
}

.mn-opening__glow {
  position: absolute;
  z-index: -4;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(10px);
}

.mn-opening__glow--1 {
  width: 380px;
  height: 380px;
  top: 6%;
  left: 50%;
  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(var(--tc-fbf8f0-rgb, 251, 248, 240), 0.6), transparent 68%);

  animation: mn-glow-breathe 5.5s ease-in-out infinite;
}

.mn-opening__glow--2 {
  width: 260px;
  height: 260px;
  bottom: -90px;
  left: 50%;
  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.24), transparent 70%);
}

/* =========================================================
   SPARKLES
========================================================= */

.mn-sparkles {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
}

.mn-sparkle {
  position: absolute;
  bottom: -40px;

  color: rgba(var(--tc-b8a07a-rgb, 184, 160, 122), 0.6);

  text-shadow: 0 0 8px rgba(var(--tc-dcc9a4-rgb, 220, 201, 164), 0.85);

  animation: mn-sparkle-rise linear infinite;
}

.mn-sparkle--1 { left: 6%; font-size: 12px; animation-duration: 11s; animation-delay: 0s; }
.mn-sparkle--2 { left: 16%; font-size: 10px; animation-duration: 14s; animation-delay: 2.2s; }
.mn-sparkle--3 { left: 27%; font-size: 15px; animation-duration: 12.5s; animation-delay: 1s; }
.mn-sparkle--4 { left: 38%; font-size: 11px; animation-duration: 15s; animation-delay: 3.4s; }
.mn-sparkle--5 { left: 49%; font-size: 11px; animation-duration: 10.5s; animation-delay: 0.8s; }
.mn-sparkle--6 { left: 60%; font-size: 11px; animation-duration: 13.5s; animation-delay: 2.8s; }
.mn-sparkle--7 { left: 70%; font-size: 14px; animation-duration: 12s; animation-delay: 1.6s; }
.mn-sparkle--8 { left: 80%; font-size: 11px; animation-duration: 14.5s; animation-delay: 4s; }
.mn-sparkle--9 { left: 89%; font-size: 12px; animation-duration: 11.5s; animation-delay: 0.4s; }
.mn-sparkle--10 { left: 95%; font-size: 11px; animation-duration: 15.5s; animation-delay: 3s; }
.mn-sparkle--11 { left: 44%; font-size: 10px; animation-duration: 16s; animation-delay: 5s; }
.mn-sparkle--12 { left: 33%; font-size: 10px; animation-duration: 13s; animation-delay: 6s; }

/* =========================================================
   BRAND
========================================================= */

.mn-opening__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 10px;

  color: var(--mn-line);
}

.mn-opening__brand span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.8));
}

.mn-opening__brand span:last-child {
  transform: rotate(180deg);
}

.mn-opening__brand i {
  font-size: 14px;
  font-style: normal;

  animation: mn-spin-bloom 9s linear infinite;
}

.mn-opening__eyebrow {
  margin: 0 0 26px;

  color: var(--mn-modern);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.42em;
  text-indent: 0.42em;
}

/* =========================================================
   CARD
========================================================= */

.mn-card {
  position: relative;
  z-index: 2;

  width: min(100%, 360px);

  padding: 10px;

  border-radius: 190px 190px 26px 26px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.94), rgba(var(--tc-f4ead4-rgb, 244, 234, 212), 0.9));

  box-shadow:
    0 26px 60px rgba(var(--tc-3a3a3a-rgb, 58, 58, 58), 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85);

  animation: mn-card-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.mn-card__arch {
  position: absolute;
  inset: 5px;

  border: 1px solid rgba(var(--tc-b8a07a-rgb, 184, 160, 122), 0.55);
  border-radius: 184px 184px 22px 22px;

  box-shadow:
    inset 0 0 0 3px rgba(var(--tc-fbf8f0-rgb, 251, 248, 240), 0.9),
    inset 0 0 0 4px rgba(var(--tc-dcc9a4-rgb, 220, 201, 164), 0.55);

  pointer-events: none;
}

.mn-card__inner {
  position: relative;

  padding: 40px 26px 34px;

  text-align: center;
}

.mn-card__kicker {
  margin: 0 0 18px;

  color: var(--mn-line);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.mn-card__seal {
  position: relative;

  width: 74px;
  height: 74px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 20px;

  border-radius: 50%;

  background: radial-gradient(circle at 34% 30%, var(--tc-c9b48c, #c9b48c), var(--tc-474747, #474747) 58%, var(--tc-6b6b6b, #6b6b6b) 100%);

  box-shadow:
    0 10px 24px rgba(var(--tc-5c5c5c-rgb, 92, 92, 92), 0.35),
    inset 0 0 0 3px rgba(var(--tc-fbf8f0-rgb, 251, 248, 240), 0.35);

  animation: mn-seal-pulse 3.2s ease-in-out infinite;
}

.mn-card__seal::before {
  content: "";
  position: absolute;
  inset: 6px;

  border: 1px dashed rgba(var(--tc-fbf8f0-rgb, 251, 248, 240), 0.55);
  border-radius: 50%;
}

.mn-card__seal span {
  font-family: "Allura", cursive;

  font-size: 26px;

  color: var(--tc-fcfaf3, #fcfaf3);

  text-shadow: 0 1px 2px rgba(var(--tc-3a3a3a-rgb, 58, 58, 58), 0.4);
}

.mn-card__invite {
  margin: 0 0 6px;

  color: var(--mn-modern);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
  text-indent: 0.26em;
}

.mn-card__inner h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(38px, 10vw, 48px);
  font-weight: 400;

  line-height: 1.15;

  color: var(--mn-deep);
}

.mn-card__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin: 14px 0;

  color: var(--mn-line);
}

.mn-card__divider span {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.75));
}

.mn-card__divider span:last-child {
  transform: rotate(180deg);
}

.mn-card__divider i {
  font-size: 12px;
  font-style: normal;
}

.mn-card__names {
  margin: 0 0 16px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 19px;
  font-weight: 600;

  color: var(--mn-deep);
}

.mn-card__names i {
  padding: 0 5px;

  color: var(--mn-modern);

  font-family: "Allura", cursive;
  font-size: 22px;
  font-style: normal;
}

.mn-card__date {
  display: inline-block;

  padding: 8px 18px;

  border: 1px solid rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.45);
  border-radius: 999px;

  background: rgba(var(--tc-fcfaf4-rgb, 252, 250, 244), 0.7);

  color: var(--mn-modern);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.22em;
  text-indent: 0.22em;
}

/* =========================================================
   OPEN BUTTON
========================================================= */

.mn-open-btn {
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

  color: var(--tc-fcfaf3, #fcfaf3);

  background: linear-gradient(135deg, var(--tc-474747, #474747), var(--tc-6b6b6b, #6b6b6b));

  box-shadow: 0 14px 30px rgba(var(--tc-3a3a3a-rgb, 58, 58, 58), 0.32);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;
  text-indent: 0.1em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.mn-open-btn:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 18px 36px rgba(var(--tc-3a3a3a-rgb, 58, 58, 58), 0.4);
}

.mn-open-btn:disabled {
  opacity: 0.75;
  cursor: default;
}

.mn-open-btn__icon {
  display: flex;
  align-items: center;
}

.mn-open-btn__text {
  text-align: center;
  white-space: pre-line;
}

.mn-open-btn__arrow {
  font-size: 12px;
}

/* =========================================================
   HINT
========================================================= */

.mn-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 22px 0 0;

  color: rgba(var(--tc-3a3a3a-rgb, 58, 58, 58), 0.72);

  font-size: 10px;
  font-style: italic;

  letter-spacing: 0.06em;
}

.mn-hint__text {
  text-align: center;
  white-space: pre-line;
}

.mn-hint__line {
  flex: 0 0 auto;

  width: 34px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.6));
}

.mn-hint__line:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   EXIT ANIMATION
========================================================= */

.mn-opening--active .mn-card {
  animation: mn-card-out 0.9s cubic-bezier(0.5, 0, 0.75, 0.4) both;
}

.mn-opening--active .mn-open-btn,
.mn-opening--active .mn-hint,
.mn-opening--active .mn-opening__brand,
.mn-opening--active .mn-opening__eyebrow {
  animation: mn-fade-out 0.45s ease both;
}

.mn-opening--active .mn-sparkles {
  opacity: 0;
  transition: opacity 0.6s ease;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes mn-sparkle-rise {
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

@keyframes mn-glow-breathe {
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

@keyframes mn-spin-bloom {
  to {
    transform: rotate(360deg);
  }
}

@keyframes mn-seal-pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow:
      0 10px 24px rgba(var(--tc-5c5c5c-rgb, 92, 92, 92), 0.35),
      inset 0 0 0 3px rgba(var(--tc-fbf8f0-rgb, 251, 248, 240), 0.35);
  }

  50% {
    transform: scale(1.05);
    box-shadow:
      0 14px 30px rgba(var(--tc-5c5c5c-rgb, 92, 92, 92), 0.45),
      inset 0 0 0 3px rgba(var(--tc-fbf8f0-rgb, 251, 248, 240), 0.5);
  }
}

@keyframes mn-card-in {
  from {
    opacity: 0;
    transform: translateY(34px) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes mn-card-out {
  to {
    opacity: 0;
    transform: translateY(-46px) scale(0.9);
  }
}

@keyframes mn-fade-out {
  to {
    opacity: 0;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .mn-card {
    width: 100%;
  }

  .mn-card__inner {
    padding: 32px 18px 28px;
  }

  .mn-card__seal {
    width: 64px;
    height: 64px;
  }

  .mn-card__seal span {
    font-size: 22px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .mn-sparkle,
  .mn-opening__glow--1,
  .mn-opening__brand i,
  .mn-card__seal,
  .mn-card {
    animation: none;
  }
}
</style>
