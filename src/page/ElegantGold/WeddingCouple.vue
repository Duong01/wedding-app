<template>
  <section class="eg-couple">
    <p class="eg-eyebrow">TRÂN TRỌNG BÁO HỶ</p>

    <h2>Thông tin tiệc cưới</h2>

    <div class="eg-rule">
      <span></span>
      <i>❦</i>
      <span></span>
    </div>

    <div class="eg-people">
      <!-- CHÚ RỂ -->
      <article class="eg-person">
        <div class="eg-person__avatar">
          <img v-if="groomAvatar" :src="groomAvatar" alt="Chú rể" draggable="false" />
          <span v-else class="eg-person__initial">{{ groom.charAt(0) || "♥" }}</span>
        </div>

        <div class="eg-person__parents">
          <p v-if="groomParents?.Father" class="eg-parents">Ông {{ groomParents.Father }}</p>
          <p v-if="groomParents?.Mother" class="eg-parents">Bà {{ groomParents.Mother }}</p>
        </div>

        <h3>{{ groom }}</h3>

        <span class="eg-person__role">CHÚ RỂ</span>

        <p class="eg-person__desc">{{ groomDescription }}</p>
      </article>

      <div class="eg-couple-divider"><i>&amp;</i></div>

      <!-- CÔ DÂU -->
      <article class="eg-person">
        <div class="eg-person__avatar">
          <img v-if="brideAvatar" :src="brideAvatar" alt="Cô dâu" draggable="false" />
          <span v-else class="eg-person__initial">{{ bride.charAt(0) || "♥" }}</span>
        </div>

        <div class="eg-person__parents">
          <p v-if="brideParents?.Father" class="eg-parents">Ông {{ brideParents.Father }}</p>
          <p v-if="brideParents?.Mother" class="eg-parents">Bà {{ brideParents.Mother }}</p>
        </div>

        <h3>{{ bride }}</h3>

        <span class="eg-person__role">CÔ DÂU</span>

        <p class="eg-person__desc">{{ brideDescription }}</p>
      </article>
    </div>

    <!-- WEDDING DATE -->
    <div class="eg-wedding-date">
      <div class="eg-date-top">
        <span class="eg-date-line"></span>
        <span class="eg-weekday">{{ weddingWeekday }}</span>
        <span class="eg-date-line"></span>
      </div>

      <div class="eg-date-main">
        <div class="eg-date-side">
          <span>THÁNG</span>
          <strong>{{ weddingMonth }}</strong>
        </div>

        <div class="eg-date-day">{{ weddingDay }}</div>

        <div class="eg-date-side">
          <span>NĂM</span>
          <strong>{{ weddingYear }}</strong>
        </div>
      </div>

      <div v-if="weddingLunar" class="eg-lunar">{{ weddingLunar }}</div>

      <div v-if="weddingTime" class="eg-wedding-time">
        <div class="eg-time-content">
          <span class="eg-time-label">THỜI GIAN</span>
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

const groomAvatar = computed(
  () => props.wedding?.couple?.Groom?.Avatar || ""
);

const brideAvatar = computed(
  () => props.wedding?.couple?.Bride?.Avatar || ""
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
.eg-couple {
  position: relative;

  padding: 48px 22px 42px;

  text-align: center;

  color: #5f4f38;

  overflow: hidden;
}

/* Fine gold lattice texture */
.eg-couple::before {
  content: "";
  position: absolute;
  inset: 0;

  opacity: 0.05;

  background-image:
    repeating-linear-gradient(45deg, rgba(181, 138, 69, 0.7) 0 1px, transparent 1px 18px),
    repeating-linear-gradient(-45deg, rgba(181, 138, 69, 0.7) 0 1px, transparent 1px 18px);

  pointer-events: none;
}

.eg-eyebrow {
  position: relative;

  margin: 0;

  color: #8a7a52;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.eg-couple h2 {
  position: relative;

  margin: 6px 0 10px;

  font-family: "Playfair Display", Georgia, serif;

  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;

  color: #5d452a;
}

.eg-rule {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin: 0 auto;

  color: #b58a45;

  font-size: 14px;
}

.eg-rule span {
  width: 50px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(181, 138, 69, 0.85));
}

.eg-rule span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   PEOPLE
========================================================= */

.eg-people {
  position: relative;

  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;

  margin-top: 30px;
}

.eg-person {
  min-width: 0;

  padding: 18px 10px 16px;

  border: 1px solid rgba(181, 138, 69, 0.45);
  border-radius: 999px 999px 18px 18px;

  background: rgba(255, 255, 255, 0.55);
}

.eg-person__avatar {
  position: relative;

  width: 74px;
  height: 74px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 12px;

  border: 1px solid rgba(181, 138, 69, 0.7);
  border-radius: 50%;

  background: linear-gradient(170deg, rgba(181, 138, 69, 0.2), rgba(93, 69, 42, 0.1));

  overflow: hidden;
}

.eg-person__avatar::before {
  content: "";

  position: absolute;
  inset: 4px;

  border: 1px dashed rgba(181, 138, 69, 0.5);
  border-radius: 50%;

  z-index: 2;

  pointer-events: none;
}

.eg-person__avatar img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.eg-person__initial {
  font-family: "Playfair Display", Georgia, serif;

  font-size: 28px;
  font-weight: 600;

  color: #5d452a;
}

.eg-person__parents {
  min-height: 38px;
}

.eg-parents {
  margin: 2px 0;

  color: #8a7657;

  font-size: 11px;

  line-height: 1.35;

  letter-spacing: 0.03em;
}

.eg-people h3 {
  margin: 8px 0 4px;

  font-family: "Great Vibes", cursive;
  font-size: 36px;
  font-weight: 400;

  line-height: 1.2;

  color: #5d452a;
}

.eg-person__role {
  display: block;

  color: #8a7a52;

  font-size: 9px;

  letter-spacing: 0.24em;
  font-weight: 700;
}

.eg-person__desc {
  margin: 7px 0 0;

  color: #6d5c42;

  font-size: 12px;
  font-style: italic;

  line-height: 1.5;
}

.eg-couple-divider {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
}

.eg-couple-divider i {
  color: #b58a45;

  font-family: Georgia, serif;
  font-size: 30px;
  font-style: italic;
  font-weight: 400;
}

/* =========================================================
   WEDDING DATE
========================================================= */

.eg-wedding-date {
  position: relative;

  margin: 36px auto 0;
  max-width: 420px;

  padding: 22px 16px 20px;

  border: 1px solid rgba(181, 138, 69, 0.55);
  border-radius: 60% 60% 24px 24px / 28% 28% 24px 24px;

  background: rgba(255, 255, 255, 0.6);
}

.eg-date-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-bottom: 14px;
}

.eg-weekday {
  color: #5d452a;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.26em;
}

.eg-date-line {
  width: 42px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(181, 138, 69, 0.85));
}

.eg-date-line:last-child {
  transform: rotate(180deg);
}

.eg-date-main {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  max-width: 300px;

  margin: auto;
}

.eg-date-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.eg-date-side span {
  color: #8a7a52;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.eg-date-side strong {
  color: #5d452a;

  font-size: 20px;
  font-weight: 600;
}

.eg-date-day {
  padding: 0 22px;

  color: #5d452a;

  font-family: "Playfair Display", Georgia, serif;

  font-size: 66px;
  font-weight: 600;

  line-height: 0.95;
}

.eg-lunar {
  margin-top: 12px;

  color: #8a7657;

  font-size: 11px;
  font-style: italic;

  letter-spacing: 0.05em;
}

.eg-wedding-time {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-top: 18px;
}

.eg-time-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  font-weight: 600;
}

.eg-time-label {
  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;

  color: #8a7a52;
}

.eg-time-content strong {
  margin-top: 1px;

  color: #5d452a;

  font-size: 21px;
  font-weight: 600;

  line-height: 1;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {
  .eg-couple {
    padding: 40px 16px 36px;
  }

  .eg-people {
    gap: 6px;
  }

  .eg-person {
    padding: 14px 6px 12px;
  }

  .eg-person__avatar {
    width: 62px;
    height: 62px;
  }

  .eg-people h3 {
    font-size: 30px;
  }

  .eg-parents {
    font-size: 10px;
  }

  .eg-person__desc {
    font-size: 11px;
  }

  .eg-couple-divider {
    width: 25px;
  }

  .eg-couple-divider i {
    font-size: 24px;
  }

  .eg-date-day {
    padding: 0 12px;

    font-size: 58px;
  }

  .eg-date-side strong {
    font-size: 18px;
  }

  .eg-date-line {
    width: 28px;
  }
}

@media (max-width: 360px) {
  .eg-people {
    gap: 3px;
  }

  .eg-people h3 {
    font-size: 26px;
  }

  .eg-person__desc {
    font-size: 10px;
  }

  .eg-date-day {
    font-size: 52px;
  }
}
</style>
