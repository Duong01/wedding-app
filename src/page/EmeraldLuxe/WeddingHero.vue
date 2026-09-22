<template>
  <section class="cr-hero">
    <img
      :src="decorativeHeader"
      alt=""
      aria-hidden="true"
      class="cr-hero__header"
      draggable="false"
    />

    <img
      :src="decorativeDragon"
      alt=""
      aria-hidden="true"
      class="cr-hero__dragon cr-hero__dragon--left"
      draggable="false"
    />

    <img
      :src="decorativeDragon"
      alt=""
      aria-hidden="true"
      class="cr-hero__dragon cr-hero__dragon--right"
      draggable="false"
    />

    <div class="cr-hero__inner">
      <p class="cr-hero__kicker">{{ heroTitle }}</p>

      <div class="cr-hero__ornament" aria-hidden="true">
        <span></span>
        <i>❀</i>
        <span></span>
      </div>

      <h1 class="cr-hero__names">
        <span>{{ groomName }}</span>
        <i>&amp;</i>
        <span>{{ brideName }}</span>
      </h1>

      <p class="cr-hero__subtitle">{{ heroSubtitle }}</p>

      <!-- ẢNH ĐÔI UYÊN ƯƠNG -->
      <figure class="cr-hero__photo">
        <img v-if="heroImage" :src="heroImage" alt="Ảnh cưới" draggable="false" />

        <img
          v-else
          :src="coupleMain"
          alt="Ảnh cưới"
          draggable="false"
        />

        <img
          :src="decorativeFlowers"
          alt=""
          aria-hidden="true"
          class="cr-hero__flowers"
          draggable="false"
        />
      </figure>

      <p class="cr-hero__guest-label">TRÂN TRỌNG KÍNH MỜI</p>

      <p class="cr-hero__guest">{{ guestName }}</p>

      <p class="cr-hero__intro">
        Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại
      </p>

      <p class="cr-hero__place">{{ location }}</p>

      <div class="cr-hero__schedule">
        <p v-if="time">VÀO LÚC {{ time }}</p>
        <p v-if="dateText">{{ dateText }}</p>
      </div>

      <p class="cr-hero__message">
        Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!
      </p>

      <div class="cr-hero__footer" aria-hidden="true">
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

import {
  coupleMain,
  decorativeDragon,
  decorativeFlowers,
  decorativeHeader,
} from "./emeraldLuxeAssets";

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  event: { type: Object, default: () => ({}) },
  guestName: { type: String, default: "Quý khách" },
  monogram: { type: String, default: "囍" },
  dateLabel: { type: String, default: "" },
});

const heroTitle = computed(() => props.wedding?.hero?.Title || "SAVE THE DATE");

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
    const weekdays = [
      "CHỦ NHẬT",
      "THỨ HAI",
      "THỨ BA",
      "THỨ TƯ",
      "THỨ NĂM",
      "THỨ SÁU",
      "THỨ BẢY",
    ];

    return `${weekdays[date.day()]}, NGÀY ${date.format("DD/MM/YYYY")}`;
  }

  return props.dateLabel || "";
});
</script>

<style scoped>
.cr-hero {
  position: relative;
  isolation: isolate;

  padding: 0 0 8px;

  overflow: hidden;

  text-align: center;

  color: var(--cr-ink);
}

/* =========================================================
   HOẠ TIẾT NỀN
========================================================= */

.cr-hero__header {
  position: absolute;

  top: -6px;
  left: 50%;

  z-index: -4;

  width: min(100%, 460px);

  transform: translateX(-50%);

  object-fit: contain;

  opacity: 0.85;

  pointer-events: none;
}

.cr-hero__dragon {
  position: absolute;

  z-index: -2;

  width: 150px;
  height: 150px;

  object-fit: contain;

  opacity: 0.16;

  pointer-events: none;
}

.cr-hero__dragon--left {
  top: 34%;
  left: -46px;
}

.cr-hero__dragon--right {
  top: 58%;
  right: -46px;

  transform: scaleX(-1);
}

/* =========================================================
   NỘI DUNG
========================================================= */

.cr-hero__inner {
  position: relative;
  z-index: 2;

  padding: 96px 0 0;
}

.cr-hero__kicker {
  margin: 0;

  color: var(--cr-muted);

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.36em;
  text-indent: 0.36em;

  text-transform: uppercase;
}

.cr-hero__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 12px auto 10px;

  color: var(--cr-accent);
}

.cr-hero__ornament span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--cr-accent-rgb), 1));
}

.cr-hero__ornament span:last-child {
  transform: rotate(180deg);
}

.cr-hero__ornament i {
  font-size: 13px;
  font-style: normal;
}

.cr-hero__names {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  margin: 0;

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: clamp(30px, 8.5vw, 44px);
  font-weight: 400;

  line-height: 1.15;

  letter-spacing: 0.03em;

  color: var(--cr-ink);
}

.cr-hero__names i {
  color: var(--cr-accent);

  font-family: Georgia, serif;
  font-size: 0.55em;
  font-style: italic;
}

.cr-hero__subtitle {
  margin: 10px 0 0;

  color: var(--cr-soft);

  font-size: 12px;

  letter-spacing: 0.14em;
}

/* =========================================================
   ẢNH
========================================================= */

.cr-hero__photo {
  position: relative;

  width: min(100%, 380px);

  margin: 22px auto 0;

  padding: 8px;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.22);
  border-radius: 16px;

  background: rgba(var(--cr-surface-rgb), 0.9);

  box-shadow: 0 16px 38px rgba(var(--cr-ink-rgb), 0.12);
}

.cr-hero__photo > img:first-child {
  display: block;

  width: 100%;
  aspect-ratio: 3 / 4;

  object-fit: cover;

  border-radius: 10px;
}

.cr-hero__flowers {
  position: absolute;

  right: -26px;
  bottom: -22px;

  width: 110px;
  height: 110px;

  object-fit: contain;

  pointer-events: none;
}

/* =========================================================
   KHÁCH MỜI
========================================================= */

.cr-hero__guest-label {
  margin: 26px 0 2px;

  color: var(--cr-muted);

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.cr-hero__guest {
  margin: 0;

  font-family: "Babylonica", "Great Vibes", cursive;

  font-size: clamp(32px, 9vw, 42px);
  font-weight: 400;

  line-height: 1.25;

  color: var(--cr-ink);
}

.cr-hero__intro {
  max-width: 320px;
  margin: 14px auto 6px;

  color: var(--cr-soft);

  font-size: 12px;

  line-height: 1.6;
}

.cr-hero__place {
  max-width: 340px;
  margin: 0 auto;

  color: var(--cr-ink);

  font-size: 15px;
  font-weight: 600;

  line-height: 1.45;
}

.cr-hero__schedule {
  margin: 20px auto 0;
  padding: 12px 0;

  border-top: 1px solid rgba(var(--cr-accent-rgb), 0.9);
  border-bottom: 1px solid rgba(var(--cr-accent-rgb), 0.9);
}

.cr-hero__schedule p {
  margin: 3px 0;

  color: var(--cr-ink);

  font-size: 12px;
  font-weight: 600;

  letter-spacing: 0.12em;
  line-height: 1.5;
}

.cr-hero__message {
  max-width: 300px;
  margin: 20px auto 18px;

  color: var(--cr-soft);

  font-size: 13px;
  font-style: italic;

  line-height: 1.6;
}

.cr-hero__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: var(--cr-muted);
}

.cr-hero__footer span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--cr-accent-rgb), 1));
}

.cr-hero__footer span:last-child {
  transform: rotate(180deg);
}

.cr-hero__footer b {
  font-family: "Viaoda Libre", "Playfair Display", serif;
  font-size: 15px;
  font-weight: 400;

  letter-spacing: 0.14em;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .cr-hero__inner {
    padding-top: 120px;
  }

  .cr-hero__header {
    width: min(100%, 620px);
  }

  .cr-hero__dragon {
    width: 220px;
    height: 220px;
  }

  .cr-hero__dragon--left {
    left: -60px;
  }

  .cr-hero__dragon--right {
    right: -60px;
  }

  .cr-hero__photo {
    width: min(100%, 460px);
  }

  .cr-hero__flowers {
    width: 140px;
    height: 140px;
  }
}

/* =========================================================
   MOBILE NHỎ
========================================================= */

@media (max-width: 380px) {
  .cr-hero__inner {
    padding-top: 84px;
  }

  .cr-hero__flowers {
    right: -14px;

    width: 88px;
    height: 88px;
  }
}
</style>
