<template>
  <section class="tdx-timeline">
    <!-- =====================================================
         HOẠ TIẾT NỀN
    ====================================================== -->

    <div class="tdx-timeline__decor" aria-hidden="true">
      <img
        :src="lineDecoration"
        alt=""
        class="tdx-decor tdx-decor--line-right"
        draggable="false"
      />

      <img
        :src="flowerDecoration"
        alt=""
        class="tdx-decor tdx-decor--flower-right"
        draggable="false"
      />

      <img
        :src="ribbonDecoration"
        alt=""
        class="tdx-decor tdx-decor--ribbon"
        draggable="false"
      />
    </div>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="tdx-timeline__inner">
      <h2 class="tdx-heading">LỊCH TRÌNH NGÀY CƯỚI</h2>

      <ol class="tdx-timeline__list">
        <li
          v-for="(item, index) in items"
          :key="item.Id || index"
          class="tdx-timeline__item"
        >
          <!-- MỐC THỜI GIAN -->
          <div class="tdx-timeline__time">
            <img
              v-if="iconFor(index)"
              :src="iconFor(index)"
              alt=""
              class="tdx-timeline__icon"
              draggable="false"
            />

            <span>{{ item.Time || item.Date || formatTime(index) }}</span>
          </div>

          <!-- TRỤC -->
          <div class="tdx-timeline__axis" aria-hidden="true">
            <span class="tdx-timeline__dot"></span>

            <span v-if="index < items.length - 1" class="tdx-timeline__line"></span>
          </div>

          <!-- MÔ TẢ -->
          <div class="tdx-timeline__body">
            <h3>{{ item.Title || item.Name || "Một dấu mốc đặc biệt" }}</h3>

            <p v-if="item.Description || item.Content">
              {{ item.Description || item.Content }}
            </p>

            <p v-if="item.Location" class="tdx-timeline__location">
              {{ item.Location }}
            </p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import {
  flowerDecoration,
  iconCake,
  iconHome,
  iconMusic,
  lineDecoration,
  ribbonDecoration,
} from "./toDuyenXanhAssets";

const props = defineProps({
  timeline: { type: Array, default: () => [] },
  events: { type: Array, default: () => [] },
});

const items = computed(() => props.timeline || []);

const icons = [iconCake, iconHome, iconMusic];

function iconFor(index) {
  return icons[index % icons.length];
}

function formatTime(index) {
  return `MỐC ${String(index + 1).padStart(2, "0")}`;
}
</script>

<style scoped>
.tdx-timeline {
  --tdx-bg: var(--background, #fefbf4);
  --tdx-ink: var(--text, #1a3500);
  --tdx-green: var(--primary, #5e813c);
  --tdx-line: var(--accent, #d1db9c);

  position: relative;
  isolation: isolate;

  overflow: hidden;

  color: var(--tdx-ink);

  background-color: var(--tdx-bg);
}

/* =========================================================
   HOẠ TIẾT NỀN
========================================================= */

.tdx-timeline__decor {
  position: absolute;
  inset: 0;
  z-index: -1;

  pointer-events: none;
}

.tdx-decor {
  position: absolute;

  max-width: none;

  object-fit: cover;

  pointer-events: none;
}

.tdx-decor--line-right {
  top: 60px;
  right: -70px;

  width: 198px;
  height: 420px;

  transform: rotate(-177.25deg);
}

.tdx-decor--flower-right {
  top: 30px;
  right: -80px;

  width: 190px;
  height: 190px;

  object-fit: contain;

  transform: scaleX(-1) rotate(50deg);
}

.tdx-decor--ribbon {
  bottom: -10px;
  left: -365px;

  width: 700px;
  height: 155px;

  object-fit: contain;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.tdx-timeline__inner {
  position: relative;
  z-index: 2;

  width: min(100%, 441px);

  margin: 0 auto;

  padding: 2.5% 10% 22%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;

  text-align: start;
}

.tdx-heading {
  margin: 0;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-transform: uppercase;
}

/* =========================================================
   DANH SÁCH
========================================================= */

.tdx-timeline__list {
  width: 100%;

  margin: 0;
  padding: 0;

  list-style: none;
}

.tdx-timeline__item {
  display: grid;
  grid-template-columns: 74px 18px 1fr;
  gap: 0 10px;
}

/* =========================================================
   MỐC THỜI GIAN
========================================================= */

.tdx-timeline__time {
  display: flex;
  align-items: center;
  gap: 6px;

  padding-top: 2px;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 12px;
  font-weight: 700;

  letter-spacing: 0.04em;

  white-space: nowrap;
}

.tdx-timeline__icon {
  width: 18px;
  height: 18px;

  flex: 0 0 auto;

  object-fit: contain;
}

/* =========================================================
   TRỤC
========================================================= */

.tdx-timeline__axis {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.tdx-timeline__dot {
  width: 9px;
  height: 9px;

  margin-top: 5px;

  flex: 0 0 auto;

  border-radius: 50%;

  background: var(--tdx-green);
}

.tdx-timeline__line {
  width: 1px;

  flex: 1 1 auto;

  margin: 4px 0;

  background: var(--tdx-line);
}

/* =========================================================
   MÔ TẢ
========================================================= */

.tdx-timeline__body {
  padding-bottom: 22px;
}

.tdx-timeline__item:last-child .tdx-timeline__body {
  padding-bottom: 0;
}

.tdx-timeline__body h3 {
  margin: 0;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 15px;
  font-weight: 700;

  line-height: 1.3;

  text-transform: uppercase;
}

.tdx-timeline__body p {
  margin: 5px 0 0;

  color: var(--tdx-ink);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 12px;

  line-height: 1.55;
}

.tdx-timeline__location {
  color: var(--tdx-green) !important;

  font-style: italic;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tdx-timeline__inner {
    width: min(100%, 600px);

    padding: 2.5% 5px 22%;

    gap: 28px;
  }

  .tdx-decor--line-right {
    top: 80px;
    left: -150px;
    right: auto;

    width: 158px;
    height: 560px;
  }

  .tdx-decor--flower-right {
    top: 20px;
    left: -300px;
    right: auto;

    width: 420px;
    height: 420px;
  }

  .tdx-decor--ribbon {
    bottom: 20px;
    left: -538px;

    width: 1403px;
    height: 246px;
  }

  .tdx-heading {
    font-size: 27px;
  }

  .tdx-timeline__item {
    grid-template-columns: 104px 22px 1fr;
    gap: 0 14px;
  }

  .tdx-timeline__time {
    font-size: 16px;
  }

  .tdx-timeline__icon {
    width: 24px;
    height: 24px;
  }

  .tdx-timeline__dot {
    width: 11px;
    height: 11px;

    margin-top: 6px;
  }

  .tdx-timeline__body {
    padding-bottom: 30px;
  }

  .tdx-timeline__body h3 {
    font-size: 20px;
  }

  .tdx-timeline__body p {
    font-size: 16px;
  }
}
</style>
