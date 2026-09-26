<template>
  <section class="gallery">
    <div class="gallery-heading">
      <small>OUR MEMORIES</small>
      <h2>Khoảnh khắc yêu thương</h2>
      <p>Những hình ảnh chúng mình muốn lưu giữ mãi.</p>
    </div>

    <ModernGalleryCarousel
      v-if="gallery.length"
      :images="gallery"
      accent="#c99552"
      text-color="#641914"
      frame-bg="#641914"
      :radius="2"
      @open="openLightbox"
    />

    <div v-else class="gallery-empty">
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
.gallery {
  padding: 70px 18px;
  background: #f3ead8;
  color: #641914;
}

.gallery-heading {
  text-align: center;
  margin-bottom: 30px;
}

.gallery-heading small {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .4em;
  color: #8b5829;
}

h2 {
  margin: 8px 0;
  font-family: Georgia, serif;
  font-size: 30px;
  font-weight: 400;
}

.gallery-heading p {
  font-family: Georgia, serif;
  font-style: italic;
  font-size: 13px;
  color: #765f57;
}

.gallery-empty {
  padding: 60px 20px;
  text-align: center;
  color: #8b5829;
}

.gallery-empty p {
  margin: 8px 0 0;
  font-size: 13px;
}
</style>
