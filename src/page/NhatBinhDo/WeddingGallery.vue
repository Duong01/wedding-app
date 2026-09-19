<template>
  <section class="gallery-section">

    <!-- =========================================
         HEADER
    ========================================== -->

    <div class="gallery-heading">

      <span class="heading-kicker">
        NHỮNG KHOẢNH KHẮC
      </span>

      <h2>
        KHOẢNH KHẮC CỦA CHÚNG MÌNH
      </h2>

      <div class="heading-decoration">
        <span></span>

        <b>囍</b>

        <span></span>
      </div>

    </div>


    <!-- =========================================
         GALLERY - CAROUSEL VÒNG
    ========================================== -->

    <ModernGalleryCarousel
      v-if="gallery.length"
      :images="gallery"
      accent="#93a58c"
      text-color="#3f4a3e"
      :radius="2"
      @open="openGallery"
    />


    <!-- =========================================
         EMPTY
    ========================================== -->

    <div
      v-else
      class="gallery-empty"
    >
      Chưa có hình ảnh
    </div>


    <!-- =========================================
         FULLSCREEN GALLERY DIALOG
    ========================================== -->

    <v-dialog
      v-model="dialog"
      fullscreen
      persistent
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


/* =====================================================
   PROPS
===================================================== */

const props = defineProps({
  gallery: {
    type: Array,
    default: () => [],
  },
});


/* =====================================================
   DIALOG
===================================================== */

const dialog = ref(false);

const currentIndex = ref(0);


/* =====================================================
   OPEN GALLERY
===================================================== */

function openGallery(index = 0) {

  if (!props.gallery.length) {
    return;
  }


  const safeIndex = Math.min(
    Math.max(index, 0),
    props.gallery.length - 1,
  );


  currentIndex.value = safeIndex;

  dialog.value = true;
}


/* =====================================================
   CLOSE GALLERY
===================================================== */

function closeLightbox() {
  dialog.value = false;
}
</script>


<style scoped>

/* =====================================================
   ROOT
===================================================== */

.gallery-section {
  width: 100%;

  color: #3f4a3e;
}


/* =====================================================
   HEADER
===================================================== */

.gallery-heading {
  text-align: center;

  margin-bottom: 28px;
}


.heading-kicker {
  display: block;

  margin-bottom: 6px;

  color: #8b948a;

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 2.5px;
}


.gallery-heading h2 {
  margin: 0;

  color: #3f4a3e;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 24px;
  font-weight: 700;

  line-height: 1.2;

  letter-spacing: .8px;
}


.heading-decoration {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 9px;

  margin-top: 10px;
}


.heading-decoration span {
  width: 38px;
  height: 1px;

  background:
    linear-gradient(
      to right,
      transparent,
      #93a58c
    );
}


.heading-decoration span:last-child {
  background:
    linear-gradient(
      to left,
      transparent,
      #93a58c
    );
}


.heading-decoration b {
  color: #6b7f6a;

  font-family:
    "Times New Roman",
    serif;

  font-size: 18px;

  line-height: 1;
}


/* =====================================================
   EMPTY
===================================================== */

.gallery-empty {
  padding: 35px 20px;

  color: #8b948a;

  font-size: 12px;

  text-align: center;

  border:
    1px solid
    rgba(107,127,106,.2);
}


/* =====================================================
   DIALOG
===================================================== */

:deep(.gallery-dialog) {
  margin: 0;

  max-width: 100%;

  border-radius: 0;

  overflow: hidden;
}

</style>
