<template>
  <div
    class="gallery-viewer"
    @keydown.esc="closeGallery"
  >

    <!-- ================================
         BACKGROUND
         ================================ -->
    <div class="gallery-bg"></div>

    <!-- ================================
         HEADER
         ================================ -->
    <div class="gallery-header">

      <div class="gallery-title">
        <span>Album ảnh</span>
      </div>

      <div class="gallery-counter">
        <strong>{{ formatNumber(currentIndex + 1) }}</strong>
        <span>/</span>
        <span>{{ formatNumber(images.length) }}</span>
      </div>

      <button
        type="button"
        class="close-button"
        aria-label="Đóng album"
        @click="closeGallery"
      >
        <span></span>
        <span></span>
      </button>

    </div>

    <!-- ================================
         MAIN IMAGE AREA
         ================================ -->
    <div class="gallery-main">

      <!-- PREVIOUS -->
      <button
        v-if="images.length > 1"
        type="button"
        class="gallery-arrow gallery-arrow-left"
        @click="prevImage"
        aria-label="Ảnh trước"
      >
        <span></span>
      </button>


      <!-- MAIN SWIPER -->
      <Swiper
        class="main-swiper"
        :modules="modules"
        :initial-slide="safeStartIndex"
        :speed="500"
        :slides-per-view="1"
        :space-between="0"
        :keyboard="{
          enabled: true
        }"
        :touch-ratio="1"
        :resistance-ratio="0.65"
        @swiper="onMainSwiper"
        @slide-change="onSlideChange"
      >

        <SwiperSlide
          v-for="(item, index) in images"
          :key="item.id || index"
          class="main-slide"
        >

          <div class="main-photo">

            <img
              :src="item.image"
              :alt="item.title || `Ảnh cưới ${index + 1}`"
              draggable="false"
              decoding="async"
              :class="{ loaded: loadedImages[index] }"
              @load="loadedImages[index] = true"
            />

          </div>

        </SwiperSlide>

      </Swiper>


      <!-- NEXT -->
      <button
        v-if="images.length > 1"
        type="button"
        class="gallery-arrow gallery-arrow-right"
        @click="nextImage"
        aria-label="Ảnh tiếp theo"
      >
        <span></span>
      </button>

    </div>


    <!-- ================================
         CAPTION
         ================================ -->
    <div
      v-if="images[currentIndex]?.title"
      class="gallery-caption"
    >
      {{ images[currentIndex].title }}
    </div>


    <!-- ================================
         THUMBNAILS
         ================================ -->
    <div
      v-if="images.length > 1"
      class="thumbnail-area"
    >

      <Swiper
        class="thumbnail-swiper"
        :modules="modules"
        :slides-per-view="4"
        :space-between="8"
        :free-mode="true"
        :watch-slides-progress="true"
        :breakpoints="{
          0: {
            slidesPerView: 4,
            spaceBetween: 6
          },

          360: {
            slidesPerView: 5,
            spaceBetween: 7
          },

          480: {
            slidesPerView: 6,
            spaceBetween: 8
          },

          768: {
            slidesPerView: 8,
            spaceBetween: 9
          },

          1024: {
            slidesPerView: 10,
            spaceBetween: 10
          }
        }"
        @swiper="onThumbnailSwiper"
      >

        <SwiperSlide
          v-for="(item, index) in images"
          :key="'thumbnail-' + (item.id || index)"
          class="thumbnail-slide"
          :class="{
            active: currentIndex === index
          }"
          @click="selectImage(index)"
        >

          <div class="thumbnail-image">

            <img
              :src="item.image"
              :alt="`Ảnh ${index + 1}`"
              loading="lazy"
              decoding="async"
              draggable="false"
            />

            <div class="thumbnail-overlay">
              {{ formatNumber(index + 1) }}
            </div>

          </div>

        </SwiperSlide>

      </Swiper>

    </div>

  </div>
</template>


<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";

import {
  Swiper,
  SwiperSlide,
} from "swiper/vue";

import {
  Keyboard,
  FreeMode,
} from "swiper/modules";

import "swiper/css";


// ========================================
// PROPS
// ========================================

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },

  startIndex: {
    type: Number,
    default: 0,
  },
});


// ========================================
// EMIT
// ========================================

const emit = defineEmits([
  "close",
]);


// ========================================
// SWIPER
// ========================================

const mainSwiper = ref(null);
const thumbnailSwiper = ref(null);

const currentIndex = ref(0);

const loadedImages = ref({});


const modules = [
  Keyboard,
  FreeMode,
];


// ========================================
// INDEX AN TOÀN
// ========================================

const safeStartIndex = computed(() => {

  if (!props.images.length) {
    return 0;
  }

  return Math.min(
    Math.max(props.startIndex, 0),
    props.images.length - 1
  );

});


// ========================================
// FORMAT
// ========================================

function formatNumber(number) {
  return String(number).padStart(2, "0");
}


// ========================================
// MAIN SWIPER
// ========================================

function onMainSwiper(swiper) {

  mainSwiper.value = swiper;

  currentIndex.value = swiper.activeIndex;

  nextTick(() => {
    syncThumbnail();
  });

}


// ========================================
// SLIDE CHANGE
// ========================================

function onSlideChange(swiper) {

  currentIndex.value = swiper.activeIndex;

  syncThumbnail();

}


// ========================================
// THUMBNAIL SWIPER
// ========================================

function onThumbnailSwiper(swiper) {

  thumbnailSwiper.value = swiper;

}


// ========================================
// CHỌN ẢNH TỪ THUMBNAIL
// ========================================

function selectImage(index) {

  if (!mainSwiper.value) {
    return;
  }

  mainSwiper.value.slideTo(index);

  currentIndex.value = index;

  syncThumbnail();

}


// ========================================
// ĐỒNG BỘ THUMBNAIL
// ========================================

function syncThumbnail() {

  if (!thumbnailSwiper.value) {
    return;
  }

  const swiper = thumbnailSwiper.value;

  const index = currentIndex.value;

  /*
   * Đưa thumbnail đang chọn vào giữa
   * khi có thể.
   */
  if (typeof swiper.slideTo === "function") {

    swiper.slideTo(
      Math.max(index - 2, 0),
      350
    );

  }

}


// ========================================
// PREVIOUS
// ========================================

function prevImage() {

  if (!mainSwiper.value) {
    return;
  }

  mainSwiper.value.slidePrev();

}


// ========================================
// NEXT
// ========================================

function nextImage() {

  if (!mainSwiper.value) {
    return;
  }

  mainSwiper.value.slideNext();

}


// ========================================
// CLOSE
// ========================================

function closeGallery() {

  emit("close");

}


// ========================================
// KHÓA SCROLL TRANG
// ========================================

let oldOverflow = "";
let oldTouchAction = "";

onMounted(() => {

  oldOverflow = document.body.style.overflow;
  oldTouchAction = document.body.style.touchAction;

  document.body.style.overflow = "hidden";
  document.body.style.touchAction = "none";

});


onBeforeUnmount(() => {

  document.body.style.overflow = oldOverflow;
  document.body.style.touchAction = oldTouchAction;

});
</script>


<style scoped>

/* ======================================================
   ROOT
   ====================================================== */

.gallery-viewer {
  position: fixed;

  inset: 0;

  z-index: 99999;

  width: 100%;
  height: 100dvh;

  min-height: 100svh;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  background: #110d0c;

  color: #fff;

  overscroll-behavior: none;

  isolation: isolate;
}


/* ======================================================
   BACKGROUND
   ====================================================== */

.gallery-bg {
  position: absolute;

  inset: 0;

  z-index: -1;

  background:
    radial-gradient(
      ellipse at center,
      #241816 0%,
      #150f0e 50%,
      #0e0b0a 100%
    );
}


/* ======================================================
   HEADER
   ====================================================== */

.gallery-header {
  position: relative;

  flex: 0 0 62px;

  width: 100%;

  display: flex;

  align-items: center;

  justify-content: center;

  padding:
    max(8px, env(safe-area-inset-top))
    18px
    0;
}


/* TITLE */

.gallery-title {
  position: absolute;

  left: 20px;

  top: 50%;

  transform: translateY(-35%);

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 20px;

  font-style: italic;

  color: rgba(255,255,255,.9);
}


/* COUNTER */

.gallery-counter {

  display: flex;

  align-items: center;

  gap: 7px;

  font-family:
    "Be Vietnam Pro",
    Arial,
    sans-serif;

  font-size: 10px;

  letter-spacing: 2px;

  color: rgba(255,255,255,.45);
}

.gallery-counter strong {

  font-size: 13px;

  font-weight: 500;

  color: #fff;
}


/* CLOSE */

.close-button {

  position: absolute;

  right: 18px;

  top: 50%;

  transform: translateY(-30%);

  width: 38px;
  height: 38px;

  border-radius: 50%;

  border:
    1px solid
    rgba(255,255,255,.16);

  background:
    rgba(255,255,255,.06);

  cursor: pointer;

  transition:
    .25s ease;
}

.close-button:hover {

  background:
    rgba(255,255,255,.14);

  transform:
    translateY(-30%)
    rotate(90deg);
}

.close-button span {

  position: absolute;

  left: 50%;
  top: 50%;

  width: 15px;
  height: 1px;

  background: #fff;
}

.close-button span:first-child {

  transform:
    translate(-50%, -50%)
    rotate(45deg);
}

.close-button span:last-child {

  transform:
    translate(-50%, -50%)
    rotate(-45deg);
}


/* ======================================================
   MAIN
   ====================================================== */

.gallery-main {

  position: relative;

  flex: 1 1 auto;

  min-height: 0;

  width: 100%;

  display: flex;

  align-items: center;

  justify-content: center;

  padding:
    4px
    60px;

}


/* ======================================================
   MAIN SWIPER
   ====================================================== */

.main-swiper {

  width: 100%;
  height: 100%;

  overflow: hidden;
}

.main-slide {

  height: 100%;

  display: flex;

  align-items: center;

  justify-content: center;
}


/* ======================================================
   MAIN PHOTO
   ====================================================== */

.main-photo {

  width: 100%;
  height: 100%;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 2px;
}


/*
 * ẢNH CHÍNH
 *
 * Không dùng object-fit: cover
 *
 * => Không cắt cô dâu / chú rể
 */

.main-photo img {

  display: block;

  width: auto;

  height: auto;

  max-width: 100%;

  max-height: 100%;

  object-fit: contain;

  border-radius: 5px;

  user-select: none;

  -webkit-user-select: none;

  -webkit-user-drag: none;

  opacity: 0;

  transform: scale(.98);

  transition:
    opacity .4s ease,
    transform .45s ease;

  box-shadow:
    0 25px 70px
    rgba(0,0,0,.5);
}

.main-photo img.loaded {

  opacity: 1;

  transform: scale(1);
}


/* ======================================================
   ARROW
   ====================================================== */

.gallery-arrow {

  position: absolute;

  z-index: 20;

  top: 50%;

  transform: translateY(-50%);

  width: 48px;
  height: 48px;

  display: flex;

  align-items: center;
  justify-content: center;

  border:
    1px solid
    rgba(255,255,255,.18);

  border-radius: 50%;

  background:
    rgba(0,0,0,.32);

  backdrop-filter: blur(12px);

  cursor: pointer;

  transition: .25s ease;
}

.gallery-arrow:hover {

  background:
    rgba(255,255,255,.12);

  border-color:
    rgba(255,255,255,.4);
}

.gallery-arrow-left {
  left: 14px;
}

.gallery-arrow-right {
  right: 14px;
}

.gallery-arrow span {

  width: 10px;
  height: 10px;

  border-top:
    1px solid white;

  border-right:
    1px solid white;
}

.gallery-arrow-left span {

  transform: rotate(-135deg);
}

.gallery-arrow-right span {

  transform: rotate(45deg);
}


/* ======================================================
   CAPTION
   ====================================================== */

.gallery-caption {

  flex: 0 0 auto;

  width: 100%;

  min-height: 27px;

  padding:
    0 20px 4px;

  display: flex;

  align-items: center;

  justify-content: center;

  text-align: center;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 16px;

  font-style: italic;

  color:
    rgba(255,255,255,.78);

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;
}


/* ======================================================
   THUMBNAIL AREA
   ====================================================== */

.thumbnail-area {

  flex: 0 0 auto;

  width: 100%;

  padding:
    7px
    18px
    max(14px, env(safe-area-inset-bottom));

  background:
    linear-gradient(
      to bottom,
      rgba(0,0,0,0),
      rgba(0,0,0,.3)
    );
}


/* ======================================================
   THUMBNAIL SWIPER
   ====================================================== */

.thumbnail-swiper {

  width: 100%;

  max-width: 900px;

  margin: 0 auto;

  overflow: hidden;
}


/* ======================================================
   THUMBNAIL
   ====================================================== */

.thumbnail-slide {

  height: 64px;

  border-radius: 6px;

  overflow: hidden;

  cursor: pointer;

  opacity: .4;

  transform: scale(.94);

  transition:
    opacity .25s ease,
    transform .25s ease;
}

.thumbnail-slide:hover {

  opacity: .8;

  transform: scale(.97);
}


/* ACTIVE */

.thumbnail-slide.active {

  opacity: 1;

  transform: scale(1);
}


/* IMAGE */

.thumbnail-image {

  position: relative;

  width: 100%;
  height: 100%;

  overflow: hidden;

  border-radius: 6px;

  border:
    1px solid
    rgba(255,255,255,.08);

  transition:
    border-color .25s ease,
    box-shadow .25s ease;
}

.thumbnail-slide.active
.thumbnail-image {

  border-color:
    #d7b477;

  box-shadow:
    0 0 0 1px
      rgba(215,180,119,.18),
    0 7px 20px
      rgba(0,0,0,.35);
}


.thumbnail-image img {

  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;

  transition:
    transform .35s ease;
}

.thumbnail-slide:hover
.thumbnail-image img {

  transform: scale(1.05);
}


/* NUMBER */

.thumbnail-overlay {

  position: absolute;

  right: 4px;

  bottom: 3px;

  font-family:
    Arial,
    sans-serif;

  font-size: 8px;

  color: #fff;

  text-shadow:
    0 1px 4px #000;
}


/* ======================================================
   MOBILE
   ====================================================== */

@media (max-width: 600px) {

  .gallery-header {

    flex-basis: 52px;

    padding:
      max(5px, env(safe-area-inset-top))
      12px
      0;
  }

  .gallery-title {

    left: 14px;

    font-size: 17px;
  }

  .gallery-counter {

    font-size: 9px;

    letter-spacing: 1.5px;
  }

  .gallery-counter strong {

    font-size: 12px;
  }

  .close-button {

    right: 12px;

    width: 34px;
    height: 34px;
  }


  /* MAIN */

  .gallery-main {

    padding:
      2px
      40px;
  }


  /*
   * Ảnh dọc gần full màn hình
   */

  .main-photo {

    padding: 0;
  }

  .main-photo img {

    max-width: 100%;

    max-height: 100%;

    border-radius: 3px;

    box-shadow:
      0 15px 45px
      rgba(0,0,0,.55);
  }


  /* ARROW */

  .gallery-arrow {

    width: 34px;
    height: 34px;
  }

  .gallery-arrow-left {
    left: 4px;
  }

  .gallery-arrow-right {
    right: 4px;
  }

  .gallery-arrow span {

    width: 8px;
    height: 8px;
  }


  /* CAPTION */

  .gallery-caption {

    min-height: 25px;

    padding:
      0 12px 3px;

    font-size: 14px;
  }


  /* THUMB */

  .thumbnail-area {

    padding:
      5px
      10px
      max(10px, env(safe-area-inset-bottom));
  }

  .thumbnail-slide {

    height: 58px;

    border-radius: 5px;
  }

  .thumbnail-image {

    border-radius: 5px;
  }

  .thumbnail-overlay {

    display: none;
  }

}


/* ======================================================
   PHONE NHỎ
   ====================================================== */

@media (max-width: 375px) {

  .gallery-main {

    padding-left: 36px;
    padding-right: 36px;
  }

  .thumbnail-slide {

    height: 52px;
  }

}


/* ======================================================
   LANDSCAPE MOBILE
   ====================================================== */

@media
(max-width: 900px)
and
(orientation: landscape) {

  .gallery-header {

    flex-basis: 42px;
  }

  .gallery-main {

    padding:
      2px
      45px;
  }

  .thumbnail-slide {

    height: 42px;
  }

  .gallery-caption {

    min-height: 21px;

    font-size: 12px;
  }

}


/* ======================================================
   REDUCE MOTION
   ====================================================== */

@media (prefers-reduced-motion: reduce) {

  * {

    animation-duration: .01ms !important;

    transition-duration: .01ms !important;

  }

}

</style>