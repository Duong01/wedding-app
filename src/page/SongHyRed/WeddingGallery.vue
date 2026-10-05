<template>
  <section class="shy-gallery">
    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="shy-top-custom-head">
      <p v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="shy-top-custom-head__eyebrow">{{ sectionOverride(sections, "gallery", "Eyebrow") }}</p>
    </header>

    <h2 class="shy-bar">{{ sectionText(sections, "gallery", "Heading", $t("Album Ảnh")) }}</h2>
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'gallery', 'Intro')" class="shy-sub-custom-head">
      <p v-if="sectionOverride(sections, 'gallery', 'Intro')" class="shy-sub-custom-head__intro">{{ sectionOverride(sections, "gallery", "Intro") }}</p>
    </header>


    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="shy-gallery__inner">
      <GalleryShowcase
        v-if="gallery.length"
        :images="gallery"
        :layout="galleryLayoutFor('song-hy-red', layout)"
        accent="#800000"
        text-color="#666666"
        frame-bg="#ffffff"
        :radius="16"
        @open="openLightbox"
      />

      <div v-else class="shy-gallery__empty">
        <v-icon size="30">mdi-image-outline</v-icon>
        <p>{{ $t("Chưa có hình ảnh") }}</p>
      </div>
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
import { defineAsyncComponent, ref } from "vue";

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
.shy-gallery {
  --shy-bg: var(--background, #fff7eb);
  --shy-ink: var(--text, #666666);
  --shy-red: var(--primary, #800000);
  --shy-cream: var(--accent-light, #ffeed2);

  position: relative;

  overflow: hidden;

  color: var(--shy-ink);

  background-color: var(--shy-bg);
}

/* =========================================================
   THANH TIÊU ĐỀ ĐỎ
========================================================= */

.shy-bar {
  margin: 0;

  padding: 12px 16px;

  color: var(--shy-cream);

  background: var(--shy-red);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-align: center;
  text-transform: uppercase;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.shy-gallery__inner {
  width: min(100%, 441px);

  margin: 0 auto;

  padding: 16px 8px 32px;
}

.shy-gallery__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  padding: 40px 0;

  color: color-mix(in srgb, var(--shy-ink) 60%, transparent);
}

.shy-gallery__empty p {
  margin: 0;

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 13px;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shy-bar {
    padding: 16px;

    font-size: 24px;
  }

  .shy-gallery__inner {
    width: min(100%, 600px);

    padding: 20px 5px 40px;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.shy-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.shy-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.shy-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.shy-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.shy-sub-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.shy-sub-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.shy-sub-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.shy-sub-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
