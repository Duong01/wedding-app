<template>
  <section class="cb-timeline">
    <div class="cb-timeline__header">
      <p class="cb-eyebrow">DẤU MỐC YÊU THƯƠNG</p>

      <h2>Hành trình của chúng mình</h2>

      <p class="cb-timeline__intro">
        Những khoảnh khắc đặc biệt đã đưa chúng mình đến ngày hôm nay
      </p>
    </div>

    <ol class="cb-timeline__list">
      <li v-for="(item, index) in items" :key="item.Id || index" class="cb-timeline__item">
        <div class="cb-timeline__side">
          <div class="cb-timeline__number">
            {{ String(index + 1).padStart(2, "0") }}
          </div>

          <div v-if="index < items.length - 1" class="cb-timeline__line"></div>
        </div>

        <article class="cb-timeline__card">
          <div class="cb-timeline__date">
            <span class="cb-date-icon">
              <v-icon size="14">mdi-calendar-heart</v-icon>
            </span>

            <time>{{ item.Time || item.Date || formatTime(index) }}</time>
          </div>

          <div class="cb-timeline__title-row">
            <div class="cb-timeline__icon">{{ item.Icon || "❀" }}</div>

            <h3>{{ item.Title || item.Name || "Một dấu mốc đặc biệt" }}</h3>
          </div>

          <p v-if="item.Description || item.Content" class="cb-timeline__desc">
            {{ item.Description || item.Content }}
          </p>

          <div v-if="item.Location" class="cb-timeline__location">
            <v-icon size="14">mdi-map-marker-outline</v-icon>
            <span>{{ item.Location }}</span>
          </div>
        </article>
      </li>
    </ol>

    <div class="cb-timeline__footer">
      <span></span>
      <v-icon size="14">mdi-heart</v-icon>
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
.cb-timeline {
  position: relative;

  width: min(680px, calc(100% - 24px));

  margin: 30px auto;

  padding: 38px 20px 32px;

  color: #6c4b4a;

  border: 1px solid rgba(201, 160, 106, 0.4);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 253, 250, 0.7), rgba(250, 240, 230, 0.5));

  box-shadow: 0 12px 35px rgba(108, 75, 74, 0.08);

  overflow: hidden;
}

.cb-timeline::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(201, 160, 106, 0.22);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.cb-timeline__header {
  position: relative;

  text-align: center;

  margin-bottom: 30px;
}

.cb-eyebrow {
  margin: 0;

  color: #b67f7d;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.cb-timeline__header h2 {
  margin: 6px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 36px);
  font-weight: 600;

  line-height: 1.1;

  color: #6c4b4a;
}

.cb-timeline__intro {
  max-width: 440px;

  margin: 0 auto;

  color: #9a7a72;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LIST
========================================================= */

.cb-timeline__list {
  position: relative;

  margin: 0;
  padding: 0;

  list-style: none;
}

.cb-timeline__item {
  position: relative;

  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 14px;

  margin-bottom: 18px;
}

.cb-timeline__item:last-child {
  margin-bottom: 0;
}

/* =========================================================
   SIDE
========================================================= */

.cb-timeline__side {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.cb-timeline__number {
  position: relative;
  z-index: 3;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #6c4b4a;

  border: 1px solid rgba(201, 160, 106, 0.5);
  border-radius: 50%;

  background: linear-gradient(145deg, #fffdfc, #f5e6d6);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 15px;
  font-weight: 700;

  box-shadow: 0 5px 14px rgba(108, 75, 74, 0.1);
}

.cb-timeline__line {
  position: absolute;
  z-index: 1;

  top: 38px;
  bottom: -18px;
  left: 50%;

  width: 1px;

  transform: translateX(-50%);

  background: linear-gradient(180deg, rgba(201, 160, 106, 0.6), rgba(201, 160, 106, 0.15));
}

/* =========================================================
   CARD
========================================================= */

.cb-timeline__card {
  position: relative;

  padding: 16px 17px 17px;

  border: 1px solid rgba(201, 160, 106, 0.3);
  border-radius: 18px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(253, 244, 235, 0.75));

  box-shadow: 0 7px 22px rgba(108, 75, 74, 0.06);

  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.cb-timeline__card:hover {
  transform: translateY(-3px);

  border-color: rgba(201, 160, 106, 0.5);

  box-shadow: 0 12px 28px rgba(108, 75, 74, 0.1);
}

/* =========================================================
   DATE
========================================================= */

.cb-timeline__date {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  margin-bottom: 8px;

  color: #b67f7d;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.cb-date-icon {
  width: 25px;
  height: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #b67f7d;

  border-radius: 50%;

  background: rgba(234, 210, 182, 0.5);
}

/* =========================================================
   TITLE
========================================================= */

.cb-timeline__title-row {
  display: flex;
  align-items: center;
  gap: 9px;
}

.cb-timeline__icon {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #b67f7d;

  border: 1px solid rgba(201, 160, 106, 0.35);
  border-radius: 50%;

  background: linear-gradient(145deg, #fff, #f5e6d6);

  font-size: 16px;
}

.cb-timeline__card h3 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 22px;
  font-weight: 600;

  line-height: 1.2;

  color: #6c4b4a;
}

/* =========================================================
   DESCRIPTION
========================================================= */

.cb-timeline__desc {
  margin: 9px 0 0;

  color: #7d5f58;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LOCATION
========================================================= */

.cb-timeline__location {
  display: flex;
  align-items: center;
  gap: 5px;

  margin-top: 11px;
  padding-top: 9px;

  border-top: 1px solid rgba(201, 160, 106, 0.2);

  color: #9a7a72;

  font-size: 11px;

  line-height: 1.4;
}

.cb-timeline__location .v-icon {
  color: #b67f7d;

  flex: 0 0 auto;
}

/* =========================================================
   FOOTER
========================================================= */

.cb-timeline__footer {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 27px;

  color: #c9a06a;
}

.cb-timeline__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 160, 106, 0.55));
}

.cb-timeline__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .cb-timeline {
    width: calc(100% - 16px);

    margin: 20px auto;

    padding: 32px 12px 27px;

    border-radius: 23px;
  }

  .cb-timeline::before {
    inset: 6px;

    border-radius: 18px;
  }

  .cb-timeline__header {
    margin-bottom: 25px;
  }

  .cb-timeline__header h2 {
    font-size: 29px;
  }

  .cb-timeline__intro {
    padding: 0 10px;

    font-size: 12px;
  }

  .cb-timeline__item {
    grid-template-columns: 39px 1fr;
    gap: 9px;

    margin-bottom: 14px;
  }

  .cb-timeline__number {
    width: 32px;
    height: 32px;

    font-size: 13px;
  }

  .cb-timeline__line {
    top: 32px;

    bottom: -14px;
  }

  .cb-timeline__card {
    padding: 13px 13px 14px;

    border-radius: 15px;
  }

  .cb-timeline__date {
    margin-bottom: 7px;

    font-size: 8px;
  }

  .cb-date-icon {
    width: 23px;
    height: 23px;
  }

  .cb-timeline__icon {
    width: 31px;
    height: 31px;

    font-size: 14px;
  }

  .cb-timeline__card h3 {
    font-size: 20px;
  }

  .cb-timeline__desc {
    margin-top: 8px;

    font-size: 12px;

    line-height: 1.6;
  }

  .cb-timeline__location {
    margin-top: 9px;
    padding-top: 8px;

    font-size: 10px;
  }
}

@media (max-width: 380px) {
  .cb-timeline {
    padding-left: 9px;
    padding-right: 9px;
  }

  .cb-timeline__item {
    grid-template-columns: 34px 1fr;
    gap: 7px;
  }

  .cb-timeline__number {
    width: 29px;
    height: 29px;

    font-size: 12px;
  }

  .cb-timeline__line {
    top: 29px;
  }

  .cb-timeline__card {
    padding: 12px;
  }

  .cb-timeline__card h3 {
    font-size: 18px;
  }

  .cb-timeline__icon {
    width: 29px;
    height: 29px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .cb-timeline__card {
    transition: none;
  }
}
</style>
