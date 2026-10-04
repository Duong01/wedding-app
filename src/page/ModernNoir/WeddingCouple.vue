<template>
  <section class="mn-couple">
    <p v-if="eyebrow" class="mn-eyebrow">{{ eyebrow }}</p>

    <h2>{{ heading }}</h2>

    <div class="mn-rule">
      <span></span>
      <i>✧</i>
      <span></span>
    </div>

    <div class="mn-people">
      <!-- CHÚ RỂ -->
      <article class="mn-person mn-person--groom">
        <div class="mn-person__portrait">
          <img
            v-if="groomAvatar"
            :src="groomAvatar"
            :alt="groom"
            loading="lazy"
            decoding="async"
          />
          <span v-else class="mn-person__initial">{{ groom.charAt(0) || "♥" }}</span>
        </div>

        <div class="mn-person__parents">
          <p v-if="groomParents?.Father" class="mn-parents">Ông {{ groomParents.Father }}</p>
          <p v-if="groomParents?.Mother" class="mn-parents">Bà {{ groomParents.Mother }}</p>
        </div>

        <h3>{{ groom }}</h3>

        <span class="mn-person__role">CHÚ RỂ</span>

        <p class="mn-person__desc">{{ groomDescription }}</p>
      </article>

      <div class="mn-couple-divider"><i>&amp;</i></div>

      <!-- CÔ DÂU -->
      <article class="mn-person mn-person--bride">
        <div class="mn-person__portrait">
          <img
            v-if="brideAvatar"
            :src="brideAvatar"
            :alt="bride"
            loading="lazy"
            decoding="async"
          />
          <span v-else class="mn-person__initial">{{ bride.charAt(0) || "♥" }}</span>
        </div>

        <div class="mn-person__parents">
          <p v-if="brideParents?.Father" class="mn-parents">Ông {{ brideParents.Father }}</p>
          <p v-if="brideParents?.Mother" class="mn-parents">Bà {{ brideParents.Mother }}</p>
        </div>

        <h3>{{ bride }}</h3>

        <span class="mn-person__role">CÔ DÂU</span>

        <p class="mn-person__desc">{{ brideDescription }}</p>
      </article>
    </div>

    <!-- WEDDING DATE -->
    <div class="mn-wedding-date">
      <div class="mn-date-top">
        <span class="mn-date-line"></span>
        <span class="mn-weekday">{{ weddingWeekday }}</span>
        <span class="mn-date-line"></span>
      </div>

      <div class="mn-date-main">
        <div class="mn-date-side">
          <span>THÁNG</span>
          <strong>{{ weddingMonth }}</strong>
        </div>

        <div class="mn-date-day">{{ weddingDay }}</div>

        <div class="mn-date-side">
          <span>NĂM</span>
          <strong>{{ weddingYear }}</strong>
        </div>
      </div>

      <div v-if="weddingLunar" class="mn-lunar">{{ weddingLunar }}</div>

      <div v-if="weddingTime" class="mn-wedding-time">
        <div class="mn-time-content">
          <span class="mn-time-label">THỜI GIAN</span>
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
.mn-couple {
  position: relative;

  padding: 48px 22px 42px;

  text-align: center;

  color: var(--tc-3a3a3a, #3a3a3a);

  overflow: hidden;
}

.mn-eyebrow {
  margin: 0;

  color: var(--tc-474747, #474747);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.mn-couple h2 {
  margin: 6px 0 10px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;

  color: var(--tc-3a3a3a, #3a3a3a);
}

.mn-rule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin: 0 auto;

  color: var(--tc-4d4d4d, #4d4d4d);

  font-size: 14px;
}

.mn-rule span {
  width: 50px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.7));
}

.mn-rule span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   PEOPLE
========================================================= */

.mn-people {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;

  margin-top: 30px;
}

.mn-person {
  min-width: 0;
}

.mn-person__portrait {
  width: 92px;
  height: 92px;

  margin: 0 auto 12px;

  border: 2px solid rgba(var(--tc-b8a07a-rgb, 184, 160, 122), 0.55);
  border-radius: 50%;

  background: rgba(var(--tc-fcfaf4-rgb, 252, 250, 244), 0.9);

  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.12);

  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
}

.mn-person__portrait img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.mn-person__initial {
  font-family: "Allura", cursive;

  font-size: 38px;

  color: var(--tc-474747, #474747);
}

.mn-person__parents {
  min-height: 38px;
}

.mn-parents {
  margin: 2px 0;

  color: var(--tc-4f4f4f, #4f4f4f);

  font-size: 11px;

  line-height: 1.35;

  letter-spacing: 0.03em;
}

.mn-people h3 {
  margin: 8px 0 4px;

  font-family: "Allura", cursive;
  font-size: 36px;
  font-weight: 400;

  line-height: 1.2;

  color: var(--tc-3a3a3a, #3a3a3a);
}

.mn-person__role {
  display: block;

  color: var(--tc-474747, #474747);

  font-size: 11px;

  letter-spacing: 0.24em;
  font-weight: 700;
}

.mn-person__desc {
  margin: 7px 0 0;

  color: var(--tc-5c5c5c, #5c5c5c);

  font-size: 12px;
  font-style: italic;

  line-height: 1.5;
}

.mn-couple-divider {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
}

.mn-couple-divider i {
  color: var(--tc-4d4d4d, #4d4d4d);

  font-family: "Allura", cursive;
  font-size: 34px;
  font-style: normal;
  font-weight: 400;
}

/* =========================================================
   WEDDING DATE
========================================================= */

.mn-wedding-date {
  position: relative;

  margin: 36px auto 0;
  max-width: 420px;
}

.mn-date-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-bottom: 14px;
}

.mn-weekday {
  color: var(--tc-3a3a3a, #3a3a3a);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.mn-date-line {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.7));
}

.mn-date-line:last-child {
  transform: rotate(180deg);
}

.mn-date-main {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  max-width: 300px;

  margin: auto;
}

.mn-date-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.mn-date-side span {
  color: var(--tc-474747, #474747);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.mn-date-side strong {
  color: var(--tc-3a3a3a, #3a3a3a);

  font-size: 20px;
  font-weight: 600;
}

.mn-date-day {
  padding: 0 22px;

  color: var(--tc-3a3a3a, #3a3a3a);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 66px;
  font-weight: 600;

  line-height: 0.95;
}

.mn-lunar {
  margin-top: 12px;

  color: var(--tc-4f4f4f, #4f4f4f);

  font-size: 11px;
  font-style: italic;

  letter-spacing: 0.05em;
}

.mn-wedding-time {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-top: 18px;
}

.mn-time-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  font-weight: 600;
}

.mn-time-label {
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: var(--tc-474747, #474747);
}

.mn-time-content strong {
  margin-top: 1px;

  color: var(--tc-3a3a3a, #3a3a3a);

  font-size: 21px;
  font-weight: 600;

  line-height: 1;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {
  .mn-couple {
    padding: 40px 16px 36px;
  }

  .mn-people {
    gap: 6px;
  }

  .mn-people h3 {
    font-size: 30px;
  }

  .mn-parents {
    font-size: 10px;
  }

  .mn-person__desc {
    font-size: 11px;
  }

  .mn-couple-divider {
    width: 25px;
  }

  .mn-couple-divider i {
    font-size: 26px;
  }

  .mn-date-day {
    padding: 0 12px;

    font-size: 58px;
  }

  .mn-date-side strong {
    font-size: 18px;
  }

  .mn-date-line {
    width: 28px;
  }
}

@media (max-width: 360px) {
  .mn-people {
    gap: 3px;
  }

  .mn-people h3 {
    font-size: 26px;
  }

  .mn-person__desc {
    font-size: 10px;
  }

  .mn-date-day {
    font-size: 52px;
  }
}
</style>
