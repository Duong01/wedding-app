<template>
  <section class="gallery-section">
    <!-- =====================================================
         HEADER
    ====================================================== -->
    <header class="album-heading">
      <h2 class="album-title">
        KHOẢNH KHẮC CỦA CHÚNG MÌNH
      </h2>

      <div class="album-ornament">
        <span></span>
        <i>✦</i>
        <span></span>
      </div>

      <p class="album-description">
        Lưu giữ những khoảnh khắc đẹp nhất trong hành trình
        yêu thương của chúng mình.
      </p>
    </header>


    <!-- =====================================================
         ALBUM - CAROUSEL VÒNG
    ====================================================== -->

    <ModernGalleryCarousel
      v-if="gallery.length"
      :images="gallery"
      :accent="accent"
      :text-color="textColor"
      :radius="4"
      @open="openGallery"
    />


    <!-- =====================================================
         EMPTY
    ====================================================== -->

    <div v-else class="album-empty">
      Chưa có hình ảnh
    </div>


    <!-- =====================================================
         FULLSCREEN GALLERY
    ====================================================== -->

    <v-dialog
      v-model="dialog"
      fullscreen
      persistent
      transition="dialog-fade-transition"
      content-class="gallery-dialog"
    >
      <GalleryModal
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
  import("./GalleryModal.vue")
);


/* =========================================================
   PROPS
========================================================= */

const props = defineProps({
  gallery: {
    type: Array,
    default: () => [],
  },

  /* Màu nhấn của carousel — mỗi theme truyền vào để giữ bản sắc riêng */
  accent: {
    type: String,
    default: "#c9a06a",
  },

  /* Màu chữ tiêu đề carousel */
  textColor: {
    type: String,
    default: "#4c2416",
  },
});


/* =========================================================
   STATE
========================================================= */

const dialog = ref(false);

const currentIndex = ref(0);


/* =========================================================
   OPEN GALLERY
========================================================= */

function openGallery(index) {
  if (!props.gallery.length) {
    return;
  }

  currentIndex.value = index;

  dialog.value = true;

  /*
   * Khóa scroll trang phía sau.
   * GalleryModal vẫn có thể thao tác riêng.
   */
  document.body.style.overflow = "hidden";
}


/* =========================================================
   CLOSE GALLERY
========================================================= */

function closeLightbox() {
  dialog.value = false;

  currentIndex.value = 0;

  document.body.style.overflow = "";
}
</script>


<style scoped>

/* =========================================================
   GALLERY SECTION
   Khối được thụt vào trong thiệp
========================================================= */

.gallery-section {
  position: relative;

  width: calc(100% - 28px);

  margin: 0 auto;

  padding: 0;

  color: var(--text);

  overflow: hidden;
}


/* =========================================================
   HEADER
========================================================= */

.album-heading {
  text-align: center;

  margin-bottom: 26px;
}


.album-title {
  margin: 0;

  font-family: var(--font-heading, "Cormorant Garamond", serif);

  font-size: 22px;
  font-weight: 700;

  letter-spacing: 2px;

  color: var(--title, var(--p-primary, #4c2416));
}


.album-ornament {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 10px;

  margin-top: 10px;

  color: var(--accent, var(--p-gold, #c9a06a));
}


.album-ornament span {
  width: 44px;
  height: 1px;

  background: currentColor;

  opacity: 0.6;
}


.album-ornament i {
  font-size: 13px;
  font-style: normal;
}


.album-description {
  max-width: 420px;

  margin: 12px auto 0;

  font-size: 12px;
  line-height: 1.7;

  color: var(--text, #6b5147);

  opacity: 0.85;
}


/* =========================================================
   EMPTY
========================================================= */

.album-empty {
  padding: 45px 20px;

  text-align: center;

  font-size: 12px;

  color: var(--text, #6b5147);

  opacity: 0.7;

  border: 1px dashed currentColor;
}


/* =========================================================
   DIALOG
========================================================= */

:deep(.gallery-dialog) {
  margin: 0;

  max-width: 100%;

  border-radius: 0;

  overflow: hidden;
}

</style>
