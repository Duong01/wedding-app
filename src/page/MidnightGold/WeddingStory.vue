<template>
  <section class="mg-story">
    <p v-if="sectionOverride(sections, 'story', 'Eyebrow')" class="mg-eyebrow">{{ sectionOverride(sections, "story", "Eyebrow") }}</p>

    <h2>{{ sectionText(sections, "story", "Heading", storyTitle) }}</h2>

    <div class="mg-quote">“</div>

    <p>{{ content }}</p>

    <div class="mg-tail">✧</div>
  </section>
</template>

<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { computed } from "vue";
const props = defineProps({ sections: { type: Object, default: () => ({}) }, story: { type: [String, Object], default: "" } });

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
.mg-story {
  text-align: center;

  color: var(--tc-f0e6d2, #f0e6d2);
}

.mg-eyebrow {
  margin: 0;

  color: var(--tc-d8b676, #d8b676);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.mg-story h2 {
  margin: 6px 0 4px;

  font-family: "Allura", cursive;
  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: var(--tc-d8b676, #d8b676);
}

.mg-quote {
  height: 35px;

  color: var(--tc-d8b676, #d8b676);

  font: 64px Georgia, serif;
  line-height: 1;
}

.mg-story p {
  max-width: 400px;
  margin: 0 auto;

  font-size: clamp(15px, 4.2vw, 18px);
  font-style: italic;

  line-height: 1.7;

  color: rgba(var(--tc-f0e6d2-rgb, 240, 230, 210), 0.85);
}

.mg-tail {
  margin-top: 18px;

  color: var(--tc-d8b676, #d8b676);

  font-size: 15px;
}
</style>
