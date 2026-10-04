<template>
  <section class="cr-gallery">
    <img
      :src="cherryBlossom"
      alt=""
      aria-hidden="true"
      class="cr-gallery__blossom"
      draggable="false"
    />

    <header class="cr-heading">
      <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
      <header v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="cr-top-custom-head">
        <p v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="cr-top-custom-head__eyebrow">{{ sectionOverride(sections, "gallery", "Eyebrow") }}</p>
      </header>

      <h2 class="cr-heading__vi">{{ sectionText(sections, "gallery", "Heading", "Album ảnh cưới") }}</h2>

      <p class="cr-heading__zh">婚紗相簿</p>

      <div class="cr-heading__ornament" aria-hidden="true">
        <span></span>
        <i>❀</i>
        <span></span>
      </div>

      <p class="cr-heading__intro">{{ sectionText(sections, "gallery", "Intro", "Những khoảnh khắc đẹp nhất\nđược lưu giữ cùng chúng mình") }}</p>
    </header>

    <GalleryShowcase
      v-if="gallery.length"
      :images="gallery"
      :layout="galleryLayoutFor('emerald-luxe', layout)"
      accent="var(--cr-accent)"
      text-color="var(--cr-ink)"
      @open="openLightbox"
    />

    <div v-else class="cr-gallery__empty">
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

import { cherryBlossom } from "./emeraldLuxeAssets";

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
.cr-gallery {
  position: relative;

  width: 100%;

  overflow: hidden;

  color: var(--cr-ink);
}

.cr-gallery__blossom {
  position: absolute;

  top: 0;
  right: -20px;

  width: 104px;
  height: 104px;

  object-fit: contain;

  opacity: 0.45;

  pointer-events: none;
}

/* =========================================================
   TIÊU ĐỀ
========================================================= */

.cr-heading {
  position: relative;
  z-index: 5;

  text-align: center;

  margin-bottom: 22px;
}

.cr-heading__vi {
  margin: 0;

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: clamp(22px, 6vw, 30px);
  font-weight: 400;

  letter-spacing: 0.06em;

  text-transform: uppercase;

  color: var(--cr-ink);
}

.cr-heading__zh {
  margin: 4px 0 0;

  font-family: "Noto Serif SC", serif;

  font-size: 0.85em;

  letter-spacing: 0.3em;
  text-indent: 0.3em;

  opacity: 0.7;

  color: var(--cr-soft);
}

.cr-heading__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-top: 12px;

  color: var(--cr-accent);
}

.cr-heading__ornament span {
  width: 52px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--cr-accent-rgb), 1));
}

.cr-heading__ornament span:last-child {
  transform: rotate(180deg);
}

.cr-heading__ornament i {
  font-size: 13px;
  font-style: normal;
}

.cr-heading__intro {
  white-space: pre-line;

  margin: 12px 0 0;

  color: var(--cr-soft);

  font-size: 12px;

  line-height: 1.7;
}

/* =========================================================
   TRỐNG
========================================================= */

.cr-gallery__empty {
  padding: 60px 20px;

  text-align: center;

  color: var(--cr-muted);
}

.cr-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.cr-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.cr-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.cr-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.cr-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
