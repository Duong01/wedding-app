<template>
  <section class="cfr-timeline">

    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'timeline', 'Eyebrow')" class="cfr-top-custom-head">
      <p v-if="sectionOverride(sections, 'timeline', 'Eyebrow')" class="cfr-top-custom-head__eyebrow">{{ sectionOverride(sections, "timeline", "Eyebrow") }}</p>
    </header>

    <h2 class="cfr-title">
      {{ heading }}
    </h2>
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'timeline', 'Intro')" class="cfr-sub-custom-head">
      <p v-if="sectionOverride(sections, 'timeline', 'Intro')" class="cfr-sub-custom-head__intro">{{ sectionOverride(sections, "timeline", "Intro") }}</p>
    </header>



    <!-- =====================================================
         LỊCH TRÌNH
    ====================================================== -->

    <ol v-if="items.length" class="cfr-timeline__list">

      <li
        v-for="(item, index) in items"
        :key="item.id"
        class="cfr-timeline__row"
      >
        <span class="cfr-timeline__time">
          {{ item.time }}
        </span>

        <span class="cfr-timeline__mark" aria-hidden="true">
          <span
            class="cfr-timeline__line"
            :class="{
              'is-first': index === 0,
              'is-last': index === items.length - 1,
            }"
          ></span>

          <span class="cfr-timeline__dot"></span>
        </span>

        <span class="cfr-timeline__label">
          {{ item.title }}
        </span>
      </li>

    </ol>


    <p v-else class="cfr-timeline__empty">
      {{ $t("Chưa có lịch trình.") }}
    </p>

  </section>
</template>


<script setup>
import { computed } from "vue";

import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { t } from "@/lang";
const props = defineProps({
  timeline: {
    type: Array,
    default: () => [],
  },

  events: {
    type: Array,
    default: () => [],
  },

  sections: {
    type: Object,
    default: () => ({}),
  },
});

/* =====================================================
   TIÊU ĐỀ MỤC
===================================================== */

const heading = computed(() =>
  sectionText(props.sections, "timeline", "Heading", t("Lịch trình ngày cưới"))
);


/*
 * Có thể truyền timeline riêng, hoặc dùng events
 * nếu API đang lưu lịch trình trong events.
 */
const items = computed(() => {
  const source = props.timeline?.length ? props.timeline : props.events;

  return (source || [])
    .map((item, index) => {
      const data = item || {};

      return {
        id: data.Id || index,

        time: data.Time || data.StartTime || data.EventTime || "",

        title: data.Title || data.Name || "",

        description: data.Description || data.Content || data.Text || "",
      };
    })
    .filter((item) => item.time || item.title);
});
</script>


<style scoped>
/* =====================================================
   SECTION
===================================================== */

.cfr-timeline {
  position: relative;

  z-index: 10;

  display: flex;
  flex-direction: column;

  gap: 24px;

  width: 100%;

  color: var(--cfr-red-deep);
}


/* =====================================================
   DANH SÁCH
===================================================== */

.cfr-timeline__list {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    16px
    minmax(0, 1fr);

  align-items: center;

  column-gap: 24px;
  row-gap: 32px;

  width: 100%;
  max-width: 460px;

  margin: 0 auto;
  padding: 0;

  list-style: none;
}

.cfr-timeline__row {
  display: contents;
}

.cfr-timeline__time {
  padding-top: 2px;

  color: var(--cfr-red);

  font-size: 16px;

  letter-spacing: 0.025em;
  line-height: 1.4;
  text-align: right;

  font-variant-numeric: tabular-nums;
}

.cfr-timeline__label {
  padding-top: 2px;

  color: var(--cfr-red-deep);

  font-size: 17px;
  font-weight: 500;

  line-height: 1.4;
  text-align: start;
}


/* =====================================================
   ĐIỂM + ĐƯỜNG NỐI
===================================================== */

.cfr-timeline__mark {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  align-self: stretch;
}

.cfr-timeline__line {
  position: absolute;
  left: 50%;

  top: -32px;
  bottom: -32px;

  width: 1px;

  transform: translateX(-50%);

  background-color: color-mix(in srgb, var(--cfr-red) 40%, transparent);
}

.cfr-timeline__line.is-first {
  top: 50%;
}

.cfr-timeline__line.is-last {
  bottom: 50%;
}

.cfr-timeline__dot {
  position: relative;

  display: block;

  width: 10px;
  height: 10px;

  border-radius: 50%;

  background-color: var(--cfr-red);

  box-shadow: 0 0 0 2px color-mix(in srgb, var(--cfr-red) 13%, transparent);
}


/* =====================================================
   EMPTY
===================================================== */

.cfr-timeline__empty {
  margin: 0;

  font-size: 14px;

  text-align: center;

  opacity: 0.7;
}


/* =====================================================
   DESKTOP
===================================================== */

@media (min-width: 900px) {
  .cfr-timeline {
    gap: 32px;
  }

  .cfr-timeline__list {
    column-gap: 32px;
    row-gap: 40px;
  }

  .cfr-timeline__time {
    font-size: 17px;
  }

  .cfr-timeline__label {
    font-size: 19px;
  }

  .cfr-timeline__line {
    top: -40px;
    bottom: -40px;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.cfr-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.cfr-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.cfr-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.cfr-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.cfr-sub-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.cfr-sub-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.cfr-sub-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.cfr-sub-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
