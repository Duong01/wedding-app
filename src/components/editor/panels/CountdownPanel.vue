<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> COUNTDOWN </span>

        <h1>{{ $t('editor.menu.countdown') }}</h1>

        <p>{{ $t('countdownPanel.desc') }}</p>
      </div>
    </div>

    <div class="switch-card">
      <div>
        <strong> {{ $t('countdownPanel.show') }} </strong>

        <small> {{ $t('countdownPanel.showHint') }} </small>
      </div>

      <v-switch
        v-model="wedding.countdown.Enabled"
        color="primary"
        hide-details
      />
    </div>

    <div class="editor-field">
      <label>{{ $t('countdownPanel.endDate') }}</label>

      <input
        :value="datetimeLocalValue"
        type="datetime-local"
        @input="onTargetInput"
      />

      <small class="field-help">
        {{ $t('countdownPanel.synced') }}
      </small>
    </div>

    <!-- =====================================================
         XEM TRƯỚC ĐẾM NGƯỢC
    ====================================================== -->

    <div v-if="wedding.countdown.Enabled" class="countdown-preview">
      <p class="countdown-caption">
        {{ countdownCaption }}
      </p>

      <div class="countdown-grid">
        <div v-for="unit in countdownUnits" :key="unit.label" class="countdown-cell">
          <strong>{{ unit.value }}</strong>

          <span>{{ unit.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import {
  fromDatetimeLocal,
  parseWeddingDate,
  toDatetimeLocal,
} from "@/utils/datetime";

const { t } = useI18n();

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

/* =====================================================
   XEM TRƯỚC ĐẾM NGƯỢC
===================================================== */

/*
 * Đồng hồ chạy mỗi giây để người dùng thấy đúng cảm
 * giác khách mời sẽ thấy trên thiệp.
 */
const now = ref(Date.now());

let timer = null;

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onBeforeUnmount(() => {
  window.clearInterval(timer);
});

const targetDate = computed(() =>
  parseWeddingDate(props.wedding.countdown?.Target)
);

const remaining = computed(() => {
  if (!targetDate.value) {
    return null;
  }

  return targetDate.value.getTime() - now.value;
});

const countdownUnits = computed(() => {
  const diff = remaining.value;

  if (diff === null || diff <= 0) {
    return [
      { get label() { return t("time.days"); }, value: "00" },
      { get label() { return t("time.hours"); }, value: "00" },
      { get label() { return t("time.minutes"); }, value: "00" },
      { get label() { return t("time.seconds"); }, value: "00" },
    ];
  }

  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(totalSeconds / 86400);

  const hours = Math.floor((totalSeconds % 86400) / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = totalSeconds % 60;

  const pad = (value) => String(value).padStart(2, "0");

  return [
    { get label() { return t("time.days"); }, value: String(days) },
    { get label() { return t("time.hours"); }, value: pad(hours) },
    { get label() { return t("time.minutes"); }, value: pad(minutes) },
    { get label() { return t("time.seconds"); }, value: pad(seconds) },
  ];
});

const countdownCaption = computed(() => {
  if (!targetDate.value) {
    return t("countdownPanel.noDate");
  }

  if (remaining.value !== null && remaining.value <= 0) {
    return t("countdownPanel.arrived");
  }

  return t("countdownPanel.coming");
});
</script>

<style scoped>
.countdown-preview {
  margin-top: 6px;

  padding: 20px 18px;

  border: 1px solid var(--border, #ece4da);
  border-radius: 16px;

  background:
    radial-gradient(circle at 88% 12%, rgba(185, 151, 91, 0.12), transparent 60%),
    #fffdfb;

  text-align: center;
}

.countdown-caption {
  margin: 0 0 14px;

  color: #8a7a68;

  font-size: 11px;

  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.countdown-grid {
  display: grid;

  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 10px;
}

.countdown-cell {
  display: flex;

  flex-direction: column;

  gap: 3px;

  padding: 12px 6px;

  border-radius: 12px;

  background: #f7f1ea;
}

.countdown-cell strong {
  color: var(--wine, #a63a2e);

  font-family: var(--font-heading), Georgia, serif;
  font-size: 22px;
  font-weight: 600;

  font-variant-numeric: tabular-nums;
}

.countdown-cell span {
  color: #a8988a;

  font-size: 9.5px;

  letter-spacing: 0.1em;
  text-transform: uppercase;
}
</style>
