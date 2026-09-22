<template>
  <section class="mw-story">
    <h2 class="mw-title">{{ title }}</h2>

    <div class="mw-story__card">
      <span class="mw-story__quote" aria-hidden="true">“</span>

      <p class="mw-story__text">{{ storyText }}</p>

      <span class="mw-story__tail" aria-hidden="true">✦</span>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  story: {
    type: [String, Object],
    default: "",
  },
});

const title = computed(() => {
  if (typeof props.story === "object" && props.story?.Title) {
    return props.story.Title;
  }

  return "Chuyện tình yêu";
});

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
.mw-story {
  text-align: center;
}

.mw-story__card {
  position: relative;

  max-width: 420px;

  margin: 24px auto 0;
  padding: 34px 24px 26px;

  border: 1px solid var(--mw-hairline);
  border-radius: 18px;

  background-color: var(--mw-blue-mist);
}

.mw-story__quote {
  position: absolute;
  top: 4px;
  left: 16px;

  color: var(--mw-blue);

  font-family: Georgia, serif;
  font-size: 52px;

  line-height: 1;

  opacity: 0.5;
}

.mw-story__text {
  margin: 0;

  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 14px;
  font-style: italic;
  font-weight: 400;

  letter-spacing: 0.03em;
  line-height: 1.8;
  white-space: pre-line;
}

.mw-story__tail {
  display: block;

  margin-top: 16px;

  color: var(--mw-blue-soft);

  font-size: 12px;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .mw-story__card {
    max-width: 600px;

    padding: 44px 40px 32px;
  }

  .mw-story__text {
    font-size: 16px;
  }
}
</style>
