<template>
  <section class="mg-couple">
    <p class="mg-eyebrow">TRÂN TRỌNG BÁO HỶ</p>

    <h2>Thông tin tiệc cưới</h2>

    <div class="mg-rule">
      <span></span>
      <i>✦</i>
      <span></span>
    </div>

    <div class="mg-people">
      <!-- CHÚ RỂ -->
      <article class="mg-person mg-person--groom">
        <div class="mg-person__parents">
          <p v-if="groomParents?.Father" class="mg-parents">Ông {{ groomParents.Father }}</p>
          <p v-if="groomParents?.Mother" class="mg-parents">Bà {{ groomParents.Mother }}</p>
        </div>

        <h3>{{ groom }}</h3>

        <span class="mg-person__role">CHÚ RỂ</span>

        <p class="mg-person__desc">{{ groomDescription }}</p>
      </article>

      <div class="mg-couple-divider"><i>&amp;</i></div>

      <!-- CÔ DÂU -->
      <article class="mg-person mg-person--bride">
        <div class="mg-person__parents">
          <p v-if="brideParents?.Father" class="mg-parents">Ông {{ brideParents.Father }}</p>
          <p v-if="brideParents?.Mother" class="mg-parents">Bà {{ brideParents.Mother }}</p>
        </div>

        <h3>{{ bride }}</h3>

        <span class="mg-person__role">CÔ DÂU</span>

        <p class="mg-person__desc">{{ brideDescription }}</p>
      </article>
    </div>

    <!-- WEDDING DATE -->
    <div class="mg-wedding-date">
      <div class="mg-date-top">
        <span class="mg-date-line"></span>
        <span class="mg-weekday">{{ weddingWeekday }}</span>
        <span class="mg-date-line"></span>
      </div>

      <div class="mg-date-main">
        <div class="mg-date-side">
          <span>THÁNG</span>
          <strong>{{ weddingMonth }}</strong>
        </div>

        <div class="mg-date-day">{{ weddingDay }}</div>

        <div class="mg-date-side">
          <span>NĂM</span>
          <strong>{{ weddingYear }}</strong>
        </div>
      </div>

      <div v-if="weddingLunar" class="mg-lunar">{{ weddingLunar }}</div>

      <div v-if="weddingTime" class="mg-wedding-time">
        <div class="mg-time-content">
          <span class="mg-time-label">THỜI GIAN</span>
          <strong>{{ weddingTime }}</strong>
        </div>
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
    "Chú rể"
);

const bride = computed(
  () =>
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.hero?.BrideName ||
    props.wedding?.couple?.Bride?.Name ||
    "Cô dâu"
);

const groomDescription = computed(
  () =>
    props.wedding?.couple?.Groom?.Description ||
    props.wedding?.couple?.Groom?.Address ||
    "Chú rể của gia đình chúng mình"
);

const brideDescription = computed(
  () =>
    props.wedding?.couple?.Bride?.Description ||
    props.wedding?.couple?.Bride?.Address ||
    "Cô dâu của gia đình chúng mình"
);

const groomParents = computed(() => props.wedding?.couple?.Groom || {});
const brideParents = computed(() => props.wedding?.couple?.Bride || {});

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

  const weekdays = ["CHỦ NHẬT", "THỨ HAI", "THỨ BA", "THỨ TƯ", "THỨ NĂM", "THỨ SÁU", "THỨ BẢY"];

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
      return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false });
    }
  }

  if (typeof time === "string" && /^\d{1,2}:\d{2}:\d{2}$/.test(time)) {
    return time.substring(0, 5);
  }

  return String(time);
});
</script>

<style scoped>
.mg-couple {
  position: relative;

  padding: 48px 22px 42px;

  text-align: center;

  color: #f0e6d2;

  overflow: hidden;
}

.mg-eyebrow {
  margin: 0;

  color: #d8b676;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.mg-couple h2 {
  margin: 6px 0 10px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;

  color: #f0e6d2;
}

.mg-rule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin: 0 auto;

  color: #d8b676;

  font-size: 14px;
}

.mg-rule span {
  width: 50px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(216, 182, 118, 0.7));
}

.mg-rule span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   PEOPLE
========================================================= */

.mg-people {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;

  margin-top: 30px;
}

.mg-person {
  min-width: 0;
}

.mg-person__parents {
  min-height: 38px;
}

.mg-parents {
  margin: 2px 0;

  color: #b9a88f;

  font-size: 11px;

  line-height: 1.35;

  letter-spacing: 0.03em;
}

.mg-people h3 {
  margin: 8px 0 4px;

  font-family: "Allura", cursive;
  font-size: 36px;
  font-weight: 400;

  line-height: 1.2;

  color: #d8b676;
}

.mg-person__role {
  display: block;

  color: #b9a88f;

  font-size: 9px;

  letter-spacing: 0.24em;
  font-weight: 700;
}

.mg-person__desc {
  margin: 7px 0 0;

  color: rgba(240, 230, 210, 0.72);

  font-size: 12px;
  font-style: italic;

  line-height: 1.5;
}

.mg-couple-divider {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
}

.mg-couple-divider i {
  color: #d8b676;

  font-family: "Allura", cursive;
  font-size: 34px;
  font-style: normal;
  font-weight: 400;
}

/* =========================================================
   WEDDING DATE
========================================================= */

.mg-wedding-date {
  position: relative;

  margin: 36px auto 0;
  max-width: 420px;
}

.mg-date-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-bottom: 14px;
}

.mg-weekday {
  color: #f0e6d2;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.mg-date-line {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(216, 182, 118, 0.7));
}

.mg-date-line:last-child {
  transform: rotate(180deg);
}

.mg-date-main {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  max-width: 300px;

  margin: auto;
}

.mg-date-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.mg-date-side span {
  color: #b9a88f;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.mg-date-side strong {
  color: #f0e6d2;

  font-size: 20px;
  font-weight: 600;
}

.mg-date-day {
  padding: 0 22px;

  color: #d8b676;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 66px;
  font-weight: 600;

  line-height: 0.95;
}

.mg-lunar {
  margin-top: 12px;

  color: #b9a88f;

  font-size: 11px;
  font-style: italic;

  letter-spacing: 0.05em;
}

.mg-wedding-time {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-top: 18px;
}

.mg-time-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  font-weight: 600;
}

.mg-time-label {
  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #b9a88f;
}

.mg-time-content strong {
  margin-top: 1px;

  color: #d8b676;

  font-size: 21px;
  font-weight: 600;

  line-height: 1;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {
  .mg-couple {
    padding: 40px 16px 36px;
  }

  .mg-people {
    gap: 6px;
  }

  .mg-people h3 {
    font-size: 30px;
  }

  .mg-parents {
    font-size: 10px;
  }

  .mg-person__desc {
    font-size: 11px;
  }

  .mg-couple-divider {
    width: 25px;
  }

  .mg-couple-divider i {
    font-size: 26px;
  }

  .mg-date-day {
    padding: 0 12px;

    font-size: 58px;
  }

  .mg-date-side strong {
    font-size: 18px;
  }

  .mg-date-line {
    width: 28px;
  }
}

@media (max-width: 360px) {
  .mg-people {
    gap: 3px;
  }

  .mg-people h3 {
    font-size: 26px;
  }

  .mg-person__desc {
    font-size: 10px;
  }

  .mg-date-day {
    font-size: 52px;
  }
}
</style>
