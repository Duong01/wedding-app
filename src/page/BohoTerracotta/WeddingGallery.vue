<template>
  <section class="bq-gallery">
    <h2 class="bq-heading">ALBUM ẢNH</h2>

    <div class="bq-gallery__stage">
      <ModernGalleryCarousel
        v-if="gallery.length"
        :images="gallery"
        accent="var(--bq-accent)"
        text-color="var(--bq-ink)"
        @open="openLightbox"
      />

      <div v-else class="bq-gallery__empty">
        <v-icon size="30">mdi-image-outline</v-icon>
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
import { ref, defineAsyncComponent } from "vue";

import ModernGalleryCarousel from "@/components/gallery/ModernGalleryCarousel.vue";

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
</style>
