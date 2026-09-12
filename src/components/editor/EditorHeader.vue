<template>
  <header class="editor-topbar">
      <div class="editor-brand">
        <button
          type="button"
          class="brand-logo"
          @click="backToTemplates"
          title="Quay lại mẫu thiệp"
        >
          ♥
        </button>

    <div class="brand-text">
      <strong>Chung Đôi</strong>
      <span>Wedding Editor</span>
    </div>
  </div>

  <div class="editor-template">
    <span>Mẫu đang sử dụng</span>

    <strong>
      {{ wedding?.theme?.Name || routeTheme }}
    </strong>
  </div>

  <div class="editor-actions">
    <button type="button" class="top-button" @click="backToTemplates">
      <v-icon size="18"> mdi-arrow-left </v-icon>

      <span>Mẫu thiệp</span>
    </button>

    <button type="button" class="top-button" @click="previewWedding">
      <v-icon size="18"> mdi-eye-outline </v-icon>

      <span>Xem trước</span>
    </button>

    <button
      type="button"
      class="save-button"
      :disabled="saving"
      @click="saveWedding"
    >
      <v-progress-circular
        v-if="saving"
        indeterminate
        size="17"
        width="2"
      />

      <v-icon v-else size="18"> mdi-content-save-outline </v-icon>

      <span>
        {{ saving ? "Đang lưu..." : "Lưu thiệp" }}
      </span>
    </button>
  </div>
</header>
</template>

<script setup>
const props = defineProps({
  wedding: { type: Object, default: null },
  routeTheme: { type: String, default: "" },
  saving: { type: Boolean, default: false },
});

/*
 * Header không tự điều hướng / gọi API —
 * phát sự kiện cho Editor.vue xử lý.
 */
const emit = defineEmits(["back", "preview", "save"]);

function backToTemplates() {
  emit("back");
}

function previewWedding() {
  emit("preview");
}

function saveWedding() {
  emit("save");
}
</script>

<style scoped>
/* Presentation handled by parent styles */
</style>
