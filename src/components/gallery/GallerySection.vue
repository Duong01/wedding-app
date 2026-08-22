<template>
  <section id="gallery" class="gallery-section">
    <!-- =====================================================
         DECORATIVE BACKGROUND
    ====================================================== -->

    <div class="gallery-inner">

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
           ALBUM
      ====================================================== -->

      <div class="album-grid">

        <!-- ẢNH 1 -->
        <div
          v-for="(item, index) in previewImages.slice(0, 3)"
          :key="item.id ?? index"
          class="album-item"
          @click="openGallery(index)"
        >
          <img
            :src="item.image"
            :alt="item.title || 'Ảnh cưới'"
            loading="lazy"
          />

          <div class="image-shine"></div>
        </div>


        <!-- =================================================
             XEM THÊM
        ================================================== -->

        <div
          v-if="gallery.length > 3"
          class="album-item more-item"
          @click="openGallery(3)"
        >
          <img
            :src="gallery[3]?.image"
            :alt="gallery[3]?.title || 'Xem thêm ảnh'"
            loading="lazy"
          />

          <div class="more-dark"></div>

          <div class="more-overlay">
            <span class="more-count">
              +{{ Math.max(gallery.length - 4, 0) }}
            </span>

            <span class="more-text">
              Xem tất cả
            </span>

            <span class="more-arrow">
              →
            </span>
          </div>
        </div>

      </div>

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
import {
  computed,
  ref,
} from "vue";

import GalleryModal from "./GalleryModal.vue";


/* =========================================================
   PROPS
========================================================= */

const props = defineProps({
  gallery: {
    type: Array,
    default: () => [],
  },
});


/* =========================================================
   STATE
========================================================= */

const dialog = ref(false);

const selectedIndex = ref(0);


/* =========================================================
   COMPUTED
========================================================= */

const gallery = computed(() => {
  return Array.isArray(props.gallery)
    ? props.gallery
    : [];
});


const previewImages = computed(() => {
  return gallery.value.slice(0, 4);
});


const currentIndex = computed(() => {
  return selectedIndex.value;
});


/* =========================================================
   OPEN GALLERY
========================================================= */

function openGallery(index) {
  if (!gallery.value.length) {
    return;
  }

  selectedIndex.value = index;

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

  selectedIndex.value = 0;

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
   INNER
========================================================= */

.gallery-inner {
  position: relative;

  width: 100%;

  padding: 42px 18px 45px;

  border-radius: 4px;
  box-shadow:
    0 12px 35px rgba(76, 36, 22, 0.10);

  overflow: hidden;

  isolation: isolate;
}


/* =========================================================
   TEXTURE
========================================================= */

.gallery-inner::before {
  content: "";

  position: absolute;

  inset: 0;

  z-index: -1;

  opacity: 0.018;

  pointer-events: none;
}


/* =========================================================
   DECORATIVE BORDER
========================================================= */

.gallery-inner::after {
  content: "";

  position: absolute;

  inset: 9px;

  z-index: -1;
  pointer-events: none;
}


/* =========================================================
   HEADER
========================================================= */

.album-heading {
  position: relative;

  width: 100%;

  max-width: 500px;

  margin: 0 auto 28px;

  text-align: center;
}


/* =========================================================
   KICKER
========================================================= */

.album-kicker {
  display: block;

  margin-bottom: 8px;

  font-size: 7px;

  font-weight: 600;

  letter-spacing: 3px;

  color: var(--gold, #c79d5c);

  text-transform: uppercase;
}


/* =========================================================
   TITLE
========================================================= */

.album-title {
  margin: 0;

  color: var(--primary, #7b0d0d);

  font-family:
    var(--font-heading),
    "Cormorant Garamond",
    serif;

  font-size: 26px;

  font-weight: 600;

  line-height: 1.1;
}


/* =========================================================
   ORNAMENT
========================================================= */

.album-ornament {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 9px;

  margin: 13px auto 12px;
}


.album-ornament span {
  display: block;

  width: 38px;

  height: 1px;
background:
    linear-gradient(
      135deg,
      #760b0b,
      #941919
    );
  
}




.album-ornament i {
  font-family: var(
    --font-wedding,
    serif
  );

  font-size: 13px;

  font-style: normal;

  color: var(--gold, #c79d5c);
}


/* =========================================================
   DESCRIPTION
========================================================= */

.album-description {
  max-width: 380px;

  margin: 0 auto;

  font-size: 10px;

  font-weight: 300;

  line-height: 1.8;

  color: var(
    --sub-text,
    #806f66
  );
}


/* =========================================================
   ALBUM GRID
========================================================= */

.album-grid {
  position: relative;

  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 9px;

  width: 100%;

  margin: 24px auto 0;
}


/* =========================================================
   ALBUM ITEM
========================================================= */

.album-item {
  position: relative;

  width: 100%;

  aspect-ratio: 1 / 1;

  overflow: hidden;

  border-radius: 9px;

  box-shadow:
    0 7px 20px rgba(60, 35, 20, 0.10);

  cursor: pointer;

  isolation: isolate;

  transition:
    transform 0.4s
      cubic-bezier(
        0.22,
        1,
        0.36,
        1
      ),
    box-shadow 0.4s ease;
}


/* =========================================================
   IMAGE
========================================================= */

.album-item img {
  display: block;

  width: 100%;

  height: 100%;

  object-fit: cover;

  object-position: center;

  transition:
    transform 0.7s
      cubic-bezier(
        0.22,
        1,
        0.36,
        1
      ),
    filter 0.5s ease;
}


/* =========================================================
   IMAGE SHINE
========================================================= */

.image-shine {
  position: absolute;

  inset: 0;

  z-index: 2;

  transform:
    translateX(-120%);

  transition:
    transform 0.8s ease;

  pointer-events: none;
}


/* =========================================================
   HOVER
========================================================= */

.album-item:hover {
  transform: translateY(-4px);

  box-shadow:
    0 15px 32px rgba(60, 35, 20, 0.16);
}


.album-item:hover img {
  transform: scale(1.06);

  filter: brightness(0.94);
}


.album-item:hover .image-shine {
  transform:
    translateX(120%);
}


/* =========================================================
   MORE ITEM
========================================================= */

.more-item {
  position: relative;
}


/* =========================================================
   DARK OVERLAY
========================================================= */

.more-dark {
  position: absolute;

  inset: 0;

  z-index: 1;

  pointer-events: none;
}


/* =========================================================
   MORE BUTTON
========================================================= */

.more-overlay {
  position: absolute;

  left: 50%;

  bottom: 12px;

  z-index: 4;

  display: flex;

  align-items: center;

  gap: 6px;

  transform:
    translateX(-50%);

  min-height: 34px;

  padding:
    4px
    8px
    4px
    5px;

  border-radius: 999px;

  color: #fff;
  
  backdrop-filter:
    blur(10px);

  -webkit-backdrop-filter:
    blur(10px);

  box-shadow:
    0 7px 18px
    rgba(0,0,0,0.20);

  white-space: nowrap;

  pointer-events: none;
}


/* =========================================================
   COUNT
========================================================= */

.more-count {
  display: flex;

  align-items: center;

  justify-content: center;

  min-width: 26px;

  height: 26px;

  padding: 0 6px;

  border-radius: 50%;

  
  color: #392914;

  font-size: 10px;

  font-weight: 700;

  line-height: 1;
}


/* =========================================================
   TEXT
========================================================= */

.more-text {
  font-size: 10px;

  font-weight: 500;

  letter-spacing: 0.01em;
}


/* =========================================================
   ARROW
========================================================= */

.more-arrow {
  font-size: 13px;

  color:
    rgba(255,255,255,0.82);

  transition:
    transform 0.3s ease;
}


.more-item:hover .more-arrow {
  transform:
    translateX(3px);
}


/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.gallery-bottom-ornament {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  margin-top: 30px;
}


.gallery-bottom-ornament span {
  width: 50px;

  height: 1px;

  
}

.ornament-symbol {
  display: flex;

  align-items: center;

  justify-content: center;

  width: 24px;

  height: 24px;

  border-radius: 50%;

  color:
    var(--primary, #7b0d0d);

  font-size: 12px;
}


/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {

  .gallery-section {
    width: calc(100% - 42px);
  }

  .gallery-inner {
    padding:
      50px
      30px
      50px;
  }

  .album-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));

    gap: 12px;
  }

  .album-item {
    border-radius: 12px;
  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {

  .gallery-section {
    width: calc(100% - 22px);
  }

  .gallery-inner {
    padding:
      34px
      13px
      38px;

    border-radius: 4px;
  }

  .gallery-inner::after {
    inset: 7px;
  }

  .album-heading {
    margin-bottom: 22px;
  }

  .album-kicker {
    font-size: 6px;

    letter-spacing: 2.5px;
  }

  .album-description {
    font-size: 9px;

    max-width: 300px;
  }

  .album-grid {
    gap: 8px;

    margin-top: 20px;
  }

  .album-item {
    border-radius: 8px;
  }

  .more-overlay {
    bottom: 8px;

    gap: 5px;

    min-height: 31px;

    padding:
      3px
      7px
      3px
      4px;
  }

  .more-count {
    min-width: 24px;

    height: 24px;

    font-size: 9px;
  }

  .more-text {
    font-size: 9px;
  }

  .more-arrow {
    display: none;
  }

  .gallery-bottom-ornament {
    margin-top: 24px;
  }

  .gallery-bottom-ornament span {
    width: 35px;
  }

}


/* =========================================================
   VERY SMALL MOBILE
========================================================= */

@media (max-width: 360px) {

  .gallery-section {
    width: calc(100% - 18px);
  }

  .gallery-inner {
    padding:
      30px
      10px
      34px;
  }


  .album-grid {
    gap: 7px;
  }

  .album-item {
    border-radius: 7px;
  }

  .more-text {
    display: none;
  }

}


/* =========================================================
   GALLERY DIALOG
========================================================= */

:global(.gallery-dialog) {
  margin: 0 !important;

  width: 100vw !important;

  max-width: 100vw !important;

  height: 100dvh !important;

  max-height: 100dvh !important;

  overflow: hidden;

}


:global(.gallery-dialog .v-card),
:global(.gallery-dialog .v-sheet) {
  width: 100%;

  height: 100%;

  border-radius: 0 !important;
}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {

  .album-item,
  .album-item img,
  .image-shine,
  .more-arrow {
    transition: none;
  }

}
</style>