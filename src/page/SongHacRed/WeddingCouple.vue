<template>
  <section class="shc-couple">
    <!-- =====================================================
         KHUNG HOẠ TIẾT
    ====================================================== -->

    <div class="shc-couple__frame">
      <!-- HOẠ TIẾT GÓC KHUNG -->

      <div class="shc-couple__ornaments" aria-hidden="true">
        <img
          class="shc-couple__ornament shc-couple__ornament--cloud-top"
          :src="cloud1Decoration"
          alt=""
          draggable="false"
        />

        <img
          class="shc-couple__ornament shc-couple__ornament--flower-left"
          :src="flower1Decoration"
          alt=""
          draggable="false"
        />

        <img
          class="shc-couple__ornament shc-couple__ornament--cloud-bottom"
          :src="cloud2Decoration"
          alt=""
          draggable="false"
        />
      </div>

      <!-- NỘI DUNG -->

      <div class="shc-couple__content">
        <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
        <header v-if="sectionOverride(sections, 'couple', 'Eyebrow')" class="shc-top-custom-head">
          <p v-if="sectionOverride(sections, 'couple', 'Eyebrow')" class="shc-top-custom-head__eyebrow">{{ sectionOverride(sections, "couple", "Eyebrow") }}</p>
        </header>

        <h2 class="shc-couple__title">{{ sectionText(sections, "couple", "Heading", "THÔNG TIN LỄ CƯỚI") }}</h2>

        <!-- ÔNG BÀ HAI HỌ -->

        <div class="shc-parents">
          <div class="shc-parents__col">
            <span class="shc-parents__label">Ông Bà</span>

            <span v-if="groomFather" class="shc-parents__name">{{ groomFather }}</span>

            <span v-if="groomMother" class="shc-parents__name">{{ groomMother }}</span>

            <p v-if="groomAddress" class="shc-parents__address">{{ groomAddress }}</p>
          </div>

          <div class="shc-parents__divider" aria-hidden="true"></div>

          <div class="shc-parents__col">
            <span class="shc-parents__label">Ông Bà</span>

            <span v-if="brideFather" class="shc-parents__name">{{ brideFather }}</span>

            <span v-if="brideMother" class="shc-parents__name">{{ brideMother }}</span>

            <p v-if="brideAddress" class="shc-parents__address">{{ brideAddress }}</p>
          </div>
        </div>

        <!-- BÁO TIN -->

        <p class="shc-couple__announce">
          TRÂN TRỌNG BÁO TIN
          LỄ THÀNH HÔN CỦA CON CHÚNG TÔI
        </p>

        <!-- TÊN CÔ DÂU CHÚ RỂ -->

        <div class="shc-couple__names">
          <h3 class="shc-couple__name">{{ groom }}</h3>

          <span class="shc-couple__role">{{ groomRole }}</span>

          <div class="shc-couple__amp" aria-hidden="true">&amp;</div>

          <h3 class="shc-couple__name">{{ bride }}</h3>

          <span class="shc-couple__role">{{ brideRole }}</span>
        </div>

        <!-- NGÀY CƯỚI -->

        <div class="shc-couple__date">
          <p class="shc-couple__date-intro">
            LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI
            {{ ceremonyPlace }}
          </p>

          <div class="shc-couple__date-row">
            <span class="shc-couple__time">VÀO LÚC {{ weddingTime }}</span>

            <span class="shc-couple__weekday">{{ weddingWeekday }}</span>
          </div>

          <div class="shc-couple__date-big">
            <span class="shc-couple__day">{{ weddingDay }}</span>

            <span class="shc-couple__sep" aria-hidden="true"></span>

            <span class="shc-couple__month-year">
              <span>THÁNG {{ weddingMonth }}</span>
              <span>{{ weddingYear }}</span>
            </span>
          </div>

          <p v-if="weddingLunar" class="shc-couple__lunar">({{ weddingLunar }})</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { computed } from "vue";

import {
  cloud1Decoration,
  cloud2Decoration,
  flower1Decoration,
} from "./songHacRedAssets";

const props = defineProps({
  sections: { type: Object, default: () => ({}) },
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

const groomRole = computed(
  () => props.wedding?.couple?.Groom?.Role || "trưởng nam"
);

const brideRole = computed(
  () => props.wedding?.couple?.Bride?.Role || "út nữ"
);

const groomFather = computed(() => props.wedding?.couple?.Groom?.Father || "");
const groomMother = computed(() => props.wedding?.couple?.Groom?.Mother || "");
const brideFather = computed(() => props.wedding?.couple?.Bride?.Father || "");
const brideMother = computed(() => props.wedding?.couple?.Bride?.Mother || "");

const groomAddress = computed(() => props.wedding?.couple?.Groom?.Address || "");
const brideAddress = computed(() => props.wedding?.couple?.Bride?.Address || "");

const ceremonyPlace = computed(
  () =>
    props.wedding?.events?.[0]?.Location ||
    props.wedding?.hero?.Location ||
    "TƯ GIA"
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
.shc-couple {
  --shc-red: var(--primary, #920002);
  --shc-cream: var(--accent, #ffe8a4);
  --shc-navy: var(--text-secondary, #001232);
  --shc-frame-red: var(--secondary, #990000);

  position: relative;
  isolation: isolate;

  overflow: hidden;

  margin-top: 23px;

  color: var(--shc-frame-red);

  background-color: var(--shc-red);

  font-family: Baskerville, "Times New Roman", serif;
}

/* =========================================================
   KHUNG HOẠ TIẾT (border-image) — giống Timeline
========================================================= */

.shc-couple__frame {
  position: relative;

  width: min(100% - 16px, 460px);

  margin: 0 auto;

  border: 65px solid transparent;

  /*
   * KHÔNG dùng v-bind(...) — v-bind inject chuỗi URL thô vào
   * CSS var, border-image-source cần bọc url() nên khung sẽ vô hiệu
   * (trong suốt) → chữ đỏ nằm trên nền đỏ. Dùng url() trực tiếp
   * để Vite tự inline asset.
   */
  border-image-source: url("@/assets/song-hac-do/timeline-panel.webp");
  border-image-slice: 130 fill;
  border-image-repeat: stretch;
}

/* =========================================================
   HOẠ TIẾT GÓC KHUNG
========================================================= */

.shc-couple__ornaments {
  position: absolute;
  inset: 0;
  z-index: 1;

  pointer-events: none;
}

.shc-couple__ornaments img {
  position: absolute;

  max-width: none;

  object-fit: contain;
}

.shc-couple__ornament--cloud-top {
  left: 47.63%;
  top: -21px;

  width: 53.12%;
}

.shc-couple__ornament--flower-left {
  left: -21.45%;
  top: 42%;

  width: 33.92%;
}

.shc-couple__ornament--cloud-bottom {
  right: -12%;
  bottom: -14px;

  width: 37.16%;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.shc-couple__content {
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;
}

.shc-couple__title {
  margin: 0;

  color: var(--shc-frame-red);

  font-family: "Times New Roman", Times, serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-align: center;
  text-transform: uppercase;
}

/* =========================================================
   ÔNG BÀ HAI HỌ
========================================================= */

.shc-parents {
  display: grid;
  grid-template-columns: 1fr auto 1fr;

  gap: 14px;

  width: 100%;

  margin-top: 16px;
}

.shc-parents__col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-width: 0;

  text-align: center;
}

.shc-parents__label {
  color: var(--shc-navy);

  font-size: 12px;
  font-weight: 600;
}

.shc-parents__name {
  color: var(--shc-frame-red);

  font-size: 14px;
  font-weight: 700;

  overflow-wrap: anywhere;
}

.shc-parents__address {
  margin: 4px 0 0;

  color: var(--shc-navy);

  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 10px;
  font-weight: 500;

  line-height: 1.25;

  white-space: pre-line;
}

.shc-parents__divider {
  width: 1px;
  height: 50px;

  background: var(--shc-frame-red);
}

/* =========================================================
   BÁO TIN
========================================================= */

.shc-couple__announce {
  max-width: 560px;
  margin: 16px auto 0;

  color: var(--shc-frame-red);

  font-size: 12px;
  font-weight: 600;

  line-height: 1.6;

  text-transform: uppercase;

  white-space: pre-line;
}

/* =========================================================
   TÊN CÔ DÂU CHÚ RỂ
========================================================= */

.shc-couple__names {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 10px;

  margin-top: 16px;

  color: var(--shc-frame-red);
}

.shc-couple__name {
  margin: 0;

  color: var(--shc-frame-red);

  font-family: "Carattere", cursive;
  font-size: 40px;
  font-weight: 400;

  line-height: 1.35;

  white-space: nowrap;

  word-spacing: 0.14em;
}

.shc-couple__role {
  color: var(--shc-navy);

  font-family: "Uchen", serif;
  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.18em;

  text-transform: uppercase;
}

.shc-couple__amp {
  color: var(--shc-frame-red);

  font-family: "Ms Madi", "Carattere", cursive;
  font-size: 35px;

  line-height: 1;
}

/* =========================================================
   NGÀY CƯỚI
========================================================= */

.shc-couple__date {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 6px;

  margin-top: 20px;

  text-align: center;
}

.shc-couple__date-intro {
  margin: 0;

  color: var(--shc-frame-red);

  font-size: 12px;
  font-weight: 600;

  line-height: 1.6;

  text-transform: uppercase;

  white-space: pre-line;
}

.shc-couple__date-row {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 12px;

  color: var(--shc-navy);

  font-family: "Times New Roman", Times, serif;
  font-size: 12px;
  font-weight: 600;

  text-transform: uppercase;

  white-space: nowrap;
}

.shc-couple__date-big {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 9px;

  color: var(--shc-frame-red);
}

.shc-couple__day {
  font-family: Baskerville, "Times New Roman", serif;
  font-size: 57px;
  font-weight: 600;

  line-height: 1;
}

.shc-couple__sep {
  width: 1px;
  height: 46px;

  background: var(--shc-frame-red);
}

.shc-couple__month-year {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  gap: 4px;

  font-family: "Times New Roman", Times, serif;
  font-size: 17px;
  font-weight: 600;

  line-height: 1;

  text-align: left;
  text-transform: uppercase;
}

.shc-couple__lunar {
  margin: 0;

  color: var(--shc-navy);

  font-family: "Times New Roman", Times, serif;
  font-size: 12px;
  font-weight: 600;

  text-transform: uppercase;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shc-couple {
    margin-top: 31px;
    padding: 22px 0 39px;
  }

  .shc-couple__frame {
    width: min(100% - 32px, 640px);

    border-width: 88px;
  }

  .shc-couple__ornament--cloud-top {
    top: -29px;
  }

  .shc-couple__ornament--cloud-bottom {
    bottom: -19px;
  }

  .shc-couple__content {
    padding: 0 14px 46px;
  }

  .shc-couple__title {
    font-size: 27px;
  }

  .shc-parents {
    gap: 19px;

    margin-top: 24px;
  }

  .shc-parents__label {
    font-size: 16px;
  }

  .shc-parents__name {
    font-size: 16px;
  }

  .shc-parents__address {
    font-size: 13px;
  }

  .shc-parents__divider {
    height: 68px;
  }

  .shc-couple__announce {
    font-size: 16px;
  }

  .shc-couple__name {
    font-size: 50px;
  }

  .shc-couple__role {
    font-size: 13px;
  }

  .shc-couple__amp {
    font-size: 48px;
  }

  .shc-couple__date-intro {
    font-size: 16px;
  }

  .shc-couple__date-row {
    font-size: 16px;
  }

  .shc-couple__day {
    font-size: 78px;
  }

  .shc-couple__sep {
    height: 63px;
  }

  .shc-couple__month-year {
    font-size: 23px;
  }

  .shc-couple__lunar {
    font-size: 16px;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.shc-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.shc-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.shc-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.shc-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
