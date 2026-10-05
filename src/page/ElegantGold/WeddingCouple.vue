<template>
  <section class="la-couple">
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'couple', 'Eyebrow')" class="la-top-custom-head">
      <p v-if="sectionOverride(sections, 'couple', 'Eyebrow')" class="la-top-custom-head__eyebrow">{{ sectionOverride(sections, "couple", "Eyebrow") }}</p>
    </header>

    <h2 class="la-title">{{ sectionText(sections, "couple", "Heading", $t("Thông tin lễ cưới")) }}</h2>

    <!-- =====================================================
         ÔNG BÀ HAI BÊN
    ====================================================== -->
    <div class="la-parents">
      <div class="la-parents__side">
        <span class="la-parents__label">{{ $t("Ông Bà") }}</span>

        <span v-if="groomFather" class="la-parents__name">{{ groomFather }}</span>

        <span v-if="groomMother" class="la-parents__name">{{ groomMother }}</span>

        <p v-if="groomAddress" class="la-parents__address">{{ groomAddress }}</p>
      </div>

      <div class="la-parents__divider"></div>

      <div class="la-parents__side">
        <span class="la-parents__label">{{ $t("Ông Bà") }}</span>

        <span v-if="brideFather" class="la-parents__name">{{ brideFather }}</span>

        <span v-if="brideMother" class="la-parents__name">{{ brideMother }}</span>

        <p v-if="brideAddress" class="la-parents__address">{{ brideAddress }}</p>
      </div>
    </div>

    <!-- =====================================================
         BÁO TIN
    ====================================================== -->
    <p class="la-couple__announce">
      {{ $t("TRÂN TRỌNG BÁO TIN") }}<br />
      {{ $t("LỄ THÀNH HÔN CỦA CON CHÚNG TÔI") }}
    </p>

    <!-- =====================================================
         TÊN ĐÔI UYÊN ƯƠNG
    ====================================================== -->
    <div class="la-couple__names">
      <h3 class="la-couple__name">{{ groomName }}</h3>

      <span class="la-couple__role">{{ groomRole }}</span>

      <p class="la-couple__amp">&amp;</p>

      <h3 class="la-couple__name">{{ brideName }}</h3>

      <span class="la-couple__role">{{ brideRole }}</span>
    </div>

    <!-- =====================================================
         NGÀY THÀNH HÔN
    ====================================================== -->
    <div class="la-date">
      <p class="la-date__place">
        {{ $t("LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI") }}<br />
        {{ location }}
      </p>

      <p class="la-date__lead">{{ $t("VÀO LÚC") }}</p>

      <p v-if="weddingTime" class="la-date__time">{{ weddingTime }}</p>

      <div class="la-date__row">
        <span class="la-date__side">{{ weddingWeekday }}</span>

        <span class="la-date__bar"></span>

        <span class="la-date__day">{{ weddingDay }}</span>

        <span class="la-date__bar"></span>

        <span class="la-date__side">THÁNG {{ weddingMonth }}</span>
      </div>

      <p class="la-date__year">{{ weddingYear }}</p>

      <p v-if="weddingLunar" class="la-date__lunar">( Tức ngày {{ weddingLunar }} )</p>
    </div>

    <img :src="love" alt="" class="la-couple__love" aria-hidden="true" />
  </section>
</template>

<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { computed } from "vue";

import love from "@/assets/love-art/love.webp";
import { t, localeTag } from "@/lang";
const props = defineProps({
  sections: { type: Object, default: () => ({}) },
  wedding: { type: Object, default: () => ({}) },
  guestName: { type: String, default: "Quý khách" },
});

const groomName = computed(
  () =>
    props.wedding?.GroomName ||
    props.wedding?.groomName ||
    props.wedding?.hero?.GroomName ||
    props.wedding?.couple?.Groom?.Name ||
    ""
);

const brideName = computed(
  () =>
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.hero?.BrideName ||
    props.wedding?.couple?.Bride?.Name ||
    ""
);

const groomRole = computed(() => props.wedding?.couple?.Groom?.Role || t("Trưởng Nam"));

const brideRole = computed(() => props.wedding?.couple?.Bride?.Role || t("Thứ Nữ"));

const groomFather = computed(() => props.wedding?.couple?.Groom?.Father || "");

const groomMother = computed(() => props.wedding?.couple?.Groom?.Mother || "");

const brideFather = computed(() => props.wedding?.couple?.Bride?.Father || "");

const brideMother = computed(() => props.wedding?.couple?.Bride?.Mother || "");

const groomAddress = computed(() => props.wedding?.couple?.Groom?.Address || "");

const brideAddress = computed(() => props.wedding?.couple?.Bride?.Address || "");

const location = computed(
  () =>
    props.wedding?.events?.[0]?.Location ||
    props.wedding?.hero?.Location ||
    props.wedding?.location ||
    t("Tư gia")
);

/* =========================================================
   NGÀY CƯỚI
========================================================= */

const weddingDate = computed(
  () =>
    props.wedding?.weddingDate ||
    props.wedding?.WeddingDate ||
    props.wedding?.hero?.weddingDate ||
    props.wedding?.events?.[0]?.EventDate ||
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

  const weekdays = [t("CHỦ NHẬT"), t("THỨ HAI"), t("THỨ BA"), t("THỨ TƯ"), t("THỨ NĂM"), t("THỨ SÁU"), t("THỨ BẢY")];

  return t(weekdays[dateObject.value.getDay()]);
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
    props.wedding?.hero?.Time ||
    props.wedding?.weddingTime ||
    "";

  if (!time) return "";

  if (typeof time === "string" && time.includes("T")) {
    const date = new Date(time);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString(localeTag(), {
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
.la-couple {
  text-align: center;
}

/* =========================================================
   ÔNG BÀ HAI BÊN
========================================================= */

.la-parents {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  column-gap: 12px;

  width: 100%;
  max-width: 366px;

  margin: 22px auto 0;
}

.la-parents__side {
  display: flex;
  flex-direction: column;
  align-items: center;

  min-width: 0;
}

.la-parents__label {
  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 14px;
  font-weight: 300;
}

.la-parents__name {
  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 14px;
  font-weight: 600;

  overflow-wrap: anywhere;
}

.la-parents__address {
  max-width: 169px;
  margin: 4px 0 0;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 11px;
  font-weight: 300;

  line-height: 1.4;
  white-space: pre-line;
}

.la-parents__divider {
  align-self: center;

  width: 1px;
  height: 60px;

  background-color: var(--la-red);
}

/* =========================================================
   BÁO TIN
========================================================= */

.la-couple__announce {
  max-width: 300px;
  margin: 26px auto 0;

  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 16px;
  font-weight: 400;

  line-height: 1.35;
  white-space: pre-line;
}

/* =========================================================
   TÊN ĐÔI UYÊN ƯƠNG
========================================================= */

.la-couple__names {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  margin-top: 24px;
}

.la-couple__name {
  margin: 0;

  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 40px;
  font-weight: 400;

  line-height: 1.1;
}

.la-couple__role {
  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 12px;
  font-weight: 300;

  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.la-couple__amp {
  margin: 6px 0;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 30px;
  font-weight: 300;

  line-height: 1;
}

/* =========================================================
   NGÀY THÀNH HÔN
========================================================= */

.la-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  margin-top: 26px;
}

.la-date__place {
  margin: 0;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 16px;
  font-weight: 500;

  line-height: 1.35;
  text-transform: uppercase;
  white-space: pre-line;
}

.la-date__lead {
  margin: 4px 0 0;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 14px;
  font-weight: 500;

  text-transform: uppercase;
}

.la-date__time {
  margin: 0;

  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 20px;
}

.la-date__row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  color: var(--la-red);
}

.la-date__side {
  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 14px;
  font-weight: 300;

  text-transform: uppercase;
}

.la-date__bar {
  flex: 0 0 auto;

  width: 1.5px;
  height: 22px;

  border-radius: 999px;

  background-color: var(--la-red);
}

.la-date__day {
  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 32px;
  font-weight: 500;

  line-height: 1;
}

.la-date__year {
  margin: 0;

  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 20px;
  font-weight: 500;
}

.la-date__lunar {
  margin: 0;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 13px;
  font-weight: 300;
}

/* =========================================================
   HOẠ TIẾT
========================================================= */

.la-couple__love {
  display: block;

  width: 100px;
  height: auto;

  margin: 22px auto 0;

  object-fit: contain;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .la-parents {
    max-width: 520px;
    column-gap: 24px;
  }

  .la-parents__label,
  .la-parents__name {
    font-size: 15px;
  }

  .la-parents__address {
    max-width: 260px;

    font-size: 12px;
  }

  .la-parents__divider {
    height: 80px;
  }

  .la-couple__announce {
    max-width: 560px;

    font-size: 20px;
  }

  .la-couple__name {
    font-size: 62px;
  }

  .la-couple__role {
    font-size: 13px;
  }

  .la-couple__amp {
    font-size: 35px;
  }

  .la-date__place {
    font-size: 20px;
  }

  .la-date__lead {
    font-size: 15px;
  }

  .la-date__time {
    font-size: 30px;
  }

  .la-date__side {
    font-size: 15px;
  }

  .la-date__day {
    font-size: 38px;
  }

  .la-date__year {
    font-size: 22px;
  }

  .la-date__lunar {
    font-size: 14px;
  }

  .la-couple__love {
    width: 130px;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.la-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.la-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.la-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.la-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
