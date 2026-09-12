<template>
  <section class="sg-couple">
    <p class="sg-eyebrow">TRÂN TRỌNG BÁO HỶ</p>

    <h2>Thông tin tiệc cưới</h2>

    <div class="sg-rule">
      <span></span>
      <i>❀</i>
      <span></span>
    </div>

    <div class="sg-people">
      <!-- CHÚ RỂ -->
      <article class="sg-person sg-person--groom">
        <div class="sg-person__parents">
          <p v-if="groomParents?.Father" class="sg-parents">Ông {{ groomParents.Father }}</p>
          <p v-if="groomParents?.Mother" class="sg-parents">Bà {{ groomParents.Mother }}</p>
        </div>

        <h3>{{ groom }}</h3>

        <span class="sg-person__role">CHÚ RỂ</span>

        <p class="sg-person__desc">{{ groomDescription }}</p>
      </article>

      <div class="sg-couple-divider"><i>&amp;</i></div>

      <!-- CÔ DÂU -->
      <article class="sg-person sg-person--bride">
        <div class="sg-person__parents">
          <p v-if="brideParents?.Father" class="sg-parents">Ông {{ brideParents.Father }}</p>
          <p v-if="brideParents?.Mother" class="sg-parents">Bà {{ brideParents.Mother }}</p>
        </div>

        <h3>{{ bride }}</h3>

        <span class="sg-person__role">CÔ DÂU</span>

        <p class="sg-person__desc">{{ brideDescription }}</p>
      </article>
    </div>

    <!-- WEDDING DATE -->
    <div class="sg-wedding-date">
      <div class="sg-date-top">
        <span class="sg-date-line"></span>
        <span class="sg-weekday">{{ weddingWeekday }}</span>
        <span class="sg-date-line"></span>
      </div>

      <div class="sg-date-main">
        <div class="sg-date-side">
          <span>THÁNG</span>
          <strong>{{ weddingMonth }}</strong>
        </div>

        <div class="sg-date-day">{{ weddingDay }}</div>

        <div class="sg-date-side">
          <span>NĂM</span>
          <strong>{{ weddingYear }}</strong>
        </div>
      </div>

      <div v-if="weddingLunar" class="sg-lunar">{{ weddingLunar }}</div>

      <div v-if="weddingTime" class="sg-wedding-time">
        <div class="sg-time-content">
          <span class="sg-time-label">THỜI GIAN</span>
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
.sg-couple {
  position: relative;

  padding: 48px 22px 42px;

  text-align: center;

  color: #28514b;

  overflow: hidden;
}

.sg-eyebrow {
  margin: 0;

  color: #6c8e7a;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.sg-couple h2 {
  margin: 6px 0 10px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;

  color: #28514b;
}

.sg-rule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin: 0 auto;

  color: #8fae9b;

  font-size: 14px;
}

.sg-rule span {
  width: 50px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(143, 174, 155, 0.7));
}

.sg-rule span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   PEOPLE
========================================================= */

.sg-people {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;

  margin-top: 30px;
}

.sg-person {
  min-width: 0;
}

.sg-person__parents {
  min-height: 38px;
}

.sg-parents {
  margin: 2px 0;

  color: #7a8a80;

  font-size: 11px;

  line-height: 1.35;

  letter-spacing: 0.03em;
}

.sg-people h3 {
  margin: 8px 0 4px;

  font-family: "Allura", cursive;
  font-size: 36px;
  font-weight: 400;

  line-height: 1.2;

  color: #28514b;
}

.sg-person__role {
  display: block;

  color: #6c8e7a;

  font-size: 9px;

  letter-spacing: 0.24em;
  font-weight: 700;
}

.sg-person__desc {
  margin: 7px 0 0;

  color: #7a8a80;

  font-size: 12px;
  font-style: italic;

  line-height: 1.5;
}

.sg-couple-divider {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
}

.sg-couple-divider i {
  color: #8fae9b;

  font-family: "Allura", cursive;
  font-size: 34px;
  font-style: normal;
  font-weight: 400;
}

/* =========================================================
   WEDDING DATE
========================================================= */

.sg-wedding-date {
  position: relative;

  margin: 36px auto 0;
  max-width: 420px;
}

.sg-date-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-bottom: 14px;
}

.sg-weekday {
  color: #28514b;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.sg-date-line {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(143, 174, 155, 0.7));
}

.sg-date-line:last-child {
  transform: rotate(180deg);
}

.sg-date-main {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  max-width: 300px;

  margin: auto;
}

.sg-date-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.sg-date-side span {
  color: #6c8e7a;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.sg-date-side strong {
  color: #28514b;

  font-size: 20px;
  font-weight: 600;
}

.sg-date-day {
  padding: 0 22px;

  color: #28514b;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 66px;
  font-weight: 600;

  line-height: 0.95;
}

.sg-lunar {
  margin-top: 12px;

  color: #7a8a80;

  font-size: 11px;
  font-style: italic;

  letter-spacing: 0.05em;
}

.sg-wedding-time {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-top: 18px;
}

.sg-time-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  font-weight: 600;
}

.sg-time-label {
  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #6c8e7a;
}

.sg-time-content strong {
  margin-top: 1px;

  color: #28514b;

  font-size: 21px;
  font-weight: 600;

  line-height: 1;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {
  .sg-couple {
    padding: 40px 16px 36px;
  }

  .sg-people {
    gap: 6px;
  }

  .sg-people h3 {
    font-size: 30px;
  }

  .sg-parents {
    font-size: 10px;
  }

  .sg-person__desc {
    font-size: 11px;
  }

  .sg-couple-divider {
    width: 25px;
  }

  .sg-couple-divider i {
    font-size: 26px;
  }

  .sg-date-day {
    padding: 0 12px;

    font-size: 58px;
  }

  .sg-date-side strong {
    font-size: 18px;
  }

  .sg-date-line {
    width: 28px;
  }
}

@media (max-width: 360px) {
  .sg-people {
    gap: 3px;
  }

  .sg-people h3 {
    font-size: 26px;
  }

  .sg-person__desc {
    font-size: 10px;
  }

  .sg-date-day {
    font-size: 52px;
  }
}
</style>
