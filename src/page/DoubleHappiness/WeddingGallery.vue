<template>
  <section class="dh-gallery">
    <div class="dh-gallery__heading">
      <span v-if="eyebrow" class="dh-gallery__kicker">{{ eyebrow }}</span>

      <h2>{{ heading }}</h2>

      <div class="dh-gallery__ornament">
        <span></span>
        <i>囍</i>
        <span></span>
      </div>

      <p v-if="intro" class="dh-gallery__intro">
        {{ intro }}
      </p>
    </div>

    <ModernGalleryCarousel
      v-if="gallery.length"
      :images="gallery"
      accent="#d9a441"
      text-color="#f3d9a4"
      frame-bg="#5c0e10"
      :radius="6"
      @open="openLightbox"
    />

    <div v-else class="dh-gallery__empty">
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
  sectionText(props.sections, "gallery", "Eyebrow", "KỶ NIỆM TƯƠI ĐẸP")
);

const heading = computed(() =>
  sectionText(props.sections, "gallery", "Heading", "Album Hình Cưới")
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
.dh-gallery {
  --dh-red: #7a1216;
  --dh-red-bright: #a32a2a;
  --dh-red-dark: #5c0e10;
  --dh-gold: #d9a441;
  --dh-gold-light: #f3d9a4;
  --dh-cream: #fdf6ec;
  --dh-ink: #5a3d2e;

  position: relative;

  width: 100%;

  padding: 55px 0 70px;

  overflow: hidden;

  color: var(--dh-ink);
}

/* =====================================================
   HEADING
===================================================== */

.dh-gallery__heading {
  position: relative;
  z-index: 5;

  text-align: center;

  padding: 0 20px;

  margin-bottom: 22px;
}

.dh-gallery__kicker {
  display: block;

  margin-bottom: 7px;

  color: var(--dh-red-bright);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.36em;
}

.dh-gallery__heading h2 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(30px, 7vw, 42px);
  font-weight: 600;

  line-height: 1.05;

  color: var(--dh-red);
}

.dh-gallery__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin-top: 13px;

  color: var(--dh-gold);
}

.dh-gallery__ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(217, 164, 65, 0.75));
}

.dh-gallery__ornament span:last-child {
  transform: rotate(180deg);
}

.dh-gallery__ornament i {
  font-size: 15px;
  font-style: normal;
}

.dh-gallery__intro {
  margin: 13px 0 0;

  color: #8a6a52;

  font-size: 12px;

  line-height: 1.7;

  /* Nội dung cho phép xuống dòng bằng ký tự \n */
  white-space: pre-line;
}

/* =====================================================
   EMPTY
===================================================== */

.dh-gallery__empty {
  padding: 80px 20px;

  text-align: center;

  color: #b09a8c;
}

.dh-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}
</style>
