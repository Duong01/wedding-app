<template>
  <section class="el-story">
    <p class="el-eyebrow">CÂU CHUYỆN CỦA CHÚNG MÌNH</p>

    <h2>{{ storyTitle }}</h2>

    <div class="el-quote">“</div>

    <p>{{ content }}</p>

    <div class="el-tail">❦</div>
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
.el-story {
  position: relative;

  text-align: center;

  color: #2e3d36;

  padding: 10px 22px;
}

/* Soft gold blob backdrop */
.el-story::before {
  content: "";
  position: absolute;

  top: 50%;
  left: 50%;

  width: min(88%, 420px);
  height: 78%;

  transform: translate(-50%, -50%) rotate(-2deg);

  border-radius: 60% 40% 55% 45% / 50% 55% 45% 50%;

  background: rgba(201, 164, 92, 0.14);

  pointer-events: none;
}

.el-eyebrow {
  position: relative;

  margin: 0;

  color: #8a7a52;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.el-story h2 {
  position: relative;

  margin: 6px 0 4px;

  font-family: "Great Vibes", cursive;
  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: #123b2e;
}

/* Big decorative quote mark */
.el-quote {
  position: relative;

  height: 35px;

  color: #c9a45c;

  font: 64px Georgia, serif;
  line-height: 1;

  transform: rotate(-4deg);
}

.el-story p {
  position: relative;

  max-width: 400px;
  margin: 0 auto;

  font-size: clamp(15px, 4.2vw, 18px);
  font-style: italic;

  line-height: 1.7;
}

.el-tail {
  position: relative;

  margin-top: 18px;

  color: #8a7a52;

  font-size: 15px;

  animation: el-tail-sway 5s ease-in-out infinite;
}

@keyframes el-tail-sway {
  0%,
  100% {
    transform: rotate(-8deg);
  }

  50% {
    transform: rotate(8deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .el-tail {
    animation: none;
  }
}
</style>
