<template>
  <section class="la-story">
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'story', 'Eyebrow')" class="la-top-custom-head">
      <p v-if="sectionOverride(sections, 'story', 'Eyebrow')" class="la-top-custom-head__eyebrow">{{ sectionOverride(sections, "story", "Eyebrow") }}</p>
    </header>

    <h2 class="la-title">{{ sectionText(sections, "story", "Heading", storyTitle || $t("Chuyện tình yêu")) }}</h2>

    <div class="la-story__card">
      <span class="la-story__quote">“</span>

      <p class="la-story__text">{{ content }}</p>

      <span class="la-story__tail">✦</span>
    </div>
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
.la-story {
  text-align: center;
}

.la-story__card {
  position: relative;

  max-width: 420px;

  margin: 20px auto 0;
  padding: 24px 20px 18px;

  border: 1px solid var(--la-hairline);
  border-radius: 18px;

  background-color: var(--la-blush);
}

.la-story__quote {
  display: block;

  height: 28px;

  color: var(--la-red);

  font-family: Georgia, serif;
  font-size: 52px;
  line-height: 1;

  opacity: 0.5;
}

.la-story__text {
  max-width: 340px;
  margin: 0 auto;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 14px;
  font-style: italic;

  line-height: 1.75;
}

.la-story__tail {
  display: block;

  margin-top: 12px;

  color: var(--la-red);

  font-size: 12px;

  opacity: 0.7;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .la-story__card {
    max-width: 560px;

    padding: 30px 28px 22px;
  }

  .la-story__text {
    max-width: 440px;

    font-size: 16px;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.la-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.la-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.la-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.la-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
