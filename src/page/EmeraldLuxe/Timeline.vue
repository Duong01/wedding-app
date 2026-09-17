<template>
  <section class="el-timeline">
    <div class="el-timeline__header">
      <p class="el-eyebrow">DẤU MỐC YÊU THƯƠNG</p>

      <h2>Hành trình của chúng mình</h2>

      <p class="el-timeline__intro">
        Những khoảnh khắc đặc biệt đã đưa chúng mình đến ngày hôm nay
      </p>
    </div>

    <ol class="el-timeline__list">
      <li v-for="(item, index) in items" :key="item.Id || index" class="el-timeline__item">
        <div class="el-timeline__side">
          <div class="el-timeline__number">
            {{ String(index + 1).padStart(2, "0") }}
          </div>

          <div v-if="index < items.length - 1" class="el-timeline__line"></div>
        </div>

        <article class="el-timeline__card">
          <div class="el-timeline__date">
            <span class="el-date-icon">
              <v-icon size="14">mdi-calendar-heart</v-icon>
            </span>

            <time>{{ item.Time || item.Date || formatTime(index) }}</time>
          </div>

          <div class="el-timeline__title-row">
            <div class="el-timeline__icon">{{ item.Icon || "❦" }}</div>

            <h3>{{ item.Title || item.Name || "Một dấu mốc đặc biệt" }}</h3>
          </div>

          <p v-if="item.Description || item.Content" class="el-timeline__desc">
            {{ item.Description || item.Content }}
          </p>

          <div v-if="item.Location" class="el-timeline__location">
            <v-icon size="14">mdi-map-marker-outline</v-icon>
            <span>{{ item.Location }}</span>
          </div>
        </article>
      </li>
    </ol>

    <div class="el-timeline__footer">
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
.el-timeline {
  position: relative;

  width: min(680px, calc(100% - 24px));

  margin: 30px auto;

  padding: 38px 20px 32px;

  color: #2e3d36;

  border: 1px solid rgba(201, 164, 92, 0.55);
  border-radius: 60% 60% 28px 28px / 14% 14% 28px 28px;

  background: linear-gradient(172deg, rgba(255, 255, 255, 0.78), rgba(240, 234, 216, 0.55));

  box-shadow: 0 12px 35px rgba(12, 43, 33, 0.09);

  overflow: hidden;
}

/* Fine gold lattice texture */
.el-timeline::before {
  content: "";
  position: absolute;
  inset: 0;

  opacity: 0.05;

  background-image:
    repeating-linear-gradient(45deg, rgba(201, 164, 92, 0.7) 0 1px, transparent 1px 18px),
    repeating-linear-gradient(-45deg, rgba(201, 164, 92, 0.7) 0 1px, transparent 1px 18px);

  pointer-events: none;
}

/* =========================================================
   HEADER
========================================================= */

.el-timeline__header {
  position: relative;

  text-align: center;

  margin-bottom: 30px;
}

.el-eyebrow {
  margin: 0;

  color: #8a7a52;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.el-timeline__header h2 {
  margin: 6px 0;

  font-family: "Playfair Display", Georgia, serif;

  font-size: clamp(28px, 7vw, 36px);
  font-weight: 600;

  line-height: 1.1;

  color: #123b2e;
}

.el-timeline__intro {
  max-width: 440px;

  margin: 0 auto;

  color: #6b7a70;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LIST
========================================================= */

.el-timeline__list {
  position: relative;

  margin: 0;
  padding: 0;

  list-style: none;
}

.el-timeline__item {
  position: relative;

  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 14px;

  margin-bottom: 18px;
}

.el-timeline__item:last-child {
  margin-bottom: 0;
}

/* =========================================================
   SIDE — numbered circles + connecting line
========================================================= */

.el-timeline__side {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.el-timeline__number {
  position: relative;
  z-index: 3;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #10281f;

  border: 1px solid rgba(201, 164, 92, 0.8);
  border-radius: 50%;

  background: linear-gradient(145deg, #e8d3a2, #c9a45c);

  font-family: "Playfair Display", Georgia, serif;

  font-size: 15px;
  font-weight: 700;

  box-shadow: 0 5px 14px rgba(201, 164, 92, 0.3);
}

.el-timeline__line {
  position: absolute;
  z-index: 1;

  top: 38px;
  bottom: -18px;
  left: 50%;

  width: 1px;

  transform: translateX(-50%);

  background: repeating-linear-gradient(
    180deg,
    rgba(201, 164, 92, 0.7) 0 5px,
    transparent 5px 10px
  );
}

/* =========================================================
   CARD
========================================================= */

.el-timeline__card {
  position: relative;

  padding: 16px 17px 17px;

  border: 1px solid rgba(201, 164, 92, 0.4);
  border-radius: 20px 20px 20px 6px;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(247, 241, 227, 0.78));

  box-shadow: 0 7px 22px rgba(12, 43, 33, 0.07);

  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.el-timeline__card:hover {
  transform: translateY(-3px);

  border-color: rgba(201, 164, 92, 0.7);

  box-shadow: 0 12px 28px rgba(12, 43, 33, 0.12);
}

/* =========================================================
   DATE
========================================================= */

.el-timeline__date {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  margin-bottom: 8px;

  color: #8a7a52;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.el-date-icon {
  width: 25px;
  height: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #c9a45c;

  border-radius: 50%;

  background: rgba(201, 164, 92, 0.2);
}

/* =========================================================
   TITLE
========================================================= */

.el-timeline__title-row {
  display: flex;
  align-items: center;
  gap: 9px;
}

.el-timeline__icon {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #c9a45c;

  border: 1px solid rgba(201, 164, 92, 0.5);
  border-radius: 50%;

  background: linear-gradient(145deg, #fdfaf2, #efe9d6);

  font-size: 16px;
}

.el-timeline__card h3 {
  margin: 0;

  font-family: "Playfair Display", Georgia, serif;

  font-size: 22px;
  font-weight: 600;

  line-height: 1.2;

  color: #123b2e;
}

/* =========================================================
   DESCRIPTION
========================================================= */

.el-timeline__desc {
  margin: 9px 0 0;

  color: #55645b;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LOCATION
========================================================= */

.el-timeline__location {
  display: flex;
  align-items: center;
  gap: 5px;

  margin-top: 11px;
  padding-top: 9px;

  border-top: 1px solid rgba(201, 164, 92, 0.3);

  color: #6b7a70;

  font-size: 11px;

  line-height: 1.4;
}

.el-timeline__location .v-icon {
  color: #c9a45c;

  flex: 0 0 auto;
}

/* =========================================================
   FOOTER
========================================================= */

.el-timeline__footer {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 27px;

  color: #c9a45c;
}

.el-timeline__footer span {
  width: 55px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 164, 92, 0.7));
}

.el-timeline__footer span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .el-timeline {
    width: calc(100% - 16px);

    margin: 20px auto;

    padding: 32px 12px 27px;
  }

  .el-timeline__header {
    margin-bottom: 25px;
  }

  .el-timeline__header h2 {
    font-size: 29px;
  }

  .el-timeline__intro {
    padding: 0 10px;

    font-size: 12px;
  }

  .el-timeline__item {
    grid-template-columns: 39px 1fr;
    gap: 9px;

    margin-bottom: 14px;
  }

  .el-timeline__number {
    width: 32px;
    height: 32px;

    font-size: 13px;
  }

  .el-timeline__line {
    top: 32px;

    bottom: -14px;
  }

  .el-timeline__card {
    padding: 13px 13px 14px;

    border-radius: 16px 16px 16px 5px;
  }

  .el-timeline__date {
    margin-bottom: 7px;

    font-size: 8px;
  }

  .el-date-icon {
    width: 23px;
    height: 23px;
  }

  .el-timeline__icon {
    width: 31px;
    height: 31px;

    font-size: 14px;
  }

  .el-timeline__card h3 {
    font-size: 20px;
  }

  .el-timeline__desc {
    margin-top: 8px;

    font-size: 12px;

    line-height: 1.6;
  }

  .el-timeline__location {
    margin-top: 9px;
    padding-top: 8px;

    font-size: 10px;
  }
}

@media (max-width: 380px) {
  .el-timeline {
    padding-left: 9px;
    padding-right: 9px;
  }

  .el-timeline__item {
    grid-template-columns: 34px 1fr;
    gap: 7px;
  }

  .el-timeline__number {
    width: 29px;
    height: 29px;

    font-size: 12px;
  }

  .el-timeline__line {
    top: 29px;
  }

  .el-timeline__card {
    padding: 12px;
  }

  .el-timeline__card h3 {
    font-size: 18px;
  }

  .el-timeline__icon {
    width: 29px;
    height: 29px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .el-timeline__card {
    transition: none;
  }
}
</style>
