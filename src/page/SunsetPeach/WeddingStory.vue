<template>
  <section class="sp-story">
    <p class="sp-eyebrow">CÂU CHUYỆN CỦA CHÚNG MÌNH</p>

    <h2>{{ storyTitle }}</h2>

    <div class="sp-quote">“</div>

    <p>{{ content }}</p>

    <div class="sp-tail">❁</div>
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
.sp-story {
  text-align: center;

  color: #7a4a3d;
}

.sp-eyebrow {
  margin: 0;

  color: #d67a63;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.sp-story h2 {
  margin: 6px 0 4px;

  font-family: "Allura", cursive;
  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: #7a4a3d;
}

.sp-quote {
  height: 35px;

  color: #e0a37e;

  font: 64px Georgia, serif;
  line-height: 1;
}

.sp-story p {
  max-width: 400px;
  margin: 0 auto;

  font-size: clamp(15px, 4.2vw, 18px);
  font-style: italic;

  line-height: 1.7;
}

.sp-tail {
  margin-top: 18px;

  color: #d67a63;

  font-size: 15px;
}
</style>
