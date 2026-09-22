<template>
  <section class="tdx-story">
    <!-- =====================================================
         HOẠ TIẾT NỀN
    ====================================================== -->

    <div class="tdx-story__decor" aria-hidden="true">
      <img
        :src="lineDecoration"
        alt=""
        class="tdx-decor tdx-decor--line-right"
        draggable="false"
      />

      <img
        :src="flowerDecoration"
        alt=""
        class="tdx-decor tdx-decor--flower-right"
        draggable="false"
      />
    </div>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="tdx-story__inner">
      <h2 v-if="storyTitle" class="tdx-story__title">{{ storyTitle }}</h2>

      <p class="tdx-story__quote" aria-hidden="true">“</p>

      <p class="tdx-story__content">{{ content }}</p>

      <p class="tdx-story__tail" aria-hidden="true">❀</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import { flowerDecoration, lineDecoration } from "./toDuyenXanhAssets";

const props = defineProps({ story: { type: [String, Object], default: "" } });

const content = computed(() =>
  typeof props.story === "string"
    ? props.story
    : props.story?.Content || props.story?.Description || props.story?.Text || ""
);

const storyTitle = computed(() =>
  typeof props.story === "object" ? props.story?.Title || "" : ""
);
</script>

<style scoped>
.tdx-story {
  --tdx-bg: var(--background, #fefbf4);
  --tdx-ink: var(--text, #1a3500);
  --tdx-green: var(--primary, #5e813c);
  --tdx-line: var(--accent, #d1db9c);

  position: relative;
  isolation: isolate;

  overflow: hidden;

  color: var(--tdx-ink);

  background-color: var(--tdx-bg);
}

/* =========================================================
   HOẠ TIẾT NỀN
========================================================= */

.tdx-story__decor {
  position: absolute;
  inset: 0;
  z-index: -1;

  pointer-events: none;
}

.tdx-decor {
  position: absolute;

  max-width: none;

  object-fit: cover;

  pointer-events: none;
}

.tdx-decor--line-right {
  top: 20px;
  right: -70px;

  width: 198px;
  height: 420px;

  transform: rotate(-177.25deg);
}

.tdx-decor--flower-right {
  top: -10px;
  right: -80px;

  width: 190px;
  height: 190px;

  object-fit: contain;

  transform: scaleX(-1) rotate(50deg);
}

/* =========================================================
   NỘI DUNG
========================================================= */

.tdx-story__inner {
  position: relative;
  z-index: 2;

  width: min(100%, 441px);

  margin: 0 auto;

  padding: 2.5% 10% 18%;

  text-align: center;
}

.tdx-story__title {
  margin: 0 0 4px;

  color: var(--tdx-green);

  font-family: Carattere, cursive;
  font-size: 34px;
  font-weight: 400;

  line-height: 1.2;
}

.tdx-story__quote {
  height: 30px;

  margin: 0;

  color: var(--tdx-line);

  font-family: Georgia, serif;
  font-size: 58px;

  line-height: 1;
}

.tdx-story__content {
  max-width: 400px;
  margin: 0 auto;

  color: var(--tdx-ink);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 15px;
  font-style: italic;

  line-height: 1.7;

  white-space: pre-line;
}

.tdx-story__tail {
  margin: 18px 0 0;

  color: var(--tdx-green);

  font-size: 15px;

  letter-spacing: 0.2em;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tdx-story__inner {
    width: min(100%, 600px);

    padding: 2.5% 5px 18%;
  }

  .tdx-decor--line-right {
    top: 40px;
    left: -150px;
    right: auto;

    width: 158px;
    height: 560px;
  }

  .tdx-decor--flower-right {
    top: -20px;
    left: -300px;
    right: auto;

    width: 420px;
    height: 420px;
  }

  .tdx-story__title {
    font-size: 46px;
  }

  .tdx-story__content {
    font-size: 19px;
  }
}
</style>
