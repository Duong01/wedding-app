<template>
  <section class="mg-hero">
    <!-- Decorative arch frame -->
    <div class="mg-hero__frame">
      <div class="mg-hero__frame-inner"></div>

      <!-- Corner stars -->
      <span class="mg-star mg-star--tl">✧</span>
      <span class="mg-star mg-star--tr">✧</span>
      <span class="mg-star mg-star--bl">✧</span>
      <span class="mg-star mg-star--br">✧</span>

      <div class="mg-hero__content">
        <p class="mg-hero__save-date">SAVE THE DATE</p>

        <div class="mg-hero__motif">
          <span></span>
          <i>✦</i>
          <span></span>
        </div>

        <h1>
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </h1>

        <p class="mg-hero__announce">TRÂN TRỌNG KÍNH MỜI</p>

        <p class="mg-hero__guest">{{ guestName }}</p>

        <p class="mg-hero__intro">
          Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại
        </p>

        <p class="mg-hero__place">{{ location }}</p>

        <div class="mg-hero__schedule">
          <p>VÀO LÚC {{ time }}</p>
          <p>{{ dateText }}</p>
        </div>

        <p class="mg-hero__message">
          Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!
        </p>

        <div class="mg-hero__footer">
          <span></span>
          <b>{{ monogram }}</b>
          <span></span>
        </div>
      </div>
    </div>

    <!-- Falling gold sparkles -->
    <div class="mg-particles" aria-hidden="true">
      <span v-for="n in 8" :key="n" class="mg-particle" :class="`mg-particle--${n}`">✦</span>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import dayjs from "dayjs";

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  event: { type: Object, default: () => ({}) },
  guestName: { type: String, default: "Quý khách" },
  monogram: { type: String, default: "G&B" },
  dateLabel: { type: String, default: "" },
});

const groomName = computed(
  () =>
    props.wedding?.GroomName ||
    props.wedding?.groomName ||
    props.wedding?.hero?.GroomName ||
    props.wedding?.couple?.Groom?.Name ||
    "Nguyễn Huy"
);

const brideName = computed(
  () =>
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.hero?.BrideName ||
    props.wedding?.couple?.Bride?.Name ||
    "Nguyễn Mai"
);

const location = computed(
  () =>
    props.event?.Location ||
    props.event?.Address ||
    props.wedding?.hero?.Location ||
    "Địa điểm tổ chức tiệc cưới"
);

const time = computed(
  () =>
    props.event?.EventTime ||
    props.event?.Time ||
    props.event?.StartTime ||
    props.wedding?.hero?.Time ||
    "16:00"
);

const dateText = computed(() => {
  const raw =
    props.event?.EventDate ||
    props.event?.Date ||
    props.wedding?.hero?.weddingDate ||
    props.wedding?.weddingDate;

  const date = dayjs(raw);

  if (date.isValid()) {
    return `${date.day() === 0 ? "CHỦ NHẬT" : `THỨ ${date.day() + 1}`}, NGÀY ${date.format("DD/MM/YYYY")}`;
  }

  return props.dateLabel || "NGÀY VUI CỦA CHÚNG MÌNH";
});
</script>

<style scoped>
.mg-hero {
  --mg-gold: #d8b676;
  --mg-gold-deep: #9b7d4d;
  --mg-gold-bright: #eed9a8;
  --mg-text: #f0e6d2;
  --mg-text-muted: #b9a88f;
  --mg-night: #1d1622;

  position: relative;
  isolation: isolate;
  overflow: hidden;

  padding: 14px;

  min-height: 690px;

  background:
    radial-gradient(1100px 500px at 50% -140px, rgba(216, 182, 118, 0.12), transparent 65%),
    linear-gradient(180deg, #1d1622 0%, #17121b 100%);
}

/* =========================================================
   FRAME
========================================================= */

.mg-hero__frame {
  position: relative;

  min-height: 662px;

  display: grid;
  place-items: center;

  border: 1px solid rgba(216, 182, 118, 0.55);
  border-radius: 210px 210px 24px 24px;

  background: linear-gradient(175deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.02));

  box-shadow: 0 22px 55px rgba(0, 0, 0, 0.45), 0 0 40px rgba(216, 182, 118, 0.08);
}

.mg-hero__frame-inner {
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(216, 182, 118, 0.28);
  border-radius: 202px 202px 18px 18px;

  pointer-events: none;
}

/* =========================================================
   STARS
========================================================= */

.mg-star {
  position: absolute;
  z-index: 3;

  color: var(--mg-gold);

  font-size: 20px;

  opacity: 0.75;

  text-shadow: 0 0 10px rgba(216, 182, 118, 0.5);

  animation: mg-star-sway 5s ease-in-out infinite;
}

.mg-star--tl { top: 26px; left: 30px; }
.mg-star--tr { top: 26px; right: 30px; animation-delay: -1.4s; }
.mg-star--bl { bottom: 26px; left: 30px; animation-delay: -2.6s; }
.mg-star--br { bottom: 26px; right: 30px; animation-delay: -3.8s; }

/* =========================================================
   CONTENT
========================================================= */

.mg-hero__content {
  position: relative;
  z-index: 2;

  width: min(100%, 440px);

  padding: 62px 28px 48px;

  text-align: center;

  animation: mg-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.mg-hero__save-date {
  margin: 0;

  color: var(--mg-gold);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.mg-hero__motif {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin: 12px auto;
}

.mg-hero__motif span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(216, 182, 118, 0.8));
}

.mg-hero__motif span:last-child {
  transform: scaleX(-1);
}

.mg-hero__motif i {
  color: var(--mg-gold);

  font-size: 15px;
  font-style: normal;

  animation: mg-twinkle 2.8s ease-in-out infinite;
}

.mg-hero h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(40px, 10vw, 58px);
  font-weight: 400;

  line-height: 1.12;

  color: var(--mg-gold);
}

.mg-hero h1 i {
  padding: 0 6px;

  color: var(--mg-gold-bright);

  font-family: Georgia, serif;
  font-size: 0.5em;
  font-style: normal;
}

.mg-hero__announce {
  margin: 28px 0 8px;

  color: var(--mg-text-muted);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.mg-hero__guest {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: 30px;

  color: var(--mg-gold-bright);
}

.mg-hero__intro {
  max-width: 325px;
  margin: 14px auto 8px;

  color: var(--mg-text-muted);

  font-size: 12px;

  letter-spacing: 0.1em;
  line-height: 1.55;
}

.mg-hero__place {
  max-width: 350px;
  margin: 0 auto;

  color: var(--mg-text);

  font-size: 16px;
  font-weight: 700;

  letter-spacing: 0.06em;
  line-height: 1.4;
}

.mg-hero__schedule {
  margin: 24px auto 0;
  padding: 14px 0;

  border-top: 1px solid rgba(216, 182, 118, 0.45);
  border-bottom: 1px solid rgba(216, 182, 118, 0.45);
}

.mg-hero__schedule p {
  margin: 4px 0;

  color: var(--mg-text);

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.14em;
  line-height: 1.45;
}

.mg-hero__message {
  max-width: 295px;
  margin: 24px auto 20px;

  color: var(--mg-text-muted);

  font-size: 14px;
  font-style: italic;

  line-height: 1.5;
}

.mg-hero__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: var(--mg-gold);
}

.mg-hero__footer span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(216, 182, 118, 0.7));
}

.mg-hero__footer span:last-child {
  transform: scaleX(-1);
}

.mg-hero__footer b {
  font-family: "Allura", cursive;
  font-size: 20px;
  font-weight: 400;

  letter-spacing: 0.1em;
}

/* =========================================================
   PARTICLES
========================================================= */

.mg-particles {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.mg-particle {
  position: absolute;
  top: -30px;

  color: rgba(216, 182, 118, 0.5);

  font-size: 13px;

  text-shadow: 0 0 8px rgba(216, 182, 118, 0.45);

  animation: mg-particle-fall linear infinite;
}

.mg-particle--1 { left: 8%; animation-duration: 12s; animation-delay: 0s; }
.mg-particle--2 { left: 22%; animation-duration: 15s; animation-delay: 3s; font-size: 10px; }
.mg-particle--3 { left: 36%; animation-duration: 13s; animation-delay: 1.5s; }
.mg-particle--4 { left: 50%; animation-duration: 16s; animation-delay: 5s; font-size: 9px; }
.mg-particle--5 { left: 63%; animation-duration: 12.5s; animation-delay: 2s; }
.mg-particle--6 { left: 76%; animation-duration: 14.5s; animation-delay: 4.2s; font-size: 11px; }
.mg-particle--7 { left: 87%; animation-duration: 13.5s; animation-delay: 0.8s; }
.mg-particle--8 { left: 95%; animation-duration: 15.5s; animation-delay: 6s; font-size: 9px; }

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes mg-fade-up {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes mg-star-sway {
  0%,
  100% {
    transform: rotate(-8deg) scale(1);
    opacity: 0.55;
  }

  50% {
    transform: rotate(10deg) scale(1.12);
    opacity: 1;
  }
}

@keyframes mg-twinkle {
  0%,
  100% {
    opacity: 0.45;
    transform: scale(0.85);
  }

  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}

@keyframes mg-particle-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  90% {
    opacity: 0.7;
  }

  100% {
    transform: translateY(720px) rotate(320deg);
    opacity: 0;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .mg-hero__content {
    padding: 48px 20px 38px;
  }

  .mg-hero__frame {
    min-height: 640px;
  }

  .mg-hero h1 {
    font-size: 42px;
  }

  .mg-hero__guest {
    font-size: 26px;
  }

  .mg-hero__intro {
    font-size: 11px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .mg-hero__content,
  .mg-star,
  .mg-hero__motif i,
  .mg-particle {
    animation: none;
  }
}
</style>
