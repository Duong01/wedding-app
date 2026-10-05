<template>
  <section class="shc-story">
    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'story', 'Eyebrow')" class="shc-top-custom-head">
      <p v-if="sectionOverride(sections, 'story', 'Eyebrow')" class="shc-top-custom-head__eyebrow">{{ sectionOverride(sections, "story", "Eyebrow") }}</p>
    </header>

    <h2 class="shc-story__bar">{{ sectionText(sections, "story", "Heading", $t("CÂU CHUYỆN CỦA CHÚNG MÌNH")) }}</h2>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="shc-story__inner">
      <h3 v-if="storyTitle" class="shc-story__title">{{ storyTitle }}</h3>

      <p class="shc-story__quote" aria-hidden="true">“</p>

      <p class="shc-story__content">{{ content }}</p>

      <p class="shc-story__tail" aria-hidden="true">❦</p>
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
.shc-story {
  --shc-red: var(--primary, #920002);
  --shc-cream: var(--accent, #ffe8a4);
  --shc-frame-red: var(--secondary, #990000);

  position: relative;

  overflow: hidden;

  margin-top: 23px;

  color: var(--shc-cream);

  background-color: var(--shc-red);

  font-family: "Times New Roman", Times, serif;
}

/* =========================================================
   THANH TIÊU ĐỀ
========================================================= */

.shc-story__bar {
  margin: 0;

  padding: 12px 16px;

  color: var(--shc-cream);

  font-family: "Times New Roman", Times, serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-align: center;
  text-transform: uppercase;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.shc-story__inner {
  width: min(100%, 441px);

  margin: 0 auto;

  padding: 28px 8px 36px;

  text-align: center;
}

.shc-story__title {
  margin: 0 0 4px;

  color: var(--shc-cream);

  font-family: "Carattere", "Times New Roman", serif;
  font-size: 30px;
  font-weight: 500;

  line-height: 1.2;
}

.shc-story__quote {
  height: 30px;

  margin: 0;

  color: color-mix(in srgb, var(--shc-cream) 35%, transparent);

  font-family: Georgia, serif;
  font-size: 58px;

  line-height: 1;
}

.shc-story__content {
  max-width: 400px;
  margin: 0 auto;

  color: var(--shc-cream);

  font-size: 15px;
  font-style: italic;

  line-height: 1.7;

  white-space: pre-line;
}

.shc-story__tail {
  margin: 18px 0 0;

  color: var(--shc-cream);

  font-size: 15px;

  letter-spacing: 0.2em;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shc-story__bar {
    padding: 16px;

    font-size: 24px;
  }

  .shc-story__inner {
    width: min(100%, 600px);

    padding: 36px 5px 44px;
  }

  .shc-story__title {
    font-size: 40px;
  }

  .shc-story__content {
    font-size: 19px;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.shc-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.shc-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.shc-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.shc-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
