<template>
  <section class="shy-timeline">
    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'timeline', 'Eyebrow')" class="shy-top-custom-head">
      <p v-if="sectionOverride(sections, 'timeline', 'Eyebrow')" class="shy-top-custom-head__eyebrow">{{ sectionOverride(sections, "timeline", "Eyebrow") }}</p>
    </header>

    <h2 class="shy-bar">{{ sectionText(sections, "timeline", "Heading", "LỊCH TRÌNH NGÀY CƯỚI") }}</h2>
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'timeline', 'Intro')" class="shy-sub-custom-head">
      <p v-if="sectionOverride(sections, 'timeline', 'Intro')" class="shy-sub-custom-head__intro">{{ sectionOverride(sections, "timeline", "Intro") }}</p>
    </header>


    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="shy-timeline__inner">
      <ol class="shy-timeline__list">
        <li
          v-for="(item, index) in items"
          :key="item.Id || index"
          class="shy-timeline__item"
        >
          <!-- MỐC THỜI GIAN -->
          <span class="shy-timeline__time">
            {{ item.Time || item.Date || formatTime(index) }}
          </span>

          <!-- TRỤC -->
          <span class="shy-timeline__axis" aria-hidden="true">
            <span
              v-if="index > 0"
              class="shy-timeline__line shy-timeline__line--up"
            ></span>

            <span class="shy-timeline__dot"></span>

            <span
              v-if="index < items.length - 1"
              class="shy-timeline__line shy-timeline__line--down"
            ></span>
          </span>

          <!-- MÔ TẢ -->
          <span class="shy-timeline__body">
            <b>{{ item.Title || item.Name || "Một dấu mốc đặc biệt" }}</b>

            <em v-if="item.Description || item.Content">
              {{ item.Description || item.Content }}
            </em>

            <i v-if="item.Location">{{ item.Location }}</i>
          </span>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { computed } from "vue";

const props = defineProps({
  sections: { type: Object, default: () => ({}) },
  timeline: { type: Array, default: () => [] },
});

const items = computed(() => props.timeline || []);

function formatTime(index) {
  return `DẤU MỐC ${String(index + 1).padStart(2, "0")}`;
}
</script>

<style scoped>
.shy-timeline {
  --shy-bg: var(--background, #fff7eb);
  --shy-ink: var(--text, #666666);
  --shy-red: var(--primary, #800000);
  --shy-cream: var(--accent-light, #ffeed2);

  position: relative;

  overflow: hidden;

  color: var(--shy-ink);

  background-color: var(--shy-bg);

  font-family: Baskerville, "Times New Roman", serif;
}

/* =========================================================
   THANH TIÊU ĐỀ ĐỎ
========================================================= */

.shy-bar {
  margin: 0;

  padding: 12px 16px;

  color: var(--shy-cream);

  background: var(--shy-red);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-align: center;
  text-transform: uppercase;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.shy-timeline__inner {
  width: min(100%, 441px);

  margin: 0 auto;

  padding: 32px 8px 40px;
}

.shy-timeline__list {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 16px minmax(0, 1fr);
  align-items: center;
  column-gap: 24px;
  row-gap: 32px;

  margin: 0;
  padding: 0;

  list-style: none;
}

.shy-timeline__item {
  display: contents;
}

/* =========================================================
   MỐC THỜI GIAN
========================================================= */

.shy-timeline__time {
  padding-top: 2px;

  color: var(--shy-red);

  font-size: 16px;

  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;

  line-height: 1.4;

  text-align: right;
}

/* =========================================================
   TRỤC
========================================================= */

.shy-timeline__axis {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  align-self: stretch;
}

.shy-timeline__dot {
  position: relative;
  z-index: 1;

  display: block;

  width: 10px;
  height: 10px;

  border-radius: 50%;

  background: var(--shy-red);

  box-shadow: 0 0 0 2px color-mix(in srgb, var(--shy-red) 13%, transparent);
}

.shy-timeline__line {
  position: absolute;
  left: 50%;

  width: 1px;

  transform: translateX(-50%);

  background: color-mix(in srgb, var(--shy-red) 40%, transparent);
}

.shy-timeline__line--up {
  top: -32px;
  bottom: 50%;
}

.shy-timeline__line--down {
  top: 50%;
  bottom: -32px;
}

/* =========================================================
   MÔ TẢ
========================================================= */

.shy-timeline__body {
  display: flex;
  flex-direction: column;
  gap: 4px;

  padding-top: 2px;

  text-align: left;
}

.shy-timeline__body b {
  color: var(--shy-ink);

  font-size: 17px;
  font-weight: 500;

  line-height: 1.4;
}

.shy-timeline__body em {
  color: color-mix(in srgb, var(--shy-ink) 85%, transparent);

  font-size: 13px;
  font-style: normal;

  line-height: 1.5;
}

.shy-timeline__body i {
  color: color-mix(in srgb, var(--shy-ink) 65%, transparent);

  font-size: 12px;
  font-style: italic;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shy-bar {
    padding: 16px;

    font-size: 24px;
  }

  .shy-timeline__inner {
    width: min(100%, 600px);

    padding: 40px 5px 48px;
  }

  .shy-timeline__list {
    column-gap: 32px;
    row-gap: 40px;
  }

  .shy-timeline__time {
    font-size: 17px;
  }

  .shy-timeline__line--up {
    top: -40px;
  }

  .shy-timeline__line--down {
    bottom: -40px;
  }

  .shy-timeline__body b {
    font-size: 19px;
  }

  .shy-timeline__body em {
    font-size: 15px;
  }

  .shy-timeline__body i {
    font-size: 13px;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.shy-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.shy-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.shy-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.shy-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.shy-sub-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.shy-sub-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.shy-sub-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.shy-sub-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
