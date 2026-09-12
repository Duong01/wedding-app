<template>
  <section class="story">
    <div class="eyebrow">CÂU CHUYỆN CỦA CHÚNG MÌNH</div>
    <h2>{{ storyTitle }}</h2>
    <div class="quote">“</div>
    <p>{{ content }}</p>
    <div class="tail">✦</div>
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
  typeof props.story === "object"
    ? props.story?.Title || "Love story"
    : "Love story"
);
</script>
<style scoped>
.story {

  text-align: center;
  color: #764158;
}

.quote {
  height: 35px;
  color: #d18ca3;
  font: 64px Georgia;
  line-height: 1;
}
.story p {
  max-width: 400px;
  margin: 0 auto;
  font-size: clamp(15px, 4.2vw, 18px);
  line-height: 1.7;
  font-style: italic;
}
.tail {
  margin-top: 18px;
  color: #ca7894;
}
</style>