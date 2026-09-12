<template>
  <section class="ob-timeline">
    <div class="ob-timeline__header">
      <p class="ob-eyebrow">DẤU MỐC YÊU THƯƠNG</p>

      <h2>Hành trình của chúng mình</h2>

      <p class="ob-timeline__intro">
        Những khoảnh khắc đặc biệt đã đưa chúng mình đến ngày hôm nay
      </p>
    </div>

    <ol class="ob-timeline__list">
      <li v-for="(item, index) in items" :key="item.Id || index" class="ob-timeline__item">
        <div class="ob-timeline__side">
          <div class="ob-timeline__number">
            {{ String(index + 1).padStart(2, "0") }}
          </div>

          <div v-if="index < items.length - 1" class="ob-timeline__line"></div>
        </div>

        <article class="ob-timeline__card">
          <div class="ob-timeline__date">
            <span class="ob-date-icon">
              <v-icon size="14">mdi-calendar-heart</v-icon>
            </span>

            <time>{{ item.Time || item.Date || formatTime(index) }}</time>
          </div>

          <div class="ob-timeline__title-row">
            <div class="ob-timeline__icon">{{ item.Icon || "〜" }}</div>

            <h3>{{ item.Title || item.Name || "Một dấu mốc đặc biệt" }}</h3>
          </div>

          <p v-if="item.Description || item.Content" class="ob-timeline__desc">
            {{ item.Description || item.Content }}
          </p>

          <div v-if="item.Location" class="ob-timeline__location">
            <v-icon size="14">mdi-map-marker-outline</v-icon>
            <span>{{ item.Location }}</span>
          </div>
        </article>
      </li>
    </ol>

    <div class="ob-timeline__footer">
      <span></span>
      <v-icon size="14">mdi-heart</v-icon>
      <span class="ob-timeline__footer-flip"></span>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  timeline: { type: Array, default: () => [] },
  events: { type: Array, default: () => [] },
});

const items = computed(() => props.timeline || []);

function formatTime(index) {
  return `DẤU MỐC ${String(index + 1).padStart(2, "0")}`;
}
</script>

<style scoped>
.ob-timeline {
  position: relative;

  width: min(680px, calc(100% - 24px));

  margin: 30px auto;

  padding: 38px 20px 32px;

  color: #274b5c;

  border: 1px solid rgba(74, 154, 184, 0.35);
  border-radius: 24px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.75), rgba(244, 250, 252, 0.55));

  box-shadow: 0 12px 35px rgba(29, 106, 142, 0.08);

  overflow: hidden;
}

.ob-timeline::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;

  background:
    radial-gradient(circle at 12px 8px, transparent 9px, rgba(168, 208, 220, 0.55) 10px, transparent 11px) repeat-x;
  background-size: 24px 10px;
  background-position: 0 0;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.ob-timeline__header {
  position: relative;

  text-align: center;

  margin-bottom: 30px;
}

.ob-eyebrow {
  margin: 0;

  color: #4a9ab8;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ob-timeline__header h2 {
  margin: 6px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 36px);
  font-weight: 600;

  line-height: 1.1;

  color: #1d6a8e;
}

.ob-timeline__intro {
  max-width: 440px;

  margin: 0 auto;

  color: #5b8296;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LIST
========================================================= */

.ob-timeline__list {
  position: relative;

  margin: 0;
  padding: 0;

  list-style: none;
}

.ob-timeline__item {
  position: relative;

  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 14px;

  margin-bottom: 18px;
}

.ob-timeline__item:last-child {
  margin-bottom: 0;
}

/* =========================================================
   SIDE
========================================================= */

.ob-timeline__side {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.ob-timeline__number {
  position: relative;
  z-index: 3;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #ffffff;

  border: 1px solid rgba(74, 154, 184, 0.5);
  border-radius: 50%;

  background: linear-gradient(145deg, #4a9ab8, #1d6a8e);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 15px;
  font-weight: 700;

  box-shadow: 0 5px 14px rgba(29, 106, 142, 0.22);
}

.ob-timeline__line {
  position: absolute;
  z-index: 1;

  top: 38px;
  bottom: -18px;
  left: 50%;

  width: 1px;

  transform: translateX(-50%);

  background: linear-gradient(180deg, rgba(74, 154, 184, 0.6), rgba(74, 154, 184, 0.15));
}

/* =========================================================
   CARD
========================================================= */

.ob-timeline__card {
  position: relative;

  padding: 16px 17px 17px;

  border: 1px solid rgba(74, 154, 184, 0.3);
  border-radius: 18px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(244, 250, 252, 0.78));

  box-shadow: 0 7px 22px rgba(29, 106, 142, 0.06);

  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.ob-timeline__card:hover {
  transform: translateY(-3px);

  border-color: rgba(74, 154, 184, 0.5);

  box-shadow: 0 12px 28px rgba(29, 106, 142, 0.1);
}

/* =========================================================
   DATE
========================================================= */

.ob-timeline__date {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  margin-bottom: 8px;

  color: #4a9ab8;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.ob-date-icon {
  width: 25px;
  height: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #4a9ab8;

  border-radius: 50%;

  background: rgba(168, 208, 220, 0.4);
}

/* =========================================================
   TITLE
========================================================= */

.ob-timeline__title-row {
  display: flex;
  align-items: center;
  gap: 9px;
}

.ob-timeline__icon {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #e8927c;

  border: 1px solid rgba(74, 154, 184, 0.35);
  border-radius: 50%;

  background: linear-gradient(145deg, #ffffff, #e2f1f5);

  font-size: 16px;
}

.ob-timeline__card h3 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 22px;
  font-weight: 600;

  line-height: 1.2;

  color: #1d6a8e;
}

/* =========================================================
   DESCRIPTION
========================================================= */

.ob-timeline__desc {
  margin: 9px 0 0;

  color: #4f7488;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LOCATION
========================================================= */

.ob-timeline__location {
  display: flex;
  align-items: center;
  gap: 5px;

  margin-top: 11px;
  padding-top: 9px;

  border-top: 1px solid rgba(74, 154, 184, 0.2);

  color: #5b8296;

  font-size: 11px;

  line-height: 1.4;
}

.ob-timeline__location .v-icon {
  color: #e8927c;

  flex: 0 0 auto;
}

/* =========================================================
   FOOTER
========================================================= */

.ob-timeline__footer {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 27px;

  color: #4a9ab8;
}

.ob-timeline__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(74, 154, 184, 0.55));
}

.ob-timeline__footer-flip {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .ob-timeline {
    width: calc(100% - 16px);

    margin: 20px auto;

    padding: 32px 12px 27px;

    border-radius: 20px;
  }

  .ob-timeline__header {
    margin-bottom: 25px;
  }

  .ob-timeline__header h2 {
    font-size: 29px;
  }

  .ob-timeline__intro {
    padding: 0 10px;

    font-size: 12px;
  }

  .ob-timeline__item {
    grid-template-columns: 39px 1fr;
    gap: 9px;

    margin-bottom: 14px;
  }

  .ob-timeline__number {
    width: 32px;
    height: 32px;

    font-size: 13px;
  }

  .ob-timeline__line {
    top: 32px;

    bottom: -14px;
  }

  .ob-timeline__card {
    padding: 13px 13px 14px;

    border-radius: 15px;
  }

  .ob-timeline__date {
    margin-bottom: 7px;

    font-size: 8px;
  }

  .ob-date-icon {
    width: 23px;
    height: 23px;
  }

  .ob-timeline__icon {
    width: 31px;
    height: 31px;

    font-size: 14px;
  }

  .ob-timeline__card h3 {
    font-size: 20px;
  }

  .ob-timeline__desc {
    margin-top: 8px;

    font-size: 12px;

    line-height: 1.6;
  }

  .ob-timeline__location {
    margin-top: 9px;
    padding-top: 8px;

    font-size: 10px;
  }
}

@media (max-width: 380px) {
  .ob-timeline {
    padding-left: 9px;
    padding-right: 9px;
  }

  .ob-timeline__item {
    grid-template-columns: 34px 1fr;
    gap: 7px;
  }

  .ob-timeline__number {
    width: 29px;
    height: 29px;

    font-size: 12px;
  }

  .ob-timeline__line {
    top: 29px;
  }

  .ob-timeline__card {
    padding: 12px;
  }

  .ob-timeline__card h3 {
    font-size: 18px;
  }

  .ob-timeline__icon {
    width: 29px;
    height: 29px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .ob-timeline__card {
    transition: none;
  }
}
</style>
