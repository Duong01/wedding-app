<template>
  <section class="dh-couple">
    <p class="dh-eyebrow">TRÂN TRỌNG BÁO HỶ</p>

    <h2>Thông tin tiệc cưới</h2>

    <div class="dh-rule">
      <span></span>
      <i>囍</i>
      <span></span>
    </div>

    <div class="dh-people">
      <!-- CHÚ RỂ -->
      <article class="dh-person dh-person--groom">
        <div class="dh-person__parents">
          <p v-if="groomParents?.Father" class="dh-parents">Ông {{ groomParents.Father }}</p>
          <p v-if="groomParents?.Mother" class="dh-parents">Bà {{ groomParents.Mother }}</p>
        </div>

        <h3>{{ groom }}</h3>

        <span class="dh-person__role">CHÚ RỂ</span>

        <p class="dh-person__desc">{{ groomDescription }}</p>
      </article>

      <div class="dh-couple-divider"><i>&amp;</i></div>

      <!-- CÔ DÂU -->
      <article class="dh-person dh-person--bride">
        <div class="dh-person__parents">
          <p v-if="brideParents?.Father" class="dh-parents">Ông {{ brideParents.Father }}</p>
          <p v-if="brideParents?.Mother" class="dh-parents">Bà {{ brideParents.Mother }}</p>
        </div>

        <h3>{{ bride }}</h3>

        <span class="dh-person__role">CÔ DÂU</span>

        <p class="dh-person__desc">{{ brideDescription }}</p>
      </article>
    </div>

    <!-- WEDDING DATE -->
    <div class="dh-wedding-date">
      <div class="dh-date-top">
        <span class="dh-date-line"></span>
        <span class="dh-weekday">{{ weddingWeekday }}</span>
        <span class="dh-date-line"></span>
      </div>

      <div class="dh-date-main">
        <div class="dh-date-side">
          <span>THÁNG</span>
          <strong>{{ weddingMonth }}</strong>
        </div>

        <div class="dh-date-day">{{ weddingDay }}</div>

        <div class="dh-date-side">
          <span>NĂM</span>
          <strong>{{ weddingYear }}</strong>
        </div>
      </div>

      <div v-if="weddingLunar" class="dh-lunar">{{ weddingLunar }}</div>

      <div v-if="weddingTime" class="dh-wedding-time">
        <div class="dh-time-content">
          <span class="dh-time-label">THỜI GIAN</span>
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
.dh-couple {
  --dh-red: #7a1216;
  --dh-red-bright: #a32a2a;
  --dh-gold: #d9a441;
  --dh-gold-light: #f3d9a4;
  --dh-cream: #fdf6ec;
  --dh-ink: #5a3d2e;

  position: relative;

  padding: 48px 22px 42px;

  text-align: center;

  color: var(--dh-ink);

  overflow: hidden;
}

.dh-eyebrow {
  margin: 0;

  color: var(--dh-red-bright);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.dh-couple h2 {
  margin: 6px 0 10px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;

  color: var(--dh-red);
}

.dh-rule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin: 0 auto;

  color: var(--dh-gold);

  font-size: 15px;
}

.dh-rule span {
  width: 50px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(217, 164, 65, 0.75));
}

.dh-rule span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   PEOPLE
========================================================= */

.dh-people {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;

  margin-top: 30px;
}

.dh-person {
  min-width: 0;
}

.dh-person__parents {
  min-height: 38px;
}

.dh-parents {
  margin: 2px 0;

  color: #8a6a52;

  font-size: 11px;

  line-height: 1.35;

  letter-spacing: 0.03em;
}

.dh-people h3 {
  margin: 8px 0 4px;

  font-family: "Allura", cursive;
  font-size: 36px;
  font-weight: 400;

  line-height: 1.2;

  color: var(--dh-red);
}

.dh-person__role {
  display: inline-block;

  padding: 3px 12px;

  color: var(--dh-gold);

  font-size: 9px;

  letter-spacing: 0.24em;
  font-weight: 700;

  border: 1px solid rgba(217, 164, 65, 0.5);
  border-radius: 999px;

  background: rgba(243, 217, 164, 0.25);
}

.dh-person__desc {
  margin: 7px 0 0;

  color: #7d5c46;

  font-size: 12px;
  font-style: italic;

  line-height: 1.5;
}

.dh-couple-divider {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
}

.dh-couple-divider i {
  color: var(--dh-gold);

  font-family: "Allura", cursive;
  font-size: 34px;
  font-style: normal;
  font-weight: 400;
}

/* =========================================================
   WEDDING DATE
========================================================= */

.dh-wedding-date {
  position: relative;

  margin: 36px auto 0;
  max-width: 420px;

  padding: 22px 16px 20px;

  border: 1px solid rgba(217, 164, 65, 0.5);
  border-radius: 14px;

  background: linear-gradient(170deg, rgba(253, 246, 236, 0.9), rgba(243, 217, 164, 0.35));
}

/* Inner gold line — double border */
.dh-wedding-date::before {
  content: "";
  position: absolute;
  inset: 5px;

  border: 1px solid rgba(217, 164, 65, 0.3);
  border-radius: 10px;

  pointer-events: none;
}

.dh-date-top {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-bottom: 14px;
}

.dh-weekday {
  color: var(--dh-red);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.dh-date-line {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(217, 164, 65, 0.75));
}

.dh-date-line:last-child {
  transform: rotate(180deg);
}

.dh-date-main {
  position: relative;

  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  max-width: 300px;

  margin: auto;
}

.dh-date-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.dh-date-side span {
  color: var(--dh-red-bright);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.dh-date-side strong {
  color: var(--dh-red);

  font-size: 20px;
  font-weight: 600;
}

.dh-date-day {
  position: relative;

  padding: 0 22px;

  color: var(--dh-red);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 66px;
  font-weight: 600;

  line-height: 0.95;
}

.dh-lunar {
  position: relative;

  margin-top: 12px;

  color: #8a6a52;

  font-size: 11px;
  font-style: italic;

  letter-spacing: 0.05em;
}

.dh-wedding-time {
  position: relative;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-top: 18px;
}

.dh-time-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  font-weight: 600;
}

.dh-time-label {
  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: var(--dh-red-bright);
}

.dh-time-content strong {
  margin-top: 1px;

  color: var(--dh-red);

  font-size: 21px;
  font-weight: 600;

  line-height: 1;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {
  .dh-couple {
    padding: 40px 16px 36px;
  }

  .dh-people {
    gap: 6px;
  }

  .dh-people h3 {
    font-size: 30px;
  }

  .dh-parents {
    font-size: 10px;
  }

  .dh-person__desc {
    font-size: 11px;
  }

  .dh-couple-divider {
    width: 25px;
  }

  .dh-couple-divider i {
    font-size: 26px;
  }

  .dh-date-day {
    padding: 0 12px;

    font-size: 58px;
  }

  .dh-date-side strong {
    font-size: 18px;
  }

  .dh-date-line {
    width: 28px;
  }
}

@media (max-width: 360px) {
  .dh-people {
    gap: 3px;
  }

  .dh-people h3 {
    font-size: 26px;
  }

  .dh-person__desc {
    font-size: 10px;
  }

  .dh-date-day {
    font-size: 52px;
  }
}
</style>
