<template>
  <section class="opening" :class="{ 'opening--active': opening }">
    <!-- =====================================================
         BACKGROUND
    ====================================================== -->

    <div class="opening__background"></div>

    <div class="opening__glow opening__glow--1"></div>
    <div class="opening__glow opening__glow--2"></div>

    <!-- Decorative flowers -->
    <img :src="flower" class="opening__flower opening__flower--top" alt="" />

    <img :src="flower" class="opening__flower opening__flower--bottom" alt="" />

    <!-- Floating sparkles -->
    <div class="sparkles" aria-hidden="true">
      <span class="sparkle sparkle--1">✦</span>
      <span class="sparkle sparkle--2">✦</span>
      <span class="sparkle sparkle--3">✦</span>
      <span class="sparkle sparkle--4">✦</span>
      <span class="sparkle sparkle--5">✦</span>
      <span class="sparkle sparkle--6">✦</span>
    </div>

    <!-- =====================================================
         TOP BRANDING
    ====================================================== -->

    <div class="opening__brand">
      <span></span>

      <div class="brand-heart">
        <v-icon size="14">mdi-heart</v-icon>
      </div>

      <span></span>
    </div>

    <div class="opening__eyebrow">WEDDING INVITATION</div>

    <!-- =====================================================
         ENVELOPE
    ====================================================== -->

    <div class="envelope">
      <!-- Envelope back -->
      <div class="envelope__back"></div>

      <!-- Invitation card -->
      <div class="envelope__card">
        <div class="card-border"></div>

        <div class="card-content">
          <div class="card-eyebrow">SAVE THE DATE</div>

          <div class="card-icon">
            <img :src="icon" alt="Biểu tượng cưới" />
          </div>

          <p class="card-invite">Trân trọng kính mời</p>

          <h1>{{ guestName }}</h1>

          <div class="card-divider">
            <span></span>
            <i>♡</i>
            <span></span>
          </div>

          <p class="card-names">
            {{ groomName }}
            <i>&amp;</i>
            {{ brideName }}
          </p>

          <div class="card-date">
            {{ dateLabel || "OUR WEDDING DAY" }}
          </div>
        </div>
      </div>

      <!-- Envelope lower body -->
      <div class="envelope__body"></div>

      <!-- Envelope flap -->
      <div class="envelope__flap">
        <div class="flap-line"></div>

        <!-- Wax seal -->
        <div class="wax-seal">
          <span>{{ monogram }}</span>

          <div class="wax-heart">
            <v-icon size="13">mdi-heart</v-icon>
          </div>
        </div>
      </div>

      <!-- Envelope shine -->
      <div class="envelope__shine"></div>
    </div>

    <!-- =====================================================
         OPEN BUTTON
    ====================================================== -->

    <button
      type="button"
      class="open-button"
      :disabled="opening"
      @click="openInvitation"
    >
      <span class="open-button__icon">
        <v-icon size="17">mdi-email-open-outline</v-icon>
      </span>

      <span class="open-button__text">CHẠM ĐỂ MỞ THIỆP</span>

      <span class="open-button__arrow">↗</span>
    </button>

    <p class="hint">
      <span></span>
      Một lời mời · Một câu chuyện · Một ngày đặc biệt
      <span></span>
    </p>

    <!-- Bottom ornament -->
    <div class="opening__footer">
      <span></span>

      <v-icon size="13">mdi-flower-outline</v-icon>

      <span></span>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { icon } from "@/page/RomanticPink/romaticpink";
import flower from "@/assets/glass-garden-pink/flower1-decoration.webp";

const props = defineProps({
  wedding: {
    type: Object,
    default: () => ({}),
  },

  monogram: {
    type: String,
    default: "G & B",
  },

  dateLabel: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["open"]);

const opening = ref(false);

const groomName = computed(
  () => props.wedding?.GroomName || props.wedding?.groomName || ""
);

const brideName = computed(
  () => props.wedding?.BrideName || props.wedding?.brideName || ""
);

const guestName = computed(
  () =>
    props.wedding?.recipientName?.Name ||
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
/* =========================================================
   OPENING
========================================================= */

.opening {
  --gg-rose: var(--primary, #cb5d6c);
  --gg-deep: var(--secondary, #933845);
  --gg-white: var(--white, #ffffff);

  position: relative;
  isolation: isolate;

  min-height: 100svh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 34px 18px 28px;

  overflow: hidden;

  color: var(--gg-deep);

  background-color: #fdf3f4;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.72),
      rgba(255, 255, 255, 0.72)
    ),
    url("@/assets/glass-garden-pink/floral-background.webp");
  background-repeat: repeat;
  background-size: 180% auto;
  background-position: top left;
}

/* =========================================================
   BACKGROUND
========================================================= */

.opening__background {
  position: absolute;
  inset: 0;

  z-index: -10;

  background: radial-gradient(
      ellipse at 50% 22%,
      rgba(255, 255, 255, 0.75),
      transparent 42%
    ),
    radial-gradient(
      ellipse at 15% 80%,
      rgba(203, 93, 108, 0.1),
      transparent 36%
    ),
    radial-gradient(
      ellipse at 90% 70%,
      rgba(203, 93, 108, 0.08),
      transparent 34%
    );
}

/* Hạt sáng li ti */
.opening::before {
  content: "";

  position: absolute;
  inset: 0;

  z-index: -5;

  opacity: 0.16;

  background-image: radial-gradient(
    rgba(203, 93, 108, 0.5) 0.6px,
    transparent 0.6px
  );

  background-size: 6px 6px;

  pointer-events: none;
}

.opening__glow {
  position: absolute;

  z-index: -4;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(8px);
}

.opening__glow--1 {
  width: 360px;
  height: 360px;

  top: 8%;

  left: 50%;

  transform: translateX(-50%);

  background: radial-gradient(
    circle,
    rgba(203, 93, 108, 0.14),
    transparent 68%
  );

  animation: glow-breathe 5s ease-in-out infinite;
}

.opening__glow--2 {
  width: 240px;
  height: 240px;

  bottom: -80px;
  left: 50%;

  transform: translateX(-50%);

  background: radial-gradient(
    circle,
    rgba(147, 56, 69, 0.1),
    transparent 70%
  );
}

/* =========================================================
   FLOWERS
========================================================= */

.opening__flower {
  position: absolute;

  z-index: -2;

  width: min(68vw, 360px);

  opacity: 0.5;

  pointer-events: none;

  filter: saturate(0.9) drop-shadow(0 12px 20px rgba(147, 56, 69, 0.12));
}

.opening__flower--top {
  top: -105px;
  left: -115px;

  transform: rotate(-28deg) scale(1.05);

  animation: flower-top 8s ease-in-out infinite;
}

.opening__flower--bottom {
  right: -120px;
  bottom: -105px;

  transform: scale(-1.05) rotate(-28deg);

  opacity: 0.42;

  animation: flower-bottom 9s ease-in-out infinite;
}

/* =========================================================
   SPARKLES
========================================================= */

.sparkles {
  position: absolute;
  inset: 0;

  z-index: -1;

  pointer-events: none;
}

.sparkle {
  position: absolute;

  color: rgba(203, 93, 108, 0.75);

  font-family: Georgia, serif;

  text-shadow: 0 0 10px rgba(203, 93, 108, 0.4);

  animation: sparkle-float 3.5s ease-in-out infinite;
}

.sparkle--1 {
  top: 17%;
  left: 16%;
  font-size: 13px;
}

.sparkle--2 {
  top: 28%;
  right: 13%;
  font-size: 10px;
  animation-delay: 0.8s;
}

.sparkle--3 {
  top: 51%;
  left: 8%;
  font-size: 11px;
  animation-delay: 1.4s;
}

.sparkle--4 {
  top: 63%;
  right: 10%;
  font-size: 18px;
  animation-delay: 2s;
}

.sparkle--5 {
  bottom: 19%;
  left: 20%;
  font-size: 10px;
  animation-delay: 2.5s;
}

.sparkle--6 {
  bottom: 13%;
  right: 22%;
  font-size: 13px;
  animation-delay: 1.1s;
}

/* =========================================================
   BRAND
========================================================= */

.opening__brand {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  margin-bottom: 8px;

  opacity: 0;

  animation: fade-up 0.8s 0.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.opening__brand > span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(203, 93, 108, 0.6));
}

.opening__brand > span:last-child {
  transform: rotate(180deg);
}

.brand-heart {
  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--gg-rose);

  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.3);

  box-shadow: inset 1px 1px 2px rgba(255, 255, 255, 0.6),
    0 6px 16px -4px rgba(147, 56, 69, 0.24);

  animation: heart-breathe 2.7s ease-in-out infinite;
}

.opening__eyebrow {
  margin-bottom: 18px;

  color: var(--gg-deep);

  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 11px;
  font-weight: 400;

  letter-spacing: 0.34em;

  opacity: 0;

  animation: fade-up 0.8s 0.18s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

/* =========================================================
   ENVELOPE
========================================================= */

.envelope {
  position: relative;

  width: min(86vw, 375px);

  height: min(112vw, 470px);

  max-height: 470px;

  margin: 0 auto 22px;

  perspective: 1000px;

  filter: drop-shadow(0 28px 35px rgba(147, 56, 69, 0.28));

  animation: envelope-in 1s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* =========================================================
   ENVELOPE BACK
========================================================= */

.envelope__back {
  position: absolute;

  inset: 0;

  border-radius: 5px;

  background: linear-gradient(145deg, #fbe4e8, #e6a3b1);

  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.55);
}

/* =========================================================
   INVITATION CARD
========================================================= */

.envelope__card {
  position: absolute;

  z-index: 2;

  top: 17px;
  left: 17px;
  right: 17px;

  bottom: 48px;

  overflow: hidden;

  background: linear-gradient(150deg, #ffffff, #fdf0f2);

  border: 1px solid rgba(255, 255, 255, 0.6);

  box-shadow: 0 5px 18px rgba(147, 56, 69, 0.14),
    inset 0 0 0 5px rgba(255, 255, 255, 0.6);

  transform: translateY(34px);

  animation: card-rise 0.9s 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

/* Viền trong thiệp */

.card-border {
  position: absolute;

  inset: 10px;

  border: 1px solid rgba(203, 93, 108, 0.28);

  pointer-events: none;
}

.card-content {
  position: relative;

  height: 100%;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 28px 22px;

  text-align: center;
}

/* =========================================================
   CARD CONTENT
========================================================= */

.card-eyebrow {
  color: var(--gg-deep);

  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 10px;
  font-weight: 400;

  letter-spacing: 0.27em;

  opacity: 0.75;
}

.card-icon {
  width: 55px;
  height: 55px;

  margin: 13px 0 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(203, 93, 108, 0.25);
  border-radius: 50%;

  background: linear-gradient(145deg, #ffffff, #fbe6ea);

  box-shadow: 0 7px 18px rgba(147, 56, 69, 0.1);
}

.card-icon img {
  width: 35px;
  height: 35px;

  object-fit: contain;

  opacity: 0.85;
}

.card-invite {
  margin: 5px 0 4px;

  color: var(--gg-deep);

  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 10px;

  letter-spacing: 0.13em;

  opacity: 0.8;
}

.envelope__card h1 {
  max-width: 280px;

  margin: 0;

  color: var(--gg-rose);

  font-family: "EB Garamond", serif;

  font-size: clamp(30px, 8vw, 42px);
  font-weight: 500;

  line-height: 1.08;

  overflow-wrap: anywhere;
}

.card-divider {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 7px;

  width: 100%;

  margin: 13px 0 7px;

  color: var(--gg-rose);
}

.card-divider span {
  width: 35px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(203, 93, 108, 0.6));
}

.card-divider span:last-child {
  transform: rotate(180deg);
}

.card-divider i {
  font-family: Georgia, serif;

  font-size: 13px;

  font-style: normal;
}

.card-names {
  margin: 0;

  color: var(--gg-deep);

  font-family: "EB Garamond", serif;

  font-size: 21px;
  font-weight: 500;
}

.card-names i {
  padding: 0 5px;

  color: var(--gg-rose);

  font-family: "Ms Madi", cursive;

  font-size: 19px;
  font-style: normal;
}

.card-date {
  margin-top: 15px;

  padding-top: 10px;

  border-top: 1px solid rgba(203, 93, 108, 0.3);

  color: var(--gg-deep);

  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 10px;
  font-weight: 400;

  letter-spacing: 0.2em;

  opacity: 0.8;
}

/* =========================================================
   ENVELOPE BODY
========================================================= */

.envelope__body {
  position: absolute;

  z-index: 4;

  left: 0;
  right: 0;
  bottom: 0;

  height: 105px;

  background: linear-gradient(145deg, #e08b9b, #b04a5c);

  clip-path: polygon(0 0, 50% 63%, 100% 0, 100% 100%, 0 100%);

  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

/* =========================================================
   FLAP
========================================================= */

.envelope__flap {
  position: absolute;

  z-index: 6;

  top: 0;
  left: 0;
  right: 0;

  height: 150px;

  clip-path: polygon(0 0, 100% 0, 50% 76%);

  background: linear-gradient(150deg, #eda9b6, #c25c6e);

  transform-origin: top center;

  box-shadow: 0 7px 12px rgba(147, 56, 69, 0.18);
}

/* Đường viền trong nắp */

.flap-line {
  position: absolute;

  left: 15%;
  right: 15%;

  top: 9px;

  height: 1px;

  opacity: 0.6;

  background: linear-gradient(90deg, transparent, #ffffff, transparent);
}

/* =========================================================
   WAX SEAL
========================================================= */

.wax-seal {
  position: absolute;

  z-index: 10;

  left: 50%;
  top: 105px;

  width: 66px;
  height: 66px;

  transform: translate(-50%, -50%);

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  color: #ffffff;

  background: radial-gradient(
    circle at 35% 30%,
    #d97a89,
    #a83f52 68%,
    #7d2436
  );

  border: 2px solid rgba(255, 255, 255, 0.8);

  box-shadow: 0 7px 17px rgba(147, 56, 69, 0.32),
    inset 0 2px 3px rgba(255, 255, 255, 0.25),
    inset 0 -3px 5px rgba(90, 20, 35, 0.25);

  animation: seal-in 0.8s 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.wax-seal > span {
  position: absolute;

  top: 17px;

  font-family: "EB Garamond", serif;

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.04em;
}

.wax-heart {
  position: absolute;

  bottom: 13px;

  color: #ffffff;

  opacity: 0.9;
}

/* =========================================================
   ENVELOPE SHINE
========================================================= */

.envelope__shine {
  position: absolute;

  z-index: 8;

  top: -20%;
  bottom: -20%;

  left: -35%;

  width: 35%;

  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.35),
    transparent
  );

  transform: rotate(18deg) translateX(-180%);

  animation: envelope-shine 4.5s 1.5s ease-in-out infinite;

  pointer-events: none;
}

/* =========================================================
   OPEN BUTTON
========================================================= */

.open-button {
  position: relative;

  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 10px;

  min-width: 230px;

  margin: 0 auto;

  padding: 12px 17px;

  color: #ffffff;

  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 999px;

  background: var(--gg-rose, #cb5d6c);

  box-shadow: 0 9px 25px rgba(147, 56, 69, 0.24),
    inset 0 0 0 1px rgba(255, 255, 255, 0.12);

  cursor: pointer;

  font-family: inherit;

  transition: transform 0.25s ease, background 0.25s ease,
    box-shadow 0.25s ease;
}

.open-button:hover {
  transform: translateY(-3px);

  background: var(--gg-deep, #933845);

  box-shadow: 0 13px 30px rgba(147, 56, 69, 0.3);
}

.open-button:active {
  transform: translateY(0) scale(0.97);
}

.open-button:disabled {
  cursor: default;
}

.open-button__icon {
  width: 29px;
  height: 29px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  color: #ffffff;

  background: rgba(255, 255, 255, 0.16);
}

.open-button__text {
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;

  font-size: 12px;
  font-weight: 600;

  letter-spacing: 0.2em;
}

.open-button__arrow {
  font-size: 17px;

  line-height: 1;

  transition: transform 0.25s ease;
}

.open-button:hover .open-button__arrow {
  transform: translate(2px, -2px);
}

/* =========================================================
   HINT
========================================================= */

.hint {
  display: flex;

  align-items: center;

  gap: 8px;

  margin: 12px 0 0;

  color: var(--gg-deep);

  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 11px;

  letter-spacing: 0.08em;

  opacity: 0;

  animation: fade-up 0.8s 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.hint span {
  width: 16px;
  height: 1px;

  background: rgba(203, 93, 108, 0.45);
}

/* =========================================================
   FOOTER
========================================================= */

.opening__footer {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  margin-top: 19px;

  color: var(--gg-rose);

  opacity: 0;

  animation: fade-up 0.8s 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.opening__footer span {
  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(203, 93, 108, 0.5));
}

.opening__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   ACTIVE / OPENING ANIMATION
========================================================= */

.opening--active .envelope__flap {
  animation: flap-open 0.72s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.opening--active .wax-seal {
  animation: seal-break 0.45s ease forwards;
}

.opening--active .envelope__card {
  animation: card-out 1s 0.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.opening--active .envelope {
  animation: envelope-out 1.1s 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.opening--active .open-button,
.opening--active .hint,
.opening--active .opening__footer,
.opening--active .opening__brand,
.opening--active .opening__eyebrow {
  animation: fade-out 0.35s ease forwards;
}

.opening--active .sparkles {
  animation: sparkle-out 0.8s ease forwards;
}

/* =========================================================
   ANIMATIONS
========================================================= */

@keyframes envelope-in {
  from {
    opacity: 0;

    transform: translateY(45px) scale(0.91) rotateX(7deg);
  }

  to {
    opacity: 1;

    transform: translateY(0) scale(1) rotateX(0);
  }
}

@keyframes card-rise {
  from {
    transform: translateY(45px);
  }

  to {
    transform: translateY(34px);
  }
}

@keyframes seal-in {
  from {
    opacity: 0;

    transform: translate(-50%, -50%) scale(0.5) rotate(-15deg);
  }

  to {
    opacity: 1;

    transform: translate(-50%, -50%) scale(1) rotate(0);
  }
}

@keyframes flap-open {
  0% {
    transform: rotateX(0deg);
  }

  100% {
    transform: rotateX(-178deg);

    opacity: 0;
  }
}

@keyframes seal-break {
  0% {
    transform: translate(-50%, -50%) scale(1);
  }

  40% {
    transform: translate(-50%, -50%) scale(1.14);
  }

  100% {
    opacity: 0;

    transform: translate(-50%, -50%) scale(0.65) rotate(15deg);
  }
}

@keyframes card-out {
  0% {
    transform: translateY(34px);
  }

  35% {
    transform: translateY(-20px) scale(1.015);
  }

  100% {
    transform: translateY(-250px) scale(0.9);

    opacity: 0;
  }
}

@keyframes envelope-out {
  0% {
    transform: translateY(0) scale(1);
  }

  100% {
    transform: translateY(-30px) scale(0.96);

    opacity: 0;
  }
}

@keyframes fade-up {
  from {
    opacity: 0;

    transform: translateY(12px);
  }

  to {
    opacity: 1;

    transform: translateY(0);
  }
}

@keyframes fade-out {
  to {
    opacity: 0;

    transform: translateY(8px);
  }
}

@keyframes glow-breathe {
  0%,
  100% {
    opacity: 0.65;

    transform: translateX(-50%) scale(0.94);
  }

  50% {
    opacity: 1;

    transform: translateX(-50%) scale(1.1);
  }
}

@keyframes heart-breathe {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.08);
  }
}

@keyframes sparkle-float {
  0%,
  100% {
    opacity: 0.2;

    transform: translateY(4px) scale(0.7) rotate(0);
  }

  50% {
    opacity: 1;

    transform: translateY(-7px) scale(1.15) rotate(18deg);
  }
}

@keyframes envelope-shine {
  0%,
  58% {
    transform: rotate(18deg) translateX(-180%);
  }

  78%,
  100% {
    transform: rotate(18deg) translateX(480%);
  }
}

@keyframes flower-top {
  0%,
  100% {
    transform: rotate(-28deg) scale(1.05);
  }

  50% {
    transform: rotate(-24deg) scale(1.09);
  }
}

@keyframes flower-bottom {
  0%,
  100% {
    transform: scale(-1.05) rotate(-28deg);
  }

  50% {
    transform: scale(-1.09) rotate(-24deg);
  }
}

@keyframes sparkle-out {
  to {
    opacity: 0;

    transform: scale(1.5);
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .opening {
    padding: 25px 13px 22px;
  }

  .opening__eyebrow {
    margin-bottom: 14px;

    font-size: 10px;
  }

  .opening__brand > span {
    width: 43px;
  }

  .brand-heart {
    width: 29px;
    height: 29px;
  }

  .envelope {
    width: min(88vw, 355px);

    height: min(114vw, 445px);

    margin-bottom: 19px;
  }

  .envelope__card {
    top: 14px;
    left: 14px;
    right: 14px;

    bottom: 44px;
  }

  .card-content {
    padding: 25px 18px;
  }

  .card-icon {
    width: 50px;
    height: 50px;

    margin-top: 10px;
  }

  .card-icon img {
    width: 31px;
    height: 31px;
  }

  .card-invite {
    font-size: 11px;
  }

  .envelope__card h1 {
    font-size: 31px;
  }

  .card-names {
    font-size: 20px;
  }

  .envelope__flap {
    height: 137px;
  }

  .envelope__body {
    height: 98px;
  }

  .wax-seal {
    top: 96px;

    width: 61px;
    height: 61px;
  }

  .open-button {
    min-width: 215px;

    padding: 11px 15px;
  }

  .open-button__text {
    font-size: 11px;
  }

  .hint {
    font-size: 10px;

    text-align: center;
  }

  .opening__footer {
    margin-top: 15px;
  }
}

/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 380px) {
  .opening {
    padding-top: 20px;
  }

  .opening__eyebrow {
    margin-bottom: 10px;
  }

  .envelope {
    width: 88vw;

    height: 415px;

    margin-bottom: 15px;
  }

  .card-content {
    padding: 20px 15px;
  }

  .card-icon {
    width: 44px;
    height: 44px;
  }

  .envelope__card h1 {
    font-size: 28px;
  }

  .card-names {
    font-size: 18px;
  }

  .card-date {
    margin-top: 11px;
  }

  .envelope__flap {
    height: 126px;
  }

  .envelope__body {
    height: 90px;
  }

  .wax-seal {
    top: 89px;

    width: 56px;
    height: 56px;
  }

  .open-button {
    min-width: 205px;
  }

  .opening__footer {
    display: none;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition: none !important;
  }
}
</style>
