<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> VIDEO </span>

        <h1>Video cưới</h1>

        <p>
          Dán link YouTube hoặc TikTok — video phát ngay trong
          thiệp.
        </p>
      </div>
    </div>

    <div class="switch-card">
      <div>
        <strong> Hiển thị mục video </strong>

        <small>
          Khách mời xem video ngay trên thiệp, không cần rời
          trang.
        </small>
      </div>

      <v-switch
        v-model="wedding.settings.ShowVideo"
        color="primary"
        hide-details
      />
    </div>

    <div class="editor-field">
      <label>Đường link video</label>

      <input
        v-model="wedding.video.Url"
        type="text"
        placeholder="Dán link YouTube hoặc TikTok..."
      />

      <small class="field-help">
        Hỗ trợ: youtube.com/watch?v=… · youtu.be/… ·
        youtube.com/shorts/… · tiktok.com/@user/video/…
      </small>

      <small class="field-help">
        Video tự phát khi khách lướt tới, ở chế độ tắt tiếng
        (trình duyệt chặn tự phát có tiếng) — khách bấm icon
        loa trên player để nghe.
      </small>

      <small v-if="parseError" class="field-help field-error">
        Link chưa nhận diện được — thiệp sẽ hiện nút mở video
        trong tab mới.
      </small>
    </div>

    <div class="editor-field">
      <label>Tiêu đề mục</label>

      <input
        v-model="wedding.video.Title"
        type="text"
        placeholder="VD: Video cưới của chúng mình"
      />

      <small class="field-help">
        Bỏ trống dùng "Video Cưới". Đổi được ở panel "Tiêu đề
        mục".
      </small>
    </div>

    <!-- =====================================================
         XEM TRƯỚC
    ====================================================== -->

    <div v-if="wedding.video.Url" class="video-preview">
      <h3 class="sub-heading">Xem trước</h3>

      <VideoEmbed :url="wedding.video.Url" :title="wedding.video.Title" />
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import VideoEmbed from "@/components/common/VideoEmbed.vue";

import { parseVideoUrl } from "@/utils/videoEmbed";

const props = defineProps({
  wedding: { type: Object, required: true },
});

/*
 * Cảnh báo nhẹ khi link không parse được — vẫn cho lưu
 * (VideoEmbed có fallback link thường).
 */
const parseError = computed(
  () => !!(props.wedding.video?.Url || "").trim() && !parseVideoUrl(props.wedding.video.Url)
);
</script>

<style scoped>
.video-preview {
  margin-top: 8px;
}

.field-error {
  color: #b3541e;
}
</style>
