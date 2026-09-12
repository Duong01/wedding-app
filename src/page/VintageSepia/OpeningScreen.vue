<template>
  <section class="vs-opening" :class="{ 'vs-opening--active': opening }">
    <!-- =====================================================
         PAPER BACKGROUND
    ====================================================== -->
    <div class="vs-opening__paper"></div>
    <div class="vs-opening__grain"></div>

    <!-- Drifting dust motes -->
    <div class="vs-motes" aria-hidden="true">
      <span v-for="n in 10" :key="n" class="vs-mote" :class="`vs-mote--${n}`"></span>
    </div>

    <!-- =====================================================
         TOP LABEL
    ====================================================== -->
    <p class="vs-opening__eyebrow">THƯ MỜI ĐÁM CƯỚI</p>

    <!-- =====================================================
         LETTER / ENVELOPE CARD
    ====================================================== -->
    <div class="vs-letter">
      <span class="vs-letter__stamp" aria-hidden="true">❦</span>

      <div class="vs-letter__inner">
        <p class="vs-letter__kicker">SAVE THE DATE</p>

        <div class="vs-seal vs-letter__seal">
          <span>{{ monogram }}</span>
        </div>

        <p class="vs-letter__invite">TRÂN TRỌNG KÍNH MỜI</p>

        <h1>{{ guestName }}</h1>

        <div class="vs-letter__divider">
          <span></span>
          <i>❦</i>
          <span></span>
        </div>

        <p class="vs-letter__names">
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </p>

        <p class="vs-letter__date">{{ dateLabel || "NGÀY VUI CỦA CHÚNG MÌNH" }}</p>
      </div>

      <span class="vs-letter__tape vs-letter__tape--tl" aria-hidden="true"></span>
      <span class="vs-letter__tape vs-letter__tape--br" aria-hidden="true"></span>
    </div>

    <!-- =====================================================
         OPEN BUTTON
    ====================================================== -->
    <button type="button" class="vs-open-btn" :disabled="opening" @click="openInvitation">
      <span class="vs-open-btn__icon">
        <v-icon size="16">mdi-email-open-outline</v-icon>
      </span>

      <span class="vs-open-btn__text">MỞ THƯ MỜI</span>

      <span class="vs-open-btn__arrow">↗</span>
    </button>

    <p class="vs-hint">
      <span></span>
      Một phong thư · Một câu chuyện · Một ngày đáng nhớ
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
.vs-opening {
  --vs-ink: #3d2f24;
  --vs-brown: #6b4f3a;
  --vs-faded: #97745a;
  --vs-gold: #c2a878;
  --vs-parchment: #ead9bd;
  --vs-paper: #fbf5e6;
  --vs-bg: #f6efe2;

  position: relative;
  isolation: isolate;

  min-height: 100svh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 34px 18px 28px;

  overflow: hidden;

  color: var(--vs-brown);

  background: var(--vs-bg);
}

/* =========================================================
   PAPER TEXTURE
========================================================= */

.vs-opening__paper {
  position: absolute;
  inset: 0;
  z-index: -10;

  background:
    radial-gradient(ellipse at 18% 10%, rgba(255, 252, 244, 0.85), transparent 45%),
    radial-gradient(ellipse at 84% 80%, rgba(194, 168, 120, 0.2), transparent 50%),
    radial-gradient(ellipse at 50% 105%, rgba(107, 79, 58, 0.14), transparent 55%),
    linear-gradient(165deg, #f6efe2 0%, #f0e5cd 55%, #e9dabC 100%);
}

.vs-opening__grain {
  position: absolute;
  inset: 0;
  z-index: -8;

  opacity: 0.55;

  background-image:
    radial-gradient(rgba(107, 79, 58, 0.14) 0.6px, transparent 0.7px),
    radial-gradient(rgba(61, 47, 36, 0.08) 0.5px, transparent 0.6px);

  background-size: 5px 5px, 9px 9px;
  background-position: 0 0, 3px 4px;

  pointer-events: none;
}

.vs-opening::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -6;

  box-shadow: inset 0 0 90px rgba(107, 79, 58, 0.22);

  pointer-events: none;
}

/* =========================================================
   DUST MOTES
========================================================= */

.vs-motes {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
}

.vs-mote {
  position: absolute;
  bottom: -20px;

  width: 4px;
  height: 4px;

  border-radius: 50%;

  background: rgba(194, 168, 120, 0.55);

  box-shadow: 0 0 5px rgba(194, 168, 120, 0.5);

  animation: vs-mote-drift linear infinite;
}

.vs-mote--1 { left: 7%; width: 4px; height: 4px; animation-duration: 13s; animation-delay: 0s; }
.vs-mote--2 { left: 18%; width: 3px; height: 3px; animation-duration: 16s; animation-delay: 2.4s; }
.vs-mote--3 { left: 29%; width: 5px; height: 5px; animation-duration: 14s; animation-delay: 1.1s; }
.vs-mote--4 { left: 41%; width: 3px; height: 3px; animation-duration: 17s; animation-delay: 3.6s; }
.vs-mote--5 { left: 52%; width: 4px; height: 4px; animation-duration: 12.5s; animation-delay: 0.7s; }
.vs-mote--6 { left: 63%; width: 3px; height: 3px; animation-duration: 15.5s; animation-delay: 2.9s; }
.vs-mote--7 { left: 73%; width: 5px; height: 5px; animation-duration: 13.5s; animation-delay: 1.8s; }
.vs-mote--8 { left: 83%; width: 3px; height: 3px; animation-duration: 16.5s; animation-delay: 4.2s; }
.vs-mote--9 { left: 91%; width: 4px; height: 4px; animation-duration: 14.5s; animation-delay: 0.4s; }
.vs-mote--10 { left: 96%; width: 3px; height: 3px; animation-duration: 17.5s; animation-delay: 3.1s; }

/* =========================================================
   EYEBROW
========================================================= */

.vs-opening__eyebrow {
  margin: 0 0 26px;

  color: var(--vs-faded);

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

/* =========================================================
   LETTER CARD
========================================================= */

.vs-letter {
  position: relative;
  z-index: 2;

  width: min(100%, 380px);

  background: var(--vs-paper);

  box-shadow:
    0 24px 55px rgba(61, 47, 36, 0.2),
    0 2px 6px rgba(61, 47, 36, 0.12);

  animation: vs-letter-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.vs-letter::before {
  content: "";
  position: absolute;
  inset: 9px;

  border: 1px dashed rgba(107, 79, 58, 0.35);

  pointer-events: none;
}

/* Postage stamp corner (perforated edge) */
.vs-letter__stamp {
  --vs-hole: 3px;
  --vs-gap: 10px;

  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 3;

  width: 54px;
  height: 64px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #fffdf6;

  background-image:
    radial-gradient(circle at 50% 50%, var(--vs-paper) var(--vs-hole), transparent calc(var(--vs-hole) + 0.5px)),
    radial-gradient(circle at 50% 50%, var(--vs-paper) var(--vs-hole), transparent calc(var(--vs-hole) + 0.5px)),
    radial-gradient(circle at 50% 50%, var(--vs-paper) var(--vs-hole), transparent calc(var(--vs-hole) + 0.5px)),
    radial-gradient(circle at 50% 50%, var(--vs-paper) var(--vs-hole), transparent calc(var(--vs-hole) + 0.5px));

  background-size:
    var(--vs-gap) calc(var(--vs-hole) * 2),
    var(--vs-gap) calc(var(--vs-hole) * 2),
    calc(var(--vs-hole) * 2) var(--vs-gap),
    calc(var(--vs-hole) * 2) var(--vs-gap);

  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
  background-position: 0 0, 0 100%, 0 0, 100% 0;

  box-shadow: 0 4px 10px rgba(61, 47, 36, 0.16);

  color: var(--vs-gold);

  font-size: 20px;

  transform: rotate(4deg);
}

.vs-letter__inner {
  position: relative;

  padding: 42px 30px 36px;

  text-align: center;
}

.vs-letter__kicker {
  margin: 0 0 20px;

  color: var(--vs-gold);

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

/* =========================================================
   WAX SEAL
========================================================= */

.vs-seal {
  position: relative;

  width: 76px;
  height: 76px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 46% 54% 50% 50% / 53% 47% 55% 45%;

  background: radial-gradient(circle at 34% 28%, #8a6a4f, #6b4f3a 55%, #4a3a2c 100%);

  box-shadow:
    0 8px 18px rgba(61, 47, 36, 0.35),
    inset 0 2px 4px rgba(255, 240, 214, 0.28),
    inset 0 -3px 6px rgba(30, 22, 16, 0.4);

  animation: vs-seal-press 3.4s ease-in-out infinite;
}

.vs-seal::before {
  content: "";
  position: absolute;
  inset: 7px;

  border: 1px dashed rgba(234, 217, 189, 0.4);

  border-radius: 46% 54% 50% 50% / 53% 47% 55% 45%;
}

.vs-seal span {
  font-family: "Allura", cursive;

  font-size: 26px;

  color: var(--vs-parchment);

  text-shadow: 0 1px 2px rgba(30, 22, 16, 0.55);
}

.vs-letter__seal {
  margin: 0 auto 20px;
}

/* =========================================================
   LETTER CONTENT
========================================================= */

.vs-letter__invite {
  margin: 0 0 6px;

  color: var(--vs-faded);

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.24em;
  text-indent: 0.24em;
}

.vs-letter__inner h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(38px, 10vw, 48px);
  font-weight: 400;

  line-height: 1.15;

  color: var(--vs-ink);
}

.vs-letter__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin: 14px 0;

  color: var(--vs-gold);
}

.vs-letter__divider span {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(107, 79, 58, 0.6));
}

.vs-letter__divider span:last-child {
  transform: rotate(180deg);
}

.vs-letter__divider i {
  font-size: 12px;
  font-style: normal;
}

.vs-letter__names {
  margin: 0 0 16px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 19px;
  font-weight: 600;

  color: var(--vs-brown);
}

.vs-letter__names i {
  padding: 0 5px;

  color: var(--vs-faded);

  font-family: "Allura", cursive;
  font-size: 22px;
  font-style: normal;
}

.vs-letter__date {
  display: inline-block;

  padding: 8px 18px;

  border: 1.5px solid rgba(107, 79, 58, 0.5);
  border-radius: 8px;

  background: rgba(255, 253, 246, 0.7);

  color: var(--vs-faded);

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;
  text-indent: 0.2em;

  transform: rotate(-1.5deg);
}

/* Tape strips on letter corners */
.vs-letter__tape {
  position: absolute;
  z-index: 4;

  width: 96px;
  height: 24px;

  background: rgba(194, 168, 120, 0.35);

  box-shadow: 0 1px 3px rgba(61, 47, 36, 0.12);

  pointer-events: none;
}

.vs-letter__tape--tl {
  top: 12px;
  left: -36px;

  transform: rotate(-45deg);
}

.vs-letter__tape--br {
  bottom: 12px;
  right: -36px;

  transform: rotate(-45deg);
}

/* =========================================================
   OPEN BUTTON
========================================================= */

.vs-open-btn {
  position: relative;
  z-index: 3;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 30px;

  padding: 13px 26px;

  border: 1px solid #2c211a;
  border-radius: 8px;

  color: var(--vs-parchment);

  background: linear-gradient(160deg, #4a3a2c, #3d2f24 60%, #2c211a);

  box-shadow:
    0 12px 26px rgba(61, 47, 36, 0.35),
    inset 0 1px 0 rgba(234, 217, 189, 0.2);

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;
  text-indent: 0.1em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.vs-open-btn:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow:
    0 16px 32px rgba(61, 47, 36, 0.42),
    inset 0 1px 0 rgba(234, 217, 189, 0.2);
}

.vs-open-btn:disabled {
  opacity: 0.75;
  cursor: default;
}

.vs-open-btn__icon {
  display: flex;
  align-items: center;
}

.vs-open-btn__arrow {
  font-size: 12px;
}

/* =========================================================
   HINT
========================================================= */

.vs-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 22px 0 0;

  color: rgba(107, 79, 58, 0.75);

  font-size: 10px;
  font-style: italic;

  letter-spacing: 0.06em;
}

.vs-hint span {
  width: 34px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(107, 79, 58, 0.55));
}

.vs-hint span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   EXIT ANIMATION
========================================================= */

.vs-opening--active .vs-letter {
  animation: vs-letter-out 0.9s cubic-bezier(0.5, 0, 0.75, 0.4) both;
}

.vs-opening--active .vs-open-btn,
.vs-opening--active .vs-hint,
.vs-opening--active .vs-opening__eyebrow {
  animation: vs-fade-out 0.45s ease both;
}

.vs-opening--active .vs-motes {
  opacity: 0;
  transition: opacity 0.6s ease;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes vs-mote-drift {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }

  12% {
    opacity: 0.85;
  }

  50% {
    transform: translateY(-46vh) translateX(10px);
  }

  88% {
    opacity: 0.6;
  }

  100% {
    transform: translateY(-96vh) translateX(-8px);
    opacity: 0;
  }
}

@keyframes vs-seal-press {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

@keyframes vs-letter-in {
  from {
    opacity: 0;
    transform: translateY(34px) rotate(-2deg) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateY(0) rotate(0deg) scale(1);
  }
}

@keyframes vs-letter-out {
  to {
    opacity: 0;
    transform: translateY(-46px) rotate(2deg) scale(0.9);
  }
}

@keyframes vs-fade-out {
  to {
    opacity: 0;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .vs-letter {
    width: 100%;
  }

  .vs-letter__inner {
    padding: 36px 20px 30px;
  }

  .vs-letter__stamp {
    width: 46px;
    height: 56px;

    font-size: 16px;
  }

  .vs-seal {
    width: 64px;
    height: 64px;
  }

  .vs-seal span {
    font-size: 22px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .vs-mote,
  .vs-seal,
  .vs-letter {
    animation: none;
  }
}
</style>
