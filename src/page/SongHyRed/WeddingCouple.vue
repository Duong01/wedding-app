<template>
  <section class="shy-couple">
    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="shy-bar">THÔNG TIN LỄ CƯỚI</h2>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="shy-couple__inner">
      <!-- ÔNG BÀ HAI HỌ -->
      <div class="shy-parents">
        <div class="shy-parents__col">
          <span class="shy-parents__label">Ông Bà</span>

          <span v-if="groomFather" class="shy-parents__name">{{ groomFather }}</span>

          <span v-if="groomMother" class="shy-parents__name">{{ groomMother }}</span>

          <p v-if="groomAddress" class="shy-parents__address">{{ groomAddress }}</p>
        </div>

        <div class="shy-parents__divider" aria-hidden="true"></div>

        <div class="shy-parents__col">
          <span class="shy-parents__label">Ông Bà</span>

          <span v-if="brideFather" class="shy-parents__name">{{ brideFather }}</span>

          <span v-if="brideMother" class="shy-parents__name">{{ brideMother }}</span>

          <p v-if="brideAddress" class="shy-parents__address">{{ brideAddress }}</p>
        </div>
      </div>

      <!-- BÁO TIN -->
      <p class="shy-couple__announce">
        TRÂN TRỌNG BÁO TIN
        LỄ THÀNH HÔN CỦA CON CHÚNG TÔI
      </p>

      <!-- TÊN CÔ DÂU CHÚ RỂ -->
      <div class="shy-couple__names">
        <h3 class="shy-couple__name">{{ groom }}</h3>

        <span class="shy-couple__role">{{ groomRole }}</span>

        <div class="shy-couple__amp" aria-hidden="true">&amp;</div>

        <h3 class="shy-couple__name">{{ bride }}</h3>

        <span class="shy-couple__role">{{ brideRole }}</span>
      </div>

      <!-- NGÀY CƯỚI -->
      <div class="shy-couple__date">
        <p class="shy-couple__date-intro">
          LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI
          {{ ceremonyPlace }}
        </p>

        <p v-if="weddingTime" class="shy-couple__time">VÀO LÚC {{ weddingTime }}</p>

        <div class="shy-couple__date-row">
          <span class="shy-couple__weekday">{{ weddingWeekday }}</span>

          <span class="shy-couple__sep" aria-hidden="true"></span>

          <span class="shy-couple__day">{{ weddingDay }}</span>

          <span class="shy-couple__sep" aria-hidden="true"></span>

          <span class="shy-couple__weekday">THÁNG {{ weddingMonth }}</span>
        </div>

        <p class="shy-couple__year">{{ weddingYear }}</p>

        <p v-if="weddingLunar" class="shy-couple__lunar">({{ weddingLunar }})</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

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

const groomRole = computed(
  () => props.wedding?.couple?.Groom?.Role || "ÚT NAM"
);

const brideRole = computed(
  () => props.wedding?.couple?.Bride?.Role || "ÚT NỮ"
);

const groomFather = computed(() => props.wedding?.couple?.Groom?.Father || "");
const groomMother = computed(() => props.wedding?.couple?.Groom?.Mother || "");
const brideFather = computed(() => props.wedding?.couple?.Bride?.Father || "");
const brideMother = computed(() => props.wedding?.couple?.Bride?.Mother || "");

const groomAddress = computed(() => props.wedding?.couple?.Groom?.Address || "");
const brideAddress = computed(() => props.wedding?.couple?.Bride?.Address || "");

const ceremonyPlace = computed(
  () =>
    props.wedding?.events?.[0]?.Location ||
    props.wedding?.hero?.Location ||
    "TƯ GIA"
);

const weddingDate = computed(
  () =>
    props.wedding?.weddingDate ||
    props.wedding?.WeddingDate ||
    props.wedding?.hero?.weddingDate ||
    null
);

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
.shy-couple {
  --shy-bg: var(--background, #fff7eb);
  --shy-ink: var(--text, #666666);
  --shy-red: var(--primary, #800000);
  --shy-cream: var(--accent-light, #ffeed2);

  position: relative;

  overflow: hidden;

  color: var(--shy-ink);

  background-color: var(--shy-bg);

  font-family: Baskerville, "Times New Roman", serif;
}

/* =========================================================
   THANH TIÊU ĐỀ ĐỎ
========================================================= */

.shy-bar {
  margin: 0;

  padding: 12px 16px;

  color: var(--shy-cream);

  background: var(--shy-red);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-align: center;
  text-transform: uppercase;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.shy-couple__inner {
  width: min(100%, 441px);

  margin: 0 auto;

  padding: 24px 8px 40px;

  text-align: center;
}

/* =========================================================
   ÔNG BÀ HAI HỌ
========================================================= */

.shy-parents {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
}

.shy-parents__col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  min-width: 0;

  text-align: center;
}

.shy-parents__label {
  color: var(--shy-ink);

  font-size: 14px;
}

.shy-parents__name {
  color: var(--shy-red);

  font-size: 14px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.shy-parents__address {
  margin: 4px 0 0;

  color: var(--shy-ink);

  font-size: 12px;

  line-height: 1.35;
}

.shy-parents__divider {
  width: 1px;
  height: 60px;

  background: var(--shy-red);
}

/* =========================================================
   BÁO TIN
========================================================= */

.shy-couple__announce {
  margin: 32px auto 0;

  color: var(--shy-red);

  font-size: 16px;

  letter-spacing: 0.05em;

  line-height: 1.6;

  white-space: pre-line;
}

/* =========================================================
   TÊN CÔ DÂU CHÚ RỂ
========================================================= */

.shy-couple__names {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  margin-top: 16px;
}

.shy-couple__name {
  margin: 0;

  color: var(--shy-red);

  font-family: "EB Garamond", "Times New Roman", serif;
  font-size: 40px;
  font-weight: 500;

  line-height: 1.1;

  white-space: nowrap;
}

.shy-couple__role {
  color: var(--shy-ink);

  font-size: 12px;

  letter-spacing: 0.2em;
  text-indent: 0.2em;

  text-transform: uppercase;
}

.shy-couple__amp {
  color: var(--shy-ink);

  font-family: "EB Garamond", "Times New Roman", serif;
  font-size: 30px;
}

/* =========================================================
   NGÀY CƯỚI
========================================================= */

.shy-couple__date {
  margin-top: 32px;
}

.shy-couple__date-intro {
  margin: 0;

  color: var(--shy-red);

  font-size: 16px;

  line-height: 1.6;

  white-space: pre-line;
}

.shy-couple__time {
  margin: 8px 0 0;

  color: var(--shy-ink);

  font-size: 14px;

  text-transform: uppercase;
}

.shy-couple__date-row {
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 20px;
}

.shy-couple__weekday {
  width: 70px;

  color: var(--shy-ink);

  font-size: 14px;

  white-space: nowrap;

  text-transform: uppercase;
}

.shy-couple__weekday:first-child {
  text-align: right;
}

.shy-couple__weekday:last-child {
  text-align: left;
}

.shy-couple__sep {
  width: 1px;
  height: 25px;

  margin: 0 12px;

  background: color-mix(in srgb, var(--shy-ink) 50%, transparent);
}

.shy-couple__day {
  color: var(--shy-red);

  font-size: 32px;
}

.shy-couple__year {
  margin: 8px 0 0;

  color: var(--shy-ink);

  font-size: 20px;
}

.shy-couple__lunar {
  margin: 8px 0 0;

  color: var(--shy-ink);

  font-size: 13px;

  letter-spacing: 0.05em;

  text-transform: uppercase;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shy-bar {
    padding: 16px;

    font-size: 24px;
  }

  .shy-couple__inner {
    width: min(100%, 600px);

    padding: 32px 5px 52px;
  }

  .shy-parents {
    gap: 32px;
  }

  .shy-parents__label {
    font-size: 15px;
  }

  .shy-parents__name {
    font-size: 15px;
  }

  .shy-parents__address {
    font-size: 13px;
  }

  .shy-couple__announce {
    font-size: 20px;
  }

  .shy-couple__name {
    font-size: 42px;
  }

  .shy-couple__role {
    font-size: 13px;
  }

  .shy-couple__amp {
    font-size: 35px;
  }

  .shy-couple__date-intro {
    font-size: 20px;
  }

  .shy-couple__time {
    font-size: 15px;
  }

  .shy-couple__weekday {
    width: 85px;

    font-size: 15px;
  }

  .shy-couple__sep {
    margin: 0 16px;
  }

  .shy-couple__day {
    font-size: 38px;
  }

  .shy-couple__year {
    font-size: 22px;
  }

  .shy-couple__lunar {
    font-size: 14px;
  }
}
</style>
