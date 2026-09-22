<template>
  <section class="la-timeline">
    <img :src="dauLy" alt="" class="la-timeline__deco la-timeline__deco--top" aria-hidden="true" />
    <img :src="reLy" alt="" class="la-timeline__deco la-timeline__deco--bottom" aria-hidden="true" />

    <h2 class="la-title">Lịch trình ngày cưới</h2>

    <ol class="la-timeline__list">
      <li v-for="(item, index) in items" :key="item.Id || index" class="la-timeline__item">
        <span class="la-timeline__time">{{ item.Time || item.Date || "" }}</span>

        <span class="la-timeline__axis" aria-hidden="true">
          <span
            class="la-timeline__line"
            :class="{
              'la-timeline__line--first': index === 0,
              'la-timeline__line--last': index === items.length - 1,
            }"
          ></span>

          <span class="la-timeline__dot"></span>
        </span>

        <span class="la-timeline__label">
          {{ item.Title || item.Name || "Một dấu mốc đặc biệt" }}
        </span>
      </li>
    </ol>
  </section>
</template>

<script setup>
import { computed } from "vue";

import dauLy from "@/assets/love-art/dau ly.webp";
import reLy from "@/assets/love-art/re ly.webp";

const props = defineProps({
  timeline: { type: Array, default: () => [] },
  events: { type: Array, default: () => [] },
});

const items = computed(() => props.timeline || []);
</script>

<style scoped>
.la-timeline {
  position: relative;

  width: 100%;

  text-align: center;
}

/* =========================================================
   HOẠ TIẾT HAI BÊN
========================================================= */

.la-timeline__deco {
  position: absolute;
  z-index: 10;

  left: 8%;

  height: auto;

  object-fit: contain;

  pointer-events: none;
}

.la-timeline__deco--top {
  top: 28%;

  width: 16%;
  max-width: 64px;
}

.la-timeline__deco--bottom {
  top: 68%;

  width: 15%;
  max-width: 58px;
}

/* =========================================================
   DANH SÁCH 3 CỘT
========================================================= */

.la-timeline__list {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 16px minmax(0, 1fr);
  column-gap: 24px;
  row-gap: 32px;

  width: 100%;
  max-width: 460px;

  margin: 26px auto 0;
  padding: 0;

  list-style: none;
}

.la-timeline__item {
  display: contents;
}

.la-timeline__time {
  align-self: start;

  padding-top: 2px;

  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 16px;
  font-weight: 400;

  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  line-height: 1.35;
  text-align: right;
}

.la-timeline__label {
  align-self: start;

  padding-top: 2px;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 14px;
  font-weight: 500;

  line-height: 1.35;
  text-align: left;
}

/* =========================================================
   TRỤC THỜI GIAN
========================================================= */

.la-timeline__axis {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  align-self: stretch;
}

.la-timeline__line {
  position: absolute;
  left: 50%;

  /* Mặc định: nối lên trên và xuống dưới */
  top: -32px;
  bottom: -32px;

  width: 1px;

  transform: translateX(-50%);

  background-color: rgba(215, 12, 27, 0.4);
}

/* Mốc đầu: chỉ nối xuống */
.la-timeline__line--first {
  top: 50%;
}

/* Mốc cuối: chỉ nối lên */
.la-timeline__line--last {
  bottom: 50%;
}

.la-timeline__dot {
  position: relative;
  z-index: 2;

  display: block;

  width: 10px;
  height: 10px;

  border-radius: 50%;

  background-color: var(--la-red);

  box-shadow: 0 0 0 2px rgba(215, 12, 27, 0.13);
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .la-timeline__deco {
    left: 20%;
  }

  .la-timeline__deco--top {
    max-width: 80px;
  }

  .la-timeline__deco--bottom {
    max-width: 72px;
  }

  .la-timeline__list {
    column-gap: 32px;
    row-gap: 40px;
  }

  .la-timeline__time {
    font-size: 17px;
  }

  .la-timeline__label {
    font-size: 16px;
  }

  .la-timeline__line {
    top: -40px;
    bottom: -40px;
  }

  .la-timeline__line--first {
    top: 50%;
  }

  .la-timeline__line--last {
    bottom: 50%;
  }
}
</style>
