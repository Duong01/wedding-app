<template>
  <section class="tr-gallery">
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="tr-top-custom-head">
      <p v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="tr-top-custom-head__eyebrow">{{ sectionOverride(sections, "gallery", "Eyebrow") }}</p>
    </header>

    <h2 class="tr-gallery__title">{{ sectionText(sections, "gallery", "Heading", "Album Ảnh") }}</h2>
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'gallery', 'Intro')" class="tr-sub-custom-head">
      <p v-if="sectionOverride(sections, 'gallery', 'Intro')" class="tr-sub-custom-head__intro">{{ sectionOverride(sections, "gallery", "Intro") }}</p>
    </header>


    <!-- Album: kiểu chọn sẵn của mẫu (Thẻ xếp chồng) hoặc kiểu chủ thiệp chọn -->
    <div v-if="images.length" class="tr-gallery__wrap">
      <GalleryShowcase
        :images="images"
        :layout="galleryLayoutFor('traditional-red', layout)"
        accent="#680e0e"
        text-color="#680e0e"
        frame-bg="#fffaf4"
        :radius="6"
        @open="openLightbox"
      />
    </div>

    <GalleryModal
      v-if="dialog"
      :images="images"
      :start-index="currentIndex"
      accent="#680e0e"
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

/* =========================================================
   CHUẨN HÓA ẢNH
========================================================= */

const images = computed(() =>
  (props.gallery || [])
    .map((item) => item?.Url || item?.Image || item?.Src || item?.ImageUrl || "")
    .filter(Boolean)
);

/* =========================================================
   LIGHTBOX
========================================================= */

const dialog = ref(false);
const currentIndex = ref(0);

function openLightbox(index) {
  if (!images.value.length) return;

  currentIndex.value = index;
  dialog.value = true;
}

function closeLightbox() {
  dialog.value = false;
}
</script>

<style scoped>
/* =========================================================
   SECTION
========================================================= */

.tr-gallery {
  position: relative;

  z-index: 10;

  display: flex;

  flex-direction: column;

  align-items: center;

  margin-bottom: 48px;
}

.tr-gallery__title {
  margin: 0 0 24px;

  text-align: center;

  text-transform: uppercase;

  color: #680e0e;

  font-family: "Times New Roman", Times, serif;

  font-size: 20px;

  font-weight: 700;

  letter-spacing: 0.05em;
}

/* =========================================================
   LƯỚI ẢNH
========================================================= */

.tr-gallery__wrap {
  width: 100%;
  max-width: 440px;

  padding: 0 4px;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tr-gallery {
    margin-bottom: 64px;
  }

  .tr-gallery__title {
    font-size: 24px;
  }

  .tr-gallery__wrap {
    max-width: 560px;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.tr-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.tr-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.tr-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.tr-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.tr-sub-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.tr-sub-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.tr-sub-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.tr-sub-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
