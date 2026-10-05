<template>
  <!--
    Nhúng video YouTube/TikTok từ link người dùng dán —
    iframe hiện ngay như bản đồ (không cần bấm poster).

    YouTube: autoplay + mute (trình duyệt chỉ cho autoplay
    trong iframe cross-origin khi tắt tiếng — khách bấm icon
    loa trên player để bật tiếng).
  -->
  <div class="video-embed" :class="`video-embed--${parsed?.provider || 'unknown'}`">
    <iframe
      v-if="parsed"
      :src="autoplayUrl(parsed.embedUrl)"
      :title="title || $t('Video cưới')"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      loading="lazy"
    ></iframe>

    <!--
      Link không nhận diện được — fallback link thường để
      khách vẫn mở được video, không để mục chết.
    -->
    <a
      v-else-if="url"
      :href="url"
      target="_blank"
      rel="noopener noreferrer"
      class="video-embed__link"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
      </svg>

      {{ title || "Xem video" }}
    </a>
  </div>
</template>

<script setup>
import { computed } from "vue";

import { autoplayUrl, parseVideoUrl } from "@/utils/videoEmbed";
const props = defineProps({
  url: { type: String, default: "" },

  title: { type: String, default: "" },
});

const parsed = computed(() => parseVideoUrl(props.url));
</script>

<style scoped>
.video-embed {
  width: 100%;
}

/* YouTube: ngang 16/9 */
.video-embed--youtube iframe {
  width: 100%;

  aspect-ratio: 16 / 9;

  border: 0;
  border-radius: 14px;

  overflow: hidden;
}

/* TikTok: dọc 9/16 — giới hạn chiều cao cho vừa màn hình */
.video-embed--tiktok iframe {
  width: min(100%, 320px);

  max-height: 70vh;

  aspect-ratio: 9 / 16;

  margin: 0 auto;

  border: 0;
  border-radius: 14px;

  overflow: hidden;
}

.video-embed__link {
  display: inline-flex;

  align-items: center;
  gap: 8px;

  padding: 12px 18px;

  /*
   * Nút đặc --btn-*: nền sáng → khối đậm chữ kem, nền tối
   * → khối vàng chữ tối (đã kiểm tra tương phản, xem
   * useSectionTheme).
   */
  color: var(--btn-ink, #fff);

  border: 0;
  border-radius: 999px;

  background: var(--btn-bg, var(--primary, #8a7a68));

  font-weight: 700;

  text-decoration: none;
}

.video-embed__link svg {
  width: 18px;
  height: 18px;
}
</style>