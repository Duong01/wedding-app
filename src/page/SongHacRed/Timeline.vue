<template>
  <section class="shc-timeline">
    <!-- =====================================================
         KHUNG HOẠ TIẾT
    ====================================================== -->

    <div class="shc-timeline__frame">
      <!-- HOẠ TIẾT GÓC KHUNG -->

      <div class="shc-timeline__ornaments" aria-hidden="true">
        <img
          class="shc-timeline__ornament shc-timeline__ornament--cloud-top"
          :src="cloud1Decoration"
          alt=""
          draggable="false"
        />

        <img
          class="shc-timeline__ornament shc-timeline__ornament--cloud-bottom"
          :src="cloud2Decoration"
          alt=""
          draggable="false"
        />
      </div>

      <!-- NỘI DUNG -->

      <div class="shc-timeline__content">
        <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
        <header v-if="sectionOverride(sections, 'timeline', 'Eyebrow')" class="shc-top-custom-head">
          <p v-if="sectionOverride(sections, 'timeline', 'Eyebrow')" class="shc-top-custom-head__eyebrow">{{ sectionOverride(sections, "timeline", "Eyebrow") }}</p>
        </header>

        <h2 class="shc-timeline__title">{{ sectionText(sections, "timeline", "Heading", "LỊCH TRÌNH NGÀY CƯỚI") }}</h2>
        <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
        <header v-if="sectionOverride(sections, 'timeline', 'Intro')" class="shc-sub-custom-head">
          <p v-if="sectionOverride(sections, 'timeline', 'Intro')" class="shc-sub-custom-head__intro">{{ sectionOverride(sections, "timeline", "Intro") }}</p>
        </header>


        <ol class="shc-timeline__list">
          <li
            v-for="(item, index) in items"
            :key="item.Id || index"
            class="shc-timeline__item"
          >
            <!-- MỐC THỜI GIAN + ICON -->

            <span class="shc-timeline__time">
              <span v-if="iconFor(item)" class="shc-timeline__icon">
                <img :src="iconFor(item)" alt="" aria-hidden="true" />
              </span>

              {{ item.Time || item.Date || formatTime(index) }}
            </span>

            <!-- TRỤC -->

            <span class="shc-timeline__axis" aria-hidden="true">
              <span
                v-if="index > 0"
                class="shc-timeline__line shy-timeline__line--up"
              ></span>

              <span class="shc-timeline__dot"></span>

              <span
                v-if="index < items.length - 1"
                class="shc-timeline__line shy-timeline__line--down"
              ></span>
            </span>

            <!-- MÔ TẢ -->

            <span class="shc-timeline__body">
              <b>{{ item.Title || item.Name || "Một dấu mốc đặc biệt" }}</b>
            </span>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { computed } from "vue";

import {
  cake,
  cloud1Decoration,
  cloud2Decoration,
  ring,
  water,
} from "./songHacRedAssets";

const props = defineProps({
  sections: { type: Object, default: () => ({}) },
  timeline: { type: Array, default: () => [] },
  events: { type: Array, default: () => [] },
});

const items = computed(() => props.timeline || []);

/*
 * Icon theo loại mốc: nhẫn (khai tiệc), rượu (rót rượu cắt
 * bánh), bánh (phục vụ món chính) — khớp hoạ tiết thiệp gốc.
 */
const ICON_RULES = [
  { pattern: /khai tiệc|thành hôn/i, icon: ring },
  { pattern: /rót rượu|cắt bánh/i, icon: water },
  { pattern: /món chính|phục vụ/i, icon: cake },
];

function iconFor(item) {
  const title = item?.Title || item?.Name || "";

  const rule = ICON_RULES.find((entry) => entry.pattern.test(title));

  return rule ? rule.icon : "";
}

function formatTime(index) {
  return `DẤU MỐC ${String(index + 1).padStart(2, "0")}`;
}
</script>

<style scoped>
.shc-timeline {
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

  font-family: "Times New Roman", Times, serif;
}

/* =========================================================
   KHUNG HOẠ TIẾT (border-image)
========================================================= */

.shc-timeline__frame {
  position: relative;

  width: min(100% - 44px, 397px);

  margin: 0 auto;

  border: 65px solid transparent;

  /* url() trực tiếp — xem ghi chú ở WeddingCouple (v-bind làm khung vô hiệu) */
  border-image-source: url("@/assets/song-hac-do/timeline-panel.webp");
  border-image-slice: 130 fill;
  border-image-repeat: stretch;
}

/* =========================================================
   HOẠ TIẾT GÓC KHUNG
========================================================= */

.shc-timeline__ornaments {
  position: absolute;
  inset: 0;
  z-index: 1;

  pointer-events: none;
}

.shc-timeline__ornaments img {
  position: absolute;

  max-width: none;

  object-fit: contain;
}

.shc-timeline__ornament--cloud-top {
  left: 45.43%;
  top: -25px;

  width: 51.13%;
}

.shc-timeline__ornament--cloud-bottom {
  left: -11.84%;
  bottom: -18px;

  width: 44.84%;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.shc-timeline__content {
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 13px;

  /* padding: 37px 41px; */
}

.shc-timeline__title {
  margin: 0;

  color: var(--shc-frame-red);

  font-family: "Times New Roman", Times, serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-align: center;
  text-transform: uppercase;
}

.shc-timeline__list {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 16px minmax(0, 1fr);

  align-items: center;

  column-gap: 24px;
  row-gap: 32px;

  width: 100%;
  max-width: 460px;

  margin: 0;
  padding: 0;

  list-style: none;
}

.shc-timeline__item {
  display: contents;
}

/* =========================================================
   MỐC THỜI GIAN + ICON
========================================================= */

.shc-timeline__time {
  position: relative;

  display: inline-flex;
  align-items: center;
  justify-content: flex-end;

  padding-top: 2px;

  color: var(--shc-frame-red);

  font-size: 13px;

  font-variant-numeric: tabular-nums;

  letter-spacing: 0.04em;

  line-height: 1.4;

  text-align: right;
}

.shc-timeline__icon {
  position: absolute;
  right: calc(100% + 36px);

  display: flex;
  align-items: center;
  justify-content: center;
}

.shc-timeline__icon img {
  width: 32px;
  height: 32px;

  max-width: none;

  object-fit: contain;
}

/* =========================================================
   TRỤC
========================================================= */

.shc-timeline__axis {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  align-self: stretch;
}

.shc-timeline__dot {
  position: relative;
  z-index: 1;

  display: block;

  width: 10px;
  height: 10px;

  border-radius: 50%;

  background: var(--shc-navy);

  box-shadow: 0 0 0 2px color-mix(in srgb, var(--shc-navy) 13%, transparent);
}

.shc-timeline__line {
  position: absolute;
  left: 50%;

  width: 1px;

  transform: translateX(-50%);

  background: var(--shc-navy);
}

.shy-timeline__line--up {
  top: -32px;
  bottom: 50%;
}

.shy-timeline__line--down {
  top: 50%;
  bottom: -32px;
}

/* =========================================================
   MÔ TẢ
========================================================= */

.shc-timeline__body {
  padding-top: 2px;

  color: var(--shc-frame-red);

  font-size: 13px;

  text-align: left;
}

.shc-timeline__body b {
  font-weight: 400;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shc-timeline {
    margin-top: 31px;
  }

  .shc-timeline__frame {
    width: min(100% - 60px, 540px);

    border-width: 88px;
  }

  .shc-timeline__ornament--cloud-top {
    top: -34px;
  }

  .shc-timeline__ornament--cloud-bottom {
    bottom: -24px;
  }

  .shc-timeline__content {
    gap: 13px;

    padding: 50px 56px;
  }

  .shc-timeline__title {
    font-size: 27px;
  }

  .shc-timeline__list {
    column-gap: 32px;
    row-gap: 40px;
  }

  .shc-timeline__time {
    font-size: 18px;
  }

  .shc-timeline__icon img {
    width: 44px;
    height: 44px;
  }

  .shy-timeline__line--up {
    top: -40px;
  }

  .shy-timeline__line--down {
    bottom: -40px;
  }

  .shc-timeline__body {
    font-size: 18px;
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

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.shc-sub-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.shc-sub-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.shc-sub-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.shc-sub-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
