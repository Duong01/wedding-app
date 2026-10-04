<template>
  <section class="tdx-gallery">
    <!-- =====================================================
         HOẠ TIẾT NỀN
    ====================================================== -->

    <div class="tdx-gallery__decor" aria-hidden="true">
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

    <div class="tdx-gallery__inner">
      <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
      <header v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="tdx-top-custom-head">
        <p v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="tdx-top-custom-head__eyebrow">{{ sectionOverride(sections, "gallery", "Eyebrow") }}</p>
      </header>

      <h2 class="tdx-heading">{{ sectionText(sections, "gallery", "Heading", "Album Ảnh") }}</h2>

      <p class="tdx-gallery__intro">{{ sectionText(sections, "gallery", "Intro", "Những khoảnh khắc đẹp nhất được lưu giữ cùng chúng mình") }}</p>
    </div>

    <GalleryShowcase
      v-if="gallery.length"
      :images="gallery"
      :layout="galleryLayoutFor('to-duyen-xanh', layout)"
      accent="#5e813c"
      text-color="#1a3500"
      frame-bg="#ffffff"
      :radius="4"
      @open="openLightbox"
    />

    <div v-else class="tdx-gallery__empty">
      <v-icon size="30">mdi-image-outline</v-icon>
      <p>Chưa có hình ảnh</p>
    </div>

    <GalleryModal
      v-if="dialog"
      :images="gallery"
      :start-index="currentIndex"
      @close="closeLightbox"
    />
  </section>
</template>

<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { defineAsyncComponent, ref } from "vue";

import GalleryShowcase from "@/components/gallery/GalleryShowcase.vue";
import { galleryLayoutFor } from "@/data/galleryLayouts";

import { flowerDecoration, lineDecoration } from "./toDuyenXanhAssets";

const GalleryModal = defineAsyncComponent(() =>
  import("@/components/gallery/GalleryModal.vue")
);

const props = defineProps({
  /* Kiểu album (settings.GalleryLayout) — trống / "default" = kiểu chọn sẵn của mẫu (data/galleryLayouts.js) */
  layout: { type: String, default: "" },
  sections: { type: Object, default: () => ({}) },
  gallery: { type: Array, default: () => [] },
});

const currentIndex = ref(0);
const dialog = ref(false);

function openLightbox(index) {
  if (!props.gallery.length) return;

  currentIndex.value = index;
  dialog.value = true;
}

function closeLightbox() {
  dialog.value = false;
}
</script>

<style scoped>
.tdx-gallery {
  --tdx-bg: var(--background, #fefbf4);
  --tdx-ink: var(--text, #1a3500);
  --tdx-green: var(--primary, #5e813c);
  --tdx-line: var(--accent, #d1db9c);

  position: relative;
  isolation: isolate;

  width: 100%;

  padding: 40px 0 46px;

  overflow: hidden;

  color: var(--tdx-ink);

  background-color: var(--tdx-bg);
}

/* =========================================================
   HOẠ TIẾT NỀN
========================================================= */

.tdx-gallery__decor {
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

.tdx-gallery__inner {
  position: relative;
  z-index: 5;

  width: min(100%, 441px);

  margin: 0 auto 22px;

  padding: 0 10%;

  text-align: start;
}

.tdx-heading {
  margin: 0 0 8px;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-transform: uppercase;
}

.tdx-gallery__intro {
  white-space: pre-line;

  margin: 0;

  color: var(--tdx-ink);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 12px;

  line-height: 1.6;

  white-space: pre-line;
}

/* =========================================================
   EMPTY
========================================================= */

.tdx-gallery__empty {
  padding: 60px 20px;

  text-align: center;

  color: var(--tdx-green);
}

.tdx-gallery__empty p {
  margin: 8px 0 0;

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 13px;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tdx-gallery {
    padding: 50px 0 60px;
  }

  .tdx-gallery__inner {
    width: min(100%, 600px);

    padding: 0 5px;
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

  .tdx-gallery__intro {
    font-size: 16px;
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
