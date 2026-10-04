<template>
  <section class="wb-couple">
    <p v-if="eyebrow" class="wb-eyebrow">{{ eyebrow }}</p>

    <h2>{{ heading }}</h2>

    <div class="wb-rule">
      <span></span>
      <i>❀</i>
      <span></span>
    </div>

    <div class="wb-people">
      <!-- CHÚ RỂ -->
      <article class="wb-person wb-person--groom">
        <div class="wb-person__portrait">
          <img
            v-if="groomAvatar"
            :src="groomAvatar"
            :alt="groom"
            loading="lazy"
            decoding="async"
          />
          <span v-else class="wb-person__initial">{{ groom.charAt(0) || "♥" }}</span>
        </div>

        <div class="wb-person__parents">
          <p v-if="groomParents?.Father" class="wb-parents">Ông {{ groomParents.Father }}</p>
          <p v-if="groomParents?.Mother" class="wb-parents">Bà {{ groomParents.Mother }}</p>
        </div>

        <h3>{{ groom }}</h3>

        <span class="wb-person__role">CHÚ RỂ</span>

        <p class="wb-person__desc">{{ groomDescription }}</p>
      </article>

      <div class="wb-couple-divider"><i>&amp;</i></div>

      <!-- CÔ DÂU -->
      <article class="wb-person wb-person--bride">
        <div class="wb-person__portrait">
          <img
            v-if="brideAvatar"
            :src="brideAvatar"
            :alt="bride"
            loading="lazy"
            decoding="async"
          />
          <span v-else class="wb-person__initial">{{ bride.charAt(0) || "♥" }}</span>
        </div>

        <div class="wb-person__parents">
          <p v-if="brideParents?.Father" class="wb-parents">Ông {{ brideParents.Father }}</p>
          <p v-if="brideParents?.Mother" class="wb-parents">Bà {{ brideParents.Mother }}</p>
        </div>

        <h3>{{ bride }}</h3>

        <span class="wb-person__role">CÔ DÂU</span>

        <p class="wb-person__desc">{{ brideDescription }}</p>
      </article>
    </div>

    <!-- WEDDING DATE -->
    <div class="wb-wedding-date">
      <div class="wb-date-top">
        <span class="wb-date-line"></span>
        <span class="wb-weekday">{{ weddingWeekday }}</span>
        <span class="wb-date-line"></span>
      </div>

      <div class="wb-date-main">
        <div class="wb-date-side">
          <span>THÁNG</span>
          <strong>{{ weddingMonth }}</strong>
        </div>

        <div class="wb-date-day">{{ weddingDay }}</div>

        <div class="wb-date-side">
          <span>NĂM</span>
          <strong>{{ weddingYear }}</strong>
        </div>
      </div>

      <div v-if="weddingLunar" class="wb-lunar">{{ weddingLunar }}</div>

      <div v-if="weddingTime" class="wb-wedding-time">
        <div class="wb-time-content">
          <span class="wb-time-label">THỜI GIAN</span>
          <strong>{{ weddingTime }}</strong>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import { sectionText } from "@/data/sectionTitles";

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  guestName: { type: String, default: "Quý khách" },
  sections: { type: Object, default: () => ({}) },
});

const eyebrow = computed(() =>
  sectionText(props.sections, "couple", "Eyebrow", "TRÂN TRỌNG BÁO HỶ")
);

const heading = computed(() =>
  sectionText(props.sections, "couple", "Heading", "Thông tin tiệc cưới")
);

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

const groomAvatar = computed(
  () =>
    props.wedding?.couple?.Groom?.Avatar ||
    props.wedding?.groom?.avatar ||
    props.wedding?.groom?.image ||
    ""
);

const brideAvatar = computed(
  () =>
    props.wedding?.couple?.Bride?.Avatar ||
    props.wedding?.bride?.avatar ||
    props.wedding?.bride?.image ||
    ""
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
.wb-couple {
  position: relative;

  padding: 48px 22px 42px;

  text-align: center;

  color: var(--tc-8a4a5c, #8a4a5c);

  overflow: hidden;
}

.wb-eyebrow {
  margin: 0;

  color: var(--tc-a5586c, #a5586c);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.wb-couple h2 {
  margin: 6px 0 10px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;

  color: var(--tc-8a4a5c, #8a4a5c);
}

.wb-rule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin: 0 auto;

  color: var(--tc-a05a6e, #a05a6e);

  font-size: 14px;
}

.wb-rule span {
  width: 50px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.7));
}

.wb-rule span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   PEOPLE
========================================================= */

.wb-people {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;

  margin-top: 30px;
}

.wb-person {
  min-width: 0;
}

.wb-person__portrait {
  width: 92px;
  height: 92px;

  margin: 0 auto 12px;

  border: 2px solid rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.55);
  border-radius: 50%;

  background: rgba(var(--tc-fffafc-rgb, 255, 250, 252), 0.9);

  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.12);

  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
}

.wb-person__portrait img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.wb-person__initial {
  font-family: "Allura", cursive;

  font-size: 38px;

  color: var(--tc-a5586c, #a5586c);
}

.wb-person__parents {
  min-height: 38px;
}

.wb-parents {
  margin: 2px 0;

  color: var(--tc-9d5f6d, #9d5f6d);

  font-size: 11px;

  line-height: 1.35;

  letter-spacing: 0.03em;
}

.wb-people h3 {
  margin: 8px 0 4px;

  font-family: "Allura", cursive;
  font-size: 36px;
  font-weight: 400;

  line-height: 1.2;

  color: var(--tc-8a4a5c, #8a4a5c);
}

.wb-person__role {
  display: block;

  color: var(--tc-a5586c, #a5586c);

  font-size: 11px;

  letter-spacing: 0.24em;
  font-weight: 700;
}

.wb-person__desc {
  margin: 7px 0 0;

  color: var(--tc-a06a7c, #a06a7c);

  font-size: 12px;
  font-style: italic;

  line-height: 1.5;
}

.wb-couple-divider {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
}

.wb-couple-divider i {
  color: var(--tc-a05a6e, #a05a6e);

  font-family: "Allura", cursive;
  font-size: 34px;
  font-style: normal;
  font-weight: 400;
}

/* =========================================================
   WEDDING DATE
========================================================= */

.wb-wedding-date {
  position: relative;

  margin: 36px auto 0;
  max-width: 420px;
}

.wb-date-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-bottom: 14px;
}

.wb-weekday {
  color: var(--tc-8a4a5c, #8a4a5c);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.wb-date-line {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.7));
}

.wb-date-line:last-child {
  transform: rotate(180deg);
}

.wb-date-main {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  max-width: 300px;

  margin: auto;
}

.wb-date-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.wb-date-side span {
  color: var(--tc-a5586c, #a5586c);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.wb-date-side strong {
  color: var(--tc-8a4a5c, #8a4a5c);

  font-size: 20px;
  font-weight: 600;
}

.wb-date-day {
  padding: 0 22px;

  color: var(--tc-8a4a5c, #8a4a5c);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 66px;
  font-weight: 600;

  line-height: 0.95;
}

.wb-lunar {
  margin-top: 12px;

  color: var(--tc-9d5f6d, #9d5f6d);

  font-size: 11px;
  font-style: italic;

  letter-spacing: 0.05em;
}

.wb-wedding-time {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-top: 18px;
}

.wb-time-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  font-weight: 600;
}

.wb-time-label {
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: var(--tc-a5586c, #a5586c);
}

.wb-time-content strong {
  margin-top: 1px;

  color: var(--tc-8a4a5c, #8a4a5c);

  font-size: 21px;
  font-weight: 600;

  line-height: 1;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {
  .wb-couple {
    padding: 40px 16px 36px;
  }

  .wb-people {
    gap: 6px;
  }

  .wb-people h3 {
    font-size: 30px;
  }

  .wb-parents {
    font-size: 10px;
  }

  .wb-person__desc {
    font-size: 11px;
  }

  .wb-couple-divider {
    width: 25px;
  }

  .wb-couple-divider i {
    font-size: 26px;
  }

  .wb-date-day {
    padding: 0 12px;

    font-size: 58px;
  }

  .wb-date-side strong {
    font-size: 18px;
  }

  .wb-date-line {
    width: 28px;
  }
}

@media (max-width: 360px) {
  .wb-people {
    gap: 3px;
  }

  .wb-people h3 {
    font-size: 26px;
  }

  .wb-person__desc {
    font-size: 10px;
  }

  .wb-date-day {
    font-size: 52px;
  }
}
</style>
