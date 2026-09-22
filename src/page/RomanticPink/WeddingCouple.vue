<template>
  <section class="couple">
    <!-- =========================
         TITLE
    ========================== -->
    <div class="gg-eyebrow">TRÂN TRỌNG BÁO TIN</div>

    <h2 class="gg-title">Thông tin lễ cưới</h2>

    <!-- =========================
         PARENTS
    ========================== -->
    <div class="parents-grid">
      <!-- NHÀ TRAI -->
      <div class="parents-col parents-col--groom">
        <span class="parents-label">Ông Bà</span>

        <p v-if="groomParents?.Father" class="parents-name">
          {{ groomParents.Father }}
        </p>

        <p v-if="groomParents?.Mother" class="parents-name">
          {{ groomParents.Mother }}
        </p>

        <span v-if="groomAddress" class="parents-place">
          {{ groomAddress }}
        </span>
      </div>

      <!-- VÁCH NGĂN -->
      <div class="parents-divider"></div>

      <!-- NHÀ GÁI -->
      <div class="parents-col parents-col--bride">
        <span class="parents-label">Ông Bà</span>

        <p v-if="brideParents?.Father" class="parents-name">
          {{ brideParents.Father }}
        </p>

        <p v-if="brideParents?.Mother" class="parents-name">
          {{ brideParents.Mother }}
        </p>

        <span v-if="brideAddress" class="parents-place">
          {{ brideAddress }}
        </span>
      </div>
    </div>

    <!-- =========================
         COUPLE
    ========================== -->
    <div class="couple-names">
      <div class="person">
        <h3>{{ groom }}</h3>
        <span class="role">{{ groomRole }}</span>
      </div>

      <div class="couple-amp">
        <i>&amp;</i>
      </div>

      <div class="person">
        <h3>{{ bride }}</h3>
        <span class="role">{{ brideRole }}</span>
      </div>
    </div>

    <!-- =========================
         WEDDING DATE
    ========================== -->
    <div class="wedding-date">
      <p class="date-lead">LỄ THÀNH HÔN TẠI</p>

      <p v-if="location" class="date-place">{{ location }}</p>

      <p v-if="weddingTime" class="date-time-lead">
        VÀO LÚC
        <strong>{{ weddingTime }}</strong>
      </p>

      <!-- THỨ -->
      <div class="date-weekday">
        <span class="date-line"></span>
        <span>{{ weddingWeekday }}</span>
        <span class="date-line"></span>
      </div>

      <!-- NGÀY / THÁNG / NĂM -->
      <div class="date-main">
        <div class="date-side">
          <span>THÁNG</span>
          <strong>{{ weddingMonth }}</strong>
        </div>

        <div class="date-day">{{ weddingDay }}</div>

        <div class="date-side">
          <span>NĂM</span>
          <strong>{{ weddingYear }}</strong>
        </div>
      </div>

      <!-- ÂM LỊCH -->
      <p v-if="weddingLunar" class="date-lunar">
        ( Tức ngày {{ weddingLunar }} )
      </p>
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

  guestName: {
    type: String,
    default: "Quý khách",
  },
});

/* =====================================================
   COUPLE
===================================================== */

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

const groomRole = computed(
  () => props.wedding?.couple?.Groom?.Role || "trưởng nam"
);

const brideRole = computed(
  () => props.wedding?.couple?.Bride?.Role || "con gái út"
);

/* =====================================================
   PARENTS
===================================================== */

const groomParents = computed(() => props.wedding?.couple?.Groom || {});

const brideParents = computed(() => props.wedding?.couple?.Bride || {});

const groomAddress = computed(
  () =>
    props.wedding?.couple?.Groom?.Address ||
    props.wedding?.couple?.Groom?.Place ||
    ""
);

const brideAddress = computed(
  () =>
    props.wedding?.couple?.Bride?.Address ||
    props.wedding?.couple?.Bride?.Place ||
    ""
);

/* =====================================================
   LOCATION
===================================================== */

const location = computed(() => {
  const event = Array.isArray(props.wedding?.events)
    ? props.wedding.events[0]
    : null;

  return (
    event?.Location ||
    event?.Address ||
    props.wedding?.hero?.Location ||
    ""
  );
});

/* =====================================================
   DATE
===================================================== */

const weddingDate = computed(() => {
  return (
    props.wedding?.weddingDate ||
    props.wedding?.WeddingDate ||
    props.wedding?.hero?.weddingDate ||
    null
  );
});

const dateObject = computed(() => {
  if (!weddingDate.value) return null;

  const date = new Date(weddingDate.value);

  return Number.isNaN(date.getTime()) ? null : date;
});

const weddingDay = computed(() => {
  if (!dateObject.value) return "--";

  return String(dateObject.value.getDate()).padStart(2, "0");
});

const weddingMonth = computed(() => {
  if (!dateObject.value) return "--";

  return String(dateObject.value.getMonth() + 1).padStart(2, "0");
});

const weddingYear = computed(() => {
  if (!dateObject.value) return "----";

  return dateObject.value.getFullYear();
});

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

/* =====================================================
   LUNAR DATE
===================================================== */

const weddingLunar = computed(() => {
  return (
    props.wedding?.weddingLunar ||
    props.wedding?.WeddingLunar ||
    props.wedding?.lunarDate ||
    props.wedding?.LunarDate ||
    ""
  );
});

/* =====================================================
   TIME
===================================================== */

const weddingTime = computed(() => {
  const event = Array.isArray(props.wedding?.events)
    ? props.wedding.events[0]
    : null;

  const time =
    event?.Time ||
    event?.time ||
    event?.StartTime ||
    event?.startTime ||
    event?.EventTime ||
    event?.eventTime ||
    props.wedding?.time ||
    props.wedding?.Time ||
    props.wedding?.weddingTime ||
    props.wedding?.WeddingTime ||
    props.wedding?.hero?.time ||
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
.couple {
  text-align: center;
}

/* =====================================================
   PARENTS
===================================================== */

.parents-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 1px minmax(0, 1fr);
  align-items: start;

  gap: 0 18px;

  margin-top: 26px;
}

.parents-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;

  min-width: 0;
}

.parents-label {
  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.7;
}

.parents-name {
  margin: 0;

  color: var(--gg-deep, #933845);
  font-family: "EB Garamond", serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.parents-place {
  margin-top: 4px;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 11px;
  line-height: 1.5;
  opacity: 0.7;
}

.parents-divider {
  width: 1px;
  height: 60px;

  background-color: var(--gg-deep, #933845);
  opacity: 0.5;
}

/* =====================================================
   COUPLE NAMES
===================================================== */

.couple-names {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;

  gap: 0 10px;

  margin-top: 30px;
}

.person {
  min-width: 0;
}

.couple-names h3 {
  margin: 0;

  color: var(--gg-rose, #cb5d6c);
  font-family: "EB Garamond", serif;
  font-size: 30px;
  font-weight: 500;
  line-height: 1.15;
}

.role {
  display: block;
  margin-top: 4px;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.8;
}

.couple-amp {
  display: flex;
  align-items: center;
  justify-content: center;
}

.couple-amp i {
  color: var(--gg-rose, #cb5d6c);
  font-family: "Ms Madi", cursive;
  font-size: 30px;
  font-style: normal;
  line-height: 1;
}

/* =====================================================
   WEDDING DATE
===================================================== */

.wedding-date {
  margin-top: 34px;
}

.date-lead {
  margin: 0;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.8;
}

.date-place {
  max-width: 300px;
  margin: 6px auto 0;

  color: var(--gg-rose, #cb5d6c);
  font-family: "EB Garamond", serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}

.date-time-lead {
  margin: 12px 0 0;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.8;
}

.date-time-lead strong {
  display: block;
  margin-top: 2px;

  color: var(--gg-rose, #cb5d6c);
  font-family: "EB Garamond", serif;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* THỨ */

.date-weekday {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-top: 18px;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 11px;
  letter-spacing: 0.2em;
}

.date-line {
  width: 1px;
  height: 24px;
  background-color: var(--gg-deep, #933845);
  opacity: 0.6;
}

/* NGÀY / THÁNG / NĂM */

.date-main {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  max-width: 300px;
  margin: 10px auto 0;
}

.date-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.date-side span {
  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 10px;
  letter-spacing: 0.18em;
  opacity: 0.75;
}

.date-side strong {
  color: var(--gg-rose, #cb5d6c);
  font-family: "EB Garamond", serif;
  font-size: 20px;
  font-weight: 600;
}

.date-day {
  padding: 0 20px;

  color: var(--gg-rose, #cb5d6c);
  font-family: "EB Garamond", serif;
  font-size: 58px;
  font-weight: 600;
  line-height: 0.95;
}

.date-lunar {
  margin: 12px 0 0;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 11px;
  font-style: italic;
  letter-spacing: 0.04em;
  opacity: 0.75;
}

/* =====================================================
   DESKTOP
===================================================== */

@media (min-width: 900px) {
  .parents-grid {
    gap: 0 40px;
    margin-top: 32px;
  }

  .parents-divider {
    height: 80px;
  }

  .parents-name {
    font-size: 16px;
  }

  .couple-names {
    margin-top: 38px;
  }

  .couple-names h3 {
    font-size: 43px;
  }

  .couple-amp i {
    font-size: 40px;
  }

  .date-place {
    font-size: 17px;
  }

  .date-day {
    font-size: 66px;
  }
}

/* =====================================================
   MOBILE NHỎ
===================================================== */

@media (max-width: 360px) {
  .parents-grid {
    gap: 0 10px;
  }

  .parents-name {
    font-size: 12px;
  }

  .couple-names h3 {
    font-size: 25px;
  }

  .date-day {
    font-size: 50px;
    padding: 0 12px;
  }
}
</style>
