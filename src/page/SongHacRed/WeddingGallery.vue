<template>
  <section class="shc-gallery">
    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="shc-top-custom-head">
      <p v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="shc-top-custom-head__eyebrow">{{ sectionOverride(sections, "gallery", "Eyebrow") }}</p>
    </header>

    <h2 class="shc-gallery__title">{{ sectionText(sections, "gallery", "Heading", "Album Ảnh") }}</h2>
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'gallery', 'Intro')" class="shc-sub-custom-head">
      <p v-if="sectionOverride(sections, 'gallery', 'Intro')" class="shc-sub-custom-head__intro">{{ sectionOverride(sections, "gallery", "Intro") }}</p>
    </header>


    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="shc-gallery__inner">
      <GalleryShowcase
        v-if="gallery.length"
        :images="gallery"
        :layout="galleryLayoutFor('song-hac-red', layout)"
        accent="#FFE8A4"
        text-color="#FFE8A4"
        frame-bg="#ffffff"
        :radius="16"
        @open="openLightbox"
      />

      <div v-else class="shc-gallery__empty">
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
import { defineAsyncComponent, ref } from "vue";

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
.shc-gallery {
  --shc-red: var(--primary, #920002);
  --shc-cream: var(--accent, #ffe8a4);

  position: relative;

  overflow: hidden;

  margin-top: 23px;
  padding: 35px 0;

  color: var(--shc-cream);

  background-color: var(--shc-red);
}

/* =========================================================
   TIÊU ĐỀ
========================================================= */

.shc-gallery__title {
  margin: 0 0 20px;

  color: var(--shc-cream);

  font-family: "Times New Roman", Times, serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-align: center;
  text-transform: uppercase;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.shc-gallery__inner {
  width: min(100% - 27px, 414px);

  margin: 0 auto;
}

.shc-gallery__empty {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 8px;

  padding: 40px 0;

  color: rgba(255, 232, 164, 0.6);
}

.shc-gallery__empty p {
  margin: 0;

  font-family: "Times New Roman", Times, serif;
  font-size: 13px;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shc-gallery {
    margin-top: 31px;
  }

  .shc-gallery__title {
    font-size: 27px;
  }

  .shc-gallery__inner {
    width: min(100% - 37px, 563px);
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

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.shc-sub-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.shc-sub-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.shc-sub-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.shc-sub-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
