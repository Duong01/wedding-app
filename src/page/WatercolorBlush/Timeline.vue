<template>
  <section class="wb-timeline">
    <div class="wb-timeline__header">
      <p v-if="eyebrow" class="wb-eyebrow">{{ eyebrow }}</p>

      <h2>{{ heading }}</h2>

      <p v-if="intro" class="wb-timeline__intro">
        {{ intro }}
      </p>
    </div>

    <ol class="wb-timeline__list">
      <li v-for="(item, index) in items" :key="item.Id || index" class="wb-timeline__item">
        <div class="wb-timeline__side">
          <div class="wb-timeline__number">
            {{ String(index + 1).padStart(2, "0") }}
          </div>

          <div v-if="index < items.length - 1" class="wb-timeline__line"></div>
        </div>

        <article class="wb-timeline__card">
          <div class="wb-timeline__date">
            <span class="wb-date-icon">
              <v-icon size="14">mdi-calendar-heart</v-icon>
            </span>

            <time>{{ item.Time || item.Date || formatTime(index) }}</time>
          </div>

          <div class="wb-timeline__title-row">
            <div class="wb-timeline__icon">{{ item.Icon || "❀" }}</div>

            <h3>{{ item.Title || item.Name || "Một dấu mốc đặc biệt" }}</h3>
          </div>

          <p v-if="item.Description || item.Content" class="wb-timeline__desc">
            {{ item.Description || item.Content }}
          </p>

          <div v-if="item.Location" class="wb-timeline__location">
            <v-icon size="14">mdi-map-marker-outline</v-icon>
            <span>{{ item.Location }}</span>
          </div>
        </article>
      </li>
    </ol>

    <div class="wb-timeline__footer">
      <span></span>
      <v-icon size="14">mdi-heart</v-icon>
      <span></span>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import { sectionText } from "@/data/sectionTitles";

const props = defineProps({
  timeline: { type: Array, default: () => [] },
  events: { type: Array, default: () => [] },
  sections: { type: Object, default: () => ({}) },
});

const items = computed(() => props.timeline || []);

const eyebrow = computed(() =>
  sectionText(props.sections, "timeline", "Eyebrow", "DẤU MỐC YÊU THƯƠNG")
);

const heading = computed(() =>
  sectionText(props.sections, "timeline", "Heading", "Hành trình của chúng mình")
);

const intro = computed(() =>
  sectionText(
    props.sections,
    "timeline",
    "Intro",
    "Những khoảnh khắc đặc biệt đã đưa chúng mình đến ngày hôm nay"
  )
);

function formatTime(index) {
  return `DẤU MỐC ${String(index + 1).padStart(2, "0")}`;
}
</script>

<style scoped>
.wb-timeline {
  position: relative;

  width: min(680px, calc(100% - 24px));

  margin: 30px auto;

  padding: 38px 20px 32px;

  color: var(--tc-8a4a5c, #8a4a5c);

  border: 1px solid rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.35);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.7), rgba(var(--tc-fef4f7-rgb, 254, 244, 247), 0.5));

  box-shadow: 0 12px 35px rgba(var(--tc-8a4a5c-rgb, 138, 74, 92), 0.08);

  overflow: hidden;
}

.wb-timeline::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.22);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.wb-timeline__header {
  position: relative;

  text-align: center;

  margin-bottom: 30px;
}

.wb-eyebrow {
  margin: 0;

  color: var(--tc-a5586c, #a5586c);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.wb-timeline__header h2 {
  margin: 6px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 36px);
  font-weight: 600;

  line-height: 1.1;

  color: var(--tc-8a4a5c, #8a4a5c);
}

.wb-timeline__intro {
  max-width: 440px;

  margin: 0 auto;

  color: var(--tc-9d5f6d, #9d5f6d);

  font-size: 13px;

  line-height: 1.65;

  /* Nội dung cho phép xuống dòng bằng ký tự \n */
  white-space: pre-line;
}

/* =========================================================
   LIST
========================================================= */

.wb-timeline__list {
  position: relative;

  margin: 0;
  padding: 0;

  list-style: none;
}

.wb-timeline__item {
  position: relative;

  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 14px;

  margin-bottom: 18px;
}

.wb-timeline__item:last-child {
  margin-bottom: 0;
}

/* =========================================================
   SIDE
========================================================= */

.wb-timeline__side {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.wb-timeline__number {
  position: relative;
  z-index: 3;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--tc-8a4a5c, #8a4a5c);

  border: 1px solid rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.5);
  border-radius: 50%;

  background: linear-gradient(145deg, var(--tc-fffcfd, #fffcfd), var(--tc-fae8ed, #fae8ed));

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 15px;
  font-weight: 700;

  box-shadow: 0 5px 14px rgba(var(--tc-8a4a5c-rgb, 138, 74, 92), 0.1);
}

.wb-timeline__line {
  position: absolute;
  z-index: 1;

  top: 38px;
  bottom: -18px;
  left: 50%;

  width: 1px;

  transform: translateX(-50%);

  background: linear-gradient(180deg, rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.6), rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.15));
}

/* =========================================================
   CARD
========================================================= */

.wb-timeline__card {
  position: relative;

  padding: 16px 17px 17px;

  border: 1px solid rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.3);
  border-radius: 18px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(var(--tc-fef4f7-rgb, 254, 244, 247), 0.75));

  box-shadow: 0 7px 22px rgba(var(--tc-8a4a5c-rgb, 138, 74, 92), 0.06);

  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.wb-timeline__card:hover {
  transform: translateY(-3px);

  border-color: rgba(var(--tc-d98ca0-rgb, 217, 140, 160), 0.5);

  box-shadow: 0 12px 28px rgba(var(--tc-8a4a5c-rgb, 138, 74, 92), 0.1);
}

/* =========================================================
   DATE
========================================================= */

.wb-timeline__date {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  margin-bottom: 8px;

  color: var(--tc-a5586c, #a5586c);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.wb-date-icon {
  width: 25px;
  height: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--tc-a5586c, #a5586c);

  border-radius: 50%;

  background: rgba(var(--tc-f2ccd8-rgb, 242, 204, 216), 0.5);
}

/* =========================================================
   TITLE
========================================================= */

.wb-timeline__title-row {
  display: flex;
  align-items: center;
  gap: 9px;
}

.wb-timeline__icon {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--tc-a5586c, #a5586c);

  border: 1px solid rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.35);
  border-radius: 50%;

  background: linear-gradient(145deg, #fff, var(--tc-fae8ed, #fae8ed));

  font-size: 16px;
}

.wb-timeline__card h3 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 22px;
  font-weight: 600;

  line-height: 1.2;

  color: var(--tc-8a4a5c, #8a4a5c);
}

/* =========================================================
   DESCRIPTION
========================================================= */

.wb-timeline__desc {
  margin: 9px 0 0;

  color: var(--tc-a06a7c, #a06a7c);

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LOCATION
========================================================= */

.wb-timeline__location {
  display: flex;
  align-items: center;
  gap: 5px;

  margin-top: 11px;
  padding-top: 9px;

  border-top: 1px solid rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.2);

  color: var(--tc-9d5f6d, #9d5f6d);

  font-size: 11px;

  line-height: 1.4;
}

.wb-timeline__location .v-icon {
  color: var(--tc-a5586c, #a5586c);

  flex: 0 0 auto;
}

/* =========================================================
   FOOTER
========================================================= */

.wb-timeline__footer {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 27px;

  color: var(--tc-a05a6e, #a05a6e);
}

.wb-timeline__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.55));
}

.wb-timeline__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .wb-timeline {
    width: calc(100% - 16px);

    margin: 20px auto;

    padding: 32px 12px 27px;

    border-radius: 23px;
  }

  .wb-timeline::before {
    inset: 6px;

    border-radius: 18px;
  }

  .wb-timeline__header {
    margin-bottom: 25px;
  }

  .wb-timeline__header h2 {
    font-size: 29px;
  }

  .wb-timeline__intro {
    padding: 0 10px;

    font-size: 12px;
  }

  .wb-timeline__item {
    grid-template-columns: 39px 1fr;
    gap: 9px;

    margin-bottom: 14px;
  }

  .wb-timeline__number {
    width: 32px;
    height: 32px;

    font-size: 13px;
  }

  .wb-timeline__line {
    top: 32px;

    bottom: -14px;
  }

  .wb-timeline__card {
    padding: 13px 13px 14px;

    border-radius: 15px;
  }

  .wb-timeline__date {
    margin-bottom: 7px;

    font-size: 10px;
  }

  .wb-date-icon {
    width: 23px;
    height: 23px;
  }

  .wb-timeline__icon {
    width: 31px;
    height: 31px;

    font-size: 14px;
  }

  .wb-timeline__card h3 {
    font-size: 20px;
  }

  .wb-timeline__desc {
    margin-top: 8px;

    font-size: 12px;

    line-height: 1.6;
  }

  .wb-timeline__location {
    margin-top: 9px;
    padding-top: 8px;

    font-size: 10px;
  }
}

@media (max-width: 380px) {
  .wb-timeline {
    padding-left: 9px;
    padding-right: 9px;
  }

  .wb-timeline__item {
    grid-template-columns: 34px 1fr;
    gap: 7px;
  }

  .wb-timeline__number {
    width: 29px;
    height: 29px;

    font-size: 12px;
  }

  .wb-timeline__line {
    top: 29px;
  }

  .wb-timeline__card {
    padding: 12px;
  }

  .wb-timeline__card h3 {
    font-size: 18px;
  }

  .wb-timeline__icon {
    width: 29px;
    height: 29px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .wb-timeline__card {
    transition: none;
  }
}
</style>
