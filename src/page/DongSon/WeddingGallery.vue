<template>
  <section class="gallery">
    <div class="gallery-heading">
      <small>OUR MEMORIES</small>
      <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
      <header v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="ds-top-custom-head">
        <p v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="ds-top-custom-head__eyebrow">{{ sectionOverride(sections, "gallery", "Eyebrow") }}</p>
      </header>

      <h2>{{ sectionText(sections, "gallery", "Heading", "Khoảnh khắc yêu thương") }}</h2>
      <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
      <header v-if="sectionOverride(sections, 'gallery', 'Intro')" class="ds-sub-custom-head">
        <p v-if="sectionOverride(sections, 'gallery', 'Intro')" class="ds-sub-custom-head__intro">{{ sectionOverride(sections, "gallery", "Intro") }}</p>
      </header>

      <p>Những hình ảnh chúng mình muốn lưu giữ mãi.</p>
    </div>

    <GalleryShowcase
      v-if="gallery.length"
      :images="gallery"
      :layout="galleryLayoutFor('dong-son', layout)"
      accent="var(--tc-c99552, #c99552)"
      text-color="var(--tc-641914, #641914)"
      frame-bg="var(--tc-641914, #641914)"
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
  background: var(--tc-f3ead8, #f3ead8);
  color: var(--tc-641914, #641914);
}

.gallery-heading {
  text-align: center;
  margin-bottom: 30px;
}

.gallery-heading small {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .4em;
  color: var(--tc-8b5829, #8b5829);
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
  color: var(--tc-765f57, #765f57);
}

.gallery-empty {
  padding: 60px 20px;
  text-align: center;
  color: var(--tc-8b5829, #8b5829);
}

.gallery-empty p {
  margin: 8px 0 0;
  font-size: 13px;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.ds-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.ds-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ds-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.ds-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.ds-sub-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.ds-sub-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ds-sub-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.ds-sub-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
