<template>
  <section class="shc-dress">
    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <div class="shc-dress__head">
      <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
      <header v-if="sectionOverride(sections, 'dressCode', 'Eyebrow')" class="shc-top-custom-head">
        <p v-if="sectionOverride(sections, 'dressCode', 'Eyebrow')" class="shc-top-custom-head__eyebrow">{{ sectionOverride(sections, "dressCode", "Eyebrow") }}</p>
      </header>

      <h2 class="shc-dress__title">{{ sectionText(sections, "dressCode", "Heading", "DRESS CODE") }}</h2>

      <p class="shc-dress__subtitle">{{ sectionText(sections, "dressCode", "Intro", "Trang phục dự tiệc") }}</p>
    </div>

    <!-- =====================================================
         BẢNG MÀU
    ====================================================== -->

    <div class="shc-dress__palette">
      <div
        v-for="color in palette"
        :key="color.hex"
        class="shc-dress__swatch"
        :style="{
          backgroundColor: color.hex,
          border: color.border ? `1.5px solid ${color.border}` : 'none',
        }"
      ></div>
    </div>
  </section>
</template>

<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";

defineProps({
  sections: { type: Object, default: () => ({}) },
});
const palette = [
  { hex: "#F6EFEA", border: "#FFE8A430" },
  { hex: "#FFE8A4", border: "#FFE8A430" },
  { hex: "#001232", border: "" },
];
</script>

<style scoped>
.shc-dress {
  --shc-red: var(--primary, #920002);
  --shc-cream: var(--accent, #ffe8a4);

  position: relative;

  overflow: hidden;

  margin-top: 23px;
  padding: 10px 24px;

  color: var(--shc-cream);

  background-color: var(--shc-red);

  font-family: "Times New Roman", Times, serif;
}

/* =========================================================
   TIÊU ĐỀ
========================================================= */

.shc-dress__head {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 4px;

  text-align: center;
}

.shc-dress__title {
  margin: 0;

  color: var(--shc-cream);

  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-transform: uppercase;
}

.shc-dress__subtitle {
  margin: 0;

  color: var(--shc-cream);

  font-size: 13px;

  opacity: 0.7;
}

/* =========================================================
   BẢNG MÀU
========================================================= */

.shc-dress__palette {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  gap: 16px;

  margin-top: 20px;
}

.shc-dress__swatch {
  width: 40px;
  height: 40px;

  border-radius: 50%;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shc-dress {
    margin-top: 31px;
    padding: 12px 40px;
  }

  .shc-dress__title {
    font-size: 27px;
  }

  .shc-dress__subtitle {
    font-size: 18px;
  }

  .shc-dress__palette {
    gap: 24px;

    margin-top: 24px;
  }

  .shc-dress__swatch {
    width: 48px;
    height: 48px;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.shc-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.shc-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.shc-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.shc-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
