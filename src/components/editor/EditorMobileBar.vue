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

    <button
      type="button"
      :disabled="!canUndo"
      title="Hoàn tác"
      @click="emit('undo')"
    >
      <v-icon size="21"> mdi-undo-variant </v-icon>

      <span> Hoàn tác </span>
    </button>

    <button
      type="button"
      :disabled="!canRedo"
      title="Làm lại"
      @click="emit('redo')"
    >
      <v-icon size="21"> mdi-redo-variant </v-icon>

      <span> Làm lại </span>
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

      <span> {{ dirty ? "Lưu" : "Đã lưu" }} </span>

      <i v-if="dirty && !saving" class="mobile-dirty-dot" />
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";

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
      return `Còn ${props.daysLeft}n`;
    case "Expired":
      return "Hết hạn";
    case "Active":
      return "Chia sẻ";
    case "Locked":
      return "Đã khóa";
    default:
      return "Xuất bản";
  }
});

const publishTitle = computed(() => {
  switch (props.publishState) {
    case "Trial":
      return `Đang dùng thử — còn ${props.daysLeft} ngày. Bấm để lấy link chia sẻ.`;
    case "Expired":
      return "Hết hạn dùng thử — bấm để thanh toán và mở lại thiệp.";
    case "Active":
      return "Thiệp đã xuất bản — bấm để lấy link chia sẻ.";
    case "Locked":
      return "Thiệp đang bị khóa.";
    default:
      return "Xuất bản thiệp để khách mời có thể xem.";
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
