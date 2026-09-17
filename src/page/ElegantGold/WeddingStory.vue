<template>
  <section class="eg-story">
    <p class="eg-eyebrow">CÂU CHUYỆN CỦA CHÚNG MÌNH</p>

    <h2>{{ storyTitle }}</h2>

    <div class="eg-quote">“</div>

    <p>{{ content }}</p>

    <div class="eg-tail">❦</div>
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
  typeof props.story === "object" ? props.story?.Title || "" : ""
);
</script>

<style scoped>
.eg-story {
  position: relative;

  text-align: center;

  color: #5f4f38;

  padding: 10px 22px;
}

/* Soft gold blob backdrop */
.eg-story::before {
  content: "";
  position: absolute;

  top: 50%;
  left: 50%;

  width: min(88%, 420px);
  height: 78%;

  transform: translate(-50%, -50%) rotate(-2deg);

  border-radius: 60% 40% 55% 45% / 50% 55% 45% 50%;

  background: rgba(181, 138, 69, 0.14);

  pointer-events: none;
}

.eg-eyebrow {
  position: relative;

  margin: 0;

  color: #8a7a52;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.eg-story h2 {
  position: relative;

  margin: 6px 0 4px;

  font-family: "Great Vibes", cursive;
  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: #5d452a;
}

/* Big decorative quote mark */
.eg-quote {
  position: relative;

  height: 35px;

  color: #b58a45;

  font: 64px Georgia, serif;
  line-height: 1;

  transform: rotate(-4deg);
}

.eg-story p {
  position: relative;

  max-width: 400px;
  margin: 0 auto;

  font-size: clamp(15px, 4.2vw, 18px);
  font-style: italic;

  line-height: 1.7;
}

.eg-tail {
  position: relative;

  margin-top: 18px;

  color: #8a7a52;

  font-size: 15px;

  animation: eg-tail-sway 5s ease-in-out infinite;
}

@keyframes eg-tail-sway {
  0%,
  100% {
    transform: rotate(-8deg);
  }

  50% {
    transform: rotate(8deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .eg-tail {
    animation: none;
  }
}
</style>
