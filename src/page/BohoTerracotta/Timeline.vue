<template>
  <section class="bt-timeline">
    <div class="bt-timeline__header">
      <p class="bt-eyebrow">DẤU MỐC YÊU THƯƠNG</p>

      <h2>Hành trình của chúng mình</h2>

      <p class="bt-timeline__intro">
        Những khoảnh khắc đặc biệt đã đưa chúng mình đến ngày hôm nay
      </p>
    </div>

    <ol class="bt-timeline__list">
      <li v-for="(item, index) in items" :key="item.Id || index" class="bt-timeline__item">
        <div class="bt-timeline__side">
          <div class="bt-timeline__number">
            {{ String(index + 1).padStart(2, "0") }}
          </div>

          <div v-if="index < items.length - 1" class="bt-timeline__line"></div>
        </div>

        <article class="bt-timeline__card">
          <div class="bt-timeline__date">
            <span class="bt-date-icon">
              <v-icon size="14">mdi-calendar-heart</v-icon>
            </span>

            <time>{{ item.Time || item.Date || formatTime(index) }}</time>
          </div>

          <div class="bt-timeline__title-row">
            <div class="bt-timeline__icon">{{ item.Icon || "❋" }}</div>

            <h3>{{ item.Title || item.Name || "Một dấu mốc đặc biệt" }}</h3>
          </div>

          <p v-if="item.Description || item.Content" class="bt-timeline__desc">
            {{ item.Description || item.Content }}
          </p>

          <div v-if="item.Location" class="bt-timeline__location">
            <v-icon size="14">mdi-map-marker-outline</v-icon>
            <span>{{ item.Location }}</span>
          </div>
        </article>
      </li>
    </ol>

    <div class="bt-timeline__footer">
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
  events: { type: Array, default: () => [] },
});

const items = computed(() => props.timeline || []);

function formatTime(index) {
  return `DẤU MỐC ${String(index + 1).padStart(2, "0")}`;
}
</script>

<style scoped>
.bt-timeline {
  position: relative;

  width: min(680px, calc(100% - 24px));

  margin: 30px auto;

  padding: 38px 20px 32px;

  color: #5c4636;

  border: 2px dashed rgba(156, 91, 63, 0.4);
  border-radius: 60% 60% 28px 28px / 14% 14% 28px 28px;

  background: linear-gradient(172deg, rgba(255, 251, 245, 0.75), rgba(242, 226, 208, 0.5));

  box-shadow: 0 12px 35px rgba(92, 70, 54, 0.09);

  overflow: hidden;
}

/* Macramé lattice texture */
.bt-timeline::before {
  content: "";
  position: absolute;
  inset: 0;

  opacity: 0.05;

  background-image:
    repeating-linear-gradient(45deg, rgba(156, 91, 63, 0.6) 0 1px, transparent 1px 18px),
    repeating-linear-gradient(-45deg, rgba(156, 91, 63, 0.6) 0 1px, transparent 1px 18px);

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.bt-timeline__header {
  position: relative;

  text-align: center;

  margin-bottom: 30px;
}

.bt-eyebrow {
  margin: 0;

  color: #8a9b7c;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.bt-timeline__header h2 {
  margin: 6px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 36px);
  font-weight: 600;

  line-height: 1.1;

  color: #9c5b3f;
}

.bt-timeline__intro {
  max-width: 440px;

  margin: 0 auto;

  color: #8a6f5c;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LIST
========================================================= */

.bt-timeline__list {
  position: relative;

  margin: 0;
  padding: 0;

  list-style: none;
}

.bt-timeline__item {
  position: relative;

  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 14px;

  margin-bottom: 18px;
}

.bt-timeline__item:last-child {
  margin-bottom: 0;
}

/* =========================================================
   SIDE — numbered circles + connecting line
========================================================= */

.bt-timeline__side {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.bt-timeline__number {
  position: relative;
  z-index: 3;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #fff6ec;

  border: 1px solid rgba(156, 91, 63, 0.5);
  border-radius: 50% 50% 50% 12%;

  background: linear-gradient(145deg, #c97b5d, #9c5b3f);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 15px;
  font-weight: 700;

  box-shadow: 0 5px 14px rgba(156, 91, 63, 0.25);

  transform: rotate(-2deg);
}

.bt-timeline__item:nth-child(even) .bt-timeline__number {
  transform: rotate(2deg);
  border-radius: 50% 50% 12% 50%;
}

.bt-timeline__line {
  position: absolute;
  z-index: 1;

  top: 38px;
  bottom: -18px;
  left: 50%;

  width: 1px;

  transform: translateX(-50%);

  background: repeating-linear-gradient(
    180deg,
    rgba(156, 91, 63, 0.6) 0 5px,
    transparent 5px 10px
  );
}

/* =========================================================
   CARD
========================================================= */

.bt-timeline__card {
  position: relative;

  padding: 16px 17px 17px;

  border: 1px dashed rgba(156, 91, 63, 0.35);
  border-radius: 20px 20px 20px 6px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(250, 243, 236, 0.75));

  box-shadow: 0 7px 22px rgba(92, 70, 54, 0.07);

  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.bt-timeline__card:hover {
  transform: translateY(-3px) rotate(-0.5deg);

  border-color: rgba(156, 91, 63, 0.55);

  box-shadow: 0 12px 28px rgba(92, 70, 54, 0.12);
}

/* =========================================================
   DATE
========================================================= */

.bt-timeline__date {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  margin-bottom: 8px;

  color: #8a9b7c;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.bt-date-icon {
  width: 25px;
  height: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #c97b5d;

  border-radius: 50% 50% 50% 20%;

  background: rgba(217, 176, 140, 0.35);
}

/* =========================================================
   TITLE
========================================================= */

.bt-timeline__title-row {
  display: flex;
  align-items: center;
  gap: 9px;
}

.bt-timeline__icon {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #c97b5d;

  border: 1px dashed rgba(156, 91, 63, 0.4);
  border-radius: 50% 50% 20% 50%;

  background: linear-gradient(145deg, #fffbf5, #f2e2d0);

  font-size: 16px;
}

.bt-timeline__card h3 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 22px;
  font-weight: 600;

  line-height: 1.2;

  color: #9c5b3f;
}

/* =========================================================
   DESCRIPTION
========================================================= */

.bt-timeline__desc {
  margin: 9px 0 0;

  color: #7d6350;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LOCATION
========================================================= */

.bt-timeline__location {
  display: flex;
  align-items: center;
  gap: 5px;

  margin-top: 11px;
  padding-top: 9px;

  border-top: 1px dashed rgba(156, 91, 63, 0.25);

  color: #8a6f5c;

  font-size: 11px;

  line-height: 1.4;
}

.bt-timeline__location .v-icon {
  color: #c97b5d;

  flex: 0 0 auto;
}

/* =========================================================
   FOOTER
========================================================= */

.bt-timeline__footer {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 27px;

  color: #c97b5d;
}

.bt-timeline__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(156, 91, 63, 0.55));
}

.bt-timeline__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .bt-timeline {
    width: calc(100% - 16px);

    margin: 20px auto;

    padding: 32px 12px 27px;
  }

  .bt-timeline__header {
    margin-bottom: 25px;
  }

  .bt-timeline__header h2 {
    font-size: 29px;
  }

  .bt-timeline__intro {
    padding: 0 10px;

    font-size: 12px;
  }

  .bt-timeline__item {
    grid-template-columns: 39px 1fr;
    gap: 9px;

    margin-bottom: 14px;
  }

  .bt-timeline__number {
    width: 32px;
    height: 32px;

    font-size: 13px;
  }

  .bt-timeline__line {
    top: 32px;

    bottom: -14px;
  }

  .bt-timeline__card {
    padding: 13px 13px 14px;

    border-radius: 16px 16px 16px 5px;
  }

  .bt-timeline__date {
    margin-bottom: 7px;

    font-size: 8px;
  }

  .bt-date-icon {
    width: 23px;
    height: 23px;
  }

  .bt-timeline__icon {
    width: 31px;
    height: 31px;

    font-size: 14px;
  }

  .bt-timeline__card h3 {
    font-size: 20px;
  }

  .bt-timeline__desc {
    margin-top: 8px;

    font-size: 12px;

    line-height: 1.6;
  }

  .bt-timeline__location {
    margin-top: 9px;
    padding-top: 8px;

    font-size: 10px;
  }
}

@media (max-width: 380px) {
  .bt-timeline {
    padding-left: 9px;
    padding-right: 9px;
  }

  .bt-timeline__item {
    grid-template-columns: 34px 1fr;
    gap: 7px;
  }

  .bt-timeline__number {
    width: 29px;
    height: 29px;

    font-size: 12px;
  }

  .bt-timeline__line {
    top: 29px;
  }

  .bt-timeline__card {
    padding: 12px;
  }

  .bt-timeline__card h3 {
    font-size: 18px;
  }

  .bt-timeline__icon {
    width: 29px;
    height: 29px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .bt-timeline__card {
    transition: none;
  }
}
</style>
