<template>
  <section class="jp-story">
    <p v-if="eyebrow" class="jp-eyebrow">{{ eyebrow }}</p>

    <h2>{{ storyTitle }}</h2>

    <div class="jp-quote">“</div>

    <p>{{ content }}</p>

    <div class="jp-tail">❀</div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import { sectionText } from "@/data/sectionTitles";

const props = defineProps({
  story: { type: [String, Object], default: "" },
  sections: { type: Object, default: () => ({}) },
});

const content = computed(() =>
  typeof props.story === "string"
    ? props.story
    : props.story?.Content || props.story?.Description || props.story?.Text || ""
);

const eyebrow = computed(() =>
  sectionText(props.sections, "story", "Eyebrow", "CÂU CHUYỆN CỦA CHÚNG MÌNH")
);

/*
 * Tiêu đề ưu tiên giá trị đặt riêng ở panel "Tiêu đề mục",
 * nếu trống thì dùng story.Title như trước.
 */
const storyTitle = computed(() => {
  const override = sectionText(props.sections, "story", "Heading");

  if (override) {
    return override;
  }

  return typeof props.story === "object" ? props.story?.Title || "" : "";
});
</script>

<style scoped>
.jp-story {
  text-align: center;

  color: var(--tc-6e1f24, #6e1f24);
}

.jp-eyebrow {
  margin: 0;

  color: var(--tc-68262c, #68262c);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.jp-story h2 {
  margin: 6px 0 4px;

  font-family: "Allura", cursive;
  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: var(--tc-6e1f24, #6e1f24);
}

.jp-quote {
  height: 35px;

  color: var(--tc-6e2a30, #6e2a30);

  font: 64px Georgia, serif;
  line-height: 1;
}

.jp-story p {
  max-width: 400px;
  margin: 0 auto;

  font-size: clamp(15px, 4.2vw, 18px);
  font-style: italic;

  line-height: 1.7;
}

.jp-tail {
  margin-top: 18px;

  color: var(--tc-68262c, #68262c);

  font-size: 15px;

  animation: jp-float 4s ease-in-out infinite;
}

@keyframes jp-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .jp-tail {
    animation: none;
  }
}
</style>
