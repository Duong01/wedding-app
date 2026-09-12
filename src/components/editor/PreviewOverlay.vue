<template>
  <div class="preview-overlay">
    <div class="preview-overlay-bar">
      <div class="preview-overlay-title">
        <span>LIVE PREVIEW</span>

        <strong>
          {{ themeName }}
        </strong>
      </div>

      <div class="preview-device preview-device--overlay">
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

      <button
        type="button"
        class="preview-overlay-close"
        title="Đóng xem trước"
        @click="emit('close')"
      >
        <v-icon size="20"> mdi-close </v-icon>
      </button>
    </div>

    <div class="preview-overlay-stage" :class="`device-${previewDevice}`">
      <div class="preview-frame">
        <iframe
          ref="iframeEl"
          class="preview-iframe"
          :src="previewUrl"
          title="Xem trước thiệp cưới"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  themeName: { type: String, default: "" },
  previewDevice: { type: String, required: true },
  previewUrl: { type: String, required: true },
});

const emit = defineEmits(["update:previewDevice", "close"]);

/*
 * Expose element iframe để cha postMessage
 * (dùng qua useWeddingPreviewSync).
 */
const iframeEl = ref(null);

defineExpose({ iframeEl });
</script>
