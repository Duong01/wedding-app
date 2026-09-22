<template>
  <section class="tr-timeline">
    <h2 class="tr-timeline__title">Lịch trình ngày cưới</h2>

    <ol class="tr-timeline__list">
      <li v-for="(item, index) in items" :key="index" class="tr-timeline__row">
        <span class="tr-timeline__time">{{ item.time }}</span>

        <span class="tr-timeline__axis" aria-hidden="true">
          <span
            class="tr-timeline__line"
            :class="{
              'is-first': index === 0,
              'is-last': index === items.length - 1,
            }"
          ></span>

          <span class="tr-timeline__dot"></span>
        </span>

        <span class="tr-timeline__label">{{ item.title }}</span>
      </li>
    </ol>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  timeline: {
    type: Array,
    default: () => [],
  },
});

/* =========================================================
   CHUẨN HÓA MỐC THỜI GIAN
========================================================= */

const items = computed(() =>
  (props.timeline || [])
    .map((entry) => {
      const raw = entry?.Time || entry?.time || "";

      return {
        time: raw ? String(raw).slice(0, 5) : "",
        title: entry?.Title || entry?.title || "",
      };
    })
    .filter((entry) => entry.time || entry.title)
);
</script>

<style scoped>
/* =========================================================
   SECTION
========================================================= */

.tr-timeline {
  position: relative;

  z-index: 10;

  display: flex;

  flex-direction: column;

  gap: 24px;

  padding: 0 16px;

  margin-top: 40px;
  margin-bottom: 40px;
}

.tr-timeline__title {
  margin: 0;

  text-align: center;

  text-transform: uppercase;

  color: #ffe3b1;

  font-family: "Times New Roman", Times, serif;

  font-size: 20px;

  font-weight: 700;

  letter-spacing: 0.05em;
}

/* =========================================================
   DANH SÁCH
========================================================= */

.tr-timeline__list {
  display: grid;

  grid-template-columns: minmax(0, 1fr) 16px minmax(0, 1fr);

  align-items: center;

  column-gap: 24px;

  row-gap: 32px;

  width: 100%;
  max-width: 460px;

  margin: 0 auto;

  padding: 0;

  list-style: none;

  font-family: "Baskerville", "Times New Roman", serif;
}

.tr-timeline__row {
  display: contents;
}

.tr-timeline__time {
  padding-top: 2px;

  text-align: right;

  color: #ffe3b1;

  font-size: 16px;

  letter-spacing: 0.02em;

  line-height: 1.35;

  font-variant-numeric: tabular-nums;
}

.tr-timeline__label {
  padding-top: 2px;

  text-align: left;

  color: #ffe3b1;

  font-size: 17px;

  font-weight: 500;

  line-height: 1.35;
}

/* =========================================================
   TRỤC
========================================================= */

.tr-timeline__axis {
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  align-self: stretch;
}

.tr-timeline__line {
  position: absolute;

  left: 50%;

  width: 1px;

  top: -32px;
  bottom: -32px;

  transform: translateX(-50%);

  background-color: color-mix(in srgb, #ffe3b1 40%, transparent);
}

.tr-timeline__line.is-first {
  top: 50%;
}

.tr-timeline__line.is-last {
  bottom: 50%;
}

.tr-timeline__dot {
  position: relative;

  display: block;

  width: 10px;
  height: 10px;

  border-radius: 50%;

  background-color: #ffe3b1;

  box-shadow: 0 0 0 2px color-mix(in srgb, #ffe3b1 13%, transparent);
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tr-timeline {
    gap: 32px;

    margin-top: 48px;
    margin-bottom: 48px;
  }

  .tr-timeline__title {
    font-size: 24px;
  }

  .tr-timeline__list {
    column-gap: 32px;

    row-gap: 40px;
  }

  .tr-timeline__time {
    font-size: 17px;
  }

  .tr-timeline__label {
    font-size: 19px;
  }

  .tr-timeline__line {
    top: -40px;
    bottom: -40px;
  }
}
</style>
