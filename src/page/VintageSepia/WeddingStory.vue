<template>
  <section class="vs-story">
    <p class="vs-eyebrow">CÂU CHUYỆN CỦA CHÚNG MÌNH</p>

    <h2>{{ storyTitle }}</h2>

    <div class="vs-quote">“</div>

    <p>{{ content }}</p>

    <div class="vs-tail">❦</div>
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
.vs-story {
  position: relative;

  max-width: 520px;

  margin: 0 auto;

  padding: 30px 26px 26px;

  text-align: center;

  color: #4a3a2c;

  background: rgba(255, 253, 246, 0.6);

  border: 1px solid rgba(107, 79, 58, 0.3);
  border-radius: 10px;

  box-shadow: 0 12px 30px rgba(61, 47, 36, 0.08);

  transform: rotate(-0.6deg);
}

.vs-story::before {
  content: "";
  position: absolute;
  inset: 7px;

  border: 1px dashed rgba(107, 79, 58, 0.25);
  border-radius: 6px;

  pointer-events: none;
}

/* Tape strips holding the note down */
.vs-story::after {
  content: "";
  position: absolute;

  top: -12px;
  left: 50%;

  width: 110px;
  height: 26px;

  transform: translateX(-50%) rotate(-2deg);

  background: rgba(194, 168, 120, 0.35);

  box-shadow: 0 1px 3px rgba(61, 47, 36, 0.12);

  pointer-events: none;
}

.vs-eyebrow {
  margin: 0;

  color: #97745a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.vs-story h2 {
  margin: 6px 0 4px;

  font-family: "Allura", cursive;
  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: #4a3a2c;
}

.vs-quote {
  height: 35px;

  color: #c2a878;

  font: 64px Georgia, serif;
  line-height: 1;
}

.vs-story p {
  max-width: 400px;
  margin: 0 auto;

  font-size: clamp(15px, 4.2vw, 18px);
  font-style: italic;

  line-height: 1.7;
}

.vs-tail {
  margin-top: 18px;

  color: #97745a;

  font-size: 15px;
}
</style>
