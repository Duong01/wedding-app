<template>
  <section class="el-hero">
    <!-- Gold arch glow behind the frame -->
    <div class="el-hero__glow" aria-hidden="true"></div>

    <!-- Botanical strokes at the sides -->
    <span class="el-hero__leaf el-hero__leaf--left">❦</span>
    <span class="el-hero__leaf el-hero__leaf--right">❦</span>

    <!-- Arch photo frame -->
    <div class="el-hero__frame">
      <div class="el-hero__frame-inner"></div>

      <div class="el-hero__photo">
        <img v-if="heroImage" :src="heroImage" alt="Ảnh cưới" draggable="false" />

        <div v-else class="el-hero__photo-fallback"></div>
      </div>

      <div class="el-hero__content">
        <p class="el-hero__save-date">{{ heroTitle }}</p>

        <div class="el-hero__motif">
          <span></span>
          <i>❦</i>
          <span></span>
        </div>

        <h1>
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </h1>

        <p class="el-hero__announce">{{ heroSubtitle }}</p>

        <p class="el-hero__guest">{{ guestName }}</p>

        <p class="el-hero__intro">
          Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại
        </p>

        <p class="el-hero__place">{{ location }}</p>

        <div class="el-hero__schedule">
          <p>VÀO LÚC {{ time }}</p>
          <p>{{ dateText }}</p>
        </div>

        <p class="el-hero__message">
          Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!
        </p>

        <div class="el-hero__footer">
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
.el-hero {
  --el-emerald: #123b2e;
  --el-emerald-deep: #0c2b21;
  --el-gold: #c9a45c;
  --el-gold-light: #e8d3a2;
  --el-cream: #f7f1e3;
  --el-text: #2e3d36;

  position: relative;
  isolation: isolate;
  overflow: hidden;

  padding: 14px;

  min-height: 690px;

  background:
    radial-gradient(ellipse at 50% 0%, rgba(201, 164, 92, 0.14), transparent 55%),
    linear-gradient(180deg, #f2ecdc 0%, #e5ddc6 100%);
}

/* =========================================================
   GOLD GLOW BEHIND THE ARCH
========================================================= */

.el-hero__glow {
  position: absolute;
  z-index: 0;

  top: 30px;
  left: 50%;

  width: 320px;
  height: 320px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: radial-gradient(circle, rgba(201, 164, 92, 0.35), transparent 68%);

  filter: blur(12px);

  pointer-events: none;

  animation: el-hero-breathe 5s ease-in-out infinite;
}

/* =========================================================
   BOTANICAL STROKES
========================================================= */

.el-hero__leaf {
  position: absolute;
  z-index: 1;

  color: rgba(18, 59, 46, 0.28);

  font-size: 30px;

  pointer-events: none;

  transform-origin: bottom center;

  animation: el-hero-sway 6.5s ease-in-out infinite;
}

.el-hero__leaf--left {
  top: 46%;
  left: 12px;
}

.el-hero__leaf--right {
  top: 52%;
  right: 14px;

  font-size: 24px;

  animation-delay: -2.4s;
}

/* =========================================================
   ARCH FRAME
========================================================= */

.el-hero__frame {
  position: relative;
  z-index: 2;

  min-height: 662px;

  display: grid;
  place-items: center;

  border: 1px solid rgba(201, 164, 92, 0.75);
  border-radius: 999px 999px 26px 26px;

  background: linear-gradient(175deg, rgba(247, 241, 227, 0.72), rgba(232, 224, 203, 0.45));

  box-shadow: 0 22px 55px rgba(12, 43, 33, 0.16);

  overflow: hidden;
}

.el-hero__frame-inner {
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(18, 59, 46, 0.3);
  border-radius: 999px 999px 20px 20px;

  pointer-events: none;
}

/* =========================================================
   PHOTO
========================================================= */

.el-hero__photo {
  position: absolute;
  inset: 0;

  z-index: 0;
}

.el-hero__photo img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  opacity: 0.3;

  filter: saturate(0.88);
}

.el-hero__photo-fallback {
  width: 100%;
  height: 100%;

  background:
    radial-gradient(circle at 50% 22%, rgba(201, 164, 92, 0.4), transparent 55%),
    linear-gradient(180deg, #e5ddc6 0%, #cbbf9d 60%, #a89a72 100%);
}

/* =========================================================
   CONTENT
========================================================= */

.el-hero__content {
  position: relative;
  z-index: 2;

  width: min(100%, 440px);

  padding: 62px 28px 48px;

  text-align: center;

  animation: el-hero-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.el-hero__save-date {
  margin: 0;

  color: #8a7a52;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.el-hero__motif {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin: 12px auto;
}

.el-hero__motif span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 164, 92, 0.85));
}

.el-hero__motif span:last-child {
  transform: scaleX(-1);
}

.el-hero__motif i {
  color: var(--el-gold);

  font-size: 15px;
  font-style: normal;
}

.el-hero h1 {
  margin: 0;

  font-family: "Great Vibes", cursive;

  font-size: clamp(40px, 10vw, 58px);
  font-weight: 400;

  line-height: 1.12;

  color: var(--el-emerald);
}

.el-hero h1 i {
  padding: 0 6px;

  color: var(--el-gold);

  font-family: Georgia, serif;
  font-size: 0.5em;
  font-style: normal;
}

.el-hero__announce {
  margin: 28px 0 8px;

  color: #8a7a52;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.el-hero__guest {
  margin: 0;

  font-family: "Great Vibes", cursive;

  font-size: 30px;

  color: var(--el-text);
}

.el-hero__intro {
  max-width: 325px;
  margin: 14px auto 8px;

  color: rgba(46, 61, 54, 0.85);

  font-size: 12px;

  letter-spacing: 0.1em;
  line-height: 1.55;
}

.el-hero__place {
  max-width: 350px;
  margin: 0 auto;

  color: var(--el-emerald);

  font-size: 16px;
  font-weight: 700;

  letter-spacing: 0.06em;
  line-height: 1.4;
}

.el-hero__schedule {
  margin: 24px auto 0;
  padding: 14px 0;

  border-top: 1px solid rgba(201, 164, 92, 0.55);
  border-bottom: 1px solid rgba(201, 164, 92, 0.55);
}

.el-hero__schedule p {
  margin: 4px 0;

  color: var(--el-text);

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.14em;
  line-height: 1.45;
}

.el-hero__message {
  max-width: 295px;
  margin: 24px auto 20px;

  color: rgba(46, 61, 54, 0.8);

  font-size: 14px;
  font-style: italic;

  line-height: 1.5;
}

.el-hero__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: var(--el-gold);
}

.el-hero__footer span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 164, 92, 0.8));
}

.el-hero__footer span:last-child {
  transform: scaleX(-1);
}

.el-hero__footer b {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 16px;
  font-weight: 600;

  letter-spacing: 0.14em;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes el-hero-breathe {
  0%,
  100% {
    opacity: 0.7;
    transform: translateX(-50%) scale(0.95);
  }

  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.06);
  }
}

@keyframes el-hero-sway {
  0%,
  100% {
    transform: rotate(-10deg);
  }

  50% {
    transform: rotate(12deg);
  }
}

@keyframes el-hero-fade-up {
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
  .el-hero__content {
    padding: 48px 20px 38px;
  }

  .el-hero__frame {
    min-height: 640px;
  }

  .el-hero h1 {
    font-size: 42px;
  }

  .el-hero__guest {
    font-size: 26px;
  }

  .el-hero__intro {
    font-size: 11px;
  }

  .el-hero__glow {
    width: 240px;
    height: 240px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .el-hero__content,
  .el-hero__leaf,
  .el-hero__glow {
    animation: none;
  }
}
</style>
