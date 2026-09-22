<template>
  <section class="la-opening" :class="{ 'la-opening--active': opening }">
    <!-- =====================================================
         NỀN
    ====================================================== -->
    <div class="la-opening__bg" aria-hidden="true"></div>

    <span
      v-for="n in 14"
      :key="n"
      class="la-spark"
      :class="`la-spark--${n}`"
      aria-hidden="true"
    >✦</span>

    <img :src="hy" alt="" class="la-opening__deco la-opening__deco--hy" aria-hidden="true" />
    <img :src="hoaTim" alt="" class="la-opening__deco la-opening__deco--hoa" aria-hidden="true" />

    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->
    <p class="la-opening__title">OUR WEDDING</p>

    <!-- =====================================================
         THIỆP MỜI
    ====================================================== -->
    <div class="la-card">
      <div class="la-card__inner">
        <p class="la-card__kicker">SAVE THE DATE</p>

        <div class="la-card__monogram">
          <span>{{ monogram }}</span>
        </div>

        <p class="la-card__invite">Trân trọng kính mời</p>

        <h1>{{ guestName }}</h1>

        <div class="la-card__divider">
          <span></span>
          <i>✦</i>
          <span></span>
        </div>

        <p class="la-card__names">
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </p>

        <p class="la-card__date">{{ dateLabel || "NGÀY CỦA CHÚNG MÌNH" }}</p>
      </div>
    </div>

    <!-- =====================================================
         NÚT MỞ THIỆP
    ====================================================== -->
    <button type="button" class="la-open-btn" :disabled="opening" @click="openInvitation">
      <span class="la-open-btn__icon">
        <v-icon size="16">mdi-email-open-outline</v-icon>
      </span>

      <span>MỞ THIỆP</span>

      <span class="la-open-btn__arrow">✦</span>
    </button>

    <p class="la-hint">
      <span></span>
      Một lời mời · Một lời hẹn · Một đời hạnh phúc
      <span></span>
    </p>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

import hy from "@/assets/love-art/hy.webp";
import hoaTim from "@/assets/love-art/hoa tim.webp";

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  monogram: { type: String, default: "G & B" },
  dateLabel: { type: String, default: "" },
});

const emit = defineEmits(["open"]);

const opening = ref(false);

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
.la-opening {
  position: relative;
  isolation: isolate;

  min-height: 100svh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 34px 18px 28px;

  overflow: hidden;

  background-color: var(--la-paper);
  color: var(--la-ink);
}

/* =========================================================
   NỀN
========================================================= */

.la-opening__bg {
  position: absolute;
  inset: 0;
  z-index: -10;

  background:
    radial-gradient(ellipse at 50% 6%, rgba(215, 12, 27, 0.09), transparent 52%),
    radial-gradient(ellipse at 6% 90%, rgba(215, 12, 27, 0.06), transparent 46%),
    radial-gradient(ellipse at 94% 84%, rgba(215, 12, 27, 0.05), transparent 46%);
}

/* =========================================================
   HOẠ TIẾT
========================================================= */

.la-opening__deco {
  position: absolute;
  z-index: -4;

  height: auto;

  object-fit: contain;

  pointer-events: none;

  animation: la-deco-float 6.5s ease-in-out infinite;
}

.la-opening__deco--hy {
  top: 8%;
  right: 4%;

  width: 22%;
  max-width: 110px;
}

.la-opening__deco--hoa {
  bottom: 10%;
  left: 4%;

  width: 18%;
  max-width: 90px;

  animation-delay: -3s;
}

/* =========================================================
   LẤP LÁNH
========================================================= */

.la-spark {
  position: absolute;
  z-index: -2;

  color: rgba(215, 12, 27, 0.55);

  font-size: 12px;

  pointer-events: none;

  animation: la-spark-twinkle 3.6s ease-in-out infinite;
}

.la-spark--1 { top: 12%; left: 12%; }
.la-spark--2 { top: 20%; right: 16%; font-size: 11px; animation-delay: -0.5s; }
.la-spark--3 { top: 34%; left: 7%; font-size: 10px; animation-delay: -1.1s; }
.la-spark--4 { top: 42%; right: 8%; animation-delay: -1.7s; }
.la-spark--5 { top: 58%; left: 14%; font-size: 10px; animation-delay: -2.2s; }
.la-spark--6 { top: 64%; right: 13%; font-size: 11px; animation-delay: -2.8s; }
.la-spark--7 { top: 78%; left: 9%; animation-delay: -3.2s; }
.la-spark--8 { top: 82%; right: 18%; font-size: 11px; animation-delay: -0.9s; }
.la-spark--9 { top: 8%; right: 34%; font-size: 10px; animation-delay: -1.4s; }
.la-spark--10 { top: 90%; left: 30%; font-size: 10px; animation-delay: -2s; }
.la-spark--11 { top: 26%; left: 26%; font-size: 10px; animation-delay: -2.6s; }
.la-spark--12 { top: 70%; right: 30%; font-size: 10px; animation-delay: -3.4s; }
.la-spark--13 { top: 48%; left: 20%; font-size: 11px; animation-delay: -1.9s; }
.la-spark--14 { top: 16%; left: 44%; font-size: 11px; animation-delay: -0.3s; }

/* =========================================================
   TIÊU ĐỀ
========================================================= */

.la-opening__title {
  margin: 0 0 26px;

  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: clamp(32px, 9vw, 56px);
  font-weight: 700;

  letter-spacing: 0.02em;
  line-height: 1;
  text-align: center;
  text-transform: uppercase;
}

/* =========================================================
   THIỆP MỜI
========================================================= */

.la-card {
  position: relative;
  z-index: 2;

  width: min(100%, 360px);

  padding: 10px;

  border: 1px solid var(--la-hairline);
  border-radius: 18px;

  background-color: var(--la-paper);

  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.14);

  animation: la-card-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.la-card__inner {
  position: relative;

  padding: 38px 24px 30px;

  border: 1px solid var(--la-hairline-soft);
  border-radius: 12px;

  text-align: center;
}

.la-card__kicker {
  margin: 0 0 18px;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 10px;
  font-weight: 300;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.la-card__monogram {
  position: relative;

  width: 78px;
  height: 78px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 20px;

  border: 1px solid var(--la-red);
  border-radius: 50%;

  background-color: var(--la-blush);

  animation: la-monogram-pulse 3.4s ease-in-out infinite;
}

.la-card__monogram::before {
  content: "";

  position: absolute;
  inset: 5px;

  border: 1px dashed var(--la-hairline);
  border-radius: 50%;
}

.la-card__monogram span {
  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 24px;
  font-weight: 700;
}

.la-card__invite {
  margin: 0 0 6px;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 10px;
  font-weight: 300;

  letter-spacing: 0.26em;
  text-indent: 0.26em;
}

.la-card__inner h1 {
  margin: 0;

  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: clamp(34px, 9vw, 44px);
  font-weight: 400;

  line-height: 1.15;
}

.la-card__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin: 14px 0;

  color: var(--la-red);
}

.la-card__divider span {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, var(--la-red));
}

.la-card__divider span:last-child {
  transform: rotate(180deg);
}

.la-card__divider i {
  font-size: 13px;
  font-style: normal;
}

.la-card__names {
  margin: 0 0 16px;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 19px;
  font-weight: 600;
}

.la-card__names i {
  padding: 0 5px;

  color: var(--la-red);

  font-size: 18px;
  font-style: italic;
}

.la-card__date {
  display: inline-block;

  padding: 8px 18px;

  border: 1px solid var(--la-hairline);
  border-radius: 999px;

  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 10px;
  font-weight: 500;

  letter-spacing: 0.22em;
  text-indent: 0.22em;
}

/* =========================================================
   NÚT MỞ
========================================================= */

.la-open-btn {
  position: relative;
  z-index: 3;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 30px;
  padding: 13px 30px;

  border: 1px solid var(--la-red);
  border-radius: 999px;

  background-color: var(--la-red);
  color: var(--la-paper);

  font-family: var(--la-font-hand);
  font-size: 11px;
  font-weight: 500;

  letter-spacing: 0.22em;
  text-indent: 0.1em;

  cursor: pointer;

  transition: transform 0.25s ease, background-color 0.25s ease;
}

.la-open-btn:hover:not(:disabled) {
  transform: translateY(-2px);

  background-color: var(--la-red-deep);
}

.la-open-btn:disabled {
  opacity: 0.75;
  cursor: default;
}

.la-open-btn__icon {
  display: flex;
  align-items: center;
}

.la-open-btn__arrow {
  font-size: 12px;
}

/* =========================================================
   GỢI Ý
========================================================= */

.la-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 22px 0 0;

  color: var(--la-ink-soft);

  font-family: var(--la-font-hand);
  font-size: 10px;
  font-style: italic;

  letter-spacing: 0.06em;
}

.la-hint span {
  width: 34px;
  height: 1px;

  background: linear-gradient(90deg, transparent, var(--la-hairline));
}

.la-hint span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   ANIMATION KHI MỞ
========================================================= */

.la-opening--active .la-card {
  animation: la-card-out 0.9s cubic-bezier(0.5, 0, 0.75, 0.4) both;
}

.la-opening--active .la-open-btn,
.la-opening--active .la-hint,
.la-opening--active .la-opening__title,
.la-opening--active .la-opening__deco,
.la-opening--active .la-spark {
  animation: la-fade-out 0.45s ease both;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes la-spark-twinkle {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(0.8) rotate(0deg);
  }

  50% {
    opacity: 1;
    transform: scale(1.25) rotate(25deg);
  }
}

@keyframes la-deco-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

@keyframes la-monogram-pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

@keyframes la-card-in {
  from {
    opacity: 0;
    transform: translateY(34px) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes la-card-out {
  to {
    opacity: 0;
    transform: translateY(-46px) scale(0.9);
  }
}

@keyframes la-fade-out {
  to {
    opacity: 0;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .la-card {
    width: 100%;
  }

  .la-card__inner {
    padding: 32px 16px 26px;
  }

  .la-card__monogram {
    width: 68px;
    height: 68px;
  }

  .la-card__monogram span {
    font-size: 21px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .la-spark,
  .la-opening__deco,
  .la-card__monogram,
  .la-card {
    animation: none;
  }
}
</style>
