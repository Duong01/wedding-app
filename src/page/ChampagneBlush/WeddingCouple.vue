<template>
  <section class="cb-couple">
    <p class="cb-eyebrow">TRÂN TRỌNG BÁO HỶ</p>

    <h2>Thông tin tiệc cưới</h2>

    <div class="cb-rule">
      <span></span>
      <i>❀</i>
      <span></span>
    </div>

    <div class="cb-people">
      <!-- CHÚ RỂ -->
      <article class="cb-person cb-person--groom">
        <div class="cb-person__parents">
          <p v-if="groomParents?.Father" class="cb-parents">Ông {{ groomParents.Father }}</p>
          <p v-if="groomParents?.Mother" class="cb-parents">Bà {{ groomParents.Mother }}</p>
        </div>

        <h3>{{ groom }}</h3>

        <span class="cb-person__role">CHÚ RỂ</span>

        <p class="cb-person__desc">{{ groomDescription }}</p>
      </article>

      <div class="cb-couple-divider"><i>&amp;</i></div>

      <!-- CÔ DÂU -->
      <article class="cb-person cb-person--bride">
        <div class="cb-person__parents">
          <p v-if="brideParents?.Father" class="cb-parents">Ông {{ brideParents.Father }}</p>
          <p v-if="brideParents?.Mother" class="cb-parents">Bà {{ brideParents.Mother }}</p>
        </div>

        <h3>{{ bride }}</h3>

        <span class="cb-person__role">CÔ DÂU</span>

        <p class="cb-person__desc">{{ brideDescription }}</p>
      </article>
    </div>

    <!-- WEDDING DATE -->
    <div class="cb-wedding-date">
      <div class="cb-date-top">
        <span class="cb-date-line"></span>
        <span class="cb-weekday">{{ weddingWeekday }}</span>
        <span class="cb-date-line"></span>
      </div>

      <div class="cb-date-main">
        <div class="cb-date-side">
          <span>THÁNG</span>
          <strong>{{ weddingMonth }}</strong>
        </div>

        <div class="cb-date-day">{{ weddingDay }}</div>

        <div class="cb-date-side">
          <span>NĂM</span>
          <strong>{{ weddingYear }}</strong>
        </div>
      </div>

      <div v-if="weddingLunar" class="cb-lunar">{{ weddingLunar }}</div>

      <div v-if="weddingTime" class="cb-wedding-time">
        <div class="cb-time-content">
          <span class="cb-time-label">THỜI GIAN</span>
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
.cb-couple {
  position: relative;

  padding: 48px 22px 42px;

  text-align: center;

  color: #6c4b4a;

  overflow: hidden;
}

.cb-eyebrow {
  margin: 0;

  color: #b67f7d;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.cb-couple h2 {
  margin: 6px 0 10px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;

  color: #6c4b4a;
}

.cb-rule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin: 0 auto;

  color: #c9a06a;

  font-size: 14px;
}

.cb-rule span {
  width: 50px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 160, 106, 0.7));
}

.cb-rule span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   PEOPLE
========================================================= */

.cb-people {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;

  margin-top: 30px;
}

.cb-person {
  min-width: 0;
}

.cb-person__parents {
  min-height: 38px;
}

.cb-parents {
  margin: 2px 0;

  color: #9a7a72;

  font-size: 11px;

  line-height: 1.35;

  letter-spacing: 0.03em;
}

.cb-people h3 {
  margin: 8px 0 4px;

  font-family: "Allura", cursive;
  font-size: 36px;
  font-weight: 400;

  line-height: 1.2;

  color: #6c4b4a;
}

.cb-person__role {
  display: block;

  color: #b67f7d;

  font-size: 9px;

  letter-spacing: 0.24em;
  font-weight: 700;
}

.cb-person__desc {
  margin: 7px 0 0;

  color: #7d5f58;

  font-size: 12px;
  font-style: italic;

  line-height: 1.5;
}

.cb-couple-divider {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
}

.cb-couple-divider i {
  color: #c9a06a;

  font-family: "Allura", cursive;
  font-size: 34px;
  font-style: normal;
  font-weight: 400;
}

/* =========================================================
   WEDDING DATE
========================================================= */

.cb-wedding-date {
  position: relative;

  margin: 36px auto 0;
  max-width: 420px;
}

.cb-date-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-bottom: 14px;
}

.cb-weekday {
  color: #6c4b4a;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.cb-date-line {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 160, 106, 0.7));
}

.cb-date-line:last-child {
  transform: rotate(180deg);
}

.cb-date-main {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  max-width: 300px;

  margin: auto;
}

.cb-date-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.cb-date-side span {
  color: #b67f7d;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.cb-date-side strong {
  color: #6c4b4a;

  font-size: 20px;
  font-weight: 600;
}

.cb-date-day {
  padding: 0 22px;

  color: #6c4b4a;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 66px;
  font-weight: 600;

  line-height: 0.95;
}

.cb-lunar {
  margin-top: 12px;

  color: #9a7a72;

  font-size: 11px;
  font-style: italic;

  letter-spacing: 0.05em;
}

.cb-wedding-time {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-top: 18px;
}

.cb-time-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  font-weight: 600;
}

.cb-time-label {
  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #b67f7d;
}

.cb-time-content strong {
  margin-top: 1px;

  color: #6c4b4a;

  font-size: 21px;
  font-weight: 600;

  line-height: 1;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {
  .cb-couple {
    padding: 40px 16px 36px;
  }

  .cb-people {
    gap: 6px;
  }

  .cb-people h3 {
    font-size: 30px;
  }

  .cb-parents {
    font-size: 10px;
  }

  .cb-person__desc {
    font-size: 11px;
  }

  .cb-couple-divider {
    width: 25px;
  }

  .cb-couple-divider i {
    font-size: 26px;
  }

  .cb-date-day {
    padding: 0 12px;

    font-size: 58px;
  }

  .cb-date-side strong {
    font-size: 18px;
  }

  .cb-date-line {
    width: 28px;
  }
}

@media (max-width: 360px) {
  .cb-people {
    gap: 3px;
  }

  .cb-people h3 {
    font-size: 26px;
  }

  .cb-person__desc {
    font-size: 10px;
  }

  .cb-date-day {
    font-size: 52px;
  }
}
</style>
