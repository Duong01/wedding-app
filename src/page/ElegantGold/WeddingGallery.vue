<template>
  <section class="la-gallery">
    <img :src="threeHearts" alt="" class="la-gallery__deco" aria-hidden="true" />

    <h2 class="la-title">Album Ảnh</h2>

    <div class="la-gallery__stage">
      <ModernGalleryCarousel
        v-if="gallery.length"
        :images="gallery"
        accent="#d70c1b"
        text-color="#000000"
        frame-bg="#ffffff"
        :radius="16"
        @open="openLightbox"
      />

      <div v-else class="la-gallery__empty">
        <p>Chưa có hình ảnh</p>
      </div>
    </div>

    <v-dialog
      v-model="dialog"
      fullscreen
      transition="dialog-fade-transition"
      content-class="gallery-dialog"
    >
      <GalleryModal
        v-if="dialog"
        :images="gallery"
        :start-index="currentIndex"
        @close="closeLightbox"
      />
    </v-dialog>
  </section>
</template>

<script setup>
import { defineAsyncComponent, ref } from "vue";

import ModernGalleryCarousel from "@/components/gallery/ModernGalleryCarousel.vue";

import threeHearts from "@/assets/love-art/3 tim.webp";

const GalleryModal = defineAsyncComponent(() =>
  import("@/components/gallery/GalleryModal.vue")
);

const props = defineProps({
  gallery: { type: Array, default: () => [] },
});

const currentIndex = ref(0);
const dialog = ref(false);

function openLightbox(index) {
  if (!props.gallery.length) return;

  currentIndex.value = index;
  dialog.value = true;

  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  dialog.value = false;
  document.body.style.overflow = "";
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
</style>
