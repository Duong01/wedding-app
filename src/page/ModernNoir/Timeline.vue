<template>
  <section class="mn-timeline">
    <div class="mn-timeline__header">
      <p v-if="eyebrow" class="mn-eyebrow">{{ eyebrow }}</p>

      <h2>{{ heading }}</h2>

      <p v-if="intro" class="mn-timeline__intro">
        {{ intro }}
      </p>
    </div>

    <ol class="mn-timeline__list">
      <li v-for="(item, index) in items" :key="item.Id || index" class="mn-timeline__item">
        <div class="mn-timeline__side">
          <div class="mn-timeline__number">
            {{ String(index + 1).padStart(2, "0") }}
          </div>

          <div v-if="index < items.length - 1" class="mn-timeline__line"></div>
        </div>

        <article class="mn-timeline__card">
          <div class="mn-timeline__date">
            <span class="mn-date-icon">
              <v-icon size="14">mdi-calendar-heart</v-icon>
            </span>

            <time>{{ item.Time || item.Date || formatTime(index) }}</time>
          </div>

          <div class="mn-timeline__title-row">
            <div class="mn-timeline__icon">{{ item.Icon || "✧" }}</div>

            <h3>{{ item.Title || item.Name || $t("Một dấu mốc đặc biệt") }}</h3>
          </div>

          <p v-if="item.Description || item.Content" class="mn-timeline__desc">
            {{ item.Description || item.Content }}
          </p>

          <div v-if="item.Location" class="mn-timeline__location">
            <v-icon size="14">mdi-map-marker-outline</v-icon>
            <span>{{ item.Location }}</span>
          </div>
        </article>
      </li>
    </ol>

    <div class="mn-timeline__footer">
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
.mn-timeline {
  position: relative;

  width: min(680px, calc(100% - 24px));

  margin: 30px auto;

  padding: 38px 20px 32px;

  color: var(--tc-3a3a3a, #3a3a3a);

  border: 1px solid rgba(var(--tc-b8a07a-rgb, 184, 160, 122), 0.35);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.7), rgba(var(--tc-f4ead4-rgb, 244, 234, 212), 0.5));

  box-shadow: 0 12px 35px rgba(var(--tc-3a3a3a-rgb, 58, 58, 58), 0.08);

  overflow: hidden;
}

.mn-timeline::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.22);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.mn-timeline__header {
  position: relative;

  text-align: center;

  margin-bottom: 30px;
}

.mn-eyebrow {
  margin: 0;

  color: var(--tc-474747, #474747);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.mn-timeline__header h2 {
  margin: 6px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 36px);
  font-weight: 600;

  line-height: 1.1;

  color: var(--tc-3a3a3a, #3a3a3a);
}

.mn-timeline__intro {
  max-width: 440px;

  margin: 0 auto;

  color: var(--tc-4f4f4f, #4f4f4f);

  font-size: 13px;

  line-height: 1.65;

  /* Nội dung cho phép xuống dòng bằng ký tự \n */
  white-space: pre-line;
}

/* =========================================================
   LIST
========================================================= */

.mn-timeline__list {
  position: relative;

  margin: 0;
  padding: 0;

  list-style: none;
}

.mn-timeline__item {
  position: relative;

  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 14px;

  margin-bottom: 18px;
}

.mn-timeline__item:last-child {
  margin-bottom: 0;
}

/* =========================================================
   SIDE
========================================================= */

.mn-timeline__side {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.mn-timeline__number {
  position: relative;
  z-index: 3;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--tc-3a3a3a, #3a3a3a);

  border: 1px solid rgba(var(--tc-b8a07a-rgb, 184, 160, 122), 0.5);
  border-radius: 50%;

  background: linear-gradient(145deg, var(--tc-fdfcf7, #fdfcf7), var(--tc-f0e5cd, #f0e5cd));

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 15px;
  font-weight: 700;

  box-shadow: 0 5px 14px rgba(var(--tc-3a3a3a-rgb, 58, 58, 58), 0.1);
}

.mn-timeline__line {
  position: absolute;
  z-index: 1;

  top: 38px;
  bottom: -18px;
  left: 50%;

  width: 1px;

  transform: translateX(-50%);

  background: linear-gradient(180deg, rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.6), rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.15));
}

/* =========================================================
   CARD
========================================================= */

.mn-timeline__card {
  position: relative;

  padding: 16px 17px 17px;

  border: 1px solid rgba(var(--tc-b8a07a-rgb, 184, 160, 122), 0.3);
  border-radius: 18px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(var(--tc-f4ead4-rgb, 244, 234, 212), 0.75));

  box-shadow: 0 7px 22px rgba(var(--tc-3a3a3a-rgb, 58, 58, 58), 0.06);

  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.mn-timeline__card:hover {
  transform: translateY(-3px);

  border-color: rgba(var(--tc-b8a07a-rgb, 184, 160, 122), 0.5);

  box-shadow: 0 12px 28px rgba(var(--tc-3a3a3a-rgb, 58, 58, 58), 0.1);
}

/* =========================================================
   DATE
========================================================= */

.mn-timeline__date {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  margin-bottom: 8px;

  color: var(--tc-474747, #474747);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.mn-date-icon {
  width: 25px;
  height: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--tc-474747, #474747);

  border-radius: 50%;

  background: rgba(var(--tc-dcc9a4-rgb, 220, 201, 164), 0.5);
}

/* =========================================================
   TITLE
========================================================= */

.mn-timeline__title-row {
  display: flex;
  align-items: center;
  gap: 9px;
}

.mn-timeline__icon {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--tc-474747, #474747);

  border: 1px solid rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.35);
  border-radius: 50%;

  background: linear-gradient(145deg, #fff, var(--tc-f0e5cd, #f0e5cd));

  font-size: 16px;
}

.mn-timeline__card h3 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 22px;
  font-weight: 600;

  line-height: 1.2;

  color: var(--tc-3a3a3a, #3a3a3a);
}

/* =========================================================
   DESCRIPTION
========================================================= */

.mn-timeline__desc {
  margin: 9px 0 0;

  color: var(--tc-5c5c5c, #5c5c5c);

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LOCATION
========================================================= */

.mn-timeline__location {
  display: flex;
  align-items: center;
  gap: 5px;

  margin-top: 11px;
  padding-top: 9px;

  border-top: 1px solid rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.2);

  color: var(--tc-4f4f4f, #4f4f4f);

  font-size: 11px;

  line-height: 1.4;
}

.mn-timeline__location .v-icon {
  color: var(--tc-474747, #474747);

  flex: 0 0 auto;
}

/* =========================================================
   FOOTER
========================================================= */

.mn-timeline__footer {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 27px;

  color: var(--tc-4d4d4d, #4d4d4d);
}

.mn-timeline__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.55));
}

.mn-timeline__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .mn-timeline {
    width: calc(100% - 16px);

    margin: 20px auto;

    padding: 32px 12px 27px;

    border-radius: 23px;
  }

  .mn-timeline::before {
    inset: 6px;

    border-radius: 18px;
  }

  .mn-timeline__header {
    margin-bottom: 25px;
  }

  .mn-timeline__header h2 {
    font-size: 29px;
  }

  .mn-timeline__intro {
    padding: 0 10px;

    font-size: 12px;
  }

  .mn-timeline__item {
    grid-template-columns: 39px 1fr;
    gap: 9px;

    margin-bottom: 14px;
  }

  .mn-timeline__number {
    width: 32px;
    height: 32px;

    font-size: 13px;
  }

  .mn-timeline__line {
    top: 32px;

    bottom: -14px;
  }

  .mn-timeline__card {
    padding: 13px 13px 14px;

    border-radius: 15px;
  }

  .mn-timeline__date {
    margin-bottom: 7px;

    font-size: 10px;
  }

  .mn-date-icon {
    width: 23px;
    height: 23px;
  }

  .mn-timeline__icon {
    width: 31px;
    height: 31px;

    font-size: 14px;
  }

  .mn-timeline__card h3 {
    font-size: 20px;
  }

  .mn-timeline__desc {
    margin-top: 8px;

    font-size: 12px;

    line-height: 1.6;
  }

  .mn-timeline__location {
    margin-top: 9px;
    padding-top: 8px;

    font-size: 10px;
  }
}

@media (max-width: 380px) {
  .mn-timeline {
    padding-left: 9px;
    padding-right: 9px;
  }

  .mn-timeline__item {
    grid-template-columns: 34px 1fr;
    gap: 7px;
  }

  .mn-timeline__number {
    width: 29px;
    height: 29px;

    font-size: 12px;
  }

  .mn-timeline__line {
    top: 29px;
  }

  .mn-timeline__card {
    padding: 12px;
  }

  .mn-timeline__card h3 {
    font-size: 18px;
  }

  .mn-timeline__icon {
    width: 29px;
    height: 29px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .mn-timeline__card {
    transition: none;
  }
}
</style>
