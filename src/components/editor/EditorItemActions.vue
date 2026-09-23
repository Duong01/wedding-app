<template>
  <div class="item-actions">
    <button
      type="button"
      class="item-icon-button"
      title="Chuyển lên"
      :disabled="index === 0"
      @click="emit('move', index, -1)"
    >
      <v-icon size="17"> mdi-arrow-up </v-icon>
    </button>

    <button
      type="button"
      class="item-icon-button"
      title="Chuyển xuống"
      :disabled="index >= total - 1"
      @click="emit('move', index, 1)"
    >
      <v-icon size="17"> mdi-arrow-down </v-icon>
    </button>

    <button
      type="button"
      class="danger-icon"
      :title="removeTitle"
      @click="emit('remove', index)"
    >
      <v-icon size="18"> mdi-delete-outline </v-icon>
    </button>
  </div>
</template>

<script setup>
/*
 * Cụm nút dùng chung cho mọi danh sách trong editor
 * (sự kiện, timeline, ảnh, mừng cưới, khách mời...):
 * chuyển lên / chuyển xuống / xoá.
 *
 * Panel cha chỉ cần xử lý 2 sự kiện move + remove,
 * phần style và trạng thái disabled đã có sẵn.
 */
defineProps({
  index: { type: Number, required: true },
  total: { type: Number, required: true },
  removeTitle: { type: String, default: "Xoá" },
});

const emit = defineEmits(["move", "remove"]);
</script>

<style scoped>
.item-actions {
  display: flex;

  align-items: center;

  gap: 6px;

  flex: 0 0 auto;
}

.item-icon-button {
  width: 34px;

  height: 34px;

  flex: 0 0 34px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  border: 0;

  border-radius: 9px;

  background: #f4eee6;

  color: #6b5a4e;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.item-icon-button:hover:not(:disabled) {
  background: #ece4d9;

  transform: translateY(-1px);
}

.item-icon-button:disabled {
  opacity: 0.32;

  cursor: not-allowed;
}
</style>
