<template>
  <section class="dh-opening" :class="{ 'dh-opening--active': opening }">
    <!-- =====================================================
         BACKGROUND
    ====================================================== -->
    <div class="dh-opening__bg"></div>

    <!-- Giant translucent 囍 watermark -->
    <div class="dh-opening__watermark" aria-hidden="true">囍</div>

    <!-- =====================================================
         HANGING LANTERNS
    ====================================================== -->
    <div class="dh-lanterns" aria-hidden="true">
      <div class="dh-lantern dh-lantern--left">
        <span class="dh-lantern__string"></span>
        <span class="dh-lantern__cap"></span>
        <span class="dh-lantern__body"></span>
        <span class="dh-lantern__cap dh-lantern__cap--bottom"></span>
        <span class="dh-lantern__tassel"></span>
      </div>

      <div class="dh-lantern dh-lantern--right">
        <span class="dh-lantern__string"></span>
        <span class="dh-lantern__cap"></span>
        <span class="dh-lantern__body"></span>
        <span class="dh-lantern__cap dh-lantern__cap--bottom"></span>
        <span class="dh-lantern__tassel"></span>
      </div>
    </div>

    <p class="dh-opening__eyebrow">THIỆP MỜI CƯỚI</p>

    <!-- =====================================================
         INVITATION CARD
    ====================================================== -->
    <div class="dh-card">
      <span class="dh-card__corner dh-card__corner--tl"></span>
      <span class="dh-card__corner dh-card__corner--tr"></span>
      <span class="dh-card__corner dh-card__corner--bl"></span>
      <span class="dh-card__corner dh-card__corner--br"></span>

      <div class="dh-card__inner">
        <div class="dh-card__seal">
          <span>{{ monogram }}</span>
        </div>

        <p class="dh-card__invite">Trân trọng kính mời</p>

        <h1>{{ guestName }}</h1>

        <div class="dh-card__divider">
          <span></span>
          <i>囍</i>
          <span></span>
        </div>

        <p class="dh-card__names">
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </p>

        <p class="dh-card__date">{{ dateLabel || "NGÀY TRỌNG ĐẠI CỦA CHÚNG MÌNH" }}</p>
      </div>
    </div>

    <!-- =====================================================
         OPEN BUTTON
    ====================================================== -->
    <button type="button" class="dh-open-btn" :disabled="opening" @click="openInvitation">
      <span class="dh-open-btn__icon">
        <v-icon size="15">mdi-email-open-outline</v-icon>
      </span>

      <span class="dh-open-btn__text">CHẠM ĐỂ MỞ THIỆP</span>
    </button>

    <p class="dh-hint">
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
.dh-opening {
  --dh-red: #7a1216;
  --dh-red-bright: #a32a2a;
  --dh-red-dark: #5c0e10;
  --dh-gold: #d9a441;
  --dh-gold-light: #f3d9a4;
  --dh-cream: #fdf6ec;
  --dh-ink: #5a3d2e;
  --dh-cream-on-red: #f7e6c4;

  position: relative;
  isolation: isolate;

  min-height: 100svh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 34px 18px 28px;

  overflow: hidden;

  color: var(--dh-ink);

  background: linear-gradient(168deg, #8f1a1e 0%, var(--dh-red) 46%, var(--dh-red-dark) 100%);
}

/* =========================================================
   BACKGROUND LAYERS
========================================================= */

.dh-opening__bg {
  position: absolute;
  inset: 0;
  z-index: -6;

  background:
    radial-gradient(ellipse at 50% 12%, rgba(243, 217, 164, 0.16), transparent 46%),
    radial-gradient(ellipse at 10% 88%, rgba(92, 14, 16, 0.75), transparent 52%),
    radial-gradient(ellipse at 90% 80%, rgba(163, 42, 42, 0.4), transparent 48%);
}

/* Subtle diamond lattice pattern */
.dh-opening::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -5;

  opacity: 0.5;

  background-image:
    repeating-linear-gradient(45deg, rgba(243, 217, 164, 0.06) 0 1px, transparent 1px 16px),
    repeating-linear-gradient(-45deg, rgba(243, 217, 164, 0.06) 0 1px, transparent 1px 16px);

  pointer-events: none;
}

.dh-opening__watermark {
  position: absolute;
  z-index: -3;

  top: 50%;
  left: 50%;

  transform: translate(-50%, -52%);

  color: rgba(217, 164, 65, 0.14);

  font-size: clamp(300px, 96vw, 520px);
  line-height: 1;

  pointer-events: none;

  animation: dh-watermark-breathe 6s ease-in-out infinite;
}

/* =========================================================
   LANTERNS
========================================================= */

.dh-lanterns {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.dh-lantern {
  position: absolute;
  top: 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  transform-origin: top center;

  animation: dh-lantern-sway 5s ease-in-out infinite;
}

.dh-lantern--left {
  left: 7%;
}

.dh-lantern--right {
  right: 7%;

  animation-delay: -2.4s;
}

.dh-lantern__string {
  width: 1px;
  height: 44px;

  background: linear-gradient(180deg, rgba(217, 164, 65, 0.12), rgba(217, 164, 65, 0.8));
}

.dh-lantern__cap {
  width: 34px;
  height: 7px;

  border-radius: 3px 3px 1px 1px;

  background: linear-gradient(180deg, var(--dh-gold-light), var(--dh-gold));
}

.dh-lantern__cap--bottom {
  width: 22px;
  height: 5px;

  border-radius: 1px 1px 3px 3px;
}

.dh-lantern__body {
  position: relative;

  width: 56px;
  height: 72px;

  border-radius: 24px / 28px;

  background:
    repeating-linear-gradient(90deg, rgba(243, 217, 164, 0.16) 0 2px, transparent 2px 12px),
    radial-gradient(circle at 35% 28%, #c23a35, var(--dh-red-bright) 55%, var(--dh-red) 100%);

  box-shadow:
    inset 0 0 0 2px rgba(243, 217, 164, 0.28),
    0 12px 26px rgba(40, 6, 8, 0.45);
}

.dh-lantern__body::after {
  content: "囍";

  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  color: rgba(243, 217, 164, 0.85);

  font-size: 20px;
}

.dh-lantern__tassel {
  width: 2px;
  height: 24px;

  background: linear-gradient(180deg, var(--dh-gold), rgba(217, 164, 65, 0.15));
}

/* =========================================================
   EYEBROW
========================================================= */

.dh-opening__eyebrow {
  position: relative;
  z-index: 2;

  margin: 0 0 26px;

  color: var(--dh-gold-light);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.42em;
  text-indent: 0.42em;
}

/* =========================================================
   CARD
========================================================= */

.dh-card {
  position: relative;
  z-index: 2;

  width: min(100%, 368px);

  padding: 3px;

  border: 1px solid rgba(217, 164, 65, 0.75);
  border-radius: 14px;

  background: linear-gradient(170deg, rgba(253, 246, 236, 0.97), rgba(247, 230, 196, 0.93));

  box-shadow:
    0 26px 60px rgba(30, 4, 6, 0.5),
    0 0 0 5px rgba(217, 164, 65, 0.14);

  animation: dh-card-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Inner gold line — double border frame */
.dh-card::before {
  content: "";
  position: absolute;
  inset: 7px;

  border: 1px solid rgba(217, 164, 65, 0.45);
  border-radius: 9px;

  pointer-events: none;
}

.dh-card__corner {
  position: absolute;
  z-index: 3;

  width: 9px;
  height: 9px;

  background: var(--dh-gold);

  transform: rotate(45deg);

  box-shadow: 0 0 0 2px rgba(253, 246, 236, 0.9);
}

.dh-card__corner--tl { top: -5px; left: -5px; }
.dh-card__corner--tr { top: -5px; right: -5px; }
.dh-card__corner--bl { bottom: -5px; left: -5px; }
.dh-card__corner--br { bottom: -5px; right: -5px; }

.dh-card__inner {
  position: relative;

  padding: 38px 26px 32px;

  text-align: center;
}

.dh-card__seal {
  position: relative;

  width: 76px;
  height: 76px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 20px;

  border-radius: 50%;

  background: radial-gradient(circle at 34% 30%, #e8bd6b, var(--dh-gold) 58%, #a9782a 100%);

  box-shadow:
    0 10px 24px rgba(140, 95, 25, 0.45),
    inset 0 0 0 3px rgba(253, 246, 236, 0.4);

  animation: dh-seal-pulse 3.2s ease-in-out infinite;
}

.dh-card__seal::before {
  content: "";
  position: absolute;
  inset: 6px;

  border: 1px dashed rgba(253, 246, 236, 0.6);
  border-radius: 50%;
}

.dh-card__seal span {
  font-family: "Allura", cursive;

  font-size: 26px;

  color: #fff8ea;

  text-shadow: 0 1px 2px rgba(120, 80, 20, 0.45);
}

.dh-card__invite {
  margin: 0 0 6px;

  color: var(--dh-red-bright);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
  text-indent: 0.26em;
}

.dh-card__inner h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(38px, 10vw, 48px);
  font-weight: 400;

  line-height: 1.15;

  color: var(--dh-red);
}

.dh-card__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin: 14px 0;

  color: var(--dh-gold);
}

.dh-card__divider span {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(217, 164, 65, 0.8));
}

.dh-card__divider span:last-child {
  transform: rotate(180deg);
}

.dh-card__divider i {
  font-size: 15px;
  font-style: normal;
}

.dh-card__names {
  margin: 0 0 16px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 19px;
  font-weight: 600;

  color: var(--dh-ink);
}

.dh-card__names i {
  padding: 0 5px;

  color: var(--dh-gold);

  font-family: "Allura", cursive;
  font-size: 22px;
  font-style: normal;
}

.dh-card__date {
  display: inline-block;

  padding: 8px 18px;

  border: 1px solid rgba(217, 164, 65, 0.55);
  border-radius: 999px;

  background: rgba(253, 246, 236, 0.8);

  color: var(--dh-red-bright);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.22em;
  text-indent: 0.22em;
}

/* =========================================================
   OPEN BUTTON
========================================================= */

.dh-open-btn {
  position: relative;
  z-index: 3;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 30px;

  padding: 13px 28px;

  border: 1px solid rgba(243, 217, 164, 0.65);
  border-radius: 999px;

  color: var(--dh-red-dark);

  background: linear-gradient(135deg, var(--dh-gold-light), var(--dh-gold) 60%, #c08f34);

  box-shadow:
    0 14px 30px rgba(30, 4, 6, 0.45),
    inset 0 1px 0 rgba(255, 250, 238, 0.7);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;
  text-indent: 0.1em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.dh-open-btn:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 18px 36px rgba(30, 4, 6, 0.55);
}

.dh-open-btn:disabled {
  opacity: 0.75;
  cursor: default;
}

.dh-open-btn__icon {
  display: flex;
  align-items: center;
}

/* =========================================================
   HINT
========================================================= */

.dh-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 22px 0 0;

  color: rgba(247, 230, 196, 0.75);

  font-size: 10px;
  font-style: italic;

  letter-spacing: 0.06em;
}

.dh-hint span {
  width: 34px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(217, 164, 65, 0.7));
}

.dh-hint span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   EXIT ANIMATION
========================================================= */

.dh-opening--active .dh-card {
  animation: dh-card-out 0.9s cubic-bezier(0.5, 0, 0.75, 0.4) both;
}

.dh-opening--active .dh-open-btn,
.dh-opening--active .dh-hint,
.dh-opening--active .dh-opening__eyebrow,
.dh-opening--active .dh-lanterns {
  animation: dh-fade-out 0.45s ease both;
}

.dh-opening--active .dh-opening__watermark {
  opacity: 0;
  transition: opacity 0.6s ease;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes dh-lantern-sway {
  0%,
  100% {
    transform: rotate(-4deg);
  }

  50% {
    transform: rotate(4deg);
  }
}

@keyframes dh-watermark-breathe {
  0%,
  100% {
    opacity: 0.85;
    transform: translate(-50%, -52%) scale(0.98);
  }

  50% {
    opacity: 1;
    transform: translate(-50%, -52%) scale(1.03);
  }
}

@keyframes dh-seal-pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

@keyframes dh-card-in {
  from {
    opacity: 0;
    transform: translateY(34px) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dh-card-out {
  to {
    opacity: 0;
    transform: translateY(-46px) scale(0.9);
  }
}

@keyframes dh-fade-out {
  to {
    opacity: 0;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .dh-card {
    width: 100%;
  }

  .dh-card__inner {
    padding: 32px 18px 28px;
  }

  .dh-card__seal {
    width: 64px;
    height: 64px;
  }

  .dh-card__seal span {
    font-size: 22px;
  }

  .dh-lantern--left {
    left: 3%;
  }

  .dh-lantern--right {
    right: 3%;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .dh-lantern,
  .dh-opening__watermark,
  .dh-card__seal,
  .dh-card {
    animation: none;
  }
}
</style>
