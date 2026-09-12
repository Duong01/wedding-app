<template>
  <section class="sp-hero">
    <!-- Decorative arch frame -->
    <div class="sp-hero__frame">
      <div class="sp-hero__frame-inner"></div>

      <!-- Corner blooms -->
      <span class="sp-bloom sp-bloom--tl">❁</span>
      <span class="sp-bloom sp-bloom--tr">❁</span>
      <span class="sp-bloom sp-bloom--bl">❁</span>
      <span class="sp-bloom sp-bloom--br">❁</span>

      <div class="sp-hero__content">
        <p class="sp-hero__save-date">SAVE THE DATE</p>

        <div class="sp-hero__motif">
          <span></span>
          <i>✧</i>
          <span></span>
        </div>

        <h1>
          {{ groomName }}
          <i>&amp;</i>
          {{ brideName }}
        </h1>

        <p class="sp-hero__announce">TRÂN TRỌNG KÍNH MỜI</p>

        <p class="sp-hero__guest">{{ guestName }}</p>

        <p class="sp-hero__intro">
          Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại
        </p>

        <p class="sp-hero__place">{{ location }}</p>

        <div class="sp-hero__schedule">
          <p>VÀO LÚC {{ time }}</p>
          <p>{{ dateText }}</p>
        </div>

        <p class="sp-hero__message">
          Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!
        </p>

        <div class="sp-hero__footer">
          <span></span>
          <b>{{ monogram }}</b>
          <span></span>
        </div>
      </div>
    </div>

    <!-- Floating petals -->
    <div class="sp-petals" aria-hidden="true">
      <span v-for="n in 8" :key="n" class="sp-petal" :class="`sp-petal--${n}`">❁</span>
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
.sp-hero {
  --sp-deep: #7a4a3d;
  --sp-coral: #d67a63;
  --sp-peach: #f4c6a9;
  --sp-gold: #e0a37e;
  --sp-cream: #fffaf5;

  position: relative;
  isolation: isolate;
  overflow: hidden;

  padding: 14px;

  min-height: 690px;

  background:
    radial-gradient(ellipse at 50% 0%, rgba(255, 244, 232, 0.95), transparent 55%),
    linear-gradient(180deg, #fff6ec 0%, #fdeee4 100%);
}

/* =========================================================
   FRAME
========================================================= */

.sp-hero__frame {
  position: relative;

  min-height: 662px;

  display: grid;
  place-items: center;

  border: 1px solid rgba(224, 163, 126, 0.55);
  border-radius: 210px 210px 24px 24px;

  background: linear-gradient(175deg, rgba(255, 253, 250, 0.6), rgba(255, 242, 232, 0.35));

  box-shadow: 0 22px 55px rgba(122, 74, 61, 0.1);
}

.sp-hero__frame-inner {
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(224, 163, 126, 0.28);
  border-radius: 202px 202px 18px 18px;

  pointer-events: none;
}

/* =========================================================
   BLOOMS
========================================================= */

.sp-bloom {
  position: absolute;
  z-index: 3;

  color: var(--sp-coral);

  font-size: 20px;

  opacity: 0.75;

  animation: sp-bloom-sway 5s ease-in-out infinite;
}

.sp-bloom--tl { top: 26px; left: 30px; }
.sp-bloom--tr { top: 26px; right: 30px; animation-delay: -1.4s; }
.sp-bloom--bl { bottom: 26px; left: 30px; animation-delay: -2.6s; }
.sp-bloom--br { bottom: 26px; right: 30px; animation-delay: -3.8s; }

/* =========================================================
   CONTENT
========================================================= */

.sp-hero__content {
  position: relative;
  z-index: 2;

  width: min(100%, 440px);

  padding: 62px 28px 48px;

  text-align: center;

  animation: sp-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.sp-hero__save-date {
  margin: 0;

  color: var(--sp-gold);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.sp-hero__motif {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin: 12px auto;
}

.sp-hero__motif span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(224, 163, 126, 0.8));
}

.sp-hero__motif span:last-child {
  transform: scaleX(-1);
}

.sp-hero__motif i {
  color: var(--sp-coral);

  font-size: 15px;
  font-style: normal;
}

.sp-hero h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(40px, 10vw, 58px);
  font-weight: 400;

  line-height: 1.12;

  color: var(--sp-deep);
}

.sp-hero h1 i {
  padding: 0 6px;

  color: var(--sp-coral);

  font-family: Georgia, serif;
  font-size: 0.5em;
  font-style: normal;
}

.sp-hero__announce {
  margin: 28px 0 8px;

  color: var(--sp-coral);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.sp-hero__guest {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: 30px;

  color: var(--sp-deep);
}

.sp-hero__intro {
  max-width: 325px;
  margin: 14px auto 8px;

  color: rgba(122, 74, 61, 0.85);

  font-size: 12px;

  letter-spacing: 0.1em;
  line-height: 1.55;
}

.sp-hero__place {
  max-width: 350px;
  margin: 0 auto;

  color: var(--sp-deep);

  font-size: 16px;
  font-weight: 700;

  letter-spacing: 0.06em;
  line-height: 1.4;
}

.sp-hero__schedule {
  margin: 24px auto 0;
  padding: 14px 0;

  border-top: 1px solid rgba(244, 198, 169, 0.75);
  border-bottom: 1px solid rgba(244, 198, 169, 0.75);
}

.sp-hero__schedule p {
  margin: 4px 0;

  color: var(--sp-deep);

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.14em;
  line-height: 1.45;
}

.sp-hero__message {
  max-width: 295px;
  margin: 24px auto 20px;

  color: rgba(122, 74, 61, 0.8);

  font-size: 14px;
  font-style: italic;

  line-height: 1.5;
}

.sp-hero__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: var(--sp-coral);
}

.sp-hero__footer span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(224, 163, 126, 0.7));
}

.sp-hero__footer span:last-child {
  transform: scaleX(-1);
}

.sp-hero__footer b {
  font-family: "Allura", cursive;
  font-size: 20px;
  font-weight: 400;

  letter-spacing: 0.1em;
}

/* =========================================================
   PETALS
========================================================= */

.sp-petals {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.sp-petal {
  position: absolute;
  top: -30px;

  color: rgba(214, 122, 99, 0.4);

  font-size: 13px;

  animation: sp-petal-fall linear infinite;
}

.sp-petal--1 { left: 8%; animation-duration: 12s; animation-delay: 0s; }
.sp-petal--2 { left: 22%; animation-duration: 15s; animation-delay: 3s; font-size: 10px; }
.sp-petal--3 { left: 36%; animation-duration: 13s; animation-delay: 1.5s; }
.sp-petal--4 { left: 50%; animation-duration: 16s; animation-delay: 5s; font-size: 9px; }
.sp-petal--5 { left: 63%; animation-duration: 12.5s; animation-delay: 2s; }
.sp-petal--6 { left: 76%; animation-duration: 14.5s; animation-delay: 4.2s; font-size: 11px; }
.sp-petal--7 { left: 87%; animation-duration: 13.5s; animation-delay: 0.8s; }
.sp-petal--8 { left: 95%; animation-duration: 15.5s; animation-delay: 6s; font-size: 9px; }

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes sp-fade-up {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes sp-bloom-sway {
  0%,
  100% {
    transform: rotate(-8deg) scale(1);
  }

  50% {
    transform: rotate(10deg) scale(1.12);
  }
}

@keyframes sp-petal-fall {
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
  .sp-hero__content {
    padding: 48px 20px 38px;
  }

  .sp-hero__frame {
    min-height: 640px;
  }

  .sp-hero h1 {
    font-size: 42px;
  }

  .sp-hero__guest {
    font-size: 26px;
  }

  .sp-hero__intro {
    font-size: 11px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .sp-hero__content,
  .sp-bloom,
  .sp-petal {
    animation: none;
  }
}
</style>
