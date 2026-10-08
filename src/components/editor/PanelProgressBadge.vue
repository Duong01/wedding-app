<template>
  <div
    class="panel-progress"
    :class="state"
    :title="title"
  >
    <v-progress-circular
      v-if="busy"
      indeterminate
      size="15"
      width="2"
    />

    <template v-else>
      <span class="panel-progress-ring">
        <svg viewBox="0 0 36 36">
          <circle
            class="ring-track"
            cx="18"
            cy="18"
            r="15"
          />

          <circle
            class="ring-fill"
            cx="18"
            cy="18"
            r="15"
            :stroke-dasharray="`${percent} 100`"
          />
        </svg>

        <v-icon v-if="done" size="11"> mdi-check </v-icon>

        <strong v-else> {{ percent }}% </strong>
      </span>

      <span class="panel-progress-text">
        {{ label }}
      </span>
    </template>
  </div>
</template>

<script setup>
/*
 * Badge "Đã có nội dung / Chưa có nội dung" + vòng tròn
 * phần trăm — gắn ở header MỌI panel editor để người dùng
 * biết ngay mục đang mở đã hoàn thiện chưa (không phải mở
 * về "Thông tin chung" mới thấy tiến độ).
 *
 * done   — mục đã có nội dung (tick xanh)
 * partial— có 1 phần (ví dụ 2/3 sự kiện có tiêu đề)
 * empty  — chưa có gì
 */
import { computed } from "vue";

import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  /* Số mục con đã đạt / tổng số mục con cần đạt. */
  done: { type: Number, default: 0 },

  total: { type: Number, default: 0 },

  /* Đang tính (loading) — hiện spinner thay vì số. */
  busy: { type: Boolean, default: false },
});

const percent = computed(() => {
  if (!props.total) {
    return 0;
  }

  return Math.round((props.done / props.total) * 100);
});

const done = computed(() => props.total > 0 && props.done >= props.total);

const state = computed(() => {
  if (done.value) {
    return "done";
  }

  return props.done > 0 ? "partial" : "empty";
});

const title = computed(() =>
  t("generalPanel.progressCount", {
    done: props.done,
    total: props.total,
  })
);

/*
 * Chữ trên badge: xong hẳn thì "Đã có nội dung", làm dở thì
 * hiện số phần đã điền (2/3) để người dùng biết còn thiếu
 * bao nhiêu, chưa có gì thì "Chưa có nội dung".
 */
const label = computed(() => {
  if (done.value) {
    return t("editor.nav.hasContent");
  }

  if (props.done > 0 && props.total > 1) {
    return `${props.done}/${props.total}`;
  }

  return t("editor.nav.missingContent");
});
</script>

<style scoped>
.panel-progress {
  flex: 0 0 auto;

  display: inline-flex;

  align-items: center;

  gap: 8px;

  padding: 6px 12px;

  border: 1px solid var(--border, #ece4da);
  border-radius: 999px;

  background: #fffdfb;

  white-space: nowrap;
}

.panel-progress.done {
  border-color: rgba(46, 125, 50, 0.35);

  background: rgba(46, 125, 50, 0.07);
}

.panel-progress-ring {
  position: relative;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  width: 26px;

  height: 26px;
}

.panel-progress-ring svg {
  position: absolute;

  inset: 0;

  transform: rotate(-90deg);
}

.ring-track {
  fill: none;

  stroke: #eee4d8;

  stroke-width: 4;
}

.ring-fill {
  fill: none;

  stroke: #2e7d32;

  stroke-width: 4;

  stroke-linecap: round;

  stroke-dasharray: 0 100;

  transition: stroke-dasharray 0.3s ease;
}

.panel-progress-ring strong {
  color: #6b5a4e;

  font-size: 8.5px;

  font-weight: 700;
}

.panel-progress-ring .v-icon {
  color: #2e7d32;
}

.panel-progress-text {
  color: #6b5a4e;

  font-size: 11px;

  font-weight: 650;
}

.panel-progress.done .panel-progress-text {
  color: #2e7d32;
}
</style>
