<template>
  <section class="cfr-info">

    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="cfr-title">
      {{ heading }}
    </h2>


    <!-- =====================================================
         HAI HỌ TỪ THÂN
    ====================================================== -->

    <div class="cfr-info__families">

      <div class="cfr-info__family">
        <span class="cfr-info__family-label">Ông Bà</span>

        <span v-if="groomFather" class="cfr-info__family-name">
          {{ groomFather }}
        </span>

        <span v-if="groomMother" class="cfr-info__family-name">
          {{ groomMother }}
        </span>

        <span v-if="groomAddress" class="cfr-info__family-address">
          {{ groomAddress }}
        </span>
      </div>


      <div class="cfr-info__family-divider" aria-hidden="true"></div>


      <div class="cfr-info__family">
        <span class="cfr-info__family-label">Ông Bà</span>

        <span v-if="brideFather" class="cfr-info__family-name">
          {{ brideFather }}
        </span>

        <span v-if="brideMother" class="cfr-info__family-name">
          {{ brideMother }}
        </span>

        <span v-if="brideAddress" class="cfr-info__family-address">
          {{ brideAddress }}
        </span>
      </div>

    </div>


    <!-- =====================================================
         LỜI BÁO TIN
    ====================================================== -->

    <p class="cfr-info__announce">
      {{ eyebrow }}
    </p>


    <!-- =====================================================
         TÊN CÔ DÂU CHÚ RỂ
    ====================================================== -->

    <div class="cfr-info__couple">

      <h3 class="cfr-info__couple-name">
        {{ groomName }}
      </h3>

      <div v-if="groomRole" class="cfr-info__couple-role">
        {{ groomRole }}
      </div>

      <div class="cfr-info__couple-amp">&amp;</div>

      <h3 class="cfr-info__couple-name">
        {{ brideName }}
      </h3>

      <div v-if="brideRole" class="cfr-info__couple-role">
        {{ brideRole }}
      </div>

    </div>


    <!-- =====================================================
         NGÀY GIỜ
    ====================================================== -->

    <div class="cfr-info__when">

      <p class="cfr-info__when-place">
        LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI<br />{{ ceremonyPlace }}
      </p>

      <p class="cfr-info__when-label">
        VÀO LÚC
      </p>

      <div v-if="ceremonyTime" class="cfr-info__when-time">
        {{ ceremonyTime }}
      </div>

      <div v-if="hasDate" class="cfr-info__when-date">
        <span class="cfr-info__when-side">{{ weekday }}</span>

        <span class="cfr-info__when-sep" aria-hidden="true"></span>

        <span class="cfr-info__when-day">{{ day }}</span>

        <span class="cfr-info__when-sep" aria-hidden="true"></span>

        <span class="cfr-info__when-side">{{ monthLabel }}</span>
      </div>

      <div v-if="year" class="cfr-info__when-year">
        {{ year }}
      </div>

      <div v-if="lunar" class="cfr-info__when-lunar">
        ({{ lunar }})
      </div>

    </div>

  </section>
</template>


<script setup>
import { computed } from "vue";

import { sectionText } from "@/data/sectionTitles";


const props = defineProps({
  wedding: {
    type: Object,
    default: () => ({}),
  },

  sections: {
    type: Object,
    default: () => ({}),
  },
});

const wedding = computed(() => props.wedding || {});


/* =========================================================
   TIÊU ĐỀ MỤC
========================================================= */

const heading = computed(() =>
  sectionText(props.sections, "couple", "Heading")
);

const eyebrow = computed(() =>
  sectionText(props.sections, "couple", "Eyebrow")
);


/* =========================================================
   CÔ DÂU / CHÚ RỂ
========================================================= */

const groomName = computed(
  () =>
    wedding.value?.GroomName ||
    wedding.value?.groomName ||
    wedding.value?.couple?.Groom?.Name ||
    "Chú rể"
);

const brideName = computed(
  () =>
    wedding.value?.BrideName ||
    wedding.value?.brideName ||
    wedding.value?.couple?.Bride?.Name ||
    "Cô dâu"
);

const groomRole = computed(
  () =>
    wedding.value?.couple?.Groom?.Nickname ||
    wedding.value?.couple?.Groom?.Role ||
    ""
);

const brideRole = computed(
  () =>
    wedding.value?.couple?.Bride?.Nickname ||
    wedding.value?.couple?.Bride?.Role ||
    ""
);


/* =========================================================
   GIA ĐÌNH
========================================================= */

const groomFather = computed(() => wedding.value?.couple?.Groom?.Father || "");
const groomMother = computed(() => wedding.value?.couple?.Groom?.Mother || "");
const brideFather = computed(() => wedding.value?.couple?.Bride?.Father || "");
const brideMother = computed(() => wedding.value?.couple?.Bride?.Mother || "");

const groomAddress = computed(
  () =>
    wedding.value?.couple?.Groom?.Address ||
    wedding.value?.couple?.Groom?.Description ||
    ""
);

const brideAddress = computed(
  () =>
    wedding.value?.couple?.Bride?.Address ||
    wedding.value?.couple?.Bride?.Description ||
    ""
);


/* =========================================================
   SỰ KIỆN ĐẦU TIÊN
========================================================= */

const firstEvent = computed(() => {
  const list = Array.isArray(wedding.value?.events)
    ? wedding.value.events
    : [];

  return list[0] || null;
});

const ceremonyPlace = computed(
  () =>
    firstEvent.value?.Location ||
    firstEvent.value?.Address ||
    wedding.value?.hero?.Location ||
    "TƯ GIA"
);

const ceremonyTime = computed(() => {
  const raw = firstEvent.value?.EventTime || "";

  if (!raw) return "";

  return String(raw).slice(0, 5);
});


/* =========================================================
   NGÀY
========================================================= */

const WEEKDAYS = [
  "CHỦ NHẬT",
  "THỨ HAI",
  "THỨ BA",
  "THỨ TƯ",
  "THỨ NĂM",
  "THỨ SÁU",
  "THỨ BẢY",
];

const dateObject = computed(() => {
  const raw =
    firstEvent.value?.EventDate ||
    wedding.value?.weddingDate ||
    wedding.value?.WeddingDate ||
    "";

  if (!raw) return null;

  const date = new Date(raw);

  return Number.isNaN(date.getTime()) ? null : date;
});

const hasDate = computed(() => Boolean(dateObject.value));

const weekday = computed(() => {
  if (firstEvent.value?.Weekday) {
    return String(firstEvent.value.Weekday).toUpperCase();
  }

  return dateObject.value ? WEEKDAYS[dateObject.value.getDay()] : "";
});

const day = computed(() => {
  if (firstEvent.value?.Day) {
    return String(firstEvent.value.Day).padStart(2, "0");
  }

  return dateObject.value
    ? String(dateObject.value.getDate()).padStart(2, "0")
    : "";
});

const monthLabel = computed(() => {
  if (firstEvent.value?.Month) {
    return `THÁNG ${String(firstEvent.value.Month).padStart(2, "0")}`;
  }

  return dateObject.value
    ? `THÁNG ${String(dateObject.value.getMonth() + 1).padStart(2, "0")}`
    : "";
});

const year = computed(() => {
  if (firstEvent.value?.Year) {
    return String(firstEvent.value.Year);
  }

  return dateObject.value ? String(dateObject.value.getFullYear()) : "";
});

const lunar = computed(
  () =>
    firstEvent.value?.Lunar ||
    wedding.value?.weddingLunar ||
    wedding.value?.WeddingLunar ||
    ""
);
</script>


<style scoped>
/* =========================================================
   SECTION
========================================================== */

.cfr-info {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 24px;

  width: 100%;

  color: var(--cfr-red-deep);

  text-align: center;
}


/* =========================================================
   GIA ĐÌNH
========================================================== */

.cfr-info__families {
  display: grid;

  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: repeat(4, auto);

  column-gap: 12px;
  row-gap: 4px;

  width: 100%;

  color: var(--cfr-red);
}

.cfr-info__family {
  display: grid;

  grid-row: span 4;

  grid-template-rows: subgrid;

  justify-items: center;

  min-width: 0;
  min-height: 0;

  max-width: 180px;

  text-align: center;
}

.cfr-info__family-label {
  margin-bottom: 4px;

  color: var(--cfr-red-deep);

  font-size: 13px;
}

.cfr-info__family-name {
  color: var(--cfr-red);

  font-size: 13px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.cfr-info__family-address {
  display: flex;
  flex-direction: column;

  width: 100%;

  margin-top: 8px;

  color: var(--cfr-red-deep);

  font-size: 12px;

  line-height: 1.4;
  white-space: pre-line;
}

.cfr-info__family-divider {
  align-self: center;

  width: 1px;
  height: 60px;

  background-color: var(--cfr-red);

  opacity: 0.5;
}


/* =========================================================
   LỜI BÁO TIN
========================================================== */

.cfr-info__announce {
  margin: 0;

  color: var(--cfr-red);

  font-size: 14px;

  letter-spacing: 0.04em;
  line-height: 1.6;
  text-transform: uppercase;
  white-space: pre-line;
}


/* =========================================================
   TÊN CÔ DÂU CHÚ RỂ
========================================================== */

.cfr-info__couple {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 12px;

  width: 100%;
}

.cfr-info__couple-name {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 80%;
  min-height: 80px;

  margin: 0;

  color: var(--cfr-red);

  font-family: var(--cfr-font-name);
  font-size: 42px;
  font-weight: 400;

  line-height: 1.2;
  white-space: nowrap;
}

.cfr-info__couple-role {
  color: var(--cfr-red-deep);

  font-family: "Cormorant Garamond", "Times New Roman", serif;
  font-size: 15px;

  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.cfr-info__couple-amp {
  color: var(--cfr-red);

  font-family: var(--cfr-font-name);
  font-size: 30px;

  line-height: 1;
}


/* =========================================================
   NGÀY GIỜ
========================================================== */

.cfr-info__when {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 16px;

  width: 100%;
}

.cfr-info__when-place {
  margin: 0;

  color: var(--cfr-red-deep);

  font-size: 16px;

  line-height: 1.5;
  white-space: pre-line;
}

.cfr-info__when-label {
  margin: 0 0 8px;

  color: var(--cfr-red-deep);

  font-size: 16px;

  text-transform: uppercase;
}

.cfr-info__when-time {
  color: var(--cfr-red);

  font-size: 20px;
}

.cfr-info__when-date {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 24px;

  color: var(--cfr-red);
}

.cfr-info__when-side {
  font-size: 12px;
}

.cfr-info__when-side:first-child {
  text-align: right;
}

.cfr-info__when-side:last-child {
  text-align: left;
}

.cfr-info__when-sep {
  flex-shrink: 0;

  width: 20px;
  height: 1px;

  background-color: var(--cfr-red-deep);

  opacity: 0.4;

  transform: rotate(90deg);
}

.cfr-info__when-day {
  font-size: 30px;

  line-height: 1;
}

.cfr-info__when-year {
  color: var(--cfr-red);

  font-size: 18px;
}

.cfr-info__when-lunar {
  color: var(--cfr-red-deep);

  font-size: 12px;

  letter-spacing: 0.12em;
  text-transform: uppercase;
}


/* =========================================================
   DESKTOP
========================================================== */

@media (min-width: 900px) {
  .cfr-info {
    gap: 32px;
  }

  .cfr-info__families {
    column-gap: 32px;
  }

  .cfr-info__family {
    max-width: 300px;
  }

  .cfr-info__family-label {
    font-size: 15px;
  }

  .cfr-info__family-name {
    font-size: 15px;
  }

  .cfr-info__family-address {
    font-size: 13px;
  }

  .cfr-info__family-divider {
    height: 80px;
  }

  .cfr-info__announce {
    max-width: 560px;

    font-size: 18px;
  }

  .cfr-info__couple {
    gap: 16px;
  }

  .cfr-info__couple-name {
    line-height: 60px;
  }

  .cfr-info__couple-role {
    font-size: 17px;
  }

  .cfr-info__couple-amp {
    font-size: 40px;
  }

  .cfr-info__when {
    gap: 20px;
  }

  .cfr-info__when-place,
  .cfr-info__when-label {
    font-size: 18px;
  }

  .cfr-info__when-time {
    font-size: 30px;
  }

  .cfr-info__when-side {
    font-size: 16px;
  }

  .cfr-info__when-day {
    font-size: 40px;
  }

  .cfr-info__when-year {
    font-size: 24px;
  }

  .cfr-info__when-lunar {
    font-size: 14px;
  }
}


/* =========================================================
   MOBILE NHỎ
========================================================== */

@media (max-width: 380px) {
  .cfr-info__couple-name {
    min-height: 60px;

    font-size: 32px;
  }

  .cfr-info__couple-amp {
    font-size: 24px;
  }

  .cfr-info__family-name,
  .cfr-info__family-label {
    font-size: 12px;
  }

  .cfr-info__family-address {
    font-size: 11px;
  }

  .cfr-info__when-side {
    font-size: 11px;
  }

  .cfr-info__when-day {
    font-size: 26px;
  }
}
</style>
