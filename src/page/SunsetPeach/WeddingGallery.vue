<template>
  <section class="sp-gallery">
    <div class="sp-gallery__heading">
      <span class="sp-gallery__kicker">MEMORIES</span>

      <h2>Album Ảnh Cưới</h2>

      <div class="sp-gallery__ornament">
        <span></span>
        <i>❁</i>
        <span></span>
      </div>

      <p class="sp-gallery__intro">
        Những khoảnh khắc đẹp nhất<br />
        được lưu giữ cùng chúng mình
      </p>
    </div>

    <ModernGalleryCarousel
      v-if="gallery.length"
      :images="gallery"
      accent="#e0a37e"
      text-color="#7a4a3d"
      @open="openLightbox"
    />

    <div v-else class="sp-gallery__empty">
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
.sp-gallery {
  position: relative;

  width: 100%;

  padding: 55px 0 70px;

  overflow: hidden;

  color: #7a4a3d;
}

/* =====================================================
   HEADING
===================================================== */

.sp-gallery__heading {
  position: relative;
  z-index: 5;

  text-align: center;

  padding: 0 20px;

  margin-bottom: 18px;
}

.sp-gallery__kicker {
  display: block;

  margin-bottom: 7px;

  color: #d67a63;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.36em;
}

.sp-gallery__heading h2 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(30px, 7vw, 42px);
  font-weight: 600;

  line-height: 1.05;

  color: #7a4a3d;
}

.sp-gallery__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin-top: 13px;

  color: #e0a37e;
}

.sp-gallery__ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(224, 163, 126, 0.7));
}

.sp-gallery__ornament span:last-child {
  transform: rotate(180deg);
}

.sp-gallery__ornament i {
  font-size: 12px;
  font-style: normal;
}

.sp-gallery__intro {
  margin: 13px 0 0;

  color: #a3806f;

  font-size: 12px;

  line-height: 1.7;
}

/* =====================================================
   EMPTY
===================================================== */

.sp-gallery__empty {
  padding: 80px 20px;

  text-align: center;

  color: #a3806f;
}

.sp-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}
</style>
