<template>
  <section class="lc-timeline">
    <div class="lc-timeline__header">
      <p class="lc-eyebrow">DẤU MỐC YÊU THƯƠNG</p>

      <h2>Hành trình của chúng mình</h2>

      <p class="lc-timeline__intro">
        Những khoảnh khắc đặc biệt đã đưa chúng mình đến ngày hôm nay
      </p>
    </div>

    <ol class="lc-timeline__list">
      <li v-for="(item, index) in items" :key="item.Id || index" class="lc-timeline__item">
        <div class="lc-timeline__side">
          <div class="lc-timeline__number">
            {{ String(index + 1).padStart(2, "0") }}
          </div>

          <div v-if="index < items.length - 1" class="lc-timeline__line"></div>
        </div>

        <article class="lc-timeline__card">
          <div class="lc-timeline__date">
            <span class="lc-date-icon">
              <v-icon size="14">mdi-calendar-heart</v-icon>
            </span>

            <time>{{ item.Time || item.Date || formatTime(index) }}</time>
          </div>

          <div class="lc-timeline__title-row">
            <div class="lc-timeline__icon">{{ item.Icon || "❀" }}</div>

            <h3>{{ item.Title || item.Name || "Một dấu mốc đặc biệt" }}</h3>
          </div>

          <p v-if="item.Description || item.Content" class="lc-timeline__desc">
            {{ item.Description || item.Content }}
          </p>

          <div v-if="item.Location" class="lc-timeline__location">
            <v-icon size="14">mdi-map-marker-outline</v-icon>
            <span>{{ item.Location }}</span>
          </div>
        </article>
      </li>
    </ol>

    <div class="lc-timeline__footer">
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
.lc-timeline {
  position: relative;

  width: min(680px, calc(100% - 24px));

  margin: 30px auto;

  padding: 38px 20px 32px;

  color: #584a5b;

  border: 1px solid rgba(160, 134, 180, 0.35);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.7), rgba(246, 240, 250, 0.5));

  box-shadow: 0 12px 35px rgba(88, 74, 91, 0.08);

  overflow: hidden;
}

.lc-timeline::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(185, 160, 208, 0.22);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.lc-timeline__header {
  position: relative;

  text-align: center;

  margin-bottom: 30px;
}

.lc-eyebrow {
  margin: 0;

  color: #a086b4;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.lc-timeline__header h2 {
  margin: 6px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 36px);
  font-weight: 600;

  line-height: 1.1;

  color: #584a5b;
}

.lc-timeline__intro {
  max-width: 440px;

  margin: 0 auto;

  color: #8d7f92;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LIST
========================================================= */

.lc-timeline__list {
  position: relative;

  margin: 0;
  padding: 0;

  list-style: none;
}

.lc-timeline__item {
  position: relative;

  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 14px;

  margin-bottom: 18px;
}

.lc-timeline__item:last-child {
  margin-bottom: 0;
}

/* =========================================================
   SIDE
========================================================= */

.lc-timeline__side {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.lc-timeline__number {
  position: relative;
  z-index: 3;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #584a5b;

  border: 1px solid rgba(160, 134, 180, 0.5);
  border-radius: 50%;

  background: linear-gradient(145deg, #fdfcfe, #ece1f2);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 15px;
  font-weight: 700;

  box-shadow: 0 5px 14px rgba(88, 74, 91, 0.1);
}

.lc-timeline__line {
  position: absolute;
  z-index: 1;

  top: 38px;
  bottom: -18px;
  left: 50%;

  width: 1px;

  transform: translateX(-50%);

  background: linear-gradient(180deg, rgba(185, 160, 208, 0.6), rgba(185, 160, 208, 0.15));
}

/* =========================================================
   CARD
========================================================= */

.lc-timeline__card {
  position: relative;

  padding: 16px 17px 17px;

  border: 1px solid rgba(160, 134, 180, 0.3);
  border-radius: 18px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(246, 240, 250, 0.75));

  box-shadow: 0 7px 22px rgba(88, 74, 91, 0.06);

  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.lc-timeline__card:hover {
  transform: translateY(-3px);

  border-color: rgba(160, 134, 180, 0.5);

  box-shadow: 0 12px 28px rgba(88, 74, 91, 0.1);
}

/* =========================================================
   DATE
========================================================= */

.lc-timeline__date {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  margin-bottom: 8px;

  color: #a086b4;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.lc-date-icon {
  width: 25px;
  height: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #a086b4;

  border-radius: 50%;

  background: rgba(216, 192, 222, 0.5);
}

/* =========================================================
   TITLE
========================================================= */

.lc-timeline__title-row {
  display: flex;
  align-items: center;
  gap: 9px;
}

.lc-timeline__icon {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #a086b4;

  border: 1px solid rgba(185, 160, 208, 0.35);
  border-radius: 50%;

  background: linear-gradient(145deg, #fff, #ece1f2);

  font-size: 16px;
}

.lc-timeline__card h3 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 22px;
  font-weight: 600;

  line-height: 1.2;

  color: #584a5b;
}

/* =========================================================
   DESCRIPTION
========================================================= */

.lc-timeline__desc {
  margin: 9px 0 0;

  color: #6f5f74;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LOCATION
========================================================= */

.lc-timeline__location {
  display: flex;
  align-items: center;
  gap: 5px;

  margin-top: 11px;
  padding-top: 9px;

  border-top: 1px solid rgba(185, 160, 208, 0.2);

  color: #8d7f92;

  font-size: 11px;

  line-height: 1.4;
}

.lc-timeline__location .v-icon {
  color: #a086b4;

  flex: 0 0 auto;
}

/* =========================================================
   FOOTER
========================================================= */

.lc-timeline__footer {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 27px;

  color: #b9a0d0;
}

.lc-timeline__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(185, 160, 208, 0.55));
}

.lc-timeline__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .lc-timeline {
    width: calc(100% - 16px);

    margin: 20px auto;

    padding: 32px 12px 27px;

    border-radius: 23px;
  }

  .lc-timeline::before {
    inset: 6px;

    border-radius: 18px;
  }

  .lc-timeline__header {
    margin-bottom: 25px;
  }

  .lc-timeline__header h2 {
    font-size: 29px;
  }

  .lc-timeline__intro {
    padding: 0 10px;

    font-size: 12px;
  }

  .lc-timeline__item {
    grid-template-columns: 39px 1fr;
    gap: 9px;

    margin-bottom: 14px;
  }

  .lc-timeline__number {
    width: 32px;
    height: 32px;

    font-size: 13px;
  }

  .lc-timeline__line {
    top: 32px;

    bottom: -14px;
  }

  .lc-timeline__card {
    padding: 13px 13px 14px;

    border-radius: 15px;
  }

  .lc-timeline__date {
    margin-bottom: 7px;

    font-size: 8px;
  }

  .lc-date-icon {
    width: 23px;
    height: 23px;
  }

  .lc-timeline__icon {
    width: 31px;
    height: 31px;

    font-size: 14px;
  }

  .lc-timeline__card h3 {
    font-size: 20px;
  }

  .lc-timeline__desc {
    margin-top: 8px;

    font-size: 12px;

    line-height: 1.6;
  }

  .lc-timeline__location {
    margin-top: 9px;
    padding-top: 8px;

    font-size: 10px;
  }
}

@media (max-width: 380px) {
  .lc-timeline {
    padding-left: 9px;
    padding-right: 9px;
  }

  .lc-timeline__item {
    grid-template-columns: 34px 1fr;
    gap: 7px;
  }

  .lc-timeline__number {
    width: 29px;
    height: 29px;

    font-size: 12px;
  }

  .lc-timeline__line {
    top: 29px;
  }

  .lc-timeline__card {
    padding: 12px;
  }

  .lc-timeline__card h3 {
    font-size: 18px;
  }

  .lc-timeline__icon {
    width: 29px;
    height: 29px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .lc-timeline__card {
    transition: none;
  }
}
</style>
