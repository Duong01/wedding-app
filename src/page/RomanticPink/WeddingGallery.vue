<template>
  <section class="memories-section">
    <!-- HEADER -->
    <div class="memories-heading">
      <span class="gg-eyebrow">KHOẢNH KHẮC</span>

      <h2 class="gg-title">Album Ảnh Cưới</h2>

      <p class="gg-lead">
        Những khoảnh khắc đẹp nhất<br />
        được lưu giữ cùng chúng mình
      </p>
    </div>

    <!-- GALLERY -->
    <ModernGalleryCarousel
      v-if="gallery.length"
      :images="gallery"
      accent="var(--gg-rose, #cb5d6c)"
      text-color="var(--gg-deep, #933845)"
      :radius="16"
      @open="openLightbox"
    />

    <!-- EMPTY -->
    <div v-else class="gallery-empty">
      <v-icon size="30">mdi-image-outline</v-icon>
      <p>Chưa có hình ảnh</p>
    </div>

    <!-- LIGHTBOX -->
    <GalleryModal
      v-if="dialog"
      :images="gallery"
      :start-index="currentIndex"
      @close="closeLightbox"
    />
  </section>
</template>

<script setup>
import { ref, defineAsyncComponent } from "vue";

import ModernGalleryCarousel from "@/components/gallery/ModernGalleryCarousel.vue";

const GalleryModal = defineAsyncComponent(() =>
  import("@/components/gallery/GalleryModal.vue")
);

const props = defineProps({
  gallery: {
    type: Array,
    default: () => [],
  },
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
/* =====================================================
   SECTION
===================================================== */

.memories-section {
  position: relative;

  width: 100%;

  padding: 8px 0 4px;

  overflow: hidden;
}

/* =====================================================
   HEADER
===================================================== */

.memories-heading {
  position: relative;
  z-index: 5;

  text-align: center;

  margin-bottom: 18px;
}

.memories-heading .gg-lead {
  margin-top: 10px;
}

/* =====================================================
   EMPTY
===================================================== */

.gallery-empty {
  padding: 60px 20px;

  text-align: center;

  color: var(--gg-deep, #933845);
  opacity: 0.6;
}

.gallery-empty p {
  margin: 8px 0 0;

  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 13px;
}
</style>
