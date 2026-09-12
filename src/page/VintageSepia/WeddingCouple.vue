<template>
  <section class="vs-couple">
    <p class="vs-eyebrow">TRÂN TRỌNG BÁO HỶ</p>

    <h2>Thông tin tiệc cưới</h2>

    <div class="vs-rule">
      <span></span>
      <i>❦</i>
      <span></span>
    </div>

    <div class="vs-people">
      <!-- CHÚ RỂ -->
      <article class="vs-person vs-person--groom">
        <div class="vs-person__parents">
          <p v-if="groomParents?.Father" class="vs-parents">Ông {{ groomParents.Father }}</p>
          <p v-if="groomParents?.Mother" class="vs-parents">Bà {{ groomParents.Mother }}</p>
        </div>

        <h3>{{ groom }}</h3>

        <span class="vs-person__role">CHÚ RỂ</span>

        <p class="vs-person__desc">{{ groomDescription }}</p>
      </article>

      <div class="vs-couple-divider"><i>&amp;</i></div>

      <!-- CÔ DÂU -->
      <article class="vs-person vs-person--bride">
        <div class="vs-person__parents">
          <p v-if="brideParents?.Father" class="vs-parents">Ông {{ brideParents.Father }}</p>
          <p v-if="brideParents?.Mother" class="vs-parents">Bà {{ brideParents.Mother }}</p>
        </div>

        <h3>{{ bride }}</h3>

        <span class="vs-person__role">CÔ DÂU</span>

        <p class="vs-person__desc">{{ brideDescription }}</p>
      </article>
    </div>

    <!-- WEDDING DATE -->
    <div class="vs-wedding-date">
      <div class="vs-date-top">
        <span class="vs-date-line"></span>
        <span class="vs-weekday">{{ weddingWeekday }}</span>
        <span class="vs-date-line"></span>
      </div>

      <div class="vs-date-main">
        <div class="vs-date-side">
          <span>THÁNG</span>
          <strong>{{ weddingMonth }}</strong>
        </div>

        <div class="vs-date-day">{{ weddingDay }}</div>

        <div class="vs-date-side">
          <span>NĂM</span>
          <strong>{{ weddingYear }}</strong>
        </div>
      </div>

      <div v-if="weddingLunar" class="vs-lunar">{{ weddingLunar }}</div>

      <div v-if="weddingTime" class="vs-wedding-time">
        <div class="vs-time-content">
          <span class="vs-time-label">THỜI GIAN</span>
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
.vs-couple {
  position: relative;

  padding: 48px 22px 42px;

  text-align: center;

  color: #6b4f3a;

  overflow: hidden;
}

.vs-eyebrow {
  margin: 0;

  color: #97745a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.vs-couple h2 {
  margin: 6px 0 10px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;

  color: #4a3a2c;
}

.vs-rule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin: 0 auto;

  color: #c2a878;

  font-size: 14px;
}

.vs-rule span {
  width: 50px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(107, 79, 58, 0.6));
}

.vs-rule span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   PEOPLE
========================================================= */

.vs-people {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;

  margin-top: 30px;
}

.vs-person {
  min-width: 0;
}

.vs-person__parents {
  min-height: 38px;
}

.vs-parents {
  margin: 2px 0;

  color: #97745a;

  font-size: 11px;

  line-height: 1.35;

  letter-spacing: 0.03em;
}

.vs-people h3 {
  margin: 8px 0 4px;

  font-family: "Allura", cursive;
  font-size: 36px;
  font-weight: 400;

  line-height: 1.2;

  color: #4a3a2c;
}

.vs-person__role {
  display: block;

  color: #97745a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 9px;

  letter-spacing: 0.22em;
  font-weight: 700;
}

.vs-person__desc {
  margin: 7px 0 0;

  color: #6b4f3a;

  font-size: 12px;
  font-style: italic;

  line-height: 1.5;
}

.vs-couple-divider {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
}

.vs-couple-divider i {
  color: #c2a878;

  font-family: "Allura", cursive;
  font-size: 34px;
  font-style: normal;
  font-weight: 400;
}

/* =========================================================
   WEDDING DATE
========================================================= */

.vs-wedding-date {
  position: relative;

  margin: 36px auto 0;
  max-width: 420px;

  padding: 20px 16px 22px;

  border: 1px solid rgba(107, 79, 58, 0.35);
  border-radius: 10px;

  background: rgba(255, 253, 246, 0.55);

  box-shadow: 0 10px 26px rgba(61, 47, 36, 0.08);
}

.vs-wedding-date::before {
  content: "";
  position: absolute;
  inset: 6px;

  border: 1px dashed rgba(107, 79, 58, 0.28);
  border-radius: 6px;

  pointer-events: none;
}

.vs-date-top {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-bottom: 14px;
}

.vs-weekday {
  color: #6b4f3a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.24em;
}

.vs-date-line {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(107, 79, 58, 0.6));
}

.vs-date-line:last-child {
  transform: rotate(180deg);
}

.vs-date-main {
  position: relative;

  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  max-width: 300px;

  margin: auto;
}

.vs-date-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.vs-date-side span {
  color: #97745a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.vs-date-side strong {
  color: #4a3a2c;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 20px;
  font-weight: 600;
}

.vs-date-day {
  padding: 0 22px;

  color: #4a3a2c;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 66px;
  font-weight: 600;

  line-height: 0.95;
}

.vs-lunar {
  position: relative;

  margin-top: 12px;

  color: #97745a;

  font-size: 11px;
  font-style: italic;

  letter-spacing: 0.05em;
}

.vs-wedding-time {
  position: relative;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-top: 18px;
}

.vs-time-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  font-weight: 600;
}

.vs-time-label {
  font-family: "Courier New", ui-monospace, monospace;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #97745a;
}

.vs-time-content strong {
  margin-top: 1px;

  color: #4a3a2c;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 21px;
  font-weight: 600;

  line-height: 1;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {
  .vs-couple {
    padding: 40px 16px 36px;
  }

  .vs-people {
    gap: 6px;
  }

  .vs-people h3 {
    font-size: 30px;
  }

  .vs-parents {
    font-size: 10px;
  }

  .vs-person__desc {
    font-size: 11px;
  }

  .vs-couple-divider {
    width: 25px;
  }

  .vs-couple-divider i {
    font-size: 26px;
  }

  .vs-date-day {
    padding: 0 12px;

    font-size: 58px;
  }

  .vs-date-side strong {
    font-size: 18px;
  }

  .vs-date-line {
    width: 28px;
  }
}

@media (max-width: 360px) {
  .vs-people {
    gap: 3px;
  }

  .vs-people h3 {
    font-size: 26px;
  }

  .vs-person__desc {
    font-size: 10px;
  }

  .vs-date-day {
    font-size: 52px;
  }
}
</style>
