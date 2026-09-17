<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> COUNTDOWN </span>

        <h1>Đếm ngược</h1>

        <p>Hiển thị thời gian còn lại đến ngày cưới.</p>
      </div>
    </div>

    <div class="switch-card">
      <div>
        <strong> Hiển thị Countdown </strong>

        <small> Tự động đếm ngược đến ngày cưới. </small>
      </div>

      <v-switch
        v-model="wedding.countdown.Enabled"
        color="primary"
        hide-details
      />
    </div>

    <div class="editor-field">
      <label>Ngày kết thúc</label>

      <input
        :value="datetimeLocalValue"
        type="datetime-local"
        @input="onTargetInput"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import {
  fromDatetimeLocal,
  toDatetimeLocal,
} from "@/utils/datetime";

const props = defineProps({
  wedding: { type: Object, required: true },
});

/*
 * Input datetime-local không nhận phần giây còn hệ
 * thống lưu "2026-11-14T08:00:00" (ISO) — chuyển đổi
 * 2 chiều qua utils/datetime.
 */
const datetimeLocalValue = computed(() => {
  return toDatetimeLocal(props.wedding.countdown?.Target);
});

function onTargetInput(event) {
  props.wedding.countdown.Target = fromDatetimeLocal(event.target.value);
}
</script>
