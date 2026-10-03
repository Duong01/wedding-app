<template>
  <section class="bl-hero">
    <!-- Soft lilac glows -->
    <div class="bl-hero__glow bl-hero__glow--1"></div>
    <div class="bl-hero__glow bl-hero__glow--2"></div>

    <!-- Decorative arch frame -->
    <div class="bl-hero__frame">
      <div class="bl-hero__frame-inner"></div>

      <!-- Soft photo backdrop -->
      <div class="bl-hero__photo" aria-hidden="true">
        <!-- <img :src="heroImage" alt="" loading="lazy" decoding="async" draggable="false" /> -->
      </div>

      <!-- Corner blooms -->
      <span class="bl-bloom bl-bloom--tl">❧</span>
      <span class="bl-bloom bl-bloom--tr">❧</span>
      <span class="bl-bloom bl-bloom--bl">❧</span>
      <span class="bl-bloom bl-bloom--br">❧</span>

      <div class="bl-hero__content">
        <p class="bl-hero__save-date">{{ heroTitle }}</p>

        <div class="bl-hero__motif">
          <span></span>
          <i>❧</i>
          <span></span>
        </div>

        <h1>
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </h1>

        <p class="bl-hero__announce">{{ heroSubtitle }}</p>

        <p class="bl-hero__guest">{{ guestName }}</p>

        <p class="bl-hero__intro">
          Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại
        </p>

        <p class="bl-hero__place">{{ location }}</p>

        <div class="bl-hero__schedule">
          <p>VÀO LÚC {{ time }}</p>
          <p>{{ dateText }}</p>
        </div>

        <p class="bl-hero__message">
          Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!
        </p>

        <div class="bl-hero__footer">
          <span></span>
          <b>{{ monogram }}</b>
          <span></span>
        </div>
      </div>
    </div>

    <!-- Floating botanical sparkles -->
    <div class="bl-sparkle-falls" aria-hidden="true">
      <span v-for="n in 8" :key="n" class="bl-sparkle-fall" :class="`bl-sparkle-fall--${n}`">✤</span>
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

const heroTitle = computed(
  () => props.wedding?.hero?.Title || "SAVE THE DATE"
);

const heroSubtitle = computed(
  () => props.wedding?.hero?.Subtitle || "TRÂN TRỌNG KÍNH MỜI"
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

const location = computed(
  () =>
    props.event?.Location ||
    props.event?.Address ||
    props.wedding?.hero?.Location ||
    props.wedding?.events?.[0]?.Location ||
    ""
);

const time = computed(
  () =>
    props.event?.EventTime ||
    props.event?.Time ||
    props.event?.StartTime ||
    props.wedding?.hero?.Time ||
    props.wedding?.events?.[0]?.EventTime ||
    ""
);

const dateText = computed(() => {
  const raw =
    props.event?.EventDate ||
    props.event?.Date ||
    props.wedding?.hero?.WeddingDate ||
    props.wedding?.hero?.weddingDate ||
    props.wedding?.weddingDate;

  const date = dayjs(raw);

  if (date.isValid()) {
    return `${date.day() === 0 ? "CHỦ NHẬT" : `THỨ ${date.day() + 1}`}, NGÀY ${date.format("DD/MM/YYYY")}`;
  }

  return props.dateLabel || "";
});
</script>

<style scoped>
.bl-hero {
  --bl-deep: #3d5a47;
  --bl-botanical: #4a6653;
  --bl-plum: #57806a;
  --bl-lilac: #cfe3d2;
  --bl-line: #4f6b58;
  --bl-cream: #f9fbf9;

  position: relative;
  isolation: isolate;
  overflow: hidden;

  padding: 14px;

  min-height: 690px;
  min-height: min(690px, 100dvh);

  background:
    radial-gradient(ellipse at 50% 0%, rgba(252, 253, 252, 0.9), transparent 55%),
    linear-gradient(180deg, #fafcf9 0%, #f0f6f1 100%);
}

/* =========================================================
   GLOWS
========================================================= */

.bl-hero__glow {
  position: absolute;
  z-index: 0;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(12px);
}

.bl-hero__glow--1 {
  width: 320px;
  height: 320px;
  top: -80px;
  left: -70px;

  background: radial-gradient(circle, rgba(207, 227, 210, 0.5), transparent 70%);

  animation: bl-glow-breathe 6s ease-in-out infinite;
}

.bl-hero__glow--2 {
  width: 280px;
  height: 280px;
  bottom: -70px;
  right: -60px;

  background: radial-gradient(circle, rgba(181, 208, 186, 0.28), transparent 70%);

  animation: bl-glow-breathe 7s ease-in-out infinite;
  animation-delay: -3s;
}

/* =========================================================
   FRAME
========================================================= */

.bl-hero__frame {
  position: relative;
  z-index: 2;

  min-height: 662px;
  min-height: min(662px, 100dvh);

  display: grid;
  place-items: center;

  border: 1px solid rgba(181, 208, 186, 0.55);
  border-radius: 210px 210px 24px 24px;

  background: linear-gradient(175deg, rgba(255, 255, 255, 0.6), rgba(244, 250, 245, 0.35));

  box-shadow: 0 22px 55px rgba(61, 90, 71, 0.1);
}

.bl-hero__frame-inner {
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(181, 208, 186, 0.28);
  border-radius: 202px 202px 18px 18px;

  pointer-events: none;
}

/* =========================================================
   PHOTO BACKDROP
========================================================= */

.bl-hero__photo {
  position: absolute;
  inset: 0;

  border-radius: inherit;

  overflow: hidden;

  pointer-events: none;
}

.bl-hero__photo img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  opacity: 0.28;

  filter: saturate(0.85);
}

.bl-hero__photo::after {
  content: "";

  position: absolute;
  inset: 0;

  background: linear-gradient(
    180deg,
    rgba(250, 252, 250, 0.6),
    rgba(240, 246, 241, 0.35) 55%,
    rgba(250, 252, 250, 0.6)
  );
}

/* =========================================================
   BLOOMS
========================================================= */

.bl-bloom {
  position: absolute;
  z-index: 3;

  color: var(--bl-botanical);

  font-size: 20px;

  opacity: 0.75;

  animation: bl-sway 5s ease-in-out infinite;
}

.bl-bloom--tl { top: 26px; left: 30px; }
.bl-bloom--tr { top: 26px; right: 30px; animation-delay: -1.4s; }
.bl-bloom--bl { bottom: 26px; left: 30px; animation-delay: -2.6s; }
.bl-bloom--br { bottom: 26px; right: 30px; animation-delay: -3.8s; }

/* =========================================================
   CONTENT
========================================================= */

.bl-hero__content {
  position: relative;
  z-index: 2;

  width: min(100%, 440px);

  padding: 62px 28px 48px;

  text-align: center;

  animation: bl-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.bl-hero__save-date {
  margin: 0;

  color: var(--bl-line);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.bl-hero__motif {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin: 12px auto;
}

.bl-hero__motif span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(181, 208, 186, 0.8));
}

.bl-hero__motif span:last-child {
  transform: scaleX(-1);
}

.bl-hero__motif i {
  color: var(--bl-botanical);

  font-size: 15px;
  font-style: normal;
}

.bl-hero h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(40px, 10vw, 58px);
  font-weight: 400;

  line-height: 1.12;

  color: var(--bl-deep);
}

.bl-hero h1 i {
  padding: 0 6px;

  color: var(--bl-botanical);

  font-family: Georgia, serif;
  font-size: 0.5em;
  font-style: normal;
}

.bl-hero__announce {
  margin: 28px 0 8px;

  color: var(--bl-botanical);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.bl-hero__guest {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: 30px;

  color: var(--bl-deep);
}

.bl-hero__intro {
  max-width: 325px;
  margin: 14px auto 8px;

  color: rgba(61, 90, 71, 0.85);

  font-size: 12px;

  letter-spacing: 0.1em;
  line-height: 1.55;
}

.bl-hero__place {
  max-width: 350px;
  margin: 0 auto;

  color: var(--bl-deep);

  font-size: 16px;
  font-weight: 700;

  letter-spacing: 0.06em;
  line-height: 1.4;
}

.bl-hero__schedule {
  margin: 24px auto 0;
  padding: 14px 0;

  border-top: 1px solid rgba(181, 208, 186, 0.45);
  border-bottom: 1px solid rgba(181, 208, 186, 0.45);
}

.bl-hero__schedule p {
  margin: 4px 0;

  color: var(--bl-deep);

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.14em;
  line-height: 1.45;
}

.bl-hero__message {
  max-width: 295px;
  margin: 24px auto 20px;

  color: rgba(61, 90, 71, 0.8);

  font-size: 14px;
  font-style: italic;

  line-height: 1.5;
}

.bl-hero__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: var(--bl-botanical);
}

.bl-hero__footer span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(181, 208, 186, 0.7));
}

.bl-hero__footer span:last-child {
  transform: scaleX(-1);
}

.bl-hero__footer b {
  font-family: "Allura", cursive;
  font-size: 20px;
  font-weight: 400;

  letter-spacing: 0.1em;
}

/* =========================================================
   SPARKLES
========================================================= */

.bl-sparkle-falls {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.bl-sparkle-fall {
  position: absolute;
  top: -30px;

  color: rgba(127, 163, 137, 0.45);

  text-shadow: 0 0 6px rgba(207, 227, 210, 0.6);

  font-size: 13px;

  animation: bl-sparkle-fall linear infinite;
}

.bl-sparkle-fall--1 { left: 8%; animation-duration: 12s; animation-delay: 0s; }
.bl-sparkle-fall--2 { left: 22%; animation-duration: 15s; animation-delay: 3s; font-size: 10px; }
.bl-sparkle-fall--3 { left: 36%; animation-duration: 13s; animation-delay: 1.5s; }
.bl-sparkle-fall--4 { left: 50%; animation-duration: 16s; animation-delay: 5s; font-size: 11px; }
.bl-sparkle-fall--5 { left: 63%; animation-duration: 12.5s; animation-delay: 2s; }
.bl-sparkle-fall--6 { left: 76%; animation-duration: 14.5s; animation-delay: 4.2s; font-size: 11px; }
.bl-sparkle-fall--7 { left: 87%; animation-duration: 13.5s; animation-delay: 0.8s; }
.bl-sparkle-fall--8 { left: 95%; animation-duration: 15.5s; animation-delay: 6s; font-size: 11px; }

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes bl-fade-up {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes bl-sway {
  0%,
  100% {
    transform: rotate(-8deg) scale(1);
  }

  50% {
    transform: rotate(10deg) scale(1.12);
  }
}

@keyframes bl-glow-breathe {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(0.96);
  }

  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

@keyframes bl-sparkle-fall {
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
  .bl-hero__content {
    padding: 48px 20px 38px;
  }

  .bl-hero__frame {
    min-height: 640px;
    min-height: min(640px, 100dvh);
  }

  .bl-hero h1 {
    font-size: 42px;
  }

  .bl-hero__guest {
    font-size: 26px;
  }

  .bl-hero__intro {
    font-size: 11px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .bl-hero__content,
  .bl-bloom,
  .bl-sparkle-fall,
  .bl-hero__glow--1,
  .bl-hero__glow--2 {
    animation: none;
  }
}
</style>
