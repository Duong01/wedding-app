<template>
  <section class="tdx-couple">
    <!-- =====================================================
         HOẠ TIẾT NỀN
    ====================================================== -->

    <div class="tdx-couple__decor" aria-hidden="true">
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
        :src="ribbonDecoration"
        alt=""
        class="tdx-decor tdx-decor--ribbon"
        draggable="false"
      />
    </div>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="tdx-couple__inner">
      <h2 class="tdx-heading">THÔNG TIN LỄ CƯỚI</h2>

      <!-- ÔNG BÀ HAI HỌ -->
      <div class="tdx-parents">
        <div class="tdx-parents__col">
          <span class="tdx-parents__label">Ông Bà</span>

          <span v-if="groomFather" class="tdx-parents__name">{{ groomFather }}</span>

          <span v-if="groomMother" class="tdx-parents__name">{{ groomMother }}</span>

          <p v-if="groomAddress" class="tdx-parents__address">{{ groomAddress }}</p>
        </div>

        <div class="tdx-parents__divider" aria-hidden="true"></div>

        <div class="tdx-parents__col">
          <span class="tdx-parents__label">Ông Bà</span>

          <span v-if="brideFather" class="tdx-parents__name">{{ brideFather }}</span>

          <span v-if="brideMother" class="tdx-parents__name">{{ brideMother }}</span>

          <p v-if="brideAddress" class="tdx-parents__address">{{ brideAddress }}</p>
        </div>
      </div>

      <!-- BÁO TIN -->
      <p class="tdx-couple__announce">
        TRÂN TRỌNG BÁO TIN
        LỄ THÀNH HÔN CỦA CON CHÚNG TÔI
      </p>

      <!-- TÊN CÔ DÂU CHÚ RỂ -->
      <div class="tdx-couple__names">
        <h3 class="tdx-couple__name">{{ groomName }}</h3>

        <span class="tdx-couple__role">{{ groomRole }}</span>

        <div class="tdx-couple__amp" aria-hidden="true">&amp;</div>

        <h3 class="tdx-couple__name">{{ brideName }}</h3>

        <span class="tdx-couple__role">{{ brideRole }}</span>
      </div>

      <!-- NGÀY CƯỚI -->
      <div class="tdx-couple__date">
        <p class="tdx-couple__date-intro">
          LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI
          {{ ceremonyPlace }}
        </p>

        <div class="tdx-couple__date-row">
          <span v-if="weddingTime">VÀO LÚC {{ weddingTime }}</span>
          <span v-if="weddingWeekday">{{ weddingWeekday }}</span>
        </div>

        <div class="tdx-couple__date-main">
          <span class="tdx-couple__day">{{ weddingDay }}</span>

          <div class="tdx-couple__date-line" aria-hidden="true"></div>

          <div class="tdx-couple__date-side">
            <span>THÁNG {{ weddingMonth }}</span>
            <span>{{ weddingYear }}</span>
          </div>
        </div>

        <p v-if="weddingLunar" class="tdx-couple__lunar">{{ weddingLunar }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import {
  flowerDecoration,
  lineDecoration,
  ribbonDecoration,
} from "./toDuyenXanhAssets";

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  guestName: { type: String, default: "Quý khách" },
});

const groom = computed(() => props.wedding?.couple?.Groom || {});
const bride = computed(() => props.wedding?.couple?.Bride || {});

const groomName = computed(
  () =>
    props.wedding?.GroomName ||
    props.wedding?.groomName ||
    props.wedding?.hero?.GroomName ||
    groom.value.Name ||
    ""
);

const brideName = computed(
  () =>
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.hero?.BrideName ||
    bride.value.Name ||
    ""
);

const groomFather = computed(() => groom.value.Father || "");
const groomMother = computed(() => groom.value.Mother || "");
const brideFather = computed(() => bride.value.Father || "");
const brideMother = computed(() => bride.value.Mother || "");

const groomAddress = computed(() => groom.value.Address || "");
const brideAddress = computed(() => bride.value.Address || "");

const groomRole = computed(() => groom.value.Role || "Trưởng Nam");
const brideRole = computed(() => bride.value.Role || "Út Nữ");

const ceremonyPlace = computed(() => {
  const event = Array.isArray(props.wedding?.events) ? props.wedding.events[0] : null;

  return (
    event?.Location ||
    event?.Address ||
    props.wedding?.hero?.Location ||
    "TƯ GIA"
  );
});

const weddingDate = computed(
  () =>
    props.wedding?.weddingDate ||
    props.wedding?.WeddingDate ||
    props.wedding?.hero?.WeddingDate ||
    props.wedding?.hero?.weddingDate ||
    null
);

const dateObject = computed(() => {
  if (!weddingDate.value) return null;

  const date = new Date(weddingDate.value);

  return Number.isNaN(date.getTime()) ? null : date;
});

const weddingDay = computed(() =>
  dateObject.value ? String(dateObject.value.getDate()).padStart(2, "0") : "--"
);

const weddingMonth = computed(() =>
  dateObject.value ? String(dateObject.value.getMonth() + 1).padStart(2, "0") : "--"
);

const weddingYear = computed(() =>
  dateObject.value ? dateObject.value.getFullYear() : "----"
);

const weddingWeekday = computed(() => {
  if (!dateObject.value) return "";

  const weekdays = [
    "CHỦ NHẬT",
    "THỨ HAI",
    "THỨ BA",
    "THỨ TƯ",
    "THỨ NĂM",
    "THỨ SÁU",
    "THỨ BẢY",
  ];

  return weekdays[dateObject.value.getDay()];
});

const weddingLunar = computed(
  () =>
    props.wedding?.weddingLunar ||
    props.wedding?.WeddingLunar ||
    props.wedding?.lunarDate ||
    props.wedding?.LunarDate ||
    ""
);

const weddingTime = computed(() => {
  const event = Array.isArray(props.wedding?.events) ? props.wedding.events[0] : null;

  const time =
    event?.EventTime ||
    event?.Time ||
    event?.StartTime ||
    props.wedding?.hero?.Time ||
    "";

  if (!time) return "";

  if (typeof time === "string" && time.includes("T")) {
    const date = new Date(time);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
  }

  if (typeof time === "string" && /^\d{1,2}:\d{2}:\d{2}$/.test(time)) {
    return time.substring(0, 5);
  }

  return String(time);
});
</script>

<style scoped>
.tdx-couple {
  --tdx-bg: var(--background, #fefbf4);
  --tdx-ink: var(--text, #1a3500);
  --tdx-green: var(--primary, #5e813c);
  --tdx-line: var(--accent, #d1db9c);

  position: relative;
  isolation: isolate;

  overflow: hidden;

  color: var(--tdx-ink);

  background-color: var(--tdx-bg);
}

/* =========================================================
   HOẠ TIẾT NỀN
========================================================= */

.tdx-couple__decor {
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
  top: 134px;
  right: -56px;

  width: 198px;
  height: 300px;

  transform: rotate(-177.25deg);
}

.tdx-decor--flower-right {
  top: 130px;
  right: -71px;

  width: 150px;
  height: 150px;

  object-fit: contain;

  transform: scaleX(-1) rotate(50deg);
}

.tdx-decor--ribbon {
  bottom: -5px;
  left: -365px;

  width: 700px;
  height: 155px;

  object-fit: contain;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.tdx-couple__inner {
  position: relative;
  z-index: 2;

  width: min(100%, 441px);

  margin: 0 auto;

  padding: 2.5% 10% 26%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;

  text-align: start;
}

.tdx-heading {
  margin: 0;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-transform: uppercase;
}

/* =========================================================
   ÔNG BÀ HAI HỌ
========================================================= */

.tdx-parents {
  width: 100%;

  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0 16px;

  color: var(--tdx-green);

  font-family: Baskerville, "Times New Roman", serif;
}

.tdx-parents__col {
  min-width: 0;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
}

.tdx-parents__label {
  color: var(--tdx-ink);

  font-size: 12px;
}

.tdx-parents__name {
  font-size: 12px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.tdx-parents__address {
  margin: 4px 0 0;

  color: var(--tdx-ink);

  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 10px;

  line-height: 1.35;

  white-space: pre-line;
}

.tdx-parents__divider {
  width: 1px;
  height: 50px;

  align-self: center;

  background: var(--tdx-green);
}

/* =========================================================
   BÁO TIN
========================================================= */

.tdx-couple__announce {
  margin: 0;

  color: var(--tdx-green);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 12px;

  line-height: 1.5;

  white-space: pre-line;
}

/* =========================================================
   TÊN CÔ DÂU CHÚ RỂ
========================================================= */

.tdx-couple__names {
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.tdx-couple__name {
  margin: 0;

  color: var(--tdx-green);

  font-family: Carattere, cursive;
  font-size: 37px;
  font-weight: 400;

  line-height: 1;

  white-space: nowrap;
}

.tdx-couple__role {
  color: var(--tdx-ink);

  font-family: Uchen, serif;
  font-size: 10px;

  letter-spacing: 0.08em;

  text-transform: uppercase;
}

.tdx-couple__amp {
  color: var(--tdx-green);

  font-family: "Aguafina Script", cursive;
  font-size: 35px;

  line-height: 1;
}

/* =========================================================
   NGÀY CƯỚI
========================================================= */

.tdx-couple__date {
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;

  font-family: Baskerville, "Times New Roman", serif;
}

.tdx-couple__date-intro {
  margin: 0;

  color: var(--tdx-green);

  font-size: 12px;

  line-height: 1.4;

  white-space: pre-line;
}

.tdx-couple__date-row {
  display: flex;
  align-items: center;
  gap: 16px;

  color: var(--tdx-ink);

  font-family: "Times New Roman", serif;
  font-size: 12px;

  text-transform: uppercase;
}

.tdx-couple__date-main {
  display: flex;
  align-items: center;
  gap: 9px;

  color: var(--tdx-green);
}

.tdx-couple__day {
  font-family: Baskerville, "Times New Roman", serif;
  font-size: 57px;

  line-height: 1;
}

.tdx-couple__date-line {
  width: 1px;
  height: 46px;

  background: var(--tdx-green);
}

.tdx-couple__date-side {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;

  font-family: "Times New Roman", serif;
  font-size: 17px;

  text-transform: uppercase;
}

.tdx-couple__lunar {
  margin: 0;

  color: var(--tdx-ink);

  font-family: "Times New Roman", serif;
  font-size: 12px;

  text-transform: uppercase;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tdx-couple__inner {
    width: min(100%, 600px);

    padding: 2.5% 5px 26%;

    gap: 28px;
  }

  .tdx-decor--line-right {
    top: 182px;
    left: -150px;
    right: auto;

    width: 158px;
    height: 472px;
  }

  .tdx-decor--flower-right {
    top: 101px;
    left: -285px;
    right: auto;

    width: 412px;
    height: 412px;
  }

  .tdx-decor--ribbon {
    bottom: 27px;
    left: -538px;

    width: 1403px;
    height: 246px;
  }

  .tdx-heading {
    font-size: 27px;
  }

  .tdx-parents {
    gap: 0 22px;
  }

  .tdx-parents__label,
  .tdx-parents__name {
    font-size: 16px;
  }

  .tdx-parents__address {
    font-size: 14px;
  }

  .tdx-parents__divider {
    height: 68px;
  }

  .tdx-couple__announce {
    font-size: 16px;
  }

  .tdx-couple__role {
    font-size: 14px;
  }

  .tdx-couple__amp {
    font-size: 48px;
  }

  .tdx-couple__date-intro,
  .tdx-couple__date-row,
  .tdx-couple__lunar {
    font-size: 16px;
  }

  .tdx-couple__day {
    font-size: 78px;
  }

  .tdx-couple__date-line {
    height: 63px;
  }

  .tdx-couple__date-side {
    font-size: 23px;
  }
}
</style>
