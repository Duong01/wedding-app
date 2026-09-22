<template>
  <section class="timeline">
    <!-- HEADER -->
    <div class="timeline-header">
      <div class="gg-eyebrow">DẤU MỐC YÊU THƯƠNG</div>

      <h2 class="gg-title">Lịch trình ngày cưới</h2>

      <p class="gg-lead">
        Những khoảnh khắc đặc biệt đã đưa chúng mình đến ngày hôm nay
      </p>
    </div>

    <!-- TIMELINE -->
    <ol class="timeline-list">
      <li
        v-for="(item, index) in items"
        :key="item.Id || index"
        class="timeline-item"
      >
        <!-- TIME -->
        <div class="timeline-time">
          <span class="time-value">
            {{ item.Time || item.Date || formatTime(index) }}
          </span>

          <span v-if="item.Icon" class="time-icon">{{ item.Icon }}</span>
        </div>

        <!-- DOT + LINE -->
        <div class="timeline-axis">
          <span class="axis-dot"></span>

          <span
            v-if="index < items.length - 1"
            class="axis-line"
          ></span>
        </div>

        <!-- CONTENT -->
        <div class="timeline-content">
          <h3 class="timeline-title">
            {{ item.Title || item.Name || "Một dấu mốc đặc biệt" }}
          </h3>

          <p
            v-if="item.Description || item.Content"
            class="timeline-description"
          >
            {{ item.Description || item.Content }}
          </p>

          <span v-if="item.Location" class="timeline-location">
            {{ item.Location }}
          </span>
        </div>
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

const items = computed(() => props.timeline || []);

function formatTime(index) {
  return `MỐC ${String(index + 1).padStart(2, "0")}`;
}
</script>

<style scoped>
.timeline {
  text-align: center;
}

.timeline-header {
  margin-bottom: 28px;
}

/* =====================================================
   LIST
===================================================== */

.timeline-list {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 16px minmax(0, 1fr);
  column-gap: 20px;
  row-gap: 30px;

  max-width: 460px;
  margin: 0 auto;
  padding: 0;

  list-style: none;
}

.timeline-item {
  display: contents;
}

/* =====================================================
   TIME
===================================================== */

.timeline-time {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;

  padding-top: 1px;
}

.time-value {
  color: var(--gg-rose, #cb5d6c);
  font-family: "EB Garamond", serif;
  font-size: 16px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.time-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 26px;
  height: 26px;

  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.4);

  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(7px) saturate(1.08);
  -webkit-backdrop-filter: blur(7px) saturate(1.08);

  box-shadow: inset 1px 1px 2px rgba(255, 255, 255, 0.5),
    0 4px 12px -2px rgba(147, 56, 69, 0.24);

  color: var(--gg-rose, #cb5d6c);
  font-size: 12px;
  line-height: 1;
}

/* =====================================================
   AXIS
===================================================== */

.timeline-axis {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.axis-dot {
  width: 10px;
  height: 10px;
  margin-top: 5px;

  border-radius: 50%;
  background-color: var(--gg-rose, #cb5d6c);

  box-shadow: 0 0 0 2px rgba(203, 93, 108, 0.13);
}

.axis-line {
  flex: 1;
  width: 1px;
  margin-top: 6px;

  background-color: rgba(203, 93, 108, 0.4);
}

/* =====================================================
   CONTENT
===================================================== */

.timeline-content {
  text-align: left;
}

.timeline-title {
  margin: 0;

  color: var(--gg-deep, #933845);
  font-family: "EB Garamond", serif;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.3;
}

.timeline-description {
  margin: 5px 0 0;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 12px;
  line-height: 1.6;

  opacity: 0.8;
}

.timeline-location {
  display: inline-block;
  margin-top: 6px;

  color: var(--gg-rose, #cb5d6c);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 11px;
  letter-spacing: 0.04em;

  opacity: 0.85;
}

/* =====================================================
   DESKTOP
===================================================== */

@media (min-width: 900px) {
  .timeline-list {
    column-gap: 32px;
    row-gap: 40px;
  }

  .time-value {
    font-size: 17px;
  }

  .timeline-title {
    font-size: 19px;
  }

  .timeline-description {
    font-size: 13px;
  }
}
</style>
