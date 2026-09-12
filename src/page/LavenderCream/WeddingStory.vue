<template>
  <section class="lc-story">
    <p class="lc-eyebrow">CÂU CHUYỆN CỦA CHÚNG MÌNH</p>

    <h2>{{ storyTitle }}</h2>

    <div class="lc-quote">“</div>

    <p>{{ content }}</p>

    <div class="lc-tail">❀</div>
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
.lc-story {
  text-align: center;

  color: #584a5b;
}

.lc-eyebrow {
  margin: 0;

  color: #a086b4;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.lc-story h2 {
  margin: 6px 0 4px;

  font-family: "Allura", cursive;
  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: #584a5b;
}

.lc-quote {
  height: 35px;

  color: #b9a0d0;

  font: 64px Georgia, serif;
  line-height: 1;
}

.lc-story p {
  max-width: 400px;
  margin: 0 auto;

  font-size: clamp(15px, 4.2vw, 18px);
  font-style: italic;

  line-height: 1.7;
}

.lc-tail {
  margin-top: 18px;

  color: #a086b4;

  font-size: 15px;

  animation: lc-float 4s ease-in-out infinite;
}

@keyframes lc-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .lc-tail {
    animation: none;
  }
}
</style>
