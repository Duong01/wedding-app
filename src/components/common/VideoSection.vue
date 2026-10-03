<template>
  <!--
    Mục video cưới — dùng chung cho mọi theme (import từ
    orchestrator, precedent FloatingMusic / SeasonFx).

    Tự gate: settings.ShowVideo === true và có link —
    orchestrator cũng gate ngoài (2 lớp như các mục khác).
  -->
  <section v-if="visible" class="video-section" :style="sectionStyle">
    <header v-if="eyebrow || heading" class="video-section__head">
      <p v-if="eyebrow" class="video-section__eyebrow">{{ eyebrow }}</p>

      <h2 v-if="heading" class="video-section__heading">{{ heading }}</h2>
    </header>

    <div class="video-section__body">
      <VideoEmbed :url="video.Url" :title="heading" />
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import VideoEmbed from "@/components/common/VideoEmbed.vue";

import { sectionText } from "@/data/sectionTitles";

import { useSectionTheme } from "@/composables/useSectionTheme";

const props = defineProps({
  /*
   * Nhận cả object wedding — prop duy nhất mọi orchestrator
   * có sẵn (PreviewRenderer cũng chỉ truyền :wedding).
   */
  wedding: { type: Object, required: true },
});

/*
 * Gắn bảng màu của thiệp lên gốc section — 15/26 theme
 * không có pipeline màu nên video không còn rơi về bảng
 * :root đỏ son của theme.css (xem useSectionTheme).
 */
const { sectionStyle } = useSectionTheme(() => props.wedding);

const video = computed(() => props.wedding?.video || {});

const visible = computed(
  () =>
    props.wedding?.settings?.ShowVideo === true &&
    !!(video.value?.Url || "").trim()
);

const eyebrow = computed(() =>
  sectionText(props.wedding?.sections, "video", "Eyebrow", "KHOẢNH KHẮC YÊU THƯƠNG")
);

const heading = computed(() =>
  sectionText(
    props.wedding?.sections,
    "video",
    "Heading",
    video.value?.Title || "Video Cưới"
  )
);
</script>

<style scoped>
.video-section {
  width: min(100%, 640px);

  margin: 0 auto;

  /*
   * Padding dọc CỐ ĐỊNH — không dùng --section-padding (một
   * số theme đặt 80–85px khiến mục video trống quá xa các
   * mục quanh nó).
   */
  padding: 28px 16px;

  text-align: center;
}

.video-section__eyebrow {
  margin: 0 0 6px;

  /* color: var(--text-secondary, #806f66); */

  /* font-size: 10px; */
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.video-section__heading {
  margin: 0 0 18px;

  /* color: var(--heading, var(--primary, #8a7a68)); */

  /* font-family: var(--font-heading, Georgia, serif); */

  /* font-size: clamp(22px, 6vw, 30px); */
  font-weight: 600;
}

.video-section__body {
  width: 100%;
}
</style>
