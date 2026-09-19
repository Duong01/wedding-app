<template>
  <section class="ob-gallery">
    <div class="ob-gallery__heading">
      <span class="ob-gallery__kicker">BY THE SEA</span>

      <h2>Album Kỷ Niệm</h2>

      <div class="ob-gallery__ornament">
        <span>〜</span>
        <i>❊</i>
        <span>〜</span>
      </div>

      <p class="ob-gallery__intro">
        Những khoảnh khắc đẹp nhất<br />
        được lưu giữ cùng chúng mình
      </p>
    </div>

    <ModernGalleryCarousel
      v-if="gallery.length"
      :images="gallery"
      accent="#4a9ab8"
      text-color="#1d6a8e"
      :radius="18"
      @open="openLightbox"
    />

    <div v-else class="ob-gallery__empty">
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
.ob-gallery {
  position: relative;

  width: 100%;

  padding: 55px 0 70px;

  overflow: hidden;

  color: #274b5c;
}

/* =====================================================
   HEADING
===================================================== */

.ob-gallery__heading {
  position: relative;
  z-index: 5;

  text-align: center;

  padding: 0 20px;

  margin-bottom: 24px;
}

.ob-gallery__kicker {
  display: block;

  margin-bottom: 7px;

  color: #e8927c;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.36em;
  text-indent: 0.36em;
}

.ob-gallery__heading h2 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(30px, 7vw, 42px);
  font-weight: 600;

  line-height: 1.05;

  color: #1d6a8e;
}

.ob-gallery__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin-top: 13px;

  color: #4a9ab8;
}

.ob-gallery__ornament span {
  font-size: 13px;
  font-style: normal;

  opacity: 0.75;
}

.ob-gallery__ornament i {
  font-size: 12px;
  font-style: normal;

  color: #e8927c;
}

.ob-gallery__intro {
  margin: 13px 0 0;

  color: #5b8296;

  font-size: 12px;

  line-height: 1.7;
}

/* =====================================================
   EMPTY
===================================================== */

.ob-gallery__empty {
  padding: 80px 20px;

  text-align: center;

  color: #7ba3b3;
}

.ob-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}
</style>
