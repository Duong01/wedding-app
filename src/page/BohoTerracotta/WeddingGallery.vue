<template>
  <section class="bt-gallery">
    <div class="bt-gallery__heading">
      <span class="bt-gallery__kicker">WILD &amp; FREE</span>

      <h2>Album Ảnh Cưới</h2>

      <div class="bt-gallery__ornament">
        <span></span>
        <i>❋</i>
        <span></span>
      </div>

      <p class="bt-gallery__intro">
        Những khoảnh khắc đẹp nhất<br />
        được lưu giữ cùng chúng mình
      </p>
    </div>

    <ModernGalleryCarousel
      v-if="gallery.length"
      :images="gallery"
      accent="#c97b5d"
      text-color="#9c5b3f"
      :radius="18"
      @open="openLightbox"
    />

    <div v-else class="bt-gallery__empty">
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
.bt-gallery {
  position: relative;

  width: 100%;

  padding: 55px 0 70px;

  overflow: hidden;

  color: #5c4636;
}

/* Macramé lattice texture */
.bt-gallery::before {
  content: "";
  position: absolute;
  inset: 0;

  opacity: 0.04;

  background-image:
    repeating-linear-gradient(45deg, rgba(156, 91, 63, 0.6) 0 1px, transparent 1px 20px),
    repeating-linear-gradient(-45deg, rgba(156, 91, 63, 0.6) 0 1px, transparent 1px 20px);

  pointer-events: none;
}

/* =====================================================
   HEADING
===================================================== */

.bt-gallery__heading {
  position: relative;
  z-index: 5;

  text-align: center;

  padding: 0 20px;

  margin-bottom: 26px;
}

.bt-gallery__kicker {
  display: block;

  margin-bottom: 7px;

  color: #8a9b7c;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.36em;
}

.bt-gallery__heading h2 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(30px, 7vw, 42px);
  font-weight: 600;

  line-height: 1.05;

  color: #9c5b3f;
}

.bt-gallery__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin-top: 13px;

  color: #c97b5d;
}

.bt-gallery__ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(156, 91, 63, 0.7));
}

.bt-gallery__ornament span:last-child {
  transform: rotate(180deg);
}

.bt-gallery__ornament i {
  font-size: 13px;
  font-style: normal;
}

.bt-gallery__intro {
  margin: 13px 0 0;

  color: #8a6f5c;

  font-size: 12px;

  line-height: 1.7;
}

/* =====================================================
   EMPTY
===================================================== */

.bt-gallery__empty {
  padding: 80px 20px;

  text-align: center;

  color: #b09a8c;
}

.bt-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}
</style>
