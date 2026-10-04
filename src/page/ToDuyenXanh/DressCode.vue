<template>
  <section class="tdx-dress">
    <!-- =====================================================
         HOẠ TIẾT NỀN
    ====================================================== -->

    <div class="tdx-dress__decor" aria-hidden="true">
      <img
        :src="lineDecoration"
        alt=""
        class="tdx-decor tdx-decor--line-right"
        draggable="false"
      />

      <img
        :src="flowerDecoration"
        alt=""
        class="tdx-decor tdx-decor--flower-right"
        draggable="false"
      />
    </div>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="tdx-dress__inner">
      <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
      <header v-if="sectionOverride(sections, 'dressCode', 'Eyebrow')" class="tdx-top-custom-head">
        <p v-if="sectionOverride(sections, 'dressCode', 'Eyebrow')" class="tdx-top-custom-head__eyebrow">{{ sectionOverride(sections, "dressCode", "Eyebrow") }}</p>
      </header>

      <h2 class="tdx-heading">{{ sectionText(sections, "dressCode", "Heading", "Dress Code") }}</h2>

      <p class="tdx-dress__intro">{{ sectionText(sections, "dressCode", "Intro", "Để bức ảnh chung thêm phần hài hoà, chúng mình mong quý khách ghé thăm buổi tiệc với trang phục mang tông màu sau") }}</p>

      <ul class="tdx-dress__palette">
        <li v-for="color in palette" :key="color.hex" class="tdx-dress__swatch">
          <span class="tdx-dress__dot" :style="{ background: color.hex }"></span>

          <span class="tdx-dress__name">{{ color.name }}</span>
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
import { flowerDecoration, lineDecoration } from "./toDuyenXanhAssets";

const palette = [
  { name: "XANH RÊU", hex: "#5e813c" },
  { name: "XANH RỪNG", hex: "#1a3500" },
  { name: "KEM", hex: "#f3dfc5" },
];
</script>

<style scoped>
.tdx-dress {
  --tdx-bg: var(--background, #fefbf4);
  --tdx-ink: var(--text, #1a3500);
  --tdx-green: var(--primary, #5e813c);
  --tdx-line: var(--accent, #d1db9c);

  position: relative;
  isolation: isolate;

  overflow: hidden;

  color: var(--tdx-ink);

  background-color: var(--tdx-bg);
}

/* =========================================================
   HOẠ TIẾT NỀN
========================================================= */

.tdx-dress__decor {
  position: absolute;
  inset: 0;
  z-index: -1;

  pointer-events: none;
}

.tdx-decor {
  position: absolute;

  max-width: none;

  object-fit: cover;

  pointer-events: none;
}

.tdx-decor--line-right {
  top: 40px;
  right: -70px;

  width: 198px;
  height: 420px;

  transform: rotate(-177.25deg);
}

.tdx-decor--flower-right {
  top: 10px;
  right: -80px;

  width: 190px;
  height: 190px;

  object-fit: contain;

  transform: scaleX(-1) rotate(50deg);
}

/* =========================================================
   NỘI DUNG
========================================================= */

.tdx-dress__inner {
  position: relative;
  z-index: 2;

  width: min(100%, 441px);

  margin: 0 auto;

  padding: 2.5% 10% 20%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;

  text-align: start;
}

.tdx-heading {
  margin: 0;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-transform: uppercase;
}

.tdx-dress__intro {
  white-space: pre-line;

  margin: 0;

  color: var(--tdx-ink);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 12px;

  line-height: 1.6;

  white-space: pre-line;
}

/* =========================================================
   BẢNG MÀU
========================================================= */

.tdx-dress__palette {
  width: 100%;

  margin: 8px 0 0;
  padding: 0;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;

  list-style: none;
}

.tdx-dress__swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.tdx-dress__dot {
  width: 54px;
  height: 54px;

  border: 1px solid var(--tdx-line);
  border-radius: 50%;

  box-shadow: 0 6px 16px rgba(26, 53, 0, 0.12);
}

.tdx-dress__name {
  color: var(--tdx-ink);

  font-family: "Times New Roman", serif;
  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.14em;

  text-align: center;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tdx-dress__inner {
    width: min(100%, 600px);

    padding: 2.5% 5px 20%;

    gap: 16px;
  }

  .tdx-decor--line-right {
    top: 60px;
    left: -150px;
    right: auto;

    width: 158px;
    height: 560px;
  }

  .tdx-decor--flower-right {
    top: 0;
    left: -300px;
    right: auto;

    width: 420px;
    height: 420px;
  }

  .tdx-heading {
    font-size: 27px;
  }

  .tdx-dress__intro {
    font-size: 16px;
  }

  .tdx-dress__dot {
    width: 72px;
    height: 72px;
  }

  .tdx-dress__name {
    font-size: 11px;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.tdx-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.tdx-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.tdx-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.tdx-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
