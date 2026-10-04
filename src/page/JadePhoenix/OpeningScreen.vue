<template>
  <section class="jp-opening" :class="{ 'jp-opening--active': opening }">
    <!-- =====================================================
         BACKGROUND
    ====================================================== -->
    <div class="jp-opening__bg"></div>
    <div class="jp-opening__glow jp-opening__glow--1"></div>
    <div class="jp-opening__glow jp-opening__glow--2"></div>

    <!-- Rising jade sparkles -->
    <div class="jp-sparkles" aria-hidden="true">
      <span v-for="n in 12" :key="n" class="jp-sparkle" :class="`jp-sparkle--${n}`">囍</span>
    </div>

    <!-- =====================================================
         TOP BRANDING
    ====================================================== -->
    <div class="jp-opening__brand">
      <span></span>
      <i>❀</i>
      <span></span>
    </div>

    <p class="jp-opening__eyebrow">{{ eyebrow }}</p>

    <!-- =====================================================
         INVITATION CARD
    ====================================================== -->
    <div class="jp-card">
      <div class="jp-card__arch"></div>

      <div class="jp-card__inner">
        <p class="jp-card__kicker">{{ kicker }}</p>

        <div class="jp-card__seal">
          <span>{{ monogram }}</span>
        </div>

        <p class="jp-card__invite">{{ inviteText }}</p>

        <h1>{{ guestName }}</h1>

        <div class="jp-card__divider">
          <span></span>
          <i>❀</i>
          <span></span>
        </div>

        <p class="jp-card__names">
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </p>

        <p class="jp-card__date">{{ dateLabel || "OUR WEDDING DAY" }}</p>
      </div>
    </div>

    <!-- =====================================================
         OPEN BUTTON
    ====================================================== -->
    <button type="button" class="jp-open-btn" :disabled="opening" @click="openInvitation">
      <span class="jp-open-btn__icon">
        <v-icon size="16">mdi-email-open-outline</v-icon>
      </span>

      <span class="jp-open-btn__text">{{ buttonText }}</span>

      <span class="jp-open-btn__arrow">↗</span>
    </button>

    <p class="jp-hint">
      <span class="jp-hint__line"></span>
      <span class="jp-hint__text">{{ hintText }}</span>
      <span class="jp-hint__line"></span>
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
.jp-opening {
  --jp-deep: var(--tc-6e1f24, #6e1f24);
  --jp-jade: var(--tc-68262c, #68262c);
  --jp-plum: var(--tc-8a3a40, #8a3a40);
  --jp-lilac: var(--tc-e8c98a, #e8c98a);
  --jp-line: var(--tc-6e2a30, #6e2a30);
  --jp-cream: var(--tc-fdfaf3, #fdfaf3);

  position: relative;
  isolation: isolate;

  min-height: 100svh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 34px 18px 28px;

  overflow: hidden;

  color: var(--jp-deep);

  background: linear-gradient(160deg, var(--tc-fbf4e6, #fbf4e6) 0%, var(--tc-f8edd6, #f8edd6) 38%, var(--tc-f3e3c4, #f3e3c4) 70%, var(--tc-edd5a4, #edd5a4) 100%);
}

/* =========================================================
   BACKGROUND
========================================================= */

.jp-opening__bg {
  position: absolute;
  inset: 0;
  z-index: -10;

  background:
    radial-gradient(ellipse at 50% 18%, rgba(var(--tc-fefbf5-rgb, 254, 251, 245), 0.9), transparent 42%),
    radial-gradient(ellipse at 12% 82%, rgba(var(--tc-e8c98a-rgb, 232, 201, 138), 0.45), transparent 38%),
    radial-gradient(ellipse at 88% 72%, rgba(var(--tc-b98a4b-rgb, 185, 138, 75), 0.22), transparent 40%);
}

.jp-opening::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -5;

  opacity: 0.16;

  background-image: radial-gradient(rgba(var(--tc-6e1f24-rgb, 110, 31, 36), 0.5) 0.6px, transparent 0.6px);
  background-size: 7px 7px;

  pointer-events: none;
}

.jp-opening__glow {
  position: absolute;
  z-index: -4;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(10px);
}

.jp-opening__glow--1 {
  width: 380px;
  height: 380px;
  top: 6%;
  left: 50%;
  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(var(--tc-fdfaf3-rgb, 253, 250, 243), 0.6), transparent 68%);

  animation: jp-glow-breathe 5.5s ease-in-out infinite;
}

.jp-opening__glow--2 {
  width: 260px;
  height: 260px;
  bottom: -90px;
  left: 50%;
  transform: translateX(-50%);

  background: radial-gradient(circle, rgba(var(--tc-d9b46a-rgb, 217, 180, 106), 0.24), transparent 70%);
}

/* =========================================================
   SPARKLES
========================================================= */

.jp-sparkles {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
}

.jp-sparkle {
  position: absolute;
  bottom: -40px;

  color: rgba(var(--tc-b98a4b-rgb, 185, 138, 75), 0.6);

  text-shadow: 0 0 8px rgba(var(--tc-e8c98a-rgb, 232, 201, 138), 0.85);

  animation: jp-sparkle-rise linear infinite;
}

.jp-sparkle--1 { left: 6%; font-size: 12px; animation-duration: 11s; animation-delay: 0s; }
.jp-sparkle--2 { left: 16%; font-size: 10px; animation-duration: 14s; animation-delay: 2.2s; }
.jp-sparkle--3 { left: 27%; font-size: 15px; animation-duration: 12.5s; animation-delay: 1s; }
.jp-sparkle--4 { left: 38%; font-size: 11px; animation-duration: 15s; animation-delay: 3.4s; }
.jp-sparkle--5 { left: 49%; font-size: 11px; animation-duration: 10.5s; animation-delay: 0.8s; }
.jp-sparkle--6 { left: 60%; font-size: 11px; animation-duration: 13.5s; animation-delay: 2.8s; }
.jp-sparkle--7 { left: 70%; font-size: 14px; animation-duration: 12s; animation-delay: 1.6s; }
.jp-sparkle--8 { left: 80%; font-size: 11px; animation-duration: 14.5s; animation-delay: 4s; }
.jp-sparkle--9 { left: 89%; font-size: 12px; animation-duration: 11.5s; animation-delay: 0.4s; }
.jp-sparkle--10 { left: 95%; font-size: 11px; animation-duration: 15.5s; animation-delay: 3s; }
.jp-sparkle--11 { left: 44%; font-size: 10px; animation-duration: 16s; animation-delay: 5s; }
.jp-sparkle--12 { left: 33%; font-size: 10px; animation-duration: 13s; animation-delay: 6s; }

/* =========================================================
   BRAND
========================================================= */

.jp-opening__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-bottom: 10px;

  color: var(--jp-line);
}

.jp-opening__brand span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-d9b46a-rgb, 217, 180, 106), 0.8));
}

.jp-opening__brand span:last-child {
  transform: rotate(180deg);
}

.jp-opening__brand i {
  font-size: 14px;
  font-style: normal;

  animation: jp-spin-bloom 9s linear infinite;
}

.jp-opening__eyebrow {
  margin: 0 0 26px;

  color: var(--jp-jade);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.42em;
  text-indent: 0.42em;
}

/* =========================================================
   CARD
========================================================= */

.jp-card {
  position: relative;
  z-index: 2;

  width: min(100%, 360px);

  padding: 10px;

  border-radius: 190px 190px 26px 26px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.94), rgba(var(--tc-f8edd6-rgb, 248, 237, 214), 0.9));

  box-shadow:
    0 26px 60px rgba(var(--tc-6e1f24-rgb, 110, 31, 36), 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85);

  animation: jp-card-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.jp-card__arch {
  position: absolute;
  inset: 5px;

  border: 1px solid rgba(var(--tc-b98a4b-rgb, 185, 138, 75), 0.55);
  border-radius: 184px 184px 22px 22px;

  box-shadow:
    inset 0 0 0 3px rgba(var(--tc-fdfaf3-rgb, 253, 250, 243), 0.9),
    inset 0 0 0 4px rgba(var(--tc-e8c98a-rgb, 232, 201, 138), 0.55);

  pointer-events: none;
}

.jp-card__inner {
  position: relative;

  padding: 40px 26px 34px;

  text-align: center;
}

.jp-card__kicker {
  margin: 0 0 18px;

  color: var(--jp-line);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.jp-card__seal {
  position: relative;

  width: 74px;
  height: 74px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 20px;

  border-radius: 50%;

  background: radial-gradient(circle at 34% 30%, var(--tc-d9b46a, #d9b46a), var(--tc-68262c, #68262c) 58%, var(--tc-8a3a40, #8a3a40) 100%);

  box-shadow:
    0 10px 24px rgba(var(--tc-8a3a40-rgb, 138, 58, 64), 0.35),
    inset 0 0 0 3px rgba(var(--tc-fdfaf3-rgb, 253, 250, 243), 0.35);

  animation: jp-seal-pulse 3.2s ease-in-out infinite;
}

.jp-card__seal::before {
  content: "";
  position: absolute;
  inset: 6px;

  border: 1px dashed rgba(var(--tc-fdfaf3-rgb, 253, 250, 243), 0.55);
  border-radius: 50%;
}

.jp-card__seal span {
  font-family: "Allura", cursive;

  font-size: 26px;

  color: var(--tc-fefbf6, #fefbf6);

  text-shadow: 0 1px 2px rgba(var(--tc-6e1f24-rgb, 110, 31, 36), 0.4);
}

.jp-card__invite {
  margin: 0 0 6px;

  color: var(--jp-jade);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
  text-indent: 0.26em;
}

.jp-card__inner h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(38px, 10vw, 48px);
  font-weight: 400;

  line-height: 1.15;

  color: var(--jp-deep);
}

.jp-card__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin: 14px 0;

  color: var(--jp-line);
}

.jp-card__divider span {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-d9b46a-rgb, 217, 180, 106), 0.75));
}

.jp-card__divider span:last-child {
  transform: rotate(180deg);
}

.jp-card__divider i {
  font-size: 12px;
  font-style: normal;
}

.jp-card__names {
  margin: 0 0 16px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 19px;
  font-weight: 600;

  color: var(--jp-deep);
}

.jp-card__names i {
  padding: 0 5px;

  color: var(--jp-jade);

  font-family: "Allura", cursive;
  font-size: 22px;
  font-style: normal;
}

.jp-card__date {
  display: inline-block;

  padding: 8px 18px;

  border: 1px solid rgba(var(--tc-d9b46a-rgb, 217, 180, 106), 0.45);
  border-radius: 999px;

  background: rgba(var(--tc-fefbf5-rgb, 254, 251, 245), 0.7);

  color: var(--jp-jade);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.22em;
  text-indent: 0.22em;
}

/* =========================================================
   OPEN BUTTON
========================================================= */

.jp-open-btn {
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

  color: var(--tc-fefbf6, #fefbf6);

  background: linear-gradient(135deg, var(--tc-68262c, #68262c), var(--tc-8a3a40, #8a3a40));

  box-shadow: 0 14px 30px rgba(var(--tc-6e1f24-rgb, 110, 31, 36), 0.32);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;
  text-indent: 0.1em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.jp-open-btn:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 18px 36px rgba(var(--tc-6e1f24-rgb, 110, 31, 36), 0.4);
}

.jp-open-btn:disabled {
  opacity: 0.75;
  cursor: default;
}

.jp-open-btn__icon {
  display: flex;
  align-items: center;
}

.jp-open-btn__text {
  text-align: center;
  white-space: pre-line;
}

.jp-open-btn__arrow {
  font-size: 12px;
}

/* =========================================================
   HINT
========================================================= */

.jp-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 22px 0 0;

  color: rgba(var(--tc-6e1f24-rgb, 110, 31, 36), 0.72);

  font-size: 10px;
  font-style: italic;

  letter-spacing: 0.06em;
}

.jp-hint__text {
  text-align: center;
  white-space: pre-line;
}

.jp-hint__line {
  flex: 0 0 auto;

  width: 34px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-d9b46a-rgb, 217, 180, 106), 0.6));
}

.jp-hint__line:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   EXIT ANIMATION
========================================================= */

.jp-opening--active .jp-card {
  animation: jp-card-out 0.9s cubic-bezier(0.5, 0, 0.75, 0.4) both;
}

.jp-opening--active .jp-open-btn,
.jp-opening--active .jp-hint,
.jp-opening--active .jp-opening__brand,
.jp-opening--active .jp-opening__eyebrow {
  animation: jp-fade-out 0.45s ease both;
}

.jp-opening--active .jp-sparkles {
  opacity: 0;
  transition: opacity 0.6s ease;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes jp-sparkle-rise {
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

@keyframes jp-glow-breathe {
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

@keyframes jp-spin-bloom {
  to {
    transform: rotate(360deg);
  }
}

@keyframes jp-seal-pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow:
      0 10px 24px rgba(var(--tc-8a3a40-rgb, 138, 58, 64), 0.35),
      inset 0 0 0 3px rgba(var(--tc-fdfaf3-rgb, 253, 250, 243), 0.35);
  }

  50% {
    transform: scale(1.05);
    box-shadow:
      0 14px 30px rgba(var(--tc-8a3a40-rgb, 138, 58, 64), 0.45),
      inset 0 0 0 3px rgba(var(--tc-fdfaf3-rgb, 253, 250, 243), 0.5);
  }
}

@keyframes jp-card-in {
  from {
    opacity: 0;
    transform: translateY(34px) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes jp-card-out {
  to {
    opacity: 0;
    transform: translateY(-46px) scale(0.9);
  }
}

@keyframes jp-fade-out {
  to {
    opacity: 0;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .jp-card {
    width: 100%;
  }

  .jp-card__inner {
    padding: 32px 18px 28px;
  }

  .jp-card__seal {
    width: 64px;
    height: 64px;
  }

  .jp-card__seal span {
    font-size: 22px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .jp-sparkle,
  .jp-opening__glow--1,
  .jp-opening__brand i,
  .jp-card__seal,
  .jp-card {
    animation: none;
  }
}
</style>
