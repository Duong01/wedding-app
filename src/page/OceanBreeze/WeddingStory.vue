<template>
  <section class="ob-story">
    <p class="ob-eyebrow">CÂU CHUYỆN CỦA CHÚNG MÌNH</p>

    <h2>{{ storyTitle }}</h2>

    <div class="ob-quote">“</div>

    <p>{{ content }}</p>

    <div class="ob-tail">〜❊〜</div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({ story: { type: [String, Object], default: "" } });

const content = computed(() =>
  typeof props.story === "string"
    ? props.story
    : props.story?.Content || props.story?.Description || props.story?.Text || ""
);

const storyTitle = computed(() =>
  typeof props.story === "object" ? props.story?.Title || "Love story" : "Love story"
);
</script>

<style scoped>
.ob-story {
  position: relative;

  text-align: center;

  color: #274b5c;

  padding: 10px 6px;
}

.ob-eyebrow {
  margin: 0;

  color: #4a9ab8;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ob-story h2 {
  margin: 6px 0 4px;

  font-family: "Allura", cursive;
  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: #1d6a8e;
}

.ob-quote {
  height: 35px;

  color: #e8927c;

  font: 64px Georgia, serif;
  line-height: 1;
}

.ob-story p {
  max-width: 400px;
  margin: 0 auto;

  font-size: clamp(15px, 4.2vw, 18px);
  font-style: italic;

  line-height: 1.7;
}

.ob-tail {
  margin-top: 18px;

  color: #4a9ab8;

  font-size: 15px;

  letter-spacing: 0.2em;
}
</style>
