<template>
  <section class="gallery-section">

    <!-- =========================================
         HEADER
    ========================================== -->

    <div class="gallery-heading">

      <span class="heading-kicker">
        {{ sectionText(sections, "gallery", "Eyebrow", $t("NHỮNG KHOẢNH KHẮC")) }}
      </span>

      <h2>
        {{ sectionText(sections, "gallery", "Heading", $t("KHOẢNH KHẮC CỦA CHÚNG MÌNH")) }}
      </h2>
      <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
      <header v-if="sectionOverride(sections, 'gallery', 'Intro')" class="ig-sub-custom-head">
        <p v-if="sectionOverride(sections, 'gallery', 'Intro')" class="ig-sub-custom-head__intro">{{ sectionOverride(sections, "gallery", "Intro") }}</p>
      </header>


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

    <GalleryShowcase
      v-if="gallery.length"
      :images="gallery"
      :layout="galleryLayoutFor('ivory-gold', layout)"
      accent="var(--tc-b58a45, #b58a45)"
      text-color="var(--tc-8b1418, #8b1418)"
      @open="openLightbox"
    />


    <!-- =========================================
         EMPTY
    ========================================== -->

    <div
      v-else
      class="gallery-empty"
    >
      {{ $t("Chưa có hình ảnh") }}
    </div>


    <!-- =========================================
         FULLSCREEN GALLERY DIALOG
    ========================================== -->


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


/* =====================================================
   PROPS
===================================================== */

const props = defineProps({
  /* Kiểu album (settings.GalleryLayout) — trống / "default" = kiểu chọn sẵn của mẫu (data/galleryLayouts.js) */
  layout: { type: String, default: "" },
  sections: { type: Object, default: () => ({}) },
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

  color: var(--tc-4a3f38, #4a3f38);
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

  color: var(--tc-896939, #896939);

  font-size: 11px;
  font-weight: 800;

  letter-spacing: 2.5px;
}


.gallery-heading h2 {
  margin: 0;

  color: var(--tc-8b1418, #8b1418);

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
      var(--tc-b58a45, #b58a45)
    );
}


.heading-decoration span:last-child {
  background:
    linear-gradient(
      to left,
      transparent,
      var(--tc-b58a45, #b58a45)
    );
}


.heading-decoration b {
  color: var(--tc-896939, #896939);

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

  color: var(--tc-896939, #896939);

  font-size: 12px;

  text-align: center;

  border:
    1px solid
    rgba(var(--tc-b58a45-rgb, 181, 138, 69), .25);
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


/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.ig-sub-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.ig-sub-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ig-sub-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.ig-sub-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
