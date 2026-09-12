<template>
  <div class="mobile-editor-actions">
    <button
      type="button"
      :class="{
        active: activeMenu === 'general',
      }"
      @click="emit('select', 'general')"
    >
      <v-icon size="21"> mdi-information-outline </v-icon>

      <span> Thông tin </span>
    </button>

    <button
      type="button"
      :class="{
        active: menuOpen,
      }"
      @click="emit('open-menu')"
    >
      <v-icon size="21"> mdi-view-list-outline </v-icon>

      <span> Nội dung </span>
    </button>

    <button type="button" @click="emit('preview')">
      <v-icon size="21"> mdi-eye-outline </v-icon>

      <span> Xem </span>
    </button>

    <button type="button" :disabled="saving" @click="emit('save')">
      <v-progress-circular v-if="saving" indeterminate size="18" width="2" />

      <v-icon v-else size="21"> mdi-content-save-outline </v-icon>

      <span> Lưu </span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  activeMenu: { type: String, required: true },
  menuOpen: { type: Boolean, default: false },
  saving: { type: Boolean, default: false },
});

const emit = defineEmits(["select", "open-menu", "preview", "save"]);
</script>
