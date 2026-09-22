<template>
  <section class="mw-timeline">
    <h2 class="mw-title">Lịch trình ngày cưới</h2>

    <ol v-if="items.length" class="mw-timeline__list">
      <li v-for="(item, index) in items" :key="item.Id || index" class="mw-timeline__item">
        <span class="mw-timeline__time">{{ item.Time }}</span>

        <span class="mw-timeline__axis" aria-hidden="true">
          <span
            class="mw-timeline__line"
            :class="{
              'mw-timeline__line--first': index === 0,
              'mw-timeline__line--last': index === items.length - 1,
            }"
          ></span>

          <span class="mw-timeline__dot"></span>
        </span>

        <span class="mw-timeline__label">{{ item.Title }}</span>
      </li>
    </ol>

    <p v-else class="mw-timeline__empty">Chưa có lịch trình.</p>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  timeline: {
    type: Array,
    default: () => [],
  },

  events: {
    type: Array,
    default: () => [],
  },
});

const items = computed(() => {
  const source = props.timeline?.length ? props.timeline : props.events;

  return (source || [])
    .map((item, index) => {
      const data = item || {};

      return {
        Id: data.Id || index,

        Time: data.Time || data.StartTime || data.EventTime || "",

        Title: data.Title || data.Name || data.TypeLabel || "Lịch trình",
      };
    })
    .filter((item) => item.Time || item.Title);
});
</script>

<style scoped>
.mw-timeline {
  text-align: center;
}

.mw-timeline__list {
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

.mw-timeline__item {
  display: contents;
}

.mw-timeline__time {
  align-self: start;

  padding-top: 2px;

  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 16px;
  font-weight: 400;

  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
  line-height: 1.4;
  text-align: right;
}

.mw-timeline__label {
  align-self: start;

  padding-top: 2px;

  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 17px;
  font-weight: 500;

  letter-spacing: 0.05em;
  line-height: 1.4;
  text-align: left;
}

.mw-timeline__axis {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  align-self: stretch;
}

.mw-timeline__line {
  position: absolute;
  left: 50%;

  top: -32px;
  bottom: -32px;

  width: 1px;

  transform: translateX(-50%);

  background-color: rgba(72, 108, 125, 0.4);
}

.mw-timeline__line--first {
  top: 50%;
}

.mw-timeline__line--last {
  bottom: 50%;
}

.mw-timeline__dot {
  position: relative;
  z-index: 2;

  display: block;

  width: 10px;
  height: 10px;

  border-radius: 50%;

  background-color: var(--mw-blue);

  box-shadow: 0 0 0 2px rgba(72, 108, 125, 0.13);
}

.mw-timeline__empty {
  margin: 24px 0 0;

  color: var(--mw-ink-soft);

  font-family: var(--mw-font-serif);
  font-size: 14px;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .mw-timeline__list {
    column-gap: 32px;
    row-gap: 40px;
  }

  .mw-timeline__time {
    font-size: 17px;
  }

  .mw-timeline__label {
    font-size: 19px;
  }

  .mw-timeline__line {
    top: -40px;
    bottom: -40px;
  }

  .mw-timeline__line--first {
    top: 50%;
  }

  .mw-timeline__line--last {
    bottom: 50%;
  }
}
</style>
