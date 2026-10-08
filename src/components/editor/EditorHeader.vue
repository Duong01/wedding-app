<template>
  <header class="editor-topbar">
    <div class="editor-brand">
      <button
        type="button"
        class="brand-logo"
        :title="$t('editor.header.backToTemplates')"
        @click="backToTemplates"
      >
        ♥
      </button>

      <div class="brand-text">
        <strong>Thiệp Duyên</strong>

        <span>
          Wedding Editor

          <i v-if="dirty" class="dirty-dot" :title="$t('editor.header.unsaved')" />
        </span>
      </div>
    </div>

    <div class="editor-template">
      <span>{{ $t('editor.header.templateInUse') }}</span>

      <strong>
        {{ wedding?.theme?.Name || routeTheme }}
      </strong>

      <!--
        TIẾN ĐỘ TOÀN THIỆP — cộng dồn mọi mục nội dung.
        Người dùng thấy ngay còn bao nhiêu phần chưa điền mà
        không phải mở từng mục.
      -->
      <div
        class="editor-progress"
        :title="$t('editor.progress.overall', { done: progress?.done || 0, total: progress?.total || 0 })"
      >
        <i :style="{ width: `${progress?.percent || 0}%` }" />

        <b>{{ progress?.percent || 0 }}%</b>
      </div>
    </div>

    <div class="editor-actions">
      <!-- Đổi ngôn ngữ giao diện trình chỉnh sửa -->
      <LanguageSwitcher compact />

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

        <span>{{ $t('editor.header.template') }}</span>
      </button>

      <button type="button" class="top-button" @click="previewWedding">
        <v-icon size="18"> mdi-eye-outline </v-icon>

        <span>{{ $t('editor.preview') }}</span>
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
        :title="$t('editor.header.publishHint')"
        @click="emit('publish')"
      >
        <v-progress-circular
          v-if="publishing"
          indeterminate
          size="17"
          width="2"
        />

        <v-icon v-else size="18"> mdi-rocket-launch-outline </v-icon>

        <span>{{ publishing ? $t('editor.header.publishing') : $t('editor.header.publish') }}</span>
      </button>

      <button
        v-else-if="publishState === 'Expired'"
        type="button"
        class="publish-button warn"
        :title="$t('editor.header.expiredHint')"
        @click="emit('payment')"
      >
        <v-icon size="18"> mdi-alert-circle-outline </v-icon>

        <span>{{ $t('editor.header.expiredPay') }}</span>
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
          :title="$t('editor.header.shareHint')"
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
          {{ saving ? $t('editor.header.saving') : dirty ? $t('editor.header.saveChanges') : $t('editor.header.saved') }}
        </span>
      </button>
    </div>
  </header>
</template>

<script setup>
import LanguageSwitcher from "@/components/common/LanguageSwitcher.vue";
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const { t } = useI18n();

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

  /* { done, total, percent } — tiến độ toàn thiệp. */
  progress: { type: Object, default: null },
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
      return t("editor.status.trialDays", { days: props.daysLeft });
    case "Active":
      return t("editor.status.published");
    case "Locked":
      return t("editor.status.locked");
    default:
      return t("editor.status.unpublished");
  }
});

const publishStateTitle = computed(() => {
  switch (props.publishState) {
    case "Trial":
      return t("editor.status.trialHint", { days: props.daysLeft });
    case "Active":
      return t("editor.status.activeHint");
    case "Locked":
      return t("editor.status.lockedHint");
    default:
      return t("editor.status.draftHint");
  }
});

const undoTitle = computed(() =>
  props.canUndo
    ? t("editor.undoSteps", { steps: props.undoDepth })
    : t("editor.noUndo")
);

const redoTitle = computed(() =>
  props.canRedo ? t("editor.redo") : t("editor.noRedo")
);

const saveTitle = computed(() =>
  props.dirty ? t("editor.saveShortcut") : t("editor.allSaved")
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
