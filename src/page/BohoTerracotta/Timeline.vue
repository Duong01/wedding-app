<template>
  <section class="bq-timeline">
    <div class="bq-timeline__inner">
      <h2 class="bq-heading">LỊCH TRÌNH NGÀY CƯỚI</h2>

      <ol class="bq-timeline__list">
        <li
          v-for="(item, index) in items"
          :key="item.Id || index"
          class="bq-timeline__item"
        >
          <span class="bq-timeline__time">
            <img
              v-if="iconFor(index)"
              :src="iconFor(index)"
              alt=""
              aria-hidden="true"
              class="bq-timeline__icon"
              draggable="false"
            />

            {{ item.Time || item.Date || "" }}
          </span>

          <span class="bq-timeline__marker" aria-hidden="true">
            <span
              class="bq-timeline__line"
              :class="{
                'is-first': index === 0,
                'is-last': index === items.length - 1,
              }"
            ></span>

            <span class="bq-timeline__dot"></span>
          </span>

          <span class="bq-timeline__label">
            {{ item.Title || item.Name || "Một dấu mốc đặc biệt" }}
          </span>
        </li>
      </ol>
    </div>

    <img
      :src="goldenLine"
      alt=""
      aria-hidden="true"
      class="bq-timeline__footer-line"
      draggable="false"
    />
  </section>
</template>

<script setup>
import { computed } from "vue";

import { cake, camera, cook, goldenLine } from "./bohoTerracottaAssets";

const props = defineProps({
  timeline: { type: Array, default: () => [] },
  events: { type: Array, default: () => [] },
});

const items = computed(() => props.timeline || []);

/*
 * Mỗi dấu mốc có một biểu tượng riêng: đón khách → máy ảnh,
 * cắt bánh → bánh kem, còn lại → đầu bếp.
 */
const ICONS = [camera, cake, cook];

function iconFor(index) {
  return ICONS[index] || "";
}
</script>

<style scoped>
.bq-timeline {
  position: relative;
  isolation: isolate;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  overflow: hidden;

  text-align: center;

  color: var(--bq-ink);
}

.bq-timeline__inner {
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 13px;

  width: 100%;

  padding: 8px 24px;
}

.bq-heading {
  margin: 0;

  color: var(--bq-accent);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.04em;

  text-transform: uppercase;
}

/* =========================================================
   DANH SÁCH
========================================================= */

.bq-timeline__list {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 16px minmax(0, 1fr);
  align-items: center;
  gap: 32px 24px;

  width: 100%;
  max-width: 460px;

  margin: 0 auto;
  padding: 0;

  list-style: none;

  font-family: "Times New Roman", serif;
}

.bq-timeline__item {
  display: contents;
}

.bq-timeline__time {
  position: relative;

  display: inline-flex;
  align-items: center;
  justify-content: flex-end;

  padding-top: 2px;

  color: var(--bq-accent);

  font-size: 16px;

  letter-spacing: 0.02em;
  line-height: 1.35;

  font-variant-numeric: tabular-nums;
}

.bq-timeline__icon {
  position: absolute;

  top: 50%;
  right: 100%;

  width: auto;
  height: 40px;
  max-width: none;

  margin-right: 30px;

  transform: translateY(-50%);

  object-fit: contain;

  filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.25));
}

/* =========================================================
   ĐƯỜNG NỐI
========================================================= */

.bq-timeline__marker {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  align-self: stretch;
}

.bq-timeline__line {
  position: absolute;
  left: 50%;

  width: 1px;

  transform: translateX(-50%);

  background-color: rgba(var(--bq-accent-rgb), 0.53);
}

.bq-timeline__line {
  top: -32px;
  bottom: -32px;
}

.bq-timeline__line.is-first {
  top: 50%;
}

.bq-timeline__line.is-last {
  bottom: 50%;
}

.bq-timeline__dot {
  position: relative;

  display: block;

  width: 10px;
  height: 10px;

  border-radius: 50%;

  background-color: var(--bq-accent);

  box-shadow: 0 0 0 2px rgba(var(--bq-accent-rgb), 0.13);
}

.bq-timeline__label {
  padding-top: 2px;

  color: var(--bq-accent);

  font-size: 13px;

  line-height: 1.35;

  text-align: left;
}

/* =========================================================
   ĐƯỜNG TRANG TRÍ CUỐI
========================================================= */

.bq-timeline__footer-line {
  position: relative;
  z-index: 1;

  display: block;

  width: 74.5%;
  max-width: 309px;
  height: auto;

  margin: 32px auto 0;

  object-fit: contain;

  filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.25));
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .bq-heading {
    font-size: 24px;
  }

  .bq-timeline__list {
    gap: 40px 32px;
  }

  .bq-timeline__time {
    font-size: 17px;
  }

  .bq-timeline__line {
    top: -40px;
    bottom: -40px;
  }

  .bq-timeline__line.is-first {
    top: 50%;
  }

  .bq-timeline__line.is-last {
    bottom: 50%;
  }

  .bq-timeline__label {
    font-size: 15px;
  }

  .bq-timeline__footer-line {
    max-width: 420px;

    margin-top: 40px;
  }
}
</style>
