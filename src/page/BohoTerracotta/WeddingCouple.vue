<template>
  <section class="bt-couple">
    <p class="bt-eyebrow">TRÂN TRỌNG BÁO HỶ</p>

    <h2>Thông tin tiệc cưới</h2>

    <div class="bt-rule">
      <span></span>
      <i>❋</i>
      <span></span>
    </div>

    <div class="bt-people">
      <!-- CHÚ RỂ -->
      <article class="bt-person bt-person--groom">
        <div class="bt-person__parents">
          <p v-if="groomParents?.Father" class="bt-parents">Ông {{ groomParents.Father }}</p>
          <p v-if="groomParents?.Mother" class="bt-parents">Bà {{ groomParents.Mother }}</p>
        </div>

        <h3>{{ groom }}</h3>

        <span class="bt-person__role">CHÚ RỂ</span>

        <p class="bt-person__desc">{{ groomDescription }}</p>
      </article>

      <div class="bt-couple-divider"><i>&amp;</i></div>

      <!-- CÔ DÂU -->
      <article class="bt-person bt-person--bride">
        <div class="bt-person__parents">
          <p v-if="brideParents?.Father" class="bt-parents">Ông {{ brideParents.Father }}</p>
          <p v-if="brideParents?.Mother" class="bt-parents">Bà {{ brideParents.Mother }}</p>
        </div>

        <h3>{{ bride }}</h3>

        <span class="bt-person__role">CÔ DÂU</span>

        <p class="bt-person__desc">{{ brideDescription }}</p>
      </article>
    </div>

    <!-- WEDDING DATE -->
    <div class="bt-wedding-date">
      <div class="bt-date-top">
        <span class="bt-date-line"></span>
        <span class="bt-weekday">{{ weddingWeekday }}</span>
        <span class="bt-date-line"></span>
      </div>

      <div class="bt-date-main">
        <div class="bt-date-side">
          <span>THÁNG</span>
          <strong>{{ weddingMonth }}</strong>
        </div>

        <div class="bt-date-day">{{ weddingDay }}</div>

        <div class="bt-date-side">
          <span>NĂM</span>
          <strong>{{ weddingYear }}</strong>
        </div>
      </div>

      <div v-if="weddingLunar" class="bt-lunar">{{ weddingLunar }}</div>

      <div v-if="weddingTime" class="bt-wedding-time">
        <div class="bt-time-content">
          <span class="bt-time-label">THỜI GIAN</span>
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
.bt-couple {
  position: relative;

  padding: 48px 22px 42px;

  text-align: center;

  color: #5c4636;

  overflow: hidden;
}

/* Macramé lattice texture */
.bt-couple::before {
  content: "";
  position: absolute;
  inset: 0;

  opacity: 0.05;

  background-image:
    repeating-linear-gradient(45deg, rgba(156, 91, 63, 0.6) 0 1px, transparent 1px 18px),
    repeating-linear-gradient(-45deg, rgba(156, 91, 63, 0.6) 0 1px, transparent 1px 18px);

  pointer-events: none;
}

.bt-eyebrow {
  position: relative;

  margin: 0;

  color: #8a9b7c;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.bt-couple h2 {
  position: relative;

  margin: 6px 0 10px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;

  color: #9c5b3f;
}

.bt-rule {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin: 0 auto;

  color: #c97b5d;

  font-size: 14px;
}

.bt-rule span {
  width: 50px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(156, 91, 63, 0.7));
}

.bt-rule span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   PEOPLE
========================================================= */

.bt-people {
  position: relative;

  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;

  margin-top: 30px;
}

.bt-person {
  min-width: 0;

  padding: 18px 10px 16px;

  border: 1px dashed rgba(156, 91, 63, 0.35);
  border-radius: 999px 999px 18px 18px;

  background: rgba(255, 251, 245, 0.6);
}

.bt-person__parents {
  min-height: 38px;
}

.bt-parents {
  margin: 2px 0;

  color: #8a6f5c;

  font-size: 11px;

  line-height: 1.35;

  letter-spacing: 0.03em;
}

.bt-people h3 {
  margin: 8px 0 4px;

  font-family: "Allura", cursive;
  font-size: 36px;
  font-weight: 400;

  line-height: 1.2;

  color: #9c5b3f;
}

.bt-person__role {
  display: block;

  color: #8a9b7c;

  font-size: 9px;

  letter-spacing: 0.24em;
  font-weight: 700;
}

.bt-person__desc {
  margin: 7px 0 0;

  color: #7d6350;

  font-size: 12px;
  font-style: italic;

  line-height: 1.5;
}

.bt-couple-divider {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
}

.bt-couple-divider i {
  color: #c97b5d;

  font-family: "Allura", cursive;
  font-size: 34px;
  font-style: normal;
  font-weight: 400;
}

/* =========================================================
   WEDDING DATE
========================================================= */

.bt-wedding-date {
  position: relative;

  margin: 36px auto 0;
  max-width: 420px;

  padding: 22px 16px 20px;

  border: 1px dashed rgba(156, 91, 63, 0.4);
  border-radius: 60% 60% 24px 24px / 28% 28% 24px 24px;

  background: rgba(255, 251, 245, 0.65);
}

.bt-date-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-bottom: 14px;
}

.bt-weekday {
  color: #9c5b3f;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.bt-date-line {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(156, 91, 63, 0.7));
}

.bt-date-line:last-child {
  transform: rotate(180deg);
}

.bt-date-main {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  max-width: 300px;

  margin: auto;
}

.bt-date-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.bt-date-side span {
  color: #8a9b7c;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.bt-date-side strong {
  color: #9c5b3f;

  font-size: 20px;
  font-weight: 600;
}

.bt-date-day {
  padding: 0 22px;

  color: #9c5b3f;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 66px;
  font-weight: 600;

  line-height: 0.95;
}

.bt-lunar {
  margin-top: 12px;

  color: #8a6f5c;

  font-size: 11px;
  font-style: italic;

  letter-spacing: 0.05em;
}

.bt-wedding-time {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-top: 18px;
}

.bt-time-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  font-weight: 600;
}

.bt-time-label {
  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #8a9b7c;
}

.bt-time-content strong {
  margin-top: 1px;

  color: #9c5b3f;

  font-size: 21px;
  font-weight: 600;

  line-height: 1;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {
  .bt-couple {
    padding: 40px 16px 36px;
  }

  .bt-people {
    gap: 6px;
  }

  .bt-person {
    padding: 14px 6px 12px;
  }

  .bt-people h3 {
    font-size: 30px;
  }

  .bt-parents {
    font-size: 10px;
  }

  .bt-person__desc {
    font-size: 11px;
  }

  .bt-couple-divider {
    width: 25px;
  }

  .bt-couple-divider i {
    font-size: 26px;
  }

  .bt-date-day {
    padding: 0 12px;

    font-size: 58px;
  }

  .bt-date-side strong {
    font-size: 18px;
  }

  .bt-date-line {
    width: 28px;
  }
}

@media (max-width: 360px) {
  .bt-people {
    gap: 3px;
  }

  .bt-people h3 {
    font-size: 26px;
  }

  .bt-person__desc {
    font-size: 10px;
  }

  .bt-date-day {
    font-size: 52px;
  }
}
</style>
