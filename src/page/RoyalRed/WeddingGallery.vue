<template>
  <section class="rr-gallery">

    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="rr-top-custom-head">
      <p v-if="sectionOverride(sections, 'gallery', 'Eyebrow')" class="rr-top-custom-head__eyebrow">{{ sectionOverride(sections, "gallery", "Eyebrow") }}</p>
    </header>

    <h2 class="rr-title">
      {{ heading }}
    </h2>
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'gallery', 'Intro')" class="rr-sub-custom-head">
      <p v-if="sectionOverride(sections, 'gallery', 'Intro')" class="rr-sub-custom-head__intro">{{ sectionOverride(sections, "gallery", "Intro") }}</p>
    </header>



    <!-- =====================================================
         LƯỚI ẢNH
    ====================================================== -->

    <!-- Album: kiểu chọn sẵn của mẫu (Vòng xoay 3D) hoặc kiểu chủ thiệp chọn -->
    <div v-if="gallery.length" class="rr-gallery__box">
      <GalleryShowcase
        :images="gallery"
        :layout="galleryLayoutFor('royal-red', layout)"
        accent="var(--accent, #d0a85c)"
        text-color="var(--primary, #5c080c)"
        frame-bg="var(--white, #fff9ed)"
        :radius="10"
        @open="openLightbox"
      />
    </div>


    <p v-else class="rr-gallery__empty">
      Chưa có hình ảnh
    </p>


    <!-- =====================================================
         LIGHTBOX
    ====================================================== -->

    <GalleryModal
      v-if="dialog"
      :images="gallery"
      :start-index="currentIndex"
      accent="var(--rr-gold, #d0a85c)"
      @close="closeLightbox"
    />

  </section>
</template>


<script setup>
import GalleryShowcase from "@/components/gallery/GalleryShowcase.vue";
import { galleryLayoutFor } from "@/data/galleryLayouts";
import { computed, defineAsyncComponent, ref } from "vue";

import { sectionOverride, sectionText } from "@/data/sectionTitles";


const GalleryModal = defineAsyncComponent(() =>
  import("@/components/gallery/GalleryModal.vue")
);


/* =====================================================
   PROPS
===================================================== */

const props = defineProps({
  /* Kiểu album (settings.GalleryLayout) — trống / "default" = kiểu chọn sẵn của mẫu */
  layout: { type: String, default: "" },
  gallery: {
    type: Array,
    default: () => [],
  },

  sections: {
    type: Object,
    default: () => ({}),
  },
});



/* =====================================================
   TIÊU ĐỀ MỤC
===================================================== */

const heading = computed(() =>
  sectionText(props.sections, "gallery", "Heading", "Album Ảnh")
);



/* =====================================================
   LIGHTBOX
===================================================== */

const currentIndex = ref(0);

const dialog = ref(false);

const openLightbox = (index) => {
  if (!props.gallery.length) {
    return;
  }

  currentIndex.value = index;

  dialog.value = true;
};

const closeLightbox = () => {
  dialog.value = false;
};
</script>


<style scoped>
/* =====================================================
   SECTION
===================================================== */

.rr-gallery {
  position: relative;

  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 24px;

  width: 100%;

  padding: 0 24px;

  color: var(--rr-red);
}


/* =====================================================
   LƯỚI
===================================================== */

.rr-gallery__box {
  width: 100%;
  max-width: 440px;
}







/* =====================================================
   EMPTY
===================================================== */

.rr-gallery__empty {
  margin: 0;

  font-size: 14px;

  text-align: center;

  opacity: 0.7;
}


/* =====================================================
   TABLET / DESKTOP
===================================================== */

@media (min-width: 768px) {
  .rr-gallery {
    gap: 32px;

    padding: 0 40px;
  }

  .rr-gallery__box {
    max-width: 560px;
  }

}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.rr-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.rr-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.rr-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.rr-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.rr-sub-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.rr-sub-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.rr-sub-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.rr-sub-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
