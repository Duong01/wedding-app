<template>
  <section class="wb-gallery">
    <div class="wb-gallery__heading">
      <span v-if="eyebrow" class="wb-gallery__kicker">{{ eyebrow }}</span>

      <h2>{{ heading }}</h2>

      <div class="wb-gallery__ornament">
        <span></span>
        <i>❀</i>
        <span></span>
      </div>

      <p v-if="intro" class="wb-gallery__intro">
        {{ intro }}
      </p>
    </div>

    <GalleryShowcase
      v-if="gallery.length"
      :images="gallery"
      :layout="galleryLayoutFor('watercolor-blush', layout)"
      accent="var(--tc-a5586c, #a5586c)"
      text-color="var(--tc-8a4a5c, #8a4a5c)"
      @open="openLightbox"
    />

    <div v-else class="wb-gallery__empty">
      <v-icon size="30">mdi-image-outline</v-icon>
      <p>{{ $t("Chưa có hình ảnh") }}</p>
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

import GalleryShowcase from "@/components/gallery/GalleryShowcase.vue";
import { galleryLayoutFor } from "@/data/galleryLayouts";
import { t } from "@/lang";
const GalleryModal = defineAsyncComponent(() =>
  import("@/components/gallery/GalleryModal.vue")
);

const props = defineProps({
  /* Kiểu album (settings.GalleryLayout) — trống / "default" = kiểu chọn sẵn của mẫu (data/galleryLayouts.js) */
  layout: { type: String, default: "" },
  gallery: { type: Array, default: () => [] },
  sections: { type: Object, default: () => ({}) },
});

const eyebrow = computed(() =>
  sectionText(props.sections, "gallery", "Eyebrow", "MEMORIES")
);

const heading = computed(() =>
  sectionText(props.sections, "gallery", "Heading", t("Album Ảnh Cưới"))
);

const intro = computed(() =>
  sectionText(
    props.sections,
    "gallery",
    "Intro",
    t("Những khoảnh khắc đẹp nhất\ndược lưu giữ cùng chúng mình")
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
.wb-gallery {
  position: relative;

  width: 100%;

  padding: 55px 0 70px;

  overflow: hidden;

  color: var(--tc-8a4a5c, #8a4a5c);
}

/* =====================================================
   HEADING
===================================================== */

.wb-gallery__heading {
  position: relative;
  z-index: 5;

  text-align: center;

  padding: 0 20px;

  margin-bottom: 18px;
}

.wb-gallery__kicker {
  display: block;

  margin-bottom: 7px;

  color: var(--tc-a5586c, #a5586c);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.36em;
}

.wb-gallery__heading h2 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(30px, 7vw, 42px);
  font-weight: 600;

  line-height: 1.05;

  color: var(--tc-8a4a5c, #8a4a5c);
}

.wb-gallery__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin-top: 13px;

  color: var(--tc-a05a6e, #a05a6e);
}

.wb-gallery__ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-e8b4c4-rgb, 232, 180, 196), 0.7));
}

.wb-gallery__ornament span:last-child {
  transform: rotate(180deg);
}

.wb-gallery__ornament i {
  font-size: 12px;
  font-style: normal;
}

.wb-gallery__intro {
  margin: 13px 0 0;

  color: var(--tc-9d5f6d, #9d5f6d);

  font-size: 12px;

  line-height: 1.7;

  /* Nội dung cho phép xuống dòng bằng ký tự \n */
  white-space: pre-line;
}

/* =====================================================
   EMPTY
===================================================== */

.wb-gallery__empty {
  padding: 80px 20px;

  text-align: center;

  color: var(--tc-9c6a76, #9c6a76);
}

.wb-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}
</style>
