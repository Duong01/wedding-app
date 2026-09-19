<template>
  <section class="el-gallery">
    <div class="el-gallery__heading">
      <span class="el-gallery__kicker">TIMELESS LOVE</span>

      <h2>Album Ảnh Cưới</h2>

      <div class="el-gallery__ornament">
        <span></span>
        <i>❦</i>
        <span></span>
      </div>

      <p class="el-gallery__intro">
        Những khoảnh khắc đẹp nhất<br />
        được lưu giữ cùng chúng mình
      </p>
    </div>

    <ModernGalleryCarousel
      v-if="gallery.length"
      :images="gallery"
      accent="#c9a45c"
      text-color="#123b2e"
      @open="openLightbox"
    />

    <div v-else class="el-gallery__empty">
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
.el-gallery {
  position: relative;

  width: 100%;

  padding: 55px 0 70px;

  overflow: hidden;

  color: #2e3d36;
}

/* Fine gold lattice texture */
.el-gallery::before {
  content: "";
  position: absolute;
  inset: 0;

  opacity: 0.04;

  background-image:
    repeating-linear-gradient(45deg, rgba(201, 164, 92, 0.7) 0 1px, transparent 1px 20px),
    repeating-linear-gradient(-45deg, rgba(201, 164, 92, 0.7) 0 1px, transparent 1px 20px);

  pointer-events: none;
}

/* =====================================================
   HEADING
===================================================== */

.el-gallery__heading {
  position: relative;
  z-index: 5;

  text-align: center;

  padding: 0 20px;

  margin-bottom: 26px;
}

.el-gallery__kicker {
  display: block;

  margin-bottom: 7px;

  color: #8a7a52;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.36em;
}

.el-gallery__heading h2 {
  margin: 0;

  font-family: "Playfair Display", Georgia, serif;

  font-size: clamp(30px, 7vw, 42px);
  font-weight: 600;

  line-height: 1.05;

  color: #123b2e;
}

.el-gallery__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin-top: 13px;

  color: #c9a45c;
}

.el-gallery__ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 164, 92, 0.85));
}

.el-gallery__ornament span:last-child {
  transform: rotate(180deg);
}

.el-gallery__ornament i {
  font-size: 13px;
  font-style: normal;
}

.el-gallery__intro {
  margin: 13px 0 0;

  color: #6b7a70;

  font-size: 12px;

  line-height: 1.7;
}

/* =====================================================
   EMPTY
===================================================== */

.el-gallery__empty {
  padding: 80px 20px;

  text-align: center;

  color: #8a9a8f;
}

.el-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}
</style>
