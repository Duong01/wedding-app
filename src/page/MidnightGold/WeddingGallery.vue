<template>
  <section class="mg-gallery">
    <div class="mg-gallery__heading">
      <span class="mg-gallery__kicker">{{ sectionText(sections, "gallery", "Eyebrow", "MEMORIES") }}</span>

      <h2>{{ sectionText(sections, "gallery", "Heading", $t("Album Ảnh Cưới")) }}</h2>

      <div class="mg-gallery__ornament">
        <span></span>
        <i>✦</i>
        <span></span>
      </div>

      <p class="mg-gallery__intro">{{ sectionText(sections, "gallery", "Intro", $t("Những khoảnh khắc đẹp nhất được lưu giữ cùng chúng mình")) }}</p>
    </div>

    <GalleryShowcase
      v-if="gallery.length"
      :images="gallery"
      :layout="galleryLayoutFor('midnight-gold', layout)"
      accent="var(--tc-d8b676, #d8b676)"
      text-color="var(--tc-f0e6d2, #f0e6d2)"
      frame-bg="var(--tc-201a24, #201a24)"
      @open="openLightbox"
    />

    <div v-else class="mg-gallery__empty">
      <v-icon size="30">mdi-image-outline</v-icon>
      <p>{{ $t("Chưa có hình ảnh") }}</p>
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
import { sectionText } from "@/data/sectionTitles";
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
.mg-gallery {
  position: relative;

  width: 100%;

  padding: 55px 0 70px;

  overflow: hidden;

  color: var(--tc-f0e6d2, #f0e6d2);
}

/* =====================================================
   HEADING
===================================================== */

.mg-gallery__heading {
  position: relative;
  z-index: 5;

  text-align: center;

  padding: 0 20px;

  margin-bottom: 18px;
}

.mg-gallery__kicker {
  display: block;

  margin-bottom: 7px;

  color: var(--tc-d8b676, #d8b676);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.36em;
}

.mg-gallery__heading h2 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(30px, 7vw, 42px);
  font-weight: 600;

  line-height: 1.05;

  color: var(--tc-f0e6d2, #f0e6d2);
}

.mg-gallery__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin-top: 13px;

  color: var(--tc-d8b676, #d8b676);
}

.mg-gallery__ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-d8b676-rgb, 216, 182, 118), 0.7));
}

.mg-gallery__ornament span:last-child {
  transform: rotate(180deg);
}

.mg-gallery__ornament i {
  font-size: 12px;
  font-style: normal;
}

.mg-gallery__intro {
  white-space: pre-line;

  margin: 13px 0 0;

  color: var(--tc-b9a88f, #b9a88f);

  font-size: 12px;

  line-height: 1.7;
}

/* =====================================================
   EMPTY
===================================================== */

.mg-gallery__empty {
  padding: 80px 20px;

  text-align: center;

  color: var(--tc-b9a88f, #b9a88f);
}

.mg-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}
</style>
