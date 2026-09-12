<template>
  <section class="cb-story">
    <p class="cb-eyebrow">CÂU CHUYỆN CỦA CHÚNG MÌNH</p>

    <h2>{{ storyTitle }}</h2>

    <div class="cb-quote">“</div>

    <p>{{ content }}</p>

    <div class="cb-tail">❀</div>
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
.cb-story {
  text-align: center;

  color: #6c4b4a;
}

.cb-eyebrow {
  margin: 0;

  color: #b67f7d;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.cb-story h2 {
  margin: 6px 0 4px;

  font-family: "Allura", cursive;
  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: #6c4b4a;
}

.cb-quote {
  height: 35px;

  color: #c9a06a;

  font: 64px Georgia, serif;
  line-height: 1;
}

.cb-story p {
  max-width: 400px;
  margin: 0 auto;

  font-size: clamp(15px, 4.2vw, 18px);
  font-style: italic;

  line-height: 1.7;
}

.cb-tail {
  margin-top: 18px;

  color: #b67f7d;

  font-size: 15px;
}
</style>
