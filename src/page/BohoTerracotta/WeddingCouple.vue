<template>
  <section class="bq-couple">
    <img
      :src="flower3"
      alt=""
      aria-hidden="true"
      class="bq-couple__flower bq-couple__flower--left"
      draggable="false"
    />

    <img
      :src="flower3"
      alt=""
      aria-hidden="true"
      class="bq-couple__flower bq-couple__flower--right"
      draggable="false"
    />

    <div class="bq-couple__inner">
      <h2 class="bq-heading">THÔNG TIN LỄ CƯỚI</h2>

      <!-- =====================================================
           GIA ĐÌNH HAI BÊN
      ====================================================== -->

      <div class="bq-families">
        <div class="bq-family">
          <span class="bq-family__label">Ông Bà</span>

          <span v-if="groomParents.Father" class="bq-family__name">
            {{ groomParents.Father }}
          </span>

          <span v-if="groomParents.Mother" class="bq-family__name">
            {{ groomParents.Mother }}
          </span>

          <span v-if="groomParents.Address" class="bq-family__address">
            {{ groomParents.Address }}
          </span>
        </div>

        <img
          :src="line3"
          alt=""
          aria-hidden="true"
          class="bq-families__divider"
          draggable="false"
        />

        <div class="bq-family">
          <span class="bq-family__label">Ông Bà</span>

          <span v-if="brideParents.Father" class="bq-family__name">
            {{ brideParents.Father }}
          </span>

          <span v-if="brideParents.Mother" class="bq-family__name">
            {{ brideParents.Mother }}
          </span>

          <span v-if="brideParents.Address" class="bq-family__address">
            {{ brideParents.Address }}
          </span>
        </div>
      </div>

      <!-- =====================================================
           BÁO TIN
      ====================================================== -->

      <p class="bq-couple__announce">
        TRÂN TRỌNG BÁO TIN<br />LỄ THÀNH HÔN CỦA CON CHÚNG TÔI
      </p>

      <img
        :src="line2"
        alt=""
        aria-hidden="true"
        class="bq-couple__line"
        draggable="false"
      />

      <!-- =====================================================
           CÔ DÂU · CHÚ RỂ
      ====================================================== -->

      <div class="bq-people">
        <h3 class="bq-person__name">{{ groom }}</h3>

        <span class="bq-person__role">TRƯỞNG NAM</span>

        <span class="bq-people__amp" aria-hidden="true">&amp;</span>

        <h3 class="bq-person__name">{{ bride }}</h3>

        <span class="bq-person__role">ÚT NỮ</span>
      </div>

      <!-- =====================================================
           NGÀY CƯỚI
      ====================================================== -->

      <div class="bq-date">
        <p class="bq-date__place">
          LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI<br />TƯ GIA
        </p>

        <div class="bq-date__when">
          <span v-if="weddingTime">VÀO LÚC {{ weddingTime }}</span>
          <span v-if="weddingWeekday">{{ weddingWeekday }}</span>
        </div>

        <div class="bq-date__main">
          <img
            :src="line4"
            alt=""
            aria-hidden="true"
            class="bq-date__line"
            draggable="false"
          />

          <span class="bq-date__day">{{ weddingDay }}</span>

          <span class="bq-date__bar" aria-hidden="true"></span>

          <div class="bq-date__side">
            <span>THÁNG {{ weddingMonth }}</span>
            <span>{{ weddingYear }}</span>
          </div>

          <img
            :src="line4"
            alt=""
            aria-hidden="true"
            class="bq-date__line bq-date__line--flip"
            draggable="false"
          />
        </div>

        <p v-if="weddingLunar" class="bq-date__lunar">({{ weddingLunar }})</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import { flower3, line2, line3, line4 } from "./bohoTerracottaAssets";

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  guestName: { type: String, default: "Quý khách" },
});

const groom = computed(
  () =>
    props.wedding?.GroomName ||
    props.wedding?.groomName ||
    props.wedding?.hero?.GroomName ||
    props.wedding?.couple?.Groom?.Name ||
    ""
);

const bride = computed(
  () =>
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.hero?.BrideName ||
    props.wedding?.couple?.Bride?.Name ||
    ""
);

const groomParents = computed(() => props.wedding?.couple?.Groom || {});
const brideParents = computed(() => props.wedding?.couple?.Bride || {});

/* =========================================================
   NGÀY CƯỚI
========================================================= */

const dateObject = computed(() => {
  const raw =
    props.wedding?.weddingDate ||
    props.wedding?.WeddingDate ||
    props.wedding?.hero?.weddingDate ||
    "";

  if (!raw) return null;

  const date = new Date(raw);

  return Number.isNaN(date.getTime()) ? null : date;
});

const weddingDay = computed(() =>
  dateObject.value ? String(dateObject.value.getDate()).padStart(2, "0") : "--"
);

const weddingMonth = computed(() =>
  dateObject.value ? String(dateObject.value.getMonth() + 1).padStart(2, "0") : "--"
);

const weddingYear = computed(() =>
  dateObject.value ? String(dateObject.value.getFullYear()) : "----"
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
    props.wedding?.events?.[0]?.Lunar ||
    ""
);

const weddingTime = computed(() => {
  const event = Array.isArray(props.wedding?.events) ? props.wedding.events[0] : null;

  const time =
    event?.EventTime ||
    event?.Time ||
    event?.StartTime ||
    props.wedding?.weddingTime ||
    props.wedding?.WeddingTime ||
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
.bq-couple {
  position: relative;
  isolation: isolate;

  width: 100%;

  overflow: hidden;

  text-align: center;

  color: var(--bq-ink);
}

.bq-couple__flower {
  position: absolute;

  z-index: 1;

  width: 46.3%;
  max-width: none;
  height: auto;

  object-fit: contain;

  pointer-events: none;

  filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.25));
}

.bq-couple__flower--left {
  top: -13px;
  left: -13%;

  transform: scaleX(-1);
}

.bq-couple__flower--right {
  top: -13px;
  right: -13%;
}

.bq-couple__inner {
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  max-width: 366px;

  margin: 0 auto;

  padding: 46px 20px 0;
}

/* =========================================================
   TIÊU ĐỀ
========================================================= */

.bq-heading {
  margin: 0;

  color: var(--bq-accent);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.04em;

  text-transform: uppercase;
}

/* =========================================================
   GIA ĐÌNH HAI BÊN
========================================================= */

.bq-families {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 14px;

  width: 100%;

  margin-top: 24px;
}

.bq-family {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;

  min-width: 0;
}

.bq-family__label {
  color: var(--bq-ink);

  font-size: 12px;
}

.bq-family__name {
  color: var(--bq-accent);

  font-size: 12px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.bq-family__address {
  margin-top: 4px;

  color: var(--bq-ink);

  font-family: "Roboto", "Helvetica Neue", sans-serif;
  font-size: 10px;

  line-height: 1.35;

  white-space: pre-line;
}

.bq-families__divider {
  display: block;

  height: 84px;
  width: auto;
  max-width: none;

  object-fit: contain;

  filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.25));
}

/* =========================================================
   BÁO TIN
========================================================= */

.bq-couple__announce {
  margin: 26px 0 0;

  color: var(--bq-accent);

  font-size: 12px;

  line-height: 1.5;

  text-transform: uppercase;
  white-space: pre-line;
}

.bq-couple__line {
  display: block;

  width: 143px;
  max-width: none;
  height: auto;

  margin: 10px auto 0;

  object-fit: contain;

  filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.25));
}

/* =========================================================
   CÔ DÂU · CHÚ RỂ
========================================================= */

.bq-people {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;

  width: 100%;

  margin-top: 22px;
}

.bq-person__name {
  width: 80%;

  margin: 0;

  color: var(--bq-accent);

  font-family: "Cormorant Garamond", "EB Garamond", "Times New Roman", serif;
  font-size: 39px;
  font-weight: 500;

  line-height: 1.35;

  white-space: nowrap;
}

.bq-person__role {
  color: var(--bq-ink);

  font-size: 10px;

  letter-spacing: 0.14em;

  text-transform: uppercase;
}

.bq-people__amp {
  margin: 4px 0;

  color: var(--bq-accent);

  font-family: "Ms Madi", cursive;
  font-size: 35px;
  line-height: 1;
}

/* =========================================================
   NGÀY CƯỚI
========================================================= */

.bq-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  margin-top: 24px;
}

.bq-date__place {
  margin: 0;

  color: var(--bq-accent);

  font-size: 12px;

  line-height: 1.5;

  text-transform: uppercase;
  white-space: pre-line;
}

.bq-date__when {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;

  color: var(--bq-ink);

  font-family: "Times New Roman", serif;
  font-size: 12px;

  text-transform: uppercase;
}

.bq-date__main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  color: var(--bq-accent);
}

.bq-date__line {
  display: block;

  height: 84px;
  width: auto;
  max-width: none;

  object-fit: contain;

  filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.25));
}

.bq-date__line--flip {
  transform: scaleX(-1);
}

.bq-date__day {
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 52px;

  line-height: 1;
}

.bq-date__bar {
  width: 1px;
  height: 46px;

  background-color: var(--bq-accent);
}

.bq-date__side {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 4px;

  text-align: left;

  font-family: "Times New Roman", serif;
  font-size: 16px;

  text-transform: uppercase;
}

.bq-date__lunar {
  margin: 0;

  color: var(--bq-ink);

  font-family: "Times New Roman", serif;
  font-size: 12px;

  letter-spacing: 0.12em;

  text-transform: uppercase;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .bq-couple__inner {
    max-width: 520px;

    padding: 56px 32px 0;
  }

  .bq-heading {
    font-size: 24px;
  }

  .bq-family__label,
  .bq-family__name {
    font-size: 14px;
  }

  .bq-family__address {
    font-size: 12px;
  }

  .bq-families__divider {
    height: 104px;
  }

  .bq-couple__announce {
    font-size: 14px;
  }

  .bq-couple__line {
    width: 180px;
  }

  .bq-person__name {
    font-size: 39px;
  }

  .bq-person__role {
    font-size: 12px;
  }

  .bq-date__place,
  .bq-date__when {
    font-size: 14px;
  }

  .bq-date__line {
    height: 91px;
  }

  .bq-date__day {
    font-size: 57px;
  }

  .bq-date__side {
    font-size: 17px;
  }

  .bq-date__lunar {
    font-size: 14px;
  }
}
</style>
