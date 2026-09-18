<template>
  <section class="el-opening" :class="{ 'el-opening--active': opening }">
    <!-- =====================================================
         BACKGROUND: deep emerald + gold light + botanical photo
    ====================================================== -->
    <div class="el-opening__bg"></div>

    <div class="el-opening__photo" aria-hidden="true">
      <!-- <img :src="accentEmerald" alt="" draggable="false" /> -->
    </div>

    <!-- Gold shimmer particles -->
    <span
      v-for="n in 14"
      :key="n"
      class="el-spark"
      :class="`el-spark--${n}`"
      aria-hidden="true"
    >✦</span>

    <!-- =====================================================
         TOP BRANDING
    ====================================================== -->
    <p class="el-opening__eyebrow">THIỆP CƯỚI LUXE</p>

    <!-- =====================================================
         INVITATION CARD
    ====================================================== -->
    <div class="el-card">
      <div class="el-card__frame"></div>

      <div class="el-card__inner">
        <p class="el-card__kicker">SAVE THE DATE</p>

        <div class="el-card__monogram">
          <span>{{ monogram }}</span>
        </div>

        <p class="el-card__invite">Trân trọng kính mời</p>

        <h1>{{ guestName }}</h1>

        <div class="el-card__divider">
          <span></span>
          <i>❦</i>
          <span></span>
        </div>

        <p class="el-card__names">
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </p>

        <p class="el-card__date">{{ dateLabel || "NGÀY CỦA CHÚNG MÌNH" }}</p>
      </div>
    </div>

    <!-- =====================================================
         OPEN BUTTON
    ====================================================== -->
    <button type="button" class="el-open-btn" :disabled="opening" @click="openInvitation">
      <span class="el-open-btn__icon">
        <v-icon size="16">mdi-email-open-outline</v-icon>
      </span>

      <span class="el-open-btn__text">MỞ THIỆP</span>

      <span class="el-open-btn__arrow">✦</span>
    </button>

    <p class="el-hint">
      <span></span>
      Một lời mời · Một lời hẹn · Một đời hạnh phúc
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
.el-opening {
  --el-emerald: #123b2e;
  --el-emerald-deep: #0c2b21;
  --el-gold: #c9a45c;
  --el-gold-light: #e8d3a2;
  --el-cream: #f7f1e3;
  --el-text: #2e3d36;

  position: relative;
  isolation: isolate;

  min-height: 100svh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 34px 18px 28px;

  overflow: hidden;

  color: var(--el-cream);

  background: linear-gradient(168deg, #164636 0%, #123b2e 42%, #0c2b21 100%);
}

/* =========================================================
   BACKGROUND
========================================================= */

.el-opening__bg {
  position: absolute;
  inset: 0;
  z-index: -10;

  background:
    radial-gradient(ellipse at 50% 8%, rgba(201, 164, 92, 0.16), transparent 48%),
    radial-gradient(ellipse at 8% 88%, rgba(201, 164, 92, 0.1), transparent 42%),
    radial-gradient(ellipse at 92% 80%, rgba(232, 211, 162, 0.08), transparent 44%);
}

/* Botanical photo backdrop */
.el-opening__photo {
  position: absolute;
  inset: 0;
  z-index: -6;

  overflow: hidden;

  pointer-events: none;
}

.el-opening__photo img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  opacity: 0.16;

  filter: saturate(0.85) brightness(0.9);
}

.el-opening__photo::after {
  content: "";

  position: absolute;
  inset: 0;

  background: linear-gradient(
    180deg,
    rgba(18, 59, 46, 0.55),
    rgba(12, 43, 33, 0.35) 55%,
    rgba(12, 43, 33, 0.6)
  );
}

/* =========================================================
   GOLD SPARKLES
========================================================= */

.el-spark {
  position: absolute;
  z-index: -2;

  color: rgba(232, 211, 162, 0.75);

  font-size: 12px;

  pointer-events: none;

  animation: el-spark-twinkle 3.6s ease-in-out infinite;
}

.el-spark--1 { top: 12%; left: 12%; }
.el-spark--2 { top: 20%; right: 16%; font-size: 9px; animation-delay: -0.5s; }
.el-spark--3 { top: 34%; left: 7%; font-size: 10px; animation-delay: -1.1s; }
.el-spark--4 { top: 42%; right: 8%; animation-delay: -1.7s; }
.el-spark--5 { top: 58%; left: 14%; font-size: 8px; animation-delay: -2.2s; }
.el-spark--6 { top: 64%; right: 13%; font-size: 11px; animation-delay: -2.8s; }
.el-spark--7 { top: 78%; left: 9%; animation-delay: -3.2s; }
.el-spark--8 { top: 82%; right: 18%; font-size: 9px; animation-delay: -0.9s; }
.el-spark--9 { top: 8%; right: 34%; font-size: 8px; animation-delay: -1.4s; }
.el-spark--10 { top: 90%; left: 30%; font-size: 10px; animation-delay: -2s; }
.el-spark--11 { top: 26%; left: 26%; font-size: 8px; animation-delay: -2.6s; }
.el-spark--12 { top: 70%; right: 30%; font-size: 8px; animation-delay: -3.4s; }
.el-spark--13 { top: 48%; left: 20%; font-size: 7px; animation-delay: -1.9s; }
.el-spark--14 { top: 16%; left: 44%; font-size: 9px; animation-delay: -0.3s; }

/* =========================================================
   EYEBROW
========================================================= */

.el-opening__eyebrow {
  margin: 0 0 26px;

  color: var(--el-gold);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.42em;
  text-indent: 0.42em;
}

/* =========================================================
   CARD
========================================================= */

.el-card {
  position: relative;
  z-index: 2;

  width: min(100%, 360px);

  padding: 10px;

  border: 1px solid rgba(201, 164, 92, 0.65);

  background: linear-gradient(172deg, rgba(247, 241, 227, 0.97), rgba(232, 224, 203, 0.95));

  box-shadow:
    0 26px 60px rgba(5, 20, 15, 0.45),
    inset 0 0 0 1px rgba(255, 255, 255, 0.6);

  animation: el-card-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.el-card__frame {
  position: absolute;
  inset: 6px;

  border: 1px solid rgba(18, 59, 46, 0.35);

  pointer-events: none;
}

.el-card__inner {
  position: relative;

  padding: 42px 26px 34px;

  text-align: center;

  color: var(--el-text);
}

.el-card__kicker {
  margin: 0 0 18px;

  color: #8a7a52;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

/* Monogram inside a gold ring */
.el-card__monogram {
  position: relative;

  width: 78px;
  height: 78px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 20px;

  border: 1px solid rgba(201, 164, 92, 0.8);
  border-radius: 50%;

  background: linear-gradient(170deg, rgba(201, 164, 92, 0.22), rgba(18, 59, 46, 0.12));

  animation: el-monogram-pulse 3.4s ease-in-out infinite;
}

.el-card__monogram::before {
  content: "";

  position: absolute;
  inset: 5px;

  border: 1px dashed rgba(201, 164, 92, 0.55);
  border-radius: 50%;
}

.el-card__monogram span {
  font-family: "Playfair Display", Georgia, serif;

  font-size: 24px;
  font-weight: 600;

  color: var(--el-emerald);
}

.el-card__invite {
  margin: 0 0 6px;

  color: #8a7a52;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
  text-indent: 0.26em;
}

.el-card__inner h1 {
  margin: 0;

  font-family: "Great Vibes", cursive;

  font-size: clamp(38px, 10vw, 48px);
  font-weight: 400;

  line-height: 1.15;

  color: var(--el-emerald);
}

.el-card__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin: 14px 0;

  color: var(--el-gold);
}

.el-card__divider span {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 164, 92, 0.85));
}

.el-card__divider span:last-child {
  transform: rotate(180deg);
}

.el-card__divider i {
  font-size: 13px;
  font-style: normal;
}

.el-card__names {
  margin: 0 0 16px;

  font-family: "Playfair Display", Georgia, serif;

  font-size: 19px;
  font-weight: 600;

  color: var(--el-text);
}

.el-card__names i {
  padding: 0 5px;

  color: var(--el-gold);

  font-family: Georgia, serif;
  font-size: 18px;
  font-style: italic;
}

.el-card__date {
  display: inline-block;

  padding: 8px 18px;

  border: 1px solid rgba(201, 164, 92, 0.6);
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.55);

  color: var(--el-emerald);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.22em;
  text-indent: 0.22em;
}

/* =========================================================
   OPEN BUTTON
========================================================= */

.el-open-btn {
  position: relative;
  z-index: 3;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 30px;

  padding: 13px 30px;

  border: 1px solid rgba(201, 164, 92, 0.85);
  border-radius: 999px;

  color: #10281f;

  background: linear-gradient(135deg, #e8d3a2, #c9a45c);

  box-shadow: 0 14px 30px rgba(201, 164, 92, 0.3);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.22em;
  text-indent: 0.1em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.el-open-btn:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 18px 36px rgba(201, 164, 92, 0.42);
}

.el-open-btn:disabled {
  opacity: 0.75;
  cursor: default;
}

.el-open-btn__icon {
  display: flex;
  align-items: center;
}

.el-open-btn__arrow {
  font-size: 12px;
}

/* =========================================================
   HINT
========================================================= */

.el-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 22px 0 0;

  color: rgba(247, 241, 227, 0.72);

  font-size: 10px;
  font-style: italic;

  letter-spacing: 0.06em;
}

.el-hint span {
  width: 34px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 164, 92, 0.7));
}

.el-hint span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   EXIT ANIMATION
========================================================= */

.el-opening--active .el-card {
  animation: el-card-out 0.9s cubic-bezier(0.5, 0, 0.75, 0.4) both;
}

.el-opening--active .el-open-btn,
.el-opening--active .el-hint,
.el-opening--active .el-opening__eyebrow,
.el-opening--active .el-spark {
  animation: el-fade-out 0.45s ease both;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes el-spark-twinkle {
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

@keyframes el-monogram-pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

@keyframes el-card-in {
  from {
    opacity: 0;
    transform: translateY(34px) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes el-card-out {
  to {
    opacity: 0;
    transform: translateY(-46px) scale(0.9);
  }
}

@keyframes el-fade-out {
  to {
    opacity: 0;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .el-card {
    width: 100%;
  }

  .el-card__inner {
    padding: 34px 18px 28px;
  }

  .el-card__monogram {
    width: 68px;
    height: 68px;
  }

  .el-card__monogram span {
    font-size: 21px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .el-spark,
  .el-card__monogram,
  .el-card {
    animation: none;
  }
}
</style>
