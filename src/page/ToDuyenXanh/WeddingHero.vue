<template>
  <section class="tdx-hero">
    <!-- =====================================================
         HOẠ TIẾT NỀN
    ====================================================== -->

    <div class="tdx-hero__decor" aria-hidden="true">
      <img
        :src="lineDecoration"
        alt=""
        class="tdx-decor tdx-decor--line-right"
        draggable="false"
      />

      <img
        :src="flowerDecoration"
        alt=""
        class="tdx-decor tdx-decor--flower-right"
        draggable="false"
      />

      <img
        :src="lineDecoration"
        alt=""
        class="tdx-decor tdx-decor--line-left"
        draggable="false"
      />

      <img
        :src="ribbonDecoration"
        alt=""
        class="tdx-decor tdx-decor--ribbon"
        draggable="false"
      />
    </div>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="tdx-hero__inner">
      <!-- ẢNH ĐÔI NGHIÊNG -->
      <div class="tdx-hero__photos">
        <figure class="tdx-photo tdx-photo--groom">
          <div class="tdx-photo__frame">
            <img
              v-if="groomPhoto"
              :src="groomPhoto"
              :alt="groomName"
              loading="lazy"
              decoding="async"
              draggable="false"
            />

            <span v-else class="tdx-photo__initial">{{ groomName.charAt(0) || "♥" }}</span>
          </div>
        </figure>

        <figure class="tdx-photo tdx-photo--bride">
          <div class="tdx-photo__frame">
            <img
              v-if="bridePhoto"
              :src="bridePhoto"
              :alt="brideName"
              loading="lazy"
              decoding="async"
              draggable="false"
            />

            <span v-else class="tdx-photo__initial">{{ brideName.charAt(0) || "♥" }}</span>
          </div>
        </figure>
      </div>

      <!-- TÊN CÔ DÂU CHÚ RỂ -->
      <div class="tdx-hero__names">
        <span class="tdx-hero__amp" aria-hidden="true">&amp;</span>

        <p class="tdx-hero__name tdx-hero__name--groom">{{ groomName }}</p>

        <p class="tdx-hero__name tdx-hero__name--bride">{{ brideName }}</p>
      </div>

      <!-- LỜI MỜI -->
      <p class="tdx-hero__kicker">{{ heroTitle }}</p>

      <p class="tdx-hero__guest-label">TRÂN TRỌNG KÍNH MỜI</p>

      <p class="tdx-hero__guest">{{ guestName }}</p>

      <p class="tdx-hero__intro">
        Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại
      </p>

      <p class="tdx-hero__place">{{ location }}</p>

      <div class="tdx-hero__schedule">
        <p v-if="time">VÀO LÚC {{ time }}</p>
        <p v-if="dateText">{{ dateText }}</p>
      </div>

      <p class="tdx-hero__message">
        Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!
      </p>

      <div class="tdx-hero__footer" aria-hidden="true">
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
  flowerDecoration,
  lineDecoration,
  ribbonDecoration,
} from "./toDuyenXanhAssets";

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  event: { type: Object, default: () => ({}) },
  guestName: { type: String, default: "Quý khách" },
  monogram: { type: String, default: "G&B" },
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

const groomPhoto = computed(
  () =>
    props.wedding?.couple?.Groom?.Avatar ||
    props.wedding?.couple?.Groom?.Cover ||
    props.wedding?.groom?.avatar ||
    props.wedding?.hero?.Background ||
    props.wedding?.coverImage ||
    ""
);

const bridePhoto = computed(
  () =>
    props.wedding?.couple?.Bride?.Avatar ||
    props.wedding?.couple?.Bride?.Cover ||
    props.wedding?.bride?.avatar ||
    props.wedding?.hero?.Background ||
    props.wedding?.coverImage ||
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
.tdx-hero {
  --tdx-bg: var(--background, #fefbf4);
  --tdx-ink: var(--text, #1a3500);
  --tdx-green: var(--primary, #5e813c);
  --tdx-line: var(--accent, #d1db9c);

  position: relative;
  isolation: isolate;

  overflow: hidden;

  text-align: center;

  color: var(--tdx-ink);

  background-color: var(--tdx-bg);
}

/* =========================================================
   HOẠ TIẾT NỀN
========================================================= */

.tdx-hero__decor {
  position: absolute;
  inset: 0;
  z-index: -1;

  pointer-events: none;
}

.tdx-decor {
  position: absolute;

  max-width: none;

  object-fit: cover;

  pointer-events: none;
}

.tdx-decor--line-right {
  top: 156px;
  right: -113px;

  width: 198px;
  height: 596px;

  transform: rotate(4.96deg);
}

.tdx-decor--flower-right {
  top: 220px;
  right: -120px;

  width: 270px;
  height: 270px;

  object-fit: contain;

  transform: scaleX(-1) rotate(-50deg);
}

.tdx-decor--line-left {
  top: 134px;
  left: -56px;

  width: 198px;
  height: 300px;

  transform: rotate(-177.25deg);
}

.tdx-decor--ribbon {
  bottom: -25px;
  left: -50%;

  width: 700px;
  height: 140px;

  object-fit: contain;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.tdx-hero__inner {
  position: relative;
  z-index: 2;

  width: min(100%, 441px);

  margin: 0 auto;

  padding: 49.2% 0 0;
}

/* =========================================================
   ẢNH ĐÔI NGHIÊNG
========================================================= */

.tdx-hero__photos {
  position: relative;

  width: 75.4%;
  aspect-ratio: 331.11 / 394.7;

  margin: 0 0 0 12.3%;
}

.tdx-photo {
  position: absolute;

  margin: 0;

  display: flex;
  align-items: center;
  justify-content: center;
}

.tdx-photo--groom {
  top: 0;
  left: 0;

  width: 62.6%;
  aspect-ratio: 207.33 / 254.13;
}

.tdx-photo--bride {
  top: 33.2%;
  left: 33.6%;

  width: 66.4%;
  aspect-ratio: 219.82 / 263.56;
}

.tdx-photo__frame {
  width: 86%;
  aspect-ratio: 178.353 / 230.6;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 5px solid var(--tdx-line);

  background: #ffffff;

  overflow: hidden;
}

.tdx-photo--groom .tdx-photo__frame {
  transform: rotate(-8.25deg) skewX(-0.57deg);
}

.tdx-photo--bride .tdx-photo__frame {
  width: 81.2%;

  transform: rotate(12.17deg) skewX(0.83deg);
}

.tdx-photo__frame img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.tdx-photo__initial {
  font-family: Carattere, cursive;

  font-size: 46px;

  color: var(--tdx-green);
}

/* =========================================================
   TÊN CÔ DÂU CHÚ RỂ
========================================================= */

.tdx-hero__names {
  position: relative;

  margin-top: 6.3%;
  padding: 0 15.9%;
}

.tdx-hero__amp {
  position: absolute;

  top: 65%;
  left: 50%;

  transform: translate(-50%, -50%);

  font-family: Whisper, cursive;
  font-size: 170px;
  line-height: 1;

  color: rgba(11, 46, 0, 0.1);

  user-select: none;

  pointer-events: none;
}

.tdx-hero__name {
  position: relative;

  margin: 0;

  font-family: "Times New Roman", serif;
  font-size: clamp(20px, 7.26vw, 32px);
  font-style: italic;
  font-weight: 400;

  line-height: 1.25;

  text-transform: uppercase;

  color: var(--tdx-green);
}

.tdx-hero__name--groom {
  text-align: start;
}

.tdx-hero__name--bride {
  margin-top: 4px;

  text-align: end;
}

/* =========================================================
   LỜI MỜI
========================================================= */

.tdx-hero__kicker {
  margin: 34px 0 0;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.36em;
  text-indent: 0.36em;

  text-transform: uppercase;
}

.tdx-hero__guest-label {
  margin: 22px 0 2px;

  color: var(--tdx-ink);

  font-family: "Times New Roman", serif;
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.tdx-hero__guest {
  margin: 0;

  font-family: Carattere, cursive;

  font-size: clamp(32px, 9vw, 42px);
  font-weight: 400;

  line-height: 1.25;

  color: var(--tdx-green);
}

.tdx-hero__intro {
  max-width: 320px;
  margin: 14px auto 6px;

  color: var(--tdx-ink);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 12px;

  line-height: 1.6;
}

.tdx-hero__place {
  max-width: 340px;
  margin: 0 auto;

  color: var(--tdx-ink);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 15px;
  font-weight: 600;

  line-height: 1.45;
}

.tdx-hero__schedule {
  margin: 20px auto 0;
  padding: 12px 0;

  border-top: 1px solid var(--tdx-line);
  border-bottom: 1px solid var(--tdx-line);
}

.tdx-hero__schedule p {
  margin: 3px 0;

  color: var(--tdx-ink);

  font-family: "Times New Roman", serif;
  font-size: 12px;
  font-weight: 600;

  letter-spacing: 0.12em;
  line-height: 1.5;
}

.tdx-hero__message {
  max-width: 300px;
  margin: 20px auto 18px;

  color: var(--tdx-green);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 13px;
  font-style: italic;

  line-height: 1.6;
}

.tdx-hero__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: var(--tdx-green);
}

.tdx-hero__footer span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, var(--tdx-line));
}

.tdx-hero__footer span:last-child {
  transform: rotate(180deg);
}

.tdx-hero__footer b {
  font-family: "Times New Roman", serif;
  font-size: 15px;
  font-weight: 400;

  letter-spacing: 0.14em;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tdx-hero__inner {
    width: min(100%, 600px);
  }

  .tdx-decor--line-right {
    top: 212px;
    right: -200px;

    width: 269px;
    height: 700px;
  }

  .tdx-decor--flower-right {
    top: 200px;
    right: -350px;

    width: 500px;
    height: 500px;
  }

  .tdx-decor--line-left {
    top: 182px;
    left: -150px;

    width: 158px;
    height: 472px;
  }

  .tdx-decor--ribbon {
    bottom: -47px;
    left: -341px;

    width: 1403px;
    height: 246px;
  }

  .tdx-photo__frame {
    border-width: 7px;
  }

  .tdx-hero__amp {
    font-size: 231px;
  }

  .tdx-hero__name--bride {
    margin-top: 6px;
  }
}

/* =========================================================
   MOBILE NHỎ
========================================================= */

@media (max-width: 380px) {
  .tdx-hero__amp {
    font-size: 140px;
  }
}
</style>
