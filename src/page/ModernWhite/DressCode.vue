<template>
  <section class="mw-dress">
    <h2 class="mw-title">Dress Code</h2>

    <p class="mw-lead">{{ note }}</p>

    <div class="mw-dress__swatches">
      <span
        v-for="(color, index) in colors"
        :key="`${color}-${index}`"
        class="mw-dress__swatch"
        :style="{ backgroundColor: color }"
      ></span>
    </div>

    <ul v-if="suggestions.length" class="mw-dress__list">
      <li v-for="(item, index) in suggestions" :key="index">{{ item }}</li>
    </ul>
  </section>
</template>

<script setup>
import { computed } from "vue";

const DEFAULT_COLORS = ["#486c7d", "#a4c4d4", "#ffffff"];

const DEFAULT_SUGGESTIONS = [
  "Ưu tiên trang phục tông xanh, trắng hoặc pastel để hài hoà cùng không gian tiệc.",
  "Váy áo lịch sự, thoải mái để bạn dễ dàng vui trọn buổi tiệc.",
  "Hạn chế các tông màu quá chói để tổng thể ảnh cưới được hài hoà.",
];

const props = defineProps({
  dressCode: { type: [Object, Array, String], default: null },
});

const value = computed(() => props.dressCode);

const note = computed(() => {
  if (!value.value) {
    return "Để bức ảnh chung của chúng ta thật hài hoà, bạn hãy chọn trang phục theo gợi ý bên dưới nhé.";
  }

  if (typeof value.value === "string") {
    return value.value;
  }

  return (
    value.value.Note ||
    value.value.Description ||
    value.value.Content ||
    "Để bức ảnh chung của chúng ta thật hài hoà, bạn hãy chọn trang phục theo gợi ý bên dưới nhé."
  );
});

const colors = computed(() => {
  const raw = Array.isArray(value.value) ? value.value : value.value?.Colors;

  if (!Array.isArray(raw) || !raw.length) {
    return DEFAULT_COLORS;
  }

  return raw
    .map((item) => (typeof item === "string" ? item : item?.Color || item?.Hex || ""))
    .filter(Boolean);
});

const suggestions = computed(() => {
  const raw = Array.isArray(value.value) ? null : value.value?.Suggestions;

  if (!Array.isArray(raw) || !raw.length) {
    return DEFAULT_SUGGESTIONS;
  }

  return raw.filter(Boolean);
});
</script>

<style scoped>
.mw-dress {
  text-align: center;
}

.mw-dress__swatches {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;

  margin-top: 20px;
}

.mw-dress__swatch {
  width: 40px;
  height: 40px;

  border: 1px solid var(--mw-hairline);
  border-radius: 50%;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mw-dress__list {
  max-width: 340px;

  margin: 20px auto 0;
  padding: 0;

  list-style: none;

  text-align: left;
}

.mw-dress__list li {
  position: relative;

  padding-left: 16px;

  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 13px;

  letter-spacing: 0.03em;
  line-height: 1.6;
}

.mw-dress__list li + li {
  margin-top: 8px;
}

.mw-dress__list li::before {
  content: "✦";

  position: absolute;
  left: 0;

  color: var(--mw-blue-soft);

  font-size: 9px;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .mw-dress__swatch {
    width: 48px;
    height: 48px;
  }

  .mw-dress__list {
    max-width: 480px;
  }

  .mw-dress__list li {
    font-size: 14px;
  }
}
</style>
