<template>
  <section class="mw-couple">
    <h2 class="mw-title">Thông tin lễ cưới</h2>

    <!-- =====================================================
         HAI HỌ TỪ THÂN
    ====================================================== -->

    <div v-if="hasFamilyInfo" class="mw-parents">
      <div v-if="hasGroomFamily" class="mw-parents__col">
        <span class="mw-parents__label">Ông Bà</span>

        <span v-if="groomFather" class="mw-parents__name">{{ groomFather }}</span>

        <span v-if="groomMother" class="mw-parents__name">{{ groomMother }}</span>

        <span v-if="groomAddress" class="mw-parents__address">{{ groomAddress }}</span>
      </div>

      <span class="mw-parents__divider" aria-hidden="true"></span>

      <div v-if="hasBrideFamily" class="mw-parents__col">
        <span class="mw-parents__label">Ông Bà</span>

        <span v-if="brideFather" class="mw-parents__name">{{ brideFather }}</span>

        <span v-if="brideMother" class="mw-parents__name">{{ brideMother }}</span>

        <span v-if="brideAddress" class="mw-parents__address">{{ brideAddress }}</span>
      </div>
    </div>

    <!-- =====================================================
         BÁO TIN
    ====================================================== -->

    <p class="mw-couple__announce">
      TRÂN TRỌNG BÁO TIN
      LỄ THÀNH HÔN CỦA CON CHÚNG TÔI
    </p>

    <!-- =====================================================
         TÊN CÔ DÂU CHÚ RỂ
    ====================================================== -->

    <div class="mw-couple__names">
      <h3 class="mw-couple__name">{{ brideName }}</h3>

      <span class="mw-couple__role">{{ brideRole }}</span>

      <span class="mw-couple__amp">&amp;</span>

      <h3 class="mw-couple__name">{{ groomName }}</h3>

      <span class="mw-couple__role">{{ groomRole }}</span>
    </div>

    <!-- =====================================================
         THỜI GIAN
    ====================================================== -->

    <div v-if="hasDate" class="mw-date">
      <p class="mw-date__place">
        LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI
        {{ location || "TƯ GIA" }}
      </p>

      <p class="mw-date__lead">VÀO LÚC</p>

      <div v-if="time" class="mw-date__time">{{ time }}</div>

      <div class="mw-date__row">
        <span v-if="weekday" class="mw-date__weekday">{{ weekday }}</span>

        <span class="mw-date__bar" aria-hidden="true"></span>

        <span v-if="day" class="mw-date__day">{{ day }}</span>

        <span class="mw-date__bar" aria-hidden="true"></span>

        <span v-if="month" class="mw-date__month">THÁNG {{ month }}</span>
      </div>

      <div v-if="year" class="mw-date__year">{{ year }}</div>

      <div v-if="lunar" class="mw-date__lunar">( {{ lunar }} )</div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import dayjs from "dayjs";

const WEEKDAYS = [
  "CHỦ NHẬT",
  "THỨ HAI",
  "THỨ BA",
  "THỨ TƯ",
  "THỨ NĂM",
  "THỨ SÁU",
  "THỨ BẢY",
];

const props = defineProps({
  wedding: {
    type: Object,
    default: () => ({}),
  },
});

const wedding = computed(() => props.wedding || {});

/* =========================================================
   COUPLE
========================================================= */

const groomName = computed(
  () =>
    wedding.value?.GroomName ||
    wedding.value?.groomName ||
    wedding.value?.couple?.Groom?.Name ||
    ""
);

const brideName = computed(
  () =>
    wedding.value?.BrideName ||
    wedding.value?.brideName ||
    wedding.value?.couple?.Bride?.Name ||
    ""
);

const groomRole = computed(
  () => wedding.value?.couple?.Groom?.Role || "Trưởng Nam"
);

const brideRole = computed(
  () => wedding.value?.couple?.Bride?.Role || "Út Nữ"
);

/* =========================================================
   PARENTS
========================================================= */

const groomFather = computed(() => wedding.value?.couple?.Groom?.Father || "");

const groomMother = computed(() => wedding.value?.couple?.Groom?.Mother || "");

const brideFather = computed(() => wedding.value?.couple?.Bride?.Father || "");

const brideMother = computed(() => wedding.value?.couple?.Bride?.Mother || "");

const groomAddress = computed(() => wedding.value?.couple?.Groom?.Address || "");

const brideAddress = computed(() => wedding.value?.couple?.Bride?.Address || "");

const hasGroomFamily = computed(() =>
  Boolean(groomFather.value || groomMother.value || groomAddress.value)
);

const hasBrideFamily = computed(() =>
  Boolean(brideFather.value || brideMother.value || brideAddress.value)
);

const hasFamilyInfo = computed(
  () => hasGroomFamily.value || hasBrideFamily.value
);

/* =========================================================
   DATE
========================================================= */

const primaryEvent = computed(() => wedding.value?.events?.[0] || {});

const weddingDate = computed(
  () =>
    wedding.value?.weddingDate ||
    wedding.value?.hero?.WeddingDate ||
    primaryEvent.value?.EventDate ||
    ""
);

const parsedDate = computed(() => {
  if (!weddingDate.value) {
    return null;
  }

  const date = dayjs(weddingDate.value);

  return date.isValid() ? date : null;
});

const time = computed(
  () => primaryEvent.value?.EventTime || parsedDate.value?.format("HH:mm") || ""
);

const weekday = computed(() => {
  if (primaryEvent.value?.Weekday) {
    return primaryEvent.value.Weekday;
  }

  return parsedDate.value ? WEEKDAYS[parsedDate.value.day()] : "";
});

const day = computed(() =>
  primaryEvent.value?.Day
    ? String(primaryEvent.value.Day).padStart(2, "0")
    : parsedDate.value?.format("DD") || ""
);

const month = computed(() =>
  primaryEvent.value?.Month
    ? String(primaryEvent.value.Month).padStart(2, "0")
    : parsedDate.value?.format("MM") || ""
);

const year = computed(
  () => primaryEvent.value?.Year || parsedDate.value?.format("YYYY") || ""
);

const lunar = computed(() => primaryEvent.value?.Lunar || "");

const hasDate = computed(() =>
  Boolean(time.value || weekday.value || day.value || month.value || year.value)
);

const location = computed(
  () =>
    primaryEvent.value?.Location ||
    wedding.value?.hero?.Location ||
    ""
);
</script>

<style scoped>
.mw-couple {
  text-align: center;
}

/* =========================================================
   HAI HỌ
========================================================= */

.mw-parents {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);

  width: 100%;
  max-width: 366px;

  margin: 24px auto 0;
}

.mw-parents__col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  min-width: 0;
}

.mw-parents__divider {
  width: 1px;
  height: 60px;

  align-self: center;

  background-color: var(--mw-blue);
}

.mw-parents__label {
  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 14px;
  font-weight: 400;

  letter-spacing: 0.05em;
  white-space: pre-line;
}

.mw-parents__name {
  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 13px;
  font-weight: 400;

  letter-spacing: 0.05em;
  overflow-wrap: anywhere;
}

.mw-parents__address {
  max-width: 169px;

  margin-top: 4px;

  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 11px;
  font-weight: 400;

  line-height: 1.5;
  white-space: pre-line;
}

/* =========================================================
   BÁO TIN
========================================================= */

.mw-couple__announce {
  max-width: 300px;

  margin: 32px auto 0;

  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 16px;
  font-weight: 400;

  letter-spacing: 0.05em;
  line-height: 1.6;
  white-space: pre-line;
}

/* =========================================================
   TÊN
========================================================= */

.mw-couple__names {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  margin-top: 28px;
}

.mw-couple__name {
  margin: 0;

  color: var(--mw-blue);

  font-family: var(--mw-font-script);
  font-size: 38px;
  font-weight: 400;

  line-height: 1.3;
  white-space: nowrap;
}

.mw-couple__role {
  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 12px;
  font-weight: 400;

  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.mw-couple__amp {
  color: var(--mw-blue);

  font-family: var(--mw-font-script);
  font-size: 35px;

  line-height: 1;
}

/* =========================================================
   THỜI GIAN
========================================================= */

.mw-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  margin-top: 32px;
}

.mw-date__place {
  margin: 0;

  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 16px;
  font-weight: 400;

  letter-spacing: 0.05em;
  line-height: 1.6;
  white-space: pre-line;
}

.mw-date__lead {
  margin: 0 0 8px;

  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 16px;
  font-weight: 400;

  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.mw-date__time {
  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 20px;
  font-weight: 400;

  letter-spacing: 0.05em;
}

.mw-date__row {
  display: flex;
  align-items: center;
  gap: 24px;

  color: var(--mw-blue);
}

.mw-date__weekday,
.mw-date__month {
  font-family: var(--mw-font-serif);
  font-size: 12px;
  font-weight: 400;

  letter-spacing: 0.05em;
}

.mw-date__bar {
  width: 2px;
  height: 24px;

  background-color: var(--mw-blue);
}

.mw-date__day {
  font-family: var(--mw-font-serif);
  font-size: 30px;
  font-weight: 400;
}

.mw-date__year {
  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 18px;
  font-weight: 400;

  letter-spacing: 0.05em;
}

.mw-date__lunar {
  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 12px;
  font-weight: 400;

  letter-spacing: 0.25em;
  text-transform: uppercase;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .mw-parents {
    max-width: 520px;
  }

  .mw-parents__divider {
    height: 80px;
  }

  .mw-parents__label,
  .mw-parents__name {
    font-size: 18px;
  }

  .mw-parents__address {
    max-width: 240px;

    font-size: 18px;
  }

  .mw-couple__announce {
    max-width: 560px;

    font-size: 18px;
  }

  .mw-couple__name {
    font-size: 38px;
  }

  .mw-couple__amp {
    font-size: 48px;
  }

  .mw-date__place,
  .mw-date__lead {
    font-size: 18px;
  }

  .mw-date__time {
    font-size: 30px;
  }

  .mw-date__weekday,
  .mw-date__month {
    font-size: 16px;
  }

  .mw-date__bar {
    height: 32px;
  }

  .mw-date__day {
    font-size: 40px;
  }

  .mw-date__year {
    font-size: 24px;
  }

  .mw-date__lunar {
    font-size: 14px;
  }
}
</style>
