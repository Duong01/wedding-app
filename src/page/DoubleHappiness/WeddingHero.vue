<template>
  <section class="dh-hero">
    <!-- Hanging lanterns -->
    <div class="dh-hero__lanterns" aria-hidden="true">
      <div class="dh-lantern dh-lantern--left">
        <span class="dh-lantern__string"></span>
        <span class="dh-lantern__cap"></span>
        <span class="dh-lantern__body"></span>
        <span class="dh-lantern__cap dh-lantern__cap--bottom"></span>
        <span class="dh-lantern__tassel"></span>
      </div>

      <div class="dh-lantern dh-lantern--right">
        <span class="dh-lantern__string"></span>
        <span class="dh-lantern__cap"></span>
        <span class="dh-lantern__body"></span>
        <span class="dh-lantern__cap dh-lantern__cap--bottom"></span>
        <span class="dh-lantern__tassel"></span>
      </div>
    </div>

    <!-- Falling gold petals / confetti -->
    <div class="dh-petals" aria-hidden="true">
      <span v-for="n in 9" :key="n" class="dh-petal" :class="`dh-petal--${n}`">❖</span>
    </div>

    <div class="dh-hero__content">
      <p class="dh-hero__save-date">SAVE THE DATE</p>

      <!-- 囍 centerpiece -->
      <div class="dh-hero__xi" aria-hidden="true">囍</div>

      <h1>
        {{ groomName }}
        <i>&amp;</i>
        {{ brideName }}
      </h1>

      <p class="dh-hero__announce">TRÂN TRỌNG KÍNH MỜI</p>

      <p class="dh-hero__guest">{{ guestName }}</p>

      <p class="dh-hero__intro">
        Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại
      </p>

      <p class="dh-hero__place">{{ location }}</p>

      <div class="dh-hero__schedule">
        <p>VÀO LÚC {{ time }}</p>
        <p>{{ dateText }}</p>
      </div>

      <p class="dh-hero__message">
        Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!
      </p>

      <div class="dh-hero__footer">
        <span></span>
        <b>{{ monogram }}</b>
        <span></span>
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
.dh-hero {
  --dh-red: #7a1216;
  --dh-red-bright: #a32a2a;
  --dh-red-dark: #5c0e10;
  --dh-gold: #d9a441;
  --dh-gold-light: #f3d9a4;
  --dh-cream: #fdf6ec;
  --dh-cream-on-red: #f7e6c4;

  position: relative;
  isolation: isolate;
  overflow: hidden;

  padding: 14px;

  min-height: 690px;

  display: grid;
  place-items: center;

  background:
    radial-gradient(ellipse at 50% 0%, rgba(243, 217, 164, 0.14), transparent 55%),
    linear-gradient(180deg, #8f1a1e 0%, var(--dh-red) 52%, var(--dh-red-dark) 100%);
}

/* Subtle repeating pattern */
.dh-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;

  opacity: 0.5;

  background-image:
    repeating-linear-gradient(45deg, rgba(243, 217, 164, 0.05) 0 1px, transparent 1px 18px),
    repeating-linear-gradient(-45deg, rgba(243, 217, 164, 0.05) 0 1px, transparent 1px 18px);

  pointer-events: none;
}

/* =========================================================
   LANTERNS
========================================================= */

.dh-hero__lanterns {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.dh-lantern {
  position: absolute;
  top: 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  transform-origin: top center;

  animation: dh-lantern-sway 5.5s ease-in-out infinite;
}

.dh-lantern--left {
  left: 8%;
}

.dh-lantern--right {
  right: 8%;

  animation-delay: -2.6s;
}

.dh-lantern__string {
  width: 1px;
  height: 38px;

  background: linear-gradient(180deg, rgba(217, 164, 65, 0.12), rgba(217, 164, 65, 0.8));
}

.dh-lantern__cap {
  width: 32px;
  height: 6px;

  border-radius: 3px 3px 1px 1px;

  background: linear-gradient(180deg, var(--dh-gold-light), var(--dh-gold));
}

.dh-lantern__cap--bottom {
  width: 20px;
  height: 5px;

  border-radius: 1px 1px 3px 3px;
}

.dh-lantern__body {
  position: relative;

  width: 52px;
  height: 66px;

  border-radius: 22px / 26px;

  background:
    repeating-linear-gradient(90deg, rgba(243, 217, 164, 0.16) 0 2px, transparent 2px 11px),
    radial-gradient(circle at 35% 28%, #c23a35, var(--dh-red-bright) 55%, var(--dh-red) 100%);

  box-shadow:
    inset 0 0 0 2px rgba(243, 217, 164, 0.28),
    0 12px 26px rgba(40, 6, 8, 0.45);
}

.dh-lantern__body::after {
  content: "囍";

  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  color: rgba(243, 217, 164, 0.85);

  font-size: 18px;
}

.dh-lantern__tassel {
  width: 2px;
  height: 22px;

  background: linear-gradient(180deg, var(--dh-gold), rgba(217, 164, 65, 0.15));
}

/* =========================================================
   PETALS
========================================================= */

.dh-petals {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.dh-petal {
  position: absolute;
  top: -30px;

  color: rgba(243, 217, 164, 0.5);

  font-size: 12px;

  animation: dh-petal-fall linear infinite;
}

.dh-petal--1 { left: 8%; animation-duration: 12s; animation-delay: 0s; }
.dh-petal--2 { left: 20%; animation-duration: 15s; animation-delay: 3s; font-size: 9px; }
.dh-petal--3 { left: 32%; animation-duration: 13s; animation-delay: 1.5s; }
.dh-petal--4 { left: 44%; animation-duration: 16s; animation-delay: 5s; font-size: 8px; }
.dh-petal--5 { left: 56%; animation-duration: 12.5s; animation-delay: 2s; }
.dh-petal--6 { left: 68%; animation-duration: 14.5s; animation-delay: 4.2s; font-size: 10px; }
.dh-petal--7 { left: 80%; animation-duration: 13.5s; animation-delay: 0.8s; }
.dh-petal--8 { left: 90%; animation-duration: 15.5s; animation-delay: 6s; font-size: 9px; }
.dh-petal--9 { left: 96%; animation-duration: 14s; animation-delay: 2.6s; font-size: 8px; }

/* =========================================================
   CONTENT
========================================================= */

.dh-hero__content {
  position: relative;
  z-index: 2;

  width: min(100%, 440px);

  padding: 56px 28px 44px;

  text-align: center;

  animation: dh-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.dh-hero__save-date {
  margin: 0;

  color: var(--dh-gold-light);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

/* 囍 centerpiece */
.dh-hero__xi {
  margin: 14px auto 10px;

  width: 74px;
  height: 74px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--dh-gold);

  font-size: 46px;
  line-height: 1;

  border: 1px solid rgba(217, 164, 65, 0.6);
  border-radius: 50%;

  background: radial-gradient(circle at 50% 32%, rgba(243, 217, 164, 0.2), transparent 70%);

  box-shadow:
    0 0 0 5px rgba(217, 164, 65, 0.12),
    0 10px 26px rgba(30, 4, 6, 0.35);

  text-shadow: 0 2px 10px rgba(243, 217, 164, 0.35);

  animation: dh-xi-glow 4s ease-in-out infinite;
}

.dh-hero h1 {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: clamp(40px, 10vw, 58px);
  font-weight: 400;

  line-height: 1.12;

  color: var(--dh-cream-on-red);
}

.dh-hero h1 i {
  padding: 0 6px;

  color: var(--dh-gold);

  font-family: Georgia, serif;
  font-size: 0.5em;
  font-style: normal;
}

.dh-hero__announce {
  margin: 28px 0 8px;

  color: var(--dh-gold-light);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.dh-hero__guest {
  margin: 0;

  font-family: "Allura", cursive;

  font-size: 30px;

  color: var(--dh-gold);
}

.dh-hero__intro {
  max-width: 325px;
  margin: 14px auto 8px;

  color: rgba(247, 230, 196, 0.85);

  font-size: 12px;

  letter-spacing: 0.1em;
  line-height: 1.55;
}

.dh-hero__place {
  max-width: 350px;
  margin: 0 auto;

  color: var(--dh-cream-on-red);

  font-size: 16px;
  font-weight: 700;

  letter-spacing: 0.06em;
  line-height: 1.4;
}

.dh-hero__schedule {
  margin: 24px auto 0;
  padding: 14px 0;

  border-top: 1px solid rgba(217, 164, 65, 0.5);
  border-bottom: 1px solid rgba(217, 164, 65, 0.5);
}

.dh-hero__schedule p {
  margin: 4px 0;

  color: var(--dh-cream-on-red);

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.14em;
  line-height: 1.45;
}

.dh-hero__message {
  max-width: 295px;
  margin: 24px auto 20px;

  color: rgba(247, 230, 196, 0.8);

  font-size: 14px;
  font-style: italic;

  line-height: 1.5;
}

.dh-hero__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: var(--dh-gold);
}

.dh-hero__footer span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(217, 164, 65, 0.8));
}

.dh-hero__footer span:last-child {
  transform: scaleX(-1);
}

.dh-hero__footer b {
  font-family: "Allura", cursive;
  font-size: 20px;
  font-weight: 400;

  letter-spacing: 0.1em;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes dh-fade-up {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes dh-lantern-sway {
  0%,
  100% {
    transform: rotate(-4deg);
  }

  50% {
    transform: rotate(4deg);
  }
}

@keyframes dh-petal-fall {
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

@keyframes dh-xi-glow {
  0%,
  100% {
    box-shadow:
      0 0 0 5px rgba(217, 164, 65, 0.12),
      0 10px 26px rgba(30, 4, 6, 0.35);
  }

  50% {
    box-shadow:
      0 0 0 8px rgba(217, 164, 65, 0.2),
      0 12px 30px rgba(30, 4, 6, 0.45);
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .dh-hero__content {
    padding: 48px 20px 38px;
  }

  .dh-hero h1 {
    font-size: 42px;
  }

  .dh-hero__guest {
    font-size: 26px;
  }

  .dh-hero__intro {
    font-size: 11px;
  }

  .dh-lantern--left {
    left: 3%;
  }

  .dh-lantern--right {
    right: 3%;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .dh-hero__content,
  .dh-lantern,
  .dh-petal,
  .dh-hero__xi {
    animation: none;
  }
}
</style>
