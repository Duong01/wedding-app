<template>
  <section class="mn-hero">
    <!-- Soft lilac glows -->
    <div class="mn-hero__glow mn-hero__glow--1"></div>
    <div class="mn-hero__glow mn-hero__glow--2"></div>

    <!-- Decorative arch frame -->
    <div class="mn-hero__frame">
      <div class="mn-hero__frame-inner"></div>

      <!-- Soft photo backdrop -->
      <div class="mn-hero__photo" aria-hidden="true">
        <!-- <img :src="heroImage" alt="" loading="lazy" decoding="async" draggable="false" /> -->
      </div>

      <!-- Corner blooms -->
      <span class="mn-bloom mn-bloom--tl">✧</span>
      <span class="mn-bloom mn-bloom--tr">✧</span>
      <span class="mn-bloom mn-bloom--bl">✧</span>
      <span class="mn-bloom mn-bloom--br">✧</span>

      <div class="mn-hero__content">
        <p class="mn-hero__save-date">{{ heroTitle }}</p>

        <div class="mn-hero__motif">
          <span></span>
          <i>✧</i>
          <span></span>
        </div>

        <h1>
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </h1>

        <p class="mn-hero__announce">{{ heroSubtitle }}</p>

        <p class="mn-hero__guest">{{ guestName }}</p>

        <p class="mn-hero__intro">
          {{ $t("Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại") }}
        </p>

        <p class="mn-hero__place">{{ location }}</p>

        <div class="mn-hero__schedule">
          <p>VÀO LÚC {{ time }}</p>
          <p>{{ dateText }}</p>
        </div>

        <p class="mn-hero__message">
          {{ $t("Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!") }}
        </p>

        <div class="mn-hero__footer">
          <span></span>
          <b>{{ monogram }}</b>
          <span></span>
        </div>
      </div>
    </div>

    <!-- Floating modern sparkles -->
    <div class="mn-sparkle-falls" aria-hidden="true">
      <span v-for="n in 8" :key="n" class="mn-sparkle-fall" :class="`mn-sparkle-fall--${n}`">✧</span>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import dayjs from "dayjs";
import { t } from "@/lang";

const HERO_WEEKDAYS = ["CHỦ NHẬT", "THỨ HAI", "THỨ BA", "THỨ TƯ", "THỨ NĂM", "THỨ SÁU", "THỨ BẢY"];
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
  () => props.wedding?.hero?.Subtitle || t("TRÂN TRỌNG KÍNH MỜI")
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
    return `${t(HERO_WEEKDAYS[date.day()])}, ${t("NGÀY ")}${date.format("DD/MM/YYYY")}`;
  }

  return props.dateLabel || "";
});
</script>

<style scoped>
.mn-hero {
  --mn-deep: var(--tc-3a3a3a, #3a3a3a);
  --mn-modern: var(--tc-474747, #474747);
  --mn-plum: var(--tc-6b6b6b, #6b6b6b);
  --mn-lilac: var(--tc-dcc9a4, #dcc9a4);
  --mn-line: var(--tc-4d4d4d, #4d4d4d);
  --mn-cream: var(--tc-fbf8f0, #fbf8f0);

  position: relative;
  isolation: isolate;
  overflow: hidden;

  padding: 14px;

  min-height: 690px;
  min-height: min(690px, 100dvh);

  background:
    radial-gradient(ellipse at 50% 0%, rgba(var(--tc-fcfaf4-rgb, 252, 250, 244), 0.9), transparent 55%),
    linear-gradient(180deg, var(--tc-fbf8f1, #fbf8f1) 0%, var(--tc-f5ecd8, #f5ecd8) 100%);
}

/* =========================================================
   GLOWS
========================================================= */

.mn-hero__glow {
  position: absolute;
  z-index: 0;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(12px);
}

.mn-hero__glow--1 {
  width: 320px;
  height: 320px;
  top: -80px;
  left: -70px;

  background: radial-gradient(circle, rgba(var(--tc-dcc9a4-rgb, 220, 201, 164), 0.5), transparent 70%);

  animation: mn-glow-breathe 6s ease-in-out infinite;
}

.mn-hero__glow--2 {
  width: 280px;
  height: 280px;
  bottom: -70px;
  right: -60px;

  background: radial-gradient(circle, rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.28), transparent 70%);

  animation: mn-glow-breathe 7s ease-in-out infinite;
  animation-delay: -3s;
}

/* =========================================================
   FRAME
========================================================= */

.mn-hero__frame {
  position: relative;
  z-index: 2;

  min-height: 662px;
  min-height: min(662px, 100dvh);

  display: grid;
  place-items: center;

  border: 1px solid rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.55);
  border-radius: 210px 210px 24px 24px;

  background: linear-gradient(175deg, rgba(255, 255, 255, 0.6), rgba(var(--tc-f4ead4-rgb, 244, 234, 212), 0.35));

  box-shadow: 0 22px 55px rgba(var(--tc-3a3a3a-rgb, 58, 58, 58), 0.1);
}

.mn-hero__frame-inner {
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.28);
  border-radius: 202px 202px 18px 18px;

  pointer-events: none;
}

/* =========================================================
   PHOTO BACKDROP
========================================================= */

.mn-hero__photo {
  position: absolute;
  inset: 0;

  border-radius: inherit;

  overflow: hidden;

  pointer-events: none;
}

.mn-hero__photo img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  opacity: 0.28;

  filter: saturate(0.85);
}

.mn-hero__photo::after {
  content: "";

  position: absolute;
  inset: 0;

  background: linear-gradient(
    180deg,
    rgba(var(--tc-fcf9f2-rgb, 252, 249, 242), 0.6),
    rgba(var(--tc-ede0c4-rgb, 237, 224, 196), 0.35) 55%,
    rgba(var(--tc-fcf9f2-rgb, 252, 249, 242), 0.6)
  );
}

/* =========================================================
   BLOOMS
========================================================= */

.mn-bloom {
  position: absolute;
  z-index: 3;

  color: var(--mn-modern);

  font-size: 20px;

  opacity: 0.75;

  animation: mn-sway 5s ease-in-out infinite;
}

.mn-bloom--tl { top: 26px; left: 30px; }
.mn-bloom--tr { top: 26px; right: 30px; animation-delay: -1.4s; }
.mn-bloom--bl { bottom: 26px; left: 30px; animation-delay: -2.6s; }
.mn-bloom--br { bottom: 26px; right: 30px; animation-delay: -3.8s; }

/* =========================================================
   CONTENT
========================================================= */

.mn-hero__content {
  position: relative;
  z-index: 2;

  width: min(100%, 440px);

  padding: 62px 28px 48px;

  text-align: center;

  animation: mn-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.mn-hero__save-date {
  margin: 0;

  color: var(--mn-line);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.mn-hero__motif {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin: 12px auto;
}

.mn-hero__motif span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.8));
}

.mn-hero__motif span:last-child {
  transform: scaleX(-1);
}

.mn-hero__motif i {
  color: var(--mn-modern);

  font-size: 15px;
  font-style: normal;
}

.mn-hero h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(40px, 10vw, 58px);
  font-weight: 400;

  line-height: 1.12;

  color: var(--mn-deep);
}

.mn-hero h1 i {
  padding: 0 6px;

  color: var(--mn-modern);

  font-family: Georgia, serif;
  font-size: 0.5em;
  font-style: normal;
}

.mn-hero__announce {
  margin: 28px 0 8px;

  color: var(--mn-modern);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.mn-hero__guest {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: 30px;

  color: var(--mn-deep);
}

.mn-hero__intro {
  max-width: 325px;
  margin: 14px auto 8px;

  color: rgba(var(--tc-3a3a3a-rgb, 58, 58, 58), 0.85);

  font-size: 12px;

  letter-spacing: 0.1em;
  line-height: 1.55;
}

.mn-hero__place {
  max-width: 350px;
  margin: 0 auto;

  color: var(--mn-deep);

  font-size: 16px;
  font-weight: 700;

  letter-spacing: 0.06em;
  line-height: 1.4;
}

.mn-hero__schedule {
  margin: 24px auto 0;
  padding: 14px 0;

  border-top: 1px solid rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.45);
  border-bottom: 1px solid rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.45);
}

.mn-hero__schedule p {
  margin: 4px 0;

  color: var(--mn-deep);

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.14em;
  line-height: 1.45;
}

.mn-hero__message {
  max-width: 295px;
  margin: 24px auto 20px;

  color: rgba(var(--tc-3a3a3a-rgb, 58, 58, 58), 0.8);

  font-size: 14px;
  font-style: italic;

  line-height: 1.5;
}

.mn-hero__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: var(--mn-modern);
}

.mn-hero__footer span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.7));
}

.mn-hero__footer span:last-child {
  transform: scaleX(-1);
}

.mn-hero__footer b {
  font-family: "Allura", cursive;
  font-size: 20px;
  font-weight: 400;

  letter-spacing: 0.1em;
}

/* =========================================================
   SPARKLES
========================================================= */

.mn-sparkle-falls {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.mn-sparkle-fall {
  position: absolute;
  top: -30px;

  color: rgba(var(--tc-b8a07a-rgb, 184, 160, 122), 0.45);

  text-shadow: 0 0 6px rgba(var(--tc-dcc9a4-rgb, 220, 201, 164), 0.6);

  font-size: 13px;

  animation: mn-sparkle-fall linear infinite;
}

.mn-sparkle-fall--1 { left: 8%; animation-duration: 12s; animation-delay: 0s; }
.mn-sparkle-fall--2 { left: 22%; animation-duration: 15s; animation-delay: 3s; font-size: 10px; }
.mn-sparkle-fall--3 { left: 36%; animation-duration: 13s; animation-delay: 1.5s; }
.mn-sparkle-fall--4 { left: 50%; animation-duration: 16s; animation-delay: 5s; font-size: 11px; }
.mn-sparkle-fall--5 { left: 63%; animation-duration: 12.5s; animation-delay: 2s; }
.mn-sparkle-fall--6 { left: 76%; animation-duration: 14.5s; animation-delay: 4.2s; font-size: 11px; }
.mn-sparkle-fall--7 { left: 87%; animation-duration: 13.5s; animation-delay: 0.8s; }
.mn-sparkle-fall--8 { left: 95%; animation-duration: 15.5s; animation-delay: 6s; font-size: 11px; }

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes mn-fade-up {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes mn-sway {
  0%,
  100% {
    transform: rotate(-8deg) scale(1);
  }

  50% {
    transform: rotate(10deg) scale(1.12);
  }
}

@keyframes mn-glow-breathe {
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

@keyframes mn-sparkle-fall {
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
  .mn-hero__content {
    padding: 48px 20px 38px;
  }

  .mn-hero__frame {
    min-height: 640px;
    min-height: min(640px, 100dvh);
  }

  .mn-hero h1 {
    font-size: 42px;
  }

  .mn-hero__guest {
    font-size: 26px;
  }

  .mn-hero__intro {
    font-size: 11px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .mn-hero__content,
  .mn-bloom,
  .mn-sparkle-fall,
  .mn-hero__glow--1,
  .mn-hero__glow--2 {
    animation: none;
  }
}
</style>
