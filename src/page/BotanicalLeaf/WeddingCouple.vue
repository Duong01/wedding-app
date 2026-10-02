<template>
  <section class="bl-couple">
    <p v-if="eyebrow" class="bl-eyebrow">{{ eyebrow }}</p>

    <h2>{{ heading }}</h2>

    <div class="bl-rule">
      <span></span>
      <i>❧</i>
      <span></span>
    </div>

    <div class="bl-people">
      <!-- CHÚ RỂ -->
      <article class="bl-person bl-person--groom">
        <div class="bl-person__portrait">
          <img
            v-if="groomAvatar"
            :src="groomAvatar"
            :alt="groom"
            loading="lazy"
            decoding="async"
          />
          <span v-else class="bl-person__initial">{{ groom.charAt(0) || "♥" }}</span>
        </div>

        <div class="bl-person__parents">
          <p v-if="groomParents?.Father" class="bl-parents">Ông {{ groomParents.Father }}</p>
          <p v-if="groomParents?.Mother" class="bl-parents">Bà {{ groomParents.Mother }}</p>
        </div>

        <h3>{{ groom }}</h3>

        <span class="bl-person__role">CHÚ RỂ</span>

        <p class="bl-person__desc">{{ groomDescription }}</p>
      </article>

      <div class="bl-couple-divider"><i>&amp;</i></div>

      <!-- CÔ DÂU -->
      <article class="bl-person bl-person--bride">
        <div class="bl-person__portrait">
          <img
            v-if="brideAvatar"
            :src="brideAvatar"
            :alt="bride"
            loading="lazy"
            decoding="async"
          />
          <span v-else class="bl-person__initial">{{ bride.charAt(0) || "♥" }}</span>
        </div>

        <div class="bl-person__parents">
          <p v-if="brideParents?.Father" class="bl-parents">Ông {{ brideParents.Father }}</p>
          <p v-if="brideParents?.Mother" class="bl-parents">Bà {{ brideParents.Mother }}</p>
        </div>

        <h3>{{ bride }}</h3>

        <span class="bl-person__role">CÔ DÂU</span>

        <p class="bl-person__desc">{{ brideDescription }}</p>
      </article>
    </div>

    <!-- WEDDING DATE -->
    <div class="bl-wedding-date">
      <div class="bl-date-top">
        <span class="bl-date-line"></span>
        <span class="bl-weekday">{{ weddingWeekday }}</span>
        <span class="bl-date-line"></span>
      </div>

      <div class="bl-date-main">
        <div class="bl-date-side">
          <span>THÁNG</span>
          <strong>{{ weddingMonth }}</strong>
        </div>

        <div class="bl-date-day">{{ weddingDay }}</div>

        <div class="bl-date-side">
          <span>NĂM</span>
          <strong>{{ weddingYear }}</strong>
        </div>
      </div>

      <div v-if="weddingLunar" class="bl-lunar">{{ weddingLunar }}</div>

      <div v-if="weddingTime" class="bl-wedding-time">
        <div class="bl-time-content">
          <span class="bl-time-label">THỜI GIAN</span>
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
.bl-couple {
  position: relative;

  padding: 48px 22px 42px;

  text-align: center;

  color: #3d5a47;

  overflow: hidden;
}

.bl-eyebrow {
  margin: 0;

  color: #4a6653;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.bl-couple h2 {
  margin: 6px 0 10px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;

  color: #3d5a47;
}

.bl-rule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin: 0 auto;

  color: #4f6b58;

  font-size: 14px;
}

.bl-rule span {
  width: 50px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(181, 208, 186, 0.7));
}

.bl-rule span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   PEOPLE
========================================================= */

.bl-people {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;

  margin-top: 30px;
}

.bl-person {
  min-width: 0;
}

.bl-person__portrait {
  width: 92px;
  height: 92px;

  margin: 0 auto 12px;

  border: 2px solid rgba(127, 163, 137, 0.55);
  border-radius: 50%;

  background: rgba(252, 253, 252, 0.9);

  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.12);

  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
}

.bl-person__portrait img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.bl-person__initial {
  font-family: "Allura", cursive;

  font-size: 38px;

  color: #4a6653;
}

.bl-person__parents {
  min-height: 38px;
}

.bl-parents {
  margin: 2px 0;

  color: #526e5a;

  font-size: 11px;

  line-height: 1.35;

  letter-spacing: 0.03em;
}

.bl-people h3 {
  margin: 8px 0 4px;

  font-family: "Allura", cursive;
  font-size: 36px;
  font-weight: 400;

  line-height: 1.2;

  color: #3d5a47;
}

.bl-person__role {
  display: block;

  color: #4a6653;

  font-size: 11px;

  letter-spacing: 0.24em;
  font-weight: 700;
}

.bl-person__desc {
  margin: 7px 0 0;

  color: #5a7362;

  font-size: 12px;
  font-style: italic;

  line-height: 1.5;
}

.bl-couple-divider {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
}

.bl-couple-divider i {
  color: #4f6b58;

  font-family: "Allura", cursive;
  font-size: 34px;
  font-style: normal;
  font-weight: 400;
}

/* =========================================================
   WEDDING DATE
========================================================= */

.bl-wedding-date {
  position: relative;

  margin: 36px auto 0;
  max-width: 420px;
}

.bl-date-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-bottom: 14px;
}

.bl-weekday {
  color: #3d5a47;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.bl-date-line {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(181, 208, 186, 0.7));
}

.bl-date-line:last-child {
  transform: rotate(180deg);
}

.bl-date-main {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  max-width: 300px;

  margin: auto;
}

.bl-date-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.bl-date-side span {
  color: #4a6653;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.bl-date-side strong {
  color: #3d5a47;

  font-size: 20px;
  font-weight: 600;
}

.bl-date-day {
  padding: 0 22px;

  color: #3d5a47;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 66px;
  font-weight: 600;

  line-height: 0.95;
}

.bl-lunar {
  margin-top: 12px;

  color: #526e5a;

  font-size: 11px;
  font-style: italic;

  letter-spacing: 0.05em;
}

.bl-wedding-time {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-top: 18px;
}

.bl-time-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  font-weight: 600;
}

.bl-time-label {
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #4a6653;
}

.bl-time-content strong {
  margin-top: 1px;

  color: #3d5a47;

  font-size: 21px;
  font-weight: 600;

  line-height: 1;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {
  .bl-couple {
    padding: 40px 16px 36px;
  }

  .bl-people {
    gap: 6px;
  }

  .bl-people h3 {
    font-size: 30px;
  }

  .bl-parents {
    font-size: 10px;
  }

  .bl-person__desc {
    font-size: 11px;
  }

  .bl-couple-divider {
    width: 25px;
  }

  .bl-couple-divider i {
    font-size: 26px;
  }

  .bl-date-day {
    padding: 0 12px;

    font-size: 58px;
  }

  .bl-date-side strong {
    font-size: 18px;
  }

  .bl-date-line {
    width: 28px;
  }
}

@media (max-width: 360px) {
  .bl-people {
    gap: 3px;
  }

  .bl-people h3 {
    font-size: 26px;
  }

  .bl-person__desc {
    font-size: 10px;
  }

  .bl-date-day {
    font-size: 52px;
  }
}
</style>
