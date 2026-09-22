<template>
  <section class="bq-dress">
    <div class="bq-dress__head">
      <h2 class="bq-dress__title">DRESS CODE</h2>

      <p class="bq-dress__note">{{ note }}</p>
    </div>

    <!-- BẢNG MÀU -->
    <div class="bq-dress__swatches">
      <span
        v-for="(color, index) in swatches"
        :key="`${color}-${index}`"
        class="bq-dress__swatch"
        :style="{ backgroundColor: color }"
        :title="color"
      ></span>
    </div>
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

const DEFAULT_COLORS = ["#000000", "var(--bq-accent, #ffdfaf)", "#ffffff"];

const note = computed(() => {
  const value = props.dressCode;

  if (value && !Array.isArray(value) && typeof value === "object") {
    return value.Note || value.Description || value.Content || "Trang phục dự tiệc";
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return "Trang phục dự tiệc";
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
</script>

<style scoped>
.bq-dress {
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  width: 100%;

  padding: 40px 24px;

  text-align: center;

  color: var(--bq-ink);
}

.bq-dress__head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.bq-dress__title {
  margin: 0;

  color: var(--bq-accent);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.04em;

  text-transform: uppercase;
}

.bq-dress__note {
  margin: 0;

  color: var(--bq-ink);

  font-family: "Times New Roman", serif;
  font-size: 14px;

  white-space: pre-line;
}

/* =========================================================
   BẢNG MÀU
========================================================= */

.bq-dress__swatches {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.bq-dress__swatch {
  width: 40px;
  height: 40px;

  border: 1.5px solid rgba(var(--bq-accent-rgb), 0.19);
  border-radius: 50%;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .bq-dress {
    gap: 24px;

    padding: 48px 40px;
  }

  .bq-dress__title {
    font-size: 24px;
  }

  .bq-dress__note {
    font-size: 16px;
  }

  .bq-dress__swatches {
    gap: 24px;
  }

  .bq-dress__swatch {
    width: 48px;
    height: 48px;
  }
}
</style>
