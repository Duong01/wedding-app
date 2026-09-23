<template>
  <section class="rr-couple">

    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="rr-title">
      {{ heading }}
    </h2>


    <!-- =====================================================
         GIA ĐÌNH HAI BÊN
    ====================================================== -->

    <div class="rr-couple__families">

      <!-- NHÀ GÁI -->

      <div class="rr-couple__family">
        <span class="rr-couple__family-label">
          {{ brideFamilyLabel }}
        </span>

        <span
          v-for="(name, index) in brideParents"
          :key="`b-${index}`"
          class="rr-couple__family-name"
        >
          {{ name }}
        </span>

        <span v-if="brideAddress" class="rr-couple__family-address">
          {{ brideAddress }}
        </span>
      </div>


      <span class="rr-couple__divider" aria-hidden="true"></span>


      <!-- NHÀ TRAI -->

      <div class="rr-couple__family">
        <span class="rr-couple__family-label">
          {{ groomFamilyLabel }}
        </span>

        <span
          v-for="(name, index) in groomParents"
          :key="`g-${index}`"
          class="rr-couple__family-name"
        >
          {{ name }}
        </span>

        <span v-if="groomAddress" class="rr-couple__family-address">
          {{ groomAddress }}
        </span>
      </div>

    </div>


    <!-- =====================================================
         CÔ DÂU CHÚ RỂ
    ====================================================== -->

    <div class="rr-couple__people">

      <h3 class="rr-couple__name">
        {{ bride }}
      </h3>

      <span class="rr-couple__role">
        {{ brideRole }}
      </span>

      <span class="rr-couple__amp" aria-hidden="true">&amp;</span>

      <h3 class="rr-couple__name">
        {{ groom }}
      </h3>

      <span class="rr-couple__role">
        {{ groomRole }}
      </span>

    </div>


    <!-- =====================================================
         LỄ THÀNH HÔN
    ====================================================== -->

    <div class="rr-couple__ceremony">

      <p v-if="ceremonyPlace" class="rr-couple__place">
        {{ ceremonyPlace }}
      </p>

      <p v-if="weddingTime" class="rr-couple__time">
        VÀO LÚC {{ weddingTime }}
      </p>

      <div class="rr-couple__date">

        <span class="rr-couple__weekday">
          {{ weddingWeekday }}
        </span>

        <span class="rr-couple__sep" aria-hidden="true">|</span>

        <span class="rr-couple__day">
          {{ weddingDay }}
        </span>

        <span class="rr-couple__sep" aria-hidden="true">|</span>

        <span class="rr-couple__month">
          THÁNG {{ weddingMonth }}
        </span>

      </div>

      <p class="rr-couple__year">
        {{ weddingYear }}
      </p>

      <p v-if="weddingLunar" class="rr-couple__lunar">
        {{ weddingLunar }}
      </p>

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

  guestName: {
    type: String,
    default: "Quý khách",
  },

  sections: {
    type: Object,
    default: () => ({}),
  },
});


/* =====================================================
   TIÊU ĐỀ MỤC
===================================================== */

const heading = computed(() =>
  sectionText(props.sections, "couple", "Heading", "Thông tin lễ cưới")
);


/* =====================================================
   CÔ DÂU CHÚ RỂ
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
  () => props.wedding?.couple?.Groom?.Role || "Út Nam"
);

const brideRole = computed(
  () => props.wedding?.couple?.Bride?.Role || "Trưởng Nữ"
);


/* =====================================================
   GIA ĐÌNH
===================================================== */

const groomFamilyLabel = computed(
  () => props.wedding?.couple?.Groom?.FamilyLabel || "Ông Bà"
);

const brideFamilyLabel = computed(
  () => props.wedding?.couple?.Bride?.FamilyLabel || "Ông Bà"
);

const groomParents = computed(() => {
  const data = props.wedding?.couple?.Groom || {};

  return [data.Father, data.Mother].filter(Boolean);
});

const brideParents = computed(() => {
  const data = props.wedding?.couple?.Bride || {};

  return [data.Father, data.Mother].filter(Boolean);
});

const groomAddress = computed(
  () => props.wedding?.couple?.Groom?.Address || ""
);

const brideAddress = computed(
  () => props.wedding?.couple?.Bride?.Address || ""
);


/* =====================================================
   NGÀY CƯỚI
===================================================== */

const weddingDate = computed(() => {
  return (
    props.wedding?.weddingDate ||
    props.wedding?.WeddingDate ||
    props.wedding?.hero?.WeddingDate ||
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
   ĐỊA ĐIỂM + GIỜ
===================================================== */

const ceremonyPlace = computed(() => {
  const event = Array.isArray(props.wedding?.events)
    ? props.wedding.events[0]
    : null;

  return (
    props.wedding?.ceremonyPlace ||
    event?.Location ||
    props.wedding?.hero?.Location ||
    ""
  );
});

const weddingTime = computed(() => {
  const event = Array.isArray(props.wedding?.events)
    ? props.wedding.events[0]
    : null;

  const time =
    event?.Time ||
    event?.StartTime ||
    event?.EventTime ||
    props.wedding?.time ||
    props.wedding?.weddingTime ||
    props.wedding?.hero?.Time ||
    "";

  if (!time) return "";

  /*
   * Nếu API trả về DateTime (2026-11-14T08:00:00)
   * thì chỉ lấy HH:mm.
   */
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

  /*
   * Nếu trả về 08:00:00 thì chuyển thành 08:00.
   */
  if (typeof time === "string" && time.length > 5) {
    return time.slice(0, 5);
  }

  return time;
});
</script>


<style scoped>
/* =====================================================
   SECTION
===================================================== */

.rr-couple {
  position: relative;

  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 28px;

  width: 100%;

  padding: 0 24px;

  color: var(--rr-red);

  text-align: center;
}


/* =====================================================
   GIA ĐÌNH HAI BÊN
===================================================== */

.rr-couple__families {
  display: grid;

  grid-template-columns: 1fr auto 1fr;

  align-items: center;

  column-gap: 12px;

  width: 100%;
}

.rr-couple__family {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 4px;

  min-width: 0;

  max-width: 160px;

  margin: 0 auto;
}

.rr-couple__family-label {
  font-size: 14px;

  line-height: 1.4;
}

.rr-couple__family-name {
  font-size: 14px;
  font-weight: 600;

  line-height: 1.4;

  overflow-wrap: anywhere;
}

.rr-couple__family-address {
  margin-top: 4px;

  font-size: 12px;

  line-height: 1.35;

  white-space: pre-line;
}

.rr-couple__divider {
  display: block;

  width: 1px;
  height: 60px;

  background-color: var(--rr-red);
}


/* =====================================================
   CÔ DÂU CHÚ RỂ
===================================================== */

.rr-couple__people {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 8px;

  width: 100%;
}

.rr-couple__name {
  margin: 0;

  color: var(--rr-red);

  font-family: var(--rr-font-name);
  font-size: 40px;
  font-weight: 400;

  line-height: 1.25;

  white-space: nowrap;
}

.rr-couple__role {
  font-size: 12px;

  letter-spacing: 0.2em;
  line-height: 1.4;

  text-transform: uppercase;
}

.rr-couple__amp {
  font-family: var(--rr-font-name);
  font-size: 35px;

  line-height: 1;
}


/* =====================================================
   LỄ THÀNH HÔN
===================================================== */

.rr-couple__ceremony {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 10px;

  width: 100%;
}

.rr-couple__place {
  margin: 0;

  font-size: 14px;

  line-height: 1.5;

  white-space: pre-line;
}

.rr-couple__time {
  margin: 0;

  font-size: 14px;

  line-height: 1.5;

  text-transform: uppercase;
}

.rr-couple__date {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;
}

.rr-couple__weekday,
.rr-couple__month {
  width: 70px;

  font-size: 14px;

  line-height: 1.4;

  text-transform: uppercase;
}

.rr-couple__weekday {
  text-align: right;
}

.rr-couple__month {
  text-align: left;
}

.rr-couple__sep {
  font-size: 14px;

  opacity: 0.5;
}

.rr-couple__day {
  font-size: 32px;

  line-height: 1.1;
}

.rr-couple__year {
  margin: 0;

  font-size: 20px;

  line-height: 1.3;
}

.rr-couple__lunar {
  margin: 0;

  font-size: 13px;

  line-height: 1.5;
}


/* =====================================================
   TABLET / DESKTOP
===================================================== */

@media (min-width: 768px) {
  .rr-couple {
    gap: 36px;

    padding: 0 40px;
  }

  .rr-couple__families {
    column-gap: 32px;
  }

  .rr-couple__family {
    max-width: 280px;
  }

  .rr-couple__family-label {
    font-size: 15px;
  }

  .rr-couple__family-name {
    font-size: 15px;
  }

  .rr-couple__family-address {
    font-size: 13px;
  }

  .rr-couple__name {
    font-size: 40px;
  }

  .rr-couple__role {
    font-size: 13px;
  }

  .rr-couple__amp {
    font-size: 48px;
  }

  .rr-couple__place,
  .rr-couple__time {
    font-size: 15px;
  }

  .rr-couple__weekday,
  .rr-couple__month {
    width: 85px;

    font-size: 15px;
  }

  .rr-couple__day {
    font-size: 38px;
  }

  .rr-couple__year {
    font-size: 22px;
  }

  .rr-couple__lunar {
    font-size: 14px;
  }
}


/* =====================================================
   MÀN HÌNH NHỎ
===================================================== */

@media (max-width: 380px) {
  .rr-couple__name {
    font-size: 32px;
  }

  .rr-couple__amp {
    font-size: 28px;
  }

  .rr-couple__weekday,
  .rr-couple__month {
    width: 60px;

    font-size: 12px;
  }

  .rr-couple__day {
    font-size: 28px;
  }
}
</style>
