<template>
  <section class="mg-gallery">
    <div class="mg-gallery__heading">
      <span class="mg-gallery__kicker">MEMORIES</span>

      <h2>Album Ảnh Cưới</h2>

      <div class="mg-gallery__ornament">
        <span></span>
        <i>✦</i>
        <span></span>
      </div>

      <p class="mg-gallery__intro">
        Những khoảnh khắc đẹp nhất<br />
        được lưu giữ cùng chúng mình
      </p>
    </div>

    <ModernGalleryCarousel
      v-if="gallery.length"
      :images="gallery"
      accent="#d8b676"
      text-color="#f0e6d2"
      frame-bg="#201a24"
      @open="openLightbox"
    />

    <div v-else class="mg-gallery__empty">
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

  color: #f0e6d2;
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

  color: #d8b676;

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

  color: #f0e6d2;
}

.mg-gallery__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin-top: 13px;

  color: #d8b676;
}

.mg-gallery__ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(216, 182, 118, 0.7));
}

.mg-gallery__ornament span:last-child {
  transform: rotate(180deg);
}

.mg-gallery__ornament i {
  font-size: 12px;
  font-style: normal;
}

.mg-gallery__intro {
  margin: 13px 0 0;

  color: #b9a88f;

  font-size: 12px;

  line-height: 1.7;
}

/* =====================================================
   EMPTY
===================================================== */

.mg-gallery__empty {
  padding: 80px 20px;

  text-align: center;

  color: #b9a88f;
}

.mg-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}
</style>
