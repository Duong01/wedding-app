<template>
  <section class="shy-dress">
    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'dressCode', 'Eyebrow')" class="shy-top-custom-head">
      <p v-if="sectionOverride(sections, 'dressCode', 'Eyebrow')" class="shy-top-custom-head__eyebrow">{{ sectionOverride(sections, "dressCode", "Eyebrow") }}</p>
    </header>

    <h2 class="shy-bar">{{ sectionText(sections, "dressCode", "Heading", "Dress Code") }}</h2>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="shy-dress__inner">
      <p class="shy-dress__intro">{{ sectionText(sections, "dressCode", "Intro", "Để bức ảnh chung thêm phần hài hoà, chúng mình mong quý khách ghé thăm buổi tiệc với trang phục mang tông màu sau") }}</p>

      <ul class="shy-dress__palette">
        <li v-for="color in palette" :key="color.hex" class="shy-dress__swatch">
          <span class="shy-dress__dot" :style="{ background: color.hex }"></span>

          <span class="shy-dress__name">{{ color.name }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";

defineProps({
  sections: { type: Object, default: () => ({}) },
});
const palette = [
  { name: "ĐỎ MẬN", hex: "#800000" },
  { name: "KEM", hex: "#ffeed2" },
  { name: "VÀNG ĐỒNG", hex: "#fbbf24" },
];
</script>

<style scoped>
.shy-dress {
  --shy-bg: var(--background, #fff7eb);
  --shy-ink: var(--text, #666666);
  --shy-red: var(--primary, #800000);
  --shy-cream: var(--accent-light, #ffeed2);

  position: relative;

  overflow: hidden;

  color: var(--shy-ink);

  background-color: var(--shy-bg);

  font-family: Baskerville, "Times New Roman", serif;
}

/* =========================================================
   THANH TIÊU ĐỀ ĐỎ
========================================================= */

.shy-bar {
  margin: 0;

  padding: 12px 16px;

  color: var(--shy-cream);

  background: var(--shy-red);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-align: center;
  text-transform: uppercase;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.shy-dress__inner {
  width: min(100%, 441px);

  margin: 0 auto;

  padding: 24px 8px 32px;

  text-align: center;
}

.shy-dress__intro {
  white-space: pre-line;

  margin: 0;

  color: var(--shy-ink);

  font-size: 13px;

  line-height: 1.7;

  white-space: pre-line;
}

.shy-dress__palette {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 26px;

  margin: 24px 0 0;
  padding: 0;

  list-style: none;
}

.shy-dress__swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.shy-dress__dot {
  width: 54px;
  height: 54px;

  border: 1px solid color-mix(in srgb, var(--shy-red) 25%, transparent);
  border-radius: 50%;

  box-shadow: 0 6px 16px rgba(128, 0, 0, 0.12);
}

.shy-dress__name {
  color: var(--shy-red);

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.16em;
  text-indent: 0.16em;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shy-bar {
    padding: 16px;

    font-size: 24px;
  }

  .shy-dress__inner {
    width: min(100%, 600px);

    padding: 32px 5px 40px;
  }

  .shy-dress__intro {
    font-size: 16px;
  }

  .shy-dress__palette {
    gap: 40px;

    margin-top: 32px;
  }

  .shy-dress__dot {
    width: 72px;
    height: 72px;
  }

  .shy-dress__name {
    font-size: 12px;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.shy-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.shy-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.shy-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.shy-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
