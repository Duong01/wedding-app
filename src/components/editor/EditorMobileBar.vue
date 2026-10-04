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

      <span> {{ $t('editor.mobile.info') }} </span>
    </button>

    <button
      type="button"
      :class="{
        active: menuOpen,
      }"
      @click="emit('open-menu')"
    >
      <v-icon size="21"> mdi-view-list-outline </v-icon>

      <span> {{ $t('editor.mobile.content') }} </span>
    </button>

    <button
      type="button"
      :disabled="!canUndo"
      :title="$t('editor.mobile.undo')"
      @click="emit('undo')"
    >
      <v-icon size="21"> mdi-undo-variant </v-icon>

      <span> {{ $t('editor.mobile.undo') }} </span>
    </button>

    <button
      type="button"
      :disabled="!canRedo"
      :title="$t('editor.mobile.redo')"
      @click="emit('redo')"
    >
      <v-icon size="21"> mdi-redo-variant </v-icon>

      <span> {{ $t('editor.mobile.redo') }} </span>
    </button>

    <button type="button" @click="emit('preview')">
      <v-icon size="21"> mdi-eye-outline </v-icon>

      <span> Xem </span>
    </button>

    <!--
      Xuất bản: đổi icon + nhãn theo trạng thái thiệp.
      Draft   -> bấm để xuất bản
      Trial   -> mở khung chia sẻ link
      Expired -> đi tới trang thanh toán
      Active  -> mở khung chia sẻ link
      Locked  -> vô hiệu
    -->
    <button
      type="button"
      class="mobile-publish"
      :class="publishState.toLowerCase()"
      :disabled="publishing || publishState === 'Locked'"
      :title="publishTitle"
      @click="onPublishClick"
    >
      <v-progress-circular
        v-if="publishing"
        indeterminate
        size="18"
        width="2"
      />

      <v-icon v-else size="21"> {{ publishIcon }} </v-icon>

      <span> {{ publishLabel }} </span>
    </button>

    <button
      type="button"
      class="mobile-save"
      :class="{ dirty }"
      :disabled="saving"
      @click="emit('save')"
    >
      <v-progress-circular v-if="saving" indeterminate size="18" width="2" />

      <v-icon v-else size="21">
        {{ dirty ? "mdi-content-save-alert-outline" : "mdi-content-save-outline" }}
      </v-icon>

      <span> {{ dirty ? $t('editor.mobile.save') : $t('editor.header.saved') }} </span>

      <i v-if="dirty && !saving" class="mobile-dirty-dot" />
    </button>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const { t } = useI18n();

const props = defineProps({
  activeMenu: { type: String, required: true },
  menuOpen: { type: Boolean, default: false },
  saving: { type: Boolean, default: false },
  dirty: { type: Boolean, default: false },
  canUndo: { type: Boolean, default: false },
  canRedo: { type: Boolean, default: false },

  /* Draft | Trial | Expired | Active | Locked */
  publishState: { type: String, default: "Draft" },
  daysLeft: { type: Number, default: 0 },
  publishing: { type: Boolean, default: false },
});

const emit = defineEmits([
  "select",
  "open-menu",
  "preview",
  "save",
  "undo",
  "redo",
  "publish",
  "share",
  "payment",
]);

const publishIcon = computed(() => {
  switch (props.publishState) {
    case "Trial":
      return "mdi-share-variant-outline";
    case "Expired":
      return "mdi-alert-circle-outline";
    case "Active":
      return "mdi-share-variant-outline";
    case "Locked":
      return "mdi-lock-outline";
    default:
      return "mdi-rocket-launch-outline";
  }
});

const publishLabel = computed(() => {
  switch (props.publishState) {
    case "Trial":
      return t("editor.status.daysShort", { days: props.daysLeft });
    case "Expired":
      return t("editor.mobile.expired");
    case "Active":
      return t("editor.mobile.share");
    case "Locked":
      return t("editor.status.locked");
    default:
      return t("editor.header.publish");
  }
});

const publishTitle = computed(() => {
  switch (props.publishState) {
    case "Trial":
      return t("editor.mobile.trialHint", { days: props.daysLeft });
    case "Expired":
      return t("editor.mobile.expiredHint");
    case "Active":
      return t("editor.mobile.activeHint");
    case "Locked":
      return t("editor.status.lockedHint");
    default:
      return t("editor.mobile.publishHint");
  }
});

function onPublishClick() {
  switch (props.publishState) {
    case "Trial":
    case "Active":
      emit("share");
      break;
    case "Expired":
      emit("payment");
      break;
    default:
      emit("publish");
  }
}
</script>

<style scoped>
.mobile-save {
  position: relative;
}

.mobile-dirty-dot {
  position: absolute;

  top: 6px;

  right: 14px;

  width: 7px;

  height: 7px;

  border-radius: 50%;

  background: #e0a33c;

  box-shadow: 0 0 0 2px #fffdf8;
}

/* Nhấn mạnh nút Xuất bản khi thiệp còn là bản nháp. */
.mobile-publish.draft {
  color: var(--gold, #b9975b);
}

.mobile-publish.expired {
  color: var(--wine, #a63a2e);
}

.mobile-publish:disabled {
  opacity: 0.4;
}
</style>
