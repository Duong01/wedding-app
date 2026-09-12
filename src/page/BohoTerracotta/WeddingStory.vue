<template>
  <section class="bt-story">
    <p class="bt-eyebrow">CÂU CHUYỆN CỦA CHÚNG MÌNH</p>

    <h2>{{ storyTitle }}</h2>

    <div class="bt-quote">“</div>

    <p>{{ content }}</p>

    <div class="bt-tail">❋</div>
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
.bt-story {
  position: relative;

  text-align: center;

  color: #5c4636;

  padding: 10px 22px;
}

/* Organic blob backdrop */
.bt-story::before {
  content: "";
  position: absolute;

  top: 50%;
  left: 50%;

  width: min(88%, 420px);
  height: 78%;

  transform: translate(-50%, -50%) rotate(-2deg);

  border-radius: 60% 40% 55% 45% / 50% 55% 45% 50%;

  background: rgba(242, 226, 208, 0.4);

  pointer-events: none;
}

.bt-eyebrow {
  position: relative;

  margin: 0;

  color: #8a9b7c;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.bt-story h2 {
  position: relative;

  margin: 6px 0 4px;

  font-family: "Allura", cursive;
  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: #9c5b3f;
}

/* Big decorative quote mark */
.bt-quote {
  position: relative;

  height: 35px;

  color: #c97b5d;

  font: 64px Georgia, serif;
  line-height: 1;

  transform: rotate(-4deg);
}

.bt-story p {
  position: relative;

  max-width: 400px;
  margin: 0 auto;

  font-size: clamp(15px, 4.2vw, 18px);
  font-style: italic;

  line-height: 1.7;
}

.bt-tail {
  position: relative;

  margin-top: 18px;

  color: #8a9b7c;

  font-size: 15px;

  animation: bt-tail-sway 5s ease-in-out infinite;
}

@keyframes bt-tail-sway {
  0%,
  100% {
    transform: rotate(-8deg);
  }

  50% {
    transform: rotate(8deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .bt-tail {
    animation: none;
  }
}
</style>
