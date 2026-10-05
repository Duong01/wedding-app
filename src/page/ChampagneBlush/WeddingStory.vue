<template>
  <section class="cb-story">
    <p class="cb-eyebrow">{{ sectionText(sections, "story", "Eyebrow", $t("CÂU CHUYỆN CỦA CHÚNG MÌNH")) }}</p>

    <h2>{{ sectionText(sections, "story", "Heading", storyTitle) }}</h2>

    <div class="cb-quote">“</div>

    <p>{{ content }}</p>

    <div class="cb-tail">❀</div>
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
.cb-story {
  text-align: center;

  color: var(--tc-6c4b4a, #6c4b4a);
}

.cb-eyebrow {
  margin: 0;

  color: var(--tc-926664, #926664);

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

  color: var(--tc-6c4b4a, #6c4b4a);
}

.cb-quote {
  height: 35px;

  color: var(--tc-896d48, #896d48);

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

  color: var(--tc-926664, #926664);

  font-size: 15px;
}
</style>
