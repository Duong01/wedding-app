<template>
  <section class="mw-story">
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'story', 'Eyebrow')" class="mw-top-custom-head">
      <p v-if="sectionOverride(sections, 'story', 'Eyebrow')" class="mw-top-custom-head__eyebrow">{{ sectionOverride(sections, "story", "Eyebrow") }}</p>
    </header>

    <h2 class="mw-title">{{ sectionText(sections, "story", "Heading", title) }}</h2>

    <div class="mw-story__card">
      <span class="mw-story__quote" aria-hidden="true">“</span>

      <p class="mw-story__text">{{ storyText }}</p>

      <span class="mw-story__tail" aria-hidden="true">✦</span>
    </div>
  </section>
</template>

<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { computed } from "vue";

const props = defineProps({
  sections: { type: Object, default: () => ({}) },
  story: {
    type: [String, Object],
    default: "",
  },
});

const title = computed(() => {
  if (typeof props.story === "object" && props.story?.Title) {
    return props.story.Title;
  }

  return "Chuyện tình yêu";
});

const storyText = computed(() => {
  if (typeof props.story === "string") {
    return props.story;
  }

  return (
    props.story?.Content ||
    props.story?.Description ||
    props.story?.Text ||
    ""
  );
});
</script>

<style scoped>
.mw-story {
  text-align: center;
}

.mw-story__card {
  position: relative;

  max-width: 420px;

  margin: 24px auto 0;
  padding: 34px 24px 26px;

  border: 1px solid var(--mw-hairline);
  border-radius: 18px;

  background-color: var(--mw-blue-mist);
}

.mw-story__quote {
  position: absolute;
  top: 4px;
  left: 16px;

  color: var(--mw-blue);

  font-family: Georgia, serif;
  font-size: 52px;

  line-height: 1;

  opacity: 0.5;
}

.mw-story__text {
  margin: 0;

  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 14px;
  font-style: italic;
  font-weight: 400;

  letter-spacing: 0.03em;
  line-height: 1.8;
  white-space: pre-line;
}

.mw-story__tail {
  display: block;

  margin-top: 16px;

  color: var(--mw-blue-soft);

  font-size: 12px;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .mw-story__card {
    max-width: 600px;

    padding: 44px 40px 32px;
  }

  .mw-story__text {
    font-size: 16px;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.mw-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.mw-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.mw-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.mw-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
