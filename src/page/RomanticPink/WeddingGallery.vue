<template>
  <section class="memories-section">
    <!-- HEADER -->
    <div class="memories-heading">
      <span class="memories-kicker">MEMORIES</span>

      <h2>Album Ảnh Cưới</h2>

      <div class="heading-ornament">
        <span></span>
        <b>♥</b>
        <span></span>
      </div>

      <p class="memories-intro">
        Những khoảnh khắc đẹp nhất<br />
        được lưu giữ cùng chúng mình
      </p>
    </div>

    <!-- GALLERY -->
    <ModernGalleryCarousel
      v-if="gallery.length"
      :images="gallery"
      accent="#c6a06a"
      text-color="#9b4b61"
      :radius="4"
      @open="openLightbox"
    />

    <!-- EMPTY -->
    <div v-else class="gallery-empty">
      <v-icon size="30">mdi-image-outline</v-icon>
      <p>Chưa có hình ảnh</p>
    </div>

    <!-- LIGHTBOX -->
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

  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  dialog.value = false;
  document.body.style.overflow = "";
}
</script>

<style scoped>
/* =====================================================
   SECTION
===================================================== */

.memories-section {
  position: relative;

  width: 100%;

  padding: 65px 0 80px;

  overflow: hidden;

  color: #7d4b5c;
}

/* =====================================================
   HEADER
===================================================== */

.memories-heading {
  position: relative;

  z-index: 5;

  text-align: center;

  padding: 0 20px;

  margin-bottom: 18px;
}

.memories-kicker {
  display: block;

  margin-bottom: 7px;

  color: #b47788;

  font-size: 10px;

  font-weight: 700;

  letter-spacing: 0.36em;
}

.memories-heading h2 {
  margin: 0;

  color: #9b4b61;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: clamp(30px, 7vw, 42px);

  font-weight: 600;

  line-height: 1.05;
}

.heading-ornament {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 11px;

  margin-top: 13px;
}

.heading-ornament span {
  width: 48px;
  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(198, 160, 106, 0.7)
    );
}

.heading-ornament span:last-child {
  transform: rotate(180deg);
}

.heading-ornament b {
  color: #c6a06a;

  font-size: 12px;

  font-weight: 400;
}

.memories-intro {
  margin: 13px 0 0;

  color: #a27684;

  font-size: 12px;

  line-height: 1.7;
}

/* =====================================================
   EMPTY
===================================================== */

.gallery-empty {
  padding: 80px 20px;

  text-align: center;

  color: #b38a98;
}

.gallery-empty p {
  margin: 8px 0 0;

  font-size: 13px;
}
</style>
