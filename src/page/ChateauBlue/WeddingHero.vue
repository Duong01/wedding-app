<template>
  <section class="ct-hero">
    <!-- Soft lilac glows -->
    <div class="ct-hero__glow ct-hero__glow--1"></div>
    <div class="ct-hero__glow ct-hero__glow--2"></div>

    <!-- Decorative arch frame -->
    <div class="ct-hero__frame">
      <div class="ct-hero__frame-inner"></div>

      <!-- Soft photo backdrop -->
      <div class="ct-hero__photo" aria-hidden="true">
        <!-- <img :src="heroImage" alt="" loading="lazy" decoding="async" draggable="false" /> -->
      </div>

      <!-- Corner blooms -->
      <span class="ct-bloom ct-bloom--tl">❦</span>
      <span class="ct-bloom ct-bloom--tr">❦</span>
      <span class="ct-bloom ct-bloom--bl">❦</span>
      <span class="ct-bloom ct-bloom--br">❦</span>

      <div class="ct-hero__content">
        <p class="ct-hero__save-date">{{ heroTitle }}</p>

        <div class="ct-hero__motif">
          <span></span>
          <i>❦</i>
          <span></span>
        </div>

        <h1>
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </h1>

        <p class="ct-hero__announce">{{ heroSubtitle }}</p>

        <p class="ct-hero__guest">{{ guestName }}</p>

        <p class="ct-hero__intro">
          Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại
        </p>

        <p class="ct-hero__place">{{ location }}</p>

        <div class="ct-hero__schedule">
          <p>VÀO LÚC {{ time }}</p>
          <p>{{ dateText }}</p>
        </div>

        <p class="ct-hero__message">
          Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!
        </p>

        <div class="ct-hero__footer">
          <span></span>
          <b>{{ monogram }}</b>
          <span></span>
        </div>
      </div>
    </div>

    <!-- Floating chateau sparkles -->
    <div class="ct-sparkle-falls" aria-hidden="true">
      <span v-for="n in 8" :key="n" class="ct-sparkle-fall" :class="`ct-sparkle-fall--${n}`">✦</span>
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
.ct-hero {
  --ct-deep: var(--tc-2f3e5c, #2f3e5c);
  --ct-chateau: var(--tc-48546e, #48546e);
  --ct-plum: var(--tc-5c6d8f, #5c6d8f);
  --ct-lilac: var(--tc-ccd6e8, #ccd6e8);
  --ct-line: var(--tc-4d5a75, #4d5a75);
  --ct-cream: var(--tc-fafbfd, #fafbfd);

  position: relative;
  isolation: isolate;
  overflow: hidden;

  padding: 14px;

  min-height: 690px;
  min-height: min(690px, 100dvh);

  background:
    radial-gradient(ellipse at 50% 0%, rgba(var(--tc-fcfcfd-rgb, 252, 252, 253), 0.9), transparent 55%),
    linear-gradient(180deg, var(--tc-fbfcfd, #fbfcfd) 0%, var(--tc-eef1f8, #eef1f8) 100%);
}

/* =========================================================
   GLOWS
========================================================= */

.ct-hero__glow {
  position: absolute;
  z-index: 0;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(12px);
}

.ct-hero__glow--1 {
  width: 320px;
  height: 320px;
  top: -80px;
  left: -70px;

  background: radial-gradient(circle, rgba(var(--tc-ccd6e8-rgb, 204, 214, 232), 0.5), transparent 70%);

  animation: ct-glow-breathe 6s ease-in-out infinite;
}

.ct-hero__glow--2 {
  width: 280px;
  height: 280px;
  bottom: -70px;
  right: -60px;

  background: radial-gradient(circle, rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.28), transparent 70%);

  animation: ct-glow-breathe 7s ease-in-out infinite;
  animation-delay: -3s;
}

/* =========================================================
   FRAME
========================================================= */

.ct-hero__frame {
  position: relative;
  z-index: 2;

  min-height: 662px;
  min-height: min(662px, 100dvh);

  display: grid;
  place-items: center;

  border: 1px solid rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.55);
  border-radius: 210px 210px 24px 24px;

  background: linear-gradient(175deg, rgba(255, 255, 255, 0.6), rgba(var(--tc-f4f7fb-rgb, 244, 247, 251), 0.35));

  box-shadow: 0 22px 55px rgba(var(--tc-2f3e5c-rgb, 47, 62, 92), 0.1);
}

.ct-hero__frame-inner {
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.28);
  border-radius: 202px 202px 18px 18px;

  pointer-events: none;
}

/* =========================================================
   PHOTO BACKDROP
========================================================= */

.ct-hero__photo {
  position: absolute;
  inset: 0;

  border-radius: inherit;

  overflow: hidden;

  pointer-events: none;
}

.ct-hero__photo img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  opacity: 0.28;

  filter: saturate(0.85);
}

.ct-hero__photo::after {
  content: "";

  position: absolute;
  inset: 0;

  background: linear-gradient(
    180deg,
    rgba(var(--tc-fbfcfd-rgb, 251, 252, 253), 0.6),
    rgba(var(--tc-eef2f9-rgb, 238, 242, 249), 0.35) 55%,
    rgba(var(--tc-fbfcfd-rgb, 251, 252, 253), 0.6)
  );
}

/* =========================================================
   BLOOMS
========================================================= */

.ct-bloom {
  position: absolute;
  z-index: 3;

  color: var(--ct-chateau);

  font-size: 20px;

  opacity: 0.75;

  animation: ct-sway 5s ease-in-out infinite;
}

.ct-bloom--tl { top: 26px; left: 30px; }
.ct-bloom--tr { top: 26px; right: 30px; animation-delay: -1.4s; }
.ct-bloom--bl { bottom: 26px; left: 30px; animation-delay: -2.6s; }
.ct-bloom--br { bottom: 26px; right: 30px; animation-delay: -3.8s; }

/* =========================================================
   CONTENT
========================================================= */

.ct-hero__content {
  position: relative;
  z-index: 2;

  width: min(100%, 440px);

  padding: 62px 28px 48px;

  text-align: center;

  animation: ct-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.ct-hero__save-date {
  margin: 0;

  color: var(--ct-line);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.ct-hero__motif {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin: 12px auto;
}

.ct-hero__motif span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.8));
}

.ct-hero__motif span:last-child {
  transform: scaleX(-1);
}

.ct-hero__motif i {
  color: var(--ct-chateau);

  font-size: 15px;
  font-style: normal;
}

.ct-hero h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(40px, 10vw, 58px);
  font-weight: 400;

  line-height: 1.12;

  color: var(--ct-deep);
}

.ct-hero h1 i {
  padding: 0 6px;

  color: var(--ct-chateau);

  font-family: Georgia, serif;
  font-size: 0.5em;
  font-style: normal;
}

.ct-hero__announce {
  margin: 28px 0 8px;

  color: var(--ct-chateau);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.ct-hero__guest {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: 30px;

  color: var(--ct-deep);
}

.ct-hero__intro {
  max-width: 325px;
  margin: 14px auto 8px;

  color: rgba(var(--tc-2f3e5c-rgb, 47, 62, 92), 0.85);

  font-size: 12px;

  letter-spacing: 0.1em;
  line-height: 1.55;
}

.ct-hero__place {
  max-width: 350px;
  margin: 0 auto;

  color: var(--ct-deep);

  font-size: 16px;
  font-weight: 700;

  letter-spacing: 0.06em;
  line-height: 1.4;
}

.ct-hero__schedule {
  margin: 24px auto 0;
  padding: 14px 0;

  border-top: 1px solid rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.45);
  border-bottom: 1px solid rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.45);
}

.ct-hero__schedule p {
  margin: 4px 0;

  color: var(--ct-deep);

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.14em;
  line-height: 1.45;
}

.ct-hero__message {
  max-width: 295px;
  margin: 24px auto 20px;

  color: rgba(var(--tc-2f3e5c-rgb, 47, 62, 92), 0.8);

  font-size: 14px;
  font-style: italic;

  line-height: 1.5;
}

.ct-hero__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: var(--ct-chateau);
}

.ct-hero__footer span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.7));
}

.ct-hero__footer span:last-child {
  transform: scaleX(-1);
}

.ct-hero__footer b {
  font-family: "Allura", cursive;
  font-size: 20px;
  font-weight: 400;

  letter-spacing: 0.1em;
}

/* =========================================================
   SPARKLES
========================================================= */

.ct-sparkle-falls {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.ct-sparkle-fall {
  position: absolute;
  top: -30px;

  color: rgba(var(--tc-7d8fb0-rgb, 125, 143, 176), 0.45);

  text-shadow: 0 0 6px rgba(var(--tc-ccd6e8-rgb, 204, 214, 232), 0.6);

  font-size: 13px;

  animation: ct-sparkle-fall linear infinite;
}

.ct-sparkle-fall--1 { left: 8%; animation-duration: 12s; animation-delay: 0s; }
.ct-sparkle-fall--2 { left: 22%; animation-duration: 15s; animation-delay: 3s; font-size: 10px; }
.ct-sparkle-fall--3 { left: 36%; animation-duration: 13s; animation-delay: 1.5s; }
.ct-sparkle-fall--4 { left: 50%; animation-duration: 16s; animation-delay: 5s; font-size: 11px; }
.ct-sparkle-fall--5 { left: 63%; animation-duration: 12.5s; animation-delay: 2s; }
.ct-sparkle-fall--6 { left: 76%; animation-duration: 14.5s; animation-delay: 4.2s; font-size: 11px; }
.ct-sparkle-fall--7 { left: 87%; animation-duration: 13.5s; animation-delay: 0.8s; }
.ct-sparkle-fall--8 { left: 95%; animation-duration: 15.5s; animation-delay: 6s; font-size: 11px; }

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes ct-fade-up {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes ct-sway {
  0%,
  100% {
    transform: rotate(-8deg) scale(1);
  }

  50% {
    transform: rotate(10deg) scale(1.12);
  }
}

@keyframes ct-glow-breathe {
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

@keyframes ct-sparkle-fall {
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
  .ct-hero__content {
    padding: 48px 20px 38px;
  }

  .ct-hero__frame {
    min-height: 640px;
    min-height: min(640px, 100dvh);
  }

  .ct-hero h1 {
    font-size: 42px;
  }

  .ct-hero__guest {
    font-size: 26px;
  }

  .ct-hero__intro {
    font-size: 11px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .ct-hero__content,
  .ct-bloom,
  .ct-sparkle-fall,
  .ct-hero__glow--1,
  .ct-hero__glow--2 {
    animation: none;
  }
}
</style>
