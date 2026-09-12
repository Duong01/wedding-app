<template>
  <section class="ob-couple">
    <p class="ob-eyebrow">TRÂN TRỌNG BÁO HỶ</p>

    <h2>Thông tin tiệc cưới</h2>

    <div class="ob-rule">
      <span></span>
      <i>〜</i>
      <span class="ob-rule-flip"></span>
    </div>

    <div class="ob-people">
      <!-- CHÚ RỂ -->
      <article class="ob-person ob-person--groom">
        <div class="ob-person__parents">
          <p v-if="groomParents?.Father" class="ob-parents">Ông {{ groomParents.Father }}</p>
          <p v-if="groomParents?.Mother" class="ob-parents">Bà {{ groomParents.Mother }}</p>
        </div>

        <h3>{{ groom }}</h3>

        <span class="ob-person__role">CHÚ RỂ</span>

        <p class="ob-person__desc">{{ groomDescription }}</p>
      </article>

      <div class="ob-couple-divider"><i>&amp;</i></div>

      <!-- CÔ DÂU -->
      <article class="ob-person ob-person--bride">
        <div class="ob-person__parents">
          <p v-if="brideParents?.Father" class="ob-parents">Ông {{ brideParents.Father }}</p>
          <p v-if="brideParents?.Mother" class="ob-parents">Bà {{ brideParents.Mother }}</p>
        </div>

        <h3>{{ bride }}</h3>

        <span class="ob-person__role">CÔ DÂU</span>

        <p class="ob-person__desc">{{ brideDescription }}</p>
      </article>
    </div>

    <!-- WEDDING DATE -->
    <div class="ob-wedding-date">
      <div class="ob-date-top">
        <span class="ob-date-line"></span>
        <span class="ob-weekday">{{ weddingWeekday }}</span>
        <span class="ob-date-line ob-date-line--flip"></span>
      </div>

      <div class="ob-date-main">
        <div class="ob-date-side">
          <span>THÁNG</span>
          <strong>{{ weddingMonth }}</strong>
        </div>

        <div class="ob-date-day">{{ weddingDay }}</div>

        <div class="ob-date-side">
          <span>NĂM</span>
          <strong>{{ weddingYear }}</strong>
        </div>
      </div>

      <div v-if="weddingLunar" class="ob-lunar">{{ weddingLunar }}</div>

      <div v-if="weddingTime" class="ob-wedding-time">
        <div class="ob-time-content">
          <span class="ob-time-label">THỜI GIAN</span>
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
.ob-couple {
  position: relative;

  padding: 48px 22px 42px;

  text-align: center;

  color: #274b5c;

  overflow: hidden;
}

.ob-eyebrow {
  margin: 0;

  color: #4a9ab8;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ob-couple h2 {
  margin: 6px 0 10px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;

  color: #274b5c;
}

.ob-rule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin: 0 auto;

  color: #e8927c;

  font-size: 14px;
}

.ob-rule span {
  width: 50px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(74, 154, 184, 0.7));
}

.ob-rule-flip {
  transform: rotate(180deg);
}

/* =========================================================
   PEOPLE
========================================================= */

.ob-people {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;

  margin-top: 30px;
}

.ob-person {
  min-width: 0;

  padding: 18px 10px;

  border: 1px solid rgba(74, 154, 184, 0.28);
  border-radius: 24px;

  background: rgba(255, 255, 255, 0.72);

  box-shadow: 0 10px 28px rgba(29, 106, 142, 0.08);
}

.ob-person__parents {
  min-height: 38px;
}

.ob-parents {
  margin: 2px 0;

  color: #5b8296;

  font-size: 11px;

  line-height: 1.35;

  letter-spacing: 0.03em;
}

.ob-people h3 {
  margin: 8px 0 4px;

  font-family: "Allura", cursive;
  font-size: 36px;
  font-weight: 400;

  line-height: 1.2;

  color: #1d6a8e;
}

.ob-person__role {
  display: block;

  color: #e8927c;

  font-size: 9px;

  letter-spacing: 0.24em;
  font-weight: 700;
}

.ob-person__desc {
  margin: 7px 0 0;

  color: #4f7488;

  font-size: 12px;
  font-style: italic;

  line-height: 1.5;
}

.ob-couple-divider {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
}

.ob-couple-divider i {
  color: #e8927c;

  font-family: "Allura", cursive;
  font-size: 34px;
  font-style: normal;
  font-weight: 400;
}

/* =========================================================
   WEDDING DATE
========================================================= */

.ob-wedding-date {
  position: relative;

  margin: 36px auto 0;
  max-width: 420px;

  padding: 22px 16px 20px;

  border: 1px solid rgba(74, 154, 184, 0.3);
  border-radius: 24px;

  background: rgba(255, 255, 255, 0.72);

  box-shadow: 0 10px 28px rgba(29, 106, 142, 0.08);
}

.ob-date-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-bottom: 14px;
}

.ob-weekday {
  color: #274b5c;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.ob-date-line {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(74, 154, 184, 0.7));
}

.ob-date-line--flip {
  transform: rotate(180deg);
}

.ob-date-main {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  max-width: 300px;

  margin: auto;
}

.ob-date-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.ob-date-side span {
  color: #e8927c;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.ob-date-side strong {
  color: #274b5c;

  font-size: 20px;
  font-weight: 600;
}

.ob-date-day {
  padding: 0 22px;

  color: #1d6a8e;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 66px;
  font-weight: 600;

  line-height: 0.95;
}

.ob-lunar {
  margin-top: 12px;

  color: #5b8296;

  font-size: 11px;
  font-style: italic;

  letter-spacing: 0.05em;
}

.ob-wedding-time {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-top: 18px;
}

.ob-time-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  font-weight: 600;
}

.ob-time-label {
  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #4a9ab8;
}

.ob-time-content strong {
  margin-top: 1px;

  color: #1d6a8e;

  font-size: 21px;
  font-weight: 600;

  line-height: 1;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {
  .ob-couple {
    padding: 40px 16px 36px;
  }

  .ob-people {
    gap: 6px;
  }

  .ob-person {
    padding: 14px 6px;

    border-radius: 20px;
  }

  .ob-people h3 {
    font-size: 30px;
  }

  .ob-parents {
    font-size: 10px;
  }

  .ob-person__desc {
    font-size: 11px;
  }

  .ob-couple-divider {
    width: 25px;
  }

  .ob-couple-divider i {
    font-size: 26px;
  }

  .ob-date-day {
    padding: 0 12px;

    font-size: 58px;
  }

  .ob-date-side strong {
    font-size: 18px;
  }

  .ob-date-line {
    width: 28px;
  }
}

@media (max-width: 360px) {
  .ob-people {
    gap: 3px;
  }

  .ob-people h3 {
    font-size: 26px;
  }

  .ob-person__desc {
    font-size: 10px;
  }

  .ob-date-day {
    font-size: 52px;
  }
}
</style>
