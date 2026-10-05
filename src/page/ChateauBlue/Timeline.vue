<template>
  <section class="ct-timeline">
    <div class="ct-timeline__header">
      <p v-if="eyebrow" class="ct-eyebrow">{{ eyebrow }}</p>

      <h2>{{ heading }}</h2>

      <p v-if="intro" class="ct-timeline__intro">
        {{ intro }}
      </p>
    </div>

    <ol class="ct-timeline__list">
      <li v-for="(item, index) in items" :key="item.Id || index" class="ct-timeline__item">
        <div class="ct-timeline__side">
          <div class="ct-timeline__number">
            {{ String(index + 1).padStart(2, "0") }}
          </div>

          <div v-if="index < items.length - 1" class="ct-timeline__line"></div>
        </div>

        <article class="ct-timeline__card">
          <div class="ct-timeline__date">
            <span class="ct-date-icon">
              <v-icon size="14">mdi-calendar-heart</v-icon>
            </span>

            <time>{{ item.Time || item.Date || formatTime(index) }}</time>
          </div>

          <div class="ct-timeline__title-row">
            <div class="ct-timeline__icon">{{ item.Icon || "❦" }}</div>

            <h3>{{ item.Title || item.Name || $t("Một dấu mốc đặc biệt") }}</h3>
          </div>

          <p v-if="item.Description || item.Content" class="ct-timeline__desc">
            {{ item.Description || item.Content }}
          </p>

          <div v-if="item.Location" class="ct-timeline__location">
            <v-icon size="14">mdi-map-marker-outline</v-icon>
            <span>{{ item.Location }}</span>
          </div>
        </article>
      </li>
    </ol>

    <div class="ct-timeline__footer">
      <span></span>
      <v-icon size="14">mdi-heart</v-icon>
      <span></span>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import { sectionText } from "@/data/sectionTitles";
import { t } from "@/lang";
const props = defineProps({
  timeline: { type: Array, default: () => [] },
  events: { type: Array, default: () => [] },
  sections: { type: Object, default: () => ({}) },
});

const items = computed(() => props.timeline || []);

const eyebrow = computed(() =>
  sectionText(props.sections, "timeline", "Eyebrow", t("DẤU MỐC YÊU THƯƠNG"))
);

const heading = computed(() =>
  sectionText(props.sections, "timeline", "Heading", t("Hành trình của chúng mình"))
);

const intro = computed(() =>
  sectionText(
    props.sections,
    "timeline",
    "Intro",
    t("Những khoảnh khắc đặc biệt đã đưa chúng mình đến ngày hôm nay")
  )
);

function formatTime(index) {
  return `${t("DẤU MỐC ")}${String(index + 1).padStart(2, "0")}`;
}
</script>

<style scoped>
.ct-timeline {
  position: relative;

  width: min(680px, calc(100% - 24px));

  margin: 30px auto;

  padding: 38px 20px 32px;

  color: var(--tc-2f3e5c, #2f3e5c);

  border: 1px solid rgba(var(--tc-7d8fb0-rgb, 125, 143, 176), 0.35);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.7), rgba(var(--tc-f4f7fb-rgb, 244, 247, 251), 0.5));

  box-shadow: 0 12px 35px rgba(var(--tc-2f3e5c-rgb, 47, 62, 92), 0.08);

  overflow: hidden;
}

.ct-timeline::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.22);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.ct-timeline__header {
  position: relative;

  text-align: center;

  margin-bottom: 30px;
}

.ct-eyebrow {
  margin: 0;

  color: var(--tc-48546e, #48546e);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ct-timeline__header h2 {
  margin: 6px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 36px);
  font-weight: 600;

  line-height: 1.1;

  color: var(--tc-2f3e5c, #2f3e5c);
}

.ct-timeline__intro {
  max-width: 440px;

  margin: 0 auto;

  color: var(--tc-505d78, #505d78);

  font-size: 13px;

  line-height: 1.65;

  /* Nội dung cho phép xuống dòng bằng ký tự \n */
  white-space: pre-line;
}

/* =========================================================
   LIST
========================================================= */

.ct-timeline__list {
  position: relative;

  margin: 0;
  padding: 0;

  list-style: none;
}

.ct-timeline__item {
  position: relative;

  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 14px;

  margin-bottom: 18px;
}

.ct-timeline__item:last-child {
  margin-bottom: 0;
}

/* =========================================================
   SIDE
========================================================= */

.ct-timeline__side {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.ct-timeline__number {
  position: relative;
  z-index: 3;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--tc-2f3e5c, #2f3e5c);

  border: 1px solid rgba(var(--tc-7d8fb0-rgb, 125, 143, 176), 0.5);
  border-radius: 50%;

  background: linear-gradient(145deg, var(--tc-fdfdfe, #fdfdfe), var(--tc-e7ecf5, #e7ecf5));

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 15px;
  font-weight: 700;

  box-shadow: 0 5px 14px rgba(var(--tc-2f3e5c-rgb, 47, 62, 92), 0.1);
}

.ct-timeline__line {
  position: absolute;
  z-index: 1;

  top: 38px;
  bottom: -18px;
  left: 50%;

  width: 1px;

  transform: translateX(-50%);

  background: linear-gradient(180deg, rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.6), rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.15));
}

/* =========================================================
   CARD
========================================================= */

.ct-timeline__card {
  position: relative;

  padding: 16px 17px 17px;

  border: 1px solid rgba(var(--tc-7d8fb0-rgb, 125, 143, 176), 0.3);
  border-radius: 18px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(var(--tc-f4f7fb-rgb, 244, 247, 251), 0.75));

  box-shadow: 0 7px 22px rgba(var(--tc-2f3e5c-rgb, 47, 62, 92), 0.06);

  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.ct-timeline__card:hover {
  transform: translateY(-3px);

  border-color: rgba(var(--tc-7d8fb0-rgb, 125, 143, 176), 0.5);

  box-shadow: 0 12px 28px rgba(var(--tc-2f3e5c-rgb, 47, 62, 92), 0.1);
}

/* =========================================================
   DATE
========================================================= */

.ct-timeline__date {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  margin-bottom: 8px;

  color: var(--tc-48546e, #48546e);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.ct-date-icon {
  width: 25px;
  height: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--tc-48546e, #48546e);

  border-radius: 50%;

  background: rgba(var(--tc-ccd6e8-rgb, 204, 214, 232), 0.5);
}

/* =========================================================
   TITLE
========================================================= */

.ct-timeline__title-row {
  display: flex;
  align-items: center;
  gap: 9px;
}

.ct-timeline__icon {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--tc-48546e, #48546e);

  border: 1px solid rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.35);
  border-radius: 50%;

  background: linear-gradient(145deg, #fff, var(--tc-e7ecf5, #e7ecf5));

  font-size: 16px;
}

.ct-timeline__card h3 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 22px;
  font-weight: 600;

  line-height: 1.2;

  color: var(--tc-2f3e5c, #2f3e5c);
}

/* =========================================================
   DESCRIPTION
========================================================= */

.ct-timeline__desc {
  margin: 9px 0 0;

  color: var(--tc-5a6378, #5a6378);

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LOCATION
========================================================= */

.ct-timeline__location {
  display: flex;
  align-items: center;
  gap: 5px;

  margin-top: 11px;
  padding-top: 9px;

  border-top: 1px solid rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.2);

  color: var(--tc-505d78, #505d78);

  font-size: 11px;

  line-height: 1.4;
}

.ct-timeline__location .v-icon {
  color: var(--tc-48546e, #48546e);

  flex: 0 0 auto;
}

/* =========================================================
   FOOTER
========================================================= */

.ct-timeline__footer {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 27px;

  color: var(--tc-4d5a75, #4d5a75);
}

.ct-timeline__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.55));
}

.ct-timeline__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .ct-timeline {
    width: calc(100% - 16px);

    margin: 20px auto;

    padding: 32px 12px 27px;

    border-radius: 23px;
  }

  .ct-timeline::before {
    inset: 6px;

    border-radius: 18px;
  }

  .ct-timeline__header {
    margin-bottom: 25px;
  }

  .ct-timeline__header h2 {
    font-size: 29px;
  }

  .ct-timeline__intro {
    padding: 0 10px;

    font-size: 12px;
  }

  .ct-timeline__item {
    grid-template-columns: 39px 1fr;
    gap: 9px;

    margin-bottom: 14px;
  }

  .ct-timeline__number {
    width: 32px;
    height: 32px;

    font-size: 13px;
  }

  .ct-timeline__line {
    top: 32px;

    bottom: -14px;
  }

  .ct-timeline__card {
    padding: 13px 13px 14px;

    border-radius: 15px;
  }

  .ct-timeline__date {
    margin-bottom: 7px;

    font-size: 10px;
  }

  .ct-date-icon {
    width: 23px;
    height: 23px;
  }

  .ct-timeline__icon {
    width: 31px;
    height: 31px;

    font-size: 14px;
  }

  .ct-timeline__card h3 {
    font-size: 20px;
  }

  .ct-timeline__desc {
    margin-top: 8px;

    font-size: 12px;

    line-height: 1.6;
  }

  .ct-timeline__location {
    margin-top: 9px;
    padding-top: 8px;

    font-size: 10px;
  }
}

@media (max-width: 380px) {
  .ct-timeline {
    padding-left: 9px;
    padding-right: 9px;
  }

  .ct-timeline__item {
    grid-template-columns: 34px 1fr;
    gap: 7px;
  }

  .ct-timeline__number {
    width: 29px;
    height: 29px;

    font-size: 12px;
  }

  .ct-timeline__line {
    top: 29px;
  }

  .ct-timeline__card {
    padding: 12px;
  }

  .ct-timeline__card h3 {
    font-size: 18px;
  }

  .ct-timeline__icon {
    width: 29px;
    height: 29px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .ct-timeline__card {
    transition: none;
  }
}
</style>
