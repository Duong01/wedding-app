<template>
  <section class="sg-hero">
    <!-- Decorative arch frame -->
    <div class="sg-hero__frame">
      <div class="sg-hero__frame-inner"></div>

      <!-- Corner blooms -->
      <span class="sg-bloom sg-bloom--tl">❀</span>
      <span class="sg-bloom sg-bloom--tr">❀</span>
      <span class="sg-bloom sg-bloom--bl">❀</span>
      <span class="sg-bloom sg-bloom--br">❀</span>

      <!-- Small leaf accents -->
      <span class="sg-leaf sg-leaf--tl">
        <v-icon size="13">mdi-leaf</v-icon>
      </span>
      <span class="sg-leaf sg-leaf--tr">
        <v-icon size="13">mdi-sprout-outline</v-icon>
      </span>
      <span class="sg-leaf sg-leaf--bl">
        <v-icon size="13">mdi-sprout-outline</v-icon>
      </span>
      <span class="sg-leaf sg-leaf--br">
        <v-icon size="13">mdi-leaf</v-icon>
      </span>

      <div class="sg-hero__content">
        <p class="sg-hero__save-date">SAVE THE DATE</p>

        <div class="sg-hero__motif">
          <span></span>
          <i>❀</i>
          <span></span>
        </div>

        <h1>
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </h1>

        <p class="sg-hero__announce">TRÂN TRỌNG KÍNH MỜI</p>

        <p class="sg-hero__guest">{{ guestName }}</p>

        <p class="sg-hero__intro">
          Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại
        </p>

        <p class="sg-hero__place">{{ location }}</p>

        <div class="sg-hero__schedule">
          <p>VÀO LÚC {{ time }}</p>
          <p>{{ dateText }}</p>
        </div>

        <p class="sg-hero__message">
          Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!
        </p>

        <div class="sg-hero__footer">
          <span></span>
          <b>{{ monogram }}</b>
          <span></span>
        </div>
      </div>
    </div>

    <!-- Floating sparkles -->
    <div class="sg-sparkles" aria-hidden="true">
      <span v-for="n in 8" :key="n" class="sg-sparkle" :class="`sg-sparkle--${n}`">
        {{ n % 3 === 0 ? "❀" : "✦" }}
      </span>
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
.sg-hero {
  --sg-deep: #28514b;
  --sg-leaf: #6c8e7a;
  --sg-pine: #3f6f63;
  --sg-sage: #c8d4c3;
  --sg-line: #8fae9b;
  --sg-cream: #f5f8f4;

  position: relative;
  isolation: isolate;
  overflow: hidden;

  padding: 14px;

  min-height: 690px;

  background:
    radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.9), transparent 55%),
    linear-gradient(180deg, #f5f8f4 0%, #edf4eb 100%);
}

/* =========================================================
   FRAME
========================================================= */

.sg-hero__frame {
  position: relative;

  min-height: 662px;

  display: grid;
  place-items: center;

  border: 1px solid rgba(143, 174, 155, 0.55);
  border-radius: 210px 210px 24px 24px;

  background: linear-gradient(175deg, rgba(255, 255, 255, 0.6), rgba(240, 246, 238, 0.35));

  box-shadow: 0 22px 55px rgba(40, 81, 75, 0.1);
}

.sg-hero__frame-inner {
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(143, 174, 155, 0.28);
  border-radius: 202px 202px 18px 18px;

  pointer-events: none;
}

/* =========================================================
   BLOOMS
========================================================= */

.sg-bloom {
  position: absolute;
  z-index: 3;

  color: var(--sg-leaf);

  font-size: 20px;

  opacity: 0.75;

  animation: sg-sway 5s ease-in-out infinite;
}

.sg-bloom--tl { top: 26px; left: 30px; }
.sg-bloom--tr { top: 26px; right: 30px; animation-delay: -1.4s; }
.sg-bloom--bl { bottom: 26px; left: 30px; animation-delay: -2.6s; }
.sg-bloom--br { bottom: 26px; right: 30px; animation-delay: -3.8s; }

/* =========================================================
   LEAF ACCENTS
========================================================= */

.sg-leaf {
  position: absolute;
  z-index: 3;

  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--sg-pine);

  opacity: 0.6;

  animation: sg-sway 6s ease-in-out infinite;
}

.sg-leaf--tl { top: 58px; left: 52px; animation-delay: -0.8s; }
.sg-leaf--tr { top: 58px; right: 52px; animation-delay: -2.2s; }
.sg-leaf--bl { bottom: 58px; left: 52px; animation-delay: -3.4s; }
.sg-leaf--br { bottom: 58px; right: 52px; animation-delay: -4.6s; }

/* =========================================================
   CONTENT
========================================================= */

.sg-hero__content {
  position: relative;
  z-index: 2;

  width: min(100%, 440px);

  padding: 62px 28px 48px;

  text-align: center;

  animation: sg-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.sg-hero__save-date {
  margin: 0;

  color: var(--sg-line);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.sg-hero__motif {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin: 12px auto;
}

.sg-hero__motif span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(143, 174, 155, 0.8));
}

.sg-hero__motif span:last-child {
  transform: scaleX(-1);
}

.sg-hero__motif i {
  color: var(--sg-leaf);

  font-size: 15px;
  font-style: normal;
}

.sg-hero h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(40px, 10vw, 58px);
  font-weight: 400;

  line-height: 1.12;

  color: var(--sg-deep);
}

.sg-hero h1 i {
  padding: 0 6px;

  color: var(--sg-leaf);

  font-family: Georgia, serif;
  font-size: 0.5em;
  font-style: normal;
}

.sg-hero__announce {
  margin: 28px 0 8px;

  color: var(--sg-leaf);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.sg-hero__guest {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: 30px;

  color: var(--sg-deep);
}

.sg-hero__intro {
  max-width: 325px;
  margin: 14px auto 8px;

  color: rgba(40, 81, 75, 0.85);

  font-size: 12px;

  letter-spacing: 0.1em;
  line-height: 1.55;
}

.sg-hero__place {
  max-width: 350px;
  margin: 0 auto;

  color: var(--sg-deep);

  font-size: 16px;
  font-weight: 700;

  letter-spacing: 0.06em;
  line-height: 1.4;
}

.sg-hero__schedule {
  margin: 24px auto 0;
  padding: 14px 0;

  border-top: 1px solid rgba(143, 174, 155, 0.45);
  border-bottom: 1px solid rgba(143, 174, 155, 0.45);
}

.sg-hero__schedule p {
  margin: 4px 0;

  color: var(--sg-deep);

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.14em;
  line-height: 1.45;
}

.sg-hero__message {
  max-width: 295px;
  margin: 24px auto 20px;

  color: rgba(40, 81, 75, 0.8);

  font-size: 14px;
  font-style: italic;

  line-height: 1.5;
}

.sg-hero__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: var(--sg-leaf);
}

.sg-hero__footer span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(143, 174, 155, 0.7));
}

.sg-hero__footer span:last-child {
  transform: scaleX(-1);
}

.sg-hero__footer b {
  font-family: "Allura", cursive;
  font-size: 20px;
  font-weight: 400;

  letter-spacing: 0.1em;
}

/* =========================================================
   SPARKLES
========================================================= */

.sg-sparkles {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.sg-sparkle {
  position: absolute;
  top: -30px;

  color: rgba(108, 142, 122, 0.4);

  font-size: 13px;

  animation: sg-sparkle-fall linear infinite;
}

.sg-sparkle--1 { left: 8%; animation-duration: 12s; animation-delay: 0s; }
.sg-sparkle--2 { left: 22%; animation-duration: 15s; animation-delay: 3s; font-size: 10px; }
.sg-sparkle--3 { left: 36%; animation-duration: 13s; animation-delay: 1.5s; }
.sg-sparkle--4 { left: 50%; animation-duration: 16s; animation-delay: 5s; font-size: 9px; }
.sg-sparkle--5 { left: 63%; animation-duration: 12.5s; animation-delay: 2s; }
.sg-sparkle--6 { left: 76%; animation-duration: 14.5s; animation-delay: 4.2s; font-size: 11px; }
.sg-sparkle--7 { left: 87%; animation-duration: 13.5s; animation-delay: 0.8s; }
.sg-sparkle--8 { left: 95%; animation-duration: 15.5s; animation-delay: 6s; font-size: 9px; }

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes sg-fade-up {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes sg-sway {
  0%,
  100% {
    transform: rotate(-8deg) scale(1);
  }

  50% {
    transform: rotate(10deg) scale(1.12);
  }
}

@keyframes sg-sparkle-fall {
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
  .sg-hero__content {
    padding: 48px 20px 38px;
  }

  .sg-hero__frame {
    min-height: 640px;
  }

  .sg-hero h1 {
    font-size: 42px;
  }

  .sg-hero__guest {
    font-size: 26px;
  }

  .sg-hero__intro {
    font-size: 11px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .sg-hero__content,
  .sg-bloom,
  .sg-leaf,
  .sg-sparkle {
    animation: none;
  }
}
</style>
