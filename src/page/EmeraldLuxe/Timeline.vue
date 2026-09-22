<template>
  <section class="cr-timeline">
    <img
      :src="decorativeFlowers"
      alt=""
      aria-hidden="true"
      class="cr-timeline__flowers"
      draggable="false"
    />

    <header class="cr-heading">
      <h2 class="cr-heading__vi">Lịch trình ngày cưới</h2>

      <p class="cr-heading__zh">婚禮當日流程</p>

      <div class="cr-heading__ornament" aria-hidden="true">
        <span></span>
        <i>❀</i>
        <span></span>
      </div>

      <p class="cr-heading__intro">
        Những khoảnh khắc đặc biệt đã đưa chúng mình đến ngày hôm nay
      </p>
    </header>

    <ol class="cr-timeline__list">
      <li v-for="(item, index) in items" :key="item.Id || index" class="cr-timeline__item">
        <div class="cr-timeline__side">
          <div class="cr-timeline__number">
            {{ String(index + 1).padStart(2, "0") }}
          </div>

          <div v-if="index < items.length - 1" class="cr-timeline__line"></div>
        </div>

        <article class="cr-timeline__card">
          <div class="cr-timeline__time">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M12 21s-7.5-4.7-9.3-9A5.3 5.3 0 0 1 12 6.6a5.3 5.3 0 0 1 9.3 5.4C19.5 16.3 12 21 12 21z"
              />
            </svg>

            <time>{{ item.Time || item.Date || formatTime(index) }}</time>
          </div>

          <h3 class="cr-timeline__title">
            {{ item.Title || item.Name || "Một dấu mốc đặc biệt" }}
          </h3>

          <p v-if="item.Description || item.Content" class="cr-timeline__desc">
            {{ item.Description || item.Content }}
          </p>

          <p v-if="item.Location" class="cr-timeline__location">
            {{ item.Location }}
          </p>
        </article>
      </li>
    </ol>
  </section>
</template>

<script setup>
import { computed } from "vue";

import { decorativeFlowers } from "./emeraldLuxeAssets";

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
.cr-timeline {
  position: relative;

  width: 100%;

  color: var(--cr-ink);
}

.cr-timeline__flowers {
  position: absolute;

  top: 20px;
  right: -20px;

  width: 96px;
  height: 96px;

  object-fit: contain;

  opacity: 0.45;

  pointer-events: none;
}

/* =========================================================
   TIÊU ĐỀ
========================================================= */

.cr-heading {
  position: relative;

  text-align: center;

  margin-bottom: 26px;
}

.cr-heading__vi {
  margin: 0;

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: clamp(22px, 6vw, 30px);
  font-weight: 400;

  letter-spacing: 0.06em;

  text-transform: uppercase;

  color: var(--cr-ink);
}

.cr-heading__zh {
  margin: 4px 0 0;

  font-family: "Noto Serif SC", serif;

  font-size: 0.85em;

  letter-spacing: 0.3em;
  text-indent: 0.3em;

  opacity: 0.7;

  color: var(--cr-soft);
}

.cr-heading__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-top: 12px;

  color: var(--cr-accent);
}

.cr-heading__ornament span {
  width: 52px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--cr-accent-rgb), 1));
}

.cr-heading__ornament span:last-child {
  transform: rotate(180deg);
}

.cr-heading__ornament i {
  font-size: 13px;
  font-style: normal;
}

.cr-heading__intro {
  max-width: 420px;

  margin: 12px auto 0;

  color: var(--cr-soft);

  font-size: 12px;

  line-height: 1.7;
}

/* =========================================================
   DANH SÁCH
========================================================= */

.cr-timeline__list {
  margin: 0;
  padding: 0;

  list-style: none;
}

.cr-timeline__item {
  display: grid;
  grid-template-columns: 46px 1fr;
  gap: 12px;

  margin-bottom: 16px;
}

.cr-timeline__item:last-child {
  margin-bottom: 0;
}

.cr-timeline__side {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.cr-timeline__number {
  position: relative;
  z-index: 3;

  width: 36px;
  height: 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.2);
  border-radius: 50%;

  background: linear-gradient(135deg, var(--cr-accent-light), var(--cr-accent));

  color: var(--cr-ink);

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: 14px;
}

.cr-timeline__line {
  position: absolute;
  z-index: 1;

  top: 36px;
  bottom: -16px;
  left: 50%;

  width: 1px;

  transform: translateX(-50%);

  background: repeating-linear-gradient(
    180deg,
    rgba(var(--cr-accent-rgb), 1) 0 5px,
    transparent 5px 10px
  );
}

/* =========================================================
   THẺ
========================================================= */

.cr-timeline__card {
  padding: 15px 16px 16px;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.18);
  border-radius: 14px;

  background: rgba(var(--cr-surface-rgb), 0.88);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.cr-timeline__card:hover {
  transform: translateY(-3px);

  box-shadow: 0 12px 28px rgba(var(--cr-ink-rgb), 0.1);
}

.cr-timeline__time {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  margin-bottom: 7px;

  color: var(--cr-muted);

  font-size: 11px;
  font-weight: 600;

  letter-spacing: 0.14em;
}

.cr-timeline__time svg {
  width: 13px;
  height: 13px;

  color: var(--cr-accent);
}

.cr-timeline__title {
  margin: 0;

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: 20px;
  font-weight: 400;

  letter-spacing: 0.04em;

  line-height: 1.25;

  color: var(--cr-ink);
}

.cr-timeline__desc {
  margin: 8px 0 0;

  color: var(--cr-soft);

  font-size: 12px;

  line-height: 1.65;
}

.cr-timeline__location {
  margin: 10px 0 0;
  padding-top: 9px;

  border-top: 1px solid rgba(var(--cr-accent-rgb), 0.9);

  color: var(--cr-muted);

  font-size: 11px;

  line-height: 1.45;
}

/* =========================================================
   MOBILE NHỎ
========================================================= */

@media (max-width: 380px) {
  .cr-timeline__item {
    grid-template-columns: 38px 1fr;
    gap: 9px;
  }

  .cr-timeline__number {
    width: 31px;
    height: 31px;

    font-size: 12px;
  }

  .cr-timeline__line {
    top: 31px;
  }

  .cr-timeline__card {
    padding: 13px;
  }

  .cr-timeline__title {
    font-size: 18px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .cr-timeline__card {
    transition: none;
  }
}
</style>
