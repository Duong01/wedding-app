<template>
  <section class="dh-story">
    <p v-if="eyebrow" class="dh-eyebrow">{{ eyebrow }}</p>

    <h2>{{ storyTitle }}</h2>

    <div class="dh-quote">“</div>

    <p>{{ content }}</p>

    <div class="dh-tail">囍</div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import { sectionText } from "@/data/sectionTitles";
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
  sectionText(props.sections, "story", "Eyebrow", t("CÂU CHUYỆN CỦA CHÚNG MÌNH"))
);

/*
 * Tiêu đề ưu tiên giá trị đặt riêng ở panel "Tên mục",
 * nếu trống thì dùng story.Title như trước.
 */
const storyTitle = computed(() => {
  const fallback = typeof props.story === "object" ? props.story?.Title || "" : "";

  return sectionText(props.sections, "story", "Heading", fallback);
});
</script>

<style scoped>
.dh-story {
  --dh-red: var(--tc-7a1216, #7a1216);
  --dh-red-bright: var(--tc-a32a2a, #a32a2a);
  --dh-gold: var(--tc-d9a441, #d9a441);
  --dh-gold-light: var(--tc-f3d9a4, #f3d9a4);
  --dh-cream-on-red: var(--tc-f7e6c4, #f7e6c4);

  text-align: center;

  color: rgba(var(--tc-f7e6c4-rgb, 247, 230, 196), 0.85);
}

.dh-eyebrow {
  margin: 0;

  color: var(--dh-gold-light);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.dh-story h2 {
  margin: 6px 0 4px;

  font-family: "Allura", cursive;
  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: var(--dh-cream-on-red);
}

.dh-quote {
  height: 35px;

  color: var(--dh-gold);

  font: 64px Georgia, serif;
  line-height: 1;
}

.dh-story p {
  max-width: 400px;
  margin: 0 auto;

  font-size: clamp(15px, 4.2vw, 18px);
  font-style: italic;

  line-height: 1.7;
}

.dh-tail {
  margin-top: 18px;

  color: var(--dh-gold);

  font-size: 16px;
}
</style>
