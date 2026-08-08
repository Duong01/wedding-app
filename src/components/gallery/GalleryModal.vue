<template>
  <div class="gallery-viewer">

  <!-- TOP BAR -->
  <div class="gallery-topbar">

    <div class="gallery-brand">
      <span class="gallery-brand-script">
        Our Story
      </span>

      <span class="gallery-brand-line"></span>
    </div>


    <div class="gallery-counter">
      <span class="gallery-current">
        {{ String(currentIndex + 1).padStart(2, '0') }}
      </span>

      <span class="gallery-counter-line"></span>

      <span>
        {{ String(images.length).padStart(2, '0') }}
      </span>
    </div>


    <button
      class="gallery-close"
      type="button"
      @click="$emit('close')"
      aria-label="Đóng"
    >
      <span></span>
      <span></span>
    </button>

  </div>


  <!-- MAIN IMAGE -->
  <div class="gallery-stage">

    <swiper
  ref="mainSwiper"
  class="main-swiper"
  :modules="modules"
  :navigation="false"
  :keyboard="{ enabled: true }"
  :initial-slide="startIndex"
  :thumbs="{ swiper: thumbsSwiper }"
  effect="fade"
  :fade-effect="{ crossFade: true }"
  @swiper="onMainSwiper"
  @slideChange="onMainSlideChange"
>

      <swiper-slide
        v-for="(img, i) in images"
        :key="i"
        class="main-slide"
      >

        <div class="main-image-frame">

          <img
            :src="img.image"
            :alt="img.title || 'Wedding photo'"
            class="main-image"
          />

        </div>

      </swiper-slide>

    </swiper>


    <!-- CUSTOM NAVIGATION -->

    <button
      class="gallery-nav gallery-prev"
      type="button"
      aria-label="Ảnh trước"
      @click="prevImage"
    >
      <span></span>
    </button>


    <button
      class="gallery-nav gallery-next"
      type="button"
      aria-label="Ảnh tiếp theo"
      @click="nextImage"
    >
      <span></span>
    </button>

  </div>


  <!-- CAPTION -->

  <div
    v-if="images[currentIndex]?.title"
    class="gallery-caption"
  >
    {{ images[currentIndex].title }}
  </div>


  <!-- THUMBNAILS -->

  <div class="thumbs-wrap">

    <swiper
      class="thumbs-swiper"
      :modules="modules"
      :space-between="10"
      :slides-per-view="6"
      @swiper="onThumbsSwiper"
      :breakpoints="{
        0: {
          slidesPerView: 4,
          spaceBetween: 7
        },
        480: {
          slidesPerView: 5,
          spaceBetween: 8
        },
        640: {
          slidesPerView: 6,
          spaceBetween: 10
        },
        900: {
          slidesPerView: 7,
          spaceBetween: 10
        }
      }"
    >

      <swiper-slide
        v-for="(img, i) in images"
        :key="'t' + i"
        class="thumb-slide"
      >

        <div class="thumb-image-wrap">

          <img
            :src="img.image"
            :alt="img.title || 'thumb'"
          />

          <div class="thumb-number">
            {{ String(i + 1).padStart(2, '0') }}
          </div>

        </div>

      </swiper-slide>

    </swiper>

  </div>

</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Swiper, SwiperSlide } from "swiper/vue";

import {
  Navigation,
  Thumbs,
  Keyboard
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const props = defineProps({
  images: { type: Array, required: true },
  startIndex: { type: Number, default: 0 }
});
const emit = defineEmits(['close']);

const mainSwiper = ref(null);
const thumbsSwiper = ref();
const modules = [Thumbs, Navigation, Keyboard];
const currentIndex = ref(0)

const onMainSlideChange = (swiper) => {
  currentIndex.value = swiper.realIndex
}

const onMainSwiper = (swiper) => {
  mainSwiper.value = swiper
}
function onThumbsSwiper(swiper) {
  thumbsSwiper.value = swiper;
}
const prevImage = () => {
  if (!mainSwiper.value) return

  mainSwiper.value.slidePrev()
}


const nextImage = () => {
  if (!mainSwiper.value) return

  mainSwiper.value.slideNext()
}
function close() {
  emit('close');
}

onMounted(() => {
  document.body.style.overflow = 'hidden';
});

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* =========================================================
   LUXURY WEDDING GALLERY
   ========================================================= */

.gallery-viewer {
    --gallery-bg: #120f0e;
    --gallery-bg-soft: #1a1513;

    --gallery-white: #fffaf5;
    --gallery-muted: rgba(255, 250, 245, .55);

    --gallery-gold: #d7b477;
    --gallery-red: #8b2527;

    position: relative;

    width: 100%;
    height: 100dvh;

    min-height: 560px;

    display: flex;
    flex-direction: column;

    overflow: hidden;

    background:
        radial-gradient(
            ellipse at 50% 42%,
            rgba(111, 67, 49, .18),
            transparent 48%
        ),
        linear-gradient(
            180deg,
            #171211 0%,
            #100d0c 100%
        );

    color: var(--gallery-white);
}


/* =========================================================
   BACKGROUND DECORATION
   ========================================================= */

.gallery-viewer::before {
    content: "";

    position: absolute;

    width: 550px;
    height: 550px;

    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);

    border-radius: 50%;

    background:
        radial-gradient(
            circle,
            rgba(216, 180, 109, .07),
            transparent 65%
        );

    pointer-events: none;

    z-index: 0;
}


/* =========================================================
   TOP BAR
   ========================================================= */

.gallery-topbar {
    position: relative;

    z-index: 20;

    flex: 0 0 72px;

    display: flex;

    align-items: center;
    justify-content: space-between;

    width: 100%;

    padding: 0 28px;
}


/* Brand */

.gallery-brand {
    display: flex;

    align-items: center;

    gap: 10px;
}


.gallery-brand-script {
    font-family: "Cormorant Garamond", serif;

    font-size: 21px;

    font-style: italic;
    font-weight: 500;

    color: var(--gallery-white);

    white-space: nowrap;
}


.gallery-brand-line {
    width: 28px;
    height: 1px;

    background: var(--gallery-gold);

    opacity: .7;
}


/* Counter */

.gallery-counter {
    position: absolute;

    left: 50%;
    top: 50%;

    transform: translate(-50%, -50%);

    display: flex;

    align-items: center;

    gap: 9px;

    font-family: "Be Vietnam Pro", sans-serif;

    font-size: 9px;

    font-weight: 400;

    letter-spacing: 2px;

    color: var(--gallery-muted);
}


.gallery-current {
    color: var(--gallery-white);

    font-weight: 500;
}


.gallery-counter-line {
    width: 18px;
    height: 1px;

    background: var(--gallery-gold);

    opacity: .7;
}


/* =========================================================
   CLOSE BUTTON
   ========================================================= */

.gallery-close {
    position: relative;

    width: 42px;
    height: 42px;

    display: flex;

    align-items: center;
    justify-content: center;

    padding: 0;

    border: 1px solid rgba(255,255,255,.18);

    border-radius: 50%;

    background: rgba(255,255,255,.07);

    backdrop-filter: blur(14px);

    -webkit-backdrop-filter: blur(14px);

    cursor: pointer;

    transition:
        background .3s ease,
        border-color .3s ease,
        transform .3s ease;
}


.gallery-close:hover {
    background: rgba(255,255,255,.14);

    border-color: rgba(215,180,119,.6);

    transform: rotate(90deg);
}


.gallery-close span {
    position: absolute;

    width: 15px;
    height: 1px;

    background: rgba(255,255,255,.85);
}


.gallery-close span:first-child {
    transform: rotate(45deg);
}


.gallery-close span:last-child {
    transform: rotate(-45deg);
}


/* =========================================================
   MAIN STAGE
   ========================================================= */

.gallery-stage {
    position: relative;

    z-index: 2;

    flex: 1;

    min-height: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    width: 100%;

    padding: 10px 80px 15px;
}


/* Swiper */

.main-swiper {
    position: relative;

    z-index: 1;
    width: 100%;
    height: 100%;

    overflow: visible !important;
}


.main-slide {
    display: flex;

    align-items: center;
    justify-content: center;

    height: 100%;

    opacity: 0 !important;

    transition: opacity .45s ease;
}


.main-slide.swiper-slide-active {
    opacity: 1 !important;
}


/* =========================================================
   IMAGE FRAME
   ========================================================= */

.main-image-frame {
    position: relative;

    display: flex;

    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    padding: 8px;
}


/* Glow phía sau ảnh */

.main-image-frame::before {
    content: "";

    position: absolute;

    inset: 8% 12%;

    background:
        rgba(216,180,109,.08);

    filter: blur(45px);

    border-radius: 30px;

    z-index: -1;
}


/* Ảnh */

.main-image {
    display: block;

    width: auto;
    height: auto;

    max-width: min(82vw, 920px);
    max-height: min(68dvh, 680px);

    object-fit: contain;

    border-radius: 5px;

    box-shadow:
        0 35px 90px rgba(0,0,0,.45);

    user-select: none;

    -webkit-user-drag: none;
}


/* =========================================================
   CUSTOM NAVIGATION
   ========================================================= */

.gallery-nav {
    position: absolute;

    top: 50%;

    z-index: 100;

    pointer-events: auto;

    transform: translateY(-50%);

    width: 54px;
    height: 54px;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0;

    border: 1px solid rgba(255,255,255,.16);

    border-radius: 50%;

    background: rgba(18,15,14,.55);

    color: #fff;

    cursor: pointer;

    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    transition:
        background .3s ease,
        border-color .3s ease,
        transform .3s ease;
}


.gallery-nav:hover {
    background: rgba(215,180,119,.12);

    border-color: rgba(215,180,119,.55);
}


.gallery-nav span {
    width: 11px;
    height: 11px;

    border-top: 1px solid var(--gallery-white);
    border-right: 1px solid var(--gallery-white);

    transition: border-color .3s ease;
}


.gallery-nav:hover span {
    border-color: var(--gallery-gold);
}


.gallery-prev {
    left: 22px;
}


.gallery-prev span {
    transform: rotate(-135deg);
}


.gallery-next {
    right: 22px;
}


.gallery-next span {
    transform: rotate(45deg);
}


/* =========================================================
   CAPTION
   ========================================================= */

.gallery-caption {
    position: relative;

    z-index: 10;

    flex: 0 0 auto;

    max-width: 500px;

    margin: -2px auto 12px;

    padding: 0 20px;

    text-align: center;

    font-family: "Cormorant Garamond", serif;

    font-size: 17px;

    font-style: italic;

    font-weight: 400;

    color: rgba(255,250,245,.8);
}


/* =========================================================
   THUMBNAILS
   ========================================================= */

.thumbs-wrap {
    position: relative;

    z-index: 10;

    flex: 0 0 auto;

    width: 100%;

    padding: 8px 28px 24px;

    background:
        linear-gradient(
            180deg,
            transparent,
            rgba(0,0,0,.25)
        );
}


.thumbs-swiper {
    width: 100%;
    max-width: 820px;

    margin: 0 auto;
}


.thumb-slide {
    position: relative;

    height: 68px;

    overflow: hidden;

    border-radius: 8px;

    opacity: .48;

    cursor: pointer;

    transition:
        opacity .35s ease,
        transform .35s ease;
}


.thumb-slide:hover {
    opacity: .85;
}


.thumb-slide.swiper-slide-thumb-active {
    opacity: 1;

    transform: translateY(-2px);
}


/* Thumbnail frame */

.thumb-image-wrap {
    position: relative;

    width: 100%;
    height: 100%;

    overflow: hidden;

    border-radius: 8px;

    border: 1px solid transparent;

    transition:
        border-color .35s ease,
        box-shadow .35s ease;
}


.swiper-slide-thumb-active .thumb-image-wrap {
    border-color: var(--gallery-gold);

    box-shadow:
        0 0 0 1px rgba(215,180,119,.18),
        0 8px 20px rgba(0,0,0,.3);
}


.thumb-slide img {
    display: block;

    width: 100%;
    height: 100%;

    object-fit: cover;

    transition: transform .5s ease;
}


.thumb-slide:hover img {
    transform: scale(1.06);
}


/* số thứ tự */

.thumb-number {
    position: absolute;

    right: 5px;
    bottom: 4px;

    font-family: "Be Vietnam Pro", sans-serif;

    font-size: 7px;

    color: rgba(255,255,255,.8);

    text-shadow:
        0 1px 4px rgba(0,0,0,.7);
}
@media (max-width: 600px) {

    .gallery-viewer {
        min-height: 100dvh;
    }


    /* =========================
       TOP
       ========================= */

    .gallery-topbar {
        flex: 0 0 58px;

        padding: 0 16px;
    }


    .gallery-brand-script {
        font-size: 18px;
    }


    .gallery-brand-line {
        width: 20px;
    }


    .gallery-counter {
        font-size: 8px;

        gap: 7px;

        letter-spacing: 1.5px;
    }


    .gallery-counter-line {
        width: 12px;
    }


    .gallery-close {
        width: 38px;
        height: 38px;
    }


    /* =========================
       MAIN IMAGE
       ========================= */

    .gallery-stage {
        padding:
            4px
            42px
            4px;
    }


    .main-image {
        max-width: 94vw;

        max-height: 67dvh;

        border-radius: 4px;
    }


    /* =========================
       NAV
       ========================= */

    .gallery-nav {
        width: 38px;
        height: 38px;

        background: rgba(18,15,14,.55);
    }


    .gallery-prev {
        left: 7px;
    }


    .gallery-next {
        right: 7px;
    }


    .gallery-nav span {
        width: 9px;
        height: 9px;
    }


    /* =========================
       CAPTION
       ========================= */

    .gallery-caption {
        margin: 0 auto 7px;

        font-size: 15px;
    }


    /* =========================
       THUMB
       ========================= */

    .thumbs-wrap {
        padding:
            6px
            14px
            18px;
    }


    .thumbs-swiper {
        max-width: 100%;
    }


    .thumb-slide {
        height: 58px;

        border-radius: 7px;
    }


    .thumb-image-wrap {
        border-radius: 7px;
    }


    .thumb-number {
        display: none;
    }
}
.main-image {
    animation: galleryImageIn .7s ease both;
}

@keyframes galleryImageIn {
    from {
        opacity: 0;
        transform: scale(.985);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
