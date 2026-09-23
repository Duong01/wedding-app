<template>
  <section class="cfr-gallery">

    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="cfr-title">
      {{ heading }}
    </h2>


    <!-- =====================================================
         BĂNG CHUYỀN ẢNH
    ====================================================== -->

    <div class="cfr-gallery__stage">
      <ModernGalleryCarousel
        v-if="gallery.length"
        :images="gallery"
        accent="#9c1f2c"
        text-color="#9c1f2c"
        frame-bg="#fbf8f3"
        :radius="16"
        @open="openLightbox"
      />

      <p v-else class="cfr-gallery__empty">
        Chưa có hình ảnh
      </p>
    </div>


    <!-- =====================================================
         XEM TOÀN MÀN HÌNH
    ====================================================== -->

    <GalleryModal
      v-if="dialog"
      :images="gallery"
      :start-index="currentIndex"
      @close="closeLightbox"
    />

  </section>
</template>


<script setup>
import { computed, defineAsyncComponent, ref } from "vue";

import { sectionText } from "@/data/sectionTitles";

import ModernGalleryCarousel from "@/components/gallery/ModernGalleryCarousel.vue";

const GalleryModal = defineAsyncComponent(() =>
  import("@/components/gallery/GalleryModal.vue")
);


/* =====================================================
   PROPS
===================================================== */

const props = defineProps({
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
  sectionText(props.sections, "gallery", "Heading")
);


/* =====================================================
   LIGHTBOX
===================================================== */

const dialog = ref(false);

const currentIndex = ref(0);


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
/* =====================================================
   SECTION
===================================================== */

.cfr-gallery {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 24px;

  width: 100%;
}


/* =====================================================
   BĂNG CHUYỀN
===================================================== */

.cfr-gallery__stage {
  width: 100%;
  max-width: 432px;

  margin-top: 8px;
}

.cfr-gallery__empty {
  margin: 0;

  color: var(--cfr-red-deep);

  font-size: 14px;

  text-align: center;

  opacity: 0.7;
}


/* =====================================================
   DESKTOP
===================================================== */

@media (min-width: 900px) {
  .cfr-gallery {
    gap: 32px;
  }

  .cfr-gallery__stage {
    max-width: 600px;
  }
}
</style>
