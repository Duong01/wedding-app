<template>
  <!--
    Album ảnh nhiều kiểu hiển thị — dùng chung mọi mẫu thiệp.

    Mỗi mẫu truyền màu của mình (accent / textColor /
    frameBg / imgFilter / radius) nên mọi kiểu đều mang
    phong cách của thiệp. Bấm ảnh → emit("open", index) để
    mẫu mở GalleryModal như trước.

    layout: coverflow · cards · ring · polaroid · filmstrip
            · masonry · mosaic   (xem data/galleryLayouts.js)
  -->
  <div class="gs" :class="`gs--${activeLayout}`" :style="cssVars">
    <!-- ===================================================
         3D COVERFLOW (component có sẵn)
    ==================================================== -->
    <ModernGalleryCarousel
      v-if="activeLayout === 'coverflow'"
      :images="images"
      :accent="accent"
      :text-color="textColor"
      :frame-bg="frameBg"
      :img-filter="imgFilter"
      :radius="radius"
      @open="(index) => emit('open', index)"
    />

    <!-- ===================================================
         THẺ XẾP CHỒNG (Swiper EffectCards)
    ==================================================== -->
    <div v-else-if="activeLayout === 'cards'" class="gs-cards">
      <Swiper
        class="gs-cards__swiper"
        :modules="cardModules"
        effect="cards"
        :grab-cursor="true"
        :rewind="true"
        :autoplay="cardsAutoplay"
        :cards-effect="{ perSlideOffset: 9, perSlideRotate: 3, slideShadows: false }"
        :keyboard="{ enabled: true, onlyInViewport: true }"
        :observer="true"
        :observe-parents="true"
        @swiper="(swiper) => (cardSwiper = swiper)"
        @slide-change="(swiper) => (current = swiper.activeIndex)"
      >
        <SwiperSlide
          v-for="(item, index) in images"
          :key="index"
          class="gs-cards__slide"
        >
          <button
            type="button"
            class="gs-frame gs-cards__frame"
            :aria-label="`Xem ảnh ${index + 1}`"
            @click="index === current ? emit('open', index) : cardSwiper?.slideTo(index)"
          >
            <img :src="src(item)" :alt="`Khoảnh khắc cưới ${index + 1}`" loading="lazy" decoding="async" draggable="false" />
          </button>
        </SwiperSlide>
      </Swiper>

      <div class="gs-nav">
        <button type="button" class="gs-nav__btn" aria-label="Ảnh trước" :disabled="current === 0" @click="cardSwiper?.slidePrev()">
          <v-icon size="20">mdi-chevron-left</v-icon>
        </button>

        <span class="gs-counter"><strong>{{ pad(current + 1) }}</strong> / {{ pad(images.length) }}</span>

        <button type="button" class="gs-nav__btn" aria-label="Ảnh tiếp theo" :disabled="current >= images.length - 1" @click="cardSwiper?.slideNext()">
          <v-icon size="20">mdi-chevron-right</v-icon>
        </button>
      </div>

      <p class="gs-hint">Vuốt sang để lật ảnh · chạm ảnh để xem lớn</p>
    </div>

    <!-- ===================================================
         VÒNG XOAY 3D
    ==================================================== -->
    <div
      v-else-if="activeLayout === 'ring'"
      ref="ringStageRef"
      class="gs-ring"
      @pointerdown="onRingDown"
      @pointermove="onRingMove"
      @pointerup="onRingUp"
      @pointercancel="onRingUp"
      @pointerleave="onRingUp"
    >
      <div class="gs-ring__scene">
        <div
          class="gs-ring__carousel"
          :class="{ 'is-dragging': ringDragging }"
          :style="{ transform: `translateZ(${-ringRadius}px) rotateY(${ringAngle}deg)` }"
        >
          <button
            v-for="(item, index) in images"
            :key="index"
            type="button"
            class="gs-frame gs-ring__panel"
            :class="{ 'is-front': index === ringIndex }"
            :style="ringPanelStyle(index)"
            :aria-label="`Xem ảnh ${index + 1}`"
            @click="onRingClick(index)"
          >
            <img :src="src(item)" :alt="`Khoảnh khắc cưới ${index + 1}`" loading="lazy" decoding="async" draggable="false" />
          </button>
        </div>
      </div>

      <div class="gs-nav">
        <button type="button" class="gs-nav__btn" aria-label="Ảnh trước" @click="ringStep(-1)">
          <v-icon size="20">mdi-chevron-left</v-icon>
        </button>

        <span class="gs-counter"><strong>{{ pad(ringIndex + 1) }}</strong> / {{ pad(images.length) }}</span>

        <button type="button" class="gs-nav__btn" aria-label="Ảnh tiếp theo" @click="ringStep(1)">
          <v-icon size="20">mdi-chevron-right</v-icon>
        </button>
      </div>
    </div>

    <!-- ===================================================
         CUỘN PHIM
    ==================================================== -->
    <div v-else-if="activeLayout === 'filmstrip'" class="gs-film">
      <div
        ref="filmRef"
        class="gs-film__track"
        @scroll.passive="onFilmScroll"
        @pointerdown="pauseFilm"
        @touchstart.passive="pauseFilm"
        @wheel.passive="pauseFilm"
      >
        <button
          v-for="(item, index) in images"
          :key="index"
          type="button"
          class="gs-film__frame"
          :aria-label="`Xem ảnh ${index + 1}`"
          @click="emit('open', index)"
        >
          <img :src="src(item)" :alt="`Khoảnh khắc cưới ${index + 1}`" loading="lazy" decoding="async" draggable="false" />

          <span class="gs-film__no">{{ pad(index + 1) }}</span>
        </button>
      </div>

      <div class="gs-nav">
        <button type="button" class="gs-nav__btn" aria-label="Ảnh trước" @click="filmStep(-1)">
          <v-icon size="20">mdi-chevron-left</v-icon>
        </button>

        <span class="gs-counter"><strong>{{ pad(current + 1) }}</strong> / {{ pad(images.length) }}</span>

        <button type="button" class="gs-nav__btn" aria-label="Ảnh tiếp theo" @click="filmStep(1)">
          <v-icon size="20">mdi-chevron-right</v-icon>
        </button>
      </div>
    </div>

    <!-- ===================================================
         LƯỚI: POLAROID · MASONRY · MOSAIC
    ==================================================== -->
    <template v-else>
      <div :class="`gs-${activeLayout}`">
        <button
          v-for="(item, index) in visibleImages"
          :key="index"
          type="button"
          class="gs-tile"
          :class="tileClass(index)"
          :style="activeLayout === 'polaroid' ? polaroidStyle(index) : null"
          :aria-label="`Xem ảnh ${index + 1}`"
          @click="emit('open', index)"
        >
          <span class="gs-tile__photo">
            <img :src="src(item)" :alt="`Khoảnh khắc cưới ${index + 1}`" loading="lazy" decoding="async" draggable="false" />
          </span>

          <span v-if="activeLayout === 'polaroid'" class="gs-polaroid__caption">♥ {{ pad(index + 1) }}</span>
        </button>
      </div>

      <button
        v-if="hiddenCount > 0"
        type="button"
        class="gs-more"
        @click="expanded = true"
      >
        Xem thêm {{ hiddenCount }} ảnh
      </button>
    </template>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, EffectCards, Keyboard } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-cards";

import ModernGalleryCarousel from "@/components/gallery/ModernGalleryCarousel.vue";

const props = defineProps({
  images: { type: Array, default: () => [] },

  /* coverflow · cards · ring · polaroid · filmstrip · masonry · mosaic */
  layout: { type: String, default: "coverflow" },

  /* Màu nhấn của mẫu (viền, nút, số đếm) — mọi giá trị màu CSS */
  accent: { type: String, default: "#c9a45c" },

  /* Màu chữ (số đếm, chú thích) */
  textColor: { type: String, default: "#5f4f38" },

  /* Nền khung ảnh / giấy polaroid */
  frameBg: { type: String, default: "#ffffff" },

  imgFilter: { type: String, default: "none" },

  radius: { type: Number, default: 14 },
});

const emit = defineEmits(["open"]);

const LAYOUTS = ["coverflow", "cards", "ring", "polaroid", "filmstrip", "masonry", "mosaic"];

/*
 * Vòng xoay cần ≥ 3 ảnh mới thành vòng — ít hơn thì dùng
 * coverflow cho khỏi trơ trọi.
 */
const activeLayout = computed(() => {
  const value = LAYOUTS.includes(props.layout) ? props.layout : "coverflow";

  return value === "ring" && props.images.length < 3 ? "coverflow" : value;
});

const current = ref(0);

/* Khách bật giảm chuyển động → không tự chuyển ảnh / tự xoay */
const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

watch(activeLayout, () => {
  current.value = 0;
  expanded.value = false;
});

/* =========================================================
   THẺ XẾP CHỒNG
========================================================= */

const cardModules = [EffectCards, Keyboard, Autoplay];

/* Tự lật thẻ mỗi 3.2s — khách vuốt thì tạm dừng rồi chạy tiếp */
const cardsAutoplay = computed(() =>
  !reducedMotion && props.images.length > 1
    ? { delay: 3200, disableOnInteraction: false, pauseOnMouseEnter: true }
    : false
);

const cardSwiper = ref(null);

/* =========================================================
   LƯỚI (polaroid / masonry / mosaic) — gọn 9 ảnh đầu
========================================================= */

/* 10 = 2 nhịp mosaic trọn vẹn */
const GRID_LIMIT = 10;

const expanded = ref(false);

const visibleImages = computed(() =>
  expanded.value ? props.images : props.images.slice(0, GRID_LIMIT)
);

const hiddenCount = computed(() =>
  expanded.value ? 0 : Math.max(0, props.images.length - GRID_LIMIT)
);

const POLAROID_TILT = [-4, 3, -2, 5, -5, 2, 4, -3, 1];

function polaroidStyle(index) {
  return { "--tilt": `${POLAROID_TILT[index % POLAROID_TILT.length]}deg` };
}

function tileClass(index) {
  if (activeLayout.value !== "mosaic") {
    return null;
  }

  /*
   * Nhịp 5 ô vừa khít 3 hàng × 3 cột:
   *   [ lớn 2×2 ][ nhỏ ]
   *   [        ][ nhỏ ]
   *   [ nhỏ ][ ngang 2×1 ]
   * Nhịp cuối thiếu ảnh thì đổi cỡ ô để hàng cuối không
   * trống chỗ (1 ảnh → full hàng, 2 ảnh → ngang + nhỏ...).
   */
  const pos = index % 5;

  const remain = Math.min(5, visibleImages.value.length - (index - pos));

  const big = pos === 0 && remain >= 3;

  const wide = (remain === 5 && pos === 4) || (remain === 2 && pos === 0);

  const full = (remain === 4 && pos === 3) || remain === 1;

  return { "gs-tile--big": big, "gs-tile--wide": wide, "gs-tile--full": full };
}

/* =========================================================
   VÒNG XOAY 3D
========================================================= */

const ringStageRef = ref(null);

const ringAngle = ref(0);

const ringDragging = ref(false);

const panelWidth = ref(200);

const step = computed(() => 360 / Math.max(1, props.images.length));

/*
 * Bán kính vừa khít các tấm cạnh nhau quanh vòng (+ khe).
 */
const ringRadius = computed(() => {
  const n = Math.max(3, props.images.length);

  return Math.round((panelWidth.value / 2 + 10) / Math.tan(Math.PI / n));
});

const ringIndex = computed(() => {
  const n = props.images.length;

  if (!n) {
    return 0;
  }

  return ((Math.round(-ringAngle.value / step.value) % n) + n) % n;
});

function ringPanelStyle(index) {
  /*
   * Tấm càng quay ra sau càng mờ — mặt trước nổi bật.
   */
  const facing = Math.cos(((index * step.value + ringAngle.value) * Math.PI) / 180);

  return {
    transform: `rotateY(${index * step.value}deg) translateZ(${ringRadius.value}px)`,
    opacity: (0.35 + 0.65 * Math.max(0, facing)).toFixed(3),
  };
}

function ringSnap() {
  ringAngle.value = Math.round(ringAngle.value / step.value) * step.value;
}

function ringStep(direction) {
  ringSnap();

  ringAngle.value -= direction * step.value;

  restartAuto();
}

function onRingClick(index) {
  if (ringMoved) {
    return;
  }

  if (index === ringIndex.value) {
    emit("open", index);

    return;
  }

  /* Quay đường ngắn nhất tới tấm được chọn */
  const n = props.images.length;

  let diff = (index - ringIndex.value) % n;

  if (diff > n / 2) diff -= n;
  if (diff < -n / 2) diff += n;

  ringStep(diff);
}

let ringStartX = 0;
let ringStartAngle = 0;
let ringMoved = false;
let ringPointer = null;

function onRingDown(event) {
  ringPointer = event.pointerId;
  ringStartX = event.clientX;
  ringStartAngle = ringAngle.value;
  ringMoved = false;
  ringDragging.value = true;

  stopAuto();
}

function onRingMove(event) {
  if (!ringDragging.value || event.pointerId !== ringPointer) {
    return;
  }

  const dx = event.clientX - ringStartX;

  if (Math.abs(dx) > 6) {
    ringMoved = true;
  }

  ringAngle.value = ringStartAngle + dx * 0.35;
}

function onRingUp(event) {
  if (!ringDragging.value || (event && event.pointerId !== ringPointer)) {
    return;
  }

  ringDragging.value = false;

  ringSnap();

  restartAuto();

  /* Chặn click sinh ra ngay sau khi kéo */
  setTimeout(() => {
    ringMoved = false;
  }, 0);
}

/* Tự xoay chậm — tắt khi khách bật giảm chuyển động */
let autoTimer = null;

function stopAuto() {
  clearInterval(autoTimer);

  autoTimer = null;
}

function restartAuto() {
  stopAuto();

  if (reducedMotion || activeLayout.value !== "ring") {
    return;
  }

  autoTimer = setInterval(() => {
    if (!document.hidden) {
      ringAngle.value -= step.value;
    }
  }, 3600);
}

function measureRing() {
  const width = ringStageRef.value?.clientWidth || 360;

  panelWidth.value = Math.round(Math.min(220, Math.max(130, width * 0.46)));
}

watch(activeLayout, (value) => {
  ringAngle.value = 0;

  if (value === "filmstrip") {
    startFilm();
  } else {
    stopFilm();
  }

  if (value === "ring") {
    requestAnimationFrame(measureRing);

    restartAuto();
  } else {
    stopAuto();
  }
});

/* =========================================================
   CUỘN PHIM
========================================================= */

const filmRef = ref(null);

function onFilmScroll() {
  const track = filmRef.value;

  const frame = track?.firstElementChild;

  if (!frame) {
    return;
  }

  current.value = Math.min(
    props.images.length - 1,
    Math.round(track.scrollLeft / frame.offsetWidth)
  );
}

/*
 * Tự chạy dải phim: mỗi 3.2s sang khung kế, tới cuối thì
 * quay về khung đầu. Khách chạm / cuộn / bấm nút → nghỉ 6s.
 */
let filmTimer = null;
let filmResume = null;

function startFilm() {
  stopFilm();

  if (reducedMotion || activeLayout.value !== "filmstrip" || props.images.length < 2) {
    return;
  }

  filmTimer = setInterval(() => {
    if (document.hidden) {
      return;
    }

    const track = filmRef.value;

    if (!track) {
      return;
    }

    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;

    if (atEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      filmStep(1, true);
    }
  }, 3200);
}

function stopFilm() {
  clearInterval(filmTimer);
  clearTimeout(filmResume);

  filmTimer = null;
}

function pauseFilm() {
  stopFilm();

  filmResume = setTimeout(startFilm, 6000);
}

function filmStep(direction, auto = false) {
  if (!auto) {
    pauseFilm();
  }

  const track = filmRef.value;

  const frame = track?.firstElementChild;

  if (!frame) {
    return;
  }

  track.scrollBy({ left: direction * frame.offsetWidth, behavior: "smooth" });
}

/* =========================================================
   VÒNG ĐỜI
========================================================= */

onMounted(() => {
  if (activeLayout.value === "filmstrip") {
    startFilm();
  }

  if (activeLayout.value === "ring") {
    measureRing();

    restartAuto();
  }

  window.addEventListener("resize", measureRing);
});

onBeforeUnmount(() => {
  stopAuto();
  stopFilm();

  window.removeEventListener("resize", measureRing);
});

/* =========================================================
   HELPERS
========================================================= */

function src(item) {
  if (typeof item === "string") {
    return item;
  }

  return item?.Url || item?.Image || item?.Src || item?.ImageUrl || "";
}

function pad(number) {
  return String(number).padStart(2, "0");
}

const cssVars = computed(() => ({
  "--gs-accent": props.accent,
  "--gs-text": props.textColor,
  "--gs-frame-bg": props.frameBg,
  "--gs-img-filter": props.imgFilter,
  "--gs-radius": `${props.radius}px`,
  "--gs-panel-w": `${panelWidth.value}px`,
}));
</script>

<style scoped>
.gs {
  /* Biến thể nhạt của màu nhấn — color-mix chạy với mọi màu CSS (kể cả var()) */
  --gs-accent-soft: color-mix(in srgb, var(--gs-accent) 55%, transparent);
  --gs-accent-faint: color-mix(in srgb, var(--gs-accent) 22%, transparent);

  position: relative;

  width: 100%;

  user-select: none;
}

/* =========================================================
   KHUNG ẢNH CHUNG
========================================================= */

.gs-frame {
  position: relative;

  display: block;

  width: 100%;
  height: 100%;

  padding: 6px;

  border: 1px solid var(--gs-accent-soft);
  border-radius: var(--gs-radius);

  background: var(--gs-frame-bg);

  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);

  overflow: hidden;

  cursor: pointer;

  appearance: none;

  -webkit-tap-highlight-color: transparent;
}

.gs-frame img,
.gs-tile__photo img,
.gs-film__frame img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  filter: var(--gs-img-filter);

  pointer-events: none;
}

.gs-frame img {
  border-radius: calc(var(--gs-radius) - 4px);
}

/* =========================================================
   ĐIỀU HƯỚNG + SỐ ĐẾM
========================================================= */

.gs-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;

  margin-top: 16px;
}

.gs-nav__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 38px;
  height: 38px;

  color: var(--gs-accent);

  border: 1px solid var(--gs-accent-soft);
  border-radius: 50%;

  background: color-mix(in srgb, var(--gs-frame-bg) 80%, transparent);

  cursor: pointer;

  transition: transform 0.2s ease, opacity 0.2s ease;
}

.gs-nav__btn:hover:not(:disabled) {
  transform: scale(1.08);
}

.gs-nav__btn:disabled {
  opacity: 0.35;

  cursor: default;
}

.gs-counter {
  min-width: 64px;

  color: var(--gs-text);

  font-size: 13px;
  letter-spacing: 0.12em;

  text-align: center;
}

.gs-counter strong {
  color: var(--gs-accent);

  font-size: 16px;
}

.gs-hint {
  margin: 10px 0 0;

  color: var(--gs-text);

  font-size: 11px;
  letter-spacing: 0.06em;

  text-align: center;

  opacity: 0.75;
}

/* =========================================================
   THẺ XẾP CHỒNG
========================================================= */

.gs-cards {
  padding: 18px 0 6px;
}

.gs-cards__swiper {
  width: min(68vw, 300px);

  aspect-ratio: 4 / 5;

  overflow: visible;
}

.gs-cards__slide {
  border-radius: var(--gs-radius);
}

/* =========================================================
   VÒNG XOAY 3D
========================================================= */

.gs-ring {
  padding: 10px 0 4px;

  touch-action: pan-y;

  cursor: grab;
}

.gs-ring__scene {
  position: relative;

  width: var(--gs-panel-w);

  aspect-ratio: 4 / 5;

  margin: 24px auto;

  perspective: 1100px;
}

.gs-ring__carousel {
  position: absolute;
  inset: 0;

  transform-style: preserve-3d;

  transition: transform 0.8s cubic-bezier(0.22, 0.7, 0.2, 1);
}

.gs-ring__carousel.is-dragging {
  transition: none;
}

.gs-ring__panel {
  position: absolute;
  inset: 0;

  transition: opacity 0.6s ease, box-shadow 0.4s ease;

  /* Mặt sau vẫn thấy (vòng tròn trọn vẹn) */
  backface-visibility: visible;
}

.gs-ring__panel.is-front {
  box-shadow: 0 22px 48px rgba(0, 0, 0, 0.28), 0 0 0 2px var(--gs-accent-soft);
}

/* =========================================================
   CUỘN PHIM — dải phim tối có lỗ răng cưa 2 mép
========================================================= */

.gs-film__track {
  --hole: rgba(255, 255, 255, 0.82);

  display: flex;

  gap: 0;

  padding: 26px 0;

  overflow-x: auto;

  scroll-snap-type: x mandatory;

  scrollbar-width: none;

  border-radius: 6px;

  background:
    repeating-linear-gradient(90deg, transparent 0 9px, var(--hole) 9px 19px, transparent 19px 28px) top 8px left 0 / 100% 10px no-repeat,
    repeating-linear-gradient(90deg, transparent 0 9px, var(--hole) 9px 19px, transparent 19px 28px) bottom 8px left 0 / 100% 10px no-repeat,
    #17120f;

  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.25);
}

.gs-film__track::-webkit-scrollbar {
  display: none;
}

.gs-film__frame {
  position: relative;

  flex: 0 0 min(64vw, 270px);

  aspect-ratio: 4 / 5;

  margin: 0 6px;

  padding: 0;

  border: 0;
  border-radius: 3px;

  background: #000;

  overflow: hidden;

  scroll-snap-align: center;

  cursor: pointer;
}

.gs-film__frame:first-child {
  margin-left: calc(50% - min(32vw, 135px));
}

.gs-film__frame:last-child {
  margin-right: calc(50% - min(32vw, 135px));
}

.gs-film__no {
  position: absolute;
  right: 8px;
  bottom: 6px;

  color: #f5c46b;

  font-family: "Courier New", monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;

  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

/* =========================================================
   Ô LƯỚI CHUNG
========================================================= */

.gs-tile {
  position: relative;

  display: block;

  width: 100%;

  padding: 0;

  border: 0;

  background: transparent;

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;
}

.gs-tile__photo {
  display: block;

  width: 100%;
  height: 100%;

  overflow: hidden;
}

.gs-more {
  display: block;

  margin: 18px auto 0;

  padding: 9px 22px;

  color: var(--gs-accent);

  border: 1px solid var(--gs-accent-soft);
  border-radius: 999px;

  background: transparent;

  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;

  cursor: pointer;
}

/* =========================================================
   POLAROID
========================================================= */

.gs-polaroid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px 16px;

  padding: 12px 6px;
}

.gs-polaroid .gs-tile {
  padding: 9px 9px 0;

  background: var(--gs-frame-bg);

  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.18);

  transform: rotate(var(--tilt, 0deg));

  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.gs-polaroid .gs-tile:hover,
.gs-polaroid .gs-tile:focus-visible {
  z-index: 2;

  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.26);

  transform: rotate(0deg) scale(1.04);
}

/* Ảnh vuông + chú thích nằm trọn trong giấy (không kéo giãn theo hàng lưới) */
.gs-polaroid .gs-tile {
  align-self: start;
}

.gs-polaroid .gs-tile__photo {
  height: auto;

  aspect-ratio: 1;
}

.gs-polaroid__caption {
  display: block;

  padding: 9px 0 11px;

  color: var(--gs-text);

  font-family: var(--font-script, "Great Vibes", cursive);
  font-size: 15px;

  text-align: center;
}

/* =========================================================
   MASONRY
========================================================= */

.gs-masonry {
  column-count: 2;
  column-gap: 10px;
}

.gs-masonry .gs-tile {
  margin-bottom: 10px;

  break-inside: avoid;

  border: 1px solid var(--gs-accent-faint);
  border-radius: var(--gs-radius);

  overflow: hidden;
}

.gs-masonry .gs-tile__photo img {
  height: auto;

  transition: transform 0.5s ease;
}

.gs-masonry .gs-tile:hover .gs-tile__photo img {
  transform: scale(1.05);
}

/* =========================================================
   MOSAIC
========================================================= */

.gs-mosaic {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: clamp(92px, 27vw, 170px);
  grid-auto-flow: dense;
  gap: 8px;
}

.gs-mosaic .gs-tile {
  height: 100%;

  border-radius: calc(var(--gs-radius) - 4px);

  overflow: hidden;

  box-shadow: inset 0 0 0 1px var(--gs-accent-faint);
}

.gs-mosaic .gs-tile--big {
  grid-column: span 2;
  grid-row: span 2;
}

.gs-mosaic .gs-tile--wide {
  grid-column: span 2;
}

.gs-mosaic .gs-tile--full {
  grid-column: 1 / -1;
}

.gs-mosaic .gs-tile__photo img {
  transition: transform 0.5s ease;
}

.gs-mosaic .gs-tile:hover .gs-tile__photo img {
  transform: scale(1.06);
}

/* =========================================================
   MÀN HÌNH RỘNG
========================================================= */

@media (min-width: 768px) {
  .gs-masonry {
    column-count: 3;
  }

  .gs-polaroid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .gs-ring__carousel,
  .gs-polaroid .gs-tile,
  .gs-masonry .gs-tile__photo img,
  .gs-mosaic .gs-tile__photo img {
    transition: none;
  }
}
</style>
