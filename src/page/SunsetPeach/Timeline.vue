<template>
  <section class="sp-timeline">
    <div class="sp-timeline__header">
      <p class="sp-eyebrow">DẤU MỐC YÊU THƯƠNG</p>

      <h2>Hành trình của chúng mình</h2>

      <p class="sp-timeline__intro">
        Những khoảnh khắc đặc biệt đã đưa chúng mình đến ngày hôm nay
      </p>
    </div>

    <ol class="sp-timeline__list">
      <li v-for="(item, index) in items" :key="item.Id || index" class="sp-timeline__item">
        <div class="sp-timeline__side">
          <div class="sp-timeline__number">
            {{ String(index + 1).padStart(2, "0") }}
          </div>

          <div v-if="index < items.length - 1" class="sp-timeline__line"></div>
        </div>

        <article class="sp-timeline__card">
          <div class="sp-timeline__date">
            <span class="sp-date-icon">
              <v-icon size="14">mdi-calendar-heart</v-icon>
            </span>

            <time>{{ item.Time || item.Date || formatTime(index) }}</time>
          </div>

          <div class="sp-timeline__title-row">
            <div class="sp-timeline__icon">{{ item.Icon || "❁" }}</div>

            <h3>{{ item.Title || item.Name || "Một dấu mốc đặc biệt" }}</h3>
          </div>

          <p v-if="item.Description || item.Content" class="sp-timeline__desc">
            {{ item.Description || item.Content }}
          </p>

          <div v-if="item.Location" class="sp-timeline__location">
            <v-icon size="14">mdi-map-marker-outline</v-icon>
            <span>{{ item.Location }}</span>
          </div>
        </article>
      </li>
    </ol>

    <div class="sp-timeline__footer">
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
.sp-timeline {
  position: relative;

  width: min(680px, calc(100% - 24px));

  margin: 30px auto;

  padding: 38px 20px 32px;

  color: #7a4a3d;

  border: 1px solid rgba(224, 163, 126, 0.45);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.7), rgba(255, 242, 232, 0.5));

  box-shadow: 0 12px 35px rgba(122, 74, 61, 0.08);

  overflow: hidden;
}

.sp-timeline::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(224, 163, 126, 0.25);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.sp-timeline__header {
  position: relative;

  text-align: center;

  margin-bottom: 30px;
}

.sp-eyebrow {
  margin: 0;

  color: #d67a63;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.sp-timeline__header h2 {
  margin: 6px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 36px);
  font-weight: 600;

  line-height: 1.1;

  color: #7a4a3d;
}

.sp-timeline__intro {
  max-width: 440px;

  margin: 0 auto;

  color: #a3806f;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LIST
========================================================= */

.sp-timeline__list {
  position: relative;

  margin: 0;
  padding: 0;

  list-style: none;
}

.sp-timeline__item {
  position: relative;

  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 14px;

  margin-bottom: 18px;
}

.sp-timeline__item:last-child {
  margin-bottom: 0;
}

/* =========================================================
   SIDE
========================================================= */

.sp-timeline__side {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.sp-timeline__number {
  position: relative;
  z-index: 3;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #7a4a3d;

  border: 1px solid rgba(224, 163, 126, 0.55);
  border-radius: 50%;

  background: linear-gradient(145deg, #fffdfc, #fdeee4);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 15px;
  font-weight: 700;

  box-shadow: 0 5px 14px rgba(122, 74, 61, 0.1);
}

.sp-timeline__line {
  position: absolute;
  z-index: 1;

  top: 38px;
  bottom: -18px;
  left: 50%;

  width: 1px;

  transform: translateX(-50%);

  background: linear-gradient(180deg, rgba(224, 163, 126, 0.65), rgba(224, 163, 126, 0.15));
}

/* =========================================================
   CARD
========================================================= */

.sp-timeline__card {
  position: relative;

  padding: 16px 17px 17px;

  border: 1px solid rgba(214, 122, 99, 0.3);
  border-radius: 18px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(255, 242, 232, 0.75));

  box-shadow: 0 7px 22px rgba(122, 74, 61, 0.06);

  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.sp-timeline__card:hover {
  transform: translateY(-3px);

  border-color: rgba(224, 163, 126, 0.55);

  box-shadow: 0 12px 28px rgba(122, 74, 61, 0.1);
}

/* =========================================================
   DATE
========================================================= */

.sp-timeline__date {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  margin-bottom: 8px;

  color: #d67a63;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.sp-date-icon {
  width: 25px;
  height: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #d67a63;

  border-radius: 50%;

  background: rgba(244, 198, 169, 0.5);
}

/* =========================================================
   TITLE
========================================================= */

.sp-timeline__title-row {
  display: flex;
  align-items: center;
  gap: 9px;
}

.sp-timeline__icon {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #d67a63;

  border: 1px solid rgba(224, 163, 126, 0.4);
  border-radius: 50%;

  background: linear-gradient(145deg, #fff, #fdeee4);

  font-size: 16px;
}

.sp-timeline__card h3 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 22px;
  font-weight: 600;

  line-height: 1.2;

  color: #7a4a3d;
}

/* =========================================================
   DESCRIPTION
========================================================= */

.sp-timeline__desc {
  margin: 9px 0 0;

  color: #8a6353;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LOCATION
========================================================= */

.sp-timeline__location {
  display: flex;
  align-items: center;
  gap: 5px;

  margin-top: 11px;
  padding-top: 9px;

  border-top: 1px solid rgba(224, 163, 126, 0.25);

  color: #a3806f;

  font-size: 11px;

  line-height: 1.4;
}

.sp-timeline__location .v-icon {
  color: #d67a63;

  flex: 0 0 auto;
}

/* =========================================================
   FOOTER
========================================================= */

.sp-timeline__footer {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 27px;

  color: #e0a37e;
}

.sp-timeline__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(224, 163, 126, 0.55));
}

.sp-timeline__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .sp-timeline {
    width: calc(100% - 16px);

    margin: 20px auto;

    padding: 32px 12px 27px;

    border-radius: 23px;
  }

  .sp-timeline::before {
    inset: 6px;

    border-radius: 18px;
  }

  .sp-timeline__header {
    margin-bottom: 25px;
  }

  .sp-timeline__header h2 {
    font-size: 29px;
  }

  .sp-timeline__intro {
    padding: 0 10px;

    font-size: 12px;
  }

  .sp-timeline__item {
    grid-template-columns: 39px 1fr;
    gap: 9px;

    margin-bottom: 14px;
  }

  .sp-timeline__number {
    width: 32px;
    height: 32px;

    font-size: 13px;
  }

  .sp-timeline__line {
    top: 32px;

    bottom: -14px;
  }

  .sp-timeline__card {
    padding: 13px 13px 14px;

    border-radius: 15px;
  }

  .sp-timeline__date {
    margin-bottom: 7px;

    font-size: 8px;
  }

  .sp-date-icon {
    width: 23px;
    height: 23px;
  }

  .sp-timeline__icon {
    width: 31px;
    height: 31px;

    font-size: 14px;
  }

  .sp-timeline__card h3 {
    font-size: 20px;
  }

  .sp-timeline__desc {
    margin-top: 8px;

    font-size: 12px;

    line-height: 1.6;
  }

  .sp-timeline__location {
    margin-top: 9px;
    padding-top: 8px;

    font-size: 10px;
  }
}

@media (max-width: 380px) {
  .sp-timeline {
    padding-left: 9px;
    padding-right: 9px;
  }

  .sp-timeline__item {
    grid-template-columns: 34px 1fr;
    gap: 7px;
  }

  .sp-timeline__number {
    width: 29px;
    height: 29px;

    font-size: 12px;
  }

  .sp-timeline__line {
    top: 29px;
  }

  .sp-timeline__card {
    padding: 12px;
  }

  .sp-timeline__card h3 {
    font-size: 18px;
  }

  .sp-timeline__icon {
    width: 29px;
    height: 29px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .sp-timeline__card {
    transition: none;
  }
}
</style>
