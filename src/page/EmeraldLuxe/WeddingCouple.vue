<template>
  <section class="cr-couple">
    <img
      :src="cherryBlossom"
      alt=""
      aria-hidden="true"
      class="cr-couple__blossom"
      draggable="false"
    />

    <header class="cr-heading">
      <h2 class="cr-heading__vi">Thông tin lễ cưới</h2>

      <p class="cr-heading__zh">婚禮資訊</p>

      <div class="cr-heading__ornament" aria-hidden="true">
        <span></span>
        <i>❀</i>
        <span></span>
      </div>
    </header>

    <!-- =====================================================
         GIA ĐÌNH HAI BÊN
    ====================================================== -->

    <div class="cr-families">
      <div class="cr-family">
        <span class="cr-family__label">Ông Bà</span>

        <span v-if="groomParents.Father" class="cr-family__name">
          {{ groomParents.Father }}
        </span>

        <span v-if="groomParents.Mother" class="cr-family__name">
          {{ groomParents.Mother }}
        </span>

        <span v-if="groomParents.Address" class="cr-family__address">
          {{ groomParents.Address }}
        </span>
      </div>

      <span class="cr-families__divider" aria-hidden="true"></span>

      <div class="cr-family">
        <span class="cr-family__label">Ông Bà</span>

        <span v-if="brideParents.Father" class="cr-family__name">
          {{ brideParents.Father }}
        </span>

        <span v-if="brideParents.Mother" class="cr-family__name">
          {{ brideParents.Mother }}
        </span>

        <span v-if="brideParents.Address" class="cr-family__address">
          {{ brideParents.Address }}
        </span>
      </div>
    </div>

    <p class="cr-couple__announce">
      TRÂN TRỌNG BÁO TIN<br />LỄ THÀNH HÔN CỦA CON CHÚNG TÔI
    </p>

    <!-- =====================================================
         CÔ DÂU · CHÚ RỂ
    ====================================================== -->

    <div class="cr-people">
      <article class="cr-person">
        <div class="cr-person__avatar">
          <img v-if="groomAvatar" :src="groomAvatar" alt="Chú rể" draggable="false" />

          <span v-else class="cr-person__initial">{{ groom.charAt(0) || "♥" }}</span>
        </div>

        <h3 class="cr-person__name">{{ groom }}</h3>

        <span class="cr-person__role">CHÚ RỂ</span>

        <p class="cr-person__desc">{{ groomDescription }}</p>
      </article>

      <div class="cr-people__amp" aria-hidden="true">&amp;</div>

      <article class="cr-person">
        <div class="cr-person__avatar">
          <img v-if="brideAvatar" :src="brideAvatar" alt="Cô dâu" draggable="false" />

          <span v-else class="cr-person__initial">{{ bride.charAt(0) || "♥" }}</span>
        </div>

        <h3 class="cr-person__name">{{ bride }}</h3>

        <span class="cr-person__role">CÔ DÂU</span>

        <p class="cr-person__desc">{{ brideDescription }}</p>
      </article>
    </div>

    <!-- =====================================================
         NGÀY CƯỚI
    ====================================================== -->

    <div class="cr-date">
      <div class="cr-date__top">
        <span></span>
        <b>{{ weddingWeekday }}</b>
        <span></span>
      </div>

      <div class="cr-date__main">
        <div class="cr-date__side">
          <span>THÁNG</span>
          <strong>{{ weddingMonth }}</strong>
        </div>

        <div class="cr-date__day">{{ weddingDay }}</div>

        <div class="cr-date__side">
          <span>NĂM</span>
          <strong>{{ weddingYear }}</strong>
        </div>
      </div>

      <p v-if="weddingLunar" class="cr-date__lunar">{{ weddingLunar }}</p>

      <div v-if="weddingTime" class="cr-date__time">
        <span>THỜI GIAN</span>
        <strong>{{ weddingTime }}</strong>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import { cherryBlossom } from "./emeraldLuxeAssets";

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

/* =========================================================
   NGÀY CƯỚI
========================================================= */

const dateObject = computed(() => {
  const raw =
    props.wedding?.weddingDate ||
    props.wedding?.WeddingDate ||
    props.wedding?.hero?.weddingDate ||
    "";

  if (!raw) return null;

  const date = new Date(raw);

  return Number.isNaN(date.getTime()) ? null : date;
});

const weddingDay = computed(() =>
  dateObject.value ? String(dateObject.value.getDate()).padStart(2, "0") : "--"
);

const weddingMonth = computed(() =>
  dateObject.value ? String(dateObject.value.getMonth() + 1).padStart(2, "0") : "--"
);

const weddingYear = computed(() =>
  dateObject.value ? String(dateObject.value.getFullYear()) : "----"
);

const weddingWeekday = computed(() => {
  if (!dateObject.value) return "";

  const weekdays = [
    "CHỦ NHẬT",
    "THỨ HAI",
    "THỨ BA",
    "THỨ TƯ",
    "THỨ NĂM",
    "THỨ SÁU",
    "THỨ BẢY",
  ];

  return weekdays[dateObject.value.getDay()];
});

const weddingLunar = computed(
  () =>
    props.wedding?.weddingLunar ||
    props.wedding?.WeddingLunar ||
    props.wedding?.lunarDate ||
    props.wedding?.LunarDate ||
    props.wedding?.events?.[0]?.Lunar ||
    ""
);

const weddingTime = computed(() => {
  const event = Array.isArray(props.wedding?.events) ? props.wedding.events[0] : null;

  const time =
    event?.EventTime ||
    event?.Time ||
    event?.StartTime ||
    props.wedding?.weddingTime ||
    props.wedding?.WeddingTime ||
    props.wedding?.hero?.Time ||
    "";

  if (!time) return "";

  if (typeof time === "string" && time.includes("T")) {
    const date = new Date(time);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
  }

  if (typeof time === "string" && /^\d{1,2}:\d{2}:\d{2}$/.test(time)) {
    return time.substring(0, 5);
  }

  return String(time);
});
</script>

<style scoped>
.cr-couple {
  position: relative;

  padding: 8px 0 0;

  text-align: center;

  color: var(--cr-ink);
}

.cr-couple__blossom {
  position: absolute;

  top: 4px;
  right: -18px;

  width: 96px;
  height: 96px;

  object-fit: contain;

  opacity: 0.5;

  pointer-events: none;
}

/* =========================================================
   TIÊU ĐỀ
========================================================= */

.cr-heading {
  position: relative;

  text-align: center;
}

.cr-heading__vi {
  margin: 0;

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: clamp(22px, 6vw, 30px);
  font-weight: 400;

  letter-spacing: 0.06em;

  text-transform: uppercase;

  color: var(--cr-ink);
}

.cr-heading__zh {
  margin: 4px 0 0;

  font-family: "Noto Serif SC", serif;

  font-size: 0.85em;

  letter-spacing: 0.3em;
  text-indent: 0.3em;

  opacity: 0.7;

  color: var(--cr-soft);
}

.cr-heading__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-top: 12px;

  color: var(--cr-accent);
}

.cr-heading__ornament span {
  width: 52px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--cr-accent-rgb), 1));
}

.cr-heading__ornament span:last-child {
  transform: rotate(180deg);
}

.cr-heading__ornament i {
  font-size: 13px;
  font-style: normal;
}

/* =========================================================
   GIA ĐÌNH
========================================================= */

.cr-families {
  display: grid;
  grid-template-columns: 1fr auto 1fr;

  column-gap: 12px;

  margin-top: 26px;

  font-size: 13px;
}

.cr-family {
  display: flex;
  flex-direction: column;
  align-items: center;

  min-width: 0;

  text-align: center;
}

.cr-family__label {
  color: var(--cr-muted);

  font-size: 11px;

  letter-spacing: 0.16em;
}

.cr-family__name {
  margin-top: 2px;

  font-weight: 600;

  overflow-wrap: anywhere;
}

.cr-family__address {
  margin-top: 4px;

  color: var(--cr-soft);

  font-size: 11px;

  line-height: 1.4;

  white-space: pre-line;
}

.cr-families__divider {
  align-self: center;

  width: 1px;
  height: 58px;

  background-color: rgba(var(--cr-ink-rgb), 0.22);
}

/* =========================================================
   LỜI BÁO TIN
========================================================= */

.cr-couple__announce {
  margin: 26px auto 0;

  max-width: 420px;

  color: var(--cr-soft);

  font-size: 12px;

  letter-spacing: 0.1em;
  line-height: 1.8;

  white-space: pre-line;
}

/* =========================================================
   CÔ DÂU · CHÚ RỂ
========================================================= */

.cr-people {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: start;
  gap: 10px;

  margin-top: 26px;
}

.cr-person {
  min-width: 0;

  padding: 18px 10px 16px;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.18);
  border-radius: 16px;

  background: rgba(var(--cr-surface-rgb), 0.85);
}

.cr-person__avatar {
  position: relative;

  width: 78px;
  height: 78px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 12px;

  border: 1px solid rgba(var(--cr-accent-rgb), 1);
  border-radius: 50%;

  background: rgba(var(--cr-bg-rgb), 0.9);

  overflow: hidden;
}

.cr-person__avatar img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.cr-person__initial {
  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: 28px;

  color: var(--cr-ink);
}

.cr-person__name {
  margin: 0;

  font-family: "Babylonica", "Great Vibes", cursive;

  font-size: clamp(28px, 8vw, 36px);
  font-weight: 400;

  line-height: 1.25;

  color: var(--cr-ink);
}

.cr-person__role {
  display: block;

  margin-top: 2px;

  color: var(--cr-muted);

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.24em;
  text-indent: 0.24em;
}

.cr-person__desc {
  margin: 8px 0 0;

  color: var(--cr-soft);

  font-size: 11px;
  font-style: italic;

  line-height: 1.55;
}

.cr-people__amp {
  align-self: center;

  color: var(--cr-accent);

  font-family: Georgia, serif;
  font-size: 28px;
  font-style: italic;
}

/* =========================================================
   NGÀY CƯỚI
========================================================= */

.cr-date {
  margin: 30px auto 0;
  max-width: 400px;

  padding: 20px 16px 18px;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.18);
  border-radius: 16px;

  background: rgba(var(--cr-surface-rgb), 0.85);
}

.cr-date__top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-bottom: 12px;
}

.cr-date__top b {
  color: var(--cr-ink);

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.26em;
}

.cr-date__top span {
  width: 40px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--cr-accent-rgb), 1));
}

.cr-date__top span:last-child {
  transform: rotate(180deg);
}

.cr-date__main {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  max-width: 290px;

  margin: 0 auto;
}

.cr-date__side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.cr-date__side span {
  color: var(--cr-muted);

  font-size: 10px;

  letter-spacing: 0.2em;
}

.cr-date__side strong {
  color: var(--cr-ink);

  font-size: 19px;
  font-weight: 600;
}

.cr-date__day {
  padding: 0 20px;

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: 62px;

  line-height: 0.95;

  color: var(--cr-ink);
}

.cr-date__lunar {
  margin: 12px 0 0;

  color: var(--cr-soft);

  font-size: 11px;
  font-style: italic;
}

.cr-date__time {
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-top: 14px;
  padding-top: 12px;

  border-top: 1px solid rgba(var(--cr-accent-rgb), 0.9);
}

.cr-date__time span {
  color: var(--cr-muted);

  font-size: 10px;

  letter-spacing: 0.2em;
}

.cr-date__time strong {
  margin-top: 2px;

  color: var(--cr-ink);

  font-size: 20px;
  font-weight: 600;
}

/* =========================================================
   MOBILE NHỎ
========================================================= */

@media (max-width: 380px) {
  .cr-people {
    gap: 6px;
  }

  .cr-person {
    padding: 14px 6px 12px;
  }

  .cr-person__avatar {
    width: 64px;
    height: 64px;
  }

  .cr-person__desc {
    font-size: 10px;
  }

  .cr-date__day {
    padding: 0 12px;

    font-size: 54px;
  }

  .cr-date__top span {
    width: 26px;
  }
}
</style>
