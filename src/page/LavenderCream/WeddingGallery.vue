<template>
  <section class="lc-gallery">
    <div class="lc-gallery__heading">
      <span v-if="eyebrow" class="lc-gallery__kicker">{{ eyebrow }}</span>

      <h2>{{ heading }}</h2>

      <div class="lc-gallery__ornament">
        <span></span>
        <i>❀</i>
        <span></span>
      </div>

      <p v-if="intro" class="lc-gallery__intro">
        {{ intro }}
      </p>
    </div>

    <GalleryShowcase
      v-if="gallery.length"
      :images="gallery"
      :layout="galleryLayoutFor('lavender-cream', layout)"
      accent="var(--tc-766384, #766384)"
      text-color="var(--tc-584a5b, #584a5b)"
      @open="openLightbox"
    />

    <div v-else class="lc-gallery__empty">
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
.lc-gallery {
  position: relative;

  width: 100%;

  padding: 55px 0 70px;

  overflow: hidden;

  color: var(--tc-584a5b, #584a5b);
}

/* =====================================================
   HEADING
===================================================== */

.lc-gallery__heading {
  position: relative;
  z-index: 5;

  text-align: center;

  padding: 0 20px;

  margin-bottom: 18px;
}

.lc-gallery__kicker {
  display: block;

  margin-bottom: 7px;

  color: var(--tc-766384, #766384);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.36em;
}

.lc-gallery__heading h2 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(30px, 7vw, 42px);
  font-weight: 600;

  line-height: 1.05;

  color: var(--tc-584a5b, #584a5b);
}

.lc-gallery__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin-top: 13px;

  color: var(--tc-736482, #736482);
}

.lc-gallery__ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-b9a0d0-rgb, 185, 160, 208), 0.7));
}

.lc-gallery__ornament span:last-child {
  transform: rotate(180deg);
}

.lc-gallery__ornament i {
  font-size: 12px;
  font-style: normal;
}

.lc-gallery__intro {
  margin: 13px 0 0;

  color: var(--tc-736877, #736877);

  font-size: 12px;

  line-height: 1.7;

  /* Nội dung cho phép xuống dòng bằng ký tự \n */
  white-space: pre-line;
}

/* =====================================================
   EMPTY
===================================================== */

.lc-gallery__empty {
  padding: 80px 20px;

  text-align: center;

  color: var(--tc-716976, #716976);
}

.lc-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}
</style>
