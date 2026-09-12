<template>
  <section class="sg-timeline">
    <div class="sg-timeline__header">
      <p class="sg-eyebrow">DẤU MỐC YÊU THƯƠNG</p>

      <h2>Hành trình của chúng mình</h2>

      <p class="sg-timeline__intro">
        Những khoảnh khắc đặc biệt đã đưa chúng mình đến ngày hôm nay
      </p>
    </div>

    <ol class="sg-timeline__list">
      <li v-for="(item, index) in items" :key="item.Id || index" class="sg-timeline__item">
        <div class="sg-timeline__side">
          <div class="sg-timeline__number">
            {{ String(index + 1).padStart(2, "0") }}
          </div>

          <div v-if="index < items.length - 1" class="sg-timeline__line"></div>
        </div>

        <article class="sg-timeline__card">
          <div class="sg-timeline__date">
            <span class="sg-date-icon">
              <v-icon size="14">mdi-calendar-heart</v-icon>
            </span>

            <time>{{ item.Time || item.Date || formatTime(index) }}</time>
          </div>

          <div class="sg-timeline__title-row">
            <div class="sg-timeline__icon">{{ item.Icon || "❀" }}</div>

            <h3>{{ item.Title || item.Name || "Một dấu mốc đặc biệt" }}</h3>
          </div>

          <p v-if="item.Description || item.Content" class="sg-timeline__desc">
            {{ item.Description || item.Content }}
          </p>

          <div v-if="item.Location" class="sg-timeline__location">
            <v-icon size="14">mdi-map-marker-outline</v-icon>
            <span>{{ item.Location }}</span>
          </div>
        </article>
      </li>
    </ol>

    <div class="sg-timeline__footer">
      <span></span>
      <v-icon size="14">mdi-leaf</v-icon>
      <span></span>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  timeline: { type: Array, default: () => [] },
});

const items = computed(() => props.timeline || []);

function formatTime(index) {
  return `DẤU MỐC ${String(index + 1).padStart(2, "0")}`;
}
</script>

<style scoped>
.sg-timeline {
  position: relative;

  width: min(680px, calc(100% - 24px));

  margin: 30px auto;

  padding: 38px 20px 32px;

  color: #28514b;

  border: 1px solid rgba(108, 142, 122, 0.35);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.7), rgba(240, 246, 238, 0.5));

  box-shadow: 0 12px 35px rgba(40, 81, 75, 0.08);

  overflow: hidden;
}

.sg-timeline::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(108, 142, 122, 0.22);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.sg-timeline__header {
  position: relative;

  text-align: center;

  margin-bottom: 30px;
}

.sg-eyebrow {
  margin: 0;

  color: #6c8e7a;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.sg-timeline__header h2 {
  margin: 6px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 36px);
  font-weight: 600;

  line-height: 1.1;

  color: #28514b;
}

.sg-timeline__intro {
  max-width: 440px;

  margin: 0 auto;

  color: #7a8a80;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LIST
========================================================= */

.sg-timeline__list {
  position: relative;

  margin: 0;
  padding: 0;

  list-style: none;
}

.sg-timeline__item {
  position: relative;

  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 14px;

  margin-bottom: 18px;
}

.sg-timeline__item:last-child {
  margin-bottom: 0;
}

/* =========================================================
   SIDE
========================================================= */

.sg-timeline__side {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.sg-timeline__number {
  position: relative;
  z-index: 3;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #28514b;

  border: 1px solid rgba(108, 142, 122, 0.5);
  border-radius: 50%;

  background: linear-gradient(145deg, #fbfdfa, #e3efe0);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 15px;
  font-weight: 700;

  box-shadow: 0 5px 14px rgba(40, 81, 75, 0.1);
}

.sg-timeline__line {
  position: absolute;
  z-index: 1;

  top: 38px;
  bottom: -18px;
  left: 50%;

  width: 1px;

  transform: translateX(-50%);

  background: linear-gradient(180deg, rgba(143, 174, 155, 0.6), rgba(143, 174, 155, 0.15));
}

/* =========================================================
   CARD
========================================================= */

.sg-timeline__card {
  position: relative;

  padding: 16px 17px 17px;

  border: 1px solid rgba(108, 142, 122, 0.3);
  border-radius: 18px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(240, 246, 238, 0.75));

  box-shadow: 0 7px 22px rgba(40, 81, 75, 0.06);

  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.sg-timeline__card:hover {
  transform: translateY(-3px);

  border-color: rgba(108, 142, 122, 0.5);

  box-shadow: 0 12px 28px rgba(40, 81, 75, 0.1);
}

/* =========================================================
   DATE
========================================================= */

.sg-timeline__date {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  margin-bottom: 8px;

  color: #6c8e7a;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.sg-date-icon {
  width: 25px;
  height: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #6c8e7a;

  border-radius: 50%;

  background: rgba(200, 212, 195, 0.5);
}

/* =========================================================
   TITLE
========================================================= */

.sg-timeline__title-row {
  display: flex;
  align-items: center;
  gap: 9px;
}

.sg-timeline__icon {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #6c8e7a;

  border: 1px solid rgba(108, 142, 122, 0.35);
  border-radius: 50%;

  background: linear-gradient(145deg, #fff, #e3efe0);

  font-size: 16px;
}

.sg-timeline__card h3 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 22px;
  font-weight: 600;

  line-height: 1.2;

  color: #28514b;
}

/* =========================================================
   DESCRIPTION
========================================================= */

.sg-timeline__desc {
  margin: 9px 0 0;

  color: #7a8a80;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LOCATION
========================================================= */

.sg-timeline__location {
  display: flex;
  align-items: center;
  gap: 5px;

  margin-top: 11px;
  padding-top: 9px;

  border-top: 1px solid rgba(108, 142, 122, 0.2);

  color: #7a8a80;

  font-size: 11px;

  line-height: 1.4;
}

.sg-timeline__location .v-icon {
  color: #6c8e7a;

  flex: 0 0 auto;
}

/* =========================================================
   FOOTER
========================================================= */

.sg-timeline__footer {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 27px;

  color: #8fae9b;
}

.sg-timeline__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(143, 174, 155, 0.55));
}

.sg-timeline__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .sg-timeline {
    width: calc(100% - 16px);

    margin: 20px auto;

    padding: 32px 12px 27px;

    border-radius: 23px;
  }

  .sg-timeline::before {
    inset: 6px;

    border-radius: 18px;
  }

  .sg-timeline__header {
    margin-bottom: 25px;
  }

  .sg-timeline__header h2 {
    font-size: 29px;
  }

  .sg-timeline__intro {
    padding: 0 10px;

    font-size: 12px;
  }

  .sg-timeline__item {
    grid-template-columns: 39px 1fr;
    gap: 9px;

    margin-bottom: 14px;
  }

  .sg-timeline__number {
    width: 32px;
    height: 32px;

    font-size: 13px;
  }

  .sg-timeline__line {
    top: 32px;

    bottom: -14px;
  }

  .sg-timeline__card {
    padding: 13px 13px 14px;

    border-radius: 15px;
  }

  .sg-timeline__date {
    margin-bottom: 7px;

    font-size: 8px;
  }

  .sg-date-icon {
    width: 23px;
    height: 23px;
  }

  .sg-timeline__icon {
    width: 31px;
    height: 31px;

    font-size: 14px;
  }

  .sg-timeline__card h3 {
    font-size: 20px;
  }

  .sg-timeline__desc {
    margin-top: 8px;

    font-size: 12px;

    line-height: 1.6;
  }

  .sg-timeline__location {
    margin-top: 9px;
    padding-top: 8px;

    font-size: 10px;
  }
}

@media (max-width: 380px) {
  .sg-timeline {
    padding-left: 9px;
    padding-right: 9px;
  }

  .sg-timeline__item {
    grid-template-columns: 34px 1fr;
    gap: 7px;
  }

  .sg-timeline__number {
    width: 29px;
    height: 29px;

    font-size: 12px;
  }

  .sg-timeline__line {
    top: 29px;
  }

  .sg-timeline__card {
    padding: 12px;
  }

  .sg-timeline__card h3 {
    font-size: 18px;
  }

  .sg-timeline__icon {
    width: 29px;
    height: 29px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .sg-timeline__card {
    transition: none;
  }
}
</style>
