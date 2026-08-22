<template>
  <div
    ref="galleryRef"
    class="gallery-viewer"
    tabindex="0"
    role="dialog"
    aria-modal="true"
    aria-label="Album ảnh"
    @keydown.esc="closeGallery"
    @keydown.left.prevent="prevImage"
    @keydown.right.prevent="nextImage"
  >
    <!-- =====================================================
         BACKGROUND
    ====================================================== -->

    <div class="gallery-bg">
      <div class="gallery-bg-glow"></div>
    </div>

    <!-- =====================================================
         HEADER
    ====================================================== -->

    <header class="gallery-header">
      <!-- COUNTER -->

      <div class="gallery-counter">
        <strong>
          {{ formatNumber(currentIndex + 1) }}
        </strong>

        <span>/</span>

        <span>
          {{ formatNumber(images.length) }}
        </span>
      </div>

      <!-- TITLE -->

      <div class="gallery-title">
        ALBUM ẢNH
      </div>

      <!-- CLOSE -->

      <button
        type="button"
        class="close-button"
        aria-label="Đóng album"
        @click="closeGallery"
      >
        <span></span>
        <span></span>
      </button>
    </header>

    <!-- =====================================================
         MAIN IMAGE
    ====================================================== -->

    <main class="gallery-main">
      <!-- PREVIOUS -->

      <button
        v-if="images.length > 1"
        type="button"
        class="gallery-arrow gallery-arrow-left"
        aria-label="Ảnh trước"
        @click.stop="prevImage"
      >
        <span></span>
      </button>

      <!-- ===================================================
           MAIN SWIPER
      ==================================================== -->

      <Swiper
        v-if="images.length"
        ref="mainSwiperComponent"
        class="main-swiper"
        :modules="modules"
        :initial-slide="safeStartIndex"
        :slides-per-view="1"
        :space-between="0"
        :loop="images.length > 1"
        :speed="180"
        :grab-cursor="true"
        :allow-touch-move="true"
        :touch-ratio="1"
        :touch-angle="45"
        :threshold="5"
        :resistance="true"
        :resistance-ratio="0.65"
        :watch-overflow="true"
        :observer="true"
        :observe-parents="true"
        :keyboard="{
          enabled: true,
          onlyInViewport: false,
        }"
        @swiper="onMainSwiper"
        @slide-change="onSlideChange"
      >
        <SwiperSlide
          v-for="(item, index) in images"
          :key="`main-${item.id || index}`"
          class="main-slide"
        >
          <div class="main-photo">
            <img
              :src="item.image"
              :alt="item.title || `Ảnh cưới ${index + 1}`"
              draggable="false"
              decoding="async"
              :class="{
                loaded: loadedImages[index],
              }"
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
        aria-label="Ảnh tiếp theo"
        @click.stop="nextImage"
      >
        <span></span>
      </button>
    </main>

    <!-- =====================================================
         CAPTION
    ====================================================== -->

    <div
      v-if="images[currentIndex]?.title"
      class="gallery-caption"
    >
      {{ images[currentIndex].title }}
    </div>

    <!-- =====================================================
         THUMBNAILS
    ====================================================== -->

    <section
      v-if="images.length > 1"
      class="thumbnail-area"
    >
      <Swiper
        class="thumbnail-swiper"
        :modules="[]"
        :slides-per-view="4.5"
        :space-between="7"
        :centered-slides="false"
        :free-mode="false"
        :watch-overflow="true"
        :observer="true"
        :observe-parents="true"
        :breakpoints="{
          0: {
            slidesPerView: 4.2,
            spaceBetween: 6,
          },

          360: {
            slidesPerView: 4.5,
            spaceBetween: 6,
          },

          480: {
            slidesPerView: 5.5,
            spaceBetween: 7,
          },

          768: {
            slidesPerView: 7,
            spaceBetween: 8,
          },

          1024: {
            slidesPerView: 9,
            spaceBetween: 9,
          },

          1400: {
            slidesPerView: 11,
            spaceBetween: 10,
          },
        }"
        @swiper="onThumbnailSwiper"
      >
        <SwiperSlide
          v-for="(item, index) in images"
          :key="`thumbnail-${item.id || index}`"
          class="thumbnail-slide"
          :class="{
            active: currentIndex === index,
          }"
          @click.stop="selectImage(index)"
        >
          <button
            type="button"
            class="thumbnail-button"
            :aria-label="`Xem ảnh ${index + 1}`"
          >
            <div class="thumbnail-image">
              <img
                :src="item.image"
                :alt="`Ảnh ${index + 1}`"
                loading="lazy"
                decoding="async"
                draggable="false"
              />

              <span class="thumbnail-number">
                {{ formatNumber(index + 1) }}
              </span>
            </div>
          </button>
        </SwiperSlide>
      </Swiper>
    </section>
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

import { Swiper, SwiperSlide } from "swiper/vue";
import { Keyboard } from "swiper/modules";

import "swiper/css";

// =========================================================
// PROPS
// =========================================================

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

// =========================================================
// EMIT
// =========================================================

const emit = defineEmits(["close"]);

// =========================================================
// REFS
// =========================================================

const galleryRef = ref(null);

const mainSwiper = ref(null);

const thumbnailSwiper = ref(null);

const currentIndex = ref(0);

const loadedImages = ref({});

// =========================================================
// MODULES
// =========================================================

const modules = [Keyboard];

// =========================================================
// SAFE START INDEX
// =========================================================

const safeStartIndex = computed(() => {
  if (!props.images.length) {
    return 0;
  }

  return Math.min(
    Math.max(Number(props.startIndex) || 0, 0),
    props.images.length - 1
  );
});

// =========================================================
// FORMAT
// =========================================================

function formatNumber(number) {
  return String(number).padStart(2, "0");
}

// =========================================================
// MAIN SWIPER READY
// =========================================================

function onMainSwiper(swiper) {
  mainSwiper.value = swiper;

  currentIndex.value = swiper.realIndex || 0;

  nextTick(() => {
    syncThumbnail(currentIndex.value, false);
  });
}

// =========================================================
// MAIN SLIDE CHANGE
// =========================================================

function onSlideChange(swiper) {
  /*
   * realIndex rất quan trọng khi loop:true.
   *
   * Không sử dụng swiper.activeIndex ở đây.
   */

  currentIndex.value = swiper.realIndex || 0;

  syncThumbnail(currentIndex.value, true);
}

// =========================================================
// THUMBNAIL SWIPER READY
// =========================================================

function onThumbnailSwiper(swiper) {
  thumbnailSwiper.value = swiper;

  nextTick(() => {
    syncThumbnail(currentIndex.value, false);
  });
}

// =========================================================
// SELECT THUMBNAIL
// =========================================================

function selectImage(index) {
  const swiper = mainSwiper.value;

  if (!swiper || !props.images.length) {
    return;
  }

  if (index < 0 || index >= props.images.length) {
    return;
  }

  /*
   * Khi main swiper loop:true
   *
   * PHẢI dùng slideToLoop()
   *
   * Không dùng slideTo().
   */

  swiper.slideToLoop(index, 160);

  /*
   * Cập nhật UI ngay.
   *
   * Không phải chờ animation kết thúc.
   */

  currentIndex.value = index;

  syncThumbnail(index, true);
}

// =========================================================
// SYNC THUMBNAIL
// =========================================================

function syncThumbnail(index = currentIndex.value, animated = true) {
  const swiper = thumbnailSwiper.value;

  if (!swiper || !swiper.slides?.length) {
    return;
  }

  /*
   * Số lượng thumbnail đang nhìn thấy.
   */

  const visible =
    Number(swiper.params.slidesPerView) || 4;

  /*
   * Giữ thumbnail active ở khoảng giữa vùng nhìn thấy
   * nếu có thể.
   */

  const target = Math.max(
    Math.min(
      Math.round(index - visible / 2),
      props.images.length - Math.ceil(visible)
    ),
    0
  );

  swiper.slideTo(
    target,
    animated ? 120 : 0
  );
}

// =========================================================
// PREVIOUS
// =========================================================

function prevImage() {
  const swiper = mainSwiper.value;

  if (!swiper || props.images.length <= 1) {
    return;
  }

  /*
   * Swiper loop tự xử lý:
   *
   * Ảnh đầu -> ảnh cuối
   */

  swiper.slidePrev(180);
}

// =========================================================
// NEXT
// =========================================================

function nextImage() {
  const swiper = mainSwiper.value;

  if (!swiper || props.images.length <= 1) {
    return;
  }

  /*
   * Swiper loop tự xử lý:
   *
   * Ảnh cuối -> ảnh đầu
   */

  swiper.slideNext(180);
}

// =========================================================
// CLOSE
// =========================================================

function closeGallery() {
  emit("close");
}

// =========================================================
// KEYBOARD
// =========================================================

function handleKeyboard(event) {
  /*
   * Không xử lý nếu người dùng đang nhập text.
   */

  const target = event.target;

  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  ) {
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();

    closeGallery();

    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();

    prevImage();

    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();

    nextImage();
  }
}

// =========================================================
// PRELOAD IMAGE
// =========================================================

function preloadAroundCurrent() {
  if (!props.images.length) {
    return;
  }

  const total = props.images.length;

  const indexes = [
    currentIndex.value,
    (currentIndex.value + 1) % total,
    (currentIndex.value - 1 + total) % total,
  ];

  indexes.forEach((index) => {
    const src = props.images[index]?.image;

    if (!src) {
      return;
    }

    const image = new Image();

    image.src = src;
  });
}

// =========================================================
// LOCK BODY SCROLL
// =========================================================

let oldOverflow = "";
let oldOverscrollBehavior = "";

onMounted(async () => {
  oldOverflow = document.body.style.overflow;
  oldOverscrollBehavior =
    document.body.style.overscrollBehavior;

  /*
   * Chỉ khóa scroll.
   *
   * KHÔNG dùng:
   *
   * body.style.touchAction = "none"
   *
   * vì có thể ảnh hưởng thao tác vuốt trên mobile.
   */

  document.body.style.overflow = "hidden";

  document.body.style.overscrollBehavior = "none";

  window.addEventListener(
    "keydown",
    handleKeyboard
  );

  await nextTick();

  /*
   * Focus gallery để keyboard hoạt động.
   */

  galleryRef.value?.focus({
    preventScroll: true,
  });

  preloadAroundCurrent();
});

// =========================================================
// CLEANUP
// =========================================================

onBeforeUnmount(() => {
  document.body.style.overflow = oldOverflow;

  document.body.style.overscrollBehavior =
    oldOverscrollBehavior;

  window.removeEventListener(
    "keydown",
    handleKeyboard
  );

  mainSwiper.value?.destroy?.(true, true);

  thumbnailSwiper.value?.destroy?.(true, true);

  mainSwiper.value = null;

  thumbnailSwiper.value = null;
});
</script>

<style scoped>
/* =========================================================
   ROOT
========================================================= */

.gallery-viewer {
  position: fixed;
  inset: 0;

  z-index: 99999;

  width: 100%;
  height: 100dvh;
  min-height: 100svh;

  display: grid;

  /*
   * HEADER
   * MAIN
   * CAPTION
   * THUMBNAILS
   */

  grid-template-rows:
    58px
    minmax(0, 1fr)
    auto
    96px;

  overflow: hidden;

  color: #fff;

  background: #100c0a;

  overscroll-behavior: none;

  outline: none;

  isolation: isolate;
}


/* =========================================================
   BACKGROUND
========================================================= */

.gallery-bg {
  position: absolute;
  inset: 0;

  z-index: -2;

  background:
    radial-gradient(
      ellipse at 50% 35%,
      rgba(255, 255, 255, 0.08),
      transparent 38%
    ),
    linear-gradient(
      145deg,
      #1b1210 0%,
      #0c0908 48%,
      #17100d 100%
    );

  pointer-events: none;
}


.gallery-bg-glow {
  position: absolute;
  inset: -20%;

  background:
    radial-gradient(
      circle at 15% 20%,
      rgba(216, 180, 90, 0.11),
      transparent 24%
    ),
    radial-gradient(
      circle at 85% 75%,
      rgba(216, 180, 90, 0.07),
      transparent 25%
    );

  filter: blur(70px);
}


/* =========================================================
   HEADER
========================================================= */

.gallery-header {
  position: relative;

  z-index: 50;

  width: 100%;
  height: 58px;

  display: flex;

  align-items: center;
  justify-content: center;

  box-sizing: border-box;

  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  background: rgba(12, 9, 8, 0.78);

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}


/* =========================================================
   TITLE
========================================================= */

.gallery-title {
  color: #f6e6bd;

  font-family:
    "Cormorant Garamond",
    "Times New Roman",
    serif;

  font-size: 14px;

  font-weight: 600;

  letter-spacing: 0.18em;

  text-align: center;

  user-select: none;
}


/* =========================================================
   COUNTER
========================================================= */

.gallery-counter {
  position: absolute;

  left: 14px;
  top: 50%;

  display: flex;

  align-items: center;

  gap: 5px;

  transform: translateY(-50%);

  color: rgba(255, 255, 255, 0.45);

  font-family:
    "Cormorant Garamond",
    "Times New Roman",
    serif;

  font-size: 11px;

  letter-spacing: 0.08em;

  user-select: none;
}


.gallery-counter strong {
  color: #e4c46e;

  font-size: 14px;

  font-weight: 600;
}


/* =========================================================
   CLOSE BUTTON
========================================================= */

.close-button {
  position: absolute;

  top: 50%;
  right: 12px;

  width: 38px;
  height: 38px;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 0;

  transform: translateY(-50%);

  border: 1px solid rgba(255, 255, 255, 0.2);

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.06);

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}


.close-button:hover {
  border-color: rgba(224, 190, 100, 0.7);

  background: rgba(224, 190, 100, 0.12);

  transform:
    translateY(-50%)
    rotate(90deg);
}


.close-button:active {
  transform:
    translateY(-50%)
    scale(0.92);
}


.close-button span {
  position: absolute;

  top: 50%;
  left: 50%;

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


/* =========================================================
   MAIN AREA
========================================================= */

.gallery-main {
  position: relative;

  width: 100%;
  min-width: 0;
  min-height: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  overflow: hidden;
}


/* =========================================================
   MAIN SWIPER
========================================================= */

.main-swiper {
  position: relative;

  width: 100%;
  height: 100%;

  min-width: 0;
  min-height: 0;

  overflow: hidden;
}


/*
 * Đảm bảo wrapper luôn là flex ngang.
 *
 * Đây là phần quan trọng để tránh ảnh chồng lên nhau.
 */

.main-swiper :deep(.swiper-wrapper) {
  width: 100%;
  height: 100%;

  display: flex;

  align-items: stretch;
}


.main-swiper :deep(.swiper-slide) {
  position: relative;

  width: 100%;
  height: 100%;

  flex: 0 0 100%;

  min-width: 0;
  min-height: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  box-sizing: border-box;

  overflow: hidden;
}


/* =========================================================
   MAIN SLIDE
========================================================= */

.main-slide {
  padding: 10px 56px;
}


/* =========================================================
   MAIN PHOTO
========================================================= */

.main-photo {
  position: relative;

  width: 100%;
  height: 100%;

  min-width: 0;
  min-height: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  box-sizing: border-box;

  padding: 5px;

  border: 1px solid rgba(216, 180, 90, 0.55);

  border-radius: 14px;

  background:
    rgba(255, 255, 255, 0.025);

  overflow: hidden;

  box-shadow:
    0 20px 55px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(216, 180, 90, 0.08);
}


/*
 * Viền vàng bên trong.
 */

.main-photo::before {
  content: "";

  position: absolute;

  inset: 4px;

  z-index: 2;

  border: 1px solid rgba(216, 180, 90, 0.25);

  border-radius: 10px;

  pointer-events: none;
}


/* =========================================================
   MAIN IMAGE
========================================================= */

.main-photo img {
  position: relative;

  z-index: 1;

  display: block;

  width: 100%;
  height: 100%;

  /*
   * Quan trọng:
   *
   * Không crop ảnh.
   * Ảnh ngang/dọc đều nằm gọn trong khung.
   */

  object-fit: contain;

  object-position: center;

  border-radius: 9px;

  opacity: 0;

  transform: scale(0.985);

  user-select: none;

  -webkit-user-drag: none;

  transition:
    opacity 0.16s ease,
    transform 0.18s cubic-bezier(
      0.22,
      1,
      0.36,
      1
    );
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

  z-index: 30;

  width: 44px;
  height: 44px;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 0;

  transform: translateY(-50%);

  border: 1px solid rgba(255, 255, 255, 0.2);

  border-radius: 50%;

  background:
    rgba(10, 8, 7, 0.5);

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;

  touch-action: manipulation;

  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;
}


.gallery-arrow:hover {
  border-color: rgba(224, 190, 100, 0.7);

  background:
    rgba(224, 190, 100, 0.14);
}


.gallery-arrow:active {
  transform:
    translateY(-50%)
    scale(0.9);
}


.gallery-arrow-left {
  left: 10px;
}


.gallery-arrow-right {
  right: 10px;
}


.gallery-arrow-left:hover {
  transform:
    translate(-3px, -50%);
}


.gallery-arrow-right:hover {
  transform:
    translate(3px, -50%);
}


.gallery-arrow span {
  width: 8px;
  height: 8px;

  border-top: 1.5px solid #fff;
  border-right: 1.5px solid #fff;
}


.gallery-arrow-left span {
  transform: rotate(-135deg);

  margin-left: 3px;
}


.gallery-arrow-right span {
  transform: rotate(45deg);

  margin-right: 3px;
}


/* =========================================================
   CAPTION
========================================================= */

.gallery-caption {
  position: relative;

  z-index: 20;

  width: fit-content;

  max-width: calc(100% - 30px);

  margin: 0 auto 5px;

  padding: 6px 15px;

  box-sizing: border-box;

  color: rgba(255, 255, 255, 0.88);

  font-family:
    "Cormorant Garamond",
    "Times New Roman",
    serif;

  font-size: 13px;

  line-height: 1.35;

  letter-spacing: 0.04em;

  text-align: center;

  border: 1px solid rgba(216, 180, 90, 0.22);

  border-radius: 999px;

  background:
    rgba(0, 0, 0, 0.3);

  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  overflow: hidden;

  user-select: none;
}


/* =========================================================
   THUMBNAIL AREA
========================================================= */

.thumbnail-area {
  position: relative;

  z-index: 40;

  width: 100%;

  min-width: 0;

  box-sizing: border-box;

  padding:
    7px
    10px
    12px;

  overflow: hidden;

  background:
    linear-gradient(
      180deg,
      rgba(12, 9, 8, 0.45),
      rgba(12, 9, 8, 0.9)
    );

  border-top:
    1px solid rgba(255, 255, 255, 0.06);

  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}


/* =========================================================
   THUMBNAIL SWIPER
========================================================= */

.thumbnail-swiper {
  width: 100%;
  height: 76px;

  overflow: hidden;
}


.thumbnail-swiper :deep(.swiper-wrapper) {
  height: 100%;

  display: flex;

  align-items: center;
}


.thumbnail-swiper :deep(.swiper-slide) {
  height: 68px;

  flex-shrink: 0;

  box-sizing: border-box;
}


/* =========================================================
   THUMBNAIL BUTTON
========================================================= */

.thumbnail-button {
  display: block;

  width: 100%;
  height: 100%;

  margin: 0;
  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;

  touch-action: manipulation;
}


/* =========================================================
   THUMBNAIL
========================================================= */

.thumbnail-slide {
  opacity: 0.42;

  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}


.thumbnail-slide:hover {
  opacity: 0.8;

  transform: translateY(-2px);
}


.thumbnail-slide.active {
  opacity: 1;

  transform: translateY(-3px);
}


.thumbnail-image {
  position: relative;

  width: 100%;
  height: 100%;

  box-sizing: border-box;

  padding: 2px;

  overflow: hidden;

  border:
    1px solid rgba(255, 255, 255, 0.14);

  border-radius: 7px;

  background:
    rgba(255, 255, 255, 0.04);

  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}


.thumbnail-image img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  border-radius: 5px;

  user-select: none;

  -webkit-user-drag: none;

  transition:
    transform 0.22s ease;
}


.thumbnail-slide:hover .thumbnail-image img {
  transform: scale(1.05);
}


/* =========================================================
   ACTIVE THUMBNAIL
========================================================= */

.thumbnail-slide.active .thumbnail-image {
  border-color: #dfbf65;

  box-shadow:
    0 0 0 1px rgba(223, 191, 101, 0.35),
    0 5px 18px rgba(223, 191, 101, 0.16);
}


/* =========================================================
   THUMBNAIL NUMBER
========================================================= */

.thumbnail-number {
  position: absolute;

  right: 3px;
  bottom: 3px;

  min-width: 17px;
  height: 17px;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 0 3px;

  box-sizing: border-box;

  color: #fff;

  font-family:
    "Cormorant Garamond",
    "Times New Roman",
    serif;

  font-size: 8px;

  line-height: 1;

  border-radius: 4px;

  background:
    rgba(0, 0, 0, 0.58);

  backdrop-filter: blur(5px);
}


.thumbnail-slide.active .thumbnail-number {
  color: #17120f;

  background: #dfbf65;
}


/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 769px) {
  .gallery-viewer {
    grid-template-rows:
      68px
      minmax(0, 1fr)
      auto
      104px;
  }


  .gallery-header {
    height: 68px;
  }


  .gallery-title {
    font-size: 15px;
  }


  .gallery-counter {
    left: 22px;
  }


  .close-button {
    right: 18px;
  }


  .main-slide {
    padding:
      18px
      90px;
  }


  .main-photo {
    max-width: 1200px;

    padding: 7px;

    border-radius: 16px;
  }


  .main-photo::before {
    inset: 5px;

    border-radius: 11px;
  }


  .main-photo img {
    border-radius: 11px;
  }


  .thumbnail-area {
    width: min(100%, 1100px);

    margin: 0 auto;

    border-radius:
      12px
      12px
      0
      0;
  }
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 768px) {
  .gallery-viewer {
    grid-template-rows:
      54px
      minmax(0, 1fr)
      auto
      88px;
  }


  .gallery-header {
    height: 54px;

    padding:
      0
      52px;
  }


  .gallery-title {
    font-size: 11px;

    letter-spacing: 0.16em;
  }


  .gallery-counter {
    left: 11px;

    font-size: 9px;
  }


  .gallery-counter strong {
    font-size: 12px;
  }


  .close-button {
    right: 9px;

    width: 36px;
    height: 36px;
  }


  /* =====================================================
     MAIN
  ====================================================== */

  .main-slide {
    padding:
      7px
      7px;
  }


  .main-photo {
    width: 100%;
    height: 100%;

    padding: 4px;

    border-radius: 10px;

    box-shadow:
      0 12px 35px rgba(0, 0, 0, 0.42);
  }


  .main-photo::before {
    inset: 3px;

    border-radius: 7px;
  }


  .main-photo img {
    border-radius: 6px;
  }


  /* =====================================================
     ARROWS
  ====================================================== */

  .gallery-arrow {
    width: 34px;
    height: 34px;

    background:
      rgba(10, 8, 7, 0.58);
  }


  .gallery-arrow-left {
    left: 5px;
  }


  .gallery-arrow-right {
    right: 5px;
  }


  .gallery-arrow span {
    width: 7px;
    height: 7px;
  }


  /* =====================================================
     CAPTION
  ====================================================== */

  .gallery-caption {
    max-width: calc(100% - 24px);

    margin-bottom: 3px;

    padding:
      4px
      11px;

    font-size: 10px;
  }


  /* =====================================================
     THUMBNAILS
  ====================================================== */

  .thumbnail-area {
    height: 88px;

    padding:
      6px
      8px
      8px;
  }


  .thumbnail-swiper {
    height: 72px;
  }


  .thumbnail-swiper :deep(.swiper-slide) {
    height: 64px;
  }


  .thumbnail-image {
    border-radius: 6px;
  }


  .thumbnail-image img {
    border-radius: 4px;
  }


  .thumbnail-number {
    right: 2px;
    bottom: 2px;

    min-width: 14px;
    height: 14px;

    font-size: 7px;

    border-radius: 3px;
  }
}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 380px) {
  .gallery-viewer {
    grid-template-rows:
      50px
      minmax(0, 1fr)
      auto
      78px;
  }


  .gallery-header {
    height: 50px;
  }


  .gallery-title {
    font-size: 10px;
  }


  .close-button {
    width: 33px;
    height: 33px;
  }


  .main-slide {
    padding: 5px;
  }


  .gallery-arrow {
    width: 31px;
    height: 31px;
  }


  .gallery-arrow-left {
    left: 4px;
  }


  .gallery-arrow-right {
    right: 4px;
  }


  .thumbnail-area {
    height: 78px;

    padding:
      5px
      7px
      7px;
  }


  .thumbnail-swiper {
    height: 65px;
  }


  .thumbnail-swiper :deep(.swiper-slide) {
    height: 58px;
  }
}


/* =========================================================
   LANDSCAPE MOBILE
========================================================= */

@media (
  max-width: 768px
) and (
  orientation: landscape
) {
  .gallery-viewer {
    grid-template-rows:
      46px
      minmax(0, 1fr)
      68px;
  }


  .gallery-header {
    height: 46px;
  }


  .gallery-caption {
    display: none;
  }


  .thumbnail-area {
    height: 68px;

    padding:
      4px
      8px
      6px;
  }


  .thumbnail-swiper {
    height: 58px;
  }


  .thumbnail-swiper :deep(.swiper-slide) {
    height: 50px;
  }


  .main-slide {
    padding:
      4px
      48px;
  }
}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .gallery-viewer *,
  .gallery-viewer *::before,
  .gallery-viewer *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
</style>
