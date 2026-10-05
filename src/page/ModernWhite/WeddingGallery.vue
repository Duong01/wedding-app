<template>
  <section class="mw-gallery">
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="mw-top-custom-head">
      <p v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="mw-top-custom-head__eyebrow">{{ sectionOverride(sections, "gallery", "Eyebrow") }}</p>
    </header>

    <h2 class="mw-title">{{ sectionText(sections, "gallery", "Heading", $t("Album Ảnh")) }}</h2>
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'gallery', 'Intro')" class="mw-sub-custom-head">
      <p v-if="sectionOverride(sections, 'gallery', 'Intro')" class="mw-sub-custom-head__intro">{{ sectionOverride(sections, "gallery", "Intro") }}</p>
    </header>


    <!-- Album: kiểu chọn sẵn của mẫu (Masonry) hoặc kiểu chủ thiệp chọn -->
    <GalleryShowcase
      v-if="gallery.length"
      :images="gallery"
      :layout="galleryLayoutFor('modern-white', layout)"
      accent="var(--primary, #486c7d)"
      text-color="var(--text, #3a5666)"
      :radius="12"
      @open="openGallery"
    />

    <p v-else class="mw-gallery__empty">{{ $t("Chưa có hình ảnh") }}</p>

    <GalleryModal
      v-if="dialog"
      :images="gallery"
      :start-index="currentIndex"
      accent="var(--mw-blue, #486c7d)"
      @close="closeLightbox"
    />
  </section>
</template>

<script setup>
import GalleryShowcase from "@/components/gallery/GalleryShowcase.vue";
import { galleryLayoutFor } from "@/data/galleryLayouts";
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { computed, defineAsyncComponent, ref } from "vue";
const GalleryModal = defineAsyncComponent(() =>
  import("@/components/gallery/GalleryModal.vue")
);


const props = defineProps({
  /* Kiểu album (settings.GalleryLayout) — trống / "default" = kiểu chọn sẵn của mẫu */
  layout: { type: String, default: "" },
  sections: { type: Object, default: () => ({}) },
  gallery: {
    type: Array,
    default: () => [],
  },
});

const dialog = ref(false);

const currentIndex = ref(0);




function openGallery(index = 0) {
  if (!props.gallery.length) {
    return;
  }

  currentIndex.value = Math.min(Math.max(index, 0), props.gallery.length - 1);

  dialog.value = true;
}

function closeLightbox() {
  dialog.value = false;
}
</script>

<style scoped>
.mw-gallery {
  text-align: center;
}






.mw-gallery__empty {
  margin: 24px 0 0;

  color: var(--mw-ink-soft);

  font-family: var(--mw-font-serif);
  font-size: 14px;
}

/* =========================================================
   DESKTOP
========================================================= */


/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.mw-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.mw-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.mw-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.mw-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.mw-sub-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.mw-sub-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.mw-sub-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.mw-sub-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
