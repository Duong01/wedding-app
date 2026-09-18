<template>
  <section class="lp-couple">
    <!-- Tiêu đề có khung frame-title -->
    <div class="lp-section-title">
      <h2>TRÂN TRỌNG BÁO TIN</h2>
    </div>

    <p class="lp-couple__announce">
      LỄ THÀNH HÔN CỦA CON CHÚNG TÔI
    </p>

    <!-- Gia đình hai bên: 1fr | divider | 1fr -->
    <div class="lp-family">
      <!-- NHÀ CHÚ RỂ -->
      <div class="lp-family__side">
        <p class="lp-family__parent-title">NHÀ GÁI</p>

        <p class="lp-family__parent">Ông {{ groomParents?.Father || "—" }}</p>
        <p class="lp-family__parent">Bà {{ groomParents?.Mother || "—" }}</p>

        <h3 class="lp-family__name">{{ groom }}</h3>

        <p v-if="groomBirthOrder" class="lp-family__birth-order">{{ groomBirthOrder }}</p>

        <p class="lp-family__address">{{ groomAddress }}</p>
      </div>

      <div class="lp-family__divider" aria-hidden="true"></div>

      <!-- NHÀ TRAI -->
      <div class="lp-family__side">
        <p class="lp-family__parent-title">NHÀ TRAI</p>

        <p class="lp-family__parent">Ông {{ brideParents?.Father || "—" }}</p>
        <p class="lp-family__parent">Bà {{ brideParents?.Mother || "—" }}</p>

        <h3 class="lp-family__name">{{ bride }}</h3>

        <p v-if="brideBirthOrder" class="lp-family__birth-order">{{ brideBirthOrder }}</p>

        <p class="lp-family__address">{{ brideAddress }}</p>
      </div>
    </div>

    <!-- Tên cặp đôi lớn -->
    <div class="lp-couple__names">
      <span>{{ groom }}</span>
      <i>&amp;</i>
      <span>{{ bride }}</span>
    </div>

    <!-- NGÀY CƯỚI -->
    <div class="lp-wedding-date">
      <div class="lp-date-row">
        <span class="lp-date-part">{{ weddingDatePart }}</span>

        <span class="lp-date-day">{{ weddingDay }}</span>

        <span class="lp-date-part">{{ weddingYear }}</span>
      </div>

      <p v-if="weddingLunar" class="lp-date-lunar">{{ weddingLunar }}</p>

      <p v-if="weddingTime" class="lp-date-time">{{ weddingTime }}</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import dayjs from "dayjs";

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

const groomParents = computed(() => props.wedding?.couple?.Groom || {});
const brideParents = computed(() => props.wedding?.couple?.Bride || {});

const groomBirthOrder = computed(
  () => props.wedding?.couple?.Groom?.BirthOrder || props.wedding?.couple?.Groom?.birthOrder || ""
);

const brideBirthOrder = computed(
  () => props.wedding?.couple?.Bride?.BirthOrder || props.wedding?.couple?.Bride?.birthOrder || ""
);

const groomAddress = computed(
  () =>
    props.wedding?.couple?.Groom?.Address ||
    props.wedding?.couple?.Groom?.address ||
    ""
);

const brideAddress = computed(
  () =>
    props.wedding?.couple?.Bride?.Address ||
    props.wedding?.couple?.Bride?.address ||
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

  const date = dayjs(weddingDate.value);

  return date.isValid() ? date : null;
});

const weddingDay = computed(() => (dateObject.value ? dateObject.value.format("DD") : "--"));

const weddingDatePart = computed(() => {
  if (!dateObject.value) return "-- · --";

  return dateObject.value.format("DD · MM");
});

const weddingYear = computed(() => (dateObject.value ? dateObject.value.format("YYYY") : "----"));

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
.lp-couple {
  position: relative;

  padding: 40px 22px 30px;

  text-align: center;

  color: #ffbe89;
}

/* =========================================================
   TIÊU ĐỀ CÓ KHUNG frame-title
========================================================= */

.lp-section-title {
  width: fit-content;
  max-width: 100%;

  margin: 0 auto 18px;

  border-style: solid;
  border-color: transparent;
  border-width: 18px;

  border-image-source: url("@/assets/decor/longphung-v3/frame-title.svg");
  border-image-slice: 31;
  border-image-repeat: stretch;

  text-align: center;
}

.lp-section-title h2 {
  margin: 0;

  font-family: "Times New Roman", Times, serif;

  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.05em;

  color: #ffbe89;
}

.lp-couple__announce {
  margin: 0 0 26px;

  text-transform: uppercase;

  font-size: 14px;

  letter-spacing: 0.08em;

  color: rgba(255, 190, 137, 0.9);
}

/* =========================================================
   GIA ĐÌNH HAI BÊN
========================================================= */

.lp-family {
  width: 100%;

  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  justify-content: center;

  gap: 12px;
}

@media (min-width: 768px) {
  .lp-family {
    gap: 32px;
  }
}

.lp-family__side {
  min-width: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;

  text-align: center;
}

.lp-family__parent-title {
  margin: 0 0 4px;

  font-size: 12px;

  letter-spacing: 0.14em;

  opacity: 0.6;
}

.lp-family__parent {
  margin: 0;

  font-size: 13px;
}

@media (min-width: 768px) {
  .lp-family__parent {
    font-size: 14px;
  }
}

.lp-family__name {
  margin: 8px 0 2px;

  font-family: "EB Garamond", "Baskerville", "Times New Roman", serif;

  font-size: 17px;
  font-weight: 600;

  overflow-wrap: anywhere;

  color: #ffbe89;
}

.lp-family__birth-order {
  margin: 0;

  text-transform: uppercase;

  font-size: 11px;

  letter-spacing: 0.2em;

  opacity: 0.6;
}

.lp-family__address {
  margin: 6px 0 0;

  font-size: 11px;

  line-height: 1.5;

  white-space: pre-line;

  opacity: 0.5;
}

/* Đường phân cách dọc giữa hai nhà */
.lp-family__divider {
  width: 1px;
  height: 50px;

  align-self: center;

  background: #ffbe89;

  opacity: 0.3;
}

/* =========================================================
   TÊN CẶP ĐÔI
========================================================= */

.lp-couple__names {
  margin: 30px 0 0;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  font-family: "EB Garamond", "Baskerville", "Times New Roman", serif;

  font-size: clamp(34px, 9vw, 46px);

  color: #ffbe89;
}

.lp-couple__names i {
  font-size: 0.75em;

  font-style: italic;

  opacity: 0.6;
}

/* =========================================================
   NGÀY CƯỚI
========================================================= */

.lp-wedding-date {
  margin: 26px auto 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.lp-date-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.lp-date-part {
  width: 70px;

  text-transform: uppercase;

  font-size: 13px;

  opacity: 0.75;
}

@media (min-width: 768px) {
  .lp-date-part {
    width: 85px;

    font-size: 14px;
  }
}

.lp-date-day {
  font-family: "Big Caslon", "Baskerville", "Times New Roman", serif;

  font-size: 30px;

  color: #ffbe89;
}

@media (min-width: 768px) {
  .lp-date-day {
    font-size: 36px;
  }
}

.lp-date-lunar {
  margin: 0;

  font-size: 12px;

  opacity: 0.6;
}

.lp-date-time {
  margin: 0;

  font-size: 14px;
  font-weight: 600;

  color: #ffbe89;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .lp-couple {
    padding: 32px 14px 24px;
  }

  .lp-family {
    gap: 8px;
  }

  .lp-family__name {
    font-size: 15px;
  }
}
</style>
