<template>
  <section class="cb-gallery">
    <div class="cb-gallery__heading">
      <span class="cb-gallery__kicker">{{ sectionText(sections, "gallery", "Eyebrow", "MEMORIES") }}</span>

      <h2>{{ sectionText(sections, "gallery", "Heading", $t("Album Ảnh Cưới")) }}</h2>
      <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
      <header v-if="sectionOverride(sections, 'gallery', 'Intro')" class="cb-custom-head">
        <p v-if="sectionOverride(sections, 'gallery', 'Intro')" class="cb-custom-head__intro">{{ sectionOverride(sections, "gallery", "Intro") }}</p>
      </header>


      <div class="cb-gallery__ornament">
        <span></span>
        <i>❀</i>
        <span></span>
      </div>

      <p class="cb-gallery__intro">
        {{ $t("Những khoảnh khắc đẹp nhất") }}<br />
        {{ $t("được lưu giữ cùng chúng mình") }}
      </p>
    </div>

    <GalleryShowcase
      v-if="gallery.length"
      :images="gallery"
      :layout="galleryLayoutFor('champagne-blush', layout)"
      accent="var(--tc-c9a06a, #c9a06a)"
      text-color="var(--tc-6c4b4a, #6c4b4a)"
      @open="openLightbox"
    />

    <div v-else class="cb-gallery__empty">
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
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { ref, defineAsyncComponent } from "vue";

import GalleryShowcase from "@/components/gallery/GalleryShowcase.vue";
import { galleryLayoutFor } from "@/data/galleryLayouts";
const GalleryModal = defineAsyncComponent(() =>
  import("@/components/gallery/GalleryModal.vue")
);

const props = defineProps({
  /* Kiểu album (settings.GalleryLayout) — trống / "default" = kiểu chọn sẵn của mẫu (data/galleryLayouts.js) */
  layout: { type: String, default: "" },
  sections: { type: Object, default: () => ({}) },
  gallery: { type: Array, default: () => [] },
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
.cb-gallery {
  position: relative;

  width: 100%;

  padding: 55px 0 70px;

  overflow: hidden;

  color: var(--tc-6c4b4a, #6c4b4a);
}

/* =====================================================
   HEADING
===================================================== */

.cb-gallery__heading {
  position: relative;
  z-index: 5;

  text-align: center;

  padding: 0 20px;

  margin-bottom: 18px;
}

.cb-gallery__kicker {
  display: block;

  margin-bottom: 7px;

  color: var(--tc-926664, #926664);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.36em;
}

.cb-gallery__heading h2 {
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(30px, 7vw, 42px);
  font-weight: 600;

  line-height: 1.05;

  color: var(--tc-6c4b4a, #6c4b4a);
}

.cb-gallery__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  margin-top: 13px;

  color: var(--tc-896d48, #896d48);
}

.cb-gallery__ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--tc-c9a06a-rgb, 201, 160, 106), 0.7));
}

.cb-gallery__ornament span:last-child {
  transform: rotate(180deg);
}

.cb-gallery__ornament i {
  font-size: 12px;
  font-style: normal;
}

.cb-gallery__intro {
  margin: 13px 0 0;

  color: var(--tc-886b64, #886b64);

  font-size: 12px;

  line-height: 1.7;
}

/* =====================================================
   EMPTY
===================================================== */

.cb-gallery__empty {
  padding: 80px 20px;

  text-align: center;

  color: var(--tc-7b6c66, #7b6c66);
}

.cb-gallery__empty p {
  margin: 8px 0 0;

  font-size: 13px;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.cb-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.cb-custom-head__eyebrow {
  margin: 0 0 6px;
  color: var(--tc-926664, #926664);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.cb-custom-head__heading {
  margin: 0;
  color: var(--tc-6c4b4a, #6c4b4a);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.cb-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: var(--tc-7a6662, #7a6662);
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
