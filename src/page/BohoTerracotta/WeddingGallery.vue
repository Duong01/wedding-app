<template>
  <section class="bq-gallery">
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="bq-top-custom-head">
      <p v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="bq-top-custom-head__eyebrow">{{ sectionOverride(sections, "gallery", "Eyebrow") }}</p>
    </header>

    <h2 class="bq-heading">{{ sectionText(sections, "gallery", "Heading", "ALBUM ẢNH") }}</h2>
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'gallery', 'Intro')" class="bq-sub-custom-head">
      <p v-if="sectionOverride(sections, 'gallery', 'Intro')" class="bq-sub-custom-head__intro">{{ sectionOverride(sections, "gallery", "Intro") }}</p>
    </header>


    <div class="bq-gallery__stage">
      <GalleryShowcase
        v-if="gallery.length"
        :images="gallery"
        :layout="galleryLayoutFor('boho-terracotta', layout)"
        accent="var(--bq-accent)"
        text-color="var(--bq-ink)"
        @open="openLightbox"
      />

      <div v-else class="bq-gallery__empty">
        <v-icon size="30">mdi-image-outline</v-icon>
        <p>Chưa có hình ảnh</p>
      </div>
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
.bq-gallery {
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  padding: 19px 24px 8px;

  text-align: center;

  color: var(--bq-ink);
}

.bq-heading {
  margin: 0;

  color: var(--bq-accent);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.04em;

  text-transform: uppercase;
}

.bq-gallery__stage {
  width: 100%;
  max-width: 334px;

  margin-top: 20px;
}

.bq-gallery__empty {
  padding: 40px 0;

  color: var(--bq-muted);
}

.bq-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .bq-heading {
    font-size: 24px;
  }

  .bq-gallery__stage {
    max-width: 560px;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.bq-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.bq-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.bq-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.bq-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.bq-sub-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.bq-sub-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.bq-sub-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.bq-sub-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
