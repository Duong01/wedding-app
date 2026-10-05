<template>
  <section class="la-gallery">
    <img :src="threeHearts" alt="" class="la-gallery__deco" aria-hidden="true" />

    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="la-top-custom-head">
      <p v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="la-top-custom-head__eyebrow">{{ sectionOverride(sections, "gallery", "Eyebrow") }}</p>
    </header>

    <h2 class="la-title">{{ sectionText(sections, "gallery", "Heading", $t("Album Ảnh")) }}</h2>
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'gallery', 'Intro')" class="la-sub-custom-head">
      <p v-if="sectionOverride(sections, 'gallery', 'Intro')" class="la-sub-custom-head__intro">{{ sectionOverride(sections, "gallery", "Intro") }}</p>
    </header>


    <div class="la-gallery__stage">
      <GalleryShowcase
        v-if="gallery.length"
        :images="gallery"
        :layout="galleryLayoutFor('elegant-gold', layout)"
        accent="#d70c1b"
        text-color="#000000"
        frame-bg="#ffffff"
        :radius="16"
        @open="openLightbox"
      />

      <div v-else class="la-gallery__empty">
        <p>{{ $t("Chưa có hình ảnh") }}</p>
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

import threeHearts from "@/assets/love-art/3 tim.webp";
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
.la-gallery {
  position: relative;

  width: 100%;

  text-align: center;
}

/* =========================================================
   HOẠ TIẾT GÓC PHẢI
========================================================= */

.la-gallery__deco {
  position: absolute;
  z-index: 10;

  top: -7px;
  right: -4px;

  width: 42px;
  height: auto;

  transform: rotate(30deg);

  object-fit: contain;

  pointer-events: none;
}

/* =========================================================
   SÂN KHẤU
========================================================= */

.la-gallery__stage {
  width: 100%;
  max-width: 390px;

  margin: 16px auto 0;
}

.la-gallery__empty {
  padding: 60px 20px;

  color: var(--la-ink-soft);

  font-family: var(--la-font-hand);
  font-size: 13px;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .la-gallery__deco {
    top: 2px;
    right: 24px;

    width: 54px;
  }

  .la-gallery__stage {
    max-width: 600px;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.la-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.la-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.la-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.la-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.la-sub-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.la-sub-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.la-sub-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.la-sub-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
