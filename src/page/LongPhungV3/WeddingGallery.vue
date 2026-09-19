<template>
  <section class="lp-gallery">
    <div class="lp-section-title">
      <h2>ALBUM ẢNH CƯỚI</h2>
    </div>

    <p class="lp-gallery__intro">
      Những khoảnh khắc đẹp nhất<br />
      được lưu giữ cùng chúng mình
    </p>

    <!-- CAROUSEL VÒNG -->
    <ModernGalleryCarousel
      v-if="gallery.length"
      :images="gallery"
      accent="#ffbe89"
      text-color="#ffbe89"
      frame-bg="rgba(255, 190, 137, 0.08)"
      :radius="8"
      @open="openLightbox"
    />

    <div v-else class="lp-gallery__empty">
      <v-icon size="30">mdi-image-outline</v-icon>
      <p>Chưa có hình ảnh</p>
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
.lp-gallery {
  position: relative;

  width: 100%;

  padding: 40px 0 30px;

  overflow: hidden;

  color: #ffbe89;

  text-align: center;
}

/* Tiêu đề có khung frame-title */
.lp-section-title {
  width: fit-content;
  max-width: 100%;

  margin: 0 auto 14px;

  border-style: solid;
  border-color: transparent;
  border-width: 18px;

  border-image-source: url("@/assets/decor/longphung-v3/frame-title.svg");
  border-image-slice: 31;
  border-image-repeat: stretch;

  text-align: center;
}

.lp-section-title h2 {
  margin: 0;

  font-family: "Times New Roman", Times, serif;

  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.05em;

  color: #ffbe89;
}

.lp-gallery__intro {
  margin: 0 0 22px;

  font-size: 12px;

  line-height: 1.7;

  color: rgba(255, 190, 137, 0.7);
}

/* =====================================================
   EMPTY
===================================================== */

.lp-gallery__empty {
  padding: 60px 20px;

  text-align: center;

  color: rgba(255, 190, 137, 0.5);
}

.lp-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}
</style>
