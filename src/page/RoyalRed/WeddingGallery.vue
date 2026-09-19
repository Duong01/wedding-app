<template>
  <section class="memories-section">

    <!-- HEADER -->
    <div class="memories-heading">
      <span class="memories-kicker">MEMORIES</span>

      <h2>
        Album Ảnh Cưới
      </h2>

      <div class="heading-ornament">
        <span></span>
        <b>囍</b>
        <span></span>
      </div>
    </div>


    <!-- =====================================================
         ROYAL RED COVERFLOW
    ====================================================== -->

    <ModernGalleryCarousel
      v-if="gallery.length"
      :images="gallery"
      accent="#d8aa5a"
      text-color="#f2d69a"
      frame-bg="#160406"
      :radius="2"
      @open="openLightbox"
    />


    <!-- EMPTY -->
    <div
      v-else
      class="gallery-empty"
    >
      Chưa có hình ảnh
    </div>


    <!-- LIGHTBOX -->
    <v-dialog
      v-model="dialog"
      fullscreen
      transition="dialog-fade-transition"
      content-class="gallery-dialog"
    >

      <GalleryModal
        v-if="dialog"
        :images="gallery"
        :start-index="currentIndex"
        @close="closeLightbox"
      />

    </v-dialog>

  </section>
</template>


<script setup>

import { ref, defineAsyncComponent } from "vue";

import ModernGalleryCarousel from "@/components/gallery/ModernGalleryCarousel.vue";

const GalleryModal = defineAsyncComponent(() =>
  import("@/components/gallery/GalleryModal.vue")
);


const props = defineProps({

  gallery: {
    type: Array,
    default: () => [],
  },

});


const currentIndex = ref(0);

const dialog = ref(false);


const openLightbox = (index) => {

  if (!props.gallery.length) {
    return;
  }

  currentIndex.value = index;

  dialog.value = true;

  document.body.style.overflow = "hidden";

};


const closeLightbox = () => {

  dialog.value = false;

  document.body.style.overflow = "";

};

</script>


<style scoped>

/* =====================================================
   SECTION
===================================================== */

.memories-section {

  width: 100%;

  padding: 70px 0 90px;

  overflow: hidden;

  color: #f6dfb0;

}


/* =====================================================
   HEADER
===================================================== */

.memories-heading {

  text-align: center;

  margin-bottom: 45px;

}


.memories-kicker {

  display: block;

  margin-bottom: 10px;

  font-size: 10px;

  letter-spacing: 0.38em;

  color: #c99b54;

}


.memories-heading h2 {

  margin: 0;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: clamp(
    32px,
    5vw,
    52px
  );

  font-weight: 500;

  letter-spacing: 0.05em;

  color: #f2d69a;

}


.heading-ornament {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 14px;

  margin-top: 16px;

}


.heading-ornament span {

  width: 55px;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      #c99b54
    );

}


.heading-ornament span:last-child {

  background:
    linear-gradient(
      90deg,
      #c99b54,
      transparent
    );

}


.heading-ornament b {

  color: #d5a75e;

  font-size: 17px;

  font-weight: 400;

}


/* =====================================================
   EMPTY
===================================================== */

.gallery-empty {

  text-align: center;

  padding: 80px 20px;

  color: rgba(
    240,
    210,
    160,
    0.5
  );

}

</style>
