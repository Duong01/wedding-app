<template>
  <section class="lp-story">
    <div class="lp-section-title">
      <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
      <header v-if="sectionOverride(sections, 'story', 'Eyebrow')" class="lp-top-custom-head">
        <p v-if="sectionOverride(sections, 'story', 'Eyebrow')" class="lp-top-custom-head__eyebrow">{{ sectionOverride(sections, "story", "Eyebrow") }}</p>
      </header>

      <h2>{{ sectionText(sections, "story", "Heading", storyTitle || "CÂU CHUYỆN TÌNH YÊU") }}</h2>
    </div>

    <div class="lp-story__quote">“</div>

    <p class="lp-story__content">{{ content }}</p>

    <div class="lp-story__tail">❦</div>
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
.lp-story {
  position: relative;

  padding: 30px 22px;

  text-align: center;

  color: var(--tc-ffbe89, #ffbe89);
}

/* Tiêu đề có khung frame-title */
.lp-section-title {
  width: fit-content;
  max-width: 100%;

  margin: 0 auto 14px;

  border-style: solid;
  border-color: transparent;
  border-width: 18px;

  border-image-source: url("@/assets/decor/longphung-v3/frame-title.svg");
  border-image-slice: 31;
  border-image-repeat: stretch;

  text-align: center;
}

.lp-section-title h2 {
  margin: 0;

  font-family: "Times New Roman", Times, serif;

  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.05em;

  color: var(--tc-ffbe89, #ffbe89);
}

.lp-story__quote {
  height: 35px;

  color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.7);

  font-family: Georgia, serif;
  font-size: 64px;
  line-height: 1;

  transform: rotate(-4deg);
}

.lp-story__content {
  max-width: 460px;

  margin: 0 auto;

  font-size: 14px;

  line-height: 1.9;

  white-space: pre-line;

  color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.85);
}

.lp-story__tail {
  margin-top: 14px;

  font-size: 15px;

  color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.6);
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.lp-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.lp-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: var(--tc-ffbe89, #ffbe89);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.lp-top-custom-head__heading {
  margin: 0;
  color: var(--tc-ffbe89, #ffbe89);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.lp-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.85);
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
