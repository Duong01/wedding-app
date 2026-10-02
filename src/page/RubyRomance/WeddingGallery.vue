<template>
  <section class="rr-gallery">
    <div class="rr-gallery__heading">
      <span v-if="eyebrow" class="rr-gallery__kicker">{{ eyebrow }}</span>

      <h2>{{ heading }}</h2>

      <div class="rr-gallery__ornament">
        <span></span>
        <i>❥</i>
        <span></span>
      </div>

      <p v-if="intro" class="rr-gallery__intro">
        {{ intro }}
      </p>
    </div>

    <ModernGalleryCarousel
      v-if="gallery.length"
      :images="gallery"
      accent="#683440"
      text-color="#8c2f42"
      @open="openLightbox"
    />

    <div v-else class="rr-gallery__empty">
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
import { computed, ref, defineAsyncComponent } from "vue";

import { sectionText } from "@/data/sectionTitles";

import ModernGalleryCarousel from "@/components/gallery/ModernGalleryCarousel.vue";

const GalleryModal = defineAsyncComponent(() =>
  import("@/components/gallery/GalleryModal.vue")
);

const props = defineProps({
  gallery: { type: Array, default: () => [] },
  sections: { type: Object, default: () => ({}) },
});

const eyebrow = computed(() =>
  sectionText(props.sections, "gallery", "Eyebrow", "MEMORIES")
);

const heading = computed(() =>
  sectionText(props.sections, "gallery", "Heading", "Album Ảnh Cưới")
);

const intro = computed(() =>
  sectionText(
    props.sections,
    "gallery",
    "Intro",
    "Những khoảnh khắc đẹp nhất\ndược lưu giữ cùng chúng mình"
  )
);

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
.rr-gallery {
  position: relative;

  width: 100%;

  padding: 55px 0 70px;

  overflow: hidden;

  color: #8c2f42;
}

/* =====================================================
   HEADING
===================================================== */

.rr-gallery__heading {
  position: relative;
  z-index: 5;

  text-align: center;

  padding: 0 20px;

  margin-bottom: 18px;
}

.rr-gallery__kicker {
  display: block;

  margin-bottom: 7px;

  color: #683440;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.36em;
}

.rr-gallery__heading h2 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(30px, 7vw, 42px);
  font-weight: 600;

  line-height: 1.05;

  color: #8c2f42;
}

.rr-gallery__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin-top: 13px;

  color: #6e3844;
}

.rr-gallery__ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(217, 152, 166, 0.7));
}

.rr-gallery__ornament span:last-child {
  transform: rotate(180deg);
}

.rr-gallery__ornament i {
  font-size: 12px;
  font-style: normal;
}

.rr-gallery__intro {
  margin: 13px 0 0;

  color: #703a46;

  font-size: 12px;

  line-height: 1.7;

  /* Nội dung cho phép xuống dòng bằng ký tự \n */
  white-space: pre-line;
}

/* =====================================================
   EMPTY
===================================================== */

.rr-gallery__empty {
  padding: 80px 20px;

  text-align: center;

  color: #77434e;
}

.rr-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}
</style>
