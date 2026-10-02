<template>
  <!--
    Chuyện tình yêu dạng dấu mốc (story.Mode === 'milestones').

    Timeline dọc: rail bên trái + chấm, mỗi mốc có badge ngày,
    tiêu đề, mô tả và ảnh (nếu có). Dùng chung mọi theme —
    orchestrator chọn giữa component này và WeddingStory cũ.
  -->
  <section class="story-milestones">
    <header v-if="eyebrow || heading" class="story-milestones__head">
      <p v-if="eyebrow" class="story-milestones__eyebrow">{{ eyebrow }}</p>

      <h2 v-if="heading" class="story-milestones__heading">{{ heading }}</h2>
    </header>

    <ol class="story-milestones__list">
      <li
        v-for="(item, index) in milestones"
        :key="item.Id || index"
        class="story-milestones__item"
      >
        <span class="story-milestones__dot" aria-hidden="true"></span>

        <div class="story-milestones__card">
          <span v-if="item.Date" class="story-milestones__date">
            {{ item.Date }}
          </span>

          <h3 v-if="item.Title" class="story-milestones__title">
            {{ item.Title }}
          </h3>

          <img
            v-if="item.Image"
            :src="item.Image"
            :alt="item.Title || 'Khoảnh khắc'"
            class="story-milestones__image"
            loading="lazy"
          />

          <p v-if="item.Description" class="story-milestones__desc">
            {{ item.Description }}
          </p>
        </div>
      </li>
    </ol>
  </section>
</template>

<script setup>
import { computed } from "vue";

import { sectionText } from "@/data/sectionTitles";

const props = defineProps({
  wedding: { type: Object, required: true },
});

const milestones = computed(() =>
  Array.isArray(props.wedding?.storyMilestones)
    ? props.wedding.storyMilestones
    : []
);

const eyebrow = computed(() =>
  sectionText(
    props.wedding?.sections,
    "story",
    "Eyebrow",
    "CÂU CHUYỆN CỦA CHÚNG MÌNH"
  )
);

const heading = computed(() =>
  sectionText(
    props.wedding?.sections,
    "story",
    "Heading",
    props.wedding?.story?.Title || "Chuyện Tình Yêu"
  )
);
</script>

<style scoped>
.story-milestones {
  width: min(100%, 640px);

  margin: 0 auto;

  /*
   * Padding dọc CỐ ĐỊNH — không dùng --section-padding (một
   * số theme đặt 80–85px khiến mục trống quá xa các mục
   * quanh nó), đồng bộ với VideoSection / GameSection.
   */
  padding: 28px 16px;

  text-align: center;
}

.story-milestones__eyebrow {
  margin: 0 0 6px;

  color: var(--text-secondary, #806f66);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.story-milestones__heading {
  margin: 0 0 24px;

  color: var(--heading, var(--primary, #8a7a68));

  font-family: var(--font-heading, Georgia, serif);

  font-size: clamp(22px, 6vw, 30px);
  font-weight: 600;
}

.story-milestones__list {
  position: relative;

  margin: 0;
  padding: 0 0 0 26px;

  list-style: none;

  text-align: left;
}

/* Rail dọc */
.story-milestones__list::before {
  content: "";

  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 7px;

  width: 1px;

  background: var(--accent, #c79d5c);

  opacity: 0.5;
}

.story-milestones__item {
  position: relative;

  margin-bottom: 22px;
}

.story-milestones__dot {
  position: absolute;
  top: 6px;
  left: -26px;

  width: 15px;
  height: 15px;

  border: 2px solid var(--accent, #c79d5c);
  border-radius: 50%;

  background: var(--white, #fffaf4);

  box-shadow: 0 0 0 4px rgba(199, 157, 92, 0.15);
}

.story-milestones__card {
  padding: 14px 18px;

  border: 1px solid var(--accent, #c79d5c);
  border-radius: 14px;

  background: var(--surface, var(--white, #fffaf4));
}

.story-milestones__date {
  display: inline-block;

  margin-bottom: 6px;
  padding: 3px 10px;

  color: var(--primary, #8a7a68);

  border-radius: 999px;

  background: var(--accent-light, #f7d8a3);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.06em;
}

.story-milestones__title {
  margin: 0 0 8px;

  color: var(--heading, var(--primary, #8a7a68));

  font-family: var(--font-heading, Georgia, serif);

  font-size: 19px;
  font-weight: 600;
}

.story-milestones__image {
  width: 100%;

  margin-bottom: 10px;

  border-radius: 10px;

  object-fit: cover;
}

.story-milestones__desc {
  margin: 0;

  color: var(--text, #5c4d46);

  font-size: 14px;
  line-height: 1.65;

  white-space: pre-line;
}
</style>
