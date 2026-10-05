<template>
  <!--
    Mục video cưới — dùng chung cho mọi theme (import từ
    orchestrator, precedent FloatingMusic / SeasonFx).

    Tự gate: settings.ShowVideo === true và có link —
    orchestrator cũng gate ngoài (2 lớp như các mục khác).
  -->
  <section
    v-if="visible"
    ref="rootRef"
    class="video-section"
    :style="sectionStyle"
  >
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
import { computed, ref } from "vue";

import VideoEmbed from "@/components/common/VideoEmbed.vue";

import { sectionText } from "@/data/sectionTitles";

import { useSectionTheme } from "@/composables/useSectionTheme";
import { t } from "@/lang";
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
const rootRef = ref(null);

const { sectionStyle } = useSectionTheme(() => props.wedding, rootRef);

const video = computed(() => props.wedding?.video || {});

const visible = computed(
  () =>
    props.wedding?.settings?.ShowVideo === true &&
    !!(video.value?.Url || "").trim()
);

const eyebrow = computed(() =>
  sectionText(props.wedding?.sections, "video", "Eyebrow", t("KHOẢNH KHẮC YÊU THƯƠNG"))
);

const heading = computed(() =>
  sectionText(
    props.wedding?.sections,
    "video",
    "Heading",
    video.value?.Title || t("Video Cưới")
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

  /*
   * --sec-*: màu đã kiểm tra tương phản với nền THẬT phía
   * sau section của từng thiệp (xem useSectionTheme).
   */
  color: var(--sec-eyebrow, var(--text-secondary, #806f66));

  /* font-size: 10px; */
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.video-section__heading {
  margin: 0 0 18px;

  /*
   * Màu tường minh — h2 toàn cục (theme.css) lấy --primary,
   * trùng màu nền ở thiệp nền tối → tiêu đề tàng hình.
   */
  color: var(--sec-heading, var(--heading, var(--primary, #8a7a68)));

  /* font-family: var(--font-heading, Georgia, serif); */

  /* font-size: clamp(22px, 6vw, 30px); */
  font-weight: 600;
}

/* Gạch trang trí dưới tiêu đề — màu viền của thiệp */
.video-section__heading::after {
  content: "";

  display: block;

  width: 56px;
  height: 1px;

  margin: 12px auto 0;

  background: var(--sec-line, var(--accent, #c79d5c));
}

.video-section__body {
  width: 100%;
}

/* Khung video: viền mảnh màu thiệp tách iframe khỏi nền */
.video-section__body :deep(iframe) {
  box-shadow: 0 0 0 1px var(--sec-line, var(--accent, #c79d5c)),
    0 10px 28px rgba(0, 0, 0, 0.18);
}
</style>
