<template>
  <header class="editor-topbar">
    <div class="editor-brand">
      <button
        type="button"
        class="brand-logo"
        title="Quay lại mẫu thiệp"
        @click="backToTemplates"
      >
        ♥
      </button>

      <div class="brand-text">
        <strong>Thiệp Duyên</strong>

        <span>
          Wedding Editor

          <i v-if="dirty" class="dirty-dot" title="Có thay đổi chưa lưu" />
        </span>
      </div>
    </div>

    <div class="editor-template">
      <span>Mẫu đang sử dụng</span>

      <strong>
        {{ wedding?.theme?.Name || routeTheme }}
      </strong>
    </div>

    <div class="editor-actions">
      <!-- HOÀN TÁC / LÀM LẠI -->
      <div class="history-group">
        <button
          type="button"
          class="icon-button"
          :disabled="!canUndo"
          :title="undoTitle"
          @click="emit('undo')"
        >
          <v-icon size="18"> mdi-undo-variant </v-icon>
        </button>

        <button
          type="button"
          class="icon-button"
          :disabled="!canRedo"
          :title="redoTitle"
          @click="emit('redo')"
        >
          <v-icon size="18"> mdi-redo-variant </v-icon>
        </button>
      </div>

      <button type="button" class="top-button" @click="backToTemplates">
        <v-icon size="18"> mdi-arrow-left </v-icon>

        <span>Mẫu thiệp</span>
      </button>

      <button type="button" class="top-button" @click="previewWedding">
        <v-icon size="18"> mdi-eye-outline </v-icon>

        <span>Xem trước</span>
      </button>

      <!--
        XUẤT BẢN — chỉ sau khi bấm nút này khách mời mới xem được thiệp.
        Trạng thái đổi theo publishState (Draft/Trial/Expired/Active/Locked).
      -->
      <button
        v-if="publishState === 'Draft'"
        type="button"
        class="publish-button"
        :disabled="publishing"
        title="Xuất bản thiệp để khách mời có thể xem"
        @click="emit('publish')"
      >
        <v-progress-circular
          v-if="publishing"
          indeterminate
          size="17"
          width="2"
        />

        <v-icon v-else size="18"> mdi-rocket-launch-outline </v-icon>

        <span>{{ publishing ? "Đang xuất bản..." : "Xuất bản" }}</span>
      </button>

      <button
        v-else-if="publishState === 'Expired'"
        type="button"
        class="publish-button warn"
        title="Hết hạn dùng thử — thanh toán để mở lại thiệp"
        @click="emit('payment')"
      >
        <v-icon size="18"> mdi-alert-circle-outline </v-icon>

        <span>Hết hạn — Thanh toán</span>
      </button>

      <div
        v-else
        class="publish-state"
        :class="publishState.toLowerCase()"
        :title="publishStateTitle"
      >
        <v-icon size="16"> {{ publishStateIcon }} </v-icon>

        <span>{{ publishStateLabel }}</span>

        <button
          v-if="publishState === 'Trial' || publishState === 'Active'"
          type="button"
          class="publish-share"
          title="Lấy link chia sẻ cho khách mời"
          @click="emit('share')"
        >
          <v-icon size="15"> mdi-share-variant-outline </v-icon>
        </button>
      </div>

      <button
        type="button"
        class="save-button"
        :class="{ dirty }"
        :disabled="saving"
        :title="saveTitle"
        @click="saveWedding"
      >
        <v-progress-circular
          v-if="saving"
          indeterminate
          size="17"
          width="2"
        />

        <v-icon v-else size="18">
          {{ dirty ? "mdi-content-save-alert-outline" : "mdi-content-save-outline" }}
        </v-icon>

        <span>
          {{ saving ? "Đang lưu..." : dirty ? "Lưu thay đổi" : "Đã lưu" }}
        </span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  wedding: { type: Object, default: null },
  routeTheme: { type: String, default: "" },
  saving: { type: Boolean, default: false },

  /* Trạng thái có thay đổi chưa lưu (từ editor store). */
  dirty: { type: Boolean, default: false },

  canUndo: { type: Boolean, default: false },
  canRedo: { type: Boolean, default: false },

  undoDepth: { type: Number, default: 0 },

  /* Draft | Trial | Expired | Active | Locked */
  publishState: { type: String, default: "Draft" },
  daysLeft: { type: Number, default: 0 },
  publishing: { type: Boolean, default: false },
});

/*
 * Header không tự điều hướng / gọi API —
 * phát sự kiện cho Editor.vue xử lý.
 */
const emit = defineEmits([
  "back",
  "preview",
  "save",
  "undo",
  "redo",
  "publish",
  "share",
  "payment",
]);

const publishStateIcon = computed(() => {
  switch (props.publishState) {
    case "Trial":
      return "mdi-timer-sand";
    case "Active":
      return "mdi-check-decagram-outline";
    case "Locked":
      return "mdi-lock-outline";
    default:
      return "mdi-information-outline";
  }
});

const publishStateLabel = computed(() => {
  switch (props.publishState) {
    case "Trial":
      return `Dùng thử còn ${props.daysLeft} ngày`;
    case "Active":
      return "Đã xuất bản";
    case "Locked":
      return "Đã khóa";
    default:
      return "Chưa xuất bản";
  }
});

const publishStateTitle = computed(() => {
  switch (props.publishState) {
    case "Trial":
      return `Khách mời đang xem được thiệp. Dùng thử còn ${props.daysLeft} ngày, sau đó cần thanh toán một lần.`;
    case "Active":
      return "Thiệp đã được xuất bản và đang hoạt động.";
    case "Locked":
      return "Thiệp đang bị khóa.";
    default:
      return "Thiệp chưa được xuất bản — khách mời mở link sẽ không xem được.";
  }
});

const undoTitle = computed(() =>
  props.canUndo
    ? `Hoàn tác (Ctrl+Z) — còn ${props.undoDepth} bước`
    : "Không còn bước để hoàn tác"
);

const redoTitle = computed(() =>
  props.canRedo ? "Làm lại (Ctrl+Shift+Z)" : "Không có bước để làm lại"
);

const saveTitle = computed(() =>
  props.dirty ? "Lưu thiệp (Ctrl+S)" : "Thiệp đã được lưu"
);

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
.dirty-dot {
  display: inline-block;

  width: 6px;

  height: 6px;

  margin-left: 5px;

  border-radius: 50%;

  background: var(--wine, #a63a2e);

  vertical-align: middle;
}

.history-group {
  display: flex;

  gap: 4px;

  padding-right: 8px;

  margin-right: 4px;

  border-right: 1px solid var(--border, #ece4da);
}

.icon-button {
  width: 36px;

  height: 36px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  border: 1px solid var(--border, #ece4da);
  border-radius: 10px;

  background: #fffdfb;

  color: #6b5a4e;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}

.icon-button:hover:not(:disabled) {
  background: #f6f1ea;

  color: var(--wine, #a63a2e);

  transform: translateY(-1px);
}

.icon-button:disabled {
  opacity: 0.35;

  cursor: not-allowed;
}

/*
 * Nút Lưu đổi sắc khi có thay đổi chưa lưu — mắt
 * người dùng bắt được ngay mà không cần đọc chữ.
 */
.save-button.dirty {
  box-shadow: 0 8px 22px rgba(166, 58, 46, 0.34);
}

@media (max-width: 780px) {
  .history-group {
    display: none;
  }
}
</style>
