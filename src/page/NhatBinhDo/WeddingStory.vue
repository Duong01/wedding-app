<template>
  <section class="cfr-story">

    <!-- =====================================================
         HOA TRANG TRÍ
    ====================================================== -->

    <img
      :src="flower3"
      class="cfr-story__bloom cfr-story__bloom--top"
      alt=""
      aria-hidden="true"
    />

    <img
      :src="flower2"
      class="cfr-story__bloom cfr-story__bloom--bottom"
      alt=""
      aria-hidden="true"
    />


    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <header class="cfr-story__head">

      <span class="cfr-story__eyebrow">
        {{ eyebrow }}
      </span>

      <h2 class="cfr-title">
        {{ heading }}
      </h2>

    </header>


    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div v-if="storyText" class="cfr-story__body">

      <span class="cfr-story__quote cfr-story__quote--open" aria-hidden="true">
        “
      </span>

      <p class="cfr-story__text">
        {{ storyText }}
      </p>

      <span class="cfr-story__quote cfr-story__quote--close" aria-hidden="true">
        ”
      </span>

    </div>

  </section>
</template>


<script setup>
import { computed } from "vue";

import { sectionText } from "@/data/sectionTitles";

import { flower2, flower3 } from "./crystalFloralAssets";


const props = defineProps({
  story: {
    type: [String, Object],
    default: "",
  },

  sections: {
    type: Object,
    default: () => ({}),
  },
});


/* =========================================================
   TIÊU ĐỀ MỤC
========================================================= */

const eyebrow = computed(() =>
  sectionText(props.sections, "story", "Eyebrow")
);


/*
 * Tiêu đề ưu tiên lấy từ story.Title (panel "Chuyện tình
 * yêu"); nếu trống thì rơi về tiêu đề mục trong panel
 * "Tiêu đề mục".
 */
const heading = computed(() => {
  const title =
    typeof props.story === "object" ? props.story?.Title || "" : "";

  return sectionText(props.sections, "story", "Heading", title);
});


/* =========================================================
   NỘI DUNG
========================================================= */

const storyText = computed(() => {
  if (typeof props.story === "string") {
    return props.story;
  }

  return (
    props.story?.Content ||
    props.story?.Description ||
    props.story?.Text ||
    ""
  );
});
</script>


<style scoped>
/* =========================================================
   SECTION
========================================================= */

.cfr-story {
  position: relative;

  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 20px;

  width: 100%;

  padding: 8px 0;

  color: var(--cfr-red-deep);

  text-align: center;

  overflow: hidden;
}


/* =========================================================
   HOA TRANG TRÍ
========================================================= */

.cfr-story__bloom {
  position: absolute;

  z-index: 0;

  width: 150px;
  height: auto;

  object-fit: contain;

  opacity: 0.07;

  pointer-events: none;
  user-select: none;
}

.cfr-story__bloom--top {
  top: -30px;
  right: -50px;

  transform: rotate(20deg);
}

.cfr-story__bloom--bottom {
  bottom: -40px;
  left: -50px;

  transform: scaleX(-1) rotate(-20deg);
}


/* =========================================================
   TIÊU ĐỀ
========================================================= */

.cfr-story__head {
  position: relative;

  z-index: 2;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 6px;
}

.cfr-story__eyebrow {
  display: block;

  color: var(--cfr-red-deep);

  font-family: var(--cfr-font-heading);
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.18em;
  line-height: 1.4;

  text-transform: uppercase;
}


/* =========================================================
   NỘI DUNG
========================================================= */

.cfr-story__body {
  position: relative;

  z-index: 2;

  width: 100%;
  max-width: 510px;

  margin: 0 auto;
  padding: 0 8px;
}

.cfr-story__text {
  margin: 0;

  color: var(--cfr-red-deep);

  font-family: var(--cfr-font-body);
  font-size: 14px;
  font-weight: 400;

  letter-spacing: 0.01em;
  line-height: 2;

  white-space: pre-line;
}


/* =========================================================
   DẤU TRÍCH DẪN
========================================================= */

.cfr-story__quote {
  position: absolute;

  color: var(--cfr-red);

  font-family: var(--cfr-font-name);
  font-size: 42px;
  font-weight: 700;

  line-height: 1;

  opacity: 0.35;

  pointer-events: none;
}

.cfr-story__quote--open {
  top: -14px;
  left: -4px;
}

.cfr-story__quote--close {
  right: -4px;
  bottom: -22px;
}


/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .cfr-story {
    gap: 28px;
  }

  .cfr-story__bloom {
    width: 200px;
  }

  .cfr-story__eyebrow {
    font-size: 12px;
  }

  .cfr-story__text {
    font-size: 16px;
  }

  .cfr-story__quote {
    font-size: 52px;
  }
}


/* =========================================================
   MÀN HÌNH NHỎ
========================================================= */

@media (max-width: 380px) {
  .cfr-story__bloom {
    width: 110px;
  }

  .cfr-story__text {
    font-size: 13px;

    line-height: 1.9;
  }

  .cfr-story__quote {
    font-size: 34px;
  }
}
</style>
