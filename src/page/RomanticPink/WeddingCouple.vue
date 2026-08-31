<template>
  <section class="wedding-info">

    <!-- ================================
         HEADER
    ================================= -->

    <div class="section-heading">
      <div class="heading-line"></div>

      <div class="heading-content">
        <span class="heading-subtitle">
          TRÂN TRỌNG BÁO HỶ
        </span>

        <h2>
          THÔNG TIN LỄ CƯỚI
        </h2>

        <div class="double-happiness">
          囍
        </div>
      </div>

      <div class="heading-line"></div>
    </div>


    <!-- ================================
         CÔ DÂU & CHÚ RỂ
    ================================= -->

    <div class="couple-names">

      <!-- CHÚ RỂ -->

      <div class="person">

        <div class="person-role">
          CHÚ RỂ
        </div>

        <h3>
          {{ groomName }}
        </h3>

        <div class="name-decoration">
          <span></span>
          <i>✦</i>
          <span></span>
        </div>

      </div>


      <!-- CENTER -->

      <div class="couple-mark">
        <span></span>

        <strong>
          囍
        </strong>

        <span></span>
      </div>


      <!-- CÔ DÂU -->

      <div class="person">

        <div class="person-role">
          CÔ DÂU
        </div>

        <h3>
          {{ brideName }}
        </h3>

        <div class="name-decoration">
          <span></span>
          <i>✦</i>
          <span></span>
        </div>

      </div>

    </div>


    <!-- ================================
         THỜI GIAN
    ================================= -->

    <div
      v-if="hasDate"
      class="wedding-date"
    >

      <div class="date-label">
        THỜI GIAN CỬ HÀNH
      </div>


      <!-- GIỜ -->

      <div
        v-if="time"
        class="date-time"
      >
        {{ time }}
      </div>


      <!-- THỨ + NGÀY + THÁNG -->

      <div class="date-main">

        <span
          v-if="weekday"
          class="weekday"
        >
          {{ weekday }}
        </span>

        <span
          v-if="day"
          class="day"
        >
          {{ day }}
        </span>

        <span
          v-if="month"
          class="month"
        >
          THÁNG {{ month }}
        </span>

      </div>


      <!-- NĂM -->

      <div
        v-if="year"
        class="year"
      >
        {{ year }}
      </div>

    </div>


    <!-- ================================
         ĐỊA CHỈ
    ================================= -->

    <div
      v-if="location || address"
      class="location"
    >

      <div class="location-icon">
        ◈
      </div>

      <strong v-if="location">
        {{ location }}
      </strong>

      <span v-if="address">
        {{ address }}
      </span>

    </div>

  </section>
</template>


<script setup>
import { computed } from "vue";
import dayjs from "dayjs";

const props = defineProps({
  wedding: {
    type: Object,
    default: () => ({}),
  },
});

const wedding = computed(() => props.wedding || {});


// ========================================
// COUPLE
// ========================================

const groomName = computed(() =>
  wedding.value?.GroomName ||
  wedding.value?.couple?.Groom?.Name ||
  "",
);

const brideName = computed(() =>
  wedding.value?.BrideName ||
  wedding.value?.couple?.Bride?.Name ||
  "",
);


// ========================================
// PARENTS
// ========================================

const groomFather = computed(() =>
  wedding.value?.couple?.Groom?.Father ||
  "",
);

const groomMother = computed(() =>
  wedding.value?.couple?.Groom?.Mother ||
  "",
);

const brideFather = computed(() =>
  wedding.value?.couple?.Bride?.Father ||
  "",
);

const brideMother = computed(() =>
  wedding.value?.couple?.Bride?.Mother ||
  "",
);


// ========================================
// FAMILY CHECK
// ========================================

const hasGroomFamily = computed(() =>
  Boolean(
    groomFather.value ||
    groomMother.value,
  ),
);

const hasBrideFamily = computed(() =>
  Boolean(
    brideFather.value ||
    brideMother.value,
  ),
);

const hasFamilyInfo = computed(() =>
  hasGroomFamily.value ||
  hasBrideFamily.value,
);


// ========================================
// DATE
// ========================================

const weddingDate = computed(() => {
  return (
    wedding.value?.weddingDate ||
    wedding.value?.hero?.WeddingDate ||
    wedding.value?.events?.[0]?.EventDate ||
    ""
  );
});


const parsedDate = computed(() => {
  if (!weddingDate.value) {
    return null;
  }

  const date = dayjs(weddingDate.value);

  return date.isValid()
    ? date
    : null;
});


const time = computed(() => {
  if (!parsedDate.value) {
    return "";
  }

  return parsedDate.value.format("HH:mm");
});


const weekday = computed(() => {
  if (!parsedDate.value) {
    return "";
  }

  const weekdays = [
    "CHỦ NHẬT",
    "THỨ HAI",
    "THỨ BA",
    "THỨ TƯ",
    "THỨ NĂM",
    "THỨ SÁU",
    "THỨ BẢY",
  ];

  return weekdays[parsedDate.value.day()];
});


const day = computed(() => {
  if (!parsedDate.value) {
    return "";
  }

  return parsedDate.value.format("DD");
});


const month = computed(() => {
  if (!parsedDate.value) {
    return "";
  }

  return parsedDate.value.format("MM");
});


const year = computed(() => {
  if (!parsedDate.value) {
    return "";
  }

  return parsedDate.value.format("YYYY");
});


const hasDate = computed(() =>
  Boolean(
    time.value ||
    weekday.value ||
    day.value ||
    month.value ||
    year.value,
  ),
);


// ========================================
// LOCATION
// ========================================

const location = computed(() =>
  wedding.value?.events?.[0]?.Location ||
  wedding.value?.hero?.Location ||
  "",
);

const address = computed(() =>
  wedding.value?.events?.[0]?.Address ||
  "",
);
</script>


<style scoped>
/* =====================================================
   ROOT
===================================================== */

.wedding-info {
  position: relative;

  width: 100%;

  padding:
    12px
    8px
    20px;

  color: #701216;

  text-align: center;
}


/* =====================================================
   HEADER
===================================================== */

.section-heading {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 12px;

  margin-bottom: 30px;
}

.heading-content {
  flex-shrink: 0;
}

.heading-line {
  width: 45px;
  height: 1px;

  background:
    linear-gradient(
      to right,
      transparent,
      #b78b48
    );
}

.heading-line:last-child {
  background:
    linear-gradient(
      to left,
      transparent,
      #b78b48
    );
}

.heading-subtitle {
  display: block;

  margin-bottom: 5px;

  color: #b08748;

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 3px;
}

.section-heading h2 {
  margin: 0;

  color: #821419;

  font-size: 22px;
  font-weight: 800;

  letter-spacing: 2px;

  line-height: 1.2;
}

.double-happiness {
  margin-top: 7px;

  color: #a3171b;

  font-family: "Times New Roman", serif;

  font-size: 27px;
  font-weight: 700;

  line-height: 1;
}


/* =====================================================
   FAMILY
===================================================== */

.families {
  display: grid;

  grid-template-columns: 1fr auto 1fr;

  align-items: center;

  width: 100%;

  margin:
    0
    auto
    32px;

  padding:
    17px
    5px;

  border-top:
    1px solid rgba(176, 135, 72, .4);

  border-bottom:
    1px solid rgba(176, 135, 72, .4);
}

.family {
  min-width: 0;
}

.family-label {
  margin-bottom: 10px;

  color: #ad8446;

  font-size: 8px;
  font-weight: 800;

  letter-spacing: 1.7px;
}

.parent {
  display: flex;
  align-items: baseline;
  justify-content: center;

  gap: 4px;

  margin-top: 5px;

  color: #4f4439;

  line-height: 1.4;
}

.parent-role {
  color: #9a7847;

  font-size: 8px;
  font-weight: 700;
}

.parent strong {
  font-size: 12px;
  font-weight: 700;

  white-space: nowrap;
}

.family-divider {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 5px;

  padding: 0 8px;
}

.family-divider span {
  width: 1px;
  height: 18px;

  background: #c6a66e;
}

.family-divider b {
  color: #9b171b;

  font-family: "Times New Roman", serif;

  font-size: 18px;
}


/* =====================================================
   NAMES
===================================================== */

.couple-names {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    42px
    minmax(0, 1fr);

  align-items: center;

  margin:
    0
    auto
    32px;
}

.person {
  min-width: 0;
}

.person-role {
  margin-bottom: 7px;

  color: #ae8547;

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 2px;
}

.person h3 {
  margin: 0;

  color: #811419;

  font-size: 22px;
  font-weight: 800;

  line-height: 1.25;

  letter-spacing: .5px;
}

.name-decoration {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 6px;

  margin-top: 8px;
}

.name-decoration span {
  width: 25px;
  height: 1px;

  background: #c09a5d;
}

.name-decoration i {
  color: #b1874a;

  font-size: 7px;

  font-style: normal;
}

.couple-mark {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 5px;
}

.couple-mark span {
  width: 1px;
  height: 15px;

  background: #c5a269;
}

.couple-mark strong {
  color: #9c161a;

  font-family: "Times New Roman", serif;

  font-size: 25px;
}


/* =====================================================
   DATE
===================================================== */

.wedding-date {
  margin:
    5px
    auto
    28px;

  padding-top: 5px;
}

.date-label {
  margin-bottom: 9px;

  color: #ae8548;

  font-size: 8px;
  font-weight: 800;

  letter-spacing: 2.5px;
}


/* =====================================================
   TIME - NẰM TRÊN
===================================================== */

.date-time {
  margin-bottom: 7px;

  color: #7d1318;

  font-size: 25px;
  font-weight: 800;

  letter-spacing: 2px;

  line-height: 1;
}


/* =====================================================
   DAY + MONTH
===================================================== */

.date-main {
  display: flex;
  align-items: baseline;
  justify-content: center;

  gap: 8px;

  color: #741317;

  white-space: nowrap;
}

.weekday {
  font-size: 11px;
  font-weight: 800;

  letter-spacing: 1px;
}

.day {
  color: #9b171b;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 47px;
  font-weight: 900;

  line-height: .9;
}

.month {
  font-size: 12px;
  font-weight: 800;

  letter-spacing: 1px;
}


/* =====================================================
   YEAR - NẰM DƯỚI
===================================================== */

.year {
  margin-top: 8px;

  color: #866641;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 15px;
  font-weight: 800;

  letter-spacing: 4px;
}


/* =====================================================
   LOCATION
===================================================== */

.location {
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-top: 25px;

  padding-top: 18px;

  border-top:
    1px solid rgba(180, 140, 75, .25);
}

.location-icon {
  margin-bottom: 5px;

  color: #ae8446;

  font-size: 14px;
}

.location strong {
  color: #761419;

  font-size: 13px;
  font-weight: 800;

  letter-spacing: .3px;
}

.location span {
  max-width: 330px;

  margin-top: 4px;

  color: #77624d;

  font-size: 11px;
  font-weight: 600;

  line-height: 1.6;
}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {

  .wedding-info {
    padding-left: 4px;
    padding-right: 4px;
  }

  .families {
    padding-left: 0;
    padding-right: 0;
  }

  .family-divider {
    padding: 0 5px;
  }

  .parent {
    flex-direction: column;
    align-items: center;

    gap: 0;
  }

  .parent-role {
    font-size: 7px;
  }

  .parent strong {
    font-size: 10px;
  }

  .person h3 {
    font-size: 19px;
  }

  .date-time {
    font-size: 23px;
  }

  .day {
    font-size: 42px;
  }

  .weekday {
    font-size: 9px;
  }

  .month {
    font-size: 10px;
  }
}
</style>
