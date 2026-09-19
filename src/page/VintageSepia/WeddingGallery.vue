<template>
  <section class="vs-gallery">
    <div class="vs-gallery__heading">
      <span class="vs-gallery__kicker">BỘ SƯU TẬP</span>

      <h2>Những Khoảnh Khắc</h2>

      <div class="vs-gallery__divider">
        <span></span>
        <i>❦</i>
        <span></span>
      </div>

      <p class="vs-gallery__intro">
        Những khoảnh khắc đẹp nhất<br />
        được lưu giữ cùng chúng mình
      </p>
    </div>

    <!-- CAROUSEL VÒNG TRÒN -->
    <ModernGalleryCarousel
      v-if="gallery.length"
      :images="gallery"
      accent="#c2a878"
      text-color="#4a3a2c"
      frame-bg="#fffdf6"
      img-filter="sepia(0.25) saturate(0.9)"
      :radius="4"
      @open="openLightbox"
    />

    <div v-else class="vs-gallery__empty">
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
.vs-gallery {
  position: relative;

  width: 100%;

  padding: 55px 0 70px;

  overflow: hidden;

  color: #6b4f3a;
}

/* =====================================================
   HEADING
===================================================== */

.vs-gallery__heading {
  position: relative;
  z-index: 5;

  text-align: center;

  padding: 0 20px;

  margin-bottom: 26px;
}

.vs-gallery__kicker {
  display: block;

  margin-bottom: 7px;

  color: #97745a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.32em;
  text-indent: 0.32em;
}

.vs-gallery__heading h2 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(30px, 7vw, 42px);
  font-weight: 600;

  line-height: 1.05;

  color: #4a3a2c;
}

.vs-gallery__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin-top: 13px;

  color: #c2a878;
}

.vs-gallery__divider span {
  width: 48px;
  height: 1px;

  background: #3d2f24;

  opacity: 0.55;
}

.vs-gallery__divider i {
  font-size: 12px;
  font-style: normal;
}

.vs-gallery__intro {
  margin: 13px 0 0;

  color: #97745a;

  font-size: 12px;

  line-height: 1.7;
}

/* =====================================================
   EMPTY
===================================================== */

.vs-gallery__empty {
  padding: 80px 20px;

  text-align: center;

  color: #b09a86;
}

.vs-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}
</style>
