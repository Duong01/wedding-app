<template>
  <section class="lp-story">
    <div class="lp-section-title">
      <h2>{{ storyTitle || "CÂU CHUYỆN TÌNH YÊU" }}</h2>
    </div>

    <div class="lp-story__quote">“</div>

    <p class="lp-story__content">{{ content }}</p>

    <div class="lp-story__tail">❦</div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({ story: { type: [String, Object], default: "" } });

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

  color: #ffbe89;
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

  color: #ffbe89;
}

.lp-story__quote {
  height: 35px;

  color: rgba(255, 190, 137, 0.7);

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

  color: rgba(255, 190, 137, 0.85);
}

.lp-story__tail {
  margin-top: 14px;

  font-size: 15px;

  color: rgba(255, 190, 137, 0.6);
}
</style>
