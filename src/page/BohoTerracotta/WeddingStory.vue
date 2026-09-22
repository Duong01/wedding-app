<template>
  <section class="bq-story">
    <img
      :src="flower4"
      alt=""
      aria-hidden="true"
      class="bq-story__flower"
      draggable="false"
    />

    <div class="bq-story__inner">
      <h2 class="bq-heading">{{ storyTitle || "CHUYỆN TÌNH YÊU" }}</h2>

      <img
        :src="line2"
        alt=""
        aria-hidden="true"
        class="bq-story__line"
        draggable="false"
      />

      <p class="bq-story__content">{{ content }}</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import { flower4, line2 } from "./bohoTerracottaAssets";

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
.bq-story {
  position: relative;
  isolation: isolate;

  width: 100%;

  overflow: hidden;

  text-align: center;

  color: var(--bq-ink);
}

.bq-story__flower {
  position: absolute;

  z-index: 1;

  bottom: 9px;
  left: -9.5%;

  width: 40.7%;
  max-width: none;
  height: auto;

  object-fit: contain;

  pointer-events: none;

  filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.25));
}

.bq-story__inner {
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  max-width: 400px;

  margin: 0 auto;

  padding: 0 20px;
}

.bq-heading {
  margin: 0;

  color: var(--bq-accent);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.04em;

  text-transform: uppercase;
}

.bq-story__line {
  display: block;

  width: 143px;
  max-width: none;
  height: auto;

  margin: 10px auto 0;

  object-fit: contain;

  filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.25));
}

.bq-story__content {
  max-width: 420px;
  margin: 18px auto 0;

  color: var(--bq-soft);

  font-size: 14px;
  font-style: italic;

  line-height: 1.85;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .bq-heading {
    font-size: 24px;
  }

  .bq-story__line {
    width: 180px;
  }

  .bq-story__content {
    font-size: 16px;
  }
}
</style>
