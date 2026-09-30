<template>
  <section class="shc-gallery">
    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="shc-gallery__title">Album Ảnh</h2>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="shc-gallery__inner">
      <ModernGalleryCarousel
        v-if="gallery.length"
        :images="gallery"
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
</style>
