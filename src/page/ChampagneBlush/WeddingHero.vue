<template>
  <section class="cb-hero">
    <!-- Decorative arch frame -->
    <div class="cb-hero__frame">
      <div class="cb-hero__frame-inner"></div>

      <!-- Corner blooms -->
      <span class="cb-bloom cb-bloom--tl">❀</span>
      <span class="cb-bloom cb-bloom--tr">❀</span>
      <span class="cb-bloom cb-bloom--bl">❀</span>
      <span class="cb-bloom cb-bloom--br">❀</span>

      <div class="cb-hero__content">
        <p class="cb-hero__save-date">SAVE THE DATE</p>

        <div class="cb-hero__motif">
          <span></span>
          <i>❀</i>
          <span></span>
        </div>

        <h1>
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </h1>

        <p class="cb-hero__announce">TRÂN TRỌNG KÍNH MỜI</p>

        <p class="cb-hero__guest">{{ guestName }}</p>

        <p class="cb-hero__intro">
          Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại
        </p>

        <p class="cb-hero__place">{{ location }}</p>

        <div class="cb-hero__schedule">
          <p>VÀO LÚC {{ time }}</p>
          <p>{{ dateText }}</p>
        </div>

        <p class="cb-hero__message">
          Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!
        </p>

        <div class="cb-hero__footer">
          <span></span>
          <b>{{ monogram }}</b>
          <span></span>
        </div>
      </div>
    </div>

    <!-- Floating petals -->
    <div class="cb-petals" aria-hidden="true">
      <span v-for="n in 8" :key="n" class="cb-petal" :class="`cb-petal--${n}`">❀</span>
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
.cb-hero {
  --cb-deep: #6c4b4a;
  --cb-rose: #b67f7d;
  --cb-gold: #c9a06a;
  --cb-cream: #fffaf7;

  position: relative;
  isolation: isolate;
  overflow: hidden;

  padding: 14px;

  min-height: 690px;

  background:
    radial-gradient(ellipse at 50% 0%, rgba(255, 252, 248, 0.9), transparent 55%),
    linear-gradient(180deg, #fdf6ef 0%, #f6e9dd 100%);
}

/* =========================================================
   FRAME
========================================================= */

.cb-hero__frame {
  position: relative;

  min-height: 662px;

  display: grid;
  place-items: center;

  border: 1px solid rgba(201, 160, 106, 0.55);
  border-radius: 210px 210px 24px 24px;

  background: linear-gradient(175deg, rgba(255, 253, 250, 0.6), rgba(250, 240, 230, 0.35));

  box-shadow: 0 22px 55px rgba(108, 75, 74, 0.1);
}

.cb-hero__frame-inner {
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(201, 160, 106, 0.28);
  border-radius: 202px 202px 18px 18px;

  pointer-events: none;
}

/* =========================================================
   BLOOMS
========================================================= */

.cb-bloom {
  position: absolute;
  z-index: 3;

  color: var(--cb-rose);

  font-size: 20px;

  opacity: 0.75;

  animation: cb-bloom-sway 5s ease-in-out infinite;
}

.cb-bloom--tl { top: 26px; left: 30px; }
.cb-bloom--tr { top: 26px; right: 30px; animation-delay: -1.4s; }
.cb-bloom--bl { bottom: 26px; left: 30px; animation-delay: -2.6s; }
.cb-bloom--br { bottom: 26px; right: 30px; animation-delay: -3.8s; }

/* =========================================================
   CONTENT
========================================================= */

.cb-hero__content {
  position: relative;
  z-index: 2;

  width: min(100%, 440px);

  padding: 62px 28px 48px;

  text-align: center;

  animation: cb-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.cb-hero__save-date {
  margin: 0;

  color: var(--cb-gold);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.cb-hero__motif {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin: 12px auto;
}

.cb-hero__motif span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 160, 106, 0.8));
}

.cb-hero__motif span:last-child {
  transform: scaleX(-1);
}

.cb-hero__motif i {
  color: var(--cb-rose);

  font-size: 15px;
  font-style: normal;
}

.cb-hero h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(40px, 10vw, 58px);
  font-weight: 400;

  line-height: 1.12;

  color: var(--cb-deep);
}

.cb-hero h1 i {
  padding: 0 6px;

  color: var(--cb-rose);

  font-family: Georgia, serif;
  font-size: 0.5em;
  font-style: normal;
}

.cb-hero__announce {
  margin: 28px 0 8px;

  color: var(--cb-rose);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.cb-hero__guest {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: 30px;

  color: var(--cb-deep);
}

.cb-hero__intro {
  max-width: 325px;
  margin: 14px auto 8px;

  color: rgba(108, 75, 74, 0.85);

  font-size: 12px;

  letter-spacing: 0.1em;
  line-height: 1.55;
}

.cb-hero__place {
  max-width: 350px;
  margin: 0 auto;

  color: var(--cb-deep);

  font-size: 16px;
  font-weight: 700;

  letter-spacing: 0.06em;
  line-height: 1.4;
}

.cb-hero__schedule {
  margin: 24px auto 0;
  padding: 14px 0;

  border-top: 1px solid rgba(201, 160, 106, 0.45);
  border-bottom: 1px solid rgba(201, 160, 106, 0.45);
}

.cb-hero__schedule p {
  margin: 4px 0;

  color: var(--cb-deep);

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.14em;
  line-height: 1.45;
}

.cb-hero__message {
  max-width: 295px;
  margin: 24px auto 20px;

  color: rgba(108, 75, 74, 0.8);

  font-size: 14px;
  font-style: italic;

  line-height: 1.5;
}

.cb-hero__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: var(--cb-rose);
}

.cb-hero__footer span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 160, 106, 0.7));
}

.cb-hero__footer span:last-child {
  transform: scaleX(-1);
}

.cb-hero__footer b {
  font-family: "Allura", cursive;
  font-size: 20px;
  font-weight: 400;

  letter-spacing: 0.1em;
}

/* =========================================================
   PETALS
========================================================= */

.cb-petals {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.cb-petal {
  position: absolute;
  top: -30px;

  color: rgba(182, 127, 125, 0.4);

  font-size: 13px;

  animation: cb-petal-fall linear infinite;
}

.cb-petal--1 { left: 8%; animation-duration: 12s; animation-delay: 0s; }
.cb-petal--2 { left: 22%; animation-duration: 15s; animation-delay: 3s; font-size: 10px; }
.cb-petal--3 { left: 36%; animation-duration: 13s; animation-delay: 1.5s; }
.cb-petal--4 { left: 50%; animation-duration: 16s; animation-delay: 5s; font-size: 9px; }
.cb-petal--5 { left: 63%; animation-duration: 12.5s; animation-delay: 2s; }
.cb-petal--6 { left: 76%; animation-duration: 14.5s; animation-delay: 4.2s; font-size: 11px; }
.cb-petal--7 { left: 87%; animation-duration: 13.5s; animation-delay: 0.8s; }
.cb-petal--8 { left: 95%; animation-duration: 15.5s; animation-delay: 6s; font-size: 9px; }

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes cb-fade-up {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes cb-bloom-sway {
  0%,
  100% {
    transform: rotate(-8deg) scale(1);
  }

  50% {
    transform: rotate(10deg) scale(1.12);
  }
}

@keyframes cb-petal-fall {
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
  .cb-hero__content {
    padding: 48px 20px 38px;
  }

  .cb-hero__frame {
    min-height: 640px;
  }

  .cb-hero h1 {
    font-size: 42px;
  }

  .cb-hero__guest {
    font-size: 26px;
  }

  .cb-hero__intro {
    font-size: 11px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .cb-hero__content,
  .cb-bloom,
  .cb-petal {
    animation: none;
  }
}
</style>
