<template>
  <section class="cr-story">
    <img
      :src="decorativeFlowers"
      alt=""
      aria-hidden="true"
      class="cr-story__flowers"
      draggable="false"
    />

    <header class="cr-heading">
      <h2 class="cr-heading__vi">{{ storyTitle || "Chuyện tình yêu" }}</h2>

      <p class="cr-heading__zh">愛情故事</p>

      <div class="cr-heading__ornament" aria-hidden="true">
        <span></span>
        <i>❀</i>
        <span></span>
      </div>
    </header>

    <div class="cr-story__card">
      <span class="cr-story__quote" aria-hidden="true">“</span>

      <p class="cr-story__content">{{ content }}</p>

      <span class="cr-story__tail" aria-hidden="true">❀</span>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import { decorativeFlowers } from "./emeraldLuxeAssets";

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
.cr-story {
  position: relative;

  text-align: center;

  color: var(--cr-ink);
}

.cr-story__flowers {
  position: absolute;

  top: 30px;
  left: -22px;

  width: 100px;
  height: 100px;

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

/* =========================================================
   NỘI DUNG
========================================================= */

.cr-story__card {
  position: relative;

  margin-top: 22px;
  padding: 26px 22px 22px;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.18);
  border-radius: 16px;

  background: rgba(var(--cr-surface-rgb), 0.85);
}

.cr-story__quote {
  position: absolute;

  top: 2px;
  left: 14px;

  color: rgba(var(--cr-accent-rgb), 0.9);

  font: 62px Georgia, serif;
  line-height: 1;
}

.cr-story__content {
  position: relative;

  max-width: 420px;
  margin: 0 auto;

  color: var(--cr-soft);

  font-size: clamp(14px, 3.8vw, 16px);
  font-style: italic;

  line-height: 1.85;
}

.cr-story__tail {
  display: block;

  margin-top: 14px;

  color: var(--cr-accent);

  font-size: 14px;

  animation: cr-story-sway 5s ease-in-out infinite;
}

@keyframes cr-story-sway {
  0%,
  100% {
    transform: rotate(-8deg);
  }

  50% {
    transform: rotate(8deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cr-story__tail {
    animation: none;
  }
}
</style>
