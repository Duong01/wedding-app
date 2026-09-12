<template>
  <section class="vs-timeline">
    <div class="vs-timeline__header">
      <p class="vs-eyebrow">DẤU MỐC YÊU THƯƠNG</p>

      <h2>Hành trình của chúng mình</h2>

      <p class="vs-timeline__intro">
        Những khoảnh khắc đặc biệt đã đưa chúng mình đến ngày hôm nay
      </p>
    </div>

    <ol class="vs-timeline__list">
      <li v-for="(item, index) in items" :key="item.Id || index" class="vs-timeline__item">
        <div class="vs-timeline__side">
          <div class="vs-timeline__number">
            {{ String(index + 1).padStart(2, "0") }}
          </div>

          <div v-if="index < items.length - 1" class="vs-timeline__line"></div>
        </div>

        <article class="vs-timeline__card">
          <div class="vs-timeline__date">
            <span class="vs-date-icon">
              <v-icon size="14">mdi-calendar-heart</v-icon>
            </span>

            <time>{{ item.Time || item.Date || formatTime(index) }}</time>
          </div>

          <div class="vs-timeline__title-row">
            <div class="vs-timeline__icon">{{ item.Icon || "❦" }}</div>

            <h3>{{ item.Title || item.Name || "Một dấu mốc đặc biệt" }}</h3>
          </div>

          <p v-if="item.Description || item.Content" class="vs-timeline__desc">
            {{ item.Description || item.Content }}
          </p>

          <div v-if="item.Location" class="vs-timeline__location">
            <v-icon size="14">mdi-map-marker-outline</v-icon>
            <span>{{ item.Location }}</span>
          </div>
        </article>
      </li>
    </ol>

    <div class="vs-timeline__footer">
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
.vs-timeline {
  position: relative;

  width: min(680px, calc(100% - 24px));

  margin: 30px auto;

  padding: 38px 20px 32px;

  color: #6b4f3a;

  border: 1px solid rgba(107, 79, 58, 0.4);
  border-radius: 10px;

  background: #fbf5e6;

  box-shadow: 0 12px 35px rgba(61, 47, 36, 0.1);

  overflow: hidden;
}

.vs-timeline::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px dashed rgba(107, 79, 58, 0.28);
  border-radius: 6px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.vs-timeline__header {
  position: relative;

  text-align: center;

  margin-bottom: 30px;
}

.vs-eyebrow {
  margin: 0;

  color: #97745a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.vs-timeline__header h2 {
  margin: 6px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 36px);
  font-weight: 600;

  line-height: 1.1;

  color: #4a3a2c;
}

.vs-timeline__intro {
  max-width: 440px;

  margin: 0 auto;

  color: #97745a;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LIST
========================================================= */

.vs-timeline__list {
  position: relative;

  margin: 0;
  padding: 0;

  list-style: none;
}

.vs-timeline__item {
  position: relative;

  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 14px;

  margin-bottom: 18px;
}

.vs-timeline__item:last-child {
  margin-bottom: 0;
}

/* =========================================================
   SIDE
========================================================= */

.vs-timeline__side {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.vs-timeline__number {
  position: relative;
  z-index: 3;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #ead9bd;

  border: 1px solid #2c211a;
  border-radius: 46% 54% 50% 50% / 53% 47% 55% 45%;

  background: radial-gradient(circle at 34% 28%, #8a6a4f, #6b4f3a 55%, #4a3a2c 100%);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 15px;
  font-weight: 700;

  box-shadow: 0 5px 14px rgba(61, 47, 36, 0.25);
}

.vs-timeline__line {
  position: absolute;
  z-index: 1;

  top: 38px;
  bottom: -18px;
  left: 50%;

  width: 1px;

  transform: translateX(-50%);

  background: linear-gradient(180deg, rgba(107, 79, 58, 0.55), rgba(107, 79, 58, 0.12));
}

/* =========================================================
   CARD
========================================================= */

.vs-timeline__card {
  position: relative;

  padding: 16px 17px 17px;

  border: 1px solid rgba(107, 79, 58, 0.3);
  border-radius: 8px;

  background: rgba(255, 253, 246, 0.85);

  box-shadow: 0 7px 22px rgba(61, 47, 36, 0.07);

  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.vs-timeline__card:hover {
  transform: translateY(-3px);

  border-color: rgba(107, 79, 58, 0.5);

  box-shadow: 0 12px 28px rgba(61, 47, 36, 0.12);
}

/* =========================================================
   DATE
========================================================= */

.vs-timeline__date {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  margin-bottom: 8px;

  color: #97745a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.vs-date-icon {
  width: 25px;
  height: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #97745a;

  border-radius: 50%;

  background: rgba(194, 168, 120, 0.3);
}

/* =========================================================
   TITLE
========================================================= */

.vs-timeline__title-row {
  display: flex;
  align-items: center;
  gap: 9px;
}

.vs-timeline__icon {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #97745a;

  border: 1px solid rgba(107, 79, 58, 0.35);
  border-radius: 50%;

  background: rgba(255, 253, 246, 0.9);

  font-size: 16px;
}

.vs-timeline__card h3 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 22px;
  font-weight: 600;

  line-height: 1.2;

  color: #4a3a2c;
}

/* =========================================================
   DESCRIPTION
========================================================= */

.vs-timeline__desc {
  margin: 9px 0 0;

  color: #6b4f3a;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LOCATION
========================================================= */

.vs-timeline__location {
  display: flex;
  align-items: center;
  gap: 5px;

  margin-top: 11px;
  padding-top: 9px;

  border-top: 1px dashed rgba(107, 79, 58, 0.25);

  color: #97745a;

  font-size: 11px;

  line-height: 1.4;
}

.vs-timeline__location .v-icon {
  color: #97745a;

  flex: 0 0 auto;
}

/* =========================================================
   FOOTER
========================================================= */

.vs-timeline__footer {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 27px;

  color: #c2a878;
}

.vs-timeline__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(107, 79, 58, 0.5));
}

.vs-timeline__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .vs-timeline {
    width: calc(100% - 16px);

    margin: 20px auto;

    padding: 32px 12px 27px;
  }

  .vs-timeline::before {
    inset: 6px;
  }

  .vs-timeline__header {
    margin-bottom: 25px;
  }

  .vs-timeline__header h2 {
    font-size: 29px;
  }

  .vs-timeline__intro {
    padding: 0 10px;

    font-size: 12px;
  }

  .vs-timeline__item {
    grid-template-columns: 39px 1fr;
    gap: 9px;

    margin-bottom: 14px;
  }

  .vs-timeline__number {
    width: 32px;
    height: 32px;

    font-size: 13px;
  }

  .vs-timeline__line {
    top: 32px;

    bottom: -14px;
  }

  .vs-timeline__card {
    padding: 13px 13px 14px;
  }

  .vs-timeline__date {
    margin-bottom: 7px;

    font-size: 8px;
  }

  .vs-date-icon {
    width: 23px;
    height: 23px;
  }

  .vs-timeline__icon {
    width: 31px;
    height: 31px;

    font-size: 14px;
  }

  .vs-timeline__card h3 {
    font-size: 20px;
  }

  .vs-timeline__desc {
    margin-top: 8px;

    font-size: 12px;

    line-height: 1.6;
  }

  .vs-timeline__location {
    margin-top: 9px;
    padding-top: 8px;

    font-size: 10px;
  }
}

@media (max-width: 380px) {
  .vs-timeline {
    padding-left: 9px;
    padding-right: 9px;
  }

  .vs-timeline__item {
    grid-template-columns: 34px 1fr;
    gap: 7px;
  }

  .vs-timeline__number {
    width: 29px;
    height: 29px;

    font-size: 12px;
  }

  .vs-timeline__line {
    top: 29px;
  }

  .vs-timeline__card {
    padding: 12px;
  }

  .vs-timeline__card h3 {
    font-size: 18px;
  }

  .vs-timeline__icon {
    width: 29px;
    height: 29px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .vs-timeline__card {
    transition: none;
  }
}
</style>
