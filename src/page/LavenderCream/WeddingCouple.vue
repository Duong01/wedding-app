<template>
  <section class="lc-couple">
    <p class="lc-eyebrow">TRÂN TRỌNG BÁO HỶ</p>

    <h2>Thông tin tiệc cưới</h2>

    <div class="lc-rule">
      <span></span>
      <i>❀</i>
      <span></span>
    </div>

    <div class="lc-people">
      <!-- CHÚ RỂ -->
      <article class="lc-person lc-person--groom">
        <div class="lc-person__parents">
          <p v-if="groomParents?.Father" class="lc-parents">Ông {{ groomParents.Father }}</p>
          <p v-if="groomParents?.Mother" class="lc-parents">Bà {{ groomParents.Mother }}</p>
        </div>

        <h3>{{ groom }}</h3>

        <span class="lc-person__role">CHÚ RỂ</span>

        <p class="lc-person__desc">{{ groomDescription }}</p>
      </article>

      <div class="lc-couple-divider"><i>&amp;</i></div>

      <!-- CÔ DÂU -->
      <article class="lc-person lc-person--bride">
        <div class="lc-person__parents">
          <p v-if="brideParents?.Father" class="lc-parents">Ông {{ brideParents.Father }}</p>
          <p v-if="brideParents?.Mother" class="lc-parents">Bà {{ brideParents.Mother }}</p>
        </div>

        <h3>{{ bride }}</h3>

        <span class="lc-person__role">CÔ DÂU</span>

        <p class="lc-person__desc">{{ brideDescription }}</p>
      </article>
    </div>

    <!-- WEDDING DATE -->
    <div class="lc-wedding-date">
      <div class="lc-date-top">
        <span class="lc-date-line"></span>
        <span class="lc-weekday">{{ weddingWeekday }}</span>
        <span class="lc-date-line"></span>
      </div>

      <div class="lc-date-main">
        <div class="lc-date-side">
          <span>THÁNG</span>
          <strong>{{ weddingMonth }}</strong>
        </div>

        <div class="lc-date-day">{{ weddingDay }}</div>

        <div class="lc-date-side">
          <span>NĂM</span>
          <strong>{{ weddingYear }}</strong>
        </div>
      </div>

      <div v-if="weddingLunar" class="lc-lunar">{{ weddingLunar }}</div>

      <div v-if="weddingTime" class="lc-wedding-time">
        <div class="lc-time-content">
          <span class="lc-time-label">THỜI GIAN</span>
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
.lc-couple {
  position: relative;

  padding: 48px 22px 42px;

  text-align: center;

  color: #584a5b;

  overflow: hidden;
}

.lc-eyebrow {
  margin: 0;

  color: #a086b4;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.lc-couple h2 {
  margin: 6px 0 10px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;

  color: #584a5b;
}

.lc-rule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin: 0 auto;

  color: #b9a0d0;

  font-size: 14px;
}

.lc-rule span {
  width: 50px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(185, 160, 208, 0.7));
}

.lc-rule span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   PEOPLE
========================================================= */

.lc-people {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;

  margin-top: 30px;
}

.lc-person {
  min-width: 0;
}

.lc-person__parents {
  min-height: 38px;
}

.lc-parents {
  margin: 2px 0;

  color: #8d7f92;

  font-size: 11px;

  line-height: 1.35;

  letter-spacing: 0.03em;
}

.lc-people h3 {
  margin: 8px 0 4px;

  font-family: "Allura", cursive;
  font-size: 36px;
  font-weight: 400;

  line-height: 1.2;

  color: #584a5b;
}

.lc-person__role {
  display: block;

  color: #a086b4;

  font-size: 9px;

  letter-spacing: 0.24em;
  font-weight: 700;
}

.lc-person__desc {
  margin: 7px 0 0;

  color: #6f5f74;

  font-size: 12px;
  font-style: italic;

  line-height: 1.5;
}

.lc-couple-divider {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
}

.lc-couple-divider i {
  color: #b9a0d0;

  font-family: "Allura", cursive;
  font-size: 34px;
  font-style: normal;
  font-weight: 400;
}

/* =========================================================
   WEDDING DATE
========================================================= */

.lc-wedding-date {
  position: relative;

  margin: 36px auto 0;
  max-width: 420px;
}

.lc-date-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-bottom: 14px;
}

.lc-weekday {
  color: #584a5b;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.lc-date-line {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(185, 160, 208, 0.7));
}

.lc-date-line:last-child {
  transform: rotate(180deg);
}

.lc-date-main {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  max-width: 300px;

  margin: auto;
}

.lc-date-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.lc-date-side span {
  color: #a086b4;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.lc-date-side strong {
  color: #584a5b;

  font-size: 20px;
  font-weight: 600;
}

.lc-date-day {
  padding: 0 22px;

  color: #584a5b;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 66px;
  font-weight: 600;

  line-height: 0.95;
}

.lc-lunar {
  margin-top: 12px;

  color: #8d7f92;

  font-size: 11px;
  font-style: italic;

  letter-spacing: 0.05em;
}

.lc-wedding-time {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-top: 18px;
}

.lc-time-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  font-weight: 600;
}

.lc-time-label {
  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #a086b4;
}

.lc-time-content strong {
  margin-top: 1px;

  color: #584a5b;

  font-size: 21px;
  font-weight: 600;

  line-height: 1;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {
  .lc-couple {
    padding: 40px 16px 36px;
  }

  .lc-people {
    gap: 6px;
  }

  .lc-people h3 {
    font-size: 30px;
  }

  .lc-parents {
    font-size: 10px;
  }

  .lc-person__desc {
    font-size: 11px;
  }

  .lc-couple-divider {
    width: 25px;
  }

  .lc-couple-divider i {
    font-size: 26px;
  }

  .lc-date-day {
    padding: 0 12px;

    font-size: 58px;
  }

  .lc-date-side strong {
    font-size: 18px;
  }

  .lc-date-line {
    width: 28px;
  }
}

@media (max-width: 360px) {
  .lc-people {
    gap: 3px;
  }

  .lc-people h3 {
    font-size: 26px;
  }

  .lc-person__desc {
    font-size: 10px;
  }

  .lc-date-day {
    font-size: 52px;
  }
}
</style>
