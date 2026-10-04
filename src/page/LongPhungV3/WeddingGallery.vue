<template>
  <section class="lp-gallery">
    <div class="lp-section-title">
      <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
      <header v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="lp-top-custom-head">
        <p v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="lp-top-custom-head__eyebrow">{{ sectionOverride(sections, "gallery", "Eyebrow") }}</p>
      </header>

      <h2>{{ sectionText(sections, "gallery", "Heading", "ALBUM ẢNH CƯỚI") }}</h2>
    </div>

    <p class="lp-gallery__intro">{{ sectionText(sections, "gallery", "Intro", "Những khoảnh khắc đẹp nhất\nđược lưu giữ cùng chúng mình") }}</p>

    <!-- CAROUSEL VÒNG -->
    <GalleryShowcase
      v-if="gallery.length"
      :images="gallery"
      :layout="galleryLayoutFor('long-phung-v3', layout)"
      accent="var(--tc-ffbe89, #ffbe89)"
      text-color="var(--tc-ffbe89, #ffbe89)"
      frame-bg="rgba(255, 190, 137, 0.08)"
      :radius="8"
      @open="openLightbox"
    />

    <div v-else class="lp-gallery__empty">
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
import { ref, defineAsyncComponent } from "vue";

import GalleryShowcase from "@/components/gallery/GalleryShowcase.vue";
import { galleryLayoutFor } from "@/data/galleryLayouts";

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
.lp-gallery {
  position: relative;

  width: 100%;

  padding: 40px 0 30px;

  overflow: hidden;

  color: var(--tc-ffbe89, #ffbe89);

  text-align: center;
}

/* Tiêu đề có khung frame-title */
.lp-section-title {
  width: fit-content;
  max-width: 100%;

  margin: 0 auto 14px;

  border-style: solid;
  border-color: transparent;
  border-width: 18px;

  border-image-source: url("@/assets/decor/longphung-v3/frame-title.svg");
  border-image-slice: 31;
  border-image-repeat: stretch;

  text-align: center;
}

.lp-section-title h2 {
  margin: 0;

  font-family: "Times New Roman", Times, serif;

  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.05em;

  color: var(--tc-ffbe89, #ffbe89);
}

.lp-gallery__intro {
  white-space: pre-line;

  margin: 0 0 22px;

  font-size: 12px;

  line-height: 1.7;

  color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.7);
}

/* =====================================================
   EMPTY
===================================================== */

.lp-gallery__empty {
  padding: 60px 20px;

  text-align: center;

  color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.5);
}

.lp-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.lp-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.lp-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: var(--tc-ffbe89, #ffbe89);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.lp-top-custom-head__heading {
  margin: 0;
  color: var(--tc-ffbe89, #ffbe89);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.lp-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: rgba(var(--tc-ffbe89-rgb, 255, 190, 137), 0.85);
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
