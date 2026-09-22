<template>
  <section class="shy-gallery">
    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="shy-bar">Album Ảnh</h2>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="shy-gallery__inner">
      <ModernGalleryCarousel
        v-if="gallery.length"
        :images="gallery"
        accent="#800000"
        text-color="#666666"
        frame-bg="#ffffff"
        :radius="16"
        @open="openLightbox"
      />

      <div v-else class="shy-gallery__empty">
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
import { defineAsyncComponent, ref } from "vue";

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
.shy-gallery {
  --shy-bg: var(--background, #fff7eb);
  --shy-ink: var(--text, #666666);
  --shy-red: var(--primary, #800000);
  --shy-cream: var(--accent-light, #ffeed2);

  position: relative;

  overflow: hidden;

  color: var(--shy-ink);

  background-color: var(--shy-bg);
}

/* =========================================================
   THANH TIÊU ĐỀ ĐỎ
========================================================= */

.shy-bar {
  margin: 0;

  padding: 12px 16px;

  color: var(--shy-cream);

  background: var(--shy-red);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-align: center;
  text-transform: uppercase;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.shy-gallery__inner {
  width: min(100%, 441px);

  margin: 0 auto;

  padding: 16px 8px 32px;
}

.shy-gallery__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  padding: 40px 0;

  color: color-mix(in srgb, var(--shy-ink) 60%, transparent);
}

.shy-gallery__empty p {
  margin: 0;

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 13px;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shy-bar {
    padding: 16px;

    font-size: 24px;
  }

  .shy-gallery__inner {
    width: min(100%, 600px);

    padding: 20px 5px 40px;
  }
}
</style>
