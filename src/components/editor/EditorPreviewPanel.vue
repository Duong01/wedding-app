<template>
  <aside class="editor-preview">
    <div class="preview-toolbar">
      <div class="preview-title">
        <span>LIVE PREVIEW</span>

        <strong>
          {{ themeName }}
        </strong>
      </div>

      <div class="preview-actions">
        <button
          type="button"
          class="preview-icon-button"
          :class="{ active: autoRefresh }"
          :title="
            autoRefresh
              ? 'Đang tự động cập nhật — bấm để tạm dừng'
              : 'Đang tạm dừng — bấm để tự động cập nhật'
          "
          @click="emit('update:autoRefresh', !autoRefresh)"
        >
          <v-icon size="17">
            {{ autoRefresh ? "mdi-sync" : "mdi-sync-off" }}
          </v-icon>
        </button>

        <button
          type="button"
          class="preview-icon-button"
          title="Tải lại bản xem trước"
          @click="reload"
        >
          <v-icon size="17"> mdi-refresh </v-icon>
        </button>

        <button
          type="button"
          class="preview-icon-button"
          title="Mở thiệp trong tab mới"
          @click="openInNewTab"
        >
          <v-icon size="17"> mdi-open-in-new </v-icon>
        </button>

        <div class="preview-device">
          <button
            type="button"
            :class="{
              active: previewDevice === 'mobile',
            }"
            title="Xem trên điện thoại (375px)"
            @click="emit('update:previewDevice', 'mobile')"
          >
            <v-icon size="18"> mdi-cellphone </v-icon>
          </button>

          <button
            type="button"
            :class="{
              active: previewDevice === 'tablet',
            }"
            title="Xem trên tablet (768px)"
            @click="emit('update:previewDevice', 'tablet')"
          >
            <v-icon size="18"> mdi-tablet </v-icon>
          </button>

          <button
            type="button"
            :class="{
              active: previewDevice === 'desktop',
            }"
            title="Xem trên máy tính (900px)"
            @click="emit('update:previewDevice', 'desktop')"
          >
            <v-icon size="18"> mdi-monitor </v-icon>
          </button>
        </div>
      </div>
    </div>

    <div class="preview-stage" :class="`device-${previewDevice}`">
      <div class="preview-frame">
        <iframe
          ref="iframeEl"
          class="preview-iframe"
          :src="previewUrl"
          title="Xem trước thiệp cưới"
        ></iframe>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  themeName: { type: String, default: "" },
  previewDevice: { type: String, required: true },
  previewUrl: { type: String, required: true },
  autoRefresh: { type: Boolean, default: true },
});

const emit = defineEmits([
  "update:previewDevice",
  "update:autoRefresh",
]);

/*
 * Expose element iframe để cha postMessage
 * (dùng qua useWeddingPreviewSync).
 */
const iframeEl = ref(null);

function reload() {
  const frame = iframeEl.value;

  if (!frame) {
    return;
  }

  /*
   * Gán lại src để buộc iframe tải lại — cách này
   * chạy được cả khi URL không đổi.
   */
  const current = frame.src;

  frame.src = "about:blank";

  window.requestAnimationFrame(() => {
    frame.src = current;
  });
}

function openInNewTab() {
  if (props.previewUrl) {
    window.open(props.previewUrl, "_blank", "noopener");
  }
}

defineExpose({ iframeEl });
</script>

<style scoped>
.preview-actions {
  display: flex;

  align-items: center;

  gap: 6px;
}

.preview-icon-button {
  width: 30px;

  height: 30px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  border: 0;

  border-radius: 8px;

  background: transparent;

  color: #8d8177;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.preview-icon-button:hover {
  background: #f6f1ea;

  color: var(--wine, #a63a2e);
}

.preview-icon-button.active {
  color: var(--wine, #a63a2e);
}
</style>
