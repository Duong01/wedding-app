<template>
  <section class="rr-timeline">

    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'timeline', 'Eyebrow')" class="rr-top-custom-head">
      <p v-if="sectionOverride(sections, 'timeline', 'Eyebrow')" class="rr-top-custom-head__eyebrow">{{ sectionOverride(sections, "timeline", "Eyebrow") }}</p>
    </header>

    <h2 class="rr-title">
      {{ heading }}
    </h2>
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'timeline', 'Intro')" class="rr-sub-custom-head">
      <p v-if="sectionOverride(sections, 'timeline', 'Intro')" class="rr-sub-custom-head__intro">{{ sectionOverride(sections, "timeline", "Intro") }}</p>
    </header>



    <!-- =====================================================
         LỊCH TRÌNH
    ====================================================== -->

    <ol v-if="items.length" class="rr-timeline__list">

      <li
        v-for="(item, index) in items"
        :key="item.id"
        class="rr-timeline__row"
      >
        <span class="rr-timeline__time">
          {{ item.time }}
        </span>

        <span class="rr-timeline__mark" aria-hidden="true">
          <span
            class="rr-timeline__line"
            :class="{
              'is-first': index === 0,
              'is-last': index === items.length - 1,
            }"
          ></span>

          <span class="rr-timeline__dot"></span>
        </span>

        <span class="rr-timeline__label">
          {{ item.title }}
        </span>
      </li>

    </ol>


    <p v-else class="rr-timeline__empty">
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

.rr-timeline {
  position: relative;

  z-index: 10;

  display: flex;
  flex-direction: column;

  gap: 24px;

  width: 100%;

  padding: 0 16px;

  color: var(--rr-red);
}


/* =====================================================
   DANH SÁCH
===================================================== */

.rr-timeline__list {
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

.rr-timeline__row {
  display: contents;
}

.rr-timeline__time {
  padding-top: 2px;

  color: var(--rr-red);

  font-size: 16px;

  letter-spacing: 0.025em;
  line-height: 1.4;
  text-align: right;

  font-variant-numeric: tabular-nums;
}

.rr-timeline__label {
  padding-top: 2px;

  color: var(--rr-red);

  font-size: 17px;
  font-weight: 500;

  line-height: 1.4;
  text-align: start;
}


/* =====================================================
   ĐIỂM + ĐƯỜNG NỐI
===================================================== */

.rr-timeline__mark {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  align-self: stretch;
}

.rr-timeline__line {
  position: absolute;
  left: 50%;

  top: -32px;
  bottom: -32px;

  width: 1px;

  transform: translateX(-50%);

  background-color: color-mix(in srgb, var(--rr-red) 40%, transparent);
}

.rr-timeline__line.is-first {
  top: 50%;
}

.rr-timeline__line.is-last {
  bottom: 50%;
}

.rr-timeline__dot {
  position: relative;

  display: block;

  width: 10px;
  height: 10px;

  border-radius: 50%;

  background-color: var(--rr-red);

  box-shadow: 0 0 0 2px color-mix(in srgb, var(--rr-red) 13%, transparent);
}


/* =====================================================
   EMPTY
===================================================== */

.rr-timeline__empty {
  margin: 0;

  font-size: 14px;

  text-align: center;

  opacity: 0.7;
}


/* =====================================================
   DESKTOP
===================================================== */

@media (min-width: 768px) {
  .rr-timeline {
    gap: 32px;

    padding: 0 40px;
  }

  .rr-timeline__list {
    column-gap: 32px;
    row-gap: 40px;
  }

  .rr-timeline__time {
    font-size: 17px;
  }

  .rr-timeline__label {
    font-size: 19px;
  }

  .rr-timeline__line {
    top: -40px;
    bottom: -40px;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.rr-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.rr-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.rr-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.rr-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.rr-sub-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.rr-sub-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.rr-sub-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.rr-sub-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
