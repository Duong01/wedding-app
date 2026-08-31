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

    <div
      v-if="gallery.length"
      class="royal-gallery"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >

      <!-- PREV -->
      <button
        class="gallery-arrow gallery-prev"
        type="button"
        @click="prev"
      >
        ‹
      </button>


      <!-- TRACK -->
      <div class="gallery-stage">

        <div
          v-for="(item, index) in gallery"
          :key="index"
          class="gallery-slide"
          :class="slideClass(index)"
          @click="handleSlideClick(index)"
        >

          <div class="image-wrap">

            <img
              :src="src(item)"
              alt="Ảnh cưới"
              draggable="false"
            />

            <!-- subtle shine -->
            <div class="image-shine"></div>

          </div>

        </div>

      </div>


      <!-- NEXT -->
      <button
        class="gallery-arrow gallery-next"
        type="button"
        @click="next"
      >
        ›
      </button>


      <!-- COUNTER -->
      <div class="gallery-counter">
        <span>
          {{ currentIndex + 1 }}
        </span>

        <i>/</i>

        <span>
          {{ gallery.length }}
        </span>
      </div>


      <!-- DOTS -->
      <div class="gallery-dots">

        <button
          v-for="(_, index) in gallery"
          :key="index"
          type="button"
          :class="{ active: index === currentIndex }"
          @click="goTo(index)"
        />

      </div>

    </div>


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

import {
  ref,
  onMounted,
  onUnmounted,
} from "vue";

import GalleryModal
  from "@/components/gallery/GalleryModal.vue";


const props = defineProps({

  gallery: {
    type: Array,
    default: () => [],
  },

});


/* =====================================================
   IMAGE SOURCE
===================================================== */

const src = (item) => {

  if (typeof item === "string") {
    return item;
  }

  return (
    item?.Url ||
    item?.Image ||
    item?.Src ||
    item?.ImageUrl ||
    ""
  );

};


/* =====================================================
   STATE
===================================================== */

const currentIndex = ref(0);

const dialog = ref(false);


/* =====================================================
   NAVIGATION
===================================================== */

const goTo = (index) => {

  if (!props.gallery.length) {
    return;
  }

  currentIndex.value =
    (index + props.gallery.length) %
    props.gallery.length;

};


const next = () => {

  goTo(currentIndex.value + 1);

};


const prev = () => {

  goTo(currentIndex.value - 1);

};


/* =====================================================
   SLIDE POSITION
===================================================== */

const slideClass = (index) => {

  const total = props.gallery.length;

  if (!total) {
    return "";
  }

  let diff =
    index - currentIndex.value;


  /*
   * Đưa diff về khoảng
   * [-total/2, total/2]
   */

  if (diff > total / 2) {
    diff -= total;
  }

  if (diff < -total / 2) {
    diff += total;
  }


  if (diff === 0) {
    return "is-active";
  }

  if (diff === -1) {
    return "is-prev";
  }

  if (diff === 1) {
    return "is-next";
  }

  if (diff === -2) {
    return "is-prev-2";
  }

  if (diff === 2) {
    return "is-next-2";
  }

  return "is-hidden";

};


/* =====================================================
   CLICK
===================================================== */

const handleSlideClick = (index) => {

  if (index === currentIndex.value) {

    openLightbox();

    return;

  }

  goTo(index);

};


/* =====================================================
   LIGHTBOX
===================================================== */

const openLightbox = () => {

  dialog.value = true;

  document.body.style.overflow = "hidden";

};


const closeLightbox = () => {

  dialog.value = false;

  document.body.style.overflow = "";

};


/* =====================================================
   KEYBOARD
===================================================== */

const handleKeydown = (event) => {

  if (event.key === "ArrowLeft") {
    prev();
  }

  if (event.key === "ArrowRight") {
    next();
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

};


/* =====================================================
   SWIPE
===================================================== */

const touchStartX = ref(0);

const onTouchStart = (event) => {

  touchStartX.value =
    event.changedTouches[0].clientX;

};


const onTouchEnd = (event) => {

  const endX =
    event.changedTouches[0].clientX;

  const distance =
    endX - touchStartX.value;


  if (Math.abs(distance) < 45) {
    return;
  }


  if (distance < 0) {
    next();
  } else {
    prev();
  }

};


/* =====================================================
   LIFECYCLE
===================================================== */

onMounted(() => {

  window.addEventListener(
    "keydown",
    handleKeydown
  );

});


onUnmounted(() => {

  window.removeEventListener(
    "keydown",
    handleKeydown
  );

  document.body.style.overflow = "";

});

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
   GALLERY
===================================================== */

.royal-gallery {

  position: relative;

  width: 100%;

  max-width: 1250px;

  margin: auto;

  user-select: none;

  touch-action: pan-y;

}


.gallery-stage {

  position: relative;

  width: 100%;

  height: clamp(
    390px,
    52vw,
    650px
  );

  display: flex;

  align-items: center;

  justify-content: center;

}


/* =====================================================
   SLIDE
===================================================== */

.gallery-slide {

  position: absolute;

  width: min(
    54vw,
    620px
  );

  aspect-ratio: 4 / 5;

  cursor: pointer;

  transition:

    transform
      850ms
      cubic-bezier(
        0.22,
        1,
        0.36,
        1
      ),

    opacity
      700ms
      ease,

    filter
      700ms
      ease,

    box-shadow
      700ms
      ease;

  will-change:
    transform,
    opacity;

}


/* =====================================================
   IMAGE
===================================================== */

.image-wrap {

  position: relative;

  width: 100%;

  height: 100%;

  overflow: hidden;

  background: #160406;

}


.image-wrap img {

  width: 100%;

  height: 100%;

  display: block;

  object-fit: cover;

  transition:
    transform
    1.2s
    cubic-bezier(
      0.22,
      1,
      0.36,
      1
    );

}


.gallery-slide:hover
.image-wrap img {

  transform: scale(1.035);

}


/* =====================================================
   ACTIVE
===================================================== */

.gallery-slide.is-active {

  z-index: 10;

  transform:
    translateX(0)
    scale(1);

  opacity: 1;

  filter:
    brightness(1)
    saturate(1.05);

  box-shadow:
    0 25px 70px
    rgba(
      0,
      0,
      0,
      0.45
    );

}


/* =====================================================
   PREVIOUS
===================================================== */

.gallery-slide.is-prev {

  z-index: 8;

  transform:
    translateX(-68%)
    scale(0.82);

  opacity: 0.68;

  filter:
    brightness(0.68)
    saturate(0.8);

}


/* =====================================================
   NEXT
===================================================== */

.gallery-slide.is-next {

  z-index: 8;

  transform:
    translateX(68%)
    scale(0.82);

  opacity: 0.68;

  filter:
    brightness(0.68)
    saturate(0.8);

}


/* =====================================================
   SECONDARY
===================================================== */

.gallery-slide.is-prev-2 {

  z-index: 5;

  transform:
    translateX(-115%)
    scale(0.67);

  opacity: 0.28;

  filter:
    brightness(0.5);

}


.gallery-slide.is-next-2 {

  z-index: 5;

  transform:
    translateX(115%)
    scale(0.67);

  opacity: 0.28;

  filter:
    brightness(0.5);

}


/* =====================================================
   HIDDEN
===================================================== */

.gallery-slide.is-hidden {

  z-index: 0;

  transform:
    translateX(0)
    scale(0.5);

  opacity: 0;

  pointer-events: none;

}


/* =====================================================
   SHINE
===================================================== */

.image-shine {

  position: absolute;

  inset: 0;

  pointer-events: none;

  background:
    linear-gradient(
      115deg,
      transparent 25%,
      rgba(
        255,
        255,
        255,
        0.10
      ) 45%,
      transparent 65%
    );

  transform:
    translateX(-120%);

  transition:
    transform
    1.1s
    ease;

}


.gallery-slide.is-active:hover
.image-shine {

  transform:
    translateX(120%);

}


/* =====================================================
   ARROWS
===================================================== */

.gallery-arrow {

  position: absolute;

  top: 50%;

  z-index: 30;

  width: 48px;

  height: 48px;

  transform:
    translateY(-50%);

  border: 0;

  background: transparent;

  color: #d8aa5a;

  font-family: Georgia, serif;

  font-size: 46px;

  line-height: 1;

  cursor: pointer;

  transition:
    color
    250ms
    ease,
    transform
    350ms
    ease;

}


.gallery-arrow:hover {

  color: #f2d69a;

}


.gallery-prev {

  left: 25px;

}


.gallery-prev:hover {

  transform:
    translate(-5px, -50%);

}


.gallery-next {

  right: 25px;

}


.gallery-next:hover {

  transform:
    translate(5px, -50%);

}


/* =====================================================
   COUNTER
===================================================== */

.gallery-counter {

  position: absolute;

  left: 50%;

  bottom: 25px;

  transform:
    translateX(-50%);

  display: flex;

  align-items: center;

  gap: 9px;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 15px;

  letter-spacing: 0.15em;

  color: #d8aa5a;

}


.gallery-counter i {

  font-style: normal;

  opacity: 0.35;

}


/* =====================================================
   DOTS
===================================================== */

.gallery-dots {

  display: flex;

  justify-content: center;

  align-items: center;

  gap: 8px;

  margin-top: 20px;

}


.gallery-dots button {

  width: 5px;

  height: 5px;

  padding: 0;

  border: 0;

  border-radius: 50%;

  background: #76552f;

  cursor: pointer;

  transition:
    width
    400ms
    ease,
    background
    400ms
    ease,
    transform
    400ms
    ease;

}


.gallery-dots button.active {

  width: 24px;

  border-radius: 10px;

  background: #d8aa5a;

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


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 700px) {

  .memories-section {

    padding:
      50px
      0
      65px;

  }


  .memories-heading {

    margin-bottom: 25px;

  }


  .gallery-stage {

    height: 440px;

  }


  .gallery-slide {

    width: 64vw;

    max-width: 390px;

  }


  /*
   * Quan trọng:
   * Mobile để ảnh bên cạnh
   * gần hơn để nhìn thấy rõ.
   */

  .gallery-slide.is-prev {

    transform:
      translateX(-67%)
      scale(0.76);

    opacity: 0.55;

  }


  .gallery-slide.is-next {

    transform:
      translateX(67%)
      scale(0.76);

    opacity: 0.55;

  }


  .gallery-slide.is-prev-2 {

    transform:
      translateX(-105%)
      scale(0.62);

    opacity: 0.15;

  }


  .gallery-slide.is-next-2 {

    transform:
      translateX(105%)
      scale(0.62);

    opacity: 0.15;

  }


  .gallery-arrow {

    width: 35px;

    height: 35px;

    font-size: 36px;

  }


  .gallery-prev {

    left: 3px;

  }


  .gallery-next {

    right: 3px;

  }


  .gallery-counter {

    bottom: 12px;

  }

}


/* =====================================================
   SMALL MOBILE
===================================================== */

@media (max-width: 430px) {

  .gallery-stage {

    height: 390px;

  }


  .gallery-slide {

    width: 67vw;

  }


  .gallery-slide.is-prev {

    transform:
      translateX(-64%)
      scale(0.72);

  }


  .gallery-slide.is-next {

    transform:
      translateX(64%)
      scale(0.72);

  }


  .gallery-slide.is-prev-2,
  .gallery-slide.is-next-2 {

    opacity: 0;

  }

}

</style>
