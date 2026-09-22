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
         GALLERY — carousel coverflow đồng bộ
         với 18 mẫu thiệp còn lại
    ========================================== -->

    <ModernGalleryCarousel
      v-if="gallery.length"
      :images="gallery"
      accent="#b58a45"
      text-color="#8b1418"
      @open="openLightbox"
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


/*
 * Vị trí ảnh hiện tại trong GalleryModal.
 */
const currentIndex = ref(0);


/* =====================================================
   OPEN GALLERY
===================================================== */

function openLightbox(index = 0) {

  /*
   * Nếu gallery không có ảnh thì không mở dialog.
   */
  if (!props.gallery.length) {
    return;
  }


  /*
   * Đảm bảo index luôn nằm trong phạm vi
   * của gallery từ API.
   */
  const safeIndex = Math.min(
    Math.max(index, 0),
    props.gallery.length - 1,
  );


  currentIndex.value = safeIndex;

  dialog.value = true;

  document.body.style.overflow = "hidden";
}


/* =====================================================
   CLOSE GALLERY
===================================================== */

function closeLightbox() {
  dialog.value = false;

  document.body.style.overflow = "";
}
</script>


<style scoped>

/* =====================================================
   ROOT
===================================================== */

.gallery-section {
  width: 100%;

  color: #4a3f38;
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

  color: #a17b43;

  font-size: 11px;
  font-weight: 800;

  letter-spacing: 2.5px;
}


.gallery-heading h2 {
  margin: 0;

  color: #8b1418;

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
      #b58a45
    );
}


.heading-decoration span:last-child {
  background:
    linear-gradient(
      to left,
      transparent,
      #b58a45
    );
}


.heading-decoration b {
  color: #a17b43;

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

  color: #a17b43;

  font-size: 12px;

  text-align: center;

  border:
    1px solid
    rgba(181, 138, 69, .25);
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
