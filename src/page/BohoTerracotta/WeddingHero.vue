<template>
  <section class="bt-hero">
    <!-- Sun + rays behind the arch -->
    <div class="bt-hero__sun" aria-hidden="true">
      <span v-for="n in 10" :key="n" class="bt-hero__ray" :class="`bt-hero__ray--${n}`"></span>
      <span class="bt-hero__sun-core"></span>
    </div>

    <!-- Pampas strokes swaying at the sides -->
    <span class="bt-hero__pampas bt-hero__pampas--left">❋</span>
    <span class="bt-hero__pampas bt-hero__pampas--right">✽</span>

    <!-- Arch photo frame -->
    <div class="bt-hero__frame">
      <div class="bt-hero__frame-inner"></div>

      <div class="bt-hero__photo">
        <img v-if="heroImage" :src="heroImage" alt="Ảnh cưới" draggable="false" />

        <div v-else class="bt-hero__photo-fallback"></div>
      </div>

      <div class="bt-hero__content">
        <p class="bt-hero__save-date">SAVE THE DATE</p>

        <div class="bt-hero__motif">
          <span></span>
          <i>❋</i>
          <span></span>
        </div>

        <h1>
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </h1>

        <p class="bt-hero__announce">TRÂN TRỌNG KÍNH MỜI</p>

        <p class="bt-hero__guest">{{ guestName }}</p>

        <p class="bt-hero__intro">
          Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại
        </p>

        <p class="bt-hero__place">{{ location }}</p>

        <div class="bt-hero__schedule">
          <p>VÀO LÚC {{ time }}</p>
          <p>{{ dateText }}</p>
        </div>

        <p class="bt-hero__message">
          Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!
        </p>

        <div class="bt-hero__footer">
          <span></span>
          <b>{{ monogram }}</b>
          <span></span>
        </div>
      </div>
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

const heroImage = computed(
  () =>
    props.wedding?.hero?.Background ||
    props.wedding?.hero?.background ||
    props.wedding?.coverImage ||
    props.wedding?.CoverImage ||
    ""
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
.bt-hero {
  --bt-terra: #9c5b3f;
  --bt-clay: #c97b5d;
  --bt-sand: #d9b08c;
  --bt-light: #f2e2d0;
  --bt-bg: #faf3ec;
  --bt-text: #5c4636;
  --bt-sage: #8a9b7c;

  position: relative;
  isolation: isolate;
  overflow: hidden;

  padding: 14px;

  min-height: 690px;

  background:
    radial-gradient(ellipse at 50% 0%, rgba(255, 251, 245, 0.92), transparent 55%),
    linear-gradient(180deg, #faf3ec 0%, #f0ddc8 100%);
}

/* =========================================================
   SUN BEHIND THE ARCH
========================================================= */

.bt-hero__sun {
  position: absolute;
  z-index: 0;

  top: 40px;
  left: 50%;

  width: 150px;
  height: 150px;

  transform: translateX(-50%);

  pointer-events: none;

  animation: bt-hero-sun-spin 46s linear infinite;
}

.bt-hero__sun-core {
  position: absolute;
  inset: 42px;

  border-radius: 50%;

  background: radial-gradient(circle at 36% 32%, #eccfa4, #d9b08c 55%, #c97b5d 100%);

  box-shadow: 0 0 30px rgba(217, 176, 140, 0.7);
}

.bt-hero__ray {
  position: absolute;
  top: 50%;
  left: 50%;

  width: 2px;
  height: 62px;

  transform-origin: center 0;

  background: linear-gradient(180deg, rgba(201, 123, 93, 0.6), transparent);

  border-radius: 2px;
}

.bt-hero__ray--1 { transform: translate(-50%, 0) rotate(0deg) translateY(-80px); }
.bt-hero__ray--2 { transform: translate(-50%, 0) rotate(36deg) translateY(-80px); }
.bt-hero__ray--3 { transform: translate(-50%, 0) rotate(72deg) translateY(-80px); }
.bt-hero__ray--4 { transform: translate(-50%, 0) rotate(108deg) translateY(-80px); }
.bt-hero__ray--5 { transform: translate(-50%, 0) rotate(144deg) translateY(-80px); }
.bt-hero__ray--6 { transform: translate(-50%, 0) rotate(180deg) translateY(-80px); }
.bt-hero__ray--7 { transform: translate(-50%, 0) rotate(216deg) translateY(-80px); }
.bt-hero__ray--8 { transform: translate(-50%, 0) rotate(252deg) translateY(-80px); }
.bt-hero__ray--9 { transform: translate(-50%, 0) rotate(288deg) translateY(-80px); }
.bt-hero__ray--10 { transform: translate(-50%, 0) rotate(324deg) translateY(-80px); }

/* =========================================================
   PAMPAS STROKES
========================================================= */

.bt-hero__pampas {
  position: absolute;
  z-index: 1;

  color: rgba(156, 91, 63, 0.3);

  font-size: 30px;

  pointer-events: none;

  transform-origin: bottom center;

  animation: bt-hero-sway 6.5s ease-in-out infinite;
}

.bt-hero__pampas--left {
  top: 46%;
  left: 12px;
}

.bt-hero__pampas--right {
  top: 52%;
  right: 14px;

  font-size: 24px;

  animation-delay: -2.4s;
}

/* =========================================================
   ARCH FRAME
========================================================= */

.bt-hero__frame {
  position: relative;
  z-index: 2;

  min-height: 662px;

  display: grid;
  place-items: center;

  border: 2px dashed rgba(156, 91, 63, 0.5);
  border-radius: 999px 999px 26px 26px;

  background: linear-gradient(175deg, rgba(255, 251, 245, 0.65), rgba(242, 226, 208, 0.4));

  box-shadow: 0 22px 55px rgba(92, 70, 54, 0.12);

  overflow: hidden;
}

.bt-hero__frame-inner {
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(156, 91, 63, 0.3);
  border-radius: 999px 999px 20px 20px;

  pointer-events: none;
}

/* =========================================================
   PHOTO
========================================================= */

.bt-hero__photo {
  position: absolute;
  inset: 0;

  z-index: 0;
}

.bt-hero__photo img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  opacity: 0.32;

  filter: saturate(0.85) sepia(0.12);
}

.bt-hero__photo-fallback {
  width: 100%;
  height: 100%;

  background:
    radial-gradient(circle at 50% 22%, rgba(217, 176, 140, 0.5), transparent 55%),
    linear-gradient(180deg, #f2e2d0 0%, #e3c4a6 60%, #d9b08c 100%);
}

/* =========================================================
   CONTENT
========================================================= */

.bt-hero__content {
  position: relative;
  z-index: 2;

  width: min(100%, 440px);

  padding: 62px 28px 48px;

  text-align: center;

  animation: bt-hero-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.bt-hero__save-date {
  margin: 0;

  color: var(--bt-sage);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.bt-hero__motif {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin: 12px auto;
}

.bt-hero__motif span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(156, 91, 63, 0.75));
}

.bt-hero__motif span:last-child {
  transform: scaleX(-1);
}

.bt-hero__motif i {
  color: var(--bt-clay);

  font-size: 15px;
  font-style: normal;
}

.bt-hero h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(40px, 10vw, 58px);
  font-weight: 400;

  line-height: 1.12;

  color: var(--bt-terra);
}

.bt-hero h1 i {
  padding: 0 6px;

  color: var(--bt-clay);

  font-family: Georgia, serif;
  font-size: 0.5em;
  font-style: normal;
}

.bt-hero__announce {
  margin: 28px 0 8px;

  color: var(--bt-clay);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.bt-hero__guest {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: 30px;

  color: var(--bt-text);
}

.bt-hero__intro {
  max-width: 325px;
  margin: 14px auto 8px;

  color: rgba(92, 70, 54, 0.85);

  font-size: 12px;

  letter-spacing: 0.1em;
  line-height: 1.55;
}

.bt-hero__place {
  max-width: 350px;
  margin: 0 auto;

  color: var(--bt-terra);

  font-size: 16px;
  font-weight: 700;

  letter-spacing: 0.06em;
  line-height: 1.4;
}

.bt-hero__schedule {
  margin: 24px auto 0;
  padding: 14px 0;

  border-top: 1px dashed rgba(156, 91, 63, 0.45);
  border-bottom: 1px dashed rgba(156, 91, 63, 0.45);
}

.bt-hero__schedule p {
  margin: 4px 0;

  color: var(--bt-text);

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.14em;
  line-height: 1.45;
}

.bt-hero__message {
  max-width: 295px;
  margin: 24px auto 20px;

  color: rgba(92, 70, 54, 0.8);

  font-size: 14px;
  font-style: italic;

  line-height: 1.5;
}

.bt-hero__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: var(--bt-clay);
}

.bt-hero__footer span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(156, 91, 63, 0.7));
}

.bt-hero__footer span:last-child {
  transform: scaleX(-1);
}

.bt-hero__footer b {
  font-family: "Allura", cursive;
  font-size: 20px;
  font-weight: 400;

  letter-spacing: 0.1em;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes bt-hero-sun-spin {
  to {
    transform: translateX(-50%) rotate(360deg);
  }
}

@keyframes bt-hero-sway {
  0%,
  100% {
    transform: rotate(-10deg);
  }

  50% {
    transform: rotate(12deg);
  }
}

@keyframes bt-hero-fade-up {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .bt-hero__content {
    padding: 48px 20px 38px;
  }

  .bt-hero__frame {
    min-height: 640px;
  }

  .bt-hero h1 {
    font-size: 42px;
  }

  .bt-hero__guest {
    font-size: 26px;
  }

  .bt-hero__intro {
    font-size: 11px;
  }

  .bt-hero__sun {
    width: 110px;
    height: 110px;
  }

  .bt-hero__sun-core {
    inset: 31px;
  }

  .bt-hero__ray {
    height: 48px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .bt-hero__content,
  .bt-hero__pampas,
  .bt-hero__sun {
    animation: none;
  }
}
</style>
