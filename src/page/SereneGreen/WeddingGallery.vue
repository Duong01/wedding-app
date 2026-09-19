<template>
  <section class="sg-gallery">
    <div class="sg-gallery__heading">
      <span class="sg-gallery__kicker">MEMORIES</span>

      <h2>Album Ảnh Cưới</h2>

      <div class="sg-gallery__ornament">
        <span></span>
        <i>❀</i>
        <span></span>
      </div>

      <p class="sg-gallery__intro">
        Những khoảnh khắc đẹp nhất<br />
        được lưu giữ cùng chúng mình
      </p>
    </div>

    <ModernGalleryCarousel
      v-if="gallery.length"
      :images="gallery"
      accent="#8fae9b"
      text-color="#28514b"
      @open="openLightbox"
    />

    <div v-else class="sg-gallery__empty">
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
.sg-gallery {
  position: relative;

  width: 100%;

  padding: 55px 0 70px;

  overflow: hidden;

  color: #28514b;
}

/* =====================================================
   HEADING
===================================================== */

.sg-gallery__heading {
  position: relative;
  z-index: 5;

  text-align: center;

  padding: 0 20px;

  margin-bottom: 18px;
}

.sg-gallery__kicker {
  display: block;

  margin-bottom: 7px;

  color: #6c8e7a;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.36em;
}

.sg-gallery__heading h2 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(30px, 7vw, 42px);
  font-weight: 600;

  line-height: 1.05;

  color: #28514b;
}

.sg-gallery__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin-top: 13px;

  color: #8fae9b;
}

.sg-gallery__ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(143, 174, 155, 0.7));
}

.sg-gallery__ornament span:last-child {
  transform: rotate(180deg);
}

.sg-gallery__ornament i {
  font-size: 12px;
  font-style: normal;
}

.sg-gallery__intro {
  margin: 13px 0 0;

  color: #7a8a80;

  font-size: 12px;

  line-height: 1.7;
}

/* =====================================================
   EMPTY
===================================================== */

.sg-gallery__empty {
  padding: 80px 20px;

  text-align: center;

  color: #7a8a80;
}

.sg-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}
</style>
