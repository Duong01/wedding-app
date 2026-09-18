<template>
  <section class="lp-opening" :class="{ 'lp-opening--active': opening }">
    <!-- Nền bìa thư đỏ sẫm -->
    <div class="lp-opening__bg"></div>

    <!-- Phượng (trên trái) + Rồng (dưới phải) bay ra khi mở thiệp -->
    <img :src="phung" alt="" aria-hidden="true" class="lp-opening__decor lp-opening__decor--phung" :class="{ 'lp-opening__decor--fly': opening }" draggable="false" />
    <img :src="rong" alt="" aria-hidden="true" class="lp-opening__decor lp-opening__decor--rong" :class="{ 'lp-opening__decor--fly': opening }" draggable="false" />

    <!-- Ánh sáng vàng lấp lánh -->
    <span
      v-for="n in 12"
      :key="n"
      class="lp-spark"
      :class="`lp-spark--${n}`"
      aria-hidden="true"
    >✦</span>

    <p class="lp-opening__eyebrow">THIỆP CƯỚI LONG PHỤNG</p>

    <!-- THIỆP -->
    <div class="lp-card">
      <div class="lp-card__seal">
        <img :src="chuHy" alt="囍" draggable="false" />
      </div>

      <p class="lp-card__kicker">SAVE THE DATE</p>

      <p class="lp-card__invite">Trân trọng kính mời</p>

      <h1>{{ guestName }}</h1>

      <div class="lp-card__divider">
        <span></span>
        <img :src="chuHy" alt="" aria-hidden="true" />
        <span></span>
      </div>

      <p class="lp-card__names">
        {{ groomName }}
        <i>&amp;</i>
        {{ brideName }}
      </p>

      <p class="lp-card__date">{{ dateLabel || "NGÀY CỦA CHÚNG MÌNH" }}</p>
    </div>

    <!-- NÚT MỞ -->
    <button type="button" class="lp-open-btn" :disabled="opening" @click="openInvitation">
      <span class="lp-open-btn__icon">
        <v-icon size="16">mdi-email-open-outline</v-icon>
      </span>

      <span class="lp-open-btn__text">MỞ THIỆP</span>

      <span class="lp-open-btn__arrow">✦</span>
    </button>

    <p class="lp-hint">
      <span></span>
      Một lời mời · Một lời hẹn · Một đời hạnh phúc
      <span></span>
    </p>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import phung from "@/assets/decor/longphung-v3/phung.webp";
import rong from "@/assets/decor/longphung-v3/rong.webp";
import chuHy from "@/assets/decor/longphung-v3/chu-hy.webp";

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
.lp-opening {
  position: relative;
  isolation: isolate;

  min-height: 100svh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 34px 18px 28px;

  overflow: hidden;

  color: #ffbe89;

  background: linear-gradient(to bottom right, #710001, #5a0001, #450001);
}

/* =========================================================
   NỀN
========================================================= */

.lp-opening__bg {
  position: absolute;
  inset: 0;
  z-index: -10;

  background:
    radial-gradient(ellipse at 50% 8%, rgba(255, 190, 137, 0.14), transparent 48%),
    radial-gradient(ellipse at 8% 88%, rgba(255, 190, 137, 0.08), transparent 42%),
    radial-gradient(ellipse at 92% 80%, rgba(255, 155, 74, 0.08), transparent 44%);
}

/* =========================================================
   RỒNG PHƯỢNG BAY RA KHI MỞ
========================================================= */

.lp-opening__decor {
  position: absolute;
  z-index: -2;

  width: 230px;

  height: auto;

  opacity: 0.55;

  pointer-events: none;

  transition: transform 1.1s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.1s ease;
}

.lp-opening__decor--phung {
  top: 10px;
  left: -20px;

  transform: rotate(20deg);
}

.lp-opening__decor--rong {
  bottom: 10px;
  right: -20px;

  transform: rotate(-20deg);
}

@media (min-width: 768px) {
  .lp-opening__decor {
    width: 320px;
  }

  .lp-opening__decor--phung {
    top: 0;
    left: -30px;
  }

  .lp-opening__decor--rong {
    bottom: 0;
    right: -30px;
  }
}

/* Khi mở thiệp: rồng phượng bay ra ngoài */
.lp-opening__decor--fly.lp-opening__decor--phung {
  transform: rotate(20deg) translate(-70px, -110px) scale(1.15);

  opacity: 0;
}

.lp-opening__decor--fly.lp-opening__decor--rong {
  transform: rotate(-20deg) translate(70px, 110px) scale(1.15);

  opacity: 0;
}

/* =========================================================
   ÁNH SÁNG LẤP LÁNH
========================================================= */

.lp-spark {
  position: absolute;
  z-index: -2;

  color: rgba(255, 190, 137, 0.75);

  font-size: 12px;

  pointer-events: none;

  animation: lp-spark-twinkle 3.6s ease-in-out infinite;
}

.lp-spark--1 { top: 12%; left: 12%; }
.lp-spark--2 { top: 20%; right: 16%; font-size: 9px; animation-delay: -0.5s; }
.lp-spark--3 { top: 34%; left: 7%; font-size: 10px; animation-delay: -1.1s; }
.lp-spark--4 { top: 42%; right: 8%; animation-delay: -1.7s; }
.lp-spark--5 { top: 58%; left: 14%; font-size: 8px; animation-delay: -2.2s; }
.lp-spark--6 { top: 64%; right: 13%; font-size: 11px; animation-delay: -2.8s; }
.lp-spark--7 { top: 78%; left: 9%; animation-delay: -3.2s; }
.lp-spark--8 { top: 82%; right: 18%; font-size: 9px; animation-delay: -0.9s; }
.lp-spark--9 { top: 8%; right: 34%; font-size: 8px; animation-delay: -1.4s; }
.lp-spark--10 { top: 90%; left: 30%; font-size: 10px; animation-delay: -2s; }
.lp-spark--11 { top: 26%; left: 26%; font-size: 8px; animation-delay: -2.6s; }
.lp-spark--12 { top: 70%; right: 30%; font-size: 8px; animation-delay: -3.4s; }

/* =========================================================
   EYEBROW
========================================================= */

.lp-opening__eyebrow {
  margin: 0 0 26px;

  color: rgba(255, 190, 137, 0.85);

  font-family: "Times New Roman", Times, serif;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.42em;
  text-indent: 0.42em;
}

/* =========================================================
   THIỆP
========================================================= */

.lp-card {
  position: relative;
  z-index: 2;

  width: min(100%, 360px);

  padding: 44px 26px 34px;

  border: 1px solid rgba(255, 190, 137, 0.55);

  background: rgba(255, 190, 137, 0.08);

  box-shadow:
    0 26px 60px rgba(0, 0, 0, 0.45),
    inset 0 0 0 1px rgba(255, 190, 137, 0.12);

  backdrop-filter: blur(4px);

  text-align: center;

  animation: lp-card-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Con dấu 囍 trên nắp thiệp */
.lp-card__seal {
  position: absolute;

  top: -26px;
  left: 50%;

  width: 52px;
  height: 52px;

  display: flex;
  align-items: center;
  justify-content: center;

  transform: translateX(-50%);

  border-radius: 50%;

  background: #5a0001;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4), 0 0 0 4px rgba(255, 190, 137, 0.15);
}

.lp-card__seal img {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

.lp-card__kicker {
  margin: 0 0 18px;

  color: rgba(255, 190, 137, 0.6);

  font-family: "Times New Roman", Times, serif;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.lp-card__invite {
  margin: 0 0 6px;

  color: rgba(255, 190, 137, 0.8);

  font-size: 11px;

  letter-spacing: 0.2em;
  text-indent: 0.2em;
}

.lp-card__inner h1,
.lp-card h1 {
  margin: 0;

  font-family: "EB Garamond", "Baskerville", "Times New Roman", serif;

  font-size: clamp(34px, 9vw, 44px);
  font-weight: 500;

  line-height: 1.15;

  color: #ffbe89;
}

.lp-card__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 16px 0;
}

.lp-card__divider span {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(255, 190, 137, 0.85));
}

.lp-card__divider span:last-child {
  transform: rotate(180deg);
}

.lp-card__divider img {
  width: 26px;
  height: 26px;

  object-fit: contain;
}

.lp-card__names {
  margin: 0 0 16px;

  font-family: "EB Garamond", "Baskerville", "Times New Roman", serif;

  font-size: 20px;
  font-weight: 500;

  color: #ffbe89;
}

.lp-card__names i {
  padding: 0 5px;

  color: rgba(255, 190, 137, 0.7);

  font-size: 18px;
  font-style: italic;
}

.lp-card__date {
  display: inline-block;

  padding: 8px 18px;

  border: 1px solid rgba(255, 190, 137, 0.5);
  border-radius: 999px;

  background: rgba(255, 190, 137, 0.1);

  color: #ffbe89;

  font-family: "Times New Roman", Times, serif;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.22em;
  text-indent: 0.22em;
}

/* =========================================================
   NÚT MỞ
========================================================= */

.lp-open-btn {
  position: relative;
  z-index: 3;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 30px;

  padding: 13px 30px;

  border: 1px solid rgba(255, 190, 137, 0.85);
  border-radius: 999px;

  color: #710001;

  background: #ffbe89;

  box-shadow: 0 14px 30px rgba(255, 190, 137, 0.3);

  font-family: "Times New Roman", Times, serif;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.22em;
  text-indent: 0.1em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.lp-open-btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.03);

  box-shadow: 0 18px 36px rgba(255, 190, 137, 0.42);
}

.lp-open-btn:disabled {
  opacity: 0.75;
  cursor: default;
}

.lp-open-btn__icon {
  display: flex;
  align-items: center;
}

.lp-open-btn__arrow {
  font-size: 12px;
}

/* =========================================================
   HINT
========================================================= */

.lp-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 22px 0 0;

  color: rgba(255, 190, 137, 0.72);

  font-size: 10px;
  font-style: italic;

  letter-spacing: 0.06em;
}

.lp-hint span {
  width: 34px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(255, 190, 137, 0.7));
}

.lp-hint span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   EXIT ANIMATION
========================================================= */

.lp-opening--active .lp-card {
  animation: lp-card-out 0.9s cubic-bezier(0.5, 0, 0.75, 0.4) both;
}

.lp-opening--active .lp-open-btn,
.lp-opening--active .lp-hint,
.lp-opening--active .lp-opening__eyebrow,
.lp-opening--active .lp-spark {
  animation: lp-fade-out 0.45s ease both;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes lp-spark-twinkle {
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

@keyframes lp-card-in {
  from {
    opacity: 0;
    transform: translateY(34px) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes lp-card-out {
  to {
    opacity: 0;
    transform: translateY(-46px) scale(0.9);
  }
}

@keyframes lp-fade-out {
  to {
    opacity: 0;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .lp-card {
    width: 100%;
  }

  .lp-opening__decor {
    width: 200px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .lp-spark,
  .lp-card,
  .lp-opening__decor {
    animation: none;
    transition: none;
  }
}
</style>
