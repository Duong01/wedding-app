<template>
  <section class="lp-timeline">
    <!-- 2 chim én trang trí -->
    <img :src="chimEn" alt="" aria-hidden="true" class="lp-timeline__bird lp-timeline__bird--top" draggable="false" />
    <img :src="chimEn" alt="" aria-hidden="true" class="lp-timeline__bird lp-timeline__bird--bottom" draggable="false" />

    <div class="lp-section-title">
      <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
      <header v-if="sectionOverride(sections, 'timeline', 'Eyebrow')" class="lp-top-custom-head">
        <p v-if="sectionOverride(sections, 'timeline', 'Eyebrow')" class="lp-top-custom-head__eyebrow">{{ sectionOverride(sections, "timeline", "Eyebrow") }}</p>
      </header>

      <h2>{{ sectionText(sections, "timeline", "Heading", title || $t("LỊCH TRÌNH NGÀY VUI")) }}</h2>
      <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
      <header v-if="sectionOverride(sections, 'timeline', 'Intro')" class="lp-sub-custom-head">
        <p v-if="sectionOverride(sections, 'timeline', 'Intro')" class="lp-sub-custom-head__intro">{{ sectionOverride(sections, "timeline", "Intro") }}</p>
      </header>

    </div>

    <ol class="lp-timeline__list">
      <li v-for="(item, index) in items" :key="item.Id || index" class="lp-timeline__item">
        <div class="lp-timeline__side">
          <div class="lp-timeline__dot"></div>

          <div v-if="index < items.length - 1" class="lp-timeline__line"></div>
        </div>

        <article class="lp-timeline__card">
          <time v-if="item.Time || item.Date">{{ item.Time || item.Date }}</time>

          <h3>{{ item.Title || item.Name || $t("Một dấu mốc đặc biệt") }}</h3>

          <p v-if="item.Description || item.Content">{{ item.Description || item.Content }}</p>

          <p v-if="item.Location" class="lp-timeline__location">
            <v-icon size="13">mdi-map-marker-outline</v-icon>
            <span>{{ item.Location }}</span>
          </p>
        </article>
      </li>
    </ol>
  </section>
</template>

<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { computed } from "vue";
import chimEn from "@/assets/decor/longphung-v3/chim-en.webp";
const props = defineProps({
  sections: { type: Object, default: () => ({}) },
  timeline: { type: Array, default: () => [] },
  events: { type: Array, default: () => [] },
});

const items = computed(() => props.timeline || []);

const title = computed(() => props.events?.[0]?.TimelineTitle || "");
</script>

<style scoped>
.lp-timeline {
  position: relative;

  width: min(620px, calc(100% - 24px));

  margin: 30px auto;

  padding: 30px 18px 26px;

  color: var(--tc-ffbe89, #ffbe89);
}

/* Tiêu đề có khung frame-title */
.lp-section-title {
  width: fit-content;
  max-width: 100%;

  margin: 0 auto 24px;

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

  color: var(--tc-ffbe89, #ffbe89);
}

/* =========================================================
   CHIM ÉN TRANG TRÍ
========================================================= */

.lp-timeline__bird {
  position: absolute;
  z-index: 10;

  width: 72px;

  height: auto;

  pointer-events: none;

  opacity: 0.9;
}

@media (min-width: 768px) {
  .lp-timeline__bird {
    width: 90px;
  }
}

.lp-timeline__bird--top {
  left: 8%;

  top: 32%;
}

@media (min-width: 768px) {
  .lp-timeline__bird--top {
    left: 25%;
  }
}

.lp-timeline__bird--bottom {
  left: 8%;

  top: 62%;

  transform: scaleX(-1);
}

@media (min-width: 768px) {
  .lp-timeline__bird--bottom {
    left: 25%;
  }
}

/* =========================================================
   DANH SÁCH
========================================================= */

.lp-timeline__list {
  position: relative;

  margin: 0;
  padding: 0;

  list-style: none;
}

.lp-timeline__item {
  position: relative;

  display: grid;
  grid-template-columns: 30px 1fr;
  gap: 14px;

  margin-bottom: 18px;
}

.lp-timeline__item:last-child {
  margin-bottom: 0;
}

/* =========================================================
   DOT + ĐƯỜNG NỐI
========================================================= */

.lp-timeline__side {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.lp-timeline__dot {
  position: relative;
  z-index: 3;

  width: 13px;
  height: 13px;

  margin-top: 14px;

  border-radius: 50%;

  background: var(--tc-ffbe89, #ffbe89);

  box-shadow: 0 0 0 4px rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.18);
}

.lp-timeline__line {
  position: absolute;
  z-index: 1;

  top: 27px;
  bottom: -18px;
  left: 50%;

  width: 1px;

  transform: translateX(-50%);

  background: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.4);
}

/* =========================================================
   THẺ
========================================================= */

.lp-timeline__card {
  position: relative;

  padding: 14px 16px 15px;

  border: 1px solid rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.3);
  border-radius: 12px;

  background: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.07);

  transition: transform 0.25s ease, border-color 0.25s ease;
}

.lp-timeline__card:hover {
  transform: translateY(-3px);

  border-color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.55);
}

.lp-timeline__card time {
  display: inline-block;

  margin-bottom: 5px;

  font-family: "Times New Roman", Times, serif;

  font-size: 12px;
  font-weight: 700;

  letter-spacing: 0.1em;

  color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.85);
}

.lp-timeline__card h3 {
  margin: 0;

  font-family: "EB Garamond", "Baskerville", "Times New Roman", serif;

  font-size: 20px;
  font-weight: 600;

  line-height: 1.25;

  color: var(--tc-ffbe89, #ffbe89);
}

.lp-timeline__card p {
  margin: 7px 0 0;

  font-size: 13px;

  line-height: 1.65;

  color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.75);
}

.lp-timeline__location {
  display: flex;
  align-items: center;
  gap: 5px;

  margin-top: 9px;
  padding-top: 8px;

  border-top: 1px solid rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.2);

  font-size: 11px;

  color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.65);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .lp-timeline {
    width: calc(100% - 16px);

    margin: 20px auto;

    padding: 26px 12px 22px;
  }

  .lp-timeline__item {
    grid-template-columns: 24px 1fr;
    gap: 10px;

    margin-bottom: 14px;
  }

  .lp-timeline__line {
    top: 24px;

    bottom: -14px;
  }

  .lp-timeline__card h3 {
    font-size: 18px;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.lp-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.lp-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: var(--tc-ffbe89, #ffbe89);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.lp-top-custom-head__heading {
  margin: 0;
  color: var(--tc-ffbe89, #ffbe89);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.lp-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.85);
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.lp-sub-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.lp-sub-custom-head__eyebrow {
  margin: 0 0 6px;
  color: var(--tc-ffbe89, #ffbe89);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.lp-sub-custom-head__heading {
  margin: 0;
  color: var(--tc-ffbe89, #ffbe89);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.lp-sub-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.85);
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
