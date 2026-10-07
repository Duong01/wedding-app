<template>
  <section class="lc-story">
    <p v-if="eyebrow" class="lc-eyebrow">{{ eyebrow }}</p>

    <h2>{{ storyTitle }}</h2>

    <div class="lc-quote">“</div>

    <p>{{ content }}</p>

    <div class="lc-tail">❀</div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { t } from "@/lang";
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
  sectionOverride(props.sections, "story", "Eyebrow")
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
.lc-story {
  text-align: center;

  color: var(--tc-584a5b, #584a5b);
}

.lc-eyebrow {
  margin: 0;

  color: var(--tc-766384, #766384);

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

  color: var(--tc-584a5b, #584a5b);
}

.lc-quote {
  height: 35px;

  color: var(--tc-736482, #736482);

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

  color: var(--tc-766384, #766384);

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
