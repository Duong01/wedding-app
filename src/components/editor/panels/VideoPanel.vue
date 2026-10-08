<template>
  <section class="editor-panel">
    <div class="panel-header panel-header-row">
      <div>
        <span class="panel-eyebrow"> VIDEO </span>

        <h1>{{ $t('editor.menu.video') }}</h1>

        <p>
          {{ $t('videoPanel.desc') }}
        </p>
      </div>

      <PanelProgressBadge
        :done="progress?.done || 0"
        :total="progress?.total || 0"
      />
    </div>

    <div class="switch-card">
      <div>
        <strong> {{ $t('videoPanel.show') }} </strong>

        <small>
          {{ $t('videoPanel.showHint') }}
        </small>
      </div>

      <v-switch
        v-model="wedding.settings.ShowVideo"
        color="primary"
        hide-details
      />
    </div>

    <div class="editor-field">
      <label>{{ $t('videoPanel.url') }}</label>

      <input
        v-model="wedding.video.Url"
        type="text"
        :placeholder="$t('videoPanel.urlPlaceholder')"
      />

      <small class="field-help">
        {{ $t('videoPanel.supported') }}
      </small>

      <small class="field-help">
        {{ $t('videoPanel.autoplayNote') }}
      </small>

      <small v-if="parseError" class="field-help field-error">
        {{ $t('videoPanel.unrecognized') }}
      </small>
    </div>

    <div class="editor-field">
      <label>{{ $t('editor.menu.sections') }}</label>

      <input
        v-model="wedding.video.Title"
        type="text"
        :placeholder="$t('videoPanel.titlePlaceholder')"
      />

      <small class="field-help">
        {{ $t('videoPanel.titleHint') }}
      </small>
    </div>

    <!-- =====================================================
         XEM TRƯỚC
    ====================================================== -->

    <div v-if="wedding.video.Url" class="video-preview">
      <h3 class="sub-heading">{{ $t('editor.preview') }}</h3>

      <VideoEmbed :url="wedding.video.Url" :title="wedding.video.Title" />
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import VideoEmbed from "@/components/common/VideoEmbed.vue";

import { parseVideoUrl } from "@/utils/videoEmbed"; import PanelProgressBadge from "@/components/editor/PanelProgressBadge.vue";

const props = defineProps({
  wedding: { type: Object, required: true },

  /* { done, total } từ Editor.vue — badge hoàn thiện mục. */
  progress: { type: Object, default: null },
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
