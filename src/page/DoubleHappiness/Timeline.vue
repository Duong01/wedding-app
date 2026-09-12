<template>
  <section class="dh-timeline">
    <div class="dh-timeline__header">
      <p class="dh-eyebrow">DẤU MỐC YÊU THƯƠNG</p>

      <h2>Hành trình của chúng mình</h2>

      <p class="dh-timeline__intro">
        Những khoảnh khắc đặc biệt đã đưa chúng mình đến ngày hôm nay
      </p>
    </div>

    <ol class="dh-timeline__list">
      <li v-for="(item, index) in items" :key="item.Id || index" class="dh-timeline__item">
        <div class="dh-timeline__side">
          <div class="dh-timeline__number">
            {{ String(index + 1).padStart(2, "0") }}
          </div>

          <div v-if="index < items.length - 1" class="dh-timeline__line"></div>
        </div>

        <article class="dh-timeline__card">
          <div class="dh-timeline__date">
            <span class="dh-date-icon">
              <v-icon size="14">mdi-calendar-heart</v-icon>
            </span>

            <time>{{ item.Time || item.Date || formatTime(index) }}</time>
          </div>

          <div class="dh-timeline__title-row">
            <div class="dh-timeline__icon">{{ item.Icon || "囍" }}</div>

            <h3>{{ item.Title || item.Name || "Một dấu mốc đặc biệt" }}</h3>
          </div>

          <p v-if="item.Description || item.Content" class="dh-timeline__desc">
            {{ item.Description || item.Content }}
          </p>

          <div v-if="item.Location" class="dh-timeline__location">
            <v-icon size="14">mdi-map-marker-outline</v-icon>
            <span>{{ item.Location }}</span>
          </div>
        </article>
      </li>
    </ol>

    <div class="dh-timeline__footer">
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
.dh-timeline {
  --dh-red: #7a1216;
  --dh-red-bright: #a32a2a;
  --dh-gold: #d9a441;
  --dh-gold-light: #f3d9a4;
  --dh-cream: #fdf6ec;
  --dh-ink: #5a3d2e;

  position: relative;

  width: min(680px, calc(100% - 24px));

  margin: 30px auto;

  padding: 38px 20px 32px;

  color: var(--dh-ink);

  border: 1px solid rgba(217, 164, 65, 0.55);
  border-radius: 14px;

  background: linear-gradient(170deg, rgba(253, 246, 236, 0.75), rgba(243, 217, 164, 0.4));

  box-shadow: 0 12px 35px rgba(60, 10, 12, 0.1);

  overflow: hidden;
}

/* Inner gold line — double border frame */
.dh-timeline::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(217, 164, 65, 0.28);
  border-radius: 9px;

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.dh-timeline__header {
  position: relative;

  text-align: center;

  margin-bottom: 30px;
}

.dh-eyebrow {
  margin: 0;

  color: var(--dh-red-bright);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.dh-timeline__header h2 {
  margin: 6px 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(28px, 7vw, 36px);
  font-weight: 600;

  line-height: 1.1;

  color: var(--dh-red);
}

.dh-timeline__intro {
  max-width: 440px;

  margin: 0 auto;

  color: #8a6a52;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LIST
========================================================= */

.dh-timeline__list {
  position: relative;

  margin: 0;
  padding: 0;

  list-style: none;
}

.dh-timeline__item {
  position: relative;

  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 14px;

  margin-bottom: 18px;
}

.dh-timeline__item:last-child {
  margin-bottom: 0;
}

/* =========================================================
   SIDE
========================================================= */

.dh-timeline__side {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.dh-timeline__number {
  position: relative;
  z-index: 3;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--dh-cream);

  border: 1px solid rgba(243, 217, 164, 0.6);
  border-radius: 50%;

  background: linear-gradient(145deg, var(--dh-red-bright), var(--dh-red) 70%, #6a1013);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 15px;
  font-weight: 700;

  box-shadow: 0 5px 14px rgba(60, 10, 12, 0.25);
}

.dh-timeline__line {
  position: absolute;
  z-index: 1;

  top: 38px;
  bottom: -18px;
  left: 50%;

  width: 1px;

  transform: translateX(-50%);

  background: linear-gradient(180deg, rgba(217, 164, 65, 0.7), rgba(217, 164, 65, 0.15));
}

/* =========================================================
   CARD
========================================================= */

.dh-timeline__card {
  position: relative;

  padding: 16px 17px 17px;

  border: 1px solid rgba(217, 164, 65, 0.35);
  border-radius: 12px;

  background: linear-gradient(145deg, rgba(255, 253, 250, 0.92), rgba(253, 246, 236, 0.8));

  box-shadow: 0 7px 22px rgba(60, 10, 12, 0.07);

  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.dh-timeline__card:hover {
  transform: translateY(-3px);

  border-color: rgba(217, 164, 65, 0.6);

  box-shadow: 0 12px 28px rgba(60, 10, 12, 0.12);
}

/* =========================================================
   DATE
========================================================= */

.dh-timeline__date {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  margin-bottom: 8px;

  color: var(--dh-red-bright);

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.dh-date-icon {
  width: 25px;
  height: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--dh-gold);

  border-radius: 50%;

  background: rgba(243, 217, 164, 0.45);
}

/* =========================================================
   TITLE
========================================================= */

.dh-timeline__title-row {
  display: flex;
  align-items: center;
  gap: 9px;
}

.dh-timeline__icon {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--dh-gold);

  border: 1px solid rgba(217, 164, 65, 0.4);
  border-radius: 50%;

  background: linear-gradient(145deg, #fffdf8, var(--dh-gold-light));

  font-size: 15px;
}

.dh-timeline__card h3 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 22px;
  font-weight: 600;

  line-height: 1.2;

  color: var(--dh-red);
}

/* =========================================================
   DESCRIPTION
========================================================= */

.dh-timeline__desc {
  margin: 9px 0 0;

  color: #7d5c46;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LOCATION
========================================================= */

.dh-timeline__location {
  display: flex;
  align-items: center;
  gap: 5px;

  margin-top: 11px;
  padding-top: 9px;

  border-top: 1px solid rgba(217, 164, 65, 0.25);

  color: #8a6a52;

  font-size: 11px;

  line-height: 1.4;
}

.dh-timeline__location .v-icon {
  color: var(--dh-red-bright);

  flex: 0 0 auto;
}

/* =========================================================
   FOOTER
========================================================= */

.dh-timeline__footer {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 27px;

  color: var(--dh-gold);
}

.dh-timeline__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(217, 164, 65, 0.6));
}

.dh-timeline__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .dh-timeline {
    width: calc(100% - 16px);

    margin: 20px auto;

    padding: 32px 12px 27px;

    border-radius: 12px;
  }

  .dh-timeline::before {
    inset: 6px;

    border-radius: 8px;
  }

  .dh-timeline__header {
    margin-bottom: 25px;
  }

  .dh-timeline__header h2 {
    font-size: 29px;
  }

  .dh-timeline__intro {
    padding: 0 10px;

    font-size: 12px;
  }

  .dh-timeline__item {
    grid-template-columns: 39px 1fr;
    gap: 9px;

    margin-bottom: 14px;
  }

  .dh-timeline__number {
    width: 32px;
    height: 32px;

    font-size: 13px;
  }

  .dh-timeline__line {
    top: 32px;

    bottom: -14px;
  }

  .dh-timeline__card {
    padding: 13px 13px 14px;

    border-radius: 10px;
  }

  .dh-timeline__date {
    margin-bottom: 7px;

    font-size: 8px;
  }

  .dh-date-icon {
    width: 23px;
    height: 23px;
  }

  .dh-timeline__icon {
    width: 31px;
    height: 31px;

    font-size: 14px;
  }

  .dh-timeline__card h3 {
    font-size: 20px;
  }

  .dh-timeline__desc {
    margin-top: 8px;

    font-size: 12px;

    line-height: 1.6;
  }

  .dh-timeline__location {
    margin-top: 9px;
    padding-top: 8px;

    font-size: 10px;
  }
}

@media (max-width: 380px) {
  .dh-timeline {
    padding-left: 9px;
    padding-right: 9px;
  }

  .dh-timeline__item {
    grid-template-columns: 34px 1fr;
    gap: 7px;
  }

  .dh-timeline__number {
    width: 29px;
    height: 29px;

    font-size: 12px;
  }

  .dh-timeline__line {
    top: 29px;
  }

  .dh-timeline__card {
    padding: 12px;
  }

  .dh-timeline__card h3 {
    font-size: 18px;
  }

  .dh-timeline__icon {
    width: 29px;
    height: 29px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .dh-timeline__card {
    transition: none;
  }
}
</style>
