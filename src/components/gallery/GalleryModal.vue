<template>
  <div class="gallery-viewer" @keydown.esc="closeGallery">
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
          enabled: true,
        }"
        :loop="images.length > 1"
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
    <div v-if="images[currentIndex]?.title" class="gallery-caption">
      {{ images[currentIndex].title }}
    </div>

    <!-- ================================
         THUMBNAILS
         ================================ -->
    <div v-if="images.length > 1" class="thumbnail-area">
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
            spaceBetween: 6,
          },

          360: {
            slidesPerView: 5,
            spaceBetween: 7,
          },

          480: {
            slidesPerView: 6,
            spaceBetween: 8,
          },

          768: {
            slidesPerView: 8,
            spaceBetween: 9,
          },

          1024: {
            slidesPerView: 10,
            spaceBetween: 10,
          },
        }"
        @swiper="onThumbnailSwiper"
      >
        <SwiperSlide
          v-for="(item, index) in images"
          :key="'thumbnail-' + (item.id || index)"
          class="thumbnail-slide"
          :class="{
            active: currentIndex === index,
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
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";

import { Keyboard, FreeMode } from "swiper/modules";

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

const emit = defineEmits(["close"]);

// ========================================
// SWIPER
// ========================================

const mainSwiper = ref(null);
const thumbnailSwiper = ref(null);

const currentIndex = ref(0);

const loadedImages = ref({});

const modules = [Keyboard, FreeMode];

// ========================================
// INDEX AN TOÀN
// ========================================

const safeStartIndex = computed(() => {
  if (!props.images.length) {
    return 0;
  }

  return Math.min(Math.max(props.startIndex, 0), props.images.length - 1);
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

  currentIndex.value = swiper.realIndex;

  // nextTick(() => {
  //   syncThumbnail();
  // });
}

// ========================================
// SLIDE CHANGE
// ========================================

function onSlideChange(swiper) {
  currentIndex.value = swiper.realIndex;

  // syncThumbnail();
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
    swiper.slideTo(Math.max(index - 2, 0), 350);
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

/* =========================================================
   GALLERY - LUXURY SLIDER
   ========================================================= */

.gallery-bg {
  position: fixed;
  inset: 0;
  z-index: -2;

  background: radial-gradient(
      circle at 50% 35%,
      rgba(255, 255, 255, 0.12),
      transparent 35%
    ),
    linear-gradient(135deg, #17120f 0%, #0b0b0b 45%, #1a1410 100%);

  overflow: hidden;
}

.gallery-bg::before {
  content: "";
  position: absolute;
  inset: -10%;

  background: radial-gradient(
      circle at 20% 30%,
      rgba(212, 175, 55, 0.12),
      transparent 25%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(255, 255, 255, 0.08),
      transparent 25%
    );

  filter: blur(60px);
}

/* =========================================================
   HEADER
   ========================================================= */

.gallery-header {
  position: relative;
  z-index: 10;

  display: flex;
  align-items: center;
  justify-content: center;

  height: 72px;
  padding: 0 80px;
}

.gallery-title {
  color: #f8f1df;

  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;

  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
}

.gallery-title span {
  position: relative;
}

.gallery-title span::after {
  content: "";

  position: absolute;
  left: 50%;
  bottom: -9px;

  width: 36px;
  height: 1px;

  transform: translateX(-50%);

  background: linear-gradient(90deg, transparent, #d8b45a, transparent);
}

/* COUNTER */

.gallery-counter {
  position: absolute;
  left: 28px;

  display: flex;
  align-items: center;
  gap: 7px;

  color: rgba(255, 255, 255, 0.5);

  font-size: 13px;
  letter-spacing: 0.08em;
}

.gallery-counter strong {
  color: #e7c76a;

  font-size: 17px;
  font-weight: 500;
}

/* CLOSE */

.close-button {
  position: absolute;
  right: 25px;

  width: 44px;
  height: 44px;

  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.06);

  backdrop-filter: blur(12px);

  cursor: pointer;

  transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
}

.close-button:hover {
  background: rgba(216, 180, 90, 0.15);
  border-color: rgba(216, 180, 90, 0.6);

  transform: rotate(90deg);
}

.close-button span {
  position: absolute;
  top: 50%;
  left: 50%;

  width: 17px;
  height: 1px;

  background: #fff;
}

.close-button span:first-child {
  transform: translate(-50%, -50%) rotate(45deg);
}

.close-button span:last-child {
  transform: translate(-50%, -50%) rotate(-45deg);
}

/* =========================================================
   MAIN IMAGE
   ========================================================= */

.gallery-main {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: calc(100vh - 210px);

  min-height: 400px;
}

/*
 * Swiper
 */

.main-swiper {
  width: min(82vw, 1200px);
  height: 100%;
}

.main-slide {
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 18px;
  box-sizing: border-box;
}

/*
 * Khung ảnh chính
 */

.main-photo {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  max-width: 1100px;
  max-height: 650px;

  padding: 7px;

  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 24px;

  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.18),
    rgba(255, 255, 255, 0.03)
  );

  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(216, 180, 90, 0.12), 0 0 60px rgba(216, 180, 90, 0.08);

  overflow: hidden;

  transition: transform 0.5s ease, box-shadow 0.5s ease;
}

/*
 * Viền vàng bên trong
 */

.main-photo::before {
  content: "";

  position: absolute;
  inset: 4px;

  border: 1px solid rgba(216, 180, 90, 0.35);
  border-radius: 19px;

  pointer-events: none;
  z-index: 2;
}

/*
 * Ánh sáng chạy quanh ảnh
 */

.main-photo::after {
  content: "";

  position: absolute;
  inset: -100%;

  background: linear-gradient(
    120deg,
    transparent 40%,
    rgba(255, 255, 255, 0.08) 50%,
    transparent 60%
  );

  transform: translateX(-30%);

  transition: transform 1s ease;

  pointer-events: none;
  z-index: 3;
}

.swiper-slide-active .main-photo::after {
  transform: translateX(30%);
}

/*
 * IMAGE
 */

.main-photo img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: contain;

  border-radius: 18px;

  opacity: 0;

  transform: scale(0.985);

  transition: opacity 0.45s ease, transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);

  user-select: none;
  -webkit-user-drag: none;
}

.main-photo img.loaded {
  opacity: 1;
  transform: scale(1);
}

/* =========================================================
   ARROWS
   ========================================================= */

.gallery-arrow {
  position: absolute;
  top: 50%;

  z-index: 20;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 54px;
  height: 54px;

  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;

  background: rgba(15, 15, 15, 0.45);

  backdrop-filter: blur(14px);

  transform: translateY(-50%);

  cursor: pointer;

  transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease,
    box-shadow 0.3s ease;
}

.gallery-arrow:hover {
  background: rgba(216, 180, 90, 0.18);

  border-color: rgba(216, 180, 90, 0.65);

  box-shadow: 0 0 25px rgba(216, 180, 90, 0.15);
}

.gallery-arrow-left {
  left: 28px;
}

.gallery-arrow-right {
  right: 28px;
}

.gallery-arrow-left:hover {
  transform: translate(-4px, -50%);
}

.gallery-arrow-right:hover {
  transform: translate(4px, -50%);
}

/*
 * Arrow icon
 */

.gallery-arrow span {
  width: 10px;
  height: 10px;

  border-top: 1.5px solid #fff;
  border-right: 1.5px solid #fff;
}

.gallery-arrow-left span {
  transform: rotate(-135deg);
  margin-left: 4px;
}

.gallery-arrow-right span {
  transform: rotate(45deg);
  margin-right: 4px;
}

/* =========================================================
   CAPTION
   ========================================================= */

.gallery-caption {
  position: relative;

  width: fit-content;
  max-width: 80%;

  margin: -5px auto 12px;
  padding: 9px 22px;

  color: rgba(255, 255, 255, 0.88);

  font-size: 14px;
  letter-spacing: 0.05em;
  text-align: center;

  border: 1px solid rgba(216, 180, 90, 0.25);
  border-radius: 999px;

  background: rgba(0, 0, 0, 0.28);

  backdrop-filter: blur(12px);

  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
}

/* =========================================================
   THUMBNAILS
   ========================================================= */

.thumbnail-area {
  position: relative;

  width: min(90vw, 900px);

  margin: 0 auto;

  padding: 5px 0 18px;
}

.thumbnail-swiper {
  width: 100%;
  overflow: visible;
}

.thumbnail-slide {
  cursor: pointer;
  opacity: 0.5;

  transition: opacity 0.3s ease, transform 0.3s ease;
}

.thumbnail-slide:hover {
  opacity: 0.9;
  transform: translateY(-3px);
}

.thumbnail-slide.active {
  opacity: 1;
  transform: translateY(-5px);
}

/*
 * Thumbnail frame
 */

.thumbnail-image {
  position: relative;

  aspect-ratio: 1 / 0.72;

  padding: 3px;

  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.05);

  overflow: hidden;

  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}

.thumbnail-image img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  border-radius: 9px;

  transition: transform 0.4s ease;
}

.thumbnail-slide:hover img {
  transform: scale(1.07);
}

/*
 * Active thumbnail
 */

.thumbnail-slide.active .thumbnail-image {
  border-color: #d8b45a;

  box-shadow: 0 0 0 1px rgba(216, 180, 90, 0.25),
    0 5px 22px rgba(216, 180, 90, 0.22);
}

/*
 * Active glow
 */

.thumbnail-slide.active .thumbnail-image::after {
  content: "";

  position: absolute;
  inset: 0;

  border-radius: 9px;

  box-shadow: inset 0 0 0 1px rgba(255, 225, 145, 0.4);

  pointer-events: none;
}

/*
 * Number overlay
 */

.thumbnail-overlay {
  position: absolute;
  right: 5px;
  bottom: 5px;

  min-width: 19px;
  height: 19px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0 4px;

  border-radius: 6px;

  color: #fff;

  font-size: 9px;
  line-height: 1;

  background: rgba(0, 0, 0, 0.55);

  backdrop-filter: blur(5px);
}

.thumbnail-slide.active .thumbnail-overlay {
  color: #17120f;
  background: #d8b45a;
}

/* =========================================================
   SWIPER TRANSITION
   ========================================================= */

.main-swiper .swiper-slide {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 768px) {
  .gallery-header {
    height: 58px;
    padding: 0 60px;
  }

  .gallery-title {
    font-size: 14px;
    letter-spacing: 0.12em;
  }

  .gallery-counter {
    left: 15px;
    font-size: 11px;
  }

  .gallery-counter strong {
    font-size: 14px;
  }

  .close-button {
    right: 14px;

    width: 38px;
    height: 38px;
  }

  .gallery-main {
    height: calc(100vh - 180px);

    min-height: 350px;
  }

  .main-swiper {
    width: 100%;
  }

  .main-slide {
    padding: 10px;
  }

  .main-photo {
    padding: 5px;

    border-radius: 18px;
  }

  .main-photo::before {
    inset: 3px;
    border-radius: 14px;
  }

  .main-photo img {
    border-radius: 13px;
  }

  .gallery-arrow {
    width: 42px;
    height: 42px;
  }

  .gallery-arrow-left {
    left: 8px;
  }

  .gallery-arrow-right {
    right: 8px;
  }

  .gallery-caption {
    max-width: 85%;

    margin-top: -2px;

    padding: 7px 16px;

    font-size: 12px;
  }

  .thumbnail-area {
    width: calc(100% - 24px);
    padding-bottom: 12px;
  }

  .thumbnail-image {
    border-radius: 9px;
  }

  .thumbnail-image img {
    border-radius: 6px;
  }
}

/* =========================================================
   SMALL MOBILE
   ========================================================= */

@media (max-width: 480px) {
  .gallery-main {
    height: calc(100vh - 165px);
  }

  .main-slide {
    padding: 7px;
  }

  .main-photo {
    border-radius: 15px;
  }

  .main-photo img {
    border-radius: 10px;
  }

  .gallery-arrow {
    width: 36px;
    height: 36px;
  }

  .gallery-arrow-left {
    left: 5px;
  }

  .gallery-arrow-right {
    right: 5px;
  }

  .gallery-arrow span {
    width: 8px;
    height: 8px;
  }

  .thumbnail-area {
    width: calc(100% - 18px);
  }
}

/* =========================================================
   REDUCE MOTION
   ========================================================= */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
</style>