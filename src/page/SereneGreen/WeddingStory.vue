<template>
  <section class="sg-story">
    <p class="sg-eyebrow">{{ sectionText(sections, "story", "Eyebrow", "CÂU CHUYỆN CỦA CHÚNG MÌNH") }}</p>

    <h2>{{ sectionText(sections, "story", "Heading", storyTitle) }}</h2>

    <div class="sg-quote">“</div>

    <p>{{ content }}</p>

    <div class="sg-tail">❀</div>
  </section>
</template>

<script setup>
import { sectionText } from "@/data/sectionTitles";
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
.sg-story {
  text-align: center;

  color: var(--tc-28514b, #28514b);
}

.sg-eyebrow {
  margin: 0;

  color: var(--tc-567262, #567262);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.sg-story h2 {
  margin: 6px 0 4px;

  font-family: "Allura", cursive;
  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: var(--tc-28514b, #28514b);
}

.sg-quote {
  height: 35px;

  color: var(--tc-5a6e62, #5a6e62);

  font: 64px Georgia, serif;
  line-height: 1;
}

.sg-story p {
  max-width: 400px;
  margin: 0 auto;

  font-size: clamp(15px, 4.2vw, 18px);
  font-style: italic;

  line-height: 1.7;
}

.sg-tail {
  margin-top: 18px;

  color: var(--tc-567262, #567262);

  font-size: 15px;
}
</style>
