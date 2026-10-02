<template>
  <section class="rr-couple">
    <p v-if="eyebrow" class="rr-eyebrow">{{ eyebrow }}</p>

    <h2>{{ heading }}</h2>

    <div class="rr-rule">
      <span></span>
      <i>❥</i>
      <span></span>
    </div>

    <div class="rr-people">
      <!-- CHÚ RỂ -->
      <article class="rr-person rr-person--groom">
        <div class="rr-person__portrait">
          <img
            v-if="groomAvatar"
            :src="groomAvatar"
            :alt="groom"
            loading="lazy"
            decoding="async"
          />
          <span v-else class="rr-person__initial">{{ groom.charAt(0) || "♥" }}</span>
        </div>

        <div class="rr-person__parents">
          <p v-if="groomParents?.Father" class="rr-parents">Ông {{ groomParents.Father }}</p>
          <p v-if="groomParents?.Mother" class="rr-parents">Bà {{ groomParents.Mother }}</p>
        </div>

        <h3>{{ groom }}</h3>

        <span class="rr-person__role">CHÚ RỂ</span>

        <p class="rr-person__desc">{{ groomDescription }}</p>
      </article>

      <div class="rr-couple-divider"><i>&amp;</i></div>

      <!-- CÔ DÂU -->
      <article class="rr-person rr-person--bride">
        <div class="rr-person__portrait">
          <img
            v-if="brideAvatar"
            :src="brideAvatar"
            :alt="bride"
            loading="lazy"
            decoding="async"
          />
          <span v-else class="rr-person__initial">{{ bride.charAt(0) || "♥" }}</span>
        </div>

        <div class="rr-person__parents">
          <p v-if="brideParents?.Father" class="rr-parents">Ông {{ brideParents.Father }}</p>
          <p v-if="brideParents?.Mother" class="rr-parents">Bà {{ brideParents.Mother }}</p>
        </div>

        <h3>{{ bride }}</h3>

        <span class="rr-person__role">CÔ DÂU</span>

        <p class="rr-person__desc">{{ brideDescription }}</p>
      </article>
    </div>

    <!-- WEDDING DATE -->
    <div class="rr-wedding-date">
      <div class="rr-date-top">
        <span class="rr-date-line"></span>
        <span class="rr-weekday">{{ weddingWeekday }}</span>
        <span class="rr-date-line"></span>
      </div>

      <div class="rr-date-main">
        <div class="rr-date-side">
          <span>THÁNG</span>
          <strong>{{ weddingMonth }}</strong>
        </div>

        <div class="rr-date-day">{{ weddingDay }}</div>

        <div class="rr-date-side">
          <span>NĂM</span>
          <strong>{{ weddingYear }}</strong>
        </div>
      </div>

      <div v-if="weddingLunar" class="rr-lunar">{{ weddingLunar }}</div>

      <div v-if="weddingTime" class="rr-wedding-time">
        <div class="rr-time-content">
          <span class="rr-time-label">THỜI GIAN</span>
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
.rr-couple {
  position: relative;

  padding: 48px 22px 42px;

  text-align: center;

  color: #8c2f42;

  overflow: hidden;
}

.rr-eyebrow {
  margin: 0;

  color: #683440;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.rr-couple h2 {
  margin: 6px 0 10px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;

  color: #8c2f42;
}

.rr-rule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin: 0 auto;

  color: #6e3844;

  font-size: 14px;
}

.rr-rule span {
  width: 50px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(217, 152, 166, 0.7));
}

.rr-rule span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   PEOPLE
========================================================= */

.rr-people {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;

  margin-top: 30px;
}

.rr-person {
  min-width: 0;
}

.rr-person__portrait {
  width: 92px;
  height: 92px;

  margin: 0 auto 12px;

  border: 2px solid rgba(196, 106, 126, 0.55);
  border-radius: 50%;

  background: rgba(254, 250, 251, 0.9);

  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.12);

  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
}

.rr-person__portrait img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.rr-person__initial {
  font-family: "Allura", cursive;

  font-size: 38px;

  color: #683440;
}

.rr-person__parents {
  min-height: 38px;
}

.rr-parents {
  margin: 2px 0;

  color: #703a46;

  font-size: 11px;

  line-height: 1.35;

  letter-spacing: 0.03em;
}

.rr-people h3 {
  margin: 8px 0 4px;

  font-family: "Allura", cursive;
  font-size: 36px;
  font-weight: 400;

  line-height: 1.2;

  color: #8c2f42;
}

.rr-person__role {
  display: block;

  color: #683440;

  font-size: 11px;

  letter-spacing: 0.24em;
  font-weight: 700;
}

.rr-person__desc {
  margin: 7px 0 0;

  color: #7a4450;

  font-size: 12px;
  font-style: italic;

  line-height: 1.5;
}

.rr-couple-divider {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
}

.rr-couple-divider i {
  color: #6e3844;

  font-family: "Allura", cursive;
  font-size: 34px;
  font-style: normal;
  font-weight: 400;
}

/* =========================================================
   WEDDING DATE
========================================================= */

.rr-wedding-date {
  position: relative;

  margin: 36px auto 0;
  max-width: 420px;
}

.rr-date-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-bottom: 14px;
}

.rr-weekday {
  color: #8c2f42;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.rr-date-line {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(217, 152, 166, 0.7));
}

.rr-date-line:last-child {
  transform: rotate(180deg);
}

.rr-date-main {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  max-width: 300px;

  margin: auto;
}

.rr-date-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.rr-date-side span {
  color: #683440;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.rr-date-side strong {
  color: #8c2f42;

  font-size: 20px;
  font-weight: 600;
}

.rr-date-day {
  padding: 0 22px;

  color: #8c2f42;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 66px;
  font-weight: 600;

  line-height: 0.95;
}

.rr-lunar {
  margin-top: 12px;

  color: #703a46;

  font-size: 11px;
  font-style: italic;

  letter-spacing: 0.05em;
}

.rr-wedding-time {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-top: 18px;
}

.rr-time-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  font-weight: 600;
}

.rr-time-label {
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #683440;
}

.rr-time-content strong {
  margin-top: 1px;

  color: #8c2f42;

  font-size: 21px;
  font-weight: 600;

  line-height: 1;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {
  .rr-couple {
    padding: 40px 16px 36px;
  }

  .rr-people {
    gap: 6px;
  }

  .rr-people h3 {
    font-size: 30px;
  }

  .rr-parents {
    font-size: 10px;
  }

  .rr-person__desc {
    font-size: 11px;
  }

  .rr-couple-divider {
    width: 25px;
  }

  .rr-couple-divider i {
    font-size: 26px;
  }

  .rr-date-day {
    padding: 0 12px;

    font-size: 58px;
  }

  .rr-date-side strong {
    font-size: 18px;
  }

  .rr-date-line {
    width: 28px;
  }
}

@media (max-width: 360px) {
  .rr-people {
    gap: 3px;
  }

  .rr-people h3 {
    font-size: 26px;
  }

  .rr-person__desc {
    font-size: 10px;
  }

  .rr-date-day {
    font-size: 52px;
  }
}
</style>
