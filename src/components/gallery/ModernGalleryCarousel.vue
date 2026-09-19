<template>
  <div class="mgc" :style="cssVars">
    <div class="mgc__stage">
      <!-- PREV -->
      <button
        v-if="images.length > 1"
        type="button"
        class="mgc__arrow mgc__arrow--prev"
        aria-label="Ảnh trước"
        @click="slidePrev"
      >
        <v-icon size="24">mdi-chevron-left</v-icon>
      </button>

      <!-- ===================================================
           SWIPER COVERFLOW (dạng vòng)
      ==================================================== -->

      <Swiper
        v-if="images.length"
        class="mgc__swiper"
        :modules="modules"
        :slides-per-view="'auto'"
        :centered-slides="true"
        :loop="loopEnabled"
        :speed="450"
        :grab-cursor="true"
        effect="coverflow"
        :coverflow-effect="coverflowEffect"
        :keyboard="{ enabled: true, onlyInViewport: true }"
        :observer="true"
        :observe-parents="true"
        @swiper="onSwiper"
        @slide-change="onSlideChange"
      >
        <SwiperSlide
          v-for="(item, index) in images"
          :key="index"
          class="mgc__slide"
        >
          <button
            type="button"
            class="mgc__frame"
            :aria-label="`Xem ảnh ${index + 1}`"
            @click="onSlideClick(index)"
          >
            <img
              :src="src(item)"
              :alt="`Khoảnh khắc cưới ${index + 1}`"
              loading="lazy"
              decoding="async"
              draggable="false"
            />

            <span class="mgc__corner mgc__corner--tl" aria-hidden="true"></span>
            <span class="mgc__corner mgc__corner--tr" aria-hidden="true"></span>
            <span class="mgc__corner mgc__corner--bl" aria-hidden="true"></span>
            <span class="mgc__corner mgc__corner--br" aria-hidden="true"></span>
          </button>
        </SwiperSlide>
      </Swiper>

      <!-- NEXT -->
      <button
        v-if="images.length > 1"
        type="button"
        class="mgc__arrow mgc__arrow--next"
        aria-label="Ảnh tiếp theo"
        @click="slideNext"
      >
        <v-icon size="24">mdi-chevron-right</v-icon>
      </button>
    </div>

    <!-- COUNTER -->
    <div v-if="images.length > 1" class="mgc__counter">
      <strong>{{ pad(currentIndex + 1) }}</strong>

      <span></span>

      <em>{{ pad(images.length) }}</em>
    </div>

    <!-- DOTS -->
    <div v-if="images.length > 1" class="mgc__dots">
      <button
        v-for="(_, index) in images"
        :key="index"
        type="button"
        :class="{ active: index === currentIndex }"
        :aria-label="`Đến ảnh ${index + 1}`"
        @click="slideTo(index)"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

import { Swiper, SwiperSlide } from "swiper/vue";
import { Keyboard } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";

// =========================================================
// PROPS
// =========================================================

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },

  /* Màu nhấn của theme (viền khung, dot, góc trang trí) */
  accent: {
    type: String,
    default: "#c9a45c",
  },

  /* Màu chữ counter */
  textColor: {
    type: String,
    default: "#5f4f38",
  },

  /* Nền khung ảnh (theme tối truyền màu tối) */
  frameBg: {
    type: String,
    default: "#ffffff",
  },

  /* Filter ảnh (VintageSepia dùng sepia) */
  imgFilter: {
    type: String,
    default: "none",
  },

  /* Bo góc khung */
  radius: {
    type: Number,
    default: 14,
  },
});

const emit = defineEmits(["open"]);

// =========================================================
// SWIPER
// =========================================================

const modules = [Keyboard];

const swiperRef = ref(null);

const currentIndex = ref(0);

const loopEnabled = computed(() => props.images.length > 2);

const coverflowEffect = {
  rotate: 14,
  stretch: 0,
  depth: 150,
  modifier: 2,
  slideShadows: false,
};

function onSwiper(swiper) {
  swiperRef.value = swiper;

  currentIndex.value = swiper.realIndex || 0;
}

function onSlideChange(swiper) {
  currentIndex.value = swiper.realIndex || 0;
}

function slideTo(index) {
  const swiper = swiperRef.value;

  if (!swiper || !props.images.length) {
    return;
  }

  if (loopEnabled.value) {
    swiper.slideToLoop(index);
  } else {
    swiper.slideTo(index);
  }
}

function slidePrev() {
  swiperRef.value?.slidePrev();
}

function slideNext() {
  swiperRef.value?.slideNext();
}

function onSlideClick(index) {
  if (index === currentIndex.value) {
    emit("open", index);

    return;
  }

  slideTo(index);
}

// =========================================================
// HELPERS
// =========================================================

function src(item) {
  if (typeof item === "string") {
    return item;
  }

  return item?.Url || item?.Image || item?.Src || item?.ImageUrl || "";
}

function pad(number) {
  return String(number).padStart(2, "0");
}

function hexToRgba(hex, alpha) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");

  if (!match) {
    return hex;
  }

  return `rgba(${parseInt(match[1], 16)}, ${parseInt(match[2], 16)}, ${parseInt(match[3], 16)}, ${alpha})`;
}

const cssVars = computed(() => ({
  "--mgc-accent": props.accent,
  "--mgc-accent-soft": hexToRgba(props.accent, 0.55),
  "--mgc-accent-faint": hexToRgba(props.accent, 0.3),
  "--mgc-text": props.textColor,
  "--mgc-frame-bg": props.frameBg,
  "--mgc-img-filter": props.imgFilter,
  "--mgc-radius": `${props.radius}px`,
}));
</script>

<style scoped>
/* =========================================================
   ROOT
========================================================= */

.mgc {
  position: relative;

  width: 100%;

  user-select: none;
}

/* =========================================================
   STAGE
========================================================= */

.mgc__stage {
  position: relative;

  width: 100%;
}

.mgc__swiper {
  width: 100%;

  padding: 14px 0 20px;

  overflow: hidden;
}

.mgc__slide {
  width: min(70vw, 400px);

  aspect-ratio: 4 / 5;

  -webkit-tap-highlight-color: transparent;
}

/* =========================================================
   FRAME
========================================================= */

.mgc__frame {
  position: relative;

  display: block;

  width: 100%;
  height: 100%;

  padding: 7px;

  border: 1px solid var(--mgc-accent-soft);
  border-radius: var(--mgc-radius);

  background: var(--mgc-frame-bg);

  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.18);

  overflow: hidden;

  cursor: pointer;

  appearance: none;

  -webkit-tap-highlight-color: transparent;
}

.mgc__frame img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  border-radius: calc(var(--mgc-radius) - 5px);

  filter: var(--mgc-img-filter);

  pointer-events: none;
}

/* Góc trang trí */

.mgc__corner {
  position: absolute;

  z-index: 3;

  width: 16px;
  height: 16px;

  border-color: var(--mgc-accent);
  border-style: solid;

  pointer-events: none;
}

.mgc__corner--tl {
  top: 3px;
  left: 3px;

  border-width: 1px 0 0 1px;
}

.mgc__corner--tr {
  top: 3px;
  right: 3px;

  border-width: 1px 1px 0 0;
}

.mgc__corner--bl {
  bottom: 3px;
  left: 3px;

  border-width: 0 0 1px 1px;
}

.mgc__corner--br {
  right: 3px;
  bottom: 3px;

  border-width: 0 1px 1px 0;
}

/* =========================================================
   ARROWS
========================================================= */

.mgc__arrow {
  position: absolute;

  top: 50%;

  z-index: 30;

  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  transform: translateY(-50%);

  color: var(--mgc-text);

  border: 1px solid var(--mgc-accent-soft);
  border-radius: 50%;

  background: var(--mgc-frame-bg);

  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.14);

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;

  -webkit-tap-highlight-color: transparent;
}

.mgc__arrow:hover {
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.2);
}

.mgc__arrow--prev {
  left: 10px;
}

.mgc__arrow--prev:hover {
  transform: translate(-3px, -50%);
}

.mgc__arrow--next {
  right: 10px;
}

.mgc__arrow--next:hover {
  transform: translate(3px, -50%);
}

/* =========================================================
   COUNTER
========================================================= */

.mgc__counter {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 9px;

  margin-top: 4px;

  color: var(--mgc-text);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 14px;

  letter-spacing: 0.14em;
}

.mgc__counter strong {
  color: var(--mgc-accent);

  font-size: 17px;
  font-weight: 600;
}

.mgc__counter em {
  font-style: normal;

  opacity: 0.55;
}

.mgc__counter span {
  width: 22px;
  height: 1px;

  background: var(--mgc-accent-soft);
}

/* =========================================================
   DOTS
========================================================= */

.mgc__dots {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  margin-top: 14px;
}

.mgc__dots button {
  width: 6px;
  height: 6px;

  padding: 0;

  border: 0;
  border-radius: 999px;

  background: var(--mgc-accent-faint);

  cursor: pointer;

  transition: width 0.35s ease, background 0.35s ease;
}

.mgc__dots button.active {
  width: 24px;

  background: var(--mgc-accent);
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 700px) {
  .mgc__slide {
    width: 72vw;
  }

  .mgc__arrow {
    width: 36px;
    height: 36px;
  }

  .mgc__arrow--prev {
    left: 4px;
  }

  .mgc__arrow--next {
    right: 4px;
  }

  .mgc__arrow .v-icon {
    font-size: 20px !important;
  }
}

@media (max-width: 430px) {
  .mgc__slide {
    width: 76vw;
  }

  .mgc__frame {
    padding: 5px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .mgc__swiper {
    --swiper-speed: 0;
  }

  .mgc__arrow,
  .mgc__dots button {
    transition: none;
  }
}
</style>
