<template>
  <section class="bq-hero">
    <img
      :src="flower5"
      alt=""
      aria-hidden="true"
      class="bq-hero__flower bq-hero__flower--left"
      draggable="false"
    />

    <img
      :src="flower5"
      alt=""
      aria-hidden="true"
      class="bq-hero__flower bq-hero__flower--right"
      draggable="false"
    />

    <div class="bq-hero__inner">
      <p class="bq-hero__kicker">{{ heroTitle }}</p>

      <!-- KHUNG ẢNH BAROQUE -->
      <div class="bq-hero__frame">
        <div class="bq-hero__photo">
          <img v-if="heroImage" :src="heroImage" alt="Ảnh cưới" draggable="false" />

          <span v-else class="bq-hero__photo-empty" aria-hidden="true">❦</span>
        </div>

        <img
          :src="frame"
          alt=""
          aria-hidden="true"
          class="bq-hero__frame-img"
          draggable="false"
        />
      </div>

      <!-- TÊN CÔ DÂU CHÚ RỂ -->
      <div class="bq-hero__names">
        <span class="bq-hero__amp" aria-hidden="true">&amp;</span>

        <span class="bq-hero__name">{{ groomName }}</span>

        <span class="bq-hero__name">{{ brideName }}</span>
      </div>

      <img
        :src="goldenLine"
        alt=""
        aria-hidden="true"
        class="bq-hero__line"
        draggable="false"
      />

      <p class="bq-hero__guest-label">TRÂN TRỌNG KÍNH MỜI</p>

      <p class="bq-hero__guest">{{ guestName }}</p>

      <p class="bq-hero__intro">
        Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại
      </p>

      <p class="bq-hero__place">{{ location }}</p>

      <div class="bq-hero__schedule">
        <p v-if="time">VÀO LÚC {{ time }}</p>
        <p v-if="dateText">{{ dateText }}</p>
      </div>

      <p class="bq-hero__message">
        Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!
      </p>

      <div class="bq-hero__footer" aria-hidden="true">
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

import { flower5, frame, goldenLine } from "./bohoTerracottaAssets";

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  event: { type: Object, default: () => ({}) },
  guestName: { type: String, default: "Quý khách" },
  monogram: { type: String, default: "&" },
  dateLabel: { type: String, default: "" },
});

const heroTitle = computed(() => props.wedding?.hero?.Title || "SAVE THE DATE");

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
.bq-hero {
  position: relative;
  isolation: isolate;

  width: 100%;

  padding: 0 0 8px;

  overflow: hidden;

  text-align: center;

  color: var(--bq-ink);
}

/* =========================================================
   HOA VĂN HAI BÊN
========================================================= */

.bq-hero__flower {
  position: absolute;

  z-index: 1;

  width: 32%;
  max-width: none;
  height: auto;

  object-fit: contain;

  pointer-events: none;

  filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.25));
}

.bq-hero__flower--left {
  top: 30%;
  left: -19%;
}

.bq-hero__flower--right {
  top: 30%;
  right: -19%;

  transform: scaleX(-1);
}

/* =========================================================
   NỘI DUNG
========================================================= */

.bq-hero__inner {
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 47px 0 27px;
}

.bq-hero__kicker {
  margin: 0;

  color: var(--bq-accent);

  font-family: "Playfair Display", "Times New Roman", serif;
  font-size: 13px;
  font-weight: 600;

  letter-spacing: 0.14em;
  text-indent: 0.14em;

  text-transform: uppercase;
}

/* =========================================================
   KHUNG ẢNH
========================================================= */

.bq-hero__frame {
  position: relative;

  width: 126.5%;

  margin: 30px 0 0 -13.25%;

  aspect-ratio: 1237 / 1254;
}

.bq-hero__photo {
  position: absolute;

  left: 25.8%;
  top: 11%;

  width: 47.6%;
  height: 76.5%;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  background: rgba(var(--bq-deep-rgb), 0.6);

  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
}

.bq-hero__photo img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.bq-hero__photo-empty {
  color: var(--bq-accent);

  font-size: 30px;

  opacity: 0.5;
}

.bq-hero__frame-img {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: fill;

  pointer-events: none;
}

/* =========================================================
   TÊN
========================================================= */

.bq-hero__names {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  width: 100%;
  max-width: 340px;

  margin-top: 42px;
}

.bq-hero__amp {
  position: absolute;

  top: 50%;
  left: 50%;

  transform: translate(-50%, calc(-50% - 0.16em));

  color: rgba(var(--bq-ink-rgb), 0.2);

  font-family: "The Nautigal", cursive;
  font-size: 100px;
  line-height: 1;

  pointer-events: none;
}

.bq-hero__name {
  position: relative;
  z-index: 1;

  color: var(--bq-accent);

  font-family: "Viaoda Libre", "EB Garamond", serif;
  font-size: clamp(30px, 9vw, 40px);
  font-weight: 400;

  line-height: 1.1;

  text-transform: uppercase;
  white-space: nowrap;
}

.bq-hero__line {
  display: block;

  width: 74.5%;
  max-width: 309px;

  margin: 22px auto 0;

  object-fit: contain;

  filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.25));
}

/* =========================================================
   KHÁCH MỜI
========================================================= */

.bq-hero__guest-label {
  margin: 26px 0 2px;

  color: var(--bq-muted);

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.bq-hero__guest {
  margin: 0;

  font-family: "Ms Madi", "The Nautigal", cursive;
  font-size: clamp(32px, 9vw, 42px);
  font-weight: 400;

  line-height: 1.25;

  color: var(--bq-accent);
}

.bq-hero__intro {
  max-width: 320px;
  margin: 14px auto 6px;

  color: var(--bq-soft);

  font-size: 12px;

  line-height: 1.6;
}

.bq-hero__place {
  max-width: 340px;
  margin: 0 auto;

  color: var(--bq-ink);

  font-size: 15px;
  font-weight: 600;

  line-height: 1.45;
}

.bq-hero__schedule {
  margin: 20px auto 0;
  padding: 12px 0;

  border-top: 1px solid var(--bq-line);
  border-bottom: 1px solid var(--bq-line);
}

.bq-hero__schedule p {
  margin: 3px 0;

  color: var(--bq-ink);

  font-size: 12px;
  font-weight: 600;

  letter-spacing: 0.12em;
  line-height: 1.5;
}

.bq-hero__message {
  max-width: 300px;
  margin: 20px auto 18px;

  color: var(--bq-soft);

  font-size: 13px;
  font-style: italic;

  line-height: 1.6;
}

.bq-hero__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: var(--bq-muted);
}

.bq-hero__footer span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--bq-accent-rgb), 1));
}

.bq-hero__footer span:last-child {
  transform: rotate(180deg);
}

.bq-hero__footer b {
  font-family: "Viaoda Libre", "EB Garamond", serif;
  font-size: 15px;
  font-weight: 400;

  letter-spacing: 0.14em;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .bq-hero__inner {
    padding: 58px 0 34px;
  }

  .bq-hero__frame {
    width: 112%;

    margin: 38px 0 0 -6%;
  }

  .bq-hero__names {
    max-width: 440px;

    margin-top: 52px;
  }

  .bq-hero__amp {
    font-size: 118px;
  }

  .bq-hero__name {
    font-size: 45px;
  }

  .bq-hero__line {
    max-width: 420px;
  }

  .bq-hero__flower {
    top: 7%;
  }
}

/* =========================================================
   MOBILE NHỎ
========================================================= */

@media (max-width: 380px) {
  .bq-hero__inner {
    padding-top: 40px;
  }
}
</style>
