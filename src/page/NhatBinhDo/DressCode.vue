<template>
  <section class="cfr-dress">

    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <div class="cfr-dress__head">
      <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
      <header v-if="sectionOverride(sections, 'dressCode', 'Eyebrow')" class="cfr-top-custom-head">
        <p v-if="sectionOverride(sections, 'dressCode', 'Eyebrow')" class="cfr-top-custom-head__eyebrow">{{ sectionOverride(sections, "dressCode", "Eyebrow") }}</p>
      </header>

      <h2 class="cfr-title">
        {{ heading }}
      </h2>

      <p class="cfr-lead">
        {{ intro }}
      </p>
    </div>


    <!-- =====================================================
         BẢNG MÀU
    ====================================================== -->

    <div class="cfr-dress__swatches">
      <span
        v-for="(color, index) in swatches"
        :key="`${color}-${index}`"
        class="cfr-dress__swatch"
        :style="{ backgroundColor: color }"
      ></span>
    </div>

  </section>
</template>


<script setup>
import { computed } from "vue";

import { sectionOverride, sectionText } from "@/data/sectionTitles";
const props = defineProps({
  dressCode: {
    type: [Object, Array, String],
    default: null,
  },

  sections: {
    type: Object,
    default: () => ({}),
  },
});

/* =========================================================
   TIÊU ĐỀ MỤC
========================================================= */

const heading = computed(() =>
  sectionText(props.sections, "dressCode", "Heading")
);

const intro = computed(() =>
  sectionText(props.sections, "dressCode", "Intro")
);


/* =========================================================
   BẢNG MÀU
========================================================= */

const DEFAULT_COLORS = ["#9c1f2c", "#560207", "#f6ecd9"];


const swatches = computed(() => {
  const value = props.dressCode;

  if (Array.isArray(value) && value.length) {
    return value
      .map((item) =>
        typeof item === "string" ? item : item?.Color || item?.Hex || ""
      )
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (value && typeof value === "object") {
    const list = value.Colors || value.colors;

    if (Array.isArray(list) && list.length) {
      return list.filter(Boolean);
    }
  }

  return DEFAULT_COLORS;
});
</script>


<style scoped>
/* =========================================================
   SECTION
========================================================= */

.cfr-dress {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 20px;

  width: 100%;

  text-align: center;
}

.cfr-dress__head {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 4px;
}


/* =========================================================
   BẢNG MÀU
========================================================= */

.cfr-dress__swatches {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  gap: 16px;
}

.cfr-dress__swatch {
  display: block;

  width: 40px;
  height: 40px;

  border: 1.5px solid var(--cfr-hairline-soft);
  border-radius: 50%;

  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}


/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .cfr-dress {
    gap: 24px;
  }

  .cfr-dress__swatches {
    gap: 24px;
  }

  .cfr-dress__swatch {
    width: 48px;
    height: 48px;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.cfr-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.cfr-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.cfr-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.cfr-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
