<template>
  <section class="story">
    <div class="gg-eyebrow">CÂU CHUYỆN CỦA CHÚNG MÌNH</div>

    <h2 class="gg-title">{{ storyTitle || "Chuyện tình yêu" }}</h2>

    <div class="story-card">
      <div class="quote">“</div>

      <p class="story-text">{{ content }}</p>

      <div class="tail">✦</div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({ story: { type: [String, Object], default: "" } });

const content = computed(() =>
  typeof props.story === "string"
    ? props.story
    : props.story?.Content ||
      props.story?.Description ||
      props.story?.Text ||
      ""
);

const storyTitle = computed(() =>
  typeof props.story === "object" ? props.story?.Title || "" : ""
);
</script>

<style scoped>
.story {
  text-align: center;
}

/* =========================================================
   THẺ KÍNH
   ========================================================= */

.story-card {
  position: relative;

  max-width: 420px;
  margin: 22px auto 0;
  padding: 26px 22px 20px;

  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.35);

  background-color: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(7px) saturate(1.08);
  -webkit-backdrop-filter: blur(7px) saturate(1.08);

  box-shadow: inset 1.5px 1.5px 2px rgba(255, 255, 255, 0.45),
    inset -1.5px -1.5px 3px rgba(180, 120, 130, 0.12),
    0 18px 50px -6px rgba(147, 56, 69, 0.3),
    0 6px 20px 2px rgba(147, 56, 69, 0.14);
}

.quote {
  height: 30px;

  color: var(--gg-rose, #cb5d6c);
  font-family: Georgia, serif;
  font-size: 56px;
  line-height: 1;

  opacity: 0.55;
}

.story-text {
  max-width: 340px;
  margin: 0 auto;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 14px;
  font-style: italic;
  line-height: 1.75;
}

.tail {
  margin-top: 14px;

  color: var(--gg-rose, #cb5d6c);
  font-size: 12px;

  opacity: 0.7;
}

@media (min-width: 900px) {
  .story-card {
    padding: 32px 30px 24px;
  }

  .story-text {
    font-size: 16px;
  }
}
</style>
