<template>
  <section class="timeline">
    <div class="timeline-title">
      <small>OUR JOURNEY</small>
      <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
      <header v-if="sectionOverride(sections, 'timeline', 'Eyebrow')" class="ds-top-custom-head">
        <p v-if="sectionOverride(sections, 'timeline', 'Eyebrow')" class="ds-top-custom-head__eyebrow">{{ sectionOverride(sections, "timeline", "Eyebrow") }}</p>
      </header>

      <h2>{{ sectionText(sections, "timeline", "Heading", $t("Hành trình của chúng mình")) }}</h2>
      <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
      <header v-if="sectionOverride(sections, 'timeline', 'Intro')" class="ds-sub-custom-head">
        <p v-if="sectionOverride(sections, 'timeline', 'Intro')" class="ds-sub-custom-head__intro">{{ sectionOverride(sections, "timeline", "Intro") }}</p>
      </header>

    </div>

    <div class="timeline-list">
      <article
        v-for="(item, index) in items"
        :key="item.id || index"
        class="timeline-item"
      >
        <div class="timeline-marker">
          {{ String(index + 1).padStart(2, "0") }}
        </div>

        <div class="timeline-content">
          <span>
            {{ item.Date || item.Time || "" }}
          </span>

          <h3>
            {{ item.Title || item.Name || $t("Một dấu mốc đáng nhớ") }}
          </h3>

          <p>
            {{ item.Content || item.Description || "" }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { computed } from "vue";
const props = defineProps({
  sections: { type: Object, default: () => ({}) },
  timeline: {
    type: Array,
    default: () => [],
  },
  events: {
    type: Array,
    default: () => [],
  },
});

const items = computed(() => {
  if (props.timeline.length) return props.timeline;
  return props.events;
});
</script>

<style scoped>
.timeline {
  padding: 70px 22px;
  background: var(--tc-f3ead8, #f3ead8);
  color: var(--tc-641914, #641914);
}

.timeline-title {
  text-align: center;
  margin-bottom: 45px;
}

.timeline-title small {
  color: var(--tc-8b5829, #8b5829);
  font-size: 10px;
  letter-spacing: .4em;
}

h2 {
  font-family: Georgia, serif;
  font-size: 29px;
  font-weight: 400;
}

.timeline-list {
  position: relative;
  max-width: 580px;
  margin: auto;
}

.timeline-list::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 24px;
  width: 1px;
  background: var(--tc-8b5829, #8b5829);
}

.timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: 50px 1fr;
  gap: 18px;
  margin-bottom: 32px;
}

.timeline-marker {
  position: relative;
  z-index: 2;
  width: 49px;
  height: 49px;
  display: grid;
  place-items: center;
  border: 1px solid var(--tc-8b5829, #8b5829);
  border-radius: 50%;
  background: var(--tc-f3ead8, #f3ead8);
  color: var(--tc-8b5829, #8b5829);
  font-size: 10px;
}

.timeline-content {
  position: relative;
  padding: 16px 18px;
  border: 1px solid rgba(var(--tc-8f241c-rgb, 143, 36, 28), .5);
  background: var(--tc-fffaf0, #fffaf0);
  box-shadow: 0 8px 20px rgba(var(--tc-54120f-rgb, 84, 18, 15), .12);
}

.timeline-content::before {
  content: "";
  position: absolute;
  inset: 5px;
  border: 1px solid rgba(var(--tc-a96b32-rgb, 169, 107, 50), .35);
  pointer-events: none;
}

.timeline-content > span {
  font-size: 10px;
  letter-spacing: .25em;
  color: var(--tc-8b5829, #8b5829);
}

.timeline-content h3 {
  margin: 8px 0;
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: 400;
}

.timeline-content p {
  margin: 0;
  color: var(--tc-765f57, #765f57);
  font-family: Georgia, serif;
  font-size: 13px;
  line-height: 1.8;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.ds-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.ds-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ds-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.ds-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.ds-sub-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.ds-sub-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ds-sub-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.ds-sub-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>