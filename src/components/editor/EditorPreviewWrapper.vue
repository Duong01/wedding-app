<template>
  <aside class="editor-preview">
    <div class="preview-toolbar">
      <div class="preview-title">
        <span>LIVE PREVIEW</span>

        <strong>
          {{ wedding.theme?.Name }}
        </strong>
      </div>

      <div class="preview-device">
        <button
          type="button"
          :class="{ active: previewDevice === 'mobile' }"
          title="Xem trên điện thoại"
          @click="$emit('update:previewDevice', 'mobile')"
        >
          <v-icon size="18"> mdi-cellphone </v-icon>
        </button>

        <button
          type="button"
          :class="{ active: previewDevice === 'desktop' }"
          title="Xem trên máy tính"
          @click="$emit('update:previewDevice', 'desktop')"
        >
          <v-icon size="18"> mdi-monitor </v-icon>
        </button>
      </div>
    </div>

    <div class="preview-stage" :class="`device-${previewDevice}`">
      <div class="preview-frame">
        <EditorPreview :wedding="wedding" />
      </div>
    </div>
  </aside>
</template>

<script setup>
import EditorPreview from '@/components/editor/EditorPreview.vue';

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  previewDevice: { type: String, default: 'desktop' },
});
</script>

<style scoped>
/* Presentation handled by parent styles */
</style>
