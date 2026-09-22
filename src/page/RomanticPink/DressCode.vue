<template>
  <section class="dress-code">
    <div class="gg-eyebrow">TRANG PHỤC</div>

    <h2 class="gg-title">Dress Code</h2>

    <p class="gg-lead">
      {{ note }}
    </p>

    <!-- Bảng màu -->
    <div class="swatch-row">
      <div
        v-for="(color, index) in swatches"
        :key="`${color}-${index}`"
        class="swatch"
        :style="{ backgroundColor: color }"
        :title="color"
      ></div>
    </div>

    <!-- Gợi ý -->
    <ul class="dress-list">
      <li v-for="(item, index) in suggestions" :key="index">
        <span class="dress-dot"></span>
        <span>{{ item }}</span>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  dressCode: {
    type: [Object, Array, String],
    default: null,
  },
});

const DEFAULT_COLORS = ["var(--gg-deep, #933845)", "var(--gg-rose, #cb5d6c)", "#FFFFFF"];

const DEFAULT_SUGGESTIONS = [
  "Tông hồng – đỏ rượu là màu chủ đạo của ngày vui",
  "Ưu tiên trang phục nhẹ nhàng, thanh lịch",
  "Hạn chế màu trắng để dành riêng cho cô dâu",
];

const note = computed(() => {
  const value = props.dressCode;

  if (value && !Array.isArray(value) && typeof value === "object") {
    return (
      value.Note ||
      value.Description ||
      value.Content ||
      "Để bức ảnh chung thêm hài hoà, chúng mình rất mong quý khách chọn trang phục theo bảng màu bên dưới."
    );
  }

  return "Để bức ảnh chung thêm hài hoà, chúng mình rất mong quý khách chọn trang phục theo bảng màu bên dưới.";
});

const swatches = computed(() => {
  const value = props.dressCode;

  if (Array.isArray(value) && value.length) {
    return value
      .map((item) => (typeof item === "string" ? item : item?.Color || item?.Hex))
      .filter(Boolean);
  }

  if (value && typeof value === "object" && Array.isArray(value.Colors) && value.Colors.length) {
    return value.Colors;
  }

  return DEFAULT_COLORS;
});

const suggestions = computed(() => {
  const value = props.dressCode;

  if (value && typeof value === "object" && Array.isArray(value.Suggestions) && value.Suggestions.length) {
    return value.Suggestions;
  }

  return DEFAULT_SUGGESTIONS;
});
</script>

<style scoped>
.dress-code {
  text-align: center;
}

/* =========================================================
   BẢNG MÀU
   ========================================================= */

.swatch-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;

  margin-top: 22px;
}

.swatch {
  width: 40px;
  height: 40px;

  border-radius: 50%;

  box-shadow: 0 6px 16px rgba(147, 56, 69, 0.22),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);

  transition: transform 0.3s ease;
}

.swatch:hover {
  transform: translateY(-3px) scale(1.05);
}

/* =========================================================
   GỢI Ý
   ========================================================= */

.dress-list {
  margin: 24px auto 0;
  padding: 0;

  max-width: 340px;

  list-style: none;

  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dress-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;

  color: var(--gg-deep, #933845);

  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 13px;
  line-height: 1.6;
  text-align: left;

  opacity: 0.88;
}

.dress-dot {
  flex: 0 0 auto;

  width: 5px;
  height: 5px;
  margin-top: 8px;

  border-radius: 50%;
  background-color: var(--gg-rose, #cb5d6c);
}

@media (min-width: 900px) {
  .swatch {
    width: 48px;
    height: 48px;
  }

  .dress-list li {
    font-size: 14px;
  }
}
</style>
