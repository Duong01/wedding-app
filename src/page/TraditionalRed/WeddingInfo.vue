<template>
  <section class="tr-info">
    <!-- =====================================================
         THÔNG TIN LỄ CƯỚI
    ====================================================== -->

    <h2 class="tr-info__title">Thông tin lễ cưới</h2>

    <div class="tr-info__families">
      <div class="tr-info__family">
        <span class="tr-info__family-label">Ông Bà</span>

        <span v-if="groomFather" class="tr-info__family-name">
          {{ groomFather }}
        </span>

        <span v-if="groomMother" class="tr-info__family-name">
          {{ groomMother }}
        </span>

        <span v-if="groomAddress" class="tr-info__family-address">
          {{ groomAddress }}
        </span>
      </div>

      <span class="tr-info__family-divider" aria-hidden="true"></span>

      <div class="tr-info__family">
        <span class="tr-info__family-label">Ông Bà</span>

        <span v-if="brideFather" class="tr-info__family-name">
          {{ brideFather }}
        </span>

        <span v-if="brideMother" class="tr-info__family-name">
          {{ brideMother }}
        </span>

        <span v-if="brideAddress" class="tr-info__family-address">
          {{ brideAddress }}
        </span>
      </div>
    </div>

    <p class="tr-info__announce">
      TRÂN TRỌNG BÁO TIN<br />LỄ THÀNH HÔN CỦA CON CHÚNG TÔI
    </p>

    <!-- ============ TÊN CÔ DÂU CHÚ RỂ ============ -->

    <div class="tr-info__couple">
      <h3 class="tr-info__couple-name">{{ groomFull }}</h3>

      <div v-if="groomRole" class="tr-info__couple-role">
        {{ groomRole }}
      </div>

      <div class="tr-info__couple-amp">&amp;</div>

      <h3 class="tr-info__couple-name">{{ brideFull }}</h3>

      <div v-if="brideRole" class="tr-info__couple-role">
        {{ brideRole }}
      </div>
    </div>

    <!-- ============ NGÀY GIỜ ============ -->

    <div class="tr-info__when">
      <p class="tr-info__when-place">
        LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI<br />{{ ceremonyPlace }}
      </p>

      <p v-if="ceremonyTime" class="tr-info__when-time">
        VÀO LÚC {{ ceremonyTime }}
      </p>

      <div v-if="hasDate" class="tr-info__when-date">
        <span class="tr-info__when-side">{{ weekday }}</span>

        <span class="tr-info__when-sep" aria-hidden="true">|</span>

        <span class="tr-info__when-day">{{ day }}</span>

        <span class="tr-info__when-sep" aria-hidden="true">|</span>

        <span class="tr-info__when-side">{{ monthLabel }}</span>
      </div>

      <div v-if="year" class="tr-info__when-year">{{ year }}</div>

      <div v-if="lunar" class="tr-info__when-lunar">({{ lunar }})</div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  wedding: {
    type: Object,
    default: () => ({}),
  },
});

/* =========================================================
   CÔ DÂU / CHÚ RỂ
========================================================= */

const groomFull = computed(
  () =>
    props.wedding?.GroomName ||
    props.wedding?.groomName ||
    props.wedding?.couple?.Groom?.Name ||
    "Chú rể"
);

const brideFull = computed(
  () =>
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.couple?.Bride?.Name ||
    "Cô dâu"
);

const groomRole = computed(
  () =>
    props.wedding?.couple?.Groom?.Nickname ||
    props.wedding?.couple?.Groom?.Role ||
    ""
);

const brideRole = computed(
  () =>
    props.wedding?.couple?.Bride?.Nickname ||
    props.wedding?.couple?.Bride?.Role ||
    ""
);

/* =========================================================
   GIA ĐÌNH
========================================================= */

const groomFather = computed(() => props.wedding?.couple?.Groom?.Father || "");
const groomMother = computed(() => props.wedding?.couple?.Groom?.Mother || "");
const brideFather = computed(() => props.wedding?.couple?.Bride?.Father || "");
const brideMother = computed(() => props.wedding?.couple?.Bride?.Mother || "");

const groomAddress = computed(
  () =>
    props.wedding?.couple?.Groom?.Address ||
    props.wedding?.couple?.Groom?.Description ||
    ""
);

const brideAddress = computed(
  () =>
    props.wedding?.couple?.Bride?.Address ||
    props.wedding?.couple?.Bride?.Description ||
    ""
);

/* =========================================================
   SỰ KIỆN ĐẦU TIÊN
========================================================= */

const firstEvent = computed(() => {
  const list = Array.isArray(props.wedding?.events) ? props.wedding.events : [];

  return list[0] || null;
});

const ceremonyPlace = computed(
  () =>
    firstEvent.value?.Location ||
    firstEvent.value?.Address ||
    props.wedding?.hero?.Location ||
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
    props.wedding?.weddingDate ||
    props.wedding?.WeddingDate ||
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
    props.wedding?.weddingLunar ||
    props.wedding?.WeddingLunar ||
    ""
);
</script>

<style scoped>
/* =========================================================
   SECTION
========================================================= */

.tr-info {
  position: relative;

  z-index: 10;

  color: #680e0e;
}

/* =========================================================
   TIÊU ĐỀ
========================================================= */

.tr-info__title {
  margin: 0 0 24px;

  text-align: center;

  text-transform: uppercase;

  font-family: "Times New Roman", Times, serif;

  font-size: 20px;

  font-weight: 700;

  letter-spacing: 0.05em;
}

/* =========================================================
   GIA ĐÌNH
========================================================= */

.tr-info__families {
  display: grid;

  grid-template-columns: 1fr auto 1fr;

  justify-content: center;

  column-gap: 12px;

  row-gap: 4px;

  margin-bottom: 32px;

  font-family: "Baskerville", "Times New Roman", serif;
}

.tr-info__family {
  display: flex;

  flex-direction: column;

  align-items: center;

  min-width: 0;

  max-width: 160px;

  text-align: center;
}

.tr-info__family-label {
  font-size: 14px;
}

.tr-info__family-name {
  font-size: 14px;

  font-weight: 600;

  overflow-wrap: anywhere;
}

.tr-info__family-address {
  margin-top: 4px;

  font-size: 12px;

  line-height: 1.3;

  white-space: pre-line;
}

.tr-info__family-divider {
  align-self: center;

  width: 1px;
  height: 60px;

  background-color: #680e0e;
}

/* =========================================================
   LỜI BÁO TIN
========================================================= */

.tr-info__announce {
  margin: 0 auto 32px;

  max-width: 560px;

  text-align: center;

  white-space: pre-line;

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 15px;

  line-height: 1.6;
}

/* =========================================================
   TÊN CÔ DÂU CHÚ RỂ
========================================================= */

.tr-info__couple {
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 8px;

  margin-bottom: 32px;
}

.tr-info__couple-name {
  margin: 0;

  width: 100%;

  text-align: center;

  font-family: "EB Garamond", "Cormorant Garamond", serif;

  font-size: 40px;

  font-weight: 500;

  line-height: 1.25;

  white-space: nowrap;
}

.tr-info__couple-role {
  text-transform: uppercase;

  letter-spacing: 0.2em;

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 12px;
}

.tr-info__couple-amp {
  font-family: "EB Garamond", "Cormorant Garamond", serif;

  font-size: 30px;

  line-height: 1;
}

/* =========================================================
   NGÀY GIỜ
========================================================= */

.tr-info__when {
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 12px;

  text-align: center;

  font-family: "Baskerville", "Times New Roman", serif;
}

.tr-info__when-place {
  margin: 0;

  font-size: 14px;

  line-height: 1.6;

  white-space: pre-line;
}

.tr-info__when-time {
  margin: 0;

  text-transform: uppercase;

  font-size: 14px;
}

.tr-info__when-date {
  display: flex;

  align-items: center;
  justify-content: center;
}

.tr-info__when-side {
  width: 70px;

  text-transform: uppercase;

  font-size: 14px;
}

.tr-info__when-side:first-child {
  text-align: right;
}

.tr-info__when-side:last-child {
  text-align: left;
}

.tr-info__when-sep {
  margin: 0 8px;

  font-size: 14px;

  opacity: 0.5;
}

.tr-info__when-day {
  font-size: 32px;
}

.tr-info__when-year {
  font-size: 20px;
}

.tr-info__when-lunar {
  font-size: 13px;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tr-info__title {
    font-size: 24px;
  }

  .tr-info__families {
    column-gap: 32px;
  }

  .tr-info__family {
    max-width: 280px;
  }

  .tr-info__family-label {
    font-size: 15px;
  }

  .tr-info__family-address {
    font-size: 13px;
  }

  .tr-info__announce {
    font-size: 16px;
  }

  .tr-info__couple-role {
    font-size: 13px;
  }

  .tr-info__couple-amp {
    font-size: 35px;
  }

  .tr-info__when-place,
  .tr-info__when-time,
  .tr-info__when-side {
    font-size: 15px;
  }

  .tr-info__when-side {
    width: 85px;
  }

  .tr-info__when-day {
    font-size: 38px;
  }

  .tr-info__when-year {
    font-size: 22px;
  }

  .tr-info__when-lunar {
    font-size: 14px;
  }
}

/* =========================================================
   MOBILE NHỎ
========================================================= */

@media (max-width: 380px) {
  .tr-info__couple-name {
    font-size: 32px;
  }

  .tr-info__family-name,
  .tr-info__family-label {
    font-size: 13px;
  }

  .tr-info__when-side {
    width: 60px;

    font-size: 12px;
  }

  .tr-info__when-day {
    font-size: 28px;
  }
}
</style>
